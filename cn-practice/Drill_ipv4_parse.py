"""Drill model solution - build and parse a 20-byte IPv4 header with struct.

COVERAGE rows: 13.11 (IPv4 header: all fields, IHL x 4, flags DF/MF, fragment offset,
TTL, protocol, header checksum), 10.11 (16-bit Internet checksum).

Raw sockets need root, so this script only builds and parses bytes; it never sends them.

Socket & Scripting Drill question d-sock-33.
Run:  python3 Drill_ipv4_parse.py      (offline, standard library only, exits 0)
"""
import socket
import struct

IPV4_FMT = "!BBHHHBBH4s4s"          # 1+1+2+2+2+1+1+2+4+4 = 20 bytes, network byte order
PROTO_NAMES = {1: "ICMP", 6: "TCP", 17: "UDP"}


def inet_checksum(data: bytes) -> int:
    """16-bit one's-complement checksum (RFC 1071)."""
    if len(data) % 2:
        data += b"\x00"
    total = 0
    for i in range(0, len(data), 2):
        total += (data[i] << 8) | data[i + 1]
        total = (total & 0xFFFF) + (total >> 16)  # end-around carry
    return ~total & 0xFFFF


def build_ipv4(src: str, dst: str, proto: int, payload_len: int, ttl: int = 64, ident: int = 0, df: bool = True) -> bytes:
    ver_ihl = (4 << 4) | 5                  # version 4, IHL 5 words = 20 bytes (no options)
    tos = 0                                 # DSCP 0, ECN 0
    total_length = 20 + payload_len         # header + data, in bytes
    flags_frag = (int(df) << 14)            # reserved=0, DF=bit 14, MF=bit 13, offset=0
    header = struct.pack(IPV4_FMT, ver_ihl, tos, total_length, ident, flags_frag, ttl, proto, 0,
                         socket.inet_aton(src), socket.inet_aton(dst))
    csum = inet_checksum(header)            # computed with the checksum field set to 0
    return header[:10] + struct.pack("!H", csum) + header[12:]


def parse_ipv4(raw: bytes) -> dict:
    (ver_ihl, tos, total_length, ident, flags_frag, ttl, proto, csum, src, dst) = struct.unpack(IPV4_FMT, raw[:20])
    ihl_bytes = (ver_ihl & 0x0F) * 4
    return {
        "version": ver_ihl >> 4,
        "ihl_bytes": ihl_bytes,
        "dscp": tos >> 2,
        "ecn": tos & 0x03,
        "total_length": total_length,
        "id": ident,
        "df": (flags_frag >> 14) & 1,
        "mf": (flags_frag >> 13) & 1,
        "offset_units": flags_frag & 0x1FFF,   # low 13 bits, in 8-byte units
        "ttl": ttl,
        "protocol": PROTO_NAMES.get(proto, str(proto)),
        "checksum": csum,
        "src": socket.inet_ntoa(src),
        "dst": socket.inet_ntoa(dst),
        "checksum_ok": inet_checksum(raw[:ihl_bytes]) == 0,
    }


def main():
    # 1. Decode the capture used throughout the drills
    capture = bytes.fromhex("45 00 00 3c 1c 46 40 00 40 06 b1 e6 ac 10 0a 63 ac 10 0a 0c".replace(" ", ""))
    info = parse_ipv4(capture)
    for key, value in info.items():
        print("  %-13s %s" % (key, hex(value) if key == "checksum" else value))
    assert info["version"] == 4 and info["ihl_bytes"] == 20 and info["total_length"] == 60
    assert info["ttl"] == 64 and info["protocol"] == "TCP"
    assert info["src"] == "172.16.10.99" and info["dst"] == "172.16.10.12"
    assert info["df"] == 1 and info["mf"] == 0 and info["offset_units"] == 0
    assert info["checksum"] == 0xB1E6 and info["checksum_ok"]

    # 2. Round trip: build a UDP datagram header, parse it back
    built = build_ipv4("10.0.1.55", "8.8.8.8", 17, payload_len=8 + 32, ttl=128, ident=0x1234)
    assert len(built) == 20
    back = parse_ipv4(built)
    print("built header:", built.hex(" "))
    assert back["protocol"] == "UDP" and back["total_length"] == 60 and back["ttl"] == 128
    assert back["src"] == "10.0.1.55" and back["dst"] == "8.8.8.8" and back["id"] == 0x1234
    assert back["checksum_ok"]

    # 3. Rebuilding the capture's fields reproduces the captured bytes exactly
    rebuilt = build_ipv4("172.16.10.99", "172.16.10.12", 6, payload_len=40, ttl=64, ident=0x1C46)
    assert rebuilt == capture, rebuilt.hex()

    # 4. A router decrements TTL: the old checksum no longer verifies until it is recomputed
    hop = bytearray(capture)
    hop[8] -= 1
    assert not parse_ipv4(bytes(hop))["checksum_ok"]
    print("IPv4 build/parse assertions passed.")


if __name__ == "__main__":
    main()
