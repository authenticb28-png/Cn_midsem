#!/usr/bin/env python3
"""Unit 07 - DNS messages by hand (low level).

Topic : DNS query/response wire format (RFC 1035 section 4.1), QNAME label encoding,
        name compression pointers, and a mock authoritative DNS server over UDP.
COVERAGE ids : 07.2, 07.4, 07.6
Run   : python3 Unit07_dns_packet.py

What it does
  1. Builds a DNS query for www.amazon.com / A with struct (12-byte header + question).
  2. Parses a canned response for www.newtonschool.co that uses compression pointers
     (a CNAME to newtonschool.co, then the A record 99.83.190.102 from WB-L08 p117).
  3. Starts a mock authoritative server on 127.0.0.1 (UDP, OS-assigned port) that
     answers A queries from a small zone, drops the very first datagram it sees, and
     shows the client's timeout-and-retry logic recovering from that loss.
Everything stays on 127.0.0.1; nothing touches the Internet.
"""
import socket
import struct
import threading

# ---------------------------------------------------------------- constants (RFC 1035)
TYPE_A, TYPE_NS, TYPE_CNAME, TYPE_MX, TYPE_AAAA = 1, 2, 5, 15, 28
CLASS_IN = 1
TYPE_NAMES = {1: "A", 2: "NS", 5: "CNAME", 15: "MX", 16: "TXT", 28: "AAAA"}
RCODE_NAMES = {0: "NOERROR", 1: "FORMERR", 2: "SERVFAIL", 3: "NXDOMAIN", 4: "NOTIMP", 5: "REFUSED"}


# ---------------------------------------------------------------- building
def encode_qname(name):
    """www.amazon.com -> b'\\x03www\\x06amazon\\x03com\\x00' (length-prefixed labels + root byte)."""
    out = b""
    for label in name.rstrip(".").split("."):
        raw = label.encode("ascii")
        assert 1 <= len(raw) <= 63, "a label is 1 to 63 bytes (the top 2 bits of the length byte must be 00)"
        out += bytes([len(raw)]) + raw          # one length byte, then the label characters
    out += b"\x00"                              # zero-length label = the root, ends the name
    assert len(out) <= 255, "a whole encoded name is at most 255 bytes"
    return out


def make_flags(qr=0, opcode=0, aa=0, tc=0, rd=1, ra=0, z=0, rcode=0):
    """Pack the 16-bit flags word: QR(1) Opcode(4) AA(1) TC(1) RD(1) RA(1) Z(3) RCODE(4)."""
    return (qr << 15) | (opcode << 11) | (aa << 10) | (tc << 9) | (rd << 8) | (ra << 7) | (z << 4) | rcode


def split_flags(flags):
    """Inverse of make_flags: shift each field down and mask it."""
    return {"QR": flags >> 15 & 1, "Opcode": flags >> 11 & 0xF, "AA": flags >> 10 & 1, "TC": flags >> 9 & 1,
            "RD": flags >> 8 & 1, "RA": flags >> 7 & 1, "Z": flags >> 4 & 0x7, "RCODE": flags & 0xF}


def build_query(qid, name, qtype=TYPE_A, rd=1):
    # Header: ID, flags, QDCOUNT=1, ANCOUNT=0, NSCOUNT=0, ARCOUNT=0 -> six unsigned 16-bit big-endian words
    header = struct.pack("!HHHHHH", qid, make_flags(rd=rd), 1, 0, 0, 0)
    question = encode_qname(name) + struct.pack("!HH", qtype, CLASS_IN)
    return header + question


# ---------------------------------------------------------------- parsing
def read_name(msg, offset):
    """Return (name, offset just past the name in the ORIGINAL position).

    A length byte whose top two bits are 11 starts a 2-byte pointer: the low 14 bits
    are an offset from the start of the message where the rest of the name lives.
    """
    labels, jumped, end, hops = [], False, offset, 0
    while True:
        length = msg[offset]
        if length & 0xC0 == 0xC0:                       # compression pointer 11xxxxxx xxxxxxxx
            pointer = struct.unpack("!H", msg[offset:offset + 2])[0] & 0x3FFF
            if not jumped:
                end = offset + 2                        # the name occupies only 2 bytes here
            offset, jumped = pointer, True
            hops += 1
            assert hops < 20, "pointer loop"
            continue
        if length == 0:                                 # root label: name finished
            if not jumped:
                end = offset + 1
            return ".".join(labels) + ".", end
        labels.append(msg[offset + 1:offset + 1 + length].decode("ascii"))
        offset += 1 + length


