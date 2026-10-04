"""Unit 13 - the same answers with the standard library: ipaddress + struct (high level).

COVERAGE rows: 13.6, 13.7, 13.8, 13.9 (is_private), 13.10, 13.11 (supernet,
collapse_addresses, struct IPv4 header pack / unpack).

Run:  python3 Unit13_ipaddress_struct.py
"""
import ipaddress
import struct


def checksum16(data):
    """Internet checksum (RFC 1071) over an even-length bytes object, using struct to read words."""
    words = struct.unpack("!%dH" % (len(data) // 2), data)   # ! = network byte order, H = 16-bit unsigned
    s = sum(words)
    while s >> 16:                     # fold every carry back in
        s = (s & 0xFFFF) + (s >> 16)
    return ~s & 0xFFFF


IPV4_FMT = "!BBHHHBBH4s4s"   # ver/ihl, dscp/ecn, total len, id, flags/frag, ttl, proto, checksum, src, dst
assert struct.calcsize(IPV4_FMT) == 20


def pack_ipv4(src, dst, payload_len, ident=0, df=True, ttl=64, proto=17):
    ver_ihl = (4 << 4) | 5
    flags_frag = (0b010 << 13) if df else 0
    args = [ver_ihl, 0, 20 + payload_len, ident, flags_frag, ttl, proto, 0,
            ipaddress.IPv4Address(src).packed, ipaddress.IPv4Address(dst).packed]
    hdr = struct.pack(IPV4_FMT, *args)
    args[7] = checksum16(hdr)          # second pass with the real checksum
    return struct.pack(IPV4_FMT, *args)


def unpack_ipv4(raw):
    v, tos, tl, ident, ff, ttl, proto, csum, src, dst = struct.unpack(IPV4_FMT, raw[:20])
    return {"version": v >> 4, "ihl": v & 0xF, "total_length": tl, "id": ident,
            "DF": (ff >> 14) & 1, "MF": (ff >> 13) & 1, "offset": ff & 0x1FFF,
            "ttl": ttl, "protocol": proto, "checksum": csum,
            "src": str(ipaddress.IPv4Address(src)), "dst": str(ipaddress.IPv4Address(dst)),
            "checksum_ok": checksum16(raw[:20]) == 0}


if __name__ == "__main__":
    print("== ip_network basics ==")
    net = ipaddress.ip_network("192.168.1.0/24")
    hosts = list(net.hosts())
    print(net, "mask", net.netmask, "bcast", net.broadcast_address,
          "first", hosts[0], "last", hosts[-1], "usable", len(hosts))
    assert str(net.netmask) == "255.255.255.0" and net.num_addresses == 256 and len(hosts) == 254

    # strict=False lets you pass a host address; the library ANDs it with the mask for you
    n2 = ipaddress.ip_network("192.168.10.138/27", strict=False)
    assert str(n2) == "192.168.10.128/27" and str(n2.broadcast_address) == "192.168.10.159"
    try:
        ipaddress.ip_network("192.168.1.0/23")      # slide fix B5: host bits set -> error
        raise AssertionError("should have failed")
    except ValueError as e:
        print("192.168.1.0/23 rejected:", e)
    assert str(ipaddress.ip_network("192.168.1.0/23", strict=False)) == "192.168.0.0/23"

    print("\n== CIDR table via ipaddress ==")
    for p in (8, 12, 16, 20, 22, 23, 24, 25, 26, 27, 28, 29, 30):
        n = ipaddress.ip_network("10.0.0.0/%d" % p)
        print("/%d %-15s %d" % (p, n.netmask, n.num_addresses - 2))
    assert ipaddress.ip_network("10.0.0.0/12").netmask == ipaddress.IPv4Address("255.240.0.0")

    print("\n== subnets() and supernet() ==")
    vpc = ipaddress.ip_network("10.0.0.0/16")
    first_two = [str(s) for s in vpc.subnets(new_prefix=24)][:2]
    print("first two /24s of the VPC:", first_two)
    assert len(list(vpc.subnets(new_prefix=24))) == 256
    assert str(ipaddress.ip_network("10.0.1.0/24").supernet(new_prefix=16)) == "10.0.0.0/16"
    assert str(ipaddress.ip_network("192.168.1.0/24").supernet()) == "192.168.0.0/23"

    print("\n== collapse_addresses (aggregation) ==")
    four = [ipaddress.ip_network("200.10.%d.0/24" % i) for i in (4, 5, 6, 7)]
    agg = list(ipaddress.collapse_addresses(four))
    print(four, "->", agg)
    assert [str(a) for a in agg] == ["200.10.4.0/22"]
    bad = list(ipaddress.collapse_addresses([ipaddress.ip_network("200.10.%d.0/24" % i) for i in (5, 6, 7, 8)]))
    print("misaligned 5..8 ->", [str(a) for a in bad])
    assert [str(a) for a in bad] == ["200.10.5.0/24", "200.10.6.0/23", "200.10.8.0/24"]

    print("\n== RFC 1918 is_private ==")
    for a in ("10.20.1.5", "172.16.0.1", "172.31.255.255", "172.32.0.1", "192.168.0.14", "8.8.8.8"):
        print(a, ipaddress.ip_address(a).is_private)
    assert ipaddress.ip_address("172.31.255.255").is_private
    assert not ipaddress.ip_address("172.32.0.1").is_private
    assert not ipaddress.ip_address("8.8.8.8").is_private
    assert ipaddress.ip_network("172.16.0.0/12").num_addresses == 2 ** 20

    print("\n== AWS -5 rule ==")
    for c in ("10.0.0.0/16", "10.0.144.0/20", "10.0.1.0/24"):
        n = ipaddress.ip_network(c)
        print(c, "AWS usable", n.num_addresses - 5)
    assert ipaddress.ip_network("10.0.144.0/20").num_addresses - 5 == 4091

    print("\n== struct IPv4 header ==")
    h = pack_ipv4("192.168.0.1", "192.168.0.199", payload_len=95)
    print(h.hex(" "))
    assert h.hex() == "45000073000040004011b861c0a80001c0a800c7"
    info = unpack_ipv4(h)
    print(info)
    assert info["checksum"] == 0xB861 and info["checksum_ok"] and info["protocol"] == 17
    corrupted = bytearray(h)
    corrupted[8] = 1                              # flip TTL without fixing the checksum
    assert not unpack_ipv4(bytes(corrupted))["checksum_ok"]
    print("\nAll ipaddress / struct asserts passed.")
