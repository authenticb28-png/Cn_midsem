# WB-L01 pages 1–31 — Introduction (CSAI321: Computer Networks, Lecture 1; PDF metadata title "Computer Networks Lecture 1: Introduction", dated 2026-08-10)

Note: Despite being in the "Whiteboards" folder, this PDF is a clean Canva slide export. No handwriting or ink annotations appear on any page (checked all 31 images; pp.30–31 re-rendered at 150 dpi). Pages 30–31 are screenshots appended after the "Thank You" slide with no slide title or text layer.

## Page table
| Page | Section/slide title | Content summary (exact facts, numbers, definitions, lists — be specific, not vague) | Callout type | Diagram/figure on page (describe so it can be redrawn) | Handwriting present? |
|---|---|---|---|---|---|
| 1 | Title: "1 — Introduction" | Course "CSAI321: Computer Networks", Newton School of Technology. Lecture number 1. | none | Decorative network-mesh graphic in a triangle on the left | No |
| 2 | Join the lecture online on your dashboard | Filler slide | none | none | No |
| 3 | What is the Cloud? | Prompt: "Is the cloud just someone else's computer?" | QUIZ (rhetorical) | Clip-art of a server tower and a photo of a blade-server board | No |
| 4 | What is the Cloud? | "More like a lot of computers…" | none | Photo of a cabled server rack; clip-art of a technician beside two racks | No |
| 5 | What is the Cloud? | "A lot, lot!" | none | Photo of a data-center aisle lined with racks | No |
| 6 | What is the Cloud? | Caption: "An overhead view of the server infrastructure in Google's data center in Council Bluffs, Iowa." Text: "And all these servers need to talk to each other!" | none | Photo of the data center; icon of two servers linked to a cloud | No |
| 7 | (Cloud providers) | "The cloud computing service providers - Amazon Web Services (AWS), Azure, Google Cloud Platform (GCP) all have super fast computer network." "Getting all those 0s and 1s to you efficiently!" | AWS (mentions cloud providers) | AWS, Azure and Google Cloud logos | No |
| 8 | But then networks are not new | History: "In 1960s, the UCLA computer tried to send 'login,' to computer in Stanford Research Institute. Only 'lo' got through before the system crashed." (ARPANET anecdote; the slide does not give the exact year or the name ARPANET.) | KEY CONCEPT (history fact) | Sketch of a windmill (decorative) | No |
| 9 | Network cables did get messy at times! | Section-divider filler | none | none | No |
| 10 | This is not AI generated! | "Do not touch sticky notes were common in those days!" | none | Photo of a tangled cable rack; "PLEASE DO NOT TOUCH" sign | No |
| 11 | Okay, so computer networks are not new... | — | none | Cartoon "A Somewhat Accurate Drawing of the Internet" (project-decode.com): laptops, phones, routers, cell towers and desktops around a scribbled tangle of wires | No |
| 12 | Traditionally, we have had... | Network types by geographic scope. **WAN** (Wide Area Network): covers larger geographic areas, like connecting different branch offices of a company, or even the internet itself. **MAN** (Metropolitan Area Network): usually spans a city, often used by municipalities or large organizations. **LAN** (Local Area Network): typically used in homes or offices to connect computers and devices within a limited area. **PAN** (Personal Area Network): very short range, like connecting your smartphone to your smartwatch or wireless headphones. Diagram ranges: WAN 100 km, 1000 km (country, continent); MAN 10 km (city); LAN 10 m, 100 m, 1 km (room, building, campus); PAN square metre (around a person). | KEY CONCEPT | Nested ellipses titled "Geographical Scope": WAN outermost, then MAN, LAN, and PAN innermost, each labelled with its range | No |
| 13 | How extensive is the internet in the world? | "Despite being called 'the cloud,' the internet relies on massive physical infrastructure spanning the globe. 597 cable systems in 2025." | KEY CONCEPT (fact: 597 cable systems in 2025) | Photo of a diver beside a submarine cable; world map of submarine cable routes | No |
| 14 | Why is it hard to keep them safe? | "Any guesses?" | QUIZ | Cartoon of a person thinking. Cable-laying diagram: ship on the surface towing a plough on the seabed by a "Towing steel cable"; "Signal cable" (yellow, dashed) runs from the ship to the plough; "Submarine optical cable" (red) runs from the ship down to the seabed and is buried by the plough; "Submarine cable" label at the surface | No |
| 15 | Fishing anchors… | "The major cause of transatlantic network traffic issues are fishing anchors mistakenly damaging the cables." VICE article (Jul 29, 2024): "Let's Be Real, Sharks Aren't Eating Google's Undersea Internet Cables — Human activity causes the vast majority of underwater cable damage." Poster: "Most cable breaks? Anchors aweigh! (and nets, too)" — "70% of undersea cable: anchors & trawlers" | KEY CONCEPT (fact: about 70% of undersea cable damage comes from anchors and trawlers) | Cartoon poster of a boat, net, anchor, fish, crab and a "HEY, WATCH THE CABLE!" sign | No |
| 16 | Sharks trying to attack the cables! | Embedded YouTube video "Shark attack on subcable.wmv" (sudmike) | DEMO (video) | Video thumbnail of a shark near a cable | No |
| 17 | What happens when? | "What happens when you tap Instagram icon? You tap the Instagram icon on your phone and a reel plays in under a second. List every 'thing' your data touched between your thumb and the video." **The Gap:** "Most people stop at 'WiFi → Instagram.' The massive, intricate gap between that simple answer and reality is exactly what we study in this course." | QUIZ / KEY CONCEPT | Photo of a phone showing a Social Media app folder | No |
| 18 | (Netflix scenario) | "It's 10 PM. Millions are settling in for a Netflix movie. Suddenly, the app starts buffering or fails. What's happening behind the scenes?" | QUIZ (motivating question) | Netflix logo | No |
| 19 | Objective of the course | "We are going to demystify how networks work. Because networks are everywhere!" | TAKEAWAY | Wizard cartoon; globe surrounded by connected devices (cart, game controller, music, cutlery, AC unit, clock, document, keyboard, bulb, car, house, dog, phone, fridge, plug, suitcase) | No |
| 20 | Top-Down Approach. | Section divider | none | none | No |
| 21 | Why the Top-Down Approach? | **Applications First:** "We start with what you know and use daily (Web, HTTP, DNS, Streaming). Understanding the requirements of these applications explains why we need the underlying network services." **Drilling Down to Physical:** "Once the application logic is clear, we progress downward through the Transport (TCP/UDP), Network (IP/Routing), Link, and Physical layers. This approach constantly answers 'why' before 'what'." | KEY CONCEPT | Icon of downward chevrons over a tree/hierarchy | No |
| 22 | Of course, GPUs are connected using very fast network cards! | Two figures (see diagrams). Right figure: "Networking is the backbone of GPU clusters", "High-Speed Network Fabric", "200 GB/s NVLink → 200 Gbps InfiniBand". | none | (L) GPU-to-GPU data path across two hosts: on each host GPU Memory–GPU and System Memory–CPU sit on a PCI-e bus to a "Mellanox HCA"; the two HCAs are joined by "Network"; an orange arrow goes from GPU memory on the left through the HCAs to GPU memory on the right (RDMA-style). (R) Three nodes, each holding 4 chips (CPU/GPU mix), joined by a "High-Speed Network Fabric" bar; labels "200 GB/s NVLink" → "200 Gbps InfiniBand" | No |
| 23 | What to Expect from the Networking Course | **Foundation:** how computing devices talk to each other; how data travels. **Hands-on Labs:** configure your own network; Network Security. | none | Icons: two monitors with arrows; arrow to "0 1 0"; cloud-gear with three servers; security image | No |
| 24 | Join us on the adventure to discover how computer networks work | Filler ("I'M GOING ON AN ADVENTURE!" Hobbit GIF) | none | Meme image | No |
| 25 | Grading | Contests 20%; Projects 20%; Mid Semester 20%; End Semester 40% | none | Two-column table | No |
| 26 | Reference Books | Section divider | none | none | No |
| 27 | Reference Books | "Computer Networking: A Top-Down Approach" — James Kurose & Keith Ross (cover shows Eighth Edition, Pearson). "Data Communications and Networking" — Behrouz A. Forouzan (cover shows Fifth Edition). | none | Two book covers | No |
| 28 | Please fill in the feedback form. | Filler | none | none | No |
| 29 | Thank You! | Filler | none | none | No |
| 30 | (untitled; tooltip "Traceroute journey fr[om …] Google's Delhi server") | Traceroute path from your device to Google's Delhi server. Your device: "traceroute starts here". Hops 1–2, private network: 192.168.1.1, 10.240.9.204. Hops 3–5, your ISP: "hop 3 silent, then anaronline.net". Hop 6, Google's edge: "latency settles at ~16 ms". Hops 7–9, load balanced: "two IPs per hop = parallel paths". Hops 10–17, hidden core: "* * * — routers stay silent". Hop 18, Delhi server: "del…1e100.net · arrived ~20 ms". Footer: "Private → ISP → Google ed[ge] → [m]esh → core → destination"; "Latency climbs to ~16 ms, then plateaus once you hit Google". | DEMO (traceroute) | Vertical flowchart of 7 rounded boxes joined by down arrows: Your device → Hops 1–2 Private network → Hops 3–5 Your ISP → Hop 6 Google's edge → Hops 7–9 Load balanced → Hops 10–17 Hidden core → Hop 18 Delhi server, with the sublabels above | No |
| 31 | (untitled; tooltip "The OSI seven-layer m[odel]") | OSI 7-layer table (Layer / Name / Job · example). 7 Application, "What the user touches": apps talk to the network; HTTP, DNS, email, Instagram. 6 Presentation, "Format and encrypt": translates data format; TLS/SSL, JPEG, encoding. 5 Session, "Open and close talks": manages conversations; login sessions, sockets. 4 Transport, "Reliable delivery": splits and reorders data; TCP, UDP · ports. 3 Network, "Find the path": routing across networks; IP addresses, routers. 2 Data link, "Node to node": frames on the local link; MAC address, switches. 1 Physical, "Raw bits": signals on the wire; cables, fiber, radio, 0s and 1s. Footer: "Data flows down the stack to send, up the stack to receive". | KEY CONCEPT | Stacked table of 7 coloured rows (layers 7→1 from top to bottom) with three columns: Layer #, Name + short tagline, Job + examples. Down arrow at the bottom | No |

