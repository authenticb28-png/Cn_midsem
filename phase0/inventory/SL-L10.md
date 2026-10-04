# SL-L10 pages 1-27 — Reliable Data Transfer and TCP Flow Control

(Newton School of Technology; Canva export. Companion file WB-L10 "L10 - 2026-09-09 - Transport Layer, Caching, Content Delivery Network (CDN), Route 53 DNS Service,.pdf" is the same deck, see Duplicate notes.)

## Page table
| Page | Section/slide title | Content summary (exact facts, numbers, definitions, lists — be specific, not vague) | Callout type | Diagram/figure on page (describe so it can be redrawn) | Handwriting present? |
|---|---|---|---|---|---|
| 1 | Title: "Reliable Data Transfer and TCP Flow Control" | Title only | none | Decorative network-mesh triangle (SL copy has a "Canva" watermark) | No |
| 2 | Join the lecture online on your dashboard | Filler | none | Background only | No |
| 3 | Layers recap | Application Layer: "Request content" / "Return content in required format" (Application Layer ↔ Website). Presentation Layer: Encryption → Compression → Translation. Session Layer: "Session of communication". Transport Layer: Segmentation → Transport → Reassembly | none (recap) | Four icon mini-flows in a 2×2 grid (arrows between icons as listed) | No |
| 4 | Building reliability from an unreliable channel (section divider) | Section header | none | Background only | No |
| 5 | Transmission control protocol | TCP: establishes connection prior to data transmission; maintains data integrity using sequence numbers, acknowledgments and checksums; ensures reliable, ordered delivery of data packets, handling any loss; handles the connection tear-down process as well | KEY CONCEPT | 3-way handshake sequence diagram (Client/Server; SYN →, ← SYN-ACK, ACK →; "Connection Established"), same image as SL-L09 p18 | No |
| 6 | TCP Connection Teardown | Identical to SL-L09 p21: 4-way handshake. Step 1 "I have to go." (FIN, client sends FIN); Step 2 "Okay." (ACK, server acknowledges); Step 3 "I'm done too." (FIN, server sends own FIN after finishing remaining data); Step 4 Final "Bye." (ACK, client's last ACK) | KEY CONCEPT | Teardown sequence: FIN →, ← ACK, ← Remaining Data (if any) (dashed), bar "Server continues sending until finished", ← FIN, ACK →, bar "Connection Closed" | No |
| 7 | Wireshark TCP echo server follow up (section divider) | Section header only; no capture shown on slide (live demo implied) | DEMO (header only) | Background only | No |
| 8 | Checksums: (1/3) | "As TCP aims to provide reliable data transfer, checksum detects transmission errors so that corrupted data can be retransmit." Alice sends two 8-bit chunks: Chunk 1: 10010011 (147 decimal); Chunk 2: 01010110 (86 decimal). Step 1 (Sender/Alice): add chunks. Shown: 10010011 + 01010110 = "1 00001001 (There's a carry-over bit!)" | PRACTICE (worked example) | Monospace column addition (image) | No |
| 9 | Checksums: (2/3) | Step 2: add carry-over 1 to result: 00001001 + 1 = 00001010 "(This is the sum)". Step 3: 1's complement (flip all bits) → "So checksum becomes 11110101." | PRACTICE | Monospace column addition | No |
| 10 | Checksums: (3/3) | Alice sends original chunks + checksum (11110101) to Bob. Bob repeats the calculation: 10010011 + 01010110 → 00001010; then adds received checksum: 00001010 (Sum of the data) + 11110101 (Checksum from the data) = 11111111 (All 1s!). "If the final result is all 1s, TCP knows with high probability that the data is perfect!" | PRACTICE + TAKEAWAY | Two monospace addition blocks | No |
| 11 | The Waiting Game: Round Trip Time (RTT) | Alice needs a receipt (ACK) from CAROL to know it arrived safely. How long to wait before assuming the page was lost? Ten milliseconds? A full second? RTT = total time for a segment to go from Alice to CAROL and for CAROL's acknowledgment to come back to Alice | KEY CONCEPT (with question) | TCP CLIENT (laptop) and TCP SERVER (server) lifelines; slanted dashed arrows "TCP SYN" (C→S), "SYN-ACK" (S→C), "ACK" (C→S). Client side: "Send Request" to "Receive Data" span marked RTT (red dashed). Server side: "Send Request" to "Receive Data" span marked RTT | No |
| 12 | Round Trip Time (RTT) | Two ping captures. `ping newtonschool.co` → 99.83.190.102, 56 data bytes, 64-byte replies, ttl=249, times 24.607 / 23.815 / 24.538 / 30.614 ms; 4 transmitted, 4 received, 0.0% loss; round-trip min/avg/max/stddev = 23.815/25.893/30.614/2.743 ms. `ping taobao.com` → 59.82.121.163, ttl=79, icmp_seq 0-18, times ≈428-524 ms; 19 transmitted, 19 received, 0.0% loss; min/avg/max/stddev = 428.674/446.721/523.929/26.781 ms | DEMO | Two terminal screenshots side by side (near server ≈25 ms vs far server ≈447 ms) | No |
| 13 | Stop and Wait Protocol / Sliding Window Protocol (section divider) | Section header | none | Background only | No |
| 14 | Why is Flow Control Needed? | Not all devices have the same buffer size or processing power. A fast sender could flood a slow receiver, leading to packet loss or buffer overflow. TCP flow control prevents this by letting the receiver say: "Hey, slow down — I can only handle this much right now." | KEY CONCEPT | Printed hand-drawn-style figure (part of the slide, not live annotation): Browser column states Closed → SYN Sent → Established; Server column states Closed → Listen → SYN Received → Established; arrows SYN (B→S), SYN/ACK (S→B), ACK (B→S). (TCP handshake state diagram; does not show flow control) | No |
| 15 | How Stop-and-Wait Works | Link: https://nstclassdemo2025.pages.dev/stop-and-wait. Sender transmits data packet with sequence number N; sender stops all transmission and waits; receiver receives packet N, processes it; receiver sends ACK with acknowledgment number N+1 ("I received N, send me N+1 next") | DEMO + KEY CONCEPT | "Stop-and-Wait Protocol Flow": SENDER/RECEIVER lifelines. (1) DATA Packet (Seq = N) →; badge "SENDER STOPS & WAITS"; (2) ← ACK Packet (Ack = N+1) "Receiver processes packet N and sends ACK N+1"; (3) DATA Packet (Seq = N+1) → "Sender receives ACK and transmits next packet"; "SENDER STOPS & WAITS"; (4) ← ACK Packet (Ack = N+2); "Cycle repeats...". Legend: blue Data Transmission, green ACK Response, orange Sender Waiting | No |
| 16 | Stop & Wait Mechanism | Very inefficient for high-latency or high-bandwidth networks. Example: on a long-distance link the sender wastes time waiting for each ACK before sending again. "Utilization is low:" Utilization = T_frame / (T_frame + 2·T_prop); T_frame → transmission time; T_prop → propagation delay | KEY CONCEPT (formula) | Kurose stop-and-wait timing figure: Sender and Receiver vertical time axes; "First bit of first packet transmitted, t = 0"; "Last bit of first packet transmitted, t = L/R"; slanted band to receiver: "First bit of first packet arrives", "Last bit of first packet arrives, send ACK"; ACK line back; "ACK arrives, send next packet, t = RTT + L/R"; RTT bracket on sender axis | No |
| 17 | Sliding Window Protocol | TCP uses a "sliding window protocol" to manage flow control. Receiver tells sender how much data it can receive at a time (window size). As receiver processes data and acknowledges packets, sender "slides" the window forward and sends more | KEY CONCEPT | Two strips of cells 1-10. (1) "Intial Window" (sic) box covering 1-8. (2) "Window Slides →" box covering 2-9 | No |
| 18 | How Sliding Window Protocol Works | Link: https://nstclassdemo2025.pages.dev/sliding-window. Embedded trace (see Worked examples): window size = 4; T1 send Seq 1-4; T2 ACK=2, ACK=3 → window [3,4,5,6]; T3 send Seq 5, 6; T4 ACK=5 → window [5,6,7,8], send Seq 7 | DEMO | "Sliding Window Protocol Flow" screenshot: top strip "Sender's Sliding Window (Window Size = 4)" cells 1-10 with 1,2,3 green (ACKed), 4,5 blue (Sent, waiting ACK), 6,7 orange (Can send), 8-10 grey (Future), red "Window" box around 4-7; below a SENDER/RECEIVER timeline with numbered arrows 1-10 and explanation boxes | No |
| 19 | Zero Window Condition (1/3) | Zero Window condition occurs in TCP flow control when the receiver's buffer is full and it temporarily tells the sender to stop sending data. Done by the receiver advertising a window size of zero in the TCP header | KEY CONCEPT | Overflowing cardboard box clip-art | No |
| 20 | Zero Window Condition (2/3) | Visual only: after app stops reading, buffer fills, receiver sends Zero Window Advertisement; sender sends periodic Zero Window Probes; each answered with ZW Adv. | none | (a) Sequence diagram: RECEIVER (phone) and SENDER (server) both ESTABLISHED; several double-headed DATA arrows; black dot "App stops reading DATA"; red dot "Buffer FULL" → red "Zero Window Adv." R→S; then repeated pairs: blue "Zero Window Probe"/"ZWP" S→R and red "ZW Adv." R→S, label "TCP Zero Window Probing". (b) Packets-vs-Time (s) plot: y ticks 1 and 10; "Handshake" spike, burst of DATA spikes; black dot "App stops reading DATA", red dot "Buffer FULL"; then sparse paired red (Zero Window Advertisement) and blue (Zero Window Probe) spikes of height 1 at increasing spacing | No |
| 21 | Zero Window Condition (3/3) | Link: https://nstclassdemo2025.pages.dev/zero-window. Embedded "Zero Window Condition in TCP" trace (details in Worked examples): buffer states 60% Full / Window 4KB; 100% Full / Window 0; Empty / Window 8KB; phases 1-7 incl. 1-byte probes, exponential backoff 1s, 2s, 4s, 8s..., window re-opens with Win=4KB | DEMO | Screenshot: three buffer gauges on top; SENDER/RECEIVER timeline with arrows 1-12 grouped in 7 coloured phase boxes; legend: Normal Data Transmission (blue), ACK with Window Size (green), Blocked Transmission (red), Zero Window Probe (yellow) | No |
| 22 | Go-Back-N | GBN is an error control protocol for reliable communication over noisy channels. Sender may send multiple frames before receiving an ACK; if a frame is lost or erroneous, the sender must retransmit that frame and all subsequent frames. Link: https://computerscience.unicam.it/marcantoni/reti/applet/GoBackProtocol/goback.html | KEY CONCEPT + DEMO | "Go-Back-N Protocol Flow" screenshot: "Sender's Window (Window Size = 4) - Before Error" cells 1-8: 1,2 green ACKed; 3,4 blue Sent; 5 red Lost (x); 6 blue Sent; 7,8 grey Future; window box around 3-6; timeline with arrows 1-14 in 7 phases (see Worked examples) | No |
| 23 | How Go-Back-N Works | Sender sends N frames at once without waiting for individual ACKs. Receiver only accepts frames in order (sequentially). If a frame is lost or corrupted, receiver discards that frame and all that follow, even if they're correct. Sender goes back to the last acknowledged frame and retransmits all frames from there | KEY CONCEPT | None | No |
| 24 | Selective Repeat | SR is an error-control protocol to ensure reliable delivery over unreliable or noisy networks. Unlike Go-Back-N it only retransmits frames that were lost or corrupted, not all subsequent frames | KEY CONCEPT | "Selective Repeat" timing diagram: Sender → Receiver: Data 0, Data 1, Data 2 ("Damaged or error" → "Discarded"), Data 3, Data 4; receiver sends "NAK 2" back; sender "Resent" Data 2, then Data 5, Data 6; both axes labelled Time | No |
| 25 | How Selective Repeat Works | Sender can send multiple frames up to a specified window size without waiting for ACKs. Receiver can accept and buffer frames out of order. If a frame is lost/corrupted: receiver discards only that frame; sends a Negative ACK (NACK) or simply doesn't ACK that frame. Sender retransmits only the missing frame, not the whole window. Link: https://media.pearsoncmg.com/ph/esm/ecs_kurose_compnetwork_8/cw/content/interactiveanimations/selective-repeat-protocol/index.html | KEY CONCEPT + DEMO | None | No |
| 26 | Please fill the feedback form | Filler | none | Background only | No |
| 27 | Thank You | Filler | none | None | No |

## Worked examples & numericals
### Internet-checksum example (p8-p10), verbatim as shown
- Givens: Chunk 1 = 10010011 (147), Chunk 2 = 01010110 (86), 8-bit words.
- Step 1 (slide): 10010011 + 01010110 = **1 00001001** "(There's a carry-over bit!)"
- Step 2 (slide): 00001001 + 1 = **00001010** "(This is the sum)"
- Step 3 (slide): 1's complement → checksum **11110101**
- Receiver (slide): 10010011 + 01010110 = 00001010; 00001010 + 11110101 = **11111111** (All 1s!) → data OK.
- **ARITHMETIC ERROR IN SOURCE:** 147 + 86 = 233 = **11101001**, which fits in 8 bits, so there is no carry. "1 00001001" would be 265. Correct working: sum = 11101001, wrap-around not needed, checksum = 1's complement = **00010110**. Receiver check: 11101001 + 00010110 = 11111111. Steps 2-3 and p10 are internally consistent with the wrong Step-1 sum (00001010 + 11110101 = 11111111 holds), so only the initial addition is wrong. Verified with Python. The method (add, wrap carry, complement, receiver sum = all 1s) is correct.

### Ping RTT data (p12)
- newtonschool.co (99.83.190.102): 4 samples 24.607, 23.815, 24.538, 30.614 ms → min/avg/max/stddev 23.815/25.893/30.614/2.743 ms (checked: mean 25.8935, population stddev 2.743, consistent).
- taobao.com (59.82.121.163): 19 samples (428.674-523.929 ms) → 428.674/446.721/523.929/26.781 ms (checked: consistent). ttl=79 vs ttl=249 for newtonschool.co.

### Stop-and-wait trace (p15)
- DATA Seq=N → ; sender stops & waits ; ← ACK = N+1 ; DATA Seq = N+1 → ; waits ; ← ACK = N+2 ; cycle repeats. (ACK number = next expected.)

### Utilization (p16)
- Formula only: U = T_frame / (T_frame + 2·T_prop). Figure: last bit sent at t = L/R; ACK arrives at t = RTT + L/R. **No numerical utilization example with numbers is given in the deck.**

### Sliding-window trace (p18), window size 4
- Header snapshot: 1-3 ACKed, 4-5 sent (waiting ACK), 6-7 can send, 8-10 future; window = [4,5,6,7].
- T1 Initial Window Burst: (1-4) DATA Seq=1,2,3,4. "Window Full: Sender transmits 4 packets simultaneously (window size = 4)". Window [1,2,3,4] all sent, waiting for ACKs.
- T2 First ACKs Return: (5) ACK=2, (6) ACK=3. "Cumulative ACKs: ACK=2 confirms packet 1, ACK=3 confirms packets 1&2". Window slides: [3,4,5,6], can send packets 5&6.
- T3 Window Slides Forward: (7) DATA Seq=5, (8) DATA Seq=6. "Continuous Flow". Window [3,4,5,6], maintaining 4 packets in flight.
- T4 More ACKs & Sliding: (9) ACK=5, (10) DATA Seq=7. "Pipeline Effect: ACK=5 confirms packets 3&4, window slides to [5,6,7,8]"; "packet 7 sent immediately". "Process continues with pipeline always full..."
- Note: the header snapshot [4,5,6,7] does not match any trace step. At T4 packet 8 is also sendable but only packet 7 is drawn.

### Zero-window trace (p21)
- Buffer states: Normal Operation 60% Full → Window Size 4KB; Zero Window 100% Full → Window Size 0; After App Reads Empty → Window Size 8KB.
- Phase 1 Normal Data Flow: (1) DATA (1KB), (2) DATA (1KB). "Receiver Buffer: Filling up, application reading slowly".
- Phase 2 Buffer Full: (3) ← ACK + Win=0. "Zero Window Advertised: receiver buffer full, advertises window size = 0".
- Phase 3 Transmission Blocked: (4) DATA Blocked (x), "SENDER BLOCKED". "Flow Control Active: Sender cannot send new data, must wait for window update"; "Window Size: 0 - No transmission allowed".
- Phase 4 Zero Window Probing: (5) Zero Window Probe →, (6) ← ACK + Win=0. "Sender periodically sends 1-byte probes to check window status"; "Still zero window - application hasn't consumed data yet".
- Phase 5 More Probing: (7) probe, (8) ACK + Win=0. "Exponential Backoff: Probe interval increases (1s, 2s, 4s, 8s...)".
- Phase 6 Window Opens: (9) probe, (10) ← ACK + Win=4KB. "Application finally reads data, receiver advertises available window"; "Buffer space available: 4KB window advertised".
- Phase 7 Normal Flow Resumes: (11) DATA (2KB), (12) DATA (2KB). "Flow Restored".
- Note (source inconsistency): the gauges say an 8KB buffer that is 60% full advertises 4KB (8KB × 40% free = 3.2KB), and "After App Reads: Empty → 8KB" while the trace advertises 4KB. These are illustrative numbers, not a worked numerical.

### Go-Back-N trace (p22), window size 4
- Window before error: 1,2 ACKed; 3,4,5,6 sent (5 lost); 7,8 future.
- Phase 1 Initial Window Transmission: (1) Seq=3, (2) Seq=4, (3) Seq=5 LOST, (4) Seq=6. "Window [3,4,5,6] - packet 5 lost in transit".
- Phase 2 Successful ACKs: (5) ACK=4, (6) ACK=5. "Receiver ACKs packets 3&4 (ACK=4 means 'got up to 3', ACK=5 means 'got up to 4')". "Window slides: [5,6,7,8] - but packet 5 was lost".
- Phase 3 Out-of-Order Detection: (7) ACK=5 (Duplicate), (8) ACK=5 (Duplicate). "Gap Detection: Receiver gets packet 6 but still missing 5, sends duplicate ACK=5"; "Receiver discards packet 6 (out of order) - only accepts in-order delivery".
- Phase 4 Timeout Occurs: "TIMEOUT for Packet 5". "Sender's timer for packet 5 expires"; "Go-Back-N Triggered: Must retransmit packet 5 AND all subsequent packets".
- Phase 5 Go-Back-N Retransmission: (9) DATA Seq=5 RETX, (10) DATA Seq=6 RETX. "Even though packet 6 was received, it must be retransmitted due to Go-Back-N".
- Phase 6 Successful Recovery: (11) ACK=6, (12) ACK=7. "Receiver gets packets 5&6 in order". "Window advances: [7,8,9,10]".
- Phase 7 Continued Transmission: (13) Seq=7, (14) Seq=8. "Pipeline Restored".
- Note (source quirk): two duplicate ACK=5 are drawn although only one out-of-order packet (6) arrived after the loss.

### Selective Repeat example (p24)
- Data 0, 1 OK; Data 2 damaged/error → discarded; Data 3, 4 received (buffered); receiver sends NAK 2; sender resends Data 2 only; then Data 5, 6.

## Formulas stated
- Stop-and-wait utilization: Utilization = T_frame / (T_frame + 2 · T_prop), where T_frame = transmission time and T_prop = propagation delay (p16).
- Figure annotations (p16): last bit transmitted at t = L/R; ACK arrives / next packet sent at t = RTT + L/R.
- Checksum procedure (p8-10): sum 8-bit words with carry wrap-around (end-around carry) → 1's complement = checksum; receiver: sum(data) + checksum = all 1s ⇒ no error detected.
- ACK numbering in stop-and-wait: ACK = N+1 for packet N (p15).
- RTT = time for segment to go sender→receiver + ACK back (p11).

## Diagrams that must be recreated
- p3: Layers recap 2×2 icon flows (App: request/return content; Presentation: Encryption → Compression → Translation; Session: session of communication; Transport: Segmentation → Transport → Reassembly).
- p5: 3-way handshake (Client/Server, SYN / SYN-ACK / ACK, "Connection Established").
- p6: 4-way teardown (FIN, ACK, remaining data, FIN, ACK, "Connection Closed").
- p8-10: checksum column additions (redraw with corrected arithmetic, noting the source error).
- p11: RTT timing diagram: TCP CLIENT / TCP SERVER, dashed slanted arrows TCP SYN →, ← SYN-ACK, ACK →; RTT brackets between "Send Request" and "Receive Data" on each side.
- p14: TCP state columns: Browser Closed → SYN Sent → Established; Server Closed → Listen → SYN Received → Established; SYN, SYN/ACK, ACK arrows.
- p15: Stop-and-wait flow: Seq=N →, wait, ← Ack=N+1, Seq=N+1 →, wait, ← Ack=N+2.
- p16: Kurose stop-and-wait timing diagram (t=0, t=L/R, RTT, t=RTT+L/R) and the utilization formula.
- p17: Sliding window strips over packets 1-10: window 1-8, then slides to 2-9.
- p18: Sliding-window flow, window = 4 (full trace above; status strip colours ACKed / Sent / Can send / Future).
- p20: Zero-window sequence diagram (ESTABLISHED, DATA, App stops reading, Buffer FULL, Zero Window Adv., ZWP / ZW Adv. pairs) and packets-vs-time plot.
- p21: Zero-window 7-phase trace with buffer gauges (60%/4KB, 100%/0, Empty/8KB).
- p22: GBN 7-phase trace (window 4, packet 5 lost, dup ACKs, timeout, retransmit 5 & 6).
- p24: Selective Repeat with NAK 2 (Data 0-4, 2 damaged, NAK 2, resend 2, then 5, 6).

## Code / CLI / config shown
- p12: `ping newtonschool.co` output:
```
❯ ping newtonschool.co
PING newtonschool.co (99.83.190.102): 56 data bytes
64 bytes from 99.83.190.102: icmp_seq=0 ttl=249 time=24.607 ms
64 bytes from 99.83.190.102: icmp_seq=1 ttl=249 time=23.815 ms
64 bytes from 99.83.190.102: icmp_seq=2 ttl=249 time=24.538 ms
64 bytes from 99.83.190.102: icmp_seq=3 ttl=249 time=30.614 ms
^C
--- newtonschool.co ping statistics ---
4 packets transmitted, 4 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 23.815/25.893/30.614/2.743 ms
```
- p12: `ping taobao.com` output:
```
kuldeepkrjha@Kuldeeps-MacBook-Pro ~ % ping taobao.com
PING taobao.com (59.82.121.163): 56 data bytes
64 bytes from 59.82.121.163: icmp_seq=0 ttl=79 time=429.367 ms
64 bytes from 59.82.121.163: icmp_seq=1 ttl=79 time=432.486 ms
64 bytes from 59.82.121.163: icmp_seq=2 ttl=79 time=478.576 ms
64 bytes from 59.82.121.163: icmp_seq=3 ttl=79 time=502.599 ms
64 bytes from 59.82.121.163: icmp_seq=4 ttl=79 time=523.929 ms
64 bytes from 59.82.121.163: icmp_seq=5 ttl=79 time=443.412 ms
64 bytes from 59.82.121.163: icmp_seq=6 ttl=79 time=461.422 ms
64 bytes from 59.82.121.163: icmp_seq=7 ttl=79 time=432.035 ms
64 bytes from 59.82.121.163: icmp_seq=8 ttl=79 time=428.674 ms
64 bytes from 59.82.121.163: icmp_seq=9 ttl=79 time=431.996 ms
64 bytes from 59.82.121.163: icmp_seq=10 ttl=79 time=430.521 ms
64 bytes from 59.82.121.163: icmp_seq=11 ttl=79 time=434.289 ms
64 bytes from 59.82.121.163: icmp_seq=12 ttl=79 time=430.696 ms
64 bytes from 59.82.121.163: icmp_seq=13 ttl=79 time=428.899 ms
64 bytes from 59.82.121.163: icmp_seq=14 ttl=79 time=431.847 ms
64 bytes from 59.82.121.163: icmp_seq=15 ttl=79 time=429.329 ms
64 bytes from 59.82.121.163: icmp_seq=16 ttl=79 time=440.055 ms
64 bytes from 59.82.121.163: icmp_seq=17 ttl=79 time=464.146 ms
64 bytes from 59.82.121.163: icmp_seq=18 ttl=79 time=433.413 ms
^C
--- taobao.com ping statistics ---
19 packets transmitted, 19 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 428.674/446.721/523.929/26.781 ms
```
- Demo URLs: https://nstclassdemo2025.pages.dev/stop-and-wait (p15), https://nstclassdemo2025.pages.dev/sliding-window (p18), https://nstclassdemo2025.pages.dev/zero-window (p21), https://computerscience.unicam.it/marcantoni/reti/applet/GoBackProtocol/goback.html (p22), https://media.pearsoncmg.com/ph/esm/ecs_kurose_compnetwork_8/cw/content/interactiveanimations/selective-repeat-protocol/index.html (p25).
- p7: "Wireshark TCP echo server follow up" (title only; no code or capture on slide).

## In-class questions / quiz prompts shown on slides
- p11: "How long should she wait before she assumes the page was lost? Ten milliseconds? A full second?" → answered by introducing RTT (no numeric answer).
- p14: quoted receiver message "Hey, slow down — I can only handle this much right now." (not a quiz).
- No explicit MCQ/quiz slides.

## Unclear / unreadable
- p18, p21, p22: the embedded demo screenshots are unreadable at 60 dpi. They were read from the native embedded images (pdfimages extraction of the WB copy, 497×956 / 504×884 px) and are fully legible there; transcribed above. A few sub-labels (e.g., "Flow Control Active", "Timer Expiration") are partly covered by badges in the source but inferable.
- p11: the text mixes "Alice" and "CAROL" (the checksum slides use Alice/Bob); names as printed.
- p14: the figure (TCP connection states) does not illustrate flow control; it is source content, not an annotation.
- p17: "Intial Window" typo in the source.
- p8: "can be retransmit" (grammar as printed).

## Duplicate / overlap notes
- **WB-L10 ("Lectures/Whiteboards/L10 - 2026-09-09 - Transport Layer, Caching, Content Delivery Network (CDN), Route 53 DNS Service,.pdf") vs SL-L10: NO handwriting or annotation on any page. The WB file adds no content.** Method: identical text layers; per-page pixel diff of all 27 page images; pages 3, 9, 17, 19, 23, 24, 25 and 27 are pixel-identical; every differing page (1, 5, 6, 8, 10, 11, 12, 14, 15, 16, 18, 20, 21, 22) was inspected side by side, several at 200-220 dpi (p12, p15, p18, p20, p21, p22, p24). `pdfimages -list` shows the same image set (61 vs 61), with WB versions at equal or higher resolution and no Canva watermark; annotation-object counts are equal (34 vs 34) and there are no /Ink objects. The checksum arithmetic (p8-10), RTT/ping (p11-12), stop-and-wait trace and utilization formula (p15-16), sliding-window trace with window size 4 (p18), zero-window/rwnd traces with Win=0 / 4KB / 8KB (p20-21), GBN trace (p22) and SR NAK diagram (p24) are identical in both, with no added numbers or marks. No handwritten utilization numerical exists in either file. The WB filename (Caching, CDN, Route 53) does not match the content; it is this RDT/flow-control deck. Its higher-resolution images are the better source for redrawing.
- Cross-deck: p6 is identical to SL-L09 p21 (teardown). The p5 handshake image is the one used in SL-L09 p18-20. "Join the lecture online", "Please fill the feedback form" and "Thank You" are boilerplate.
- Within the deck: p15 and p16 both cover stop-and-wait; p19-21 all cover the zero window; p22-23 cover GBN; p24-25 cover SR.
- Not covered in this deck: "rwnd" is never named (only "window size", "advertising a window size of zero"); no GBN/SR window-size limits (e.g., ≤ 2^k − 1, ≤ 2^(k−1)); no sequence-number-space numericals; no bandwidth-delay product or utilization numbers; no timeout/RTT estimation formulas (EstimatedRTT, DevRTT).

## Topic list
- Layers recap (application, presentation, session, transport functions)
- Building reliability over an unreliable channel
- TCP overview: connection-oriented, seq numbers, ACKs, checksums, ordered reliable delivery
- TCP 3-way handshake (recap)
- TCP 4-way connection teardown (recap)
- Wireshark TCP echo server follow-up (demo header)
- Internet checksum: 8-bit word addition, end-around carry, 1's complement, receiver all-1s check (worked example contains an arithmetic error)
- Round Trip Time: definition, why it matters for retransmission timeout
- Measuring RTT with ping (near vs far server: ≈25 ms vs ≈447 ms)
- Need for flow control (buffer size / speed mismatch, buffer overflow)
- Stop-and-wait protocol: send N, wait, ACK N+1
- Stop-and-wait inefficiency and utilization formula U = T_frame / (T_frame + 2T_prop)
- Sliding window protocol: receiver-advertised window size, window slides on ACK
- Sliding window trace with window size 4 and cumulative ACKs
- Zero Window condition: receiver advertises window 0
- Zero window probing (1-byte probes, exponential backoff 1s/2s/4s/8s) and window reopening
- Go-Back-N: definition, in-order receiver, discard out-of-order, duplicate ACKs, timeout, retransmit from lost frame onward
- Selective Repeat: buffer out-of-order frames, NAK / no ACK for lost frame, retransmit only missing frame
- GBN vs SR comparison
