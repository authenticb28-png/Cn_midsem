# SL-L11 pages 1-23 — TCP Congestion Control Algorithms
## Page table
| Page | Section/slide title | Content summary (exact facts, numbers, definitions, lists — be specific, not vague) | Callout type | Diagram/figure on page | Handwriting present? |
|---|---|---|---|---|---|
| 1 | TCP Congestion Control Algorithms (title) | Title slide, Newton School of Technology logo. | none | Decorative network graphic (Canva watermark). | No |
| 2 | Join the lecture online on your dashboard | Filler. | none | none | No |
| 3 | TCP recap | "transport layer: communication between processes", "segments oriented"; "network layer: communication between hosts". | none | Two icon flows: Transport Layer = Segmentation -> Transport -> Reassembly; Network Layer = Packets creation -> Transport -> Packets assembly. | No |
| 4 | TCP recap | "Packet delivery time = Transmission time + Propagation delay"; "Pipelining: increased utilization". | KEY CONCEPT | Left: stop-and-wait timing diagram (sender/receiver vertical lines; "first packet bit transmitted, t = 0"; "first packet bit arrives"; "last packet bit arrives, send ACK"; RTT bracket in red; ACK returns, next packet sent). Right: pipelined diagram: 3 packets back to back; "last bit transmitted"; "last bit of 2nd packet arrives, send ACK"; "last bit of 3rd packet arrives, send ACK"; "ACK arrives, send next packet" (Kurose-style). | No |
| 5 | Sliding Window Protocol | TCP uses a "sliding window protocol" to manage flow control. Receiver tells sender how much data it can receive at a time (window size). As receiver processes/acks packets, sender "slides" window forward and sends more. | KEY CONCEPT | Two rows of boxes 1-10: "INITIAL WINDOW" bracket covers 1-8; second row "WINDOW SLIDES" bracket covers 2-9 with an arrow showing shift by one. | No |
| 6 | TCP flow control helps for a single client! What if the network is crowded? | Motivation question (slide number 6). Photos: girl splashed by sprinkler, dog drinking from sprinkler jet (too much water analogy). | ANALOGY | Two photos only. | No |
| 7 | Let's look at the cars analogy... | "Only Mater (client) wants to move slowly" (flow control = one slow receiver) vs "The Traffic Jam (Congestion) All senders have to slow down". | ANALOGY | Photo of open highway with cartoon cars (incl. Mater tow truck); photo of gridlocked traffic jam. | No |
| 8 | Congestion Window | cwnd = "Sender-side limit on the amount of data the sender can have in flight before receiving an acknowledgment (ACK) from the client." "For new connections it is 10 by default in most operating systems." | KEY CONCEPT | Sender segment sequence-number bar: green = "last byte ACKed" region; yellow = "sent, but not-yet ACKed ("in-flight")"; blue = "available but not used"; grey = not usable; bracket "cwnd" spans yellow+blue; marker "last byte sent" between yellow and blue. | No |
| 9 | Two special cases of TCP timeouts | Labels only: "lost ACK scenario", "premature timeout". | none | Left (lost ACK): Sender->Receiver Packet 0; ack 0 lost (red X); timeout bracket on sender; Packet 0 resent; ack 0 returns. Right (premature timeout): Packet 0, Packet 1 sent; timeout bracket expires before ack; Packet 0 resent; ack 1, ack 2 arrive; receiver labeled "Cumulative ACK"; ack 2 sent again (for duplicate Packet 0); then Packet 2 sent. | No |
| 10 | TCP Congestion Control | "TCP is a polite driver." "Its mission: Get your data to its destination as fast as possible, but without causing a traffic jam for everyone else." | KEY CONCEPT | State flow: Phase-1 Slow Start -> Phase-2 Congestion Avoidance -> Phase-3 Congestion Detection. From Detection two branches: "3 Acknowledgement Received" -> arrow back to Congestion Avoidance; "Acknowledgement Timeout" -> arrow back to Slow Start. | No |
| 11 | Slow Start | Car analogy: 1 = "slow start, send just a single car on the road"; 2 = "Next time send two cars"; 4 = "Then send four cars". | ANALOGY | Three images labelled 1, 2, 4. | No |
| 12 | Slow Start | When connection is established it starts slowly in a phase called Slow Start; initially sends a small number of [segments] ("small number of send" — typo in source); if those packets are acknowledged, it doubles the number sent; doubling helps find optimal number of segments to send. | KEY CONCEPT | Host A / Host B timing diagram: RTT bracket; "one segment", then "two segments", then "four segments" sent each RTT, ACKs returning (Kurose figure). | No |
| 13 | When Does Slow Start End? | Slow Start continues until: (a) cwnd reaches slow start threshold (ssthresh); "ssthresh = cwnd/2" = "half of the value of the congestion window value when congestion was detected." Then switches to Congestion Avoidance: instead of doubling, adds one extra packet at a time (gentle linear increase). OR (b) "Packet loss occurs (timeout or 3 duplicate ACKs)". | KEY CONCEPT | Graph: y = Congestion window (in segments) 0-14, x = Transmission round 0-15. Points: round1=1, 2=2, 3=4, 4=8 (reaches dashed ssthresh line at 8), 5=9, 6=10, 7=11, 8=12 with red X (loss) at round 8. | No |
| 14 | Congestion Avoidance | "MSS (Maximum Segment Size) is the largest amount of data, in bytes, that a device can send in the payload of a single TCP segment". | KEY CONCEPT | Graph y-axis "MSS", x "Time": starts at "1 MSS", exponential curve labelled "Slow start phase" up to "Slow start Threshold" (dashed), then straight line "Congestion Avoidance phase" up to "Maximum Receiver Capacity" (dashed) and then flat. | No |
| 15 | AIMD (Additive Increase, Multiplicative Decrease) | Approach: senders increase sending rate until packet loss (congestion) occurs, then decrease on loss event. Additive Increase: every RTT with no packet loss, increase cwnd linearly by 1 MSS. Multiplicative Decrease: sending rate cut in half on loss detected by three duplicate ACKs; cut to 1 MSS when loss detected by timeout. | KEY CONCEPT | none | No |
| 16 | The TCP Sawtooth Pattern | "AIMD operates by having the sender increase its transmission rate (Additive Increase) to probe for bandwidth. Upon packet loss, indicating congestion, it halves the rate (Multiplicative Decrease), creating a sawtooth wave pattern." | KEY CONCEPT | Dark graph: y "Congestion Window (Throughput)" 0, 50%, 100%; x "Time (Round Trip Times)". Initial linear rise 0->100% (red dot "Packet Loss"), drop to 50%, linear "Additive increase" back to 100%, repeated 4 times (4 red loss dots), ending rising. | No |
| 17 | Fast Retransmit and Fast Recovery in TCP | Why needed: TCP detects loss via a timeout (slow and inefficient) or multiple duplicate ACKs (faster mechanism). To speed up recovery and avoid unnecessary delays TCP uses 1. Fast Retransmit 2. Fast Recovery. | KEY CONCEPT | Stopwatch clipart. | No |
| 18 | Fast Retransmit | If sender receives three duplicate ACKs (e.g., ACK 5, ACK 5, ACK 5), it assumes a packet was lost, likely the next in sequence, and immediately retransmits that missing packet. "Faster than waiting for a timer to expire!" | KEY CONCEPT | Sender/Receiver diagram: pkt 1 -> "(S)ACK 1"; pkt 2 lost (red X); pkt 3 -> "dupACK 1"; pkt 4 -> "dupACK 1"; red line "Timeout retransmission" (shown for contrast, arriving later); pkt 5 -> "dupACK 1"; blue "Fast retransmit 2" after 3rd dupACK. | No |
| 19 | Fast Recovery | "Fast Recovery is used immediately after Fast Retransmit. Instead of going back to Slow Start, TCP enters Congestion Avoidance directly, allowing smoother performance." | KEY CONCEPT | SENDER/RECEIVER diagram: Pkt7 lost (X), Pkt8 delivered, Pkt9 lost (X), Pkt10-14 sent; receiver returns ACK7 repeatedly. Sender annotations: "cwnd = 8" (green arrow at first ACK7), "1st dup ACK", "2nd dup ACK", "3rd dup ACK" (blue arrows), then "cwnd = 1", "ssthresh = 8/2 = 4"; "Re-Pkt7" retransmitted (cyan); more ACK7s; ACK9 returns; vertical bracket "timeout Pkt9"; after timeout "Re-Pkt9" sent; final "ACK15". | No |
| 20 | Step-by-Step example for fast recovery | Assume: ssthresh = 8 MSS, cwnd = 16 MSS, TCP is in Congestion Avoidance in RTT 3. Table Event / cwnd (in MSS) / Explanation: RTT 1 (no loss) 17 Additive increase (cwnd += 1); RTT 2 (no loss) 18 cwnd += 1; RTT 3 (tcp timeout) 9 Multiplicative decrease (cwnd / 2); RTT 4 (no loss) 10 Resume additive increase. | PRACTICE | Table only. | No |
| 21 | TCP CUBIC | "Is there a better way than AIMD to 'probe' for usable bandwidth?" "increase W as a function of the cube of the distance between current time and time when TCP window size will reach Wmax". Wmax = "sending rate at which congestion loss was detected". "TCP CUBIC default in Linux, most popular TCP for Web servers!" | KEY CONCEPT | Graph: y-levels Wmax and Wmax/2; red solid = classic TCP sawtooth (linear rise Wmax/2 -> Wmax, drop to Wmax/2); blue dashed = TCP CUBIC (concave fast rise flattening near Wmax, then drop) labelled "TCP CUBIC - higher throughput in this example". 5 cycles. | No |
| 22 | Please fill the feedback form. | Filler. | none | none | No |
| 23 | Thanks for watching! | Filler. | none | none | No |

