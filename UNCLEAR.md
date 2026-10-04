# UNCLEAR.md: unreadable pages, missing content, and slide errors

Every page of all 17 PDFs was checked twice: once through the text layer and once as a rendered image. Small figures were re-rendered at 130–220 dpi. **No page carries handwriting**, so there is no illegible ink. What remains falls into three groups:

- **A.** Content that is missing or cut off in the PDF (cannot be recovered from the source).
- **B.** Errors on the slides. The site will teach the correct version and add a "⚠ slide says…" note.
- **C.** Inconsistencies in the Study Pack, labs and quizzes.

---

## A. Missing / cut-off / unreadable content

| File | Page | What is unclear | Impact / handling |
|---|---|---|---|
| WB-L01 | 16 | Video only (sharks vs cables), thumbnail visible | none; trivia |
| WB-L01 | 30 | Tooltip "Traceroute journey fr…" and footer "Google ed[ge] → [m]esh" cut off; destination host shortened to "del…1e100.net" | Meaning recoverable; hop/latency values readable |
| WB-L01 | 31 | Tooltip "The OSI seven-layer m…" cut off | none |
| WB-L02 | 4 | Large blank area, probably an animation that did not export | none |
| WB-L02 | 6 | Video only (switchboard operator) | none |
| WB-L02 | 9 | Illustrations for "bursty users, one shared link" and "rerouted around the failure" are missing (animations) | Recreate as SVG from captions |
| WB-L02 | 15 | "Relay demo" (packet size vs pipelining) was done live; not in PDF | Researched demo: store-and-forward pipelining with N packets |
| WB-L03 | 15, 23, 24, 27, 29 | Encapsulation strips are cropped pieces of one larger figure; step circles cut at edges | Fully reconstructed into one table (COVERAGE 03.10) |
| WB-L04 | 24 | Embedded video (Wi-Fi mesh) | none |
| WB-L04 | 33 | Tiny console screenshot: custom VPC CIDR reads **10.0.0.0/17** at 200 dpi but may be /16; IDs blurred by the instructor | Teach the slide's stated 10.0.0.0/16 = 65,536 |
| WB-L05 | 11 | Icons don't line up with use-case labels | Use the text pairs: FTP–File transfer, HTTP/S–Web, SMTP–Email, Telnet–Virtual terminal |
| WB-L05 | 33 | Animation frame blurred; no packet labels | Recreate HTTP/2 multiplexing as SVG |
| WB-L05 | 37 | DevTools rows tiny; only the Protocol column (h2/h3) is readable | Enough for the point being made |
| WB-L06 | 16 | The two look-alike domains render identically; the Cyrillic "о" is visible only in the text layer | Explain the homograph attack explicitly |
| WB-L08 | 6 | DNS zone-table values truncated in the original screenshot (e.g., `p=MIIBIj…`, `v=spf1 include:mxlogin.c…`) | Record types/TTL still clear |
| WB-L08 | 9, 12, 32 | Demo title cards only: `nslookup google.com`, "create DNS records in AWS Route 53". **No output or console steps** | Researched: nslookup/dig output, Route 53 record + routing policies |
| WB-L08 | 11 | Answer IP deliberately masked "XXX.XXX.XXX.XX" | none |
| WB-L08 | 68 / 111 | "python client TLS exercises": title only, no code | Researched: `ssl` client code in U06 |
| WB-L08 | 73 / 116 | "UDP chat using nc": title only | Researched: `nc -u` + Python UDP chat |
| WB-L08 | 87 / 130 | PAT table, Smart TV row (192.168.0.4 → 203.0.113.5) has **no port numbers** | Shown as a fill-in-the-blank drill |
| WB-L08 | 95 | Icons for which key is public/private are inferred from the pictures | Standard TLS semantics used |
| WB-L08 | 97 | cryptii screenshot body text tiny (Caesar definition) | Read at higher dpi; standard definition |
| WB-L08 | 102 | Tampering diagram JSON values tiny (`"r":"3"` / `"r":"1"`, "Tempering" [sic]) | Best reading; concept clear |
| SL-L09 | 24–25 | ASCII TCP header gives **no bit widths** | Researched: full RFC 9293 bit layout |
| SL-L10 | 7 | "Wireshark TCP echo server follow-up": section header only, no capture | Researched: echo server + what Wireshark shows |
| SL-L10 | 18, 21, 22 | Demo screenshots unreadable at 60 dpi; read from the native embedded images | Fully transcribed (sliding window, zero window, GBN traces) |
| SL-L12 | 23 | AZ console: "Group name" and "Network bor…" columns truncated | none |
| SL-L13 | 22 | **A white box hides part of the figure** under the RFC 1918 ranges; only "…ute them" visible (probably "routers don't route them") | Unrecoverable; standard fact taught |
| SL-L13 | 24 | Subnet list IPv4 CIDR column cut off | Values read from detail panes |
| SL-L14 | 11, 14, 17 | Console crops: private1/public2 CIDRs not shown; route-table column cut; bottom rows cut | none |
| SL-L14 | 23 | Blank page | none |
| SL-L15 | 9 | Third outside port truncated ":4000…" | p10 confirms **:40003** |
| SL-L15 | 25 | Top row of the subnet list cut off | none |
| WB-L09 / WB-L10 | all | Filenames say "DNS" / "Caching, CDN, Route 53", but the files are **duplicates** of SL-L09 / SL-L10 with no annotations | DNS is in WB-L08; caching/CDN in WB-L07; Route 53 content does not exist (researched) |
| — | — | **Lecture 16 (30 Sep: DHCP, Routing Tables, NAT & PAT)** has no file | SL-L15 covers the same topics |

