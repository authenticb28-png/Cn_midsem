"""Unit 02 extra (low level, from scratch): traffic intensity and queuing delay,
bandwidth-delay product, Nyquist and Shannon channel capacity with dB conversion.

COVERAGE id: 02.10 (Extra, GATE syllabus)
References: Kurose & Ross 8e section 1.4.2 and problems on traffic intensity;
Forouzan "Data Communications and Networking" chapter 3 (Nyquist, Shannon).

Run:  python3 Unit02_capacity.py
"""
import math


# ---------------------------------------------------------------- queuing
def traffic_intensity(L_bits, a_pps, R_bps):
    """I = L*a / R: bits arriving per second divided by bits the link can send per second."""
    return L_bits * a_pps / R_bps


def kurose_queue_delay(L_bits, R_bps, I):
    """Kurose problem model: average queuing delay = I*L / (R*(1 - I)), valid only for I < 1."""
    assert 0 <= I < 1, "I >= 1 means the queue grows without bound"
    return I * L_bits / (R_bps * (1 - I))


def burst_average_queue_delay(N, L_bits, R_bps):
    """N packets arrive together: packet k waits (k-1)L/R; the mean is (N-1)L/(2R)."""
    waits = [(k - 1) * L_bits / R_bps for k in range(1, N + 1)]
    return sum(waits) / N


# ---------------------------------------------------------------- bandwidth-delay product
def bdp_bits(R_bps, delay_s):
    """Bits 'in flight': R * d_prop fills the pipe one way; R * RTT is what a sender must
    keep unacknowledged to keep the pipe full."""
    return R_bps * delay_s


# ---------------------------------------------------------------- channel capacity
def db_to_ratio(db):
    """SNR in dB -> plain power ratio: SNR = 10**(dB/10)."""
    return 10 ** (db / 10)


def ratio_to_db(snr):
    """Plain power ratio -> dB: 10*log10(SNR)."""
    return 10 * math.log10(snr)


def nyquist(B_hz, V_levels):
    """Noiseless channel: max bit rate = 2 * B * log2(V)."""
    return 2 * B_hz * math.log2(V_levels)


def shannon(B_hz, snr_ratio):
    """Noisy channel: capacity C = B * log2(1 + SNR), SNR as a plain ratio (not dB)."""
    return B_hz * math.log2(1 + snr_ratio)


def main():
    print("== 1. Traffic intensity I = La/R ==")
    L, a, R = 12000, 100, 1.5e6          # 1500-byte packets, 100 packets/s, 1.5 Mbps
    I = traffic_intensity(L, a, R)
    print("  L = 12000 b, a = 100 pkt/s, R = 1.5 Mbps -> I = %.2f" % I)
    assert abs(I - 0.8) < 1e-12
    q = kurose_queue_delay(L, R, I)
    print("  Kurose model queuing delay I*L/(R(1-I)) = %.1f ms; plus L/R = %.1f ms -> %.1f ms" %
          (q * 1000, L / R * 1000, (q + L / R) * 1000))
    assert abs(q * 1000 - 32) < 1e-9 and abs((q + L / R) * 1000 - 40) < 1e-9
    for a_test in (50, 100, 120, 125, 150):
        It = traffic_intensity(L, a_test, R)
        verdict = "stable" if It < 1 else "queue grows without bound (loss once the buffer fills)"
        print("    a = %3d pkt/s -> I = %.2f  %s" % (a_test, It, verdict))

    print("\n== 2. Burst of N packets arriving at once ==")
    avg = burst_average_queue_delay(5, 12000, 1.5e6)
    print("  N = 5, L/R = 8 ms -> waits 0, 8, 16, 24, 32 ms, average %.1f ms = (N-1)L/(2R)" % (avg * 1000))
    assert abs(avg * 1000 - 16) < 1e-9

    print("\n== 3. Bandwidth-delay product ==")
    dprop = 20000e3 / 2.5e8               # 20,000 km at 2.5e8 m/s
    bdp = bdp_bits(2e6, dprop)
    print("  20,000 km, s = 2.5e8 m/s -> d_prop = %.0f ms; R = 2 Mbps -> R*d_prop = %.0f bits" % (dprop * 1000, bdp))
    print("  width of one bit on the wire = s/R = %.0f m" % (2.5e8 / 2e6))
    assert abs(bdp - 160000) < 1e-6 and 2.5e8 / 2e6 == 125
    w = bdp_bits(100e6, 0.040)
    print("  100 Mbps x 40 ms RTT = %.0f bits = %.0f bytes must be in flight" % (w, w / 8))
    assert abs(w - 4e6) < 1e-6

    print("\n== 4. Decibels ==")
    for db in (3, 10, 20, 30, 40):
        print("  %2d dB -> SNR = %.1f" % (db, db_to_ratio(db)))
    assert abs(db_to_ratio(30) - 1000) < 1e-9 and abs(ratio_to_db(63) - 17.99) < 0.01

    print("\n== 5. Nyquist (noiseless) ==")
    for V in (2, 4, 8, 16):
        print("  B = 3000 Hz, V = %2d levels -> %.0f bps" % (V, nyquist(3000, V)))
    assert nyquist(3000, 4) == 12000

    print("\n== 6. Shannon (noisy) ==")
    c = shannon(3000, db_to_ratio(30))
    print("  B = 3000 Hz, SNR = 30 dB = 1000 -> C = 3000*log2(1001) = %.1f bps" % c)
    assert abs(c - 29901.7) < 0.1
    c2 = shannon(1e6, 63)
    V = 2 ** (c2 / (2 * 1e6))
    print("  B = 1 MHz, SNR = 63 -> C = %.0f bps; Nyquist levels needed = 2**(C/2B) = %.0f" % (c2, V))
    assert abs(c2 - 6e6) < 1e-3 and abs(V - 8) < 1e-9
    print("\nAll Unit 02 capacity checks passed.")


if __name__ == "__main__":
    main()
