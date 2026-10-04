# WB-L05 pages 1-44 — Application Layer: Architecture, Protocols and APIs. (CSAI321: Computer Networks, Newton School of Technology; PDF metadata title "Application Layer: Protocols, Architecture models and APIs.", author Kuldeep Jha)

> **FILENAME MISMATCH WARNING:** The PDF is named "L05 - 2026-08-24 - Network Topologies, Cloud Networking, Application Layer.pdf", but it contains **no** network-topology content (no star/mesh/bus/ring and no link-count formulas) and **no** AWS/cloud content (no Region, AZ, Edge or VPC). It covers only Application Layer, HTTP, HTTP versions and REST/OpenAPI. The topology and cloud content (star, mesh, hybrid, edge servers/CDN) is in **WB-L04** (extracted/WB-L04.txt, "Topologies and the Cloud", around text lines 137-215). The deck also has **no RTT numericals** and **no persistent vs non-persistent RTT calculation**.
>
> **No handwriting:** this is a clean Canva slide export. I looked at all 44 page images and found no handwritten annotations, no whiteboard drawings and no worked numericals.

## Page table
| Page | Section/slide title | Content summary (exact facts, numbers, definitions, lists — be specific, not vague) | Callout type | Diagram/figure on page (describe so it can be redrawn) | Handwriting present? |
|---|---|---|---|---|---|
| 1 | Title: "Application Layer: Architecture, Protocols and APIs." | Course "CSAI321:Computer Networks"; Newton School of Technology logo | none | Decorative network-mesh triangle graphic | No |
| 2 | Join the lecture online on your dashboard | Filler | none | none | No |
| 3 | Lecture Roadmap | Network Architectures; Application Layer; HTTP - The Web's Language; HTTP Methods Overview; The Evolution of HTTP; Head-of-Line (HoL) Blocking; HTTP2.0 and HTTP3.0; REST Principles | none | none | No |
| 4 | Network architecture (section divider) | Divider only | none | none | No |
| 5 | Network architecture — Client/Server | "Client/Server: Centralized architecture where powerful servers store data and process requests for multiple dependent clients." | KEY CONCEPT | "Client-Server Architecture": a central database/server cylinder with 6 laptops around it, each joined to the centre by one line (star-like) | No |
| 6 | Network architecture — P2P | "Peer-to-Peer (P2P): Decentralized model where all devices ("peers") act as both clients and servers with equal privileges" | KEY CONCEPT | "Peer-to-Peer (P2P) Architecture": 4 laptops at the corners of a square, all 6 pairs joined (4 sides + 2 diagonals), i.e. a full mesh of 4. No formula is stated. | No |
| 7 | (untitled) Client ↔ Server | Question: "How do these systems actually talk to each other over the network?" | QUIZ (discussion prompt) | Client monitor (left) and Server rack with cloud (right); dashed arrows: "Request" →, ← "Response", "Connection" (dashed line, no arrowhead) | No |
| 8 | Recap — The 7 Layers of OSI | Layer list: Application (L7), Presentation (L6), Session (L5), Transport (L4), Network (L3), Data Link (L2), Physical (L1) | none | Stacked pyramid of 7 coloured bars. Blue "Transmit Data" arrow goes down the left side, then a "Physical Link" arrow runs along the bottom to the right, and an orange "Receive Data" arrow goes up the right side | No |
| 9 | The Application Layer (divider) | Divider | none | none | No |
| 10 | The Application Layer | "The Application Layer (Layer 7) is direct interface between software programs (web browsers and email clients) and the underlying network, interpreting user commands and enabling data exchange across systems." | KEY CONCEPT | Blue 3D box "APPLICATION LAYER 7" ← "Request content" from Website icon; "Return content in required format" → to Website | No |
| 11 | The Application Layer Protocols | Sign lists: HTTP, HTTPS, FTP, NFS, FMTP, DHCP, SNMP, TELNET, POP3, IRC, NNTP. Mapping: File Transfer→FTP; Web Surfing→HTTP/S; Emails→SMTP; Virtual Terminals→Telnet | none | Cartoon man holding a sign of protocols; 4 columns of icons (Chrome/Firefox, Outlook/Skype, laptop, devices) with their use and protocol labels. Note: the icon/label alignment is loose (Chrome/Firefox sits above "File Transfer" and Outlook/Skype above "Web Surfing") | No |
| 12 | HTTP: The Web's Language (divider) | Divider | none | none | No |
| 13 | HTTP - The Web's Language | "HTTP is a stateless request–response protocol." Client (browser) sends a REQUEST to a server; server processes and sends back a RESPONSE; each exchange is independent, and the server remembers nothing between requests | KEY CONCEPT | Stock image of "http://" | No |
| 14 | Breakdown of HTTP Requests | Messages include a request/response line, headers, and optionally a body | none | Box "HTTP Request" containing 3 stacked boxes: Request Line / Headers / Body | No |
| 15 | HTTP Requests Breakdown: (Request message) | Example request: `GET /index.html HTTP/1.1`, `Host: example.com`, `User-Agent: Chrome`, `Accept-Language: en-us`, then an empty line, then Body "optional, e.g. form data, json for POST, PUT reqs" | KEY CONCEPT | Labelled message box: yellow Request Line, red-orange Headers, grey Empty Line, green Body; arrows from the left-hand labels | No |
| 16 | HTTP Requests Breakdown: Request Line | The request line has 3 parts. Method = the type of operation (e.g. GET, POST, PUT, DELETE). URL = the resource/endpoint (e.g. /index.html, /api/data). HTTP Version (e.g. HTTP/1.1 or HTTP/2). Example: `GET /index.html HTTP/1.1` | KEY CONCEPT | none | No |
| 17 | HTTP Requests Breakdown: Headers | Headers give extra information about the request or the client's capabilities. Common headers: User-Agent (client software: browser, app); Host (domain name of server); Content-Type (type of data the client is sending, for POST or PUT); Accept (types the client can process, e.g. text/html, application/json) | none | none | No |
| 18 | HTTP Requests Breakdown: Body (optional) | Body = the actual data sent by the client (form data, JSON payload). Included only for certain methods such as POST, PUT or PATCH. Example POST body: `{ "username": "user1", "password": "password123" }` | none | none | No |
| 19 | Breakdown of HTTP Responses | Same structure statement as p14 | none | Box "HTTP Response" containing Status Line / Headers / Body | No |
| 20 | HTTP Responses Breakdown: (Response message) | `HTTP/1.1 200 OK`; `Content-Type: text/html`; `Content-Length: 88`; `Server: Apache/2.4.2`; empty line; body `<html><body><h1>Welcome to Example.com</h1></body></html>` | KEY CONCEPT | Same colour-coded layout as p15 (Status Line / Headers / Empty Line / Body) | No |
| 21 | HTTP Status codes: | 200 OK = request successful, server returned the resource. 301 Moved Permanently = resource moved permanently to a new URL. 302 Found = temporary redirection to another URL. 403 Forbidden = server understood but refuses to authorize. 404 Not Found = server can't find the resource. 500 Internal Server Error. Classes: 1XX Informational, 2XX Success, 3XX Redirection, 4XX Client Error, 5XX Server Error | KEY CONCEPT | Stacked coloured cubes labelled 1XX (green) INFORMATIONAL, 2XX (yellow) SUCCESS, 3XX (red) REDIRECTION, 4XX (teal) CLIENT ERROR, 5XX (maroon) SERVER ERROR | No |
| 22 | HTTP Responses Breakdown: Status Line | The status line consists of: HTTP Version; Status Code (3-digit, e.g. 200, 404, 500); Status Message (short description, e.g. OK, Not Found, Internal Server Error). Example `HTTP/1.1 200 OK` | KEY CONCEPT | none | No |
| 23 | HTTP Response Message Breakdown: Headers | Response headers = metadata about the response. Common: Content-Type (type of body data, e.g. text/html, application/json); Content-Length (length of body in bytes); Server (server software info); Date (date/time the response was sent). Footnote: "Same goes with the BODY for the response. It is similar to request BODY" | none | none | No |
| 24 | (prompt) | "If HTTP is stateless, how does your shopping cart stay full?" Answer: "Cookies & Session tokens!" | QUIZ | none | No |
| 25 | HTTP Generations (divider) | "The transition from HTTP/1.0 to HTTP/3" | none | none | No |
| 26 | The Online Shopping Delivery Problem | Analogy: order a male outfit (Shirt, Pants, Shoes, Socks) = HTML, CSS, JS and Images requested from the server | ANALOGY | Outfit photo; "HTML files + CSS file(s) + images + JavaScript, PHP, SQL, JSON..." | No |
| 27 | (prompt) | "How you perfer to have its delivery?" / "Our perfrence is answer to the why of HTTP versions." (typos in source) | QUIZ (discussion) | none | No |
| 28 | Meet – HTTP/1.0 (1996) | Analogy: a truck carries only one item per trip and must return to HQ before the next one. Carries one request at a time; every file (HTML, image, CSS) needs a new connection; no persistent TCP connection; slow, repetitive, inefficient. Quote "I deliver one file at a time. It can get tiring!" | ANALOGY | Timing diagram "HTTP/1.0 Separate Connections": client (phone) and server (computer) vertical timelines, time arrow down. Three separate open-circle/closed-dot connection segments, each with one request arrow → and one response arrow ← (blue, teal, orange). Tired stick figure | No |
| 29 | Meet – HTTP/1.1 (1997) | Analogy "The One-Truck Convoy (Keep-Alive)": the truck arrives with all 4 items but unloads them one by one. Introduced: Keep-Alive connections; Caching and Host Headers. Improved performance but had head-of-line blocking. Link https://captive.apple.com | ANALOGY | Timing diagram "HTTP/1.1 Persistent Connections, Request Queuing": one connection (single open circle at top, dot at bottom) with 3 sequential request→/←response pairs (blue, teal, orange). Image of people standing in a queue | No |
| 30 | Meet – HTTP/1.1 (1997) — HoL illustration | "ONE CONNECTION · responses must exit in order (FIFO) →": [slow image ⏳][CSS][JS][icon], with "← all blocked, even though they're ready" | KEY CONCEPT (HoL blocking) | Horizontal queue of 4 boxes; the first (red, "slow image ⏳") blocks the 3 grey boxes behind it | No |
| 31 | HTTP/1.1 Pipelining (optional) | Responses must arrive in the same order as requests (FIFO – First In, First Out). Only safe methods can be pipelined (GET, HEAD, OPTIONS). No POST/PUT, because these might have side effects (they alter the state of the destination). Quote: "Multiple requests can be made without waiting for response for previous request" | KEY CONCEPT | Timing diagram "HTTP/1.1 Pipelining, Response Queuing, Head-of-line blocking": 3 requests sent back-to-back (blue, teal, orange) on one connection, then 3 responses returned in the same order. FIFO icon | No |
| 32 | Meet – HTTP/2 (2015) | Analogy: instead of serving the meal one item at a time, serve the entire tray and you choose. HTTP/2 = second major version, aimed at better data-transfer performance; improves on HTTP/1.1 limitations, especially performance. Link en.wikipedia.org/wiki/HTTP_pipelining | ANALOGY | Two panels: "HTTP/1.1" waiter hands carry 4 separate plates (wine, sandwich, cupcake, coffee); "HTTP/2" one tray with all 4: "Better resource utilization and faster response" | No |
| 33 | HTTP/2 | "Binary Protocol \| Multiplexing \| Server Push". Link manningbooks.medium.com/http-1-1-vs-http-2-vs-http-2-with-push-91f7d497ddbe | none | Screenshot of an animation "HTTP/2 with Push": Client (Web Browser) box holds "Request 1 GET /index.html" ↔ vertical "HTTP/2 Framing Layer"; a pipe in the middle; Server (Web Server) box; caption "0.2 seconds" | No |
| 34 | HTTP/2 Solutions | HTTP/2 features: uses a single TCP connection. Binary Protocol: binary format for message encoding, unlike text-based HTTP; "That is the framing layer." Multiplexing: simultaneous requests and responses over one connection. Server Push: servers send resources proactively without explicit requests | KEY CONCEPT | Cartoon delivery rider (decorative) | No |
| 35 | What if a service like this? | Analogy: you order 3 items at a restaurant; the entire staff serves only you, and each item has its own kitchen window and dedicated staff | ANALOGY | Two-panel cartoon. Left: "Single Narrow Kitchen Door (TCP)", red X on door, "Soup Spilled" at the door, "Burger, Ice Cream" waiters "Blocked and Waiting", "Delayed Delivery". Right: "3 Separate, Independent Windows (QUIC)", "Soup spills (one to Burger & Ice Cream Deliver immediately", "Fast Delivery" | No |
| 36 | HTTP/3 using QUIC (June 2022) | Latest version of HTTP. Built on QUIC, a UDP-based transport protocol (instead of TCP), developed by Google. Multiplexed streams without blocking. Designed to solve head-of-line blocking. Source cloudflare.com | KEY CONCEPT | (a) HTTP 1.1 browser ↔ "3 TCP Connections" box (jquery.js, example.css, image.png each on its own connection) ↔ server. (b) HTTP/2 browser ↔ "1 TCP Connection" carrying all 3 ↔ server. (c) QUIC Client → "UDP Connection" tube with 3 streams of numbered packets (1,2,3 red; 4,5,6 green; 7,8 purple) → QUIC Server | No |
| 37 | HTTP/3 using QUIC (June 2022) — demo | Screenshot of cloudflare.com/en-gb/ with Chrome DevTools Network tab; the Protocol column shows mostly "h3" (some "h2"); status 200; footer "250 requests, 4.6 MB transferred, 12.3 MB resources, Finish 33.65 s, DOMContentLoaded 1.99 s, Load 2.38 s" | DEMO | Browser + DevTools screenshot (how to check the protocol: DevTools → Network → Protocol column) | No |
| 38 | HTTP/3 using QUIC (June 2022) — stack comparison | HTTP/2 stack: HTTP/2 (with Multistreaming) at Application / TLS at "Security" / TCP (with Stream Abstraction) at Transport / IP at Network. HTTP/3 stack: HTTP/3 at Application; QUIC block spanning Application to Transport containing Multistreaming, TLS, Stream Abstraction; UDP at Transport; IP at Network | KEY CONCEPT | Layered block diagram with dashed horizontal layer separators, rows Application / "Security" / Transport / Network. Left column: HTTP/2 box ⊃ Multistreaming; TLS; TCP box ⊃ Stream Abstraction. Right column: HTTP/3; QUIC box ⊃ Multistreaming, TLS, Stream Abstraction; UDP. Shared IP bar across both. Credit "SEC Consult" | No |
| 39 | Transition | HTTP/1.1: "6 separate TCP connections to fake parallelism"; "Costly: 6× setup, 6× overhead". HTTP/2: "Many streams multiplexed on one TCP connection"; "1 lost TCP segment → all streams stall"; "App-level HoL fixed — TCP-level remains". HTTP/3: "streams QUIC over UDP — truly independent"; "only this one waits"; "Loss is isolated to its own stream" | TAKEAWAY | Dark 3-column card. Col 1 (HTTP/1.1): 6 parallel bars = 6 connections. Col 2 (HTTP/2): one wide box (one TCP conn) with a red dot = lost segment, all stall. Col 3 (HTTP/3): 4 bars (streams), only one bar with a red dot is highlighted, "only this one waits" | No |
| 40 | (prompt) | "We understand the Client-Server model, where a browser requests a page from a server, But what happens when Application need to communicate with another Applications?" | QUIZ (transition) | none | No |
| 41 | REST APIs | "A Q4 2024 analysis estimating 83% of all public APIs use REST architecture". Typical HTTP verbs: GET → Read from Database; PUT → Update/Replace row in Database; PATCH → Update/Modify row in Database; POST → Create a new record in the database; DELETE → Delete from the database | KEY CONCEPT | Hand-drawn style (printed, part of the image) "Rest API Basics": 3 stick-figure CLIENTS send "HTTP GET /allUsers", "HTTP POST /newUser", "HTTP PATCH /updateUser" → box "Rest API: Recieves HTTP requests from Clients and does whatever request needs. i.e create users" ↔ Database cylinder ("Our Rest API queries the database for what it needs"). "Response: When the Rest API has what it needs, it sends back a response to the clients. This would typically be in JSON or XML format." "Our Clients, send HTTP Requests and wait for responses" | No (the sketch is part of the printed image, not lecturer handwriting) |
| 42 | Why use OpenAPI? | API Producer "Defines & Publishes" → OpenAPI Contract ← "Consume & Validate Against" ← API Consumers (Frontend Developers, AI Agents & LLMs, Third-Party Developers, API Testing Tools). Link https://petstore3.swagger.io | DEMO (Swagger petstore link) | Producer → OpenAPI logo ← oval containing 4 consumer types | No |
| 43 | Please fill the feedback form. | Filler | none | none | No |
| 44 | Thanks for watching! | Filler | none | none | No |

