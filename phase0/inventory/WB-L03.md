# WB-L03 pages 1-34 — OSI and TCP/IP Models (Computer Networks, Newton School of Technology)

Source PDF: `Lectures/Whiteboards/L03 - 2026-08-17 - OSI Model.pdf`. All 34 pages are clean slides: **there is no handwriting or whiteboard ink on any page** (checked every page image; small figure strips re-rendered at 200 dpi to read them).

## Page table
| Page | Section/slide title | Content summary (exact facts, numbers, definitions, lists — be specific, not vague) | Callout type | Diagram/figure on page (describe so it can be redrawn) | Handwriting present? |
|---|---|---|---|---|---|
| 1 | OSI and TCP/IP Models | Title slide; subtitle "Computer Networks"; Newton School of Technology logo | none | Decorative network-globe graphic | No |
| 2 | Join the lecture online on your dashboard | Filler | none | none | No |
| 3 | RECAP | 4 cards recapping L02: (1) **Packet > Circuit Switching**: data split into chunks, sharing links dynamically; far more efficient for bursty traffic than reserving idle, dedicated paths. (2) **Store-and-Forward Rule**: routers must fully receive, verify and buffer an entire packet before pushing the first bit to the next hop. (3) **The Anatomy of Delay**: every packet "ensures" [sic, = incurs] Processing, Queuing, Transmission (pushing bits) and Propagation (physical travel) times. (4) **Throughput & Bottlenecks**: end-to-end speed isn't your ISP plan, it's capped by the single slowest bottleneck link in the path. | TAKEAWAY (recap) | 2x2 grid of dark cards with icons | No |
| 4 | Objective of Today's Class | "How data travels across the network" | none | none | No |
| 5 | Sending a Letter | You write it, put it in an envelope, hand it to the postal service. Q: "Does the mail carrier care about the letter's contents?" A: "NO". Follow-up: "What if they do?" | ANALOGY / QUIZ | Photo of hands holding an addressed envelope | No |
| 6 | Concept of Layering | Section divider | none | none | No |
| 7 | Let's Send a letter: | 7-step illustrated letter flow: 1 write note → 2 wrap as gift → 3 put in envelope → 4 addressed/stamped envelope → (Destination Postal Office, priority-mail barcode label) → 5 post office / mailbox → 6 sorting tray → 7 truck → "Delivered at Destination" mailbox | ANALOGY | 7-panel comic strip (see Diagrams) | No |
| 8 | Encapsulation | Section divider | none | none | No |
| 9 | Ever seen this toy? | "Encapsulation acts like a nesting doll. As data moves down the sender's stack, each layer wraps the data above with its own header. On the receiver's side, decapsulation reverses the process: each layer strips its specific header and hands the payload up." | ANALOGY / KEY CONCEPT | Photo of Russian nesting dolls (matryoshka) | No |
| 10 | Can you see Encapsulation? | Same 7-panel letter strip as p7, re-asked as "Can you see Encapsulation?" (each wrapping = a header) | QUIZ / ANALOGY | Identical to p7 | No |
| 11 | Theoretical Concept of Layering in Computer Networks | Section divider | none | none | No |
| 12 | The OSI Model | OSI = Open Systems Interconnection; divides network communication into layers to simplify the process. Developed by ISO (International Organization for Standardization). Analogy: wrapping a gift — add layers of wrapping (gift paper, box, ribbon) going out, unwrap in reverse order when received. | KEY CONCEPT / ANALOGY | Vertical 7-block stack, top→bottom: APPLICATION, PRESENTATION, SESSION, TRANSPORT, NETWORK, DATA LINK, PHYSICAL (orange→yellow→green→teal→blue) | No |
| 13 | Why Learn the OSI Model? | Every app (WhatsApp, games, Netflix) runs on it; one map for a messy problem — splits "send data across the world" into 7 clean layers; industry's shared language ("that's a Layer 4 issue"), sound like a pro in interviews; foundation for cybersecurity, cloud, AI infra, backend. | none | Same 7-layer stack as p12 | No |
| 14 | Importance | Provides a standard for network communication. Ensures **interoperability** between different systems and devices. | KEY CONCEPT | Two laptops with bidirectional arrows | No |
| 15 | Layer 7- Application Layer | Label "Data" under letter panels 1–3. Protocol table (cropped figure): **7 Application: SMTP HTTP FTP HTTPS P2P DNS...**; **6 Presentation: JPEG MPEG IMAP...**; **5 Session: RPC(Sockets)...**. Encapsulation step 1: Device A (Netflix screen) "Data" → "HTTP header" added (step 2 begins). | KEY CONCEPT | Left: letter panels 1–3. Right: cropped encapsulation diagram (layer rows with protocol column, vertical "Encapsulation" bar, Data box → arrow 1 → [HTTP header][Data]) | No |
| 16 | Layer 7- Application Layer | Restaurant analogy: Customer → Waiter (Request) → Chef in Restaurant; Waiter carries food back (Response) → Customer | ANALOGY | Cartoon: customer, waiter with notepad, chef, restaurant; curved arrows "Request" (to chef) and "Response" (to customer) | No |
| 17 | Layer 7- Application Layer | Application Layer delivers network services directly to end-users; facilitates web browsers, email, file transfers. Analogy: waiter takes your order (user request), relays to kitchen (network), returns with food (data); connects user to service efficiently. | KEY CONCEPT / ANALOGY | Box "Application Layer" ⇄ box "www / Website": arrow "Request" (website→AL as drawn) and "Response" | No |
| 18 | Layer 6- Presentation Layer | Three roles: **Beautification** ("you want it be presented likewise"), **Translation** (HOLA ⇄ HELLO), **Encryption** ("your system want it be likewise") | ANALOGY | Letter panels 1–3; cartoon boy "Hello!" with HOLA/HELLO swap; phone with "Encrypted" label | No |
| 19 | Layer 6- Presentation Layer | Formats, encrypts and compresses data so it is readable and secure for the receiving app. Analogy: translator who converts, formats and secures messages so both sides understand even if they "speak different languages". Box 1: ASCII text to unicode; zip and unzip; Encryption and decryption. Box 2: Encoding images based on type: PNG, JPEG, GIF. | KEY CONCEPT / ANALOGY | Two 3-D boxes listing the above | No |
| 20 | Layer 5- Session Layer | "Like a Courtroom: Judge saying: Order! Order! and continuity of sessions". Two functions: **Dialog Control + Synchronization** | ANALOGY | Courtroom cartoon; two yellow pills "Dialog Control" + "Synchronization" | No |
| 21 | Layer 5- Session Layer | Session Layer establishes, manages and terminates communication sessions between two devices. Analogy: moderator in a panel — starts the call, keeps the connection going smoothly, ends it when done; manages the conversation between two systems. | KEY CONCEPT / ANALOGY | Small icon diagram around "Session Layer" (monitor, chat, tools, clock with arrows); silhouettes of 4 people talking | No |
| 22 | Layer 4- Transport Layer | "Message" (letter panel 4 + Destination Postal Office) "Encapsulated with detailed src and destination address" → truck carrying 3 envelopes → "Reassembled Message" at "Receiver" | ANALOGY | Envelope panel → truck → three envelopes in a row → person holding box of envelopes | No |
| 23 | Layer 4- Transport Layer | Ensures reliable and efficient delivery of data between two devices. Analogy: multiple conversations over the same phone line — **multiplexing** ensures each message reaches the right recipient. Strip: **4 Transport Layer — TCP UDP**; PDU box [TCP header][HTTP header][Data] labelled **"TCP Segment / UDP Packet"**; encapsulation steps 2→3, de-encapsulation step 8. | KEY CONCEPT / ANALOGY | Multiplexing diagram: 4 process docs → Multiplexer → IP ⇒ (arrow) ⇒ IP → Demultiplexer → 4 processes. Bottom strip (see Diagrams) | No |
| 24 | Layer 3- Network Layer | "Navigation"; "Send Packets from Point A->B". Strip: **3 Network Layer — IP ICMP IPSec...**; PDU [IP header][TCP header][HTTP header][Data] = **"IP Datagram"**; steps 3→4, de-encap 8. | ANALOGY | Treasure-map drawing; mesh-of-nodes graphic; bottom strip | No |
| 25 | Layer 3- Network Layer | Responsible for **logical addressing** and **forwarding** of packets across different networks. Like a **GPS system** finding best route for delivery trucks (data packets). Handles **addressing and routing** — choosing best roads to reach destination fastest and secure. | KEY CONCEPT / ANALOGY | "Transport Layer → Segments ✓ → Network Layer"; Sender PC "IP 1" in Network 1 cloud (router) - - - dashed path - - - Network 2 cloud (router) → Receiver PC "IP 2"; packet shown as [Segment] + [IP1 IP2] | No |
| 26 | Layer 2- Data Link Layer | Two functions: **Error Check**; **Media access Control — "One at a time!"** | ANALOGY | Stressed man at desk checking list (error check); turnstile icon (MAC, one at a time) | No |
| 27 | Layer 2- Data Link Layer | Ensures reliable data transfer between two **directly connected nodes (edge)**; handles **error detection and MAC addressing**; data sent safely/correctly between two directly connected devices. Strip: **2 Data Link Layer — ARP VLAN STP...**; PDU [MAC header][IP header][TCP header][HTTP header][Data] = **"Frame"**; steps 4→5, de-encap 7. | KEY CONCEPT | Framing diagram: Sending Machine: Packet → [Header][Payload Field][Trailer]; "Frames" → Receiving Machine: [Header][Payload Field][Trailer] → Packet; dashed arrow payload→payload. Bottom strip | No |
| 28 | Layer 1- Physical Layer | Media examples: **Co-axial Cable, Fiber Optic Cable, Radio Waves** (bits "0 1 1 0" on coax) | none | Three icons (coax, fiber connector pair, radio tower) | No |
| 29 | Layer 1- Physical Layer | Transmits **raw bits** over a physical medium such as cables, radio waves or fiber optics. Analogy: the roads, wires or signals the postman uses. Strip: **1 Physical Layer — Hubs Fiber...**; PDU "10010111..." = **"Bit"**; steps 5→6. | KEY CONCEPT / ANALOGY | Sender [Physical layer] → Transmission medium (cylinder, "Cable or air") → [Physical layer] Receiver; road graphic; bottom strip | No |
| 30 | The Practical Foundational Framework TCP/IP Model | Section divider | none | none | No |
| 31 | Introduction to TCP/IP Model | TCP/IP model is a layered framework that defines how data is transmitted over the internet using standard protocols like TCP and IP. | KEY CONCEPT | Side-by-side mapping table OSI → TCP/IP: application+presentation+session → **application**; transport → **transport**; network → **internet**; data link+physical → **Network access** | No |
| 32 | Comparison b/w OSI & TCP/IP | Table: (1) Open System Interconnection vs Transmission Control Protocol/Internet Protocol; (2) **7** different layers vs **4** different layers; (3) Developed by ISO (International Standard Organisation) vs Developed by **DARPA** (Defense Advanced Research Projects Agency); (4) Conceptual Model vs Used in actual data transmission between different computers. | KEY CONCEPT | 4-row comparison table | No |
| 33 | Thanks for watching! | Filler | none | none | No |
| 34 | Please fill the feedback form. | Filler | none | none | No |

