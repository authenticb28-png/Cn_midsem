#!/usr/bin/env python3
"""Unit 09 - struct pack/unpack of the UDP and TCP headers, flag decoding, service-name lookup.

COVERAGE ids: 09.4 (well-known ports via socket.getservbyname), 09.5 (UDP header),
              09.7 / 09.9 (sequence and ACK arithmetic), 09.10 (TCP header fields and flags).

Level: high (struct, socket library helpers).

Run:  python3 Unit09_headers.py
Decodes the two hex headers used on the website:
  SYN-ACK : 01bb c93a 0000 015e 0000 0065 5012 ffff db68 0000
  SYN+MSS : c93a 01bb 0000 0064 0000 0000 6002 faf0 0000 0000 0204 05b4
and prints every field, the data offset arithmetic and the flag bits.
"""
import socket
import struct

UDP_FMT = "!HHHH"            # src port, dst port, length, checksum: 4 x 16 bits = 8 bytes
TCP_FMT = "!HHIIBBHHH"       # ports, seq, ack, offset/reserved byte, flags byte, window, checksum, urgent
assert struct.calcsize(UDP_FMT) == 8 and struct.calcsize(TCP_FMT) == 20

# Bit 7 of the flags byte is CWR, bit 0 is FIN (RFC 9293 / RFC 3168 order).
FLAG_BITS = [("CWR", 0x80), ("ECE", 0x40), ("URG", 0x20), ("ACK", 0x10),
             ("PSH", 0x08), ("RST", 0x04), ("SYN", 0x02), ("FIN", 0x01)]


def pack_udp(src_port, dst_port, payload, checksum=0):
    return struct.pack(UDP_FMT, src_port, dst_port, 8 + len(payload), checksum) + payload


def parse_udp(segment):
    sp, dp, length, csum = struct.unpack(UDP_FMT, segment[:8])
    return {"src_port": sp, "dst_port": dp, "length": length, "checksum": csum,
            "payload": segment[8:length]}


def decode_flags(flags_byte):
    return [name for name, bit in FLAG_BITS if flags_byte & bit]


def pack_tcp(src_port, dst_port, seq, ack, flags, window, data_offset=5, checksum=0, urgent=0, options=b""):
    assert len(options) % 4 == 0 and data_offset == 5 + len(options) // 4
    return struct.pack(TCP_FMT, src_port, dst_port, seq, ack, data_offset << 4, flags,
                       window, checksum, urgent) + options


def parse_tcp(segment):
    sp, dp, seq, ack, off_byte, flags, win, csum, urg = struct.unpack(TCP_FMT, segment[:20])
    data_offset = off_byte >> 4                     # high nibble = header length in 32-bit words
    hlen = data_offset * 4                          # in bytes: 20 (offset 5) up to 60 (offset 15)
    return {"src_port": sp, "dst_port": dp, "seq": seq, "ack": ack,
            "data_offset": data_offset, "header_len": hlen, "reserved": off_byte & 0x0F,
            "flags": decode_flags(flags), "window": win, "checksum": csum, "urgent": urg,
            "options": segment[20:hlen], "payload": segment[hlen:]}


def show(title, d):
    print(title)
    for k, v in d.items():
        if isinstance(v, int) and k in ("checksum",):
            v = "0x%04X" % v
        print("    %-12s %s" % (k, v))


def service_ports():
    """getservbyname reads the OS services database; fall back to the RFC values if a name is missing."""
    wanted = [("ftp-data", "tcp", 20), ("ftp", "tcp", 21), ("ssh", "tcp", 22), ("telnet", "tcp", 23),
              ("smtp", "tcp", 25), ("domain", "udp", 53), ("bootps", "udp", 67), ("bootpc", "udp", 68),
              ("http", "tcp", 80), ("pop3", "tcp", 110), ("imap", "tcp", 143), ("https", "tcp", 443),
              ("submission", "tcp", 587), ("imaps", "tcp", 993), ("pop3s", "tcp", 995),
              ("mysql", "tcp", 3306), ("postgresql", "tcp", 5432)]
    print("Service lookups (socket.getservbyname):")
    for name, proto, expected in wanted:
        try:
            port = socket.getservbyname(name, proto)
            src = "OS database"
        except OSError:
            port, src = expected, "fallback table"
        print("    %-11s %s/%-4d (%s)" % (name, proto, port, src))
        assert port == expected
    try:
        print("    getservbyport(443, 'tcp') = %r" % socket.getservbyport(443, "tcp"))
    except OSError:
        print("    getservbyport(443) not in this OS database")


def main():
    # ---- UDP
    seg = pack_udp(50000, 53, b"Hi!", checksum=0x4F7A)
    print("UDP segment bytes:", seg.hex(" "))
    u = parse_udp(seg)
    show("Parsed UDP header:", u)
    assert u["length"] == 11 and u["payload"] == b"Hi!" and u["dst_port"] == 53

    # ---- TCP SYN-ACK from the website exercise
    synack = bytes.fromhex("01bbc93a0000015e000000655012ffffdb680000")
    t = parse_tcp(synack)
    show("\nParsed TCP header (SYN-ACK):", t)
    assert (t["src_port"], t["dst_port"]) == (443, 51514)
    assert (t["seq"], t["ack"]) == (350, 101)
    assert t["header_len"] == 20 and t["flags"] == ["ACK", "SYN"] and t["window"] == 65535
    assert t["checksum"] == 0xDB68

    # ---- TCP SYN carrying one option: MSS = 1460 (kind 2, length 4, value 0x05B4)
    syn = pack_tcp(51514, 443, 100, 0, 0x02, 64240, data_offset=6, options=bytes.fromhex("020405b4"))
    print("\nSYN with MSS option:", syn.hex(" "))
    s = parse_tcp(syn)
    show("Parsed TCP header (SYN):", s)
    kind, olen, mss = struct.unpack("!BBH", s["options"])
    print("    option kind=%d len=%d MSS=%d" % (kind, olen, mss))
    assert s["header_len"] == 24 and s["flags"] == ["SYN"] and mss == 1460

    # ---- Handshake and sequence arithmetic (SL-L09 p18-20 ISNs)
    client_isn, server_isn = 100, 350
    syn_ack_ack = client_isn + 1          # SYN consumes one sequence number
    final_ack = server_isn + 1
    first_data_seq = client_isn + 1
    print("\nHandshake: SYN seq=%d | SYN-ACK seq=%d ack=%d | ACK seq=%d ack=%d"
          % (client_isn, server_isn, syn_ack_ack, first_data_seq, final_ack))
    assert (syn_ack_ack, final_ack) == (101, 351)
    next_seq = 1000 + 1000                # bytes 1000..1999 = 1000 bytes -> next byte is 2000
    assert next_seq == 2000
    wrap_s = 2 ** 32 * 8 / 1e9            # seconds to use all 2^32 byte numbers at 1 Gbps
    print("Sequence space wraps after %.2f s at 1 Gbps" % wrap_s)
    assert round(wrap_s, 1) == 34.4

    # ---- Byte order
    print("\nByte order of port 443: network (big-endian) %s, little-endian %s"
          % (struct.pack("!H", 443).hex(), struct.pack("<H", 443).hex()))
    assert struct.pack("!H", 443) == b"\x01\xbb"
    assert socket.ntohs(socket.htons(443)) == 443

    print()
    service_ports()
    print("\nAll header assertions passed.")


if __name__ == "__main__":
    main()
