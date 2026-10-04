# SL-L13 pages 1-26 — Addressing the World IPv4, Classful History, and CIDR

Source: `Lectures/L13 - Addressing the World IPv4, Classful History, and CIDR.pdf` (Newton School of Technology, "Computer Networks", Canva deck). All 26 pages checked against the text layer and the page image. Pages 22 and 24 were re-rendered at 150–200 dpi to read the figure and console screenshots.

## Page table
| Page | Section/slide title | Content summary (exact facts, numbers, definitions, lists — be specific, not vague) | Callout type | Diagram/figure on page | Handwriting present? |
|---|---|---|---|---|---|
| 1 | Title: "Addressing the World IPv4, Classful History, and CIDR" | Subtitle "Computer Networks"; Newton School of Technology logo. | none | Decorative network-mesh triangle | No |
| 2 | Join the lecture online on your dashboard | Filler. | none | none | No |
| 3 | Network Layer: IP Addressing | Section divider. | none | none | No |
| 4 | Recap (Load Balancer) | Recap of the previous lecture: Users → Internet → Load Balancer → Servers. | none | 3 user PCs with two-way arrows into an "Internet" cloud ↔ green "Load Balancer" icon ↔ 3 server racks (3 units each). Title text "Load Balancer". | No |
| 5 | Recap (ALB vs NLB) | Left, ALB: "Application load balancer, Layer 7 · HTTP/HTTPS" splits into "/api/*" → "TG: api" → "EC2 (3)" and "/web/*" → "TG: web" → "EC2 (3)"; footer "No static IP - DNS name only". Right, NLB: "Network load balancer, Layer 4 · TCP/UDP/TLS" → "Forward all traffic" → "Target group: tcp-app" → "EC2 instances (3)"; footer "Static IP + preserves client IP". Legend: Blue = ALB path, Teal = NLB path, Gray = shared EC2 layer. | none (recap) | Two flowcharts side by side, top-down, each starting at "Client requests" (see Diagrams). | No |
| 6 | IP Address | Definition: "An IP address is a unique identifier assigned to each device connected to the internet or a local network. 'IP' stands for 'Internet Protocol,' the set of rules for sending data between devices on networks." | KEY CONCEPT | Cartoon of a home network. Cloud labelled "INTERNET 68.195.213.248" (public IP, small text). Devices labelled 192.168.0.2 (laptop on bed), 192.168.0.3 (tablet in chair) and 192.168.0.100 (laptop at desk). | No |
| 7 | IPv4 Addressing | Highlighted box: "Think of the IPv4 address as a simple, four-part postal code: [Country Code].[State Code].[City Code].[Street Number]." | ANALOGY | Postal-code label "US-CA-LA / 1234" with arrows from COUNTRY CODE, STATE CODE, CITY CODE and STREET NUMBER. | No |
| 8 | IPv4 Addressing | Bullets: the first major version, still powers most of the internet today. Structure: a 32-bit number. Format: four 8-bit numbers (octets) separated by dots. Example: 192.168.1.1. Each of the four numbers ranges from 0 to 255. | KEY CONCEPT | Binary conversion table with columns 2^7…2^0: 192 = 1 1 0 0 0 0 0 0; 168 = 1 0 1 0 1 0 0 0; 0 = 0 0 0 0 0 0 0 0; 1 = 0 0 0 0 0 0 0 1. "192.168.0.1" with arrows to "11000000. 10101000. 00000000. 00000001", labelled First/Second/Third/Fourth Octet. Cartoon presenter. | No |
| 9 | History of IPv4 address management | Section divider. | none | none | No |
| 10 | History of IPv4 Address Classes | Speech bubble: "The city model is divided into three structured zones: A (Massive districts for giant developments), B (Medium districts for mid-sized projects), and C (Small plots for local use)." | ANALOGY | Aerial photo of a city with zoned districts. | No |
| 11 | IPv4 Address Classes A, B and C | Octet split. Class A = Network, Host, Host, Host. Class B = Network, Network, Host, Host. Class C = Network, Network, Network, Host. Example "172.16.1.10" with brace "Network ID" under 172.16.1 and "Host ID" under 10. Table (Class / Left-most bit / Starting IP / Last IP): A, 0xxx, 0.0.0.0, 127.255.255.255; B, 10xx, 128.0.0.0, 191.255.255.255; C, 110x, 192.0.0.0, 223.255.255.255. | KEY CONCEPT | 3 rows × 4 octet boxes (blue = Network, yellow = Host), each with an "octet" brace. Table colours: A salmon, B yellow, C green. | No |
| 12 | Classful IPv4 addresses | Table "Class / Bit Allocation (32 bits total)". A: 0NNNNNNN.HHHHHHHH.HHHHHHHH.HHHHHHHH (1 bit class ID + 7 network bits + 24 host bits); Range 0.0.0.0 to 127.255.255.255; Networks ~128; Hosts per network ~16.7 million. B: 10NNNNNN.NNNNNNNN.HHHHHHHH.HHHHHHHH (2 bits class ID + 14 network bits + 16 host bits); Range 128.0.0.0 to 191.255.255.255; Networks ~16,000; Hosts per network ~65,000. C: 110NNNNN.NNNNNNNN.NNNNNNNN.HHHHHHHH (3 bits class ID + 21 network bits + 8 host bits); Range 192.0.0.0 to 223.255.255.255; Networks ~2 million; Hosts per network 254. Speech bubble: "The classes had a significant amount of difference in available IP addresses for hosts. This meant practically a lot of IPv4 addresses remained unassigned". | KEY CONCEPT | Table only | No |
| 13 | (Question) | Orange box: "Think about how many potential devices in a flat Class A network?" Answer text: "For class A and Class B, that's too many devices to be managed by a single router!" Table "IP address classes" (Class / Range / Max Hosts): A, 0-127, 16 Million (boxed); B, 128-191, 64,000; C, 192-223, 254. | QUIZ | Small 3-row table; the Class A "16 Million" cell is outlined. | No |
| 14 | The Journey of a Packet to 9.10.10.10 | Step 1, Core Router Recognition: core routers identify that 9.10.10.10 belongs to the 9.0.0.0 Class A network and route the packet by network ID to the right gateway. Step 2, Gateway Router Processing: gateway router = entry/exit point for a specific network; it uses the host ID to deliver to the final destination. "The Scale Problem! 16,777,216 individual IPs in a single Class A network. Way too many devices for one router!" | WARNING | IBM logo. Route icon (pin → winding path → flag). Screenshot "IP Address Lookup for 9.10.10.10 in Durham, United States — 9.10.10.10 is an IP address allocated to IBM" (WhatIsMyIPAddress). | No |
| 15 | The Crisis: The Great Address Shortage! | The internet grew much faster than anyone predicted. A company needing 500 addresses couldn't get a Class C (too small) and had to take a Class B (over 65,000 addresses), wasting the rest. We were running out of IPv4 addresses. In 2025, buying a public IPv4 address costs roughly $20–$45 per address; leasing is about $0.40 per IP per month. | WARNING | Photo of a sign: "SORRY WE ARE Out of IPV4". | No |
| 16 | Solution: Make the routing classless! | Section divider. | none | none | No |
| 17 | CIDR: Classless Inter-Domain Routing | Replaces the older Class A, B, C system. Networks can be sized to actual host requirements instead of wasting large blocks. CIDR makes it easier to divide a network into smaller subnets as needed. CIDR Format: 192.168.0.1/24 = Normal IP + "/" + Network Prefix. "192.168.0.1 = Network address" and "/24 = Network prefix (subnet mask)". | KEY CONCEPT | IPCisco graphic "CIDR Value & CIDR Notation": IP Address 192.168.0.1; Subnet Mask 255.255.255.0; Binary Subnet Mask 11111111.11111111.11111111.00000000; brace "24 bits 1s, Network Bits" → "CIDR Value = 24"; "CIDR Notation = IP Address/CIDR Value"; "CIDR Notation = 192.168.0.1/24". | No |
| 18 | CIDR | Bar: Network = 24 bits, Host = 8 bits. Mask 11111111.11111111.11111111.00000000 = 255.255.255.0 = /24 "(Number of 1's)". Calculator for 192.168.1.0/24: binary 11000000 10101000 00000001 00000000; Netmask 255.255.255.0; CIDR Base IP 192.168.1.0; Broadcast IP 192.168.1.255; Count 256; First Usable IP 192.168.1.1; Last Usable IP 192.168.1.254. Right side: "Usable Hosts = 2^h − 2, h = host bits". The −2 points to "CIDR Base IP" and "Broadcast IP". "192.168.1.0/24: Usable Hosts = 2^8 − 2 = 254". | KEY CONCEPT | Teal-green "Network = 24 bits" bar and pink "Host = 8 bits" bar over the binary mask. Colour-coded octet boxes 192 (purple), 168 (red), 1 (green), 0 (yellow), /24 (grey) with bit strips underneath. A pink arrow points to the formula. Two lines from the "−2" go to "CIDR Base IP" and "Broadcast IP". | No |
| 19 | CIDR Examples | 8-row table (see Worked examples). Footer: "This means you could request an address block of exactly the size you needed, dramatically reducing waste." | KEY CONCEPT | Table only | No |
| 20 | CIDR — "Creating a Subnet for 500 Devices" | "We need at least 500 IP addresses to connect 500 devices in one subnet". Five steps: (1) 500 devices; (2) find the smallest host bits H with 2^H − 2 ≥ 500: H=7 → 126, H=8 → 254, H=9 → 510 "Enough"; (3) take 9 bits for hosts: Network · 23 bits, Hosts · 9 bits; 2^9 = 512 total, 512 − 2 = 510 usable, enough for 500; (4) example using 192.168.1.0/24: "Not enough: a /24 has 32 − 24 = 8 host bits → only 254 usable IPs". "New prefix: /23. Borrow 1 bit → 32 − 23 = 9 host bits → 510 usable IPs"; (5) Summary: Total bits 32, Network bits 23, Host bits 9, Usable IPs 510, Supports 500 devices. | PRACTICE | Device-icon row next to "500". Blue/green bar split 23 network / 9 host. Strip of 32 "1"-cells: 23 blue + 9 green (wrapped as 25 cells + 7 cells). Red "Not enough" card and green "New prefix: /23" card. | No |
| 21 | Traditional network classes and their CIDRs | Class A = 255.0.0.0 (/8); B = 255.255.0.0 (/16); C = 255.255.255.0 (/24) ("Default Subnet Mask with CIDR representations"). | KEY CONCEPT | 2-column table | No |
| 22 | Private Addresses: Reusable not Public | Private IPs are used in local networks such as homes and offices. The same private range can be reused across different networks. Example: your home laptop might have 192.168.1.10, and another student's laptop in a different city could also have 192.168.1.10. Both are valid because they are in separate private networks. Figure "RFC 1918 private ranges": /8 10.0.0.0 – 10.255.255.255; /12 172.16.0.0 – 172.31.255.255; /16 192.168.0.0 – 192.168.255.255. "Same private range, different networks": Home Wi-Fi 192.168.1.0/24, Office LAN 10.0.0.0/24, Cloud VPC 10.0.0.0/16. "Not public routable — sets up NAT next lecture"; "NAT bridge" tag. | KEY CONCEPT | Left: 3 prefix badges (/8 blue, /12 teal, /16 green) next to range boxes. Right panel: 3 coloured headers (Home Wi-Fi, Office LAN, Cloud VPC) over their CIDRs, red "Not public routable" text and a pink "NAT bridge" pill. | No |
| 23 | Cloud bridge: VPCs use the same CIDR math | Left panel "AWS VPC CIDR block": "VPC: 10.0.0.0/16" containing "subnet 10.0.1.0/24" and "subnet 10.0.2.0/24"; "Subnets carve the larger block into smaller pieces." Right panel "Demo math to do live": 10.0.0.0/16, host bits = 16, 2^16 = 65,536 addresses; 10.0.1.0/24, host bits = 8, 2^8 = 256 addresses; green bar "Usable host count: /16 → 65,534, /24 → 254"; "Console cue: VPC → IPv4 CIDR → compare with a /24 subnet." | AWS / DEMO | Rounded blue VPC box with two subnet boxes inside, plus a math panel. | No |
| 24 | Cloud bridge: VPCs use the same CIDR math | AWS console screenshots. (a) Your VPCs (1/2): CN-Lab-VPC-vpc, vpc-08062d5ccf8104af0, Available; the second VPC is vpc-0f34a71fce73316ff (unnamed). CIDRs tab: IPv4, 10.0.0.0/16, Associated. (b) Subnets (1/10): CN-Lab-VPC-subnet-private2-us-east-1b, subnet-0751527e050159830; details: IPv4 CIDR 10.0.144.0/20; Available IPv4 addresses 4091; AZ use1-az6 (us-east-1b); route table rtb-05688e9489fe1712a. (c) CN-Lab-VPC-subnet-public1-us-east-1a, subnet-05d488676845659e3; IPv4 CIDR 10.0.0.0/20; Available IPv4 addresses 4091. | AWS / DEMO | Three console screenshots (VPC list + CIDRs tab; two Subnet detail panes). | No |
| 25 | Please fill the feedback form. | Filler. | none | none | No |
| 26 | Thank You | Filler. | none | none | No |

