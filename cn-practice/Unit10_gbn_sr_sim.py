"""Unit 10 - Sliding window, Go-Back-N and Selective Repeat simulators (low level, hand-written).

COVERAGE rows
  10.6  sliding-window trace with window 4 (SL-L10 p18, re-derived consistently)
  10.8  Go-Back-N, packet 5 lost (SL-L10 p22): one duplicate ACK, timeout, resend 5 and 6
  10.9  Selective Repeat with NAK 2 (SL-L10 p24): resend only frame 2
  10.10 utilization U = min(1, N/(1+2a)); sequence-number limits W <= 2^n - 1 (GBN) and
        W <= 2^(n-1) (SR) with the ambiguity counter-examples; GATE-style counting of
        transmissions when every k-th transmission is lost.

The GBN and SR engines are small discrete-event simulators: a packet takes Tf to transmit,
Tp to propagate, the receiver ACKs at once, and ACKs take Tp to come back.

Run:  python3 Unit10_gbn_sr_sim.py      (offline, well under 1 s)
"""
import heapq
import math


# ---------------------------------------------------------------- tiny event engine
class Engine:
    def __init__(self):
        self.q, self.n, self.now, self.trace = [], 0, 0.0, []

    def at(self, t, prio, fn, *args):
        # prio 0 = an arrival, prio 1 = "sender may transmit": arrivals at the same instant go first
        heapq.heappush(self.q, (t, prio, self.n, fn, args))
        self.n += 1

    def run(self):
        while self.q:
            t, _, _, fn, args = heapq.heappop(self.q)
            self.now = t
            fn(*args)

    def log(self, side, text):
        self.trace.append((self.now, side, text))


def show(title, eng):
    print(title)
    for t, side, text in eng.trace:
        arrow = "Sender  -->" if side == "L" else ("      <-- Receiver" if side == "R" else "  ** ")
        print("  t=%5.1f  %-18s %s" % (t, arrow, text))
    print()


# ---------------------------------------------------------------- Go-Back-N
def gbn(first, last, W, lost=(), Tf=1.0, Tp=1.0, TO=6.0, ready=None):
    """lost: set of (seq, attempt) transmissions the channel drops. ready: seq -> time the
    application hands that packet to the sender (default 0)."""
    eng, ready = Engine(), ready or {}
    st = {"base": first, "nxt": first, "expected": first, "busy": 0.0, "timer": 0, "tries": {},
          "dups": 0, "sent": 0}

    def start_timer():
        st["timer"] += 1                                  # a new id invalidates older timers
        eng.at(eng.now + TO, 0, timeout, st["timer"])

    def try_send():
        if st["busy"] > eng.now + 1e-9:
            return                                        # link still busy; a later call will come
        s = st["nxt"]
        if s > last or s >= st["base"] + W:
            return                                        # nothing left or window full
        if ready.get(s, 0.0) > eng.now + 1e-9:
            eng.at(ready[s], 1, try_send)                 # wait for the application
            return
        n = st["tries"][s] = st["tries"].get(s, 0) + 1
        st["sent"] += 1
        drop = (s, n) in lost
        eng.log("L", "DATA seq=%d%s%s" % (s, " RETX" if n > 1 else "", "  LOST" if drop else ""))
        if not drop:
            eng.at(eng.now + Tf + Tp, 0, rx_data, s)
        if st["base"] == s:
            start_timer()                                 # one timer, for the oldest unACKed packet
        st["nxt"] += 1
        st["busy"] = eng.now + Tf
        eng.at(st["busy"], 1, try_send)

    def rx_data(s):
        if s == st["expected"]:
            st["expected"] += 1                           # in order: accept
            eng.at(eng.now + Tp, 0, rx_ack, st["expected"], False)
        else:                                             # out of order: GBN discards it
            eng.at(eng.now + Tp, 0, rx_ack, st["expected"], True)

    def rx_ack(a, dup):
        if a > st["base"]:
            eng.log("R", "ACK=%d" % a)
            st["base"] = a                                # cumulative: everything below a is done
            if st["base"] == st["nxt"]:
                st["timer"] += 1                          # nothing outstanding: stop the timer
            else:
                start_timer()
            try_send()
        else:
            st["dups"] += 1
            eng.log("R", "ACK=%d (duplicate)" % a)

    def timeout(tid):
        if tid != st["timer"]:
            return
        eng.log("*", "TIMEOUT for packet %d -> go back to %d" % (st["base"], st["base"]))
        st["nxt"] = st["base"]                            # Go-Back-N: resend base and everything after
        try_send()

    eng.at(0.0, 1, try_send)
    eng.run()
    return eng, st


