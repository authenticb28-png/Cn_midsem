#!/usr/bin/env python3
"""Unit 08 - Conditional GET with ETag / If-None-Match and Last-Modified / If-Modified-Since (high level).

Topic : an http.server origin that sends Cache-Control, ETag and Last-Modified, and answers
        a matching conditional GET with 304 Not Modified (no body); an http.client "browser"
        that keeps a private cache, respects max-age, and revalidates when the copy is stale.
COVERAGE ids : 08.4, 08.6
Run   : python3 Unit08_http_etag.py
References: RFC 9110 sections 8.8 and 13 (validators, conditional requests); RFC 9111 (caching).
Server and client both run on 127.0.0.1 with an OS-assigned port.
"""
import email.utils
import hashlib
import http.client
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

STATE = {"body": b"body { color: teal; }\n", "mtime": 1767225600, "requests": 0, "bytes_sent": 0}
MAX_AGE = 3600


def etag_for(body):
    return '"%s"' % hashlib.sha256(body).hexdigest()[:16]        # strong validator: changes with the bytes


def parse_cache_control(value):
    """'public, max-age=3600' -> {'public': True, 'max-age': 3600}."""
    out = {}
    for part in value.split(","):
        part = part.strip()
        if not part:
            continue
        if "=" in part:
            k, v = part.split("=", 1)
            v = v.strip('"')
            out[k.strip().lower()] = int(v) if v.isdigit() else v
        else:
            out[part.lower()] = True
    return out


class Origin(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt, *args):            # keep the demo output clean
        pass

    def do_GET(self):
        STATE["requests"] += 1
        body, tag = STATE["body"], etag_for(STATE["body"])
        last_mod = email.utils.formatdate(STATE["mtime"], usegmt=True)
        inm = self.headers.get("If-None-Match")
        ims = self.headers.get("If-Modified-Since")
        not_modified = False
        if inm is not None:                          # If-None-Match takes precedence (RFC 9110 13.2.2)
            not_modified = tag in [t.strip() for t in inm.split(",")] or inm.strip() == "*"
        elif ims is not None:
            not_modified = email.utils.parsedate_to_datetime(ims).timestamp() >= STATE["mtime"]
        self.send_response(304 if not_modified else 200)
        self.send_header("Cache-Control", "public, max-age=%d" % MAX_AGE)
        self.send_header("ETag", tag)
        self.send_header("Last-Modified", last_mod)
        if not_modified:
            self.send_header("Content-Length", "0")
            self.end_headers()                       # a 304 never carries a body
            return
        self.send_header("Content-Type", "text/css")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
        STATE["bytes_sent"] += len(body)


class BrowserCache:
    """Private cache for one URL: fresh -> no request; stale -> conditional GET."""

    def __init__(self, host, port):
        self.host, self.port = host, port
        self.entry = None                            # dict(body, etag, last_modified, stored_at, max_age)

    def get(self, path, now):
        if self.entry and now - self.entry["stored_at"] < self.entry["max_age"]:
            return "fresh hit (no request)", self.entry["body"]
        conn = http.client.HTTPConnection(self.host, self.port, timeout=3)
        headers = {}
        if self.entry:                               # stale copy: revalidate instead of refetching
            headers["If-None-Match"] = self.entry["etag"]
            headers["If-Modified-Since"] = self.entry["last_modified"]
        conn.request("GET", path, headers=headers)
        resp = conn.getresponse()
        body = resp.read()
        cc = parse_cache_control(resp.getheader("Cache-Control", ""))
        conn.close()
        if resp.status == 304:
            self.entry["stored_at"] = now            # freshened: the old body is valid again
            return "304 Not Modified (revalidated, 0 body bytes)", self.entry["body"]
        self.entry = {"body": body, "etag": resp.getheader("ETag"), "last_modified": resp.getheader("Last-Modified"),
                      "stored_at": now, "max_age": cc.get("max-age", 0)}
        return "%d %s (%d body bytes)" % (resp.status, resp.reason, len(body)), body


def main():
    assert parse_cache_control("public, max-age=3600") == {"public": True, "max-age": 3600}
    assert parse_cache_control("private, no-cache, s-maxage=600")["s-maxage"] == 600

    server = ThreadingHTTPServer(("127.0.0.1", 0), Origin)
    t = threading.Thread(target=server.serve_forever, daemon=True)
    t.start()
    host, port = server.server_address
    print("Origin on http://%s:%d/foobar.css" % (host, port))
    try:
        b = BrowserCache(host, port)
        timeline = []
        for now in (0, 1800, 4000, 4100):          # max-age is 3600 s
            how, _ = b.get("/foobar.css", now)
            timeline.append((now, how, STATE["requests"]))
        # the origin changes the file, then the copy goes stale again
        STATE["body"] = b"body { color: crimson; }\n"
        STATE["mtime"] += 86400
        how, body = b.get("/foobar.css", 8000)
        timeline.append((8000, how, STATE["requests"]))
        for row in timeline:
            print("   t=%5d s  %-46s origin requests so far: %d" % row)
        assert timeline[0][1].startswith("200") and timeline[0][2] == 1
        assert timeline[1][1] == "fresh hit (no request)" and timeline[1][2] == 1
        assert timeline[2][1].startswith("304") and timeline[2][2] == 2
        assert timeline[3][1] == "fresh hit (no request)" and timeline[3][2] == 2      # freshened at t=4000
        assert timeline[4][1].startswith("200") and body == STATE["body"]

        print("\n== raw http.client view of one conditional GET ==")
        conn = http.client.HTTPConnection(host, port, timeout=3)
        conn.request("GET", "/foobar.css", headers={"If-None-Match": etag_for(STATE["body"])})
        r = conn.getresponse()
        print("   %d %s  ETag=%s  Cache-Control=%s  body=%r" % (r.status, r.reason, r.getheader("ETag"), r.getheader("Cache-Control"), r.read()))
        assert r.status == 304
        conn.close()
        # If-Modified-Since alone also works (Last-Modified validator)
        conn = http.client.HTTPConnection(host, port, timeout=3)
        conn.request("GET", "/foobar.css", headers={"If-Modified-Since": email.utils.formatdate(STATE["mtime"], usegmt=True)})
        r = conn.getresponse()
        r.read()
        print("   If-Modified-Since only -> %d %s" % (r.status, r.reason))
        assert r.status == 304
        conn.close()
    finally:
        server.shutdown()
        server.server_close()
    print("\nAll ETag / 304 self-tests passed.")


if __name__ == "__main__":
    main()