## Worked examples & numericals (verbatim givens, steps and answers as shown; flag any arithmetic error you notice in the source)
1. **Decimal → binary (p8):** 192 = 11000000, 168 = 10101000, 0 = 00000000, 1 = 00000001, so 192.168.0.1 = 11000000.10101000.00000000.00000001. Correct. The bullet example uses 192.168.1.1, but the figure uses 192.168.0.1.
2. **Classful counts (p12, p13, p14).** The source gives approximations; exact values are listed for reference.
   - Class A networks "~128": 2^7 = 128. Not stated on the slide: 0 and 127 are reserved, so 126 are usable.
   - Class A hosts "~16.7 million" (p12) and "16 Million" (p13): 2^24 − 2 = 16,777,214. p14 gives "16,777,216 individual IPs", which is 2^24 with no −2. That is correct as a total address count.
   - Class B networks "~16,000": 2^14 = 16,384.
   - Class B hosts "~65,000" (p12) and "over 65,000" (p15), but **"64,000" on p13**. The exact value is 2^16 − 2 = 65,534. **FLAG: p13's 64,000 does not match p12 and is the weaker approximation.**
   - Class C networks "~2 million": 2^21 = 2,097,152.
   - Class C hosts 254 = 2^8 − 2. Correct.
3. **192.168.1.0/24 (p18):** Netmask 255.255.255.0, Base 192.168.1.0, Broadcast 192.168.1.255, Count 256, First 192.168.1.1, Last 192.168.1.254. Usable = 2^8 − 2 = 254. All verified.
4. **CIDR Examples table (p19).** Columns: CIDR, Network, Mask, First usable, Last usable, Total Hosts, Use case.

   | CIDR | Network | Mask | First usable | Last usable | Total Hosts | Use case |
   |---|---|---|---|---|---|---|
   | 10.0.0.0/8 | 10.0.0.0 | 255.0.0.0 | 10.0.0.1 | 10.255.255.254 | 16,777,214 | Large enterprise networks |
   | 172.16.0.0/12 | 172.16.0.0 | 255.240.0.0 | 172.16.0.1 | 172.31.255.254 | 1,048,574 | Medium enterprise networks |
   | 192.168.0.0/16 | 192.168.0.0 | 255.255.0.0 | 192.168.0.1 | 192.168.255.254 | 65,534 | Large home/office networks |
   | 192.168.1.0/24 | 192.168.1.0 | 255.255.255.0 | 192.168.1.1 | 192.168.1.254 | 254 | Standard home/small office |
   | 192.168.1.0/25 | 192.168.1.0 | 255.255.255.128 | 192.168.1.1 | 192.168.1.126 | 126 | Small office subnets |
   | 192.168.1.0/26 | 192.168.1.0 | 255.255.255.192 | 192.168.1.1 | 192.168.1.62 | 62 | Department networks |
   | 192.168.1.0/27 | 192.168.1.0 | 255.255.255.224 | 192.168.1.1 | 192.168.1.30 | 30 | Small team networks |
   | 192.168.1.100/32 | 192.168.1.100 | 255.255.255.255 | 192.168.1.100 | 192.168.1.100 | 1 | Single host/loopback |

   All rows were checked with Python `ipaddress` and are correct. Note: /32 is an exception to 2^h − 2, because it gives 1 address and the first and last are the same. Labelling /32 as "loopback" is loose; loopback is 127.0.0.0/8, and /32 is just a single-host route.
