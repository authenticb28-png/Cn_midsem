#!/usr/bin/env python3
"""Unit 05 - REST CRUD with the standard library: http.server + http.client.

COVERAGE rows: 05.6 (status codes), 05.12 (REST verbs -> CRUD), 05.13 (APIs).

Level: HIGH - the library parses and frames HTTP for us. The script starts a
ThreadingHTTPServer on 127.0.0.1 (OS-assigned port) holding an in-memory "users"
resource, then drives it with ONE persistent http.client.HTTPConnection:

  POST   /users        -> 201 Created  + Location header   (Create)
  GET    /users/1      -> 200 OK       + JSON              (Read)
  GET    /users        -> 200 OK       + JSON list         (Read collection)
  PUT    /users/1      -> 200 OK       (full replace)      (Update)
  PATCH  /users/1      -> 200 OK       (partial update)    (Update)
  DELETE /users/1      -> 204 No Content, empty body       (Delete)
  GET    /users/1      -> 404 Not Found                    (gone)
  DELETE /users        -> 405 Method Not Allowed
  POST   /users (bad JSON) -> 400 Bad Request

Run:  python3 Unit05_rest_crud.py
"""
import http.client
import json
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

DB = {}            # in-memory "table": id -> record
NEXT_ID = [1]
LOCK = threading.Lock()


class UsersAPI(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"          # keep-alive: several requests per TCP connection

    def log_message(self, fmt, *args):     # keep the console quiet
        pass

    # ---- helpers -----------------------------------------------------------
    def send_json(self, code, obj=None, extra=None):
        body = b"" if obj is None else json.dumps(obj).encode()
        self.send_response(code)                         # status line + Server + Date
        if obj is not None:
            self.send_header("Content-Type", "application/json")
        if code != 204:                                  # RFC 9110 8.6: no Content-Length on 204
            self.send_header("Content-Length", str(len(body)))
        for k, v in (extra or {}).items():
            self.send_header(k, v)
        self.end_headers()                               # the blank CRLF line
        self.wfile.write(body)

    def read_json(self):
        n = int(self.headers.get("Content-Length", 0))
        return json.loads(self.rfile.read(n) or b"null")

    def user_id(self):
        parts = self.path.strip("/").split("/")          # "/users/7" -> ["users", "7"]
        if parts[0] != "users":
            return "bad"
        if len(parts) == 1:
            return None                                  # the collection itself
        return int(parts[1]) if parts[1].isdigit() else "bad"

    # ---- verbs -------------------------------------------------------------
    def do_GET(self):
        uid = self.user_id()
        if uid is None:
            return self.send_json(200, sorted(DB.values(), key=lambda r: r["id"]))
        if uid in DB:
            return self.send_json(200, DB[uid])
        return self.send_json(404, {"error": "not found"})

    def do_POST(self):
        if self.user_id() is not None:
            return self.send_json(405, {"error": "POST only on the collection"}, {"Allow": "GET, PUT, PATCH, DELETE"})
        try:
            rec = self.read_json()
            name = rec["name"]
        except (ValueError, KeyError, TypeError):
            return self.send_json(400, {"error": "body must be JSON with a name"})
        with LOCK:
            uid = NEXT_ID[0]
            NEXT_ID[0] += 1
            DB[uid] = {"id": uid, "name": name, "city": rec.get("city", "")}
        return self.send_json(201, DB[uid], {"Location": "/users/%d" % uid})

    def do_PUT(self):
        uid = self.user_id()
        if uid not in DB:
            return self.send_json(404, {"error": "not found"})
        rec = self.read_json()
        DB[uid] = {"id": uid, "name": rec["name"], "city": rec.get("city", "")}   # full replace
        return self.send_json(200, DB[uid])

    def do_PATCH(self):
        uid = self.user_id()
        if uid not in DB:
            return self.send_json(404, {"error": "not found"})
        DB[uid].update({k: v for k, v in self.read_json().items() if k != "id"})  # partial update
        return self.send_json(200, DB[uid])

    def do_DELETE(self):
        uid = self.user_id()
        if uid is None:
            return self.send_json(405, {"error": "cannot delete the collection"}, {"Allow": "GET, POST"})
        if uid not in DB:
            return self.send_json(404, {"error": "not found"})
        del DB[uid]
        return self.send_json(204)                       # 204: success, no body


def call(conn, method, path, obj=None):
    body = None if obj is None else json.dumps(obj)
    headers = {"Content-Type": "application/json"} if body is not None else {}
    conn.request(method, path, body=body, headers=headers)
    r = conn.getresponse()
    raw = r.read()                     # must read the whole body before the next request
    data = json.loads(raw) if raw else None
    print("  %-6s %-9s -> %d %-18s %s" % (method, path, r.status, r.reason, raw.decode() if raw else "(empty body)"))
    return r, data


def main():
    server = ThreadingHTTPServer(("127.0.0.1", 0), UsersAPI)
    port = server.server_address[1]
    threading.Thread(target=server.serve_forever, daemon=True).start()
    print("REST API on http://127.0.0.1:%d/users  (one persistent connection below)" % port)

    conn = http.client.HTTPConnection("127.0.0.1", port, timeout=3)
    r, d = call(conn, "POST", "/users", {"name": "Raj", "city": "Delhi"})
    assert r.status == 201 and r.getheader("Location") == "/users/1" and d["id"] == 1
    r, d = call(conn, "POST", "/users", {"name": "Simran", "city": "Mumbai"})
    assert r.status == 201 and d["id"] == 2
    r, d = call(conn, "GET", "/users/1")
    assert r.status == 200 and d["name"] == "Raj"
    r, d = call(conn, "GET", "/users")
    assert r.status == 200 and [u["id"] for u in d] == [1, 2]
    r, d = call(conn, "PUT", "/users/1", {"name": "Raj Malhotra"})
    assert r.status == 200 and d == {"id": 1, "name": "Raj Malhotra", "city": ""}   # PUT replaced city too
    r, d = call(conn, "PATCH", "/users/1", {"city": "London"})
    assert r.status == 200 and d["name"] == "Raj Malhotra" and d["city"] == "London"
    r, d = call(conn, "DELETE", "/users/1")
    assert r.status == 204 and d is None
    r, d = call(conn, "GET", "/users/1")
    assert r.status == 404
    r, d = call(conn, "DELETE", "/users/1")          # deleting again: still 404 (state unchanged)
    assert r.status == 404
    r, d = call(conn, "DELETE", "/users")
    assert r.status == 405 and r.getheader("Allow") == "GET, POST"
    conn.request("POST", "/users", body="{not json", headers={"Content-Type": "application/json"})
    r = conn.getresponse()
    r.read()
    print("  POST   /users     -> %d %s (malformed JSON)" % (r.status, r.reason))
    assert r.status == 400
    conn.close()

    server.shutdown()
    server.server_close()
    print("All Unit05 REST CRUD assertions passed (201, 200, 204, 404, 405, 400).")


if __name__ == "__main__":
    main()
