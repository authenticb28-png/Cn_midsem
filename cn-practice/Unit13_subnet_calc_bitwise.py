"""Unit 13 - IPv4 subnet calculator using ONLY bitwise operations (low level).

COVERAGE rows: 13.2 (decimal <-> binary octets), 13.3 (classful A/B/C/D/E),
13.6 (network / broadcast / first / last by AND / OR), 13.7 (CIDR table /8 to /32),
13.8 (sizing a network for N hosts), 13.10 (VPC math, AWS -5 vs generic -2),
13.11 (supernetting: aggregation check).

No ipaddress module here: every value is computed with <<, >>, &, |, ~ on a
32-bit integer, exactly the way you do it on paper in the exam.

Run:  python3 Unit13_subnet_calc_bitwise.py
"""

MASK32 = 0xFFFFFFFF  # 32 one-bits; Python ints are unbounded, so we AND with this to stay 32-bit


# ---------------------------------------------------------------- conversions
def dotted_to_int(s):
    """'192.168.0.1' -> 3232235521 by shifting each octet into place."""
    parts = [int(p) for p in s.split(".")]
    assert len(parts) == 4 and all(0 <= p <= 255 for p in parts), "bad dotted quad"
    value = 0
    for p in parts:
        value = (value << 8) | p  # make room for 8 bits, then OR the octet in
    return value


def int_to_dotted(n):
    """3232235521 -> '192.168.0.1' by shifting right and masking 8 bits at a time."""
    return ".".join(str((n >> shift) & 0xFF) for shift in (24, 16, 8, 0))


def octet_to_binary(o):
    """Positional binary of one octet, weights 128 64 32 16 8 4 2 1."""
    bits = ""
    for weight in (128, 64, 32, 16, 8, 4, 2, 1):
        if o >= weight:          # the classic subtraction method
            bits += "1"
            o -= weight
        else:
            bits += "0"
    return bits


def dotted_to_binary(s):
    return ".".join(octet_to_binary(int(p)) for p in s.split("."))


def mask_from_prefix(n):
    """/n -> 32-bit mask: n ones followed by (32-n) zeros."""
    return (MASK32 << (32 - n)) & MASK32


def prefix_from_mask(mask_int):
    """Count the 1-bits; also check they are contiguous (a valid mask)."""
    n = bin(mask_int).count("1")
    assert mask_from_prefix(n) == mask_int, "mask ones are not contiguous"
    return n


# ---------------------------------------------------------------- classful
def ip_class(s):
    """Class from the leading bits of the first octet."""
    first = dotted_to_int(s) >> 24
    if first >> 7 == 0b0:
        return "A"      # 0xxxxxxx  -> 0..127
    if first >> 6 == 0b10:
        return "B"      # 10xxxxxx  -> 128..191
    if first >> 5 == 0b110:
        return "C"      # 110xxxxx  -> 192..223
    if first >> 4 == 0b1110:
        return "D"      # 1110xxxx  -> 224..239 multicast
    return "E"          # 1111xxxx  -> 240..255 reserved


CLASS_PREFIX = {"A": 8, "B": 16, "C": 24}


def classful_split(s):
    """Network ID | Host ID under classful rules (A, B, C only)."""
    c = ip_class(s)
    n = CLASS_PREFIX[c]
    octets = s.split(".")
    k = n // 8
    return ".".join(octets[:k]), ".".join(octets[k:])


# ---------------------------------------------------------------- CIDR calculator
def cidr_info(cidr):
    ip_s, n_s = cidr.split("/")
    n = int(n_s)
    ip = dotted_to_int(ip_s)
    mask = mask_from_prefix(n)
    network = ip & mask                         # host bits forced to 0
    broadcast = network | (~mask & MASK32)      # host bits forced to 1
    total = 1 << (32 - n)                        # 2^(32-n)
    if n == 32:
        usable, first, last = 1, network, network          # single-host route
    elif n == 31:
        usable, first, last = 2, network, broadcast        # RFC 3021 point-to-point link
    else:
        usable, first, last = total - 2, network + 1, broadcast - 1
    return {
        "mask": int_to_dotted(mask), "network": int_to_dotted(network),
        "broadcast": int_to_dotted(broadcast), "first": int_to_dotted(first),
        "last": int_to_dotted(last), "total": total, "usable": usable,
    }


def host_bits_for(n_hosts, reserved=2):
    """Smallest h with 2^h - reserved >= n_hosts (reserved = 2 generic, 5 in AWS)."""
    h = 0
    while (1 << h) - reserved < n_hosts:
        h += 1
    return h


def aws_usable(prefix):
    assert 16 <= prefix <= 28, "AWS subnets must be /16 to /28"
    return (1 << (32 - prefix)) - 5


# ---------------------------------------------------------------- supernetting
def can_aggregate(networks):
    """True and the summary if the /n blocks are contiguous, a power of 2 in count and aligned."""
    nets = sorted((dotted_to_int(c.split("/")[0]), int(c.split("/")[1])) for c in networks)
    n = nets[0][1]
    assert all(p == n for _, p in nets), "all blocks must have the same prefix"
    count = len(nets)
    if count & (count - 1):                       # power-of-two test: 4 = 100, 3 = 011
        return False, "count %d is not a power of 2" % count
    size = 1 << (32 - n)
    for i in range(1, count):
        if nets[i][0] != nets[i - 1][0] + size:   # each block must start where the last ended
            return False, "blocks are not contiguous"
    k = count.bit_length() - 1                    # log2(count) bits are given back
    new_n = n - k
    if nets[0][0] & ~mask_from_prefix(new_n) & MASK32:   # first block must sit on a /new_n boundary
        return False, "first block is not aligned on a /%d boundary" % new_n
    return True, "%s/%d" % (int_to_dotted(nets[0][0]), new_n)