## Worked examples & numericals
- None. The deck contains no numericals or worked calculations.

## Formulas stated
- None.

## Diagrams that must be recreated
- **p7 / p10 — Letter-sending encapsulation strip (7 panels):** 1 handwritten note → 2 note wrapped as gift (box + ribbon) → 3 gift placed in envelope → 4 envelope addressed with stamps → Destination Postal Office (envelope gains barcode + green "Priority Mail" sticker) → 5 post office building + mailbox → 6 sorting tray of envelopes → 7 delivery truck → house mailbox "Delivered at Destination". Dotted arrows between panels. Used to illustrate layering/encapsulation.
- **p12/p13 — OSI 7-layer stack:** 7 stacked rounded rectangles, top to bottom: Application, Presentation, Session, Transport, Network, Data Link, Physical.
- **Encapsulation walk-through (cropped strips spread across p15, p23, p24, p27, p29) — reconstruct as one diagram.** Left column = sender layers with protocol examples; centre = PDU growing; right column = receiver layers; vertical green "Encapsulation" bar on sender side, "De-encapsulation" bar on receiver side; numbered blue circles show the order.
  | Layer | Protocols listed on slide | PDU as drawn (left→right) | PDU name on slide | Step numbers visible |
  |---|---|---|---|---|
  | 7 Application | SMTP HTTP FTP HTTPS P2P DNS... | [HTTP header][Data] (starts as "Data" from Device A, a Netflix screen) | Data | 1 (Data→HTTP header), 2 |
  | 6 Presentation | JPEG MPEG IMAP... | — | — | — |
  | 5 Session | RPC(Sockets)... | — | — | — |
  | 4 Transport | TCP UDP | [TCP header][HTTP header][Data] | "TCP Segment / UDP Packet" | 2, 3 (sender); 8 (receiver) |
  | 3 Network | IP ICMP IPSec... | [IP header][TCP header][HTTP header][Data] | "IP Datagram" | 3, 4; 8 |
  | 2 Data Link | ARP VLAN STP... | [MAC header][IP header][TCP header][HTTP header][Data] | "Frame" | 4, 5; 7 |
  | 1 Physical | Hubs Fiber... | "10010111..." | "Bit" | 5, 6 |
  Colours: MAC header cream, IP header orange, TCP header blue, HTTP header green, Data pink. The frame strip shows no trailer.
