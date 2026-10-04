#!/usr/bin/env python3
"""Unit 06 - Caesar cipher, brute force, and the key-count problem, from scratch.

COVERAGE rows: 06.2 (cipher pipeline), 06.3 (key counts n(n-1)/2 vs 2n), 06.4 (Caesar).

Level: LOW - letters are turned into numbers 0..25 by hand (ord arithmetic), shifted
mod 26 and turned back. No crypto library.

  E_k(x) = (x + k) mod 26        D_k(y) = (y - k) mod 26        (A=0, B=1, ..., Z=25)

Checks (all asserted):
  * WB-L08 p97: shift 3 of "Raj never catches the train..." gives "Udm qhyhu fdwfkhv..."
  * WB-L06 p9 (slide fix B22): "Hello" with a consistent shift of 2 is "Jgnnq", not "jknnq"
  * WB-L08 p98 challenge: "Gztkliv rsyz srrbz yrz dviv ufjk" was made with shift 17 and
    decodes to "picture abhi baaki hai mere dost" (found by trying all 25 shifts)
  * key counts: n users need n(n-1)/2 symmetric keys but only 2n asymmetric keys

Run:  python3 Unit06_caesar.py
"""


def shift_char(ch, k):
    if "a" <= ch <= "z":
        return chr((ord(ch) - ord("a") + k) % 26 + ord("a"))
    if "A" <= ch <= "Z":
        return chr((ord(ch) - ord("A") + k) % 26 + ord("A"))
    return ch                      # spaces and punctuation pass through unchanged


def caesar(text, k):
    return "".join(shift_char(c, k) for c in text)


# Very small "is this English or Hinglish?" score: count common short words.
COMMON = {"the", "a", "is", "hai", "and", "to", "of", "mere", "abhi", "me", "at", "be"}


def score(text):
    return sum(1 for w in text.lower().split() if w.strip(".,!?") in COMMON)


def brute_force(cipher):
    """Try every key 1..25; return (best_key, plaintext) by the word score."""
    best = (-1, 0, "")
    for k in range(1, 26):
        guess = caesar(cipher, -k)
        s = score(guess)
        print("  k=%2d  %s%s" % (k, guess, "   <-- readable" if s >= 2 else ""))
        if s > best[0]:
            best = (s, k, guess)
    return best[1], best[2]


def main():
    print("== 1. Shift 3 (WB-L08 p97) ==")
    p = "Raj never catches the train. Raj should have exercised a bit more. Simran was sad!"
    c = caesar(p, 3)
    print("  plain :", p)
    print("  cipher:", c)
    assert c == "Udm qhyhu fdwfkhv wkh wudlq. Udm vkrxog kdyh hahuflvhg d elw pruh. Vlpudq zdv vdg!"
    assert caesar(c, -3) == p

    print("\n== 2. Slide fix B22: 'Hello' with shift 2 ==")
    for ch in "Hello":
        print("  %s (%2d) + 2 = %2d -> %s" % (ch, ord(ch.lower()) - 97, (ord(ch.lower()) - 97 + 2) % 26, shift_char(ch, 2)))
    assert caesar("Hello", 2) == "Jgnnq"
    # the slide's 'jknnq' would need e -> k, a shift of 6, while l -> n is a shift of 2
    assert (ord("k") - ord("e")) % 26 == 6 and (ord("n") - ord("l")) % 26 == 2

    print("\n== 3. Brute force the WB-L08 p98 challenge (25 keys) ==")
    challenge = "Gztkliv rsyz srrbz yrz dviv ufjk"
    k, plain = brute_force(challenge)
    print("  key =", k, "->", plain)
    assert k == 17 and plain.lower() == "picture abhi baaki hai mere dost"
    assert caesar("Picture abhi baaki hai mere dost", 17) == challenge
    # decrypting with -17 is the same as encrypting with +9, because -17 mod 26 = 9
    assert caesar(challenge, 9) == plain and (-17) % 26 == 9

    print("\n== 4. Key-distribution arithmetic ==")
    for n in (2, 10, 100, 1000):
        sym = n * (n - 1) // 2          # one shared secret per PAIR of users
        asym = 2 * n                    # one (public, private) pair per USER
        print("  n=%5d users: symmetric keys = %7d   asymmetric keys = %5d" % (n, sym, asym))
    assert 100 * 99 // 2 == 4950 and 2 * 100 == 200
    assert 1000 * 999 // 2 == 499500
    print("\nAll Unit06 Caesar assertions passed.")


if __name__ == "__main__":
    main()
