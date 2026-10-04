# Computer Networks — Lecture & Lab Notes

## Lectures

### L01 · Computer Networks (10 Aug 2026)
_Topics: Computer Networks_

#### Whiteboard

<!-- page 1 -->
1
 Introduction
CSAI321: Computer Networks
1

<!-- page 2 -->
Join the lecture online on your dashboard
2

<!-- page 3 -->
What is the Cloud?
Is the cloud just someone else’s computer?
3

<!-- page 4 -->
What is the Cloud?
More like a lot of computers…
4

<!-- page 5 -->
What is the Cloud?
A lot, lot!
5

<!-- page 6 -->
What is the Cloud?
An overhead view of the server infrastructure in Google’s data
center in Council Bluffs, Iowa. 
And all these servers need to
talk to each other!
6

<!-- page 7 -->
The cloud computing service providers - Amazon Web Services(AWS),
Azure, Google Cloud Platform(GCP) all have super fast computer network 
Getting all those 0s and 1s to you efficiently!
7

<!-- page 8 -->
In 1960s, the UCLA computer tried to
send “login,” to computer in Stanford
Research Institute. Only “lo” got
through before the system crashed.
But then networks
are not new
8

<!-- page 9 -->
Network cables did get messy at times!
9

<!-- page 10 -->
Do not touch sticky notes were
common in those days!
This is not AI
generated!
10

<!-- page 11 -->
11
Okay, so computer networks are not new...

<!-- page 12 -->
Traditionally, we have had...
12
WAN (Wide Area Network): Covers larger
geographic areas, like connecting different
branch offices of a company, or even the
internet itself.
MAN (Metropolitan Area Network): Usually
spans a city, often used by municipalities or
large organizations.
LAN (Local Area Network): Typically used in
homes or offices to connect computers and
devices within a limited area.
PAN (Personal Area Network): Very short range,
like connecting your smartphone to your
smartwatch or wireless headphones.

<!-- page 13 -->
How extensive is the internet in the world?
13
Despite being called "the cloud," the internet relies on massive
physical infrastructure spanning the globe.597 cable systems in
2025

<!-- page 14 -->
Why is it hard to keep them safe?
14
Any guesses?

<!-- page 15 -->
Fishing anchors…
15
The major cause of transatlantic network
traffic issues are fishing anchors mistakenly
damaging the cables

<!-- page 16 -->
Sharks trying to attack the cables!
16

<!-- page 17 -->
17
What happens when you tap Instagram icon?
You tap the Instagram icon on your phone and a
reel plays in under a second. List every 'thing'
your data touched between your thumb and the
video.
The Gap:
Most people stop at "WiFi → Instagram." The massive, intricate gap
between that simple answer and reality is exactly what we study in this
course.
What happens when?

<!-- page 18 -->
18
It’s 10 PM. Millions are settling in for a Netflix
movie. Suddenly, the app starts buffering or
fails. What’s happening behind the scenes?

<!-- page 19 -->
Objective of the course
19
We are going to demystify how networks work
Because networks are everywhere!

<!-- page 20 -->
Top-Down Approach.
20

<!-- page 21 -->
Why the Top-Down Approach?
21
Applications First
We start with what you know and use daily (Web, HTTP, DNS,
Streaming). Understanding the requirements of these
applications explains why we need the underlying network
services.
Drilling Down to Physical
Once the application logic is clear, we progress downward
through the Transport (TCP/UDP), Network (IP/Routing), Link,
and Physical layers. This approach constantly answers "why"
before "what".

<!-- page 22 -->
Of course, GPUs are connected using
very fast network cards!
22

<!-- page 23 -->
How data travels
23
What to Expect from the Networking
Course
Foundation 
How computing
devices talk to each
other
Hands-on Labs
Configure your own
network
Network Security

<!-- page 24 -->
Join us on the adventure to discover how
computer networks work
24

<!-- page 25 -->
25
Contests
20%
Projects
20%
Mid Semester
20%
End Semester
40%
Grading

<!-- page 26 -->
Reference Books
26

<!-- page 27 -->
Reference Books 
27
Computer Networking
James Kurose & Keith Ross 
Data Communications and Networking
 Behrouz A. Forouzan

<!-- page 28 -->
Please fill in the feedback form.
28

<!-- page 29 -->
Thank
You!
29

<!-- page 30 -->
30

<!-- page 31 -->
31

### L02 · Circuit Switching, Packet Switching, Loss and throughput, Delay (12 Aug 2026)
_Topics: Circuit Switching, Packet Switching, Loss and throughput, Delay_

#### Whiteboard

<!-- page 1 -->
Moving Data
Through the Core
CSAI321:Computer Networks
1

<!-- page 2 -->
The Physical "Cloud"
Global Infrastructure
The AI Network Era
Recap
The cloud consists of millions
of physical servers in large
data centers that power our
daily applications.
Connecting the world needs
significant scale, with over 597
submarine cables linking
continents to deliver data rapidly.
Modern AI requires immense
computing power, utilizing
ultra-fast networks to connect
over 10,000 GPUs for training
advanced models.

<!-- page 3 -->
3
Join the lecture online on your dashboard

<!-- page 4 -->
A Tale of Two Phone Calls
4
The Landline Call
Grandma pauses for 10 seconds to think? That
capacity sits idle — reserved, but wasted.
The WhatsApp Call
You pause for 10 seconds? No packets sent —
that capacity is free for someone else.

<!-- page 5 -->
The Road Not Taken: Circuit Switching.
5
The classic telephone model. Before any conversation could start, the network
reserved a dedicated end-to-end path  and held it, exclusively, for the full
duration of the call.
Guaranteed
Once the circuit is set up, the full
reserved capacity is yours predictable,
stable, no surprises mid-call.
Wasteful for Bursty Data
Go quiet for even a few seconds, and
that reserved capacity sits idle unusable
by anyone else, the whole time.

<!-- page 6 -->
A Tale of Two Phone Calls
6

<!-- page 7 -->
7
How the Network Core Moves Data

<!-- page 8 -->
What Exactly Is a “Packet”?
8
The Idea
Your message — a photo, a webpage, a
voice clip — is chopped into small,
independent chunks called packets.
Each packet carries a header (addressing
info) and a payload (your actual data).
Packets can take different routes to the
same destination.
The core forwards each packet
independently — hop by hop, router to
router.
Store-and-Forward Rule
A router must receive the entire packet before it
sends even the first bit onward.
PKT
Receive fully  →  check  →  forward fully
Why it matters: no single router needs to know
the whole path — it just needs to know the next
hop.

<!-- page 9 -->
Sharing on Demand: Statistical
Multiplexing.
9
No reservations. Links are used only when packets actually need them — and that single
idea unlocks two superpowers.
Efficiency
Real traffic is bursty — you're rarely sending
data every millisecond. Packet switching lets
many users share one link, because it's
statistically unlikely they all burst at once.
bursty users, one shared link
Resilience
Because packets aren't tied to one fixed path,
if a link or router fails, traffic can simply be
rerouted around the damage — nothing was
“reserved” there to lose.
rerouted around the failure

<!-- page 10 -->
Packet Switching
10
Packet switching gives no built-in guarantees. Packets can be delayed behind others in
a queue, or dropped entirely when a router's buffer fills up under load.
This Is the Seed of Everything TCP Does
In Weeks 5–6, we'll meet TCP — a protocol whose entire job is to paper over
exactly this gap: detecting loss, retransmitting, and pacing data so an
unreliable, best-effort core feels reliable to your applications.

<!-- page 11 -->
11
Sources Of Delay

<!-- page 12 -->
The Toll-Booth Caravan
12
Picture a caravan of cars arriving at a toll booth, then driving down a long highway to the next toll booth.
TOLL BOOTH
TOLL BOOTH
HIGHWAY
Each car must individually pass through the booth (one at a time, takes a fixed time each), then
everyone drives the highway together at the speed limit.

<!-- page 13 -->
Every Packet Pays Four Kinds of Delay
13
1
Processing
Router examines
the header,
checks for bit
errors.
tiny, ~microseconds
2
Queuing
Time waiting in a
buffer behind
other packets.
variable — named
only, not computed
3
Transmission
Time to push all
the packet's bits
onto the link.
= L / R — we
compute this
4
Propagation
Time for a bit to
physically travel
the link.
= d / s — we
compute this

<!-- page 14 -->
Toll Booth = Transmission.
Highway = Propagation.
Transmission Delay
“Toll-booth time”
Time spent pushing every car (every bit) through
the booth, one after another, before it can even
start down the highway.
Depends on:  how many cars (packet size) and
how fast the booth processes them (link rate).
MORE BOOTHS → FASTER
Propagation Delay
“highway drive time”
Time spent actually driving down the highway
between the two booths, at a fixed speed limit
— has nothing to do with how many cars there
are.
Depends on:  the distance between booths and
the speed limit (signal speed).
MORE LANES ≠ FASTER

<!-- page 15 -->
Deep Dive: Two Threads Worth Pulling
Why Big Tech Builds Its Own
Backbone
Google, Meta, and Netflix lay their own private
fibre between data centers and cities —
shortening the physical path their traffic must
travel.
Connects back to Lecture 1: shorter distance, in
d/s terms, means lower propagation delay — the
edge/core story and the delay story are the same
story.
Why Packet Size Isn't “Bigger Is
Better”
The relay demo hinted at this: across many hops,
packet size changes how much pipelining is
possible.
Huge packets: long waits at each hop before
forwarding can start.
Tiny packets: more headers, more per-packet
processing overhead.
15

<!-- page 16 -->
Let's Do the Maths — Lightly
16

<!-- page 17 -->
Transmission Delay: Pushing Bits
Onto the Link
L / R
packet length (bits)  ÷  link rate (bits/sec)
Worked Example
L = 8,000 bits   on a link with   R = 2 Mbps
8,000 ÷ 2,000,000  =  4 ms
Why Doubling the Link Rate Matters
2 Mbps
4 ms
4 Mbps
2 ms
8 Mbps
1 ms
17

<!-- page 18 -->
Propagation Delay: The Bit's Physical
Journey
d / s
distance (m)  ÷  signal speed (≈ 2×10⁸ m/s in fibre)
18

<!-- page 19 -->
The 500 Mbps Link That Still Feels Slow
19
Geostationary Satellite Link
It's advertised at a generous 500 Mbps. But
your video call still has that awkward half-
second lag where you and the other person
keep talking over each other.
The satellite orbits ~35,786 km above the
equator. Up to the satellite, then back down
— that's roughly 71,500 km the signal must
travel, at the speed of light.
EARTH
↑ 35,786 km ↑
↓ 35,786 km ↓
~240 ms round-trip — from physics alone

<!-- page 20 -->
20
When Packets Don't Make It

<!-- page 21 -->
Throughput: What You Actually Get
21
Throughput
The rate (bits/sec) at which data is actually
received — not advertised, not theoretical.
What lands.
Bottleneck Link
End-to-end throughput ≈ the minimum link rate
anywhere on the path. The slowest hop sets the
pace for everyone.
A Path With Three Links
10 Mbps
2 Mbps
5 Mbps
↑ bottleneck — caps end-to-end throughput at 2 Mbps, no
matter the other links

<!-- page 22 -->
“I Pay for 300 Mbps. Why Is It Buffering?”
22
🎯  Scenario: Your ISP plan says 300 Mbps. Your 4K stream is stuttering anyway. Where is the real
bottleneck hiding? Below is the full path your data travels — each hop has a different capacity.
Identify which one is choking your stream.
Netflix Server
Congested Link
Your ISP
Home WiFi
Your TV
The 300 Mbps is your access link to the ISP — just one stop on a long path. The real bottleneck
could be a congested inter-network link, an overloaded Netflix server, or (very often) your own
home WiFi struggling with walls and interference. Next time your stream buffers, think: which hop
is the slowest?

<!-- page 23 -->
The Core Moves Packets. But Who
Agrees on the Format?
Thousands of different networks and apps need to agree on a format and order of operations — that's
the job of protocol layers.
Lecture 3: OSI and TCP/IP Models
The backbone model for the rest of the course — every later topic (addressing, routing,
transport, applications) will be framed in terms of these layers.
NEXT LECTURE

<!-- page 24 -->
Thanks
for
watching!
24

<!-- page 25 -->
25
Please fill the feedback form.

### L03 · OSI Model (17 Aug 2026)
_Topics: OSI Model_

#### Whiteboard

<!-- page 1 -->
OSI and TCP/IP
Models
Computer Networks
1

<!-- page 2 -->
2
Join the lecture online on your dashboard

<!-- page 3 -->
3
RECAP
Packet > Circuit Switching
Data is split into chunks, sharing links
dynamically. Far more efficient for bursty traffic
than reserving idle, dedicated paths.
Store-and-Forward Rule
Routers must fully receive, verify, and buffer an
entire packet before pushing the first bit to the
next hop in the journey.
The Anatomy of Delay
Every packet ensures Processing, Queuing,
Transmission (pushing bits), and Propagation
(physical travel) times.
Throughput & Bottlenecks
Your end-to-end speed isn't your ISP plan, it's
strictly capped by the single slowest bottleneck
link in your entire network path.

<!-- page 4 -->
4
Objective of Today’s Class
How data travels across the network

<!-- page 5 -->
5
Sending a Letter
You write it, put it in an envelope,
and hand it to the postal service.
Does the mail carrier care about
the letter's contents?
No
No
No
What if they do?

<!-- page 6 -->
6
Concept of Layering

<!-- page 7 -->
Let’s Send a letter:
7

<!-- page 8 -->
8
Encapsulation

<!-- page 9 -->
Ever seen this toy?
9
Encapsulation acts like a nesting
doll. As data moves down the
sender's stack, each layer wraps
the data above with its own
header.
On the receiver's side,
decapsulation reverses the
process: each layer strips its
specific header and hands the
payload up.

<!-- page 10 -->
Can you see Encapsulation?
10

<!-- page 11 -->
11
Theoretical Concept of Layering in 
Computer Networks

<!-- page 12 -->
The OSI Model
The OSI (Open Systems Interconnection)
model divides network communication
into layers to simplify the process.
Developed 
by 
the 
ISO 
(International
Organization for Standardization).
Think of the OSI model as wrapping a gift -
you add layers of wrapping (gift paper,
box, ribbon) going out, and unwrap them
in reverse order when received.
12

<!-- page 13 -->
Why Learn the OSI Model?
Every app you use: WhatsApp, games, Netflix, runs on
it. Learn it once, and the internet stops being magic.
One map for a messy problem: it splits "send data
across the world" into 7 clean layers.
The industry's shared language: "that's a Layer 4 issue",
know what it means, sound like a pro in interviews..
Foundation for everything: cybersecurity, cloud, AI
infra, backend: all built on these 7 layers.
13

<!-- page 14 -->
Importance
Provides a standard for network communication.
Ensures interoperability between different systems and devices.
14

<!-- page 15 -->
Layer 7- Application Layer 
Data
15

<!-- page 16 -->
Restaurant
Request
Customer
Waiter
Response
Layer 7- Application Layer 
Chef
Waiter
16

<!-- page 17 -->
Application
Layer
www
...
Layer 7- Application Layer 
The Application Layer delivers network
services directly to end-users and
facilitates applications such as web
browsers, email, and file transfers.
Think of the Application Layer as a
waiter in a restaurant: it takes your
order (user request), relays it to the
kitchen (network), and returns with
your food (data). Its role is to connect
the user to the service efficiently.
Request
Response
Website
17

<!-- page 18 -->
Layer 6- Presentation Layer 
Translation
Encryption
18
Beautification
(you want it be presented likewise )
(your system want it be likewise )