- **p23 — Multiplexing/demultiplexing:** 4 "processes" (document icons) → arrows into "Multiplexer" → "IP" box → curved arrow across → "IP" box → "Demultiplexer" → 4 "processes".
- **p25 — Network layer delivery:** "Transport Layer" → down arrow → "Segments ✓" → "Network Layer". Below: Sender PC "IP 1" connected to Network 1 cloud (with Wi-Fi router); dashed arc through "Packets" (packet drawn as [Segment] over [IP1 IP2]) to Network 2 cloud (router) → Receiver PC "IP 2".
- **p27 — Data-link framing:** Sending Machine: "Packet" → down into the middle of [Header | Payload Field | Trailer]; "Frames" label with arrows; Receiving Machine: [Header | Payload Field | Trailer] → up to "Packet"; dashed arrow from sender payload to receiver payload.
- **p29 — Physical layer:** Sender → [Physical layer] → arrow down/right into a cylinder "Transmission medium" ("Cable or air") ← arrow from receiver side [Physical layer] Receiver.
- **p31 — OSI vs TCP/IP mapping:** two columns. OSI (7): application, presentation, session, transport, network, Data link, physical. TCP/IP (4): application (spans OSI app+pres+session), transport, internet (= network), Network access (spans data link + physical).

## Code / CLI / config shown
- None.

