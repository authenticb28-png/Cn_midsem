# WB-L08 pages 1–40 — DNS : The Internet's Phone Book, and AWS Route 53

> **FILENAME MISMATCH WARNING:** The PDF is named "L08 - 2026-09-02 - Email Protocols, Application Services, Cryptography.pdf" (135 pages; PDF metadata Title = "DNS : The Internet's Phone Book, and AWS Route 53"). Within pages 1–40 there is **no** email-protocol, cryptography, TLS handshake, certificate/CA, MITM, ACM, REST-specific, or Route 53 routing-policy content. Route 53 appears only as "Demo: create DNS records in AWS Route 53" title slides (pp.12, 32) with no slide content. No handwriting/annotations on any page in this range — all are clean Canva slides.
>
> **Deck/segment boundaries within pp.1–40** (printed slide numbers = PDF page numbers throughout, i.e. one continuous Canva export with appended segments):
> - **Segment A — DNS & Route 53 deck: pp.1–14** (title p1 → feedback p13 → "Thanks for watching" p14).
> - **Segment B — HTTP recap (Socket API, HTTP messages): pp.15–27** (no title slide; reused material).
> - **Segment C — DNS repeat: pp.28–32** (near-verbatim repeat of pp.7–12; p31 uses a different Local DNS diagram than p11).
> - **Segment D — APIs intro: pp.33–39**, then feedback p40. Segment ends with "Thanks for watching!" at p41 (outside range). p42 restarts with "Socket API as an Interface…" (repeat of p15) — next range begins a new appended segment.

