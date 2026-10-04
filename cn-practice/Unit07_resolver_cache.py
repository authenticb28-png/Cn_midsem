#!/usr/bin/env python3
"""Unit 07 - Iterative vs recursive resolution, TTL caching and negative caching (low level).

Topic : a hand-written simulation of the DNS hierarchy (root -> TLD -> authoritative),
        counting messages and adding RTTs, plus a TTL cache that shows why a DNS change
        "propagates" slowly and how NXDOMAIN answers are cached (RFC 2308).
COVERAGE ids : 07.3, 07.4, 07.5, 07.6
Run   : python3 Unit07_resolver_cache.py
No sockets: pure algorithm, so it is deterministic and instant.
"""

# ---------------------------------------------------------------- the toy hierarchy
# Each server maps a name suffix to either a referral ("NS", next server) or an answer ("A", ip).
ROOT = {"com.": ("NS", "tld-com"), "co.": ("NS", "tld-co")}
SERVERS = {
    "root": ROOT,
    "tld-com": {"amazon.com.": ("NS", "auth-amazon"), "google.com.": ("NS", "auth-google")},
    "tld-co": {"newtonschool.co.": ("NS", "auth-newton")},
    "auth-amazon": {"www.amazon.com.": ("A", "203.0.113.10")},
    "auth-google": {"www.google.com.": ("A", "203.0.113.20")},
    "auth-newton": {"newtonschool.co.": ("A", "99.83.190.102")},
}
# Round-trip times in ms from the LOCAL resolver to each server (iterative mode).
RTT_FROM_LOCAL = {"root": 30, "tld-com": 40, "tld-co": 40, "auth-amazon": 60, "auth-google": 60, "auth-newton": 60}
RTT_HOST_LOCAL = 4
# Round-trip times between servers when they query each other (recursive mode).
RTT_CHAIN = {("root", "tld-com"): 20, ("tld-com", "auth-amazon"): 25}


def lookup(server, name):
    """Ask one server: return the most specific matching entry (longest suffix wins)."""
    table = SERVERS[server]
    best = None
    for suffix, entry in table.items():
        if name == suffix or name.endswith("." + suffix):
            if best is None or len(suffix) > len(best[0]):
                best = (suffix, entry)
    return best


class LocalResolver:
    """An ISP-style local DNS server doing ITERATIVE queries with a TTL cache."""

    def __init__(self):
        self.cache = {}                    # key -> (value, expiry_time_s)
        self.messages = 0
        self.log = []

    def cached(self, key, now):
        hit = self.cache.get(key)
        if hit and hit[1] > now:
            return hit[0]
        self.cache.pop(key, None)          # expired entries are removed
        return None

    def resolve(self, name, now=0, ttl_answer=300, ttl_referral=172800):
        self.messages = 2                  # host -> local query and local -> host reply
        latency = RTT_HOST_LOCAL
        ip = self.cached(("A", name), now)
        if ip:
            self.log.append("%s: answer from cache" % name)
            return ip, latency
        # start from the deepest cached referral, otherwise from the root
        server = "root"
        labels = name.split(".")
        for i in range(len(labels)):
            zone = ".".join(labels[i:])
            ref = self.cached(("NS", zone), now)
            if ref:
                server = ref
                break
        while True:
            self.messages += 2             # one query + one reply per server contacted
            latency += RTT_FROM_LOCAL[server]
            suffix, (kind, value) = lookup(server, name)
            self.log.append("%s -> %s: %s %s" % (server, name, kind, value))
            if kind == "A":
                self.cache[("A", name)] = (value, now + ttl_answer)
                return value, latency
            self.cache[("NS", suffix)] = (value, now + ttl_referral)   # cache the referral too
            server = value


def recursive_chain(name):
    """Fully recursive: host->local->root->TLD->auth, each server asks the next one."""
    path = ["root", "tld-com", "auth-amazon"]
    messages = 2 * (1 + len(path))         # every hop has one query and one reply
    latency = RTT_HOST_LOCAL + RTT_FROM_LOCAL["root"] + RTT_CHAIN[("root", "tld-com")] + RTT_CHAIN[("tld-com", "auth-amazon")]
    return messages, latency


