#!/usr/bin/env python3
"""Unit 08 - An LRU web cache built by hand, with hit/miss statistics and max-age freshness (low level).

Topic : cache hit vs miss vs stale, LRU replacement, hit ratio, average access time, and
        the Kurose & Ross institutional-cache example (15 req/s, 1 Mb objects, 15 Mbps link).
COVERAGE ids : 08.3, 08.4, 08.6
Run   : python3 Unit08_lru_cache.py
The LRU uses a hash map plus a hand-written doubly linked list, so get/put are O(1).
"""


class Node:
    __slots__ = ("key", "value", "stored_at", "max_age", "prev", "next")

    def __init__(self, key, value, stored_at, max_age):
        self.key, self.value, self.stored_at, self.max_age = key, value, stored_at, max_age
        self.prev = self.next = None


class LRUCache:
    """Most recently used next to the tail sentinel, least recently used next to the head sentinel."""

    def __init__(self, capacity):
        self.capacity = capacity
        self.map = {}
        self.head, self.tail = Node(None, None, 0, 0), Node(None, None, 0, 0)   # sentinels
        self.head.next, self.tail.prev = self.tail, self.head
        self.hits = self.misses = self.stale = self.evictions = 0

    def _unlink(self, node):
        node.prev.next, node.next.prev = node.next, node.prev

    def _append(self, node):                      # insert just before the tail = most recent
        node.prev, node.next = self.tail.prev, self.tail
        self.tail.prev.next = node
        self.tail.prev = node

    def get(self, key, now=0):
        node = self.map.get(key)
        if node is None:
            self.misses += 1
            return None
        if node.max_age is not None and now - node.stored_at >= node.max_age:
            self.stale += 1                       # present but expired: treated as a miss
            self.misses += 1
            self._unlink(node)
            del self.map[key]
            return None
        self.hits += 1
        self._unlink(node)
        self._append(node)                        # touching it makes it most recently used
        return node.value

    def put(self, key, value, now=0, max_age=None):
        if key in self.map:
            self._unlink(self.map.pop(key))
        elif len(self.map) >= self.capacity:
            lru = self.head.next                  # least recently used entry
            self._unlink(lru)
            del self.map[lru.key]
            self.evictions += 1
        node = Node(key, value, now, max_age)
        self.map[key] = node
        self._append(node)

    def order(self):
        out, n = [], self.head.next
        while n is not self.tail:
            out.append(n.key)
            n = n.next
        return out

    def hit_ratio(self):
        total = self.hits + self.misses
        return self.hits / total if total else 0.0


def fetch(cache, key, now=0, max_age=None):
    """Browser/proxy logic: serve on a fresh hit, otherwise go to the origin and store the copy."""
    if cache.get(key, now) is not None:
        return "HIT"
    cache.put(key, "body-of-" + key, now, max_age)
    return "MISS"


def avg_access_time(h, t_hit, t_miss):
    return h * t_hit + (1 - h) * t_miss


def main():
    print("== 1. LRU trace, capacity 3 ==")
    cache = LRUCache(3)
    trace = ["A", "B", "C", "A", "B", "D", "A", "E", "B", "A"]
    results = []
    for i, k in enumerate(trace, 1):
        r = fetch(cache, k)
        results.append(r)
        print("   %2d  %s  %-4s  LRU->MRU %s" % (i, k, r, cache.order()))
    assert results == ["MISS", "MISS", "MISS", "HIT", "HIT", "MISS", "HIT", "MISS", "MISS", "HIT"]
    assert (cache.hits, cache.misses, cache.evictions) == (4, 6, 3)
    assert cache.order() == ["E", "B", "A"]
    assert cache.hit_ratio() == 0.4
    print("   hits=%d misses=%d evictions=%d hit ratio=%.1f" % (cache.hits, cache.misses, cache.evictions, cache.hit_ratio()))

    print("\n== 2. Freshness with max-age=3600 ==")
    c = LRUCache(10)
    assert fetch(c, "foobar.css", now=0, max_age=3600) == "MISS"      # first request goes to origin
    assert fetch(c, "foobar.css", now=1800, max_age=3600) == "HIT"    # 1800 s old, still fresh
    assert fetch(c, "foobar.css", now=3599, max_age=3600) == "HIT"
    assert fetch(c, "foobar.css", now=3600, max_age=3600) == "MISS"   # age 3600 is no longer < 3600: stale
    assert c.stale == 1
    print("   t=0 MISS, t=1800 HIT, t=3599 HIT, t=3600 stale -> MISS (refetch)")
    # A copy that already carries Age: 1200 from a CDN has 3600 - 1200 = 2400 s of life left.
    assert 3600 - 1200 == 2400

    print("\n== 3. Average access time ==")
    t = avg_access_time(0.8, 5, 100)
    print("   h=0.8, hit 5 ms, miss 100 ms -> %.1f ms" % t)
    assert abs(t - 24.0) < 1e-9

    print("\n== 4. Kurose & Ross institutional cache ==")
    rate, size, access, lan, internet_delay = 15, 1e6, 15e6, 100e6, 2.0
    lan_intensity = rate * size / lan
    access_intensity = rate * size / access
    print("   LAN intensity = 15 x 1 Mb / 100 Mbps = %.2f" % lan_intensity)
    print("   access-link intensity = 15 x 1 Mb / 15 Mbps = %.2f (queueing delay grows without bound)" % access_intensity)
    assert abs(lan_intensity - 0.15) < 1e-9 and abs(access_intensity - 1.0) < 1e-9
    h = 0.4
    with_cache = (1 - h) * rate * size / access
    print("   with a cache, h=0.4 -> access-link intensity = %.2f" % with_cache)
    assert abs(with_cache - 0.6) < 1e-9
    avg = avg_access_time(h, 0.01, internet_delay + 0.01)
    print("   average delay = 0.4 x 0.01 s + 0.6 x 2.01 s = %.3f s" % avg)
    assert abs(avg - 1.21) < 1e-9

    print("\n== 5. CDN offload ==")
    requests, edge_hits = 1_000_000, 920_000
    offload = edge_hits / requests
    print("   %d of %d requests served at the edge -> offload %.0f%%, origin sees %d" % (edge_hits, requests, 100 * offload, requests - edge_hits))
    assert requests - edge_hits == 80_000 and round(100 * offload) == 92
    print("\nAll cache self-tests passed.")


if __name__ == "__main__":
    main()
