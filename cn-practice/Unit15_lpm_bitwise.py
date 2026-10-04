#!/usr/bin/env python3
"""Unit 15 - Longest-prefix-match router written with bitwise math only (no ipaddress module).

COVERAGE: 15.6 (route tables, longest-prefix match, default route 0.0.0.0/0), 15.8 (VPC route tables).

Run:  python3 Unit15_lpm_bitwise.py
An address matches a route when (addr AND mask) == (network AND mask). Among all matches the route with
the largest prefix length wins; 0.0.0.0/0 has mask 0, so it matches everything and wins only as a last resort.
References: SL-L15 p18-19; Kurose & Ross 8e section 4.2.1 (prefix table with interfaces 0-3).
"""


def ip_to_int(ip):
    a, b, c, d = (int(x) for x in ip.split("."))
    return (a << 24) | (b << 16) | (c << 8) | d          # pack four octets into one 32-bit integer


def mask_of(prefix_len):
    # prefix_len ones followed by zeros, kept to 32 bits; /0 gives 0
    return (0xFFFFFFFF << (32 - prefix_len)) & 0xFFFFFFFF if prefix_len else 0


def bits(n, upto=32):
    s = format(n, "032b")[:upto]
    return " ".join(s[i:i + 8] for i in range(0, len(s), 8))


class Router:
    def __init__(self, routes):
        # store (network int, prefix length, next hop); validate that host bits are zero
        self.table = []
        for cidr, hop in routes:
            net, plen = cidr.split("/")
            n, plen = ip_to_int(net), int(plen)
            assert n & ~mask_of(plen) & 0xFFFFFFFF == 0, "host bits set in " + cidr
            self.table.append((n, plen, hop, cidr))

    def lookup(self, ip, verbose=False):
        a = ip_to_int(ip)
        best = None
        for n, plen, hop, cidr in self.table:
            m = mask_of(plen)
            ok = (a & m) == n                       # compare only the first plen bits
            if verbose:
                print("    %-17s %-38s %s" % (cidr, bits(a & m), "match /%d" % plen if ok else "no"))
            if ok and (best is None or plen > best[1]):
                best = (n, plen, hop, cidr)         # keep the longest matching prefix
        return best[2] if best else None


def main():
    print("1. SL-L15 p18-19 table, packet to 10.0.1.55")
    r = Router([("10.0.0.0/16", "local"), ("10.0.1.0/24", "router-B"), ("0.0.0.0/0", "gateway")])
    print("    address 10.0.1.55 = %s" % bits(ip_to_int("10.0.1.55")))
    hop = r.lookup("10.0.1.55", verbose=True)
    print("    -> next hop %s" % hop)
    assert hop == "router-B"
    assert r.lookup("10.0.7.9") == "local"           # only /16 and /0 match
    assert r.lookup("8.8.8.8") == "gateway"          # only the default route matches

    print("\n2. Kurose & Ross style GATE table (prefix -> interface)")
    k = Router([("200.23.16.0/21", 0), ("200.23.24.0/24", 1), ("200.23.24.0/21", 2), ("0.0.0.0/0", 3)])
    cases = {"200.23.22.161": 0, "200.23.24.170": 1, "200.23.31.5": 2, "200.23.40.1": 3}
    for ip, want in cases.items():
        print("  %s = %s" % (ip, bits(ip_to_int(ip))))
        got = k.lookup(ip, verbose=True)
        print("    -> interface %d" % got)
        assert got == want

    print("\n3. AWS private route table (correct version of SL-L15 p25)")
    vpc = Router([("10.0.0.0/16", "local"), ("0.0.0.0/0", "nat-9f7c")])
    assert vpc.lookup("10.0.4.20") == "local"        # traffic inside the VPC never leaves it
    assert vpc.lookup("151.101.1.69") == "nat-9f7c"  # OS update download goes out via the NAT gateway
    print("  10.0.4.20 -> local, 151.101.1.69 -> nat-9f7c")

    assert mask_of(21) == 0xFFFFF800 and mask_of(0) == 0 and mask_of(32) == 0xFFFFFFFF
    print("\nAll LPM assertions passed.")


if __name__ == "__main__":
    main()
