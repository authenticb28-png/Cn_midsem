#!/usr/bin/env python3
"""verify.py — Phase 5 verifier for the CN exam-prep site.

Checks
  1. every data file loads (via Node) and every unit01..unit15 exists
  2. every COVERAGE.md row ID is covered by at least one unit section
  3. every unit has the A–I teaching structure; every section has a badge, source and enough practice
  4. every question is well-formed; every numerical answer is recomputed from its `verify` expression
  5. predict-output questions (`runCheck`) are executed and their stdout compared
  6. all LaTeX renders with KaTeX
  7. no placeholder strings ("...", "…", "TODO", "etc.", "left as exercise", …) in data or scripts
  8. every cn-practice/*.py script runs offline without errors (exit code 0)
  9. mocks / drills / plan / formula sheet meet their size requirements
Prints a summary report.  Exit code 0 = all good.

Usage:  python3 verify.py            (full)
        python3 verify.py --fast     (skip running the cn-practice scripts)
        python3 verify.py --only unit09   (limit content checks to one unit)
"""
import json
import math
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent
SITE = ROOT / "cn-exam-prep"
PRACTICE = ROOT / "cn-practice"
FAST = "--fast" in sys.argv
ONLY = sys.argv[sys.argv.index("--only") + 1] if "--only" in sys.argv else None

errors, warnings = [], []
def err(msg): errors.append(msg)
def warn(msg): warnings.append(msg)

PLACEHOLDER = re.compile(
    r"\.\.\.|…|\betc\b\.?|\band so on\b|similar to (the )?above|left as (an )?exercise|\bTODO\b|\bTBD\b|\bFIXME\b|"
    r"rest of (the )?packet bytes|fill in later|\bplaceholder\b", re.I)
BADGES = {"class", "lab", "researched", "extra"}
QTYPES = {"mcq", "msq", "num", "text", "write"}
TAG_OK = re.compile(r"^(GATE-style|University-Midsem-style|From class quiz|GATE CS \d{4}( Set-?\d)?)$")
DIAGRAMS = {"figure", "packet", "seq", "chart", "table"}

# ---------------------------------------------------------------- load data
def load_data():
    r = subprocess.run(["node", str(ROOT / "tools" / "dump_data.js")], capture_output=True, text=True, timeout=120)
    if r.returncode != 0:
        print(r.stderr); sys.exit("node failed to load data")
    d = json.loads(r.stdout)
    for e in d["errors"]:
        err("data load error: " + e)
    return d

def coverage_ids():
    text = (ROOT / "COVERAGE.md").read_text(encoding="utf-8")
    part = text.split("## 4. Coverage table", 1)[1]
    return re.findall(r"^\| (\d{2}\.\d+|Q\.\d+) \|", part, re.M)

# ---------------------------------------------------------------- safe eval for numeric answers
SAFE = {"math": math, "int": int, "float": float, "round": round, "min": min, "max": max, "abs": abs,
        "sum": sum, "bin": bin, "hex": hex, "len": len, "pow": pow, "str": str, "format": format,
        "sorted": sorted, "range": range, "list": list, "ord": ord, "chr": chr}
def safe_eval(expr):
    if "__" in expr or "import" in expr or "open(" in expr:
        raise ValueError("forbidden token")
    return eval(expr, {"__builtins__": {}}, dict(SAFE))

def norm_text(s):
    s = re.sub(r"\s+", " ", str(s).strip().lower())
    return re.sub(r"\s*([,/:=])\s*", r"\1", s)

# ---------------------------------------------------------------- string walking
def walk_strings(o, path=""):
    if isinstance(o, str):
        yield path, o
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from walk_strings(v, path + "[%d]" % i)
    elif isinstance(o, dict):
        for k, v in o.items():
            yield from walk_strings(v, path + "." + k)

# ---------------------------------------------------------------- question checks
seen_ids = {}
runcheck_jobs = []
stats = {"questions": 0, "num": 0, "mcq": 0, "msq": 0, "text": 0, "write": 0, "runcheck": 0, "pyq": 0}

