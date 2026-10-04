"""Unit 02 (low level, from scratch): delay, throughput, circuit switching and
statistical multiplexing calculator, plus a discrete-time store-and-forward simulator.

COVERAGE ids: 02.1, 02.3, 02.4, 02.5, 02.7, 02.8, 02.9
Source: WB-L02 p8-22; Kurose & Ross 8e sections 1.3-1.4.

Run:  python3 Unit02_delays.py
Everything is plain arithmetic: no libraries except math. Every textbook answer is
checked with assert, so a clean run is also a self-test.
"""
import math

# ---------------------------------------------------------------- unit helpers
# Networking convention: k = 10**3, M = 10**6, G = 10**9 for RATES and for sizes
# written with a lower-case b. 1 byte = 8 bits. (Memory sizes in KiB/MiB use 2**10.)
PREFIX = {"": 1, "k": 10**3, "K": 10**3, "M": 10**6, "G": 10**9}


def to_bits(value, unit):
    """Convert a size such as (1500, 'B') or (2, 'Mb') or (25, 'MB') to bits."""
    prefix, base = unit[:-1], unit[-1]          # 'MB' -> prefix 'M', base 'B'
    factor = PREFIX[prefix]
    if base == "B":                             # capital B = bytes
        return value * factor * 8
    if base == "b":                             # lower-case b = bits
        return value * factor
    raise ValueError("unit must end in b (bits) or B (bytes): %r" % unit)


def rate_bps(value, unit):
    """Convert a rate such as (2, 'Mbps') or (10, 'MBps') to bits per second."""
    if unit.endswith("bps"):
        return to_bits(value, unit[:-2])       # '2 Mbps' -> '2 Mb' per second
    if unit.endswith("Bps"):
        return to_bits(value, unit[:-2])       # '10 MBps' -> '10 MB' per second = 80 Mbps
    raise ValueError("rate unit must end in bps or Bps: %r" % unit)


# ---------------------------------------------------------------- the four delays
def d_trans(L_bits, R_bps):
    """Transmission delay L/R in seconds (time to push every bit onto the link)."""
    return L_bits / R_bps


def d_prop(d_m, s_mps=2e8):
    """Propagation delay d/s in seconds (time for one bit to travel the link)."""
    return d_m / s_mps


def d_nodal(L_bits, R_bps, d_m, s_mps=2e8, proc_s=0.0, queue_s=0.0):
    """Nodal delay = processing + queuing + transmission + propagation (seconds)."""
    return proc_s + queue_s + d_trans(L_bits, R_bps) + d_prop(d_m, s_mps)


def total_delay(L_bits, R_bps, d_m, s_mps):
    """One-hop delay in milliseconds on an idle link (no queuing, no processing)."""
    return (L_bits / R_bps + d_m / s_mps) * 1000


def end_to_end(N, P, L_bits, R_bps, dprop_s=0.0):
    """N equal links in series (N-1 store-and-forward routers), P packets back to back.

    The first packet needs N*(L/R + dprop); each later packet arrives one L/R behind it,
    so the total is (N + P - 1) * L/R + N * dprop.
    """
    return (N + P - 1) * L_bits / R_bps + N * dprop_s


