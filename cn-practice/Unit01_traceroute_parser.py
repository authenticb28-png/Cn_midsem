#!/usr/bin/env python3
"""Unit 01 - traceroute output parser, per-hop latency analyser and TTL-limited probe builder.

COVERAGE ids: 01.6 (traceroute to Google Delhi, latency by hop, WB-L01 p30), 01.7 (edge / ISP / core).
Level: LOW (everything by hand: string tokenising, dotted-quad to integer with shifts,
prefix matching with bit masks, IPv4 and UDP headers packed byte by byte, the Internet
checksum written out). No socket is opened and nothing is sent.

Run:  python3 Unit01_traceroute_parser.py

The sample trace is modelled on WB-L01 p30 (private hops 192.168.1.1 and 10.240.9.204,
silent hop 3, ISP anaronline.net, Google edge at about 16 ms, load-balanced hops 7 to 9,
silent core hops 10 to 17, Delhi server at about 20 ms). Every address after hop 2 is an
illustrative documentation address (RFC 5737: 198.51.100.0/24 and 203.0.113.0/24), not a
real Google or ISP router.
"""

SAMPLE_TRACE = """traceroute to google.com (198.51.100.14), 30 hops max, 60 byte packets
 1  192.168.1.1 (192.168.1.1)  1.211 ms  1.093 ms  1.152 ms
 2  10.240.9.204 (10.240.9.204)  3.402 ms  3.517 ms  3.611 ms
 3  * * *
 4  static-41.anaronline.net (203.0.113.41)  8.204 ms  8.317 ms  8.125 ms
 5  static-45.anaronline.net (203.0.113.45)  12.388 ms  12.502 ms  12.296 ms
 6  203.0.113.97 (203.0.113.97)  16.104 ms  16.227 ms  15.989 ms
 7  198.51.100.21 (198.51.100.21)  16.402 ms 198.51.100.23 (198.51.100.23)  16.611 ms  16.388 ms
 8  198.51.100.31 (198.51.100.31)  16.921 ms 198.51.100.33 (198.51.100.33)  16.804 ms  17.010 ms
 9  198.51.100.41 (198.51.100.41)  17.315 ms 198.51.100.43 (198.51.100.43)  17.199 ms  17.402 ms
10  * * *
11  * * *
12  * * *
13  * * *
14  * * *
15  * * *
16  * * *
17  * * *
18  del11s05-in-f14.1e100.net (198.51.100.14)  20.104 ms  19.987 ms  20.230 ms
"""

# Who owns which block in the illustrative trace: (network, prefix length, label).
OWNERS = [
    ("192.168.0.0", 16, "Private: home router (RFC 1918)"),
    ("10.0.0.0", 8, "Private: ISP access (RFC 1918)"),
    ("172.16.0.0", 12, "Private (RFC 1918)"),
    ("203.0.113.0", 26, "Your ISP (anaronline.net)"),
    ("203.0.113.64", 26, "Google edge (peering router)"),
    ("198.51.100.0", 24, "Google network"),
]


# ---------------------------------------------------------------- address helpers (bit level)
def ip_to_int(dotted):
    """'192.168.1.1' -> 32-bit integer, built with shifts instead of a library call."""
    parts = dotted.split(".")
    assert len(parts) == 4, "an IPv4 address has exactly four octets"
    value = 0
    for p in parts:
        octet = int(p)
        assert 0 <= octet <= 255
        value = (value << 8) | octet          # shift the previous octets left, OR in the new one
    return value


def int_to_ip(value):
    """32-bit integer -> dotted quad, peeling one octet off with a mask each time."""
    return ".".join(str((value >> shift) & 0xFF) for shift in (24, 16, 8, 0))


def prefix_mask(length):
    """Prefix length -> 32-bit mask, e.g. 24 -> 0xFFFFFF00."""
    return (0xFFFFFFFF << (32 - length)) & 0xFFFFFFFF if length else 0


def in_prefix(addr, network, length):
    """True when addr and network agree on the first `length` bits."""
    m = prefix_mask(length)
    return (ip_to_int(addr) & m) == (ip_to_int(network) & m)


def owner_of(addr):
    """Longest-prefix match against OWNERS."""
    best, best_len = "unknown", -1
    for net, length, label in OWNERS:
        if in_prefix(addr, net, length) and length > best_len:
            best, best_len = label, length
    return best


# ---------------------------------------------------------------- parser (hand-written tokeniser)
def is_number(tok):
    """True for tokens such as '16.104' (digits with at most one dot)."""
    if tok.count(".") > 1 or not tok:
        return False
    return tok.replace(".", "", 1).isdigit()


