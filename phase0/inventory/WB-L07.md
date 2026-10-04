# WB-L07 pages 1–31 — Email Protocols (SMTP, POP3, IMAP) CDNs and Caching

> **FILENAME MISMATCH WARNING:** The PDF is named "L07 - 2026-08-31 - REST API(s), Presentation Layer, HTTPS, TLS-SSL.pdf", but its actual content (title slide, PDF metadata Title, all 31 pages) is the **Email Protocols (SMTP, POP3, IMAP), CDNs and Caching** deck (CSAI321: Computer Networks, Newton School of Technology; PDF Author metadata: Kuldeep Jha; Canva export dated 2026-08-28). There is **NO** REST, Presentation-layer, HTTPS, TLS handshake, certificate/CA, crypto, MITM or ACM content anywhere in this file. Those topics must be sourced from elsewhere (they are not in WB-L08 pp.1–40 either). No handwriting/annotations on any page — all pages are clean Canva slides.

## Page table
| Page | Section/slide title | Content summary (exact facts, numbers, definitions, lists — be specific, not vague) | Callout type | Diagram/figure on page (describe so it can be redrawn) | Handwriting present? |
|---|---|---|---|---|---|
| 1 | Title: "Email Protocols (SMTP, POP3, IMAP) CDNs and Caching" | Course: CSAI321: Computer Networks; Newton School of Technology logo | none | Canva network-mesh triangle graphic (decorative) | No |
| 2 | "Join the lecture online on your dashboard" | Filler | none | none | No |
| 3 | Recap | OSI 7-layer recap with example protocols per layer: 7 Application – SMTP HTTP FTP HTTPS P2P DNS…; 6 Presentation – JPEG MPEG IMAP… (source lists IMAP under Presentation — oddity); 5 Session – RPC(Sockets)…; 4 Transport – TCP UDP; 3 Network – IP ICMP IPSec…; 2 Data Link – ARP VLAN STP…; 1 Physical – Hubs Fiber…. Encapsulation steps 1–5 down, de-encapsulation 6–10 up. PDU names: Data, TCP Segment / UDP Packet, IP Datagram, Frame, Bit. Header contents: MAC header = source MAC, destination MAC, frame control, sequence control; IP header = source IP, destination IP, datagram sequence order; TCP header = source port, destination port, sequence number | none (recap) | Device A → Device B ("Data" dashed). Left column layers 7→1 with "Encapsulation" down arrow; right column 7→1 with "De-encapsulation" up arrow. Center stack: [HTTP hdr|Data]=Data; [TCP|HTTP|Data]=TCP Segment/UDP Packet; [IP|TCP|HTTP|Data]=IP Datagram; [MAC|IP|TCP|HTTP|Data]=Frame; "10010111…"=Bit. Numbered circles 1–5 on left side, 6–10 on right. Three dashed callout boxes for MAC/IP/TCP header fields. Meme thumbnail "Where have I seen that?" | No |
| 4 | Application Layer Protocols | Sign lists: HTTP, HTTPS, FTP, NFS, FMTP, DHCP, SNMP, TELNET, POP3, IRC, NNTP. Uses → protocol: File Transfer → FTP; Web Surfing → HTTP/S; Emails → SMTP; Virtual Terminals → Telnet | none | Cartoon man holding protocol sign; 4 columns of icons (browsers, Outlook/Skype, laptop, devices) labelled File Transfer/Web Surfing/Emails/Virtual Terminals over FTP/HTTP/S/SMTP/Telnet (Sitesbay image) | No |
| 5 | Section divider: "Email Server Protocol" | Filler/divider | none | none | No |
| 6 | How SMTP Works: | (1) Email client (e.g., Gmail app, Outlook) connects to the SMTP server. (2) SMTP pushes the message from the sender to the receiver's mail server. (3) Receiver then uses POP3 or IMAP to retrieve the email | KEY CONCEPT | Sender →(SMTP)→ Sender's mail server →(SMTP over Internet)→ Receiver's mail server →(POP3/IMAP)→ Receiver | No |
| 7 | SMTP (Simple Mail Transfer Protocol) | Sends email from sender server to recipient servers; Push-based protocol; Uses TCP, Ports: 25 / 587 / 465. "SMTP in the Real World": Sendgrid, Mailchimp, Mailgun integrations us[e] SMTP Relays | KEY CONCEPT / real-world | Sender →SMTP→ Sender's Mail server →SMTP (via Internet globe)→ Recipient's Mail server →IMAP/POP→ Recipient. Logos: Twilio SendGrid, mailchimp, mailgun | No |
| 8 | Mailhog | GitHub card "mailhog/MailHog — Web and API based SMTP testing" (37 contributors, 219 issues, 16k stars, 1k forks) | DEMO (implied tool demo) | GitHub repo preview card | No |
| 9 | Section divider: "Email Clients Protocol" | Filler/divider | none | none | No |
| 10 | IMAP (Internet Message Access Protocol) | Manages email directly on the server; Suitable for multi-device access; Supports folders, partial downloads; Uses Port 143, Secure (IMAPS): 993; Connection Type: Two-way sync (client ↔ server) | KEY CONCEPT | Sender User Agent → SMTP Mail Server → branches to (a) IMAP Mail Server ⇄ IMAP User Agent ("Messages managed remotely", bidirectional arrows) and (b) POP Mail Server → POP User Agent ("Messages Downloaded", one-way arrow) | No |
| 11 | How IMAP Works: | Client connects via IMAP; view/manage emails without downloading them completely; changes (read/unread, folders, deletions) reflected on server and synced across all devices; access folders (Inbox, Sent, Drafts, etc.) as organized on server | KEY CONCEPT | "How IMAP Works": central Mail Server with IMAP envelopes/arrows to Smart Phone, Tablet, Laptop, Desktop | No |
| 12 | POP3 (Post Office Protocol v3) | Downloads email to local client and deletes from server; Best for offline access, but poor sync across devices; Uses Port 110, Secure (POP3S): 995; Connection Type: One-way (server → client) | KEY CONCEPT | E-mail →SMTP→ Mail server; Mail server → Local computer "POP3 downloads all messages"; Local computer → Mail server "POP3 deletes all messages from server" | No |
| 13 | How POP3 Works: | Client connects via POP3; downloads emails from server; deletes emails from server after downloading; emails now available on your local device only | KEY CONCEPT | Sender at desk →SMTP ("MAIL SENT")→ Sender's mail Server → Internet → Receiver's mail Server; receiver at desk | No |
| 14 | How POP3 Works: (duplicate) | Exact duplicate of p13 | none | same as p13 | No |
| 15 | Section divider: "Application layer Quick and efficient Content delivering Methods" | Divider | none | none | No |
| 16 | Imagine: | "Same content requested repeatedly. Solution?" (motivation for caching) | QUIZ (rhetorical prompt) | Many laptops showing the same Rishihood University webpage all connected to a single server rack | No |
| 17 | Caching | Definition: "The process of storing copies of data in a temporary, high-speed storage layer so that future requests for that same data can be served much faster than fetching it from the original, slower source." Labels Cache Miss / Cache Hit | KEY CONCEPT | Browser ⇄ Server: "request" → / ← "response (content is not cached or is stale)" labelled Cache Miss; Browser ⇄ Cache (DB cylinder) "content is cached and not stale" labelled Cache Hit | No |
| 18 | Caching Behavior | Caching behavior = how data is stored temporarily (cached) and retrieved to improve performance and reduce latency; widely used in networking, browsers, web servers, CDNs, and applications | KEY CONCEPT | Two panels. "First request": Client →First request→ Caching server →First request→ Origin server; Origin → "Asset is cached" → Caching server → "Response from origin" → Client. "Subsequent Requests": Client ⇄ Caching server (Request/Response loop only) | No |
| 19 | Cache-Control | Format: `Cache-Control: public, max-age=3600` | KEY CONCEPT | Laptop →"Request: foobar.css"→ Server; Server →"foobar.css, Cache-Control: max-age=3600"→ Laptop; Laptop ⇄ Browser Cache: "Store foobar.css" / "Retrieve foobar.css", loop labelled "3600s" | No |
| 20 | Layers of Caching | Three layers: Browser Caching, Proxy Cache, CDN Cache | KEY CONCEPT | (a) Proxy Cache: Client →"Document request"→ Proxy server (contains Cache) →"Document sent from cache"→ Client; Proxy ⇠"Up-to-date check"⇢ Remote server. (b) Browser Caching: same browser/server/cache figure as p17. (c) CDN Cache: 2 Visitors → Internet → Reverse Proxy Cache Server → Web Server | No |
| 21 | Netflix Open Connect | "The storage in Netflix Open Connect Appliances at ISP sites (points of presence) holds up to 350 TB!" | real-world fact | IX SITE box: Netflix servers →"SFI"→ ISP; → ISP SITE box containing OCA appliance → 3 arrows to houses. "WOAH!" graphic | No |
| 22 | Content Delivery Network (CDN) | Analogy: CDN is like a chain of grocery stores; instead of travelling to faraway farms, shoppers visit a local store; local stores stock food from distant farms; similarly CDNs cache web content closer to users; result: webpages load faster (minutes not days) | ANALOGY | Client —"Fast Handshake"— CDN ═"Persistent Connection" (SSL shield icon)═ Server | No |
| 23 | How a CDN Works: | User requests content (e.g., video/image); nearest edge server serves request instead of origin; if not cached, edge retrieves from origin and caches it; benefits: faster load times, reduced bandwidth usage, improved availability | KEY CONCEPT | Maria →(1)→ CDN "Point of Presence" →(2)→ Origin; Origin →(3)→ CDN → back to Maria; "Other users" also served by the CDN | No |
| 24 | Content Delivery Network (CDN) | "Geographically distributed servers, delivers content from the nearest edge server, reduces latency, saves bandwidth" | TAKEAWAY | World map: central origin server (Europe) with arrows to ~6 edge cache servers on each continent, each connected to 2 local client monitors | No |
| 25 | Content Delivery Network (CDN) | Origin in late 1990s: CDNs emerged to solve web congestion & latency from growing usage and media-rich content; Akamai pioneered the space in 1998. Major players: Akamai, Cloudflare, Amazon CloudFront, Netflix Open Connect, Google Cloud CDN, Microsoft Azure CDN, Fastly. Tool to check which CDN a site uses: CDNPlanet | AWS (CloudFront mention) / history | Logos: Akamai, Cloudflare, Fastly, Amazon CloudFront | No |
| 26 | Content Delivery Network (CDN) | Use Cases: websites, video streaming, software downloads, gaming, mobile apps. Examples: Cloudflare, Akamai, Amazon CloudFront, Google Cloud CDN | none | CDN cloud in middle; SERVICES on left (Music, Web Pages, Streaming Media) and CLIENTS on right (Mobile, Laptop, Desktop) joined by dashed lines | No |
| 27 | Benefits of CDN : | Infographic "Benefits of CDN Distribution": Reduced Latency; Scalability Enhancement through CDN Distribution; Enhanced Security; Bandwidth Cost Reduction; Resilience and Uptime Improvement (5 benefits) | TAKEAWAY | 5 illustrated icons (cloud/phone, map/pie, shield, piggy bank, clock) | No |
| 28 | How Caching Works | Steps: client requests resource (e.g., image, CSS file); server responds and may include cache-control headers; client stores resource in local cache; on next request client checks: is cached copy still valid (not expired)? If valid → use from cache (no network trip). If expired → revalidate or fetch again | KEY CONCEPT | none | No |
| 29 | Fastly outage in 2021 | June 2021: a misconfiguration in Fastly's network triggered a widespread outage, taking down Reddit, Amazon, The New York Times. Impact: highlighted reliance of modern internet on CDNs; users saw disruptions & slow load times | WARNING (real-world incident) | 3 tiles (Reddit, New York Times, Fastly) each with a flat red line ending in a spike (outage-report graphs) | No |
| 30 | "Please fill the feedback form." | Filler | none | none | No |
| 31 | "Thanks for watching!" | Filler | none | none | No |

