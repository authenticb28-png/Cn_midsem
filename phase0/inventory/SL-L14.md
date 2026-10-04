# SL-L14 pages 1-23 — Subnetting in Practice — and Designing an AWS VPC

Source: `Lectures/L14 - Subnetting in Practice — and Designing an AWS VPC.pdf` (Newton School of Technology, "Computer Networks", Canva deck). All 23 pages checked against the text layer and the page image. Pages 11, 12, 18 and 20 were re-rendered at 200 dpi to read the screenshots and diagrams.

## Page table
| Page | Section/slide title | Content summary (exact facts, numbers, definitions, lists — be specific, not vague) | Callout type | Diagram/figure on page | Handwriting present? |
|---|---|---|---|---|---|
| 1 | Title: "Subnetting in Practice — and Designing an AWS VPC" | Subtitle "Computer Networks"; Newton School of Technology logo. | none | Decorative mesh triangle | No |
| 2 | Join the lecture online on your dashboard | Filler. | none | none | No |
| 3 | Recap — CIDR / IP Address | Recap of L13: 172.16.1.10 with "Network ID" (172.16.1) / "Host ID" (10) braces. Class A/B/C octet grid (A = N H H H, B = N N H H, C = N N N H). CIDR calculator for 192.168.1.0/24: Netmask 255.255.255.0, CIDR Base IP 192.168.1.0, Broadcast IP 192.168.1.255, Count 256, First Usable IP 192.168.1.1, Last Usable IP 192.168.1.254. | none (recap) | Same three figures as L13 p11 and p18 | No |
| 4 | One large network becomes difficult to manage | Section divider. | none | none | No |
| 5 | Subnetting = Dividing One Network | "Subnetting means splitting one big network into smaller networks." | KEY CONCEPT / ANALOGY | Illustration: "ONE BIG NETWORK (ONE DEPARTMENT)" (a big office room) → "SUBNETTING" → 4 boxes: SALES DEPARTMENT "Smaller network for Sales team", HR DEPARTMENT "...for HR team", FINANCE DEPARTMENT "...for Finance team", IT DEPARTMENT "...for IT team". | No |
| 6 | Borrowing Host Bits | "We do subnetting by borrowing bits from the host part." A CIDR block has two parts: Network Bits + Host Bits. Example: 10.0.0.0/24 → /24 means 24 network bits; 32 − 24 = 8 host bits. "Now borrow k host bits for subnetting." Card: "borrow k host bits → 2^k subnets"; "each subnet → 2^(host − k) addresses". Three panels: "Start with /24": Host bits = 32 − 24 = 8; Total addresses = 2^8 = 256. "Need 4 subnets": 4 = 2^2, so borrow k = 2 bits. "New prefix": /24 + 2 = /26; each gets 2^6 = 64 addresses. | KEY CONCEPT / PRACTICE | Purple-bordered card: two formula pills on top and three columns (blue / purple / green). | No |
| 7 | Magic Number Shortcut | Worked example: 10.0.0.0/24 → four /26s. Blocks: 10.0.0.0/26 (0-63), 10.0.0.64/26 (64-127), 10.0.0.128/26 (128-191), 10.0.0.192/26 (192-255). "Block size = 64. Network addresses jump by 64: .0, .64, .128, .192". "For /26, subnet mask is: 255.255.255.192. Magic number: 256 - 192 = 64. So subnet blocks jump by 64: .0, .64, .128, .192". | KEY CONCEPT / PRACTICE | 4 coloured blocks in a row (mint, pink, lavender, gradient), each with its CIDR and range. | No |
| 8 | Network, Usable Range, Broadcast | "Four /26 Subnets from 10.0.0.0/24" (table in Worked examples). | PRACTICE | Table | No |
| 9 | Not Every Subnet Should Face the Internet | Section divider. | none | none | No |
| 10 | Public vs Private Subnets | In a VPC, subnets can be public or private. A subnet becomes public because its route table has a path to the Internet Gateway. A subnet is private if its route table does not send 0.0.0.0/0 → Internet Gateway. | KEY CONCEPT / AWS | AWS diagram (see Diagrams): VPC with Public Subnet (EC2, public IP) and Private Subnet (EC2, no public IP), Router, Internet gateway, Internet, and two route tables. | No |
| 11 | What Makes a Subnet Public or Private | "Public Subnet → Route Table → IGW → Internet". "Private Subnet → Route Table → NAT → Internet". | AWS / DEMO | AWS console "Resource map" for vpc-08062d5ccf8104af0 (CN-Lab-VPC-vpc). Subnets (4): us-east-1a CN-Lab-VPC-subnet-public1-us-east-1a (10.0.0.0/20, No IPv6) and CN-Lab-VPC-subnet-private1-us-east-1a; us-east-1b CN-Lab-VPC-subnet-public2-us-east-1b and CN-Lab-VPC-subnet-private2-us-east-1b. Route tables (4): CN-Lab-VPC-rtb-private2-us-east-1b, CN-Lab-VPC-rtb-public (highlighted, linked to public1), rtb-0db793f33ca6d1949 (main), CN-Lab-VPC-rtb-private1-us-east-1a. Region United States (N. Virginia). | No |
| 12 | 3-Tier Architecture | Web tier: Public subnet. App tier: Private subnet. Database tier: Private subnet. | KEY CONCEPT / AWS | VPC 10.0.0.0/16 diagram with three tiers and route tables (see Diagrams / VPC design table). | No |
| 13 | Why This Keeps Corporate Data Safe | "Public Entry, Private Data". Public subnet is for controlled entry. Private subnets protect: application logic, internal services, databases, corporate data. | TAKEAWAY | Diagram "Public Entry, Private Data — Security through controlled access and isolation": Internet → Users → Internet Gateway → [VPC: Public Subnet: Load Balancer (Entry Point)] → [Private Subnets: Application Logic (Business logic and processing) → Internal Services (Microservices, APIs, internal components) → Databases & Data (Databases and corporate data stored securely)]. Notes: "Public subnet is for controlled entry." "Controlled entry for external users." "Private subnets protect: application logic, internal services, databases, and corporate data." Key Idea: "Allow controlled public access through the public subnet. Keep critical resources and data safe inside private subnets." | No |
| 14 | Duplicate Subnets Across Multiple AZs | "For availability, repeat the same tiers across at least 2 Availability Zones." Example (console resource map): VPC project-vpc; Subnets (4): us-east-1a project-subnet-public1-us-east-1a and project-subnet-private1-us-east-1a; us-east-1b project-subnet-public2-us-east-1b and project-subnet-private2-us-east-1b. | AWS / KEY CONCEPT | Resource-map crop: a VPC box with lines fanning out to 4 subnets grouped by AZ (green "A"/"B" icons = public, blue = private) and lines on to route tables (cut off). | No |
| 15 | The AWS Reality — 5 Reserved IPs & Constraints | Section divider. | none | none | No |
| 16 | The AWS Reality: Not All IPs Are Usable | In normal subnetting we calculate total addresses. In AWS, every subnet loses 5 reserved IP addresses, so the usable IP count is always Total IPs − 5. Table (IP Address → Reserved For): 10.0.0.0 Network address; 10.0.0.1 VPC router; 10.0.0.2 DNS; 10.0.0.3 Future use; 10.0.0.255 Broadcast. Box: "Traditional thinking: /24 → 254 usable hosts. AWS reality: /24 → 251 usable IPs". | AWS / KEY CONCEPT | Two-column table plus a yellow-to-pink gradient comparison box. | No |
| 17 | Demo: AWS Shows Available IPs | Console: Subnets (1/10). CN-Lab-VPC-subnet-private2-us-east-1b (subnet-0751527e050159830): IPv4 CIDR 10.0.144.0/20; Available IPv4 addresses 4091 (highlighted); AZ use1-az6 (us-east-1b); Network ACL acl-0dac011c03a5bfa8d; Network border group us-east-1; VPC vpc-08062d5ccf8104af0 \| CN-Lab-VPC-vpc; Route table rtb-05688e9489fe1712a \| CN-Lab-VPC-rtb-private2-us-east-1b. 4096 − 5 = 4091 (not written on the slide; implied). | DEMO / AWS | Console screenshot | No |
| 18 | AWS CIDR Size Limits | AWS allows IPv4 CIDR block sizes from /16 to /28. Largest block /16, smallest /28. You cannot create very tiny subnets like /29 or /30. Console "Create subnet": Subnet name my-subnet; AZ United States (N. Virginia) / use1-az4 (us-east-1a); IPv4 VPC CIDR block 10.0.0.0/16; IPv4 subnet CIDR block "10.0.32.0/29" with the hint "8 IPs" and the red error "IPv4 block sizes must be between a /16 netmask and /28 netmask." | AWS / WARNING | Console form screenshot with an error | No |
| 19 | AWS CIDR Size Limits | Same Create-subnet form with a valid entry: IPv4 subnet CIDR block "10.0.32.0/26", hint "64 IPs"; no error. | AWS / DEMO | Console form screenshot | No |
| 20 | Subnet Design Constraints | Infographic "AWS SUBNET RULES – KEY POINTS". 1. Subnets cannot overlap: two subnets in the same VPC must not share any IP range. Example in VPC 10.0.0.0/16: Subnet A 10.0.1.0/24 (✓), Subnet B 10.0.1.128/25 (✗), "Overlap detected – Not allowed!" 2. A subnet must fit inside the VPC CIDR: every subnet range must be fully contained within the VPC CIDR block. VPC 10.0.0.0/16: Valid Subnet 10.0.2.0/24 ✓; Invalid Subnet 10.1.0.0/16 ✗, "Subnet is outside the VPC range – Not allowed!" 3. You cannot change a subnet's size after creation: once created, its CIDR block size cannot be modified. "Subnet Created 10.0.1.0/24" ⇢ "Change Size? 10.0.1.0/26" ✗ Not Allowed. 4. If the size is wrong, you usually create a new subnet and migrate resources: Old Subnet 10.0.1.0/24 → New Subnet 10.0.2.0/24 → Migrate Resources (EC2 Instances, Databases, Other Resources), with a dashed return arrow to the old subnet. Tip: "Plan the right size upfront to avoid extra work!" | WARNING / AWS / TAKEAWAY | 2×2 panel infographic (red, green, blue, orange borders). | No |
| 21 | Please fill the feedback form. | Filler. | none | none | No |
| 22 | Thank You | Filler. | none | none | No |
| 23 | (blank) | Blank white page with no content. | none | none | No |