---

## B. Slide errors: the site teaches the correct version

| # | File · page | Slide says | Correct | Severity for exam |
|---|---|---|---|---|
| B1 | **SL-L10 p8–10** | 10010011 + 01010110 = **1 00001001** (carry), sum 00001010, checksum **11110101** | 147 + 86 = 233 = **11101001**, **no carry**; checksum = 1's complement = **00010110**. Receiver check: 11101001 + 00010110 = 11111111 ✔ | 🔴 high: numerical |
| B2 | **SL-L11 p19** | Diagram: after 3 duplicate ACKs, cwnd → **1**, ssthresh = 8/2 = 4 (slide text says "enters Congestion Avoidance directly") | That diagram is **TCP Tahoe**. **Reno** fast recovery: ssthresh = cwnd/2, cwnd = ssthresh (+3), then linear growth | 🔴 high |
| B3 | **SL-L11 p20** | RTT-3 event labelled "**tcp timeout**", yet cwnd 18 → **9**; also "in Congestion Avoidance in RTT 3" vs table starting at RTT 1 | Halving = **3 duplicate ACKs** (Reno). A timeout sets cwnd = 1 MSS. Arithmetic itself correct | 🔴 high |
| B4 | **SL-L13 p11** (+ SL-L14 p3) | 172.16.1.10 split as Network 172.16.1 / Host 10 | 172.16.x.x is **Class B** → Network **172.16** / Host **1.10** (under classful rules) | 🔴 high |
| B5 | **SL-L13 p20** | "192.168.1.0/24 → /23" | 192.168.1.0 is not on a /23 boundary; the /23 block is **192.168.0.0/23** (192.168.0.0–192.168.1.255) | 🔴 high |
| B6 | SL-L13 p17 | 192.168.0.1 called the "Network address" | Network address of 192.168.0.1/24 is **192.168.0.0** | 🟠 medium |
| B7 | SL-L13 p12–13 | Class B hosts "~65,000" (p12) and "64,000" (p13) | Exactly **2¹⁶ − 2 = 65,534** | 🟠 medium |
| B8 | SL-L13 p23 | VPC /16 → 65,534 usable, /24 → 254 | In **AWS**, usable = total − 5 → **65,531** and **251** (generic networking: 65,534 / 254) | 🟠 medium; say which rule the question uses |
| B9 | WB-L02 p19 | GEO path ≈ 71,500 km ≈ 240 ms called "**round-trip**"; uses 3×10⁸ m/s right after the 2×10⁸ fibre slide | 240 ms is **one way** (ground→sat→ground); the request + reply round trip ≈ **480 ms**, matching the slide's own "half-second lag". Radio in space travels at ≈ c | 🟠 medium |
| B10 | SP quiz (L02) | GEO option "~240 ms one-way", explanation "~179 ms" | 35,786 km × 2 / 3×10⁸ ≈ **239 ms**; the explanation is wrong | 🟠 medium |
| B11 | SL-L14 p11 | Private subnets reach the Internet "via NAT", but the route tables on p10/p12 have **no NAT route** (local only) | Private subnet needs **0.0.0.0/0 → NAT GW** (as SL-L15 p24–26 shows) | 🟠 medium |
| B12 | SL-L15 p16 | Bullet: only Discover and Request are broadcasts; wire capture shows **all four** DORA frames to 255.255.255.255 | Discover and Request are always broadcast. Offer/Ack are broadcast **or** unicast depending on the client's broadcast flag (RFC 2131) | 🟡 low–medium |
| B13 | SL-L15 p25 | "NAT Gateway" route table shows an S3 prefix-list → vpce route, **no NAT route** | Private route table needs **0.0.0.0/0 → nat-…** | 🟡 low |
| B14 | SL-L15 p6 | Phone shown as 192.168.0.14, packet source 192.168.1.20 | Should be the same host IP | 🟡 low |
| B15 | WB-L04 p28 | Mesh scalability "**Excellent**"; hybrid scalability "**Hard**" | Full mesh scales **poorly** (n(n−1)/2 links, as p5 itself shows); hybrid is generally **good** | 🟠 medium (MCQ trap) |
| B16 | WB-L04 p10 | Switch "routing" / "Mac routing intelligence" | Switches **forward/filter** frames by MAC; routers route | 🟡 low |
| B17 | WB-L03 p15; WB-L07 p3 | **IMAP** listed under the Presentation layer | IMAP is an **Application-layer** protocol | 🟠 medium |
| B18 | WB-L03 p23 | Transport PDU "TCP Segment / UDP **Packet**" | UDP PDU = **segment** (Kurose) or **user datagram** | 🟡 low |
| B19 | WB-L03 p12 vs p32 | ISO = "International Organization for Standardization" vs "International Standard Organisation" | p12 is correct | 🟡 low |
| B20 | WB-L03 p17; SL-L09 p26; WB-L08 p70/p113 | Request/response arrows reversed | Request goes client → server | 🟡 low |
| B21 | WB-L05 p20 | `Content-Length: 88` for a 57-byte body | Content-Length = exact body byte count (57) | 🟡 low (good drill) |
| B22 | WB-L06 p9 | Toy cipher "Hello" → "jknnq" | Not a consistent shift; Caesar +2 gives **"Jgnnq"** | 🟡 low |
| B23 | WB-L06 p22, p24 | Step labels: p22 says "Step 3: ServerHello + Certificate" (content is authentication); p24 repeats "Step 4" | Steps: 1 ClientHello · 2 ServerHello + Cert · 3 Authenticate · 4 Key exchange · 5 Encrypted data | 🟡 low |
| B24 | WB-L08 p24 / p51 | Date "Mon, 18 Dec 2024"; header `Connection: Closed` | 18 Dec 2024 was a **Wednesday**; the header value is `close` | 🟡 low |
| B25 | WB-L08 p27 / p54 | HTML snippet labelled "css" | It is HTML | 🟡 low |
| B26 | WB-L08 p81–82 / p124–125 | AI images: "Multplexing", port 25 → "Music Server", ports misaligned | 25 = SMTP; 80 = HTTP; 53 = DNS; 22 = SSH | 🟡 low |
| B27 | WB-L08 p86 / p129 | One-to-one NAT shown inside the PAT section | One-to-one (static) NAT ≠ PAT | 🟡 low |
| B28 | SL-L09 p9 | Apps drawn on ports 443 / 5222 / 587 | Those are **server (destination)** ports; clients use ephemeral ports 49152–65535 | 🟠 medium |
| B29 | SL-L09 p23 | "ACK 201 = received everything **up to 201**" | ACK 201 = received bytes **through 200**; **next expected is 201** | 🔴 high (classic trap) |
| B30 | SL-L10 p18 / p21 / p22 | Demo snapshots don't match their own traces (window header; 4 KB/8 KB buffer gauges; GBN shows 2 dup ACKs after 1 out-of-order packet) | Traces re-derived consistently | 🟡 low |
| B31 | SL-L12 p11 | ALB slide shows a TCP:80 listener / "Instance, TCP" target group (NLB-style) | ALB listeners are **HTTP/HTTPS** only | 🟠 medium |
| B32 | SL-L12 p13 | ALB "TCP/UDP: No" | ALB has no TCP/UDP **listeners**; it still runs over TCP | 🟡 low |
| B33 | SL-L12 p25 | HA diagram puts all EC2 in AZ A and both RDS nodes in AZ B | Real HA spreads compute and DB **across** AZs | 🟡 low |
| B34 | WB-L08 p98 | Substitution-cipher challenge "Gztkliv rsyz srrbz yrz dviv ufjk", no answer given | Shift **17** → "picture abhi baaki hai mere dost" (brute force verified) | info |
| B35 | Typos | WB-L03 p3 "ensures" (endures); WB-L07 p4 "FMTP"; WB-L07 p7 "us"; SL-L10 p17 "Intial"; SL-L11 p12 "small number of send"; WB-L08 p126 all items numbered "1."; "Reciever"; "Ceaser"; console "MyNAT gataeway" | — | none |

