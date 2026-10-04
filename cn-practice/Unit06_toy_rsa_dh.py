#!/usr/bin/env python3
"""Unit 06 - Toy RSA, a toy signature, and a toy Diffie-Hellman exchange (with a MITM), from scratch.

COVERAGE rows: 06.3 (asymmetric encryption), 06.5 (MITM key substitution),
06.6 (signatures behind certificates), 06.7 (key exchange inside the TLS handshake).

Level: LOW - no crypto library. Modular exponentiation is done by square-and-multiply
and the private exponent by the extended Euclidean algorithm, printing every step.

Toy RSA (numbers far too small to be secure, chosen so you can do them by hand):
  p = 61, q = 53  ->  n = 3233, phi = 60 * 52 = 3120, e = 17  ->  d = 2753
  encrypt m = 65  ->  c = 65^17 mod 3233 = 2790 ; decrypt 2790^2753 mod 3233 = 65

Toy Diffie-Hellman: p = 23, g = 5, Alice a = 6, Bob b = 15
  A = 5^6 mod 23 = 8, B = 5^15 mod 23 = 19, shared secret = 19^6 mod 23 = 8^15 mod 23 = 2

Run:  python3 Unit06_toy_rsa_dh.py
"""
import hashlib


def egcd_inverse(e, phi, verbose=False):
    """Return d with (e*d) mod phi == 1, printing the Euclid table."""
    r0, r1 = phi, e
    s0, s1 = 0, 1                          # coefficients of e
    while r1:
        q = r0 // r1
        if verbose:
            print("    %5d = %4d * %3d + %d" % (r0, q, r1, r0 - q * r1))
        r0, r1 = r1, r0 - q * r1
        s0, s1 = s1, s0 - q * s1
    if r0 != 1:
        raise ValueError("e and phi are not coprime")
    return s0 % phi


def modpow(base, exp, mod, verbose=False):
    """Square-and-multiply, scanning the exponent bits from least significant upward."""
    result, square = 1, base % mod
    bit = 0
    while exp:
        if exp & 1:
            result = result * square % mod
            if verbose:
                print("    bit %d is 1: result = result * %d^(2^%d) mod %d = %d" % (bit, base, bit, mod, result))
        exp >>= 1
        if exp:
            square = square * square % mod
            if verbose:
                print("    %d^(2^%d) mod %d = %d" % (base, bit + 1, mod, square))
        bit += 1
    return result


def toy_rsa():
    print("== 1. Toy RSA key generation ==")
    p, q, e = 61, 53, 17
    n = p * q
    phi = (p - 1) * (q - 1)
    print("  n = 61 * 53 = %d,  phi = 60 * 52 = %d,  e = %d" % (n, phi, e))
    print("  extended Euclid for 17^-1 mod 3120:")
    d = egcd_inverse(e, phi, verbose=True)
    print("  d = %d   check: 17 * %d = %d = %d * 3120 + %d" % (d, d, e * d, e * d // phi, e * d % phi))
    assert (n, phi, d) == (3233, 3120, 2753) and e * d % phi == 1

    print("\n== 2. Encrypt m = 65 with the PUBLIC key (e, n) ==")
    c = modpow(65, e, n, verbose=True)
    print("  c =", c)
    assert c == 2790 == pow(65, 17, 3233)

    print("\n== 3. Decrypt with the PRIVATE key (d, n) ==")
    m = modpow(c, d, n)
    print("  2790^2753 mod 3233 =", m)
    assert m == 65

    print("\n== 4. Toy signature: sign a hash with d, anyone verifies with e ==")
    msg = b"*.canva.com public key belongs to Canva"
    h = int.from_bytes(hashlib.sha256(msg).digest(), "big") % n      # shrink the hash to fit n
    sig = modpow(h, d, n)                                              # only the key owner can do this
    ok = modpow(sig, e, n) == h
    forged = modpow((sig + 1) % n, e, n) == h
    print("  hash mod n = %d, signature = %d, verify(sig) = %s, verify(sig+1) = %s" % (h, sig, ok, forged))
    assert ok and not forged
    return n, e, d


def toy_dh():
    print("\n== 5. Toy Diffie-Hellman (p = 23, g = 5) ==")
    p, g, a, b = 23, 5, 6, 15
    A = modpow(g, a, p)            # Alice sends A in the clear
    B = modpow(g, b, p)            # Bob sends B in the clear
    s_alice = modpow(B, a, p)
    s_bob = modpow(A, b, p)
    print("  A = 5^6 mod 23 = %d,  B = 5^15 mod 23 = %d" % (A, B))
    print("  Alice: B^a = 19^6 mod 23 = %d   Bob: A^b = 8^15 mod 23 = %d" % (s_alice, s_bob))
    assert (A, B, s_alice, s_bob) == (8, 19, 2, 2)

    print("\n== 6. Unauthenticated DH -> Mallory in the middle (key substitution) ==")
    m = 3                                   # Mallory's secret exponent
    M = modpow(g, m, p)                     # she sends M to both sides instead of A and B
    k_alice_mallory = modpow(M, a, p)       # what Alice believes she shares with Bob
    k_mallory_alice = modpow(A, m, p)
    k_bob_mallory = modpow(M, b, p)         # what Bob believes he shares with Alice
    k_mallory_bob = modpow(B, m, p)
    print("  Mallory sends M = 5^3 mod 23 = %d to both" % M)
    print("  Alice<->Mallory key = %d (both sides %d)" % (k_alice_mallory, k_mallory_alice))
    print("  Mallory<->Bob   key = %d (both sides %d)" % (k_bob_mallory, k_mallory_bob))
    assert k_alice_mallory == k_mallory_alice and k_bob_mallory == k_mallory_bob
    assert k_alice_mallory != k_bob_mallory   # two different tunnels: Mallory decrypts, reads, re-encrypts
    print("  Fix used by TLS: the server SIGNS its key share; the client checks the signature with")
    print("  the public key inside a CA-signed certificate, so Mallory cannot substitute M.")


if __name__ == "__main__":
    toy_rsa()
    toy_dh()
    print("\nAll Unit06 toy RSA / DH assertions passed.")