## Worked examples & numericals (verbatim givens, steps and answers as shown; flag any arithmetic error you notice in the source)
1. **Borrowing bits (p6).** Given 10.0.0.0/24 and the need for 4 subnets:
   - Host bits = 32 − 24 = 8, so total addresses = 2^8 = 256.
   - 4 = 2^2, so borrow k = 2 bits.
   - New prefix = /24 + 2 = /26, and each subnet gets 2^6 = 64 addresses.
   - Verified correct.
2. **Magic number (p7).** Mask for /26 = 255.255.255.192, so the magic number = 256 − 192 = 64. Blocks:
   - 10.0.0.0/26 (0-63)
   - 10.0.0.64/26 (64-127)
   - 10.0.0.128/26 (128-191)
   - 10.0.0.192/26 (192-255)
   - Verified correct.
3. **Four /26 subnets from 10.0.0.0/24 (p8),** verbatim:

   | Subnet | Network | Usable Range | Broadcast |
   |---|---|---|---|
   | 1 | 10.0.0.0/26 | 10.0.0.1 – 10.0.0.62 | 10.0.0.63 |
   | 2 | 10.0.0.64/26 | 10.0.0.65 – 10.0.0.126 | 10.0.0.127 |
   | 3 | 10.0.0.128/26 | 10.0.0.129 – 10.0.0.190 | 10.0.0.191 |
   | 4 | 10.0.0.192/26 | 10.0.0.193 – 10.0.0.254 | 10.0.0.255 |

   All verified with Python `ipaddress`. This is classic subnetting with 62 usable per /26; the slide shows no AWS adjustment. For reference only (not on the slide): in AWS each would have 64 − 5 = 59.
