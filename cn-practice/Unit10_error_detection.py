"""Unit 10 - Error detection from scratch (low level: integers and bit operations only).

Topics and COVERAGE rows
  10.2  8-bit ones'-complement checksum of SL-L10 p8-10, CORRECTED:
        10010011 + 01010110 = 11101001 (147 + 86 = 233, no carry), checksum 00010110.
  10.11 16-bit Internet checksum with end-around carry (RFC 1071 style, Kurose 3.3.2),
        2-D even parity (detect and correct one bit), CRC by modulo-2 long division,
        Hamming (7,4) with parity bits at positions 1, 2 and 4.

Run:   python3 Unit10_error_detection.py
Every textbook answer used on the site is checked with assert, so a clean run is a self-test.
"""


# ---------------------------------------------------------------- ones'-complement checksum
def ones_complement_sum(words, bits, verbose=False):
    """Add `bits`-wide words; every carry out of the top bit is wrapped back into bit 0."""
    mask = (1 << bits) - 1          # 0xFF for 8 bits, 0xFFFF for 16 bits
    total = 0
    for w in words:
        raw = total + w             # ordinary binary addition, may produce bits+1 bits
        carry = raw >> bits         # the bit that fell off the top (0 or 1)
        total = (raw & mask) + carry    # end-around carry: add it back at the bottom
        if verbose:
            print("    + %s -> raw %s  carry=%d  -> %s" % (
                format(w, "0%db" % bits), format(raw, "0%db" % (bits + 1)), carry,
                format(total, "0%db" % bits)))
    return total


def checksum(words, bits):
    """Checksum = ones' complement (bit flip) of the ones'-complement sum."""
    mask = (1 << bits) - 1
    return ~ones_complement_sum(words, bits) & mask


def receiver_ok(words, csum, bits):
    """Receiver adds the data words AND the checksum; all ones means no error detected."""
    mask = (1 << bits) - 1
    return ones_complement_sum(list(words) + [csum], bits) == mask


def demo_checksum8():
    print("=== 10.2  8-bit checksum, SL-L10 p8-10 (corrected) ===")
    c1, c2 = 0b10010011, 0b01010110          # 147 and 86
    print("  chunk 1 = %s (%d), chunk 2 = %s (%d)" % (format(c1, "08b"), c1, format(c2, "08b"), c2))
    s = ones_complement_sum([c1, c2], 8, verbose=True)
    print("  sum      = %s (%d)  -> 147 + 86 = 233 fits in 8 bits, so there is NO carry" % (format(s, "08b"), s))
    cs = checksum([c1, c2], 8)
    print("  checksum = flip every bit of the sum = %s (%d)" % (format(cs, "08b"), cs))
    print("  receiver: sum + checksum = %s" % format(s + cs, "08b"))
    assert c1 + c2 == 233 and s == 0b11101001
    assert cs == 0b00010110 == 22
    assert receiver_ok([c1, c2], cs, 8)
    # The slide's number 1 00001001 is 265, which is not 147 + 86:
    assert 0b100001001 == 265 != c1 + c2
    # A case that really has a carry (used in the practice questions): 202 + 182 = 384.
    a, b = 0b11001010, 0b10110110
    s2 = ones_complement_sum([a, b], 8)
    assert a + b == 384 and s2 == 0b10000001 and checksum([a, b], 8) == 0b01111110
    print("  carry case: 11001010 + 10110110 = 1 10000000 -> wrap -> %s, checksum %s"
          % (format(s2, "08b"), format(checksum([a, b], 8), "08b")))
    # One flipped bit is detected:
    bad = c1 ^ 0b00000100
    assert not receiver_ok([bad, c2], cs, 8)
    print("  flip one bit of chunk 1 -> receiver sum is not all ones -> error detected\n")


