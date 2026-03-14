import { useState, useRef, useEffect, useCallback } from "react";

/* ── THEME ─────────────────────────────────────────────────── */
const T = {
  dark: { bg:"#03080a", sidebar:"#060f12", surface:"#091318", surface2:"#0d1c22", border:"#14303a", text:"#d0f0e0", muted:"#3d6a78", accent:"#4ade80", accentBg:"#4ade8010", accentBorder:"#4ade8035", danger:"#f87171", warn:"#fbbf24", info:"#38bdf8", purple:"#c084fc", orange:"#fb923c", lime:"#a3e635", teal:"#2dd4bf" },
  light: { bg:"#f0fbf4", sidebar:"#ffffff", surface:"#ffffff", surface2:"#e4f7ec", border:"#b8e4ca", text:"#041208", muted:"#2d6045", accent:"#16a34a", accentBg:"#16a34a10", accentBorder:"#16a34a35", danger:"#dc2626", warn:"#d97706", info:"#0284c7", purple:"#7c3aed", orange:"#ea580c", lime:"#65a30d", teal:"#0d9488" },
};

/* ── SHARED ─────────────────────────────────────────────────── */
function CopyBtn({ code }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(code); setOk(true); setTimeout(() => setOk(false), 2000); }}
      style={{ position:"absolute", top:10, right:10, background:ok?"#4ade8022":"#ffffff0e", border:`1px solid ${ok?"#4ade8066":"#ffffff18"}`, color:ok?"#4ade80":"#3d6a78", borderRadius:6, padding:"3px 10px", fontSize:"0.72rem", cursor:"pointer", fontFamily:"monospace", transition:"all .2s" }}>
      {ok ? "✓ copied" : "copy"}
    </button>
  );
}

function Code({ code, t }) {
  const lines = code.trim().split("\n");
  const col = (l) => {
    const tr = l.trim();
    if (tr.startsWith("//") || tr.startsWith("#") || tr.startsWith("/*") || tr.startsWith("*")) return "#2d5a40";
    if (/\b(require|import|export|from|module\.exports|exports)\b/.test(l)) return "#4ade80";
    if (/\b(const|let|var|function|async|await|return|class|new|typeof|instanceof|if|else|try|catch|throw)\b/.test(l)) return "#c084fc";
    if (/\b(app\.|router\.|server\.|db\.|mongoose\.|express\(|http\.|fs\.|path\.|process\.|EventEmitter)\b/.test(l)) return "#38bdf8";
    if (/\b(res\.|req\.|next\b|err\b)/.test(l)) return "#fbbf24";
    if (/"[^"]*"|'[^']*'|`[^`]*`/.test(l)) return "#86efac";
    if (/\b(true|false|null|undefined|\d+)\b/.test(l)) return "#fb923c";
    return "#b0d8c8";
  };
  return (
    <div style={{ position:"relative", borderRadius:12, overflow:"hidden", border:"1px solid #14303a" }}>
      <div style={{ background:"#020608", padding:"14px 16px", overflowX:"auto" }}>
        <pre style={{ margin:0, fontFamily:"'Fira Code','Cascadia Code',monospace", fontSize:"0.78rem", lineHeight:1.8 }}>
          {lines.map((line, i) => (
            <div key={i} style={{ display:"flex", gap:16 }}>
              <span style={{ color:"#14303a", userSelect:"none", minWidth:20, textAlign:"right", flexShrink:0 }}>{i+1}</span>
              <span style={{ color:col(line) }}>{line || " "}</span>
            </div>
          ))}
        </pre>
      </div>
      <CopyBtn code={code} />
    </div>
  );
}

function Tip({ text, t }) {
  return (
    <div style={{ background:`${t.warn}18`, border:`1px solid ${t.warn}45`, borderRadius:10, padding:"12px 16px", display:"flex", gap:10 }}>
      <span>💡</span>
      <p style={{ margin:0, fontSize:"0.85rem", color:t.text, lineHeight:1.65 }}>
        <strong style={{ color:t.warn }}>Pro tip: </strong>{text}
      </p>
    </div>
  );
}

function SLabel({ children, color }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
      <div style={{ width:3, height:18, background:color||"#4ade80", borderRadius:99 }} />
      <span style={{ fontSize:"0.72rem", fontWeight:700, color:"#3d6a78", textTransform:"uppercase", letterSpacing:"0.07em" }}>{children}</span>
    </div>
  );
}

function Badge({ label, color }) {
  return <span style={{ background:`${color}20`, border:`1px solid ${color}50`, color, borderRadius:5, padding:"2px 8px", fontSize:"0.72rem", fontWeight:700, fontFamily:"monospace", marginRight:4, marginBottom:4, display:"inline-block" }}>{label}</span>;
}