5. **Subnet for 500 devices (p20):** Find the smallest H with 2^H − 2 ≥ 500: H=7 → 126, H=8 → 254, H=9 → 510 (Enough). 2^9 = 512, and 512 − 2 = 510. Prefix = 32 − 9 = /23. "A /24 has 32 − 24 = 8 host bits → only 254 usable IPs"; "Borrow 1 bit → 32 − 23 = 9 host bits → 510 usable IPs". The arithmetic is correct. **FLAG (wording/notation): the example is written as "using 192.168.1.0/24 → New prefix /23". 192.168.1.0 is not on a /23 boundary; the /23 that contains it is 192.168.0.0/23 (192.168.0.0–192.168.1.255). Also, going from /24 to /23 means "giving" one network bit to the host part, which is the reverse of borrowing in subnetting. The slide says "Borrow 1 bit".**
6. **Company needing 500 addresses (p15):** A Class C (254) is too small, so it gets a Class B (~65,000), wasting the rest. This sets up the p20 example.
7. **VPC math (p23):** 10.0.0.0/16 → host bits 16 → 2^16 = 65,536 addresses; 10.0.1.0/24 → host bits 8 → 2^8 = 256. "Usable host count: /16 → 65,534, /24 → 254". The arithmetic is correct for classic subnetting. **FLAG (cross-deck): in AWS, 5 addresses per subnet are reserved (L14 p16), so AWS usable counts would be 65,531 and 251.** This slide uses the traditional −2.
8. **Console (p24):** /20 subnets 10.0.144.0/20 and 10.0.0.0/20 each show "Available IPv4 addresses 4091". 2^12 = 4096, and 4096 − 5 = 4091 (AWS reserves 5). This is consistent; the slide gives no explanation, which comes in L14.
9. **p17 statement FLAG:** "192.168.0.1 = Network address". In 192.168.0.1/24 the network address is 192.168.0.0; 192.168.0.1 is a host (first usable) address. The slide uses "Network address" loosely to mean the IP part of the notation.
10. **p11 figure FLAG:** "172.16.1.10" shows Network ID = 172.16.1 and Host ID = 10, which is a /24-style split. Under classful rules 172 is Class B (128–191), so Network ID = 172.16 and Host ID = 1.10. The figure contradicts the Class B octet diagram on the same slide.

