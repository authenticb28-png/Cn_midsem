# WB-L04 pages 1-35 — Networking Devices, Topologies and the Cloud Network (Computer Networks, Newton School of Technology)

Source PDF: `Lectures/Whiteboards/L04 - 2026-08-19 - TCP-IP Model, Network Devices.pdf`. The filename mentions the "TCP-IP Model", but **the deck has no TCP/IP-model content**; that was taught in WB-L03 pp30–32. All 35 pages are clean slides with **no handwriting or whiteboard ink** (checked every page image; the VPC screenshot on p33 was re-rendered at 200 dpi).

## Page table
| Page | Section/slide title | Content summary (exact facts, numbers, definitions, lists — be specific, not vague) | Callout type | Diagram/figure on page (describe so it can be redrawn) | Handwriting present? |
|---|---|---|---|---|---|
| 1 | Networking Devices, Topologies and the Cloud Network | Title slide; "Computer Networks" | none | Decorative network-globe graphic | No |
| 2 | Join the lecture online on your dashboard | Filler | none | none | No |
| 3 | Recap | "The 7 Layers of OSI": Application (Layer 7), Presentation (6), Session (5), Transport (4), Network (3), Data Link (2), Physical (1). Transmit Data goes down the stack; Receive Data goes up; joined by "Physical Link". | TAKEAWAY (recap) | Pyramid of 7 layer bars (narrowest = Application at top); blue arrow "Transmit Data" down the left, horizontal "Physical Link" along the bottom, orange arrow "Receive Data" up the right | No |
| 4 | The why of network devices | Section divider | none | none | No |
| 5 | Connecting computers | Full-mesh cabling cost: "3 devices: 3(3-1)/2 = 3 cables"; "10 devices: 10(10-1)/2 = 45 cables"; "100 devices: ......" (left blank) | PRACTICE | Six PCs on a hexagon, each wired to every other one (full mesh K6); photo of a desk tangled in cables | No |
| 6 | Instead of connecting everyone to everyone what if everyone connects to ONE device | Motivation for a central device (hub/switch) | none | none | No |
| 7 | Networking Devices | Core components of a computer network; connect computers and other devices in a network. Four devices shown: **Hub, Switch, Wireless Router, Access Point** | none | Product photos of the 4 devices | No |
| 8 | Hubs in 1980s | Function: **broadcasts data to all connected devices**; doesn't recognize hardware addresses (MAC addresses); operates at **Physical Layer (Layer 1)**. Inefficiency: data is broadcast to all devices even when only one device needs it. | KEY CONCEPT / WARNING | HUB box with 4 ports, 4 PCs attached; green dots (signal) on 3 links, showing the frame copied to every port | No |
| 9 | What's the main real-world problem with using a hub in a network with many devices? | Answer shown: **"Unnecessary Traffic"** | QUIZ | none | No |
| 10 | Switches since 1990s | Operates at **Data Link Layer (Layer 2)**; connects devices within a LAN and forwards data to the correct device using **MAC addresses**; **has no understanding of layer 3**; ports can be configured for connection routing; broadcasting can be controlled using the MAC routing intelligence. | KEY CONCEPT | "Switch" box with ports 1–8; pc1–pc8 each on its own port (pc_n on port n); green dot on the pc2 link (only the destination receives) | No |
| 11 | What if we want to communicate with a computer in another network | Motivation for routers | none | none | No |
| 12 | Router | **Routes data between different networks**; operates at **Network Layer (Layer 3)** | KEY CONCEPT | Router at the centre joining three LAN clouds A, B, C; packets (dots) flow from A and C through the router into B | No |
| 13 | A router knows where to send packets, but should every packet be allowed to enter | Motivation for firewalls | none | none | No |
| 14 | Firewall | A firewall is a **network security device**; monitors data coming in and going out of the network; main job is to protect the network from unauthorized access or threats. | KEY CONCEPT | Brick wall between a cloud and a laptop | No |
| 15 | Firewalls allow only authorized data | Authorized device → "Allowed" → through the wall → Network; unauthorized device → "Blocked" | KEY CONCEPT | Brick firewall with flame; green "Allowed" arrow from "Authorized Device" passing to "Network" cloud; red "Blocked" arrow from "Unauthorized Device"; packet bars | No |
| 16 | What is Packet Filtering? | Packet travels External Network → Router → (packet) → Firewall → Internal Network. Packet structure **[IP][TCP/UDP][Data]**. The firewall checks the **source/destination IP address** (IP header) and the **source/destination port number** (TCP/UDP header). | KEY CONCEPT | Linear flow: PC (External Network) → people-network icon → green Router → envelope ("Packet from external network to internal network") → Firewall → PC (Internal Network); under the envelope the 3-field packet with callouts to IP and to TCP/UDP | No |
| 17 | Types of Firewall | "How firewalls remember (or forget) connections". **Stateless firewall**: checks each packet independently; no memory of past traffic; only uses rules; faster but less secure. **Stateful firewall**: tracks active connections; understands sessions; allows related packets; more secure. | KEY CONCEPT | Sketchnote-style two-column comparison (orange stateless, green stateful) with packet/checklist and shield icons | No |
| 18 | Load Balancers | Clients (PC, phone) → Load Balancer → 3 servers; requests spread round-robin: Req 1 & Req 4 → Server 1, Req 2 & Req 5 → Server 2, Req 3 & Req 6 → Server 3 | KEY CONCEPT | Two clients → green LB node fanning out to 3 green nodes → Server 1/2/3 with yellow request tags | No |
| 19 | Load Balancers | A load balancer distributes incoming traffic across multiple servers so no single server is overwhelmed; used by Netflix, Google, Amazon, Facebook. Figure: **Application load balancer = Layer 7, HTTP/HTTPS**, routes by path (/api/* → TG: api → EC2 (3); /web/* → TG: web → EC2 (3)), "No static IP - DNS name only". **Network load balancer = Layer 4, TCP/UDP/TLS**, "Forward all traffic" → Target group: tcp-app → EC2 instances (3), "Static IP + preserves client IP". Legend: Blue = ALB path, Teal = NLB path, Gray = shared EC2 layer. | AWS / KEY CONCEPT | Side-by-side flowcharts as described (see Diagrams) | No |
| 20 | Devices Are Ready… But How Should We Connect Them | Section divider into topologies | none | none | No |
| 21 | Network Topologies | Network topology describes the arrangement of devices and their connections within a network, including how data flows. Types: **Star, Mesh, Bus, Ring** | KEY CONCEPT | 4 mini diagrams: Star (centre + 5 leaves), Mesh (6 nodes fully connected), Bus (single line with 6 drop nodes), Ring (6 nodes on a circle) | No |
| 22 | Star topology | All devices connect to a central hub or switch; data flows sender → hub/switch → intended receiver; centralized structure simplifies diagnostics and maintenance; popular choice for LANs because the design is manageable. | KEY CONCEPT | Switch at centre, 8 monitors on spokes; red dots show a packet going left PC → switch → lower-right path / right PC | No |
| 23 | Mesh topology | Every device is directly connected to all other devices; creates many paths; increased reliability because if one path fails data can take another route. "Jokingly called spaghetti networks!" | KEY CONCEPT | 6 green nodes, full mesh (15 links); spaghetti bowl image | No |
| 24 | Wireless mesh networks help with WiFi coverage | Embedded YouTube "TP-Link: Whole-Home Wi-Fi System"; caption card: "Whole-Home Mesh WiFi \| TP-Link India — Mesh WiFi is a whole home WiFi system built to eliminate dead zones and to provide uninterrupted WiFi throughout your home." | DEMO | Video thumbnail; house cross-section with 3 mesh nodes and coverage pattern; product photo | No |
| 25 | Hybrid topology | A combination of two or more different topologies forming a more complex and flexible network. | KEY CONCEPT | Star (hub + 6 nodes) at top-left joined by a line to a Ring (6 nodes) at top-right; both drop down to a Bus at the bottom (6 drop nodes) | No |
| 26 | (Topology by environment table) | Small Office → **Star** → easy setup, centralized control → laptops, printers, routers. Smart Home → **Mesh** → reliable, direct device communication → smart bulbs, cameras. Data Center → **Hybrid** → combines benefits of multiple topologies → servers, storage units. | KEY CONCEPT | 4-column table | No |
| 27 | Fault Tolerance and Scalability of Topologies | Section divider | none | none | No |
| 28 | (Fault tolerance / scalability table) | STAR: fault tolerance Medium, scalability Good. MESH: High, **Excellent**. HYBRID: High, **Hard**. | KEY CONCEPT | 3-column table | No |
| 29 | Hardware Meets Software | "The Evolutionary Shift": traditional networking relies on physical boxes, specialized cables and manual configuration; in the cloud era the **logic remains the same** but execution is purely software-defined. Mappings: **Physical Box → Virtual Instance; Copper Cables → Virtualized Overlays; Manual Wiring → API / Console Clicks** | AWS / TAKEAWAY | Photos "How it started." (messy rack cabling) vs "How it's going." (neat patch panels) | No |
| 30 | The cloud network | Section divider | none | none | No |
| 31 | Global Cloud | "AWS Foundation". **Regions**: isolated geographic areas (e.g., Mumbai) containing multiple data center clusters. **Edge Locations**: CDN endpoints that cache content physically closer to the user to reduce latency. "30+ Global Regions"; "Ultra-low latency backbone". | AWS | World map with white nodes joined by lines | No |
| 32 | Redundancy: Availability Zones | **Isolated Fault Domains**: an AZ is one or more discrete data centers with redundant power, networking and connectivity; deploying across **two or more AZs** lets your application survive a fire, flood or power-grid failure at one site. **The Multi-AZ Project**: this semester you will design architectures that split workloads across AZ-A and AZ-B. **Metric: 99.9% availability** is a target for high-availability systems. | AWS | Two cards (green / blue) with icons | No |
| 33 | The Virtual Private Cloud (VPC) | **Logical Isolation**: a VPC is your private, software-defined network in AWS; you control IP address ranges, subnets and routing. **CIDR Addressing Example: 10.0.0.0 / 16 → 65,536 Addresses.** Subnets map to specific AZs, partitioning your **L3 network** for scale and security. Screenshot (AWS console, Oregon region): "Your VPCs (1/2)": a custom VPC with IPv4 CIDR 10.0.0.0/17 (reads as /17 at 200 dpi) and "default" VPC **172.31.0.0/16**, both Available; Resource map for default: Subnets (4) in us-west-2a, us-west-2c, us-west-2b, us-west-2d; Route tables (1) with "4 subnet associations, 2 routes including local". | AWS / KEY CONCEPT | AWS VPC console screenshot (see Diagrams) | No |
| 34 | Please fill the feedback form. | Filler | none | none | No |
| 35 | Thanks for watching! | Filler | none | none | No |

## Worked examples & numericals
- **p5, full-mesh cable count** (formula given as n(n-1)/2):
  - Given: 3 devices → "3(3-1)/2 = 3 cables" ✔ correct.
  - Given: 10 devices → "10(10-1)/2 = 45 cables" ✔ correct.
  - Given: 100 devices → "......" (**left blank on the slide**, no answer shown). By the same formula it would be 100·99/2 = 4950. That number is not in the source.
  - The figure on the slide shows 6 PCs in a full mesh, which would be 6·5/2 = 15 links. That number is not on the slide either.
- **p33, CIDR address count:** 10.0.0.0/16 → 65,536 addresses ✔ correct (2^(32−16) = 2^16).
- **p32:** 99.9% availability target (stated only; no downtime calculation shown).
- **p18:** round-robin distribution example: 6 requests over 3 servers → Server1 {Req1, Req4}, Server2 {Req2, Req5}, Server3 {Req3, Req6}. The term "round-robin" is not used on the slide.

## Formulas stated
- Number of cables/links for a full mesh of n devices = **n(n−1)/2** (p5, written as 3(3-1)/2 and 10(10-1)/2).
- Number of addresses in a /16 block = 65,536 (p33). The general formula 2^(32−prefix) is implied, not written.

## Diagrams that must be recreated
- **p3 — OSI recap pyramid:** 7 horizontal bars, widest at the bottom. Top to bottom: Application (Layer 7), Presentation (Layer 6), Session (Layer 5), Transport (Layer 4), Network (Layer 3), Data Link (Layer 2), Physical (Layer 1). Left: blue arrow down labelled "Transmit Data". Bottom: horizontal arrow "Physical Link". Right: orange arrow up labelled "Receive Data".
- **p5 — Full mesh of 6 PCs:** hexagon of PCs, every pair connected (15 lines).
- **p8 — Hub:** box "HUB" with 4 ports; 4 PCs (left, right, bottom-left, bottom-right); green signal dots on links, showing the broadcast to all ports.
- **p10 — Switch:** box "Switch" with ports 5 6 7 8 on top and 1 2 3 4 on the bottom; pc5–pc8 above, pc1–pc4 below, each to its matching port; green dot only on pc2's link (unicast to the right port).
- **p12 — Router joining networks A, B, C:** three shaded LAN regions, each with a small tree of nodes; one router in the middle with links to each; blue packets from A and C, orange packets toward B.
- **p15 — Firewall allow/block:** Authorized Device → green "Allowed" → firewall (brick wall + flame) → Network cloud. Unauthorized Device → red "Blocked" ending at the wall. Tablet "Network" below.
- **p16 — Packet filtering:** External Network PC → internet icon → Router → envelope (packet) → Firewall → Internal Network PC. Packet drawn as three fields [IP | TCP/UDP | Data]. Callout from IP: "Check source/destination IP address". Callout from TCP/UDP: "Check source/destination port number".
- **p17 — Stateless vs stateful comparison** (two columns, bullet lists as in the page table).
- **p18 — Load balancer:** 2 clients (monitor, phone) → LB node → three branches → Server 1, 2, 3; request labels Req1/Req4 to S1, Req2/Req5 to S2, Req3/Req6 to S3.
- **p19 — AWS ALB vs NLB:**
  - Left (blue): Client requests → "Application load balancer, Layer 7 - HTTP/HTTPS". This splits into "/api/*" → "TG: api" → "EC2 (3)" and "/web/*" → "TG: web" → "EC2 (3)". Footer: "No static IP - DNS name only".
  - Right (teal): Client requests → "Network load balancer, Layer 4 - TCP/UDP/TLS" → "Forward all traffic" → "Target group: tcp-app" → "EC2 instances (3)". Footer: "Static IP + preserves client IP".
  - Legend: Blue = ALB path, Teal = NLB path, Gray = shared EC2 layer.
- **p21 — Four topologies:** star (centre + 5 leaves), mesh (6 nodes, all connected), bus (horizontal backbone, 3 nodes above and 3 below on drop lines), ring (6 nodes on a circle).
- **p22 — Star:** central switch, 8 PCs on radial spokes; red dots trace a packet sender → switch → receiver.
- **p23 — Mesh:** 6 nodes, complete graph.
- **p25 — Hybrid:** star cluster (centre + 6 leaves) top-left; line from the star centre to a ring of 6 nodes top-right; the star's bottom leaf and the ring's bottom node both drop vertical lines to a bus backbone at the bottom with 6 drop nodes (3 up, 3 down).
- **p33 — AWS VPC console (Oregon):** left nav (VPC dashboard, Subnets, Route tables, Internet gateways, Egress-only internet gateways, Carrier gateways, DHCP option sets, Elastic IPs, Managed prefix lists, Endpoints, Endpoint services, NAT gateways, Peering connections, Security: Network ACLs, Security groups, Network Analysis: Reachability Analyzer). The "Your VPCs" table lists two VPCs: a custom VPC (10.0.0.0/17) and default (172.31.0.0/16). Resource map: VPC "default" → Subnets (4): us-west-2a, 2c, 2b, 2d → Route tables (1) (4 subnet associations, 2 routes including local).

## Code / CLI / config shown
- No code or CLI. Config-like values only:
  - p33 text: `10.0.0.0 / 16  →  65,536 Addresses`
  - p33 screenshot: VPC IPv4 CIDRs `10.0.0.0/17` (custom VPC, small text) and `172.31.0.0/16` (default VPC); subnets in `us-west-2a`, `us-west-2b`, `us-west-2c`, `us-west-2d`.
  - p19: target groups `TG: api`, `TG: web`, `Target group: tcp-app`; ALB path rules `/api/*`, `/web/*`.

## In-class questions / quiz prompts shown on slides
- p5: "100 devices: ......" (fill in the cable count; no answer shown; formula gives 4950).
- p6: "Instead of connecting everyone to everyone what if everyone connects to ONE device" (rhetorical; leads to the hub).
- p9: "What's the main real-world problem with using a hub in a network with many devices?" Answer shown: **"Unnecessary Traffic"**.
- p11: "What if we want to communicate with a computer in another network" (leads to the router).
- p13: "A router knows where to send packets, but should every packet be allowed to enter" (leads to the firewall).
- p20: "Devices Are Ready… But How Should We Connect Them" (leads to topologies).

## Unclear / unreadable
- p33: the screenshot text is tiny. The custom VPC's CIDR reads as 10.0.0.0/17 at 200 dpi but could be /16. The VPC name, IDs and subnet IDs are deliberately blurred or masked.
- p24: the embedded video cannot be played from the PDF. Only the thumbnail and caption are visible.
- No handwriting anywhere.

## Source errors / oddities to flag
- **p28 table:** "MESH: Scalability Excellent" contradicts standard teaching, where full mesh scales poorly because links grow as n(n−1)/2, and p5 of this same deck makes that point. "HYBRID: Scalability **Hard**" is not a rating on the same scale as Good/Excellent. Treat this table with caution if MCQs are built from it.
- p10: "Ports can be configured for connection routing" and "Mac routing intelligence" are loose wording (switches forward/filter by MAC; they don't route). The same slide correctly says the switch "has no understanding of layer 3".
- p26: "Routers" are listed as example devices in a small-office star.
- The firewall layer is never stated. p16 implies L3/L4 header inspection (IP addresses + ports).
- Filename vs. content mismatch: the filename says "TCP-IP Model, Network Devices", but the content is devices, topologies and AWS cloud networking.

## Specific coverage notes (items the parent asked about)
- **Devices by layer (as stated):** Hub = Layer 1 (Physical); Switch = Layer 2 (Data Link, MAC addresses, LAN); Router = Layer 3 (Network, between networks); ALB = Layer 7 (HTTP/HTTPS); NLB = Layer 4 (TCP/UDP/TLS). Wireless Router and Access Point appear only as photos (p7); no layer is given. Firewall: no layer stated.
- **Collision / broadcast domains:** **NOT mentioned anywhere in this deck.** The closest content: the hub broadcasts to all ports (p8, "unnecessary traffic" p9); the switch forwards to the correct device by MAC and "broadcasting could be controlled" (p10).
- **PDU names / encapsulation:** not in this deck (they are in WB-L03). p16 shows the packet as [IP][TCP/UDP][Data].
- **AWS layer mappings:** ALB = L7, NLB = L4 (p19). Subnets partition "your L3 network" (p33). Physical box → virtual instance, copper → virtualized overlays, manual wiring → API/console (p29). Regions, Edge Locations (CDN), AZs, Multi-AZ, VPC (pp31–33).

## Duplicate / overlap notes
- p3 recaps the OSI layers from WB-L03.
- p19 (ALB vs NLB) overlaps the slide deck SL-L12 "Cloud Load Balancing — ALB vs. NLB" (NLB at the Transport layer, ALB at the Application layer, preserves client source IP).
- pp32–33 (AZs, VPC, CIDR) overlap SL-L12 (Availability Zones, Multi-AZ) and SL-L13/SL-L14 (CIDR, VPC design; SL-L14 says AWS VPC CIDR sizes are /16 to /28).
- p31 Edge Locations/CDN overlap WB-L10 (CDN, Route 53).
- p16–17 (packet filtering, stateless vs stateful) are likely relevant to later Security Groups vs NACLs content (SL-L15 VPC routing). That link is my inference and is not stated in this deck.
- WB-L05's filename says "Network Topologies, Cloud Networking", but its text begins with the Application Layer. The topology and cloud-networking material actually lives in this deck (WB-L04).
- p23 mesh image and the p5 mesh both illustrate n(n−1)/2 growth.

## Topic list
- Recap: 7 OSI layers, transmit down / receive up over the physical link
- Why network devices: full-mesh cabling cost n(n−1)/2 (3→3, 10→45, 100→?)
- Central-device idea (connect everyone to ONE device)
- Networking devices overview: hub, switch, wireless router, access point
- Hub (1980s): Layer 1, broadcasts to all ports, no MAC awareness, inefficiency / unnecessary traffic
- Switch (1990s): Layer 2, MAC-based forwarding within a LAN, no L3 understanding, controls broadcasting
- Router: Layer 3, routes between different networks
- Firewall: network security device, monitors inbound/outbound traffic, allow authorized / block unauthorized
- Packet filtering: check source/destination IP (IP header) and source/destination port (TCP/UDP header)
- Stateless vs stateful firewalls
- Load balancers: distribute traffic across servers; round-robin style example; industry use
- AWS ALB (Layer 7, HTTP/HTTPS, path-based routing, DNS name only) vs NLB (Layer 4, TCP/UDP/TLS, static IP, preserves client IP); target groups; EC2
- Network topology definition
- Star, mesh, bus, ring topologies
- Star topology details (central hub/switch, LAN popularity, easy diagnostics)
- Mesh topology details (all-to-all, multiple paths, reliability, "spaghetti networks")
- Wireless mesh Wi-Fi (whole-home coverage, eliminates dead zones)
- Hybrid topology
- Topology selection by environment (small office: star; smart home: mesh; data center: hybrid)
- Fault tolerance and scalability comparison (star / mesh / hybrid)
- Hardware to software-defined networking (physical box → virtual instance, copper → virtualized overlays, manual wiring → API/console)
- AWS global infrastructure: Regions (e.g., Mumbai), Edge Locations (CDN caching), 30+ regions, low-latency backbone
- Availability Zones: isolated fault domains, multi-AZ deployment, 99.9% availability target, AZ-A/AZ-B semester project
- VPC: logical isolation, control of IP ranges/subnets/routing, CIDR example 10.0.0.0/16 = 65,536 addresses, subnets map to AZs, default VPC 172.31.0.0/16, route tables