def check_question(q, where, unit_required=False):
    qid = q.get("id")
    w = "%s/%s" % (where, qid)
    if not qid:
        err(where + ": question without id"); return
    if qid in seen_ids:
        err("duplicate question id %s (%s and %s)" % (qid, seen_ids[qid], where))
    seen_ids[qid] = where
    t = q.get("type")
    stats["questions"] += 1
    if t not in QTYPES:
        err(w + ": bad type %r" % t); return
    stats[t] += 1
    tag = q.get("tag", "")
    if not TAG_OK.match(tag):
        err(w + ": bad tag %r" % tag)
    if tag.startswith("GATE CS"):
        stats["pyq"] += 1
        if not q.get("pyq"):
            err(w + ": GATE year tag without `pyq` reference")
    if not q.get("q"):
        err(w + ": empty question text")
    if unit_required and not q.get("unit"):
        err(w + ": mock question needs `unit`")
    if t in ("mcq", "msq"):
        opts, why = q.get("options") or [], q.get("why") or []
        if len(opts) < 2:
            err(w + ": needs options")
        if len(why) != len(opts):
            err(w + ": `why` must explain every option (%d options, %d whys)" % (len(opts), len(why)))
        a = q.get("answer")
        if t == "mcq" and not (isinstance(a, int) and 0 <= a < len(opts)):
            err(w + ": mcq answer index invalid")
        if t == "msq" and not (isinstance(a, list) and a and all(isinstance(i, int) and 0 <= i < len(opts) for i in a)):
            err(w + ": msq answer list invalid")
    elif t == "num":
        if not isinstance(q.get("answer"), (int, float)):
            err(w + ": num answer must be a number")
        elif "tol" not in q:
            err(w + ": num needs tol")
        elif not q.get("verify"):
            err(w + ": num needs `verify` expression")
        else:
            try:
                v = safe_eval(q["verify"])
                if abs(float(v) - q["answer"]) > q["tol"] + 1e-9:
                    err(w + ": answer %r but verify gives %r" % (q["answer"], v))
            except Exception as e:
                err(w + ": verify failed: %s" % e)
        if not q.get("steps") and not q.get("explain"):
            err(w + ": numerical needs steps/explain")
    elif t == "text":
        if not isinstance(q.get("answer"), str) or not q["answer"].strip():
            err(w + ": text answer missing")
        if q.get("verify"):
            try:
                v = safe_eval(q["verify"])
                if norm_text(v) not in [norm_text(x) for x in [q["answer"]] + q.get("accept", [])]:
                    err(w + ": text answer %r but verify gives %r" % (q["answer"], v))
            except Exception as e:
                err(w + ": verify failed: %s" % e)
        if q.get("runCheck"):
            if not q.get("code"):
                err(w + ": runCheck without code")
            else:
                runcheck_jobs.append((w, q["code"], q["answer"]))
    elif t == "write":
        sf = q.get("solutionFile")
        if not sf or not (PRACTICE / sf).exists():
            err(w + ": solutionFile missing: %r" % sf)
        if not q.get("rubric"):
            err(w + ": write question needs rubric")
    if not q.get("explain") and not q.get("steps") and t != "write":
        err(w + ": no explanation")

# ---------------------------------------------------------------- unit checks
block_stats = {}
code_files_used = set()

def check_blocks(blocks, where):
    for b in blocks:
        t = b.get("type")
        block_stats[t] = block_stats.get(t, 0) + 1
        if t == "code":
            code_files_used.add(b.get("file"))
            if not (PRACTICE / str(b.get("file"))).exists():
                err("%s: code block refers to missing cn-practice/%s" % (where, b.get("file")))
            if b.get("level") not in ("low", "high"):
                err("%s: code block level must be low/high" % where)
        elif t == "packet":
            total = sum(f.get("bits", 0) for f in b.get("fields", []))
            if total % b.get("width", 32):
                err("%s: packet '%s' bits sum %d is not a multiple of width" % (where, b.get("title"), total))
        elif t == "derivation":
            for s in b.get("steps", []):
                if not s.get("tex") or not s.get("why"):
                    err("%s: derivation step missing tex/why" % where)
        elif t == "worked":
            if not b.get("steps") or not b.get("answer"):
                err("%s: worked problem missing steps/answer" % where)
            for s in b.get("steps", []):
                if not s.get("why"):
                    err("%s: worked step missing why" % where)
        elif t == "callout" and b.get("kind") not in ("key", "warning", "takeaway", "aws", "analogy", "slidefix", "trace", "practice"):
            err("%s: bad callout kind %r" % (where, b.get("kind")))
        elif t not in ("intuition", "text", "figure", "table", "seq", "chart", "cheat", "traps", "callout"):
            err("%s: unknown block type %r" % (where, t))

