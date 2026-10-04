#!/usr/bin/env python3
"""Unit 06 - A real TLS server and client on 127.0.0.1 with Python's ssl module.

COVERAGE rows: 06.1 (HTTPS = HTTP + TLS), 06.6 (certificates, chain of trust),
06.7 (TLS handshake over TCP), 06.8 (TLS 1.3 vs TLS 1.2).

Level: HIGH - ssl does the handshake; we inspect what it negotiated.

What happens (path A, needs the `cryptography` package):
  1. Build a 3-level chain at runtime: Root CA -> Intermediate CA -> leaf "localhost"
     (ECDSA P-256 keys, so generation takes milliseconds). Each signature is verified by
     hand: leaf.signature checked with the INTERMEDIATE public key, intermediate.signature
     checked with the ROOT public key.
  2. Start a TLS server thread on 127.0.0.1, port 0. It sends leaf + intermediate (never the root).
  3. A client that trusts ONLY our root (cafile=root.pem) connects with server_hostname="localhost":
     prints TLS version, cipher suite, the peer certificate fields, then sends an HTTP GET inside TLS.
  4. Negative tests: a client with the default system trust store rejects our private root;
     a client asking for the wrong hostname is rejected; a TLS 1.2-only client still works.
Path B (no `cryptography`, but the `openssl` CLI exists): one self-signed certificate, same tests.
Path C (neither): prints ssl.create_default_context() settings and parses an embedded PEM.

Run:  python3 Unit06_tls_server.py            (offline, about 0.3 s)
      python3 Unit06_tls_server.py --path B   (force a fallback path to see it work)
"""
import datetime
import os
import shutil
import socket
import ssl
import subprocess
import sys
import tempfile
import threading

FORCE = sys.argv[sys.argv.index("--path") + 1] if "--path" in sys.argv else None

# A public demo certificate (no private key) for path C. Generated once with:
# openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 -subj "/C=IN/O=CN Midsem Demo/CN=demo.cn-midsem.test"
#   -addext "subjectAltName=DNS:demo.cn-midsem.test,DNS:localhost,IP:127.0.0.1" -days 7300
EMBEDDED_PEM = """-----BEGIN CERTIFICATE-----
MIICEDCCAbagAwIBAgIUfWxEcdaxSG4FfBXtd/dM41hKv+4wCgYIKoZIzj0EAwIw
RDELMAkGA1UEBhMCSU4xFzAVBgNVBAoMDkNOIE1pZHNlbSBEZW1vMRwwGgYDVQQD
DBNkZW1vLmNuLW1pZHNlbS50ZXN0MB4XDTI2MTAwNDE0MTExOVoXDTQ2MDkyOTE0
MTExOVowRDELMAkGA1UEBhMCSU4xFzAVBgNVBAoMDkNOIE1pZHNlbSBEZW1vMRww
GgYDVQQDDBNkZW1vLmNuLW1pZHNlbS50ZXN0MFkwEwYHKoZIzj0CAQYIKoZIzj0D
AQcDQgAExm01sD4wMKAiHbxoKXk1br053wMimEaWraI8pYMoP3MQa7YQi35YBnK4
QkVkQNeQrzJiHfUf6hrsUqK2xhVutaOBhTCBgjAdBgNVHQ4EFgQUXFrWJpFJRbDP
ejhSC5s0EvH/v50wHwYDVR0jBBgwFoAUXFrWJpFJRbDPejhSC5s0EvH/v50wDwYD
VR0TAQH/BAUwAwEB/zAvBgNVHREEKDAmghNkZW1vLmNuLW1pZHNlbS50ZXN0ggls
b2NhbGhvc3SHBH8AAAEwCgYIKoZIzj0EAwIDSAAwRQIhAL5e5ArQh4RnPZmOnhdN
Fm6cBuJp+xNJjWySiZMWJYxMAiBbc2DazhOgaeW7uAly8CZXzSqYCHiUmkzY12i+
N34oyQ==
-----END CERTIFICATE-----
"""