# ---------------------------------------------------------------- Selective Repeat
def sr(first, last, W, damaged=(), Tf=1.0, Tp=1.0, TO=8.0, nak=True):
    """damaged: set of (seq, attempt) that arrive with a bad checksum and are discarded."""
    eng = Engine()
    st = {"base": first, "nxt": first, "rcv_base": first, "busy": 0.0, "acked": set(), "buf": set(),
          "tries": {}, "retx": [], "timers": {}, "naked": set(), "sent": 0, "delivered": []}

    def send(s):
        n = st["tries"][s] = st["tries"].get(s, 0) + 1
        st["sent"] += 1
        bad = (s, n) in damaged
        eng.log("L", "Data %d%s%s" % (s, " (resent)" if n > 1 else "", "  DAMAGED" if bad else ""))
        eng.at(eng.now + Tf + Tp, 0, rx_data, s, bad)
        st["timers"][s] = st["timers"].get(s, 0) + 1      # each packet has its own timer
        eng.at(eng.now + TO, 0, timeout, s, st["timers"][s])
        st["busy"] = eng.now + Tf
        eng.at(st["busy"], 1, try_send)

    def try_send():
        if st["busy"] > eng.now + 1e-9:
            return
        if st["retx"]:
            send(st["retx"].pop(0))                       # retransmissions go first
        elif st["nxt"] <= last and st["nxt"] < st["base"] + W:
            st["nxt"] += 1
            send(st["nxt"] - 1)

    def rx_data(s, bad):
        if bad:
            if nak and st["rcv_base"] not in st["naked"]:
                st["naked"].add(st["rcv_base"])
                eng.at(eng.now + Tp, 0, rx_nak, st["rcv_base"])
            return                                        # discarded
        if st["rcv_base"] <= s < st["rcv_base"] + W:
            st["buf"].add(s)                              # buffer even if out of order
            while st["rcv_base"] in st["buf"]:
                st["delivered"].append(st["rcv_base"])    # deliver the in-order run
                st["buf"].discard(st["rcv_base"])
                st["rcv_base"] += 1
        eng.at(eng.now + Tp, 0, rx_ack, s)                # individual ACK (also for duplicates)

    def rx_nak(s):
        eng.log("R", "NAK %d" % s)
        if s not in st["acked"] and s not in st["retx"]:
            st["retx"].append(s)
            try_send()

    def rx_ack(s):
        eng.log("R", "ACK %d" % s)
        st["acked"].add(s)
        st["timers"][s] = st["timers"].get(s, 0) + 1      # stop that packet's timer
        while st["base"] in st["acked"]:
            st["base"] += 1                               # slide past the ACKed prefix
        try_send()

    def timeout(s, tid):
        if st["timers"].get(s) != tid or s in st["acked"]:
            return
        eng.log("*", "TIMEOUT for packet %d -> resend only %d" % (s, s))
        st["retx"].append(s)
        try_send()

    eng.at(0.0, 1, try_send)
    eng.run()
    return eng, st


# ---------------------------------------------------------------- sliding-window bookkeeping (p18)
def sliding_window_trace():
    print("=== 10.6  Sliding window, size 4, cumulative ACKs (SL-L10 p18, corrected) ===")
    W, base, nxt = 4, 1, 1
    steps = [("T1", "send", 4), ("T2", "ack", 2), ("T2", "ack", 3), ("T3", "send", 2), ("T4", "ack", 5),
             ("T4", "send", 2)]
    states = []
    for phase, kind, val in steps:
        if kind == "send":
            sent = []
            for _ in range(val):
                assert nxt < base + W, "may only send inside the window"
                sent.append(nxt)
                nxt += 1
            what = "send Seq " + ", ".join(map(str, sent))
        else:
            base = max(base, val)                          # ACK=a confirms every packet below a
            what = "ACK=%d" % val
        window = list(range(base, base + W))
        usable = [s for s in window if s >= nxt]
        states.append((window, usable))
        print("  %s %-18s window %s  sendable now %s" % (phase, what, window, usable))
    assert states[2] == ([3, 4, 5, 6], [5, 6])             # after ACK=3 the sender may send 5 and 6
    assert states[4] == ([5, 6, 7, 8], [7, 8])             # after ACK=5 BOTH 7 and 8 may be sent
    print("  (the slide sends only 7 at T4; 8 is also inside the window)\n")


