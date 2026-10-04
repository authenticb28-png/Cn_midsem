# SL-L15 pages 1–33 — NAT, PAT & DHCP — and How VPC Route Tables Wire It Together

(Lecture 15, by Vikas Kumar, CSAI Computer Networks, Newton School of Technology. File: "Lectures/L15 - Lecture 15 — NAT, PAT, DHCP & VPC Routing.pdf". Printed slide numbers are in the bottom-right corner and do NOT match PDF page numbers; they are noted in brackets below where shown.)

## Page table
| Page | Section/slide title | Content summary (exact facts, numbers, definitions, lists — be specific, not vague) | Callout type | Diagram/figure on page (describe so it can be redrawn) | Handwriting present? |
|---|---|---|---|---|---|
| 1 | Title: "NAT, PAT & DHCP — and How VPC Route Tables Wire It Together" | by Vikas Kumar; CSAI Computer Networks; Newton School of Technology logo | none | Stock image of a glowing network globe (decorative) | No |
| 2 | "Join the lecture online on your dashboard" | Filler | none | Gradient background | No |
| 3 | Recap — Subnetting [02] | Recap of the previous lecture (L14 subnetting) as a picture: one big network split into smaller per-department networks | none (recap) | Illustration: top box "ONE BIG NETWORK (ONE DEPARTMENT)" (a room of people at laptops) → arrow labelled "SUBNETTING" → 4 boxes: "SALES DEPARTMENT – Smaller network for Sales team", "HR DEPARTMENT – Smaller network for HR team", "FINANCE DEPARTMENT – Smaller network for Finance team", "IT DEPARTMENT – Smaller network for IT team" | No |
| 4 | How Does Your Phone Browse on a Private IP? [02] | Motivating question. Bullets: Private subnets can't be reached from the Internet. Yet your phone on home WiFi has a private IP… …and still loads every website just fine. | none (hook) | 3 boxes: "Your phone 192.168.0.14" → [blank/unlabelled middle box — the hidden answer is the router] → "Internet" | No |
| 5 | Section divider "NAT" | "Rewriting addresses at the border." | none | none | No |
| 6 | What Does NAT Actually Do? [05] | On the way out, the router swaps the private source IP for a public one. On the way back, it reverses the swap, restoring the private IP. Takeaway line: "The reply only finds its way home because the router remembers the swap." | TAKEAWAY (italic footer) | (a) Before/after packet header boxes: "BEFORE — leaving the host": SRC 192.168.1.20 (red), DST 93.184.216.34; "↓ through the NAT router ↓"; "AFTER — on the Internet": SRC 203.0.113.7 (green), DST 93.184.216.34 (DST unchanged). (b) Small chain: "Your phone 192.168.0.14" → "Home router / the border" (dark box) → "Internet"; caption "One address does the trick" | No |
| 7 | Ten Devices, One Public IP — All at Once? [03] | Problem statement for PAT: many home devices (phone, laptop, TV, console, tablet, + 5 more) all map to one public IP 203.0.113.7 "from your ISP". Partial NAT table without ports shows two inside hosts both mapping to 203.0.113.7 with the same destination — so replies are ambiguous. Footer: "Everyone streaming, scrolling, gaming — through a single address. How?" | none (problem/hook) | Device tiles (phone, laptop, TV, console, tablet, "+5 more") → arrow → dark box "one public IP 203.0.113.7" captioned "from your ISP". Table (3 cols): Inside (private) / Outside (public) / Destination: row1 192.168.1.20 / 203.0.113.7 / 93.184.216.34:443; row2 192.168.1.21 / 203.0.113.7 / 93.184.216.34:443; empty 3rd row | No |
| 8 | Section divider "PAT" | "Rewriting addresses at the border." (same subtitle as NAT divider) | none | none | No |
| 9 | PAT- Port Address Translation [06] | Add the port number to the translation — not just the IP. One public IP can now serve many hosts at the same time. This is exactly what your home router does every second. Footer: "Same public IP, a different port each — that is the whole trick." | TAKEAWAY | Left: three socket tiles 192.168.1.20:51000, 192.168.1.21:51000, 192.168.1.35:49876 → arrow → dark box "one public IP 203.0.113.7" with ports ":40001 · :40002 · :4000(3)" (cut off), caption "unique ports" | No |
| 10 | What's Inside the Translation Table? [07] | Full PAT translation table (3 entries). Footer: "Two hosts reused port 51000 — the outside port is the key that routes each reply home." | KEY CONCEPT (footer) | Table Inside (private) / Outside (public) / Destination: 192.168.1.20:51000 → 203.0.113.7:40001 → 93.184.216.34:443; 192.168.1.21:51000 → 203.0.113.7:40002 → 93.184.216.34:443; 192.168.1.35:49876 → 203.0.113.7:40003 → 142.250.72.14:443. Inside ports 51000 highlighted red (duplicate), outside ports green (unique) | No |
| 11 | What Do We Gain, What Do We Break? [08] | We gain: Conserves scarce public IPv4 addresses; Hides internal hosts — a security side-effect. We break: End-to-end reachability is gone; Inbound now needs explicit setup. | none (pros/cons) | Two-column card: green "We gain" / red "We break" | No |
| 12 | Quiz slide [09] | Q: "Two laptops behind one home IP both open the same website. What field lets the NAT box tell their replies apart?" A: "The port number — that's PAT." | QUIZ | Question + answer box | No |
| 13 | Section divider "DHCP" | "Addresses, handed out automatically." | none | none | No |
| 14 | Who Configures Every New Device? [11] | "Nobody types IP settings by hand. One DHCP lease delivers four things at once:" 1 IP address, 2 Subnet mask, 3 Default gateway, 4 DNS server. Footer: "A lease expires — so addresses get renewed and recycled over time." | KEY CONCEPT | Four numbered cards 1–4 in a row | No |
| 15 | Meet DORA: The Four-Step Handshake [12] | D = Discover: Client broadcasts: "anyone out there?"; O = Offer: Server proposes an address; R = Request: Client asks for that one; A = Ack: Server confirms the lease. Footer: "Discover and Request are broadcasts — the whole subnet hears them." | KEY CONCEPT | Four column cards with header letters D / O / R / A (alternating light/dark blue) | No |
| 16 | What Does DORA Look Like on the Wire? [13] | Bullets: Capture on any subnet and you'll see the four frames. Discover and Request go to 255.255.255.255. The address comes from a Lecture 14 subnet range. Footer: "The clearest broadcast handshake you'll capture all term." NOTE: in the capture ALL FOUR frames (incl. Offer and Ack) have destination 255.255.255.255. No UDP port numbers (67/68) appear anywhere in the deck. | DEMO (Wireshark-style capture) | Wireshark-style table titled "dhcp-capture.pcapng", columns No. / Source / Destination / Proto / Info: 1 0.0.0.0 → 255.255.255.255 DHCP Discover; 2 192.168.1.1 → 255.255.255.255 DHCP Offer; 3 0.0.0.0 → 255.255.255.255 DHCP Request; 4 192.168.1.1 → 255.255.255.255 DHCP Ack | No |
| 17 | Section divider "Routing Tables" | "The decision at every hop." | none | none | No |
| 18 | What Is a Route Table, Really? [15] | Just a list: destination prefix → next hop. The router checks it for every single packet. The most specific match wins — longest-prefix match. Footer: "No magic — a lookup table the router reads by specificity, top match wins." | KEY CONCEPT | Table Destination / Next hop: 10.0.0.0/16 → local; 10.0.1.0/24 → router-B; 0.0.0.0/0 → gateway | No |
| 19 | Where Does "Everything Else" Go? [16] | 0.0.0.0/0 is the default route — the catch-all. When prefixes overlap, the longest one wins. So where does a packet to 10.0.1.55 go? Answer shown: 10.0.1.0/24 (winner, /24). Footer: "Specificity beats generality — the longest prefix wins, every time." | PRACTICE (worked LPM example) | Panel "Packet to 10.0.1.55 — which route?": rows 0.0.0.0/0 — "/0 · too broad"; 10.0.0.0/16 — "/16 · matches"; 10.0.1.0/24 — "✓ winner (/24)" (green highlight) | No |
| 20 | Section divider "The AWS Picture" | "IGW, NAT Gateway & VPC route tables." | none | none | No |
| 21 | How Does a VPC Touch the Internet (IGW)? [18] | An IGW attaches your VPC to the Internet. A public subnet routes 0.0.0.0/0 → IGW. Its instances can be reached both ways. Footer: "\"Public subnet\" simply means: has a route to the IGW." | AWS | VPC architecture diagram: "Internet" → "Internet gateway" → into box "VPC 10.0.0.0/16" containing: Public subnet A 10.0.1.0/24 · AZ-a (contains "NAT gateway" box); Public subnet B 10.0.2.0/24 · AZ-b; Private subnet A 10.0.3.0/24 · AZ-a; Private subnet B 10.0.4.0/24 · AZ-b. Solid arrows IGW → both public subnets; dashed arrows from NAT gateway (in Public A) → Private A and → Private B | No |
| 22 | How Does a VPC Touch the Internet (IGW)? (console screenshot) [18] | AWS VPC console "Resource map" for vpc-024dddccd10ed6ef9 / MyVPC-vpc. Subnets: us-east-1a: MyVPC-subnet-public1-us-east-1a (highlighted), MyVPC-subnet-private1-us-east-1a; us-east-1b: MyVPC-subnet-public2-us-east-1b, MyVPC-subnet-private2-us-east-1b. Route tables: MyVPC-rtb-private2-us-east-1b, MyVPC-rtb-public (highlighted), MyVPC-rtb-private1-us-east-1a, rtb-045dfd7873a875408, rtb-0c747f9209d0c9fbf. Network connections: MyVPC-igw ("Internet routes to 2 public subnets; 0 private subnets route to the Internet"), "MyNAT gataeway" [sic], MyVPC-vpce-s3. Highlighted path: public1 subnet → MyVPC-rtb-public → MyVPC-igw. Same footer. | AWS / DEMO | 3-column resource map (Subnets → Route tables → Network connections) with connector lines; public subnets both connect to MyVPC-rtb-public → MyVPC-igw | No |
| 23 | How Does a VPC Touch the Internet (IGW)? (route table screenshot) [18] | Route table: rtb-0501e38d89e6a39fa / MyVPC-rtb-public. Routes (2): 10.0.0.0/16 → local; 0.0.0.0/0 → igw-0e4226802ca4594de | AWS / DEMO | Console route-table screenshot (Destination / Target) | No |
| 24 | Outbound Only — The NAT Gateway [19] | The NAT Gateway lives in a public subnet. A private subnet routes 0.0.0.0/0 → NAT GW. Instances get updates out — but stay unreachable in. Footer: "Updates flow out; attackers can't flow in." | AWS | Same console resource map; highlighted path: MyVPC-subnet-private1-us-east-1a → MyVPC-rtb-private1-us-east-1a → MyVPC-vpce-s3 ("Gateway endpoint to S3"). (The highlighted path goes to the S3 endpoint, not the NAT gateway.) | No |
| 25 | Outbound Only — The NAT Gateway (route table screenshot) [19] | Subnet list (MyVPC-subnet-private1-us-east-1a = subnet-0d224d45b2001770e, Available, vpc-024dddccd10ed6ef9; MyVPC-subnet-private2-us-east-1b = subnet-0392ace67a3250fc7; plus two unnamed subnets in vpc-0ee9879991d5196a6). Route table: rtb-0715f7aa8f1d9415e / MyVPC-rtb-private1-us-east-1a. Routes (2): 10.0.0.0/16 → local; pl-63a5400a → vpce-06cd2371b631a5c0a. NOTE: there is NO 0.0.0.0/0 → nat-… route in this screenshot despite the slide title — the second route is an S3 prefix list → VPC gateway endpoint. | AWS / DEMO | Console screenshot (subnet list + route table) | No |
| 26 | Public vs. Private Route Table — Spot the Difference [20] | Public subnet RT: 10.0.0.0/16 → local; 0.0.0.0/0 → igw-0a1b. Private subnet RT: 10.0.0.0/16 → local; 0.0.0.0/0 → nat-9f7c. Footer: "Same VPC. One word in one row changes who reaches the Internet — and who reaches you." | KEY CONCEPT / AWS | Two side-by-side 2-row tables (blue header "Public subnet RT", navy header "Private subnet RT"); igw-0a1b in green, nat-9f7c in red | No |
| 27 | Quiz slide [21] | Q: "A private-subnet server needs OS updates but must never accept inbound connections. Which gateway, and what route?" A: "NAT Gateway · 0.0.0.0/0 → NAT GW" | QUIZ / AWS | Question + answer box | No |
| 28 | Section divider "Activity: Be the NAT Box" | "Five minutes. One translation table. Everyone plays." | none | none | No |
| 29 | Be the NAT Box — Then Break It [23] | 1 Cast the room: one NAT router at the board, four inside hosts with private IPs, instructor = the Internet. 2 Each host sends a request card; the NAT student rewrites source → one public IP + a unique port, and logs it. 3 Replies come back to the public IP + port — route each one home using only the table. 4 The twist: reuse a port on purpose → collision → feel exactly why every mapping must be unique. Footer: "Same logic you just performed runs as the AWS NAT Gateway in the console." | PRACTICE (class activity) | Numbered list 1–4 (step 4 in red) | No |
| 30 | Key Takeaways [24] | NAT/PAT lets many private hosts share one public IP by rewriting address + port — the reason your whole house browses through one ISP address. DHCP (DORA) auto-leases address + mask + gateway + DNS from your subnet's range. In AWS the route table is the switch: 0.0.0.0/0 → IGW makes a subnet public; 0.0.0.0/0 → NAT GW gives a private subnet outbound-only Internet. | TAKEAWAY | none | No |
| 31 | Next Up: ICMP, then IPv6 [25] | We've leaned on ping & traceroute all term — they ride on ICMP. Next: ICMP properly, and the diagnostics it powers. Then IPv6 — the long-term answer to the exhaustion that made NAT necessary. | none | none | No |
| 32 | "Please fill the feedback form." | Filler | none | none | No |
| 33 | "Thank You" | Filler | none | none | No |

