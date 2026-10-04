window.UNITS = window.UNITS || {};
window.UNITS["unit08"] = {
  id: "unit08", num: 8, day: 3,
  title: "Email (SMTP/POP3/IMAP), Web Caching & CDNs",
  lectures: "Lecture 8 (taught Wk-4, 2nd) · WB-L07 (whole deck)",
  overview: "<p>Two ways the application layer moves content efficiently. <b>Email</b>: SMTP <i>pushes</i> mail from server to server (ports 25/587/465); IMAP (143/993) or POP3 (110/995) lets the receiver <i>pull</i> it. <b>Caching and CDNs</b>: keep copies close to the user, decide when a copy is fresh (Cache-Control max-age, Age), revalidate it cheaply (ETag → 304), and spread copies to edge servers chosen by DNS. Exams ask for ports, the SMTP command/reply sequence, hit/miss/stale definitions, average access time with a hit ratio, freshness timing, and CDN offload percentages.</p>",
  sections: [
    // ------------------------------------------------------------------ 08-A
    {
      id: "08-A",
      title: "SMTP: Pushing Mail from Server to Server",
      badge: "class",
      source: "WB-L07 p3–8",
      covers: ["08.1"],
      blocks: [
        { type: "intuition", title: "Post office to post office",
          html: "<p><b>Analogy.</b> You drop a letter at your local post office (your mail server). Post offices <b>push</b> it between themselves until it reaches the recipient's office, where it waits in a PO box. The recipient later <b>collects</b> it. Sending and collecting are different jobs with different rules.</p>" +
                "<p><b>From the slides (WB-L07 p6–7).</b> (1) The email client (Gmail app, Outlook) connects to the SMTP server. (2) <b>SMTP pushes</b> the message from the sender's mail server to the receiver's mail server. (3) The receiver uses <b>POP3 or IMAP</b> to retrieve it. SMTP (Simple Mail Transfer Protocol) runs over <b>TCP</b> on ports <b>25 / 587 / 465</b>.</p>" +
                "<p><b>Definition (RFC 5321; Kurose &amp; Ross §2.3).</b> SMTP is the Internet's application-layer protocol for <b>transferring</b> mail. It is a <b>push</b> protocol (the sender opens the connection and pushes the file), uses persistent TCP connections, and transfers messages as 7-bit ASCII text lines ending in CRLF (binary attachments are encoded with MIME). Contrast with HTTP, which is mainly a <b>pull</b> protocol.</p>" },
        { type: "figure", caption: "WB-L07 p6/p7 end-to-end flow. SMTP is used twice (client → own server, server → recipient's server); IMAP or POP3 is used for the last hop.",
          html: "<svg viewBox='0 0 660 150' width='100%' font-family='sans-serif'><defs><marker id='m08a' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='currentColor'/></marker></defs>" +
                "<g fill='none' stroke-width='2'><rect x='5' y='50' width='100' height='44' rx='8' stroke='var(--accent)'/><rect x='170' y='50' width='120' height='44' rx='8' stroke='var(--warn)'/><rect x='370' y='50' width='120' height='44' rx='8' stroke='var(--warn)'/><rect x='555' y='50' width='100' height='44' rx='8' stroke='var(--accent)'/></g>" +
                "<g fill='currentColor' font-size='12' text-anchor='middle'><text x='55' y='70'>Sender</text><text x='55' y='86' fill='var(--muted)' font-size='10'>mail client</text><text x='230' y='70'>Sender's</text><text x='230' y='86'>mail server</text><text x='430' y='70'>Receiver's</text><text x='430' y='86'>mail server</text><text x='605' y='70'>Receiver</text><text x='605' y='86' fill='var(--muted)' font-size='10'>mail client</text></g>" +
                "<g stroke='currentColor' stroke-width='1.8'><line x1='105' y1='72' x2='168' y2='72' marker-end='url(#m08a)'/><line x1='290' y1='72' x2='368' y2='72' marker-end='url(#m08a)'/><line x1='553' y1='72' x2='492' y2='72' marker-end='url(#m08a)'/></g>" +
                "<g font-size='11' text-anchor='middle'><text x='136' y='40' fill='var(--ok)'>SMTP push</text><text x='136' y='120' fill='var(--muted)'>port 587 / 465</text><text x='329' y='40' fill='var(--ok)'>SMTP push</text><text x='329' y='120' fill='var(--muted)'>port 25 (Internet)</text><text x='522' y='40' fill='var(--warn)'>IMAP / POP3 pull</text><text x='522' y='120' fill='var(--muted)'>143/993 or 110/995</text></g>" +
                "</svg>" },
        { type: "table", head: ["Port", "Protocol / use", "Security", "Who connects"],
          rows: [
            ["<b>25</b>", "SMTP relay between mail servers (MTA → MTA)", "plain, upgraded with STARTTLS when both sides support it", "sending server → receiver's MX server"],
            ["<b>587</b>", "SMTP <b>submission</b> (RFC 6409): client hands a new message to its own server", "STARTTLS, then login (SMTP AUTH)", "mail client → its provider's server"],
            ["<b>465</b>", "SMTP submission over <b>implicit TLS</b> (SMTPS, RFC 8314)", "TLS from the first byte", "mail client → its provider's server"],
            ["110 / <b>995</b>", "POP3 / POP3S", "995 = TLS", "client → mailbox server"],
            ["143 / <b>993</b>", "IMAP / IMAPS", "993 = TLS", "client → mailbox server"]
          ],
          caption: "Mail ports (WB-L07 p7, p10, p12). Every one of them runs over TCP." },
        { type: "callout", kind: "takeaway", title: "SMTP in the real world (WB-L07 p7–8)",
          html: "<p>Apps rarely run their own outbound mail servers. Services such as <b>Twilio SendGrid, Mailchimp and Mailgun</b> act as <b>SMTP relays</b>: your app submits mail to them (port 587 with a login, or their HTTP API) and they deliver it to the recipients' servers on port 25. For testing, <b>MailHog</b> (\"web and API based SMTP testing\", GitHub mailhog/MailHog) is a fake SMTP server that captures every message and shows it in a web UI instead of delivering it; its defaults are SMTP on port 1025 and the web UI on port 8025. The scripts in this unit build the same idea in Python.</p>" },
        { type: "callout", kind: "slidefix", title: "WB-L07 p4 and p7 typos",
          html: "<p>The protocol sign on p4 lists \"<b>FMTP</b>\": there is no such standard protocol; the intended name is <b>SMTP</b> (the same slide maps Emails → SMTP). On p7, \"integrations <b>us</b> SMTP Relays\" should read \"integrations <b>use</b> SMTP relays\".</p>" },
        { type: "cheat", items: [
            "SMTP = push, TCP, server-to-server transfer; IMAP/POP3 = pull, final hop to the reader",
            "25 relay (MTA → MTA) · 587 submission + STARTTLS · 465 submission over implicit TLS",
            "POP3 110 / POP3S 995 · IMAP 143 / IMAPS 993",
            "Message body must be 7-bit ASCII lines; attachments are MIME-encoded (base64)",
            "Relays: SendGrid, Mailchimp, Mailgun · Test server: MailHog"
          ] },
        { type: "worked", title: "Protocol and port on every hop", tag: "University-Midsem-style",
          problem: "<p>Alice uses Outlook (desktop) with her account <code>alice@company.in</code> to send mail to <code>bob@college.edu</code>; Bob reads mail on his phone with folders kept in sync with his laptop. Name the protocol, direction and usual port for each hop, and the number of separate TCP connections involved (one message, one read).</p>",
          steps: [
            { text: "Hop 1: Outlook → company.in's mail server: <b>SMTP submission</b>, push, port <b>587</b> (STARTTLS) or 465.", why: "A client hands new mail to its own provider using authenticated submission." },
            { text: "Hop 2: company.in's server looks up the MX of college.edu and pushes the message with <b>SMTP</b> on port <b>25</b>.", why: "Server-to-server relay uses port 25." },
            { text: "Hop 3: Bob's phone ← college.edu's server: <b>IMAP</b> over TLS, port <b>993</b>, the client pulls.", why: "Folders synced across devices means IMAP, not POP3." },
            { text: "Each hop is a separate TCP connection: 3 connections.", why: "SMTP and IMAP each run their own TCP sessions." }
          ],
          answer: "SMTP 587 (push) → SMTP 25 (push) → IMAP 993 (pull); <b>3</b> TCP connections. If Alice used webmail in a browser instead, hop 1 would be <b>HTTPS</b> (443), not SMTP." },
        { type: "code", file: "Unit08_smtplib_email.py", level: "high", title: "email.message builds a MIME message; smtplib sends it to a local fake SMTP server" },
        { type: "traps", items: [
            "SMTP only <b>sends</b>; it cannot fetch mail from a mailbox. Reading uses IMAP or POP3.",
            "Webmail (Gmail in a browser) uses HTTPS between browser and server; SMTP is still used between the mail servers.",
            "Port 25 is for server-to-server relay; clients submit on 587 (or 465).",
            "993 is IMAPS and 995 is POP3S: do not swap them.",
            "SMTP runs over TCP, never UDP."
          ] }
      ],
      practice: [
        { id: "u08-A-1", type: "mcq", tag: "University-Midsem-style", topic: "08.1",
          q: "<p>WB-L07 p7 calls SMTP a \"push-based\" protocol. What does that mean?</p>",
          options: ["The receiver's server opens the connection and pulls new mail", "The sending side opens the TCP connection and pushes the message to the receiving server", "SMTP pushes notifications to phones", "SMTP pushes mail over UDP without a connection"],
          answer: 1,
          why: ["That would be pull, which is how IMAP/POP3 work for the reader.", "Correct: the sender initiates and transfers the message.", "Phone notifications are not what push-based means here.", "SMTP always uses TCP."],
          explain: "<p>SMTP push vs HTTP/IMAP/POP3 pull is a classic MCQ contrast.</p>" },
        { id: "u08-A-2", type: "mcq", tag: "University-Midsem-style", topic: "08.1",
          q: "<p>A mail app is configured with server <code>smtp.provider.com</code>, port 587, STARTTLS, username and password. What is port 587 used for?</p>",
          options: ["Server-to-server relay", "Message submission from a client to its own mail server", "Retrieving mail with IMAP", "Retrieving mail with POP3 over TLS"],
          answer: 1,
          why: ["Server-to-server relay is port 25.", "Correct: RFC 6409 submission, upgraded with STARTTLS and authenticated.", "IMAP is 143/993.", "POP3S is 995."],
          explain: "<p>587 = submission; 465 = submission over implicit TLS; 25 = relay.</p>" },
        { id: "u08-A-3", type: "msq", tag: "University-Midsem-style", topic: "08.1",
          q: "<p>Which ports are listed for SMTP on WB-L07 p7? (Select all that apply.)</p>",
          options: ["25", "110", "465", "587"], answer: [0, 2, 3],
          why: ["Classic SMTP relay port.", "110 is POP3.", "SMTP over implicit TLS.", "SMTP submission."],
          explain: "<p>SMTP: 25 / 587 / 465.</p>" },
        { id: "u08-A-4", type: "mcq", tag: "GATE-style", topic: "08.1",
          q: "<p>Alice sends mail from Gmail in her web browser to Bob, who uses Outlook with POP3. Which protocol carries the message from Alice's browser to her Gmail server?</p>",
          options: ["SMTP", "HTTPS", "POP3", "IMAP"], answer: 1,
          why: ["SMTP is used between the Gmail server and Bob's server, not from the browser.", "Correct: a browser talks HTTP(S) to the webmail server.", "POP3 is for retrieving mail, and only on Bob's side.", "IMAP is for retrieving mail."],
          explain: "<p>Browser → webmail = HTTPS; server → server = SMTP; Bob ← server = POP3.</p>" },
        { id: "u08-A-5", type: "mcq", tag: "University-Midsem-style", topic: "08.1",
          q: "<p>What is MailHog (WB-L07 p8) used for?</p>",
          options: ["A production SMTP relay like SendGrid", "A fake SMTP server for testing that captures mail and shows it in a web UI", "An IMAP client", "A DNS MX checker"], answer: 1,
          why: ["It does not deliver mail to real recipients.", "Correct: \"web and API based SMTP testing\".", "It receives via SMTP and displays mail; it is not an IMAP client.", "It has nothing to do with DNS."],
          explain: "<p>Point your app's SMTP settings at MailHog during development so no real mail is sent.</p>" },
        { id: "u08-A-6", type: "text", tag: "University-Midsem-style", topic: "08.1",
          q: "<p>Predict the exact output.</p>",
          code: "ports = {'smtp': 25, 'submission': 587, 'smtps': 465, 'pop3': 110,\n         'pop3s': 995, 'imap': 143, 'imaps': 993}\nprint(sorted(p for p in ports.values() if p > 400))",
          answer: "[465, 587, 993, 995]", runCheck: true,
          explain: "<p>The ports above 400 are 587, 465, 995 and 993; sorted ascending.</p>" }
      ]
    },
    // ------------------------------------------------------------------ 08-B
    {
      id: "08-B",
      title: "Inside SMTP: MUA, MTA, MDA and the Command Dialogue",
      badge: "researched",
      source: "RFC 5321 §2–4; RFC 6409; RFC 8314; RFC 5322; Kurose & Ross 8e §2.3",
      covers: ["08.6"],
      blocks: [
        { type: "intuition", title: "Envelope vs letter",
          html: "<p><b>Analogy.</b> The postman reads only the <b>envelope</b> (who it is from and where it goes); the letter inside has its own \"Dear Bob\" and \"From Alice\" lines, which can differ. SMTP is the same: <code>MAIL FROM</code> and <code>RCPT TO</code> are the envelope; the <code>From:</code>, <code>To:</code> and <code>Subject:</code> headers are part of the letter sent after <code>DATA</code>.</p>" +
                "<p><b>Definition (RFC 5321).</b> An SMTP <b>client</b> opens a TCP connection to an SMTP <b>server</b>, which greets it with reply 220. The client then sends text commands, each answered by a 3-digit reply code: <b>HELO/EHLO</b> (identify; 250), <b>MAIL FROM</b> (envelope sender; 250), <b>RCPT TO</b> once per recipient (250), <b>DATA</b> (354 = go ahead), the message lines, a line containing only \"<b>.</b>\" (end of data; 250 = accepted), and <b>QUIT</b> (221 = closing). The same connection may carry several messages before QUIT.</p>" },
        { type: "table", head: ["Agent", "Full name", "Job", "Examples"],
          rows: [
            ["<b>MUA</b>", "Mail User Agent", "Where the user reads and writes mail", "Outlook, Thunderbird, Apple Mail, the Gmail app"],
            ["<b>MSA</b>", "Mail Submission Agent", "Accepts new mail from MUAs on port 587/465 after login", "the submission service of the provider's server"],
            ["<b>MTA</b>", "Mail Transfer Agent", "Relays mail between servers with SMTP on port 25, queueing and retrying when the next hop is down", "Postfix, Exim, Microsoft Exchange"],
            ["<b>MDA</b>", "Mail Delivery Agent", "Stores the received message into the recipient's mailbox", "Dovecot LDA, procmail"],
            ["Access server", "IMAP / POP3 server", "Lets the recipient's MUA read the mailbox", "Dovecot, Courier"]
          ],
          caption: "Path of a message: MUA → MSA → MTA → (Internet) → MTA → MDA → mailbox → IMAP/POP3 → MUA." },
        { type: "seq", left: "SMTP client (alice's server)", right: "SMTP server (mx of college.edu)",
          caption: "A complete SMTP session for one message with one recipient (RFC 5321 style). Every command line ends with CRLF.",
          events: [
            { from: "R", label: "220 mx.college.edu ESMTP ready", note: "after TCP handshake to port 25" },
            { from: "L", label: "EHLO mail.company.in" },
            { from: "R", label: "250-mx.college.edu / 250 SIZE, STARTTLS" },
            { from: "L", label: "MAIL FROM:<alice@company.in>" },
            { from: "R", label: "250 OK" },
            { from: "L", label: "RCPT TO:<bob@college.edu>" },
            { from: "R", label: "250 OK" },
            { from: "L", label: "DATA" },
            { from: "R", label: "354 Start mail input; end with <CRLF>.<CRLF>" },
            { from: "L", label: "headers, blank line, body, then a line with only '.'" },
            { from: "R", label: "250 OK: queued", note: "server now owns delivery" },
            { from: "L", label: "QUIT" },
            { from: "R", label: "221 closing connection" }
          ] },
        { type: "table", head: ["Code", "Meaning", "When you see it"],
          rows: [
            ["<b>220</b>", "Service ready", "greeting right after the TCP connection opens"],
            ["<b>250</b>", "Requested action OK", "after HELO/EHLO, MAIL FROM, each RCPT TO, and after the final \".\""],
            ["<b>354</b>", "Start mail input; end with &lt;CRLF&gt;.&lt;CRLF&gt;", "after DATA (an intermediate 3xx reply)"],
            ["<b>221</b>", "Service closing transmission channel", "after QUIT"],
            ["421 / 450 / 451", "Transient failure (4xx): try again later", "server busy, mailbox temporarily unavailable, local error"],
            ["500 / 501 / 502", "Permanent (5xx): syntax error / bad parameters / command not implemented", "unknown command or malformed address"],
            ["<b>503</b>", "Bad sequence of commands", "for example RCPT before MAIL, or DATA before any RCPT"],
            ["550 / 554", "Mailbox unavailable / transaction failed", "no such user, or message rejected as spam"]
          ],
          caption: "First digit: 2 = success, 3 = send more, 4 = temporary failure, 5 = permanent failure." },
        { type: "callout", kind: "key", title: "Message format, MIME and dot-stuffing",
          html: "<ul><li>The message itself (RFC 5322) = header lines (<code>From:</code>, <code>To:</code>, <code>Subject:</code>, <code>Date:</code>), one <b>blank line</b>, then the body. Every line ends with CRLF and is at most 1000 characters including CRLF.</li>" +
                "<li>SMTP carries 7-bit ASCII, so images and PDFs are wrapped in <b>MIME</b> parts (<code>Content-Type: multipart/mixed</code>) and encoded with <b>base64</b>: every 3 bytes become 4 characters, with a line break every 76 characters.</li>" +
                "<li>A line containing only \".\" ends the data. If a body line starts with \".\", the client adds an extra dot (<b>dot-stuffing</b>) and the server removes it.</li>" +
                "<li><b>Bcc</b> recipients appear only in RCPT TO (the envelope), never in the headers.</li></ul>" },
        { type: "derivation", title: "Counting replies and base64 growth",
          steps: [
            { tex: "R(n) = 1_{220} + 1_{HELO} + 1_{MAIL} + n_{RCPT} + 1_{354} + 1_{.} + 1_{QUIT}", why: "One reply for the greeting and for every command; one 250 per recipient; one 250 after the end-of-data dot." },
            { tex: "R(n) = n + 6", why: "Collect the six fixed replies." },
            { tex: "R(3) = 9: \\; 220, 250, 250, 250, 250, 250, 354, 250, 221", why: "The list asserted by Unit08_smtp_raw.py for three recipients." },
            { tex: "|\\text{base64}(B)| = 4 \\left\\lceil \\frac{B}{3} \\right\\rceil", why: "Each group of 3 input bytes (24 bits) becomes 4 characters of 6 bits; a partial last group is padded with =." },
            { tex: "|\\text{MIME body}| \\approx 4\\left\\lceil \\frac{B}{3} \\right\\rceil + 2\\left\\lceil \\frac{4\\lceil B/3 \\rceil}{76} \\right\\rceil", why: "Add a 2-byte CRLF after every 76-character line." }
          ] },
        { type: "cheat", items: [
            "Dialogue: 220 → HELO/EHLO 250 → MAIL FROM 250 → RCPT TO 250 (× n) → DATA 354 → body + \".\" 250 → QUIT 221",
            "Replies for n recipients: $n + 6$",
            "MUA (user app) → MSA (587/465) → MTA (25) → MDA (mailbox) → IMAP/POP3 → MUA",
            "Envelope (MAIL FROM / RCPT TO) ≠ headers (From: / To:); Bcc only in the envelope",
            "base64 size $= 4\\lceil B/3 \\rceil$ (+33%)",
            "503 = bad sequence; 5xx permanent, 4xx retry later"
          ] },
        { type: "worked", title: "A 3 MB attachment over SMTP", tag: "University-Midsem-style",
          problem: "<p>A 3,000,000-byte PDF is attached to a mail. Base64 output is split into 76-character lines, each followed by CRLF. (a) How many base64 characters? (b) How many lines? (c) Total bytes of the encoded part including CRLFs? (d) By what percentage did the attachment grow?</p>",
          steps: [
            { tex: "4 \\times \\left\\lceil \\frac{3000000}{3} \\right\\rceil = 4 \\times 1000000 = 4000000", why: "3,000,000 is a multiple of 3, so there is no padding." },
            { tex: "\\left\\lceil \\frac{4000000}{76} \\right\\rceil = \\lceil 52631.58 \\rceil = 52632 \\text{ lines}", why: "The last line is shorter than 76 characters but still needs a CRLF." },
            { tex: "4000000 + 2 \\times 52632 = 4105264\\,\\text{B}", why: "Each line adds 2 bytes of CRLF." },
            { tex: "\\frac{4105264 - 3000000}{3000000} \\times 100 = 36.84\\%", why: "33.3% from base64 plus about 3.5% from line breaks." }
          ],
          answer: "(a) <b>4,000,000</b> characters; (b) <b>52,632</b> lines; (c) <b>4,105,264</b> bytes; (d) about <b>36.8%</b> larger." },
        { type: "code", file: "Unit08_smtp_raw.py", level: "low", title: "Threaded fake SMTP server (state machine with 220/250/354/221/500/503) and a raw-socket client with dot-stuffing" },
        { type: "traps", items: [
            "354 is not an error: it means \"send the message now\".",
            "The message ends with a line holding a single dot, i.e. the byte sequence CRLF . CRLF, not with QUIT.",
            "One RCPT TO per recipient: three recipients = three 250 replies.",
            "MAIL FROM is the envelope sender (where bounces go); it need not equal the From: header.",
            "HELO is the original greeting; EHLO (extended) makes the server list its extensions (SIZE, STARTTLS, AUTH) in a multi-line 250 reply.",
            "A body line \".hello\" must be sent as \"..hello\" or the server may misread it."
          ] }
      ],
      practice: [
        { id: "u08-B-1", type: "num", tag: "University-Midsem-style", topic: "08.6",
          q: "<p>An SMTP client sends one message to <b>5</b> recipients in one session: HELO, MAIL FROM, RCPT TO ×5, DATA, the message and \".\", QUIT. How many reply lines with a status code does the server send, including the greeting? (integer)</p>",
          answer: 11, tol: 0, unit: "replies", verify: "5+6",
          steps: [ { tex: "R(n) = n + 6", why: "220, HELO 250, MAIL 250, n × RCPT 250, DATA 354, end-of-data 250, QUIT 221." }, { tex: "R(5) = 11", why: "Substitute n = 5." } ] },
        { id: "u08-B-2", type: "mcq", tag: "University-Midsem-style", topic: "08.6",
          q: "<p>Right after the client sends <code>DATA</code>, the server replies <code>354</code>. What should the client do?</p>",
          options: ["Close the connection: 354 is an error", "Send the message headers and body, then a line containing only a dot", "Send RCPT TO again", "Wait for a 250 before sending anything"],
          answer: 1,
          why: ["3xx is an intermediate positive reply, not an error.", "Correct: 354 means \"start mail input; end with CRLF.CRLF\".", "Recipients were already accepted.", "The 250 comes after the message is complete."],
          explain: "<p>DATA → 354 → message → \".\" → 250.</p>" },
        { id: "u08-B-3", type: "num", tag: "GATE-style", topic: "08.6",
          q: "<p>How many base64 characters encode a 600-byte attachment (ignore line breaks)? (integer)</p>",
          answer: 800, tol: 0, unit: "characters", verify: "4*math.ceil(600/3)",
          formula: "4\\left\\lceil \\frac{B}{3} \\right\\rceil",
          steps: [ { tex: "\\left\\lceil \\frac{600}{3} \\right\\rceil = 200", why: "Number of 3-byte groups." }, { tex: "4 \\times 200 = 800", why: "Each group becomes 4 characters." } ] },
        { id: "u08-B-4", type: "msq", tag: "University-Midsem-style", topic: "08.6",
          q: "<p>Alice sends a mail with To: bob, Cc: carol and Bcc: dave. Which statements are true? (Select all that apply.)</p>",
          options: ["The client sends three RCPT TO commands", "dave appears in the message headers that bob receives", "MAIL FROM carries the envelope sender, used for bounces", "The From: header is part of the data sent after DATA"],
          answer: [0, 2, 3],
          why: ["Every recipient, including Bcc, needs its own RCPT TO.", "Bcc is removed from the headers; it exists only in the envelope.", "Bounce messages go to the envelope sender.", "Headers are inside the message, after DATA."],
          explain: "<p>Envelope = MAIL FROM + RCPT TO; headers = the letter.</p>" },
        { id: "u08-B-5", type: "mcq", tag: "University-Midsem-style", topic: "08.6",
          q: "<p>A client connects, receives 220, and immediately sends <code>RCPT TO:&lt;bob@college.edu&gt;</code>. Which reply is expected?</p>",
          options: ["250 OK", "354 Start mail input", "503 Bad sequence of commands", "221 Bye"], answer: 2,
          why: ["The server cannot accept a recipient before HELO and MAIL FROM.", "354 only follows DATA.", "Correct: the command is valid but out of order.", "221 only follows QUIT."],
          explain: "<p>The SMTP state machine requires HELO/EHLO → MAIL → RCPT → DATA.</p>" },
        { id: "u08-B-6", type: "mcq", tag: "University-Midsem-style", topic: "08.6",
          q: "<p>Bug hunt: this hand-written SMTP client loses part of some messages. Why?</p>",
          code: "def send_body(sock, lines):\n    for line in lines:\n        sock.sendall(line.encode() + b'\\r\\n')\n    sock.sendall(b'.\\r\\n')",
          options: ["It must send b'\\n' instead of b'\\r\\n'", "It does not dot-stuff: a body line that is just '.' ends the message early", "sendall cannot send bytes", "The final dot must be sent before the body"],
          answer: 1,
          why: ["SMTP lines must end with CRLF; this part is right.", "Correct: lines starting with '.' need an extra '.' prepended.", "sendall takes bytes; that is what it is given.", "The dot terminates the data, so it goes last."],
          explain: "<p>Add <code>if line.startswith('.'): line = '.' + line</code> before sending each line.</p>" }
      ]
    },
    // ------------------------------------------------------------------ 08-C
    {
      id: "08-C",
      title: "Retrieving Mail: IMAP vs POP3",
      badge: "class",
      source: "WB-L07 p3, p9–14",
      covers: ["08.2"],
      blocks: [
        { type: "intuition", title: "Take the letters home, or read them at the counter",
          html: "<p><b>Analogy.</b> <b>POP3</b>: you empty your PO box and carry the letters home; the box is now empty and only your home has them. <b>IMAP</b>: the letters stay in the PO box, sorted into folders; you can read them from any branch, and marks such as \"read\" or \"moved to Projects\" are kept at the post office for every device to see.</p>" +
                "<p><b>From the slides.</b> IMAP (Internet Message Access Protocol) manages email directly on the server, suits multi-device access, supports folders and partial downloads, uses port <b>143</b> (IMAPS <b>993</b>), connection type <b>two-way sync</b> (p10–11). POP3 (Post Office Protocol v3) downloads email to the local client and <b>deletes it from the server</b>, is best for offline access but syncs poorly across devices, uses port <b>110</b> (POP3S <b>995</b>), connection type <b>one-way</b> server → client (p12–13).</p>" +
                "<p><b>Standards.</b> POP3 is RFC 1939; IMAP4rev2 is RFC 9051. Both are <b>application-layer</b> pull protocols over TCP.</p>" },
        { type: "callout", kind: "slidefix", title: "B17: IMAP is not a Presentation-layer protocol",
          html: "<p>The OSI recap on <b>WB-L07 p3</b> (and WB-L03 p15) lists \"JPEG MPEG <b>IMAP</b>\" under layer 6, Presentation. <b>IMAP is an Application-layer protocol</b> (layer 7 in OSI, Application layer in TCP/IP), just like SMTP, POP3 and HTTP: it defines commands and replies between a mail client and a mailbox server. JPEG and MPEG are data-format examples that some textbooks place at Presentation; IMAP is not.</p>" },
        { type: "figure", caption: "WB-L07 p10 redrawn: one SMTP mail server feeding an IMAP path (messages managed remotely, two-way) and a POP path (messages downloaded, one-way).",
          html: "<svg viewBox='0 0 640 200' width='100%' font-family='sans-serif'><defs><marker id='m08c' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='currentColor'/></marker></defs>" +
                "<g fill='none' stroke-width='2'><rect x='5' y='80' width='110' height='40' rx='8' stroke='var(--accent)'/><rect x='160' y='80' width='120' height='40' rx='8' stroke='var(--warn)'/>" +
                "<rect x='330' y='20' width='130' height='40' rx='8' stroke='var(--ok)'/><rect x='330' y='140' width='130' height='40' rx='8' stroke='var(--ok)'/><rect x='520' y='20' width='115' height='40' rx='8' stroke='var(--accent)'/><rect x='520' y='140' width='115' height='40' rx='8' stroke='var(--accent)'/></g>" +
                "<g fill='currentColor' font-size='12' text-anchor='middle'><text x='60' y='104'>Sender UA</text><text x='220' y='104'>SMTP mail server</text><text x='395' y='44'>IMAP mail server</text><text x='395' y='164'>POP mail server</text><text x='577' y='44'>IMAP UA</text><text x='577' y='164'>POP UA</text></g>" +
                "<g stroke='currentColor' stroke-width='1.6'><line x1='115' y1='100' x2='158' y2='100' marker-end='url(#m08c)'/><line x1='280' y1='90' x2='328' y2='45' marker-end='url(#m08c)'/><line x1='280' y1='110' x2='328' y2='155' marker-end='url(#m08c)'/>" +
                "<line x1='462' y1='40' x2='518' y2='40' marker-end='url(#m08c)' marker-start='url(#m08c)'/><line x1='462' y1='160' x2='518' y2='160' marker-end='url(#m08c)'/></g>" +
                "<g font-size='11' text-anchor='middle'><text x='490' y='78' fill='var(--ok)'>managed remotely (sync)</text><text x='490' y='132' fill='var(--warn)'>downloaded (one-way)</text><text x='137' y='92' fill='var(--muted)'>SMTP</text></g>" +
                "</svg>" },
        { type: "table", head: ["Feature", "IMAP", "POP3"],
          rows: [
            ["Port / secure port", "<b>143 / 993</b> (IMAPS)", "<b>110 / 995</b> (POP3S)"],
            ["Where mail lives", "on the server (the client caches copies)", "on the client after download; deleted from the server (default on the slide)"],
            ["Multi-device", "excellent: every device sees the same mailbox", "poor: each device downloads different mail"],
            ["Folders, read/unread flags", "kept on the server and synced", "only one inbox on the server; folders exist only locally"],
            ["Partial download", "yes: headers first, a body part or attachment on demand", "whole messages (TOP shows only headers + n lines)"],
            ["Offline use", "needs the cached copies", "everything is local, good offline"],
            ["Direction (slides)", "two-way sync client ↔ server", "one-way server → client"],
            ["Server storage", "high (mail stays)", "low (mail removed)"],
            ["Typical commands", "LOGIN, SELECT INBOX, FETCH, STORE +FLAGS (\\Seen), SEARCH, LOGOUT", "USER, PASS, STAT, LIST, RETR, DELE, QUIT"]
          ],
          caption: "IMAP vs POP3 (WB-L07 p10–13, plus RFC 9051 and RFC 1939 for the commands)." },
        { type: "seq", left: "POP3 client", right: "POP3 server (port 110)", caption: "A POP3 download-and-delete session (RFC 1939). Deletions marked with DELE take effect at QUIT (the UPDATE state).",
          events: [
            { from: "R", label: "+OK POP3 server ready" },
            { from: "L", label: "USER bob" },
            { from: "R", label: "+OK" },
            { from: "L", label: "PASS ********" },
            { from: "R", label: "+OK 2 messages" },
            { from: "L", label: "RETR 1" },
            { from: "R", label: "+OK, message 1 lines, then ." },
            { from: "L", label: "DELE 1" },
            { from: "R", label: "+OK message 1 deleted" },
            { from: "L", label: "QUIT" },
            { from: "R", label: "+OK bye (deletions committed)" }
          ] },
        { type: "cheat", items: [
            "IMAP 143 / <b>993</b>; POP3 110 / <b>995</b>",
            "IMAP = server-side mailbox, folders, flags, multi-device, two-way sync, partial fetch",
            "POP3 = download and delete, offline, one-way, poor multi-device",
            "Both: application layer, TCP, pull; SMTP sends, IMAP/POP3 read",
            "POP3 replies are +OK / -ERR; IMAP replies are tagged OK / NO / BAD"
          ] },
        { type: "worked", title: "Choosing the retrieval protocol", tag: "University-Midsem-style",
          problem: "<p>A student reads college mail on a phone, a laptop and a lab PC. When she reads a mail on the phone it should show as read on the laptop, and moving mail to a \"Midsem\" folder should appear everywhere. Which protocol and port should all three clients use, and what goes wrong with POP3 in its default mode?</p>",
          steps: [
            { text: "Requirement: one shared mailbox state across 3 devices (read flags, folders).", why: "That is exactly IMAP's two-way synchronisation (p11)." },
            { text: "Choose IMAP over TLS: port <b>993</b>.", why: "IMAPS is the secure IMAP port; 143 is plain IMAP." },
            { text: "With POP3 (download and delete): the phone downloads a message and the server deletes it; the laptop never sees it.", why: "POP3 is one-way and removes mail from the server (p12–13)." },
            { text: "Folders and read flags made on one device stay on that device only.", why: "POP3 has no server-side folders or flags." }
          ],
          answer: "<b>IMAP on port 993</b>. With default POP3, each message ends up on whichever device fetched it first, and folders/read state never sync." },
        { type: "traps", items: [
            "Secure IMAP is 993; 995 is POP3S. The quiz mixes them on purpose.",
            "IMAP is an <b>application-layer</b> protocol (slide fix B17), not Presentation.",
            "POP3 can be configured to \"leave a copy on the server\", but its slide-defined behaviour is download-and-delete.",
            "IMAP and POP3 are only for <b>reading</b>; sending always uses SMTP.",
            "IMAP partial download means fetching headers or one MIME part without the whole message."
          ] }
      ],
      practice: [
        { id: "u08-C-1", type: "mcq", tag: "From class quiz", topic: "08.2",
          q: "<p>Secure IMAP port?</p>",
          options: ["110", "993", "587", "995"], answer: 1,
          why: ["110 is plain POP3.", "Correct: IMAPS (IMAP over implicit TLS) uses port 993 (WB-L07 p10; RFC 8314).", "587 is SMTP submission.", "995 is POP3S, the secure POP3 port."],
          explain: "<p><b>Note:</b> the Study Pack does not record an answer for this quiz question (\"not shown by Newton\"); <b>993</b> is the standard answer and matches WB-L07 p10. This answer is therefore flagged as <i>not from the source</i>.</p>" },
        { id: "u08-C-2", type: "mcq", tag: "University-Midsem-style", topic: "08.2",
          q: "<p>Which protocol is best for a user who checks the same mailbox from a phone, a tablet and a laptop and wants read/unread status synced?</p>",
          options: ["POP3", "IMAP", "SMTP", "FTP"], answer: 1,
          why: ["POP3 downloads and deletes, so devices drift apart.", "Correct: IMAP keeps mail and flags on the server and syncs all devices.", "SMTP only sends mail.", "FTP transfers files, not mailboxes."],
          explain: "<p>Multi-device + sync → IMAP (WB-L07 p10–11).</p>" },
        { id: "u08-C-3", type: "msq", tag: "University-Midsem-style", topic: "08.2",
          q: "<p>According to WB-L07 p10–11, which are features of IMAP? (Select all that apply.)</p>",
          options: ["Manages email directly on the server", "Supports folders and partial downloads", "Deletes mail from the server after download", "Two-way synchronisation between client and server"],
          answer: [0, 1, 3],
          why: ["Mail stays on the server.", "Both are listed on p10.", "That is POP3's behaviour (p12).", "Connection type: two-way sync."],
          explain: "<p>IMAP: server-side, folders, partial download, sync.</p>" },
        { id: "u08-C-4", type: "mcq", tag: "University-Midsem-style", topic: "08.2",
          q: "<p>At which layer does IMAP operate?</p>",
          options: ["Presentation layer, as WB-L07 p3 lists it", "Application layer", "Session layer", "Transport layer"], answer: 1,
          why: ["The slide is wrong here (fix B17).", "Correct: IMAP is an application-layer protocol over TCP.", "Session-layer examples are RPC/sockets, not IMAP.", "Transport is TCP/UDP; IMAP runs on top of TCP."],
          explain: "<p>Slide fix B17: IMAP belongs with SMTP, POP3 and HTTP in the Application layer.</p>" },
        { id: "u08-C-5", type: "mcq", tag: "University-Midsem-style", topic: "08.2",
          q: "<p>A POP3 client issues <code>RETR 1</code>, <code>DELE 1</code>, then the connection drops before <code>QUIT</code>. What happens to message 1 on the server?</p>",
          options: ["It is deleted immediately at DELE", "It stays on the server: deletions are committed only when QUIT is processed", "It is moved to a Trash folder", "It is returned to the sender"], answer: 1,
          why: ["DELE only marks the message.", "Correct: RFC 1939 applies deletions in the UPDATE state after QUIT.", "POP3 has no folders.", "Nothing is bounced."],
          explain: "<p>POP3 states: AUTHORIZATION → TRANSACTION → UPDATE (entered on QUIT).</p>" },
        { id: "u08-C-6", type: "msq", tag: "University-Midsem-style", topic: "08.2",
          q: "<p>Select every correct (protocol, port) pair.</p>",
          options: ["POP3S, 995", "IMAP, 143", "IMAPS, 995", "POP3, 110"], answer: [0, 1, 3],
          why: ["POP3 over TLS uses 995.", "Plain IMAP uses 143.", "IMAPS uses 993, not 995.", "Plain POP3 uses 110."],
          explain: "<p>110/995 for POP3, 143/993 for IMAP.</p>" }
      ]
    },
    // ------------------------------------------------------------------ 08-D
    {
      id: "08-D",
      title: "Web Caching: Hit, Miss, Stale and Cache-Control max-age",
      badge: "class",
      source: "WB-L07 p15–20, p28; WB-L08 p3 (recap); Kurose & Ross 8e §2.2.5 (numerical)",
      covers: ["08.3", "08.4"],
      blocks: [
        { type: "intuition", title: "The fridge and the supermarket",
          html: "<p><b>Analogy.</b> Milk in your fridge (cache) is seconds away; the supermarket (origin server) is twenty minutes away. You check the fridge first: if the milk is there and not past its date, that is a <b>hit</b>. If it is missing (<b>miss</b>) or past its date (<b>stale</b>), you go to the shop and put the new carton in the fridge for next time.</p>" +
                "<p><b>Definition (WB-L07 p17).</b> Caching is \"the process of storing copies of data in a temporary, high-speed storage layer so that future requests for that same data can be served much faster than fetching it from the original, slower source\". A <b>cache hit</b> = content is cached and <b>not stale</b>; a <b>cache miss</b> = content is not cached or is stale, so the request goes to the server. WB-L07 p16 motivates it: the same content is requested again and again.</p>" +
                "<p><b>Cache-Control (p19).</b> The server labels a response with <code>Cache-Control: public, max-age=3600</code>: any cache may store it (<i>public</i>) and reuse it for <b>3600 seconds</b> without asking the server again.</p>" },
        { type: "figure", caption: "WB-L07 p17–18: a miss goes to the origin and fills the cache; later requests are hits served by the cache alone.",
          html: "<svg viewBox='0 0 640 180' width='100%' font-family='sans-serif'><defs><marker id='m08d' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='currentColor'/></marker></defs>" +
                "<g fill='none' stroke-width='2'><rect x='10' y='65' width='100' height='44' rx='8' stroke='var(--accent)'/><rect x='260' y='65' width='120' height='44' rx='8' stroke='var(--ok)'/><rect x='520' y='65' width='110' height='44' rx='8' stroke='var(--warn)'/></g>" +
                "<g fill='currentColor' font-size='12' text-anchor='middle'><text x='60' y='92'>Client</text><text x='320' y='85'>Cache</text><text x='320' y='100' fill='var(--muted)' font-size='10'>(browser / proxy / CDN)</text><text x='575' y='92'>Origin server</text></g>" +
                "<g stroke='currentColor' stroke-width='1.6'><line x1='110' y1='75' x2='258' y2='75' marker-end='url(#m08d)'/><line x1='258' y1='100' x2='112' y2='100' marker-end='url(#m08d)'/>" +
                "<line x1='380' y1='75' x2='518' y2='75' stroke='var(--warn)' stroke-dasharray='5 4' marker-end='url(#m08d)'/><line x1='518' y1='100' x2='382' y2='100' stroke='var(--warn)' stroke-dasharray='5 4' marker-end='url(#m08d)'/></g>" +
                "<g font-size='11' text-anchor='middle'><text x='185' y='66' fill='currentColor'>request</text><text x='185' y='118' fill='currentColor'>response</text><text x='450' y='66' fill='var(--warn)'>only on MISS / stale</text><text x='450' y='118' fill='var(--warn)'>asset is cached</text>" +
                "<text x='185' y='150' fill='var(--ok)'>HIT: cached and not stale → answered here</text><text x='450' y='150' fill='var(--bad)'>MISS: not cached or stale → fetch</text></g>" +
                "</svg>" },
        { type: "seq", left: "Laptop (browser cache)", right: "Server", caption: "WB-L07 p19 (= WB-L08 p3 recap): Cache-Control max-age=3600 on foobar.css.",
          events: [
            { from: "L", label: "Request: foobar.css", note: "t = 0, cache empty (miss)" },
            { from: "R", label: "foobar.css + Cache-Control: max-age=3600", note: "store foobar.css" },
            { gap: true, note: "0 < age < 3600 s: retrieve foobar.css from the browser cache, no request at all" },
            { from: "L", label: "Request foobar.css again (copy is stale)", note: "t ≥ 3600 s" },
            { from: "R", label: "fresh copy (200) or 304 Not Modified", note: "revalidated (see 08-E)" }
          ] },
        { type: "table", head: ["Layer (p20)", "Where it sits", "Serves", "Shared?"],
          rows: [
            ["<b>Browser cache</b>", "inside the user's browser", "one user", "private"],
            ["<b>Proxy cache</b>", "in the institution/ISP network, between clients and the Internet; does an \"up-to-date check\" with the remote server", "all users of that network", "shared"],
            ["<b>CDN cache</b>", "reverse-proxy cache servers in front of the web server, at edge locations near users", "all visitors of that website", "shared"]
          ],
          caption: "Layers of caching (WB-L07 p20)." },
        { type: "text", html: "<p><b>How caching works (WB-L07 p28).</b> (1) The client requests a resource (an image or a CSS file). (2) The server responds and may include Cache-Control headers. (3) The client stores the resource in its local cache. (4) On the next request the client checks whether the cached copy is still valid (not expired). (5) If valid, it uses the cached copy with no network trip. (6) If expired, it revalidates or fetches again. <b>First request vs subsequent requests (p18):</b> the first request travels client → caching server → origin, and the asset is cached on the way back; subsequent requests stop at the caching server.</p>" },
        { type: "derivation", title: "Average access time and the Kurose institutional cache",
          steps: [
            { tex: "\\bar{T} = h\\,T_{hit} + (1-h)\\,T_{miss}", why: "A fraction h of requests is served by the cache; the rest pay the full miss cost (cache check + origin fetch)." },
            { tex: "\\rho_{LAN} = \\frac{15\\,\\text{req/s} \\times 1\\,\\text{Mb}}{100\\,\\text{Mbps}} = 0.15", why: "Traffic intensity = arrival rate × object size / link rate (Kurose: 15 req/s of 1 Mb objects on a 100 Mbps LAN)." },
            { tex: "\\rho_{access} = \\frac{15 \\times 1\\,\\text{Mb/s}}{15\\,\\text{Mbps}} = 1", why: "On the 15 Mbps access link the intensity is 1, so queueing delay grows without bound (minutes)." },
            { tex: "\\rho'_{access} = (1-h)\\,\\rho_{access} = 0.6 \\times 1 = 0.6", why: "With a cache of hit rate h = 0.4, only 60% of requests cross the access link; at 0.6 the queueing delay is small (tens of ms)." },
            { tex: "\\bar{T} = 0.4 \\times 0.01 + 0.6 \\times 2.01 = 0.004 + 1.206 = 1.21\\,\\text{s}", why: "Hits take ≈ 10 ms on the LAN; misses take the 2 s Internet delay plus ≈ 10 ms." },
            { tex: "\\text{fresh} \\iff \\text{age} < \\text{max-age}", why: "A copy may be reused while its age is below max-age; at age ≥ max-age it is stale and must be revalidated or refetched." }
          ] },
        { type: "cheat", items: [
            "Hit = cached <b>and</b> not stale; miss = not cached <b>or</b> stale",
            "$\\bar{T} = h T_{hit} + (1-h) T_{miss}$",
            "Traffic intensity $\\rho = aL/R$; $\\rho \\to 1$ means huge queueing delay",
            "Kurose cache example: $\\rho_{access}$ 1 → 0.6 with $h = 0.4$; average delay ≈ 1.21 s (cheaper than upgrading the link)",
            "<code>Cache-Control: public, max-age=3600</code> = any cache may keep it for 3600 s",
            "Layers: browser (private) → proxy (shared, institution) → CDN (shared, reverse proxy near users)"
          ] },
        { type: "worked", title: "Kurose & Ross institutional cache", tag: "GATE-style",
          problem: "<p>An institution's LAN (100 Mbps) connects to the Internet through a 15 Mbps access link. Browsers request 15 objects per second, each 1 Mb (megabit). The delay from the institution's router to any origin server and back is 2 s (the \"Internet delay\"). (a) Find the traffic intensity on the LAN and on the access link. (b) A cache with hit rate 0.4 is installed; find the new access-link intensity and the average response time, taking about 0.01 s for a LAN/access-link transfer.</p>",
          steps: [
            { tex: "aL = 15 \\times 1\\,\\text{Mb} = 15\\,\\text{Mbps}", why: "Offered load = request rate × object size." },
            { tex: "\\rho_{LAN} = \\frac{15}{100} = 0.15", why: "A LAN intensity of 0.15 adds only tens of microseconds." },
            { tex: "\\rho_{access} = \\frac{15}{15} = 1.0", why: "Intensity 1 on the access link: the queue grows without bound, so response times reach minutes." },
            { tex: "\\rho'_{access} = (1 - 0.4) \\times 1.0 = 0.6", why: "40% of requests are served inside the LAN; only misses cross the access link." },
            { tex: "\\bar{T} = 0.4(0.01) + 0.6(2 + 0.01) = 1.21\\,\\text{s}", why: "Weighted average of hit time and miss time." }
          ],
          answer: "(a) LAN <b>0.15</b>, access link <b>1.0</b> (unusable delay). (b) access link <b>0.6</b>; average response ≈ <b>1.21 s</b>, better than upgrading the access link to 100 Mbps (≈ 2 s), and much cheaper." },
        { type: "worked", title: "Average access time from a hit ratio", tag: "University-Midsem-style",
          problem: "<p>A browser cache answers in 5 ms; a miss costs 100 ms (including the cache check). The hit ratio is 0.8. (a) Average access time? (b) What hit ratio would bring the average down to 15 ms?</p>",
          steps: [
            { tex: "\\bar{T} = 0.8 \\times 5 + 0.2 \\times 100 = 4 + 20 = 24\\,\\text{ms}", why: "Weight each case by its probability." },
            { tex: "15 = 5h + 100(1-h) = 100 - 95h", why: "Set the target and solve for h." },
            { tex: "h = \\frac{100 - 15}{95} = \\frac{85}{95} \\approx 0.895", why: "Rearrange." }
          ],
          answer: "(a) <b>24 ms</b>; (b) h ≈ <b>0.895</b> (about 89.5% hits)." },
        { type: "code", file: "Unit08_lru_cache.py", level: "low", title: "Hand-built LRU cache (hash map + doubly linked list) with hit/miss/stale counts and the Kurose numbers" },
        { type: "traps", items: [
            "A stale copy counts as a <b>miss</b> even though it is still stored.",
            "max-age is in <b>seconds</b> and is measured from when the response was generated, not from the last time you used it.",
            "Hit ratio applies to requests, not bytes (byte hit ratio is a separate measure).",
            "Traffic intensity uses bits: 1 Mb objects × 15 req/s = 15 Mbps.",
            "With $\\rho = 1$ the delay is not \"2 s\": it is unbounded."
          ] }
      ],
      practice: [
        { id: "u08-D-1", type: "mcq", tag: "From class quiz", topic: "08.3",
          q: "<p>Cache hit reduces:</p>",
          options: ["Storage", "Latency and origin load", "TLS", "Email size"], answer: 1,
          why: ["A cache uses extra storage; it does not reduce it.", "Correct: the reply comes from a nearby copy (lower latency) and the origin never sees the request (lower load).", "TLS cost is unrelated to whether the content was cached.", "Email size has nothing to do with web caching."],
          explain: "<p>Quiz explanation: \"Cached data is reused.\" Reuse avoids the trip to the origin, saving time and origin work.</p>" },
        { id: "u08-D-2", type: "mcq", tag: "From class quiz", topic: "08.3",
          q: "<p>Cache miss occurs when:</p>",
          options: ["Fresh cache exists", "Object missing/expired", "Browser offline", "SMTP fails"], answer: 1,
          why: ["A fresh cached copy is the definition of a hit.", "Correct: not cached, or cached but stale (WB-L07 p17), so an origin fetch is required.", "Being offline makes the fetch fail; it does not define a miss.", "SMTP is email, unrelated to web caching."],
          explain: "<p>Quiz explanation: \"Origin fetch required.\"</p>" },
        { id: "u08-D-3", type: "mcq", tag: "From class quiz", topic: "08.4",
          q: "<p>Cache-Control max-age primarily defines:</p>",
          options: ["TLS life", "Cache lifetime", "SMTP retry", "DNS TTL"], answer: 1,
          why: ["TLS session lifetime is set by TLS, not by an HTTP caching header.", "Correct: how many seconds the response stays fresh in a cache.", "SMTP retry timers belong to mail servers.", "DNS TTL is a field in DNS records; max-age is its HTTP analogue, not the same thing."],
          explain: "<p>Quiz explanation: \"Cache freshness.\" max-age=3600 → fresh for 3600 s.</p>" },
        { id: "u08-D-4", type: "num", tag: "University-Midsem-style", topic: "08.3",
          q: "<p>Hit ratio 0.9, hit time 2 ms, miss time 80 ms. Average access time in <b>ms</b>, rounded to 1 decimal?</p>",
          answer: 9.8, tol: 0.05, unit: "ms", verify: "round(0.9*2 + 0.1*80, 1)",
          formula: "\\bar{T} = hT_{hit} + (1-h)T_{miss}",
          steps: [ { tex: "0.9 \\times 2 = 1.8", why: "Hit contribution." }, { tex: "0.1 \\times 80 = 8.0", why: "Miss contribution." }, { tex: "\\bar{T} = 9.8\\,\\text{ms}", why: "Add." } ] },
        { id: "u08-D-5", type: "num", tag: "GATE-style", topic: "08.3",
          q: "<p>In the Kurose institutional example (15 req/s, 1 Mb objects, 15 Mbps access link), what is the <b>minimum</b> cache hit rate needed to bring the access-link traffic intensity down to 0.5? (decimal, 1 place)</p>",
          answer: 0.5, tol: 0.001, unit: "", verify: "1 - 0.5*15/15",
          steps: [ { tex: "(1-h) \\times \\frac{15}{15} \\le 0.5", why: "Only misses use the access link." }, { tex: "h \\ge 0.5", why: "Solve for h." } ] },
        { id: "u08-D-6", type: "num", tag: "University-Midsem-style", topic: "08.4",
          q: "<p>A browser stores <code>foobar.css</code> (Cache-Control: max-age=3600) at 10:00:00. For how many <b>seconds</b> after 10:45:00 will it still use the copy without contacting the server? (integer)</p>",
          answer: 900, tol: 0, unit: "s", verify: "3600 - 45*60",
          steps: [ { tex: "\\text{age} = 45 \\times 60 = 2700\\,\\text{s}", why: "Time since the copy was stored." }, { tex: "3600 - 2700 = 900\\,\\text{s}", why: "Remaining freshness (until 11:00:00)." } ] },
        { id: "u08-D-7", type: "text", tag: "University-Midsem-style", topic: "08.3",
          q: "<p>Predict the exact output (an LRU cache with capacity 2).</p>",
          code: "from collections import OrderedDict\ncache, hits = OrderedDict(), 0\nfor k in ['A', 'B', 'A', 'C', 'B', 'A']:\n    if k in cache:\n        hits += 1\n        cache.move_to_end(k)\n    else:\n        if len(cache) == 2:\n            cache.popitem(last=False)\n        cache[k] = 1\nprint(hits, list(cache))",
          answer: "1 ['B', 'A']", runCheck: true,
          explain: "<p>A miss [A]; B miss [A,B]; A hit [B,A]; C miss, evict B → [A,C]; B miss, evict A → [C,B]; A miss, evict C → [B,A]. One hit.</p>" }
      ]
    },
    // ------------------------------------------------------------------ 08-E
    {
      id: "08-E",
      title: "Conditional GET: ETag, If-None-Match and 304; Cache-Control Directives",
      badge: "researched",
      source: "RFC 9110 §8.8, §13.1–13.2, §15.4.5; RFC 9111 §4–5; Kurose & Ross 8e §2.2.5",
      covers: ["08.6"],
      blocks: [
        { type: "intuition", title: "\"Has it changed since version 7?\"",
          html: "<p><b>Analogy.</b> Instead of buying today's newspaper again to see whether it changed, you phone the shop: \"I have edition 7; is that still current?\" The shop says \"yes, keep it\" (a few words) or sends edition 8. A <b>conditional GET</b> is that phone call.</p>" +
                "<p><b>Definition (RFC 9110 §13).</b> A server attaches <b>validators</b> to a response: an <b>ETag</b> (entity tag, an opaque version string such as <code>\"16a6b85d60b03742\"</code>) and/or <b>Last-Modified</b> (a date). When a cached copy becomes stale, the cache sends <code>If-None-Match: &lt;etag&gt;</code> and/or <code>If-Modified-Since: &lt;date&gt;</code>. If the resource is unchanged, the server answers <b>304 Not Modified</b> with headers only and <b>no body</b>; the cache marks its copy fresh again. If it changed, the server sends a normal <b>200 OK</b> with the new body and new validators. If-None-Match takes precedence when both are sent.</p>" },
        { type: "seq", left: "Browser cache", right: "Origin server", caption: "Validation cycle exercised by Unit08_http_etag.py (max-age = 3600 s).",
          events: [
            { from: "L", label: "GET /foobar.css", note: "t = 0, empty cache" },
            { from: "R", label: "200 OK, ETag \"16a6\", max-age=3600, 22-byte body" },
            { gap: true, note: "t = 1800 s: fresh, served from cache, no request" },
            { from: "L", label: "GET /foobar.css, If-None-Match: \"16a6\"", note: "t = 4000 s, stale" },
            { from: "R", label: "304 Not Modified (no body)", note: "copy freshened" },
            { gap: true, note: "origin edits the file: new ETag" },
            { from: "L", label: "GET /foobar.css, If-None-Match: \"16a6\"", note: "t = 8000 s, stale" },
            { from: "R", label: "200 OK, new ETag, 25-byte body" }
          ] },
        { type: "table", head: ["Validator (response)", "Conditional header (request)", "Compared by", "Notes"],
          rows: [
            ["<code>ETag: \"abc123\"</code>", "<code>If-None-Match: \"abc123\"</code>", "exact tag match", "strong tag changes with every byte; a weak tag <code>W/\"abc123\"</code> means semantically equivalent; preferred validator"],
            ["<code>Last-Modified: Thu, 01 Jan 2026 00:00:00 GMT</code>", "<code>If-Modified-Since: (same date)</code>", "date comparison, 1-second resolution", "used when there is no ETag; can miss two changes within the same second"]
          ],
          caption: "Validators and their conditional request headers." },
        { type: "table", head: ["Directive", "Meaning"],
          rows: [
            ["<code>max-age=N</code>", "the response is fresh for N seconds after it was generated (all caches)"],
            ["<code>s-maxage=N</code>", "like max-age but only for <b>shared</b> caches (proxies, CDNs); overrides max-age there"],
            ["<code>public</code>", "any cache may store it, including shared caches, even for authenticated requests"],
            ["<code>private</code>", "only the user's own (browser) cache may store it; shared caches must not"],
            ["<code>no-cache</code>", "may be stored, but must be <b>revalidated</b> with the origin before every reuse"],
            ["<code>no-store</code>", "must not be stored anywhere (for sensitive data)"],
            ["<code>must-revalidate</code>", "once stale, must not be served without successful revalidation"],
            ["<code>Age: N</code> (header)", "seconds the response has already spent in caches upstream, added by a cache such as a CDN"],
            ["<code>Expires: date</code> (header)", "older absolute-date form of max-age; ignored when max-age is present"]
          ],
          caption: "Cache-Control directives and related headers (RFC 9111 §5)." },
        { type: "derivation", title: "Freshness arithmetic (RFC 9111 §4.2, simplified)",
          steps: [
            { tex: "\\text{freshness\\_lifetime} = \\text{s-maxage (shared)} \\;\\text{or}\\; \\text{max-age}", why: "A shared cache uses s-maxage if present; otherwise every cache uses max-age." },
            { tex: "\\text{current\\_age} = \\text{Age} + \\text{resident\\_time}", why: "Time already spent upstream (the Age header) plus time spent in this cache since it was received (ignoring transit delay)." },
            { tex: "\\text{fresh} \\iff \\text{freshness\\_lifetime} > \\text{current\\_age}", why: "The RFC 9111 freshness test." },
            { tex: "\\text{remaining} = \\text{max-age} - \\text{Age} \\;\\text{(at the moment of receipt)}", why: "A copy that arrives with Age: 1200 and max-age=3600 has 2400 s of life left in the receiving cache." },
            { tex: "\\text{heuristic lifetime} \\approx 0.1 \\times (\\text{Date} - \\text{Last-Modified})", why: "With no explicit expiry, RFC 9111 §4.2.2 allows a heuristic; 10% of the time since the last change is the common choice." }
          ] },
        { type: "cheat", items: [
            "ETag → If-None-Match; Last-Modified → If-Modified-Since; unchanged → <b>304 Not Modified</b> (no body)",
            "no-cache = store but revalidate every time; no-store = never store",
            "private = browser only; public = anyone; s-maxage = shared caches only",
            "current_age = Age + resident time; fresh while current_age < max-age",
            "remaining freshness at receipt = max-age − Age",
            "If-None-Match wins over If-Modified-Since"
          ] },
        { type: "worked", title: "A copy that arrives already aged", tag: "University-Midsem-style",
          problem: "<p>At 10:00:00 a browser receives a response from a CDN with <code>Cache-Control: public, max-age=3600</code>, <code>Age: 1200</code> and <code>ETag: \"v7\"</code>. (a) Until what time is it fresh in the browser? (b) At 10:50:00 the user reloads; what does the browser send, and what comes back if the file has not changed? (c) How many body bytes does the reply carry?</p>",
          steps: [
            { tex: "\\text{remaining} = 3600 - 1200 = 2400\\,\\text{s} = 40\\,\\text{min}", why: "The response is already 1200 s old." },
            { tex: "10{:}00{:}00 + 40\\,\\text{min} = 10{:}40{:}00", why: "It becomes stale at 10:40:00." },
            { text: "At 10:50:00 the copy is stale, so the browser sends <code>GET</code> with <code>If-None-Match: \"v7\"</code>.", why: "A stale copy with a validator is revalidated rather than refetched." },
            { text: "Unchanged → <b>304 Not Modified</b> with the same ETag and fresh Cache-Control; the browser reuses its stored body.", why: "RFC 9110 §15.4.5." },
            { text: "Body bytes = 0.", why: "A 304 response never contains a body." }
          ],
          answer: "(a) fresh until <b>10:40:00</b>; (b) conditional GET with If-None-Match \"v7\" → <b>304</b>; (c) <b>0</b> body bytes." },
        { type: "worked", title: "Bandwidth saved by revalidation", tag: "University-Midsem-style",
          problem: "<p>A 100 KB stylesheet is requested 20 times by a browser after its copy expires each time. It changes twice during that period. A 304 reply is 0.5 KB of headers. Compare the bytes transferred with and without conditional GETs, and give the saving in percent.</p>",
          steps: [
            { tex: "\\text{without} = 20 \\times 100 = 2000\\,\\text{KB}", why: "Every request downloads the full body." },
            { tex: "\\text{with} = 2 \\times 100 + 18 \\times 0.5 = 200 + 9 = 209\\,\\text{KB}", why: "2 changes → 2 full 200 replies; the other 18 are 304s." },
            { tex: "\\text{saving} = \\frac{2000 - 209}{2000} \\times 100 = 89.55\\%", why: "Fraction of bytes avoided." }
          ],
          answer: "2000 KB vs <b>209 KB</b>: a saving of about <b>89.6%</b> (the 18 round trips still cost latency)." },
        { type: "code", file: "Unit08_http_etag.py", level: "high", title: "http.server origin with ETag/Last-Modified answering 304, and an http.client browser cache that revalidates" },
        { type: "traps", items: [
            "<code>no-cache</code> does <b>not</b> mean \"do not cache\": it means \"revalidate before use\". <code>no-store</code> means do not cache.",
            "A 304 has no body; the client must already hold the content.",
            "<code>private</code> responses may still be cached by the browser.",
            "s-maxage is ignored by the browser (a private cache).",
            "The client sends If-None-Match; the server sends ETag. Do not swap request and response headers.",
            "Revalidation saves bandwidth, not the round trip."
          ] }
      ],
      practice: [
        { id: "u08-E-1", type: "num", tag: "University-Midsem-style", topic: "08.6",
          q: "<p>A proxy receives a response with <code>max-age=600</code> and <code>Age: 150</code>. For how many more <b>seconds</b> (integer) may it serve the response without revalidation?</p>",
          answer: 450, tol: 0, unit: "s", verify: "600-150",
          steps: [ { tex: "\\text{remaining} = \\text{max-age} - \\text{Age}", why: "The response is already 150 s old." }, { tex: "600 - 150 = 450\\,\\text{s}", why: "Subtract." } ] },
        { id: "u08-E-2", type: "mcq", tag: "GATE-style", topic: "08.6",
          q: "<p>A bank wants account pages never to be written to disk by any cache. Which directive?</p>",
          options: ["no-cache", "no-store", "private", "max-age=0"], answer: 1,
          why: ["no-cache still allows storing (with revalidation before use).", "Correct: no-store forbids storing the response anywhere.", "private still lets the browser store it.", "max-age=0 makes it immediately stale, but it may still be stored."],
          explain: "<p>no-store = never stored; no-cache = stored but always revalidated.</p>" },
        { id: "u08-E-3", type: "mcq", tag: "University-Midsem-style", topic: "08.6",
          q: "<p>A browser holds a stale copy with <code>ETag: \"x9\"</code>. Which request header does it send to revalidate?</p>",
          options: ["ETag: \"x9\"", "If-None-Match: \"x9\"", "If-Modified-Since: \"x9\"", "Cache-Control: max-age=\"x9\""], answer: 1,
          why: ["ETag is a response header.", "Correct: If-None-Match carries the cached entity tag.", "If-Modified-Since carries a date, paired with Last-Modified.", "max-age takes seconds, not a tag."],
          explain: "<p>ETag ↔ If-None-Match; Last-Modified ↔ If-Modified-Since.</p>" },
        { id: "u08-E-4", type: "msq", tag: "University-Midsem-style", topic: "08.6",
          q: "<p>A response carries <code>Cache-Control: private, max-age=300, s-maxage=3600</code>. Which statements are true? (Select all that apply.)</p>",
          options: ["The browser may cache it for 300 s", "A CDN may cache it for 3600 s", "Shared caches must not store it", "A 304 reply would include the full body"],
          answer: [0, 2],
          why: ["private allows the user's own cache; max-age=300 applies.", "private forbids shared caches, so s-maxage has no effect here.", "That is what private means.", "304 replies never include a body."],
          explain: "<p>private overrides any hope of shared caching; s-maxage only matters for shared caches that are allowed to store.</p>" },
        { id: "u08-E-5", type: "num", tag: "University-Midsem-style", topic: "08.6",
          q: "<p>A 50 KB image is revalidated 40 times; it changed 4 times. Each 304 is 0.25 KB. Total KB transferred for these 40 requests using conditional GETs? (KB, 1 decimal)</p>",
          answer: 209.0, tol: 0.05, unit: "KB", verify: "4*50 + 36*0.25",
          steps: [ { tex: "4 \\times 50 = 200\\,\\text{KB}", why: "Changed versions come back as 200 OK with the body." }, { tex: "36 \\times 0.25 = 9\\,\\text{KB}", why: "The other 36 replies are 304s." }, { tex: "200 + 9 = 209.0\\,\\text{KB}", why: "Add." } ] },
        { id: "u08-E-6", type: "text", tag: "University-Midsem-style", topic: "08.6",
          q: "<p>Predict the exact output.</p>",
          code: "cc = 'public, max-age=3600, s-maxage=600'\nd = {}\nfor part in cc.split(','):\n    k, _, v = part.strip().partition('=')\n    d[k] = int(v) if v else True\nage = 200\nprint(d['s-maxage'] - age, d['max-age'] - age)",
          answer: "400 3400", runCheck: true,
          explain: "<p>A shared cache uses s-maxage: 600 − 200 = 400 s left; a browser uses max-age: 3600 − 200 = 3400 s left.</p>" }
      ]
    },
    // ------------------------------------------------------------------ 08-F
    {
      id: "08-F",
      title: "Content Delivery Networks: Edge Servers, PoPs and Real-World CDNs",
      badge: "class",
      source: "WB-L07 p21–27, p29",
      covers: ["08.5"],
      blocks: [
        { type: "intuition", title: "A chain of grocery stores (WB-L07 p22)",
          html: "<p><b>Analogy (p22).</b> Instead of travelling to faraway farms, shoppers visit a local store that is stocked with food from those farms. A CDN does the same for web content: it <b>caches content closer to users</b>, so pages load faster. The client makes a fast (short-RTT) handshake with the nearby CDN server, which keeps a persistent, already-secured connection to the origin.</p>" +
                "<p><b>Definition (p23–24).</b> A <b>Content Delivery Network</b> is a set of geographically distributed servers that delivers content from the <b>nearest edge server</b>, reducing latency and saving bandwidth. A user requests content; the nearest edge server (Point of Presence, <b>PoP</b>) serves it instead of the origin; if the edge does not have it cached, it retrieves it from the origin and caches it for later users.</p>" },
        { type: "figure", caption: "WB-L07 p23: (1) Maria asks the CDN PoP; (2) on a miss the PoP asks the origin; (3) the origin returns the object, which the PoP caches; (4) the PoP replies to Maria. Other users near that PoP are now served from the cache.",
          html: "<svg viewBox='0 0 640 190' width='100%' font-family='sans-serif'><defs><marker id='m08f' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='currentColor'/></marker></defs>" +
                "<g fill='none' stroke-width='2'><rect x='10' y='40' width='100' height='40' rx='8' stroke='var(--accent)'/><rect x='10' y='120' width='100' height='40' rx='8' stroke='var(--muted)'/><rect x='250' y='70' width='140' height='50' rx='8' stroke='var(--ok)'/><rect x='520' y='70' width='110' height='50' rx='8' stroke='var(--warn)'/></g>" +
                "<g fill='currentColor' font-size='12' text-anchor='middle'><text x='60' y='65'>Maria</text><text x='60' y='145'>Other users</text><text x='320' y='92'>CDN edge (PoP)</text><text x='320' y='108' fill='var(--muted)' font-size='10'>cache</text><text x='575' y='100'>Origin</text></g>" +
                "<g stroke='currentColor' stroke-width='1.6'><line x1='110' y1='55' x2='248' y2='80' marker-end='url(#m08f)'/><line x1='248' y1='92' x2='112' y2='70' marker-end='url(#m08f)'/><line x1='110' y1='140' x2='248' y2='112' marker-end='url(#m08f)' marker-start='url(#m08f)'/>" +
                "<line x1='390' y1='85' x2='518' y2='85' marker-end='url(#m08f)'/><line x1='518' y1='105' x2='392' y2='105' marker-end='url(#m08f)'/></g>" +
                "<g fill='var(--accent)' font-size='12' font-weight='bold'><text x='170' y='55'>1</text><text x='170' y='95'>4</text><text x='450' y='78'>2</text><text x='450' y='122'>3</text></g>" +
                "<text x='455' y='150' text-anchor='middle' fill='var(--muted)' font-size='11'>steps 2–3 happen only on a miss</text>" +
                "</svg>" },
        { type: "table", head: ["CDN", "Fact from the slides (p21, p25–26)"],
          rows: [
            ["Akamai", "pioneered the space in <b>1998</b>; CDNs emerged in the late 1990s to solve web congestion and latency"],
            ["Cloudflare", "major player; CDN plus security services"],
            ["Amazon CloudFront", "AWS's CDN (see section 08-G)"],
            ["Netflix Open Connect", "Open Connect Appliances (OCAs) placed <b>inside ISP sites</b> (points of presence) hold up to <b>350 TB</b> each; Netflix servers at an IX site connect to the ISP by settlement-free interconnection (SFI)"],
            ["Google Cloud CDN, Microsoft Azure CDN, Fastly", "other major players; the CDNPlanet tool shows which CDN a site uses"]
          ],
          caption: "CDN players. Use cases (p26): websites, video streaming, software downloads, gaming, mobile apps." },
        { type: "callout", kind: "takeaway", title: "Benefits of a CDN (WB-L07 p27)",
          html: "<ol><li><b>Reduced latency</b>: content comes from a nearby edge.</li><li><b>Scalability</b>: load spreads over many edge servers.</li><li><b>Enhanced security</b>: the edge absorbs attacks (for example DDoS) and terminates TLS.</li><li><b>Bandwidth cost reduction</b>: the origin sends each object once per edge instead of once per user.</li><li><b>Resilience and uptime</b>: other edges keep serving if one fails.</li></ol>" },
        { type: "callout", kind: "warning", title: "Fastly outage, June 2021 (WB-L07 p29)",
          html: "<p>A misconfiguration in Fastly's network triggered a widespread outage that took down Reddit, Amazon and The New York Times; users saw errors and slow loads. Lesson: a CDN becomes critical infrastructure; when it fails, every site behind it fails together.</p>" },
        { type: "derivation", title: "Offload and average latency with a CDN",
          steps: [
            { tex: "\\text{offload} = \\frac{N_{edge\\,hits}}{N_{total}} = h", why: "Fraction of requests the edge serves without contacting the origin." },
            { tex: "N_{origin} = (1 - h)\\,N_{total}", why: "Only misses reach the origin." },
            { tex: "\\bar{T} = RTT_{u,e} + (1-h)\\,RTT_{e,o}", why: "Every request pays the user–edge round trip; misses also pay the edge–origin round trip." },
            { tex: "\\text{byte offload} = \\frac{\\text{bytes served from edge}}{\\text{total bytes}}", why: "Large objects (video) can make byte offload differ from request offload." }
          ] },
        { type: "cheat", items: [
            "CDN = geographically distributed edge servers; serve from the nearest edge; fetch from origin on a miss and cache",
            "Akamai 1998; Netflix OCA up to 350 TB inside ISPs",
            "Benefits: latency, scalability, security, bandwidth cost, resilience",
            "Offload = $h$; origin requests = $(1-h)N$; $\\bar{T} = RTT_{ue} + (1-h)RTT_{eo}$",
            "Fastly June 2021: one CDN misconfiguration, many sites down"
          ] },
        { type: "worked", title: "CDN offload and latency", tag: "University-Midsem-style",
          problem: "<p>A site receives 1,000,000 requests a day. The CDN serves 920,000 of them from edge caches. RTT user ↔ edge = 10 ms, edge ↔ origin = 150 ms; without a CDN, users reach the origin with an RTT of 160 ms. (a) Offload percentage? (b) Requests reaching the origin? (c) Average RTT cost per request with and without the CDN?</p>",
          steps: [
            { tex: "h = \\frac{920000}{1000000} = 0.92 = 92\\%", why: "Edge hits over total requests." },
            { tex: "N_{origin} = (1 - 0.92) \\times 1000000 = 80000", why: "Only misses reach the origin." },
            { tex: "\\bar{T}_{CDN} = 10 + 0.08 \\times 150 = 10 + 12 = 22\\,\\text{ms}", why: "Every request pays 10 ms; 8% also pay 150 ms." },
            { tex: "\\bar{T}_{direct} = 160\\,\\text{ms}", why: "Every request crosses the long path." }
          ],
          answer: "(a) <b>92%</b>; (b) <b>80,000</b>; (c) <b>22 ms</b> with the CDN vs <b>160 ms</b> without." },
        { type: "traps", items: [
            "The first request for an object at an edge is a <b>miss</b>: the CDN helps from the second user onward (in a pull CDN).",
            "A CDN edge is a shared, reverse-proxy cache in front of the origin, not a browser cache.",
            "Offload by requests ≠ offload by bytes.",
            "Netflix's OCAs sit inside ISP networks, not only in Netflix data centres."
          ] }
      ],
      practice: [
        { id: "u08-F-1", type: "mcq", tag: "University-Midsem-style", topic: "08.5",
          q: "<p>In a CDN, what happens when a user requests an object that the nearest edge server does not have?</p>",
          options: ["The user is told to retry later", "The edge fetches it from the origin, caches it, and serves the user", "The user is redirected to the origin permanently", "The edge asks the user's browser cache"], answer: 1,
          why: ["The CDN handles the miss itself.", "Correct (WB-L07 p23).", "The edge stays in the path and caches for later users.", "The browser cache was already checked before the request was sent."],
          explain: "<p>Miss at the edge → origin fetch → cache → reply.</p>" },
        { id: "u08-F-2", type: "num", tag: "University-Midsem-style", topic: "08.5",
          q: "<p>A CDN serves 4,750,000 of 5,000,000 daily requests from its edges. What percentage of requests is offloaded from the origin? (in %, integer)</p>",
          answer: 95, tol: 0, unit: "%", verify: "4750000/5000000*100",
          steps: [ { tex: "\\frac{4750000}{5000000} = 0.95", why: "Edge hits over total." }, { tex: "0.95 \\times 100 = 95\\%", why: "Convert to percent." } ] },
        { id: "u08-F-3", type: "num", tag: "GATE-style", topic: "08.5",
          q: "<p>RTT user ↔ edge = 12 ms, edge ↔ origin = 120 ms, edge hit ratio 0.85. Average RTT cost per request in <b>ms</b> (integer)?</p>",
          answer: 30, tol: 0, unit: "ms", verify: "12 + 0.15*120",
          formula: "\\bar{T} = RTT_{ue} + (1-h)RTT_{eo}",
          steps: [ { tex: "(1 - 0.85) \\times 120 = 18", why: "Expected extra cost from misses." }, { tex: "12 + 18 = 30\\,\\text{ms}", why: "Add the user–edge RTT." } ] },
        { id: "u08-F-4", type: "msq", tag: "University-Midsem-style", topic: "08.5",
          q: "<p>Which are benefits of a CDN listed on WB-L07 p27? (Select all that apply.)</p>",
          options: ["Reduced latency", "Bandwidth cost reduction", "Guaranteed zero outages", "Resilience and uptime improvement"], answer: [0, 1, 3],
          why: ["Edges are near users.", "The origin sends each object far fewer times.", "The Fastly 2021 outage (p29) shows CDNs can fail.", "Many edges give redundancy."],
          explain: "<p>The five benefits: latency, scalability, security, bandwidth cost, resilience/uptime.</p>" },
        { id: "u08-F-5", type: "mcq", tag: "University-Midsem-style", topic: "08.5",
          q: "<p>Where are Netflix Open Connect Appliances (up to 350 TB each) placed, according to WB-L07 p21?</p>",
          options: ["Only in AWS Regions", "At ISP sites (points of presence), close to subscribers", "In users' homes", "Only at Netflix headquarters"], answer: 1,
          why: ["Netflix's control plane runs on AWS, but OCAs are deployed in ISPs.", "Correct: the ISP site box holds the OCA that serves nearby homes.", "Homes only receive the stream.", "Centralising would defeat the purpose of a CDN."],
          explain: "<p>Putting storage inside ISPs keeps video traffic off long-haul links.</p>" },
        { id: "u08-F-6", type: "mcq", tag: "University-Midsem-style", topic: "08.5",
          q: "<p>Which company is credited on WB-L07 p25 with pioneering CDNs in 1998?</p>",
          options: ["Cloudflare", "Akamai", "Fastly", "Amazon CloudFront"], answer: 1,
          why: ["Cloudflare came later (2009–2010).", "Correct.", "Fastly was founded in 2011.", "CloudFront launched in 2008."],
          explain: "<p>Akamai, 1998, born from the late-1990s web congestion problem.</p>" }
      ]
    },
    // ------------------------------------------------------------------ 08-G
    {
      id: "08-G",
      title: "CDN Internals: Pull vs Push, DNS Steering, Anycast and Amazon CloudFront",
      badge: "researched",
      source: "Kurose & Ross 8e §2.6.3; Amazon CloudFront Developer Guide (how CloudFront delivers content, cache expiration, invalidation) and CloudFront pricing",
      covers: ["08.6"],
      blocks: [
        { type: "intuition", title: "Stocking the shelves, and sending you to the right store",
          html: "<p><b>Two questions every CDN answers.</b> (1) <i>How does content get to the edge?</i> Either the edge fetches it the first time someone asks (<b>pull</b>) or the publisher uploads it in advance (<b>push</b>). (2) <i>How does the user reach a nearby edge?</i> Usually through <b>DNS</b>: the site's name is a CNAME into the CDN's own DNS, which answers with the IP of an edge near the asking resolver. Some CDNs instead use <b>anycast</b>: the same IP address is announced from every PoP, and Internet (BGP) routing delivers each packet to the nearest one.</p>" +
                "<p><b>Kurose §2.6.3</b> calls the two placement philosophies <i>enter deep</i> (many small clusters inside access ISPs, like Akamai and Netflix OCAs) and <i>bring home</i> (fewer large clusters at IXPs).</p>" },
        { type: "table", head: ["", "Pull CDN (origin pull)", "Push CDN"],
          rows: [
            ["How content arrives", "edge fetches from the origin on the first miss, then caches it for its TTL", "publisher uploads files to the CDN storage ahead of time"],
            ["First request", "slow (miss: extra edge → origin trip)", "fast (already at the edge)"],
            ["Setup", "just point the CDN at the origin; automatic", "publisher manages uploads and updates"],
            ["Best for", "many objects, frequently requested, changing content (websites, APIs)", "large, rarely changing files (software releases, video libraries)"],
            ["Update model", "TTL expiry or invalidation", "re-upload / replace the object"],
            ["CloudFront", "the normal mode (origin = S3 bucket, ALB, EC2 or any HTTP server)", "closest equivalent: upload to the S3 origin before announcing the URL"]
          ],
          caption: "Pull vs push CDNs." },
        { type: "table", head: ["Step", "What happens (Kurose's NetCinema / KingCDN example)"],
          rows: [
            ["1", "The user's browser wants <code>http://video.netcinema.com/6Y7B23V</code> and asks its local DNS server (LDNS) for video.netcinema.com."],
            ["2", "The LDNS asks NetCinema's authoritative DNS server."],
            ["3", "Instead of an IP address, NetCinema's server returns a <b>CNAME</b> into the CDN's domain, <code>a1105.kingcdn.com</code>; the query is handed over to KingCDN."],
            ["4", "The LDNS asks KingCDN's authoritative DNS, which picks an edge server near the <b>LDNS's</b> IP address (its cluster-selection strategy) and returns that edge's IP."],
            ["5", "The LDNS returns the edge IP to the browser."],
            ["6", "The browser opens TCP to that edge server and sends the HTTP GET; the edge serves the video (fetching it from the origin first if it misses)."]
          ],
          caption: "DNS-based steering to a nearby edge (Kurose & Ross §2.6.3). The CDN sees the resolver's address, not the user's, so a user far from their resolver may be steered poorly." },
        { type: "figure", caption: "Amazon CloudFront request path (AWS docs): viewers reach an edge location; on a miss the edge asks a regional edge cache; only if that also misses does the request reach the origin.",
          html: "<svg viewBox='0 0 660 120' width='100%' font-family='sans-serif'><defs><marker id='m08g' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='currentColor'/></marker></defs>" +
                "<g fill='none' stroke-width='2'><rect x='5' y='35' width='100' height='44' rx='8' stroke='var(--accent)'/><rect x='170' y='35' width='130' height='44' rx='8' stroke='var(--ok)'/><rect x='360' y='35' width='140' height='44' rx='8' stroke='var(--ok)'/><rect x='555' y='35' width='100' height='44' rx='8' stroke='var(--warn)'/></g>" +
                "<g fill='currentColor' font-size='12' text-anchor='middle'><text x='55' y='62'>Viewer</text><text x='235' y='55'>Edge location</text><text x='235' y='71' fill='var(--muted)' font-size='10'>(many, near users)</text><text x='430' y='55'>Regional edge cache</text><text x='430' y='71' fill='var(--muted)' font-size='10'>(fewer, larger)</text><text x='605' y='55'>Origin</text><text x='605' y='71' fill='var(--muted)' font-size='10'>S3 / ALB / EC2</text></g>" +
                "<g stroke='currentColor' stroke-width='1.6'><line x1='105' y1='57' x2='168' y2='57' marker-end='url(#m08g)' marker-start='url(#m08g)'/><line x1='300' y1='57' x2='358' y2='57' marker-end='url(#m08g)' marker-start='url(#m08g)' stroke-dasharray='5 4'/><line x1='500' y1='57' x2='553' y2='57' marker-end='url(#m08g)' marker-start='url(#m08g)' stroke-dasharray='5 4'/></g>" +
                "<g font-size='10' text-anchor='middle' fill='var(--muted)'><text x='136' y='100'>DNS: dxxxx.cloudfront.net</text><text x='330' y='100'>on miss</text><text x='527' y='100'>on miss</text></g>" +
                "</svg>" },
        { type: "table", head: ["CloudFront term", "Meaning (AWS docs)"],
          rows: [
            ["Distribution", "the CDN configuration, reached at a domain such as d111111abcdef8.cloudfront.net (map your own name to it with a Route 53 alias)"],
            ["Origin", "where the original content lives: an S3 bucket, an ALB, an EC2 instance, or any HTTP server"],
            ["Edge location / regional edge cache", "PoPs close to viewers; regional edge caches sit between edges and the origin to raise the hit ratio"],
            ["Cache behaviour", "per path pattern (for example /images/*): which origin, which TTLs, which headers/cookies/query strings form the cache key"],
            ["TTLs", "Minimum, Default and Maximum TTL; with legacy settings the defaults are <b>0 s</b>, <b>86,400 s (24 h)</b> and <b>31,536,000 s (1 year)</b>. Origin Cache-Control max-age/s-maxage is honoured within the min/max bounds; Default TTL applies when the origin sends none"],
            ["Invalidation", "removes objects from edge caches before they expire; paths may use a * wildcard; the first <b>1,000 paths per month</b> are free, then <b>USD 0.005 per path</b>; a wildcard path counts as one path"],
            ["Versioned file names", "for example app.v42.js: new URL = new cache key, so no invalidation is needed and old versions expire naturally"]
          ],
          caption: "Amazon CloudFront vocabulary." },
        { type: "derivation", title: "Invalidation cost and TTL choice",
          steps: [
            { tex: "\\text{cost} = \\max(0, P - 1000) \\times 0.005\\;\\text{USD}", why: "AWS pricing: 1,000 invalidation paths per month free, then USD 0.005 per path." },
            { tex: "P = 1500 \\Rightarrow (1500 - 1000) \\times 0.005 = 2.50\\;\\text{USD}", why: "Substitute 1,500 paths in a month." },
            { tex: "\\text{one path } /\\text{images}/{*} \\text{ counts as } 1", why: "A wildcard invalidates many objects for the price of one path." },
            { tex: "\\text{staleness}_{max} = \\min(\\max(\\text{max-age}, TTL_{min}), TTL_{max})", why: "Without an invalidation, an edge may serve an old object until its effective TTL (origin max-age clamped to the distribution's min/max) expires." }
          ] },
        { type: "cheat", items: [
            "Pull = fetch on first miss (default); push = upload in advance",
            "DNS steering: site CNAME → CDN's DNS → IP of an edge near the <b>resolver</b>",
            "Anycast: one IP announced from many PoPs; BGP delivers to the nearest",
            "CloudFront: viewer → edge location → regional edge cache → origin (S3/ALB/EC2)",
            "CloudFront legacy TTL defaults: min 0, default 86400, max 31536000 s",
            "Invalidation: 1,000 paths/month free, then USD 0.005 per path; wildcard = 1 path; prefer versioned names"
          ] },
        { type: "worked", title: "Fix a bad deploy on CloudFront", tag: "University-Midsem-style",
          problem: "<p>A team deployed a broken <code>/js/app.js</code>. The origin sends <code>Cache-Control: max-age=86400</code>; the distribution's min TTL is 0 and max TTL is 31,536,000. (a) Without action, how long might edges keep serving the broken file? (b) This month they have already invalidated 980 paths; they now invalidate <code>/js/*</code> and 39 individual image paths. What is the charge? (c) What deployment habit avoids this problem?</p>",
          steps: [
            { tex: "\\min(\\max(86400, 0), 31536000) = 86400\\,\\text{s} = 24\\,\\text{h}", why: "The origin's max-age lies inside the min/max bounds, so it is used." },
            { tex: "P = 980 + 1 + 39 = 1020", why: "The wildcard counts as one path." },
            { tex: "\\text{cost} = (1020 - 1000) \\times 0.005 = 0.10\\;\\text{USD}", why: "Only the 20 paths beyond the free 1,000 are charged." },
            { text: "Use versioned file names (app.v43.js) referenced from a short-TTL HTML page.", why: "A new name is a new cache key, so edges fetch it immediately; no invalidation needed." }
          ],
          answer: "(a) up to <b>24 h</b>; (b) <b>USD 0.10</b>; (c) versioned (content-hashed) file names." },
        { type: "traps", items: [
            "The CDN's DNS sees the <b>local resolver's</b> IP, not the user's, so steering is only as good as the resolver's location.",
            "Push CDNs are not \"faster in general\"; they only avoid the first-request miss.",
            "Anycast routes to the nearest PoP in BGP terms (fewest AS hops / policy), not necessarily the lowest latency.",
            "An invalidation is not free beyond 1,000 paths per month, and it takes effect across all edges only after it completes.",
            "CloudFront's Default TTL applies only when the origin sends no caching headers."
          ] }
      ],
      practice: [
        { id: "u08-G-1", type: "mcq", tag: "University-Midsem-style", topic: "08.6",
          q: "<p>A game studio publishes a 40 GB patch once a month and expects millions of downloads within the first hour. Which CDN model avoids slow first requests at every edge?</p>",
          options: ["Pull CDN with a short TTL", "Push CDN: upload the patch to the CDN before release", "No CDN; serve from the origin", "DNS round robin across two origin servers"], answer: 1,
          why: ["Every edge would miss on its first request and hit the origin at the same moment.", "Correct: pre-positioning large, rarely changing files is the push model's strength.", "The origin would be overwhelmed.", "Two origins cannot absorb millions of global downloads."],
          explain: "<p>Large, predictable, rarely changing content → push.</p>" },
        { id: "u08-G-2", type: "mcq", tag: "GATE-style", topic: "08.6",
          q: "<p>In DNS-based CDN steering (Kurose §2.6.3), whose IP address does the CDN's authoritative DNS server use to choose a nearby edge?</p>",
          options: ["The end user's IP address", "The local DNS server's (resolver's) IP address", "The origin server's IP address", "The TLD server's IP address"], answer: 1,
          why: ["The user never talks to the CDN's DNS directly.", "Correct: the query arrives from the user's LDNS, so the CDN only sees its address.", "The origin is not involved in DNS steering.", "TLD servers only refer the resolver onward."],
          explain: "<p>That is why a user using a far-away public resolver can be sent to a far-away edge.</p>" },
        { id: "u08-G-3", type: "mcq", tag: "University-Midsem-style", topic: "08.6",
          q: "<p>How does <code>video.netcinema.com</code> hand its DNS resolution over to the CDN KingCDN?</p>",
          options: ["Its authoritative server returns an A record of the origin", "Its authoritative server returns a CNAME such as a1105.kingcdn.com", "The browser contacts KingCDN directly by IP", "The root server redirects to KingCDN"], answer: 1,
          why: ["Returning the origin IP would bypass the CDN.", "Correct: the CNAME puts the CDN's own DNS in charge of the answer.", "The browser only knows names until DNS answers.", "Root servers know nothing about CDNs."],
          explain: "<p>Site CNAME → CDN domain → CDN DNS picks the edge.</p>" },
        { id: "u08-G-4", type: "num", tag: "University-Midsem-style", topic: "08.6",
          q: "<p>A team submits 2,600 CloudFront invalidation paths in one month (no wildcards). Charge in <b>USD</b>, 2 decimals?</p>",
          answer: 8.0, tol: 0.001, unit: "USD", verify: "(2600-1000)*0.005",
          formula: "\\text{cost} = (P - 1000) \\times 0.005",
          steps: [ { tex: "2600 - 1000 = 1600", why: "The first 1,000 paths each month are free." }, { tex: "1600 \\times 0.005 = 8.00\\;\\text{USD}", why: "USD 0.005 per additional path." } ] },
        { id: "u08-G-5", type: "msq", tag: "University-Midsem-style", topic: "08.6",
          q: "<p>Which statements about Amazon CloudFront are true? (Select all that apply.)</p>",
          options: ["An S3 bucket or an ALB can be an origin", "Regional edge caches sit between edge locations and the origin", "With legacy cache settings the Default TTL is 86,400 s", "Every object must be invalidated manually before it can expire"], answer: [0, 1, 2],
          why: ["Both are standard origin types.", "They raise the hit ratio for objects not popular enough to stay at every edge.", "24 hours.", "Objects expire on their own when their TTL runs out."],
          explain: "<p>Invalidation is optional, for removing content early.</p>" },
        { id: "u08-G-6", type: "mcq", tag: "University-Midsem-style", topic: "08.6",
          q: "<p>Some CDNs announce the same IP address from all their PoPs. What is this technique called, and what delivers a user's packets to a nearby PoP?</p>",
          options: ["Multicast; the switch floods to all PoPs", "Anycast; ordinary BGP routing picks the nearest announcement", "Unicast; DNS rewrites the IP header", "Broadcast; every PoP answers and the client keeps the first reply"], answer: 1,
          why: ["Multicast delivers to every group member, not the nearest one.", "Correct.", "DNS never rewrites IP headers.", "Broadcast does not cross routers and is not used this way."],
          explain: "<p>Anycast = one address, many locations, nearest by routing.</p>" }
      ]
    }
  ]
};