4. **AWS 5 reserved (p16).** Example subnet 10.0.0.0/24, reserved addresses:
   - 10.0.0.0 network address
   - 10.0.0.1 VPC router
   - 10.0.0.2 DNS
   - 10.0.0.3 future use
   - 10.0.0.255 broadcast

   Traditional /24 → 254 usable hosts; AWS /24 → 251 usable IPs (256 − 5). Verified correct.
5. **Console available IPs (p17).** 10.0.144.0/20 → Available IPv4 addresses 4091. 2^(32−20) = 4096, and 4096 − 5 = 4091. Consistent. 10.0.144.0 is a valid /20 boundary (144 = 9 × 16); the range is 10.0.144.0–10.0.159.255. The public1 subnet 10.0.0.0/20 (p11, and L13 p24) also gives 4091.
6. **Size limits (p18/p19).**
   - 10.0.32.0/29 → "8 IPs" → rejected: "IPv4 block sizes must be between a /16 netmask and /28 netmask."
   - 10.0.32.0/26 → "64 IPs" → accepted.
   - 2^3 = 8 and 2^6 = 64, both correct.
   - Not on the slide: the smallest AWS subnet /28 = 16 addresses, which is 11 usable in AWS.
7. **Design constraints (p20).**
   - 10.0.1.128/25 (10.0.1.128–10.0.1.255) lies inside 10.0.1.0/24 (10.0.1.0–10.0.1.255), so they overlap. Correct.
   - 10.0.2.0/24 is inside 10.0.0.0/16. Valid.
   - 10.1.0.0/16 is outside 10.0.0.0/16. Invalid.
   - Resizing 10.0.1.0/24 to 10.0.1.0/26 is not allowed.
   - All consistent.
