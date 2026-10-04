# CN Midsem — Phase 0 Coverage Map

Built from a page-by-page read of the text layer **and** the rendered image of all **17 PDFs / 583 pages** in `Lectures/`, plus the Study Pack labs and quizzes. Raw per-page inventories: [`phase0/inventory/`](phase0/inventory/). Extracted text: [`extracted/`](extracted/). Unreadable pages and slide errors: [`UNCLEAR.md`](UNCLEAR.md).

> **Note on paths:** the prompt says `./source_pdfs/`; the PDFs actually live in `Lectures/` and `Lectures/Whiteboards/`. Nothing was moved.

---

## 1. Source files → what they really contain

The `Whiteboards/` filenames come from the LMS calendar and **often do not match the deck inside**. Every topic below is cited by the file **ID** and page where it actually appears.

| ID | File | Pages | Real deck title (from title slide / PDF metadata) | Syllabus lecture | Notes |
|---|---|---|---|---|---|
| WB-L01 | `Whiteboards/L01 - 2026-08-10 - Computer Networks.pdf` | 31 | Introduction (Lecture 1) | L1 | p30 traceroute, p31 OSI table added after "Thank You" |
| WB-L02 | `Whiteboards/L02 - … Circuit Switching, Packet Switching, Loss and throughput, Delay.pdf` | 25 | Moving Data Through the Core | L2 | ✔ name matches |
| WB-L03 | `Whiteboards/L03 - … OSI Model.pdf` | 34 | OSI and TCP/IP Models | L3 | ✔ (also contains the TCP/IP model) |
| WB-L04 | `Whiteboards/L04 - … TCP-IP Model, Network Devices.pdf` | 35 | Networking Devices, Topologies and the Cloud Network | L4 | ✖ name says TCP/IP; content is devices + topologies + AWS |
| WB-L05 | `Whiteboards/L05 - … Network Topologies, Cloud Networking, Application Layer.pdf` | 44 | Application Layer: Architecture, Protocols and APIs | L5 | ✖ no topologies/cloud here (they're in WB-L04) |
| WB-L06 | `Whiteboards/L06 - … Client-Server Architecture, HTTP Protocols, HTTP Version.pdf` | 25 | HTTPS and The TLS Handshake: Securing the Web | L6 | ✖ content is HTTPS/TLS |
| WB-L07 | `Whiteboards/L07 - … REST API(s), Presentation Layer, HTTPS, TLS-SSL.pdf` | 31 | Email Protocols (SMTP, POP3, IMAP), CDNs and Caching | L8 (taught as Wk-4 2nd) | ✖ content is Email + Caching + CDN |
| WB-L08 | `Whiteboards/L08 - … Email Protocols, Application Services, Cryptography.pdf` | 135 | DNS: The Internet's Phone Book, and AWS Route 53 (+ appended decks) | L7 (taught as Wk-4 1st) + extras | Bundle — see breakdown below |
| WB-L09 | `Whiteboards/L09 - 2026-09-07 - DNS.pdf` | 28 | = SL-L09 (Transport Layer) | L9 | ✖ **Duplicate** of SL-L09: same text, no annotations (watermark-free, sharper images) |
| WB-L10 | `Whiteboards/L10 - … Transport Layer, Caching, CDN, Route 53 ….pdf` | 27 | = SL-L10 (Reliable Data Transfer) | L10 | ✖ **Duplicate** of SL-L10, no annotations |
| SL-L09 | `L09 - The Transport Layer — Multiplexing, Ports, UDP, and the TCP Connection.pdf` | 28 | same | L9 | |
| SL-L10 | `L10 - Reliable Data Transfer and TCP Flow Control.pdf` | 27 | same | L10 | contains a checksum arithmetic error (p8) |
| SL-L11 | `L11 - TCP Congestion Control Algorithms.pdf` | 23 | same | L11 | |
| SL-L12 | `L12 - Cloud Load Balancing — ALB vs. NLB, ….pdf` | 28 | same | L12 | |
| SL-L13 | `L13 - Addressing the World IPv4, Classful History, and CIDR.pdf` | 26 | same | L13 | last lecture of the midterm syllabus |
| SL-L14 | `L14 - Subnetting in Practice — and Designing an AWS VPC.pdf` | 23 | same | beyond L13 | covered anyway (subnetting + AWS −5 rule are in the Quick-Reference) |
| SL-L15 | `L15 - Lecture 15 — NAT, PAT, DHCP & VPC Routing.pdf` | 33 | NAT, PAT & DHCP — and How VPC Route Tables Wire It Together | beyond L13 | covered anyway (DORA + private ranges are in the Quick-Reference) |
| SP | `Study Pack/3 - Coding & Lab Questions.md`, `4 - MCQs.md`, `attachments/*.xml` | — | 7 labs/assignments + 17 quiz MCQs | L1–L4, L8, L10, labs | No Python questions anywhere in the course material |

**WB-L08 breakdown (135 pages, about 60% repeats):**

| Pages | Content | Status |
|---|---|---|
| 1–14 | DNS deck: records, hierarchy, root/TLD/authoritative, local DNS, iterative lookup, Route 53 demo card | **unique** |
| 15–27 | Socket API + HTTP request/response message anatomy | unique (overlaps WB-L05) |
| 28–32 | DNS slides again (p31 has a different 8-step local-DNS diagram) | repeat + 1 new figure |
| 33–39 | APIs: client-server paradigm, Bezos API mandate, Google Maps / Weather API | **unique** |
| 40–41 | feedback / thanks | filler |
| 42–54 | = pp15–27 | duplicate |
| 55–77 | Crypto → TLS 6-step → UDP → DNS recap → video streaming | = pp98–120 |
| 78–92 | Appendix: mux/demux, QUIC, port ranges, one-to-one NAT, PAT, UDP use cases | = pp121–135 |
| 93–97 | TCP recap, HTTPS recap, Caesar cipher (shift-3) | **unique** |
| 98–120 | Substitution cipher challenge, Alice/Bob/Mallory, MITM, threats, TLS 6 steps, UDP segment, nc chat, DNS, video | unique (first copy of 55–77) |
| 121–135 | Appendix (as 78–92) | unique (first copy) |

**Handwriting:** none of the 583 pages carries live handwriting. All "whiteboards" are clean Canva slide exports. The only hand edit is "EVE → Mallory" on the xkcd comic (WB-L08 p60/p103).

---

## 2. Syllabus check (Lectures 1–13): is every bullet in the source?

Legend: ✅ in source · 🟡 partly in source (gap researched) · ❌ not in source → **⚠ Not covered in class – researched**

### Week 1–2 — How the Internet Works
| Syllabus item | Status | Where |
|---|---|---|
| Internet as "network of networks"; nuts-and-bolts vs service view | ❌ phrase not in slides (only in the L01 quiz, SP) | research (Kurose §1.1) |
| Network edge (end systems, access nets: WiFi/cellular/Ethernet) vs core | 🟡 "WiFi → Instagram gap" WB-L01 p17; core WB-L02 p7; access networks only in quiz Q1/Q4 (SP) | research edge/access/core detail |
| End-to-end journey phone → access → ISP → core → DC/CDN | 🟡 WB-L01 p17–18, p30 (traceroute) | |
| traceroute basics; latency by hop | ✅ WB-L01 p30 (≈16→20 ms) | + research TTL mechanism |
| AWS Region, AZ, Edge Location vocabulary | ✅ WB-L04 p31–32; SL-L12 p21–23 | |
| Packet switching (store-and-forward, statistical multiplexing) vs circuit | ✅ WB-L02 p4–10 | |
| Four delays: processing, queuing, transmission, propagation | ✅ WB-L02 p11–14 | |
| d_trans = L/R; d_prop = d/s (plug-in) | ✅ WB-L02 p16–19 (8000 b @ 2 Mbps = 4 ms; GEO ≈240 ms) | |
| Packet loss (buffer overflow) | ✅ WB-L02 p10, p20 | |
| Throughput and bottleneck link | ✅ WB-L02 p21–22 (min(10,2,5)=2 Mbps) | |
| Layering purpose: service, interface, protocol; modularity | 🟡 WB-L03 p5–11 (analogy only; "service/interface/protocol" terms absent) | research terms |
| OSI 7 layers + mnemonic "All People Seem To Need Data Processing" vs TCP/IP 5-layer | 🟡 OSI ✅ WB-L03 p12–29; TCP/IP shown as **4-layer** (WB-L03 p30–32); mnemonic ❌ | teach both 4- and 5-layer views; add mnemonic |
| PDUs: message → segment → datagram → frame → bits | ✅ WB-L03 p15–29, WB-L07 p3, SL-L09 p4 | |
| Encapsulation / decapsulation | ✅ WB-L03 p8–10 | |
| Host = L7, router = L3, switch = L2 | ✅ WB-L04 p8–12 (hub L1, switch L2, router L3) | |
| AWS layer mapping: Route 53/ALB (L7), NLB (L4), VPC route tables/IGW (L3) | 🟡 ALB/NLB ✅ WB-L04 p19, SL-L12; Route 53 = L7 and IGW = L3 not stated | research mapping |
| Devices: Hub L1, Switch L2, Router L3, Firewall L3–L7, LB L4/L7 | 🟡 firewall layer never stated (WB-L04 p14–17) | research firewall layers |
| Collision domains vs broadcast domains | ❌ not in any deck | research |
| Topologies Star / Mesh / Hybrid; cost vs resilience | ✅ WB-L04 p20–28 (+ bus, ring; mesh n(n−1)/2 on p5) | |
| VPC = software-defined network; default VPC (subnets, route table, IGW) | ✅ WB-L04 p29, p33 (172.31.0.0/16) | |

### Week 3–4 — Application Layer
| Syllabus item | Status | Where |
|---|---|---|
| Client–server vs P2P | ✅ WB-L05 p4–7 | |
| HTTP request anatomy (method, URL, headers, body) / response (status line, headers, body) | ✅ WB-L05 p13–23; WB-L08 p15–27 | |
| GET/POST/PUT/DELETE; status classes 2xx–5xx | ✅ WB-L05 p16, p21, p41 | |
| Persistent vs non-persistent; HoL blocking | ✅ WB-L05 p28–31 (no RTT math) | + research RTT formulas (2RTT+t per object) |
| HTTP/1.1 (~6 conns) → HTTP/2 (multiplexing, **HPACK**, TCP HoL) → HTTP/3 (QUIC/UDP, 0/1-RTT) | 🟡 WB-L05 p29–38; **HPACK ❌**, **0-RTT/1-RTT ❌** | research HPACK, 0-RTT |
| REST: resources, methods as CRUD, statelessness | ✅ WB-L05 p13, p41–42; WB-L08 p18 | |
| HTTPS = HTTP over TLS; confidentiality/integrity/authentication | ✅ WB-L06 p5–10 | |
| Symmetric vs asymmetric; asymmetric bootstraps symmetric session key | ✅ WB-L06 p12–15, p19; WB-L08 p65–66 | |
| Certificates, CA, chain of trust (leaf → intermediate → root) | 🟡 WB-L06 p17, p22 ("chain of trust" named, leaf/intermediate/root not drawn) | research the 3-level chain |
| TLS handshake steps → Finished | ✅ WB-L06 p20–24 (5 steps); WB-L08 p104–110 (6 steps) | |
| TLS 1.3 ≈ 1-RTT; link to HTTP/3 fast setup | 🟡 "TLS 1.3" named WB-L06 p20; RTT count ❌ | research |
| MITM defeated by certificate validation | ✅ WB-L06 p22; WB-L08 p99–103 | |
| AWS Certificate Manager (ACM), TLS termination at LB | 🟡 ACM ❌; TLS termination ✅ SL-L12 p12 | research ACM |
| DNS names → IPs; runs before TCP/TLS | ✅ WB-L08 p4–8 | |
| Root → TLD → Authoritative | ✅ WB-L08 p7–10 | |
| Recursive vs iterative | 🟡 iterative ✅ WB-L08 p11, p117; SL-L09 p15; "recursive" ❌ | research recursive |
| Records A, AAAA, CNAME, MX, NS, TXT | ✅ WB-L08 p5–6 | |
| Caching and TTL; slow propagation | 🟡 TTL column in zone table (WB-L08 p6); propagation explanation ❌ | research |
| Route 53 policies: Simple, Weighted, Latency, Failover, Geolocation | ❌ (WB-L08 p12 is a demo title card only) | research |
| Web caching hit/miss; Cache-Control | ✅ WB-L07 p17–20, p28 | |
| ETag / If-None-Match → 304 Not Modified | ❌ | research |
| CDN edge servers; **pull vs push**; DNS steering to nearest edge | 🟡 CDN ✅ WB-L07 p21–29; pull/push ❌; DNS steering ❌ | research |
| AWS CloudFront + Edge Locations | 🟡 named only (WB-L07 p25; WB-L04 p31) | research |
| Email: MUA ↔ MTA ↔ mailbox | 🟡 flow WB-L07 p6; terms MUA/MTA ❌ | research terms |
| SMTP (25/587) vs POP3 vs IMAP | ✅ WB-L07 p5–14 (25/587/465, 110/995, 143/993) | |

### Week 5–6 — Transport & Load Balancing
| Syllabus item | Status | Where |
|---|---|---|
| Transport = process-to-process via ports | ✅ SL-L09 p5–8; SL-L11 p3 | |
| Mux/demux; TCP connection = 4-tuple | 🟡 mux/demux ✅ SL-L09 p9–10, WB-L08 p121–125; 4-tuple ✅ only in SL-L12 p6 | |
| Ports 22, 25/587, 53, 80, 443 | ✅ WB-L08 p126–127; SL-L09 p10 | |
| UDP connectionless; DNS, video, VoIP, QUIC/HTTP-3 | ✅ SL-L09 p12–16, p26; WB-L08 p133–135 (VoIP named only in syllabus) | |
| TCP reliable in-order byte stream | ✅ SL-L09 p22–23; SL-L10 p5 | |
| 3-way handshake; FIN/ACK teardown | ✅ SL-L09 p18–21 | + research TIME_WAIT |
| Choosing UDP vs TCP | ✅ SL-L09 p26 | |
| Checksums, ACK/NAK, timeouts, retransmission, seq numbers | ✅ SL-L10 p8–12, p22–25 | **source checksum is wrong** (see UNCLEAR) |
| Stop-and-wait → pipelining | ✅ SL-L10 p15–17 (U = T_f/(T_f+2T_p)) | numericals not in source → research |
| GBN: cumulative ACKs, resend tail | ✅ SL-L10 p22–23 | window limit 2ⁿ−1 ❌ → research |
| SR: individual ACKs, buffer out-of-order | ✅ SL-L10 p24–25 | window limit 2ⁿ⁻¹ ❌ → research |
| Real TCP hybrid (cumulative ACK + SACK + fast retransmit) | 🟡 SACK ❌; fast retransmit ✅ SL-L11 p17–18 | research SACK |
| Sliding window; rwnd protects receiver | ✅ SL-L10 p17–21 (term "rwnd" ❌, called "window size") | |
| Congestion; cwnd vs rwnd; rate ≈ min(cwnd,rwnd) | 🟡 cwnd ✅ SL-L11 p6–8; **min(cwnd,rwnd) ❌** | research |
| Slow start; ssthresh; congestion avoidance | ✅ SL-L11 p10–14 | |
| AIMD +1 MSS/RTT, ×½; sawtooth | ✅ SL-L11 p15–16 | |
| Timeout → slow start; 3-dup-ACK → fast recovery | ✅ SL-L11 p17–20 (p19/p20 contain inconsistencies) | Tahoe/Reno names ❌ → research |
| TLS over TCP; QUIC re-implements reliability over UDP | ✅ WB-L08 p104; WB-L05 p38; WB-L08 p135 | |
| LB goals: scalability, availability, manageability | ✅ SL-L12 p5 | |
| NLB (L4) vs ALB (L7, host/path, TLS termination) | ✅ SL-L12 p7–13; WB-L04 p19 | |
| Target groups + health checks | ✅ SL-L12 p15–17 | |
| ASG elasticity; multi-AZ HA | ✅ SL-L12 p18–25 | |
| Capstone end-to-end trace Route 53 → TCP → TLS → ALB → target → cc | 🟡 SL-L12 p26 (final architecture); full trace ❌ | assemble from units |

### Week 7–8 — Addressing
| Syllabus item | Status | Where |
|---|---|---|
| IPv4 32 bits, dotted decimal, network + host | ✅ SL-L13 p6–8 | |
| Classful A/B/C and why abandoned | ✅ SL-L13 p9–16 | |
| CIDR a.b.c.d/n; mask ↔ prefix | ✅ SL-L13 p16–21 | |
| Usable = 2^(32−n) − 2; size by rounding up | ✅ SL-L13 p18–20 (500 → /23) | |
| RFC 1918 private ranges | ✅ SL-L13 p22 | |
| AWS VPC CIDR uses same math; AWS usable = 2^(32−n) − 5 | ✅ SL-L13 p23–24; SL-L14 p15–17 | |
| 2^k subnets from k borrowed bits | ✅ SL-L14 p6–8 | |
| DHCP DORA (Quick-Reference) | ✅ SL-L15 p13–16 | UDP 67/68 ❌ → research |

**Verdict:** of the 76 syllabus bullets, **53 are fully in the source, 19 partly, and 4 not at all** (network-of-networks/service view, collision vs broadcast domains, ETag/304, Route 53 routing policies). The **23 missing pieces** will be researched and badged **⚠ Not covered in class – researched**: the network-of-networks/service view, access networks, service/interface/protocol, the OSI mnemonic and 5-layer model, collision vs broadcast domains, the firewall layer, the Route 53 = L7 / IGW = L3 mapping, HPACK, 0-RTT/1-RTT, the leaf→intermediate→root chain, ACM, recursive DNS, TTL propagation, Route 53 routing policies, ETag/304, CDN pull vs push and DNS steering, MUA/MTA, SACK, min(cwnd, rwnd), Tahoe/Reno, GBN/SR window limits, TIME_WAIT, and DHCP ports 67/68.

---

## 3. Your 15-unit "Target Syllabus" vs the real course

The prompt's Target Mapping is a **GATE-CS** syllabus. Your course is a **cloud-oriented, top-down** course (Kurose order + AWS). Validation:

| Prompt unit | Real-course status |
|---|---|
| U01 Core & Edge, delays, layering | ✅ in course (L1–L3) |
| U02 Framing, stuffing, Nyquist/Shannon, flow vs error control | ❌ framing/stuffing/Nyquist/Shannon absent; flow control ✅ (L10) |
| U03 Parity, checksum, CRC, Hamming | 🟡 only an 8-bit checksum (SL-L10 p8–10); CRC/Hamming/2-D parity absent |
| U04 MAC: ALOHA, CSMA/CD, CSMA/CA, Ethernet frame | ❌ absent (only "media access control" one-liner, WB-L03 p26) |
| U05 S&W / GBN / SR with η, window sizes | 🟡 concepts ✅ (SL-L10); η numericals and 2ⁿ limits absent |
| U06 VC vs datagram, IPv4 classful/CIDR, subnetting, supernetting | 🟡 classful/CIDR/subnetting ✅; VC/datagram and supernetting absent |
| U07 IPv4 header, fragmentation, LPM | 🟡 LPM ✅ (SL-L15 p18–19); header and fragmentation absent |
| U08 ARP, DHCP, ICMP, NAT/PAT | 🟡 DHCP/NAT/PAT ✅; ARP named only (WB-L03 p27); ICMP is the "next lecture" (SL-L15 p31) |
| U09 Distance vector / RIP | ❌ absent |
| U10 Link state / Dijkstra / OSPF / BGP | ❌ absent |
| U11 UDP, mux/demux, UDP checksum | ✅ (pseudo-header absent) |
| U12 TCP segment, flags, 3-way / 4-way, TIME_WAIT | ✅ (TIME_WAIT absent) |
| U13 rwnd, silly window, Nagle/Clark, RTT estimation, Karn | 🟡 rwnd/zero-window ✅; Nagle/Clark/Jacobson/Karn absent |
| U14 Slow start, CA, fast retransmit/recovery, Tahoe vs Reno | ✅ (names Tahoe/Reno absent) |
| U15 DNS, HTTP, FTP, SMTP/IMAP/POP3 | ✅ (FTP active/passive absent) |

So **the real course has no data-link layer, no routing algorithms, and no IP header/fragmentation**, but it **does** have HTTPS/TLS, CDN/caching, load balancing, AWS VPC and NAT. None of those are in the prompt's list.

### Adapted unit plan (what the site will actually use)

The units follow **the course order**, so your study plan matches the lectures. The GATE-only topics from the prompt are kept as clearly badged **Extra** sections inside the closest unit, so nothing from your list is lost.

| Unit | Title | Main sources | Extra (GATE-style, badged) sections attached |
|---|---|---|---|
| 01 | The Internet: Edge, Core, Access, traceroute, AWS vocabulary | WB-L01, WB-L04 p30–32 | network-of-networks; access technologies |
| 02 | Packet vs Circuit Switching; Delay, Loss, Throughput | WB-L02 | N-hop store-and-forward, queuing intensity La/R, BDP, Nyquist & Shannon |
| 03 | Protocol Layers: OSI vs TCP/IP, PDUs, Encapsulation | WB-L03, WB-L07 p3, SL-L09 p4 | mnemonic; service/interface/protocol |
| 04 | Devices, Topologies, Cloud Network & VPC basics | WB-L04 | collision vs broadcast domains; framing (byte/bit stuffing); MAC: ALOHA, CSMA/CD (L_min), BEB, CSMA/CA, Ethernet II frame |
| 05 | Application Layer: Client–Server/P2P, HTTP anatomy, HTTP/1.0→3, REST & APIs | WB-L05, WB-L08 p15–27, 33–39 | persistent/non-persistent RTT math, HPACK, 0-RTT, FTP active/passive |
| 06 | HTTPS, Cryptography & the TLS Handshake | WB-L06, WB-L08 p55–67, 93–110 | CA chain leaf/intermediate/root, TLS 1.3 1-RTT, ACM |
| 07 | DNS & AWS Route 53 | WB-L08 p1–14, 28–32, 117; SL-L09 p3, p15 | recursive vs iterative, TTL propagation, Route 53 routing policies |
| 08 | Email (SMTP/POP3/IMAP), Web Caching & CDNs | WB-L07 | MUA/MTA, ETag/304, pull vs push CDN, DNS steering, CloudFront |
| 09 | Transport Layer: Ports, Mux/Demux, UDP, TCP Connection | SL-L09, WB-L08 p78–92, 112–135 | UDP pseudo-header checksum, TCP header bit layout, TIME_WAIT, state machine |
| 10 | Reliable Data Transfer & TCP Flow Control | SL-L10 | 16-bit Internet checksum, 2-D parity, CRC, Hamming (7,4), η = N/(1+2a), GBN 2ⁿ−1 / SR 2ⁿ⁻¹, SACK, RTT estimation (Jacobson/Karels, Karn), Nagle/Clark |
| 11 | TCP Congestion Control | SL-L11 | min(cwnd,rwnd)/RTT, Tahoe vs Reno, cwnd trace numericals |
| 12 | Cloud Load Balancing & High Availability | SL-L12, WB-L04 p18–19 | capstone end-to-end request trace |
| 13 | IPv4 Addressing, Classful History, CIDR | SL-L13 | supernetting, IPv4 header (14 fields), fragmentation, IPv6 header |
| 14 | Subnetting in Practice & AWS VPC Design | SL-L14 | VLSM drills |
| 15 | NAT, PAT, DHCP & Route Tables (LPM) | SL-L15, SP labs | ARP, ICMP (ping/traceroute TTL), DHCP 67/68 + relay; Routing algorithms: Distance Vector (Bellman-Ford, count-to-infinity), Link State (Dijkstra), OSPF, BGP |

---

## 4. Coverage table

Badges: **S** = From class worksheet · **L** = From lab (Study Pack) · **R** = ⚠ Not covered in class – researched (in syllabus) · **X** = Extra (standard networking / GATE syllabus).
Math, diagram, example and code entries marked *(new)* will be authored by me, because the source has none.

| ID | Unit/Topic | Section title | Page(s) | Protocol Math & Derivations | Diagrams & Headers | Worked Examples | Code/Scripts | Done |
|---|---|---|---|---|---|---|---|---|
| 01.1 | U01 · S | Cloud = data centres; providers; history ("lo") | WB-L01 p3–12 | — | — | — | — | ☐ |
| 01.2 | U01 · S | PAN / LAN / MAN / WAN scope | WB-L01 p12 | — | scope ladder | — | — | ☐ |
| 01.3 | U01 · S | Submarine cables (597), cable threats | WB-L01 p13–16 | — | — | — | — | ☐ |
| 01.4 | U01 · S | "Tap Instagram" gap; Netflix buffering; top-down approach | WB-L01 p17–21 | — | top-down layer stack | — | — | ☐ |
| 01.5 | U01 · S | GPU cluster networking (NVLink/InfiniBand) | WB-L01 p22 | GB/s vs Gbps unit trap *(new)* | — | — | — | ☐ |
| 01.6 | U01 · S | traceroute to Google Delhi; latency by hop | WB-L01 p30 | per-hop RTT reading | hop ladder (home → ISP → Google edge) | read the trace | `subprocess` traceroute parser *(new)* | ☐ |
| 01.7 | U01 · R | Network of networks; nuts-and-bolts vs service view; edge/access/core; ISP tiers | SP quiz L01 Q1–Q4 | — | edge/access/core map *(new)* | — | — | ☐ |
| 01.8 | U01 · S | AWS Region / AZ / Edge Location (vocabulary) | WB-L04 p31–32 | — | Region ⊃ AZ, edge PoPs | — | — | ☐ |
| 02.1 | U02 · S | Circuit vs packet switching (landline vs WhatsApp) | WB-L02 p4–6 | — | reserved vs shared link | — | — | ☐ |
| 02.2 | U02 · S | Packets = header + payload; different routes | WB-L02 p7–8 | — | packet anatomy | — | — | ☐ |
| 02.3 | U02 · S | Store-and-forward rule | WB-L02 p8, p10 | N·L/R end-to-end *(new, X)* | store-and-forward timeline *(new)* | 3-hop example *(new)* | delay calculator | ☐ |
| 02.4 | U02 · S | Statistical multiplexing; loss when buffer full | WB-L02 p9–10, p20 | users-supported calc *(new, X)* | — | — | — | ☐ |
| 02.5 | U02 · S | Four delays; toll-booth caravan | WB-L02 p11–14 | d_nodal = d_proc + d_queue + d_trans + d_prop | toll-booth figure | caravan numbers *(new)* | — | ☐ |
| 02.6 | U02 · S | Packet-size trade-off (pipelining vs overhead) | WB-L02 p15 | — | — | — | — | ☐ |
| 02.7 | U02 · S | Transmission delay L/R | WB-L02 p16–17 | L/R with unit conversion | — | 8000 b @ 2/4/8 Mbps = 4/2/1 ms | `delays.py` | ☐ |
| 02.8 | U02 · S | Propagation delay d/s; GEO satellite | WB-L02 p18–19 | d/s, s = 2×10⁸ (fibre) vs 3×10⁸ | GEO up/down path | 71,572 km / 3e8 ≈ 239 ms (one-way; slide wording corrected) | `delays.py` | ☐ |
| 02.9 | U02 · S | Throughput, bottleneck link; 300 Mbps buffering scenario | WB-L02 p21–22 | min(R₁…Rₙ); file time = F/min R | 3-link path | 10/2/5 → 2 Mbps | — | ☐ |
| 02.10 | U02 · X | Queuing delay & traffic intensity La/R; BDP; Nyquist & Shannon | — | La/R, BDP = R·RTT, 2B log₂V, B log₂(1+SNR) | — | *(new)* | `bdp.py` | ☐ |
| 03.1 | U03 · S | Layering via letter analogy; encapsulation (dolls, gift wrap) | WB-L03 p5–11 | — | encapsulation stack | — | — | ☐ |
| 03.2 | U03 · S | OSI model: ISO, why learn, interoperability | WB-L03 p12–14 | — | 7-layer stack | — | — | ☐ |
| 03.3 | U03 · S | L7 Application (waiter analogy; SMTP/HTTP/FTP/DNS…) | WB-L03 p15–17 | — | request/response | — | — | ☐ |
| 03.4 | U03 · S | L6 Presentation (translation, compression, encryption, JPEG/MPEG) | WB-L03 p18–19; SL-L10 p3 | — | — | — | — | ☐ |
| 03.5 | U03 · S | L5 Session (dialog control, sync, RPC/sockets) | WB-L03 p20–21 | — | — | — | — | ☐ |
| 03.6 | U03 · S | L4 Transport (segmentation, mux, TCP/UDP) | WB-L03 p22–23 | — | — | — | — | ☐ |
| 03.7 | U03 · S | L3 Network (IP addressing, routing, ICMP, IPSec) | WB-L03 p24–25 | — | — | — | — | ☐ |
| 03.8 | U03 · S | L2 Data link (framing, MAC, error detection, ARP/VLAN/STP) | WB-L03 p26–27 | — | frame = header/payload/trailer | — | — | ☐ |
| 03.9 | U03 · S | L1 Physical (bits, media, hubs) | WB-L03 p28–29 | — | — | — | — | ☐ |
| 03.10 | U03 · S | Header order MAC \| IP \| TCP \| HTTP \| Data; PDU names | WB-L03 p15–29; WB-L07 p3; SL-L09 p4 | header-overhead % *(new)* | full encapsulation diagram | overhead calc *(new)* | `struct` encapsulation demo | ☐ |
| 03.11 | U03 · S | TCP/IP model (4 layers) and OSI mapping; comparison | WB-L03 p30–32 | — | OSI ↔ TCP/IP (4 and 5 layer) | — | — | ☐ |
| 03.12 | U03 · R | Service / interface / protocol; OSI mnemonic; 5-layer Kurose model; device ↔ layer | WB-L01 p31 | — | — | — | — | ☐ |
| 04.1 | U04 · S | Why devices: full mesh n(n−1)/2 | WB-L04 p4–6 | n(n−1)/2 derivation | mesh vs star | 3→3, 10→45, 100→4950 | — | ☐ |
| 04.2 | U04 · S | Hub (L1), Switch (L2), Router (L3) | WB-L04 p7–13 | — | device-layer ladder | — | MAC-learning switch sim *(new)* | ☐ |
| 04.3 | U04 · S | Firewall; packet filtering; stateless vs stateful | WB-L04 p14–17 | — | filter on IP+port | rule table walk-through *(new)* | packet-filter sim *(new)* | ☐ |
| 04.4 | U04 · S | Load balancers; ALB vs NLB preview | WB-L04 p18–19 | — | — | — | — | ☐ |
| 04.5 | U04 · S | Topologies: star, mesh, bus, ring, hybrid; Wi-Fi mesh | WB-L04 p20–25 | links/ports per topology | 5 topology SVGs | — | — | ☐ |
| 04.6 | U04 · S | Topology by environment; fault tolerance / scalability table | WB-L04 p26–28 | — | — | — | — | ☐ |
| 04.7 | U04 · S | Hardware → software-defined; cloud network | WB-L04 p29–30 | — | — | — | — | ☐ |
| 04.8 | U04 · S | VPC: 10.0.0.0/16 = 65,536; default VPC 172.31.0.0/16 | WB-L04 p33 | 2^(32−16) | VPC → subnets per AZ | — | `ipaddress` VPC demo | ☐ |
| 04.9 | U04 · R | Collision vs broadcast domains; firewall L3–L7 | — | domain counting | hub/switch/router domain picture | count domains *(new)* | — | ☐ |
| 04.10 | U04 · X | Framing: byte stuffing, bit stuffing | — | stuffing rules | flag/escape | *(new)* | `stuffing.py` | ☐ |
| 04.11 | U04 · X | MAC: Pure/Slotted ALOHA (1/2e, 1/e), CSMA, CSMA/CD L_min = 2·T_p·R, BEB, CSMA/CA, Ethernet II frame | — | throughput derivations | Ethernet II frame grid | *(new)* | `aloha.py`, `beb.py` | ☐ |
| 05.1 | U05 · S | Client/server vs P2P | WB-L05 p4–7 | P2P link count | client-server vs P2P mesh | — | — | ☐ |
| 05.2 | U05 · S | Application layer & protocol list | WB-L05 p8–11; WB-L07 p4 | — | — | — | — | ☐ |
| 05.3 | U05 · S | Socket API between app and transport | WB-L08 p15 | — | socket boundary | — | TCP echo client/server | ☐ |
| 05.4 | U05 · S | HTTP stateless request–response; 4 stages | WB-L05 p13; WB-L08 p16–18 | — | — | — | — | ☐ |
| 05.5 | U05 · S | Request: request line, headers, empty line, body | WB-L05 p14–18; WB-L08 p19–23 | Content-Length counting | request-message grid | `GET /index.html HTTP/1.1` | raw-socket HTTP GET | ☐ |
| 05.6 | U05 · S | Response: status line, headers, body; status codes | WB-L05 p19–23; WB-L08 p24–27 | — | response-message grid | 200/201/301/302/403/404/500 | response parser | ☐ |
| 05.7 | U05 · S | Statelessness, cookies, session tokens | WB-L05 p24 | — | — | — | — | ☐ |
| 05.8 | U05 · S | HTTP/1.0 vs 1.1 (keep-alive, Host, HoL, pipelining) | WB-L05 p25–31 | non-persistent 2RTT + t vs persistent RTT per object *(R)* | HoL timeline | page with N objects *(new)* | — | ☐ |
| 05.9 | U05 · S | HTTP/2 (binary framing, multiplexing, server push) | WB-L05 p32–35 | — | streams over 1 TCP | — | — | ☐ |
| 05.10 | U05 · S | HTTP/3 over QUIC; stack comparison; DevTools h2/h3 | WB-L05 p36–38 | — | HTTP/2/TLS/TCP vs HTTP/3/QUIC/UDP | — | — | ☐ |
| 05.11 | U05 · S | HoL comparison: 1.1 (6 conns) / 2 (TCP HoL) / 3 (per stream) | WB-L05 p38–40 | — | 3-panel HoL | — | — | ☐ |
| 05.12 | U05 · S | REST (83%), verb → CRUD, OpenAPI/Swagger | WB-L05 p41–42 | — | — | — | `http.client` REST calls | ☐ |
| 05.13 | U05 · S | APIs: Bezos mandate, Google Maps, Weather API | WB-L08 p33–39 | — | — | — | — | ☐ |
| 05.14 | U05 · R/X | HPACK; 0-RTT; FTP active vs passive | — | — | FTP control/data ports | — | — | ☐ |
| 06.1 | U06 · S | HTTP is plain text; HTTPS = HTTP + TLS; padlock meaning | WB-L06 p4–7 | — | — | — | — | ☐ |
| 06.2 | U06 · S | Crypto goals: confidentiality, integrity, authentication | WB-L06 p8–11 | — | — | — | — | ☐ |
| 06.3 | U06 · S | Symmetric vs asymmetric; key-distribution problem | WB-L06 p12–15 | key counts n(n−1)/2 vs 2n *(new)* | enc/dec pipeline | — | — | ☐ |
| 06.4 | U06 · S | Caesar cipher; substitution-cipher challenge | WB-L08 p96–98 | shift mod 26 | cipher wheel | shift-3 example; challenge → shift 17 | `caesar.py` brute force | ☐ |
| 06.5 | U06 · S | Alice/Bob/Mallory; MITM; tampering, eavesdropping, impersonation | WB-L08 p99–103 | — | MITM key-substitution sequence | — | — | ☐ |
| 06.6 | U06 · S | Certificates (*.canva.com), look-alike domains, CA chain | WB-L06 p16–17, p22 | — | chain leaf → intermediate → root *(R)* | — | `ssl` cert inspector | ☐ |
| 06.7 | U06 · S | TLS handshake (5-step WB-L06 / 6-step WB-L08) over TCP | WB-L06 p18–24; WB-L08 p104–110 | RTT count TCP + TLS 1.2 vs 1.3 *(R)* | TCP + TLS sequence chart | — | `ssl.wrap_socket` client | ☐ |
| 06.8 | U06 · R | TLS 1.3 ≈ 1-RTT; ACM; TLS termination at ALB | SL-L12 p12 | — | — | — | — | ☐ |
| 07.1 | U07 · S | Why DNS; Justdial analogy | WB-L08 p4–5 | — | — | — | — | ☐ |
| 07.2 | U07 · S | Record types A/AAAA/MX(priority)/NS/CNAME/TXT; zone table with TTL | WB-L08 p5–6 | — | zone table | MX priority choice | `dnspython`-free resolver *(new)* | ☐ |
| 07.3 | U07 · S | Distributed hierarchy; root/TLD/authoritative | WB-L08 p7, p10 | — | DNS tree | — | — | ☐ |
| 07.4 | U07 · S | Lookup walk-through (www.amazon.com; newtonschool.co) | WB-L08 p8, p117; SL-L09 p3, p15 | — | 6-/8-step iterative diagrams | — | raw UDP DNS query with `struct` | ☐ |
| 07.5 | U07 · S | Local DNS server; caching | WB-L08 p11, p31 | — | — | — | — | ☐ |
| 07.6 | U07 · R | Recursive vs iterative; TTL & slow propagation; Route 53 policies | WB-L08 p12 (demo card) | TTL expiry timing *(new)* | recursive vs iterative | policy-choice MCQs | `socket.getaddrinfo` | ☐ |
| 08.1 | U08 · S | Email architecture; SMTP push, ports 25/587/465; relays; MailHog | WB-L07 p5–8 | — | sender → SMTP → receiver MS → IMAP/POP3 | — | `smtplib` to local debug server | ☐ |
| 08.2 | U08 · S | IMAP (143/993, sync) vs POP3 (110/995, download-delete) | WB-L07 p9–14 | — | IMAP vs POP3 diagram | — | — | ☐ |
| 08.3 | U08 · S | Caching: hit/miss, stale, first vs later requests | WB-L07 p15–18, p28 | hit-ratio avg delay *(new, X)* | cache flow | — | — | ☐ |
| 08.4 | U08 · S | Cache-Control `public, max-age=3600`; browser/proxy/CDN layers | WB-L07 p19–20 | freshness age calc *(new)* | caching layers | — | header parser | ☐ |
| 08.5 | U08 · S | Netflix Open Connect; CDN analogy; how a CDN works; players; benefits; Fastly 2021 | WB-L07 p21–29 | — | edge/PoP/origin | — | — | ☐ |
| 08.6 | U08 · R | MUA/MTA; ETag/If-None-Match → 304; pull vs push CDN; DNS steering; CloudFront | — | — | conditional GET sequence | — | `http.server` 304 demo | ☐ |
| 09.1 | U09 · S | Layer 4 role (end hosts only) | SL-L09 p4–5; SL-L11 p3 | — | — | — | — | ☐ |
| 09.2 | U09 · S | Ports & sockets (apartment analogy), socket = IP + port, netstat | SL-L09 p6–8 | — | — | — | list sockets | ☐ |
| 09.3 | U09 · S | Multiplexing / demultiplexing | SL-L09 p9–10; WB-L08 p121–125 | — | mux/demux tree | — | multi-port UDP server | ☐ |
| 09.4 | U09 · S | Port ranges & common services | WB-L08 p126–127 | 2¹⁶ = 65,536 | port pyramid | — | — | ☐ |
| 09.5 | U09 · S | UDP: connectionless; 8-byte header; length includes header | SL-L09 p12–14; WB-L08 p115 | length = 8 + payload | UDP header grid | parse a UDP header | `struct` UDP pack/unpack; UDP chat | ☐ |
| 09.6 | U09 · S | UDP use cases: DNS, video, gaming, SNMP, TFTP, DHCP; QUIC | SL-L09 p15–16; WB-L08 p133–135 | — | QUIC streams | — | — | ☐ |
| 09.7 | U09 · S | TCP 3-way handshake (ISN 100/350) | SL-L09 p17–20 | seq/ack arithmetic | 3-way timing chart | ISN 100/350 trace | TCP client/server | ☐ |
| 09.8 | U09 · S | TCP 4-way teardown | SL-L09 p21; SL-L10 p6 | — | FIN/ACK chart + TIME_WAIT *(R)* | — | — | ☐ |
| 09.9 | U09 · S | Sequence numbers, cumulative ACKs, retransmission | SL-L09 p22–23 | next-expected-byte arithmetic | seq/ack ladder | 101–200 → ACK 201 | — | ☐ |
| 09.10 | U09 · S | TCP segment header fields & flags | SL-L09 p24–25 | header length = data offset × 4 | full 20-byte TCP header bit grid | decode a hex header *(new)* | `struct` TCP header parser | ☐ |
| 09.11 | U09 · S | Speed vs reliability: UDP vs TCP | SL-L09 p26; WB-L08 p113 | — | — | — | — | ☐ |
| 09.12 | U09 · X | UDP pseudo-header checksum; TCP state machine; TIME_WAIT = 2·MSL | — | 16-bit 1's-complement sum | pseudo-header grid | *(new)* | `udp_checksum.py` | ☐ |
| 10.1 | U10 · S | Building reliability; TCP features recap | SL-L10 p3–6 | — | — | — | — | ☐ |
| 10.2 | U10 · S | Checksum (8-bit, end-around carry, 1's complement, all-1s check) | SL-L10 p8–10 | full derivation (**corrected**) | column addition | 10010011 + 01010110 → checksum 00010110 | `checksum.py` | ☐ |
| 10.3 | U10 · S | RTT definition; ping near vs far | SL-L10 p11–12 | avg RTT from samples | RTT on handshake chart | 25.893 ms vs 446.721 ms | ping parser | ☐ |
| 10.4 | U10 · S | Need for flow control | SL-L10 p14 | — | — | — | — | ☐ |
| 10.5 | U10 · S | Stop-and-wait; ACK N+1; utilization formula | SL-L10 p15–16 | U = T_f/(T_f + 2T_p) → 1/(1+2a) | Kurose S&W timing | numericals *(new)* | S&W over UDP with timeout/retry | ☐ |
| 10.6 | U10 · S | Sliding window; window-4 trace | SL-L10 p17–18 | U = N·T_f/(T_f+2T_p), capped at 1 | window strip | window-4 trace | sliding-window sim | ☐ |
| 10.7 | U10 · S | Zero window, probes, exponential backoff | SL-L10 p19–21 | backoff 1, 2, 4, 8 s | zero-window ladder + packet/time plot | trace | — | ☐ |
| 10.8 | U10 · S | Go-Back-N (packet 5 lost trace) | SL-L10 p22–23 | retransmission count; W ≤ 2ⁿ−1 *(R)* | GBN 7-phase trace | trace | `gbn_sim.py` | ☐ |
| 10.9 | U10 · S | Selective Repeat (NAK 2) | SL-L10 p24–25 | W ≤ 2ⁿ⁻¹ *(R)* | SR timing | trace | `sr_sim.py` | ☐ |
| 10.10 | U10 · R/X | GBN vs SR window derivation; SACK; η = N/(1+2a) | — | full derivation | ambiguity counter-example | *(new)* | — | ☐ |
| 10.11 | U10 · X | 16-bit Internet checksum, 2-D parity, CRC (mod-2), Hamming (7,4) | — | all step-by-step | CRC long division; Hamming positions | *(new)* | `crc.py`, `hamming.py`, `parity2d.py` | ☐ |
| 10.12 | U10 · X | RTT estimation (EWMA α = 1/8, β = 1/4, TimeoutInterval), Karn; Nagle/Clark | — | Jacobson/Karels | — | *(new)* | `rtt_estimator.py` | ☐ |
| 11.1 | U11 · S | Recap: delivery time, pipelining, sliding window | SL-L11 p3–5 | t = L/R + d_prop | — | — | — | ☐ |
| 11.2 | U11 · S | Flow control vs congestion (sprinkler, cars) | SL-L11 p6–7 | — | — | — | — | ☐ |
| 11.3 | U11 · S | cwnd (initial 10); timeout special cases | SL-L11 p8–9 | — | — | — | — | ☐ |
| 11.4 | U11 · S | Three phases; transitions | SL-L11 p10 | — | phase state machine | — | — | ☐ |
| 11.5 | U11 · S | Slow start doubling; ssthresh = cwnd/2; end of slow start | SL-L11 p11–13 | 2^k growth; RTTs to reach W | cwnd vs RTT graph | 1, 2, 4, 8, 9, 10, 11, 12 | `cwnd_sim.py` | ☐ |
| 11.6 | U11 · S | Congestion avoidance; MSS | SL-L11 p13–14 | +1 MSS/RTT | — | — | — | ☐ |
| 11.7 | U11 · S | AIMD; sawtooth | SL-L11 p15–16 | avg throughput 0.75·W/RTT *(X)* | sawtooth curve | — | — | ☐ |
| 11.8 | U11 · S | Fast retransmit & fast recovery; 16 → 17 → 18 → 9 → 10 trace | SL-L11 p17–20 | halving | 3-dup-ACK ladder | trace (event relabelled, see UNCLEAR) | — | ☐ |
| 11.9 | U11 · S | TCP CUBIC (Wmax, Linux default) | SL-L11 p21 | — | cubic curve | — | — | ☐ |
| 11.10 | U11 · R | Rate ≈ min(cwnd, rwnd)/RTT; Tahoe vs Reno | — | throughput formula | Tahoe vs Reno curves | GATE-style cwnd traces *(new)* | `cwnd_sim.py` (both variants) | ☐ |
| 12.1 | U12 · S | Motivation; LB definition & goals | SL-L12 p4–6 | — | — | — | — | ☐ |
| 12.2 | U12 · S | NLB L4: 4-tuple, ZIP analogy, forwarding example, source IP preserved | SL-L12 p6–9 | — | NLB forwarding (203.0.113.10:51514 → …) | worked forwarding | round-robin / hash LB sim | ☐ |
| 12.3 | U12 · S | ALB L7: path routing /api/*, /web/*; DNS name vs static IP; console | SL-L12 p10–11 | — | ALB routing diagram | — | path-router sim | ☐ |
| 12.4 | U12 · S | TLS termination | SL-L12 p12 | — | HTTPS → ALB → HTTP | — | — | ☐ |
| 12.5 | U12 · S | NLB vs ALB table (8 rows) | SL-L12 p13; WB-L04 p19 | — | comparison table | — | — | ☐ |
| 12.6 | U12 · S | Target groups; health checks (GET /health 30 s); self-healing | SL-L12 p14–17 | detection time = interval × threshold *(R)* | — | — | health-check poller | ☐ |
| 12.7 | U12 · S | Elasticity; Auto Scaling Group | SL-L12 p18–20 | instances needed = ⌈load/capacity⌉ *(new)* | ASG scale-out | 500 vs 50,000 users | — | ☐ |
| 12.8 | U12 · S | AZ failure; multi-AZ; HA; ELB + ASG + RDS Multi-AZ | SL-L12 p21–25 | availability 1−(1−p)ⁿ *(X)* | multi-AZ HA diagram | — | — | ☐ |
| 12.9 | U12 · S | Final architecture GSLB → regional → zonal → backend | SL-L12 p26 | — | 4-tier LB diagram | capstone trace *(R)* | — | ☐ |
| 13.1 | U13 · S | IP address; private vs public; postal analogy | SL-L13 p3–6 | — | — | — | — | ☐ |
| 13.2 | U13 · S | IPv4 32 bits, octets, decimal ↔ binary | SL-L13 p7–8 | positional binary | 32-bit strip | 192.168.0.1 | `ip_bin.py` | ☐ |
| 13.3 | U13 · S | Classful A/B/C: leading bits, ranges, bit split, counts | SL-L13 p9–13 | 2⁷−2, 2²⁴−2, 2¹⁴, 2¹⁶−2, 2²¹, 2⁸−2 | class bit diagrams | class identification | `classful.py` | ☐ |
| 13.4 | U13 · S | Scale problem; packet to 9.10.10.10 | SL-L13 p14 | — | core vs gateway routing | — | — | ☐ |
| 13.5 | U13 · S | Exhaustion; 500-host company; IPv4 market price | SL-L13 p15 | waste = 65,534 − 500 | — | — | — | ☐ |
| 13.6 | U13 · S | CIDR notation; mask ↔ prefix; network/broadcast/first/last | SL-L13 p16–18 | AND with mask; host bits all 1 | network/host split | 192.168.1.0/24 | `subnet_calc.py` (bitwise + `ipaddress`) | ☐ |
| 13.7 | U13 · S | CIDR table /8 … /32 | SL-L13 p19 | 2^(32−n) and −2 | — | 8-row table | — | ☐ |
| 13.8 | U13 · S | Sizing for 500 devices → /23 | SL-L13 p20–21 | ⌈log₂(N+2)⌉ | — | 500 → /23 (base corrected to 192.168.0.0) | — | ☐ |
| 13.9 | U13 · S | RFC 1918 private ranges; NAT preview | SL-L13 p22 | range sizes | — | — | `is_private` checks | ☐ |
| 13.10 | U13 · S | Cloud bridge: VPC 10.0.0.0/16 → /24 subnets; console /20 → 4091 | SL-L13 p23–24 | 4096 − 5 | VPC carve diagram | — | — | ☐ |
| 13.11 | U13 · X | Supernetting/aggregation; IPv4 header (14 fields); fragmentation; IPv6 header | — | offset/8, MF, checksum | IPv4 and IPv6 header grids | 4000 B over MTU 1500 then 620 | `ipv4_header.py`, `fragment.py` | ☐ |
| 14.1 | U14 · S | Why subnet; definition | SL-L14 p3–5 | — | — | — | — | ☐ |
| 14.2 | U14 · S | Borrowing bits: 2^k subnets, 2^(h−k) each | SL-L14 p6 | derivation | Network\|Subnet\|Host split | /24 + 2 → /26 | `subnet_split.py` | ☐ |
| 14.3 | U14 · S | Magic number (256 − 192 = 64); 4 × /26 table | SL-L14 p7–8 | block size | — | 10.0.0.0/24 → 4 subnets | — | ☐ |
| 14.4 | U14 · S | Public vs private subnets; route table decides | SL-L14 p9–11 | — | IGW vs NAT paths | — | — | ☐ |
| 14.5 | U14 · S | 3-tier VPC (web/app/db), security rationale, 2 AZs | SL-L14 p12–14 | — | 3-tier × 2-AZ diagram | — | VPC planner | ☐ |
| 14.6 | U14 · S | AWS 5 reserved IPs (.0 .1 .2 .3 .255); /24 → 251; /20 → 4091 | SL-L14 p15–17 | 2^(32−n) − 5 | reserved-address strip | /24, /20, /28 | — | ☐ |
| 14.7 | U14 · S | AWS CIDR limits /16–/28 | SL-L14 p18–19 | — | — | /29 rejected | — | ☐ |
| 14.8 | U14 · S | Design constraints: no overlap, fit in VPC, immutable size | SL-L14 p20 | overlap test | — | 10.0.1.0/24 vs 10.0.1.128/25 | `overlaps()` checker | ☐ |
| 14.9 | U14 · X | VLSM allocation drills | — | largest-first allocation | — | *(new)* | `vlsm.py` | ☐ |
| 15.1 | U15 · S | NAT: border router swaps source IP; before/after header | SL-L15 p4–6 | — | NAT rewrite diagram | — | NAT table sim | ☐ |
| 15.2 | U15 · S | PAT: one public IP, unique outside ports; translation table | SL-L15 p7–10; WB-L08 p128–132 | max sessions ≈ port range | PAT table | 3-row PAT table | `pat_sim.py` | ☐ |
| 15.3 | U15 · S | NAT gains vs breaks; quiz | SL-L15 p11–12 | — | — | — | — | ☐ |
| 15.4 | U15 · S | One-to-one NAT table | WB-L08 p129 | — | inside local ↔ inside global | — | — | ☐ |
| 15.5 | U15 · S | DHCP lease contents; DORA; on-the-wire addresses | SL-L15 p13–16 | — | DORA ladder | 0.0.0.0 → 255.255.255.255 | DHCP Discover packer (`struct`) | ☐ |
| 15.6 | U15 · S | Route tables; longest-prefix match; 0.0.0.0/0 | SL-L15 p17–19 | prefix compare | route-table lookup | 10.0.1.55 → 10.0.1.0/24 | `lpm.py` (bitwise + `ipaddress`) | ☐ |
| 15.7 | U15 · S | IGW; public subnet route; console | SL-L15 p20–23 | — | VPC + IGW | — | — | ☐ |
| 15.8 | U15 · S | NAT Gateway (outbound only); public vs private route tables; quiz | SL-L15 p24–27 | — | 2-AZ VPC with NAT GW | — | — | ☐ |
| 15.9 | U15 · S | Activity: Be the NAT box (port collision) | SL-L15 p28–29 | — | — | port collision | — | ☐ |
| 15.10 | U15 · S | Key takeaways; next: ICMP, IPv6 | SL-L15 p30–31 | — | — | — | — | ☐ |
| 15.11 | U15 · L | Labs: DHCP + relay (`ip helper-address`); Gaming LAN; Industrial multi-segment | SP labs | pool sizing | lab topologies | lab IP tables | — | ☐ |
| 15.12 | U15 · L | Lab: VLAN trunking & router-on-a-stick | SP lab | — | trunk diagram | — | — | ☐ |
| 15.13 | U15 · L | Lab: static NAT (`ip nat inside source static`, 100.1.1.0/29) | SP lab | /29 → 6 usable | — | — | — | ☐ |
| 15.14 | U14 · L | Labs: AWS custom VPC 10.20.0.0/16 + IGW; security group web-sg | SP labs | — | — | concept tags | — | ☐ |
| 15.15 | U15 · R/X | DHCP UDP 67/68, relay; ARP; ICMP (ping, traceroute TTL); DV (Bellman-Ford, count-to-infinity, split horizon, poison reverse, RIP); LS (Dijkstra table, OSPF); BGP | — | Bellman-Ford iterations, Dijkstra tables | DV exchange tables; Dijkstra tree | *(new)* | `dijkstra.py`, `bellman_ford.py`, raw ICMP ping | ☐ |
| Q.1 | All · L | 17 quiz MCQs from the Study Pack (L01, L02, L03, L04, L08, L10 quizzes) | SP `4 - MCQs.md` | — | — | — | — | ☐ |

**Totals:** 154 rows: 131 from class slides (S), 5 from labs/quizzes (L), 7 researched syllabus gaps (R), 8 GATE extras (X), and 3 mixed (R/X). Every row will get at least one practice question.

---

## 5. Phase-0 decisions (defaults I'll use unless you say otherwise)

1. **Unit order = course order**, not the prompt's GATE order, so each study-plan day matches your lectures.
2. **GATE topics are kept but tagged "Extra"** and placed last within each unit. Mock exams weight about 80% syllabus / 20% extras.
3. **Source errors are taught correctly**, with a "⚠ slide says X" note (see UNCLEAR.md), e.g. the checksum on SL-L10 p8.
4. **No authentic GATE PYQs are in the source.** Any question tagged "GATE CS 20xx" will be checked against the official paper; everything else is tagged "GATE-style" or "University-Midsem-style".
