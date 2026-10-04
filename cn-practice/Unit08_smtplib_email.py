#!/usr/bin/env python3
"""Unit 08 - Sending mail with smtplib and building it with email.message (high level).

Topic : email.message.EmailMessage builds RFC 5322 headers and a MIME multipart body
        (text + base64 attachment); smtplib.SMTP speaks EHLO / MAIL FROM / RCPT TO / DATA /
        QUIT for you. The receiver is the FakeSMTPServer from Unit08_smtp_raw.py on 127.0.0.1.
COVERAGE ids : 08.1, 08.6
Run   : python3 Unit08_smtplib_email.py   (keep Unit08_smtp_raw.py in the same folder)
Real-world equivalents: submission to smtp.example.com:587 with starttls(), or port 465 with
smtplib.SMTP_SSL. This demo never leaves the machine.
"""
import base64
import math
import smtplib
from email import policy
from email.message import EmailMessage
from email.parser import BytesParser

from Unit08_smtp_raw import FakeSMTPServer


def build_message():
    msg = EmailMessage()
    msg["From"] = "Alice <alice@cn-midsem.test>"
    msg["To"] = "bob@cn-midsem.test, carol@cn-midsem.test"
    msg["Cc"] = "dave@cn-midsem.test"
    msg["Subject"] = "Unit 08 notes"
    msg.set_content("SMTP pushes, IMAP and POP3 pull.\n.This line starts with a dot.\n")
    attachment = bytes(range(256)) * 12                    # 3072 bytes of binary data
    msg.add_attachment(attachment, maintype="application", subtype="octet-stream", filename="ports.bin")
    return msg, attachment


def main():
    msg, attachment = build_message()
    print("== MIME structure ==")
    for part in msg.walk():
        print("   ", part.get_content_type(), part.get_filename() or "")
    assert msg.get_content_type() == "multipart/mixed"
    # base64 turns every 3 bytes into 4 characters: 3072 B -> 4096 characters (before line breaks)
    encoded_len = len(base64.b64encode(attachment))
    assert encoded_len == 4 * math.ceil(len(attachment) / 3) == 4096

    server = FakeSMTPServer().start()
    try:
        with smtplib.SMTP(*server.address, timeout=5) as smtp:
            code, banner = smtp.ehlo("client.cn-midsem.test")
            assert code == 250 and smtp.has_extn("size")
            refused = smtp.send_message(msg)               # envelope recipients = To + Cc
            assert refused == {}
        print("\n== SMTP dialogue seen by the server ==")
        for line in server.transcript:
            print("   " + line)
        delivered = server.mailbox[0]
        assert delivered["from"] == "<alice@cn-midsem.test>"
        assert delivered["to"] == ["<bob@cn-midsem.test>", "<carol@cn-midsem.test>", "<dave@cn-midsem.test>"]
        codes = [int(l[3:6]) for l in server.transcript if l.startswith("S: ") and l[6] == " "]
        print("\n   final reply codes:", codes)
        assert codes[0] == 220 and 354 in codes and codes[-1] == 221

        # parse what arrived and check the attachment survived the trip
        parsed = BytesParser(policy=policy.default).parsebytes(delivered["data"].encode())
        att = next(p for p in parsed.iter_attachments())
        assert parsed["Subject"] == "Unit 08 notes"
        assert att.get_content() == attachment and att.get_filename() == "ports.bin"
        body = parsed.get_body(preferencelist=("plain",)).get_content()
        assert ".This line starts with a dot." in body       # dot-stuffing was applied and undone
        print("   Subject:", parsed["Subject"], "| attachment bytes:", len(att.get_content()))
    finally:
        server.stop()
    print("\nAll smtplib / email.message self-tests passed.")


if __name__ == "__main__":
    main()