def check_unit(uid, u):
    covered = set()
    kinds = set()
    levels = set()
    for f in ("title", "num", "day", "overview", "sections"):
        if f not in u:
            err("%s: missing %s" % (uid, f))
    for s in u.get("sections", []):
        w = "%s/%s" % (uid, s.get("id"))
        if s.get("badge") not in BADGES:
            err(w + ": bad badge %r" % s.get("badge"))
        if not s.get("source"):
            err(w + ": missing source")
        if not s.get("covers"):
            err(w + ": missing covers")
        covered.update(s.get("covers", []))
        blocks = s.get("blocks", [])
        if not blocks:
            err(w + ": no blocks")
        check_blocks(blocks, w)
        for b in blocks:
            kinds.add(b.get("type"))
            if b.get("type") == "code":
                levels.add(b.get("level"))
        need = 3 if s.get("badge") == "extra" else 5
        if len(s.get("practice", [])) < need:
            err(w + ": only %d practice questions (need %d)" % (len(s.get("practice", [])), need))
        for q in s.get("practice", []):
            check_question(q, w)
    for k, label in (("intuition", "B intuition"), ("cheat", "E cheat sheet"), ("worked", "F worked problem"),
                     ("traps", "H traps"), ("derivation", "D derivation")):
        if k not in kinds:
            err("%s: no %s block" % (uid, label))
    if not (kinds & DIAGRAMS):
        err(uid + ": no C diagram/header block")
    if not {"low", "high"} <= levels:
        err("%s: needs both low-level and high-level code blocks (has %s)" % (uid, sorted(levels)))
    return covered

