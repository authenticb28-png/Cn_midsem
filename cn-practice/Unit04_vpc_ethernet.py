"""Unit 04 (high level, standard library): AWS VPC / subnet inspection with `ipaddress`,
and packing / unpacking an Ethernet II frame with `struct` (FCS with zlib.crc32).

COVERAGE ids: 04.8 (VPC 10.0.0.0/16 = 65,536 addresses; default VPC 172.31.0.0/16),
              04.11 (Ethernet II frame layout)
Sources: WB-L04 p33; AWS VPC User Guide ("Subnet CIDR blocks": 5 reserved addresses per
subnet; "Default VPCs": 172.31.0.0/16 with a /20 default subnet per AZ);
IEEE 802.3 / Kurose & Ross 8e section 6.4.2 (Ethernet frame).

Run:  python3 Unit04_vpc_ethernet.py
"""
import ipaddress
import struct
import zlib


# ====================================================================== VPC part
def aws_usable(subnet):
    """AWS reserves 5 addresses in every subnet: network, +1 VPC router, +2 DNS,
    +3 reserved for future use, and the last (broadcast) address."""
    return subnet.num_addresses - 5


def aws_reserved(subnet):
    first = subnet.network_address
    return [str(first), str(first + 1), str(first + 2), str(first + 3), str(subnet.broadcast_address)]


def vpc_demo():
    print("== VPC 10.0.0.0/16 (WB-L04 p33) ==")
    vpc = ipaddress.ip_network("10.0.0.0/16")
    print("  addresses = 2^(32-16) =", vpc.num_addresses, "  private (RFC 1918)?", vpc.is_private)
    assert vpc.num_addresses == 65536 == 2 ** (32 - 16) and vpc.is_private

    azs = ["us-west-2a", "us-west-2b", "us-west-2c", "us-west-2d"]
    subnets = list(vpc.subnets(new_prefix=24))
    print("  a /16 holds", len(subnets), "subnets of /24; first four, one per AZ:")
    for az, sn in zip(azs, subnets[:4]):
        print("    %-11s %-14s total %d, generic usable %d, AWS usable %d, AWS reserved %s" %
              (az, sn, sn.num_addresses, sn.num_addresses - 2, aws_usable(sn), aws_reserved(sn)))
    assert len(subnets) == 256 and aws_usable(subnets[0]) == 251
    assert aws_reserved(subnets[1]) == ["10.0.1.0", "10.0.1.1", "10.0.1.2", "10.0.1.3", "10.0.1.255"]

    host = ipaddress.ip_address("10.0.2.77")
    owner = [str(sn) for sn in subnets[:4] if host in sn]
    print("  10.0.2.77 lives in", owner[0])
    assert owner == ["10.0.2.0/24"]

    print("\n== Default VPC 172.31.0.0/16: one /20 default subnet per AZ ==")
    dvpc = ipaddress.ip_network("172.31.0.0/16")
    dsubs = list(dvpc.subnets(new_prefix=20))[:4]
    for i, sn in enumerate(dsubs, start=1):      # AWS picks which AZ gets which /20
        print("    default subnet %d: %-16s %d addresses, %d usable in AWS" % (i, sn, sn.num_addresses, aws_usable(sn)))
    assert [str(s) for s in dsubs] == ["172.31.0.0/20", "172.31.16.0/20", "172.31.32.0/20", "172.31.48.0/20"]
    assert aws_usable(dsubs[0]) == 4091

    custom = ipaddress.ip_network("10.0.0.0/17")        # what the p33 screenshot appears to show
    print("  a /17 (the custom VPC in the screenshot) would hold", custom.num_addresses, "addresses")
    print("  overlaps with 10.0.0.0/16?", custom.overlaps(vpc), " -> VPC peering needs NON-overlapping CIDRs")
    assert custom.num_addresses == 32768 and custom.overlaps(vpc)
    for p in (16, 28):
        print("  AWS VPC size limit /%d -> %d addresses" % (p, 2 ** (32 - p)))


# ====================================================================== Ethernet part
ETHERTYPES = {0x0800: "IPv4", 0x0806: "ARP", 0x86DD: "IPv6"}
HDR = struct.Struct("!6s6sH")          # dest MAC (6), source MAC (6), EtherType (2): network byte order


def mac_bytes(text):
    return bytes.fromhex(text.replace(":", ""))


def mac_text(b):
    return ":".join("%02x" % x for x in b)


def build_frame(dst, src, ethertype, payload):
    """Header + payload padded to 46 bytes + 4-byte FCS. (Preamble and SFD are added by the NIC.)"""
    if len(payload) < 46:
        payload = payload + bytes(46 - len(payload))     # pad with zeros up to the 46-byte minimum
    assert len(payload) <= 1500, "payload above 1500 bytes needs jumbo frames"
    body = HDR.pack(mac_bytes(dst), mac_bytes(src), ethertype) + payload
    fcs = struct.pack("<I", zlib.crc32(body))           # CRC-32, sent least-significant byte first
    return body + fcs


def parse_frame(frame):
    dst, src, etype = HDR.unpack_from(frame, 0)
    payload, fcs = frame[14:-4], frame[-4:]
    ok = struct.pack("<I", zlib.crc32(frame[:-4])) == fcs
    return mac_text(dst), mac_text(src), etype, payload, ok


def ethernet_demo():
    print("\n== Ethernet II frame with struct ==")
    frame = build_frame("ff:ff:ff:ff:ff:ff", "02:00:5e:10:00:01", 0x0806, bytes(28))  # ARP body = 28 bytes (zeros here)
    print("  header bytes :", frame[:14].hex(" "))
    print("  frame length : %d bytes (14 header + 46 padded payload + 4 FCS)" % len(frame))
    assert len(frame) == 64                              # the Ethernet minimum frame size
    dst, src, etype, payload, ok = parse_frame(frame)
    print("  parsed       : dst %s  src %s  type 0x%04X (%s)  FCS ok: %s" % (dst, src, etype, ETHERTYPES[etype], ok))
    assert (dst, etype, ok) == ("ff:ff:ff:ff:ff:ff", 0x0806, True)
    assert zlib.crc32(frame) == 0x2144DF1C               # CRC-32 residue: a whole good frame always gives this
    bad = bytearray(frame)
    bad[20] ^= 0x01                                      # flip one payload bit
    print("  one flipped bit -> FCS ok:", parse_frame(bytes(bad))[4])
    assert parse_frame(bytes(bad))[4] is False
    big = build_frame("00:11:22:33:44:55", "66:77:88:99:aa:bb", 0x0800, bytes(1500))
    print("  maximum frame: %d bytes; on the wire with 8-byte preamble+SFD: %d bytes" % (len(big), len(big) + 8))
    assert len(big) == 1518
    print("  payload efficiency at 1500 B (with preamble, SFD and 12-byte gap): %.2f %%" % (1500 / (1518 + 8 + 12) * 100))


if __name__ == "__main__":
    vpc_demo()
    ethernet_demo()
    print("\nAll Unit 04 VPC/Ethernet checks passed.")
