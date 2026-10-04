# SL-L12 pages 1-28 — Cloud Load Balancing: ALB vs. NLB, Elastic Load Balancing, and High Availability
## Page table
| Page | Section/slide title | Content summary (exact facts, numbers, definitions, lists — be specific, not vague) | Callout type | Diagram/figure on page | Handwriting present? |
|---|---|---|---|---|---|
| 1 | Cloud Load Balancing: ALB vs. NLB, Elastic Load Balancing, and High Availability (title) | Title slide, Newton School of Technology. | none | Decorative network graphic. | No |
| 2 | Join the lecture online on your dashboard | Filler. | none | none | No |
| 3 | Recap — TCP Congestion Control | "TCP is a polite driver." "Its mission: Get your data to its destination as fast as possible, but without causing a traffic jam for everyone else." | none | Same 3-phase diagram as SL-L11 p10: Slow Start -> Congestion Avoidance -> Congestion Detection; "3 Acknowledgement Received" -> Congestion Avoidance; "Acknowledgement Timeout" -> Slow Start. | No |
| 4 | Can Our Website Survive the Internet | Imagine: 10,000 users are trying to access your website; one server suddenly crashes. | none (motivation) | "CRASH!" server clipart; "Multiple Users Accessing a Website": Users 1-6 -> Internet clouds -> single Web Server ("Hosts Website Files and Applications") -> page "Welcome to Our Website"; footer Multiple Users <-> Internet <-> Web Server "Delivers Website to All Users". | No |
| 5 | Load Balancer | Definition: "A load balancer distributes incoming network traffic across multiple servers to ensure high availability, reliability, scalability, and optimal application performance." | KEY CONCEPT | Left: Users (3 PCs) <-> Internet cloud <-> Load balancer (green icon) <-> 3 server stacks. Right: hand-drawn style "Users -> Load balancer -> S1, S2, S3". | Handwritten-font diagram (Users -> Load balancer -> S1/S2/S3), part of slide design |
| 6 | Load Balancer — How load balancer makes its decision | "On the basis of two approaches:" Network Load Balancer, Application Load Balancer. | none | Tree: one node branching to "Network Load Balancer" and "Application Load Balancer". | No |
| 7 | Network Load Balancer (NLB) | Recap box "The Transport Tuple": a TCP/UDP connection is identified by a 4-tuple: Source IP, Source Port, Destination IP, Destination Port. NLB = Network Load Balancer operating at Transport Layer. It sees TCP/UDP packets — not HTTP requests, not URLs, not headers. Analogy: a postal sorter who reads only the ZIP code, not the letter inside. | KEY CONCEPT + ANALOGY | none | No |
| 8 | Network Load Balancer (NLB) — How NLB Forwards Traffic (The Actual Mechanism) | Steps: (1) Client connects -> NLB receives the TCP/UDP packet; (2) NLB reads the 4-tuple (src IP, src port, dst IP, dst port); (3) Forwards the connection to a healthy backend target; (4) The client's original source IP is preserved end-to-end. Key Points: NLB operates at Layer 4 (TCP/UDP); makes forwarding decisions based on the 4-tuple; client's original source IP is preserved to the backend. | KEY CONCEPT / AWS | Client (Source IP 203.0.113.10, Port 51514) -> (1) TCP/UDP Packet -> NLB box (2) Reads 4-tuple: Source IP 203.0.113.10, Source Port 51514, Dest IP 198.51.100.25 (NLB IP), Dest Port 443 -> (3) green dashed to Target 1 10.0.1.10:443 (Healthy, check); grey dashed to Target 2 10.0.1.11:443 (Healthy, check) and Target 3 10.0.1.12:443 (Unhealthy, red X). (4) Response Packet back to client: Source IP 10.0.1.10, Port 443; Destination IP 203.0.113.10, Port 51514. 4-tuple table: Source IP 203.0.113.10 / Source Port 51514 / Destination IP 198.51.100.25 (NLB IP) / Destination Port 443. | No |
| 9 | Network Load Balancer (NLB) — Benefits/Limitations | Benefits: Ultra-high throughput; Very low latency; Preserves client source IP; Excellent for TCP/UDP workloads. Limitations: Suppose we have company.com/api/users & company.com/images/logo.png — "Can NLB distinguish them?" "NO!" "Because NLB cannot read URL". | AWS / QUIZ | AWS console screenshot "NLB": Listeners (1) TCP:80 -> Target groups (1) "Instance, TCP Target-Group", 0 targets, health icons all 0 -> Targets (0) "No targets". Two search-bar graphics with the URLs. | Handwritten-style font "Because NLB cannot read URL" (slide design) |
| 10 | Application Load Balancer (ALB) | ALB = Application Load Balancer, operates at Application Layer. ALB understands: HTTP Requests, URLs, Headers, Cookies, Host Names. | KEY CONCEPT / AWS | Side-by-side: Left (blue, ALB path): Client requests -> "Application load balancer Layer 7 - HTTP/HTTPS" -> splits to "/api/*" and "/web/*" -> "TG: api" and "TG: web" -> "EC2 (3)" each; caption "No static IP - DNS name only". Right (teal, NLB path): Client requests -> "Network load balancer Layer 4 - TCP/UDP/TLS" -> "Forward all traffic" -> "Target group: tcp-app" -> "EC2 instances (3)"; caption "Static IP + preserves client IP". Legend: Blue = ALB path, Teal = NLB path, Gray = shared EC2 layer. | No |
| 11 | Application Load Balancer (ALB) | AWS console screenshot only (no bullet text). | AWS / DEMO | Console "LB": Listeners (1) TCP:80 -> Target groups (1) "Instance, TCP" "TG", 2 targets; status icons 0,0,0,2(initial),0 -> Targets (2): i-01f69745e5c0116b7 Port 80, i-0f1ba38f45fa88efb Port 80, both "Initial: Target registration is in progress". | No |
| 12 | TLS Termination | HTTPS requires: TLS Handshake, Encryption, Certificates. "ALB can handle this." Flow: Client --HTTPS--> ALB (TLS Termination) --HTTP--> Backend. | KEY CONCEPT / AWS | Text flow Client -> HTTPS -> ALB (TLS Termination) -> HTTP -> Backend. Right figure (devopscube): Users/Apps -> protocols box "HTTP/HTTPS, HTTP1.1/2, gRPC, WebSocket" -> Application Load Balancer "Layer 7 (OSI)" -> "Routing Rules": Path based, Host based, Query String -> box "Health Checks, Sticky Sessions, LB Algorithms" -> Targets: Autoscaling Group, Lambda, EKS, Fargate, ECS, IP Address. | No |
| 13 | NLB vs ALB | Table Feature/NLB/ALB: Layer 4/7; TCP/UDP Yes/No; HTTP Aware No/Yes; URL Routing No/Yes; Header Inspection No/Yes; TLS Termination Limited/Yes; Source IP Preservation Yes/Usually via headers; Latency Lowest/Slightly higher. | KEY CONCEPT | Table only. | No |
| 14 | Problem | "If server S1 crashes, how does the load balancer know not to send traffic there?" | QUIZ | Hand-drawn style: Users -> Load balancer -> S1 (red X), S2, S3. | Handwritten-font diagram (slide design) |
| 15 | Target Group | "The Target Group acts as the health-monitoring layer between the Load Balancer and the servers, allowing the Load Balancer to know which servers are healthy and which should be avoided." | KEY CONCEPT / AWS | ALB (yellow circle) -> Target Group (diamond) -> "Port 3434" -> EC2 Instance (2 Containers); "Port 3535" -> EC2 Instance (2 Containers). | No |
| 16 | Health Checks | LB periodically sends test requests to targets. Example: GET /health, every: 30 sec. Step-by-step: 1. LB sends probe 2. Server responds 3. LB marks Healthy 4. Traffic continues. | KEY CONCEPT / AWS | Two panels. "Health Check – Healthy": ELB -> GET /health -> Target; Target -> HTTP 200 OK -> "Healthy" (check); Target's /health checks Local checks, External API, External Database (all green). "Health Check – Unhealthy": same, but External Database link red X; response "HTTP 500 Error" -> "Unhealthy" (X). | No |
| 17 | Automatic Removal (Self-Healing) | "Traffic no longer goes to unhealthy server." | KEY CONCEPT | Client A, B, C -> LB (green) -> Server A (red "Failure" burst), Server B, Server C. Client A's traffic rerouted to Server B; B and C boxed as "Load Balancing Target". | No |
| 18 | From self healing to scalability | Health Checks -> Remove Failed Servers -> Self-Healing. New challenge: Morning Traffic = 500 Users; Evening Traffic = 50,000 Users. Question: "Should we keep 100 servers running all day?" "No." -> Elasticity: increase capacity when demand rises; decrease capacity when demand falls. | QUIZ / KEY CONCEPT | Down-arrow chain; big arrow to "Elasticity". | No |
| 19 | Elasticity | Diagram only. | AWS | Amazon ELB icon; Users -> VPC -> Application Load Balancer -> splits to AZ-1 (EC2 Instance A) and AZ-2 (EC2 Instance B), each in dotted AZ box. | No |
| 20 | Auto Scaling Group | ASG automatically: Launches instances; Terminates instances; Maintains desired capacity. When traffic increases suddenly: Scaling Out — Before: EC2-1; After: EC2-1, EC2-2, EC2-3. | AWS | AWS Topology map screenshot: "AutoScaling AutoScalingGroup Group" -> "EC2 Instance Group (3)" (3/3). | No |
| 21 | Problem — Data Center Failure | Suppose all servers are in us-east-1a. Everything works until: Power Failure, Network Failure, Storage Failure. Entire application is down. | WARNING | "DATACENTER OUTAGE" clipart (server rack, warning triangle, power icon, lightning). | No |
| 22 | Availability Zone | An Availability Zone (AZ) is a physically separate AWS data center. Example: us-east-1a, us-east-1b, us-east-1c. Each AZ is isolated. | AWS / KEY CONCEPT | USERS -> Internet -> AWS Cloud > Region > VPC: Internet Gateway -> Application Load Balancer -> 3 Availability Zones each with Public subnet + EC2 instance; Auto Scaling group spans all 3 (dashed orange box). Watermark "adedokun.adu". | No |
| 23 | Multi-Availability Zones | AWS console "Availability Zones (49)" table: columns Zone name, Location, Parent Region, Zone ID, Network border, Group name. Rows: ap-southeast-6a/6b/6c Asia Pacific (New Zealand) apse6-az1/az2/az3; ap-southeast-7a/7b/7c Asia Pacific (Thailand) apse7-az1/2/3; ap-southeast-3a/3b/3c Asia Pacific (Jakarta) apse3-az1/2/3; af-south-1a/1b/1c Africa (Cape Town) afs1-az1/2/3 (group af-south-1-zg-1); me-central-1a Middle East (UAE) mec1-az1. | AWS / DEMO | Screenshot table. | No |
| 24 | High Availability | HA means: service remains available even when components fail. Principle: No Single Point of Failure. Examples (X): One server, One AZ, One database. Question: "What if the load balancer itself fails?" Answer: "ALB is managed by AWS and deployed across multiple AZs". | QUIZ / KEY CONCEPT | Gradient Q&A box. | No |
| 25 | High Availability | Diagram only. | AWS | Internet (cloud) -> Elastic Load Balancer -> two "EC2 Auto Scaling" icons inside dashed "Availability Zone A" -> each arrow -> "RDS Multi-AZ" DB icons inside dashed "Availability Zone B". | No |
| 26 | Final Architecture Diagram | Multi-tier LB hierarchy (see diagram). | none | 1 Clients (Web / Mobile / Edge Devices) -> 2 Global DNS Load Balancer (GSLB: Route53, NS1, Cloudflare) -> two 3 Regional Load Balancers: Region A (ALB/NLB, Azure Front Door, GCP LBs) and Region B -> each splits to two 4 Zonal L7 Load Balancers (Zone A1 "Envoy / Nginx / HAProxy", Zone A2, Zone B1, Zone B2) -> each to 5 Backend Services (A1: "API / ML / gRPC / Web"). | No |
| 27 | Please fill the feedback form. | Filler. | none | none | No |
| 28 | Thank You | Filler. | none | none | No |

