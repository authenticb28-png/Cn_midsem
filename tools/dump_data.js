// Load every data/*.js file the way the browser does and print window.* as JSON.
// Usage: node tools/dump_data.js [extra files...]
const fs = require("fs"), path = require("path"), vm = require("vm");
const dir = path.join(__dirname, "..", "cn-exam-prep", "data");
const files = fs.readdirSync(dir).filter(f => f.endsWith(".js") && f !== "code.js").sort()
  .map(f => path.join(dir, f)).concat(process.argv.slice(2));
const ctx = { window: {} }; vm.createContext(ctx);
const errors = [];
for (const f of files) {
  try { vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { filename: f }); }
  catch (e) { errors.push(path.basename(f) + ": " + e.message); }
}
const w = ctx.window;
process.stdout.write(JSON.stringify({ errors, UNITS: w.UNITS || {}, MOCKS: w.MOCKS || {}, DRILLS: w.DRILLS || {}, EXTRAS: w.EXTRAS || {} }));