## Formulas stated
- Usable Hosts = 2^h − 2, where h = host bits. The −2 is the CIDR Base IP (network) and the Broadcast IP (p18, p20).
- Host bits = 32 − prefix (e.g. 32 − 24 = 8, 32 − 23 = 9) (p20).
- Total addresses = 2^h (2^9 = 512; 2^16 = 65,536; 2^8 = 256) (p20, p23).
- CIDR Notation = IP Address / CIDR Value, where the CIDR value = number of 1s in the subnet mask (p17, p18).
- Class bit allocation: A = 1 class bit + 7 network + 24 host; B = 2 + 14 + 16; C = 3 + 21 + 8 (p12).
- Default masks: A 255.0.0.0 (/8), B 255.255.0.0 (/16), C 255.255.255.0 (/24) (p21).

## Diagrams that must be recreated (page → description: nodes, arrows, labels, field widths)
- **p4:** 3 user PCs (left) with two-way arrows to an "Internet" cloud ↔ "Load Balancer" (green box with a fan-out arrow icon) ↔ a vertical bus fanning out to 3 server stacks (right). Labels: Users, Servers, Load Balancer.
- **p5:** Two columns separated by a dashed line.
  - ALB column (blue): Client requests ↓ "Application load balancer — Layer 7 · HTTP/HTTPS" splits into "/api/*" ↓ "TG: api" ↓ "EC2 (3)" and "/web/*" ↓ "TG: web" ↓ "EC2 (3)". Caption: "No static IP - DNS name only".
  - NLB column (teal): Client requests ↓ "Network load balancer — Layer 4 · TCP/UDP/TLS" ↓ "Forward all traffic" ↓ "Target group: tcp-app" ↓ "EC2 instances (3)". Caption: "Static IP + preserves client IP".
  - EC2 boxes are grey. Legend at the bottom.
