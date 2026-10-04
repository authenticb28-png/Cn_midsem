# WB-L02 pages 1–25 — Moving Data Through the Core (CSAI321: Computer Networks, Lecture 2; PDF metadata title "Computer Networks Lecture 2"; file title "Circuit Switching, Packet Switching, Loss and throughput, Delay", dated 2026-08-12)

Note: Despite being in the "Whiteboards" folder, this PDF is a clean Canva slide export. No handwriting or ink annotations appear on any page (checked all 25 images). Every numerical is printed on the slides. The slide numbers printed on pages match the PDF page numbers. Pages 14 and 23 have no printed number.

## Page table
| Page | Section/slide title | Content summary (exact facts, numbers, definitions, lists — be specific, not vague) | Callout type | Diagram/figure on page (describe so it can be redrawn) | Handwriting present? |
|---|---|---|---|---|---|
| 1 | Moving Data Through the Core | Title slide, CSAI321: Computer Networks | none | Decorative network-mesh triangle | No |
| 2 | Recap | **The Physical "Cloud":** "millions of physical servers in large data centers that power our daily applications." **Global Infrastructure:** "over 597 submarine cables linking continents to deliver data rapidly." **The AI Network Era:** "ultra-fast networks to connect over 10,000 GPUs for training advanced models." | TAKEAWAY (recap) | Three icons: servers + cloud, globe with nodes, cloud-circuit | No |
| 3 | Join the lecture online on your dashboard | Filler | none | none | No |
| 4 | A Tale of Two Phone Calls | **The Landline Call:** "Grandma pauses for 10 seconds to think? That capacity sits idle — reserved, but wasted." **The WhatsApp Call:** "You pause for 10 seconds? No packets sent — that capacity is free for someone else." | ANALOGY (circuit vs packet switching) | Two dark cards (phone icon / WhatsApp icon) | No |
| 5 | The Road Not Taken: Circuit Switching. | "The classic telephone model. Before any conversation could start, the network reserved a dedicated end-to-end path and held it, exclusively, for the full duration of the call." **Guaranteed:** "Once the circuit is set up, the full reserved capacity is yours — predictable, stable, no surprises mid-call." **Wasteful for Bursty Data:** "Go quiet for even a few seconds, and that reserved capacity sits idle, unusable by anyone else, the whole time." | KEY CONCEPT | Phone icon; check-mark icon (pro) and hourglass icon (con) | No |
| 6 | A Tale of Two Phone Calls | Embedded YouTube video "Auntie Mame - Switchboard Operator" (Mark Ramsay), showing manual circuit setup by a switchboard operator | DEMO (video) | Video thumbnail of an operator at a switchboard with patch cords | No |
| 7 | How the Network Core Moves Data | Section divider | none | none | No |
| 8 | What Exactly Is a "Packet"? | **The Idea:** "Your message — a photo, a webpage, a voice clip — is chopped into small, independent chunks called packets." Each packet carries a **header** (addressing info) and a **payload** (your actual data). Packets can take different routes to the same destination. The core forwards each packet independently, hop by hop, router to router. **Store-and-Forward Rule:** "A router must receive the entire packet before it sends even the first bit onward." "Receive fully → check → forward fully". **Why it matters:** "no single router needs to know the whole path — it just needs to know the next hop." | KEY CONCEPT | Three router boxes in a row joined by arrows (→); a yellow "PKT" tag sits on the first router; caption "Receive fully → check → forward fully" | No |
| 9 | Sharing on Demand: Statistical Multiplexing. | "No reservations. Links are used only when packets actually need them — and that single idea unlocks two superpowers." **Efficiency:** "Real traffic is bursty — you're rarely sending data every millisecond. Packet switching lets many users share one link, because it's statistically unlikely they all burst at once." (caption "bursty users, one shared link"). **Resilience:** "Because packets aren't tied to one fixed path, if a link or router fails, traffic can simply be rerouted around the damage — nothing was 'reserved' there to lose." (caption "rerouted around the failure") | KEY CONCEPT | Icons only. The captions suggest illustrations ("bursty users, one shared link", "rerouted around the failure") that are not in the export (likely animations) | No |
| 10 | Packet Switching | "Packet switching gives no built-in guarantees. Packets can be delayed behind others in a queue, or dropped entirely when a router's buffer fills up under load." Box: **This Is the Seed of Everything TCP Does**: "In Weeks 5–6, we'll meet TCP — a protocol whose entire job is to paper over exactly this gap: detecting loss, retransmitting, and pacing data so an unreliable, best-effort core feels reliable to your applications." | WARNING / KEY CONCEPT | Lightning icon; dark callout box | No |
| 11 | Sources Of Delay | Section divider | none | none | No |
| 12 | The Toll-Booth Caravan | "Picture a caravan of cars arriving at a toll booth, then driving down a long highway to the next toll booth." "Each car must individually pass through the booth (one at a time, takes a fixed time each), then everyone drives the highway together at the speed limit." | ANALOGY | TOLL BOOTH (left, stopwatch icon) — HIGHWAY (dark band) with 5 cars, an arrow →, then 3 more cars — TOLL BOOTH (right, stopwatch icon) | No |
| 13 | Every Packet Pays Four Kinds of Delay | 1 **Processing:** "Router examines the header, checks for bit errors." — "tiny, ~microseconds". 2 **Queuing:** "Time waiting in a buffer behind other packets." — "variable — named only, not computed". 3 **Transmission:** "Time to push all the packet's bits onto the link." — "= L / R — we compute this". 4 **Propagation:** "Time for a bit to physically travel the link." — "= d / s — we compute this". | KEY CONCEPT | Four cards side by side with icons (chip, hourglass, truck, satellite dish). Cards 1–2 are white and cards 3–4 are dark, marking the two that are computed | No |
| 14 | Toll Booth = Transmission. Highway = Propagation. | **Transmission Delay ("Toll-booth time"):** "Time spent pushing every car (every bit) through the booth, one after another, before it can even start down the highway." Depends on: how many cars (packet size) and how fast the booth processes them (link rate). Tag: "MORE BOOTHS → FASTER". **Propagation Delay ("highway drive time"):** "Time spent actually driving down the highway between the two booths, at a fixed speed limit — has nothing to do with how many cars there are." Depends on: the distance between booths and the speed limit (signal speed). Tag: "MORE LANES ≠ FASTER". | ANALOGY / KEY CONCEPT | Two cards (white = transmission, dark = propagation) | No |
| 15 | Deep Dive: Two Threads Worth Pulling | **Why Big Tech Builds Its Own Backbone:** "Google, Meta, and Netflix lay their own private fibre between data centers and cities — shortening the physical path their traffic must travel." Connects back to Lecture 1: "shorter distance, in d/s terms, means lower propagation delay — the edge/core story and the delay story are the same story." **Why Packet Size Isn't 'Bigger Is Better':** "The relay demo hinted at this: across many hops, packet size changes how much pipelining is possible." "Huge packets: long waits at each hop before forwarding can start." "Tiny packets: more headers, more per-packet processing overhead." | KEY CONCEPT (deep dive) | Two cards | No |
| 16 | Let's Do the Maths — Lightly | Section divider | none | none | No |
| 17 | Transmission Delay: Pushing Bits Onto the Link | Formula **L / R** = "packet length (bits) ÷ link rate (bits/sec)". **Worked Example:** "L = 8,000 bits on a link with R = 2 Mbps; 8,000 ÷ 2,000,000 = 4 ms". **Why Doubling the Link Rate Matters:** 2 Mbps → 4 ms; 4 Mbps → 2 ms; 8 Mbps → 1 ms. | PRACTICE (worked example) | Formula box; three tiles in a row (2/4/8 Mbps with 4/2/1 ms) | No |
| 18 | Propagation Delay: The Bit's Physical Journey | Formula **d / s** = "distance (m) ÷ signal speed (≈ 2×10⁸ m/s in fibre)". No worked example on this slide. | KEY CONCEPT (formula) | Formula box | No |
| 19 | The 500 Mbps Link That Still Feels Slow | **Geostationary Satellite Link:** "It's advertised at a generous 500 Mbps. But your video call still has that awkward half-second lag where you and the other person keep talking over each other. The satellite orbits ~35,786 km above the equator. Up to the satellite, then back down — that's roughly 71,500 km the signal must travel, at the speed of light." Result: "~240 ms round-trip — from physics alone". | PRACTICE (propagation example) / KEY CONCEPT (high bandwidth ≠ low latency) | Dark panel: satellite icon at top, an "EARTH" ellipse at the bottom, two dashed lines from earth to satellite labelled "↑ 35,786 km ↑" (up leg) and "↓ 35,786 km ↓" (down leg); caption "~240 ms round-trip — from physics alone" | No |
| 20 | When Packets Don't Make It | Section divider (packet loss / throughput section). There is no separate loss slide; loss is covered on p10. | none | none | No |
| 21 | Throughput: What You Actually Get | **Throughput:** "The rate (bits/sec) at which data is actually received — not advertised, not theoretical. What lands." **Bottleneck Link:** "End-to-end throughput ≈ the minimum link rate anywhere on the path. The slowest hop sets the pace for everyone." **A Path With Three Links:** 10 Mbps — 2 Mbps — 5 Mbps; "↑ bottleneck — caps end-to-end throughput at 2 Mbps, no matter the other links". | KEY CONCEPT / PRACTICE | Three horizontal bars in series: thick teal "10 Mbps", thin red/salmon "2 Mbps" (bottleneck), medium teal "5 Mbps". Bar thickness is proportional to rate | No |
| 22 | "I Pay for 300 Mbps. Why Is It Buffering?" | **Scenario:** "Your ISP plan says 300 Mbps. Your 4K stream is stuttering anyway. Where is the real bottleneck hiding? Below is the full path your data travels — each hop has a different capacity. Identify which one is choking your stream." Path: Netflix Server → Congested Link (?) → Your ISP → Home WiFi (?) → Your TV. Answer box: "The 300 Mbps is your access link to the ISP — just one stop on a long path. The real bottleneck could be a congested inter-network link, an overloaded Netflix server, or (very often) your own home WiFi struggling with walls and interference. Next time your stream buffers, think: which hop is the slowest?" | QUIZ / TAKEAWAY | Five boxes left to right joined by → arrows: Netflix Server (server icon), Congested Link (route icon, red border, "?" badge), Your ISP (router icon), Home WiFi (wifi icon, red border, "?" badge), Your TV (camera icon). The suspected bottlenecks are highlighted. No per-hop rates are given | No |
| 23 | The Core Moves Packets. But Who Agrees on the Format? | "Thousands of different networks and apps need to agree on a format and order of operations — that's the job of protocol layers." Box: **Lecture 3: OSI and TCP/IP Models**: "The backbone model for the rest of the course — every later topic (addressing, routing, transport, applications) will be framed in terms of these layers." Tag: NEXT LECTURE | TAKEAWAY (preview) | Stack-of-layers icon | No |
| 24 | Thanks for watching! | Filler | none | none | No |
| 25 | Please fill the feedback form. | Filler | none | none | No |