# ---------------------------------------------------------------- main
def main():
    data = load_data()
    units = data["UNITS"]
    all_covered = set()
    expected_units = ["unit%02d" % i for i in range(1, 16)]
    for uid in expected_units:
        if ONLY and uid != ONLY:
            continue
        if uid not in units:
            err("missing " + uid)
            continue
        all_covered |= check_unit(uid, units[uid])

    if not ONLY:
        missing = [c for c in coverage_ids() if c not in all_covered]
        if missing:
            err("COVERAGE rows not covered by any section: " + ", ".join(missing))

        # mocks
        for mid in ("mock1", "mock2"):
            m = data["MOCKS"].get(mid)
            if not m:
                err("missing " + mid); continue
            secs = m.get("sections", [])
            want = [(20, {"mcq", "msq"}), (10, {"num"}), (4, {"text", "write", "mcq", "num"})]
            if len(secs) != 3:
                err(mid + ": needs 3 sections")
            for (n, types), s in zip(want, secs):
                qs = s.get("questions", [])
                if len(qs) != n:
                    err("%s/%s: has %d questions, needs %d" % (mid, s.get("name"), len(qs), n))
                for q in qs:
                    check_question(q, mid, unit_required=True)
                    if q.get("type") not in types:
                        err("%s/%s: type %s not allowed in this section" % (mid, q.get("id"), q.get("type")))
            if secs and not any(q.get("type") == "msq" for q in secs[0].get("questions", [])):
                err(mid + ": Section A should include MSQs")
        # drills
        for did, n in (("subnet", 40), ("header", 30), ("socket", 20)):
            d = data["DRILLS"].get(did)
            if not d:
                err("missing drill " + did); continue
            if len(d.get("questions", [])) < n:
                err("drill %s has %d questions, needs %d" % (did, len(d.get("questions", [])), n))
            for q in d.get("questions", []):
                check_question(q, "drill-" + did)
        # extras
        plan = data["EXTRAS"].get("plan")
        if not plan or len(plan.get("days", [])) != 7:
            err("study plan must have 7 days")
        fs = data["EXTRAS"].get("formulas")
        if not fs or len(fs.get("sections", [])) < 8:
            err("formula sheet needs at least 8 sections")
        else:
            for i, s in enumerate(fs["sections"]):
                check_blocks(s.get("blocks", []), "formulas[%d]" % i)

    # placeholders in data
    for top in ("UNITS", "MOCKS", "DRILLS", "EXTRAS"):
        for path, s in walk_strings(data[top], top):
            if ONLY and ONLY not in path:
                continue
            m = PLACEHOLDER.search(re.sub(r"<[^>]+>", " ", s))
            if m:
                err("placeholder %r at %s: …%s…" % (m.group(0), path, s[max(0, m.start() - 40):m.end() + 40].replace("\n", " ")))

    # LaTeX
    r = subprocess.run(["node", str(ROOT / "tools" / "check_math.js")], input=json.dumps(data), capture_output=True, text=True, timeout=300)
    if r.returncode != 0:
        err("math checker crashed: " + r.stderr[:400])
    else:
        for b in json.loads(r.stdout):
            if ONLY and ONLY not in b["where"]:
                continue
            err("KaTeX: %s: %s [%s]" % (b["where"], b["err"], b["tex"]))

    # predict-output questions
    for w, code, ans in runcheck_jobs:
        try:
            p = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, timeout=20, cwd=str(PRACTICE))
            out = p.stdout.strip()
            if p.returncode != 0:
                err("%s: predict-output code crashed: %s" % (w, p.stderr.strip()[-300:]))
            elif norm_text(out) != norm_text(ans):
                err("%s: predict-output answer %r but code prints %r" % (w, ans, out))
            stats["runcheck"] += 1
        except subprocess.TimeoutExpired:
            err(w + ": predict-output code timed out")

    # scripts
    scripts = sorted(PRACTICE.glob("*.py"))
    for f in scripts:
        txt = f.read_text(encoding="utf-8")
        m = PLACEHOLDER.search(txt)
        if m:
            line = txt[:m.start()].count("\n") + 1
            err("placeholder %r in cn-practice/%s line %d" % (m.group(0), f.name, line))
    ran = 0
    if not FAST:
        for f in scripts:
            if ONLY and not f.name.lower().startswith(ONLY):
                continue
            try:
                p = subprocess.run([sys.executable, str(f)], capture_output=True, text=True, timeout=60, cwd=str(PRACTICE))
                ran += 1
                if p.returncode != 0:
                    err("cn-practice/%s exited %d: %s" % (f.name, p.returncode, (p.stderr or p.stdout).strip()[-400:]))
            except subprocess.TimeoutExpired:
                err("cn-practice/%s timed out" % f.name)

    # code.js freshness
    code_js = SITE / "data" / "code.js"
    if code_js.exists():
        cj = code_js.read_text(encoding="utf-8")
        for f in scripts:
            if json.dumps(f.read_text(encoding="utf-8")) not in cj:
                err("data/code.js is stale for %s — run python3 tools/build_code.py" % f.name)
    else:
        err("data/code.js missing — run python3 tools/build_code.py")

    # ---------------------------------------------------------------- report
    n_sections = sum(len(u.get("sections", [])) for u in units.values())
    badges = {}
    for u in units.values():
        for s in u.get("sections", []):
            badges[s.get("badge")] = badges.get(s.get("badge"), 0) + 1
    print("=" * 70)
    print("CN exam-prep verification report")
    print("=" * 70)
    print("Units: %d   Sections: %d   badges: %s" % (len(units), n_sections, badges))
    print("Questions checked: %(questions)d  (MCQ %(mcq)d, MSQ %(msq)d, numerical %(num)d, text %(text)d, coding %(write)d)" % stats)
    print("Predict-output questions executed: %d   GATE-PYQ-tagged: %d" % (stats["runcheck"], stats["pyq"]))
    print("Blocks: " + ", ".join("%s=%d" % kv for kv in sorted(block_stats.items())))
    print("Packet-header diagrams: %d   sequence diagrams: %d   charts: %d" % (block_stats.get("packet", 0), block_stats.get("seq", 0), block_stats.get("chart", 0)))
    print("Python scripts: %d (executed: %s)   referenced from units: %d" % (len(scripts), "skipped (--fast)" if FAST else ran, len(code_files_used)))
    print("Mocks: %d   Drills: %s" % (len(data["MOCKS"]), {k: len(v.get("questions", [])) for k, v in data["DRILLS"].items()}))
    for w in warnings:
        print("WARN:", w)
    if errors:
        print("\n%d ERROR(S):" % len(errors))
        for e in errors[:400]:
            print("  ✘", e)
        sys.exit(1)
    print("\nALL CHECKS PASSED ✔")

if __name__ == "__main__":
    main()
