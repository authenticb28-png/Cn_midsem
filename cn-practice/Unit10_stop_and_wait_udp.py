"""Unit 10 - Stop-and-wait ARQ over real UDP sockets on 127.0.0.1 (low level).

COVERAGE rows: 10.5 (stop-and-wait, ACK = N+1, SL-L15/16 of SL-L10), 10.2 (checksum), 10.3 (RTT/timeout).

What it shows
  * UDP gives no reliability, so we build it ourselves: sequence numbers, a 16-bit
    ones'-complement checksum, ACK = next expected number (the slide's "ACK N+1"),
    a retransmission timer, and duplicate detection at the receiver.
  * The channel is made lossy ON PURPOSE: each side drops a datagram with probability
    LOSS and corrupts one bit with probability CORRUPT, using random.Random with a
    fixed seed so the run is repeatable.
  * The header is packed by hand with int.to_bytes (no struct), 8 bytes:
        Type (8 bits) | Reserved (8) | Checksum (16) | Number (32)
    Type 0 = DATA (Number = sequence number N), 1 = ACK (Number = N+1), 2 = FIN.

Run:  python3 Unit10_stop_and_wait_udp.py      (offline, about 1-3 s, exit code 0)
"""
import random
import socket
import threading
import time

LOSS = 0.25          # probability that the channel drops a datagram
CORRUPT = 0.10       # probability that the channel flips one bit
TIMEOUT = 0.15       # retransmission timeout in seconds (RTT on loopback is far smaller)
MAX_TRIES = 30       # give up after this many transmissions of one packet
DATA, ACK, FIN = 0, 1, 2


def inet_checksum(data):
    """16-bit ones'-complement checksum (RFC 1071) written out by hand."""
    if len(data) % 2:
        data += b"\x00"                              # pad to a whole number of 16-bit words
    total = 0
    for i in range(0, len(data), 2):
        total += (data[i] << 8) | data[i + 1]        # big-endian 16-bit word
        total = (total & 0xFFFF) + (total >> 16)     # end-around carry
    return ~total & 0xFFFF


def make_packet(ptype, number, payload=b""):
    body = number.to_bytes(4, "big") + payload
    head = bytes([ptype, 0])
    csum = inet_checksum(head + b"\x00\x00" + body)  # checksum computed with the field = 0
    return head + csum.to_bytes(2, "big") + body


def parse_packet(pkt):
    """Return (type, number, payload) or None if the checksum fails."""
    if len(pkt) < 8:
        return None
    if inet_checksum(pkt) != 0:                      # sum over everything incl. checksum = 0xFFFF
        return None                                  # so its complement is 0 when intact
    return pkt[0], int.from_bytes(pkt[4:8], "big"), pkt[8:]


