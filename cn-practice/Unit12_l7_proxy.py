"""Unit 12 - a real Layer-7 load balancer (ALB-style) on 127.0.0.1 with path routing and health checks.

COVERAGE ids: 12.3, 12.5, 12.6, 12.2
Source: SL-L12 p10 (ALB path rules /api/* -> TG: api, /web/* -> TG: web), p13 (ALB is HTTP-aware; source IP
        reaches the backend "via headers"), p15-17 (target groups, GET /health, automatic removal);
        AWS ALB docs (round robin default, X-Forwarded-For header, HTTP 503 when a target group has no
        registered targets); RFC 9110 (HTTP semantics).

Run:    python3 Unit12_l7_proxy.py

What it builds (all on 127.0.0.1, every port chosen by the OS):
  * backend 'api-1' and backend 'web-1': the two http.server instances that the path rules route to;
    a second API instance 'api-2' joins TG api so you can watch traffic move when one target fails
  * the proxy: a ThreadingHTTPServer that reads the URL path (something an L4 NLB cannot do),
    picks a healthy target of the matching target group round robin, forwards the request with
    http.client and adds X-Forwarded-For
  * a health-check thread: GET /health every 0.1 s; unhealthy after 2 failures, healthy after 2 passes
The test at the bottom drives everything with http.client and asserts the routing.
"""

import http.client
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

INTERVAL = 0.1            # health-check interval in seconds (AWS default is 30 s; shrunk for the demo)
HEALTHY_THRESHOLD = 2     # AWS ALB default is 5
UNHEALTHY_THRESHOLD = 2   # AWS ALB default is 2


# ---------------------------------------------------------------- backends

def make_backend(name):
    """Start one backend http.server in a thread; return (server, state dict)."""
    state = {"sick": False, "hits": 0}

    class Backend(BaseHTTPRequestHandler):
        def do_GET(self):
            if self.path == "/health":
                code = 500 if state["sick"] else 200          # SL-L12 p16: 200 = healthy, 500 = unhealthy
                body = b"sick" if state["sick"] else b"ok"
            else:
                state["hits"] += 1
                code = 200
                xff = self.headers.get("X-Forwarded-For", "")
                body = ("%s served %s for client %s" % (name, self.path, xff)).encode()
            self.send_response(code)
            self.send_header("Content-Type", "text/plain")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def log_message(self, *args):                          # keep the demo output clean
            pass

    srv = ThreadingHTTPServer(("127.0.0.1", 0), Backend)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, state


# ---------------------------------------------------------------- target groups and health checks

class TargetGroup:
    def __init__(self, name, ports):
        self.name = name
        self.ports = list(ports)
        self.healthy = set(self.ports)          # registered targets start healthy in this demo
        self.passes = {p: 0 for p in self.ports}
        self.fails = {p: 0 for p in self.ports}
        self.rr = 0
        self.lock = threading.Lock()

    def pick(self):
        """Round robin over the healthy targets; None means the group is empty (-> HTTP 503)."""
        with self.lock:
            for _ in range(len(self.ports)):
                port = self.ports[self.rr % len(self.ports)]
                self.rr += 1
                if port in self.healthy:
                    return port
        return None

    def record(self, port, ok):
        """Health-check state machine with consecutive-result thresholds."""
        with self.lock:
            if ok:
                self.passes[port] += 1
                self.fails[port] = 0
                if self.passes[port] >= HEALTHY_THRESHOLD:
                    self.healthy.add(port)
            else:
                self.fails[port] += 1
                self.passes[port] = 0
                if self.fails[port] >= UNHEALTHY_THRESHOLD:
                    self.healthy.discard(port)


def health_checker(groups, stop):
    while not stop.is_set():
        for tg in groups:
            for port in tg.ports:
                try:
                    c = http.client.HTTPConnection("127.0.0.1", port, timeout=1)
                    c.request("GET", "/health")
                    ok = c.getresponse().status == 200
                    c.close()
                except OSError:
                    ok = False                       # no answer at all also counts as a failed probe
                tg.record(port, ok)
        stop.wait(INTERVAL)


# ---------------------------------------------------------------- the L7 proxy

