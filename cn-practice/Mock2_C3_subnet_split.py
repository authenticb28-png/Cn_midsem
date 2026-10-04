"""Mock Exam 2, Question C3: model solution for an equal-size subnet splitter with AWS usable counts.

Topic: borrowing subnet bits, block size, network/broadcast, AWS 5 reserved addresses.
Sources: SL-L14 p6-8 (10.0.0.0/24 -> 4 x /26), SL-L14 p15-17 (AWS reserves 5), SL-L13 p16-18.
COVERAGE ids: 14.2, 14.3, 14.6.
Run:   python3 Mock2_C3_subnet_split.py      (offline, no arguments, exits 0 when every assert holds)
"""
import ipaddress


def ip_to_int(s):
    """Dotted quad -> 32-bit integer, by hand."""
    a, b, c, d = (int(x) for x in s.split("."))
    return (a << 24) | (b << 16) | (c << 8) | d


def int_to_ip(n):
    """32-bit integer -> dotted quad, by hand."""
    return ".".join(str((n >> sh) & 0xFF) for sh in (24, 16, 8, 0))


def split(cidr, n_subnets):
    """Split `cidr` into the fewest equal subnets that give at least n_subnets.

    Returns a list of dicts with network, prefix, broadcast, generic usable hosts,
    AWS first/last usable address and AWS usable count (total - 5).
    """
    base_s, plen_s = cidr.split("/")
    plen = int(plen_s)
    base = ip_to_int(base_s)
    mask = (0xFFFFFFFF << (32 - plen)) & 0xFFFFFFFF
    if base & ~mask & 0xFFFFFFFF:
        raise ValueError("%s is not on a /%d boundary" % (base_s, plen))
    k = 0
    while (1 << k) < n_subnets:       # borrow k bits: 2^k >= n_subnets
        k += 1
    new_plen = plen + k
    if new_plen > 32:
        raise ValueError("not enough host bits")
    size = 1 << (32 - new_plen)       # block size (the "magic number")
    out = []
    for i in range(1 << k):
        net = base + i * size
        out.append({
            "network": int_to_ip(net),
            "prefix": new_plen,
            "broadcast": int_to_ip(net + size - 1),
            "generic_usable": size - 2,            # minus network and broadcast
            "aws_first": int_to_ip(net + 4),       # .0 net, .1 router, .2 DNS, .3 reserved
            "aws_last": int_to_ip(net + size - 2), # last address (broadcast) is reserved too
            "aws_usable": size - 5,
        })
    return out


if __name__ == "__main__":
    # SL-L14 p8: 10.0.0.0/24 split into 4 subnets -> /26, block 64
    subs = split("10.0.0.0/24", 4)
    for s in subs:
        print("%s/%d  bcast %s  generic %d  AWS %s-%s (%d)" % (
            s["network"], s["prefix"], s["broadcast"], s["generic_usable"],
            s["aws_first"], s["aws_last"], s["aws_usable"]))
    assert [s["network"] for s in subs] == ["10.0.0.0", "10.0.0.64", "10.0.0.128", "10.0.0.192"]
    assert all(s["prefix"] == 26 and s["generic_usable"] == 62 and s["aws_usable"] == 59 for s in subs)
    assert subs[1]["broadcast"] == "10.0.0.127" and subs[1]["aws_first"] == "10.0.0.68"

    # Need at least 12 subnets from 10.20.0.0/16 -> borrow 4 bits -> 16 x /20, 4091 AWS-usable each
    big = split("10.20.0.0/16", 12)
    assert len(big) == 16 and big[0]["prefix"] == 20 and big[0]["aws_usable"] == 4091
    assert big[15]["network"] == "10.20.240.0" and big[15]["broadcast"] == "10.20.255.255"
    print("10.20.0.0/16 into >=12:", len(big), "subnets of /20, AWS usable", big[0]["aws_usable"])

    # Cross-check against the standard library
    lib = list(ipaddress.ip_network("10.0.0.0/24").subnets(new_prefix=26))
    assert [str(n.network_address) for n in lib] == [s["network"] for s in subs]
    assert [str(n.broadcast_address) for n in lib] == [s["broadcast"] for s in subs]

    # A misaligned base is rejected (the SL-L13 p20 trap: 192.168.1.0 is not a /23 boundary)
    try:
        split("192.168.1.0/23", 2)
        raise AssertionError("misaligned base was accepted")
    except ValueError as e:
        print("rejected:", e)
    print("all subnet-splitter asserts passed")
