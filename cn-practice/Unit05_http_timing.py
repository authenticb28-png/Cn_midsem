#!/usr/bin/env python3
"""Unit 05 - HTTP response-time math, HPACK integers and FTP PORT/PASV, from scratch.

COVERAGE rows: 05.8 (non-persistent vs persistent vs pipelined vs parallel RTT math),
05.10 (RTT cost of TCP+TLS vs QUIC setup), 05.14 (HPACK integer coding, FTP active/passive).

Level: LOW - every formula is written out by hand and checked with assert against the
worked examples on the site (Kurose & Ross 8e section 2.2.2 style; RFC 7541; RFC 959).

Formulas (RTT = round-trip time, T = transmission time of one object = L/R):
  non-persistent, serial  : base + N objects, each costs 2*RTT + T
  non-persistent, P parallel connections : 2RTT + T_base + ceil(N/P) * (2RTT + T_obj)
  persistent, no pipelining : 2RTT + T_base + N * (RTT + T_obj)
  persistent, pipelining    : 2RTT + T_base + RTT + N * T_obj   (all N requests back to back)

Run:  python3 Unit05_http_timing.py
"""
import math


# ---------------------------------------------------------------------------
# 1. Response-time formulas (all times in milliseconds)
# ---------------------------------------------------------------------------
def non_persistent(n_obj, rtt, t_base=0.0, t_obj=0.0, parallel=1):
    """Each object needs its own TCP handshake (1 RTT) + request/response (1 RTT) + transmission."""
    base = 2 * rtt + t_base                       # handshake RTT + request RTT + push the HTML
    waves = math.ceil(n_obj / parallel)           # objects fetched in groups of `parallel`
    return base + waves * (2 * rtt + t_obj)


def persistent_no_pipelining(n_obj, rtt, t_base=0.0, t_obj=0.0):
    """One TCP connection stays open; each object still waits for the previous response."""
    return 2 * rtt + t_base + n_obj * (rtt + t_obj)


def persistent_pipelining(n_obj, rtt, t_base=0.0, t_obj=0.0):
    """All N requests leave back to back; responses stream back on the same connection."""
    if n_obj == 0:
        return 2 * rtt + t_base
    return 2 * rtt + t_base + rtt + n_obj * t_obj


def in_rtts(fn, n_obj, **kw):
    """Express a time in units of RTT by setting RTT = 1 and transmission = 0."""
    return fn(n_obj, 1, **kw)


print("== 1. Base HTML + N referenced objects (transmission ignored, answers in RTTs) ==")
N = 8
table = [("non-persistent, serial", in_rtts(non_persistent, N)),
         ("non-persistent, 6 parallel", in_rtts(non_persistent, N, parallel=6)),
         ("persistent, no pipelining", in_rtts(persistent_no_pipelining, N)),
         ("persistent, pipelining", in_rtts(persistent_pipelining, N))]
for name, r in table:
    print("  N=%d  %-28s = %2d RTT" % (N, name, r))
assert [r for _, r in table] == [18, 6, 10, 3]

print("\n== 2. Site worked example A: N = 10 objects, RTT = 50 ms, tiny objects ==")
rtt = 50
a = non_persistent(10, rtt)
b = non_persistent(10, rtt, parallel=5)
c = persistent_no_pipelining(10, rtt)
d = persistent_pipelining(10, rtt)
print("  non-persistent serial      = (2 + 10*2) * 50 = %d ms" % a)
print("  non-persistent, 5 parallel = (2 + 2*2)  * 50 = %d ms" % b)
print("  persistent, no pipelining  = (2 + 10)   * 50 = %d ms" % c)
print("  persistent, pipelining     = (2 + 1)    * 50 = %d ms" % d)
assert (a, b, c, d) == (1100, 300, 600, 150)

print("\n== 3. Site worked example B: transmission time included ==")
R = 10e6                                   # 10 Mbps bottleneck link
rtt = 20                                   # ms
t_base = 10_000 * 8 / R * 1000             # 10,000-byte HTML  -> 8 ms
t_obj = 50_000 * 8 / R * 1000              # 50,000-byte image -> 40 ms
print("  T_base = 80,000 b / 10 Mbps = %.0f ms,  T_obj = 400,000 b / 10 Mbps = %.0f ms" % (t_base, t_obj))
e = non_persistent(3, rtt, t_base, t_obj)
f = persistent_no_pipelining(3, rtt, t_base, t_obj)
g = persistent_pipelining(3, rtt, t_base, t_obj)
print("  non-persistent            = 2*20+8 + 3*(2*20+40) = %.0f ms" % e)
print("  persistent, no pipelining = 2*20+8 + 3*(20+40)   = %.0f ms" % f)
print("  persistent, pipelining    = 2*20+8 + 20 + 3*40   = %.0f ms" % g)
assert (round(e), round(f), round(g)) == (288, 228, 188)


