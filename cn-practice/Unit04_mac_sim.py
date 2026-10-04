"""Unit 04 extra (low level, from scratch): random-access MAC protocols.

COVERAGE id: 04.11 (Extra, GATE syllabus)
  * Pure ALOHA  S = G e^(-2G), max 1/(2e) ~ 0.184 at G = 0.5
  * Slotted ALOHA S = G e^(-G), max 1/e ~ 0.368 at G = 1
  * Monte Carlo simulations of both (fixed random seed, so the run is repeatable)
  * CSMA/CD minimum frame size L_min = 2 * T_prop * R
  * Binary exponential backoff: after the n-th collision pick K from 0 to 2^min(n,10) - 1,
    wait K * 512 bit times, give up after 16 attempts
References: Kurose & Ross 8e section 6.3.2 and 6.4.2; Tanenbaum section 4.2; Forouzan chapter 12.

Run:  python3 Unit04_mac_sim.py
"""
import math
import random
from fractions import Fraction


# ---------------------------------------------------------------- ALOHA formulas
def pure_aloha(G):
    return G * math.exp(-2 * G)


def slotted_aloha(G):
    return G * math.exp(-G)


def grid_max(f, lo=0.0, hi=3.0, steps=30000):
    """Find the G that maximises f by brute force (checks the calculus answer)."""
    best = max((f(lo + (hi - lo) * i / steps), lo + (hi - lo) * i / steps) for i in range(steps + 1))
    return best[1], best[0]


# ---------------------------------------------------------------- ALOHA simulations
def sim_slotted(n_stations, p, slots, rng):
    """Each station transmits in a slot with probability p; success = exactly one sender."""
    ok = 0
    for _ in range(slots):
        senders = sum(1 for _ in range(n_stations) if rng.random() < p)
        ok += senders == 1
    return ok / slots


def sim_pure(G, frame_times, rng):
    """Poisson frame starts at G per frame time; frame length = 1 frame time.
    A frame survives if no other frame starts within 1 frame time before or after it."""
    t, starts = 0.0, []
    while True:
        t += rng.expovariate(G)          # exponential gaps = Poisson arrivals
        if t > frame_times:
            break
        starts.append(t)
    ok = 0
    for i, s in enumerate(starts):
        before = i == 0 or s - starts[i - 1] >= 1.0
        after = i == len(starts) - 1 or starts[i + 1] - s >= 1.0
        ok += before and after
    return ok / frame_times


# ---------------------------------------------------------------- CSMA/CD
def csma_cd_lmin(d_m, s_mps, R_bps):
    """The sender must still be transmitting when the collision news returns: L/R >= 2 d/s."""
    return 2 * (d_m / s_mps) * R_bps


# ---------------------------------------------------------------- binary exponential backoff
def beb_range(n):
    """Choices for K after the n-th collision of the same frame: 0 .. 2^min(n,10) - 1."""
    return list(range(2 ** min(n, 10)))


def p_resolved_next_round(n):
    """Two stations, both after their n-th collision: P(they pick different K)."""
    m = len(beb_range(n))
    return 1 - Fraction(1, m)


def p_a_wins(n_a, n_b):
    """Exact P(K_A < K_B) when A is after collision n_a and B after collision n_b."""
    ra, rb = beb_range(n_a), beb_range(n_b)
    wins = sum(1 for ka in ra for kb in rb if ka < kb)
    return Fraction(wins, len(ra) * len(rb))


def sim_two_station_beb(trials, rng):
    """Two stations collide on their first try; count collisions until one wins (max 16 attempts)."""
    total_coll, given_up = 0, 0
    for _ in range(trials):
        n = 1                               # first collision already happened
        while True:
            ka, kb = rng.choice(beb_range(n)), rng.choice(beb_range(n))
            if ka != kb:
                break
            n += 1
            if n >= 16:                     # 16 failed attempts -> drop the frame
                given_up += 1
                break
        total_coll += n
    return total_coll / trials, given_up


