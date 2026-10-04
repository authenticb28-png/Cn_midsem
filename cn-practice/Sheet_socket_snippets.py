#!/usr/bin/env python3
"""Sheet_socket_snippets.py: the 20 Python networking snippets from the Last-Night Formula Sheet.

Topic   : sockets (TCP, UDP, timeouts, framing, multiplexing, threads), struct header packing,
          the Internet checksum, byte order, ipaddress, getaddrinfo, ssl, http.client, socketserver.
Covers  : formula-sheet section 9 (supports COVERAGE rows 05.3, 09.5, 09.7, 09.10, 09.12, 10.2,
          10.11, 13.6, 13.11, 14.2, 06.7).
Run     : python3 Sheet_socket_snippets.py
Behaviour: every snippet is a function with a docstring. main() runs all 20 against servers that
          this script starts itself on 127.0.0.1 with OS-assigned ports (port 0), so it needs no
          internet, no root, finishes in about one second and exits 0 when every assert passes.
"""
import http.client
import http.server
import ipaddress
import json
import selectors
import socket
import socketserver
import ssl
import struct
import sys
import threading
import time

HOST = "127.0.0.1"   # loopback only: nothing leaves the machine
TIMEOUT = 3.0        # seconds; every blocking call in this file is bounded by this


def _loopback_pair():
    """Helper (not one of the 20): return two connected TCP sockets (client, server side) on 127.0.0.1."""
    lst = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    lst.bind((HOST, 0))                      # port 0 = let the OS pick a free port
    lst.listen(1)
    cli = socket.create_connection(lst.getsockname(), timeout=TIMEOUT)
    srv, _ = lst.accept()                    # the 3-way handshake already finished inside the kernel
    srv.settimeout(TIMEOUT)
    lst.close()                              # the listening socket is no longer needed
    return cli, srv


# ---------------------------------------------------------------- 1. TCP server
def tcp_server(max_clients=1):
    """#1 TCP server: socket() -> bind() -> listen() -> accept() -> recv()/sendall() -> close().

    Binds to 127.0.0.1 port 0 in the caller's thread (so the port is known before any client
    connects), then serves `max_clients` connections in a background thread, echoing each
    message back in upper case. Returns (port, thread)."""
    srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)   # AF_INET = IPv4, SOCK_STREAM = TCP
    srv.bind((HOST, 0))
    srv.listen(5)                                             # backlog of 5 pending connections
    srv.settimeout(TIMEOUT)
    port = srv.getsockname()[1]

    def run():
        with srv:
            for _ in range(max_clients):
                conn, addr = srv.accept()                     # new socket per client (4-tuple)
                with conn:
                    conn.settimeout(TIMEOUT)
                    data = conn.recv(1024)                    # up to 1024 bytes, may be fewer
                    conn.sendall(data.upper())                # sendall loops until every byte is sent

    t = threading.Thread(target=run, daemon=True)
    t.start()
    return port, t


# ---------------------------------------------------------------- 2. TCP client
def tcp_client(port, message):
    """#2 TCP client: create_connection() does socket() + connect() (the 3-way handshake),
    then sendall() the request and recv() the reply. Returns the reply bytes."""
    with socket.create_connection((HOST, port), timeout=TIMEOUT) as s:
        s.sendall(message)
        return s.recv(1024)


# ---------------------------------------------------------------- 3. UDP server
def udp_server(max_msgs=1, drop_first=0):
    """#3 UDP server: socket(SOCK_DGRAM) -> bind() -> recvfrom() -> sendto(addr).

    No listen()/accept(): every datagram carries the sender address. `drop_first` datagrams are
    silently ignored to simulate loss (used by snippet #5). Returns (port, thread)."""
    srv = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)    # SOCK_DGRAM = UDP
    srv.bind((HOST, 0))
    srv.settimeout(TIMEOUT)
    port = srv.getsockname()[1]

    def run():
        with srv:
            answered, seen = 0, 0
            while answered < max_msgs:
                data, addr = srv.recvfrom(2048)               # one call = exactly one datagram
                seen += 1
                if seen <= drop_first:
                    continue                                  # pretend this datagram was lost
                srv.sendto(b"ECHO:" + data, addr)
                answered += 1

    t = threading.Thread(target=run, daemon=True)
    t.start()
    return port, t


