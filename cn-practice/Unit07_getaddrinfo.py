#!/usr/bin/env python3
"""Unit 07 - Name resolution with library calls (high level).

Topic : socket.getaddrinfo / gethostbyname (the stub resolver every program uses), and
        dnspython (optional) to build and decode DNS messages without hand-written struct code.
COVERAGE ids : 07.4, 07.6
Run   : python3 Unit07_getaddrinfo.py
Offline: 'localhost' is answered from the system hosts file, never from a DNS server.
dnspython is optional (pip install dnspython); without it a struct-based fallback runs.
"""
import ipaddress
import socket
import struct

# Same 67-byte canned response as Unit07_dns_packet.py (www.newtonschool.co -> CNAME -> A).
CANNED_RESPONSE = bytes.fromhex(
    "1a2b81800001000200000000"
    "03777777" "0c6e6577746f6e7363686f6f6c" "02636f00" "00010001"
    "c00c00050001" "0000012c" "0002c010"
    "c01000010001" "0000003c" "00046353be66"
)


def stub_resolver_demo():
    print("== socket.getaddrinfo('localhost', 53) ==")
    infos = socket.getaddrinfo("localhost", 53, type=socket.SOCK_DGRAM)
    for family, socktype, proto, _canon, sockaddr in infos:
        print("   family=%-8s type=%-11s proto=%2d  sockaddr=%s" % (family.name, socktype.name, proto, sockaddr))
    addrs = {info[4][0] for info in infos}
    # every address returned for localhost must be a loopback address (127.0.0.0/8 or ::1)
    assert addrs and all(ipaddress.ip_address(a.split("%")[0]).is_loopback for a in addrs)
    assert all(info[2] == socket.IPPROTO_UDP for info in infos)       # SOCK_DGRAM -> UDP (17)

    print("\n== socket.gethostbyname('localhost') (IPv4 only) ==")
    v4 = socket.gethostbyname("localhost")
    print("   ", v4)
    assert ipaddress.ip_address(v4).is_loopback

    print("\n== numeric host: no lookup at all ==")
    infos = socket.getaddrinfo("99.83.190.102", 443, socket.AF_INET, socket.SOCK_STREAM, 0, socket.AI_NUMERICHOST)
    print("   ", infos[0][4])
    assert infos[0][4] == ("99.83.190.102", 443) and infos[0][2] == socket.IPPROTO_TCP


def dnspython_demo():
    try:
        import dns.message
        import dns.rdatatype
    except ImportError:
        print("\ndnspython not installed - running the struct fallback instead")
        qid, flags, qd, an, ns, ar = struct.unpack("!HHHHHH", CANNED_RESPONSE[:12])
        print("   ID=0x%04x flags=0x%04x QD=%d AN=%d NS=%d AR=%d" % (qid, flags, qd, an, ns, ar))
        last_a = socket.inet_ntoa(CANNED_RESPONSE[-4:])                # final RDATA is the A record
        print("   final A record:", last_a)
        assert (flags, an, last_a) == (0x8180, 2, "99.83.190.102")
        return
    print("\n== dnspython: build a query and decode the canned response ==")
    q = dns.message.make_query("www.amazon.com", "A")
    wire = q.to_wire()
    print("   query wire length:", len(wire), "bytes (dnspython may add an EDNS OPT record)")
    assert len(wire) >= 32
    m = dns.message.from_wire(CANNED_RESPONSE)
    for rrset in m.answer:
        print("   ", rrset)
    a = [r for r in m.answer if r.rdtype == dns.rdatatype.A][0]
    assert a[0].address == "99.83.190.102" and a.ttl == 60


def main():
    stub_resolver_demo()
    dnspython_demo()
    print("\nAll high-level resolver self-tests passed.")


if __name__ == "__main__":
    main()
