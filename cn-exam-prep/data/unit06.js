// Unit unit06 data (schema: cn-exam-prep/SCHEMA.md). Plain double-quoted JS; every LaTeX backslash is doubled.
window.UNITS = window.UNITS || {};
window.UNITS["unit06"] = {
 "id": "unit06",
 "num": 6,
 "day": 2,
 "title": "HTTPS, Cryptography & the TLS Handshake",
 "lectures": "Lecture 6 · WB-L06; WB-L08 p55–67, p93–110; SL-L12 p12",
 "overview": "<p>HTTP is plain text; HTTPS wraps it in TLS to give confidentiality, integrity and authentication. Learn symmetric vs asymmetric encryption (and the key counts n(n−1)/2 vs 2n), break a Caesar cipher by brute force, follow the Alice–Bob–Mallory key-substitution attack, and see how certificates and the CA chain stop it. The handshake numericals are RTT counts: a fresh HTTPS GET costs TCP 1 + TLS 1.2 2 (or TLS 1.3 1) + HTTP 1 RTT. In AWS, ACM issues free auto-renewed certificates and the ALB terminates TLS.</p>",
 "sections": [
  {
   "id": "06-A",
   "title": "HTTP Is Plain Text; HTTPS = HTTP + TLS; the Three Goals of Cryptography",
   "badge": "class",
   "source": "WB-L06 p4–11",
   "covers": [
    "06.1",
    "06.2"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "Postcards vs sealed, signed envelopes",
     "html": "<p><b>Analogy.</b> Plain HTTP is a <b>postcard</b>: every post office (Wi-Fi router, ISP, transit network) can read it and even rewrite it. HTTPS puts the same letter in a <b>sealed envelope</b> (confidentiality) with a <b>tamper-evident seal</b> (integrity), addressed to a recipient whose <b>ID card</b> you checked first (authentication).</p><p><b>Definitions (WB-L06 p5–10).</b> HTTP lacks built-in security: anyone who can capture the traffic can read the client–server conversation (p5). <b>HTTPS = HTTP + TLS</b>: the secure version of HTTP, historically over SSL (Secure Sockets Layer), now over <b>TLS</b> (Transport Layer Security) which encrypts data between client and server (p6); default port <b>443</b>. <b>Cryptography</b> is the practice of securing information by converting readable text (plaintext) into unreadable code (ciphertext) and back again (p9). Its three goals (p10): <b>Confidentiality</b> (only authorised parties can read: no eavesdropping), <b>Integrity</b> (data is not altered in transit: no tampering), <b>Authentication</b> (verified identity of the parties).</p>"
    },
    {
     "type": "figure",
     "html": "<svg viewBox='0 0 640 120' width='100%' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'><defs><marker id='arr' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='currentColor'/></marker></defs><rect x='10' y='40' width='64' height='46' rx='4' fill='none' stroke='currentColor' stroke-width='2'/><text x='42' y='60' font-size='12' fill='currentColor' text-anchor='middle' font-weight='bold'>\"Hello\"</text><text x='42' y='77' font-size='9' fill='var(--muted)' text-anchor='middle'>plaintext</text><rect x='150' y='40' width='110' height='46' rx='4' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='205' y='60' font-size='12' fill='currentColor' text-anchor='middle' font-weight='bold'>Encrypt</text><text x='205' y='77' font-size='9' fill='var(--muted)' text-anchor='middle'>E_k(x) = x + 2 mod 26</text><rect x='290' y='40' width='110' height='46' rx='4' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='345' y='60' font-size='12' fill='currentColor' text-anchor='middle' font-weight='bold'>\"Jgnnq\"</text><text x='345' y='77' font-size='9' fill='var(--muted)' text-anchor='middle'>ciphertext</text><rect x='430' y='40' width='110' height='46' rx='4' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='485' y='60' font-size='12' fill='currentColor' text-anchor='middle' font-weight='bold'>Decrypt</text><text x='485' y='77' font-size='9' fill='var(--muted)' text-anchor='middle'>D_k(y) = y - 2 mod 26</text><rect x='570' y='40' width='64' height='46' rx='4' fill='none' stroke='currentColor' stroke-width='2'/><text x='602' y='60' font-size='12' fill='currentColor' text-anchor='middle' font-weight='bold'>\"Hello\"</text><text x='602' y='77' font-size='9' fill='var(--muted)' text-anchor='middle'>plaintext</text><line x1='74' y1='63' x2='150' y2='63' stroke='currentColor' stroke-width='1.5' marker-end='url(#arr)'/><line x1='260' y1='63' x2='290' y2='63' stroke='currentColor' stroke-width='1.5' marker-end='url(#arr)'/><line x1='400' y1='63' x2='430' y2='63' stroke='currentColor' stroke-width='1.5' marker-end='url(#arr)'/><line x1='540' y1='63' x2='570' y2='63' stroke='currentColor' stroke-width='1.5' marker-end='url(#arr)'/><text x='205' y='26' font-size='11' fill='var(--warn)' text-anchor='middle'>key k = 2</text><text x='485' y='26' font-size='11' fill='var(--warn)' text-anchor='middle'>key k = 2 (same key: symmetric)</text><text x='320' y='110' font-size='10.5' fill='var(--muted)' text-anchor='middle'>WB-L06 p9 pipeline with the slide's ciphertext corrected to the consistent shift-2 result</text></svg>",
     "caption": "Encryption/decryption pipeline (WB-L06 p9 and p12)."
    },
    {
     "type": "callout",
     "kind": "slidefix",
     "title": "WB-L06 p9: \"Hello\" → \"jknnq\"",
     "html": "<p>The slide's ciphertext <code>jknnq</code> is not produced by any single shift: H→j and l→n, o→q are shifts of +2, but e→k is a shift of +6. A consistent Caesar shift of 2 gives <b><code>Jgnnq</code></b> (H 7→9 J, e 4→6 g, l 11→13 n, l→n, o 14→16 q). A cipher must use one rule and one key, otherwise the receiver cannot decrypt.</p>"
    },
    {
     "type": "callout",
     "kind": "key",
     "title": "The padlock question (WB-L06 p7)",
     "html": "<p>What does 🔒 mean? <b>Encrypted connection: yes. Verified identity (the certificate matches this domain name): yes. Safe website: NO.</b> A phishing site can own a perfectly valid certificate for its own look-alike domain. The padlock proves who you are talking to and that nobody in between can read or change it, not that the owner is honest.</p>"
    },
    {
     "type": "table",
     "head": [
      "Goal (WB-L06 p10)",
      "Threat it stops (WB-L08 p102)",
      "Tool in TLS"
     ],
     "rows": [
      [
       "Confidentiality",
       "Eavesdropping (reading packets on the path)",
       "symmetric encryption (AES-GCM, ChaCha20) with the session key"
      ],
      [
       "Integrity",
       "Tampering (e.g. changing \"r\":\"3\" to \"r\":\"1\" to become admin)",
       "MAC / AEAD tag on every record (HMAC in TLS 1.2 CBC suites; GCM tag in TLS 1.3)"
      ],
      [
       "Authentication",
       "Impersonation (a fake server pretending to be the bank)",
       "certificate signed by a CA + proof of the private key (signature)"
      ]
     ],
     "caption": "Each goal, the attack it defeats and the mechanism TLS uses."
    },
    {
     "type": "code",
     "file": "Unit06_hash_hmac.py",
     "level": "high",
     "title": "hashlib and hmac: why a bare hash does not give integrity but an HMAC does",
     "note": "Recreates the WB-L08 p102 tampering example. Mallory can recompute a plain SHA-256 of her altered JSON, but cannot forge an HMAC without the key."
    },
    {
     "type": "cheat",
     "items": [
      "HTTPS = HTTP over TLS, TCP port 443 (HTTP/3: UDP 443). HTTP = port 80, plain text.",
      "SSL 2.0/3.0 and TLS 1.0/1.1 are deprecated (RFC 8996); use TLS 1.2 or 1.3.",
      "CIA here = Confidentiality, Integrity, Authentication.",
      "Padlock = encrypted + identity verified, not \"safe\".",
      "Hash (SHA-256: 256-bit digest) detects accidental change; HMAC (hash + secret key) detects deliberate tampering."
     ]
    },
    {
     "type": "traps",
     "items": [
      "HTTPS encrypts headers, URL path, query string and body; the destination <b>IP address</b>, port and (without ECH) the server name in the ClientHello SNI are still visible.",
      "TLS protects data <b>in transit</b> only, not data stored on the server.",
      "Encryption alone does not give integrity or authentication; you also need MACs and certificates.",
      "A plain hash sent next to the message protects nothing against an attacker who can change both."
     ]
    }
   ],
   "practice": [
    {
     "id": "u06-A-1",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "06.1",
     "q": "<p>A browser shows the padlock for <code>https://paypa1-login.example</code>. What does the padlock guarantee?</p>",
     "options": [
      "The site is safe and trustworthy",
      "The connection is encrypted and the certificate is valid for paypa1-login.example",
      "The site belongs to PayPal",
      "The server cannot be hacked"
     ],
     "answer": 1,
     "why": [
      "WB-L06 p7: \"Safe website? ❌\".",
      "Correct: encryption + identity of <i>that</i> name.",
      "The certificate is for the look-alike name, not paypal.com.",
      "TLS says nothing about server security."
     ],
     "explain": "<p>Encrypted connection and verified identity, nothing more.</p>"
    },
    {
     "id": "u06-A-2",
     "type": "msq",
     "tag": "University-Midsem-style",
     "topic": "06.2",
     "q": "<p>Which of these are the core goals of cryptography listed on WB-L06 p10? (Select all that apply.)</p>",
     "options": [
      "Confidentiality",
      "Integrity",
      "Availability",
      "Authentication",
      "Compression"
     ],
     "answer": [
      0,
      1,
      3
     ],
     "why": [
      "No eavesdropping.",
      "No tampering.",
      "Availability is part of the security CIA triad but not a goal of cryptography on this slide; DDoS is not solved by encryption.",
      "Verified identity.",
      "Compression is a presentation-layer function, not a security goal."
     ],
     "explain": "<p>Confidentiality, Integrity, Authentication.</p>"
    },
    {
     "id": "u06-A-3",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "06.2",
     "q": "<p>An attacker on café Wi-Fi changes <code>\"r\":\"3\"</code> to <code>\"r\":\"1\"</code> in a JSON response (WB-L08 p102). Which goal was violated?</p>",
     "options": [
      "Confidentiality",
      "Integrity",
      "Authentication",
      "Non-repudiation"
     ],
     "answer": 1,
     "why": [
      "Reading is eavesdropping; here data was <i>changed</i>.",
      "Correct: tampering breaks integrity.",
      "No identity was faked.",
      "Not on the slide, and not what happened."
     ],
     "explain": "<p>Tampering = integrity failure; a MAC would detect it.</p>"
    },
    {
     "id": "u06-A-4",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "06.1",
     "q": "<p>Default TCP port for HTTPS?</p>",
     "options": [
      "80",
      "8080",
      "443",
      "22"
     ],
     "answer": 2,
     "why": [
      "HTTP.",
      "A common alternate HTTP port.",
      "Correct.",
      "SSH."
     ],
     "explain": "<p>443.</p>"
    },
    {
     "id": "u06-A-5",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "06.2",
     "q": "<p>Predict the exact output.</p>",
     "code": "import hashlib\nd = hashlib.sha256(b'abc').digest()\nprint(len(d), len(d.hex()), d.hex()[:8])",
     "answer": "32 64 ba7816bf",
     "runCheck": true,
     "explain": "<p>SHA-256 gives 32 bytes = 64 hex characters; SHA-256(\"abc\") starts ba7816bf (FIPS 180-2 test vector).</p>"
    },
    {
     "id": "u06-A-6",
     "type": "mcq",
     "tag": "GATE-style",
     "topic": "06.2",
     "q": "<p>Mallory changes a message and also replaces the SHA-256 digest sent next to it with the digest of her new message. The receiver recomputes SHA-256. Result?</p>",
     "options": [
      "Tampering detected",
      "Tampering not detected",
      "The receiver cannot compute SHA-256",
      "The message is decrypted"
     ],
     "answer": 1,
     "why": [
      "Only if the digest were keyed (HMAC) or signed.",
      "Correct: a public hash function has no secret, so anyone can recompute it.",
      "Hash functions are public.",
      "Hashing is not encryption."
     ],
     "explain": "<p>Use HMAC with a shared secret key, or a digital signature. See Unit06_hash_hmac.py.</p>"
    }
   ]
  },
  {
   "id": "06-B",
   "title": "Symmetric vs Asymmetric Encryption, Key Distribution, Toy RSA and Diffie–Hellman",
   "badge": "class",
   "source": "WB-L06 p12–15; WB-L08 p65–66; Kurose & Ross 8e §8.2 (RSA, key counts, DH)",
   "covers": [
    "06.3"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "One shared house key vs a public padlock",
     "html": "<p><b>Analogy.</b> <b>Symmetric</b>: you and a friend own copies of the same key; whoever has it can lock and unlock. The problem is getting the copy to your friend without a thief copying it on the way (WB-L06 p14: \"how to share the key securely?\"). <b>Asymmetric</b>: you hand out open padlocks to anyone (public key) but keep the only key that opens them (private key). Anyone can lock a box for you; only you can open it.</p><p><b>Definitions.</b> Symmetric encryption uses the <b>same secret key</b> to encrypt and decrypt (WB-L06 p13; AES, ChaCha20): fast. Asymmetric (public-key) encryption encrypts with the recipient's <b>public key</b> and decrypts with the matching <b>private key</b> (p15; RSA, elliptic curves): slow but no secret has to be shared in advance. TLS uses asymmetric crypto only to agree on a <b>session key</b>, then symmetric crypto for the data (WB-L06 p16 boxes \"Asymmetric\" for the key exchange, \"Symmetric\" for data transmission).</p>"
    },
    {
     "type": "figure",
     "html": "<svg viewBox='0 0 640 246' width='100%' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'><defs><marker id='arr' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='currentColor'/></marker></defs><text x='10' y='30' font-size='12' fill='var(--warn)' text-anchor='start' font-weight='bold'>Symmetric (WB-L06 p13)</text><rect x='10' y='42' width='120' height='36' rx='4' fill='none' stroke='currentColor' stroke-width='1.8'/><text x='70' y='65' font-size='11' fill='currentColor' text-anchor='middle'>plaintext</text><rect x='170' y='42' width='120' height='36' rx='4' fill='none' stroke='var(--warn)' stroke-width='1.8'/><text x='230' y='65' font-size='11' fill='currentColor' text-anchor='middle'>encrypt</text><rect x='330' y='42' width='120' height='36' rx='4' fill='none' stroke='currentColor' stroke-width='1.8'/><text x='390' y='65' font-size='11' fill='currentColor' text-anchor='middle'>ciphertext</text><rect x='490' y='42' width='120' height='36' rx='4' fill='none' stroke='var(--warn)' stroke-width='1.8'/><text x='550' y='65' font-size='11' fill='currentColor' text-anchor='middle'>decrypt</text><line x1='130' y1='60' x2='170' y2='60' stroke='currentColor' stroke-width='1.5' marker-end='url(#arr)'/><line x1='290' y1='60' x2='330' y2='60' stroke='currentColor' stroke-width='1.5' marker-end='url(#arr)'/><line x1='450' y1='60' x2='490' y2='60' stroke='currentColor' stroke-width='1.5' marker-end='url(#arr)'/><line x1='610' y1='60' x2='630' y2='60' stroke='currentColor' stroke-width='1.5' marker-end='url(#arr)'/><text x='230' y='96' font-size='10' fill='var(--warn)' text-anchor='middle'>shared secret key K</text><text x='550' y='96' font-size='10' fill='var(--warn)' text-anchor='middle'>same key K</text><text x='10' y='140' font-size='12' fill='var(--ok)' text-anchor='start' font-weight='bold'>Asymmetric (WB-L06 p15)</text><rect x='10' y='152' width='120' height='36' rx='4' fill='none' stroke='currentColor' stroke-width='1.8'/><text x='70' y='175' font-size='11' fill='currentColor' text-anchor='middle'>plaintext</text><rect x='170' y='152' width='120' height='36' rx='4' fill='none' stroke='var(--ok)' stroke-width='1.8'/><text x='230' y='175' font-size='11' fill='currentColor' text-anchor='middle'>encrypt</text><rect x='330' y='152' width='120' height='36' rx='4' fill='none' stroke='currentColor' stroke-width='1.8'/><text x='390' y='175' font-size='11' fill='currentColor' text-anchor='middle'>ciphertext</text><rect x='490' y='152' width='120' height='36' rx='4' fill='none' stroke='var(--ok)' stroke-width='1.8'/><text x='550' y='175' font-size='11' fill='currentColor' text-anchor='middle'>decrypt</text><line x1='130' y1='170' x2='170' y2='170' stroke='currentColor' stroke-width='1.5' marker-end='url(#arr)'/><line x1='290' y1='170' x2='330' y2='170' stroke='currentColor' stroke-width='1.5' marker-end='url(#arr)'/><line x1='450' y1='170' x2='490' y2='170' stroke='currentColor' stroke-width='1.5' marker-end='url(#arr)'/><line x1='610' y1='170' x2='630' y2='170' stroke='currentColor' stroke-width='1.5' marker-end='url(#arr)'/><text x='230' y='206' font-size='10' fill='var(--ok)' text-anchor='middle'>Bob's PUBLIC key</text><text x='550' y='206' font-size='10' fill='var(--ok)' text-anchor='middle'>Bob's PRIVATE key</text><text x='320' y='238' font-size='9.5' fill='var(--muted)' text-anchor='middle'>Asymmetric solves key distribution (publish the public key) but is ~1000x slower, so TLS uses it only to agree on a symmetric session key.</text></svg>",
     "caption": "WB-L06 p13 and p15 redrawn."
    },
    {
     "type": "derivation",
     "title": "How many keys do n users need?",
     "steps": [
      {
       "tex": "\\text{pairs} = \\binom{n}{2} = \\frac{n(n-1)}{2}",
       "why": "Symmetric: every pair that may talk privately needs its own secret key."
      },
      {
       "tex": "K_{sym}(100) = \\frac{100\\times99}{2} = 4950",
       "why": "Example with 100 users."
      },
      {
       "tex": "K_{asym} = 2n",
       "why": "Asymmetric: each user owns one key pair (public + private), whoever they talk to."
      },
      {
       "tex": "K_{asym}(100) = 200\\ (100 \\text{ public} + 100 \\text{ private})",
       "why": "Example with 100 users; only 100 of them must be kept secret."
      },
      {
       "tex": "n = 1000:\\ 499500 \\text{ vs } 2000",
       "why": "The symmetric count grows as n², the asymmetric one linearly."
      }
     ]
    },
    {
     "type": "derivation",
     "title": "Toy RSA: p = 61, q = 53, e = 17, encrypt m = 65",
     "steps": [
      {
       "tex": "n = p\\,q = 61\\times53 = 3233",
       "why": "Public modulus."
      },
      {
       "tex": "\\varphi(n) = (p-1)(q-1) = 60\\times52 = 3120",
       "why": "Euler's totient; kept secret."
      },
      {
       "tex": "\\gcd(17, 3120) = 1",
       "why": "e must be coprime to φ(n) so that it has an inverse."
      },
      {
       "tex": "3120 = 183\\times17 + 9;\\ 17 = 1\\times9 + 8;\\ 9 = 1\\times8 + 1",
       "why": "Extended Euclid, forward pass."
      },
      {
       "tex": "1 = 9 - 8 = 2\\times9 - 17 = 2\\times3120 - 367\\times17",
       "why": "Back-substitute: 8 = 17 − 9, then 9 = 3120 − 183·17."
      },
      {
       "tex": "d \\equiv -367 \\equiv 2753 \\pmod{3120}",
       "why": "Check: 17 × 2753 = 46801 = 15 × 3120 + 1."
      },
      {
       "tex": "65^2 \\bmod 3233 = 4225 - 3233 = 992",
       "why": "Square-and-multiply for 65^17 (17 = 10001 in binary)."
      },
      {
       "tex": "65^4 = 992^2 = 984064 \\equiv 984064 - 304\\times3233 = 1232",
       "why": "Square again."
      },
      {
       "tex": "65^8 = 1232^2 = 1517824 \\equiv 1517824 - 469\\times3233 = 1547",
       "why": "Square again."
      },
      {
       "tex": "65^{16} = 1547^2 = 2393209 \\equiv 2393209 - 740\\times3233 = 789",
       "why": "Square again."
      },
      {
       "tex": "c = 65^{17} = 789\\times65 = 51285 \\equiv 51285 - 15\\times3233 = 2790",
       "why": "Multiply by 65^1 for the remaining 1 bit."
      },
      {
       "tex": "m = 2790^{2753} \\bmod 3233 = 65",
       "why": "Decryption with the private exponent recovers the message."
      }
     ]
    },
    {
     "type": "derivation",
     "title": "Toy Diffie–Hellman: p = 23, g = 5, a = 6, b = 15",
     "steps": [
      {
       "tex": "A = g^a \\bmod p = 5^6 \\bmod 23 = 15625 \\bmod 23 = 8",
       "why": "Alice sends A in the clear (15625 − 679×23 = 8)."
      },
      {
       "tex": "B = g^b \\bmod p = 5^{15} \\bmod 23 = 19",
       "why": "Bob sends B in the clear."
      },
      {
       "tex": "s_A = B^a = 19^6 \\bmod 23 = 2",
       "why": "Alice combines Bob's public value with her secret a."
      },
      {
       "tex": "s_B = A^b = 8^{15} \\bmod 23 = 2",
       "why": "Bob gets the same value: both equal g^(ab) mod p."
      },
      {
       "tex": "\\text{Eve sees } p, g, A, B \\text{ but not } a, b",
       "why": "Recovering a from A is the discrete-logarithm problem: hard for large p."
      }
     ]
    },
    {
     "type": "worked",
     "title": "RSA with p = 5, q = 11 by hand",
     "tag": "GATE-style",
     "problem": "<p>RSA with p = 5, q = 11 and public exponent e = 3. Find n, φ(n), d, and encrypt m = 9.</p>",
     "steps": [
      {
       "tex": "n = 55,\\quad \\varphi = 4\\times10 = 40",
       "why": "n = pq; φ = (p−1)(q−1)."
      },
      {
       "tex": "3d \\equiv 1 \\pmod{40} \\Rightarrow d = 27",
       "why": "3 × 27 = 81 = 2 × 40 + 1."
      },
      {
       "tex": "9^2 = 81 \\equiv 26,\\quad 9^3 = 26\\times9 = 234 \\equiv 234 - 4\\times55 = 14",
       "why": "c = m^e mod n."
      },
      {
       "text": "Decrypt check: 14^27 mod 55 = 9.",
       "why": "pow(14, 27, 55) returns 9."
      }
     ],
     "answer": "<p>n = 55, φ = 40, <b>d = 27</b>, <b>c = 14</b>.</p>"
    },
    {
     "type": "code",
     "file": "Unit06_toy_rsa_dh.py",
     "level": "low",
     "title": "Toy RSA (extended Euclid, square-and-multiply), toy signature, toy DH and the DH man-in-the-middle"
    },
    {
     "type": "cheat",
     "items": [
      "Symmetric: one shared key, fast (AES); keys needed $n(n-1)/2$.",
      "Asymmetric: public/private pair, slow (RSA, ECC); keys needed $2n$.",
      "Encrypt for confidentiality with the <b>receiver's public</b> key; sign with the <b>sender's private</b> key.",
      "RSA: $n=pq$, $\\varphi=(p-1)(q-1)$, $ed \\equiv 1 \\pmod{\\varphi}$, $c=m^e \\bmod n$, $m=c^d \\bmod n$.",
      "DH: $A=g^a$, $B=g^b$, $s=g^{ab} \\bmod p$; unauthenticated DH is open to MITM."
     ]
    },
    {
     "type": "traps",
     "items": [
      "Encrypting with your <b>own private</b> key gives authenticity (a signature), not confidentiality: anyone with your public key can read it.",
      "2n counts both halves of each pair; \"n keys\" only counts the private ones.",
      "In RSA, d is the inverse of e mod φ(n), <b>not</b> mod n.",
      "DH by itself gives a shared secret, not authentication."
     ]
    }
   ],
   "practice": [
    {
     "id": "u06-B-1",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "06.3",
     "q": "<p>A company of 50 employees wants every pair to share a separate symmetric key. How many keys? (integer)</p>",
     "answer": 1225,
     "tol": 0,
     "unit": "keys",
     "verify": "50*49//2",
     "steps": [
      {
       "tex": "\\frac{n(n-1)}{2}",
       "why": "One key per pair."
      },
      {
       "tex": "\\frac{50\\times49}{2} = 1225",
       "why": "Substitute."
      }
     ],
     "explain": "<p>1225 keys (with public keys: 100).</p>",
     "formula": "\\frac{n(n-1)}{2}"
    },
    {
     "id": "u06-B-2",
     "type": "num",
     "tag": "GATE-style",
     "topic": "06.3",
     "q": "<p>Toy RSA with p = 61, q = 53, e = 17. Encrypt m = 65. Ciphertext c? (integer)</p>",
     "answer": 2790,
     "tol": 0,
     "unit": "",
     "verify": "pow(65, 17, 3233)",
     "steps": [
      {
       "tex": "n = 3233",
       "why": "61 × 53."
      },
      {
       "tex": "65^{16} \\bmod 3233 = 789",
       "why": "Repeated squaring: 992, 1232, 1547, 789."
      },
      {
       "tex": "789\\times65 = 51285 \\equiv 2790",
       "why": "51285 − 15 × 3233."
      }
     ],
     "explain": "<p>c = 2790.</p>"
    },
    {
     "id": "u06-B-3",
     "type": "num",
     "tag": "GATE-style",
     "topic": "06.3",
     "q": "<p>RSA with p = 3, q = 11, e = 7. Find the private exponent d (smallest positive). (integer)</p>",
     "answer": 3,
     "tol": 0,
     "unit": "",
     "verify": "pow(7, -1, 20)",
     "steps": [
      {
       "tex": "\\varphi = 2\\times10 = 20",
       "why": "(p−1)(q−1)."
      },
      {
       "tex": "7d \\equiv 1 \\pmod{20}",
       "why": "Definition of d."
      },
      {
       "tex": "7\\times3 = 21 = 20 + 1 \\Rightarrow d = 3",
       "why": "Try small multiples."
      }
     ],
     "explain": "<p>d = 3.</p>"
    },
    {
     "id": "u06-B-4",
     "type": "num",
     "tag": "GATE-style",
     "topic": "06.3",
     "q": "<p>Diffie–Hellman with p = 23, g = 5. Alice picks a = 4 and Bob b = 3. What is the shared secret? (integer)</p>",
     "answer": 18,
     "tol": 0,
     "unit": "",
     "verify": "pow(5, 4*3, 23)",
     "steps": [
      {
       "tex": "A = 5^4 \\bmod 23 = 625 \\bmod 23 = 4",
       "why": "625 − 27 × 23 = 4."
      },
      {
       "tex": "B = 5^3 \\bmod 23 = 125 \\bmod 23 = 10",
       "why": "125 − 115."
      },
      {
       "tex": "s = B^a = 10^4 \\bmod 23 = 10000 \\bmod 23 = 18",
       "why": "10000 − 434 × 23 = 18; check A^b = 4^3 = 64 mod 23 = 18."
      }
     ],
     "explain": "<p>18.</p>"
    },
    {
     "id": "u06-B-5",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "06.3",
     "q": "<p>Alice wants only Bob to read her message. She encrypts it with</p>",
     "options": [
      "Alice's private key",
      "Alice's public key",
      "Bob's public key",
      "Bob's private key"
     ],
     "answer": 2,
     "why": [
      "That is signing: anyone can decrypt with Alice's public key.",
      "Then only Alice could read it.",
      "Correct: only Bob's private key decrypts it (WB-L06 p15).",
      "Alice does not have Bob's private key."
     ],
     "explain": "<p>Confidentiality: receiver's public key. Signature: sender's private key.</p>"
    },
    {
     "id": "u06-B-6",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "06.3",
     "q": "<p>Why does TLS switch to symmetric encryption after the handshake?</p>",
     "options": [
      "Asymmetric encryption cannot encrypt text",
      "Symmetric ciphers are orders of magnitude faster for bulk data",
      "Symmetric keys never need to be exchanged",
      "Browsers do not support RSA"
     ],
     "answer": 1,
     "why": [
      "RSA/ECC can encrypt any bytes, just slowly and in small blocks.",
      "Correct: asymmetric solves key exchange; symmetric carries the data.",
      "The session key is exchanged, protected by asymmetric crypto.",
      "They do."
     ],
     "explain": "<p>Hybrid design: asymmetric for the key, symmetric (AES-GCM) for the data.</p>"
    },
    {
     "id": "u06-B-7",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "06.3",
     "q": "<p>Predict the exact output.</p>",
     "code": "p, q, e = 61, 53, 17\nn, phi = p * q, (p - 1) * (q - 1)\nd = pow(e, -1, phi)\nc = pow(65, e, n)\nprint(n, phi, d, c, pow(c, d, n))",
     "answer": "3233 3120 2753 2790 65",
     "runCheck": true,
     "explain": "<p>pow(e, -1, phi) (Python 3.8+) computes the modular inverse 2753.</p>"
    }
   ]
  },
  {
   "id": "06-C",
   "title": "Caesar and Substitution Ciphers; Brute Force",
   "badge": "class",
   "source": "WB-L08 p96–98 (= p55)",
   "covers": [
    "06.4"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "Shift the alphabet",
     "html": "<p><b>Analogy.</b> Two rings of letters, the inner one turned by k places: read the plaintext letter on the outer ring and write the letter under it. Julius Caesar used k = 3 for private letters.</p><p><b>Definition (WB-L08 p97).</b> A cipher is any method of transforming a message to conceal its meaning. Caesar cipher: number letters A = 0 to Z = 25, then $E_k(x) = (x+k) \\bmod 26$ and $D_k(y) = (y-k) \\bmod 26$; non-letters pass unchanged. It is a monoalphabetic <b>substitution</b> cipher with only <b>25 useful keys</b>, so it falls to brute force (try every k) or frequency analysis.</p>"
    },
    {
     "type": "figure",
     "html": "<svg viewBox='0 0 640 300' width='100%' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'><circle cx='160' cy='150' r='128' fill='none' stroke='var(--accent)' stroke-width='1.5'/><circle cx='160' cy='150' r='98' fill='none' stroke='var(--ok)' stroke-width='1.5'/><circle cx='160' cy='150' r='68' fill='none' stroke='var(--muted)' stroke-width='1'/><text x='160' y='41' font-size='11' fill='var(--accent)' text-anchor='middle'>A</text><text x='160' y='71' font-size='11' fill='var(--ok)' text-anchor='middle'>d</text><text x='187.043' y='44.2836' font-size='11' fill='var(--accent)' text-anchor='middle'>B</text><text x='179.863' y='73.4118' font-size='11' fill='var(--ok)' text-anchor='middle'>e</text><text x='212.514' y='53.9435' font-size='11' fill='var(--accent)' text-anchor='middle'>C</text><text x='198.572' y='80.5071' font-size='11' fill='var(--ok)' text-anchor='middle'>f</text><text x='234.933' y='69.4183' font-size='11' fill='var(--accent)' text-anchor='middle'>D</text><text x='215.039' y='91.8736' font-size='11' fill='var(--ok)' text-anchor='middle'>g</text><text x='252.997' y='89.8087' font-size='11' fill='var(--accent)' text-anchor='middle'>E</text><text x='228.308' y='106.851' font-size='11' fill='var(--ok)' text-anchor='middle'>h</text><text x='265.657' y='113.93' font-size='11' fill='var(--accent)' text-anchor='middle'>F</text><text x='237.606' y='124.568' font-size='11' fill='var(--ok)' text-anchor='middle'>i</text><text x='272.176' y='140.379' font-size='11' fill='var(--accent)' text-anchor='middle'>G</text><text x='242.395' y='143.995' font-size='11' fill='var(--ok)' text-anchor='middle'>j</text><text x='272.176' y='167.621' font-size='11' fill='var(--accent)' text-anchor='middle'>H</text><text x='242.395' y='164.005' font-size='11' fill='var(--ok)' text-anchor='middle'>k</text><text x='265.657' y='194.07' font-size='11' fill='var(--accent)' text-anchor='middle'>I</text><text x='237.606' y='183.432' font-size='11' fill='var(--ok)' text-anchor='middle'>l</text><text x='252.997' y='218.191' font-size='11' fill='var(--accent)' text-anchor='middle'>J</text><text x='228.308' y='201.149' font-size='11' fill='var(--ok)' text-anchor='middle'>m</text><text x='234.933' y='238.582' font-size='11' fill='var(--accent)' text-anchor='middle'>K</text><text x='215.039' y='216.126' font-size='11' fill='var(--ok)' text-anchor='middle'>n</text><text x='212.514' y='254.057' font-size='11' fill='var(--accent)' text-anchor='middle'>L</text><text x='198.572' y='227.493' font-size='11' fill='var(--ok)' text-anchor='middle'>o</text><text x='187.043' y='263.716' font-size='11' fill='var(--accent)' text-anchor='middle'>M</text><text x='179.863' y='234.588' font-size='11' fill='var(--ok)' text-anchor='middle'>p</text><text x='160' y='267' font-size='11' fill='var(--accent)' text-anchor='middle'>N</text><text x='160' y='237' font-size='11' fill='var(--ok)' text-anchor='middle'>q</text><text x='132.957' y='263.716' font-size='11' fill='var(--accent)' text-anchor='middle'>O</text><text x='140.137' y='234.588' font-size='11' fill='var(--ok)' text-anchor='middle'>r</text><text x='107.486' y='254.057' font-size='11' fill='var(--accent)' text-anchor='middle'>P</text><text x='121.428' y='227.493' font-size='11' fill='var(--ok)' text-anchor='middle'>s</text><text x='85.0671' y='238.582' font-size='11' fill='var(--accent)' text-anchor='middle'>Q</text><text x='104.961' y='216.126' font-size='11' fill='var(--ok)' text-anchor='middle'>t</text><text x='67.0028' y='218.191' font-size='11' fill='var(--accent)' text-anchor='middle'>R</text><text x='91.6923' y='201.149' font-size='11' fill='var(--ok)' text-anchor='middle'>u</text><text x='54.3432' y='194.07' font-size='11' fill='var(--accent)' text-anchor='middle'>S</text><text x='82.3937' y='183.432' font-size='11' fill='var(--ok)' text-anchor='middle'>v</text><text x='47.8239' y='167.621' font-size='11' fill='var(--accent)' text-anchor='middle'>T</text><text x='77.6052' y='164.005' font-size='11' fill='var(--ok)' text-anchor='middle'>w</text><text x='47.8239' y='140.379' font-size='11' fill='var(--accent)' text-anchor='middle'>U</text><text x='77.6052' y='143.995' font-size='11' fill='var(--ok)' text-anchor='middle'>x</text><text x='54.3432' y='113.93' font-size='11' fill='var(--accent)' text-anchor='middle'>V</text><text x='82.3937' y='124.568' font-size='11' fill='var(--ok)' text-anchor='middle'>y</text><text x='67.0028' y='89.8087' font-size='11' fill='var(--accent)' text-anchor='middle'>W</text><text x='91.6923' y='106.851' font-size='11' fill='var(--ok)' text-anchor='middle'>z</text><text x='85.0671' y='69.4183' font-size='11' fill='var(--accent)' text-anchor='middle'>X</text><text x='104.961' y='91.8736' font-size='11' fill='var(--ok)' text-anchor='middle'>a</text><text x='107.486' y='53.9435' font-size='11' fill='var(--accent)' text-anchor='middle'>Y</text><text x='121.428' y='80.5071' font-size='11' fill='var(--ok)' text-anchor='middle'>b</text><text x='132.957' y='44.2836' font-size='11' fill='var(--accent)' text-anchor='middle'>Z</text><text x='140.137' y='73.4118' font-size='11' fill='var(--ok)' text-anchor='middle'>c</text><text x='160' y='146' font-size='11' fill='currentColor' text-anchor='middle'>shift</text><text x='160' y='164' font-size='14' fill='currentColor' text-anchor='middle' font-weight='bold'>k = 3</text><text x='450' y='60' font-size='12' fill='var(--accent)' text-anchor='middle'>outer ring: plaintext letter</text><text x='450' y='80' font-size='12' fill='var(--ok)' text-anchor='middle'>inner ring: ciphertext letter</text><text x='450' y='116' font-size='12' fill='currentColor' text-anchor='middle'>A to d, B to e, X to a, Y to b, Z to c</text><text x='450' y='150' font-size='13' fill='currentColor' text-anchor='middle' font-weight='bold'>E(x) = (x + k) mod 26</text><text x='450' y='172' font-size='13' fill='currentColor' text-anchor='middle' font-weight='bold'>D(y) = (y - k) mod 26</text><text x='450' y='206' font-size='11' fill='var(--bad)' text-anchor='middle'>only 25 useful keys: brute force</text><text x='450' y='224' font-size='11' fill='var(--bad)' text-anchor='middle'>tries them all in microseconds</text></svg>",
     "caption": "Cipher wheel for shift 3 (WB-L08 p97 shows wheels for 3 and −12)."
    },
    {
     "type": "derivation",
     "title": "Decrypting with a negative shift",
     "steps": [
      {
       "tex": "D_k(y) = (y - k) \\bmod 26 = (y + (26 - k)) \\bmod 26",
       "why": "Subtracting k is adding its complement."
      },
      {
       "tex": "k = 17 \\Rightarrow 26 - 17 = 9",
       "why": "So decrypting a shift-17 text = encrypting it again with shift 9."
      },
      {
       "tex": "\\text{G}: (6 - 17) \\bmod 26 = -11 \\bmod 26 = 15 = \\text{p}",
       "why": "First letter of the challenge."
      },
      {
       "tex": "\\text{z}: (25 - 17) = 8 = \\text{i};\\quad \\text{t}: (19-17) = 2 = \\text{c}",
       "why": "Next letters: p, i, c."
      }
     ]
    },
    {
     "type": "table",
     "head": [
      "Plaintext (WB-L08 p97)",
      "Shift 3 ciphertext"
     ],
     "rows": [
      [
       "Raj never catches the train.",
       "Udm qhyhu fdwfkhv wkh wudlq."
      ],
      [
       "Raj should have exercised a bit more.",
       "Udm vkrxog kdyh hahuflvhg d elw pruh."
      ],
      [
       "Simran was sad!",
       "Vlpudq zdv vdg!"
      ]
     ],
     "caption": "The slide's shift-3 example, verified by Unit06_caesar.py."
    },
    {
     "type": "worked",
     "title": "The WB-L08 p98 challenge: \"Gztkliv rsyz srrbz yrz dviv ufjk\"",
     "tag": "University-Midsem-style",
     "problem": "<p>The shift is unknown. Recover the plaintext (the slide invites a Python brute-force script).</p>",
     "steps": [
      {
       "text": "Try k = 1 to 25 and print each candidate; only one is readable.",
       "why": "25 keys only: brute force is instant."
      },
      {
       "tex": "k = 17:\\ \\text{G}\\to\\text{p},\\ \\text{z}\\to\\text{i},\\ \\text{t}\\to\\text{c},\\ \\text{k}\\to\\text{t},\\ \\text{l}\\to\\text{u},\\ \\text{i}\\to\\text{r},\\ \\text{v}\\to\\text{e}",
       "why": "Subtract 17 mod 26 from each letter of Gztkliv."
      },
      {
       "text": "rsyz → abhi, srrbz → baaki, yrz → hai, dviv → mere, ufjk → dost.",
       "why": "Same rule for every word."
      }
     ],
     "answer": "<p>Shift <b>17</b>: <b>\"picture abhi baaki hai mere dost\"</b> (the slide gives no answer; verified by brute force in Unit06_caesar.py).</p>"
    },
    {
     "type": "code",
     "file": "Unit06_caesar.py",
     "level": "low",
     "title": "Caesar encrypt/decrypt with ord() arithmetic, brute force of the challenge, key counts"
    },
    {
     "type": "cheat",
     "items": [
      "$E_k(x)=(x+k)\\bmod 26$, $D_k(y)=(y-k)\\bmod 26$, A = 0.",
      "Decrypt shift k = encrypt shift 26 − k.",
      "Key space 25 → brute force; frequency analysis also breaks any monoalphabetic substitution.",
      "Python: <code>chr((ord(c) - 97 + k) % 26 + 97)</code>."
     ]
    },
    {
     "type": "traps",
     "items": [
      "Python's <code>%</code> returns a non-negative result for a positive modulus: <code>(-11) % 26 = 15</code>; C/Java return −11.",
      "Uppercase and lowercase need different bases (65 and 97).",
      "A cipher with different shifts for different letters (like the slide's jknnq) is not a Caesar cipher."
     ]
    }
   ],
   "practice": [
    {
     "id": "u06-C-1",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "06.4",
     "q": "<p><b>Class challenge (WB-L08 p98).</b> Decrypt <code>Gztkliv rsyz srrbz yrz dviv ufjk</code>; the shift is unknown. Type the plaintext in lowercase.</p>",
     "answer": "picture abhi baaki hai mere dost",
     "verify": "''.join(chr((ord(c.lower())-97-17)%26+97) if c.isalpha() else c for c in 'Gztkliv rsyz srrbz yrz dviv ufjk')",
     "explain": "<p>Brute force all 25 shifts: shift <b>17</b> gives \"picture abhi baaki hai mere dost\".</p>"
    },
    {
     "id": "u06-C-2",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "06.4",
     "q": "<p>Predict the exact output.</p>",
     "code": "def enc(s, k):\n    return ''.join(chr((ord(c) - 65 + k) % 26 + 65) if c.isupper() else c for c in s)\nprint(enc('XYZ ABC', 3))",
     "answer": "ABC DEF",
     "runCheck": true,
     "explain": "<p>X(23)+3 = 26 mod 26 = 0 = A; wrap-around makes XYZ → ABC.</p>"
    },
    {
     "id": "u06-C-3",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "06.4",
     "q": "<p>Under a Caesar cipher with A = 0, the letter W (22) is encrypted with k = 9. What is the numeric value of the ciphertext letter? (integer 0–25)</p>",
     "answer": 5,
     "tol": 0,
     "unit": "",
     "verify": "(22+9)%26",
     "steps": [
      {
       "tex": "22 + 9 = 31",
       "why": "Add the key."
      },
      {
       "tex": "31 \\bmod 26 = 5 = \\text{F}",
       "why": "Wrap around."
      }
     ],
     "explain": "<p>5, the letter F.</p>"
    },
    {
     "id": "u06-C-4",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "06.4",
     "q": "<p>Why is the Caesar cipher insecure?</p>",
     "options": [
      "It uses a public key",
      "Its key space has only 25 useful keys",
      "It needs a CA",
      "It changes the message length"
     ],
     "answer": 1,
     "why": [
      "It is symmetric.",
      "Correct: brute force tries all keys instantly.",
      "No certificates involved.",
      "Length is preserved."
     ],
     "explain": "<p>Tiny key space.</p>"
    },
    {
     "id": "u06-C-5",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "06.4",
     "q": "<p>A text was encrypted with shift 17. Which <b>encryption</b> shift decrypts it?</p>",
     "options": [
      "17",
      "9",
      "13",
      "−9"
     ],
     "answer": 1,
     "why": [
      "That encrypts it again.",
      "Correct: 26 − 17 = 9.",
      "13 is ROT13, its own inverse only for k = 13.",
      "−9 would be the same as +17."
     ],
     "explain": "<p>(y − 17) mod 26 = (y + 9) mod 26.</p>"
    },
    {
     "id": "u06-C-6",
     "type": "write",
     "tag": "University-Midsem-style",
     "topic": "06.4",
     "q": "<p>Write <code>brute_force(cipher)</code> that tries every Caesar shift, prints each candidate, and returns the shift whose output contains the most common words. Show it recovers shift 17 for the class challenge.</p>",
     "starter": "def caesar(text, k):\n    pass\n\ndef brute_force(cipher):\n    pass\n",
     "solutionFile": "Unit06_caesar.py",
     "rubric": [
      "Shifts letters with ord/chr and % 26, preserving case and non-letters",
      "Loops k = 1 to 25",
      "Scores candidates (word list or letter frequency)",
      "Returns 17 for the challenge"
     ],
     "explain": "<p>See the model solution.</p>"
    }
   ]
  },
  {
   "id": "06-D",
   "title": "Alice, Bob and Mallory: MITM, Tampering, Eavesdropping, Impersonation",
   "badge": "class",
   "source": "WB-L08 p99–103 (= p56–60)",
   "covers": [
    "06.5"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "The friendly middleman",
     "html": "<p><b>Analogy.</b> You ask a stranger to pass your sealed letter and padlock to a friend. The stranger keeps your padlock, gives your friend <i>his own</i> padlock, opens every box you send, reads it, edits it and re-locks it for the other side. Both of you think the line is private.</p><p><b>Definition (WB-L08 p101).</b> A <b>man-in-the-middle (MITM)</b> attack is an online attack where a hacker gets in between a user and the website they are visiting, keeping two separate connections. The three threats (p102): <b>eavesdropping</b> (reading), <b>tampering</b> (changing data, e.g. a JSON field \"r\":\"3\" → \"r\":\"1\" making a user an admin) and <b>impersonation</b> (pretending to be someone else). Alice and Bob have been the standard names since the 1978 RSA paper; Eve eavesdrops, <b>Mallory</b> is the active (malicious) attacker (p103 comic).</p>"
    },
    {
     "type": "figure",
     "html": "<svg viewBox='0 0 640 390' width='100%' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'><defs><marker id='arr' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='currentColor'/></marker></defs><rect x='45' y='10' width='90' height='28' rx='4' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='90' y='29' font-size='12' fill='var(--accent)' text-anchor='middle' font-weight='bold'>Alice</text><line x1='90' y1='38' x2='90' y2='380' stroke='var(--muted)' stroke-width='1' stroke-dasharray='4 4'/><rect x='275' y='10' width='90' height='28' rx='4' fill='none' stroke='var(--bad)' stroke-width='2'/><text x='320' y='29' font-size='12' fill='var(--bad)' text-anchor='middle' font-weight='bold'>Mallory</text><line x1='320' y1='38' x2='320' y2='380' stroke='var(--muted)' stroke-width='1' stroke-dasharray='4 4'/><rect x='505' y='10' width='90' height='28' rx='4' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='550' y='29' font-size='12' fill='var(--accent)' text-anchor='middle' font-weight='bold'>Bob</text><line x1='550' y1='38' x2='550' y2='380' stroke='var(--muted)' stroke-width='1' stroke-dasharray='4 4'/><line x1='90' y1='64' x2='320' y2='82' stroke='currentColor' stroke-width='1.6' marker-end='url(#arr)'/><text x='205' y='61' font-size='9.5' fill='currentColor' text-anchor='middle'>Hi Bob, it's Alice. Give me your key.</text><line x1='320' y1='112' x2='550' y2='130' stroke='var(--bad)' stroke-width='1.6' marker-end='url(#arr)'/><text x='435' y='109' font-size='9.5' fill='currentColor' text-anchor='middle'>Hi Bob, it's Alice. Give me your key.</text><line x1='550' y1='160' x2='320' y2='178' stroke='currentColor' stroke-width='1.6' marker-end='url(#arr)'/><text x='435' y='157' font-size='9.5' fill='currentColor' text-anchor='middle'>[Bob's public key]</text><line x1='320' y1='208' x2='90' y2='226' stroke='var(--bad)' stroke-width='1.6' marker-end='url(#arr)'/><text x='205' y='205' font-size='9.5' fill='currentColor' text-anchor='middle'>[Mallory's public key]  (substituted)</text><line x1='90' y1='256' x2='320' y2='274' stroke='currentColor' stroke-width='1.6' marker-end='url(#arr)'/><text x='205' y='253' font-size='9.5' fill='currentColor' text-anchor='middle'>\"Meet me at the bus stop!\" enc. with Mallory's key</text><rect x='200' y='288' width='240' height='38' rx='4' fill='none' stroke='var(--bad)' stroke-width='1.6' stroke-dasharray='3 3'/><text x='320' y='304' font-size='10' fill='var(--bad)' text-anchor='middle'>decrypt with own private key, read,</text><text x='320' y='318' font-size='10' fill='var(--bad)' text-anchor='middle'>modify, re-encrypt with Bob's key</text><line x1='320' y1='354' x2='550' y2='372' stroke='var(--bad)' stroke-width='1.6' marker-end='url(#arr)'/><text x='435' y='351' font-size='9.5' fill='currentColor' text-anchor='middle'>\"Meet me at the park!\" enc. with Bob's key</text></svg>",
     "caption": "WB-L08 p100: the key-substitution attack with three lifelines."
    },
    {
     "type": "seq",
     "left": "Alice",
     "right": "\"Bob\" (really Mallory)",
     "caption": "What Alice sees: everything looks normal, because she has no way to check whose key she received.",
     "events": [
      {
       "from": "L",
       "label": "Hi Bob, give me your key"
      },
      {
       "from": "R",
       "label": "[public key M]",
       "note": "not Bob's!"
      },
      {
       "from": "L",
       "label": "E_M(\"bus stop\")",
       "note": "Mallory reads"
      },
      {
       "gap": true,
       "label": "",
       "note": "Mallory forwards E_Bob(\"park\") to Bob"
      }
     ]
    },
    {
     "type": "callout",
     "kind": "key",
     "title": "What stops it: binding keys to names",
     "html": "<p>The attack works because the public key arrives with no proof of ownership. TLS fixes this with a <b>certificate</b>: a CA signs \"this public key belongs to www.bank.com\". Mallory cannot produce a CA-signed certificate for bank.com with <i>her</i> key, and if she sends Bob's real certificate she cannot use it, because she lacks Bob's private key. The client checks the signature chain and the hostname (06-E). In TLS 1.3 the server also <b>signs</b> the handshake (CertificateVerify), so its (EC)DHE key share cannot be swapped.</p>"
    },
    {
     "type": "code",
     "file": "Unit06_toy_rsa_dh.py",
     "level": "low",
     "title": "Section 6 of the script: Mallory substitutes her DH value and ends up with two different keys"
    },
    {
     "type": "cheat",
     "items": [
      "Eve = passive eavesdropper; Mallory = active attacker (modify, inject, replay).",
      "MITM = two connections, attacker in the middle, both victims fooled.",
      "Defence: authenticated key exchange (certificates + signatures), then integrity (MACs).",
      "Threats: eavesdropping → confidentiality, tampering → integrity, impersonation → authentication."
     ]
    },
    {
     "type": "traps",
     "items": [
      "Encryption alone does not stop MITM: Mallory simply runs encryption separately with each side.",
      "Clicking through a browser certificate warning is exactly what lets a MITM proxy succeed.",
      "Unauthenticated Diffie–Hellman is MITM-able; authenticated DH (signed) is not."
     ]
    }
   ],
   "practice": [
    {
     "id": "u06-D-1",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "06.5",
     "q": "<p>In the WB-L08 p100 story, what does Mallory send to Alice when Alice asks for Bob's key?</p>",
     "options": [
      "Bob's public key",
      "Mallory's own public key",
      "Bob's private key",
      "Nothing"
     ],
     "answer": 1,
     "why": [
      "Then Alice would encrypt for Bob and Mallory could not read it.",
      "Correct: key substitution.",
      "Nobody ever sends a private key.",
      "Then the attack fails."
     ],
     "explain": "<p>She substitutes her own key.</p>"
    },
    {
     "id": "u06-D-2",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "06.5",
     "q": "<p>Which threat is impersonation primarily an attack on?</p>",
     "options": [
      "Confidentiality",
      "Integrity",
      "Authentication",
      "Availability"
     ],
     "answer": 2,
     "why": [
      "That is eavesdropping.",
      "That is tampering.",
      "Correct.",
      "That is denial of service."
     ],
     "explain": "<p>Impersonation defeats authentication.</p>"
    },
    {
     "id": "u06-D-3",
     "type": "msq",
     "tag": "University-Midsem-style",
     "topic": "06.5",
     "q": "<p>Which measures defeat the key-substitution MITM? (Select all that apply.)</p>",
     "options": [
      "Certificates signed by a trusted CA",
      "Using a longer symmetric key",
      "Checking that the certificate's name matches the site",
      "Server signing its handshake key share",
      "Switching from TCP to UDP"
     ],
     "answer": [
      0,
      2,
      3
     ],
     "why": [
      "Binds the key to the name.",
      "Mallory still holds both session keys.",
      "Without the name check any valid certificate would do.",
      "TLS 1.3 CertificateVerify.",
      "Transport choice is irrelevant."
     ],
     "explain": "<p>Authentication is the cure, not stronger encryption.</p>"
    },
    {
     "id": "u06-D-4",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "06.5",
     "q": "<p>Eve and Mallory differ in that</p>",
     "options": [
      "Eve modifies messages, Mallory only reads",
      "Eve only listens; Mallory actively modifies or injects",
      "Both only listen",
      "Mallory is a CA"
     ],
     "answer": 1,
     "why": [
      "Reversed.",
      "Correct.",
      "Mallory is active.",
      "No."
     ],
     "explain": "<p>Passive vs active attacker.</p>"
    },
    {
     "id": "u06-D-5",
     "type": "num",
     "tag": "GATE-style",
     "topic": "06.5",
     "q": "<p>Toy DH, p = 23, g = 5. Alice's secret a = 6. Mallory replaces Bob's value with M = 10. What key does Alice compute? (integer)</p>",
     "answer": 6,
     "tol": 0,
     "unit": "",
     "verify": "pow(10, 6, 23)",
     "steps": [
      {
       "tex": "s = M^a \\bmod p = 10^6 \\bmod 23",
       "why": "Alice uses the value she received."
      },
      {
       "tex": "10^2 \\equiv 8,\\ 10^4 \\equiv 64 \\equiv 18,\\ 10^6 \\equiv 18\\times8 = 144 \\equiv 6",
       "why": "Square and multiply mod 23."
      }
     ],
     "explain": "<p>6, a key shared with Mallory (who computes A^m = 8^3 mod 23 = 6), not with Bob.</p>"
    }
   ]
  },
  {
   "id": "06-E",
   "title": "Certificates, Look-alike Domains and the Chain of Trust",
   "badge": "class",
   "source": "WB-L06 p16–19, p22; chain detail researched: Kurose & Ross 8e §8.3, §8.6; RFC 8446 §4.4.2",
   "covers": [
    "06.6"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "A passport, signed by a government you already trust",
     "html": "<p><b>Analogy.</b> A border officer does not know you, but she knows what a genuine government seal looks like. A certificate is a passport for a public key: \"this key belongs to *.canva.com\", sealed (signed) by an authority your browser already trusts.</p><p><b>Definition.</b> An X.509 v3 <b>certificate</b> binds a <b>subject</b> name to a <b>public key</b> and is <b>digitally signed</b> by an <b>issuer</b> (Certificate Authority). Fields: version, serial number, signature algorithm, issuer, validity (not before / not after), subject, subject public key, extensions (Subject Alternative Name = list of valid host names; Basic Constraints CA:TRUE/FALSE; Key Usage), and the CA's signature. WB-L06 p17 shows a real one: <b>*.canva.com</b>, issued by <b>Amazon RSA 2048 M04</b>, expires 20 December 2026, serial 0A C6 A0 8B 42 20 3F BD 14 61 62 3D 4C 81 0B 8C.</p>"
    },
    {
     "type": "callout",
     "kind": "warning",
     "title": "Look-alike (homograph) domains (WB-L06 p16)",
     "html": "<p><code>micrоsоft.com</code> vs <code>microsoft.com</code> render identically, but the first uses Cyrillic \"о\" (U+043E), so it is a different domain (in DNS it is stored as a punycode name beginning with xn--). Its owner can get a valid certificate <i>for that name</i>. Certificates prove you reached the name in the address bar, not that it is the name you meant.</p>"
    },
    {
     "type": "figure",
     "html": "<svg viewBox='0 0 640 240' width='100%' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'><defs><marker id='arr' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='currentColor'/></marker></defs><rect x='20' y='30' width='180' height='122' rx='6' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='110' y='50' font-size='12' fill='var(--accent)' text-anchor='middle' font-weight='bold'>Leaf (end-entity)</text><text x='110' y='72' font-size='10' fill='currentColor' text-anchor='middle'>Subject: *.canva.com</text><text x='110' y='90' font-size='10' fill='currentColor' text-anchor='middle'>Issuer: Amazon RSA 2048 M04</text><text x='110' y='108' font-size='10' fill='currentColor' text-anchor='middle'>CA: FALSE</text><text x='110' y='126' font-size='10' fill='currentColor' text-anchor='middle'>public key of canva.com</text><rect x='230' y='30' width='180' height='122' rx='6' fill='none' stroke='var(--warn)' stroke-width='2'/><text x='320' y='50' font-size='12' fill='var(--warn)' text-anchor='middle' font-weight='bold'>Intermediate CA</text><text x='320' y='72' font-size='10' fill='currentColor' text-anchor='middle'>Subject: Amazon RSA 2048 M04</text><text x='320' y='90' font-size='10' fill='currentColor' text-anchor='middle'>Issuer: Amazon Root CA 1</text><text x='320' y='108' font-size='10' fill='currentColor' text-anchor='middle'>CA: TRUE</text><text x='320' y='126' font-size='10' fill='currentColor' text-anchor='middle'>public key of M04</text><rect x='440' y='30' width='180' height='122' rx='6' fill='none' stroke='var(--ok)' stroke-width='2'/><text x='530' y='50' font-size='12' fill='var(--ok)' text-anchor='middle' font-weight='bold'>Root CA (self-signed)</text><text x='530' y='72' font-size='10' fill='currentColor' text-anchor='middle'>Subject: Amazon Root CA 1</text><text x='530' y='90' font-size='10' fill='currentColor' text-anchor='middle'>Issuer: Amazon Root CA 1</text><text x='530' y='108' font-size='10' fill='currentColor' text-anchor='middle'>CA: TRUE</text><text x='530' y='126' font-size='10' fill='currentColor' text-anchor='middle'>in the OS/browser trust store</text><line x1='410' y1='92' x2='440' y2='92' stroke='currentColor' stroke-width='1.5' marker-end='url(#arr)'/><line x1='200' y1='92' x2='230' y2='92' stroke='currentColor' stroke-width='1.5' marker-end='url(#arr)'/><text x='215' y='170' font-size='10' fill='var(--warn)' text-anchor='middle'>leaf signature checked with M04's public key</text><text x='425' y='188' font-size='10' fill='var(--ok)' text-anchor='middle'>intermediate signature checked with the root's public key</text><text x='320' y='212' font-size='9.5' fill='var(--muted)' text-anchor='middle'>Server sends leaf + intermediate (RFC 8446 §4.4.2: sender's certificate first). The root is NOT sent; the client already has it.</text><text x='320' y='230' font-size='9.5' fill='var(--muted)' text-anchor='middle'>Client also checks: hostname matches SAN, dates valid, not revoked, CA:TRUE on issuers.</text></svg>",
     "caption": "Chain of trust (researched; WB-L06 p22 names it without drawing it): leaf → intermediate → root."
    },
    {
     "type": "derivation",
     "title": "How the client validates a chain",
     "steps": [
      {
       "tex": "\\text{Verify}(\\text{PK}_{M04},\\ \\text{sig}_{leaf},\\ \\text{tbs}_{leaf}) = \\text{true}",
       "why": "The leaf's signature over its to-be-signed fields is checked with the intermediate's public key."
      },
      {
       "tex": "\\text{Verify}(\\text{PK}_{root},\\ \\text{sig}_{M04},\\ \\text{tbs}_{M04}) = \\text{true}",
       "why": "The intermediate's signature is checked with the root's public key."
      },
      {
       "tex": "\\text{PK}_{root} \\in \\text{trust store}",
       "why": "The root is self-signed; it is trusted because it was pre-installed in the OS/browser, not because of its signature."
      },
      {
       "tex": "\\text{host} \\in \\text{SAN}(leaf),\\ t \\in [\\text{notBefore}, \\text{notAfter}],\\ \\text{not revoked}",
       "why": "WB-L08 p107: valid and trusted via CA, hostname matches, not expired or revoked."
      }
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "title": "What WB-L06 p19/p22 simplifies",
     "html": "<p>The slide draws the client asking the CA \"Is this valid?\" during every handshake. In reality the client verifies signatures <b>locally</b> using root keys already in its trust store; it contacts no CA for that. Only revocation status may involve a network check (OCSP, or a stapled OCSP response sent by the server).</p>"
    },
    {
     "type": "code",
     "file": "Unit06_tls_server.py",
     "level": "high",
     "title": "Build root → intermediate → leaf at runtime, verify each signature, serve TLS on 127.0.0.1",
     "note": "Path A uses the cryptography package; falls back to the openssl CLI or to parsing an embedded PEM so it always exits 0."
    },
    {
     "type": "cheat",
     "items": [
      "Certificate = subject + public key + issuer + validity + extensions, signed by the issuer's private key.",
      "Server sends leaf + intermediates; root comes from the trust store.",
      "Each link: issuer's public key verifies subject's signature.",
      "Wildcard *.canva.com matches www.canva.com, not canva.com or a.b.canva.com.",
      "Checks: chain, hostname (SAN), dates, revocation, CA:TRUE on issuers."
     ]
    },
    {
     "type": "traps",
     "items": [
      "The CA signs with its <b>private</b> key; clients verify with the CA's <b>public</b> key.",
      "A valid certificate does not mean an honest site (look-alike domains).",
      "Roots are self-signed; their trust comes from the store, not the signature.",
      "The certificate contains the server's <b>public</b> key only, never the private key."
     ]
    }
   ],
   "practice": [
    {
     "id": "u06-E-1",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "06.6",
     "q": "<p>Whose public key does a browser use to check the signature on the <code>*.canva.com</code> leaf certificate?</p>",
     "options": [
      "canva.com's",
      "Amazon RSA 2048 M04's (the issuer)",
      "Amazon Root CA 1's",
      "The browser's own"
     ],
     "answer": 1,
     "why": [
      "A certificate is not verified with its own key (except a self-signed root).",
      "Correct: the issuer signed it.",
      "The root verifies the intermediate, not the leaf.",
      "Browsers have no such key."
     ],
     "explain": "<p>Issuer's public key verifies the subject's signature.</p>"
    },
    {
     "id": "u06-E-2",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "06.6",
     "q": "<p>Which certificate is normally <b>not</b> sent by the server in the TLS Certificate message?</p>",
     "options": [
      "Leaf",
      "Intermediate",
      "Root",
      "All are always sent"
     ],
     "answer": 2,
     "why": [
      "Always first.",
      "Needed to build the chain.",
      "Correct: the client already has it.",
      "Sending the root is pointless."
     ],
     "explain": "<p>RFC 8446 §4.4.2 allows omitting the root.</p>"
    },
    {
     "id": "u06-E-3",
     "type": "msq",
     "tag": "University-Midsem-style",
     "topic": "06.6",
     "q": "<p>Which checks does the client perform on the server certificate (WB-L08 p107)? (Select all that apply.)</p>",
     "options": [
      "Valid and trusted via a CA chain",
      "Hostname matches",
      "Not expired or revoked",
      "Server's private key is included",
      "Server IP is in India"
     ],
     "answer": [
      0,
      1,
      2
     ],
     "why": [
      "Chain of trust.",
      "SAN must contain the host.",
      "Validity and revocation.",
      "Never included.",
      "Location is not checked."
     ],
     "explain": "<p>Chain, name, dates, revocation.</p>"
    },
    {
     "id": "u06-E-4",
     "type": "mcq",
     "tag": "GATE-style",
     "topic": "06.6",
     "q": "<p>Does <code>*.canva.com</code> cover <code>canva.com</code>?</p>",
     "options": [
      "Yes",
      "No",
      "Only over HTTP/3",
      "Only if the CA is Amazon"
     ],
     "answer": 1,
     "why": [
      "The wildcard needs exactly one label in its place.",
      "Correct: the bare domain must be listed separately in the SAN.",
      "Protocol is irrelevant.",
      "CA is irrelevant."
     ],
     "explain": "<p>Wildcards match one label only.</p>"
    },
    {
     "id": "u06-E-5",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "06.6",
     "q": "<p>The attacker registers <code>micrоsоft.com</code> with Cyrillic о and gets a valid certificate. The padlock appears. This is</p>",
     "options": [
      "A broken CA",
      "A homograph / look-alike domain attack",
      "A TLS downgrade",
      "A DNS cache"
     ],
     "answer": 1,
     "why": [
      "The CA correctly certified that name.",
      "Correct (WB-L06 p16).",
      "Nothing was downgraded.",
      "Not DNS caching."
     ],
     "explain": "<p>Certificates bind keys to names, not to intentions.</p>"
    },
    {
     "id": "u06-E-6",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "06.6",
     "q": "<p>Predict the exact output.</p>",
     "code": "import ssl\nctx = ssl.create_default_context()\nprint(ctx.verify_mode == ssl.CERT_REQUIRED, ctx.check_hostname)",
     "answer": "True True",
     "runCheck": true,
     "explain": "<p>The default client context requires a valid chain and checks the hostname.</p>"
    }
   ]
  },
  {
   "id": "06-F",
   "title": "The TLS Handshake over TCP (5-step and 6-step Views)",
   "badge": "class",
   "source": "WB-L06 p16, p18–24; WB-L08 p104–110 (= p61–67)",
   "covers": [
    "06.7"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "Agree a language, show ID, share a secret, confirm",
     "html": "<p><b>Analogy (WB-L08 p105–107).</b> \"Hey, here are the languages I speak. Can we talk securely?\" — \"Sure, I'll speak this one. Here's my ID.\" — the client checks the ID like a driver's licence — then both build the same secret key and confirm that nobody altered the conversation.</p><p><b>Definition.</b> TLS runs <b>on top of an established TCP connection</b> (SYN, SYN-ACK, ACK first). The handshake negotiates version and cipher suite, authenticates the server with its certificate, establishes a shared symmetric <b>session key</b>, and finishes with <b>Finished</b> messages (a MAC over the whole handshake transcript). Then application data (the HTTP GET) flows encrypted.</p>"
    },
    {
     "type": "table",
     "head": [
      "WB-L08 6-step view (TLS 1.2, RSA key exchange)",
      "WB-L06 5-step view",
      "Contents"
     ],
     "rows": [
      [
       "1. ClientHello",
       "1. ClientHello",
       "supported TLS versions, cipher suites, client_random (32 bytes, the \"number once\"), optional server name (SNI)"
      ],
      [
       "2. ServerHello",
       "2. ServerHello + Certificate",
       "chosen version and suite, server_random, certificate (public key + CA signature)"
      ],
      [
       "3. Certificate verification (client)",
       "3. Authentication",
       "chain valid, hostname matches, not expired or revoked"
      ],
      [
       "4. Pre-master secret",
       "4. Key exchange",
       "client makes a 48-byte pre-master secret, encrypts it with the server's public key; only the server's private key opens it"
      ],
      [
       "5. Key derivation",
       "4. (cont.)",
       "both compute master secret = PRF(pre-master, client_random, server_random) and the session keys"
      ],
      [
       "6. Finished",
       "5. Encrypted data",
       "Finished messages encrypted with the new keys; then HTTP flows encrypted"
      ]
     ],
     "caption": "The two decks describe the same TLS 1.2 handshake."
    },
    {
     "type": "callout",
     "kind": "slidefix",
     "title": "WB-L06 p22 and p24 step labels",
     "html": "<p>p22 is titled \"Step 3: ServerHello + Certificate\" but its content is the client <b>validating</b> the certificate; p24 repeats \"Step 4\". The correct sequence is: <b>1 ClientHello · 2 ServerHello + Certificate · 3 Authenticate (validate chain) · 4 Key exchange · 5 Encrypted data</b>.</p>"
    },
    {
     "type": "seq",
     "left": "Client",
     "right": "Server",
     "caption": "TCP + TLS 1.2 full handshake (WB-L06 p16; WB-L08 p105): 1 RTT TCP + 2 RTT TLS before the GET can be sent.",
     "events": [
      {
       "from": "L",
       "label": "TCP SYN",
       "note": "RTT 1 (TCP)"
      },
      {
       "from": "R",
       "label": "TCP SYN + ACK"
      },
      {
       "from": "L",
       "label": "ACK, ClientHello",
       "note": "RTT 2 (TLS)"
      },
      {
       "from": "R",
       "label": "ServerHello, Certificate, HelloDone"
      },
      {
       "from": "L",
       "label": "ClientKeyExchange, CCS, Finished",
       "note": "RTT 3 (TLS)"
      },
      {
       "from": "R",
       "label": "ChangeCipherSpec, Finished"
      },
      {
       "from": "L",
       "label": "HTTP GET (encrypted)",
       "note": "RTT 4 (HTTP)"
      },
      {
       "from": "R",
       "label": "HTTP 200 OK (encrypted)"
      }
     ]
    },
    {
     "type": "seq",
     "left": "Client",
     "right": "Server",
     "caption": "TCP + TLS 1.3 (RFC 8446): the key share travels in the ClientHello, so TLS costs 1 RTT; total 3 RTT to the first response.",
     "events": [
      {
       "from": "L",
       "label": "TCP SYN",
       "note": "RTT 1 (TCP)"
      },
      {
       "from": "R",
       "label": "TCP SYN + ACK"
      },
      {
       "from": "L",
       "label": "ClientHello + key_share",
       "note": "RTT 2 (TLS)"
      },
      {
       "from": "R",
       "label": "ServerHello+key_share, {Cert, CertVerify, Fin}"
      },
      {
       "from": "L",
       "label": "{Finished} + HTTP GET",
       "note": "RTT 3 (HTTP)"
      },
      {
       "from": "R",
       "label": "HTTP 200 OK (encrypted)"
      }
     ]
    },
    {
     "type": "derivation",
     "title": "RTTs before the first response byte (fresh HTTPS GET)",
     "steps": [
      {
       "tex": "T_{1.2} = 1_{TCP} + 2_{TLS\\,1.2} + 1_{HTTP} = 4\\ \\text{RTT}",
       "why": "TLS 1.2 needs two flights each way before data."
      },
      {
       "tex": "T_{1.3} = 1_{TCP} + 1_{TLS\\,1.3} + 1_{HTTP} = 3\\ \\text{RTT}",
       "why": "TLS 1.3 sends the key share in the first flight; the GET rides with the client Finished."
      },
      {
       "tex": "T_{1.3,\\,0RTT} = 1_{TCP} + 1 = 2\\ \\text{RTT}",
       "why": "Resumption: the GET is sent as early data with the ClientHello."
      },
      {
       "tex": "\\text{RTT} = 50\\ \\text{ms}:\\ 200,\\ 150,\\ 100\\ \\text{ms}",
       "why": "Multiply by the RTT."
      }
     ]
    },
    {
     "type": "worked",
     "title": "HTTPS page load with TLS 1.2 vs TLS 1.3",
     "tag": "University-Midsem-style",
     "problem": "<p>RTT = 80 ms, DNS already cached, objects tiny. A browser opens a fresh HTTPS connection and fetches one HTML file. How long until the response arrives with TLS 1.2, and with TLS 1.3? How much does TLS 1.3 save?</p>",
     "steps": [
      {
       "tex": "4 \\times 80 = 320\\ \\text{ms}",
       "why": "TLS 1.2: 1 + 2 + 1 RTT."
      },
      {
       "tex": "3 \\times 80 = 240\\ \\text{ms}",
       "why": "TLS 1.3: 1 + 1 + 1 RTT."
      },
      {
       "tex": "320 - 240 = 80\\ \\text{ms}",
       "why": "One RTT saved."
      }
     ],
     "answer": "<p><b>320 ms</b> vs <b>240 ms</b>; TLS 1.3 saves <b>80 ms</b> (one RTT).</p>"
    },
    {
     "type": "code",
     "file": "Unit06_tls_server.py",
     "level": "high",
     "title": "ssl: TLS server + client on 127.0.0.1; prints TLSv1.3 and the cipher suite; forces a TLS 1.2 client too"
    },
    {
     "type": "cheat",
     "items": [
      "Order: DNS → TCP handshake → TLS handshake → encrypted HTTP.",
      "TLS 1.2 = 2 RTT; TLS 1.3 = 1 RTT; resumption 0-RTT.",
      "client_random and server_random: 32 bytes each; RSA pre-master secret 48 bytes.",
      "Keys = f(pre-master, client_random, server_random).",
      "Finished = MAC over the transcript: detects any tampering with the handshake."
     ]
    },
    {
     "type": "traps",
     "items": [
      "TLS needs TCP to be established <b>first</b>; it does not replace the TCP handshake.",
      "The client creates the pre-master secret (RSA mode), not the server.",
      "ChangeCipherSpec is not a handshake message in TLS 1.3 (kept only for middlebox compatibility).",
      "TLS 1.3 removed RSA key transport: every handshake uses (EC)DHE, giving forward secrecy."
     ]
    }
   ],
   "practice": [
    {
     "id": "u06-F-1",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "06.7",
     "q": "<p>In the WB-L08 6-step handshake, who generates the pre-master secret?</p>",
     "options": [
      "Server",
      "Client",
      "CA",
      "Both, independently"
     ],
     "answer": 1,
     "why": [
      "The server only decrypts it.",
      "Correct (p108), encrypted with the server's public key.",
      "CAs take no part in the handshake.",
      "In RSA mode only the client makes it; both then derive the same keys."
     ],
     "explain": "<p>Client generates, server decrypts with its private key.</p>"
    },
    {
     "id": "u06-F-2",
     "type": "msq",
     "tag": "University-Midsem-style",
     "topic": "06.7",
     "q": "<p>Which inputs derive the session key in step 5 (WB-L08 p109)? (Select all that apply.)</p>",
     "options": [
      "Pre-master secret",
      "client_random",
      "server_random",
      "The CA's private key",
      "The TCP sequence number"
     ],
     "answer": [
      0,
      1,
      2
     ],
     "why": [
      "Yes.",
      "Yes.",
      "Yes.",
      "Never known to client or server.",
      "Not used."
     ],
     "explain": "<p>PRF(pre-master, client_random, server_random).</p>"
    },
    {
     "id": "u06-F-3",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "06.7",
     "q": "<p>RTT = 60 ms. Fresh HTTPS GET with TCP + TLS 1.2. Time until the HTTP response arrives, in ms? (integer)</p>",
     "answer": 240,
     "tol": 0,
     "unit": "ms",
     "verify": "(1+2+1)*60",
     "steps": [
      {
       "tex": "1 + 2 + 1 = 4\\ \\text{RTT}",
       "why": "TCP + TLS 1.2 + HTTP."
      },
      {
       "tex": "4\\times60 = 240",
       "why": "Convert."
      }
     ],
     "explain": "<p>240 ms.</p>"
    },
    {
     "id": "u06-F-4",
     "type": "num",
     "tag": "University-Midsem-style",
     "topic": "06.7",
     "q": "<p>RTT = 60 ms. Same GET with TCP + TLS 1.3 (no resumption). Time in ms? (integer)</p>",
     "answer": 180,
     "tol": 0,
     "unit": "ms",
     "verify": "(1+1+1)*60",
     "steps": [
      {
       "tex": "1 + 1 + 1 = 3\\ \\text{RTT}",
       "why": "TCP + TLS 1.3 + HTTP."
      },
      {
       "tex": "3\\times60 = 180",
       "why": "Convert."
      }
     ],
     "explain": "<p>180 ms.</p>"
    },
    {
     "id": "u06-F-5",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "06.7",
     "q": "<p>What is the purpose of the Finished messages?</p>",
     "options": [
      "To close the TCP connection",
      "To prove both sides derived the same keys and that the handshake was not tampered with",
      "To send the certificate",
      "To request the next object"
     ],
     "answer": 1,
     "why": [
      "FIN closes TCP; Finished is a TLS message.",
      "Correct: a MAC over the whole transcript.",
      "Certificate comes in step 2.",
      "That is HTTP."
     ],
     "explain": "<p>Handshake integrity check.</p>"
    },
    {
     "id": "u06-F-6",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "06.7",
     "q": "<p>Which comes first on a brand-new HTTPS connection?</p>",
     "options": [
      "ClientHello",
      "TCP SYN",
      "HTTP GET",
      "Certificate"
     ],
     "answer": 1,
     "why": [
      "Needs an open TCP connection.",
      "Correct: TCP 3-way handshake first (WB-L08 p105).",
      "Last.",
      "Sent by the server after ClientHello."
     ],
     "explain": "<p>SYN → SYN-ACK → ACK → ClientHello.</p>"
    },
    {
     "id": "u06-F-7",
     "type": "text",
     "tag": "University-Midsem-style",
     "topic": "06.7",
     "q": "<p>Predict the exact output.</p>",
     "code": "rtt = 50\nfor name, n in (('TLS1.2', 1 + 2 + 1), ('TLS1.3', 1 + 1 + 1), ('0-RTT', 1 + 1)):\n    print(name, n * rtt, end=' ')\nprint()",
     "answer": "TLS1.2 200 TLS1.3 150 0-RTT 100",
     "runCheck": true,
     "explain": "<p>4, 3 and 2 RTT times 50 ms.</p>"
    }
   ]
  },
  {
   "id": "06-G",
   "title": "TLS 1.3 in Practice: 1-RTT, 0-RTT, AWS Certificate Manager and TLS Termination at the ALB",
   "badge": "researched",
   "source": "SL-L12 p12; RFC 8446 §2, §2.3; AWS Certificate Manager and Elastic Load Balancing documentation",
   "covers": [
    "06.8"
   ],
   "blocks": [
    {
     "type": "intuition",
     "title": "Do the paperwork once, at the front desk",
     "html": "<p><b>Analogy.</b> A hotel checks IDs at the front desk; inside the building guests move freely. An Application Load Balancer is that front desk: it holds the certificate, finishes TLS with every client, and talks to the servers behind it on the private network.</p><p><b>TLS 1.3 (RFC 8446, August 2018)</b>: 1-RTT full handshake, 0-RTT resumption with pre-shared keys, only five AEAD cipher suites (TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_AES_128_CCM_SHA256, TLS_AES_128_CCM_8_SHA256), (EC)DHE key exchange always, so <b>forward secrecy</b>: stealing the server's private key later does not decrypt recorded traffic. Everything after ServerHello, including the certificate, is encrypted.</p><p><b>TLS termination (SL-L12 p12)</b>: HTTPS requires a TLS handshake, encryption and certificates, and \"ALB can handle this\": <code>Client --HTTPS--&gt; ALB (TLS Termination) --HTTP--&gt; Backend</code>.</p>"
    },
    {
     "type": "figure",
     "html": "<svg viewBox='0 0 640 200' width='100%' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'><defs><marker id='arr' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='currentColor'/></marker></defs><rect x='10' y='60' width='100' height='50' rx='4' fill='none' stroke='currentColor' stroke-width='1.6'/><text x='60' y='90' font-size='12' fill='currentColor' text-anchor='middle'>client</text><rect x='220' y='40' width='160' height='90' rx='4' fill='none' stroke='var(--accent)' stroke-width='2'/><text x='300' y='62' font-size='12' fill='currentColor' text-anchor='middle' font-weight='bold'>Application LB</text><text x='300' y='80' font-size='10' fill='currentColor' text-anchor='middle'>HTTPS listener :443</text><text x='300' y='96' font-size='10' fill='var(--ok)' text-anchor='middle'>ACM certificate attached</text><text x='300' y='112' font-size='10' fill='var(--warn)' text-anchor='middle'>TLS terminated here</text><rect x='510' y='30' width='110' height='34' rx='4' fill='none' stroke='currentColor' stroke-width='1.6'/><text x='565' y='51' font-size='10' fill='currentColor' text-anchor='middle'>EC2 target 1</text><line x1='380' y1='85' x2='510' y2='47' stroke='var(--muted)' stroke-width='1.5' marker-end='url(#arr)'/><rect x='510' y='75' width='110' height='34' rx='4' fill='none' stroke='currentColor' stroke-width='1.6'/><text x='565' y='96' font-size='10' fill='currentColor' text-anchor='middle'>EC2 target 2</text><line x1='380' y1='85' x2='510' y2='92' stroke='var(--muted)' stroke-width='1.5' marker-end='url(#arr)'/><rect x='510' y='120' width='110' height='34' rx='4' fill='none' stroke='currentColor' stroke-width='1.6'/><text x='565' y='141' font-size='10' fill='currentColor' text-anchor='middle'>EC2 target 3</text><line x1='380' y1='85' x2='510' y2='137' stroke='var(--muted)' stroke-width='1.5' marker-end='url(#arr)'/><line x1='110' y1='85' x2='220' y2='85' stroke='var(--ok)' stroke-width='2' marker-end='url(#arr)'/><text x='165' y='77' font-size='10' fill='var(--ok)' text-anchor='middle'>HTTPS (TLS)</text><text x='445' y='60' font-size='10' fill='var(--muted)' text-anchor='middle'>HTTP :80</text><text x='445' y='168' font-size='9.5' fill='var(--muted)' text-anchor='middle'>(or HTTPS again: re-encrypt)</text><text x='320' y='190' font-size='10.5' fill='var(--muted)' text-anchor='middle'>SL-L12 p12: Client --HTTPS--> ALB (TLS termination) --HTTP--> backend</text></svg>",
     "caption": "TLS termination at an Application Load Balancer with an ACM certificate."
    },
    {
     "type": "callout",
     "kind": "aws",
     "title": "AWS Certificate Manager (ACM)",
     "html": "<ul><li><b>Public certificates are free</b> when used with integrated services: Elastic Load Balancing (ALB, NLB), CloudFront, API Gateway. You pay for the load balancer or distribution, not the certificate.</li><li><b>Validation</b>: DNS (add a CNAME record; Route 53 can add it for you) or e-mail.</li><li><b>Managed renewal</b>: ACM renews DNS-validated certificates automatically before expiry as long as the CNAME stays in place; nobody has to copy files to servers.</li><li>The private key is generated and kept by AWS; a standard ACM public certificate cannot be downloaded and installed on your own EC2 web server (use it on the ALB in front instead).</li><li>A certificate for <b>CloudFront</b> must be requested in <b>us-east-1</b> (N. Virginia); for an ALB, in the same Region as the ALB.</li><li>ALB HTTPS listener on 443 + an ELB security policy (for example ELBSecurityPolicy-TLS13-1-2-2021-06) picks the allowed TLS versions and ciphers; a port-80 listener rule usually redirects HTTP to HTTPS with a 301.</li></ul>"
    },
    {
     "type": "table",
     "head": [
      "Termination option",
      "Client → LB",
      "LB → targets",
      "Note"
     ],
     "rows": [
      [
       "ALB TLS termination (SL-L12 p12)",
       "HTTPS",
       "HTTP :80",
       "LB decrypts, reads URL/headers/cookies for routing, adds X-Forwarded-For and X-Forwarded-Proto"
      ],
      [
       "ALB re-encryption",
       "HTTPS",
       "HTTPS :443",
       "end-to-end encryption; targets need their own certificates"
      ],
      [
       "NLB TLS listener",
       "TLS",
       "TCP or TLS",
       "layer 4; terminates TLS but cannot route by URL"
      ],
      [
       "NLB TCP passthrough",
       "TLS (untouched)",
       "TLS",
       "targets terminate TLS and hold the certificate; client IP preserved"
      ]
     ],
     "caption": "Where the handshake ends decides who needs the certificate."
    },
    {
     "type": "derivation",
     "title": "Why terminating at the ALB saves RTTs for distant users",
     "steps": [
      {
       "tex": "T = 1_{TCP} + 1_{TLS\\,1.3} + 1_{HTTP} = 3\\ \\text{RTT}_{client\\leftrightarrow ALB}",
       "why": "Handshakes run only between the client and the ALB."
      },
      {
       "tex": "T_{backend} = \\text{RTT}_{ALB\\leftrightarrow EC2} \\approx \\text{sub-ms}",
       "why": "Inside the VPC the ALB reuses keep-alive HTTP connections to targets; no extra TLS handshake."
      },
      {
       "tex": "\\text{RTT} = 40\\ \\text{ms} \\Rightarrow 3\\times40 = 120\\ \\text{ms}",
       "why": "Example."
      }
     ]
    },
    {
     "type": "worked",
     "title": "Choosing the setup for an exam scenario",
     "tag": "University-Midsem-style",
     "problem": "<p>A startup runs 3 EC2 web servers behind an ALB and wants HTTPS for <code>shop.example.com</code> with no manual renewals and no certificate files on servers. Which steps?</p>",
     "steps": [
      {
       "text": "Request a public certificate in ACM in the ALB's Region for shop.example.com.",
       "why": "ACM certificates are Regional; free for ALB."
      },
      {
       "text": "Validate with DNS: add the CNAME ACM shows (one click in Route 53).",
       "why": "Enables automatic managed renewal."
      },
      {
       "text": "Add an HTTPS :443 listener to the ALB using that certificate; forward to the target group on HTTP :80.",
       "why": "TLS termination at the ALB (SL-L12 p12)."
      },
      {
       "text": "Add an HTTP :80 listener with a redirect-to-HTTPS (301) rule.",
       "why": "Users typing http:// end up encrypted."
      }
     ],
     "answer": "<p>ACM certificate (DNS-validated) + ALB HTTPS listener with TLS termination + HTTP→HTTPS redirect. Servers never hold a certificate.</p>"
    },
    {
     "type": "cheat",
     "items": [
      "TLS 1.3: 1 RTT, 0-RTT resumption (replay risk), 5 AEAD suites, always (EC)DHE → forward secrecy.",
      "ACM public certs: free on ALB/NLB/CloudFront/API Gateway, auto-renewed, private key stays in AWS.",
      "CloudFront certificates: us-east-1 only.",
      "TLS termination at ALB: HTTPS outside, HTTP inside; ALB can route on URL/headers because it sees plaintext."
     ]
    },
    {
     "type": "traps",
     "items": [
      "\"ACM certificates cost USD per month\": public ones used with integrated services are free (private CA is paid).",
      "After termination at the ALB the backend traffic is <b>not</b> encrypted unless you re-encrypt.",
      "0-RTT is faster but replayable; it is not used for non-idempotent requests.",
      "An ACM certificate for CloudFront requested in ap-south-1 will not appear in CloudFront."
     ]
    }
   ],
   "practice": [
    {
     "id": "u06-G-1",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "06.8",
     "q": "<p>In SL-L12 p12's design, which component holds the certificate and performs the TLS handshake with clients?</p>",
     "options": [
      "Each EC2 target",
      "The ALB",
      "Route 53",
      "The Internet Gateway"
     ],
     "answer": 1,
     "why": [
      "Targets receive plain HTTP.",
      "Correct: TLS termination at the ALB.",
      "DNS only resolves names.",
      "The IGW just routes packets."
     ],
     "explain": "<p>Client --HTTPS--> ALB --HTTP--> backend.</p>"
    },
    {
     "id": "u06-G-2",
     "type": "msq",
     "tag": "University-Midsem-style",
     "topic": "06.8",
     "q": "<p>Which statements about ACM public certificates are true? (Select all that apply.)</p>",
     "options": [
      "Free when used with ALB or CloudFront",
      "Renewed automatically when DNS-validated",
      "The private key can be copied onto any EC2 server",
      "For CloudFront they must be in us-east-1"
     ],
     "answer": [
      0,
      1,
      3
     ],
     "why": [
      "You pay for the ALB/CloudFront, not the certificate.",
      "Managed renewal.",
      "Standard ACM keys stay inside AWS.",
      "CloudFront reads certificates from N. Virginia."
     ],
     "explain": "<p>Free, auto-renewed, key managed by AWS, us-east-1 for CloudFront.</p>"
    },
    {
     "id": "u06-G-3",
     "type": "num",
     "tag": "GATE-style",
     "topic": "06.8",
     "q": "<p>A returning client uses TLS 1.3 0-RTT over TCP with RTT = 70 ms. Time until the HTTP response arrives, in ms? (integer)</p>",
     "answer": 140,
     "tol": 0,
     "unit": "ms",
     "verify": "2*70",
     "steps": [
      {
       "tex": "1_{TCP} + 1 = 2\\ \\text{RTT}",
       "why": "The GET rides in the first TLS flight."
      },
      {
       "tex": "2\\times70 = 140",
       "why": "Convert."
      }
     ],
     "explain": "<p>140 ms.</p>"
    },
    {
     "id": "u06-G-4",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "06.8",
     "q": "<p>Which property does TLS 1.3 guarantee for every full handshake that TLS 1.2 with RSA key exchange did not?</p>",
     "options": [
      "Compression",
      "Forward secrecy",
      "Plain-text certificates",
      "2-RTT setup"
     ],
     "answer": 1,
     "why": [
      "TLS 1.3 removed compression.",
      "Correct: ephemeral (EC)DHE always.",
      "The certificate is encrypted in TLS 1.3.",
      "TLS 1.3 is 1-RTT."
     ],
     "explain": "<p>RSA key transport was removed.</p>"
    },
    {
     "id": "u06-G-5",
     "type": "mcq",
     "tag": "University-Midsem-style",
     "topic": "06.8",
     "q": "<p>Why can an ALB route <code>/api/*</code> and <code>/web/*</code> to different target groups for HTTPS traffic?</p>",
     "options": [
      "It reads the TCP port",
      "It terminates TLS, so it sees the decrypted URL path",
      "The URL path is sent unencrypted in HTTPS",
      "DNS includes the path"
     ],
     "answer": 1,
     "why": [
      "Both use 443.",
      "Correct.",
      "The path is encrypted.",
      "DNS knows only host names."
     ],
     "explain": "<p>Layer-7 routing needs plaintext, so the ALB terminates TLS.</p>"
    }
   ]
  }
 ]
};
