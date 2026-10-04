#!/usr/bin/env python3
"""Unit 03 - encapsulation and decapsulation by hand: Ethernet II | IPv4 | TCP | HTTP | FCS.

COVERAGE ids: 03.1 (encapsulation), 03.10 (header order MAC | IP | TCP | HTTP | Data,
PDU names, header overhead), 03.8 (frame = header + payload + trailer).
Level: LOW. No struct, no socket, no zlib: every field is placed with shifts and masks,
the Internet checksum (RFC 1071) and the Ethernet CRC-32 are written out bit by bit.

Run:  python3 Unit03_encapsulation_bytes.py

Scenario (same numbers as the worked example on the site): a web server 192.168.1.20
port 80 answers a browser 192.168.1.10 port 51514 on the same Ethernet LAN with
"HTTP/1.1 200 OK", a Content-Length header and the 5-byte body "hello".
"""

# ---------------------------------------------------------------- byte helpers
def be16(v):
    """16-bit value -> 2 bytes, most significant first (network byte order)."""
    return bytes([(v >> 8) & 0xFF, v & 0xFF])


def be32(v):
    return bytes([(v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF])


def rd16(b, off):
    return (b[off] << 8) | b[off + 1]


def rd32(b, off):
    return (b[off] << 24) | (b[off + 1] << 16) | (b[off + 2] << 8) | b[off + 3]


def ip_bytes(dotted):
    return bytes(int(x) for x in dotted.split("."))


def mac_bytes(text):
    return bytes(int(x, 16) for x in text.split(":"))


def mac_text(b):
    return ":".join("%02x" % x for x in b)


# ---------------------------------------------------------------- checksums written out
def internet_checksum(data):
    """RFC 1071 one's-complement sum of 16-bit words, then inverted."""
    if len(data) % 2:
        data = data + b"\x00"
    s = 0
    for i in range(0, len(data), 2):
        s += (data[i] << 8) | data[i + 1]
        s = (s & 0xFFFF) + (s >> 16)          # end-around carry
    return (~s) & 0xFFFF


def crc32_ethernet(data):
    """IEEE 802.3 CRC-32, reflected form: polynomial 0xEDB88320, init and final XOR 0xFFFFFFFF."""
    crc = 0xFFFFFFFF
    for byte in data:
        crc ^= byte
        for _ in range(8):
            if crc & 1:
                crc = (crc >> 1) ^ 0xEDB88320
            else:
                crc >>= 1
    return crc ^ 0xFFFFFFFF


# ---------------------------------------------------------------- encapsulation (top of stack to bottom)
def layer7_http():
    header = b"HTTP/1.1 200 OK\r\n" + b"Content-Length: 5\r\n" + b"\r\n"
    body = b"hello"
    return header, body


def layer4_tcp(src_ip, dst_ip, sport, dport, seq, ack, payload):
    data_offset = 5                         # 5 x 32-bit words = 20 bytes, no options
    flags = 0x18                            # PSH (0x08) + ACK (0x10)
    window = 64240
    offset_flags = (data_offset << 12) | flags   # RFC 9293: 4-bit offset, 4 reserved bits, 8 flag bits
    hdr = (be16(sport) + be16(dport) + be32(seq) + be32(ack) + be16(offset_flags) +
           be16(window) + be16(0) + be16(0))
    tcp_len = len(hdr) + len(payload)
    pseudo = ip_bytes(src_ip) + ip_bytes(dst_ip) + bytes([0, 6]) + be16(tcp_len)   # protocol 6 = TCP
    ck = internet_checksum(pseudo + hdr + payload)
    hdr = hdr[:16] + be16(ck) + hdr[18:]  # checksum lives at byte offset 16
    return hdr + payload


def layer3_ipv4(src_ip, dst_ip, segment, ident=0x1C46, ttl=64):
    ver_ihl = (4 << 4) | 5                  # version 4 in high nibble, IHL 5 words in low nibble
    total = 20 + len(segment)
    flags_frag = (0b010 << 13) | 0          # flags: DF set, fragment offset 0
    hdr = (bytes([ver_ihl, 0x00]) + be16(total) + be16(ident) + be16(flags_frag) +
           bytes([ttl, 6]) + be16(0) + ip_bytes(src_ip) + ip_bytes(dst_ip))
    ck = internet_checksum(hdr)
    hdr = hdr[:10] + be16(ck) + hdr[12:]    # header checksum at byte offset 10
    return hdr + segment


def layer2_ethernet(dst_mac, src_mac, packet):
    hdr = mac_bytes(dst_mac) + mac_bytes(src_mac) + be16(0x0800)   # EtherType 0x0800 = IPv4
    body = packet
    if len(body) < 46:
        body = body + bytes(46 - len(body))  # pad to the 46-byte minimum payload (64-byte minimum frame)
    fcs = crc32_ethernet(hdr + body)
    fcs_bytes = bytes([fcs & 0xFF, (fcs >> 8) & 0xFF, (fcs >> 16) & 0xFF, (fcs >> 24) & 0xFF])  # sent LSB first
    return hdr + body + fcs_bytes


# ---------------------------------------------------------------- decapsulation (bottom to top)
def decapsulate(frame):
    out = {}
    # Layer 2: check the trailer first, then read the header
    fcs_rx = frame[-4] | (frame[-3] << 8) | (frame[-2] << 16) | (frame[-1] << 24)
    assert crc32_ethernet(frame[:-4]) == fcs_rx, "FCS mismatch: frame corrupted"
    out["dst_mac"], out["src_mac"] = mac_text(frame[0:6]), mac_text(frame[6:12])
    out["ethertype"] = rd16(frame, 12)
    assert out["ethertype"] == 0x0800
    packet = frame[14:-4]
    # Layer 3
    version, ihl = packet[0] >> 4, packet[0] & 0x0F
    total = rd16(packet, 2)
    assert version == 4 and internet_checksum(packet[:ihl * 4]) == 0, "bad IPv4 header"
    out["ttl"], out["proto"] = packet[8], packet[9]
    out["src_ip"] = ".".join(str(x) for x in packet[12:16])
    out["dst_ip"] = ".".join(str(x) for x in packet[16:20])
    out["df"] = (rd16(packet, 6) >> 14) & 1
    segment = packet[ihl * 4: total]          # total length tells us where padding (if any) starts
    # Layer 4
    pseudo = packet[12:20] + bytes([0, 6]) + be16(len(segment))
    assert internet_checksum(pseudo + segment) == 0, "bad TCP checksum"
    out["sport"], out["dport"] = rd16(segment, 0), rd16(segment, 2)
    out["seq"], out["ack"] = rd32(segment, 4), rd32(segment, 8)
    off_flags = rd16(segment, 12)
    data_off = (off_flags >> 12) * 4
    out["flags"] = off_flags & 0x01FF
    app = segment[data_off:]
    # Layer 7
    head, _, body = app.partition(b"\r\n\r\n")
    out["status_line"] = head.split(b"\r\n")[0].decode()
    out["body"] = body.decode()
    return out


def main():
    client_ip, server_ip = "192.168.1.10", "192.168.1.20"
    client_mac, server_mac = "02:00:00:00:00:0a", "02:00:00:00:00:14"

    http_header, body = layer7_http()
    app = http_header + body
    seg = layer4_tcp(server_ip, client_ip, 80, 51514, 1000, 2000, app)
    pkt = layer3_ipv4(server_ip, client_ip, seg)
    frame = layer2_ethernet(client_mac, server_mac, pkt)

    print("=== Encapsulation (sender walks DOWN the stack) ===")
    print("L7 message  : HTTP header %2d B + data %d B = %3d B" % (len(http_header), len(body), len(app)))
    print("L4 segment  : TCP header 20 B + message  = %3d B" % len(seg))
    print("L3 datagram : IP header 20 B + segment   = %3d B" % len(pkt))
    print("L2 frame    : MAC header 14 B + datagram + FCS 4 B = %3d B" % len(frame))
    print("L1 bits     : %d bits (+ 8 B preamble/SFD and 12 B inter-frame gap on the wire)" % (len(frame) * 8))
    print("frame hex:")
    for i in range(0, len(frame), 16):
        print("  %04x  %s" % (i, " ".join("%02x" % x for x in frame[i:i + 16])))

    assert (len(http_header), len(body), len(app)) == (38, 5, 43)
    assert (len(seg), len(pkt), len(frame)) == (63, 83, 101)
    assert rd16(pkt, 10) == 0x9AF0          # IPv4 header checksum, matches the hand calculation on the site

    print("\n=== Decapsulation (receiver walks UP the stack) ===")
    d = decapsulate(frame)
    for k in ("dst_mac", "src_mac", "ethertype", "src_ip", "dst_ip", "ttl", "proto", "df",
              "sport", "dport", "seq", "ack", "flags", "status_line", "body"):
        v = d[k]
        print("  %-12s %s" % (k, hex(v) if k in ("ethertype", "flags") else v))
    assert d["src_ip"] == server_ip and d["dst_ip"] == client_ip and d["proto"] == 6
    assert d["sport"] == 80 and d["dport"] == 51514 and d["flags"] == 0x18 and d["df"] == 1
    assert d["status_line"] == "HTTP/1.1 200 OK" and d["body"] == "hello"

    # flip one bit to show the FCS catching corruption at Layer 2
    bad = bytearray(frame)
    bad[40] ^= 0x01
    try:
        decapsulate(bytes(bad))
        raise SystemExit("corruption not detected")
    except AssertionError as e:
        print("\nflipped one bit in byte 40 -> receiver drops the frame:", e)

    print("\n=== Header overhead ===")
    overhead = len(frame) - len(body)
    print("this frame: data %d B of %d B = %.2f%% efficiency (overhead %d B)"
          % (len(body), len(frame), 100 * len(body) / len(frame), overhead))
    full = 1460 + 20 + 20 + 14 + 4
    wire = full + 8 + 12
    print("full-size segment: 1460 / %d = %.2f%% at the frame level" % (full, 100 * 1460 / full))
    print("                   1460 / %d = %.2f%% counting preamble/SFD and inter-frame gap" % (wire, 100 * 1460 / wire))
    assert full == 1518 and wire == 1538
    assert round(100 * 1460 / full, 2) == 96.18 and round(100 * 1460 / wire, 2) == 94.93
    assert crc32_ethernet(b"123456789") == 0xCBF43926   # the standard CRC-32 check value
    print("\nAll self-tests passed.")


if __name__ == "__main__":
    main()
