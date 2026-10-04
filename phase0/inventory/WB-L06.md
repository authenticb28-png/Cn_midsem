# WB-L06 pages 1-25 — HTTPS and The TLS Handshake: Securing the Web (CSAI321: Computer Networks, Newton School of Technology; PDF metadata title identical, author Kuldeep Jha)

> **FILENAME MISMATCH WARNING:** The PDF is named "L06 - 2026-08-26 - Client-Server Architecture, HTTP Protocols, HTTP Version.pdf", but it contains **HTTPS / TLS / cryptography** content. It has **no** HTTP request/response anatomy, methods, status codes, persistent vs non-persistent or RTT calculations, and no HTTP/1.1 vs 2 vs 3 comparison. All of that is in WB-L05. The only HTTP-version material here is the Recap on p4. The content looks shifted by one lecture relative to the filenames: this deck matches the topic in the WB-L07 filename ("REST API(s), Presentation Layer, HTTPS, TLS-SSL").
>
> **No handwriting:** this is a clean Canva slide export. I looked at all 25 page images and found no handwritten annotations or worked numericals.
>
> **AWS:** the roadmap (p3) lists "Discover HTTPS in AWS", but **no AWS slide exists** in the deck. The only AWS-adjacent item is the p17 certificate, issued by "Amazon RSA 2048 M04".

