// Last-Night Formula Sheet (window.EXTRAS.formulas). Every number shown here was recomputed.
window.EXTRAS = window.EXTRAS || {};
window.EXTRAS.formulas = {
  title: "Last-Night Formula Sheet",
  sections: [

    // ------------------------------------------------------------------ 1
    {
      title: "1. Every network formula in one table",
      blocks: [
        { type: "text",
          html: "<p>Units first, always: convert bytes to bits ($\\times 8$), use $1\\text{ Mbps} = 10^6$ bit/s, $1\\text{ ms} = 10^{-3}$ s, $1\\,\\mu\\text{s} = 10^{-6}$ s. File sizes in networking questions use $1\\text{ KB} = 10^3$ B and $1\\text{ MB} = 10^6$ B unless the question says KiB or MiB. Every example in the table has been recomputed.</p>" },
        { type: "table",
          head: ["Formula", "Meaning (with one example)", "Units", "Trap"],
          rows: [
            ["$d_{trans} = \\dfrac{L}{R}$", "<b>Delay.</b> Transmission delay: time to push all $L$ bits of a packet onto a link of rate $R$. 8000 b at 2 Mbps = 4 ms.", "s ($L$ in bits, $R$ in bit/s)", "1500 <b>bytes</b> = 12,000 bits. Mbps is $10^6$, not $2^{20}$."],
            ["$d_{prop} = \\dfrac{d}{s}$", "<b>Delay.</b> Propagation delay: time for one bit to travel the link. $s \\approx 2\\times10^8$ m/s in copper and fibre, $3\\times10^8$ m/s for radio in space. GEO: $2\\times35{,}786$ km / $3\\times10^8$ ≈ 239 ms.", "s ($d$ in m, $s$ in m/s)", "Does not depend on packet size or link rate. The GEO 239 ms is <b>one way</b>; a request plus reply is ≈ 480 ms."],
            ["$d_{nodal} = d_{proc} + d_{queue} + d_{trans} + d_{prop}$", "<b>Delay.</b> Total delay at one hop.", "s", "Idle link: $d_{queue} = 0$. $d_{proc}$ (microseconds) is ignored unless given."],
            ["$d_{e2e} = N\\left(\\dfrac{L}{R} + d_{prop}\\right)$", "<b>Delay.</b> One packet over $N$ equal links (that is, $N-1$ routers), store-and-forward: every router receives the whole packet before forwarding it.", "s", "$N$ links, not $N$ routers. Add $N \\cdot d_{proc}$ if processing is given."],
            ["$T = (N+P-1)\\dfrac{L}{R} + N\\,d_{prop}$", "<b>Delay.</b> $P$ packets sent back to back over $N$ equal-rate links. $N=3$, $P=5$, $L/R = 1$ ms, no propagation: 7 ms.", "s", "Only the first packet pays $N$ transmissions; each later packet adds one $L/R$. Not $N \\cdot P \\cdot L/R$."],
            ["$T = t_{setup} + \\dfrac{F}{R/k} + d_{prop}$", "<b>Circuit switching</b> with TDM/FDM of $k$ slots. 640,000 b over 1.536 Mbps with 24 slots: $R/k = 64$ kbps, 10 s, plus 0.5 s setup = 10.5 s.", "s", "Each circuit gets $R/k$ even when other slots are idle."],
            ["$\\text{throughput} = \\min(R_1, R_2, \\dots, R_N)$", "<b>Throughput.</b> The bottleneck link sets the end-to-end rate; file time $= F/\\min R_i$. Links 10, 2, 5 Mbps: 2 Mbps; a 4 MB file takes $32\\times10^6/2\\times10^6 = 16$ s.", "bit/s", "A link shared fairly by $k$ flows gives each $R/k$: include that in the min."],
            ["$BDP = R \\times RTT$", "<b>Throughput.</b> Bandwidth-delay product: bits in flight needed to fill the pipe. 100 Mbps × 50 ms = $5\\times10^6$ bits = 625,000 B.", "bits", "Some questions use one-way delay ($R \\cdot d_{prop}$). Read which delay is given."],
            ["$I = \\dfrac{L\\,a}{R}$", "<b>Queueing.</b> Traffic intensity, $a$ = average packet arrival rate. $L = 1000$ b, $a = 800$ pkt/s, $R = 1$ Mbps: $I = 0.8$.", "dimensionless", "$I \\to 1$: queueing delay grows very fast; $I > 1$: the queue grows without bound and packets are lost."],
            ["$C = 2B\\log_2 V$", "<b>Nyquist</b> (noiseless channel): $B$ Hz bandwidth, $V$ signal levels. $B = 3$ kHz, $V = 4$: 12 kbps.", "bit/s", "$V$ is the number of levels; $\\log_2 V$ is bits per symbol."],
            ["$C = B\\log_2(1 + SNR)$", "<b>Shannon</b> (noisy channel). $B = 3$ kHz, 30 dB ($SNR = 1000$): $3000\\log_2 1001 \\approx 29.9$ kbps.", "bit/s", "Convert dB first: $SNR = 10^{dB/10}$. Usable rate ≤ min(Nyquist, Shannon)."],
            ["$a = \\dfrac{T_p}{T_t},\\; U = \\dfrac{T_t}{T_t + 2T_p} = \\dfrac{1}{1+2a}$", "<b>Utilisation</b> of stop-and-wait. $T_t = 1$ ms, $T_p = 10$ ms: $a = 10$, $U = 1/21 \\approx 4.76\\%$.", "fraction", "$T_p$ is one-way, $2T_p$ is the RTT. If the ACK's transmission time is given, add it to the denominator."],
            ["$U = \\min\\left(1, \\dfrac{N}{1+2a}\\right)$", "<b>Utilisation</b> of a pipelined protocol (GBN or SR) with window $N$, no loss. $a=10$, $N=7$: $7/21 = 33.3\\%$.", "fraction", "Cap at 1. Effective throughput $= U \\times R$."],
            ["$N \\ge 1 + 2a$", "<b>Window for 100% utilisation.</b> $a = 10$: $N = 21$. Sequence bits: GBN $n = \\lceil\\log_2(N+1)\\rceil = 5$; SR $n = \\lceil\\log_2 N\\rceil + 1 = 6$.", "packets", "Round $1+2a$ up when it is not an integer."],
            ["$W_{GBN} \\le 2^n - 1$", "<b>Window limit</b>, Go-Back-N with $n$-bit sequence numbers (receiver window 1). $n = 3$: 7.", "packets", "Not $2^n$: with $2^n$ the receiver cannot tell a new frame 0 from a retransmitted frame 0."],
            ["$W_{SR} \\le 2^{n-1}$", "<b>Window limit</b>, Selective Repeat (sender window = receiver window). $n = 3$: 4.", "packets", "Equivalent: $W_s + W_r \\le 2^n$."],
            ["$\\text{throughput} \\approx \\dfrac{W}{RTT}$", "<b>TCP</b> window-limited rate. $W = 65{,}535$ B, $RTT = 100$ ms: $65{,}535\\times8/0.1 \\approx 5.24$ Mbps.", "bit/s (×8 if $W$ in bytes)", "The 16-bit window field caps $W$ at 65,535 B unless window scaling is used."],
            ["$\\text{rate} \\approx \\dfrac{\\min(cwnd,\\, rwnd)}{RTT}$", "<b>TCP</b> sender may have at most $\\min(cwnd, rwnd)$ unacknowledged bytes.", "B/s", "rwnd = flow control (receiver buffer); cwnd = congestion control (network)."],
            ["$\\bar{T} = \\dfrac{0.75\\,W}{RTT}$", "<b>TCP AIMD</b> average throughput: cwnd saws between $W/2$ and $W$, average $\\frac{3}{4}W$.", "B/s", "$W$ is cwnd at the moment of loss."],
            ["$cwnd_k = 2^k \\text{ MSS}$", "<b>Slow start</b> from 1 MSS: after $k$ RTTs cwnd $= 2^k$; reaching $W$ takes $\\log_2 W$ RTTs (16 MSS: 4 RTTs).", "MSS", "Capped at ssthresh, then +1 MSS per RTT."],
            ["$ack = seq + \\text{bytes}$", "<b>TCP numbering.</b> Segment seq=101 with 100 bytes is acknowledged by ACK 201 (next expected byte).", "byte numbers", "SYN and FIN each consume 1 sequence number; a pure ACK consumes 0."],
            ["$EstRTT = (1-\\alpha)\\,EstRTT + \\alpha\\,SampleRTT$", "<b>RTT estimation</b> (EWMA), $\\alpha = 1/8$. Est 100 ms, sample 120 ms: $0.875\\times100 + 0.125\\times120 = 102.5$ ms.", "ms", "The new sample gets weight $\\alpha$, the old estimate $1-\\alpha$."],
            ["$DevRTT = (1-\\beta)\\,DevRTT + \\beta\\,|SampleRTT - EstRTT|$", "<b>RTT variation</b>, $\\beta = 1/4$. Old Dev 10, old Est 100, sample 120: $0.75\\times10 + 0.25\\times20 = 12.5$ ms.", "ms", "RFC 6298 updates DevRTT first, with the <b>old</b> estimate. Using the new 102.5 ms gives 11.875 ms. Follow the question's order."],
            ["$Timeout = EstRTT + 4\\,DevRTT$", "<b>Retransmission timeout.</b> $102.5 + 4\\times12.5 = 152.5$ ms. Initial value 1 s (RFC 6298).", "ms", "Karn: ignore RTT samples of retransmitted segments; double the timeout after each expiry."],
            ["$S = G e^{-2G},\\; S_{max} = \\dfrac{1}{2e} \\approx 0.184$", "<b>Pure ALOHA</b> throughput at offered load $G$; maximum at $G = 0.5$.", "frames per frame time", "Vulnerable period is $2T_{fr}$."],
            ["$S = G e^{-G},\\; S_{max} = \\dfrac{1}{e} \\approx 0.368$", "<b>Slotted ALOHA</b>; maximum at $G = 1$.", "frames per slot", "Vulnerable period is $T_{fr}$: half of pure ALOHA's."],
            ["$L_{min} = 2\\,T_p\\,R$", "<b>CSMA/CD</b> minimum frame so the sender still transmits when a collision returns ($T_t \\ge 2T_p$). 10 Mbps, $T_p = 25.6\\,\\mu$s: 512 bits = 64 B.", "bits", "$T_p$ is the one-way propagation delay of the longest path."],
            ["$K \\in \\{0, 1, \\dots, 2^{\\min(m,10)} - 1\\}$", "<b>Binary exponential backoff</b>: after the $m$-th collision wait $K \\times 512$ bit times.", "bit times", "Ethernet gives up after 16 attempts."],
            ["$\\dfrac{n(n-1)}{2}$ links, $n-1$ ports each", "<b>Full mesh</b> of $n$ devices. 10 → 45, 100 → 4950. A star needs $n$ links.", "links", "This growth is why full mesh scales poorly (slide WB-L04 p28 says “Excellent”: wrong)."],
            ["$2^{32-n} - 2$", "<b>Usable hosts</b> in a /n network (minus network and broadcast). /24: 254; /26: 62.", "addresses", "/31 point-to-point links use both addresses (RFC 3021); /32 is a single host route."],
            ["$2^{32-n} - 5$", "<b>AWS usable</b>: AWS reserves .0, .1 (VPC router), .2 (DNS), .3 (future) and the last address. /24: 251; /20: 4091; /28: 11.", "addresses", "Use −5 only when the question is about an AWS subnet."],
            ["$2^k$ subnets, $2^{h-k} - 2$ hosts each", "<b>Subnetting</b>: borrow $k$ of the $h$ host bits. /24 + 2 bits: 4 × /26 with 62 hosts each.", "subnets, hosts", "Modern networks use all $2^k$ subnets (the old “$2^k - 2$” rule is obsolete)."],
            ["$\\text{block} = 256 - \\text{mask octet}$", "<b>Magic number</b>: subnet boundaries are multiples of the block in the interesting octet. 255.255.255.192: block 64.", "addresses", "Use the octet where the mask is neither 255 nor 0."],
            ["$n = 32 - \\lceil \\log_2 (H + 2) \\rceil$", "<b>Sizing</b>: shortest prefix for $H$ hosts. 500 hosts: $\\lceil\\log_2 502\\rceil = 9$, so /23 (510 usable).", "prefix length", "Remember the +2. For AWS use $H + 5$."],
            ["$\\text{offset} = \\dfrac{\\text{byte position}}{8}$", "<b>IPv4 fragmentation.</b> Data per fragment $= \\lfloor (MTU - 20)/8 \\rfloor \\times 8$. 4000 B datagram (3980 B data), MTU 1500: data 1480, 1480, 1020; offsets 0, 185, 370; MF 1, 1, 0.", "8-byte units", "Each fragment's Total Length includes its own 20-byte header: 1500, 1500, 1040."],
            ["$\\text{header} = IHL \\times 4$", "<b>Header length</b> fields count 32-bit words. IHL 5 → 20 B, maximum 15 → 60 B. TCP: data offset × 4, also 20 to 60 B.", "bytes", "The Total Length field counts bytes, not words."],
            ["$\\text{UDP length} = 8 + \\text{data}$", "<b>UDP</b> Length field includes the 8-byte header. 52 B of data: Length 60.", "bytes", "IPv4 Total Length = IP header + UDP header + data = 80 here."],
            ["$T = (M+1)\\cdot 2\\,RTT$", "<b>HTTP non-persistent</b>, serial: $2\\,RTT + t_{trans}$ per object (TCP setup + request/response). Base + 10 objects: 22 RTT.", "RTT", "Add DNS lookup time and transmission times if the question gives them."],
            ["$T = 2\\,RTT + \\lceil M/k \\rceil \\cdot 2\\,RTT$", "<b>HTTP non-persistent</b>, $k$ parallel connections. $M = 10$, $k = 5$: 6 RTT.", "RTT", "The base page must arrive before the objects are known."],
            ["$T = 2\\,RTT + M \\cdot RTT$", "<b>HTTP persistent, no pipelining</b>: one RTT per object after the base. $M = 10$: 12 RTT.", "RTT", "Persistence saves the TCP handshake, not the request RTT."],
            ["$T = 2\\,RTT + RTT = 3\\,RTT$", "<b>HTTP persistent with pipelining</b>: all $M$ requests go out together.", "RTT", "Ignores transmission time; with large objects add $M\\,t_{trans}$."],
            ["$+1\\,RTT$ (TCP), $+2\\,RTT$ (TLS 1.2), $+1\\,RTT$ (TLS 1.3)", "<b>HTTPS setup</b> before the first request. TCP + TLS 1.3 = 2 RTT; QUIC (HTTP/3) merges transport and TLS into 1 RTT; resumption can use 0-RTT.", "RTT", "TLS 1.2 full handshake is 2 RTT; TLS 1.3 is 1 RTT."],
            ["$T_{DNS} = RTT_{h} + RTT_{root} + RTT_{TLD} + RTT_{auth}$", "<b>DNS iterative lookup</b> by the local resolver, nothing cached. $RTT_h$ = host ↔ local resolver.", "ms", "Skip every server whose answer is already cached (a cached TLD skips the root)."],
            ["$T_{avg} = h\\,T_{hit} + (1-h)\\,T_{miss}$", "<b>Web cache.</b> $h = 0.4$, $T_{hit} = 0.01$ s, $T_{miss} = 2.01$ s: $0.004 + 1.206 = 1.21$ s.", "s", "Access-link traffic falls to $(1-h)$ of the original."],
            ["$A = 1 - (1-p)^n$", "<b>Availability</b> of $n$ independent replicas in parallel. $p = 0.99$, $n = 2$: 0.9999; $n = 3$: 0.999999.", "probability", "Components in series multiply: $A = p^n$."],
            ["$\\dfrac{n(n-1)}{2}$ vs $2n$", "<b>Key counts</b> for $n$ users: symmetric (one key per pair) vs asymmetric (one key pair per user). $n = 100$: 4950 vs 200.", "keys", "“$n$ key pairs” = $2n$ keys."],
            ["$\\left\\lceil \\dfrac{\\text{load}}{\\text{capacity}} \\right\\rceil$", "<b>Auto Scaling</b> instances needed. 50,000 users at 500 per instance: 100. Health-check detection time $=$ interval × unhealthy threshold: 30 s × 2 = 60 s.", "instances, s", "Always round up."],
            ["$2^{16} = 65{,}536$", "<b>Port numbers</b> per IP per transport protocol (0 to 65535).", "ports", "Well-known ports are 0–1023, not 0–1024."],
            ["$2^r \\ge m + r + 1$", "<b>Hamming</b> check bits $r$ for $m$ data bits. $m = 4$: $r = 3$ (Hamming (7,4)); $m = 7$: $r = 4$.", "bits", "Check bits sit at positions 1, 2, 4, 8."],
            ["$\\text{append } r = \\deg G(x) \\text{ zeros}$", "<b>CRC</b>: generator 1011 ($x^3+x+1$) has degree 3, so append 3 zeros before dividing.", "bits", "Degree = number of generator bits − 1."],
            ["$C = (P + k) \\bmod 26$", "<b>Caesar cipher</b> with shift $k$; decrypt with $(C - k) \\bmod 26$. Shift 2: “Hello” → “Jgnnq”.", "letters", "Only 25 useful keys: brute force is trivial."],
            ["$\\text{overhead} = \\dfrac{\\text{headers}}{\\text{headers} + \\text{payload}}$", "<b>Encapsulation overhead.</b> 100 B payload + TCP 20 + IP 20 + Ethernet 18 (14 header + 4 FCS) = 58/158 ≈ 36.7%.", "fraction", "Ethernet adds 18 B including the FCS (26 B if preamble and SFD are counted)."]
          ],
          caption: "All formulas. Topics in order: delay, throughput, queueing, channel capacity, stop-and-wait and sliding windows, TCP, RTT estimation, MAC, topology, addressing, IP, HTTP, DNS, caching, availability, cryptography, scaling, error detection." },
        { type: "derivation", title: "Why $P$ packets over $N$ links take $(N+P-1)\\,L/R$",
          steps: [
            { tex: "t_{1} = N\\,\\frac{L}{R}", why: "The first packet is fully received and retransmitted by every one of the $N$ links in turn (store-and-forward)." },
            { tex: "t_{k} = t_{k-1} + \\frac{L}{R}", why: "The source sends packets back to back, so each packet leaves one $L/R$ after the previous one; with equal link rates no packet ever waits behind another." },
            { tex: "t_{P} = N\\,\\frac{L}{R} + (P-1)\\,\\frac{L}{R}", why: "Apply the step $P-1$ times after the first packet." },
            { tex: "t_{P} = (N+P-1)\\,\\frac{L}{R} = (3+5-1)\\times 1\\text{ ms} = 7\\text{ ms}", why: "Factor out $L/R$; the example uses $N = 3$, $P = 5$, $L/R = 1$ ms (add $N\\,d_{prop}$ when propagation is not zero)." } ] },
        { type: "derivation", title: "Stop-and-wait and sliding-window utilisation",
          steps: [
            { tex: "T_{cycle} = T_t + 2T_p", why: "The sender transmits for $T_t$; the last bit arrives after $T_p$; the ACK (transmission time ignored) returns after another $T_p$." },
            { tex: "U = \\frac{T_t}{T_t + 2T_p}", why: "Useful time divided by cycle time." },
            { tex: "U = \\frac{1}{1 + 2a},\\; a = \\frac{T_p}{T_t}", why: "Divide top and bottom by $T_t$." },
            { tex: "U_N = \\min\\left(1, \\frac{N\\,T_t}{T_t + 2T_p}\\right) = \\min\\left(1, \\frac{N}{1+2a}\\right)", why: "A window of $N$ frames sends $N\\,T_t$ of useful data per cycle, but utilisation cannot exceed 1." },
            { tex: "U = \\frac{1}{1 + 2\\times10} = \\frac{1}{21} \\approx 0.0476", why: "Example: $T_t = 1$ ms, $T_p = 10$ ms." } ] },
        { type: "derivation", title: "Why GBN allows $2^n - 1$ but SR only $2^{n-1}$",
          steps: [
            { tex: "\\text{sequence numbers} = 0, 1, \\dots, 2^n - 1", why: "$n$ bits give $2^n$ distinct numbers, reused modulo $2^n$." },
            { tex: "\\text{worst case: all } W \\text{ frames arrive, all } W \\text{ ACKs are lost}", why: "The receiver's window has moved forward by $W$, but the sender times out and retransmits the old $W$ frames." },
            { tex: "W_s + W_r \\le 2^n", why: "The old frames' numbers must not fall inside the receiver's new window, otherwise a duplicate is accepted as new data." },
            { tex: "\\text{GBN: } W_r = 1 \\Rightarrow W_s \\le 2^n - 1", why: "A Go-Back-N receiver accepts only the next in-order frame." },
            { tex: "\\text{SR: } W_s = W_r = W \\Rightarrow 2W \\le 2^n \\Rightarrow W \\le 2^{n-1}", why: "Selective Repeat uses equal windows. $n = 3$: GBN 7, SR 4." } ] }
      ]
    },

    // ------------------------------------------------------------------ 2
    {
      title: "2. Header diagrams with bit allocations",
      blocks: [
        { type: "cheat", title: "Header sizes to memorise",
          items: [
            "IPv4: 20 B minimum, 60 B maximum (IHL 5 to 15). IPv6: 40 B fixed.",
            "TCP: 20 B minimum, 60 B maximum (data offset 5 to 15). UDP: 8 B fixed.",
            "Ethernet II: 14 B header + 4 B FCS = 18 B; payload 46 to 1500 B; frame 64 to 1518 B.",
            "ICMP echo: 8 B header. ARP for Ethernet/IPv4: 28 B. DNS header: 12 B. UDP pseudo-header (IPv4): 12 B."
          ] },
        { type: "packet", title: "IPv4 header (RFC 791), 20 bytes without options", width: 32,
          fields: [
            { name: "Version", bits: 4, note: "4" },
            { name: "IHL", bits: 4, note: "header length in 32-bit words; 5 = 20 bytes" },
            { name: "DSCP", bits: 6, note: "differentiated services (was the Type of Service byte)" },
            { name: "ECN", bits: 2, note: "explicit congestion notification" },
            { name: "Total Length", bits: 16, note: "header + data in bytes, maximum 65,535" },
            { name: "Identification", bits: 16, note: "same value in every fragment of one datagram" },
            { name: "Flags", bits: 3, note: "bit 0 reserved, DF (don't fragment), MF (more fragments)" },
            { name: "Fragment Offset", bits: 13, note: "in 8-byte units" },
            { name: "TTL", bits: 8, note: "decremented by every router; 0 → discard and send ICMP Time Exceeded" },
            { name: "Protocol", bits: 8, note: "1 ICMP, 6 TCP, 17 UDP" },
            { name: "Header Checksum", bits: 16, note: "1's-complement sum of the header only; recomputed at each hop because TTL changes" },
            { name: "Source Address", bits: 32 },
            { name: "Destination Address", bits: 32 }
          ],
          caption: "13 fields (14 with Options). Example header: 4500 0073 0000 4000 4011 b861 c0a8 0001 c0a8 00c7 (checksum 0xB861, verified by snippet #11)." },
        { type: "packet", title: "IPv6 header (RFC 8200), 40 bytes fixed", width: 32,
          fields: [
            { name: "Version", bits: 4, note: "6" },
            { name: "Traffic Class", bits: 8, note: "DSCP + ECN, as in IPv4" },
            { name: "Flow Label", bits: 20, note: "identifies packets of one flow" },
            { name: "Payload Length", bits: 16, note: "bytes after the 40-byte header (extension headers + data)" },
            { name: "Next Header", bits: 8, note: "like IPv4 Protocol: 6 TCP, 17 UDP, 58 ICMPv6, or an extension header" },
            { name: "Hop Limit", bits: 8, note: "like IPv4 TTL" },
            { name: "Source Address", bits: 128 },
            { name: "Destination Address", bits: 128 }
          ],
          caption: "No header checksum, no fragmentation fields (only the source fragments, using an extension header), no options (extension headers instead)." },
        { type: "packet", title: "TCP header (RFC 9293), 20 bytes without options", width: 32,
          fields: [
            { name: "Source Port", bits: 16 },
            { name: "Destination Port", bits: 16 },
            { name: "Sequence Number", bits: 32, note: "number of the first data byte in this segment (ISN on a SYN)" },
            { name: "Acknowledgment Number", bits: 32, note: "next byte expected; valid when ACK = 1" },
            { name: "Data Offset", bits: 4, note: "header length in 32-bit words; 5 = 20 bytes" },
            { name: "Reserved", bits: 4, note: "0" },
            { name: "Flags", bits: 8, note: "CWR ECE URG ACK PSH RST SYN FIN (see the flag byte below)" },
            { name: "Window", bits: 16, note: "receive window rwnd in bytes, maximum 65,535 without scaling" },
            { name: "Checksum", bits: 16, note: "over pseudo-header + header + data, mandatory" },
            { name: "Urgent Pointer", bits: 16, note: "valid when URG = 1" }
          ],
          caption: "Options (MSS, window scale, SACK, timestamps) follow when Data Offset > 5." },
        { type: "packet", title: "TCP flag byte (byte 13 of the header)", width: 8,
          fields: [
            { name: "CWR", bits: 1, note: "0x80: congestion window reduced" },
            { name: "ECE", bits: 1, note: "0x40: ECN echo" },
            { name: "URG", bits: 1, note: "0x20" },
            { name: "ACK", bits: 1, note: "0x10" },
            { name: "PSH", bits: 1, note: "0x08" },
            { name: "RST", bits: 1, note: "0x04" },
            { name: "SYN", bits: 1, note: "0x02" },
            { name: "FIN", bits: 1, note: "0x01" }
          ],
          caption: "SYN = 0x02, SYN-ACK = 0x12, ACK = 0x10, FIN-ACK = 0x11, RST-ACK = 0x14, PSH-ACK = 0x18." },
        { type: "packet", title: "UDP header (RFC 768), 8 bytes", width: 32,
          fields: [
            { name: "Source Port", bits: 16, note: "optional (0 if unused)" },
            { name: "Destination Port", bits: 16 },
            { name: "Length", bits: 16, note: "header + data in bytes, minimum 8" },
            { name: "Checksum", bits: 16, note: "optional in IPv4 (0 = none), mandatory in IPv6" }
          ] },
        { type: "packet", title: "UDP/TCP pseudo-header for IPv4 (used only in the checksum)", width: 32,
          fields: [
            { name: "Source IP Address", bits: 32 },
            { name: "Destination IP Address", bits: 32 },
            { name: "Zero", bits: 8 },
            { name: "Protocol", bits: 8, note: "17 for UDP, 6 for TCP" },
            { name: "UDP/TCP Length", bits: 16, note: "segment length in bytes (header + data)" }
          ],
          caption: "12 bytes, never transmitted. Lets the receiver detect a segment delivered to the wrong host or protocol." },
        { type: "packet", title: "Ethernet II frame (payload drawn short)", width: 16,
          fields: [
            { name: "Destination MAC", bits: 48, note: "6 bytes; ff:ff:ff:ff:ff:ff = broadcast" },
            { name: "Source MAC", bits: 48, note: "6 bytes" },
            { name: "EtherType", bits: 16, note: "0x0800 IPv4, 0x0806 ARP, 0x86DD IPv6, 0x8100 VLAN tag" },
            { name: "Payload (46–1500 B)", bits: 32, note: "really 46 to 1500 bytes; padded to 46 if shorter" },
            { name: "FCS (CRC-32)", bits: 32, note: "4 bytes, covers addresses, type and payload" }
          ],
          caption: "The 7-byte preamble and 1-byte start-frame delimiter are added by the physical layer before the destination address." },
        { type: "packet", title: "ICMP echo request / reply (RFC 792)", width: 32,
          fields: [
            { name: "Type", bits: 8, note: "8 = echo request, 0 = echo reply, 11 = time exceeded, 3 = destination unreachable" },
            { name: "Code", bits: 8, note: "0 for echo" },
            { name: "Checksum", bits: 16, note: "over the ICMP header + data" },
            { name: "Identifier", bits: 16, note: "matches replies to the ping process" },
            { name: "Sequence Number", bits: 16, note: "increments per echo request" }
          ],
          caption: "Carried directly in IP with Protocol = 1 (no ports)." },
        { type: "packet", title: "ARP packet for Ethernet + IPv4 (RFC 826), 28 bytes", width: 32,
          fields: [
            { name: "Hardware Type", bits: 16, note: "1 = Ethernet" },
            { name: "Protocol Type", bits: 16, note: "0x0800 = IPv4" },
            { name: "HLEN", bits: 8, note: "6" },
            { name: "PLEN", bits: 8, note: "4" },
            { name: "Operation", bits: 16, note: "1 = request, 2 = reply" },
            { name: "Sender MAC", bits: 48 },
            { name: "Sender IP", bits: 32 },
            { name: "Target MAC", bits: 48, note: "all zeros in a request" },
            { name: "Target IP", bits: 32 }
          ],
          caption: "The request is sent to the broadcast MAC; the reply is unicast. EtherType 0x0806." },
        { type: "packet", title: "DNS message header (RFC 1035), 12 bytes", width: 32,
          fields: [
            { name: "ID", bits: 16, note: "copied into the response to match it to the query" },
            { name: "QR", bits: 1, note: "0 query, 1 response" },
            { name: "Opcode", bits: 4, note: "0 = standard query" },
            { name: "AA", bits: 1, note: "authoritative answer" },
            { name: "TC", bits: 1, note: "truncated (retry over TCP)" },
            { name: "RD", bits: 1, note: "recursion desired" },
            { name: "RA", bits: 1, note: "recursion available" },
            { name: "Z", bits: 3, note: "reserved (later used for AD/CD by DNSSEC)" },
            { name: "RCODE", bits: 4, note: "0 no error, 3 NXDOMAIN" },
            { name: "QDCOUNT", bits: 16, note: "number of questions" },
            { name: "ANCOUNT", bits: 16, note: "number of answer records" },
            { name: "NSCOUNT", bits: 16, note: "authority records" },
            { name: "ARCOUNT", bits: 16, note: "additional records" }
          ],
          caption: "A standard recursive query has flags 0x0100 (only RD set). DNS uses UDP/TCP port 53." }
      ]
    },

    // ------------------------------------------------------------------ 3
    {
      title: "3. Port numbers, protocol numbers and EtherTypes",
      blocks: [
        { type: "table",
          head: ["Port", "Protocol", "Transport", "Remember"],
          rows: [
            ["20", "FTP data", "TCP", "Active-mode data channel"],
            ["21", "FTP control", "TCP", "Commands (USER, PASS, RETR)"],
            ["22", "SSH (and SFTP, SCP)", "TCP", "Encrypted remote login"],
            ["23", "Telnet", "TCP", "Plain-text remote login"],
            ["25", "SMTP", "TCP", "Server-to-server mail relay"],
            ["53", "DNS", "UDP (and TCP)", "TCP for zone transfers and large answers"],
            ["67", "DHCP server (BOOTP)", "UDP", "Client sends to 255.255.255.255:67"],
            ["68", "DHCP client", "UDP", "Server replies to port 68"],
            ["69", "TFTP", "UDP", "Trivial file transfer, no login"],
            ["80", "HTTP", "TCP", "HTTP/1.1 and HTTP/2 cleartext"],
            ["110", "POP3", "TCP", "Download mail"],
            ["123", "NTP", "UDP", "Clock synchronisation"],
            ["143", "IMAP", "TCP", "Mail stays on the server, synced"],
            ["161", "SNMP", "UDP", "Agent queries (traps go to 162)"],
            ["443", "HTTPS", "TCP (UDP for HTTP/3)", "HTTP over TLS; QUIC also uses UDP 443"],
            ["465", "SMTPS (submission over implicit TLS)", "TCP", "TLS from the first byte"],
            ["587", "SMTP submission", "TCP", "Client → mail server, STARTTLS + authentication"],
            ["993", "IMAPS", "TCP", "IMAP over TLS"],
            ["995", "POP3S", "TCP", "POP3 over TLS"],
            ["3306", "MySQL", "TCP", "Database: keep in a private subnet"],
            ["5432", "PostgreSQL", "TCP", "Database: keep in a private subnet"],
            ["3389", "RDP", "TCP", "Windows Remote Desktop"]
          ],
          caption: "Secure versions: 443 (HTTP), 993 (IMAP), 995 (POP3), 465/587 (SMTP), 22 (SSH replaces 23)." },
        { type: "table",
          head: ["Range", "Name", "Used for"],
          rows: [
            ["0–1023", "Well-known (system) ports", "Standard servers; binding needs root/administrator on most systems"],
            ["1024–49151", "Registered (user) ports", "Applications registered with IANA, such as 3306 and 3389"],
            ["49152–65535", "Dynamic / private / ephemeral", "Client source ports chosen by the OS (Linux uses 32768–60999 by default)"]
          ],
          caption: "Total $2^{16} = 65{,}536$ ports per IP address per transport protocol." },
        { type: "table",
          head: ["IP protocol number", "Protocol"],
          rows: [
            ["1", "ICMP"], ["2", "IGMP"], ["6", "TCP"], ["17", "UDP"], ["58", "ICMPv6"], ["89", "OSPF"]
          ],
          caption: "Value of the IPv4 Protocol / IPv6 Next Header field." },
        { type: "table",
          head: ["EtherType", "Payload"],
          rows: [
            ["0x0800", "IPv4"], ["0x0806", "ARP"], ["0x86DD", "IPv6"], ["0x8100", "802.1Q VLAN tag (4 extra bytes)"], ["0x88CC", "LLDP"],
            ["≤ 0x05DC (1500)", "Not a type: an IEEE 802.3 length field"]
          ],
          caption: "Ethernet II type field. Values of 0x0600 (1536) and above are types." }
      ]
    },

    // ------------------------------------------------------------------ 4
    {
      title: "4. Protocol comparison tables",
      blocks: [
        { type: "table", head: ["", "TCP", "UDP"],
          rows: [
            ["Connection", "Connection-oriented (3-way handshake, 4-way close)", "Connectionless"],
            ["Reliability", "ACKs, retransmission, checksum", "Checksum only; lost data is not resent"],
            ["Ordering", "In-order byte stream", "No ordering; each datagram stands alone"],
            ["Message boundaries", "None (byte stream): the application must frame", "Preserved: one sendto = one datagram"],
            ["Flow / congestion control", "Yes (rwnd / cwnd)", "No"],
            ["Header", "20–60 B", "8 B"],
            ["PDU", "Segment", "Segment (Kurose) or user datagram"],
            ["Broadcast / multicast", "No", "Yes"],
            ["Uses", "HTTP/1.1, HTTP/2, SMTP, SSH, FTP", "DNS, DHCP, VoIP, video, gaming, SNMP, TFTP, QUIC/HTTP-3"],
            ["Python", "SOCK_STREAM: listen, accept, connect, send/recv", "SOCK_DGRAM: sendto/recvfrom"]
          ], caption: "TCP vs UDP" },
        { type: "table", head: ["", "Stop-and-wait", "Go-Back-N", "Selective Repeat"],
          rows: [
            ["Sender window", "1", "$\\le 2^n - 1$", "$\\le 2^{n-1}$"],
            ["Receiver window", "1", "1", "Same as sender"],
            ["ACKs", "Per frame", "Cumulative", "Individual (selective)"],
            ["Out-of-order frame", "n/a", "Discarded, last in-order ACK repeated", "Buffered"],
            ["On loss / timeout resend", "That frame", "That frame and every frame after it", "Only the lost frame"],
            ["Timers", "1", "1 (oldest unACKed frame)", "1 per frame"],
            ["Utilisation", "$\\frac{1}{1+2a}$", "$\\min\\left(1,\\frac{N}{1+2a}\\right)$", "$\\min\\left(1,\\frac{N}{1+2a}\\right)$"],
            ["Complexity", "Lowest", "Simple receiver", "Complex receiver (buffer + reordering)"]
          ], caption: "Stop-and-wait vs GBN vs SR ($n$ = sequence-number bits)" },
        { type: "table", head: ["", "Distance vector", "Link state"],
          rows: [
            ["What is sent", "Own distance vector, to neighbours only", "Link-state advertisements, flooded to every router"],
            ["Algorithm", "Bellman-Ford: $D_x(y) = \\min_v\\{c(x,v) + D_v(y)\\}$", "Dijkstra on the full topology"],
            ["Knowledge", "Local (neighbours' vectors)", "Global (whole map)"],
            ["Convergence", "Slow; count-to-infinity (fixes: split horizon, poison reverse)", "Fast; can oscillate with load-based costs"],
            ["Example", "RIP: hop count, 16 = infinity, updates every 30 s, UDP 520", "OSPF: cost metric, areas, IP protocol 89"],
            ["Messages", "Small, to neighbours", "$O(nE)$ flooding"]
          ], caption: "Distance vector vs link state" },
        { type: "table", head: ["", "IPv4", "IPv6"],
          rows: [
            ["Address", "32 bits, dotted decimal (192.168.1.10)", "128 bits, hex groups (2001:db8::1)"],
            ["Header", "20–60 B, variable, 13 fields + options", "40 B fixed, 8 fields"],
            ["Checksum", "Yes (header)", "No"],
            ["Fragmentation", "Routers and source", "Source only (path MTU discovery)"],
            ["Options", "In the header", "Extension headers"],
            ["Broadcast", "Yes", "No (multicast and anycast)"],
            ["Address resolution", "ARP", "Neighbor Discovery (ICMPv6)"],
            ["Renamed fields", "TTL, Protocol, Total Length", "Hop Limit, Next Header, Payload Length"],
            ["Configuration", "DHCP or static", "SLAAC, DHCPv6 or static"],
            ["Minimum MTU", "Every host accepts 576 B", "Every link carries 1280 B"]
          ], caption: "IPv4 vs IPv6" },
        { type: "table", head: ["", "HTTP/1.0", "HTTP/1.1", "HTTP/2", "HTTP/3"],
          rows: [
            ["Connections", "Non-persistent (new TCP per object)", "Persistent (keep-alive) by default; browsers open about 6", "One TCP connection, many streams", "One QUIC connection, many streams"],
            ["Host header", "Optional", "Mandatory", "<code>:authority</code> pseudo-header", "<code>:authority</code>"],
            ["Format", "Text", "Text", "Binary frames", "Binary frames"],
            ["Head-of-line blocking", "Per connection", "Yes (pipelining rarely used)", "Fixed at HTTP level, still at TCP level", "None across streams (per-stream loss recovery)"],
            ["Header compression", "No", "No", "HPACK", "QPACK"],
            ["Transport", "TCP", "TCP", "TCP (+TLS in browsers)", "QUIC over UDP (TLS 1.3 built in)"],
            ["Setup before first request", "1 RTT (TCP)", "1 RTT (TCP), +TLS", "TCP + TLS: 2–3 RTT", "1 RTT, 0-RTT on resumption"],
            ["Spec", "RFC 1945", "RFC 9112", "RFC 9113", "RFC 9114"]
          ], caption: "HTTP versions" },
        { type: "table", head: ["", "NLB (Network Load Balancer)", "ALB (Application Load Balancer)"],
          rows: [
            ["OSI layer", "4 (transport)", "7 (application)"],
            ["Listeners", "TCP, UDP, TLS", "HTTP, HTTPS only"],
            ["Routing decision", "Flow hash of the 4/5-tuple", "Host, path (/api/*), headers, query string, method"],
            ["Static IP", "Yes, one per AZ (Elastic IP possible)", "No: use its DNS name"],
            ["Client source IP", "Preserved for instance targets", "Replaced; original in X-Forwarded-For"],
            ["TLS termination", "Optional (TLS listener)", "Yes (HTTPS listener with an ACM certificate)"],
            ["Performance", "Millions of requests per second, very low latency", "Higher latency (parses HTTP)"],
            ["Typical use", "Gaming, IoT, non-HTTP protocols, static IP needs", "Web apps, microservices, path-based routing"]
          ], caption: "NLB vs ALB" },
        { type: "table", head: ["", "SMTP", "POP3", "IMAP"],
          rows: [
            ["Job", "Send / relay (push)", "Retrieve (pull)", "Retrieve and manage (pull)"],
            ["Ports", "25 (relay), 587 (submission), 465 (implicit TLS)", "110, 995 (TLS)", "143, 993 (TLS)"],
            ["Mail after reading", "n/a", "Downloaded and usually deleted from the server", "Stays on the server"],
            ["Folders / multi-device", "n/a", "No server folders; poor multi-device", "Server folders; synced across devices"],
            ["Transport", "TCP", "TCP", "TCP"]
          ], caption: "SMTP vs POP3 vs IMAP (all application layer)" },
        { type: "table", head: ["", "Symmetric", "Asymmetric (public key)"],
          rows: [
            ["Keys", "One shared secret key", "Public key + private key per user"],
            ["Keys for $n$ users", "$\\frac{n(n-1)}{2}$", "$2n$"],
            ["Speed", "Fast", "Much slower"],
            ["Examples", "AES, ChaCha20", "RSA, ECDHE (key exchange), ECDSA (signatures)"],
            ["Use in TLS", "Bulk data encryption with the session key", "Key exchange and certificate signatures"],
            ["Main problem", "Distributing the key securely", "Trusting that a public key is really theirs (certificates, CAs)"]
          ], caption: "Symmetric vs asymmetric cryptography" },
        { type: "table", head: ["", "Recursive", "Iterative"],
          rows: [
            ["Who does the work", "The queried server finds the final answer", "The querier contacts each server itself"],
            ["Reply", "The final answer (or an error)", "A referral to the next server"],
            ["Typical use", "Host (stub resolver) → local resolver", "Local resolver → root → TLD → authoritative"],
            ["Load", "On the recursive resolver", "Spread; root and TLD servers stay simple"],
            ["Flag", "RD = 1 in the query", "RD ignored by root and TLD servers"]
          ], caption: "Recursive vs iterative DNS" },
        { type: "table", head: ["", "Hub", "Switch", "Router"],
          rows: [
            ["Layer", "1 (physical)", "2 (data link)", "3 (network)"],
            ["Looks at", "Nothing: repeats bits", "MAC address (learned MAC table)", "IP address (routing table, longest-prefix match)"],
            ["Forwarding", "Out of every other port", "Filter, forward, or flood unknown/broadcast", "Out of the best route's interface"],
            ["Collision domains", "1 for all ports", "1 per port", "1 per interface"],
            ["Broadcast domains", "1", "1 (unless VLANs)", "1 per interface (stops broadcasts)"],
            ["Duplex", "Half", "Full", "Full"]
          ], caption: "Hub vs switch vs router" },
        { type: "table", head: ["OSI layer", "5-layer (Kurose)", "4-layer TCP/IP", "PDU", "Examples", "Device"],
          rows: [
            ["7 Application", "Application", "Application", "Message (data)", "HTTP, DNS, SMTP, IMAP, POP3, FTP", "Host, ALB"],
            ["6 Presentation", "Application", "Application", "Data", "Encoding, compression, encryption (JPEG, MPEG, TLS)", "Host"],
            ["5 Session", "Application", "Application", "Data", "Dialog control, RPC, sockets", "Host"],
            ["4 Transport", "Transport", "Transport", "Segment (UDP: segment or user datagram)", "TCP, UDP, QUIC", "Host, NLB"],
            ["3 Network", "Network", "Internet", "Datagram (packet)", "IP, ICMP, IPsec, OSPF, BGP", "Router"],
            ["2 Data link", "Link", "Network access", "Frame", "Ethernet, Wi-Fi, ARP, VLAN, STP", "Switch, bridge, NIC"],
            ["1 Physical", "Physical", "Network access", "Bits", "Copper, fibre, radio", "Hub, repeater"]
          ], caption: "OSI vs TCP/IP. Mnemonic top-down: All People Seem To Need Data Processing." },
        { type: "table", head: ["Event", "TCP Tahoe", "TCP Reno"],
          rows: [
            ["Timeout", "ssthresh = cwnd/2, cwnd = 1 MSS, slow start", "ssthresh = cwnd/2, cwnd = 1 MSS, slow start"],
            ["3 duplicate ACKs", "Fast retransmit; ssthresh = cwnd/2, cwnd = 1 MSS, slow start", "Fast retransmit + fast recovery; ssthresh = cwnd/2, cwnd = ssthresh (+3 MSS in RFC 5681), then congestion avoidance"],
            ["Fast recovery", "No", "Yes"],
            ["Sawtooth", "Drops to 1 on every loss", "Halves on 3 dup ACKs (AIMD)"]
          ], caption: "Tahoe vs Reno" },
        { type: "table", head: ["", "Public subnet", "Private subnet"],
          rows: [
            ["Default route", "0.0.0.0/0 → Internet Gateway (igw-)", "0.0.0.0/0 → NAT Gateway (nat-), or no default route"],
            ["Instance addresses", "Private IP + public or Elastic IP", "Private IP only"],
            ["Reachable from the Internet", "Yes, if the security group allows it", "No"],
            ["Typical contents", "ALB, NAT gateway, bastion host", "App servers, databases"]
          ], caption: "AWS public vs private subnet: the route table decides, not the subnet's name" },
        { type: "table", head: ["", "NAT (one-to-one)", "PAT (NAPT, NAT overload)"],
          rows: [
            ["Mapping", "1 inside IP ↔ 1 public IP", "Many inside IP:port ↔ 1 public IP with unique ports"],
            ["Rewrites", "IP address", "IP address and port"],
            ["Public IPs needed", "One per simultaneously active host", "One for all hosts"],
            ["Inbound connections", "Possible with static NAT", "Only for existing mappings or configured port forwards"],
            ["Cisco", "<code>ip nat inside source static</code>", "<code>ip nat inside source list 1 interface g0/0 overload</code>"]
          ], caption: "NAT vs PAT" },
        { type: "table", head: ["", "Internet Gateway", "NAT Gateway"],
          rows: [
            ["Direction", "Inbound and outbound", "Outbound-initiated only (replies come back)"],
            ["Where", "Attached to the VPC (one per VPC)", "Placed in a public subnet, one per AZ for HA"],
            ["Addressing", "1:1 NAT for instances that have public IPs", "PAT: many private IPs → its Elastic IP"],
            ["Route target", "igw-xxxx in the public route table", "nat-xxxx in the private route table"],
            ["Cost and scaling", "No charge; horizontally scaled by AWS", "Hourly + per-GB charge"]
          ], caption: "Internet Gateway vs NAT Gateway" }
      ]
    },

    // ------------------------------------------------------------------ 5
    {
      title: "5. Handshakes at a glance",
      blocks: [
        { type: "seq", left: "Client", right: "Server (port 443)",
          caption: "TCP 3-way handshake with the slide's ISNs 100 and 350, followed by 100 bytes of data. SYN consumes one sequence number, so data starts at 101.",
          events: [
            { from: "L", label: "SYN seq=100", note: "SYN_SENT" },
            { from: "R", label: "SYN-ACK seq=350 ack=101", note: "SYN_RCVD" },
            { from: "L", label: "ACK seq=101 ack=351", note: "ESTABLISHED" },
            { from: "L", label: "DATA seq=101 (100 bytes)" },
            { from: "R", label: "ACK ack=201", note: "next byte expected" }
          ] },
        { type: "seq", left: "Client (active close)", right: "Server",
          caption: "TCP 4-way teardown. After its ACK of the server's FIN the client waits in TIME_WAIT for 2·MSL so a lost final ACK can be resent and old duplicates die out. The client is in FIN_WAIT_2 between the server's ACK and FIN.",
          events: [
            { from: "L", label: "FIN seq=501 ack=901", note: "FIN_WAIT_1" },
            { from: "R", label: "ACK ack=502", note: "CLOSE_WAIT" },
            { from: "L", label: "", gap: true, note: "half-close: the server may still send data" },
            { from: "R", label: "FIN seq=901 ack=502", note: "LAST_ACK" },
            { from: "L", label: "ACK seq=502 ack=902", note: "TIME_WAIT" },
            { from: "L", label: "", gap: true, note: "client waits 2·MSL, then CLOSED" }
          ] },
        { type: "seq", left: "Client", right: "Server",
          caption: "TLS 1.3 full handshake after the TCP handshake: 1 RTT. Braces mark messages encrypted with the handshake keys. Total before the first HTTP byte: 1 RTT (TCP) + 1 RTT (TLS 1.3) = 2 RTT; TLS 1.2 needs 2 RTT for TLS alone.",
          events: [
            { from: "L", label: "ClientHello: versions, ciphers, key_share, SNI", note: "RTT 1" },
            { from: "R", label: "ServerHello: chosen cipher, key_share" },
            { from: "R", label: "{EncryptedExtensions, Certificate}" },
            { from: "R", label: "{CertificateVerify, Finished}" },
            { from: "L", label: "{Finished}", note: "cert checked" },
            { from: "L", label: "[HTTP request]", note: "RTT 2" },
            { from: "R", label: "[HTTP response]" }
          ] },
        { type: "seq", left: "DHCP client", right: "DHCP server",
          caption: "DHCP DORA (RFC 2131) over UDP 68 → 67. Discover and Request are always broadcast; Offer and Ack are broadcast or unicast depending on the client's broadcast flag.",
          events: [
            { from: "L", label: "DISCOVER 0.0.0.0:68 → 255.255.255.255:67", note: "broadcast" },
            { from: "R", label: "OFFER yiaddr 192.168.1.20, mask, GW, DNS, lease", note: "server:67 → :68" },
            { from: "L", label: "REQUEST 192.168.1.20 from server-id", note: "broadcast" },
            { from: "R", label: "ACK: lease confirmed", note: "client configures IP" }
          ] },
        { type: "seq", left: "Local DNS resolver", right: "Root / TLD / authoritative",
          caption: "Iterative DNS lookup for www.amazon.com, nothing cached. The host's query to its local resolver is recursive (RD = 1); the resolver then asks each server iteratively over UDP 53.",
          events: [
            { from: "L", label: "", gap: true, note: "host → resolver: recursive query, www.amazon.com A?" },
            { from: "L", label: "www.amazon.com A? (to a root server)" },
            { from: "R", label: "referral: .com TLD servers" },
            { from: "L", label: "www.amazon.com A? (to .com TLD)" },
            { from: "R", label: "referral: amazon.com name servers" },
            { from: "L", label: "www.amazon.com A? (to authoritative)" },
            { from: "R", label: "answer: A record + TTL", note: "AA = 1" },
            { from: "L", label: "", gap: true, note: "resolver caches it for TTL seconds and answers the host" }
          ] }
      ]
    },

    // ------------------------------------------------------------------ 6
    {
      title: "6. Congestion control: the sawtooth and the rules",
      blocks: [
        { type: "chart", title: "cwnd per round: Reno vs Tahoe, initial ssthresh 16, 3 duplicate ACKs at round 9",
          xLabel: "Transmission round (RTT)", yLabel: "cwnd (MSS)",
          x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
          series: [
            { name: "TCP Reno", y: [1, 2, 4, 8, 16, 17, 18, 19, 20, 10, 11, 12, 13, 14, 15, 16] },
            { name: "TCP Tahoe", y: [1, 2, 4, 8, 16, 17, 18, 19, 20, 1, 2, 4, 8, 10, 11, 12] }
          ],
          hlines: [ { y: 16, label: "ssthresh = 16" }, { y: 10, label: "new ssthresh = 10" } ],
          marks: [ { x: 9, label: "3 dup ACKs at cwnd 20" } ] },
        { type: "cheat", title: "The rules",
          items: [
            "<b>Slow start</b> (cwnd &lt; ssthresh): cwnd += 1 MSS per ACK, so cwnd doubles every RTT: 1, 2, 4, 8, 16. If doubling would pass ssthresh, cwnd stops at ssthresh (exam convention).",
            "<b>Congestion avoidance</b> (cwnd ≥ ssthresh): cwnd += 1 MSS per RTT (additive increase).",
            "<b>3 duplicate ACKs</b>: fast retransmit the missing segment. Reno: ssthresh = cwnd/2, cwnd = ssthresh (+3 MSS in RFC 5681 and Kurose's figure), continue in congestion avoidance. Tahoe: ssthresh = cwnd/2, cwnd = 1 MSS, slow start.",
            "<b>Timeout</b> (both): ssthresh = cwnd/2, cwnd = 1 MSS, slow start. A timeout is the stronger signal.",
            "<b>Throughput</b> $\\approx \\min(cwnd, rwnd)/RTT$; AIMD average $\\approx 0.75\\,W/RTT$.",
            "Initial cwnd: 1 MSS in textbook questions; modern Linux uses 10 MSS (SL-L11 p8). Linux default algorithm: CUBIC."
          ] },
        { type: "table", head: ["Round", "Reno cwnd", "Why", "Tahoe cwnd", "Why"],
          rows: [
            ["1–5", "1, 2, 4, 8, 16", "Slow start doubles; reaches ssthresh 16", "1, 2, 4, 8, 16", "Same"],
            ["6–9", "17, 18, 19, 20", "Congestion avoidance +1", "17, 18, 19, 20", "Same"],
            ["end of 9", "ssthresh = 10", "3 dup ACKs: $20/2$", "ssthresh = 10", "3 dup ACKs: $20/2$"],
            ["10–16", "10, 11, 12, 13, 14, 15, 16", "cwnd = ssthresh, then +1", "1, 2, 4, 8, 10, 11, 12", "Slow start to 10 (16 capped at 10), then +1"]
          ], caption: "The chart's trace. Slide example (SL-L11 p20, corrected): cwnd 16 → 17 → 18, then 3 duplicate ACKs → 9 → 10; a timeout there would give cwnd 1." },
        { type: "callout", kind: "slidefix", title: "SL-L11 p19 and p20",
          html: "<p>The p19 diagram drops cwnd to 1 after 3 duplicate ACKs: that is <b>Tahoe</b>, not Reno fast recovery. The p20 table halves cwnd (18 → 9) on an event labelled “timeout”: halving happens on <b>3 duplicate ACKs</b> (Reno); a timeout sets cwnd = 1 MSS.</p>" }
      ]
    },

    // ------------------------------------------------------------------ 7
    {
      title: "7. Subnetting cheat",
      blocks: [
        { type: "table", head: ["Prefix", "Mask", "Block size (octet)", "Addresses", "Usable $2^{32-n}-2$", "AWS usable $2^{32-n}-5$"],
          rows: [
            ["/16", "255.255.0.0", "1 (2nd)", "65,536", "65,534", "65,531"],
            ["/17", "255.255.128.0", "128 (3rd)", "32,768", "32,766", "32,763"],
            ["/18", "255.255.192.0", "64 (3rd)", "16,384", "16,382", "16,379"],
            ["/19", "255.255.224.0", "32 (3rd)", "8,192", "8,190", "8,187"],
            ["/20", "255.255.240.0", "16 (3rd)", "4,096", "4,094", "4,091"],
            ["/21", "255.255.248.0", "8 (3rd)", "2,048", "2,046", "2,043"],
            ["/22", "255.255.252.0", "4 (3rd)", "1,024", "1,022", "1,019"],
            ["/23", "255.255.254.0", "2 (3rd)", "512", "510", "507"],
            ["/24", "255.255.255.0", "1 (3rd)", "256", "254", "251"],
            ["/25", "255.255.255.128", "128 (4th)", "128", "126", "123"],
            ["/26", "255.255.255.192", "64 (4th)", "64", "62", "59"],
            ["/27", "255.255.255.224", "32 (4th)", "32", "30", "27"],
            ["/28", "255.255.255.240", "16 (4th)", "16", "14", "11"],
            ["/29", "255.255.255.248", "8 (4th)", "8", "6", "not allowed (AWS minimum is /28)"],
            ["/30", "255.255.255.252", "4 (4th)", "4", "2", "not allowed"],
            ["/31", "255.255.255.254", "2 (4th)", "2", "0 by formula; 2 on point-to-point links (RFC 3021)", "not allowed"],
            ["/32", "255.255.255.255", "1 (4th)", "1", "single host route", "not allowed"]
          ], caption: "AWS VPC and subnet sizes must be between /16 and /28. Mask octet values: 128, 192, 224, 240, 248, 252, 254, 255." },
        { type: "text",
          html: "<p><b>Magic-number method</b> (no binary needed):</p><ol>" +
                "<li>Find the <b>interesting octet</b>: the first octet whose mask value is not 255.</li>" +
                "<li><b>Block size</b> $= 256 - $ that mask octet (equivalently $2^{8 - \\text{prefix bits in that octet}}$).</li>" +
                "<li><b>Network address</b>: the largest multiple of the block size that is ≤ the address's value in that octet; octets to the right become 0.</li>" +
                "<li><b>Broadcast</b>: next network − 1 (octets to the right become 255).</li>" +
                "<li><b>First host</b> = network + 1; <b>last host</b> = broadcast − 1. In AWS the first usable is network + 4.</li></ol>" +
                "<p>Example 192.168.10.77/27: mask 255.255.255.224, block $256 - 224 = 32$; multiples 0, 32, 64, 96; $64 \\le 77 < 96$, so network 192.168.10.64, broadcast 192.168.10.95, hosts .65 to .94 (30 usable).</p>" +
                "<p>Example 172.16.37.9/20: interesting octet is the 3rd (240), block 16; $32 \\le 37 < 48$, so network 172.16.32.0, broadcast 172.16.47.255, hosts 172.16.32.1 to 172.16.47.254 (4094 usable).</p>" },
        { type: "derivation", title: "Network and broadcast with bitwise operations (what the Python code does)",
          steps: [
            { tex: "\\text{mask} = (2^{32} - 1) \\ll (32 - n) \\;\\&\\; (2^{32}-1)", why: "$n$ ones followed by $32 - n$ zeros; for /27 the last octet is 11100000 = 224." },
            { tex: "\\text{network} = \\text{ip} \\;\\&\\; \\text{mask}", why: "AND clears the host bits: 77 = 01001101 AND 11100000 = 01000000 = 64." },
            { tex: "\\text{broadcast} = \\text{network} \\;|\\; (\\lnot\\text{mask} \\;\\&\\; (2^{32}-1))", why: "OR sets every host bit to 1: 64 OR 00011111 = 95." },
            { tex: "\\text{usable} = 2^{32-n} - 2 = 2^{5} - 2 = 30", why: "Subtract the network and broadcast addresses." } ] },
        { type: "table", head: ["RFC 1918 private block", "Range", "Addresses"],
          rows: [
            ["10.0.0.0/8", "10.0.0.0 – 10.255.255.255", "16,777,216"],
            ["172.16.0.0/12", "172.16.0.0 – 172.31.255.255", "1,048,576"],
            ["192.168.0.0/16", "192.168.0.0 – 192.168.255.255", "65,536"]
          ], caption: "Not routed on the public Internet; reach it through NAT. Other special blocks: 127.0.0.0/8 loopback, 169.254.0.0/16 link-local (APIPA, a sign that DHCP failed), 100.64.0.0/10 carrier-grade NAT, 255.255.255.255 limited broadcast. Default AWS VPC: 172.31.0.0/16." },
        { type: "table", head: ["Class", "Leading bits", "First-octet range", "Default mask", "Networks", "Hosts per network"],
          rows: [
            ["A", "0", "1 – 126 (0 and 127 reserved)", "/8 (255.0.0.0)", "$2^7 - 2 = 126$", "$2^{24} - 2 = 16{,}777{,}214$"],
            ["B", "10", "128 – 191", "/16 (255.255.0.0)", "$2^{14} = 16{,}384$", "$2^{16} - 2 = 65{,}534$"],
            ["C", "110", "192 – 223", "/24 (255.255.255.0)", "$2^{21} = 2{,}097{,}152$", "$2^{8} - 2 = 254$"],
            ["D", "1110", "224 – 239", "none", "multicast", "n/a"],
            ["E", "1111", "240 – 255", "none", "reserved / experimental", "n/a"]
          ], caption: "Classful addressing (historical; replaced by CIDR in 1993). 172.16.1.10 is Class B: network 172.16, host 1.10." }
      ]
    },

    // ------------------------------------------------------------------ 8
    {
      title: "8. Error detection: four quick procedures",
      blocks: [
        { type: "text",
          html: "<p><b>A. 1's-complement checksum (8-bit, as on SL-L10, corrected)</b></p><ol>" +
                "<li>Add the words in binary.</li><li>If a carry leaves the top bit, add it back at the bottom (end-around carry).</li>" +
                "<li>Checksum = 1's complement (flip every bit) of the sum.</li><li>Receiver adds all words plus the checksum: all 1s means no error detected.</li></ol>" +
                "<p>Example: 10010011 + 01010110 = 11101001 (147 + 86 = 233, no carry). Checksum = <b>00010110</b>. Check: 11101001 + 00010110 = 11111111. The 16-bit Internet checksum is the same recipe on 16-bit words: 0x0001 + 0xF203 + 0xF4F5 + 0xF6F7 = 0x2DDF0 → fold the carry: 0xDDF0 + 0x2 = 0xDDF2 → checksum 0x220D (RFC 1071).</p>" },
        { type: "callout", kind: "slidefix", title: "SL-L10 p8–10",
          html: "<p>The slide shows a carry (1 00001001), sum 00001010 and checksum 11110101. In fact 147 + 86 = 233 = 11101001 with <b>no carry</b>, so the checksum is <b>00010110</b>.</p>" },
        { type: "text",
          html: "<p><b>B. CRC (mod-2 long division)</b></p><ol>" +
                "<li>Generator $G$ has $r + 1$ bits (degree $r$). Append $r$ zeros to the data.</li>" +
                "<li>Divide using XOR (no borrows): whenever the leading bit is 1, XOR the generator under it.</li>" +
                "<li>The $r$-bit remainder is the CRC; send data followed by CRC.</li>" +
                "<li>Receiver divides the whole frame by $G$: remainder 0 means no error detected.</li></ol>" +
                "<p>Example: data 1001, $G$ = 1011 ($x^3 + x + 1$), $r = 3$.</p>" +
                "<pre>1001000      data + 3 zeros\n1011         XOR at bit 0\n0010000\n  1011       XOR at bit 2\n0000110      remainder = 110</pre>" +
                "<p>Transmit <b>1001110</b>. Check: 1001110 ÷ 1011 leaves 000. A CRC with $r$ check bits detects every burst error of length ≤ $r$.</p>" },
        { type: "text",
          html: "<p><b>C. Hamming (7,4) single-error correction (even parity)</b></p><ol>" +
                "<li>Positions 1 to 7; parity bits at 1, 2, 4; data bits $d_1 d_2 d_3 d_4$ at 3, 5, 6, 7.</li>" +
                "<li>$p_1$ covers positions 1, 3, 5, 7; $p_2$ covers 2, 3, 6, 7; $p_4$ covers 4, 5, 6, 7 (positions whose binary index has that bit set).</li>" +
                "<li>Receiver recomputes each check: syndrome $s_4 s_2 s_1$ in binary = position of the wrong bit (0 = no error).</li></ol>" +
                "<p>Example: data 1011 → position 3 = 1, 5 = 0, 6 = 1, 7 = 1. $p_1 = 1 \\oplus 0 \\oplus 1 = 0$, $p_2 = 1 \\oplus 1 \\oplus 1 = 1$, $p_4 = 0 \\oplus 1 \\oplus 1 = 0$. Codeword (positions 1 to 7) = <b>0110011</b>. If bit 6 flips (0110001): $s_1 = 0$, $s_2 = 1$, $s_4 = 1$ → syndrome 110 = 6 → flip bit 6 back.</p>" },
        { type: "text",
          html: "<p><b>D. 2-D parity (even)</b></p><ol>" +
                "<li>Arrange the data in rows; add a parity bit to each row and a parity row for the columns.</li>" +
                "<li>One flipped bit makes exactly one row and one column fail: their crossing locates the bit, so it can be corrected.</li>" +
                "<li>Detects all 1-, 2- and 3-bit errors; some 4-bit (rectangle) errors go undetected.</li></ol>" },
        { type: "table", head: ["", "c1", "c2", "c3", "row parity"],
          rows: [
            ["row 1", "1", "0", "1", "0"],
            ["row 2", "1", "1", "1", "1"],
            ["row 3", "0", "1", "1", "0"],
            ["column parity", "0", "0", "1", "1"]
          ], caption: "2-D even parity for data 101 / 111 / 011. If row 2, column 2 flips to 0, row 2's parity and column 2's parity both fail, pointing at that bit." }
      ]
    },

    // ------------------------------------------------------------------ 9
    {
      title: "9. Top 20 Python socket snippets",
      blocks: [
        { type: "text",
          html: "<p>All 20 snippets are functions in one script, <code>cn-practice/Sheet_socket_snippets.py</code>. Running <code>python3 Sheet_socket_snippets.py</code> starts its own servers on 127.0.0.1 with OS-assigned ports, runs every snippet with <code>assert</code> checks and exits 0 in about one second, fully offline. The order of calls to memorise: TCP server <code>socket → bind → listen → accept → recv/sendall → close</code>; TCP client <code>socket → connect → sendall → recv → close</code>; UDP <code>socket → bind (server) → recvfrom/sendto</code>.</p>" },
        { type: "table", head: ["#", "Snippet (function)", "Purpose in one line"],
          rows: [
            ["1", "<code>tcp_server</code>", "bind 127.0.0.1:0, listen, accept one client per loop, echo in upper case"],
            ["2", "<code>tcp_client</code>", "create_connection (3-way handshake), sendall, recv the reply"],
            ["3", "<code>udp_server</code>", "SOCK_DGRAM: recvfrom gives (data, addr), reply with sendto"],
            ["4", "<code>udp_client</code>", "sendto then recvfrom, no connection"],
            ["5", "<code>udp_request_with_retry</code>", "settimeout + retransmit on socket.timeout (application-level reliability)"],
            ["6", "<code>send_framed / recv_exact / recv_framed</code>", "4-byte '!I' length prefix so message boundaries survive the TCP byte stream"],
            ["7", "<code>recv_until</code>", "loop recv into a buffer until a delimiter such as CRLF (how HTTP/SMTP read lines)"],
            ["8", "<code>reuseaddr_rebind</code>", "SO_REUSEADDR before bind lets a restarted server reuse a port in TIME_WAIT"],
            ["9", "<code>selectors_server</code>", "one thread serves many clients with non-blocking sockets and selectors"],
            ["10", "<code>threaded_server</code>", "accept loop hands each connection to its own thread"],
            ["11", "<code>build_ipv4_header / parse_ipv4_header</code>", "struct '!BBHHHBBH4s4s' 20-byte IPv4 header with checksum"],
            ["12", "<code>build_tcp_header / parse_tcp_header</code>", "struct '!HHIIBBHHH' 20-byte TCP header, flag bits decoded"],
            ["13", "<code>build_udp_datagram / parse_udp_header</code>", "struct '!HHHH' UDP header, checksum over the pseudo-header"],
            ["14", "<code>internet_checksum</code>", "RFC 1071 16-bit 1's-complement sum with end-around carry"],
            ["15", "<code>byte_order_demo</code>", "htons/ntohs and struct '!' give big-endian network byte order"],
            ["16", "<code>list_subnets</code>", "ipaddress: split a block, list network, broadcast, hosts, generic and AWS usable counts"],
            ["17", "<code>resolve</code>", "getaddrinfo returns (family, type, proto, canonname, sockaddr) tuples"],
            ["18", "<code>ssl_client_hello</code>", "ssl.create_default_context, then wrap_socket(sock, server_hostname=host); the first bytes sent are a ClientHello"],
            ["19", "<code>http_get</code>", "http.client GET against a local http.server: status, headers, body"],
            ["20", "<code>socketserver_demo</code>", "socketserver.ThreadingTCPServer writes the accept/thread loop for you"]
          ], caption: "The 20 snippets in the script." },
        { type: "code", file: "Sheet_socket_snippets.py", level: "high", title: "Sheet_socket_snippets.py: all 20 snippets with a self-test",
          note: "Run: python3 Sheet_socket_snippets.py (offline, about 1 s, exit code 0)." },
        { type: "cheat", title: "Socket facts that become MCQs",
          items: [
            "<code>recv(1024)</code> returns <b>up to</b> 1024 bytes; <code>b''</code> means the peer closed the connection.",
            "<code>send()</code> may send only part of the buffer; <code>sendall()</code> loops until everything is sent.",
            "<code>accept()</code> returns a <b>new</b> socket for each client; the listening socket stays open.",
            "Binding to port 0 lets the OS choose a free port; read it with <code>getsockname()[1]</code>.",
            "<code>struct</code> format '!' = network (big-endian) order; B = 1 byte, H = 2, I = 4, Q = 8, 4s = 4 raw bytes.",
            "Raw sockets (<code>SOCK_RAW</code>) need root; build headers with struct and only send with privileges."
          ] }
      ]
    },

    // ------------------------------------------------------------------ 10
    {
      title: "10. Slide corrections to remember",
      blocks: [
        { type: "table", head: ["#", "Where", "Slide says", "Correct", "Severity"],
          rows: [
            ["B1", "SL-L10 p8–10", "10010011 + 01010110 = 1 00001001 (carry), checksum 11110101", "147 + 86 = 233 = 11101001, no carry; checksum <b>00010110</b>; receiver sum 11111111", "high"],
            ["B2", "SL-L11 p19", "After 3 duplicate ACKs, cwnd → 1, ssthresh = 8/2 = 4 (called fast recovery)", "That is <b>Tahoe</b>. Reno: ssthresh = cwnd/2, cwnd = ssthresh (+3), then linear growth", "high"],
            ["B3", "SL-L11 p20", "Event labelled “tcp timeout” halves cwnd 18 → 9", "Halving is the <b>3 duplicate ACKs</b> (Reno) reaction; a timeout sets cwnd = 1 MSS", "high"],
            ["B4", "SL-L13 p11, SL-L14 p3", "172.16.1.10 = network 172.16.1 / host 10", "172.16.x.x is <b>Class B</b>: network 172.16, host 1.10 (classful rules)", "high"],
            ["B5", "SL-L13 p20", "192.168.1.0/24 → /23", "192.168.1.0 is not on a /23 boundary; the block is <b>192.168.0.0/23</b> (192.168.0.0–192.168.1.255)", "high"],
            ["B29", "SL-L09 p23", "ACK 201 = received everything up to 201", "ACK 201 = received bytes <b>through 200</b>; 201 is the next byte expected", "high"],
            ["B6", "SL-L13 p17", "192.168.0.1 is the network address", "Network address of 192.168.0.1/24 is <b>192.168.0.0</b>", "medium"],
            ["B7", "SL-L13 p12–13", "Class B hosts “~65,000” and “64,000”", "Exactly $2^{16} - 2 = 65{,}534$", "medium"],
            ["B8", "SL-L13 p23", "VPC /16 → 65,534 usable, /24 → 254", "In AWS usable = total − 5: <b>65,531</b> and <b>251</b> (generic networking: 65,534 and 254)", "medium"],
            ["B9", "WB-L02 p19", "GEO ≈ 240 ms called a round trip", "240 ms is <b>one way</b> (ground → satellite → ground); request + reply ≈ 480 ms", "medium"],
            ["B10", "Study Pack quiz (L02)", "GEO explanation says ≈ 179 ms", "$2\\times35{,}786$ km / $3\\times10^8$ m/s ≈ <b>239 ms</b>", "medium"],
            ["B11", "SL-L14 p11", "Private subnets reach the Internet via NAT, but the route tables show only the local route", "Private route table needs <b>0.0.0.0/0 → NAT gateway</b>", "medium"],
            ["B15", "WB-L04 p28", "Mesh scalability “Excellent”, hybrid “Hard”", "Full mesh scales <b>poorly</b> ($n(n-1)/2$ links); hybrid is generally good", "medium"],
            ["B17", "WB-L03 p15, WB-L07 p3", "IMAP listed under the presentation layer", "IMAP is an <b>application-layer</b> protocol", "medium"],
            ["B28", "SL-L09 p9", "Apps drawn on ports 443, 5222, 587", "Those are <b>server (destination)</b> ports; clients use ephemeral ports 49152–65535", "medium"],
            ["B31", "SL-L12 p11", "ALB shown with a TCP:80 listener and a TCP target group", "ALB listeners are <b>HTTP/HTTPS only</b>; TCP/UDP listeners belong to the NLB", "medium"]
          ], caption: "High- and medium-severity rows from UNCLEAR.md section B. In the exam, answer with the corrected version." }
      ]
    },

    // ------------------------------------------------------------------ 11
    {
      title: "11. Exam traps: master list",
      blocks: [
        { type: "traps",
          items: [
            "<b>Bytes vs bits</b>: a 1500-byte packet is 12,000 bits. Convert before dividing by R.",
            "<b>Mega</b>: 1 Mbps = $10^6$ bit/s. Memory sizes (KiB, MiB) use powers of 2; link rates never do.",
            "<b>Propagation</b> does not depend on packet size or bandwidth; <b>transmission</b> does not depend on distance.",
            "<b>GEO satellite</b>: ≈ 239 ms is one way, not a round trip.",
            "<b>Store-and-forward</b>: $N$ links means $N - 1$ routers; P packets take $(N+P-1)L/R$, not $NP\\,L/R$.",
            "<b>Throughput</b> is the minimum link rate, not the sum or the average.",
            "<b>Utilisation</b>: $a = T_p/T_t$ uses the one-way delay; the RTT is $2T_p$.",
            "<b>Window limits</b>: GBN $2^n - 1$, SR $2^{n-1}$, never $2^n$.",
            "<b>GBN</b> discards out-of-order frames and resends from the lost frame onward; <b>SR</b> buffers them and resends only the lost one.",
            "<b>TCP ACK number</b> = next byte expected (ACK 201 means 101–200 received), not the last byte received.",
            "<b>SYN and FIN</b> each consume one sequence number; a pure ACK consumes none.",
            "<b>TCP numbers bytes, not segments.</b> seq of the next segment = seq + payload length.",
            "<b>Fast retransmit</b> triggers on 3 <b>duplicate</b> ACKs (the 4th identical ACK), not on 3 ACKs.",
            "<b>Timeout vs 3 dup ACKs</b>: timeout → cwnd = 1 (both Tahoe and Reno); 3 dup ACKs → halve (Reno) or 1 (Tahoe).",
            "<b>ssthresh = cwnd/2</b> uses cwnd at the moment of loss, not the old ssthresh.",
            "<b>Effective window</b> = $\\min(cwnd, rwnd)$: a big cwnd cannot beat a small receiver window.",
            "<b>UDP Length</b> includes the 8-byte header; IPv4 Total Length includes the IP header; IHL and Data Offset count 4-byte words.",
            "<b>Fragment offset</b> is in 8-byte units; only the last fragment has MF = 0; every fragment carries its own 20-byte header.",
            "<b>IPv4 checksum</b> covers the header only and is recomputed at every hop (TTL changes); IPv6 has no header checksum.",
            "<b>Usable hosts</b>: $2^{32-n} - 2$ generic, $2^{32-n} - 5$ in AWS. Read which one the question means.",
            "<b>AWS subnet sizes</b>: /16 to /28 only; a /29 is rejected.",
            "<b>Network address</b>: AND with the mask; 192.168.1.0/23 is not a valid network (it is 192.168.0.0/23).",
            "<b>Classful</b>: 172.16.x.x is Class B (first octet 128–191), so the default mask is /16.",
            "<b>127.x.x.x</b> is loopback, not Class A host space; <b>169.254.x.x</b> means DHCP failed (APIPA).",
            "<b>Port ranges</b>: well-known 0–1023 (not 1024); client source ports are ephemeral (49152–65535).",
            "<b>DNS</b> uses UDP 53 for normal queries, TCP 53 for zone transfers and large answers. MX picks the <b>lowest</b> preference value first.",
            "<b>DHCP</b> is UDP: client 68, server 67; Discover goes from 0.0.0.0 to 255.255.255.255.",
            "<b>SMTP pushes, POP3/IMAP pull.</b> IMAP is application layer (not presentation). 587 is submission, 25 is relay.",
            "<b>HTTP status</b>: 301 permanent, 302 temporary, 304 not modified (conditional GET), 401 unauthenticated, 403 forbidden, 404 not found, 500 server error, 503 unavailable.",
            "<b>Content-Length</b> = exact body bytes (the slide's 88 for a 57-byte body is wrong).",
            "<b>HTTP/2</b> removes HTTP-level head-of-line blocking but not TCP's; HTTP/3 (QUIC over UDP) removes both.",
            "<b>TLS 1.3</b> = 1 RTT (plus 1 RTT for TCP); TLS 1.2 = 2 RTT. The certificate proves identity; asymmetric crypto agrees the session key; symmetric crypto encrypts the data.",
            "<b>ALB</b> = layer 7, HTTP/HTTPS listeners, no static IP; <b>NLB</b> = layer 4, TCP/UDP/TLS, static IP per AZ, preserves the client IP.",
            "<b>Switch</b> = one collision domain per port, one broadcast domain overall; <b>router</b> separates broadcast domains; <b>hub</b> = one collision domain.",
            "<b>NAT gateway</b> lives in a public subnet but is the target of the private route table; it allows outbound-initiated traffic only.",
            "<b>Longest prefix match</b>: the most specific route wins, even if a shorter prefix appears first in the table."
          ] }
      ]
    },

    // ------------------------------------------------------------------ 12
    {
      title: "12. Last-hour checklist",
      blocks: [
        { type: "text",
          html: "<p>Use the hour before the exam for recall, not for new topics. Tick each line mentally; if one fails, read only that row of this sheet.</p><ol>" +
                "<li><b>5 min</b>: write the delay formulas from memory: $L/R$, $d/s$, $d_{nodal}$, $(N+P-1)L/R$, $\\min R_i$, $R\\times RTT$.</li>" +
                "<li><b>5 min</b>: write $\\frac{1}{1+2a}$, $\\min(1, \\frac{N}{1+2a})$, $2^n - 1$, $2^{n-1}$, and do one example ($T_t = 1$ ms, $T_p = 10$ ms → 4.76%, window 21).</li>" +
                "<li><b>10 min</b>: subnetting: write the /24 to /30 rows (mask, block, usable, AWS usable); solve 192.168.10.77/27 (network .64, broadcast .95) and 500 hosts → /23.</li>" +
                "<li><b>5 min</b>: draw the TCP handshake with ISN 100/350 and the ACK after 100 data bytes (201).</li>" +
                "<li><b>5 min</b>: run the cwnd trace: 1, 2, 4, 8, 16 (ssthresh 16), 17 to 20, 3 dup ACKs → 10 (Reno) or 1 (Tahoe); timeout → 1.</li>" +
                "<li><b>5 min</b>: ports: 20/21 FTP, 22 SSH, 23 Telnet, 25/587/465 SMTP, 53 DNS, 67/68 DHCP, 80 HTTP, 110/995 POP3, 143/993 IMAP, 443 HTTPS.</li>" +
                "<li><b>5 min</b>: flows: HTTP request format (request line, headers, blank line, body); TLS 1.3 steps; DNS root → TLD → authoritative; DHCP DORA addresses.</li>" +
                "<li><b>5 min</b>: header sizes: IPv4 20–60, IPv6 40, TCP 20–60, UDP 8, Ethernet 14 + 4; IHL and data offset × 4; fragment offset ÷ 8.</li>" +
                "<li><b>5 min</b>: code skeletons: TCP server (socket, bind, listen, accept, recv, sendall, close), UDP client with settimeout and retry, <code>struct.unpack('!HHHH', data[:8])</code> for UDP, <code>ipaddress.ip_network('10.0.0.0/24').subnets(new_prefix=26)</code>.</li>" +
                "<li><b>5 min</b>: read section 11 (traps) and section 10 (slide corrections) once.</li></ol>" },
        { type: "callout", kind: "takeaway", title: "In the exam hall",
          html: "<ul><li>Write units on every line of a numerical; convert bytes to bits first.</li><li>For MSQs, judge each option independently: more than one may be correct.</li><li>For “AWS” in a subnetting question, subtract 5; otherwise subtract 2.</li><li>For predict-output code, trace variables line by line on paper; watch integer division, <code>struct</code> byte order and <code>recv</code> sizes.</li><li>Skip a question after 3 minutes and come back to it.</li></ul>" }
      ]
    }
  ]
};
