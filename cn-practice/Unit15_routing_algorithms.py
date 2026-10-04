#!/usr/bin/env python3
"""Unit 15 - Routing algorithms from scratch: Dijkstra (link state) and Bellman-Ford (distance vector).

COVERAGE: 15.15 (Link state: Dijkstra table on the Kurose & Ross 6-node graph; Distance vector:
Bellman-Ford iterations, count-to-infinity, poison reverse).

Run:  python3 Unit15_routing_algorithms.py
Everything is plain Python (no libraries), prints the step tables shown on the site and asserts the
textbook answers, so running it is also a self-test.

References: Kurose & Ross 8e section 5.2.1 (Table 5.1, Figure 5.3) and section 5.2.2 (Figure 5.6, 5.7).
"""

INF = float("inf")


def fmt(d):
    """Print infinity as the symbol used in textbooks."""
    return "inf" if d == INF else str(d)


# ---------------------------------------------------------------------------------------------
# 1. Dijkstra on the Kurose & Ross 6-node graph (Figure 5.3)
# ---------------------------------------------------------------------------------------------
KR_GRAPH = {
    ("u", "v"): 2, ("u", "x"): 1, ("u", "w"): 5,
    ("v", "x"): 2, ("v", "w"): 3,
    ("x", "w"): 3, ("x", "y"): 1,
    ("w", "y"): 1, ("w", "z"): 5,
    ("y", "z"): 2,
}


def neighbours(edges):
    """Turn an undirected edge dictionary into an adjacency dictionary {node: {nbr: cost}}."""
    adj = {}
    for (a, b), c in edges.items():
        adj.setdefault(a, {})[b] = c   # store both directions because links are bidirectional
        adj.setdefault(b, {})[a] = c
    return adj


def dijkstra(edges, source, tie_rank=None):
    """Hand-written Dijkstra that records one table row per step (N', D(n), p(n)).

    tie_rank: optional dict node -> rank. When two candidate nodes have the same D(), the one with the
    lower rank is added first. Kurose & Ross Table 5.1 adds y before v at step 2 (both have cost 2), so the
    demo passes a rank that reproduces the textbook order. Any tie choice gives the same distances.
    """
    adj = neighbours(edges)
    nodes = sorted(adj)
    rank = tie_rank or {n: i for i, n in enumerate(nodes)}
    D = {n: INF for n in nodes}          # current least-cost estimate
    p = {n: None for n in nodes}         # predecessor on the current best path
    D[source] = 0
    for n, c in adj[source].items():     # initialisation: direct neighbours only
        D[n], p[n] = c, source
    N = [source]                          # N' = set of nodes whose least cost is final
    rows = [(list(N), dict(D), dict(p))]
    while len(N) < len(nodes):
        # pick the node not in N' with the smallest D(); break ties with the rank
        w = min((n for n in nodes if n not in N), key=lambda n: (D[n], rank[n]))
        N.append(w)
        for v, c in adj[w].items():       # relax every neighbour not yet in N'
            if v not in N and D[w] + c < D[v]:
                D[v], p[v] = D[w] + c, w
        rows.append((list(N), dict(D), dict(p)))
    return D, p, rows


def print_dijkstra_table(rows, source):
    others = [n for n in sorted(rows[0][1]) if n != source]
    print("step  N'        " + "  ".join("D(%s),p(%s)" % (n, n) for n in others))
    for step, (N, D, p) in enumerate(rows):
        cells = []
        for n in others:
            # once a node is in N' (and was in N' on the previous row) the textbook leaves the cell blank
            if step > 0 and n in rows[step - 1][0]:
                cells.append("     -    ")
            elif D[n] == INF:
                cells.append("   inf    ")
            else:
                cells.append(("%s,%s" % (D[n], p[n])).center(10))
        print("%-5d %-9s %s" % (step, "".join(N), "  ".join(cells)))


def first_hop(p, source, dest):
    """Walk predecessors back from dest to find the first hop out of source (forwarding table entry)."""
    node = dest
    while p[node] != source:
        node = p[node]
    return node