8. **Minor inconsistency FLAG (p11 vs p12).** p11 says "Private Subnet → Route Table → NAT → Internet". The p12 private route tables (App and DB) list only "10.0.0.0/16 → local", with no 0.0.0.0/0 → NAT entry, so the diagram's private tiers have no outbound path. p10 likewise shows the private route table with only "Private IP range → local". This is conceptual, not arithmetic.
9. **p3 figure FLAG (carried over from L13 p11).** 172.16.1.10 is drawn with Network ID = 172.16.1 and Host ID = 10. Under classful rules (Class B) the split is 172.16 | 1.10.

## Formulas stated
- Prefix = network bits; host bits = 32 − prefix (32 − 24 = 8) (p6).
- Borrow k host bits → 2^k subnets (p6).
- Each subnet → 2^(host − k) addresses (p6).
- New prefix = old prefix + k (/24 + 2 = /26) (p6).
- Magic number (block size) = 256 − (interesting mask octet), e.g. 256 − 192 = 64. Subnet network addresses step by the block size (p7).
- Broadcast = next network address − 1; usable range = network + 1 to broadcast − 1 (shown by example in the p8 table, not stated as a formula).
- AWS usable IPs = Total IPs − 5 (p16).
- AWS subnet/VPC CIDR size range: /16 (largest) to /28 (smallest) (p18).

## Diagrams that must be recreated (page → description: nodes, arrows, labels, field widths)
- **p5:** One big box "ONE BIG NETWORK (ONE DEPARTMENT)" → down-arrow labelled "SUBNETTING" → a bracket fanning out to 4 boxes: Sales, HR, Finance, IT Department, each captioned "Smaller network for X team".
- **p6:** Card. Top pills: "borrow k host bits → 2^k subnets" and "each subnet → 2^(host − k) addresses". Three columns: "Start with /24" (host bits 8, total 256) | "Need 4 subnets" (4 = 2^2, k = 2) | "New prefix" (/26, 64 each).
- **p7:** Horizontal number line of the last octet split into 4 equal blocks: [10.0.0.0/26 0-63][10.0.0.64/26 64-127][10.0.0.128/26 128-191][10.0.0.192/26 192-255]. Caption "Block size = 64".
- **p10:**
  - Outer green box "Virtual Private Cloud".
  - Inside: "Public Subnet" box with an EC2 Instance (public IP), and its route table: Destination / Target = "Private IP range → local", "All IP range → Internet gateway".
  - "Private Subnet" box with an EC2 Instance (no public IP), and its route table: "Private IP range → local".
  - An arrow runs from the public EC2 to the "Router" (orange circle with crossing arrows), then to the "Internet gateway" (orange cloud icon on the VPC edge), then to the "Internet" cloud outside.
