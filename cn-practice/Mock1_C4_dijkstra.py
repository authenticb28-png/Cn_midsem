"""Mock Exam 1, Question C4: model solution for a link-state (Dijkstra) routing calculation.

Topic: link-state routing, Dijkstra's algorithm, building a forwarding table (next hop).
Graph: Kurose & Ross 8e Fig. 5.3 (nodes u, v, w, x, y, z).  COVERAGE id: 15.15.
Run:   python3 Mock1_C4_dijkstra.py      (offline, no arguments, exits 0 when every assert holds)
"""
import heapq

# Undirected weighted graph as an edge list (cost is the same in both directions).
EDGES = [("u", "v", 2), ("u", "x", 1), ("u", "w", 5), ("v", "x", 2), ("v", "w", 3),
         ("x", "w", 3), ("x", "y", 1), ("w", "y", 1), ("w", "z", 5), ("y", "z", 2)]


def build_graph(edges):
    """Adjacency dict: node -> {neighbour: cost}."""
    g = {}
    for a, b, c in edges:
        g.setdefault(a, {})[b] = c
        g.setdefault(b, {})[a] = c
    return g


def dijkstra_table(graph, src):
    """Hand-written O(V^2) Dijkstra exactly as done on paper: returns (dist, prev, order).

    Ties are broken alphabetically so the run is deterministic.
    """
    dist = {n: float("inf") for n in graph}
    prev = {n: None for n in graph}
    dist[src] = 0
    done, order = set(), []
    while len(done) < len(graph):
        # pick the unfinished node with the smallest tentative distance (alphabetical tie-break)
        n = min((d, name) for name, d in dist.items() if name not in done)[1]
        done.add(n)
        order.append(n)
        for nb, cost in graph[n].items():          # relax every edge leaving n
            if nb not in done and dist[n] + cost < dist[nb]:
                dist[nb] = dist[n] + cost
                prev[nb] = n
    return dist, prev, order


def dijkstra_heap(graph, src):
    """Library-style version with heapq (what you would write in production code)."""
    dist = {src: 0}
    pq = [(0, src)]
    while pq:
        d, n = heapq.heappop(pq)
        if d > dist.get(n, float("inf")):
            continue                                 # stale queue entry
        for nb, cost in graph[n].items():
            nd = d + cost
            if nd < dist.get(nb, float("inf")):
                dist[nb] = nd
                heapq.heappush(pq, (nd, nb))
    return dist


def path_to(prev, dst):
    """Walk the predecessor pointers back from dst to the source."""
    p = [dst]
    while prev[p[-1]] is not None:
        p.append(prev[p[-1]])
    return p[::-1]


def forwarding_table(prev, src):
    """Next hop from src for every other destination = second node on the shortest path."""
    return {d: path_to(prev, d)[1] for d in prev if d != src}


if __name__ == "__main__":
    g = build_graph(EDGES)
    dist, prev, order = dijkstra_table(g, "u")
    print("order nodes were finalised:", " ".join(order))
    for n in sorted(g):
        print("%s: cost %d, path %s" % (n, dist[n], "-".join(path_to(prev, n))))
    fwd = forwarding_table(prev, "u")
    print("forwarding table at u:", fwd)

    assert dist == {"u": 0, "v": 2, "w": 3, "x": 1, "y": 2, "z": 4}
    assert path_to(prev, "w") == ["u", "x", "y", "w"]
    assert path_to(prev, "z") == ["u", "x", "y", "z"]
    assert fwd == {"v": "v", "w": "x", "x": "x", "y": "x", "z": "x"}
    assert order == ["u", "x", "v", "y", "w", "z"]
    assert dijkstra_heap(g, "u") == dist                    # both versions agree
    print("all Dijkstra asserts passed")
