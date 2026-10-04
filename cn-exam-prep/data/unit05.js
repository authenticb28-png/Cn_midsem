// Unit unit05 data (schema: cn-exam-prep/SCHEMA.md). Plain double-quoted JS; every LaTeX backslash is doubled.
window.UNITS = window.UNITS || {};
window.UNITS["unit05"] = {
 "id": "unit05",
 "num": 5,
 "day": 2,
 "title": "Application Layer: Client–Server/P2P, HTTP Anatomy, HTTP/1.0→3, REST & APIs",
 "lectures": "Lecture 5 · WB-L05; WB-L08 p15–27, p33–39",
 "overview": "<p>The application layer is where marks are easiest. Know the exact shape of an HTTP request and response (request line, header lines, CRLF, blank line, body), the status-code classes, and how each HTTP version fixed the previous one's bottleneck: 1.0 opens one TCP connection per object; 1.1 adds keep-alive and pipelining; 2 multiplexes binary frames on one TCP connection; 3 runs independent QUIC streams over UDP. Numericals are RTT counting: non-persistent costs 2 RTT + transmission per object, persistent saves the handshake, and pipelining collapses all objects into one RTT. Coding questions ask you to build or parse HTTP bytes on a raw socket and to drive a REST API with http.client.</p>",
 "sections": [
  {
   "id": "05-A",
   "title": "Client–Server vs P2P, the Application Layer and the Socket API",
   "badge": "class",
   "source": "WB-L05 p4–11; WB-L07 p4; WB-L08 p15",
   "covers": [
    "05.1",
    "05.2",
    "05.3"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "Restaurant vs potluck",
     "html": "<p><b>Analogy.</b> A restaurant is <b>client–server</b>: diners (clients) only ever talk to the kitchen (server), the kitchen is open all day at a fixed address, and if 500 diners arrive the kitchen is the bottleneck. A potluck is <b>peer-to-peer</b>: every guest both brings food and eats, so each new guest adds capacity as well as demand.</p><p><b>Definitions (WB-L05 p5–6).</b> <i>Client/Server</i>: a centralised architecture where powerful servers store data and process requests for many dependent clients. <i>Peer-to-Peer (P2P)</i>: a decentralised model where all devices (peers) act as both clients and servers with equal privileges.</p><p><b>Precise view (Kurose &amp; Ross §2.1).</b> A server is an <b>always-on host with a permanent, well-known address</b> (IP + port); clients are intermittently connected, may have dynamic IPs and never talk to each other directly. In P2P there is minimal or no reliance on dedicated servers, peers talk directly, and the system is <b>self-scalable</b> (BitTorrent). Even inside P2P, for any one session the process that <b>initiates</b> contact is called the client and the one that <b>waits</b> to be contacted is the server.</p>"
    },
    {
     "type": "figure",
     "html": "<svg viewBox='0 0 640 260' width='100%' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'><defs><marker id='arr' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='currentColor'/></marker></defs><rect x='112' y='103' width='76' height='44' rx='4' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='150' y='122' font-size='13' fill='currentColor' text-anchor='middle' font-weight='bold'>Server</text><text x='150' y='138' font-size='10' fill='var(--muted)' text-anchor='middle'>always on</text><line x1='150' y1='105.2' x2='150' y2='47' stroke='var(--muted)' stroke-width='1.5'/><rect x='124' y='23' width='52' height='24' rx='4' fill='none' stroke='currentColor' stroke-width='1.2'/><text x='150' y='39' font-size='11' fill='currentColor' text-anchor='middle'>client</text><line x1='120.382' y1='115.1' x2='78.9859' y2='86' stroke='var(--muted)' stroke-width='1.5'/><rect x='37.3975' y='68' width='52' height='24' rx='4' fill='none' stroke='currentColor' stroke-width='1.2'/><text x='63.3975' y='84' font-size='11' fill='currentColor' text-anchor='middle'>client</text><line x1='120.382' y1='134.9' x2='78.9859' y2='164' stroke='var(--muted)' stroke-width='1.5'/><rect x='37.3975' y='158' width='52' height='24' rx='4' fill='none' stroke='currentColor' stroke-width='1.2'/><text x='63.3975' y='174' font-size='11' fill='currentColor' text-anchor='middle'>client</text><line x1='150' y1='144.8' x2='150' y2='203' stroke='var(--muted)' stroke-width='1.5'/><rect x='124' y='203' width='52' height='24' rx='4' fill='none' stroke='currentColor' stroke-width='1.2'/><text x='150' y='219' font-size='11' fill='currentColor' text-anchor='middle'>client</text><line x1='179.618' y1='134.9' x2='221.014' y2='164' stroke='var(--muted)' stroke-width='1.5'/><rect x='210.603' y='158' width='52' height='24' rx='4' fill='none' stroke='currentColor' stroke-width='1.2'/><text x='236.603' y='174' font-size='11' fill='currentColor' text-anchor='middle'>client</text><line x1='179.618' y1='115.1' x2='221.014' y2='86' stroke='var(--muted)' stroke-width='1.5'/><rect x='210.603' y='68' width='52' height='24' rx='4' fill='none' stroke='currentColor' stroke-width='1.2'/><text x='236.603' y='84' font-size='11' fill='currentColor' text-anchor='middle'>client</text><text x='150' y='245' font-size='12' fill='var(--accent)' text-anchor='middle'>Client/Server: n clients, n links, all via the server</text><line x1='400' y1='50' x2='560' y2='50' stroke='var(--ok)' stroke-width='1.6'/><line x1='400' y1='50' x2='400' y2='190' stroke='var(--ok)' stroke-width='1.6'/><line x1='400' y1='50' x2='560' y2='190' stroke='var(--ok)' stroke-width='1.6'/><line x1='560' y1='50' x2='400' y2='190' stroke='var(--ok)' stroke-width='1.6'/><line x1='560' y1='50' x2='560' y2='190' stroke='var(--ok)' stroke-width='1.6'/><line x1='400' y1='190' x2='560' y2='190' stroke='var(--ok)' stroke-width='1.6'/><rect x='370' y='36' width='60' height='28' rx='4' fill='var(--panel)' stroke='var(--ok)' stroke-width='2'/><text x='400' y='54' font-size='11' fill='currentColor' text-anchor='middle'>peer 1</text><rect x='530' y='36' width='60' height='28' rx='4' fill='var(--panel)' stroke='var(--ok)' stroke-width='2'/><text x='560' y='54' font-size='11' fill='currentColor' text-anchor='middle'>peer 2</text><rect x='370' y='176' width='60' height='28' rx='4' fill='var(--panel)' stroke='var(--ok)' stroke-width='2'/><text x='400' y='194' font-size='11' fill='currentColor' text-anchor='middle'>peer 3</text><rect x='530' y='176' width='60' height='28' rx='4' fill='var(--panel)' stroke='var(--ok)' stroke-width='2'/><text x='560' y='194' font-size='11' fill='currentColor' text-anchor='middle'>peer 4</text><text x='480' y='245' font-size='12' fill='var(--ok)' text-anchor='middle'>P2P full mesh: 4 peers, 4(3)/2 = 6 links</text></svg>",
     "caption": "WB-L05 p5–6 redrawn: one server with six clients (star) vs four peers fully meshed (4 sides + 2 diagonals = 6 links)."
    },
    {
     "type": "derivation",
     "title": "Number of links in a full P2P mesh of n peers",
     "steps": [
      {
       "tex": "\\text{each peer links to } n-1 \\text{ others}",
       "why": "A full mesh means every peer has a direct link to every other peer."
      },
      {
       "tex": "\\text{link-ends} = n(n-1)",
       "why": "Add up the n−1 link-ends at each of the n peers."
      },
      {
       "tex": "L = \\frac{n(n-1)}{2}",
       "why": "Each link has two ends, so it was counted twice; divide by 2."
      },
      {
       "tex": "L(4) = \\frac{4\\times 3}{2} = 6",
       "why": "The slide's 4-peer square: 4 sides + 2 diagonals."
      },
      {
       "tex": "L(10) = \\frac{10\\times 9}{2} = 45 \\quad\\text{vs}\\quad 10 \\text{ links in a star}",
       "why": "Client/server needs only n links (one per client), which is why it is simpler to build but concentrates load on the server."
      }
     ]
    },
    {
     "type": "text",
     "html": "<p><b>The application layer (WB-L05 p10).</b> Layer 7 is the direct interface between software programs (browsers, e-mail clients) and the network: it interprets user commands and enables data exchange across systems. An application-layer <b>protocol</b> defines (Kurose §2.1.5): the <b>types</b> of messages (request, response), their <b>syntax</b> (fields and how they are delimited), their <b>semantics</b> (meaning of each field) and the <b>rules</b> for when and how a process sends and responds. Open protocols are published in RFCs (HTTP, SMTP); proprietary ones are not (Skype, Zoom).</p>"
    },
    {
     "type": "table",
     "head": [
      "Use (WB-L05 p11)",
      "Protocol",
      "Transport",
      "Well-known server port"
     ],
     "rows": [
      [
       "Web surfing",
       "HTTP / HTTPS",
       "TCP (HTTP/3: UDP via QUIC)",
       "80 / 443"
      ],
      [
       "File transfer",
       "FTP",
       "TCP",
       "21 control, 20 data (active mode)"
      ],
      [
       "E-mail sending",
       "SMTP",
       "TCP",
       "25 relay, 587 submission, 465 SMTPS"
      ],
      [
       "E-mail reading",
       "POP3 / IMAP",
       "TCP",
       "110 (995 TLS) / 143 (993 TLS)"
      ],
      [
       "Virtual terminal",
       "Telnet (plain text) / SSH",
       "TCP",
       "23 / 22"
      ],
      [
       "Name lookup",
       "DNS",
       "UDP (TCP for large replies and zone transfers)",
       "53"
      ],
      [
       "Address assignment",
       "DHCP",
       "UDP",
       "67 server, 68 client"
      ],
      [
       "Network management",
       "SNMP",
       "UDP",
       "161 (traps 162)"
      ],
      [
       "Remote file system",
       "NFS",
       "TCP or UDP",
       "2049"
      ],
      [
       "Usenet news / chat",
       "NNTP / IRC",
       "TCP",
       "119 / 6667 (common)"
      ]
     ],
     "caption": "The protocols on the WB-L05 p11 sign, with their transport and port. \"FMTP\" on the sign is the typo for SMTP that UNCLEAR.md B35 also notes on WB-L07 p4."
    },
    {
     "type": "figure",
     "html": "<svg viewBox='0 0 640 262' width='100%' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'><defs><marker id='arr' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='currentColor'/></marker></defs><rect x='20' y='20' width='200' height='210' rx='4' fill='none' stroke='var(--muted)' stroke-width='1.6' stroke-dasharray='5 4'/><text x='120' y='40' font-size='12' fill='currentColor' text-anchor='middle' font-weight='bold'>Host A (client)</text><rect x='70' y='52' width='100' height='36' rx='4' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='120' y='75' font-size='12' fill='currentColor' text-anchor='middle'>process</text><rect x='100' y='98' width='40' height='22' rx='4' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='120' y='114' font-size='10' fill='var(--warn)' text-anchor='middle'>socket</text><rect x='60' y='130' width='120' height='40' rx='4' fill='none' stroke='currentColor' stroke-width='1.6'/><text x='120' y='148' font-size='12' fill='currentColor' text-anchor='middle'>TCP / UDP</text><text x='120' y='163' font-size='9' fill='var(--muted)' text-anchor='middle'>send/recv buffers</text><rect x='60' y='178' width='120' height='24' rx='4' fill='none' stroke='currentColor' stroke-width='1.6'/><text x='120' y='195' font-size='10' fill='currentColor' text-anchor='middle'>IP, link, physical</text><line x1='120' y1='88' x2='120' y2='98' stroke='var(--warn)' stroke-width='1.5'/><line x1='120' y1='120' x2='120' y2='130' stroke='var(--warn)' stroke-width='1.5'/><rect x='420' y='20' width='200' height='210' rx='4' fill='none' stroke='var(--muted)' stroke-width='1.6' stroke-dasharray='5 4'/><text x='520' y='40' font-size='12' fill='currentColor' text-anchor='middle' font-weight='bold'>Host B (server)</text><rect x='470' y='52' width='100' height='36' rx='4' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='520' y='75' font-size='12' fill='currentColor' text-anchor='middle'>process</text><rect x='500' y='98' width='40' height='22' rx='4' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='520' y='114' font-size='10' fill='var(--warn)' text-anchor='middle'>socket</text><rect x='460' y='130' width='120' height='40' rx='4' fill='none' stroke='currentColor' stroke-width='1.6'/><text x='520' y='148' font-size='12' fill='currentColor' text-anchor='middle'>TCP / UDP</text><text x='520' y='163' font-size='9' fill='var(--muted)' text-anchor='middle'>send/recv buffers</text><rect x='460' y='178' width='120' height='24' rx='4' fill='none' stroke='currentColor' stroke-width='1.6'/><text x='520' y='195' font-size='10' fill='currentColor' text-anchor='middle'>IP, link, physical</text><line x1='520' y1='88' x2='520' y2='98' stroke='var(--warn)' stroke-width='1.5'/><line x1='520' y1='120' x2='520' y2='130' stroke='var(--warn)' stroke-width='1.5'/><line x1='10' y1='124' x2='630' y2='124' stroke='var(--warn)' stroke-width='1' stroke-dasharray='3 3'/><text x='320' y='112' font-size='11' fill='var(--warn)' text-anchor='middle'>controlled by the app developer (above)</text><text x='320' y='140' font-size='11' fill='var(--warn)' text-anchor='middle'>controlled by the operating system (below)</text><line x1='220' y1='190' x2='420' y2='190' stroke='var(--accent)' stroke-width='2' marker-end='url(#arr)'/><text x='320' y='184' font-size='11' fill='var(--accent)' text-anchor='middle'>Internet</text><text x='320' y='250' font-size='11' fill='var(--muted)' text-anchor='middle'>Socket API = the door between an application process and the transport layer (WB-L08 p15)</text></svg>",
     "caption": "WB-L08 p15: Application → Socket API → Transport layer. A process is addressed by (IP address, port number)."
    },
    {
     "type": "callout",
     "kind": "key",
     "title": "Socket API (WB-L08 p15)",
     "html": "<p>The socket API is the toolkit that lets an application talk to the transport layer; it is the bridge an app uses to reach other systems with TCP or UDP. Kurose's picture: the socket is the <b>door</b> of the house (process). The developer controls everything above the door (what to send); the OS controls TCP/UDP below it, with only a few knobs (buffer sizes, timeouts) exposed. In Python: <code>socket.socket(AF_INET, SOCK_STREAM)</code> is a TCP socket, <code>SOCK_DGRAM</code> is UDP; a server calls <code>bind</code>, <code>listen</code>, <code>accept</code>; a client calls <code>connect</code>, then both use <code>send</code>/<code>recv</code>.</p>"
    },
    {
     "type": "cheat",
     "title": "Architectures and the application layer",
     "items": [
      "Client/server: server always on, fixed IP + well-known port; clients never talk to each other.",
      "P2P: peers are both client and server; self-scalable; hard to manage (churn, NAT, security).",
      "Full mesh of $n$ peers: $\\frac{n(n-1)}{2}$ links; star (client/server): $n$ links.",
      "Process address = IP address + port number; socket = door between process and transport.",
      "An app protocol defines message types, syntax, semantics and rules.",
      "Ports: HTTP 80, HTTPS 443, FTP 21/20, SSH 22, Telnet 23, SMTP 25/587, DNS 53, DHCP 67/68, POP3 110, IMAP 143, SNMP 161."
     ]
    },
    {
     "type": "traps",
     "items": [
      "\"P2P has no servers\" is wrong: every peer <b>runs</b> server code; there is just no <i>dedicated</i> always-on server.",
      "Client vs server is about <b>who initiates</b>, not about hardware power.",
      "The socket API is an <b>interface</b>, not a protocol; it sits between layer 7 and layer 4.",
      "A web <b>server</b> listens on 80/443, but the <b>client</b> uses an ephemeral source port (49152–65535 on most systems).",
      "DNS is an application-layer protocol that normally runs over <b>UDP</b>, so \"every application protocol uses TCP\" is false."
     ]
    }
   ],
   "practice": [
    {
     "id": "u05-A-1",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "05.1",
     "q": "<p>Which statement best describes the Peer-to-Peer architecture (WB-L05 p6)?</p>",
     "options": [
      "A central server stores all data and serves dependent clients",
      "Every device acts as both client and server with equal privileges",
      "Peers must first log in to a tracker server that relays all data",
      "Only one peer may upload at a time"
     ],
     "answer": 1,
     "why": [
      "That is the client/server definition from p5.",
      "Correct: decentralised, peers are both clients and servers.",
      "Trackers (in BitTorrent) only introduce peers; data flows directly between peers.",
      "Many peers upload in parallel; that is how P2P self-scales."
     ],
     "explain": "<p>P2P = decentralised, equal peers. Client/server = centralised, dependent clients.</p>"
    },
    {
     "id": "u05-A-2",
     "type": "num",
     "tag": "GATE-style",
     "topic": "05.1",
     "q": "<p>A study group of <b>10</b> laptops is connected as a full P2P mesh. How many direct links are needed? (integer)</p>",
     "answer": 45,
     "tol": 0,
     "unit": "links",
     "verify": "10*9//2",
     "steps": [
      {
       "tex": "L = \\frac{n(n-1)}{2}",
       "why": "Every pair needs one link."
      },
      {
       "tex": "L = \\frac{10\\times9}{2} = 45",
       "why": "Substitute n = 10."
      }
     ],
     "explain": "<p>45 links, against only 10 if a central server were used.</p>",
     "formula": "L=\\frac{n(n-1)}{2}"
    },
    {
     "id": "u05-A-3",
     "type": "msq",
     "tag": "University-Midsem-style",
     "topic": "05.2",
     "q": "<p>Which of these application-layer protocols normally run over <b>TCP</b>? (Select all that apply.)</p>",
     "options": [
      "HTTP/1.1",
      "SMTP",
      "DNS query for an A record",
      "FTP",
      "DHCP"
     ],
     "answer": [
      0,
      1,
      3
     ],
     "why": [
      "HTTP/1.1 and HTTP/2 use TCP (port 80/443).",
      "SMTP uses TCP 25/587.",
      "A normal DNS query uses UDP 53; TCP is used only for large replies or zone transfers.",
      "FTP uses TCP 21 for control and a separate TCP data connection.",
      "DHCP uses UDP 67/68 because the client has no IP address yet."
     ],
     "explain": "<p>HTTP/1.1, SMTP and FTP need reliable byte streams; DNS and DHCP are short request/response exchanges over UDP.</p>"
    },
    {
     "id": "u05-A-4",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "05.3",
     "q": "<p>The socket API sits between which two layers?</p>",
     "options": [
      "Physical and data link",
      "Network and transport",
      "Application and transport",
      "Session and presentation"
     ],
     "answer": 2,
     "why": [
      "Those are handled by the NIC and its driver.",
      "IP is below the OS boundary; apps never call IP directly with normal sockets.",
      "Correct: WB-L08 p15 draws Application → Socket API → Transport.",
      "The TCP/IP model folds these into the application layer; the socket is below them."
     ],
     "explain": "<p>The socket is the door between an application process and TCP/UDP.</p>"
    },
    {
     "id": "u05-A-5",
     "type": "mcq",
     "tag": "GATE-style",
     "topic": "05.1",
     "q": "<p>In a BitTorrent swarm, peer X downloads a chunk from peer Y. For this one exchange, which process is the <b>server</b>?</p>",
     "options": [
      "X, because it receives the data",
      "Y, because it waits to be contacted and supplies the chunk",
      "Neither: P2P has no servers",
      "The tracker"
     ],
     "answer": 1,
     "why": [
      "The receiver initiated the request, so it is the client.",
      "Correct: the process that waits to be contacted is the server for that session.",
      "Peers run server code; there is just no dedicated server.",
      "The tracker only lists peers; it is not part of the chunk transfer."
     ],
     "explain": "<p>Kurose §2.1: in the context of a communication session, the initiator is the client and the one contacted is the server, even in P2P.</p>"
    },
    {
     "id": "u05-A-6",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "05.1",
     "q": "<p>Predict the exact output.</p>",
     "code": "def links(n):\n    return n * (n - 1) // 2\n\nprint(links(4), links(10), links(100))",
     "answer": "6 45 4950",
     "runCheck": true,
     "explain": "<p>4·3/2 = 6, 10·9/2 = 45, 100·99/2 = 4950.</p>"
    }
   ]
  },
  {
   "id": "05-B",
   "title": "HTTP Messages: Request and Response Anatomy, Methods and Status Codes",
   "badge": "class",
   "source": "WB-L05 p13–23; WB-L08 p16–27",
   "covers": [
    "05.4",
    "05.5",
    "05.6"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "A form letter with a fixed layout",
     "html": "<p><b>Analogy.</b> An HTTP message is a typed form: line 1 says what you want (\"GET this page, I speak HTTP/1.1\"), then labelled fields (\"Host: example.com\"), then one <b>empty line</b>, then the enclosure (the body). The empty line is how the reader knows the labelled part has ended.</p><p><b>Definition (WB-L05 p13; RFC 9110/9112).</b> HTTP is a <b>stateless request–response</b> protocol: the client (browser) sends a request, the server processes it and sends back a response, each exchange is independent and the server remembers nothing between requests. HTTP/1.1 runs over TCP (port 80; HTTPS 443). WB-L08 p17 lists the four stages of a transaction: <b>Connection → Request → Response → Close</b>.</p><p>Wire format (RFC 9112 §2.1): <code>start-line CRLF</code>, then zero or more <code>field-name: field-value CRLF</code>, then an empty <code>CRLF</code>, then the optional body. CR = byte 13 (<code>\\r</code>), LF = byte 10 (<code>\\n</code>).</p>"
    },
    {
     "type": "figure",
     "html": "<svg viewBox='0 0 640 230' width='100%' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'><text x='320' y='18' font-size='13' fill='currentColor' text-anchor='middle' font-weight='bold'>HTTP request message (RFC 9112 section 2.1)</text><rect x='110' y='34' width='70' height='28' rx='2' fill='none' stroke='var(--accent)' stroke-width='1.6'/><text x='145' y='52' font-size='11' fill='currentColor' text-anchor='middle'>method</text><rect x='180' y='34' width='30' height='28' rx='2' fill='none' stroke='var(--accent)' stroke-width='1.6'/><text x='195' y='52' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>sp</text><rect x='210' y='34' width='110' height='28' rx='2' fill='none' stroke='var(--accent)' stroke-width='1.6'/><text x='265' y='52' font-size='11' fill='currentColor' text-anchor='middle'>URL</text><rect x='320' y='34' width='30' height='28' rx='2' fill='none' stroke='var(--accent)' stroke-width='1.6'/><text x='335' y='52' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>sp</text><rect x='350' y='34' width='80' height='28' rx='2' fill='none' stroke='var(--accent)' stroke-width='1.6'/><text x='390' y='52' font-size='11' fill='currentColor' text-anchor='middle'>version</text><rect x='430' y='34' width='30' height='28' rx='2' fill='none' stroke='var(--accent)' stroke-width='1.6'/><text x='445' y='52' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>cr</text><rect x='460' y='34' width='30' height='28' rx='2' fill='none' stroke='var(--accent)' stroke-width='1.6'/><text x='475' y='52' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>lf</text><text x='100' y='52' font-size='11' fill='var(--accent)' text-anchor='end'>request line</text><rect x='110' y='68' width='150' height='28' rx='2' fill='none' stroke='var(--warn)' stroke-width='1.6'/><text x='185' y='86' font-size='11' fill='currentColor' text-anchor='middle'>header field name</text><rect x='260' y='68' width='26' height='28' rx='2' fill='none' stroke='var(--warn)' stroke-width='1.6'/><text x='273' y='86' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>:</text><rect x='286' y='68' width='158' height='28' rx='2' fill='none' stroke='var(--warn)' stroke-width='1.6'/><text x='365' y='86' font-size='11' fill='currentColor' text-anchor='middle'>value</text><rect x='444' y='68' width='23' height='28' rx='2' fill='none' stroke='var(--warn)' stroke-width='1.6'/><text x='455.5' y='86' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>cr</text><rect x='467' y='68' width='23' height='28' rx='2' fill='none' stroke='var(--warn)' stroke-width='1.6'/><text x='478.5' y='86' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>lf</text><text x='100' y='86' font-size='11' fill='var(--warn)' text-anchor='end'>header line</text><rect x='110' y='102' width='150' height='28' rx='2' fill='none' stroke='var(--warn)' stroke-width='1.6'/><text x='185' y='120' font-size='11' fill='currentColor' text-anchor='middle'>header field name</text><rect x='260' y='102' width='26' height='28' rx='2' fill='none' stroke='var(--warn)' stroke-width='1.6'/><text x='273' y='120' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>:</text><rect x='286' y='102' width='158' height='28' rx='2' fill='none' stroke='var(--warn)' stroke-width='1.6'/><text x='365' y='120' font-size='11' fill='currentColor' text-anchor='middle'>value</text><rect x='444' y='102' width='23' height='28' rx='2' fill='none' stroke='var(--warn)' stroke-width='1.6'/><text x='455.5' y='120' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>cr</text><rect x='467' y='102' width='23' height='28' rx='2' fill='none' stroke='var(--warn)' stroke-width='1.6'/><text x='478.5' y='120' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>lf</text><text x='100' y='120' font-size='11' fill='var(--warn)' text-anchor='end'>header line</text><rect x='110' y='136' width='30' height='28' rx='2' fill='none' stroke='var(--muted)' stroke-width='1.6'/><text x='125' y='154' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>cr</text><rect x='140' y='136' width='30' height='28' rx='2' fill='none' stroke='var(--muted)' stroke-width='1.6'/><text x='155' y='154' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>lf</text><text x='100' y='154' font-size='11' fill='var(--muted)' text-anchor='end'>blank line</text><rect x='110' y='170' width='380' height='28' rx='2' fill='none' stroke='var(--ok)' stroke-width='1.6'/><text x='300' y='188' font-size='11' fill='currentColor' text-anchor='middle'>entity body (optional: form data / JSON for POST, PUT, PATCH)</text><text x='100' y='188' font-size='11' fill='var(--ok)' text-anchor='end'>body</text><text x='110' y='218' font-size='11' fill='var(--muted)' text-anchor='start' font-family='monospace'>e.g.  GET /index.html HTTP/1.1\\r\\nHost: example.com\\r\\n\\r\\n</text></svg>",
     "caption": "Request message (WB-L05 p15; WB-L08 p20): request line = method SP URL SP version CRLF; header lines; blank line; optional body."
    },
    {
     "type": "table",
     "head": [
      "Part (WB-L05 p16–18)",
      "What it holds",
      "Example from the slide"
     ],
     "rows": [
      [
       "Method",
       "type of operation",
       "GET, POST, PUT, DELETE (also HEAD, PATCH, OPTIONS)"
      ],
      [
       "URL (request target)",
       "resource / endpoint on that server",
       "/index.html, /api/data"
      ],
      [
       "HTTP version",
       "protocol version the client speaks",
       "HTTP/1.1"
      ],
      [
       "Host",
       "domain name of the server (mandatory in HTTP/1.1)",
       "Host: example.com"
      ],
      [
       "User-Agent",
       "client software (browser, app)",
       "User-Agent: Chrome"
      ],
      [
       "Accept / Accept-Language",
       "media types and languages the client can handle",
       "Accept: text/html, application/json; Accept-Language: en-us"
      ],
      [
       "Content-Type",
       "type of the body the client is sending (POST/PUT)",
       "Content-Type: application/json"
      ],
      [
       "Body (optional)",
       "data for POST, PUT, PATCH",
       "{ \"username\": \"user1\", \"password\": \"password123\" }"
      ]
     ],
     "caption": "Request line, common request headers and body."
    },
    {
     "type": "figure",
     "html": "<svg viewBox='0 0 640 230' width='100%' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'><text x='320' y='18' font-size='13' fill='currentColor' text-anchor='middle' font-weight='bold'>HTTP response message</text><rect x='110' y='34' width='80' height='28' rx='2' fill='none' stroke='var(--accent)' stroke-width='1.6'/><text x='150' y='52' font-size='11' fill='currentColor' text-anchor='middle'>version</text><rect x='190' y='34' width='30' height='28' rx='2' fill='none' stroke='var(--accent)' stroke-width='1.6'/><text x='205' y='52' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>sp</text><rect x='220' y='34' width='90' height='28' rx='2' fill='none' stroke='var(--accent)' stroke-width='1.6'/><text x='265' y='52' font-size='11' fill='currentColor' text-anchor='middle'>status code</text><rect x='310' y='34' width='30' height='28' rx='2' fill='none' stroke='var(--accent)' stroke-width='1.6'/><text x='325' y='52' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>sp</text><rect x='340' y='34' width='110' height='28' rx='2' fill='none' stroke='var(--accent)' stroke-width='1.6'/><text x='395' y='52' font-size='11' fill='currentColor' text-anchor='middle'>reason phrase</text><rect x='450' y='34' width='30' height='28' rx='2' fill='none' stroke='var(--accent)' stroke-width='1.6'/><text x='465' y='52' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>cr</text><rect x='480' y='34' width='30' height='28' rx='2' fill='none' stroke='var(--accent)' stroke-width='1.6'/><text x='495' y='52' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>lf</text><text x='100' y='52' font-size='11' fill='var(--accent)' text-anchor='end'>status line</text><rect x='110' y='68' width='150' height='28' rx='2' fill='none' stroke='var(--warn)' stroke-width='1.6'/><text x='185' y='86' font-size='11' fill='currentColor' text-anchor='middle'>header field name</text><rect x='260' y='68' width='26' height='28' rx='2' fill='none' stroke='var(--warn)' stroke-width='1.6'/><text x='273' y='86' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>:</text><rect x='286' y='68' width='158' height='28' rx='2' fill='none' stroke='var(--warn)' stroke-width='1.6'/><text x='365' y='86' font-size='11' fill='currentColor' text-anchor='middle'>value</text><rect x='444' y='68' width='23' height='28' rx='2' fill='none' stroke='var(--warn)' stroke-width='1.6'/><text x='455.5' y='86' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>cr</text><rect x='467' y='68' width='23' height='28' rx='2' fill='none' stroke='var(--warn)' stroke-width='1.6'/><text x='478.5' y='86' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>lf</text><text x='100' y='86' font-size='11' fill='var(--warn)' text-anchor='end'>header line</text><rect x='110' y='102' width='150' height='28' rx='2' fill='none' stroke='var(--warn)' stroke-width='1.6'/><text x='185' y='120' font-size='11' fill='currentColor' text-anchor='middle'>header field name</text><rect x='260' y='102' width='26' height='28' rx='2' fill='none' stroke='var(--warn)' stroke-width='1.6'/><text x='273' y='120' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>:</text><rect x='286' y='102' width='158' height='28' rx='2' fill='none' stroke='var(--warn)' stroke-width='1.6'/><text x='365' y='120' font-size='11' fill='currentColor' text-anchor='middle'>value</text><rect x='444' y='102' width='23' height='28' rx='2' fill='none' stroke='var(--warn)' stroke-width='1.6'/><text x='455.5' y='120' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>cr</text><rect x='467' y='102' width='23' height='28' rx='2' fill='none' stroke='var(--warn)' stroke-width='1.6'/><text x='478.5' y='120' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>lf</text><text x='100' y='120' font-size='11' fill='var(--warn)' text-anchor='end'>header line</text><rect x='110' y='136' width='30' height='28' rx='2' fill='none' stroke='var(--muted)' stroke-width='1.6'/><text x='125' y='154' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>cr</text><rect x='140' y='136' width='30' height='28' rx='2' fill='none' stroke='var(--muted)' stroke-width='1.6'/><text x='155' y='154' font-size='11' fill='currentColor' text-anchor='middle' font-family='monospace'>lf</text><text x='100' y='154' font-size='11' fill='var(--muted)' text-anchor='end'>blank line</text><rect x='110' y='170' width='400' height='28' rx='2' fill='none' stroke='var(--ok)' stroke-width='1.6'/><text x='310' y='188' font-size='11' fill='currentColor' text-anchor='middle'>entity body (HTML, JSON, image bytes); length = Content-Length</text><text x='100' y='188' font-size='11' fill='var(--ok)' text-anchor='end'>body</text><text x='110' y='218' font-size='11' fill='var(--muted)' text-anchor='start' font-family='monospace'>e.g.  HTTP/1.1 200 OK\\r\\nContent-Length: 57\\r\\n\\r\\n<html></text></svg>",
     "caption": "Response message (WB-L05 p20; WB-L08 p24): status line = version SP status-code SP reason-phrase CRLF; headers; blank line; body."
    },
    {
     "type": "table",
     "head": [
      "Class (WB-L05 p21)",
      "Meaning",
      "Codes to know"
     ],
     "rows": [
      [
       "1xx",
       "Informational",
       "100 Continue, 101 Switching Protocols (upgrade to WebSocket)"
      ],
      [
       "2xx",
       "Success",
       "200 OK, 201 Created (POST made a resource, with a Location header), 204 No Content (success, no body)"
      ],
      [
       "3xx",
       "Redirection",
       "301 Moved Permanently, 302 Found (temporary), 304 Not Modified (cached copy still valid)"
      ],
      [
       "4xx",
       "Client error",
       "400 Bad Request, 401 Unauthorized (not logged in), 403 Forbidden (logged in but not allowed), 404 Not Found, 405 Method Not Allowed"
      ],
      [
       "5xx",
       "Server error",
       "500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 505 HTTP Version Not Supported"
      ]
     ],
     "caption": "Status codes are 3 digits; the first digit is the class."
    },
    {
     "type": "table",
     "head": [
      "Method",
      "CRUD",
      "Request body?",
      "Safe?",
      "Idempotent?"
     ],
     "rows": [
      [
       "GET",
       "Read",
       "no",
       "yes",
       "yes"
      ],
      [
       "HEAD",
       "Read headers only",
       "no",
       "yes",
       "yes"
      ],
      [
       "POST",
       "Create",
       "yes",
       "no",
       "no"
      ],
      [
       "PUT",
       "Replace (or create at a known URL)",
       "yes",
       "no",
       "yes"
      ],
      [
       "PATCH",
       "Partial update",
       "yes",
       "no",
       "no (not guaranteed)"
      ],
      [
       "DELETE",
       "Delete",
       "usually no",
       "no",
       "yes"
      ],
      [
       "OPTIONS",
       "Ask which methods are allowed",
       "no",
       "yes",
       "yes"
      ]
     ],
     "caption": "RFC 9110 §9.2: safe = read-only; idempotent = sending it twice leaves the server in the same state as sending it once."
    },
    {
     "type": "callout",
     "kind": "slidefix",
     "title": "WB-L05 p20: Content-Length 88 for a 57-byte body",
     "html": "<p>The slide's response says <code>Content-Length: 88</code>, but its body <code>&lt;html&gt;&lt;body&gt;&lt;h1&gt;Welcome to Example.com&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;</code> is <b>57 bytes</b>: 6 + 6 + 4 + 22 + 5 + 7 + 7. Content-Length must be the <b>exact number of body bytes</b> (not counting headers or the blank line). With 88 a client would wait for 31 bytes that never arrive (and time out), or on a keep-alive connection swallow the start of the next response.</p>"
    },
    {
     "type": "callout",
     "kind": "slidefix",
     "title": "WB-L08 p24 (and p51): weekday and Connection token",
     "html": "<p>The slide prints <code>Date: Mon, 18 Dec 2024 10:25:30 GMT</code>. 18 December 2024 was a <b>Wednesday</b>, so the header should read <code>Date: Wed, 18 Dec 2024 10:25:30 GMT</code> (RFC 9110 §5.6.7 IMF-fixdate). It also prints <code>Connection: Closed</code>; the standard token is <b><code>Connection: close</code></b> (RFC 9112 §9.6). The slide's <code>Content-Length: 88</code> there is illustrative too: the JSON body is cut off with \"(More data)\", so the true length cannot be checked.</p>"
    },
    {
     "type": "callout",
     "kind": "slidefix",
     "title": "WB-L08 p27 (and p54): body example labelled \"css\"",
     "html": "<p>The code box is tagged <i>css</i>, but <code>&lt;html&gt;&lt;body&gt;&lt;h1&gt;Welcome to Example.com&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;</code> is <b>HTML</b>; its response header would be <code>Content-Type: text/html</code>. A CSS body would be served as <code>Content-Type: text/css</code>.</p>"
    },
    {
     "type": "derivation",
     "title": "Counting the bytes of the slide request (WB-L05 p15)",
     "steps": [
      {
       "tex": "\\text{bytes(line)} = \\text{characters} + 2",
       "why": "Every line on the wire ends with CR LF, two bytes."
      },
      {
       "tex": "\\text{GET /index.html HTTP/1.1}: 3+1+11+1+8 = 24 \\Rightarrow 26",
       "why": "Method, space, URL, space, version, then CRLF."
      },
      {
       "tex": "\\text{Host: example.com}: 17 \\Rightarrow 19",
       "why": "\"Host:\" (5) + space (1) + \"example.com\" (11)."
      },
      {
       "tex": "\\text{User-Agent: Chrome}: 18 \\Rightarrow 20",
       "why": "\"User-Agent:\" (11) + space + \"Chrome\" (6)."
      },
      {
       "tex": "\\text{Accept-Language: en-us}: 22 \\Rightarrow 24",
       "why": "\"Accept-Language:\" (16) + space + \"en-us\" (5)."
      },
      {
       "tex": "\\text{blank line} = 2",
       "why": "The empty CRLF that ends the header section."
      },
      {
       "tex": "26+19+20+24+2 = 91 \\text{ bytes}",
       "why": "No body on a GET, so the whole request is 91 bytes."
      }
     ]
    },
    {
     "type": "worked",
     "title": "Content-Length and total size of the WB-L05 p20 response",
     "tag": "University-Midsem-style",
     "problem": "<p>The server replies with status line <code>HTTP/1.1 200 OK</code>, headers <code>Content-Type: text/html</code>, <code>Content-Length: ?</code>, <code>Server: Apache/2.4.2</code>, a blank line and the body <code>&lt;html&gt;&lt;body&gt;&lt;h1&gt;Welcome to Example.com&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;</code>. (a) What must Content-Length be? (b) How many bytes is the whole response on the wire?</p>",
     "steps": [
      {
       "tex": "6+6+4+22+5+7+7 = 57",
       "why": "Count the body piece by piece: <html> 6, <body> 6, <h1> 4, \"Welcome to Example.com\" 22, </h1> 5, </body> 7, </html> 7."
      },
      {
       "text": "Content-Length: 57 (two digits, so the header line is 18 characters).",
       "why": "Content-Length counts only the body bytes."
      },
      {
       "tex": "17 + 25 + 20 + 22 + 2 = 86",
       "why": "Status line 15+2, Content-Type 23+2, Content-Length 18+2, Server 20+2, blank line 2."
      },
      {
       "tex": "86 + 57 = 143 \\text{ bytes}",
       "why": "Header section plus body."
      }
     ],
     "answer": "<p>(a) <b>Content-Length: 57</b> (the slide's 88 is wrong). (b) <b>143 bytes</b> in total.</p>"
    },
    {
     "type": "cheat",
     "title": "Message anatomy",
     "items": [
      "Request line: <code>METHOD SP URL SP VERSION CRLF</code>; status line: <code>VERSION SP CODE SP REASON CRLF</code>.",
      "Header line: <code>Name: value CRLF</code>; names are case-insensitive; the header section ends with an empty CRLF.",
      "Content-Length = body bytes only (UTF-8 bytes, not characters).",
      "HTTP/1.1 requires <code>Host</code>; a request without it gets 400.",
      "1xx info, 2xx success, 3xx redirect, 4xx client error, 5xx server error. 201 Created, 204 No Content, 301 permanent, 302 temporary, 304 not modified, 401 not authenticated, 403 not allowed.",
      "Safe: GET, HEAD, OPTIONS. Idempotent: those plus PUT, DELETE. POST is neither."
     ]
    },
    {
     "type": "code",
     "file": "Unit05_raw_http.py",
     "level": "low",
     "title": "Raw-socket HTTP/1.1 client and hand-parsing server (keep-alive, Content-Length, 404, 400)",
     "note": "The server reads to CRLF CRLF, splits the request line, parses headers into a dict, reads exactly Content-Length body bytes and computes its own Content-Length with len(). Two requests travel on one TCP connection."
    },
    {
     "type": "traps",
     "items": [
      "Lines end with <b>CRLF</b> (<code>\\r\\n</code>), not just <code>\\n</code>; byte counts add 2 per line.",
      "The blank line is mandatory even when there is no body.",
      "Content-Length counts the <b>body only</b>; headers and the blank line are not included.",
      "\"café\" is 4 characters but 5 UTF-8 bytes; Content-Length uses bytes.",
      "401 Unauthorized means <b>not authenticated</b>; 403 Forbidden means authenticated (or not needed) but <b>not allowed</b>.",
      "301 is permanent (browsers and search engines update the link); 302 is temporary.",
      "A 404 is a <b>client</b> error (wrong URL); a crash in server code is 500."
     ]
    }
   ],
   "practice": [
    {
     "id": "u05-B-1",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "05.5",
     "q": "<p>How does an HTTP/1.1 receiver know where the header section ends?</p>",
     "options": [
      "The Content-Length header",
      "An empty line (CRLF immediately after the last header's CRLF)",
      "The TCP FIN flag",
      "A NUL byte"
     ],
     "answer": 1,
     "why": [
      "Content-Length tells where the <b>body</b> ends, not where the headers end.",
      "Correct: CRLF CRLF marks the end of the header section.",
      "FIN closes the connection; on a keep-alive connection there is no FIN between messages.",
      "HTTP/1.1 is text; there is no NUL delimiter."
     ],
     "explain": "<p>Read until <code>\\r\\n\\r\\n</code>, parse the headers, then read Content-Length body bytes.</p>"
    },
    {
     "id": "u05-B-2",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "05.5",
     "q": "<p>A POST carries the body <code>{ \"username\": \"user1\", \"password\": \"password123\" }</code> exactly as shown (with one space after <code>{</code> and before <code>}</code>, ASCII only). What Content-Length must the client send? (bytes, integer)</p>",
     "answer": 50,
     "tol": 0,
     "unit": "bytes",
     "verify": "len('{ \"username\": \"user1\", \"password\": \"password123\" }')",
     "steps": [
      {
       "tex": "\\{\\text{sp} = 2,\\ \\text{\"username\": } = 12,\\ \\text{\"user1\", } = 9",
       "why": "Opening brace and space; the key with quotes, colon and space; the value with quotes, comma and space."
      },
      {
       "tex": "\\text{\"password\": } = 12,\\ \\text{\"password123\"} = 13,\\ \\text{sp}\\} = 2",
       "why": "Second key; second value with its quotes; final space and brace."
      },
      {
       "tex": "2+12+9+12+13+2 = 50",
       "why": "Total body bytes (ASCII, so 1 byte per character)."
      }
     ],
     "explain": "<p>50 bytes. In Python: <code>len(body.encode())</code>.</p>"
    },
    {
     "id": "u05-B-3",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "05.6",
     "q": "<p>A client POSTs a new user to <code>/users</code> and the server stores it as <code>/users/101</code>. The best response status line is</p>",
     "options": [
      "HTTP/1.1 200 OK",
      "HTTP/1.1 201 Created (with Location: /users/101)",
      "HTTP/1.1 204 No Content",
      "HTTP/1.1 302 Found"
     ],
     "answer": 1,
     "why": [
      "Acceptable but less precise: 200 does not say a resource was created.",
      "Correct: 201 Created plus a Location header pointing at the new resource (WB-L08 p24 uses 201).",
      "204 means success with no body; it does not report creation.",
      "302 is a temporary redirect."
     ],
     "explain": "<p>201 Created is the REST convention for a successful POST that creates a resource.</p>"
    },
    {
     "id": "u05-B-4",
     "type": "msq",
     "tag": "University-Midsem-style",
     "topic": "05.6",
     "q": "<p>Which status codes report a <b>client-side</b> error? (Select all that apply.)</p>",
     "options": [
      "400",
      "403",
      "404",
      "500",
      "503"
     ],
     "answer": [
      0,
      1,
      2
     ],
     "why": [
      "Bad Request: malformed syntax from the client.",
      "Forbidden: the client is not allowed.",
      "Not Found: the client asked for a URL that does not exist.",
      "Internal Server Error is 5xx.",
      "Service Unavailable (overloaded or down) is 5xx."
     ],
     "explain": "<p>4xx = client error, 5xx = server error.</p>"
    },
    {
     "id": "u05-B-5",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "05.5",
     "q": "<p>How many bytes does the request line <code>GET /api/data HTTP/1.1</code> occupy on the wire, including its line terminator? (integer)</p>",
     "answer": 24,
     "tol": 0,
     "unit": "bytes",
     "verify": "len('GET /api/data HTTP/1.1') + 2",
     "steps": [
      {
       "tex": "3 + 1 + 9 + 1 + 8 = 22",
       "why": "GET, space, /api/data, space, HTTP/1.1."
      },
      {
       "tex": "22 + 2 = 24",
       "why": "Add CR and LF."
      }
     ],
     "explain": "<p>24 bytes.</p>"
    },
    {
     "id": "u05-B-6",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "05.5",
     "q": "<p>Predict the exact output of this hand parser.</p>",
     "code": "raw = b'GET /index.html HTTP/1.1\\r\\nHost: example.com\\r\\nUser-Agent: Chrome\\r\\n\\r\\n'\nhead, _, body = raw.partition(b'\\r\\n\\r\\n')\nlines = head.decode().split('\\r\\n')\nmethod, target, version = lines[0].split(' ')\nheaders = dict(l.split(': ', 1) for l in lines[1:])\nprint(method, target, headers['Host'], len(body), len(raw))",
     "answer": "GET /index.html example.com 0 67",
     "runCheck": true,
     "explain": "<p>The request line splits into exactly 3 parts; the header dict holds Host and User-Agent; nothing follows the blank line, so the body is 0 bytes. Size: request line 24 + 2 = 26, Host line 17 + 2 = 19, User-Agent line 18 + 2 = 20, blank line 2, total 26 + 19 + 20 + 2 = 67 bytes.</p>"
    },
    {
     "id": "u05-B-7",
     "type": "mcq",
     "tag": "GATE-style",
     "topic": "05.6",
     "q": "<p>A logged-in student opens <code>/admin</code> and the server refuses because the account is not an administrator. Which code fits best?</p>",
     "options": [
      "401 Unauthorized",
      "403 Forbidden",
      "404 Not Found",
      "405 Method Not Allowed"
     ],
     "answer": 1,
     "why": [
      "401 means the client has not authenticated (no valid credentials).",
      "Correct: identity is known but access is refused.",
      "The resource exists; hiding it with 404 is possible but not the honest code.",
      "405 is about the HTTP method, not the user's rights."
     ],
     "explain": "<p>401 = who are you? 403 = I know who you are, and the answer is no.</p>"
    }
   ]
  },
  {
   "id": "05-C",
   "title": "Statelessness and Cookies; HTTP/1.0 vs HTTP/1.1 (Keep-Alive, Host, Pipelining, HoL)",
   "badge": "class",
   "source": "WB-L05 p24–31",
   "covers": [
    "05.7",
    "05.8"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "Delivery trucks (WB-L05 p26–31)",
     "html": "<p><b>Analogy.</b> You order an outfit: shirt, pants, shoes, socks (= the HTML, CSS, JS and images of one page). <b>HTTP/1.0</b> is a truck that carries one item per trip and drives back to HQ before the next one: every file needs a new TCP connection. <b>HTTP/1.1</b> is one truck that stays parked at your door (keep-alive) but unloads strictly one box at a time, in order: if the first box is huge, the small ones wait behind it (<b>head-of-line blocking</b>).</p><p><b>Definitions (Kurose §2.2.2; RFC 9112 §9.3).</b> <i>Non-persistent connection</i>: each request/response pair uses a separate TCP connection that is closed after the response (HTTP/1.0 default, RFC 1945, 1996). <i>Persistent connection</i>: the server leaves the TCP connection open so later requests and responses between the same client and server reuse it (HTTP/1.1 default, 1997). <i>Pipelining</i>: the client sends several requests back to back without waiting for each response; the server must return responses <b>in the same order</b> (FIFO).</p>"
    },
    {
     "type": "callout",
     "kind": "key",
     "title": "Stateless HTTP, stateful shopping cart (WB-L05 p24)",
     "html": "<p>\"If HTTP is stateless, how does your shopping cart stay full?\" — <b>cookies and session tokens</b>. The protocol stays stateless; the <i>application</i> keeps state keyed by an ID that the browser returns on every request. Kurose's four components: (1) a <code>Set-Cookie</code> header in an HTTP <b>response</b>; (2) a <code>Cookie</code> header in later <b>requests</b>; (3) a cookie file kept by the browser; (4) a back-end database at the site. Common attributes: <code>Expires</code>/<code>Max-Age</code>, <code>Domain</code>, <code>Path</code>, <code>Secure</code> (HTTPS only), <code>HttpOnly</code> (not readable by JavaScript), <code>SameSite</code>.</p>"
    },
    {
     "type": "seq",
     "left": "Browser",
     "right": "shop.com server",
     "caption": "Cookie flow: the server issues an ID once; the browser returns it with every request so the server can find the cart.",
     "events": [
      {
       "from": "L",
       "label": "GET /cart (no cookie yet)",
       "note": "first visit"
      },
      {
       "from": "R",
       "label": "200 OK  Set-Cookie: sid=1678",
       "note": "DB row 1678 made"
      },
      {
       "from": "L",
       "label": "POST /cart/add  Cookie: sid=1678",
       "note": "adds shoes"
      },
      {
       "from": "R",
       "label": "200 OK  (cart: shoes)"
      },
      {
       "gap": true,
       "label": "",
       "note": "next day: browser still has the cookie"
      },
      {
       "from": "L",
       "label": "GET /cart  Cookie: sid=1678"
      },
      {
       "from": "R",
       "label": "200 OK  (cart: shoes)",
       "note": "state from DB"
      }
     ]
    },
    {
     "type": "seq",
     "left": "Client",
     "right": "Server",
     "caption": "Non-persistent HTTP (HTTP/1.0, WB-L05 p28): base HTML then one image, each on its own TCP connection. Each object costs 2 RTT plus its transmission time.",
     "events": [
      {
       "from": "L",
       "label": "SYN",
       "note": "RTT 1"
      },
      {
       "from": "R",
       "label": "SYN-ACK"
      },
      {
       "from": "L",
       "label": "ACK + GET /index.html",
       "note": "RTT 2"
      },
      {
       "from": "R",
       "label": "200 OK (index.html), then FIN"
      },
      {
       "gap": true,
       "label": "",
       "note": "browser parses HTML, finds img.png"
      },
      {
       "from": "L",
       "label": "SYN (new connection)",
       "note": "RTT 3"
      },
      {
       "from": "R",
       "label": "SYN-ACK"
      },
      {
       "from": "L",
       "label": "ACK + GET /img.png",
       "note": "RTT 4"
      },
      {
       "from": "R",
       "label": "200 OK (img.png), then FIN"
      }
     ]
    },
    {
     "type": "seq",
     "left": "Client",
     "right": "Server",
     "caption": "Persistent HTTP/1.1 without pipelining (WB-L05 p29): one handshake, then one RTT per object.",
     "events": [
      {
       "from": "L",
       "label": "SYN",
       "note": "RTT 1"
      },
      {
       "from": "R",
       "label": "SYN-ACK"
      },
      {
       "from": "L",
       "label": "ACK + GET /index.html",
       "note": "RTT 2"
      },
      {
       "from": "R",
       "label": "200 OK (index.html)"
      },
      {
       "from": "L",
       "label": "GET /style.css",
       "note": "RTT 3"
      },
      {
       "from": "R",
       "label": "200 OK (style.css)"
      },
      {
       "from": "L",
       "label": "GET /img.png",
       "note": "RTT 4"
      },
      {
       "from": "R",
       "label": "200 OK (img.png)"
      }
     ]
    },
    {
     "type": "seq",
     "left": "Client",
     "right": "Server",
     "caption": "Persistent HTTP/1.1 with pipelining (WB-L05 p31): requests leave back to back; responses return in the same FIFO order.",
     "events": [
      {
       "from": "L",
       "label": "SYN",
       "note": "RTT 1"
      },
      {
       "from": "R",
       "label": "SYN-ACK"
      },
      {
       "from": "L",
       "label": "ACK + GET /index.html",
       "note": "RTT 2"
      },
      {
       "from": "R",
       "label": "200 OK (index.html)"
      },
      {
       "from": "L",
       "label": "GET /style.css",
       "note": "RTT 3 starts"
      },
      {
       "from": "L",
       "label": "GET /img.png (no waiting)"
      },
      {
       "from": "R",
       "label": "200 OK (style.css)"
      },
      {
       "from": "R",
       "label": "200 OK (img.png)",
       "note": "same order"
      }
     ]
    },
    {
     "type": "figure",
     "html": "<svg viewBox='0 0 640 264' width='100%' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'><defs><marker id='arr' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='currentColor'/></marker></defs><text x='320' y='16' font-size='13' fill='currentColor' text-anchor='middle' font-weight='bold'>Head-of-line blocking: same 4 responses, two delivery orders</text><line x1='150' y1='222' x2='600' y2='222' stroke='currentColor' stroke-width='1.5' marker-end='url(#arr)'/><line x1='150' y1='218' x2='150' y2='226' stroke='currentColor' stroke-width='1.5'/><text x='150' y='238' font-size='10' fill='currentColor' text-anchor='middle'>0 ms</text><line x1='240' y1='218' x2='240' y2='226' stroke='currentColor' stroke-width='1.5'/><text x='240' y='238' font-size='10' fill='currentColor' text-anchor='middle'>100 ms</text><line x1='330' y1='218' x2='330' y2='226' stroke='currentColor' stroke-width='1.5'/><text x='330' y='238' font-size='10' fill='currentColor' text-anchor='middle'>200 ms</text><line x1='420' y1='218' x2='420' y2='226' stroke='currentColor' stroke-width='1.5'/><text x='420' y='238' font-size='10' fill='currentColor' text-anchor='middle'>300 ms</text><line x1='510' y1='218' x2='510' y2='226' stroke='currentColor' stroke-width='1.5'/><text x='510' y='238' font-size='10' fill='currentColor' text-anchor='middle'>400 ms</text><line x1='600' y1='218' x2='600' y2='226' stroke='currentColor' stroke-width='1.5'/><text x='600' y='238' font-size='10' fill='currentColor' text-anchor='middle'>500 ms</text><text x='140' y='52' font-size='12' fill='currentColor' text-anchor='end' font-weight='bold'>HTTP/1.1</text><text x='140' y='66' font-size='10' fill='var(--muted)' text-anchor='end'>1 connection, FIFO</text><rect x='150' y='42' width='270' height='26' rx='2' fill='var(--bad)' stroke='var(--bad)' stroke-width='2'/><text x='285' y='59' font-size='10' fill='var(--panel)' text-anchor='middle'>slow image</text><rect x='420' y='42' width='27' height='26' rx='2' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='433.5' y='59' font-size='10' fill='currentColor' text-anchor='middle'>CSS</text><rect x='447' y='42' width='27' height='26' rx='2' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='460.5' y='59' font-size='10' fill='currentColor' text-anchor='middle'>JS</text><rect x='474' y='42' width='18' height='26' rx='2' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='483' y='59' font-size='10' fill='currentColor' text-anchor='middle'>icon</text><text x='420' y='86' font-size='10' fill='var(--bad)' text-anchor='start'>CSS, JS, icon were ready at ~30 ms but wait behind the image</text><text x='140' y='118' font-size='12' fill='currentColor' text-anchor='end' font-weight='bold'>HTTP/2</text><text x='140' y='132' font-size='10' fill='var(--muted)' text-anchor='end'>frames interleaved</text><rect x='150' y='104' width='342' height='18' rx='2' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='498' y='117' font-size='10' fill='currentColor' text-anchor='start'>stream 1: image done at 380 ms</text><rect x='150' y='128' width='54' height='18' rx='2' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='210' y='141' font-size='10' fill='currentColor' text-anchor='start'>stream 3: CSS done at 60 ms</text><rect x='150' y='152' width='81' height='18' rx='2' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='237' y='165' font-size='10' fill='currentColor' text-anchor='start'>stream 5: JS done at 90 ms</text><rect x='150' y='176' width='90' height='18' rx='2' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='246' y='189' font-size='10' fill='currentColor' text-anchor='start'>stream 7: icon done at 100 ms</text><text x='320' y='256' font-size='10' fill='var(--muted)' text-anchor='middle'>Bytes on the wire are the same; only the ORDER changes. Small files no longer wait for the big one.</text></svg>",
     "caption": "WB-L05 p30: on ONE HTTP/1.1 connection responses leave in FIFO order, so a slow first response blocks small ones that are already ready."
    },
    {
     "type": "table",
     "head": [
      "Feature",
      "HTTP/1.0 (RFC 1945, 1996)",
      "HTTP/1.1 (RFC 2068 1997, now RFC 9110/9112)"
     ],
     "rows": [
      [
       "Connection",
       "non-persistent: 1 object per TCP connection (keep-alive only as a non-standard extension)",
       "persistent by default; close with <code>Connection: close</code>"
      ],
      [
       "Host header",
       "optional, so one IP = one website",
       "mandatory: many sites share one IP (virtual hosting); missing Host gives 400"
      ],
      [
       "Pipelining",
       "no",
       "allowed but responses are FIFO; browsers ship with it off"
      ],
      [
       "Body framing",
       "Content-Length or close the connection",
       "Content-Length or <code>Transfer-Encoding: chunked</code> (stream without knowing the size)"
      ],
      [
       "Caching",
       "Expires, If-Modified-Since",
       "adds Cache-Control, ETag, If-None-Match"
      ],
      [
       "Other",
       "GET, HEAD, POST",
       "adds PUT, DELETE, OPTIONS, TRACE; 100 Continue; range requests (206)"
      ]
     ],
     "caption": "What HTTP/1.1 fixed (WB-L05 p29: keep-alive, caching and Host headers) and what it left (HoL)."
    },
    {
     "type": "callout",
     "kind": "warning",
     "title": "Pipelining rules (WB-L05 p31)",
     "html": "<p>Responses must arrive in the same order as the requests (FIFO). The slide says only <b>safe</b> methods (GET, HEAD, OPTIONS) are pipelined, never POST/PUT, because those have side effects; RFC 9112 §9.3.2 states the rule as \"do not pipeline after a non-idempotent method\" (so PUT and DELETE are technically allowed, POST is not). In practice browsers disabled pipelining and instead open about <b>6 parallel TCP connections per host</b> (WB-L05 p39) to dodge HoL blocking.</p>"
    },
    {
     "type": "cheat",
     "title": "Versions 1.0 and 1.1",
     "items": [
      "HTTP/1.0: new TCP connection per object, 2 RTT + transmission each.",
      "HTTP/1.1: persistent by default, Host header mandatory, pipelining optional (FIFO).",
      "HoL blocking (application level): a slow response at the head of the queue delays all responses behind it.",
      "Browsers: about 6 parallel connections per origin instead of pipelining.",
      "Cookies: Set-Cookie (response) → Cookie (request); state lives in the server's database, HTTP stays stateless."
     ]
    },
    {
     "type": "traps",
     "items": [
      "Persistent does <b>not</b> mean pipelined: persistent without pipelining still waits one RTT per object.",
      "Pipelining does not cure HoL; FIFO responses <b>cause</b> HoL at the application level.",
      "Cookies do not make the HTTP protocol stateful; the server application keeps the state.",
      "<code>Set-Cookie</code> is sent by the server, <code>Cookie</code> by the client; do not swap them.",
      "HTTP/1.0 had no mandatory Host header, so name-based virtual hosting needs HTTP/1.1."
     ]
    }
   ],
   "practice": [
    {
     "id": "u05-C-1",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "05.7",
     "q": "<p>Which header does a <b>server</b> use to give the browser a session identifier?</p>",
     "options": [
      "Cookie",
      "Set-Cookie",
      "Authorization",
      "Host"
     ],
     "answer": 1,
     "why": [
      "The browser sends Cookie back on later requests.",
      "Correct: Set-Cookie travels in the response.",
      "Authorization carries credentials from the client.",
      "Host names the site in the request."
     ],
     "explain": "<p>Response: Set-Cookie: sid=1678. Following requests: Cookie: sid=1678.</p>"
    },
    {
     "id": "u05-C-2",
     "type": "msq",
     "tag": "University-Midsem-style",
     "topic": "05.8",
     "q": "<p>Which features were introduced as standard in HTTP/1.1? (Select all that apply.)</p>",
     "options": [
      "Persistent connections by default",
      "Mandatory Host header",
      "Binary framing layer",
      "Pipelining",
      "Multiplexed streams over one connection"
     ],
     "answer": [
      0,
      1,
      3
     ],
     "why": [
      "Keep-alive became the default (WB-L05 p29).",
      "Needed for virtual hosting.",
      "Binary framing is HTTP/2.",
      "Optional pipelining with FIFO responses.",
      "Multiplexing is HTTP/2."
     ],
     "explain": "<p>HTTP/1.1: keep-alive, Host, caching headers, pipelining. HTTP/2: binary framing and multiplexing.</p>"
    },
    {
     "id": "u05-C-3",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "05.8",
     "q": "<p>On one pipelined HTTP/1.1 connection a browser requests a 4 MB image, then a 2 KB CSS file. The CSS is ready on the server first. When does the browser get the CSS?</p>",
     "options": [
      "Immediately, before the image",
      "Only after the whole image response has been sent",
      "Never: pipelining forbids two GETs",
      "In parallel, interleaved with the image"
     ],
     "answer": 1,
     "why": [
      "That would break FIFO order.",
      "Correct: responses must leave in request order, so the CSS waits (head-of-line blocking).",
      "Two GETs are exactly what pipelining is for.",
      "Interleaving is HTTP/2 multiplexing, not HTTP/1.1."
     ],
     "explain": "<p>This is the WB-L05 p30 picture: the slow image at the head blocks the ready CSS, JS and icon.</p>"
    },
    {
     "id": "u05-C-4",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "05.8",
     "q": "<p>Why can a single IP address host <code>alpha.com</code> and <code>beta.com</code> under HTTP/1.1 but not under plain HTTP/1.0?</p>",
     "options": [
      "HTTP/1.1 uses a different port per site",
      "HTTP/1.1 requests must carry the Host header naming the site",
      "HTTP/1.1 encrypts the URL",
      "DNS returns a port with the IP"
     ],
     "answer": 1,
     "why": [
      "Both sites use port 80.",
      "Correct: the server picks the site from the Host header (virtual hosting).",
      "HTTP/1.1 is plain text; encryption is TLS.",
      "A records hold only an address."
     ],
     "explain": "<p>Host became mandatory in HTTP/1.1; a request without it is answered with 400 Bad Request.</p>"
    },
    {
     "id": "u05-C-5",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "05.8",
     "q": "<p>WB-L05 p31 says only safe methods may be pipelined. Which request must therefore <b>not</b> be pipelined behind others?</p>",
     "options": [
      "GET /logo.png",
      "HEAD /index.html",
      "OPTIONS /api",
      "POST /checkout"
     ],
     "answer": 3,
     "why": [
      "GET is safe.",
      "HEAD is safe.",
      "OPTIONS is safe.",
      "Correct: POST changes server state, and if the connection breaks the client cannot know whether it ran."
     ],
     "explain": "<p>POST is neither safe nor idempotent, so it is never pipelined.</p>"
    },
    {
     "id": "u05-C-6",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "05.7",
     "q": "<p>Predict the exact output: the server parses a Cookie request header.</p>",
     "code": "hdr = 'Cookie: sid=1678; theme=dark; lang=en'\nvalue = hdr.split(': ', 1)[1]\njar = dict(p.split('=') for p in value.split('; '))\nprint(len(jar), jar['sid'], sorted(jar))",
     "answer": "3 1678 ['lang', 'sid', 'theme']",
     "runCheck": true,
     "explain": "<p>The value splits on <code>'; '</code> into three name=value pairs; sorted() lists the keys alphabetically.</p>"
    }
   ]
  },
  {
   "id": "05-D",
   "title": "Response-Time Math: Non-persistent, Persistent, Pipelined and Parallel HTTP",
   "badge": "researched",
   "source": "Kurose & Ross 8e §2.2.2 and problems P7–P10 style; RFC 9112 §9.3 (WB-L05 p28–31 show the timelines without numbers)",
   "covers": [
    "05.8"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "Count round trips, then add pushing time",
     "html": "<p><b>Analogy.</b> Every question you ask across a table costs one \"there and back\". Opening a TCP connection is one there-and-back (SYN, SYN-ACK); asking for a file is another (request, first byte of reply). Then the reply takes time to <i>pour</i> through the pipe (transmission time $L/R$).</p><p><b>Definition (Kurose §2.2.2).</b> <b>RTT</b> (round-trip time) is the time for a small packet to go from client to server and back. Fetching one object over a <b>new</b> TCP connection takes $2\\,\\text{RTT} + L/R$: one RTT for the handshake, one RTT for the request and the start of the response, plus the transmission time of the file. The third handshake segment (ACK) carries the request, so it costs no extra RTT; the FIN at the end is not counted.</p>"
    },
    {
     "type": "derivation",
     "title": "One object over a new TCP connection",
     "steps": [
      {
       "tex": "t_1 = \\text{RTT}",
       "why": "Client sends SYN; SYN-ACK returns one RTT later."
      },
      {
       "tex": "t_2 = t_1 + \\text{RTT}",
       "why": "Client sends ACK piggybacked with the GET; the first byte of the response comes back one RTT later."
      },
      {
       "tex": "t_3 = t_2 + \\frac{L}{R}",
       "why": "The server must push all L bits onto the link at R bit/s before the last bit leaves."
      },
      {
       "tex": "T_{obj} = 2\\,\\text{RTT} + \\frac{L}{R}",
       "why": "Total response time for one object (non-persistent)."
      }
     ]
    },
    {
     "type": "derivation",
     "title": "Base HTML + N referenced objects in four modes",
     "steps": [
      {
       "tex": "T_{np} = (N+1)\\left(2\\,\\text{RTT}\\right) + T_{base} + N\\,T_{obj}",
       "why": "Non-persistent, serial: every one of the N+1 objects pays its own handshake and request RTT."
      },
      {
       "tex": "T_{np,P} = 2\\,\\text{RTT} + T_{base} + \\left\\lceil \\frac{N}{P} \\right\\rceil \\left(2\\,\\text{RTT} + T_{obj}\\right)",
       "why": "Non-persistent with P parallel connections: objects go in waves of P; each wave costs one handshake + one request (transmission per wave assumes the waves share no bottleneck; with tiny objects it is 0)."
      },
      {
       "tex": "T_{p} = 2\\,\\text{RTT} + T_{base} + N\\left(\\text{RTT} + T_{obj}\\right)",
       "why": "Persistent without pipelining: one handshake only; each later object still waits one RTT for its own request/response."
      },
      {
       "tex": "T_{pp} = 2\\,\\text{RTT} + T_{base} + \\text{RTT} + N\\,T_{obj}",
       "why": "Persistent with pipelining: all N requests leave back to back, so all objects arrive after about one extra RTT plus their transmission times."
      },
      {
       "tex": "N=8,\\ T\\approx 0:\\quad 18,\\ 6\\ (P=6),\\ 10,\\ 3 \\ \\text{RTT}",
       "why": "Plug in very small objects: 2+16, 2+2·2, 2+8, 2+1."
      }
     ]
    },
    {
     "type": "table",
     "head": [
      "Mode",
      "Formula (tiny objects)",
      "N = 8",
      "N = 10, RTT = 50 ms"
     ],
     "rows": [
      [
       "Non-persistent, serial",
       "$2 + 2N$ RTT",
       "18 RTT",
       "22 RTT = 1100 ms"
      ],
      [
       "Non-persistent, P parallel",
       "$2 + 2\\lceil N/P\\rceil$ RTT",
       "6 RTT (P = 6)",
       "6 RTT = 300 ms (P = 5)"
      ],
      [
       "Persistent, no pipelining",
       "$2 + N$ RTT",
       "10 RTT",
       "12 RTT = 600 ms"
      ],
      [
       "Persistent, pipelining",
       "$3$ RTT",
       "3 RTT",
       "3 RTT = 150 ms"
      ]
     ],
     "caption": "Add DNS lookup time (sum of DNS RTTs) on top if the question gives it."
    },
    {
     "type": "chart",
     "title": "Page load time vs number of objects (RTT = 1, objects tiny)",
     "xLabel": "N referenced objects",
     "yLabel": "time (RTT)",
     "x": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10
     ],
     "series": [
      {
       "name": "non-persistent serial",
       "y": [
        2,
        4,
        6,
        8,
        10,
        12,
        14,
        16,
        18,
        20,
        22
       ]
      },
      {
       "name": "non-persistent, 5 parallel",
       "y": [
        2,
        4,
        4,
        4,
        4,
        4,
        6,
        6,
        6,
        6,
        6
       ]
      },
      {
       "name": "persistent, no pipelining",
       "y": [
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12
       ]
      },
      {
       "name": "persistent, pipelining",
       "y": [
        2,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3
       ]
      }
     ]
    },
    {
     "type": "worked",
     "title": "Kurose-style: base page + 10 tiny objects, RTT = 50 ms",
     "tag": "GATE-style",
     "problem": "<p>A page has a base HTML file and 10 small referenced images on the same server. RTT = 50 ms; transmission times are negligible; ignore DNS. Find the time to load the full page with (a) non-persistent serial HTTP, (b) non-persistent HTTP with 5 parallel connections, (c) persistent HTTP without pipelining, (d) persistent HTTP with pipelining.</p>",
     "steps": [
      {
       "tex": "(a)\\ 2 + 2\\times10 = 22\\ \\text{RTT} = 22\\times50 = 1100\\ \\text{ms}",
       "why": "Base: 2 RTT; each image: its own handshake + request = 2 RTT."
      },
      {
       "tex": "(b)\\ 2 + 2\\left\\lceil 10/5 \\right\\rceil = 2 + 4 = 6\\ \\text{RTT} = 300\\ \\text{ms}",
       "why": "Two waves of 5 parallel connections, each wave 2 RTT."
      },
      {
       "tex": "(c)\\ 2 + 10 = 12\\ \\text{RTT} = 600\\ \\text{ms}",
       "why": "One handshake; then 1 RTT per image, one after another."
      },
      {
       "tex": "(d)\\ 2 + 1 = 3\\ \\text{RTT} = 150\\ \\text{ms}",
       "why": "All 10 GETs leave together; all responses back after one RTT."
      }
     ],
     "answer": "<p>(a) <b>1100 ms</b>, (b) <b>300 ms</b>, (c) <b>600 ms</b>, (d) <b>150 ms</b>.</p>"
    },
    {
     "type": "worked",
     "title": "With transmission time: 10 Mbps link, RTT = 20 ms",
     "tag": "University-Midsem-style",
     "problem": "<p>A 10,000-byte HTML file references 3 images of 50,000 bytes each. The bottleneck link is 10 Mbps and RTT = 20 ms. Compute the page load time for non-persistent (serial), persistent without pipelining, and persistent with pipelining.</p>",
     "steps": [
      {
       "tex": "T_{base} = \\frac{10000\\times8}{10\\times10^6} = 8\\ \\text{ms},\\quad T_{obj} = \\frac{50000\\times8}{10\\times10^6} = 40\\ \\text{ms}",
       "why": "Convert bytes to bits, divide by the rate."
      },
      {
       "tex": "T_{np} = (2\\times20 + 8) + 3(2\\times20 + 40) = 48 + 240 = 288\\ \\text{ms}",
       "why": "Each image pays 2 RTT + 40 ms."
      },
      {
       "tex": "T_{p} = 48 + 3(20 + 40) = 48 + 180 = 228\\ \\text{ms}",
       "why": "Each image pays 1 RTT + 40 ms."
      },
      {
       "tex": "T_{pp} = 48 + 20 + 3\\times40 = 188\\ \\text{ms}",
       "why": "One RTT for all requests, then the three images stream back to back."
      }
     ],
     "answer": "<p>Non-persistent <b>288 ms</b>; persistent <b>228 ms</b>; pipelined <b>188 ms</b>.</p>"
    },
    {
     "type": "cheat",
     "title": "RTT formulas",
     "items": [
      "One object, new connection: $2\\,\\text{RTT} + L/R$.",
      "Base + N, non-persistent serial: $2(N+1)$ RTT (+ transmissions).",
      "Non-persistent, P parallel: $2 + 2\\lceil N/P\\rceil$ RTT.",
      "Persistent, no pipelining: $2 + N$ RTT.",
      "Persistent, pipelining: $3$ RTT (for N ≥ 1).",
      "DNS: add $\\text{RTT}_1 + \\text{RTT}_2 + \\cdots$ (one per DNS server visited) before everything.",
      "Fresh HTTPS adds TLS: TLS 1.2 +2 RTT, TLS 1.3 +1 RTT (Unit 06)."
     ]
    },
    {
     "type": "code",
     "file": "Unit05_http_timing.py",
     "level": "low",
     "title": "RTT calculator for the four modes (with asserts on every worked answer)"
    },
    {
     "type": "traps",
     "items": [
      "Do not forget the <b>base HTML</b>: it pays 2 RTT in every mode.",
      "A TCP handshake costs <b>1 RTT</b> before data, not 1.5: the third segment (ACK) carries the request.",
      "Parallel connections use $\\lceil N/P \\rceil$, so 8 objects on 5 connections are 2 waves, not 1.6.",
      "\"Very small objects\" means transmission time ≈ 0; otherwise add $L/R$ per object.",
      "DNS RTTs are added once, at the start, only if the question gives them."
     ]
    }
   ],
   "practice": [
    {
     "id": "u05-D-1",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "05.8",
     "q": "<p>Base HTML + 5 tiny objects, RTT = 40 ms, <b>non-persistent serial</b> HTTP, no DNS. Total time in ms? (integer)</p>",
     "answer": 480,
     "tol": 0,
     "unit": "ms",
     "verify": "(2 + 2*5) * 40",
     "steps": [
      {
       "tex": "T = 2 + 2N \\ \\text{RTT}",
       "why": "Every object, including the base, costs 2 RTT."
      },
      {
       "tex": "T = 2 + 10 = 12\\ \\text{RTT}",
       "why": "N = 5."
      },
      {
       "tex": "12 \\times 40 = 480\\ \\text{ms}",
       "why": "Convert to ms."
      }
     ],
     "explain": "<p>480 ms.</p>"
    },
    {
     "id": "u05-D-2",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "05.8",
     "q": "<p>Same page (base + 5 tiny objects, RTT = 40 ms) with <b>persistent HTTP and pipelining</b>. Total time in ms? (integer)</p>",
     "answer": 120,
     "tol": 0,
     "unit": "ms",
     "verify": "3 * 40",
     "steps": [
      {
       "tex": "T = 2\\ \\text{RTT} + 1\\ \\text{RTT}",
       "why": "Handshake + base, then one RTT for all pipelined requests."
      },
      {
       "tex": "3 \\times 40 = 120\\ \\text{ms}",
       "why": "Convert."
      }
     ],
     "explain": "<p>120 ms, a quarter of the non-persistent time.</p>"
    },
    {
     "id": "u05-D-3",
     "type": "num",
     "tag": "GATE-style",
     "topic": "05.8",
     "q": "<p>Base HTML + 7 tiny objects; the browser uses <b>non-persistent</b> HTTP with <b>3 parallel</b> connections. How many RTTs until the page is complete? (integer)</p>",
     "answer": 8,
     "tol": 0,
     "unit": "RTT",
     "verify": "2 + 2*math.ceil(7/3)",
     "steps": [
      {
       "tex": "\\lceil 7/3 \\rceil = 3 \\ \\text{waves}",
       "why": "3 + 3 + 1 objects."
      },
      {
       "tex": "T = 2 + 2\\times3 = 8\\ \\text{RTT}",
       "why": "Base 2 RTT, each wave 2 RTT."
      }
     ],
     "explain": "<p>8 RTT.</p>"
    },
    {
     "id": "u05-D-4",
     "type": "num",
     "tag": "GATE-style",
     "topic": "05.8",
     "q": "<p>Kurose-style: before contacting the web server the host resolves the name by visiting two DNS servers with RTTs 3 ms and 17 ms. The web server's RTT is 30 ms. The page is a single small HTML file (no objects), fetched over a new TCP connection. Total time in ms? (integer)</p>",
     "answer": 80,
     "tol": 0,
     "unit": "ms",
     "verify": "3 + 17 + 2*30",
     "steps": [
      {
       "tex": "T_{DNS} = 3 + 17 = 20\\ \\text{ms}",
       "why": "Sum of the DNS RTTs."
      },
      {
       "tex": "T_{HTTP} = 2\\times30 = 60\\ \\text{ms}",
       "why": "Handshake + request/response."
      },
      {
       "tex": "T = 20 + 60 = 80\\ \\text{ms}",
       "why": "DNS happens first."
      }
     ],
     "explain": "<p>80 ms.</p>"
    },
    {
     "id": "u05-D-5",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "05.8",
     "q": "<p>One 125,000-byte image is fetched over a <b>new</b> TCP connection on a 20 Mbps path with RTT = 30 ms. Time until the image has fully arrived, in ms? (integer)</p>",
     "answer": 110,
     "tol": 0,
     "unit": "ms",
     "verify": "2*30 + 125000*8/20e6*1000",
     "steps": [
      {
       "tex": "L/R = \\frac{125000\\times8}{20\\times10^6} = 0.05\\ \\text{s} = 50\\ \\text{ms}",
       "why": "Transmission time."
      },
      {
       "tex": "T = 2\\times30 + 50 = 110\\ \\text{ms}",
       "why": "Two RTTs plus transmission."
      }
     ],
     "explain": "<p>110 ms.</p>",
     "formula": "T = 2\\,\\text{RTT} + \\frac{L}{R}"
    },
    {
     "id": "u05-D-6",
     "type": "mcq",
     "tag": "GATE-style",
     "topic": "05.8",
     "q": "<p>Base page + N tiny objects. As N grows, which mode's load time stays (almost) constant?</p>",
     "options": [
      "Non-persistent serial",
      "Non-persistent with 6 parallel connections",
      "Persistent without pipelining",
      "Persistent with pipelining"
     ],
     "answer": 3,
     "why": [
      "Grows as 2N.",
      "Grows in steps of 2 RTT every 6 objects.",
      "Grows as N.",
      "Correct: 3 RTT regardless of N when objects are tiny."
     ],
     "explain": "<p>Pipelining sends all requests at once, so only one extra RTT is paid for all objects.</p>"
    }
   ]
  },
  {
   "id": "05-E",
   "title": "HTTP/2 and HTTP/3 (QUIC): Binary Framing, Multiplexing and HoL at Every Layer",
   "badge": "class",
   "source": "WB-L05 p32–40; WB-L06 p4; RFC 9113; RFC 9114; RFC 9000",
   "covers": [
    "05.9",
    "05.10",
    "05.11"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "Trays and kitchen windows (WB-L05 p32, p35)",
     "html": "<p><b>Analogy.</b> HTTP/1.1 is a waiter who carries one plate per trip. <b>HTTP/2</b> brings the whole tray at once: many dishes share one trip (one TCP connection) and are served in whatever order they are ready. But the tray still goes through <b>one narrow kitchen door (TCP)</b>: if the soup spills in the doorway, the burger and ice cream behind it wait too. <b>HTTP/3</b> gives each dish its own window (independent QUIC streams), so a spill delays only the soup.</p><p><b>Definitions.</b> <i>HTTP/2</i> (RFC 7540, 2015; now RFC 9113): same methods, status codes and headers as HTTP/1.1, but messages are split into <b>binary frames</b> by a framing layer, each frame tagged with a <b>stream ID</b>, so many request/response streams are <b>multiplexed</b> on a <b>single TCP connection</b>; headers are compressed with <b>HPACK</b>; the server may <b>push</b> resources the client has not yet asked for (WB-L05 p33–34). <i>HTTP/3</i> (RFC 9114, June 2022): the same HTTP semantics mapped onto <b>QUIC</b> (RFC 9000), a transport built by Google that runs over <b>UDP</b>, includes TLS 1.3, and delivers each stream independently (WB-L05 p36).</p>"
    },
    {
     "type": "figure",
     "html": "<svg viewBox='0 0 640 182' width='100%' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'><defs><marker id='arr' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='currentColor'/></marker></defs><rect x='40' y='40' width='560' height='60' rx='30' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='320' y='30' font-size='12' fill='currentColor' text-anchor='middle' font-weight='bold'>ONE TCP connection (one TLS session) carrying interleaved HTTP/2 frames</text><rect x='60' y='55' width='70' height='30' rx='3' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='95' y='74' font-size='9.5' fill='currentColor' text-anchor='middle'>HEADERS s1</text><rect x='136' y='55' width='70' height='30' rx='3' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='171' y='74' font-size='9.5' fill='currentColor' text-anchor='middle'>HEADERS s3</text><rect x='212' y='55' width='70' height='30' rx='3' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='247' y='74' font-size='9.5' fill='currentColor' text-anchor='middle'>DATA s3</text><rect x='288' y='55' width='70' height='30' rx='3' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='323' y='74' font-size='9.5' fill='currentColor' text-anchor='middle'>DATA s1</text><rect x='364' y='55' width='70' height='30' rx='3' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='399' y='74' font-size='9.5' fill='currentColor' text-anchor='middle'>HEADERS s5</text><rect x='440' y='55' width='70' height='30' rx='3' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='475' y='74' font-size='9.5' fill='currentColor' text-anchor='middle'>DATA s5</text><rect x='516' y='55' width='70' height='30' rx='3' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='551' y='74' font-size='9.5' fill='currentColor' text-anchor='middle'>DATA s1</text><line x1='600' y1='112' x2='40' y2='112' stroke='currentColor' stroke-width='1.5' marker-end='url(#arr)'/><text x='320' y='128' font-size='10' fill='var(--muted)' text-anchor='middle'>server to client, left frame arrives first</text><text x='320' y='150' font-size='10.5' fill='currentColor' text-anchor='middle'>s1 = /index.html   s3 = /style.css   s5 = /app.js   (client streams use odd IDs; stream 0 = connection control)</text><text x='320' y='170' font-size='10.5' fill='var(--muted)' text-anchor='middle'>Each frame = 9-byte header (Length 24 b, Type 8 b, Flags 8 b, R 1 b, Stream ID 31 b) + payload</text></svg>",
     "caption": "HTTP/2 framing layer (WB-L05 p33): frames from different streams interleave on one connection, so a big response no longer blocks small ones at the HTTP level."
    },
    {
     "type": "packet",
     "title": "HTTP/2 frame header (RFC 9113 §4.1): 9 bytes before every frame payload",
     "width": 32,
     "fields": [
      {
       "name": "Length",
       "bits": 24,
       "note": "payload length in bytes; default maximum 16,384 (2^14), up to 2^24 − 1 if SETTINGS_MAX_FRAME_SIZE allows"
      },
      {
       "name": "Type",
       "bits": 8,
       "note": "0x0 DATA, 0x1 HEADERS, 0x2 PRIORITY, 0x3 RST_STREAM, 0x4 SETTINGS, 0x5 PUSH_PROMISE, 0x6 PING, 0x7 GOAWAY, 0x8 WINDOW_UPDATE, 0x9 CONTINUATION"
      },
      {
       "name": "Flags",
       "bits": 8,
       "note": "e.g. END_STREAM 0x1, END_HEADERS 0x4, PADDED 0x8"
      },
      {
       "name": "R",
       "bits": 1,
       "note": "reserved bit, must be 0"
      },
      {
       "name": "Stream Identifier",
       "bits": 31,
       "note": "0 = whole connection; client streams odd (1, 3, 5), server-pushed streams even"
      },
      {
       "name": "Frame Payload (first 3 bytes shown; variable length)",
       "bits": 24,
       "note": "HEADERS payload = HPACK block; DATA payload = body bytes"
      }
     ],
     "caption": "24 + 8 + 8 + 1 + 31 = 72 bits = 9 bytes of header; the last row is the start of the payload, drawn only to complete the 32-bit grid."
    },
    {
     "type": "figure",
     "html": "<svg viewBox='0 0 640 272' width='100%' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'><text x='70' y='70' font-size='11' fill='var(--muted)' text-anchor='end'>Application</text><line x1='78' y1='90' x2='630' y2='90' stroke='var(--muted)' stroke-width='0.6' stroke-dasharray='3 4'/><text x='70' y='120' font-size='11' fill='var(--muted)' text-anchor='end'>Security</text><line x1='78' y1='140' x2='630' y2='140' stroke='var(--muted)' stroke-width='0.6' stroke-dasharray='3 4'/><text x='70' y='170' font-size='11' fill='var(--muted)' text-anchor='end'>Transport</text><line x1='78' y1='190' x2='630' y2='190' stroke='var(--muted)' stroke-width='0.6' stroke-dasharray='3 4'/><text x='70' y='220' font-size='11' fill='var(--muted)' text-anchor='end'>Network</text><line x1='78' y1='240' x2='630' y2='240' stroke='var(--muted)' stroke-width='0.6' stroke-dasharray='3 4'/><text x='174' y='30' font-size='12' fill='var(--muted)' text-anchor='middle' font-weight='bold'>HTTP/1.1 (http://)</text><rect x='90' y='50' width='168' height='36' rx='4' fill='none' stroke='var(--muted)' stroke-width='2'/><text x='174' y='72' font-size='10.5' fill='currentColor' text-anchor='middle'>HTTP/1.1 (text)</text><text x='174' y='126' font-size='10' fill='var(--bad)' text-anchor='middle'>(none: plain text)</text><rect x='90' y='150' width='168' height='36' rx='4' fill='none' stroke='var(--muted)' stroke-width='1.4'/><text x='174' y='172' font-size='10.5' fill='currentColor' text-anchor='middle'>TCP</text><rect x='90' y='200' width='168' height='36' rx='4' fill='none' stroke='var(--muted)' stroke-width='1.4'/><text x='174' y='222' font-size='10.5' fill='currentColor' text-anchor='middle'>IP</text><text x='356' y='30' font-size='12' fill='var(--accent)' text-anchor='middle' font-weight='bold'>HTTP/2 (https://)</text><rect x='272' y='50' width='168' height='36' rx='4' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='356' y='72' font-size='10.5' fill='currentColor' text-anchor='middle'>HTTP/2 (binary frames, streams, HPACK)</text><rect x='272' y='100' width='168' height='36' rx='4' fill='none' stroke='var(--accent)' stroke-width='1.4'/><text x='356' y='122' font-size='10.5' fill='currentColor' text-anchor='middle'>TLS 1.2 / 1.3</text><rect x='272' y='150' width='168' height='36' rx='4' fill='none' stroke='var(--accent)' stroke-width='1.4'/><text x='356' y='172' font-size='10.5' fill='currentColor' text-anchor='middle'>TCP (one byte stream)</text><rect x='272' y='200' width='168' height='36' rx='4' fill='none' stroke='var(--accent)' stroke-width='1.4'/><text x='356' y='222' font-size='10.5' fill='currentColor' text-anchor='middle'>IP</text><text x='538' y='30' font-size='12' fill='var(--ok)' text-anchor='middle' font-weight='bold'>HTTP/3 (https://)</text><rect x='454' y='50' width='168' height='36' rx='4' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='538' y='72' font-size='10.5' fill='currentColor' text-anchor='middle'>HTTP/3 (frames, QPACK)</text><rect x='454' y='100' width='168' height='80' rx='4' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='538' y='126' font-size='12' fill='currentColor' text-anchor='middle' font-weight='bold'>QUIC (RFC 9000)</text><text x='538' y='144' font-size='10' fill='currentColor' text-anchor='middle'>streams, TLS 1.3 inside,</text><text x='538' y='158' font-size='10' fill='currentColor' text-anchor='middle'>loss recovery, conn. IDs</text><rect x='478' y='186' width='120' height='0.1' rx='4' fill='none' stroke='none' stroke-width='1.6'/><rect x='484' y='184' width='108' height='14' rx='4' fill='none' stroke='var(--ok)' stroke-width='1.4'/><text x='538' y='195' font-size='10' fill='currentColor' text-anchor='middle'>UDP (port 443)</text><rect x='454' y='200' width='168' height='36' rx='4' fill='none' stroke='var(--ok)' stroke-width='1.4'/><text x='538' y='222' font-size='10.5' fill='currentColor' text-anchor='middle'>IP</text><text x='320' y='262' font-size='10.5' fill='var(--muted)' text-anchor='middle'>HTTP/2 inherits TCP's single ordered byte stream; HTTP/3 moves streams into QUIC over UDP (WB-L05 p38)</text></svg>",
     "caption": "WB-L05 p38 / WB-L06 p4 redrawn with HTTP/1.1 added: HTTP/2 needs TLS over TCP; in HTTP/3, QUIC absorbs TLS 1.3, stream multiplexing and reliability, and runs over UDP."
    },
    {
     "type": "figure",
     "html": "<svg viewBox='0 0 640 220' width='100%' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'><rect x='20' y='10' width='196' height='200' rx='8' fill='none' stroke='var(--muted)' stroke-width='1.6'/><text x='118' y='32' font-size='13' fill='currentColor' text-anchor='middle' font-weight='bold'>HTTP/1.1</text><text x='118' y='48' font-size='10' fill='var(--muted)' text-anchor='middle'>6 TCP connections per origin</text><text x='118' y='200' font-size='10' fill='var(--warn)' text-anchor='middle'>6 handshakes, 6 slow starts</text><rect x='230' y='10' width='196' height='200' rx='8' fill='none' stroke='var(--muted)' stroke-width='1.6'/><text x='328' y='32' font-size='13' fill='currentColor' text-anchor='middle' font-weight='bold'>HTTP/2</text><text x='328' y='48' font-size='10' fill='var(--muted)' text-anchor='middle'>1 TCP connection, many streams</text><text x='328' y='200' font-size='10' fill='var(--bad)' text-anchor='middle'>1 lost segment stalls ALL streams</text><rect x='440' y='10' width='196' height='200' rx='8' fill='none' stroke='var(--muted)' stroke-width='1.6'/><text x='538' y='32' font-size='13' fill='currentColor' text-anchor='middle' font-weight='bold'>HTTP/3</text><text x='538' y='48' font-size='10' fill='var(--muted)' text-anchor='middle'>QUIC streams over UDP</text><text x='538' y='200' font-size='10' fill='var(--ok)' text-anchor='middle'>only the stream with the loss waits</text><rect x='36' y='64' width='164' height='12' rx='6' fill='none' stroke='var(--warn)' stroke-width='1.6'/><rect x='36' y='84' width='164' height='12' rx='6' fill='none' stroke='var(--warn)' stroke-width='1.6'/><rect x='36' y='104' width='164' height='12' rx='6' fill='none' stroke='var(--warn)' stroke-width='1.6'/><rect x='36' y='124' width='164' height='12' rx='6' fill='none' stroke='var(--warn)' stroke-width='1.6'/><rect x='36' y='144' width='164' height='12' rx='6' fill='none' stroke='var(--warn)' stroke-width='1.6'/><rect x='36' y='164' width='164' height='12' rx='6' fill='none' stroke='var(--warn)' stroke-width='1.6'/><rect x='236' y='62' width='180' height='116' rx='10' fill='none' stroke='var(--accent)' stroke-width='2'/><line x1='248' y1='80' x2='318' y2='80' stroke='currentColor' stroke-width='2'/><line x1='318' y1='80' x2='404' y2='80' stroke='var(--muted)' stroke-width='2' stroke-dasharray='4 4'/><line x1='248' y1='106' x2='318' y2='106' stroke='currentColor' stroke-width='2'/><line x1='318' y1='106' x2='404' y2='106' stroke='var(--muted)' stroke-width='2' stroke-dasharray='4 4'/><line x1='248' y1='132' x2='318' y2='132' stroke='currentColor' stroke-width='2'/><line x1='318' y1='132' x2='404' y2='132' stroke='var(--muted)' stroke-width='2' stroke-dasharray='4 4'/><line x1='248' y1='158' x2='318' y2='158' stroke='currentColor' stroke-width='2'/><line x1='318' y1='158' x2='404' y2='158' stroke='var(--muted)' stroke-width='2' stroke-dasharray='4 4'/><text x='318' y='158' font-size='10' fill='var(--bad)' text-anchor='middle'>x lost TCP segment</text><circle cx='318' cy='106' r='6' fill='var(--bad)'/><line x1='456' y1='80' x2='604' y2='80' stroke='var(--ok)' stroke-width='2'/><line x1='456' y1='106' x2='520' y2='106' stroke='currentColor' stroke-width='2'/><line x1='520' y1='106' x2='604' y2='106' stroke='var(--muted)' stroke-width='2' stroke-dasharray='4 4'/><circle cx='520' cy='106' r='6' fill='var(--bad)'/><line x1='456' y1='132' x2='604' y2='132' stroke='var(--ok)' stroke-width='2'/><line x1='456' y1='158' x2='604' y2='158' stroke='var(--ok)' stroke-width='2'/><text x='530' y='172' font-size='10' fill='var(--ok)' text-anchor='middle'>streams 1, 3, 4 keep flowing</text></svg>",
     "caption": "WB-L05 p39: HTTP/1.1 fakes parallelism with 6 TCP connections; HTTP/2 fixes application-level HoL but one lost TCP segment stalls every stream (TCP-level HoL); HTTP/3 isolates a loss to its own stream."
    },
    {
     "type": "table",
     "head": [
      "",
      "HTTP/1.1",
      "HTTP/2",
      "HTTP/3"
     ],
     "rows": [
      [
       "Year / RFC",
       "1997 / RFC 9112 (now)",
       "2015 / RFC 7540, now RFC 9113",
       "June 2022 / RFC 9114"
      ],
      [
       "Message format",
       "text lines",
       "binary frames",
       "binary frames"
      ],
      [
       "Transport",
       "TCP",
       "TCP (browsers: only with TLS, ALPN token h2)",
       "QUIC over UDP 443 (ALPN token h3)"
      ],
      [
       "Connections per origin",
       "about 6",
       "1",
       "1"
      ],
      [
       "Multiplexing",
       "no (pipelining is FIFO)",
       "yes, streams",
       "yes, independent QUIC streams"
      ],
      [
       "Header compression",
       "none",
       "HPACK (RFC 7541)",
       "QPACK (RFC 9204)"
      ],
      [
       "HoL blocking",
       "application level",
       "TCP level (one loss stalls all streams)",
       "only the stream that lost data"
      ],
      [
       "RTTs before first response (fresh, with TLS 1.3)",
       "3 (TCP 1 + TLS 1 + HTTP 1)",
       "3",
       "2 (QUIC+TLS 1 + HTTP 1); 1 with 0-RTT"
      ],
      [
       "Survives IP change (Wi-Fi to 4G)",
       "no: TCP is tied to the 4-tuple",
       "no",
       "yes: QUIC connection IDs allow migration"
      ]
     ],
     "caption": "The three generations side by side."
    },
    {
     "type": "callout",
     "kind": "trace",
     "title": "Seeing h2 and h3 yourself (WB-L05 p37)",
     "html": "<p>Open DevTools → Network, right-click the column header and enable <b>Protocol</b>. On cloudflare.com the slide shows mostly <code>h3</code> with some <code>h2</code>. A browser learns that HTTP/3 is available from the response header <code>Alt-Svc: h3=\":443\"</code> (or a DNS HTTPS record), so the very first visit is often h2 and later requests switch to h3. In Python, <code>curl --http3</code> or the <code>httpx</code>/<code>aioquic</code> packages are needed; the standard library speaks only HTTP/1.1.</p>"
    },
    {
     "type": "cheat",
     "title": "HTTP/2 and HTTP/3",
     "items": [
      "HTTP/2 = binary framing + multiplexed streams + HPACK + server push, on ONE TCP connection.",
      "Frame header 9 bytes: Length 24, Type 8, Flags 8, R 1, Stream ID 31.",
      "HTTP/2 fixes HTTP-level HoL; TCP-level HoL remains (one lost segment stalls all streams).",
      "HTTP/3 = HTTP over QUIC over UDP; TLS 1.3 built in; per-stream loss recovery; connection migration.",
      "QUIC is reliable and congestion-controlled even though UDP is not.",
      "Server push: allowed by RFC 9113 but disabled by default in Chrome since 2022; not the same as WebSockets."
     ]
    },
    {
     "type": "traps",
     "items": [
      "HTTP/2 does <b>not</b> remove TCP's head-of-line blocking; only HTTP/3 does.",
      "HTTP/3 is not \"HTTP over raw UDP\": QUIC adds reliability, ordering per stream, congestion control and encryption.",
      "HTTP/2 keeps HTTP/1.1 semantics: a 404 is still a 404, GET is still GET.",
      "HTTP/2 uses <b>one</b> TCP connection per origin, not six.",
      "The HTTP/2 spec allows cleartext (h2c), but browsers only use HTTP/2 over TLS."
     ]
    }
   ],
   "practice": [
    {
     "id": "u05-E-1",
     "type": "msq",
     "tag": "University-Midsem-style",
     "topic": "05.9",
     "q": "<p>Which are features of HTTP/2? (Select all that apply.)</p>",
     "options": [
      "Binary framing layer",
      "Multiplexing many streams on one TCP connection",
      "Runs over UDP",
      "HPACK header compression",
      "Server push"
     ],
     "answer": [
      0,
      1,
      3,
      4
     ],
     "why": [
      "WB-L05 p34: binary protocol, \"that is the framing layer\".",
      "WB-L05 p34: simultaneous requests and responses over one connection.",
      "HTTP/2 runs over TCP; UDP is HTTP/3 (QUIC).",
      "RFC 7541 HPACK.",
      "WB-L05 p34: servers send resources proactively."
     ],
     "explain": "<p>Binary framing, multiplexing, HPACK and push are HTTP/2; UDP transport is HTTP/3.</p>"
    },
    {
     "id": "u05-E-2",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "05.11",
     "q": "<p>An HTTP/2 connection carries 5 streams. One TCP segment of stream 3 is lost. What happens?</p>",
     "options": [
      "Only stream 3 waits for the retransmission",
      "All 5 streams wait, because TCP delivers bytes in order",
      "The connection is reset",
      "HTTP/2 retransmits the frame on a new stream"
     ],
     "answer": 1,
     "why": [
      "That is HTTP/3 (QUIC) behaviour.",
      "Correct: TCP-level HoL blocking (WB-L05 p39: \"1 lost TCP segment → all streams stall\").",
      "TCP simply retransmits; nothing is reset.",
      "Retransmission is TCP's job, not HTTP/2's."
     ],
     "explain": "<p>HTTP/2 fixed application-level HoL, but TCP still hands bytes up strictly in order.</p>"
    },
    {
     "id": "u05-E-3",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "05.10",
     "q": "<p>In the HTTP/3 protocol stack, where does TLS sit?</p>",
     "options": [
      "Between HTTP/3 and UDP as a separate layer",
      "Inside QUIC (QUIC uses the TLS 1.3 handshake)",
      "Below IP",
      "HTTP/3 has no encryption"
     ],
     "answer": 1,
     "why": [
      "Separate TLS-over-TCP is the HTTP/2 stack.",
      "Correct: WB-L05 p38 draws QUIC containing Multistreaming, TLS and Stream Abstraction (RFC 9001).",
      "Encryption below IP would be IPsec, not TLS.",
      "QUIC always encrypts."
     ],
     "explain": "<p>HTTP/3 → QUIC (with TLS 1.3 inside) → UDP → IP.</p>"
    },
    {
     "id": "u05-E-4",
     "type": "num",
     "tag": "GATE-style",
     "topic": "05.9",
     "q": "<p>An HTTP/2 DATA frame carries a 1,200-byte payload. How many bytes is the whole frame, including its frame header? (integer)</p>",
     "answer": 1209,
     "tol": 0,
     "unit": "bytes",
     "verify": "9 + 1200",
     "steps": [
      {
       "tex": "24+8+8+1+31 = 72\\ \\text{bits} = 9\\ \\text{bytes}",
       "why": "Frame header size."
      },
      {
       "tex": "9 + 1200 = 1209",
       "why": "Header plus payload."
      }
     ],
     "explain": "<p>1209 bytes (before TLS, TCP and IP overhead).</p>"
    },
    {
     "id": "u05-E-5",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "05.11",
     "q": "<p>Why did browsers open about 6 TCP connections per host under HTTP/1.1?</p>",
     "options": [
      "The HTTP/1.1 RFC requires exactly 6",
      "To fake parallelism and avoid FIFO head-of-line blocking on one connection",
      "Because TCP allows only 6 segments in flight",
      "To use 6 different ports on the server"
     ],
     "answer": 1,
     "why": [
      "No RFC mandates 6; it is a browser choice (RFC 2616 once suggested 2).",
      "Correct (WB-L05 p39), at the cost of 6 handshakes and 6 slow starts.",
      "TCP's window is not limited to 6 segments.",
      "All 6 go to the same server port 443 or 80; only client ports differ."
     ],
     "explain": "<p>Parallel connections are a workaround for HoL; HTTP/2 replaced them with streams.</p>"
    },
    {
     "id": "u05-E-6",
     "type": "mcq",
     "tag": "GATE-style",
     "topic": "05.10",
     "q": "<p>A phone moves from Wi-Fi to 4G in the middle of a download. Which protocol can keep the same connection?</p>",
     "options": [
      "HTTP/1.1 over TCP",
      "HTTP/2 over TCP",
      "HTTP/3 over QUIC",
      "None of them"
     ],
     "answer": 2,
     "why": [
      "A TCP connection is identified by the 4-tuple; a new client IP breaks it.",
      "Same TCP problem.",
      "Correct: QUIC identifies the connection by connection IDs, not by IP/port.",
      "QUIC connection migration exists (RFC 9000 §9)."
     ],
     "explain": "<p>QUIC connection IDs survive an address change.</p>"
    }
   ]
  },
  {
   "id": "05-F",
   "title": "REST APIs, OpenAPI and the API Economy",
   "badge": "class",
   "source": "WB-L05 p40–42; WB-L08 p33–39",
   "covers": [
    "05.12",
    "05.13"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "Menu and waiter",
     "html": "<p><b>Analogy.</b> An API is a restaurant menu plus a waiter: you never walk into the kitchen, you order from a fixed list in a fixed format and get a predictable dish back. The kitchen can change completely as long as the menu stays the same.</p><p><b>Definitions.</b> <i>API</i> (WB-L08 p36): a set of protocols, routines and tools that allow different software applications or systems to communicate with each other over a network; it defines how components interact. <i>REST</i> (Representational State Transfer, Fielding 2000) is an architectural style, not a protocol: every <b>resource</b> has a URL (<code>/users/7</code>); clients use the <b>uniform interface</b> of HTTP methods; each request is <b>stateless</b> (carries everything needed, e.g. a token); responses are <b>representations</b> (usually JSON, sometimes XML) and may be <b>cacheable</b>. WB-L05 p41: a Q4 2024 analysis estimates that <b>83%</b> of public APIs use REST.</p>"
    },
    {
     "type": "figure",
     "html": "<svg viewBox='0 0 640 215' width='100%' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'><defs><marker id='arr' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='currentColor'/></marker></defs><rect x='20' y='40' width='90' height='30' rx='4' fill='none' stroke='currentColor' stroke-width='1.6'/><text x='65' y='59' font-size='11' fill='currentColor' text-anchor='middle'>client 1</text><line x1='110' y1='55' x2='250' y2='95' stroke='var(--accent)' stroke-width='1.5' marker-end='url(#arr)'/><text x='180' y='52' font-size='10' fill='var(--accent)' text-anchor='middle'>HTTP GET /allUsers</text><rect x='20' y='90' width='90' height='30' rx='4' fill='none' stroke='currentColor' stroke-width='1.6'/><text x='65' y='109' font-size='11' fill='currentColor' text-anchor='middle'>client 2</text><line x1='110' y1='105' x2='250' y2='95' stroke='var(--accent)' stroke-width='1.5' marker-end='url(#arr)'/><text x='180' y='102' font-size='10' fill='var(--accent)' text-anchor='middle'>HTTP POST /newUser</text><rect x='20' y='140' width='90' height='30' rx='4' fill='none' stroke='currentColor' stroke-width='1.6'/><text x='65' y='159' font-size='11' fill='currentColor' text-anchor='middle'>client 3</text><line x1='110' y1='155' x2='250' y2='95' stroke='var(--accent)' stroke-width='1.5' marker-end='url(#arr)'/><text x='180' y='158' font-size='10' fill='var(--accent)' text-anchor='middle'>HTTP PATCH /updateUser</text><rect x='250' y='70' width='150' height='50' rx='4' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='325' y='92' font-size='13' fill='currentColor' text-anchor='middle' font-weight='bold'>REST API</text><text x='325' y='108' font-size='10' fill='currentColor' text-anchor='middle'>routes by method + URL</text><line x1='400' y1='95' x2='480' y2='95' stroke='var(--ok)' stroke-width='1.5' marker-end='url(#arr)'/><text x='440' y='88' font-size='10' fill='var(--ok)' text-anchor='middle'>query</text><ellipse cx='530' cy='72' rx='45' ry='12' fill='none' stroke='var(--ok)' stroke-width='2'/><line x1='485' y1='72' x2='485' y2='118' stroke='var(--ok)' stroke-width='2'/><line x1='575' y1='72' x2='575' y2='118' stroke='var(--ok)' stroke-width='2'/><path d='M485,118 A45,12 0 0 0 575,118' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='530' y='100' font-size='11' fill='currentColor' text-anchor='middle'>database</text><line x1='250' y1='112' x2='110' y2='175' stroke='var(--warn)' stroke-width='1.5' marker-end='url(#arr)'/><text x='250' y='168' font-size='10' fill='var(--warn)' text-anchor='start'>response: status code + JSON / XML body</text><text x='320' y='205' font-size='10.5' fill='var(--muted)' text-anchor='middle'>WB-L05 p41: clients send HTTP requests, the API does the work against the database and replies.</text></svg>",
     "caption": "WB-L05 p41 \"Rest API Basics\" redrawn."
    },
    {
     "type": "table",
     "head": [
      "HTTP verb (WB-L05 p41)",
      "CRUD",
      "Example",
      "Typical success code",
      "Idempotent?"
     ],
     "rows": [
      [
       "POST",
       "Create a new record",
       "POST /users {\"name\": \"Raj\"}",
       "201 Created + Location",
       "no (two POSTs make two users)"
      ],
      [
       "GET",
       "Read",
       "GET /users/1, GET /users",
       "200 OK",
       "yes"
      ],
      [
       "PUT",
       "Update / replace the whole record",
       "PUT /users/1 {\"name\": \"Raj M\"}",
       "200 OK or 204 No Content",
       "yes"
      ],
      [
       "PATCH",
       "Update / modify some fields",
       "PATCH /users/1 {\"city\": \"London\"}",
       "200 OK",
       "not guaranteed"
      ],
      [
       "DELETE",
       "Delete",
       "DELETE /users/1",
       "204 No Content (or 200)",
       "yes (second call: 404, same final state)"
      ]
     ],
     "caption": "Errors: 400 bad JSON, 401/403 auth, 404 unknown id, 405 verb not allowed on that URL, 409 conflict."
    },
    {
     "type": "callout",
     "kind": "key",
     "title": "OpenAPI (WB-L05 p42)",
     "html": "<p>The API <b>producer</b> defines and publishes an <b>OpenAPI contract</b> (a YAML/JSON file listing every path, method, parameter, request body and response code). <b>Consumers</b> (front-end developers, AI agents and LLMs, third-party developers, API testing tools) consume it and validate against it. Swagger is the tooling family that renders and tests OpenAPI files; the demo was <code>petstore3.swagger.io</code>.</p>"
    },
    {
     "type": "callout",
     "kind": "aws",
     "title": "The Bezos API mandate, 2002 (WB-L08 p35, paraphrased)",
     "html": "<ol><li>All teams will expose their data and functionality through service interfaces.</li><li>Teams must communicate with each other through these interfaces.</li><li>No other form of inter-process communication is allowed: no direct linking, no direct reads of another team's data store, no shared memory, no back doors; only service calls over the network.</li><li>It does not matter what technology they use.</li><li>All service interfaces must be designed from the ground up to be externalizable (usable by outside developers).</li><li>Anyone who does not do this will be fired.</li></ol><p>Designing every internal system as a network API is what later let Amazon sell those same services to outsiders as AWS.</p>"
    },
    {
     "type": "text",
     "html": "<p><b>APIs in the wild (WB-L08 p34, p37–39).</b> Client–server paradigm: client sends a <i>query</i>, the server <i>fetches</i> from its data store and sends a <i>response</i>. The <b>Google Maps API</b> powers location-based apps and delivery apps. <b>Weather APIs</b> return forecasts, real-time data and historical reports, often as JSON or XML; travel apps (Kayak, AccuWeather) use them for trip planning and smart-home devices (Nest) adjust settings from fetched forecasts. A typical call: <code>GET /data/2.5/weather?q=Delhi&amp;appid=KEY</code> returning <code>{\"main\": {\"temp\": 31}, \"weather\": [{\"main\": \"Clouds\"}]}</code>.</p>"
    },
    {
     "type": "worked",
     "title": "Status codes for a CRUD session",
     "tag": "University-Midsem-style",
     "problem": "<p>An empty <code>/users</code> REST API receives, in order: (1) <code>POST /users {\"name\":\"Raj\"}</code>, (2) <code>GET /users/1</code>, (3) <code>PUT /users/1 {\"name\":\"Raj M\"}</code>, (4) <code>DELETE /users/1</code>, (5) <code>GET /users/1</code>, (6) <code>DELETE /users</code>. Give the status code of each response.</p>",
     "steps": [
      {
       "text": "(1) 201 Created, Location: /users/1",
       "why": "A POST to the collection creates id 1."
      },
      {
       "text": "(2) 200 OK with the JSON record",
       "why": "The resource exists."
      },
      {
       "text": "(3) 200 OK (or 204 if the API returns no body)",
       "why": "PUT replaces the whole record."
      },
      {
       "text": "(4) 204 No Content",
       "why": "Deleted; nothing to return."
      },
      {
       "text": "(5) 404 Not Found",
       "why": "The resource no longer exists."
      },
      {
       "text": "(6) 405 Method Not Allowed (with an Allow header)",
       "why": "This API does not allow deleting the whole collection."
      }
     ],
     "answer": "<p><b>201, 200, 200, 204, 404, 405</b>. The script <code>Unit05_rest_crud.py</code> asserts exactly this sequence.</p>"
    },
    {
     "type": "code",
     "file": "Unit05_rest_crud.py",
     "level": "high",
     "title": "http.server + http.client REST CRUD (201, 200, 204, 404, 405, 400)",
     "note": "ThreadingHTTPServer with protocol_version = HTTP/1.1, so the whole session reuses one persistent connection."
    },
    {
     "type": "cheat",
     "title": "REST",
     "items": [
      "REST = resources (URLs) + HTTP verbs + stateless requests + JSON/XML representations.",
      "POST create (201), GET read (200), PUT replace (200/204), PATCH modify (200), DELETE remove (204).",
      "Idempotent: GET, PUT, DELETE. Not idempotent: POST (PATCH not guaranteed).",
      "OpenAPI = machine-readable API contract; Swagger = tools for it.",
      "83% of public APIs use REST (WB-L05 p41)."
     ]
    },
    {
     "type": "traps",
     "items": [
      "REST is an <b>architectural style</b>, not a protocol; other API styles are SOAP, GraphQL and gRPC.",
      "PUT replaces the <b>whole</b> resource (missing fields are cleared); PATCH changes only the fields sent.",
      "DELETE is idempotent even though the second call returns 404: the server state after one or two calls is the same.",
      "A REST server must not keep per-client session state between requests; authentication travels with each request (token or cookie)."
     ]
    }
   ],
   "practice": [
    {
     "id": "u05-F-1",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "05.12",
     "q": "<p>WB-L05 p41 maps PATCH to which database operation?</p>",
     "options": [
      "Create a new record",
      "Read",
      "Update / modify a row",
      "Delete"
     ],
     "answer": 2,
     "why": [
      "That is POST.",
      "That is GET.",
      "Correct: PATCH modifies; PUT updates/replaces.",
      "That is DELETE."
     ],
     "explain": "<p>GET read, POST create, PUT replace, PATCH modify, DELETE delete.</p>"
    },
    {
     "id": "u05-F-2",
     "type": "msq",
     "tag": "University-Midsem-style",
     "topic": "05.12",
     "q": "<p>Which HTTP methods are <b>idempotent</b>? (Select all that apply.)</p>",
     "options": [
      "GET",
      "POST",
      "PUT",
      "DELETE"
     ],
     "answer": [
      0,
      2,
      3
     ],
     "why": [
      "Reading twice changes nothing.",
      "Two POSTs create two records.",
      "Replacing with the same content twice gives the same state.",
      "After the first delete the resource is gone; the second leaves the same state."
     ],
     "explain": "<p>RFC 9110 §9.2.2: GET, HEAD, OPTIONS, TRACE, PUT and DELETE are idempotent.</p>"
    },
    {
     "id": "u05-F-3",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "05.13",
     "q": "<p>What was the core rule of the 2002 Bezos API mandate (WB-L08 p35)?</p>",
     "options": [
      "All code must be written in Java",
      "Teams may communicate only through service interfaces over the network",
      "Every team must use REST and JSON",
      "Databases must be shared between teams for speed"
     ],
     "answer": 1,
     "why": [
      "Rule 4: technology does not matter.",
      "Correct: no direct database reads, no back doors.",
      "The mandate did not fix a style or format.",
      "Direct data-store access was explicitly forbidden."
     ],
     "explain": "<p>Externalizable service interfaces; this is the root of AWS.</p>"
    },
    {
     "id": "u05-F-4",
     "type": "mcq",
     "tag": "GATE-style",
     "topic": "05.12",
     "q": "<p>A client sends <code>PUT /users/1 {\"name\":\"Raj M\"}</code> to a record that was <code>{\"id\":1,\"name\":\"Raj\",\"city\":\"Delhi\"}</code>. Under strict PUT semantics the record becomes</p>",
     "options": [
      "{\"id\":1,\"name\":\"Raj M\",\"city\":\"Delhi\"}",
      "{\"id\":1,\"name\":\"Raj M\",\"city\":\"\"} (city cleared)",
      "unchanged, because city was missing",
      "deleted"
     ],
     "answer": 1,
     "why": [
      "That is PATCH behaviour.",
      "Correct: PUT replaces the whole representation, so absent fields are reset.",
      "PUT does not reject a partial body by default; it replaces.",
      "Nothing deletes it."
     ],
     "explain": "<p>The demo script asserts exactly this: after PUT the city is empty, after PATCH only city changes.</p>"
    },
    {
     "id": "u05-F-5",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "05.12",
     "q": "<p>Predict the exact output of this <code>http.client</code> call against the running demo (status, reason, and what the body read returns).</p>",
     "code": "import http.client, threading\nfrom http.server import BaseHTTPRequestHandler, HTTPServer\n\nclass H(BaseHTTPRequestHandler):\n    def do_DELETE(self):\n        self.send_response(204)\n        self.end_headers()\n    def log_message(self, *a):\n        pass\n\nsrv = HTTPServer(('127.0.0.1', 0), H)\nthreading.Thread(target=srv.handle_request, daemon=True).start()\nc = http.client.HTTPConnection('127.0.0.1', srv.server_address[1], timeout=3)\nc.request('DELETE', '/users/1')\nr = c.getresponse()\nprint(r.status, r.reason, r.read())",
     "answer": "204 No Content b''",
     "runCheck": true,
     "explain": "<p>204 means success with no body, so <code>read()</code> returns the empty bytes object <code>b''</code>.</p>"
    },
    {
     "id": "u05-F-6",
     "type": "write",
     "tag": "University-Midsem-style",
     "topic": "05.12",
     "q": "<p>Using only <code>http.server</code> and <code>http.client</code>, write a REST service for an in-memory <code>/users</code> collection that returns 201 for POST (with a Location header), 200 for GET of an existing id, 204 for DELETE and 404 for an unknown id. Drive it from a client on <code>127.0.0.1</code> port 0 and assert every status code.</p>",
     "starter": "from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer\nimport http.client, json, threading\n\nDB = {}\n\nclass UsersAPI(BaseHTTPRequestHandler):\n    protocol_version = 'HTTP/1.1'\n    def do_POST(self):\n        pass\n    def do_GET(self):\n        pass\n    def do_DELETE(self):\n        pass\n",
     "solutionFile": "Unit05_rest_crud.py",
     "rubric": [
      "Server sets protocol_version = 'HTTP/1.1' and always sends Content-Length (except on 204)",
      "POST parses JSON, assigns an id, replies 201 with Location: /users/&lt;id&gt;",
      "GET returns 200 + JSON or 404",
      "DELETE returns 204 with no body, then GET of the same id returns 404",
      "Client reads each response body fully before sending the next request on the same connection"
     ],
     "explain": "<p>See the model solution; it also handles PUT, PATCH, 405 and 400.</p>"
    }
   ]
  },
  {
   "id": "05-G",
   "title": "Extra: HPACK Header Compression, 0-RTT/1-RTT Setup, FTP Active vs Passive",
   "badge": "extra",
   "source": "RFC 7541 (HPACK) §2–6 and Appendix C; RFC 8446 §2.3; RFC 9000/9001; RFC 959; Kurose & Ross 8e §2.2–2.3",
   "covers": [
    "05.14"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "A shared phrasebook, a returning customer, and two phone lines",
     "html": "<p><b>HPACK.</b> Both ends of an HTTP/2 connection keep the same numbered phrasebook. A <b>static table</b> of 61 common header lines is built in (index 2 = <code>:method: GET</code>, 4 = <code>:path: /</code>, 8 = <code>:status: 200</code>); a <b>dynamic table</b> (FIFO, default 4,096 bytes, entries numbered from 62) learns headers as they are sent. A repeated header then costs <b>one byte</b> (\"entry 62\"). Literal strings may be <b>Huffman</b>-coded with a fixed code (5 to 30 bits per symbol, frequent characters shortest). HTTP/3 uses <b>QPACK</b> instead, because HPACK assumes in-order delivery.</p><p><b>0-RTT / 1-RTT.</b> TLS 1.3 needs <b>1 RTT</b> for a full handshake (TLS 1.2 needed 2). A returning client holding a pre-shared key from an earlier session can send the HTTP request in its very first flight as <b>0-RTT early data</b>; QUIC combines its transport and TLS handshakes, so HTTP/3 needs 1 RTT for a new connection and 0 RTT on resumption. Early data can be <b>replayed</b> by an attacker, so servers accept only idempotent requests in it (HTTP status 425 Too Early, RFC 8470, rejects the rest).</p><p><b>FTP</b> (RFC 959) uses two TCP connections: a persistent <b>control</b> connection to server port <b>21</b> (commands USER, PASS, LIST, RETR, STOR; FTP keeps state such as the current directory, so it is <i>stateful</i> and sends control <i>out-of-band</i>) and a new <b>data</b> connection per file. In <b>active</b> mode the client sends <code>PORT h1,h2,h3,h4,p1,p2</code> and the server connects <b>from port 20</b> to the client; in <b>passive</b> mode the client sends <code>PASV</code>, the server answers <code>227 Entering Passive Mode (h1,h2,h3,h4,p1,p2)</code> and the <b>client</b> connects. Port = $p_1\\times256 + p_2$.</p>"
    },
    {
     "type": "table",
     "head": [
      "Static index",
      "Header",
      "Indexed byte (1xxxxxxx)"
     ],
     "rows": [
      [
       "1",
       ":authority (name only)",
       "0x81"
      ],
      [
       "2",
       ":method: GET",
       "0x82"
      ],
      [
       "3",
       ":method: POST",
       "0x83"
      ],
      [
       "4",
       ":path: /",
       "0x84"
      ],
      [
       "5",
       ":path: /index.html",
       "0x85"
      ],
      [
       "6",
       ":scheme: http",
       "0x86"
      ],
      [
       "7",
       ":scheme: https",
       "0x87"
      ],
      [
       "8",
       ":status: 200",
       "0x88"
      ],
      [
       "13",
       ":status: 404",
       "0x8d"
      ],
      [
       "24",
       "cache-control (name only)",
       "0x98"
      ],
      [
       "62",
       "first dynamic-table entry",
       "0xbe"
      ]
     ],
     "caption": "RFC 7541 Appendix A (61 static entries). Indexed Header Field = bit 1 followed by the 7-bit index."
    },
    {
     "type": "derivation",
     "title": "HPACK integer with an N-bit prefix (RFC 7541 §5.1): encode 1337 with N = 5",
     "steps": [
      {
       "tex": "2^N - 1 = 31",
       "why": "Largest value that fits in the 5-bit prefix."
      },
      {
       "tex": "1337 \\ge 31 \\Rightarrow \\text{prefix} = 11111_2,\\ \\text{remainder } 1337-31 = 1306",
       "why": "Prefix all ones means \"more bytes follow\"."
      },
      {
       "tex": "1306 \\bmod 128 = 26 \\Rightarrow 26 + 128 = 154 = 10011010_2",
       "why": "Low 7 bits first, with the continuation bit set."
      },
      {
       "tex": "\\lfloor 1306/128 \\rfloor = 10 \\Rightarrow 00001010_2",
       "why": "10 is below 128, so it is the last byte (top bit 0)."
      },
      {
       "tex": "1337 \\rightarrow [31,\\ 154,\\ 10]",
       "why": "Check: 31 + 26 + 10\\times128 = 1337."
      },
      {
       "tex": "\\text{entry size} = |\\text{name}| + |\\text{value}| + 32",
       "why": "RFC 7541 §4.1: e.g. :authority: www.example.com = 10 + 15 + 32 = 57 bytes of the 4096-byte table."
      }
     ]
    },
    {
     "type": "figure",
     "html": "<svg viewBox='0 0 640 276' width='100%' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'><defs><marker id='arr' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='currentColor'/></marker></defs><text x='320' y='24' font-size='12' fill='currentColor' text-anchor='middle' font-weight='bold'>ACTIVE mode (PORT)</text><rect x='30' y='34' width='130' height='90' rx='4' fill='none' stroke='currentColor' stroke-width='1.6'/><text x='95' y='54' font-size='12' fill='currentColor' text-anchor='middle'>FTP client</text><rect x='480' y='34' width='130' height='90' rx='4' fill='none' stroke='currentColor' stroke-width='1.6'/><text x='545' y='54' font-size='12' fill='currentColor' text-anchor='middle'>FTP server</text><text x='95' y='80' font-size='10' fill='var(--accent)' text-anchor='middle'>port 5000</text><text x='545' y='80' font-size='10' fill='var(--accent)' text-anchor='middle'>port 21</text><line x1='160' y1='76' x2='480' y2='76' stroke='var(--accent)' stroke-width='2' marker-end='url(#arr)'/><text x='320' y='70' font-size='10' fill='var(--accent)' text-anchor='middle'>control: client opens TCP to 21 (USER, PASS, RETR)</text><text x='95' y='110' font-size='10' fill='var(--ok)' text-anchor='middle'>port 5001 (listening)</text><text x='545' y='110' font-size='10' fill='var(--ok)' text-anchor='middle'>port 20</text><line x1='480' y1='106' x2='160' y2='106' stroke='var(--ok)' stroke-width='2' marker-end='url(#arr)'/><text x='320' y='100' font-size='10' fill='var(--ok)' text-anchor='middle'>data: SERVER connects from 20 to client's PORT 5001</text><text x='320' y='136' font-size='9.5' fill='var(--bad)' text-anchor='middle'>client sent PORT 192,168,1,5,19,137 (19 x 256 + 137 = 5001); a client NAT/firewall often blocks this</text><text x='320' y='154' font-size='12' fill='currentColor' text-anchor='middle' font-weight='bold'>PASSIVE mode (PASV)</text><rect x='30' y='164' width='130' height='90' rx='4' fill='none' stroke='currentColor' stroke-width='1.6'/><text x='95' y='184' font-size='12' fill='currentColor' text-anchor='middle'>FTP client</text><rect x='480' y='164' width='130' height='90' rx='4' fill='none' stroke='currentColor' stroke-width='1.6'/><text x='545' y='184' font-size='12' fill='currentColor' text-anchor='middle'>FTP server</text><text x='95' y='210' font-size='10' fill='var(--accent)' text-anchor='middle'>port 5000</text><text x='545' y='210' font-size='10' fill='var(--accent)' text-anchor='middle'>port 21</text><line x1='160' y1='206' x2='480' y2='206' stroke='var(--accent)' stroke-width='2' marker-end='url(#arr)'/><text x='320' y='200' font-size='10' fill='var(--accent)' text-anchor='middle'>control: client opens TCP to 21 (USER, PASS, RETR)</text><text x='95' y='240' font-size='10' fill='var(--ok)' text-anchor='middle'>port 5002</text><text x='545' y='240' font-size='10' fill='var(--ok)' text-anchor='middle'>port 50000 (listening)</text><line x1='160' y1='236' x2='480' y2='236' stroke='var(--ok)' stroke-width='2' marker-end='url(#arr)'/><text x='320' y='230' font-size='10' fill='var(--ok)' text-anchor='middle'>data: CLIENT connects to the port named in the 227 reply</text><text x='320' y='266' font-size='9.5' fill='var(--ok)' text-anchor='middle'>227 Entering Passive Mode (192,168,1,2,195,80): 195 x 256 + 80 = 50000; works through client NAT</text></svg>",
     "caption": "FTP active vs passive. Control always goes client → server:21. Active: the server opens the data connection from port 20; passive: the client opens it to a server port named in the 227 reply."
    },
    {
     "type": "table",
     "head": [
      "Setup",
      "RTTs before the HTTP response starts arriving"
     ],
     "rows": [
      [
       "http:// over TCP",
       "2 (TCP 1 + HTTP 1)"
      ],
      [
       "https:// TCP + TLS 1.2",
       "4 (1 + 2 + 1)"
      ],
      [
       "https:// TCP + TLS 1.3",
       "3 (1 + 1 + 1)"
      ],
      [
       "TCP + TLS 1.3 with 0-RTT resumption",
       "2 (TCP 1 + request rides in the first TLS flight)"
      ],
      [
       "HTTP/3 QUIC, new connection",
       "2 (QUIC+TLS 1 + HTTP 1)"
      ],
      [
       "HTTP/3 QUIC 0-RTT resumption",
       "1"
      ]
     ],
     "caption": "Transmission times ignored. The script Unit05_http_timing.py asserts this table."
    },
    {
     "type": "worked",
     "title": "HPACK: how many bytes are the first two requests? (RFC 7541 C.3)",
     "tag": "GATE-style",
     "problem": "<p>Request 1 has headers <code>:method: GET</code>, <code>:scheme: http</code>, <code>:path: /</code>, <code>:authority: www.example.com</code>. Request 2 on the same connection has the same four plus <code>cache-control: no-cache</code>. No Huffman coding. How many bytes does HPACK need for each header block?</p>",
     "steps": [
      {
       "text": "0x82, 0x86, 0x84: three 1-byte indexed fields.",
       "why": ":method GET = 2, :scheme http = 6, :path / = 4 in the static table."
      },
      {
       "tex": "0x41 = 01\\,000001_2",
       "why": "Literal with incremental indexing (prefix 01), name = static index 1 (:authority)."
      },
      {
       "tex": "1 + 1 + 15 = 17",
       "why": "0x41, a length byte 0x0f (15), then the 15 ASCII bytes of www.example.com."
      },
      {
       "tex": "\\text{Request 1} = 3 + 17 = 20\\ \\text{bytes}",
       "why": "The header is now dynamic entry 62."
      },
      {
       "tex": "0xbe = 1\\,0111110_2 = \\text{index } 62",
       "why": "Request 2 sends :authority as a single indexed byte."
      },
      {
       "tex": "0x58 = 01\\,011000_2,\\ 0x08,\\ \\text{\"no-cache\"} \\Rightarrow 1+1+8 = 10",
       "why": "cache-control is static name index 24; value length 8."
      },
      {
       "tex": "\\text{Request 2} = 3 + 1 + 10 = 14\\ \\text{bytes}",
       "why": "Without the dynamic table the authority alone would have cost 17 bytes again."
      }
     ],
     "answer": "<p><b>20 bytes</b> and <b>14 bytes</b> (with Huffman, request 1 shrinks to 17 bytes: www.example.com becomes 12 bytes, length byte 0x8c). The plain HTTP/1.1 text <code>GET / HTTP/1.1\\r\\nHost: www.example.com\\r\\n\\r\\n</code> is 41 bytes.</p>"
    },
    {
     "type": "cheat",
     "title": "Extras",
     "items": [
      "HPACK: static table 61 entries, dynamic table FIFO (default 4096 B, indices from 62), Huffman for literals; entry size = name + value + 32.",
      "Indexed field byte = 0x80 | index (0x82 = :method GET).",
      "TLS 1.2 = 2 RTT, TLS 1.3 = 1 RTT, resumption 0-RTT (replayable: idempotent requests only).",
      "QUIC new connection 1 RTT (transport + TLS together); 0-RTT on resumption.",
      "FTP: control TCP 21; active data from server port 20 (PORT); passive data to a server port from PASV/227; port = p1·256 + p2."
     ]
    },
    {
     "type": "traps",
     "items": [
      "In active FTP the <b>server</b> opens the data connection, which a client-side NAT or firewall usually blocks; passive fixes this.",
      "0-RTT saves time but is <b>not replay-safe</b>; a POST in early data could be executed twice.",
      "HPACK's dynamic table is per connection and per direction; a new connection starts empty."
     ]
    }
   ],
   "practice": [
    {
     "id": "u05-G-1",
     "type": "num",
     "tag": "GATE-style",
     "topic": "05.14",
     "q": "<p>An FTP client sends <code>PORT 10,0,0,7,39,16</code>. On which client port must it be listening for the data connection? (integer)</p>",
     "answer": 10000,
     "tol": 0,
     "unit": "port",
     "verify": "39*256 + 16",
     "steps": [
      {
       "tex": "\\text{port} = p_1\\times256 + p_2",
       "why": "The last two numbers are the high and low bytes."
      },
      {
       "tex": "39\\times256 + 16 = 9984 + 16 = 10000",
       "why": "Substitute."
      }
     ],
     "explain": "<p>Port 10000; in active mode the server connects to it from port 20.</p>"
    },
    {
     "id": "u05-G-2",
     "type": "mcq",
     "tag": "GATE-style",
     "topic": "05.14",
     "q": "<p>A client behind a home NAT cannot download files in FTP active mode but listing commands work. The best fix is</p>",
     "options": [
      "Switch to passive mode (PASV) so the client opens the data connection",
      "Use port 20 for control",
      "Use UDP for the data connection",
      "Send the PORT command twice"
     ],
     "answer": 0,
     "why": [
      "Correct: outbound connections pass the NAT; inbound ones from port 20 do not.",
      "Control is on 21; that is not the problem.",
      "FTP data uses TCP.",
      "Repetition does not open the NAT."
     ],
     "explain": "<p>Passive mode makes every connection client-initiated.</p>"
    },
    {
     "id": "u05-G-3",
     "type": "num",
     "tag": "GATE-style",
     "topic": "05.14",
     "q": "<p>Encode the integer 40 with a 5-bit HPACK prefix. How many bytes does the encoding take? (integer)</p>",
     "answer": 2,
     "tol": 0,
     "unit": "bytes",
     "verify": "1 + (1 if 40 - 31 < 128 else 2)",
     "steps": [
      {
       "tex": "40 \\ge 2^5 - 1 = 31",
       "why": "Does not fit in the prefix, so the prefix is 11111 and more bytes follow."
      },
      {
       "tex": "40 - 31 = 9 \\lt 128",
       "why": "The remainder fits in one 7-bit byte (00001001)."
      },
      {
       "tex": "1 + 1 = 2\\ \\text{bytes}",
       "why": "Prefix byte + one continuation byte."
      }
     ],
     "explain": "<p>2 bytes: xxx11111 then 00001001.</p>"
    },
    {
     "id": "u05-G-4",
     "type": "mcq",
     "tag": "GATE-style",
     "topic": "05.14",
     "q": "<p>Why may a server refuse a POST sent as TLS 1.3 0-RTT early data?</p>",
     "options": [
      "0-RTT data is not encrypted",
      "An attacker can replay early data, so a non-idempotent request could run twice",
      "0-RTT works only over UDP",
      "POST bodies are too large for 0-RTT"
     ],
     "answer": 1,
     "why": [
      "Early data is encrypted with the resumption key.",
      "Correct: RFC 8446 §8 warns about replay; servers answer 425 Too Early.",
      "TLS 1.3 0-RTT works over TCP too; QUIC also has it.",
      "Size is not the reason."
     ],
     "explain": "<p>Only safe or idempotent requests belong in early data.</p>"
    },
    {
     "id": "u05-G-5",
     "type": "num",
     "tag": "GATE-style",
     "topic": "05.14",
     "q": "<p>How many bytes does the HPACK dynamic-table entry <code>user-agent: curl/8.5</code> consume? (integer)</p>",
     "answer": 50,
     "tol": 0,
     "unit": "bytes",
     "verify": "len('user-agent') + len('curl/8.5') + 32",
     "steps": [
      {
       "tex": "|\\text{name}| = 10,\\ |\\text{value}| = 8",
       "why": "Count the characters of user-agent and curl/8.5."
      },
      {
       "tex": "10 + 8 + 32 = 50",
       "why": "RFC 7541 §4.1 adds a fixed 32-byte overhead per entry."
      }
     ],
     "explain": "<p>50 bytes of the default 4,096-byte dynamic table.</p>"
    }
   ]
  }
 ]
};
