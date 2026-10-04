# Authoring contract for `cn-exam-prep/data/*.js`

The site is a static offline SPA. Data files are **plain JavaScript** loaded with `<script>` tags. There is no build step and no fetch, so the site works by double-clicking `index.html`. `verify.py` loads every data file with Node, then checks structure, answers and placeholders. **If verify.py fails, the work is not done.**

## 0. Golden rules (verify.py enforces these)

1. **No placeholders anywhere** in data or Python: never write `...`, `…`, `etc.`, `and so on`, `similar to above`, `left as an exercise`, `TODO`, `TBD`, `rest of`. Write every step and every list item out in full.
2. **Math:** inside `html` strings use `$…$` (inline) or `$$…$$` (display). `tex` fields take raw LaTeX with no dollar signs. These are JS strings, so **every LaTeX backslash must be doubled**: `"$\\frac{L}{R}$"`, `tex: "d_{trans} = \\frac{L}{R}"`. **Never use a literal dollar sign for money**; write `USD 20`.
3. Use only double- or single-quoted JS strings, not template literals (backticks), so `${` can never be interpolated. Use `+` to join long strings, or one long line.
4. **Badges:** every section has `badge`, which is one of:
   - `"class"`: From class worksheet. The content is in the PDFs; cite pages.
   - `"lab"`: From the Study Pack labs or quizzes.
   - `"researched"`: ⚠ Not covered in class – researched. The topic is in the syllabus but missing from the PDFs.
   - `"extra"`: Extra (standard networking / GATE syllabus).
5. **Honest tags** on every question:
   - `"University-Midsem-style"` or `"GATE-style"` for questions you write.
   - `"From class quiz"` only for the Study Pack quiz MCQs.
   - `"GATE CS YYYY"` only for a genuine past paper, and only together with `pyq: "GATE CS 2014 Set-1 Q.25"`. If you are not certain, do **not** use a GATE year.
6. **Trusted references only:** Kurose & Ross, Tanenbaum, Comer, Forouzan, RFCs (791, 768, 9293/793, 5681/2581, 6298, 2131, 1918, 1034/1035, 8446, 9000, 9114, 7540/9113, 9110/9111, 3022) and AWS documentation for AWS facts.
7. **Slide errors** listed in `UNCLEAR.md` section B must be taught correctly, with a `callout` of kind `"slidefix"` that says what the slide shows and what is correct.

## 1. Unit file: `data/unitNN.js`

```js
window.UNITS = window.UNITS || {};
window.UNITS["unit02"] = {
  id: "unit02", num: 2, day: 1,
  title: "Packet vs Circuit Switching; Delay, Loss, Throughput",
  lectures: "Lecture 2 · WB-L02",
  overview: "<p>2–4 sentence exam-focused overview.</p>",
  sections: [ /* Section objects, in teaching order; Extra sections last */ ]
};
```

### Section

```js
{
  id: "02-A",                    // unique: NN-letter
  title: "Transmission & Propagation Delay",
  badge: "class",                // class | lab | researched | extra
  source: "WB-L02 p16–19",       // file IDs + pages, or "Kurose & Ross §1.4; RFC 791" for researched/extra
  covers: ["02.7", "02.8"],      // COVERAGE.md row IDs; every row must be covered by exactly one or more sections
  blocks: [ /* Block objects in A–I order */ ],
  practice: [ /* Question objects: ≥5 for class/lab/researched, ≥3 for extra */ ]
}
```

**Required A–I structure per unit.** Across a unit's sections you must have at least one `intuition`, one diagram (`figure`, `packet`, `seq`, `chart` or `table`), one `cheat`, one `worked`, one `code` with `level:"low"` and one with `level:"high"`, and one `traps`. Every section that has any math needs a `derivation` in which every step has a `why`.

### Block types

| type | fields | purpose |
|---|---|---|
| `intuition` | `title?`, `html` | B: analogy first, then the precise RFC/textbook definition |
| `text` | `html` | general prose |
| `callout` | `kind`: `key`/`warning`/`takeaway`/`aws`/`analogy`/`slidefix`/`trace`/`practice`; `title`; `html` | the source's callout boxes; `slidefix` = slide error corrected |
| `figure` | `html` (inline `<svg>` or HTML/CSS), `caption` | any hand-made diagram. SVG must use `currentColor` or the CSS variables `var(--fg)`, `var(--accent)`, `var(--muted)`, `var(--ok)`, `var(--bad)`, `var(--warn)` so it works in dark and light themes; give it a `viewBox` and `width="100%"` |
| `packet` | `title`, `width` (bits per row, normally 32), `fields: [{name, bits, note?}]`, `caption?` | C: header bit layout. Fields fill rows left to right, and a field wider than the space left wraps onto following rows automatically. The bits must sum to a multiple of `width`. Put defaults or values in `note` |
| `table` | `head: [..]`, `rows: [[..],..]`, `caption?` | comparisons, routing tables, Dijkstra tables, subnet tables (cells may contain html/math) |
| `seq` | `left`, `right`, `events: [{from:"L"\|"R", label, lost?:true, note?}]`, `caption?`, `notesLeft?`, `notesRight?` | timing ladder (handshakes, GBN/SR traces, DORA, TLS). Each event is one arrow sloping downward. `lost:true` draws a broken arrow with ✗. `note` appears at the side. `{from:"L", label:"", gap:true, note:"timeout"}` inserts a pause row |
| `chart` | `title`, `xLabel`, `yLabel`, `x: [..]`, `series: [{name, y:[..]}]`, `marks?: [{x, label}]`, `hlines?: [{y, label}]` | line chart (cwnd sawtooth and similar) |
| `derivation` | `title`, `steps: [{tex, why}]` | D: one equation per step, each with a one-line reason |
| `cheat` | `title?`, `items: [html]` | E: formulas, ports, header sizes, defaults |
| `worked` | `title`, `tag` (question tag), `problem` (html), `steps: [{tex?, text?, why}]`, `answer` (html) | F: digit-by-digit solved exam problem. The **answer is hidden until the reader clicks "Show solution"**; the student should try it first |
| `code` | `file` (e.g. `"Unit02_delays.py"`, which must exist in `cn-practice/`), `level`: `"low"` (bits/bytes/sockets by hand) or `"high"` (`socket`/`struct`/`ipaddress`/`ssl`/`http.client`/`scapy`), `title`, `note?` | G: shows the script's source, embedded from `data/code.js` |
| `traps` | `items: [html]` | H: exam traps and common fallacies |

