"""Mock Exam 2, Question C4: model solution for a longest-prefix-match (LPM) route lookup.

Topic: route tables, longest-prefix match, default route 0.0.0.0/0.
Source: SL-L15 p18-19 (10.0.0.0/16 local, 10.0.1.0/24 router-B, 0.0.0.0/0 gateway; 10.0.1.55 -> router-B).
COVERAGE id: 15.6.
Run:   python3 Mock2_C4_lpm.py      (offline, no arguments, exits 0 when every assert holds)
"""
import ipaddress


def ip_to_int(s):
    """Dotted quad -> 32-bit integer."""
    a, b, c, d = (int(x) for x in s.split("."))
    return (a << 24) | (b << 16) | (c << 8) | d


def parse_route(prefix):
    """'10.0.1.0/24' -> (network_int, mask_int, prefix_len)."""
    net, plen = prefix.split("/")
    plen = int(plen)
    mask = (0xFFFFFFFF << (32 - plen)) & 0xFFFFFFFF if plen else 0
    return ip_to_int(net) & mask, mask, plen


def lookup(table, dst):
    """Return the next hop of the longest matching prefix, or None if nothing matches.

    table: list of (prefix_string, next_hop).  A route matches when (dst AND mask) == network.
    """
    d = ip_to_int(dst)
    best_len, best_hop = -1, None
    for prefix, hop in table:
        net, mask, plen = parse_route(prefix)
        if d & mask == net and plen > best_len:   # matches AND is more specific than the best so far
            best_len, best_hop = plen, hop
    return best_hop


def lookup_lib(table, dst):
    """Same lookup using the ipaddress module."""
    a = ipaddress.ip_address(dst)
    hits = [(ipaddress.ip_network(p).prefixlen, h) for p, h in table if a in ipaddress.ip_network(p)]
    return max(hits)[1] if hits else None


ROUTES = [("10.0.0.0/16", "local"), ("10.0.1.0/24", "router-B"), ("0.0.0.0/0", "gateway")]

GATE_TABLE = [("172.16.0.0/16", "if0"), ("172.16.64.0/18", "if1"),
              ("172.16.96.0/19", "if2"), ("172.16.100.0/22", "if3")]

if __name__ == "__main__":
    cases = {"10.0.1.55": "router-B", "10.0.2.9": "local", "8.8.8.8": "gateway", "10.0.255.255": "local"}
    for ip, want in cases.items():
        got = lookup(ROUTES, ip)
        print("%-14s -> %s" % (ip, got))
        assert got == want and lookup_lib(ROUTES, ip) == want

    # A table with nested prefixes and no default route
    gate = {"172.16.101.7": "if3", "172.16.97.1": "if2", "172.16.70.1": "if1",
            "172.16.130.1": "if0", "172.17.0.1": None}
    for ip, want in gate.items():
        got = lookup(GATE_TABLE, ip)
        print("%-14s -> %s" % (ip, got))
        assert got == want and lookup_lib(GATE_TABLE, ip) == want
    print("all LPM asserts passed")