- **p7:** Postal-label analogy: 4 labels (COUNTRY CODE, STATE CODE, CITY CODE, STREET NUMBER) with down-arrows onto a label reading "US-CA-LA" / "1234".
- **p8:** Bit-weight table (header 2^7 … 2^0; rows 192, 168, 0, 1 in binary). Below it, 192.168.0.1 with arrows from each octet to its 8-bit binary string, labelled First, Second, Third and Fourth Octet.
- **p11:** 3 × 4 grid of octet boxes (blue Network / yellow Host): A = N H H H; B = N N H H; C = N N N H. An "octet" brace over each column. Address 172.16.1.10 with a "Network ID" brace and a "Host ID" bracket. Class table: Left-most bit 0xxx / 10xx / 110x; Start/Last IP.
- **p12:** Class bit-allocation table (pattern strings of N and H as in the Page table).
- **p17:** Mask 255.255.255.0 in binary; a brace over the 24 ones labelled "24 bits 1s, Network Bits" → "CIDR Value = 24" → "CIDR Notation = 192.168.0.1/24".
- **p18:** 32-bit bar split into Network = 24 bits | Host = 8 bits; mask binary and dotted decimal; "/24 (Number of 1's)". Calculator card with colour-coded octets 192|168|1|0 /24 and bit strips; six labelled values: Netmask, CIDR Base IP, Broadcast IP, Count, First Usable, Last Usable. An arrow leads to the formula 2^h − 2, whose two branches go to "CIDR Base IP" and "Broadcast IP".
- **p20:** Five-step card layout. Host-bit table (H: 7/8/9 → 126/254/510, with the 9 row highlighted "Enough"). Split bar: Network · 23 bits | Hosts · 9 bits. 32-cell bit strip (23 blue network, 9 green host). Red card "Not enough /24" vs green card "New prefix /23". Summary tiles: 32 / 23 / 9 / 510 / 500 devices.
- **p22:**
  - RFC 1918 panel: three rows of badge + range (/8 10.0.0.0–10.255.255.255; /12 172.16.0.0–172.31.255.255; /16 192.168.0.0–192.168.255.255).
  - Side panel "Same private range, different networks": Home Wi-Fi 192.168.1.0/24 | Office LAN 10.0.0.0/24 | Cloud VPC 10.0.0.0/16; "Not public routable / sets up NAT next lecture"; "NAT bridge".
