#!/usr/bin/env python3
"""Unit 09 - A selectors-based TCP server that serves many clients in ONE thread.

COVERAGE ids: 09.3 (demultiplexing: every accepted connection is its own socket, chosen by the
              4-tuple), 09.7 (accept() hands back an ESTABLISHED connection), 09.8 (recv() == b''
              means the client closed; we unregister and close).

Level: high (selectors.DefaultSelector picks epoll/kqueue/select for the OS).

Run:  python3 Unit09_selectors_server.py
Three clients run at the same time, each sends three lines; the server upper-cases each line.
The server uses non-blocking sockets and a per-connection output buffer, so a slow client can
never block the others. Offline, no root, about half a second.
"""
import selectors
import socket
import threading

HOST = "127.0.0.1"


def run_server(lsock, stop, stats):
    sel = selectors.DefaultSelector()
    lsock.setblocking(False)
    sel.register(lsock, selectors.EVENT_READ, data=None)          # data=None marks the listening socket
    while not stop.is_set():
        for key, mask in sel.select(timeout=0.05):
            if key.data is None:                                   # new connection waiting
                conn, addr = key.fileobj.accept()
                conn.setblocking(False)
                stats["accepted"].append(addr)
                sel.register(conn, selectors.EVENT_READ, data={"addr": addr, "inbuf": b"", "outbuf": b"", "eof": False})
                continue
            conn, st = key.fileobj, key.data
            if mask & selectors.EVENT_READ and not st["eof"]:
                chunk = conn.recv(4096)
                if chunk == b"":                                   # client sent FIN: no more requests
                    st["eof"] = True                               # but replies may still be queued
                else:
                    st["inbuf"] += chunk
                    while b"\n" in st["inbuf"]:                    # frame by newline: TCP has no messages
                        line, st["inbuf"] = st["inbuf"].split(b"\n", 1)
                        st["outbuf"] += line.upper() + b"\n"
            if mask & selectors.EVENT_WRITE and st["outbuf"]:
                sent = conn.send(st["outbuf"])                     # non-blocking send may be partial
                st["outbuf"] = st["outbuf"][sent:]                 # keep the unsent tail for next time
            if st["eof"] and not st["outbuf"]:                     # everything answered: close (our FIN)
                sel.unregister(conn)
                conn.close()
                stats["closed"] += 1
                continue
            # watch for writability only while there is something to send
            want = (0 if st["eof"] else selectors.EVENT_READ) | (selectors.EVENT_WRITE if st["outbuf"] else 0)
            if want != key.events:
                sel.modify(conn, want, data=st)
    sel.unregister(lsock)
    sel.close()


def client(port, name, results):
    with socket.create_connection((HOST, port), timeout=2.0) as c:
        lines = [b"%s line %d" % (name, i) for i in range(3)]
        c.sendall(b"".join(l + b"\n" for l in lines))
        c.shutdown(socket.SHUT_WR)                                 # FIN: no more requests
        buf = b""
        while True:
            chunk = c.recv(1024)
            if not chunk:
                break
            buf += chunk
    results[name] = buf.decode().splitlines()


def main():
    lsock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    lsock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    lsock.bind((HOST, 0))
    lsock.listen()
    port = lsock.getsockname()[1]
    stop, stats, results = threading.Event(), {"accepted": [], "closed": 0}, {}
    srv = threading.Thread(target=run_server, args=(lsock, stop, stats), daemon=True)
    srv.start()

    names = [b"alpha", b"bravo", b"charlie"]
    clients = [threading.Thread(target=client, args=(port, n, results)) for n in names]
    for t in clients:
        t.start()
    for t in clients:
        t.join(timeout=5)

    # The server closes a connection only after the client's FIN; wait for all three closes.
    for _ in range(100):
        if stats["closed"] == 3:
            break
        threading.Event().wait(0.02)
    stop.set()
    srv.join(timeout=2)
    lsock.close()

    print("Server on %s:%d accepted %d connections from ports %s"
          % (HOST, port, len(stats["accepted"]), sorted(a[1] for a in stats["accepted"])))
    for n in names:
        print("  %s got %s" % (n.decode(), results[n]))
        assert results[n] == ["%s LINE %d" % (n.decode().upper(), i) for i in range(3)]
    assert len({a[1] for a in stats["accepted"]}) == 3      # three different client ports
    print("All selectors-server assertions passed.")


if __name__ == "__main__":
    main()