def path_to(p, source, dest):
    path = [dest]
    while path[-1] != source:
        path.append(p[path[-1]])
    return "".join(reversed(path))


# ---------------------------------------------------------------------------------------------
# 2. Synchronous distance-vector (Bellman-Ford) on a 4-node example
# ---------------------------------------------------------------------------------------------
DV_GRAPH = {("A", "B"): 1, ("B", "C"): 2, ("C", "D"): 1, ("A", "D"): 7, ("A", "C"): 4}


def distance_vector(edges):
    """Every node starts knowing only its link costs; each round it applies
    D_x(y) = min over neighbours v of { c(x,v) + D_v(y) } using the vectors from the previous round."""
    adj = neighbours(edges)
    nodes = sorted(adj)
    # iteration 0: distance to self 0, to neighbours = link cost, everything else infinity
    vec = {x: {y: (0 if x == y else adj[x].get(y, INF)) for y in nodes} for x in nodes}
    hop = {x: {y: (x if x == y else (y if y in adj[x] else None)) for y in nodes} for x in nodes}
    history = [({x: dict(vec[x]) for x in nodes}, {x: dict(hop[x]) for x in nodes})]
    while True:
        new = {}
        newhop = {}
        for x in nodes:
            new[x], newhop[x] = {}, {}
            for y in nodes:
                if x == y:
                    new[x][y], newhop[x][y] = 0, x
                    continue
                best, via = INF, None
                for v in sorted(adj[x]):              # Bellman-Ford equation over neighbours v
                    cand = adj[x][v] + vec[v][y]
                    if cand < best:
                        best, via = cand, v
                new[x][y], newhop[x][y] = best, via
        if new == vec:                                  # nothing changed: converged, stop sending
            break
        vec, hop = new, newhop
        history.append(({x: dict(vec[x]) for x in nodes}, {x: dict(hop[x]) for x in nodes}))
    return history


# ---------------------------------------------------------------------------------------------
# 3. Count-to-infinity on the 3-node Kurose & Ross example (Figure 5.7)
# ---------------------------------------------------------------------------------------------
def count_to_infinity(poison_reverse=False, new_cost=60):
    """Nodes x, y, z. c(x,y)=4, c(y,z)=1, c(x,z)=50. We only track the route to destination x.
    At t0 the link x-y changes from 4 to new_cost. y and z then alternate updates (y, z, y, z ...).
    Returns the list of (who, new D(x), next hop) updates until no more change."""
    c_yx, c_zx, c_yz = new_cost, 50, 1
    Dy, hy = 4, "x"            # before the change y reaches x directly at cost 4
    Dz, hz = 5, "y"            # z reaches x via y at cost 1 + 4 = 5
    trace = []
    turn = "y"
    quiet = 0
    while quiet < 2:            # stop after both nodes made an update that changed nothing
        if turn == "y":
            # what z advertises to y; with poison reverse z lies "infinity" if z routes through y
            z_adv = INF if (poison_reverse and hz == "y") else Dz
            best, via = min((c_yx, "x"), (c_yz + z_adv, "z"))
            changed = (best, via) != (Dy, hy)
            Dy, hy = best, via
            if changed:
                trace.append(("y", Dy, hy))
            turn = "z"
        else:
            y_adv = INF if (poison_reverse and hy == "z") else Dy
            best, via = min((c_zx, "x"), (c_yz + y_adv, "y"))
            changed = (best, via) != (Dz, hz)
            Dz, hz = best, via
            if changed:
                trace.append(("z", Dz, hz))
            turn = "y"
        quiet = 0 if changed else quiet + 1
    return trace


