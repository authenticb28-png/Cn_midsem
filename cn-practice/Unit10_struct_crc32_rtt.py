"""Unit 10 - Library-level tools: zlib/binascii CRC-32, struct packing with a checksum,
a ping-output parser, and an RTT estimator (Jacobson/Karels, RFC 6298) with Karn's rule.

COVERAGE rows
  10.3  RTT from the SL-L10 p12 ping captures: averages 25.893 ms and 446.721 ms
  10.11 CRC-32: our bitwise version must equal zlib.crc32 and binascii.crc32
  10.12 EstimatedRTT = (1 - 1/8) Est + 1/8 Sample, DevRTT = (1 - 1/4) Dev + 1/4 |Sample - Est|,
        TimeoutInterval = Est + 4 Dev; Karn's algorithm; exponential backoff
  10.2  struct-packed TCP header whose checksum makes the ones'-complement sum all ones

Run:  python3 Unit10_struct_crc32_rtt.py      (offline, about 0.1 s)
"""
import binascii
import re
import socket
import statistics
import struct
import threading
import time
import zlib


# ---------------------------------------------------------------- CRC-32
def crc32_bitwise(data):
    """CRC-32 (IEEE 802.3, used by Ethernet, zip, PNG): reflected polynomial 0xEDB88320,
    initial value 0xFFFFFFFF, final XOR 0xFFFFFFFF. One bit at a time, no table."""
    crc = 0xFFFFFFFF
    for byte in data:
        crc ^= byte                                   # bring the next 8 message bits in
        for _ in range(8):
            if crc & 1:
                crc = (crc >> 1) ^ 0xEDB88320         # low bit 1: shift and subtract (XOR) G
            else:
                crc >>= 1                             # low bit 0: just shift
    return crc ^ 0xFFFFFFFF


def demo_crc32():
    print("=== CRC-32: hand-written vs zlib.crc32 vs binascii.crc32 ===")
    for name, msg in (("'123456789'", b"123456789"), ("'Reliable Data Transfer'", b"Reliable Data Transfer"),
                      ("bytes 0x00 to 0xFF", bytes(range(256)))):
        mine, z, b = crc32_bitwise(msg), zlib.crc32(msg), binascii.crc32(msg)
        print("  %-26s ours 0x%08X  zlib 0x%08X  binascii 0x%08X" % (name, mine, z, b))
        assert mine == z == b
    assert crc32_bitwise(b"123456789") == 0xCBF43926       # the standard CRC-32 check value
    frame = b"hello, receiver"
    fcs = struct.pack("<I", zlib.crc32(frame))               # Ethernet sends the FCS little-endian
    received = bytearray(frame + fcs)
    received[3] ^= 0x10                                      # one bit flips on the wire
    ok = zlib.crc32(bytes(received[:-4])) == struct.unpack("<I", bytes(received[-4:]))[0]
    print("  frame with one flipped bit passes the CRC check? %s\n" % ok)
    assert not ok


