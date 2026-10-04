"""Unit 04 extra (low level, from scratch): framing with byte stuffing and bit stuffing.

COVERAGE id: 04.10 (Extra, GATE syllabus)
References: Tanenbaum & Wetherall "Computer Networks" 5e section 3.1.2 (flag bytes with byte
stuffing, Fig 3-4; flag bits with bit stuffing, Fig 3-5) and section 3.5.1 (PPP escaping).

Run:  python3 Unit04_stuffing.py
"""
FLAG = 0x7E      # 01111110: marks the start and the end of every frame
ESC = 0x7D       # 01111101: "the next byte is data, not a control byte"


# ---------------------------------------------------------------- byte stuffing (Tanenbaum)
def byte_stuff(payload):
    """Put ESC in front of every FLAG or ESC byte in the data, then wrap in FLAGs."""
    out = [FLAG]
    for b in payload:
        if b in (FLAG, ESC):
            out.append(ESC)          # escape it so the receiver does not see a frame boundary
        out.append(b)
    out.append(FLAG)
    return bytes(out)


def byte_unstuff(frame):
    assert frame[0] == FLAG and frame[-1] == FLAG, "frame must start and end with FLAG"
    out, i, body = [], 0, frame[1:-1]
    while i < len(body):
        if body[i] == ESC:
            i += 1                   # drop the ESC and keep the next byte literally
        out.append(body[i])
        i += 1
    return bytes(out)


# ---------------------------------------------------------------- PPP-style escaping
def ppp_stuff(payload):
    """PPP variant: ESC followed by the byte XOR 0x20, so 7E -> 7D 5E and 7D -> 7D 5D."""
    out = [FLAG]
    for b in payload:
        if b in (FLAG, ESC):
            out += [ESC, b ^ 0x20]
        else:
            out.append(b)
    out.append(FLAG)
    return bytes(out)


def ppp_unstuff(frame):
    out, i, body = [], 0, frame[1:-1]
    while i < len(body):
        if body[i] == ESC:
            i += 1
            out.append(body[i] ^ 0x20)
        else:
            out.append(body[i])
        i += 1
    return bytes(out)


# ---------------------------------------------------------------- bit stuffing (HDLC)
def bit_stuff(bits):
    """After every run of five consecutive 1s in the data, insert a 0."""
    out, run = [], 0
    for b in bits:
        out.append(b)
        run = run + 1 if b == "1" else 0
        if run == 5:
            out.append("0")          # stuffed bit: data can never contain 01111110
            run = 0
    return "".join(out)


def bit_unstuff(bits):
    """After five consecutive 1s, the next bit is a stuffed 0: delete it."""
    out, run, i = [], 0, 0
    while i < len(bits):
        b = bits[i]
        out.append(b)
        run = run + 1 if b == "1" else 0
        if run == 5:
            assert bits[i + 1] == "0", "six 1s in a row inside a frame = flag or error"
            i += 1                   # skip the stuffed 0
            run = 0
        i += 1
    return "".join(out)


def hexs(bs):
    return " ".join("%02X" % b for b in bs)


def main():
    print("== Byte stuffing (FLAG = 7E, ESC = 7D) ==")
    data = bytes([0x41, 0x7E, 0x42, 0x7D, 0x43])           # A FLAG B ESC C
    fr = byte_stuff(data)
    print("  data   :", hexs(data))
    print("  framed :", hexs(fr), " (%d bytes on the wire for %d data bytes)" % (len(fr), len(data)))
    assert fr == bytes([0x7E, 0x41, 0x7D, 0x7E, 0x42, 0x7D, 0x7D, 0x43, 0x7E])
    assert byte_unstuff(fr) == data
    p = ppp_stuff(data)
    print("  PPP    :", hexs(p))
    assert p == bytes([0x7E, 0x41, 0x7D, 0x5E, 0x42, 0x7D, 0x5D, 0x43, 0x7E])
    assert ppp_unstuff(p) == data
    worst = byte_stuff(bytes([0x7E] * 10))
    print("  worst case, 10 FLAG bytes -> %d bytes (2n + 2)" % len(worst))
    assert len(worst) == 22

    print("\n== Bit stuffing (flag 01111110, stuff a 0 after five 1s) ==")
    raw = "0110111111111111111110010"                       # Tanenbaum Fig 3-5 (a)
    st = bit_stuff(raw)
    print("  data    :", raw, "(%d bits)" % len(raw))
    print("  stuffed :", st, "(%d bits, %d stuffed)" % (len(st), len(st) - len(raw)))
    assert st == "011011111011111011111010010"               # Tanenbaum Fig 3-5 (b)
    assert bit_unstuff(st) == raw
    frame = "01111110" + st + "01111110"
    print("  frame   :", frame)
    for d, e in (("11111", "111110"), ("0111110", "01111100"), ("111111111111", "11111011111011")):
        print("  %-14s -> %s" % (d, bit_stuff(d)))
        assert bit_stuff(d) == e and bit_unstuff(e) == d
    assert "111111" not in st                               # the flag pattern cannot appear in data
    print("\nAll Unit 04 stuffing checks passed.")


if __name__ == "__main__":
    main()