def demo_checksum16():
    print("=== 10.11  16-bit Internet checksum, three words (Kurose 3.3.2) ===")
    words = [0b0110011001100000, 0b0101010101010101, 0b1000111100001100]   # 0x6660 0x5555 0x8F0C
    s = ones_complement_sum(words, 16, verbose=True)
    cs = checksum(words, 16)
    print("  sum = %s (0x%04X), checksum = %s (0x%04X)" % (format(s, "016b"), s, format(cs, "016b"), cs))
    assert s == 0b0100101011000010 == 0x4AC2
    assert cs == 0b1011010100111101 == 0xB53D
    assert receiver_ok(words, cs, 16)
    # Four hex words used in a practice question: two end-around carries.
    w4 = [0xF0F0, 0x1234, 0xABCD, 0x8001]
    assert ones_complement_sum(w4, 16) == 0x2EF4 and checksum(w4, 16) == 0xD10B
    print("  practice words F0F0 1234 ABCD 8001 -> sum 0x2EF4, checksum 0xD10B")
    # Weakness: swapping two words gives the same sum, so reordering is NOT detected.
    assert checksum([words[1], words[0], words[2]], 16) == cs
    print("  swapping two words leaves the checksum unchanged (a known blind spot)\n")


# ---------------------------------------------------------------- 2-D parity
def parity(bits):
    """Even parity bit: 1 when the row has an odd number of 1s."""
    p = 0
    for b in bits:
        p ^= b
    return p


def parity2d_encode(rows):
    row_par = [parity(r) for r in rows]
    col_par = [parity([r[c] for r in rows]) for c in range(len(rows[0]))]
    corner = parity(row_par)
    return row_par, col_par, corner


def parity2d_locate(rows, row_par, col_par):
    """Return (row, col) of a single flipped data bit (1-based), or None if all parities match."""
    bad_r = [i for i, r in enumerate(rows) if parity(r) != row_par[i]]
    bad_c = [c for c in range(len(rows[0])) if parity([r[c] for r in rows]) != col_par[c]]
    if not bad_r and not bad_c:
        return None
    return bad_r[0] + 1, bad_c[0] + 1


def demo_parity2d():
    print("=== 10.11  2-D even parity: detect and correct one bit ===")
    data = [[1, 0, 1, 1], [0, 1, 1, 0], [1, 1, 0, 1], [0, 1, 1, 1]]
    rp, cp, corner = parity2d_encode(data)
    for r, p in zip(data, rp):
        print("   ", " ".join(map(str, r)), "|", p)
    print("    -------+--")
    print("   ", " ".join(map(str, cp)), "|", corner)
    assert rp == [1, 0, 1, 1] and cp == [0, 1, 1, 1] and corner == 1
    rx = [row[:] for row in data]
    rx[2][1] ^= 1                                   # flip row 3, column 2 in transit
    where = parity2d_locate(rx, rp, cp)
    print("  received with row 3 col 2 flipped -> bad row and bad column cross at", where)
    assert where == (3, 2)
    rx[where[0] - 1][where[1] - 1] ^= 1             # correct it by flipping it back
    assert rx == data
    print("  flipped back -> data corrected\n")


# ---------------------------------------------------------------- CRC (modulo-2 long division)
def xor_bits(a, b):
    return "".join("0" if x == y else "1" for x, y in zip(a, b))


def crc_divide(dividend, gen, verbose=False):
    """Modulo-2 long division of the bit string `dividend` by `gen`.
    Returns (quotient, remainder) as bit strings; the remainder has len(gen) - 1 bits."""
    r = len(gen) - 1
    window = dividend[:len(gen)]                    # first len(gen) bits
    quotient = ""
    pos = len(gen)
    while True:
        if window[0] == "1":
            quotient += "1"
            res = xor_bits(window, gen)             # subtract = XOR, no borrows
            if verbose:
                print("    %s XOR %s = %s   (quotient bit 1)" % (window, gen, res))
        else:
            quotient += "0"
            res = xor_bits(window, "0" * len(gen))  # leading 0: divide by 0000, nothing changes
            if verbose:
                print("    %s XOR %s = %s   (quotient bit 0)" % (window, "0" * len(gen), res))
        if pos == len(dividend):
            return quotient, res[1:]                # drop the leading 0: r remainder bits
        window = res[1:] + dividend[pos]            # drop leading bit, bring down next bit
        pos += 1