# ---------------------------------------------------------------- discrete-time simulator
def simulate(rates_bps, L_bits, P, dprop_s, tick_s, verbose=True):
    """Discrete-time store-and-forward simulation.

    rates_bps : list with one rate per link (len = number of links N)
    dprop_s   : list with one propagation delay per link
    tick_s    : length of one simulation tick in seconds; every L/R and d/s must be a
                whole number of ticks so the clock can step in integers (no float drift)
    Returns the tick at which the last bit of the last packet reaches the destination,
    and a timeline list of (packet, link, start_tick, end_tick, arrive_tick).
    """
    N = len(rates_bps)
    tx_ticks = []
    for R in rates_bps:
        t = L_bits / R / tick_s
        assert abs(t - round(t)) < 1e-9, "L/R must be a whole number of ticks"
        tx_ticks.append(int(round(t)))
    pr_ticks = []
    for dp in dprop_s:
        t = dp / tick_s
        assert abs(t - round(t)) < 1e-9, "d/s must be a whole number of ticks"
        pr_ticks.append(int(round(t)))

    queues = [list(range(1, P + 1))] + [[] for _ in range(N)]  # node 0 = source holds every packet
    busy = [None] * N            # (packet, end_tick) while link i is transmitting
    flying = [[] for _ in range(N)]  # packets whose last bit is on the wire: (arrive_tick, packet)
    starts = {}
    timeline = []
    t = 0
    while len(queues[N]) < P:
        # 1) transmissions that finish now: the last bit leaves the sender of link i
        for i in range(N):
            if busy[i] is not None and busy[i][1] == t:
                pkt = busy[i][0]
                flying[i].append((t + pr_ticks[i], pkt))
                timeline.append((pkt, i + 1, starts[(pkt, i)], t, t + pr_ticks[i]))
                busy[i] = None
        # 2) last bits that arrive now: the WHOLE packet is at node i+1 (store-and-forward)
        for i in range(N):
            for item in sorted(flying[i]):
                if item[0] == t:
                    queues[i + 1].append(item[1])
                    flying[i].remove(item)
        # 3) idle links start sending the next fully received packet (FIFO)
        for i in range(N):
            if busy[i] is None and queues[i]:
                pkt = queues[i].pop(0)
                busy[i] = (pkt, t + tx_ticks[i])
                starts[(pkt, i)] = t
        if len(queues[N]) < P:
            t += 1
    if verbose:
        ms = tick_s * 1000
        print("  packet  link   start(ms)   last bit sent(ms)   whole packet at next node(ms)")
        for pkt, link, s, e, a in sorted(timeline):
            print("  %4d    %3d   %9.2f   %17.2f   %29.2f" % (pkt, link, s * ms, e * ms, a * ms))
    return t, timeline


# ---------------------------------------------------------------- throughput
def throughput(*rates_bps):
    """End-to-end throughput of a path = rate of the slowest (bottleneck) link."""
    return min(rates_bps)


def shared_core_throughput(Rs, Rc, R, n):
    """Kurose Fig 1.20: n flows share a core link of rate R equally."""
    return min(Rs, Rc, R / n)


# ---------------------------------------------------------------- circuit switching
def tdm_circuit_time(file_bits, link_bps, slots, setup_s):
    """TDM: each circuit gets 1/slots of the link; time = setup + F / (R/slots)."""
    per_circuit = link_bps / slots
    return setup_s + file_bits / per_circuit, per_circuit


# ---------------------------------------------------------------- statistical multiplexing
def prob_more_than(n_users, p_active, k):
    """P(more than k of n independent users are active at once) = binomial tail."""
    return sum(math.comb(n_users, j) * p_active**j * (1 - p_active)**(n_users - j)
               for j in range(k + 1, n_users + 1))


