"""Drill model solution - UDP stop-and-wait client with timeout and retry on 127.0.0.1.

COVERAGE rows: 10.5 (stop-and-wait: send, wait for ACK, retransmit on timeout),
09.5 (UDP sockets: sendto / recvfrom), 05.3 (socket API).

The server thread deliberately ignores the FIRST datagram it receives (a simulated loss),
so the client must time out once and retransmit: exactly 2 attempts.

Socket & Scripting Drill question d-sock-32.
Run:  python3 Drill_udp_retry.py      (offline, no root, finishes in about 0.5 s, exits 0)
"""
import socket
import threading

TIMEOUT = 0.3   # seconds the client waits for each ACK
RETRIES = 4     # maximum number of transmissions


def lossy_ack_server(sock: socket.socket, drop_first: int, stop: threading.Event) -> None:
    """Reply 'ACK n' to every 'SEQ n payload' datagram, except the first `drop_first` ones."""
    seen = 0
    sock.settimeout(0.1)                      # wake up regularly to check the stop flag
    while not stop.is_set():
        try:
            data, addr = sock.recvfrom(1024)  # recvfrom: UDP needs the sender's address to reply
        except socket.timeout:
            continue
        seen += 1
        if seen <= drop_first:
            print("  server: dropped datagram %d (%r) to simulate loss" % (seen, data))
            continue
        seq = data.split()[1]                 # b'SEQ 0 hello' -> b'0'
        sock.sendto(b"ACK " + seq, addr)
        print("  server: received %r, sent ACK %s" % (data, seq.decode()))


def send_reliable(sock: socket.socket, addr, seq: int, payload: bytes, retries: int = RETRIES) -> int:
    """Stop-and-wait: send, wait for the matching ACK, retransmit on timeout. Return attempts used."""
    sock.settimeout(TIMEOUT)
    message = b"SEQ %d " % seq + payload
    for attempt in range(1, retries + 1):
        sock.sendto(message, addr)
        print("client: attempt %d, sent %r" % (attempt, message))
        try:
            reply, _ = sock.recvfrom(1024)
        except socket.timeout:                # no ACK within TIMEOUT: retransmit
            print("client: timeout after %.1f s" % TIMEOUT)
            continue
        if reply == b"ACK %d" % seq:         # ignore stale or wrong ACKs
            print("client: got %r" % reply)
            return attempt
    raise TimeoutError("no ACK after %d attempts" % retries)


def main():
    server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server.bind(("127.0.0.1", 0))             # port 0: the OS picks a free port
    addr = server.getsockname()
    stop = threading.Event()
    t = threading.Thread(target=lossy_ack_server, args=(server, 1, stop), daemon=True)
    t.start()

    client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        attempts = send_reliable(client, addr, 0, b"hello")
        print("delivered SEQ 0 after %d attempts" % attempts)
        assert attempts == 2, attempts
        attempts = send_reliable(client, addr, 1, b"world")   # no loss now: first try works
        print("delivered SEQ 1 after %d attempt" % attempts)
        assert attempts == 1, attempts
    finally:
        stop.set()
        t.join(timeout=2)
        client.close()
        server.close()
    print("UDP retry assertions passed.")


if __name__ == "__main__":
    main()
