#!/usr/bin/env python3
"""Unit 01 - name resolution and a safe traceroute wrapper (library level).

COVERAGE ids: 01.6 (traceroute, latency by hop), 01.7 (edge / access / core).
Level: HIGH (socket.getaddrinfo, socket.gethostbyname, ipaddress, re, subprocess, shutil).

Run:  python3 Unit01_resolve_and_trace.py              (offline: localhost only)
      python3 Unit01_resolve_and_trace.py --live HOST  (optional: trace a real host if
                                                         traceroute is installed and the
                                                         network is reachable)

Default behaviour never touches the Internet. If the `traceroute` binary is missing, the
live part is skipped with a message and the script still exits 0.
"""
import ipaddress
import re
import shutil
import socket
import subprocess
import sys

# A compact copy of the WB-L01 p30 style trace (addresses after hop 2 are RFC 5737
# documentation addresses used for illustration).
SAMPLE = """traceroute to google.com (198.51.100.14), 30 hops max, 60 byte packets
 1  192.168.1.1 (192.168.1.1)  1.211 ms  1.093 ms  1.152 ms
 2  10.240.9.204 (10.240.9.204)  3.402 ms  3.517 ms  3.611 ms
 3  * * *
 4  static-41.anaronline.net (203.0.113.41)  8.204 ms  8.317 ms  8.125 ms
 6  203.0.113.97 (203.0.113.97)  16.104 ms  16.227 ms  15.989 ms
 7  198.51.100.21 (198.51.100.21)  16.402 ms 198.51.100.23 (198.51.100.23)  16.611 ms  16.388 ms
18  del11s05-in-f14.1e100.net (198.51.100.14)  20.104 ms  19.987 ms  20.230 ms
"""

HOP_RE = re.compile(r"^\s*(\d+)\s+(.*)$")
ADDR_RE = re.compile(r"\((\d+\.\d+\.\d+\.\d+)\)")
RTT_RE = re.compile(r"([\d.]+) ms")


def classify(addr):
    """Use ipaddress to label an address the way the slide labels hops."""
    ip = ipaddress.ip_address(addr)
    if ip.is_loopback:
        return "loopback"
    if ip in ipaddress.ip_network("100.64.0.0/10"):
        return "carrier-grade NAT (RFC 6598)"
    if ip.is_private and any(ip in ipaddress.ip_network(n) for n in ("10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16")):
        return "private (RFC 1918)"
    if ip in ipaddress.ip_network("198.51.100.0/24") or ip in ipaddress.ip_network("203.0.113.0/24"):
        return "documentation range (stands in for a public router)"
    return "public"


def parse(text):
    hops = []
    for line in text.splitlines()[1:]:
        m = HOP_RE.match(line)
        if not m:
            continue
        rest = m.group(2)
        addrs = ADDR_RE.findall(rest)
        rtts = [float(x) for x in RTT_RE.findall(rest)]
        hops.append((int(m.group(1)), addrs, rtts))
    return hops


def resolve_demo():
    print("=== Name resolution on this machine (no Internet needed) ===")
    ip = socket.gethostbyname("localhost")
    print("gethostbyname('localhost') ->", ip)
    assert ip.startswith("127."), "localhost must map to the IPv4 loopback block 127.0.0.0/8"
    infos = socket.getaddrinfo("localhost", 80, proto=socket.IPPROTO_TCP)
    seen = set()
    for family, socktype, proto, _canon, sockaddr in infos:
        key = (family, sockaddr[0])
        if key in seen:
            continue
        seen.add(key)
        print("getaddrinfo: family=%s type=%s proto=%d addr=%s port=%d"
              % (socket.AddressFamily(family).name, socket.SocketKind(socktype).name, proto, sockaddr[0], sockaddr[1]))
    assert any(f == socket.AF_INET for f, _ in seen)
    # numeric strings are returned without any DNS query at all
    assert socket.gethostbyname("127.0.0.1") == "127.0.0.1"


def sample_demo():
    print("\n=== Classifying the sample trace with ipaddress + re ===")
    hops = parse(SAMPLE)
    for n, addrs, rtts in hops:
        if not addrs:
            print("hop %2d  * * *  (router did not answer)" % n)
            continue
        avg = sum(rtts) / len(rtts)
        print("hop %2d  %-15s  avg %6.3f ms  %s%s" % (n, addrs[0], avg, classify(addrs[0]),
                                                    "  [%d responders]" % len(addrs) if len(addrs) > 1 else ""))
    assert classify("192.168.1.1") == "private (RFC 1918)"
    assert classify("10.240.9.204") == "private (RFC 1918)"
    assert classify("100.64.3.9") == "carrier-grade NAT (RFC 6598)"
    assert len(hops) == 7 and hops[2][1] == [] and len(hops[5][1]) == 2
    assert round(sum(hops[-1][2]) / 3, 3) == 20.107


def network_available(timeout=1.5):
    """Only called in --live mode: can we open a TCP connection to a public resolver?"""
    try:
        with socket.create_connection(("1.1.1.1", 53), timeout=timeout):
            return True
    except OSError:
        return False


def run_traceroute(target, max_hops=3, timeout=10):
    exe = shutil.which("traceroute")
    if exe is None:
        print("traceroute is not installed on this machine - skipping the live run.")
        print("(Debian/Ubuntu: apt install traceroute; Windows has 'tracert', which uses ICMP Echo probes.)")
        return None
    cmd = [exe, "-n", "-q", "1", "-w", "1", "-m", str(max_hops), target]
    print("running:", " ".join(cmd))
    try:
        out = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
    except subprocess.TimeoutExpired:
        print("traceroute took longer than %d s - skipped." % timeout)
        return None
    print(out.stdout.strip() or out.stderr.strip())
    return out.stdout


def main():
    resolve_demo()
    sample_demo()
    print("\n=== Optional live traceroute ===")
    if "--live" in sys.argv:
        idx = sys.argv.index("--live")
        target = sys.argv[idx + 1] if idx + 1 < len(sys.argv) else "google.com"
        if network_available():
            run_traceroute(target, max_hops=20, timeout=60)
        else:
            print("network not reachable - skipping live traceroute to", target)
    else:
        # Offline-safe default: trace the loopback address, which never leaves the machine.
        result = run_traceroute("127.0.0.1", max_hops=2, timeout=10)
        if result is not None:
            hops = parse(result)
            print("loopback trace parsed into %d hop line(s)" % len(hops))
    print("\nAll self-tests passed.")


if __name__ == "__main__":
    main()