## Worked examples & numericals (verbatim givens, steps and answers as shown; flag any arithmetic error you notice in the source)
1. **Transmission delay (p17).** Givens: "L = 8,000 bits on a link with R = 2 Mbps". Step: "8,000 ÷ 2,000,000 = 4 ms". Answer: **4 ms**. Check: 8000/2×10⁶ = 0.004 s = 4 ms. Correct.
2. **Doubling the link rate (p17)**, same L = 8,000 bits. 2 Mbps → **4 ms**; 4 Mbps → **2 ms**; 8 Mbps → **1 ms**. Check: 8000/4×10⁶ = 2 ms and 8000/8×10⁶ = 1 ms. Correct. Point made: transmission delay is inversely proportional to R.
3. **Geostationary satellite propagation (p19).** Givens: advertised link rate 500 Mbps; altitude ~35,786 km above the equator; up + down ≈ "roughly 71,500 km"; speed = speed of light. Answer shown: "**~240 ms round-trip — from physics alone**". Check: 2 × 35,786 = 71,572 km; 71,572 km ÷ 3×10⁵ km/s ≈ 0.2386 s ≈ 239 ms ≈ 240 ms. The arithmetic is correct.
   - **FLAG (terminology):** the ~240 ms covers one ground→satellite→ground traversal (one way between two earth stations), but the slide calls it "round-trip". A true round trip (request up/down and reply up/down) would be about 480 ms. That matches the slide's own "half-second lag" remark. Students may be confused about whether 240 ms is one-way or RTT.
   - **Note:** this example uses the speed of light (≈3×10⁸ m/s, free space), not the ≈2×10⁸ m/s fibre speed given on p18. The slide gives no explicit s value.
   - Point made: high bandwidth (500 Mbps) does not reduce propagation delay.
