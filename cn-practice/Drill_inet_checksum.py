"""Drill model solution - 16-bit Internet checksum (RFC 1071), written from scratch.

COVERAGE rows: 10.2 (one's-complement checksum, end-around carry), 10.11 (16-bit Internet
checksum), 13.11 (IPv4 header checksum).

Socket & Scripting Drill question d-sock-30.
Run:  python3 Drill_inet_checksum.py      (offline, standard library only, exits 0)
"""
import struct


def inet_checksum(data: bytes) -> int:
    """Return the 16-bit one's-complement checksum of `data`."""
    if len(data) % 2:                       # odd length: pad with one zero byte (RFC 1071)
        data += b"\x00"
    total = 0
    for i in range(0, len(data), 2):
        word = (data[i] << 8) | data[i + 1]  # big-endian (network order) 16-bit word
        total += word
        total = (total & 0xFFFF) + (total >> 16)  # end-around carry: fold bit 16 back into bit 0
    return ~total & 0xFFFF                   # one's complement, kept to 16 bits


def checksum_via_struct(data: bytes) -> int:
    """Same algorithm, but let struct split the bytes into big-endian words."""
    if len(data) % 2:
        data += b"\x00"
    words = struct.unpack("!%dH" % (len(data) // 2), data)
    total = sum(words)
    while total >> 16:                       # fold until no carry is left
        total = (total & 0xFFFF) + (total >> 16)
    return ~total & 0xFFFF


def main():
    # 1. IPv4 header from a real capture, with the checksum field (bytes 10-11) set to 00 00
    zeroed = bytes.fromhex("4500003c1c4640004006" + "0000" + "ac100a63ac100a0c")
    c = inet_checksum(zeroed)
    print("IPv4 header with checksum field zeroed -> checksum = 0x%04x" % c)
    assert c == 0xB1E6
    assert checksum_via_struct(zeroed) == 0xB1E6

    # 2. Receiver side: sum over the header INCLUDING the checksum must give 0xFFFF, complement 0
    filled = zeroed[:10] + struct.pack("!H", c) + zeroed[12:]
    print("Header with checksum inserted        -> verify = %d (0 means no error detected)" % inet_checksum(filled))
    assert inet_checksum(filled) == 0

    # 3. A single flipped bit is detected
    corrupted = bytearray(filled)
    corrupted[8] ^= 0x01                     # flip the low bit of the TTL byte
    assert inet_checksum(bytes(corrupted)) != 0
    print("Header with one flipped bit          -> verify = 0x%04x (non-zero: error detected)" % inet_checksum(bytes(corrupted)))

    # 4. Kurose & Ross example: three 16-bit words
    words = [0b0110011001100000, 0b0101010101010101, 0b1000111100001100]
    kurose = struct.pack("!3H", *words)
    k = inet_checksum(kurose)
    print("Kurose three-word example            -> checksum = %s (0x%04x)" % (format(k, "016b"), k))
    assert k == 0xB53D

    # 5. Odd-length input is padded with a zero byte
    assert inet_checksum(b"\x01") == inet_checksum(b"\x01\x00") == 0xFEFF
    print("Odd-length b'\\x01' padded to 0100     -> checksum = 0x%04x" % inet_checksum(b"\x01"))
    print("All checksum assertions passed.")


if __name__ == "__main__":
    main()