## Worked examples & numericals
- None. No numericals or worked problems in this deck. Only numeric facts: SMTP ports 25/587/465; IMAP 143 / IMAPS 993; POP3 110 / POP3S 995; `max-age=3600` (= 3600 s, shown as "3600s" on the diagram); Netflix OCA up to 350 TB; Akamai 1998; Fastly outage June 2021.

## Formulas stated
- None.

## Diagrams that must be recreated
- p3 → OSI encapsulation/de-encapsulation diagram: Device A/B; 7-layer columns with example protocols; centre PDU stack (Data → TCP Segment/UDP Packet → IP Datagram → Frame → Bit) with header blocks MAC|IP|TCP|HTTP|Data; steps 1–5 down left, 6–10 up right; header field callouts (MAC: src/dst MAC, frame control, sequence control; IP: src/dst IP, datagram sequence order; TCP: src/dst port, sequence number).
- p6/p7 → SMTP end-to-end flow: Sender (UA) –SMTP→ Sender's mail server –SMTP (Internet)→ Recipient's mail server –POP3/IMAP→ Recipient.
- p10 → Sender UA → SMTP Mail Server → {IMAP Mail Server ⇄ IMAP UA "messages managed remotely"; POP Mail Server → POP UA "messages downloaded"}.
- p11 → IMAP hub: Mail Server synchronising to phone, tablet, laptop, desktop.
- p12 → POP3: E-mail –SMTP→ Mail server; Mail server –"downloads all messages"→ Local computer; Local computer –"deletes all messages from server"→ Mail server.
- p17 → Cache hit vs miss: Browser↔Server (request; response "not cached or stale" = MISS), Browser↔Cache ("cached and not stale" = HIT).
- p18 → First request vs subsequent requests through a caching server (Client ↔ Caching server ↔ Origin; "Asset is cached").
- p19 → Cache-Control sequence: Request foobar.css → response foobar.css + `Cache-Control: max-age=3600` → store in Browser Cache → retrieve within 3600 s.
- p20 → Three caching layers: Proxy cache (client, proxy server with cache, up-to-date check to remote server); Browser cache; CDN cache (visitors → Internet → reverse proxy cache server → web server).
- p21 → Netflix Open Connect: IX site (Netflix servers –SFI→ ISP) → ISP site (OCA) → homes.
- p22 → Client —Fast Handshake— CDN —Persistent Connection (SSL)— Server.
- p23 → CDN PoP flow: user (1) → PoP, PoP (2) → Origin, Origin (3) → PoP → user; other users served from PoP.
- p24 → World map origin-to-edge distribution.

