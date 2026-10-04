#!/usr/bin/env python3
"""Unit 03 - service, interface and protocol seen from a real socket on 127.0.0.1.

COVERAGE ids: 03.12 (service / interface / protocol; which layer the application controls),
03.5 (Session layer idea: sockets open, use and close a conversation), 03.10 (bytes on the wire).
Level: HIGH (socket, threading).

Run:  python3 Unit03_layers_socket.py

What it shows:
  * The application (Layer 7) only calls the socket INTERFACE: connect, sendall, recv, close.
  * The SERVICE it gets from Layer 4 (TCP) is a reliable, in-order byte stream identified by a
    4-tuple (src IP, src port, dst IP, dst port).
  * The PROTOCOL headers (TCP 20 B, IP 20 B, Ethernet 14 B + FCS 4 B) are added by the
    operating system, never by the application. The script estimates those bytes.
"""
import socket
import threading
import time

REQUEST = b"GET /hello HTTP/1.1\r\nHost: 127.0.0.1\r\n\r\n"


def server(listener, ready, log):
    ready.set()
    conn, peer = listener.accept()
    with conn:
        conn.settimeout(3)
        data = b""
        while b"\r\n\r\n" not in data:          # read until the end of the HTTP header block
            chunk = conn.recv(1024)
            if not chunk:
                break
            data += chunk
        log["server_saw"] = data
        log["server_4tuple"] = (conn.getsockname(), peer)
        body = b"hello"
        reply = b"HTTP/1.1 200 OK\r\nContent-Length: 5\r\n\r\n" + body
        conn.sendall(reply)


def client(port, attempts=3):
    """Connect with a timeout and a simple retry loop, send one request, read the reply."""
    last_err = None
    for attempt in range(1, attempts + 1):
        try:
            with socket.create_connection(("127.0.0.1", port), timeout=2) as s:
                local, remote = s.getsockname(), s.getpeername()
                s.sendall(REQUEST)
                reply = b""
                while True:
                    chunk = s.recv(1024)
                    if not chunk:
                        break
                    reply += chunk
                return reply, (local, remote), attempt
        except OSError as e:
            last_err = e
            time.sleep(0.2 * attempt)            # back off a little before the next try
    raise RuntimeError("could not reach server: %s" % last_err)


def on_wire_bytes(app_bytes, mss=1460):
    """Bytes the OS would put on an Ethernet link for app_bytes of application data
    (data segments only; handshake and ACK segments are not counted)."""
    total = 0
    remaining = app_bytes
    while remaining > 0:
        chunk = min(mss, remaining)
        frame = max(14 + 20 + 20 + chunk, 60) + 4     # pad to the 64-byte minimum frame
        total += frame
        remaining -= chunk
    return total


def main():
    listener = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    listener.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    listener.bind(("127.0.0.1", 0))                   # port 0: the OS picks a free port
    listener.listen(1)
    listener.settimeout(5)
    port = listener.getsockname()[1]
    ready, log = threading.Event(), {}
    t = threading.Thread(target=server, args=(listener, ready, log), daemon=True)
    t.start()
    ready.wait(2)

    reply, (local, remote), attempt = client(port)
    t.join(3)
    listener.close()

    print("=== What each layer sees ===")
    print("L7 (our code) sent      :", REQUEST)
    print("L7 (our code) received  :", reply)
    print("L4 service: TCP byte stream, 4-tuple = %s:%d -> %s:%d (connected on attempt %d)"
          % (local[0], local[1], remote[0], remote[1], attempt))
    print("L3: IP header with src/dst 127.0.0.1, protocol 6 (added by the kernel)")
    print("L2/L1: loopback has no real Ethernet; on a LAN the NIC would add MAC header + FCS")

    assert log["server_saw"] == REQUEST
    assert reply.endswith(b"\r\n\r\nhello")
    assert remote == ("127.0.0.1", port)
    assert local[1] != port                           # the client got its own ephemeral port

    print("\n=== Bytes the application never writes ===")
    for n in (len(REQUEST), 1460, 3000):
        w = on_wire_bytes(n)
        print("%5d B of data -> %5d B of Ethernet frames (%.2f%% efficiency)" % (n, w, 100 * n / w))
    assert on_wire_bytes(len(REQUEST)) == 14 + 20 + 20 + len(REQUEST) + 4
    assert on_wire_bytes(1460) == 1518
    assert on_wire_bytes(3000) == 1518 + 1518 + (14 + 20 + 20 + 80 + 4)
    print("\nAll self-tests passed.")


if __name__ == "__main__":
    main()
