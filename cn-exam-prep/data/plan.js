// 7-day study plan (window.EXTRAS.plan). Day mapping matches every unit's `day` field.
window.EXTRAS = window.EXTRAS || {};
window.EXTRAS.plan = {
  title: "7-Day Study Plan (1.5–2 hours a day)",
  intro:
    "<p>You have about 7 days, 1.5–2 hours a day for this subject, and three other subjects competing for the same evenings. This plan covers all 15 units in course order, then spends the last two days on timed mocks and drills. Each task has a time budget. Tick the box when you finish it: ticks are saved in this browser and the <a href='#/progress'>Progress</a> page uses them together with your quiz and mock scores.</p>" +
    "<h3>The attempt-first method (use it for every worked problem and every practice question)</h3>" +
    "<ol>" +
    "<li><b>Read the intuition and the cheat block first</b> (2–3 minutes per section). Do not read the derivation yet.</li>" +
    "<li><b>Cover and attempt.</b> Every worked problem hides its answer behind <i>Show solution</i>. Write your own answer on paper first, with units, even if you are unsure. A wrong attempt followed by the solution sticks far better than reading a solution cold.</li>" +
    "<li><b>Compare step by step.</b> Open the solution and find the first step where you went wrong. Read that step's <i>why</i> line. That is the thing to learn.</li>" +
    "<li><b>Practice questions: commit before you check.</b> Pick an option or type a number before you press Check. For predict-output code, write down the exact output before you reveal it. For coding questions, write the function on paper or in an editor, then compare with the model solution and mark yourself with the rubric.</li>" +
    "<li><b>Run the scripts.</b> Every unit has Python scripts in <code>cn-practice/</code> (run <code>python3 &lt;script&gt;.py</code>; they work offline). Reading code is not enough for the coding questions: change one number, predict the new output, run it.</li>" +
    "<li><b>Mark the section done</b> only when you can solve its worked problem without looking.</li>" +
    "</ol>" +
    "<h3>What the badges mean, and how to use them when time is short</h3>" +
    "<ul>" +
    "<li><span class='badge b-class'>From class worksheet</span> The content is on your lecture slides (page references are given). <b>Highest priority</b>: the midsem is set from these.</li>" +
    "<li><span class='badge b-lab'>From lab / class quiz</span> From the Study Pack labs and quizzes. Quiz MCQs are reproduced word for word: do every one of them.</li>" +
    "<li><span class='badge b-res'>⚠ Not covered in class – researched</span> In the official syllabus but missing from the slides (for example DHCP ports 67/68, TIME_WAIT, Tahoe vs Reno names, GBN/SR window limits). Second priority: syllabus items can still be examined.</li>" +
    "<li><span class='badge b-extra'>Extra (standard networking syllabus)</span> GATE-style topics outside your course (ALOHA, CRC, Hamming, routing algorithms, IPv4 fragmentation). <b>Optional.</b> The plan marks them “optional”: skim the cheat block and do one worked example only if you are ahead of schedule.</li>" +
    "</ul>" +
    "<h3>Where the marks are: prioritise these</h3>" +
    "<p>Across MCQ, numerical and coding questions, the highest exam yield is:</p>" +
    "<ol>" +
    "<li><b>Subnetting and CIDR</b>: network, broadcast, first and last host, usable hosts $2^{32-n}-2$ (AWS: $-5$), mask ↔ prefix, borrowing bits, sizing a block for $N$ hosts (Units 13, 14).</li>" +
    "<li><b>Delays</b>: $L/R$ vs $d/s$, nodal delay, bottleneck throughput, store-and-forward over several hops (Unit 02).</li>" +
    "<li><b>TCP sequence and acknowledgement numbers</b>: the 3-way handshake (ISN 100/350), ACK = next expected byte, SYN and FIN each consume one number (Unit 09).</li>" +
    "<li><b>Sliding windows</b>: stop-and-wait utilisation $\\frac{1}{1+2a}$, pipelined $\\frac{N}{1+2a}$, GBN vs SR traces and window limits $2^n-1$ and $2^{n-1}$ (Unit 10).</li>" +
    "<li><b>Congestion-control traces</b>: slow start, ssthresh, AIMD, timeout vs 3 duplicate ACKs, Tahoe vs Reno (Unit 11).</li>" +
    "<li><b>Port numbers</b>: 20/21, 22, 23, 25/587/465, 53, 67/68, 80, 110/995, 143/993, 443 (Units 08, 09, 15).</li>" +
    "<li><b>Protocol flows</b>: the HTTP request/response format, the TLS handshake, the DNS lookup (root → TLD → authoritative) and DHCP DORA (Units 05, 06, 07, 15).</li>" +
    "</ol>" +
    "<p>If a day runs short, keep the tasks for these topics and drop the tasks marked <b>(optional)</b>. Never drop the end-of-day checkpoint: it takes 5 minutes and tells you whether the day worked.</p>" +
    "<p>Note on links: each task links to its unit page. Inside the unit, use the <i>Sections</i> list at the top; the topic names in each task match the section titles, and the numbers in brackets (such as 09.7) are the COVERAGE row IDs listed in each section.</p>",
  days: [
    {
      day: 1,
      title: "How the Internet works: edge and core, delays, layers",
      minutes: 105,
      units: ["unit01", "unit02", "unit03"],
      tasks: [
        "<b>10 min.</b> Read the intro above, then skim <a href='#/unit/unit01'>Unit 01</a>: edge vs access vs core (01.7), the traceroute to Google Delhi (01.6) and AWS Region ⊃ Availability Zone vs Edge Location (01.8). Do only the practice questions on traceroute and the AWS vocabulary.",
        "<b>25 min.</b> <a href='#/unit/unit02'>Unit 02</a> transmission vs propagation delay (02.7, 02.8). Attempt the worked problems first: 8000 bits at 2/4/8 Mbps gives 4/2/1 ms, then the GEO satellite ($2\\times35{,}786$ km at $3\\times10^8$ m/s ≈ 239 ms <b>one way</b>; note the slide correction). Then do every numerical in that section's practice set.",
        "<b>10 min.</b> <a href='#/unit/unit02'>Unit 02</a> four delays and throughput (02.5, 02.9): $d_{nodal}=d_{proc}+d_{queue}+d_{trans}+d_{prop}$ and the bottleneck example $\\min(10,2,5)=2$ Mbps. Attempt the file-transfer-time worked problem before reading it.",
        "<b>15 min.</b> <a href='#/unit/unit02'>Unit 02</a> store-and-forward over $N$ links with $P$ packets, $(N+P-1)\\,L/R$ (02.3), and traffic intensity $La/R$ (02.10). <b>(optional, 5 of the 15 min)</b> BDP, Nyquist and Shannon from the Extra section: read the cheat block only.",
        "<b>20 min.</b> <a href='#/unit/unit03'>Unit 03</a> OSI vs TCP/IP (03.2–03.11): the 7 layers with the mnemonic, the 4- and 5-layer TCP/IP views, the PDU names (message, segment, datagram, frame, bits) and the header order <code>MAC | IP | TCP | HTTP | Data</code>. Do the header-overhead worked problem and the full practice set.",
        "<b>10 min.</b> Run the Unit 02 delay script and the Unit 03 encapsulation script from <code>cn-practice/</code>. Change the packet size in the delay script, predict the new transmission delay, then run it again to check.",
        "<b>10 min.</b> Read the delay and throughput rows of the <a href='#/formulas'>Last-Night Formula Sheet</a> (section 1) and copy the 6 delay formulas onto one index card.",
        "<b>5 min.</b> End-of-day checkpoint below, without notes."
      ],
      checkpoint:
        "<p>Answer on paper without notes. Pass = 4 of 5 correct.</p><ol>" +
        "<li>A 1500-byte packet on a 10 Mbps link that is 2000 km of fibre ($s=2\\times10^8$ m/s): transmission delay and propagation delay in ms?</li>" +
        "<li>Path with links of 10, 2 and 5 Mbps: end-to-end throughput, and the time to send a 4 MB file (1 MB = $10^6$ bytes)?</li>" +
        "<li>5 packets of 1000 bits each cross 3 links of 1 Mbps (store-and-forward, ignore propagation). When does the last packet arrive?</li>" +
        "<li>Name the PDU at the transport, network and data-link layers.</li>" +
        "<li>Which OSI layer does a switch work at, and which does a router work at?</li></ol>" +
        "<details><summary>Answers</summary><ol>" +
        "<li>$12{,}000/10^7 = 1.2$ ms; $2\\times10^6/2\\times10^8 = 10$ ms.</li>" +
        "<li>2 Mbps; $32\\times10^6/2\\times10^6 = 16$ s.</li>" +
        "<li>$(3+5-1)\\times1$ ms $=7$ ms.</li>" +
        "<li>Segment (UDP: segment or user datagram), datagram (packet), frame.</li>" +
        "<li>Switch: layer 2 (data link). Router: layer 3 (network).</li></ol></details>"
    },
    {
      day: 2,
      title: "Devices and topologies, HTTP and REST, HTTPS and TLS",
      minutes: 115,
      units: ["unit04", "unit05", "unit06"],
      tasks: [
        "<b>15 min.</b> <a href='#/unit/unit04'>Unit 04</a> devices and topologies (04.1–04.6, 04.9): hub L1 / switch L2 / router L3, full mesh $n(n-1)/2$ links (10 nodes → 45), collision vs broadcast domains. Attempt the domain-counting worked problem first. Read the slide correction on mesh scalability (the slide says “Excellent”; full mesh scales poorly).",
        "<b>10 min.</b> <a href='#/unit/unit04'>Unit 04</a> cloud network and VPC basics (04.7, 04.8): 10.0.0.0/16 = $2^{16}$ = 65,536 addresses; the default VPC is 172.31.0.0/16. Do the practice set.",
        "<b>10 min, (optional)</b> <a href='#/unit/unit04'>Unit 04</a> Extra sections on framing and MAC (04.10, 04.11): read the cheat blocks for bit stuffing, ALOHA ($\\frac{1}{2e}$, $\\frac{1}{e}$), CSMA/CD $L_{min}=2\\,T_p\\,R$ and the Ethernet II frame. Do one worked example only. Skip entirely if you are behind.",
        "<b>25 min.</b> <a href='#/unit/unit05'>Unit 05</a> HTTP anatomy (05.4–05.7, 05.12): request line, headers, blank line, body; status line and codes 200/201/301/302/304/403/404/500; methods → CRUD; statelessness and cookies. Attempt the Content-Length counting problem (the slide's 88 should be 57). Do the full practice set including the predict-output questions.",
        "<b>15 min.</b> <a href='#/unit/unit05'>Unit 05</a> HTTP/1.0 → 1.1 → 2 → 3 and head-of-line blocking (05.8–05.11, 05.14). Attempt the RTT worked problem: non-persistent costs $2\\,RTT + t$ per object, persistent costs 1 RTT per object after the first.",
        "<b>25 min.</b> <a href='#/unit/unit06'>Unit 06</a> HTTPS and TLS (06.1–06.8): confidentiality, integrity, authentication; symmetric vs asymmetric key counts $\\frac{n(n-1)}{2}$ vs $2n$; Caesar shift; certificate chain leaf → intermediate → root; the TLS handshake steps and why TLS 1.3 needs 1 RTT. Do the worked problems in order, then the practice set.",
        "<b>10 min.</b> Run the Unit 05 raw-socket HTTP GET script (low level) and the Unit 06 <code>ssl</code> script (high level). In the HTTP script, find the line that ends the headers with <code>\\r\\n\\r\\n</code>.",
        "<b>5 min.</b> End-of-day checkpoint below, without notes."
      ],
      checkpoint:
        "<p>Pass = you can do all five in 5 minutes without notes.</p><ol>" +
        "<li>How many links does a full mesh of 8 devices need?</li>" +
        "<li>Write a minimal HTTP/1.1 GET request for <code>/index.html</code> on host <code>example.com</code>, including the line that ends the headers.</li>" +
        "<li>A page has a base HTML file and 4 images. With non-persistent HTTP, no parallel connections, how many RTTs (ignore transmission time)?</li>" +
        "<li>50 users each need a private channel with every other user. Keys needed with symmetric cryptography? With public-key cryptography?</li>" +
        "<li>List the TLS handshake steps in order and say which messages are encrypted in TLS 1.3.</li></ol>" +
        "<details><summary>Answers</summary><ol>" +
        "<li>$8\\times7/2 = 28$.</li>" +
        "<li><code>GET /index.html HTTP/1.1</code>, <code>Host: example.com</code>, then an empty line (CRLF CRLF ends the header block).</li>" +
        "<li>$5\\times 2\\,RTT = 10$ RTT.</li>" +
        "<li>$50\\times49/2 = 1225$ shared keys; $2\\times50 = 100$ keys (50 key pairs).</li>" +
        "<li>ClientHello → ServerHello + certificate → client authenticates the certificate → key exchange (key shares) → Finished, then encrypted data. In TLS 1.3 everything after ServerHello (EncryptedExtensions, Certificate, CertificateVerify, Finished) is encrypted.</li></ol></details>"
    },
    {
      day: 3,
      title: "DNS, email, caching and CDNs, ports, UDP and the TCP connection",
      minutes: 115,
      units: ["unit07", "unit08", "unit09"],
      tasks: [
        "<b>20 min.</b> <a href='#/unit/unit07'>Unit 07</a> DNS (07.1–07.6): record types A, AAAA, CNAME, MX (lowest preference wins), NS, TXT; root → TLD → authoritative; local resolver and caching; recursive vs iterative; TTL; Route 53 routing policies (simple, weighted, latency, failover, geolocation). Attempt the lookup walk-through before reading it, then do the practice set.",
        "<b>10 min.</b> <a href='#/unit/unit07'>Unit 07</a> code: read the raw UDP DNS query built with <code>struct</code> (12-byte header, QNAME labels) and run it. Predict the first 12 bytes of the query before you run it.",
        "<b>20 min.</b> <a href='#/unit/unit08'>Unit 08</a> email and caching (08.1–08.6): SMTP pushes (25/587/465), POP3 (110/995) and IMAP (143/993) pull; cache hit/miss and average access time; <code>Cache-Control: max-age</code>; ETag and <code>If-None-Match</code> → 304; CDN pull vs push and DNS steering. Attempt the average-delay worked problem first.",
        "<b>15 min.</b> <a href='#/unit/unit09'>Unit 09</a> ports and UDP (09.1–09.6): socket = IP + port, a TCP connection = 4-tuple, port ranges 0–1023 / 1024–49151 / 49152–65535, UDP length = 8 + data. Do the UDP header parsing problem and the practice set.",
        "<b>25 min.</b> <a href='#/unit/unit09'>Unit 09</a> the TCP connection (09.7–09.11): attempt the ISN 100/350 handshake trace on paper first (SYN seq=100; SYN-ACK seq=350 ack=101; ACK seq=101 ack=351), then the 4-way teardown, the cumulative ACK example (bytes 101–200 → ACK 201 = next expected byte; read the slide correction) and the TCP header fields and flags. Do the full practice set.",
        "<b>10 min, (optional)</b> <a href='#/unit/unit09'>Unit 09</a> Extra: UDP pseudo-header checksum, TCP state machine and TIME_WAIT = 2·MSL. Cheat block and one worked example only.",
        "<b>10 min.</b> Run the Unit 09 TCP and UDP client/server scripts. Then, without looking, write a UDP echo client with <code>settimeout</code> and 3 retries; compare with snippet #5 in the formula sheet (section 9).",
        "<b>5 min.</b> End-of-day checkpoint below, without notes."
      ],
      checkpoint:
        "<p>Pass = 5 of 6 correct.</p><ol>" +
        "<li>Which DNS record maps a name to an IPv6 address? Which one names the mail server?</li>" +
        "<li>Which transport protocol and port does DNS normally use for queries?</li>" +
        "<li>Hit ratio 0.4, hit delay 10 ms, miss delay 2.01 s: average access time?</li>" +
        "<li>Client ISN 100, server ISN 350. Write seq and ack for all three handshake segments.</li>" +
        "<li>The client sends a segment with seq=101 carrying 100 bytes. What ACK number comes back?</li>" +
        "<li>A UDP datagram carries 52 bytes of data. What is the value of its Length field?</li></ol>" +
        "<details><summary>Answers</summary><ol>" +
        "<li>AAAA; MX.</li>" +
        "<li>UDP port 53 (TCP 53 for zone transfers and large responses).</li>" +
        "<li>$0.4\\times0.01 + 0.6\\times2.01 = 1.21$ s.</li>" +
        "<li>SYN seq=100; SYN-ACK seq=350, ack=101; ACK seq=101, ack=351.</li>" +
        "<li>ACK 201 (bytes 101–200 received, 201 expected next).</li>" +
        "<li>$8+52 = 60$ bytes.</li></ol></details>"
    },
    {
      day: 4,
      title: "Reliable data transfer and congestion control (the numerical day)",
      minutes: 120,
      units: ["unit10", "unit11"],
      tasks: [
        "<b>15 min.</b> <a href='#/unit/unit10'>Unit 10</a> checksum (10.2): read the slide correction first (the slide adds 10010011 + 01010110 wrongly), then do the corrected example by hand: sum 11101001, checksum 00010110, receiver check 11111111. Do the checksum practice questions.",
        "<b>20 min.</b> <a href='#/unit/unit10'>Unit 10</a> stop-and-wait and sliding window (10.5, 10.6): $a = T_p/T_t$, $U = \\frac{1}{1+2a}$, $U = \\min\\left(1,\\frac{N}{1+2a}\\right)$, window for 100% $N \\ge 1+2a$. Attempt every utilisation worked problem before reading it; these are the most common numericals.",
        "<b>20 min.</b> <a href='#/unit/unit10'>Unit 10</a> Go-Back-N and Selective Repeat (10.8–10.10): the packet-5-lost GBN trace, the SR NAK trace, and window limits $2^n-1$ (GBN) and $2^{n-1}$ (SR). Draw each trace on paper before opening it.",
        "<b>10 min.</b> <a href='#/unit/unit10'>Unit 10</a> flow control (10.4, 10.7): rwnd, zero window, window probes with backoff 1, 2, 4, 8 s. Practice set.",
        "<b>10 min, (optional)</b> <a href='#/unit/unit10'>Unit 10</a> Extras (10.11, 10.12): do the RTT-estimation worked problem (EstimatedRTT, DevRTT, TimeoutInterval with $\\alpha=1/8$, $\\beta=1/4$) because it is a quick numerical; skim the CRC, Hamming (7,4) and 2-D parity cheat blocks only.",
        "<b>30 min.</b> <a href='#/unit/unit11'>Unit 11</a> congestion control (11.1–11.10): slow start doubling, ssthresh = cwnd/2, congestion avoidance +1 MSS per RTT, AIMD sawtooth, fast retransmit after 3 duplicate ACKs, Tahoe vs Reno (read both slide corrections: the p19 diagram is Tahoe, and the p20 halving event is 3 duplicate ACKs, not a timeout), throughput $\\min(cwnd, rwnd)/RTT$. Attempt every cwnd-trace worked problem round by round on paper.",
        "<b>10 min.</b> Run the Unit 11 cwnd simulation script. Change the initial ssthresh and the loss round, predict the cwnd sequence, then run it to check.",
        "<b>5 min.</b> End-of-day checkpoint below, without notes."
      ],
      checkpoint:
        "<p>Pass = 4 of 5 correct, each within 2 minutes.</p><ol>" +
        "<li>Frame transmission time 1 ms, one-way propagation 10 ms. Stop-and-wait utilisation? Window size needed for 100%?</li>" +
        "<li>Sequence numbers have 3 bits. Maximum sender window for GBN? For SR?</li>" +
        "<li>Compute the 8-bit 1's-complement checksum of 10010011 and 01010110.</li>" +
        "<li>cwnd = 1 MSS, ssthresh = 8 MSS, no loss. Write cwnd for rounds 1 to 7.</li>" +
        "<li>cwnd = 20 MSS when 3 duplicate ACKs arrive. New ssthresh and cwnd under Reno? Under Tahoe?</li></ol>" +
        "<details><summary>Answers</summary><ol>" +
        "<li>$a=10$, $U = 1/21 \\approx 4.76\\%$; $N \\ge 21$.</li>" +
        "<li>$2^3-1 = 7$; $2^{2} = 4$.</li>" +
        "<li>Sum 11101001 (no carry), checksum 00010110.</li>" +
        "<li>1, 2, 4, 8, 9, 10, 11.</li>" +
        "<li>Reno: ssthresh 10, cwnd 10 (Kurose's figure adds 3: 13), then linear growth. Tahoe: ssthresh 10, cwnd 1, slow start.</li></ol></details>"
    },
    {
      day: 5,
      title: "Load balancing, IPv4 and CIDR, subnetting and AWS VPC",
      minutes: 115,
      units: ["unit12", "unit13", "unit14"],
      tasks: [
        "<b>15 min.</b> <a href='#/unit/unit12'>Unit 12</a> load balancing and HA (12.1–12.9): NLB at L4 (4-tuple, static IP, source IP preserved) vs ALB at L7 (host/path routing, TLS termination, HTTP/HTTPS listeners only); target groups and health checks; Auto Scaling; multi-AZ availability $1-(1-p)^n$. Do the NLB vs ALB practice questions first: they are the most likely MCQs.",
        "<b>25 min.</b> <a href='#/unit/unit13'>Unit 13</a> IPv4 and CIDR (13.1–13.10): decimal ↔ binary, classful A/B/C ranges (read the slide correction: 172.16.1.10 is Class B, so the network part is 172.16), mask ↔ prefix, network/broadcast/first/last host, sizing 500 hosts → /23 (the block is 192.168.0.0/23, not 192.168.1.0/23), RFC 1918 ranges. Attempt every worked problem before reading it.",
        "<b>10 min, (optional but quick marks)</b> <a href='#/unit/unit13'>Unit 13</a> Extra (13.11): IPv4 header fields and fragmentation. Do the 4000-byte datagram over MTU 1500 worked problem (fragments of 1480, 1480, 1020 data bytes, offsets 0, 185, 370). Skip IPv6 and supernetting if behind.",
        "<b>30 min.</b> <a href='#/unit/unit14'>Unit 14</a> subnetting and AWS VPC (14.1–14.8, 15.14): borrowing $k$ bits gives $2^k$ subnets; the magic number 256 − 192 = 64; 10.0.0.0/24 → four /26 subnets; AWS reserves 5 addresses per subnet (/24 → 251, /20 → 4091); AWS allows /16 to /28; overlap test. Do every practice question; these are the highest-yield numericals in the course.",
        "<b>10 min.</b> Run the Unit 13 and Unit 14 subnet scripts. Then write <code>network = ip &amp; mask</code> and <code>broadcast = network | ~mask &amp; 0xFFFFFFFF</code> from memory and check them on 192.168.10.77/27.",
        "<b>10 min, (optional)</b> <a href='#/unit/unit14'>Unit 14</a> Extra VLSM drills (14.9): one allocation, largest subnet first.",
        "<b>10 min.</b> Learn the subnetting table in section 7 of the <a href='#/formulas'>formula sheet</a>: be able to write /24 to /30 (mask, block size, usable) from memory.",
        "<b>5 min.</b> End-of-day checkpoint below, without notes."
      ],
      checkpoint:
        "<p>Pass = all five correct without notes or a calculator.</p><ol>" +
        "<li>192.168.10.77/27: network address, broadcast address, first and last usable host.</li>" +
        "<li>Usable hosts in a /26: in a normal network, and in an AWS subnet?</li>" +
        "<li>Smallest prefix for 500 hosts?</li>" +
        "<li>Split 10.0.0.0/24 into 4 equal subnets: list them with prefix.</li>" +
        "<li>Two web servers in different AZs, each 99% available. Availability of the pair (at least one up)?</li></ol>" +
        "<details><summary>Answers</summary><ol>" +
        "<li>Block 32: network 192.168.10.64, broadcast 192.168.10.95, hosts .65 to .94.</li>" +
        "<li>$64-2 = 62$; $64-5 = 59$.</li>" +
        "<li>/23 ($2^9-2 = 510 \\ge 500$).</li>" +
        "<li>10.0.0.0/26, 10.0.0.64/26, 10.0.0.128/26, 10.0.0.192/26.</li>" +
        "<li>$1-(0.01)^2 = 0.9999$ = 99.99%.</li></ol></details>"
    },
    {
      day: 6,
      title: "NAT, PAT, DHCP and route tables, then Mock Exam 1",
      minutes: 120,
      units: ["unit15"],
      tasks: [
        "<b>20 min.</b> <a href='#/unit/unit15'>Unit 15</a> NAT and PAT (15.1–15.4, 15.9, 15.13): the source-IP rewrite at the border router, the PAT translation table with unique outside ports, the port-collision activity, one-to-one NAT vs PAT, and the static NAT lab. Fill in the PAT table yourself before opening the solution.",
        "<b>10 min.</b> <a href='#/unit/unit15'>Unit 15</a> DHCP (15.5, 15.11): DORA, Discover from 0.0.0.0:68 to 255.255.255.255:67, the lease contents, the relay agent (<code>ip helper-address</code>). Read the slide correction on which DORA messages are broadcast.",
        "<b>10 min.</b> <a href='#/unit/unit15'>Unit 15</a> route tables (15.6–15.8): longest-prefix match (10.0.1.55 → 10.0.1.0/24 beats 10.0.0.0/16), 0.0.0.0/0 default route, public route table → IGW, private route table → NAT gateway. Do the LPM practice questions.",
        "<b>10 min, (optional)</b> <a href='#/unit/unit15'>Unit 15</a> Extras (15.15): ARP, ICMP (ping, traceroute TTL), distance vector and link state. Read the cheat blocks; do one Dijkstra table only if you finished everything else this week.",
        "<b>55 min.</b> <a href='#/mock/mock1'>Mock Exam 1</a> under timed conditions: phone away, no notes, paper and pen only. The site timer shows the full exam length; give yourself a 55-minute hard stop: about 18 min for Section A (MCQ/MSQ), 22 min for Section B (numerical) and 15 min for Section C (coding: do the predict-output questions fully, and for the write-code questions write at least the function skeleton). Submit when the 55 minutes are up. (If you have a free evening, take the full timer instead.)",
        "<b>10 min.</b> Review: open the score report and its weak-unit diagnosis. For every wrong answer, read the explanation, then reopen the weakest unit's cheat block and redo its worked problem with the attempt-first method. Write each mistake on a “trap card” for Day 7.",
        "<b>5 min.</b> End-of-day checkpoint below, without notes."
      ],
      checkpoint:
        "<p>Pass = mock score of at least 60%, and you can answer these four.</p><ol>" +
        "<li>Three inside hosts share one public IP through PAT. What makes each translation-table entry unique on the outside?</li>" +
        "<li>Source and destination IP addresses and UDP ports of a DHCP Discover?</li>" +
        "<li>Routes 10.0.0.0/16 → local, 10.0.1.0/24 → eni-A, 0.0.0.0/0 → igw. Where does a packet to 10.0.1.55 go? To 8.8.8.8?</li>" +
        "<li>What route does a private subnet need so its instances can download updates?</li></ol>" +
        "<details><summary>Answers</summary><ol>" +
        "<li>The outside (translated) source port: public IP + unique port.</li>" +
        "<li>0.0.0.0:68 → 255.255.255.255:67.</li>" +
        "<li>eni-A (the /24 is the longest match); the IGW (only 0.0.0.0/0 matches).</li>" +
        "<li>0.0.0.0/0 → NAT gateway (which itself sits in a public subnet).</li></ol></details>"
    },
    {
      day: 7,
      title: "Drills, Mock Exam 2 and the Last-Night Formula Sheet",
      minutes: 120,
      units: [],
      tasks: [
        "<b>20 min.</b> <a href='#/drill/subnet'>Subnet &amp; Numerical Drill</a>: work through at least 15 questions at speed (about 1 minute each). Any question you miss, redo immediately without looking.",
        "<b>15 min.</b> <a href='#/drill/header'>Protocol &amp; Header Drill</a>: header sizes, field widths, flags, port numbers. Aim for 15 questions.",
        "<b>10 min.</b> <a href='#/drill/socket'>Socket Drill</a>: the predict-output and bug-hunt questions. Say the exact output aloud before checking.",
        "<b>55 min.</b> <a href='#/mock/mock2'>Mock Exam 2</a> under the same timed conditions as Mock 1: about 18 min Section A, 22 min Section B, 15 min Section C. Hard stop at 55 minutes.",
        "<b>10 min.</b> Review the Mock 2 score report. Compare the weak units with Mock 1: any unit that is weak in both gets its cheat block reread tonight.",
        "<b>10 min.</b> <a href='#/formulas'>Last-Night Formula Sheet</a>: read section 1 (all formulas), section 7 (subnetting), section 11 (exam traps) and section 12 (last-hour checklist). Re-read your trap cards from Day 6.",
        "<b>Tonight, (optional, 10 min)</b> Print the formula sheet (Print button at the top of that page) for a final look before the exam."
      ],
      checkpoint:
        "<p>You are ready if all of these are true:</p><ul>" +
        "<li>Mock 2 score of at least 70%, or at least 10 points above Mock 1.</li>" +
        "<li>You can write from memory: $L/R$, $d/s$, $(N+P-1)L/R$, $\\frac{1}{1+2a}$, $2^n-1$ and $2^{n-1}$, $2^{32-n}-2$ and $2^{32-n}-5$, $\\min(cwnd,rwnd)/RTT$.</li>" +
        "<li>You can draw the TCP 3-way handshake with numbers, the TLS 1.3 handshake, DHCP DORA and an iterative DNS lookup.</li>" +
        "<li>You can list ports 20, 21, 22, 23, 25, 53, 67, 68, 80, 110, 143, 443, 587, 993, 995 with their protocols.</li>" +
        "<li>You can write a TCP echo server and client, and a UDP client with <code>settimeout</code> and retries, without looking.</li></ul>"
    }
  ]
};
