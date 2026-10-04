#!/usr/bin/env python3
"""Unit 07 - AWS Route 53 routing policies, simulated by hand (low level).

Topic : how an authoritative DNS service such as Route 53 chooses WHICH answer to return.
        Simple, Weighted, Latency-based, Failover, Geolocation (the five core policies)
        plus Multivalue answer and IP-based. Route 53 only answers DNS queries (layer 7);
        it never sits in the data path like a load balancer.
COVERAGE ids : 07.6
Run   : python3 Unit07_route53_policies.py
Facts follow the Amazon Route 53 Developer Guide ("Choosing a routing policy").
"""
import ipaddress
import random


def simple(values, rng):
    """Simple: one record, possibly several values; all are returned in random order, no health checks."""
    out = list(values)
    rng.shuffle(out)
    return out


def weighted(records, rng):
    """Weighted: pick record i with probability w_i / sum(w). Weights are integers 0 to 255.

    A weight of 0 means 'never', unless every weight is 0, in which case all are equally likely.
    """
    total = sum(w for _, w in records)
    if total == 0:
        return rng.choice(records)[0]
    x = rng.uniform(0, total)
    running = 0
    for value, w in records:
        running += w
        if x < running:
            return value
    return records[-1][0]


def latency_based(client_latency_ms):
    """Latency: answer with the Region that has the lowest measured latency for this client."""
    return min(client_latency_ms, key=client_latency_ms.get)


def failover(primary, secondary, primary_healthy):
    """Failover (active-passive): primary while its health check passes, otherwise secondary."""
    return primary if primary_healthy else secondary


def geolocation(records, continent, country):
    """Geolocation: most specific match wins (country, then continent, then the Default record)."""
    for key in (("country", country), ("continent", continent), ("default", "*")):
        if key in records:
            return records[key]
    return None                                          # no default record -> NODATA ("no answer")


def multivalue(records, health, limit=8):
    """Multivalue answer: up to 8 healthy records, each with its own health check."""
    return [r for r in records if health.get(r, True)][:limit]


def ip_based(cidr_table, client_ip):
    """IP-based: map the client's source CIDR to an answer; the longest matching prefix wins."""
    ip = ipaddress.ip_address(client_ip)
    best = None
    for cidr, answer in cidr_table.items():
        net = ipaddress.ip_network(cidr)
        if ip in net and (best is None or net.prefixlen > best[0].prefixlen):
            best = (net, answer)
    return best[1] if best else "default-location answer"


def main():
    rng = random.Random(7)                               # fixed seed so the run is repeatable

    print("== Simple ==")
    print("   ", simple(["192.0.2.1", "192.0.2.2", "192.0.2.3"], rng))

    print("\n== Weighted: blue 70, green 20, canary 10 ==")
    recs = [("blue", 70), ("green", 20), ("canary", 10)]
    total = sum(w for _, w in recs)
    n = 20000
    counts = {"blue": 0, "green": 0, "canary": 0}
    for _ in range(n):
        counts[weighted(recs, rng)] += 1
    for name, w in recs:
        expected = w / total
        observed = counts[name] / n
        print("    %-6s weight %3d  expected %5.1f%%  observed %5.1f%%" % (name, w, 100 * expected, 100 * observed))
        assert abs(observed - expected) < 0.02
    assert weighted([("a", 0), ("b", 0)], rng) in ("a", "b")          # all zero -> equal chance
    assert all(weighted([("a", 0), ("b", 5)], rng) == "b" for _ in range(200))
    # 10,000 queries with weights 3:1 -> 7,500 and 2,500 expected
    assert 10000 * 3 // (3 + 1) == 7500

    print("\n== Latency-based ==")
    lat = {"ap-south-1": 18, "eu-west-1": 140, "us-east-1": 210}
    print("    client in Pune measures", lat, "->", latency_based(lat))
    assert latency_based(lat) == "ap-south-1"

    print("\n== Failover ==")
    for healthy in (True, False):
        print("    primary healthy=%s -> %s" % (healthy, failover("alb-primary", "s3-sorry-page", healthy)))
    assert failover("p", "s", False) == "s"

    print("\n== Geolocation ==")
    geo = {("country", "IN"): "mumbai-alb", ("continent", "EU"): "frankfurt-alb", ("default", "*"): "virginia-alb"}
    for cont, ctry in (("AS", "IN"), ("EU", "FR"), ("SA", "BR")):
        print("    %s/%s -> %s" % (cont, ctry, geolocation(geo, cont, ctry)))
    assert geolocation(geo, "AS", "IN") == "mumbai-alb"
    assert geolocation(geo, "EU", "FR") == "frankfurt-alb"
    assert geolocation(geo, "SA", "BR") == "virginia-alb"
    assert geolocation({("country", "IN"): "x"}, "SA", "BR") is None

    print("\n== Multivalue answer ==")
    ips = ["198.51.100.%d" % i for i in range(1, 11)]                 # 10 records
    health = {"198.51.100.3": False}
    ans = multivalue(ips, health)
    print("    %d records, 1 unhealthy -> %d returned" % (len(ips), len(ans)))
    assert len(ans) == 8 and "198.51.100.3" not in ans

    print("\n== IP-based ==")
    table = {"10.0.0.0/8": "corp-edge", "10.20.0.0/16": "branch-edge"}
    print("    10.20.5.9 ->", ip_based(table, "10.20.5.9"), "| 10.1.1.1 ->", ip_based(table, "10.1.1.1"))
    assert ip_based(table, "10.20.5.9") == "branch-edge" and ip_based(table, "10.1.1.1") == "corp-edge"
    print("\nAll Route 53 policy self-tests passed.")


if __name__ == "__main__":
    main()