/* ══════════════════════════════════════════════════════════════
   DEMO 1 — What is Node.js + Event Loop
══════════════════════════════════════════════════════════════ */
function IntroDemo({ t }) {
  const [view, setView] = useState("loop");
  const [loopStep, setLoopStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  const loopSteps = [
    { label:"Call Stack",      color:"#4ade80",  desc:"JS code executes here — synchronous, one at a time. When a function is called it's pushed; when it returns it's popped.", icon:"📥" },
    { label:"Node APIs",       color:"#38bdf8",  desc:"When async work is requested (fs.readFile, setTimeout, HTTP request), it's handed off to libuv/OS and the call stack is freed.", icon:"⚙️" },
    { label:"Callback Queue",  color:"#fbbf24",  desc:"When async work completes, its callback is placed in the queue waiting to be executed.", icon:"📋" },
    { label:"Event Loop",      color:"#c084fc",  desc:"Constantly checks: is the call stack empty? If yes → moves the next callback from the queue to the call stack.", icon:"🔄" },
    { label:"Microtask Queue", color:"#f472b6",  desc:"Promises and queueMicrotask() run here — BEFORE the callback queue. Higher priority than callbacks.", icon:"⚡" },
    { label:"Output",          color:"#a3e635",  desc:"Result is returned to the user. Meanwhile the event loop keeps spinning, ready for the next request.", icon:"✅" },
  ];

  const runAnimation = () => {
    if(running) return;
    setRunning(true); setLoopStep(-1);
    let i = 0;
    timerRef.current = setInterval(() => {
      if(i >= loopSteps.length) { clearInterval(timerRef.current); setRunning(false); setLoopStep(-1); return; }
      setLoopStep(i++);
    }, 800);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const comparisons = [
    { label:"Traditional (PHP/Ruby/Python)", model:"Thread per request", desc:"Each request gets its own OS thread. Threads are heavy (~2MB RAM each). 1000 concurrent users = 2GB just for threads.", color:t.danger, icon:"🐢" },
    { label:"Node.js", model:"Single thread + Event Loop", desc:"One thread handles all requests via async I/O. No waiting — while one request awaits a DB query, thousands of others are served.", color:t.accent, icon:"⚡" },
  ];

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Node.js architecture — Event Loop & concurrency model</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["🔄 Event Loop","loop"],["⚔️ vs Threads","compare"]].map(([l,v]) => (
          <button key={v} onClick={() => setView(v)} style={{ background:view===v?t.accentBg:t.surface, color:view===v?t.accent:t.muted, border:`1px solid ${view===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>
      {view === "loop" ? (
        <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 200px" }}>
            <button onClick={runAnimation} disabled={running} style={{ width:"100%", background:running?t.surface:`linear-gradient(135deg,${t.accent},#15803d)`, border:"none", borderRadius:8, padding:"10px", color:running?t.muted:"#000", fontWeight:800, cursor:running?"not-allowed":"pointer", fontSize:"0.85rem", marginBottom:12 }}>
              {running ? "⏳ Running…" : "▶ Animate Event Loop"}
            </button>
            {loopSteps.map((step, i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"8px 10px", borderRadius:8, background:loopStep===i?step.color+"25":loopStep>i?"#4ade8010":"transparent", border:`1px solid ${loopStep===i?step.color+"70":loopStep>i?"#4ade8020":"transparent"}`, marginBottom:4, transition:"all .4s" }}>
                <span style={{ fontSize:"1rem", flexShrink:0 }}>{step.icon}</span>
                <div>
                  <div style={{ color:loopStep>=i?step.color:t.muted, fontWeight:700, fontSize:"0.8rem" }}>{step.label}</div>
                  {loopStep===i && <div style={{ color:t.muted, fontSize:"0.72rem", marginTop:3, lineHeight:1.5 }}>{step.desc}</div>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ flex:"1 1 220px" }}>
            <pre style={{ margin:0, background:"#020608", border:`1px solid ${t.border}`, borderRadius:10, padding:"12px 14px", fontFamily:"monospace", fontSize:"0.74rem", color:"#b0d8c8", lineHeight:1.8 }}>
{`// This demonstrates the event loop order:

console.log('1 — sync (call stack)');

setTimeout(() => {
  console.log('4 — callback queue (macro)');
}, 0);

Promise.resolve().then(() => {
  console.log('3 — microtask queue');
});

console.log('2 — sync (call stack)');

// Output ORDER:
// 1 — sync (call stack)
// 2 — sync (call stack)
// 3 — microtask queue   ← runs first!
// 4 — callback queue    ← runs after microtasks

// Microtasks (Promises) always run
// before macro-tasks (setTimeout/setInterval)`}
            </pre>
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {comparisons.map((c, i) => (
            <div key={i} style={{ flex:"1 1 220px", background:`${c.color}10`, border:`1px solid ${c.color}35`, borderRadius:10, padding:"14px 16px" }}>
              <div style={{ fontSize:"1.5rem", marginBottom:6 }}>{c.icon}</div>
              <div style={{ color:c.color, fontWeight:800, fontSize:"0.88rem", marginBottom:4 }}>{c.label}</div>
              <div style={{ background:`${c.color}20`, border:`1px solid ${c.color}40`, borderRadius:6, padding:"4px 10px", marginBottom:8, display:"inline-block" }}>
                <code style={{ color:c.color, fontSize:"0.75rem", fontWeight:700 }}>{c.model}</code>
              </div>
              <div style={{ color:t.muted, fontSize:"0.78rem", lineHeight:1.65 }}>{c.desc}</div>
            </div>
          ))}
          <div style={{ width:"100%", display:"flex", gap:8, flexWrap:"wrap" }}>
            {[["Built on V8","Chrome's JS engine","#4ade80"],["libuv","Async I/O library","#38bdf8"],["Non-blocking","I/O never waits","#c084fc"],["Single-threaded","But scales via cluster","#fbbf24"],["NPM ecosystem","2M+ packages","#fb923c"]].map(([h,d,c]) => (
              <div key={h} style={{ flex:"1 1 100px", background:`${c}12`, border:`1px solid ${c}30`, borderRadius:8, padding:"8px 10px" }}>
                <div style={{ color:c, fontWeight:700, fontSize:"0.78rem" }}>{h}</div>
                <div style={{ color:t.muted, fontSize:"0.7rem" }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 2 — Modules: CommonJS vs ES Modules
══════════════════════════════════════════════════════════════ */
function ModulesDemo({ t }) {
  const [sys, setSys] = useState("cjs");
  const [tab, setTab] = useState("export");
  const modules = {
    cjs: {
      label:"CommonJS (require)", color:"#38bdf8",
      export: `// math.js — CommonJS
function add(a, b) { return a + b; }
function multiply(a, b) { return a * b; }
const PI = 3.14159;

// Named exports
module.exports = { add, multiply, PI };

// Or export one at a time
module.exports.subtract = (a, b) => a - b;

// Default export pattern
module.exports = function greet(name) {
  return \`Hello, \${name}!\`;
};`,
      import: `// app.js — importing CommonJS modules

// Destructured named imports
const { add, multiply, PI } = require('./math');

// Whole module object
const math = require('./math');
math.add(2, 3);

// Built-in modules
const fs      = require('fs');
const path    = require('path');
const http    = require('http');
const os      = require('os');
const crypto  = require('crypto');
const events  = require('events');

// npm packages
const express = require('express');
const axios   = require('axios');`,
      note:"require() is synchronous. Module is cached after first load — require('./math') twice returns the same object.",
    },
    esm: {
      label:"ES Modules (import)", color:"#4ade80",
      export: `// math.mjs — ES Modules
// (or .js with "type":"module" in package.json)

// Named exports
export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; }
export const PI = 3.14159;

// Default export
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Re-export from another module
export { something } from './other.js';
export * from './utils.js';`,
      import: `// app.mjs — ES Module imports

// Named imports
import { add, multiply, PI } from './math.mjs';

// Default import
import greet from './math.mjs';

// Both
import greet, { add, PI } from './math.mjs';

// Rename with 'as'
import { add as sum } from './math.mjs';

// Dynamic import (async, code-splitting)
const { add } = await import('./math.mjs');

// Import built-ins (Node 12+)
import { readFile } from 'node:fs/promises';
import path from 'node:path';`,
      note:"ES Modules are the future standard. Use 'type': 'module' in package.json. Top-level await supported. __dirname and __filename not available (use import.meta.url instead).",
    },
  };
  const mod = modules[sys];
  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Modules — CommonJS vs ES Modules</p>
      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
        {[["CommonJS (CJS)","cjs"],["ES Modules (ESM)","esm"]].map(([l,v]) => (
          <button key={v} onClick={() => setSys(v)} style={{ background:sys===v?modules[v].color+"30":t.surface, color:modules[v].color, border:`2px solid ${sys===v?modules[v].color:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        {[["Exporting","export"],["Importing","import"]].map(([l,v]) => (
          <button key={v} onClick={() => setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:7, padding:"5px 12px", cursor:"pointer", fontWeight:700, fontSize:"0.8rem" }}>{l}</button>
        ))}
      </div>
      <div style={{ position:"relative", borderRadius:12, overflow:"hidden", border:`1px solid ${mod.color}40`, marginBottom:12 }}>
        <div style={{ background:"#020608", padding:"12px 14px", overflowX:"auto" }}>
          <pre style={{ margin:0, fontFamily:"monospace", fontSize:"0.76rem", color:mod.color, lineHeight:1.8 }}>{mod[tab]}</pre>
        </div>
        <CopyBtn code={mod[tab]} />
      </div>
      <div style={{ background:`${mod.color}12`, border:`1px solid ${mod.color}35`, borderRadius:8, padding:"8px 12px" }}>
        <span style={{ color:mod.color, fontWeight:700, fontSize:"0.77rem" }}>📝 Note: </span>
        <span style={{ color:t.muted, fontSize:"0.77rem" }}>{mod.note}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 3 — npm & package.json
══════════════════════════════════════════════════════════════ */
function NpmDemo({ t }) {
  const [tab, setTab] = useState("pkg");
  const [semver, setSemver] = useState({ major:2, minor:4, patch:1 });
  const [prefix, setPrefix] = useState("^");
  const bumpMajor = () => setSemver(s => ({ major:s.major+1, minor:0, patch:0 }));
  const bumpMinor = () => setSemver(s => ({ ...s, minor:s.minor+1, patch:0 }));
  const bumpPatch = () => setSemver(s => ({ ...s, patch:s.patch+1 }));

  const semverExamples = [
    { prefix:"",   desc:"Exact version only",            ex:`${semver.major}.${semver.minor}.${semver.patch}` },
    { prefix:"^",  desc:"Allow minor + patch updates",   ex:`${semver.major}.x.x (up to ${semver.major+1}.0.0)` },
    { prefix:"~",  desc:"Allow patch updates only",      ex:`${semver.major}.${semver.minor}.x` },
    { prefix:">=", desc:"Version or higher",             ex:`≥ ${semver.major}.${semver.minor}.${semver.patch}` },
    { prefix:"*",  desc:"Any version (dangerous!)",      ex:"any" },
  ];

  const scripts = [
    { name:"start",    cmd:"node server.js",                 desc:"npm start — production server" },
    { name:"dev",      cmd:"nodemon server.js",              desc:"npm run dev — auto-restart on change" },
    { name:"test",     cmd:"jest --coverage",                desc:"npm test — run test suite" },
    { name:"build",    cmd:"tsc && node build/index.js",     desc:"npm run build — TypeScript compile" },
    { name:"lint",     cmd:"eslint src/**/*.js",             desc:"npm run lint — check code style" },
    { name:"migrate",  cmd:"node scripts/migrate.js",        desc:"npm run migrate — DB migrations" },
  ];

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>npm & package.json — dependency management</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["📦 package.json","pkg"],["🔢 Semver","semver"],["🚀 Scripts","scripts"]].map(([l,v]) => (
          <button key={v} onClick={() => setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>
      {tab === "pkg" && (
        <div style={{ position:"relative", borderRadius:12, overflow:"hidden", border:`1px solid ${t.border}` }}>
          <div style={{ background:"#020608", padding:"14px 16px", overflowX:"auto" }}>
            <pre style={{ margin:0, fontFamily:"monospace", fontSize:"0.76rem", lineHeight:1.8 }}>
              {`{
  `}<span style={{ color:"#38bdf8" }}>"name"</span>{`: `}<span style={{ color:"#86efac" }}>"my-api"</span>{`,
  `}<span style={{ color:"#38bdf8" }}>"version"</span>{`: `}<span style={{ color:"#86efac" }}>"1.0.0"</span>{`,
  `}<span style={{ color:"#38bdf8" }}>"description"</span>{`: `}<span style={{ color:"#86efac" }}>"Production REST API"</span>{`,
  `}<span style={{ color:"#38bdf8" }}>"main"</span>{`: `}<span style={{ color:"#86efac" }}>"src/index.js"</span>{`,
  `}<span style={{ color:"#38bdf8" }}>"type"</span>{`: `}<span style={{ color:"#86efac" }}>"module"</span>{`,         `}<span style={{ color:"#2d5a40" }}>// use ES Modules</span>{`
  `}<span style={{ color:"#38bdf8" }}>"engines"</span>{`: { `}<span style={{ color:"#38bdf8" }}>"node"</span>{`: `}<span style={{ color:"#86efac" }}>">=18.0.0"</span>{` },
  `}<span style={{ color:"#38bdf8" }}>"scripts"</span>{`: {
    `}<span style={{ color:"#38bdf8" }}>"start"</span>{`: `}<span style={{ color:"#86efac" }}>"node src/index.js"</span>{`,
    `}<span style={{ color:"#38bdf8" }}>"dev"</span>{`: `}<span style={{ color:"#86efac" }}>"nodemon src/index.js"</span>{`,
    `}<span style={{ color:"#38bdf8" }}>"test"</span>{`: `}<span style={{ color:"#86efac" }}>"jest --coverage"</span>{`
  },
  `}<span style={{ color:"#38bdf8" }}>"dependencies"</span>{`: {            `}<span style={{ color:"#2d5a40" }}>// production deps</span>{`
    `}<span style={{ color:"#38bdf8" }}>"express"</span>{`: `}<span style={{ color:"#86efac" }}>"^4.18.2"</span>{`,
    `}<span style={{ color:"#38bdf8" }}>"mongoose"</span>{`: `}<span style={{ color:"#86efac" }}>"^7.4.0"</span>{`,
    `}<span style={{ color:"#38bdf8" }}>"jsonwebtoken"</span>{`: `}<span style={{ color:"#86efac" }}>"^9.0.0"</span>{`
  },
  `}<span style={{ color:"#38bdf8" }}>"devDependencies"</span>{`: {         `}<span style={{ color:"#2d5a40" }}>// dev-only deps</span>{`
    `}<span style={{ color:"#38bdf8" }}>"nodemon"</span>{`: `}<span style={{ color:"#86efac" }}>"^3.0.1"</span>{`,
    `}<span style={{ color:"#38bdf8" }}>"jest"</span>{`: `}<span style={{ color:"#86efac" }}>"^29.0.0"</span>{`,
    `}<span style={{ color:"#38bdf8" }}>"eslint"</span>{`: `}<span style={{ color:"#86efac" }}>"^8.0.0"</span>{`
  }
}`}
            </pre>
          </div>
        </div>
      )}
      {tab === "semver" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            <div style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, marginBottom:8 }}>Current version:</div>
            <div style={{ display:"flex", gap:8, marginBottom:12, alignItems:"center" }}>
              {[["MAJOR",semver.major,bumpMajor,t.danger],["MINOR",semver.minor,bumpMinor,t.warn],["PATCH",semver.patch,bumpPatch,t.accent]].map(([lbl,val,fn,col]) => (
                <div key={lbl} style={{ flex:1, textAlign:"center" }}>
                  <div style={{ color:col, fontWeight:900, fontFamily:"monospace", fontSize:"1.8rem", lineHeight:1 }}>{val}</div>
                  <div style={{ color:t.muted, fontSize:"0.65rem", marginBottom:4 }}>{lbl}</div>
                  <button onClick={fn} style={{ background:`${col}25`, border:`1px solid ${col}50`, color:col, borderRadius:5, padding:"2px 8px", cursor:"pointer", fontSize:"0.72rem", fontWeight:700 }}>+1</button>
                </div>
              ))}
            </div>
            <div style={{ textAlign:"center", color:t.accent, fontFamily:"monospace", fontWeight:900, fontSize:"1.2rem", marginBottom:12 }}>
              {prefix}{semver.major}.{semver.minor}.{semver.patch}
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
              {semverExamples.map(ex => (
                <button key={ex.prefix} onClick={() => setPrefix(ex.prefix)} style={{ background:prefix===ex.prefix?t.accentBg:t.surface, color:prefix===ex.prefix?t.accent:t.muted, border:`1px solid ${prefix===ex.prefix?t.accentBorder:t.border}`, borderRadius:6, padding:"3px 10px", cursor:"pointer", fontSize:"0.78rem", fontWeight:700, fontFamily:"monospace" }}>{ex.prefix || "exact"}</button>
              ))}
            </div>
          </div>
          <div style={{ flex:"1 1 200px" }}>
            {semverExamples.map(ex => (
              <div key={ex.prefix} style={{ background:prefix===ex.prefix?t.accentBg:t.surface, border:`1px solid ${prefix===ex.prefix?t.accentBorder:t.border}`, borderRadius:8, padding:"8px 12px", marginBottom:5, transition:"all .2s" }}>
                <div style={{ color:prefix===ex.prefix?t.accent:t.muted, fontFamily:"monospace", fontWeight:700, fontSize:"0.82rem", marginBottom:2 }}>{ex.prefix || '"exact"'}{ex.prefix?`${semver.major}.${semver.minor}.${semver.patch}`:""}</div>
                <div style={{ color:t.muted, fontSize:"0.72rem" }}>{ex.desc}</div>
                <div style={{ color:prefix===ex.prefix?t.accent:t.muted, fontSize:"0.72rem", fontFamily:"monospace" }}>→ installs: {ex.ex}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "scripts" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 200px" }}>
            {scripts.map((s, i) => (
              <div key={i} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", marginBottom:6 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <code style={{ color:t.accent, fontWeight:700, fontSize:"0.82rem" }}>"scripts": "{s.name}"</code>
                  <code style={{ color:t.muted, fontSize:"0.72rem" }}>npm {s.name==="start"||s.name==="test"?s.name:`run ${s.name}`}</code>
                </div>
                <code style={{ color:t.info, fontSize:"0.75rem" }}>{s.cmd}</code>
                <div style={{ color:t.muted, fontSize:"0.7rem", marginTop:3 }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ flex:"1 1 180px" }}>
            <pre style={{ margin:0, background:"#020608", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.74rem", color:"#b0d8c8", lineHeight:1.8 }}>
{`# Common npm commands
npm init -y            # create package.json
npm install express    # add dependency
npm install -D nodemon # add devDependency
npm install            # install all deps
npm update             # update packages
npm uninstall lodash   # remove package
npm list               # show installed
npm audit              # security check
npm audit fix          # auto-fix vulnerabilities

# npx — run without installing
npx create-next-app
npx prisma migrate

# pnpm / yarn alternatives
pnpm install           # faster, disk-efficient
yarn add express       # yarn alternative

# package-lock.json / pnpm-lock.yaml
# → Lock exact versions for reproducible builds
# → ALWAYS commit this file!`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 4 — Async: Callbacks → Promises → Async/Await
══════════════════════════════════════════════════════════════ */
function AsyncDemo({ t }) {
  const [era, setEra] = useState("async");
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState([]);
  const [promiseState, setPromiseState] = useState("pending");
  const [shouldFail, setShouldFail] = useState(false);

  const simulate = async () => {
    setRunning(true); setSteps([]); setPromiseState("pending");
    const add = (msg, col) => setSteps(s => [...s, { msg, col, time:new Date().toLocaleTimeString() }]);
    add("▶ Starting async operation…", t.accent);
    await new Promise(r => setTimeout(r, 600));
    add("📤 Request sent to server", t.info);
    await new Promise(r => setTimeout(r, 800));
    add("⏳ Waiting for response (non-blocking)", t.warn);
    await new Promise(r => setTimeout(r, 700));
    if(shouldFail) {
      add("❌ Network error — caught by catch/try-catch", t.danger);
      setPromiseState("rejected");
    } else {
      add("✅ Data received successfully!", t.accent);
      setPromiseState("resolved");
    }
    setRunning(false);
  };

  const eras = {
    callbacks: {
      label:"Callbacks (1.0 era)", color:t.danger,
      code:`// ❌ Callback Hell — hard to read, error-prone
fs.readFile('user.json', (err, userData) => {
  if (err) return console.error(err);

  JSON.parse(userData).id;
  db.getUser(id, (err, user) => {
    if (err) return console.error(err);

    db.getPosts(user.id, (err, posts) => {
      if (err) return console.error(err);

      db.getComments(posts[0].id, (err, comments) => {
        if (err) return console.error(err);
        // Finally! 4 levels deep...
        console.log(comments);
      });
    });
  });
});`
    },
    promises: {
      label:"Promises (ES6)", color:t.warn,
      code:`// ✓ Promises — chainable, better error handling
readFile('user.json')
  .then(userData => JSON.parse(userData))
  .then(data => db.getUser(data.id))
  .then(user => db.getPosts(user.id))
  .then(posts => db.getComments(posts[0].id))
  .then(comments => console.log(comments))
  .catch(err => console.error('Error:', err));
  // One catch handles ALL errors in chain!

// Creating promises
const fetchUser = (id) => new Promise((resolve, reject) => {
  db.query('SELECT * FROM users WHERE id = ?', [id],
    (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    }
  );
});

// Promise.all — parallel execution
const [user, config] = await Promise.all([
  fetchUser(id),
  fetchConfig(),
]);`
    },
    async: {
      label:"Async/Await (ES2017)", color:t.accent,
      code:`// ✅ Async/Await — reads like synchronous code!
async function loadUserData(userId) {
  try {
    const userData = await readFile('user.json');
    const data     = JSON.parse(userData);
    const user     = await db.getUser(data.id);
    const posts    = await db.getPosts(user.id);
    const comments = await db.getComments(posts[0].id);
    return comments;
  } catch (err) {
    // Catches ALL errors — file, DB, parse errors
    console.error('Failed:', err.message);
    throw err; // re-throw for caller
  }
}

// Parallel with async/await
async function loadDashboard(userId) {
  const [user, stats, notifications] = await Promise.all([
    getUser(userId),
    getStats(userId),
    getNotifications(userId),
  ]);
  return { user, stats, notifications };
}`
    },
  };
  const current = eras[era];
  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Async Patterns — Callbacks → Promises → Async/Await</p>
      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
        {Object.entries(eras).map(([k,v]) => (
          <button key={k} onClick={() => setEra(k)} style={{ background:era===k?v.color+"30":t.surface, color:v.color, border:`2px solid ${era===k?v.color:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.8rem" }}>{v.label}</button>
        ))}
      </div>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        <div style={{ flex:"1 1 240px" }}>
          <div style={{ position:"relative", borderRadius:12, overflow:"hidden", border:`1px solid ${current.color}40`, marginBottom:12 }}>
            <div style={{ background:"#020608", padding:"12px 14px", overflowX:"auto", maxHeight:280, overflowY:"auto" }}>
              <pre style={{ margin:0, fontFamily:"monospace", fontSize:"0.75rem", color:current.color, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{current.code}</pre>
            </div>
            <CopyBtn code={current.code}/>
          </div>
        </div>
        <div style={{ flex:"1 1 200px" }}>
          <div style={{ marginBottom:10 }}>
            <label style={{ display:"flex", gap:8, alignItems:"center", cursor:"pointer", fontSize:"0.8rem", color:t.muted, marginBottom:8 }}>
              <input type="checkbox" checked={shouldFail} onChange={e=>setShouldFail(e.target.checked)} style={{ accentColor:t.danger, width:14, height:14 }}/>
              Simulate failure
            </label>
            <button onClick={simulate} disabled={running} style={{ width:"100%", background:running?t.surface:`linear-gradient(135deg,${t.accent},#15803d)`, border:"none", borderRadius:8, padding:"10px", color:running?t.muted:"#000", fontWeight:800, cursor:running?"not-allowed":"pointer", fontSize:"0.85rem", marginBottom:8 }}>
              {running?"⏳ Running…":"▶ Simulate async call"}
            </button>
            {promiseState !== "pending" && (
              <div style={{ background:promiseState==="resolved"?t.accentBg:t.danger+"15", border:`1px solid ${promiseState==="resolved"?t.accentBorder:t.danger+"40"}`, borderRadius:8, padding:"6px 10px", marginBottom:8 }}>
                <code style={{ color:promiseState==="resolved"?t.accent:t.danger, fontSize:"0.8rem", fontWeight:700 }}>Promise: {promiseState}</code>
              </div>
            )}
          </div>
          <div style={{ background:"#020608", border:`1px solid ${t.border}`, borderRadius:9, padding:"8px 10px", minHeight:100 }}>
            {steps.length===0 ? <div style={{ color:t.muted, fontSize:"0.75rem" }}>Run to see execution log…</div>
              : steps.map((s,i)=>(
                <div key={i} style={{ color:s.col, fontFamily:"monospace", fontSize:"0.72rem", marginBottom:3 }}>{s.msg}</div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 5 — File System (fs module)
══════════════════════════════════════════════════════════════ */
function FileSystemDemo({ t }) {
  const [tab, setTab] = useState("ops");
  const [files, setFiles] = useState([
    { name:"index.js",   type:"file", size:"2.4 KB", mod:"2024-01-15" },
    { name:"package.json",type:"file",size:"1.1 KB", mod:"2024-01-14" },
    { name:"src",        type:"dir",  size:"—",      mod:"2024-01-15" },
    { name:".env",       type:"file", size:"0.3 KB", mod:"2024-01-10" },
    { name:"node_modules",type:"dir", size:"—",      mod:"2024-01-14" },
  ]);
  const [newName, setNewName] = useState("");
  const [content, setContent] = useState("// Hello, Node.js!\nconsole.log('File written!');");
  const [log, setLog] = useState([]);
  const addLog = (msg, col=t.accent) => setLog(l => [{ msg, col, t:new Date().toLocaleTimeString() }, ...l].slice(0,8));

  const addFile = () => {
    if(!newName.trim()) return;
    setFiles(f => [...f, { name:newName, type:newName.includes(".")?/\/$/.test(newName)?"dir":"file":"dir", size:"0 B", mod:new Date().toISOString().slice(0,10) }]);
    addLog(`✓ Created: ${newName}`);
    setNewName("");
  };
  const delFile = (name) => { setFiles(f => f.filter(x => x.name!==name)); addLog(`🗑 Deleted: ${name}`, t.danger); };

  const ops = [
    { name:"Read (async)",  color:"#38bdf8",  code:`import { readFile } from 'node:fs/promises';

// Async/Await
const data = await readFile('config.json', 'utf8');
const config = JSON.parse(data);

// Callback style (legacy)
fs.readFile('config.json', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Sync (blocks event loop — avoid in servers!)
const data = fs.readFileSync('config.json', 'utf8');` },
    { name:"Write",         color:"#4ade80",  code:`import { writeFile, appendFile } from 'node:fs/promises';

// Write (overwrites existing file)
await writeFile('output.txt',
  'Hello, World!', 'utf8');

// Append to file
await appendFile('log.txt',
  \`[\${new Date().toISOString()}] User logged in\n\`);

// Write JSON prettily
await writeFile('data.json',
  JSON.stringify(data, null, 2), 'utf8');` },
    { name:"Directory",     color:"#c084fc",  code:`import { mkdir, readdir, rm } from 'node:fs/promises';

// Create directory (recursive creates parents)
await mkdir('src/utils/helpers', { recursive: true });

// List directory contents
const entries = await readdir('.', { withFileTypes: true });
const dirs  = entries.filter(e => e.isDirectory());
const files = entries.filter(e => e.isFile());

// Delete recursively
await rm('old-folder', { recursive: true, force: true });

// Check if path exists
import { access } from 'node:fs/promises';
try {
  await access('config.json');
  console.log('File exists');
} catch { console.log('Not found'); }` },
    { name:"Streams",       color:"#fbbf24",  code:`import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

// ✅ Stream large files — never loads fully into memory
const source = createReadStream('large-video.mp4');
const dest   = createWriteStream('output.mp4.gz');
const gzip   = createGzip();

// Pipe: read → compress → write
await pipeline(source, gzip, dest);
console.log('File compressed!');

// Stream for HTTP responses
app.get('/download', (req, res) => {
  res.setHeader('Content-Type', 'application/pdf');
  const stream = createReadStream('large.pdf');
  stream.pipe(res); // streams directly to client
});` },
    { name:"Path Utils",    color:"#fb923c",  code:`import path from 'node:path';

const filePath = '/home/user/projects/api/src/index.js';

path.dirname(filePath);   // '/home/user/projects/api/src'
path.basename(filePath);  // 'index.js'
path.extname(filePath);   // '.js'
path.parse(filePath);     // { root, dir, base, ext, name }

// Join paths safely (handles OS differences)
const full = path.join(__dirname, 'src', 'routes', 'users.js');

// Resolve to absolute path
const abs = path.resolve('../../config.json');

// __dirname equivalent in ES Modules
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));` },
  ];
  const [selOp, setSelOp] = useState(0);

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>File System — fs module & path</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["📂 Operations","ops"],["🗂 File Explorer","explorer"]].map(([l,v]) => (
          <button key={v} onClick={() => setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>
      {tab === "ops" ? (
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <div style={{ flex:"0 0 auto", display:"flex", flexDirection:"column", gap:4 }}>
            {ops.map((op,i) => (
              <button key={i} onClick={() => setSelOp(i)} style={{ textAlign:"left", background:selOp===i?op.color+"25":t.surface, color:selOp===i?op.color:t.muted, border:`1px solid ${selOp===i?op.color+"60":t.border}`, borderRadius:7, padding:"6px 14px", cursor:"pointer", fontSize:"0.78rem", fontWeight:700, whiteSpace:"nowrap" }}>{op.name}</button>
            ))}
          </div>
          <div style={{ flex:1, minWidth:220 }}>
            <div style={{ position:"relative", borderRadius:10, overflow:"hidden", border:`1px solid ${ops[selOp].color}40` }}>
              <div style={{ background:"#020608", padding:"10px 12px", overflowX:"auto", maxHeight:260, overflowY:"auto" }}>
                <pre style={{ margin:0, fontFamily:"monospace", fontSize:"0.74rem", color:ops[selOp].color, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{ops[selOp].code}</pre>
              </div>
              <CopyBtn code={ops[selOp].code}/>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 200px" }}>
            <div style={{ display:"flex", gap:6, marginBottom:10 }}>
              <input value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addFile()} placeholder="filename.js or folder/" style={{ flex:1, padding:"6px 10px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, fontSize:"0.8rem", outline:"none" }}/>
              <button onClick={addFile} style={{ background:t.accent, border:"none", borderRadius:7, padding:"6px 12px", color:"#000", fontWeight:700, cursor:"pointer", fontSize:"0.8rem" }}>+ Create</button>
            </div>
            <div style={{ background:"#020608", border:`1px solid ${t.border}`, borderRadius:10, overflow:"hidden" }}>
              <div style={{ padding:"6px 12px", borderBottom:`1px solid ${t.border}`, color:t.muted, fontSize:"0.7rem", fontWeight:700, display:"flex", justifyContent:"space-between" }}>
                <span>NAME</span><span>SIZE</span><span>MODIFIED</span><span/>
              </div>
              {files.map((f,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 12px", borderBottom:`1px solid ${t.border+"50"}`, fontSize:"0.78rem" }}>
                  <span style={{ fontSize:"0.9rem" }}>{f.type==="dir"?"📁":"📄"}</span>
                  <span style={{ flex:1, color:f.type==="dir"?t.info:t.text, fontFamily:"monospace" }}>{f.name}</span>
                  <span style={{ color:t.muted, fontSize:"0.7rem", minWidth:40, textAlign:"right" }}>{f.size}</span>
                  <span style={{ color:t.muted, fontSize:"0.7rem", minWidth:70, textAlign:"right" }}>{f.mod}</span>
                  <button onClick={()=>delFile(f.name)} style={{ background:"none", border:"none", color:t.muted, cursor:"pointer", fontSize:"0.85rem", padding:"0 2px" }}>×</button>
                </div>
              ))}
            </div>
            {log.length>0 && (
              <div style={{ marginTop:8, background:"#020608", border:`1px solid ${t.border}`, borderRadius:8, padding:"6px 10px", maxHeight:80, overflowY:"auto" }}>
                {log.map((l,i)=><div key={i} style={{ color:i===0?l.col:t.muted, fontFamily:"monospace", fontSize:"0.7rem", marginBottom:1 }}>{l.msg}</div>)}
              </div>
            )}
          </div>
          <div style={{ flex:"1 1 180px" }}>
            <div style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, marginBottom:6 }}>File content editor:</div>
            <textarea value={content} onChange={e=>setContent(e.target.value)} rows={6} style={{ width:"100%", boxSizing:"border-box", padding:"8px 10px", background:"#020608", border:`1px solid ${t.border}`, borderRadius:8, color:t.accent, fontFamily:"monospace", fontSize:"0.75rem", outline:"none", resize:"vertical" }}/>
            <button onClick={()=>addLog(`✓ Written ${content.length} bytes to file`, t.accent)} style={{ width:"100%", background:t.accentBg, border:`1px solid ${t.accentBorder}`, borderRadius:7, padding:"7px", color:t.accent, fontWeight:700, cursor:"pointer", fontSize:"0.8rem", marginTop:6 }}>
              Simulate fs.writeFile()
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
/* ══════════════════════════════════════════════════════════════
   DEMO 6 — HTTP Server
══════════════════════════════════════════════════════════════ */
function HttpDemo({ t }) {
  const [method, setMethod] = useState("GET");
  const [path2, setPath2] = useState("/api/users");
  const [status, setStatus] = useState(null);
  const [body, setBody] = useState(null);
  const [headers, setHeaders] = useState(null);
  const [loading, setLoading] = useState(false);

  const routes = {
    "GET /api/users":     { status:200, body:{ users:[{ id:1,name:"Alice" },{ id:2,name:"Bob" }], total:2 } },
    "GET /api/users/1":   { status:200, body:{ id:1, name:"Alice", email:"alice@dev.io", role:"admin" } },
    "POST /api/users":    { status:201, body:{ id:3, name:"Charlie", message:"Created" } },
    "PUT /api/users/1":   { status:200, body:{ id:1, name:"Alice Updated", message:"Updated" } },
    "DELETE /api/users/1":{ status:204, body:null },
    "GET /api/health":    { status:200, body:{ status:"ok", uptime:3600, version:"1.0.0" } },
    "GET /notfound":      { status:404, body:{ error:"Not Found", message:"Route does not exist" } },
  };

  const simulate = () => {
    setLoading(true);
    setTimeout(() => {
      const key = `${method} ${path2}`;
      const result = routes[key] || { status:404, body:{ error:"Route not found" } };
      setStatus(result.status);
      setBody(result.body);
      setHeaders({ "Content-Type":"application/json", "X-Request-Id":"req_abc123", "X-Response-Time":"12ms" });
      setLoading(false);
    }, 600);
  };

  const statusColor = (s) => {
    if(!s) return t.muted;
    if(s < 300) return t.accent;
    if(s < 400) return t.info;
    if(s < 500) return t.warn;
    return t.danger;
  };

  const statusTexts = { 200:"OK", 201:"Created", 204:"No Content", 301:"Moved Permanently", 400:"Bad Request", 401:"Unauthorized", 403:"Forbidden", 404:"Not Found", 429:"Too Many Requests", 500:"Internal Server Error" };

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>HTTP Server — request/response lifecycle</p>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        <div style={{ flex:"1 1 200px" }}>
          <div style={{ display:"flex", gap:6, marginBottom:10 }}>
            {["GET","POST","PUT","DELETE"].map(m => (
              <button key={m} onClick={() => setMethod(m)} style={{ flex:1, background:method===m?{GET:t.accent,POST:t.info,PUT:t.warn,DELETE:t.danger}[m]+"30":t.surface, color:{GET:t.accent,POST:t.info,PUT:t.warn,DELETE:t.danger}[m], border:`2px solid ${method===m?{GET:t.accent,POST:t.info,PUT:t.warn,DELETE:t.danger}[m]:t.border}`, borderRadius:6, padding:"5px 0", cursor:"pointer", fontWeight:700, fontSize:"0.75rem" }}>{m}</button>
            ))}
          </div>
          <div style={{ display:"flex", gap:6, marginBottom:10 }}>
            <input value={path2} onChange={e => setPath2(e.target.value)} style={{ flex:1, padding:"7px 10px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, fontSize:"0.82rem", outline:"none", fontFamily:"monospace" }}/>
            <button onClick={simulate} disabled={loading} style={{ background:`linear-gradient(135deg,${t.accent},#15803d)`, border:"none", borderRadius:7, padding:"7px 14px", color:"#000", fontWeight:800, cursor:"pointer", fontSize:"0.82rem" }}>Send</button>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
            {Object.keys(routes).map(r => (
              <button key={r} onClick={() => { const [m,...p]=r.split(" "); setMethod(m); setPath2(p.join(" ")); }} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:20, padding:"2px 9px", cursor:"pointer", fontSize:"0.7rem", color:t.muted, fontFamily:"monospace" }}>{r}</button>
            ))}
          </div>
          {status && (
            <div style={{ background:"#020608", border:`1px solid ${t.border}`, borderRadius:10, overflow:"hidden" }}>
              <div style={{ padding:"8px 12px", borderBottom:`1px solid ${t.border}`, display:"flex", gap:10, alignItems:"center" }}>
                <span style={{ color:statusColor(status), fontWeight:900, fontFamily:"monospace", fontSize:"0.95rem" }}>{status}</span>
                <span style={{ color:statusColor(status), fontSize:"0.8rem" }}>{statusTexts[status]||""}</span>
              </div>
              {headers && (
                <div style={{ padding:"6px 12px", borderBottom:`1px solid ${t.border}` }}>
                  {Object.entries(headers).map(([k,v]) => (
                    <div key={k} style={{ fontFamily:"monospace", fontSize:"0.7rem", marginBottom:2 }}>
                      <span style={{ color:t.info }}>{k}</span><span style={{ color:t.muted }}>: </span><span style={{ color:"#86efac" }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ padding:"8px 12px" }}>
                {body !== null ? <pre style={{ margin:0, color:t.accent, fontFamily:"monospace", fontSize:"0.74rem", lineHeight:1.7 }}>{JSON.stringify(body, null, 2)}</pre>
                  : <div style={{ color:t.muted, fontSize:"0.78rem", fontStyle:"italic" }}>No body (204 No Content)</div>}
              </div>
            </div>
          )}
          {loading && <div style={{ textAlign:"center", color:t.muted, padding:"20px" }}>⏳ Simulating request…</div>}
        </div>
        <div style={{ flex:"1 1 220px" }}>
          <div style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, marginBottom:6 }}>HTTP Status codes to know:</div>
          {[[200,"OK","Request succeeded"],[201,"Created","Resource created (POST)"],[204,"No Content","Success, no body (DELETE)"],[301,"Moved","Permanent redirect"],[400,"Bad Request","Client sent invalid data"],[401,"Unauthorized","Not authenticated"],[403,"Forbidden","Authenticated but no permission"],[404,"Not Found","Resource doesn't exist"],[429,"Too Many Requests","Rate limited"],[500,"Server Error","Bug on your end!"]].map(([code,name,desc]) => (
            <div key={code} style={{ display:"flex", gap:8, padding:"4px 8px", borderRadius:6, marginBottom:2, alignItems:"center" }}>
              <code style={{ color:statusColor(code), fontWeight:700, fontSize:"0.78rem", minWidth:34 }}>{code}</code>
              <span style={{ color:t.muted, fontSize:"0.72rem", flex:1 }}>{name} — {desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 7 — Express.js
══════════════════════════════════════════════════════════════ */
function ExpressDemo({ t }) {
  const [tab, setTab] = useState("routing");
  const [param, setParam] = useState("42");
  const [q, setQ] = useState("active");

  const matchRoute = (routes, method, path2) => {
    for(const r of routes) {
      if(r.method !== method) continue;
      const rParts = r.path.split("/");
      const pParts = path2.split("/");
      if(rParts.length !== pParts.length) continue;
      let match = true; const params = {};
      for(let i=0;i<rParts.length;i++) {
        if(rParts[i].startsWith(":")) { params[rParts[i].slice(1)] = pParts[i]; }
        else if(rParts[i] !== pParts[i]) { match=false; break; }
      }
      if(match) return { ...r, params };
    }
    return null;
  };

  const routes = [
    { method:"GET",    path:"/",            handler:"home",           desc:"Serve home page" },
    { method:"GET",    path:"/users",        handler:"getAllUsers",    desc:"List all users" },
    { method:"POST",   path:"/users",        handler:"createUser",    desc:"Create new user" },
    { method:"GET",    path:"/users/:id",    handler:"getUser",       desc:"Get user by ID" },
    { method:"PUT",    path:"/users/:id",    handler:"updateUser",    desc:"Update user" },
    { method:"DELETE", path:"/users/:id",    handler:"deleteUser",    desc:"Delete user" },
    { method:"GET",    path:"/users/:id/posts", handler:"getUserPosts", desc:"Get user's posts" },
  ];
  const [selMethod, setSelMethod] = useState("GET");
  const [selPath, setSelPath] = useState("/users/:id");
  const [testPath, setTestPath] = useState(`/users/${param}`);
  const matched = matchRoute(routes, selMethod, testPath);

  const methodColors = { GET:t.accent, POST:t.info, PUT:t.warn, DELETE:t.danger };

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Express.js — routing, params, query strings</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["Routes","routing"],["Setup","setup"],["Error Handling","errors"]].map(([l,v]) => (
          <button key={v} onClick={() => setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>
      {tab === "routing" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 200px" }}>
            <div style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, marginBottom:6 }}>Route table:</div>
            {routes.map((r,i) => (
              <div key={i} onClick={() => { setSelMethod(r.method); setSelPath(r.path); setTestPath(r.path.replace(":id",param)); }}
                style={{ display:"flex", gap:8, alignItems:"center", padding:"6px 8px", borderRadius:7, marginBottom:3, cursor:"pointer", background:selPath===r.path&&selMethod===r.method?t.accentBg:"transparent", border:`1px solid ${selPath===r.path&&selMethod===r.method?t.accentBorder:"transparent"}` }}>
                <span style={{ background:methodColors[r.method]+"25", color:methodColors[r.method], borderRadius:4, padding:"1px 6px", fontSize:"0.68rem", fontWeight:700, fontFamily:"monospace", minWidth:50, textAlign:"center" }}>{r.method}</span>
                <code style={{ color:t.text, fontSize:"0.78rem", flex:1 }}>{r.path}</code>
                <span style={{ color:t.muted, fontSize:"0.68rem" }}>{r.desc}</span>
              </div>
            ))}
            <div style={{ marginTop:10 }}>
              <div style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, marginBottom:5 }}>Test URL matching:</div>
              <div style={{ display:"flex", gap:6 }}>
                <input value={testPath} onChange={e=>setTestPath(e.target.value)} style={{ flex:1, padding:"6px 10px", background:t.surface, border:`1px solid ${matched?t.accentBorder:t.border}`, borderRadius:7, color:t.text, fontSize:"0.8rem", outline:"none", fontFamily:"monospace" }}/>
              </div>
              {matched ? (
                <div style={{ marginTop:6, background:t.accentBg, border:`1px solid ${t.accentBorder}`, borderRadius:7, padding:"6px 10px" }}>
                  <div style={{ color:t.accent, fontSize:"0.75rem", fontWeight:700 }}>✓ Matched: {matched.handler}()</div>
                  {Object.entries(matched.params||{}).map(([k,v]) => <div key={k} style={{ color:t.muted, fontSize:"0.72rem", fontFamily:"monospace" }}>req.params.{k} = "{v}"</div>)}
                </div>
              ) : (
                <div style={{ marginTop:6, background:t.danger+"15", border:`1px solid ${t.danger}35`, borderRadius:7, padding:"6px 10px" }}>
                  <div style={{ color:t.danger, fontSize:"0.75rem" }}>✗ No route matched → 404</div>
                </div>
              )}
            </div>
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <pre style={{ margin:0, background:"#020608", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:"#b0d8c8", lineHeight:1.8, overflow:"auto", maxHeight:300 }}>
{`const express = require('express');
const router  = express.Router();

// GET /users — list all
router.get('/users', async (req, res) => {
  const { limit = 10, status } = req.query;
  // req.query = { limit:'10', status:'active' }

  const users = await User.find({ status })
                          .limit(parseInt(limit));
  res.json({ users, total: users.length });
});

// GET /users/:id — by ID
router.get('/users/:id', async (req, res) => {
  const { id } = req.params;  // route parameter
  const user = await User.findById(id);
  if (!user) return res.status(404).json({
    error: 'User not found'
  });
  res.json(user);
});

// POST /users — create
router.post('/users', async (req, res) => {
  const { name, email } = req.body;  // JSON body
  const user = await User.create({ name, email });
  res.status(201).json(user);
});`}
            </pre>
          </div>
        </div>
      )}
      {tab === "setup" && (
        <div style={{ position:"relative", borderRadius:12, overflow:"hidden", border:`1px solid ${t.border}` }}>
          <div style={{ background:"#020608", padding:"14px 16px", overflowX:"auto" }}>
            <pre style={{ margin:0, fontFamily:"monospace", fontSize:"0.76rem", color:"#b0d8c8", lineHeight:1.8 }}>
{`const express = require('express');
const app = express();

// ── Built-in Middleware ──────────────────────────
app.use(express.json());            // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // form data
app.use(express.static('public')); // serve static files

// ── Security & CORS (npm packages) ──────────────
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(helmet());                // sets security headers
app.use(morgan('dev'));           // request logging

// ── Routes ──────────────────────────────────────
app.use('/api/users',   require('./routes/users'));
app.use('/api/posts',   require('./routes/posts'));
app.use('/api/auth',    require('./routes/auth'));

// ── 404 handler ─────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Error handler (must have 4 params!) ──────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(3000, () => console.log('🚀 Server running on :3000'));`}
            </pre>
          </div>
          <CopyBtn code={`const express = require('express');...`}/>
        </div>
      )}
      {tab === "errors" && (
        <div style={{ position:"relative", borderRadius:12, overflow:"hidden", border:`1px solid ${t.border}` }}>
          <div style={{ background:"#020608", padding:"14px 16px", overflowX:"auto" }}>
            <pre style={{ margin:0, fontFamily:"monospace", fontSize:"0.75rem", color:"#b0d8c8", lineHeight:1.8 }}>
{`// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Async wrapper — eliminates try/catch repetition
const catchAsync = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Routes — throw errors naturally
router.get('/users/:id', catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  res.json(user);
}));

// Global error handler — catches EVERYTHING
app.use((err, req, res, next) => {
  const { statusCode = 500, message, isOperational } = err;

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError')
    return res.status(400).json({ error: 'Invalid ID format' });

  // Duplicate key (unique constraint)
  if (err.code === 11000)
    return res.status(409).json({ error: 'Already exists' });

  // JWT errors
  if (err.name === 'JsonWebTokenError')
    return res.status(401).json({ error: 'Invalid token' });

  res.status(statusCode).json({
    status:  'error',
    message: isOperational ? message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 8 — Middleware
══════════════════════════════════════════════════════════════ */
function MiddlewareDemo({ t }) {
  const [reqPath, setReqPath] = useState("/api/profile");
  const [token, setToken] = useState("Bearer valid_jwt_token_here");
  const [reqMethod, setReqMethod] = useState("GET");
  const [running, setRunning] = useState(false);
  const [steps2, setSteps2] = useState([]);

  const middlewares = [
    { name:"morgan (logging)", color:"#38bdf8", icon:"📝", desc:"Logs every request: method, URL, status, response time" },
    { name:"helmet (security)", color:"#c084fc", icon:"🔒", desc:"Sets HTTP security headers: CSP, HSTS, X-Frame-Options" },
    { name:"cors", color:"#fbbf24", icon:"🌐", desc:"Checks Origin header, allows/blocks cross-origin requests" },
    { name:"express.json()", color:"#fb923c", icon:"📦", desc:"Parses raw JSON body → populates req.body" },
    { name:"rateLimiter", color:"#f472b6", icon:"⏱️", desc:"Checks request count per IP, blocks if over limit" },
    { name:"authenticate", color:"#4ade80", icon:"🔑", desc:"Validates JWT token, attaches req.user" },
    { name:"authorize", color:"#a3e635", icon:"🛡️", desc:"Checks req.user.role has permission for this route" },
    { name:"validate body", color:"#2dd4bf", icon:"✅", desc:"Runs Joi/Zod schema validation on req.body" },
    { name:"Route Handler", color:"#4ade80", icon:"🎯", desc:"Your actual business logic runs here — sends response" },
  ];

  const runRequest = async () => {
    setRunning(true); setSteps2([]);
    const hasToken = token.includes("valid");
    const isAuth = reqPath.includes("profile") || reqPath.includes("admin");
    const addStep = async (idx, pass, note) => {
      await new Promise(r => setTimeout(r, 250));
      setSteps2(s => [...s, { idx, pass, note }]);
    };
    for(let i = 0; i < middlewares.length; i++) {
      let pass = true; let note = "";
      if(i===4 && Math.random() < 0.1) { pass=false; note="429 Too Many Requests"; await addStep(i,false,note); break; }
      if(i===5 && isAuth && !hasToken) { pass=false; note="401 Invalid/missing token"; await addStep(i,false,note); break; }
      if(i===6 && reqPath.includes("admin") && !token.includes("admin")) { pass=false; note="403 Insufficient role"; await addStep(i,false,note); break; }
      await addStep(i, true, note);
    }
    setRunning(false);
  };

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Middleware — request pipeline visualization</p>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        <div style={{ flex:"1 1 200px" }}>
          <div style={{ display:"flex", gap:5, marginBottom:8 }}>
            {["GET","POST","PUT","DELETE"].map(m => (
              <button key={m} onClick={() => setReqMethod(m)} style={{ flex:1, background:reqMethod===m?t.accentBg:t.surface, color:reqMethod===m?t.accent:t.muted, border:`1px solid ${reqMethod===m?t.accentBorder:t.border}`, borderRadius:5, padding:"4px 0", cursor:"pointer", fontWeight:700, fontSize:"0.72rem" }}>{m}</button>
            ))}
          </div>
          <input value={reqPath} onChange={e=>setReqPath(e.target.value)} style={{ width:"100%", boxSizing:"border-box", padding:"7px 10px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, fontSize:"0.8rem", outline:"none", fontFamily:"monospace", marginBottom:6 }}/>
          <input value={token} onChange={e=>setToken(e.target.value)} placeholder="Authorization header" style={{ width:"100%", boxSizing:"border-box", padding:"7px 10px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, fontSize:"0.8rem", outline:"none", fontFamily:"monospace", marginBottom:10 }}/>
          <div style={{ display:"flex", gap:6, marginBottom:10, flexWrap:"wrap" }}>
            {[["Public API","/api/data","GET","no_token"],["Profile","/api/profile","GET","Bearer valid_jwt_token_here"],["Admin","/api/admin","GET","Bearer valid_jwt_token_here"]].map(([l,p,m,tk])=>(
              <button key={l} onClick={()=>{setReqPath(p);setReqMethod(m);setToken(tk);setSteps2([]);}} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:6, padding:"4px 10px", cursor:"pointer", fontSize:"0.73rem", color:t.muted, fontWeight:700 }}>{l}</button>
            ))}
          </div>
          <button onClick={runRequest} disabled={running} style={{ width:"100%", background:running?t.surface:`linear-gradient(135deg,${t.accent},#15803d)`, border:"none", borderRadius:8, padding:"10px", color:running?t.muted:"#000", fontWeight:800, cursor:running?"not-allowed":"pointer", fontSize:"0.85rem" }}>
            {running ? "⏳ Processing…" : "▶ Send Request"}
          </button>
        </div>
        <div style={{ flex:"1 1 200px" }}>
          <div style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, marginBottom:8 }}>Middleware pipeline:</div>
          <div style={{ display:"flex", alignItems:"stretch", gap:0 }}>
            <div style={{ width:2, background:`linear-gradient(180deg,${t.accent}60,${t.border})`, borderRadius:99, flexShrink:0, margin:"0 12px 0 6px" }}/>
            <div style={{ flex:1 }}>
              {middlewares.map((mw, i) => {
                const step = steps2.find(s => s.idx === i);
                const isCurrent = running && steps2.length === i;
                return (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 8px", borderRadius:7, marginBottom:3, background:step?(step.pass?t.accentBg:t.danger+"15"):isCurrent?`${mw.color}15`:"transparent", border:`1px solid ${step?(step.pass?t.accentBorder:t.danger+"40"):isCurrent?`${mw.color}50`:"transparent"}`, transition:"all .3s" }}>
                    <span style={{ fontSize:"0.85rem", flexShrink:0 }}>{mw.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ color:step?(step.pass?t.accent:t.danger):t.muted, fontWeight:step||isCurrent?700:400, fontSize:"0.78rem", fontFamily:"monospace" }}>{mw.name}</div>
                      {step&&!step.pass && <div style={{ color:t.danger, fontSize:"0.7rem" }}>{step.note}</div>}
                    </div>
                    {step && <span style={{ color:step.pass?t.accent:t.danger, fontSize:"0.85rem" }}>{step.pass?"✓":"✗"}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 9 — REST API Design
══════════════════════════════════════════════════════════════ */
function RestApiDemo({ t }) {
  const [tab, setTab] = useState("design");
  const [resource, setResource] = useState("users");
  const methodColors = { GET:t.accent, POST:t.info, PUT:t.warn, PATCH:"#fb923c", DELETE:t.danger };

  const endpoints = {
    users: [
      { method:"GET",    path:"/users",              desc:"List all users",              body:null,                         response:'[{"id":1,"name":"Alice"},...]',     code:200 },
      { method:"GET",    path:"/users?page=1&limit=20",desc:"Paginated list",            body:null,                         response:'{"data":[...],"total":100,"page":1}',code:200 },
      { method:"GET",    path:"/users/:id",           desc:"Get user by ID",             body:null,                         response:'{"id":1,"name":"Alice","email":"…"}',code:200 },
      { method:"POST",   path:"/users",              desc:"Create new user",             body:'{"name":"Bob","email":"…"}',  response:'{"id":2,"name":"Bob","…"}',         code:201 },
      { method:"PUT",    path:"/users/:id",           desc:"Replace user (full update)", body:'{"name":"Bob","email":"…"}',  response:'{"id":1,"name":"Bob","…"}',         code:200 },
      { method:"PATCH",  path:"/users/:id",           desc:"Partial update",             body:'{"name":"Robert"}',           response:'{"id":1,"name":"Robert","…"}',      code:200 },
      { method:"DELETE", path:"/users/:id",           desc:"Delete user",                body:null,                         response:"(empty body)",                      code:204 },
    ],
    posts: [
      { method:"GET",    path:"/posts",              desc:"List posts",                  body:null,                         response:'[{"id":1,"title":"…","userId":1}]',code:200 },
      { method:"GET",    path:"/users/:id/posts",    desc:"User's posts (nested)",       body:null,                         response:'[{"id":1,"title":"…"}]',           code:200 },
      { method:"POST",   path:"/posts",              desc:"Create post",                 body:'{"title":"…","body":"…"}',    response:'{"id":10,"title":"…"}',            code:201 },
      { method:"PATCH",  path:"/posts/:id",          desc:"Update post",                body:'{"title":"New title"}',       response:'{"id":10,"title":"New title"}',    code:200 },
      { method:"DELETE", path:"/posts/:id",          desc:"Delete post",                body:null,                         response:"(empty body)",                     code:204 },
    ],
  };

  const eps = endpoints[resource] || [];
  const [selEp, setSelEp] = useState(0);
  const ep = eps[Math.min(selEp, eps.length-1)];

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>REST API Design — conventions & best practices</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["Endpoints","design"],["Versioning","version"],["Best Practices","best"]].map(([l,v]) => (
          <button key={v} onClick={() => setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>
      {tab === "design" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 220px" }}>
            <div style={{ display:"flex", gap:6, marginBottom:10 }}>
              {["users","posts"].map(r => (
                <button key={r} onClick={() => { setResource(r); setSelEp(0); }} style={{ background:resource===r?t.accentBg:t.surface, color:resource===r?t.accent:t.muted, border:`1px solid ${resource===r?t.accentBorder:t.border}`, borderRadius:7, padding:"4px 12px", cursor:"pointer", fontWeight:700, fontSize:"0.78rem" }}>/{r}</button>
              ))}
            </div>
            {eps.map((ep2,i) => (
              <div key={i} onClick={() => setSelEp(i)} style={{ display:"flex", gap:8, alignItems:"center", padding:"7px 8px", borderRadius:7, marginBottom:3, cursor:"pointer", background:selEp===i?t.accentBg:"transparent", border:`1px solid ${selEp===i?t.accentBorder:"transparent"}` }}>
                <span style={{ background:methodColors[ep2.method]+"25", color:methodColors[ep2.method], borderRadius:4, padding:"1px 6px", fontSize:"0.68rem", fontWeight:700, fontFamily:"monospace", minWidth:52, textAlign:"center" }}>{ep2.method}</span>
                <code style={{ color:t.text, fontSize:"0.75rem", flex:1 }}>{ep2.path}</code>
                <span style={{ color:methodColors[ep2.code]||t.accent, fontFamily:"monospace", fontSize:"0.7rem", fontWeight:700 }}>{ep2.code}</span>
              </div>
            ))}
          </div>
          {ep && (
            <div style={{ flex:"1 1 200px" }}>
              <div style={{ background:"#020608", border:`1px solid ${methodColors[ep.method]}40`, borderRadius:10, padding:"12px 14px" }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:10 }}>
                  <span style={{ background:methodColors[ep.method]+"25", color:methodColors[ep.method], borderRadius:5, padding:"3px 10px", fontWeight:700, fontFamily:"monospace", fontSize:"0.8rem" }}>{ep.method}</span>
                  <code style={{ color:t.text, fontSize:"0.82rem" }}>{ep.path}</code>
                </div>
                <div style={{ color:t.muted, fontSize:"0.78rem", marginBottom:10 }}>{ep.desc}</div>
                {ep.body && (
                  <div style={{ marginBottom:8 }}>
                    <div style={{ color:t.muted, fontSize:"0.68rem", fontWeight:700, marginBottom:3 }}>REQUEST BODY:</div>
                    <pre style={{ margin:0, color:t.info, fontFamily:"monospace", fontSize:"0.76rem" }}>{ep.body}</pre>
                  </div>
                )}
                <div>
                  <div style={{ color:t.muted, fontSize:"0.68rem", fontWeight:700, marginBottom:3 }}>RESPONSE ({ep.code}):</div>
                  <pre style={{ margin:0, color:(methodColors[ep.code]||t.accent), fontFamily:"monospace", fontSize:"0.74rem" }}>{ep.response}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {tab === "version" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          {[["✅ URL versioning (recommended)","#4ade80","/api/v1/users\n/api/v2/users\n// Easy to test in browser\n// Clear, explicit\n// Client controls migration"],["URL header versioning","#38bdf8","GET /api/users HTTP/1.1\nAccept: application/vnd.api+json;version=2\n// API version in Accept header\n// Less visible, harder to test"],["Query param","#fbbf24","/api/users?version=2\n// Easy to add\n// But clutters query params\n// Not recommended for production"]].map(([l,c,code])=>(
            <div key={l} style={{ flex:"1 1 180px" }}>
              <div style={{ color:c, fontWeight:700, fontSize:"0.8rem", marginBottom:6 }}>{l}</div>
              <pre style={{ margin:0, background:"#020608", border:`1px solid ${c}35`, borderRadius:8, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.75rem", color:c, lineHeight:1.7 }}>{code}</pre>
            </div>
          ))}
        </div>
      )}
      {tab === "best" && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {[["Use nouns, not verbs","/users not /getUsers\n/posts not /createPost\nHTTP method is the verb","#4ade80"],["Plural resource names","/users not /user\n/posts not /post\n/categories not /category","#38bdf8"],["Nested resources","/users/:id/posts\n/posts/:id/comments\n// Show relationships","#c084fc"],["Filter with query params","GET /users?role=admin\nGET /posts?status=published\nGET /users?sort=name&order=asc","#fbbf24"],["Return envelopes","{ data: [...], meta: { total, page } }\n{ data: {}, error: null }\nConsistent response shape","#fb923c"],["Use proper status codes","201 Created (not 200) for POST\n204 No Content for DELETE\n409 Conflict for duplicates","#f472b6"],["Idempotency","`PUT /users/1` called 10x\nshould have same result as 1x\nGET, PUT, DELETE are idempotent","#a3e635"],["Rate limit & document","X-RateLimit-Limit: 100\nX-RateLimit-Remaining: 98\nAlways document your API!","#2dd4bf"]].map(([h,c,col]) => (
            <div key={h} style={{ flex:"1 1 180px", background:`${col}12`, border:`1px solid ${col}30`, borderRadius:9, padding:"10px 12px" }}>
              <div style={{ color:col, fontWeight:700, fontSize:"0.78rem", marginBottom:5 }}>{h}</div>
              <pre style={{ margin:0, color:`${col}bb`, fontFamily:"monospace", fontSize:"0.7rem", lineHeight:1.6, whiteSpace:"pre-wrap" }}>{c}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 10 — Events & EventEmitter
══════════════════════════════════════════════════════════════ */
function EventsDemo({ t }) {
  const [events2, setEvents2] = useState([]);
  const [listeners, setListeners] = useState({ userCreated:1, orderPlaced:0, emailSent:0, paymentFailed:0 });
  const [log, setLog] = useState([]);
  const addLog = (msg, col=t.accent) => setLog(l => [{ msg, col, id:Date.now() }, ...l].slice(0,12));

  const emit = (event) => {
    const colors = { userCreated:t.accent, orderPlaced:t.info, emailSent:t.warn, paymentFailed:t.danger };
    const msgs = {
      userCreated:"📧 Sending welcome email…\n📊 Updating analytics…",
      orderPlaced:"📦 Reserving inventory…\n💳 Charging card…\n📧 Sending confirmation…",
      emailSent:"✅ Email delivered",
      paymentFailed:"🔄 Scheduling retry…\n🔔 Alerting team…\n📧 Notifying customer…",
    };
    const listenerCount = listeners[event];
    if(listenerCount === 0) { addLog(`emit('${event}') — no listeners!`, t.danger); return; }
    addLog(`emit('${event}') → ${listenerCount} listener(s)`, colors[event]||t.accent);
    (msgs[event]||"").split("\n").forEach((m,i) => setTimeout(() => addLog(`  ${m}`, t.muted), (i+1)*300));
    setEvents2(ev => [{ event, time:new Date().toLocaleTimeString(), col:colors[event]||t.accent }, ...ev].slice(0,6));
  };

  const addListener = (event) => setListeners(l => ({ ...l, [event]:(l[event]||0)+1 }));
  const removeListener = (event) => setListeners(l => ({ ...l, [event]:Math.max(0,(l[event]||0)-1) }));

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Events & EventEmitter — pub/sub pattern in Node.js</p>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        <div style={{ flex:"1 1 200px" }}>
          <div style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, marginBottom:8 }}>Events — click to emit:</div>
          {[["userCreated","👤 user:created",t.accent],["orderPlaced","🛒 order:placed",t.info],["emailSent","📧 email:sent",t.warn],["paymentFailed","💳 payment:failed",t.danger]].map(([event,label,col]) => (
            <div key={event} style={{ background:t.surface, border:`1px solid ${col}30`, borderRadius:9, padding:"10px 12px", marginBottom:6 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <div>
                  <code style={{ color:col, fontWeight:700, fontSize:"0.82rem" }}>{label}</code>
                  <div style={{ color:t.muted, fontSize:"0.7rem" }}>{listeners[event]} listener(s)</div>
                </div>
                <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                  <button onClick={() => removeListener(event)} style={{ background:t.surface2, border:`1px solid ${t.border}`, borderRadius:5, padding:"2px 7px", color:t.muted, cursor:"pointer", fontSize:"0.75rem" }}>−</button>
                  <button onClick={() => addListener(event)} style={{ background:t.surface2, border:`1px solid ${t.border}`, borderRadius:5, padding:"2px 7px", color:t.muted, cursor:"pointer", fontSize:"0.75rem" }}>+</button>
                  <button onClick={() => emit(event)} style={{ background:`${col}25`, border:`1px solid ${col}50`, color:col, borderRadius:6, padding:"4px 10px", cursor:"pointer", fontWeight:700, fontSize:"0.75rem" }}>emit</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ flex:"1 1 200px" }}>
          <div style={{ background:"#020608", border:`1px solid ${t.border}`, borderRadius:9, padding:"8px 10px", marginBottom:10, minHeight:120, maxHeight:160, overflowY:"auto" }}>
            {log.length===0 ? <div style={{ color:t.muted, fontSize:"0.75rem" }}>Emit events to see log…</div>
              : log.map((l) => <div key={l.id} style={{ color:l.col, fontFamily:"monospace", fontSize:"0.71rem", marginBottom:2, whiteSpace:"pre-wrap" }}>{l.msg}</div>)}
          </div>
          <pre style={{ margin:0, background:"#020608", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.72rem", color:"#b0d8c8", lineHeight:1.8, overflow:"auto", maxHeight:200 }}>
{`const EventEmitter = require('events');

class OrderService extends EventEmitter {
  async createOrder(data) {
    const order = await db.create(data);

    // Emit — any listener handles it
    this.emit('order:placed', order);
    return order;
  }
}

const orders = new OrderService();

// Register listeners (can add many!)
orders.on('order:placed', async (order) => {
  await inventory.reserve(order.items);
});

orders.on('order:placed', async (order) => {
  await email.sendConfirmation(order);
});

// Once — auto-removes after first call
orders.once('order:placed', (order) => {
  analytics.trackFirstOrder(order);
});

// Remove listeners
orders.off('order:placed', handler);`}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 11 — Streams & Buffers
══════════════════════════════════════════════════════════════ */
function StreamsDemo({ t }) {
  const [mode, setMode] = useState("compare");
  const [fileSize, setFileSize] = useState(100);
  const [streamProgress, setStreamProgress] = useState(0);
  const [bufferProgress, setBufferProgress] = useState(0);
  const [streaming, setStreaming] = useState(false);
  const timerRef = useRef(null);

  const simulate = async () => {
    setStreaming(true); setStreamProgress(0); setBufferProgress(0);
    const totalTime = 2000;
    const interval = 50;
    let elapsed = 0;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      elapsed += interval;
      const pct = Math.min(100, (elapsed / totalTime) * 100);
      setStreamProgress(pct);
      if(elapsed > totalTime * 0.8) setBufferProgress(Math.min(100, ((elapsed - totalTime*0.8)/(totalTime*0.2))*100));
      if(elapsed >= totalTime) { clearInterval(timerRef.current); setStreaming(false); }
    }, interval);
  };
  useEffect(() => () => clearInterval(timerRef.current), []);

  const types = [
    { name:"Readable",   color:"#38bdf8", icon:"📖", desc:"Data source — read from it. Examples: fs.createReadStream(), http.IncomingMessage, process.stdin", ex:"const rs = fs.createReadStream('file.txt');\nrs.on('data', chunk => console.log(chunk));\nrs.on('end', () => console.log('Done'));" },
    { name:"Writable",   color:"#4ade80", icon:"✍️",  desc:"Data sink — write to it. Examples: fs.createWriteStream(), http.ServerResponse, process.stdout", ex:"const ws = fs.createWriteStream('out.txt');\nws.write('Hello ');\nws.write('World');\nws.end(); // flush + close" },
    { name:"Duplex",     color:"#c084fc", icon:"↔️",  desc:"Both readable and writable. Examples: TCP sockets, WebSockets, crypto streams", ex:"const { Duplex } = require('stream');\nconst d = new Duplex({\n  read(size) { this.push(data); },\n  write(chunk, enc, cb) { cb(); }\n});" },
    { name:"Transform",  color:"#fbbf24", icon:"🔄",  desc:"Duplex that transforms data as it passes through. Examples: zlib.createGzip(), crypto.createCipher()", ex:"import { createGzip } from 'zlib';\nconst gzip = createGzip();\nreadStream.pipe(gzip).pipe(writeStream);\n// Compresses on-the-fly!" },
    { name:"Pipeline",   color:"#fb923c", icon:"🔗",  desc:"Connect streams together. Data flows from source through transforms to destination, with automatic error propagation.", ex:"import { pipeline } from 'stream/promises';\nawait pipeline(\n  fs.createReadStream('input.csv'),\n  csvParser(),\n  transform(),\n  fs.createWriteStream('out.json')\n);" },
  ];
  const [selType, setSelType] = useState(0);

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Streams & Buffers — efficient large data handling</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["🔁 Stream Types","types"],["⚡ Memory Compare","compare"]].map(([l,v]) => (
          <button key={v} onClick={() => setMode(v)} style={{ background:mode===v?t.accentBg:t.surface, color:mode===v?t.accent:t.muted, border:`1px solid ${mode===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>
      {mode === "types" ? (
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <div style={{ flex:"0 0 auto", display:"flex", flexDirection:"column", gap:4 }}>
            {types.map((tp,i) => (
              <button key={i} onClick={() => setSelType(i)} style={{ textAlign:"left", background:selType===i?tp.color+"25":t.surface, color:selType===i?tp.color:t.muted, border:`1px solid ${selType===i?tp.color+"60":t.border}`, borderRadius:7, padding:"6px 12px", cursor:"pointer", fontSize:"0.78rem", fontWeight:700, whiteSpace:"nowrap" }}>{tp.icon} {tp.name}</button>
            ))}
          </div>
          <div style={{ flex:1, minWidth:220 }}>
            <div style={{ background:`${types[selType].color}15`, border:`1px solid ${types[selType].color}40`, borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
              <div style={{ color:types[selType].color, fontWeight:700, fontSize:"0.9rem", marginBottom:5 }}>{types[selType].icon} {types[selType].name} Stream</div>
              <div style={{ color:t.muted, fontSize:"0.78rem", lineHeight:1.6 }}>{types[selType].desc}</div>
            </div>
            <pre style={{ margin:0, background:"#020608", border:`1px solid ${types[selType].color}40`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.76rem", color:types[selType].color, lineHeight:1.7, whiteSpace:"pre-wrap" }}>{types[selType].ex}</pre>
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            <div style={{ marginBottom:12 }}>
              <label style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, display:"block", marginBottom:5 }}>File size simulation:</label>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <input type="range" min={10} max={1000} value={fileSize} onChange={e=>setFileSize(+e.target.value)} style={{ flex:1, accentColor:t.accent }}/>
                <code style={{ color:t.text, fontWeight:700, minWidth:55 }}>{fileSize} MB</code>
              </div>
            </div>
            <button onClick={simulate} disabled={streaming} style={{ width:"100%", background:streaming?t.surface:`linear-gradient(135deg,${t.accent},#15803d)`, border:"none", borderRadius:8, padding:"10px", color:streaming?t.muted:"#000", fontWeight:800, cursor:streaming?"not-allowed":"pointer", fontSize:"0.85rem", marginBottom:14 }}>
              {streaming ? "⏳ Simulating…" : "▶ Simulate processing"}
            </button>
            {[["🌊 Streams","Chunks arrive and are processed immediately. Memory usage stays low (~64KB).",streamProgress,t.accent,fileSize*0.064],["📦 Buffer (readFile)","Entire file loaded into RAM before processing. Memory = file size.",bufferProgress,t.danger,fileSize]].map(([lbl,desc,prog,col,ram]) => (
              <div key={lbl} style={{ background:`${col}12`, border:`1px solid ${col}30`, borderRadius:9, padding:"10px 12px", marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <div style={{ color:col, fontWeight:700, fontSize:"0.82rem" }}>{lbl}</div>
                  <code style={{ color:col, fontSize:"0.75rem" }}>RAM: ~{ram.toFixed(1)} MB</code>
                </div>
                <div style={{ color:t.muted, fontSize:"0.72rem", marginBottom:6 }}>{desc}</div>
                <div style={{ height:6, background:t.border, borderRadius:99, overflow:"hidden" }}>
                  <div style={{ width:`${prog}%`, height:"100%", background:col, borderRadius:99, transition:"width .05s" }}/>
                </div>
                <div style={{ color:col, fontSize:"0.7rem", marginTop:2, textAlign:"right" }}>{prog.toFixed(0)}%</div>
              </div>
            ))}
          </div>
          <div style={{ flex:"1 1 220px" }}>
            <pre style={{ margin:0, background:"#020608", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:"#b0d8c8", lineHeight:1.8 }}>
{`// ❌ readFile — loads ENTIRE file into memory
app.get('/download', async (req, res) => {
  const file = await fs.readFile('huge-video.mp4');
  // If file = 2GB, server needs 2GB RAM!
  res.send(file);
});

// ✅ createReadStream — ~64KB chunks
app.get('/download', (req, res) => {
  const stream = fs.createReadStream('huge-video.mp4');
  stream.pipe(res);
  // Sends chunks as they're read
  // Memory stays at ~64KB regardless of file size!
});

// ✅ Pipeline with transform
import { pipeline } from 'stream/promises';
import { createGzip } from 'zlib';

app.get('/compressed', async (req, res) => {
  res.setHeader('Content-Encoding', 'gzip');
  await pipeline(
    fs.createReadStream('data.json'),
    createGzip(),  // compress on the fly
    res,
  );
});

// Buffer — work with raw binary data
const buf = Buffer.from('Hello, World!', 'utf8');
buf.toString('base64');  // encode
buf.length;              // byte length (not char length!)
Buffer.concat([buf1, buf2]); // join buffers`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
/* ══════════════════════════════════════════════════════════════
   DEMO 12 — Authentication: JWT + bcrypt
══════════════════════════════════════════════════════════════ */
function AuthDemo({ t }) {
  const [tab, setTab] = useState("jwt");
  const [email, setEmail] = useState("alice@dev.io");
  const [password, setPassword] = useState("SecurePass123!");
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState(null);
  const [hashResult, setHashResult] = useState("");
  const [verifyPw, setVerifyPw] = useState("SecurePass123!");
  const [verifyResult, setVerifyResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fakeSign = (payload) => {
    const header = btoa(JSON.stringify({ alg:"HS256", typ:"JWT" })).replace(/=/g,"");
    const body = btoa(JSON.stringify({ ...payload, iat:Math.floor(Date.now()/1000), exp:Math.floor(Date.now()/1000)+3600 })).replace(/=/g,"");
    const sig = btoa("fake_hmac_signature_" + email).replace(/=/g,"").slice(0,20);
    return `${header}.${body}.${sig}`;
  };

  const login = () => {
    setLoading(true);
    setTimeout(() => {
      const tk = fakeSign({ sub:"user_123", email, role:"user", name:"Alice" });
      setToken(tk);
      const [,body] = tk.split(".");
      try { setDecoded(JSON.parse(atob(body + "=="))); } catch { setDecoded(null); }
      setLoading(false);
    }, 800);
  };

  const hashPassword = () => {
    setLoading(true);
    setTimeout(() => {
      const fake = `$2b$12$${btoa(password).slice(0,22)}${btoa(password+Date.now()).slice(0,31)}`;
      setHashResult(fake);
      setLoading(false);
    }, 600);
  };

  const verifyPassword = () => {
    setVerifyResult(verifyPw === password);
  };

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Authentication — JWT tokens & bcrypt password hashing</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["🔑 JWT","jwt"],["🔒 bcrypt","bcrypt"],["📋 Auth Flow","flow"]].map(([l,v]) => (
          <button key={v} onClick={() => setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>
      {tab === "jwt" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            {[["Email","email",email,setEmail],["Password","password",password,setPassword]].map(([l,type,val,set]) => (
              <div key={l} style={{ marginBottom:10 }}>
                <label style={{ display:"block", fontSize:"0.72rem", color:t.muted, marginBottom:3 }}>{l}:</label>
                <input type={type} value={val} onChange={e=>set(e.target.value)} style={{ width:"100%", boxSizing:"border-box", padding:"7px 10px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, fontSize:"0.82rem", outline:"none" }}/>
              </div>
            ))}
            <button onClick={login} disabled={loading} style={{ width:"100%", background:`linear-gradient(135deg,${t.accent},#15803d)`, border:"none", borderRadius:8, padding:"10px", color:"#000", fontWeight:800, cursor:loading?"not-allowed":"pointer", fontSize:"0.85rem" }}>{loading?"⏳ Signing in…":"▶ Login & get JWT"}</button>
            {token && (
              <div style={{ marginTop:10 }}>
                <div style={{ color:t.muted, fontSize:"0.68rem", fontWeight:700, marginBottom:4 }}>JWT TOKEN (hover to see parts):</div>
                <div style={{ fontFamily:"monospace", fontSize:"0.65rem", wordBreak:"break-all", lineHeight:1.6 }}>
                  {token.split(".").map((part,i) => (
                    <span key={i} style={{ color:[t.danger,t.purple,t.info][i] }}>{part}{i<2?".":" "}</span>
                  ))}
                </div>
                <div style={{ display:"flex", gap:5, marginTop:5 }}>
                  {[["header",t.danger],["payload",t.purple],["signature",t.info]].map(([l,c]) => <span key={l} style={{ background:`${c}20`, color:c, borderRadius:4, padding:"1px 7px", fontSize:"0.68rem", fontWeight:700 }}>{l}</span>)}
                </div>
              </div>
            )}
          </div>
          <div style={{ flex:"1 1 200px" }}>
            {decoded ? (
              <div style={{ background:"#020608", border:`1px solid ${t.purple}40`, borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
                <div style={{ color:t.purple, fontWeight:700, fontSize:"0.82rem", marginBottom:6 }}>Decoded Payload:</div>
                {Object.entries(decoded).map(([k,v]) => (
                  <div key={k} style={{ display:"flex", gap:8, marginBottom:3, fontFamily:"monospace", fontSize:"0.74rem" }}>
                    <span style={{ color:t.info }}>{k}</span>
                    <span style={{ color:t.muted }}>:</span>
                    <span style={{ color:typeof v==="number"?t.orange:typeof v==="boolean"?t.warn:t.accent }}>{k.includes("at")||k==="exp"?new Date(v*1000).toLocaleString():JSON.stringify(v)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background:t.surface, border:`2px dashed ${t.border}`, borderRadius:10, padding:20, textAlign:"center", color:t.muted }}>Login to decode JWT →</div>
            )}
            <pre style={{ margin:0, background:"#020608", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.72rem", color:"#b0d8c8", lineHeight:1.8 }}>
{`const jwt = require('jsonwebtoken');

// Sign — create token on login
const token = jwt.sign(
  { sub: user._id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }       // expires in 7 days
);

// Verify — middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization
    ?.replace('Bearer ', '');
  if (!token) return res.status(401).json({
    error: 'No token provided'
  });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};`}
            </pre>
          </div>
        </div>
      )}
      {tab === "bcrypt" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            <div style={{ marginBottom:10 }}>
              <label style={{ display:"block", fontSize:"0.72rem", color:t.muted, marginBottom:3 }}>Password to hash:</label>
              <input value={password} onChange={e=>setPassword(e.target.value)} style={{ width:"100%", boxSizing:"border-box", padding:"7px 10px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, fontSize:"0.82rem", outline:"none" }}/>
            </div>
            <button onClick={hashPassword} disabled={loading} style={{ width:"100%", background:`linear-gradient(135deg,${t.accent},#15803d)`, border:"none", borderRadius:8, padding:"9px", color:"#000", fontWeight:800, cursor:"pointer", fontSize:"0.82rem", marginBottom:10 }}>🔒 Hash Password</button>
            {hashResult && (
              <div style={{ background:"#020608", border:`1px solid ${t.accentBorder}`, borderRadius:8, padding:"8px 12px", marginBottom:10 }}>
                <div style={{ color:t.muted, fontSize:"0.68rem", marginBottom:3 }}>bcrypt hash (stored in DB):</div>
                <code style={{ color:t.accent, fontSize:"0.68rem", wordBreak:"break-all" }}>{hashResult}</code>
              </div>
            )}
            {hashResult && (
              <div>
                <div style={{ marginBottom:8 }}>
                  <label style={{ display:"block", fontSize:"0.72rem", color:t.muted, marginBottom:3 }}>Verify password:</label>
                  <input value={verifyPw} onChange={e=>setVerifyPw(e.target.value)} style={{ width:"100%", boxSizing:"border-box", padding:"7px 10px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, fontSize:"0.82rem", outline:"none" }}/>
                </div>
                <button onClick={verifyPassword} style={{ width:"100%", background:t.surface, border:`1px solid ${t.accentBorder}`, color:t.accent, borderRadius:8, padding:"8px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>▶ bcrypt.compare()</button>
                {verifyResult !== null && (
                  <div style={{ marginTop:8, background:verifyResult?t.accentBg:t.danger+"15", border:`1px solid ${verifyResult?t.accentBorder:t.danger+"40"}`, borderRadius:8, padding:"8px 12px" }}>
                    <div style={{ color:verifyResult?t.accent:t.danger, fontWeight:700, fontSize:"0.82rem" }}>{verifyResult ? "✓ Password matches!" : "✗ Wrong password"}</div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <pre style={{ margin:0, background:"#020608", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.72rem", color:"#b0d8c8", lineHeight:1.8 }}>
{`const bcrypt = require('bcryptjs');

// Hash on registration (cost factor = 12)
const SALT_ROUNDS = 12;

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // ✅ Never store plain text!
  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({ email,
    password: hash,  // store the hash
  });

  res.status(201).json({ id: user._id });
});

// Compare on login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({
    error: 'Invalid credentials'
  });

  const isValid = await bcrypt.compare(
    password, user.password  // compares to hash
  );

  if (!isValid) return res.status(401).json({
    error: 'Invalid credentials'
  });

  const token = jwt.sign({ sub: user._id },
    process.env.JWT_SECRET, { expiresIn: '7d' });

  res.json({ token, user: { id: user._id, email } });
});`}
            </pre>
          </div>
        </div>
      )}
      {tab === "flow" && (
        <div>
          <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8, marginBottom:12 }}>
            {[["1. Register","User sends email + password",t.info],["2. Hash","bcrypt.hash() → stored",t.accent],["3. Login","email + password sent",t.info],["4. Compare","bcrypt.compare() checks",t.warn],["5. Sign JWT","jwt.sign() → token",t.purple],["6. Store","Client stores token",t.orange],["7. Request","Bearer token in header",t.info],["8. Verify","jwt.verify() on server",t.accent],["9. Access","req.user is set → proceed",t.lime]].map(([step,desc,col],i)=>(
              <div key={i} style={{ flexShrink:0, width:120, background:`${col}15`, border:`1px solid ${col}40`, borderRadius:8, padding:"8px 10px", textAlign:"center" }}>
                <div style={{ color:col, fontWeight:700, fontSize:"0.75rem", marginBottom:3 }}>{step}</div>
                <div style={{ color:t.muted, fontSize:"0.68rem" }}>{desc}</div>
                {i<8 && <div style={{ color:col, fontSize:"0.9rem", marginTop:4 }}>→</div>}
              </div>
            ))}
          </div>
          <pre style={{ margin:0, background:"#020608", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:"#b0d8c8", lineHeight:1.8 }}>
{`// Refresh token pattern (production recommended)
// Access token: short-lived (15 min)
// Refresh token: long-lived (7 days), stored in httpOnly cookie

const accessToken = jwt.sign(
  { sub: user._id }, process.env.ACCESS_SECRET, { expiresIn: '15m' }
);
const refreshToken = jwt.sign(
  { sub: user._id }, process.env.REFRESH_SECRET, { expiresIn: '7d' }
);

// Store refresh token in httpOnly cookie (XSS-safe)
res.cookie('refreshToken', refreshToken, {
  httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7*24*60*60*1000
});

// Refresh endpoint — issues new access token
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.cookies;
  const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  const newAccessToken = jwt.sign({ sub: payload.sub },
    process.env.ACCESS_SECRET, { expiresIn: '15m' });
  res.json({ accessToken: newAccessToken });
});`}
          </pre>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 13 — Environment & Config
══════════════════════════════════════════════════════════════ */
function EnvDemo({ t }) {
  const [env2, setEnv2] = useState("development");
  const [showSecrets, setShowSecrets] = useState(false);
  const envs = {
    development: { color:t.accent, vars:{ NODE_ENV:"development", PORT:"3000", MONGODB_URI:"mongodb://localhost:27017/myapp_dev", JWT_SECRET:"dev_secret_not_secure", API_KEY:"sk_test_abc123", LOG_LEVEL:"debug", CORS_ORIGIN:"http://localhost:5173" }},
    staging:     { color:t.warn,   vars:{ NODE_ENV:"staging", PORT:"3000", MONGODB_URI:"mongodb+srv://user:***@cluster.mongodb.net/myapp_staging", JWT_SECRET:"***", API_KEY:"sk_test_xyz789", LOG_LEVEL:"info", CORS_ORIGIN:"https://staging.myapp.com" }},
    production:  { color:t.danger, vars:{ NODE_ENV:"production", PORT:"8080", MONGODB_URI:"mongodb+srv://user:***@cluster.mongodb.net/myapp_prod", JWT_SECRET:"***", API_KEY:"sk_live_***", LOG_LEVEL:"error", CORS_ORIGIN:"https://myapp.com" }},
  };
  const current = envs[env2];
  const masked = (k, v) => {
    if(showSecrets) return v;
    if(k.includes("SECRET")||k.includes("KEY")||k.includes("URI")) return v.replace(/:.+@/,":<hidden>@").replace(/sk_.+/,"sk_***").replace(/dev_.+/,"***");
    return v;
  };
  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Environment Variables & Configuration</p>
      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
        {["development","staging","production"].map(e=>(
          <button key={e} onClick={()=>setEnv2(e)} style={{ background:env2===e?envs[e].color+"30":t.surface, color:envs[e].color, border:`2px solid ${env2===e?envs[e].color:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.8rem" }}>{e}</button>
        ))}
        <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", fontSize:"0.78rem", color:t.muted, marginLeft:"auto" }}>
          <input type="checkbox" checked={showSecrets} onChange={e=>setShowSecrets(e.target.checked)} style={{ accentColor:t.accent }}/>
          Show secrets
        </label>
      </div>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        <div style={{ flex:"1 1 200px" }}>
          <div style={{ background:"#020608", border:`1px solid ${current.color}40`, borderRadius:10, overflow:"hidden", marginBottom:10 }}>
            <div style={{ padding:"6px 12px", background:`${current.color}15`, borderBottom:`1px solid ${current.color}30`, color:current.color, fontSize:"0.72rem", fontWeight:700 }}>.env.{env2}</div>
            <div style={{ padding:"10px 12px" }}>
              {Object.entries(current.vars).map(([k,v])=>(
                <div key={k} style={{ display:"flex", gap:8, marginBottom:3, fontFamily:"monospace", fontSize:"0.73rem" }}>
                  <span style={{ color:t.info, minWidth:120 }}>{k}</span>
                  <span style={{ color:t.muted }}>=</span>
                  <span style={{ color:k.includes("SECRET")||k.includes("KEY")?"#f87171":t.accent }}>{masked(k,v)}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background:t.danger+"12", border:`1px solid ${t.danger}35`, borderRadius:8, padding:"8px 12px" }}>
            <div style={{ color:t.danger, fontWeight:700, fontSize:"0.78rem" }}>⚠ Never commit .env to git!</div>
            <div style={{ color:t.muted, fontSize:"0.72rem" }}>Add .env to .gitignore. Use .env.example with placeholder values.</div>
          </div>
        </div>
        <div style={{ flex:"1 1 200px" }}>
          <pre style={{ margin:0, background:"#020608", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:"#b0d8c8", lineHeight:1.8, overflow:"auto", maxHeight:320 }}>
{`// .gitignore — ALWAYS add these
.env
.env.local
.env.production

// .env.example — commit this instead
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/myapp
JWT_SECRET=replace_with_strong_secret
API_KEY=your_api_key_here

// Usage in code
require('dotenv').config(); // loads .env

const config = {
  port:    process.env.PORT || 3000,
  dbUrl:   process.env.MONGODB_URI,
  jwtKey:  process.env.JWT_SECRET,
  isDev:   process.env.NODE_ENV === 'development',
  isProd:  process.env.NODE_ENV === 'production',
};

// Validate required env vars at startup!
const required = ['MONGODB_URI','JWT_SECRET','API_KEY'];
const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  console.error('Missing env vars:', missing.join(', '));
  process.exit(1); // fail fast, don't start broken
}

// Config module pattern
// config/index.js
export default {
  db: { uri: process.env.MONGODB_URI },
  jwt: { secret: process.env.JWT_SECRET, expiresIn:'7d' },
  cors: { origin: process.env.CORS_ORIGIN },
};`}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 14 — Error Handling
══════════════════════════════════════════════════════════════ */
function ErrorHandlingDemo({ t }) {
  const [sel, setSel] = useState(0);
  const [triggered, setTriggered] = useState(null);
  const errorTypes = [
    { name:"Operational Errors", color:t.warn, icon:"⚠️", desc:"Expected, predictable errors — user mistakes, not-found, validation failures. Handle gracefully with proper HTTP responses.", examples:["User not found (404)","Invalid input/validation","Duplicate email (409)","Rate limit exceeded (429)","Unauthorized (401/403)"] },
    { name:"Programmer Errors", color:t.danger, icon:"🐛", desc:"Bugs in your code — should never happen in production. Log and crash (let PM2/Docker restart the process).", examples:["TypeError: Cannot read undefined","ReferenceError: x is not defined","SyntaxError in JSON.parse","Stack overflow (infinite recursion)","Unhandled promise rejection"] },
    { name:"External Failures", color:t.info, icon:"🌐", desc:"Third-party failures — database down, API timeout, network error. Handle with retries, circuit breakers, fallbacks.", examples:["MongoDB connection lost","AWS S3 timeout","Stripe API error","Redis connection refused","External API rate limit"] },
  ];
  const [selErr, setSelErr] = useState(0);

  const scenarios = [
    { label:"Route not found", trigger:"404", result:{ status:404, body:{ error:"Not Found", message:"Route /api/foo not found" } } },
    { label:"Validation error", trigger:"400", result:{ status:400, body:{ error:"Validation Error", fields:{ email:"Invalid email", password:"Min 8 chars" } } } },
    { label:"Auth failed", trigger:"401", result:{ status:401, body:{ error:"Unauthorized", message:"JWT token expired" } } },
    { label:"DB error", trigger:"500", result:{ status:500, body:{ error:"Internal Server Error", message:"Database connection failed" } } },
    { label:"Uncaught exception", trigger:"crash", result:{ status:"CRASH", body:"Process received SIGTERM — PM2 restarting…" } } ,
  ];
  const statusColors = (s) => s < 300?"#4ade80":s<500?"#fbbf24":"#f87171";

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Error Handling — types, global handlers, graceful shutdown</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["Error Types","types"],["Scenarios","scenarios"],["Graceful Shutdown","shutdown"]].map(([l,v])=>(
          <button key={v} onClick={() => setSel(["types","scenarios","shutdown"].indexOf(v))} style={{ background:sel===["types","scenarios","shutdown"].indexOf(v)?t.accentBg:t.surface, color:sel===["types","scenarios","shutdown"].indexOf(v)?t.accent:t.muted, border:`1px solid ${sel===["types","scenarios","shutdown"].indexOf(v)?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>
      {sel === 0 && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"0 0 auto", display:"flex", flexDirection:"column", gap:4 }}>
            {errorTypes.map((e,i) => (
              <button key={i} onClick={() => setSelErr(i)} style={{ textAlign:"left", background:selErr===i?e.color+"25":t.surface, color:selErr===i?e.color:t.muted, border:`1px solid ${selErr===i?e.color+"60":t.border}`, borderRadius:7, padding:"6px 12px", cursor:"pointer", fontSize:"0.78rem", fontWeight:700, whiteSpace:"nowrap" }}>{e.icon} {e.name}</button>
            ))}
          </div>
          <div style={{ flex:1, minWidth:220 }}>
            <div style={{ background:`${errorTypes[selErr].color}15`, border:`1px solid ${errorTypes[selErr].color}40`, borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
              <div style={{ color:errorTypes[selErr].color, fontWeight:700, fontSize:"0.9rem", marginBottom:6 }}>{errorTypes[selErr].icon} {errorTypes[selErr].name}</div>
              <div style={{ color:t.muted, fontSize:"0.78rem", lineHeight:1.6, marginBottom:8 }}>{errorTypes[selErr].desc}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {errorTypes[selErr].examples.map(ex => <span key={ex} style={{ background:`${errorTypes[selErr].color}15`, color:errorTypes[selErr].color, borderRadius:20, padding:"2px 10px", fontSize:"0.72rem" }}>{ex}</span>)}
              </div>
            </div>
          </div>
        </div>
      )}
      {sel === 1 && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            {scenarios.map((s,i) => (
              <button key={i} onClick={() => setTriggered(s.result)} style={{ display:"block", width:"100%", textAlign:"left", background:triggered===s.result?t.accentBg:t.surface, color:triggered===s.result?t.accent:t.muted, border:`1px solid ${triggered===s.result?t.accentBorder:t.border}`, borderRadius:7, padding:"8px 12px", marginBottom:5, cursor:"pointer", fontSize:"0.8rem", fontWeight:700 }}>
                <span style={{ marginRight:8 }}>{["🔍","⚠️","🔑","💥","💣"][i]}</span>{s.label}
              </button>
            ))}
          </div>
          <div style={{ flex:"1 1 200px" }}>
            {triggered ? (
              <div style={{ background:"#020608", border:`1px solid ${typeof triggered.status==="number"?statusColors(triggered.status)+"50":t.danger+"50"}`, borderRadius:10, overflow:"hidden" }}>
                <div style={{ padding:"8px 12px", background:`${typeof triggered.status==="number"?statusColors(triggered.status):t.danger}20`, borderBottom:`1px solid ${t.border}` }}>
                  <code style={{ color:typeof triggered.status==="number"?statusColors(triggered.status):t.danger, fontWeight:700, fontSize:"0.9rem" }}>Status: {triggered.status}</code>
                </div>
                <div style={{ padding:"10px 12px" }}>
                  <pre style={{ margin:0, color:t.accent, fontFamily:"monospace", fontSize:"0.76rem", lineHeight:1.7 }}>{typeof triggered.body==="string"?triggered.body:JSON.stringify(triggered.body,null,2)}</pre>
                </div>
              </div>
            ) : <div style={{ background:t.surface, border:`2px dashed ${t.border}`, borderRadius:10, padding:24, textAlign:"center", color:t.muted }}>Trigger a scenario →</div>}
          </div>
        </div>
      )}
      {sel === 2 && (
        <pre style={{ margin:0, background:"#020608", border:`1px solid ${t.border}`, borderRadius:10, padding:"14px 16px", fontFamily:"monospace", fontSize:"0.75rem", color:"#b0d8c8", lineHeight:1.8, overflow:"auto" }}>
{`// ── Global error handlers — ALWAYS add these ──────────────

// 1. Uncaught synchronous exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  // Flush logs, close DB connections, then exit
  process.exit(1); // let PM2/Docker restart the process
});

// 2. Unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
  process.exit(1);
});

// 3. Graceful shutdown — close connections cleanly
const gracefulShutdown = async (signal) => {
  console.log(\`\${signal} received — shutting down gracefully\`);

  // Stop accepting new connections
  server.close(async () => {
    console.log('HTTP server closed');

    // Close database connections
    await mongoose.connection.close();
    await redisClient.quit();

    console.log('✓ All connections closed — exiting');
    process.exit(0);
  });

  // Force shutdown after 30s
  setTimeout(() => {
    console.error('FORCED shutdown after timeout');
    process.exit(1);
  }, 30_000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); // Docker stop
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));  // Ctrl+C`}
        </pre>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 15 — Testing
══════════════════════════════════════════════════════════════ */
function TestingDemo({ t }) {
  const [tab, setTab] = useState("unit");
  const [running2, setRunning2] = useState(false);
  const [results, setResults] = useState([]);

  const testSuites = {
    unit: [
      { name:"add(2, 3) === 5",            pass:true,  time:1 },
      { name:"divide(10, 0) throws error", pass:true,  time:2 },
      { name:"formatDate returns ISO string",pass:true, time:1 },
      { name:"validateEmail('bad') = false",pass:true, time:1 },
      { name:"hashPassword returns bcrypt", pass:true,  time:45 },
    ],
    integration: [
      { name:"POST /auth/register creates user",pass:true,  time:180 },
      { name:"POST /auth/login returns JWT",   pass:true,  time:210 },
      { name:"GET /users requires auth",        pass:true,  time:95 },
      { name:"POST /users validates body",      pass:true,  time:112 },
      { name:"DELETE /users/:id removes user",  pass:false, time:88, err:"Expected 204, got 500: MongoError" },
    ],
    e2e: [
      { name:"User can register and login",   pass:true,  time:1240 },
      { name:"User can create and view post", pass:true,  time:980 },
      { name:"Admin can delete any user",     pass:false, time:1100, err:"Timeout: element not found" },
      { name:"Password reset email sent",     pass:true,  time:2300 },
    ],
  };

  const runTests = async () => {
    setRunning2(true); setResults([]);
    const suite = testSuites[tab];
    for(let i = 0; i < suite.length; i++) {
      await new Promise(r => setTimeout(r, 200 + Math.random()*300));
      setResults(r => [...r, suite[i]]);
    }
    setRunning2(false);
  };

  const passed = results.filter(r=>r.pass).length;
  const failed = results.filter(r=>!r.pass).length;

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Testing — Unit, Integration & E2E with Jest & Supertest</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["Unit","unit"],["Integration","integration"],["E2E","e2e"]].map(([l,v]) => (
          <button key={v} onClick={() => { setTab(v); setResults([]); }} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        <div style={{ flex:"1 1 180px" }}>
          <button onClick={runTests} disabled={running2} style={{ width:"100%", background:running2?t.surface:`linear-gradient(135deg,${t.accent},#15803d)`, border:"none", borderRadius:8, padding:"10px", color:running2?t.muted:"#000", fontWeight:800, cursor:running2?"not-allowed":"pointer", fontSize:"0.85rem", marginBottom:10 }}>
            {running2 ? "⏳ Running tests…" : `▶ Run ${tab} tests`}
          </button>
          {results.length > 0 && (
            <div style={{ marginBottom:10, display:"flex", gap:8 }}>
              <div style={{ flex:1, background:`${t.accent}15`, border:`1px solid ${t.accentBorder}`, borderRadius:8, padding:"8px", textAlign:"center" }}>
                <div style={{ color:t.accent, fontWeight:900, fontSize:"1.4rem" }}>{passed}</div>
                <div style={{ color:t.muted, fontSize:"0.7rem" }}>passed</div>
              </div>
              <div style={{ flex:1, background:`${t.danger}15`, border:`1px solid ${t.danger}40`, borderRadius:8, padding:"8px", textAlign:"center" }}>
                <div style={{ color:t.danger, fontWeight:900, fontSize:"1.4rem" }}>{failed}</div>
                <div style={{ color:t.muted, fontSize:"0.7rem" }}>failed</div>
              </div>
            </div>
          )}
          {results.map((r,i) => (
            <div key={i} style={{ display:"flex", gap:8, padding:"6px 8px", borderRadius:7, marginBottom:3, background:r.pass?t.accentBg:t.danger+"15", border:`1px solid ${r.pass?t.accentBorder:t.danger+"40"}` }}>
              <span style={{ color:r.pass?t.accent:t.danger, fontSize:"0.85rem", flexShrink:0 }}>{r.pass?"✓":"✗"}</span>
              <div style={{ flex:1 }}>
                <div style={{ color:r.pass?t.text:t.danger, fontSize:"0.76rem" }}>{r.name}</div>
                {r.err && <div style={{ color:t.danger, fontSize:"0.68rem" }}>{r.err}</div>}
              </div>
              <code style={{ color:t.muted, fontSize:"0.68rem" }}>{r.time}ms</code>
            </div>
          ))}
          {running2 && results.length < testSuites[tab].length && (
            <div style={{ color:t.muted, fontSize:"0.75rem", padding:"4px 8px" }}>⏳ Running {results.length + 1}/{testSuites[tab].length}…</div>
          )}
        </div>
        <div style={{ flex:"1 1 220px" }}>
          <pre style={{ margin:0, background:"#020608", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.71rem", color:"#b0d8c8", lineHeight:1.8, overflow:"auto", maxHeight:320 }}>
{tab==="unit"?`// Unit test with Jest
// math.test.js
describe('Math Utils', () => {
  test('add(2, 3) returns 5', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('divide by zero throws error', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero');
  });
});

// Mocking
jest.mock('../services/emailService');
jest.spyOn(db, 'findOne').mockResolvedValue({ id: 1 });

// Async tests
test('creates user', async () => {
  const user = await createUser({ name: 'Alice' });
  expect(user).toHaveProperty('id');
  expect(user.name).toBe('Alice');
});`
:tab==="integration"?`// Integration test with Supertest
const request = require('supertest');
const app = require('../app');

describe('POST /auth/register', () => {
  beforeAll(() => connectDB());
  afterAll(() => disconnectDB());

  test('creates user and returns 201', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name:'Alice', email:'alice@test.io',
              password:'Password123!' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('alice@test.io');
  });

  test('validates required fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'invalid-email' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });
});`
:`// E2E test with Playwright
import { test, expect } from '@playwright/test';

test('user can register and create post', async ({ page }) => {
  // Register
  await page.goto('/register');
  await page.fill('[name=name]', 'Alice');
  await page.fill('[name=email]', 'alice@test.io');
  await page.fill('[name=password]', 'Password123!');
  await page.click('button[type=submit]');
  await expect(page).toHaveURL('/dashboard');

  // Create post
  await page.click('text=New Post');
  await page.fill('[name=title]', 'My First Post');
  await page.click('text=Publish');

  await expect(page.locator('h1')).toContainText('My First Post');
});`}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 16 — Deployment & Production
══════════════════════════════════════════════════════════════ */
function DeployDemo({ t }) {
  const [sel, setSel] = useState(0);
  const topics = [
    { label:"PM2", icon:"⚙️", color:"#4ade80",
      code:`# Install PM2 globally
npm install -g pm2

# Start app
pm2 start src/index.js --name "my-api"

# Cluster mode — use all CPU cores
pm2 start src/index.js -i max --name "my-api"

# Auto-restart on crash + memory limit
pm2 start src/index.js \\
  --max-memory-restart 500M \\
  --restart-delay 3000

# ecosystem.config.js (recommended)
module.exports = {
  apps: [{
    name: 'my-api',
    script: 'src/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: { NODE_ENV: 'production', PORT: 3000 },
    max_memory_restart: '500M',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
  }]
};

pm2 start ecosystem.config.js
pm2 save && pm2 startup  # survive reboots
pm2 monit                # real-time monitor
pm2 logs                 # tail logs` },
    { label:"Docker", icon:"🐳", color:"#38bdf8",
      code:`# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install deps first (layer caching)
COPY package*.json ./
RUN npm ci --omit=dev  # production only

# Copy source
COPY . .

# Security: run as non-root user
USER node

EXPOSE 3000
CMD ["node", "src/index.js"]

# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports: ["3000:3000"]
    env_file: .env
    depends_on: [mongo, redis]
    restart: unless-stopped

  mongo:
    image: mongo:7
    volumes: [mongo_data:/data/db]

  redis:
    image: redis:alpine

volumes:
  mongo_data:

# Commands
docker build -t my-api .
docker-compose up -d
docker-compose logs -f api` },
    { label:"Nginx", icon:"🔀", color:"#fbbf24",
      code:`# /etc/nginx/sites-available/myapp
server {
    listen 80;
    server_name api.myapp.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.myapp.com;

    ssl_certificate /etc/letsencrypt/live/myapp.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/myapp.com/privkey.pem;

    # Gzip compression
    gzip on;
    gzip_types application/json text/plain;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
    limit_req zone=api burst=20 nodelay;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}` },
    { label:"CI/CD", icon:"🔄", color:"#c084fc",
      code:`# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /app/my-api
            git pull origin main
            npm ci --omit=dev
            pm2 restart my-api` },
    { label:"Health & Monitoring", icon:"📊", color:"#fb923c",
      code:`// Health check endpoint
app.get('/health', async (req, res) => {
  const checks = {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    nodejs: process.version,
    env:    process.env.NODE_ENV,
  };

  // Check DB connection
  try {
    await mongoose.connection.db.admin().ping();
    checks.database = 'connected';
  } catch {
    checks.database = 'disconnected';
    return res.status(503).json({ status:'unhealthy', checks });
  }

  res.json({ status: 'healthy', checks });
});

// Structured logging with Winston
const winston = require('winston');
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info({
      method: req.method, url: req.url,
      status: res.statusCode, ms: Date.now() - start,
    });
  });
  next();
});` },
  ];
  const tp = topics[sel];
  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Deployment & Production — PM2, Docker, Nginx, CI/CD</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:14 }}>
        {topics.map((tp2,i) => (
          <button key={i} onClick={() => setSel(i)} style={{ background:sel===i?tp2.color+"30":t.surface, color:tp2.color, border:`2px solid ${sel===i?tp2.color:t.border}`, borderRadius:8, padding:"5px 12px", cursor:"pointer", fontWeight:700, fontSize:"0.78rem" }}>{tp2.icon} {tp2.label}</button>
        ))}
      </div>
      <div style={{ position:"relative", borderRadius:12, overflow:"hidden", border:`1px solid ${tp.color}40` }}>
        <div style={{ background:"#020608", padding:"14px 16px", overflowX:"auto", maxHeight:380, overflowY:"auto" }}>
          <pre style={{ margin:0, fontFamily:"monospace", fontSize:"0.76rem", color:tp.color, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{tp.code}</pre>
        </div>
        <CopyBtn code={tp.code}/>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SECTIONS
══════════════════════════════════════════════════════════════ */
const SECTIONS = [
  { id:"intro",   icon:"🟢", title:"What is Node.js?",       subtitle:"Event loop, V8 engine, non-blocking I/O, single-threaded concurrency",
    Demo:IntroDemo,
    body:"Node.js is a JavaScript runtime built on Chrome's V8 engine that lets you run JavaScript outside the browser. Its killer feature: the event loop — a single-threaded, non-blocking architecture that handles thousands of concurrent connections without spinning up a new OS thread per request. Created by Ryan Dahl in 2009, it revolutionized backend JavaScript.",
    code:`// Hello World HTTP server
const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify({ message: 'Hello, Node.js!' }));
});

server.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});

// Check Node.js info
console.log(process.version);       // Node.js version
console.log(process.platform);      // 'linux', 'darwin', 'win32'
console.log(process.env.NODE_ENV);  // environment
console.log(process.pid);           // process ID
console.log(process.uptime());      // seconds running
console.log(process.memoryUsage()); // memory stats

// Install and run
// node --version
// node index.js
// node --watch index.js  (built-in file watcher, Node 18+)`,
    tip:"Use Node.js 20+ LTS for production. Enable the built-in --watch flag instead of nodemon for development: node --watch server.js" },

  { id:"modules", icon:"📦", title:"Modules",                subtitle:"CommonJS require() vs ES Modules import — exports, imports, differences",
    Demo:ModulesDemo,
    body:"Node.js has two module systems. CommonJS (require/module.exports) is the original system — synchronous, widely supported. ES Modules (import/export) is the modern standard — supports top-level await, tree-shaking, and is how browsers work. New projects should use ES Modules. Set \"type\": \"module\" in package.json to enable them.",
    code:`// CommonJS (default)
// utils.js
function add(a, b) { return a + b; }
module.exports = { add };
module.exports.PI = 3.14159;

// app.js
const { add, PI } = require('./utils');
const fs = require('fs'); // built-in module

// ES Modules (add "type":"module" to package.json)
// utils.mjs
export const add = (a, b) => a + b;
export const PI = 3.14159;
function main() {}

// app.mjs
import main, { add, PI } from './utils.mjs';
import { readFile } from 'node:fs/promises'; // use 'node:' prefix

// __dirname equivalent in ESM
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Dynamic import (works in both systems)
const { default: lodash } = await import('lodash');`,
    tip:"Always use the node: prefix for built-in modules in new code: import from 'node:fs' instead of 'fs'. It's explicit, faster, and future-proof." },

  { id:"npm",     icon:"📋", title:"npm & package.json",     subtitle:"Dependencies, devDependencies, scripts, semver, npm commands",
    Demo:NpmDemo,
    body:"npm (Node Package Manager) is the world's largest software registry with over 2 million packages. package.json is your project manifest — it declares dependencies, scripts, metadata, and Node.js version requirements. Understanding semantic versioning (semver) is critical for avoiding unexpected breaking changes.",
    code:`# Initialize project
npm init -y                    # create package.json
npm install express            # add to dependencies
npm install -D nodemon jest    # add to devDependencies
npm install -g pm2             # global (available everywhere)
npm ci                         # clean install (uses package-lock.json)
npm update                     # update packages (respects semver ranges)
npm outdated                   # check for newer versions
npm audit                      # check for known vulnerabilities
npm audit fix                  # auto-fix vulnerabilities
npm prune                      # remove unused packages
npm link                       # link local package for development

# Useful flags
npm install --ignore-scripts   # skip postinstall scripts (security)
npm install --frozen-lockfile  # fail if lock would be updated (CI)

# package-lock.json
# → exact versions of every dep and sub-dep
# → ensures reproducible installs across all machines
# → ALWAYS commit this file to git!

# .npmrc — npm configuration file
registry=https://registry.npmjs.org/
save-exact=true                # pin exact versions (no ^ or ~)`,
    tip:"Use npm ci instead of npm install in CI/CD pipelines and Docker builds. It installs exactly what's in package-lock.json, is faster, and fails if lock file is outdated." },

  { id:"async",   icon:"⚡", title:"Async Patterns",         subtitle:"Callbacks, Promises, async/await, Promise.all, error handling",
    Demo:AsyncDemo,
    body:"JavaScript is single-threaded — async patterns are how Node.js handles I/O without blocking. Callbacks came first (messy, 'callback hell'). Promises improved chaining and error handling. Async/await (ES2017) is syntactic sugar over Promises that reads like synchronous code. Always use async/await in modern Node.js.",
    code:`// Promise combinators — very useful!

// Promise.all — all must succeed, runs in PARALLEL
const [user, posts, comments] = await Promise.all([
  getUser(id),     // all start simultaneously
  getPosts(id),
  getComments(id),
]);

// Promise.allSettled — get results even if some fail
const results = await Promise.allSettled([
  fetchFromAPI1(),
  fetchFromAPI2(),
  fetchFromAPI3(),
]);
results.forEach(r => {
  if (r.status === 'fulfilled') console.log(r.value);
  else console.error(r.reason);
});

// Promise.race — first to resolve/reject wins
const data = await Promise.race([
  fetch('/api/data'),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), 5000)
  ),
]);

// Promise.any — first to SUCCEED wins (ignores failures)
const fastest = await Promise.any([
  fetchFromRegion('us-east'),
  fetchFromRegion('eu-west'),
  fetchFromRegion('ap-south'),
]);

// Retry with exponential backoff
async function withRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try { return await fn(); }
    catch (err) {
      if (i === maxRetries - 1) throw err;
      await new Promise(r => setTimeout(r, 2 ** i * 1000));
    }
  }
}`,
    tip:"Never leave async errors unhandled. Add try/catch to every async function, and always have a global process.on('unhandledRejection') handler as a safety net." },

  { id:"fs",      icon:"📁", title:"File System",            subtitle:"fs.promises, readFile, writeFile, streams, path module",
    Demo:FileSystemDemo,
    body:"Node.js's built-in fs module provides full filesystem access. Always use the async fs.promises API — the synchronous variants block the event loop. For large files (video, CSV, logs), always use streams — they process data in chunks keeping memory usage constant regardless of file size. The path module handles OS-specific path separators.",
    code:`import { readFile, writeFile, mkdir, readdir, rename, rm, stat } from 'node:fs/promises';
import { createReadStream, createWriteStream, watch } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { createGzip, createGunzip } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Safe file operations with error handling
async function safeRead(filePath) {
  try {
    return await readFile(filePath, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') return null;   // file not found
    if (err.code === 'EACCES') throw new Error('Permission denied');
    throw err;
  }
}

// Watch for file changes
const watcher = watch('./src', { recursive: true }, (event, filename) => {
  console.log(\`\${event}: \${filename}\`);
});

// Compress and stream a file
async function compressFile(input, output) {
  await pipeline(
    createReadStream(input),
    createGzip(),
    createWriteStream(output),
  );
  console.log(\`Compressed: \${input} → \${output}\`);
}

// Walk directory recursively
async function* walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walkDir(fullPath);
    else yield fullPath;
  }
}`,
    tip:"Use fs.stat() or fs.access() to check if a file exists before reading, rather than try/catch. And always use path.join() or path.resolve() — never string concatenation for file paths." },

  { id:"http",    icon:"🌐", title:"HTTP Server",            subtitle:"http module, request/response, status codes, headers, REST methods",
    Demo:HttpDemo,
    body:"The built-in http module is the foundation of Node.js web development. It handles TCP connections, parses HTTP requests, and sends responses. In practice, you'll use Express (or Fastify/Hono) instead of raw http, but understanding the underlying model helps you debug, write middleware, and understand how frameworks work.",
    code:`const http = require('http');
const url  = require('url');

const server = http.createServer(async (req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  // Read JSON body
  const body = await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end',  ()    => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });

  // Route handling
  if (req.method === 'GET' && pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok' }));
  }

  if (req.method === 'POST' && pathname === '/api/users') {
    // create user logic…
    res.writeHead(201, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ id: 1, ...body }));
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(3000);

// But in production — use Express/Fastify!`,
    tip:"The built-in http module is great for learning but verbose for production. Use Express for familiar APIs, Fastify for high performance, or Hono for edge/serverless environments." },

  { id:"express", icon:"🚂", title:"Express.js",            subtitle:"Routing, params, query strings, middleware, error handlers",
    Demo:ExpressDemo,
    body:"Express is the most popular Node.js web framework — minimal, flexible, and battle-tested. It adds routing, middleware chaining, and request/response helpers on top of the built-in http module. The middleware pattern (functions that process req/res and call next()) is Express's core abstraction. Every feature — auth, logging, validation — is a middleware.",
    code:`const express = require('express');
const app = express();
const router = express.Router();

// Parse JSON and URL-encoded bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Route parameters
// GET /users/:id/posts/:postId
router.get('/users/:id/posts/:postId', async (req, res) => {
  const { id, postId } = req.params;   // route params
  const { page, limit } = req.query;   // query string
  const token = req.headers.authorization; // headers
  const body  = req.body;               // JSON body

  res.json({ userId: id, postId, page, limit });
});

// Chained route handlers
router.route('/users')
  .get(getUsers)
  .post(validate(userSchema), createUser);

router.route('/users/:id')
  .get(getUser)
  .put(validate(userSchema), updateUser)
  .delete(deleteUser);

// Mount router
app.use('/api/v1', router);

// 404 fallthrough
app.use('*', (req, res) => res.status(404).json({ error: 'Not found' }));

// Global error handler (4 params = error handler!)
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});`,
    tip:"Use express-async-errors package (or a catchAsync wrapper) to automatically forward async errors to your error handler — otherwise unhandled promise rejections crash the request." },

  { id:"middleware", icon:"🔗", title:"Middleware",          subtitle:"Auth, rate limiting, CORS, helmet, logging — request pipeline",
    Demo:MiddlewareDemo,
    body:"Middleware are functions that run between the HTTP request arriving and the route handler responding. They can read/modify req and res, end the request-response cycle, or call next() to pass control to the next middleware. Middleware runs in the order it's registered — order matters! Authentication must come before authorization, body parsing before route handlers.",
    code:`// Anatomy of middleware
const myMiddleware = (req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  req.requestTime = Date.now();  // add to request
  next(); // call next middleware / route handler
  // OR: res.status(401).json({error: 'No token'}); // end chain
};

// Error-handling middleware (4 params)
const errorMiddleware = (err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
};

// JWT Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw Object.assign(new Error('No token'), { status: 401 });
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) { next(err); }
};

// Role authorization
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role))
    return next(Object.assign(new Error('Forbidden'), { status: 403 }));
  next();
};

// Usage
app.get('/admin', authenticate, authorize('admin'), adminHandler);

// Rate limiter (npm: express-rate-limit)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  message: { error: 'Too many requests' },
});
app.use('/api/', limiter);`,
    tip:"Order your middleware carefully: helmet → cors → morgan → body-parser → rate limiter → authenticate → routes. Putting rate limiting before authentication prevents brute force attacks even on unauthenticated endpoints." },

  { id:"rest",    icon:"🗺️", title:"REST API Design",        subtitle:"HTTP verbs, status codes, naming conventions, versioning, best practices",
    Demo:RestApiDemo,
    body:"REST (Representational State Transfer) is an architectural style for designing HTTP APIs. Key principles: resources identified by URLs (nouns, not verbs), HTTP methods express operations (GET=read, POST=create, PUT=replace, PATCH=update, DELETE=remove), stateless (no server-side session), and proper status codes. Well-designed REST APIs are intuitive and self-documenting.",
    code:`// Complete REST resource example
// router/users.js
const router = express.Router();

// GET /users — list with pagination, filtering, sorting
router.get('/', authenticate, async (req, res) => {
  const { page=1, limit=20, sort='createdAt', order='desc', search } = req.query;

  const query = search ? { name: { $regex: search, $options: 'i' } } : {};
  const [users, total] = await Promise.all([
    User.find(query).sort({ [sort]: order }).skip((page-1)*limit).limit(+limit),
    User.countDocuments(query),
  ]);

  res.json({
    data: users,
    meta: { page: +page, limit: +limit, total, pages: Math.ceil(total/limit) },
  });
});

// POST /users — create
router.post('/', authenticate, authorize('admin'), validate(createUserSchema),
  async (req, res) => {
    const user = await User.create(req.body);
    res.status(201)
       .header('Location', \`/api/v1/users/\${user._id}\`)
       .json({ data: user });
  }
);

// PATCH /users/:id — partial update
router.patch('/:id', authenticate, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id, { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ data: user });
});`,
    tip:"Return a Location header after POST requests with the URL of the new resource. This is standard REST practice: res.header('Location', '/api/users/123').status(201).json(newUser)" },

  { id:"events",  icon:"📡", title:"Events & EventEmitter",  subtitle:"Pub/sub pattern, custom events, decoupling application components",
    Demo:EventsDemo,
    body:"Node.js's EventEmitter is the backbone of its async nature — HTTP servers, streams, and most core modules are EventEmitters. Use custom events to decouple your application logic: instead of tightly coupling OrderService to EmailService, have OrderService emit 'order:created' and let EmailService listen. This makes your code more maintainable and testable.",
    code:`const { EventEmitter } = require('events');

// Application-level event bus
class AppEvents extends EventEmitter {}
const events = new AppEvents();
events.setMaxListeners(50); // increase from default 10

// Service emits events — doesn't know who's listening
class OrderService {
  async createOrder(userId, items) {
    const order = await db.orders.create({ userId, items });
    events.emit('order:created', order);
    return order;
  }
  async cancelOrder(orderId) {
    const order = await db.orders.update(orderId, { status: 'cancelled' });
    events.emit('order:cancelled', order);
    return order;
  }
}

// Independent services listen and react
class EmailService {
  constructor() {
    events.on('order:created',   this.sendConfirmation.bind(this));
    events.on('order:cancelled', this.sendCancellation.bind(this));
  }
  async sendConfirmation(order) { /* send email */ }
}

class InventoryService {
  constructor() {
    events.on('order:created', this.reserveItems.bind(this));
    events.on('order:cancelled', this.releaseItems.bind(this));
  }
}

// Initialize — order matters for nothing!
new EmailService();
new InventoryService();
const orders = new OrderService();`,
    tip:"Use events.setMaxListeners(0) or a higher number if you add many listeners — Node.js warns at 10 to detect memory leaks, but large apps legitimately need more." },

  { id:"streams", icon:"🌊", title:"Streams & Buffers",      subtitle:"Readable, Writable, Duplex, Transform — memory-efficient data processing",
    Demo:StreamsDemo,
    body:"Streams are Node.js's solution to handling large amounts of data without loading it all into memory. Instead of reading an entire 2GB file then processing it, streams deliver chunks (default 64KB each) as they arrive. This keeps memory usage constant. Every major I/O operation in Node.js is stream-based: HTTP requests/responses, file I/O, database queries.",
    code:`import { Readable, Writable, Transform, pipeline } from 'node:stream';
import { pipeline as pipelineAsync } from 'node:stream/promises';

// Custom Transform stream — process CSV line by line
class CSVToJSON extends Transform {
  constructor() {
    super({ objectMode: true });
    this.headers = null;
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    const lines = this.buffer.split('\\n');
    this.buffer = lines.pop(); // save incomplete line

    for (const line of lines) {
      if (!this.headers) { this.headers = line.split(','); continue; }
      const row = Object.fromEntries(
        line.split(',').map((val, i) => [this.headers[i], val.trim()])
      );
      this.push(row); // push to next stream
    }
    callback();
  }
}

// Process 10GB CSV with constant ~64KB memory!
await pipelineAsync(
  fs.createReadStream('users-10gb.csv'),
  new CSVToJSON(),
  new Transform({
    objectMode: true,
    transform(row, _, cb) { cb(null, JSON.stringify(row) + '\\n'); }
  }),
  fs.createWriteStream('output.ndjson'),
);`,
    tip:"Use stream.pipeline() (or the promisified version) instead of .pipe() — it properly handles errors and cleanup. .pipe() silently fails to clean up streams on error, causing memory leaks." },

  { id:"auth",    icon:"🔑", title:"Authentication",         subtitle:"JWT tokens, bcrypt password hashing, refresh tokens, OAuth",
    Demo:AuthDemo,
    body:"Authentication verifies who the user is. Two key tools: JWT (JSON Web Tokens) for stateless session management — signed tokens that contain user data, and bcrypt for password hashing — a deliberately slow algorithm that makes brute-force attacks expensive. Never store plain passwords. Use the refresh token pattern in production for better security.",
    code:`// Complete auth setup
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const crypto  = require('crypto');

// Registration
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email taken' });

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hash });

    const token = signToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name, email } });
  } catch(err) { next(err); }
});

// Middleware factory
const signToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });

// OAuth2 (Passport.js)
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');

passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ googleId: profile.id });
  if (!user) user = await User.create({ googleId: profile.id, name: profile.displayName });
  done(null, user);
}));`,
    tip:"Store JWTs in httpOnly cookies, not localStorage. localStorage is vulnerable to XSS attacks. Use sameSite:'strict' and secure:true cookie flags for CSRF protection." },

  { id:"env",     icon:"⚙️", title:"Environment & Config",   subtitle:".env, process.env, config validation, secrets management",
    Demo:EnvDemo,
    body:"Environment variables are the standard way to configure Node.js applications across environments. The .env file (loaded by dotenv) holds local config. Never hardcode secrets or environment-specific values in code. Validate all required environment variables at startup — fail fast rather than crash mysteriously at runtime. Use different .env files per environment.",
    code:`// dotenv setup — load as early as possible
require('dotenv').config({ path: '.env.local' }); // or
import 'dotenv/config'; // ES Module

// ── Validation with envalid or zod ──────────────────
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV:    z.enum(['development', 'staging', 'production']),
  PORT:        z.coerce.number().min(1024).max(65535).default(3000),
  MONGODB_URI: z.string().url(),
  JWT_SECRET:  z.string().min(32),
  JWT_EXPIRES: z.string().default('15m'),
  REDIS_URL:   z.string().url().optional(),
  LOG_LEVEL:   z.enum(['debug','info','warn','error']).default('info'),
  CORS_ORIGIN: z.string().url(),
  RATE_LIMIT:  z.coerce.number().default(100),
});

// Validate at startup — throws if invalid
const env = envSchema.parse(process.env);

// Type-safe config object
export const config = {
  port:       env.PORT,
  isProduction: env.NODE_ENV === 'production',
  db: { uri: env.MONGODB_URI },
  jwt: { secret: env.JWT_SECRET, expiresIn: env.JWT_EXPIRES },
  cors: { origin: env.CORS_ORIGIN },
  rateLimit: { max: env.RATE_LIMIT },
};`,
    tip:"Use zod or envalid to validate environment variables at startup with a clear schema. This prevents mysterious runtime errors from missing variables and documents what config the app needs." },

  { id:"errors2", icon:"🚨", title:"Error Handling",         subtitle:"Error types, global handlers, AppError class, graceful shutdown",
    Demo:ErrorHandlingDemo,
    body:"Proper error handling is what separates production-ready apps from tutorials. The key insight: separate operational errors (expected, like user not found) from programmer errors (bugs). Handle operational errors gracefully with proper HTTP responses. For programmer errors: log them, crash the process, and let your process manager (PM2/Docker) restart. Never swallow errors silently.",
    code:`// AppError — operational error with HTTP status
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Factory functions
const notFound   = (msg) => new AppError(msg, 404, 'NOT_FOUND');
const forbidden  = (msg) => new AppError(msg, 403, 'FORBIDDEN');
const badRequest = (msg) => new AppError(msg, 400, 'BAD_REQUEST');

// Async wrapper — no try/catch boilerplate in routes
const catchAsync = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Routes throw errors naturally
router.get('/users/:id', catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw notFound('User not found');
  if (!req.user.canView(user)) throw forbidden('Access denied');
  res.json(user);
}));

// Global handler interprets all errors
app.use((err, req, res, next) => {
  const { statusCode = 500, message, isOperational, code } = err;
  logger.error({ err, url: req.url });  // always log!
  if (!isOperational) {
    // Programmer error — crash after response
    setTimeout(() => process.exit(1), 500);
  }
  res.status(statusCode).json({
    error: { code, message: isOperational ? message : 'Server error' }
  });
});`,
    tip:"Use a centralized error handler with an AppError class and catchAsync wrapper from day one. Retrofitting error handling into a large codebase is painful. Set it up in your project template." },

  { id:"testing", icon:"🧪", title:"Testing",                subtitle:"Jest, Supertest, unit/integration/E2E tests, mocking, coverage",
    Demo:TestingDemo,
    body:"Testing is how you deploy with confidence. Unit tests verify individual functions in isolation (fast, no I/O). Integration tests verify routes and database interactions together. E2E tests simulate real user behavior in a browser. Aim for 80%+ coverage on business logic. Test the behavior, not the implementation — tests should survive refactoring.",
    code:`// jest.config.js
{
  testEnvironment: 'node',
  coverageThreshold: {
    global: { branches: 80, functions: 85, lines: 85 }
  },
  setupFilesAfterFramework: ['./tests/setup.js'],
};

// tests/setup.js
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod;
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
afterEach(async () => {
  await Promise.all(
    Object.values(mongoose.connection.collections)
      .map(col => col.deleteMany({}))
  );
});

// Integration test
import request from 'supertest';
import app from '../src/app.js';

describe('User API', () => {
  test('GET /users returns empty array', async () => {
    const { body, status } = await request(app)
      .get('/api/v1/users')
      .set('Authorization', \`Bearer \${getAdminToken()}\`);
    expect(status).toBe(200);
    expect(body.data).toEqual([]);
    expect(body.meta.total).toBe(0);
  });
});`,
    tip:"Use mongodb-memory-server for integration tests — it spins up a real MongoDB in memory, so tests are fast, isolated, and don't touch your dev database." },

  { id:"deploy",  icon:"🚀", title:"Deployment & Production",  subtitle:"PM2, Docker, Nginx, CI/CD, logging, health checks, monitoring",
    Demo:DeployDemo,
    body:"Deploying Node.js to production involves several layers: PM2 or Docker for process management (auto-restart on crash), Nginx as a reverse proxy (SSL termination, rate limiting, static files), CI/CD for automated testing and deployment, environment variables for config, structured logging, and health check endpoints for monitoring.",
    code:`// Production-ready server setup
import express from 'express';
import { createServer } from 'http';

const app = express();
const server = createServer(app);

// ── Health endpoint ──────────────────────────────────
app.get('/health', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ status: 'healthy', uptime: process.uptime(),
               memory: process.memoryUsage().heapUsed });
  } catch {
    res.status(503).json({ status: 'unhealthy' });
  }
});

// ── Cluster for multi-core ───────────────────────────
import cluster from 'cluster';
import os from 'os';

if (cluster.isPrimary) {
  const cpus = os.cpus().length;
  console.log(\`Primary \${process.pid} — forking \${cpus} workers\`);
  for (let i = 0; i < cpus; i++) cluster.fork();
  cluster.on('exit', (worker) => {
    console.log(\`Worker \${worker.pid} died — restarting\`);
    cluster.fork();
  });
} else {
  server.listen(process.env.PORT || 3000);
  console.log(\`Worker \${process.pid} started\`);
}

// ── Zero-downtime deployment ─────────────────────────
// pm2 reload my-api  (rolling restart, no downtime)
// pm2 deploy ecosystem.config.js production`,
    tip:"Use PM2's cluster mode in production to utilize all CPU cores. A server with 8 cores can handle 8x the requests. Run pm2 start app.js -i max and PM2 auto-detects core count." },
];

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
function NodeJSMasterclass() {
  const [dark, setDark]       = useState(true);
  const [activeId, setActiveId] = useState("intro");
  const [search, setSearch]   = useState("");
  const [done, setDone]       = useState(new Set());
  const mainRef   = useRef(null);
  const activeRef = useRef(null);
  const t = T[dark ? "dark" : "light"];

  const filtered = SECTIONS.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.subtitle.toLowerCase().includes(search.toLowerCase())
  );
  const current = SECTIONS.find(s => s.id === activeId) || SECTIONS[0];
  const idx = SECTIONS.findIndex(s => s.id === activeId);
  const pct = Math.round((done.size / SECTIONS.length) * 100);
  const { Demo } = current;

  const go = (id) => {
    setActiveId(id); setSearch("");
    setTimeout(() => mainRef.current?.scrollTo({ top:0, behavior:"smooth" }), 50);
  };
  const toggleDone = (id) => setDone(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  useEffect(() => { activeRef.current?.scrollIntoView({ block:"nearest", behavior:"smooth" }); }, [activeId]);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:t.bg, color:t.text, fontFamily:"'DM Sans','Segoe UI',sans-serif", overflow:"hidden", transition:"background .3s,color .3s" }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${t.border};border-radius:99px}
        ::-webkit-scrollbar-thumb:hover{background:${t.muted}}
        input[type=range]{-webkit-appearance:none;height:5px;border-radius:99px;outline:none;cursor:pointer}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:${t.accent};cursor:pointer}
      `}</style>

      {/* HEADER */}
      <header style={{ background:t.sidebar, borderBottom:`1px solid ${t.border}`, height:56, padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:`linear-gradient(135deg,#4ade80,#15803d)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem", flexShrink:0 }}>🟢</div>
          <div>
            <div style={{ fontWeight:800, fontSize:"0.95rem", letterSpacing:"-0.02em", lineHeight:1.1 }}>Node.js Masterclass</div>
            <div style={{ color:t.muted, fontSize:"0.67rem" }}>Complete interactive guide · {SECTIONS.length} lessons</div>
          </div>
          <span style={{ background:t.accentBg, color:t.accent, border:`1px solid ${t.accentBorder}`, borderRadius:20, padding:"1px 9px", fontSize:"0.68rem", fontWeight:800 }}>v20 LTS</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <div style={{ width:90, height:5, background:t.border, borderRadius:99, overflow:"hidden" }}>
              <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${t.accent},${t.teal})`, borderRadius:99, transition:"width .5s" }}/>
            </div>
            <span style={{ fontSize:"0.7rem", color:t.muted, fontWeight:700 }}>{done.size}/{SECTIONS.length}</span>
          </div>
          <button onClick={() => setDark(d=>!d)} style={{ background:t.surface2, border:`1px solid ${t.border}`, borderRadius:8, padding:"5px 12px", cursor:"pointer", color:t.text, fontSize:"0.8rem", fontWeight:600 }}>
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        {/* SIDEBAR */}
        <aside style={{ width:252, flexShrink:0, background:t.sidebar, borderRight:`1px solid ${t.border}`, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ padding:"12px 12px 10px", borderBottom:`1px solid ${t.border}`, flexShrink:0 }}>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", color:t.muted, pointerEvents:"none" }}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search lessons…"
                style={{ width:"100%", padding:"7px 28px", background:t.surface2, border:`1px solid ${t.border}`, borderRadius:8, color:t.text, fontSize:"0.82rem", outline:"none" }}/>
              {search && <button onClick={()=>setSearch("")} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:t.muted, cursor:"pointer", fontSize:"1.1rem", padding:0, lineHeight:1 }}>×</button>}
            </div>
          </div>
          <div style={{ padding:"9px 12px", borderBottom:`1px solid ${t.border}`, flexShrink:0 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontSize:"0.68rem", fontWeight:700, color:t.muted, textTransform:"uppercase", letterSpacing:"0.06em" }}>Progress</span>
              <span style={{ fontSize:"0.68rem", color:t.accent, fontWeight:700 }}>{pct}%</span>
            </div>
            <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
              {SECTIONS.map(s => (
                <div key={s.id} onClick={()=>go(s.id)} title={s.title}
                  style={{ width:11, height:11, borderRadius:3, background:done.has(s.id)?"#4ade80":s.id===activeId?t.accent:t.border, cursor:"pointer", transition:"background .2s" }}/>
              ))}
            </div>
          </div>
          <nav style={{ flex:1, overflowY:"auto", padding:"6px 8px", minHeight:0 }}>
            {filtered.length===0 && <div style={{ padding:"24px 10px", textAlign:"center", color:t.muted, fontSize:"0.82rem" }}>No lessons found</div>}
            {filtered.map(s => {
              const isActive = s.id === activeId;
              return (
                <button key={s.id} ref={isActive?activeRef:null} onClick={()=>go(s.id)}
                  style={{ width:"100%", textAlign:"left", padding:"8px 10px", background:isActive?t.accentBg:"transparent", border:`1px solid ${isActive?t.accentBorder:"transparent"}`, borderRadius:8, marginBottom:2, cursor:"pointer", color:isActive?t.accent:t.text, display:"flex", alignItems:"center", gap:8, fontSize:"0.83rem", fontWeight:isActive?700:400, transition:"all .15s" }}>
                  <span style={{ fontSize:"0.95rem", flexShrink:0 }}>{s.icon}</span>
                  <span style={{ flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title}</span>
                  {done.has(s.id) && <span style={{ color:t.accent, fontSize:"0.7rem", flexShrink:0 }}>✓</span>}
                </button>
              );
            })}
          </nav>
          <div style={{ padding:"8px 12px", borderTop:`1px solid ${t.border}`, flexShrink:0, textAlign:"center" }}>
            <span style={{ fontSize:"0.68rem", color:t.muted }}>Event Loop to Production Deploy</span>
          </div>
        </aside>

        {/* MAIN */}
        <main ref={mainRef} style={{ flex:1, overflowY:"auto", padding:"28px 32px", minWidth:0 }}>
          <div style={{ maxWidth:860, margin:"0 auto" }}>
            <div style={{ marginBottom:22 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <span style={{ fontSize:"0.7rem", background:t.accentBg, color:t.accent, border:`1px solid ${t.accentBorder}`, borderRadius:20, padding:"2px 10px", fontWeight:800, letterSpacing:"0.06em" }}>LESSON {idx+1} / {SECTIONS.length}</span>
              </div>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:"2.4rem" }}>{current.icon}</span>
                  <div>
                    <h2 style={{ margin:0, fontSize:"1.5rem", fontWeight:800, letterSpacing:"-0.03em", lineHeight:1.1 }}>{current.title}</h2>
                    <p style={{ margin:"3px 0 0", color:t.muted, fontSize:"0.87rem" }}>{current.subtitle}</p>
                  </div>
                </div>
                <button onClick={()=>toggleDone(current.id)}
                  style={{ background:done.has(current.id)?"#4ade8020":t.surface2, border:`1px solid ${done.has(current.id)?"#4ade8060":t.border}`, color:done.has(current.id)?t.accent:t.muted, borderRadius:10, padding:"8px 16px", cursor:"pointer", fontSize:"0.8rem", fontWeight:700, whiteSpace:"nowrap" }}>
                  {done.has(current.id) ? "✓ Completed" : "Mark done"}
                </button>
              </div>
            </div>

            <p style={{ color:t.muted, lineHeight:1.78, fontSize:"0.9rem", marginBottom:24 }}>{current.body}</p>

            {Demo && (
              <div style={{ marginBottom:24, animation:"fadeIn .3s ease" }}>
                <SLabel color={t.accent}>Interactive Demo</SLabel>
                <Demo t={t} />
              </div>
            )}

            <div style={{ marginBottom:24 }}>
              <SLabel color="#15803d">Code Example</SLabel>
              <Code code={current.code} t={t} />
            </div>

            <div style={{ marginBottom:32 }}>
              <Tip text={current.tip} t={t} />
            </div>

            <div style={{ display:"flex", gap:10, alignItems:"center", borderTop:`1px solid ${t.border}`, paddingTop:22 }}>
              <button onClick={()=>idx>0&&go(SECTIONS[idx-1].id)} disabled={idx===0}
                style={{ background:t.surface2, border:`1px solid ${t.border}`, color:idx===0?t.muted:t.text, borderRadius:10, padding:"10px 18px", cursor:idx===0?"not-allowed":"pointer", fontSize:"0.85rem", fontWeight:600, opacity:idx===0?.45:1 }}>← Prev</button>
              <div style={{ flex:1, textAlign:"center", fontSize:"0.78rem", color:t.muted }}>{idx+1} of {SECTIONS.length}</div>
              <button onClick={()=>{ if(idx<SECTIONS.length-1){ toggleDone(current.id); go(SECTIONS[idx+1].id); }}} disabled={idx===SECTIONS.length-1}
                style={{ background:idx===SECTIONS.length-1?t.surface2:`linear-gradient(135deg,${t.accent},#15803d)`, border:"none", color:idx===SECTIONS.length-1?t.muted:"#000", borderRadius:10, padding:"10px 20px", cursor:idx===SECTIONS.length-1?"not-allowed":"pointer", fontSize:"0.85rem", fontWeight:700, opacity:idx===SECTIONS.length-1?.45:1, boxShadow:idx===SECTIONS.length-1?"none":`0 4px 14px ${t.accent}45` }}>Next →</button>
            </div>
            <div style={{ height:40 }}/>
          </div>
        </main>
      </div>
    </div>
  );
}