# ---------------------------------------------------------------- 4. UDP client
def udp_client(port, message):
    """#4 UDP client: sendto() a datagram, recvfrom() the answer. No connection, no handshake."""
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.settimeout(TIMEOUT)
        s.sendto(message, (HOST, port))
        data, _addr = s.recvfrom(2048)
        return data


# ---------------------------------------------------------------- 5. settimeout + retry
def udp_request_with_retry(port, message, timeout=0.3, retries=4):
    """#5 settimeout() + retry: UDP gives no reliability, so the application retransmits.

    Each attempt waits `timeout` seconds; socket.timeout means 'assume lost, send again'.
    Returns (reply, attempts_used). Raises TimeoutError after `retries` failed attempts."""
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.settimeout(timeout)
        for attempt in range(1, retries + 1):
            s.sendto(message, (HOST, port))
            try:
                data, _ = s.recvfrom(2048)
                return data, attempt
            except socket.timeout:
                print("    attempt %d timed out after %.1f s, retransmitting" % (attempt, timeout))
        raise TimeoutError("no reply after %d attempts" % retries)


# ---------------------------------------------------------------- 6. sendall + length-prefixed framing
def send_framed(sock, payload):
    """#6a Length-prefixed framing: TCP is a byte stream with no message boundaries, so put a
    4-byte big-endian length ('!I') in front of every message and sendall() both together."""
    sock.sendall(struct.pack("!I", len(payload)) + payload)


def recv_exact(sock, n):
    """#6b Read exactly n bytes: recv() may return fewer bytes than asked, so loop."""
    buf = b""
    while len(buf) < n:
        chunk = sock.recv(n - len(buf))
        if not chunk:                                         # b"" = peer closed the connection
            raise ConnectionError("peer closed after %d of %d bytes" % (len(buf), n))
        buf += chunk
    return buf


def recv_framed(sock):
    """#6c Receive one framed message: read the 4-byte header, then exactly that many bytes."""
    (length,) = struct.unpack("!I", recv_exact(sock, 4))
    return recv_exact(sock, length)


# ---------------------------------------------------------------- 7. recv loop until a delimiter
def recv_until(sock, delim=b"\r\n", bufsize=4):
    """#7 Delimiter framing (how HTTP, SMTP and POP3 read lines): keep calling recv() and
    appending to a buffer until the delimiter appears. A tiny bufsize proves the loop works."""
    buf = b""
    while delim not in buf:
        chunk = sock.recv(bufsize)
        if not chunk:
            raise ConnectionError("connection closed before delimiter")
        buf += chunk
    line, _sep, _rest = buf.partition(delim)                  # bytes after delim would belong to the next line
    return line


# ---------------------------------------------------------------- 8. SO_REUSEADDR
def reuseaddr_rebind():
    """#8 SO_REUSEADDR: after the server closes first, its side of the connection sits in
    TIME_WAIT (2 x MSL). Setting SO_REUSEADDR *before* bind() lets a restarted server bind the
    same port immediately. Returns the port that was re-bound."""
    first = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    first.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    first.bind((HOST, 0))
    first.listen(1)
    port = first.getsockname()[1]
    cli = socket.create_connection((HOST, port), timeout=TIMEOUT)
    conn, _ = first.accept()
    conn.close()                                              # server does the active close -> TIME_WAIT
    first.close()
    cli.close()
    again = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    again.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)   # must come before bind()
    assert again.getsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR) != 0
    again.bind((HOST, port))                                  # succeeds despite TIME_WAIT
    again.listen(1)
    again.close()
    return port