def main():
    rng = random.Random(2026)

    print("== ALOHA throughput S vs offered load G ==")
    print("    G    pure S=G e^-2G   slotted S=G e^-G")
    for G in (0.25, 0.5, 1.0, 1.5, 2.0):
        print("  %4.2f      %.4f           %.4f" % (G, pure_aloha(G), slotted_aloha(G)))
    gp, sp = grid_max(pure_aloha)
    gs, ss = grid_max(slotted_aloha)
    print("  brute-force maxima: pure at G = %.3f, S = %.4f; slotted at G = %.3f, S = %.4f" % (gp, sp, gs, ss))
    assert abs(gp - 0.5) < 1e-3 and abs(sp - 1 / (2 * math.e)) < 1e-6
    assert abs(gs - 1.0) < 1e-3 and abs(ss - 1 / math.e) < 1e-6

    print("\n== Forouzan-style: 200-bit frames on a shared 200 kbps channel (frame time 1 ms) ==")
    for fps in (1000, 500, 250):
        G = fps * 1e-3
        print("  %4d frames/s -> G = %.2f -> pure ALOHA delivers %.0f frames/s" % (fps, G, fps * math.exp(-2 * G)))
    # successful frames/s = S / T_frame = offered frames/s * e^(-2G); NOT offered * S (that mixes units)
    assert round(1000 * math.exp(-2)) == 135 and round(500 * math.exp(-1)) == 184 and round(250 * math.exp(-0.5)) == 152

    print("\n== Monte Carlo ==")
    s_sim = sim_slotted(50, 1 / 50, 20000, rng)
    s_theory = (1 - 1 / 50) ** 49          # exact for N = 50 stations, tends to 1/e as N grows
    print("  slotted, 50 stations, p = 1/50 (G = 1): simulated S = %.4f, theory %.4f" % (s_sim, s_theory))
    assert abs(s_sim - s_theory) < 0.02
    p_sim = sim_pure(0.5, 20000, rng)
    print("  pure, G = 0.5: simulated S = %.4f, theory %.4f" % (p_sim, pure_aloha(0.5)))
    assert abs(p_sim - pure_aloha(0.5)) < 0.02

    print("\n== CSMA/CD minimum frame size L_min = 2 * T_prop * R ==")
    for d, R in ((2000, 100e6), (1000, 1e9)):
        L = csma_cd_lmin(d, 2e8, R)
        print("  %4d m, %4.0f Mbps, s = 2e8 m/s -> T_prop = %.0f us -> L_min = %.0f bits = %.0f bytes" %
              (d, R / 1e6, d / 2e8 * 1e6, L, L / 8))
    assert round(csma_cd_lmin(2000, 2e8, 100e6)) == 2000 and round(csma_cd_lmin(1000, 2e8, 1e9)) == 10000
    print("  Classic 10 Mbps Ethernet: slot = 512 bit times = %.1f us -> 64-byte minimum frame" % (512 / 10e6 * 1e6))

    print("\n== Binary exponential backoff ==")
    for n in (1, 2, 3, 10, 12):
        r = beb_range(n)
        print("  after collision %2d: K in 0..%d, worst wait at 10 Mbps = %.1f us" % (n, r[-1], r[-1] * 51.2))
    assert beb_range(3)[-1] == 7 and beb_range(12)[-1] == 1023
    print("  P(two stations resolve after collision 1) =", p_resolved_next_round(1))
    print("  P(two stations resolve after collision 2) =", p_resolved_next_round(2))
    assert p_resolved_next_round(1) == Fraction(1, 2) and p_resolved_next_round(2) == Fraction(3, 4)
    pa = p_a_wins(1, 2)
    print("  A (new frame, after 1 collision) vs B (after 2 collisions): P(A wins) =", pa)
    assert pa == Fraction(5, 8)
    avg, dropped = sim_two_station_beb(20000, rng)
    print("  simulated average collisions before success: %.3f (frames dropped: %d)" % (avg, dropped))
    assert 1.5 < avg < 1.8 and dropped == 0
    print("\nAll Unit 04 MAC checks passed.")


if __name__ == "__main__":
    main()