## Worked examples & numericals (verbatim givens, steps and answers as shown; flag any arithmetic error you notice in the source)
- **None.** The deck has no numericals: no RTT calculation, no persistent vs non-persistent timing formula and no link-count formula.
- Numbers that appear on slides:
  - p33: "0.2 seconds" (animation caption, HTTP/2 with push).
  - p37: DevTools footer "250 requests, 4.6 MB transferred, 12.3 MB resources, Finish 33.65 s, DOMContentLoaded 1.99 s, Load 2.38 s".
  - p39: "6 separate TCP connections", "6× setup, 6× overhead".
  - p41: "83% of all public APIs use REST" (Q4 2024).
- **Possible inconsistency (p20):** the header says `Content-Length: 88`, but the body shown, `<html><body><h1>Welcome to Example.com</h1></body></html>`, is **57 bytes** (or about 58 with a trailing newline). The value is illustrative; do not use it as a worked example without correcting it.

## Formulas stated
- None. For context only (not in the source): p6 draws a full mesh of 4 peers with 6 links, which matches n(n-1)/2, but the slide never states that formula.

## Diagrams that must be recreated (page → description: nodes, arrows, labels, field widths)
- **p5** Client-Server: a central server/DB node with 6 client laptops, each joined to the centre by a single line.
- **p6** P2P: 4 peers in a square, fully connected (4 edges + 2 diagonals = 6 links).
- **p7** Client ↔ Server: three dashed lines labelled Request (→ server), Response (← client), Connection.
- **p8** OSI 7-layer stack with Transmit Data down the left, Physical Link along the bottom, Receive Data up the right.
- **p10** Application Layer (7) box ↔ Website: "Request content" / "Return content in required format".
- **p14/p19** Message structure boxes: HTTP Request = Request Line / Headers / Body; HTTP Response = Status Line / Headers / Body.
- **p15** Annotated request message: Request Line `GET /index.html HTTP/1.1`; Headers `Host: example.com`, `User-Agent: Chrome`, `Accept-Language: en-us`; Empty Line; Body (optional; form data/JSON for POST, PUT).
- **p20** Annotated response message: `HTTP/1.1 200 OK`; `Content-Type: text/html`, `Content-Length: 88`, `Server: Apache/2.4.2`; Empty Line; HTML body.
- **p21** Status class ladder: 1XX Informational / 2XX Success / 3XX Redirection / 4XX Client Error / 5XX Server Error.
- **p28** HTTP/1.0 timing diagram: client and server timelines; 3 separate connections, each opened (circle), carrying one request→response, then closed (dot).
- **p29** HTTP/1.1 persistent timing diagram: one connection, 3 sequential request→response pairs.
- **p30** HoL queue: [slow image ⏳][CSS][JS][icon] on ONE CONNECTION, FIFO, "all blocked, even though they're ready".
- **p31** HTTP/1.1 pipelining timing diagram: 3 requests sent back-to-back without waiting, then 3 responses in the same (FIFO) order.
- **p32** Waiter analogy: HTTP/1.1 one plate at a time vs HTTP/2 whole tray.
- **p33** HTTP/2 framing layer: client request "GET /index.html" → HTTP/2 Framing Layer → single pipe → server.
- **p35** Restaurant analogy: a single narrow kitchen door (TCP) where spilled soup blocks the burger and ice cream, vs 3 independent windows (QUIC) where only the soup is delayed.
- **p36** Three panels: HTTP/1.1 = 3 TCP connections (jquery.js, example.css, image.png); HTTP/2 = 1 TCP connection carrying all 3; QUIC client → UDP connection with 3 independent packet streams (1-2-3, 4-5-6, 7-8) → QUIC server.
- **p38** Protocol stacks: HTTP/2 over TLS over TCP over IP, vs HTTP/3 over QUIC (containing Multistreaming + TLS + Stream Abstraction) over UDP over IP, with rows Application / "Security" / Transport / Network.
- **p39** Three-column HoL comparison (HTTP/1.1: 6 connections; HTTP/2: 1 TCP, one loss stalls all; HTTP/3: per-stream loss isolation).
- **p41** REST API basics: clients (GET /allUsers, POST /newUser, PATCH /updateUser) → Rest API → Database, with the verb→CRUD mapping list.
- **p42** OpenAPI: Producer → Contract ← Consumers (Frontend devs, AI Agents & LLMs, Third-party devs, API testing tools).