# ---------------------------------------------------------------- GATE-style counting
def count_gbn(n, W, k):
    """Transmissions to deliver packets 1..n with GBN window W when every k-th transmission is
    lost. Convention used in GATE answers: ACKs are never lost and arrive before the next
    transmission, so after a loss the sender keeps sending to the end of its window, then
    times out and goes back to the lost packet."""
    base, nxt, expected, count, order = 1, 1, 1, 0, []
    while base <= n:
        while nxt <= n and nxt < base + W:
            count += 1
            assert count < 1000, "loss pattern never lets the transfer finish"
            lost = count % k == 0
            order.append("%d%s" % (nxt, "x" if lost else ""))
            if not lost and nxt == expected:
                expected += 1
                base = expected                           # instant cumulative ACK
            nxt += 1
        nxt = base                                        # timeout: go back
    return count, order


def count_sr(n, W, k):
    """Same convention for Selective Repeat: lost packets wait in a list; the oldest one times
    out and is resent only when no new packet fits in the window."""
    base, nxt, count, acked, pending, order = 1, 1, 0, set(), [], []
    while base <= n:
        if nxt <= n and nxt < base + W:
            s = nxt                                       # a new packet fits in the window
            nxt += 1
        else:
            s = pending.pop(0)                            # window exhausted: oldest loss times out
        count += 1
        assert count < 1000, "loss pattern never lets the transfer finish"
        lost = count % k == 0
        order.append("%d%s" % (s, "x" if lost else ""))
        if lost:
            pending.append(s)
        else:
            acked.add(s)                                  # individual ACK
            while base in acked:
                base += 1
    return count, order


def seq_bits(W, protocol):
    """Smallest n with W <= 2^n - 1 (GBN) or W <= 2^(n-1) (SR)."""
    if protocol == "GBN":
        return math.ceil(math.log2(W + 1))
    return math.ceil(math.log2(2 * W))


def utilization(N, a):
    return min(1.0, N / (1 + 2 * a))


# ---------------------------------------------------------------- sequence-number ambiguity
def sr_ambiguity(n_bits, W):
    """Sender sends 0..W-1, receiver gets all and slides, ALL ACKs are lost, sender resends 0.
    Returns True if the receiver wrongly accepts the old packet 0 as new data."""
    M = 2 ** n_bits
    rcv_window = [(W + i) % M for i in range(W)]          # receiver window after sliding by W
    return 0 in rcv_window, rcv_window


def gbn_ambiguity(n_bits, W):
    M = 2 ** n_bits
    expected = W % M                                      # receiver now expects seq W mod M
    return expected == 0, expected