# ---------------------------------------------------------------------------
# 2. Connection-setup cost before the first response byte (in RTTs)
# ---------------------------------------------------------------------------
print("\n== 4. RTTs until the first HTTP response arrives (fresh connection) ==")
SETUP = {
    "HTTP/1.1 over TCP (http://)":           1 + 0 + 1,   # TCP + no TLS + request
    "HTTPS: TCP + TLS 1.2":                   1 + 2 + 1,
    "HTTPS: TCP + TLS 1.3":                   1 + 1 + 1,
    "HTTPS: TCP + TLS 1.3 0-RTT resumption":  1 + 0 + 1,   # GET rides in the first TLS flight
    "HTTP/3: QUIC new connection":            1 + 1,       # QUIC handshake carries TLS 1.3
    "HTTP/3: QUIC 0-RTT resumption":          0 + 1,
}
for k, v in SETUP.items():
    print("  %-40s %d RTT" % (k, v))
assert list(SETUP.values()) == [2, 4, 3, 2, 2, 1]


# ---------------------------------------------------------------------------
# 3. HPACK integer representation with an N-bit prefix (RFC 7541 section 5.1)
# ---------------------------------------------------------------------------
def hpack_int_encode(value, prefix_bits, first_byte_flags=0):
    max_prefix = (1 << prefix_bits) - 1          # e.g. 31 for a 5-bit prefix
    if value < max_prefix:
        return bytes([first_byte_flags | value])
    out = [first_byte_flags | max_prefix]        # prefix all ones = "more bytes follow"
    value -= max_prefix
    while value >= 128:
        out.append((value % 128) + 128)          # 7 data bits, top bit 1 = continue
        value //= 128
    out.append(value)                            # last byte, top bit 0
    return bytes(out)


def hpack_int_decode(data, prefix_bits):
    max_prefix = (1 << prefix_bits) - 1
    value = data[0] & max_prefix
    if value < max_prefix:
        return value
    m = 0
    for byte in data[1:]:
        value += (byte & 0x7F) << m
        m += 7
        if not byte & 0x80:
            break
    return value


print("\n== 5. HPACK integers (RFC 7541 Appendix C.1) ==")
e10 = hpack_int_encode(10, 5)
e1337 = hpack_int_encode(1337, 5)
print("  10   with 5-bit prefix ->", [format(x, "08b") for x in e10])
print("  1337 with 5-bit prefix ->", [format(x, "08b") for x in e1337], "=", list(e1337))
assert e10 == bytes([0b00001010])
assert e1337 == bytes([31, 154, 10])
assert hpack_int_decode(e1337, 5) == 1337

# Indexed Header Field: first bit 1, then the 7-bit table index
STATIC = {1: (":authority", ""), 2: (":method", "GET"), 3: (":method", "POST"), 4: (":path", "/"),
          5: (":path", "/index.html"), 6: (":scheme", "http"), 7: (":scheme", "https"), 8: (":status", "200")}
for idx in (2, 4, 6, 8):
    b = hpack_int_encode(idx, 7, 0x80)
    print("  indexed %-24s -> 0x%s" % ("%s: %s" % STATIC[idx], b.hex()))
assert hpack_int_encode(2, 7, 0x80) == b"\x82"
assert hpack_int_encode(62, 7, 0x80) == b"\xbe"   # first dynamic-table entry (C.3.2)
entry_size = len(":authority") + len("www.example.com") + 32   # RFC 7541 section 4.1
print("  dynamic entry ':authority: www.example.com' size = 10 + 15 + 32 =", entry_size)
assert entry_size == 57


# ---------------------------------------------------------------------------
# 4. FTP active (PORT) vs passive (PASV) port arithmetic (RFC 959)
# ---------------------------------------------------------------------------
def ftp_port_arg(ip, port):
    """PORT h1,h2,h3,h4,p1,p2 where port = p1*256 + p2."""
    return ",".join(ip.split(".") + [str(port // 256), str(port % 256)])


def ftp_parse(arg):
    parts = [int(x) for x in arg.split(",")]
    return ".".join(map(str, parts[:4])), parts[4] * 256 + parts[5]


print("\n== 6. FTP PORT / PASV arithmetic ==")
cmd = "PORT " + ftp_port_arg("192.168.1.5", 5001)
print("  active : client sends     ", cmd, "-> server connects FROM port 20 TO 192.168.1.5:5001")
assert cmd == "PORT 192,168,1,5,19,137"
ip, p = ftp_parse("192,168,1,2,195,80")
print("  passive: server replies    227 Entering Passive Mode (192,168,1,2,195,80) -> client connects to %s:%d" % (ip, p))
assert (ip, p) == ("192.168.1.2", 50000)

print("\nAll Unit05 timing/HPACK/FTP assertions passed.")
