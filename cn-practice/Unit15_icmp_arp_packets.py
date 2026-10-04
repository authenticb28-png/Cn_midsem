#!/usr/bin/env python3
"""Unit 15 - ICMP echo builder with checksum, and an ARP request/reply built by hand with struct.

COVERAGE: 15.15 (ICMP echo 8/0, destination unreachable 3, time exceeded 11, traceroute; ARP packet layout).

Run:  python3 Unit15_icmp_arp_packets.py           (build, parse and self-test only; nothing is sent)
      sudo python3 Unit15_icmp_arp_packets.py --send   (also sends ONE echo request to 127.0.0.1)
Sending needs a raw socket, which needs root. Without root AND --send the script never opens one.
References: RFC 792 (ICMP), RFC 826 (ARP), RFC 1071 (Internet checksum).
"""
import os
import socket
import struct
import sys
import time


def inet_checksum(data):
    """RFC 1071: one's-complement of the one's-complement sum of 16-bit words."""
    if len(data) % 2:
        data += b"\x00"
    s = 0
    for i in range(0, len(data), 2):
        s += (data[i] << 8) + data[i + 1]
    while s >> 16:                     # fold carries back into the low 16 bits
        s = (s & 0xFFFF) + (s >> 16)
    return ~s & 0xFFFF


def build_echo(ident, seq, payload, icmp_type=8):
    """ICMP echo request (type 8) or reply (type 0): type, code, checksum, identifier, sequence, data."""
    header = struct.pack("!BBHHH", icmp_type, 0, 0, ident, seq)      # checksum 0 while computing
    csum = inet_checksum(header + payload)
    return struct.pack("!BBHHH", icmp_type, 0, csum, ident, seq) + payload


def parse_icmp(pkt):
    t, c, csum, ident, seq = struct.unpack("!BBHHH", pkt[:8])
    return {"type": t, "code": c, "checksum": csum, "id": ident, "seq": seq, "data": pkt[8:]}


ICMP_MEANING = {(0, 0): "echo reply", (8, 0): "echo request", (3, 0): "destination network unreachable",
                (3, 1): "destination host unreachable", (3, 3): "destination port unreachable",
                (3, 4): "fragmentation needed and DF set", (11, 0): "TTL expired in transit",
                (11, 1): "fragment reassembly time exceeded"}


def mac(s):
    return bytes(int(x, 16) for x in s.split(":"))


def build_arp(oper, sha, spa, tha, tpa):
    """28-byte ARP packet for Ethernet/IPv4 (RFC 826)."""
    return struct.pack("!HHBBH6s4s6s4s",
                       1,            # HTYPE 1 = Ethernet
                       0x0800,       # PTYPE = IPv4 (same value as the IPv4 EtherType)
                       6, 4,         # HLEN 6-byte MAC, PLEN 4-byte IPv4 address
                       oper,         # OPER 1 = request, 2 = reply
                       mac(sha), socket.inet_aton(spa), mac(tha), socket.inet_aton(tpa))


def ethernet_frame(dst, src, ethertype, payload):
    frame = mac(dst) + mac(src) + struct.pack("!H", ethertype) + payload
    if len(frame) < 60:                       # minimum frame 64 bytes incl. 4-byte FCS -> pad to 60
        frame += b"\x00" * (60 - len(frame))
    return frame


def traceroute_probe_count(hops, probes_per_ttl=3):
    """Classic traceroute sends probes with TTL = 1, 2, up to the hop count of the destination."""
    return hops * probes_per_ttl


def main():
    print("ICMP echo request: id=0x1234 seq=1 payload b'abcd'")
    pkt = build_echo(0x1234, 1, b"abcd")
    print("  bytes: %s" % pkt.hex(" "))
    p = parse_icmp(pkt)
    print("  type=%d code=%d (%s) checksum=0x%04X id=0x%04X seq=%d" % (
        p["type"], p["code"], ICMP_MEANING[(p["type"], p["code"])], p["checksum"], p["id"], p["seq"]))
    # hand computation shown on the site: words 0800 0000 1234 0001 6162 6364
    words = [0x0800, 0x0000, 0x1234, 0x0001, 0x6162, 0x6364]
    total = sum(words)
    assert total == 0xDEFB
    assert p["checksum"] == (~total & 0xFFFF) == 0x2104
    assert inet_checksum(pkt) == 0                     # receiver check: sum over packet incl. checksum = all ones
    reply = build_echo(0x1234, 1, b"abcd", icmp_type=0)
    assert parse_icmp(reply)["checksum"] == 0x2904     # type 8 -> 0 lowers the sum by 0x0800, checksum rises by 0x0800
    print("  echo reply checksum = 0x%04X" % parse_icmp(reply)["checksum"])

    print("\nICMP types used by ping and traceroute:")
    for (t, c), meaning in sorted(ICMP_MEANING.items()):
        print("  type %2d code %d  %s" % (t, c, meaning))
    print("  traceroute to a host 12 hops away, 3 probes per TTL: %d probes" % traceroute_probe_count(12))
    assert traceroute_probe_count(12) == 36

    print("\nARP request: who has 192.168.1.1? tell 192.168.1.20")
    req = build_arp(1, "00:1a:2b:3c:4d:5e", "192.168.1.20", "00:00:00:00:00:00", "192.168.1.1")
    frame = ethernet_frame("ff:ff:ff:ff:ff:ff", "00:1a:2b:3c:4d:5e", 0x0806, req)
    print("  ARP packet %d bytes, Ethernet frame %d bytes before FCS (%d with FCS)" % (len(req), len(frame), len(frame) + 4))
    assert len(req) == 28 and len(frame) == 60
    h = struct.unpack("!HHBBH6s4s6s4s", req)
    assert h[:5] == (1, 0x0800, 6, 4, 1) and socket.inet_ntoa(h[8]) == "192.168.1.1"
    rep = build_arp(2, "aa:bb:cc:00:00:01", "192.168.1.1", "00:1a:2b:3c:4d:5e", "192.168.1.20")
    print("  ARP reply OPER=%d sent unicast back to 00:1a:2b:3c:4d:5e" % struct.unpack("!H", rep[6:8])[0])
    assert struct.unpack("!H", rep[6:8])[0] == 2

    if "--send" in sys.argv:
        if hasattr(os, "geteuid") and os.geteuid() == 0:
            s = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_ICMP)
            s.settimeout(2)
            t0 = time.time()
            s.sendto(build_echo(os.getpid() & 0xFFFF, 1, b"abcd"), ("127.0.0.1", 0))
            try:
                data, addr = s.recvfrom(1024)
                ihl = (data[0] & 0x0F) * 4                 # skip the IPv4 header the kernel hands us
                r = parse_icmp(data[ihl:])
                print("  reply from %s type=%d in %.2f ms" % (addr[0], r["type"], (time.time() - t0) * 1000))
            except socket.timeout:
                print("  no reply within 2 s")
            s.close()
        else:
            print("--send ignored: raw ICMP sockets need root")
    print("\nAll ICMP/ARP assertions passed.")


if __name__ == "__main__":
    main()