- **p23:** Large rounded box "VPC: 10.0.0.0/16" containing two boxes "subnet 10.0.1.0/24" and "subnet 10.0.2.0/24", with the caption "Subnets carve the larger block into smaller pieces." Side panel with the /16 vs /24 math.

## Code / CLI / config shown (verbatim)
- No code or CLI. AWS console values on p24:
  - VPC `CN-Lab-VPC-vpc` = `vpc-08062d5ccf8104af0`, IPv4 CIDR `10.0.0.0/16` (Associated); other VPC `vpc-0f34a71fce73316ff`.
  - Subnet `CN-Lab-VPC-subnet-private2-us-east-1b` = `subnet-0751527e050159830`, IPv4 CIDR `10.0.144.0/20`, Available IPv4 addresses `4091`, AZ `use1-az6 (us-east-1b)`, Route table `rtb-05688e9489fe1712a`.
  - Subnet `CN-Lab-VPC-subnet-public1-us-east-1a` = `subnet-05d488676845659e3`, IPv4 CIDR `10.0.0.0/20`, Available IPv4 addresses `4091`.
  - Other subnet IDs in the list: `subnet-0db376f5974b502b7`, `subnet-0921c3e5132120302`, `subnet-0a178c5d3700e46d8` (all in vpc-0f34a71fce73316ff). The list shows "Subnets (1/10)".
- p23 console cue: "VPC → IPv4 CIDR → compare with a /24 subnet."