<!-- page 19 -->
ASCII text to
unicode
zip and unzip
Encryption and
decryption
Encoding images
based on type:
PNG
JPEG
GIF
Layer 6- Presentation Layer 
The 
Presentation 
Layer 
formats,
encrypts, and compresses data to
ensure it is readable and secure for
the receiving application.
The Presentation Layer is like a
translator who converts, formats, and
secures messages so that both sender
and receiver can understand each
other, even if they "speak different
languages."
19

<!-- page 20 -->
Layer 5- Session Layer 
Like a Courtroom:
Judge saying: Order! Order! 
and continuity of sessions
Dialog Control
Synchronization
20

<!-- page 21 -->
Session Layer
Layer 5- Session Layer 
The 
Session 
Layer 
establishes,
manages, 
and 
terminates
communication sessions between two
devices in a network.
The Session Layer is like a moderator
in a panel it starts the call, keeps the
connection going smoothly, and ends
it when you're done. It manages the
conversation between two systems.
21

<!-- page 22 -->
Encapsulated with detailed
src and destination address
Receiver
Message
Reassembled Message
Layer 4- Transport Layer 
22

<!-- page 23 -->
Layer 4- Transport Layer 
The 
Transport 
Layer 
ensures
reliable and efficient delivery of
data between two devices over a
network.
Imagine 
multiple 
conversations
happening over the same phone
line multiplexing ensures each
message 
reaches 
the 
right
recipient.
23

<!-- page 24 -->
Layer 3- Network Layer 
Navigation
24
Send Packets from Point A->B

<!-- page 25 -->
Layer 3- Network Layer 
The Network Layer is responsible for
logical addressing and forwarding of
data packets across different networks.
The Network Layer is like a GPS system
that finds the best route for delivery
trucks (data packets) to reach the
destination.
It handles addressing and routing,
just like choosing best roads to reach
the 
right 
destination 
fastest 
and
secure.
25

<!-- page 26 -->
Layer 2- Data Link Layer 
26
Media access Control
One at a time!
Error Check

<!-- page 27 -->
Layer 2- Data Link Layer 
The Data Link Layer ensures reliable
data transfer between two directly
connected nodes(edge) and handles
error detection and MAC addressing.
It ensures data is sent safely and
correctly 
between 
two 
directly
connected devices.
27

<!-- page 28 -->
0 
1
1
0 
Layer 1- Physical Layer 
Co-axial Cable
28
Fiber Optic Cable
Radio Waves

<!-- page 29 -->
Layer 1- Physical Layer 
Physical Layer transmits raw bits
over a physical medium such as
cables, radio waves, or fiber optics.
Physical Layer is like the roads, wires,
or signals the postman uses to move
around.
29

<!-- page 30 -->
30
The Practical Foundational Framework 
TCP/IP Model

<!-- page 31 -->
Introduction to TCP/IP Model
The TCP/IP model is a layered
framework that defines how data
is transmitted over the internet
using standard protocols like TCP
and IP.
31

<!-- page 32 -->
Comparison b/w OSI & TCP/IP
S No.
OSI Model
TCP/IP Model
1
Open System Interconnection
Transmission Control Protocol/ Internet
Protocol
2
7 different layers
4 different layers
3
Developed by ISO (International Standard
Organisation)
Developed by DARPA (Defense Advanced
Research Projects Agency)
4
Conceptual Model
Used in actual data transmission
between different computers.
32

<!-- page 33 -->
Thanks
for
watching!
33

<!-- page 34 -->
34
Please fill the feedback form.

### L04 · TCP/IP Model, Network Devices (19 Aug 2026)
_Topics: Network Devices, TCP/IP Model_

#### Whiteboard

<!-- page 1 -->
Computer Networks
Networking Devices,
Topologies and the Cloud
Network

<!-- page 2 -->
Join the lecture online on your dashboard

<!-- page 3 -->
Recap
3

<!-- page 4 -->
The why of network devices

<!-- page 5 -->
Connecting computers
3 devices: 3(3-1)/2 = 3 cables
10 devices: 10(10-1)/2 = 45 cables
100 devices: ......

<!-- page 6 -->
Instead of connecting everyone to everyone
what if everyone connects to ONE device

<!-- page 7 -->
Networking Devices
Core Components of a Computer Network
Connect computers and other devices in a network.
Hub
Switch
Wireless
Router
Access Point

<!-- page 8 -->
Hubs in 1980s
Function: 
Broadcasts 
data 
to 
all
connected devices
Doesn’t recognize hardware addresses
(Mac Addresses)
Operates at the Physical Layer (Layer 1)
Inefficiency: There is issue with hubs,
where data is broadcasted to all devices
even when only one device needs it, leading
to inefficiency.

<!-- page 9 -->
What's the main real-world problem with
using a hub in a network with many devices?
Unnecessary Traffic

<!-- page 10 -->
Switches since 1990s
Operates at the Data Link Layer
(Layer 2).
Connects devices within a LAN
and forwards data to the correct
device using MAC addresses.
Has no understanding of layer 3.
Ports can be configured for
connection routing.
Broadcasting could be controlled
using the Mac routing
intelligence.

<!-- page 11 -->
What if we want to communicate with a
computer in another network

<!-- page 12 -->
Router
Routes data between different
networks
Operates at the Network Layer
(Layer 3)
Router

<!-- page 13 -->
A router knows where to send packets, but
should every packet be allowed to enter

<!-- page 14 -->
Firewall
A firewall is a network security
device.
It monitors data coming in and
going out of the network.
Its main job is to protect the
network from unauthorized
access or threats.

<!-- page 15 -->
Firewalls allow only authorized data
Authorized

<!-- page 16 -->
What is Packet Filtering?
Packet from external
network to internal
network
TCP/UDP
Router
Firewall
External
Network
Internal
Network
Packet
Structure
IP
Data
Check
source/destination IP
address
Check
source/destination
port number

<!-- page 17 -->
Types of Firewall

<!-- page 18 -->
Load Balancers
Server 1
Server 2
Server 3
Clients
Load
Balancer
Req 1
Req 4
Req 2
Req 5
Req 3
Req 6

<!-- page 19 -->
Load Balancers 
A load balancer distributes incoming
network traffic across multiple
servers to prevent any single server
from being overwhelmed. 
Major companies like Netflix,
Google, Amazon, and Facebook use
load balancers to maintain fast and
smooth operations, even with high
user volumes.

<!-- page 20 -->
Devices Are Ready… But How Should We Connect Them

<!-- page 21 -->
Network Topologies
Network topology  describes the arrangement of devices and their
connections within a network,including how data flows.
   Types of Network Topology
Ring
Topology
Bus
Topology

<!-- page 22 -->
Star topology
All devices are connected to a
central hub or switch.
Data flows from sender device to
the hub/switch,which then sends it
to the intended receiver.
Centralized 
structure 
simplifies
network 
diagnostics 
and
maintenance
Popular 
choice 
for 
Local 
Area
Networks (LANs) due to manageable
design

<!-- page 23 -->
Mesh topology
In mesh topology, every network
device is directly connected to all
other devices.
This creates many paths for sending
data between devices.
It increased reliability because if one
path fails, data can take another
route.
 
Jokingly called spaghetti networks!

<!-- page 24 -->
Wireless mesh networks help with WiFi coverage

<!-- page 25 -->
Hybrid topology
Hybrid topology is a combination of
two 
or 
more 
different 
types 
of
topologies to     form a more complex
and flexible network.
Star
Topology
Ring
Topology
Bus
Topology

<!-- page 26 -->
Environment
Suitable
Topology
Reason
Example
connected devices
Small Office
Star
Easy setup, centralized control Laptops, Printers,
Routers
Smart Home
Mesh
Reliable, direct device
communication
Smart bulbs,
cameras
Data Center
Hybrid
Combines benefits of multiple
topologies
Servers, Storage
Units

<!-- page 27 -->
Fault Tolerance and Scalability of
Topologies

<!-- page 28 -->
Topology
Fault Tolerance
Scalability
STAR
Medium
Good
MESH
High
Excellent 
HYBRID
High
Hard

<!-- page 29 -->
Hardware Meets Software
The Evolutionary Shift
Traditional networking relies on physical boxes,
specialized cables, and manual configuration. In
the modern cloud era, the logic remains the
same, but the execution is purely software-
defined.
Physical Box → Virtual Instance
Copper Cables → Virtualized Overlays
Manual Wiring → API / Console Clicks

<!-- page 30 -->
The cloud network

<!-- page 31 -->
AWS Foundation
Regions: Isolated geographic areas
(e.g., Mumbai) containing multiple
data center clusters.
Edge Locations: CDN endpoints
that cache content physically closer
to the user to reduce latency.
30+ Global Regions
Ultra-low latency backbone
Global Cloud

<!-- page 32 -->
Redundancy: Availability Zones
Isolated Fault Domains
An AZ consists of one or more
discrete data centers with redundant
power, networking, and connectivity.
Deploying across two or more AZs
ensures your application survives a
fire, flood, or power grid failure at one
site.
The Multi-AZ Project
This semester, you will design
architectures that split workloads
across AZ-A and AZ-B.
Metric: 99.9% availability is a target
for high-availability systems.

<!-- page 33 -->
The Virtual Private Cloud (VPC)
Logical Isolation
A VPC is your private, software-defined
network in the AWS cloud. You control IP
address ranges, subnets, and routing.
CIDR Addressing Example:
Subnets map to specific AZs, partitioning
your L3 network for scale and security.

<!-- page 34 -->
Please fill the feedback form.

<!-- page 35 -->
Thanks
for
watching!

### L05 · Network Topologies, Cloud Networking, Application Layer (24 Aug 2026)
_Topics: Network Topologies, Application Layer, Cloud Networking_

#### Whiteboard

<!-- page 1 -->
CSAI321:Computer Networks
Application Layer:
Architecture,
Protocols and
APIs.

<!-- page 2 -->
2
Join the lecture online on your dashboard

<!-- page 3 -->
Lecture Roadmap
3
Network Architectures
Application Layer
HTTP - The Web's Language
HTTP Methods Overview
The Evolution of HTTP
Head-of-Line (HoL) Blocking
HTTP2.0 and HTTP3.0
REST Principles

<!-- page 4 -->
4
Network architecture

<!-- page 5 -->
Network architecture
5
Client/Server: Centralized architecture where powerful servers store data
and process requests for multiple dependent clients.

<!-- page 6 -->
Network architecture
6
Peer-to-Peer (P2P): Decentralized model where all devices ("peers") act as
both clients and servers with equal privileges

<!-- page 7 -->
7
How do these systems actually talk to each other over the network?

<!-- page 8 -->
Recap
8

<!-- page 9 -->
9
The Application Layer

<!-- page 10 -->
10
The Application Layer
The Application Layer (Layer 7) is direct interface between software programs (web
browsers and email clients) and the underlying network, interpreting user
commands and enabling data exchange across systems.

<!-- page 11 -->
11
The Application Layer Protocols

<!-- page 12 -->
12
HTTP: The Web’s Language

<!-- page 13 -->
13
HTTP - The Web's Language
HTTP is a stateless request–response protocol.
Client (browser) sends a REQUEST to a
server.
Server processes and sends back a
RESPONSE.
Each exchange is independent the server
remembers nothing between requests.

<!-- page 14 -->
Breakdown of HTTP Requests 
These messages are structured in a
way 
that 
includes 
a
request/response 
line, 
headers,
and optionally, a body.
HTTP Request
Request Line
Headers
Body
14

<!-- page 15 -->
15
HTTP Requests Breakdown:
 GET /index.html HTTP/1.1
Host: example.com
User-Agent: Chrome
Accept-Language: en-us
...
optional, e.g. form data, json for
POST, PUT reqs
Request message
Request
Line
Headers
Empty Line
Body

<!-- page 16 -->
HTTP Requests Breakdown:
Request Line:
The request line contains three parts:
Method: The type of operation the client wants the server to perform (e.g.,
GET, POST, PUT, DELETE).
URL: The resource or endpoint on the server that the client is requesting
(e.g., /index.html, /api/data).
HTTP Version: The version of HTTP being used (e.g., HTTP/1.1 or HTTP/2).
Example:
GET /index.html HTTP/1.1
16

<!-- page 17 -->
HTTP Requests Breakdown:
Headers:
Headers provide additional information about the request or about the client’s
capabilities
Common headers include:
User-Agent: Information about the client software (browser, app, etc.)
Host: The domain name of the server
Content-Type: The type of data the client is sending (for POST or PUT
requests)
Accept: The types of data the client can process (e.g., text/html,
application/json)
17

<!-- page 18 -->
HTTP Requests Breakdown:
Body (optional):
The body contains the actual data being sent by the client (such as form
data, JSON payload, etc.).
This is only included for certain methods like POST, PUT, or PATCH.
Example (for POST request):
{ "username": "user1", "password": "password123" }
18

<!-- page 19 -->
Breakdown of HTTP Responses 
These messages are structured in a
way 
that 
includes 
a
request/response 
line, 
headers,
and optionally, a body.
HTTP Response
Status Line
Headers
Body
19

<!-- page 20 -->
20
HTTP Responses Breakdown:
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 88
Server: Apache/2.4.2
...
<html><body><h1>Welcome to
Example.com</h1></body></html>
Response message
Status Line
Headers
Empty Line
Body

<!-- page 21 -->
HTTP Status codes:
21
1.200 OK – The request was successful, and the
server returned the requested resource.
2.301 Moved Permanently – The resource has
been permanently moved to a new URL.
3.302 Found – Temporary redirection to
another URL.
4.403 Forbidden – The server understood the
request but refuses to authorize it.
5.404 Not Found – The server can’t find the
requested resource.
6.500 Internal Server Error

<!-- page 22 -->
HTTP Responses Breakdown:
Status Line:
The status line consists of:
HTTP Version: The HTTP version used in the response.
Status Code: A 3-digit code indicating the result of the request (e.g.,
200, 404, 500).
Status Message: A short description of the status code (e.g., OK, Not
Found, Internal Server Error).
Example:
HTTP/1.1 200 OK
22

<!-- page 23 -->
Headers:
Response headers contain metadata about the response, similar
to request headers.
Common headers include:
Content-Type: The type of data being sent in the body (e.g.,
text/html, application/json).
Content-Length: The length of the body in bytes.
Server: Information about the server software.
Date: The date and time the response was sent.
23
HTTP Response Message Breakdown:
Same goes with the BODY for the response. It is similar to request BODY

<!-- page 24 -->
24
If HTTP is stateless, how does your shopping
cart stay full?
Cookies & Session tokens!

<!-- page 25 -->
25
HTTP Generations
The transition from HTTP/1.0 to HTTP/3

<!-- page 26 -->
The Online Shopping
Delivery Problem
Imagine you order a male outfit
online: A Shirt, Pants, Shoes, and
Socks (these are your HTML, CSS,
JS, and Images which we request
from server).

<!-- page 27 -->
27
How you perfer to have its delivery?
Our perfrence is answer to the why of HTTP versions.

<!-- page 28 -->
HTTP 1.0 is the truck can only carry one item per
trip, and must return to HQ before delivering
the next item. A massive waste of time.
Carries one request at a time.
Every file (HTML, image, CSS) = new
connection.
❌ No persistent TCP connection.
❗ Slow, repetitive, and inefficient.
Quote:
“I deliver one file at a time. It can get tiring!
Meet – HTTP/1.0 (1996)

