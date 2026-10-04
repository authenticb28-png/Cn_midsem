"""Unit 13 - IPv4 fragmentation calculator (low level, hand-written algorithm).

COVERAGE row: 13.11 (fragmentation: offset in 8-byte units, MF flag, total length).

Worked example on the site: a 4000-byte datagram (20-byte header + 3980 data bytes)
crosses a link with MTU 1500, then one with MTU 620.

Rules (RFC 791):
  * every fragment except the last carries a multiple of 8 data bytes;
  * fragment offset = (byte position of the first data byte) / 8;
  * MF = 1 on every fragment except the one that ends the ORIGINAL datagram;
  * each fragment gets its own 20-byte header (no options assumed).

Run:  python3 Unit13_fragmentation.py
"""

HDR = 20


def fragment(data_len, mtu, start_offset_bytes=0, last_mf=0):
    """Split `data_len` data bytes that start at byte `start_offset_bytes` of the original.

    last_mf is the MF bit of the piece being split: when a router re-fragments a
    fragment that itself had MF=1, even its last piece keeps MF=1.
    Returns a list of dicts: total, data, offset (8-byte units), mf.
    """
    max_data = (mtu - HDR) // 8 * 8          # round DOWN to a multiple of 8
    frags = []
    pos = 0
    while pos < data_len:
        size = min(max_data, data_len - pos)
        is_last = pos + size == data_len
        frags.append({
            "total": size + HDR,
            "data": size,
            "offset": (start_offset_bytes + pos) // 8,
            "mf": last_mf if is_last else 1,
        })
        pos += size
    return frags


def show(title, frags):
    print(title)
    print("  %-4s %-6s %-6s %-7s %s" % ("#", "total", "data", "offset", "MF"))
    for i, f in enumerate(frags, 1):
        print("  %-4d %-6d %-6d %-7d %d" % (i, f["total"], f["data"], f["offset"], f["mf"]))


if __name__ == "__main__":
    stage1 = fragment(3980, 1500)
    show("Stage 1: 4000-byte datagram over MTU 1500", stage1)
    assert [(f["total"], f["data"], f["offset"], f["mf"]) for f in stage1] == [
        (1500, 1480, 0, 1), (1500, 1480, 185, 1), (1040, 1020, 370, 0)]

    stage2 = []
    for f in stage1:
        stage2 += fragment(f["data"], 620, start_offset_bytes=f["offset"] * 8, last_mf=f["mf"])
    show("\nStage 2: every stage-1 fragment over MTU 620", stage2)
    assert [(f["total"], f["data"], f["offset"], f["mf"]) for f in stage2] == [
        (620, 600, 0, 1), (620, 600, 75, 1), (300, 280, 150, 1),
        (620, 600, 185, 1), (620, 600, 260, 1), (300, 280, 335, 1),
        (620, 600, 370, 1), (440, 420, 445, 0)]
    assert sum(f["data"] for f in stage2) == 3980
    # bytes on the wire after stage 2 = data + one 20-byte header per fragment
    assert sum(f["total"] for f in stage2) == 3980 + 8 * 20 == 4140
    # last byte check: offset*8 + data - 1 of the final fragment is byte 3979
    last = stage2[-1]
    assert last["offset"] * 8 + last["data"] - 1 == 3979
    print("\nAll fragmentation asserts passed.")