---

## C. Study Pack / labs / quizzes

| Item | Issue | Handling |
|---|---|---|
| `2 - Lecture & Lab Notes.md` | The Labs section (line ~5311) is **empty**; `pack.json` lists `files: []` for all 16 lab sessions | Nothing to extract |
| Quiz: secure IMAP port | No answer recorded in source | Standard answer **993** (flagged "not from source") |
| Lab: Industrial Multi-Segment | Text says LANs use unmanaged switches; topology uses ManagedSwitch0/1. Hint names ManagedSwitch0 as trunk; trunk is on ManagedSwitch2 | Taught from the topology file |
| Lab: Gaming Lab LAN (XML) | PC1/PC2 have APIPA 169.254.x addresses, are cabled to swapped ports, and an unconnected Router1 exists, yet it was graded 20/20 | Explain APIPA = DHCP failure |
| Labs: DHCP pools | Also push a DNS server, which the lab text never mentions | Note in DHCP unit |
| AWS labs: concept tags | Ask "default inbound rule count" of a security group and "usable hosts in /24" without expected values | Teach: new SG has **0 inbound** rules (default SG allows inbound from itself); /24 → 254 generic / 251 AWS |
| Static NAT lab | Submission shows **0/20 (attempted)** | Gets its own walkthrough in U15 |
| Quizzes | No quiz covers NAT, DHCP, subnetting or VPC | Practice questions authored for these |
| Course material overall | **No Python/socket coding questions exist** in the course | All coding questions are authored (badged University-Midsem-style) |