## Worked examples & numericals (verbatim givens, steps and answers as shown; flag any arithmetic error you notice in the source)
1. **Basic NAT rewrite (p6):** BEFORE — leaving the host: SRC 192.168.1.20, DST 93.184.216.34. Through the NAT router. AFTER — on the Internet: SRC 203.0.113.7, DST 93.184.216.34. Only SRC changes; reply is reversed because the router "remembers the swap". (Inconsistency: same slide's small diagram labels the phone 192.168.0.14, while the header example uses 192.168.1.20.)
2. **NAT-without-ports ambiguity (p7):** 192.168.1.20 → 203.0.113.7 → 93.184.216.34:443 and 192.168.1.21 → 203.0.113.7 → 93.184.216.34:443 — two identical outside/destination rows, so replies can't be told apart ("How?").
3. **PAT translation table (p10):**
   | Inside (private) | Outside (public) | Destination |
   |---|---|---|
   | 192.168.1.20:51000 | 203.0.113.7:40001 | 93.184.216.34:443 |
   | 192.168.1.21:51000 | 203.0.113.7:40002 | 93.184.216.34:443 |
   | 192.168.1.35:49876 | 203.0.113.7:40003 | 142.250.72.14:443 |
   Point: two hosts reused source port 51000; unique outside port is the key for returning replies. Destination port 443 (HTTPS).
4. **Longest-prefix match (p18–19):** Table 10.0.0.0/16 → local; 10.0.1.0/24 → router-B; 0.0.0.0/0 → gateway. Packet to 10.0.1.55: 0.0.0.0/0 matches but "/0 · too broad"; 10.0.0.0/16 "/16 · matches"; 10.0.1.0/24 "✓ winner (/24)" → next hop router-B. No arithmetic errors.
5. **DHCP capture (p16):** frames 1–4 as in the page table (Discover 0.0.0.0→255.255.255.255; Offer 192.168.1.1→255.255.255.255; Request 0.0.0.0→255.255.255.255; Ack 192.168.1.1→255.255.255.255).
6. **VPC addressing (p21):** VPC 10.0.0.0/16; Public A 10.0.1.0/24 (AZ-a); Public B 10.0.2.0/24 (AZ-b); Private A 10.0.3.0/24 (AZ-a); Private B 10.0.4.0/24 (AZ-b). No numerical computation shown (no host counts).
- No arithmetic errors found (there is no arithmetic in the deck). No numericals beyond the above.

## Formulas stated
- None stated as formulas. Rules stated:
  - Route lookup = destination prefix → next hop; most specific (longest-prefix) match wins (p18–19).
  - 0.0.0.0/0 = default route / catch-all (p19).
  - Public subnet ⇔ route table has 0.0.0.0/0 → IGW; private subnet with outbound-only Internet ⇔ 0.0.0.0/0 → NAT GW (p21, p24, p26, p30).
  - PAT mapping key = (public IP, unique outside port) (p9–10).

## Diagrams that must be recreated (page → description: nodes, arrows, labels, field widths)
- **p4/p6 border chain:** [Your phone 192.168.0.14] → [Home router — "the border"] → [Internet]; caption "One address does the trick".
- **p6 before/after header:** two stacked cards: "BEFORE — leaving the host" (SRC 192.168.1.20 | DST 93.184.216.34) → "↓ through the NAT router ↓" → "AFTER — on the Internet" (SRC 203.0.113.7 | DST 93.184.216.34). Highlight SRC as the changed field.
- **p7 many-to-one:** device tiles (phone, laptop, TV, console, tablet, +5 more) → [one public IP 203.0.113.7, "from your ISP"].
- **p9 PAT fan-in:** 192.168.1.20:51000, 192.168.1.21:51000, 192.168.1.35:49876 → [one public IP 203.0.113.7  :40001 · :40002 · :40003] "unique ports".
- **p10 PAT translation table** (see worked example 3), with duplicate inside port 51000 in red and unique outside ports in green.
- **p15 DORA:** 4 cards D/O/R/A with role text; ideally redraw as a client–server ladder: Discover (client broadcast) → Offer (server) → Request (client broadcast) → Ack (server).
- **p16 capture table** (4 rows, see page table).
- **p18/19 route table + LPM panel.**
- **p21 VPC diagram:** Internet → Internet gateway → VPC 10.0.0.0/16 {Public subnet A 10.0.1.0/24 AZ-a [contains NAT gateway], Public subnet B 10.0.2.0/24 AZ-b, Private subnet A 10.0.3.0/24 AZ-a, Private subnet B 10.0.4.0/24 AZ-b}; IGW solid arrows to both public subnets; NAT gateway dashed arrows to both private subnets.
- **p22/p24 AWS resource map:** columns Subnets (4) → Route tables (5) → Network connections (MyVPC-igw, MyNAT gateway, MyVPC-vpce-s3).
- **p26 public vs private RT:** two 2-row tables, differing only in the 0.0.0.0/0 target (igw-0a1b vs nat-9f7c).

## Code / CLI / config shown (verbatim)
- No code or CLI commands. Config/console artefacts shown:
  - Route table (p18): `10.0.0.0/16 local` / `10.0.1.0/24 router-B` / `0.0.0.0/0 gateway`
  - AWS route table rtb-0501e38d89e6a39fa / MyVPC-rtb-public — Routes (2): `10.0.0.0/16 local`, `0.0.0.0/0 igw-0e4226802ca4594de` (p23)
  - AWS route table rtb-0715f7aa8f1d9415e / MyVPC-rtb-private1-us-east-1a — Routes (2): `10.0.0.0/16 local`, `pl-63a5400a vpce-06cd2371b631a5c0a` (p25)
  - Public subnet RT: `10.0.0.0/16 local`, `0.0.0.0/0 igw-0a1b`; Private subnet RT: `10.0.0.0/16 local`, `0.0.0.0/0 nat-9f7c` (p26)
  - Capture file name `dhcp-capture.pcapng` (p16)

## In-class questions / quiz prompts shown on slides (verbatim, with answers if given)
- p4: "How Does Your Phone Browse on a Private IP?" (answer developed on p6: NAT at the home router)
- p7: "Ten Devices, One Public IP — All at Once?" / "Everyone streaming, scrolling, gaming — through a single address. How?" (answer: PAT, p9)
- p12: "Two laptops behind one home IP both open the same website. What field lets the NAT box tell their replies apart?" — **"The port number — that's PAT."**
- p19: "So where does a packet to 10.0.1.55 go?" — **10.0.1.0/24 (winner, /24)**
- p27: "A private-subnet server needs OS updates but must never accept inbound connections. Which gateway, and what route?" — **"NAT Gateway · 0.0.0.0/0 → NAT GW"**
- p29: Activity "Be the NAT Box — Then Break It" (port reuse → collision → every mapping must be unique).

## Unclear / unreadable (page → what is unreadable and why)
- p4: middle box of the phone → ? → Internet diagram is blank (intentional reveal; filled in on p6 as "Home router — the border").
- p9: third outside port truncated at the box edge (":4000…"); p10 confirms it is :40003.
- p22/p24: console text small at 60 dpi; re-rendered p22 at 160 dpi — fully legible. p24 small labels legible enough ("Gateway endpoint to S3" under MyVPC-vpce-s3).
- p25: top row of the subnet list is cut off (unreadable subnet/vpc IDs) — irrelevant.

## Duplicate / overlap notes (pages that repeat other decks or earlier pages)
- p21, p22, p23 share the same title and footer ("How Does a VPC Touch the Internet (IGW)?", slide 18) — progressive diagram → console resource map → route table.
- p24 and p25 share title/footer (slide 19).
- p5 and p8 dividers both use subtitle "Rewriting addresses at the border."
- p3 recaps L14 Subnetting; p16 references "a Lecture 14 subnet range"; p18–19 longest-prefix match likely overlaps the routing/subnetting decks (L13/L14).
- p30 Key Takeaways restates p9–10, p14–15, p21/24/26.
- Source inconsistencies to note: (a) p25 screenshot titled "NAT Gateway" shows no NAT route (only local + S3 gateway endpoint via prefix list pl-63a5400a); p24 highlighted path also goes to vpce-s3, not the NAT GW. (b) p16 bullet says "Discover and Request go to 255.255.255.255" but the capture shows Offer and Ack ALSO to 255.255.255.255. (c) p6 phone IP 192.168.0.14 vs packet SRC 192.168.1.20. (d) Console typo "MyNAT gataeway". (e) Printed slide numbers non-monotonic (p4 "02", p6 "05", p7 "03").
- DHCP UDP ports 67/68, DHCP relay, lease timers (T1/T2), static NAT vs dynamic NAT, and NAT types (SNAT/DNAT, port forwarding) are NOT covered in this deck.

## Topic list (flat bullet list of every distinct topic/subtopic covered, in order)
- Recap: subnetting (one big network → per-department subnets)
- Motivation: private IPs not reachable from Internet, yet hosts browse
- NAT: router at the border swaps private source IP ↔ public IP; reverses on reply; router remembers mapping
- NAT before/after packet header (SRC changes, DST unchanged)
- Problem: many devices behind one public IP (ISP-assigned)
- PAT (Port Address Translation): translate IP + port; one public IP serves many hosts simultaneously; home router behaviour
- NAT/PAT translation table: inside (private IP:port) / outside (public IP:port) / destination; outside port must be unique
- NAT gains (conserves public IPv4, hides internal hosts) vs breaks (end-to-end reachability, inbound needs explicit setup)
- Quiz: port number distinguishes replies (PAT)
- DHCP: automatic configuration; lease gives IP address, subnet mask, default gateway, DNS server; leases expire, renewed/recycled
- DHCP DORA: Discover, Offer, Request, Ack; Discover and Request are broadcasts
- DORA on the wire: 0.0.0.0 source for client, 255.255.255.255 destination, server 192.168.1.1; address from a subnet range
- Route tables: destination prefix → next hop; checked per packet
- Longest-prefix match; default route 0.0.0.0/0 catch-all; worked lookup for 10.0.1.55
- AWS VPC: Internet Gateway (IGW) attaches VPC to Internet; public subnet = 0.0.0.0/0 → IGW; reachable both ways
- AWS VPC layout: VPC 10.0.0.0/16, public/private subnets across two AZs, NAT gateway in public subnet
- AWS console resource map and route tables (local route 10.0.0.0/16, igw target, S3 gateway endpoint vpce via prefix list)
- NAT Gateway: lives in public subnet; private subnet 0.0.0.0/0 → NAT GW; outbound-only (updates out, no inbound)
- Public vs private route table comparison (igw vs nat target)
- Quiz: private server needing updates without inbound → NAT Gateway, 0.0.0.0/0 → NAT GW
- Class activity: Be the NAT Box (port-collision demonstration)
- Key takeaways; next lecture: ICMP (ping/traceroute) then IPv6 (answer to IPv4 exhaustion)
