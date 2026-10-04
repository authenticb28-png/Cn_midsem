#!/usr/bin/env python3
"""Unit 09 - TCP echo server and client on 127.0.0.1 with settimeout and retry/backoff.

COVERAGE ids: 09.2 (sockets), 09.7 (3-way handshake happens inside connect/accept),
              09.8 (FIN via shutdown/close, recv() returns b'' at end of stream),
              09.9 (TCP is a byte stream: one send is not one recv).

Level: low (plain socket calls written out by hand, no frameworks).

Run:  python3 Unit09_tcp_echo.py
What it shows, step by step:
  1. We reserve a free port and start the server LATE (after 0.3 s), so the client's
     first connect() attempts are refused (nobody is in LISTEN on that port).
  2. The client retries with exponential backoff: wait 0.05, 0.1, 0.2, 0.4 s between tries.
  3. Once connected we print the connection 4-tuple from both ends.
  4. The client sends with sendall() (never plain send()), then shutdown(SHUT_WR) sends a FIN.
  5. The server's recv() returns b'' (the FIN), it closes, and the client's recv() returns b'' too.
Everything is offline, needs no root and finishes in about one second.
"""
import socket
import threading
import time

HOST = "127.0.0.1"


def pick_free_port():
    """Ask the OS for a free port, then release it so we can start the server on it later."""
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind((HOST, 0))                      # port 0 = "OS, choose any free port"
    port = s.getsockname()[1]
    s.close()                              # nobody listens on it now -> connect() will be refused
    return port


def echo_server(port, ready, log, n_clients=2):
    """Passive open: socket -> bind -> listen -> accept, then echo until the client sends FIN."""
    srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)        # SOCK_STREAM = TCP
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)     # allow re-bind while old sockets sit in TIME_WAIT
    srv.bind((HOST, port))                                         # without bind the OS picks a random port
    srv.listen(5)                                                  # state CLOSED -> LISTEN; backlog of 5
    srv.settimeout(5.0)                                            # accept() will not hang forever
    ready.set()
    for _ in range(n_clients):
        conn, peer = srv.accept()          # returns only after the 3-way handshake completes (ESTABLISHED)
        conn.settimeout(2.0)
        with conn:
            total = 0
            while True:
                chunk = conn.recv(4)       # tiny buffer on purpose: TCP is a byte stream, not messages
                if chunk == b"":           # b'' means the peer sent FIN: no more data will ever come
                    log.append(("server saw EOF from", peer, total))
                    break
                total += len(chunk)
                conn.sendall(chunk)        # sendall loops until every byte is handed to the kernel
        # leaving the with-block closes conn -> our FIN goes to the client
    srv.close()


def connect_with_backoff(port, max_tries=6, base=0.05):
    """Active open with retries. Returns (socket, attempts). Raises after max_tries failures."""
    delay = base
    for attempt in range(1, max_tries + 1):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(1.0)                  # connect() and every later recv() give up after 1 s
        try:
            s.connect((HOST, port))        # sends SYN, waits for SYN-ACK, sends ACK
            return s, attempt
        except (ConnectionRefusedError, socket.timeout) as e:
            s.close()
            print("  attempt %d failed (%s); sleeping %.2f s" % (attempt, type(e).__name__, delay))
            time.sleep(delay)
            delay *= 2                     # exponential backoff: 0.05, 0.1, 0.2, 0.4
    raise ConnectionError("server never came up")


def recv_all(sock):
    """Read until the peer closes (recv returns b''). Works however TCP splits the bytes."""
    parts = []
    while True:
        chunk = sock.recv(1024)
        if not chunk:
            break
        parts.append(chunk)
    return b"".join(parts)


def main():
    port = pick_free_port()
    ready, log = threading.Event(), []

    def late_start():
        time.sleep(0.3)                    # the server is "slow to boot"
        echo_server(port, ready, log)

    t = threading.Thread(target=late_start, daemon=True)
    t.start()

    print("Step 1-2: connecting to %s:%d with retry and exponential backoff" % (HOST, port))
    cli, attempts = connect_with_backoff(port)
    print("  connected after %d attempt(s)" % attempts)
    assert attempts >= 2, "the first attempt must be refused because the server starts late"

    local, remote = cli.getsockname(), cli.getpeername()
    print("Step 3: connection 4-tuple seen by the client = (%s, %d, %s, %d)" % (local[0], local[1], remote[0], remote[1]))
    assert remote[1] == port and local[1] != port   # client uses an ephemeral port, server the fixed one

    msg = b"hello transport layer"
    print("Step 4: sendall(%r) then shutdown(SHUT_WR) = send our FIN" % msg)
    cli.sendall(msg)
    cli.shutdown(socket.SHUT_WR)          # half-close: we can still receive (FIN_WAIT_1 / FIN_WAIT_2)
    echoed = recv_all(cli)                # returns once the server's FIN arrives
    cli.close()
    print("Step 5: echoed back %r; client recv() then returned b'' (server FIN)" % echoed)
    assert echoed == msg

    # Second client: three separate sendall() calls arrive as one byte stream.
    cli2, _ = connect_with_backoff(port)
    for piece in (b"ab", b"cd", b"ef"):
        cli2.sendall(piece)
    cli2.shutdown(socket.SHUT_WR)
    data = recv_all(cli2)
    cli2.close()
    print("Byte-stream demo: three sends of 2 bytes came back as %r (%d bytes)" % (data, len(data)))
    assert data == b"abcdef"

    t.join(timeout=5)
    for entry in log:
        print("  log:", entry[0], entry[1], "after", entry[2], "bytes")
    assert [e[2] for e in log] == [len(msg), 6]
    print("All TCP echo assertions passed.")


if __name__ == "__main__":
    main()
