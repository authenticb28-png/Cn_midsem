#!/usr/bin/env python3
"""Unit 08 - SMTP spoken by hand over a raw TCP socket (low level).

Topic : the SMTP dialogue of RFC 5321 (HELO/EHLO, MAIL FROM, RCPT TO, DATA, ".", QUIT)
        with reply codes 220 / 250 / 354 / 221 (and 500 / 501 / 503 errors), implemented as
        a tiny threaded fake mail server with a state machine, plus a raw-socket client.
COVERAGE ids : 08.1, 08.6
Run   : python3 Unit08_smtp_raw.py
Everything runs on 127.0.0.1 with an OS-assigned port (a real MTA listens on 25,
submission on 587, implicit-TLS submission on 465). Unit08_smtplib_email.py reuses the
FakeSMTPServer class from this file, so keep both files in the same folder.
"""
import socket
import threading

CRLF = b"\r\n"


class FakeSMTPServer:
    """A minimal SMTP receiver. States: GREETED -> READY -> MAIL -> RCPT -> (DATA) -> READY."""

    def __init__(self, hostname="mx.cn-midsem.test"):
        self.hostname = hostname
        self.mailbox = []                     # delivered messages: {"from", "to", "data"}
        self.transcript = []                  # every line seen, prefixed C: or S:
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind(("127.0.0.1", 0))      # port 0 -> OS picks a free port
        self.sock.listen(5)
        self.sock.settimeout(0.2)
        self.address = self.sock.getsockname()
        self._stop = threading.Event()
        self._thread = threading.Thread(target=self._accept_loop, daemon=True)

    # ------------------------------------------------------------ lifecycle
    def start(self):
        self._thread.start()
        return self

    def stop(self):
        self._stop.set()
        self._thread.join(2)
        self.sock.close()

    def _accept_loop(self):
        while not self._stop.is_set():
            try:
                conn, _ = self.sock.accept()
            except socket.timeout:
                continue
            except OSError:
                break
            threading.Thread(target=self._session, args=(conn,), daemon=True).start()

    # ------------------------------------------------------------ one SMTP session
    def _reply(self, wfile, code, text, more=()):
        """Send a reply; multi-line replies use 'code-' on every line except the last ('code ')."""
        lines = list(more) + [text]
        for i, line in enumerate(lines):
            sep = " " if i == len(lines) - 1 else "-"
            out = "%d%s%s" % (code, sep, line)
            self.transcript.append("S: " + out)
            wfile.write(out.encode() + CRLF)
        wfile.flush()

    def _session(self, conn):
        conn.settimeout(5)
        rfile, wfile = conn.makefile("rb"), conn.makefile("wb")
        state, sender, rcpts = "GREETED", None, []
        try:
            self._reply(wfile, 220, "%s ESMTP fake server ready" % self.hostname)
            while True:
                raw = rfile.readline()
                if not raw:
                    break
                line = raw.decode("ascii", "replace").rstrip("\r\n")
                self.transcript.append("C: " + line)
                verb = line[:4].upper()
                arg = line[4:].strip()
                if verb == "HELO":
                    state, sender, rcpts = "READY", None, []
                    self._reply(wfile, 250, "%s Hello %s" % (self.hostname, arg))
                elif verb == "EHLO":
                    state, sender, rcpts = "READY", None, []
                    self._reply(wfile, 250, "8BITMIME", more=["%s Hello %s" % (self.hostname, arg), "SIZE 1048576"])
                elif verb == "MAIL":
                    if state != "READY":
                        self._reply(wfile, 503, "5.5.1 Bad sequence of commands (send HELO/EHLO first)")
                    elif not line.upper().startswith("MAIL FROM:"):
                        self._reply(wfile, 501, "5.5.4 Syntax: MAIL FROM:<address>")
                    else:
                        sender = line[10:].strip().split(" ")[0]        # ignore ESMTP parameters such as SIZE=
                        state = "MAIL"
                        self._reply(wfile, 250, "2.1.0 Sender OK")
                elif verb == "RCPT":
                    if state not in ("MAIL", "RCPT"):
                        self._reply(wfile, 503, "5.5.1 Bad sequence of commands (need MAIL first)")
                    elif not line.upper().startswith("RCPT TO:"):
                        self._reply(wfile, 501, "5.5.4 Syntax: RCPT TO:<address>")
                    else:
                        rcpts.append(line[8:].strip().split(" ")[0])
                        state = "RCPT"
                        self._reply(wfile, 250, "2.1.5 Recipient OK")
                elif verb == "DATA":
                    if state != "RCPT":
                        self._reply(wfile, 503, "5.5.1 Bad sequence of commands (need RCPT first)")
                        continue
                    self._reply(wfile, 354, "Start mail input; end with <CRLF>.<CRLF>")
                    body = []
                    while True:
                        dline = rfile.readline().decode("utf-8", "replace").rstrip("\r\n")
                        if dline == ".":                                 # lone dot ends the message
                            break
                        if dline.startswith(".."):                       # undo dot-stuffing
                            dline = dline[1:]
                        body.append(dline)
                    self.transcript.append("C: <%d data lines>" % len(body))
                    self.transcript.append("C: .")
                    self.mailbox.append({"from": sender, "to": list(rcpts), "data": "\r\n".join(body)})
                    state, sender, rcpts = "READY", None, []
                    self._reply(wfile, 250, "2.0.0 OK queued as %d" % len(self.mailbox))
                elif verb == "RSET":
                    state, sender, rcpts = ("READY" if state != "GREETED" else "GREETED"), None, []
                    self._reply(wfile, 250, "2.0.0 Reset OK")
                elif verb == "NOOP":
                    self._reply(wfile, 250, "2.0.0 OK")
                elif verb == "QUIT":
                    self._reply(wfile, 221, "2.0.0 %s closing connection" % self.hostname)
                    break
                else:
                    self._reply(wfile, 500, "5.5.2 Command not recognized")
        except (socket.timeout, OSError):
            pass
        finally:
            for f in (rfile, wfile):
                try:
                    f.close()
                except OSError:
                    pass
            conn.close()