## Page table
| Page | Section/slide title | Content summary (exact facts, numbers, definitions, lists — be specific, not vague) | Callout type | Diagram/figure on page (describe so it can be redrawn) | Handwriting present? |
|---|---|---|---|---|---|
| 1 | Title: "HTTPS and The TLS Handshake: Securing the Web" | CSAI321:Computer Networks; Newton School of Technology | none | Decorative network triangle | No |
| 2 | Join the lecture online on your dashboard | Filler | none | none | No |
| 3 | Lecture Roadmap | Understanding HTTP over TLS: HTTPS; Cryptography and its goals; Encryption and its types; TLS handshake Flow; CA's, Chain of trust; Discover HTTPS in AWS | none | none | No |
| 4 | Recap | HTTP/1.0 = "Plain text Data"; HTTP/2/HTTP/3 stack = "Data With TLS(Transport Layer security)" | none | (left) HTTP/1.0 separate-connections timing diagram + tired stick figure (same as WB-L05 p28); (right) HTTP/2-vs-HTTP/3 layered stack (same as WB-L05 p38: Application / "Security" TLS / Transport TCP or UDP / Network IP; QUIC contains Multistreaming + TLS + Stream Abstraction) | No |
| 5 | HTTP plain text by design | HTTP lacks built-in security, so it is vulnerable unless HTTPS is used. Anyone who can capture the traffic can read the content of client–server communication | WARNING | Browser window mock: traffic lights, padlock, red "insecure", big "HTTP", red "!" warning badge | No |
| 6 | HTTPS = HTTP + TLS | HTTPS is the secure version of HTTP. It historically used SSL (Secure Socket Layer); it now uses TLS (Transport Layer Security) to encrypt data between client and server | KEY CONCEPT | Gold padlock, "https://www" address-bar image, caption "SSL/ TLS" | No |
| 7 | The Padlock Question | "What does 🔒 mean in browser?" Safe website? ❌; Encrypted connection? ✅; Verified identity? ✅ | QUIZ | none | No |
| 8 | What does TLS actually provide? | "Security using Cryptography" | none | none | No |
| 9 | Cryptography | "The Practice of securing information by converting readable text into unreadable code (ciphertext) and back again." | KEY CONCEPT | "CRYPTOGRAPHY": "Hello" → [Encryption bar, with "encryption key" arrow] → big arrow "jknnq" (Ciphertext) → [Decryption bar, with "decryption key" arrow] → "Hello". The source spells it "Decrycption" | No |
| 10 | Core Goals of Cryptography | Confidentiality (Privacy): information accessible only to authorized parties, "No eavesdropping". Integrity: data accurate and not altered in transit or storage, "No tampering". Authentication: verifies identities of both sender and receiver, "Verified identity" | KEY CONCEPT | Icons: key + locked folder + shield (confidentiality); "DATA INTEGRITY" wheel with Complete / Accurate / Consistent / Secure around DATA; person → "Username/Password" → monitor, "Access granted" ← ("Authentication") | No |
| 11 | How do we achieve these goals? | Divider/prompt | QUIZ (prompt) | none | No |
| 12 | Encryption and Decryption | (image only) Plain Text → Encryption (gears + Key) → Cipher Text (locked doc) → Decryption (gears + Key) → Plain Text | KEY CONCEPT | Linear flow: doc "Plain Text" → gear box "Encryption" (key icon above, labelled "Key") → locked doc "Cipher Text" → gear box "Decryption" (Key above) → doc "Plain Text". Heading split "ENCRYPTION \| DECRYPTION" | No |
| 13 | Symmetric Encryption | (image only) The same secret key is used for encryption and decryption | KEY CONCEPT | Plain Text → "Encryption" key-shape → Cipher Text ("A4$h*L@9. T6=#/>B#1 R06/J2.>1L 1PRL39P20") → "Decryption" key-shape → Plain Text. A single top key "Same Key" branches to "Secret Key" at both Encryption and Decryption | No |
| 14 | Analyze: whats the Issue in using symmetic encryption? | Answer shown: "how to share the key Securely?" (key-distribution problem) | QUIZ | none | No |
| 15 | Asymmetric Encryption | (image only) Sender → Plaintext data → encrypt with **Public Key** → Ciphered Data → decrypt with **Private Key** → Decrypted Plaintext data → Recipient. Small embedded link card bottom-right: "Demo — A Javascript library to perform OpenSSL RSA Encryption, Decryption, and Key Generation. JSEncrypt" | KEY CONCEPT + DEMO | Left-to-right dashed-arrow flow: Sender server icon → yellow doc → black closed padlock with dark "Public Key" → doc with yellow padlock "Ciphered Data" → green open padlock with green "Private Key" → yellow doc "Decrypted Plaintext data" → Recipient server icon | No |
| 16 | How Do I Trust this Server? | "micrоsоft.com vs microsoft.com". The text layer shows the first uses Cyrillic "о" characters, i.e. an IDN **homograph / look-alike domain** example. Leads into "Certificate" (SSL Certificate icon) | KEY CONCEPT / WARNING | Full TLS sequence diagram (dark background), Client and Server lifelines: **1. TCP Handshake**: TCP SYN →, ← TCP SYN + ACK, TCP ACK →, "connection established" (pink dashed line). **2. Certificate Check**: Client Hello →, ← Server Hello, ← Server Hello Done (box "Asymmetric Encryption" with blue public + red private key icons). **3. Key Exchange**: Client Key Exchange →, Change Cipher Spec →, Finished →, ← Change Cipher Spec, ← Finished. Client side: "session key" + blue public key → "encrypted session key"; server side: "encrypted session key" + red private key → "session key". **4. Data Transmission** (box "Symmetric Encryption"): Encrypted Data →, ← Encrypted Data. Legend: blue = public key, red = private key | No |
| 17 | What is a Certificate? | Real cert screenshot: "*.canva.com"; Issued by: Amazon RSA 2048 M04; Expires: Sunday, 20 December 2026 at 5:29:59 AM India Standard Time; "This certificate is valid". Details: Subject Name, Common Name *.canva.com; Issuer Name: Country or Region US, Organisation Amazon, Common Name Amazon RSA 2048 M04; Serial Number 0A C6 A0 8B 42 20 3F BD 14 61 62 3D 4C 81 0B 8C | DEMO (also AWS-adjacent: Amazon CA) | macOS-style certificate viewer screenshot (wildcard cert) | No |
| 18 | How HTTPS Works | Client holds Public Key; Server holds Digital Certificate + Private Key; SSL/TLS between them | KEY CONCEPT | Client (pink circle, key "Public Key") ── big arrow "SSL/ TLS" → Server rack; back arrow ← from "Digital Certificate" to client; server has "Private Key" | No |
| 19 | How HTTPS Works (3-panel) | (1) Server Certificate Check: Client→"CLIENT : HELLO"; ←"SERVER : HELLO"; ←Server Certificate; client→CA "Is this [cert] valid?"; CA→"Yes" (Certificate Certifying Authority = CA Server). (2) Key Exchange: client "Extract Server [public key] From [cert]"; "Creates a Session Key"; "I know A, B, C, D cipher suites" →; ← "OK, Lets use "C" cipher suite"; "Encrypt [session key] using server [public key] & "C" cipher suite" →; server "Decrypt using [private key]"; "At this point server has [session key]". (3) Encrypted Tunnel for data transmission: "At this point Client and Server both have common Key, Also known as session key"; client "Encrypt data with session key" → server "Decrypt Data with session key"; reverse direction likewise. Source: medium.com/@rocky.bhatia86/... | KEY CONCEPT | Three-panel sequence diagrams as described (Chrome icon = client, server rack, CA box) | No |
| 20 | TLS Handshake Overview — Step 1: ClientHello | "Client offers TLS versions, cipher suites, random nonce." Quote: "I can speak TLS 1.3 or TLS 1.2. I will use XYZ algorithm for PQR purposes. This is Number once a 32-byte string." (i.e. the nonce, a "number used once", is a 32-byte random value) | KEY CONCEPT / ANALOGY (speech quote) | Crop: Client (Chrome) → "CLIENT : HELLO" → Server | No |
| 21 | TLS Handshake Overview — Step 2: ServerHello + Certificate | "Server hello is picked cipher and its certificate (public key + CA signatures)." Quote: "Out of your options XYZ for PQR purposes, we will use this following bundle of algorithms to encrypt our session and this is my identity issued by following authority." | KEY CONCEPT | Crop: CLIENT : HELLO →; ← SERVER : HELLO; ← Server Certificate | No |
| 22 | Authentication: — Step 3 (slide label repeats "ServerHello + Certificate") | "Client validates the certificate chain. This will stop Man in the middle attack." Quote: "Send reuest for certificate validation to CA" if its valid client can trust if not client shows website is not secure." | KEY CONCEPT | Crop of panel 1 from p19, including the CA server: "Is this [cert] valid?" → CA, ← "Yes" | No |
| 23 | Key Exchange: — Step 4: Key Exchange | "Client and Server derive a shared session key" | KEY CONCEPT | Crop of panel 2 "Key Exchange" from p19 (cipher suites A, B, C, D; choose "C"; encrypt session key with server public key; server decrypts with private key) | No |
| 24 | Data Sharing on Secure Channel | "Step 4: Communication Start with Encrypted application data being shared." (step number 4 repeated in source; logically step 5) | KEY CONCEPT | Crop of panel 3 "Encrypted Tunnel for data transmission" from p19 | No |
| 25 | Please fill the feedback form. | Filler | none | none | No |