# ---------------------------------------------------------------- 9. selectors multi-client server
def selectors_server(n_clients):
    """#9 One thread, many clients: the selectors module (epoll/kqueue/select underneath) tells
    us which sockets are readable, so a single loop serves every client without blocking.
    Each client sends one line and gets it back reversed. Returns (port, thread)."""
    sel = selectors.DefaultSelector()
    lst = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    lst.bind((HOST, 0))
    lst.listen(16)
    lst.setblocking(False)                                    # selectors require non-blocking sockets
    sel.register(lst, selectors.EVENT_READ, data=None)        # data=None marks the listening socket
    port = lst.getsockname()[1]

    def run():
        finished = 0
        deadline = time.time() + TIMEOUT
        while finished < n_clients and time.time() < deadline:
            for key, _mask in sel.select(timeout=0.2):
                if key.data is None:                          # listening socket readable = new client
                    conn, _addr = key.fileobj.accept()
                    conn.setblocking(False)
                    sel.register(conn, selectors.EVENT_READ, data=b"")
                else:                                         # client socket readable = data or EOF
                    conn = key.fileobj
                    chunk = conn.recv(1024)
                    buf = key.data + chunk
                    if chunk and b"\n" not in buf:
                        sel.modify(conn, selectors.EVENT_READ, data=buf)
                        continue
                    if buf:
                        conn.setblocking(True)
                        conn.sendall(buf.strip()[::-1] + b"\n")
                    sel.unregister(conn)
                    conn.close()
                    finished += 1
        sel.unregister(lst)
        lst.close()
        sel.close()

    t = threading.Thread(target=run, daemon=True)
    t.start()
    return port, t


# ---------------------------------------------------------------- 10. threaded server
def threaded_server(n_clients):
    """#10 Thread-per-client server: the main loop only accept()s; each connection is handed to
    its own thread, so one slow client cannot block the others. Replies with the byte count of
    the request. Returns (port, accept_thread)."""
    lst = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    lst.bind((HOST, 0))
    lst.listen(16)
    lst.settimeout(TIMEOUT)
    port = lst.getsockname()[1]

    def handle(conn):
        with conn:
            conn.settimeout(TIMEOUT)
            data = conn.recv(1024)
            conn.sendall(b"%d bytes" % len(data))

    def accept_loop():
        workers = []
        with lst:
            for _ in range(n_clients):
                conn, _addr = lst.accept()
                w = threading.Thread(target=handle, args=(conn,), daemon=True)
                w.start()
                workers.append(w)
        for w in workers:
            w.join(TIMEOUT)

    t = threading.Thread(target=accept_loop, daemon=True)
    t.start()
    return port, t


# ---------------------------------------------------------------- 14. Internet checksum (used by 11 and 13)
def internet_checksum(data):
    """#14 RFC 1071 Internet checksum: add 16-bit big-endian words with end-around carry,
    then take the 1's complement. A receiver summing data + checksum gets 0xFFFF, so the
    function returns 0 when run over a correct packet including its checksum."""
    if len(data) % 2:                                         # odd length: pad one zero byte
        data += b"\x00"
    total = 0
    for i in range(0, len(data), 2):
        total += (data[i] << 8) | data[i + 1]                 # one 16-bit word, network byte order
        total = (total & 0xFFFF) + (total >> 16)              # wrap the carry back in (end-around carry)
    return ~total & 0xFFFF                                    # 1's complement, kept to 16 bits


# ---------------------------------------------------------------- 11. IPv4 header
IPV4_FMT = "!BBHHHBBH4s4s"   # ver+IHL, DSCP+ECN, total length, ID, flags+offset, TTL, proto, checksum, src, dst


def build_ipv4_header(src, dst, total_length, proto, ttl=64, ident=0, df=True):
    """#11a Pack a 20-byte IPv4 header (RFC 791) with struct and fill in the header checksum."""
    ver_ihl = (4 << 4) | 5                                    # version 4, IHL 5 words = 20 bytes
    flags_off = (0x4000 if df else 0)                         # DF is bit 1 of the 3 flag bits; offset 0
    hdr = struct.pack(IPV4_FMT, ver_ihl, 0, total_length, ident, flags_off, ttl, proto, 0,
                      socket.inet_aton(src), socket.inet_aton(dst))
    csum = internet_checksum(hdr)                             # computed with the checksum field = 0
    return hdr[:10] + struct.pack("!H", csum) + hdr[12:]


def parse_ipv4_header(raw):
    """#11b Unpack the first 20 bytes of an IPv4 datagram into a dict."""
    v_ihl, tos, tot, ident, fl_off, ttl, proto, csum, src, dst = struct.unpack(IPV4_FMT, raw[:20])
    return {"version": v_ihl >> 4, "ihl_bytes": (v_ihl & 0x0F) * 4, "total_length": tot,
            "id": ident, "DF": bool(fl_off & 0x4000), "MF": bool(fl_off & 0x2000),
            "frag_offset_bytes": (fl_off & 0x1FFF) * 8, "ttl": ttl, "proto": proto,
            "checksum": csum, "src": socket.inet_ntoa(src), "dst": socket.inet_ntoa(dst)}