class TTLCache:
    """Minimal positive + negative cache keyed by name, used for the propagation timeline."""

    def __init__(self, authority):
        self.authority = authority         # dict name -> ip; a missing name means NXDOMAIN
        self.store = {}                    # name -> (ip or None, expiry)

    def query(self, name, now, ttl=300, soa_ttl=3600, soa_minimum=900):
        entry = self.store.get(name)
        if entry and entry[1] > now:
            return entry[0], "HIT", entry[1] - now          # remaining TTL is what clients see
        if name in self.authority:
            self.store[name] = (self.authority[name], now + ttl)
            return self.authority[name], "MISS", ttl
        neg_ttl = min(soa_ttl, soa_minimum)                   # RFC 2308 section 5
        self.store[name] = (None, now + neg_ttl)
        return None, "MISS", neg_ttl


def main():
    print("== 1. Cold cache, iterative resolution of www.amazon.com ==")
    r = LocalResolver()
    ip, ms = r.resolve("www.amazon.com.")
    for line in r.log:
        print("   " + line)
    print("   answer %s, %d messages, %d ms" % (ip, r.messages, ms))
    assert ip == "203.0.113.10" and r.messages == 8 and ms == 4 + 30 + 40 + 60 == 134

    print("\n== 2. Same name again (answer cached) ==")
    ip, ms = r.resolve("www.amazon.com.", now=10)
    print("   %s, %d messages, %d ms" % (ip, r.messages, ms))
    assert r.messages == 2 and ms == 4

    print("\n== 3. www.google.com (the .com referral is cached, root skipped) ==")
    ip, ms = r.resolve("www.google.com.", now=20)
    print("   %s, %d messages, %d ms" % (ip, r.messages, ms))
    assert r.messages == 6 and ms == 4 + 40 + 60 == 104

    print("\n== 4. Fully recursive chain for www.amazon.com ==")
    msgs, ms = recursive_chain("www.amazon.com.")
    print("   %d messages, %d ms (root and TLD do the work, so they carry more load)" % (msgs, ms))
    assert msgs == 8 and ms == 4 + 30 + 20 + 25 == 79

    print("\n== 5. TTL timeline: why a DNS change propagates slowly ==")
    authority = {"shop.example.": "198.51.100.1"}
    c = TTLCache(authority)
    timeline = []
    for t in (0, 100, 150, 200, 299, 300, 301):
        if t == 150:
            authority["shop.example."] = "198.51.100.2"     # admin changes the A record at t = 150 s
            timeline.append((t, "authoritative record changed to 198.51.100.2", "", ""))
            continue
        ip, how, left = c.query("shop.example.", t)
        timeline.append((t, ip, how, left))
    for row in timeline:
        print("   t=%3s s  %-46s %-4s TTL left %s" % row)
    assert timeline[1] == (100, "198.51.100.1", "HIT", 200)
    assert timeline[3] == (200, "198.51.100.1", "HIT", 100)      # stale but still served
    assert timeline[4] == (299, "198.51.100.1", "HIT", 1)
    assert timeline[5] == (300, "198.51.100.2", "MISS", 300)     # expiry at exactly t = 300
    print("   worst-case staleness = TTL = 300 s after the change reaches the authoritative server")

    print("\n== 6. Negative caching of NXDOMAIN (RFC 2308) ==")
    ip, how, left = c.query("typo.example.", 1000)
    print("   typo.example. -> %s (%s), cached for %d s = min(SOA TTL 3600, SOA MINIMUM 900)" % (ip, how, left))
    assert ip is None and left == 900
    authority["typo.example."] = "198.51.100.9"                  # someone creates the name at t = 1000
    assert c.query("typo.example.", 1899)[0] is None             # still NXDOMAIN from the negative cache
    assert c.query("typo.example.", 1900)[0] == "198.51.100.9"   # visible once the 900 s expire
    print("   the new name stays invisible until t = 1900 s")
    print("\nAll resolver/cache self-tests passed.")


if __name__ == "__main__":
    main()