## Worked examples & numericals (verbatim givens, steps and answers as shown; flag any arithmetic error you notice in the source)
- **No numericals** in the deck.
- **Toy cipher example (p9):** "Hello" → ciphertext "jknnq" → "Hello". **Inconsistency:** this is not a consistent shift cipher. With a +2 Caesar shift, l→n, l→n and o→q match, and H→j matches if case is ignored, but e→k is a +6 shift; +2 would give "g". The consistent +2 Caesar result is "Jgnnq". Flag this before reusing it as a Caesar-cipher example.
- Numeric facts:
  - ClientHello random/nonce is a "32-byte string" (p20).
  - TLS versions offered: TLS 1.3 or TLS 1.2 (p20).
  - The p17 certificate key type is implied by the issuer name "Amazon RSA 2048 M04"; the expiry is 20 Dec 2026, 5:29:59 AM IST.

## Formulas stated
- "HTTPS = HTTP + TLS" (p6, title).
- No mathematical formulas.

## Diagrams that must be recreated (page → description: nodes, arrows, labels, field widths)
- **p4** Recap: HTTP/1.0 separate connections ("Plain text Data") vs the HTTP/2-over-TLS-over-TCP and HTTP/3-over-QUIC(TLS)-over-UDP stacks ("Data With TLS").
- **p9** Crypto pipeline: "Hello" → Encryption (encryption key) → "jknnq" ciphertext → Decryption (decryption key) → "Hello".
- **p10** The three goals: Confidentiality / Integrity / Authentication, with their taglines.
- **p12** Plain Text → Encryption(Key) → Cipher Text → Decryption(Key) → Plain Text.
- **p13** Symmetric: one "Same Key" feeding both Encryption and Decryption ("Secret Key" on both sides).
- **p15** Asymmetric: Sender → plaintext → encrypt with recipient's Public Key → ciphered data → decrypt with Private Key → plaintext → Recipient.
- **p16** Full TLS (1.2-style RSA key exchange) sequence:
  1. TCP 3-way handshake: SYN, SYN+ACK, ACK.
  2. Certificate check: Client Hello, Server Hello, (certificate), Server Hello Done.
  3. Key exchange: Client Key Exchange (session key encrypted with server public key), Change Cipher Spec, Finished; then server sends Change Cipher Spec, Finished. Asymmetric encryption is used here.
  4. Data transmission: Encrypted Data both ways, using symmetric encryption.
