"""Mock Exam 1, Question C3: model solution for a 1's-complement checksum verifier.

Topic: Internet-style checksum (SL-L10 p8-10 8-bit class example; RFC 1071 16-bit form,
used by the IPv4 header, UDP and TCP).  COVERAGE ids: 10.2, 10.11, 09.12.
Run:   python3 Mock1_C3_checksum.py      (offline, no arguments, exits 0 when every assert holds)

The sender adds all words with end-around carry and sends the 1's complement of the sum.
The receiver adds every word INCLUDING the checksum; the result must be all 1s.
"""
import struct


def ones_sum(words, bits=16):
    """1's-complement sum of integer words of width `bits` (end-around carry)."""
    mask = (1 << bits) - 1          # 0xFF for 8-bit words, 0xFFFF for 16-bit words
    total = 0
    for w in words:
        if not 0 <= w <= mask:
            raise ValueError("word %r does not fit in %d bits" % (w, bits))
        total += w
        total = (total & mask) + (total >> bits)   # wrap any carry back into the low bits
    return total


def make_checksum(words, bits=16):
    """Checksum the sender places in the header: the bitwise NOT of the 1's-complement sum."""
    mask = (1 << bits) - 1
    return (~ones_sum(words, bits)) & mask


def verify_checksum(words, checksum, bits=16):
    """Receiver check: sum of data words plus the checksum must be all 1s."""
    mask = (1 << bits) - 1
    return ones_sum(list(words) + [checksum], bits) == mask


def words_from_bytes(data):
    """Split bytes into big-endian 16-bit words, padding an odd length with one zero byte."""
    if len(data) % 2:
        data = data + b"\x00"
    return list(struct.unpack("!%dH" % (len(data) // 2), data))


def verify_bytes(data):
    """True when a byte string whose checksum field is already filled in verifies (sum == 0xFFFF)."""
    return ones_sum(words_from_bytes(data), 16) == 0xFFFF


if __name__ == "__main__":
    # 1. Class example (SL-L10 p8-10, corrected as in UNCLEAR.md B1): 8-bit words.
    a, b = 0b10010011, 0b01010110
    s = ones_sum([a, b], 8)
    print("8-bit sum      =", format(s, "08b"))           # 147 + 86 = 233, no carry
    c = make_checksum([a, b], 8)
    print("8-bit checksum =", format(c, "08b"))
    assert s == 0b11101001
    assert c == 0b00010110                                  # the slide's 11110101 is wrong
    assert verify_checksum([a, b], c, 8)
    assert not verify_checksum([a, b], 0b11110101, 8)     # the slide's value fails the receiver check
    print("receiver check with 00010110 ->", verify_checksum([a, b], c, 8))

    # 2. Kurose & Ross three 16-bit words (a carry does occur here).
    w = [0b0110011001100000, 0b0101010101010101, 0b1000111100001100]
    assert ones_sum(w) == 0b0100101011000010
    assert make_checksum(w) == 0b1011010100111101
    assert verify_checksum(w, 0b1011010100111101)
    print("Kurose 16-bit checksum =", format(make_checksum(w), "016b"))

    # 3. A real IPv4 header (checksum field 0xB861 already filled in).
    hdr = bytes.fromhex("450000730000400040110000c0a80001c0a800c7")
    ck = make_checksum(words_from_bytes(hdr))
    print("IPv4 header checksum   = 0x%04X" % ck)
    assert ck == 0xB861
    filled = hdr[:10] + struct.pack("!H", ck) + hdr[12:]
    assert verify_bytes(filled)

    # 4. A single flipped bit is detected.
    corrupted = bytearray(filled)
    corrupted[19] ^= 0x01                                  # flip the lowest bit of the destination IP
    assert not verify_bytes(bytes(corrupted))
    print("one-bit error detected ->", not verify_bytes(bytes(corrupted)))

    # 5. Odd-length payloads are padded with a zero byte before summing.
    assert words_from_bytes(b"\x01\x02\x03") == [0x0102, 0x0300]
    print("all checksum asserts passed")