## Code / CLI / config shown (verbatim)
- p19: `Cache-Control: public, max-age=3600`
- p19 diagram: `Request: foobar.css` / `foobar.css` / `Cache-Control: max-age=3600` / `3600s` / `Store foobar.css` / `Retrieve foobar.css`

## In-class questions / quiz prompts shown on slides (verbatim, with answers if given)
- p3: "Where have I seen that?" (meme thumbnail, recap prompt) — no answer.
- p16: "Same content requested repeatedly. Solution?" — answer implied by next slide (p17): Caching.

## Unclear / unreadable
- None unreadable. Minor source issues: p3 places IMAP under Presentation layer ("JPEG MPEG IMAP…") — IMAP is an application-layer protocol; p7 typo "integrations us SMTP Relays" (= use). p4 sign lists "FMTP" (likely meant SMTP) — as printed.

## Duplicate / overlap notes
- p14 is an exact duplicate of p13 (How POP3 Works).
- p17's browser-cache figure is reused in p20 (Browser Caching panel).
- p19's Cache-Control figure reappears in WB-L08 p3 (Recap: "Efficent Communication methods (Caching)").
- Email/CDN/caching topics are not found in other extracted texts; WB-L10 filename mentions Caching/CDN but its text content is a different deck (Reliable Data Transfer & TCP Flow Control) — filename/content mismatches appear to be systemic in Lectures/Whiteboards.
- The real L07 topics (REST, Presentation layer, HTTPS, TLS/SSL) are absent from this file.

