# WB-L08 pages 89–135 — DNS : The Internet's Phone Book, and AWS Route 53 (PDF/p.1 title; this range is NOT DNS/email — it holds the tail of an untitled transport-layer appendix [Mux/Demux, Ports, NAT/PAT, UDP use cases, QUIC], an untitled "Cryptography → TLS → UDP" session deck, and a byte-identical repeat of the appendix)

**Deck boundaries inside pp. 89–135** (verified by text diff + pixel diff of page images):
- **pp. 78–92 = "Appendix A"** (no title slide; starts after blank p.78): Multiplexing/Demultiplexing → QUIC → Port types → NAT/PAT → UDP use cases → QUIC. Only its tail **pp. 89–92** is in my range (PAT diagram, UDP use cases ×2, QUIC).
- **pp. 93–120 = "Cryptography / TLS / UDP" session deck** (no named title slide; opens with "Join the lecture online on your dashboard" p.93, closes with feedback p.119 + "Thank You" p.120). Sub-sections by divider slides: TCP & HTTPS recap (94–95) → Caesar/Substitution cipher (96–98) → Alice/Bob/Mallory & MITM (99–103) → "Transport Layer Security with TCP" 6-step handshake (104–110) → "python client TLS exercises" divider (111) → "UDP Protocol" (112–116) → DNS resolution slide + Video streaming (117–118).
  - pp. 98–120 are pixel-identical (except slide-number footer) to pp. 55–77 (earlier copy of the same deck, which lacked the 93–97 preamble). pp. 93–97 are unique to this copy.
- **pp. 121–135 = exact duplicate of pp. 78–92** (Appendix A repeated; pixel diff = 0). Blank p.121 starts it; PDF ends on p.135 (QUIC text).
- **No email (SMTP/POP3/IMAP) and no caching/CDN/CloudFront slides exist in this range** (nor anywhere in the text layer of WB-L08; "Caching" appears only on p.3 recap). Despite the filename, this range is Crypto/TLS/UDP/ports/PAT.
- **No handwriting anywhere in pp. 89–135** — all pages are clean Canva slides; no whiteboard annotations, no worked numericals.