def main():
    print("== 1. Unit conversions (the classic traps) ==")
    print("  1500 B   =", to_bits(1500, "B"), "bits")
    print("  25 MB    =", to_bits(25, "MB"), "bits")
    print("  10 MBps  =", rate_bps(10, "MBps"), "bit/s  (= 80 Mbps, not 10 Mbps)")
    assert to_bits(1500, "B") == 12000
    assert rate_bps(10, "MBps") == 80e6

    print("\n== 2. Transmission delay L/R (WB-L02 p17) ==")
    for R in (2e6, 4e6, 8e6):
        print("  L = 8000 b at %.0f Mbps -> %.0f ms" % (R / 1e6, d_trans(8000, R) * 1000))
    assert d_trans(8000, 2e6) == 0.004 and d_trans(8000, 8e6) == 0.001
    q7 = [d_trans(10000, R) * 1000 for R in (10e6, 2e6, 5e6)]
    print("  Quiz Q7: 10,000 b over 10/2/5 Mbps ->", q7, "ms; bottleneck =", throughput(10e6, 2e6, 5e6) / 1e6, "Mbps")
    assert q7 == [1.0, 5.0, 2.0]

    print("\n== 3. Propagation delay d/s and the GEO satellite (WB-L02 p18-19) ==")
    geo_one_way = d_prop(2 * 35786e3, 3e8)       # ground -> satellite -> ground
    print("  one ground-sat-ground trip = 71,572 km / 3e8 m/s = %.2f ms (ONE WAY)" % (geo_one_way * 1000))
    print("  request + reply round trip = %.2f ms" % (2 * geo_one_way * 1000))
    assert round(geo_one_way * 1000) == 239
    print("  one-hop total, 8000 b, 2 Mbps, 200 km fibre = %.1f ms" % total_delay(8000, 2e6, 200e3, 2e8))
    assert abs(total_delay(8000, 2e6, 200e3, 2e8) - 5.0) < 1e-9

    print("\n== 4. Nodal delay = proc + queue + trans + prop ==")
    dn = d_nodal(12000, 10e6, 1000e3, 2e8, proc_s=20e-6, queue_s=0.5e-3)
    print("  1500 B, 10 Mbps, 1000 km, proc 20 us, queue 0.5 ms -> %.3f ms" % (dn * 1000))
    assert abs(dn * 1000 - 6.72) < 1e-9

    print("\n== 5. Store-and-forward: 3 links, 5 packets of 8000 b, 2 Mbps, no propagation ==")
    t, _ = simulate([2e6, 2e6, 2e6], 8000, 5, [0, 0, 0], tick_s=1e-3)
    print("  simulator: %d ms   formula (N+P-1)L/R: %.0f ms" % (t, end_to_end(3, 5, 8000, 2e6) * 1000))
    assert t == 28 and abs(end_to_end(3, 5, 8000, 2e6) - 0.028) < 1e-12

    print("\n== 6. Same path with 200 km of fibre per link (d_prop = 1 ms each) ==")
    t, _ = simulate([2e6] * 3, 8000, 5, [1e-3] * 3, tick_s=1e-3)
    print("  simulator: %d ms   formula (N+P-1)L/R + N*dprop: %.0f ms" % (t, end_to_end(3, 5, 8000, 2e6, 1e-3) * 1000))
    assert t == 31

    print("\n== 7. Unequal links 10/2/5 Mbps, 3 packets of 10,000 b: the bottleneck paces arrivals ==")
    t, tl = simulate([10e6, 2e6, 5e6], 10000, 3, [0, 0, 0], tick_s=1e-3)
    print("  last packet delivered at %d ms" % t)
    assert t == 1 + 5 * 3 + 2      # 1 ms on link 1, three 5 ms slots on link 2, 2 ms on link 3

    print("\n== 8. Message segmentation (Kurose P1.31 style): 8e6-bit message, 3 links of 2 Mbps ==")
    whole = end_to_end(3, 1, 8e6, 2e6)
    seg = end_to_end(3, 800, 10000, 2e6)
    t, _ = simulate([2e6] * 3, 10000, 800, [0, 0, 0], tick_s=5e-3, verbose=False)
    print("  whole message: %.2f s   800 packets of 10,000 b: %.3f s (simulator %.3f s)" % (whole, seg, t * 5e-3))
    assert abs(whole - 12.0) < 1e-9 and abs(seg - 4.01) < 1e-9 and t == 802

    print("\n== 9. Throughput (WB-L02 p21) and file transfer time ==")
    print("  min(10, 2, 5) Mbps =", throughput(10, 2, 5), "Mbps")
    thr = shared_core_throughput(2e6, 1e6, 5e6, 10)
    print("  Rs=2, Rc=1, core R=5 Mbps shared by 10 flows -> %.0f kbps" % (thr / 1e3))
    assert thr == 500e3
    t_file = to_bits(32, "Mb") / throughput(2e6, 1e6)
    print("  32 Mb file through min(2,1) Mbps -> %.0f s" % t_file)
    assert t_file == 32
    t_file2 = to_bits(25, "MB") / 100e6
    print("  25 MB file at 100 Mbps -> %.0f s (bytes -> bits first!)" % t_file2)
    assert t_file2 == 2

    print("\n== 10. Circuit switching: TDM with 24 slots, 1.536 Mbps links, 640,000-bit file, 500 ms setup ==")
    total, per = tdm_circuit_time(640000, 1.536e6, 24, 0.5)
    print("  per-circuit rate = %.0f kbps, total = %.1f s" % (per / 1e3, total))
    assert per == 64000 and abs(total - 10.5) < 1e-9
    t1 = (24 * 8 + 1) * 8000
    print("  T1 frame: 24 slots x 8 bits + 1 framing bit = 193 bits, 8000 frames/s -> %d bps" % t1)
    assert t1 == 1544000

    print("\n== 11. Statistical multiplexing: 1 Mbps link, users need 100 kbps, active 10% ==")
    circuit_users = int(1e6 // 100e3)
    p = prob_more_than(35, 0.1, 10)
    print("  circuit switching supports %d users" % circuit_users)
    print("  packet switching with 35 users: P(more than 10 active) = %.6f" % p)
    assert circuit_users == 10 and 0.0004 < p < 0.0005
    print("\nAll Unit 02 delay checks passed.")


if __name__ == "__main__":
    main()