## Worked examples & numericals (verbatim givens, steps and answers as shown; flag any arithmetic error you notice in the source)
- None. The only numbers given are facts, not problems:
  - Network scope ranges (p12): PAN about 1 m² around a person; LAN 10 m / 100 m / 1 km; MAN 10 km; WAN 100 km / 1000 km.
  - 597 submarine cable systems in 2025 (p13).
  - 70% of undersea cable damage from anchors and trawlers (p15).
  - Grading: 20/20/20/40 (p25).
  - GPU interconnect: 200 GB/s NVLink and 200 Gbps InfiniBand (p22). Note the GB/s vs Gbps units.
  - Traceroute latencies (p30): about 16 ms at Google's edge (hop 6), about 20 ms at the destination (hop 18).

## Formulas stated
- None.

## Diagrams that must be recreated (page → description: nodes, arrows, labels, field widths)
- **p12 Geographical scope:** four nested ellipses. Outermost WAN ("100km, 1 000km (Country, Continent)"), then MAN ("10km (City)"), LAN ("10m, 100m, 1km (Room, Building, Campus)"), and innermost PAN ("Square meter (Around person)"). Full names are written beside each ring.
- **p14 Submarine cable laying:** a ship on the sea surface. A black "Towing steel cable" runs from the ship to a "Plough" on the seabed. A yellow dashed "Signal cable" runs from the ship to the plough. A red "Submarine optical cable" runs from the ship down to the seabed and along it, buried behind the plough. "Submarine cable" is labelled at the surface.
- **p22 GPU RDMA path:** two hosts, mirrored. Each host has GPU Memory above GPU and System Memory above CPU, both on a horizontal PCI-e bus that connects down to a "Mellanox HCA". The two HCAs are linked by "Network". An orange curved arrow runs from the left GPU Memory → left HCA → right HCA → right GPU Memory (dashed on the right).
- **p22 GPU cluster:** three node boxes, each with a 2×2 grid of CPU/GPU chips, connected along the top and joined below by a "High-Speed Network Fabric" bar. Labels: "200 GB/s NVLink" → "200 Gbps InfiniBand".
- **p30 Traceroute journey:** a vertical chain of 7 boxes (Your device; Hops 1–2 Private network 192.168.1.1, 10.240.9.204; Hops 3–5 Your ISP; Hop 6 Google's edge ~16 ms; Hops 7–9 Load balanced; Hops 10–17 Hidden core * * *; Hop 18 Delhi server ~20 ms) joined by down arrows.
- **p31 OSI 7-layer table:** 7 rows × 3 columns as in the page table, with a footer arrow "Data flows down the stack to send, up the stack to receive".

## Code / CLI / config shown (verbatim)
- No code. p30 summarises a `traceroute` output (no command text shown). Values shown: `192.168.1.1`, `10.240.9.204`, `anaronline.net`, `* * *`, `del…1e100.net`.

## In-class questions / quiz prompts shown on slides (verbatim, with answers if given)
- p3: "Is the cloud just someone else's computer?" Answer implied on pp4–6: "More like a lot of computers…", "A lot, lot!", "And all these servers need to talk to each other!"
- p14: "Why is it hard to keep them safe? Any guesses?" Answer on p15: fishing anchors (and trawlers/nets), about 70%. p16 jokes about sharks; the p15 VICE headline says sharks are not the real cause.
- p17: "What happens when you tap Instagram icon? … List every 'thing' your data touched between your thumb and the video." No answer given; the slide says this gap is what the course studies.
- p18: "It's 10 PM. Millions are settling in for a Netflix movie. Suddenly, the app starts buffering or fails. What's happening behind the scenes?" No answer given.

## Unclear / unreadable (page → what is unreadable and why)
- p30: the tooltip "Traceroute journey fr…" is cut off at the right edge (probably "from your device to Google's Delhi server"). The footer is partly hidden behind a down-arrow button: "Google ed[ge] → [m]esh". The destination hostname is shortened on the slide as "del…1e100.net".
- p31: the tooltip "The OSI seven-layer m…" is cut off (probably "model").
- p16: video content is not available (thumbnail only).

## Duplicate / overlap notes (pages that repeat other decks or earlier pages)
- pp3–6 repeat the title "What is the Cloud?" as a build-up.
- pp2, 9, 20, 26, 28 are plain gradient divider/filler slides.
- p13 (597 cable systems) and p22 (GPU networking) are recapped on WB-L02 p2.
- p31 (OSI layers) and p21 (top-down layer list) preview the OSI/TCP-IP lecture (WB-L02 p23 says "Lecture 3: OSI and TCP/IP Models"). They will likely overlap with L03 decks.
- p21's top-down order (Application → Transport → Network → Link → Physical) matches the Kurose & Ross textbook (p27).

## Topic list (flat bullet list of every distinct topic/subtopic covered, in order)
- Course intro: CSAI321 Computer Networks, Newton School of Technology
- What is the cloud: data centers full of servers that must communicate (Google Council Bluffs, Iowa)
- Cloud providers (AWS, Azure, GCP) and their fast networks
- Networking history: 1960s UCLA → SRI "login" message; only "lo" got through
- Messy cabling in early network rooms
- "Somewhat accurate drawing of the Internet"
- Network types by geographic scope: PAN, LAN, MAN, WAN (definitions, ranges, examples)
- Physical internet infrastructure: submarine cables (597 cable systems in 2025)
- Submarine cable laying (ship, plough, towing cable, optical cable)
- Threats to undersea cables: fishing anchors and trawlers (about 70%); sharks (myth/video)
- Motivating question: what happens when you tap Instagram (the "gap")
- Motivating question: Netflix buffering at 10 PM
- Course objective: demystify networks
- Top-down approach: applications first (Web, HTTP, DNS, streaming), then Transport (TCP/UDP), Network (IP/Routing), Link, Physical
- GPU cluster networking: Mellanox HCA RDMA path, NVLink 200 GB/s, InfiniBand 200 Gbps, high-speed fabric
- Course expectations: foundations, hands-on labs, configuring networks, network security
- Grading: Contests 20%, Projects 20%, Mid-Sem 20%, End-Sem 40%
- Reference books: Kurose & Ross (Top-Down Approach, 8th ed.); Forouzan (Data Communications and Networking, 5th ed.)
- Traceroute walkthrough to Google's Delhi server (private IPs, ISP, Google edge, load-balanced hops, silent core routers, ~16→20 ms latency)
- OSI seven-layer model: layer names, roles and example protocols/devices; data flows down the stack to send and up to receive