def parse_message(msg):
    qid, flags, qd, an, ns, ar = struct.unpack("!HHHHHH", msg[:12])
    out = {"id": qid, "flags": split_flags(flags), "counts": (qd, an, ns, ar), "questions": [], "answers": []}
    off = 12
    for _ in range(qd):
        name, off = read_name(msg, off)
        qtype, qclass = struct.unpack("!HH", msg[off:off + 4])
        off += 4
        out["questions"].append((name, TYPE_NAMES.get(qtype, qtype), qclass))
    for _ in range(an + ns + ar):
        name, off = read_name(msg, off)
        rtype, rclass, ttl, rdlen = struct.unpack("!HHIH", msg[off:off + 10])   # 2+2+4+2 = 10 bytes
        off += 10
        rdata = msg[off:off + rdlen]
        if rtype == TYPE_A:
            value = socket.inet_ntoa(rdata)
        elif rtype in (TYPE_CNAME, TYPE_NS):
            value = read_name(msg, off)[0]              # RDATA is itself a (possibly compressed) name
        else:
            value = rdata.hex()
        off += rdlen
        out["answers"].append((name, TYPE_NAMES.get(rtype, rtype), ttl, value))
    out["length"] = off
    return out


# ---------------------------------------------------------------- canned response
# Response to "www.newtonschool.co A", hand-assembled byte by byte (67 bytes in total).
CANNED_RESPONSE = bytes.fromhex(
    "1a2b" "8180" "0001" "0002" "0000" "0000"                   # header: ID, flags, QD=1 AN=2 NS=0 AR=0
    "03" "777777"                                               # offset 12: 3 'www'
    "0c" "6e6577746f6e7363686f6f6c"                             # offset 16: 12 'newtonschool'
    "02" "636f" "00"                                            # offset 29: 2 'co', then root byte
    "0001" "0001"                                               # QTYPE=A, QCLASS=IN (question ends at 37)
    "c00c" "0005" "0001" "0000012c" "0002" "c010"               # ans 1: name->12, CNAME, IN, TTL 300, RDLEN 2, RDATA->16
    "c010" "0001" "0001" "0000003c" "0004" "6353be66"           # ans 2: name->16, A, IN, TTL 60, RDLEN 4, 99.83.190.102
)


# ---------------------------------------------------------------- mock authoritative server
ZONE = {"newtonschool.co.": "99.83.190.102", "www.cn-midsem.test.": "10.0.0.5", "mail.cn-midsem.test.": "10.0.0.25"}


def answer_query(query):
    """Build an authoritative reply (AA=1) for one query datagram."""
    qid, flags, qd = struct.unpack("!HHH", query[:6])
    name, off = read_name(query, 12)
    qtype, qclass = struct.unpack("!HH", query[off:off + 4])
    question = query[12:off + 4]                         # echo the question section unchanged
    rd = flags >> 8 & 1                                  # copy RD from the query (RFC 1035 4.1.1)
    if name.lower() not in ZONE:
        hdr = struct.pack("!HHHHHH", qid, make_flags(qr=1, aa=1, rd=rd, rcode=3), 1, 0, 0, 0)   # NXDOMAIN
        return hdr + question
    if qtype != TYPE_A:
        hdr = struct.pack("!HHHHHH", qid, make_flags(qr=1, aa=1, rd=rd, rcode=0), 1, 0, 0, 0)   # NODATA
        return hdr + question
    hdr = struct.pack("!HHHHHH", qid, make_flags(qr=1, aa=1, rd=rd, rcode=0), 1, 1, 0, 0)
    rr = struct.pack("!HHHIH", 0xC00C, TYPE_A, CLASS_IN, 300, 4) + socket.inet_aton(ZONE[name.lower()])
    return hdr + question + rr                           # 0xC00C = pointer to the QNAME at offset 12


