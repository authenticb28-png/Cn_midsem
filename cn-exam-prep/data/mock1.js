// Mock Exam 1: full 120-minute paper. Leans towards units 01–09 but touches all 15 units.
// Every number below was recomputed; Section C model solutions live in cn-practice/Mock1_C*.py.
window.MOCKS = window.MOCKS || {};
window.MOCKS["mock1"] = {
  id: "mock1", title: "Mock Exam 1", minutes: 120,
  instructions:
    "<p><b>Format.</b> 34 questions, 80 marks, <b>120 minutes</b>. The timer starts when you press <i>Start timer</i> and the paper submits itself when it reaches 0:00.</p>" +
    "<ul>" +
    "<li><b>Section A — MCQ / MSQ (20 × 1 mark).</b> MCQ: exactly one correct option. MSQ (the question says <i>select all that apply</i>): you get the mark only if you tick exactly the correct set. No negative marking.</li>" +
    "<li><b>Section B — Numerical (10 × 2 marks).</b> Type a number only, in the unit and rounding the question asks for. Answers within the stated tolerance are accepted. No partial marks.</li>" +
    "<li><b>Section C — Coding (4 × 5 marks).</b> C1 (find the bug) and C2 (predict the exact output) are auto-marked. C3 and C4 are <b>write-the-code</b> questions: write your answer in the box, then after you submit, compare it with the model solution and award yourself marks line by line using the rubric (1 mark per rubric point). The score report shows these 10 marks as <i>pending</i>.</li>" +
    "</ul>" +
    "<p><b>Suggested pacing:</b> Section A 25 min · Section B 45 min · Section C 45 min · 5 min to review. Use paper for all arithmetic, exactly as in the real exam; do not run code during the attempt.</p>" +
    "<p><b>Content mix:</b> about 80% course material (units 01–15) and about 20% GATE-style extras (store-and-forward, collision domains, sliding-window sequence numbers, stop-and-wait efficiency, fragmentation, Dijkstra). After submitting, the unit-by-unit diagnosis tells you which units to redo.</p>",
  sections: [
    {
      name: "Section A — MCQ / MSQ", marks: 1, negative: 0,
      questions: [
        { id: "m1-A-1", unit: "unit01", topic: "01.6", type: "mcq", tag: "University-Midsem-style",
          q: "<p>A traceroute from a home laptop to Google's Delhi server (WB-L01 p30) shows hops 1–2 as <code>192.168.1.1</code> and <code>10.240.9.204</code>, latency settling near 16 ms at hop 6 (Google's edge), hops 10–17 printing <code>* * *</code>, and hop 18 (the server) answering at about 20 ms. Which conclusion is correct?</p>",
          options: [
            "Packets are being lost inside Google's core, because hops 10–17 show <code>* * *</code>.",
            "The routers at hops 10–17 forwarded the probes but did not send ICMP Time Exceeded replies back; the path works end to end.",
            "Hops 1–2 are public Internet routers owned by Google.",
            "Most of the 20 ms is spent between hop 6 and hop 18 inside Google's network."
          ],
          answer: 1,
          why: [
            "If the core were dropping packets, the probes with larger TTLs could not reach hop 18 either, yet hop 18 answers. <code>* * *</code> only means no reply came back for that TTL.",
            "Correct. traceroute learns each hop from the ICMP Time Exceeded message that the router sends when TTL hits 0. Many core routers are configured not to send (or to rate-limit) these messages, so they appear as <code>* * *</code> while still forwarding traffic.",
            "192.168.0.0/16 and 10.0.0.0/8 are RFC 1918 private ranges: hop 1 is the home router and hop 2 is inside the ISP's private access network. They are not Google's public routers.",
            "Latency had already climbed to about 16 ms by hop 6; only about 4 ms are added between the edge and the server. Most of the delay is in the access and ISP part of the path."
          ],
          explain: "<p>traceroute sends probes with TTL = 1, 2, 3 and so builds the path hop by hop. A silent hop is a router that did not answer, not a broken link. The latency profile (rising to 16 ms, then nearly flat) shows that once traffic enters Google's network at the edge, the remaining distance to the Delhi server is short.</p>" },

        { id: "m1-A-2", unit: "unit14", topic: "14.6", type: "msq", tag: "University-Midsem-style",
          q: "<p>An AWS subnet has CIDR <code>10.0.2.0/24</code>. Which of these addresses can <b>not</b> be assigned to an EC2 instance? (Select all that apply.)</p>",
          options: ["10.0.2.1", "10.0.2.3", "10.0.2.4", "10.0.2.255"],
          answer: [0, 1, 3],
          why: [
            "Reserved: AWS uses the base + 1 address (.1) for the VPC router.",
            "Reserved: AWS keeps base + 3 (.3) for future use. (.2 is the Amazon DNS resolver.)",
            "Assignable: .4 is the first address AWS lets you use in every subnet.",
            "Reserved: the last address (.255) is the broadcast address, which AWS reserves even though a VPC does not support broadcast."
          ],
          explain: "<p>AWS reserves 5 addresses in every subnet: <b>.0</b> network, <b>.1</b> VPC router, <b>.2</b> DNS, <b>.3</b> future use and the <b>last</b> address. A /24 therefore has $256 - 5 = 251$ usable addresses (SL-L14 p15–17), from 10.0.2.4 to 10.0.2.254.</p>" },

        { id: "m1-A-3", unit: "unit02", topic: "02.1", type: "msq", tag: "University-Midsem-style",
          q: "<p>Which statements about circuit switching and packet switching are correct? (Select all that apply.)</p>",
          options: [
            "Circuit switching reserves a fixed share of every link on the path for the whole call, even during silences.",
            "In packet switching, packets of one message may take different routes and arrive out of order.",
            "Packet switching has no queuing delay, because every packet carries its own header.",
            "Statistical multiplexing lets a packet-switched link support more bursty users than circuit switching on the same link."
          ],
          answer: [0, 1, 3],
          why: [
            "True. A landline call (WB-L02 p4–6) holds its reserved slot or frequency end to end until hang-up, whether anyone is talking or not.",
            "True. Each packet is routed independently from its header (WB-L02 p7–8), so packets can follow different paths and be reordered.",
            "False. Packets share links on demand; when several arrive together they wait in the router buffer. That is queuing delay, and loss happens when the buffer is full (WB-L02 p10, p20).",
            "True. Bursty users are rarely all active at once, so a shared link can carry more of them than a link split into fixed reservations."
          ],
          explain: "<p>Circuit switching = reservation, guaranteed rate, wasted idle capacity. Packet switching = on-demand sharing, better use of the link, but variable queuing delay and possible loss.</p>" },

        { id: "m1-A-4", unit: "unit02", topic: "02.8", type: "mcq", tag: "University-Midsem-style",
          q: "<p>A geostationary satellite orbits 35,786 km above the equator. Radio waves travel at $3\\times10^8$ m/s. Ignoring every delay except propagation, how long does one ground → satellite → ground traversal take?</p>",
          options: ["≈ 119 ms", "≈ 179 ms", "≈ 239 ms", "≈ 477 ms"],
          answer: 2,
          why: [
            "119 ms is only one leg (ground → satellite): $35{,}786{,}000 / 3\\times10^8$.",
            "179 ms is the wrong figure printed in the Study Pack quiz explanation (UNCLEAR B10); it does not match any correct calculation.",
            "Correct: $2 \\times 35{,}786$ km $= 71{,}572$ km and $71{,}572{,}000 / 3\\times10^8 = 0.2386$ s ≈ 239 ms.",
            "477 ms is a full request + reply (two traversals). WB-L02 p19 calls the 240 ms figure a 'round trip', but it is one way (UNCLEAR B9)."
          ],
          explain: "<p>$d_{prop} = d/s = 7.1572\\times10^7 / 3\\times10^8 \\approx 0.239$ s. <b>Slide fix:</b> WB-L02 p19 labels ≈240 ms as a round trip. It is the one-way up-and-down path; a question and its answer take ≈480 ms, which is the 'half-second lag' the slide itself describes. A 500 Mbps rate does not help, because propagation does not depend on bandwidth.</p>" },

        { id: "m1-A-5", unit: "unit03", topic: "03.3", type: "mcq", tag: "University-Midsem-style",
          q: "<p>WB-L03 p15 places IMAP in one OSI layer. In which layer does IMAP actually belong?</p>",
          options: ["Presentation (layer 6)", "Application (layer 7)", "Session (layer 5)", "Transport (layer 4)"],
          answer: 1,
          why: [
            "This is what the slide shows, and it is a slide error (UNCLEAR B17). Presentation deals with formats, compression and encryption (JPEG, MPEG, TLS-style functions), not mail retrieval.",
            "Correct. IMAP is an application protocol, like SMTP, HTTP and DNS: it defines the messages a mail client and mail server exchange (port 143, or 993 over TLS).",
            "Session handles dialog control and synchronisation; it does not define mailbox commands.",
            "IMAP runs <i>on top of</i> TCP (a transport protocol); it is not itself a transport protocol."
          ],
          explain: "<p>All the email protocols (SMTP, POP3, IMAP) are application-layer protocols. <b>Slide fix:</b> WB-L03 p15 and WB-L07 p3 list IMAP under Presentation; the correct layer is Application.</p>" },

        { id: "m1-A-6", unit: "unit03", topic: "03.10", type: "msq", tag: "University-Midsem-style",
          q: "<p>Which layer ↔ PDU pairings are correct? (Select all that apply.)</p>",
          options: ["Data link → frame", "Network → segment", "Transport (UDP) → user datagram, also called a segment", "Physical → bits"],
          answer: [0, 2, 3],
          why: [
            "Correct: layer 2 wraps the datagram in a frame with a header (MAC addresses) and a trailer (FCS).",
            "Wrong: the network-layer PDU is a packet or datagram. A segment is the transport-layer PDU.",
            "Correct: RFC 768 calls UDP's PDU a user datagram and Kurose &amp; Ross call it a segment. WB-L03 p23 calls it a 'UDP packet' (UNCLEAR B18), which is loose wording.",
            "Correct: the physical layer moves raw bits (signals) and has no header of its own."
          ],
          explain: "<p>Top-down: message (application) → segment (transport) → datagram/packet (network) → frame (link) → bits (physical). On the wire the header order is <b>MAC | IP | TCP | HTTP | data</b>.</p>" },

        { id: "m1-A-7", unit: "unit04", topic: "04.9", type: "mcq", tag: "GATE-style",
          q: "<p>Router R has two interfaces. Interface 1 connects to switch S1, which has 5 PCs. Interface 2 connects to switch S2; S2 has 2 PCs attached directly and one hub H, and H has 3 PCs. How many collision domains and broadcast domains are there?</p>",
          options: ["10 collision, 2 broadcast", "12 collision, 2 broadcast", "8 collision, 2 broadcast", "10 collision, 1 broadcast"],
          answer: 0,
          why: [
            "Correct. S1: 5 PC ports + the S1–R link = 6. S2: 2 PC ports + 1 hub segment + the S2–R link = 4. Total 10. Each router interface starts a separate broadcast domain, so 2.",
            "12 counts each PC behind the hub as its own collision domain. A hub repeats every bit to all its ports, so the hub and its 3 PCs share <b>one</b> collision domain.",
            "8 forgets the two switch-to-router links. Each of those links is a separate collision domain too.",
            "Switches do not split broadcast domains, but routers do: two router interfaces give two broadcast domains."
          ],
          explain: "<p>Rules: every switch port and every router port is its own collision domain; a hub and everything on it share one. Only routers (or VLANs) separate broadcast domains.</p>" },

        { id: "m1-A-8", unit: "unit04", topic: "04.2", type: "mcq", tag: "University-Midsem-style",
          q: "<p>A learning switch receives a frame whose destination MAC address is not yet in its MAC table. What does it do?</p>",
          options: [
            "Drops the frame, because the destination is unknown.",
            "Records the source MAC against the incoming port, then floods the frame out of every port except the one it arrived on.",
            "Sends the frame to the default router, which looks up the MAC address.",
            "Sends its own ARP request to find the destination MAC."
          ],
          answer: 1,
          why: [
            "Dropping would break every first conversation; switches flood unknown unicast frames instead.",
            "Correct. The switch always learns from the source address. For an unknown destination it floods, and when the reply comes back it learns that port too, so later frames are forwarded on one port only.",
            "Routers work with IP addresses at layer 3; a switch forwards frames by MAC address at layer 2 and does not hand them to a router to resolve.",
            "ARP is run by hosts and routers to map an IP address to a MAC address. A layer-2 switch does not generate ARP requests in order to forward a frame."
          ],
          explain: "<p>Hub (L1): repeats to all ports. Switch (L2): learns, filters and forwards by MAC, and floods unknown destinations. Router (L3): routes by IP. <b>Slide fix:</b> WB-L04 p10 calls this 'MAC routing'. The correct term is forwarding/filtering; only routers route (UNCLEAR B16).</p>" },

        { id: "m1-A-9", unit: "unit05", topic: "05.11", type: "msq", tag: "University-Midsem-style",
          q: "<p>Which statements about head-of-line (HoL) blocking are correct? (Select all that apply.)</p>",
          options: [
            "HTTP/1.1 browsers open up to about 6 parallel TCP connections per host to work around request-level HoL blocking.",
            "HTTP/2 multiplexes streams over one TCP connection, so one lost TCP segment stalls every stream until it is retransmitted.",
            "HTTP/3 runs over QUIC (on UDP); a lost packet stalls only the stream whose data it carried.",
            "HTTP/2 removes HoL blocking completely, including at the TCP layer."
          ],
          answer: [0, 1, 2],
          why: [
            "True (WB-L05 p38–40). With one connection, responses come back in order; extra connections let slow responses overlap.",
            "True. TCP delivers one ordered byte stream, so bytes for stream B wait behind a missing segment that belonged to stream A.",
            "True. QUIC orders data per stream, so a loss only blocks its own stream.",
            "False. HTTP/2 removes HTTP-level HoL, but TCP-level HoL remains. That is the motivation for HTTP/3."
          ],
          explain: "<p>1.1: HoL per connection, so browsers use about 6 connections. 2: one TCP connection, binary frames and streams, but TCP HoL. 3: QUIC streams over UDP, so there is no cross-stream HoL.</p>" },

        { id: "m1-A-10", unit: "unit05", topic: "05.6", type: "mcq", tag: "University-Midsem-style",
          q: "<p>A site permanently moves <code>/old-page</code> to <code>/new-page</code> and wants browsers and search engines to update their links. Which status code should the server return for <code>GET /old-page</code>?</p>",
          options: ["301 Moved Permanently", "302 Found", "304 Not Modified", "403 Forbidden"],
          answer: 0,
          why: [
            "Correct. 301 plus a <code>Location: /new-page</code> header tells clients that the move is permanent, so they may cache it and update bookmarks and indexes.",
            "302 is a temporary redirect: clients should keep using the old URL in future.",
            "304 answers a conditional GET (If-None-Match / If-Modified-Since) when the cached copy is still valid; it is not a redirect.",
            "403 means the server refuses to serve the resource; it does not point anywhere."
          ],
          explain: "<p>Classes: 2xx success (200, 201), 3xx redirection (301, 302, 304), 4xx client error (403, 404), 5xx server error (500).</p>" },

        { id: "m1-A-11", unit: "unit06", topic: "06.7", type: "mcq", tag: "University-Midsem-style",
          q: "<p>Which order matches the five-step HTTPS handshake taught in WB-L06 (after the TCP three-way handshake)?</p>",
          options: [
            "ClientHello → ServerHello + certificate → client authenticates the certificate → key exchange → encrypted data",
            "ClientHello → key exchange → ServerHello + certificate → authentication → encrypted data",
            "ServerHello + certificate → ClientHello → key exchange → authentication → encrypted data",
            "ClientHello → ServerHello + certificate → encrypted data → key exchange → authentication"
          ],
          answer: 0,
          why: [
            "Correct. The client proposes versions and cipher suites; the server picks one and sends its certificate; the client checks the certificate chain and hostname; both sides derive the shared session key; then HTTP flows encrypted with that symmetric key.",
            "Keys cannot be exchanged before the client has the server's certificate and chosen parameters.",
            "The client always speaks first in TLS (ClientHello).",
            "Data cannot be encrypted before a session key exists, and sending it before authenticating the server would expose it to a man-in-the-middle."
          ],
          explain: "<p><b>Slide fix:</b> WB-L06 p22 labels authentication as 'Step 3: ServerHello + Certificate', and p24 repeats 'Step 4' (UNCLEAR B23). The consistent order is 1 ClientHello · 2 ServerHello + Cert · 3 Authenticate · 4 Key exchange · 5 Encrypted data. Asymmetric crypto is used for authentication and key exchange; symmetric crypto is used for the bulk data.</p>" },

        { id: "m1-A-12", unit: "unit12", topic: "12.3", type: "mcq", tag: "University-Midsem-style",
          q: "<p><code>company.com/api/*</code> must go to the API servers and <code>company.com/images/*</code> to an image fleet. Which AWS load balancer can do this?</p>",
          options: [
            "Network Load Balancer, because it preserves the client source IP.",
            "Application Load Balancer, because it works at layer 7 and can route on the HTTP path.",
            "Either one, because both decide using the TCP 4-tuple.",
            "An NLB with a TCP:80 listener and two target groups."
          ],
          answer: 1,
          why: [
            "Preserving the source IP is a real NLB feature, but the NLB works at layer 4 and never reads the URL ('NLB cannot read URL', SL-L12 p9).",
            "Correct. ALB listeners are HTTP/HTTPS; it reads the request line and applies path-based rules such as /api/* → TG-api and /images/* → TG-img (SL-L12 p10–11).",
            "The 4-tuple (source IP, source port, destination IP, destination port) is the same for both URLs, so it cannot tell them apart.",
            "A TCP listener sees only bytes, not paths. (SL-L12 p11 shows a TCP:80 listener on an ALB slide; real ALB listeners are HTTP/HTTPS only, UNCLEAR B31.)"
          ],
          explain: "<p>NLB = layer 4, very fast, preserves the client IP, routes on the 4-tuple. ALB = layer 7, path/host/query routing, TLS termination. Content-based routing needs an ALB.</p>" },

        { id: "m1-A-13", unit: "unit07", topic: "07.2", type: "mcq", tag: "University-Midsem-style",
          q: "<p>The zone for <code>example.com</code> contains <code>MX 10 mail1.example.com</code> and <code>MX 20 mail2.example.com</code>. Which server does a sending mail server try first?</p>",
          options: [
            "mail2.example.com, because 20 is the higher priority value.",
            "mail1.example.com, because a lower preference number means more preferred.",
            "Either one at random, since both are MX records.",
            "The A record of example.com itself."
          ],
          answer: 1,
          why: [
            "This reverses the rule. The MX number is a preference: smaller wins.",
            "Correct. The sending MTA tries MX 10 first and falls back to MX 20 only if mail1 cannot be reached.",
            "Random choice applies only between records with <i>equal</i> preference values.",
            "The domain's A record is used as an implicit MX only when there are no MX records at all; here there are two."
          ],
          explain: "<p>MX record = preference + mail-server hostname. The sender resolves the chosen hostname with an A/AAAA lookup, then opens SMTP (port 25) to it.</p>" },

        { id: "m1-A-14", unit: "unit11", topic: "11.8", type: "mcq", tag: "University-Midsem-style",
          q: "<p>A TCP Reno sender has cwnd = 16 MSS when it receives the third duplicate ACK. Immediately after the fast retransmit (ignore the temporary +3 MSS inflation), what are ssthresh and cwnd, and which phase follows?</p>",
          options: [
            "ssthresh = 8, cwnd = 1 MSS, slow start",
            "ssthresh = 8, cwnd = 8 MSS, congestion avoidance",
            "ssthresh = 16, cwnd = 8 MSS, congestion avoidance",
            "ssthresh = 4, cwnd = 1 MSS, slow start"
          ],
          answer: 1,
          why: [
            "This is what TCP <b>Tahoe</b>, or any TCP after a <b>timeout</b>, does. Reno treats 3 duplicate ACKs as mild congestion.",
            "Correct. Multiplicative decrease: ssthresh = 16/2 = 8 and cwnd = ssthresh = 8. Fast recovery then continues with linear growth (+1 MSS per RTT).",
            "ssthresh is set to <i>half</i> of the cwnd at the moment of loss, so 8, not the old 16.",
            "4 = 8/2 comes from the SL-L11 p19 diagram, which starts at cwnd 8 and drops to 1. That diagram shows Tahoe behaviour (UNCLEAR B2), and here cwnd is 16 anyway."
          ],
          explain: "<p>Loss signals (SL-L11 p15): 3 duplicate ACKs → halve (Reno fast recovery); timeout → cwnd = 1 MSS and slow start. <b>Slide fix:</b> the p19 diagram drops cwnd to 1 after 3 duplicate ACKs. That is Tahoe; the slide text itself describes Reno ('enters Congestion Avoidance directly').</p>" },

        { id: "m1-A-15", unit: "unit08", topic: "08.2", type: "msq", tag: "University-Midsem-style",
          q: "<p>Which protocol ↔ port pairs are correct? (Select all that apply.)</p>",
          options: ["SMTP message submission → 587", "IMAP over TLS → 993", "POP3 over TLS → 465", "POP3 (plain) → 110"],
          answer: [0, 1, 3],
          why: [
            "Correct. Mail clients submit outgoing mail on 587 (with STARTTLS); 25 is server-to-server relay (WB-L07 p5–8).",
            "Correct. IMAPS = 993; plain IMAP = 143.",
            "Wrong. POP3S is 995. Port 465 is SMTP over implicit TLS (SMTPS).",
            "Correct. Plain POP3 = 110."
          ],
          explain: "<p>Email ports: SMTP 25 / 587 / 465 · IMAP 143 / 993 · POP3 110 / 995. SMTP <i>pushes</i> mail; IMAP and POP3 <i>pull</i> it to the reader.</p>" },

        { id: "m1-A-16", unit: "unit08", topic: "08.6", type: "mcq", tag: "University-Midsem-style",
          q: "<p>At 10:00:00 a browser fetched <code>foobar.css</code> with headers <code>Cache-Control: public, max-age=3600</code> and <code>ETag: \"v7\"</code>. At 11:30:00 the page needs the file again, and the file on the server has not changed. What normally happens?</p>",
          options: [
            "The browser serves it from cache with no network traffic, because public responses never expire.",
            "The copy is stale (5400 s > 3600 s), so the browser sends a conditional GET with <code>If-None-Match: \"v7\"</code>; the server replies 304 Not Modified with no body, and the cached copy is reused and refreshed.",
            "The server must send 200 OK with the full file, since stale copies can never be reused.",
            "The browser shows an error, because the cached copy expired."
          ],
          answer: 1,
          why: [
            "<code>public</code> only means shared caches (proxy, CDN) may store the response. Freshness still ends after max-age = 3600 s.",
            "Correct. 11:30:00 − 10:00:00 = 5400 s, which is more than 3600 s, so the copy must be revalidated. The ETag lets the server confirm it is unchanged with a tiny 304 response instead of resending the body.",
            "A 200 with the full body would work but wastes bandwidth. Revalidation exists precisely so that stale-but-unchanged copies can be reused.",
            "Expiry triggers revalidation, not an error."
          ],
          explain: "<p>Freshness: age &lt; max-age → serve from cache. Stale → conditional GET (If-None-Match / If-Modified-Since) → 304 if unchanged, or 200 with the new body if it changed.</p>" },

        { id: "m1-A-17", unit: "unit09", topic: "09.4", type: "msq", tag: "University-Midsem-style",
          q: "<p>A laptop opens two browser tabs to <code>https://example.com</code>, giving two TCP connections to the same server. Which statements are true? (Select all that apply.)</p>",
          options: [
            "Both connections have destination port 443.",
            "Each connection's source port is an ephemeral port chosen by the client OS (IANA dynamic range 49152–65535).",
            "Both connections must also use source port 443.",
            "The server tells the two connections apart by the 4-tuple (source IP, source port, destination IP, destination port)."
          ],
          answer: [0, 1, 3],
          why: [
            "True. 443 is the well-known HTTPS server port.",
            "True. Clients use temporary ports from the dynamic range (WB-L08 p126). Linux actually defaults to 32768–60999, but the idea is the same.",
            "False. The client side does not use 443. SL-L09 p9 draws apps on 443 / 5222 / 587, but those are server (destination) ports (UNCLEAR B28).",
            "True. Both connections share three of the four values and differ only in source port, so TCP demultiplexes them to different sockets."
          ],
          explain: "<p>A TCP socket is identified by the 4-tuple; a UDP socket only by (destination IP, destination port). Port ranges: 0–1023 well-known, 1024–49151 registered, 49152–65535 dynamic.</p>" },

        { id: "m1-A-18", unit: "unit09", topic: "09.10", type: "mcq", tag: "University-Midsem-style",
          q: "<p>In a captured TCP header, byte 12 (the byte that holds the data-offset field) is <code>0x80</code>. How long is the TCP header?</p>",
          options: ["8 bytes", "20 bytes", "32 bytes", "128 bytes"],
          answer: 2,
          why: [
            "8 is the value of the data-offset field itself, but it counts 32-bit words, not bytes.",
            "20 bytes would need data offset = 5 (byte 12 = 0x50), the minimum header with no options.",
            "Correct. 0x80 = 1000 0000; the top 4 bits are 1000 = 8 words, and 8 × 4 = 32 bytes (20 fixed + 12 bytes of options).",
            "128 reads the whole byte as the length. Only the upper nibble is the offset; the low bits are reserved/flag bits."
          ],
          explain: "<p>Header length = data offset × 4 bytes, between 20 (offset 5) and 60 (offset 15).</p>" },

        { id: "m1-A-19", unit: "unit10", topic: "10.10", type: "mcq", tag: "GATE-style",
          q: "<p>A sliding-window protocol uses 3-bit sequence numbers (0–7). What is the largest sender window that works correctly for <b>Selective Repeat</b>?</p>",
          options: ["3", "4", "7", "8"],
          answer: 1,
          why: [
            "3 works, but it is not the largest possible window.",
            "Correct. SR needs $W \\le 2^{n-1} = 2^{2} = 4$, so that the receiver's new window never overlaps the old one.",
            "7 = $2^n - 1$ is the Go-Back-N limit. With SR and W = 7, if every ACK is lost the receiver cannot tell a retransmitted old frame 0 from a new frame 0.",
            "8 fails even for Go-Back-N: with all 8 numbers in flight, a full window of lost ACKs is ambiguous."
          ],
          explain: "<p>GBN: $W \\le 2^n - 1 = 7$. SR: $W_s = W_r \\le 2^{n-1} = 4$. SR is stricter because its receiver also buffers a window of future frames.</p>" },

        { id: "m1-A-20", unit: "unit15", topic: "15.2", type: "mcq", tag: "University-Midsem-style",
          q: "<p>A home router has this PAT table (SL-L15 p10):</p><table class='tbl'><tr><th>Inside</th><th>Outside</th><th>Destination</th></tr><tr><td>192.168.1.20:51000</td><td>203.0.113.7:40001</td><td>93.184.216.34:443</td></tr><tr><td>192.168.1.21:51000</td><td>203.0.113.7:40002</td><td>93.184.216.34:443</td></tr><tr><td>192.168.1.35:49876</td><td>203.0.113.7:40003</td><td>142.250.72.14:443</td></tr></table><p>A reply arrives from 93.184.216.34:443 to 203.0.113.7:<b>40002</b>. Where does the router send it?</p>",
          options: ["192.168.1.20:51000", "192.168.1.21:51000", "192.168.1.35:49876", "It is dropped, because two inside hosts use port 51000."],
          answer: 1,
          why: [
            "That host's mapping uses outside port 40001, not 40002.",
            "Correct. The outside port 40002 is the unique key. The router rewrites the destination back to 192.168.1.21:51000.",
            "That host's mapping uses outside port 40003 and a different server.",
            "The duplicate inside port 51000 is exactly why PAT gives each mapping a <i>different outside port</i>; replies are still unambiguous."
          ],
          explain: "<p>PAT rewrites (source IP, source port) on the way out and reverses it on the way back, using the outside port to find the row. 'Two hosts reused port 51000 — the outside port is the key that routes each reply home' (SL-L15 p10).</p>" }
      ]
    },
    {
      name: "Section B — Numerical", marks: 2,
      questions: [
        { id: "m1-B-1", unit: "unit02", topic: "02.3", type: "num", tag: "GATE-style",
          q: "<p>Host A sends one 1500-byte packet to host B through two store-and-forward routers, so the path has 3 links. Every link runs at 10 Mbps and is 1000 km long, with $s = 2\\times10^8$ m/s. Ignore processing and queuing delays. What is the end-to-end delay until B has the whole packet, in <b>ms</b>, rounded to 1 decimal?</p>",
          answer: 18.6, tol: 0.05,
          verify: "round(3*1500*8/10e6*1000 + 3*1000e3/2e8*1000, 1)",
          formula: "d_{e2e} = N\\frac{L}{R} + N\\frac{d}{s}",
          steps: [
            { tex: "L = 1500 \\times 8 = 12000\\,\\text{bits}", why: "Rates are in bits per second, so convert bytes to bits first." },
            { tex: "\\frac{L}{R} = \\frac{12000}{10\\times10^{6}} = 1.2\\,\\text{ms}", why: "Transmission delay on one link." },
            { tex: "N\\frac{L}{R} = 3 \\times 1.2 = 3.6\\,\\text{ms}", why: "Store-and-forward: each router must receive the whole packet before it starts sending it on, so the packet is transmitted once on each of the N = 3 links." },
            { tex: "\\frac{d}{s} = \\frac{1000\\times10^{3}}{2\\times10^{8}} = 5\\,\\text{ms}", why: "Propagation delay on one 1000 km link." },
            { tex: "3 \\times 5 = 15\\,\\text{ms}", why: "The bits travel three links in sequence." },
            { tex: "d_{e2e} = 3.6 + 15 = 18.6\\,\\text{ms}", why: "Total = all transmissions + all propagations, since queuing and processing are zero." }
          ],
          explain: "<p><b>Answer: 18.6 ms.</b></p><p>Trap: using one L/R for the whole path (16.2 ms) ignores store-and-forward. With several packets back to back, the general result is $(N + P - 1)L/R$ plus propagation.</p>" },

        { id: "m1-B-2", unit: "unit01", topic: "01.5", type: "num", tag: "University-Midsem-style",
          q: "<p>A training job copies a 100 GB checkpoint (1 GB = $10^9$ bytes). Inside a node it moves over NVLink at <b>200 GB/s</b>; between nodes it moves over InfiniBand at <b>200 Gbps</b> (WB-L01 p22). How many seconds <b>longer</b> does the InfiniBand copy take than the NVLink copy? Answer in <b>s</b>, rounded to 1 decimal.</p>",
          answer: 3.5, tol: 0.05,
          verify: "round(100e9*8/200e9 - 100e9/200e9, 1)",
          formula: "t = \\frac{\\text{size}}{\\text{rate}}\\ \\text{(same units)}",
          steps: [
            { tex: "t_{NVLink} = \\frac{100\\,\\text{GB}}{200\\,\\text{GB/s}} = 0.5\\,\\text{s}", why: "Both are in bytes (capital B), so divide directly." },
            { tex: "100\\,\\text{GB} = 100\\times10^{9}\\times 8 = 8\\times10^{11}\\,\\text{bits}", why: "InfiniBand is quoted in gigabits per second (lower-case b), so convert the size to bits." },
            { tex: "t_{IB} = \\frac{8\\times10^{11}}{200\\times10^{9}} = 4\\,\\text{s}", why: "Divide bits by bits per second." },
            { tex: "4 - 0.5 = 3.5\\,\\text{s}", why: "The difference asked for." }
          ],
          explain: "<p><b>Answer: 3.5 s.</b></p><p>200 GB/s is 8 times faster than 200 Gb/s. The GB vs Gb unit trap is the whole point of this slide.</p>" },

        { id: "m1-B-3", unit: "unit03", topic: "03.10", type: "num", tag: "University-Midsem-style",
          q: "<p>An application sends 1460 bytes of data in one TCP segment (20-byte header, no options), carried in an IPv4 datagram (20-byte header, no options), carried in an Ethernet II frame (14-byte header + 4-byte FCS trailer; ignore preamble and inter-frame gap). What percentage of the frame's bytes is header/trailer overhead? Answer in <b>%</b>, rounded to 2 decimals.</p>",
          answer: 3.82, tol: 0.01,
          verify: "round((20+20+14+4)/(1460+20+20+14+4)*100, 2)",
          formula: "\\text{overhead} = \\frac{\\sum \\text{headers}}{\\text{payload} + \\sum \\text{headers}}",
          steps: [
            { tex: "H = 20 + 20 + 14 + 4 = 58\\,\\text{B}", why: "TCP header + IP header + Ethernet header + Ethernet FCS trailer. Each layer adds its own header during encapsulation." },
            { tex: "F = 1460 + 58 = 1518\\,\\text{B}", why: "The whole frame: payload plus everything wrapped around it (the maximum standard Ethernet frame)." },
            { tex: "\\frac{58}{1518} = 0.038208", why: "Overhead fraction of the bytes on the wire." },
            { tex: "0.038208 \\times 100 \\approx 3.82\\,\\%", why: "Convert to a percentage and round to 2 decimals." }
          ],
          explain: "<p><b>Answer: 3.82 %.</b></p><p>Order on the wire: <b>Ethernet header | IP | TCP | data | FCS</b>. Trap: dividing by the payload (58/1460 = 3.97%) gives overhead relative to the data, not the share of the frame.</p>" },

        { id: "m1-B-4", unit: "unit04", topic: "04.1", type: "num", tag: "University-Midsem-style",
          q: "<p>A pod has 12 servers. Option 1: a full mesh (a direct cable between every pair). Option 2: a star (one cable from each server to a central switch). How many <b>more cables</b> does the full mesh need? Answer as an integer.</p>",
          answer: 54, tol: 0,
          verify: "12*11//2 - 12",
          formula: "\\text{mesh links} = \\frac{n(n-1)}{2}",
          steps: [
            { tex: "\\text{mesh} = \\frac{12 \\times 11}{2} = 66", why: "Each of the n servers links to the n − 1 others, and every link is counted twice (once from each end), so divide by 2." },
            { tex: "\\text{star} = n = 12", why: "One cable per server to the central switch." },
            { tex: "66 - 12 = 54", why: "Difference between the two designs." }
          ],
          explain: "<p><b>Answer: 54 extra cables.</b></p><p>Mesh links grow as $O(n^2)$ (WB-L04 p5: 3 → 3, 10 → 45, 100 → 4950), which is why devices such as switches exist. <b>Slide fix:</b> WB-L04 p28 rates mesh scalability 'Excellent'; a full mesh actually scales poorly (UNCLEAR B15).</p>" },

        { id: "m1-B-5", unit: "unit05", topic: "05.8", type: "num", tag: "University-Midsem-style",
          q: "<p>A web page = 1 base HTML file + 8 small images on the same server. RTT = 20 ms, transmission times are negligible and DNS is cached. Compare (i) non-persistent HTTP with no parallel connections and (ii) persistent HTTP with pipelining. How many <b>ms</b> does (ii) save compared with (i)? Answer as an integer.</p>",
          answer: 300, tol: 0,
          verify: "9*2*20 - (2*20 + 1*20)",
          formula: "T_{np} = 2\\,RTT \\times (1+M), \\quad T_{p,pipe} = 2\\,RTT + RTT",
          steps: [
            { tex: "T_{np} = (1 + 8) \\times 2 \\times 20 = 360\\,\\text{ms}", why: "Non-persistent: each of the 9 objects needs its own TCP handshake (1 RTT) plus request/response (1 RTT)." },
            { tex: "T_{base} = 2 \\times 20 = 40\\,\\text{ms}", why: "Persistent: one handshake RTT plus one RTT for the base HTML." },
            { tex: "T_{img} = 1 \\times 20 = 20\\,\\text{ms}", why: "With pipelining all 8 image requests go back to back on the open connection, so they cost about one more RTT in total." },
            { tex: "T_{p} = 40 + 20 = 60\\,\\text{ms}", why: "Total for persistent with pipelining." },
            { tex: "360 - 60 = 300\\,\\text{ms}", why: "The saving asked for." }
          ],
          explain: "<p><b>Answer: 300 ms saved.</b></p><p>Persistent without pipelining would be 2 RTT + 8 RTT = 200 ms. HTTP/1.1 made connections persistent by default (<code>Connection: keep-alive</code>).</p>" },

        { id: "m1-B-6", unit: "unit06", topic: "06.7", type: "num", tag: "University-Midsem-style",
          q: "<p>A browser fetches <code>https://shop.example/</code> over <b>TLS 1.2</b>. RTT = 50 ms. The response body is 1,250,000 bytes and the bottleneck rate is 100 Mbps; all other transmission times are negligible and DNS is cached. The client sends the HTTP request only after the TLS handshake completes. How many <b>ms</b> pass from sending the SYN until the last byte of the response arrives? Answer as an integer.</p>",
          answer: 300, tol: 0,
          verify: "50*(1+2+1) + 1250000*8/100e6*1000",
          formula: "T = RTT_{TCP} + 2\\,RTT_{TLS1.2} + RTT_{HTTP} + \\frac{L}{R}",
          steps: [
            { tex: "1 \\times 50 = 50\\,\\text{ms}", why: "TCP three-way handshake: SYN → SYN-ACK, after which the ACK can travel with the next message." },
            { tex: "2 \\times 50 = 100\\,\\text{ms}", why: "A full TLS 1.2 handshake takes 2 RTTs (Hello/Certificate, then key exchange/Finished)." },
            { tex: "1 \\times 50 = 50\\,\\text{ms}", why: "The HTTP GET goes out and the first byte of the response comes back one RTT later." },
            { tex: "\\frac{1250000 \\times 8}{100\\times10^{6}} = 0.1\\,\\text{s} = 100\\,\\text{ms}", why: "Time to push the whole response through the bottleneck link." },
            { tex: "50 + 100 + 50 + 100 = 300\\,\\text{ms}", why: "Add everything." }
          ],
          explain: "<p><b>Answer: 300 ms.</b></p><p>With TLS 1.3 (a 1-RTT handshake) the same fetch takes 250 ms. HTTP/3 (QUIC) merges the transport and TLS handshakes into one RTT.</p>" },

        { id: "m1-B-7", unit: "unit07", topic: "07.5", type: "num", tag: "University-Midsem-style",
          q: "<p>A host asks its local DNS server for <code>www.example.com</code> (RTT host ↔ local DNS = 2 ms). The local server resolves iteratively. RTTs from the local server: root 30 ms, <code>.com</code> TLD 40 ms, <code>example.com</code> authoritative 50 ms. The local server already has the <code>.com</code> TLD servers cached, but nothing for example.com. How many <b>ms</b> until the host has the IP address? Answer as an integer.</p>",
          answer: 92, tol: 0,
          verify: "2 + 40 + 50",
          formula: "T = RTT_{host\\to local} + \\sum RTT_{\\text{servers actually queried}}",
          steps: [
            { tex: "T_{root} = 0", why: "The TLD server addresses are cached, so the local server skips the root and asks .com directly." },
            { tex: "T_{TLD} = 40\\,\\text{ms}", why: ".com returns the NS record (referral) for example.com." },
            { tex: "T_{auth} = 50\\,\\text{ms}", why: "The authoritative server returns the A record." },
            { tex: "T = 2 + 40 + 50 = 92\\,\\text{ms}", why: "Add the host's recursive query to its local server." }
          ],
          explain: "<p><b>Answer: 92 ms.</b></p><p>With an empty cache it would be 2 + 30 + 40 + 50 = 122 ms. Repeating the query while the record's TTL is still valid costs only 2 ms. That is the point of caching (WB-L08 p11, p31).</p>" },

        { id: "m1-B-8", unit: "unit09", topic: "09.9", type: "num", tag: "University-Midsem-style",
          q: "<p>Client ISN = 100 and server ISN = 350 (SL-L09 p18–20). After the handshake the client sends three segments carrying 200, 300 and 150 bytes. The <b>second</b> is lost; the first and third arrive. What acknowledgement number does the server put in the ACK it sends when the <b>third</b> segment arrives?</p>",
          answer: 301, tol: 0,
          verify: "100 + 1 + 200",
          formula: "\\text{ACK} = \\text{next expected byte}",
          steps: [
            { tex: "\\text{first data byte} = 100 + 1 = 101", why: "The SYN consumes one sequence number, so data starts at ISN + 1." },
            { tex: "\\text{seg}_1 = 101\\text{–}300,\\ \\text{seg}_2 = 301\\text{–}600,\\ \\text{seg}_3 = 601\\text{–}750", why: "Each segment covers its own byte count." },
            { tex: "\\text{after seg}_1:\\ \\text{ACK} = 301", why: "Everything up to byte 300 has arrived in order, so the next expected byte is 301." },
            { tex: "\\text{after seg}_3:\\ \\text{ACK} = 301\\ \\text{(duplicate)}", why: "TCP ACKs are cumulative; bytes 301–600 are still missing, so seg 3 is buffered (or dropped) and the ACK repeats 301." }
          ],
          explain: "<p><b>Answer: acknowledgement number 301.</b></p><p><b>Slide fix:</b> SL-L09 p23 says 'ACK 201 = received everything up to 201'. An ACK of N means bytes up to <b>N − 1</b> have arrived and <b>N is expected next</b> (UNCLEAR B29). The typical wrong answers here are 751 and 601.</p>" },

        { id: "m1-B-9", unit: "unit10", topic: "10.5", type: "num", tag: "GATE-style",
          q: "<p>Stop-and-wait sends 1000-byte frames on a 1 Mbps link whose one-way propagation delay is 20 ms. ACK size and processing are negligible. What is the link utilisation, in <b>%</b>, rounded to 2 decimals?</p>",
          answer: 16.67, tol: 0.01,
          verify: "round(8/(8+2*20)*100, 2)",
          formula: "U = \\frac{T_f}{T_f + 2T_p} = \\frac{1}{1+2a},\\ a = \\frac{T_p}{T_f}",
          steps: [
            { tex: "T_f = \\frac{1000 \\times 8}{10^{6}} = 8\\,\\text{ms}", why: "Frame transmission time L/R." },
            { tex: "2T_p = 40\\,\\text{ms}", why: "The sender then waits a full round trip for the ACK." },
            { tex: "U = \\frac{8}{8 + 40} = \\frac{1}{6}", why: "The fraction of each cycle spent actually sending (SL-L10 p16)." },
            { tex: "\\frac{1}{6} \\times 100 \\approx 16.67\\,\\%", why: "Convert to a percentage." }
          ],
          explain: "<p><b>Answer: 16.67 %.</b></p><p>Here $a = 20/8 = 2.5$ and $1+2a = 6$, so a sliding window of 6 frames would keep the link 100% busy.</p>" },

        { id: "m1-B-10", unit: "unit13", topic: "13.11", type: "num", tag: "GATE-style",
          q: "<p>An IPv4 datagram has Total Length 5000 bytes (20-byte header, no options) and must cross a link with MTU 1500 bytes. What value is in the <b>fragment offset</b> field of the <b>last</b> fragment?</p>",
          answer: 555, tol: 0,
          verify: "3*1480//8",
          formula: "\\text{offset} = \\frac{\\text{data bytes before this fragment}}{8}",
          steps: [
            { tex: "\\text{data} = 5000 - 20 = 4980\\,\\text{B}", why: "Only the payload is split; each fragment gets its own 20-byte header." },
            { tex: "\\text{max data per fragment} = 1500 - 20 = 1480\\,\\text{B}", why: "1480 is a multiple of 8, as required for every fragment except the last." },
            { tex: "4980 = 1480 + 1480 + 1480 + 540", why: "Three full fragments and one last fragment of 540 data bytes (total length 560)." },
            { tex: "\\text{offset}_4 = \\frac{3 \\times 1480}{8} = \\frac{4440}{8} = 555", why: "The offset field counts 8-byte units of data that come before this fragment." }
          ],
          explain: "<p><b>Answer: offset field = 555 (that is, 4440 bytes).</b></p><p>The offsets are 0, 185, 370 and 555; MF = 1, 1, 1, 0. Trap: dividing 4440 by 8 is required. Writing 4440 or including the 20-byte header in the count are the common mistakes.</p>" }
      ]
    },
    {
      name: "Section C — Coding", marks: 5,
      questions: [
        { id: "m1-C-1", unit: "unit09", topic: "09.7", type: "mcq", tag: "University-Midsem-style",
          q: "<p>This TCP upper-case echo server crashes with <code>OSError: [Errno 107] Transport endpoint is not connected</code> as soon as a client connects. Which line causes the bug, and what is the fix?</p>",
          code: "import socket                                                    # line 1\nsrv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)          # line 2\nsrv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)        # line 3\nsrv.bind((\"127.0.0.1\", 9000))                                    # line 4\nsrv.listen()                                                     # line 5\nconn, addr = srv.accept()                                        # line 6\ndata = srv.recv(1024)                                            # line 7\nconn.sendall(data.upper())                                       # line 8\nconn.close()                                                     # line 9",
          options: [
            "Line 4: a server must bind to port 80, so change 9000 to 80.",
            "Line 7: data must be read from the connected socket returned by accept(), so change it to <code>data = conn.recv(1024)</code>.",
            "Line 5: listen() needs an explicit backlog such as <code>listen(5)</code>.",
            "Line 8: sendall() cannot send bytes, so encode it with <code>data.upper().encode()</code>."
          ],
          answer: 1,
          why: [
            "Any free port works. Ports below 1024 would need root on Linux, which would create a new problem.",
            "Correct. <code>srv</code> is the <b>listening</b> socket: it only accepts new connections and has no peer. <code>accept()</code> returns a new socket, <code>conn</code>, dedicated to this client, and all <code>recv</code>/<code>send</code> calls must use it. Calling recv on the listening socket raises ENOTCONN.",
            "Since Python 3.5 the backlog argument is optional; <code>listen()</code> is valid.",
            "<code>recv</code> already returns bytes and <code>bytes.upper()</code> is bytes, which is exactly what <code>sendall</code> needs. Calling <code>.encode()</code> on bytes would raise AttributeError."
          ],
          explain: "<p>Server pattern: <code>socket → bind → listen → accept</code>, then talk on the <b>accepted</b> socket. One listening socket can produce many connected sockets, one per client 4-tuple. This is how TCP demultiplexing appears in code.</p>" },

        { id: "m1-C-2", unit: "unit09", topic: "09.10", type: "text", tag: "University-Midsem-style",
          q: "<p>The first 20 bytes of a captured TCP segment are parsed below. Predict the <b>exact</b> output.</p>",
          code: "import struct\nhdr = bytes.fromhex(\"01bbc350000003e8000001f550120400a1b20000\")\nsp, dp, seq, ack, off_flags, win = struct.unpack(\"!HHIIHH\", hdr[:16])\nhlen = (off_flags >> 12) * 4\nflags = off_flags & 0x3F\nnames = [n for bit, n in [(0x20, \"URG\"), (0x10, \"ACK\"), (0x08, \"PSH\"), (0x04, \"RST\"), (0x02, \"SYN\"), (0x01, \"FIN\")] if flags & bit]\nprint(sp, dp, seq, ack, hlen, \"+\".join(names), win)",
          answer: "443 50000 1000 501 20 ACK+SYN 1024", runCheck: true,
          explain: "<p>The format <code>!HHIIHH</code> is network byte order (big-endian): 2 + 2 + 4 + 4 + 2 + 2 = 16 bytes.</p><ul>" +
            "<li><code>01bb</code> = 443 (source port: a server), <code>c350</code> = 50000 (destination: the client's ephemeral port).</li>" +
            "<li><code>000003e8</code> = 1000 = the sequence number (server ISN); <code>000001f5</code> = 501 = the ACK number, so the client's ISN was 500.</li>" +
            "<li><code>5012</code>: the top nibble 5 gives 5 × 4 = 20-byte header; the low 6 bits 0x12 = 010010 = ACK (0x10) + SYN (0x02). The list comprehension keeps the table order, so it prints <code>ACK+SYN</code>.</li>" +
            "<li><code>0400</code> = 1024 = advertised receive window.</li></ul><p>This is the server's SYN-ACK, step 2 of the three-way handshake.</p>" },

        { id: "m1-C-3", unit: "unit10", topic: "10.2", type: "write", tag: "University-Midsem-style",
          q: "<p><b>Checksum verifier.</b> Write three functions:</p><ol>" +
             "<li><code>ones_sum(words, bits=16)</code>: the 1's-complement sum of integer words of width <code>bits</code> (end-around carry).</li>" +
             "<li><code>make_checksum(words, bits=16)</code>: the checksum a sender puts in the header.</li>" +
             "<li><code>verify_checksum(words, checksum, bits=16)</code>: <code>True</code> when the receiver's check passes.</li></ol>" +
             "<p>Your code must give checksum <code>00010110</code> for the SL-L10 class example <code>10010011</code>, <code>01010110</code> (8-bit words), and must verify the IPv4 header <code>4500 0073 0000 4000 4011 B861 C0A8 0001 C0A8 00C7</code> (16-bit words) as correct. Use only the standard library.</p>",
          starter: "def ones_sum(words, bits=16):\n    pass\n\ndef make_checksum(words, bits=16):\n    pass\n\ndef verify_checksum(words, checksum, bits=16):\n    pass\n\nassert make_checksum([0b10010011, 0b01010110], 8) == 0b00010110\n",
          solutionFile: "Mock1_C3_checksum.py",
          rubric: [
            "1 mark: the sum wraps carries back in (end-around carry) using a mask of <code>(1 &lt;&lt; bits) - 1</code>, both after each addition and at the end.",
            "1 mark: the checksum is the bitwise NOT of the sum, masked to <code>bits</code> (Python's <code>~</code> gives a negative number without the mask).",
            "1 mark: the verifier adds <b>all data words plus the checksum</b> and compares with all 1s (0xFF or 0xFFFF), not with 0.",
            "1 mark: correct results: 8-bit class example → 00010110 (not the slide's 11110101), and the IPv4 header verifies.",
            "1 mark: handles bytes input: splits into big-endian 16-bit words (for example with <code>struct.unpack('!%dH')</code>) and pads an odd length with a zero byte."
          ],
          explain: "<p>Class example: 147 + 86 = 233 = 11101001 with <b>no carry</b>, so the checksum is ~11101001 = 00010110, and the receiver gets 11101001 + 00010110 = 11111111. <b>Slide fix:</b> SL-L10 p8–10 shows a carry and the checksum 11110101; both are wrong (UNCLEAR B1). For the IPv4 header, the words sum to 0x2479C; folding gives 0x479E; and 0x479E + 0xB861 = 0xFFFF, so it verifies.</p>" },

        { id: "m1-C-4", unit: "unit15", topic: "15.15", type: "write", tag: "GATE-style",
          q: "<p><b>Link-state routing.</b> The network is undirected with these link costs (Kurose &amp; Ross Fig. 5.3):</p>" +
             "<p><code>u–v 2, u–x 1, u–w 5, v–x 2, v–w 3, x–w 3, x–y 1, w–y 1, w–z 5, y–z 2</code></p>" +
             "<p>Write <code>dijkstra(graph, src)</code> that returns the least-cost distance and the predecessor of every node, and <code>forwarding_table(prev, src)</code> that returns the <b>next hop</b> from <code>src</code> to every destination. Run it from <code>u</code>. Expected distances: v 2, x 1, y 2, w 3, z 4.</p>",
          starter: "EDGES = [(\"u\",\"v\",2),(\"u\",\"x\",1),(\"u\",\"w\",5),(\"v\",\"x\",2),(\"v\",\"w\",3),\n         (\"x\",\"w\",3),(\"x\",\"y\",1),(\"w\",\"y\",1),(\"w\",\"z\",5),(\"y\",\"z\",2)]\n\ndef dijkstra(graph, src):\n    pass\n\ndef forwarding_table(prev, src):\n    pass\n",
          solutionFile: "Mock1_C4_dijkstra.py",
          rubric: [
            "1 mark: builds an undirected adjacency structure (each edge is added in both directions).",
            "1 mark: initialises dist[src] = 0 and every other node to infinity, and repeatedly finalises the unvisited node with the smallest tentative distance (a linear scan or heapq).",
            "1 mark: relaxation <code>if dist[n] + c &lt; dist[nb]: dist[nb] = dist[n] + c; prev[nb] = n</code>.",
            "1 mark: correct distances from u: v 2, w 3, x 1, y 2, z 4, with paths u-x-y-w and u-x-y-z.",
            "1 mark: correct forwarding table at u: v → v, and w, x, y, z → x (found by walking prev back to the first hop)."
          ],
          explain: "<p>Order in which nodes are finalised (ties broken alphabetically): u(0), x(1), v(2), y(2), w(3), z(4). Key update: when y is finalised at cost 2, w improves from 4 (via x) to 3 and z improves to 4. All traffic except to v leaves u through x.</p>" }
      ]
    }
  ]
};
