#!/usr/bin/env node
// Où partent les jetons : somme l'usage par session Claude Code à partir des transcripts locaux.
// Usage : node docs/regie/tokens.js [heures=36]
// Lit ~/.claude/sessions/*.json (noms) et ~/.claude/projects/*/*.jsonl (usage par message).
// Le coût réel est dominé par cacheRead : chaque appel relit tout le contexte de la session.
const fs = require('fs');
const path = require('path');
const os = require('os');

const hours = Number(process.argv[2] || 36);
const root = path.join(os.homedir(), '.claude');
const names = {};
for (const f of fs.readdirSync(path.join(root, 'sessions'))) {
  try {
    const s = JSON.parse(fs.readFileSync(path.join(root, 'sessions', f), 'utf8'));
    names[s.sessionId] = s.name || f;
  } catch {}
}
const rows = [];
for (const proj of fs.readdirSync(path.join(root, 'projects'))) {
  const dir = path.join(root, 'projects', proj);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.jsonl'))) {
    const p = path.join(dir, f);
    if (Date.now() - fs.statSync(p).mtimeMs > hours * 3600e3) continue;
    let inp = 0, cr = 0, cw = 0, out = 0, n = 0, model = '';
    for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
      if (!line) continue;
      let j;
      try { j = JSON.parse(line); } catch { continue; }
      const u = j.message && j.message.usage;
      if (!u) continue;
      n++;
      inp += u.input_tokens || 0;
      cr += u.cache_read_input_tokens || 0;
      cw += u.cache_creation_input_tokens || 0;
      out += u.output_tokens || 0;
      if (j.message.model) model = j.message.model;
    }
    if (n) rows.push({
      session: names[f.replace('.jsonl', '')] || f.slice(0, 8),
      model: model.replace('claude-', ''),
      calls: n,
      cacheRead_M: +(cr / 1e6).toFixed(1),
      cacheWrite_k: Math.round(cw / 1e3),
      input_k: Math.round(inp / 1e3),
      output_k: Math.round(out / 1e3),
      // approximation du contexte moyen relu à chaque appel
      ctx_k_par_appel: Math.round(cr / n / 1e3),
    });
  }
}
rows.sort((a, b) => b.cacheRead_M - a.cacheRead_M);
console.table(rows);
const t = rows.reduce((a, r) => ({ cr: a.cr + r.cacheRead_M, cw: a.cw + r.cacheWrite_k, out: a.out + r.output_k, calls: a.calls + r.calls }), { cr: 0, cw: 0, out: 0, calls: 0 });
console.log(`TOTAL cacheRead ${t.cr.toFixed(1)} M | cacheWrite ${t.cw} k | output ${t.out} k | calls ${t.calls}`);
