#!/usr/bin/env python3
"""Unit 15 - Optional scapy view of the same ARP and ICMP packets (constructed and shown, never sent).

COVERAGE: 15.15 (ARP request broadcast / reply unicast; ICMP echo, time exceeded for traceroute).

Run:  python3 Unit15_scapy_arp_icmp.py
If scapy is installed (pip install scapy) the packets are built with scapy layers and compared byte for
byte with a plain struct build. If scapy is missing, the struct build alone runs, so the script works
everywhere. No packet is ever sent: we only call bytes() on the objects.
"""
import socket
import struct


def struct_arp_request():
    return struct.pack("!HHBBH6s4s6s4s", 1, 0x0800, 6, 4, 1,
                       bytes.fromhex("001a2b3c4d5e"), socket.inet_aton("192.168.1.20"),
                       bytes(6), socket.inet_aton("192.168.1.1"))


def struct_icmp_echo():
    hdr = struct.pack("!BBHHH", 8, 0, 0, 0x1234, 1) + b"abcd"
    s = sum(struct.unpack("!6H", hdr))                 # six 16-bit words (12 bytes)
    s = (s & 0xFFFF) + (s >> 16)
    csum = ~s & 0xFFFF
    return struct.pack("!BBHHH", 8, 0, csum, 0x1234, 1) + b"abcd"


def main():
    arp_bytes = struct_arp_request()
    icmp_bytes = struct_icmp_echo()
    print("struct ARP request : %s" % arp_bytes.hex(" "))
    print("struct ICMP echo   : %s" % icmp_bytes.hex(" "))
    assert icmp_bytes[2:4] == b"\x21\x04"
    try:
        from scapy.all import ARP, ICMP, IP, Ether, conf   # heavy import, only if available
        conf.verb = 0
    except Exception:                                       # ImportError or a broken install
        print("scapy not installed - skipping high-level demo (struct version above is the same packet)")
        return
    arp = ARP(op=1, hwsrc="00:1a:2b:3c:4d:5e", psrc="192.168.1.20", hwdst="00:00:00:00:00:00", pdst="192.168.1.1")
    frame = Ether(dst="ff:ff:ff:ff:ff:ff", src="00:1a:2b:3c:4d:5e") / arp
    print("\nscapy ARP frame summary: %s" % frame.summary())
    assert bytes(arp) == arp_bytes                          # scapy and struct agree byte for byte
    assert bytes(frame)[12:14] == b"\x08\x06"                # EtherType ARP
    echo = ICMP(type=8, code=0, id=0x1234, seq=1) / b"abcd"
    assert bytes(echo) == icmp_bytes                         # scapy fills in the same checksum 0x2104
    probe = IP(dst="198.51.100.9", ttl=1) / ICMP(id=0x1234, seq=1)
    print("traceroute-style probe: %s (ttl=%d)" % (probe.summary(), probe[IP].ttl))
    assert bytes(probe)[8] == 1                              # TTL byte sits at offset 8 of the IPv4 header
    print("scapy and struct produced identical bytes; nothing was sent.")


if __name__ == "__main__":
    main()