# ---------------------------------------------------------------- 12. TCP header
TCP_FMT = "!HHIIBBHHH"       # src port, dst port, seq, ack, data offset+reserved, flags, window, checksum, urgent
TCP_FLAGS = ["FIN", "SYN", "RST", "PSH", "ACK", "URG", "ECE", "CWR"]   # bit 0 (LSB) to bit 7


def build_tcp_header(sport, dport, seq, ack, flags, window=65535):
    """#12a Pack a 20-byte TCP header (RFC 9293). `flags` is a list such as ["SYN", "ACK"]."""
    flag_byte = sum(1 << TCP_FLAGS.index(f) for f in flags)
    off_res = 5 << 4                                          # data offset 5 words = 20 bytes, reserved 0
    return struct.pack(TCP_FMT, sport, dport, seq, ack, off_res, flag_byte, window, 0, 0)


def parse_tcp_header(raw):
    """#12b Unpack a TCP header: header length = data offset x 4; decode the flag bits."""
    sp, dp, seq, ack, off_res, fl, win, csum, urg = struct.unpack(TCP_FMT, raw[:20])
    return {"sport": sp, "dport": dp, "seq": seq, "ack": ack, "hdr_len": (off_res >> 4) * 4,
            "flags": [n for i, n in enumerate(TCP_FLAGS) if fl & (1 << i)], "window": win}


# ---------------------------------------------------------------- 13. UDP header + pseudo-header checksum
def build_udp_datagram(src, dst, sport, dport, payload):
    """#13a Pack an 8-byte UDP header (RFC 768). Length = 8 + payload. The checksum covers the
    12-byte pseudo-header (src IP, dst IP, zero, protocol 17, UDP length) + header + data."""
    length = 8 + len(payload)
    pseudo = socket.inet_aton(src) + socket.inet_aton(dst) + struct.pack("!BBH", 0, 17, length)
    hdr = struct.pack("!HHHH", sport, dport, length, 0)
    csum = internet_checksum(pseudo + hdr + payload) or 0xFFFF   # a computed 0 is sent as 0xFFFF
    return struct.pack("!HHHH", sport, dport, length, csum) + payload


def parse_udp_header(raw):
    """#13b Unpack the 8-byte UDP header."""
    sport, dport, length, csum = struct.unpack("!HHHH", raw[:8])
    return {"sport": sport, "dport": dport, "length": length, "checksum": csum, "data": raw[8:length]}


# ---------------------------------------------------------------- 15. byte order
def byte_order_demo(port=443):
    """#15 htons/ntohs: x86 and ARM hosts are little-endian, the network is big-endian.
    struct '!' (network order) and socket.htons() both produce big-endian on the wire."""
    wire = struct.pack("!H", port)                            # 443 = 0x01BB -> b'\\x01\\xbb'
    host_swapped = socket.htons(port)
    if sys.byteorder == "little":
        assert host_swapped == 0xBB01                         # bytes swapped on a little-endian host
    else:
        assert host_swapped == port                           # no-op on a big-endian host
    assert socket.ntohs(socket.htons(port)) == port           # round trip is always the identity
    return wire, host_swapped


# ---------------------------------------------------------------- 16. ipaddress subnet listing
def list_subnets(cidr="10.0.0.0/24", new_prefix=26):
    """#16 ipaddress: split a block into equal subnets and list network, broadcast, first and
    last usable host, generic usable count (2^h - 2) and AWS usable count (2^h - 5)."""
    rows = []
    for sn in ipaddress.ip_network(cidr).subnets(new_prefix=new_prefix):
        hosts = list(sn.hosts())                              # excludes network and broadcast
        rows.append((str(sn), str(sn.network_address), str(sn.broadcast_address),
                     str(hosts[0]), str(hosts[-1]), sn.num_addresses - 2, sn.num_addresses - 5))
    return rows