def is_dotted_quad(tok):
    parts = tok.split(".")
    return len(parts) == 4 and all(p.isdigit() and 0 <= int(p) <= 255 for p in parts)


def parse_trace(text):
    """Return (destination, list of hop dicts).

    Each hop dict: {"hop": n, "probes": [(ip or None, rtt_ms or None)], "names": {ip: name}}
    A '*' token is a probe that got no reply within the wait time.
    """
    lines = [ln for ln in text.strip().splitlines() if ln.strip()]
    header = lines[0]
    # header looks like: traceroute to NAME (IP), 30 hops max, 60 byte packets
    dest_ip = header[header.index("(") + 1: header.index(")")]
    hops = []
    for line in lines[1:]:
        tokens = line.split()
        hop = {"hop": int(tokens[0]), "probes": [], "names": {}}
        current_ip = None
        pending_name = None
        for tok in tokens[1:]:
            if tok == "*":
                hop["probes"].append((None, None))          # lost / silent probe
            elif tok == "ms":
                continue                                     # unit label after each RTT
            elif tok.startswith("(") and tok.endswith(")"):
                current_ip = tok[1:-1]                       # the address of the name just seen
                hop["names"][current_ip] = pending_name
            elif is_number(tok) and not is_dotted_quad(tok):
                hop["probes"].append((current_ip, float(tok)))
            else:
                pending_name = tok                           # a responder name (or bare address)
                if is_dotted_quad(tok):
                    current_ip = tok
        hops.append(hop)
    return dest_ip, hops


def summarise(hops):
    """Per-hop statistics: responders, min/avg/max RTT, lost probes."""
    rows = []
    for h in hops:
        rtts = [r for _, r in h["probes"] if r is not None]
        responders = []
        for ip, r in h["probes"]:
            if ip is not None and ip not in responders:
                responders.append(ip)
        lost = sum(1 for _, r in h["probes"] if r is None)
        row = {"hop": h["hop"], "responders": responders, "lost": lost,
               "min": min(rtts) if rtts else None,
               "avg": sum(rtts) / len(rtts) if rtts else None,
               "max": max(rtts) if rtts else None,
               "name": h["names"].get(responders[0]) if responders else None}
        rows.append(row)
    return rows


def print_report(dest_ip, rows):
    print("Destination:", dest_ip)
    print("%-4s %-17s %-34s %8s %8s %8s %8s" % ("hop", "address", "owner", "min", "avg", "max", "delta"))
    prev_avg = None
    for r in rows:
        if not r["responders"]:
            print("%-4d %-17s %-34s %8s %8s %8s %8s" % (r["hop"], "* * *", "silent (no ICMP reply)", "-", "-", "-", "-"))
            continue
        delta = "" if prev_avg is None else "%+.3f" % (r["avg"] - prev_avg)
        addr = r["responders"][0] + (" (+%d)" % (len(r["responders"]) - 1) if len(r["responders"]) > 1 else "")
        print("%-4d %-17s %-34s %8.3f %8.3f %8.3f %8s" % (r["hop"], addr, owner_of(r["responders"][0]),
                                                          r["min"], r["avg"], r["max"], delta))
        prev_avg = r["avg"]


# ---------------------------------------------------------------- TTL-limited UDP probe builder (print only)
def internet_checksum(data):
    """RFC 1071: 16-bit one's-complement of the one's-complement sum of 16-bit words."""
    if len(data) % 2:
        data += b"\x00"                                  # pad odd length with a zero byte
    total = 0
    for i in range(0, len(data), 2):
        total += (data[i] << 8) | data[i + 1]            # big-endian 16-bit word
        total = (total & 0xFFFF) + (total >> 16)         # fold the carry back in (end-around carry)
    return (~total) & 0xFFFF


def u16(v):
    return bytes([(v >> 8) & 0xFF, v & 0xFF])