- **p18** Client (public key) ⇄ SSL/TLS ⇄ Server (digital certificate + private key).
- **p19-p24** The 3-panel HTTPS flow, broken into steps:
  - Step 1 ClientHello (versions, cipher suites, 32-byte nonce).
  - Step 2 ServerHello + Certificate (chosen cipher, cert = public key + CA signature).
  - Step 3 Client validates the cert chain with the CA ("Is this valid?" → "Yes"); this prevents MITM.
  - Step 4 Key exchange: client creates a session key, encrypts it with the server's public key using the chosen cipher suite "C", and the server decrypts it with its private key.
  - Step 5 (labelled "Step 4" on p24) Encrypted tunnel: both sides encrypt and decrypt with the shared session key.
- **p16** Homograph comparison: "micrоsоft.com" (Cyrillic о) vs "microsoft.com".

## Code / CLI / config shown (verbatim)
- No code or CLI.
- Certificate fields (p17):
  - `*.canva.com`
  - `Issued by: Amazon RSA 2048 M04`
  - `Expires: Sunday, 20 December 2026 at 5:29:59 AM India Standard Time`
  - Issuer: `Country or Region US`, `Organisation Amazon`, `Common Name Amazon RSA 2048 M04`
  - `Serial Number 0A C6 A0 8B 42 20 3F BD 14 61 62 3D 4C 81 0B 8C`
- TLS message names (p16): `TCP SYN`, `TCP SYN + ACK`, `TCP ACK`, `Client Hello`, `Server Hello`, `Server Hello Done`, `Client Key Exchange`, `Change Cipher Spec`, `Finished`, `Encrypted Data`.
- Demo reference (p15): JSEncrypt, "A Javascript library to perform OpenSSL RSA Encryption, Decryption, and Key Generation."
- URL (p19): https://medium.com/@rocky.bhatia86/in-the-expansive-universe-of-the-internet-where-the-exchange-of-information-is-ceaseless-the-1ffcdad011d1