## In-class questions / quiz prompts shown on slides
- p5: "Does the mail carrier care about the letter's contents?" — answer shown: **"NO"**. Follow-up: "What if they do?" (no answer given).
- p9: "Ever seen this toy?" — answer is the nesting doll (encapsulation analogy).
- p10: "Can you see Encapsulation?" — no written answer (the letter strip; each wrapping step = a header).

## Unclear / unreadable
- p15, p23, p24, p27, p29: the encapsulation strips are **cropped pieces of one larger figure**, cut off at the edges. Some step-number circles are only partly visible (e.g., circles at the top/bottom edges of p23/p24/p27 cut off). Readable at 200 dpi; contents listed above.
- No handwriting anywhere, so nothing illegible otherwise.

## Source errors / oddities to flag
- p15: **IMAP is listed under Presentation layer** ("JPEG MPEG IMAP...") — IMAP is an application-layer email protocol. Probably meant to illustrate formats only; do not teach IMAP as Layer 6.
- p23: transport PDU labelled "TCP Segment / **UDP Packet**"; the standard term is "UDP datagram". p24 calls the L3 PDU "IP Datagram" (also commonly "packet").
- p29: "Hubs" listed as a Physical-layer item (correct, consistent with WB-L04 p8).
- p3: "Every packet ensures Processing, Queuing..." — "ensures" is a typo for "endures/incurs".
- p12 says ISO = "International Organization for Standardization"; p32 says "International Standard Organisation" (inconsistent expansion; the p12 one is correct).
- p17: arrow labels "Request" points from the website to the Application Layer and "Response" back (direction looks reversed relative to the text).