# ---------------------------------------------------------------------------
# Certificate generation
# ---------------------------------------------------------------------------
def make_chain_with_cryptography(d):
    """Root -> Intermediate -> leaf. Returns (server_chain_file, key_file, root_file)."""
    from cryptography import x509
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import ec
    from cryptography.x509.oid import NameOID
    import ipaddress

    now = datetime.datetime.now(datetime.timezone.utc)

    def name(cn):
        return x509.Name([x509.NameAttribute(NameOID.ORGANIZATION_NAME, "CN Midsem Demo"),
                          x509.NameAttribute(NameOID.COMMON_NAME, cn)])

    def build(subject_cn, subject_key, issuer_cn, issuer_key, is_ca, san=None):
        b = (x509.CertificateBuilder()
             .subject_name(name(subject_cn)).issuer_name(name(issuer_cn))
             .public_key(subject_key.public_key())
             .serial_number(x509.random_serial_number())
             .not_valid_before(now - datetime.timedelta(minutes=5))
             .not_valid_after(now + datetime.timedelta(days=2))
             .add_extension(x509.BasicConstraints(ca=is_ca, path_length=None), critical=True))
        if is_ca:
            b = b.add_extension(x509.KeyUsage(digital_signature=True, key_cert_sign=True, crl_sign=True,
                                              content_commitment=False, key_encipherment=False,
                                              data_encipherment=False, key_agreement=False,
                                              encipher_only=False, decipher_only=False), critical=True)
        if san:
            b = b.add_extension(x509.SubjectAlternativeName(san), critical=False)
        return b.sign(issuer_key, hashes.SHA256())        # the ISSUER's private key signs

    root_key = ec.generate_private_key(ec.SECP256R1())
    inter_key = ec.generate_private_key(ec.SECP256R1())
    leaf_key = ec.generate_private_key(ec.SECP256R1())
    root = build("Demo Root CA", root_key, "Demo Root CA", root_key, True)           # self-signed
    inter = build("Demo Intermediate CA", inter_key, "Demo Root CA", root_key, True)
    leaf = build("localhost", leaf_key, "Demo Intermediate CA", inter_key, False,
                 [x509.DNSName("localhost"), x509.IPAddress(ipaddress.ip_address("127.0.0.1"))])

    print("== Chain of trust built at runtime ==")
    for label, cert in (("leaf", leaf), ("intermediate", inter), ("root", root)):
        print("  %-12s subject=%-22s issuer=%s" % (label, cert.subject.rfc4514_string().split(",")[0],
                                                     cert.issuer.rfc4514_string().split(",")[0]))
    # Verify each link by hand: the issuer's PUBLIC key checks the subject's signature.
    inter_key.public_key().verify(leaf.signature, leaf.tbs_certificate_bytes, ec.ECDSA(hashes.SHA256()))
    root_key.public_key().verify(inter.signature, inter.tbs_certificate_bytes, ec.ECDSA(hashes.SHA256()))
    root_key.public_key().verify(root.signature, root.tbs_certificate_bytes, ec.ECDSA(hashes.SHA256()))
    print("  leaf signed by intermediate: OK; intermediate signed by root: OK; root self-signed: OK")
    try:
        root_key.public_key().verify(leaf.signature, leaf.tbs_certificate_bytes, ec.ECDSA(hashes.SHA256()))
        skipped_link = True
    except Exception:
        skipped_link = False
    print("  root key checking the leaf directly ->", "accepted" if skipped_link else "InvalidSignature (links cannot be skipped)")
    assert not skipped_link

    pem = serialization.Encoding.PEM
    chain = os.path.join(d, "chain.pem")
    with open(chain, "wb") as f:                      # server sends leaf FIRST, then intermediate
        f.write(leaf.public_bytes(pem) + inter.public_bytes(pem))
    key = os.path.join(d, "leaf.key")
    with open(key, "wb") as f:
        f.write(leaf_key.private_bytes(pem, serialization.PrivateFormat.PKCS8, serialization.NoEncryption()))
    rootf = os.path.join(d, "root.pem")
    with open(rootf, "wb") as f:
        f.write(root.public_bytes(pem))
    return chain, key, rootf


def make_self_signed_with_openssl(d):
    cert, key = os.path.join(d, "cert.pem"), os.path.join(d, "key.pem")
    subprocess.run(["openssl", "req", "-x509", "-newkey", "ec", "-pkeyopt", "ec_paramgen_curve:prime256v1",
                    "-nodes", "-keyout", key, "-out", cert, "-days", "2", "-subj", "/O=CN Midsem Demo/CN=localhost",
                    "-addext", "subjectAltName=DNS:localhost,IP:127.0.0.1"],
                   check=True, capture_output=True, timeout=10)
    print("== Self-signed certificate made with the openssl CLI (leaf = root, chain length 1) ==")
    return cert, key, cert


# ---------------------------------------------------------------------------
# TLS server and client
# ---------------------------------------------------------------------------
def start_server(chain_file, key_file):
    ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ctx.minimum_version = ssl.TLSVersion.TLSv1_2
    ctx.load_cert_chain(chain_file, key_file)
    listener = socket.create_server(("127.0.0.1", 0))
    listener.settimeout(5)
    port = listener.getsockname()[1]

    def loop():
        while True:
            try:
                raw, _ = listener.accept()            # 1. plain TCP 3-way handshake done here
            except (socket.timeout, OSError):
                return
            try:
                with ctx.wrap_socket(raw, server_side=True) as tls:   # 2. TLS handshake
                    tls.settimeout(3)
                    req = tls.recv(4096)                              # 3. decrypted HTTP request
                    body = b"hello over " + tls.version().encode()
                    tls.sendall(b"HTTP/1.1 200 OK\r\nContent-Length: %d\r\nConnection: close\r\n\r\n" % len(body) + body)
                    del req
            except (ssl.SSLError, OSError):
                pass                                   # client rejected us: just drop the connection

    threading.Thread(target=loop, daemon=True).start()
    return listener, port