# ---------------------------------------------------------------- raw client
class RawSMTPClient:
    def __init__(self, address, timeout=3):
        self.sock = socket.create_connection(address, timeout=timeout)
        self.rfile = self.sock.makefile("rb")
        self.codes = []

    def read_reply(self):
        """Read one (possibly multi-line) reply; the 4th character is '-' on every line but the last."""
        lines = []
        while True:
            line = self.rfile.readline().decode("ascii").rstrip("\r\n")
            lines.append(line)
            if len(line) < 4 or line[3] == " ":
                break
        code = int(lines[-1][:3])
        self.codes.append(code)
        return code, lines

    def cmd(self, text, expect):
        self.sock.sendall(text.encode("ascii") + CRLF)
        code, lines = self.read_reply()
        print("   C: %-34s S: %s" % (text, " | ".join(lines)))
        assert code == expect, "expected %d, got %d" % (expect, code)
        return code

    def send_data(self, body_lines):
        for line in body_lines:
            if line.startswith("."):
                line = "." + line             # dot-stuffing: a leading dot is doubled (RFC 5321 4.5.2)
            self.sock.sendall(line.encode("utf-8") + CRLF)
        self.sock.sendall(b"." + CRLF)        # end of data: <CRLF>.<CRLF>
        code, lines = self.read_reply()
        print("   C: %-34s S: %s" % ("<body> then '.'", " | ".join(lines)))
        return code

    def close(self):
        self.rfile.close()
        self.sock.close()


def main():
    server = FakeSMTPServer().start()
    print("Fake SMTP server on %s:%d" % server.address)
    try:
        print("\n== 1. One message, three recipients ==")
        c = RawSMTPClient(server.address)
        code, greeting = c.read_reply()
        print("   S: " + greeting[0])
        assert code == 220
        c.cmd("HELO client.cn-midsem.test", 250)
        c.cmd("MAIL FROM:<alice@cn-midsem.test>", 250)
        for who in ("bob", "carol", "dave"):
            c.cmd("RCPT TO:<%s@cn-midsem.test>" % who, 250)
        c.cmd("DATA", 354)
        body = ["From: alice@cn-midsem.test", "To: bob@cn-midsem.test", "Subject: midsem notes", "",
                "DNS first, then email.", ".hidden line that starts with a dot"]
        assert c.send_data(body) == 250
        c.cmd("QUIT", 221)
        c.close()
        print("   reply codes received:", c.codes)
        # 220 + HELO 250 + MAIL 250 + 3 x RCPT 250 + DATA 354 + end-of-data 250 + QUIT 221 = 9 replies
        assert c.codes == [220, 250, 250, 250, 250, 250, 354, 250, 221] and len(c.codes) == 9

        msg = server.mailbox[0]
        assert msg["from"] == "<alice@cn-midsem.test>"
        assert msg["to"] == ["<bob@cn-midsem.test>", "<carol@cn-midsem.test>", "<dave@cn-midsem.test>"]
        assert msg["data"].endswith(".hidden line that starts with a dot")      # dot-stuffing undone

        print("\n== 2. Out-of-order commands are rejected ==")
        c = RawSMTPClient(server.address)
        c.read_reply()
        c.cmd("RCPT TO:<bob@cn-midsem.test>", 503)          # no HELO, no MAIL yet
        c.cmd("EHLO client.cn-midsem.test", 250)
        c.cmd("DATA", 503)                                   # DATA before any RCPT
        c.cmd("FOO", 500)
        c.cmd("QUIT", 221)
        c.close()
        assert len(server.mailbox) == 1
    finally:
        server.stop()
    print("\nAll raw SMTP self-tests passed.")


if __name__ == "__main__":
    main()