## In-class questions / quiz prompts shown on slides (verbatim, with answers if given)
- p7: "What does 🔒 mean in browser?" — "Safe website? ❌", "Encrypted connection? ✅", "Verified identity? ✅"
- p8: "What does TLS actually provide?" — "Security using Cryptography"
- p11: "How do we achieve these goals?" (answered by the encryption slides)
- p14: "Analyze: whats the Issue in using symmetic encryption?" — "how to share the key Securely?"
- p16: "How Do I Trust this Server?" — micrоsоft.com vs microsoft.com — answer: "Certificate"

## Unclear / unreadable (page → what is unreadable and why)
- p15: the bottom-right "Demo" link card is tiny. I read it at 200 dpi (scratchpad/hi/WB-L06-15.jpg): "Demo / A Javascript library to perform OpenSSL RSA Encryption, Decryption, and Key Generation. / JSEncrypt".
- p16: the sequence-diagram labels are small at 60 dpi. I read them fully at 200 dpi (scratchpad/hi/WB-L06-16.jpg).
- p16: the two domains look identical in the rendered image. The difference (Cyrillic "о" in the first) is visible only in the text layer.
- p19 and p22-24: the crops are low-resolution JPEG screenshots, but all labels are legible. The key icons inside the sentences ("Extract Server [public key] From [cert]", "Encrypt [session key] using server [public key]") are pictures rather than words.
- p22: the step label says "Step 3: ServerHello + Certificate", but the content is certificate validation (probable copy-paste label).
- p24: the label "Step 4" duplicates p23's step number.

## Duplicate / overlap notes (pages that repeat other decks or earlier pages)
- p4 reuses WB-L05 p28 (HTTP/1.0 timing diagram + stick figure) and WB-L05 p38 (HTTP/2 vs HTTP/3 stack).
- p20-24 are step-by-step crops of the 3-panel infographic on p19 (same source image).
- p16's sequence diagram covers the same handshake as p19-24 in more detail (TCP handshake + TLS messages).
- Likely overlaps WB-L07 (filename "REST API(s), Presentation Layer, HTTPS, TLS-SSL") and WB-L08 ("... Cryptography").
- Roadmap items "CA's, Chain of trust" and "Discover HTTPS in AWS" are only partly covered: chain-of-trust appears as "validates the certificate chain" on p22 and the Amazon-issued cert on p17, and there is no AWS slide.

## Topic list (flat bullet list of every distinct topic/subtopic covered, in order)
- Recap: HTTP/1.0 plain text vs TLS in the HTTP/2/HTTP/3 stacks
- HTTP is plain text by design: sniffable, insecure
- HTTPS = HTTP + TLS; SSL (historical) → TLS
- The padlock meaning: encrypted + verified identity, not "safe website"
- TLS provides security using cryptography
- Cryptography definition: plaintext ↔ ciphertext
- Core goals: Confidentiality, Integrity, Authentication
- Encryption/decryption pipeline with keys
- Symmetric encryption: same secret key
- Key-distribution problem of symmetric encryption
- Asymmetric encryption: encrypt with public key, decrypt with private key (RSA demo, JSEncrypt)
- Trusting a server: look-alike/homograph domains; certificates
- TCP 3-way handshake before TLS (SYN, SYN+ACK, ACK)
- TLS message flow: Client Hello, Server Hello, Server Hello Done, Client Key Exchange, Change Cipher Spec, Finished
- Asymmetric crypto for key exchange, then symmetric crypto for bulk data
- Digital certificate contents and example (*.canva.com, issued by Amazon RSA 2048 M04, expiry, serial)
- How HTTPS works: client public key / server certificate + private key
- CA validation of the server certificate; certificate chain; MITM prevention
- TLS handshake step 1: ClientHello (TLS 1.3/1.2, cipher suites, 32-byte random nonce)
- Step 2: ServerHello + Certificate (chosen cipher, public key + CA signature)
- Step 3: Authentication (certificate-chain validation via CA)
- Step 4: Key exchange (session key created by client, encrypted with server public key, cipher suite negotiation "A, B, C, D" → "C")
- Step 5: Encrypted data transfer with the shared session key (symmetric)
