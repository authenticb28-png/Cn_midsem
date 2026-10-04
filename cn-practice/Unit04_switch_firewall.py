"""Unit 04 (low level, from scratch): hub vs learning switch, a stateless packet-filter
firewall (plus a stateful one for contrast), and collision/broadcast domain counting.

COVERAGE ids: 04.2 (hub/switch/router), 04.3 (firewall, packet filtering, stateless vs
stateful), 04.9 (collision vs broadcast domains)
Source: WB-L04 p8-17; Kurose & Ross 8e section 6.4.3 (self-learning switch),
section 4.4.3 (firewalls / packet filtering); Tanenbaum section 4.8 (domains).

Run:  python3 Unit04_switch_firewall.py
"""

BROADCAST = "ff:ff:ff:ff:ff:ff"


# ====================================================================== 1. hub
class Hub:
    """Layer 1: no addresses, no table. Every bit is repeated out of every other port."""

    def __init__(self, ports):
        self.ports = ports

    def receive(self, frame, in_port):
        return [p for p in range(1, self.ports + 1) if p != in_port]


# ====================================================================== 2. learning switch
class LearningSwitch:
    """Layer 2 self-learning switch (Kurose 6.4.3).

    On every frame: (1) learn  src MAC -> incoming port (with a timestamp),
                    (2) if dst is broadcast or unknown -> FLOOD to all ports except the incoming one,
                    (3) if dst is known on the SAME port -> FILTER (drop, the receiver already heard it),
                    (4) otherwise -> FORWARD out of exactly one port.
    """

    def __init__(self, ports, aging_s=300):
        self.ports = ports
        self.aging_s = aging_s
        self.table = {}                       # mac -> (port, time last seen)

    def receive(self, src, dst, in_port, now):
        # age out stale entries first (a host may have moved)
        for mac in [m for m, (_, t) in self.table.items() if now - t > self.aging_s]:
            del self.table[mac]
        self.table[src] = (in_port, now)      # learn / refresh the sender's location
        if dst == BROADCAST or dst not in self.table:
            return "flood", [p for p in range(1, self.ports + 1) if p != in_port]
        out_port = self.table[dst][0]
        if out_port == in_port:
            return "filter", []
        return "forward", [out_port]


def switch_demo():
    print("== Learning switch, 4 ports: A on 1, B on 2, C on 3, D on 4 ==")
    mac = {"A": "aa:aa:aa:aa:aa:01", "B": "bb:bb:bb:bb:bb:02",
           "C": "cc:cc:cc:cc:cc:03", "D": "dd:dd:dd:dd:dd:04"}
    port = {"A": 1, "B": 2, "C": 3, "D": 4}
    sw = LearningSwitch(4, aging_s=300)
    trace = [("A", "B", 0), ("B", "A", 1), ("C", "BCAST", 2), ("A", "B", 3), ("D", "C", 4), ("A", "B", 400)]
    results = []
    for s, d, t in trace:
        dst = BROADCAST if d == "BCAST" else mac[d]
        action, outs = sw.receive(mac[s], dst, port[s], t)
        results.append((action, outs))
        learned = ", ".join("%s@%d" % (k, port[k]) for k in "ABCD" if mac[k] in sw.table)
        print("  t=%3ds  %s -> %-5s in port %d : %-7s out %-9s table: %s" %
              (t, s, d, port[s], action, outs, learned))
    assert results[0] == ("flood", [2, 3, 4])       # B unknown yet
    assert results[1] == ("forward", [1])           # A was learned from frame 1
    assert results[2] == ("flood", [1, 2, 4])       # broadcast always floods
    assert results[3] == ("forward", [2])           # B learned from frame 2
    assert results[4] == ("forward", [3])           # C learned from its broadcast
    assert results[5] == ("flood", [2, 3, 4])       # at t=400 B's entry (t=1) has aged out
    hub = Hub(4)
    print("  Hub with the same A -> B frame repeats it out of ports", hub.receive("A->B", 1))
    assert hub.receive("A->B", 1) == [2, 3, 4]


# ====================================================================== 3. packet filters
def ip_to_int(ip):
    a, b, c, d = (int(x) for x in ip.split("."))
    return (a << 24) | (b << 16) | (c << 8) | d


def in_cidr(ip, cidr):
    """Bitwise CIDR test: (ip AND mask) == (network AND mask)."""
    if cidr == "any":
        return True
    net, plen = cidr.split("/")
    mask = (0xFFFFFFFF << (32 - int(plen))) & 0xFFFFFFFF
    return ip_to_int(ip) & mask == ip_to_int(net) & mask


def port_ok(port, spec):
    if spec == "any":
        return True
    lo, hi = spec if isinstance(spec, tuple) else (spec, spec)
    return lo <= port <= hi


def stateless_filter(rules, pkt):
    """First matching rule wins; if nothing matches, the implicit last rule is DENY."""
    for num, (action, proto, src, dst, dport) in enumerate(rules, start=1):
        if (proto in ("any", pkt["proto"]) and in_cidr(pkt["src"], src)
                and in_cidr(pkt["dst"], dst) and port_ok(pkt["dport"], dport)):
            return action, num
    return "deny", "default"


class StatefulFilter:
    """Remembers outbound connections; a reply is allowed if it reverses a known 5-tuple."""

    def __init__(self, out_rules):
        self.out_rules = out_rules
        self.conns = set()

    def outbound(self, pkt):
        action, num = stateless_filter(self.out_rules, pkt)
        if action == "allow":
            self.conns.add((pkt["proto"], pkt["src"], pkt["sport"], pkt["dst"], pkt["dport"]))
        return action

    def inbound(self, pkt):
        key = (pkt["proto"], pkt["dst"], pkt["dport"], pkt["src"], pkt["sport"])
        return "allow" if key in self.conns else "deny"