# ---------------------------------------------------------------- 17. getaddrinfo
def resolve(host="127.0.0.1", port=80):
    """#17 getaddrinfo(): the one resolver call that returns ready-to-use (family, type, proto,
    canonname, sockaddr) tuples for IPv4 and IPv6. AI_NUMERICHOST forbids a DNS lookup, so this
    stays offline; drop that flag to resolve real names."""
    infos = socket.getaddrinfo(host, port, socket.AF_INET, socket.SOCK_STREAM, 0, socket.AI_NUMERICHOST)
    family, socktype, proto, _canon, sockaddr = infos[0]
    return family, socktype, proto, sockaddr


# ---------------------------------------------------------------- 18. ssl context wrap
def ssl_client_hello():
    """#18 ssl: create_default_context() verifies certificates and host names. wrap_socket()
    turns a TCP socket into a TLS socket; the first thing it sends is a ClientHello inside a
    TLS record (content type 0x16 = handshake, handshake type 0x01 = ClientHello).
    Offline trick: wrap one end of a loopback pair, start the handshake without blocking,
    and read the raw ClientHello bytes on the other end. Returns those bytes."""
    ctx = ssl.create_default_context()
    assert ctx.verify_mode == ssl.CERT_REQUIRED and ctx.check_hostname
    ctx.minimum_version = ssl.TLSVersion.TLSv1_2              # refuse SSLv3, TLS 1.0, TLS 1.1
    cli, srv = _loopback_pair()
    cli.setblocking(False)
    tls = ctx.wrap_socket(cli, server_hostname="example.com", do_handshake_on_connect=False)
    try:
        tls.do_handshake()                                    # writes ClientHello, then wants ServerHello
    except ssl.SSLWantReadError:
        pass                                                  # expected: no TLS server is answering
    header = recv_exact(srv, 5)                               # TLS record header: type, version, length
    rtype, rver, rlen = struct.unpack("!BHH", header)
    body = recv_exact(srv, rlen)
    tls.close()
    srv.close()
    return header + body


# ---------------------------------------------------------------- 19. http.client GET
class _JSONHandler(http.server.BaseHTTPRequestHandler):
    """Tiny REST-style handler for snippet #19: GET /api/status returns JSON, anything else 404."""
    def do_GET(self):
        if self.path == "/api/status":
            body = json.dumps({"status": "ok", "port": self.server.server_address[1]}).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))   # exact body byte count
            self.end_headers()
            self.wfile.write(body)
        else:
            self.send_error(404)

    def log_message(self, fmt, *args):                        # keep the self-test output quiet
        pass


def http_get(port, path):
    """#19 http.client: open a connection, send 'GET path HTTP/1.1' (Host header added for you),
    read status, headers and body. Returns (status, reason, content_type, body_bytes)."""
    conn = http.client.HTTPConnection(HOST, port, timeout=TIMEOUT)
    try:
        conn.request("GET", path, headers={"Accept": "application/json"})
        resp = conn.getresponse()
        return resp.status, resp.reason, resp.getheader("Content-Type"), resp.read()
    finally:
        conn.close()


# ---------------------------------------------------------------- 20. socketserver
class _UpperLineHandler(socketserver.StreamRequestHandler):
    """Handler for snippet #20: read one line, answer it in upper case."""
    def handle(self):
        line = self.rfile.readline().strip()                  # rfile/wfile wrap the TCP socket as files
        self.wfile.write(line.upper() + b"\n")


def socketserver_demo(message):
    """#20 socketserver: the standard library writes the bind/listen/accept/thread loop for you.
    ThreadingTCPServer runs each client in a new thread. Returns the server's reply."""
    with socketserver.ThreadingTCPServer((HOST, 0), _UpperLineHandler) as server:
        port = server.server_address[1]
        t = threading.Thread(target=server.serve_forever, kwargs={"poll_interval": 0.05}, daemon=True)
        t.start()
        try:
            with socket.create_connection((HOST, port), timeout=TIMEOUT) as c:
                c.sendall(message + b"\n")
                return recv_until(c, b"\n", bufsize=64)
        finally:
            server.shutdown()                                 # stop serve_forever, then close