class LossyChannel:
    """Wraps sendto(): drops or corrupts datagrams using a seeded random generator."""

    def __init__(self, sock, seed, name, log):
        self.sock, self.rng, self.name, self.log = sock, random.Random(seed), name, log
        self.dropped = self.corrupted = 0

    def send(self, pkt, addr, what):
        r = self.rng.random()
        if r < LOSS:
            self.dropped += 1
            self.log("  %-8s %-14s LOST in channel" % (self.name, what))
            return
        if r < LOSS + CORRUPT:
            self.corrupted += 1
            bit = self.rng.randrange(len(pkt) * 8)
            pkt = bytearray(pkt)
            pkt[bit // 8] ^= 1 << (bit % 8)          # flip one bit
            pkt = bytes(pkt)
            self.log("  %-8s %-14s CORRUPTED (bit %d flipped)" % (self.name, what, bit))
        self.sock.sendto(pkt, addr)


def receiver(sock, out, log, ready):
    chan = LossyChannel(sock, seed=7, name="receiver", log=log)
    expected = 0                                     # next sequence number we want
    ready.set()
    while True:
        try:
            pkt, addr = sock.recvfrom(2048)
        except socket.timeout:
            continue
        parsed = parse_packet(pkt)
        if parsed is None:
            log("  receiver got a corrupted datagram -> checksum fails -> discard (no ACK)")
            continue
        ptype, num, payload = parsed
        if ptype == FIN:
            chan.sock.sendto(make_packet(ACK, num + 1), addr)   # FIN-ACK sent reliably to end the demo
            break
        if num == expected:
            out.append(payload.decode())
            expected += 1
            log("  receiver got DATA seq=%d (new) -> deliver, send ACK=%d" % (num, expected))
        else:
            log("  receiver got DATA seq=%d (DUPLICATE) -> discard, re-send ACK=%d" % (num, expected))
        chan.send(make_packet(ACK, expected), addr, "ACK=%d" % expected)
    out.append(("stats", chan.dropped, chan.corrupted))


def sender(sock, addr, messages, log):
    chan = LossyChannel(sock, seed=2026, name="sender", log=log)
    sock.settimeout(TIMEOUT)
    transmissions, rtts = 0, []
    for seq, text in enumerate(messages):
        pkt = make_packet(DATA, seq, text.encode())
        for attempt in range(1, MAX_TRIES + 1):
            transmissions += 1
            log("sender   DATA seq=%d attempt %d" % (seq, attempt))
            t0 = time.perf_counter()
            chan.send(pkt, addr, "DATA seq=%d" % seq)
            got_ack = False
            deadline = t0 + TIMEOUT
            while time.perf_counter() < deadline:
                try:
                    sock.settimeout(max(0.001, deadline - time.perf_counter()))
                    reply, _ = sock.recvfrom(2048)
                except socket.timeout:
                    break
                parsed = parse_packet(reply)
                if parsed is None:
                    log("  sender got a corrupted ACK -> ignore")
                    continue
                if parsed[0] == ACK and parsed[1] == seq + 1:     # ACK = N+1 confirms N
                    if attempt == 1:
                        rtts.append((time.perf_counter() - t0) * 1000)   # Karn: first tries only
                    got_ack = True
                    break
                log("  sender got stale ACK=%d -> ignore" % parsed[1])
            if got_ack:
                log("sender   ACK=%d received -> packet %d done" % (seq + 1, seq))
                break
            log("sender   TIMEOUT for seq=%d -> retransmit" % seq)
        else:
            raise RuntimeError("gave up on seq %d" % seq)
    sock.settimeout(1.0)
    sock.sendto(make_packet(FIN, len(messages)), addr)  # end of demo (not passed through the lossy channel)
    sock.recvfrom(2048)
    return transmissions, rtts, chan.dropped, chan.corrupted


def main():
    lines = []
    log = lines.append
    rsock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    rsock.bind(("127.0.0.1", 0))                     # port 0: the OS picks a free port
    rsock.settimeout(0.2)
    addr = rsock.getsockname()
    delivered, ready = [], threading.Event()
    t = threading.Thread(target=receiver, args=(rsock, delivered, log, ready), daemon=True)
    t.start()
    ready.wait(2)

    ssock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    ssock.bind(("127.0.0.1", 0))
    messages = ["msg-%d" % i for i in range(8)]
    start = time.perf_counter()
    sent, rtts, s_drop, s_corr = sender(ssock, addr, messages, log)
    t.join(3)
    elapsed = time.perf_counter() - start
    ssock.close()
    rsock.close()

    print("Stop-and-wait over UDP on %s:%d, loss %.0f%%, corruption %.0f%%, timeout %.0f ms"
          % (addr[0], addr[1], LOSS * 100, CORRUPT * 100, TIMEOUT * 1000))
    for line in lines:
        print(line)
    stats = delivered.pop()
    print("\nmessages delivered in order:", delivered)
    print("transmissions of DATA: %d for %d messages (%.2f per message)" % (sent, len(messages), sent / len(messages)))
    print("sender channel: %d dropped, %d corrupted; receiver channel: %d dropped, %d corrupted"
          % (s_drop, s_corr, stats[1], stats[2]))
    if rtts:
        print("loopback RTT samples from first transmissions (ms): " + ", ".join("%.3f" % r for r in rtts))
    print("elapsed %.2f s" % elapsed)

    # self-tests
    assert delivered == messages, "every message delivered exactly once, in order"
    assert sent >= len(messages)
    assert make_packet(ACK, 5)[0] == ACK and parse_packet(make_packet(ACK, 5))[1] == 5
    bad = bytearray(make_packet(DATA, 3, b"hi"))
    bad[9] ^= 0x01
    assert parse_packet(bytes(bad)) is None, "a flipped bit must fail the checksum"
    assert elapsed < 12
    print("All stop-and-wait self-tests passed.")


if __name__ == "__main__":
    main()