## Topic list
- OSI model recap: layers, example protocols per layer, encapsulation/de-encapsulation, PDU names, header fields (MAC/IP/TCP)
- Application-layer protocols overview (HTTP, HTTPS, FTP, NFS, DHCP, SNMP, TELNET, POP3, IRC, NNTP; use-case mapping FTP/HTTP(S)/SMTP/Telnet)
- Email server protocol: SMTP
  - How SMTP works (client → SMTP server → receiver's mail server → POP3/IMAP)
  - SMTP: push-based, TCP, ports 25/587/465
  - SMTP relays in practice (SendGrid, Mailchimp, Mailgun)
  - MailHog (SMTP testing tool)
- Email client protocols
  - IMAP: server-side management, multi-device, folders, partial downloads, port 143 / IMAPS 993, two-way sync
  - How IMAP works (sync of read/unread, folders, deletions)
  - POP3: download-and-delete, offline, poor multi-device sync, port 110 / POP3S 995, one-way server→client
  - How POP3 works
  - IMAP vs POP3 comparison (diagram p10)
- Content delivery methods: motivation (same content requested repeatedly)
- Caching: definition, cache hit vs cache miss, stale content
- Caching behaviour: first request vs subsequent requests, caching server vs origin
- HTTP Cache-Control header: `public, max-age=3600`
- Layers of caching: browser cache, proxy cache, CDN (reverse-proxy) cache
- Netflix Open Connect (OCA at ISP PoPs, up to 350 TB; IX site, SFI)
- CDN: grocery-store analogy; fast handshake + persistent SSL connection to origin
- How a CDN works: edge server / Point of Presence, origin fetch on miss, caching
- CDN: geographically distributed edge servers, latency & bandwidth reduction
- CDN history (Akamai 1998) and major players (Akamai, Cloudflare, Amazon CloudFront, Netflix Open Connect, Google Cloud CDN, Azure CDN, Fastly); CDNPlanet tool
- CDN use cases and examples
- Benefits of CDN (5: latency, scalability, security, bandwidth cost, resilience/uptime)
- How caching works step-by-step (validity check, revalidate or refetch)
- Fastly outage June 2021 (misconfiguration; Reddit, Amazon, NYT down)
