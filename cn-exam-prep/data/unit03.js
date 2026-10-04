// Unit 03: Protocol Layers: OSI vs TCP/IP, PDUs, Encapsulation (WB-L03, WB-L07 p3, SL-L09 p4, WB-L01 p31)
window.UNITS = window.UNITS || {};
window.UNITS["unit03"] = {
  id: "unit03", num: 3, day: 1,
  title: "Protocol Layers: OSI vs TCP/IP, PDUs, Encapsulation",
  lectures: "Lecture 3 · WB-L03 (+ WB-L01 p31, WB-L07 p3, SL-L09 p4)",
  overview: "<p>This unit is the map for the whole course. MCQs ask <b>which layer</b> does a job, <b>which protocol or device</b> lives where, and <b>what the PDU is called</b> (message, segment, datagram, frame, bits). Numericals ask for <b>header overhead and efficiency</b> (1460 B of data in a 1518 B frame = 96.18%). Coding questions ask you to <b>build and parse an encapsulated frame</b> byte by byte or with <code>struct</code>.</p>" +
            "<p>The slides use the <b>4-layer TCP/IP model</b> (RFC 1122); the class quiz and Kurose &amp; Ross use <b>5 layers</b>. Learn both, plus the 7-layer OSI model and its mnemonic. Four slide errors are corrected here: IMAP is not Presentation (B17), UDP's PDU is not a \"packet\" (B18), ISO's real name (B19), and request arrows go client → server (B20).</p>",
  sections: [
    // ------------------------------------------------------------------ 03-A
    {
      id: "03-A",
      title: "Layering and encapsulation: the letter, the gift and the nesting doll",
      badge: "class",
      source: "WB-L03 p3–11",
      covers: ["03.1"],
      blocks: [
        { type: "intuition", title: "Does the mail carrier care what your letter says?",
          html: "<p><b>Analogy (WB-L03 p5–10).</b> You write a note, wrap it as a gift, put it in an envelope, address and stamp it, and drop it at the post office. The post office adds a barcode and a priority label, sorts it into a tray, loads it on a truck, and the destination office delivers it. <b>The mail carrier does not care about the letter's contents</b> (p5: \"NO\"). Each stage does one job, adds its own wrapping, and trusts the stage below. That is <b>layering</b>. The Russian <b>nesting doll</b> (p9) is <b>encapsulation</b>: going down the sender's stack, each layer wraps the data from above with its own header; at the receiver, <b>decapsulation</b> strips one header per layer and hands the payload up.</p>" +
                "<p><b>Precise definition (Kurose &amp; Ross §1.5).</b> In a layered architecture each layer provides its <b>service</b> by (1) performing actions within that layer and (2) using the services of the layer directly below. At each layer a packet has two parts: <b>header fields</b> and a <b>payload</b>, and the payload is the whole packet from the layer above.</p>" },
        { type: "table", head: ["Letter step (WB-L03 p7)", "What gets added", "Network equivalent"],
          rows: [
            ["1 Write the note", "the content itself", "Application data / message (L7)"],
            ["2 Wrap it as a gift", "presentation: paper, box, ribbon", "formatting, compression, encryption (OSI L6)"],
            ["3 Put it in an envelope", "a container for this one conversation", "session / transport wrapping (L5, L4 header with ports)"],
            ["4 Address and stamp the envelope", "source and destination postal address", "IP header with source and destination IP (L3)"],
            ["Destination postal office label", "barcode for the next sorting office only", "MAC header for the next hop only (L2)"],
            ["5 Post office and mailbox", "accepts and stores the letter", "router queue (store-and-forward)"],
            ["6 Sorting tray", "chooses the next office", "forwarding decision from the routing table"],
            ["7 Truck", "physically moves it", "physical medium: cable, fibre, radio (L1)"],
            ["Delivered at destination", "each wrapping removed in reverse", "decapsulation up the receiver's stack"] ],
          caption: "WB-L03 p7 and p10 (\"Can you see encapsulation?\"): every wrapping is a header." },
        { type: "figure", caption: "The nesting doll as bytes: each layer's PDU is the payload of the layer below. Headers are added at the front; Ethernet also adds a trailer (FCS).",
          html: "<svg viewBox='0 0 620 220' width='100%' role='img' aria-label='Nested encapsulation boxes'>" +
                "<rect x='10' y='10' width='600' height='200' rx='10' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='22' y='30' fill='var(--bad)' font-size='13' font-weight='bold'>Frame (Link layer): MAC header + datagram + FCS trailer</text>" +
                "<rect x='40' y='42' width='540' height='150' rx='9' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='52' y='62' fill='var(--warn)' font-size='13' font-weight='bold'>Datagram / packet (Network layer): IP header + segment</text>" +
                "<rect x='70' y='74' width='480' height='100' rx='8' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='82' y='94' fill='var(--accent)' font-size='13' font-weight='bold'>Segment (Transport layer): TCP or UDP header + message</text>" +
                "<rect x='100' y='106' width='420' height='52' rx='7' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='112' y='126' fill='var(--ok)' font-size='13' font-weight='bold'>Message (Application layer): HTTP header + data</text>" +
                "<text x='112' y='146' fill='var(--muted)' font-size='12'>the innermost doll: what the user actually wanted to send</text>" +
                "</svg>" },
        { type: "callout", kind: "analogy", title: "\"What if they do?\" (WB-L03 p5 follow-up)",
          html: "<p>A router is the mail carrier: it reads only up to the <b>IP header</b> (Layer 3) and forwards. Devices that <i>do</i> look inside, such as firewalls doing deep packet inspection, Layer-7 load balancers or proxies, break the clean layering. They can filter, rewrite or log content, which is why end-to-end encryption (TLS) exists: it keeps the contents private even from boxes that peek.</p>" },
        { type: "cheat", title: "Why layer at all",
          items: [ "<b>Modularity</b>: change one layer (WiFi ↔ Ethernet) without touching the others",
                   "<b>Interoperability</b>: different vendors interwork because each layer has a standard interface",
                   "<b>Manageability</b>: debug one layer at a time (\"that is a Layer 4 issue\")",
                   "Costs: <b>header overhead</b> on every packet and some <b>duplicated work</b> (error detection at L2 and L4)",
                   "Encapsulation = add a header going down; decapsulation = strip it going up, in reverse order" ] },
        { type: "traps", items: [
            "Layering does <b>not</b> make each packet faster; it adds headers (overhead). The benefit is modularity and interoperability.",
            "Each layer talks <b>logically</b> to its peer layer on the other host, but <b>physically</b> only to the layers directly above and below it.",
            "Decapsulation happens in the <b>reverse</b> order: the receiver removes the MAC header first and the HTTP header last.",
            "The payload of layer n is the entire PDU of layer n+1, headers included." ] }
      ],
      practice: [
        { id: "u03-A-q10", type: "mcq", tag: "From class quiz", topic: "03.1",
          q: "<p>What is the main benefit of layering in network design?</p>",
          options: ["It increases the speed of every packet by splitting work across layers", "Each layer is independent — you can change one layer (e.g., swap WiFi for Ethernet) without affecting the others, giving modularity and interoperability", "Layering removes all headers to reduce packet size", "It forces every vendor to use identical hardware"],
          answer: 1,
          why: ["Layering adds processing steps and headers; it does not speed up packets.",
                "Correct: modularity (swap link technology without touching the app), interoperability (mix vendors) and manageability (debug one layer at a time).",
                "The opposite: every layer <i>adds</i> a header, so packets get bigger.",
                "Layering standardises interfaces and protocols, which is exactly what lets <i>different</i> hardware interwork."],
          explain: "<p>Quiz answer B. Each layer only talks to the layer directly above or below it.</p>" },
        { id: "u03-A-2", type: "mcq", tag: "University-Midsem-style", topic: "03.1",
          q: "<p>\"The mail carrier does not care about the letter's contents\" (WB-L03 p5) best describes which network behaviour?</p>",
          options: ["A switch reads the HTTP body to choose a port", "A router forwards using only the IP header and ignores the TCP and HTTP contents", "TCP encrypts every segment", "The physical layer checks spelling"],
          answer: 1,
          why: ["Switches forward on MAC addresses (Layer 2), not on HTTP content.",
                "Correct: a router processes Layers 1–3; the TCP segment and HTTP message are just payload to it.",
                "TCP does not encrypt; TLS does.",
                "The physical layer only moves bits."],
          explain: "<p>Each layer treats everything above it as opaque payload.</p>" },
        { id: "u03-A-3", type: "mcq", tag: "University-Midsem-style", topic: "03.1",
          q: "<p>At the <b>receiving</b> host, which header is removed first during decapsulation?</p>",
          options: ["HTTP header", "TCP header", "IP header", "MAC (Ethernet) header"],
          answer: 3,
          why: ["The HTTP header is removed last, by the application.",
                "TCP is removed after IP.",
                "IP is removed after the MAC header.",
                "Correct: bits arrive at Layer 1, are assembled into a frame, and Layer 2 strips the MAC header and checks the FCS before handing the datagram up."],
          explain: "<p>Reverse order of encapsulation: MAC, then IP, then TCP, then HTTP.</p>" },
        { id: "u03-A-4", type: "msq", tag: "GATE-style", topic: "03.1",
          q: "<p>Which are genuine <b>costs</b> of a layered protocol design? (Select all that apply.)</p>",
          options: ["Every layer adds header bytes to every packet", "Some functions are duplicated, such as error detection at both Layer 2 and Layer 4", "Changing the link technology forces every application to be rewritten", "Information hidden inside one layer cannot easily be used by another layer to optimise"],
          answer: [0, 1, 3],
          why: ["Correct: header overhead is the price of layering (see 03-D).",
                "Correct: Ethernet's CRC and TCP's checksum both detect errors.",
                "Wrong: avoiding exactly that rewrite is the main <i>benefit</i> of layering.",
                "Correct: for example TCP cannot see that a WiFi loss was a radio error rather than congestion."],
          explain: "<p>Overhead, duplication and information hiding are the textbook disadvantages.</p>" },
        { id: "u03-A-5", type: "text", tag: "University-Midsem-style", topic: "03.1",
          q: "<p>Predict the exact output.</p>",
          code: "msg = \"Data\"\nfor hdr in [\"HTTP\", \"TCP\", \"IP\", \"MAC\"]:\n    msg = hdr + \"|\" + msg\nprint(msg)",
          answer: "MAC|IP|TCP|HTTP|Data", runCheck: true,
          explain: "<p>Each pass puts the new header in <b>front</b>, so the last header added (MAC) is first on the wire: exactly the WB-L03 header order.</p>" }
      ]
    },
    // ------------------------------------------------------------------ 03-B
    {
      id: "03-B",
      title: "The OSI model and its upper layers: Application, Presentation, Session",
      badge: "class",
      source: "WB-L03 p12–21; WB-L01 p31; SL-L10 p3; WB-L07 p3",
      covers: ["03.2", "03.3", "03.4", "03.5"],
      blocks: [
        { type: "intuition", title: "Seven floors, each with one job",
          html: "<p><b>Analogy (WB-L03 p12).</b> Wrapping a gift: gift paper, then a box, then a ribbon going out; the receiver unwraps in reverse. The OSI model splits \"send data across the world\" into <b>seven</b> clean layers so everyone shares one map and one vocabulary (\"that's a Layer 4 issue\", p13).</p>" +
                "<p><b>Definition.</b> <b>OSI = Open Systems Interconnection</b> reference model, developed by <b>ISO, the International Organization for Standardization</b> (standard ISO 7498, 1984). Its purpose is a <b>standard</b> for network communication that ensures <b>interoperability</b> between different systems and devices (p14). It is a <b>conceptual</b> model: the Internet actually runs TCP/IP (03-E).</p>" +
                "<p><b>Upper layers.</b> <b>L7 Application</b> delivers network services directly to users (web, email, file transfer): the <i>waiter</i> who takes your order to the kitchen and returns with food (p16–17). <b>L6 Presentation</b> formats, translates, compresses and encrypts data so the receiving application can read it: the <i>translator</i> (HOLA ⇄ HELLO, p18–19). <b>L5 Session</b> establishes, manages and terminates sessions, with <b>dialog control</b> and <b>synchronization</b>: the <i>courtroom judge</i> or <i>panel moderator</i> (p20–21).</p>" },
        { type: "figure", caption: "WB-L01 p31 and WB-L03 p12 combined: the OSI stack from Layer 7 (top) to Layer 1 (bottom). Data flows down the stack to send and up the stack to receive.",
          html: "<svg viewBox='0 0 620 330' width='100%' role='img' aria-label='OSI seven layer stack'>" +
                "<rect x='10' y='8' width='470' height='40' rx='7' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='22' y='33' fill='currentColor' font-size='13'><tspan font-weight='bold'>7 Application</tspan> · what the user touches · HTTP, DNS, SMTP, IMAP</text>" +
                "<rect x='10' y='53' width='470' height='40' rx='7' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='22' y='78' fill='currentColor' font-size='13'><tspan font-weight='bold'>6 Presentation</tspan> · format and encrypt · TLS/SSL, JPEG, MPEG, encoding</text>" +
                "<rect x='10' y='98' width='470' height='40' rx='7' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='22' y='123' fill='currentColor' font-size='13'><tspan font-weight='bold'>5 Session</tspan> · open and close talks · RPC, sockets, login sessions</text>" +
                "<rect x='10' y='143' width='470' height='40' rx='7' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='22' y='168' fill='currentColor' font-size='13'><tspan font-weight='bold'>4 Transport</tspan> · reliable delivery · TCP, UDP, ports</text>" +
                "<rect x='10' y='188' width='470' height='40' rx='7' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='22' y='213' fill='currentColor' font-size='13'><tspan font-weight='bold'>3 Network</tspan> · find the path · IP, ICMP, IPsec, routers</text>" +
                "<rect x='10' y='233' width='470' height='40' rx='7' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='22' y='258' fill='currentColor' font-size='13'><tspan font-weight='bold'>2 Data link</tspan> · node to node · MAC, ARP, VLAN, STP, switches</text>" +
                "<rect x='10' y='278' width='470' height='40' rx='7' fill='none' stroke='var(--muted)' stroke-width='2'/><text x='22' y='303' fill='currentColor' font-size='13'><tspan font-weight='bold'>1 Physical</tspan> · raw bits · cables, fibre, radio, hubs</text>" +
                "<text x='500' y='78' fill='var(--bad)' font-size='12'>message / data</text><text x='500' y='168' fill='var(--accent)' font-size='12'>segment</text><text x='500' y='213' fill='var(--warn)' font-size='12'>datagram (packet)</text><text x='500' y='258' fill='var(--ok)' font-size='12'>frame</text><text x='500' y='303' fill='var(--muted)' font-size='12'>bits</text>" +
                "<line x1='495' y1='20' x2='495' y2='130' stroke='var(--bad)' stroke-width='2'/>" +
                "</svg>" },
        { type: "table", head: ["#", "Layer", "Job (slides)", "Protocols / examples", "PDU", "Device"],
          rows: [
            ["7", "Application", "network services to the user; request/response (waiter)", "HTTP, HTTPS, SMTP, FTP, DNS, IMAP, POP3, P2P apps", "message (data)", "host, proxy, Layer-7 load balancer (ALB)"],
            ["6", "Presentation", "beautification (format), translation (ASCII ⇄ Unicode), compression (zip/unzip), encryption", "TLS/SSL (WB-L01 p31), JPEG, PNG, GIF, MPEG, UTF-8", "data", "host"],
            ["5", "Session", "establish, manage, terminate sessions; dialog control; synchronization", "RPC, sockets, login sessions", "data", "host"],
            ["4", "Transport", "segmentation and reassembly, multiplexing via ports, reliability (TCP)", "TCP, UDP", "segment", "host, Layer-4 load balancer (NLB)"],
            ["3", "Network", "logical (IP) addressing, routing and forwarding", "IP, ICMP, IPsec", "datagram (packet)", "router"],
            ["2", "Data link", "framing, MAC addressing, error detection, media access control", "Ethernet, ARP, VLAN (802.1Q), STP", "frame", "switch, bridge"],
            ["1", "Physical", "raw bits as signals on a medium", "coax, fibre, radio, twisted pair", "bits", "hub, repeater, cable"] ],
          caption: "Full OSI reference table. Rows 7–5 are this section; rows 4–1 are 03-C." },
        { type: "seq", left: "Client (customer / browser)", right: "Server (chef / website)", caption: "WB-L03 p16 waiter analogy as a timing ladder. The request always goes client → server, the response server → client.",
          events: [
            { from: "L", label: "HTTP request: GET /menu (the order)", note: "waiter carries the order" },
            { from: "R", label: "HTTP response: 200 OK + page (the food)", note: "waiter brings it back" } ] },
        { type: "callout", kind: "slidefix", title: "B20 · WB-L03 p17 (also SL-L09 p26, WB-L08 p70 and p113): arrows reversed",
          html: "<p><b>Slide shows:</b> the \"Request\" arrow pointing from the website to the Application Layer and \"Response\" going back.</p><p><b>Correct:</b> the <b>request goes client → server</b> (the customer's order goes to the kitchen) and the <b>response goes server → client</b>. The slide's own text (\"the waiter takes your order to the kitchen\") agrees with the correct direction.</p>" },
        { type: "callout", kind: "slidefix", title: "B17 · WB-L03 p15, WB-L07 p3, SL-L09 p4: IMAP is not a Presentation-layer protocol",
          html: "<p><b>Slide shows:</b> \"6 Presentation: JPEG MPEG IMAP\".</p><p><b>Correct:</b> <b>IMAP</b> (Internet Message Access Protocol, port 143, or 993 over TLS) is an <b>Application-layer</b> email-retrieval protocol, like SMTP and POP3 (WB-L07). JPEG and MPEG are data formats and are the right Presentation examples.</p>" },
        { type: "text", html: "<p><b>Session layer details.</b> <b>Dialog control</b> decides who may talk when (simplex, half-duplex or full-duplex), like a judge saying \"Order! Order!\" (p20). <b>Synchronization</b> inserts <b>checkpoints</b> into a long transfer so that after a failure it resumes from the last checkpoint instead of from the start. In the Internet these jobs are done by the application itself or by libraries (sockets, RPC, TLS sessions); there is no separate session layer in TCP/IP.</p>" },
        { type: "derivation", title: "Synchronization checkpoints save work",
          steps: [
            { tex: "\\text{resume point} = c\\cdot\\left\\lfloor \\frac{f}{c} \\right\\rfloor", why: "With a checkpoint every c bytes, a failure at byte f restarts from the last checkpoint below f." },
            { tex: "c = 100\\,\\text{MB}, f = 730\\,\\text{MB} \\Rightarrow 100\\cdot\\lfloor 7.3 \\rfloor = 700\\,\\text{MB}", why: "A 1000 MB file fails at 730 MB." },
            { tex: "\\text{still to send} = 1000 - 700 = 300\\,\\text{MB}", why: "Everything from the checkpoint to the end of the file." },
            { tex: "\\text{repeated} = 730 - 700 = 30\\,\\text{MB}; \\text{without checkpoints: } 730\\,\\text{MB}", why: "Only 30 MB of work is redone instead of all 730 MB." } ] },
        { type: "cheat", title: "Upper OSI layers",
          items: [ "OSI = Open Systems Interconnection; by ISO = <b>International Organization for Standardization</b> (ISO 7498, 1984)",
                   "L7 Application: services to users; HTTP, HTTPS, SMTP, FTP, DNS, IMAP, POP3",
                   "L6 Presentation: translation, compression, encryption; JPEG, MPEG, PNG, GIF, ASCII/Unicode, TLS",
                   "L5 Session: establish / manage / terminate; dialog control; synchronization (checkpoints); RPC, sockets",
                   "Request: client → server. Response: server → client" ] },
        { type: "traps", items: [
            "IMAP, POP3 and SMTP are all <b>Application</b> layer (B17); JPEG and MPEG are Presentation <i>formats</i>.",
            "HTTPS is an Application-layer protocol; the TLS encryption under it is what the OSI mapping calls Presentation.",
            "DNS is Application layer even though it rides on UDP port 53.",
            "\"Session\" in OSI is not the same thing as a TCP connection (which is Layer 4).",
            "ISO is not \"International Standard Organisation\" (that is the WB-L03 p32 wording, see B19 in 03-E)." ] }
      ],
      practice: [
        { id: "u03-B-1", type: "mcq", tag: "University-Midsem-style", topic: "03.4",
          q: "<p>Translation (ASCII to Unicode), compression and encryption are the jobs of which OSI layer?</p>",
          options: ["Application", "Presentation", "Session", "Transport"],
          answer: 1,
          why: ["Application provides network services (web, email) to the user, not data formatting.",
                "Correct: WB-L03 p18–19, the translator.",
                "Session handles dialog control and synchronization.",
                "Transport handles segmentation, ports and reliability."],
          explain: "<p>Presentation makes data readable and secure for the receiving application.</p>" },
        { id: "u03-B-2", type: "mcq", tag: "University-Midsem-style", topic: "03.3",
          q: "<p>The slide lists IMAP next to JPEG and MPEG. In which OSI layer does IMAP actually belong?</p>",
          options: ["Presentation", "Session", "Application", "Transport"],
          answer: 2,
          why: ["This is the slide error B17: JPEG and MPEG are formats, IMAP is not.",
                "Session manages dialogs; IMAP is a mail-access protocol.",
                "Correct: IMAP is an application protocol for reading mail on a server, like POP3.",
                "IMAP runs <i>over</i> TCP (port 143 or 993); it is not itself a transport protocol."],
          explain: "<p>Email protocols SMTP, POP3 and IMAP are all Layer 7.</p>" },
        { id: "u03-B-3", type: "mcq", tag: "University-Midsem-style", topic: "03.5",
          q: "<p>\"Dialog control and synchronization\" (WB-L03 p20) describe which layer?</p>",
          options: ["Session", "Network", "Data link", "Physical"],
          answer: 0,
          why: ["Correct: the courtroom / moderator layer that opens, manages and closes conversations.",
                "Network handles IP addressing and routing.",
                "Data link handles framing, MAC addressing and error detection.",
                "Physical moves raw bits."],
          explain: "<p>Layer 5 Session.</p>" },
        { id: "u03-B-4", type: "msq", tag: "University-Midsem-style", topic: "03.3",
          q: "<p>Which of these are <b>Application-layer</b> protocols? (Select all that apply.)</p>",
          options: ["SMTP", "IMAP", "JPEG", "DNS"],
          answer: [0, 1, 3],
          why: ["Correct: email sending.",
                "Correct: email retrieval (despite the slide placing it in Presentation).",
                "JPEG is an image format, a Presentation-layer example.",
                "Correct: name resolution is an application service."],
          explain: "<p>Formats are Layer 6; protocols that users' applications speak are Layer 7.</p>" },
        { id: "u03-B-5", type: "mcq", tag: "University-Midsem-style", topic: "03.2",
          q: "<p>Who developed the OSI model, and what is that body's correct name?</p>",
          options: ["DARPA, Defense Advanced Research Projects Agency", "ISO, International Organization for Standardization", "IEEE, Institute of Electrical and Electronics Engineers", "IETF, Internet Engineering Task Force"],
          answer: 1,
          why: ["DARPA funded TCP/IP, not OSI (WB-L03 p32).",
                "Correct: WB-L03 p12 gives this name (p32's \"International Standard Organisation\" is wrong).",
                "IEEE writes the 802 LAN standards (Ethernet, WiFi).",
                "IETF writes the Internet RFCs."],
          explain: "<p>OSI: ISO 7498 (1984).</p>" },
        { id: "u03-B-6", type: "mcq", tag: "University-Midsem-style", topic: "03.3",
          q: "<p>In the waiter analogy, which way does the <b>request</b> travel?</p>",
          options: ["From the chef (server) to the customer (client)", "From the customer (client) to the chef (server)", "From the waiter to the physical layer only", "Requests and responses travel the same direction"],
          answer: 1,
          why: ["That is the response direction; the WB-L03 p17 arrow is drawn this way by mistake (B20).",
                "Correct: the client asks, the server answers.",
                "The waiter is the application layer and talks to the kitchen, not only to the wire.",
                "They travel in opposite directions."],
          explain: "<p>Request: client → server; response: server → client.</p>" },
        { id: "u03-B-7", type: "num", tag: "University-Midsem-style", topic: "03.5",
          q: "<p>A 1000 MB transfer uses session checkpoints every 100 MB. The connection fails after 730 MB. How many MB must be sent after the restart? (integer)</p>",
          answer: 300, tol: 0, unit: "MB", verify: "1000 - 100*(730//100)",
          steps: [ { tex: "100\\times\\lfloor 730/100 \\rfloor = 700\\,\\text{MB}", why: "Resume from the last checkpoint." },
                   { tex: "1000 - 700 = 300\\,\\text{MB}", why: "The remainder of the file from that checkpoint." } ],
          explain: "<p>Synchronization limits the redone work to 30 MB.</p>" },
        { id: "u03-B-8", type: "text", tag: "University-Midsem-style", topic: "03.4",
          q: "<p>Presentation-layer translation in Python. Predict the exact output.</p>",
          code: "s = \"HOLA\"\nb = s.encode(\"utf-8\")\nprint(len(b), b.hex())",
          answer: "4 484f4c41", runCheck: true,
          explain: "<p>Each ASCII letter is one UTF-8 byte: H = 0x48, O = 0x4f, L = 0x4c, A = 0x41.</p>" }
      ]
    },
    // ------------------------------------------------------------------ 03-C
    {
      id: "03-C",
      title: "OSI lower layers: Transport, Network, Data Link, Physical",
      badge: "class",
      source: "WB-L03 p22–29; WB-L01 p31; WB-L07 p3; SL-L09 p4",
      covers: ["03.6", "03.7", "03.8", "03.9"],
      blocks: [
        { type: "intuition", title: "Truck, GPS, turnstile, road",
          html: "<p><b>Analogies (WB-L03 p22–29).</b> <b>Transport</b>: the message is split into envelopes with detailed source and destination, carried by truck and <b>reassembled</b> at the receiver; many conversations share one phone line (<b>multiplexing</b>). <b>Network</b>: a <b>GPS</b> that finds the best roads from point A to point B. <b>Data link</b>: an <b>error checker</b> and a <b>turnstile</b> (\"one at a time!\") between two directly connected nodes. <b>Physical</b>: the roads, wires and radio signals themselves.</p>" +
                "<p><b>Precise definitions.</b> <b>L4 Transport</b>: reliable and efficient <b>process-to-process</b> delivery; segmentation and reassembly; multiplexing and demultiplexing using <b>port numbers</b>; TCP adds reliability, ordering, flow and congestion control, UDP does not. <b>L3 Network</b>: <b>logical addressing</b> (IP) and <b>forwarding</b> packets across different networks along a path chosen by <b>routing</b>; IP, ICMP, IPsec. <b>L2 Data link</b>: delivery between two <b>directly connected</b> nodes; <b>framing</b> (header, payload, trailer), <b>MAC addressing</b>, <b>error detection</b> (CRC in the trailer) and <b>media access control</b>; ARP, VLAN, STP. <b>L1 Physical</b>: transmits <b>raw bits</b> over coaxial cable, fibre, twisted pair or radio; hubs and repeaters live here.</p>" },
        { type: "figure", caption: "WB-L03 p27 framing: the sender's Layer 2 puts the packet into the payload field between a header and a trailer; the receiver checks the trailer and hands the packet up.",
          html: "<svg viewBox='0 0 620 200' width='100%' role='img' aria-label='Data link framing'>" +
                "<text x='150' y='20' text-anchor='middle' fill='currentColor' font-size='13' font-weight='bold'>Sending machine</text><text x='470' y='20' text-anchor='middle' fill='currentColor' font-size='13' font-weight='bold'>Receiving machine</text>" +
                "<rect x='100' y='32' width='100' height='32' rx='5' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='150' y='53' text-anchor='middle' fill='currentColor' font-size='12'>Packet</text>" +
                "<rect x='420' y='32' width='100' height='32' rx='5' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='470' y='53' text-anchor='middle' fill='currentColor' font-size='12'>Packet</text>" +
                "<line x1='150' y1='64' x2='150' y2='100' stroke='currentColor' stroke-width='2'/><path d='M144,94 L150,104 L156,94 z' fill='currentColor'/>" +
                "<line x1='470' y1='100' x2='470' y2='68' stroke='currentColor' stroke-width='2'/><path d='M464,74 L470,64 L476,74 z' fill='currentColor'/>" +
                "<rect x='20' y='104' width='70' height='36' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='55' y='127' text-anchor='middle' fill='currentColor' font-size='12'>Header</text>" +
                "<rect x='90' y='104' width='120' height='36' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='150' y='127' text-anchor='middle' fill='currentColor' font-size='12'>Payload field</text>" +
                "<rect x='210' y='104' width='70' height='36' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='245' y='127' text-anchor='middle' fill='currentColor' font-size='12'>Trailer</text>" +
                "<rect x='340' y='104' width='70' height='36' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='375' y='127' text-anchor='middle' fill='currentColor' font-size='12'>Header</text>" +
                "<rect x='410' y='104' width='120' height='36' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='470' y='127' text-anchor='middle' fill='currentColor' font-size='12'>Payload field</text>" +
                "<rect x='530' y='104' width='70' height='36' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='565' y='127' text-anchor='middle' fill='currentColor' font-size='12'>Trailer</text>" +
                "<line x1='280' y1='122' x2='340' y2='122' stroke='var(--accent)' stroke-width='2' stroke-dasharray='5 4'/><text x='310' y='160' text-anchor='middle' fill='var(--accent)' font-size='12'>frames on the link</text>" +
                "<text x='55' y='160' text-anchor='middle' fill='var(--muted)' font-size='11'>MAC addresses</text><text x='245' y='160' text-anchor='middle' fill='var(--muted)' font-size='11'>FCS (CRC-32)</text>" +
                "<text x='310' y='190' text-anchor='middle' fill='var(--muted)' font-size='11'>Ethernet II: 14 B header + 46 to 1500 B payload + 4 B trailer</text>" +
                "</svg>" },
        { type: "packet", title: "Ethernet II header (14 B) and FCS trailer (4 B); the 46–1500 B payload sits between them", width: 16,
          fields: [ { name: "Destination MAC", bits: 48, note: "next hop's 48-bit hardware address; ff:ff:ff:ff:ff:ff = broadcast" },
                    { name: "Source MAC", bits: 48, note: "sender's NIC address" },
                    { name: "EtherType", bits: 16, note: "which L3 protocol is inside: 0x0800 IPv4, 0x86DD IPv6, 0x0806 ARP" },
                    { name: "FCS (after the payload)", bits: 32, note: "CRC-32 over header + payload; receiver drops the frame on mismatch" } ],
          caption: "Drawn 16 bits per row. The 8-byte preamble + SFD before the frame and the 12-byte inter-frame gap after it are Layer 1 and are not part of the frame." },
        { type: "table", head: ["Layer", "Address / identifier", "Size", "Scope", "Changes hop by hop?"],
          rows: [
            ["L4 Transport", "port number", "16 bits (0–65535)", "process to process", "no (unless NAT/PAT rewrites it)"],
            ["L3 Network", "IPv4 address", "32 bits", "host to host, end to end across networks", "no (unless NAT rewrites it)"],
            ["L2 Data link", "MAC address", "48 bits", "node to node on one link", "<b>yes</b>: new MAC header on every link"],
            ["L1 Physical", "none (signals)", "–", "one cable or radio channel", "regenerated by each device"] ],
          caption: "Which address each lower layer uses. The MAC header is rebuilt at every router; the IP header travels end to end." },
        { type: "callout", kind: "slidefix", title: "B18 · WB-L03 p23 (repeated on WB-L07 p3 and SL-L09 p4): \"TCP Segment / UDP Packet\"",
          html: "<p><b>Slide shows:</b> the transport PDU labelled \"TCP Segment / UDP <b>Packet</b>\".</p><p><b>Correct:</b> the UDP PDU is called a <b>segment</b> (Kurose &amp; Ross) or a <b>user datagram</b> (RFC 768). \"Packet\" is the informal name for the <b>Layer 3</b> datagram. In an MCQ, never pick \"packet\" as the transport-layer PDU.</p>" },
        { type: "callout", kind: "warning", title: "Header-content boxes on WB-L07 p3 / SL-L09 p4",
          html: "<p>The recap slides say the MAC header holds \"source MAC, destination MAC, frame control, sequence control\" and the IP header holds \"source IP, destination IP, datagram sequence order\". Two details are off. <b>Frame control</b> and <b>sequence control</b> are fields of the <b>WiFi (IEEE 802.11)</b> MAC header; a wired <b>Ethernet II</b> header is only destination MAC, source MAC and EtherType, with the FCS as a trailer. IPv4 has <b>no sequence number</b>: putting data back in order is TCP's job (sequence numbers); IP's Identification and Fragment Offset fields only reassemble fragments of one datagram.</p>" },
        { type: "derivation", title: "Address spaces and how long one frame occupies the wire",
          steps: [
            { tex: "2^{16} = 65\\,536 \\text{ ports}", why: "A 16-bit port field gives 65,536 values (0 to 65,535) per transport protocol per host." },
            { tex: "2^{32} = 4\\,294\\,967\\,296 \\text{ IPv4 addresses}", why: "A 32-bit address field." },
            { tex: "2^{48} = 281\\,474\\,976\\,710\\,656 \\text{ MAC addresses}", why: "A 48-bit MAC field; vendors get 24-bit prefixes (OUIs)." },
            { tex: "t = \\frac{1518\\times8}{10^{9}} = 12.144\\,\\mu\\text{s}", why: "A maximum-size 1518-byte Ethernet frame is 12,144 bits; at 1 Gbps each bit takes 1 ns." } ] },
        { type: "cheat", title: "Lower OSI layers",
          items: [ "L4 Transport: TCP, UDP; ports; segmentation and reassembly; mux/demux; PDU = <b>segment</b>",
                   "L3 Network: IP, ICMP, IPsec; logical addressing; routing and forwarding; router; PDU = <b>datagram</b> (packet)",
                   "L2 Data link: Ethernet, ARP, VLAN, STP; framing, MAC, error detection, media access; switch; PDU = <b>frame</b>",
                   "L1 Physical: coax, fibre, twisted pair, radio; hub, repeater; PDU = <b>bits</b>",
                   "Ethernet II: 6 + 6 + 2 = 14 B header, 4 B FCS; EtherType 0x0800 = IPv4" ] },
        { type: "traps", items: [
            "Hub = <b>Layer 1</b> (repeats bits to every port); switch = <b>Layer 2</b> (forwards by MAC); router = <b>Layer 3</b> (forwards by IP).",
            "Data link is <b>node to node</b> (one link); transport is <b>end to end</b> (process to process). Do not swap them.",
            "The UDP PDU is not a \"packet\" (B18).",
            "Error detection at Layer 2 (CRC) only protects one link; TCP's checksum protects end to end.",
            "Routing (building the table) and forwarding (moving one packet to an output port) are both Layer 3 but are different jobs." ] }
      ],
      practice: [
        { id: "u03-C-1", type: "mcq", tag: "University-Midsem-style", topic: "03.8",
          q: "<p>Which layer ensures reliable transfer between two <b>directly connected</b> nodes, with framing, MAC addressing and error detection?</p>",
          options: ["Physical", "Data link", "Network", "Transport"],
          answer: 1,
          why: ["Physical only moves bits; it has no frames or addresses.",
                "Correct: WB-L03 p27.",
                "Network delivers across <i>different</i> networks using IP addresses.",
                "Transport is end to end between processes, not between neighbouring nodes."],
          explain: "<p>Layer 2 = node to node.</p>" },
        { id: "u03-C-2", type: "mcq", tag: "University-Midsem-style", topic: "03.9",
          q: "<p>Which device works purely at the Physical layer?</p>",
          options: ["Router", "Switch", "Hub", "Layer-7 load balancer"],
          answer: 2,
          why: ["Routers forward on IP addresses (Layer 3).",
                "Switches forward on MAC addresses (Layer 2).",
                "Correct: a hub repeats incoming bits out of every port (WB-L03 p29 lists hubs at L1).",
                "An ALB reads HTTP (Layer 7)."],
          explain: "<p>Hubs and repeaters are Layer 1.</p>" },
        { id: "u03-C-3", type: "msq", tag: "GATE-style", topic: "03.6",
          q: "<p>Which are functions of the <b>Transport</b> layer? (Select all that apply.)</p>",
          options: ["Segmentation and reassembly", "Multiplexing and demultiplexing with port numbers", "Choosing the path through routers", "Reliable, in-order delivery (in TCP)"],
          answer: [0, 1, 3],
          why: ["Correct: WB-L03 p22 (\"reassembled message\").",
                "Correct: WB-L03 p23 multiplexer/demultiplexer.",
                "Path choice is routing, a Network-layer job.",
                "Correct: TCP's service; UDP does not provide it."],
          explain: "<p>Layer 4 is process to process.</p>" },
        { id: "u03-C-4", type: "mcq", tag: "University-Midsem-style", topic: "03.6",
          q: "<p>The correct name for the UDP protocol data unit is:</p>",
          options: ["UDP packet", "UDP segment (Kurose) or user datagram (RFC 768)", "UDP frame", "UDP bit stream"],
          answer: 1,
          why: ["That is the slide wording (B18); \"packet\" refers to the Layer 3 datagram.",
                "Correct.",
                "Frames are Layer 2.",
                "Bits are Layer 1."],
          explain: "<p>Transport PDU = segment for both TCP and UDP in Kurose &amp; Ross.</p>" },
        { id: "u03-C-5", type: "mcq", tag: "University-Midsem-style", topic: "03.8",
          q: "<p>Which Ethernet II header field tells the receiving NIC that the payload is an IPv4 datagram?</p>",
          options: ["Destination MAC", "EtherType = 0x0800", "FCS", "Preamble"],
          answer: 1,
          why: ["The destination MAC says who the frame is for, not what is inside.",
                "Correct: 0x0800 = IPv4 (0x86DD = IPv6, 0x0806 = ARP).",
                "The FCS is the CRC trailer for error detection.",
                "The preamble is a Layer-1 synchronisation pattern before the frame."],
          explain: "<p>EtherType is the Layer-2 demultiplexing key.</p>" },
        { id: "u03-C-6", type: "num", tag: "GATE-style", topic: "03.9",
          q: "<p>How long, in <b>microseconds</b> (3 decimals), does a 1518-byte Ethernet frame take to transmit at 1 Gbps?</p>",
          answer: 12.144, tol: 0.0005, unit: "µs", verify: "1518*8/1e9*1e6",
          formula: "t = \\frac{L}{R}",
          steps: [ { tex: "L = 1518\\times8 = 12\\,144\\,\\text{bits}", why: "Bytes to bits." },
                   { tex: "t = \\frac{12\\,144}{10^{9}}\\,\\text{s} = 12.144\\,\\mu\\text{s}", why: "Divide by the rate and convert to microseconds." } ],
          explain: "<p>Physical-layer time for one full frame.</p>" },
        { id: "u03-C-7", type: "text", tag: "University-Midsem-style", topic: "03.8",
          q: "<p>Predict the exact output. (The lowest bit of the first MAC byte is the I/G bit: 0 = unicast, 1 = group.)</p>",
          code: "mac = bytes([0x02, 0x00, 0x00, 0x00, 0x00, 0x0a])\nprint(\":\".join(\"%02x\" % b for b in mac), mac[0] & 1)",
          answer: "02:00:00:00:00:0a 0", runCheck: true,
          explain: "<p>Each byte prints as two hex digits joined by colons; 0x02 & 1 = 0, so the address is unicast.</p>" }
      ]
    },
    // ------------------------------------------------------------------ 03-D
    {
      id: "03-D",
      title: "PDUs and the full encapsulation: MAC | IP | TCP | HTTP | Data | FCS",
      badge: "class",
      source: "WB-L03 p15–29; WB-L07 p3; SL-L09 p4",
      covers: ["03.10"],
      blocks: [
        { type: "intuition", title: "One request, five names",
          html: "<p><b>Analogy.</b> The same parcel is called an \"order\" at the shop, a \"consignment\" at the courier, a \"bag\" on the sorting belt and a \"truckload\" on the road. Data gets a new name at each layer because each layer added its own header.</p>" +
                "<p><b>Precise names (Kurose &amp; Ross §1.5.2).</b> Application <b>message</b> → Transport <b>segment</b> (message + TCP/UDP header) → Network <b>datagram</b> (segment + IP header) → Link <b>frame</b> (datagram + link header + trailer) → Physical <b>bits</b>. The slides' strip (WB-L03 p15–29, WB-L07 p3, SL-L09 p4) shows the header order on the wire as <b>MAC | IP | TCP | HTTP | Data</b>; the strip omits the Ethernet trailer (FCS), which we add.</p>" },
        { type: "table", head: ["Step", "Layer", "Header added", "PDU as drawn on the slide", "Name on slide", "Standard name"],
          rows: [
            ["1", "7 Application", "HTTP header", "[HTTP header][Data]", "Data", "message"],
            ["2", "4 Transport", "TCP header (src port, dst port, sequence number)", "[TCP][HTTP][Data]", "TCP Segment / UDP Packet", "segment (UDP: segment or user datagram)"],
            ["3", "3 Network", "IP header (src IP, dst IP)", "[IP][TCP][HTTP][Data]", "IP Datagram", "datagram (packet)"],
            ["4", "2 Data link", "MAC header (dst MAC, src MAC) + FCS trailer", "[MAC][IP][TCP][HTTP][Data]", "Frame", "frame"],
            ["5", "1 Physical", "none: the frame becomes signals", "10010111 as a bit string", "Bit", "bits"],
            ["6 to 10", "receiver 1 → 7", "each header removed", "the same strips in reverse", "De-encapsulation", "decapsulation"] ],
          caption: "WB-L03 p15, p23, p24, p27, p29 strips reconstructed as one table (steps 1–5 down, 6–10 up, as on WB-L07 p3)." },
        { type: "figure", caption: "The frame built in this section's worked problem and scripts: a server's 43-byte HTTP response (38-byte header + 5-byte body \"hello\") becomes a 101-byte Ethernet frame. Not to scale.",
          html: "<svg viewBox='0 0 660 300' width='100%' role='img' aria-label='Encapsulation with byte sizes'>" +
                "<text x='10' y='45' fill='currentColor' font-size='12'><tspan font-weight='bold'>L7</tspan> message 43 B</text>" +
                "<rect x='400' y='26' width='90' height='30' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='445' y='46' text-anchor='middle' fill='currentColor' font-size='11'>HTTP hdr 38</text>" +
                "<rect x='490' y='26' width='70' height='30' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='525' y='46' text-anchor='middle' fill='currentColor' font-size='11'>Data 5</text>" +
                "<text x='10' y='100' fill='currentColor' font-size='12'><tspan font-weight='bold'>L4</tspan> segment 63 B</text>" +
                "<rect x='320' y='81' width='80' height='30' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='360' y='101' text-anchor='middle' fill='currentColor' font-size='11'>TCP 20</text>" +
                "<rect x='400' y='81' width='90' height='30' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='445' y='101' text-anchor='middle' fill='currentColor' font-size='11'>HTTP hdr 38</text>" +
                "<rect x='490' y='81' width='70' height='30' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='525' y='101' text-anchor='middle' fill='currentColor' font-size='11'>Data 5</text>" +
                "<text x='10' y='155' fill='currentColor' font-size='12'><tspan font-weight='bold'>L3</tspan> datagram 83 B</text>" +
                "<rect x='240' y='136' width='80' height='30' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='280' y='156' text-anchor='middle' fill='currentColor' font-size='11'>IP 20</text>" +
                "<rect x='320' y='136' width='80' height='30' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='360' y='156' text-anchor='middle' fill='currentColor' font-size='11'>TCP 20</text>" +
                "<rect x='400' y='136' width='90' height='30' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='445' y='156' text-anchor='middle' fill='currentColor' font-size='11'>HTTP hdr 38</text>" +
                "<rect x='490' y='136' width='70' height='30' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='525' y='156' text-anchor='middle' fill='currentColor' font-size='11'>Data 5</text>" +
                "<text x='10' y='210' fill='currentColor' font-size='12'><tspan font-weight='bold'>L2</tspan> frame 101 B</text>" +
                "<rect x='160' y='191' width='80' height='30' fill='none' stroke='var(--muted)' stroke-width='2'/><text x='200' y='211' text-anchor='middle' fill='currentColor' font-size='11'>MAC 14</text>" +
                "<rect x='240' y='191' width='80' height='30' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='280' y='211' text-anchor='middle' fill='currentColor' font-size='11'>IP 20</text>" +
                "<rect x='320' y='191' width='80' height='30' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='360' y='211' text-anchor='middle' fill='currentColor' font-size='11'>TCP 20</text>" +
                "<rect x='400' y='191' width='90' height='30' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='445' y='211' text-anchor='middle' fill='currentColor' font-size='11'>HTTP hdr 38</text>" +
                "<rect x='490' y='191' width='70' height='30' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='525' y='211' text-anchor='middle' fill='currentColor' font-size='11'>Data 5</text>" +
                "<rect x='560' y='191' width='70' height='30' fill='none' stroke='var(--muted)' stroke-width='2'/><text x='595' y='211' text-anchor='middle' fill='currentColor' font-size='11'>FCS 4</text>" +
                "<text x='10' y='262' fill='currentColor' font-size='12'><tspan font-weight='bold'>L1</tspan> bits</text>" +
                "<text x='160' y='262' fill='var(--muted)' font-size='12'>101 × 8 = 808 bits, plus 8 B preamble/SFD and a 12 B gap = 121 B of wire time</text>" +
                "<text x='160' y='290' fill='var(--muted)' font-size='11'>first byte on the wire →  destination MAC 02:00:00:00:00:0a</text>" +
                "</svg>" },
        { type: "packet", title: "IPv4 header (RFC 791) with the values used in the worked example", width: 32,
          fields: [ { name: "Version", bits: 4, note: "4" }, { name: "IHL", bits: 4, note: "5 words = 20 B" },
                    { name: "DSCP / ECN (ToS)", bits: 8, note: "0x00" }, { name: "Total Length", bits: 16, note: "83 = 20 IP + 20 TCP + 43 HTTP" },
                    { name: "Identification", bits: 16, note: "0x1C46" }, { name: "Flags", bits: 3, note: "010 = DF" }, { name: "Fragment Offset", bits: 13, note: "0" },
                    { name: "TTL", bits: 8, note: "64" }, { name: "Protocol", bits: 8, note: "6 = TCP" }, { name: "Header Checksum", bits: 16, note: "0x9AF0 (computed below)" },
                    { name: "Source IP", bits: 32, note: "192.168.1.20 = C0 A8 01 14" },
                    { name: "Destination IP", bits: 32, note: "192.168.1.10 = C0 A8 01 0A" } ],
          caption: "20 bytes without options. Full field-by-field treatment: Unit 13." },
        { type: "packet", title: "TCP header (RFC 9293) with the values used in the worked example", width: 32,
          fields: [ { name: "Source Port", bits: 16, note: "80 (server)" }, { name: "Destination Port", bits: 16, note: "51514 (client's ephemeral port)" },
                    { name: "Sequence Number", bits: 32, note: "1000" },
                    { name: "Acknowledgment Number", bits: 32, note: "2000" },
                    { name: "Data Offset", bits: 4, note: "5 words = 20 B" }, { name: "Rsrvd", bits: 4, note: "0" }, { name: "Flags", bits: 8, note: "0x18 = PSH + ACK" }, { name: "Window", bits: 16, note: "64240" },
                    { name: "Checksum", bits: 16, note: "0x6929 (pseudo-header + segment)" }, { name: "Urgent Pointer", bits: 16, note: "0" } ],
          caption: "20 bytes without options. Full treatment: Unit 9." },
        { type: "callout", kind: "warning", title: "Slide header boxes, corrected",
          html: "<p>WB-L07 p3 and SL-L09 p4 list \"frame control, sequence control\" in the MAC header (those are WiFi 802.11 fields; Ethernet II has destination MAC, source MAC and EtherType) and \"datagram sequence order\" in the IP header (IPv4 has no sequence number; ordering is done by TCP). Use the two header diagrams above as the reference.</p>" },
        { type: "derivation", title: "Header overhead and efficiency of a full-size TCP/IP/Ethernet frame",
          steps: [
            { tex: "\\text{MSS} = \\text{MTU} - 20_{IP} - 20_{TCP} = 1500 - 40 = 1460\\,\\text{B}", why: "Ethernet's MTU (largest payload) is 1500 B; IPv4 and TCP headers without options take 20 B each." },
            { tex: "L_{frame} = 14 + 20 + 20 + 1460 + 4 = 1518\\,\\text{B}", why: "Add the Ethernet header (14 B) and FCS (4 B): the 18 B of Ethernet framing." },
            { tex: "\\eta_{frame} = \\frac{1460}{1518} = 0.9618 = 96.18\\%", why: "Efficiency = useful data / bytes in the frame." },
            { tex: "L_{wire} = 1518 + 8 + 12 = 1538\\,\\text{B}", why: "On the wire each frame also costs a 7 B preamble + 1 B SFD and a 12 B inter-frame gap." },
            { tex: "\\eta_{wire} = \\frac{1460}{1538} = 0.9493 = 94.93\\%", why: "So 1 Gbps Ethernet delivers at most about 949 Mbps of TCP payload." },
            { tex: "\\text{overhead} = 1 - \\eta = 1 - 0.9618 = 3.82\\%", why: "The fraction of the frame spent on headers and trailer." } ] },
        { type: "cheat", title: "Sizes to memorise",
          items: [ "Ethernet II: header 14 B (6 dst MAC + 6 src MAC + 2 EtherType), FCS 4 B → 18 B framing; preamble+SFD 8 B; inter-frame gap 12 B",
                   "Ethernet payload 46 to 1500 B → frame 64 to 1518 B (short payloads are padded to 46 B)",
                   "IPv4 header 20 B (up to 60 B with options); TCP header 20 B (up to 60 B); UDP header 8 B",
                   "MSS = 1500 − 40 = 1460 B (TCP); max UDP payload in one frame = 1500 − 28 = 1472 B",
                   "Efficiency $\\eta = \\dfrac{\\text{data}}{\\text{data} + \\text{all headers and trailers}}$",
                   "PDU names: message → segment → datagram → frame → bits" ] },
        { type: "worked", title: "The 101-byte frame: sizes, IPv4 checksum and efficiency", tag: "University-Midsem-style",
          problem: "<p>A web server (192.168.1.20, port 80) sends the HTTP response <code>HTTP/1.1 200 OK\\r\\nContent-Length: 5\\r\\n\\r\\nhello</code> to a client (192.168.1.10, port 51514) on the same Ethernet LAN, using TCP and IPv4 without options. Find (a) the size of each PDU; (b) the IPv4 Total Length field; (c) the IPv4 header checksum, given ID 0x1C46, DF set, TTL 64; (d) the data efficiency of the frame and its transmission time at 100 Mbps including preamble and gap.</p>",
          steps: [
            { text: "HTTP header = \"HTTP/1.1 200 OK\\r\\n\" (17 B) + \"Content-Length: 5\\r\\n\" (19 B) + \"\\r\\n\" (2 B) = 38 B; data \"hello\" = 5 B; message = 43 B.", why: "Count every character, with \\r\\n as 2 bytes." },
            { tex: "\\text{segment} = 20 + 43 = 63,\\; \\text{datagram} = 20 + 63 = 83,\\; \\text{frame} = 14 + 83 + 4 = 101\\,\\text{B}", why: "Add one header per layer, plus the FCS at Layer 2. 83 ≥ 46, so no padding." },
            { text: "Total Length = 83 (0x0053).", why: "IPv4 Total Length counts the IP header plus everything after it, but not the Ethernet header or FCS." },
            { text: "Header words: 4500, 0053, 1C46, 4000, 4006, 0000 (checksum zeroed), C0A8, 0114, C0A8, 010A.", why: "0x45 = version 4, IHL 5; 0x4000 = DF; 0x40 = TTL 64, 0x06 = TCP; then the two addresses." },
            { text: "4500 + 0053 = 4553; + 1C46 = 6199; + 4000 = A199; + 4006 = E19F; + C0A8 = 1A247 → fold → A248; + 0114 = A35C; + C0A8 = 16404 → fold → 6405; + 010A = 650F.", why: "One's-complement addition: any carry out of 16 bits is added back in (end-around carry)." },
            { tex: "\\text{checksum} = \\sim\\text{0x650F} = \\text{0xFFFF} - \\text{0x650F} = \\text{0x9AF0}", why: "Invert every bit of the folded sum." },
            { tex: "\\eta = \\frac{5}{101} = 4.95\\%", why: "Only the 5-byte body is user data; headers dominate tiny messages." },
            { tex: "t = \\frac{(101 + 20)\\times8}{10^{8}} = \\frac{968}{10^{8}} = 9.68\\,\\mu\\text{s}", why: "Add 8 B preamble/SFD and 12 B gap, convert to bits, divide by 100 Mbps." } ],
          answer: "<b>(a) message 43 B, segment 63 B, datagram 83 B, frame 101 B; (b) 83; (c) 0x9AF0; (d) 4.95%, 9.68 µs.</b> Both scripts below print exactly these numbers." },
        { type: "code", file: "Unit03_encapsulation_bytes.py", level: "low", title: "Build Ethernet II + IPv4 + TCP + HTTP by hand with shifts and masks, hand-written checksum and CRC-32, then decapsulate" },
        { type: "code", file: "Unit03_encapsulation_struct.py", level: "high", title: "The same frame with struct, socket.inet_aton and zlib.crc32, an overhead table, and an optional scapy cross-check" },
        { type: "traps", items: [
            "IPv4 <b>Total Length</b> excludes the 14 B Ethernet header and 4 B FCS (83, not 101).",
            "1500 is the Ethernet <b>payload</b> (MTU), not the frame size; the maximum frame is 1518 B (1522 B with a VLAN tag).",
            "MSS (1460) excludes the TCP and IP headers; do not subtract them twice.",
            "A 1-byte message still produces a <b>64-byte</b> frame because Ethernet pads the payload to 46 B.",
            "\"Efficiency\" questions differ on whether preamble and gap count: read whether the question says \"frame\" or \"on the wire\".",
            "Forgetting the <code>!</code> in a <code>struct</code> format packs in the machine's native (little-endian on x86) order, so port 80 goes on the wire as 0x5000." ] }
      ],
      practice: [
        { id: "u03-D-q11", type: "mcq", tag: "From class quiz", topic: "03.10",
          q: "<p>You click a YouTube link. At which TCP/IP layer does the URL request exist, and what is the PDU called at that layer?</p>",
          options: ["Network layer — the PDU is called a datagram", "Transport layer — the PDU is called a segment", "Application layer — the PDU is called a message", "Link layer — the PDU is called a frame"],
          answer: 2,
          why: ["The Network layer carries the datagram that will contain the request, but the URL itself is not an IP concept.",
                "The Transport layer wraps the request in a segment; the URL lives inside the payload, not in the TCP header.",
                "Correct: the HTTP request containing the URL is an Application-layer message.",
                "The frame is the Link-layer wrapper on each hop; it knows MAC addresses, not URLs."],
          explain: "<p>Quiz answer C. As it moves down the stack the message becomes a Transport segment, then a Network datagram, then a Link frame, then physical bits.</p>" },
        { id: "u03-D-2", type: "num", tag: "University-Midsem-style", topic: "03.10",
          q: "<p>A TCP segment carries 1460 B of data inside IPv4 and Ethernet II (14 B header + 4 B FCS), no options. What is the efficiency at the <b>frame</b> level, in percent, to 2 decimals?</p>",
          answer: 96.18, tol: 0.005, unit: "%", verify: "round(1460/(1460+20+20+18)*100, 2)",
          formula: "\\eta = \\frac{\\text{data}}{\\text{frame}}",
          steps: [ { tex: "1460 + 20 + 20 + 18 = 1518\\,\\text{B}", why: "Data + TCP + IP + Ethernet framing." },
                   { tex: "\\frac{1460}{1518}\\times100 = 96.18\\%", why: "Data over frame, as a percentage." } ],
          explain: "<p>3.82% of every full-size frame is headers and trailer.</p>" },
        { id: "u03-D-3", type: "num", tag: "GATE-style", topic: "03.10",
          q: "<p>Same frame as before, but the application uses <b>UDP</b> and fills the frame: 1472 B of data + 8 B UDP + 20 B IP + 18 B Ethernet framing. Efficiency at the frame level in percent, 2 decimals?</p>",
          answer: 96.97, tol: 0.005, unit: "%", verify: "round(1472/1518*100, 2)",
          steps: [ { tex: "1472 + 8 + 20 + 18 = 1518\\,\\text{B}", why: "UDP's header is 12 B smaller than TCP's, so 12 B more data fits." },
                   { tex: "\\frac{1472}{1518}\\times100 = 96.97\\%", why: "Data over frame." } ],
          explain: "<p>UDP gains 0.79 percentage points over TCP for full frames.</p>" },
        { id: "u03-D-4", type: "num", tag: "University-Midsem-style", topic: "03.10",
          q: "<p>An application hands TCP a 1-byte message (no options anywhere). What is the size of the resulting Ethernet II frame, including FCS, in bytes?</p>",
          answer: 64, tol: 0, unit: "B", verify: "14 + max(20+20+1, 46) + 4",
          steps: [ { tex: "20 + 20 + 1 = 41\\,\\text{B}", why: "IP datagram = IP header + TCP header + 1 data byte." },
                   { tex: "\\max(41, 46) = 46\\,\\text{B}", why: "Ethernet pads payloads shorter than 46 B." },
                   { tex: "14 + 46 + 4 = 64\\,\\text{B}", why: "Header + padded payload + FCS: the minimum Ethernet frame." } ],
          explain: "<p>Efficiency is 1/64 = 1.56%: why chatty protocols batch small writes (Nagle's algorithm, Unit 10).</p>" },
        { id: "u03-D-5", type: "num", tag: "University-Midsem-style", topic: "03.10",
          q: "<p>An HTTP message of 43 B is sent over TCP and IPv4 with no options. What value goes in the IPv4 <b>Total Length</b> field? (integer, bytes)</p>",
          answer: 83, tol: 0, unit: "B", verify: "20 + 20 + 43",
          steps: [ { tex: "20 + 20 + 43 = 83", why: "Total Length = IP header + IP payload (TCP header + message); Ethernet bytes are not counted." } ],
          explain: "<p>0x0053 in the header.</p>" },
        { id: "u03-D-6", type: "mcq", tag: "University-Midsem-style", topic: "03.10",
          q: "<p>In what order do the headers appear on the wire, starting with the first byte transmitted?</p>",
          options: ["HTTP, TCP, IP, MAC", "MAC, IP, TCP, HTTP", "IP, MAC, TCP, HTTP", "TCP, IP, MAC, HTTP"],
          answer: 1,
          why: ["That is the order in which headers are <i>added</i> (top layer first), which is the reverse of the wire order.",
                "Correct: WB-L03 strip [MAC header][IP header][TCP header][HTTP header][Data].",
                "The MAC header always comes first because the NIC needs it to accept the frame.",
                "The transport header is inside the IP datagram."],
          explain: "<p>The last header added (by the lowest layer) is the outermost, so it is sent first.</p>" },
        { id: "u03-D-7", type: "text", tag: "University-Midsem-style", topic: "03.10",
          q: "<p>Predict the exact output.</p>",
          code: "import struct\nprint(struct.calcsize(\"!6s6sH\"), struct.calcsize(\"!BBHHHBBH4s4s\"), struct.calcsize(\"!HHIIHHHH\"))",
          answer: "14 20 20", runCheck: true,
          explain: "<p>Ethernet: 6 + 6 + 2 = 14. IPv4: 1+1+2+2+2+1+1+2+4+4 = 20. TCP: 2+2+4+4+2+2+2+2 = 20. The <code>!</code> prefix means network order with no padding.</p>" },
        { id: "u03-D-8", type: "mcq", tag: "University-Midsem-style", topic: "03.10",
          code: "import struct\nhdr = struct.pack(\"HH\", 80, 51514)   # source port, destination port\nprint(hdr.hex())",
          q: "<p>Bug hunt. On an x86 laptop this prints <code>50003ac9</code>, and a capture shows the wrong ports. What is the bug?</p>",
          options: ["Port numbers must be packed with I (4 bytes)", "The format has no byte-order prefix, so native little-endian order is used; it should be \"!HH\"", "struct cannot pack values above 32767", "hex() reverses the bytes when printing"],
          answer: 1,
          why: ["Ports are 16-bit fields, so H (2 bytes) is right.",
                "Correct: without <code>!</code> (or <code>&gt;</code>) x86 packs 80 as 50 00; network order needs 00 50.",
                "H is unsigned 16-bit and holds 0 to 65535.",
                "hex() prints bytes in order; the bytes really are reversed."],
          explain: "<p><code>struct.pack('!HH', 80, 51514).hex()</code> gives <code>0050c93a</code>.</p>" },
        { id: "u03-D-9", type: "write", tag: "University-Midsem-style", topic: "03.10",
          q: "<p>Write <code>encapsulate(src_ip, dst_ip, src_mac, dst_mac, sport, dport, message)</code> that returns the bytes of an Ethernet II frame (with FCS) carrying an IPv4 datagram carrying a TCP segment carrying <code>message</code>. Then write <code>decapsulate(frame)</code> that verifies the FCS and both checksums and returns the message.</p>",
          starter: "import struct, socket, zlib\n\ndef checksum(data):\n    pass\n\ndef encapsulate(src_ip, dst_ip, src_mac, dst_mac, sport, dport, message):\n    pass\n\ndef decapsulate(frame):\n    pass\n",
          solutionFile: "Unit03_encapsulation_struct.py",
          rubric: ["Uses network byte order (!) in every struct format", "Computes the TCP checksum over the pseudo-header (src, dst, 0, 6, TCP length) plus the segment", "Fills IPv4 Total Length = 20 + segment length and computes the header checksum with the checksum field zeroed", "Pads the Ethernet payload to 46 B and appends the CRC-32 FCS (least significant byte first)", "decapsulate checks the FCS and both checksums before returning the message", "For the worked example the frame is 101 B and the IPv4 checksum is 0x9AF0"],
          explain: "<p>Compare with the model solution, then run it.</p>" }
      ]
    },
    // ------------------------------------------------------------------ 03-E
    {
      id: "03-E",
      title: "The TCP/IP model: 4 layers on the slides, 5 in Kurose, and the OSI mapping",
      badge: "class",
      source: "WB-L03 p30–32; Kurose & Ross 8e §1.5.1; RFC 1122",
      covers: ["03.11"],
      blocks: [
        { type: "intuition", title: "The blueprint vs the building that was actually built",
          html: "<p><b>Analogy.</b> OSI is the architect's detailed blueprint; TCP/IP is the building people actually live in. The building merged a few rooms the blueprint kept separate.</p>" +
                "<p><b>Definition (WB-L03 p31).</b> The <b>TCP/IP model</b> is a layered framework that defines how data is transmitted over the Internet using standard protocols like TCP and IP. The slides (and <b>RFC 1122</b>) use <b>4 layers</b>: <b>Application</b> (= OSI application + presentation + session), <b>Transport</b>, <b>Internet</b> (= OSI network) and <b>Network access / Link</b> (= OSI data link + physical). Kurose &amp; Ross, and the class quiz, split the bottom layer and use <b>5 layers</b>: Application, Transport, Network, Link, Physical. Both are correct; say which one the question means.</p>" },
        { type: "figure", caption: "OSI 7 layers vs TCP/IP 4 layers (WB-L03 p31, RFC 1122) vs Kurose's 5 layers, with the PDU at each layer.",
          html: "<svg viewBox='0 0 660 330' width='100%' role='img' aria-label='OSI vs TCP/IP mapping'>" +
                "<text x='100' y='20' text-anchor='middle' fill='currentColor' font-size='13' font-weight='bold'>OSI (7)</text><text x='300' y='20' text-anchor='middle' fill='currentColor' font-size='13' font-weight='bold'>TCP/IP (4, slides)</text><text x='490' y='20' text-anchor='middle' fill='currentColor' font-size='13' font-weight='bold'>Kurose (5)</text><text x='615' y='20' text-anchor='middle' fill='currentColor' font-size='13' font-weight='bold'>PDU</text>" +
                "<rect x='10' y='30' width='180' height='40' fill='none' stroke='var(--bad)'/><text x='100' y='55' text-anchor='middle' fill='currentColor' font-size='12'>7 Application</text>" +
                "<rect x='10' y='70' width='180' height='40' fill='none' stroke='var(--bad)'/><text x='100' y='95' text-anchor='middle' fill='currentColor' font-size='12'>6 Presentation</text>" +
                "<rect x='10' y='110' width='180' height='40' fill='none' stroke='var(--bad)'/><text x='100' y='135' text-anchor='middle' fill='currentColor' font-size='12'>5 Session</text>" +
                "<rect x='10' y='150' width='180' height='40' fill='none' stroke='var(--accent)'/><text x='100' y='175' text-anchor='middle' fill='currentColor' font-size='12'>4 Transport</text>" +
                "<rect x='10' y='190' width='180' height='40' fill='none' stroke='var(--warn)'/><text x='100' y='215' text-anchor='middle' fill='currentColor' font-size='12'>3 Network</text>" +
                "<rect x='10' y='230' width='180' height='40' fill='none' stroke='var(--ok)'/><text x='100' y='255' text-anchor='middle' fill='currentColor' font-size='12'>2 Data link</text>" +
                "<rect x='10' y='270' width='180' height='40' fill='none' stroke='var(--muted)'/><text x='100' y='295' text-anchor='middle' fill='currentColor' font-size='12'>1 Physical</text>" +
                "<rect x='215' y='30' width='170' height='120' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='300' y='95' text-anchor='middle' fill='currentColor' font-size='12'>Application</text>" +
                "<rect x='215' y='150' width='170' height='40' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='300' y='175' text-anchor='middle' fill='currentColor' font-size='12'>Transport</text>" +
                "<rect x='215' y='190' width='170' height='40' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='300' y='215' text-anchor='middle' fill='currentColor' font-size='12'>Internet</text>" +
                "<rect x='215' y='230' width='170' height='80' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='300' y='268' text-anchor='middle' fill='currentColor' font-size='12'>Network access</text><text x='300' y='284' text-anchor='middle' fill='var(--muted)' font-size='11'>(link)</text>" +
                "<rect x='410' y='30' width='160' height='120' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='490' y='95' text-anchor='middle' fill='currentColor' font-size='12'>Application</text>" +
                "<rect x='410' y='150' width='160' height='40' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='490' y='175' text-anchor='middle' fill='currentColor' font-size='12'>Transport</text>" +
                "<rect x='410' y='190' width='160' height='40' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='490' y='215' text-anchor='middle' fill='currentColor' font-size='12'>Network</text>" +
                "<rect x='410' y='230' width='160' height='40' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='490' y='255' text-anchor='middle' fill='currentColor' font-size='12'>Link</text>" +
                "<rect x='410' y='270' width='160' height='40' fill='none' stroke='var(--muted)' stroke-width='2'/><text x='490' y='295' text-anchor='middle' fill='currentColor' font-size='12'>Physical</text>" +
                "<text x='615' y='95' text-anchor='middle' fill='var(--bad)' font-size='12'>message</text><text x='615' y='175' text-anchor='middle' fill='var(--accent)' font-size='12'>segment</text><text x='615' y='215' text-anchor='middle' fill='var(--warn)' font-size='12'>datagram</text><text x='615' y='255' text-anchor='middle' fill='var(--ok)' font-size='12'>frame</text><text x='615' y='295' text-anchor='middle' fill='var(--muted)' font-size='12'>bits</text>" +
                "</svg>" },
        { type: "table", head: ["", "OSI model", "TCP/IP model"],
          rows: [
            ["Full name (WB-L03 p32)", "Open Systems Interconnection", "Transmission Control Protocol / Internet Protocol"],
            ["Layers", "7", "4 on the slides and in RFC 1122 (5 in Kurose and the class quiz)"],
            ["Developed by", "ISO, International Organization for Standardization", "DARPA, Defense Advanced Research Projects Agency (ARPANET switched to TCP/IP on 1 January 1983)"],
            ["Nature", "conceptual reference model; protocol-independent", "used in actual data transmission; defined around its protocols"],
            ["Presentation and Session", "separate layers 6 and 5", "folded into the Application layer (apps and libraries such as TLS do the work)"],
            ["Bottom of the stack", "Data link + Physical as two layers", "Network access (link) as one layer, or Link + Physical in the 5-layer view"],
            ["Layer 3 name", "Network", "Internet (Kurose: Network)"] ],
          caption: "WB-L03 p32 comparison (rows 1–4) extended with the rows examiners use." },
        { type: "callout", kind: "slidefix", title: "B19 · WB-L03 p12 vs p32: ISO's name",
          html: "<p><b>Slide p32 shows:</b> \"Developed by ISO (International Standard Organisation)\".</p><p><b>Correct (as on p12):</b> ISO is the <b>International Organization for Standardization</b>. \"ISO\" is not an acronym of the English name; it comes from the Greek <i>isos</i>, equal.</p>" },
        { type: "cheat", title: "Mapping in one line each",
          items: [ "TCP/IP Application = OSI Application + Presentation + Session",
                   "TCP/IP Transport = OSI Transport",
                   "TCP/IP Internet = OSI Network (Kurose calls it Network)",
                   "TCP/IP Network access = OSI Data link + Physical (Kurose splits it into Link + Physical)",
                   "5-layer order, top to bottom: Application → Transport → Network → Link → Physical" ] },
        { type: "traps", items: [
            "The quiz says <b>five</b> TCP/IP layers, the slides say <b>four</b>: both are accepted models; match the number of layers to the names in the options.",
            "\"Internet layer\" is the TCP/IP name for the <b>Network</b> layer, not the whole Internet.",
            "TCP/IP has no separate Presentation or Session layers; they are not \"removed\", their jobs move into the application.",
            "OSI came from ISO; TCP/IP came from DARPA. Swapping them is a classic distractor.",
            "OSI is conceptual; TCP/IP is what the Internet actually runs." ] }
      ],
      practice: [
        { id: "u03-E-q12", type: "mcq", tag: "From class quiz", topic: "03.11",
          q: "<p>Which of the following correctly lists all five TCP/IP layers from top to bottom?</p>",
          options: ["Physical → Link → Network → Transport → Application", "Application → Transport → Network → Link → Physical", "Application → Network → Transport → Link → Physical", "Transport → Application → Network → Physical → Link"],
          answer: 1,
          why: ["Right layers but bottom to top; the question asks top to bottom.",
                "Correct: the 5-layer (Kurose) model, top to bottom.",
                "Network and Transport are swapped: Transport sits above Network.",
                "Application must be on top, and Physical at the very bottom."],
          explain: "<p>Quiz answer B. Note: the slides (WB-L03 p31) use the 4-layer version, Application, Transport, Internet, Network access; this quiz uses the 5-layer textbook version.</p>" },
        { id: "u03-E-q13", type: "mcq", tag: "From class quiz", topic: "03.11",
          q: "<p>In the OSI model, the Presentation and Session layers sit between Application and Transport. Where do these functions go in the practical TCP/IP model?</p>",
          options: ["They become separate layers between Transport and Network in TCP/IP", "They are folded into the TCP/IP Application layer — the application handles encoding, encryption, and session management itself", "They are handled by the TCP/IP Physical layer", "They are removed entirely and never used on the Internet"],
          answer: 1,
          why: ["TCP/IP has nothing between Transport and Network.",
                "Correct: the application (and libraries such as TLS) does encoding, encryption and session management.",
                "The physical layer only moves bits; it cannot encrypt or manage sessions.",
                "The functions are still used (TLS encryption, JPEG encoding, login sessions); only the separate layers are gone."],
          explain: "<p>Quiz answer B. OSI is the 7-layer reference model; TCP/IP is what actually runs on the Internet.</p>" },
        { id: "u03-E-3", type: "mcq", tag: "University-Midsem-style", topic: "03.11",
          q: "<p>The TCP/IP <b>Internet</b> layer corresponds to which OSI layer?</p>",
          options: ["Application", "Transport", "Network", "Data link"],
          answer: 2,
          why: ["The TCP/IP Application layer covers OSI 7, 6 and 5.",
                "Transport maps to Transport.",
                "Correct: WB-L03 p31, network → internet.",
                "Data link (with Physical) maps to Network access."],
          explain: "<p>IP lives in the Internet layer.</p>" },
        { id: "u03-E-4", type: "msq", tag: "University-Midsem-style", topic: "03.11",
          q: "<p>The 4-layer TCP/IP <b>Network access</b> layer covers which OSI layers? (Select all that apply.)</p>",
          options: ["Data link", "Physical", "Network", "Session"],
          answer: [0, 1],
          why: ["Correct.", "Correct.", "Network maps to the Internet layer.", "Session is folded into Application."],
          explain: "<p>WB-L03 p31: data link + physical → Network access.</p>" },
        { id: "u03-E-5", type: "mcq", tag: "University-Midsem-style", topic: "03.11",
          q: "<p>According to WB-L03 p32, which statement is correct?</p>",
          options: ["OSI was developed by DARPA and is used for actual data transmission", "TCP/IP was developed by DARPA and is used in actual data transmission; OSI is conceptual", "Both models have 7 layers", "TCP/IP was developed by ISO"],
          answer: 1,
          why: ["Swapped: DARPA is TCP/IP's origin and OSI is the conceptual model.",
                "Correct: rows 3 and 4 of the comparison table.",
                "OSI has 7, TCP/IP has 4 (or 5).",
                "ISO developed OSI."],
          explain: "<p>Learn the four rows of p32.</p>" },
        { id: "u03-E-6", type: "num", tag: "University-Midsem-style", topic: "03.11",
          q: "<p>How many OSI layers are merged into the single TCP/IP Application layer? (integer)</p>",
          answer: 3, tol: 0, unit: "layers", verify: "7 - 4",
          steps: [ { tex: "\\{7, 6, 5\\} \\to \\text{Application}", why: "Application, Presentation and Session all map to TCP/IP Application." },
                   { tex: "7 - 4 = 3", why: "Layers 7 down to 5 inclusive: OSI Transport (4) is the first layer that maps one-to-one." } ],
          explain: "<p>Three: Application, Presentation, Session.</p>" },
        { id: "u03-E-7", type: "text", tag: "University-Midsem-style", topic: "03.11",
          q: "<p>Predict the exact output.</p>",
          code: "osi_to_tcpip = {7: \"Application\", 6: \"Application\", 5: \"Application\", 4: \"Transport\",\n                3: \"Internet\", 2: \"Network access\", 1: \"Network access\"}\nprint(len(set(osi_to_tcpip.values())), osi_to_tcpip[3])",
          answer: "4 Internet", runCheck: true,
          explain: "<p>Seven keys, four distinct values (the 4-layer model); OSI layer 3 maps to Internet.</p>" }
      ]
    },
    // ------------------------------------------------------------------ 03-F
    {
      id: "03-F",
      title: "Service, interface and protocol; OSI mnemonics; which device works at which layer",
      badge: "researched",
      source: "Kurose & Ross 8e §1.5; Tanenbaum & Wetherall 5e §1.3–1.4; WB-L01 p31; WB-L04 p8–19; AWS Elastic Load Balancing and Amazon VPC documentation",
      covers: ["03.12"],
      blocks: [
        { type: "intuition", title: "The hatch, the menu and the chefs' rules",
          html: "<p><b>Analogy.</b> In a restaurant the <b>kitchen offers a service</b> to the waiter: \"we will cook any dish on the menu\". The waiter reaches that service through an <b>interface</b>: the order slip and the hatch. Inside the kitchen, chefs follow a <b>protocol</b> among themselves (who preps, who plates, how they call orders). The waiter never sees the chefs' protocol and the chefs can change it freely, as long as the service through the hatch stays the same.</p>" +
                "<p><b>Precise definitions (Tanenbaum §1.3–1.4; Kurose §1.5).</b> A <b>service</b> is the set of operations (primitives) a layer provides to the layer <b>above</b> it; it says <i>what</i> the layer does, not how. An <b>interface</b> tells the layer above <b>how to access</b> that service (which primitives, which parameters); the access point is a <b>service access point</b>: for the transport layer, the <b>socket API</b> and a <b>port number</b>. A <b>protocol</b> is the set of rules governing the <b>format and meaning of the messages exchanged between peer entities in the same layer</b> on different machines. Services are <b>vertical</b> (between adjacent layers on one host); protocols are <b>horizontal</b> (between peers on different hosts).</p>" },
        { type: "figure", caption: "Service and interface run vertically between adjacent layers on one host; a protocol runs horizontally between peer layers on two hosts.",
          html: "<svg viewBox='0 0 620 260' width='100%' role='img' aria-label='Service interface protocol'>" +
                "<text x='120' y='20' text-anchor='middle' fill='currentColor' font-size='13' font-weight='bold'>Host A</text><text x='500' y='20' text-anchor='middle' fill='currentColor' font-size='13' font-weight='bold'>Host B</text>" +
                "<rect x='40' y='30' width='160' height='44' rx='6' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='120' y='57' text-anchor='middle' fill='currentColor' font-size='12'>Layer n+1 (HTTP)</text>" +
                "<rect x='40' y='120' width='160' height='44' rx='6' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='120' y='147' text-anchor='middle' fill='currentColor' font-size='12'>Layer n (TCP)</text>" +
                "<rect x='40' y='210' width='160' height='44' rx='6' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='120' y='237' text-anchor='middle' fill='currentColor' font-size='12'>Layer n−1 (IP)</text>" +
                "<rect x='420' y='30' width='160' height='44' rx='6' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='500' y='57' text-anchor='middle' fill='currentColor' font-size='12'>Layer n+1 (HTTP)</text>" +
                "<rect x='420' y='120' width='160' height='44' rx='6' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='500' y='147' text-anchor='middle' fill='currentColor' font-size='12'>Layer n (TCP)</text>" +
                "<rect x='420' y='210' width='160' height='44' rx='6' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='500' y='237' text-anchor='middle' fill='currentColor' font-size='12'>Layer n−1 (IP)</text>" +
                "<line x1='120' y1='74' x2='120' y2='120' stroke='var(--ok)' stroke-width='3'/><text x='130' y='95' fill='var(--ok)' font-size='11'>interface (socket API, port)</text><text x='130' y='110' fill='var(--ok)' font-size='11'>service: reliable byte stream</text>" +
                "<line x1='120' y1='164' x2='120' y2='210' stroke='var(--ok)' stroke-width='3'/><text x='130' y='192' fill='var(--ok)' font-size='11'>service: best-effort datagrams</text>" +
                "<line x1='200' y1='52' x2='420' y2='52' stroke='var(--warn)' stroke-width='2' stroke-dasharray='6 4'/><text x='310' y='46' text-anchor='middle' fill='var(--warn)' font-size='11'>HTTP protocol</text>" +
                "<line x1='200' y1='142' x2='420' y2='142' stroke='var(--warn)' stroke-width='2' stroke-dasharray='6 4'/><text x='310' y='136' text-anchor='middle' fill='var(--warn)' font-size='11'>TCP protocol (segments)</text>" +
                "<line x1='200' y1='232' x2='420' y2='232' stroke='var(--warn)' stroke-width='2' stroke-dasharray='6 4'/><text x='310' y='226' text-anchor='middle' fill='var(--warn)' font-size='11'>IP protocol (datagrams)</text>" +
                "</svg>" },
        { type: "table", head: ["Layer", "OSI name", "L7 → L1: \"All People Seem To Need Data Processing\"", "L1 → L7: \"Please Do Not Throw Sausage Pizza Away\""],
          rows: [
            ["7", "Application", "<b>A</b>ll", "<b>A</b>way"],
            ["6", "Presentation", "<b>P</b>eople", "<b>P</b>izza"],
            ["5", "Session", "<b>S</b>eem", "<b>S</b>ausage"],
            ["4", "Transport", "<b>T</b>o", "<b>T</b>hrow"],
            ["3", "Network", "<b>N</b>eed", "<b>N</b>ot"],
            ["2", "Data link", "<b>D</b>ata", "<b>D</b>o"],
            ["1", "Physical", "<b>P</b>rocessing", "<b>P</b>lease"] ],
          caption: "Read the first column top-down for the first mnemonic and bottom-up for the second." },
        { type: "table", head: ["Device / service", "Highest layer it uses to decide", "What it looks at", "Notes"],
          rows: [
            ["Hub, repeater", "L1 Physical", "nothing: regenerates bits to every port", "one collision domain; WB-L03 p29, WB-L04 p8"],
            ["Network interface card", "L1 + L2", "its own MAC address, FCS", "builds and checks frames"],
            ["Switch, bridge", "L2 Data link", "destination MAC address", "forwards and filters frames (WB-L04 p10)"],
            ["Router", "L3 Network", "destination IP address, routing table", "implements L1–L3; rebuilds the MAC header on every hop"],
            ["Layer-3 switch", "L3", "IP address", "switch hardware that also routes between VLANs"],
            ["Packet-filter firewall; AWS security group and network ACL", "L3–L4", "IP addresses, protocol, ports (security groups are stateful, NACLs stateless)", "allow or deny rules"],
            ["AWS Network Load Balancer (NLB)", "L4 Transport", "TCP/UDP 4-tuple", "WB-L04 p19, SL-L12"],
            ["AWS Application Load Balancer (ALB), reverse proxy, WAF", "L7 Application", "HTTP host, path, headers", "WB-L04 p19, SL-L12"],
            ["AWS VPC route table, Internet Gateway", "L3", "destination prefix", "the routing part of a VPC"],
            ["Amazon Route 53", "L7", "DNS names and records", "DNS is an application-layer service"],
            ["End host (laptop, server)", "L1–L7 (all)", "everything", "the only place every layer runs"] ],
          caption: "Device ↔ layer table. Hosts implement all layers; routers L1–L3; switches L1–L2; hubs L1." },
        { type: "cheat", title: "Service, interface, protocol, mnemonics",
          items: [ "<b>Service</b> = what a layer offers the layer above (vertical). Example: TCP offers a reliable, in-order byte stream",
                   "<b>Interface</b> = how the layer above invokes it (socket API: socket, bind, connect, send, recv, close; port = access point)",
                   "<b>Protocol</b> = format, order and meaning of messages between <b>peers</b> in the same layer (horizontal). Example: TCP segments, HTTP requests",
                   "Mnemonics: L7→L1 \"All People Seem To Need Data Processing\"; L1→L7 \"Please Do Not Throw Sausage Pizza Away\"",
                   "Hub L1 · switch L2 · router L3 · NLB L4 · ALB L7 · host all layers" ] },
        { type: "code", file: "Unit03_layers_socket.py", level: "high", title: "Service vs interface vs protocol in running code: a 127.0.0.1 client/server that only touches the socket interface, plus the header bytes the kernel adds" },
        { type: "traps", items: [
            "Service and protocol are different things: you can replace TCP's internal protocol rules without changing the service the application sees.",
            "The socket API is an <b>interface</b>, not a protocol; it never appears on the wire.",
            "A router does have Layer 1 and Layer 2 (it receives frames on each port); its <i>forwarding decision</i> is Layer 3.",
            "Mnemonic direction: \"All People\" starts at Layer 7; \"Please Do Not\" starts at Layer 1.",
            "A firewall is not one fixed layer: packet filters work at L3–L4, web application firewalls at L7." ] }
      ],
      practice: [
        { id: "u03-F-1", type: "mcq", tag: "University-Midsem-style", topic: "03.12",
          q: "<p>The Python socket API (<code>socket</code>, <code>connect</code>, <code>sendall</code>, <code>recv</code>) is best described as a:</p>",
          options: ["Protocol", "Interface (service access point) to the transport layer", "Physical medium", "Routing algorithm"],
          answer: 1,
          why: ["A protocol defines messages between peers on the wire; socket calls are never transmitted.",
                "Correct: it is how the application layer invokes the transport service.",
                "Physical media are cables and radio.",
                "Routing algorithms are Layer 3 path computations."],
          explain: "<p>Kurose: the socket is the interface between the application and the transport layer.</p>" },
        { id: "u03-F-2", type: "mcq", tag: "University-Midsem-style", topic: "03.12",
          q: "<p>\"TCP delivers a reliable, in-order byte stream to the application.\" This sentence describes TCP's:</p>",
          options: ["Service", "Interface", "Protocol header format", "Physical encoding"],
          answer: 0,
          why: ["Correct: it states what the layer offers the layer above, not how.",
                "The interface is how you ask for it (the socket calls).",
                "The header format is part of the protocol, not mentioned here.",
                "Physical encoding is Layer 1."],
          explain: "<p>Service = what; protocol = how the peers achieve it.</p>" },
        { id: "u03-F-3", type: "mcq", tag: "University-Midsem-style", topic: "03.12",
          q: "<p>The rules saying that an HTTP request line is <code>METHOD SP URL SP VERSION CRLF</code> and that the server must answer with a status line are an example of a:</p>",
          options: ["Service", "Interface", "Protocol", "Topology"],
          answer: 2,
          why: ["A service would be \"fetch me this resource\", without message formats.",
                "An interface would be the library call that sends the request.",
                "Correct: format and order of messages between peer entities (browser and server).",
                "Topology describes how nodes are wired together."],
          explain: "<p>Kurose's definition of a protocol: format, order, actions.</p>" },
        { id: "u03-F-4", type: "mcq", tag: "University-Midsem-style", topic: "03.12",
          q: "<p>In \"Please Do Not Throw Sausage Pizza Away\", which layer does \"Throw\" stand for?</p>",
          options: ["Transport (Layer 4)", "Session (Layer 5)", "Network (Layer 3)", "Data link (Layer 2)"],
          answer: 0,
          why: ["Correct: the fourth word from Layer 1 upward.",
                "Session is \"Sausage\".",
                "Network is \"Not\".",
                "Data link is \"Do\"."],
          explain: "<p>Please (1 Physical), Do (2 Data link), Not (3 Network), Throw (4 Transport), Sausage (5 Session), Pizza (6 Presentation), Away (7 Application).</p>" },
        { id: "u03-F-5", type: "msq", tag: "University-Midsem-style", topic: "03.12",
          q: "<p>Which devices make their forwarding decision at <b>Layer 3</b>? (Select all that apply.)</p>",
          options: ["Router", "Layer-3 switch", "Hub", "Ethernet (Layer-2) switch"],
          answer: [0, 1],
          why: ["Correct: destination IP and routing table.",
                "Correct: routes between VLANs using IP.",
                "Hubs only repeat bits (Layer 1).",
                "A plain switch uses MAC addresses (Layer 2)."],
          explain: "<p>Hub L1, switch L2, router L3.</p>" },
        { id: "u03-F-6", type: "mcq", tag: "GATE-style", topic: "03.12",
          q: "<p>Which layers does a typical IP router implement on each of its interfaces?</p>",
          options: ["Physical only", "Physical and Data link only", "Physical, Data link and Network", "All seven OSI layers"],
          answer: 2,
          why: ["It must also read frames and IP headers.",
                "It must also read the IP header to route.",
                "Correct: a router terminates Layers 1–3 (Kurose: routers implement the bottom three layers).",
                "End hosts implement all layers; a pure router does not run TCP or HTTP for transit traffic."],
          explain: "<p>Switches: L1–L2; routers: L1–L3; hosts: all.</p>" },
        { id: "u03-F-7", type: "text", tag: "University-Midsem-style", topic: "03.12",
          q: "<p>Predict the exact output.</p>",
          code: "layers = [\"Physical\", \"Data Link\", \"Network\", \"Transport\", \"Session\", \"Presentation\", \"Application\"]\nwords = \"Please Do Not Throw Sausage Pizza Away\".split()\nprint(all(w[0] == l[0] for w, l in zip(words, layers)), layers[::-1][2])",
          answer: "True Session", runCheck: true,
          explain: "<p>Every word's first letter matches its layer (P, D, N, T, S, P, A). Reversed, the list starts Application, Presentation, Session, so index 2 is Session.</p>" },
        { id: "u03-F-8", type: "write", tag: "University-Midsem-style", topic: "03.12",
          q: "<p>Write a TCP echo-style client and server on <code>127.0.0.1</code> (server on port 0 in a thread). The client sends an HTTP-like request, reads the reply and prints its own 4-tuple. Then write <code>on_wire_bytes(n)</code> that returns how many Ethernet bytes the OS needs for n bytes of data with MSS 1460.</p>",
          starter: "import socket, threading\n\ndef on_wire_bytes(app_bytes, mss=1460):\n    pass\n",
          solutionFile: "Unit03_layers_socket.py",
          rubric: ["Server binds 127.0.0.1 port 0 and reads the OS-assigned port with getsockname", "Client uses a timeout and retries on OSError", "Prints local and remote (IP, port) pairs: the 4-tuple", "on_wire_bytes(1460) returns 1518 and on_wire_bytes(3000) returns 3174", "Explains that headers are added by the kernel (protocol), not by the application (which only uses the interface)"],
          explain: "<p>The model solution shows the service / interface / protocol split in running code.</p>" }
      ]
    }
  ]
};
