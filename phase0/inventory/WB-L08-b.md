# WB-L08 pages 41–88 — (no title slide inside this range; PDF file is titled "L08 – Email Protocols, Application Services, Cryptography". Range content = tail of the "Socket API / HTTP / APIs" deck (p41 only), then an untitled deck: Socket API → HTTP messages → Cryptography (cipher, Alice/Bob/Mallory, MITM) → TLS handshake → UDP → DNS recap → Video streaming, then extra slides on Multiplexing/Demultiplexing, QUIC, Port ranges, NAT/PAT)

Deck boundaries within the 135-page bundle (from text layer + images):
- p1–14: "DNS : The Internet's Phone Book, and AWS Route 53" (CSAI321) — ends p13 feedback / p14 "Thanks for watching!" (outside range).
- p15–41: Socket API / HTTP messages / DNS / APIs deck — ends p40 feedback / **p41 "Thanks for watching!"** (only p41 is in my range).
- **p42–77**: untitled deck (no title or "join online" slide). p42–54 Socket API + HTTP (verbatim repeat of p15–27); p55–75 cryptography → TLS → UDP → DNS → video streaming; ends **p76 "Please fill the feedback form."** and **p77 "Thank You"**.
- **p78–88 (continues to p92)**: appendix/extra slides with no title — multiplexing/demultiplexing, QUIC, port number ranges, NAT/PAT, (p89–92 outside range: Server A/B/C, UDP use cases, QUIC text).
- p93 "Join the lecture online on your dashboard" starts the next deck (TCP recap, HTTPS recap, Caesar cipher…) whose p98–131 are a verbatim repeat of my p55–88.
- NOTE: no Email (SMTP/POP3/IMAP), caching/CDN/CloudFront or Route 53 content appears in pages 41–88. No handwriting/whiteboard ink appears anywhere in this range — all pages are typeset Canva slides (only hand-lettered element is the xkcd comic on p60).

