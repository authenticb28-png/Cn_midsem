# CN Midsem Exam Prep (CSAI321, Lectures 1–15)

An interactive, fully offline study site built from the lecture PDFs in `Lectures/`.

## Open the site
Double-click **`cn-exam-prep/index.html`**. It runs from `file://` with no server, no internet and no install. KaTeX is stored locally in `cn-exam-prep/vendor/katex/`. Progress (solved questions, ticked sections, mock scores) is saved in your browser's localStorage.

What's inside:
- **15 units** in lecture order. Each has source badges, intuition, header diagrams, step-by-step derivations, a cheat sheet, worked problems, two Python implementations, exam traps, and attempt-first practice.
- **Drills:** Subnet & Numerical, Protocol & Header, Socket & Scripting.
- **2 timed mock exams** (20 MCQ/MSQ + 10 numerical + 4 coding), with a score report and a unit-by-unit weakness diagnosis.
- **7-day study plan** and a **last-night formula sheet**.

## Run the Python practice scripts
```
python3 cn-practice/Unit09_tcp_echo.py     # any script; all run offline on 127.0.0.1
```
They use only the standard library; `scapy` is optional.

## Verify everything
```
python3 tools/build_code.py   # re-embed cn-practice/*.py into the site after editing a script
python3 verify.py             # coverage, answers, KaTeX, placeholders, runs every script
```

## Project map
| Path | What |
|---|---|
| `Lectures/` | original PDFs (source of truth) |
| `extracted/` | text layer of every PDF |
| `phase0/inventory/` | page-by-page inventory of every PDF and the Study Pack |
| `COVERAGE.md` | source map, syllabus check, coverage table |
| `UNCLEAR.md` | unreadable/missing content and slide errors with corrections |
| `cn-exam-prep/` | the website (`index.html`, `css/`, `js/app.js`, `data/*.js`, `vendor/katex/`) |
| `cn-exam-prep/SCHEMA.md` | data format used by `data/*.js` |
| `cn-practice/` | runnable Python scripts (unit demos, mock and drill model solutions) |
| `tools/` | build helpers (`build_code.py`, `dump_data.js`, `check_math.js`, `example_unit.js`) |
| `verify.py` | Phase-5 verifier |
