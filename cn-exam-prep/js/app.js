/* CN Exam Prep — offline single-page app.
 * Data comes from window.UNITS / MOCKS / DRILLS / EXTRAS / CODE (plain <script> files),
 * so the site works from file:// with no server. State lives in localStorage. */
(function () {
  "use strict";

  var UNITS = window.UNITS || {};
  var MOCKS = window.MOCKS || {};
  var DRILLS = window.DRILLS || {};
  var EXTRAS = window.EXTRAS || {};
  var CODE = window.CODE || {};

  /* ---------- state ---------- */
  var KEY = "cnprep-v1";
  var state = load();
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || "{}");
      s.answers = s.answers || {}; s.done = s.done || {}; s.mocks = s.mocks || {};
      return s;
    } catch (e) { return { answers: {}, done: {}, mocks: {} }; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode */ } }

  /* ---------- helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function el(html) { var d = document.createElement("div"); d.innerHTML = html; return d.firstElementChild; }
  function unitList() {
    return Object.keys(UNITS).map(function (k) { return UNITS[k]; }).sort(function (a, b) { return a.num - b.num; });
  }
  function badgeHtml(b) {
    var map = {
      "class": ["b-class", "From class worksheet"],
      "lab": ["b-lab", "From lab / class quiz"],
      "researched": ["b-res", "⚠ Not covered in class – researched"],
      "extra": ["b-extra", "Extra (standard networking syllabus)"]
    };
    var m = map[b] || ["b-extra", b];
    return '<span class="badge ' + m[0] + '">' + m[1] + "</span>";
  }
  function tex(t, display) {
    if (!window.katex) return '<code>' + esc(t) + '</code>';
    try { return window.katex.renderToString(t, { displayMode: display !== false, throwOnError: false }); }
    catch (e) { return '<code>' + esc(t) + '</code>'; }
  }
  function typeset(root) {
    if (window.renderMathInElement) {
      window.renderMathInElement(root, {
        delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }],
        ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
        throwOnError: false
      });
    }
  }
  function stepsHtml(steps) {
    if (!steps || !steps.length) return "";
    return '<ol class="steps">' + steps.map(function (s) {
      return "<li>" + (s.tex ? '<div class="step-math">' + tex(s.tex) + "</div>" : "") +
        (s.text ? '<div class="step-text">' + s.text + "</div>" : "") +
        (s.why ? '<div class="why"><span>why:</span> ' + s.why + "</div>" : "") + "</li>";
    }).join("") + "</ol>";
  }

  /* ---------- diagram generators ---------- */
  function packetHtml(b) {
    var width = b.width || 32, rows = [], row = [], used = 0;
    (b.fields || []).forEach(function (f) {
      var left = f.bits, first = true;
      while (left > 0) {
        var take = Math.min(left, width - used);
        row.push({ name: f.name, bits: take, total: f.bits, note: f.note, cont: !first });
        used += take; left -= take; first = false;
        if (used === width) { rows.push(row); row = []; used = 0; }
      }
    });
    if (row.length) rows.push(row);
    var scale = '<div class="pkt-scale" style="grid-template-columns:repeat(' + width + ',1fr)">';
    for (var i = 0; i < width; i++) scale += "<span>" + (i % 4 === 0 || i === width - 1 ? i : "") + "</span>";
    scale += "</div>";
    var body = rows.map(function (r) {
      return '<div class="pkt-row" style="grid-template-columns:repeat(' + width + ',1fr)">' + r.map(function (c) {
        return '<div class="pkt-cell' + (c.cont ? " cont" : "") + '" style="grid-column:span ' + c.bits + '" title="' +
          esc(c.name + " — " + c.total + " bits" + (c.note ? " — " + c.note.replace(/<[^>]+>/g, "") : "")) + '">' +
          '<b>' + c.name + (c.cont ? " (cont.)" : "") + "</b><small>" + c.total + " b</small></div>";
      }).join("") + "</div>";
    }).join("");
    var notes = (b.fields || []).filter(function (f) { return f.note; }).map(function (f) {
      return "<tr><td><b>" + f.name + "</b></td><td>" + f.bits + "</td><td>" + f.note + "</td></tr>";
    }).join("");
    return '<figure class="packet"><figcaption class="ttl">' + (b.title || "") + '</figcaption><div class="pkt-wrap">' + scale + body + "</div>" +
      (notes ? '<details class="pkt-notes"><summary>Field notes</summary><table class="tbl"><tr><th>Field</th><th>Bits</th><th>Meaning / default</th></tr>' + notes + "</table></details>" : "") +
      (b.caption ? "<figcaption>" + b.caption + "</figcaption>" : "") + "</figure>";
  }

  function seqHtml(b) {
    var W = 640, lx = 150, rx = 490, top = 46, rowH = 46, ev = b.events || [];
    var H = top + ev.length * rowH + 30;
    var s = '<svg class="seq" viewBox="0 0 ' + W + " " + H + '" width="100%" role="img" aria-label="' + esc(b.caption || "sequence diagram") + '">';
    s += '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>';
    s += '<text x="' + lx + '" y="22" text-anchor="middle" class="seq-h">' + esc(b.left) + "</text>";
    s += '<text x="' + rx + '" y="22" text-anchor="middle" class="seq-h">' + esc(b.right) + "</text>";
    s += '<line x1="' + lx + '" y1="30" x2="' + lx + '" y2="' + (H - 8) + '" class="seq-life"/>';
    s += '<line x1="' + rx + '" y1="30" x2="' + rx + '" y2="' + (H - 8) + '" class="seq-life"/>';
    ev.forEach(function (e, i) {
      var y0 = top + i * rowH, y1 = y0 + rowH - 10;
      if (e.gap) {
        s += '<text x="' + (W / 2) + '" y="' + (y0 + 22) + '" text-anchor="middle" class="seq-gap">' + esc(e.note || e.label || "") + "</text>";
        return;
      }
      var fromL = e.from !== "R", x0 = fromL ? lx : rx, x1 = fromL ? rx : lx;
      if (e.lost) {
        var xm = x0 + (x1 - x0) * 0.6, ym = y0 + (y1 - y0) * 0.6;
        s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + xm + '" y2="' + ym + '" class="seq-arrow lost"/>';
        s += '<text x="' + xm + '" y="' + (ym + 5) + '" text-anchor="middle" class="seq-x">✗</text>';
      } else {
        s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + x1 + '" y2="' + y1 + '" class="seq-arrow" marker-end="url(#ah)"/>';
      }
      var mx = (lx + rx) / 2, my = (y0 + y1) / 2 - 6;
      s += '<text x="' + mx + '" y="' + my + '" text-anchor="middle" class="seq-lbl">' + esc(e.label) + "</text>";
      if (e.note) {
        var nx = fromL ? lx - 10 : rx + 10;
        s += '<text x="' + nx + '" y="' + (y0 + 4) + '" text-anchor="' + (fromL ? "end" : "start") + '" class="seq-note">' + esc(e.note) + "</text>";
      }
    });
    s += "</svg>";
    return '<figure class="fig">' + s + (b.caption ? "<figcaption>" + b.caption + "</figcaption>" : "") + "</figure>";
  }

  function chartHtml(b) {
    var W = 640, H = 300, pl = 52, pr = 16, pt = 28, pb = 44;
    var xs = b.x || [], all = [];
    (b.series || []).forEach(function (se) { all = all.concat(se.y); });
    (b.hlines || []).forEach(function (h) { all.push(h.y); });
    var ymax = Math.max.apply(null, all.concat([1])), ymin = 0;
    var nx = xs.length - 1 || 1;
    function X(i) { return pl + (W - pl - pr) * i / nx; }
    function Y(v) { return H - pb - (H - pt - pb) * (v - ymin) / (ymax - ymin || 1); }
    var s = '<svg class="chart" viewBox="0 0 ' + W + " " + H + '" width="100%" role="img" aria-label="' + esc(b.title || "chart") + '">';
    s += '<text x="' + (W / 2) + '" y="16" text-anchor="middle" class="ch-t">' + esc(b.title || "") + "</text>";
    s += '<line x1="' + pl + '" y1="' + (H - pb) + '" x2="' + (W - pr) + '" y2="' + (H - pb) + '" class="ch-ax"/>';
    s += '<line x1="' + pl + '" y1="' + pt + '" x2="' + pl + '" y2="' + (H - pb) + '" class="ch-ax"/>';
    var step = Math.max(1, Math.ceil(ymax / 8));
    for (var v = 0; v <= ymax; v += step) {
      s += '<line x1="' + pl + '" y1="' + Y(v) + '" x2="' + (W - pr) + '" y2="' + Y(v) + '" class="ch-grid"/>';
      s += '<text x="' + (pl - 6) + '" y="' + (Y(v) + 4) + '" text-anchor="end" class="ch-tk">' + v + "</text>";
    }
    var every = Math.max(1, Math.ceil(xs.length / 16));
    xs.forEach(function (x, i) {
      if (i % every === 0) s += '<text x="' + X(i) + '" y="' + (H - pb + 16) + '" text-anchor="middle" class="ch-tk">' + esc(x) + "</text>";
    });
    s += '<text x="' + (W / 2) + '" y="' + (H - 6) + '" text-anchor="middle" class="ch-lb">' + esc(b.xLabel || "") + "</text>";
    s += '<text x="14" y="' + (H / 2) + '" text-anchor="middle" class="ch-lb" transform="rotate(-90 14 ' + (H / 2) + ')">' + esc(b.yLabel || "") + "</text>";
    (b.hlines || []).forEach(function (h) {
      s += '<line x1="' + pl + '" y1="' + Y(h.y) + '" x2="' + (W - pr) + '" y2="' + Y(h.y) + '" class="ch-h"/>';
      s += '<text x="' + (W - pr - 4) + '" y="' + (Y(h.y) - 4) + '" text-anchor="end" class="ch-hl">' + esc(h.label) + "</text>";
    });
    (b.series || []).forEach(function (se, k) {
      var pts = se.y.map(function (v, i) { return X(i) + "," + Y(v); }).join(" ");
      s += '<polyline points="' + pts + '" class="ch-line c' + k + '"/>';
      se.y.forEach(function (v, i) { s += '<circle cx="' + X(i) + '" cy="' + Y(v) + '" r="3" class="ch-pt c' + k + '"><title>' + esc(se.name + ": " + xs[i] + " → " + v) + "</title></circle>"; });
    });
    (b.marks || []).forEach(function (m) {
      var i = xs.indexOf(m.x); if (i < 0) return;
      s += '<line x1="' + X(i) + '" y1="' + pt + '" x2="' + X(i) + '" y2="' + (H - pb) + '" class="ch-mark"/>';
      var right = X(i) > W * 0.7;
      s += '<text x="' + (X(i) + (right ? -4 : 4)) + '" y="' + (pt + 12) + '" text-anchor="' + (right ? "end" : "start") + '" class="ch-ml">' + esc(m.label) + "</text>";
    });
    s += "</svg>";
    var legend = (b.series || []).length > 1 ? '<div class="legend">' + b.series.map(function (se, k) { return '<span class="lg c' + k + '">' + esc(se.name) + "</span>"; }).join("") + "</div>" : "";
    return '<figure class="fig">' + s + legend + (b.caption ? "<figcaption>" + b.caption + "</figcaption>" : "") + "</figure>";
  }

  function tableHtml(b) {
    return '<figure class="fig"><div class="tbl-wrap"><table class="tbl"><thead><tr>' + (b.head || []).map(function (h) { return "<th>" + h + "</th>"; }).join("") +
      "</tr></thead><tbody>" + (b.rows || []).map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") +
      "</tbody></table></div>" + (b.caption ? "<figcaption>" + b.caption + "</figcaption>" : "") + "</figure>";
  }

  var CALLOUT = { key: "KEY CONCEPT", warning: "WARNING", takeaway: "TAKEAWAY", aws: "AWS", analogy: "ANALOGY", slidefix: "⚠ SLIDE CORRECTION", trace: "PROTOCOL TRACE", practice: "PRACTICE" };

  function blockHtml(b) {
    switch (b.type) {
      case "intuition": return '<div class="blk intuition"><div class="lbl">Core intuition' + (b.title ? " · " + b.title : "") + "</div>" + b.html + "</div>";
      case "text": return '<div class="blk text">' + b.html + "</div>";
      case "callout": return '<div class="blk callout k-' + b.kind + '"><div class="lbl">' + (CALLOUT[b.kind] || b.kind) + (b.title ? " · " + b.title : "") + "</div>" + b.html + "</div>";
      case "figure": return '<figure class="blk fig">' + b.html + (b.caption ? "<figcaption>" + b.caption + "</figcaption>" : "") + "</figure>";
      case "packet": return '<div class="blk">' + packetHtml(b) + "</div>";
      case "table": return '<div class="blk">' + tableHtml(b) + "</div>";
      case "seq": return '<div class="blk">' + seqHtml(b) + "</div>";
      case "chart": return '<div class="blk">' + chartHtml(b) + "</div>";
      case "derivation": return '<div class="blk derivation"><div class="lbl">Step-by-step derivation · ' + (b.title || "") + "</div>" + stepsHtml(b.steps) + "</div>";
      case "cheat": return '<div class="blk cheat"><div class="lbl">Cheat sheet' + (b.title ? " · " + b.title : "") + "</div><ul>" + b.items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul></div>";
      case "worked":
        return '<div class="blk worked"><div class="lbl">Worked problem · ' + esc(b.tag || "") + "</div><h4>" + (b.title || "") + "</h4>" + b.problem +
          '<p class="hint">Try it on paper first.</p><details class="reveal"><summary>Show full solution</summary>' + stepsHtml(b.steps) +
          '<div class="answer"><b>Answer:</b> ' + b.answer + "</div></details></div>";
      case "code":
        var src = CODE[b.file];
        return '<div class="blk code"><div class="lbl">' + (b.level === "low" ? "Code (i) · low-level / from scratch" : "Code (ii) · high-level / library") + " · " + esc(b.title || "") + '</div>' +
          (b.note ? "<p>" + b.note + "</p>" : "") +
          '<details><summary><code>cn-practice/' + esc(b.file) + "</code> — show source" + '</summary><div class="code-tools"><button class="btn sm copy" data-file="' + esc(b.file) + '">Copy</button> <span class="muted">Run: <code>python3 cn-practice/' + esc(b.file) + "</code></span></div>" +
          "<pre><code>" + esc(src || "(source missing — run tools/build_code.py)") + "</code></pre></details></div>";
      case "traps": return '<div class="blk traps"><div class="lbl">Exam traps & common fallacies</div><ul>' + b.items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul></div>";
      default: return '<div class="blk text"><em>Unknown block ' + esc(b.type) + "</em></div>";
    }
  }

  /* ---------- question engine ---------- */
  function normText(s) { return String(s || "").trim().toLowerCase().replace(/\s+/g, " ").replace(/\s*([,/:=])\s*/g, "$1"); }
  function parseNum(s) {
    var t = String(s || "").trim().replace(/,/g, "").replace(/\s+/g, "");
    if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t)) return NaN;
    return parseFloat(t);
  }
  function grade(q, given) {
    if (q.type === "mcq") return given === q.answer;
    if (q.type === "msq") {
      var a = (q.answer || []).slice().sort().join(","), g = (given || []).slice().sort().join(",");
      return a === g;
    }
    if (q.type === "num") { var v = parseNum(given); return !isNaN(v) && Math.abs(v - q.answer) <= (q.tol || 0) + 1e-9; }
    if (q.type === "text") {
      var opts = [q.answer].concat(q.accept || []).map(normText);
      return opts.indexOf(normText(given)) >= 0;
    }
    return null;
  }

  function solutionHtml(q) {
    var h = '<div class="solution">';
    if (q.type === "mcq" || q.type === "msq") {
      var ans = q.type === "mcq" ? [q.answer] : q.answer;
      h += '<p><b>Correct:</b> ' + ans.map(function (i) { return String.fromCharCode(65 + i); }).join(", ") + "</p>";
      if (q.why) h += '<ul class="whys">' + q.options.map(function (o, i) {
        var ok = ans.indexOf(i) >= 0;
        return '<li class="' + (ok ? "ok" : "no") + '"><b>' + String.fromCharCode(65 + i) + (ok ? " ✔" : " ✘") + "</b> " + (q.why[i] || "") + "</li>";
      }).join("") + "</ul>";
    } else if (q.type === "num") {
      h += '<p><b>Answer:</b> ' + q.answer + (q.unit ? " " + esc(q.unit) : "") + (q.tol ? ' <span class="muted">(accepted ±' + q.tol + ")</span>" : "") + "</p>";
    } else if (q.type === "text") {
      h += '<p><b>Answer:</b> <code>' + esc(q.answer) + "</code>" + (q.accept && q.accept.length ? ' <span class="muted">(also accepted: ' + q.accept.map(esc).join(", ") + ")</span>" : "") + "</p>";
    } else if (q.type === "write") {
      var src = CODE[q.solutionFile];
      h += "<p><b>Model solution</b> (<code>cn-practice/" + esc(q.solutionFile) + "</code>):</p><pre><code>" + esc(src || "") + "</code></pre>";
      if (q.rubric) h += '<p><b>Marking rubric</b></p><ul>' + q.rubric.map(function (r) { return "<li>" + r + "</li>"; }).join("") + "</ul>";
    }
    if (q.formula) h += '<div class="formula">' + tex(q.formula) + "</div>";
    if (q.steps) h += stepsHtml(q.steps);
    if (q.explain) h += '<div class="explain">' + q.explain + "</div>";
    return h + "</div>";
  }

  function tagHtml(q) {
    return '<span class="qtag">' + esc(q.tag || "") + "</span>" + (q.pyq ? ' <span class="qtag pyq">' + esc(q.pyq) + "</span>" : "") +
      ' <span class="qtype">' + ({ mcq: "MCQ", msq: "MSQ (one or more correct)", num: "Numerical", text: "Short answer", write: "Coding" }[q.type] || q.type) + "</span>";
  }

  function inputHtml(q, name) {
    if (q.type === "mcq" || q.type === "msq") {
      var t = q.type === "mcq" ? "radio" : "checkbox";
      return '<div class="opts">' + q.options.map(function (o, i) {
        return '<label class="opt"><input type="' + t + '" name="' + name + '" value="' + i + '"> <span class="ol">' + String.fromCharCode(65 + i) + ".</span> <span>" + o + "</span></label>";
      }).join("") + "</div>";
    }
    if (q.type === "num") return '<div class="ans-row"><input class="ans" type="text" inputmode="decimal" placeholder="number' + (q.unit ? " (" + esc(q.unit) + ")" : "") + '"> ' + (q.unit ? '<span class="muted">' + esc(q.unit) + "</span>" : "") + "</div>";
    if (q.type === "text") return '<div class="ans-row"><input class="ans wide" type="text" placeholder="your answer"></div>';
    if (q.type === "write") return '<textarea class="ans code-in" rows="10" spellcheck="false" placeholder="Write your Python here">' + esc(q.starter || "") + "</textarea>";
    return "";
  }
  function readGiven(q, node) {
    if (q.type === "mcq") { var c = $("input:checked", node); return c ? parseInt(c.value, 10) : null; }
    if (q.type === "msq") return $all("input:checked", node).map(function (c) { return parseInt(c.value, 10); });
    var a = $(".ans", node); return a ? a.value : "";
  }
  function questionShell(q, idx, mode) {
    return '<div class="q" id="q-' + esc(q.id) + '" data-qid="' + esc(q.id) + '"><div class="qhead"><span class="qno">Q' + idx + "</span> " + tagHtml(q) + (mode === "practice" ? statusDot(q.id) : "") + "</div>" +
      '<div class="qbody">' + q.q + "</div>" + (q.code ? '<pre class="qcode"><code>' + esc(q.code) + "</code></pre>" : "") +
      inputHtml(q, "n-" + q.id) + '<div class="qctl"></div><div class="qfb"></div><div class="qsol" hidden></div></div>';
  }
  function statusDot(id) {
    var a = state.answers[id];
    if (!a) return '<span class="dot"></span>';
    return '<span class="dot ' + (a.correct ? "ok" : "bad") + '" title="' + (a.correct ? "solved" : "attempted, wrong") + '"></span>';
  }

  /* practice mode: Check gives immediate feedback; Reveal shows the solution after an attempt */
  function mountPractice(q, node) {
    var ctl = $(".qctl", node), fb = $(".qfb", node), sol = $(".qsol", node);
    if (q.type === "write") {
      ctl.innerHTML = '<button class="btn reveal-btn">Reveal model solution</button>';
    } else {
      ctl.innerHTML = '<button class="btn check">Check</button> <button class="btn ghost reveal-btn">Reveal</button>';
    }
    var chk = $(".check", ctl);
    if (chk) chk.addEventListener("click", function () {
      var given = readGiven(q, node);
      if (given === null || given === "" || (Array.isArray(given) && !given.length)) { fb.innerHTML = '<span class="warn">Pick or type an answer first.</span>'; return; }
      var ok = grade(q, given);
      state.answers[q.id] = { correct: ok, ts: Date.now() }; save();
      fb.innerHTML = ok ? '<span class="good">✔ Correct</span>' : '<span class="bad">✘ Not quite — try again or press Reveal.</span>';
      if (ok) showSol();
      refreshDot();
    });
    $(".reveal-btn", ctl).addEventListener("click", function () {
      if (q.type !== "write" && !state.answers[q.id]) {
        var given = readGiven(q, node);
        var tried = !(given === null || given === "" || (Array.isArray(given) && !given.length));
        if (!tried) { fb.innerHTML = '<span class="warn">Attempt first — answer, press Check, then Reveal.</span>'; return; }
        state.answers[q.id] = { correct: grade(q, given), ts: Date.now() }; save(); refreshDot();
      }
      showSol();
      if (q.type === "write") {
        fb.innerHTML = '<span class="muted">Mark yourself:</span> <button class="btn sm self-ok">I got it</button> <button class="btn sm ghost self-no">I missed it</button>';
        $(".self-ok", fb).addEventListener("click", function () { state.answers[q.id] = { correct: true, ts: Date.now() }; save(); refreshDot(); fb.innerHTML = '<span class="good">Saved ✔</span>'; });
        $(".self-no", fb).addEventListener("click", function () { state.answers[q.id] = { correct: false, ts: Date.now() }; save(); refreshDot(); fb.innerHTML = '<span class="bad">Saved — revisit later</span>'; });
      }
    });
    function showSol() { if (sol.hidden) { sol.innerHTML = solutionHtml(q); sol.hidden = false; typeset(sol); } }
    function refreshDot() { var d = $(".qhead .dot", node); if (d) d.outerHTML = statusDot(q.id); }
  }

  /* ---------- views ---------- */
  var main;
  function setMain(html) { main.innerHTML = html; typeset(main); window.scrollTo(0, 0); }

  function unitProgress(u) {
    var qs = [], secs = u.sections || [];
    secs.forEach(function (s) { qs = qs.concat(s.practice || []); });
    var solved = qs.filter(function (q) { return state.answers[q.id] && state.answers[q.id].correct; }).length;
    var done = secs.filter(function (s) { return state.done[s.id]; }).length;
    return { total: qs.length, solved: solved, secs: secs.length, done: done };
  }

  function viewHome() {
    var us = unitList(), rows = us.map(function (u) {
      var p = unitProgress(u), pct = p.total ? Math.round(100 * p.solved / p.total) : 0;
      return '<tr><td><a href="#/unit/' + u.id + '">Unit ' + String(u.num).padStart(2, "0") + " · " + u.title + "</a></td><td>Day " + (u.day || "") + "</td><td>" + p.done + "/" + p.secs +
        '</td><td><div class="bar"><span style="width:' + pct + '%"></span></div> ' + p.solved + "/" + p.total + "</td></tr>";
    }).join("");
    var mk = Object.keys(MOCKS).map(function (k) {
      var m = MOCKS[k], at = (state.mocks[k] || {}).attempts || [];
      return "<li><a href='#/mock/" + k + "'>" + m.title + "</a> — " + (at.length ? "best " + Math.max.apply(null, at.map(function (a) { return a.pct; })) + "%" : "not attempted") + "</li>";
    }).join("");
    setMain('<h1>Computer Networks — Midsem Prep</h1><p class="lede">CSAI321 (Lectures 1–15). Every topic is taught for <b>MCQ</b>, <b>numerical</b> and <b>coding</b> questions. Questions are attempt-first: answer, then Check, then Reveal.</p>' +
      '<div class="cards"><a class="card" href="#/plan"><b>📅 7-Day Plan</b><span>1.5–2 h/day schedule</span></a><a class="card" href="#/formulas"><b>📄 Last-Night Sheet</b><span>All formulas, headers, ports</span></a>' +
      '<a class="card" href="#/drill/subnet"><b>🔢 Subnet & Numerical Drill</b><span>Instant feedback</span></a><a class="card" href="#/drill/header"><b>🧩 Protocol & Header Drill</b><span>Fields, flags, ports</span></a>' +
      '<a class="card" href="#/drill/socket"><b>🐍 Socket & Scripting Drill</b><span>Predict output, fix bugs</span></a><a class="card" href="#/progress"><b>📈 Progress</b><span>Weak-unit diagnosis</span></a></div>' +
      '<h2>Units</h2><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Unit</th><th>Plan</th><th>Sections done</th><th>Practice solved</th></tr></thead><tbody>' + rows + "</tbody></table></div>" +
      "<h2>Mock exams</h2><ul>" + mk + "</ul>" +
      '<p class="muted">Badges: ' + badgeHtml("class") + " " + badgeHtml("lab") + " " + badgeHtml("researched") + " " + badgeHtml("extra") + "</p>");
  }

  function viewUnit(id, secId) {
    var u = UNITS[id];
    if (!u) return setMain("<h1>Unit not found</h1>");
    var toc = (u.sections || []).map(function (s) {
      return '<li><a href="#/unit/' + u.id + "/" + s.id + '">' + s.title + "</a> " + (state.done[s.id] ? "✔" : "") + "</li>";
    }).join("");
    var html = '<div class="unit-head"><div class="crumb">Unit ' + String(u.num).padStart(2, "0") + " · Day " + (u.day || "") + " · " + esc(u.lectures || "") + "</div><h1>" + u.title + "</h1>" + (u.overview || "") +
      '<details class="toc" open><summary>Sections</summary><ol>' + toc + "</ol></details></div>";
    (u.sections || []).forEach(function (s) {
      html += '<section class="sec" id="sec-' + s.id + '"><div class="sec-head"><h2>' + s.title + "</h2>" + badgeHtml(s.badge) + ' <span class="src">Source: ' + esc(s.source || "") + "</span></div>";
      html += (s.blocks || []).map(blockHtml).join("");
      if (s.practice && s.practice.length) {
        html += '<div class="practice"><h3>Practice — ' + esc(s.title) + ' <span class="muted">(' + s.practice.length + " questions)</span></h3>";
        html += s.practice.map(function (q, i) { return questionShell(q, i + 1, "practice"); }).join("") + "</div>";
      }
      html += '<label class="done-chk"><input type="checkbox" data-sec="' + s.id + '"' + (state.done[s.id] ? " checked" : "") + "> Mark section as done</label></section>";
    });
    var us = unitList(), idx = us.indexOf(u);
    html += '<nav class="pager">' + (idx > 0 ? '<a href="#/unit/' + us[idx - 1].id + '">← Unit ' + us[idx - 1].num + "</a>" : "<span></span>") +
      (idx < us.length - 1 ? '<a href="#/unit/' + us[idx + 1].id + '">Unit ' + us[idx + 1].num + " →</a>" : "") + "</nav>";
    setMain(html);
    (u.sections || []).forEach(function (s) {
      (s.practice || []).forEach(function (q) { var n = document.getElementById("q-" + q.id); if (n) mountPractice(q, n); });
    });
    $all(".done-chk input", main).forEach(function (c) {
      c.addEventListener("change", function () { state.done[c.getAttribute("data-sec")] = c.checked; save(); });
    });
    if (secId) { var t = document.getElementById("sec-" + secId); if (t) t.scrollIntoView(); }
  }

  function viewDrill(id) {
    var d = DRILLS[id];
    if (!d) return setMain("<h1>Drill not found</h1>");
    var qs = d.questions || [];
    var solved = qs.filter(function (q) { return state.answers[q.id] && state.answers[q.id].correct; }).length;
    setMain("<h1>" + d.title + "</h1>" + (d.intro || "") + '<p class="muted">' + solved + "/" + qs.length + ' solved. <button class="btn sm ghost" id="shuffle">Shuffle order</button></p><div id="dq">' +
      qs.map(function (q, i) { return questionShell(q, i + 1, "practice"); }).join("") + "</div>");
    qs.forEach(function (q) { mountPractice(q, document.getElementById("q-" + q.id)); });
    $("#shuffle").addEventListener("click", function () {
      var box = $("#dq"), nodes = $all(".q", box);
      for (var i = nodes.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); box.appendChild(nodes[j]); nodes.splice(j, 1); }
    });
  }

  var timer = null;
  function viewMock(id) {
    if (timer) { clearInterval(timer); timer = null; }
    var m = MOCKS[id];
    if (!m) return setMain("<h1>Mock not found</h1>");
    var total = 0, count = 0;
    m.sections.forEach(function (s) { total += s.marks * s.questions.length; count += s.questions.length; });
    var at = (state.mocks[id] || {}).attempts || [];
    setMain("<h1>" + m.title + "</h1>" + (m.instructions || "") + '<p><b>' + count + " questions · " + total + " marks · " + m.minutes + " minutes.</b> Solutions stay hidden until you submit.</p>" +
      (at.length ? "<p>Previous attempts: " + at.map(function (a) { return a.pct + "% (" + new Date(a.ts).toLocaleDateString() + ")"; }).join(", ") + "</p>" : "") +
      '<button class="btn big" id="start">Start timer</button>');
    $("#start").addEventListener("click", function () { runMock(m); });
  }

  function runMock(m) {
    var n = 0, html = '<div class="mock-bar"><b>' + m.title + '</b><span id="clock"></span><button class="btn" id="submit">Submit</button></div>';
    m.sections.forEach(function (s) {
      html += '<h2>' + s.name + ' <span class="muted">(' + s.marks + " mark" + (s.marks > 1 ? "s" : "") + " each" + (s.negative ? ", −" + s.negative + " for wrong" : "") + ")</span></h2>";
      s.questions.forEach(function (q) { n++; html += questionShell(q, n, "mock"); });
    });
    html += '<button class="btn big" id="submit2">Submit exam</button>';
    setMain(html);
    var end = Date.now() + m.minutes * 60000, clock = $("#clock");
    function tick() {
      var left = Math.max(0, end - Date.now()), mm = Math.floor(left / 60000), ss = Math.floor(left % 60000 / 1000);
      clock.textContent = "⏱ " + mm + ":" + String(ss).padStart(2, "0");
      clock.className = left < 300000 ? "low" : "";
      if (left <= 0) { finish(true); }
    }
    timer = setInterval(tick, 1000); tick();
    var finished = false;
    function finish(auto) {
      if (finished) return;
      if (!auto && !confirm("Submit the exam now?")) return;
      finished = true; clearInterval(timer); timer = null;
      var score = 0, total = 0, byUnit = {}, bySec = [];
      m.sections.forEach(function (s) {
        var ss = { name: s.name, got: 0, of: 0 };
        s.questions.forEach(function (q) {
          var node = document.getElementById("q-" + q.id), given = readGiven(q, node), ok;
          var blank = given === null || given === "" || (Array.isArray(given) && !given.length);
          if (q.type === "write") ok = null; else ok = blank ? false : grade(q, given);
          var got = ok ? s.marks : (ok === false && !blank && s.negative ? -s.negative : 0);
          total += s.marks; ss.of += s.marks;
          var u = q.unit || "other"; byUnit[u] = byUnit[u] || { got: 0, of: 0, pending: 0 };
          if (q.type === "write") { byUnit[u].pending += s.marks; }
          else { score += got; ss.got += got; byUnit[u].got += Math.max(0, got); byUnit[u].of += s.marks; }
          var fb = $(".qfb", node), sol = $(".qsol", node);
          fb.innerHTML = q.type === "write" ? '<span class="muted">Self-mark against the model solution below.</span>' :
            blank ? '<span class="warn">Not attempted</span>' : ok ? '<span class="good">✔ Correct (+' + s.marks + ")</span>" : '<span class="bad">✘ Wrong' + (s.negative ? " (−" + s.negative + ")" : "") + "</span>";
          sol.innerHTML = solutionHtml(q); sol.hidden = false;
          $all("input,textarea", node).forEach(function (i) { i.disabled = true; });
        });
        bySec.push(ss);
      });
      var gradable = total - m.sections.filter(function (s) { return s.questions.some(function (q) { return q.type === "write"; }); })
        .reduce(function (a, s) { return a + s.marks * s.questions.filter(function (q) { return q.type === "write"; }).length; }, 0);
      var pct = gradable ? Math.round(100 * score / gradable) : 0;
      var rec = state.mocks[m.id] = state.mocks[m.id] || { attempts: [] };
      rec.attempts.push({ ts: Date.now(), score: score, of: gradable, pct: pct, byUnit: byUnit }); save();
      var rows = Object.keys(byUnit).sort().map(function (u) {
        var b = byUnit[u], p = b.of ? Math.round(100 * b.got / b.of) : null, U = UNITS[u];
        var verdict = p === null ? "coding only — self-mark" : p >= 75 ? '<span class="good">strong</span>' : p >= 50 ? '<span class="warn">revise</span>' : '<span class="bad">weak — redo unit practice</span>';
        return "<tr><td>" + (U ? '<a href="#/unit/' + u + '">Unit ' + U.num + " · " + U.title + "</a>" : u) + "</td><td>" + b.got + "/" + b.of + (b.pending ? " (+" + b.pending + " coding)" : "") + "</td><td>" + (p === null ? "—" : p + "%") + "</td><td>" + verdict + "</td></tr>";
      }).join("");
      var report = '<div class="report"><h2>Score report</h2><p class="big-score">' + score + " / " + gradable + " (" + pct + '%)</p><p class="muted">Section C coding questions (' + (total - gradable) + " marks) are self-marked using the model solutions.</p>" +
        '<table class="tbl"><tr><th>Section</th><th>Score</th></tr>' + bySec.map(function (s) { return "<tr><td>" + s.name + "</td><td>" + s.got + "/" + s.of + "</td></tr>"; }).join("") + "</table>" +
        '<h3>Unit-by-unit weakness diagnosis</h3><table class="tbl"><tr><th>Unit</th><th>Marks</th><th>%</th><th>Verdict</th></tr>' + rows + "</table><p>Full solutions are now shown under every question.</p></div>";
      $(".mock-bar").insertAdjacentHTML("afterend", report);
      $("#submit").disabled = true; var s2 = $("#submit2"); if (s2) s2.remove();
      typeset(main); window.scrollTo(0, 0);
    }
    $("#submit").addEventListener("click", function () { finish(false); });
    $("#submit2").addEventListener("click", function () { finish(false); });
  }

  function viewPlan() {
    var p = EXTRAS.plan;
    if (!p) return setMain("<h1>Study plan missing</h1>");
    var html = "<h1>" + p.title + "</h1>" + (p.intro || "");
    p.days.forEach(function (d) {
      var key = "plan-day-" + d.day;
      html += '<section class="sec day"><div class="sec-head"><h2>Day ' + d.day + " · " + d.title + '</h2><span class="src">' + (d.minutes || "") + " min</span></div>" +
        (d.units && d.units.length ? "<p>Units: " + d.units.map(function (u) { return UNITS[u] ? '<a href="#/unit/' + u + '">Unit ' + UNITS[u].num + " · " + UNITS[u].title + "</a>" : u; }).join(" · ") + "</p>" : "") +
        '<ol class="tasks">' + d.tasks.map(function (t, i) { var k = key + "-" + i; return '<li><label><input type="checkbox" data-k="' + k + '"' + (state.done[k] ? " checked" : "") + "> " + t + "</label></li>"; }).join("") + "</ol>" +
        (d.checkpoint ? '<div class="blk callout k-takeaway"><div class="lbl">End-of-day checkpoint</div>' + d.checkpoint + "</div>" : "") + "</section>";
    });
    setMain(html);
    $all(".tasks input", main).forEach(function (c) { c.addEventListener("change", function () { state.done[c.getAttribute("data-k")] = c.checked; save(); }); });
  }

  function viewFormulas() {
    var f = EXTRAS.formulas;
    if (!f) return setMain("<h1>Formula sheet missing</h1>");
    var html = "<h1>" + f.title + '</h1><p class="muted"><button class="btn sm ghost" onclick="window.print()">Print</button></p>';
    html += '<details class="toc" open><summary>Contents</summary><ol>' + f.sections.map(function (s, i) { return '<li><a href="#/formulas/' + i + '">' + s.title + "</a></li>"; }).join("") + "</ol></details>";
    f.sections.forEach(function (s, i) { html += '<section class="sec" id="fs-' + i + '"><h2>' + s.title + "</h2>" + s.blocks.map(blockHtml).join("") + "</section>"; });
    setMain(html);
  }

  function viewProgress() {
    var us = unitList(), rows = us.map(function (u) {
      var p = unitProgress(u), att = 0, wrong = 0;
      (u.sections || []).forEach(function (s) { (s.practice || []).forEach(function (q) { var a = state.answers[q.id]; if (a) { att++; if (!a.correct) wrong++; } }); });
      var acc = att ? Math.round(100 * (att - wrong) / att) : null;
      var verdict = acc === null ? '<span class="muted">not started</span>' : acc >= 75 ? '<span class="good">strong</span>' : acc >= 50 ? '<span class="warn">revise</span>' : '<span class="bad">weak</span>';
      return '<tr><td><a href="#/unit/' + u.id + '">Unit ' + u.num + " · " + u.title + "</a></td><td>" + att + "/" + p.total + "</td><td>" + (acc === null ? "—" : acc + "%") + "</td><td>" + verdict + "</td></tr>";
    }).join("");
    var mk = Object.keys(MOCKS).map(function (k) {
      var at = (state.mocks[k] || {}).attempts || [];
      return "<li>" + MOCKS[k].title + ": " + (at.length ? at.map(function (a) { return a.pct + "%"; }).join(" → ") : "not attempted") + "</li>";
    }).join("");
    setMain('<h1>Progress</h1><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Unit</th><th>Attempted</th><th>Accuracy</th><th>Diagnosis</th></tr></thead><tbody>' + rows + "</tbody></table></div><h2>Mocks</h2><ul>" + mk + "</ul>" +
      '<p><button class="btn ghost" id="export">Export progress</button> <button class="btn ghost" id="reset">Reset all progress</button></p><textarea id="dump" rows="4" hidden></textarea>');
    $("#reset").addEventListener("click", function () { if (confirm("Erase all saved answers, ticks and mock scores?")) { state = { answers: {}, done: {}, mocks: {} }; save(); viewProgress(); } });
    $("#export").addEventListener("click", function () { var t = $("#dump"); t.hidden = false; t.value = JSON.stringify(state); t.select(); });
  }

  /* ---------- shell ---------- */
  function sidebar() {
    var us = unitList();
    var h = '<a class="brand" href="#/">CN Midsem Prep</a><nav>' +
      '<a href="#/plan">📅 Study Plan</a>' +
      '<div class="nav-h">Units</div>' + us.map(function (u) { return '<a href="#/unit/' + u.id + '" data-u="' + u.id + '"><span class="un">' + String(u.num).padStart(2, "0") + "</span> " + u.title + "</a>"; }).join("") +
      '<div class="nav-h">Drills</div>' + Object.keys(DRILLS).map(function (k) { return '<a href="#/drill/' + k + '">' + DRILLS[k].title + "</a>"; }).join("") +
      '<div class="nav-h">Mock exams</div>' + Object.keys(MOCKS).map(function (k) { return '<a href="#/mock/' + k + '">' + MOCKS[k].title + "</a>"; }).join("") +
      '<div class="nav-h">Revision</div><a href="#/formulas">📄 Last-Night Formula Sheet</a><a href="#/progress">📈 Progress tracker</a></nav>' +
      '<button class="btn sm ghost" id="theme">Toggle theme</button>';
    $("#side").innerHTML = h;
    $("#theme").addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      var nxt = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", nxt); state.theme = nxt; save();
    });
  }

  function route() {
    if (timer && !/^#\/mock\//.test(location.hash)) { clearInterval(timer); timer = null; }
    var h = (location.hash || "#/").slice(2).split("/");
    $all("#side nav a").forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#/" + h.slice(0, 2).join("/")); });
    document.body.classList.remove("nav-open");
    if (h[0] === "unit") return viewUnit(h[1], h[2]);
    if (h[0] === "drill") return viewDrill(h[1]);
    if (h[0] === "mock") return viewMock(h[1]);
    if (h[0] === "plan") return viewPlan();
    if (h[0] === "formulas") { viewFormulas(); if (h[1]) { var t = document.getElementById("fs-" + h[1]); if (t) t.scrollIntoView(); } return; }
    if (h[0] === "progress") return viewProgress();
    viewHome();
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".copy");
    if (b) {
      var src = CODE[b.getAttribute("data-file")] || "";
      if (navigator.clipboard) navigator.clipboard.writeText(src).then(function () { b.textContent = "Copied"; });
      else { var t = document.createElement("textarea"); t.value = src; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); b.textContent = "Copied"; }
    }
    if (e.target.id === "menu") document.body.classList.toggle("nav-open");
  });

  document.addEventListener("DOMContentLoaded", function () {
    if (state.theme) document.documentElement.setAttribute("data-theme", state.theme);
    main = $("#main");
    sidebar();
    window.addEventListener("hashchange", route);
    route();
  });

  /* exposed for the verifier / debugging */
  window.CNAPP = { grade: grade, parseNum: parseNum, normText: normText, blockHtml: blockHtml };
})();