## Page table
| Page | Section/slide title | Content summary (exact facts, numbers, definitions, lists — be specific, not vague) | Callout type | Diagram/figure on page | Handwriting present? |
|---|---|---|---|---|---|
| 41 | Thanks for watching! | End slide of the Socket API/HTTP/APIs deck (p15–41). | none | Purple/blue gradient blob | No |
| 42 | Socket API as an Interface b/w the Application and Transport Layers | Socket API = toolkit enabling apps to communicate with the OSI model's transport layer; serves as a bridge for apps to connect with other systems using protocols like TCP and UDP. | KEY CONCEPT | Vertical stack: [Application] ⇓ [Socket API] ⇓ [Transport Layer] (double-chevron arrows downward) | No |
| 43 | Application Layer Protocols | List: HTTP – Hypertext Transfer Protocol; HTTPS – Hypertext Transfer Protocol Secure; HTTP/2. | none | None | No |
| 44 | HTTP | "Stages in an HTTP transaction": Connection → Request → Response → Close. | KEY CONCEPT | Client (person at monitor) left, Server (rack) right; arrows: Connection (C→S), Request (C→S), Response (S→C), Close (double-headed ↔) | No |
| 45 | HTTP | HTTP is a stateless protocol operating over TCP. Stateless nature: each HTTP request is independent, treated as a new request with no memory of prior interactions; server does not retain information about previous client requests or sessions. | KEY CONCEPT | HTTP icon (globe + </> + network nodes) | No |
| 46 | Breakdown of HTTP Messages | HTTP messages = requests (client→server) and responses (server→client); structured as request/response line, headers, optionally a body. | KEY CONCEPT | Block diagram: "HTTP Message" on top; two columns Request → "Request Line", Response → "Status Line"; shared full-width "Headers" box; shared full-width "Body" box | No |
| 47 | HTTP Request Message Breakdown | Annotated example request: `GET /index.html HTTP/1.1`; headers Host: example.com, User-Agent: Chrome, Accept-Language: en-us, …; empty line; body "optional, e.g. form data, json". | KEY CONCEPT | "Message request" box with 4 coloured bands (yellow request line, red headers, grey empty line, green body), labels on left with arrows: Request Line, Headers, Empty Line, Body | No |
| 48 | HTTP Request Message Breakdown – Request Line | Request line has 3 parts: Method (operation, e.g. GET, POST, PUT, DELETE); URL (resource/endpoint e.g. /home, /api/data); HTTP Version (e.g. HTTP/1.1 or HTTP/2). Example: GET /index.html HTTP/1.1 | KEY CONCEPT | None | No |
| 49 | HTTP Request Message Breakdown – Headers | Headers give additional info about the request or client capabilities. Common: User-Agent (client software: browser, app), Host (domain name of the server), Content-Type (type of data client is sending, for POST or PUT), Accept (types client can process, e.g. text/html, application/json). | KEY CONCEPT | None | No |
| 50 | HTTP Request Message Breakdown – Body (optional) | Body = actual data sent by client (form data, JSON payload…); only included for certain methods like POST, PUT, PATCH. Example (POST): json `{ "username": "user1", "password": "password123" }` | KEY CONCEPT | None | No |
| 51 | HTTP Response Message Breakdown | Annotated example response: `HTTP/1.1 201 Created`; Server: Apache/2.2.14 (Win32); Date: Mon, 18 Dec 2024 10:25:30 GMT; Content-Length: 88; Content-Type: application/json; Connection: Closed; empty line; JSON body {"message": "User successfully created", "user": {"id": 101, (More data)}} | KEY CONCEPT | "Message Response" box with bands: yellow status line, red headers, blank empty line, green body; left labels Status Line, Headers, Empty Line, Body with arrows | No |
| 52 | HTTP Response Message Breakdown – Status Line | Status line = HTTP Version; Status Code (3-digit, e.g. 200, 404, 500); Status Message (short description e.g. OK, Not Found, Internal Server Error). Example: HTTP/1.1 200 OK | KEY CONCEPT | None | No |
| 53 | HTTP Response Message Breakdown – Headers | Response headers = metadata about response, similar to request headers. Common: Content-Type (type of data in body, e.g. text/html, application/json), Content-Length (length of body in bytes), Server (server software info), Date (date/time response was sent). | KEY CONCEPT | None | No |
| 54 | HTTP Response Message Breakdown – Body (optional) | Response body = actual data returned (HTML, JSON, an image, etc.). Example (labelled "css" — mislabel, it is HTML): `<html><body><h1>Welcome to Example.com</h1></body></html>` | KEY CONCEPT | None | No |
| 55 | Substitution Cipher | Exercise: "Find out what the concealed message says, the shift by number is not known, you just have the text": `Gztkliv rsyz srrbz yrz dviv ufjk`. "Do it without using LLMs, online tools are game! Simple python brute force script would be game as well!" (Answer not on slide.) | PRACTICE | None | No |
| 56 | Alice, Bob & Mallory from the world of cryptography | Section divider. | none | Gradient background | No |
| 57 | Alice & Bob & Mallory, since 1978 | MITM key-substitution story as a sequence diagram (see Diagrams). | ANALOGY | Avatars Alice ↔ Mallory ↔ Bob; sequence diagram with lifelines Alice, Mallory, Bob | No |
| 58 | Man in the middle attack | "Simply put, a MITM (Man-in-the-Middle) attack is the type of online attack where a hacker gets in between a user and the website they're visiting." | KEY CONCEPT | USER/VICTIM laptop ↔ WEB APPLICATION globe with green "ORIGINAL CONNECTION" ✓ arrow on top; hooded "MAN IN THE MIDDLE" in centre with red "NEW CONNECTION" arrows to each side marked ✗ | No |
| 59 | The Challenge: Communicating Secrets in Public | Three threats: Tampering, Eavesdropping, Impersonation. | KEY CONCEPT | Tampering diagram: user (Role=User, Value "3") → HTTP Request → Target Application → HTTP Response → user; "Tempering [sic] HTTP Responses" turns JSON Response with (…"r":"3"…) into JSON Response with (…"r":"1"…) → attacker becomes Role=admin, Value "1". Eavesdropping = woman with hand to ear; Impersonation = masked thief with phone behind a police officer | No |
| 60 | What Mallory has to say... | xkcd #177-style 5-panel comic: speaker complains of being labelled "the attacker" in protocol specs by "Schneier and Rivest", says "I broke Bob's private key and extracted the text of her messages", mentions public-key authenticated signatures, "known-plaintext attack", "She's the attacker, not me." | ANALOGY | 5-panel stick-figure comic | Original comic signature "NOT EVE." has "EVE" struck through in blue and "Mallory." added in handwriting-style script (edited to fit Mallory) |
| 61 | Transport Layer Security with TCP | Section divider. | none | Gradient background | No |
| 62 | At TCP Layer, how TLS gets added – 1. ClientHello | Browser initiates handshake with: supported TLS versions; list of supported cipher suites (ways to encrypt); random number (client_random); optional: server name. Analogy: "Hey, here are the languages I speak. Can we talk securely?" | KEY CONCEPT / ANALOGY | TLS-over-TCP sequence diagram (same on p62–67; see Diagrams) | No |
| 63 | … – 2. ServerHello | Server responds with: chosen TLS version; selected cipher suite; its own random number (server_random); digital certificate (proves identity). Analogy: "Sure, I'll speak this encryption language. Here's my ID (certificate) to prove I am who I say I am." | KEY CONCEPT / ANALOGY | Same TLS diagram | No |
| 64 | … – 3. Certificate Verification (on client side) | Client checks: certificate valid and trusted (via CA); hostname matches; not expired or revoked. Analogy: checking if a driver's license is real and matches the person. | KEY CONCEPT / ANALOGY | Same TLS diagram | No |
| 65 | … – 4. Pre-Master Secret Generation | Client generates a Pre-Master Secret (temporary, shared value); encrypts it with the server's public key (from certificate); sends it to server. Only the server can decrypt it because only it has the private key. | KEY CONCEPT | Same TLS diagram | No |
| 66 | … – 5. Key Derivation (on both sides) | Inputs: Pre-Master Secret, client_random, server_random → both client and server derive the same symmetric session key used to encrypt communication. | KEY CONCEPT | Same TLS diagram | No |
| 67 | … – 6. Finished Messages | Client sends "Finished" (encrypted with new key); server sends its own "Finished". Both sides know connection is secure; handshake complete. | KEY CONCEPT / TAKEAWAY | Same TLS diagram | No |
| 68 | python client TLS exercises | Section divider for an in-class Python TLS client exercise (no code on slide). | DEMO | Gradient background | No |
| 69 | UDP Protocol | Section divider. | none | Gradient background | No |
| 70 | Speed vs Reliability – The UDP Trade-Off | Side-by-side comparison UDP vs TCP (diagram only, no text bullets). | KEY CONCEPT | Left "UDP": Sender (PC) & Reciever [sic] (server); "Request" arrow drawn Receiver→Sender, then 3 "Response" arrows Sender→Receiver (no handshake). Right "TCP": SYN (Sender→Receiver, solid), SYN ACK (Receiver→Sender, solid + dashed guide line), ACK (Sender→Receiver, solid + dashed guide) | No |
| 71 | UDP (cartoon) | Sender robot: "Are you getting all of this?"; Receiver robot: "Who cares just sent it faster!" — UDP sends without acknowledgment. | ANALOGY | Two robots with laptops, arrow Sender→Receiver, star-shaped speech bubbles, "UDP" centred | No |
| 72 | UDP Segment | UDP segment format, 32 bits wide: row1 source port # / dest port #; row2 length / checksum; then application data (payload). Notes: "length, in bytes of UDP segment, including header"; payload = "data to/from application layer". Second figure "UDP: The Header": Source Port 2 Bytes, Destination Port 2 Bytes, Length 2 Bytes, Checksum 2 Bytes → UDP Header 8 Bytes; then Data. | KEY CONCEPT | (a) Kurose-style box 32 bits wide, 2×2 header fields + large payload box, arrows to callouts; (b) 4 coloured boxes 2 B each with brace "UDP Header 8 Bytes", Data box below | No |
| 73 | UDP chat using nc | Section divider for a netcat UDP chat demo (no commands on slide). | DEMO | Gradient background | No |
| 74 | Domain Name System(DNS) | Iterative lookup for newtonschool.co: user types "newtonschool.co" in browser → asks DNS Server (ISP/Security product) "What is the IP for newtonschool.co?"; DNS server asks Root level DNS Server "What is the name server for co?" → "Try 120.XX.XX.XX"; asks TLD DNS Server "What is the authoritative DNS for newtonschool.co" → "Try 80.XX.XX.XX"; asks Authoritative DNS Server "What is the IP for newtonschool.co" → "Try 99.83.190.102"; resolver replies to browser "It's 99.83.190.102". | KEY CONCEPT | Browser monitor (left) ↔ DNS Server (centre, labelled "ISP/Security product") with three branch arrows to Root, TLD, Authoritative servers stacked on right | No |
| 75 | Video streaming | Live streaming = watching events in real time (cricket, news, gaming); unlike buffered YouTube videos, live streams prioritize speed. Why use UDP? To send video packets quickly without delays. If some frames are lost they are skipped to avoid lag; goal = smooth, instant video flow. | KEY CONCEPT | None | No |
| 76 | Please fill the feedback form. | Filler. | none | Gradient | No |
| 77 | Thank You | End of deck p42–77. | none | None | No |
| 78 | (untitled – Multiplexing illustration) | Laptop apps: Music = Port 8000, Web = 80, Email = 25. Arrows: via cloud "Multiplexing" → Port 80 → Web Server; Port 25 → Email Server; → Music Streaming Server. "Port 8000" labelled on the upward arrow to the cloud. | ANALOGY | Woman at laptop with 3 app icons (♪ Port 8000, globe Web 80, envelope Email 25); cloud; three servers boxed on right (Web Server, Email Server, Music Streaming Server) | No |
| 79 | Demultiplexing | Separates incoming data at receiver's transport layer by checking the destination port number on each segment; ensures each segment is delivered to the correct application (e.g., browser, email client). Analogy: courier box → letter envelopes. | ANALOGY / KEY CONCEPT | Courier box → arrow → "letter envelope" (3 envelopes: white, red, brown) | No |
| 80 | Quick UDP Internet Connections(QUIC) | Diagram only (text of QUIC is on p92, outside range). | KEY CONCEPT | Client ⇄ Internet (cloud) → curved "Request" arrow to QUIC Server; a "UDP Connection" cylinder carrying 3 parallel dotted streams back toward client: stream 1 = packets 1,2,3; stream 2 = 4,5,6; stream 3 = 7,8 (independent streams in one UDP connection) | No |
| 81 | (untitled – Multiplexing illustration v2) | Variant of p78: cloud→laptop arrow labelled "Multplexing" [sic]; Port 80 → Web Server; Port 25 → "Music Server" [sic, should be Email]; → "Music Servor" [sic]. Apps: Port 8000 (music), Web 80, Email 25. | ANALOGY | Same scene as p78 with mislabelled servers | No |
| 82 | (untitled – Multiplexing / Demultiplexing) | Multiplexing: several app lines (HTTP, DNS, Other…) with port labels 80, 53, 22 merge into one thick arrow; Demultiplexing: arrow splits to HTTP, DNS, SSH, Other. | KEY CONCEPT | Monitor on left with ~6 coloured lines converging (funnel) into a blue arrow → bracket splitting to 4 labelled lines (HTTP, DNS, SSH, Other). Port labels are misaligned (80 sits between HTTP and DNS lines, 53 under DNS, 22 above Other; "SSH" missing on left) | No |
| 83 | Types of Port Numbers & Common Services | 3 ranges: Well-known 0–1023 (HTTP 80, HTTPS 443, FTP 21, DNS 53, SSH 22); Registered 1024–49151 (MySQL 3306, PostgreSQL 5432, Docker 2375); Dynamic/Private 49152–65535 (temporarily assigned by OS for client-side connections, e.g. when a browser initiates a connection). (List numbering shows "1." three times – formatting bug.) | KEY CONCEPT | None | No |
| 84 | Types of port numbers | Pyramid: Well-known (top) / Registered (middle) / Dynamic (base). | KEY CONCEPT | 3-tier triangle, smallest tier on top | No |
| 85 | Port Address Translation (PAT) | PAT = a specific type of NAT that allows multiple devices on a local/private network to share a single public IP address when accessing the internet. Instead of a separate public IP per device, PAT uses unique port numbers to track each connection → conserves public IPs, manages many connections efficiently. | KEY CONCEPT | None | No |
| 86 | (untitled – One-to-One NAT) | Static/one-to-one NAT example (contrast to PAT): 4 hosts 192.168.0.1–.4 → Switch → Router → Internet. NAT Translation table Inside Local IP → Inside Global IP: 192.168.0.1→200.200.200.1, .0.2→200.200.200.2, .0.3→200.200.200.3, .0.4→200.200.200.4. "One to One" arrow to Public IPs box (200.200.200.1–.4). | KEY CONCEPT | 4 PCs star-wired to switch, switch–router–Internet cloud; dashed "One to One" arrow; NAT translation table box | No |
| 87 | IP & Port Translation in PAT | PAT changes IP and also rewrites port numbers; each internal device gets unique combination of public IP (shared) + unique port number (per session) → many devices use one public IP without mix-ups. Mapping: 192.168.0.2:4567 → 203.0.113.5:62001; 192.168.0.3:4568 → 203.0.113.5:62002; 192.168.0.4 → 203.0.113.5 (ports cut off in figure). | KEY CONCEPT | "Home Network": Laptop 192.168.0.2, Mobile phone 192.168.0.3, Smart TV 192.168.0.4; laptop → router → "Public IP: 203.0.113.5" →; Mapping table Internal IP:Port → Public IP:Port | No |
| 88 | How PAT Enables Simultaneous Connections | Each outgoing request tagged with unique port number even if from same public IP; these port numbers act as IDs letting the router track multiple sessions from same or different internal devices; allows dozens or hundreds of devices to connect to different sites/services simultaneously via a single public IP. | KEY CONCEPT / TAKEAWAY | None | No |

