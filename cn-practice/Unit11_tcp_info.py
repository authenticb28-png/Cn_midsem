"""Unit 11 - see congestion control from a real socket: a text plot of cwnd plus a localhost TCP transfer.

COVERAGE ids: 11.3, 11.5, 11.8, 11.10
Source: SL-L11 p8 (cwnd, initial window 10), p13 (cwnd trace), p19-20 (fast recovery);
        RFC 5681, RFC 6928 (initial window of 10 segments), Linux tcp(7) man page (TCP_INFO, TCP_NODELAY).

Run:    python3 Unit11_tcp_info.py

Part 1 draws the Tahoe and Reno cwnd traces as a text chart (no matplotlib needed).
Part 2 opens a TCP connection on 127.0.0.1 (server thread on an OS-assigned port), sends 2 MB,
        and reads the kernel's own congestion state with getsockopt(IPPROTO_TCP, TCP_INFO).
        TCP_INFO exists only on Linux; elsewhere the script prints SO_SNDBUF, SO_RCVBUF and TCP_NODELAY.
"""

import socket
import struct
import sys
import threading


# ---------------------------------------------------------------- part 1: text plot of cwnd

def trace(variant, rounds, ssthresh, loss_round):
    """cwnd per round with 3 duplicate ACKs detected at the end of `loss_round` (exam model)."""
    cwnd, out = 1, []
    for r in range(1, rounds + 1):
        out.append(cwnd)
        if r == loss_round:
            ssthresh = max(cwnd // 2, 2)
            cwnd = 1 if variant == "tahoe" else ssthresh   # Tahoe restarts, Reno halves
        elif cwnd < ssthresh:
            cwnd = min(2 * cwnd, ssthresh)
        else:
            cwnd += 1
    return out


def text_plot(series, height=12):
    """Draw several integer series as columns of characters, one column per round."""
    top = max(max(ys) for ys in series.values())
    marks = {name: name[0] for name in series}               # T for Tahoe, R for Reno
    n = len(next(iter(series.values())))
    lines = []
    for level in range(top, 0, -1):
        if level % max(1, top // height) and level != top:
            continue                                         # thin out rows so the plot stays short
        row = ""
        for i in range(n):
            here = [marks[name] for name, ys in series.items() if ys[i] >= level]
            row += " " + ("*" if len(here) > 1 else (here[0] if here else " ")) + " "
        lines.append("%3d |%s" % (level, row))
    lines.append("    +" + "---" * n)
    lines.append("     " + "".join("%2d " % (i + 1) for i in range(n)) + " round")
    return "\n".join(lines)


# ---------------------------------------------------------------- part 2: real socket on localhost

# struct tcp_info from linux/tcp.h: 8 one-byte fields followed by 32-bit fields.
# We unpack the first 8 bytes and the first 24 unsigned 32-bit fields (8 + 96 = 104 bytes).
TCP_INFO_FMT = "8B24I"
TCP_INFO_NAMES = ["rto", "ato", "snd_mss", "rcv_mss", "unacked", "sacked", "lost", "retrans", "fackets",
                  "last_data_sent", "last_ack_sent", "last_data_recv", "last_ack_recv", "pmtu",
                  "rcv_ssthresh", "rtt", "rttvar", "snd_ssthresh", "snd_cwnd", "advmss", "reordering",
                  "rcv_rtt", "rcv_space", "total_retrans"]


def read_tcp_info(sock):
    """Return a dict of tcp_info fields, or None when the platform has no TCP_INFO."""
    if not hasattr(socket, "TCP_INFO") or not sys.platform.startswith("linux"):
        return None
    try:
        raw = sock.getsockopt(socket.IPPROTO_TCP, socket.TCP_INFO, struct.calcsize(TCP_INFO_FMT))
    except OSError:
        return None                                    # sandboxed kernels may refuse the option
    if len(raw) < struct.calcsize(TCP_INFO_FMT):
        return None
    vals = struct.unpack(TCP_INFO_FMT, raw[:struct.calcsize(TCP_INFO_FMT)])
    info = dict(zip(TCP_INFO_NAMES, vals[8:]))
    info["state"] = vals[0]                            # 1 = TCP_ESTABLISHED
    info["ca_state"] = vals[1]                         # 0 Open, 1 Disorder, 2 CWR, 3 Recovery, 4 Loss
    return info


def show_sockopts(sock, label):
    """The portable fallback: buffer sizes and the Nagle switch."""
    snd = sock.getsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF)
    rcv = sock.getsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF)
    nodelay = sock.getsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY)
    print("  %s: SO_SNDBUF = %d bytes, SO_RCVBUF = %d bytes, TCP_NODELAY = %d" % (label, snd, rcv, nodelay))
    return snd, rcv, nodelay


