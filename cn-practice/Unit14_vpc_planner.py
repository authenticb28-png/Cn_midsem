"""Unit 14 - AWS VPC planner with the ipaddress module (high level).

COVERAGE rows: 14.4 / 14.5 (public vs private, 3-tier x 2-AZ), 14.6 (5 reserved
addresses), 14.7 (/16 to /28 limits), 14.8 (no overlap, inside the VPC),
15.14 (lab: vpc-lab 10.20.0.0/16 with subnet-a and subnet-b).

Validates a plan the way the AWS console would:
  * VPC and every subnet prefix between /16 and /28
  * every subnet inside the VPC CIDR
  * no two subnets overlap
  * usable = 2^(32-n) - 5   (.0 network, .1 router, .2 DNS, .3 reserved, last = broadcast)
  * public subnet = route table has 0.0.0.0/0 -> igw; private = 0.0.0.0/0 -> nat (or no default route)

Run:  python3 Unit14_vpc_planner.py
"""
import ipaddress
from itertools import combinations


def aws_reserved(subnet):
    n = ipaddress.ip_network(subnet)
    base = n.network_address
    return {"network": str(base), "vpc_router": str(base + 1), "dns": str(base + 2),
            "future_use": str(base + 3), "broadcast": str(n.broadcast_address)}


def aws_usable(subnet):
    return ipaddress.ip_network(subnet).num_addresses - 5


def validate(vpc_cidr, subnets):
    """subnets: list of dicts with name, cidr, az, default_route ('igw', 'nat' or None). Returns problems."""
    problems = []
    vpc = ipaddress.ip_network(vpc_cidr)          # strict: host bits must be zero
    if not 16 <= vpc.prefixlen <= 28:
        problems.append("VPC %s: prefix must be /16 to /28" % vpc)
    nets = []
    for s in subnets:
        try:
            n = ipaddress.ip_network(s["cidr"])
        except ValueError as e:
            problems.append("%s: %s" % (s["name"], e))
            continue
        if not 16 <= n.prefixlen <= 28:
            problems.append("%s: /%d is outside /16 to /28" % (s["name"], n.prefixlen))
        if not n.subnet_of(vpc):
            problems.append("%s: %s is not inside VPC %s" % (s["name"], n, vpc))
        nets.append((s["name"], n))
    for (a, na), (b, nb) in combinations(nets, 2):
        if na.overlaps(nb):
            problems.append("%s %s overlaps %s %s" % (a, na, b, nb))
    return problems


def describe(subnets):
    for s in subnets:
        kind = "public" if s.get("default_route") == "igw" else "private"
        print("  %-10s %-14s %-11s %-7s usable %d" % (s["name"], s["cidr"], s["az"], kind, aws_usable(s["cidr"])))


if __name__ == "__main__":
    print("== 14.6 five reserved addresses of 10.0.0.0/24 ==")
    r = aws_reserved("10.0.0.0/24")
    print(r)
    assert r == {"network": "10.0.0.0", "vpc_router": "10.0.0.1", "dns": "10.0.0.2",
                 "future_use": "10.0.0.3", "broadcast": "10.0.0.255"}
    assert (aws_usable("10.0.0.0/24"), aws_usable("10.0.144.0/20"), aws_usable("10.0.0.0/28")) == (251, 4091, 11)

    print("\n== 14.5 3-tier x 2-AZ plan in 10.0.0.0/16 ==")
    plan = [
        {"name": "web-a", "cidr": "10.0.1.0/24", "az": "us-east-1a", "default_route": "igw"},
        {"name": "web-b", "cidr": "10.0.2.0/24", "az": "us-east-1b", "default_route": "igw"},
        {"name": "app-a", "cidr": "10.0.11.0/24", "az": "us-east-1a", "default_route": "nat"},
        {"name": "app-b", "cidr": "10.0.12.0/24", "az": "us-east-1b", "default_route": "nat"},
        {"name": "db-a", "cidr": "10.0.21.0/24", "az": "us-east-1a", "default_route": None},
        {"name": "db-b", "cidr": "10.0.22.0/24", "az": "us-east-1b", "default_route": None},
    ]
    describe(plan)
    assert validate("10.0.0.0/16", plan) == []
    assert len({s["az"] for s in plan}) == 2

    print("\n== 14.7 / 14.8 rule violations ==")
    bad = [
        {"name": "A", "cidr": "10.0.1.0/24", "az": "us-east-1a"},
        {"name": "B", "cidr": "10.0.1.128/25", "az": "us-east-1a"},   # overlaps A (slide p20)
        {"name": "C", "cidr": "10.1.0.0/16", "az": "us-east-1b"},     # outside the VPC
        {"name": "D", "cidr": "10.0.32.0/29", "az": "us-east-1a"},    # too small (slide p18)
        {"name": "E", "cidr": "10.0.3.5/24", "az": "us-east-1a"},     # host bits set
    ]
    probs = validate("10.0.0.0/16", bad)
    for p in probs:
        print("  x", p)
    assert any("overlaps" in p and "A" in p and "B" in p for p in probs)
    assert any(p.startswith("C:") and "not inside" in p for p in probs)
    assert any(p.startswith("D:") and "/29" in p for p in probs)
    assert any(p.startswith("E:") for p in probs)
    assert validate("10.0.0.0/16", [{"name": "ok", "cidr": "10.0.32.0/26", "az": "x"}]) == []   # slide p19

    print("\n== 15.14 lab: vpc-lab ==")
    lab = [
        {"name": "subnet-a", "cidr": "10.20.1.0/24", "az": "us-east-1a", "default_route": "igw"},   # rt-public
        {"name": "subnet-b", "cidr": "10.20.2.0/24", "az": "us-east-1b", "default_route": None},    # main table
    ]
    describe(lab)
    assert validate("10.20.0.0/16", lab) == []
    assert ipaddress.ip_network("10.20.1.0/24").num_addresses - 2 == 254   # generic answer
    assert aws_usable("10.20.1.0/24") == 251                             # AWS answer

    print("\n== carving the next free /24s with subnets() ==")
    vpc = ipaddress.ip_network("10.20.0.0/16")
    used = [ipaddress.ip_network(s["cidr"]) for s in lab]
    free = [n for n in vpc.subnets(new_prefix=24) if not any(n.overlaps(u) for u in used)][:3]
    print("  next free /24s:", [str(f) for f in free])
    assert [str(f) for f in free] == ["10.20.0.0/24", "10.20.3.0/24", "10.20.4.0/24"]
    print("\nAll VPC planner asserts passed.")