## Code / CLI / config shown (verbatim)
```
GET /index.html HTTP/1.1
Host: example.com
User-Agent: Chrome
Accept-Language: en-us
...
```
```
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 88
Server: Apache/2.4.2
...

<html><body><h1>Welcome to Example.com</h1></body></html>
```
POST body example (p18):
```
{ "username": "user1", "password": "password123" }
```
REST verb list (p41, verbatim from image):
```
Typical HTTP Verbs:
GET -> Read from Database
PUT -> Update/Replace row in Database
PATCH -> Update/Modify row in Database
POST -> Create a new record in the database
DELETE -> Delete from the database
```
Endpoints on p41: `HTTP GET /allUsers`, `HTTP POST /newUser`, `HTTP PATCH /updateUser`.
URLs: https://captive.apple.com (p29, a plain-HTTP test page); en.wikipedia.org/wiki/HTTP_pipelining (p32); manningbooks.medium.com/http-1-1-vs-http-2-vs-http-2-with-push-91f7d497ddbe (p33); cloudflare.com (p36-37); https://petstore3.swagger.io (p42).

## In-class questions / quiz prompts shown on slides (verbatim, with answers if given)
- p7: "How do these systems actually talk to each other over the network?" (no answer given; leads into the Application Layer)
- p24: "If HTTP is stateless, how does your shopping cart stay full?" Answer: "Cookies & Session tokens!"
- p27: "How you perfer to have its delivery?" / "Our perfrence is answer to the why of HTTP versions."
- p35: "What if a service like this?" (restaurant analogy for QUIC)
- p40: "We understand the Client-Server model, where a browser requests a page from a server, But what happens when Application need to communicate with another Applications?" (answer implied: APIs/REST)

