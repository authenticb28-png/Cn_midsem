# SL-L09 pages 1-28 — The Transport Layer — Multiplexing, Ports, UDP, and the TCP Connection

(Title slide subtitle: "Computer Networks"; Newton School of Technology; Canva export. Companion file WB-L09 "L09 - 2026-09-07 - DNS.pdf" is the same deck, see Duplicate notes.)

## Page table
| Page | Section/slide title | Content summary (exact facts, numbers, definitions, lists — be specific, not vague) | Callout type | Diagram/figure on page (describe so it can be redrawn) | Handwriting present? |
|---|---|---|---|---|---|
| 1 | Title: "The Transport Layer — Multiplexing, Ports, UDP, and the TCP Connection" | Subtitle "Computer Networks"; Newton School of Technology logo | none | Decorative network-mesh triangle (SL copy carries a "Canva" watermark) | No |
| 2 | Join the lecture online on your dashboard | Filler | none | Background only | No |
| 3 | Recap — How DNS Lookup Works | Example: www.amazon.com. 1. Client contacts Root DNS server → returns IP addresses of TLD servers (.com). 2. Client contacts TLD server (.com) → returns IP of authoritative server (amazon.com). 3. Client contacts authoritative server (amazon.com) → returns IP of www.amazon.com | none (recap) | Sketch-style tree: "Root DNS servers" → three children "com DNS servers", "org DNS servers", "co DNS servers"; com → "google.com DNS Servers", "amazon.com DNS Servers"; org → "wikipedia.org DNS Servers"; co → "newtonschool.co DNS Servers", "huggingface.co DNS Servers" | No |
| 4 | Recap | OSI 7 layers with example protocols: 7 Application (SMTP HTTP FTP HTTPS P2P DNS...), 6 Presentation (JPEG MPEG IMAP...), 5 Session (RPC(Sockets)...), 4 Transport (TCP UDP), 3 Network (IP ICMP IPSec...), 2 Data Link (ARP VLAN STP...), 1 Physical (Hubs Fiber...). Encapsulation steps 1-5 down, de-encapsulation 6-10 up. PDU names: Data / TCP Segment, UDP Packet / IP Datagram / Frame / Bit (10010111...). Header contents callouts: MAC header = source MAC, destination MAC, frame control, sequence control; IP header = source IP, destination IP, datagram sequence order; TCP header = source port, destination port, sequence number | none (recap; "WHERE HAVE I SEEN THAT?" meme image) | Device A → Device B, "Data" dotted arrow on top. Stacked PDU rows: [HTTP header | Data] "Data"; [TCP header | HTTP header | Data] "TCP Segment / UDP Packet"; [IP header | TCP | HTTP | Data] "IP Datagram"; [MAC header | IP | TCP | HTTP | Data] "Frame"; [10010111...] "Bit". Numbered circles 1-5 down the left (Encapsulation arrow), 6-10 up the right (De-encapsulation arrow). Layer column repeated on both sides. Three dashed boxes below listing header fields | No |
| 5 | Layer 4 | Implemented in sending and receiving devices; network routers only process network-layer information; routers ignore transport-layer segment fields completely. Bold takeaway: "Transport layer converts application messages into segments" | TAKEAWAY (bold line) | OSI stack of 7 grey bars (Application, Presentation, Session, Transport [highlighted blue], Network, Data Link, Physical); arrow from Transport → "TCP/UDP" | No |
| 6 | Ports and Sockets (section divider) | Section header | none | Background only | No |
| 7 | Ports and Sockets | Apartment Building Analogy: letter needs building's street address (1 Infinite Loop) + friend's apartment number (Apartment #443); "Without both pieces, your letter gets lost!" Mapping: IP Address = computer's "street address" (172.217.167.78); Port Number = application's "apartment number" (Port 443). "IP Address + Port Number = Socket (unique endpoint)". Example: browser connecting to Google: "Your Laptop IP:Random Port ↔ Google IP:443" | ANALOGY | Two text columns (analogy vs networking) with building/door emoji | No |
| 8 | Ports and Sockets | "When you combine an IP address and a Port number, you create a unique endpoint for a conversation. This specific 'doorway' on a computer, is called a Socket." Command shown: `netstat -tnlp tcp` | KEY CONCEPT + DEMO (netstat) | Two boxes side by side. "Networking Analogy": [IP Address] + [Port Number] → arrows converge → [Socket = IP + Port]. "Real-World Analogy": [Street Address] + [Apartment Number] → [Unique address] | No |
| 9 | Multiplexing (Sender Side) | Definition: "Multiplexing is the process of collecting data from multiple application processes and sending it through the network using transport layer protocols." Apps: Chrome Port :443, WhatsApp Web Port :5222, Gmail Port :587. Segments: ":443 HTTP data", ":5222 WA data", ":587 SMTP data" | KEY CONCEPT | Left column "APPLICATIONS" (3 coloured boxes: Chrome blue :443, WhatsApp Web green :5222, Gmail red :587); three coloured lines converge into small "Trans-port Layer" box; right box "SEGMENTS" listing the three tagged segments; arrow "→ network" | No |
| 10 | Demultiplexing (Receiver Side) | Definition: "Demultiplexing is the process of delivering received data to the correct application process using port numbers." Port mapping: Browser HTTP/HTTPS :80/:443; Email SMTP/IMAP :25/:143; DNS UDP/TCP :53 | KEY CONCEPT | Tree: [Internet / Network — Carries all IP packets] ↓ [Transport Layer — TCP / UDP — ports & segments] → three arrows to [Browser HTTP/HTTPS :80/:443], [Email SMTP/IMAP :25/:143], [DNS UDP/TCP :53] | No |
| 11 | Transport Layer Protocols (section divider) | Section header | none | Background only | No |
| 12 | UDP Protocol (section divider) | Section header | none | Background only | No |
| 13 | UDP (cartoon) | Sender bubble: "Are you getting all of this?"; Receiver bubble: "Who cares just sent it faster!" (conveys UDP has no delivery confirmation) | ANALOGY | Two robot characters "Sender" → "Receiver" with one horizontal arrow; star-shaped speech bubbles; "UDP" title in middle | No |
| 14 | UDP Segment | UDP segment format: 32 bits wide; row 1 source port # / dest port #; row 2 length / checksum; then application data (payload). Annotations: "length, in bytes of UDP segment, including header"; "data to/from application layer". Second figure "UDP: The Header": Source Port 2 Bytes, Destination Port 2 Bytes, Length 2 Bytes, Checksum 2 Bytes, "UDP Header 8 Bytes", then Data | KEY CONCEPT | (a) Kurose-style box 32 bits wide, 2x2 header fields over large payload box, with two pointer arrows to the annotations. (b) Blue block diagram: 2x2 header blocks (each "2 Bytes") with brace "UDP Header 8 Bytes", wide "Data" block beneath | No |
| 15 | Domain Name System (DNS) | UDP use case example: user types newtonschool.co → asks DNS server (ISP/Security product) "What is the IP for newtonschool.co?". Resolver ↔ Root level DNS Server: "What is the name server for co?" / "Try 120.XX.XX.XX". ↔ TLD DNS Server: "What is the authoritative DNS for newtonschool.co" / "Try 80.XX.XX.XX". ↔ Authoritative DNS Server: "What is the IP for newtonschool.co" / "Try 99.83.190.102". Resolver → user: "It's 99.83.190.102" | none | Computer monitor (left) ↔ central "DNS Server" stack (labelled ISP/Security product) ↔ three server stacks on the right (Root level, TLD, Authoritative) with question/answer labels on each bidirectional arrow | No |
| 16 | Video streaming | Live streaming = watching events in real time (cricket, news, gaming); unlike buffered YouTube videos, live streams prioritize speed. "Why use udp? using UDP to send video packets quickly without delays." If some frames are lost they are skipped to avoid lag; goal is smooth, instant video flow | none (use-case) | None | No |
| 17 | TCP & The 3-Way Handshake (section divider) | Section header | none | Background only | No |
| 18 | TCP 3-Way Handshake Ritual — Step 1 | Browser (client) connecting to google server. Step 1: The Ring (SYN): browser sends tiny SYN packet; SYN = "synchronize". Quote: "Hey, are you there? I'd like to start a conversation. To keep our chat organized, I'll start numbering my sentences at number 100." (client ISN = 100) | ANALOGY (phone call) | Sequence diagram: Client and Server boxes top and bottom, vertical lifelines; SYN (C→S), SYN-ACK (S→C), ACK (C→S); yellow bar "Connection Established" | No |
| 19 | TCP 3-Way Handshake Ritual — Step 2 | Step 2: The "Hello?" (SYN-ACK): Google server "always listening for calls on Port 443" receives SYN and replies SYN-ACK which does two things at once. Quote: "Hi! Yes, I'm here! I ACKnowledge your request to start at sentence number 100. And to keep my side of the chat organized, I'll SYNchronize and start my sentences at number 350. Are you ready?" (server ISN = 350) | ANALOGY | Same handshake sequence diagram as p18 | No |
| 20 | TCP 3-Way Handshake Ritual — Step 3 | Step 3: The "I'm Here!" (ACK): browser sends final ACK. Quote: "Got it! I ACKnowledge that you're starting at 350. Let's talk!" "And boom! The connection is ESTABLISHED." | ANALOGY | Same handshake sequence diagram as p18 | No |
| 21 | TCP Connection Teardown | Polite "goodbye", usually a 4-Way Handshake. Step 1 "I have to go." (FIN): client sends FIN ("finish"). Step 2 "Okay." (ACK): server acknowledges. Step 3 "I'm done too." (FIN): once server finishes sending remaining data it sends its own FIN. Step 4 Final "Bye." (ACK): client sends last ACK | KEY CONCEPT | Sequence diagram Client/Server: FIN (C→S), ACK (S→C), dashed "Remaining Data (if any)" (S→C), yellow bar "Server continues sending until finished", FIN (S→C), ACK (C→S), yellow bar "Connection Closed" | No |
| 22 | Sequence Numbers — Ordered Delivery | Messages can take different routes and arrive out of order ("the mat." "The cat" "sat on"). TCP uses sequence numbers established during handshake. Every segment is numbered; if receiver gets #3 before #2 it waits for #2 then reassembles in correct order for the application | ANALOGY (scrambled sentence) | Four coloured circles 1→2→3→4 linked by arrows (illustrative) | No |
| 23 | Acknowledgments & Retransmission | Phone-call analogy: listener says "hmm" or "achcha". When server receives a chunk (say segments 101-200) it sends ACK saying "I've received everything up to number 201." If browser gets no ACK within a certain time it assumes data lost. "What does it do?" Answer (bold): "It simply retransmits the lost data. It sends it again, saying, 'Did you get that part?'" | ANALOGY + QUIZ (question with answer) | "ACK!" thumbs-up clip-art | No |
| 24 | TCP Segment: Preview (1/2) | Legend: Source Port = port number of sending application; Destination Port = port of receiving application; Sequence Number = unique identifier for each TCP segment to ensure ordered delivery; Acknowledgment Number = acknowledges receipt of data and indicates next expected sequence number; Data Offset = length of TCP header in 32-bit words | KEY CONCEPT | ASCII (RFC-style, green "+-+-" borders) TCP header: row1 Source Port / Destination Port; row2 Sequence Number; row3 Acknowledgment Number; row4 Data Offset / Reserved / flags C E U A P R S F over W C R C S S Y I (CWR ECE URG ACK PSH RST SYN FIN) / Window Size; row5 Checksum / Urgent Pointer; row6 Options (if any); row7 Data. No bit-scale numbers shown | No |
| 25 | TCP Segment: Preview (2/2) | Legend: Control Flags = control/status bits such as SYN, ACK, FIN, etc.; Window Size = receiver's buffer size for flow control; Checksum = helps ensure data integrity during transmission; Urgent Pointer = if URG flag set, this 16-bit field is an offset from the sequence number indicating the last urgent data byte | KEY CONCEPT | Same ASCII TCP header as p24 | No |
| 26 | Speed vs Reliability – The UDP Trade-Off | Visual comparison only: UDP sends without setup; TCP starts with SYN / SYN ACK / ACK | none | Two panels. UDP (blue header): Sender PC and "Reciever" server; arrows: "Request" (drawn pointing toward Sender), then three "Response" arrows Sender→Receiver. TCP (lavender header): Sender and "Reciever"; slanted arrows SYN (S→R), SYN ACK (R→S), ACK (S→R) with dashed horizontal guide lines | No |
| 27 | Please fill the feedback form. | Filler | none | Background only | No |
| 28 | Thank You | Filler | none | None | No |

## Worked examples & numericals
- No numerical problems in this deck.
- Handshake sequence-number story (p18-20): client starts numbering at 100 (SYN); server ACKnowledges 100 and starts its own at 350 (SYN-ACK); client ACKnowledges 350 (ACK). The slides do NOT state actual seq/ack field values (e.g., ack = 101 / 351); only "start at 100" and "start at 350".
- ACK example (p23): "segments 101-200" received → ACK says "I've received everything up to number 201." FLAG: wording is imprecise. A cumulative ACK of 201 means "received through 200, next expected = 201", and TCP numbers bytes, not segments. Matches the p24 definition "indicates the next expected sequence number".
- Port numbers given (p7, p9, p10, p19): HTTPS 443 (Google IP:443; server listening on Port 443), HTTP 80, WhatsApp Web 5222, Gmail/SMTP submission 587, SMTP 25, IMAP 143, DNS 53 (UDP/TCP). Client side = "Random Port".
- IPs shown: 172.217.167.78 (Google example, p7); 99.83.190.102 (newtonschool.co, p15); placeholders 120.XX.XX.XX (TLD for co), 80.XX.XX.XX (authoritative).
- UDP header sizes (p14): 4 fields × 2 bytes = 8-byte header; length field = bytes of whole UDP segment including header.

## Formulas stated
- Socket = IP Address + Port Number (p7, p8: "Socket = IP + Port").
- UDP header = 8 bytes (Source Port 2 B + Destination Port 2 B + Length 2 B + Checksum 2 B) (p14).
- TCP Data Offset = header length in 32-bit words (p24).
- Urgent Pointer is a 16-bit field (p25).

## Diagrams that must be recreated
- p3: DNS hierarchy tree (Root → com/org/co → google.com, amazon.com | wikipedia.org | newtonschool.co, huggingface.co).
- p4: OSI encapsulation/de-encapsulation diagram: Device A → Device B, PDU rows Data / TCP Segment-UDP Packet / IP Datagram / Frame / Bit, numbered steps 1-10, header-field callouts (MAC: src MAC, dst MAC, frame control, sequence control; IP: src IP, dst IP, datagram sequence order; TCP: src port, dst port, sequence number).
- p5: OSI 7-layer stack with Transport highlighted → "TCP/UDP".
- p8: Two analogy boxes: IP Address + Port Number → Socket = IP + Port; Street Address + Apartment Number → Unique address.
- p9: Multiplexing: Chrome :443, WhatsApp Web :5222, Gmail :587 → Transport Layer → segments ":443 HTTP data", ":5222 WA data", ":587 SMTP data" → network.
- p10: Demultiplexing tree: Internet/Network (carries all IP packets) → Transport Layer (TCP/UDP — ports & segments) → Browser HTTP/HTTPS :80/:443, Email SMTP/IMAP :25/:143, DNS UDP/TCP :53.
- p14: UDP segment format (32-bit wide; src port # | dest port #; length | checksum; application data (payload)) and the 8-byte header block diagram (each field 2 bytes).
- p15: Iterative DNS resolution: Client ↔ local DNS server ↔ Root ("name server for co?" / "Try 120.XX.XX.XX") ↔ TLD ("authoritative DNS for newtonschool.co" / "Try 80.XX.XX.XX") ↔ Authoritative ("IP for newtonschool.co" / "99.83.190.102") → client "It's 99.83.190.102".
- p18-20: 3-way handshake: Client/Server lifelines; SYN →, ← SYN-ACK, ACK →; "Connection Established" bar. Story ISNs: client 100, server 350.
- p21: 4-way teardown: FIN → ; ← ACK ; ← "Remaining Data (if any)" (dashed) ; bar "Server continues sending until finished" ; ← FIN ; ACK → ; bar "Connection Closed".
- p24/25: TCP header (RFC 793-style ASCII): Source Port | Destination Port / Sequence Number / Acknowledgment Number / Data Offset | Reserved | CWR ECE URG ACK PSH RST SYN FIN | Window Size / Checksum | Urgent Pointer / Options (if any) / Data. (Bit widths are not labelled on the slide.)
- p26: UDP vs TCP side-by-side (UDP: Request + 3 Responses with no setup; TCP: SYN, SYN ACK, ACK).

## Code / CLI / config shown
- p8: `netstat -tnlp tcp`

## In-class questions / quiz prompts shown on slides
- p23: "How do you know the other person heard you on a phone call?" → "You listen for them to say 'hmm,' or 'achcha.'"
- p23: "If your browser doesn't get an ACK back within a certain amount of time, it assumes the data was lost. What does it do?" → "It simply retransmits the lost data. It sends it again, saying, 'Did you get that part?'"
- p16: "Why use udp?" → "using UDP to send video packets quickly without delays."
- p13 (cartoon): "Are you getting all of this?" / "Who cares just sent it faster!"

## Unclear / unreadable
- p24/25: the ASCII TCP header is small at 60 dpi but legible at 150 dpi; no bit-position scale is given, so field widths (16/32/4/6 bits, etc.) are not stated on the slide.
- p26: in the source graphic the UDP "Request" arrow points toward the Sender (Receiver→Sender) while the "Response" arrows go Sender→Receiver, so the direction labels look swapped. "Reciever" is misspelled in the source.
- p9: ports :443/:5222/:587 are drawn as the applications' own ports. In practice these are the server (destination) ports and the client apps use ephemeral ports. This is a source simplification, recorded as shown.
- p15: final answer from authoritative server is labelled "Try 99.83.190.102" (wording as on slide).
- p4: network-layer callout lists "datagram sequence order" (as printed).

## Duplicate / overlap notes
- **WB-L09 ("Lectures/Whiteboards/L09 - 2026-09-07 - DNS.pdf") vs SL-L09: NO handwriting or annotation on any page. The WB file adds no content.** Method: identical text layers; per-page pixel diff of all 28 page images at 60 dpi; every differing page inspected visually side by side (p1, 3, 4, 8, 9, 10, 13, 14, 15, 18, 21, 22, 24, 26, plus 19/20/25, which share the p18/p24 images); `pdfimages -list` compared; annotation-object counts are equal (29 vs 29) and no /Ink objects exist. Pages 7, 16, 23 and 28 are pixel-identical. All differences come from (a) the SL file carrying "Canva" free-export watermarks (title-slide triangle, divider backgrounds, robots on p13, server icons on p15, number circles on p22), absent in WB, and (b) WB embedding the same raster images at higher resolution (e.g., p4 1660×1112 vs 800×535; dividers 2000-2400 px vs 800 px). The port numbers (p7, p9, p10, p19), handshake (p18-20), teardown (p21), UDP header (p14) and TCP header (p24-25) are identical in both, with no added marks. The WB filename ("DNS") does not match the content; it is this transport-layer deck. Its higher-resolution images are the better source for redrawing figures.
- Within the deck: p18, p19 and p20 reuse the same handshake diagram; p24 and p25 reuse the same TCP header image.
- Cross-deck: p3 and p15 repeat DNS material from the previous lecture (DNS deck). p4 repeats OSI encapsulation from earlier layer lectures. p21 (teardown) reappears verbatim as SL-L10 p6, and the handshake diagram reappears in SL-L10 p5. The "Join the lecture online", "Please fill the feedback form" and "Thank You" slides are boilerplate shared across decks.
- Not covered anywhere in this deck: the term "4-tuple" / connection identification by (src IP, src port, dst IP, dst port); the UDP checksum computation; TCP state names (except as in SL-L10 p14); port-number ranges (well-known / ephemeral).

## Topic list
- Recap: DNS lookup hierarchy (root → TLD → authoritative), www.amazon.com example
- Recap: OSI 7 layers, protocols per layer, encapsulation/de-encapsulation, PDU names (segment, datagram, frame, bits)
- Layer 4 role: end-host only; routers ignore transport fields; app messages → segments
- Ports and sockets: apartment-building analogy; IP = street address, port = apartment number
- Socket = IP + Port (unique endpoint); client random port ↔ server 443
- netstat -tnlp tcp (viewing listening sockets)
- Multiplexing (sender side) with app ports 443, 5222, 587
- Demultiplexing (receiver side) by port: 80/443 HTTP(S), 25/143 SMTP/IMAP, 53 DNS
- Transport layer protocols: UDP
- UDP characteristics: connectionless, no delivery confirmation ("who cares, just send it faster")
- UDP segment format and 8-byte header (src port, dst port, length, checksum, 2 bytes each)
- UDP use case: DNS (iterative resolution walkthrough for newtonschool.co)
- UDP use case: live video streaming (lost frames skipped)
- TCP 3-way handshake (SYN, SYN-ACK, ACK), ISN story 100 / 350, server listening on 443
- TCP 4-way connection teardown (FIN, ACK, remaining data, FIN, ACK)
- Sequence numbers and ordered delivery / reassembly
- Acknowledgments (cumulative "next expected") and timeout-based retransmission
- TCP segment header fields: ports, seq, ack, data offset, flags (CWR ECE URG ACK PSH RST SYN FIN), window size, checksum, urgent pointer, options
- Speed vs reliability: UDP vs TCP trade-off