- **p12 (3-tier VPC):**
  - Internet (globe) ↓ Internet Gateway ↓ into the VPC 10.0.0.0/16.
  - Web Tier, Public Subnet 10.0.1.0/24 (green dashed): Application Load Balancer ↓ Web Server (EC2).
  - The web server connects to App Tier, Private Subnet 10.0.2.0/24 (blue dashed): 2 × Application Server (EC2).
  - The app tier connects to Database Tier, Private Subnet 10.0.3.0/24: Database (RDS).
  - Each tier has a route table underneath: Public Route Table (10.0.0.0/16 → local; 0.0.0.0/0 → Internet Gateway); Private Route Table (App) (10.0.0.0/16 → local); Private Route Table (DB) (10.0.0.0/16 → local).
- **p13:**
  - Internet (globe) ↓ Users → Internet Gateway → VPC.
  - Public Subnet: Load Balancer (Entry Point).
  - → Private Subnets: Application Logic → Internal Services → Databases & Data (lock).
  - Callouts: "Public subnet is for controlled entry", "Controlled entry for external users", "Private subnets protect: …". Key Idea banner.
- **p14:** Resource map: VPC "project-vpc" → Subnets (4), grouped by AZ: us-east-1a {public1, private1}, us-east-1b {public2, private2}.
- **p20:** 2×2 rule infographic:
  - Overlap: Subnet A 10.0.1.0/24 overlapping Subnet B 10.0.1.128/25 inside VPC 10.0.0.0/16, with a hatched overlap region.
  - Containment: Valid 10.0.2.0/24 inside the VPC; Invalid 10.1.0.0/16 outside it.
  - No resize: 10.0.1.0/24 ⇢ 10.0.1.0/26 ✗.
  - Migrate: Old 10.0.1.0/24 → New 10.0.2.0/24 → Migrate Resources (EC2, DBs, other), with a dashed loop back.

**VPC design tables shown:**
- p12 3-tier:

  | Tier | Subnet type | CIDR | Route table |
  |---|---|---|---|
  | Web | Public | 10.0.1.0/24 | 10.0.0.0/16 local; 0.0.0.0/0 Internet Gateway |
  | App | Private | 10.0.2.0/24 | 10.0.0.0/16 local |
  | Database | Private | 10.0.3.0/24 | 10.0.0.0/16 local |

  VPC = 10.0.0.0/16.
- p11/p17 CN-Lab-VPC (console):
  - VPC 10.0.0.0/16 (from L13 p24).
  - public1-us-east-1a 10.0.0.0/20.
  - private2-us-east-1b 10.0.144.0/20.
  - public2-us-east-1b and private1-us-east-1a are shown, but their CIDRs are not visible on any slide.
  - Route tables: rtb-public, rtb-private1-us-east-1a, rtb-private2-us-east-1b, plus the main rtb-0db793f33ca6d1949.

## Code / CLI / config shown (verbatim)
- No code or CLI. Console values:
  - p11 URL: `us-east-1.console.aws.amazon.com/vpcconsole/home?region=us-east-1#VpcDetails:VpcId=vpc-08062d5ccf8104af0`.
  - p11 resource-map names: `CN-Lab-VPC-vpc`; subnets `CN-Lab-VPC-subnet-public1-us-east-1a`, `CN-Lab-VPC-subnet-private1-us-east-1a`, `CN-Lab-VPC-subnet-public2-us-east-1b`, `CN-Lab-VPC-subnet-private2-us-east-1b`; route tables `CN-Lab-VPC-rtb-private2-us-east-1b`, `CN-Lab-VPC-rtb-public`, `rtb-0db793f33ca6d1949`, `CN-Lab-VPC-rtb-private1-us-east-1a`.
  - p17: `subnet-0751527e050159830`, IPv4 CIDR `10.0.144.0/20`, Available IPv4 addresses `4091`, `use1-az6 (us-east-1b)`, `acl-0dac011c03a5bfa8d`, `rtb-05688e9489fe1712a`.
  - p18 form: VPC CIDR `10.0.0.0/16`, subnet CIDR `10.0.32.0/29` ("8 IPs"), error `IPv4 block sizes must be between a /16 netmask and /28 netmask.`
  - p19 form: subnet CIDR `10.0.32.0/26` ("64 IPs").
  - AZs shown: `use1-az4 (us-east-1a)` and `use1-az6 (us-east-1b)`.