## Unclear / unreadable (page → what is unreadable and why)
- p37: the per-row DevTools details (file names, sizes, times) are tiny at native resolution. The key point, Protocol column = h3/h2, is readable; individual rows don't matter.
- p33: the animation screenshot is a single frame, so the middle pipe is blurred and no packet labels are visible.
- p11: the icons don't line up cleanly with the use-case labels; take the protocol↔use pairs from the text labels (FTP-File Transfer, HTTP/S-Web Surfing, SMTP-Emails, Telnet-Virtual Terminals).

## Duplicate / overlap notes (pages that repeat other decks or earlier pages)
- p8 OSI recap repeats the WB-L03 OSI Model content.
- p14 and p19 are structural twins (request vs response); p15 and p20 are twins.
- p29 and p30 share the title "Meet – HTTP/1.1 (1997)"; p36, p37 and p38 share "HTTP/3 using QUIC (June 2022)".
- p38 (HTTP/2 vs HTTP/3 stack) and the p28 HTTP/1.0 timing diagram are reused on WB-L06 p4 (Recap).
- REST/OpenAPI (p41-42) likely overlaps WB-L07 ("REST API(s), ...") per its filename.
- The roadmap (p3) lists "HTTP Methods Overview" and "REST Principles", but there is no dedicated methods slide. Methods appear only incidentally: p16 (GET, POST, PUT, DELETE), p18 (POST, PUT, PATCH have a body), p31 (safe methods GET, HEAD, OPTIONS) and p41 (verb→CRUD mapping).
- Topologies and AWS cloud content are **not** in this deck despite the filename; they are in WB-L04.