## In-class questions / quiz prompts shown on slides (verbatim, with answers if given)
- p13: "Think about how many potential devices in a flat Class A network?" Answer on the slide: "For class A and Class B, that's too many devices to be managed by a single router!" (table: A 16 Million, B 64,000, C 254).
- p20 (implicit problem): "We need at least 500 IP addresses to connect 500 devices in one subnet". Answer: 9 host bits, /23, 510 usable IPs.
- p23 "Demo math to do live": 10.0.0.0/16 vs 10.0.1.0/24. Answers: 65,536 / 256 addresses; usable 65,534 / 254.

## Unclear / unreadable (page → what is unreadable and why)
- p22: Below the RFC 1918 ranges, a white box masks part of the figure. Only a fragment ending "...ute them" (likely "routers don't route them") is visible. Not recoverable.
- p6: The public IP in the cartoon cloud is tiny. It was read as "68.195.213.248"; this is decorative.
- p24: Some subnet-list columns (IPv4 CIDR column at the far right) are cut off. Details were read from the detail panes at 200 dpi.

## Duplicate / overlap notes (pages that repeat other decks or earlier pages)
- p4–p5 are a recap of the previous lecture (load balancers: ALB L7 vs NLB L4, target groups).
- p11, p12 and p13 all restate the class ranges (0–127, 128–191, 192–223) in different forms. Host counts differ (p12 ~65,000 vs p13 64,000).
- p14 (16,777,216 IPs) repeats the p13 Class A scale point.
- p15's "500 addresses" scenario is solved on p20.
- p17 and p18 overlap (/24 mask binary → CIDR value).
- p18 calculator image (192.168.1.0/24) and the p11 172.16.1.10 / octet-class figure are reused in L14 p3 (Recap).
- p24 console screenshot of subnet private2 (10.0.144.0/20, 4091) is reused in L14 p17. The CN-Lab-VPC with 4 subnets in us-east-1a/1b also appears in L14 p11.
- p22 "sets up NAT next lecture" points ahead to the NAT lecture.

## Topic list (flat bullet list of every distinct topic/subtopic covered, in order)
- Recap: load balancer topology (users → internet → LB → servers)
- Recap: ALB (Layer 7, HTTP/HTTPS, path routing /api/* /web/*, target groups, DNS name only) vs NLB (Layer 4, TCP/UDP/TLS, static IP, preserves client IP)
- Definition of an IP address; "Internet Protocol"
- Private vs public IP illustration (home devices 192.168.0.x behind a public IP)
- IPv4 postal-code analogy
- IPv4 structure: 32 bits, 4 octets, 0–255, dotted decimal
- Decimal ↔ binary conversion of octets (192.168.0.1)
- History of IPv4 address management; city-zone analogy for classes A/B/C
- Classful addressing: network/host octet split for A, B, C
- Leading bits (0, 10, 110) and class ranges (0–127, 128–191, 192–223)
- Bit allocation per class (7/24, 14/16, 21/8) and the number of networks and hosts per class
- Waste and unassigned addresses in classful addressing
- Scale problem: a flat Class A network (16,777,216 IPs) is too many for one router
- Packet journey to 9.10.10.10 (IBM's Class A 9.0.0.0): core router uses network ID, gateway router uses host ID
- IPv4 address exhaustion; 500-address company forced into a Class B; 2025 IPv4 market price ($20–45 buy, ~$0.40/IP/month lease)
- CIDR (Classless Inter-Domain Routing): motivation, format IP/prefix, prefix = number of mask 1-bits
- Subnet mask ↔ prefix length (255.255.255.0 = /24)
- Network (base) address, broadcast address, first and last usable IP, count
- Usable hosts formula 2^h − 2
- CIDR examples table /8, /12, /16, /24, /25, /26, /27, /32
- Sizing a subnet for N hosts (500 devices → /23, 510 usable)
- Default classful masks as CIDR (/8, /16, /24)
- Private addresses (RFC 1918: 10/8, 172.16/12, 192.168/16); reuse across networks; not publicly routable; NAT preview
- Cloud bridge: AWS VPC CIDR block (10.0.0.0/16) carved into subnets (10.0.1.0/24, 10.0.2.0/24); /16 vs /24 address math
- AWS console demo: VPC CIDRs tab, subnet details (/20 subnets, 4091 available IPv4 addresses)
