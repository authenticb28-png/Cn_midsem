window.UNITS = window.UNITS || {};
window.UNITS["unit07"] = {
  id: "unit07", num: 7, day: 3,
  title: "DNS & AWS Route 53",
  lectures: "Lecture 7 (taught Wk-4, 1st) · WB-L08 p1–14, p28–32, p117; SL-L09 p3, p15",
  overview: "<p>Before any TCP or TLS handshake, the client must turn a <b>name</b> into an <b>IP address</b>. DNS does this with a distributed, hierarchical database (root → TLD → authoritative) queried through a <b>local DNS server</b> that caches every answer for its TTL. Exams test the record types (A/AAAA/MX/CNAME/NS/TXT), the order of the lookup and its message count, latency sums with and without cache, TTL and propagation timing, the 12-byte header (UDP 53), and AWS Route 53 routing-policy choice.</p>",
  sections: [
    // ------------------------------------------------------------------ 07-A
    {
      id: "07-A",
      title: "Why DNS? Names, Addresses and Resource Records",
      badge: "class",
      source: "WB-L08 p4–6",
      covers: ["07.1", "07.2"],
      blocks: [
        { type: "intuition", title: "Justdial for servers",
          html: "<p><b>Analogy (WB-L08 p5).</b> You know a restaurant's <i>name</i> (\"Hawai Adda\"), but to get there you need its <i>address</i>. A Justdial listing gives the address, opening hours, services and phone numbers. A DNS record set does the same for a domain: the <b>A/AAAA</b> record is the shop's address, the <b>MX</b> record is like its phone number for mail, the <b>NS</b> record says which directory office is responsible, and <b>TXT/CNAME</b> are the optional extras (p6).</p>" +
                "<p><b>Why it is needed (p4).</b> A socket is opened to an <b>IP address and port</b>, never to a name. \"Domain name? ✗ — Address of server? ✓\". So the browser resolves <code>www.amazon.com</code> first, and only then starts TCP and TLS.</p>" +
                "<p><b>Definition (RFC 1034/1035; Kurose &amp; Ross §2.4).</b> DNS is (1) a <b>distributed database</b> implemented in a hierarchy of name servers and (2) an <b>application-layer protocol</b> that lets hosts query that database, normally over <b>UDP port 53</b>. Each entry is a <b>resource record</b> (RR): <code>(Name, Value, Type, TTL)</code> plus a class (almost always IN = Internet).</p>" },
        { type: "table", head: ["Type", "Name → Value", "Justdial analogy (p6)", "Example"],
          rows: [
            ["<b>A</b>", "hostname → 32-bit IPv4 address", "shop's address", "ivetamakeup.com → 172.217.22.4"],
            ["<b>AAAA</b>", "hostname → 128-bit IPv6 address", "shop's address (new format)", "www.example.com → 2001:db8::10"],
            ["<b>MX</b>", "domain → mail server name, with a <b>priority</b> (lower = preferred)", "phone number for calls (mail)", "ivetamakeup.com → [10] friday.mxlogin.com, [20] friday-relay.mxlogin.com"],
            ["<b>NS</b>", "domain/zone → name of an authoritative name server", "which directory office holds the listing", "example.com → ns-2048.awsdns-64.com (Route 53 style)"],
            ["<b>CNAME</b>", "alias → canonical (real) name", "\"also trading as\"", "www → ivetamakeup.com; webmail → friday.mxlogin.com"],
            ["<b>TXT</b>", "name → free text (SPF, DKIM, DMARC, ownership proofs)", "notes on the listing", "_dmarc → v=DMARC1; p=reject"],
            ["SOA <i>(researched)</i>", "zone → primary server, admin mailbox, serial, timers, negative-cache TTL", "the office's registration card", "one per zone, at the apex"],
            ["PTR <i>(researched)</i>", "reverse name → hostname (in-addr.arpa)", "reverse phone lookup", "4.22.217.172.in-addr.arpa → host name"]
          ],
          caption: "Record types. A/AAAA/MX/NS/CNAME/TXT are on WB-L08 p6; SOA and PTR are standard RFC 1035 types added for completeness." },
        { type: "table", head: ["Type", "Name", "Content", "TTL", "Proxy status"],
          rows: [
            ["A", "ftp", "172.217.22.4", "Auto", "DNS only"],
            ["A", "ivetamakeup.com", "172.217.22.4", "Auto", "Proxied"],
            ["A", "localhost", "127.0.0.1", "Auto", "DNS only (local IP)"],
            ["CNAME", "webmail", "friday.mxlogin.com", "1 day", "DNS only"],
            ["CNAME", "www", "ivetamakeup.com", "Auto", "Proxied"],
            ["MX", "ivetamakeup.com", "friday.mxlogin.com (priority 10)", "1 day", "DNS only"],
            ["MX", "ivetamakeup.com", "friday-relay.mxlogin.com (priority 20)", "1 day", "DNS only"],
            ["TXT", "default._domainkey", "v=DKIM1; k=rsa; p=(public key, truncated on the slide)", "1 day", "DNS only"],
            ["TXT", "_dmarc", "v=DMARC1; p=reject; rua=(report address, truncated)", "1 day", "DNS only"],
            ["TXT", "ivetamakeup.com", "google-site-verification=(token, truncated)", "1 day", "DNS only"],
            ["TXT", "ivetamakeup.com", "v=spf1 include:mxlogin.com (truncated)", "1 day", "DNS only"]
          ],
          caption: "The zone table on WB-L08 p6 (Cloudflare-style dashboard). \"Auto\" means the provider picks the TTL; \"1 day\" = 86,400 s. \"Proxied\" means the provider's CDN answers with its own edge IP instead of the origin's (a CDN feature, not part of DNS itself). The source screenshot truncates the long TXT values." },
        { type: "callout", kind: "key", title: "MX priority: the lower number wins",
          html: "<p>A sending mail server looks up the MX records, sorts them by <b>preference</b> (the number), and tries the <b>lowest</b> first: friday.mxlogin.com (10) before friday-relay.mxlogin.com (20). If the preferred server does not answer, it falls back to the next. Equal numbers mean \"spread the load randomly\" (RFC 5321 §5.1). An MX value must be a <b>host name</b> that has an A/AAAA record, never an IP address and never a CNAME.</p>" },
        { type: "callout", kind: "key", title: "CNAME rules",
          html: "<p>A CNAME says \"this name is only an alias\". A name that has a CNAME may hold <b>no other records</b> (RFC 1034 §3.6.2, RFC 2181 §10.1). The zone apex (<code>ivetamakeup.com</code> itself) must hold SOA and NS records, so a plain CNAME is <b>not allowed at the apex</b>. That is why <code>www</code> is the CNAME and the apex has an A record. Route 53 solves the apex case with <b>alias records</b> (section 07-F).</p>" },
        { type: "derivation", title: "Reading a TTL",
          steps: [
            { tex: "1\\,\\text{day} = 24\\,\\text{h} = 24 \\times 60\\,\\text{min} = 1440\\,\\text{min}", why: "Dashboards show friendly units; the wire format stores TTL as a 32-bit count of seconds." },
            { tex: "1440\\,\\text{min} \\times 60 = 86400\\,\\text{s}", why: "Multiply minutes by 60 to get seconds: TTL = 86400 in the DNS message." },
            { tex: "t_{expire} = t_{cached} + TTL", why: "A resolver that stored the record at time t may reuse it, without asking again, until t + TTL." },
            { tex: "t_{cached} = 10{:}00{:}00,\\; TTL = 86400\\,\\text{s} \\Rightarrow t_{expire} = 10{:}00{:}00 \\text{ next day}", why: "86400 s is exactly 24 h, so the cached copy lives until the same clock time on the following day." }
          ] },
        { type: "cheat", title: "Records at a glance",
          items: [
            "A = IPv4 (4 bytes of RDATA); AAAA = IPv6 (16 bytes); MX = preference + mail host; NS = name server; CNAME = alias; TXT = text (SPF/DKIM/DMARC/verification); SOA = zone parameters; PTR = reverse lookup",
            "MX: <b>lower</b> preference number is tried first",
            "CNAME cannot sit next to other records, so it cannot be at the zone apex",
            "TTL is in <b>seconds</b>: 300 = 5 min, 3600 = 1 h, 86400 = 1 day",
            "DNS = application-layer protocol, UDP (and TCP) port <b>53</b>; it runs <b>before</b> TCP/TLS to the web server"
          ] },
        { type: "worked", title: "Delivering mail to ivetamakeup.com", tag: "University-Midsem-style",
          problem: "<p>Using the WB-L08 p6 zone, a mail server must deliver a message to <code>info@ivetamakeup.com</code>. Nothing is cached. (a) Which record type does it query first? (b) Which host does it try first, and why? (c) What second lookup is needed before it can open the TCP connection, and to which port?</p>",
          steps: [
            { text: "(a) The domain part after @ is ivetamakeup.com, so the sender asks for <b>MX</b> records of ivetamakeup.com.", why: "Mail is routed by MX records, not by the A record of the domain." },
            { text: "The reply lists friday.mxlogin.com with preference 10 and friday-relay.mxlogin.com with preference 20.", why: "Both MX rows on p6 belong to the same name." },
            { text: "(b) Sort by preference: 10 < 20, so friday.mxlogin.com is tried first; friday-relay is the backup.", why: "RFC 5321: the lowest preference value is the most preferred." },
            { text: "(c) An MX value is a host name, so the sender needs an <b>A</b> (or AAAA) lookup for friday.mxlogin.com, then opens TCP to that IP on <b>port 25</b> (server-to-server SMTP).", why: "A socket needs an IP address; MTA-to-MTA relay uses port 25." }
          ],
          answer: "MX query, then friday.mxlogin.com (priority 10) is tried first, then an A/AAAA lookup for that host and a TCP connection to port 25. (Servers often include the A record in the Additional section, which saves the second query.)" },
        { type: "traps", items: [
            "MX priority 10 beats 20: <b>lower is better</b>. Do not pick the larger number.",
            "An MX or NS value is a <b>name</b>, not an IP address.",
            "AAAA (four A's) is IPv6, not \"a bigger A\" for IPv4.",
            "TTL is seconds, not minutes; \"1 day\" on a dashboard is 86400.",
            "CNAME at the zone apex is invalid in plain DNS; use an A record or a Route 53 alias.",
            "DNS is an <b>application-layer</b> protocol even though it serves every other application."
          ] }
      ],
      practice: [
        { id: "u07-A-1", type: "mcq", tag: "University-Midsem-style", topic: "07.1",
          q: "<p>WB-L08 p4 asks \"How to reach a server?\". Why is a domain name alone not enough to send a packet?</p>",
          options: ["Domain names are encrypted by TLS", "IP routers and sockets work with IP addresses and ports, not names", "Domain names are longer than 255 bytes", "Only HTTP/3 understands names"],
          answer: 1,
          why: ["TLS starts after the TCP connection exists, which already needs an IP address.", "Correct: connect() takes (IP, port), and routers forward on destination IP, so the name must be resolved first.", "Names are at most 255 bytes, and length is not the reason.", "No transport or HTTP version routes by name; all need an IP address."],
          explain: "<p>DNS resolution happens before any TCP/TLS handshake because sockets and routers use IP addresses.</p>" },
        { id: "u07-A-2", type: "mcq", tag: "GATE-style", topic: "07.2",
          q: "<p>Which record type maps <code>www.example.com</code> to an IPv6 address?</p>",
          options: ["A", "AAAA", "MX", "PTR"], answer: 1,
          why: ["A holds a 32-bit IPv4 address.", "Correct: AAAA holds a 128-bit IPv6 address.", "MX names a mail server for a domain.", "PTR maps an address back to a name (reverse lookup)."],
          explain: "<p>A = IPv4, AAAA = IPv6.</p>" },
        { id: "u07-A-3", type: "mcq", tag: "University-Midsem-style", topic: "07.2",
          q: "<p>A domain has <code>MX 20 relay.mail.test</code> and <code>MX 5 primary.mail.test</code>. Both are up. Which host receives the mail?</p>",
          options: ["relay.mail.test, because 20 is the larger number", "primary.mail.test, because the lower preference value is tried first", "Both, alternately", "Neither: MX records need IP addresses"],
          answer: 1,
          why: ["Larger number = less preferred.", "Correct: 5 < 20, so primary is preferred.", "Load is shared only when the preference values are equal.", "MX values are host names; their IPs come from A/AAAA lookups."],
          explain: "<p>Sort MX records by preference ascending and try them in that order.</p>" },
        { id: "u07-A-4", type: "msq", tag: "University-Midsem-style", topic: "07.2",
          q: "<p>On WB-L08 p6, the TXT records of ivetamakeup.com are used for which purposes? (Select all that apply.)</p>",
          options: ["SPF: which servers may send mail for the domain", "DKIM: the public key that verifies mail signatures", "Storing the IPv4 address of the web server", "DMARC: what receivers should do with mail that fails the checks"],
          answer: [0, 1, 3],
          why: ["v=spf1 is an SPF policy in a TXT record.", "default._domainkey holds v=DKIM1 with the public key.", "The web server's IPv4 address is in an A record, not TXT.", "_dmarc holds v=DMARC1; p=reject."],
          explain: "<p>Mail authentication (SPF, DKIM, DMARC) and ownership proofs (google-site-verification) all live in TXT records.</p>" },
        { id: "u07-A-5", type: "num", tag: "University-Midsem-style", topic: "07.2",
          q: "<p>The p6 dashboard shows TTL \"1 day\" for the MX records. What TTL value, in <b>seconds</b> (integer), is carried in the DNS reply?</p>",
          answer: 86400, tol: 0, unit: "s", verify: "24*60*60",
          steps: [ { tex: "1\\,\\text{day} = 24 \\times 60\\,\\text{min} = 1440\\,\\text{min}", why: "24 hours of 60 minutes." },
                   { tex: "1440 \\times 60 = 86400\\,\\text{s}", why: "The TTL field counts seconds." } ] },
        { id: "u07-A-6", type: "mcq", tag: "GATE-style", topic: "07.2",
          q: "<p>Why can <code>ivetamakeup.com</code> (the zone apex) not be a plain CNAME to a CDN host name?</p>",
          options: ["CNAME records only work for IPv6", "A name with a CNAME may hold no other records, but the apex must hold SOA and NS records", "CNAME targets must be IP addresses", "The apex can only hold TXT records"],
          answer: 1,
          why: ["CNAME is independent of the IP version.", "Correct: RFC 1034 forbids other data next to a CNAME, and the apex needs SOA/NS.", "A CNAME target is a name, never an address.", "The apex holds SOA, NS, and usually A/AAAA/MX/TXT."],
          explain: "<p>Use an A record at the apex, or a provider feature such as a Route 53 alias record.</p>" },
        { id: "u07-A-7", type: "text", tag: "University-Midsem-style", topic: "07.2",
          q: "<p>Predict the exact output.</p>",
          code: "mx = [(20, 'friday-relay.mxlogin.com'), (10, 'friday.mxlogin.com')]\nfirst = sorted(mx)[0]\nprint(first[1], first[0])",
          answer: "friday.mxlogin.com 10", runCheck: true,
          explain: "<p>Tuples sort by their first element, so (10, 'friday.mxlogin.com') comes first: the most preferred MX host is friday.mxlogin.com with preference 10.</p>" }
      ]
    },
    // ------------------------------------------------------------------ 07-B
    {
      id: "07-B",
      title: "A Distributed, Hierarchical Database: Root, TLD and Authoritative Servers",
      badge: "class",
      source: "WB-L08 p7–8, p10, p28–30; SL-L09 p3",
      covers: ["07.3"],
      blocks: [
        { type: "intuition", title: "Country code → area code → office switchboard",
          html: "<p><b>Analogy.</b> To phone a desk in a company abroad you do not need one giant directory of every phone on Earth. The country code takes you to a country, the area code to a city, and the company switchboard knows its own extensions. Each level knows only the <b>next</b> level down.</p>" +
                "<p><b>Definition (WB-L08 p7; Kurose &amp; Ross §2.4.2).</b> DNS scales by using many servers worldwide, organised in a hierarchy; <b>no single server holds all mappings</b>. There are three classes of DNS servers: <b>root</b> servers, <b>top-level domain (TLD)</b> servers and <b>authoritative</b> servers. A name is read right to left: <code>www.amazon.com.</code> = root (the final dot) → <code>com</code> → <code>amazon.com</code> → host <code>www</code>. Each parent <b>delegates</b> a child zone by publishing NS records that point to the child's servers.</p>" +
                "<p><b>Why not one central server?</b> (Kurose) It would be a single point of failure, carry the whole Internet's query volume, be far away from most clients, and need updating for every host on Earth.</p>" },
        { type: "figure", caption: "DNS hierarchy redrawn from WB-L08 p8 (= p29 = SL-L09 p3). Each arrow is a delegation (NS records in the parent zone).",
          html: "<svg viewBox='0 0 640 230' width='100%' font-family='sans-serif'>" +
                "<g stroke='var(--muted)' stroke-width='1.5'><line x1='320' y1='45' x2='130' y2='95'/><line x1='320' y1='45' x2='320' y2='95'/><line x1='320' y1='45' x2='510' y2='95'/>" +
                "<line x1='130' y1='125' x2='65' y2='175'/><line x1='130' y1='125' x2='195' y2='175'/><line x1='320' y1='125' x2='320' y2='175'/><line x1='510' y1='125' x2='450' y2='175'/><line x1='510' y1='125' x2='580' y2='175'/></g>" +
                "<rect x='250' y='15' width='140' height='30' rx='6' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='320' y='35' text-anchor='middle' fill='currentColor' font-size='13'>Root DNS servers</text>" +
                "<rect x='75' y='95' width='110' height='30' rx='6' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='130' y='115' text-anchor='middle' fill='currentColor' font-size='12'>com DNS servers</text>" +
                "<rect x='265' y='95' width='110' height='30' rx='6' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='320' y='115' text-anchor='middle' fill='currentColor' font-size='12'>org DNS servers</text>" +
                "<rect x='455' y='95' width='110' height='30' rx='6' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='510' y='115' text-anchor='middle' fill='currentColor' font-size='12'>co DNS servers</text>" +
                "<rect x='10' y='175' width='110' height='34' rx='6' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='65' y='196' text-anchor='middle' fill='currentColor' font-size='11'>google.com</text>" +
                "<rect x='140' y='175' width='110' height='34' rx='6' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='195' y='196' text-anchor='middle' fill='currentColor' font-size='11'>amazon.com</text>" +
                "<rect x='265' y='175' width='110' height='34' rx='6' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='320' y='196' text-anchor='middle' fill='currentColor' font-size='11'>wikipedia.org</text>" +
                "<rect x='390' y='175' width='120' height='34' rx='6' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='450' y='196' text-anchor='middle' fill='currentColor' font-size='11'>newtonschool.co</text>" +
                "<rect x='520' y='175' width='115' height='34' rx='6' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='578' y='196' text-anchor='middle' fill='currentColor' font-size='11'>huggingface.co</text>" +
                "<text x='630' y='35' text-anchor='end' fill='var(--muted)' font-size='11'>level 0: root</text><text x='630' y='88' text-anchor='end' fill='var(--muted)' font-size='11'>level 1: TLD</text><text x='320' y='225' text-anchor='middle' fill='var(--muted)' font-size='11'>level 2: authoritative servers of each organisation</text>" +
                "</svg>" },
        { type: "table", head: ["Server class", "What it knows / returns", "Facts from the slides (WB-L08 p10)", "Researched detail"],
          rows: [
            ["<b>Root</b>", "IP addresses of the <b>TLD</b> servers (a referral)", "~1000+ instances worldwide", "Copies of <b>13</b> named root servers (a.root-servers.net to m.root-servers.net) run by 12 organisations; many instances share each address via anycast (Kurose §2.4.2)"],
            ["<b>TLD</b>", "IP addresses of the <b>authoritative</b> servers for second-level domains", "Handle .com, .org, .edu and country codes (.in, .jp); run by registries, for example Verisign for .com", "Generic TLDs (gTLD) vs country-code TLDs (ccTLD); the registry runs the TLD servers, a registrar only sells names"],
            ["<b>Authoritative</b>", "The actual records (A, AAAA, MX, CNAME) for an organisation's names", "Hold DNS records for organisations (amazon.com, newtonschool.co); map hostnames → IP addresses", "Run by the organisation or a provider (Route 53, Cloudflare); its answers carry AA = 1"],
            ["<b>Local</b> (not in the hierarchy)", "Nothing of its own: it queries the hierarchy for clients and caches the answers", "Provided by ISPs and institutions; acts as a proxy; close to the client (p11)", "Also called the recursive resolver; public examples include 8.8.8.8 and 1.1.1.1"]
          ],
          caption: "The three classes of DNS servers plus the local server that drives the lookup." },
        { type: "callout", kind: "key", title: "Zones and delegation",
          html: "<p>A <b>zone</b> is the part of the tree one set of authoritative servers is responsible for. The <code>com</code> zone does not contain <code>www.amazon.com</code>; it contains only the <b>NS records</b> for <code>amazon.com</code> (plus \"glue\" A records for those name servers when needed). Following NS records from zone to zone is how a resolver walks down the tree.</p>" },
        { type: "derivation", title: "How many servers does a cold lookup touch?",
          steps: [
            { tex: "S = 1_{\\text{root}} + 1_{\\text{TLD}} + D", why: "Always one root and one TLD server; D = number of further zone cuts (delegations) below the TLD that contain the name." },
            { tex: "\\text{www.amazon.com}: D = 1 \\Rightarrow S = 3", why: "amazon.com is the only zone below com; www is a record inside the amazon.com zone, not a separate zone." },
            { tex: "M_{iter} = 2S", why: "Each server contacted by the local resolver costs one query and one reply." },
            { tex: "M_{total} = 2S + 2 = 2(3) + 2 = 8", why: "Add the host's own query to the local server and the final reply back to the host." }
          ] },
        { type: "cheat", items: [
            "Root → TLD → authoritative; the local DNS server is <b>outside</b> the hierarchy",
            "Root returns TLD servers; TLD returns authoritative servers; authoritative returns the answer",
            "13 root server <b>names</b> (A to M), 12 operators, 1000+ anycast instances",
            "Registry runs the TLD (Verisign → .com); registrar sells the name",
            "Cold-cache messages: $2S + 2$ where $S$ = servers contacted"
          ] },
        { type: "worked", title: "Counting servers for a deep name", tag: "GATE-style",
          problem: "<p>Resolve <code>lab.cse.univ.ac.in</code> with an empty cache. Zone cuts exist at <code>in</code>, <code>ac.in</code>, <code>univ.ac.in</code> and <code>cse.univ.ac.in</code>; <code>lab</code> is a host inside <code>cse.univ.ac.in</code>. How many DNS servers does the local resolver contact, and how many DNS messages are exchanged in total (host included)?</p>",
          steps: [
            { text: "Root server: refers the resolver to the <b>in</b> TLD servers.", why: "Every cold lookup starts at the root." },
            { text: "in TLD: refers to the <b>ac.in</b> servers.", why: "ac.in is a separate zone delegated by in." },
            { text: "ac.in servers: refer to <b>univ.ac.in</b> servers.", why: "Another zone cut." },
            { text: "univ.ac.in servers: refer to <b>cse.univ.ac.in</b> servers.", why: "Another zone cut." },
            { text: "cse.univ.ac.in servers: return the A record of lab.cse.univ.ac.in.", why: "lab is inside this zone, so this server is authoritative for it." },
            { tex: "S = 5, \\quad M = 2 \\times 5 + 2 = 12", why: "One query and one reply per server, plus host ↔ local." }
          ],
          answer: "<b>5 servers</b> and <b>12 messages</b>." },
        { type: "traps", items: [
            "\"13 root servers\" means 13 server <b>names/addresses</b>, not 13 machines: there are over 1000 instances.",
            "The root server never knows www.amazon.com's IP; it only refers you to com.",
            "The local DNS server is not one of the three classes in the hierarchy (slide p11 says so explicitly).",
            "www is usually a record inside the amazon.com zone, so it adds no extra server.",
            "Registry (runs TLD servers) ≠ registrar (sells names)."
          ] }
      ],
      practice: [
        { id: "u07-B-1", type: "mcq", tag: "University-Midsem-style", topic: "07.3",
          q: "<p>A local resolver with an empty cache asks a root server for <code>www.amazon.com</code>. What does the root server return?</p>",
          options: ["The A record of www.amazon.com", "A referral: names and addresses of the com TLD servers", "The MX record of amazon.com", "An error, because root servers only answer for the root zone"],
          answer: 1,
          why: ["Root servers do not hold host records for amazon.com.", "Correct (WB-L08 p8 step 1): the root returns the IP addresses of the .com TLD servers.", "MX is unrelated to this lookup and the root does not hold it.", "A root server answers with a referral, not an error."],
          explain: "<p>Root → TLD addresses; TLD → authoritative addresses; authoritative → answer.</p>" },
        { id: "u07-B-2", type: "mcq", tag: "University-Midsem-style", topic: "07.3",
          q: "<p>According to WB-L08 p10, who maintains the TLD servers for <code>.com</code>?</p>",
          options: ["ICANN's root operators", "The registry Verisign", "Each registrar that sells .com names", "Amazon Route 53"],
          answer: 1,
          why: ["Root operators run the root servers, not .com.", "Correct: TLD servers are maintained by registries, for example Verisign for .com.", "Registrars sell names and pass them to the registry; they do not run the TLD servers.", "Route 53 hosts authoritative zones for customers, not the .com TLD."],
          explain: "<p>Registry = TLD operator; registrar = retailer.</p>" },
        { id: "u07-B-3", type: "msq", tag: "GATE-style", topic: "07.3",
          q: "<p>Why is DNS distributed instead of being one central server? (Select all that apply.)</p>",
          options: ["A central server would be a single point of failure", "It would have to handle the query traffic of the whole Internet", "It would be far from most clients, adding delay", "A central server could not use UDP"],
          answer: [0, 1, 2],
          why: ["One crash would break name resolution everywhere.", "Billions of queries per day would converge on one place.", "Clients on other continents would pay long RTTs for every lookup.", "Transport choice has nothing to do with centralisation; any server can use UDP."],
          explain: "<p>Kurose lists four problems with a centralised design: single point of failure, traffic volume, distant database, and maintenance.</p>" },
        { id: "u07-B-4", type: "num", tag: "GATE-style", topic: "07.3",
          q: "<p>Resolve <code>www.cse.iitb.ac.in</code> with an empty cache. Zone cuts: <code>in</code>, <code>ac.in</code>, <code>iitb.ac.in</code>, <code>cse.iitb.ac.in</code> (www is a host inside cse.iitb.ac.in). The local resolver queries iteratively. How many DNS messages are exchanged in total, counting the host's query and the final reply? (integer)</p>",
          answer: 12, tol: 0, unit: "messages", verify: "2*5+2",
          steps: [ { tex: "S = \\text{root} + \\text{in} + \\text{ac.in} + \\text{iitb.ac.in} + \\text{cse.iitb.ac.in} = 5", why: "Root, TLD, then three further zone cuts." },
                   { tex: "M = 2S + 2 = 10 + 2 = 12", why: "One query and one reply per server, plus host to local and back." } ] },
        { id: "u07-B-5", type: "mcq", tag: "University-Midsem-style", topic: "07.3",
          q: "<p>Which DNS server is <b>not</b> part of the root → TLD → authoritative hierarchy, yet is central to DNS operation?</p>",
          options: ["The root server", "The local DNS server provided by the ISP", "The com TLD server", "The authoritative server of amazon.com"],
          answer: 1,
          why: ["Root is the top of the hierarchy.", "Correct (WB-L08 p11): the local server is outside the hierarchy and acts as a proxy for clients.", "TLD servers are level 1 of the hierarchy.", "Authoritative servers are the leaves of the hierarchy."],
          explain: "<p>The local server queries the hierarchy on behalf of hosts and caches the replies.</p>" },
        { id: "u07-B-6", type: "mcq", tag: "GATE-style", topic: "07.3",
          q: "<p>\"There are 13 root servers\" is best interpreted as:</p>",
          options: ["Exactly 13 physical machines answer all root queries", "13 named root server identities, each replicated at many anycast sites (1000+ instances in total)", "13 TLDs exist", "13 servers per country"],
          answer: 1,
          why: ["There are far more than 13 machines; the slide says ~1000+ instances.", "Correct: a.root-servers.net to m.root-servers.net, each served from many locations.", "There are over a thousand TLDs; 13 is the count of root server names.", "Root instances are placed by operators, not one set per country."],
          explain: "<p>Kurose: copies of 13 different root servers, managed by 12 organisations, with more than 1000 instances worldwide.</p>" }
      ]
    },
    // ------------------------------------------------------------------ 07-C
    {
      id: "07-C",
      title: "Walking a Lookup: the Local DNS Server, Referrals and Caching",
      badge: "class",
      source: "WB-L08 p8, p11, p31, p117; SL-L09 p3, p15",
      covers: ["07.4", "07.5"],
      blocks: [
        { type: "intuition", title: "The reference librarian",
          html: "<p><b>Analogy.</b> You ask the college librarian (local DNS server) for a book. The librarian asks the national catalogue (root): \"try the Science section catalogue\" (TLD); that says \"try the Physics department library\" (authoritative), which finally has the book. The librarian hands you the book and <b>keeps a photocopy</b> (cache), so the next student gets it instantly.</p>" +
                "<p><b>Definition (WB-L08 p11; Kurose §2.4.2).</b> Each ISP or institution runs a <b>local DNS server</b> (default name server). It is usually close to the client (on the LAN or a few hops away). A host sends its query to the local server, which acts as a <b>proxy</b>: it forwards the query into the hierarchy, follows the <b>referrals</b> (\"I don't know, but try the .com servers\"), returns the final answer to the host, and <b>caches</b> every answer and referral for its TTL.</p>" },
        { type: "figure", caption: "The 8-step lookup of WB-L08 p31. Requests are solid, replies dashed. Steps 2–7 are iterative (the local server does the asking); step 1 is a recursive request from the host.",
          html: "<svg viewBox='0 0 640 300' width='100%' font-family='sans-serif'><defs><marker id='m07c' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='currentColor'/></marker></defs>" +
                "<rect x='10' y='130' width='90' height='40' rx='8' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='55' y='155' text-anchor='middle' fill='currentColor' font-size='13'>Your PC</text>" +
                "<rect x='190' y='125' width='130' height='50' rx='8' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='255' y='147' text-anchor='middle' fill='currentColor' font-size='13'>Local DNS</text><text x='255' y='164' text-anchor='middle' fill='var(--muted)' font-size='11'>server (cache)</text>" +
                "<rect x='470' y='20' width='160' height='40' rx='8' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='550' y='45' text-anchor='middle' fill='currentColor' font-size='13'>Root DNS server</text>" +
                "<rect x='470' y='130' width='160' height='40' rx='8' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='550' y='155' text-anchor='middle' fill='currentColor' font-size='13'>TLD DNS server</text>" +
                "<rect x='470' y='240' width='160' height='40' rx='8' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='550' y='265' text-anchor='middle' fill='currentColor' font-size='12'>Authoritative server</text>" +
                "<g stroke='currentColor' stroke-width='1.6' fill='none'>" +
                "<line x1='100' y1='142' x2='188' y2='142' marker-end='url(#m07c)'/><line x1='188' y1='160' x2='102' y2='160' stroke-dasharray='5 4' marker-end='url(#m07c)'/>" +
                "<line x1='320' y1='130' x2='468' y2='38' marker-end='url(#m07c)'/><line x1='468' y1='52' x2='322' y2='142' stroke-dasharray='5 4' marker-end='url(#m07c)'/>" +
                "<line x1='320' y1='148' x2='468' y2='143' marker-end='url(#m07c)'/><line x1='468' y1='160' x2='322' y2='160' stroke-dasharray='5 4' marker-end='url(#m07c)'/>" +
                "<line x1='320' y1='168' x2='468' y2='248' marker-end='url(#m07c)'/><line x1='468' y1='264' x2='310' y2='176' stroke-dasharray='5 4' marker-end='url(#m07c)'/></g>" +
                "<g fill='var(--accent)' font-size='12' font-weight='bold'><text x='140' y='136'>1</text><text x='140' y='178'>8</text><text x='390' y='78'>2</text><text x='415' y='105'>3</text><text x='395' y='140'>4</text><text x='395' y='176'>5</text><text x='380' y='200'>6</text><text x='395' y='238'>7</text></g>" +
                "</svg>" },
        { type: "table", head: ["Step", "From → To", "Message (WB-L08 p117 / SL-L09 p15)", "Kind"],
          rows: [
            ["1", "Browser → local DNS server (\"ISP/Security product\")", "What is the IP for newtonschool.co?", "query (RD = 1, recursive request)"],
            ["2", "Local → root server", "What is the name server for co?", "iterative query"],
            ["3", "Root → local", "Try 120.XX.XX.XX", "referral to the co TLD"],
            ["4", "Local → TLD (co) server", "What is the authoritative DNS for newtonschool.co?", "iterative query"],
            ["5", "TLD → local", "Try 80.XX.XX.XX", "referral to the authoritative server"],
            ["6", "Local → authoritative server", "What is the IP for newtonschool.co?", "iterative query"],
            ["7", "Authoritative → local", "99.83.190.102", "answer (AA = 1), cached by the local server"],
            ["8", "Local → browser", "It's 99.83.190.102", "final answer"]
          ],
          caption: "The newtonschool.co walk-through. The slide masks the TLD and authoritative server addresses as XX." },
        { type: "seq", left: "Local DNS server", right: "Root / TLD / authoritative", caption: "WB-L08 p11: careers.github.com through the corp.com local server (6 numbered messages between corp.com and the hierarchy).",
          events: [
            { from: "L", label: "1. Query careers.github.com (to root)", note: "PC asked corp.com first" },
            { from: "R", label: "2. I don't know; try the .com servers" },
            { from: "L", label: "3. Query careers.github.com (to .com)" },
            { from: "R", label: "4. I don't know; try github.com's server" },
            { from: "L", label: "5. Query careers.github.com (to github.com)" },
            { from: "R", label: "6. Answer: IP of careers.github.com", note: "cached at corp.com" }
          ] },
        { type: "derivation", title: "Lookup latency from RTTs",
          steps: [
            { tex: "T = RTT_{h\\leftrightarrow L} + \\sum_{s \\in \\text{servers asked}} RTT_{L \\leftrightarrow s}", why: "Each query waits for its reply before the next starts, so the round trips add up (processing time ignored)." },
            { tex: "T_{cold} = RTT_{hL} + RTT_{root} + RTT_{TLD} + RTT_{auth}", why: "Empty cache: the local server must visit all three levels." },
            { tex: "T_{TLD\\,cached} = RTT_{hL} + RTT_{auth}", why: "If the authoritative servers' NS records are cached, root and TLD are skipped." },
            { tex: "T_{answer\\,cached} = RTT_{hL}", why: "If the A record itself is cached, the local server answers immediately." }
          ] },
        { type: "cheat", items: [
            "Host → local: <b>recursive</b> request (\"give me the final answer\")",
            "Local → root/TLD/authoritative: <b>iterative</b> queries; each returns a referral or the answer",
            "Cold lookup of www.amazon.com = <b>8 messages</b> (p31)",
            "The local server caches answers <b>and referrals</b> (NS records of TLDs are cached for days, so root is rarely contacted)",
            "$T = RTT_{hL} + \\sum RTT_{L,s}$"
          ] },
        { type: "worked", title: "Latency of newtonschool.co: cold vs warm", tag: "University-Midsem-style",
          problem: "<p>RTTs: host ↔ local DNS = 4 ms, local ↔ root = 30 ms, local ↔ co TLD = 40 ms, local ↔ newtonschool.co authoritative = 60 ms. Find the lookup time (a) with an empty cache, (b) when the co TLD's referral for newtonschool.co is cached, (c) when the A record is cached.</p>",
          steps: [
            { tex: "T_a = 4 + 30 + 40 + 60 = 134\\,\\text{ms}", why: "All three levels are visited in sequence, plus the host's own round trip." },
            { tex: "T_b = 4 + 60 = 64\\,\\text{ms}", why: "The cached NS records point straight at the authoritative server." },
            { tex: "T_c = 4\\,\\text{ms}", why: "A cache hit at the local server needs only the host's round trip." }
          ],
          answer: "(a) <b>134 ms</b>, (b) <b>64 ms</b>, (c) <b>4 ms</b>. Caching cuts the cost by 97% on a hit." },
        { type: "code", file: "Unit07_resolver_cache.py", level: "low", title: "Simulated hierarchy: message counts, RTT sums, TTL cache, negative cache" },
        { type: "traps", items: [
            "Count messages, not servers: 3 servers → 6 messages, plus 2 for host ↔ local = 8.",
            "The p11 diagram numbers only the 6 messages between corp.com and the hierarchy; the PC's query and the final reply are extra.",
            "The answer is cached at the <b>local</b> server (and usually by the OS and browser too), not at the root.",
            "Referral replies are not errors: \"I don't know, but try X\" is the normal iterative response.",
            "Latency adds RTTs of queries done <b>one after another</b>; do not add one-way delays twice."
          ] }
      ],
      practice: [
        { id: "u07-C-1", type: "mcq", tag: "University-Midsem-style", topic: "07.4",
          q: "<p>In the WB-L08 p31 diagram (empty caches), how many DNS messages are exchanged in total to resolve the name for the PC?</p>",
          options: ["3", "6", "8", "10"], answer: 2,
          why: ["3 is the number of hierarchy servers, not messages.", "6 counts only the local server ↔ hierarchy messages.", "Correct: 1 PC→local, 2–7 three query/reply pairs, 8 local→PC.", "10 would need a fourth server (an intermediate name server)."],
          explain: "<p>$2 \\times 3 + 2 = 8$.</p>" },
        { id: "u07-C-2", type: "num", tag: "University-Midsem-style", topic: "07.4",
          q: "<p>RTT host ↔ local = 3 ms, local ↔ root = 25 ms, local ↔ TLD = 35 ms, local ↔ authoritative = 45 ms. Caches are empty. Name-resolution time in <b>ms</b> (integer)?</p>",
          answer: 108, tol: 0, unit: "ms", verify: "3+25+35+45",
          formula: "T = RTT_{hL} + RTT_{root} + RTT_{TLD} + RTT_{auth}",
          steps: [ { tex: "T = 3 + 25 + 35 + 45", why: "Four sequential round trips." }, { tex: "T = 108\\,\\text{ms}", why: "Add." } ] },
        { id: "u07-C-3", type: "num", tag: "University-Midsem-style", topic: "07.5",
          q: "<p>Same RTTs as the previous question (3, 25, 35, 45 ms). A second host asks for a <b>different</b> name in the same domain one minute later; the local server still has the domain's NS records cached but not the new A record. Resolution time in <b>ms</b> (integer)?</p>",
          answer: 48, tol: 0, unit: "ms", verify: "3+45",
          steps: [ { tex: "T = RTT_{hL} + RTT_{auth}", why: "The cached NS records skip the root and TLD." }, { tex: "T = 3 + 45 = 48\\,\\text{ms}", why: "Add." } ] },
        { id: "u07-C-4", type: "mcq", tag: "University-Midsem-style", topic: "07.4",
          q: "<p>On WB-L08 p11 the root replies \"I don't know but I can get you to .com DNS Server\". In DNS terms this reply is:</p>",
          options: ["An error (NXDOMAIN)", "A referral: NS records for com plus their addresses", "A CNAME", "A recursive answer"],
          answer: 1,
          why: ["NXDOMAIN means the name does not exist; the root is not saying that.", "Correct: a referral points the resolver one level down.", "A CNAME is an alias record, unrelated.", "A recursive answer would contain the final IP."],
          explain: "<p>Iterative queries are answered with referrals until the authoritative server gives the answer.</p>" },
        { id: "u07-C-5", type: "msq", tag: "University-Midsem-style", topic: "07.5",
          q: "<p>Which statements about the local DNS server are true (WB-L08 p11)? (Select all that apply.)</p>",
          options: ["It is usually provided by the ISP or the institution", "It is the top of the DNS hierarchy", "It forwards client queries into the hierarchy, acting as a proxy", "It caches answers so later queries are faster"],
          answer: [0, 2, 3],
          why: ["Residential and institutional ISPs provide one.", "The root is the top; the local server is outside the hierarchy.", "That is its job in steps 2–7.", "p11 notes the answer \"will be cached\"."],
          explain: "<p>Local DNS: ISP-provided, close to the client, proxy into the hierarchy, cache.</p>" },
        { id: "u07-C-6", type: "text", tag: "University-Midsem-style", topic: "07.4",
          q: "<p>Predict the exact output.</p>",
          code: "servers = ['root', 'co TLD', 'newtonschool.co authoritative']\nmsgs = 2  # host -> local and local -> host\nfor s in servers:\n    msgs += 2\nprint(msgs, len(servers))",
          answer: "8 3", runCheck: true,
          explain: "<p>Start at 2, add 2 for each of the three servers: 8 messages, 3 servers.</p>" }
      ]
    },
    // ------------------------------------------------------------------ 07-D
    {
      id: "07-D",
      title: "Recursive vs Iterative Resolution, TTL Caching and Slow Propagation",
      badge: "researched",
      source: "Kurose & Ross 8e §2.4.2–2.4.3; RFC 1034 §4.3.1, §5.3.3; RFC 1035 §3.2.1, §4.1.1; RFC 2308 §5",
      covers: ["07.6"],
      blocks: [
        { type: "intuition", title: "\"Ask him\" vs \"I'll call you back\"",
          html: "<p><b>Analogy.</b> <i>Iterative</i>: you ask a clerk, who says \"I don't know, ask counter 5\"; you walk to counter 5 yourself. <i>Recursive</i>: the clerk says \"wait, I'll find out\", phones counter 5 (who phones counter 9) and hands you the final answer.</p>" +
                "<p><b>Definitions (RFC 1034 §4.3.1).</b> In a <b>recursive</b> query the asked server must return the final answer (or an error), doing all further queries itself. In an <b>iterative</b> query the asked server returns the best it has, usually a <b>referral</b> to servers closer to the answer, and the asker continues. The client asks for recursion by setting <b>RD</b> (Recursion Desired) = 1; a server that offers it sets <b>RA</b> (Recursion Available) = 1 in replies. In practice (Kurose Fig. 2.19) the host → local query is recursive and all other queries are iterative; root and TLD servers do not offer recursion because of their load.</p>" +
                "<p><b>Caching and TTL.</b> Every resolver keeps each record for its TTL (seconds) and then discards it. A DNS change is never pushed to caches: copies elsewhere stay as they are until their TTL runs out. This is why a change can take up to the old TTL to be seen everywhere, which people call \"slow propagation\".</p>" },
        { type: "figure", caption: "Left: iterative (the local server does all the asking). Right: fully recursive (each server asks the next). Both use 8 messages for www.amazon.com; what changes is who sends them and who carries the load.",
          html: "<svg viewBox='0 0 640 260' width='100%' font-family='sans-serif'><defs><marker id='m07d' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='currentColor'/></marker></defs>" +
                "<text x='150' y='18' text-anchor='middle' fill='var(--accent)' font-size='13' font-weight='bold'>Iterative</text><text x='480' y='18' text-anchor='middle' fill='var(--accent)' font-size='13' font-weight='bold'>Recursive</text>" +
                "<line x1='320' y1='10' x2='320' y2='250' stroke='var(--muted)' stroke-dasharray='4 4'/>" +
                "<g fill='none' stroke-width='2'><rect x='10' y='110' width='60' height='30' rx='6' stroke='var(--accent)'/><rect x='95' y='110' width='70' height='30' rx='6' stroke='var(--accent)'/>" +
                "<rect x='215' y='35' width='90' height='30' rx='6' stroke='var(--warn)'/><rect x='215' y='110' width='90' height='30' rx='6' stroke='var(--warn)'/><rect x='215' y='185' width='90' height='30' rx='6' stroke='var(--ok)'/>" +
                "<rect x='345' y='110' width='60' height='30' rx='6' stroke='var(--accent)'/><rect x='430' y='110' width='70' height='30' rx='6' stroke='var(--accent)'/>" +
                "<rect x='535' y='30' width='90' height='30' rx='6' stroke='var(--warn)'/><rect x='535' y='110' width='90' height='30' rx='6' stroke='var(--warn)'/><rect x='535' y='190' width='90' height='30' rx='6' stroke='var(--ok)'/></g>" +
                "<g fill='currentColor' font-size='11' text-anchor='middle'><text x='40' y='129'>host</text><text x='130' y='129'>local</text><text x='260' y='54'>root</text><text x='260' y='129'>TLD</text><text x='260' y='204'>auth</text>" +
                "<text x='375' y='129'>host</text><text x='465' y='129'>local</text><text x='580' y='49'>root</text><text x='580' y='129'>TLD</text><text x='580' y='209'>auth</text></g>" +
                "<g stroke='currentColor' stroke-width='1.5'><line x1='70' y1='125' x2='93' y2='125' marker-end='url(#m07d)' marker-start='url(#m07d)'/>" +
                "<line x1='165' y1='118' x2='213' y2='55' marker-end='url(#m07d)' marker-start='url(#m07d)'/><line x1='165' y1='125' x2='213' y2='125' marker-end='url(#m07d)' marker-start='url(#m07d)'/><line x1='165' y1='132' x2='213' y2='195' marker-end='url(#m07d)' marker-start='url(#m07d)'/>" +
                "<line x1='405' y1='125' x2='428' y2='125' marker-end='url(#m07d)' marker-start='url(#m07d)'/><line x1='500' y1='118' x2='533' y2='50' marker-end='url(#m07d)' marker-start='url(#m07d)'/>" +
                "<line x1='580' y1='60' x2='580' y2='108' marker-end='url(#m07d)' marker-start='url(#m07d)'/><line x1='580' y1='140' x2='580' y2='188' marker-end='url(#m07d)' marker-start='url(#m07d)'/></g>" +
                "<text x='160' y='245' text-anchor='middle' fill='var(--muted)' font-size='11'>local sends 3 queries, gets 2 referrals + 1 answer</text><text x='480' y='245' text-anchor='middle' fill='var(--muted)' font-size='11'>root and TLD each make a query for you</text>" +
                "</svg>" },
        { type: "table", head: ["Aspect", "Iterative", "Recursive"],
          rows: [
            ["Reply from the asked server", "Referral (NS + glue) or the answer", "Always the final answer or an error"],
            ["Who does the work", "The asker (the local resolver)", "The asked server, which in turn queries others"],
            ["Messages for www.amazon.com, cold cache", "8 (2 host↔local + 6 local↔servers)", "8 (4 queries down the chain + 4 replies back)"],
            ["Load on root/TLD", "Low: answer one question and forget", "High: they hold state and wait for children, so root/TLD do not offer it"],
            ["Header bits", "RD = 0 in the query (or RD ignored)", "RD = 1 in the query, RA = 1 in the reply"],
            ["Where used", "Local resolver → root, TLD, authoritative", "Stub resolver in the host → local resolver"]
          ],
          caption: "Iterative vs recursive resolution." },
        { type: "chart", title: "Remaining TTL of the cached A record at one resolver (TTL = 300 s)", xLabel: "time (s)", yLabel: "TTL left (s)",
          x: [0, 60, 120, 180, 240, 299, 300, 360, 420, 480, 540, 599, 600],
          series: [ { name: "TTL left", y: [300, 240, 180, 120, 60, 1, 300, 240, 180, 120, 60, 1, 300] } ],
          marks: [ { x: 120, label: "IP changed at authoritative" }, { x: 300, label: "expiry: new IP fetched" } ],
          caption: "Between t = 120 s and t = 300 s the resolver keeps answering with the old IP; nothing tells it the record changed. Worst-case staleness = the TTL that was in force when the copy was cached." },
        { type: "callout", kind: "key", title: "Negative caching (RFC 2308)",
          html: "<p>\"This name does not exist\" (RCODE 3, NXDOMAIN) and \"the name exists but has no record of this type\" (NODATA) are cached too. The authoritative server includes its zone's <b>SOA</b> record, and the resolver caches the negative answer for $\\min(\\text{SOA TTL}, \\text{SOA MINIMUM})$ seconds. So a name created just after someone looked it up stays invisible to that resolver for that long.</p>" },
        { type: "derivation", title: "How long until everyone sees a change?",
          steps: [
            { tex: "t_{expire} = t_{fetch} + TTL_{old}", why: "Each cache keeps the copy it fetched for the TTL that came with that copy." },
            { tex: "\\text{latest } t_{fetch} = t_{change}^{-}", why: "The worst case is a resolver that refreshed its copy just before the change." },
            { tex: "t_{all\\,updated} = t_{change} + TTL_{old}", why: "So the change is guaranteed visible everywhere only one old TTL after it is made." },
            { tex: "\\text{lower TTL to } TTL_{new} \\text{ at } t \\le t_{change} - TTL_{old}", why: "To make a planned change fast, reduce the TTL early enough that every cached copy already carries the short TTL." },
            { tex: "TTL_{neg} = \\min(TTL_{SOA}, \\text{MINIMUM}_{SOA})", why: "RFC 2308 §5: how long an NXDOMAIN or NODATA answer is cached." }
          ] },
        { type: "cheat", items: [
            "Recursive = \"give me the final answer\" (RD = 1, RA = 1); iterative = \"give me a referral\"",
            "Host → local is recursive; local → root/TLD/authoritative is iterative",
            "Both styles: 8 messages for a 3-server cold lookup; the difference is load and who keeps state",
            "Change visible everywhere after at most $TTL_{old}$; lower the TTL at least $TTL_{old}$ before a migration",
            "Negative cache TTL $= \\min(\\text{SOA TTL}, \\text{SOA MINIMUM})$",
            "Caches exist in the browser, the OS stub resolver and the local resolver: each obeys the TTL"
          ] },
        { type: "worked", title: "Planning a server migration", tag: "University-Midsem-style",
          problem: "<p><code>shop.example</code> has an A record with TTL 86400 s. The team will switch it to a new IP at 12:00 on Friday and wants every resolver to use the new IP by 12:05 at the latest. (a) What TTL should the record carry at the switch? (b) By when must that TTL be set? (c) If they forget and switch with TTL 86400, until when might some users still reach the old server?</p>",
          steps: [
            { tex: "TTL_{new} \\le 12{:}05 - 12{:}00 = 5\\,\\text{min} = 300\\,\\text{s}", why: "After the switch, a copy fetched just before 12:00 lives at most TTL_new seconds." },
            { tex: "t_{lower} \\le 12{:}00\\,\\text{Fri} - 86400\\,\\text{s} = 12{:}00\\,\\text{Thu}", why: "Copies fetched before the TTL was lowered still carry 86400 s, so every such copy must have expired by the switch." },
            { tex: "t_{last\\,stale} = 12{:}00\\,\\text{Fri} + 86400\\,\\text{s} = 12{:}00\\,\\text{Sat}", why: "A copy cached at 11:59:59 on Friday with TTL 86400 is reused until about 12:00 on Saturday." }
          ],
          answer: "(a) TTL ≤ <b>300 s</b>; (b) lower it no later than <b>12:00 Thursday</b>; (c) old IP could be used until about <b>12:00 Saturday</b> (24 h after the switch)." },
        { type: "worked", title: "Recursive chain latency", tag: "GATE-style",
          problem: "<p>Fully recursive resolution of www.amazon.com: RTT host ↔ local 4 ms, local ↔ root 30 ms, root ↔ com TLD 20 ms, TLD ↔ amazon.com authoritative 25 ms. Find the resolution time and the number of messages.</p>",
          steps: [
            { tex: "T = 4 + 30 + 20 + 25 = 79\\,\\text{ms}", why: "Each hop of the chain waits for the next hop's reply, so the four RTTs add." },
            { tex: "M = 4 \\text{ queries} + 4 \\text{ replies} = 8", why: "Host→local→root→TLD→auth, and the answer returns along the same chain." }
          ],
          answer: "<b>79 ms</b>, <b>8 messages</b>." },
        { type: "code", file: "Unit07_getaddrinfo.py", level: "high", title: "Stub resolver calls: socket.getaddrinfo / gethostbyname, plus optional dnspython" },
        { type: "traps", items: [
            "\"Propagation\" is not a push: authoritative servers change instantly; it is cached copies that expire slowly.",
            "Lowering the TTL at the moment of the change does not help copies already cached with the old, long TTL.",
            "Iterative and recursive give the same message count in the standard example; the MCQ difference is <b>who</b> sends them.",
            "RD is set by the client in the query; RA is set by the server in the reply.",
            "NXDOMAIN answers are cached as well (negative caching), so a newly created name can appear \"missing\" for a while.",
            "Browsers and operating systems cache DNS too, so flushing one cache may not be enough."
          ] }
      ],
      practice: [
        { id: "u07-D-1", type: "mcq", tag: "GATE-style", topic: "07.6",
          q: "<p>In the usual resolution of a name (Kurose Fig. 2.19), which query is recursive?</p>",
          options: ["Local DNS server → root server", "Requesting host → local DNS server", "Local DNS server → TLD server", "Local DNS server → authoritative server"],
          answer: 1,
          why: ["Root servers return referrals: that query is iterative.", "Correct: the host asks the local server for the final answer (RD = 1).", "TLD servers return referrals: iterative.", "The authoritative server answers directly, but the local server still treats it as an iterative step."],
          explain: "<p>Typical pattern: one recursive query from the host, iterative queries from the local server.</p>" },
        { id: "u07-D-2", type: "mcq", tag: "GATE-style", topic: "07.6",
          q: "<p>A reply carries flags QR = 1, RD = 1, RA = 0. What does RA = 0 tell the client?</p>",
          options: ["The answer is authoritative", "The responding server does not offer recursion", "The message was truncated", "The query was invalid"],
          answer: 1,
          why: ["Authority is shown by AA, not RA.", "Correct: RA (Recursion Available) = 0 means this server will not resolve recursively.", "Truncation is the TC bit.", "Errors are reported in RCODE."],
          explain: "<p>RD is copied from the query; RA is the server's capability.</p>" },
        { id: "u07-D-3", type: "num", tag: "University-Midsem-style", topic: "07.6",
          q: "<p>A resolver caches an A record (TTL 3600 s) at t = 0. The administrator changes the IP at the authoritative server at t = 1200 s. For how many <b>seconds</b> after the change can this resolver still hand out the old IP? (integer)</p>",
          answer: 2400, tol: 0, unit: "s", verify: "3600-1200",
          steps: [ { tex: "t_{expire} = 0 + 3600 = 3600\\,\\text{s}", why: "The cached copy is valid for its TTL from the moment it was fetched." },
                   { tex: "3600 - 1200 = 2400\\,\\text{s}", why: "Stale window = expiry time minus the time of the change." } ] },
        { id: "u07-D-4", type: "num", tag: "GATE-style", topic: "07.6",
          q: "<p>A query for <code>typo.example</code> returns NXDOMAIN with the zone's SOA record: SOA TTL = 3600 s, SOA MINIMUM = 300 s. For how many <b>seconds</b> may the resolver cache this negative answer? (integer)</p>",
          answer: 300, tol: 0, unit: "s", verify: "min(3600, 300)",
          formula: "TTL_{neg} = \\min(TTL_{SOA}, \\text{MINIMUM}_{SOA})",
          steps: [ { tex: "TTL_{neg} = \\min(3600, 300)", why: "RFC 2308 §5." }, { tex: "TTL_{neg} = 300\\,\\text{s}", why: "The smaller of the two." } ] },
        { id: "u07-D-5", type: "msq", tag: "University-Midsem-style", topic: "07.6",
          q: "<p>Why can a DNS change take hours to be seen by all users? (Select all that apply.)</p>",
          options: ["Resolvers keep cached copies until their TTL expires", "Authoritative servers send updates to resolvers only once per day", "Browsers and operating systems also cache answers", "A cached copy keeps the TTL it was fetched with, even if the TTL is lowered later"],
          answer: [0, 2, 3],
          why: ["Caches are refreshed only on expiry.", "There is no push mechanism to resolvers at all.", "Several cache layers each wait for their own TTL.", "Lowering the TTL affects only copies fetched after the change."],
          explain: "<p>Propagation delay = cached copies expiring, bounded by the old TTL.</p>" },
        { id: "u07-D-6", type: "num", tag: "GATE-style", topic: "07.6",
          q: "<p>Fully recursive chain: RTT host ↔ local 5 ms, local ↔ root 40 ms, root ↔ TLD 30 ms, TLD ↔ authoritative 35 ms. Resolution time in <b>ms</b> (integer)?</p>",
          answer: 110, tol: 0, unit: "ms", verify: "5+40+30+35",
          steps: [ { tex: "T = 5 + 40 + 30 + 35", why: "Each link of the chain is a sequential round trip." }, { tex: "T = 110\\,\\text{ms}", why: "Add." } ] },
        { id: "u07-D-7", type: "mcq", tag: "University-Midsem-style", topic: "07.6",
          q: "<p>A record has TTL 7200 s. You will change its IP at 18:00 and want the change seen within 60 s. When, at the latest, must you lower its TTL to 60 s?</p>",
          options: ["17:59", "17:00", "16:00", "Exactly at 18:00"], answer: 2,
          why: ["Copies fetched before 17:59 still carry 7200 s.", "Copies fetched at 16:30 would still be valid until 18:30.", "Correct: 18:00 − 7200 s = 16:00; after that every cached copy has TTL 60.", "Changing the TTL at the switch does not affect copies already cached with 7200 s."],
          explain: "<p>Lower the TTL at least one old TTL before the change.</p>" }
      ]
    },
    // ------------------------------------------------------------------ 07-E
    {
      id: "07-E",
      title: "The DNS Message on the Wire: Header, Question, Records, UDP/TCP 53",
      badge: "researched",
      source: "RFC 1035 §3.1, §4.1–4.2; RFC 7766; RFC 6891; Kurose & Ross 8e §2.4.3",
      covers: ["07.6"],
      blocks: [
        { type: "intuition", title: "One form for questions and answers",
          html: "<p><b>Analogy.</b> A DNS message is a printed form with the same boxes whether you are asking or answering: a 12-byte header that says who you are and how many entries follow, then four lists. The client fills in the question; the server sends the same form back with the question copied and the answers filled in.</p>" +
                "<p><b>Definition (RFC 1035 §4.1).</b> Every message = <b>Header</b> (12 bytes) + <b>Question</b> + <b>Answer</b> + <b>Authority</b> + <b>Additional</b>. The header's four counts (QDCOUNT, ANCOUNT, NSCOUNT, ARCOUNT) say how many entries each section has. Names are sent as <b>length-prefixed labels</b> (no dots) ending in a zero byte, and repeated names may be replaced by a 2-byte <b>compression pointer</b>.</p>" },
        { type: "packet", title: "DNS header (RFC 1035 §4.1.1): 12 bytes", width: 32,
          fields: [
            { name: "ID", bits: 16, note: "chosen by the client; copied into the reply so the client can match it (random, to resist spoofing)" },
            { name: "QR", bits: 1, note: "0 = query, 1 = response" },
            { name: "Opcode", bits: 4, note: "0 = standard query (QUERY); 4 = NOTIFY; 5 = UPDATE" },
            { name: "AA", bits: 1, note: "Authoritative Answer: set by a server that owns the zone" },
            { name: "TC", bits: 1, note: "TrunCation: reply did not fit (512 B on plain UDP); retry over TCP" },
            { name: "RD", bits: 1, note: "Recursion Desired: set by the client, copied into the reply" },
            { name: "RA", bits: 1, note: "Recursion Available: set by the server in replies" },
            { name: "Z", bits: 3, note: "reserved, must be 0 in RFC 1035 (later DNSSEC RFCs reuse two of these bits as AD and CD)" },
            { name: "RCODE", bits: 4, note: "0 NOERROR, 1 FORMERR, 2 SERVFAIL, 3 NXDOMAIN, 4 NOTIMP, 5 REFUSED" },
            { name: "QDCOUNT", bits: 16, note: "number of questions, normally 1" },
            { name: "ANCOUNT", bits: 16, note: "number of answer records" },
            { name: "NSCOUNT", bits: 16, note: "number of authority records (NS or SOA)" },
            { name: "ARCOUNT", bits: 16, note: "number of additional records (glue A/AAAA, EDNS OPT)" }
          ],
          caption: "96 bits = 12 bytes. Flags word: QR(1) Opcode(4) AA(1) TC(1) RD(1) RA(1) Z(3) RCODE(4) = 16 bits." },
        { type: "packet", title: "Question section for www.amazon.com, type A", width: 32,
          fields: [
            { name: "QNAME = 03 www 06 amazon 03 com 00", bits: 128, note: "16 bytes: each label is a length byte then the characters; the zero byte is the root" },
            { name: "QTYPE", bits: 16, note: "1 = A, 2 = NS, 5 = CNAME, 6 = SOA, 12 = PTR, 15 = MX, 16 = TXT, 28 = AAAA, 252 = AXFR" },
            { name: "QCLASS", bits: 16, note: "1 = IN (Internet)" }
          ],
          caption: "QNAME length = (characters in the dotted name) + 2. Here 14 + 2 = 16 bytes, so the question is 20 bytes." },
        { type: "packet", title: "Answer record (A) with a compressed name", width: 32,
          fields: [
            { name: "NAME = C0 0C (pointer)", bits: 16, note: "top two bits 11 mark a pointer; the low 14 bits (here 12) are the offset of the name in the message" },
            { name: "TYPE", bits: 16, note: "1 = A" },
            { name: "CLASS", bits: 16, note: "1 = IN" },
            { name: "TTL", bits: 32, note: "seconds this record may be cached (unsigned 32-bit)" },
            { name: "RDLENGTH", bits: 16, note: "length of RDATA in bytes: 4 for A, 16 for AAAA" },
            { name: "RDATA", bits: 32, note: "the IPv4 address, for example 63 53 BE 66 = 99.83.190.102" }
          ],
          caption: "2 + 2 + 2 + 4 + 2 + 4 = 16 bytes per A record when the name is a pointer." },
        { type: "callout", kind: "key", title: "Transport: UDP 53, and TCP 53 when needed",
          html: "<ul><li><b>UDP port 53</b> for ordinary queries: one datagram each way, no handshake, so a lookup costs one RTT.</li>" +
                "<li>Plain DNS over UDP is limited to <b>512 bytes</b> of payload (RFC 1035 §4.2.1). A longer reply is cut and the server sets <b>TC = 1</b>; the client then repeats the query over <b>TCP port 53</b>.</li>" +
                "<li><b>EDNS(0)</b> (RFC 6891) lets the client advertise a larger UDP buffer in an OPT record in the Additional section, so most modern replies avoid TCP.</li>" +
                "<li><b>Zone transfers</b> (AXFR/IXFR) between primary and secondary servers always use TCP, because they carry a whole zone.</li>" +
                "<li>Over TCP each message is preceded by a <b>2-byte length</b> field. RFC 7766 makes TCP support mandatory for all DNS implementations.</li></ul>" },
        { type: "table", head: ["RCODE", "Name", "Meaning"],
          rows: [ ["0", "NOERROR", "success (the answer list may still be empty: NODATA)"], ["1", "FORMERR", "the server could not parse the query"], ["2", "SERVFAIL", "the server failed (for example, could not reach the authoritative servers)"], ["3", "NXDOMAIN", "the name does not exist (only meaningful from an authoritative source)"], ["4", "NOTIMP", "query kind not implemented"], ["5", "REFUSED", "policy refusal (for example, an open recursion request to a server that serves only its own clients)"] ],
          caption: "Response codes (RFC 1035 §4.1.1)." },
        { type: "derivation", title: "Message sizes",
          steps: [
            { tex: "|QNAME| = \\sum_i (1 + |label_i|) + 1 = |\\text{dotted name}| + 2", why: "Each label gets one length byte; the dots disappear but there is one more length byte than dots, and a final zero byte." },
            { tex: "|\\text{query}| = 12 + |QNAME| + 4", why: "Header + name + QTYPE (2) + QCLASS (2)." },
            { tex: "\\text{www.amazon.com}: 12 + 16 + 4 = 32\\,\\text{B}", why: "14 characters + 2 = 16." },
            { tex: "|\\text{reply}| = |\\text{query}| + n_A \\times 16", why: "The reply copies the question and adds 16 bytes per A record whose name is a 2-byte pointer." },
            { tex: "\\text{UDP datagram} = 8 + 32 = 40\\,\\text{B}, \\; \\text{IPv4 packet} = 20 + 40 = 60\\,\\text{B}", why: "Add the 8-byte UDP header and the 20-byte IPv4 header (no options)." }
          ] },
        { type: "cheat", items: [
            "Header 12 B: ID 16 | QR 1 Opcode 4 AA 1 TC 1 RD 1 RA 1 Z 3 RCODE 4 | QD AN NS AR counts 16 each",
            "Common flags: query 0x0100 (RD); reply 0x8180 (QR, RD, RA, NOERROR); 0x8183 = same with NXDOMAIN",
            "QNAME bytes = name length + 2; label ≤ 63 B; name ≤ 255 B",
            "Pointer: first two bits 11; offset = value AND 0x3FFF; C0 0C = offset 12 (the question name)",
            "A record = 16 B with a pointer name; AAAA = 28 B",
            "UDP 53; TC = 1 → retry on TCP 53; zone transfer = TCP; TCP messages have a 2-byte length prefix"
          ] },
        { type: "worked", title: "Decode a reply header", tag: "GATE-style",
          problem: "<p>A reply begins with the 12 bytes <code>1a 2b 81 80 00 01 00 02 00 00 00 00</code>. Decode ID, every flag, and the four counts.</p>",
          steps: [
            { text: "ID = 0x1a2b = 6699.", why: "First 16 bits; it must equal the ID of the query." },
            { tex: "\\text{0x8180} = 1000\\,0001\\,1000\\,0000_2", why: "Write the flags word in binary, 4 bits per hex digit." },
            { text: "Bit 15 QR = 1 (response). Bits 14–11 Opcode = 0000 (standard query). Bit 10 AA = 0. Bit 9 TC = 0. Bit 8 RD = 1.", why: "Read the fields left to right: 1 | 0000 | 0 | 0 | 1." },
            { text: "Bit 7 RA = 1. Bits 6–4 Z = 000. Bits 3–0 RCODE = 0000 (NOERROR).", why: "The low byte 1000 0000 is RA = 1 followed by seven zeros." },
            { text: "QDCOUNT = 1, ANCOUNT = 2, NSCOUNT = 0, ARCOUNT = 0.", why: "The four remaining 16-bit words." }
          ],
          answer: "ID 0x1a2b; QR = 1, Opcode = 0, AA = 0 (from a cache, not authoritative), TC = 0, RD = 1, RA = 1, Z = 0, RCODE = 0; 1 question, 2 answers, 0 authority, 0 additional. This is the canned response in Unit07_dns_packet.py (www.newtonschool.co → CNAME → A 99.83.190.102)." },
        { type: "worked", title: "Follow two compression pointers", tag: "University-Midsem-style",
          problem: "<p>In that 67-byte reply the question name starts at offset 12 (<code>03 www 0c newtonschool 02 co 00</code>). The first answer's NAME is <code>C0 0C</code>, its TYPE is 5 (CNAME) and its RDATA is <code>C0 10</code>. What names do these pointers stand for?</p>",
          steps: [
            { tex: "\\text{C00C} \\,\\&\\, \\text{3FFF} = \\text{000C} = 12", why: "Clear the two flag bits to get the offset." },
            { text: "Offset 12 is the start of the question name: www.newtonschool.co.", why: "So the answer's owner name is the queried name." },
            { tex: "\\text{C010} \\,\\&\\, \\text{3FFF} = \\text{0010} = 16", why: "Same rule for the RDATA pointer." },
            { text: "Offset 16 = 12 + 1 + 3 skips the label 03 www, landing on 0c newtonschool 02 co 00: newtonschool.co.", why: "A pointer may point into the middle of an earlier name, reusing its suffix." }
          ],
          answer: "NAME = <b>www.newtonschool.co</b>, CNAME target = <b>newtonschool.co</b>. Each pointer replaces a full name with 2 bytes." },
        { type: "code", file: "Unit07_dns_packet.py", level: "low", title: "Build a query with struct, parse a compressed reply, run a mock authoritative UDP server with timeout/retry" },
        { type: "traps", items: [
            "The header is <b>12 bytes</b>; UDP adds 8 more, IPv4 20 more.",
            "QNAME carries no dots: \"www.amazon.com\" is 16 bytes on the wire, not 14 or 15.",
            "Use network byte order: <code>struct.pack('!HHHHHH', qid, flags, 1, 0, 0, 0)</code>; without '!' you get the host's (usually little-endian) order.",
            "AA = 0 in a reply is normal when the answer came from a cache.",
            "RCODE 3 (NXDOMAIN) is not the same as NOERROR with zero answers (NODATA).",
            "TC = 1 does not mean an error; it means \"retry over TCP\"."
          ] }
      ],
      practice: [
        { id: "u07-E-1", type: "num", tag: "University-Midsem-style", topic: "07.6",
          q: "<p>Size in <b>bytes</b> (integer) of the DNS query message (no EDNS) asking for the A record of <code>mail.ivetamakeup.com</code>?</p>",
          answer: 38, tol: 0, unit: "bytes", verify: "12 + len('mail.ivetamakeup.com') + 2 + 4",
          steps: [ { tex: "|QNAME| = 20 + 2 = 22", why: "\"mail.ivetamakeup.com\" has 20 characters; add 2 (one extra length byte and the zero byte)." },
                   { tex: "12 + 22 + 4 = 38\\,\\text{B}", why: "Header + QNAME + QTYPE/QCLASS." } ] },
        { id: "u07-E-2", type: "text", tag: "University-Midsem-style", topic: "07.6",
          q: "<p>Predict the exact output.</p>",
          code: "name = 'mail.ivetamakeup.com'\nwire = b''.join(bytes([len(p)]) + p.encode() for p in name.split('.')) + bytes([0])\nprint(len(wire), wire[0], wire[5])",
          answer: "22 4 11", runCheck: true,
          explain: "<p>wire = 04 'mail' 0b 'ivetamakeup' 03 'com' 00. Length 22; byte 0 is 4 (len of \"mail\"); byte 5 is 11 (len of \"ivetamakeup\"), right after the four letters of mail.</p>" },
        { id: "u07-E-3", type: "mcq", tag: "GATE-style", topic: "07.6",
          q: "<p>A reply has flags word <code>0x8183</code>. What happened?</p>",
          options: ["The query succeeded with an authoritative answer", "The name does not exist (NXDOMAIN); recursion was desired and available", "The reply was truncated", "The server refused the query"],
          answer: 1,
          why: ["AA would need bit 10 set (0x8583 or similar), and RCODE would be 0.", "Correct: 0x8183 = 1000 0001 1000 0011: QR = 1, RD = 1, RA = 1, RCODE = 3.", "TC is bit 9, which is 0 here.", "REFUSED is RCODE 5, not 3."],
          explain: "<p>Low nibble 3 = NXDOMAIN; 0x81 = QR + RD; 0x80 in the low byte = RA.</p>" },
        { id: "u07-E-4", type: "num", tag: "GATE-style", topic: "07.6",
          q: "<p>A name field contains the two bytes <code>C0 1A</code>. At what byte offset (decimal integer) from the start of the message does the referenced name begin?</p>",
          answer: 26, tol: 0, unit: "offset", verify: "0xC01A & 0x3FFF",
          steps: [ { tex: "\\text{0xC01A} \\,\\&\\, \\text{0x3FFF} = \\text{0x001A}", why: "The top two bits (11) only flag a pointer." }, { tex: "\\text{0x1A} = 16 + 10 = 26", why: "Convert hex to decimal." } ] },
        { id: "u07-E-5", type: "msq", tag: "University-Midsem-style", topic: "07.6",
          q: "<p>When does DNS use TCP port 53? (Select all that apply.)</p>",
          options: ["When a UDP reply came back with TC = 1", "For zone transfers (AXFR) between primary and secondary servers", "For every query from a browser", "When a response does not fit in the UDP size limit"],
          answer: [0, 1, 3],
          why: ["TC = 1 means retry over TCP.", "Zone transfers move whole zones and always use TCP.", "Ordinary queries use UDP.", "Same reason as TC: replies over 512 B (or over the EDNS size) go over TCP."],
          explain: "<p>UDP for normal queries; TCP for large replies and zone transfers.</p>" },
        { id: "u07-E-6", type: "mcq", tag: "University-Midsem-style", topic: "07.6",
          q: "<p>Bug hunt: this query builder produces a header that real DNS servers reject. Why?</p>",
          code: "import struct\nhdr = struct.pack('HHHHHH', 0x1234, 0x0100, 1, 0, 0, 0)\nprint(hdr.hex())",
          options: ["Six H fields are 14 bytes, not 12", "Without '!' (or '>') struct uses native byte order, which is little-endian on x86, so 0x1234 is sent as 34 12", "H is signed, so 0x1234 overflows", "The header must start with QDCOUNT"],
          answer: 1,
          why: ["6 × 2 = 12 bytes, which is correct.", "Correct: network byte order is big-endian; use '!HHHHHH'.", "H is unsigned 16-bit; 0x1234 fits.", "ID comes first, then flags, then the four counts."],
          explain: "<p>Always prefix network formats with '!'. The output here is 341200010100000000000000 on a little-endian machine.</p>" }
      ]
    },
    // ------------------------------------------------------------------ 07-F
    {
      id: "07-F",
      title: "AWS Route 53: Hosted Zones, Alias Records and Routing Policies",
      badge: "researched",
      source: "Amazon Route 53 Developer Guide (hosted zones, alias records, choosing a routing policy, health checks); WB-L08 p12, p32 (demo title card only)",
      covers: ["07.6"],
      blocks: [
        { type: "intuition", title: "A receptionist who picks the branch",
          html: "<p><b>Analogy.</b> A chain's phone receptionist does not serve you food; they only tell you <i>which branch</i> to go to: the nearest one, the one that is open, or a random one so the branches share the crowd. Route 53 is that receptionist for DNS.</p>" +
                "<p><b>Definition (AWS docs).</b> Amazon Route 53 is a highly available, scalable <b>authoritative DNS</b> service (named after port 53) that also offers domain registration and health checks. It is a <b>layer-7 (application-layer) service</b>: it only answers DNS queries. Traffic never flows through it, so it is not a load balancer in the data path; it steers clients by choosing which records to return. Records live in a <b>hosted zone</b> (public for the Internet, private for one or more VPCs). Each public hosted zone gets four Route 53 name servers (its NS record) and an SOA record.</p>" },
        { type: "callout", kind: "aws", title: "Demo (WB-L08 p12/p32): create DNS records in Route 53",
          html: "<ol><li>Route 53 console → <b>Hosted zones</b> → Create hosted zone → domain name (for example example.com), type <b>Public</b>.</li>" +
                "<li>Route 53 creates the <b>NS</b> record (four name servers) and the <b>SOA</b> record automatically.</li>" +
                "<li>At the domain's registrar, set the domain's name servers to those four NS values (this is the delegation from the TLD).</li>" +
                "<li><b>Create record</b>: record name (www), type (A, AAAA, CNAME, MX, TXT), value or <b>Alias</b> target, TTL, and a <b>routing policy</b>.</li>" +
                "<li>Test from a terminal: <code>nslookup www.example.com</code> or <code>dig www.example.com A</code>, and read the answer and its TTL.</li></ol>" },
        { type: "table", head: ["Policy", "How Route 53 chooses the answer", "Health checks", "Use it when", "Exam keyword"],
          rows: [
            ["<b>Simple</b>", "One record; if it has several values, all are returned in random order and the client picks", "No", "One resource serves the domain", "\"single web server\""],
            ["<b>Weighted</b>", "Several records with the same name; each gets a weight 0–255; record $i$ is returned with probability $w_i/\\sum w$", "Optional", "Canary or blue/green releases, A/B tests, splitting load by ratio", "\"send 10% of traffic\""],
            ["<b>Latency-based</b>", "Return the record in the AWS Region with the lowest measured network latency for the user", "Optional", "Multi-Region apps where speed matters", "\"lowest latency\", \"best performance\""],
            ["<b>Failover</b>", "Active-passive: return the primary while its health check passes, otherwise the secondary", "Required on the primary", "Disaster recovery, a static \"sorry\" site on S3", "\"active-passive\", \"DR\""],
            ["<b>Geolocation</b>", "Return the record for the user's continent, country or US state (most specific wins; add a Default record)", "Optional", "Content localisation, legal or licensing restrictions by country", "\"users in country X must\""],
            ["Geoproximity <i>(note)</i>", "Route by distance between user and resources, adjustable with a bias that grows or shrinks a region", "Optional", "Shift traffic gradually between Regions", "\"bias\""],
            ["Multivalue answer <i>(note)</i>", "Return up to 8 healthy records, chosen at random", "Yes, per record", "Simple client-side load spreading with health checks (not a load balancer)", "\"up to eight healthy\""],
            ["IP-based <i>(note)</i>", "Map the client's source IP CIDR blocks to answers", "Optional", "Route known ISP or corporate ranges to specific endpoints", "\"CIDR collection\""]
          ],
          caption: "Route 53 routing policies. The first five are the core exam set; the last three are listed for completeness." },
        { type: "callout", kind: "key", title: "Alias records vs CNAME",
          html: "<p>An <b>alias</b> record is a Route 53 extension that points a name to an AWS resource: an ALB/NLB, a CloudFront distribution, an S3 static-website bucket, an API Gateway endpoint, or another record in the same hosted zone. Unlike CNAME it <b>can be used at the zone apex</b> (example.com), Route 53 answers it with the target's current IP addresses (type A/AAAA), the TTL comes from the target, and queries to alias records that point at AWS resources are <b>not charged</b>.</p>" },
        { type: "callout", kind: "takeaway", title: "Health checks and failover speed",
          html: "<p>Route 53 health checkers probe an endpoint every <b>30 s</b> (standard) or <b>10 s</b> (fast) and mark it unhealthy after a failure threshold (default <b>3</b> consecutive failures). Even after Route 53 switches answers, clients that cached the old record keep using it until the record's TTL expires, so DNS failover time ≈ detection time + TTL. Short TTLs (for example 60 s) make failover faster but increase query volume.</p>" },
        { type: "derivation", title: "Weighted routing shares",
          steps: [
            { tex: "p_i = \\frac{w_i}{\\sum_j w_j}", why: "AWS docs: the probability of returning a record is its weight divided by the sum of weights of records with the same name and type." },
            { tex: "w = (70, 20, 10) \\Rightarrow \\sum w = 100", why: "Add the three weights." },
            { tex: "p = (0.70, 0.20, 0.10)", why: "Divide each weight by 100." },
            { tex: "E[N_i] = p_i \\times N", why: "Expected number of DNS answers pointing at record i among N queries." },
            { tex: "\\text{unhealthy } k: \\; p_i' = \\frac{w_i}{\\sum_{j \\ne k} w_j}", why: "With health checks, an unhealthy record is skipped and the rest share in proportion to their weights." }
          ] },
        { type: "cheat", items: [
            "Route 53 = authoritative DNS (L7) + registration + health checks; port 53; it never carries the traffic",
            "Simple · Weighted ($w_i/\\sum w$, 0–255) · Latency (lowest-latency Region) · Failover (primary/secondary) · Geolocation (country/continent + Default)",
            "Also: Geoproximity (bias), Multivalue (≤ 8 healthy), IP-based (CIDR)",
            "Weight 0 = never returned, unless every weight is 0 (then all are equal)",
            "Alias: apex allowed, AWS targets, no charge for alias queries to AWS resources",
            "Failover time ≈ health-check detection + TTL of cached answers"
          ] },
        { type: "worked", title: "Canary release with weighted records", tag: "University-Midsem-style",
          problem: "<p>Three weighted A records for <code>api.example.com</code>: blue (weight 70), green (20), canary (10), all with health checks. (a) Of 50,000 DNS queries, how many answers point at each? (b) The blue health check fails. What share does green now get?</p>",
          steps: [
            { tex: "\\sum w = 70 + 20 + 10 = 100", why: "Total weight." },
            { tex: "N_{blue} = \\frac{70}{100} \\times 50000 = 35000", why: "Expected answers for blue." },
            { tex: "N_{green} = 0.2 \\times 50000 = 10000, \\; N_{canary} = 0.1 \\times 50000 = 5000", why: "Same rule for the other two." },
            { tex: "p'_{green} = \\frac{20}{20 + 10} = \\frac{2}{3} \\approx 66.7\\%", why: "Blue is excluded; green and canary share in the ratio 20 : 10." }
          ],
          answer: "(a) blue <b>35,000</b>, green <b>10,000</b>, canary <b>5,000</b>; (b) green ≈ <b>66.7%</b>, canary ≈ 33.3%." },
        { type: "code", file: "Unit07_route53_policies.py", level: "low", title: "All routing policies simulated by hand (weighted sampling, geolocation fallback, multivalue, IP-based longest prefix)" },
        { type: "traps", items: [
            "Latency-based ≠ Geolocation: latency picks the fastest Region; geolocation picks by where the user is, even if another Region would be faster.",
            "Geolocation without a Default record returns no answer for users from unmatched locations.",
            "Multivalue answer is not a replacement for an ELB: it only returns several healthy IPs.",
            "Route 53 does not see or forward HTTP traffic; ALB is the layer-7 load balancer, Route 53 is layer-7 DNS.",
            "Failover is not instant: cached answers survive until their TTL expires.",
            "Weights are relative: 3 and 1 give the same split as 75 and 25."
          ] }
      ],
      practice: [
        { id: "u07-F-1", type: "mcq", tag: "University-Midsem-style", topic: "07.6",
          q: "<p>An app runs in ap-south-1 and eu-west-1. Every user should be sent to whichever Region gives them the fastest response. Which routing policy?</p>",
          options: ["Simple", "Weighted", "Latency-based", "Geolocation"], answer: 2,
          why: ["Simple cannot choose between Regions.", "Weighted splits by fixed ratios, ignoring speed.", "Correct: latency-based returns the Region with the lowest measured latency for the user.", "Geolocation routes by user location, which is not always the fastest path."],
          explain: "<p>Keyword \"fastest/lowest latency\" → latency-based.</p>" },
        { id: "u07-F-2", type: "mcq", tag: "University-Midsem-style", topic: "07.6",
          q: "<p>The main site runs on an ALB. If it goes down, users should see a static maintenance page hosted on S3. Which policy?</p>",
          options: ["Failover (primary = ALB, secondary = S3)", "Weighted 100/0", "Multivalue answer", "Geoproximity"], answer: 0,
          why: ["Correct: active-passive with a health check on the primary.", "Weight 0 means \"never\" unless all are 0; this does not react to failures by itself.", "Multivalue returns several healthy records together; it is not active-passive.", "Geoproximity routes by distance and bias, not by health."],
          explain: "<p>\"Active-passive\" or \"DR\" → failover routing.</p>" },
        { id: "u07-F-3", type: "mcq", tag: "University-Midsem-style", topic: "07.6",
          q: "<p>Because of licensing, users in India must get the India catalogue servers and everyone else the global servers. Which policy?</p>",
          options: ["Latency-based", "Geolocation with an India record and a Default record", "Simple", "Weighted"], answer: 1,
          why: ["Latency could send an Indian user elsewhere if that path were faster.", "Correct: geolocation matches the user's country; Default catches everyone else.", "Simple returns the same answer to everyone.", "Weighted splits randomly, ignoring location."],
          explain: "<p>Legal or licensing rules by country → geolocation.</p>" },
        { id: "u07-F-4", type: "num", tag: "University-Midsem-style", topic: "07.6",
          q: "<p>Two weighted records: stable (weight 200) and canary (weight 50). What percentage of DNS answers point at the canary? (in %, integer)</p>",
          answer: 20, tol: 0, unit: "%", verify: "50/(200+50)*100",
          formula: "p_i = \\frac{w_i}{\\sum w}",
          steps: [ { tex: "\\sum w = 200 + 50 = 250", why: "Total weight." }, { tex: "p = \\frac{50}{250} = 0.2 = 20\\%", why: "Canary's share." } ] },
        { id: "u07-F-5", type: "num", tag: "GATE-style", topic: "07.6",
          q: "<p>Weighted records A = 5, B = 3, C = 2, all health-checked. A becomes unhealthy. What percentage of answers now go to B? (in %, integer)</p>",
          answer: 60, tol: 0, unit: "%", verify: "3/(3+2)*100",
          steps: [ { tex: "\\sum_{healthy} w = 3 + 2 = 5", why: "A is excluded." }, { tex: "p_B = \\frac{3}{5} = 60\\%", why: "B's share of the remaining weight." } ] },
        { id: "u07-F-6", type: "msq", tag: "University-Midsem-style", topic: "07.6",
          q: "<p>Which statements about Route 53 are true? (Select all that apply.)</p>",
          options: ["It is an authoritative DNS service operating at the application layer", "All HTTP traffic for the site passes through Route 53", "An alias record can point the zone apex at an ALB", "Multivalue answer returns up to 8 healthy records"],
          answer: [0, 2, 3],
          why: ["Route 53 answers DNS queries (layer 7) and is authoritative for hosted zones.", "Route 53 only answers DNS; clients then connect directly to the returned IPs.", "Alias records work at the apex, unlike CNAME.", "AWS docs: up to eight healthy records per query."],
          explain: "<p>Route 53 steers with answers; it is never in the data path.</p>" }
      ]
    }
  ]
};