## Page table
| Page | Section/slide title | Content summary (exact facts, numbers, definitions, lists — be specific, not vague) | Callout type | Diagram/figure on page (describe so it can be redrawn) | Handwriting present? |
|---|---|---|---|---|---|
| 89 | (untitled) PAT — "Each outgoing request gets a unique port number" [Appendix A tail] | Three private hosts share one router; each outgoing flow mapped to a unique public-side port: 192.168.0.2:1234 → 45000 → Server A; 192.168.0.3:3000 → 45001 → Server B; 192.168.0.4:203 → 45002 → Server C. Caption: "Each outgoing request gets a unique port number". | none | Left: laptop, desktop monitor, phone; curved arrows labelled with private IP:port converge on a router icon (box w/ 2 antennas, 3 squares). Right: 3 arrows labelled 45000/45001/45002 to boxes "Server A", "Server B", "Server C". No public IP shown. | No |
| 90 | Where UDP Shines – Use Cases | Online Gaming: real-time speed > perfect accuracy; better to lose a few packets than delay — "late data is often useless". SNMP (Simple Network Management Protocol): small quick status requests (e.g., is router online), no connection needed; if reply lost it simply retries; efficient for large networks. TFTP (Trivial File Transfer Protocol): transfers small configuration/boot files in trusted local networks; speed & simplicity > reliability; avoids TCP overhead for faster startup. | none | none | No |
| 91 | Where UDP Shines – Use Cases | DHCP (Dynamic Host Configuration Protocol) uses UDP to quickly assign IP addresses when a device joins a network; one-time requests/responses; relies on the application to handle any needed reliability. | none | none | No |
| 92 | Quick UDP Internet Connections (QUIC) | QUIC = modern transport protocol built on top of UDP, designed by Google; used in HTTP/3; combines UDP speed with TCP-like reliability. Unlike TCP: avoids slow handshakes, efficiently handles packet loss, built-in TLS encryption, faster connection setup, stream multiplexing; used by Google, YouTube, Facebook. | none | none | No |
| 93 | Join the lecture online on your dashboard | Filler — start of Crypto/TLS/UDP session deck. | none | none | No |
| 94 | TCP recap | "transport layer: communication between processes — segments oriented"; "network layer: communication between hosts". | none | Two 3-icon flows: Transport Layer: Segmentation → Transport → Reassembly; Network Layer: Packets creation → Transport → Packets assembly (green arrows between icons). Newton School of Technology logo. | No |
| 95 | HTTPS Recap | Infographic (source: medium.com/@rocky.bhatia86/...): (1) Server Certificate Check: CLIENT:HELLO → ; ← SERVER:HELLO; ← Server Certificate; client asks CA "Is this [cert] valid?" → CA replies "Yes". (2) Key Exchange: client extracts server public key from cert; creates a Session Key; "I know A, B, C, D cipher suites" →; ← "OK, Lets use "C" cipher suite"; "Encrypt [session key] using server [public key] & "C" cipher suite" →; server decrypts using private key — "At this point server has [session key]". (3) Encrypted Tunnel for data transmission: "At this point Client and Server both have common Key, Also known as session key"; Encrypt data with session key / Decrypt Data with session key both directions. | none | 3-panel sequence diagram (Client = Chrome icon, Server = rack icon, CA server). Panel 1 purple (cert check incl. CA), panel 2 red (key exchange, public/private key icons), panel 3 blue (bidirectional encrypted arrows with session-key labels). | No |
| 96 | How Ceaser communicated via messengers? | Section divider (spelling "Ceaser" as on slide). | none | none | No |
| 97 | Ceaser Cipher | Definition: "cipher is any method of transforming a message to conceal its meaning". Plaintext "Raj never catches the train. Raj should have exercised a bit more. Simran was sad!" → "Shift by 3 for example" → "Udm qhyhu fdwfkhv wkh wudlq. Udm vkrxog kdyh hahuflvhg d elw pruh. Vlpudq zdv vdg!" Screenshot of cryptii "Caesar cipher: Encode and decode online" (named after Julius Caesar, used in private correspondence). | DEMO | Two cipher wheels (outer ring A–Z, inner ring shifted): one centered "3" (inner A under outer X… i.e., shift 3), one centered "−12". cryptii tool screenshot. | No |
| 98 | Substitution Cipher | "Find out what the concealed message says, the shift by number is not known, you just have the text" — ciphertext "Gztkliv rsyz srrbz yrz dviv ufjk". "Do it without using LLMs, online tools are game! Simple python brute force script would be game as well!" (No answer on slide; brute force → shift 17 → "picture abhi baaki hai mere dost".) | PRACTICE | none | No |
| 99 | Alice, Bob & Mallory from the world of cryptography | Section divider. | none | none | No |
| 100 | Alice & Bob & Mallory, since 1978 | MITM key-substitution sequence: Alice→Mallory "Hi Bob, it's Alice. Give me your key."; Mallory→Bob same message; Bob→Mallory [Bob's key]; Mallory→Alice [Mallory's key]; Alice→Mallory "Meet me at the bus stop!" (encrypted w/ Mallory's key); Mallory: "Decrypt, read, modify to: 'Meet me at the park!' Re-encrypt w/ Bob's key"; Mallory→Bob "Meet me at the park!" (encrypted w/ Bob's key). | none | Top: avatars Alice ↔ Mallory ↔ Bob (double arrows). Below: 3-lifeline sequence diagram (Alice, Mallory, Bob) with the 6 messages above and a grey note box on Mallory's lifeline. | No |
| 101 | Man in the middle attack | "Simply put, a MITM (Man-in-the-Middle) attack is the type of online attack where a hacker gets in between a user and the website they're visiting." | KEY CONCEPT | USER/VICTIM laptop ↔ WEB APPLICATION globe: green "ORIGINAL CONNECTION" double arrow with check mark across top; hooded "MAN IN THE MIDDLE" in centre with red "NEW CONNECTION" arrows to each side, each marked with red ✕. | No |
| 102 | The Challenge: Communicating Secrets in Public | Three threats: Tampering, Eavesdropping, Impersonation. Tampering illustration: user (Role=User, Value "3") sends HTTP Request → Target Application → HTTP Response; attacker "Tempering HTTP Responses" changes JSON Response ("r":"3") to ("r":"1") → user becomes Role=admin, Value "1". | none | 3 illustrations: tampering flow diagram (user icon, HTTP Request/Response boxes, Target Application, tampered JSON response, admin icon); woman cupping ear (Eavesdropping); masked thief behind police-officer mask on phone (Impersonation). | No |
| 103 | What Mallory has to say... | xkcd-style 5-panel comic (xkcd #177 "Alice and Bob"): Mallory says Schneier and Rivest always label her the attacker; she broke Bob's private key and extracted text of her messages; public-key authenticated signatures "screamed 'Alice'"; "I realized it was a known-plaintext attack"; "Not Eve. Mallory." (Eve crossed out). | none | Comic strip, 5 panels with stick figure. Humour only. | No (printed comic lettering; "Eve" struck through in blue is part of image) |
| 104 | Transport Layer Security with TCP | Section divider. | none | none | No |
| 105 | At TCP Layer, how TLS gets added — 1. ClientHello | Browser initiates handshake with: supported TLS versions; list of supported cipher suites (ways to encrypt); random number (client_random); optional: server name. Analogy: "Hey, here are the languages I speak. Can we talk securely?" | ANALOGY | Right-side 3-block sequence diagram (Client monitor, Server rack), repeated on pp.105–110: Block "Establish TCP Connection": SYN →, ← SYN ACK, ACK →. Block "SSL/TLS Handshake": ClientHello →; ← Server Hello + Certificate; "Certificate Verification" (client side); ClientKeyExchange ↔ Server Finished. Block "Encrypted Application Data": HTTP GET ↔ HTTP Response. | No |
| 106 | 2. ServerHello | Server responds with: chosen TLS version; selected cipher suite; its own random number (server_random); digital certificate (proves its identity). Analogy: "Sure, I'll speak this encryption language. Here's my ID (certificate) to prove I am who I say I am." | ANALOGY | Same TCP+TLS sequence diagram as p.105. | No |
| 107 | 3. Certificate Verification (on client side) | Client checks: certificate valid and trusted (via CA); hostname matches; not expired or revoked. Analogy: like checking if a driver's license is real and matches the person. | ANALOGY | Same diagram. | No |
| 108 | 4. Pre-Master Secret Generation | Client generates a Pre-Master Secret (temporary, shared value); encrypts it using server's public key (from certificate); sends it to the server. "Only the server can decrypt this because only it has the private key." | KEY CONCEPT | Same diagram. | No |
| 109 | 5. Key Derivation (on both sides) | Using Pre-Master Secret + client_random + server_random, both client and server derive the same symmetric session key used to encrypt communication. | KEY CONCEPT | Same diagram. | No |
| 110 | 6. Finished Messages | Client sends "Finished" message (encrypted with the new key); server sends its own "Finished". "Now both sides know the connection is secure. The handshake is complete!" | TAKEAWAY | Same diagram. | No |
| 111 | python client TLS exercises | Section divider only — no code shown on slide. | DEMO | none | No |
| 112 | UDP Protocol | Section divider. | none | none | No |
| 113 | Speed vs Reliability – The UDP Trade-Off | Comparison graphic: UDP = no handshake (Request then repeated Responses); TCP = 3-way handshake SYN / SYN ACK / ACK before data. | none | Two-column figure. UDP column: Sender (PC) & "Reciever" (server); arrow "Request" (drawn Receiver→Sender) then three "Response" arrows Sender→Receiver. TCP column: Sender & Reciever; SYN (S→R), SYN ACK (R→S), ACK (S→R) slanted arrows with dashed horizontal guides. | No |
| 114 | (UDP cartoon) | Sender robot bubble "Are you getting all of this?"; receiver robot bubble "Who cares just sent it faster!"; "UDP" centered — illustrates no acknowledgement. | ANALOGY | Two robot figures (Sender, Receiver) with straight arrow Sender→Receiver; each has arrow up to a blue star-shaped speech bubble. | No |
| 115 | UDP Segment | UDP segment format, 32 bits wide: row 1 source port # / dest port #; row 2 length / checksum; then application data (payload). "length, in bytes of UDP segment, including header"; payload = "data to/from application layer". Right figure "UDP: The Header": Source Port 2 Bytes, Destination Port 2 Bytes, Length 2 Bytes, Checksum 2 Bytes → UDP Header 8 Bytes; then Data. | KEY CONCEPT | Left: Kurose-style box, "← 32 bits →" over 2 columns × 2 header rows (16-bit each) + big payload box; caption "UDP segment format"; arrows from callouts to length field and payload. Right: 2×2 blue boxes each "2 Bytes", brace "UDP Header 8 Bytes", wide "Data" box below. | No |
| 116 | UDP chat using nc | Section divider for a netcat UDP chat demo — no commands shown on slide. | DEMO | none | No |
| 117 | Domain Name System (DNS) | Iterative resolution of newtonschool.co: user types newtonschool.co → asks DNS Server ("ISP/Security product") "What is the IP for newtonschool.co?". Resolver → Root level DNS Server: "What is the name server for co?" → "Try 120.XX.XX.XX". Resolver → TLD DNS Server: "What is the authoritative DNS for newtonschool.co" → "Try 80.XX.XX.XX". Resolver → Authoritative DNS Server: "What is the IP for newtonschool.co" → "Try 99.83.190.102". Resolver → browser: "It's 99.83.190.102". | none | Left: monitor showing "newtonschool.co" with caption "User types into the browser:". Centre: server stack "DNS Server" labelled "ISP/Security product", query/answer arrows to monitor. Right column: three server stacks (Root level DNS Server top, TLD DNS Server middle, Authoritative DNS Server bottom), each connected to resolver by double-headed arrows with question/answer labels. | No |
| 118 | Video streaming | Live streaming = watching events in real-time (cricket, news, gaming); unlike buffered YouTube videos, prioritizes speed. Why UDP? send video packets quickly without delays. Lost frames are skipped to avoid lag; goal = smooth and instant video flow. | none | none | No |
| 119 | Please fill the feedback form. | Filler. | none | none | No |
| 120 | Thank You | Filler — end of Crypto/TLS/UDP deck. | none | none | No |
| 121 | (no title) Multiplexing illustration [start of Appendix A repeat] | Woman at laptop with apps: music "Port 8000", Web "80", Email "25". Arrows: via cloud "Multiplexing" → "Port 80" Web Server; "Port 25" → Email Server; → "Music Streaming Server". "Port 8000" label on upward arrow laptop→cloud. | ANALOGY | Illustration: laptop with 3 app icons (♫ Port 8000, globe Web 80, envelope Email 25); arrows out to a boxed column of 3 servers (Web Server [Port 80], Email Server [Port 25], Music Streaming Server). (p.121 text layer is empty — image-only; = p.78.) | No |
| 122 | Demultiplexing | Separates incoming data at receiver's transport layer by checking the destination port number on each segment; ensures each segment goes to the correct application (e.g., browser, email client). Analogy: courier box → individual letter envelopes. | ANALOGY | Courier box (labelled "courier box") with arrow → three envelopes (white, red, brown) labelled "letter envelope". | No |
| 123 | Quick UDP Internet Connections (QUIC) | Figure only: QUIC streams over one UDP connection — independent streams so loss in one doesn't block others. | none | Client (laptop) ⇄ Internet (cloud) ⇄ curved "Request" arrow to QUIC Server; a cylinder "UDP Connection" containing 3 dotted lanes (streams) with numbered packets: lane 1: 1,2,3; lane 2: 4,5,6; lane 3: 7, 8 (7 and 8 in teal); dotted arrows pointing back toward client. | No |
| 124 | (no title) Multiplexing illustration v2 | Same scene as p.121 but labels differ: cloud→laptop arrow labelled "Multplexing" (sic), "Port 80" → Web Server, "Port 25" → server labelled "Music Server" (sic — should be Email), third "Music Servor" (sic). | ANALOGY | Same as p.121 with the label errors noted (AI-generated image). | No |
| 125 | (no title) Multiplexing / Demultiplexing | Left: host with labelled flows HTTP (80), DNS (53), (22 = SSH), Other merging into one thick arrow; right "Demultiplexing" splits into HTTP, DNS, SSH, Other. Port numbers shown: 80, 53, 22. | none | PC icon on left; 6 coloured lines (labels HTTP, DNS, Other with numbers 80, 53, 22 placed between lines) converge into a single blue arrow → bracket fanning out to HTTP, DNS, SSH, Other. Title "Multiplexing" above left, "Demultiplexing" above right. Label placement is misaligned (AI image); stray glyph at bottom. | No |
| 126 | Types of Port Numbers & Common Services | 3 ranges: (1) Well-known 0–1023: HTTP 80, HTTPS 443, FTP 21, DNS 53, SSH 22. (2) Registered 1024–49151: MySQL 3306, PostgreSQL 5432, Docker 2375. (3) Dynamic/Private 49152–65535: temporarily assigned by OS for client-side connections (e.g., browser initiating a connection). (Slide numbers all three items "1." — formatting bug.) | KEY CONCEPT | none | No |
| 127 | Types of port numbers (pyramid) | Pyramid: top Well-known, middle Registered, bottom Dynamic. | none | 3-tier triangle (light blue top "Well-known", lavender middle "Registered", purple base "Dynamic"), caption "Types of port numbers". | No |
| 128 | Port Address Translation (PAT) | PAT = specific type of NAT (Network Address Translation) letting multiple devices on a local/private network share a single public IP. Instead of a separate public IP per device, PAT uses unique port numbers to track each connection; conserves public IPs and manages many connections efficiently. | KEY CONCEPT | none | No |
| 129 | (no title) One-to-One NAT | Static/one-to-one NAT contrast: 4 hosts 192.168.0.1–.4 each mapped to a distinct public IP 200.200.200.1–.4. NAT Translation table: Inside Local IP ↔ Inside Global IP (192.168.0.1↔200.200.200.1, .2↔.2, .3↔.3, .4↔.4). | none | 4 PCs (192.168.0.1, .2, .3, .4) → Switch → Router → Internet cloud. Dashed block arrow "One to One" → box "Public IPs: 200.200.200.1/.2/.3/.4". Box "NAT Translation" with columns Inside Local IP / Inside Global IP. | No |
| 130 | IP & Port Translation in PAT | PAT changes IP and also rewrites port numbers; each internal device gets unique (shared public IP, unique per-session port) combination. Mapping table: 192.168.0.2:4567 → 203.0.113.5:62001; 192.168.0.3:4568 → 203.0.113.5:62002; 192.168.0.4 → 203.0.113.5 (port missing/cut off in image). | none | "Home Network": Laptop 192.168.0.2, Mobile phone 192.168.0.3, Smart TV 192.168.0.4; laptop → router → arrow "Public IP: 203.0.113.5". Table "Mapping": Internal IP:Port → Public IP:Port with rows above. | No |
| 131 | How PAT Enables Simultaneous Connections | Each outgoing request tagged with a unique port number even from same public IP; ports act as IDs letting router track multiple sessions from same or different internal devices; allows dozens/hundreds of devices to reach different sites simultaneously on one public IP. | none | none | No |
| 132 | (untitled) PAT — unique port per request | Identical to p.89 (192.168.0.2:1234→45000→Server A; 192.168.0.3:3000→45001→Server B; 192.168.0.4:203→45002→Server C). | none | Same as p.89. | No |
| 133 | Where UDP Shines – Use Cases | Identical to p.90 (Online gaming, SNMP, TFTP). | none | none | No |
| 134 | Where UDP Shines – Use Cases | Identical to p.91 (DHCP). | none | none | No |
| 135 | Quick UDP Internet Connections (QUIC) | Identical to p.92 (QUIC on UDP, Google, HTTP/3, built-in TLS, stream multiplexing). Last page of PDF. | none | none | No |

## Worked examples & numericals (verbatim givens, steps and answers as shown; flag any arithmetic error you notice in the source)
- **p.97 Caesar cipher (shift 3)** — Given plaintext: "Raj never catches the train. Raj should have exercised a bit more. Simran was sad!" → "Shift by 3 for example" → ciphertext: "Udm qhyhu fdwfkhv wkh wudlq. Udm vkrxog kdyh hahuflvhg d elw pruh. Vlpudq zdv vdg!" — **Verified correct** (re-encoded with shift +3; matches exactly, case preserved, punctuation unchanged).
- **p.97 cipher wheels**: one wheel labelled "3", another labelled "−12" (shows the shift amount can be negative / either direction). No worked text for −12.
- **p.98 Substitution (actually Caesar/shift) cipher challenge** — Given: "Gztkliv rsyz srrbz yrz dviv ufjk", shift unknown; slide gives no answer. Brute force over 26 shifts (my check, not on slide): decrypting with shift 17 (i.e., the encryption shift was +17, equivalently −9) gives **"picture abhi baaki hai mere dost"** (Hindi film line, "the picture isn't over yet, my friend"). Note: the slide calls it a "Substitution Cipher" but it is a Caesar shift cipher (a special case of substitution).
- **p.89/132, p.130 PAT mappings** (data only, no computation): 192.168.0.2:1234→45000, 192.168.0.3:3000→45001, 192.168.0.4:203→45002; 192.168.0.2:4567→203.0.113.5:62001, 192.168.0.3:4568→203.0.113.5:62002, 192.168.0.4→203.0.113.5 (ports missing in source image).
- No other numericals in range.

## Formulas stated
- None stated as formulas. Implicit facts usable for numericals:
  - UDP header = 4 fields × 2 bytes = **8 bytes** (p.115); length field = length in bytes of whole UDP segment **including header** (p.115) → UDP length = 8 + payload bytes.
  - Caesar: ciphertext letter = plaintext letter shifted by k positions (k = 3 example; wheel shows −12) (p.97).
  - TLS session key derived from (Pre-Master Secret, client_random, server_random) (p.109).
  - Port ranges: 0–1023 / 1024–49151 / 49152–65535 (p.126).

## Diagrams that must be recreated (page → description: nodes, arrows, labels, field widths)
- **p.115 UDP segment format**: 32-bit wide box; row 1: "source port #" (16 bits) | "dest port #" (16 bits); row 2: "length" (16) | "checksum" (16); below: "application data (payload)" (variable). Callouts: "length, in bytes of UDP segment, including header"; "data to/from application layer". Companion: 2×2 header boxes each "2 Bytes" (Source Port, Destination Port, Length, Checksum), brace "UDP Header 8 Bytes", then "Data".
- **pp.105–110 TCP + TLS handshake sequence** (Client ↔ Server lifelines): Phase "Establish TCP Connection": SYN (C→S), SYN ACK (S→C), ACK (C→S). Phase "SSL/TLS Handshake": ClientHello (C→S); Server Hello + Certificate (S→C); "Certificate Verification" (client-side box); ClientKeyExchange ↔ Server Finished (double-headed). Phase "Encrypted Application Data": HTTP GET ↔ HTTP Response.
- **p.95 HTTPS recap 3-panel**: (1) Client→Server CLIENT:HELLO; Server→Client SERVER:HELLO; Server→Client Server Certificate; Client→CA "Is this cert valid?"; CA→Client "Yes". (2) Client extracts server public key from cert; creates session key; C→S "I know A, B, C, D cipher suites"; S→C "OK, Lets use 'C' cipher suite"; C→S "Encrypt [session key] using server [public key] & 'C' cipher suite"; server decrypts using private key → server has session key. (3) Both have common "session key"; data encrypted with session key both directions.
- **p.100 MITM key-substitution sequence diagram** (Alice, Mallory, Bob lifelines): A→M "Hi Bob, it's Alice. Give me your key."; M→B same; B→M [Bob's key]; M→A [Mallory's key]; A→M "Meet me at the bus stop!" (encrypted w/ Mallory's key); note on M: "Decrypt, read, modify to: 'Meet me at the park!' Re-encrypt w/ Bob's key"; M→B "Meet me at the park!" (encrypted w/ Bob's key).
- **p.101 MITM**: USER/VICTIM ↔ WEB APPLICATION "ORIGINAL CONNECTION" (green ✓, top); MAN IN THE MIDDLE in middle with two "NEW CONNECTION" red arrows (✕ marks) to victim and web app.
- **p.102 Tampering flow**: User (Role=User, Value "3") → HTTP Request → Target Application → HTTP Response → user; attacker "Tempering HTTP Responses" alters JSON response ("r":"3" → "r":"1") → user appears as Role=admin, Value "1". Plus icons for Eavesdropping and Impersonation.
- **p.113 UDP vs TCP**: UDP: Request (one arrow) then 3× Response, no handshake. TCP: SYN →, ← SYN ACK, ACK → before data.
- **p.114 UDP cartoon**: Sender → Receiver arrow; Sender bubble "Are you getting all of this?", Receiver bubble "Who cares just sent it faster!", label UDP.
- **p.117 DNS iterative resolution** (newtonschool.co): Browser ↔ Resolver ("DNS Server", ISP/Security product); Resolver ↔ Root ("What is the name server for co?" / "Try 120.XX.XX.XX"); Resolver ↔ TLD ("What is the authoritative DNS for newtonschool.co" / "Try 80.XX.XX.XX"); Resolver ↔ Authoritative ("What is the IP for newtonschool.co" / "Try 99.83.190.102"); Resolver → Browser "It's 99.83.190.102".
- **p.94 TCP recap**: Transport Layer: Segmentation → Transport → Reassembly; Network Layer: Packets creation → Transport → Packets assembly.
- **p.97 Caesar wheels**: two concentric A–Z rings, inner ring rotated; centres "3" and "−12".
- **p.89/132 PAT fan-out**: 3 devices (laptop 192.168.0.2:1234, desktop 192.168.0.3:3000, phone 192.168.0.4:203) → router → ports 45000/45001/45002 → Server A/B/C; caption "Each outgoing request gets a unique port number".
- **p.129 One-to-one NAT**: 4 PCs 192.168.0.1–.4 → Switch → Router → Internet; "One to One" arrow to Public IPs 200.200.200.1–.4; table Inside Local IP | Inside Global IP.
- **p.130 PAT mapping**: Home Network (Laptop 192.168.0.2, Mobile 192.168.0.3, Smart TV 192.168.0.4) → router → Public IP 203.0.113.5; Mapping table Internal IP:Port → Public IP:Port (rows as above).
- **p.121/124 Multiplexing scene**: laptop apps Port 8000 (music), Web 80, Email 25 → Web Server (Port 80), Email Server (Port 25), Music Streaming Server.
- **p.122 Demux analogy**: courier box → multiple letter envelopes.
- **p.123 QUIC streams**: Client ⇄ Internet → "Request" → QUIC Server; one "UDP Connection" tube with 3 independent stream lanes carrying packets 1-2-3, 4-5-6, 7-8.
- **p.125 Mux/Demux**: flows HTTP(80), DNS(53), SSH(22), Other merge into one arrow → split back to HTTP, DNS, SSH, Other.
- **p.127 Port pyramid**: Well-known (top) / Registered / Dynamic (base).

## Code / CLI / config shown (verbatim)
- None shown on any slide in pp. 89–135. Only divider titles announcing live demos: "python client TLS exercises" (p.111) and "UDP chat using nc" (p.116); p.98 suggests "Simple python brute force script" for the cipher but shows no code. (Tool referenced: cryptii web tool screenshot on p.97.)

## In-class questions / quiz prompts shown on slides (verbatim, with answers if given)
- p.96: "How Ceaser communicated via messengers?" (discussion prompt; no answer on slide).
- p.98: "Find out what the concealed message says, the shift by number is not known, you just have the text — Gztkliv rsyz srrbz yrz dviv ufjk" / "Do it without using LLMs, online tools are game! Simple python brute force script would be game as well!" — no answer given; computed answer: shift 17 → "picture abhi baaki hai mere dost".
- p.114 bubbles (rhetorical): "Are you getting all of this?" / "Who cares just sent it faster!"

## Unclear / unreadable (page → what is unreadable and why)
- p.95: small infographic text is low-res; key labels read as above, but icon-only parts (which key icon is public vs private in "Encrypt [key] using server [key]") are inferred from icons.
- p.97: cryptii screenshot body text is tiny; read as "Method in which each letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet. The method is named after Julius Caesar, who used it in his private correspondence."
- p.102: tampering diagram text is tiny (JSON values "r":"3" / "r":"1", "Tempering" [sic]) — best reading.
- p.124: AI-generated image with wrong labels ("Multplexing", Port 25 → "Music Server", "Music Servor").
- p.125: AI-generated image — port numbers 80/53/22 are placed between lines rather than on them; left labels (HTTP, DNS, Other) don't align with right labels (HTTP, DNS, SSH, Other); stray garbled glyph at bottom-left.
- p.130: last mapping row (Smart TV 192.168.0.4 → 203.0.113.5) has no port numbers — cut off in source image.
- p.113: in UDP column the "Request" arrow points from Receiver to Sender (direction ambiguous/odd in source); "Reciever" misspelt.
- p.126: all three list items numbered "1." (slide formatting bug).
- No handwriting to decipher in this range.

## Duplicate / overlap notes (pages that repeat other decks or earlier pages)
- pp.121–135 are pixel-identical duplicates of pp.78–92 (Appendix A: mux/demux, QUIC, ports, NAT/PAT, UDP use cases, QUIC).
- pp.89–92 (in range) = pp.132–135 (in range) — same content twice within my range.
- pp.98–120 are identical (except slide-number footers on dividers) to pp.55–77 (earlier copy of the same Crypto/TLS/UDP deck). Only pp.93–97 (Join, TCP recap, HTTPS recap, "How Ceaser communicated…", Caesar Cipher) are unique to this copy.
- p.117 DNS iterative resolution slide is the same as p.74; overlaps conceptually with the DNS deck at pp.7–8, 28–29 (hierarchy/how lookup works, www.amazon.com example).
- p.95 HTTPS recap overlaps with TLS handshake steps pp.105–110 (same flow, different visuals).
- pp.92/135 QUIC text + p.123 QUIC diagram belong together.
- Feedback/Thank-you fillers p.119–120 duplicate pp.76–77.

## Topic list (flat bullet list of every distinct topic/subtopic covered, in order)
- PAT: each outgoing request mapped to a unique public-side port (192.168.0.x:port → 45000/45001/45002)
- UDP use cases: online gaming (late data useless)
- UDP use cases: SNMP (small status queries, retry on loss)
- UDP use cases: TFTP (small config/boot files, trusted LAN, no TCP overhead)
- UDP use cases: DHCP (one-time request/response, app handles reliability)
- QUIC: built on UDP, by Google, used in HTTP/3, built-in TLS, faster setup, handles loss, stream multiplexing
- TCP recap: transport layer = process-to-process (segments); network layer = host-to-host (packets)
- HTTPS recap: server certificate check via CA, key exchange (cipher-suite negotiation, session key encrypted with server public key), encrypted tunnel with symmetric session key
- Caesar cipher: definition of cipher; shift-by-3 example; cipher wheels (3, −12); cryptii tool
- Substitution/shift cipher cracking exercise (brute force over 26 shifts; Python suggested)
- Alice, Bob & Mallory: MITM key-substitution attack sequence (since 1978)
- Man-in-the-middle attack definition
- Threats when communicating secrets in public: tampering, eavesdropping, impersonation
- xkcd Mallory comic (known-plaintext attack, private key compromise — humour)
- TLS over TCP: TCP 3-way handshake precedes TLS handshake
- TLS step 1 ClientHello (versions, cipher suites, client_random, optional server name/SNI)
- TLS step 2 ServerHello (chosen version, cipher suite, server_random, certificate)
- TLS step 3 Certificate verification (trusted CA, hostname match, not expired/revoked)
- TLS step 4 Pre-master secret encrypted with server public key (ClientKeyExchange)
- TLS step 5 Key derivation of symmetric session key from pre-master secret + both randoms
- TLS step 6 Finished messages (encrypted with new key); then encrypted application data (HTTP GET/Response)
- Python TLS client exercises (demo divider)
- UDP protocol: speed vs reliability trade-off; no handshake vs TCP SYN/SYN-ACK/ACK
- UDP: no acknowledgements (cartoon)
- UDP segment format: source port, dest port, length, checksum (2 bytes each, 8-byte header), payload; length includes header
- UDP chat using nc (netcat) demo divider
- DNS iterative resolution: resolver → root → TLD → authoritative (newtonschool.co → 99.83.190.102)
- Video/live streaming over UDP (skip lost frames, avoid lag)
- Multiplexing at sender (apps on ports 8000/80/25 → servers)
- Demultiplexing at receiver by destination port (courier box → envelopes analogy)
- QUIC stream multiplexing over a single UDP connection (diagram)
- Multiplexing/demultiplexing of HTTP(80), DNS(53), SSH(22), Other
- Port number ranges: well-known 0–1023 (HTTP 80, HTTPS 443, FTP 21, DNS 53, SSH 22), registered 1024–49151 (MySQL 3306, PostgreSQL 5432, Docker 2375), dynamic/private 49152–65535
- Port types pyramid
- PAT definition (NAT variant, many private hosts share one public IP via unique ports)
- One-to-one (static) NAT: inside local ↔ inside global table (192.168.0.x ↔ 200.200.200.x)
- PAT IP & port rewriting mapping table (192.168.0.2:4567 → 203.0.113.5:62001, etc.)
- How PAT enables simultaneous connections (ports as session IDs)
