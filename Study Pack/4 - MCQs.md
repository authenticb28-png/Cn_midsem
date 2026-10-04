# Computer Networks — MCQs

## Lectures

### Computer Networks - Revision — your score 8/8

**Q1.** Which access network technology would a student in a university lecture hall MOST likely be using?
- **A.** Geostationary satellite
- **B.** Home DSL broadband
- **C.** Enterprise/campus Ethernet or campus WiFi
- **D.** Tier-1 backbone fibre

**Answer:** C. Enterprise/campus Ethernet or campus WiFi (you chose C ✓)

**Why:** **Correct Answer: C**

University campus networks use enterprise Ethernet infrastructure with WiFi access points. DSL is a home technology; backbone fibre is the core, not the edge.

**Q2.** What does the term 'network of networks' mean in the context of the Internet?
- **A.** Every device must connect to every other device directly
- **B.** The Internet consists of thousands of independently administered ISPs and networks that interconnect using shared protocols
- **C.** There is one master network owned by ICANN that all ISPs plug into
- **D.** Networks are physically layered on top of each other in data centres

**Answer:** B. The Internet consists of thousands of independently administered ISPs and networks that interconnect using shared protocols (you chose B ✓)

**Why:** **Correct Answer: B**

'Network of networks' describes the Internet's decentralised structure: independent ISPs and networks interconnect voluntarily using standard protocols, with no single owner.

**Q3.** A friend abroad loads the same Instagram reel instantly; yours is slow. TWO best network reasons?
- **A.** They have better phone hardware and your CPU is slow
- **B.** A Edge server is closer to them; your last-mile access network link is the bottleneck
- **C.** Instagram throttles users in your country
- **D.** TCP is faster in their country

**Answer:** B. A Edge server is closer to them; your last-mile access network link is the bottleneck (you chose B ✓)

**Why:** **Correct Answer: B**

CDN geography means edge nodes are closer to some users, reducing propagation delay. The last-mile is often the bottleneck for local users.

**Q4.** Your reel buffers on cellular data but never on home WiFi. Where do you begin investigating?
- **A.** Instagram's origin data centre — they throttle cellular users
- **B.** The network core — backbone routers drop cellular packets
- **C.** The access network — cellular last-mile bandwidth or signal quality is the most likely bottleneck
- **D.** DNS servers — cellular DNS is slower

**Answer:** C. The access network — cellular last-mile bandwidth or signal quality is the most likely bottleneck (you chose C ✓)

**Why:** **Correct Answer: C**

Buffering on cellular but not WiFi points to the access network. The core and origin server are shared by both paths, so they are unlikely to be the cause.

### Circuit Switching, Packet Switching, Loss and throughput, Delay - Revision — your score 12/12

**Q1.** In the store-and-forward model, when can a router begin forwarding a packet to the next link?
- **A.** As soon as the first bit arrives
- **B.** Only after the entire packet has been received and checked
- **C.** After half the packet arrives
- **D.** Immediately, without waiting

**Answer:** B. Only after the entire packet has been received and checked (you chose B ✓)

**Why:** **Correct Answer: B**

Store-and-forward: the router must receive the complete packet before transmitting it on the outbound link. This adds a full packet-transmission-time delay at each hop.

**Q2.** One scenario where circuit switching is still preferable over packet switching?
- **A.** Downloading a large file — guaranteed bandwidth for the whole transfer
- **B.** A traditional PSTN voice call requiring guaranteed constant bandwidth with predictable delay
- **C.** Web browsing — packets need to be reserved
- **D.** DNS lookups — they require dedicated paths

**Answer:** B. A traditional PSTN voice call requiring guaranteed constant bandwidth with predictable delay (you chose B ✓)

**Why:** **Correct Answer: B**

Classic PSTN telephony benefits from circuit switching's guaranteed bit-rate and deterministic delay — essential for voice quality. Bursty applications are better served by packet switching.

**Q3.** A 10,000-bit packet crosses three links with rates 10 Mbps, 2 Mbps, and 5 Mbps. What are the three transmission delays and which link is the bottleneck?
- **A.** 1 ms, 5 ms, 2 ms — bottleneck is the 2 Mbps link
- **B.** 0.1 ms, 2 ms, 0.5 ms — bottleneck is the 5 Mbps link
- **C.** 1 ms, 5 ms, 2 ms — bottleneck is the 5 Mbps link
- **D.** 1 ms, 2 ms, 5 ms — bottleneck is the 10 Mbps link

**Answer:** A. 1 ms, 5 ms, 2 ms — bottleneck is the 2 Mbps link (you chose A ✓)

**Why:** **Correct Answer: A**

10,000/10M=1 ms; 10,000/2M=5 ms; 10,000/5M=2 ms. Throughput is limited by the slowest link: 2 Mbps.

**Q4.** A geostationary satellite link is advertised at 500 Mbps but feels sluggish for video calls. Which delay dominates, and why doesn't more bandwidth fix it?
- **A.** Queuing delay — more bandwidth adds queue space
- **B.** Propagation delay — the satellite orbits ~35,000 km up; d/s ≈ 240 ms one-way regardless of link rate
- **C.** Transmission delay — 500 Mbps is too low for HD video
- **D.** Processing delay — satellite routers are slow