4. **Bottleneck throughput (p21).** Givens: path of three links, 10 Mbps, 2 Mbps, 5 Mbps. Answer: end-to-end throughput = min(10, 2, 5) = **2 Mbps** (the 2 Mbps link is the bottleneck). Correct.
5. **300 Mbps buffering scenario (p22).** Qualitative only, with no per-hop rates. Answer: the 300 Mbps is only the access link. The bottleneck could be a congested inter-network link, an overloaded Netflix server, or (very often) home WiFi.
- **Store-and-forward:** stated as a rule on p8 (router must receive the entire packet before forwarding the first bit). There is **no numerical** for store-and-forward or multi-hop end-to-end delay (e.g., N·L/R) on any slide. p15 mentions a "relay demo" (packet size vs pipelining across hops) that is not in the PDF.
- **Queuing delay:** explicitly "named only, not computed" (p13). **Processing delay:** "tiny, ~microseconds" (p13).
- **Circuit switching (pp4–5):** no numerical; the only number is the qualitative "10 seconds" pause.

## Formulas stated
- Transmission delay d_trans = **L / R**, "packet length (bits) ÷ link rate (bits/sec)" (pp13, 17)
- Propagation delay d_prop = **d / s**, "distance (m) ÷ signal speed (≈ 2×10⁸ m/s in fibre)" (pp13, 18)
- End-to-end throughput ≈ **minimum link rate** on the path, i.e. min(R1, R2, …, RN) (p21)
- Four delay components listed: processing + queuing + transmission + propagation (p13). The slide names all four but **does not** write a summed nodal-delay formula.
- Processing ≈ microseconds; queuing is variable (not computed) (p13)

