"""Unit 11 - TCP congestion control simulator (TCP Tahoe and TCP Reno), written from scratch.

COVERAGE ids: 11.4, 11.5, 11.6, 11.7, 11.8, 11.10
Source: SL-L11 p10-20 (slow start, ssthresh, congestion avoidance, AIMD, fast retransmit/recovery);
        Kurose & Ross 8e section 3.7; RFC 5681 (TCP congestion control).

Run:    python3 Unit11_cwnd_sim.py

Model used by the exam (and by GATE-style questions), one "transmission round" = one RTT:
  * cwnd is counted in MSS (segments). The value printed for round r is the window USED in round r.
  * Slow start (cwnd < ssthresh):        next cwnd = min(2 * cwnd, ssthresh)   (never overshoot ssthresh)
  * Congestion avoidance (cwnd >= ssthresh): next cwnd = cwnd + 1            (additive increase, +1 MSS per RTT)
  * A loss event listed for round r is detected at the END of round r, so it changes the window of round r + 1.
  * Timeout (Tahoe and Reno):          ssthresh = max(cwnd // 2, 2), cwnd = 1, back to slow start
  * 3 duplicate ACKs, Tahoe:           ssthresh = max(cwnd // 2, 2), cwnd = 1, back to slow start
  * 3 duplicate ACKs, Reno (exam):     ssthresh = max(cwnd // 2, 2), cwnd = ssthresh, congestion avoidance
  * 3 duplicate ACKs, Reno (+3 form):  same, but cwnd = ssthresh + 3 (RFC 5681 inflation, the Kurose and Ross FSM)
The floor of 2 MSS on ssthresh comes from RFC 5681 equation (4): ssthresh = max(FlightSize / 2, 2 * SMSS).
"""

import math

TIMEOUT = "timeout"
DUP3 = "3dup"