<!-- page 29 -->
The One-Truck Convoy (Keep-Alive): Truck
arrives at your house with all 4 items but
Unloads/Deliver it One by One.
Introduced:
Keep-Alive connections
Caching and Host Headers
Improved performance but had head-of-line
blocking.
Meet – HTTP/1.1 (1997)
https://captive.apple.com

<!-- page 30 -->
Meet – HTTP/1.1 (1997)
ONE CONNECTION · responses must exit in order (FIFO) →
CSS
JS
icon
← all blocked, even though they’re ready
slow image ⌛

<!-- page 31 -->
Responses must arrive in the same order as
requests (FIFO - First In, First Out)
Only safe methods can be pipelined (GET,
HEAD, OPTIONS)
No POST/PUT - these might have side effects
as they alter the state of destination.
Quote:
 “Multiple requests can be made without waiting
for response for previous request”
HTTP/1.1 Pipelining (optional)

<!-- page 32 -->
Instead of serving your meal one by one. I will
Prefer to serve you entire tray and now you  
choose what to eat. 
HTTP/2 is the second major version of
HTTP, aimed at enhancing data transfer
performance between clients and servers.
It improves upon HTTP/1.1 by addressing
its limitations, particularly in terms of
performance.
Meet – HTTP/2 (2015)
https://en.wikipedia.org/wiki/HTTP_pipelining

<!-- page 33 -->
HTTP/2
https://manningbooks.medium.com/http-1-1-vs-http-2-vs-http-2-with-push-91f7d497ddbe
Binary Protocol | Multiplexing | Server Push

<!-- page 34 -->
HTTP/2 Solutions
HTTP/2 Features:
Uses single TCP connection.
Binary Protocol: Uses a binary format for message
encoding, unlike the text-based HTTP. That is the
framing layer.
Multiplexing: Enables simultaneous requests and
responses over one connection.
Server Push: Allows servers to send resources to
clients proactively without explicit requests.

<!-- page 35 -->
You order 3 item at restro and their entire staff started serving only you and
everything you ordered is having their seperate kitchen window and dedicated
staffs.
What if a service like this?

<!-- page 36 -->
HTTP/3 using QUIC (June 2022)
HTTP/3 Features:
Latest version of the HTTP protocol
Built on QUIC, a UDP-based transport
protocol instead of TCP developed by
Google
Multiplexed streams without blocking
Designed to solve head-of-line blocking
cloudflare.com

<!-- page 37 -->
HTTP/3 using QUIC (June 2022)
cloudflare.com

<!-- page 38 -->
HTTP/3 using QUIC (June 2022)

<!-- page 39 -->
Transition
HTTP/1.1
 
HTTP/2
 
HTTP/3
 
6separateTCP connections
to fake parallelism
Manystreams multiplexed
on one TCP connection
QUICover UDP — truly
independent
streams
Costly: 6× setup, 6× overhead
App-level HoL fixed — TCP-
level remains
1 lost TCP
segment 
 all
streams
stall
Loss is isolated to its
own stream
→
only this
one waits

<!-- page 40 -->
40
We understand the Client-Server model,
where a browser requests a page from a
server, But what happens when Application
need to communicate with another
Applications?

<!-- page 41 -->
A Q4 2024 analysis estimating 83% of all public APIs use REST architecture
REST APIs

<!-- page 42 -->
Why use OpenAPI?
https://petstore3.swagger.io

<!-- page 43 -->
43
Please fill the feedback form.

<!-- page 44 -->
Thanks
for
watching!

### L06 · Client-Server Architecture, HTTP Protocols, HTTP Version (26 Aug 2026)
_Topics: Client-Server Architecture, HTTP Protocols, HTTP Version_

#### Whiteboard

<!-- page 1 -->
CSAI321:Computer Networks
HTTPS and The
TLS Handshake:
Securing the Web

<!-- page 2 -->
2
Join the lecture online on your dashboard

<!-- page 3 -->
Lecture Roadmap
3
Understanding HTTP over TLS: HTTPS
Cryptography and its goals
Encryption and its types
TLS handshake Flow
CA’s, Chain of trust
Discover HTTPS in AWS

<!-- page 4 -->
Recap
4
Plain text Data
Data With TLS(Transport Layer security)

<!-- page 5 -->
HTTP lacks built-in security, making
it vulnerable unless using HTTPS.
Anyone that can capture the traffic
can figure out the content of the
communication between the client
and the server.
insecure
HTTP
HTTP plain text by design

<!-- page 6 -->
HTTPS = HTTP + TLS
HTTPS is a secure version of HTTP for safe
communication over networks.
It 
used 
SSL( 
Secure 
Socket 
Layer)
historically 
These using TLS(Transport Layer Security)
protocols to encrypt data between client
and server, enhancing security compared
to HTTP.
SSL/ TLS

<!-- page 7 -->
The Padlock Question
7
What does 🔒 mean in browser?
Safe website?
Encrypted connection?
Verified identity?
❌
✅
✅

<!-- page 8 -->
8
What does TLS actually provide?
Security using Cryptography

<!-- page 9 -->
Cryptography
9
The 
Practice 
of 
securing
information 
by 
converting
readable text into unreadable
code (ciphertext) and back
again.

<!-- page 10 -->
Core Goals of Cryptography
10
Confidentiality (Privacy): Ensures that
information 
is 
accessible 
only 
to
authorized parties. “No eavesdropping”
Integrity: Guarantees that data remains
accurate and hasn't been altered during
transit or storage. “No tampering”
Authentication: Verifies the identities of
both 
the 
sender 
and 
the 
receiver.  
“Verified identity”

<!-- page 11 -->
11
How do we achieve these goals?

<!-- page 12 -->
Encryption and Decryption

<!-- page 13 -->
Symmetric Encryption

<!-- page 14 -->
14
Analyze: whats the Issue in using symmetic
encryption?
 how to share the key Securely?

<!-- page 15 -->
Asymmetric Encryption

<!-- page 16 -->
How Do I Trust this Server? 
micrоsоft.com
vs
microsoft.com
Certificate

<!-- page 17 -->
What is a Certificate?

<!-- page 18 -->
How HTTPS Works
Digital Certificate
SSL/ TLS
Private Key
Public Key
Client
Server

<!-- page 19 -->
How HTTPS Works
https://medium.com/@rocky.bhatia86/in-the-expansive-universe-of-the-internet-where-the-exchange-of-information-is-ceaseless-the-1ffcdad011d1

<!-- page 20 -->
20
TLS Handshake Overview
Step 1: ClientHello
Client 
offers 
TLS 
versions,
cipher suites, random nonce.
“I can speak TLS 1.3 or TLS 1.2.
I will use XYZ algorithm for PQR purposes.
This is Number once a 32-byte string.”

<!-- page 21 -->
21
TLS Handshake Overview
Step 2: ServerHello + Certificate
Server hello is picked cipher
and its certificate (public key +
CA signatures).
“Out of your options XYZ for PQR
purposes, 
we 
will 
use 
this
following bundle of algorithms to
encrypt our session and this is my
identity 
issued 
by 
following
authority.”

<!-- page 22 -->
22
Authentication:
Step 3: ServerHello + Certificate
Client validates the certificate
chain. This will stop Man in the
middle attack.
“Send 
reuest 
for 
certificate
validation to CA” if its valid client
can trust if not client shows
website is not secure.”

<!-- page 23 -->
23
Key Exchange:
Step 4: Key Exchange
Client and Server derive a shared
session key

<!-- page 24 -->
24
Data Sharing on Secure Channel
Step 4: Communication Start with
Encrypted application data  being
shared.

<!-- page 25 -->
25
Please fill the feedback form.

### L07 · REST API(s), Presentation Layer, HTTPS, TLS/SSL (31 Aug 2026)
_Topics: HTTPS, REST API(s), TLS/SSL, Presentation Layer_

#### Whiteboard

<!-- page 1 -->
Email Protocols (SMTP,
POP3, IMAP) CDNs and
Caching
CSAI321:Computer Networks

<!-- page 2 -->
Join the lecture online on your dashboard

<!-- page 3 -->
Recap
3

<!-- page 4 -->
Application Layer Protocols
4

<!-- page 5 -->
5
Email Server Protocol

<!-- page 6 -->
How SMTP Works:
The email client (e.g., Gmail app,
Outlook) connects to the SMTP
server.
SMTP pushes the message from the
sender to the receiver’s mail server.
The receiver then uses POP3 or
IMAP to retrieve the email.

<!-- page 7 -->
SMTP (Simple Mail Transfer Protocol)
Sends email from sender server
to recipient servers
Push-based protocol
Uses TCP, Ports: 25 / 587 / 465
  SMTP in the Real World:
Sendgrid, 
Mailchimp, 
Mailgun
integrations us SMTP Relays

<!-- page 8 -->
8
Mailhog

<!-- page 9 -->
9
Email Clients Protocol

<!-- page 10 -->
Manages email directly on the server
Suitable for multi-device access
Supports folders, partial downloads
Uses Port 143, Secure (IMAPS): 993
Connection Type: Two-way sync (client ↔ server)
IMAP (Internet Message Access Protocol)
Sender
User
Agent
SMTP Mail
Server
IMAP Mail
Server
POP Mail
Server
IMAP User
Agent
POP User
Agent
Messages
managed remotely
Messages
Downloaded

<!-- page 11 -->
How IMAP Works:
Your email client connects to the
server using IMAP.
You view and manage emails without
downloading them completely.
Changes 
(read/unread, 
folders,
deletions) are reflected on the server
and synced across all devices.
You can access email folders (Inbox,
Sent, Drafts, etc.) as organized on the
server.

<!-- page 12 -->
POP3 (Post Office Protocol v3)
Downloads email to local client
and deletes from server
Best for offline access, but poor
sync across devices
Uses Port 110, Secure (POP3S):
995
Connection 
Type: 
One-way
(server → client)

<!-- page 13 -->
How POP3 Works:
Your email client connects to the
mail server using POP3.
It downloads the emails from the
server.
It deletes the emails from the
server after downloading.
Emails are now available on your
local device only.

<!-- page 14 -->
How POP3 Works:
Your email client connects to the
mail server using POP3.
It downloads the emails from the
server.
It deletes the emails from the
server after downloading.
Emails are now available on your
local device only.

<!-- page 15 -->
15
Application layer Quick and efficient
Content delivering Methods

<!-- page 16 -->
Imagine:
Same content
requested repeatedly.
Solution?

<!-- page 17 -->
Caching
The 
process 
of 
storing
copies 
of 
data 
in 
a
temporary, 
high-speed
storage layer so that future
requests for that same data
can be served much faster
than fetching it from the
original, slower source.
Cache Hit
Cache Miss

<!-- page 18 -->
Caching Behavior
Caching behavior refers to how
data 
is 
stored 
temporarily
(cached) 
and 
retrieved 
to
improve 
performance 
and
reduce latency. 
It’s widely used in networking,
browsers, web servers, CDNs,
and applications.

<!-- page 19 -->
Cache-Control 
     Format
Cache-Control: public, max-age=3600

<!-- page 20 -->
Layers of Caching
Browser Caching
Proxy Cache
CDN Cache

<!-- page 21 -->
Netflix Open Connect
The storage in Netflix Open Connect Appliances at ISP sites (points of
presence) holds up to 350 TB!

<!-- page 22 -->
Content Delivery Network (CDN)
A CDN is like a chain of grocery stores
Instead of traveling to faraway farms, shoppers visit a local store
Local stores stock food from distant farms, saving time and effort
Similarly, CDNs cache web content closer to users
Result: Webpages load faster, just like shopping takes minutes, not days

<!-- page 23 -->
How a CDN Works:
A user requests content (e.g., video or
image) from a website.
The nearest edge server serves the
request instead of the origin server.
If not cached, the edge server retrieves
it from the origin and caches it.
 
Benefits include faster load times,
reduced 
bandwidth 
usage, 
and
improved availability.

<!-- page 24 -->
Content Delivery Network (CDN)
Geographically distributed servers, delivers content from the nearest edge
server, reduces latency, saves bandwidth

<!-- page 25 -->
Content Delivery Network (CDN)
Origin in the Late 1990s: CDNs emerged to solve web congestion and latency
issues caused by growing internet usage and media-rich content, with Akamai
pioneering the space in 1998.
Major Players Today: Key providers include Akamai, Cloudflare, Amazon
CloudFront, Netflix Open Connect, Google Cloud CDN, Microsoft Azure CDN, and
Fastly.
You can use a tool to verify what CDNs a particular website is using: CDNPlanet

<!-- page 26 -->
Content Delivery Network (CDN)
Use Cases
Websites, video streaming, software
downloads, gaming, mobile apps
Examples
Cloudflare, 
Akamai, 
Amazon
CloudFront, Google Cloud CDN

<!-- page 27 -->
Benefits of CDN :

<!-- page 28 -->
How Caching Works
A client requests a resource (e.g., image, CSS file).
The server responds and may include cache-control headers.
The client stores the resource in its local cache.
On the next request, the client checks:
Is the cached copy still valid (not expired)?
If valid -> use from cache (no network trip).
If expired -> revalidate or fetch again.

<!-- page 29 -->
Fastly Outage Overview (June 2021): A misconfiguration in Fastly’s network
triggered a widespread outage, taking down major websites like Reddit, Amazon,
and The New York Times.
Impact on Internet Users: The outage highlighted how reliant the modern
internet is on CDNs, as users experienced disruptions and slow load times across
multiple platforms.
Fastly outage in 2021

<!-- page 30 -->
Please fill the feedback form.

<!-- page 31 -->
Thanks
for
watching!

### L08 · Email Protocols, Application Services, Cryptography (02 Sep 2026)
_Topics: Email Protocols, Cryptography, Application Services_

#### Whiteboard

<!-- page 1 -->
DNS : The Internet's Phone
Book, and AWS Route 53
CSAI321:Computer Networks

<!-- page 2 -->
Join the lecture online on your dashboard

<!-- page 3 -->
Recap
Secure the connection
Efficent Communication methods
(Caching)

<!-- page 4 -->
4
But How to reach a server?
Domain Name?
Address of server?
✅
❌

<!-- page 5 -->
What is The address of server?
Lets Understand DNS
Analogy: DNS Records as Justdial Listings
A business listing on Justdial typically shows:
Address / Location
Operating Hours
Services Offered
Contact Numbers

<!-- page 6 -->
What is The address of server?
A DNS records provide:
IP Address (A / AAAA Record) – like
the shop’s address
Mail Exchange (MX Record) – like
the shop’s phone number for calls
Name Servers (NS Record) 
Optional Records (TXT, CNAME, etc.)

<!-- page 7 -->
Domain Name System (DNS)
7
A Distributed, Hierarchical Database
DNS scales by using many servers
worldwide
Organized in a hierarchical structure
No single server holds all mappings
Three main classes of DNS servers:
Root DNS servers
Top-Level Domain (TLD) DNS servers
Authoritative DNS servers

<!-- page 8 -->
How DNS Lookup Works
8
1.Client contacts Root DNS server → returns IP addresses of TLD servers (.com)
2.Client contacts TLD server (.com) → returns IP of authoritative server (amazon.com)
3.Client contacts authoritative server (amazon.com) → returns IP of www.amazon.com
Example: www.amazon.com

<!-- page 9 -->
9
Demo:
Lets do NSlookup for Google.com

<!-- page 10 -->
Classes of DNS Servers
10
Root DNS Servers: 
~1000+ instances worldwide
 Provide IPs of TLD servers
TLD DNS Servers:
Handle domains like .com, .org, .edu, plus country codes (.in, .jp,
etc.)
Maintained by registries (e.g., Verisign for .com)
Provide IPs of authoritative servers
Authoritative DNS Servers:
 Hold DNS records for organizations (e.g., amazon.com,
newtonschool.co)
 Map hostnames → IP addresses

