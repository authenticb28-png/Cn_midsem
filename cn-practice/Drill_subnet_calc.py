"""Drill model solution - subnet calculator with integer bit operations, checked by ipaddress.

COVERAGE rows: 13.6 (network / broadcast / first / last), 13.7 (usable = 2^h - 2),
14.6 (AWS usable = 2^h - 5), RFC 3021 /31 point-to-point links.

Socket & Scripting Drill question d-sock-31.
Run:  python3 Drill_subnet_calc.py      (offline, standard library only, exits 0)
"""
import ipaddress

MASK32 = 0xFFFFFFFF  # keep Python's unbounded integers inside 32 bits


def to_int(dotted: str) -> int:
    """'192.168.10.138' -> 32-bit integer, one octet at a time."""
    value = 0
    for part in dotted.split("."):
        octet = int(part)
        assert 0 <= octet <= 255, "octet out of range"
        value = (value << 8) | octet
    return value


def to_dotted(n: int) -> str:
    """32-bit integer -> dotted-decimal, by shifting each octet down and masking 8 bits."""
    return ".".join(str((n >> shift) & 0xFF) for shift in (24, 16, 8, 0))


def subnet_info(cidr: str) -> dict:
    addr, prefix = cidr.split("/")
    p = int(prefix)
    assert 0 <= p <= 32, "prefix out of range"
    ip = to_int(addr)
    mask = (MASK32 << (32 - p)) & MASK32     # p one-bits followed by (32 - p) zero-bits
    network = ip & mask                      # clear host bits
    broadcast = network | (~mask & MASK32)   # set host bits
    h = 32 - p
    if p == 32:                              # host route: a single address
        first, last, usable = network, network, 1
    elif p == 31:                            # RFC 3021: both addresses usable, no broadcast
        first, last, usable = network, broadcast, 2
    else:
        first, last, usable = network + 1, broadcast - 1, 2 ** h - 2
    return {
        "mask": to_dotted(mask),
        "network": to_dotted(network),
        "broadcast": to_dotted(broadcast) if p < 31 else None,
        "first": to_dotted(first),
        "last": to_dotted(last),
        "usable": usable,
        "aws_usable": 2 ** h - 5 if 16 <= p <= 28 else None,  # AWS allows /16 to /28 subnets
    }


def check_with_ipaddress(cidr: str, info: dict) -> None:
    """Cross-check the bitwise answers with the standard library."""
    net = ipaddress.ip_network(cidr, strict=False)
    hosts = list(net.hosts())
    assert info["network"] == str(net.network_address)
    assert info["mask"] == str(net.netmask)
    assert info["first"] == str(hosts[0]) and info["last"] == str(hosts[-1])
    assert info["usable"] == len(hosts)
    if info["broadcast"] is not None:
        assert info["broadcast"] == str(net.broadcast_address)


def main():
    expected = {
        "192.168.10.138/27": ("192.168.10.128", "192.168.10.159", "192.168.10.129", "192.168.10.158", 30, 27),
        "172.16.45.200/20": ("172.16.32.0", "172.16.47.255", "172.16.32.1", "172.16.47.254", 4094, 4091),
        "10.1.3.77/23": ("10.1.2.0", "10.1.3.255", "10.1.2.1", "10.1.3.254", 510, 507),
        "203.0.113.70/29": ("203.0.113.64", "203.0.113.71", "203.0.113.65", "203.0.113.70", 6, None),
        "198.51.100.9/30": ("198.51.100.8", "198.51.100.11", "198.51.100.9", "198.51.100.10", 2, None),
        "198.51.100.10/31": ("198.51.100.10", None, "198.51.100.10", "198.51.100.11", 2, None),
    }
    print("%-20s %-16s %-16s %-16s %-16s %6s %4s" % ("CIDR", "network", "broadcast", "first", "last", "usable", "AWS"))
    for cidr, (net, bc, first, last, usable, aws) in expected.items():
        info = subnet_info(cidr)
        print("%-20s %-16s %-16s %-16s %-16s %6d %4s" % (cidr, info["network"], info["broadcast"], info["first"],
                                                          info["last"], info["usable"], info["aws_usable"]))
        assert (info["network"], info["broadcast"], info["first"], info["last"], info["usable"], info["aws_usable"]) == \
            (net, bc, first, last, usable, aws), cidr
        check_with_ipaddress(cidr, info)
    # AWS numbers from SL-L14: /24 -> 251, /16 -> 65531, /28 -> 11
    assert subnet_info("10.0.1.0/24")["aws_usable"] == 251
    assert subnet_info("10.0.0.0/16")["aws_usable"] == 65531
    assert subnet_info("10.0.0.16/28")["aws_usable"] == 11
    assert subnet_info("10.0.0.5/32")["usable"] == 1
    print("All subnet assertions passed (bitwise results match the ipaddress module).")


if __name__ == "__main__":
    main()
