"""Unit 12 - load-balancing algorithms and a health-check state machine, written from scratch.

COVERAGE ids: 12.1, 12.2, 12.6, 12.7, 12.8
Source: WB-L04 p18 (6 requests round robin over 3 servers); SL-L12 p8 (NLB 4-tuple example),
        p16-17 (GET /health every 30 s, self-healing), p18-20 (elasticity, ASG);
        AWS Elastic Load Balancing User Guide (ALB health-check defaults: interval 30 s, timeout 5 s,
        healthy threshold 5, unhealthy threshold 2; NLB flow-hash routing).

Run:    python3 Unit12_lb_algorithms.py
"""

import math


# ---------------------------------------------------------------- 1. round robin (ALB default algorithm)

class RoundRobin:
    """Hand requests to the healthy targets in turn: 1, 2, 3, 1, 2, 3."""

    def __init__(self, targets):
        self.targets = list(targets)
        self.next_index = 0

    def pick(self, healthy):
        for _ in range(len(self.targets)):           # skip unhealthy targets, at most one full lap
            t = self.targets[self.next_index]
            self.next_index = (self.next_index + 1) % len(self.targets)
            if t in healthy:
                return t
        raise RuntimeError("no healthy target: the load balancer returns HTTP 503")


# ---------------------------------------------------------------- 2. least connections / least outstanding requests

class LeastConnections:
    """Send the new request to the healthy target with the fewest requests still in progress.
    AWS ALB calls this 'least outstanding requests' (LOR)."""

    def __init__(self, targets):
        self.active = {t: 0 for t in targets}

    def pick(self, healthy):
        candidates = [t for t in self.active if t in healthy]
        if not candidates:
            raise RuntimeError("no healthy target")
        best = min(candidates, key=lambda t: (self.active[t], list(self.active).index(t)))   # ties: first in list
        self.active[best] += 1
        return best

    def finish(self, target):
        self.active[target] -= 1


# ---------------------------------------------------------------- 3. flow hash on the 4-tuple (NLB style)

def ip_to_bytes(ip):
    """'203.0.113.10' -> 4 bytes, by hand (no ipaddress module)."""
    parts = [int(p) for p in ip.split(".")]
    assert len(parts) == 4 and all(0 <= p <= 255 for p in parts)
    return bytes(parts)


def fnv1a_32(data):
    """FNV-1a 32-bit hash: start with the offset basis, XOR each byte in, multiply by the FNV prime."""
    h = 0x811C9DC5
    for byte in data:
        h ^= byte
        h = (h * 0x01000193) & 0xFFFFFFFF
    return h


def flow_hash_pick(src_ip, src_port, dst_ip, dst_port, healthy):
    """Same 4-tuple -> same target, for every packet of the connection."""
    key = (ip_to_bytes(src_ip) + src_port.to_bytes(2, "big") +
           ip_to_bytes(dst_ip) + dst_port.to_bytes(2, "big"))     # 12 bytes, network byte order
    ordered = sorted(healthy)                                     # deterministic order of healthy targets
    return ordered[fnv1a_32(key) % len(ordered)]


# ---------------------------------------------------------------- 4. health-check state machine

class HealthCheck:
    """AWS-style target health: 'initial' -> 'healthy' after `healthy_threshold` consecutive passes;
    'healthy' -> 'unhealthy' after `unhealthy_threshold` consecutive failures; and back again."""

    def __init__(self, healthy_threshold=5, unhealthy_threshold=2):
        self.ht, self.ut = healthy_threshold, unhealthy_threshold
        self.state = "initial"
        self.passes = 0
        self.fails = 0

    def probe(self, ok):
        if ok:
            self.passes, self.fails = self.passes + 1, 0      # a pass resets the failure streak
            if self.state != "healthy" and self.passes >= self.ht:
                self.state = "healthy"
        else:
            self.fails, self.passes = self.fails + 1, 0       # a failure resets the pass streak
            if self.state != "unhealthy" and self.fails >= self.ut:
                self.state = "unhealthy"
        return self.state


def run_health_timeline(interval=30, ht=5, ut=2, down_from=181, up_from=331, end=480):
    """Probe every `interval` s; the server answers 500 between down_from and up_from (seconds)."""
    hc = HealthCheck(ht, ut)
    changes = []
    for t in range(0, end + 1, interval):
        ok = not (down_from <= t < up_from)
        before = hc.state
        after = hc.probe(ok)
        print("  t=%3d s  GET /health -> %s  state=%s" % (t, "200 OK" if ok else "500", after))
        if after != before:
            changes.append((t, after))
    return changes


# ---------------------------------------------------------------- 5. capacity and availability math

