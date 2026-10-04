# STUDYPACK-labs — Non-PDF course material: lab assignments, Packet Tracer topologies, quiz MCQs

Sources inventoried (all under /home/user/Cn_midsem/Study Pack/):
- `3 - Coding & Lab Questions.md` (779 lines) — 7 assignment questions (2 under "Lectures", 5 under "Labs")
- `4 - MCQs.md` (209 lines) — 6 quizzes, 17 MCQs
- `attachments/*.xml` — 4 saved simulator topologies (student's own solutions) for DHCP, Router-on-a-Stick, Gaming Lab LAN, Industrial Multi-Segment
- `1 - Syllabus.md`, `0 - Coverage Report.md`, `pack.json` — used only for dates/metadata cross-checks
- `2 - Lecture & Lab Notes.md` Labs section (line 5311): **EMPTY** — the file ends with the heading `## Labs` and nothing after it. The same empty heading appears in `Computer Networks - Study Pack.md` (line 5415). pack.json confirms all 16 lab sessions (L01–L16) have `files: []`. **No extra lab content exists beyond what is listed here.**

Context notes:
- All 7 assignments are "Network lab (simulator)" type (`type: game` in pack.json); there are **no Python coding questions** anywhere in the Study Pack. No hidden test-case names are present for these labs.
- Coverage report: "Assignment questions: 7 (6 solved, your code/topology included for 4)". Topology XML exists for 4 labs; the two AWS labs (no simulator) and CN_LAB_NAT_D (attempted, 0/20) have none.
- Simulator CLI is Cisco-IOS-style (Packet Tracer-like custom simulator; XML root `<topology version="2">`).

---

## A. Lab / assignment inventory

### A1. CN_LAB_DHCP_SectionD — 22 Sep 2026 — "Dual-LAN DHCP: Router as DHCP Server with Relay"
- Listed under: Lectures assignments. Medium · Solved ✓ · 20/20 pts. Saved topology: `attachments/CN_LAB_DHCP_SectionD - Dual-LAN DHCP- Router as DHCP Server with Relay.xml`
- **Objective (verbatim):** "Configure **Router0** as the DHCP server for two separate LANs. **LAN-A** (10.0.1.0/24) holds two PCs and an HTTP server; **LAN-B** (10.0.2.0/24) holds two more PCs whose DHCP requests are relayed back to Router0 via `ip helper-address`. At the end, PC0 must be able to reach PC2 across both LANs."
- **Topology:** Router0 Gi0/0 → ManagedSwitch0 (LAN-A) → PC0, PC1, Server0; Router0 Gi0/1 → ManagedSwitch1 (LAN-B) → PC2, PC3. All straight-through.
- **IP table:**
  | Device | Interface | IP | Mask | Assigned by |
  |---|---|---|---|---|
  | Router0 | Gi0/0 | 10.0.1.1 | 255.255.255.0 | Static |
  | Router0 | Gi0/1 | 10.0.2.1 | 255.255.255.0 | Static |
  | PC0 | Fa0 | 10.0.1.2 | 255.255.255.0 | DHCP |
  | PC1 | Fa0 | 10.0.1.3 | 255.255.255.0 | DHCP |
  | Server0 | Fa0 | 10.0.1.4 | 255.255.255.0 | DHCP |
  | PC2 | Fa0 | 10.0.2.2 | 255.255.255.0 | DHCP |
  | PC3 | Fa0 | 10.0.2.3 | 255.255.255.0 | DHCP |
- **Key commands (verbatim, Router0):**
  ```
  enable
  configure terminal

  interface GigabitEthernet0/0
   ip address 10.0.1.1 255.255.255.0
   no shutdown
   exit

  interface GigabitEthernet0/1
   ip address 10.0.2.1 255.255.255.0
   ip helper-address 10.0.1.1
   no shutdown
   exit

  ip dhcp pool LAN-A
   network 10.0.1.0 255.255.255.0
   default-router 10.0.1.1
   exit

  ip dhcp pool LAN-B
   network 10.0.2.0 255.255.255.0
   default-router 10.0.2.1
   exit
  ```
  Explanation given: "`ip helper-address 10.0.1.1` on Gi0/1 forwards DHCP broadcast messages from LAN-B clients to Router0's own DHCP server (at 10.0.1.1), which then hands out addresses from the **LAN-B pool**."
- Other steps: Server0 → Services → HTTP On; each host Desktop → IP Configuration → DHCP, then `ipconfig` in Command Prompt, strict order PC0, PC1, Server0, PC2, PC3 (DHCP hands addresses sequentially from .2, so order determines the IP table). "You must run `ipconfig` on every device before clicking Run Tests". Optional: PC0 browser `http://10.0.1.4`.
- **Verification:** Run Tests; from PC0 `ping 10.0.2.2`; Simulation mode trace shows Router0 hop and both ARP exchanges.
- **Saved XML (student solution) matches spec:** Router0 Gi0/0 10.0.1.1/24 up; Gi0/1 10.0.2.1/24 up with `helperAddresses="10.0.1.1"`; pools LAN-A (10.0.1.0/24 gw 10.0.1.1), LAN-B (10.0.2.0/24 gw 10.0.2.1); PCs dhcpMode=true got PC0 10.0.1.2, PC1 10.0.1.3, Server0 10.0.1.4, PC2 10.0.2.2, PC3 10.0.2.3. Switches all VLAN 1 access. Server0: HTTP+HTTPS+FTP enabled (ftp-user newton/newton, default). Links: R0 Gi0/0–SW0 Fa0/1, SW0 Fa0/2–PC0, Fa0/3–PC1, Fa0/4–Server0, R0 Gi0/1–SW1 Fa0/1, SW1 Fa0/2–PC2, Fa0/3–PC3.
- **Concepts tested:** DHCP server on router, DHCP pools (`network`, `default-router`), DHCP relay (`ip helper-address`) — DHCP Discover is a broadcast that a router won't forward unless relayed; inter-LAN routing by directly connected interfaces; sequential lease allocation; HTTP service; ARP in simulation.
- **Syllabus mapping:** L15 lecture deck (NAT, PAT, DHCP & VPC Routing — DHCP/DORA, SL-L15 p13–16) and L16 (30 Sep, DHCP/Routing Tables/NAT & PAT — no file). Relay/helper-address is NOT covered in any lecture deck (lab-only content). Lab date 22 Sep = Lab L13 "VPC".

### A2. CN_Lab_Router on stick_Section D — 23 Sep 2026 — "Lab: VLAN Trunking and Router-on-a-Stick"
- Listed under: Lectures assignments. Medium · Solved ✓ · **10/20 pts** (only half marks despite "Solved"). Saved topology: `attachments/CN_Lab_Router on stick_Section D - Lab- VLAN Trunking and Router-on-a-Stick.xml`
- **Objective (verbatim):** "Configure a University network with three VLANs — **Student** (VLAN 10), **Staff** (VLAN 20), and **Admin** (VLAN 30) — all on a single **ManagedSwitch0**. Use a *Router-on-a-Stick* topology: Router0's `GigabitEthernet0/0` connects to the switch trunk port, and three `802.1Q` subinterfaces route between VLANs. Configure per-VLAN DHCP pools on Router0 so all nine PCs receive addresses automatically. At the end, a Student PC must be able to ping an Admin PC across VLANs."
- **Topology:** Router0 Gi0/0 → ManagedSwitch0 Fa0/1 (trunk); Fa0/2–0/4 → PC0–PC2 (VLAN 10 Student); Fa0/5–0/7 → PC3–PC5 (VLAN 20 Staff); Fa0/8–0/10 → PC6–PC8 (VLAN 30 Admin).
- **IP table:**
  | Device | Interface | IP | Mask | Assigned by |
  |---|---|---|---|---|
  | Router0 | Gi0/0.10 | 10.0.1.1 | 255.255.255.0 | Static |
  | Router0 | Gi0/0.20 | 10.0.2.1 | 255.255.255.0 | Static |
  | Router0 | Gi0/0.30 | 10.0.3.1 | 255.255.255.0 | Static |
  | PC0–PC2 | Fa0 | 10.0.1.x | 255.255.255.0 | DHCP |
  | PC3–PC5 | Fa0 | 10.0.2.x | 255.255.255.0 | DHCP |
  | PC6–PC8 | Fa0 | 10.0.3.x | 255.255.255.0 | DHCP |
- **Key commands (verbatim) — ManagedSwitch0:**
  ```
  enable
  configure terminal

  vlan 10
   name Student
   exit

  vlan 20
   name Staff
   exit

  vlan 30
   name Admin
   exit

  interface FastEthernet0/1
   switchport mode trunk
   exit

  interface FastEthernet0/2
   switchport mode access
   switchport access vlan 10
   exit
  ```
  (identical access blocks for Fa0/3, Fa0/4 → vlan 10; Fa0/5, Fa0/6, Fa0/7 → vlan 20; Fa0/8, Fa0/9, Fa0/10 → vlan 30)
- **Key commands (verbatim) — Router0:**
  ```
  enable
  configure terminal

  interface GigabitEthernet0/0
   no shutdown
   exit

  interface GigabitEthernet0/0.10
   encapsulation dot1Q 10
   ip address 10.0.1.1 255.255.255.0
   exit

  interface GigabitEthernet0/0.20
   encapsulation dot1Q 20
   ip address 10.0.2.1 255.255.255.0
   exit

  interface GigabitEthernet0/0.30
   encapsulation dot1Q 30
   ip address 10.0.3.1 255.255.255.0
   exit

  ip dhcp pool STUDENT
   network 10.0.1.0 255.255.255.0
   default-router 10.0.1.1
   exit

  ip dhcp pool STAFF
   network 10.0.2.0 255.255.255.0
   default-router 10.0.2.1
   exit

  ip dhcp pool ADMIN
   network 10.0.3.0 255.255.255.0
   default-router 10.0.3.1
   exit
  ```
  Explanation given: "The physical interface `GigabitEthernet0/0` must be `no shutdown` first. Each subinterface (`.10`, `.20`, `.30`) tags its frames with the matching VLAN ID using `encapsulation dot1Q`, acting as the default gateway for that VLAN."
- DHCP order: PC0–PC2, then PC3–PC5, then PC6–PC8, `ipconfig` on each.
- **Verification:** Run Tests; PC0 `ping 10.0.3.2`; Simulation trace PC0→PC6 shows dot1Q-tagged frames on the trunk and the subinterface hop.
- **Saved XML:** VLANs 10 Student/20 Staff/30 Admin; Fa0/1 trunk; access ports as spec. Router0 subinterfaces .10/.20/.30 with dot1qVlan 10/20/30 and IPs as spec; pools STUDENT/STAFF/ADMIN. PCs got PC0 10.0.1.2, PC1 .3, PC2 .4; PC3 10.0.2.2, PC4 .3, PC5 .4; PC6 10.0.3.2, PC7 .3, PC8 .4. Observation: in the XML **all** Router0 physical interfaces (Gi0/0–0/3, Serial0/0/0, 0/0/1) are status "up" — possibly why only 10/20 was scored (cause not stated in source).
- **Concepts tested:** VLAN creation/naming, access vs trunk ports, IEEE 802.1Q tagging, router-on-a-stick subinterfaces, inter-VLAN routing, per-VLAN DHCP pools, default gateway per VLAN.
- **Syllabus mapping:** VLANs / 802.1Q / trunking appear in **no** lecture PDF or whiteboard text (grep of all extracted decks finds no "VLAN"/"trunk"/"802.1Q") — lab-only content. Nearest lectures: L04 Network Devices (switches/routers), L14/L15 subnetting & DHCP. Date 23 Sep = Lecture L14 date.

### A3. Sample CN Contest Coding — 01 Sep 2026 — "Sample of Contest" = "CSAI321 — Q3. Launch a Web Server and Lock Down Its Firewall"
- Listed under: Labs assignments. Medium · Solved ✓ · 20/20 pts. No topology file (AWS console task).
- **Format:** Duration 20 minutes · Marks 15 · AWS Academy Learner Lab, AWS Console only, region `us-east-1`, Amazon Linux 2023, `t3.micro`. Use the **default VPC** — do not create VPC/subnet/IGW/route table.
- **Mandatory tag:** `csai321:lab` = `ec2-firewall` on both the security group and the EC2 instance ("Either one missing this tag is invisible to the grader and scores zero").
- **Part A (9 marks) — security group:** Name `web-sg` (note: AWS reserves the `sg-` prefix, so not `sg-web`; SG name cannot be changed after creation); Description `csai321 public web server`; VPC default. Exactly three inbound rules:
  | # | Type | Protocol | Port | Source |
  |---|---|---|---|---|
  | 1 | SSH | TCP | 22 | My IP — single /32 |
  | 2 | HTTP | TCP | 80 | 0.0.0.0/0 (Anywhere-IPv4) |
  | 3 | HTTPS | TCP | 443 | 0.0.0.0/0 (Anywhere-IPv4) |
  Outbound default (all traffic allowed). No IPv6 source (Anywhere-IPv6 counts as a 4th rule). "ports 80 and 443 are public, port 22 is not." SSH open to 0.0.0.0/0 scores zero for that item.
- **Part B (5 marks) — instance:** Name `web-server`; AMI Amazon Linux 2023; `t3.micro`; key pair `key-web` RSA `.pem` (or none); default VPC/any default subnet; Auto-assign public IP **Enable**; SG `web-sg`; storage default. Exactly one instance named web-server, running, with public IPv4.
- **Part C (1 mark) — concept tag:** `csai321:defaultrules` = "The number of **inbound** rules a brand-new security group has before you add any, digits only". (Expected value NOT shown in source.)
- **Grading:** A: SSH 22 from single /32 not world (3); HTTP 80 (2); HTTPS 443 (2); exactly three inbound rules (2) = 9. B = 5. C = 1. Total 15.
- Notes: Learner Lab session resets ~4h; everything in us-east-1; "My IP" fills current public address as /32; do not terminate before scoring; grader reads account read-only via pasted credentials.
- **Concepts tested:** AWS security groups (stateful firewall, inbound rules, default outbound allow), well-known ports 22/80/443, CIDR /32 vs 0.0.0.0/0, EC2 launch settings, public IPv4 auto-assign, default VPC, tagging.
- **Syllabus mapping:** Cloud networking (L05), HTTP/HTTPS ports (L06–L07), transport-layer ports (L09), CIDR (L13–L14), AWS lab sessions (Lab L12 "AWS", 17 Sep). Security groups are not covered in any lecture PDF text (lab-only).

### A4. Application Layer - In Class — 03 Sep 2026 — "Csai321-vpc-reach" = "CSAI321 — Q1. Build a Custom VPC and a Reachable Instance Inside It"
- Listed under: Labs assignments. Easy · Solved ✓ · 20/20 pts. No topology file. (Assignment name says "Application Layer" but content is VPC.)
- **Format:** Duration 30 minutes · Marks 20 · AWS Academy Learner Lab, Console only, `us-east-1`, Amazon Linux 2023, `t3.micro`. Build a custom VPC (not default).
- **Mandatory tag:** `csai321:lab` = `vpc-reach` on VPC, both subnets, IGW, **route table**, SG, EC2 instance. "The route table is the one people forget… a subnet whose routing cannot be seen reads as private".
- **Part A (7 marks):** VPC `vpc-lab`, IPv4 CIDR `10.20.0.0/16`, no IPv6, default tenancy. Subnets:
  | Name | CIDR | AZ | Auto-assign public IPv4 |
  |---|---|---|---|
  | subnet-a | 10.20.1.0/24 | us-east-1a | Enable |
  | subnet-b | 10.20.2.0/24 | us-east-1b | Leave disabled |
  (Auto-assign set via Actions → Edit subnet settings; subnet-b stays empty — proves two subnets in two distinct AZs.)
- **Part B (4 marks) — IGW & routing (verbatim steps):** 1. Internet gateways → Create internet gateway, name `igw-lab`. 2. Actions → Attach to VPC → `vpc-lab`. 3. Route tables → Create route table, name `rt-public`, VPC `vpc-lab`. 4. Routes → Edit routes → add route destination `0.0.0.0/0`, target `igw-lab`. 5. Subnet associations → tick `subnet-a` only; `subnet-b` stays on the main route table.
- **Part C (3 marks) — SG:** `admin-sg`, description `csai321 admin access`, VPC vpc-lab, exactly one inbound rule SSH TCP 22 source My IP (/32); outbound default. 0.0.0.0/0 on 22 or a second rule scores zero.
- **Part D (5 marks) — EC2:** `ec2-lab`, Amazon Linux 2023, `t3.micro`, key pair `key-lab` RSA `.pem`, VPC vpc-lab, subnet-a, auto-assign public IP Enable, SG admin-sg; running; private IPv4 in 10.20.1.x plus a public IPv4.
- **CLI shown (optional self-check, verbatim):**
  ```
  chmod 400 key-lab.pem
  ssh -i key-lab.pem ec2-user@<PUBLIC_IPv4>
  ```
  "If it fails, the cause is almost always the route table association or a missing public IP."
- **Part E (1 mark) — concept tag:** `csai321:hosts` on the VPC = "The number of usable host addresses in `10.20.1.0/24`, digits only". (Expected value NOT shown in source.) NOTE for site authors: in AWS, 5 addresses per subnet are reserved, so "usable" is ambiguous (classic 2^8−2 vs AWS 2^8−5); the source does not say which is expected.
- **Grading:** A VPC CIDR 10.20.0.0/16 + two subnets in two AZs (7); B IGW attached + only one subnet routes 0.0.0.0/0 to it (4); C admin-sg exactly one inbound TCP 22 from single /32 (3); D running t3.micro in subnet-a with admin-sg and public IPv4 (5); E tag (1). Total 20.
- **Concepts tested:** custom VPC CIDR, subnets per AZ, public vs private subnet = route 0.0.0.0/0 → IGW, route-table association / main route table, IGW attach, SG, SSH key permissions, usable-host calculation for /24.
- **Syllabus mapping:** L14 (Subnetting in Practice — and Designing an AWS VPC), L15 (VPC route tables, IGW — SL-L15 p21–26), L13 (CIDR, usable hosts), Lab L13 "VPC" (22 Sep). Directly parallels SL-L15 p21–23/p26.

### A5. CN_Lab_NPT_D (Q1) — 29 Sep 2026 — "Gaming Lab LAN"
- Listed under: Labs assignments. Medium · Solved ✓ · 20/20 pts. Saved topology: `attachments/CN_Lab_NPT_D - Gaming Lab LAN.xml`. "Discovery" lab: no commands given — use `?` CLI help.
- **Objective:** Router0 = default gateway + DHCP server + DNS resolver; Server0 runs HTTP game portal; PC0–PC2 get DHCP addresses and browse to the server by name.
- **Topology:** Router0 Gi0/0 → ManagedSwitch0 Fa0/1; SW0 Fa0/2 → Server0, Fa0/3 → PC0, Fa0/4 → PC1, Fa0/5 → PC2.
- **IP table:** Router0 Gi0/0 192.168.10.1/24 Static; Server0 Fa0 192.168.10.10/24 Static; PC0–PC2 192.168.10.x/24 DHCP.
- **Goals:** 1 Router0 Gi0/0 IP + up (hint `interface ?`, `ip ?`). 2 DHCP pool named exactly **GAMING**, network 192.168.10.0 255.255.255.0, default gateway 192.168.10.1 (hint `ip ?` → `dhcp`, `ip dhcp ?`). 3 DNS host entry **game-server → 192.168.10.10**. Commands given verbatim: `ip host <hostname> <ip>` — Add a static DNS entry; `no ip host <hostname>` — Remove a static DNS entry; use `ip host ?`. 4 Server0 static 192.168.10.10/24 gw 192.168.10.1; Services → HTTP on, page text **Welcome to Game Server**. 5 PCs DHCP + `ipconfig`.
- **Verification:** PC0 `ipconfig` → IP in 192.168.10.0/24, gw 192.168.10.1; `ping 192.168.10.10`; browser `http://192.168.10.10`; Run Tests.
- **Hint (verbatim gist):** in `configure terminal`, type a partial command + `?` (e.g. `ip dhcp ?`) to list sub-commands; DHCP pool sub-mode also accepts `?`.
- **Implied commands (reconstructed from saved XML, not given in source):** pool GAMING has `dnsServer="192.168.10.1"` (i.e. pool also pushes a DNS server = router), dns-record `game-server A 192.168.10.10`.
- **Saved XML observations:** Router0 Gi0/0 192.168.10.1/24; pool GAMING (gw 192.168.10.1, DNS 192.168.10.1); Server0 192.168.10.10, httpContent "Welcome to Game Server"; PC0 got 192.168.10.2 via DHCP, but **PC1 = 169.254.1.36/16 and PC2 = 169.254.1.38/16 (APIPA — DHCP not obtained)**; cabling differs from spec (Fa0/4 → PC2, Fa0/5 → PC1); an extra unconnected Router1 exists. Still scored 20/20.
- **Concepts tested:** router as DHCP server + DNS (ip host) resolver, DHCP pool options (network, default-router, dns-server), name resolution, HTTP service, IOS help system `?`, APIPA symptom when DHCP fails.
- **Syllabus mapping:** DHCP (SL-L15 p13–16, L16), DNS (L09), HTTP (L06), Lab L11 "NPT" (15 Sep) / Lab L15 "Subnet" (29 Sep).

### A6. CN_Lab_NPT_D (Q2) — 29 Sep 2026 — "Industrial Multi-Segment Network"
- Listed under: Labs assignments. Medium · Solved ✓ · 20/20 pts. Saved topology: `attachments/CN_Lab_NPT_D - Industrial Multi-Segment Network.xml`. Discovery lab (no commands given).
- **Objective:** Five segments: two physically isolated LANs (IT, Operations) on dedicated router interfaces + three VLANs (Engineering, Manufacturing, Management) over a single trunk; Router0 = gateway, DHCP server, DNS resolver for all five.
- **Topology:** Router0 Gi0/0 → ManagedSwitch0 Fa0/1 (LAN-A IT); Gi0/1 → ManagedSwitch1 Fa0/1 (LAN-B Ops); Gi0/2 → ManagedSwitch2 Fa0/1 (trunk). SW0 Fa0/2 → PC0, Fa0/3 → PC1; SW1 Fa0/2 → PC2, Fa0/3 → PC3; SW2 Fa0/2 → Server0 (Eng), Fa0/3 → PC4, Fa0/4 → Server1 (Mfg), Fa0/5 → PC5, Fa0/6 → PC6 (Mgmt).
- **IP table:**
  | Segment | Device | Interface | IP / Gateway | Assigned by |
  |---|---|---|---|---|
  | LAN-A (IT) | Router0 | Gi0/0 | 192.168.1.1 /24 | Static |
  | LAN-A (IT) | PC0, PC1 | Fa0 | 192.168.1.x — gw 192.168.1.1 | DHCP pool LAN-A |
  | LAN-B (Ops) | Router0 | Gi0/1 | 192.168.2.1 /24 | Static |
  | LAN-B (Ops) | PC2, PC3 | Fa0 | 192.168.2.x — gw 192.168.2.1 | DHCP pool LAN-B |
  | VLAN 10 Eng | Router0 | Gi0/2.10 | 10.10.10.1 /24 | Static |
  | VLAN 10 Eng | Server0 | Fa0 | 10.10.10.10 — gw 10.10.10.1 | Static |
  | VLAN 10 Eng | PC4 | Fa0 | 10.10.10.x — gw 10.10.10.1 | DHCP pool ENGINEERING |
  | VLAN 20 Mfg | Router0 | Gi0/2.20 | 10.10.20.1 /24 | Static |
  | VLAN 20 Mfg | Server1 | Fa0 | 10.10.20.10 — gw 10.10.20.1 | Static |
  | VLAN 20 Mfg | PC5 | Fa0 | 10.10.20.x — gw 10.10.20.1 | DHCP pool MANUFACTURING |
  | VLAN 30 Mgmt | Router0 | Gi0/2.30 | 10.10.30.1 /24 | Static |
  | VLAN 30 Mgmt | PC6 | Fa0 | 10.10.30.x — gw 10.10.30.1 | DHCP pool MANAGEMENT |
  DNS entries on Router0: `eng-server → 10.10.10.10`, `mfg-server → 10.10.20.10`.
- **Goals:** 1 Gi0/0, Gi0/1 IPs + up. 2 Gi0/2 up with no IP (physical trunk); subinterfaces Gi0/2.10/.20/.30 with `encapsulation dot1Q <vlan-id>` + gateway IP (`encapsulation ?`). 3 Five pools (case-sensitive) LAN-A, LAN-B, ENGINEERING, MANUFACTURING, MANAGEMENT; commands listed verbatim: `ip dhcp pool <name>` — Create or edit a DHCP pool; `no ip dhcp pool <name>` — Delete a DHCP pool; pool sub-mode `?` shows `network` and `default-router`. 4 DNS: `ip host <hostname> <ip>` / `no ip host <hostname>`. 5 ManagedSwitch2: VLANs 10 Engineering, 20 Manufacturing, 30 Management; Fa0/1 trunk; others access (`switchport ?`). 6 Servers static + HTTP pages; PC0–PC6 DHCP + `ipconfig`.
- **Verification:** PC0 `ipconfig` → 192.168.1.0/24 gw 192.168.1.1; PC4 `ipconfig` → 10.10.10.0/24 gw 10.10.10.1; PC4 `ping 10.10.20.10` (cross-VLAN); PC4 browser `http://10.10.20.10` → Manufacturing page; Run Tests.
- **Hint (verbatim gist):** bring up the physical `GigabitEthernet0/2` (`no shutdown`) before subinterfaces — "subinterfaces inherit the physical interface's up/down state"; trunk port must be configured before tagged traffic reaches access ports; `show running-config` to review.
- **Saved XML:** matches spec exactly — Router0 Gi0/0 192.168.1.1, Gi0/1 192.168.2.1, Gi0/2 up no IP, subifs .10/.20/.30 (dot1q 10/20/30); 5 pools each with dnsServer = its gateway; dns-records eng-server/mfg-server (type A); SW2 VLANs Engineering/Manufacturing/Management, Fa0/1 trunk, Fa0/2–3 VLAN 10, Fa0/4–5 VLAN 20, Fa0/6 VLAN 30; leases PC0 192.168.1.2, PC1 .3, PC2 192.168.2.2, PC3 .3, PC4 10.10.10.2, PC5 10.10.20.2, PC6 10.10.30.2.
- **Source inconsistencies:** text says the two physical LANs "each have their own unmanaged switch" but the topology uses ManagedSwitch0/1; hint says "On ManagedSwitch0, the trunk port (FastEthernet0/1)…" but the trunk is on ManagedSwitch2.
- **Concepts tested:** mixing physical-interface routing and router-on-a-stick on one router, 802.1Q subinterfaces, multiple DHCP pools, static DNS host entries, inter-VLAN and inter-LAN routing, HTTP.
- **Syllabus mapping:** DHCP (SL-L15, L16), routing tables (SL-L15 p17–19), DNS (L09), subnetting (L13–L14); VLAN parts lab-only.

### A7. CN_LAB_NAT_D — 01 Oct 2026 — "Static NAT: Publishing Internal Servers" (24 pts on the problem; shown 0/20)
- Listed under: Labs assignments. Medium · **Attempted · 0/20 pts**. No saved topology. Subtitle: "Newton School of Technology NAT Gateway Configuration". **Discovery Mode: No CLI commands are given.**
- **Scenario:** NST internal network: three VLANs Office (10), Admin (20), Staff (30) on Router0 via router-on-a-stick; each VLAN has a server reachable from the internet. Router0 = NAT boundary; WAN cable to Router1 (internet-side gateway); PC6 on Router1's LAN = external client. Static NAT gives each server its own public IP.
- **Definition given (verbatim):** "**Static NAT in a sentence:** `ip nat inside source static <private> <public>` tells the router "any packet arriving for <public> on the outside should go to <private> inside, and vice-versa." its always One-one."
- **Network addresses:**
  | Segment | Router/Interface | IP / Subnet | DHCP Pool |
  |---|---|---|---|
  | Office VLAN 10 | Router0 Gi0/2.10 | 10.0.10.1 / 255.255.255.0 | OFFICE |
  | Admin VLAN 20 | Router0 Gi0/2.20 | 10.0.20.1 / 255.255.255.0 | ADMIN |
  | Staff VLAN 30 | Router0 Gi0/2.30 | 10.0.30.1 / 255.255.255.0 | STAFF |
  | WAN (Router0) | Router0 Gi0/3 | 100.1.1.1 / 255.255.255.248 (/29) | — |
  | WAN (Router1) | Router1 Gi0/0 | 100.1.1.2 / 255.255.255.248 (/29) | — |
  | External LAN | Router1 Gi0/1 | 192.168.100.1 / 255.255.255.0 | EXTERNAL |
- **Servers & NAT mappings:**
  | Device | VLAN | Private IP | Public NAT IP | HTTP page must contain |
  |---|---|---|---|---|
  | Server0 | 10 Office | 10.0.10.2/24 gw 10.0.10.1 | 100.1.1.3 | Office Server |
  | Server1 | 20 Admin | 10.0.20.2/24 gw 10.0.20.1 | 100.1.1.4 | Admin Server |
  | Server2 | 30 Staff | 10.0.30.2/24 gw 10.0.30.1 | 100.1.1.5 | Staff Server |
- **Physical topology:** Router0 Gi0/2 ── ManagedSwitch0 (trunk); Fa0/2–0/4 VLAN10 → Server0, PC0, PC1 (Office 10.0.10.0/24); Fa0/5–0/7 VLAN20 → Server1, PC2, PC3 (Admin 10.0.20.0/24); Fa0/8–0/10 VLAN30 → Server2, PC4, PC5 (Staff 10.0.30.0/24); Router0 Gi0/3 ═crossover═ Router1 Gi0/0 (WAN 100.1.1.0/29); Router1 Gi0/1 ── ManagedSwitch1 ── PC6 (External 192.168.100.0/24). Use a **crossover cable** for the router–router WAN link. Switch port table: Fa0/1 trunk all; Fa0/2–4 access VLAN 10; Fa0/5–7 VLAN 20; Fa0/8–10 VLAN 30. VLAN names Office/Admin/Staff.
- **Tasks (12):** build topology; Router0 subinterfaces with `encapsulation dot1Q`; Router0 Gi0/3 100.1.1.1/29; Router1 Gi0/0 100.1.1.2/29 & Gi0/1 192.168.100.1/24; **default routes** — Router0 next-hop 100.1.1.2, Router1 next-hop 100.1.1.1 (`ip route ?`); DHCP pools OFFICE/ADMIN/STAFF on Router0; pool EXTERNAL (192.168.100.0/24 gw 192.168.100.1) on Router1; VLANs on switch; servers static + HTTP; mark NAT interfaces (`ip nat ?` → **inside** on each subinterface, **outside** on Gi0/3); three `ip nat inside source static <private> <public>` mappings; PCs DHCP + `ipconfig`.
- **Verification:** Router0 `show ip nat translations` → three static entries; PC0 `ipconfig` → 10.0.10.0/24 gw 10.0.10.1; PC6 `ipconfig` → 192.168.100.0/24 gw 192.168.100.1; PC6 browser `http://100.1.1.3` → Office Server; `http://100.1.1.4` → Admin Server. Run `ipconfig` on every PC first (grader checks live DHCP lease state).
- **Hints (verbatim facts):** NAT direction set in interface config mode (`interface GigabitEthernet0/2.10` then `ip nat ?`); static mappings are global config (`ip nat inside source static ?`); "The **/29 mask** is 255.255.255.248. It gives only 6 usable hosts in 100.1.1.0/29 (addresses .1 through .6). The two routers use .1 and .2; the three NAT public IPs use .3, .4, .5."; troubleshooting with `show ip nat translations` and `show ip interface brief`.
- **Commands named in the source (verbatim fragments):** `ip nat inside source static <private> <public>`, `ip nat ?` (inside/outside), `ip route ?`, `ip nat inside source static ?`, `show ip nat translations`, `show ip interface brief`, `encapsulation dot1Q`.
- **Numericals in this lab:** /29 → mask 255.255.255.248, 8 addresses, 6 usable (.1–.6), network 100.1.1.0, broadcast 100.1.1.7 (broadcast not stated in source); public IP allocation .1/.2 routers, .3/.4/.5 NAT.
- **Concepts tested:** static (one-to-one) NAT, inside/outside interface roles, NAT translation table, default static routes, /29 point-to-point WAN subnet, crossover cable for router-router, router-on-a-stick, DHCP on two routers, HTTP reachability from outside.
- **Syllabus mapping:** NAT/PAT (SL-L15 p5–12, L16 30 Sep — no file), routing tables/default route 0.0.0.0/0 (SL-L15 p17–19), subnetting /29 (SL-L14), DHCP (SL-L15). Static NAT and `ip nat` CLI are NOT in the L15 deck (the deck covers NAT/PAT conceptually + PAT table) — lab-only. Lab L16 "Subnet" (01 Oct).

### Labs with no content (from Syllabus/pack.json)
Lab sessions L01 Lab-1 (11 Aug), L02 Lab-2 (13 Aug), L03 Lab-1 (18 Aug), L04 Lab-2 (20 Aug), L05 Computer Networks (25 Aug), L06 lab-02 (27 Aug), L07 CLI Tool, Device, Topology (01 Sep), L08 Application Layer (03 Sep), L09 Web Inspect (08 Sep), L10 Wireshark (10 Sep), L11 NPT (15 Sep), L12 AWS (17 Sep), L13 VPC (22 Sep), L14 Subnet (24 Sep), L15 Subnet (29 Sep), L16 Subnet (01 Oct) — titles/topics only, no files, no notes. Lecture L16 (30 Sep, DHCP / Routing Tables / NAT & PAT) also has no file.

---

## B. Packet Tracer XML attachments — summary

| File | Lab | Devices | Key config captured | Notes |
|---|---|---|---|---|
| CN_LAB_DHCP_SectionD - Dual-LAN DHCP- Router as DHCP Server with Relay.xml | A1 | Router0, ManagedSwitch0, ManagedSwitch1, PC0–PC3, Server0 | Gi0/0 10.0.1.1/24; Gi0/1 10.0.2.1/24 helper 10.0.1.1; pools LAN-A, LAN-B | Leases exactly per IP table; switches VLAN 1 only |
| CN_Lab_Router on stick_Section D - Lab- VLAN Trunking and Router-on-a-Stick.xml | A2 | Router0, ManagedSwitch0, PC0–PC8 | Gi0/0.10/.20/.30 dot1Q 10/20/30; pools STUDENT/STAFF/ADMIN; SW Fa0/1 trunk; VLANs Student/Staff/Admin | All router physical ints up (incl. unused); scored 10/20 |
| CN_Lab_NPT_D - Gaming Lab LAN.xml | A5 | Router0, Router1 (unconnected), ManagedSwitch0, Server0, PC0–PC2 | Gi0/0 192.168.10.1/24; pool GAMING (gw+dns 192.168.10.1); DNS A game-server 192.168.10.10; Server httpContent "Welcome to Game Server" | PC1/PC2 have APIPA 169.254.1.36/.38 /16; PC1/PC2 cabling swapped |
| CN_Lab_NPT_D - Industrial Multi-Segment Network.xml | A6 | Router0, ManagedSwitch0/1/2, Server0, Server1, PC0–PC6 | Gi0/0 192.168.1.1, Gi0/1 192.168.2.1, Gi0/2 trunk + .10/.20/.30 (10.10.x.1); 5 pools with dns = gateway; DNS A eng-server, mfg-server | Matches spec |

XML schema notes (for recreating diagrams): `<device type=router|switch|pc|server name x y>` with `<interface name status ip subnet helperAddresses isSubinterface parentInterfaceId dot1qVlan switchportMode switchportVlan>`, `<dhcp-pool name network mask gateway dnsServer>`, `<dns-record hostname ip type="A">`, `<vlan id name>`, `<ftp-user>`; `<connection sourceDevice sourceInterface targetDevice targetInterface cableType="straight">`. All links are straight-through.

---

## C. Quiz MCQ inventory (`4 - MCQs.md`) — 6 quizzes, 17 MCQs

Note: displayed quiz scores are weighted by marks (pack.json `marks`), e.g. "8/8" for 4 questions with marks 1,1,3,3.

| # | Quiz | Q (short stem) | Correct answer | Marks | Topic → syllabus |
|---|---|---|---|---|---|
| 1 | Computer Networks - Revision (8/8) | Access network a student in a university lecture hall most likely uses | C — Enterprise/campus Ethernet or campus WiFi | 1 | Access networks / network edge → L01 |
| 2 | ″ | Meaning of "network of networks" | B — thousands of independently administered ISPs/networks interconnecting via shared protocols | 1 | Internet structure / ISPs → L01 |
| 3 | ″ | Friend abroad loads reel instantly, yours slow — two network reasons | B — edge (CDN) server closer to them; your last-mile access link is the bottleneck | 3 | CDN + access network bottleneck → L01 (CDN also L10) |
| 4 | ″ | Reel buffers on cellular, not home WiFi — where to investigate | C — access network (cellular last-mile bandwidth/signal) | 3 | Access network troubleshooting → L01 |
| 5 | Circuit Switching, Packet Switching, Loss and throughput, Delay - Revision (12/12) | Store-and-forward: when can router forward | B — only after entire packet received and checked | 1 | Store-and-forward → L02 |
| 6 | ″ | Scenario where circuit switching preferable | B — traditional PSTN voice call (guaranteed constant bandwidth, predictable delay) | 2 | Circuit vs packet switching → L02 |
| 7 | ″ | 10,000-bit packet over 10, 2, 5 Mbps links — transmission delays & bottleneck | A — 1 ms, 5 ms, 2 ms; bottleneck 2 Mbps | 3 | Transmission delay L/R, throughput = min link → L02 (NUMERICAL) |
| 8 | ″ | GEO satellite 500 Mbps feels sluggish — which delay dominates | B — propagation delay; ~35,000 km, d/s ≈ 240 ms one-way regardless of rate | 3 | Propagation delay → L02 (NUMERICAL-ish) |
| 9 | ″ | 300 Mbps plan but 4K buffers — likely bottleneck | B — WiFi radio, server uplink or congested ISP link, not necessarily plan speed | 3 | End-to-end throughput/bottleneck → L02 |
| 10 | OSI Model - Revision (2/2) | Main benefit of layering | B — layers independent; modularity & interoperability | 1 | Layering → L03 |
| 11 | ″ | YouTube link: layer of URL request and PDU name | C — Application layer, message | 1 | PDUs/encapsulation (message/segment/datagram/frame) → L03/L04 |
| 12 | TCP/IP Model, Network Devices - Revision (3/3) | Five TCP/IP layers top to bottom | B — Application → Transport → Network → Link → Physical | 1 | TCP/IP model → L04 |
| 13 | ″ | Where OSI Presentation & Session go in TCP/IP | B — folded into the TCP/IP Application layer | 2 | OSI vs TCP/IP → L03/L04 |
| 14 | Email Protocols, Application Services, Cryptography - Revision (not attempted; score None/2) | Secure IMAP port? (options 110, 993, 587, 995) | **Not shown in source** ("_not shown by Newton_"). Standard answer is 993 (IMAPS) — flag as not-from-source | — | Email ports → L08 (IMAP appears in WB-L07 text) |
| 15 | Transport Layer, Caching, CDN, Route 53 … - Revision (6/6) | Cache hit reduces | B — latency and origin load | 2 | Caching → L10 |
| 16 | ″ | Cache miss occurs when | B — object missing/expired | 2 | Caching → L10 |
| 17 | ″ | Cache-Control max-age defines | B — cache lifetime | 2 | HTTP caching headers → L10 (max-age appears in WB-L07 text) |

**Numericals in MCQs:**
- Q7: d_trans = L/R: 10,000/10 Mbps = 1 ms; 10,000/2 Mbps = 5 ms; 10,000/5 Mbps = 2 ms; bottleneck = 2 Mbps (min link). Correct.
- Q8: **Source inconsistency** — option B says "~35,000 km up; d/s ≈ 240 ms one-way", while the explanation says "~35,786 km away. Propagation delay ≈ 179 ms one-way (~360 ms RTT)". Neither explanation figure is consistent with the other: 35,786 km / 3×10^8 m/s ≈ 119 ms for one hop up; ≈ 239 ms ground→satellite→ground. The "179 ms" in the explanation looks like an error; the option's ≈240 ms matches the up-and-down path.

**Quiz-header notes:** Quiz titles map 1:1 to lecture titles L01, L02, L03, L04, L08, L10. No quiz exists for L05–L07, L09, L11–L16 (so none on NAT/DHCP/subnetting/VPC).

---

## D. Syllabus topic → lab/quiz mapping (summary)

| Syllabus topic (lecture) | Labs | MCQs |
|---|---|---|
| L01 Computer Networks (access networks, ISPs) | — | Q1–Q4 |
| L02 Circuit/packet switching, delay, throughput | — | Q5–Q9 |
| L03 OSI model | — | Q10, Q11, Q13 |
| L04 TCP/IP model, network devices | (switches/routers used in all simulator labs) | Q12, Q13 |
| L05 Topologies, cloud networking | A3, A4 (AWS) | — |
| L06/L07 HTTP, HTTPS, TLS (ports 80/443) | A3 (SG rules 80/443), HTTP servers in A1, A5, A6, A7 | — |
| L08 Email protocols | — | Q14 |
| L09 DNS | A5, A6 (`ip host` static DNS, dns-server in pool) | — |
| L09/L10 Transport layer, ports, caching, CDN | A3 (ports 22/80/443) | Q3, Q15–Q17 |
| L12 Cloud LB | — | — |
| L13 IPv4, CIDR, usable hosts | A4 Part E (usable hosts in /24), A7 (/29 = 6 usable) | — |
| L14 Subnetting & AWS VPC design | A4 (VPC 10.20.0.0/16, /24 subnets per AZ), A7 (/29 WAN) | — |
| L15 NAT/PAT, DHCP, routing tables, VPC route tables (SL-L15) | A1 (DHCP + relay), A2/A5/A6 (DHCP pools), A4 (0.0.0.0/0 → IGW, route-table association), A7 (static NAT, default routes) | — |
| L16 DHCP, routing tables, NAT & PAT (no file) | A1, A5, A6, A7 | — |
| Lab-only topics (not in any lecture deck) | VLANs/802.1Q/trunk/router-on-a-stick (A2, A6, A7); DHCP relay `ip helper-address` (A1); static NAT CLI `ip nat inside/outside`, `ip nat inside source static` (A7); AWS security groups (A3, A4); `ip host` DNS (A5, A6); APIPA (observed only in A5 XML) | — |
