#!/usr/bin/env python3
"""Unit 03 - the same Ethernet II | IPv4 | TCP | HTTP | FCS frame built with struct (library level).

COVERAGE ids: 03.10 (encapsulation diagram, header overhead), 03.11 (TCP/IP layers),
03.12 (which layer adds which header).
Level: HIGH: struct, socket.inet_aton/inet_ntoa, ipaddress, zlib.crc32, optional scapy.

Run:  python3 Unit03_encapsulation_struct.py

Format strings used (all network byte order '!'):
  Ethernet II : '!6s6sH'             dst MAC, src MAC, EtherType           = 14 bytes
  IPv4        : '!BBHHHBBH4s4s'      ver/IHL, TOS, total length, ID, flags+fragment,
                                     TTL, protocol, header checksum, src, dst = 20 bytes
  TCP         : '!HHIIHHHH'          sport, dport, seq, ack, offset+flags, window,
                                     checksum, urgent pointer                = 20 bytes
"""
import ipaddress
import socket
import struct
import zlib

ETH = struct.Struct("!6s6sH")
IPV4 = struct.Struct("!BBHHHBBH4s4s")
TCP = struct.Struct("!HHIIHHHH")
assert (ETH.size, IPV4.size, TCP.size) == (14, 20, 20)


def checksum(data):
    """RFC 1071 Internet checksum using struct to read 16-bit words."""
    if len(data) % 2:
        data += b"\x00"
    s = sum(struct.unpack("!%dH" % (len(data) // 2), data))
    while s >> 16:
        s = (s & 0xFFFF) + (s >> 16)
    return ~s & 0xFFFF


def encapsulate(src_ip, dst_ip, src_mac, dst_mac, sport, dport, message, seq=1000, ack=2000):
    src, dst = socket.inet_aton(src_ip), socket.inet_aton(dst_ip)
    # Layer 4: TCP segment
    tcp0 = TCP.pack(sport, dport, seq, ack, (5 << 12) | 0x18, 64240, 0, 0)
    pseudo = struct.pack("!4s4sBBH", src, dst, 0, socket.IPPROTO_TCP, len(tcp0) + len(message))
    tcp = TCP.pack(sport, dport, seq, ack, (5 << 12) | 0x18, 64240, checksum(pseudo + tcp0 + message), 0)
    segment = tcp + message
    # Layer 3: IPv4 datagram
    ip0 = IPV4.pack(0x45, 0, 20 + len(segment), 0x1C46, 0x4000, 64, socket.IPPROTO_TCP, 0, src, dst)
    ip = IPV4.pack(0x45, 0, 20 + len(segment), 0x1C46, 0x4000, 64, socket.IPPROTO_TCP, checksum(ip0), src, dst)
    datagram = ip + segment
    # Layer 2: Ethernet II frame with FCS trailer (CRC-32, sent least significant byte first)
    eth = ETH.pack(bytes.fromhex(dst_mac.replace(":", "")), bytes.fromhex(src_mac.replace(":", "")), 0x0800)
    payload = datagram.ljust(46, b"\x00")
    fcs = struct.pack("<I", zlib.crc32(eth + payload) & 0xFFFFFFFF)
    return eth + payload + fcs


def decapsulate(frame):
    assert struct.unpack("<I", frame[-4:])[0] == zlib.crc32(frame[:-4]) & 0xFFFFFFFF, "FCS mismatch"
    dmac, smac, etype = ETH.unpack_from(frame, 0)
    vihl, _tos, total, ident, ff, ttl, proto, ipck, src, dst = IPV4.unpack_from(frame, 14)
    ihl = (vihl & 0x0F) * 4
    assert checksum(frame[14:14 + ihl]) == 0
    seg = frame[14 + ihl: 14 + total]
    sport, dport, seq, ack, offflags, win, tck, urg = TCP.unpack_from(seg, 0)
    pseudo = struct.pack("!4s4sBBH", src, dst, 0, proto, len(seg))
    assert checksum(pseudo + seg) == 0
    msg = seg[(offflags >> 12) * 4:]
    return {
        "eth": (dmac.hex(":"), smac.hex(":"), hex(etype)),
        "ip": (socket.inet_ntoa(src), socket.inet_ntoa(dst), ttl, proto, total),
        "tcp": (sport, dport, seq, ack, offflags & 0x1FF, win),
        "msg": msg,
    }


def overhead_table(payload_sizes, hdrs=(14, 20, 20), fcs=4, wire_extra=20):
    print("%8s %8s %10s %10s" % ("data B", "frame B", "eff frame", "eff wire"))
    rows = []
    for p in payload_sizes:
        frame = max(sum(hdrs) + p, 14 + 46) + fcs        # minimum frame is 64 B including FCS
        eff_f = p / frame
        eff_w = p / (frame + wire_extra)
        rows.append((p, frame, eff_f, eff_w))
        print("%8d %8d %9.2f%% %9.2f%%" % (p, frame, 100 * eff_f, 100 * eff_w))
    return rows


def scapy_demo(message, our_frame):
    try:
        from scapy.all import Ether, IP, TCP as STCP, Raw   # noqa: F401
    except ImportError:
        print("scapy not installed - skipping high-level scapy demo (pip install scapy to try it)")
        return
    pkt = (Ether(dst="02:00:00:00:00:0a", src="02:00:00:00:00:14") /
           IP(src="192.168.1.20", dst="192.168.1.10", id=0x1C46, flags="DF", ttl=64) /
           STCP(sport=80, dport=51514, seq=1000, ack=2000, flags="PA", window=64240) / Raw(load=message))
    raw = bytes(pkt)
    print("scapy built %d bytes (scapy leaves the FCS to the network card)" % len(raw))
    assert raw == our_frame[:-4], "scapy bytes differ from our struct-built frame"
    print("scapy bytes == our struct bytes (without the 4-byte FCS): True")
    pkt.show2()


def main():
    message = b"HTTP/1.1 200 OK\r\nContent-Length: 5\r\n\r\nhello"
    frame = encapsulate("192.168.1.20", "192.168.1.10", "02:00:00:00:00:14", "02:00:00:00:00:0a", 80, 51514, message)
    print("frame: %d bytes" % len(frame))
    print("  Ethernet header :", frame[:14].hex(" "))
    print("  IPv4 header     :", frame[14:34].hex(" "))
    print("  TCP header      :", frame[34:54].hex(" "))
    print("  HTTP message    :", frame[54:-4])
    print("  FCS trailer     :", frame[-4:].hex(" "))
    d = decapsulate(frame)
    print("decapsulated:", d["eth"], d["ip"], d["tcp"])
    assert len(frame) == 101 and d["msg"] == message
    assert d["ip"] == ("192.168.1.20", "192.168.1.10", 64, 6, 83)
    assert d["tcp"][:2] == (80, 51514) and d["tcp"][4] == 0x18

    # cross-check with the hand-computed IPv4 header checksum shown on the site
    ipck = struct.unpack_from("!H", frame, 14 + 10)[0]
    print("IPv4 header checksum = 0x%04x" % ipck)
    assert ipck == 0x9AF0
    assert frame[-4:].hex() == "33d6e227"   # same FCS as the from-scratch CRC in Unit03_encapsulation_bytes.py

    print("\nipaddress view of the two endpoints:")
    for a in ("192.168.1.20", "192.168.1.10"):
        ip = ipaddress.ip_address(a)
        print("  %s private=%s in 192.168.1.0/24=%s" % (ip, ip.is_private, ip in ipaddress.ip_network("192.168.1.0/24")))

    print("\nHeader overhead (14 + 20 + 20 + 4 = 58 B per frame, 20 B more on the wire):")
    rows = overhead_table([1, 5, 100, 536, 1460])
    assert rows[-1][1] == 1518 and round(rows[-1][2] * 100, 2) == 96.18
    assert rows[0][1] == 64            # a 1-byte message is padded up to the 64-byte minimum frame

    print()
    scapy_demo(message, frame)
    print("\nAll self-tests passed.")


if __name__ == "__main__":
    main()
