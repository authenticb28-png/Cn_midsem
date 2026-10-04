#!/usr/bin/env python3
"""Unit 05 - HTTP/1.1 by hand: a raw-socket client and a tiny keep-alive server.

COVERAGE rows: 05.3 (socket API), 05.4 (request-response), 05.5 (request anatomy),
05.6 (response anatomy and status codes), 05.8 (persistent connections / keep-alive).

What it shows (level: LOW - every byte is built and parsed by hand):
  1. Byte-counting of the slide messages (WB-L05 p15/p20): request = 91 bytes,
     HTML body = 57 bytes, so Content-Length must be 57 (the slide prints 88).
  2. A tiny HTTP/1.1 server on 127.0.0.1 (thread, OS-assigned port) that
       - reads bytes until the blank line CRLF CRLF,
       - splits the request line into method / target / version,
       - parses header lines "Name: value" into a dict (names are case-insensitive),
       - reads exactly Content-Length body bytes,
       - computes Content-Length of its own reply with len(body_bytes),
       - keeps the TCP connection open (keep-alive) until "Connection: close".
  3. A raw socket client with timeout + retry that sends 2 requests on 1 TCP
     connection and frames each response with Content-Length.
  4. Error paths: unknown path -> 404, HTTP/1.1 request without Host -> 400.

Run:  python3 Unit05_raw_http.py      (offline, no root, about 0.1 s)
"""
import socket
import threading
import time

CRLF = b"\r\n"

# ---------------------------------------------------------------------------
# 1. Count the bytes of the slide messages
# ---------------------------------------------------------------------------
SLIDE_REQUEST = (b"GET /index.html HTTP/1.1\r\n"
                 b"Host: example.com\r\n"
                 b"User-Agent: Chrome\r\n"
                 b"Accept-Language: en-us\r\n"
                 b"\r\n")
SLIDE_BODY = b"<html><body><h1>Welcome to Example.com</h1></body></html>"


def count_slide_messages():
    print("== 1. Byte counting (WB-L05 p15 and p20) ==")
    for line in SLIDE_REQUEST.split(CRLF)[:-1]:
        # +2 because every line on the wire ends with CR LF
        print("  %-28r -> %2d bytes + 2 (CRLF) = %2d" % (line.decode(), len(line), len(line) + 2))
    print("  total request bytes          =", len(SLIDE_REQUEST))
    print("  HTML body bytes              =", len(SLIDE_BODY), "(slide says Content-Length: 88)")
    assert len(SLIDE_REQUEST) == 91
    assert len(SLIDE_BODY) == 57


# ---------------------------------------------------------------------------
# 2. Hand-written parsing helpers (shared by server and client)
# ---------------------------------------------------------------------------
def recv_until_blank_line(sock, buf):
    """Read from sock until buf contains CRLF CRLF. Return (head_bytes, leftover)."""
    while b"\r\n\r\n" not in buf:
        chunk = sock.recv(4096)
        if not chunk:                      # peer closed the connection
            return None, buf
        buf += chunk
    head, _, rest = buf.partition(b"\r\n\r\n")
    return head, rest


def parse_head(head):
    """Split the start line and the header lines. Header names are case-insensitive."""
    lines = head.decode("iso-8859-1").split("\r\n")
    start_line = lines[0]
    headers = {}
    for line in lines[1:]:
        name, sep, value = line.partition(":")
        if not sep:
            raise ValueError("bad header line %r" % line)
        headers[name.strip().lower()] = value.strip()
    return start_line, headers


def recv_body(sock, rest, length):
    """Read exactly `length` body bytes; extra bytes belong to the next message."""
    while len(rest) < length:
        chunk = sock.recv(4096)
        if not chunk:
            break
        rest += chunk
    return rest[:length], rest[length:]


def build_response(code, reason, body, content_type="text/html", keep_alive=True):
    body_bytes = body.encode() if isinstance(body, str) else body
    lines = ["HTTP/1.1 %d %s" % (code, reason),             # status line
             "Content-Type: %s" % content_type,
             "Content-Length: %d" % len(body_bytes),         # computed, never typed by hand
             "Server: Unit05-tiny/1.0",
             "Connection: %s" % ("keep-alive" if keep_alive else "close")]
    return ("\r\n".join(lines) + "\r\n\r\n").encode() + body_bytes


# ---------------------------------------------------------------------------
# 3. The tiny server
# ---------------------------------------------------------------------------
PAGES = {"/index.html": SLIDE_BODY, "/style.css": b"h1 { color: teal; }"}
SERVER_LOG = []          # (client_port, request_number_on_this_connection, method, target, status)