def next_after_event(variant, cwnd, event, plus3=False):
    """Return (new_cwnd, new_ssthresh) after a loss event detected with window `cwnd`."""
    new_ssthresh = max(cwnd // 2, 2)          # multiplicative decrease of the threshold
    if event == TIMEOUT:
        return 1, new_ssthresh                # every TCP variant restarts slow start on a timeout
    if event == DUP3:
        if variant == "tahoe":
            return 1, new_ssthresh            # Tahoe treats 3 dup ACKs exactly like a timeout
        if variant == "reno":
            # Reno fast recovery: halve the window and stay in congestion avoidance
            return new_ssthresh + (3 if plus3 else 0), new_ssthresh
    raise ValueError("unknown variant/event: %r %r" % (variant, event))


def simulate(variant, rounds, ssthresh, events=None, cwnd=1, rwnd=None, plus3=False):
    """Simulate `rounds` transmission rounds.

    events: dict {round_number: TIMEOUT or DUP3}; the event is detected at the end of that round.
    rwnd:   receiver window in MSS (None = unlimited); the sender may only use min(cwnd, rwnd).
    Returns a list of dicts, one per round, with the window used in that round.
    """
    events = events or {}
    rows = []
    sent_total = 0
    for r in range(1, rounds + 1):
        phase = "SS" if cwnd < ssthresh else "CA"   # which growth rule applies after this round
        window = cwnd if rwnd is None else min(cwnd, rwnd)   # effective window = min(cwnd, rwnd)
        sent_total += window
        ev = events.get(r, "")
        rows.append({"round": r, "cwnd": cwnd, "ssthresh": ssthresh, "phase": phase,
                     "window": window, "event": ev, "sent_total": sent_total})
        if ev:
            cwnd, ssthresh = next_after_event(variant, cwnd, ev, plus3)
        elif cwnd < ssthresh:
            cwnd = min(2 * cwnd, ssthresh)          # slow start: double, but never overshoot ssthresh
        else:
            cwnd = cwnd + 1                          # congestion avoidance: +1 MSS per RTT
    return rows


def cwnds(rows):
    """Just the cwnd column of a simulation."""
    return [row["cwnd"] for row in rows]


def print_table(title, rows):
    """Print a per-round table like the one on the site."""
    print(title)
    print("  %5s %6s %9s %6s %10s %10s" % ("round", "cwnd", "ssthresh", "phase", "event", "sent_total"))
    for row in rows:
        print("  %5d %6d %9d %6s %10s %10d" % (row["round"], row["cwnd"], row["ssthresh"], row["phase"],
                                              row["event"] or "-", row["sent_total"]))
    print()


# ---------------------------------------------------------------- closed-form helpers used by the numericals

def rtts_to_reach(target, ssthresh, start=1):
    """Number of RTTs (rounds) for cwnd to grow from `start` to at least `target` with no loss."""
    cwnd, rtts = start, 0
    while cwnd < target:
        cwnd = min(2 * cwnd, ssthresh) if cwnd < ssthresh else cwnd + 1
        rtts += 1
    return rtts


def segments_in_rtts(n, ssthresh=10 ** 9, start=1):
    """Total segments sent in the first n RTTs with no loss (pure slow start gives 2**n - 1)."""
    rows = simulate("reno", n, ssthresh, cwnd=start)
    return rows[-1]["sent_total"]


def rtts_to_send(file_segments, ssthresh=10 ** 9, start=1, rwnd=None):
    """Number of RTTs of data needed to deliver `file_segments` segments with no loss."""
    cwnd, sent, rtts = start, 0, 0
    while sent < file_segments:
        sent += cwnd if rwnd is None else min(cwnd, rwnd)
        rtts += 1
        cwnd = min(2 * cwnd, ssthresh) if cwnd < ssthresh else cwnd + 1
    return rtts


def rate_bps(cwnd_bytes, rwnd_bytes, rtt_s):
    """Sender rate in bit/s: at most min(cwnd, rwnd) bytes per RTT."""
    return min(cwnd_bytes, rwnd_bytes) * 8 / rtt_s


def aimd_avg_throughput_bps(w_segments, mss_bytes, rtt_s):
    """Average AIMD throughput: the sawtooth swings between W/2 and W, so the mean is 0.75 W per RTT."""
    return 0.75 * w_segments * mss_bytes * 8 / rtt_s


# ---------------------------------------------------------------- self-test with the traces taught on the site

def main():
    # 1. SL-L11 p13: ssthresh = 8, loss at round 8 -> 1, 2, 4, 8, 9, 10, 11, 12
    slide = simulate("reno", 8, ssthresh=8, events={8: DUP3})
    print_table("SL-L11 p13 trace (ssthresh = 8, loss detected in round 8)", slide)
    assert cwnds(slide) == [1, 2, 4, 8, 9, 10, 11, 12]

    # 2. Same loss (3 dup ACKs in round 8, cwnd = 12) under Tahoe and under Reno, 15 rounds
    tahoe = simulate("tahoe", 15, ssthresh=8, events={8: DUP3})
    reno = simulate("reno", 15, ssthresh=8, events={8: DUP3})
    print_table("TCP Tahoe, 3 dup ACKs in round 8", tahoe)
    print_table("TCP Reno (exam halving), 3 dup ACKs in round 8", reno)
    assert cwnds(tahoe) == [1, 2, 4, 8, 9, 10, 11, 12, 1, 2, 4, 6, 7, 8, 9]
    assert cwnds(reno) == [1, 2, 4, 8, 9, 10, 11, 12, 6, 7, 8, 9, 10, 11, 12]
    reno3 = simulate("reno", 10, ssthresh=8, events={8: DUP3}, plus3=True)
    assert cwnds(reno3)[8:] == [9, 10]                 # RFC/Kurose inflated form: 6 + 3 = 9
    assert tahoe[8]["ssthresh"] == reno[8]["ssthresh"] == 6

    # 3. SL-L11 p20 corrected: cwnd 16 in congestion avoidance, loss in the round where cwnd = 18
    p20_dup = simulate("reno", 5, ssthresh=8, events={3: DUP3}, cwnd=16)
    p20_timeout = simulate("reno", 5, ssthresh=8, events={3: TIMEOUT}, cwnd=16)
    print_table("SL-L11 p20 with the event read as 3 duplicate ACKs (correct label)", p20_dup)
    print_table("SL-L11 p20 if it really were a timeout", p20_timeout)
    assert cwnds(p20_dup) == [16, 17, 18, 9, 10]
    assert cwnds(p20_timeout) == [16, 17, 18, 1, 2]
    assert p20_dup[3]["ssthresh"] == 9

    # 4. GATE-style multi-event trace: ssthresh = 12, timeout in round 9, 3 dup ACKs in round 17 (Reno)
    gate = simulate("reno", 20, ssthresh=12, events={9: TIMEOUT, 17: DUP3})
    print_table("GATE-style trace: ssthresh0 = 12, timeout @ 9, 3 dup ACKs @ 17 (Reno)", gate)
    assert cwnds(gate) == [1, 2, 4, 8, 12, 13, 14, 15, 16, 1, 2, 4, 8, 9, 10, 11, 12, 6, 7, 8]
    assert [row["ssthresh"] for row in gate][8:10] == [12, 8] and gate[17]["ssthresh"] == 6
    assert gate[-1]["sent_total"] == 163

    # 5. Closed forms used in the numericals
    assert rtts_to_reach(32, ssthresh=64) == 5                  # 1 -> 2 -> 4 -> 8 -> 16 -> 32
    assert rtts_to_reach(20, ssthresh=10) == 14                 # 4 RTTs to 10 (capped), then 10 more
    assert rtts_to_reach(16, ssthresh=8) == 11                  # 3 RTTs to 8, then 8 more
    assert segments_in_rtts(6) == 2 ** 6 - 1 == 63
    assert segments_in_rtts(7, ssthresh=16) == 1 + 2 + 4 + 8 + 16 + 17 + 18 == 66
    assert rtts_to_send(63) == 6
    assert rtts_to_send(100, ssthresh=16) == 9                  # 31 after 5 RTTs, then 17, 18, 19, 20
    assert rtts_to_send(40, start=10) == 3                      # IW10: 10 + 20 + 40 covers 40 segments
    assert rate_bps(20 * 1460, 16384, 0.05) == 2621440.0        # rwnd is the bottleneck
    assert math.isclose(aimd_avg_throughput_bps(20, 1500, 0.1), 1.8e6)
    limited = simulate("reno", 6, ssthresh=64, rwnd=10)
    assert [row["window"] for row in limited] == [1, 2, 4, 8, 10, 10]   # min(cwnd, rwnd) caps the sender

    print("Closed forms: RTTs 1->32 = %d, segments in 6 RTTs = %d, RTTs for a 100-segment file (ssthresh 16) = %d"
          % (rtts_to_reach(32, 64), segments_in_rtts(6), rtts_to_send(100, ssthresh=16)))
    print("All congestion-control assertions passed.")


if __name__ == "__main__":
    main()