def crc_bitwise(data, gen):
    """Same remainder using integer shifts and XOR (how real code does it)."""
    r = len(gen) - 1
    g = int(gen, 2)
    rem = int(data, 2) << r                         # D * 2^r
    for shift in range(len(data) - 1, -1, -1):      # for every data bit, highest first
        if rem & (1 << (shift + r)):                # if the current top bit is 1
            rem ^= g << shift                       # subtract the generator under it
    return format(rem, "0%db" % r)


def demo_crc():
    print("=== 10.11  CRC: D = 101110, G = 1001 (x^3 + 1), r = 3 ===")
    D, G = "101110", "1001"
    r = len(G) - 1
    print("  dividend = D followed by r zeros = %s" % (D + "0" * r))
    q, R = crc_divide(D + "0" * r, G, verbose=True)
    print("  quotient %s, remainder R = %s, codeword = %s" % (q, R, D + R))
    assert q == "101011" and R == "011" and crc_bitwise(D, G) == "011"
    cw = D + R
    assert cw == "101110011"
    _, ok = crc_divide(cw, G)
    print("  receiver divides the codeword: remainder %s -> accept" % ok)
    assert ok == "000"
    bad = cw[:4] + ("0" if cw[4] == "1" else "1") + cw[5:]   # flip the 5th bit (x^4 term)
    _, syn = crc_divide(bad, G, verbose=True)
    print("  received %s (5th bit flipped): remainder %s != 000 -> error detected\n" % (bad, syn))
    assert bad == "101100011" and syn == "010"


# ---------------------------------------------------------------- Hamming (7,4)
def hamming74_encode(d):
    """d = 4 data bits 'd1d2d3d4'. Positions 1..7 = p1 p2 d1 p4 d2 d3 d4 (even parity)."""
    d1, d2, d3, d4 = (int(x) for x in d)
    p1 = d1 ^ d2 ^ d4          # p1 checks positions 1, 3, 5, 7
    p2 = d1 ^ d3 ^ d4          # p2 checks positions 2, 3, 6, 7
    p4 = d2 ^ d3 ^ d4          # p4 checks positions 4, 5, 6, 7
    return "".join(str(b) for b in (p1, p2, d1, p4, d2, d3, d4))


def hamming74_syndrome(cw):
    b = [None] + [int(x) for x in cw]               # 1-based positions
    s1 = b[1] ^ b[3] ^ b[5] ^ b[7]
    s2 = b[2] ^ b[3] ^ b[6] ^ b[7]
    s4 = b[4] ^ b[5] ^ b[6] ^ b[7]
    return s4 * 4 + s2 * 2 + s1                     # binary s4 s2 s1 = error position


def hamming74_decode(cw):
    pos = hamming74_syndrome(cw)
    bits = list(cw)
    if pos:
        bits[pos - 1] = "0" if bits[pos - 1] == "1" else "1"   # flip the bad bit back
    fixed = "".join(bits)
    return fixed, fixed[2] + fixed[4] + fixed[5] + fixed[6], pos


def demo_hamming():
    print("=== 10.11  Hamming (7,4): encode 1011 ===")
    cw = hamming74_encode("1011")
    print("  positions 1..7 = p1 p2 d1 p4 d2 d3 d4 = %s" % cw)
    assert cw == "0110011"
    rx = cw[:5] + ("0" if cw[5] == "1" else "1") + cw[6:]     # flip position 6
    fixed, data, pos = hamming74_decode(rx)
    print("  received %s -> syndrome s4 s2 s1 = %s = %d -> flip bit %d -> %s, data %s"
          % (rx, format(pos, "03b"), pos, pos, fixed, data))
    assert rx == "0110001" and pos == 6 and fixed == cw and data == "1011"
    # every single-bit error in every codeword is corrected
    for n in range(16):
        d = format(n, "04b")
        c = hamming74_encode(d)
        assert hamming74_syndrome(c) == 0
        for i in range(7):
            e = c[:i] + ("0" if c[i] == "1" else "1") + c[i + 1:]
            assert hamming74_decode(e) == (c, d, i + 1)
    print("  all 16 codewords x 7 single-bit errors corrected\n")


if __name__ == "__main__":
    demo_checksum8()
    demo_checksum16()
    demo_parity2d()
    demo_crc()
    demo_hamming()
    print("All Unit 10 error-detection self-tests passed.")
