// Unit data: generated from the authoring builder; plain JSON object literal (valid JS).
window.UNITS = window.UNITS || {};
window.UNITS["unit13"] = {
 "id": "unit13",
 "num": 13,
 "day": 5,
 "title": "IPv4 Addressing, Classful History, CIDR",
 "lectures": "Lecture 13 · SL-L13",
 "overview": "<p>This is the core addressing unit, and its numericals turn up in every exam. You will convert octets to binary, classify addresses (A–E), switch between masks and /prefixes, and find the network, broadcast, first and last host using AND/OR. You will also size a block for N hosts (−2 generic, −5 in AWS) and recognise the RFC 1918 ranges. The extras cover supernetting, the 14-field IPv4 header with a real checksum, fragmentation offsets, and the IPv6 header.</p>",
 "sections": [
  {
   "id": "13-A",
   "title": "What an IP Address Is; IPv4 as 32 Bits in Four Octets",
   "badge": "class",
   "source": "SL-L13 p3–8",
   "covers": [
    "13.1",
    "13.2"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "A postal code for every network interface",
     "html": "<p><b>Analogy (SL-L13 p7).</b> An IPv4 address works like a four-part postal code <i>[Country].[State].[City].[Street number]</i>: the left parts say which region (network) to go to, the last part says which house (host) inside it. Routers far away only read the left part, the way a sorting office in another country only reads the country code.</p><p><b>Definition (SL-L13 p6; RFC 791; Kurose &amp; Ross §4.3.2).</b> An IP address is a unique identifier of a device's network <b>interface</b> on an IP network. IPv4 addresses are <b>32-bit</b> numbers written in <b>dotted-decimal</b>: four 8-bit <b>octets</b>, each 0–255, separated by dots (e.g. 192.168.0.1). A host with one NIC has one address; a router has one address <i>per interface</i>.</p><p><b>Public vs private (p6).</b> In the slide's home network, the laptops are 192.168.0.2, 192.168.0.3 and 192.168.0.100 (private, reused in millions of homes) while the house as a whole appears on the Internet as one <b>public</b> address (68.195.213.248). Private ranges and NAT come back in section 13-D and Unit 15.</p>"
    },
    {
     "type": "figure",
     "caption": "SL-L13 p8: 192.168.0.1 is the 32-bit string 11000000.10101000.00000000.00000001 (first, second, third, fourth octet).",
     "html": "<svg viewBox='0 0 776 62' width='100%' font-family='monospace'><text x='206' y='14' text-anchor='middle' fill='var(--muted)' font-size='11'>octet 1 (bits 0-7)</text><text x='324' y='14' text-anchor='middle' fill='var(--muted)' font-size='11'>octet 2 (bits 8-15)</text><text x='442' y='14' text-anchor='middle' fill='var(--muted)' font-size='11'>octet 3 (bits 16-23)</text><text x='560' y='14' text-anchor='middle' fill='var(--muted)' font-size='11'>octet 4 (bits 24-31)</text><text x='142' y='43' text-anchor='end' fill='currentColor' font-size='12'>192.168.0.1</text><rect x='150' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='156' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='164' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='170' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='178' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='184' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='192' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='198' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='206' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='212' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='220' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='226' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='234' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='240' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='248' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='254' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='268' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='274' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='282' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='288' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='296' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='302' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='310' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='316' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='324' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='330' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='338' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='344' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='352' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='358' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='366' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='372' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='386' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='392' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='400' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='406' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='414' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='420' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='428' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='434' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='442' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='448' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='456' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='462' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='470' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='476' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='484' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='490' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='504' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='510' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='518' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='524' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='532' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='538' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='546' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='552' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='560' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='566' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='574' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='580' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='588' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='594' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='602' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='608' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><text x='626' y='43' fill='currentColor' font-size='12'>= 3,232,235,521</text></svg>"
    },
    {
     "type": "table",
     "head": [
      "Decimal",
      "$2^7$=128",
      "$2^6$=64",
      "$2^5$=32",
      "$2^4$=16",
      "$2^3$=8",
      "$2^2$=4",
      "$2^1$=2",
      "$2^0$=1",
      "Binary"
     ],
     "rows": [
      [
       "192",
       "1",
       "1",
       "0",
       "0",
       "0",
       "0",
       "0",
       "0",
       "11000000"
      ],
      [
       "168",
       "1",
       "0",
       "1",
       "0",
       "1",
       "0",
       "0",
       "0",
       "10101000"
      ],
      [
       "0",
       "0",
       "0",
       "0",
       "0",
       "0",
       "0",
       "0",
       "0",
       "00000000"
      ],
      [
       "1",
       "0",
       "0",
       "0",
       "0",
       "0",
       "0",
       "0",
       "1",
       "00000001"
      ]
     ],
     "caption": "SL-L13 p8 positional-weight table for 192.168.0.1."
    },
    {
     "type": "derivation",
     "title": "Decimal ↔ binary for one octet (168)",
     "steps": [
      {
       "tex": "168 \\ge 128 \\Rightarrow b_7 = 1,\\; 168 - 128 = 40",
       "why": "Subtraction method: take the largest weight that fits, write 1, subtract."
      },
      {
       "tex": "40 < 64 \\Rightarrow b_6 = 0",
       "why": "64 does not fit into the remainder 40, so that bit is 0."
      },
      {
       "tex": "40 \\ge 32 \\Rightarrow b_5 = 1,\\; 40 - 32 = 8",
       "why": "32 fits; remainder 8."
      },
      {
       "tex": "8 < 16 \\Rightarrow b_4 = 0;\\; 8 \\ge 8 \\Rightarrow b_3 = 1,\\; 8-8 = 0",
       "why": "16 does not fit, 8 fits exactly and leaves 0."
      },
      {
       "tex": "b_2 = b_1 = b_0 = 0 \\Rightarrow 168 = 10101000_2",
       "why": "Remainder is 0, so every lower bit is 0; always write all 8 bits."
      },
      {
       "tex": "10101000_2 = 128 + 32 + 8 = 168",
       "why": "Reverse direction: add the weights of the 1-bits."
      },
      {
       "tex": "N_{addr} = 2^{32} = 4{,}294{,}967{,}296",
       "why": "32 independent bits give the total IPv4 address space."
      }
     ]
    },
    {
     "type": "cheat",
     "title": "Binary octets to memorise",
     "items": [
      "Weights: 128 64 32 16 8 4 2 1 (sum = 255)",
      "Mask octets: 128 = 10000000, 192 = 11000000, 224 = 11100000, 240 = 11110000, 248 = 11111000, 252 = 11111100, 254 = 11111110, 255 = 11111111",
      "Each octet is 0–255; an IPv4 address is exactly 32 bits = 4 bytes",
      "Total IPv4 space $2^{32} = 4{,}294{,}967{,}296$ addresses",
      "Dotted → integer: $a\\cdot2^{24} + b\\cdot2^{16} + c\\cdot2^{8} + d$"
     ]
    },
    {
     "type": "worked",
     "title": "Write 172.16.45.200 in binary",
     "tag": "University-Midsem-style",
     "problem": "<p>Convert 172.16.45.200 to its 32-bit binary form, octet by octet.</p>",
     "steps": [
      {
       "tex": "172 = 128 + 32 + 8 + 4 \\Rightarrow 10101100",
       "why": "128 fits (44 left), 64 no, 32 fits (12 left), 16 no, 8 fits (4 left), 4 fits (0 left), 2 no, 1 no."
      },
      {
       "tex": "16 = 16 \\Rightarrow 00010000",
       "why": "Only the 16 weight is used; pad to 8 bits with leading zeros."
      },
      {
       "tex": "45 = 32 + 8 + 4 + 1 \\Rightarrow 00101101",
       "why": "32 fits (13 left), 16 no, 8 fits (5 left), 4 fits (1 left), 2 no, 1 fits."
      },
      {
       "tex": "200 = 128 + 64 + 8 \\Rightarrow 11001000",
       "why": "128 fits (72 left), 64 fits (8 left), 32 no, 16 no, 8 fits (0 left)."
      },
      {
       "text": "Check by adding back: 128+32+8+4 = 172, 16, 32+8+4+1 = 45, 128+64+8 = 200.",
       "why": "Always verify by converting back; it catches a dropped bit."
      }
     ],
     "answer": "<b>10101100.00010000.00101101.11001000</b>"
    },
    {
     "type": "code",
     "file": "Unit13_subnet_calc_bitwise.py",
     "level": "low",
     "title": "dotted_to_int / int_to_dotted / octet_to_binary with shifts and masks",
     "note": "Look at <code>dotted_to_int</code>: <code>value = (value &lt;&lt; 8) | octet</code> is the whole trick."
    },
    {
     "type": "traps",
     "items": [
      "Write <b>all 8 bits</b> of each octet: 1 is 00000001, not 1. Exam strips with 31 bits are wrong.",
      "256 and above are not valid octets; 192.168.1.256 is not an address.",
      "An address belongs to an <b>interface</b>, not to a computer: a router with 3 ports has 3 IP addresses.",
      "The slide's bullet example is 192.168.1.1 but the figure converts 192.168.0.1; both are fine, just do not mix their octets.",
      "Binary 10101000 is 168, not 186 (128+32+8 = 168)."
     ]
    }
   ],
   "practice": [
    {
     "id": "u13-A-1",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "13.2",
     "q": "<p>Convert the octet 11000000 to decimal (integer).</p>",
     "answer": 192,
     "tol": 0,
     "unit": "",
     "verify": "int('11000000',2)",
     "steps": [
      {
       "tex": "1\\cdot128 + 1\\cdot64 = 192",
       "why": "Only the two leftmost bits are 1, with weights 128 and 64."
      }
     ],
     "explain": "<p>11000000 = 128 + 64 = <b>192</b>.</p>"
    },
    {
     "id": "u13-A-2",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "13.2",
     "q": "<p>Convert 10101000 to decimal (integer).</p>",
     "answer": 168,
     "tol": 0,
     "unit": "",
     "verify": "int('10101000',2)",
     "steps": [
      {
       "tex": "128 + 32 + 8 = 168",
       "why": "1-bits sit at weights 128, 32 and 8."
      }
     ],
     "explain": "<p><b>168</b>.</p>"
    },
    {
     "id": "u13-A-3",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "13.2",
     "q": "<p>Write the octet 200 as 8 binary digits.</p>",
     "answer": "11001000",
     "verify": "format(200,'08b')",
     "steps": [
      {
       "tex": "200-128 = 72;\\; 72-64 = 8;\\; 8-8 = 0",
       "why": "Subtract weights 128, 64 and 8; every other bit is 0."
      }
     ],
     "explain": "<p>200 = 128 + 64 + 8, so bits 7, 6 and 3 are set: <b>11001000</b>.</p>"
    },
    {
     "id": "u13-A-4",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "13.2",
     "q": "<p>How many distinct IPv4 addresses exist in total? (integer)</p>",
     "answer": 4294967296,
     "tol": 0,
     "unit": "addresses",
     "verify": "2**32",
     "steps": [
      {
       "tex": "2^{32} = 4{,}294{,}967{,}296",
       "why": "Each of the 32 bits can be 0 or 1 independently."
      }
     ],
     "explain": "<p>$2^{32}$ = <b>4,294,967,296</b>.</p>"
    },
    {
     "id": "u13-A-5",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "13.2",
     "q": "<p>Convert 10.0.0.1 to a single 32-bit unsigned integer (as <code>int(ipaddress.ip_address('10.0.0.1'))</code> would print).</p>",
     "answer": 167772161,
     "tol": 0,
     "unit": "",
     "verify": "10*2**24+0*2**16+0*2**8+1",
     "steps": [
      {
       "tex": "10\\cdot2^{24} = 167{,}772{,}160",
       "why": "The first octet is shifted left by 24 bits."
      },
      {
       "tex": "167{,}772{,}160 + 0 + 0 + 1 = 167{,}772{,}161",
       "why": "Add the other octets times $2^{16}$, $2^{8}$ and 1."
      }
     ],
     "explain": "<p><b>167772161</b>.</p>"
    },
    {
     "id": "u13-A-6",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "13.2",
     "q": "<p>Which of these is a valid IPv4 address?</p>",
     "options": [
      "192.168.1.256",
      "10.0.0.255",
      "172.16.1",
      "300.1.1.1"
     ],
     "answer": 1,
     "why": [
      "256 needs 9 bits; an octet stops at 255.",
      "Four octets, each 0–255: valid (it may be a broadcast address in some subnet, but it is a well-formed address).",
      "Only three octets: 24 bits, not 32.",
      "300 is larger than 255."
     ],
     "explain": "<p>Only <b>10.0.0.255</b> has four octets in 0–255.</p>"
    },
    {
     "id": "u13-A-7",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "13.2",
     "q": "<p>Predict the exact output.</p>",
     "code": "ip = '10.1.2.3'\nprint('.'.join(format(int(o), '08b') for o in ip.split('.')))",
     "answer": "00001010.00000001.00000010.00000011",
     "runCheck": true,
     "explain": "<p><code>format(n,'08b')</code> pads each octet to 8 bits: 10 → 00001010, 1 → 00000001, 2 → 00000010, 3 → 00000011.</p>"
    },
    {
     "id": "u13-A-8",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "13.1",
     "q": "<p>A router connects three LANs. How many IPv4 addresses does the router itself need on those LANs?</p>",
     "options": [
      "1, the router's own address",
      "3, one per interface",
      "0, routers are invisible",
      "2, one public and one private"
     ],
     "answer": 1,
     "why": [
      "Addresses are per interface, not per device.",
      "Each interface sits on a different network and needs an address in it (RFC 791; Kurose &amp; Ross §4.3.2).",
      "Hosts use the router's interface address as their default gateway, so it must exist.",
      "There is no such fixed rule; the count follows the interfaces."
     ],
     "explain": "<p>An IP address names an <b>interface</b>; three interfaces, three addresses.</p>"
    }
   ]
  },
  {
   "id": "13-B",
   "title": "Classful Addressing (A, B, C, D, E) and Why It Failed",
   "badge": "class",
   "source": "SL-L13 p9–15",
   "covers": [
    "13.3",
    "13.4",
    "13.5"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "Three fixed plot sizes in a city",
     "html": "<p><b>Analogy (SL-L13 p10).</b> The city is zoned into only three plot sizes: <b>A</b> (massive districts), <b>B</b> (medium districts) and <b>C</b> (small local plots). You must take one whole plot, even if you need a little more than C offers.</p><p><b>Definition (RFC 791 §2.3, 1981).</b> In <b>classful</b> addressing the leading bits of the first octet fix the class, and the class fixes where the Network ID ends: A = 8 network bits (first bit 0), B = 16 (first bits 10), C = 24 (first bits 110). The network part (minus the class bits) and the host part (minus the all-0 and all-1 host values) give the counts below.</p>"
    },
    {
     "type": "callout",
     "kind": "slidefix",
     "title": "SL-L13 p11 (repeated on SL-L14 p3): the 172.16.1.10 split",
     "html": "<p><b>Slide shows:</b> 172.16.1.10 with Network ID = 172.16.1 and Host ID = 10.</p><p><b>Correct:</b> 172 lies in 128–191 (leading bits 10), so it is <b>Class B</b>: Network ID = <b>172.16</b>, Host ID = <b>1.10</b> (network address 172.16.0.0, default mask 255.255.0.0). The slide's split is a /24 split, which contradicts its own Class B octet diagram (N N H H). Use 172.16 | 1.10 in any classful question.</p>"
    },
    {
     "type": "callout",
     "kind": "slidefix",
     "title": "SL-L13 p12–13: Class B host count",
     "html": "<p><b>Slides show:</b> \"~65,000\" hosts (p12) and \"64,000\" (p13).</p><p><b>Correct:</b> exactly $2^{16} - 2 = $ <b>65,534</b> usable hosts per Class B network (65,536 addresses minus the network and broadcast address). An integer-answer question needs 65,534.</p>"
    },
    {
     "type": "figure",
     "caption": "Bit layout per class (SL-L13 p12): red = fixed class bits, blue = Network ID, amber = Host ID.",
     "html": "<svg viewBox='0 0 776 180' width='100%' font-family='monospace'><text x='206' y='14' text-anchor='middle' fill='var(--muted)' font-size='11'>octet 1 (bits 0-7)</text><text x='324' y='14' text-anchor='middle' fill='var(--muted)' font-size='11'>octet 2 (bits 8-15)</text><text x='442' y='14' text-anchor='middle' fill='var(--muted)' font-size='11'>octet 3 (bits 16-23)</text><text x='560' y='14' text-anchor='middle' fill='var(--muted)' font-size='11'>octet 4 (bits 24-31)</text><text x='142' y='43' text-anchor='end' fill='currentColor' font-size='12'>Class A 10.1.2.3</text><rect x='150' y='26' width='13' height='22' fill='var(--bad)' fill-opacity='0.22' stroke='var(--bad)' stroke-width='1'/><text x='156' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='164' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='170' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='178' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='184' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='192' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='198' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='206' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='212' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='220' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='226' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='234' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='240' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='248' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='254' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='268' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='274' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='282' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='288' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='296' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='302' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='310' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='316' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='324' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='330' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='338' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='344' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='352' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='358' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='366' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='372' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='386' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='392' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='400' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='406' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='414' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='420' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='428' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='434' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='442' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='448' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='456' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='462' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='470' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='476' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='484' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='490' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='504' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='510' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='518' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='524' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='532' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='538' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='546' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='552' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='560' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='566' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='574' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='580' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='588' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='594' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='602' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='608' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><text x='626' y='43' fill='currentColor' font-size='12'>1 + 7 | 24</text><text x='142' y='73' text-anchor='end' fill='currentColor' font-size='12'>Class B 172.16.1.10</text><rect x='150' y='56' width='13' height='22' fill='var(--bad)' fill-opacity='0.22' stroke='var(--bad)' stroke-width='1'/><text x='156' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='164' y='56' width='13' height='22' fill='var(--bad)' fill-opacity='0.22' stroke='var(--bad)' stroke-width='1'/><text x='170' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='178' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='184' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='192' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='198' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='206' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='212' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='220' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='226' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='234' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='240' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='248' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='254' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='268' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='274' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='282' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='288' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='296' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='302' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='310' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='316' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='324' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='330' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='338' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='344' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='352' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='358' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='366' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='372' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='386' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='392' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='400' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='406' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='414' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='420' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='428' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='434' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='442' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='448' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='456' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='462' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='470' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='476' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='484' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='490' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='504' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='510' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='518' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='524' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='532' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='538' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='546' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='552' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='560' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='566' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='574' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='580' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='588' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='594' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='602' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='608' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><text x='626' y='73' fill='currentColor' font-size='12'>2 + 14 | 16</text><text x='142' y='103' text-anchor='end' fill='currentColor' font-size='12'>Class C 192.168.0.1</text><rect x='150' y='86' width='13' height='22' fill='var(--bad)' fill-opacity='0.22' stroke='var(--bad)' stroke-width='1'/><text x='156' y='101' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='164' y='86' width='13' height='22' fill='var(--bad)' fill-opacity='0.22' stroke='var(--bad)' stroke-width='1'/><text x='170' y='101' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='178' y='86' width='13' height='22' fill='var(--bad)' fill-opacity='0.22' stroke='var(--bad)' stroke-width='1'/><text x='184' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='192' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='198' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='206' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='212' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='220' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='226' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='234' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='240' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='248' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='254' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='268' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='274' y='101' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='282' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='288' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='296' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='302' y='101' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='310' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='316' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='324' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='330' y='101' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='338' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='344' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='352' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='358' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='366' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='372' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='386' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='392' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='400' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='406' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='414' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='420' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='428' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='434' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='442' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='448' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='456' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='462' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='470' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='476' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='484' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='490' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='504' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='510' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='518' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='524' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='532' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='538' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='546' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='552' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='560' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='566' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='574' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='580' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='588' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='594' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='602' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='608' y='101' text-anchor='middle' fill='currentColor' font-size='11'>1</text><text x='626' y='103' fill='currentColor' font-size='12'>3 + 21 | 8</text><text x='142' y='133' text-anchor='end' fill='currentColor' font-size='12'>Class D 224.0.0.5</text><rect x='150' y='116' width='13' height='22' fill='var(--bad)' fill-opacity='0.22' stroke='var(--bad)' stroke-width='1'/><text x='156' y='131' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='164' y='116' width='13' height='22' fill='var(--bad)' fill-opacity='0.22' stroke='var(--bad)' stroke-width='1'/><text x='170' y='131' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='178' y='116' width='13' height='22' fill='var(--bad)' fill-opacity='0.22' stroke='var(--bad)' stroke-width='1'/><text x='184' y='131' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='192' y='116' width='13' height='22' fill='var(--bad)' fill-opacity='0.22' stroke='var(--bad)' stroke-width='1'/><text x='198' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='206' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='212' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='220' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='226' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='234' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='240' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='248' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='254' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='268' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='274' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='282' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='288' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='296' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='302' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='310' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='316' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='324' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='330' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='338' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='344' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='352' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='358' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='366' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='372' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='386' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='392' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='400' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='406' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='414' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='420' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='428' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='434' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='442' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='448' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='456' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='462' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='470' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='476' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='484' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='490' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='504' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='510' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='518' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='524' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='532' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='538' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='546' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='552' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='560' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='566' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='574' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='580' y='131' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='588' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='594' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='602' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='608' y='131' text-anchor='middle' fill='currentColor' font-size='11'>1</text><text x='626' y='133' fill='currentColor' font-size='12'>1110 + 28-bit group</text><rect x='150' y='158' width='14' height='14' fill='var(--bad)' fill-opacity='0.22' stroke='var(--bad)'/><text x='170' y='170' fill='currentColor' font-size='12'>class bits</text><rect x='270' y='158' width='14' height='14' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)'/><text x='290' y='170' fill='currentColor' font-size='12'>Network ID bits</text><rect x='430' y='158' width='14' height='14' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)'/><text x='450' y='170' fill='currentColor' font-size='12'>Host ID bits</text></svg>"
    },
    {
     "type": "table",
     "head": [
      "Class",
      "Leading bits",
      "First-octet range",
      "Default mask",
      "Network bits (free)",
      "Host bits",
      "Networks",
      "Usable hosts / network"
     ],
     "rows": [
      [
       "A",
       "0",
       "0–127 (1–126 usable)",
       "255.0.0.0 (/8)",
       "7",
       "24",
       "$2^7 = 128$ (126 usable)",
       "$2^{24}-2 = 16{,}777{,}214$"
      ],
      [
       "B",
       "10",
       "128–191",
       "255.255.0.0 (/16)",
       "14",
       "16",
       "$2^{14} = 16{,}384$",
       "$2^{16}-2 = 65{,}534$"
      ],
      [
       "C",
       "110",
       "192–223",
       "255.255.255.0 (/24)",
       "21",
       "8",
       "$2^{21} = 2{,}097{,}152$",
       "$2^{8}-2 = 254$"
      ],
      [
       "D",
       "1110",
       "224–239",
       "none",
       "n/a",
       "n/a",
       "multicast groups",
       "n/a"
      ],
      [
       "E",
       "1111",
       "240–255",
       "none",
       "n/a",
       "n/a",
       "reserved (experimental)",
       "n/a"
      ]
     ],
     "caption": "SL-L13 p11–13 and p21 with exact counts. 0.x.x.x (\"this network\") and 127.x.x.x (loopback, RFC 1122) are why only 126 Class A networks are usable."
    },
    {
     "type": "callout",
     "kind": "key",
     "title": "Class D and E (note)",
     "html": "<p><b>Class D</b> (224.0.0.0–239.255.255.255, leading bits 1110) is <b>multicast</b>: one address names a group, for example 224.0.0.5 (OSPF routers) or 224.0.0.251 (mDNS). It has no network/host split. <b>Class E</b> (240.0.0.0–255.255.255.255, leading bits 1111) is reserved for experiments; 255.255.255.255 is the limited broadcast address. Neither is assigned to ordinary hosts.</p>"
    },
    {
     "type": "derivation",
     "title": "Networks and hosts per class from the bit split",
     "steps": [
      {
       "tex": "\\text{networks} = 2^{(\\text{network bits}) - (\\text{class bits})}",
       "why": "The class bits are fixed, so only the remaining network bits vary."
      },
      {
       "tex": "\\text{A: } 2^{8-1} = 2^7 = 128 \\;\\Rightarrow\\; 128 - 2 = 126 \\text{ usable}",
       "why": "Network 0 (this network) and 127 (loopback) cannot be assigned."
      },
      {
       "tex": "\\text{B: } 2^{16-2} = 2^{14} = 16{,}384",
       "why": "Two class bits (10) are fixed out of the 16 network bits."
      },
      {
       "tex": "\\text{C: } 2^{24-3} = 2^{21} = 2{,}097{,}152",
       "why": "Three class bits (110) are fixed out of the 24 network bits."
      },
      {
       "tex": "\\text{hosts} = 2^{h} - 2",
       "why": "All-0 host bits = network address, all-1 host bits = broadcast; neither can be a host."
      },
      {
       "tex": "\\text{A: } 2^{24}-2 = 16{,}777{,}214;\\; \\text{B: } 2^{16}-2 = 65{,}534;\\; \\text{C: } 2^{8}-2 = 254",
       "why": "Substitute h = 24, 16, 8."
      }
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "title": "The scale problem: a packet to 9.10.10.10 (SL-L13 p14)",
     "html": "<p>9.10.10.10 belongs to IBM's Class A network 9.0.0.0. <b>Step 1:</b> core routers look only at the Network ID (9) and forward toward IBM's gateway. <b>Step 2:</b> the gateway router uses the Host ID (10.10.10) to deliver inside. But one flat Class A network holds $2^{24} = 16{,}777{,}216$ addresses (16,777,214 usable): far too many devices for one broadcast domain behind one router. Classful addressing gave no way to split it, which is what subnetting (Unit 14) and CIDR fix.</p>"
    },
    {
     "type": "callout",
     "kind": "warning",
     "title": "The crisis: address exhaustion (SL-L13 p15)",
     "html": "<p>A company needing 500 addresses could not use a Class C (254 usable) and had to take a Class B (65,534 usable), wasting $65{,}534 - 500 = 65{,}034$ addresses. Multiply that by thousands of companies and IPv4 ran out: IANA handed out its last free /8 blocks in February 2011. The slide quotes 2025 market prices of roughly USD 20–45 to buy one public IPv4 address and about USD 0.40 per IP per month to lease one.</p>"
    },
    {
     "type": "cheat",
     "title": "Classful in one glance",
     "items": [
      "First octet decides: 0–127 A, 128–191 B, 192–223 C, 224–239 D, 240–255 E",
      "Default masks: A /8 (255.0.0.0), B /16 (255.255.0.0), C /24 (255.255.255.0)",
      "Networks: A $2^7$ (126 usable), B $2^{14}$, C $2^{21}$",
      "Hosts: A 16,777,214; B 65,534; C 254",
      "127.0.0.0/8 = loopback; 224/4 = multicast (D); 240/4 = reserved (E)"
     ]
    },
    {
     "type": "worked",
     "title": "Classful analysis of 172.16.1.10",
     "tag": "University-Midsem-style",
     "problem": "<p>For 172.16.1.10 under classful rules, give the class, Network ID, Host ID, default mask, network address and the number of usable hosts in that network.</p>",
     "steps": [
      {
       "tex": "172 = 10101100_2",
       "why": "Look at the leading bits of the first octet."
      },
      {
       "tex": "\\text{leading bits } 10 \\Rightarrow \\text{Class B}",
       "why": "Equivalently 128 ≤ 172 ≤ 191."
      },
      {
       "text": "Class B uses the first two octets as Network ID: <b>172.16</b>; the last two octets are the Host ID: <b>1.10</b>.",
       "why": "Class B = N N H H (SL-L13 p11 octet grid)."
      },
      {
       "tex": "\\text{mask} = 255.255.0.0 \\;(/16)",
       "why": "Default Class B mask (SL-L13 p21)."
      },
      {
       "tex": "172.16.1.10 \\wedge 255.255.0.0 = 172.16.0.0",
       "why": "AND keeps the network octets and zeroes the host octets."
      },
      {
       "tex": "2^{16} - 2 = 65{,}534",
       "why": "16 host bits minus network and broadcast."
      }
     ],
     "answer": "<b>Class B; Network ID 172.16; Host ID 1.10; mask 255.255.0.0; network 172.16.0.0; 65,534 usable hosts</b> (not the slide's 172.16.1 | 10)."
    },
    {
     "type": "traps",
     "items": [
      "Class is decided by the <b>first octet only</b>: 191.x is B, 192.x is C.",
      "127.x.x.x is loopback, so \"Class A networks\" is 128 by formula but <b>126</b> usable.",
      "Class B hosts = <b>65,534</b>, not 64,000 or 65,536.",
      "\"Number of networks\" in Class B is $2^{14}$, not $2^{16}$: the two class bits are fixed.",
      "Classful default masks are history; a modern address like 172.16.1.10/24 follows its prefix, not its class."
     ]
    }
   ],
   "practice": [
    {
     "id": "u13-B-1",
     "type": "mcq",
     "tag": "GATE-style",
     "topic": "13.3",
     "q": "<p>Under classful rules, what class is 191.255.10.1?</p>",
     "options": [
      "A",
      "B",
      "C",
      "D"
     ],
     "answer": 1,
     "why": [
      "Class A stops at 127.",
      "191 is in 128–191 (191 = 10111111, leading bits 10).",
      "Class C starts at 192.",
      "Class D is 224–239."
     ],
     "explain": "<p>191 = 10111111 starts with 10: <b>Class B</b>.</p>"
    },
    {
     "id": "u13-B-2",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "13.3",
     "q": "<p>Under classful rules, what is the network address of 172.16.1.10? (dotted decimal)</p>",
     "answer": "172.16.0.0",
     "verify": "'172.16.' + str(1 & 0) + '.' + str(10 & 0)",
     "steps": [
      {
       "tex": "172.16.1.10 \\wedge 255.255.0.0",
       "why": "Class B default mask is /16."
      }
     ],
     "explain": "<p>Class B: keep two octets, zero the other two: <b>172.16.0.0</b>. (The slide's 172.16.1 / 10 split is wrong; see the slide-fix box.)</p>"
    },
    {
     "id": "u13-B-3",
     "type": "num",
     "tag": "GATE-style",
     "topic": "13.3",
     "q": "<p>Exactly how many usable host addresses does one Class B network have? (integer)</p>",
     "answer": 65534,
     "tol": 0,
     "unit": "hosts",
     "verify": "2**16-2",
     "steps": [
      {
       "tex": "h = 16",
       "why": "Class B has 16 host bits."
      },
      {
       "tex": "2^{16} - 2 = 65{,}534",
       "why": "Remove the network and broadcast addresses."
      }
     ],
     "explain": "<p><b>65,534</b> (the slides' 64,000 and ~65,000 are approximations).</p>"
    },
    {
     "id": "u13-B-4",
     "type": "num",
     "tag": "GATE-style",
     "topic": "13.3",
     "q": "<p>How many Class C networks exist by the classful formula? (integer)</p>",
     "answer": 2097152,
     "tol": 0,
     "unit": "networks",
     "verify": "2**21",
     "steps": [
      {
       "tex": "24 - 3 = 21",
       "why": "24 network bits minus the 3 fixed class bits 110."
      },
      {
       "tex": "2^{21} = 2{,}097{,}152",
       "why": "Each free bit doubles the count."
      }
     ],
     "explain": "<p><b>2,097,152</b>.</p>"
    },
    {
     "id": "u13-B-5",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "13.3",
     "q": "<p>How many Class A network numbers can actually be assigned (exclude 0 and 127)? (integer)</p>",
     "answer": 126,
     "tol": 0,
     "unit": "networks",
     "verify": "2**7-2",
     "steps": [
      {
       "tex": "2^{7} = 128",
       "why": "7 free network bits after the leading 0."
      },
      {
       "tex": "128 - 2 = 126",
       "why": "0.x.x.x means \"this network\"; 127.x.x.x is loopback."
      }
     ],
     "explain": "<p><b>126</b>.</p>"
    },
    {
     "id": "u13-B-6",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "13.5",
     "q": "<p>A company needs 500 addresses and is given a whole Class B network (SL-L13 p15). How many usable addresses are wasted? (integer)</p>",
     "answer": 65034,
     "tol": 0,
     "unit": "addresses",
     "verify": "2**16-2-500",
     "steps": [
      {
       "tex": "2^{16} - 2 = 65{,}534",
       "why": "Usable addresses in a Class B."
      },
      {
       "tex": "65{,}534 - 500 = 65{,}034",
       "why": "Everything not used by the 500 devices is wasted."
      }
     ],
     "explain": "<p><b>65,034</b> addresses wasted, which is why CIDR was needed.</p>"
    },
    {
     "id": "u13-B-7",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "13.4",
     "q": "<p>A packet is addressed to 9.10.10.10 (IBM's classful network). Which part of the address do the Internet's core routers use to forward it? (SL-L13 p14)</p>",
     "options": [
      "The Host ID 10.10.10",
      "The Network ID 9",
      "The whole 32-bit address, entry by entry",
      "The MAC address of the destination"
     ],
     "answer": 1,
     "why": [
      "The host part is only used by IBM's own gateway router at the last step.",
      "Core routers keep one route per network: 9.0.0.0 is Class A, so they match the network ID 9.",
      "Core tables hold network prefixes, not one entry per host.",
      "MAC addresses never leave the local link."
     ],
     "explain": "<p>Core: <b>network ID</b>; gateway: host ID.</p>"
    },
    {
     "id": "u13-B-8",
     "type": "msq",
     "tag": "GATE-style",
     "topic": "13.3",
     "q": "<p>Select ALL true statements about classful addressing.</p>",
     "options": [
      "A Class C network has 254 usable hosts.",
      "224.0.0.5 is a Class D (multicast) address.",
      "The class of an address is decided by its last octet.",
      "Classful addressing wasted addresses because blocks came in only three sizes.",
      "240.1.2.3 is an ordinary unicast Class C host."
     ],
     "answer": [
      0,
      1,
      3
     ],
     "why": [
      "$2^8-2 = 254$.",
      "224 = 11100000 starts with 1110.",
      "The first octet's leading bits decide.",
      "A 500-host company needed a whole Class B (SL-L13 p15).",
      "240–255 is Class E, reserved."
     ],
     "explain": "<p>Correct: 1, 2 and 4.</p>"
    },
    {
     "id": "u13-B-9",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "13.3",
     "q": "<p>Predict the exact output.</p>",
     "code": "first = 200\nif first >> 7 == 0b0:\n    print('A')\nelif first >> 6 == 0b10:\n    print('B')\nelif first >> 5 == 0b110:\n    print('C')\nelse:\n    print('D or E')",
     "answer": "C",
     "runCheck": true,
     "explain": "<p>200 = 11001000. <code>200 &gt;&gt; 7</code> = 1, so not A; <code>200 &gt;&gt; 6</code> = 3 = 0b11, so not B; <code>200 &gt;&gt; 5</code> = 6 = 0b110, so <b>C</b>.</p>"
    }
   ]
  },
  {
   "id": "13-C",
   "title": "CIDR: Prefixes, Masks, Network / Broadcast / First / Last",
   "badge": "class",
   "source": "SL-L13 p16–19, p21",
   "covers": [
    "13.6",
    "13.7"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "Postal codes of any length",
     "html": "<p><b>Analogy.</b> Classful addressing allowed only three lengths of \"postal code\" (8, 16 or 24 bits). CIDR lets the code be <b>any</b> length: a small office gets a long code (few houses left to number), a big ISP gets a short code (many houses).</p><p><b>Definition (SL-L13 p17; RFC 4632).</b> <b>Classless Inter-Domain Routing</b> writes an address as <code>a.b.c.d/n</code>, where the <b>prefix length</b> $n$ is the number of leading 1-bits in the <b>subnet mask</b>. The first $n$ bits are the Network ID, the remaining $32-n$ bits are the Host ID. Blocks can be sized to need instead of to class.</p>"
    },
    {
     "type": "callout",
     "kind": "slidefix",
     "title": "SL-L13 p17: \"192.168.0.1 = Network address\"",
     "html": "<p><b>Slide shows:</b> in 192.168.0.1/24 the label \"192.168.0.1 = Network address\".</p><p><b>Correct:</b> the <b>network address</b> of 192.168.0.1/24 is <b>192.168.0.0</b> (host bits all 0). 192.168.0.1 is the <b>first usable host</b>. The slide meant \"the IP part of the notation\".</p>"
    },
    {
     "type": "figure",
     "caption": "Bit-level AND / OR for 172.16.45.200/20: Network ID = first 20 bits (blue), Host ID = last 12 bits (amber). AND with the mask zeroes the host bits (network address); OR with the inverted mask sets them to 1 (broadcast).",
     "html": "<svg viewBox='0 0 776 210' width='100%' font-family='monospace'><text x='206' y='14' text-anchor='middle' fill='var(--muted)' font-size='11'>octet 1 (bits 0-7)</text><text x='324' y='14' text-anchor='middle' fill='var(--muted)' font-size='11'>octet 2 (bits 8-15)</text><text x='442' y='14' text-anchor='middle' fill='var(--muted)' font-size='11'>octet 3 (bits 16-23)</text><text x='560' y='14' text-anchor='middle' fill='var(--muted)' font-size='11'>octet 4 (bits 24-31)</text><text x='142' y='43' text-anchor='end' fill='currentColor' font-size='12'>IP 172.16.45.200</text><rect x='150' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='156' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='164' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='170' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='178' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='184' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='192' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='198' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='206' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='212' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='220' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='226' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='234' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='240' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='248' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='254' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='268' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='274' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='282' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='288' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='296' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='302' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='310' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='316' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='324' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='330' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='338' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='344' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='352' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='358' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='366' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='372' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='386' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='392' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='400' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='406' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='414' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='420' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='428' y='26' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='434' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='442' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='448' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='456' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='462' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='470' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='476' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='484' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='490' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='504' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='510' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='518' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='524' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='532' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='538' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='546' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='552' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='560' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='566' y='41' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='574' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='580' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='588' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='594' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='602' y='26' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='608' y='41' text-anchor='middle' fill='currentColor' font-size='11'>0</text><text x='626' y='43' fill='currentColor' font-size='12'>172.16.45.200</text><text x='142' y='73' text-anchor='end' fill='currentColor' font-size='12'>mask /20</text><rect x='150' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='156' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='164' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='170' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='178' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='184' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='192' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='198' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='206' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='212' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='220' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='226' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='234' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='240' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='248' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='254' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='268' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='274' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='282' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='288' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='296' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='302' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='310' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='316' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='324' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='330' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='338' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='344' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='352' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='358' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='366' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='372' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='386' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='392' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='400' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='406' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='414' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='420' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='428' y='56' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='434' y='71' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='442' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='448' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='456' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='462' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='470' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='476' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='484' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='490' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='504' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='510' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='518' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='524' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='532' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='538' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='546' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='552' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='560' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='566' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='574' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='580' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='588' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='594' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='602' y='56' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='608' y='71' text-anchor='middle' fill='currentColor' font-size='11'>0</text><text x='626' y='73' fill='currentColor' font-size='12'>255.255.240.0</text><text x='142' y='103' text-anchor='end' fill='currentColor' font-size='12'>IP AND mask</text><rect x='150' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='156' y='101' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='164' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='170' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='178' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='184' y='101' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='192' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='198' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='206' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='212' y='101' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='220' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='226' y='101' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='234' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='240' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='248' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='254' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='268' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='274' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='282' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='288' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='296' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='302' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='310' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='316' y='101' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='324' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='330' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='338' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='344' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='352' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='358' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='366' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='372' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='386' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='392' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='400' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='406' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='414' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='420' y='101' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='428' y='86' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='434' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='442' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='448' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='456' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='462' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='470' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='476' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='484' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='490' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='504' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='510' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='518' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='524' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='532' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='538' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='546' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='552' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='560' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='566' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='574' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='580' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='588' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='594' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='602' y='86' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='608' y='101' text-anchor='middle' fill='currentColor' font-size='11'>0</text><text x='626' y='103' fill='currentColor' font-size='12'>network 172.16.32.0</text><text x='142' y='133' text-anchor='end' fill='currentColor' font-size='12'>wildcard ~mask</text><rect x='150' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='156' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='164' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='170' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='178' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='184' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='192' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='198' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='206' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='212' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='220' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='226' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='234' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='240' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='248' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='254' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='268' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='274' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='282' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='288' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='296' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='302' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='310' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='316' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='324' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='330' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='338' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='344' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='352' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='358' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='366' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='372' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='386' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='392' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='400' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='406' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='414' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='420' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='428' y='116' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='434' y='131' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='442' y='116' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='448' y='131' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='456' y='116' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='462' y='131' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='470' y='116' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='476' y='131' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='484' y='116' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='490' y='131' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='504' y='116' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='510' y='131' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='518' y='116' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='524' y='131' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='532' y='116' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='538' y='131' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='546' y='116' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='552' y='131' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='560' y='116' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='566' y='131' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='574' y='116' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='580' y='131' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='588' y='116' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='594' y='131' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='602' y='116' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='608' y='131' text-anchor='middle' fill='currentColor' font-size='11'>1</text><text x='626' y='133' fill='currentColor' font-size='12'>0.0.15.255</text><text x='142' y='163' text-anchor='end' fill='currentColor' font-size='12'>net OR ~mask</text><rect x='150' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='156' y='161' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='164' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='170' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='178' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='184' y='161' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='192' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='198' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='206' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='212' y='161' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='220' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='226' y='161' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='234' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='240' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='248' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='254' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='268' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='274' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='282' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='288' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='296' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='302' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='310' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='316' y='161' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='324' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='330' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='338' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='344' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='352' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='358' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='366' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='372' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='386' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='392' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='400' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='406' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='414' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='420' y='161' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='428' y='146' width='13' height='22' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)' stroke-width='1'/><text x='434' y='161' text-anchor='middle' fill='currentColor' font-size='11'>0</text><rect x='442' y='146' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='448' y='161' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='456' y='146' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='462' y='161' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='470' y='146' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='476' y='161' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='484' y='146' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='490' y='161' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='504' y='146' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='510' y='161' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='518' y='146' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='524' y='161' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='532' y='146' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='538' y='161' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='546' y='146' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='552' y='161' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='560' y='146' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='566' y='161' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='574' y='146' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='580' y='161' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='588' y='146' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='594' y='161' text-anchor='middle' fill='currentColor' font-size='11'>1</text><rect x='602' y='146' width='13' height='22' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)' stroke-width='1'/><text x='608' y='161' text-anchor='middle' fill='currentColor' font-size='11'>1</text><text x='626' y='163' fill='currentColor' font-size='12'>broadcast 172.16.47.255</text><rect x='150' y='188' width='14' height='14' fill='var(--accent)' fill-opacity='0.22' stroke='var(--accent)'/><text x='170' y='200' fill='currentColor' font-size='12'>Network ID bits</text><rect x='310' y='188' width='14' height='14' fill='var(--warn)' fill-opacity='0.22' stroke='var(--warn)'/><text x='330' y='200' fill='currentColor' font-size='12'>Host ID bits</text></svg>"
    },
    {
     "type": "derivation",
     "title": "The four addresses of any block",
     "steps": [
      {
       "tex": "\\text{mask} = \\underbrace{1\\cdots1}_{n}\\underbrace{0\\cdots0}_{32-n}",
       "why": "/n means n leading ones (SL-L13 p18: \"number of 1's\")."
      },
      {
       "tex": "\\text{network} = \\text{IP} \\wedge \\text{mask}",
       "why": "AND keeps the n network bits and forces every host bit to 0."
      },
      {
       "tex": "\\text{broadcast} = \\text{network} \\vee \\overline{\\text{mask}}",
       "why": "OR with the wildcard (inverted mask) forces every host bit to 1."
      },
      {
       "tex": "\\text{first} = \\text{network} + 1,\\quad \\text{last} = \\text{broadcast} - 1",
       "why": "All-0 and all-1 host values are reserved; usable hosts lie strictly between them."
      },
      {
       "tex": "\\text{total} = 2^{32-n},\\quad \\text{usable} = 2^{32-n} - 2",
       "why": "h = 32 − n host bits; subtract network and broadcast (SL-L13 p18)."
      },
      {
       "tex": "/24:\\; 2^{8} - 2 = 254",
       "why": "SL-L13 p18 example 192.168.1.0/24."
      }
     ]
    },
    {
     "type": "table",
     "head": [
      "Prefix",
      "Dotted mask",
      "Block size (magic number)",
      "Total addresses $2^{32-n}$",
      "Usable hosts $2^{32-n}-2$"
     ],
     "rows": [
      [
       "/8",
       "255.0.0.0",
       "1 in octet 1",
       "16,777,216",
       "16,777,214"
      ],
      [
       "/9",
       "255.128.0.0",
       "128 in octet 2",
       "8,388,608",
       "8,388,606"
      ],
      [
       "/10",
       "255.192.0.0",
       "64 in octet 2",
       "4,194,304",
       "4,194,302"
      ],
      [
       "/11",
       "255.224.0.0",
       "32 in octet 2",
       "2,097,152",
       "2,097,150"
      ],
      [
       "/12",
       "255.240.0.0",
       "16 in octet 2",
       "1,048,576",
       "1,048,574"
      ],
      [
       "/13",
       "255.248.0.0",
       "8 in octet 2",
       "524,288",
       "524,286"
      ],
      [
       "/14",
       "255.252.0.0",
       "4 in octet 2",
       "262,144",
       "262,142"
      ],
      [
       "/15",
       "255.254.0.0",
       "2 in octet 2",
       "131,072",
       "131,070"
      ],
      [
       "/16",
       "255.255.0.0",
       "1 in octet 2",
       "65,536",
       "65,534"
      ],
      [
       "/17",
       "255.255.128.0",
       "128 in octet 3",
       "32,768",
       "32,766"
      ],
      [
       "/18",
       "255.255.192.0",
       "64 in octet 3",
       "16,384",
       "16,382"
      ],
      [
       "/19",
       "255.255.224.0",
       "32 in octet 3",
       "8,192",
       "8,190"
      ],
      [
       "/20",
       "255.255.240.0",
       "16 in octet 3",
       "4,096",
       "4,094"
      ],
      [
       "/21",
       "255.255.248.0",
       "8 in octet 3",
       "2,048",
       "2,046"
      ],
      [
       "/22",
       "255.255.252.0",
       "4 in octet 3",
       "1,024",
       "1,022"
      ],
      [
       "/23",
       "255.255.254.0",
       "2 in octet 3",
       "512",
       "510"
      ],
      [
       "/24",
       "255.255.255.0",
       "1 in octet 3",
       "256",
       "254"
      ],
      [
       "/25",
       "255.255.255.128",
       "128 in octet 4",
       "128",
       "126"
      ],
      [
       "/26",
       "255.255.255.192",
       "64 in octet 4",
       "64",
       "62"
      ],
      [
       "/27",
       "255.255.255.224",
       "32 in octet 4",
       "32",
       "30"
      ],
      [
       "/28",
       "255.255.255.240",
       "16 in octet 4",
       "16",
       "14"
      ],
      [
       "/29",
       "255.255.255.248",
       "8 in octet 4",
       "8",
       "6"
      ],
      [
       "/30",
       "255.255.255.252",
       "4 in octet 4",
       "4",
       "2"
      ],
      [
       "/31",
       "255.255.255.254",
       "2 in octet 4",
       "2",
       "0 classic; 2 on point-to-point links (RFC 3021)"
      ],
      [
       "/32",
       "255.255.255.255",
       "1 (one address)",
       "1",
       "1 (single-host route)"
      ]
     ],
     "caption": "Full CIDR table /8 to /32 (SL-L13 p19 lists /8, /12, /16, /24, /25, /26, /27, /32). Block size = how far apart consecutive networks start in the octet where the mask boundary falls."
    },
    {
     "type": "table",
     "head": [
      "CIDR",
      "Network",
      "Mask",
      "First usable",
      "Last usable",
      "Usable hosts",
      "Use case (slide)"
     ],
     "rows": [
      [
       "10.0.0.0/8",
       "10.0.0.0",
       "255.0.0.0",
       "10.0.0.1",
       "10.255.255.254",
       "16,777,214",
       "Large enterprise"
      ],
      [
       "172.16.0.0/12",
       "172.16.0.0",
       "255.240.0.0",
       "172.16.0.1",
       "172.31.255.254",
       "1,048,574",
       "Medium enterprise"
      ],
      [
       "192.168.0.0/16",
       "192.168.0.0",
       "255.255.0.0",
       "192.168.0.1",
       "192.168.255.254",
       "65,534",
       "Large home/office"
      ],
      [
       "192.168.1.0/24",
       "192.168.1.0",
       "255.255.255.0",
       "192.168.1.1",
       "192.168.1.254",
       "254",
       "Home / small office"
      ],
      [
       "192.168.1.0/25",
       "192.168.1.0",
       "255.255.255.128",
       "192.168.1.1",
       "192.168.1.126",
       "126",
       "Small office subnet"
      ],
      [
       "192.168.1.0/26",
       "192.168.1.0",
       "255.255.255.192",
       "192.168.1.1",
       "192.168.1.62",
       "62",
       "Department"
      ],
      [
       "192.168.1.0/27",
       "192.168.1.0",
       "255.255.255.224",
       "192.168.1.1",
       "192.168.1.30",
       "30",
       "Small team"
      ],
      [
       "192.168.1.100/32",
       "192.168.1.100",
       "255.255.255.255",
       "192.168.1.100",
       "192.168.1.100",
       "1",
       "Single host route"
      ]
     ],
     "caption": "SL-L13 p19 examples, all verified with Python <code>ipaddress</code>. The slide calls /32 \"loopback\"; strictly, loopback is 127.0.0.0/8 and /32 is just a one-address (host) route."
    },
    {
     "type": "cheat",
     "title": "CIDR formulas",
     "items": [
      "$h = 32 - n$; total $= 2^{h}$; usable $= 2^{h} - 2$",
      "network = IP AND mask; broadcast = network OR NOT mask",
      "first = network + 1; last = broadcast − 1",
      "Prefix from mask: count the 1s (255.255.255.192 → 24 + 2 = /26)",
      "Classful defaults as CIDR: A /8, B /16, C /24 (SL-L13 p21)",
      "Block size in the boundary octet = 256 − mask octet (e.g. /20: 256 − 240 = 16)"
     ]
    },
    {
     "type": "worked",
     "title": "172.16.45.200/20: mask, network, broadcast, first, last, usable",
     "tag": "GATE-style",
     "problem": "<p>A host has address 172.16.45.200/20. Find the subnet mask, network address, broadcast address, first and last usable host, and the number of usable hosts.</p>",
     "steps": [
      {
       "tex": "20 = 8 + 8 + 4 \\Rightarrow \\text{mask} = 255.255.240.0",
       "why": "Two full octets of ones, then 4 ones = 11110000 = 240 in the third octet."
      },
      {
       "tex": "\\text{boundary octet: } 45 = 00101101_2,\\; 240 = 11110000_2",
       "why": "Only the third octet is cut by the mask; octets 1–2 are copied, octet 4 is all host bits."
      },
      {
       "tex": "00101101 \\wedge 11110000 = 00100000 = 32",
       "why": "AND keeps the top 4 bits of 45."
      },
      {
       "tex": "\\text{network} = 172.16.32.0",
       "why": "Host bits (low 4 bits of octet 3 and all of octet 4) set to 0."
      },
      {
       "tex": "00100000 \\vee 00001111 = 00101111 = 47",
       "why": "OR with the wildcard 0.0.15.255 sets the low 4 bits."
      },
      {
       "tex": "\\text{broadcast} = 172.16.47.255",
       "why": "Octet 4 host bits all 1 = 255."
      },
      {
       "tex": "\\text{first} = 172.16.32.1,\\; \\text{last} = 172.16.47.254",
       "why": "network + 1 and broadcast − 1."
      },
      {
       "tex": "2^{32-20} - 2 = 4096 - 2 = 4094",
       "why": "12 host bits."
      },
      {
       "text": "Shortcut check: block size 256 − 240 = 16 in octet 3; multiples of 16 are 0, 16, 32, 48, so 45 lies in the 32 block (32–47).",
       "why": "The magic number gives the same answer without binary."
      }
     ],
     "answer": "<b>Mask 255.255.240.0; network 172.16.32.0; broadcast 172.16.47.255; first 172.16.32.1; last 172.16.47.254; 4,094 usable hosts.</b>"
    },
    {
     "type": "code",
     "file": "Unit13_subnet_calc_bitwise.py",
     "level": "low",
     "title": "cidr_info(): network = ip &amp; mask, broadcast = network | ~mask, from scratch"
    },
    {
     "type": "code",
     "file": "Unit13_ipaddress_struct.py",
     "level": "high",
     "title": "The same answers with ipaddress.ip_network, hosts(), netmask, broadcast_address",
     "note": "<code>ip_network('192.168.1.0/23')</code> raises <code>ValueError: has host bits set</code>; pass <code>strict=False</code> to have the library AND the mask for you."
    },
    {
     "type": "traps",
     "items": [
      "The network address is <b>not</b> the address you were given unless all its host bits are already 0 (slide fix: 192.168.0.1/24 lives in 192.168.0.0).",
      "Usable is $2^{h}-2$, total is $2^{h}$: read whether the question says \"addresses\" or \"hosts\".",
      "255.255.255.250 is <b>not</b> a valid mask: the ones must be contiguous (250 = 11111010).",
      "For /12 the boundary is in the <b>second</b> octet: 172.16.0.0/12 runs to 172.31.255.255.",
      "/31 and /32 break the −2 rule: /32 is one host; /31 has 2 addresses usable only on point-to-point links (RFC 3021)."
     ]
    }
   ],
   "practice": [
    {
     "id": "u13-C-1",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "13.6",
     "q": "<p>Write the subnet mask for /20 in dotted decimal.</p>",
     "answer": "255.255.240.0",
     "verify": "'255.255.' + str(256 - 2**(32-20-8)) + '.0'",
     "steps": [
      {
       "tex": "20 - 16 = 4 \\text{ ones in octet 3}",
       "why": "Octets 1 and 2 are full."
      },
      {
       "tex": "11110000_2 = 240",
       "why": "128 + 64 + 32 + 16."
      }
     ],
     "explain": "<p>20 = 16 + 4: two octets of 255, then 11110000 = 240: <b>255.255.240.0</b>.</p>"
    },
    {
     "id": "u13-C-2",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "13.6",
     "q": "<p>What prefix length corresponds to the mask 255.255.255.224? (integer)</p>",
     "answer": 27,
     "tol": 0,
     "unit": "",
     "verify": "24 + bin(224).count('1')",
     "steps": [
      {
       "tex": "224 = 11100000_2",
       "why": "Three 1-bits in the last octet."
      },
      {
       "tex": "8+8+8+3 = 27",
       "why": "Count every 1 in the mask."
      }
     ],
     "explain": "<p><b>/27</b>.</p>"
    },
    {
     "id": "u13-C-3",
     "type": "num",
     "tag": "GATE-style",
     "topic": "13.7",
     "q": "<p>How many usable host addresses does a /27 block have (generic −2 rule)? (integer)</p>",
     "answer": 30,
     "tol": 0,
     "unit": "hosts",
     "verify": "2**(32-27)-2",
     "steps": [
      {
       "tex": "h = 32-27 = 5",
       "why": "Host bits."
      },
      {
       "tex": "2^5 - 2 = 30",
       "why": "Remove network and broadcast."
      }
     ],
     "explain": "<p><b>30</b>.</p>"
    },
    {
     "id": "u13-C-4",
     "type": "text",
     "tag": "GATE-style",
     "topic": "13.6",
     "q": "<p>Find the network address of 10.45.130.77/18 (dotted decimal).</p>",
     "answer": "10.45.128.0",
     "verify": "'10.45.' + str(130 & 192) + '.0'",
     "steps": [
      {
       "tex": "/18 \\Rightarrow 255.255.192.0",
       "why": "18 = 16 + 2 ones in octet 3: 11000000 = 192."
      },
      {
       "tex": "130 \\wedge 192 = 128",
       "why": "10000010 AND 11000000 = 10000000."
      },
      {
       "tex": "\\text{octet 4} \\wedge 0 = 0",
       "why": "Octet 4 is entirely host bits."
      }
     ],
     "explain": "<p>/18: mask 255.255.192.0. 130 = 10000010 AND 11000000 = 10000000 = 128, so <b>10.45.128.0</b>.</p>"
    },
    {
     "id": "u13-C-5",
     "type": "text",
     "tag": "GATE-style",
     "topic": "13.6",
     "q": "<p>Find the broadcast address of 10.45.130.77/18 (dotted decimal).</p>",
     "answer": "10.45.191.255",
     "verify": "'10.45.' + str((130 & 192) | 63) + '.255'",
     "steps": [
      {
       "tex": "\\overline{mask} = 0.0.63.255",
       "why": "Invert 255.255.192.0."
      },
      {
       "tex": "128 \\vee 63 = 191",
       "why": "10000000 OR 00111111 = 10111111."
      }
     ],
     "explain": "<p>Network 10.45.128.0; wildcard 0.0.63.255; 128 OR 63 = 191, so <b>10.45.191.255</b>.</p>"
    },
    {
     "id": "u13-C-6",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "13.6",
     "q": "<p>For 192.168.0.1/24, which is the <b>network address</b>?</p>",
     "options": [
      "192.168.0.1",
      "192.168.0.0",
      "192.168.0.255",
      "192.168.1.0"
     ],
     "answer": 1,
     "why": [
      "That is the first usable host; SL-L13 p17 mislabels it.",
      "Host bits (last octet) all 0: the network address.",
      "Host bits all 1: the broadcast address.",
      "That is a different /24 network."
     ],
     "explain": "<p><b>192.168.0.0</b> (slide fix B6).</p>"
    },
    {
     "id": "u13-C-7",
     "type": "msq",
     "tag": "GATE-style",
     "topic": "13.6",
     "q": "<p>Select ALL valid IPv4 subnet masks.</p>",
     "options": [
      "255.255.248.0",
      "255.255.0.255",
      "255.255.255.252",
      "255.255.255.250",
      "255.192.0.0"
     ],
     "answer": [
      0,
      2,
      4
     ],
     "why": [
      "248 = 11111000: contiguous ones, /21.",
      "Ones after zeros: not contiguous.",
      "252 = 11111100: /30.",
      "250 = 11111010: a 0 between 1s.",
      "192 = 11000000 in octet 2: /10."
     ],
     "explain": "<p>Valid: 255.255.248.0 (/21), 255.255.255.252 (/30), 255.192.0.0 (/10).</p>"
    },
    {
     "id": "u13-C-8",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "13.7",
     "q": "<p>How many addresses (total, not usable) are in 172.16.0.0/12? (integer)</p>",
     "answer": 1048576,
     "tol": 0,
     "unit": "addresses",
     "verify": "2**(32-12)",
     "steps": [
      {
       "tex": "h = 20",
       "why": "32 − 12."
      },
      {
       "tex": "2^{20} = 1{,}048{,}576",
       "why": "Total addresses; usable would be 1,048,574 (SL-L13 p19)."
      }
     ],
     "explain": "<p><b>1,048,576</b>.</p>"
    },
    {
     "id": "u13-C-9",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "13.6",
     "q": "<p>In 192.168.1.0/25, what is the last octet of the <b>last usable</b> host? (integer)</p>",
     "answer": 126,
     "tol": 0,
     "unit": "",
     "verify": "2**(32-25)-2",
     "steps": [
      {
       "tex": "2^{7} = 128 \\text{ addresses: } .0\\text{ to }.127",
       "why": "/25 has 7 host bits."
      },
      {
       "tex": "127 - 1 = 126",
       "why": "Broadcast is .127, so last usable is .126."
      }
     ],
     "explain": "<p><b>126</b> (192.168.1.126, SL-L13 p19).</p>"
    },
    {
     "id": "u13-C-10",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "13.6",
     "q": "<p>Predict the exact output.</p>",
     "code": "import ipaddress\nn = ipaddress.ip_network('192.168.1.64/26')\nprint(n.broadcast_address, n.num_addresses - 2)",
     "answer": "192.168.1.127 62",
     "runCheck": true,
     "explain": "<p>/26 = 64 addresses from .64: broadcast .127; usable 64 − 2 = 62.</p>"
    },
    {
     "id": "u13-C-11",
     "type": "write",
     "tag": "University-Midsem-style",
     "topic": "13.6",
     "q": "<p>Write <code>cidr_info(cidr)</code> using only bitwise operators (no <code>ipaddress</code>) that returns the mask, network, broadcast, first, last and usable count for a string like <code>'172.16.45.200/20'</code>.</p>",
     "starter": "def cidr_info(cidr):\n    # split, convert the dotted quad to an int, build the mask with shifts\n    pass\n",
     "solutionFile": "Unit13_subnet_calc_bitwise.py",
     "rubric": [
      "Builds the mask as <code>(0xFFFFFFFF &lt;&lt; (32-n)) &amp; 0xFFFFFFFF</code>",
      "network = ip &amp; mask; broadcast = network | (~mask &amp; 0xFFFFFFFF)",
      "Converts back with shifts by 24, 16, 8, 0 and &amp; 0xFF",
      "Returns 172.16.32.0 / 172.16.47.255 / 4094 for the worked example"
     ],
     "explain": "<p>See <code>cidr_info</code> in the model solution.</p>"
    }
   ]
  },
  {
   "id": "13-D",
   "title": "Sizing a Network for N Hosts; RFC 1918 Private Ranges; VPC Math",
   "badge": "class",
   "source": "SL-L13 p20–24",
   "covers": [
    "13.8",
    "13.9",
    "13.10"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "Buy the smallest box that fits",
     "html": "<p><b>Analogy.</b> Address blocks only come in power-of-two sizes (2, 4, 8, 16, 32, 64, 128, 256, 512, 1024). To pack 500 devices you need the smallest box that holds 500 devices <i>plus</i> the two reserved labels (network and broadcast): 512.</p><p><b>Rule (SL-L13 p20).</b> Find the smallest number of host bits $h$ with $2^{h} - 2 \\ge N$; the prefix is $/(32-h)$. <b>RFC 1918</b> sets aside three ranges that anyone may use privately (never routed on the public Internet): 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16. An AWS VPC is just such a private CIDR block cut into subnets, with the same math (minus 5 instead of minus 2).</p>"
    },
    {
     "type": "callout",
     "kind": "slidefix",
     "title": "SL-L13 p20: \"192.168.1.0/24 → /23\"",
     "html": "<p><b>Slide shows:</b> start from 192.168.1.0/24, then \"New prefix: /23\", as if 192.168.1.0/23 were the answer.</p><p><b>Correct:</b> a /23 block has 512 addresses and must start on a multiple of 2 in the third octet. 192.168.1.0 is not on a /23 boundary (1 is odd). The /23 that contains it is <b>192.168.0.0/23</b>: 192.168.0.0 – 192.168.1.255, first host 192.168.0.1, last host 192.168.1.254, broadcast 192.168.1.255. Python agrees: <code>ip_network('192.168.1.0/23')</code> raises \"has host bits set\". Also note that going from /24 to /23 <i>gives</i> a bit to the host part; \"borrowing\" in subnetting goes the other way.</p>"
    },
    {
     "type": "callout",
     "kind": "slidefix",
     "title": "SL-L13 p23: VPC usable counts",
     "html": "<p><b>Slide shows:</b> \"Usable host count: /16 → 65,534, /24 → 254\" for an AWS VPC.</p><p><b>Correct:</b> that is the <b>generic</b> rule ($2^{h}-2$). Inside <b>AWS</b>, every subnet loses <b>5</b> addresses, so a /16 subnet would give $65{,}536 - 5 = $ <b>65,531</b> and a /24 gives $256 - 5 = $ <b>251</b> (the console on p24 shows 4091 = 4096 − 5 for a /20). Read the question: \"in AWS\" means −5, otherwise −2.</p>"
    },
    {
     "type": "derivation",
     "title": "Minimum prefix for N hosts",
     "steps": [
      {
       "tex": "2^{h} - 2 \\ge N",
       "why": "Need N host addresses after removing network and broadcast."
      },
      {
       "tex": "h = \\lceil \\log_2 (N + 2) \\rceil",
       "why": "Solve for the smallest integer h."
      },
      {
       "tex": "N = 500:\\; \\log_2 502 \\approx 8.97 \\Rightarrow h = 9",
       "why": "Round up: 8 bits give only 254."
      },
      {
       "tex": "n = 32 - h = 32 - 9 = 23",
       "why": "The rest of the 32 bits are the prefix."
      },
      {
       "tex": "2^{9} - 2 = 510 \\ge 500 \\;\\checkmark",
       "why": "Check the answer: 510 usable."
      },
      {
       "tex": "\\text{AWS: } h = \\lceil \\log_2 (N + 5) \\rceil",
       "why": "AWS reserves 5 addresses per subnet instead of 2."
      }
     ]
    },
    {
     "type": "table",
     "head": [
      "Host bits h",
      "$2^{h}$",
      "Usable $2^{h}-2$",
      "Prefix",
      "Enough for 500?"
     ],
     "rows": [
      [
       "7",
       "128",
       "126",
       "/25",
       "no"
      ],
      [
       "8",
       "256",
       "254",
       "/24",
       "no"
      ],
      [
       "9",
       "512",
       "510",
       "/23",
       "<b>yes</b> (smallest)"
      ],
      [
       "10",
       "1024",
       "1022",
       "/22",
       "yes, but wasteful"
      ]
     ],
     "caption": "SL-L13 p20 step 2, extended by one row."
    },
    {
     "type": "table",
     "head": [
      "RFC 1918 block",
      "Range",
      "Addresses",
      "Classful equivalent",
      "Typical use (SL-L13 p22)"
     ],
     "rows": [
      [
       "10.0.0.0/8",
       "10.0.0.0 – 10.255.255.255",
       "$2^{24}$ = 16,777,216",
       "1 Class A",
       "Office LAN 10.0.0.0/24, Cloud VPC 10.0.0.0/16"
      ],
      [
       "172.16.0.0/12",
       "172.16.0.0 – 172.31.255.255",
       "$2^{20}$ = 1,048,576",
       "16 Class B (172.16 to 172.31)",
       "Default VPC in AWS uses 172.31.0.0/16"
      ],
      [
       "192.168.0.0/16",
       "192.168.0.0 – 192.168.255.255",
       "$2^{16}$ = 65,536",
       "256 Class C",
       "Home Wi-Fi 192.168.1.0/24"
      ]
     ],
     "caption": "Private addresses are reusable in every separate network and are not routed on the public Internet; NAT (Unit 15) translates them."
    },
    {
     "type": "figure",
     "caption": "SL-L13 p23–24: a VPC CIDR block carved into subnets, with generic and AWS host counts.",
     "html": "<svg viewBox='0 0 720 210' width='100%' font-family='sans-serif'><rect x='10' y='10' width='420' height='190' rx='12' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='24' y='34' fill='currentColor' font-size='15' font-weight='bold'>VPC 10.0.0.0/16</text><text x='24' y='54' fill='var(--muted)' font-size='12'>65,536 addresses (h = 16)</text><rect x='30' y='70' width='180' height='110' rx='8' fill='var(--ok)' fill-opacity='0.12' stroke='var(--ok)'/><text x='120' y='100' text-anchor='middle' fill='currentColor' font-size='13'>subnet 10.0.1.0/24</text><text x='120' y='122' text-anchor='middle' fill='var(--muted)' font-size='12'>256 addresses</text><text x='120' y='142' text-anchor='middle' fill='var(--muted)' font-size='12'>generic 254, AWS 251</text><rect x='230' y='70' width='180' height='110' rx='8' fill='var(--warn)' fill-opacity='0.12' stroke='var(--warn)'/><text x='320' y='100' text-anchor='middle' fill='currentColor' font-size='13'>subnet 10.0.2.0/24</text><text x='320' y='122' text-anchor='middle' fill='var(--muted)' font-size='12'>256 addresses</text><text x='320' y='142' text-anchor='middle' fill='var(--muted)' font-size='12'>generic 254, AWS 251</text><rect x='450' y='10' width='260' height='190' rx='12' fill='none' stroke='var(--muted)'/><text x='464' y='34' fill='currentColor' font-size='13' font-weight='bold'>Console (SL-L13 p24)</text><text x='464' y='60' fill='currentColor' font-size='12'>public1  10.0.0.0/20</text><text x='464' y='80' fill='currentColor' font-size='12'>private2 10.0.144.0/20</text><text x='464' y='108' fill='currentColor' font-size='12'>2^12 = 4096 addresses each</text><text x='464' y='130' fill='var(--ok)' font-size='12'>Available IPv4 = 4096 - 5 = 4091</text><text x='464' y='160' fill='var(--muted)' font-size='11'>AWS reserves .0 .1 .2 .3 and the last</text><text x='464' y='178' fill='var(--muted)' font-size='11'>address of every subnet (Unit 14)</text></svg>"
    },
    {
     "type": "callout",
     "kind": "aws",
     "title": "Console demo (SL-L13 p24)",
     "html": "<p>CN-Lab-VPC has IPv4 CIDR 10.0.0.0/16. Its subnets <code>public1-us-east-1a</code> (10.0.0.0/20) and <code>private2-us-east-1b</code> (10.0.144.0/20) both show <b>Available IPv4 addresses 4091</b>: $2^{32-20} = 4096$, minus the 5 AWS-reserved addresses. 10.0.144.0 is a valid /20 start because 144 = 9 × 16.</p>"
    },
    {
     "type": "cheat",
     "title": "Sizing and private ranges",
     "items": [
      "Generic: smallest $h$ with $2^{h}-2 \\ge N$; prefix $32-h$",
      "AWS: smallest $h$ with $2^{h}-5 \\ge N$",
      "Common sizes: 30 hosts /27, 62 /26, 126 /25, 254 /24, 510 /23, 1022 /22, 2046 /21, 4094 /20",
      "RFC 1918: 10/8, 172.16/12 (172.16–172.31), 192.168/16",
      "A block of $2^{h}$ must start on a multiple of $2^{h}$ (alignment)",
      "AWS VPC: /16 → 65,531; /20 → 4,091; /24 → 251"
     ]
    },
    {
     "type": "worked",
     "title": "One subnet for 500 devices (SL-L13 p20, corrected)",
     "tag": "University-Midsem-style",
     "problem": "<p>You must put 500 devices in one subnet carved from 192.168.0.0/16. Find the prefix, the usable count, and the first aligned block, with its network, first, last and broadcast address.</p>",
     "steps": [
      {
       "tex": "2^{8} - 2 = 254 < 500",
       "why": "A /24 is too small (SL-L13 p20: \"Not enough\")."
      },
      {
       "tex": "2^{9} - 2 = 510 \\ge 500",
       "why": "9 host bits are enough."
      },
      {
       "tex": "n = 32 - 9 = 23",
       "why": "Prefix /23, mask 255.255.254.0 (254 = 11111110)."
      },
      {
       "tex": "\\text{block} = 2^{9} = 512 = 2 \\times 256",
       "why": "A /23 spans two consecutive third-octet values."
      },
      {
       "tex": "\\text{third octet must be even (0, 2, 4, 6) } \\Rightarrow 192.168.0.0/23",
       "why": "The third octet must be even; the first such block is 0."
      },
      {
       "tex": "\\text{first} = 192.168.0.1,\\; \\text{last} = 192.168.1.254,\\; \\text{bcast} = 192.168.1.255",
       "why": "Network + 1; broadcast − 1; all 9 host bits set."
      }
     ],
     "answer": "<b>/23 (255.255.254.0), 510 usable; block 192.168.0.0/23: first 192.168.0.1, last 192.168.1.254, broadcast 192.168.1.255.</b> Not \"192.168.1.0/23\"."
    },
    {
     "type": "code",
     "file": "Unit13_ipaddress_struct.py",
     "level": "high",
     "title": "is_private, supernet(), and the strict=False trap for 192.168.1.0/23"
    },
    {
     "type": "traps",
     "items": [
      "Size for $N + 2$, not $N$: 254 hosts fit a /24, 255 hosts need a /23.",
      "In AWS size for $N + 5$: 60 instances need a /25 (123 usable), because a /26 gives only 59.",
      "172.32.0.1 and 172.15.0.1 are <b>public</b>; only 172.16–172.31 is private.",
      "192.168.1.0/23 is not a valid network address; the block is 192.168.0.0/23.",
      "Private addresses repeat in different networks (your 192.168.1.10 and a friend's 192.168.1.10 are both fine, SL-L13 p22)."
     ]
    }
   ],
   "practice": [
    {
     "id": "u13-D-1",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "13.8",
     "q": "<p>What is the longest prefix (smallest block) that can hold 500 hosts under the generic −2 rule? Answer the prefix length as an integer.</p>",
     "answer": 23,
     "tol": 0,
     "unit": "",
     "verify": "32-math.ceil(math.log2(500+2))",
     "steps": [
      {
       "tex": "\\lceil \\log_2 502 \\rceil = 9",
       "why": "8 bits give 254, 9 give 510."
      },
      {
       "tex": "32 - 9 = 23",
       "why": "Prefix length."
      }
     ],
     "explain": "<p><b>/23</b>.</p>",
     "formula": "n = 32 - \\lceil \\log_2(N+2) \\rceil"
    },
    {
     "id": "u13-D-2",
     "type": "num",
     "tag": "GATE-style",
     "topic": "13.8",
     "q": "<p>Prefix length for one subnet of 1000 hosts (generic)? (integer)</p>",
     "answer": 22,
     "tol": 0,
     "unit": "",
     "verify": "32-math.ceil(math.log2(1000+2))",
     "steps": [
      {
       "tex": "2^{9}-2 = 510 < 1000",
       "why": "9 bits too few."
      },
      {
       "tex": "2^{10}-2 = 1022 \\ge 1000",
       "why": "10 bits enough."
      },
      {
       "tex": "32-10 = 22",
       "why": "Prefix."
      }
     ],
     "explain": "<p><b>/22</b>.</p>"
    },
    {
     "id": "u13-D-3",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "13.8",
     "q": "<p>Exactly 62 hosts must fit with no wasted host addresses. Prefix length? (integer)</p>",
     "answer": 26,
     "tol": 0,
     "unit": "",
     "verify": "32-math.ceil(math.log2(62+2))",
     "steps": [
      {
       "tex": "62 + 2 = 64 = 2^{6}",
       "why": "Exactly a power of two."
      },
      {
       "tex": "32 - 6 = 26",
       "why": "Prefix."
      }
     ],
     "explain": "<p><b>/26</b>.</p>"
    },
    {
     "id": "u13-D-4",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "13.10",
     "q": "<p>In <b>AWS</b>, what is the longest prefix for a subnet that must hold 60 EC2 instances? (integer)</p>",
     "answer": 25,
     "tol": 0,
     "unit": "",
     "verify": "32-math.ceil(math.log2(60+5))",
     "steps": [
      {
       "tex": "2^{6} - 5 = 59 < 60",
       "why": "A /26 gives only 59 usable in AWS."
      },
      {
       "tex": "2^{7} - 5 = 123 \\ge 60",
       "why": "7 host bits suffice."
      },
      {
       "tex": "32 - 7 = 25",
       "why": "Prefix /25."
      }
     ],
     "explain": "<p><b>/25</b>. The generic rule would say /26; AWS's 5 reserved addresses push it to /25.</p>"
    },
    {
     "id": "u13-D-5",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "13.8",
     "q": "<p>192.168.1.0 sits inside which /23 network? Give the network address in dotted decimal.</p>",
     "answer": "192.168.0.0",
     "verify": "'192.168.' + str(1 & 254) + '.0'",
     "steps": [
      {
       "tex": "1 \\wedge 254 = 0",
       "why": "00000001 AND 11111110 = 00000000."
      }
     ],
     "explain": "<p>/23 mask third octet = 254; 1 AND 254 = 0, so <b>192.168.0.0</b>/23 (slide fix B5).</p>"
    },
    {
     "id": "u13-D-6",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "13.9",
     "q": "<p>Which address is a private (RFC 1918) address?</p>",
     "options": [
      "172.32.0.1",
      "11.0.0.1",
      "192.169.1.1",
      "172.20.5.5"
     ],
     "answer": 3,
     "why": [
      "172.16.0.0/12 ends at 172.31.255.255; 172.32 is public.",
      "10.0.0.0/8 covers only first octet 10.",
      "Only 192.168.x.x is private, not 192.169.",
      "172.20 is inside 172.16–172.31."
     ],
     "explain": "<p><b>172.20.5.5</b>.</p>"
    },
    {
     "id": "u13-D-7",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "13.9",
     "q": "<p>How many /24 networks fit inside 10.0.0.0/8? (integer)</p>",
     "answer": 65536,
     "tol": 0,
     "unit": "networks",
     "verify": "2**(24-8)",
     "steps": [
      {
       "tex": "24 - 8 = 16",
       "why": "Extra network bits between /8 and /24."
      },
      {
       "tex": "2^{16} = 65{,}536",
       "why": "Each bit doubles the number of /24s."
      }
     ],
     "explain": "<p><b>65,536</b>.</p>"
    },
    {
     "id": "u13-D-8",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "13.10",
     "q": "<p>An AWS subnet is 10.0.144.0/20. How many IPv4 addresses does the console show as available? (integer)</p>",
     "answer": 4091,
     "tol": 0,
     "unit": "addresses",
     "verify": "2**(32-20)-5",
     "steps": [
      {
       "tex": "2^{12} = 4096",
       "why": "12 host bits."
      },
      {
       "tex": "4096 - 5 = 4091",
       "why": "AWS reserves 5 addresses (SL-L13 p24)."
      }
     ],
     "explain": "<p><b>4,091</b>.</p>"
    },
    {
     "id": "u13-D-9",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "13.10",
     "q": "<p>Using the AWS rule, how many usable addresses would a single /16 subnet give? (integer)</p>",
     "answer": 65531,
     "tol": 0,
     "unit": "addresses",
     "verify": "2**16-5",
     "steps": [
      {
       "tex": "2^{16} = 65{,}536",
       "why": "16 host bits."
      },
      {
       "tex": "65{,}536 - 5 = 65{,}531",
       "why": "AWS −5, not the slide's −2 (slide fix B8)."
      }
     ],
     "explain": "<p><b>65,531</b>.</p>"
    },
    {
     "id": "u13-D-10",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "13.9",
     "q": "<p>Predict the exact output.</p>",
     "code": "import ipaddress\nprint(*[ipaddress.ip_address(a).is_private for a in ('10.20.1.5', '172.32.0.1', '192.168.0.14')])",
     "answer": "True False True",
     "runCheck": true,
     "explain": "<p>10.20.1.5 is in 10/8 (private); 172.32.0.1 is just outside 172.16/12 (public); 192.168.0.14 is in 192.168/16 (private).</p>"
    }
   ]
  },
  {
   "id": "13-E",
   "title": "Supernetting and Route Aggregation",
   "badge": "extra",
   "source": "RFC 4632 §3; Kurose & Ross 8e §4.3.2 (address aggregation); Forouzan §19.1",
   "covers": [
    "13.11"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "Four neighbouring plots, one deed",
     "html": "<p><b>Intuition.</b> If an ISP owns four neighbouring /24s, the rest of the Internet does not need four routes: one shorter prefix that covers all four does the job. That is <b>supernetting</b> (route aggregation / summarisation): the opposite of subnetting, you <i>remove</i> network bits.</p><p><b>Definition (RFC 4632 §3).</b> $2^{k}$ blocks of size /n can be replaced by one /(n−k) if they are <b>contiguous</b>, their number is a <b>power of 2</b>, and the first block is <b>aligned</b> (its network address is a multiple of the new block size).</p>"
    },
    {
     "type": "table",
     "head": [
      "Network",
      "Third octet in binary",
      "Common prefix bits"
     ],
     "rows": [
      [
       "200.10.4.0/24",
       "000001<b>00</b>",
       "16 + 6 = 22"
      ],
      [
       "200.10.5.0/24",
       "000001<b>01</b>",
       "22"
      ],
      [
       "200.10.6.0/24",
       "000001<b>10</b>",
       "22"
      ],
      [
       "200.10.7.0/24",
       "000001<b>11</b>",
       "22"
      ]
     ],
     "caption": "The four /24s agree on the first 22 bits; the last 2 bits of octet 3 take all four values 00, 01, 10, 11."
    },
    {
     "type": "derivation",
     "title": "Why the summary is /(n − k)",
     "steps": [
      {
       "tex": "m = 2^{k} \\text{ blocks} \\Rightarrow k = \\log_2 m",
       "why": "Merging m equal blocks frees k bits, which must take every value."
      },
      {
       "tex": "n' = n - k",
       "why": "Those k bits move from the network part to the host part."
      },
      {
       "tex": "m = 4,\\; n = 24 \\Rightarrow k = 2,\\; n' = 22",
       "why": "Four /24s become one /22."
      },
      {
       "tex": "\\text{aligned} \\iff \\text{first} \\bmod 2^{k} = 0 \\text{ (in the boundary octet)}",
       "why": "The k freed bits of the first block must be 00, so 4 mod 4 = 0 passes and 5 mod 4 = 1 fails."
      },
      {
       "tex": "\\text{size} = 2^{32-22} = 1024 = 4 \\times 256",
       "why": "The summary covers exactly the four /24s and nothing else."
      }
     ]
    },
    {
     "type": "worked",
     "title": "Aggregate 200.10.4.0/24 – 200.10.7.0/24",
     "tag": "GATE-style",
     "problem": "<p>An ISP owns 200.10.4.0/24, 200.10.5.0/24, 200.10.6.0/24 and 200.10.7.0/24. Can they be advertised as one route? If so, give it.</p>",
     "steps": [
      {
       "text": "Contiguous: 4, 5, 6, 7 follow each other with no gap.",
       "why": "Condition 1."
      },
      {
       "tex": "4 = 2^{2} \\Rightarrow k = 2",
       "why": "Condition 2: the count is a power of two."
      },
      {
       "tex": "4 \\bmod 4 = 0",
       "why": "Condition 3: the first third octet is a multiple of 4, so the block is aligned."
      },
      {
       "tex": "24 - 2 = 22,\\; \\text{mask } 255.255.252.0",
       "why": "252 = 11111100."
      },
      {
       "tex": "4 \\wedge 252 = 4 \\Rightarrow 200.10.4.0/22",
       "why": "The summary's network address."
      },
      {
       "tex": "\\text{range } 200.10.4.0 - 200.10.7.255",
       "why": "Block of 4 in octet 3: 4, 5, 6, 7."
      }
     ],
     "answer": "<b>Yes: 200.10.4.0/22</b> (mask 255.255.252.0). By contrast 200.10.5.0–200.10.8.0 cannot become one /22, because 5 is not a multiple of 4."
    },
    {
     "type": "cheat",
     "title": "Supernetting checklist",
     "items": [
      "Same prefix length for every block",
      "Count = $2^{k}$ (2, 4, 8, 16)",
      "Contiguous, no gaps",
      "First block's boundary octet divisible by $2^{k}$",
      "Summary prefix = n − k"
     ]
    },
    {
     "type": "code",
     "file": "Unit13_subnet_calc_bitwise.py",
     "level": "low",
     "title": "can_aggregate(): power-of-two, contiguity and alignment tests with bit tricks"
    },
    {
     "type": "traps",
     "items": [
      "Two /24s with third octets 1 and 2 are contiguous but <b>not</b> aligned for a /23 (1 is odd).",
      "Three blocks never make a single supernet: 3 is not a power of 2.",
      "Longest-prefix matching with summaries is taught in Unit 15."
     ]
    }
   ],
   "practice": [
    {
     "id": "u13-E-1",
     "type": "text",
     "tag": "GATE-style",
     "topic": "13.11",
     "q": "<p>Summarise 192.168.16.0/24 through 192.168.23.0/24 (eight /24s) as one CIDR block.</p>",
     "answer": "192.168.16.0/21",
     "verify": "'192.168.' + str(16 & 248) + '.0/' + str(24 - 3)",
     "steps": [
      {
       "tex": "8 = 2^{3} \\Rightarrow k = 3",
       "why": "Eight blocks."
      },
      {
       "tex": "16 \\bmod 8 = 0",
       "why": "Aligned."
      },
      {
       "tex": "24 - 3 = 21",
       "why": "New prefix."
      }
     ],
     "explain": "<p>8 = $2^3$, so k = 3 and the prefix is 24 − 3 = 21. 16 mod 8 = 0, so it is aligned: <b>192.168.16.0/21</b>.</p>"
    },
    {
     "id": "u13-E-2",
     "type": "mcq",
     "tag": "GATE-style",
     "topic": "13.11",
     "q": "<p>Can 10.1.1.0/24 and 10.1.2.0/24 be summarised as a single /23?</p>",
     "options": [
      "Yes, as 10.1.1.0/23",
      "Yes, as 10.1.0.0/23",
      "No, because they are not aligned on a /23 boundary",
      "No, because two is not a power of 2"
     ],
     "answer": 2,
     "why": [
      "10.1.1.0 has a host bit set for /23; not a valid network.",
      "10.1.0.0/23 covers 10.1.0.x and 10.1.1.x, not 10.1.2.x.",
      "A /23 must start on an even third octet; 1 is odd.",
      "2 = $2^1$ is a power of 2."
     ],
     "explain": "<p>Contiguous but <b>misaligned</b>; the smallest single block covering both is 10.1.0.0/22, which also includes 10.1.0.0/24 and 10.1.3.0/24.</p>"
    },
    {
     "id": "u13-E-3",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "13.11",
     "q": "<p>Eight contiguous, aligned /26 blocks are aggregated. What is the prefix length of the summary? (integer)</p>",
     "answer": 23,
     "tol": 0,
     "unit": "",
     "verify": "26 - int(math.log2(8))",
     "steps": [
      {
       "tex": "k = \\log_2 8 = 3",
       "why": "Eight blocks free 3 bits."
      },
      {
       "tex": "26 - 3 = 23",
       "why": "Summary prefix."
      }
     ],
     "explain": "<p><b>/23</b>.</p>"
    },
    {
     "id": "u13-E-4",
     "type": "msq",
     "tag": "University-Midsem-style",
     "topic": "13.11",
     "q": "<p>Select ALL conditions needed to replace several /n blocks with one shorter prefix that covers exactly them.</p>",
     "options": [
      "The blocks are contiguous",
      "The number of blocks is a power of 2",
      "The first block is aligned on the new block size",
      "The blocks are all private (RFC 1918)"
     ],
     "answer": [
      0,
      1,
      2
     ],
     "why": [
      "A gap would be covered by the summary too.",
      "Only $2^k$ blocks fill a /(n−k) exactly.",
      "Otherwise the summary's network address has host bits set.",
      "Aggregation applies to any addresses; ISPs aggregate public space."
     ],
     "explain": "<p>Contiguous, power of 2, aligned.</p>"
    }
   ]
  },
  {
   "id": "13-F",
   "title": "The IPv4 Header, Header Checksum and Fragmentation",
   "badge": "extra",
   "source": "RFC 791; RFC 1071 (checksum); RFC 2474/3168 (DSCP/ECN); Kurose & Ross 8e §4.3.1; Forouzan §19.1",
   "covers": [
    "13.11"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "The label on the parcel",
     "html": "<p><b>Intuition.</b> The IPv4 header is the shipping label every router reads: who it is from (source), where it goes (destination), how many more hops it may take (TTL), what is inside (protocol), and, if the parcel was too big for a truck, which piece this is (identification, flags, fragment offset).</p><p><b>Definition (RFC 791).</b> The header is 20 bytes without options (IHL = 5) and at most 60 bytes (IHL = 15). The <b>header checksum</b> is the 16-bit one's complement of the one's-complement sum of the header's 16-bit words (RFC 1071); it covers the header only and is recomputed at each router because TTL changes. A router that must forward a datagram onto a link whose <b>MTU</b> is smaller <b>fragments</b> it; only the destination reassembles.</p>"
    },
    {
     "type": "packet",
     "title": "IPv4 header (RFC 791): 14 fields",
     "width": 32,
     "fields": [
      {
       "name": "Version",
       "bits": 4,
       "note": "4 for IPv4"
      },
      {
       "name": "IHL",
       "bits": 4,
       "note": "header length in 32-bit words: 5 (20 B) to 15 (60 B)"
      },
      {
       "name": "DSCP",
       "bits": 6,
       "note": "differentiated services code point (QoS class); was part of the 8-bit TOS"
      },
      {
       "name": "ECN",
       "bits": 2,
       "note": "explicit congestion notification (RFC 3168)"
      },
      {
       "name": "Total length",
       "bits": 16,
       "note": "header + data in bytes, maximum 65,535"
      },
      {
       "name": "Identification",
       "bits": 16,
       "note": "same value in every fragment of one datagram"
      },
      {
       "name": "Flags",
       "bits": 3,
       "note": "bit 0 reserved (0), DF = don't fragment, MF = more fragments"
      },
      {
       "name": "Fragment offset",
       "bits": 13,
       "note": "position of this fragment's data in 8-byte units"
      },
      {
       "name": "TTL",
       "bits": 8,
       "note": "decremented by each router; dropped at 0 (Linux default 64)"
      },
      {
       "name": "Protocol",
       "bits": 8,
       "note": "1 = ICMP, 6 = TCP, 17 = UDP"
      },
      {
       "name": "Header checksum",
       "bits": 16,
       "note": "one's complement of the one's-complement sum of header words"
      },
      {
       "name": "Source address",
       "bits": 32,
       "note": "sender's IPv4 address"
      },
      {
       "name": "Destination address",
       "bits": 32,
       "note": "receiver's IPv4 address"
      },
      {
       "name": "Options + padding",
       "bits": 32,
       "note": "0 to 40 bytes, padded to a multiple of 4 bytes; drawn as one 32-bit row"
      }
     ],
     "caption": "160 bits (20 bytes) of fixed header plus optional options."
    },
    {
     "type": "table",
     "head": [
      "Bytes",
      "Field",
      "Value",
      "Meaning"
     ],
     "rows": [
      [
       "45",
       "Version | IHL",
       "4 | 5",
       "IPv4, 5 × 4 = 20-byte header"
      ],
      [
       "00",
       "DSCP | ECN",
       "0 | 0",
       "best effort"
      ],
      [
       "00 73",
       "Total length",
       "115",
       "20 header + 95 data bytes"
      ],
      [
       "00 00",
       "Identification",
       "0",
       ""
      ],
      [
       "40 00",
       "Flags | Offset",
       "010 | 0",
       "DF = 1, MF = 0, offset 0"
      ],
      [
       "40",
       "TTL",
       "64",
       ""
      ],
      [
       "11",
       "Protocol",
       "17",
       "UDP"
      ],
      [
       "b8 61",
       "Checksum",
       "0xB861",
       "computed below"
      ],
      [
       "c0 a8 00 01",
       "Source",
       "192.168.0.1",
       ""
      ],
      [
       "c0 a8 00 c7",
       "Destination",
       "192.168.0.199",
       ""
      ]
     ],
     "caption": "Decoding the example header 45 00 00 73 00 00 40 00 40 11 b8 61 c0 a8 00 01 c0 a8 00 c7."
    },
    {
     "type": "derivation",
     "title": "Header and fragmentation formulas",
     "steps": [
      {
       "tex": "\\text{header bytes} = \\text{IHL} \\times 4",
       "why": "IHL counts 32-bit (4-byte) words."
      },
      {
       "tex": "\\text{data bytes} = \\text{total length} - \\text{IHL}\\times 4",
       "why": "Total length covers header plus data."
      },
      {
       "tex": "\\text{checksum} = \\overline{\\textstyle\\sum_{1's} w_i}",
       "why": "Add 16-bit words with end-around carry, then flip all bits (RFC 1071)."
      },
      {
       "tex": "D_{max} = \\left\\lfloor \\frac{\\text{MTU} - 20}{8} \\right\\rfloor \\times 8",
       "why": "Each fragment carries its own 20-byte header; non-final data must be a multiple of 8 because the offset field counts 8-byte units."
      },
      {
       "tex": "\\#\\text{frag} = \\left\\lceil \\frac{D}{D_{max}} \\right\\rceil",
       "why": "D data bytes split into pieces of at most D_max."
      },
      {
       "tex": "\\text{offset}_i = \\frac{\\text{first data byte of fragment } i}{8}",
       "why": "13 bits × 8 = 65,528 bytes of reach."
      },
      {
       "tex": "1500:\\; D_{max} = \\lfloor 1480/8 \\rfloor \\times 8 = 1480;\\;\\; 620:\\; D_{max} = 600",
       "why": "Values used in the worked problem."
      }
     ]
    },
    {
     "type": "worked",
     "title": "Header checksum with real hex words (every addition shown)",
     "tag": "GATE-style",
     "problem": "<p>Compute the header checksum of <code>45 00 00 73 00 00 40 00 40 11 [xx xx] c0 a8 00 01 c0 a8 00 c7</code> (checksum field taken as 0000), then show the receiver's check.</p>",
     "steps": [
      {
       "tex": "0x0000 + 0x4500 = 0x4500",
       "why": "Word 1 = version 4, IHL 5 (45) and DSCP/ECN 00. No carry."
      },
      {
       "tex": "0x4500 + 0x0073 = 0x4573",
       "why": "Word 2 = total length 0x0073 = 115 bytes. No carry."
      },
      {
       "tex": "0x4573 + 0x0000 = 0x4573",
       "why": "Word 3 = identification 0."
      },
      {
       "tex": "0x4573 + 0x4000 = 0x8573",
       "why": "Word 4 = flags 010 (DF) + offset 0."
      },
      {
       "tex": "0x8573 + 0x4011 = 0xC584",
       "why": "Word 5 = TTL 0x40 = 64 and protocol 0x11 = 17 (UDP). No carry."
      },
      {
       "tex": "0xC584 + 0x0000 = 0xC584",
       "why": "Word 6 = the checksum field itself, set to 0000 while computing."
      },
      {
       "tex": "0xC584 + 0xC0A8 = 0x1862C \\rightarrow 0x862C + 0x1 = 0x862D",
       "why": "Word 7 = 192.168 (source, first half). The sum overflows 16 bits: wrap the carry 1 back into bit 0."
      },
      {
       "tex": "0x862D + 0x0001 = 0x862E",
       "why": "Word 8 = .0.1 (source, second half)."
      },
      {
       "tex": "0x862E + 0xC0A8 = 0x146D6 \\rightarrow 0x46D6 + 0x1 = 0x46D7",
       "why": "Word 9 = 192.168 (destination, first half). Second carry, wrapped around."
      },
      {
       "tex": "0x46D7 + 0x00C7 = 0x479E",
       "why": "Word 10 = .0.199 (destination, second half). Final one's-complement sum."
      },
      {
       "tex": "\\overline{0x479E} = 0xFFFF - 0x479E = 0xB861",
       "why": "Checksum = one's complement (flip every bit) of the sum."
      },
      {
       "tex": "0x479E + 0xB861 = 0xFFFF",
       "why": "Receiver check: the sum over all ten words including the checksum is all ones, so no error is detected."
      }
     ],
     "answer": "<b>Checksum = 0xB861</b> (bytes b8 61). Receiver's sum = 0xFFFF, so the header is accepted."
    },
    {
     "type": "worked",
     "title": "Fragmenting a 4000-byte datagram over MTU 1500, then MTU 620",
     "tag": "GATE-style",
     "problem": "<p>A 4000-byte datagram (20-byte header, 3980 data bytes, ID = x, MF = 0) crosses a link with MTU 1500. Each fragment then crosses a link with MTU 620. For every fragment at both stages give total length, data length, offset (8-byte units) and MF.</p>",
     "steps": [
      {
       "tex": "D_{max}(1500) = 1480 = 185 \\times 8",
       "why": "1500 − 20 = 1480 is already a multiple of 8."
      },
      {
       "tex": "3980 = 1480 + 1480 + 1020",
       "why": "Two full fragments and a remainder."
      },
      {
       "tex": "\\text{offsets } 0,\\; 1480/8 = 185,\\; 2960/8 = 370",
       "why": "Byte positions 0, 1480 and 2960, divided by 8."
      },
      {
       "text": "Stage 1: F1 total 1500, data 1480, offset 0, MF 1; F2 1500, 1480, 185, MF 1; F3 1040, 1020, 370, MF 0.",
       "why": "Only the fragment that ends the original datagram has MF = 0."
      },
      {
       "tex": "D_{max}(620) = 600 = 75 \\times 8",
       "why": "620 − 20 = 600, a multiple of 8."
      },
      {
       "tex": "1480 = 600 + 600 + 280",
       "why": "F1 and F2 each split into three pieces."
      },
      {
       "tex": "\\text{F1 pieces: offsets } 0,\\; 75,\\; 150",
       "why": "Bytes 0, 600 and 1200 of the original."
      },
      {
       "tex": "\\text{F2 pieces: offsets } 185,\\; 185+75 = 260,\\; 260+75 = 335",
       "why": "Offsets are relative to the ORIGINAL datagram, so start from 185."
      },
      {
       "tex": "1020 = 600 + 420;\\; \\text{offsets } 370,\\; 445",
       "why": "F3 splits into two."
      },
      {
       "text": "MF: every piece of F1 and F2 keeps MF = 1 (their parent had MF = 1); in F3 the first piece gets MF = 1 and the last piece keeps MF = 0.",
       "why": "MF = 0 only on the piece that carries byte 3979."
      },
      {
       "tex": "8 \\times 20 + 3980 = 4140 \\text{ bytes on the wire}",
       "why": "Eight fragments each pay a 20-byte header; data adds back to 3980."
      }
     ],
     "answer": "<b>Stage 1:</b> 3 fragments (1500/1480/0/1, 1500/1480/185/1, 1040/1020/370/0). <b>Stage 2:</b> 8 fragments: offsets 0, 75, 150, 185, 260, 335, 370, 445; only the last (total 440, data 420, offset 445) has MF = 0. See the tables below."
    },
    {
     "type": "table",
     "head": [
      "Stage 1 fragment",
      "Total length",
      "Data length",
      "Offset (×8 B)",
      "First data byte",
      "MF"
     ],
     "rows": [
      [
       "F1",
       "1500",
       "1480",
       "0",
       "0",
       "1"
      ],
      [
       "F2",
       "1500",
       "1480",
       "185",
       "1480",
       "1"
      ],
      [
       "F3",
       "1040",
       "1020",
       "370",
       "2960",
       "0"
      ]
     ],
     "caption": "After the MTU-1500 link."
    },
    {
     "type": "table",
     "head": [
      "Stage 2 fragment",
      "From",
      "Total length",
      "Data length",
      "Offset (×8 B)",
      "First data byte",
      "MF"
     ],
     "rows": [
      [
       "F1a",
       "F1",
       "620",
       "600",
       "0",
       "0",
       "1"
      ],
      [
       "F1b",
       "F1",
       "620",
       "600",
       "75",
       "600",
       "1"
      ],
      [
       "F1c",
       "F1",
       "300",
       "280",
       "150",
       "1200",
       "1"
      ],
      [
       "F2a",
       "F2",
       "620",
       "600",
       "185",
       "1480",
       "1"
      ],
      [
       "F2b",
       "F2",
       "620",
       "600",
       "260",
       "2080",
       "1"
      ],
      [
       "F2c",
       "F2",
       "300",
       "280",
       "335",
       "2680",
       "1"
      ],
      [
       "F3a",
       "F3",
       "620",
       "600",
       "370",
       "2960",
       "1"
      ],
      [
       "F3b",
       "F3",
       "440",
       "420",
       "445",
       "3560",
       "0"
      ]
     ],
     "caption": "After the MTU-620 link: 8 fragments, data total 3980 bytes, 4140 bytes on the wire. All share the original identification value."
    },
    {
     "type": "cheat",
     "title": "IPv4 header numbers",
     "items": [
      "Header 20–60 bytes; IHL 5–15",
      "Total length max 65,535 bytes",
      "Protocol: 1 ICMP, 6 TCP, 17 UDP",
      "Flags: reserved, DF, MF; DF = 1 and too big → drop + ICMP \"fragmentation needed\"",
      "Offset = byte position / 8; non-final fragment data is a multiple of 8",
      "Checksum covers the header only; recomputed at every hop",
      "Reassembly happens only at the destination"
     ]
    },
    {
     "type": "code",
     "file": "Unit13_ipv4_header_manual.py",
     "level": "low",
     "title": "Build and parse the header byte by byte; one's-complement sum with printed carries"
    },
    {
     "type": "code",
     "file": "Unit13_fragmentation.py",
     "level": "low",
     "title": "Fragmentation calculator: both stages with asserts"
    },
    {
     "type": "code",
     "file": "Unit13_ipaddress_struct.py",
     "level": "high",
     "title": "struct.pack('!BBHHHBBH4s4s') header and checksum verification"
    },
    {
     "type": "traps",
     "items": [
      "Offset is in <b>8-byte units</b>: byte 1480 is offset 185, not 1480.",
      "Re-fragmenting a fragment with MF = 1: <b>all</b> its pieces have MF = 1.",
      "Offsets of re-fragmented pieces are relative to the <b>original</b> datagram.",
      "IHL = 5 means 20 bytes, not 5 bytes.",
      "Total length includes the header; data per fragment = MTU − 20, rounded down to a multiple of 8.",
      "Set the checksum field to 0 before summing; the receiver sums it in and expects 0xFFFF."
     ]
    }
   ],
   "practice": [
    {
     "id": "u13-F-1",
     "type": "num",
     "tag": "GATE-style",
     "topic": "13.11",
     "q": "<p>An IPv4 header carries 12 bytes of options. What value is in the IHL field? (integer)</p>",
     "answer": 8,
     "tol": 0,
     "unit": "words",
     "verify": "(20+12)//4",
     "steps": [
      {
       "tex": "20 + 12 = 32 \\text{ bytes}",
       "why": "Fixed header plus options."
      },
      {
       "tex": "32 / 4 = 8",
       "why": "IHL counts 4-byte words."
      }
     ],
     "explain": "<p><b>8</b>.</p>"
    },
    {
     "id": "u13-F-2",
     "type": "num",
     "tag": "GATE-style",
     "topic": "13.11",
     "q": "<p>A fragment's first data byte is byte 2960 of the original datagram. What is its fragment offset field? (integer)</p>",
     "answer": 370,
     "tol": 0,
     "unit": "8-byte units",
     "verify": "2960//8",
     "steps": [
      {
       "tex": "2960 / 8 = 370",
       "why": "Offset counts 8-byte blocks."
      }
     ],
     "explain": "<p><b>370</b>.</p>"
    },
    {
     "id": "u13-F-3",
     "type": "num",
     "tag": "GATE-style",
     "topic": "13.11",
     "q": "<p>A 2400-byte datagram (20-byte header) crosses a link with MTU 1000. How many fragments are produced? (integer)</p>",
     "answer": 3,
     "tol": 0,
     "unit": "fragments",
     "verify": "math.ceil((2400-20)/((1000-20)//8*8))",
     "steps": [
      {
       "tex": "D = 2400 - 20 = 2380",
       "why": "Data bytes."
      },
      {
       "tex": "D_{max} = \\lfloor 980/8 \\rfloor \\times 8 = 976",
       "why": "980 is not a multiple of 8; round down."
      },
      {
       "tex": "\\lceil 2380/976 \\rceil = \\lceil 2.44 \\rceil = 3",
       "why": "976 + 976 + 428."
      }
     ],
     "explain": "<p><b>3</b> fragments: data 976, 976, 428.</p>"
    },
    {
     "id": "u13-F-4",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "13.11",
     "q": "<p>For the datagram in the previous question, what is the offset field of the <b>last</b> fragment? (integer)</p>",
     "answer": 244,
     "tol": 0,
     "unit": "8-byte units",
     "verify": "2*976//8",
     "steps": [
      {
       "tex": "976 \\times 2 = 1952",
       "why": "First data byte of the third fragment."
      },
      {
       "tex": "1952 / 8 = 244",
       "why": "Offset in 8-byte units."
      }
     ],
     "explain": "<p><b>244</b>.</p>"
    },
    {
     "id": "u13-F-5",
     "type": "text",
     "tag": "GATE-style",
     "topic": "13.11",
     "q": "<p>A router decrements the TTL of the example header from 64 to 63. Give the new header checksum as 4 uppercase hex digits (no 0x). Header words: 4500 0073 0000 4000 3F11 [0000] C0A8 0001 C0A8 00C7.</p>",
     "answer": "B961",
     "verify": "format(~(((0x4500+0x0073+0x4000+0x3f11+0xc0a8+0x0001+0xc0a8+0x00c7) & 0xffff) + ((0x4500+0x0073+0x4000+0x3f11+0xc0a8+0x0001+0xc0a8+0x00c7) >> 16)) & 0xffff, '04X')",
     "steps": [
      {
       "tex": "\\sum = 0x2469C",
       "why": "Add the nine non-checksum words."
      },
      {
       "tex": "0x469C + 0x2 = 0x469E",
       "why": "Wrap the carries."
      },
      {
       "tex": "\\overline{0x469E} = 0xB961",
       "why": "Flip all bits."
      }
     ],
     "explain": "<p>Sum = 0x2469C; fold: 0x469C + 0x2 = 0x469E; complement: <b>0xB961</b>. Lowering the high byte of word 5 by 1 lowers the sum by 0x0100, so the checksum rises by 0x0100 (B861 → B961).</p>"
    },
    {
     "id": "u13-F-6",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "13.11",
     "q": "<p>An ordinary router (no NAT) forwards an IPv4 datagram without fragmenting it. Which fields does it change?</p>",
     "options": [
      "Source address and checksum",
      "TTL and header checksum",
      "Identification and TTL",
      "Total length and protocol"
     ],
     "answer": 1,
     "why": [
      "The source changes only through NAT.",
      "TTL drops by 1, so the checksum must be recomputed.",
      "Identification stays fixed so fragments can be matched.",
      "These change only when fragmenting (length) or never (protocol)."
     ],
     "explain": "<p><b>TTL and checksum</b>.</p>"
    },
    {
     "id": "u13-F-7",
     "type": "mcq",
     "tag": "GATE-style",
     "topic": "13.11",
     "q": "<p>Stage-1 fragment F1 (MF = 1) is split again into three pieces. What is the MF bit of its <b>last</b> piece?</p>",
     "options": [
      "0, because it is the last piece of F1",
      "1, because more of the original datagram follows",
      "Copied from DF",
      "Undefined; the destination sets it"
     ],
     "answer": 1,
     "why": [
      "MF refers to the original datagram, not to F1.",
      "Bytes 1480–3979 still follow, so MF = 1.",
      "DF and MF are independent bits.",
      "MF is set by whoever fragments."
     ],
     "explain": "<p><b>1</b>.</p>"
    },
    {
     "id": "u13-F-8",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "13.11",
     "q": "<p>Predict the exact output.</p>",
     "code": "import struct\nh = bytes.fromhex('45000073000040004011b861c0a80001c0a800c7')\nv, tos, tl, ident, ff, ttl, proto, csum, src, dst = struct.unpack('!BBHHHBBH4s4s', h)\nprint(v >> 4, (v & 0x0F) * 4, proto)",
     "answer": "4 20 17",
     "runCheck": true,
     "explain": "<p>0x45 &gt;&gt; 4 = 4 (version); (0x45 &amp; 0x0F) × 4 = 20 (header bytes); byte 9 = 0x11 = 17 (UDP).</p>"
    }
   ]
  },
  {
   "id": "13-G",
   "title": "The IPv6 Header and IPv4 vs IPv6",
   "badge": "extra",
   "source": "RFC 8200; RFC 4291; RFC 5952; Kurose & Ross 8e §4.3.4",
   "covers": [
    "13.11"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "A bigger, simpler label",
     "html": "<p><b>Intuition.</b> IPv6 is the long-term fix for exhaustion: addresses grow from 32 to 128 bits, and the header is <b>fixed at 40 bytes</b> and simplified so routers work faster: no header checksum, no fragmentation by routers, options moved into chained extension headers.</p><p><b>Definition (RFC 8200).</b> Fields: version (6), traffic class, flow label, payload length (bytes after the 40-byte header), next header (like IPv4's protocol), hop limit (like TTL), 128-bit source and destination.</p>"
    },
    {
     "type": "packet",
     "title": "IPv6 fixed header (RFC 8200)",
     "width": 32,
     "fields": [
      {
       "name": "Version",
       "bits": 4,
       "note": "6"
      },
      {
       "name": "Traffic class",
       "bits": 8,
       "note": "DSCP + ECN, like IPv4's TOS byte"
      },
      {
       "name": "Flow label",
       "bits": 20,
       "note": "marks packets of one flow for special handling"
      },
      {
       "name": "Payload length",
       "bits": 16,
       "note": "bytes AFTER the 40-byte header (extension headers + data)"
      },
      {
       "name": "Next header",
       "bits": 8,
       "note": "6 TCP, 17 UDP, 58 ICMPv6, or an extension header"
      },
      {
       "name": "Hop limit",
       "bits": 8,
       "note": "decremented per hop; the TTL equivalent"
      },
      {
       "name": "Source address",
       "bits": 128,
       "note": "128-bit"
      },
      {
       "name": "Destination address",
       "bits": 128,
       "note": "128-bit"
      }
     ],
     "caption": "320 bits = 40 bytes, always."
    },
    {
     "type": "table",
     "head": [
      "Feature",
      "IPv4",
      "IPv6"
     ],
     "rows": [
      [
       "Address size",
       "32 bits ($2^{32}$ ≈ 4.3 × $10^9$)",
       "128 bits ($2^{128}$ ≈ 3.4 × $10^{38}$)"
      ],
      [
       "Header size",
       "20–60 bytes (IHL)",
       "fixed 40 bytes"
      ],
      [
       "Header checksum",
       "yes, recomputed each hop",
       "none (link and transport layers check)"
      ],
      [
       "Fragmentation",
       "by sender and routers",
       "only by the sender (Fragment extension header); routers send ICMPv6 Packet Too Big"
      ],
      [
       "Options",
       "in the header (0–40 bytes)",
       "extension headers chained by Next header"
      ],
      [
       "Lifetime field",
       "TTL",
       "Hop limit"
      ],
      [
       "Length field",
       "Total length (includes header)",
       "Payload length (excludes the 40-byte header)"
      ],
      [
       "Address notation",
       "dotted decimal 192.168.0.1",
       "8 groups of 4 hex digits, :: compresses one run of zero groups"
      ],
      [
       "Minimum MTU",
       "68 bytes",
       "1280 bytes"
      ]
     ],
     "caption": "IPv4 vs IPv6 for MCQs."
    },
    {
     "type": "derivation",
     "title": "Why the IPv6 header is exactly 40 bytes",
     "steps": [
      {
       "tex": "4 + 8 + 20 = 32 \\text{ bits}",
       "why": "Version, traffic class and flow label fill row 1."
      },
      {
       "tex": "16 + 8 + 8 = 32 \\text{ bits}",
       "why": "Payload length, next header and hop limit fill row 2."
      },
      {
       "tex": "128 + 128 = 256 \\text{ bits}",
       "why": "Two addresses = 8 more rows."
      },
      {
       "tex": "32 + 32 + 256 = 320 \\text{ bits} = 40 \\text{ bytes}",
       "why": "No variable-length fields, so the size never changes."
      },
      {
       "tex": "\\text{total size} = 40 + \\text{payload length}",
       "why": "Payload length excludes the fixed header."
      }
     ]
    },
    {
     "type": "worked",
     "title": "Same TCP segment over IPv4 and IPv6",
     "tag": "University-Midsem-style",
     "problem": "<p>A 20-byte TCP header plus 1000 bytes of data is sent once over IPv4 (no options) and once over IPv6 (no extension headers). Give the IPv4 total-length field, the IPv6 payload-length field, and each packet's size.</p>",
     "steps": [
      {
       "tex": "20 + 1000 = 1020",
       "why": "Transport segment size."
      },
      {
       "tex": "\\text{IPv4 total length} = 20 + 1020 = 1040",
       "why": "IPv4's length counts its own 20-byte header."
      },
      {
       "tex": "\\text{IPv6 payload length} = 1020",
       "why": "IPv6's length excludes the 40-byte fixed header."
      },
      {
       "tex": "\\text{IPv6 packet} = 40 + 1020 = 1060",
       "why": "20 bytes more than IPv4 for the same segment."
      }
     ],
     "answer": "<b>IPv4: total length 1040 (packet 1040 B); IPv6: payload length 1020 (packet 1060 B).</b>"
    },
    {
     "type": "cheat",
     "title": "IPv6 essentials",
     "items": [
      "Header always 40 bytes",
      "No checksum; routers do not fragment",
      "Hop limit = TTL; next header = protocol",
      "Payload length excludes the header",
      "2001:db8::/32 is the documentation prefix (RFC 3849)"
     ]
    },
    {
     "type": "traps",
     "items": [
      "IPv6 payload length does <b>not</b> include the 40-byte header; IPv4 total length does include its header.",
      "\"::\" may appear only once in an address.",
      "IPv6 routers never fragment; too-big packets are dropped and the sender is told via ICMPv6."
     ]
    }
   ],
   "practice": [
    {
     "id": "u13-G-1",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "13.11",
     "q": "<p>An IPv6 packet (no extension headers) is 1280 bytes long. What is its payload length field? (bytes, integer)</p>",
     "answer": 1240,
     "tol": 0,
     "unit": "bytes",
     "verify": "1280-40",
     "steps": [
      {
       "tex": "1280 - 40 = 1240",
       "why": "Payload length excludes the fixed 40-byte header."
      }
     ],
     "explain": "<p><b>1240</b>.</p>"
    },
    {
     "id": "u13-G-2",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "13.11",
     "q": "<p>Which IPv4 header field has <b>no</b> counterpart in the IPv6 fixed header?</p>",
     "options": [
      "TTL",
      "Protocol",
      "Header checksum",
      "Source address"
     ],
     "answer": 2,
     "why": [
      "Renamed Hop limit.",
      "Renamed Next header.",
      "Removed to speed up forwarding; transport and link layers already check.",
      "Still present, but 128 bits."
     ],
     "explain": "<p><b>Header checksum</b>.</p>"
    },
    {
     "id": "u13-G-3",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "13.11",
     "q": "<p>Predict the exact output (RFC 5952 compressed form).</p>",
     "code": "import ipaddress\nprint(ipaddress.ip_address('2001:0db8:0000:0000:0000:ff00:0042:8329'))",
     "answer": "2001:db8::ff00:42:8329",
     "runCheck": true,
     "explain": "<p>Leading zeros in each group are dropped and the longest run of zero groups (three groups) becomes \"::\".</p>"
    },
    {
     "id": "u13-G-4",
     "type": "msq",
     "tag": "University-Midsem-style",
     "topic": "13.11",
     "q": "<p>Select ALL true statements about IPv6.</p>",
     "options": [
      "Its fixed header is always 40 bytes",
      "Routers fragment oversized packets",
      "Addresses are 128 bits",
      "Hop limit plays the role of IPv4's TTL"
     ],
     "answer": [
      0,
      2,
      3
     ],
     "why": [
      "320 bits = 40 bytes.",
      "Only the source fragments; routers send ICMPv6 Packet Too Big.",
      "Four times the IPv4 32 bits.",
      "Decremented at each router."
     ],
     "explain": "<p>1, 3 and 4.</p>"
    }
   ]
  }
 ]
};