<!-- page 11 -->
Local DNS Servers
11
Not part of hierarchy, but central to
DNS operation at scale
Provided by ISPs (residential &
institutional)
Acts as a proxy: forwards client
queries into hierarchy
Usually close to the client (LAN or few
hops away)

<!-- page 12 -->
Demo: create DNS records in AWS Route 53
12

<!-- page 13 -->
13
Please fill the feedback form.

<!-- page 14 -->
Thanks
for
watching!
14

<!-- page 15 -->
The Socket API is a toolkit enabling apps
to communicate with the OSI model's
transport layer.  
It serves as a bridge for apps to connect
with other systems using protocols like
TCP and UDP.
Socket API as an Interface b/w the
Application and Transport Layers
Application
Socket API
Transport Layer
15

<!-- page 16 -->
Application Layer Protocols
HTTP - Hypertext Transfer Protocol
HTTPS - Hypertext Transfer Protocol Secure
HTTP/2
16

<!-- page 17 -->
HTTP
Client
Server
Request
Response
17
Connection
Close
Stages in an HTTP transaction

<!-- page 18 -->
HTTP is a stateless protocol operating over TCP.
    Stateless Nature of HTTP:
Each HTTP request is independent, treated as a new
request with no memory of prior interactions.
The server does not retain information about previous
client requests or sessions.
HTTP
18

<!-- page 19 -->
Breakdown of HTTP Messages 
HTTP messages consist of requests
(sent from the client to the server)
and responses (sent from the
server to the client).
 These messages are structured in a
way 
that 
includes 
a
request/response 
line, 
headers,
and optionally, a body.
HTTP Message
Request Line
Status Line
Headers
Body
Request
Response
19

<!-- page 20 -->
20
HTTP Request Message Breakdown:
 GET /index.html HTTP/1.1
Host: example.com
User-Agent: Chrome
Accept-Language: en-us
...
optional, e.g. form data, json
Message request
Request Line
Headers
Empty Line
Body

<!-- page 21 -->
HTTP Request Message Breakdown:
Request Line:
The request line contains three parts:
Method: The type of operation the client wants the server to perform (e.g.,
GET, POST, PUT, DELETE).
URL: The resource or endpoint on the server that the client is requesting
(e.g., /home, /api/data).
HTTP Version: The version of HTTP being used (e.g., HTTP/1.1 or HTTP/2).
Example:
GET /index.html HTTP/1.1
21

<!-- page 22 -->
HTTP Request Message Breakdown:
Headers:
Headers provide additional information about the request or about the client’s
capabilities.
Common headers include:
User-Agent: Information about the client software (browser, app, etc.).
Host: The domain name of the server.
Content-Type: The type of data the client is sending (for POST or PUT
requests).
Accept: The types of data the client can process (e.g., text/html,
application/json). 
22

<!-- page 23 -->
HTTP Request Message Breakdown:
Body (optional):
The body contains the actual data being sent by the client (such as form
data, JSON payload, etc.).
This is only included for certain methods like POST, PUT, or PATCH.
Example (for POST request):
json
{ "username": "user1", "password": "password123" }
23

<!-- page 24 -->
24
HTTP Response Message
Breakdown:

<!-- page 25 -->
HTTP Response Message
Breakdown:
Status Line:
The status line consists of:
HTTP Version: The HTTP version used in the response.
Status Code: A 3-digit code indicating the result of the request (e.g.,
200, 404, 500).
Status Message: A short description of the status code (e.g., OK, Not
Found, Internal Server Error).
Example:
HTTP/1.1 200 OK
25

<!-- page 26 -->
HTTP Response Message
Breakdown:
Headers:
Response headers contain metadata about the response, similar
to request headers.
Common headers include:
Content-Type: The type of data being sent in the body (e.g.,
text/html, application/json).
Content-Length: The length of the body in bytes.
Server: Information about the server software.
Date: The date and time the response was sent.
26

<!-- page 27 -->
HTTP Response Message
Breakdown:
Body (optional):
The body of the response contains the actual data being returned by the
server (e.g., HTML, JSON, an image, etc.).
Example:
css
<html><body><h1>Welcome to Example.com</h1></body></html>
27

<!-- page 28 -->
Domain Name System (DNS)
28
A Distributed, Hierarchical Database
DNS scales by using many servers
worldwide
Organized in a hierarchical structure
No single server holds all mappings
Three main classes of DNS servers:
Root DNS servers
Top-Level Domain (TLD) DNS servers
Authoritative DNS servers

<!-- page 29 -->
How DNS Lookup Works
29
1.Client contacts Root DNS server → returns IP addresses of TLD servers (.com)
2.Client contacts TLD server (.com) → returns IP of authoritative server (amazon.com)
3.Client contacts authoritative server (amazon.com) → returns IP of www.amazon.com
Example: www.amazon.com

<!-- page 30 -->
Classes of DNS Servers
30
Root DNS Servers: 
~1000+ instances worldwide
 Provide IPs of TLD servers
TLD DNS Servers:
Handle domains like .com, .org, .edu, plus country codes (.in, .jp,
etc.)
Maintained by registries (e.g., Verisign for .com)
Provide IPs of authoritative servers
Authoritative DNS Servers:
 Hold DNS records for organizations (e.g., amazon.com,
newtonschool.co)
 Map hostnames → IP addresses

<!-- page 31 -->
Local DNS Servers
31
Not part of hierarchy, but central to DNS
operation at scale
Provided by ISPs (residential &
institutional)
Acts as a proxy: forwards client queries
into hierarchy
Usually close to the client (LAN or few
hops away)

<!-- page 32 -->
Demo: create DNS records in AWS Route 53
32

<!-- page 33 -->
Let’s discuss about APIs a bit
33

<!-- page 34 -->
34
Client Server Paradigm
Client
Server
Data
Fetch
Query
Response

<!-- page 35 -->
All teams will henceforth expose their data and
functionality through service interfaces.
Teams must communicate with each other through these
service interfaces.
No other communication is allowed other than service
interfaces over the network.
It doesn't matter what technology they use.
All 
service 
interfaces 
must 
be 
designed 
to 
be
externalizable.
Anyone who doesn't do this will be fired.
35
Jeff Bezos: API Mandate in 2002
(paraphrased)

<!-- page 36 -->
An 
API 
(Application 
Programming
Interface) is a set of protocols, routines,
and tools that allow different software
applications or systems to communicate
with each other over a network. 
APIs define how software components
should interact, providing a structured
way for systems to send and receive
data.
API
API
36

<!-- page 37 -->
37
Location-Based Apps
Delivery Apps
Google Maps API

<!-- page 38 -->
38
Weather App

<!-- page 39 -->
Weather API
Weather APIs offer forecasts, real-time data, and historical reports, often in JSON or
XML formats. 
Use cases include:
Travel apps: (e.g., Kayak, AccuWeather) that provide weather data for trip
planning.
Smart home devices: (e.g., Nest) adjusting settings based on fetched weather
forecasts.
39

<!-- page 40 -->
40
Please fill the feedback form.

<!-- page 41 -->
Thanks
for
watching!
41

<!-- page 42 -->
The Socket API is a toolkit enabling apps
to communicate with the OSI model's
transport layer.  
It serves as a bridge for apps to connect
with other systems using protocols like
TCP and UDP.
Socket API as an Interface b/w the
Application and Transport Layers
Application
Socket API
Transport Layer
42

<!-- page 43 -->
Application Layer Protocols
HTTP - Hypertext Transfer Protocol
HTTPS - Hypertext Transfer Protocol Secure
HTTP/2
43

<!-- page 44 -->
HTTP
Client
Server
Request
Response
44
Connection
Close
Stages in an HTTP transaction

<!-- page 45 -->
HTTP is a stateless protocol operating over TCP.
    Stateless Nature of HTTP:
Each HTTP request is independent, treated as a new
request with no memory of prior interactions.
The server does not retain information about previous
client requests or sessions.
HTTP
45

<!-- page 46 -->
Breakdown of HTTP Messages 
HTTP messages consist of requests
(sent from the client to the server)
and responses (sent from the
server to the client).
 These messages are structured in a
way 
that 
includes 
a
request/response 
line, 
headers,
and optionally, a body.
HTTP Message
Request Line
Status Line
Headers
Body
Request
Response
46

<!-- page 47 -->
47
HTTP Request Message Breakdown:
 GET /index.html HTTP/1.1
Host: example.com
User-Agent: Chrome
Accept-Language: en-us
...
optional, e.g. form data, json
Message request
Request Line
Headers
Empty Line
Body

<!-- page 48 -->
HTTP Request Message Breakdown:
Request Line:
The request line contains three parts:
Method: The type of operation the client wants the server to perform (e.g.,
GET, POST, PUT, DELETE).
URL: The resource or endpoint on the server that the client is requesting
(e.g., /home, /api/data).
HTTP Version: The version of HTTP being used (e.g., HTTP/1.1 or HTTP/2).
Example:
GET /index.html HTTP/1.1
48

<!-- page 49 -->
HTTP Request Message Breakdown:
Headers:
Headers provide additional information about the request or about the client’s
capabilities.
Common headers include:
User-Agent: Information about the client software (browser, app, etc.).
Host: The domain name of the server.
Content-Type: The type of data the client is sending (for POST or PUT
requests).
Accept: The types of data the client can process (e.g., text/html,
application/json). 
49

<!-- page 50 -->
HTTP Request Message Breakdown:
Body (optional):
The body contains the actual data being sent by the client (such as form
data, JSON payload, etc.).
This is only included for certain methods like POST, PUT, or PATCH.
Example (for POST request):
json
{ "username": "user1", "password": "password123" }
50

<!-- page 51 -->
51
HTTP Response Message
Breakdown:

<!-- page 52 -->
HTTP Response Message
Breakdown:
Status Line:
The status line consists of:
HTTP Version: The HTTP version used in the response.
Status Code: A 3-digit code indicating the result of the request (e.g.,
200, 404, 500).
Status Message: A short description of the status code (e.g., OK, Not
Found, Internal Server Error).
Example:
HTTP/1.1 200 OK
52

<!-- page 53 -->
HTTP Response Message
Breakdown:
Headers:
Response headers contain metadata about the response, similar
to request headers.
Common headers include:
Content-Type: The type of data being sent in the body (e.g.,
text/html, application/json).
Content-Length: The length of the body in bytes.
Server: Information about the server software.
Date: The date and time the response was sent.
53

<!-- page 54 -->
HTTP Response Message
Breakdown:
Body (optional):
The body of the response contains the actual data being returned by the
server (e.g., HTML, JSON, an image, etc.).
Example:
css
<html><body><h1>Welcome to Example.com</h1></body></html>
54

<!-- page 55 -->
Substitution Cipher
Find out what the concealed message says, the shift by number is not known, you
just have the text
Gztkliv rsyz srrbz yrz dviv ufjk
Do it without using LLMs, online tools are
game! Simple python brute force script
would be game as well!

<!-- page 56 -->
56
Alice, Bob & Mallory from the world of
cryptography

<!-- page 57 -->
Alice & Bob & Mallory, since 1978

<!-- page 58 -->
Man in the middle attack
Simply put, a MITM (Man-in-the-Middle) attack is the type of online attack where a
hacker gets in between a user and the website they’re visiting.

<!-- page 59 -->
The Challenge: Communicating Secrets in Public
Tampering
Eavesdropping
Impersonation

<!-- page 60 -->
What Mallory has to say...

<!-- page 61 -->
61
Transport Layer Security with TCP

<!-- page 62 -->
At TCP Layer, how TLS gets added
1. ClientHello
The browser initiates the handshake with:
Supported TLS versions
List of supported cipher suites (ways to
encrypt)
Random number (client_random)
Optional: Server name
This is the browser saying, “Hey, here are the
languages I speak. Can we talk securely?”

<!-- page 63 -->
At TCP Layer, how TLS gets added
2. ServerHello
The server responds with:
Chosen TLS version
Selected cipher suite
Its own random number (server_random)
Digital certificate (proves its identity)
This is the server saying, “Sure, I’ll speak this
encryption language. Here’s my ID (certificate)
to prove I am who I say I am.”

<!-- page 64 -->
At TCP Layer, how TLS gets added
3. Certificate Verification (on client side)
The client checks if:
The certificate is valid and trusted (via CA)
The hostname matches
It’s not expired or revoked
 Think of it like checking if a driver's license is
real and matches the person.

<!-- page 65 -->
At TCP Layer, how TLS gets added
4. Pre-Master Secret Generation
Client generates a Pre-Master Secret (a
temporary, shared value)
It encrypts this using the server’s public key
(from certificate)
Sends it to the server
Only the server can decrypt this because only
it has the private key.

<!-- page 66 -->
At TCP Layer, how TLS gets added
5. Key Derivation (on both sides)
Using:
Pre-Master Secret
client_random
server_random
Both the client and the server derive the same
symmetric session key, which will be used to
encrypt communication.

<!-- page 67 -->
At TCP Layer, how TLS gets added
6. Finished Messages
Client sends a “Finished” message
(encrypted with the new key)
Server sends its own “Finished” message
Now both sides know the connection is secure.
The handshake is complete!

<!-- page 68 -->
68
python client TLS exercises

<!-- page 69 -->
69
UDP Protocol

<!-- page 70 -->
Speed vs Reliability – The UDP Trade-Off

<!-- page 71 -->
Are you
getting all of
this?
Who cares
just sent it
faster!
Sender
Receiver
UDP

<!-- page 72 -->
UDP Segment

<!-- page 73 -->
73
UDP chat using nc

<!-- page 74 -->
What is the authoritative DNS 
for newtonschool.co
newtonschool.co
DNS Server
TLD
User  types into the
browser:
What is the IP for
newtonschool.co?
It’s 99.83.190.102
ISP/Security product
Try 80.XX.XX.XX
What is the name server for co? 
Try 120.XX.XX.XX
What is the IP for  newtonschool.co
Try 99.83.190.102
Root level DNS Server
DNS Server
Authoritative DNS Server
Domain Name System(DNS)

<!-- page 75 -->
Video streaming 
Live streaming involves watching events in real-time, such as cricket, news, or
gaming, Unlike buffered YouTube videos, live streams prioritize speed.
Why use udp? using UDP to send video packets quickly without delays.
If some frames are lost, they are skipped to avoid lag. The goal is to maintain a
smooth and instant video flow.

<!-- page 76 -->
Please fill the feedback form.

<!-- page 77 -->
Thank You

<!-- page 79 -->
Demultiplexing
Separates incoming data at the receiver's transport layer by checking the
destination port number on each segment.
This ensures each segment is delivered to the correct application (e.g., browser,
email client) on the device.
letter envelope
courier box

<!-- page 80 -->
Quick UDP Internet Connections(QUIC)

<!-- page 83 -->
Types of Port Numbers & Common Services
Port numbers are divided into three main ranges, each serving a different
purpose in network communication:
1.Well-known Ports (0–1023): Reserved for standard services like HTTP(80),
HTTPS(443), FTP(21), DNS(53), and SSH(22).
1.Registered Ports (1024–49151): Used by third-party applications or vendors
like MySQL(3306), PostgreSQL(5432), and Docker(2375).
1.Dynamic/Private Ports (49152–65535): Temporarily assigned by the operating
system for client-side connections, such as when a browser initiates a
connection.

<!-- page 85 -->
Port Address Translation (PAT)
Port Address Translation (PAT) is a specific type of NAT (Network Address
Translation) that allows multiple devices on a local/private network to share a
single public IP address when accessing the internet.
Instead of assigning a separate public IP to every device, PAT uses unique port
numbers to track each connection. This helps conserve public IP addresses
and manage many connections efficiently.