## Page table
| Page | Section/slide title | Content summary (exact facts, numbers, definitions, lists — be specific, not vague) | Callout type | Diagram/figure on page (describe so it can be redrawn) | Handwriting present? |
|---|---|---|---|---|---|
| 1 | Title: "DNS : The Internet's Phone Book, and AWS Route 53" | CSAI321: Computer Networks; Newton School of Technology | none | Decorative Canva network triangle | No |
| 2 | "Join the lecture online on your dashboard" | Filler | none | none | No |
| 3 | Recap | Two recap themes: "Secure the connection" and "Efficent [sic] Communication methods (Caching)" | none (recap) | Left: protocol stack comparison. HTTP/2 stack: Application = HTTP/2 (with Multistreaming) / "Security" = TLS / Transport = Stream Abstraction + TCP / Network = IP. HTTP/3 stack: HTTP/3 on top; QUIC block spanning Multistreaming + TLS + Stream Abstraction; Transport = UDP; Network = IP (shared). Right: Cache-Control diagram (Request foobar.css; response `Cache-Control: max-age=3600`; Browser Cache store/retrieve, 3600s) | No |
| 4 | "But How to reach a server?" | Domain Name? ❌ ; Address of server? ✅ (you need the server's address, not just the name) | QUIZ (rhetorical) | none | No |
| 5 | What is The address of server? | "Lets Understand DNS". Analogy: DNS Records as Justdial Listings. A business listing on Justdial typically shows: Address / Location; Operating Hours; Services Offered; Contact Numbers | ANALOGY | Screenshot of Justdial listing "Hawai Adda", 4.1★, 8,563 Rating, Claimed, Murthal, Sonepat, Open 24 Hrs, Show Number / WhatsApp buttons, tabs Overview/Menu/Quick Info | No |
| 6 | What is The address of server? | A DNS records provide: IP Address (A / AAAA Record) – like the shop's address; Mail Exchange (MX Record) – like the shop's phone number for calls; Name Servers (NS Record); Optional Records (TXT, CNAME, etc.) | KEY CONCEPT / ANALOGY | Screenshot of DNS zone table (Cloudflare-style) — columns Type, Name, Content, TTL, Proxy status — see "Code/CLI/config" for verbatim rows | No |
| 7 | Domain Name System (DNS) — "A Distributed, Hierarchical Database" | DNS scales by using many servers worldwide; organized in a hierarchical structure; no single server holds all mappings; three main classes of DNS servers: Root DNS servers, Top-Level Domain (TLD) DNS servers, Authoritative DNS servers | KEY CONCEPT | Photo of sticker "_0_ DAYS SINCE IT WAS DNS (It's always DNS)" | No |
| 8 | How DNS Lookup Works — Example: www.amazon.com | 1. Client contacts Root DNS server → returns IP addresses of TLD servers (.com). 2. Client contacts TLD server (.com) → returns IP of authoritative server (amazon.com). 3. Client contacts authoritative server (amazon.com) → returns IP of www.amazon.com | KEY CONCEPT | Hand-drawn-style tree: "Root DNS servers" → three children "com DNS servers", "org DNS servers", "co DNS servers"; com → "google.com DNS Servers", "amazon.com DNS Servers"; org → "wikipedia.org DNS Servers"; co → "newtonschool.co DNS Servers", "huggingface.co DNS Servers" | No |
| 9 | "Demo: Lets do NSlookup for Google.com" | Live demo placeholder (nslookup google.com); no output shown | DEMO | none | No |
| 10 | Classes of DNS Servers | Root DNS Servers: ~1000+ instances worldwide; provide IPs of TLD servers. TLD DNS Servers: handle .com, .org, .edu, plus country codes (.in, .jp, etc.); maintained by registries (e.g., Verisign for .com); provide IPs of authoritative servers. Authoritative DNS Servers: hold DNS records for organizations (e.g., amazon.com, newtonschool.co); map hostnames → IP addresses | KEY CONCEPT | DNS globe icon; document icon listing .COM / .NET / .INFO | No |
| 11 | Local DNS Servers | Not part of hierarchy, but central to DNS operation at scale; provided by ISPs (residential & institutional); acts as a proxy: forwards client queries into hierarchy; usually close to the client (LAN or few hops away) | KEY CONCEPT | Iterative resolution diagram: Green box "corp.com (DNS Server)" with "Your PC" below, PC ⇄ corp.com "DNS Query for "careers.github.com"". corp.com → Root Server (.) "1. DNS Query for "careers.github.com."" ; Root → corp.com (dashed) "2. I don't know but I can get you to .com DNS Server"; corp.com → .com Servers "3. DNS Query for "careers.github.com."" ; .com → corp.com (dashed) "4. I don't know but I can get you to .github.com DNS Server"; corp.com → github.com Server "5. DNS Query for "careers.github.com."" ; github.com → corp.com "6. Answer IP (XXX.XXX.XXX.XX) for careers.github.com sent to Corp.com DNS server also it will be cached" | No |
| 12 | "Demo: create DNS records in AWS Route 53" | Live demo placeholder; no console screenshots/record details | DEMO / AWS | none | No |
| 13 | "Please fill the feedback form." | Filler | none | none | No |
| 14 | "Thanks for watching!" | Filler — END of DNS deck (Segment A) | none | none | No |
| 15 | Socket API as an Interface b/w the Application and Transport Layers | Socket API is a toolkit enabling apps to communicate with the OSI model's transport layer; serves as a bridge for apps to connect with other systems using protocols like TCP and UDP | KEY CONCEPT | Vertical stack: Application ↓ Socket API ↓ Transport Layer (double chevrons between) | No |
| 16 | Application Layer Protocols | HTTP – Hypertext Transfer Protocol; HTTPS – Hypertext Transfer Protocol Secure; HTTP/2 | none | none | No |
| 17 | HTTP | Stages in an HTTP transaction: Connection, Request, Response, Close | KEY CONCEPT | Client (person at monitor) and Server rack; arrows: Connection (→ server), Request (→ server), Response (← client), Close (↔ both directions) | No |
| 18 | HTTP | HTTP is a stateless protocol operating over TCP. Stateless nature: each HTTP request is independent, treated as a new request with no memory of prior interactions; server does not retain information about previous client requests or sessions | KEY CONCEPT | HTTP icon (globe, </>, HTTP box with network nodes) | No |
| 19 | Breakdown of HTTP Messages | HTTP messages consist of requests (client→server) and responses (server→client); structured with request/response line, headers, optionally a body | KEY CONCEPT | Block diagram: "HTTP Message" → Request column: Request Line; Response column: Status Line; shared rows Headers, Body | No |
| 20 | HTTP Request Message Breakdown: | Annotated request: Request Line `GET /index.html HTTP/1.1`; Headers `Host: example.com`, `User-Agent: Chrome`, `Accept-Language: en-us`, `...`; Empty Line; Body "optional, e.g. form data, json" | KEY CONCEPT | "Message request" box with 4 colour bands (yellow request line, red headers, grey empty line, green body) and left labels with arrows | No |
| 21 | HTTP Request Message Breakdown: (Request Line) | Request line has three parts: Method (type of operation, e.g., GET, POST, PUT, DELETE); URL (resource/endpoint, e.g., /home, /api/data); HTTP Version (e.g., HTTP/1.1 or HTTP/2). Example: GET /index.html HTTP/1.1 | KEY CONCEPT | none | No |
| 22 | HTTP Request Message Breakdown: (Headers) | Headers provide additional info about the request or client's capabilities. Common: User-Agent (client software: browser, app, etc.); Host (domain name of server); Content-Type (type of data client is sending, for POST or PUT); Accept (types of data client can process, e.g., text/html, application/json) | KEY CONCEPT | none | No |
| 23 | HTTP Request Message Breakdown: (Body) | Body (optional) contains actual data sent by client (form data, JSON payload, etc.); only included for certain methods like POST, PUT, or PATCH. Example (for POST request): json `{ "username": "user1", "password": "password123" }` | KEY CONCEPT | none | No |
| 24 | HTTP Response Message Breakdown: | Annotated response (see Code section): Status Line `HTTP/1.1 201 Created`; Headers Server/Date/Content-Length: 88/Content-Type: application/json/Connection: Closed; Empty Line; JSON body | KEY CONCEPT | "Message Response" box with yellow status line, red headers, (empty line), green body; left labels Status Line/Headers/Empty Line/Body with arrows | No |
| 25 | HTTP Response Message Breakdown: (Status Line) | Status line = HTTP Version; Status Code (3-digit code indicating result, e.g., 200, 404, 500); Status Message (short description, e.g., OK, Not Found, Internal Server Error). Example: HTTP/1.1 200 OK | KEY CONCEPT | none | No |
| 26 | HTTP Response Message Breakdown: (Headers) | Response headers = metadata about the response. Common: Content-Type (type of body data, e.g., text/html, application/json); Content-Length (length of body in bytes); Server (server software info); Date (date/time response sent) | KEY CONCEPT | none | No |
| 27 | HTTP Response Message Breakdown: (Body) | Body (optional) = actual data returned (HTML, JSON, an image, etc.). Example (labelled "css" — mislabel, it is HTML): `<html><body><h1>Welcome to Example.com</h1></body></html>` | KEY CONCEPT | none | No |
| 28 | Domain Name System (DNS) — "A Distributed, Hierarchical Database" | Verbatim repeat of p7 | KEY CONCEPT | Same "0 DAYS SINCE IT WAS DNS" sticker photo | No |
| 29 | How DNS Lookup Works — Example: www.amazon.com | Verbatim repeat of p8 (3-step root→TLD→authoritative) | KEY CONCEPT | Same tree as p8 | No |
| 30 | Classes of DNS Servers | Verbatim repeat of p10 | KEY CONCEPT | Same icons as p10 | No |
| 31 | Local DNS Servers | Same bullets as p11 | KEY CONCEPT | DIFFERENT diagram from p11: "DNS QUERY" — PC →(1)→ LOCAL DNS SERVER →(2)→ ROOT DNS SERVER →(3)→ Local; Local →(4)→ TLD DNS SERVER →(5)→ Local; Local →(6)→ AUTHORITATIVE DNS SERVER →(7)→ Local; Local →(8)→ PC. Request arrows teal, reply arrows orange/dashed; servers in coloured cloud blobs (root pink, TLD teal, authoritative blue, PC purple) | No |
| 32 | "Demo: create DNS records in AWS Route 53" | Repeat of p12 demo placeholder | DEMO / AWS | none | No |
| 33 | "Let's discuss about APIs a bit" | Section divider (start of APIs segment) | none | none | No |
| 34 | Client Server Paradigm | Client sends Query → Server; Server Fetch ⇄ Data; Server sends Response → Client | KEY CONCEPT | Client (woman with laptop) →"Query"→ Server (cluster) ⇄"Fetch"⇄ Data (DB cylinder); Server →"Response"→ Client | No |
| 35 | Jeff Bezos: API Mandate in 2002 (paraphrased) | All teams will henceforth expose their data and functionality through service interfaces; teams must communicate with each other through these service interfaces; no other communication is allowed other than service interfaces over the network; it doesn't matter what technology they use; all service interfaces must be designed to be externalizable; anyone who doesn't do this will be fired | real-world / AWS-history | Photo of Jeff Bezos | No |
| 36 | API | API (Application Programming Interface) = a set of protocols, routines, and tools that allow different software applications or systems to communicate with each other over a network. APIs define how software components should interact, providing a structured way for systems to send and receive data | KEY CONCEPT | Icon: gear </> gear, label "API" | No |
| 37 | Google Maps API | Use cases: Location-Based Apps; Delivery Apps | none (examples) | Aerial 3D map screenshot (stadium/city) labelled Location-Based Apps; delivery scooter on phone illustration labelled Delivery Apps | No |
| 38 | Weather App | Screenshot of a weather web app: search box "Delhi", result "Tamil Nadu,IN", "Wednesday I September 2020", 31°C, Clouds, 30 °c / 32 °c (city in search box does not match displayed result — screenshot artefact) | DEMO (example app) | App screenshot only | No |
| 39 | Weather API | Weather APIs offer forecasts, real-time data, and historical reports, often in JSON or XML formats. Use cases: Travel apps (e.g., Kayak, AccuWeather) that provide weather data for trip planning; Smart home devices (e.g., Nest) adjusting settings based on fetched weather forecasts | none | none | No |
| 40 | "Please fill the feedback form." | Filler (end of Segment D; "Thanks for watching!" follows on p41, outside range) | none | none | No |

## Worked examples & numericals
- None (no numericals). Concrete worked walkthroughs:
  - p8/p29 DNS lookup for www.amazon.com: Root → TLD (.com) IPs; TLD → amazon.com authoritative IP; authoritative → IP of www.amazon.com.
  - p11 iterative resolution of careers.github.com through corp.com local DNS server (6 numbered steps; answer cached at local server) — verbatim labels in the page table.
  - p31 8-step local-DNS resolution (PC→Local→Root→Local→TLD→Local→Authoritative→Local→PC).
- Source oddities to flag: p24 header `Date: Mon, 18 Dec 2024` — 18 Dec 2024 was actually a Wednesday; `Connection: Closed` (standard token is `close`). p27 body example labelled "css" but is HTML. p23 example labelled "json". p3 "Efficent" typo. p38 search box "Delhi" vs. result "Tamil Nadu,IN".

## Formulas stated
- None.

## Diagrams that must be recreated
- p3 → HTTP/2 vs HTTP/3 stack: rows Application / "Security" / Transport / Network. HTTP/2 column: HTTP/2 (+Multistreaming) / TLS / Stream Abstraction over TCP / IP. HTTP/3 column: HTTP/3 / QUIC box containing Multistreaming + TLS + Stream Abstraction / UDP / IP.
- p8 (=p29) → DNS hierarchy tree: Root DNS servers → {com, org, co} DNS servers → com: google.com, amazon.com; org: wikipedia.org; co: newtonschool.co, huggingface.co (authoritative DNS servers).
- p11 → Local DNS iterative resolution for careers.github.com: Your PC ⇄ corp.com (DNS Server); corp.com ↔ Root Server (.) [1 query / 2 referral to .com]; ↔ .com Servers [3 query / 4 referral to github.com]; ↔ github.com Server [5 query / 6 answer IP XXX.XXX.XXX.XX, cached]. Solid arrows = queries, dashed = referrals.
- p31 → Local DNS 8-step resolution: PC –1→ Local; Local –2→ Root, Root –3→ Local; Local –4→ TLD, TLD –5→ Local; Local –6→ Authoritative, Authoritative –7→ Local; Local –8→ PC.
- p15 → Application → Socket API → Transport Layer stack.
- p17 → HTTP transaction stages: Client/Server with 4 arrows Connection →, Request →, Response ←, Close ↔.
- p19 → HTTP Message structure: Request Line | Status Line, then Headers, Body.
- p20 → Annotated HTTP request (request line / headers / empty line / body).
- p24 → Annotated HTTP response (status line / headers / empty line / body).
- p34 → Client –Query→ Server ⇄Fetch⇄ Data; Server –Response→ Client.

## Code / CLI / config shown (verbatim)
- p6 DNS records table (columns Type | Name | Content | TTL | Proxy status):
  ```
  A      ftp                 172.217.22.4                 Auto   DNS only   (warning triangle icon on this row)
  A      ivetamakeup.com     172.217.22.4                 Auto   Proxied
  A      localhost           127.0.0.1                    Auto   DNS only - local IP
  CNAME  webmail             friday.mxlogin.com           1 day  DNS only
  CNAME  www                 ivetamakeup.com              Auto   Proxied
  MX     ivetamakeup.com     friday.mxlogin.com   [10]    1 day  DNS only
  MX     ivetamakeup.com     friday-relay.mxlogin.c… [20] 1 day  DNS only
  TXT    default._domainkey  v=DKIM1; k=rsa; p=MIIBIj…    1 day  DNS only
  TXT    _dmarc              v=DMARC1; p=reject; rua…     1 day  DNS only
  TXT    ivetamakeup.com     google-site-verification=…   1 day  DNS only
  TXT    ivetamakeup.com     v=spf1 include:mxlogin.c…    1 day  DNS only
  ```
  (MX priorities 10 and 20 shown as badges.)
- p9 demo: nslookup for Google.com (command implied; no output on slide).
- p20 HTTP request:
  ```
  GET /index.html HTTP/1.1
  Host: example.com
  User-Agent: Chrome
  Accept-Language: en-us
  ...

  optional, e.g. form data, json
  ```
- p23 POST body: `{ "username": "user1", "password": "password123" }`
- p24 HTTP response:
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
- p25 status line example: `HTTP/1.1 200 OK`
- p27 body example: `<html><body><h1>Welcome to Example.com</h1></body></html>`
- p3 (recap): `Cache-Control: max-age=3600`, "Request: foobar.css", "3600s".

## In-class questions / quiz prompts shown on slides (verbatim, with answers if given)
- p4: "But How to reach a server?" — "Domain Name? ❌" / "Address of server? ✅" (answer given via marks).
- p5/p6: "What is The address of server?" — answered by DNS records (A/AAAA = address).
- p9: "Demo: Lets do NSlookup for Google.com" (no answer/output).

## Unclear / unreadable
- p6: Content column values truncated in the source screenshot (friday-relay.mxlogin.c…, p=MIIBIj…, rua…, google-site-verification=…, v=spf1 include:mxlogin.c…) — truncated in the original, not a render problem. Verified at 160 dpi.
- p11: answer IP intentionally masked as "XXX.XXX.XXX.XX" in source.
- p9, p12, p32: demo slides — the actual live demo (nslookup output, Route 53 console steps) is not captured in the PDF.
- No handwriting anywhere in pp.1–40.

## Duplicate / overlap notes
- pp.28, 29, 30, 32 are verbatim repeats of pp.7, 8, 10, 12; p31 repeats p11's bullets with a different (8-step) diagram.
- p3 right-hand panel reuses the Cache-Control figure from WB-L07 p19; left panel (HTTP/2 vs HTTP/3/QUIC stack) recaps prior HTTP-versions material (likely WB-L06/real L07).
- pp.15–27 (Socket API, HTTP stages, statelessness, HTTP request/response message breakdown) are recap of client-server/HTTP material (probably from the WB-L06 "Client-Server Architecture, HTTP Protocols, HTTP Version" lecture); the text "Socket API as an Interface…" repeats again at p42 and "Application Layer Protocols" at p43 (next range).
- pp.13/40 feedback and p14/p41 thanks slides repeat per segment.
- Topics flagged by the caller as priorities — REST, TLS handshake steps, certificates/CA chain, symmetric vs asymmetric crypto, MITM, ACM, Route 53 routing policies — are NOT present in pp.1–40. DNS hierarchy and record types ARE present (pp.6–11, 28–31). APIs are introduced (pp.33–39) but REST itself is not mentioned in this range.

## Topic list
- Recap: HTTP/2 over TLS/TCP vs HTTP/3 over QUIC/UDP ("Secure the connection"); caching / Cache-Control max-age=3600
- Need for server address vs domain name
- DNS analogy: Justdial business listing (address, hours, services, contact numbers)
- DNS record types: A / AAAA (IP address), MX (mail exchange, with priority), NS (name servers), TXT, CNAME; example zone with TTL, proxy status, DKIM/DMARC/SPF/site-verification TXT records
- DNS as a distributed, hierarchical database (scales via many servers, no single server holds all mappings)
- Three classes of DNS servers: Root, TLD, Authoritative
- DNS lookup walkthrough (www.amazon.com): root → TLD → authoritative
- DNS hierarchy tree (com/org/co → google.com, amazon.com, wikipedia.org, newtonschool.co, huggingface.co)
- Demo: nslookup google.com
- Root servers: ~1000+ instances; provide TLD IPs
- TLD servers: generic (.com/.org/.edu) and country-code (.in/.jp); registries (Verisign for .com); provide authoritative IPs
- Authoritative servers: hold org records; hostname → IP
- Local DNS servers: not in hierarchy, ISP-provided, proxy/forwarder, close to client; iterative resolution with referrals; caching of answers
- Demo: create DNS records in AWS Route 53
- Socket API as interface between application and transport layer (TCP/UDP)
- Application-layer protocols: HTTP, HTTPS, HTTP/2
- HTTP transaction stages: connection, request, response, close
- HTTP statelessness over TCP
- HTTP message structure: request line / status line, headers, body
- HTTP request: request line (method, URL, version), headers (User-Agent, Host, Content-Type, Accept, Accept-Language), empty line, body (POST/PUT/PATCH; JSON example)
- HTTP response: status line (version, 3-digit code, message; 200 OK, 201 Created, 404, 500), headers (Content-Type, Content-Length, Server, Date, Connection), body (HTML/JSON/image)
- (Repeat) DNS hierarchy, lookup, server classes, local DNS (8-step diagram), Route 53 demo
- APIs: client-server paradigm (query → server → fetch data → response)
- Jeff Bezos 2002 API mandate (service interfaces, externalizable)
- API definition (protocols, routines, tools for software to communicate over a network)
- API examples: Google Maps API (location-based, delivery apps), Weather app / Weather API (JSON/XML; forecasts, real-time, historical; Kayak, AccuWeather, Nest)