# ---------------------------------------------------------------- self-test
def main():
    start = time.time()
    passed = []

    def ok(n, name):
        passed.append(n)
        print("[ok] #%02d %s" % (n, name))

    # 1 + 2: TCP server and client
    port, t = tcp_server()
    reply = tcp_client(port, b"hello tcp")
    t.join(TIMEOUT)
    assert reply == b"HELLO TCP"
    ok(1, "TCP server (bind, listen, accept)")
    ok(2, "TCP client (create_connection, sendall, recv) -> %r" % reply)

    # 3 + 4: UDP server and client
    port, t = udp_server()
    reply = udp_client(port, b"hello udp")
    t.join(TIMEOUT)
    assert reply == b"ECHO:hello udp"
    ok(3, "UDP server (bind, recvfrom, sendto)")
    ok(4, "UDP client (sendto, recvfrom) -> %r" % reply)

    # 5: timeout + retry against a server that 'loses' the first two datagrams
    port, t = udp_server(max_msgs=1, drop_first=2)
    reply, attempts = udp_request_with_retry(port, b"ping", timeout=0.3)
    t.join(TIMEOUT)
    assert reply == b"ECHO:ping" and attempts == 3
    ok(5, "settimeout + retry: answered on attempt %d" % attempts)

    # 6: length-prefixed framing; two messages sent back to back stay separate
    a, b = _loopback_pair()
    send_framed(a, b"first message")
    send_framed(a, b"")
    send_framed(a, b"x" * 5000)
    assert recv_framed(b) == b"first message"
    assert recv_framed(b) == b""
    assert recv_framed(b) == b"x" * 5000
    assert struct.pack("!I", 13) == b"\x00\x00\x00\x0d"     # the 4-byte prefix for a 13-byte message
    a.close()
    b.close()
    ok(6, "sendall + 4-byte length prefix (3 messages, 13 + 0 + 5000 bytes)")

    # 7: recv loop until CRLF; the request line arrives in pieces
    a, b = _loopback_pair()
    a.sendall(b"GET /index.html HTTP/1.1\r\nHost: x\r\n\r\n")
    line = recv_until(b, b"\r\n", bufsize=4)
    assert line == b"GET /index.html HTTP/1.1"
    a.close()
    b.close()
    ok(7, "recv until delimiter -> %r" % line)

    # 8: SO_REUSEADDR
    port = reuseaddr_rebind()
    ok(8, "SO_REUSEADDR: re-bound port %d immediately after an active close" % port)

    # 9: selectors server with 3 simultaneous clients
    port, t = selectors_server(3)
    clients = [socket.create_connection((HOST, port), timeout=TIMEOUT) for _ in range(3)]
    for i, c in enumerate(clients):
        c.sendall(b"client%d\n" % i)
    replies = [recv_until(c, b"\n", bufsize=64) for c in clients]
    for c in clients:
        c.close()
    t.join(TIMEOUT)
    assert replies == [b"0tneilc", b"1tneilc", b"2tneilc"]
    ok(9, "selectors: one thread served 3 clients -> %r" % replies)

    # 10: threaded server with 4 clients
    port, t = threaded_server(4)
    answers = [tcp_client(port, b"a" * (i + 1)) for i in range(4)]
    t.join(TIMEOUT)
    assert answers == [b"1 bytes", b"2 bytes", b"3 bytes", b"4 bytes"]
    ok(10, "thread per client: %r" % answers)

    # 11: IPv4 header, checked against the well-known example 4500 0073 0000 4000 4011 b861 c0a8 0001 c0a8 00c7
    ip = build_ipv4_header("192.168.0.1", "192.168.0.199", total_length=0x73, proto=17, ttl=64)
    assert ip.hex() == "45000073000040004011b861c0a80001c0a800c7"
    assert internet_checksum(ip) == 0                         # receiver check: whole header sums to 0xFFFF
    f = parse_ipv4_header(ip)
    assert (f["version"], f["ihl_bytes"], f["ttl"], f["proto"], f["DF"], f["checksum"]) == (4, 20, 64, 17, True, 0xB861)
    ok(11, "IPv4 header pack/unpack, checksum 0x%04X" % f["checksum"])

    # 12: TCP SYN then SYN-ACK of the ISN 100 / 350 handshake
    syn = build_tcp_header(50000, 443, seq=100, ack=0, flags=["SYN"])
    synack = build_tcp_header(443, 50000, seq=350, ack=101, flags=["SYN", "ACK"])
    p1, p2 = parse_tcp_header(syn), parse_tcp_header(synack)
    assert len(syn) == 20 and p1["hdr_len"] == 20 and p1["flags"] == ["SYN"] and p1["seq"] == 100
    assert p2["flags"] == ["SYN", "ACK"] and p2["ack"] == 101 and syn[13] == 0x02 and synack[13] == 0x12
    ok(12, "TCP header pack/unpack: SYN flag byte 0x02, SYN-ACK 0x12, ack 101")

    # 13: UDP datagram with pseudo-header checksum
    dg = build_udp_datagram("10.0.0.1", "10.0.0.2", 5353, 53, b"hi")
    u = parse_udp_header(dg)
    pseudo = socket.inet_aton("10.0.0.1") + socket.inet_aton("10.0.0.2") + struct.pack("!BBH", 0, 17, u["length"])
    assert u["length"] == 10 and u["data"] == b"hi" and u["dport"] == 53
    assert internet_checksum(pseudo + dg) == 0                # receiver recomputes over pseudo + segment
    ok(13, "UDP header pack/unpack, length %d, checksum 0x%04X verifies" % (u["length"], u["checksum"]))

    # 14: Internet checksum, RFC 1071 example bytes 00 01 f2 03 f4 f5 f6 f7 -> sum 0xDDF2 -> checksum 0x220D
    c = internet_checksum(bytes.fromhex("0001f203f4f5f6f7"))
    assert c == 0x220D
    assert internet_checksum(bytes.fromhex("0001f203f4f5f6f7") + struct.pack("!H", c)) == 0
    ok(14, "Internet checksum RFC 1071 example = 0x%04X" % c)

    # 15: byte order
    wire, swapped = byte_order_demo(443)
    assert wire == b"\x01\xbb"
    ok(15, "htons/ntohs: 443 on the wire = %s, htons(443) = 0x%04X on this %s-endian host" % (wire.hex(), swapped, sys.byteorder))

    # 16: ipaddress subnet listing, SL-L14 example 10.0.0.0/24 -> four /26
    rows = list_subnets("10.0.0.0/24", 26)
    assert [r[0] for r in rows] == ["10.0.0.0/26", "10.0.0.64/26", "10.0.0.128/26", "10.0.0.192/26"]
    assert rows[1][1:5] == ("10.0.0.64", "10.0.0.127", "10.0.0.65", "10.0.0.126")
    assert rows[0][5] == 62 and rows[0][6] == 59
    for r in rows:
        print("    %-15s net %-11s bcast %-11s hosts %s-%s usable %d (AWS %d)" % r)
    ok(16, "ipaddress: 10.0.0.0/24 split into 4 x /26, 62 usable each (59 in AWS)")

    # 17: getaddrinfo without DNS
    family, socktype, proto, sockaddr = resolve("127.0.0.1", 80)
    assert family == socket.AF_INET and socktype == socket.SOCK_STREAM and sockaddr == ("127.0.0.1", 80)
    ok(17, "getaddrinfo -> %r" % (sockaddr,))

    # 18: ssl ClientHello
    hello = ssl_client_hello()
    assert hello[0] == 0x16 and hello[5] == 0x01             # handshake record, ClientHello message
    assert b"example.com" in hello                           # SNI extension carries the host name in clear
    ok(18, "ssl wrap_socket: ClientHello record of %d bytes, SNI visible" % len(hello))

    # 19: http.client GET against a local http.server
    httpd = http.server.ThreadingHTTPServer((HOST, 0), _JSONHandler)
    t = threading.Thread(target=httpd.serve_forever, kwargs={"poll_interval": 0.05}, daemon=True)
    t.start()
    try:
        status, reason, ctype, body = http_get(httpd.server_address[1], "/api/status")
        assert status == 200 and reason == "OK" and ctype == "application/json"
        assert json.loads(body)["status"] == "ok"
        status404 = http_get(httpd.server_address[1], "/missing")[0]
        assert status404 == 404
    finally:
        httpd.shutdown()
        httpd.server_close()
    ok(19, "http.client GET -> %d %s %s; /missing -> %d" % (status, reason, body.decode(), status404))

    # 20: socketserver
    reply = socketserver_demo(b"socketserver works")
    assert reply == b"SOCKETSERVER WORKS"
    ok(20, "socketserver ThreadingTCPServer -> %r" % reply)

    assert passed == list(range(1, 21))
    print("All %d snippets passed in %.2f s" % (len(passed), time.time() - start))
    return 0


if __name__ == "__main__":
    sys.exit(main())