def main():
    sliding_window_trace()

    # GBN exactly as on the slide (p22): window [3,4,5,6], packet 5 lost. Tf = 1, Tp = 2.5, so the
    # whole window leaves before the first ACK returns. The demo's application hands packets 7
    # and 8 to the sender only after recovery (t = 22), which is what the slide draws.
    eng, st = gbn(3, 8, 4, lost={(5, 1)}, Tp=2.5, TO=8.0, ready={7: 22.0, 8: 22.0})
    show("=== 10.8  Go-Back-N, window 4, packet 5 lost (slide trace, corrected) ===", eng)
    labels = [x[2] for x in eng.trace][:14]
    assert labels == ["DATA seq=3", "DATA seq=4", "DATA seq=5  LOST", "DATA seq=6", "ACK=4", "ACK=5",
                      "ACK=5 (duplicate)", "TIMEOUT for packet 5 -> go back to 5", "DATA seq=5 RETX",
                      "DATA seq=6 RETX", "ACK=6", "ACK=7", "DATA seq=7", "DATA seq=8"], labels
    assert st["dups"] == 1, "only ONE out-of-order packet (6) arrives, so only ONE duplicate ACK=5"

    # The same loss with packets 7 and 8 ready at once: a real, fully pipelined GBN sender.
    eng, st = gbn(3, 8, 4, lost={(5, 1)}, Tp=2.5, TO=8.0)
    show("=== 10.8  Go-Back-N, same loss, sender always has data (fully pipelined) ===", eng)
    assert st["dups"] == 3 and st["sent"] == 10           # 3,4,5,6,7,8 then 5,6,7,8 again

    # Selective Repeat as on the slide (p24): frame 2 damaged, NAK 2, only 2 is resent.
    eng, st = sr(0, 6, 4, damaged={(2, 1)}, Tp=1.0)
    show("=== 10.9  Selective Repeat, window 4, frame 2 damaged -> NAK 2 ===", eng)
    data_order = [x[2] for x in eng.trace if x[1] in ("L",) or x[2].startswith("NAK")]
    assert data_order == ["Data 0", "Data 1", "Data 2  DAMAGED", "Data 3", "Data 4", "NAK 2",
                          "Data 2 (resent)", "Data 5", "Data 6"], data_order
    assert st["delivered"] == [0, 1, 2, 3, 4, 5, 6] and st["sent"] == 8

    print("=== 10.10  Every k-th transmission lost (GATE-style) ===")
    for n, W, k in ((9, 3, 5), (10, 4, 6), (10, 3, 4)):
        g, go = count_gbn(n, W, k)
        s, so = count_sr(n, W, k)
        print("  n=%d W=%d k=%d  GBN %2d: %s" % (n, W, k, g, " ".join(go)))
        print("  %-15s SR  %2d: %s" % ("", s, " ".join(so)))
    assert count_gbn(9, 3, 5)[0] == 16 and count_sr(9, 3, 5)[0] == 11
    assert count_gbn(10, 4, 6)[0] == 17 and count_sr(10, 4, 6)[0] == 11
    print()

    print("=== 10.10  Utilization U = min(1, N/(1+2a)) for a = 10 ===")
    for N in (1, 7, 15, 21, 30):
        print("  N=%2d  U=%.4f" % (N, utilization(N, 10)))
    assert abs(utilization(1, 10) - 1 / 21) < 1e-12 and utilization(21, 10) == 1.0
    assert abs(utilization(7, 10) - 1 / 3) < 1e-12
    print()

    print("=== 10.10  Sequence-number bits ===")
    for W in (7, 8, 13, 21):
        print("  W=%2d  GBN needs n=%d   SR needs n=%d" % (W, seq_bits(W, "GBN"), seq_bits(W, "SR")))
    assert (seq_bits(7, "GBN"), seq_bits(7, "SR")) == (3, 4)
    assert (seq_bits(8, "GBN"), seq_bits(8, "SR")) == (4, 4)
    assert (seq_bits(13, "GBN"), seq_bits(13, "SR")) == (4, 5)
    assert (seq_bits(21, "GBN"), seq_bits(21, "SR")) == (5, 6)
    bug, win = sr_ambiguity(2, 3)
    print("  SR  n=2 W=3: receiver window after 0,1,2 = %s -> old 0 accepted as NEW: %s" % (win, bug))
    assert bug and win == [3, 0, 1]
    bug, win = sr_ambiguity(2, 2)
    print("  SR  n=2 W=2: receiver window after 0,1   = %s -> old 0 accepted as NEW: %s" % (win, bug))
    assert not bug and win == [2, 3]
    bug, exp = gbn_ambiguity(2, 4)
    print("  GBN n=2 W=4: receiver expects %d -> old 0 accepted as NEW: %s" % (exp, bug))
    assert bug
    bug, exp = gbn_ambiguity(2, 3)
    print("  GBN n=2 W=3: receiver expects %d -> old 0 accepted as NEW: %s" % (exp, bug))
    assert not bug
    print("\nAll GBN / SR self-tests passed.")


if __name__ == "__main__":
    main()
