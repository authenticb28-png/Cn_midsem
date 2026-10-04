// Unit 15: NAT, PAT, DHCP, Route Tables & Routing Algorithms (SL-L15, WB-L08 p128-132, Study Pack labs)
window.UNITS = window.UNITS || {};
window.UNITS["unit15"] = {
  id: "unit15", num: 15, day: 6,
  title: "NAT, PAT, DHCP, Route Tables & Routing Algorithms",
  lectures: "Lecture 15 · SL-L15 · WB-L08 p128–132 · Study Pack labs (DHCP relay, router-on-a-stick, Gaming LAN, Industrial, Static NAT)",
  overview: "<p>This unit is about how a host gets onto the Internet and how packets find their way once it is there. <b>DHCP</b> gives a new host its IP address, mask, gateway and DNS server in four messages (DORA, UDP 67/68). <b>NAT/PAT</b> lets a whole house share one public IP by rewriting the source IP and port. Every router then forwards with a <b>route table</b> using <b>longest-prefix match</b>, and in AWS one route (0.0.0.0/0 → IGW or → NAT GW) decides whether a subnet is public or private.</p>" +
            "<p>For the exam, practise these until they are automatic: the PAT translation table, the DORA addresses and ports, LPM done in binary, /29 = 6 usable for the static NAT lab, and the extra GATE topics (ARP, ICMP and traceroute, Bellman-Ford and Dijkstra tables, count-to-infinity, OSPF and BGP basics).</p>",
  sections: [
    // =====================================================================================
    {
      id: "15-A",
      title: "NAT & PAT: rewriting addresses at the border",
      badge: "class",
      source: "SL-L15 p4–12, p28–29; WB-L08 p128–132; RFC 3022; RFC 1918",
      covers: ["15.1", "15.2", "15.3", "15.4", "15.9"],
      blocks: [
        { type: "intuition", title: "One office phone number, many extensions",
          html: "<p><b>Analogy.</b> A company has one public phone number but 50 desk extensions. When extension 214 calls a customer, the switchboard places the call from the public number and writes in its log: <i>outgoing call to the customer came from ext. 214</i>. When the customer calls back, the switchboard checks the log and puts the call through to 214. The outside world only ever sees the public number. The home router does the same thing: the phone, the laptop and the TV all browse through <b>one</b> public IP from the ISP.</p>" +
                "<p><b>Definition (RFC 3022, Traditional NAT).</b> A NAT router sits on the border between a private realm and the public Internet. <b>Basic NAT</b> rewrites only the IP address (one private address ↔ one public address). <b>NAPT</b>, which the course and Cisco call <b>PAT (Port Address Translation)</b>, rewrites the IP address <i>and</i> the TCP/UDP port, so many private hosts can share a single public address. The private ranges it hides are the RFC 1918 blocks <b>10.0.0.0/8</b>, <b>172.16.0.0/12</b> and <b>192.168.0.0/16</b>. Internet routers do not route these blocks, so a packet must leave home with a public source address or its reply can never come back.</p>" +
                "<p><b>What NAT does (SL-L15 p6).</b> On the way <b>out</b>, the router swaps the private <b>source</b> IP for its public one. On the way <b>back</b>, it reverses the swap and puts the private IP into the <b>destination</b> field. <i>The reply only finds its way home because the router remembers the swap.</i></p>" },
        { type: "callout", kind: "slidefix", title: "SL-L15 p6: the phone has two different IPs (UNCLEAR B14)",
          html: "<p><b>Slide shows:</b> the small chain diagram labels the phone <b>192.168.0.14</b>, but the before/after header on the same slide uses SRC <b>192.168.1.20</b>.</p><p><b>Correct:</b> it is the same host, so it has one address. This unit uses <b>192.168.1.20</b> throughout because the PAT table on p10 uses it too. In an exam, the address in the packet header is the one that gets rewritten.</p>" },
        { type: "figure", caption: "SL-L15 p6 redrawn: only the source IP changes on the way out, and only the destination IP changes on the way back. The router keeps the mapping in its NAT table.",
          html: "<svg viewBox='0 0 640 250' width='100%' role='img' aria-label='NAT rewrite'>" +
                "<rect x='10' y='90' width='120' height='60' rx='8' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='70' y='115' text-anchor='middle' fill='currentColor' font-size='13'>Phone</text><text x='70' y='134' text-anchor='middle' fill='currentColor' font-size='12'>192.168.1.20</text>" +
                "<rect x='255' y='80' width='130' height='80' rx='8' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='320' y='105' text-anchor='middle' fill='currentColor' font-size='13'>NAT router</text><text x='320' y='124' text-anchor='middle' fill='var(--muted)' font-size='11'>inside 192.168.1.1</text><text x='320' y='141' text-anchor='middle' fill='var(--muted)' font-size='11'>outside 203.0.113.7</text>" +
                "<rect x='510' y='90' width='120' height='60' rx='8' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='570' y='115' text-anchor='middle' fill='currentColor' font-size='13'>Web server</text><text x='570' y='134' text-anchor='middle' fill='currentColor' font-size='12'>93.184.216.34</text>" +
                "<line x1='130' y1='120' x2='255' y2='120' stroke='var(--muted)' stroke-width='2'/><line x1='385' y1='120' x2='510' y2='120' stroke='var(--muted)' stroke-width='2'/>" +
                "<text x='192' y='30' text-anchor='middle' fill='currentColor' font-size='12'>OUT, before NAT</text><text x='192' y='48' text-anchor='middle' fill='var(--bad)' font-size='12'>SRC 192.168.1.20</text><text x='192' y='64' text-anchor='middle' fill='currentColor' font-size='12'>DST 93.184.216.34</text>" +
                "<text x='448' y='30' text-anchor='middle' fill='currentColor' font-size='12'>OUT, after NAT</text><text x='448' y='48' text-anchor='middle' fill='var(--ok)' font-size='12'>SRC 203.0.113.7</text><text x='448' y='64' text-anchor='middle' fill='currentColor' font-size='12'>DST 93.184.216.34</text>" +
                "<text x='448' y='190' text-anchor='middle' fill='currentColor' font-size='12'>BACK, before NAT</text><text x='448' y='208' text-anchor='middle' fill='currentColor' font-size='12'>SRC 93.184.216.34</text><text x='448' y='224' text-anchor='middle' fill='var(--ok)' font-size='12'>DST 203.0.113.7</text>" +
                "<text x='192' y='190' text-anchor='middle' fill='currentColor' font-size='12'>BACK, after NAT</text><text x='192' y='208' text-anchor='middle' fill='currentColor' font-size='12'>SRC 93.184.216.34</text><text x='192' y='224' text-anchor='middle' fill='var(--bad)' font-size='12'>DST 192.168.1.20</text>" +
                "</svg>" },
        { type: "table", head: ["Leg", "Source IP:port", "Destination IP:port", "What the NAT box changed"],
          rows: [
            ["1. Leaves the phone", "192.168.1.20:51000", "93.184.216.34:443", "nothing yet"],
            ["2. Leaves the router (WAN side)", "<b>203.0.113.7:40001</b>", "93.184.216.34:443", "source IP and source port, then the IPv4 header checksum and the TCP checksum (the TCP checksum covers a pseudo-header that contains the IPs); TTL is decremented as at any router"],
            ["3. Reply arrives at the router", "93.184.216.34:443", "203.0.113.7:40001", "nothing yet: the router looks up outside port 40001 in its table"],
            ["4. Reply delivered on the LAN", "93.184.216.34:443", "<b>192.168.1.20:51000</b>", "destination IP and destination port, then both checksums"] ],
          caption: "Before/after header fields for one HTTPS flow (values from SL-L15 p6 and p10). Outbound rewrites the SOURCE fields; inbound rewrites the DESTINATION fields." },
        { type: "text",
          html: "<p><b>Why plain NAT is not enough (SL-L15 p7).</b> Ten home devices share one ISP address, 203.0.113.7. If the router rewrites only IP addresses, two hosts that open the same website produce identical outside rows, so the router cannot tell the replies apart:</p>" },
        { type: "table", head: ["Inside (private)", "Outside (public)", "Destination"],
          rows: [ ["192.168.1.20", "203.0.113.7", "93.184.216.34:443"], ["192.168.1.21", "203.0.113.7", "93.184.216.34:443"] ],
          caption: "SL-L15 p7: two rows that look the same from outside. A reply to 203.0.113.7 from 93.184.216.34:443 matches both rows. This is why the port is added." },
        { type: "table", head: ["Inside (private)", "Outside (public)", "Destination"],
          rows: [
            ["192.168.1.20:<span style='color:var(--bad)'>51000</span>", "203.0.113.7:<span style='color:var(--ok)'>40001</span>", "93.184.216.34:443"],
            ["192.168.1.21:<span style='color:var(--bad)'>51000</span>", "203.0.113.7:<span style='color:var(--ok)'>40002</span>", "93.184.216.34:443"],
            ["192.168.1.35:49876", "203.0.113.7:<span style='color:var(--ok)'>40003</span>", "142.250.72.14:443"] ],
          caption: "SL-L15 p10, the PAT translation table (p9 cuts the third port off at ':4000'; p10 confirms it is :40003). Two hosts reused inside port 51000, so the outside port is the key that routes each reply home." },
        { type: "callout", kind: "key", title: "Same public IP, a different port each: that is the whole trick (SL-L15 p9)",
          html: "<p>Every mapping must be unique on the outside: the pair (public IP, outside port) can belong to only one inside socket at a time. When a reply arrives for 203.0.113.7:40002, the router looks up <b>40002</b>, finds 192.168.1.21:51000, rewrites the destination and forwards it. A packet for an outside port that has no entry (for example :40004) matches nothing and is <b>dropped</b>. This is why inbound connections fail by default behind NAT.</p><p><b>Slide quiz (p12).</b> <i>Two laptops behind one home IP both open the same website. What field lets the NAT box tell their replies apart?</i> <b>The port number. That is PAT.</b></p>" },
        { type: "table", head: ["We gain (SL-L15 p11)", "We break (SL-L15 p11)"],
          rows: [
            ["<b>Conserves scarce public IPv4 addresses</b>: one address for a whole house or office.", "<b>End-to-end reachability is gone</b>: an outside host cannot start a connection to 192.168.1.20 because no mapping exists until the inside host sends first."],
            ["<b>Hides internal hosts</b>, a security side-effect: outsiders see only 203.0.113.7 and cannot scan the LAN.", "<b>Inbound needs explicit setup</b>: a static NAT entry or port forwarding (for example 203.0.113.7:8080 → 192.168.1.50:80)."],
            ["Change ISP without renumbering the LAN: only the router's outside address changes.", "Researched (Kurose &amp; Ross §4.3.4): a router is meant to work at layer 3, but PAT rewrites layer-4 ports. Protocols that carry IP addresses inside the payload (active-mode FTP, SIP) need helper code (an ALG), and peer-to-peer apps need relays or hole punching."],
            ["Up to about 64,000 simultaneous flows per public IP per transport protocol.", "IPv6 (the next-but-one lecture, p31) is the long-term fix: enough addresses for every device, so translation is not needed."] ],
          caption: "NAT trade-offs. Rows 1–2 are from the slide; rows 3–4 add standard textbook points." },
        { type: "callout", kind: "slidefix", title: "WB-L08 p86 / p129: one-to-one NAT drawn inside the PAT section (UNCLEAR B27)",
          html: "<p><b>Slide shows:</b> under the heading <i>Port Address Translation</i>, a table that maps 192.168.0.1–.4 to 200.200.200.1–.4, one public IP per host, with no ports.</p><p><b>Correct:</b> that is <b>one-to-one (static) NAT</b>, not PAT. One-to-one NAT needs as many public IPs as inside hosts and never looks at ports. PAT shares <b>one</b> public IP and tells flows apart by port. The table is a useful <i>contrast</i> to PAT, but it is not an example of it.</p>" },
        { type: "table", head: ["Inside local IP (private)", "Inside global IP (public)"],
          rows: [ ["192.168.0.1", "200.200.200.1"], ["192.168.0.2", "200.200.200.2"], ["192.168.0.3", "200.200.200.3"], ["192.168.0.4", "200.200.200.4"] ],
          caption: "WB-L08 p129 one-to-one NAT table. Cisco vocabulary: inside local = the inside host's address as seen inside; inside global = the same host as seen from the Internet; outside local and outside global = the remote host's address (equal unless the destination is also translated)." },
        { type: "table", head: ["", "Static (one-to-one) NAT", "Dynamic NAT", "PAT / NAPT (overload)"],
          rows: [
            ["Mapping", "fixed private IP ↔ public IP, configured by hand", "private IP ↔ next free IP from a public pool, created on demand", "private IP:port ↔ one public IP:unique port"],
            ["Public IPs for N hosts", "N", "as many as the number of hosts online at the same time", "1 (or a few)"],
            ["Inbound connections from outside", "yes, always (this is how servers are published)", "only while a mapping exists", "no, unless port forwarding is added"],
            ["Looks at ports?", "no", "no", "yes"],
            ["Where you met it", "WB-L08 p129; Static NAT lab (100.1.1.3–.5)", "not in the course (standard IOS feature)", "SL-L15 p9–10; WB-L08 p130–132; every home router; AWS NAT gateway"] ],
          caption: "The three NAT flavours. The exam usually asks you to tell PAT from one-to-one NAT." },
        { type: "callout", kind: "practice", title: "Fill-in drill: the missing Smart TV ports (WB-L08 p87 / p130, UNCLEAR A)",
          html: "<p>The slide's home network maps Laptop 192.168.0.2:<b>4567</b> → 203.0.113.5:<b>62001</b> and Mobile 192.168.0.3:<b>4568</b> → 203.0.113.5:<b>62002</b>. The <b>Smart TV row 192.168.0.4 → 203.0.113.5 has no port numbers</b> in the source image. Assume the TV opens a flow from inside port <b>4569</b> and the router allocates outside ports one after another. Fill in the row before checking practice question u15-A-4.</p><p>Also from the same deck (p89/p132), a router that shows only port numbers: 192.168.0.2:1234 → 45000 → Server A; 192.168.0.3:3000 → 45001 → Server B; 192.168.0.4:203 → 45002 → Server C. Each outgoing request gets its own outside port.</p>" },
        { type: "derivation", title: "How many flows can one public IP carry?",
          steps: [
            { tex: "\\text{port field} = 16\\ \\text{bits} \\Rightarrow 2^{16} = 65536\\ \\text{values (0 to 65535)}", why: "TCP and UDP ports are 16-bit fields, so the outside port can take 65,536 values." },
            { tex: "65536 - 1024 = 64512", why: "Well-known ports 0–1023 are not handed out as outside ports, which leaves 1024–65535." },
            { tex: "\\text{flows per public IP per protocol} \\approx 64512", why: "Each outbound flow needs its own outside port, and TCP and UDP each have their own port space." },
            { tex: "k\\ \\text{public IPs} \\Rightarrow k \\times 64512", why: "A PAT pool with k addresses multiplies the space. For example, 2 IPs give 129,024." },
            { tex: "\\text{one-to-one NAT: } N\\ \\text{hosts} \\Rightarrow N\\ \\text{public IPs}", why: "Static NAT never shares an address, so it does not save any public addresses." } ] },
        { type: "cheat", title: "NAT / PAT",
          items: [ "Outbound: rewrite <b>source</b> IP (and port for PAT). Inbound reply: rewrite <b>destination</b> IP (and port). Recompute the IP header checksum and the TCP/UDP checksum.",
                   "PAT key for replies = <b>outside port</b> on the shared public IP. It must be unique, even when two inside hosts use the same inside port (51000 on SL-L15 p10).",
                   "SL-L15 p10: .20:51000 → 203.0.113.7:40001; .21:51000 → :40002; .35:49876 → :40003 (to 142.250.72.14:443).",
                   "No table entry for the destination port of an inbound packet → it is dropped. Inbound needs static NAT or port forwarding.",
                   "Static NAT = one-to-one, needs N public IPs, allows inbound connections. PAT = many-to-one, saves addresses, outbound only.",
                   "About 64,512 simultaneous mappings per public IP per protocol (ports 1024–65535).",
                   "RFC 1918 private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16." ] },
        { type: "worked", title: "Be the NAT box, then break it (SL-L15 p28–29)", tag: "University-Midsem-style",
          problem: "<p>Class activity, done on paper. The NAT router owns 203.0.113.7 and hands out outside ports starting at 40001. Four inside hosts send, in this order:</p><ol><li>A = 192.168.1.20:51000 → 93.184.216.34:443</li><li>B = 192.168.1.21:51000 → 93.184.216.34:443</li><li>C = 192.168.1.35:49876 → 142.250.72.14:443</li><li>D = 192.168.1.40:51000 → 142.250.72.14:443</li></ol><p>(a) Fill in the translation table. (b) A reply from 142.250.72.14:443 arrives for 203.0.113.7:40004. Where does it go? (c) <b>The twist:</b> a lazy NAT student just keeps each inside port as the outside port. What goes wrong?</p>",
          steps: [
            { text: "A is the first flow, so it gets outside port 40001: 192.168.1.20:51000 ↔ 203.0.113.7:40001.", why: "The allocator starts at 40001." },
            { text: "B uses the same inside port 51000 but must get a new outside port: 192.168.1.21:51000 ↔ 203.0.113.7:40002.", why: "The outside port must be unique. The inside port does not matter." },
            { text: "C gets 192.168.1.35:49876 ↔ 203.0.113.7:40003. D gets 192.168.1.40:51000 ↔ 203.0.113.7:40004.", why: "Ports are given out one after another, and each new flow takes the next free one." },
            { text: "(b) Look up outside port 40004 → D. Rewrite the destination to 192.168.1.40:51000 and forward on the LAN.", why: "Replies are routed home using only the table, keyed on the outside port." },
            { text: "(c) With inside port = outside port, A, B and D are all 203.0.113.7:51000. Each new entry overwrites the old one (or the table holds three rows with the same key). A reply from 93.184.216.34:443 to :51000 could belong to A or B, so one of them gets the other's data or nothing.", why: "This is a port collision. Every mapping must be unique, which is why real PAT allocates the outside port itself." } ],
          answer: "<b>(a)</b> A→:40001, B→:40002, C→:40003, D→:40004. <b>(b)</b> 192.168.1.40:51000 (host D). <b>(c)</b> Collision on outside port 51000, so replies are misdelivered or lost. Every mapping must be unique. The same logic runs inside the AWS NAT gateway." },
        { type: "code", file: "Unit15_pat_nat.py", level: "low", title: "PAT translator with a collision-free port allocator, IPv4 header rewrite and checksum fix",
          note: "Replays SL-L15 p10 and asserts ports 40001–40003. Shows the broken 'keep the inside port' NAT misdelivering a reply, then builds the one-to-one table and the static NAT lab table." },
        { type: "traps",
          items: [ "NAT changes the <b>source</b> on the way out and the <b>destination</b> on the way back. It never changes the destination of an outbound packet.",
                   "Two inside hosts may use the <b>same inside port</b> (51000 on p10). That is legal. Only the outside port must be unique.",
                   "One-to-one NAT (WB-L08 p129) is <b>not</b> PAT: it uses no ports and needs one public IP per host.",
                   "NAT is not a firewall. Hiding hosts is a side-effect, and a static NAT entry exposes the server completely.",
                   "After changing the IP, the router must also fix the <b>TCP/UDP checksum</b>, because the pseudo-header includes the IP addresses.",
                   "A destination port of 443 does not make the flow unique: many hosts talk to 443 at the same time." ] }
      ],
      practice: [
        { id: "u15-A-1", type: "mcq", tag: "University-Midsem-style", topic: "15.2",
          q: "<p>(SL-L15 p12) Two laptops behind one home IP both open the same website. Which field lets the NAT box tell their replies apart?</p>",
          options: ["The destination IP address of the reply", "The port number (the outside port the router assigned)", "The TTL of the reply", "The source MAC address of the reply"], answer: 1,
          why: ["Both replies come to the same public IP, 203.0.113.7, so the destination IP cannot separate them.", "Correct. Each flow got its own outside port (for example 40001 and 40002), and the reply's destination port picks the inside host. That is PAT.", "TTL counts hops. It does not identify a flow.", "The source MAC on the WAN side is the ISP router's MAC for every reply."],
          explain: "<p>PAT keys its table on the outside port. Without ports (SL-L15 p7), the two rows would look identical from outside.</p>" },
        { id: "u15-A-2", type: "msq", tag: "GATE-style", topic: "15.1",
          q: "<p>A PAT router forwards an <b>outbound</b> TCP segment from 192.168.1.20:51000 to 93.184.216.34:443. Which header fields does it change? (Select all that apply.)</p>",
          options: ["Source IP address", "Destination IP address", "Source port", "IPv4 header checksum", "TCP checksum", "Destination port"], answer: [0, 2, 3, 4],
          why: ["Rewritten to the public IP 203.0.113.7.", "The server's address stays 93.184.216.34 on the way out.", "Rewritten to a unique outside port such as 40001.", "The header changed, so its checksum must be recomputed.", "The TCP checksum covers a pseudo-header with both IPs as well as the ports, so it must be updated.", "443 is the server's port and stays unchanged on the way out."],
          explain: "<p>Outbound: source IP, source port and both checksums change (the TTL also drops by 1, as at any router). Inbound replies have the destination fields rewritten instead.</p>" },
        { id: "u15-A-3", type: "num", tag: "GATE-style", topic: "15.2",
          q: "<p>A PAT router has <b>2</b> public IPv4 addresses and hands out outside ports 1024–65535 only. What is the largest number of simultaneous <b>TCP</b> flows it can translate? (Integer.)</p>",
          answer: 129024, tol: 0, unit: "flows", verify: "2*(65535-1024+1)",
          formula: "\\text{flows} = k \\times (65535 - 1024 + 1)",
          steps: [ { tex: "65535 - 1024 + 1 = 64512", why: "Count the ports in the range, including both ends." },
                   { tex: "2 \\times 64512 = 129024", why: "Each public IP has its own independent port space." } ],
          explain: "<p>129,024 flows. UDP would have another, separate 129,024.</p>" },
        { id: "u15-A-4", type: "text", tag: "University-Midsem-style", topic: "15.2",
          q: "<p><b>Smart TV drill (WB-L08 p130).</b> The mapping table shows 192.168.0.2:4567 → 203.0.113.5:62001 and 192.168.0.3:4568 → 203.0.113.5:62002. The Smart TV 192.168.0.4 now opens a flow from inside port 4569, and the router allocates outside ports in sequence. Write the TV's public socket as <code>IP:port</code>.</p>",
          answer: "203.0.113.5:62003", accept: ["203.0.113.5 : 62003"],
          explain: "<p>The public IP is shared (203.0.113.5). The next unused outside port after 62002 is <b>62003</b>. The slide image leaves these ports out (UNCLEAR A). Any free port would be valid, but sequential allocation gives 62003.</p>" },
        { id: "u15-A-5", type: "mcq", tag: "University-Midsem-style", topic: "15.4",
          q: "<p>WB-L08 p129 maps 192.168.0.1–.4 to 200.200.200.1–.4. Which statement is correct?</p>",
          options: ["It is PAT, because four hosts share the router", "It is one-to-one (static) NAT: each host needs its own public IP and ports are not translated", "It is dynamic NAT, because the table could change at any moment", "It is not NAT, because 200.200.200.x is a private range"], answer: 1,
          why: ["PAT shares one public IP and uses ports. Here every host has its own public IP.", "Correct. Inside local ↔ inside global, one-to-one. This is the slide error B27: it sits under the PAT heading.", "The slide shows a fixed table, the classic static mapping.", "200.200.200.0/24 is not in any RFC 1918 block."],
          explain: "<p>One-to-one NAT saves no addresses: 4 hosts need 4 public IPs. PAT would need 1.</p>" },
        { id: "u15-A-6", type: "mcq", tag: "GATE-style", topic: "15.3",
          q: "<p>Using the SL-L15 p10 table, a TCP SYN arrives from the Internet for 203.0.113.7:40004, and no host inside has sent anything to that source. What does the PAT router do?</p>",
          options: ["Forwards it to 192.168.1.20, the first entry", "Broadcasts it on the LAN", "Drops it, because no mapping exists for outside port 40004", "Creates a new mapping to the least-loaded inside host"], answer: 2,
          why: ["Replies are matched by outside port, not by position in the table.", "Routers do not flood unknown packets onto the LAN.", "Correct. This is 'end-to-end reachability is gone' (p11): inbound needs explicit setup.", "PAT creates mappings only for outbound flows (or ones configured by hand)."],
          explain: "<p>Unsolicited inbound traffic has no entry, so it is dropped. Port forwarding or static NAT would be needed to accept it.</p>" },
        { id: "u15-A-7", type: "text", tag: "University-Midsem-style", topic: "15.2", runCheck: true,
          q: "<p>Predict the exact output of this tiny PAT table.</p>",
          code: "table = {}\nnext_port = 40001\nflows = [('192.168.1.20', 51000), ('192.168.1.21', 51000), ('192.168.1.20', 51000)]\nfor f in flows:\n    if f not in table:\n        table[f] = next_port\n        next_port += 1\nprint(len(table), table[('192.168.1.21', 51000)], next_port)",
          answer: "2 40002 40003",
          explain: "<p>The third flow repeats the first, so it reuses mapping 40001. Two entries exist, .21 got 40002, and the next free port is 40003.</p>" },
        { id: "u15-A-8", type: "mcq", tag: "University-Midsem-style", topic: "15.9",
          q: "<p>Bug hunt: this NAT stores replies by <b>inside</b> port. Which classroom scenario breaks it?</p>",
          code: "back = {}\ndef outbound(inside_ip, inside_port):\n    back[inside_port] = inside_ip      # reply lookup table\n    return ('203.0.113.7', inside_port) # keep the same port outside\n\ndef inbound(dst_port):\n    return back.get(dst_port)",
          options: ["Two hosts using different inside ports", "Two hosts using the same inside port 51000 at the same time", "One host opening a single connection", "A reply arriving for a port that is not in the table"], answer: 1,
          why: ["Different ports give different keys, so it works.", "Correct. The second call overwrites back[51000], so the first host's replies go to the second host: the port collision from 'Be the NAT box'.", "One mapping cannot collide with itself.", "That returns None (dropped), which is correct behaviour."],
          explain: "<p>Fix: allocate a fresh unique outside port per flow and key the reverse table on that port.</p>" }
      ]
    }
    // =====================================================================================
    ,{
      id: "15-B",
      title: "DHCP: lease contents, DORA, UDP 67/68, renewal, relay & APIPA",
      badge: "class",
      source: "SL-L15 p13–16; RFC 2131; RFC 2132; RFC 3927 (APIPA); Study Pack labs A1 and A5",
      covers: ["15.5", "15.15"],
      blocks: [
        { type: "intuition", title: "Checking into a hotel with no name badge",
          html: "<p><b>Analogy.</b> You walk into a hotel lobby with no room and no name badge. You shout <i>\"Is there a receptionist?\"</i> (<b>Discover</b>, a broadcast, because you don't know who to ask). A receptionist answers <i>\"Room 100 is free for 24 hours\"</i> (<b>Offer</b>). You call out loudly <i>\"I'll take room 100 from that receptionist\"</i> (<b>Request</b>, broadcast so that any other receptionist who offered a room can release it). The receptionist hands you the key card, valid for 24 hours (<b>Ack</b>). Halfway through your stay you ask the same receptionist to extend it (<b>renewal at T1</b>).</p>" +
                "<p><b>Definition (RFC 2131).</b> DHCP (Dynamic Host Configuration Protocol) is a client–server protocol over <b>UDP</b>. The <b>server listens on port 67</b> and the <b>client on port 68</b>. It <i>leases</i> an IP address for a limited time, together with configuration options. SL-L15 p14: <i>Nobody types IP settings by hand. One DHCP lease delivers four things at once:</i> <b>1 IP address, 2 subnet mask, 3 default gateway, 4 DNS server</b>. <i>A lease expires, so addresses get renewed and recycled over time.</i></p>" },
        { type: "table", head: ["#", "Lease item (SL-L15 p14)", "Where it travels in the DHCP message", "Example (lab A5 Gaming LAN)"],
          rows: [
            ["1", "IP address", "<code>yiaddr</code> field (\"your\" IP address) of the OFFER and ACK", "192.168.10.2"],
            ["2", "Subnet mask", "option 1", "255.255.255.0"],
            ["3", "Default gateway", "option 3 (Router), set by <code>default-router</code> in IOS", "192.168.10.1"],
            ["4", "DNS server", "option 6, set by <code>dns-server</code> in IOS", "192.168.10.1"],
            ["+", "Lease time (researched)", "option 51, in seconds; T1/T2 are options 58/59, or default to 50% and 87.5% of it", "86400 s = 24 h (IOS default 1 day)"],
            ["+", "Which server (researched)", "option 54 Server Identifier", "192.168.10.1"] ],
          caption: "What a DHCP lease contains. The first four rows are the slide's 'four things'. The option numbers are from RFC 2132." },
        { type: "seq", left: "Client 00:1a:2b:3c:4d:5e (UDP 68)", right: "DHCP server 192.168.1.1 (UDP 67)",
          caption: "DORA, then renewal. The offered address 192.168.1.100 is an example; SL-L15 p16 only says it 'comes from a Lecture 14 subnet range'. Researched details (ports, flag, T1) follow RFC 2131.",
          events: [
            { from: "L", label: "DHCPDISCOVER 0.0.0.0:68 → 255.255.255.255:67", note: "broadcast; Ethernet dst ff:ff:ff:ff:ff:ff; xid chosen by client" },
            { from: "R", label: "DHCPOFFER yiaddr 192.168.1.100, lease 86400 s", note: "to 255.255.255.255:68 if broadcast flag = 1, else unicast to 192.168.1.100" },
            { from: "L", label: "DHCPREQUEST 0.0.0.0:68 → 255.255.255.255:67", note: "broadcast; opt 50 = 192.168.1.100, opt 54 = 192.168.1.1" },
            { from: "R", label: "DHCPACK 192.168.1.1:67 → client:68", note: "lease confirmed; broadcast or unicast, same rule as OFFER" },
            { from: "L", label: "", gap: true, note: "client uses 192.168.1.100; at T1 = 50% of lease (12 h) it renews" },
            { from: "L", label: "DHCPREQUEST 192.168.1.100:68 → 192.168.1.1:67", note: "RENEWING: unicast to the server that granted the lease" },
            { from: "R", label: "DHCPACK (lease extended to a fresh 24 h)", note: "if no ACK by T2 = 87.5%, the client broadcasts a REQUEST to any server" } ] },
        { type: "table", head: ["No.", "Source", "Destination", "Proto", "Info", "UDP ports (researched)"],
          rows: [
            ["1", "0.0.0.0", "255.255.255.255", "DHCP", "DHCP Discover", "68 → 67"],
            ["2", "192.168.1.1", "255.255.255.255", "DHCP", "DHCP Offer", "67 → 68"],
            ["3", "0.0.0.0", "255.255.255.255", "DHCP", "DHCP Request", "68 → 67"],
            ["4", "192.168.1.1", "255.255.255.255", "DHCP", "DHCP Ack", "67 → 68"] ],
          caption: "SL-L15 p16 capture 'dhcp-capture.pcapng'. The deck never shows the ports. They are added from RFC 2131 (server 67, client 68)." },
        { type: "callout", kind: "slidefix", title: "SL-L15 p15–16: which DORA messages are broadcast? (UNCLEAR B12)",
          html: "<p><b>Slide says:</b> \"Discover and Request are broadcasts\" and \"Discover and Request go to 255.255.255.255\". Yet the slide's own capture shows <b>all four</b> frames (Offer and Ack too) sent to 255.255.255.255.</p><p><b>Correct (RFC 2131 §4.1):</b> <b>Discover and Request are always broadcast</b> by a client that has no address yet. <b>Offer and Ack are broadcast or unicast depending on the client's BROADCAST flag</b> (the top bit of the 16-bit <code>flags</code> field). If the flag is 1, the server sends them to 255.255.255.255. If it is 0, the server unicasts them to the offered address (<code>yiaddr</code>) and the client's MAC. Many clients (Windows, the lab simulator) set the flag, which is why the capture shows four broadcasts. A relayed reply goes to the relay agent instead.</p>" },
        { type: "packet", title: "DHCP / BOOTP message: fixed fields up to chaddr (RFC 2131 §2)", width: 32,
          fields: [
            { name: "op", bits: 8, note: "1 = BOOTREQUEST (client→server), 2 = BOOTREPLY" },
            { name: "htype", bits: 8, note: "1 = Ethernet" },
            { name: "hlen", bits: 8, note: "6 = MAC length in bytes" },
            { name: "hops", bits: 8, note: "0 from the client; each relay agent adds 1" },
            { name: "xid (transaction ID)", bits: 32, note: "random number picked by the client and echoed in every reply, so the client can match them" },
            { name: "secs", bits: 16, note: "seconds since the client started" },
            { name: "flags", bits: 16, note: "top bit = BROADCAST (0x8000); other 15 bits must be 0" },
            { name: "ciaddr", bits: 32, note: "client IP; 0.0.0.0 in DISCOVER, filled when renewing" },
            { name: "yiaddr", bits: 32, note: "'your' IP: the address being offered or acknowledged" },
            { name: "siaddr", bits: 32, note: "next server IP (for network boot)" },
            { name: "giaddr", bits: 32, note: "relay agent IP; 0 unless relayed. The server uses it to pick the pool" },
            { name: "chaddr", bits: 128, note: "client hardware address: 6-byte MAC + 10 bytes of zeros" } ],
          caption: "44 bytes so far. Then come sname (64 B), file (128 B), the magic cookie (4 B) and the options (see the table below). The packet layout must match struct format '!BBBBIHHIIII16s64s128s'." },
        { type: "table", head: ["Bytes", "Field", "Size", "DISCOVER value"],
          rows: [
            ["0–43", "op through chaddr (diagram above)", "44 B", "01 01 06 00, xid, 0, flags 0x8000, four zero addresses, MAC"],
            ["44–107", "sname (server host name)", "64 B", "all zero"],
            ["108–235", "file (boot file name)", "128 B", "all zero"],
            ["236–239", "magic cookie", "4 B", "<b>0x63825363</b> = 99.130.83.99, means 'DHCP options follow'"],
            ["240–242", "option 53 DHCP Message Type", "3 B (code, len 1, value)", "1 = DISCOVER (2 OFFER, 3 REQUEST, 4 DECLINE, 5 ACK, 6 NAK, 7 RELEASE, 8 INFORM)"],
            ["243–248", "option 55 Parameter Request List", "2 + n B", "1 (mask), 3 (router), 6 (DNS), 51 (lease time): n = 4"],
            ["249", "option 255 End", "1 B", "ff"] ],
          caption: "The rest of the message. With no padding the message is 250 bytes. BOOTP-compatible clients pad with option 0 to 300 bytes." },
        { type: "derivation", title: "Message size and lease timers",
          steps: [
            { tex: "4 \\times 1 + 4 + 2 + 2 + 4 \\times 4 + 16 = 44\\ \\text{B}", why: "op, htype, hlen, hops (1 byte each); xid 4; secs 2; flags 2; four addresses 4 bytes each; chaddr 16." },
            { tex: "44 + 64 + 128 = 236\\ \\text{B}", why: "Add sname and file: this is the fixed BOOTP header." },
            { tex: "236 + 4 + (3 + 6 + 1) = 250\\ \\text{B}", why: "Magic cookie, then option 53 (3 B), option 55 with 4 codes (2 + 4 = 6 B), and End (1 B)." },
            { tex: "300 + 8 + 20 = 328\\ \\text{B}", why: "Padded to 300 B, then the UDP header (8) and IPv4 header (20) are added." },
            { tex: "T_1 = 0.5 \\times L, \\quad T_2 = 0.875 \\times L", why: "RFC 2131 §4.4.5 default renewal (T1) and rebinding (T2) times for a lease of length L." },
            { tex: "L = 24\\,\\text{h} \\Rightarrow T_1 = 12\\,\\text{h},\\ T_2 = 21\\,\\text{h}", why: "0.5 × 24 = 12 and 0.875 × 24 = 21." } ] },
        { type: "table", head: ["Time since lease granted", "Client state (RFC 2131)", "What it sends"],
          rows: [
            ["0 to T1 (0–50%)", "BOUND", "nothing; uses the address"],
            ["T1 (50%)", "RENEWING", "<b>unicast</b> DHCPREQUEST to the server that granted the lease (ciaddr = its IP)"],
            ["T2 (87.5%)", "REBINDING", "<b>broadcast</b> DHCPREQUEST: any server may extend the lease"],
            ["L (100%)", "INIT", "lease expired: stop using the address and start again with DISCOVER"],
            ["any time", "(leaving)", "DHCPRELEASE gives the address back early. DHCPDECLINE is sent if the offered address is found already in use (the client checks with ARP). The server answers NAK if a requested address is wrong for the subnet."] ],
          caption: "Lease life cycle: why 'addresses get renewed and recycled' (SL-L15 p14)." },
        { type: "figure", caption: "DHCP relay (Study Pack lab A1). DORA broadcasts stop at a router, so Router0 Gi0/1 relays them as unicast to the server address in ip helper-address. It writes its own interface IP into giaddr, and the server uses giaddr to choose the pool.",
          html: "<svg viewBox='0 0 640 230' width='100%' role='img' aria-label='DHCP relay'>" +
                "<rect x='10' y='150' width='120' height='54' rx='8' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='70' y='173' text-anchor='middle' fill='currentColor' font-size='12'>PC2 (LAN-B)</text><text x='70' y='191' text-anchor='middle' fill='var(--muted)' font-size='11'>no IP yet</text>" +
                "<rect x='240' y='60' width='170' height='110' rx='8' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='325' y='84' text-anchor='middle' fill='currentColor' font-size='13'>Router0</text><text x='325' y='104' text-anchor='middle' fill='var(--muted)' font-size='11'>Gi0/0 10.0.1.1 (DHCP server)</text><text x='325' y='122' text-anchor='middle' fill='var(--muted)' font-size='11'>Gi0/1 10.0.2.1</text><text x='325' y='140' text-anchor='middle' fill='var(--muted)' font-size='11'>ip helper-address 10.0.1.1</text>" +
                "<rect x='500' y='20' width='130' height='54' rx='8' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='565' y='43' text-anchor='middle' fill='currentColor' font-size='12'>LAN-A 10.0.1.0/24</text><text x='565' y='61' text-anchor='middle' fill='var(--muted)' font-size='11'>PC0, PC1, Server0</text>" +
                "<line x1='130' y1='177' x2='240' y2='140' stroke='var(--muted)' stroke-width='2'/><line x1='410' y1='90' x2='500' y2='50' stroke='var(--muted)' stroke-width='2'/>" +
                "<text x='150' y='215' fill='var(--bad)' font-size='11'>1. DISCOVER 0.0.0.0:68 → 255.255.255.255:67</text>" +
                "<text x='420' y='150' fill='var(--ok)' font-size='11'>2. relay sets giaddr = 10.0.2.1,</text><text x='420' y='166' fill='var(--ok)' font-size='11'>hops = 1, sends to 10.0.1.1:67</text>" +
                "<text x='420' y='190' fill='currentColor' font-size='11'>3. server: giaddr is in 10.0.2.0/24,</text><text x='420' y='206' fill='currentColor' font-size='11'>so it offers from pool LAN-B (10.0.2.2)</text>" +
                "</svg>" },
        { type: "callout", kind: "warning", title: "APIPA 169.254.x.x = DHCP failed (lab A5 Gaming LAN)",
          html: "<p>If a client sends DISCOVERs and hears no OFFER (bad cable, switch port in the wrong VLAN, no pool, missing helper-address), Windows and the lab simulator give it an <b>Automatic Private IP Address</b> from <b>169.254.0.0/16</b>, the IPv4 link-local block (RFC 3927). It picks an address in 169.254.1.0–169.254.254.255 and checks with ARP that nobody else uses it. It has <b>no default gateway</b>, so it can only reach other 169.254 hosts on the same link.</p><p>In the student's saved Gaming LAN topology, PC0 got 192.168.10.2 by DHCP, but <b>PC1 = 169.254.1.36/16</b> and <b>PC2 = 169.254.1.38/16</b>. Those two never completed DORA (their cables were also on swapped switch ports). The lab still scored 20/20, but in an exam <b>169.254.x.x always means 'no DHCP server answered'</b>.</p>" },
        { type: "cheat", title: "DHCP",
          items: [ "UDP: server <b>67</b>, client <b>68</b>. DISCOVER: <b>0.0.0.0:68 → 255.255.255.255:67</b>, Ethernet dst ff:ff:ff:ff:ff:ff.",
                   "DORA = Discover (broadcast) → Offer → Request (broadcast) → Ack. Offer/Ack go broadcast if the BROADCAST flag is 1, otherwise unicast to yiaddr.",
                   "Lease = IP (yiaddr) + mask (opt 1) + gateway (opt 3) + DNS (opt 6) + lease time (opt 51). Message type = opt 53. Magic cookie 0x63825363.",
                   "T1 = 50% → unicast renew. T2 = 87.5% → broadcast rebind. 100% → address released, start over.",
                   "Fixed BOOTP header 236 B; + cookie = 240 B; xid matches replies to requests; giaddr is set by the relay.",
                   "Relay: <code>ip helper-address &lt;server&gt;</code> on the <b>client-facing</b> interface. The server picks the pool whose network contains giaddr.",
                   "169.254.0.0/16 (APIPA) = no DHCP answer; the host has no gateway." ] },
        { type: "worked", title: "Timers, addresses and ports for one lease", tag: "University-Midsem-style",
          problem: "<p>A laptop with no address joins a LAN at 09:00 and receives a 24-hour lease from server 192.168.1.1. (a) Give the source and destination IP:port of its first message. (b) At what clock time does it first try to renew, and is that message unicast or broadcast? (c) If the server is down, when does it start broadcasting to any server? (d) When must it stop using the address if nobody answers?</p>",
          steps: [
            { text: "(a) It has no IP yet, so the source is 0.0.0.0. It does not know the server, so the destination is the limited broadcast 255.255.255.255. Ports: client 68 → server 67.", why: "DISCOVER is always broadcast from the unconfigured address (RFC 2131)." },
            { tex: "T_1 = 0.5 \\times 24\\,\\text{h} = 12\\,\\text{h} \\Rightarrow 09{:}00 + 12\\,\\text{h} = 21{:}00", why: "Renewal starts at T1 and is unicast to 192.168.1.1, because the client now has an address and knows the server." },
            { tex: "T_2 = 0.875 \\times 24\\,\\text{h} = 21\\,\\text{h} \\Rightarrow 09{:}00 + 21\\,\\text{h} = 06{:}00\\ \\text{(next day)}", why: "At T2 the client enters REBINDING and broadcasts its REQUEST." },
            { tex: "L = 24\\,\\text{h} \\Rightarrow 09{:}00\\ \\text{next day}", why: "When the lease expires the client must release the address and go back to DISCOVER." } ],
          answer: "<b>(a)</b> 0.0.0.0:68 → 255.255.255.255:67. <b>(b)</b> 21:00, unicast DHCPREQUEST to 192.168.1.1:67. <b>(c)</b> 06:00 the next day (broadcast). <b>(d)</b> 09:00 the next day." },
        { type: "code", file: "Unit15_dhcp_discover.py", level: "low", title: "Build a DHCPDISCOVER with struct, parse it back and print each field (not sent)",
          note: "Asserts the 236-byte fixed header, the cookie 99.130.83.99, the 250/300-byte sizes, T1/T2 for 24 h and 8 h leases, and a relayed copy with giaddr 10.0.2.1." },
        { type: "traps",
          items: [ "The client's source IP in DISCOVER/REQUEST is <b>0.0.0.0</b>, not 255.255.255.255. Broadcast is the <i>destination</i>.",
                   "Server port <b>67</b>, client port <b>68</b>. Swapping them is the classic MCQ trap.",
                   "REQUEST is broadcast even though the client already knows the server, because it also tells the <i>other</i> servers that their offers were declined.",
                   "The slide's claim that only Discover and Request are broadcasts ignores the BROADCAST flag. Offer and Ack can be either.",
                   "Renewal at T1 is <b>unicast</b>; only rebinding at T2 is broadcast.",
                   "Routers do not forward 255.255.255.255. Without <code>ip helper-address</code>, a LAN with no local server gets APIPA addresses." ] }
      ],
      practice: [
        { id: "u15-B-1", type: "mcq", tag: "University-Midsem-style", topic: "15.15",
          q: "<p>Which UDP ports does DHCP use?</p>",
          options: ["Client 67, server 68", "Client 68, server 67", "Client 53, server 53", "Client and server both 520"], answer: 1,
          why: ["Reversed: the server is the one on 67.", "Correct (RFC 2131): server listens on 67, client on 68.", "53 is DNS.", "520 is RIP."],
          explain: "<p>DISCOVER goes from 0.0.0.0:68 to 255.255.255.255:67.</p>" },
        { id: "u15-B-2", type: "msq", tag: "GATE-style", topic: "15.5",
          q: "<p>A client with no address runs DORA with a server on the same subnet. Its BROADCAST flag is <b>0</b> and it can receive unicast before it is configured. Which messages are sent to 255.255.255.255? (Select all that apply.)</p>",
          options: ["DHCPDISCOVER", "DHCPOFFER", "DHCPREQUEST", "DHCPACK"], answer: [0, 2],
          why: ["Always broadcast: the client knows no server.", "With the flag clear, the server unicasts the OFFER to yiaddr and the client MAC.", "Always broadcast in the selecting state, so other servers learn their offers were declined.", "Same rule as the OFFER: unicast when the flag is 0."],
          explain: "<p>This is the correct version of slide error B12. The SL-L15 capture showed four broadcasts because that client set the flag.</p>" },
        { id: "u15-B-3", type: "num", tag: "University-Midsem-style", topic: "15.15",
          q: "<p>A DHCP lease is <b>8 hours</b>. At how many hours after the lease is granted does the client enter the REBINDING state (T2)? (Hours, 1 decimal.)</p>",
          answer: 7.0, tol: 0.05, unit: "h", verify: "round(0.875*8, 1)",
          formula: "T_2 = 0.875 \\times L",
          steps: [ { tex: "T_2 = 0.875 \\times 8 = 7.0\\,\\text{h}", why: "RFC 2131 default rebinding time is 87.5% of the lease." } ],
          explain: "<p>T1 would be 4 h (unicast renew). At 7 h the client starts broadcasting REQUESTs. At 8 h the lease expires.</p>" },
        { id: "u15-B-4", type: "num", tag: "GATE-style", topic: "15.5",
          q: "<p>A DHCPDISCOVER carries option 53, option 55 listing <b>5</b> parameter codes, option 61 (client identifier) with a <b>7-byte</b> value, and the End option. There is no padding. What is the total DHCP message length in bytes (the UDP payload)?</p>",
          answer: 260, tol: 0, unit: "bytes", verify: "236 + 4 + 3 + (2+5) + (2+7) + 1",
          steps: [ { tex: "236 + 4 = 240", why: "Fixed BOOTP header plus the magic cookie." },
                   { tex: "3 + (2+5) + (2+7) + 1 = 3 + 7 + 9 + 1 = 20", why: "Each option is code + length + value; End is a single byte." },
                   { tex: "240 + 20 = 260\\ \\text{B}", why: "Add header and options." } ],
          explain: "<p>260 bytes. In practice many clients pad with option 0 to 300 bytes.</p>" },
        { id: "u15-B-5", type: "mcq", tag: "University-Midsem-style", topic: "15.15",
          q: "<p>In lab A1, PC2 on LAN-B (10.0.2.0/24) gets 10.0.2.2 from Router0's DHCP service at 10.0.1.1. Which DHCP header field lets the server choose pool LAN-B rather than LAN-A?</p>",
          options: ["ciaddr", "yiaddr", "giaddr, set to 10.0.2.1 by the relay", "chaddr"], answer: 2,
          why: ["ciaddr is 0.0.0.0 for a new client.", "yiaddr is what the server fills in. It is the answer, not the input.", "Correct. The relay (ip helper-address on Gi0/1) writes its receiving interface IP into giaddr, and the server picks the pool whose network contains it.", "chaddr is the client MAC. It identifies the client, not the subnet."],
          explain: "<p>giaddr = 10.0.2.1 ∈ 10.0.2.0/24 → pool LAN-B, gateway 10.0.2.1.</p>" },
        { id: "u15-B-6", type: "mcq", tag: "University-Midsem-style", topic: "15.15",
          q: "<p>A PC in the Gaming LAN lab shows <code>IP 169.254.1.36, mask 255.255.0.0, gateway (blank)</code>. What is the most likely cause?</p>",
          options: ["The DHCP server gave it a link-local address on purpose", "Its DHCPDISCOVERs got no OFFER, so it self-assigned an APIPA address", "NAT translated its address", "It received an address from pool GAMING"], answer: 1,
          why: ["Pool GAMING hands out 192.168.10.0/24, never 169.254.", "Correct. 169.254.0.0/16 is the RFC 3927 link-local range used when DHCP fails.", "NAT runs on the router's border, not on the PC's own configuration.", "That pool would give 192.168.10.x with gateway 192.168.10.1."],
          explain: "<p>Check the cable and switch port, then run <code>ipconfig</code> again (in the real lab, renew). PC1/PC2 in the saved topology show exactly this.</p>" },
        { id: "u15-B-7", type: "text", tag: "University-Midsem-style", topic: "15.5", runCheck: true,
          q: "<p>Predict the exact output.</p>",
          code: "import struct\ncookie = struct.pack('!I', 0x63825363)\nprint('.'.join(str(b) for b in cookie), len(cookie) + 236)",
          answer: "99.130.83.99 240",
          explain: "<p>0x63 = 99, 0x82 = 130, 0x53 = 83, 0x63 = 99. The options start at offset 236 + 4 = 240.</p>" },
        { id: "u15-B-8", type: "write", tag: "University-Midsem-style", topic: "15.5",
          q: "<p>Write <code>build_discover(mac)</code> that returns a DHCPDISCOVER as bytes using <code>struct</code> (op 1, htype 1, hlen 6, BROADCAST flag set, all addresses 0, chaddr = MAC + 10 zero bytes, sname/file zero, magic cookie, options 53=1, 55=[1,3,6], 255). Then parse it back and assert the cookie.</p>",
          starter: "import struct\n\ndef build_discover(mac):\n    pass\n",
          solutionFile: "Unit15_dhcp_discover.py",
          rubric: ["Uses format '!BBBBIHHIIII16s64s128s' (236 bytes)", "Flags = 0x8000 for broadcast", "Appends 0x63825363 then TLV options 53, 55 and 255", "Parsing reads bytes 236–239 back as the cookie and walks the options"],
          explain: "<p>See the model solution, which also shows the relay's giaddr rewrite.</p>" }
      ]
    }
    // =====================================================================================
    ,{
      id: "15-C",
      title: "Route tables, longest-prefix match, and the AWS picture (IGW vs NAT gateway)",
      badge: "class",
      source: "SL-L15 p17–27, p30–31; Kurose & Ross 8e §4.2.1; AWS VPC User Guide (route tables, internet gateways, NAT gateways)",
      covers: ["15.6", "15.7", "15.8", "15.10"],
      blocks: [
        { type: "intuition", title: "The mail sorter who prefers the most detailed label",
          html: "<p><b>Analogy.</b> A sorting office has bins labelled <i>India</i>, <i>India / Delhi</i>, <i>India / Delhi / Sector 62</i>, and one bin marked <i>everything else</i>. A letter for Sector 62 fits all three Indian bins, but the clerk always uses the <b>most detailed</b> label that matches. A letter for Paris fits no labelled bin, so it goes into <i>everything else</i>.</p>" +
                "<p><b>Definition (SL-L15 p18–19; Kurose &amp; Ross §4.2.1).</b> A route table is <i>just a list: destination prefix → next hop</i>, checked for every packet. An address matches a prefix <i>a.b.c.d/n</i> when its first <i>n</i> bits equal the prefix's first <i>n</i> bits. If several entries match, the router uses the <b>longest-prefix match</b>: the entry with the largest <i>n</i> wins. <b>0.0.0.0/0</b> has <i>n</i> = 0, so it matches every address. It is the <b>default route</b>, the catch-all used only when nothing more specific matches.</p>" },
        { type: "table", head: ["Destination", "Next hop", "Matches 10.0.1.55?", "Why"],
          rows: [
            ["10.0.0.0/16", "local", "yes (/16)", "first 16 bits 00001010.00000000 are equal"],
            ["10.0.1.0/24", "router-B", "<b>yes (/24), winner</b>", "first 24 bits 00001010.00000000.00000001 are equal, and 24 is the longest"],
            ["0.0.0.0/0", "gateway", "yes (/0), too broad", "zero bits are compared, so every address matches"] ],
          caption: "SL-L15 p18 route table and the p19 lookup: 'So where does a packet to 10.0.1.55 go?' → 10.0.1.0/24 → router-B." },
        { type: "derivation", title: "LPM for 10.0.1.55, bit by bit",
          steps: [
            { tex: "10.0.1.55 = 00001010.00000000.00000001.00110111", why: "Write each octet in 8-bit binary: 55 = 32 + 16 + 4 + 2 + 1." },
            { tex: "10.0.1.55 \\land 0.0.0.0 = 0.0.0.0 = \\text{prefix of } 0.0.0.0/0 \\ \\checkmark", why: "A /0 mask has no 1-bits, so the AND is always 0.0.0.0: the default route always matches." },
            { tex: "10.0.1.55 \\land 255.255.0.0 = 10.0.0.0 \\ \\checkmark", why: "The /16 mask keeps the first two octets; 10.0.0.0 equals the prefix of the 10.0.0.0/16 entry." },
            { tex: "10.0.1.55 \\land 255.255.255.0 = 10.0.1.0 \\ \\checkmark", why: "The /24 mask keeps three octets; 10.0.1.0 equals the prefix of the 10.0.1.0/24 entry." },
            { tex: "\\max(0, 16, 24) = 24 \\Rightarrow \\text{next hop router-B}", why: "Among the matches, the longest prefix is the most specific one and wins." } ] },
        { type: "table", head: ["Prefix (CIDR)", "Prefix bits (first 24 shown)", "Interface"],
          rows: [
            ["200.23.16.0/21", "11001000 00010111 00010<b>xxx</b>", "0"],
            ["200.23.24.0/24", "11001000 00010111 00011000", "1"],
            ["200.23.24.0/21", "11001000 00010111 00011<b>xxx</b>", "2"],
            ["0.0.0.0/0 (otherwise)", "(no bits compared)", "3"] ],
          caption: "GATE-style multi-entry table in the style of Kurose & Ross §4.2.1. Note that 200.23.24.0/24 lies inside 200.23.24.0/21, so the two overlap and LPM decides between them." },
        { type: "worked", title: "Four lookups in the multi-entry table", tag: "GATE-style",
          problem: "<p>Using the table above, find the outgoing interface for (a) 200.23.22.161, (b) 200.23.24.170, (c) 200.23.31.5, (d) 200.23.40.1.</p>",
          steps: [
            { text: "All four addresses start 11001000 00010111 (200.23), so only the third octet decides. Convert it: 22 = 00010110, 24 = 00011000, 31 = 00011111, 40 = 00101000.", why: "The first 16 bits are the same in every prefix and address, so we compare from bit 17 onwards." },
            { text: "(a) 00010110: the first 5 bits 00010 match the /21 prefix 00010 → interface 0. They do not match 00011 (the /24 or the other /21).", why: "A /21 compares 21 bits = 16 + the first 5 bits of the third octet." },
            { text: "(b) 00011000: it matches 200.23.24.0/24 (all 8 bits equal), 200.23.24.0/21 (00011) and /0. The longest is /24 → interface 1.", why: "Longest-prefix match: /24 beats /21." },
            { text: "(c) 00011111: it fails the /24 (00011111 ≠ 00011000) but matches the /21 00011 → interface 2.", why: "Only one non-default entry matches." },
            { text: "(d) 00101000: the first 5 bits 00101 match neither 00010 nor 00011, and the /24 fails, so only 0.0.0.0/0 matches → interface 3.", why: "The default route catches everything else." } ],
          answer: "<b>(a) 0, (b) 1, (c) 2, (d) 3.</b>" },
        { type: "callout", kind: "aws", title: "SL-L15 p21: How does a VPC touch the Internet?",
          html: "<p><i>An IGW attaches your VPC to the Internet. A public subnet routes 0.0.0.0/0 → IGW. Its instances can be reached both ways.</i> \"<b>Public subnet</b>\" simply means: <b>its route table has a route to the IGW</b>. The console screenshot (p23) shows <code>MyVPC-rtb-public</code>: <code>10.0.0.0/16 → local</code> and <code>0.0.0.0/0 → igw-0e4226802ca4594de</code>. An instance in it also needs a public IPv4 address or Elastic IP. The IGW performs one-to-one NAT between that public IP and the instance's private IP.</p>" },
        { type: "figure", caption: "SL-L15 p21 redrawn: VPC 10.0.0.0/16 across two AZs. The IGW serves both public subnets (solid lines). The NAT gateway lives in Public subnet A and gives both private subnets outbound-only access (dashed lines).",
          html: "<svg viewBox='0 0 640 300' width='100%' role='img' aria-label='VPC with IGW and NAT gateway'>" +
                "<rect x='250' y='6' width='140' height='30' rx='15' fill='none' stroke='var(--muted)' stroke-width='2'/><text x='320' y='26' text-anchor='middle' fill='currentColor' font-size='12'>Internet</text>" +
                "<rect x='250' y='52' width='140' height='30' rx='6' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='320' y='72' text-anchor='middle' fill='currentColor' font-size='12'>Internet gateway</text>" +
                "<line x1='320' y1='36' x2='320' y2='52' stroke='var(--muted)' stroke-width='2'/>" +
                "<rect x='10' y='95' width='620' height='198' rx='10' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='22' y='114' fill='var(--accent)' font-size='12'>VPC 10.0.0.0/16</text>" +
                "<rect x='40' y='125' width='250' height='70' rx='6' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='50' y='143' fill='currentColor' font-size='12'>Public subnet A 10.0.1.0/24 · AZ-a</text><rect x='100' y='155' width='120' height='30' rx='5' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='160' y='175' text-anchor='middle' fill='currentColor' font-size='12'>NAT gateway</text>" +
                "<rect x='350' y='125' width='250' height='70' rx='6' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='360' y='143' fill='currentColor' font-size='12'>Public subnet B 10.0.2.0/24 · AZ-b</text>" +
                "<rect x='40' y='215' width='250' height='60' rx='6' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='50' y='250' fill='currentColor' font-size='12'>Private subnet A 10.0.3.0/24 · AZ-a</text>" +
                "<rect x='350' y='215' width='250' height='60' rx='6' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='360' y='250' fill='currentColor' font-size='12'>Private subnet B 10.0.4.0/24 · AZ-b</text>" +
                "<line x1='300' y1='82' x2='165' y2='125' stroke='var(--ok)' stroke-width='2'/><line x1='340' y1='82' x2='475' y2='125' stroke='var(--ok)' stroke-width='2'/>" +
                "<line x1='160' y1='185' x2='165' y2='215' stroke='var(--warn)' stroke-width='2' stroke-dasharray='6 4'/><line x1='220' y1='180' x2='470' y2='215' stroke='var(--warn)' stroke-width='2' stroke-dasharray='6 4'/>" +
                "</svg>" },
        { type: "table", head: ["Public subnet RT", "", "Private subnet RT", ""],
          rows: [ ["<b>Destination</b>", "<b>Target</b>", "<b>Destination</b>", "<b>Target</b>"],
                  ["10.0.0.0/16", "local", "10.0.0.0/16", "local"],
                  ["0.0.0.0/0", "<span style='color:var(--ok)'>igw-0a1b</span>", "0.0.0.0/0", "<span style='color:var(--bad)'>nat-9f7c</span>"] ],
          caption: "SL-L15 p26, Spot the difference. Same VPC: one word in one row changes who reaches the Internet, and who reaches you. LPM still applies: 10.0.3.7 matches /16 and /0, and /16 wins, so traffic inside the VPC stays local." },
        { type: "callout", kind: "slidefix", title: "SL-L15 p24–25: the 'NAT Gateway' route table has no NAT route (UNCLEAR B13)",
          html: "<p><b>Slide shows:</b> under the title <i>Outbound Only: The NAT Gateway</i>, the console route table <code>MyVPC-rtb-private1-us-east-1a</code> has only <code>10.0.0.0/16 → local</code> and <code>pl-63a5400a → vpce-06cd2371b631a5c0a</code>. The second route is an S3 prefix list pointing at a <b>gateway endpoint</b>, not the NAT gateway. The highlighted path on p24 also ends at the S3 endpoint.</p><p><b>Correct:</b> a private subnet gets outbound Internet only if its route table contains <b>0.0.0.0/0 → nat-&lt;id&gt;</b>, as p26 shows (nat-9f7c). With only the routes on p25, the instances can reach other VPC addresses and S3, and nothing else. Both kinds of route can sit in the same table. The S3 prefix list is more specific than /0, so S3 traffic uses the endpoint and everything else uses the NAT gateway.</p>" },
        { type: "table", head: ["", "Internet gateway (IGW)", "NAT gateway (public)"],
          rows: [
            ["Attached to / lives in", "the VPC as a whole (one per VPC)", "one <b>public subnet</b> in one AZ, and needs an Elastic IP"],
            ["Route that uses it", "public subnet: 0.0.0.0/0 → igw-id", "private subnet: 0.0.0.0/0 → nat-id. The NAT GW's own subnet routes 0.0.0.0/0 → IGW"],
            ["Direction", "both ways: inbound and outbound for instances that have a public IP", "<b>outbound only</b>: instances start connections; nobody outside can start one in (\"updates flow out; attackers can't flow in\")"],
            ["Translation", "one-to-one: instance public IPv4 ↔ private IPv4", "many-to-one PAT: all private instances share the NAT GW's Elastic IP, with unique ports"],
            ["Availability", "horizontally scaled, redundant, highly available; no bandwidth limit of its own", "redundant within its AZ. Create one per AZ so that losing one AZ does not cut off the other private subnets"],
            ["Limits / cost (AWS docs)", "no charge for the gateway itself", "5 Gbps, scaling automatically to 100 Gbps; up to 55,000 simultaneous connections to each unique destination; charged per hour and per GB processed"],
            ["Security groups", "not applicable", "cannot be attached to a NAT GW; control traffic with the instances' security groups and NACLs"] ],
          caption: "IGW vs NAT gateway (SL-L15 p21–27 plus AWS VPC documentation)." },
        { type: "callout", kind: "takeaway", title: "Key takeaways (SL-L15 p30) and what comes next (p31)",
          html: "<ul><li>NAT/PAT lets many private hosts share one public IP by rewriting address + port. That is why your whole house browses through one ISP address.</li><li>DHCP (DORA) auto-leases address + mask + gateway + DNS from your subnet's range.</li><li>In AWS the route table is the switch: <b>0.0.0.0/0 → IGW</b> makes a subnet public; <b>0.0.0.0/0 → NAT GW</b> gives a private subnet outbound-only Internet.</li><li>Next: ICMP, the protocol behind ping and traceroute (taught in section 15-F below), then IPv6, the long-term answer to the address exhaustion that made NAT necessary.</li></ul><p><b>Slide quiz (p27).</b> <i>A private-subnet server needs OS updates but must never accept inbound connections. Which gateway, and what route?</i> <b>NAT Gateway · 0.0.0.0/0 → NAT GW.</b></p>" },
        { type: "cheat", title: "Route tables & VPC routing",
          items: [ "Match test: <code>(addr &amp; mask) == (prefix &amp; mask)</code>. Winner = largest prefix length among the matches, not the first row listed.",
                   "0.0.0.0/0 = default route, mask 0.0.0.0, matches all 2<sup>32</sup> addresses.",
                   "A /n prefix covers $2^{32-n}$ addresses: /21 → 2048, /24 → 256, /16 → 65,536.",
                   "AWS route table: the <code>local</code> route (VPC CIDR) is always present and cannot be deleted. The most specific route wins.",
                   "Public subnet = 0.0.0.0/0 → IGW. Private with outbound = 0.0.0.0/0 → NAT GW, which itself sits in a public subnet.",
                   "VPC 10.0.0.0/16 from p21: public 10.0.1.0/24 and 10.0.2.0/24, private 10.0.3.0/24 and 10.0.4.0/24; AWS keeps 5 addresses per subnet, so a /24 has 251 usable." ] },
        { type: "code", file: "Unit15_lpm_bitwise.py", level: "low", title: "LPM router with masks and ANDs only, printing the binary comparison",
          note: "Reproduces SL-L15 p19 (10.0.1.55 → router-B), the four GATE-style lookups and the corrected private route table." },
        { type: "code", file: "Unit15_lpm_ipaddress.py", level: "high", title: "The same lookups with the ipaddress module, plus the /29 lab subnet and APIPA checks" },
        { type: "traps",
          items: [ "LPM chooses the <b>longest</b> matching prefix, not the first matching row and not the smallest network number.",
                   "0.0.0.0/0 matches <i>everything</i>, so it can never 'not match'. It loses only to more specific routes.",
                   "In GATE tables, check overlapping prefixes (a /24 inside a /21) bit by bit. Do not just compare the dotted decimal numbers.",
                   "The NAT gateway goes in a <b>public</b> subnet. Putting it in the private subnet it serves creates a route with no exit.",
                   "Being in a 'public subnet' is not enough to be reachable from the Internet: the instance also needs a public IP or Elastic IP, and its security group must allow the traffic.",
                   "SL-L15 p25 is labelled 'NAT Gateway' but shows an S3 endpoint route. The real NAT route is 0.0.0.0/0 → nat-id." ] }
      ],
      practice: [
        { id: "u15-C-1", type: "mcq", tag: "University-Midsem-style", topic: "15.6",
          q: "<p>Route table: 10.0.0.0/16 → local; 10.0.1.0/24 → router-B; 0.0.0.0/0 → gateway. Where does a packet to <b>10.0.2.9</b> go?</p>",
          options: ["router-B", "local", "gateway", "dropped"], answer: 1,
          why: ["10.0.2.9 has third octet 2, so it is not in 10.0.1.0/24.", "Correct. It matches 10.0.0.0/16 (and /0); /16 is the longest match.", "/0 matches too, but /16 is more specific.", "The default route guarantees some match."],
          explain: "<p>Only 10.0.1.x goes to router-B. The rest of 10.0.x.x is local, and everything else goes to the gateway.</p>" },
        { id: "u15-C-2", type: "text", tag: "GATE-style", topic: "15.6",
          q: "<p>Router table: 200.23.16.0/21 → 0; 200.23.24.0/24 → 1; 200.23.24.0/21 → 2; default → 3. Which interface does a packet to <b>200.23.25.200</b> leave on? (Answer with the interface number.)</p>",
          answer: "2",
          explain: "<p>25 = 00011001. It fails the /24 (00011001 ≠ 00011000), and its first 5 bits 00011 match 200.23.24.0/21 → interface 2.</p>" },
        { id: "u15-C-3", type: "num", tag: "GATE-style", topic: "15.6",
          q: "<p>How many IPv4 addresses does the prefix 200.23.16.0/21 cover? (Integer.)</p>",
          answer: 2048, tol: 0, unit: "addresses", verify: "2**(32-21)",
          steps: [ { tex: "32 - 21 = 11\\ \\text{host bits}", why: "The prefix fixes 21 bits; the remaining bits can vary." },
                   { tex: "2^{11} = 2048", why: "Each host bit doubles the count." } ],
          explain: "<p>200.23.16.0 to 200.23.23.255: 8 /24 blocks × 256 = 2048.</p>" },
        { id: "u15-C-4", type: "mcq", tag: "University-Midsem-style", topic: "15.8",
          q: "<p>(SL-L15 p27) A private-subnet server needs OS updates but must never accept inbound connections. Which gateway and which route?</p>",
          options: ["Internet gateway; 0.0.0.0/0 → IGW in the private subnet's route table", "NAT gateway; 0.0.0.0/0 → NAT GW in the private subnet's route table", "NAT gateway; 10.0.0.0/16 → NAT GW", "No route needed; the local route reaches the Internet"], answer: 1,
          why: ["That would make the subnet public, and instances with public IPs could then be reached from outside.", "Correct: outbound-only through the NAT gateway, which lives in a public subnet.", "10.0.0.0/16 is the VPC's own range and must stay local.", "local covers only 10.0.0.0/16."],
          explain: "<p>Updates flow out; attackers can't flow in.</p>" },
        { id: "u15-C-5", type: "msq", tag: "University-Midsem-style", topic: "15.7",
          q: "<p>Which statements are true? (Select all that apply.)</p>",
          options: ["A subnet is 'public' when its route table has 0.0.0.0/0 → an internet gateway", "A NAT gateway must be placed in a public subnet", "Instances behind a NAT gateway can be reached by any Internet host that knows the NAT gateway's Elastic IP", "The VPC local route can be overridden by deleting it", "One NAT gateway per AZ avoids losing private-subnet Internet access when one AZ fails"], answer: [0, 1, 4],
          why: ["This is the slide's definition (p21).", "It needs the IGW route of a public subnet to send traffic out.", "NAT GW is outbound-only; unsolicited inbound has no mapping.", "The local route cannot be deleted.", "A NAT GW is tied to one AZ, so the AWS guidance is one per AZ."],
          explain: "<p>IGW = both ways for instances with public IPs. NAT GW = outbound only.</p>" },
        { id: "u15-C-6", type: "text", tag: "University-Midsem-style", topic: "15.6", runCheck: true,
          q: "<p>Predict the exact output.</p>",
          code: "import ipaddress\nrt = [('10.0.0.0/16', 'local'), ('10.0.1.0/24', 'router-B'), ('0.0.0.0/0', 'gateway')]\ndef lookup(ip):\n    a = ipaddress.ip_address(ip)\n    hits = [(ipaddress.ip_network(n).prefixlen, h) for n, h in rt if a in ipaddress.ip_network(n)]\n    return max(hits)[1]\nprint(lookup('10.0.1.55'), lookup('10.1.0.1'), lookup('10.0.0.9'))",
          answer: "router-B gateway local",
          explain: "<p>10.0.1.55 → /24 wins. 10.1.0.1 is outside 10.0.0.0/16, so only /0 matches. 10.0.0.9 → /16.</p>" },
        { id: "u15-C-7", type: "write", tag: "GATE-style", topic: "15.6",
          q: "<p>Without the <code>ipaddress</code> module, write <code>lookup(table, ip)</code> where <code>table</code> is a list of <code>(\"a.b.c.d/n\", next_hop)</code>. Convert the dotted address to a 32-bit integer, build each mask with shifts, and return the next hop of the longest matching prefix.</p>",
          starter: "def ip_to_int(ip):\n    pass\n\ndef lookup(table, ip):\n    pass\n",
          solutionFile: "Unit15_lpm_bitwise.py",
          rubric: ["ip_to_int uses shifts: (a &lt;&lt; 24) | (b &lt;&lt; 16) | (c &lt;&lt; 8) | d", "mask = (0xFFFFFFFF &lt;&lt; (32 - n)) &amp; 0xFFFFFFFF, with n = 0 giving 0", "match test (addr &amp; mask) == network", "keeps the match with the largest n; returns router-B for 10.0.1.55"],
          explain: "<p>See the model solution.</p>" }
      ]
    }
    // =====================================================================================
    ,{
      id: "15-D",
      title: "Labs: DHCP relay, Gaming LAN, Industrial multi-segment, VLAN trunking & router-on-a-stick",
      badge: "lab",
      source: "Study Pack labs A1 (CN_LAB_DHCP_SectionD), A2 (Router on stick), A5 (Gaming Lab LAN), A6 (Industrial Multi-Segment); 3 - Coding & Lab Questions.md; attachments/*.xml; IEEE 802.1Q",
      covers: ["15.11", "15.12"],
      blocks: [
        { type: "intuition", title: "Colour-coded corridors and one shared lift",
          html: "<p><b>Analogy.</b> One office building (one switch) houses three departments. Each department gets its own colour-coded corridor (a <b>VLAN</b>), and people in the red corridor cannot walk into the blue one. One lift (the <b>trunk</b> link) serves every floor, so every passenger wears a coloured badge (the <b>802.1Q tag</b>) saying which corridor they belong to. The receptionist at the bottom of the lift (the <b>router</b>) has one desk window per colour (<b>subinterfaces</b>) and walks people between corridors (inter-VLAN routing).</p>" +
                "<p><b>Definitions.</b> A <b>VLAN</b> is a separate broadcast domain on a switch. An <b>access port</b> belongs to exactly one VLAN and carries untagged frames. A <b>trunk port</b> carries frames of many VLANs, each with a 4-byte IEEE 802.1Q tag. <b>Router-on-a-stick</b> = one physical router port connected to a trunk, split into logical subinterfaces (<code>Gi0/0.10</code>, <code>.20</code>, <code>.30</code>). Each one runs <code>encapsulation dot1Q &lt;vlan&gt;</code> and holds that VLAN's gateway IP. A <b>DHCP relay</b> (<code>ip helper-address</code>) turns a client's broadcast into a unicast to a DHCP server on another subnet.</p>" },
        { type: "figure", caption: "Lab A1 'Dual-LAN DHCP: Router as DHCP Server with Relay'. Router0 serves both LANs. LAN-B's broadcasts reach it through the helper address configured on Gi0/1.",
          html: "<svg viewBox='0 0 640 200' width='100%' role='img' aria-label='Dual LAN DHCP lab topology'>" +
                "<rect x='255' y='10' width='130' height='50' rx='8' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='320' y='32' text-anchor='middle' fill='currentColor' font-size='13'>Router0</text><text x='320' y='50' text-anchor='middle' fill='var(--muted)' font-size='10'>pools LAN-A, LAN-B</text>" +
                "<rect x='90' y='90' width='130' height='36' rx='6' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='155' y='113' text-anchor='middle' fill='currentColor' font-size='12'>ManagedSwitch0</text>" +
                "<rect x='420' y='90' width='130' height='36' rx='6' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='485' y='113' text-anchor='middle' fill='currentColor' font-size='12'>ManagedSwitch1</text>" +
                "<line x1='290' y1='60' x2='170' y2='90' stroke='var(--muted)' stroke-width='2'/><text x='175' y='70' fill='currentColor' font-size='10'>Gi0/0 10.0.1.1</text>" +
                "<line x1='350' y1='60' x2='470' y2='90' stroke='var(--muted)' stroke-width='2'/><text x='400' y='70' fill='currentColor' font-size='10'>Gi0/1 10.0.2.1 helper 10.0.1.1</text>" +
                "<text x='20' y='160' fill='currentColor' font-size='11'>PC0 10.0.1.2</text><text x='110' y='175' fill='currentColor' font-size='11'>PC1 10.0.1.3</text><text x='200' y='160' fill='currentColor' font-size='11'>Server0 10.0.1.4</text>" +
                "<text x='420' y='165' fill='currentColor' font-size='11'>PC2 10.0.2.2</text><text x='520' y='165' fill='currentColor' font-size='11'>PC3 10.0.2.3</text>" +
                "<line x1='155' y1='126' x2='55' y2='148' stroke='var(--muted)'/><line x1='155' y1='126' x2='145' y2='163' stroke='var(--muted)'/><line x1='155' y1='126' x2='240' y2='148' stroke='var(--muted)'/><line x1='485' y1='126' x2='455' y2='153' stroke='var(--muted)'/><line x1='485' y1='126' x2='555' y2='153' stroke='var(--muted)'/>" +
                "<text x='20' y='195' fill='var(--muted)' font-size='11'>LAN-A 10.0.1.0/24</text><text x='420' y='195' fill='var(--muted)' font-size='11'>LAN-B 10.0.2.0/24</text>" +
                "</svg>" },
        { type: "text",
          html: "<p><b>Lab A1 configuration (verbatim, Router0).</b></p><pre><code>enable\nconfigure terminal\n\ninterface GigabitEthernet0/0\n ip address 10.0.1.1 255.255.255.0\n no shutdown\n exit\n\ninterface GigabitEthernet0/1\n ip address 10.0.2.1 255.255.255.0\n ip helper-address 10.0.1.1\n no shutdown\n exit\n\nip dhcp pool LAN-A\n network 10.0.1.0 255.255.255.0\n default-router 10.0.1.1\n exit\n\nip dhcp pool LAN-B\n network 10.0.2.0 255.255.255.0\n default-router 10.0.2.1\n exit</code></pre>" +
                "<p>The lab's own explanation: <i>\"ip helper-address 10.0.1.1 on Gi0/1 forwards DHCP broadcast messages from LAN-B clients to Router0's own DHCP server (at 10.0.1.1), which then hands out addresses from the LAN-B pool.\"</i> The helper goes on the interface that <b>faces the clients</b> (Gi0/1), because that is where their broadcasts arrive. Clients are set to DHCP and run <code>ipconfig</code> in the strict order PC0, PC1, Server0, PC2, PC3. The pool hands out addresses in sequence from .2, so the order decides who gets which address: PC0 10.0.1.2, PC1 10.0.1.3, Server0 10.0.1.4, PC2 10.0.2.2, PC3 10.0.2.3. Verification: from PC0, <code>ping 10.0.2.2</code>. Simulation mode shows the Router0 hop and both ARP exchanges.</p>" },
        { type: "callout", kind: "key", title: "Why the relay works, in DHCP-header terms",
          html: "<p>PC2's DISCOVER (0.0.0.0:68 → 255.255.255.255:67) reaches Gi0/1 and would die there, because routers never forward limited broadcasts. The helper copies it, sets <b>giaddr = 10.0.2.1</b> (the receiving interface), adds 1 to <b>hops</b>, and unicasts it to 10.0.1.1:67. The DHCP service sees giaddr inside 10.0.2.0/24, picks <b>pool LAN-B</b>, and offers 10.0.2.2 with gateway 10.0.2.1. The OFFER goes back to the relay (giaddr:67), which delivers it to the client on port 68.</p>" },
        { type: "packet", title: "IEEE 802.1Q tag (inserted after the source MAC on trunk links)", width: 32,
          fields: [
            { name: "TPID = 0x8100", bits: 16, note: "Tag Protocol ID: sits where the EtherType normally is and says 'a VLAN tag follows'" },
            { name: "PCP", bits: 3, note: "Priority Code Point (802.1p class of service 0–7)" },
            { name: "DEI", bits: 1, note: "Drop Eligible Indicator (formerly CFI)" },
            { name: "VID", bits: 12, note: "VLAN ID 0–4095. 0 and 4095 are reserved, so 1–4094 are usable. The labs use 10, 20, 30" } ],
          caption: "4 bytes. A tagged Ethernet frame can be up to 1518 + 4 = 1522 bytes. Access ports strip the tag; the trunk keeps it. The router's .10 subinterface accepts only VID 10." },
        { type: "figure", caption: "Lab A2 'VLAN Trunking and Router-on-a-Stick': one router port, one trunk, three VLANs on ManagedSwitch0.",
          html: "<svg viewBox='0 0 640 210' width='100%' role='img' aria-label='Router on a stick lab'>" +
                "<rect x='240' y='8' width='160' height='62' rx='8' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='320' y='28' text-anchor='middle' fill='currentColor' font-size='13'>Router0 Gi0/0</text><text x='320' y='45' text-anchor='middle' fill='var(--muted)' font-size='10'>.10 10.0.1.1 · .20 10.0.2.1</text><text x='320' y='60' text-anchor='middle' fill='var(--muted)' font-size='10'>.30 10.0.3.1 (dot1Q 10/20/30)</text>" +
                "<line x1='320' y1='70' x2='320' y2='100' stroke='var(--accent)' stroke-width='4'/><text x='330' y='90' fill='var(--accent)' font-size='11'>trunk Fa0/1 (tagged 10, 20, 30)</text>" +
                "<rect x='220' y='100' width='200' height='36' rx='6' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='320' y='123' text-anchor='middle' fill='currentColor' font-size='12'>ManagedSwitch0</text>" +
                "<line x1='250' y1='136' x2='110' y2='160' stroke='var(--ok)' stroke-width='2'/><line x1='320' y1='136' x2='320' y2='160' stroke='var(--warn)' stroke-width='2'/><line x1='390' y1='136' x2='530' y2='160' stroke='var(--bad)' stroke-width='2'/>" +
                "<text x='110' y='178' text-anchor='middle' fill='var(--ok)' font-size='11'>VLAN 10 Student · Fa0/2–4</text><text x='110' y='196' text-anchor='middle' fill='currentColor' font-size='11'>PC0–PC2 10.0.1.2–.4</text>" +
                "<text x='320' y='178' text-anchor='middle' fill='var(--warn)' font-size='11'>VLAN 20 Staff · Fa0/5–7</text><text x='320' y='196' text-anchor='middle' fill='currentColor' font-size='11'>PC3–PC5 10.0.2.2–.4</text>" +
                "<text x='530' y='178' text-anchor='middle' fill='var(--bad)' font-size='11'>VLAN 30 Admin · Fa0/8–10</text><text x='530' y='196' text-anchor='middle' fill='currentColor' font-size='11'>PC6–PC8 10.0.3.2–.4</text>" +
                "</svg>" },
        { type: "text",
          html: "<p><b>Lab A2 configuration (verbatim).</b> ManagedSwitch0:</p><pre><code>enable\nconfigure terminal\n\nvlan 10\n name Student\n exit\nvlan 20\n name Staff\n exit\nvlan 30\n name Admin\n exit\n\ninterface FastEthernet0/1\n switchport mode trunk\n exit\n\ninterface FastEthernet0/2\n switchport mode access\n switchport access vlan 10\n exit</code></pre>" +
                "<p>The same access block is repeated for Fa0/3 and Fa0/4 (vlan 10), Fa0/5, Fa0/6 and Fa0/7 (vlan 20), and Fa0/8, Fa0/9 and Fa0/10 (vlan 30). Router0:</p><pre><code>enable\nconfigure terminal\n\ninterface GigabitEthernet0/0\n no shutdown\n exit\n\ninterface GigabitEthernet0/0.10\n encapsulation dot1Q 10\n ip address 10.0.1.1 255.255.255.0\n exit\ninterface GigabitEthernet0/0.20\n encapsulation dot1Q 20\n ip address 10.0.2.1 255.255.255.0\n exit\ninterface GigabitEthernet0/0.30\n encapsulation dot1Q 30\n ip address 10.0.3.1 255.255.255.0\n exit\n\nip dhcp pool STUDENT\n network 10.0.1.0 255.255.255.0\n default-router 10.0.1.1\n exit\nip dhcp pool STAFF\n network 10.0.2.0 255.255.255.0\n default-router 10.0.2.1\n exit\nip dhcp pool ADMIN\n network 10.0.3.0 255.255.255.0\n default-router 10.0.3.1\n exit</code></pre>" +
                "<p>The lab's own explanation: <i>the physical interface GigabitEthernet0/0 must be no shutdown first. Each subinterface tags its frames with the matching VLAN ID using encapsulation dot1Q, acting as the default gateway for that VLAN.</i> Verification: PC0 <code>ping 10.0.3.2</code> (Student → Admin). Simulation shows dot1Q-tagged frames on the trunk. This lab was marked Solved but scored only 10/20, and the source does not say why. In the saved file every Router0 physical interface is up, including unused ones, so check that only the interfaces the lab asks for are enabled.</p>" },
        { type: "table", head: ["Segment (lab A6 Industrial)", "Router0 interface", "Gateway IP /24", "DHCP pool", "Static hosts / DNS"],
          rows: [
            ["LAN-A IT (ManagedSwitch0)", "Gi0/0", "192.168.1.1", "LAN-A → PC0 .2, PC1 .3", "none"],
            ["LAN-B Operations (ManagedSwitch1)", "Gi0/1", "192.168.2.1", "LAN-B → PC2 .2, PC3 .3", "none"],
            ["VLAN 10 Engineering (trunk on ManagedSwitch2)", "Gi0/2.10, dot1Q 10", "10.10.10.1", "ENGINEERING → PC4 10.10.10.2", "Server0 10.10.10.10; <code>ip host eng-server 10.10.10.10</code>"],
            ["VLAN 20 Manufacturing", "Gi0/2.20, dot1Q 20", "10.10.20.1", "MANUFACTURING → PC5 10.10.20.2", "Server1 10.10.20.10; <code>ip host mfg-server 10.10.20.10</code>"],
            ["VLAN 30 Management", "Gi0/2.30, dot1Q 30", "10.10.30.1", "MANAGEMENT → PC6 10.10.30.2", "none"] ],
          caption: "Lab A6: two physical LANs plus router-on-a-stick on one router. Gi0/2 itself is up with no IP. In the saved file each pool also pushes its gateway as the DNS server. Source inconsistencies (UNCLEAR C): the text says 'unmanaged switch' and names ManagedSwitch0 as the trunk, but the topology uses ManagedSwitch0/1 for the LANs and puts the trunk on ManagedSwitch2." },
        { type: "table", head: ["Lab A5 Gaming LAN goal", "Command(s) (discovered with ?)", "Value"],
          rows: [
            ["1. Router interface", "<code>interface GigabitEthernet0/0</code>, <code>ip address 192.168.10.1 255.255.255.0</code>, <code>no shutdown</code>", "gateway 192.168.10.1"],
            ["2. DHCP pool named exactly GAMING", "<code>ip dhcp pool GAMING</code>, <code>network 192.168.10.0 255.255.255.0</code>, <code>default-router 192.168.10.1</code>", "PCs get 192.168.10.x"],
            ["(saved file) DNS option", "<code>dns-server 192.168.10.1</code> inside the pool", "the lab text never asks for this (UNCLEAR C), but name lookup needs it"],
            ["3. Static DNS entry", "<code>ip host game-server 192.168.10.10</code> (remove with <code>no ip host game-server</code>)", "game-server → 192.168.10.10"],
            ["4. Server0", "static 192.168.10.10/24, gw 192.168.10.1, HTTP on", "page 'Welcome to Game Server'"],
            ["5. PCs", "Desktop → IP Configuration → DHCP, then <code>ipconfig</code>", "PC0 got 192.168.10.2; PC1/PC2 show APIPA 169.254.1.36 / .38 in the saved file"] ],
          caption: "Lab A5 is a 'discovery' lab: no commands are given. Type a partial command followed by ? (for example ip dhcp ?) to list the options." },
        { type: "derivation", title: "How many addresses can a /24 pool really lease?",
          steps: [
            { tex: "2^{32-24} = 256\\ \\text{addresses in } 192.168.10.0/24", why: "8 host bits." },
            { tex: "256 - 2 = 254\\ \\text{assignable}", why: "The network address .0 and the broadcast .255 cannot be given to hosts." },
            { tex: "254 - 1 = 253", why: "The gateway 192.168.10.1 is the router's own interface, and the server never leases it." },
            { tex: "253 - 1 = 252", why: "Server0 is statically 192.168.10.10 and must not be leased twice (exclude it with ip dhcp excluded-address on real IOS)." },
            { tex: "\\text{excluding } .1\\text{–}.10:\\ 254 - 10 = 244", why: "A common real-world habit is to reserve the first ten addresses for infrastructure." } ] },
        { type: "cheat", title: "IOS lab commands",
          items: [ "<code>ip dhcp pool NAME</code> → <code>network N M</code>, <code>default-router G</code>, <code>dns-server D</code>. Pool names are case-sensitive in the grader.",
                   "<code>ip helper-address SERVER</code> on the <b>client-facing</b> interface turns DHCP broadcasts into unicast to SERVER, with giaddr set.",
                   "VLAN: <code>vlan 10</code> → <code>name Student</code>. Access: <code>switchport mode access</code> + <code>switchport access vlan 10</code>. Trunk: <code>switchport mode trunk</code>.",
                   "Router-on-a-stick: <code>no shutdown</code> on the physical port first (subinterfaces inherit its up/down state), then <code>interface Gi0/0.10</code> → <code>encapsulation dot1Q 10</code> → gateway IP.",
                   "Static DNS on the router: <code>ip host NAME IP</code>. Check: <code>show running-config</code>, <code>show ip interface brief</code>.",
                   "802.1Q tag = 4 B: TPID 0x8100 (16) | PCP (3) | DEI (1) | VID (12). Usable VIDs 1–4094." ] },
        { type: "worked", title: "Trace PC4 → Server1 in the Industrial lab", tag: "University-Midsem-style",
          problem: "<p>In lab A6, PC4 (VLAN 10, 10.10.10.2, gateway 10.10.10.1) runs <code>ping 10.10.20.10</code> (Server1, VLAN 20). List every link the ICMP echo request crosses, say whether each frame is tagged and with which VID, and name the router's forwarding decision.</p>",
          steps: [
            { text: "PC4 compares 10.10.20.10 with its own /24: 10.10.20.0 ≠ 10.10.10.0, so the destination is off-subnet and goes to the gateway 10.10.10.1. PC4 ARPs for 10.10.10.1 and gets Gi0/2.10's MAC.", why: "Hosts send off-subnet traffic to their default gateway." },
            { text: "PC4 → SW2 Fa0/3 (access, VLAN 10): the frame is untagged.", why: "Access ports carry untagged frames." },
            { text: "SW2 Fa0/1 → Router0 Gi0/2 (trunk): the frame is tagged VID 10, so Gi0/2.10 accepts it.", why: "The trunk keeps the VLAN identity with an 802.1Q tag." },
            { text: "Router0 looks up 10.10.20.10: it matches the connected route 10.10.20.0/24 on Gi0/2.20, decrements the TTL, and ARPs for 10.10.20.10 on VLAN 20.", why: "This is a normal route-table lookup; each subinterface's subnet is a connected route." },
            { text: "Router0 Gi0/2 → SW2 Fa0/1 (trunk): the frame is tagged VID 20. SW2 Fa0/4 (access, VLAN 20) → Server1: untagged.", why: "The frame crosses the same physical trunk a second time, now in VLAN 20." } ],
          answer: "PC4 → (untagged) → SW2 → (tag 10) → Router0 Gi0/2.10 → route lookup → Gi0/2.20 → (tag 20) → SW2 → (untagged) → Server1. The trunk is crossed twice, and the reply takes the mirror path." },
        { type: "traps",
          items: [ "<code>ip helper-address</code> goes on the interface where the clients' broadcasts <b>arrive</b> (Gi0/1 in A1), not on the server's interface.",
                   "Forgetting <code>no shutdown</code> on the physical Gi0/0 or Gi0/2 leaves every subinterface down.",
                   "The switch port facing the router must be a <b>trunk</b>. If it is an access port, only one VLAN reaches the router.",
                   "DHCP leases are handed out in order, so running <code>ipconfig</code> on the PCs in the wrong order gives different addresses from the lab's IP table, and the grader fails.",
                   "A PC with 169.254.x.x got no DHCP OFFER. Check the cable, port VLAN, pool and helper before anything else.",
                   "Pool and VLAN names are compared exactly: <code>GAMING</code> ≠ <code>Gaming</code>." ] }
      ],
      practice: [
        { id: "u15-D-1", type: "mcq", tag: "University-Midsem-style", topic: "15.11",
          q: "<p>In lab A1, LAN-B clients sit behind Router0 Gi0/1 and the DHCP service answers at 10.0.1.1. Where must <code>ip helper-address 10.0.1.1</code> be configured?</p>",
          options: ["Global configuration mode", "Interface Gi0/0 (LAN-A side)", "Interface Gi0/1 (LAN-B side)", "Inside pool LAN-B"], answer: 2,
          why: ["It is an interface command.", "Gi0/0 faces LAN-A. LAN-B's broadcasts never arrive there.", "Correct. The helper relays broadcasts that arrive on this interface and sets giaddr = 10.0.2.1.", "Pools define addresses. They do not relay."],
          explain: "<p>Configure it on the client-facing interface. The server picks pool LAN-B from giaddr.</p>" },
        { id: "u15-D-2", type: "num", tag: "GATE-style", topic: "15.12",
          q: "<p>The 802.1Q VLAN ID field is 12 bits, and the values 0 and 4095 are reserved. How many usable VLAN IDs are there? (Integer.)</p>",
          answer: 4094, tol: 0, unit: "VLANs", verify: "2**12 - 2",
          steps: [ { tex: "2^{12} = 4096", why: "A 12-bit field holds 4096 values." }, { tex: "4096 - 2 = 4094", why: "Remove the two reserved IDs (0 and 4095)." } ],
          explain: "<p>VLANs 1–4094.</p>" },
        { id: "u15-D-3", type: "num", tag: "GATE-style", topic: "15.12",
          q: "<p>An untagged Ethernet frame is at most 1518 bytes (header + 1500 payload + FCS). What is the maximum size of the same frame carried on an 802.1Q trunk? (Bytes.)</p>",
          answer: 1522, tol: 0, unit: "bytes", verify: "1518 + 4",
          steps: [ { tex: "1518 + 4 = 1522", why: "The tag adds TPID (2 B) + PCP/DEI/VID (2 B)." } ],
          explain: "<p>1522 bytes. The payload is still 1500.</p>" },
        { id: "u15-D-4", type: "mcq", tag: "University-Midsem-style", topic: "15.12",
          q: "<p>What does <code>encapsulation dot1Q 20</code> under <code>interface GigabitEthernet0/0.20</code> do?</p>",
          options: ["Creates VLAN 20 on the switch", "Makes the subinterface accept and send frames tagged with VLAN ID 20, so its IP acts as VLAN 20's gateway", "Sets the DHCP lease time to 20 hours", "Turns Gi0/0 into an access port in VLAN 20"], answer: 1,
          why: ["VLANs are created on the switch with vlan 20.", "Correct: this is the core of router-on-a-stick.", "Lease time is not configured here.", "Router ports are not switchports; the trunk is configured on the switch side."],
          explain: "<p>Each subinterface = one VLAN's gateway on a single physical link.</p>" },
        { id: "u15-D-5", type: "msq", tag: "University-Midsem-style", topic: "15.12",
          q: "<p>In lab A2, PC0 (VLAN 10) cannot ping PC6 (VLAN 30). Which of these misconfigurations could each cause it on its own? (Select all that apply.)</p>",
          options: ["ManagedSwitch0 Fa0/1 left as an access port", "Gi0/0 never given no shutdown", "Gi0/0.30 configured with encapsulation dot1Q 20", "Pool STAFF missing", "PC0 and PC6 on the same switch"], answer: [0, 1, 2],
          why: ["Then only one VLAN's frames reach the router.", "The subinterfaces inherit the physical port's down state.", "VLAN 30's tagged frames would not match the .30 subinterface.", "STAFF is VLAN 20; PC0 and PC6 do not use it.", "That is the design. VLANs separate them, and the router joins them."],
          explain: "<p>Check trunk, physical port up, and the dot1Q tag matching the VLAN.</p>" },
        { id: "u15-D-6", type: "mcq", tag: "University-Midsem-style", topic: "15.11",
          q: "<p>In lab A1 a student runs <code>ipconfig</code> (DHCP) in the order PC3, PC2 instead of PC2, PC3. What does PC3 get?</p>",
          options: ["10.0.2.3", "10.0.2.2", "10.0.1.3", "169.254.0.3"], answer: 1,
          why: ["That is what PC3 would get in the correct order.", "Correct. LAN-B leases start at .2, so whoever asks first gets 10.0.2.2, which no longer matches the lab's IP table.", "That is LAN-A's pool.", "DHCP is working; there is no reason for APIPA."],
          explain: "<p>That is why the lab insists on a strict order: the grader checks the exact addresses.</p>" },
        { id: "u15-D-7", type: "num", tag: "University-Midsem-style", topic: "15.11",
          q: "<p>Pool GAMING is 192.168.10.0/24 and the administrator excludes 192.168.10.1 to 192.168.10.10 from leasing. How many addresses can the pool lease? (Integer.)</p>",
          answer: 244, tol: 0, unit: "addresses", verify: "2**8 - 2 - 10",
          steps: [ { tex: "2^8 - 2 = 254", why: "Usable host addresses in a /24." }, { tex: "254 - 10 = 244", why: "Addresses .1 to .10 inclusive are 10 addresses." } ],
          explain: "<p>244 leaseable addresses (.11 to .254).</p>" }
      ]
    }
    // @@NEXT@@
  ]
};