## Worked examples & numericals
- No numerical calculations. Numeric scenario values only:
  - p4: 10,000 users; one server crashes.
  - p8: NLB 4-tuple example — Source IP 203.0.113.10, Source Port 51514, Dest IP 198.51.100.25 (NLB IP), Dest Port 443; targets 10.0.1.10:443 (Healthy), 10.0.1.11:443 (Healthy), 10.0.1.12:443 (Unhealthy); response Source 10.0.1.10:443 -> Destination 203.0.113.10:51514 (shows client source IP preserved).
  - p16: health check GET /health every 30 sec; healthy = HTTP 200 OK, unhealthy = HTTP 500 Error.
  - p18: Morning 500 users vs Evening 50,000 users; "keep 100 servers running all day?" -> No.
  - p20: scale out from 1 to 3 EC2 instances.
  - p23: 49 Availability Zones listed in console.
- FLAG (p8): figure shows the response going directly from Target 1 (10.0.1.10) to the client with Source IP 10.0.1.10; this is how the diagram depicts it (not via NLB IP) — reproduce as shown but note it is a simplification.

## Formulas stated
- None (no formulas). Definitional: TCP/UDP connection identified by 4-tuple (Source IP, Source Port, Destination IP, Destination Port).

## Diagrams that must be recreated
- p3: TCP congestion control 3-phase state diagram (same as SL-L11 p10).
- p5: Users -> Internet -> Load balancer -> 3 servers; Users -> Load balancer -> S1/S2/S3.
- p6: LB decision tree -> NLB / ALB.
- p8: NLB forwarding mechanism with the 4-tuple values, 3 targets (2 healthy, 1 unhealthy), response path with preserved client IP (values above).
- p10: ALB vs NLB side-by-side routing: ALB L7 HTTP/HTTPS -> /api/* -> TG: api -> EC2(3) and /web/* -> TG: web -> EC2(3) ("No static IP - DNS name only"); NLB L4 TCP/UDP/TLS -> Forward all traffic -> Target group: tcp-app -> EC2 instances (3) ("Static IP + preserves client IP").
- p12: TLS termination: Client --HTTPS--> ALB (TLS Termination) --HTTP--> Backend; ALB feature stack: protocols (HTTP/HTTPS, HTTP1.1/2, gRPC, WebSocket), Layer 7, routing rules (path, host, query string), health checks / sticky sessions / LB algorithms, targets (ASG, Lambda, EKS, Fargate, ECS, IP address).
- p14: Users -> LB -> S1 (crashed X), S2, S3.
- p15: ALB -> Target Group -> Port 3434 EC2 (containers), Port 3535 EC2 (containers).
- p16: Health check healthy (GET /health -> HTTP 200 OK) vs unhealthy (HTTP 500 Error because external DB check fails); target's /health checks local checks, external API, external DB.
- p17: Self-healing: Clients A/B/C -> LB -> Server A failed, traffic redirected to Server B; B and C = Load Balancing Target.
- p18: Health Checks -> Remove Failed Servers -> Self-Healing -> Elasticity.
- p19: Users -> ALB in VPC -> EC2 Instance A (AZ-1), EC2 Instance B (AZ-2).
- p20: Scale-out Before EC2-1 / After EC2-1, EC2-2, EC2-3; ASG -> EC2 group (3).
- p22: Users -> Internet -> IGW -> ALB -> 3 AZs (public subnet + EC2 each), ASG spanning AZs, inside Region/VPC.
- p25: Internet -> ELB -> EC2 Auto Scaling x2 (AZ A) -> RDS Multi-AZ x2 (AZ B).
- p26: Global DNS LB (GSLB) -> Regional LBs (A, B) -> Zonal L7 LBs (A1, A2, B1, B2) -> Backend Services.

## Code / CLI / config shown
- No code/CLI. Console config shown (verbatim from screenshots):
  - p9 (NLB): Listeners (1): "TCP:80"; Target groups (1): "Instance, TCP" "Target-Group" "0 targets"; Targets (0): "No targets".
  - p11 (titled ALB): Listeners (1): "TCP:80"; Target groups (1): "Instance, TCP" "TG" "2 targets"; Targets (2): "i-01f69745e5c0116b7 Port 80", "i-0f1ba38f45fa88efb Port 80" — "Initial: Target registration is in progress".
  - p16: health check "GET /health", interval 30 sec.

## In-class questions / quiz prompts shown on slides
- p4: "Can Our Website Survive the Internet?" (10,000 users, one server crashes) -> answer: load balancer (p5).
- p9: "Can NLB distinguish them?" (company.com/api/users vs company.com/images/logo.png) -> "NO! Because NLB cannot read URL".
- p14: "If server S1 crashes, how does the load balancer know not to send traffic there?" -> answer: Target Group + Health Checks (p15-17).
- p18: "Should we keep 100 servers running all day?" -> "No." (Elasticity / Auto Scaling).
- p24: "What if the load balancer itself fails?" -> "ALB is managed by AWS and deployed across multiple AZs".

## Unclear / unreadable
- p11: Slide is titled "Application Load Balancer (ALB)" but the console screenshot shows a TCP:80 listener with an "Instance, TCP" target group — that is NLB-style configuration (ALB listeners are HTTP/HTTPS). Likely mislabeled / inconsistent.
- p13: Table says ALB "TCP/UDP: No" — means ALB does not offer TCP/UDP listeners (it still runs over TCP); wording may mislead.
- p25: Diagram places both EC2 Auto Scaling groups in AZ A and both RDS Multi-AZ instances in AZ B — layout is questionable for HA (single AZ for compute); reproduce as shown but note.
- p23: rightmost "Group name" column truncated in screenshot (e.g., "ap-southeast-6-z..."); "Network bor..." column header truncated (values "–").
- No handwriting; all text legible at 60 dpi except p26 (re-rendered at 150 dpi, fully read).

## Duplicate / overlap notes
- p3 duplicates SL-L11 p10 (TCP congestion control 3-phase diagram and "polite driver" text).
- p7 4-tuple recap overlaps transport-layer/socket demultiplexing lectures.
- p12 TLS mention overlaps any HTTPS/TLS lecture.
- p10 and p13 both contrast ALB vs NLB (diagram vs table); p5 and p14 reuse the same Users -> LB -> S1/S2/S3 sketch.

## Topic list
- Recap: TCP congestion control phases
- Motivation: single-server failure under heavy load (10,000 users)
- Load balancer definition (HA, reliability, scalability, performance)
- Two LB approaches: Network LB vs Application LB
- Transport 4-tuple (src IP, src port, dst IP, dst port)
- NLB: Layer 4, sees TCP/UDP only, postal-sorter/ZIP-code analogy
- NLB forwarding mechanism; healthy/unhealthy targets; client source IP preservation
- NLB benefits (throughput, latency, source IP, TCP/UDP) and limitation (cannot route by URL)
- ALB: Layer 7; understands HTTP requests, URLs, headers, cookies, host names
- ALB path-based routing to target groups (/api/*, /web/*); ALB DNS-name only vs NLB static IP
- AWS console: listeners, target groups, targets, target registration
- TLS termination at ALB (HTTPS client side, HTTP to backend); ALB routing rules (path/host/query string), sticky sessions, LB algorithms, target types (ASG, Lambda, EKS, Fargate, ECS, IP)
- NLB vs ALB comparison table
- Target groups as health-monitoring layer (ports per target)
- Health checks (GET /health every 30 s; 200 OK healthy, 500 unhealthy)
- Automatic removal / self-healing
- Elasticity (scale with demand: 500 vs 50,000 users)
- Auto Scaling Group (launch, terminate, maintain desired capacity; scale out 1 -> 3)
- Data center failure (single AZ us-east-1a; power/network/storage failure)
- Availability Zones (physically separate isolated data centers; us-east-1a/b/c); multi-AZ (49 AZs console listing)
- High availability; no single point of failure; ALB managed by AWS across multiple AZs
- HA architecture: ELB + EC2 Auto Scaling + RDS Multi-AZ
- Final architecture: Global DNS LB (GSLB: Route53, NS1, Cloudflare) -> Regional LBs (ALB/NLB, Azure Front Door, GCP LBs) -> Zonal L7 LBs (Envoy/Nginx/HAProxy) -> Backend services
