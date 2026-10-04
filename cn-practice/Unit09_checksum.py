#!/usr/bin/env python3
"""Unit 09 - Hand-rolled 16-bit Internet checksum (RFC 768 / RFC 1071 style) with the IPv4 pseudo-header.

COVERAGE ids: 09.5 (UDP header checksum field), 09.12 (pseudo-header checksum, 1's-complement sum).

Level: low (no struct, no library checksum: bytes are split into 16-bit words with shifts,
       every addition and every end-around carry is printed).

Run:  python3 Unit09_checksum.py
Worked example (the same numbers as the website):
   src IP 192.168.1.10, dst IP 192.168.1.20, UDP src port 50000, dst port 53, data b"Hi!"
   UDP length = 8 + 3 = 11, checksum = 0x4F7A.
Also checks the Kurose & Ross three-word example (checksum 0xB53D) and the TCP SYN-ACK
header used in the header-decoding exercise (checksum 0xDB68).
"""


def ip_to_bytes(dotted):
    """'192.168.1.10' -> b'\\xc0\\xa8\\x01\\x0a' without the socket module."""
    parts = [int(p) for p in dotted.split(".")]
    assert len(parts) == 4 and all(0 <= p <= 255 for p in parts)
    return bytes(parts)


def u16(n):
    """Big-endian (network byte order) 2 bytes, done by hand: high byte first."""
    return bytes([(n >> 8) & 0xFF, n & 0xFF])


def words16(data):
    """Split bytes into 16-bit big-endian words; pad an odd length with one zero byte."""
    if len(data) % 2 == 1:
        data = data + b"\x00"          # padding is for the sum only; it is NOT sent or counted in Length
    return [(data[i] << 8) | data[i + 1] for i in range(0, len(data), 2)]


def ones_complement_add(a, b):
    """16-bit 1's-complement addition: add, then fold any carry out of bit 15 back into bit 0."""
    total = a + b
    carry = total >> 16
    return (total & 0xFFFF) + carry, total, carry


def internet_checksum(data, verbose=False):
    """Return the 16-bit Internet checksum of `data` (bytes)."""
    s = 0
    for w in words16(data):
        s, raw, carry = ones_complement_add(s, w)
        if verbose:
            note = "  carry 1 wraps around -> %04X" % s if carry else ""
            print("    + %04X = %05X%s" % (w, raw, note))
    if verbose:
        print("    1's-complement sum = %04X = %s" % (s, format(s, "016b")))
    return (~s) & 0xFFFF                    # invert every bit of the 16-bit sum


def pseudo_header(src_ip, dst_ip, protocol, length):
    """IPv4 pseudo-header: src IP (32) | dst IP (32) | zero (8) | protocol (8) | UDP/TCP length (16)."""
    return ip_to_bytes(src_ip) + ip_to_bytes(dst_ip) + bytes([0, protocol]) + u16(length)


def udp_segment(src_port, dst_port, payload, src_ip, dst_ip, verbose=False):
    """Build a complete UDP segment with a correct checksum."""
    length = 8 + len(payload)                                     # Length counts header + data
    header0 = u16(src_port) + u16(dst_port) + u16(length) + u16(0)  # checksum = 0 while computing
    ph = pseudo_header(src_ip, dst_ip, 17, length)                # 17 = UDP
    csum = internet_checksum(ph + header0 + payload, verbose)
    if csum == 0:
        csum = 0xFFFF   # RFC 768: a computed 0 is sent as all ones; 0 on the wire means "no checksum"
    return u16(src_port) + u16(dst_port) + u16(length) + u16(csum) + payload, csum


def receiver_check(src_ip, dst_ip, segment):
    """Receiver adds everything INCLUDING the checksum; a clean segment sums to 0xFFFF."""
    ph = pseudo_header(src_ip, dst_ip, 17, len(segment))
    s = 0
    for w in words16(ph + segment):
        s = ones_complement_add(s, w)[0]
    return s


def main():
    print("1) Kurose & Ross three-word example")
    kr = u16(0b0110011001100000) + u16(0b0101010101010101) + u16(0b1000111100001100)
    c = internet_checksum(kr, verbose=True)
    print("    checksum = %04X = %s" % (c, format(c, "016b")))
    assert c == 0xB53D

    print("\n2) UDP over IPv4: 192.168.1.10:50000 -> 192.168.1.20:53, data b'Hi!'")
    seg, csum = udp_segment(50000, 53, b"Hi!", "192.168.1.10", "192.168.1.20", verbose=True)
    print("    checksum = ~sum = %04X" % csum)
    print("    segment on the wire: %s" % seg.hex(" "))
    assert csum == 0x4F7A
    assert seg.hex() == "c3500035000b4f7a486921"
    total = receiver_check("192.168.1.10", "192.168.1.20", seg)
    print("    receiver sum incl. checksum = %04X (all ones -> accept)" % total)
    assert total == 0xFFFF

    print("\n3) Flip one bit of the data in transit")
    bad = seg[:-1] + bytes([seg[-1] ^ 0x01])          # '!' (0x21) becomes ' ' (0x20)
    total_bad = receiver_check("192.168.1.10", "192.168.1.20", bad)
    print("    receiver sum = %04X (not FFFF -> discard)" % total_bad)
    assert total_bad != 0xFFFF

    print("\n4) Same segment delivered to the WRONG host (dst 192.168.1.21): pseudo-header catches it")
    total_wrong = receiver_check("192.168.1.10", "192.168.1.21", seg)
    print("    receiver sum = %04X (not FFFF -> discard)" % total_wrong)
    assert total_wrong != 0xFFFF

    print("\n5) A weakness: swapping two 16-bit words is NOT detected")
    w = words16(b"ABCD")
    swapped = u16(w[1]) + u16(w[0])
    assert internet_checksum(b"ABCD") == internet_checksum(swapped)
    print("    checksum(ABCD) = checksum(CDAB) = %04X" % internet_checksum(b"ABCD"))

    print("\n6) TCP uses the same algorithm with protocol 6 (SYN-ACK 142.250.183.4:443 -> 192.168.1.10:51514)")
    tcp_hdr = bytes.fromhex("01bbc93a0000015e00000065" + "5012ffff" + "0000" + "0000")   # checksum zeroed
    ph = ip_to_bytes("142.250.183.4") + ip_to_bytes("192.168.1.10") + bytes([0, 6]) + u16(len(tcp_hdr))
    tc = internet_checksum(ph + tcp_hdr)
    print("    TCP checksum = %04X" % tc)
    assert tc == 0xDB68
    print("\nAll checksum assertions passed.")


if __name__ == "__main__":
    main()