def handle_connection(conn, addr):
    conn.settimeout(2.0)
    buf = b""
    n = 0
    try:
        while True:
            head, buf = recv_until_blank_line(conn, buf)
            if head is None:                          # client closed: stop serving this connection
                break
            n += 1
            start_line, headers = parse_head(head)
            method, target, version = start_line.split(" ")   # exactly 3 parts
            body, buf = recv_body(conn, buf, int(headers.get("content-length", "0")))
            keep = headers.get("connection", "keep-alive").lower() != "close"
            if version == "HTTP/1.1" and "host" not in headers:
                status, reply = 400, build_response(400, "Bad Request", "Host header required", "text/plain", keep)
            elif method == "GET" and target in PAGES:
                ctype = "text/css" if target.endswith(".css") else "text/html"
                status, reply = 200, build_response(200, "OK", PAGES[target], ctype, keep)
            elif method == "POST" and target == "/echo":
                status, reply = 201, build_response(201, "Created", body, "application/json", keep)
            else:
                status, reply = 404, build_response(404, "Not Found", "no such resource", "text/plain", keep)
            SERVER_LOG.append((addr[1], n, method, target, status))
            conn.sendall(reply)
            if not keep:
                break
    except socket.timeout:
        pass
    finally:
        conn.close()


def serve(listener, stop):
    listener.settimeout(0.2)
    while not stop.is_set():
        try:
            conn, addr = listener.accept()
        except socket.timeout:
            continue
        threading.Thread(target=handle_connection, args=(conn, addr), daemon=True).start()


# ---------------------------------------------------------------------------
# 4. The raw client (timeout + retry)
# ---------------------------------------------------------------------------
def connect_with_retry(port, attempts=3, timeout=1.0):
    for i in range(1, attempts + 1):
        try:
            s = socket.create_connection(("127.0.0.1", port), timeout=timeout)
            s.settimeout(timeout)
            return s
        except OSError as e:
            print("  connect attempt %d failed: %s" % (i, e))
            time.sleep(0.1 * i)           # simple linear back-off
    raise ConnectionError("server unreachable after %d attempts" % attempts)


def send_request(sock, method, target, headers, body=b""):
    lines = ["%s %s HTTP/1.1" % (method, target)]            # request line
    for k, v in headers.items():
        lines.append("%s: %s" % (k, v))                       # header lines
    if body:
        lines.append("Content-Length: %d" % len(body))
    raw = ("\r\n".join(lines) + "\r\n\r\n").encode() + body  # blank line, then body
    sock.sendall(raw)
    return raw


def read_response(sock, buf):
    head, buf = recv_until_blank_line(sock, buf)
    status_line, headers = parse_head(head)
    version, code, reason = status_line.split(" ", 2)
    body, buf = recv_body(sock, buf, int(headers["content-length"]))
    return (version, int(code), reason, headers, body), buf


def main():
    count_slide_messages()

    listener = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    listener.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    listener.bind(("127.0.0.1", 0))           # port 0: the OS picks a free port
    listener.listen(5)
    port = listener.getsockname()[1]
    stop = threading.Event()
    t = threading.Thread(target=serve, args=(listener, stop), daemon=True)
    t.start()

    print("\n== 2. Keep-alive: two requests on ONE TCP connection (server port %d) ==" % port)
    s = connect_with_retry(port)
    my_port = s.getsockname()[1]
    buf = b""
    raw1 = send_request(s, "GET", "/index.html", {"Host": "example.com", "User-Agent": "Unit05-raw"})
    print("  sent %d bytes:" % len(raw1), raw1.split(CRLF)[0].decode())
    (v, code, reason, hdr, body), buf = read_response(s, buf)
    print("  got  %s %d %s, Content-Length %s, body %d bytes" % (v, code, reason, hdr["content-length"], len(body)))
    assert code == 200 and int(hdr["content-length"]) == 57 == len(body)

    raw2 = send_request(s, "GET", "/style.css", {"Host": "example.com", "Connection": "close"})
    print("  sent %d bytes:" % len(raw2), raw2.split(CRLF)[0].decode(), "(with Connection: close)")
    (v, code, reason, hdr, body), buf = read_response(s, buf)
    print("  got  %s %d %s, Connection: %s, body %r" % (v, code, reason, hdr["connection"], body.decode()))
    assert code == 200 and hdr["connection"] == "close"
    assert s.recv(1) == b""                    # server closed after 'Connection: close'
    s.close()

    same_conn = [e for e in SERVER_LOG if e[0] == my_port]
    print("  server log for client port %d:" % my_port, [(e[1], e[2], e[3], e[4]) for e in same_conn])
    assert [e[1] for e in same_conn] == [1, 2]   # request #1 and #2 on the same connection

    print("\n== 3. Error paths ==")
    s = connect_with_retry(port)
    buf = b""
    send_request(s, "GET", "/missing.png", {"Host": "example.com"})
    (v, code, reason, hdr, body), buf = read_response(s, buf)
    print("  GET /missing.png        ->", code, reason)
    assert code == 404
    send_request(s, "GET", "/index.html", {"User-Agent": "no-host"})
    (v, code, reason, hdr, body), buf = read_response(s, buf)
    print("  HTTP/1.1 without Host   ->", code, reason)
    assert code == 400
    payload = b'{"username": "user1"}'
    send_request(s, "POST", "/echo", {"Host": "example.com", "Content-Type": "application/json",
                                     "Connection": "close"}, payload)
    (v, code, reason, hdr, body), buf = read_response(s, buf)
    print("  POST /echo (%d-byte body) -> %d %s, echoed %r" % (len(payload), code, reason, body.decode()))
    assert code == 201 and body == payload
    s.close()

    stop.set()
    t.join(timeout=1)
    listener.close()
    print("\nAll Unit05 raw-HTTP assertions passed.")


if __name__ == "__main__":
    main()