### Question

Common fields:

```js
{
  id: "u02-A-1",          // globally unique; mocks use m1-..., drills d-sub-...
  type: "mcq",            // mcq | msq | num | text | write
  tag: "GATE-style",      // see Golden rule 5
  topic: "02.7",          // COVERAGE id
  q: "<p>Question html</p>",
  code: "optional python shown under the question (predict-output / bug-hunt)",
  explain: "<p>Full solution html (shown after Check/Reveal).</p>",
  steps: [{ tex: "...", why: "..." }],   // optional; required for num questions
  formula: "d = \\frac{L}{R}"            // optional tex, shown with the solution
}
```

| type | extra fields | checked how |
|---|---|---|
| `mcq` | `options: [html×4]`, `answer: index`, `why: [html per option]` | one choice; **`why` must explain every option** |
| `msq` | `options`, `answer: [indices]`, `why: [per option]` | exact set match |
| `num` | `answer: number`, `tol: number` (absolute tolerance), `unit: "ms"`, **`verify: "python expression"`** | the question must state units and rounding ("in ms, rounded to 2 decimals"). `verify` is a Python expression using only literals, `+ - * / // % **`, `math.*`, `int`, `round`, `min`, `max`, `abs`, `sum`, `bin`, `int('1010',2)`. verify.py checks that `abs(eval(verify) - answer) <= tol` |
| `text` | `answer: "255.255.255.192"`, `accept?: [alternatives]`, `verify?` (Python expression returning a string), `runCheck?: true` | normalised exact match (case, spaces). With `runCheck:true` the `code` field is executed by verify.py and its stripped stdout must equal `answer`. Use this for every predict-output question |
| `write` | `starter?`, `solutionFile` (a `cn-practice/*.py` that verify.py runs), `rubric: [html]` | open coding: the student writes code, then reveals the model solution and marks themselves |

## 2. Python scripts: `cn-practice/UnitNN_topic.py`

- Self-contained, Python 3.8+, standard library only. `scapy` is optional: wrap it in `try: import scapy… except ImportError: print("scapy not installed – skipping high-level demo")`.
- **Must finish in under 15 s with exit code 0, offline, as a normal (non-root) user.** For socket demos, start the server in a `threading.Thread` on `127.0.0.1` with port `0` (OS-assigned) and use `settimeout`. Never contact the internet. Raw sockets need root: build the bytes and show them, and only send when `os.geteuid()==0` **and** a `--send` flag is given.
- Start with a docstring: the topic, the COVERAGE ids, and how to run it. Comment every non-obvious line.
- Use `assert` on the textbook answers so that running the script also self-tests it (e.g. `assert checksum == 0b00010110`).
- Print readable step-by-step output that matches the site's worked examples.

## 3. Mocks: `data/mock1.js`, `data/mock2.js`

```js
window.MOCKS = window.MOCKS || {};
window.MOCKS["mock1"] = {
  id: "mock1", title: "Mock Exam 1", minutes: 120,
  instructions: "<p>…</p>",
  sections: [
    { name: "Section A — MCQ / MSQ", marks: 1, negative: 0, questions: [ /* 20, each with unit:"unit09" */ ] },
    { name: "Section B — Numerical", marks: 2, questions: [ /* 10 num */ ] },
    { name: "Section C — Coding", marks: 5, questions: [ /* 4: mix of text(runCheck) + write */ ] }
  ]
};
```

Every mock question also has `unit: "unitNN"`, which is used for the weakness diagnosis.

## 4. Drills: `data/drills.js`

```js
window.DRILLS = window.DRILLS || {};
window.DRILLS["subnet"] = { id: "subnet", title: "Subnet & Numerical Drill", intro: "<p>…</p>", questions: [ /* ≥40 num/text */ ] };
window.DRILLS["header"] = { id: "header", title: "Protocol & Header Drill", intro: "...", questions: [ /* ≥30 */ ] };
window.DRILLS["socket"] = { id: "socket", title: "Socket & Scripting Drill", intro: "...", questions: [ /* ≥20 */ ] };
```

## 5. Extras: `data/plan.js`, `data/formulas.js`

```js
window.EXTRAS = window.EXTRAS || {};
window.EXTRAS.plan = { title, intro, days: [ { day: 1, title, minutes: 105, units: ["unit01","unit02"], tasks: [html], checkpoint: html } ] };
window.EXTRAS.formulas = { title, sections: [ { title, blocks: [Block] } ] };   // same Block types as units
```