- p10 route rule as text: `0.0.0.0/0 → Internet Gateway`.

## In-class questions / quiz prompts shown on slides (verbatim, with answers if given)
- There are no explicit quiz prompts. The implied worked problems are:
  - p6/p7/p8: "10.0.0.0/24 → four /26s" (answer in the p8 table).
  - p18: "Can you create 10.0.32.0/29?" Answer: no (/16–/28 only).
  - p20: four rule checks (overlap, containment, resize, migrate).

## Unclear / unreadable (page → what is unreadable and why)
- p11: The account ID and user name in the console header are tiny and incidental. They were read at 200 dpi but are not needed. The subnet CIDRs for private1/public2 are not shown.
- p14: The route-table column of the resource map is cropped at the right edge.
- p17: Partly cut off at the bottom ("Auto-assign public IPv4 address" value and a "Default subnet" row not visible).
- p23: Blank page (the text layer is also empty).

## Duplicate / overlap notes (pages that repeat other decks or earlier pages)
- p3 reuses L13 p11 (172.16.1.10 Network/Host ID figure and the class-octet grid) and L13 p18 (192.168.1.0/24 CIDR calculator).
- p17 is the same console screenshot subject as L13 p24 (subnet private2 10.0.144.0/20, 4091 available).
- p11 shows the same CN-Lab-VPC (vpc-08062d5ccf8104af0) as L13 p24.
- p14 repeats the p11 AZ layout using "project-vpc" naming.
- p7 and p8 repeat the same 10.0.0.0/24 → four /26 example (block view, then full table).
- p10, p11, p12 and p13 all restate the public (IGW route) vs private idea.
- p11's mention of NAT and the IGW connects to L13 p22 ("sets up NAT next lecture").

## Topic list (flat bullet list of every distinct topic/subtopic covered, in order)
- Recap: network ID vs host ID, classful octet split, CIDR calculator (/24 base, broadcast, first/last usable, count)
- Why one large network is hard to manage
- Subnetting definition (splitting one network into smaller ones; department analogy)
- Borrowing host bits: 2^k subnets, 2^(host−k) addresses per subnet, new prefix = old + k
- Worked example 10.0.0.0/24 → 4 × /26 (64 addresses each)
- Magic number / block-size shortcut (256 − 192 = 64)
- Network address, usable range, broadcast for each /26 subnet
- Public vs private subnets in a VPC (defined by the route table; 0.0.0.0/0 → IGW)
- Route tables: local route, IGW route; router, Internet Gateway; EC2 with/without public IP
- Public subnet → IGW → Internet vs private subnet → NAT → Internet
- AWS console resource map (VPC, subnets per AZ, route tables)
- 3-tier architecture: web (public 10.0.1.0/24), app (private 10.0.2.0/24), DB (private 10.0.3.0/24) in VPC 10.0.0.0/16; ALB, EC2, RDS
- Security rationale: public entry, private data (protect app logic, internal services, databases, corporate data)
- High availability: duplicate the tiers across at least 2 Availability Zones (us-east-1a / us-east-1b)
- AWS 5 reserved IPs per subnet (network, VPC router .1, DNS .2, future use .3, broadcast); usable = total − 5; /24 → 251
- Console demo: /20 subnet shows 4091 available IPv4 addresses
- AWS CIDR size limits /16 to /28; /29 and /30 not allowed (console error demo); /26 accepted
- Subnet design constraints: no overlap, must fit inside the VPC CIDR, size immutable after creation, recreate and migrate if wrong; plan size upfront