<!-- page 87 -->
IP & Port Translation in PAT
PAT doesn’t just change the IP
address it also rewrites the port
numbers.
Each internal device is given a unique
combination of: Public IP address
(shared) and Unique port number
(per session), This allows many
devices to access the internet using
one public IP without mix-ups.

<!-- page 88 -->
How PAT Enables Simultaneous Connections
Each outgoing request is tagged with a unique port number, even if it comes
from the same public IP.
These unique port numbers act as IDs that help the router track multiple
sessions even if they’re from the same or different internal devices.
This allows dozens or even hundreds of devices to connect to different websites
or services at the same time, all using a single public IP.

<!-- page 89 -->
Server A
Server B
Server C

<!-- page 90 -->
Where UDP Shines – Use Cases
Online Gaming: In online gaming, real-time speed is more important than
perfect accuracy , it's better to lose a few data packets than experience
delays, as late data is often useless.
Simple Request-Response Protocols (SNMP, TFTP): SNMP(Simple Network
Management Protocol) uses UDP because it sends small, quick status
requests (like checking if a router is online) and doesn't need a connection  if
a reply is lost, it simply retries, making it efficient for large networks.
TFTP(Trivial File Transfer Protocol) uses UDP because it transfers small
configuration or boot files in trusted local networks, where speed and
simplicity matter more than reliability — avoiding TCP’s overhead for faster
startup.

<!-- page 91 -->
DHCP: DHCP(Dynamic Host Configuration Protocol) uses UDP to quickly assign IP
addresses when a device joins a network , it sends one-time requests and responses,
relying on the application to handle any needed reliability.
Where UDP Shines – Use Cases

<!-- page 92 -->
QUIC is a modern transport protocol built on top of UDP, designed by Google.
It's now used in HTTP/3 to make web browsing faster and more secure by
combining UDP’s speed with TCP-like reliability.
Unlike TCP, QUIC avoids slow handshakes, efficiently handles packet loss, and
offers built-in TLS encryption, faster connection setup, and stream
multiplexing making it ideal for platforms like Google, YouTube, and Facebook
to deliver faster, more reliable performance.
Quick UDP Internet Connections(QUIC)

<!-- page 93 -->
Join the lecture online on your dashboard

<!-- page 94 -->
TCP recap
transport layer: communication
between processes
segments oriented
network layer: communication between
hosts

<!-- page 95 -->
HTTPS Recap
https://medium.com/@rocky.bhatia86/in-the-expansive-universe-of-the-internet-where-the-exchange-of-information-is-ceaseless-the-1ffcdad011d1

<!-- page 96 -->
96
How Ceaser communicated via messengers?

<!-- page 97 -->
Ceaser Cipher
cipher is any method of transforming a
message to conceal its meaning
Raj never catches the train. Raj
should have exercised a bit more.
Simran was sad!
Udm qhyhu fdwfkhv wkh wudlq. Udm
vkrxog kdyh hahuflvhg d elw pruh. Vlpudq
zdv vdg!
Shift by 3 for example

<!-- page 98 -->
Substitution Cipher
Find out what the concealed message says, the shift by number is not known, you
just have the text
Gztkliv rsyz srrbz yrz dviv ufjk
Do it without using LLMs, online tools are
game! Simple python brute force script
would be game as well!

<!-- page 99 -->
99
Alice, Bob & Mallory from the world of
cryptography

<!-- page 100 -->
Alice & Bob & Mallory, since 1978

<!-- page 101 -->
Man in the middle attack
Simply put, a MITM (Man-in-the-Middle) attack is the type of online attack where a
hacker gets in between a user and the website they’re visiting.

<!-- page 102 -->
The Challenge: Communicating Secrets in Public
Tampering
Eavesdropping
Impersonation

<!-- page 103 -->
What Mallory has to say...

<!-- page 104 -->
104
Transport Layer Security with TCP

<!-- page 105 -->
At TCP Layer, how TLS gets added
1. ClientHello
The browser initiates the handshake with:
Supported TLS versions
List of supported cipher suites (ways to
encrypt)
Random number (client_random)
Optional: Server name
This is the browser saying, “Hey, here are the
languages I speak. Can we talk securely?”

<!-- page 106 -->
At TCP Layer, how TLS gets added
2. ServerHello
The server responds with:
Chosen TLS version
Selected cipher suite
Its own random number (server_random)
Digital certificate (proves its identity)
This is the server saying, “Sure, I’ll speak this
encryption language. Here’s my ID (certificate)
to prove I am who I say I am.”

<!-- page 107 -->
At TCP Layer, how TLS gets added
3. Certificate Verification (on client side)
The client checks if:
The certificate is valid and trusted (via CA)
The hostname matches
It’s not expired or revoked
 Think of it like checking if a driver's license is
real and matches the person.

<!-- page 108 -->
At TCP Layer, how TLS gets added
4. Pre-Master Secret Generation
Client generates a Pre-Master Secret (a
temporary, shared value)
It encrypts this using the server’s public key
(from certificate)
Sends it to the server
Only the server can decrypt this because only
it has the private key.

<!-- page 109 -->
At TCP Layer, how TLS gets added
5. Key Derivation (on both sides)
Using:
Pre-Master Secret
client_random
server_random
Both the client and the server derive the same
symmetric session key, which will be used to
encrypt communication.

<!-- page 110 -->
At TCP Layer, how TLS gets added
6. Finished Messages
Client sends a “Finished” message
(encrypted with the new key)
Server sends its own “Finished” message
Now both sides know the connection is secure.
The handshake is complete!

<!-- page 111 -->
111
python client TLS exercises

<!-- page 112 -->
112
UDP Protocol

<!-- page 113 -->
Speed vs Reliability – The UDP Trade-Off

<!-- page 114 -->
Are you
getting all of
this?
Who cares
just sent it
faster!
Sender
Receiver
UDP

<!-- page 115 -->
UDP Segment

<!-- page 116 -->
116
UDP chat using nc

<!-- page 117 -->
What is the authoritative DNS 
for newtonschool.co
newtonschool.co
DNS Server
TLD
User  types into the
browser:
What is the IP for
newtonschool.co?
It’s 99.83.190.102
ISP/Security product
Try 80.XX.XX.XX
What is the name server for co? 
Try 120.XX.XX.XX
What is the IP for  newtonschool.co
Try 99.83.190.102
Root level DNS Server
DNS Server
Authoritative DNS Server
Domain Name System(DNS)

<!-- page 118 -->
Video streaming 
Live streaming involves watching events in real-time, such as cricket, news, or
gaming, Unlike buffered YouTube videos, live streams prioritize speed.
Why use udp? using UDP to send video packets quickly without delays.
If some frames are lost, they are skipped to avoid lag. The goal is to maintain a
smooth and instant video flow.

<!-- page 119 -->
Please fill the feedback form.

<!-- page 120 -->
Thank You

<!-- page 122 -->
Demultiplexing
Separates incoming data at the receiver's transport layer by checking the
destination port number on each segment.
This ensures each segment is delivered to the correct application (e.g., browser,
email client) on the device.
letter envelope
courier box

<!-- page 123 -->
Quick UDP Internet Connections(QUIC)

<!-- page 126 -->
Types of Port Numbers & Common Services
Port numbers are divided into three main ranges, each serving a different
purpose in network communication:
1.Well-known Ports (0–1023): Reserved for standard services like HTTP(80),
HTTPS(443), FTP(21), DNS(53), and SSH(22).
1.Registered Ports (1024–49151): Used by third-party applications or vendors
like MySQL(3306), PostgreSQL(5432), and Docker(2375).
1.Dynamic/Private Ports (49152–65535): Temporarily assigned by the operating
system for client-side connections, such as when a browser initiates a
connection.

<!-- page 128 -->
Port Address Translation (PAT)
Port Address Translation (PAT) is a specific type of NAT (Network Address
Translation) that allows multiple devices on a local/private network to share a
single public IP address when accessing the internet.
Instead of assigning a separate public IP to every device, PAT uses unique port
numbers to track each connection. This helps conserve public IP addresses
and manage many connections efficiently.

<!-- page 130 -->
IP & Port Translation in PAT
PAT doesn’t just change the IP
address it also rewrites the port
numbers.
Each internal device is given a unique
combination of: Public IP address
(shared) and Unique port number
(per session), This allows many
devices to access the internet using
one public IP without mix-ups.

<!-- page 131 -->
How PAT Enables Simultaneous Connections
Each outgoing request is tagged with a unique port number, even if it comes
from the same public IP.
These unique port numbers act as IDs that help the router track multiple
sessions even if they’re from the same or different internal devices.
This allows dozens or even hundreds of devices to connect to different websites
or services at the same time, all using a single public IP.

<!-- page 132 -->
Server A
Server B
Server C

<!-- page 133 -->
Where UDP Shines – Use Cases
Online Gaming: In online gaming, real-time speed is more important than
perfect accuracy , it's better to lose a few data packets than experience
delays, as late data is often useless.
Simple Request-Response Protocols (SNMP, TFTP): SNMP(Simple Network
Management Protocol) uses UDP because it sends small, quick status
requests (like checking if a router is online) and doesn't need a connection  if
a reply is lost, it simply retries, making it efficient for large networks.
TFTP(Trivial File Transfer Protocol) uses UDP because it transfers small
configuration or boot files in trusted local networks, where speed and
simplicity matter more than reliability — avoiding TCP’s overhead for faster
startup.

<!-- page 134 -->
DHCP: DHCP(Dynamic Host Configuration Protocol) uses UDP to quickly assign IP
addresses when a device joins a network , it sends one-time requests and responses,
relying on the application to handle any needed reliability.
Where UDP Shines – Use Cases

<!-- page 135 -->
QUIC is a modern transport protocol built on top of UDP, designed by Google.
It's now used in HTTP/3 to make web browsing faster and more secure by
combining UDP’s speed with TCP-like reliability.
Unlike TCP, QUIC avoids slow handshakes, efficiently handles packet loss, and
offers built-in TLS encryption, faster connection setup, and stream
multiplexing making it ideal for platforms like Google, YouTube, and Facebook
to deliver faster, more reliable performance.
Quick UDP Internet Connections(QUIC)

### L09 · DNS (07 Sep 2026)
_Topics: DNS_

#### Whiteboard

<!-- page 1 -->
The Transport Layer —
Multiplexing, Ports, UDP,
and the TCP Connection
Computer Networks

<!-- page 2 -->
Join the lecture online on your dashboard

<!-- page 3 -->
How DNS Lookup Works
1.Client contacts Root DNS server → returns IP addresses of TLD servers (.com)
2.Client contacts TLD server (.com) → returns IP of authoritative server (amazon.com)
3.Client contacts authoritative server (amazon.com) → returns IP of www.amazon.com
Example: www.amazon.com
Recap

<!-- page 4 -->
Recap
4

<!-- page 5 -->
Layer 4
5
Implemented in sending and receiving
devices
Network 
routers 
only 
process
network-layer information
Routers 
ignore 
transport-layer
segment fields completely
TCP/UDP
Transport layer converts application messages into segments

<!-- page 6 -->
6
Ports and Sockets

<!-- page 7 -->
Ports and Sockets
7
The Apartment Building Analogy
Sending a letter to a friend living in a large
apartment building requires:
🏢 Building's street address (1 Infinite Loop)
🚪 Friend's apartment number (Apartment
#443)
Without both pieces, your letter gets lost!
Example: Your browser connecting to Google
Your Laptop IP:Random Port ↔ Google IP:443
How This Maps to Networking
In networking, it works exactly the same
way:
🏢 IP Address = Computer's "street address"
(172.217.167.78)
🚪 Port Number = Application's "apartment
number" (Port 443)
IP Address + Port Number = Socket (unique
endpoint)

<!-- page 8 -->
Ports and Sockets
8
When you combine an IP address and a Port number, you create a unique endpoint for a
conversation. This specific "doorway" on a computer, is called a Socket.
netstat -tnlp tcp

<!-- page 9 -->
Multiplexing (Sender Side)
Multiplexing is the process of collecting data from multiple application processes
and sending it through the network using transport layer protocols.

<!-- page 10 -->
Demultiplexing (Receiver Side)
Demultiplexing is the process of delivering received data to the correct 
 application process using port numbers.

<!-- page 11 -->
11
Transport Layer Protocols

<!-- page 12 -->
12
UDP Protocol

<!-- page 13 -->
Are you
getting all of
this?
Who cares
just sent it
faster!
Sender
Receiver
UDP

<!-- page 14 -->
UDP Segment

<!-- page 15 -->
newtonschool.co
User  types into the
browser:
What is the authoritative DNS 
for newtonschool.co
TLD
DNS Server
What is the IP for
newtonschool.co?
It’s 99.83.190.102
ISP/Security product
What is the name server for co? 
Try 120.XX.XX.XX
What is the IP for  newtonschool.co
Try 99.83.190.102
Root level DNS Server
DNS Server
Authoritative DNS Server
Try 80.XX.XX.XX
Domain Name System(DNS)

<!-- page 16 -->
Video streaming 
Live streaming involves watching events in real-time, such as cricket, news, or
gaming, Unlike buffered YouTube videos, live streams prioritize speed.
Why use udp? using UDP to send video packets quickly without delays.
If some frames are lost, they are skipped to avoid lag. The goal is to maintain a
smooth and instant video flow.

<!-- page 17 -->
17
TCP & The 3-Way Handshake

<!-- page 18 -->
TCP 3-Way Handshake Ritual
Let's tell this story from the perspective of your browser
(client) connecting to google server...
Step 1: The Ring 📞 (SYN)
Your browser calls the Google server by sending a
special, tiny message called a SYN packet. SYN
stands for "synchronize." It’s your browser
essentially saying:
"Hey, are you there? I'd like to start a conversation. To keep our chat
organized, I'll start numbering my sentences at number 100."

<!-- page 19 -->
TCP  3-Way Handshake Ritual
Step 2: The "Hello?" 👋 (SYN-ACK)
The Google server, which is always listening for calls on
Port 443, gets the SYN packet. It responds with its own
special message, a SYN-ACK packet. This message does
two things at once:
"Hi! Yes, I'm here! I ACKnowledge your request to start at sentence
number 100. And to keep my side of the chat organized, I'll
SYNchronize and start my sentences at number 350. Are you
ready?"

<!-- page 20 -->
TCP 3-Way Handshake Ritual
Step 3: The "I'm Here!" 👍 (ACK)
Your browser gets the server's response. The
session is almost established! It just has to do one
last thing: confirm it heard the server. It sends a final
ACK (acknowledgment) packet.
"Got it! I ACKnowledge that you're starting at 350. Let's talk!"
And boom! The connection is ESTABLISHED.

<!-- page 21 -->
TCP has a polite "goodbye" process. It's usually a 4-
Way Handshake.
Step 1: The "I have to go." (FIN)
The client sends a FIN packet (for "finish")
Step 2: The "Okay." (ACK)
The server receives this and acknowledges it.
Step 3: The "I'm done too." (FIN)
Once the server has finished sending any remaining data, it
sends its own FIN packet.
Step 4: The Final "Bye." (ACK)
Your client gets the server's FIN and sends one last ACK.
TCP Connection Teardown

<!-- page 22 -->
Ordered Delivery 
Messages can take different routes and arrive out of order.
Imagine trying to read a story that came in like this: "the
mat." "The cat" "sat on". It's confusing!
TCP solves this by using the sequence numbers we
established during the handshake. 
Every single piece of data (segment) is given a number. If the
receiver gets segment #3 before segment #2, it simply waits
for #2 to arrive before putting the story back together in the
correct order for the application.
Sequence Numbers

