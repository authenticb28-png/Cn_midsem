// Mock Exam 2: full 120-minute paper. Leans towards units 09–15 but touches all 15 units.
// Every number below was recomputed; Section C model solutions live in cn-practice/Mock2_C*.py.
// Note: in mocks the `unit` field holds the course unit (for the weakness diagnosis), so numerical
// answers state their measurement unit in the question text and in the first line of `explain`.
window.MOCKS = window.MOCKS || {};
window.MOCKS["mock2"] = {
  id: "mock2", title: "Mock Exam 2", minutes: 120,
  instructions:
    "<p><b>Format.</b> 34 questions, 80 marks, <b>120 minutes</b>. The timer starts when you press <i>Start timer</i> and the paper submits itself when it reaches 0:00. This paper concentrates on the second half of the course (transport, reliability, congestion control, load balancing, IPv4, subnetting, NAT/DHCP/routing) but still has at least one question from every unit.</p>" +
    "<ul>" +
    "<li><b>Section A — MCQ / MSQ (20 × 1 mark).</b> MCQ: exactly one correct option. MSQ (<i>select all that apply</i>): the mark is awarded only for exactly the correct set. No negative marking.</li>" +
    "<li><b>Section B — Numerical (10 × 2 marks).</b> Enter a number only, in the unit and rounding stated in the question. Answers within the tolerance are accepted. No partial marks.</li>" +
    "<li><b>Section C — Coding (4 × 5 marks).</b> C1 (find the bug) and C2 (predict the exact output) are auto-marked. C3 and C4 are <b>write-the-code</b> questions: after submitting, open the model solution under each one and give yourself 1 mark per rubric point you met. The score report lists these 10 marks as <i>pending</i>.</li>" +
    "</ul>" +
    "<p><b>Suggested pacing:</b> Section A 25 min · Section B 45 min · Section C 45 min · 5 min to review. Work on paper and do not run any code during the attempt.</p>" +
    "<p><b>Content mix:</b> about 80% course material and about 20% GATE-style extras (CRC, Hamming bits, CSMA/CD minimum frame, Selective Repeat sequence bits, IPv4 header checksum, distance-vector update). The unit-by-unit diagnosis after you submit tells you which units to redo first.</p>",
  sections: [
    {
      name: "Section A — MCQ / MSQ", marks: 1, negative: 0,
      questions: [
        { id: "m2-A-1", unit: "unit01", topic: "01.7", type: "msq", tag: "University-Midsem-style",
          q: "<p>Which statements about the structure of the Internet are correct? (Select all that apply.)</p>",
          options: [
            "The network edge consists of hosts: clients, servers and data-centre machines.",
            "An access network is the link(s) connecting a host to its first-hop (edge) router, for example DSL, cable, FTTH, Wi-Fi or 5G.",
            "The network core is a mesh of interconnected routers that forward packets using packet switching.",
            "Tier-1 ISPs buy transit from regional ISPs in order to reach the rest of the Internet."
          ],
          answer: [0, 1, 2],
          why: [
            "True. End systems run applications at the edge.",
            "True. This is the 'last mile' between the edge and the core.",
            "True. Routers in the core store and forward packets.",
            "False, it is the other way round: regional ISPs <i>buy</i> transit from tier-1 ISPs, and tier-1 ISPs peer with each other without paying. The Internet is a 'network of networks'."
          ],
          explain: "<p>Edge (hosts) → access network → core (routers, ISPs at several tiers, IXPs and content-provider networks such as Google's).</p>" },

        { id: "m2-A-2", unit: "unit02", topic: "02.4", type: "mcq", tag: "University-Midsem-style",
          q: "<p>A 1 Mbps link is shared by users who each send at 100 kbps when active and are active 10% of the time. Under <b>circuit switching</b>, how many users can the link support?</p>",
          options: ["1", "10", "35", "100"],
          answer: 1,
          why: [
            "One user needs only 100 kbps, so the link has room for more.",
            "Correct. Each circuit reserves 100 kbps whether the user is active or not: 1 Mbps / 100 kbps = 10.",
            "About 35 is the packet-switching figure (Kurose &amp; Ross §1.3): with 35 users the chance that more than 10 are active at once is below 0.0004. That is the gain from statistical multiplexing.",
            "100 would need every user's 100 kbps at once, which is 10 Mbps."
          ],
          explain: "<p>Circuit switching sizes for the peak; packet switching sizes for the average and accepts a tiny chance of queuing or loss (WB-L02 p9–10).</p>" },

        { id: "m2-A-3", unit: "unit03", topic: "03.11", type: "mcq", tag: "University-Midsem-style",
          q: "<p>In the 4-layer TCP/IP model, which layer performs the work of OSI's Session and Presentation layers (dialog control, data formats, compression, encryption such as TLS)?</p>",
          options: ["Application", "Transport", "Internet", "Network access (link)"],
          answer: 0,
          why: [
            "Correct. TCP/IP merges OSI layers 5, 6 and 7 into its Application layer; applications and libraries (TLS, JSON, gzip) do this work themselves.",
            "Transport (TCP/UDP) provides ports, reliability and flow control, but not data formats or sessions in the OSI sense.",
            "Internet (IP) handles addressing and routing.",
            "Network access covers OSI layers 1 and 2: framing, MAC and bits."
          ],
          explain: "<p>Mapping: OSI 7+6+5 → Application; 4 → Transport; 3 → Internet; 2+1 → Network access (WB-L03 p30–32).</p>" },

        { id: "m2-A-4", unit: "unit04", topic: "04.3", type: "mcq", tag: "University-Midsem-style",
          q: "<p>Two firewalls have the same rule: <i>allow inbound TCP to port 443, deny all other inbound</i>. One is stateless, the other stateful. What can the <b>stateful</b> firewall do that the stateless one cannot?</p>",
          options: [
            "Filter on port numbers as well as IP addresses.",
            "Track connections, so it automatically allows the replies to connections that inside hosts started, and drops unsolicited packets that belong to no known connection.",
            "Operate at layer 1 on electrical signals.",
            "Decrypt every HTTPS payload without any certificate."
          ],
          answer: 1,
          why: [
            "Stateless packet filters already match on IP, protocol and port (WB-L04 p14–17).",
            "Correct. A stateful firewall keeps a connection table (5-tuple and TCP state). A stateless filter judges each packet alone, so it needs extra rules for return traffic and cannot tell a genuine reply from a forged one.",
            "Firewalls work at layer 3 and above, never on raw signals.",
            "TLS cannot be decrypted without the keys. Inspecting HTTPS needs a proxy that terminates TLS with its own certificate."
          ],
          explain: "<p>AWS example: security groups are <b>stateful</b> (return traffic is allowed automatically); network ACLs are <b>stateless</b> (you write rules for both directions).</p>" },

        { id: "m2-A-5", unit: "unit05", topic: "05.10", type: "msq", tag: "University-Midsem-style",
          q: "<p>Which statements about HTTP/3 are correct? (Select all that apply.)</p>",
          options: [
            "HTTP/3 runs over QUIC, which runs over UDP.",
            "QUIC builds TLS 1.3 into its handshake, so a new connection needs about 1 RTT before data (0-RTT when resuming).",
            "HTTP/3 needs a TCP three-way handshake before QUIC starts.",
            "A lost packet blocks only the stream whose data it carried, not all streams."
          ],
          answer: [0, 1, 3],
          why: [
            "True (WB-L05 p36–38): the stack is HTTP/3 / QUIC / UDP / IP.",
            "True. Transport setup and crypto setup are combined into one RTT instead of TCP's 1 RTT followed by TLS.",
            "False. There is no TCP at all; QUIC provides reliability and ordering per stream in user space over UDP.",
            "True. This removes the TCP-level head-of-line blocking that HTTP/2 suffers from."
          ],
          explain: "<p>DevTools shows h2 or h3 in the Protocol column (WB-L05 p37). QUIC also allows connection migration (for example, Wi-Fi → 5G) because it identifies connections by an ID, not by the 4-tuple.</p>" },

        { id: "m2-A-6", unit: "unit06", topic: "06.6", type: "mcq", tag: "University-Midsem-style",
          q: "<p>During the handshake for <code>https://www.canva.com</code> the server sends a leaf certificate for <code>*.canva.com</code> and an intermediate CA certificate. How does the browser decide whether to trust it?</p>",
          options: [
            "It trusts any certificate that arrives over port 443.",
            "It checks the leaf's signature with the intermediate's public key, checks the intermediate's signature with a root CA public key already in its trust store, and checks that the hostname matches *.canva.com and the dates are valid.",
            "It contacts the root CA during every handshake to download the root's private key.",
            "It accepts the certificate only if canva.com signed it itself (self-signed)."
          ],
          answer: 1,
          why: [
            "A man-in-the-middle can also send a certificate on port 443. Trust comes from the signature chain, not from the port.",
            "Correct. Chain of trust: leaf → intermediate → root, which is pre-installed in the OS or browser. A look-alike domain (for example, with a Cyrillic 'о', WB-L06 p16) fails the hostname check.",
            "Private keys never leave their owner. Verification uses only public keys, which the root already has in the trust store.",
            "A self-signed certificate proves nothing to the browser and triggers a warning; a trusted CA must sign it."
          ],
          explain: "<p>A certificate binds a domain name to a public key, signed by a CA. That is what defeats the MITM key-substitution attack (WB-L08 p99–103).</p>" },

        { id: "m2-A-7", unit: "unit07", topic: "07.6", type: "mcq", tag: "University-Midsem-style",
          q: "<p>An app runs in ap-south-1 (Mumbai) and us-east-1 (Virginia). Route 53 should answer each user with the endpoint in the Region that gives that user the lowest network latency. Which routing policy is this?</p>",
          options: ["Weighted", "Failover", "Latency-based", "Simple"],
          answer: 2,
          why: [
            "Weighted splits traffic by fixed percentages (for example 90/10 for a canary), whatever the user's latency.",
            "Failover sends everything to the primary and switches to the secondary only when health checks fail.",
            "Correct. Route 53 uses its measured latency between the user's network and each AWS Region and returns the faster Region's record.",
            "Simple returns one record set, with no per-user logic."
          ],
          explain: "<p>Other policies: geolocation (by the user's country or continent), geoproximity, multivalue answer. All of them are DNS answers, so clients follow them only after the record's TTL expires.</p>" },

        { id: "m2-A-8", unit: "unit08", topic: "08.2", type: "mcq", tag: "University-Midsem-style",
          q: "<p>A student reads mail on a phone and a laptop and wants folders and read/unread flags to stay in sync on both. Which retrieval protocol and secure port fit?</p>",
          options: ["POP3 on 110", "IMAP on 993", "SMTP on 587", "POP3 on 995"],
          answer: 1,
          why: [
            "POP3 normally downloads and deletes, so the second device never sees the mail. Port 110 is also unencrypted.",
            "Correct. IMAP keeps mail and folders on the server and synchronises state across devices (WB-L07 p9–14); 993 is IMAP over TLS.",
            "SMTP <i>sends</i> mail (client submission on 587); it cannot read a mailbox.",
            "TLS fixes the encryption, but POP3 still does not sync folders and flags."
          ],
          explain: "<p>Push (SMTP 25/587/465) vs pull (IMAP 143/993, POP3 110/995).</p>" },

        { id: "m2-A-9", unit: "unit09", topic: "09.8", type: "msq", tag: "GATE-style",
          q: "<p>Which statements about closing a TCP connection are correct? (Select all that apply.)</p>",
          options: [
            "A normal close uses a FIN and an ACK in each direction, 4 segments in all (the middle ACK and FIN may be combined).",
            "The side that sends the first FIN (the active closer) ends in TIME_WAIT for 2 × MSL.",
            "TIME_WAIT lets the final ACK be resent if the peer's FIN is retransmitted, and lets old duplicate segments die out before the same 4-tuple is reused.",
            "After the first FIN, neither side may send any more data."
          ],
          answer: [0, 1, 2],
          why: [
            "True (SL-L09 p21): FIN → ACK, then FIN → ACK, because each direction closes independently.",
            "True. MSL is the maximum segment lifetime; 2 × MSL covers one FIN retransmission plus the reply.",
            "True. These are the two reasons RFC 9293 gives for TIME_WAIT.",
            "False. TCP is full duplex: after A sends FIN, B can keep sending data (half-close) until B sends its own FIN."
          ],
          explain: "<p>States: active closer FIN_WAIT_1 → FIN_WAIT_2 → TIME_WAIT → CLOSED; passive closer CLOSE_WAIT → LAST_ACK → CLOSED.</p>" },

        { id: "m2-A-10", unit: "unit10", topic: "10.7", type: "mcq", tag: "University-Midsem-style",
          q: "<p>A TCP receiver's buffer fills and it advertises <code>rwnd = 0</code>. What does the sender do?</p>",
          options: [
            "Closes the connection with RST.",
            "Stops sending data and periodically sends small zero-window probes, backing off exponentially (1, 2, 4, 8 s) until a non-zero window is advertised.",
            "Halves cwnd, because a zero window means congestion.",
            "Keeps sending at half speed so that the receiver catches up."
          ],
          answer: 1,
          why: [
            "A full buffer is normal flow control, not an error.",
            "Correct (SL-L10 p19–21). The persist timer makes sure the connection does not deadlock if the window-update ACK is lost.",
            "rwnd is about the <b>receiver's</b> buffer (flow control); cwnd is about the <b>network</b> (congestion control). They are separate mechanisms.",
            "Any data sent beyond rwnd = 0 would overflow the receiver and be dropped."
          ],
          explain: "<p>The sender's effective window is min(cwnd, rwnd). With rwnd = 0 only window probes are allowed.</p>" },

        { id: "m2-A-11", unit: "unit10", topic: "10.11", type: "mcq", tag: "GATE-style",
          q: "<p>The message <code>1101011011</code> is sent with CRC generator <code>10011</code> ($x^4 + x + 1$). What CRC bits are appended?</p>",
          options: ["1110", "1011", "0111", "0000"],
          answer: 0,
          why: [
            "Correct. Append 4 zeros (degree 4) to get 11010110110000 and divide modulo 2 (XOR, no borrows) by 10011. The remainder is 1110, so the transmitted frame is 11010110111110.",
            "1011 is the remainder of the message itself (1101011011 ÷ 10011) when you forget to append the 4 zeros first.",
            "0111 is the remainder when only 3 zeros are appended. The number of zeros must equal the generator degree, which is 4 (generator length 5 minus 1).",
            "A remainder of 0000 would mean the message was already divisible by the generator; it is not."
          ],
          explain: "<p>Check: dividing 11010110111110 by 10011 leaves remainder 0, so the receiver accepts the frame. With r = 4 check bits this CRC detects every single-bit error (the generator has more than one term) and every burst error of length 4 or less.</p>" },

        { id: "m2-A-12", unit: "unit11", topic: "11.5", type: "msq", tag: "University-Midsem-style",
          q: "<p>SL-L11 p13 plots cwnd per transmission round as 1, 2, 4, 8, 9, 10, 11, 12, with ssthresh = 8 and a loss in round 8. Which statements are true? (Select all that apply.)</p>",
          options: [
            "Rounds 1–4 are slow start (cwnd doubles every RTT).",
            "From round 5, TCP is in congestion avoidance and adds 1 MSS per RTT.",
            "If the loss in round 8 is a timeout, the new ssthresh is 6 and cwnd becomes 1 MSS.",
            "If the loss in round 8 is detected by 3 duplicate ACKs (Reno), cwnd becomes 1 MSS."
          ],
          answer: [0, 1, 2],
          why: [
            "True: 1 → 2 → 4 → 8.",
            "True: on reaching ssthresh = 8, growth becomes linear: 9, 10, 11, 12.",
            "True: ssthresh = 12 / 2 = 6, cwnd = 1, then slow start again.",
            "False: Reno sets cwnd = ssthresh = 6 and continues linearly. Only Tahoe, or a timeout, drops to 1."
          ],
          explain: "<p>Slow start ends when cwnd reaches ssthresh or when a loss occurs. ssthresh is always set to half of cwnd at the moment of loss.</p>" },

        { id: "m2-A-13", unit: "unit11", topic: "11.10", type: "mcq", tag: "University-Midsem-style",
          q: "<p>SL-L11 p19 shows cwnd = 8 dropping to <b>cwnd = 1</b>, with ssthresh = 4, right after the third duplicate ACK. Which TCP variant behaves like this?</p>",
          options: [
            "Reno, because Reno always restarts from 1 after 3 duplicate ACKs.",
            "Tahoe, because it treats every loss (timeout or 3 duplicate ACKs) by setting cwnd = 1 and re-entering slow start.",
            "CUBIC, because it is the Linux default.",
            "None, because no TCP version reacts to 3 duplicate ACKs."
          ],
          answer: 1,
          why: [
            "Reno's fast recovery halves cwnd (8 → 4) after 3 duplicate ACKs; it does not restart at 1.",
            "Correct. Tahoe has fast retransmit but no fast recovery. The slide's own text ('enters Congestion Avoidance directly') describes Reno, so the diagram contradicts it (UNCLEAR B2).",
            "CUBIC reduces its window multiplicatively (to about 0.7 × W_max) and then follows a cubic curve; it does not drop to 1 on duplicate ACKs.",
            "Tahoe, Reno and CUBIC all use 3 duplicate ACKs as the fast-retransmit trigger."
          ],
          explain: "<p>Exam rule: <b>timeout → 1 MSS</b> (every variant); <b>3 duplicate ACKs → Tahoe: 1 MSS, Reno: cwnd/2</b>.</p>" },

        { id: "m2-A-14", unit: "unit12", topic: "12.2", type: "msq", tag: "University-Midsem-style",
          q: "<p>Client 203.0.113.10:51514 connects to an NLB at 198.51.100.25:443. Targets 10.0.1.10 and 10.0.1.11 are healthy; 10.0.1.12 is unhealthy (SL-L12 p8). Which statements are true? (Select all that apply.)</p>",
          options: [
            "The NLB chooses a target using the layer-4 4-tuple.",
            "The chosen target sees source IP 203.0.113.10, the client's original address.",
            "The NLB may still send the connection to 10.0.1.12, since it is in the target group.",
            "The NLB can send /api/* requests to a different target group."
          ],
          answer: [0, 1],
          why: [
            "True: source IP, source port, destination IP, destination port.",
            "True: NLB preserves the client source IP end to end, and the reply goes from 10.0.1.10:443 back to 203.0.113.10:51514.",
            "False: health checks remove unhealthy targets from rotation.",
            "False: path routing needs layer-7 parsing, which is an ALB feature."
          ],
          explain: "<p>NLB: layer 4, very fast, client IP preserved, cannot read URLs. ALB: layer 7, path/host rules, TLS termination.</p>" },

        { id: "m2-A-15", unit: "unit12", topic: "12.6", type: "mcq", tag: "University-Midsem-style",
          q: "<p>A target group health check is <code>GET /health</code> every 30 s. On one EC2 instance the database dependency fails, so <code>/health</code> starts returning HTTP 500 (SL-L12 p16). What happens?</p>",
          options: [
            "Nothing, because the instance still accepts TCP connections.",
            "After the configured number of consecutive failed checks, the load balancer marks the target unhealthy and stops routing new requests to it; an Auto Scaling group can then replace it.",
            "The load balancer restarts the database.",
            "Clients keep receiving 500 errors until an engineer removes the instance by hand."
          ],
          answer: 1,
          why: [
            "That would be true only for a plain TCP health check. An HTTP check needs a 200 response.",
            "Correct. This is self-healing (SL-L12 p17): traffic goes to the healthy targets, and an ASG with ELB health checks terminates and replaces the failed instance.",
            "Load balancers only probe and route; they do not manage the application's dependencies.",
            "Removing unhealthy targets is automatic. That is the point of a target group."
          ],
          explain: "<p>Worst-case detection time ≈ interval × unhealthy threshold, for example 30 s × 3 = 90 s.</p>" },

        { id: "m2-A-16", unit: "unit13", topic: "13.9", type: "msq", tag: "University-Midsem-style",
          q: "<p>Which addresses are RFC 1918 private addresses? (Select all that apply.)</p>",
          options: ["172.31.255.254", "172.32.0.1", "192.168.10.10", "100.64.0.1"],
          answer: [0, 2],
          why: [
            "Private: 172.16.0.0/12 runs from 172.16.0.0 to 172.31.255.255. (AWS's default VPC is 172.31.0.0/16.)",
            "Public: 172.32 is just outside 172.16.0.0/12.",
            "Private: inside 192.168.0.0/16.",
            "Not RFC 1918: 100.64.0.0/10 is a separate block reserved for carrier-grade NAT (shared address space). It is not one of the three private blocks."
          ],
          explain: "<p>The three RFC 1918 blocks: 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16. Routers on the public Internet do not route them, which is why NAT is needed.</p>" },

        { id: "m2-A-17", unit: "unit13", topic: "13.3", type: "mcq", tag: "University-Midsem-style",
          q: "<p>Under classful addressing, what is the network part of <code>172.16.1.10</code>?</p>",
          options: ["172", "172.16", "172.16.1", "172.16.1.10"],
          answer: 1,
          why: [
            "One octet of network would be Class A (first octet 1–126).",
            "Correct. First octet 172 is in 128–191 (leading bits 10), so it is Class B: network = first two octets 172.16, host = 1.10.",
            "This is the split shown on SL-L13 p11 and SL-L14 p3, and it is a slide error (UNCLEAR B4); three network octets would be Class C (192–223).",
            "The full address includes the host part."
          ],
          explain: "<p>Class B: $2^{14} = 16{,}384$ networks, each with $2^{16} - 2 = 65{,}534$ hosts. The slides' '~65,000' and '64,000' are approximations (UNCLEAR B7).</p>" },

        { id: "m2-A-18", unit: "unit14", topic: "14.7", type: "mcq", tag: "University-Midsem-style",
          q: "<p>Inside a VPC with CIDR 10.0.0.0/16, which subnet CIDR will AWS <b>reject</b>?</p>",
          options: ["10.0.0.0/16", "10.0.1.0/24", "10.0.2.0/28", "10.0.3.0/29"],
          answer: 3,
          why: [
            "Allowed: a subnet may be as large as the whole VPC.",
            "Allowed: the usual /24, which gives 251 usable addresses in AWS.",
            "Allowed: /28 is the smallest size AWS accepts (16 − 5 = 11 usable).",
            "Rejected: AWS subnet and VPC sizes must be between /16 and /28 (SL-L14 p18–19). A /29 would leave only 8 − 5 = 3 usable addresses."
          ],
          explain: "<p>AWS limits: /16 to /28. Subnets must not overlap, must fit inside the VPC CIDR, and cannot be resized after creation.</p>" },

        { id: "m2-A-19", unit: "unit15", topic: "15.5", type: "msq", tag: "University-Midsem-style",
          q: "<p>Which statements about DHCP (DORA) are correct? (Select all that apply.)</p>",
          options: [
            "DHCP Discover is sent from 0.0.0.0 to 255.255.255.255.",
            "The client uses UDP port 68 and the server UDP port 67.",
            "Offer and Ack are always unicast.",
            "The lease gives an IP address, subnet mask, default gateway and DNS server(s), valid for a limited time."
          ],
          answer: [0, 1, 3],
          why: [
            "True. The client has no address yet and does not know the server, so it broadcasts.",
            "True (RFC 2131).",
            "False. Offer and Ack are broadcast or unicast depending on the client's broadcast flag. SL-L15 p16's capture shows all four messages broadcast, while its bullet says only Discover and Request are broadcast (UNCLEAR B12).",
            "True (SL-L15 p13). The client renews at half the lease time (T1)."
          ],
          explain: "<p>DORA: Discover (broadcast) → Offer → Request (broadcast, so other servers learn their offer was declined) → Ack. On another subnet, a relay (<code>ip helper-address</code>) forwards it as unicast to the server.</p>" },

        { id: "m2-A-20", unit: "unit15", topic: "15.15", type: "mcq", tag: "GATE-style",
          q: "<p>Distance-vector routing: router A has neighbours B (link cost 2) and C (link cost 5). B advertises a distance of 7 to destination D; C advertises 3. What is A's new distance to D, and which next hop does it use?</p>",
          options: ["7 via B", "8 via C", "9 via B", "3 via C"],
          answer: 1,
          why: [
            "7 is B's own distance; it leaves out the cost of A's link to B.",
            "Correct. Bellman-Ford: $D_A(D) = \\min(c(A,B) + D_B(D),\\ c(A,C) + D_C(D)) = \\min(2+7,\\ 5+3) = \\min(9, 8) = 8$ via C.",
            "9 is the path through B, which costs more than 8.",
            "3 is C's distance without A's link cost of 5."
          ],
          explain: "<p>Each router knows only its neighbours' vectors and its own link costs. Count-to-infinity (bad news travels slowly) is reduced by split horizon and poison reverse; RIP caps the metric at 16 = infinity.</p>" }
      ]
    },
    {
      name: "Section B — Numerical", marks: 2,
      questions: [
        { id: "m2-B-1", unit: "unit04", topic: "04.11", type: "num", tag: "GATE-style",
          q: "<p>A CSMA/CD LAN runs at 10 Mbps, the two farthest stations are 2 km apart, and the signal speed is $2\\times10^8$ m/s. What is the minimum frame size, in <b>bytes</b>, that guarantees a sender is still transmitting when a collision from the far end reaches it? Answer as an integer.</p>",
          answer: 25, tol: 0,
          verify: "2*(2000/2e8)*10e6/8",
          formula: "L_{min} = 2\\,T_p\\,R",
          steps: [
            { tex: "T_p = \\frac{2000}{2\\times10^{8}} = 10\\,\\mu\\text{s}", why: "One-way propagation across the longest path." },
            { tex: "\\text{worst case} = 2T_p = 20\\,\\mu\\text{s}", why: "The far station starts just before A's first bit arrives; its collision signal then needs another T_p to return to A." },
            { tex: "L_{min} = 20\\times10^{-6} \\times 10^{7} = 200\\,\\text{bits}", why: "A must still be transmitting for 2T_p, so the frame must contain at least R × 2T_p bits." },
            { tex: "\\frac{200}{8} = 25\\,\\text{bytes}", why: "Convert bits to bytes as asked." }
          ],
          explain: "<p><b>Answer: 25 bytes.</b></p><p>Classic Ethernet sets 512 bits (64 bytes) to cover 2500 m with repeaters. Faster links need larger minimum frames or shorter cables.</p>" },

        { id: "m2-B-2", unit: "unit09", topic: "09.10", type: "num", tag: "University-Midsem-style",
          q: "<p>An IPv4 datagram has Total Length 1500 and IHL = 5. It carries a TCP segment whose header byte 12 is <code>0x80</code>. How many bytes of <b>application data</b> does it carry? Answer as an integer.</p>",
          answer: 1448, tol: 0,
          verify: "1500 - 5*4 - 8*4",
          formula: "\\text{data} = \\text{TotalLength} - 4\\cdot IHL - 4\\cdot\\text{DataOffset}",
          steps: [
            { tex: "\\text{IP header} = 5 \\times 4 = 20\\,\\text{B}", why: "IHL counts 32-bit words." },
            { tex: "\\text{DataOffset} = 0x8 = 8 \\Rightarrow 8 \\times 4 = 32\\,\\text{B}", why: "The upper nibble of byte 12 is the TCP data offset, also in 32-bit words, so this header has 12 bytes of options." },
            { tex: "1500 - 20 - 32 = 1448\\,\\text{B}", why: "Total Length covers the IP header and its whole payload, so subtract both headers." }
          ],
          explain: "<p><b>Answer: 1448 bytes.</b></p><p>1448 is the payload size you often see in real captures: the 1460-byte no-options MSS minus 12 bytes of TCP timestamp options.</p>" },

        { id: "m2-B-3", unit: "unit10", topic: "10.11", type: "num", tag: "GATE-style",
          q: "<p>A single-error-correcting Hamming code protects a block of <b>64 data bits</b>. What is the minimum number of check (parity) bits? Answer as an integer.</p>",
          answer: 7, tol: 0,
          verify: "min(r for r in range(1, 20) if 2**r >= 64 + r + 1)",
          formula: "2^{r} \\ge m + r + 1",
          steps: [
            { tex: "2^{r} \\ge m + r + 1", why: "The r check bits must name every one of the m + r bit positions plus the 'no error' case." },
            { tex: "r = 6:\\ 2^{6} = 64 < 64 + 6 + 1 = 71", why: "Six check bits are not enough." },
            { tex: "r = 7:\\ 2^{7} = 128 \\ge 64 + 7 + 1 = 72", why: "Seven bits are enough, so 7 is the minimum." }
          ],
          explain: "<p><b>Answer: 7 check bits.</b></p><p>For Hamming(7,4): m = 4 needs r = 3, since $2^3 = 8 \\ge 4 + 3 + 1$. Check bits sit at the power-of-two positions 1, 2, 4, 8, 16, 32 and 64.</p>" },

        { id: "m2-B-4", unit: "unit10", topic: "10.10", type: "num", tag: "GATE-style",
          q: "<p>A 1 Mbps link has a one-way propagation delay of 18 ms. Frames are 1000 bytes, and ACKs and processing are negligible. Using <b>Selective Repeat</b>, what is the minimum number of sequence-number bits that lets the sender keep the link fully busy? Answer as an integer.</p>",
          answer: 4, tol: 0,
          verify: "math.ceil(math.log2(2*math.ceil(1 + 2*18/8)))",
          formula: "W \\ge 1 + 2a,\\quad W_{SR} \\le 2^{n-1}",
          steps: [
            { tex: "T_f = \\frac{1000\\times8}{10^{6}} = 8\\,\\text{ms},\\quad a = \\frac{T_p}{T_f} = \\frac{18}{8} = 2.25", why: "Frame time and the ratio a." },
            { tex: "W \\ge 1 + 2a = 5.5 \\Rightarrow W = 6", why: "To send continuously, the window must cover one frame time plus a round trip; windows are whole frames, so round up." },
            { tex: "2^{n-1} \\ge 6 \\Rightarrow n - 1 \\ge 3", why: "The SR window may be at most half the sequence space; 2^2 = 4 is too small and 2^3 = 8 is enough." },
            { tex: "n = 4", why: "Minimum number of bits." }
          ],
          explain: "<p><b>Answer: 4 bits.</b></p><p>With Go-Back-N the condition is $2^n - 1 \\ge 6$, which gives n = 3. SR needs one more bit.</p>" },

        { id: "m2-B-5", unit: "unit11", topic: "11.10", type: "num", tag: "GATE-style",
          q: "<p>A TCP Reno connection starts with cwnd = 1 MSS in RTT 1 and ssthresh = 16 MSS. Slow start doubles cwnd each RTT until it reaches ssthresh; after that it grows by 1 MSS per RTT. Three duplicate ACKs are detected during RTT 9, and a timeout occurs during RTT 12. Each event changes the cwnd used in the <b>next</b> RTT. What is cwnd, in <b>MSS</b>, during RTT 15?</p>",
          answer: 4, tol: 0,
          verify: "1*2*2",
          formula: "\\text{3 dup ACKs: } ss = \\tfrac{cwnd}{2},\\ cwnd = ss; \\quad \\text{timeout: } ss = \\tfrac{cwnd}{2},\\ cwnd = 1",
          steps: [
            { tex: "\\text{RTT 1–5: } 1, 2, 4, 8, 16", why: "Slow start doubles until cwnd reaches ssthresh = 16." },
            { tex: "\\text{RTT 6–9: } 17, 18, 19, 20", why: "Congestion avoidance adds 1 MSS per RTT." },
            { tex: "ss = \\frac{20}{2} = 10,\\ cwnd = 10 \\Rightarrow \\text{RTT 10–12: } 10, 11, 12", why: "Reno fast recovery after 3 duplicate ACKs in RTT 9 halves the window and continues linearly." },
            { tex: "ss = \\frac{12}{2} = 6,\\ cwnd = 1", why: "A timeout during RTT 12 (cwnd 12) halves ssthresh and resets cwnd to 1 MSS." },
            { tex: "\\text{RTT 13–15: } 1, 2, 4", why: "Slow start again; 4 is still below ssthresh = 6." }
          ],
          explain: "<p><b>Answer: 4 MSS.</b></p><p>Trap: Tahoe would give 1 after RTT 9 (RTT 10–12: 1, 2, 4), then ssthresh = 2 after the timeout, and RTT 13–15: 1, 2, 3. <b>Slide fix:</b> SL-L11 p20 labels a halving (18 → 9) as a 'tcp timeout'. A timeout always resets to 1; halving comes from 3 duplicate ACKs (UNCLEAR B3).</p>" },

        { id: "m2-B-6", unit: "unit12", topic: "12.8", type: "num", tag: "University-Midsem-style",
          q: "<p>Evening traffic peaks at 50,000 concurrent users (SL-L12 p18). Each EC2 instance can serve at most 600 users. The Auto Scaling group spreads instances <b>evenly across 2 AZs</b> and must still carry the full peak if one whole AZ fails. What is the minimum <b>total</b> number of instances? Answer as an integer.</p>",
          answer: 168, tol: 0,
          verify: "2*math.ceil(50000/600)",
          formula: "N = \\#AZ \\times \\left\\lceil \\frac{\\text{load}}{\\text{capacity}} \\right\\rceil",
          steps: [
            { tex: "\\frac{50000}{600} = 83.33", why: "Instances needed to carry the peak." },
            { tex: "\\lceil 83.33 \\rceil = 84", why: "You cannot run a fraction of an instance, so round up." },
            { tex: "\\text{each AZ} \\ge 84", why: "If either AZ fails, the surviving AZ alone must carry all 50,000 users." },
            { tex: "N = 2 \\times 84 = 168", why: "Even spread across both AZs." }
          ],
          explain: "<p><b>Answer: 168 instances.</b></p><p>Without the AZ-failure requirement, 84 would be enough. Multi-AZ HA trades extra capacity for surviving the loss of a data centre (SL-L12 p21–25).</p>" },

        { id: "m2-B-7", unit: "unit13", topic: "13.11", type: "num", tag: "GATE-style",
          q: "<p>An IPv4 header (checksum field set to 0000) is, in 16-bit hex words: <code>4500 003C 1C46 4000 4006 0000 AC10 0A63 AC10 0A0C</code>. Compute the header checksum and give it as a <b>decimal integer</b>.</p>",
          answer: 45542, tol: 0,
          verify: "65535 - ((0x4500+0x003C+0x1C46+0x4000+0x4006+0x0000+0xAC10+0x0A63+0xAC10+0x0A0C) % 65536 + (0x4500+0x003C+0x1C46+0x4000+0x4006+0x0000+0xAC10+0x0A63+0xAC10+0x0A0C) // 65536)",
          formula: "\\text{checksum} = \\overline{\\sum_{1's} w_i}",
          steps: [
            { tex: "\\sum w_i = \\text{0x24E17}", why: "Add the ten 16-bit words as ordinary integers, with the checksum word counted as 0." },
            { tex: "\\text{0x4E17} + \\text{0x2} = \\text{0x4E19}", why: "End-around carry: fold the bits above 16 (0x2) back into the low 16 bits." },
            { tex: "\\text{0xFFFF} - \\text{0x4E19} = \\text{0xB1E6}", why: "The 1's complement of a 16-bit value is 0xFFFF minus it, which flips every bit." },
            { tex: "\\text{0xB1E6} = 11\\cdot4096 + 1\\cdot256 + 14\\cdot16 + 6 = 45542", why: "Convert hex to decimal as asked." }
          ],
          explain: "<p><b>Answer: 45542 (0xB1E6).</b></p><p>Receiver check: 0x4E19 + 0xB1E6 = 0xFFFF. The header is TCP (protocol 0x06), TTL 64, DF set, from 172.16.10.99 to 172.16.10.12. Routers recompute this checksum at every hop because the TTL changes.</p>" },

        { id: "m2-B-8", unit: "unit14", topic: "14.6", type: "num", tag: "University-Midsem-style",
          q: "<p>VPC <code>10.20.0.0/16</code> must be divided into equal-sized subnets, at least <b>50</b> of them, borrowing as few bits as possible. How many addresses per subnet can you actually assign to instances in <b>AWS</b>? Answer as an integer.</p>",
          answer: 1019, tol: 0,
          verify: "2**(32 - (16 + math.ceil(math.log2(50)))) - 5",
          formula: "2^{k} \\ge S,\\quad \\text{AWS usable} = 2^{32-(p+k)} - 5",
          steps: [
            { tex: "2^{5} = 32 < 50 \\le 2^{6} = 64 \\Rightarrow k = 6", why: "Borrow the fewest bits that give at least 50 subnets." },
            { tex: "16 + 6 = /22", why: "The new prefix length." },
            { tex: "2^{32-22} = 2^{10} = 1024", why: "Addresses in each /22." },
            { tex: "1024 - 5 = 1019", why: "AWS reserves 5 in every subnet: network, VPC router, DNS, future use and broadcast." }
          ],
          explain: "<p><b>Answer: 1019 addresses.</b></p><p>The generic networking answer would be 1022 (−2). <b>Slide fix:</b> SL-L13 p23 quotes the generic counts (65,534 and 254) for an AWS VPC; in AWS they are 65,531 and 251 (UNCLEAR B8).</p>" },

        { id: "m2-B-9", unit: "unit15", topic: "15.11", type: "num", tag: "University-Midsem-style",
          q: "<p>DHCP lab: a router serves a pool for <code>192.168.10.0/24</code>, and <code>ip dhcp excluded-address 192.168.10.1 192.168.10.10</code> keeps the gateway and servers out of the pool. How many addresses can the pool lease to clients? Answer as an integer.</p>",
          answer: 244, tol: 0,
          verify: "(2**8 - 2) - (10 - 1 + 1)",
          formula: "\\text{leasable} = (2^{h} - 2) - \\text{excluded}",
          steps: [
            { tex: "2^{8} - 2 = 254", why: "Usable host addresses in a /24 (.1 to .254); the network .0 and broadcast .255 are never leased." },
            { tex: "10 - 1 + 1 = 10", why: "The excluded range .1 to .10 is inclusive, so it holds 10 addresses." },
            { tex: "254 - 10 = 244", why: "Addresses left to lease (.11 to .254)." }
          ],
          explain: "<p><b>Answer: 244 addresses.</b></p><p>Trap: counting the excluded range as 10 − 1 = 9 gives 245. If clients get 169.254.x.x (APIPA) addresses instead, DHCP failed (a Gaming LAN lab observation).</p>" },

        { id: "m2-B-10", unit: "unit13", topic: "13.6", type: "num", tag: "University-Midsem-style",
          q: "<p>Host <code>200.10.5.77/27</code>. What is the <b>last octet</b> of its subnet's broadcast address? Answer as an integer.</p>",
          answer: 95, tol: 0,
          verify: "(77 // 32) * 32 + 32 - 1",
          formula: "\\text{block} = 2^{32-p},\\ \\text{bcast} = \\text{network} + \\text{block} - 1",
          steps: [
            { tex: "\\text{block} = 2^{32-27} = 32", why: "A /27 leaves 5 host bits; the mask's last octet is 224, and the magic number is 256 − 224 = 32." },
            { tex: "\\lfloor 77/32 \\rfloor \\times 32 = 2 \\times 32 = 64", why: "Network = the largest multiple of 32 not above 77 (the same as 77 AND 224)." },
            { tex: "64 + 32 - 1 = 95", why: "Broadcast = network with all host bits set to 1." }
          ],
          explain: "<p><b>Answer: 95</b> (broadcast 200.10.5.95).</p><p>The subnet is 200.10.5.64/27; usable hosts are .65 to .94 (30 generic, or 27 in AWS).</p>" }
      ]
    },
    {
      name: "Section C — Coding", marks: 5,
      questions: [
        { id: "m2-C-1", unit: "unit09", topic: "09.7", type: "mcq", tag: "University-Midsem-style",
          q: "<p>This HTTP/1.0 client should print the whole response and exit. The server sends its reply and closes the connection, but the client never prints anything and keeps one CPU core at 100%. Which line(s) cause the bug, and what is the fix?</p>",
          code: "import socket                                                    # line 1\ns = socket.socket(socket.AF_INET, socket.SOCK_STREAM)            # line 2\ns.settimeout(5)                                                  # line 3\ns.connect((\"127.0.0.1\", 8080))                                   # line 4\ns.sendall(b\"GET / HTTP/1.0\\r\\nHost: localhost\\r\\n\\r\\n\")          # line 5\ndata = b\"\"                                                       # line 6\nwhile True:                                                      # line 7\n    chunk = s.recv(4096)                                         # line 8\n    data += chunk                                                # line 9\ns.close()                                                        # line 10\nprint(data.decode())                                             # line 11",
          options: [
            "Line 3: settimeout(5) makes recv return empty bytes, so remove it.",
            "Line 5: sendall() must be replaced by send(), because sendall() blocks forever.",
            "Lines 7–9: once the server closes, recv() returns b\"\" immediately and keeps doing so, so the loop never ends; add <code>if not chunk: break</code> right after line 8.",
            "Line 2: HTTP must use SOCK_DGRAM."
          ],
          answer: 2,
          why: [
            "A timeout makes recv raise <code>socket.timeout</code> when no data arrives; it never returns empty bytes. Here recv returns at once, so the timeout never fires.",
            "sendall() loops until every byte is sent and then returns. It is the correct call for a request.",
            "Correct. <code>recv</code> returning <code>b\"\"</code> is TCP's end-of-stream signal (the peer's FIN). Without the break, the loop spins forever adding empty bytes, which explains the 100% CPU and the missing print.",
            "HTTP/1.x and HTTP/2 run over TCP (SOCK_STREAM). UDP is used only by HTTP/3, through QUIC."
          ],
          explain: "<p>The correct read loop is <code>while True: chunk = s.recv(4096); if not chunk: break; data += chunk</code>. TCP is a byte stream: one recv can return any number of bytes, so always loop until <code>b\"\"</code>. Line 5 also shows the request format: request line, Host header, then a blank line (<code>\\r\\n\\r\\n</code>).</p>" },

        { id: "m2-C-2", unit: "unit11", topic: "11.10", type: "text", tag: "University-Midsem-style",
          q: "<p>Predict the <b>exact</b> output of this congestion-window simulator. (It records the cwnd used in each RTT, then applies that RTT's event.)</p>",
          code: "def trace(events, cwnd=1, ssthresh=8):\n    seen = []\n    for e in events:\n        seen.append(cwnd)\n        if e == \"ok\":\n            cwnd = min(cwnd * 2, ssthresh) if cwnd < ssthresh else cwnd + 1\n        elif e == \"3dup\":\n            ssthresh = max(cwnd // 2, 2)\n            cwnd = ssthresh\n        elif e == \"timeout\":\n            ssthresh = max(cwnd // 2, 2)\n            cwnd = 1\n    return seen, cwnd, ssthresh\n\nseen, cwnd, ssthresh = trace([\"ok\"] * 5 + [\"3dup\", \"ok\", \"ok\", \"timeout\", \"ok\", \"ok\"])\nprint(seen, cwnd, ssthresh)",
          answer: "[1, 2, 4, 8, 9, 10, 5, 6, 7, 1, 2] 3 3", runCheck: true,
          explain: "<ul>" +
            "<li>RTT 1–3 (ok): 1 → 2 → 4 → 8; doubling is capped at ssthresh = 8.</li>" +
            "<li>RTT 4–5 (ok): cwnd 8 is not below 8, so it grows linearly: 9, then 10.</li>" +
            "<li>RTT 6 (3dup) with cwnd 10: ssthresh = 5, cwnd = 5 (Reno).</li>" +
            "<li>RTT 7–8 (ok): 5 → 6 → 7, linear because 5 is not below 5.</li>" +
            "<li>RTT 9 (timeout) with cwnd 7: ssthresh = 7 // 2 = 3, cwnd = 1.</li>" +
            "<li>RTT 10 (ok): 1 → min(2, 3) = 2. RTT 11 (ok): 2 → min(4, 3) = 3.</li></ul>" +
            "<p>So <code>seen</code> = [1, 2, 4, 8, 9, 10, 5, 6, 7, 1, 2], the final cwnd = 3 and ssthresh = 3. Python prints a list with ', ' separators.</p>" },

        { id: "m2-C-3", unit: "unit14", topic: "14.2", type: "write", tag: "University-Midsem-style",
          q: "<p><b>Subnet splitter.</b> Write <code>split(cidr, n_subnets)</code> that divides a block such as <code>\"10.0.0.0/24\"</code> into the fewest <b>equal</b> subnets giving at least <code>n_subnets</code>. For each subnet return the network address, prefix length, broadcast address, generic usable count (−2), the AWS first and last usable addresses and the AWS usable count (−5). Do the math with bitwise operations, then cross-check with <code>ipaddress</code>. Reject a base address that is not on its prefix boundary (for example <code>192.168.1.0/23</code>).</p>" +
             "<p>Expected: <code>split(\"10.0.0.0/24\", 4)</code> → 10.0.0.0, .64, .128, .192, each /26 with 62 generic and 59 AWS-usable addresses; <code>split(\"10.20.0.0/16\", 12)</code> → 16 × /20 with 4091 AWS-usable addresses each.</p>",
          starter: "import ipaddress\n\ndef ip_to_int(s):\n    pass\n\ndef int_to_ip(n):\n    pass\n\ndef split(cidr, n_subnets):\n    pass\n",
          solutionFile: "Mock2_C3_subnet_split.py",
          rubric: [
            "1 mark: dotted quad ↔ 32-bit integer conversion using shifts (&lt;&lt; 24, 16, 8) and masks (&amp; 0xFF).",
            "1 mark: finds the smallest k with 2<sup>k</sup> ≥ n_subnets and sets the new prefix to p + k; the block size is 2<sup>32−(p+k)</sup>.",
            "1 mark: network i = base + i × block; broadcast = network + block − 1.",
            "1 mark: correct counts: generic block − 2 and AWS block − 5, with AWS first usable = network + 4 and last usable = broadcast − 1.",
            "1 mark: rejects a misaligned base (base AND NOT mask ≠ 0) and cross-checks the results against <code>ipaddress.ip_network(cidr).subnets(new_prefix=p + k)</code>."
          ],
          explain: "<p>Borrowing k bits gives $2^k$ subnets of $2^{h-k}$ addresses each (SL-L14 p6). The 'magic number' 256 − 192 = 64 is the block size for /26 (SL-L14 p7–8). <b>Slide fix:</b> SL-L13 p20's '192.168.1.0/24 → /23' is not on a /23 boundary; the block is 192.168.0.0/23 (UNCLEAR B5), and the model solution raises ValueError for it.</p>" },

        { id: "m2-C-4", unit: "unit15", topic: "15.6", type: "write", tag: "University-Midsem-style",
          q: "<p><b>Longest-prefix-match router.</b> Write <code>lookup(table, dst)</code>, where <code>table</code> is a list of <code>(prefix, next_hop)</code> pairs such as <code>(\"10.0.1.0/24\", \"router-B\")</code>. It returns the next hop of the most specific matching prefix, or <code>None</code>. Use bitwise AND with the mask (no <code>ipaddress</code> in the main function), then verify it against an <code>ipaddress</code> version.</p>" +
             "<p>Test 1 (SL-L15 p18–19): <code>10.0.0.0/16 → local</code>, <code>10.0.1.0/24 → router-B</code>, <code>0.0.0.0/0 → gateway</code>. Expected: 10.0.1.55 → router-B, 10.0.2.9 → local, 8.8.8.8 → gateway.</p>" +
             "<p>Test 2: <code>172.16.0.0/16 → if0</code>, <code>172.16.64.0/18 → if1</code>, <code>172.16.96.0/19 → if2</code>, <code>172.16.100.0/22 → if3</code>. Expected: 172.16.101.7 → if3, 172.16.97.1 → if2, 172.16.70.1 → if1, 172.16.130.1 → if0, 172.17.0.1 → None.</p>",
          starter: "def ip_to_int(s):\n    pass\n\ndef lookup(table, dst):\n    pass\n\nROUTES = [(\"10.0.0.0/16\", \"local\"), (\"10.0.1.0/24\", \"router-B\"), (\"0.0.0.0/0\", \"gateway\")]\nassert lookup(ROUTES, \"10.0.1.55\") == \"router-B\"\n",
          solutionFile: "Mock2_C4_lpm.py",
          rubric: [
            "1 mark: builds the mask correctly as <code>(0xFFFFFFFF &lt;&lt; (32 - p)) &amp; 0xFFFFFFFF</code>, with /0 giving mask 0 so the default route matches everything.",
            "1 mark: the match test is <code>dst &amp; mask == network</code> (with the network also masked).",
            "1 mark: keeps the match with the <b>largest prefix length</b>, not the first match in table order.",
            "1 mark: returns None when nothing matches (test 2 has no default route).",
            "1 mark: all nine expected results above are produced and agree with an <code>ipaddress</code>-based check."
          ],
          explain: "<p>10.0.1.55 matches /0, /16 and /24, and the /24 wins: 'specificity beats generality' (SL-L15 p19). In test 2, 172.16.101.7 falls inside all four prefixes (101 is in 100–103, 96–127 and 64–127), so /22 (if3) wins. 172.16.97.1 is in 96–127 but not 100–103, so if2.</p>" }
      ]
    }
  ]
};
