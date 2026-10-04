#!/usr/bin/env python3
"""Unit 15 - Build a DHCPDISCOVER with struct, parse it back, print every field. Nothing is sent.

COVERAGE: 15.5 (DHCP lease contents, DORA, on-the-wire addresses), 15.15 (UDP 67/68, T1/T2 timers, relay).

Run:  python3 Unit15_dhcp_discover.py
Layout (RFC 2131 section 2, RFC 2132 options):
  op(1) htype(1) hlen(1) hops(1) xid(4) secs(2) flags(2) ciaddr(4) yiaddr(4) siaddr(4) giaddr(4)
  chaddr(16) sname(64) file(128)  = 236 fixed bytes, then magic cookie 0x63825363 (4 bytes), then options.
The client would send it from 0.0.0.0:68 to 255.255.255.255:67 (UDP). We only build bytes.
"""
import struct

BOOTP_FMT = "!BBBBIHHIIII16s64s128s"        # the 236-byte fixed BOOTP header
MAGIC_COOKIE = 0x63825363                    # bytes 99.130.83.99 mark "DHCP options follow"
DHCP_TYPES = {1: "DISCOVER", 2: "OFFER", 3: "REQUEST", 4: "DECLINE", 5: "ACK", 6: "NAK", 7: "RELEASE", 8: "INFORM"}
OPTION_NAMES = {1: "Subnet Mask", 3: "Router", 6: "Domain Name Server", 15: "Domain Name",
                50: "Requested IP", 51: "Lease Time", 53: "DHCP Message Type", 54: "Server Identifier",
                55: "Parameter Request List", 255: "End"}


def mac_bytes(mac):
    return bytes(int(b, 16) for b in mac.split(":"))


def build_discover(mac="00:1a:2b:3c:4d:5e", xid=0x3903F326, broadcast_flag=True, pad_to=300):
    chaddr = mac_bytes(mac) + b"\x00" * 10          # 6-byte MAC padded to the 16-byte chaddr field
    flags = 0x8000 if broadcast_flag else 0x0000     # top bit = BROADCAST flag (RFC 2131 figure 2)
    fixed = struct.pack(BOOTP_FMT,
                        1,          # op 1 = BOOTREQUEST (client to server)
                        1,          # htype 1 = Ethernet
                        6,          # hlen 6 = MAC length in bytes
                        0,          # hops, incremented by relay agents
                        xid,        # transaction id chosen by the client, echoed in every reply
                        0,          # secs since the client began
                        flags,
                        0, 0, 0, 0,  # ciaddr, yiaddr, siaddr, giaddr all 0.0.0.0 in a DISCOVER
                        chaddr, b"\x00" * 64, b"\x00" * 128)
    assert len(fixed) == 236
    options = bytes([53, 1, 1])                      # option 53, length 1, value 1 = DHCPDISCOVER
    options += bytes([55, 4, 1, 3, 6, 51])           # option 55: ask for mask, router, DNS, lease time
    options += bytes([255])                          # option 255 = End
    msg = fixed + struct.pack("!I", MAGIC_COOKIE) + options
    if pad_to and len(msg) < pad_to:                 # BOOTP-compatible clients pad to 300 bytes
        msg += b"\x00" * (pad_to - len(msg))         # option 0 = Pad
    return msg


def ip_str(n):
    return ".".join(str((n >> s) & 0xFF) for s in (24, 16, 8, 0))


def parse_dhcp(msg):
    f = struct.unpack(BOOTP_FMT, msg[:236])
    out = {"op": f[0], "htype": f[1], "hlen": f[2], "hops": f[3], "xid": f[4], "secs": f[5],
           "flags": f[6], "ciaddr": ip_str(f[7]), "yiaddr": ip_str(f[8]), "siaddr": ip_str(f[9]),
           "giaddr": ip_str(f[10]), "chaddr": ":".join("%02x" % b for b in f[11][:f[2]])}
    cookie, = struct.unpack("!I", msg[236:240])
    out["cookie"] = cookie
    opts, i = {}, 240
    while i < len(msg):                              # walk Type-Length-Value options
        code = msg[i]
        if code == 0:                                # Pad has no length byte
            i += 1
            continue
        if code == 255:                              # End has no length byte
            opts[255] = b""
            break
        length = msg[i + 1]
        opts[code] = msg[i + 2:i + 2 + length]
        i += 2 + length
    out["options"] = opts
    return out


