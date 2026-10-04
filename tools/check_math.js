// Render every LaTeX fragment in the data with KaTeX (throwOnError) and print failures as JSON.
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const katex = require(path.join(root, "cn-exam-prep", "vendor", "katex", "katex.min.js"));
const data = JSON.parse(fs.readFileSync(0, "utf8"));
const bad = [];
function tryTex(t, where) {
  try { katex.renderToString(t, { throwOnError: true, displayMode: true }); }
  catch (e) { bad.push({ where, tex: t.slice(0, 120), err: String(e.message).slice(0, 160) }); }
}
function scanHtml(s, where) {
  // same delimiters as the site: $$..$$ (display) then $..$ (inline)
  let rest = s.replace(/\$\$([\s\S]+?)\$\$/g, (m, t) => { tryTex(t, where); return " "; });
  const re = /\$([^$]+?)\$/g; let m;
  while ((m = re.exec(rest))) tryTex(m[1], where);
  if ((rest.match(/\$/g) || []).length % 2 === 1) bad.push({ where, tex: "", err: "unbalanced $ delimiter" });
}
function walk(o, where, key) {
  if (typeof o === "string") {
    if (key === "tex" || key === "formula") tryTex(o, where);
    else if (key !== "code" && key !== "starter") scanHtml(o, where);
  } else if (Array.isArray(o)) o.forEach((v, i) => walk(v, where, key));
  else if (o && typeof o === "object") {
    const w = o.id ? where + "/" + o.id : where;
    for (const k of Object.keys(o)) walk(o[k], w, k);
  }
}
for (const top of ["UNITS", "MOCKS", "DRILLS", "EXTRAS"]) walk(data[top], top, "");
process.stdout.write(JSON.stringify(bad));