def https_get(port, ctx, hostname):
    with socket.create_connection(("127.0.0.1", port), timeout=3) as raw:
        with ctx.wrap_socket(raw, server_hostname=hostname) as tls:
            info = (tls.version(), tls.cipher(), tls.getpeercert())   # handshake already finished here
            tls.sendall(b"GET / HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n")
            data = b""
            while True:
                chunk = tls.recv(4096)
                if not chunk:
                    break
                data += chunk
            return info + (data,)


def run_tls_demo(chain_file, key_file, root_file):
    listener, port = start_server(chain_file, key_file)
    print("\n== TLS server on 127.0.0.1:%d ==" % port)

    good = ssl.create_default_context(cafile=root_file)       # trust ONLY our demo root
    version, cipher, cert, data = https_get(port, good, "localhost")
    print("  negotiated      :", version, "| cipher suite:", cipher[0], "| secret bits:", cipher[2])
    print("  peer subject    :", dict(x[0] for x in cert["subject"]))
    print("  peer issuer     :", dict(x[0] for x in cert["issuer"]))
    print("  subjectAltName  :", cert.get("subjectAltName"))
    print("  valid           :", cert["notBefore"], "->", cert["notAfter"])
    print("  HTTP inside TLS :", data.split(b"\r\n")[0].decode(), "|", data.split(b"\r\n\r\n")[1].decode())
    assert version == "TLSv1.3" and data.startswith(b"HTTP/1.1 200 OK")
    assert cipher[0] in ("TLS_AES_256_GCM_SHA384", "TLS_AES_128_GCM_SHA256", "TLS_CHACHA20_POLY1305_SHA256")

    v12 = ssl.create_default_context(cafile=root_file)
    v12.maximum_version = ssl.TLSVersion.TLSv1_2               # pretend to be an old client
    version, cipher, _, _ = https_get(port, v12, "localhost")
    print("  TLS 1.2 client  :", version, "| cipher suite:", cipher[0])
    assert version == "TLSv1.2"

    print("\n== Negative tests ==")
    system_only = ssl.create_default_context()                  # system roots: our root is unknown
    try:
        https_get(port, system_only, "localhost")
        raise AssertionError("an untrusted root was accepted")
    except ssl.SSLCertVerificationError as e:
        print("  system trust store  -> rejected:", e.verify_message)
    try:
        https_get(port, good, "micr0soft.example")              # look-alike / wrong name
        raise AssertionError("a wrong hostname was accepted")
    except ssl.SSLCertVerificationError as e:
        print("  wrong hostname      -> rejected:", e.verify_message)
    listener.close()


def show_default_context_and_embedded_pem(d):
    print("== Path C: no certificate generator available ==")
    ctx = ssl.create_default_context()
    print("  create_default_context(): verify_mode =", ctx.verify_mode.name,
          "| check_hostname =", ctx.check_hostname,
          "| minimum_version =", ctx.minimum_version.name)
    assert ctx.verify_mode == ssl.CERT_REQUIRED and ctx.check_hostname
    path = os.path.join(d, "embedded.pem")
    with open(path, "w") as f:
        f.write(EMBEDDED_PEM)
    info = ssl._ssl._test_decode_cert(path)        # CPython helper that parses a PEM file
    print("  embedded subject   :", dict(x[0] for x in info["subject"]))
    print("  embedded issuer    :", dict(x[0] for x in info["issuer"]), "(same as subject: self-signed)")
    print("  serial / validity  :", info["serialNumber"], "|", info["notBefore"], "->", info["notAfter"])
    print("  subjectAltName     :", info["subjectAltName"])
    assert info["subject"] == info["issuer"]
    assert ("IP Address", "127.0.0.1") in info["subjectAltName"]
    der = ssl.PEM_cert_to_DER_cert(EMBEDDED_PEM)
    print("  DER length         :", len(der), "bytes")


def main():
    print("Python ssl linked against", ssl.OPENSSL_VERSION)
    d = tempfile.mkdtemp(prefix="unit06_tls_")
    try:
        have_crypto = True
        try:
            import cryptography  # noqa: F401
        except ImportError:
            have_crypto = False
        path = FORCE or ("A" if have_crypto else ("B" if shutil.which("openssl") else "C"))
        if path == "A":
            run_tls_demo(*make_chain_with_cryptography(d))
        elif path == "B":
            run_tls_demo(*make_self_signed_with_openssl(d))
        else:
            show_default_context_and_embedded_pem(d)
    finally:
        shutil.rmtree(d, ignore_errors=True)
    print("\nAll Unit06 TLS assertions passed (path %s)." % path)


if __name__ == "__main__":
    main()
