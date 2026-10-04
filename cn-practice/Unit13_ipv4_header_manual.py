"""Unit 13 - IPv4 header builder / parser with a hand-written Internet checksum (low level).

COVERAGE row: 13.11 (IPv4 header, 14 fields; header checksum).

Everything is done with shifts and masks on bytes: no struct, no socket.
The worked example is the header used on the site:
    45 00 00 73 00 00 40 00 40 11 [b8 61] c0 a8 00 01 c0 a8 00 c7
which is a UDP datagram (protocol 17) from 192.168.0.1 to 192.168.0.199.

Run:  python3 Unit13_ipv4_header_manual.py
"""


def ip_to_bytes(s):
    return bytes(int(p) for p in s.split("."))


def bytes_to_ip(b):
    return ".".join(str(x) for x in b)


def ones_complement_sum(data, verbose=False):
    """16-bit one's-complement sum with end-around carry (RFC 1071)."""
    if len(data) % 2:
        data += b"\x00"                       # pad an odd byte with zero
    total = 0
    for i in range(0, len(data), 2):
        word = (data[i] << 8) | data[i + 1]   # big-endian 16-bit word
        raw = total + word
        carry = raw >> 16                     # bit 16 overflowed?
        new = (raw & 0xFFFF) + carry          # wrap the carry back into bit 0
        if verbose:
            print("  0x%04X + 0x%04X = 0x%05X  carry %d  -> 0x%04X" % (total, word, raw, carry, new))
        total = new
    return total


def checksum(header):
    return ~ones_complement_sum(header) & 0xFFFF


def build_header(src, dst, payload_len, ident=0, df=1, mf=0, frag_offset=0,
                 ttl=64, proto=17, dscp=0, ecn=0):
    """Build a 20-byte IPv4 header byte by byte and fill in the checksum."""
    version, ihl = 4, 5                          # IHL counts 32-bit words: 5 * 4 = 20 bytes
    total_len = ihl * 4 + payload_len
    flags = (0 << 2) | (df << 1) | mf            # bit0 reserved(0), DF, MF
    flags_frag = (flags << 13) | frag_offset     # 3 flag bits + 13 offset bits = 16 bits
    h = bytearray(20)
    h[0] = (version << 4) | ihl
    h[1] = (dscp << 2) | ecn
    h[2], h[3] = total_len >> 8, total_len & 0xFF
    h[4], h[5] = ident >> 8, ident & 0xFF
    h[6], h[7] = flags_frag >> 8, flags_frag & 0xFF
    h[8] = ttl
    h[9] = proto
    h[10], h[11] = 0, 0                          # checksum field is ZERO while computing
    h[12:16] = ip_to_bytes(src)
    h[16:20] = ip_to_bytes(dst)
    c = checksum(bytes(h))
    h[10], h[11] = c >> 8, c & 0xFF
    return bytes(h)


def parse_header(h):
    ff = (h[6] << 8) | h[7]
    return {
        "version": h[0] >> 4,
        "ihl": h[0] & 0x0F,
        "dscp": h[1] >> 2,
        "ecn": h[1] & 0x03,
        "total_length": (h[2] << 8) | h[3],
        "identification": (h[4] << 8) | h[5],
        "flags": ff >> 13,
        "DF": (ff >> 14) & 1,
        "MF": (ff >> 13) & 1,
        "fragment_offset": ff & 0x1FFF,
        "ttl": h[8],
        "protocol": h[9],
        "checksum": (h[10] << 8) | h[11],
        "src": bytes_to_ip(h[12:16]),
        "dst": bytes_to_ip(h[16:20]),
    }


if __name__ == "__main__":
    example = bytes.fromhex("450000730000400040110000c0a80001c0a800c7")   # checksum zeroed
    print("Sender side: add the ten 16-bit words (checksum field = 0000)")
    s = ones_complement_sum(example, verbose=True)
    c = ~s & 0xFFFF
    print("sum = 0x%04X, checksum = ~sum = 0x%04X" % (s, c))
    assert s == 0x479E and c == 0xB861

    full = example[:10] + bytes([c >> 8, c & 0xFF]) + example[12:]
    print("\nReceiver side: add all ten words INCLUDING the checksum")
    r = ones_complement_sum(full, verbose=True)
    print("sum = 0x%04X (all ones means no error detected)" % r)
    assert r == 0xFFFF

    built = build_header("192.168.0.1", "192.168.0.199", payload_len=95, ident=0, df=1, ttl=64, proto=17)
    print("\nbuilt header:", built.hex(" "))
    assert built == full
    p = parse_header(built)
    for k, v in p.items():
        print("  %-16s %s" % (k, v))
    assert p["version"] == 4 and p["ihl"] == 5 and p["total_length"] == 115
    assert p["DF"] == 1 and p["MF"] == 0 and p["ttl"] == 64 and p["protocol"] == 17
    assert p["checksum"] == 0xB861 and p["dst"] == "192.168.0.199"

    # TTL decrement: a router must recompute the checksum
    hop = bytearray(built)
    hop[8] -= 1
    hop[10] = hop[11] = 0
    nc = checksum(bytes(hop))
    print("\nafter one router hop: TTL 63, new checksum 0x%04X" % nc)
    assert nc == 0xB961      # TTL is the high byte of word 0x4011, so -0x0100 in the sum adds +0x0100 to the checksum
    print("\nAll IPv4 header asserts passed.")
