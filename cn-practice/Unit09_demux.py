#!/usr/bin/env python3
"""Unit 09 - Demultiplexing: UDP by (dst IP, dst port), TCP by the 4-tuple.

COVERAGE ids: 09.2 (socket = IP + port), 09.3 (multiplexing / demultiplexing).

Level: low (plain sockets on 127.0.0.1, ports chosen by the OS with port 0).

Run:  python3 Unit09_demux.py
Part A: two UDP sockets on two different ports; one sender interleaves datagrams to both.
        Each socket receives ONLY the data addressed to its own port.
Part B: two different senders hit the SAME UDP port. Both datagrams land in the SAME socket,
        because UDP demultiplexes on (dst IP, dst port) only; recvfrom() tells them apart.
Part C: one TCP listening socket, two clients. accept() returns two separate connection
        sockets with the same local (IP, port) but different remote ports: the 4-tuple decides.
Offline, no root, well under one second.
"""
import socket
import threading

HOST = "127.0.0.1"


def udp_socket():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.bind((HOST, 0))
    s.settimeout(2.0)
    return s


def part_a():
    dns_like, game_like = udp_socket(), udp_socket()       # two "applications" on one host
    p_dns, p_game = dns_like.getsockname()[1], game_like.getsockname()[1]
    sender = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    # Multiplexing at the sender: one socket, segments tagged with different destination ports.
    plan = [(p_dns, b"query A example.com"), (p_game, b"player x=10"),
            (p_dns, b"query AAAA example.com"), (p_game, b"player x=11")]
    for port, payload in plan:
        sender.sendto(payload, (HOST, port))
    got_dns = [dns_like.recvfrom(100)[0] for _ in range(2)]
    got_game = [game_like.recvfrom(100)[0] for _ in range(2)]
    print("Part A  port %5d received %r" % (p_dns, got_dns))
    print("        port %5d received %r" % (p_game, got_game))
    assert got_dns == [b"query A example.com", b"query AAAA example.com"]
    assert got_game == [b"player x=10", b"player x=11"]
    for s in (dns_like, game_like, sender):
        s.close()


def part_b():
    server = udp_socket()
    port = server.getsockname()[1]
    alice = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    bob = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    alice.sendto(b"from alice", (HOST, port))
    bob.sendto(b"from bob", (HOST, port))
    seen = [server.recvfrom(100) for _ in range(2)]
    srcs = {addr for _, addr in seen}
    print("Part B  one UDP socket on port %d got %d datagrams from %d different source ports:" % (port, len(seen), len(srcs)))
    for data, addr in seen:
        print("        %r from %s:%d" % (data, addr[0], addr[1]))
    assert len(srcs) == 2                                  # different senders, same receiving socket
    for s in (server, alice, bob):
        s.close()


def part_c():
    lsock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    lsock.bind((HOST, 0))
    lsock.listen(5)
    lsock.settimeout(2.0)
    port = lsock.getsockname()[1]
    results = {}

    def serve_two():
        for _ in range(2):
            conn, peer = lsock.accept()                    # a NEW socket per connection
            conn.settimeout(2.0)
            data = conn.recv(100)
            four = (peer[0], peer[1], conn.getsockname()[0], conn.getsockname()[1])
            results[four] = data
            conn.sendall(b"ok")
            conn.close()

    t = threading.Thread(target=serve_two, daemon=True)
    t.start()
    for name in (b"client-1", b"client-2"):
        c = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        c.settimeout(2.0)
        c.connect((HOST, port))
        c.sendall(name)
        assert c.recv(10) == b"ok"
        c.close()
    t.join(timeout=3)
    lsock.close()
    print("Part C  TCP connections demultiplexed by (src IP, src port, dst IP, dst port):")
    for four, data in results.items():
        print("        %s -> %r" % (four, data))
    dst_ports = {k[3] for k in results}
    src_ports = {k[1] for k in results}
    assert dst_ports == {port}                             # same server port for both
    assert len(src_ports) == 2                             # but different client ports
    assert sorted(results.values()) == [b"client-1", b"client-2"]


if __name__ == "__main__":
    part_a()
    part_b()
    part_c()
    print("All demultiplexing assertions passed.")
