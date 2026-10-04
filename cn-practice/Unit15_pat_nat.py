#!/usr/bin/env python3
"""Unit 15 - NAT / PAT translator simulator with a collision-free port allocator.

COVERAGE: 15.1 (NAT rewrite, before/after header), 15.2 (PAT translation table), 15.4 (one-to-one NAT),
15.9 (Be the NAT box: port collision), 15.13 (static NAT lab mappings).

Run:  python3 Unit15_pat_nat.py
No sockets are opened. The script
  1. rewrites a real 20-byte IPv4 header (struct) and recomputes its checksum, as a NAT box must,
  2. replays SL-L15 p10 through a PAT table and asserts the slide's exact outside ports 40001-40003,
  3. shows what goes wrong when an allocator reuses an outside port (the classroom "twist"),
  4. builds the one-to-one table of WB-L08 p129 and the static NAT table of the CN_LAB_NAT_D lab.
References: RFC 3022 (Traditional NAT), RFC 791 (IPv4 header checksum), SL-L15 p6-p10, WB-L08 p129-p130.
"""
import socket
import struct


# ---------------------------------------------------------------------------------------------
# Part 1: what NAT changes inside the IPv4 header
# ---------------------------------------------------------------------------------------------
def ones_complement_sum16(data):
    """16-bit one's-complement sum used by the IPv4, TCP, UDP and ICMP checksums."""
    if len(data) % 2:
        data += b"\x00"                       # pad odd length with a zero byte
    total = 0
    for i in range(0, len(data), 2):
        total += (data[i] << 8) | data[i + 1]  # big-endian 16-bit word
        total = (total & 0xFFFF) + (total >> 16)  # wrap the carry around (end-around carry)
    return total


def ipv4_checksum(header):
    return (~ones_complement_sum16(header)) & 0xFFFF


def build_ipv4_header(src, dst, total_len=60, ident=0x1C46, ttl=64, proto=6):
    """20-byte IPv4 header (no options) with a correct checksum."""
    ver_ihl = (4 << 4) | 5                    # version 4, IHL 5 words = 20 bytes
    hdr = struct.pack("!BBHHHBBH4s4s", ver_ihl, 0, total_len, ident, 0x4000, ttl, proto, 0,
                      socket.inet_aton(src), socket.inet_aton(dst))
    csum = ipv4_checksum(hdr)                 # checksum field was 0 while summing
    return hdr[:10] + struct.pack("!H", csum) + hdr[12:]


def nat_rewrite_source(header, new_src):
    """Replace the source address (bytes 12-15) and recompute the header checksum."""
    hdr = bytearray(header)
    hdr[12:16] = socket.inet_aton(new_src)
    hdr[10:12] = b"\x00\x00"                  # zero the old checksum before recomputing
    hdr[10:12] = struct.pack("!H", ipv4_checksum(bytes(hdr)))
    return bytes(hdr)


def show_header(label, hdr):
    f = struct.unpack("!BBHHHBBH4s4s", hdr)
    print("  %-26s SRC %-15s DST %-15s TTL %d  checksum 0x%04X" % (
        label, socket.inet_ntoa(f[8]), socket.inet_ntoa(f[9]), f[5], f[7]))


# ---------------------------------------------------------------------------------------------
# Part 2: PAT translation table with a collision-free outside-port allocator
# ---------------------------------------------------------------------------------------------
class PatTable:
    """Many inside sockets share one public IP; every mapping gets a unique outside port.

    Outbound key  : (inside_ip, inside_port, dest_ip, dest_port)
    Inbound key   : outside_port (the reply arrives at public_ip:outside_port)
    """

    def __init__(self, public_ip, first_port=40001, last_port=65535):
        self.public_ip = public_ip
        self.next_port = first_port
        self.first_port, self.last_port = first_port, last_port
        self.out = {}        # inside flow -> outside port
        self.back = {}       # outside port -> (inside_ip, inside_port, dest_ip, dest_port)

    def _allocate(self):
        """Hand out the next free port; skip any port still in use (that is what avoids collisions)."""
        span = self.last_port - self.first_port + 1
        for _ in range(span):
            port = self.next_port
            self.next_port = self.first_port if port == self.last_port else port + 1
            if port not in self.back:
                return port
        raise RuntimeError("port pool exhausted: no free outside port on %s" % self.public_ip)

    def outbound(self, inside_ip, inside_port, dest_ip, dest_port):
        key = (inside_ip, inside_port, dest_ip, dest_port)
        if key not in self.out:                   # new flow: create one mapping
            port = self._allocate()
            self.out[key] = port
            self.back[port] = key
        return self.public_ip, self.out[key]       # the rewritten source socket

    def inbound(self, dst_port):
        """A reply arrives for public_ip:dst_port. Returns the inside socket to rewrite to, or None (drop)."""
        key = self.back.get(dst_port)
        return None if key is None else (key[0], key[1])

    def close(self, outside_port):
        key = self.back.pop(outside_port)
        del self.out[key]

    def rows(self):
        return [("%s:%d" % (k[0], k[1]), "%s:%d" % (self.public_ip, p), "%s:%d" % (k[2], k[3]))
                for k, p in sorted(self.out.items(), key=lambda kv: kv[1])]


class BrokenPat:
    """The classroom 'twist': this NAT box keeps the inside port as the outside port (no allocator)."""

    def __init__(self, public_ip):
        self.public_ip = public_ip
        self.back = {}

    def outbound(self, inside_ip, inside_port, dest_ip, dest_port):
        self.back[inside_port] = (inside_ip, inside_port)   # silently overwrites an older mapping
        return self.public_ip, inside_port

    def inbound(self, dst_port):
        return self.back.get(dst_port)


