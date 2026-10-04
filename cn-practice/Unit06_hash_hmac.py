#!/usr/bin/env python3
"""Unit 06 - Integrity with hashlib and hmac (the "I" in the CIA goals).

COVERAGE rows: 06.2 (confidentiality / integrity / authentication), 06.5 (tampering),
06.7 (Finished messages are MACs over the handshake transcript).

Level: HIGH - hashlib and hmac from the standard library.

  1. Known-answer tests: SHA-256("abc") (FIPS 180-2) and HMAC-SHA256 RFC 4231 test case 2.
  2. Digest sizes: MD5 128 bits, SHA-1 160, SHA-256 256, SHA-512 512.
  3. Avalanche effect: "bus stop" vs "park" (the WB-L08 p100 Mallory message) flips about
     half of the 256 output bits.
  4. Tampering (WB-L08 p102: "r":"3" changed to "r":"1"):
       - a plain hash does NOT protect: Mallory edits the JSON and simply recomputes the hash;
       - an HMAC does: without the shared key Mallory cannot produce a matching tag.
  5. hmac.compare_digest for constant-time comparison.

Run:  python3 Unit06_hash_hmac.py
"""
import hashlib
import hmac
import json

print("== 1. Known-answer tests ==")
h = hashlib.sha256(b"abc").hexdigest()
print("  SHA-256('abc')        =", h)
assert h == "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
tag = hmac.new(b"Jefe", b"what do ya want for nothing?", hashlib.sha256).hexdigest()
print("  HMAC-SHA256(Jefe, ..) =", tag)
assert tag == "5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843"

print("\n== 2. Digest sizes ==")
for name, bits in (("md5", 128), ("sha1", 160), ("sha256", 256), ("sha512", 512)):
    d = hashlib.new(name, b"x").digest()
    print("  %-7s %3d bytes = %3d bits = %3d hex characters" % (name, len(d), len(d) * 8, len(d) * 2))
    assert len(d) * 8 == bits

print("\n== 3. Avalanche effect ==")
m1 = b"Meet me at the bus stop!"
m2 = b"Meet me at the park!"
d1 = int.from_bytes(hashlib.sha256(m1).digest(), "big")
d2 = int.from_bytes(hashlib.sha256(m2).digest(), "big")
flipped = bin(d1 ^ d2).count("1")
print("  bits that differ between the two SHA-256 digests: %d of 256 (%.0f%%)" % (flipped, flipped / 2.56))
assert 80 < flipped < 176      # roughly half; a tiny edit changes the digest completely
one_char = bin(int.from_bytes(hashlib.sha256(b"r=3").digest(), "big") ^
               int.from_bytes(hashlib.sha256(b"r=1").digest(), "big")).count("1")
print("  one character changed ('r=3' vs 'r=1'): %d bits differ" % one_char)

print("\n== 4. Tampering: hash vs HMAC ==")
key = b"session-key-from-the-TLS-handshake"
original = json.dumps({"user": "raj", "r": "3"}).encode()
sent_hash = hashlib.sha256(original).hexdigest()
sent_tag = hmac.new(key, original, hashlib.sha256).hexdigest()

tampered = original.replace(b'"r": "3"', b'"r": "1"')        # Mallory makes herself admin
assert tampered != original
mallory_hash = hashlib.sha256(tampered).hexdigest()         # anyone can recompute a plain hash
receiver_ok_hash = hashlib.sha256(tampered).hexdigest() == mallory_hash
print("  plain SHA-256 : Mallory sends the new hash too -> receiver check passes:", receiver_ok_hash)
assert receiver_ok_hash                                     # so a bare hash gives NO integrity vs an attacker

mallory_guess = hmac.new(b"mallory-does-not-know-the-key", tampered, hashlib.sha256).hexdigest()
receiver_expected = hmac.new(key, tampered, hashlib.sha256).hexdigest()
ok = hmac.compare_digest(mallory_guess, receiver_expected)
print("  HMAC-SHA256   : Mallory cannot compute the tag   -> receiver check passes:", ok)
assert not ok
assert hmac.compare_digest(sent_tag, hmac.new(key, original, hashlib.sha256).hexdigest())
print("  untouched message with the real tag verifies     -> True")

print("\n== 5. TLS-style Finished value: a MAC over the whole handshake transcript ==")
transcript = b"ClientHello|ServerHello|Certificate|ClientKeyExchange"
finished = hmac.new(key, hashlib.sha256(transcript).digest(), hashlib.sha256).hexdigest()[:24]
altered = hmac.new(key, hashlib.sha256(transcript.replace(b"ServerHello", b"ServerHellX")).digest(),
                   hashlib.sha256).hexdigest()[:24]
print("  Finished(real transcript)    =", finished)
print("  Finished(altered transcript) =", altered, "-> mismatch, handshake aborted")
assert finished != altered

print("\nAll Unit06 hash/HMAC assertions passed.")