def run_server(sock, stop, stats):
    sock.settimeout(0.2)
    while not stop.is_set():
        try:
            data, addr = sock.recvfrom(512)
        except socket.timeout:
            continue
        stats["received"] += 1
        if stats["received"] == 1:                       # simulate a lost datagram once
            stats["dropped"] += 1
            continue
        sock.sendto(answer_query(data), addr)


def resolve(server_addr, name, qid, timeout=0.4, retries=3):
    """Send a query; on timeout resend the same query (same ID), up to `retries` times."""
    cli = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    cli.settimeout(timeout)
    query = build_query(qid, name)
    try:
        for attempt in range(1, retries + 1):
            cli.sendto(query, server_addr)
            try:
                data, _ = cli.recvfrom(512)
            except socket.timeout:
                print("    attempt %d: no reply within %.1f s, retrying" % (attempt, timeout))
                continue
            reply = parse_message(data)
            if reply["id"] != qid:                       # ignore replies that do not match our ID
                continue
            return reply, attempt
        raise RuntimeError("no answer after %d attempts" % retries)
    finally:
        cli.close()


def main():
    print("== 1. Build a query for www.amazon.com / A ==")
    q = build_query(0x1234, "www.amazon.com")
    print("   bytes (%d): %s" % (len(q), q.hex(" ")))
    assert encode_qname("www.amazon.com") == b"\x03www\x06amazon\x03com\x00"
    assert len(encode_qname("www.amazon.com")) == len("www.amazon.com") + 2 == 16
    assert len(q) == 12 + 16 + 4 == 32                   # header + QNAME + QTYPE/QCLASS
    assert q[2:4] == b"\x01\x00"                         # flags 0x0100: only RD set
    print("   header 12 B + QNAME 16 B + QTYPE/QCLASS 4 B = 32 B of UDP payload")

    print("\n== 2. Parse the canned response (compression pointers) ==")
    r = parse_message(CANNED_RESPONSE)
    print("   ID=0x%04x flags=%s counts=%s" % (r["id"], r["flags"], r["counts"]))
    for rec in r["questions"]:
        print("   question:", rec)
    for rec in r["answers"]:
        print("   answer  :", rec)
    assert len(CANNED_RESPONSE) == r["length"] == 67
    assert r["flags"] == {"QR": 1, "Opcode": 0, "AA": 0, "TC": 0, "RD": 1, "RA": 1, "Z": 0, "RCODE": 0}
    assert r["answers"][0] == ("www.newtonschool.co.", "CNAME", 300, "newtonschool.co.")
    assert r["answers"][1] == ("newtonschool.co.", "A", 60, "99.83.190.102")
    assert read_name(CANNED_RESPONSE, 37) == ("www.newtonschool.co.", 39)   # pointer uses 2 bytes
    assert 0xC00C & 0x3FFF == 12 and 0xC010 & 0x3FFF == 16

    print("\n== 3. Mock authoritative server on 127.0.0.1 (UDP) ==")
    srv = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    srv.bind(("127.0.0.1", 0))                           # port 0: the OS picks a free port
    addr = srv.getsockname()
    stop, stats = threading.Event(), {"received": 0, "dropped": 0}
    t = threading.Thread(target=run_server, args=(srv, stop, stats), daemon=True)
    t.start()
    print("   server listening on %s:%d" % addr)
    try:
        reply, attempts = resolve(addr, "newtonschool.co", 0xBEEF)
        print("   newtonschool.co ->", reply["answers"], "after", attempts, "attempts")
        assert attempts == 2 and stats["dropped"] == 1       # first datagram was dropped, retry worked
        assert reply["flags"]["AA"] == 1 and reply["answers"][0][3] == "99.83.190.102"

        reply, attempts = resolve(addr, "www.cn-midsem.test", 0x0101)
        print("   www.cn-midsem.test ->", reply["answers"])
        assert reply["answers"][0][3] == "10.0.0.5" and attempts == 1

        reply, _ = resolve(addr, "nosuch.cn-midsem.test", 0x0202)
        print("   nosuch.cn-midsem.test -> RCODE", reply["flags"]["RCODE"], RCODE_NAMES[reply["flags"]["RCODE"]])
        assert reply["flags"]["RCODE"] == 3 and reply["answers"] == []
    finally:
        stop.set()
        t.join(2)
        srv.close()
    print("\nAll DNS packet self-tests passed.")


if __name__ == "__main__":
    main()