# ---------------------------------------------------------------- struct + Internet checksum
def inet_checksum(data):
    if len(data) % 2:
        data += b"\x00"
    total = sum(struct.unpack("!%dH" % (len(data) // 2), data))   # all 16-bit words at once
    while total >> 16:
        total = (total & 0xFFFF) + (total >> 16)                   # fold every carry back in
    return ~total & 0xFFFF


def demo_struct():
    print("=== struct: 8-bit example of SL-L10 p8 and a 20-byte TCP header with checksum ===")
    two = struct.pack("!BB", 0b10010011, 0b01010110)
    s = sum(struct.unpack("!BB", two))
    s = (s & 0xFF) + (s >> 8)
    print("  bytes %s -> sum %s -> checksum %s" % (two.hex(), format(s, "08b"), format(~s & 0xFF, "08b")))
    assert s == 0b11101001 and ~s & 0xFF == 0b00010110

    src, dst = socket.inet_aton("127.0.0.1"), socket.inet_aton("127.0.0.1")
    payload = b"ping"
    hdr = struct.pack("!HHIIBBHHH", 50000, 7, 1000, 0, 5 << 4, 0x18, 4096, 0, 0)  # PSH+ACK, rwnd 4096
    pseudo = struct.pack("!4s4sBBH", src, dst, 0, socket.IPPROTO_TCP, len(hdr) + len(payload))
    csum = inet_checksum(pseudo + hdr + payload)
    seg = bytearray(hdr)
    struct.pack_into("!H", seg, 16, csum)                    # checksum lives at byte offset 16
    sport, dport, seq, ack, off, flags, win, ck, urg = struct.unpack("!HHIIBBHHH", bytes(seg))
    print("  TCP header %s" % bytes(seg).hex())
    print("  sport=%d dport=%d seq=%d hdr_len=%d B flags=0x%02X window(rwnd)=%d checksum=0x%04X"
          % (sport, dport, seq, (off >> 4) * 4, flags, win, ck))
    assert len(seg) == 20 and win == 4096 and (off >> 4) * 4 == 20
    assert inet_checksum(pseudo + bytes(seg) + payload) == 0   # receiver: sum is all ones
    print("  receiver recomputes over pseudo-header + segment -> 0x0000 -> accept\n")


# ---------------------------------------------------------------- ping parser (SL-L10 p12)
PING_NEAR = """64 bytes from 99.83.190.102: icmp_seq=0 ttl=249 time=24.607 ms
64 bytes from 99.83.190.102: icmp_seq=1 ttl=249 time=23.815 ms
64 bytes from 99.83.190.102: icmp_seq=2 ttl=249 time=24.538 ms
64 bytes from 99.83.190.102: icmp_seq=3 ttl=249 time=30.614 ms"""
PING_FAR_TIMES = [429.367, 432.486, 478.576, 502.599, 523.929, 443.412, 461.422, 432.035, 428.674,
                  431.996, 430.521, 434.289, 430.696, 428.899, 431.847, 429.329, 440.055, 464.146,
                  433.413]


def demo_ping():
    print("=== 10.3  RTT from the slide's ping output ===")
    near = [float(x) for x in re.findall(r"time=([\d.]+) ms", PING_NEAR)]
    for name, xs in (("newtonschool.co", near), ("taobao.com", PING_FAR_TIMES)):
        avg, sd = statistics.mean(xs), statistics.pstdev(xs)
        print("  %-16s n=%2d min %.3f avg %.3f max %.3f stddev %.3f ms"
              % (name, len(xs), min(xs), avg, max(xs), sd))
    assert abs(statistics.mean(near) - 25.893) < 0.001 and abs(statistics.pstdev(near) - 2.743) < 0.001
    assert abs(statistics.mean(PING_FAR_TIMES) - 446.721) < 0.001
    assert abs(statistics.pstdev(PING_FAR_TIMES) - 26.781) < 0.001
    # Stop-and-wait with one 1460-byte segment per RTT:
    for name, rtt in (("near", 25.893), ("far", 446.721)):
        print("  stop-and-wait, 1460 B per RTT, %s: %.1f kbit/s" % (name, 1460 * 8 / (rtt / 1000) / 1000))
    print()


# ---------------------------------------------------------------- RTT estimator (RFC 6298 + Karn)
class RttEstimator:
    ALPHA, BETA, K = 1 / 8, 1 / 4, 4

    def __init__(self, est=None, dev=None, min_rto=0.0):
        self.est, self.dev, self.min_rto = est, dev, min_rto
        self.backoff = 1                                  # multiplier after timeouts (Karn)

    def sample(self, rtt, retransmitted=False):
        """Feed one measured RTT. Karn: a sample from a retransmitted segment is ambiguous
        (which copy is being ACKed?) so it is ignored and the backed-off RTO is kept."""
        if retransmitted:
            return False
        if self.est is None:                              # first measurement (RFC 6298 2.2)
            self.est, self.dev = rtt, rtt / 2
        else:                                             # RFC 6298 2.3: DevRTT uses the OLD Est
            self.dev = (1 - self.BETA) * self.dev + self.BETA * abs(rtt - self.est)
            self.est = (1 - self.ALPHA) * self.est + self.ALPHA * rtt
        self.backoff = 1                                  # a valid sample cancels the backoff
        return True

    @property
    def timeout(self):
        return max(self.min_rto, self.est + self.K * self.dev) * self.backoff

    def on_timeout(self):
        self.backoff *= 2                                 # exponential backoff: double the RTO


def demo_rtt_estimator():
    print("=== 10.12  RTT estimation: Est0 = 100 ms, Dev0 = 20 ms, samples 120, 80, 140, 100 ===")
    e = RttEstimator(est=100.0, dev=20.0)
    expected = [(20.0, 102.5, 182.5), (20.625, 99.6875, 182.1875),
                (25.546875, 104.7265625, 206.9140625), (20.341796875, 104.1357421875, 185.5029296875)]
    print("  %-6s %-8s %-14s %-14s %-14s" % ("step", "Sample", "DevRTT", "EstimatedRTT", "Timeout"))
    for i, (s, want) in enumerate(zip((120, 80, 140, 100), expected), 1):
        e.sample(s)
        print("  %-6d %-8d %-14.6f %-14.6f %-14.6f" % (i, s, e.dev, e.est, e.timeout))
        assert abs(e.dev - want[0]) < 1e-9 and abs(e.est - want[1]) < 1e-9 and abs(e.timeout - want[2]) < 1e-9

    k = RttEstimator()                                    # first-sample rule
    k.sample(400.0)
    assert (k.est, k.dev, k.timeout) == (400.0, 200.0, 1200.0)
    k.on_timeout()
    k.on_timeout()                                        # two timeouts: RTO x 4
    assert k.timeout == 4800.0
    assert not k.sample(900.0, retransmitted=True)        # Karn: ignore the ambiguous sample
    assert k.timeout == 4800.0
    k.sample(420.0)                                       # a clean sample resets the backoff
    print("  first sample 400 -> Est 400, Dev 200, RTO 1200; two timeouts -> 4800;"
          " retransmitted sample ignored; clean 420 -> RTO %.1f" % k.timeout)
    assert abs(k.timeout - (0.875 * 400 + 0.125 * 420 + 4 * (0.75 * 200 + 0.25 * 20))) < 1e-9
    print()


def demo_live_loopback():
    print("=== Live: UDP echo on 127.0.0.1, five measured RTTs fed to the estimator ===")
    srv = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    srv.bind(("127.0.0.1", 0))                            # OS-assigned port
    srv.settimeout(2)

    def echo():
        for _ in range(5):
            data, addr = srv.recvfrom(1024)
            srv.sendto(data, addr)

    th = threading.Thread(target=echo, daemon=True)
    th.start()
    cli = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    cli.settimeout(2)
    est = RttEstimator()
    for i in range(5):
        t0 = time.perf_counter()
        cli.sendto(struct.pack("!I", i), srv.getsockname())
        data, _ = cli.recvfrom(1024)
        rtt_ms = (time.perf_counter() - t0) * 1000
        assert struct.unpack("!I", data)[0] == i
        est.sample(rtt_ms)
        print("  ping %d: %.3f ms -> Est %.3f ms, Dev %.3f ms, RTO %.3f ms" % (i, rtt_ms, est.est, est.dev, est.timeout))
    th.join(2)
    cli.close()
    srv.close()
    assert est.timeout > est.est > 0
    print()


if __name__ == "__main__":
    demo_crc32()
    demo_struct()
    demo_ping()
    demo_rtt_estimator()
    demo_live_loopback()
    print("All Unit 10 library-level self-tests passed.")