def firewall_demo():
    print("\n== Stateless packet filter (inbound rules, first match wins) ==")
    inbound_rules = [
        ("allow", "tcp", "any", "10.0.1.10/32", 443),            # 1 HTTPS to the web server
        ("allow", "tcp", "any", "10.0.1.10/32", 80),             # 2 HTTP to the web server
        ("allow", "tcp", "203.0.113.0/24", "10.0.1.0/24", 22),   # 3 SSH only from the admin range
        ("deny", "any", "any", "any", "any"),                    # 4 explicit deny-all
    ]
    tests = [
        ({"proto": "tcp", "src": "198.51.100.7", "sport": 51000, "dst": "10.0.1.10", "dport": 443}, ("allow", 1)),
        ({"proto": "tcp", "src": "198.51.100.7", "sport": 51001, "dst": "10.0.1.10", "dport": 22}, ("deny", 4)),
        ({"proto": "tcp", "src": "203.0.113.9", "sport": 40000, "dst": "10.0.1.20", "dport": 22}, ("allow", 3)),
        ({"proto": "udp", "src": "198.51.100.7", "sport": 5353, "dst": "10.0.1.10", "dport": 53}, ("deny", 4)),
        ({"proto": "tcp", "src": "198.51.100.7", "sport": 51002, "dst": "10.0.1.10", "dport": 80}, ("allow", 2)),
    ]
    for pkt, expect in tests:
        got = stateless_filter(inbound_rules, pkt)
        print("  %s %s:%d -> %s:%d  => %s (rule %s)" % (pkt["proto"], pkt["src"], pkt["sport"],
                                                     pkt["dst"], pkt["dport"], got[0], got[1]))
        assert got == expect

    print("\n== Return traffic: stateless vs stateful ==")
    out_rules = [("allow", "tcp", "10.0.1.0/24", "any", 443)]      # clients may open HTTPS
    request = {"proto": "tcp", "src": "10.0.1.50", "sport": 50123, "dst": "198.51.100.20", "dport": 443}
    reply = {"proto": "tcp", "src": "198.51.100.20", "sport": 443, "dst": "10.0.1.50", "dport": 50123}
    st = stateless_filter(inbound_rules, reply)
    print("  stateless inbound rules see the reply to port 50123 => %s (rule %s)" % st)
    assert st == ("deny", 4)
    with_ephemeral = [("allow", "tcp", "any", "10.0.1.0/24", (1024, 65535))] + inbound_rules
    st2 = stateless_filter(with_ephemeral, reply)
    print("  after adding 'allow tcp any -> 10.0.1.0/24 ports 1024-65535' => %s (rule %s)" % st2)
    assert st2 == ("allow", 1)
    fw = StatefulFilter(out_rules)
    assert fw.outbound(request) == "allow"
    print("  stateful: outbound request allowed and remembered; reply =>", fw.inbound(reply))
    assert fw.inbound(reply) == "allow"
    unsolicited = dict(reply, dport=50999)
    print("  stateful: unsolicited packet to port 50999 =>", fw.inbound(unsolicited))
    assert fw.inbound(unsolicited) == "deny"


# ====================================================================== 4. domain counting
def count_domains(devices, links):
    """devices: name -> 'host' | 'hub' | 'switch' | 'router'; links: list of (a, b).

    Collision domains: every switch or router PORT ends a domain, a hub does not. Model each
    switch/router port as its own node, keep a hub as one node, and count connected pieces.
    Broadcast domains: only router ports end a broadcast; split only routers and count pieces.
    """
    def pieces(split_kinds):
        parent = {}

        def find(x):
            parent.setdefault(x, x)
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        def node(dev, link_no):
            # a split device gets one node per attached link (= per port in use)
            return (dev, link_no) if devices[dev] in split_kinds else (dev, None)

        for i, (a, b) in enumerate(links):
            ra, rb = find(node(a, i)), find(node(b, i))
            parent[ra] = rb
        return len({find(x) for x in list(parent)})

    return pieces({"switch", "router"}), pieces({"router"})


def domain_demo():
    print("\n== Counting collision and broadcast domains ==")
    devs = {"R1": "router", "S1": "switch", "S2": "switch", "H1": "hub"}
    for i in range(1, 9):
        devs["PC%d" % i] = "host"
    links = [("R1", "S1"), ("R1", "S2"),
             ("S1", "PC1"), ("S1", "PC2"), ("S1", "PC3"), ("S1", "PC4"),
             ("S2", "PC5"), ("S2", "H1"),
             ("H1", "PC6"), ("H1", "PC7"), ("H1", "PC8")]
    c, b = count_domains(devs, links)
    print("  R1 -> S1 (PC1-PC4) and R1 -> S2 (PC5 + hub H1 with PC6-PC8): collision %d, broadcast %d" % (c, b))
    assert (c, b) == (8, 2)
    hub_only = count_domains({"H": "hub", **{"P%d" % i: "host" for i in range(6)}},
                             [("H", "P%d" % i) for i in range(6)])
    sw_only = count_domains({"S": "switch", **{"P%d" % i: "host" for i in range(6)}},
                            [("S", "P%d" % i) for i in range(6)])
    print("  hub with 6 PCs: %s   switch with 6 PCs: %s   (collision, broadcast)" % (hub_only, sw_only))
    assert hub_only == (1, 1) and sw_only == (6, 1)


if __name__ == "__main__":
    switch_demo()
    firewall_demo()
    domain_demo()
    print("\nAll Unit 04 switch/firewall/domain checks passed.")