## Diagrams that must be recreated (page → description: nodes, arrows, labels, field widths)
- **p8 Store-and-forward:** three router icons in boxes left to right, joined by → arrows. A "PKT" tag sits above the first router. Caption: "Receive fully → check → forward fully".
- **p12 Toll-booth caravan:** a TOLL BOOTH on the left and right (each with a stopwatch icon). A HIGHWAY band between them carries 5 cars near the left booth, an → arrow in the middle, and 3 cars further along. Caption: each car passes the booth one at a time (fixed time each), then all drive at the speed limit.
- **p13 Four delays:** four cards numbered 1–4: Processing (chip icon), Queuing (hourglass), Transmission (truck, "= L/R"), Propagation (satellite dish, "= d/s").
- **p14 Analogy mapping:** toll booth ↔ transmission ("MORE BOOTHS → FASTER"); highway ↔ propagation ("MORE LANES ≠ FASTER").
- **p19 GEO satellite:** a satellite above an EARTH ellipse. Two dashed slant lines, up leg "↑ 35,786 km ↑" and down leg "↓ 35,786 km ↓". Caption "~240 ms round-trip — from physics alone".
- **p21 Three-link path:** three horizontal bars in series. 10 Mbps (thick teal), 2 Mbps (thin salmon, labelled bottleneck), 5 Mbps (medium teal). Arrow note: "↑ bottleneck — caps end-to-end throughput at 2 Mbps, no matter the other links".
- **p22 Streaming path:** Netflix Server → Congested Link [?] → Your ISP → Home WiFi [?] → Your TV. Congested Link and Home WiFi have red borders and "?" badges.
- **p17 Rate tiles:** three tiles (2 Mbps / 4 ms; 4 Mbps / 2 ms; 8 Mbps / 1 ms).

## Code / CLI / config shown (verbatim)
- None.