def serve(listener, result):
    """Server thread: accept one connection and count every byte until the client closes."""
    conn, _ = listener.accept()
    conn.settimeout(10)
    total = 0
    with conn:
        while True:
            chunk = conn.recv(65536)
            if not chunk:
                break
            total += len(chunk)
    result["received"] = total


def socket_demo(nbytes=2 * 1024 * 1024):
    listener = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    listener.bind(("127.0.0.1", 0))                    # port 0: the OS picks a free port
    listener.listen(1)
    listener.settimeout(10)
    port = listener.getsockname()[1]
    result = {}
    t = threading.Thread(target=serve, args=(listener, result), daemon=True)
    t.start()

    client = socket.create_connection(("127.0.0.1", port), timeout=10)
    print("Connected 127.0.0.1:%d -> 127.0.0.1:%d" % (client.getsockname()[1], port))

    show_sockopts(client, "defaults")
    client.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)   # disable Nagle (RFC 896 small-segment rule)
    _, _, nodelay = show_sockopts(client, "after TCP_NODELAY=1")
    assert nodelay != 0, "TCP_NODELAY should read back as non-zero"

    before = read_tcp_info(client)
    client.sendall(b"x" * nbytes)                      # bulk transfer so cwnd has a reason to grow
    after = read_tcp_info(client)
    client.shutdown(socket.SHUT_WR)                    # FIN: tells the server we are done
    t.join(10)
    client.close()
    listener.close()

    assert result.get("received") == nbytes, "server must receive every byte"
    print("Server received %d bytes (sent %d)" % (result["received"], nbytes))

    if before is None or after is None:
        print("TCP_INFO not available on this platform; the socket options above are the portable view.")
        return
    for label, info in (("before transfer", before), ("after transfer", after)):
        print("  TCP_INFO %-16s state=%d ca_state=%d snd_cwnd=%d segments snd_ssthresh=%d snd_mss=%d rtt=%d us"
              % (label, info["state"], info["ca_state"], info["snd_cwnd"], info["snd_ssthresh"],
                 info["snd_mss"], info["rtt"]))
    assert before["state"] == 1, "connection must be ESTABLISHED (state 1)"
    assert before["snd_cwnd"] >= 1 and after["snd_cwnd"] >= 1
    if before["snd_cwnd"] == 10:
        print("  Initial cwnd is 10 segments: the IW10 default from RFC 6928 that SL-L11 p8 mentions.")
    # A huge snd_ssthresh (0x7fffffff on Linux) means "no loss seen yet": the connection is still in slow start.
    if after["snd_ssthresh"] >= 0x7FFFFFFF:
        print("  snd_ssthresh is 'infinite': no loss happened, so the kernel never left slow start's rule.")
    else:
        print("  snd_ssthresh = %d: the kernel saw a congestion signal (loss, ECN or a cwnd reduction) and set a threshold."
              % after["snd_ssthresh"])


def main():
    tahoe = trace("tahoe", 15, 8, 8)
    reno = trace("reno", 15, 8, 8)
    assert tahoe == [1, 2, 4, 8, 9, 10, 11, 12, 1, 2, 4, 6, 7, 8, 9]
    assert reno == [1, 2, 4, 8, 9, 10, 11, 12, 6, 7, 8, 9, 10, 11, 12]
    print("cwnd (MSS) per round, 3 duplicate ACKs in round 8: T = Tahoe only, R = Reno only, * = both")
    print(text_plot({"Tahoe": tahoe, "Reno": reno}))
    print()
    socket_demo()
    print("Unit 11 socket demo finished.")


if __name__ == "__main__":
    main()