def u32(v):
    return bytes([(v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF])


def build_probe(src, dst, ttl, dst_port, src_port=45001, ident=0x4D2E, payload_len=32):
    """Return the bytes of one IPv4+UDP traceroute-style probe (60 bytes with a 32-byte payload)."""
    payload = bytes((0x40 + i) & 0xFF for i in range(payload_len))   # '@ABCDEF' style filler
    udp_len = 8 + len(payload)
    total_len = 20 + udp_len
    # UDP checksum covers a pseudo-header: src, dst, zero, protocol 17, UDP length
    pseudo = u32(ip_to_int(src)) + u32(ip_to_int(dst)) + bytes([0, 17]) + u16(udp_len)
    udp_wo_ck = u16(src_port) + u16(dst_port) + u16(udp_len) + u16(0) + payload
    udp_ck = internet_checksum(pseudo + udp_wo_ck)
    if udp_ck == 0:
        udp_ck = 0xFFFF                                  # RFC 768: 0 means "no checksum", so send all ones
    udp = u16(src_port) + u16(dst_port) + u16(udp_len) + u16(udp_ck) + payload
    ver_ihl = (4 << 4) | 5                               # version 4, header length 5 words = 20 bytes
    ip_wo_ck = (bytes([ver_ihl, 0]) + u16(total_len) + u16(ident) + u16(0) +
                bytes([ttl, 17]) + u16(0) + u32(ip_to_int(src)) + u32(ip_to_int(dst)))
    ip_ck = internet_checksum(ip_wo_ck)
    ip_hdr = ip_wo_ck[:10] + u16(ip_ck) + ip_wo_ck[12:]
    return ip_hdr + udp


def hexdump(b, width=20):
    return "\n".join("      " + " ".join("%02x" % x for x in b[i:i + width]) for i in range(0, len(b), width))


def main():
    dest_ip, hops = parse_trace(SAMPLE_TRACE)
    rows = summarise(hops)
    print("=== Per-hop latency analysis (sample modelled on WB-L01 p30) ===")
    print_report(dest_ip, rows)

    silent = [r["hop"] for r in rows if not r["responders"]]
    balanced = [r["hop"] for r in rows if len(r["responders"]) > 1]
    answering = [r for r in rows if r["responders"]]
    print("\nSilent hops (* * *):", silent)
    print("Load-balanced hops (two responders for one TTL):", balanced)

    # biggest increase in average RTT between consecutive answering hops
    jumps = [(b["avg"] - a["avg"], a["hop"], b["hop"]) for a, b in zip(answering, answering[1:])]
    big = max(jumps)
    print("Largest jump: hop %d -> hop %d, +%.3f ms" % (big[1], big[2], big[0]))
    final = rows[-1]
    print("Destination reached at hop %d, average RTT %.3f ms" % (final["hop"], final["avg"]))
    one_way = final["min"] / 2
    print("Upper bound on fibre path length: (min RTT / 2) x 2e8 m/s = %.1f km" % (one_way / 1000 * 2e8 / 1000))

    # ---- self-tests on the textbook reading of the trace
    assert dest_ip == "198.51.100.14"
    assert len(rows) == 18
    assert silent == [3, 10, 11, 12, 13, 14, 15, 16, 17]
    assert balanced == [7, 8, 9]
    assert abs(rows[0]["avg"] - 1.152) < 1e-9
    assert abs(rows[5]["avg"] - 16.106666666666666) < 1e-9 and rows[5]["min"] == 15.989
    assert abs(final["avg"] - 20.107) < 1e-9
    assert (big[1], big[2]) == (2, 4) and abs(big[0] - 4.705333333333333) < 1e-9
    assert owner_of("192.168.1.1").startswith("Private") and owner_of("10.240.9.204").startswith("Private")
    assert owner_of("203.0.113.97") == "Google edge (peering router)"
    assert int_to_ip(ip_to_int("10.240.9.204")) == "10.240.9.204"
    assert prefix_mask(26) == 0xFFFFFFC0

    # ---- TTL-limited probes: build and print, never send
    print("\n=== TTL-limited UDP probes (built by hand, printed only, nothing is sent) ===")
    src, base_port, per_hop = "192.168.1.50", 33434, 3
    for ttl in (1, 2, 3):
        for q in range(per_hop):
            port = base_port + (ttl - 1) * per_hop + q     # classic Unix traceroute: port grows per probe
            pkt = build_probe(src, dest_ip, ttl, port)
            assert len(pkt) == 60                           # matches "60 byte packets" in the header line
            assert pkt[8] == ttl and pkt[9] == 17           # TTL byte and protocol byte (UDP)
            assert internet_checksum(pkt[:20]) == 0         # a valid header sums to 0xFFFF, so ~ is 0
            if q == 0:
                print("TTL=%d probe #%d -> %s UDP dst port %d, %d bytes:" % (ttl, q + 1, dest_ip, port, len(pkt)))
                print(hexdump(pkt[:28]))
                print("      (first 28 bytes = 20-byte IPv4 header + 8-byte UDP header; 32 payload bytes follow)")
    print("Router at hop k sees TTL reach 0 and returns ICMP Time Exceeded (type 11, code 0).")
    print("The destination returns ICMP Port Unreachable (type 3, code 3), which tells traceroute to stop.")
    print("\nAll self-tests passed.")


if __name__ == "__main__":
    main()