## Worked examples & numericals
**Page 13 graph trace (slow start -> congestion avoidance):** ssthresh = 8 segments. cwnd per transmission round: R1=1, R2=2, R3=4, R4=8 (hits ssthresh), R5=9, R6=10, R7=11, R8=12 -> loss (red X). No post-loss values shown. (Note: the graph's line from R1 to R2 is drawn as shown in the Kurose-type figure; values read at grid points.)

**Page 19 diagram trace (labelled "Fast Recovery"):** cwnd = 8 at first ACK7; Pkt7 and Pkt9 lost; after 3rd dup ACK7: cwnd = 1, ssthresh = 8/2 = 4; Re-Pkt7 sent; ACK9 received; Pkt9 later times out ("timeout Pkt9") -> Re-Pkt9 -> ACK15.
- FLAG: this diagram shows cwnd -> 1 after 3 duplicate ACKs, i.e., TCP Tahoe behaviour, which contradicts the slide text on the same page ("Instead of going back to Slow Start, TCP enters Congestion Avoidance directly") and page 15 ("cut in half on loss detected by three duplicate ACKs"). Under Reno fast recovery, cwnd would become ssthresh = 4 (+3 inflation in RFC version), not 1.

**Page 20 "Step-by-Step example for fast recovery" (verbatim):**
Assume: ssthresh = 8 MSS, cwnd = 16 MSS, TCP is in Congestion Avoidance in RTT 3
| Event | cwnd (in MSS) | Explanation |
|---|---|---|
| RTT 1 (no loss) | 17 | Additive increase (cwnd += 1) |
| RTT 2 (no loss) | 18 | cwnd += 1 |
| RTT 3 (tcp timeout) | 9 | Multiplicative decrease (cwnd / 2) |
| RTT 4 (no loss) | 10 | Resume additive increase |
- FLAG 1: Event in RTT 3 is labelled "tcp timeout", but per the deck's own rule (p15) a timeout cuts cwnd to 1 MSS; halving to 9 (18/2) applies to a 3-duplicate-ACK loss (fast recovery / Reno). The example is titled "fast recovery", so the intended event is almost certainly "3 duplicate ACKs".
- FLAG 2: "TCP is in Congestion Avoidance in RTT 3" is inconsistent with starting at RTT 1 (should be "starting at RTT 1"/"before RTT 1"). Also with ssthresh = 8 and cwnd = 16, after the loss the new ssthresh would be 18/2 = 9 (not stated on slide).
- Arithmetic itself (16->17->18, 18/2 = 9, 9+1 = 10) is correct.

## Formulas stated
- Packet delivery time = Transmission time + Propagation delay (p4)
- ssthresh = cwnd/2 (half of cwnd when congestion was detected) (p13)
- Slow start: cwnd doubles each RTT (1, 2, 4, ...) (p11-12)
- Congestion avoidance / Additive increase: cwnd += 1 MSS per RTT with no loss (p13, p15, p20)
- Multiplicative decrease: cwnd = cwnd/2 on 3 duplicate ACKs; cwnd = 1 MSS on timeout (p15)
- Default initial cwnd = 10 (segments) for new connections in most OSes (p8)
- TCP CUBIC: W grows as a function of the cube of the distance between current time and time when window reaches Wmax (no explicit equation given) (p21)
- NOT stated anywhere in deck: min(cwnd, rwnd) / effective window formula; the names "Tahoe" and "Reno"; throughput formulas; 3-dupACK threshold value equations beyond "three duplicate ACKs".

## Diagrams that must be recreated
- p3: Transport layer (Segmentation -> Transport -> Reassembly; "between processes") vs Network layer (Packets creation -> Transport -> Packets assembly; "between hosts").
- p4: Stop-and-wait vs pipelining timing diagrams (sender/receiver lines, t=0, RTT bracket, first/last bit arrives, ACK per packet; 3 pipelined packets).
- p5: Sliding window: boxes 1-10, initial window 1-8, slid window 2-9.
- p8: cwnd sequence-number bar: ACKed (green) | in-flight sent-not-ACKed (yellow) | available but not used (blue) | unusable (grey); cwnd spans yellow+blue; "last byte ACKed", "last byte sent" markers.
- p9: Lost-ACK timeout scenario and premature timeout scenario (Packet 0/1/2, ack 0/1/2, cumulative ACK).
- p10: Three-phase state flow: Slow Start -> Congestion Avoidance -> Congestion Detection; "3 Acknowledgement Received" -> Congestion Avoidance; "Acknowledgement Timeout" -> Slow Start.
- p12: Host A/Host B slow start: 1, 2, 4 segments per RTT.
- p13: cwnd vs transmission round graph, values 1,2,4,8,9,10,11,12 (loss X at round 8), ssthresh dashed at 8; x axis 0-15, y 0-14.
- p14: Phase graph: 1 MSS -> exponential slow start up to "Slow start Threshold" -> linear congestion avoidance up to "Maximum Receiver Capacity" -> flat.
- p16: Sawtooth: 0 -> 100% linear, then drops to 50% and additive increase back to 100%, 4 loss points; axes Congestion Window (Throughput) vs Time (RTTs).
- p18: Fast retransmit ladder: 1, ACK1, 2 lost, 3/4/5 -> 3x dupACK 1, Fast retransmit 2 (blue), contrasting timeout retransmission (red).
- p19: Fast recovery ladder: Pkt7-Pkt14, Pkt7 & Pkt9 lost, cwnd=8, 1st/2nd/3rd dup ACK7, cwnd=1, ssthresh=8/2=4, Re-Pkt7, ACK9, timeout Pkt9, Re-Pkt9, ACK15.
- p21: Classic TCP (red linear sawtooth between Wmax/2 and Wmax) vs CUBIC (blue dashed concave curves) graph.

## Code / CLI / config shown
None.

## In-class questions / quiz prompts shown on slides
- p6: "TCP flow control helps for a single client! What if the network is crowded?" (answer implied: congestion control, p7-10).
- p17: "Why Are They Needed?" (answer on slide: timeout is slow; dup ACKs faster -> Fast Retransmit, Fast Recovery).
- p21: "Is there a better way than AIMD to 'probe' for usable bandwidth?" (answer: TCP CUBIC).

## Unclear / unreadable
- p19 diagram is small at 60 dpi; re-rendered at 200 dpi and fully read (see trace). No remaining unreadable content.
- p12 text "Initially, it sends a small number of send." — source typo (intended "segments").
- p10 / p19: "3 Acknowledgement Received" means 3 duplicate ACKs (wording imprecise in source).

## Duplicate / overlap notes
- p10 (TCP Congestion Control three-phase diagram + "polite driver" text) is repeated verbatim as the recap slide p3 of SL-L12.
- p3-5 recap TCP transport-layer / pipelining / sliding window, overlapping earlier transport-layer/TCP lectures.
- p9 timeout scenarios (lost ACK / premature timeout) likely repeat earlier TCP reliability lecture material.
- Internal contradiction: p19 diagram (cwnd=1 after 3 dupACKs, Tahoe) vs p19 text/p15 (halve, Reno); p20 table labels a halving as "tcp timeout" vs p15 rule (timeout -> 1 MSS).

## Topic list
- Transport layer vs network layer recap (process-to-process vs host-to-host; segments)
- Packet delivery time = transmission + propagation; RTT
- Pipelining increases utilization
- Sliding window protocol for flow control (receiver-advertised window)
- Flow control vs congestion (single slow receiver vs crowded network) — sprinkler and cars analogies
- Congestion window (cwnd) definition; in-flight bytes; default initial cwnd = 10
- TCP timeout special cases: lost ACK, premature timeout, cumulative ACK
- TCP congestion control phases: Slow Start, Congestion Avoidance, Congestion Detection; transitions on 3 dup ACKs vs timeout
- Slow start: exponential doubling per RTT (1, 2, 4...)
- Slow start threshold (ssthresh = cwnd/2); end of slow start; switch to linear increase
- MSS definition
- Congestion avoidance phase; maximum receiver capacity cap
- AIMD: additive increase 1 MSS/RTT; multiplicative decrease (halve on 3 dup ACKs, 1 MSS on timeout)
- TCP sawtooth pattern
- Loss detection: timeout vs duplicate ACKs
- Fast Retransmit (3 duplicate ACKs -> immediate retransmit)
- Fast Recovery (enter congestion avoidance instead of slow start)
- Worked cwnd trace example (16 -> 17 -> 18 -> 9 -> 10)
- TCP CUBIC: cubic window growth toward Wmax; default in Linux
