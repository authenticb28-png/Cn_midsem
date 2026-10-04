#!/usr/bin/env python3
"""Unit 15 - Longest-prefix match and subnet facts with the standard-library ipaddress module.

COVERAGE: 15.6 (LPM, default route), 15.8 (public vs private VPC route tables), 15.13 (100.1.1.0/29 lab),
15.15 (APIPA 169.254.0.0/16 when DHCP fails).

Run:  python3 Unit15_lpm_ipaddress.py
This is the "high-level" twin of Unit15_lpm_bitwise.py: ip_network / ip_address do the masking for us.
"""
import ipaddress


def lpm(table, dest):
    """table: list of (cidr string, next hop). Returns (winning network, next hop) or None."""
    addr = ipaddress.ip_address(dest)
    matches = [(ipaddress.ip_network(c), hop) for c, hop in table if addr in ipaddress.ip_network(c)]
    if not matches:
        return None
    return max(matches, key=lambda m: m[0].prefixlen)     # most specific prefix wins


def main():
    slide = [("10.0.0.0/16", "local"), ("10.0.1.0/24", "router-B"), ("0.0.0.0/0", "gateway")]
    net, hop = lpm(slide, "10.0.1.55")
    print("10.0.1.55 -> %s via %s" % (net, hop))
    assert str(net) == "10.0.1.0/24" and hop == "router-B"

    public_rt = [("10.0.0.0/16", "local"), ("0.0.0.0/0", "igw-0a1b")]
    private_rt = [("10.0.0.0/16", "local"), ("0.0.0.0/0", "nat-9f7c")]
    for name, rt in (("public", public_rt), ("private", private_rt)):
        print("%-7s RT: 10.0.3.7 -> %s, 52.94.236.248 -> %s" % (name, lpm(rt, "10.0.3.7")[1], lpm(rt, "52.94.236.248")[1]))
    assert lpm(private_rt, "52.94.236.248")[1] == "nat-9f7c"
    assert lpm(public_rt, "52.94.236.248")[1] == "igw-0a1b"

    # SL-L15 p21 VPC: four /24 subnets carved out of 10.0.0.0/16
    vpc = ipaddress.ip_network("10.0.0.0/16")
    subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24", "10.0.4.0/24"]
    assert all(ipaddress.ip_network(s).subnet_of(vpc) for s in subnets)
    # AWS reserves 5 addresses per subnet (network, .1 router, .2 DNS, .3 future, broadcast)
    print("each /24 in the VPC: %d addresses, %d usable in AWS" % (256, 256 - 5))

    # Static NAT lab WAN: 100.1.1.0/29
    wan = ipaddress.ip_network("100.1.1.0/29")
    hosts = [str(h) for h in wan.hosts()]
    print("100.1.1.0/29: mask %s, %d addresses, usable %s to %s (%d), broadcast %s" % (
        wan.netmask, wan.num_addresses, hosts[0], hosts[-1], len(hosts), wan.broadcast_address))
    assert str(wan.netmask) == "255.255.255.248" and len(hosts) == 6
    assert hosts == ["100.1.1.%d" % i for i in range(1, 7)]
    assert str(wan.broadcast_address) == "100.1.1.7"

    # APIPA: a PC that hears no DHCP OFFER self-assigns from 169.254.0.0/16
    apipa = ipaddress.ip_network("169.254.0.0/16")
    for pc in ("169.254.1.36", "169.254.1.38"):        # PC1 and PC2 in the saved Gaming LAN topology
        a = ipaddress.ip_address(pc)
        assert a in apipa and a.is_link_local
    print("169.254.1.36 is link-local (APIPA): %s" % ipaddress.ip_address("169.254.1.36").is_link_local)
    assert ipaddress.ip_address("192.168.10.2").is_private and not ipaddress.ip_address("192.168.10.2").is_link_local
    print("All ipaddress assertions passed.")


if __name__ == "__main__":
    main()
