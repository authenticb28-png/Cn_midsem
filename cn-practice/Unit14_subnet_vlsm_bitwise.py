"""Unit 14 - subnet splitter and VLSM allocator with pure bitwise math (low level).

COVERAGE rows: 14.2 (borrow k bits -> 2^k subnets of 2^(h-k) addresses),
14.3 (magic number, the 4 x /26 table for 10.0.0.0/24), 14.6 (AWS -5),
14.8 (overlap and containment tests), 14.9 (VLSM, largest first).

Run:  python3 Unit14_subnet_vlsm_bitwise.py
"""

MASK32 = 0xFFFFFFFF


def to_int(s):
    a, b, c, d = (int(x) for x in s.split("."))
    return (a << 24) | (b << 16) | (c << 8) | d


def to_dotted(n):
    return "%d.%d.%d.%d" % ((n >> 24) & 255, (n >> 16) & 255, (n >> 8) & 255, n & 255)


def mask(n):
    return (MASK32 << (32 - n)) & MASK32


def parse(cidr):
    ip, n = cidr.split("/")
    n = int(n)
    return to_int(ip) & mask(n), n          # force the network address


def split(cidr, k):
    """Borrow k host bits: 2^k subnets, each 2^(h-k) addresses."""
    base, n = parse(cidr)
    new_n = n + k
    size = 1 << (32 - new_n)                 # block size (the magic number when it lands in one octet)
    rows = []
    for i in range(1 << k):                  # 2^k subnets
        net = base + i * size
        bc = net + size - 1
        rows.append((to_dotted(net) + "/%d" % new_n, to_dotted(net + 1), to_dotted(bc - 1), to_dotted(bc)))
    return rows


def magic_number(n):
    """256 minus the 'interesting' mask octet (the octet that is neither 255 nor 0)."""
    m = mask(n)
    octet_index = min(n // 8, 3)             # which octet holds the boundary
    octet = (m >> (24 - 8 * octet_index)) & 255
    return 256 - octet


def overlaps(a, b):
    """Two blocks overlap iff one contains the other's network address (CIDR blocks nest or are disjoint)."""
    na, pa = parse(a)
    nb, pb = parse(b)
    p = min(pa, pb)                          # compare under the SHORTER prefix
    return (na & mask(p)) == (nb & mask(p))


def contains(outer, inner):
    no, po = parse(outer)
    ni, pi = parse(inner)
    return pi >= po and (ni & mask(po)) == no


def prefix_for_hosts(hosts, reserved=2):
    h = 0
    while (1 << h) - reserved < hosts:
        h += 1
    return 32 - h


def vlsm(cidr, demands, reserved=2):
    """Largest-first VLSM. demands = {name: hosts}. Returns list of (name, hosts, block, first, last, bcast, usable)."""
    base, n = parse(cidr)
    end = base + (1 << (32 - n))             # one past the last address of the parent block
    cursor = base
    out = []
    for name, hosts in sorted(demands.items(), key=lambda kv: -kv[1]):   # LARGEST first keeps alignment
        p = prefix_for_hosts(hosts, reserved)
        size = 1 << (32 - p)
        if cursor & (size - 1):              # not aligned: jump to the next multiple of size
            cursor = (cursor + size) & ~(size - 1) & MASK32
        assert cursor + size <= end, "parent block too small for " + name
        out.append((name, hosts, to_dotted(cursor) + "/%d" % p, to_dotted(cursor + 1),
                    to_dotted(cursor + size - 2), to_dotted(cursor + size - 1), size - reserved))
        cursor += size
    return out, to_dotted(cursor)


if __name__ == "__main__":
    print("== 14.2 / 14.3: 10.0.0.0/24, borrow k = 2 ==")
    print("magic number for /26:", magic_number(26))
    assert magic_number(26) == 64 and magic_number(27) == 32 and magic_number(20) == 16
    rows = split("10.0.0.0/24", 2)
    for r in rows:
        print("  %-15s first %-11s last %-11s bcast %s" % r)
    assert rows == [
        ("10.0.0.0/26", "10.0.0.1", "10.0.0.62", "10.0.0.63"),
        ("10.0.0.64/26", "10.0.0.65", "10.0.0.126", "10.0.0.127"),
        ("10.0.0.128/26", "10.0.0.129", "10.0.0.190", "10.0.0.191"),
        ("10.0.0.192/26", "10.0.0.193", "10.0.0.254", "10.0.0.255"),
    ]

    print("\n== GATE-style: 192.168.10.138/27 ==")
    net, n = parse("192.168.10.138/27")
    bc = net | (~mask(n) & MASK32)
    print("network", to_dotted(net), "first", to_dotted(net + 1), "last", to_dotted(bc - 1), "bcast", to_dotted(bc))
    assert (to_dotted(net), to_dotted(bc)) == ("192.168.10.128", "192.168.10.159")

    print("\n== 14.8 overlap / containment ==")
    print("10.0.1.0/24 vs 10.0.1.128/25 overlap:", overlaps("10.0.1.0/24", "10.0.1.128/25"))
    assert overlaps("10.0.1.0/24", "10.0.1.128/25")
    assert not overlaps("10.0.1.0/24", "10.0.2.0/24")
    assert contains("10.0.0.0/16", "10.0.2.0/24")
    assert not contains("10.0.0.0/16", "10.1.0.0/16")

    print("\n== 14.9 VLSM: 192.168.10.0/24 for 100, 50, 25, 2 hosts ==")
    plan, next_free = vlsm("192.168.10.0/24", {"LAN-A": 100, "LAN-B": 50, "LAN-C": 25, "WAN": 2})
    for row in plan:
        print("  %-6s %3d hosts -> %-18s %s - %s bcast %s (%d usable)" % row)
    print("  next free address:", next_free)
    assert [r[2] for r in plan] == ["192.168.10.0/25", "192.168.10.128/26", "192.168.10.192/27", "192.168.10.224/30"]
    assert [r[6] for r in plan] == [126, 62, 30, 2]
    assert next_free == "192.168.10.228"

    print("\n== 14.6 AWS: same demand with -5 per subnet ==")
    aws_plan, _ = vlsm("10.0.0.0/24", {"web": 50, "app": 20, "db": 10}, reserved=5)
    for row in aws_plan:
        print("  %-6s %3d hosts -> %-14s (%d usable in AWS)" % (row[0], row[1], row[2], row[6]))
    assert [r[2] for r in aws_plan] == ["10.0.0.0/26", "10.0.0.64/27", "10.0.0.96/28"]
    assert [r[6] for r in aws_plan] == [59, 27, 11]
    print("\nAll Unit 14 bitwise asserts passed.")