# ---------------------------------------------------------------- demo + self-test
if __name__ == "__main__":
    print("== 13.2 decimal <-> binary ==")
    print("192.168.0.1 =", dotted_to_binary("192.168.0.1"))
    assert dotted_to_binary("192.168.0.1") == "11000000.10101000.00000000.00000001"
    assert int("11000000", 2) == 192 and int("10101000", 2) == 168
    assert dotted_to_int("192.168.0.1") == 3232235521
    assert int_to_dotted(3232235521) == "192.168.0.1"

    print("\n== 13.3 classful ==")
    for ip in ("9.10.10.10", "172.16.1.10", "192.168.0.1", "224.0.0.5", "250.1.1.1"):
        print(ip, "-> class", ip_class(ip))
    assert [ip_class(x) for x in ("9.10.10.10", "172.16.1.10", "192.168.0.1", "224.0.0.5", "250.1.1.1")] == ["A", "B", "C", "D", "E"]
    net_id, host_id = classful_split("172.16.1.10")
    print("172.16.1.10 classful split: Network", net_id, "| Host", host_id, "(slide fix B4)")
    assert (net_id, host_id) == ("172.16", "1.10")
    # networks and hosts per class (general formula 2^(network bits), 2^(host bits) - 2)
    assert (2 ** 7, 2 ** 24 - 2) == (128, 16777214)       # class A (126 usable networks: 0 and 127 excluded)
    assert (2 ** 14, 2 ** 16 - 2) == (16384, 65534)       # class B (slide fix B7)
    assert (2 ** 21, 2 ** 8 - 2) == (2097152, 254)        # class C

    print("\n== 13.6 CIDR calculator: 192.168.1.0/24 ==")
    info = cidr_info("192.168.1.0/24")
    for k in ("mask", "network", "broadcast", "first", "last", "total", "usable"):
        print("  %-9s %s" % (k, info[k]))
    assert info == {"mask": "255.255.255.0", "network": "192.168.1.0", "broadcast": "192.168.1.255",
                    "first": "192.168.1.1", "last": "192.168.1.254", "total": 256, "usable": 254}
    assert cidr_info("192.168.0.1/24")["network"] == "192.168.0.0"    # slide fix B6
    g = cidr_info("192.168.10.138/27")
    assert (g["network"], g["first"], g["last"], g["broadcast"], g["usable"]) == \
        ("192.168.10.128", "192.168.10.129", "192.168.10.158", "192.168.10.159", 30)

    print("\n== 13.7 CIDR table /8 to /32 ==")
    print("%-4s %-16s %-11s %s" % ("/n", "mask", "addresses", "usable(-2)"))
    for n in range(8, 33):
        c = cidr_info("10.0.0.0/%d" % n)
        print("/%-3d %-16s %-11d %d" % (n, c["mask"], c["total"], c["usable"]))
    assert cidr_info("10.0.0.0/12")["mask"] == "255.240.0.0"
    assert cidr_info("10.0.0.0/27")["usable"] == 2 ** (32 - 27) - 2 == 30
    assert prefix_from_mask(dotted_to_int("255.255.254.0")) == 23

    print("\n== 13.8 sizing for 500 hosts ==")
    h = host_bits_for(500)
    print("host bits", h, "-> prefix /%d," % (32 - h), "usable", 2 ** h - 2)
    assert (h, 32 - h, 2 ** h - 2) == (9, 23, 510)
    blk = cidr_info("192.168.1.0/23")
    print("the /23 that holds 192.168.1.0 is", blk["network"] + "/23", "to", blk["broadcast"], "(slide fix B5)")
    assert blk["network"] == "192.168.0.0" and blk["broadcast"] == "192.168.1.255"

    print("\n== 13.10 VPC math: generic -2 vs AWS -5 (slide fix B8) ==")
    for p in (16, 20, 24):
        print("/%d: total %d, generic %d, AWS %d" % (p, 2 ** (32 - p), 2 ** (32 - p) - 2, aws_usable(p)))
    assert (aws_usable(16), aws_usable(20), aws_usable(24)) == (65531, 4091, 251)

    print("\n== 13.11 supernetting ==")
    ok, summary = can_aggregate(["200.10.4.0/24", "200.10.5.0/24", "200.10.6.0/24", "200.10.7.0/24"])
    print("200.10.4.0-200.10.7.0 /24s ->", summary)
    assert ok and summary == "200.10.4.0/22"
    ok2, why = can_aggregate(["200.10.5.0/24", "200.10.6.0/24", "200.10.7.0/24", "200.10.8.0/24"])
    print("200.10.5.0-200.10.8.0 /24s ->", why)
    assert not ok2
    ok3, why3 = can_aggregate(["200.10.4.0/24", "200.10.5.0/24", "200.10.6.0/24"])
    assert not ok3 and "power of 2" in why3
    print("\nAll Unit 13 bitwise asserts passed.")
