#!/usr/bin/env python3
"""Unit 09 - UDP server and client with application-level timeout and retransmission.

COVERAGE ids: 09.5 (UDP is connectionless: no handshake, no ACK, no retransmission in the
              protocol itself), 09.6 (apps such as DNS, SNMP, TFTP and DHCP add their own
              timeout + retry on top of UDP), 09.11 (what TCP would have done for us).

Level: low (raw SOCK_DGRAM sockets, hand-written stop-and-wait with sequence numbers).

Run:  python3 Unit09_udp_retx.py
The server deliberately "loses" the first copy of datagrams 1 and 3. The client numbers every
datagram, waits for "ACK <seq>", and on a timeout retransmits with a doubling timeout
(0.1 s, 0.2 s, 0.4 s). Expected result: 5 messages need 7 transmissions in total.
Offline, no root, about one second.
"""
import socket
import threading

HOST = "127.0.0.1"
DROP_FIRST_COPY_OF = {1, 3}               # simulated loss, decided by the server


def udp_server(sock, stats):
    """Connectionless server: no listen(), no accept(); just recvfrom() and sendto()."""
    seen = set()
    while True:
        data, client = sock.recvfrom(2048)                 # one call = one whole datagram
        if data == b"BYE":
            break
        seq_text, _, payload = data.partition(b"|")
        seq = int(seq_text)
        stats["arrivals"] += 1
        if seq in DROP_FIRST_COPY_OF and seq not in seen:
            seen.add(seq)                                  # pretend the network dropped it
            print("    server: dropped first copy of seq %d" % seq)
            continue
        seen.add(seq)
        stats["delivered"].append(payload)
        sock.sendto(b"ACK " + seq_text, client)            # reply to whatever address sent it


def send_reliably(sock, server_addr, seq, payload, max_tries=5, first_timeout=0.1):
    """Stop-and-wait over UDP: send, wait for the matching ACK, retransmit on timeout."""
    timeout = first_timeout
    for attempt in range(1, max_tries + 1):
        sock.sendto(b"%d|" % seq + payload, server_addr)  # no connect() needed for UDP
        sock.settimeout(timeout)
        try:
            while True:
                reply, _ = sock.recvfrom(2048)
                if reply == b"ACK %d" % seq:
                    return attempt
                # an ACK for an older seq (a late duplicate) is ignored; keep waiting
        except socket.timeout:
            print("  client: timeout %.1f s for seq %d, retransmitting" % (timeout, seq))
            timeout *= 2                                   # back off so we do not flood a busy server
    raise TimeoutError("seq %d: no ACK after %d tries" % (seq, max_tries))


def main():
    srv = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)   # SOCK_DGRAM = UDP
    srv.bind((HOST, 0))                                      # a UDP server MUST bind to a known port
    srv.settimeout(5.0)
    addr = srv.getsockname()
    stats = {"arrivals": 0, "delivered": []}
    t = threading.Thread(target=udp_server, args=(srv, stats), daemon=True)
    t.start()

    cli = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)  # the client's port is chosen at first sendto
    messages = [b"msg-0", b"msg-1", b"msg-2", b"msg-3", b"msg-4"]
    total_tx = 0
    print("Sending %d messages to %s:%d over UDP with stop-and-wait" % (len(messages), addr[0], addr[1]))
    for seq, m in enumerate(messages):
        tries = send_reliably(cli, addr, seq, m)
        total_tx += tries
        print("  seq %d delivered after %d transmission(s)" % (seq, tries))

    cli.sendto(b"BYE", addr)
    t.join(timeout=5)
    srv.close()
    cli.close()

    print("Transmissions: %d, arrivals at server: %d, delivered: %r" % (total_tx, stats["arrivals"], stats["delivered"]))
    assert total_tx == len(messages) + len(DROP_FIRST_COPY_OF) == 7
    assert stats["delivered"] == messages                  # in order, no duplicates
    assert stats["arrivals"] == 7

    # Message boundaries: UDP keeps each datagram separate; a too-small buffer truncates it.
    r = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    r.bind((HOST, 0))
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.sendto(b"ab", r.getsockname())
    s.sendto(b"cd", r.getsockname())
    r.settimeout(1.0)
    first = r.recvfrom(10)[0]
    second = r.recvfrom(10)[0]
    print("Two sendto() calls arrive as two datagrams: %r and %r" % (first, second))
    assert (first, second) == (b"ab", b"cd")
    r.close()
    s.close()
    print("All UDP retransmission assertions passed.")


if __name__ == "__main__":
    main()