## In-class questions / quiz prompts shown on slides (verbatim, with answers if given)
- p4 (implied): landline vs WhatsApp, a 10-second pause. Answer on the slide: landline capacity "sits idle — reserved, but wasted"; WhatsApp sends "No packets … that capacity is free for someone else."
- p22: "Your ISP plan says 300 Mbps. Your 4K stream is stuttering anyway. Where is the real bottleneck hiding? … Identify which one is choking your stream." Answer given: a congested inter-network link, an overloaded Netflix server, or (very often) home WiFi. The 300 Mbps is just the access link. "Next time your stream buffers, think: which hop is the slowest?"
- p19 (implicit): why does a 500 Mbps satellite link feel slow? Answer: propagation delay of about 240 ms from 71,500 km at light speed. Bandwidth does not fix latency.

## Unclear / unreadable (page → what is unreadable and why)
- p6: video content is not available (thumbnail only).
- p9: the captions "bursty users, one shared link" and "rerouted around the failure" refer to illustrations that are absent from the export, likely animations or GIFs that did not render. A faint grey line under the left caption suggests a missing graphic.
- p15: refers to a "relay demo" (packet size vs pipelining) that was done in class and is not in the PDF.
- p4: there is a large blank area between the title and the cards; possibly an animation that did not export.

## Duplicate / overlap notes (pages that repeat other decks or earlier pages)
- p2 recaps WB-L01: data centers (L01 pp3–6), 597 submarine cables (L01 p13), GPU networking (L01 p22). The "over 10,000 GPUs" figure is new; it is not in L01.
- p6 reuses the title "A Tale of Two Phone Calls" from p4.
- p15 ("Connects back to Lecture 1") links private backbones to the L01 edge/core material. Edge/core is not actually on any L01 slide, so it may come from a different L01 version or the slide-only deck.
- p23 previews Lecture 3 (OSI and TCP/IP), which overlaps with WB-L01 p31 (OSI table).
- p10 forward-references TCP (Weeks 5–6).
- pp3, 7, 11, 16, 20, 24, 25 are divider/filler slides.

## Topic list (flat bullet list of every distinct topic/subtopic covered, in order)
- Recap of L1: physical cloud/data centers, 597 submarine cables, AI networks of 10,000+ GPUs
- Circuit switching vs packet switching analogy (landline vs WhatsApp call, idle reserved capacity)
- Circuit switching: dedicated end-to-end path reserved for the call; pro: guaranteed, predictable capacity; con: wasteful for bursty data
- Switchboard operator video (manual circuit setup)
- Packets: message chopped into independent chunks; header (addressing) + payload (data)
- Packets may take different routes; hop-by-hop independent forwarding
- Store-and-forward rule: receive the entire packet → check → forward; routers only need the next hop
- Statistical multiplexing: no reservations; efficiency (bursty users share one link); resilience (reroute around failures)
- Packet switching gives no guarantees: queuing delay and packet drops when a buffer fills (loss); best-effort core
- TCP preview (Weeks 5–6): detect loss, retransmit, pace data
- Sources of delay: toll-booth caravan analogy
- Four delay types: processing (~µs), queuing (variable, not computed), transmission (L/R), propagation (d/s)
- Toll booth = transmission (depends on packet size and link rate); highway = propagation (depends on distance and signal speed)
- Big Tech private backbones (Google, Meta, Netflix) reduce distance and so propagation delay
- Packet size trade-off: huge packets mean long per-hop waits (less pipelining); tiny packets mean header and processing overhead
- Transmission delay formula and worked example (8,000 bits at 2 Mbps = 4 ms; 4 Mbps → 2 ms; 8 Mbps → 1 ms)
- Propagation delay formula; signal speed ≈ 2×10⁸ m/s in fibre
- GEO satellite example: 500 Mbps yet laggy; 35,786 km altitude, about 71,500 km path, ~240 ms (bandwidth ≠ latency)
- Packet loss (section "When Packets Don't Make It")
- Throughput definition (actual received rate)
- Bottleneck link: end-to-end throughput ≈ min link rate (10/2/5 Mbps → 2 Mbps)
- Real-world bottleneck scenario: 300 Mbps plan but 4K buffering (congested inter-network link, Netflix server, home WiFi)
- Protocol layers motivation; preview of Lecture 3 (OSI and TCP/IP models)