## Worked examples & numericals (verbatim givens, steps and answers as shown; flag any arithmetic error you notice in the source)
- **p55 Substitution (shift) cipher exercise** — Given ciphertext: `Gztkliv rsyz srrbz yrz dviv ufjk`; shift unknown; brute force suggested. **No answer on the slide.** (Inventory-check only, derived by brute force, NOT in source: shifting back by 17 (equivalently forward by 9) gives `picture abhi baaki hai mere dost` — a Hindi film line, "the picture isn't over yet, my friend".)
- **p72 UDP header size** — 4 fields × 2 Bytes = UDP Header 8 Bytes; Length field = length in bytes of UDP segment including header. (Stated, no numerical problem.)
- **p83 port ranges** — 0–1023 / 1024–49151 / 49152–65535 (no calculation).
- **p87 PAT mapping** — 192.168.0.2:4567 → 203.0.113.5:62001; 192.168.0.3:4568 → 203.0.113.5:62002; 192.168.0.4 → 203.0.113.5 (port not shown).
- **p86 one-to-one NAT** — 192.168.0.x → 200.200.200.x for x = 1..4.
- Source issues noticed (not arithmetic): p51 date "Mon, 18 Dec 2024" — 18 Dec 2024 was a Wednesday; p51 header "Connection: Closed" (real header value is `close`); p54 example labelled "css" but is HTML; p59 "Tempering" typo for Tampering; p70 "Reciever" typo and the UDP "Request" arrow points Receiver→Sender; p81 "Multplexing", Port 25 labelled "Music Server", "Music Servor"; p82 port labels misaligned with protocol lines.