def make_proxy(rules):
    """rules: list of (path prefix, TargetGroup), checked in order like ALB listener rules."""

    class Proxy(BaseHTTPRequestHandler):
        def do_GET(self):
            tg = next((g for prefix, g in rules if self.path.startswith(prefix)), None)
            if tg is None:
                return self.reply(404, b"no listener rule matches this path")   # ALB default action
            port = tg.pick()
            if port is None:
                # Simplification: a real ALB "fails open" when every registered target is unhealthy
                # (it then sends traffic to all of them) and answers 503 only when the group has no
                # registered targets. Returning 503 here makes the empty healthy set visible.
                return self.reply(503, b"no healthy targets in " + tg.name.encode())
            up = http.client.HTTPConnection("127.0.0.1", port, timeout=2)
            up.request("GET", self.path, headers={"X-Forwarded-For": self.client_address[0],
                                                  "Host": self.headers.get("Host", "")})
            resp = up.getresponse()
            body = resp.read()
            up.close()
            self.reply(resp.status, body, extra={"X-Target-Group": tg.name, "X-Target-Port": str(port)})

        def reply(self, code, body, extra=None):
            self.send_response(code)
            for k, v in (extra or {}).items():
                self.send_header(k, v)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def log_message(self, *args):
            pass

    srv = ThreadingHTTPServer(("127.0.0.1", 0), Proxy)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def get(port, path):
    c = http.client.HTTPConnection("127.0.0.1", port, timeout=3)
    c.request("GET", path)
    r = c.getresponse()
    body = r.read().decode()
    out = (r.status, r.getheader("X-Target-Group"), body)
    c.close()
    return out


def wait_until(cond, timeout=5.0):
    end = time.time() + timeout
    while time.time() < end:
        if cond():
            return True
        time.sleep(0.05)
    return False


def main():
    api1, api1_state = make_backend("api-1")
    api2, api2_state = make_backend("api-2")
    web1, web1_state = make_backend("web-1")
    tg_api = TargetGroup("TG-api", [api1.server_address[1], api2.server_address[1]])
    tg_web = TargetGroup("TG-web", [web1.server_address[1]])
    proxy = make_proxy([("/api/", tg_api), ("/web/", tg_web)])
    pport = proxy.server_address[1]
    stop = threading.Event()
    threading.Thread(target=health_checker, args=([tg_api, tg_web], stop), daemon=True).start()
    print("Proxy on 127.0.0.1:%d; TG-api ports %s; TG-web port %s" % (pport, tg_api.ports, tg_web.ports))

    # 1. path routing + round robin inside TG-api
    seen = []
    for path in ("/api/users", "/api/users", "/web/index.html", "/api/orders"):
        status, tg, body = get(pport, path)
        print("  GET %-16s -> %d via %s: %s" % (path, status, tg, body))
        assert status == 200
        seen.append(body.split()[0])
    assert seen[2] == "web-1"                                  # /web/* only ever reaches TG-web
    assert {seen[0], seen[1]} == {"api-1", "api-2"}            # round robin alternates inside TG-api
    assert "client 127.0.0.1" in get(pport, "/api/x")[2]       # client IP travels in X-Forwarded-For

    # 2. a path no rule matches
    status, _, _ = get(pport, "/images/logo.png")
    assert status == 404
    print("  GET /images/logo.png -> 404 (no rule)")

    # 3. api-2's /health starts returning 500 -> removed from TG-api after 2 failed probes
    api2_state["sick"] = True
    assert wait_until(lambda: api2.server_address[1] not in tg_api.healthy), "api-2 should be removed"
    print("  api-2 /health returns 500 -> marked unhealthy and removed")
    before = api1_state["hits"]
    bodies = [get(pport, "/api/items")[2] for _ in range(6)]
    assert all(b.startswith("api-1") for b in bodies)            # all API traffic now goes to api-1
    assert api1_state["hits"] - before == 6
    print("  6 more /api requests all served by api-1")

    # 4. web-1 fails too -> TG-web has no healthy target -> 503
    web1_state["sick"] = True
    assert wait_until(lambda: not tg_web.healthy)
    status, _, body = get(pport, "/web/index.html")
    assert status == 503
    print("  web-1 unhealthy -> GET /web/index.html -> 503 (%s)" % body)

    # 5. api-2 recovers -> back in rotation after 2 passing probes (self-healing)
    api2_state["sick"] = False
    assert wait_until(lambda: api2.server_address[1] in tg_api.healthy)
    served = {get(pport, "/api/items")[2].split()[0] for _ in range(4)}
    assert served == {"api-1", "api-2"}
    print("  api-2 healthy again -> traffic shared by", sorted(served))

    stop.set()
    for s in (proxy, api1, api2, web1):
        s.shutdown()
        s.server_close()
    print("All L7 proxy assertions passed.")


if __name__ == "__main__":
    main()