## Duplicate / overlap notes
- p10 duplicates p7 image exactly.
- p13 reuses the p12 layer-stack graphic.
- p15, p18 reuse panels 1–3 of the p7 letter strip; p22 reuses panel 4 + Destination Postal Office.
- p3 recaps WB-L02 (switching, store-and-forward, delay types, throughput bottleneck).
- WB-L04 p3 recaps this deck's 7 OSI layers (transmit down / physical link / receive up).
- Filename says "OSI Model" but the deck also covers the TCP/IP model (pp30–32). The WB-L04 filename "TCP-IP Model, Network Devices" is misleading: the TCP/IP model is only in this deck.
- Application layer, presentation layer (HTTPS/TLS) and transport layer are covered in more depth later (WB-L05–L07, WB-L10, SL-L09).
- **Not covered in this deck** (the parent asked about them): no collision or broadcast domains, no devices-by-layer table (only "Hubs" on the L1 strip), no AWS mappings.

## Topic list
- Recap: packet vs circuit switching; store-and-forward; four delay components; throughput bottleneck
- Objective: how data travels across the network
- Letter/postal analogy for layering
- Concept of layering
- Encapsulation and decapsulation (nesting-doll analogy, gift-wrapping analogy)
- OSI model: definition, developed by ISO, 7 layers in order
- Why learn OSI (shared language, "Layer 4 issue", foundation for cloud/security)
- Importance: standardization and interoperability
- Layer 7 Application: services to end users, web/email/file transfer; waiter analogy; protocols SMTP, HTTP, FTP, HTTPS, P2P, DNS; request/response
- Layer 6 Presentation: beautification/formatting, translation (ASCII→Unicode), compression (zip/unzip), encryption/decryption, image encoding (PNG, JPEG, GIF); JPEG, MPEG
- Layer 5 Session: establish/manage/terminate sessions; dialog control; synchronization; RPC/sockets; courtroom and moderator analogies
- Layer 4 Transport: reliable, efficient end-to-end delivery; segmentation and reassembly; multiplexing/demultiplexing; TCP, UDP; PDU = segment
- Layer 3 Network: logical (IP) addressing, forwarding, routing; GPS analogy; IP, ICMP, IPSec; PDU = IP datagram/packet
- Layer 2 Data Link: node-to-node (directly connected) delivery; error detection; media access control ("one at a time"); MAC addressing; framing with header/payload/trailer; ARP, VLAN, STP; PDU = frame
- Layer 1 Physical: raw bits over a medium; coaxial, fiber optic, radio waves; hubs; PDU = bit
- Header order in the encapsulation diagram: MAC | IP | TCP | HTTP | Data
- TCP/IP model: definition; 4 layers (Application, Transport, Internet, Network Access); mapping to OSI
- OSI vs TCP/IP comparison (7 vs 4 layers; ISO vs DARPA; conceptual vs practical)