def lease_timers(lease_seconds):
    """RFC 2131 section 4.4.5 defaults: T1 = 0.5 x lease (renew), T2 = 0.875 x lease (rebind)."""
    return lease_seconds * 0.5, lease_seconds * 0.875


def main():
    msg = build_discover()
    print("DHCPDISCOVER: %d bytes (236 fixed + 4 cookie + %d option bytes + padding)" % (len(msg), 10))
    print("hex of first 44 bytes:")
    for row in range(0, 44, 16):
        print("  %04x  %s" % (row, " ".join("%02x" % b for b in msg[row:row + 16])))
    p = parse_dhcp(msg)
    for k in ("op", "htype", "hlen", "hops"):
        print("  %-7s = %d" % (k, p[k]))
    print("  xid     = 0x%08X" % p["xid"])
    print("  flags   = 0x%04X (broadcast bit %s)" % (p["flags"], "set" if p["flags"] & 0x8000 else "clear"))
    for k in ("ciaddr", "yiaddr", "siaddr", "giaddr", "chaddr"):
        print("  %-7s = %s" % (k, p[k]))
    print("  cookie  = 0x%08X" % p["cookie"])
    for code, val in p["options"].items():
        name = OPTION_NAMES.get(code, "option %d" % code)
        if code == 53:
            shown = "%d (%s)" % (val[0], DHCP_TYPES[val[0]])
        elif code == 55:
            shown = ", ".join("%d %s" % (c, OPTION_NAMES.get(c, "")) for c in val)
        else:
            shown = "-"
        print("  option %3d %-24s %s" % (code, name, shown))

    # self-tests on the textbook facts
    assert msg[:4] == b"\x01\x01\x06\x00"
    assert msg[236:240] == bytes([99, 130, 83, 99])
    assert p["options"][53] == b"\x01" and list(p["options"][55]) == [1, 3, 6, 51]
    assert p["ciaddr"] == "0.0.0.0" and p["chaddr"] == "00:1a:2b:3c:4d:5e"
    assert len(build_discover(pad_to=0)) == 250          # 236 + 4 + 3 + 6 + 1
    assert len(msg) == 300

    print("\nOn the wire (UDP): 0.0.0.0:68 -> 255.255.255.255:67, Ethernet dst ff:ff:ff:ff:ff:ff")
    print("Total IP datagram = 20 (IP) + 8 (UDP) + %d = %d bytes" % (len(msg), 28 + len(msg)))
    assert 28 + len(msg) == 328

    for hours in (24, 8):
        t1, t2 = lease_timers(hours * 3600)
        print("lease %2d h: T1 (unicast renew) at %.2f h, T2 (broadcast rebind) at %.2f h" % (hours, t1 / 3600, t2 / 3600))
    assert lease_timers(86400) == (43200.0, 75600.0)
    assert lease_timers(8 * 3600) == (14400.0, 25200.0)

    # a relay agent (ip helper-address) writes its own interface address into giaddr
    relayed = bytearray(msg)
    relayed[3] = 1                                       # hops becomes 1
    relayed[24:28] = bytes([10, 0, 2, 1])                # giaddr = Router0 Gi0/1 in the DHCP relay lab
    q = parse_dhcp(bytes(relayed))
    print("relayed copy: hops=%d giaddr=%s -> server picks the pool containing giaddr (LAN-B 10.0.2.0/24)" % (q["hops"], q["giaddr"]))
    assert q["giaddr"] == "10.0.2.1" and q["hops"] == 1
    print("\nAll DHCP assertions passed.")


if __name__ == "__main__":
    main()
