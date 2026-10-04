"""Unit 02 (high level, socket library): measure real RTT and throughput on localhost.

COVERAGE ids: 02.5, 02.9 (delay you can measure, throughput = bits received / time)
Source: WB-L02 p13 (four delays), p21 (throughput = "what lands").

What it does
  1. Starts a TCP server in a thread on 127.0.0.1, port 0 (the OS picks a free port).
  2. RTT test: the client sends a 1-byte ping 20 times; the server echoes it back.
     time.perf_counter() around each send/recv pair gives one RTT sample.
  3. Throughput test: the client sends 2 MB (2,000,000 bytes) of data; the server counts
     every byte and replies with the count as an 8-byte big-endian integer.
     throughput = 8 * bytes / elapsed seconds.

Run:  python3 Unit02_tcp_throughput.py
No root, no internet: everything stays on the loopback interface.
"""
import socket
import struct
import threading
import time

PAYLOAD_BYTES = 2_000_000          # 2 MB in networking units (10**6), = 16,000,000 bits
CHUNK = 64 * 1024                  # send in 64 KiB pieces
PINGS = 20


def recv_exact(sock, n):
    """TCP is a byte stream: recv() may return fewer bytes than asked, so loop."""
    buf = b""
    while len(buf) < n:
        part = sock.recv(n - len(buf))
        if not part:
            raise ConnectionError("peer closed early")
        buf += part
    return buf


def server(listener, ready):
    """Accept one connection: echo PINGS single bytes, then count a bulk transfer."""
    ready.set()
    conn, _ = listener.accept()
    conn.settimeout(10)
    with conn:
        for _ in range(PINGS):
            conn.sendall(recv_exact(conn, 1))          # echo each ping byte immediately
        expected = struct.unpack("!Q", recv_exact(conn, 8))[0]   # client announces the size
        got = 0
        while got < expected:
            data = conn.recv(CHUNK)
            if not data:
                break
            got += len(data)
        conn.sendall(struct.pack("!Q", got))           # application-level "I got it all"


def main():
    listener = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    listener.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    listener.bind(("127.0.0.1", 0))                    # port 0 = OS-assigned free port
    listener.listen(1)
    listener.settimeout(10)
    port = listener.getsockname()[1]
    ready = threading.Event()
    th = threading.Thread(target=server, args=(listener, ready), daemon=True)
    th.start()
    ready.wait(5)

    cli = socket.create_connection(("127.0.0.1", port), timeout=10)
    cli.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)   # no Nagle: send 1-byte pings at once
    print("Connected to 127.0.0.1:%d" % port)

    # ---------------- RTT
    samples = []
    for i in range(PINGS):
        t0 = time.perf_counter()
        cli.sendall(b"p")
        assert recv_exact(cli, 1) == b"p"
        samples.append((time.perf_counter() - t0) * 1e6)   # microseconds
    samples.sort()
    print("RTT over loopback (%d pings): min %.1f us, median %.1f us, max %.1f us" %
          (PINGS, samples[0], samples[PINGS // 2], samples[-1]))
    print("  Loopback has no propagation over a wire: what you see is processing + queuing")
    print("  inside the kernel and Python, which is why it is microseconds, not milliseconds.")

    # ---------------- throughput
    data = b"x" * CHUNK
    t0 = time.perf_counter()
    cli.sendall(struct.pack("!Q", PAYLOAD_BYTES))
    sent = 0
    while sent < PAYLOAD_BYTES:
        piece = data[:min(CHUNK, PAYLOAD_BYTES - sent)]
        cli.sendall(piece)
        sent += len(piece)
    got = struct.unpack("!Q", recv_exact(cli, 8))[0]   # wait until the receiver has it all
    elapsed = time.perf_counter() - t0
    cli.close()
    th.join(5)
    listener.close()

    bits = got * 8
    mbps = bits / elapsed / 1e6
    print("Sent %d bytes = %d bits; receiver counted %d bytes" % (sent, sent * 8, got))
    print("Elapsed %.4f s -> throughput = %d bits / %.4f s = %.1f Mbps" % (elapsed, bits, elapsed, mbps))
    print("  In MBps (bytes) that is %.1f MBps: divide Mbps by 8." % (mbps / 8))

    # what the same file would take on real links (F / R), for comparison
    for R in (10e6, 100e6, 1e9):
        print("  2 MB over a %5.0f Mbps bottleneck would need at least %.3f s" % (R / 1e6, bits / R))

    assert got == PAYLOAD_BYTES, "receiver must count every byte"
    assert bits == 16_000_000
    assert mbps > 0 and elapsed < 10
    print("Throughput test passed.")


if __name__ == "__main__":
    main()