def main():
    print("=" * 72)
    print("1. Dijkstra from u on the Kurose & Ross 6-node graph")
    print("=" * 72)
    textbook_rank = {"u": 0, "x": 1, "y": 2, "v": 3, "w": 4, "z": 5}   # reproduces Table 5.1 order
    D, p, rows = dijkstra(KR_GRAPH, "u", textbook_rank)
    print_dijkstra_table(rows, "u")
    order = "".join(rows[-1][0])
    assert order == "uxyvwz", order
    assert D == {"u": 0, "v": 2, "w": 3, "x": 1, "y": 2, "z": 4}, D
    assert p == {"u": None, "v": "u", "w": "y", "x": "u", "y": "x", "z": "y"}, p
    print("\nShortest-path tree and forwarding table at u:")
    print("dest  cost  path     out-link")
    fwd = {}
    for dest in "vwxyz":
        fwd[dest] = first_hop(p, "u", dest)
        print("%-5s %-5d %-8s (u,%s)" % (dest, D[dest], path_to(p, "u", dest), fwd[dest]))
    assert fwd == {"v": "v", "w": "x", "x": "x", "y": "x", "z": "x"}
    # alphabetical tie-breaking picks v before y but must give identical distances
    D2, _, rows2 = dijkstra(KR_GRAPH, "u")
    assert D2 == D and "".join(rows2[-1][0]) == "uxvywz"
    print("(alphabetical tie-break order: %s, same distances)" % "".join(rows2[-1][0]))

    print("\n" + "=" * 72)
    print("2. Synchronous Bellman-Ford distance vectors (A-B 1, B-C 2, C-D 1, A-D 7, A-C 4)")
    print("=" * 72)
    hist = distance_vector(DV_GRAPH)
    for it, (vec, hop) in enumerate(hist):
        print("iteration %d" % it)
        for x in sorted(vec):
            print("   D_%s = [%s]   next hops %s" % (
                x, ", ".join("%s:%s" % (y, fmt(vec[x][y])) for y in sorted(vec[x])),
                "".join(hop[x][y] or "-" for y in sorted(vec[x]))))
    final = hist[-1][0]
    assert len(hist) == 3                       # iteration 0, 1, 2 then convergence
    assert final["A"] == {"A": 0, "B": 1, "C": 3, "D": 4}
    assert final["D"] == {"A": 4, "B": 3, "C": 1, "D": 0}
    assert hist[1][0]["A"]["D"] == 5 and hist[2][0]["A"]["D"] == 4   # A-D improves over two rounds
    assert hist[-1][1]["A"]["D"] == "B"         # A reaches D through B (A-B-C-D = 1+2+1)

    print("\n" + "=" * 72)
    print("3. Count-to-infinity: c(x,y) jumps 4 -> 60 (c(y,z)=1, c(x,z)=50)")
    print("=" * 72)
    tr = count_to_infinity(poison_reverse=False)
    for who, d, via in tr[:6]:
        print("   %s updates D(x) = %d via %s" % (who, d, via))
    print("   (%d more updates)" % (len(tr) - 8))
    for who, d, via in tr[-2:]:
        print("   %s updates D(x) = %d via %s" % (who, d, via))
    print("   total updates before stable: %d" % len(tr))
    assert tr[0] == ("y", 6, "z") and tr[1] == ("z", 7, "y") and tr[2] == ("y", 8, "z")
    assert tr[-1] == ("y", 51, "z") and tr[-2] == ("z", 50, "x")
    assert len(tr) == 47   # y: 6,8 up to 50 (23 updates); z: 7,9 up to 49 (22); then z 50 via x, y 51

    tr_pr = count_to_infinity(poison_reverse=True)
    print("\nWith poison reverse:")
    for who, d, via in tr_pr:
        print("   %s updates D(x) = %d via %s" % (who, d, via))
    assert tr_pr == [("y", 60, "x"), ("z", 50, "x"), ("y", 51, "z")]

    # good news travels fast: if the cost drops 4 -> 1, two updates finish the job
    good = count_to_infinity(poison_reverse=False, new_cost=1)
    print("\nGood news (4 -> 1): %s" % good)
    assert good == [("y", 1, "x"), ("z", 2, "y")]
    print("\nAll routing-algorithm assertions passed.")


if __name__ == "__main__":
    main()