<!-- page 23 -->
How do you know the other person heard you on a phone call?
You listen for them to say "hmm," or "achcha."
When the server receives a chunk of data (say, segments
101-200), it sends back an ACK message that says, "I've
received everything up to number 201."
If your browser doesn't get an ACK back within a certain
amount of time, it assumes the data was lost. What does it
do?
Acknowledgments & Retransmission
It simply retransmits the lost data. It sends it again, saying, "Did you get that part?"

<!-- page 24 -->
TCP Segment: Preview
Legend:
Source Port: Specifies the port number of the sending
application.
Destination Port: Indicates the port number of the
receiving application.
Sequence Number: Provides a unique identifier for each
TCP segment to ensure ordered delivery.
Acknowledgment Number: Acknowledges the receipt of
data and indicates the next expected sequence number.
Data Offset: Specifies the length of the TCP header in 32-
bit words.

<!-- page 25 -->
TCP Segment: Preview
Legend:
Control Flags: These flags include various control and
status bits such as SYN, ACK, FIN, etc.
Window Size: Indicates the receiver's buffer size for flow
control.
Checksum: Helps ensure data integrity during
transmission.
Urgent Pointer: If the URG flag is set, then this 16-bit field
is an offset from the sequence number indicating the last
urgent data byte.

<!-- page 26 -->
Speed vs Reliability – The UDP Trade-Off

<!-- page 27 -->
Please fill the feedback form.

<!-- page 28 -->
Thank You

#### The Transport Layer — Multiplexing, Ports, UDP, and the TCP Connection.pdf

<!-- page 1 -->
The Transport Layer —
Multiplexing, Ports, UDP,
and the TCP Connection
Computer Networks

<!-- page 2 -->
Join the lecture online on your dashboard

<!-- page 3 -->
How DNS Lookup Works
1.Client contacts Root DNS server → returns IP addresses of TLD servers (.com)
2.Client contacts TLD server (.com) → returns IP of authoritative server (amazon.com)
3.Client contacts authoritative server (amazon.com) → returns IP of www.amazon.com
Example: www.amazon.com
Recap

<!-- page 4 -->
Recap
4

<!-- page 5 -->
Layer 4
5
Implemented in sending and receiving
devices
Network 
routers 
only 
process
network-layer information
Routers 
ignore 
transport-layer
segment fields completely
TCP/UDP
Transport layer converts application messages into segments

<!-- page 6 -->
6
Ports and Sockets

<!-- page 7 -->
Ports and Sockets
7
The Apartment Building Analogy
Sending a letter to a friend living in a large
apartment building requires:
🏢 Building's street address (1 Infinite Loop)
🚪 Friend's apartment number (Apartment
#443)
Without both pieces, your letter gets lost!
Example: Your browser connecting to Google
Your Laptop IP:Random Port ↔ Google IP:443
How This Maps to Networking
In networking, it works exactly the same
way:
🏢 IP Address = Computer's "street address"
(172.217.167.78)
🚪 Port Number = Application's "apartment
number" (Port 443)
IP Address + Port Number = Socket (unique
endpoint)

<!-- page 8 -->
Ports and Sockets
8
When you combine an IP address and a Port number, you create a unique endpoint for a
conversation. This specific "doorway" on a computer, is called a Socket.
netstat -tnlp tcp

<!-- page 9 -->
Multiplexing (Sender Side)
Multiplexing is the process of collecting data from multiple application processes
and sending it through the network using transport layer protocols.

<!-- page 10 -->
Demultiplexing (Receiver Side)
Demultiplexing is the process of delivering received data to the correct 
 application process using port numbers.

<!-- page 11 -->
11
Transport Layer Protocols

<!-- page 12 -->
12
UDP Protocol

<!-- page 13 -->
Are you
getting all of
this?
Who cares
just sent it
faster!
Sender
Receiver
UDP

<!-- page 14 -->
UDP Segment

<!-- page 15 -->
newtonschool.co
User  types into the
browser:
What is the authoritative DNS 
for newtonschool.co
TLD
DNS Server
What is the IP for
newtonschool.co?
It’s 99.83.190.102
ISP/Security product
What is the name server for co? 
Try 120.XX.XX.XX
What is the IP for  newtonschool.co
Try 99.83.190.102
Root level DNS Server
DNS Server
Authoritative DNS Server
Try 80.XX.XX.XX
Domain Name System(DNS)

<!-- page 16 -->
Video streaming 
Live streaming involves watching events in real-time, such as cricket, news, or
gaming, Unlike buffered YouTube videos, live streams prioritize speed.
Why use udp? using UDP to send video packets quickly without delays.
If some frames are lost, they are skipped to avoid lag. The goal is to maintain a
smooth and instant video flow.

<!-- page 17 -->
17
TCP & The 3-Way Handshake

<!-- page 18 -->
TCP 3-Way Handshake Ritual
Let's tell this story from the perspective of your browser
(client) connecting to google server...
Step 1: The Ring 📞 (SYN)
Your browser calls the Google server by sending a
special, tiny message called a SYN packet. SYN
stands for "synchronize." It’s your browser
essentially saying:
"Hey, are you there? I'd like to start a conversation. To keep our chat
organized, I'll start numbering my sentences at number 100."

<!-- page 19 -->
TCP  3-Way Handshake Ritual
Step 2: The "Hello?" 👋 (SYN-ACK)
The Google server, which is always listening for calls on
Port 443, gets the SYN packet. It responds with its own
special message, a SYN-ACK packet. This message does
two things at once:
"Hi! Yes, I'm here! I ACKnowledge your request to start at sentence
number 100. And to keep my side of the chat organized, I'll
SYNchronize and start my sentences at number 350. Are you
ready?"

<!-- page 20 -->
TCP 3-Way Handshake Ritual
Step 3: The "I'm Here!" 👍 (ACK)
Your browser gets the server's response. The
session is almost established! It just has to do one
last thing: confirm it heard the server. It sends a final
ACK (acknowledgment) packet.
"Got it! I ACKnowledge that you're starting at 350. Let's talk!"
And boom! The connection is ESTABLISHED.

<!-- page 21 -->
TCP has a polite "goodbye" process. It's usually a 4-
Way Handshake.
Step 1: The "I have to go." (FIN)
The client sends a FIN packet (for "finish")
Step 2: The "Okay." (ACK)
The server receives this and acknowledges it.
Step 3: The "I'm done too." (FIN)
Once the server has finished sending any remaining data, it
sends its own FIN packet.
Step 4: The Final "Bye." (ACK)
Your client gets the server's FIN and sends one last ACK.
TCP Connection Teardown

<!-- page 22 -->
Ordered Delivery 
Messages can take different routes and arrive out of order.
Imagine trying to read a story that came in like this: "the
mat." "The cat" "sat on". It's confusing!
TCP solves this by using the sequence numbers we
established during the handshake. 
Every single piece of data (segment) is given a number. If the
receiver gets segment #3 before segment #2, it simply waits
for #2 to arrive before putting the story back together in the
correct order for the application.
Sequence Numbers

<!-- page 23 -->
How do you know the other person heard you on a phone call?
You listen for them to say "hmm," or "achcha."
When the server receives a chunk of data (say, segments
101-200), it sends back an ACK message that says, "I've
received everything up to number 201."
If your browser doesn't get an ACK back within a certain
amount of time, it assumes the data was lost. What does it
do?
Acknowledgments & Retransmission
It simply retransmits the lost data. It sends it again, saying, "Did you get that part?"

<!-- page 24 -->
TCP Segment: Preview
Legend:
Source Port: Specifies the port number of the sending
application.
Destination Port: Indicates the port number of the
receiving application.
Sequence Number: Provides a unique identifier for each
TCP segment to ensure ordered delivery.
Acknowledgment Number: Acknowledges the receipt of
data and indicates the next expected sequence number.
Data Offset: Specifies the length of the TCP header in 32-
bit words.

<!-- page 25 -->
TCP Segment: Preview
Legend:
Control Flags: These flags include various control and
status bits such as SYN, ACK, FIN, etc.
Window Size: Indicates the receiver's buffer size for flow
control.
Checksum: Helps ensure data integrity during
transmission.
Urgent Pointer: If the URG flag is set, then this 16-bit field
is an offset from the sequence number indicating the last
urgent data byte.

<!-- page 26 -->
Speed vs Reliability – The UDP Trade-Off

<!-- page 27 -->
Please fill the feedback form.

<!-- page 28 -->
Thank You

### L10 · Transport Layer, Caching, Content Delivery Network (CDN), Route 53 DNS Service,  ... (09 Sep 2026)
_Topics: TCP, UDP, TCP Handshake, Route 53 DNS Service, Caching, Content Delivery Network (CDN), TCP Flow Control, TCP Sliding Window, Transport Layer_

#### Whiteboard

<!-- page 1 -->
Reliable Data
Transfer and TCP
Flow Control

<!-- page 2 -->
Join the lecture online on your dashboard

<!-- page 3 -->
Layers recap

<!-- page 4 -->
Building reliability from an unreliable
channel

<!-- page 5 -->
Transmission control protocol
Establishes connection prior to data transmission.
Maintains data integrity using sequence numbers,
acknowledgments and checksums.
Ensures reliable, ordered delivery of data packets,
handling any loss.
Handles the connection tear down process as well...

<!-- page 6 -->
TCP has a polite "goodbye" process. It's usually a 4-
Way Handshake.
Step 1: The "I have to go." (FIN)
The client sends a FIN packet (for "finish")
Step 2: The "Okay." (ACK)
The server receives this and acknowledges it.
Step 3: The "I'm done too." (FIN)
Once the server has finished sending any remaining data, it
sends its own FIN packet.
Step 4: The Final "Bye." (ACK)
Your client gets the server's FIN and sends one last ACK.
TCP Connection Teardown

<!-- page 7 -->
7
Wireshark TCP echo server follow up

<!-- page 8 -->
Checksums:
Let's imagine a tiny piece of data Alice wants to send, broken into two 8-bit chunks:
Chunk 1: 10010011 (which is 147 in decimal)
Chunk 2: 01010110 (which is 86 in decimal)
Step 1: Sender's Side (Alice): TCP adds these two chunks together.
As TCP aims to provide reliable data transfer, checksum detects transmission errors so that
corrupted data can be retransmit.

<!-- page 9 -->
Checksums:
Step 2: TCP takes that carry-over 1 and adds it to the result.
Step 3: Finally, it performs a "1's complement" (it flips all the bits) to create the checksum.
So checksum becomes 11110101.

<!-- page 10 -->
Checksums:
Alice sends the original data chunks and this checksum (11110101)
to Bob.
Bob performs the same calculation on the data it received
And then adds the checksum it received.
If the final result is all 1s, TCP knows with high probability that the data is perfect! ✅

<!-- page 11 -->
The Waiting Game: 
Round Trip Time (RTT)
Alice needs a receipt (an ACK, or Acknowledgment)
from CAROL to know it arrived safely. 
How long should she wait before she assumes the
page was lost? Ten milliseconds? A full second?
This is where the Round Trip Time (RTT) comes in.
It's the total time it takes for a segment to go from
Alice to CAROL and for CAROL's acknowledgment to
come back to Alice.

<!-- page 12 -->
Round Trip Time (RTT)
ping newtonschool.co
ping taobao.com

<!-- page 13 -->
13
Stop and Wait Protocol
Sliding Window Protocol

<!-- page 14 -->
Why is Flow Control Needed?
Not all devices have the same buffer size or
processing power.
A fast sender could flood a slow receiver,
leading to packet loss or buffer overflow.
TCP flow control prevents this by allowing the
receiver to say:
   “Hey, slow down — I can only handle this much
right now.”

