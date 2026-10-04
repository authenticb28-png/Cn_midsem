// Unit 01: The Internet: Edge, Core, Access, traceroute & AWS vocabulary (WB-L01, WB-L04 p30–32)
window.UNITS = window.UNITS || {};
window.UNITS["unit01"] = {
  id: "unit01", num: 1, day: 1,
  title: "The Internet: Edge, Core, Access, traceroute & AWS vocabulary",
  lectures: "Lecture 1 · WB-L01 (+ WB-L04 p30–32)",
  overview: "<p>Lecture 1 is mostly vocabulary and pictures, so it is <b>MCQ territory</b>: the PAN/LAN/MAN/WAN scope ladder, the edge / access / core split of the Internet, what each line of a <code>traceroute</code> means, and the AWS words Region, Availability Zone and Edge Location. The numericals hide in <b>units and readings</b>: GB/s vs Gbps (a factor of 8), average RTT per hop, and availability percentages. The coding angle is parsing traceroute output and building TTL-limited probe packets by hand.</p>" +
            "<p>Study order: 01-A and 01-B are quick reads (20 min), 01-C is the researched theory the quiz tests (25 min), 01-D traceroute is the most examinable (30 min), 01-E AWS vocabulary (15 min).</p>",
  sections: [
    // ------------------------------------------------------------------ 01-A
    {
      id: "01-A",
      title: "Why networks: the cloud, a little history, and network scope (PAN/LAN/MAN/WAN)",
      badge: "class",
      source: "WB-L01 p3–16",
      covers: ["01.1", "01.2", "01.3"],
      blocks: [
        { type: "intuition", title: "The cloud is a city of computers that must talk",
          html: "<p><b>Analogy.</b> \"Is the cloud just someone else's computer?\" (WB-L01 p3). The slides answer: <i>more like a lot of computers. A lot, lot!</i> Picture Google's data centre in Council Bluffs, Iowa (p6): aisles of racks, thousands of servers, and <b>all these servers need to talk to each other</b> and to you. AWS, Azure and Google Cloud all run very fast networks for exactly that reason (p7).</p>" +
                "<p><b>Precise definitions.</b> A <b>computer network</b> is a set of end systems (hosts) connected by communication links and packet switches (Kurose &amp; Ross §1.1). <b>Cloud computing</b> is the on-demand delivery of IT resources over the Internet with pay-as-you-go pricing (AWS documentation). The cloud is therefore <i>physical</i>: data centres, cables and routers.</p>" +
                "<p><b>History (p8).</b> In 1969 a UCLA computer tried to send <code>login</code> to the Stanford Research Institute over the ARPANET, the Internet's ancestor. Only <code>lo</code> arrived before the system crashed: the first network message.</p>" },
        { type: "figure", caption: "WB-L01 p12 \"Geographical scope\": four nested rings. PAN sits inside LAN, inside MAN, inside WAN.",
          html: "<svg viewBox='0 0 600 310' width='100%' role='img' aria-label='Nested PAN LAN MAN WAN scope rings'>" +
                "<ellipse cx='300' cy='165' rx='290' ry='140' fill='none' stroke='var(--accent)' stroke-width='2'/>" +
                "<ellipse cx='300' cy='180' rx='215' ry='105' fill='none' stroke='var(--ok)' stroke-width='2'/>" +
                "<ellipse cx='300' cy='195' rx='140' ry='70' fill='none' stroke='var(--warn)' stroke-width='2'/>" +
                "<ellipse cx='300' cy='208' rx='62' ry='32' fill='none' stroke='var(--bad)' stroke-width='2'/>" +
                "<text x='300' y='45' text-anchor='middle' fill='currentColor' font-size='14' font-weight='bold'>WAN · Wide Area Network</text>" +
                "<text x='300' y='62' text-anchor='middle' fill='var(--muted)' font-size='12'>100 km, 1000 km (country, continent); the Internet itself</text>" +
                "<text x='300' y='97' text-anchor='middle' fill='currentColor' font-size='14' font-weight='bold'>MAN · Metropolitan Area Network</text>" +
                "<text x='300' y='113' text-anchor='middle' fill='var(--muted)' font-size='12'>about 10 km (a city)</text>" +
                "<text x='300' y='145' text-anchor='middle' fill='currentColor' font-size='14' font-weight='bold'>LAN · Local Area Network</text>" +
                "<text x='300' y='161' text-anchor='middle' fill='var(--muted)' font-size='12'>10 m, 100 m, 1 km (room, building, campus)</text>" +
                "<text x='300' y='206' text-anchor='middle' fill='currentColor' font-size='13' font-weight='bold'>PAN</text>" +
                "<text x='300' y='222' text-anchor='middle' fill='var(--muted)' font-size='11'>about 1 m around you</text>" +
                "</svg>" },
        { type: "table", head: ["Type", "Full name", "Range (WB-L01 p12)", "Slide example", "Typical technology"],
          rows: [
            ["PAN", "Personal Area Network", "about 1 square metre around a person", "smartphone ↔ smartwatch or wireless headphones", "Bluetooth (IEEE 802.15.1), USB"],
            ["LAN", "Local Area Network", "10 m (room), 100 m (building), 1 km (campus)", "home or office computers", "Ethernet (IEEE 802.3), WiFi (IEEE 802.11)"],
            ["MAN", "Metropolitan Area Network", "about 10 km (a city)", "municipality or large organisation across a city", "metro Ethernet, city fibre rings"],
            ["WAN", "Wide Area Network", "100 km to 1000 km and beyond (country, continent)", "branch offices of a company; the Internet itself", "leased lines, MPLS, long-haul and submarine fibre"] ],
          caption: "Scope ladder. A campus up to about 1 km is still a LAN on the slide, not a MAN." },
        { type: "callout", kind: "key", title: "The Internet is physical (WB-L01 p13–16)",
          html: "<p>Despite the name \"cloud\", the Internet relies on massive physical infrastructure: <b>597 submarine cable systems in 2025</b> (p13). Cables are laid by a ship that tows a plough along the seabed and buries the optical cable behind it (p14). The main threat is not sharks: <b>about 70% of undersea cable damage comes from fishing anchors and trawlers</b> (p15). The shark video (p16) is the joke; the VICE headline on p15 says sharks are not the real cause.</p>" },
        { type: "derivation", title: "How far is a scope in time? One-way propagation across a MAN",
          steps: [
            { tex: "d_{prop} = \\frac{d}{s}", why: "Propagation delay is distance divided by signal speed (Kurose §1.4); it links scope to latency." },
            { tex: "d = 10\\,\\text{km} = 10^{4}\\,\\text{m}, \\quad s = 2\\times10^{8}\\,\\text{m/s}", why: "The slide's MAN range is about 10 km; light in fibre travels at about two-thirds of c." },
            { tex: "d_{prop} = \\frac{10^{4}}{2\\times10^{8}} = 5\\times10^{-5}\\,\\text{s}", why: "Divide; the powers of ten give 10^(4-8) = 10^-4, times 1/2." },
            { tex: "d_{prop} = 50\\,\\mu\\text{s}", why: "Multiply by 10^6 to convert seconds to microseconds. A 1000 km WAN link is 100 times longer: 5 ms." } ] },
        { type: "cheat", title: "Scope and history in one glance",
          items: [ "PAN ≈ 1 m · LAN ≤ 1 km (room / building / campus) · MAN ≈ 10 km (city) · WAN ≥ 100 km (country, continent, Internet)",
                   "Network = end systems + communication links + packet switches (routers and link-layer switches)",
                   "1969 ARPANET: UCLA → SRI, \"login\" sent, only \"lo\" arrived",
                   "597 submarine cable systems (2025); about 70% of cable damage = anchors and trawlers",
                   "Cloud providers named on the slide: AWS, Microsoft Azure, Google Cloud Platform (GCP)" ] },
        { type: "worked", title: "Classify and time four links", tag: "University-Midsem-style",
          problem: "<p>Classify each link by scope using WB-L01 p12, then give the one-way propagation delay in fibre ($s = 2\\times10^8$ m/s): (a) phone to earbuds, 0.5 m; (b) two buildings on one campus, 800 m; (c) two offices in the same city, 8 km; (d) Mumbai to Delhi, about 1400 km of fibre.</p>",
          steps: [
            { text: "(a) 0.5 m is around one person: PAN. Delay = 0.5 / 2×10^8 = 2.5 ns.", why: "Below 1 m is the innermost ring." },
            { text: "(b) 800 m is within the 1 km campus range: LAN. Delay = 800 / 2×10^8 = 4 µs.", why: "The slide puts 'campus' in LAN, not MAN." },
            { text: "(c) 8 km is a city: MAN. Delay = 8000 / 2×10^8 = 40 µs.", why: "About 10 km is the MAN ring." },
            { text: "(d) 1400 km crosses a country: WAN. Delay = 1.4×10^6 / 2×10^8 = 7 ms.", why: "Beyond 100 km is the WAN ring; 1.4/2 = 0.7, times 10^(6-8) = 7×10^-3 s." } ],
          answer: "<b>PAN 2.5 ns; LAN 4 µs; MAN 40 µs; WAN 7 ms.</b> Only the WAN delay is large enough to feel." },
        { type: "code", file: "Unit01_scope_and_units.py", level: "low", title: "Scope classifier, GB/s ↔ Gbps converter and availability arithmetic, all by hand" },
        { type: "traps", items: [
            "A <b>campus</b> network (up to about 1 km) is a <b>LAN</b> on the slide, not a MAN.",
            "\"The cloud\" is not wireless magic: it is data centres joined by fibre, including 597 submarine cable systems.",
            "Sharks are a meme; the dominant cause of submarine cable faults is <b>anchors and trawlers (about 70%)</b>.",
            "Scope is about geography, not speed: a 10 Gbps LAN is still a LAN, and a slow satellite link to another country is still a WAN." ] }
      ],
      practice: [
        { id: "u01-A-1", type: "mcq", tag: "University-Midsem-style", topic: "01.2",
          q: "<p>Your smartphone streams music to wireless earbuds over Bluetooth. Which network type is this, by the WB-L01 p12 scope ladder?</p>",
          options: ["PAN", "LAN", "MAN", "WAN"], answer: 0,
          why: ["Correct: the slide's PAN example is exactly phone to smartwatch or headphones, about 1 m around a person.",
                "A LAN spans a room, building or campus (10 m to 1 km) and joins many computers.",
                "A MAN spans a city (about 10 km).",
                "A WAN spans countries or continents."],
          explain: "<p>Personal Area Network: very short range around one person.</p>" },
        { id: "u01-A-2", type: "mcq", tag: "University-Midsem-style", topic: "01.2",
          q: "<p>A university connects 12 buildings spread over a 900 m campus with its own switches and fibre. Using the slide's ranges, this network is best described as a:</p>",
          options: ["PAN", "LAN", "MAN", "WAN"], answer: 1,
          why: ["PAN is around one person.",
                "Correct: WB-L01 p12 lists 10 m / 100 m / 1 km (room, building, campus) as LAN.",
                "Tempting, but a MAN is city-scale (about 10 km); 900 m is campus scale.",
                "A WAN is country or continent scale."],
          explain: "<p>The trap is thinking \"many buildings\" means MAN. Distance decides: 1 km or less is LAN.</p>" },
        { id: "u01-A-3", type: "msq", tag: "University-Midsem-style", topic: "01.1",
          q: "<p>Which statements match WB-L01 p3–8? (Select all that apply.)</p>",
          options: ["The cloud is many data centres full of servers that must communicate", "AWS, Azure and GCP each run very fast computer networks", "Computer networks are a 21st-century invention", "In the first ARPANET message attempt, only \"lo\" of \"login\" arrived"],
          answer: [0, 1, 3],
          why: ["Correct: pp4–6 (\"a lot, lot!\" of computers; the servers need to talk to each other).",
                "Correct: p7.",
                "Wrong: p8 says networks are not new; the UCLA to SRI attempt was in 1969.",
                "Correct: p8, the system crashed after \"lo\"."],
          explain: "<p>Three of four are straight from the slides; the history slide exists to show networks are decades old.</p>" },
        { id: "u01-A-4", type: "mcq", tag: "University-Midsem-style", topic: "01.3",
          q: "<p>According to WB-L01 p15, what causes most damage to undersea Internet cables?</p>",
          options: ["Shark bites", "Earthquakes and volcanoes", "Fishing anchors and trawlers (about 70%)", "Solar storms"],
          answer: 2,
          why: ["The shark video (p16) is a joke; the p15 headline says sharks are not the real cause.",
                "Natural events do break cables, but the slide's figure is about human activity.",
                "Correct: \"70% of undersea cable: anchors &amp; trawlers\".",
                "Not mentioned and not a major cause of physical cable faults."],
          explain: "<p>Human activity (anchors, nets, trawling) causes the vast majority of faults.</p>" },
        { id: "u01-A-5", type: "num", tag: "University-Midsem-style", topic: "01.2",
          q: "<p>A MAN link runs 10 km of fibre with signal speed $2\\times10^8$ m/s. What is the one-way propagation delay in <b>microseconds</b> (integer)?</p>",
          answer: 50, tol: 0, unit: "µs", verify: "round(10e3/2e8*1e6)",
          formula: "d_{prop} = \\frac{d}{s}",
          steps: [ { tex: "d_{prop} = \\frac{10^{4}\\,\\text{m}}{2\\times10^{8}\\,\\text{m/s}} = 5\\times10^{-5}\\,\\text{s}", why: "Distance over speed, both in SI units." },
                   { tex: "5\\times10^{-5}\\,\\text{s}\\times10^{6} = 50\\,\\mu\\text{s}", why: "1 s = 10^6 µs." } ],
          explain: "<p>City-scale links add only tens of microseconds; distance only starts to dominate at WAN scale.</p>" },
        { id: "u01-A-6", type: "text", tag: "University-Midsem-style", topic: "01.2",
          q: "<p>Predict the exact output.</p>",
          code: "def scope(m):\n    if m <= 1:\n        return \"PAN\"\n    if m <= 1000:\n        return \"LAN\"\n    if m <= 10000:\n        return \"MAN\"\n    return \"WAN\"\n\nprint(\",\".join(scope(d) for d in (0.3, 250, 4000, 2e6)))",
          answer: "PAN,LAN,MAN,WAN", runCheck: true,
          explain: "<p>0.3 m ≤ 1 → PAN; 250 m ≤ 1000 → LAN; 4000 m ≤ 10000 → MAN; 2,000,000 m → WAN. The join puts commas with no spaces.</p>" }
      ]
    },
    // ------------------------------------------------------------------ 01-B
    {
      id: "01-B",
      title: "The \"tap Instagram\" gap, the top-down approach, and GPU network fabrics",
      badge: "class",
      source: "WB-L01 p17–22",
      covers: ["01.4", "01.5"],
      blocks: [
        { type: "intuition", title: "Most people stop at \"WiFi → Instagram\"",
          html: "<p><b>Analogy.</b> Ask someone how a parcel reaches them and they say \"the courier brought it\". In reality it went through a sorting hub, a long-haul truck, a city depot and a delivery van. WB-L01 p17 asks the same about a reel: <i>list every thing your data touched between your thumb and the video</i>. The <b>gap</b> between \"WiFi → Instagram\" and reality is what this course studies.</p>" +
                "<p><b>Top-down approach (p21, Kurose &amp; Ross §1.5).</b> Start with <b>applications</b> you already use (Web, HTTP, DNS, streaming), because their needs explain <i>why</i> the lower layers exist. Then drill down through <b>Transport</b> (TCP/UDP), <b>Network</b> (IP and routing), <b>Link</b> and <b>Physical</b>. The course always answers \"why\" before \"what\".</p>" },
        { type: "figure", caption: "WB-L01 p21: the top-down order of the course (Kurose's five layers). Study order runs from the top layer to the bottom one.",
          html: "<svg viewBox='0 0 600 270' width='100%' role='img' aria-label='Top-down layer order'>" +
                "<rect x='20' y='10' width='420' height='44' rx='8' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='35' y='37' fill='currentColor' font-size='14'><tspan font-weight='bold'>Application</tspan> · Web, HTTP, DNS, streaming</text>" +
                "<rect x='20' y='62' width='420' height='44' rx='8' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='35' y='89' fill='currentColor' font-size='14'><tspan font-weight='bold'>Transport</tspan> · TCP, UDP, ports</text>" +
                "<rect x='20' y='114' width='420' height='44' rx='8' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='35' y='141' fill='currentColor' font-size='14'><tspan font-weight='bold'>Network</tspan> · IP addressing and routing</text>" +
                "<rect x='20' y='166' width='420' height='44' rx='8' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='35' y='193' fill='currentColor' font-size='14'><tspan font-weight='bold'>Link</tspan> · Ethernet, WiFi, MAC addresses</text>" +
                "<rect x='20' y='218' width='420' height='44' rx='8' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='35' y='245' fill='currentColor' font-size='14'><tspan font-weight='bold'>Physical</tspan> · bits on copper, fibre, radio</text>" +
                "<line x1='500' y1='20' x2='500' y2='245' stroke='var(--warn)' stroke-width='3'/><path d='M490,235 L500,258 L510,235 z' fill='var(--warn)'/>" +
                "<text x='520' y='120' fill='var(--warn)' font-size='13'>course</text><text x='520' y='137' fill='var(--warn)' font-size='13'>order</text>" +
                "</svg>" },
        { type: "table", head: ["#", "Thing your data touches (tap Instagram)", "Layer doing the work", "Part of the network"],
          rows: [
            ["1", "Instagram app builds an HTTPS request for the reel", "Application", "Edge (your end system)"],
            ["2", "DNS lookup turns the CDN hostname into an IP address", "Application (DNS over UDP port 53)", "Edge → ISP resolver"],
            ["3", "TCP or QUIC connection plus TLS handshake", "Transport (+ TLS)", "End to end"],
            ["4", "Phone's WiFi radio sends frames to the home access point", "Link + Physical", "Access network"],
            ["5", "Home router (192.168.1.1) forwards and NATs the packet", "Network", "Access network (home edge)"],
            ["6", "DSL / cable / fibre line to the ISP's first (edge) router", "Physical + Link", "Access network"],
            ["7", "ISP and backbone routers forward hop by hop", "Network", "Core"],
            ["8", "Peering link or IXP into Meta's own network", "Network", "Core"],
            ["9", "CDN edge server near you returns video segments", "Application", "Edge (server end system)"],
            ["10", "Every packet of the reel travels back along a (possibly different) reverse path", "All layers", "Core + access + edge"] ],
          caption: "One researched answer to the WB-L01 p17 question. The slide gives no answer; Kurose &amp; Ross §1.1–1.3 supply the parts." },
        { type: "callout", kind: "key", title: "WB-L01 p18: Netflix at 10 PM starts buffering",
          html: "<p>Millions press play at once. What is happening behind the scenes? Candidate causes, each tied to a later lecture: (1) the <b>access link</b> or home WiFi is the bottleneck; (2) <b>queues fill</b> on congested ISP links, packets are dropped and TCP slows down (WB-L02, SL-L11); (3) the nearby <b>CDN edge</b> is overloaded or misses the cache and fetches from far away (WB-L07); (4) <b>DNS</b> steers you to a distant server (WB-L08). Throughput is set by the slowest link on the path, not by your plan speed.</p>" },
        { type: "figure", caption: "WB-L01 p22 redrawn: inside a node GPUs talk over NVLink; between nodes the Host Channel Adapter (Mellanox HCA) sends GPU memory straight onto the InfiniBand fabric (RDMA).",
          html: "<svg viewBox='0 0 620 230' width='100%' role='img' aria-label='GPU RDMA path over InfiniBand'>" +
                "<rect x='15' y='15' width='250' height='170' rx='10' fill='none' stroke='var(--muted)' stroke-width='2'/><text x='140' y='35' text-anchor='middle' fill='currentColor' font-size='13' font-weight='bold'>Host 1</text>" +
                "<rect x='355' y='15' width='250' height='170' rx='10' fill='none' stroke='var(--muted)' stroke-width='2'/><text x='480' y='35' text-anchor='middle' fill='currentColor' font-size='13' font-weight='bold'>Host 2</text>" +
                "<rect x='30' y='50' width='95' height='34' rx='5' fill='none' stroke='var(--accent)'/><text x='77' y='72' text-anchor='middle' fill='currentColor' font-size='12'>GPU + memory</text>" +
                "<rect x='150' y='50' width='95' height='34' rx='5' fill='none' stroke='var(--accent)'/><text x='197' y='72' text-anchor='middle' fill='currentColor' font-size='12'>GPU + memory</text>" +
                "<line x1='125' y1='67' x2='150' y2='67' stroke='var(--ok)' stroke-width='4'/><text x='137' y='100' text-anchor='middle' fill='var(--ok)' font-size='11'>NVLink</text><text x='137' y='113' text-anchor='middle' fill='var(--ok)' font-size='11'>200 GB/s</text>" +
                "<line x1='30' y1='128' x2='250' y2='128' stroke='var(--muted)' stroke-width='3'/><text x='40' y='122' fill='var(--muted)' font-size='11'>PCI-e bus</text>" +
                "<rect x='90' y='140' width='110' height='32' rx='5' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='145' y='161' text-anchor='middle' fill='currentColor' font-size='12'>Mellanox HCA</text>" +
                "<rect x='370' y='50' width='95' height='34' rx='5' fill='none' stroke='var(--accent)'/><text x='417' y='72' text-anchor='middle' fill='currentColor' font-size='12'>GPU + memory</text>" +
                "<rect x='490' y='50' width='95' height='34' rx='5' fill='none' stroke='var(--accent)'/><text x='537' y='72' text-anchor='middle' fill='currentColor' font-size='12'>GPU + memory</text>" +
                "<line x1='465' y1='67' x2='490' y2='67' stroke='var(--ok)' stroke-width='4'/>" +
                "<line x1='370' y1='128' x2='590' y2='128' stroke='var(--muted)' stroke-width='3'/>" +
                "<rect x='420' y='140' width='110' height='32' rx='5' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='475' y='161' text-anchor='middle' fill='currentColor' font-size='12'>Mellanox HCA</text>" +
                "<line x1='200' y1='156' x2='420' y2='156' stroke='var(--bad)' stroke-width='3'/><text x='310' y='148' text-anchor='middle' fill='var(--bad)' font-size='12'>InfiniBand network</text><text x='310' y='210' text-anchor='middle' fill='var(--bad)' font-size='12'>200 Gbps (gigaBITS per second) = 25 GB/s</text>" +
                "</svg>" },
        { type: "derivation", title: "GB/s vs Gbps: NVLink 200 GB/s against InfiniBand 200 Gbps",
          steps: [
            { tex: "1\\,\\text{byte} = 8\\,\\text{bits} \\Rightarrow 1\\,\\text{GB/s} = 8\\,\\text{Gb/s}", why: "Capital B is bytes, small b is bits; the prefix G = 10^9 is the same on both sides." },
            { tex: "200\\,\\text{GB/s} = 200\\times8 = 1600\\,\\text{Gbps}", why: "Convert NVLink to bits per second so both links are in the same unit." },
            { tex: "200\\,\\text{Gbps} = \\frac{200}{8} = 25\\,\\text{GB/s}", why: "Or convert InfiniBand to bytes per second; either direction works." },
            { tex: "\\frac{1600\\,\\text{Gbps}}{200\\,\\text{Gbps}} = 8", why: "Same printed number, but NVLink inside the node is 8 times faster than the InfiniBand link between nodes." },
            { tex: "t = \\frac{\\text{size in bits}}{\\text{rate}} = \\frac{80\\times8\\,\\text{Gb}}{200\\,\\text{Gbps}} = 3.2\\,\\text{s}", why: "Moving an 80 GB tensor between nodes; over NVLink the same 80 GB takes 80/200 = 0.4 s." } ] },
        { type: "cheat", title: "Units and the course map",
          items: [ "B = byte, b = bit; 1 GB/s = 8 Gbps; 1 Gbps = 0.125 GB/s",
                   "Network rates use decimal prefixes: 1 Gbps = 10^9 bit/s (not 2^30)",
                   "NVLink: GPU ↔ GPU inside a server (200 GB/s on the slide). InfiniBand: server ↔ server through an HCA (200 Gbps on the slide)",
                   "Transfer time $t = \\dfrac{8 \\times \\text{bytes}}{\\text{rate in bit/s}}$",
                   "Top-down order: Application → Transport → Network → Link → Physical (why before what)" ] },
        { type: "worked", title: "Gradient exchange inside and between GPU nodes", tag: "University-Midsem-style",
          problem: "<p>A training step must move 120 GB of gradients (a) between two GPUs in the same node over 200 GB/s NVLink and (b) between two nodes over 200 Gbps InfiniBand. Ignore protocol overhead. Find both times and the difference in seconds.</p>",
          steps: [
            { tex: "t_a = \\frac{120\\,\\text{GB}}{200\\,\\text{GB/s}} = 0.6\\,\\text{s}", why: "Both quantities are in bytes, so divide directly." },
            { tex: "120\\,\\text{GB} = 120\\times8 = 960\\,\\text{Gb}", why: "InfiniBand is quoted in bits per second, so convert the size to bits first." },
            { tex: "t_b = \\frac{960\\,\\text{Gb}}{200\\,\\text{Gbps}} = 4.8\\,\\text{s}", why: "Divide bits by bits per second." },
            { tex: "t_b - t_a = 4.8 - 0.6 = 4.2\\,\\text{s}", why: "Subtract; the ratio is 4.8 / 0.6 = 8, the bytes-to-bits factor." } ],
          answer: "<b>NVLink 0.6 s, InfiniBand 4.8 s, difference 4.2 s</b> (InfiniBand is 8 times slower here despite the same \"200\")." },
        { type: "traps", items: [
            "200 GB/s and 200 Gbps are <b>not</b> the same: GB/s is 8 times bigger. Always rewrite both in one unit first.",
            "Storage tools often show GiB ($2^{30}$ bytes); network rates are always decimal ($10^9$ bits). In exam numericals use decimal unless told otherwise.",
            "\"WiFi → Instagram\" skips DNS, the home router, the ISP access link, the core, peering and the CDN edge server.",
            "Top-down is a <i>teaching order</i>; data still goes down the stack at the sender and up at the receiver." ] }
      ],
      practice: [
        { id: "u01-B-1", type: "mcq", tag: "University-Midsem-style", topic: "01.4",
          q: "<p>The course follows a top-down approach (WB-L01 p21). Where does it start, and why?</p>",
          options: ["Physical layer, because bits are the foundation", "Application layer, because application needs explain why lower-layer services exist", "Network layer, because IP is the most important protocol", "Transport layer, because TCP is in the middle"],
          answer: 1,
          why: ["That is bottom-up (the classic Tanenbaum order), not this course's approach.",
                "Correct: \"Applications first. This approach constantly answers 'why' before 'what'\".",
                "IP is central, but the course does not start there.",
                "The course reaches Transport second, after the Application layer."],
          explain: "<p>Kurose &amp; Ross's top-down order: Application, Transport, Network, Link, Physical.</p>" },
        { id: "u01-B-2", type: "num", tag: "University-Midsem-style", topic: "01.5",
          q: "<p>NVLink is quoted at 200 GB/s on WB-L01 p22. Express it in <b>Gbps</b> (integer).</p>",
          answer: 1600, tol: 0, unit: "Gbps", verify: "200*8",
          steps: [ { tex: "200\\,\\text{GB/s}\\times 8\\,\\tfrac{\\text{bits}}{\\text{byte}} = 1600\\,\\text{Gbps}", why: "Each byte is 8 bits; the G prefix is unchanged." } ],
          explain: "<p>1600 Gbps, which is 8 times the 200 Gbps InfiniBand link on the same slide.</p>" },
        { id: "u01-B-3", type: "num", tag: "University-Midsem-style", topic: "01.5",
          q: "<p>How many <b>seconds</b> does it take to send a 25 GB checkpoint over a 200 Gbps InfiniBand link, ignoring overhead? (1 decimal)</p>",
          answer: 1.0, tol: 0.01, unit: "s", verify: "25*8/200",
          formula: "t = \\frac{8 \\times \\text{bytes}}{R}",
          steps: [ { tex: "25\\,\\text{GB} = 200\\,\\text{Gb}", why: "Multiply by 8 to get bits." },
                   { tex: "t = \\frac{200\\,\\text{Gb}}{200\\,\\text{Gbps}} = 1.0\\,\\text{s}", why: "Bits divided by bits per second." } ],
          explain: "<p>A student who forgets the factor 8 answers 0.125 s.</p>" },
        { id: "u01-B-4", type: "mcq", tag: "University-Midsem-style", topic: "01.5",
          q: "<p>In the WB-L01 p22 diagram, which component connects a host's PCI-e bus to the InfiniBand network so GPU memory can be sent directly to another node?</p>",
          options: ["NVLink bridge", "Mellanox HCA (Host Channel Adapter)", "The CPU's system memory", "An Ethernet hub"],
          answer: 1,
          why: ["NVLink joins GPUs inside one node; it does not leave the server.",
                "Correct: the HCA is InfiniBand's network adapter and supports RDMA (remote direct memory access).",
                "System memory sits on the PCI-e bus but is bypassed in the GPU-to-GPU RDMA path.",
                "Hubs are Layer-1 Ethernet devices and are not in the diagram."],
          explain: "<p>The orange arrow on p22 runs GPU memory → HCA → network → HCA → GPU memory.</p>" },
        { id: "u01-B-5", type: "msq", tag: "University-Midsem-style", topic: "01.4",
          q: "<p>When you tap Instagram on home WiFi, which of these does your data actually pass through or use? (Select all that apply.)</p>",
          options: ["Your home WiFi access point / router", "A DNS resolver that maps the server name to an IP address", "Routers inside your ISP and the Internet core", "A dedicated circuit reserved end to end by a telephone exchange"],
          answer: [0, 1, 2],
          why: ["Correct: the first hop (WB-L01 p30 shows it as 192.168.1.1).",
                "Correct: a name lookup happens before the connection opens.",
                "Correct: packets are forwarded hop by hop through the ISP and core.",
                "Wrong: the Internet is packet switched; no end-to-end circuit is reserved (WB-L02)."],
          explain: "<p>This is the \"gap\" the slide talks about: most people only name the first and the last item.</p>" },
        { id: "u01-B-6", type: "text", tag: "University-Midsem-style", topic: "01.5",
          q: "<p>Predict the exact output.</p>",
          code: "nvlink_GBps = 200\nib_Gbps = 200\nratio = nvlink_GBps * 8 // ib_Gbps\nprint(ratio, nvlink_GBps * 8)",
          answer: "8 1600", runCheck: true,
          explain: "<p>200 × 8 = 1600 Gbps; 1600 // 200 = 8. print separates the two values with one space.</p>" }
      ]
    },
    // ------------------------------------------------------------------ 01-C
    {
      id: "01-C",
      title: "The Internet as a network of networks: edge, access, core and ISP tiers",
      badge: "researched",
      source: "Kurose & Ross 8e §1.1–1.3; Study Pack L01 quiz Q1–Q4",
      covers: ["01.7", "Q.1"],
      blocks: [
        { type: "intuition", title: "Driveways, local roads and highways",
          html: "<p><b>Analogy.</b> Your house is an <b>end system</b>. The lane from your gate to the main road is the <b>access network</b>. The national highways with their interchanges are the <b>core</b>. Different road authorities own different stretches and meet at junctions where they agree to let traffic through: those are ISPs <b>peering</b>, often at an <b>Internet Exchange Point</b>.</p>" +
                "<p><b>Nuts-and-bolts view (Kurose §1.1.1).</b> The Internet is billions of <b>hosts / end systems</b> running network applications, joined by <b>communication links</b> (copper, fibre, radio, satellite; rate in bits per second) and <b>packet switches</b> (routers and link-layer switches), organised into <b>ISPs</b>, all running <b>protocols</b> (TCP, IP, HTTP, Ethernet, 802.11) defined by <b>standards</b> (IETF RFCs, IEEE 802).</p>" +
                "<p><b>Service view (Kurose §1.1.2).</b> The Internet is an <b>infrastructure that provides services to distributed applications</b>; applications use it through a <b>socket interface</b> that says how to ask for data delivery.</p>" +
                "<p><b>Protocol (Kurose's definition).</b> A protocol defines the <b>format and the order of messages</b> exchanged between two or more communicating entities, and the <b>actions taken</b> on sending or receiving a message or other event.</p>" +
                "<p><b>Network of networks.</b> No one owns the Internet. Thousands of independently administered networks (access ISPs, regional ISPs, tier-1 ISPs, content-provider networks) interconnect using shared protocols.</p>" },
        { type: "figure", caption: "Edge, access and core. End systems (including data-centre servers) are at the edge; access networks connect them to their first (edge) router; the core is the mesh of ISP routers, tied together by tier-1 ISPs, peering links and IXPs.",
          html: "<svg viewBox='0 0 640 330' width='100%' role='img' aria-label='Edge access core map'>" +
                "<text x='95' y='14' text-anchor='middle' fill='var(--muted)' font-size='12' font-weight='bold'>EDGE + ACCESS NETWORKS</text>" +
                "<text x='465' y='14' text-anchor='middle' fill='var(--muted)' font-size='12' font-weight='bold'>NETWORK CORE</text>" +
                "<line x1='262' y1='20' x2='262' y2='320' stroke='var(--muted)' stroke-dasharray='5 5'/>" +
                "<rect x='8' y='25' width='180' height='72' rx='8' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='18' y='45' fill='currentColor' font-size='12' font-weight='bold'>Home</text><text x='18' y='63' fill='currentColor' font-size='11'>laptop → WiFi access point</text><text x='18' y='80' fill='currentColor' font-size='11'>→ DSL / cable / FTTH modem</text>" +
                "<rect x='8' y='125' width='180' height='72' rx='8' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='18' y='145' fill='currentColor' font-size='12' font-weight='bold'>Campus / enterprise</text><text x='18' y='163' fill='currentColor' font-size='11'>PCs → Ethernet switch</text><text x='18' y='180' fill='currentColor' font-size='11'>phones → campus WiFi</text>" +
                "<rect x='8' y='225' width='180' height='72' rx='8' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='18' y='245' fill='currentColor' font-size='12' font-weight='bold'>Mobile</text><text x='18' y='263' fill='currentColor' font-size='11'>phone → 4G / 5G base station</text><text x='18' y='280' fill='currentColor' font-size='11'>(range: kilometres)</text>" +
                "<circle cx='228' cy='61' r='16' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='228' y='65' text-anchor='middle' fill='currentColor' font-size='10'>R</text>" +
                "<circle cx='228' cy='161' r='16' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='228' y='165' text-anchor='middle' fill='currentColor' font-size='10'>R</text>" +
                "<circle cx='228' cy='261' r='16' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='228' y='265' text-anchor='middle' fill='currentColor' font-size='10'>R</text>" +
                "<text x='228' y='92' text-anchor='middle' fill='var(--warn)' font-size='10'>edge router</text>" +
                "<line x1='188' y1='61' x2='212' y2='61' stroke='currentColor'/><line x1='188' y1='161' x2='212' y2='161' stroke='currentColor'/><line x1='188' y1='261' x2='212' y2='261' stroke='currentColor'/>" +
                "<rect x='285' y='40' width='120' height='40' rx='6' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='345' y='65' text-anchor='middle' fill='currentColor' font-size='12'>Regional ISP 1</text>" +
                "<rect x='305' y='140' width='80' height='40' rx='6' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='345' y='165' text-anchor='middle' fill='currentColor' font-size='12'>IXP</text>" +
                "<rect x='285' y='240' width='120' height='40' rx='6' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='345' y='265' text-anchor='middle' fill='currentColor' font-size='12'>Regional ISP 2</text>" +
                "<rect x='470' y='35' width='150' height='40' rx='6' fill='none' stroke='var(--accent)' stroke-width='3'/><text x='545' y='60' text-anchor='middle' fill='currentColor' font-size='12'>Tier-1 ISP A</text>" +
                "<rect x='470' y='140' width='150' height='40' rx='6' fill='none' stroke='var(--accent)' stroke-width='3'/><text x='545' y='165' text-anchor='middle' fill='currentColor' font-size='12'>Tier-1 ISP B</text>" +
                "<rect x='470' y='240' width='150' height='52' rx='6' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='545' y='262' text-anchor='middle' fill='currentColor' font-size='12'>Content provider net</text><text x='545' y='280' text-anchor='middle' fill='currentColor' font-size='11'>(Google, Meta, Netflix)</text>" +
                "<line x1='244' y1='61' x2='285' y2='60' stroke='currentColor'/><line x1='244' y1='161' x2='305' y2='160' stroke='currentColor'/><line x1='244' y1='261' x2='285' y2='260' stroke='currentColor'/>" +
                "<line x1='405' y1='60' x2='470' y2='55' stroke='currentColor'/><line x1='405' y1='260' x2='470' y2='165' stroke='currentColor'/>" +
                "<line x1='545' y1='75' x2='545' y2='140' stroke='var(--accent)' stroke-width='2' stroke-dasharray='6 4'/><text x='552' y='112' fill='var(--accent)' font-size='10'>peering</text>" +
                "<line x1='345' y1='80' x2='345' y2='140' stroke='var(--bad)' stroke-dasharray='4 3'/><line x1='345' y1='180' x2='345' y2='240' stroke='var(--bad)' stroke-dasharray='4 3'/><line x1='385' y1='170' x2='470' y2='255' stroke='var(--bad)' stroke-dasharray='4 3'/>" +
                "<line x1='620' y1='160' x2='620' y2='240' stroke='currentColor'/>" +
                "</svg>" },
        { type: "table", head: ["Access technology", "Medium", "Typical place", "Shared or dedicated?", "Key facts (Kurose &amp; Ross 8e §1.2)"],
          rows: [
            ["DSL", "existing telephone twisted pair", "home", "dedicated line to the DSLAM in the telco central office", "frequency-division on one wire: voice 0–4 kHz, upstream 4–50 kHz, downstream 50 kHz–1 MHz; asymmetric (for example 24 Mbps down / 3.5 Mbps up, or 52 / 16 Mbps); only works within a few km of the central office"],
            ["Cable (HFC)", "hybrid fibre-coax: fibre to a neighbourhood node, coax to homes", "home", "<b>shared</b>: downstream is broadcast to every home on the node", "cable modem ↔ CMTS at the headend; DOCSIS 2.0: 40 Mbps down / 30 Mbps up; DOCSIS 3.0: 1.2 Gbps down / 100 Mbps up"],
            ["FTTH", "optical fibre all the way to the home", "home", "PON: one fibre shared through a passive splitter (typically fewer than 100 homes)", "ONT at the home, OLT in the central office; gigabit rates"],
            ["Ethernet", "twisted-pair copper to an Ethernet switch", "campus, enterprise, home LAN", "dedicated port per user (switched)", "100 Mbps to 10 Gbps per user; the switch connects to the institution's router"],
            ["WiFi (IEEE 802.11)", "radio to an access point", "home, campus, café", "shared radio channel", "range of tens of metres; hundreds of Mbps; the AP then connects to the wired LAN"],
            ["Cellular (4G LTE, 5G)", "radio to a base station", "anywhere with coverage", "shared radio cell", "range of kilometres; tens to hundreds of Mbps; reaches the ISP through the carrier's network"] ],
          caption: "Access networks connect an end system to its first router (the edge router). Quiz Q1 and Q4 are about this row set." },
        { type: "table", head: ["Player", "Role", "Pays whom?", "Example"],
          rows: [
            ["Access ISP", "connects end users: home broadband, cellular, campus networks", "pays a regional or tier-1 provider for transit", "your home broadband ISP; a mobile carrier"],
            ["Regional ISP", "aggregates many access ISPs in a region", "pays tier-1 ISPs for transit; its access ISPs pay it", "a national or state-level ISP"],
            ["Tier-1 ISP", "global reach; reaches every network without buying transit", "pays nobody for transit; peers with the other tier-1s settlement-free", "about a dozen worldwide; Kurose names Level 3 (now Lumen), AT&amp;T, Sprint, NTT"],
            ["IXP (Internet Exchange Point)", "a building with switches where many networks meet and peer", "members pay the IXP for ports, not for traffic", "NIXI (National Internet Exchange of India), DE-CIX"],
            ["Content-provider network", "private WAN that carries its own traffic close to users", "peers directly with access ISPs and at IXPs to bypass upper tiers", "Google's network (hops 6 to 18 of WB-L01 p30)"] ],
          caption: "Kurose's \"Network Structure 5\": access ISPs → regional ISPs → tier-1 ISPs, plus PoPs, multi-homing, peering, IXPs and content-provider networks." },
        { type: "derivation", title: "Why a shared access medium slows down at peak time",
          steps: [
            { tex: "R_{each} = \\frac{R_{shared}}{N_{active}}", why: "On a shared medium (cable downstream, a WiFi channel, a cellular cell) active users split the capacity roughly fairly." },
            { tex: "R_{each} = \\frac{1.2\\,\\text{Gbps}}{100} = 12\\,\\text{Mbps}", why: "DOCSIS 3.0 downstream of 1.2 Gbps shared by 100 homes streaming at 10 PM." },
            { tex: "R_{each} = \\frac{1.2\\,\\text{Gbps}}{10} = 120\\,\\text{Mbps}", why: "At 3 AM only 10 homes are active, so each gets ten times more: same link, different load." } ] },
        { type: "callout", kind: "trace", title: "WB-L01 p30 is a network of networks in action",
          html: "<p>Hops 1–2 (192.168.1.1, 10.240.9.204) are the home router and the ISP's private access side; hops 3–5 are the access ISP (anaronline.net); hop 6 is where traffic enters Google's network (the edge of a content-provider network); hops 7–18 are inside Google until the Delhi server answers. Three independently run networks, one path.</p>" },
        { type: "cheat", title: "Edge, access, core in five lines",
          items: [ "<b>Edge</b> = end systems (hosts): phones, laptops, <b>and servers in data centres</b>",
                   "<b>Access network</b> = links from an end system to its first (edge) router: DSL, cable (HFC/DOCSIS), FTTH (PON), Ethernet, WiFi, 4G/5G",
                   "<b>Core</b> = mesh of interconnected routers run by ISPs; forwards packets hop by hop",
                   "Access ISP → regional ISP → tier-1 ISP; customer pays provider; peers exchange traffic settlement-free; IXPs are meeting points",
                   "Nuts-and-bolts view = hardware + protocols; service view = infrastructure offering services to apps through the socket API" ] },
        { type: "worked", title: "Diagnose the buffering reel", tag: "University-Midsem-style",
          problem: "<p>A reel buffers on cellular data but never on home WiFi; both paths end at the same Instagram CDN edge server. Use edge / access / core reasoning to locate the most likely cause.</p>",
          steps: [
            { text: "List what differs between the two paths: only the access network (cellular radio and carrier network vs home WiFi plus fixed broadband).", why: "Components shared by both paths cannot explain a difference between them." },
            { text: "The CDN server and the core routers near it are common to both paths, so they are unlikely causes.", why: "If they were overloaded, home WiFi would buffer too." },
            { text: "Cellular access is a shared radio cell whose rate depends on signal quality and how many users are active.", why: "A shared medium splits capacity (see the derivation above)." } ],
          answer: "<b>Start with the access network</b>: cellular last-mile bandwidth or signal quality (this is quiz Q4, answer C)." },
        { type: "traps", items: [
            "Data-centre <b>servers are at the edge</b> (they are end systems), not in the core. The core is routers.",
            "\"Network of networks\" does <b>not</b> mean every device links to every other device, and no single organisation (not ICANN) owns it. ICANN coordinates names and numbers only.",
            "Backbone (tier-1) fibre is core, not access: a student in a lecture hall uses campus Ethernet or WiFi as access.",
            "Cable downstream is shared; DSL is a dedicated line to the central office. Both are asymmetric (download faster than upload).",
            "A tier-1 ISP does not pay for transit; it peers with other tier-1s." ] }
      ],
      practice: [
        { id: "u01-C-q1", type: "mcq", tag: "From class quiz", topic: "Q.1",
          q: "<p>Which access network technology would a student in a university lecture hall MOST likely be using?</p>",
          options: ["Geostationary satellite", "Home DSL broadband", "Enterprise/campus Ethernet or campus WiFi", "Tier-1 backbone fibre"],
          answer: 2,
          why: ["Satellite access serves remote areas with no wired infrastructure; it has about 240 ms one-way propagation and is not used in a lecture hall.",
                "DSL runs over a home telephone line to the telco central office; it is a home technology.",
                "Correct: campuses use enterprise Ethernet switches and WiFi access points as the access network.",
                "Backbone fibre is the network core, not the access network that connects the student's device."],
          explain: "<p>Quiz answer C. University campuses use enterprise Ethernet with WiFi access points. DSL is a home technology; backbone fibre is the core, not the edge.</p>" },
        { id: "u01-C-q2", type: "mcq", tag: "From class quiz", topic: "Q.1",
          q: "<p>What does the term 'network of networks' mean in the context of the Internet?</p>",
          options: ["Every device must connect to every other device directly", "The Internet consists of thousands of independently administered ISPs and networks that interconnect using shared protocols", "There is one master network owned by ICANN that all ISPs plug into", "Networks are physically layered on top of each other in data centres"],
          answer: 1,
          why: ["A full mesh of devices is impossible at Internet scale (n(n−1)/2 links); packets are switched through routers instead.",
                "Correct: independent ISPs and networks interconnect voluntarily using TCP/IP and BGP, with no single owner.",
                "ICANN coordinates domain names and IP number allocation; it does not own or run a master network.",
                "\"Layering\" is about protocol layers, not about stacking physical networks in buildings."],
          explain: "<p>Quiz answer B: the Internet's decentralised structure (Kurose §1.3).</p>" },
        { id: "u01-C-q3", type: "mcq", tag: "From class quiz", topic: "Q.1",
          q: "<p>A friend abroad loads the same Instagram reel instantly; yours is slow. TWO best network reasons?</p>",
          options: ["They have better phone hardware and your CPU is slow", "A Edge server is closer to them; your last-mile access network link is the bottleneck", "Instagram throttles users in your country", "TCP is faster in their country"],
          answer: 1,
          why: ["Phone hardware is not a <i>network</i> reason, and modern phones decode reels easily.",
                "Correct: CDN geography puts an edge server closer to them (lower propagation delay), and your last-mile access link limits your throughput.",
                "There is no evidence of throttling, and it is a policy guess rather than a network explanation.",
                "TCP is the same protocol everywhere; its speed depends on RTT and loss, not on the country."],
          explain: "<p>Quiz answer B. Edge nodes are closer to some users, reducing propagation delay; the last mile is often the bottleneck for local users.</p>" },
        { id: "u01-C-q4", type: "mcq", tag: "From class quiz", topic: "Q.1",
          q: "<p>Your reel buffers on cellular data but never on home WiFi. Where do you begin investigating?</p>",
          options: ["Instagram's origin data centre — they throttle cellular users", "The network core — backbone routers drop cellular packets", "The access network — cellular last-mile bandwidth or signal quality is the most likely bottleneck", "DNS servers — cellular DNS is slower"],
          answer: 2,
          why: ["The origin and CDN serve both paths; a server problem would hurt WiFi too.",
                "Core routers forward packets regardless of how they entered; both paths share the core.",
                "Correct: the only part that differs between the two cases is the access network.",
                "DNS runs once before the connection; slow DNS delays the start but does not cause repeated buffering mid-video."],
          explain: "<p>Quiz answer C. Buffering on cellular but not on WiFi points to the access network; the core and origin are shared by both paths.</p>" },
        { id: "u01-C-5", type: "mcq", tag: "University-Midsem-style", topic: "01.7",
          q: "<p>\"The Internet is an infrastructure that provides services to distributed applications, which reach it through a socket interface.\" This describes the Internet from the:</p>",
          options: ["Nuts-and-bolts view", "Service view", "OSI physical view", "Tier-1 view"],
          answer: 1,
          why: ["The nuts-and-bolts view lists hardware and protocols: hosts, links, packet switches, ISPs.",
                "Correct: Kurose §1.1.2 defines the service view exactly this way.",
                "There is no \"OSI physical view\" of the Internet; this is a distractor.",
                "Tier-1 is an ISP category, not a way of describing the Internet."],
          explain: "<p>Two views: what the Internet is made of (nuts and bolts) and what it does for applications (service).</p>" },
        { id: "u01-C-6", type: "msq", tag: "GATE-style", topic: "01.7",
          q: "<p>Which of these are <b>access network</b> technologies? (Select all that apply.)</p>",
          options: ["DSL over the telephone line", "Cable (HFC with DOCSIS)", "FTTH using a passive optical network", "A tier-1 ISP's transoceanic backbone"],
          answer: [0, 1, 2],
          why: ["Correct: connects a home to the telco central office (DSLAM).",
                "Correct: connects homes to the cable headend (CMTS).",
                "Correct: fibre to the home through an ONT and passive splitter to the OLT.",
                "Backbone links are in the network core."],
          explain: "<p>Access networks connect an end system to its first router; the backbone is core.</p>" },
        { id: "u01-C-7", type: "mcq", tag: "University-Midsem-style", topic: "01.7",
          q: "<p>Which item is part of the <b>network core</b>?</p>",
          options: ["A web server in a Google data centre", "A laptop on campus WiFi", "A router inside a tier-1 ISP", "A home WiFi access point"],
          answer: 2,
          why: ["Servers are end systems, so they belong to the edge even when they sit in a data centre.",
                "A laptop is an end system at the edge.",
                "Correct: the core is the mesh of packet switches (routers) run by ISPs.",
                "An access point is part of the access network."],
          explain: "<p>Classic trap: servers live at the edge.</p>" },
        { id: "u01-C-8", type: "num", tag: "University-Midsem-style", topic: "01.7",
          q: "<p>A DOCSIS 3.0 cable segment offers 1.2 Gbps downstream, shared fairly by 80 homes that are all streaming at once. What downstream rate does each home get, in <b>Mbps</b> (integer)?</p>",
          answer: 15, tol: 0, unit: "Mbps", verify: "1.2e9/80/1e6",
          formula: "R_{each} = \\frac{R_{shared}}{N}",
          steps: [ { tex: "R_{each} = \\frac{1.2\\times10^{9}}{80} = 1.5\\times10^{7}\\,\\text{bit/s}", why: "Shared downstream split among 80 active homes." },
                   { tex: "1.5\\times10^{7}\\,\\text{bit/s} = 15\\,\\text{Mbps}", why: "Divide by 10^6." } ],
          explain: "<p>Cable is a shared broadcast medium downstream, which is why it slows at peak hours.</p>" }
      ]
    },
    // ------------------------------------------------------------------ 01-D
    {
      id: "01-D",
      title: "traceroute: reading the journey to Google's Delhi server hop by hop",
      badge: "class",
      source: "WB-L01 p30; Kurose & Ross 8e §1.4.3; RFC 792 (ICMP)",
      covers: ["01.6"],
      blocks: [
        { type: "intuition", title: "Messengers who give up after k checkpoints",
          html: "<p><b>Analogy.</b> You want to know every checkpoint on a road. You send messenger 1 with the order \"give up at the first checkpoint and send me a postcard saying where you stopped\". Messenger 2 gives up at the second checkpoint, messenger 3 at the third, and you keep adding one more checkpoint per messenger until one of them reaches the destination. The postcards reveal the route, and the time each postcard takes to come back tells you how far away that checkpoint is.</p>" +
                "<p><b>Precise mechanism (Kurose §1.4.3, RFC 792).</b> Every IP packet carries an 8-bit <b>TTL</b> (time-to-live). Each router <b>decrements TTL by 1</b>; if it reaches 0 the router discards the packet and returns an <b>ICMP Time Exceeded</b> message (type 11, code 0) whose source address is that router. traceroute sends probes with TTL = 1, then 2, then 3, increasing by one until the destination answers (by default <b>3 probes per TTL</b>, up to 30 hops) and records the <b>round-trip time</b> from sending each probe to receiving its reply. Unix traceroute sends <b>UDP probes to unlikely high ports</b> (base 33434); the destination host answers with <b>ICMP Port Unreachable</b> (type 3, code 3), which tells traceroute it has arrived. Windows <code>tracert</code> sends ICMP Echo Requests instead and stops at the Echo Reply.</p>" },
        { type: "figure", caption: "WB-L01 p30 redrawn: Private → ISP → Google edge → load-balanced mesh → hidden core → destination. Latency climbs to about 16 ms, then plateaus once you hit Google.",
          html: "<svg viewBox='0 0 600 440' width='100%' role='img' aria-label='Traceroute hop ladder'>" +
                "<defs><marker id='u01ar' viewBox='0 0 10 10' refX='5' refY='9' markerWidth='7' markerHeight='7' orient='auto'><path d='M0,0 L10,0 L5,10 z' fill='currentColor'/></marker></defs>" +
                "<rect x='30' y='8' width='340' height='46' rx='8' fill='none' stroke='var(--muted)' stroke-width='2'/><text x='200' y='28' text-anchor='middle' fill='currentColor' font-size='13' font-weight='bold'>Your device</text><text x='200' y='45' text-anchor='middle' fill='var(--muted)' font-size='11'>traceroute starts here</text>" +
                "<rect x='30' y='70' width='340' height='46' rx='8' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='200' y='90' text-anchor='middle' fill='currentColor' font-size='13' font-weight='bold'>Hops 1–2 · Private network</text><text x='200' y='107' text-anchor='middle' fill='var(--muted)' font-size='11'>192.168.1.1, 10.240.9.204</text>" +
                "<rect x='30' y='132' width='340' height='46' rx='8' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='200' y='152' text-anchor='middle' fill='currentColor' font-size='13' font-weight='bold'>Hops 3–5 · Your ISP</text><text x='200' y='169' text-anchor='middle' fill='var(--muted)' font-size='11'>hop 3 silent, then anaronline.net</text>" +
                "<rect x='30' y='194' width='340' height='46' rx='8' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='200' y='214' text-anchor='middle' fill='currentColor' font-size='13' font-weight='bold'>Hop 6 · Google's edge</text><text x='200' y='231' text-anchor='middle' fill='var(--muted)' font-size='11'>latency settles at about 16 ms</text>" +
                "<rect x='30' y='256' width='340' height='46' rx='8' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='200' y='276' text-anchor='middle' fill='currentColor' font-size='13' font-weight='bold'>Hops 7–9 · Load balanced</text><text x='200' y='293' text-anchor='middle' fill='var(--muted)' font-size='11'>two IPs per hop = parallel paths</text>" +
                "<rect x='30' y='318' width='340' height='46' rx='8' fill='none' stroke='var(--muted)' stroke-width='2' stroke-dasharray='5 4'/><text x='200' y='338' text-anchor='middle' fill='currentColor' font-size='13' font-weight='bold'>Hops 10–17 · Hidden core</text><text x='200' y='355' text-anchor='middle' fill='var(--muted)' font-size='11'>* * * : routers stay silent</text>" +
                "<rect x='30' y='380' width='340' height='46' rx='8' fill='none' stroke='var(--ok)' stroke-width='3'/><text x='200' y='400' text-anchor='middle' fill='currentColor' font-size='13' font-weight='bold'>Hop 18 · Delhi server</text><text x='200' y='417' text-anchor='middle' fill='var(--muted)' font-size='11'>del11s05-in-f14.1e100.net, about 20 ms</text>" +
                "<line x1='200' y1='54' x2='200' y2='68' stroke='currentColor' marker-end='url(#u01ar)'/><line x1='200' y1='116' x2='200' y2='130' stroke='currentColor' marker-end='url(#u01ar)'/><line x1='200' y1='178' x2='200' y2='192' stroke='currentColor' marker-end='url(#u01ar)'/><line x1='200' y1='240' x2='200' y2='254' stroke='currentColor' marker-end='url(#u01ar)'/><line x1='200' y1='302' x2='200' y2='316' stroke='currentColor' marker-end='url(#u01ar)'/><line x1='200' y1='364' x2='200' y2='378' stroke='currentColor' marker-end='url(#u01ar)'/>" +
                "<text x='390' y='98' fill='var(--ok)' font-size='12'>about 1 to 3.5 ms</text><text x='390' y='160' fill='var(--accent)' font-size='12'>about 8 to 12 ms</text><text x='390' y='222' fill='var(--warn)' font-size='12'>about 16 ms</text><text x='390' y='284' fill='var(--warn)' font-size='12'>16 to 17 ms</text><text x='390' y='346' fill='var(--muted)' font-size='12'>no reply</text><text x='390' y='408' fill='var(--ok)' font-size='12'>about 20 ms</text>" +
                "</svg>" },
        { type: "table", head: ["Hop", "Responder (sample trace)", "Probe RTTs (ms)", "Average (ms)", "Segment on WB-L01 p30"],
          rows: [
            ["1", "192.168.1.1", "1.211, 1.093, 1.152", "1.152", "Private network (home router)"],
            ["2", "10.240.9.204", "3.402, 3.517, 3.611", "3.510", "Private network (ISP access side)"],
            ["3", "* * *", "no reply", "–", "Your ISP (silent hop)"],
            ["4", "static-41.anaronline.net (203.0.113.41)", "8.204, 8.317, 8.125", "8.215", "Your ISP"],
            ["5", "static-45.anaronline.net (203.0.113.45)", "12.388, 12.502, 12.296", "12.395", "Your ISP"],
            ["6", "203.0.113.97", "16.104, 16.227, 15.989", "16.107", "Google's edge"],
            ["7", "198.51.100.21 and .23", "16.402, 16.611, 16.388", "16.467", "Load balanced"],
            ["8", "198.51.100.31 and .33", "16.921, 16.804, 17.010", "16.912", "Load balanced"],
            ["9", "198.51.100.41 and .43", "17.315, 17.199, 17.402", "17.305", "Load balanced"],
            ["10 to 17", "* * * on every line", "no reply", "–", "Hidden core"],
            ["18", "del11s05-in-f14.1e100.net (198.51.100.14)", "20.104, 19.987, 20.230", "20.107", "Delhi server"] ],
          caption: "Sample trace used by the scripts and questions. Hop structure and the 16 ms / 20 ms readings are from WB-L01 p30; addresses after hop 2 are RFC 5737 documentation addresses standing in for the real routers." },
        { type: "seq", left: "Your host", right: "Routers / destination", caption: "How traceroute discovers hops. Each line is one probe or one reply; RTT = time from probe to reply.",
          events: [
            { from: "L", label: "UDP probe, TTL=1, dst port 33434", note: "hop 1 sets TTL to 0" },
            { from: "R", label: "ICMP Time Exceeded (11/0) from 192.168.1.1", note: "RTT ≈ 1.2 ms" },
            { from: "L", label: "UDP probe, TTL=2, dst port 33437" },
            { from: "R", label: "ICMP Time Exceeded (11/0) from 10.240.9.204", note: "RTT ≈ 3.5 ms" },
            { from: "L", label: "UDP probe, TTL=3, dst port 33440", lost: true },
            { from: "L", label: "", gap: true, note: "no ICMP reply before the wait time: print *" },
            { from: "L", label: "UDP probe, TTL=18, dst port 33485" },
            { from: "R", label: "ICMP Port Unreachable (3/3) from destination", note: "arrived: stop" } ] },
        { type: "derivation", title: "Reading latency from a trace",
          steps: [
            { tex: "\\overline{RTT}_k = \\frac{r_1 + r_2 + r_3}{3}", why: "Each hop line shows three probe RTTs; average them (or take the minimum, which is the least affected by queuing)." },
            { tex: "\\overline{RTT}_6 = \\frac{16.104 + 16.227 + 15.989}{3} = \\frac{48.320}{3} = 16.107\\,\\text{ms}", why: "Hop 6 is where the slide says latency settles at about 16 ms." },
            { tex: "\\Delta_k = \\overline{RTT}_k - \\overline{RTT}_{k-1}", why: "The increase between consecutive answering hops estimates the round-trip cost of the links in between." },
            { tex: "\\Delta_{2\\to4} = 8.215 - 3.510 = 4.705\\,\\text{ms}", why: "The largest jump spans silent hop 3: the access link into the ISP." },
            { tex: "\\frac{\\overline{RTT}_6}{\\overline{RTT}_{18}} = \\frac{16.107}{20.107} = 0.801", why: "About 80% of the total RTT is spent before reaching Google's edge; the remaining 12 hops add only 4 ms." },
            { tex: "d_{max} = s\\cdot\\frac{RTT_{min}}{2} = 2\\times10^{8}\\times\\frac{19.987\\times10^{-3}}{2} \\approx 1.999\\times10^{6}\\,\\text{m}", why: "If all delay were fibre propagation, the server could be at most about 1999 km away (one way is half the round trip)." } ] },
        { type: "callout", kind: "takeaway", title: "Why the latency plateaus after hop 6",
          html: "<p>Most of the delay is in the <b>access network and ISP</b> (hops 1–6). Once the probe enters Google's network at the edge, Google's private backbone carries it to a server that is physically close (Delhi), so 12 more hops add only about 4 ms. This is the content-provider network from 01-C at work.</p>" },
        { type: "cheat", title: "traceroute facts examiners ask",
          items: [ "TTL is an 8-bit IP header field (max 255); each router decrements it by 1",
                   "TTL reaches 0 at a router → <b>ICMP Time Exceeded, type 11 code 0</b>, sent back from that router",
                   "Unix: UDP probes, destination ports from 33434 upward; destination answers <b>ICMP Port Unreachable, type 3 code 3</b>",
                   "Windows <code>tracert</code>: ICMP Echo Request (type 8) probes; destination answers Echo Reply (type 0)",
                   "Defaults: 3 probes per hop, 30 hops max; Linux probes are 60 bytes (20 IP + 8 UDP + 32 data)",
                   "<code>* * *</code> = no reply within the wait time; two addresses on one line = load balancing (ECMP)",
                   "Every number is a <b>round-trip</b> time from your host to that hop and back" ] },
        { type: "worked", title: "Read the trace like an examiner", tag: "University-Midsem-style",
          problem: "<p>Using the sample trace table above: (a) average RTT to hop 2; (b) how much RTT the ISP segment adds from hop 2 to hop 6; (c) what fraction of the final average RTT is reached by hop 6; (d) how many routers on the path did not answer.</p>",
          steps: [
            { tex: "\\overline{RTT}_2 = \\frac{3.402 + 3.517 + 3.611}{3} = \\frac{10.530}{3} = 3.510\\,\\text{ms}", why: "Average of the three probes." },
            { tex: "\\overline{RTT}_6 - \\overline{RTT}_2 = 16.107 - 3.510 = 12.597\\,\\text{ms}", why: "Hop 6 is the first Google hop; everything between hop 2 and hop 6 is the ISP." },
            { tex: "\\frac{16.107}{20.107} = 0.801 = 80.1\\%", why: "Hop 6 average over hop 18 average." },
            { text: "Silent lines: hop 3 and hops 10, 11, 12, 13, 14, 15, 16, 17, giving 1 + 8 = 9 routers.", why: "They forwarded the probes (hop 18 answered) but did not send ICMP Time Exceeded." } ],
          answer: "<b>(a) 3.510 ms; (b) 12.597 ms; (c) 80.1%; (d) 9 silent routers.</b>" },
        { type: "code", file: "Unit01_traceroute_parser.py", level: "low", title: "Hand-written trace parser, per-hop latency analyser and TTL-limited UDP probe builder (prints, never sends)" },
        { type: "code", file: "Unit01_resolve_and_trace.py", level: "high", title: "getaddrinfo / gethostbyname on localhost, ipaddress classification, and a subprocess traceroute wrapper that skips gracefully" },
        { type: "traps", items: [
            "<code>* * *</code> in the middle of a trace does <b>not</b> mean packets are lost: if a later hop answers, the silent routers forwarded the probes. They just do not send (or they rate-limit) ICMP replies.",
            "Each value is a <b>round trip</b> to that router, not a one-way delay and not the delay of that single link.",
            "RTT can go <b>down</b> at a later hop: routers generate ICMP on a slow, low-priority path, and replies can return by a different route.",
            "A private address at hop 2 (10.240.9.204) is the ISP's access network or carrier-grade NAT, not your own LAN.",
            "Two addresses on one hop line mean <b>load balancing</b> (parallel equal-cost paths), not an error.",
            "traceroute relies on TTL and ICMP; the probe itself is UDP on Unix and ICMP Echo on Windows." ] }
      ],
      practice: [
        { id: "u01-D-1", type: "mcq", tag: "GATE-style", topic: "01.6",
          q: "<p>A traceroute probe arrives at an intermediate router with TTL = 1. What does the router do?</p>",
          options: ["Forwards it with TTL = 0", "Decrements TTL to 0, discards the packet and returns ICMP Time Exceeded (type 11) to the source", "Returns ICMP Port Unreachable (type 3, code 3)", "Drops it silently in all cases"],
          answer: 1,
          why: ["A router never forwards a packet whose TTL has reached 0.",
                "Correct: this is exactly how traceroute learns the router's address (RFC 792).",
                "Port Unreachable comes from the destination host, which has no process on the probe's UDP port.",
                "It is discarded, but the router normally reports it; silent routers are the exception that produce * * *."],
          explain: "<p>TTL expiry → ICMP type 11 code 0 from that router.</p>" },
        { id: "u01-D-2", type: "num", tag: "University-Midsem-style", topic: "01.6",
          q: "<p>Hop 6 of a trace shows <code>16.104 ms 16.227 ms 15.989 ms</code>. What is the average RTT in <b>ms</b>, rounded to 3 decimals?</p>",
          answer: 16.107, tol: 0.0005, unit: "ms", verify: "round((16.104+16.227+15.989)/3, 3)",
          steps: [ { tex: "16.104 + 16.227 + 15.989 = 48.320", why: "Add the three probe times." },
                   { tex: "\\frac{48.320}{3} = 16.1067 \\approx 16.107\\,\\text{ms}", why: "Divide by the number of probes and round to 3 decimals." } ],
          explain: "<p>About 16 ms, matching \"latency settles at ~16 ms\" on WB-L01 p30.</p>" },
        { id: "u01-D-3", type: "num", tag: "GATE-style", topic: "01.6",
          q: "<p>The destination's minimum RTT is 19.987 ms. Assuming the whole delay were propagation in fibre at $2\\times10^8$ m/s, what is the maximum one-way distance to the server in <b>km</b> (nearest integer)?</p>",
          answer: 1999, tol: 0.5, unit: "km", verify: "round(19.987e-3/2*2e8/1000)",
          formula: "d_{max} = s\\cdot\\frac{RTT}{2}",
          steps: [ { tex: "\\frac{19.987\\,\\text{ms}}{2} = 9.9935\\,\\text{ms}", why: "One way is half of the round trip." },
                   { tex: "2\\times10^{8}\\times 9.9935\\times10^{-3} = 1.9987\\times10^{6}\\,\\text{m}", why: "Distance = speed × time." },
                   { tex: "1.9987\\times10^{6}\\,\\text{m} = 1998.7\\,\\text{km} \\approx 1999\\,\\text{km}", why: "Divide by 1000 and round." } ],
          explain: "<p>An upper bound only: real paths also spend time in queues, routers and the reply generation.</p>" },
        { id: "u01-D-4", type: "msq", tag: "University-Midsem-style", topic: "01.6",
          q: "<p>Hops 10–17 print <code>* * *</code> but hop 18 (the destination) answers. Which conclusions are valid? (Select all that apply.)</p>",
          options: ["Routers 10–17 forwarded the probes onward", "Routers 10–17 are switched off", "Routers 10–17 do not send, or filter, ICMP Time Exceeded replies", "The destination is unreachable"],
          answer: [0, 2],
          why: ["Correct: otherwise the TTL=18 probe could not have reached the destination.",
                "Wrong: a switched-off router could not have forwarded the later probes.",
                "Correct: WB-L01 p30 says \"routers stay silent\" (policy or ICMP rate limiting).",
                "Wrong: hop 18 replied, so the destination is reachable."],
          explain: "<p>Silent is not broken.</p>" },
        { id: "u01-D-5", type: "mcq", tag: "University-Midsem-style", topic: "01.6",
          q: "<p>Hops 7–9 on WB-L01 p30 each show two different IP addresses. The best explanation is:</p>",
          options: ["Two different traceroutes were mixed together", "Load balancing: the provider spreads probes over parallel equal-cost paths", "IP address spoofing by an attacker", "The router has two TTL fields"],
          answer: 1,
          why: ["Each line belongs to one TTL value of one run.",
                "Correct: \"two IPs per hop = parallel paths\".",
                "Nothing suggests an attack; this is normal in large networks.",
                "The IP header has exactly one 8-bit TTL field."],
          explain: "<p>Different probes for the same TTL took different parallel links (ECMP).</p>" },
        { id: "u01-D-6", type: "num", tag: "University-Midsem-style", topic: "01.6",
          q: "<p>Unix traceroute starts at destination port 33434 and adds 1 for every probe sent, with 3 probes per TTL. What is the destination port of the <b>first</b> probe with TTL = 4? (integer)</p>",
          answer: 33443, tol: 0, unit: "port", verify: "33434 + (4-1)*3",
          steps: [ { tex: "\\text{probes before TTL 4} = (4-1)\\times3 = 9", why: "TTLs 1, 2 and 3 each used 3 probes." },
                   { tex: "33434 + 9 = 33443", why: "Each earlier probe moved the port up by one." } ],
          explain: "<p>Changing the port lets traceroute match each ICMP reply (which quotes the probe's header) to the probe that caused it.</p>" },
        { id: "u01-D-7", type: "text", tag: "University-Midsem-style", topic: "01.6",
          q: "<p>Predict the exact output of this TTL simulation.</p>",
          code: "ttl = 3\nhops = [\"192.168.1.1\", \"10.240.9.204\", \"203.0.113.41\", \"203.0.113.45\"]\nfor router in hops:\n    ttl -= 1\n    if ttl == 0:\n        print(\"Time Exceeded from\", router)\n        break",
          answer: "Time Exceeded from 203.0.113.41", runCheck: true,
          explain: "<p>Router 1 makes TTL 2, router 2 makes it 1, router 3 makes it 0 and reports: the third address.</p>" },
        { id: "u01-D-8", type: "write", tag: "University-Midsem-style", topic: "01.6",
          q: "<p>Write <code>parse_hop(line)</code> that takes one traceroute line such as <code>' 6  203.0.113.97 (203.0.113.97)  16.104 ms  16.227 ms  15.989 ms'</code> and returns <code>(hop_number, [addresses], average_rtt_or_None)</code>. A line of <code>* * *</code> must return an empty address list and <code>None</code>.</p>",
          starter: "def parse_hop(line):\n    tokens = line.split()\n    hop = int(tokens[0])\n    # collect addresses inside ( ) and the numbers that precede 'ms'\n    return hop, [], None\n",
          solutionFile: "Unit01_traceroute_parser.py",
          rubric: ["Splits on whitespace and reads the hop number from the first token", "Treats '*' as a lost probe and ignores the 'ms' unit tokens", "Collects each address once, so hops 7–9 return two addresses", "Returns None for the average when no probe answered", "For hop 6 of the sample, returns an average of about 16.107"],
          explain: "<p>The model solution is <code>parse_trace</code> plus <code>summarise</code> in the script.</p>" }
      ]
    },
    // ------------------------------------------------------------------ 01-E
    {
      id: "01-E",
      title: "AWS vocabulary: Region, Availability Zone and Edge Location",
      badge: "class",
      source: "WB-L04 p30–32; AWS Global Infrastructure documentation",
      covers: ["01.8"],
      blocks: [
        { type: "intuition", title: "City, industrial estates, neighbourhood kiosks",
          html: "<p><b>Analogy.</b> A <b>Region</b> is a city such as Mumbai. Inside the city are several <b>industrial estates</b> far enough apart that one fire or flood cannot hit two of them, each with its own power substation: those are <b>Availability Zones</b>. Out in the neighbourhoods are small <b>kiosks</b> stocking the most popular items so you do not travel to the city: those are <b>Edge Locations</b>.</p>" +
                "<p><b>Definitions (WB-L04 p31–32 and AWS documentation).</b> A <b>Region</b> is an isolated geographic area (for example Mumbai, code <code>ap-south-1</code>) containing multiple data-centre clusters; AWS has 30+ Regions joined by an ultra-low-latency backbone. An <b>Availability Zone (AZ)</b> is <b>one or more discrete data centres with redundant power, networking and connectivity</b>, an isolated fault domain; AZs in a Region are linked by low-latency private links and are named like <code>ap-south-1a</code>. Deploying across <b>two or more AZs</b> lets an application survive a fire, flood or power-grid failure at one site. An <b>Edge Location</b> is a CDN endpoint (Amazon CloudFront point of presence) that caches content physically closer to users to reduce latency.</p>" },
        { type: "figure", caption: "Region ⊃ Availability Zones ⊃ data centres; Edge Locations sit outside Regions, close to users.",
          html: "<svg viewBox='0 0 620 300' width='100%' role='img' aria-label='AWS Region with AZs and edge locations'>" +
                "<rect x='10' y='25' width='420' height='260' rx='12' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='22' y='48' fill='currentColor' font-size='14' font-weight='bold'>Region ap-south-1 (Mumbai)</text>" +
                "<rect x='25' y='65' width='120' height='150' rx='8' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='85' y='85' text-anchor='middle' fill='currentColor' font-size='12'>AZ ap-south-1a</text>" +
                "<rect x='160' y='65' width='120' height='150' rx='8' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='220' y='85' text-anchor='middle' fill='currentColor' font-size='12'>AZ ap-south-1b</text>" +
                "<rect x='295' y='65' width='120' height='150' rx='8' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='355' y='85' text-anchor='middle' fill='currentColor' font-size='12'>AZ ap-south-1c</text>" +
                "<rect x='45' y='100' width='80' height='40' rx='4' fill='none' stroke='var(--muted)'/><text x='85' y='124' text-anchor='middle' fill='var(--muted)' font-size='11'>data centre</text><rect x='45' y='155' width='80' height='40' rx='4' fill='none' stroke='var(--muted)'/><text x='85' y='179' text-anchor='middle' fill='var(--muted)' font-size='11'>data centre</text>" +
                "<rect x='180' y='100' width='80' height='40' rx='4' fill='none' stroke='var(--muted)'/><text x='220' y='124' text-anchor='middle' fill='var(--muted)' font-size='11'>data centre</text><rect x='180' y='155' width='80' height='40' rx='4' fill='none' stroke='var(--muted)'/><text x='220' y='179' text-anchor='middle' fill='var(--muted)' font-size='11'>data centre</text>" +
                "<rect x='315' y='100' width='80' height='40' rx='4' fill='none' stroke='var(--muted)'/><text x='355' y='124' text-anchor='middle' fill='var(--muted)' font-size='11'>data centre</text>" +
                "<line x1='145' y1='240' x2='160' y2='240' stroke='var(--warn)' stroke-width='3'/><line x1='85' y1='215' x2='85' y2='240' stroke='var(--warn)' stroke-width='2'/><line x1='85' y1='240' x2='355' y2='240' stroke='var(--warn)' stroke-width='2'/><line x1='220' y1='215' x2='220' y2='240' stroke='var(--warn)' stroke-width='2'/><line x1='355' y1='215' x2='355' y2='240' stroke='var(--warn)' stroke-width='2'/>" +
                "<text x='220' y='265' text-anchor='middle' fill='var(--warn)' font-size='12'>private low-latency links between AZs</text>" +
                "<circle cx='510' cy='70' r='22' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='510' y='74' text-anchor='middle' fill='currentColor' font-size='10'>Edge</text><text x='545' y='60' fill='var(--muted)' font-size='11'>Delhi</text>" +
                "<circle cx='510' cy='160' r='22' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='510' y='164' text-anchor='middle' fill='currentColor' font-size='10'>Edge</text><text x='545' y='150' fill='var(--muted)' font-size='11'>Chennai</text>" +
                "<circle cx='510' cy='250' r='22' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='510' y='254' text-anchor='middle' fill='currentColor' font-size='10'>Edge</text><text x='545' y='240' fill='var(--muted)' font-size='11'>Kolkata</text>" +
                "<text x='510' y='292' text-anchor='middle' fill='var(--bad)' font-size='11'>CloudFront edge locations cache content near users</text>" +
                "<line x1='430' y1='150' x2='488' y2='70' stroke='var(--muted)' stroke-dasharray='4 3'/><line x1='430' y1='155' x2='488' y2='160' stroke='var(--muted)' stroke-dasharray='4 3'/><line x1='430' y1='160' x2='488' y2='250' stroke='var(--muted)' stroke-dasharray='4 3'/>" +
                "</svg>" },
        { type: "table", head: ["Term", "What it is", "Contains / scope", "Naming example", "Protects against"],
          rows: [
            ["Region", "isolated geographic area with multiple data-centre clusters", "several AZs", "<code>ap-south-1</code> (Mumbai)", "a whole-area disaster, if you also use a second Region; data residency"],
            ["Availability Zone", "one or more discrete data centres with redundant power, networking, connectivity", "inside one Region; AZs are far enough apart to fail independently", "<code>ap-south-1a</code>", "fire, flood or power-grid failure at one site (deploy in 2+ AZs)"],
            ["Edge Location", "CloudFront CDN point of presence that caches content near users", "outside Regions, in many more cities", "a city PoP such as Delhi or Chennai", "high latency for far-away users; load on the origin"] ],
          caption: "WB-L04 p31–32 vocabulary. Subnets in a VPC map to AZs (WB-L04 p33; Unit 4 and Unit 14)." },
        { type: "callout", kind: "aws", title: "WB-L04 p32: the Multi-AZ project and 99.9%",
          html: "<p>The course project splits workloads across <b>AZ-A and AZ-B</b>. The slide's target metric is <b>99.9% availability</b> (\"three nines\"). The derivation below turns that percentage into minutes of downtime, which is the numerical form examiners like.</p>" },
        { type: "derivation", title: "From availability percentage to downtime, and the Multi-AZ gain",
          steps: [
            { tex: "\\text{downtime} = (1 - A)\\times T", why: "Availability A is the fraction of time the service is up; the rest of the period T is downtime." },
            { tex: "T = 365\\times24 = 8760\\,\\text{h}", why: "Hours in a (non-leap) year." },
            { tex: "(1 - 0.999)\\times8760 = 0.001\\times8760 = 8.76\\,\\text{h}", why: "99.9% availability allows 8.76 hours of downtime per year (525.6 minutes)." },
            { tex: "A_{2AZ} = 1 - (1-A)^{2} = 1 - (0.001)^{2} = 0.999999", why: "With two independent AZs the service is down only when both are down; multiply the down probabilities." },
            { tex: "(1 - 0.999999)\\times8760\\times3600 = 31.536\\,\\text{s}", why: "Six nines leaves about 31.5 seconds of downtime per year, if the AZ failures are truly independent." } ] },
        { type: "cheat", title: "AWS global infrastructure words",
          items: [ "Region (e.g. ap-south-1 Mumbai) ⊃ Availability Zones (ap-south-1a, 1b, 1c) ⊃ one or more data centres each",
                   "AZ = isolated fault domain with redundant power, networking and connectivity",
                   "Edge Location = CloudFront (CDN) cache close to users; lowers latency, offloads the origin",
                   "Slide numbers: 30+ Regions; ultra-low-latency backbone; 99.9% availability target",
                   "Downtime = (1 − A) × period; parallel independent copies: $A = 1 - (1 - a)^n$" ] },
        { type: "worked", title: "Three nines, then two AZs", tag: "University-Midsem-style",
          problem: "<p>A web tier in a single AZ has 99.9% availability. (a) How many minutes of downtime per 30-day month? (b) The tier is copied into a second, independent AZ with the same availability. What is the new availability, and the downtime per 30-day month in seconds?</p>",
          steps: [
            { tex: "30\\times24\\times60 = 43200\\,\\text{min}", why: "Minutes in a 30-day month." },
            { tex: "(1-0.999)\\times43200 = 43.2\\,\\text{min}", why: "Single-AZ downtime per month." },
            { tex: "A_2 = 1 - 0.001^{2} = 0.999999", why: "Both copies must fail at the same time for an outage." },
            { tex: "(1 - 0.999999)\\times43200\\times60 = 2.592\\,\\text{s}", why: "Convert the month to seconds (2,592,000 s) and multiply by 10^-6." } ],
          answer: "<b>(a) 43.2 min/month; (b) 99.9999%, about 2.6 s/month.</b>" },
        { type: "traps", items: [
            "An AZ is <b>one or more</b> data centres, not necessarily exactly one; a Region is <b>several</b> AZs, not one data centre.",
            "Edge Locations are for caching and DNS (CloudFront, Route 53); you do not build your VPC subnets in them.",
            "<code>ap-south-1</code> is a Region; <code>ap-south-1a</code> (with a letter) is an AZ.",
            "The Multi-AZ formula assumes independent failures; a shared bug or a Region-wide outage breaks that assumption.",
            "99.9% per year is 8.76 hours, not 8.76 minutes. Watch the unit." ] }
      ],
      practice: [
        { id: "u01-E-1", type: "mcq", tag: "University-Midsem-style", topic: "01.8",
          q: "<p>According to WB-L04 p32, an Availability Zone is:</p>",
          options: ["A CDN cache close to users", "One or more discrete data centres with redundant power, networking and connectivity", "A country-sized group of Regions", "A subnet inside a VPC"],
          answer: 1,
          why: ["That is an Edge Location.",
                "Correct: an isolated fault domain inside a Region.",
                "Regions are the larger unit; there is no country-sized group of Regions in the slide vocabulary.",
                "A subnet is placed <i>in</i> an AZ but is not the AZ itself."],
          explain: "<p>AZs exist so that one site failure does not take the application down.</p>" },
        { id: "u01-E-2", type: "mcq", tag: "University-Midsem-style", topic: "01.8",
          q: "<p>Which AWS building block caches content physically close to users to reduce latency?</p>",
          options: ["Region", "Availability Zone", "Edge Location", "VPC"],
          answer: 2,
          why: ["A Region hosts your compute and data; it is not placed in every city.",
                "An AZ is a fault domain inside a Region.",
                "Correct: WB-L04 p31, CDN endpoints (CloudFront).",
                "A VPC is a private software-defined network, not a cache."],
          explain: "<p>Edge Locations are CDN points of presence.</p>" },
        { id: "u01-E-3", type: "num", tag: "University-Midsem-style", topic: "01.8",
          q: "<p>A service promises 99.9% availability over a 365-day year. Maximum downtime in <b>hours</b>, to 2 decimals?</p>",
          answer: 8.76, tol: 0.005, unit: "h", verify: "round((1-0.999)*365*24, 2)",
          formula: "\\text{downtime} = (1-A)\\times T",
          steps: [ { tex: "T = 365\\times24 = 8760\\,\\text{h}", why: "Hours in the year." },
                   { tex: "0.001\\times8760 = 8.76\\,\\text{h}", why: "The unavailable fraction times the period." } ],
          explain: "<p>Three nines = 8.76 h/year = 525.6 min/year.</p>" },
        { id: "u01-E-4", type: "num", tag: "GATE-style", topic: "01.8",
          q: "<p>An application runs in two independent AZs, each 99% available; it is up if either AZ is up. What is the overall availability in <b>percent</b>, to 2 decimals?</p>",
          answer: 99.99, tol: 0.005, unit: "%", verify: "round((1-(1-0.99)**2)*100, 2)",
          formula: "A = 1 - (1-a)^{n}",
          steps: [ { tex: "(1-0.99)^{2} = 0.01^{2} = 0.0001", why: "Probability that both AZs are down at once." },
                   { tex: "A = 1 - 0.0001 = 0.9999 = 99.99\\%", why: "Up whenever at least one AZ is up." } ],
          explain: "<p>Two nines per AZ become four nines together, assuming independence.</p>" },
        { id: "u01-E-5", type: "msq", tag: "University-Midsem-style", topic: "01.8",
          q: "<p>Which statements are correct? (Select all that apply.)</p>",
          options: ["A Region contains multiple Availability Zones", "Deploying across two or more AZs lets an app survive a fire at one site", "Edge Locations are where you create your VPC subnets", "<code>ap-south-1a</code> names an AZ in the Mumbai Region"],
          answer: [0, 1, 3],
          why: ["Correct: WB-L04 p31–32.",
                "Correct: that is the purpose of Multi-AZ (p32).",
                "Wrong: subnets map to AZs inside a Region; Edge Locations serve CloudFront caching.",
                "Correct: Region code plus a letter identifies an AZ."],
          explain: "<p>Region ⊃ AZ; Edge Locations are separate CDN sites.</p>" },
        { id: "u01-E-6", type: "text", tag: "University-Midsem-style", topic: "01.8",
          q: "<p>Predict the exact output.</p>",
          code: "a = 0.999\nyear_h = 365 * 24\nprint(round((1 - a) * year_h, 2), round((1 - (1 - a) ** 2) * 100, 4))",
          answer: "8.76 99.9999", runCheck: true,
          explain: "<p>Single AZ: 0.001 × 8760 = 8.76 h. Two AZs: 1 − 0.000001 = 0.999999, times 100 = 99.9999.</p>" }
      ]
    }
  ]
};