def main():
    print("Part 1 - NAT rewrites the source address and must fix the checksum (SL-L15 p6)")
    before = build_ipv4_header("192.168.1.20", "93.184.216.34")
    after = nat_rewrite_source(before, "203.0.113.7")
    show_header("BEFORE (leaving host)", before)
    show_header("AFTER (on the Internet)", after)
    assert ones_complement_sum16(before) == 0xFFFF       # a correct header sums to all ones
    assert ones_complement_sum16(after) == 0xFFFF
    assert before[16:20] == after[16:20]                 # destination is untouched
    assert before[10:12] != after[10:12]                 # checksum had to change
    print("  -> only SRC and the checksum changed; DST 93.184.216.34 is identical.\n")

    print("Part 2 - PAT translation table, exact values from SL-L15 p10")
    pat = PatTable("203.0.113.7", first_port=40001)
    flows = [("192.168.1.20", 51000, "93.184.216.34", 443),
             ("192.168.1.21", 51000, "93.184.216.34", 443),   # same inside port as .20 on purpose
             ("192.168.1.35", 49876, "142.250.72.14", 443)]
    for f in flows:
        pub = pat.outbound(*f)
        print("  %s:%d -> %s:%d  (to %s:%d)" % (f[0], f[1], pub[0], pub[1], f[2], f[3]))
    assert pat.rows() == [("192.168.1.20:51000", "203.0.113.7:40001", "93.184.216.34:443"),
                          ("192.168.1.21:51000", "203.0.113.7:40002", "93.184.216.34:443"),
                          ("192.168.1.35:49876", "203.0.113.7:40003", "142.250.72.14:443")]
    # replies: the outside port alone decides which inside host gets the packet
    assert pat.inbound(40001) == ("192.168.1.20", 51000)
    assert pat.inbound(40002) == ("192.168.1.21", 51000)
    assert pat.inbound(40003) == ("192.168.1.35", 49876)
    assert pat.inbound(40004) is None                    # unsolicited inbound: no mapping, dropped
    print("  replies to :40001/:40002/:40003 reach .20/.21/.35; a packet to :40004 is dropped.")
    # re-sending on an existing flow reuses its mapping instead of creating a new one
    assert pat.outbound(*flows[0]) == ("203.0.113.7", 40001)

    print("\nPart 3 - Be the NAT box: what a port collision does (SL-L15 p29)")
    broken = BrokenPat("203.0.113.7")
    broken.outbound("192.168.1.20", 51000, "93.184.216.34", 443)
    broken.outbound("192.168.1.21", 51000, "93.184.216.34", 443)
    victim = broken.inbound(51000)
    print("  broken NAT: reply for 203.0.113.7:51000 goes to %s:%d (the .20 reply is misdelivered)" % victim)
    assert victim == ("192.168.1.21", 51000)
    # the allocator skips a port that is still in use even after it wraps around
    small = PatTable("203.0.113.7", first_port=40001, last_port=40003)
    for host in (20, 21, 35):
        small.outbound("192.168.1.%d" % host, 50000, "93.184.216.34", 443)
    small.close(40002)                                   # the .21 flow ends, freeing 40002
    assert small.outbound("192.168.1.40", 50000, "93.184.216.34", 443) == ("203.0.113.7", 40002)
    try:
        small.outbound("192.168.1.41", 50000, "93.184.216.34", 443)
        raise AssertionError("pool should be exhausted")
    except RuntimeError as exc:
        print("  3-port pool: %s" % exc)
    usable = 65535 - 1024 + 1
    print("  ports 1024-65535 give %d simultaneous mappings per public IP per protocol" % usable)
    assert usable == 64512

    print("\nPart 3b - WB-L08 p130 fill-in drill (Smart TV row has no ports on the slide)")
    home = PatTable("203.0.113.5", first_port=62001)
    home.outbound("192.168.0.2", 4567, "198.51.100.10", 443)
    home.outbound("192.168.0.3", 4568, "198.51.100.10", 443)
    tv = home.outbound("192.168.0.4", 4569, "198.51.100.10", 443)   # inside port 4569 is our assumption
    for r in home.rows():
        print("  %s -> %s" % (r[0], r[1]))
    assert tv == ("203.0.113.5", 62003)

    print("\nPart 4 - one-to-one NAT (WB-L08 p129) and the static NAT lab (CN_LAB_NAT_D)")
    one_to_one = {"192.168.0.%d" % i: "200.200.200.%d" % i for i in range(1, 5)}
    for inside_local, inside_global in one_to_one.items():
        print("  inside local %-12s <-> inside global %s" % (inside_local, inside_global))
    lab = {"10.0.10.2": "100.1.1.3", "10.0.20.2": "100.1.1.4", "10.0.30.2": "100.1.1.5"}
    reverse = {pub: priv for priv, pub in lab.items()}
    for priv, pub in lab.items():
        print("  ip nat inside source static %s %s" % (priv, pub))
    assert reverse["100.1.1.4"] == "10.0.20.2"           # PC6 browsing 100.1.1.4 reaches Server1
    assert len(set(lab.values())) == len(lab)            # static NAT is strictly one-to-one
    print("\nAll NAT/PAT assertions passed.")


if __name__ == "__main__":
    main()