## Topic list (flat bullet list of every distinct topic/subtopic covered, in order)
- Network architectures: Client/Server (centralized)
- Network architectures: Peer-to-Peer (decentralized, peers are both client and server)
- Client–server request/response/connection
- OSI 7-layer recap
- Application Layer (Layer 7) definition
- Application layer protocols: HTTP, HTTPS, FTP, NFS, FMTP, DHCP, SNMP, TELNET, POP3, IRC, NNTP, SMTP; use-case mapping
- HTTP as a stateless request–response protocol
- HTTP request structure: request line, headers, empty line, optional body
- Request line parts: method, URL, HTTP version
- Common request headers: User-Agent, Host, Content-Type, Accept (plus Accept-Language in the example)
- Request body: for POST/PUT/PATCH; JSON example
- HTTP response structure: status line, headers, empty line, body
- Status codes: 200, 301, 302, 403, 404, 500; classes 1xx-5xx
- Status line parts: version, 3-digit code, message
- Common response headers: Content-Type, Content-Length, Server, Date
- Statelessness and cookies/session tokens
- HTTP generations analogy (online shopping delivery)
- HTTP/1.0 (1996): one request per connection, non-persistent TCP
- HTTP/1.1 (1997): keep-alive persistent connections, caching, Host header, HoL blocking
- Head-of-line blocking (FIFO; slow first response blocks the rest)
- HTTP/1.1 pipelining: FIFO responses, safe methods only (GET, HEAD, OPTIONS), no POST/PUT
- HTTP/2 (2015): single TCP connection, binary framing layer, multiplexing, server push
- HTTP/3 over QUIC (June 2022): UDP-based, from Google, independent streams, solves HoL
- Checking the protocol (h2/h3) in browser DevTools (Cloudflare demo)
- Protocol stack: HTTP/2/TLS/TCP/IP vs HTTP/3/QUIC(TLS inside)/UDP/IP
- HoL comparison: HTTP/1.1 uses 6 parallel TCP connections; HTTP/2 fixes app-level HoL but TCP-level HoL remains; HTTP/3 isolates loss per stream
- App-to-app communication and APIs
- REST APIs: 83% of public APIs; verb→CRUD mapping; JSON/XML responses
- OpenAPI contract: producer/consumers; Swagger Petstore demo