def asg_instances(load, per_instance, min_size, max_size):
    """Auto Scaling: ceil(load / capacity per instance), clamped to [min, max]."""
    need = math.ceil(load / per_instance)
    return max(min_size, min(max_size, need))


def availability(p, n):
    """n independent replicas, each up with probability p: the service is down only if all n are down."""
    return 1 - (1 - p) ** n


def main():
    # WB-L04 p18: Req1..Req6 over Server 1, 2, 3
    servers = ["Server 1", "Server 2", "Server 3"]
    rr = RoundRobin(servers)
    placed = [rr.pick(set(servers)) for _ in range(6)]
    for i, s in enumerate(placed, 1):
        print("Req%d -> %s" % (i, s))
    assert placed == ["Server 1", "Server 2", "Server 3", "Server 1", "Server 2", "Server 3"]

    # Round robin skips an unhealthy target
    rr2 = RoundRobin(servers)
    skipped = [rr2.pick({"Server 1", "Server 3"}) for _ in range(4)]
    assert skipped == ["Server 1", "Server 3", "Server 1", "Server 3"]

    # Least connections: a long request pins Server 1, so the next two go elsewhere
    lc = LeastConnections(servers)
    healthy = set(servers)
    first = lc.pick(healthy)            # Server 1 (all at 0, tie -> first)
    second = lc.pick(healthy)           # Server 2
    lc.finish(second)                   # Server 2's request completes quickly
    third = lc.pick(healthy)            # Server 2 and Server 3 both have 0 active: tie goes to Server 2
    fourth = lc.pick(healthy)           # Server 3 (0 active)
    print("Least connections picks:", first, second, third, fourth, lc.active)
    assert (first, second, third, fourth) == ("Server 1", "Server 2", "Server 2", "Server 3")
    assert lc.active == {"Server 1": 1, "Server 2": 1, "Server 3": 1}

    # SL-L12 p8: client 203.0.113.10:51514 -> NLB 198.51.100.25:443; target 3 (10.0.1.12) is unhealthy
    targets_ok = {"10.0.1.10", "10.0.1.11"}
    flow = ("203.0.113.10", 51514, "198.51.100.25", 443)
    chosen = flow_hash_pick(*flow, healthy=targets_ok)
    print("NLB flow %s:%d -> %s:%d goes to %s:443" % (flow[0], flow[1], flow[2], flow[3], chosen))
    assert chosen in targets_ok and chosen != "10.0.1.12"
    assert all(flow_hash_pick(*flow, healthy=targets_ok) == chosen for _ in range(100))   # sticky per flow
    spread = {}
    for port in range(50000, 50400):                        # 400 different client ports
        t = flow_hash_pick("203.0.113.10", port, "198.51.100.25", 443, targets_ok)
        spread[t] = spread.get(t, 0) + 1
    print("400 flows spread over healthy targets:", spread)
    assert set(spread) == targets_ok and min(spread.values()) > 120   # both targets get a fair share
    assert fnv1a_32(b"") == 0x811C9DC5 and fnv1a_32(b"a") == 0xE40C292C   # published FNV-1a test vectors

    # Health checks with AWS ALB defaults: interval 30 s, healthy threshold 5, unhealthy threshold 2
    print("Health-check timeline (server answers 500 from t=181 s until t=331 s):")
    changes = run_health_timeline()
    print("State changes:", changes)
    # passes at 0, 30, 60, 90, 120 -> healthy at 120 (5 in a row);
    # the server breaks at 181, just after the probe at 180: failures at 210 and 240 -> unhealthy at 240 (59 s later);
    # it is fixed at 331, just after the probe at 330: passes at 360, 390, 420, 450, 480 -> healthy at 480 (149 s later)
    assert changes == [(120, "healthy"), (240, "unhealthy"), (480, "healthy")]
    assert 30 * 2 == 60 and 30 * 5 == 150      # detection = interval x unhealthy threshold; recovery = interval x healthy threshold

    # Auto Scaling: 1,000 users per instance, min 2, max 60 (SL-L12 p18: 500 vs 50,000 users)
    assert asg_instances(500, 1000, 2, 60) == 2
    assert asg_instances(50000, 1000, 2, 60) == 50
    assert asg_instances(75000, 1000, 2, 60) == 60
    print("ASG: morning 500 users -> %d instances, evening 50,000 users -> %d instances"
          % (asg_instances(500, 1000, 2, 60), asg_instances(50000, 1000, 2, 60)))

    # Multi-AZ availability with 99% per AZ
    for n in (1, 2, 3):
        print("AZs = %d -> availability = %.6f" % (n, availability(0.99, n)))
    assert math.isclose(availability(0.99, 2), 0.9999)
    assert math.isclose(availability(0.99, 3), 0.999999)
    print("All load-balancer assertions passed.")


if __name__ == "__main__":
    main()