## Formulas stated
- UDP header = Source Port (2 B) + Destination Port (2 B) + Length (2 B) + Checksum (2 B) = 8 Bytes (p72).
- UDP Length field = total bytes of UDP segment including header (p72).
- TLS session key derived from {Pre-Master Secret, client_random, server_random} (p66) — stated as inputs, no explicit function.
- Port ranges: well-known 0–1023, registered 1024–49151, dynamic/private 49152–65535 (p83).
- HTTP status code = 3-digit code (p52).

## Diagrams that must be recreated (page → description: nodes, arrows, labels, field widths)
- **p42** Socket API stack: three stacked boxes "Application" → "Socket API" → "Transport Layer", downward double-chevron arrows between.
- **p44** HTTP transaction stages: Client (left), Server (right); four horizontal arrows top→bottom: "Connection" (→), "Request" (→), "Response" (←), "Close" (↔). Caption "Stages in an HTTP transaction".
- **p46** HTTP message structure: top box "HTTP Message"; below, two side-by-side boxes "Request Line" (under label Request) and "Status Line" (under label Response); then full-width "Headers"; then full-width "Body".
- **p47** HTTP request anatomy: container "Message request" with 4 stacked coloured bands — yellow `GET /index.html HTTP/1.1`; red `Host: example.com / User-Agent: Chrome / Accept-Language: en-us / ...`; grey blank (Empty Line); green `optional, e.g. form data, json`; left-side labels with arrows: Request Line, Headers, Empty Line, Body.
- **p51** HTTP response anatomy: container "Message Response": yellow `HTTP/1.1 201 Created`; red `Server: Apache/2.2.14 (Win32) / Date: Mon, 18 Dec 2024 10:25:30 GMT / Content-Length: 88 / Content-Type: application/json / Connection: Closed`; blank Empty Line; green JSON body `{ "message": "User successfully created", "user": { "id": 101, (More data) }}`; left labels Status Line, Headers, Empty Line, Body.
- **p57** MITM key substitution sequence (lifelines Alice | Mallory | Bob):
  1. Alice → Mallory: "Hi Bob, it's Alice. Give me your key."
  2. Mallory → Bob: "Hi Bob, it's Alice. Give me your key."
  3. Bob → Mallory: [Bob's key]
  4. Mallory → Alice: [Mallory's key]
  5. Alice → Mallory: "Meet me at the bus stop!" (encrypted w/ Mallory's key)
  6. Note on Mallory: Decrypt, read, modify to: "Meet me at the park!" Re-encrypt w/ Bob's key
  7. Mallory → Bob: "Meet me at the park!" (encrypted w/ Bob's key)
- **p58** MITM: User/Victim laptop (left) and Web Application globe (right) joined by green double arrow "ORIGINAL CONNECTION" ✓; Man in the Middle (centre) with red "NEW CONNECTION" arrows to both sides, each with ✗.
- **p59** Tampering: User (Role=User, Value "3") → HTTP Request → Target Application → HTTP Response → user; "Tempering HTTP Responses" box changes "JSON Response with (…"r":"3"…)" into "JSON Response with (…"r":"1"…)" delivered to user now shown as Role=admin, Value "1". Plus icons for Eavesdropping and Impersonation.
- **p62–67** TLS over TCP (Client lifeline left, Server lifeline right), three framed phases:
  - "Establish TCP Connection": SYN (C→S), SYN ACK (S→C), ACK box on client side (drawn on the return arrow).
  - "SSL/TLS Handshake": ClientHello (C→S); Server Hello + Certificate (S→C); "Certificate Verification" label on client; ClientKeyExchange ↔ Server Finished (double-headed arrow).
  - "Encrypted Application Data": HTTP GET ↔ HTTP Response.
- **p70** UDP vs TCP: UDP panel — Sender & Receiver lifelines, one "Request" arrow then three "Response" arrows, no handshake. TCP panel — SYN (S→R), SYN ACK (R→S), ACK (S→R) slanted arrows with dashed horizontal guides.
- **p72** UDP segment: 32-bit-wide box; row 1: source port # (16 b) | dest port # (16 b); row 2: length (16 b) | checksum (16 b); then "application data (payload)". Callouts: "length, in bytes of UDP segment, including header"; "data to/from application layer". Second version: four 2-Byte boxes (Source Port, Destination Port, Length, Checksum), brace "UDP Header 8 Bytes", Data box.
- **p74** DNS iterative resolution for newtonschool.co: Browser ⇄ DNS Server (ISP/Security product): "What is the IP for newtonschool.co?" / "It's 99.83.190.102". DNS Server ⇄ Root: "What is the name server for co?" / "Try 120.XX.XX.XX". DNS Server ⇄ TLD: "What is the authoritative DNS for newtonschool.co" / "Try 80.XX.XX.XX". DNS Server ⇄ Authoritative: "What is the IP for newtonschool.co" / "Try 99.83.190.102".
- **p78/p81** Multiplexing scene: laptop apps Music (Port 8000), Web (80), Email (25) → cloud "Multiplexing" → Port 80 Web Server, Port 25 Email Server, Music Streaming Server.
- **p79** Demultiplexing analogy: courier box → "letter envelope" ×3.
- **p80** QUIC: Client ⇄ Internet → "Request" arc → QUIC Server; "UDP Connection" tube containing 3 independent streams (1,2,3 | 4,5,6 | 7,8) flowing back to client.
- **p82** Mux/demux funnel: HTTP(80), DNS(53), SSH(22), Other lines merge into one arrow → split into HTTP, DNS, SSH, Other.
- **p84** Port pyramid: Well-known (top), Registered (middle), Dynamic (bottom).
- **p86** One-to-one NAT topology + table (192.168.0.1–4 ↔ 200.200.200.1–4), Switch → Router → Internet.
- **p87** PAT: Laptop 192.168.0.2, Mobile 192.168.0.3, Smart TV 192.168.0.4 → router → Public IP 203.0.113.5; mapping table Internal IP:Port → Public IP:Port (4567→62001, 4568→62002, .4→?).

## Code / CLI / config shown (verbatim)
- p47 / p48: `GET /index.html HTTP/1.1`
- p47 headers:
  ```
  Host: example.com
  User-Agent: Chrome
  Accept-Language: en-us
  ...
  ```
- p50 (POST body): `{ "username": "user1", "password": "password123" }`
- p51 response:
  ```
  HTTP/1.1 201 Created
  Server: Apache/2.2.14 (Win32)
  Date: Mon, 18 Dec 2024 10:25:30 GMT
  Content-Length: 88
  Content-Type: application/json
  Connection: Closed

  {
    "message": "User successfully created",
    "user": {
      "id": 101,
      (More data)
  }}
  ```
- p52: `HTTP/1.1 200 OK`
- p54: `<html><body><h1>Welcome to Example.com</h1></body></html>`
- p55 ciphertext: `Gztkliv rsyz srrbz yrz dviv ufjk`
- p68 "python client TLS exercises" and p73 "UDP chat using nc" are demo dividers only — **no code or commands shown**.

## In-class questions / quiz prompts shown on slides (verbatim, with answers if given)
- p55: "Find out what the concealed message says, the shift by number is not known, you just have the text — Gztkliv rsyz srrbz yrz dviv ufjk — Do it without using LLMs, online tools are game! Simple python brute force script would be game as well!" — no answer given on slide (derived: shift 17 → "picture abhi baaki hai mere dost").
- p71 (rhetorical, cartoon): "Are you getting all of this?" / "Who cares just sent it faster!"
- p68 / p73: practical exercises announced (Python TLS client; UDP chat with nc) without details.

## Unclear / unreadable (page → what is unreadable and why)
- p60: comic text is small but legible at 180 dpi; fully read. Nothing unreadable.
- p82: a stray partial glyph ("/ ‹ ·") under the bottom line — artefact of AI-generated image, no meaning.
- p87: Smart TV row of mapping table has no internal/public port (cropped/missing in the source figure).
- p70: UDP panel arrow direction for "Request" (Receiver→Sender) is likely a source-figure error rather than intentional.
- No handwritten whiteboard pages in this range, so no illegible ink.

## Duplicate / overlap notes (pages that repeat other decks or earlier pages)
- p41 "Thanks for watching!" = same as p14.
- p42–54 are verbatim repeats of p15–27 (Socket API, Application Layer Protocols, HTTP stages, stateless HTTP, HTTP message/request/response breakdown).
- p55–88 are verbatim repeats of p98–131 (the later deck which additionally has Caesar-cipher intro slides p96–97 before the substitution-cipher exercise, plus TCP/HTTPS recap p94–95).
- p74 DNS diagram overlaps DNS lookup content of p7–8 and p28–29 (www.amazon.com example) — different example (newtonschool.co) but same root→TLD→authoritative flow.
- p76/p77 feedback/thank-you fillers duplicate p13/p40/p119/p120.
- p78 and p81 are two variants of the same multiplexing illustration (p81 has label errors).
- p80 QUIC diagram pairs with QUIC text on p92 (outside range) and duplicates p123/p135.
- p62–67 reuse the identical TLS sequence diagram on every slide.

## Topic list (flat bullet list of every distinct topic/subtopic covered, in order)
- Socket API as interface between application and transport layer (TCP/UDP)
- Application layer protocols: HTTP, HTTPS, HTTP/2
- Stages of an HTTP transaction: connection, request, response, close
- HTTP is stateless and runs over TCP
- HTTP message structure: request line / status line, headers, empty line, optional body
- HTTP request line: method (GET/POST/PUT/DELETE), URL, version (HTTP/1.1, HTTP/2)
- HTTP request headers: User-Agent, Host, Content-Type, Accept
- HTTP request body (POST/PUT/PATCH, JSON/form data)
- HTTP response status line: version, 3-digit status code (200/404/500, 201 Created), status message
- HTTP response headers: Content-Type, Content-Length, Server, Date (also Connection)
- HTTP response body (HTML/JSON/image)
- Substitution / shift (Caesar) cipher brute-force exercise
- Alice, Bob & Mallory cryptographic characters
- Man-in-the-middle attack and key-substitution attack sequence
- Threats when communicating in public: tampering, eavesdropping, impersonation (HTTP response tampering for privilege escalation)
- TLS over TCP: TCP 3-way handshake then TLS handshake then encrypted application data
- TLS step 1 ClientHello (TLS versions, cipher suites, client_random, server name)
- TLS step 2 ServerHello (chosen version, cipher suite, server_random, certificate)
- TLS step 3 certificate verification (CA trust, hostname, expiry/revocation)
- TLS step 4 pre-master secret encrypted with server public key
- TLS step 5 key derivation of symmetric session key
- TLS step 6 Finished messages
- Python TLS client exercise (demo)
- UDP protocol: speed vs reliability trade-off vs TCP handshake
- UDP "fire and forget" (no acknowledgement)
- UDP segment format: 4 × 16-bit fields, 8-byte header, length includes header
- UDP chat using netcat (demo)
- DNS iterative resolution: resolver → root → TLD → authoritative (newtonschool.co → 99.83.190.102)
- Video/live streaming over UDP (skip lost frames)
- Transport-layer multiplexing (app ports 8000/80/25)
- Demultiplexing by destination port (courier box → envelopes analogy)
- QUIC: multiple independent streams over one UDP connection
- Port number ranges: well-known 0–1023, registered 1024–49151, dynamic/private 49152–65535, with example services/ports
- NAT one-to-one (static) translation table
- Port Address Translation (PAT / NAT overload): sharing one public IP via unique ports
- PAT IP:port mapping table and simultaneous connections