**Answer:** B. Propagation delay — the satellite orbits ~35,000 km up; d/s ≈ 240 ms one-way regardless of link rate (you chose B ✓)

**Why:** **Correct Answer: B**

Geostationary satellites are ~35,786 km away. Propagation delay ≈ 179 ms one-way (~360 ms RTT). This is purely distance/speed-of-light and does not decrease with higher bandwidth.

**Q5.** Your home plan is 300 Mbps but a 4K stream still buffers. Where is the most likely bottleneck?
- **A.** The Internet backbone — tier-1 ISPs cannot handle 4K
- **B.** The bottleneck could be your WiFi radio, the streaming server's uplink, or a congested link inside your ISP — not necessarily your advertised plan speed
- **C.** Your router's DNS cache
- **D.** The CDN edge — they never cache 4K

**Answer:** B. The bottleneck could be your WiFi radio, the streaming server's uplink, or a congested link inside your ISP — not necessarily your advertised plan speed (you chose B ✓)

**Why:** **Correct Answer: B**

End-to-end throughput equals the minimum link rate on the path. The bottleneck could be your WiFi effective speed, the server's capacity, or a congested ISP link.

### OSI Model - Revision — your score 2/2

**Q1.** What is the main benefit of layering in network design?
- **A.** It increases the speed of every packet by splitting work across layers
- **B.** Each layer is independent — you can change one layer (e.g., swap WiFi for Ethernet) without affecting the others, giving modularity and interoperability
- **C.** Layering removes all headers to reduce packet size
- **D.** It forces every vendor to use identical hardware

**Answer:** B. Each layer is independent — you can change one layer (e.g., swap WiFi for Ethernet) without affecting the others, giving modularity and interoperability (you chose B ✓)

**Why:** **Correct Answer: B**

Layering provides modularity (swap link technology without touching the app), interoperability (mix vendors), and manageability (debug one layer at a time). Each layer only talks to the layer directly above or below it.

**Q2.** You click a YouTube link. At which TCP/IP layer does the URL request exist, and what is the PDU called at that layer?
- **A.** Network layer — the PDU is called a datagram
- **B.** Transport layer — the PDU is called a segment
- **C.** Application layer — the PDU is called a message
- **D.** Link layer — the PDU is called a frame

**Answer:** C. Application layer — the PDU is called a message (you chose C ✓)

**Why:** **Correct Answer: C**

The HTTP request (containing the URL) is an Application-layer message. As it moves down the stack it becomes a Transport segment, then a Network datagram, then a Link frame, then physical bits.

### TCP/IP Model, Network Devices - Revision — your score 3/3

**Q1.** Which of the following correctly lists all five TCP/IP layers from top to bottom?
- **A.** Physical → Link → Network → Transport → Application
- **B.** Application → Transport → Network → Link → Physical
- **C.** Application → Network → Transport → Link → Physical
- **D.** Transport → Application → Network → Physical → Link

**Answer:** B. Application → Transport → Network → Link → Physical (you chose B ✓)

**Why:** **Correct Answer: B**

The TCP/IP 5-layer model top-to-bottom: Application, Transport, Network, Link, Physical. Remembering the order is the foundation for understanding encapsulation and which protocol belongs where.

**Q2.** In the OSI model, the Presentation and Session layers sit between Application and Transport. Where do these functions go in the practical TCP/IP model?
- **A.** They become separate layers between Transport and Network in TCP/IP
- **B.** They are folded into the TCP/IP Application layer — the application handles encoding, encryption, and session management itself
- **C.** They are handled by the TCP/IP Physical layer
- **D.** They are removed entirely and never used on the Internet

**Answer:** B. They are folded into the TCP/IP Application layer — the application handles encoding, encryption, and session management itself (you chose B ✓)

**Why:** **Correct Answer: B**

OSI is the reference model with 7 layers; TCP/IP is what actually runs on the Internet with 5 layers. The Presentation and Session functions are absorbed into the Application layer in TCP/IP — there are no separate layers for them.

### Email Protocols, Application Services, Cryptography - Revision — your score None/2

**Q1.** Secure IMAP port?
- **A.** 110
- **B.** 993
- **C.** 587
- **D.** 995

**Answer:** _not shown by Newton_

### Transport Layer, Caching, Content Delivery Network (CDN), Route 53 DNS Service,  ... - Revision — your score 6/6

**Q1.** Cache hit reduces:
- **A.** Storage
- **B.** Latency and origin load
- **C.** TLS
- **D.** Email size

**Answer:** B. Latency and origin load (you chose B ✓)

**Why:** **Explanation:** Cached data is reused.

**Q2.** Cache miss occurs when:
- **A.** Fresh cache exists
- **B.** Object missing/expired
- **C.** Browser offline
- **D.** SMTP fails

**Answer:** B. Object missing/expired (you chose B ✓)

**Why:** **Explanation:** Origin fetch required.

**Q3.** Cache-Control max-age primarily defines:
- **A.** TLS life
- **B.** Cache lifetime
- **C.** SMTP retry
- **D.** DNS TTL

**Answer:** B. Cache lifetime (you chose B ✓)

**Why:** **Explanation:** Cache freshness.