<!-- page 15 -->
How Stop-and-Wait Works
https://nstclassdemo2025.pages.dev/stop-and-wait
Sender: Transmits a data packet with sequence
number N
Sender: Stops all transmission and waits
Receiver: Receives packet N, processes it
Receiver: Sends ACK with acknowledgment
number N+1 (indicating "I received N, send me
N+1 next")

<!-- page 16 -->
Very inefficient for high-latency or high-
bandwidth networks.
Example: On a long-distance link, the
sender wastes time waiting for each ACK
before sending again.
Utilization is low:
 Stop & Wait Mechanism
 → transmission time
 → propagation delay

<!-- page 17 -->
TCP uses a "sliding window protocol" to
manage flow control.
The receiver tells the sender how much
data it can receive at a time (called the
window size).
As the receiver processes data and
acknowledges packets, the sender "slides"
the window forward and sends more.
Sliding Window Protocol

<!-- page 18 -->
How Sliding Window Protocol Works
https://nstclassdemo2025.pages.dev/sliding-window

<!-- page 19 -->
Zero Window Condition
A Zero Window condition occurs in TCP flow
control when the receiver's buffer is full, and it
temporarily tells the sender to stop sending data.
This is done by the receiver advertising a window
size of zero in the TCP header

<!-- page 20 -->
Zero Window Condition

<!-- page 21 -->
Zero Window Condition
https://nstclassdemo2025.pages.dev/zero-window

<!-- page 22 -->
Go-Back-N 
Go-Back-N (GBN) is an error control
protocol 
designed 
for 
reliable
communication over noisy channels.
It 
enables 
the 
sender 
to 
send
multiple frames before receiving an
acknowledgment; however, if a frame
is lost or erroneous, the sender must
retransmit 
that 
frame 
and 
all
subsequent frames.
https://computerscience.unicam.it/marcantoni/reti/applet/GoBackProtocol/goback.html

<!-- page 23 -->
How Go-Back-N Works
Sender sends N frames at once without waiting for individual ACKs.
 Receiver only accepts frames in order (i.e., sequentially).
 If a frame is lost or arrives corrupted, the receiver:
             Discards that frame and all that follow, even if they're correct.
 The sender goes back to the last acknowledged frame and retransmits
all frames from there.

<!-- page 24 -->
Selective Repeat 
Selective Repeat (SR) is an error-
control 
protocol 
used 
in 
data
transmission 
to 
ensure 
reliable
delivery over unreliable or noisy
networks. 
Unlike Go-Back-N, it only retransmits
the 
frames 
that 
were 
lost 
or
corrupted, 
not 
all 
subsequent
frames.

<!-- page 25 -->
How Selective Repeat Works
The sender can send multiple frames up to a specified window size without
waiting for ACKs.
 The receiver can accept and buffer frames out of order.
If a frame is lost or corrupted:
           The receiver discards only that frame.
           Sends a Negative ACK (NACK) or simply doesn’t ACK that frame.
The sender retransmits only the missing frame, not the whole window.
https://media.pearsoncmg.com/ph/esm/ecs_kurose_compnetwork_8/cw/content/interactiveanimations/selective-repeat-
protocol/index.html

<!-- page 26 -->
Please fill the feedback form

<!-- page 27 -->
Thank You

#### Reliable Data Transfer and TCP Flow Control.pdf

<!-- page 1 -->
Reliable Data
Transfer and TCP
Flow Control

<!-- page 2 -->
Join the lecture online on your dashboard

<!-- page 3 -->
Layers recap

<!-- page 4 -->
Building reliability from an unreliable
channel

<!-- page 5 -->
Transmission control protocol
Establishes connection prior to data transmission.
Maintains data integrity using sequence numbers,
acknowledgments and checksums.
Ensures reliable, ordered delivery of data packets,
handling any loss.
Handles the connection tear down process as well...

<!-- page 6 -->
TCP has a polite "goodbye" process. It's usually a 4-
Way Handshake.
Step 1: The "I have to go." (FIN)
The client sends a FIN packet (for "finish")
Step 2: The "Okay." (ACK)
The server receives this and acknowledges it.
Step 3: The "I'm done too." (FIN)
Once the server has finished sending any remaining data, it
sends its own FIN packet.
Step 4: The Final "Bye." (ACK)
Your client gets the server's FIN and sends one last ACK.
TCP Connection Teardown

<!-- page 7 -->
7
Wireshark TCP echo server follow up

<!-- page 8 -->
Checksums:
Let's imagine a tiny piece of data Alice wants to send, broken into two 8-bit chunks:
Chunk 1: 10010011 (which is 147 in decimal)
Chunk 2: 01010110 (which is 86 in decimal)
Step 1: Sender's Side (Alice): TCP adds these two chunks together.
As TCP aims to provide reliable data transfer, checksum detects transmission errors so that
corrupted data can be retransmit.

<!-- page 9 -->
Checksums:
Step 2: TCP takes that carry-over 1 and adds it to the result.
Step 3: Finally, it performs a "1's complement" (it flips all the bits) to create the checksum.
So checksum becomes 11110101.

<!-- page 10 -->
Checksums:
Alice sends the original data chunks and this checksum (11110101)
to Bob.
Bob performs the same calculation on the data it received
And then adds the checksum it received.
If the final result is all 1s, TCP knows with high probability that the data is perfect! ✅

<!-- page 11 -->
The Waiting Game: 
Round Trip Time (RTT)
Alice needs a receipt (an ACK, or Acknowledgment)
from CAROL to know it arrived safely. 
How long should she wait before she assumes the
page was lost? Ten milliseconds? A full second?
This is where the Round Trip Time (RTT) comes in.
It's the total time it takes for a segment to go from
Alice to CAROL and for CAROL's acknowledgment to
come back to Alice.

<!-- page 12 -->
Round Trip Time (RTT)
ping newtonschool.co
ping taobao.com

<!-- page 13 -->
13
Stop and Wait Protocol
Sliding Window Protocol

<!-- page 14 -->
Why is Flow Control Needed?
Not all devices have the same buffer size or
processing power.
A fast sender could flood a slow receiver,
leading to packet loss or buffer overflow.
TCP flow control prevents this by allowing the
receiver to say:
   “Hey, slow down — I can only handle this much
right now.”

<!-- page 15 -->
How Stop-and-Wait Works
https://nstclassdemo2025.pages.dev/stop-and-wait
Sender: Transmits a data packet with sequence
number N
Sender: Stops all transmission and waits
Receiver: Receives packet N, processes it
Receiver: Sends ACK with acknowledgment
number N+1 (indicating "I received N, send me
N+1 next")

<!-- page 16 -->
Very inefficient for high-latency or high-
bandwidth networks.
Example: On a long-distance link, the
sender wastes time waiting for each ACK
before sending again.
Utilization is low:
 Stop & Wait Mechanism
 → transmission time
 → propagation delay

<!-- page 17 -->
TCP uses a "sliding window protocol" to
manage flow control.
The receiver tells the sender how much
data it can receive at a time (called the
window size).
As the receiver processes data and
acknowledges packets, the sender "slides"
the window forward and sends more.
Sliding Window Protocol

<!-- page 18 -->
How Sliding Window Protocol Works
https://nstclassdemo2025.pages.dev/sliding-window

<!-- page 19 -->
Zero Window Condition
A Zero Window condition occurs in TCP flow
control when the receiver's buffer is full, and it
temporarily tells the sender to stop sending data.
This is done by the receiver advertising a window
size of zero in the TCP header

<!-- page 20 -->
Zero Window Condition

<!-- page 21 -->
Zero Window Condition
https://nstclassdemo2025.pages.dev/zero-window

<!-- page 22 -->
Go-Back-N 
Go-Back-N (GBN) is an error control
protocol 
designed 
for 
reliable
communication over noisy channels.
It 
enables 
the 
sender 
to 
send
multiple frames before receiving an
acknowledgment; however, if a frame
is lost or erroneous, the sender must
retransmit 
that 
frame 
and 
all
subsequent frames.
https://computerscience.unicam.it/marcantoni/reti/applet/GoBackProtocol/goback.html

<!-- page 23 -->
How Go-Back-N Works
Sender sends N frames at once without waiting for individual ACKs.
 Receiver only accepts frames in order (i.e., sequentially).
 If a frame is lost or arrives corrupted, the receiver:
             Discards that frame and all that follow, even if they're correct.
 The sender goes back to the last acknowledged frame and retransmits
all frames from there.

<!-- page 24 -->
Selective Repeat 
Selective Repeat (SR) is an error-
control 
protocol 
used 
in 
data
transmission 
to 
ensure 
reliable
delivery over unreliable or noisy
networks. 
Unlike Go-Back-N, it only retransmits
the 
frames 
that 
were 
lost 
or
corrupted, 
not 
all 
subsequent
frames.

<!-- page 25 -->
How Selective Repeat Works
The sender can send multiple frames up to a specified window size without
waiting for ACKs.
 The receiver can accept and buffer frames out of order.
If a frame is lost or corrupted:
           The receiver discards only that frame.
           Sends a Negative ACK (NACK) or simply doesn’t ACK that frame.
The sender retransmits only the missing frame, not the whole window.
https://media.pearsoncmg.com/ph/esm/ecs_kurose_compnetwork_8/cw/content/interactiveanimations/selective-repeat-
protocol/index.html

<!-- page 26 -->
Please fill the feedback form

<!-- page 27 -->
Thank You

### L11 · Congestion Avoidance, TCP Congestion Control, Slow Start (14 Sep 2026)
_Topics: TCP Congestion Control, Slow Start, Congestion Avoidance_

#### TCP Congestion Control Algorithms.pdf

<!-- page 1 -->
TCP  Congestion
Control Algorithms

<!-- page 2 -->
Join the lecture online on your dashboard

<!-- page 3 -->
TCP recap
transport layer: communication
between processes
segments oriented
network layer: communication between
hosts

<!-- page 4 -->
TCP recap
Packet delivery time = Transmission
time + Propagation delay
Pipelining: increased utilization

<!-- page 5 -->
Sliding Window Protocol
TCP uses a "sliding window protocol" to
manage flow control.
The receiver tells the sender how much
data it can receive at a time (called the
window size).
As the receiver processes data and
acknowledges packets, the sender "slides"
the window forward and sends more.

<!-- page 6 -->
6
TCP flow control helps for a single client!
What if the network is crowded?

<!-- page 7 -->
7
The Traffic Jam (Congestion)
All senders have to slow down
Only Mater (client) wants to move slowly
Let’s look at the cars analogy...

<!-- page 8 -->
Congestion Window
Congestion window size (cwnd)
Sender-side limit on the amount of
data the sender can have in flight
before receiving an acknowledgment
(ACK) from the client.
For new connections it is 10 by default
in most operating systems

<!-- page 9 -->
Two special cases of TCP timeouts
lost ACK scenario
premature timeout

<!-- page 10 -->
TCP Congestion Control
TCP is a polite driver.
Its mission: Get your data to its destination as fast as possible, but without
causing a traffic jam for everyone else.

<!-- page 11 -->
Slow Start
slow start, send just
a single car on the
road
Next time send
two cars
Then send four cars
1
2
4

<!-- page 12 -->
Slow Start
When the connection is established, it starts
slowly in a phase called Slow Start.
Initially, it sends a small number of send.
If those packets are acknowledged, it doubles
the number sent.
This doubling helps to find an optimal number
of segments to send

<!-- page 13 -->
When Does Slow Start End?
   Slow Start continues until:
congestion window reaches a threshold called slow start
threshold (ssthresh), 
ssthresh = cwnd/2
half of the value of the congestion window value when congestion
was detected. 
It switches to Congestion Avoidance.
Instead of doubling, it now adds just one extra packet at a time.
This is a gentle, linear increase.
OR
Packet loss occurs (timeout or 3 duplicate ACKs)

<!-- page 14 -->
Congestion Avoidance
MSS (Maximum Segment Size) is the
largest amount of data, in bytes, that a
device can send in the payload of a
single TCP segment

<!-- page 15 -->
AIMD (Additive Increase, Multiplicative
Decrease)
approach: senders can increase sending rate until packet loss (congestion) occurs, then
decrease sending rate on loss event
      Additive Increase
Every RTT (Round Trip Time) with no packet loss:
           Increase cwnd linearly by 1 MSS (Maximum Segment Size).
     Multiplicative Decrease
sending rate: Cut in half on loss detected by three duplicate ACKs
Cut to 1 MSS (maximum segment size) when loss detected by timeout

<!-- page 16 -->
AIMD operates by having the sender increase its transmission rate
(Additive Increase) to probe for bandwidth. Upon packet loss, indicating
congestion, it halves the rate (Multiplicative Decrease), creating a
sawtooth wave pattern.
The TCP Sawtooth Pattern

<!-- page 17 -->
Fast Retransmit and Fast Recovery in TCP
Why Are They Needed?
TCP is designed to detect packet loss either through:
A timeout (slow and inefficient), or
Multiple duplicate ACKs (faster mechanism)
To speed up recovery and avoid unnecessary delays, TCP
uses:
1.✅ Fast Retransmit
2.🔁 Fast Recovery

<!-- page 18 -->
Fast Retransmit
If the sender receives three duplicate
ACKs (e.g., ACK 5, ACK 5, ACK 5),
It assumes a packet was lost, likely the
next in sequence,
It immediately retransmits that missing
packet.
Faster than waiting for a timer to
expire!

<!-- page 19 -->
Fast Recovery
Fast Recovery is used immediately
after Fast Retransmit.
Instead of going back to Slow Start,
TCP 
enters 
Congestion 
Avoidance
directly, 
allowing 
smoother
performance.

<!-- page 20 -->
Event
cwnd (in MSS)
Explanation
RTT 1 (no loss)
17
Additive increase (cwnd += 1)
RTT 2 (no loss)
18
cwnd += 1
RTT 3 (tcp timeout)
9
Multiplicative decrease (cwnd / 2)
RTT 4 (no loss)
10
Resume additive increase
Step-by-Step example for fast recovery
     Assume:
ssthresh = 8 MSS, cwnd = 16 MSS,  TCP is in Congestion Avoidance in RTT 3

<!-- page 21 -->
TCP CUBIC
Is there a better way than AIMD
to 
“probe” 
for 
usable
bandwidth?
sending rate at which
congestion loss was
detected
increase W as a function of the
cube of the distance between
current time and time when TCP
window size will reach Wmax
TCP CUBIC default in Linux, most popular TCP for Web
servers!

<!-- page 22 -->
Please fill the feedback form.

<!-- page 23 -->
Thanks
for
watching!

### L12 · Elastic Load Balancing (ELB), Network Load Balancer (NLB), Application Load Bala ... (16 Sep 2026)
_Topics: Cloud Networking, Elastic Load Balancing (ELB), Network Load Balancer (NLB), Application Load Balancer (ALB), Target Groups, EC2 Targets, Auto Scaling, High Availability_

#### Cloud Load Balancing — ALB vs. NLB, Elastic Load Balancing, and High Availability.pdf

<!-- page 1 -->
Cloud Load Balancing:
ALB vs. NLB, Elastic
Load Balancing, and
High Availability

<!-- page 2 -->
Join the lecture online on your dashboard

<!-- page 3 -->
TCP Congestion Control
TCP is a polite driver.
Its mission: Get your data to its destination as fast as possible, but without
causing a traffic jam for everyone else.
Recap

<!-- page 4 -->
Imagine:
10,000 users are trying to access
your website.
One server suddenly crashes.
Can Our Website Survive the Internet

<!-- page 5 -->
Load Balancer
A load balancer distributes incoming network
traffic across multiple servers to ensure high
availability, reliability, scalability, and optimal
application performance.

<!-- page 6 -->
Load Balancer
On the basis of two approaches:
How load balancer makes its decision
Network Load Balancer
Application Load Balancer

<!-- page 7 -->
Network Load Balancer(NLB)
NLB = Network Load Balancer operating at Transport Layer.
It sees TCP/UDP packets — not HTTP requests, not URLs, not headers.
Analogy: A postal sorter who reads only the ZIP code, not the letter inside.
Recap: The Transport Tuple
A TCP/UDP connection is identified by a 4-tuple: Source IP,
Source Port, Destination IP, Destination Port.

<!-- page 8 -->
Network Load Balancer(NLB)

<!-- page 9 -->
Network Load Balancer(NLB)
Benefits
Ultra-high throughput
Very low latency
Preserves client source IP
Excellent for TCP/UDP workloads
Limitations
Suppose we have:
 
Can NLB distinguish them
 
company.com/api/users
company.com/images/logo.png
Because NLB cannot read URL

<!-- page 10 -->
Application Load Balancer(ALB)
ALB = Application Load Balancer
operates at Application Layer.
ALB understands 
HTTP Requests
URLs
Headers
Cookies
Host Names

<!-- page 11 -->
Application Load Balancer(ALB)

<!-- page 12 -->
TLS Termination
HTTPS requires:
TLS Handshake
Encryption
Certificates
         ALB can handle this.
Client
  │ HTTPS
  ▼
 ALB
(TLS Termination)
  │ HTTP
  ▼
Backend

<!-- page 13 -->
Feature
NLB
ALB
Layer
4
7
TCP/UDP
Yes
No
HTTP Aware
No
Yes
URL Routing
No
Yes
Header Inspection
No
Yes
TLS Termination
Limited
Yes
Source IP Preservation
Yes
Usually via headers
Latency
Lowest
Slightly higher
NLB vs ALB

<!-- page 14 -->
Problem
If server S1 crashes,
how does the load balancer know not to send
traffic there?

<!-- page 15 -->
Target Group 
The Target Group acts as the health-
monitoring layer between the Load
Balancer and the servers, allowing the
Load Balancer to know which servers
are healthy and which should be
avoided.

<!-- page 16 -->
Health Checks
The Load Balancer periodically sends test requests to targets.
       Example: GET /health, every: 30 sec
Step-by-step
1. LB sends probe
2. Server responds
3. LB marks Healthy
4. Traffic continues

<!-- page 17 -->
Automatic Removal (Self-Healing)
Traffic no longer goes to unhealthy server.

<!-- page 18 -->
From self healing to scalability
Health Checks
     ↓
Remove Failed Servers
     ↓
Self-Healing
But a new challenge appears:
Morning Traffic  = 500 Users
Evening Traffic  = 50,000 Users
Question:
Should we keep 100 servers running all day?
No.
Elasticity
Elasticity means:
Increase capacity when demand
rises
Decrease capacity when demand
falls

<!-- page 19 -->
Elasticity

<!-- page 20 -->
Auto Scaling Group
An Auto Scaling Group automatically: Launches instances
                                                                   Terminates instances
                                                                  Maintains desired capacity
When traffic increases suddenly:
Scaling Out
Before       After 
EC2-1         EC2-1
                   EC2-2
                   EC2-3

<!-- page 21 -->
Problem — Data Center Failure
Suppose all servers are in: us-east-1a
Everything works until:
Power Failure
Network Failure
Storage Failure
Entire application is down.

<!-- page 22 -->
Availability Zone
An Availability Zone (AZ) is: A
physically 
separate 
AWS 
data
center.
Example:
us-east-1a
us-east-1b        Each AZ is isolated
us-east-1c

<!-- page 23 -->
Multi-Availability Zones

<!-- page 24 -->
High Availability
High Availability means:  Service remains available even when components fail.
Principle
No Single Point of Failure
Examples
❌ One server
❌ One AZ
❌ One database
Question:
What if the load balancer itself fails?
Answer:
ALB is managed by AWS
and deployed across multiple AZs

<!-- page 25 -->
High Availability

<!-- page 26 -->
Final Architecture Diagram

<!-- page 27 -->
Please fill the feedback form.

<!-- page 28 -->
Thank You

### L13 · IPv4, IP Address (21 Sep 2026)
_Topics: IP Address, IPv4_

#### Addressing the World IPv4, Classful History, and CIDR.pdf

<!-- page 1 -->
Addressing the World IPv4,
Classful History, and CIDR
Computer Networks
1

<!-- page 2 -->
2
Join the lecture online on your dashboard

<!-- page 3 -->
3
Network Layer: IP Addressing

<!-- page 4 -->
Users
Load Balancer
Servers
4
Recap
Internet

<!-- page 5 -->
5
Recap

<!-- page 6 -->
6
IP Address
An IP address is a unique identifier
assigned to each device connected
to the internet or a local network.
“IP” stands for “Internet Protocol,”
the set of rules for sending data
between devices on networks.

<!-- page 7 -->
7
IPv4 Addressing 
Think of the IPv4 address as a simple, four-part postal code:
[Country Code].[State Code].[City Code].[Street Number].

<!-- page 8 -->
The first major version, which still
powers most of the internet today.
Structure: A 32-bit number.
Format: Represented as four 8-bit
numbers (octets), separated by dots.
Example: 192.168.1.1
Each of the four numbers can range
from 0 to 255.
IPv4 Addressing 
8

<!-- page 9 -->
9
History of IPv4 address management

<!-- page 10 -->
10
History of
IPv4 Address
Classes
"The city model is divided
into three structured zones:
A (Massive districts for
giant developments), B
(Medium districts for mid-
sized projects), and C
(Small plots for local use)."

<!-- page 11 -->
IPv4 Address Classes A, B and C
11
172.16.1.10
Network ID
Host ID

<!-- page 12 -->
Class
Bit Allocation (32 bits total)
A
0NNNNNNN.HHHHHHHH.HHHHHHHH.HHHHHHHH (1 bit
class ID + 7 network bits + 24 host bits)
Range: 0.0.0.0 to 127.255.255.255 Networks: ~128 | Hosts
per network: ~16.7 million
B
10NNNNNN.NNNNNNNN.HHHHHHHH.HHHHHHHH (2 bits
class ID + 14 network bits + 16 host bits)
Range: 128.0.0.0 to 191.255.255.255 Networks: ~16,000 |
Hosts per network: ~65,000
C
110NNNNN.NNNNNNNN.NNNNNNNN.HHHHHHHH (3 bits
class ID + 21 network bits + 8 host bits)
Range: 192.0.0.0 to 223.255.255.255 Networks: ~2 million |
Hosts per network: 254
12
Classful IPv4
addresses
"The classes had a
significant amount of
difference in available IP
addresses for hosts. This
meant practically a lot of
IPv4 addresses remained
unassigned"

<!-- page 13 -->
Think about how many potential devices in
a flat Class A network?
13
For class A and Class B, that’s too
many devices to be managed by a
single router!

<!-- page 14 -->
Step 1: Core Router Recognition
Core routers identify 9.10.10.10 belongs to 9.0.0.0 Class A network
Route packet using network ID to appropriate gateway
Step 2: Gateway Router Processing
Gateway router = entry/exit point for specific network
Uses host ID to deliver to final destination
The Journey of a Packet to 9.10.10.10
14
The Scale Problem!
16,777,216 individual IPs in a single Class A network
Way too many devices for one router!

<!-- page 15 -->
The internet grew much faster than anyone
predicted!
A company needing 500 addresses couldn't get a
Class C (too small) and had to take a Class B (with
over 65,000 addresses), wasting the rest.
We were running out of available IPv4 addresses.
In 2025, purchasing a public IPv4 address costs
roughly $20–$45 per address, while leasing can be
done for about $0.40 per IP per month.
The Crisis: The Great Address Shortage!
15

<!-- page 16 -->
16
Solution: Make the routing classless!

<!-- page 17 -->
17
CIDR
Replaces the older Class A, B, C system
Networks can be created based on actual
host requirements instead of wasting large
address blocks.
CIDR makes it easier to divide a network into
smaller subnets as per need
CIDR Format
192.168.0.1/24
Normal IP + "/" + Network Prefix
192.168.0.1 = Network address
/24 = Network prefix (subnet mask)
CIDR: Classless Inter-Domain Routing

<!-- page 18 -->
18
CIDR
CIDR
      Usable Hosts
2^h − 2         h=host bits
192.168.1.0/24
Usable Hosts = 2 - 2 = 254
8
CIDR Base IP
Broadcast IP

<!-- page 19 -->
CIDR Examples 
19
This means you could request an address block of exactly the size you needed, dramatically reducing waste.

<!-- page 20 -->
CIDR
CIDR
20
We need at least 500 IP addresses to connect 500 devices in one subnet

<!-- page 21 -->
Class
Default Subnet Mask with CIDR representations
A
255.0.0.0 (/8)
B
255.255.0.0 (/16)
C
255.255.255.0 (/24)
Traditional network classes and their CIDRs
21

<!-- page 22 -->
Private Addresses: Reusable not Public
22
Private IP addresses are utilized in local
networks like homes and offices.
The same private IP range can be reused
across different networks.
For instance:
Your 
home 
laptop 
might 
have
192.168.1.10.
Another student's laptop in a different
city could also have 192.168.1.10.
Both are valid as they exist in separate
private networks.

<!-- page 23 -->
Cloud bridge: VPCs use the same CIDR math
23

<!-- page 24 -->
Cloud bridge: VPCs use the same CIDR math
24

<!-- page 25 -->
25
Please fill the feedback form.

<!-- page 26 -->
Thank You
26

### L14 · CIDR Notation, Network Layer, Classful (23 Sep 2026)
_Topics: Network Layer, CIDR Notation, Classful_

#### Subnetting in Practice — and Designing an AWS VPC.pdf

<!-- page 1 -->
Subnetting in Practice — and
Designing an AWS VPC
Computer Networks
1

<!-- page 2 -->
2
Join the lecture online on your dashboard

<!-- page 3 -->
3
CIDR
Recap
172.16.1.10
Network ID
Host ID
IP Address

<!-- page 4 -->
4
One large network becomes difficult to
manage

<!-- page 5 -->
Subnetting means splitting one
big 
network 
into 
smaller
networks.
Subnetting = Dividing One Network
5

<!-- page 6 -->
We do subnetting by borrowing
bits from the host part.
CIDR Block has two parts: 
Network Bits + Host Bits
Example: 10.0.0.0/24
/24 means 24 network bits  
32 - 24 = 8 host bits
Borrowing Host Bits
6
Now borrow k host bits for
subnetting.

<!-- page 7 -->
For /26, subnet mask is: 255.255.255.192
Magic number: 256 - 192 = 64
So subnet blocks jump by 64: .0, .64, .128, .192
Magic Number Shortcut
7
Worked example: 10.0.0.0/24 → four /26s
10.0.0.0/26
0-63
10.0.0.64/26
64-127
10.0.0.128/26
128-191
10.0.0.192/26
192-255
Block size = 64
Network addresses jump by 64: .0, .64, .128, .192

<!-- page 8 -->
Subnet
Network
Usable Range
Broadcast
1 10.0.0.0/26
10.0.0.1 – 10.0.0.62
10.0.0.63
2 10.0.0.64/26
10.0.0.65 – 10.0.0.126
10.0.0.127
3 10.0.0.128/26
10.0.0.129 – 10.0.0.190
10.0.0.191
4 10.0.0.192/26
10.0.0.193 – 10.0.0.254
10.0.0.255
Network, Usable Range, Broadcast
8
Four /26 Subnets from 10.0.0.0/24

<!-- page 9 -->
9
Not Every Subnet Should Face the Internet

<!-- page 10 -->
In a VPC, subnets can be public or
private.
A subnet become public  because its
route table has a path to the Internet
Gateway. 
A subnet is private if its route table
does not send:
0.0.0.0/0 → Internet Gateway
Public vs Private Subnets
10

<!-- page 11 -->
Public Subnet → Route Table → IGW → Internet
What Makes a Subnet Public or Private
11
Private Subnet → Route Table → NAT → Internet

<!-- page 12 -->
Web tier: Public subnet
App tier: Private subnet
Database tier: Private subnet
                   
3-Tier Architecture
12

<!-- page 13 -->
Public Entry, Private Data
Public subnet is for controlled entry.
Private subnets protect:
application logic
internal services
databases
corporate data
Why This Keeps Corporate Data Safe
13

<!-- page 14 -->
For availability, repeat the same tiers across at least 2 Availability Zones.
      Example:
 Duplicate Subnets Across Multiple AZs
14

<!-- page 15 -->
15
The AWS Reality — 5 Reserved IPs &
Constraints

<!-- page 16 -->
In normal subnetting, we calculate total addresses.
In AWS, every subnet loses 5 reserved IP addresses. So usable IP count is always:
Total IPs - 5
The AWS Reality: Not All IPs Are Usable
16
Traditional thinking:
/24 → 254 usable hosts
AWS reality:
/24 → 251 usable IPs

<!-- page 17 -->
Demo: AWS Shows Available IPs

<!-- page 18 -->
AWS allows IPv4 CIDR block sizes from: /16 to /28
Largest block: /16 and Smallest block: /28
You cannot create very tiny subnets like /29 or /30
 AWS CIDR Size Limits
18

<!-- page 19 -->
AWS CIDR Size Limits
19

<!-- page 20 -->
Subnet Design Constraints
20

<!-- page 21 -->
21
Please fill the feedback form.

<!-- page 22 -->
Thank You
22

### L15 · AWS VPC, Subnetting (28 Sep 2026)
_Topics: Subnetting, AWS VPC_

#### Lecture 15 — NAT, PAT, DHCP & VPC Routing.pdf

<!-- page 1 -->
NAT, PAT & DHCP — and
How VPC Route Tables
Wire It Together
by Vikas Kumar
CSAI Computer Networks

<!-- page 2 -->
Join the lecture online on your dashboard

<!-- page 3 -->
Recap 
02
Subnetting

<!-- page 4 -->
How Does Your Phone Browse on a Private IP?
Private subnets can't be reached from the Internet.
Yet your phone on home WiFi has a private IP…
…and still loads every website just fine.
02

<!-- page 5 -->
NAT 
Rewriting addresses at the border.

<!-- page 6 -->
What Does NAT Actually Do?
On the way out, the router swaps the private
source IP for a public one.
On the way back, it reverses the swap, restoring
the private IP.
The reply only finds its way home because the router remembers the swap.
05

<!-- page 7 -->
Ten Devices, One Public IP — All at Once?
Everyone streaming, scrolling, gaming — through a single address. How?
03

<!-- page 8 -->
PAT
Rewriting addresses at the border.

<!-- page 9 -->
Add the port number to the translation — not
just the IP.
One public IP can now serve many hosts at
the same time.
This is exactly what your home router
does every second.
Same public IP, a different port each — that is the whole trick.
06
PAT- Port Address Translation

<!-- page 10 -->
What's Inside the Translation Table?
Two hosts reused port 51000 — the outside port is the key that routes each reply home.
07

<!-- page 11 -->
What Do We Gain, What Do We Break?
We gain
Conserves scarce public IPv4 addresses.
Hides internal hosts — a security side-effect.
We break
End-to-end reachability is gone.
Inbound now needs explicit setup.
08

<!-- page 12 -->
Two laptops behind one home IP both open the same
website. What field lets the NAT box tell their replies
apart?
The port number — that's PAT.
09

<!-- page 13 -->
DHCP
Addresses, handed out automatically.

<!-- page 14 -->
Who Configures Every New Device?
Nobody types IP settings by hand. One DHCP lease delivers four things at once:
A lease expires — so addresses get renewed and recycled over time.
11

<!-- page 15 -->
Meet DORA: The Four-Step Handshake
Discover and Request are broadcasts — the whole subnet hears them.
12

<!-- page 16 -->
What Does DORA Look Like on the Wire?
Capture on any subnet and you'll see
the four frames.
Discover and Request go to
255.255.255.255.
The address comes from a Lecture
14 subnet range.
The clearest broadcast handshake you'll capture all term.
13

<!-- page 17 -->
Routing Tables
The decision at every hop.

<!-- page 18 -->
What Is a Route Table, Really?
Just a list: destination prefix → next hop.
The router checks it for every single packet.
The most specific match wins — longest-
prefix match.
No magic — a lookup table the router reads by specificity, top match wins.
15

<!-- page 19 -->
Where Does "Everything Else" Go?
0.0.0.0/0 is the default route — the catch-all.
When prefixes overlap, the longest one wins.
So where does a packet to 10.0.1.55 go?
Specificity beats generality — the longest prefix wins, every time.
16

<!-- page 20 -->
The AWS Picture
IGW, NAT Gateway & VPC route tables.

<!-- page 21 -->
How Does a VPC Touch the Internet (IGW)?
An IGW attaches your VPC to the Internet.
A public subnet routes 0.0.0.0/0 → IGW.
Its instances can be reached both ways.
"Public subnet" simply means: has a route to the IGW.
18

<!-- page 22 -->
How Does a VPC Touch the Internet (IGW)?
"Public subnet" simply means: has a route to the IGW.
18

<!-- page 23 -->
How Does a VPC Touch the Internet (IGW)?
18

<!-- page 24 -->
Outbound Only — The NAT Gateway
The NAT Gateway lives in a public subnet.
A private subnet routes 0.0.0.0/0 → NAT GW.
Instances get updates out — but stay
unreachable in.
Updates flow out; attackers can't flow in.
19

<!-- page 25 -->
Outbound Only — The NAT Gateway
Updates flow out; attackers can't flow in.
19

<!-- page 26 -->
Public vs. Private Route Table — Spot the Difference
Same VPC. One word in one row changes who reaches the Internet — and who reaches you.
20

<!-- page 27 -->
A private-subnet server needs OS updates but must
never accept inbound connections. Which gateway,
and what route?
NAT Gateway · 0.0.0.0/0 → NAT GW
21

<!-- page 28 -->
Activity: Be the NAT Box
Five minutes. One translation table. Everyone plays.

<!-- page 29 -->
Be the NAT Box — Then Break It
1
Cast the room: one NAT router at the board, four inside hosts with private IPs, instructor = the Internet.
2
Each host sends a request card; the NAT student rewrites source → one public IP + a unique port, and logs it.
3
Replies come back to the public IP + port — route each one home using only the table.
4
The twist: reuse a port on purpose → collision → feel exactly why every mapping must be unique.
Same logic you just performed runs as the AWS NAT Gateway in the console.
23

<!-- page 30 -->
Key Takeaways
NAT/PAT lets many private hosts share one public IP by rewriting address + port — the
reason your whole house browses through one ISP address.
DHCP (DORA) auto-leases address + mask + gateway + DNS from your subnet's
range.
In AWS the route table is the switch: 0.0.0.0/0 → IGW makes a subnet public; 0.0.0.0/0 →
NAT GW gives a private subnet outbound-only Internet.
24

<!-- page 31 -->
Next Up: ICMP, then IPv6
We've leaned on ping & traceroute all term — they ride on
ICMP.
Next: ICMP properly, and the diagnostics it
powers.
Then IPv6 — the long-term answer to the exhaustion that
made NAT necessary.
25

<!-- page 32 -->
Please fill the feedback form.

<!-- page 33 -->
Thank You

## Labs
