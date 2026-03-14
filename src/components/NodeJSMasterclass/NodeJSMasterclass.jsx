import { useState, useRef, useEffect } from "react";

/* ── THEME ────────────────────────────────────────────── */
const T = {
  dark: {
    bg: "#03080a",
    sidebar: "#060f12",
    surface: "#091318",
    surface2: "#0d1c22",
    border: "#14303a",
    text: "#d0f0e0",
    muted: "#3d6a78",
    accent: "#4ade80",
    accentBg: "#4ade8010",
    accentBorder: "#4ade8035",
    danger: "#f87171",
    warn: "#fbbf24",
    info: "#38bdf8",
    purple: "#c084fc",
    orange: "#fb923c",
    teal: "#2dd4bf",
  },
  light: {
    bg: "#f0fbf4",
    sidebar: "#ffffff",
    surface: "#ffffff",
    surface2: "#e4f7ec",
    border: "#b8e4ca",
    text: "#041208",
    muted: "#2d6045",
    accent: "#16a34a",
    accentBg: "#16a34a10",
    accentBorder: "#16a34a35",
    danger: "#dc2626",
    warn: "#d97706",
    info: "#0284c7",
    purple: "#7c3aed",
    orange: "#ea580c",
    teal: "#0d9488",
  },
};

/* ── SHARED ───────────────────────────────────────────── */
function CopyBtn({ code }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(code);
        setOk(true);
        setTimeout(() => setOk(false), 2000);
      }}
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        background: ok ? "#4ade8022" : "#ffffff0e",
        border: `1px solid ${ok ? "#4ade8066" : "#ffffff18"}`,
        color: ok ? "#4ade80" : "#3d6a78",
        borderRadius: 6,
        padding: "3px 10px",
        fontSize: "0.72rem",
        cursor: "pointer",
        fontFamily: "monospace",
        transition: "all .2s",
      }}
    >
      {ok ? "✓ copied" : "copy"}
    </button>
  );
}

function Code({ code }) {
  const lines = code.trim().split("\n");
  const getColor = (l) => {
    const tr = l.trim();
    if (
      tr.startsWith("//") ||
      tr.startsWith("#") ||
      tr.startsWith("/*") ||
      tr.startsWith("*")
    )
      return "#2d5a40";
    if (/\b(require|import|export|from|module\.exports)\b/.test(l))
      return "#4ade80";
    if (
      /\b(const|let|var|function|async|await|return|class|new|if|else|try|catch|throw)\b/.test(
        l,
      )
    )
      return "#c084fc";
    if (
      /\b(app\.|router\.|server\.|http\.|fs\.|path\.|process\.|EventEmitter)\b/.test(
        l,
      )
    )
      return "#38bdf8";
    if (/\b(res\.|req\.|next\b)/.test(l)) return "#fbbf24";
    if (/"[^"]*"|'[^']*'/.test(l)) return "#86efac";
    if (/\b(true|false|null|undefined|\d+)\b/.test(l)) return "#fb923c";
    return "#b0d8c8";
  };
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #14303a",
      }}
    >
      <div
        style={{
          background: "#020608",
          padding: "14px 16px",
          overflowX: "auto",
        }}
      >
        <pre
          style={{
            margin: 0,
            fontFamily: "'Fira Code',monospace",
            fontSize: "0.78rem",
            lineHeight: 1.8,
          }}
        >
          {lines.map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 16 }}>
              <span
                style={{
                  color: "#14303a",
                  userSelect: "none",
                  minWidth: 20,
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span style={{ color: getColor(line) }}>{line || " "}</span>
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
    <div
      style={{
        background: `${t.warn}18`,
        border: `1px solid ${t.warn}45`,
        borderRadius: 10,
        padding: "12px 16px",
        display: "flex",
        gap: 10,
      }}
    >
      <span>💡</span>
      <p
        style={{
          margin: 0,
          fontSize: "0.85rem",
          color: t.text,
          lineHeight: 1.65,
        }}
      >
        <strong style={{ color: t.warn }}>Pro tip: </strong>
        {text}
      </p>
    </div>
  );
}

function SLabel({ children, color }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
      }}
    >
      <div
        style={{
          width: 3,
          height: 18,
          background: color || "#4ade80",
          borderRadius: 99,
        }}
      />
      <span
        style={{
          fontSize: "0.72rem",
          fontWeight: 700,
          color: "#3d6a78",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        {children}
      </span>
    </div>
  );
}

/* ══ DEMO 1 — Event Loop ═══════════════════════════════ */
function IntroDemo({ t }) {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [view, setView] = useState("loop");
  const timerRef = useRef(null);

  const steps = [
    {
      label: "1. Call Stack",
      color: "#4ade80",
      icon: "📥",
      desc: "Sync JS code runs here. Functions pushed on entry, popped on return. Blocking — one at a time.",
    },
    {
      label: "2. Web/Node APIs",
      color: "#38bdf8",
      icon: "⚙️",
      desc: "Async work handed off here (fs.readFile, setTimeout, fetch). Call stack is freed immediately.",
    },
    {
      label: "3. Callback Queue",
      color: "#fbbf24",
      icon: "📋",
      desc: "Completed async callbacks wait here until the call stack is empty.",
    },
    {
      label: "4. Microtask Queue",
      color: "#f472b6",
      icon: "⚡",
      desc: "Promise .then() and queueMicrotask() run here — BEFORE the callback queue. Higher priority.",
    },
    {
      label: "5. Event Loop",
      color: "#c084fc",
      icon: "🔄",
      desc: "Continuously checks: is call stack empty? If yes → moves next callback/microtask to stack.",
    },
    {
      label: "6. Result",
      color: "#a3e635",
      icon: "✅",
      desc: "Response sent. Loop keeps spinning — ready for the next request without creating a new thread.",
    },
  ];

  const runAnim = () => {
    if (running) return;
    setRunning(true);
    setStep(-1);
    let i = 0;
    timerRef.current = setInterval(() => {
      if (i >= steps.length) {
        clearInterval(timerRef.current);
        setRunning(false);
        setStep(-1);
        return;
      }
      setStep(i++);
    }, 3000);
  };
  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div
      style={{
        background: t.surface2,
        borderRadius: 14,
        padding: 20,
        border: `1px solid ${t.border}`,
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Node.js architecture — event loop & concurrency model
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[
          ["🔄 Event Loop", "loop"],
          ["⚔️ vs Threads", "compare"],
        ].map(([l, v]) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              background: view === v ? t.accentBg : t.surface,
              color: view === v ? t.accent : t.muted,
              border: `1px solid ${view === v ? t.accentBorder : t.border}`,
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.82rem",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {view === "loop" ? (
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px" }}>
            <button
              onClick={runAnim}
              disabled={running}
              style={{
                width: "100%",
                background: running
                  ? t.surface
                  : `linear-gradient(135deg,${t.accent},#15803d)`,
                border: "none",
                borderRadius: 8,
                padding: "10px",
                color: running ? t.muted : "#000",
                fontWeight: 800,
                cursor: running ? "not-allowed" : "pointer",
                marginBottom: 12,
              }}
            >
              {running ? "⏳ Running…" : "▶ Animate Event Loop"}
            </button>
            {steps.map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 8,
                  marginBottom: 4,
                  background:
                    step === i
                      ? `${s.color}25`
                      : step > i
                        ? `${t.accent}08`
                        : "transparent",
                  border: `1px solid ${step === i ? `${s.color}70` : step > i ? `${t.accent}20` : "transparent"}`,
                  transition: "all .4s",
                }}
              >
                <span style={{ fontSize: "1rem", flexShrink: 0 }}>
                  {s.icon}
                </span>
                <div>
                  <div
                    style={{
                      color: step >= i ? s.color : t.muted,
                      fontWeight: 700,
                      fontSize: "0.8rem",
                    }}
                  >
                    {s.label}
                  </div>
                  {step === i && (
                    <div
                      style={{
                        color: t.muted,
                        fontSize: "0.72rem",
                        marginTop: 2,
                        lineHeight: 1.5,
                      }}
                    >
                      {s.desc}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{ flex: "1 1 220px" }}>
            <pre
              style={{
                margin: 0,
                background: "#020608",
                border: `1px solid ${t.border}`,
                borderRadius: 10,
                padding: "12px 14px",
                fontFamily: "monospace",
                fontSize: "0.74rem",
                color: "#b0d8c8",
                lineHeight: 1.8,
              }}
            >
              {`// Event loop execution order demo:

console.log('1 — synchronous');

setTimeout(() => {
  console.log('4 — callback queue (macro)');
}, 0);

Promise.resolve().then(() => {
  console.log('3 — microtask queue');
});

console.log('2 — synchronous');

// Output ORDER:
// 1 — synchronous
// 2 — synchronous
// 3 — microtask queue   ← runs first!
// 4 — callback queue    ← runs after`}
            </pre>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            {
              icon: "🐢",
              label: "Traditional (PHP/Ruby)",
              model: "Thread per request",
              desc: "Each request gets its own OS thread (~2MB RAM). 1000 concurrent users = 2GB just for threads.",
              color: t.danger,
            },
            {
              icon: "⚡",
              label: "Node.js",
              model: "Single thread + Event Loop",
              desc: "One thread handles all requests via async I/O. While one request awaits DB, thousands of others are served.",
              color: t.accent,
            },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                flex: "1 1 220px",
                background: `${c.color}10`,
                border: `1px solid ${c.color}35`,
                borderRadius: 10,
                padding: "14px 16px",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: 6 }}>
                {c.icon}
              </div>
              <div
                style={{
                  color: c.color,
                  fontWeight: 800,
                  fontSize: "0.88rem",
                  marginBottom: 4,
                }}
              >
                {c.label}
              </div>
              <code
                style={{
                  display: "block",
                  background: `${c.color}20`,
                  borderRadius: 6,
                  padding: "4px 10px",
                  marginBottom: 8,
                  color: c.color,
                  fontSize: "0.75rem",
                }}
              >
                {c.model}
              </code>
              <div
                style={{
                  color: t.muted,
                  fontSize: "0.78rem",
                  lineHeight: 1.65,
                }}
              >
                {c.desc}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══ DEMO 2 — Modules ══════════════════════════════════ */
function ModulesDemo({ t }) {
  const [sys, setSys] = useState("cjs");
  const [tab, setTab] = useState("export");

  const modules = {
    cjs: {
      label: "CommonJS (require)",
      color: "#38bdf8",
      export: `// math.js — CommonJS exports
function add(a, b) { return a + b; }
const PI = 3.14159;

// Named exports
module.exports = { add, PI };

// Or add properties one by one
module.exports.subtract = (a, b) => a - b;

// Default (single) export pattern
module.exports = function greet(name) {
  return 'Hello, ' + name + '!';
};`,
      import: `// app.js — CommonJS imports

// Destructured named imports
const { add, PI } = require('./math');

// Whole module object
const math = require('./math');
math.add(2, 3);

// Built-in Node.js modules
const fs     = require('fs');
const path   = require('path');
const http   = require('http');
const os     = require('os');
const crypto = require('crypto');

// npm packages
const express = require('express');`,
      note: "require() is synchronous. Module is cached after first load — calling require('./math') twice returns the same object.",
    },
    esm: {
      label: "ES Modules (import)",
      color: "#4ade80",
      export: `// math.mjs — ES Module exports
// (set "type":"module" in package.json)

// Named exports
export function add(a, b) { return a + b; }
export const PI = 3.14159;

// Default export
function greet(name) {
  return 'Hello, ' + name + '!';
}

// Re-export from another module
export { something } from './other.js';
export * from './utils.js';`,
      import: `// app.mjs — ES Module imports

// Named imports
import { add, PI } from './math.mjs';

// Default import
import greet from './math.mjs';

// Both at once
import greet, { add, PI } from './math.mjs';

// Rename with 'as'
import { add as sum } from './math.mjs';

// Dynamic import (async — for code splitting)
const { add } = await import('./math.mjs');

// Built-ins use 'node:' prefix
import { readFile } from 'node:fs/promises';
import path from 'node:path';`,
      note: "ES Modules are the modern standard. Top-level await is supported. Note: __dirname and __filename are not available — use import.meta.url instead.",
    },
  };

  const mod = modules[sys];
  return (
    <div
      style={{
        background: t.surface2,
        borderRadius: 14,
        padding: 20,
        border: `1px solid ${t.border}`,
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Modules — CommonJS vs ES Modules
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {[
          ["CommonJS (CJS)", "cjs"],
          ["ES Modules (ESM)", "esm"],
        ].map(([l, v]) => (
          <button
            key={v}
            onClick={() => setSys(v)}
            style={{
              background: sys === v ? modules[v].color + "30" : t.surface,
              color: modules[v].color,
              border: `2px solid ${sys === v ? modules[v].color : t.border}`,
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.82rem",
            }}
          >
            {l}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {[
          ["Exporting", "export"],
          ["Importing", "import"],
        ].map(([l, v]) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            style={{
              background: tab === v ? t.accentBg : t.surface,
              color: tab === v ? t.accent : t.muted,
              border: `1px solid ${tab === v ? t.accentBorder : t.border}`,
              borderRadius: 7,
              padding: "5px 12px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.8rem",
            }}
          >
            {l}
          </button>
        ))}
      </div>
      <div
        style={{
          position: "relative",
          borderRadius: 12,
          overflow: "hidden",
          border: `1px solid ${mod.color}40`,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            background: "#020608",
            padding: "12px 14px",
            overflowX: "auto",
          }}
        >
          <pre
            style={{
              margin: 0,
              fontFamily: "monospace",
              fontSize: "0.76rem",
              color: mod.color,
              lineHeight: 1.8,
            }}
          >
            {mod[tab]}
          </pre>
        </div>
        <CopyBtn code={mod[tab]} />
      </div>
      <div
        style={{
          background: `${mod.color}12`,
          border: `1px solid ${mod.color}35`,
          borderRadius: 8,
          padding: "8px 12px",
        }}
      >
        <span
          style={{ color: mod.color, fontWeight: 700, fontSize: "0.77rem" }}
        >
          📝 Note:{" "}
        </span>
        <span style={{ color: t.muted, fontSize: "0.77rem" }}>{mod.note}</span>
      </div>
    </div>
  );
}

/* ══ DEMO 3 — npm ══════════════════════════════════════ */
function NpmDemo({ t }) {
  const [tab, setTab] = useState("pkg");
  const [semver, setSemver] = useState({ major: 2, minor: 4, patch: 1 });
  const [prefix, setPrefix] = useState("^");

  const semverRanges = [
    {
      prefix: "",
      label: "exact",
      desc: "Exact version — no updates ever",
      range: (s) => `${s.major}.${s.minor}.${s.patch}`,
    },
    {
      prefix: "^",
      label: "^",
      desc: "Allow minor + patch (same major)",
      range: (s) => `${s.major}.x.x (up to ${s.major + 1}.0.0)`,
    },
    {
      prefix: "~",
      label: "~",
      desc: "Allow patch only (same minor)",
      range: (s) => `${s.major}.${s.minor}.x`,
    },
    {
      prefix: ">=",
      label: ">=",
      desc: "This version or higher",
      range: (s) => `>= ${s.major}.${s.minor}.${s.patch}`,
    },
    {
      prefix: "*",
      label: "*",
      desc: "Any version (dangerous!)",
      range: () => "any version",
    },
  ];

  const scripts = [
    { name: "start", cmd: "node src/index.js", run: "npm start" },
    { name: "dev", cmd: "nodemon src/index.js", run: "npm run dev" },
    { name: "test", cmd: "jest --coverage", run: "npm test" },
    { name: "build", cmd: "tsc -p tsconfig.json", run: "npm run build" },
    { name: "lint", cmd: "eslint src", run: "npm run lint" },
  ];

  return (
    <div
      style={{
        background: t.surface2,
        borderRadius: 14,
        padding: 20,
        border: `1px solid ${t.border}`,
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        npm & package.json — dependency management
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[
          ["📦 package.json", "pkg"],
          ["🔢 Semver", "semver"],
          ["🚀 Scripts", "scripts"],
        ].map(([l, v]) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            style={{
              background: tab === v ? t.accentBg : t.surface,
              color: tab === v ? t.accent : t.muted,
              border: `1px solid ${tab === v ? t.accentBorder : t.border}`,
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.82rem",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "pkg" && (
        <pre
          style={{
            margin: 0,
            background: "#020608",
            border: `1px solid ${t.border}`,
            borderRadius: 10,
            padding: "14px 16px",
            fontFamily: "monospace",
            fontSize: "0.76rem",
            color: "#b0d8c8",
            lineHeight: 1.8,
            overflowX: "auto",
          }}
        >
          {`{
  "name": "my-api",
  "version": "1.0.0",
  "description": "Production REST API",
  "main": "src/index.js",
  "type": "module",
  "engines": { "node": ">=20.0.0" },
  "scripts": {
    "start": "node src/index.js",
    "dev":   "nodemon src/index.js",
    "test":  "jest --coverage",
    "lint":  "eslint src"
  },
  "dependencies": {
    "express":      "^4.18.2",
    "mongoose":     "^7.4.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs":     "^2.4.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest":    "^29.0.0",
    "eslint":  "^8.0.0"
  }
}`}
        </pre>
      )}

      {tab === "semver" && (
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 180px" }}>
            <div
              style={{
                color: t.muted,
                fontSize: "0.72rem",
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              Bump version:
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {[
                [
                  "MAJOR",
                  semver.major,
                  () =>
                    setSemver((s) => ({
                      major: s.major + 1,
                      minor: 0,
                      patch: 0,
                    })),
                  t.danger,
                ],
                [
                  "MINOR",
                  semver.minor,
                  () =>
                    setSemver((s) => ({ ...s, minor: s.minor + 1, patch: 0 })),
                  t.warn,
                ],
                [
                  "PATCH",
                  semver.patch,
                  () => setSemver((s) => ({ ...s, patch: s.patch + 1 })),
                  t.accent,
                ],
              ].map(([lbl, val, fn, col]) => (
                <div key={lbl} style={{ flex: 1, textAlign: "center" }}>
                  <div
                    style={{
                      color: col,
                      fontWeight: 900,
                      fontFamily: "monospace",
                      fontSize: "1.8rem",
                      lineHeight: 1,
                    }}
                  >
                    {val}
                  </div>
                  <div
                    style={{
                      color: t.muted,
                      fontSize: "0.65rem",
                      marginBottom: 4,
                    }}
                  >
                    {lbl}
                  </div>
                  <button
                    onClick={fn}
                    style={{
                      background: `${col}25`,
                      border: `1px solid ${col}50`,
                      color: col,
                      borderRadius: 5,
                      padding: "2px 8px",
                      cursor: "pointer",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                    }}
                  >
                    +1
                  </button>
                </div>
              ))}
            </div>
            <div
              style={{
                textAlign: "center",
                color: t.accent,
                fontFamily: "monospace",
                fontWeight: 900,
                fontSize: "1.2rem",
                marginBottom: 12,
              }}
            >
              {prefix}
              {semver.major}.{semver.minor}.{semver.patch}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {semverRanges.map((r) => (
                <button
                  key={r.prefix || "exact"}
                  onClick={() => setPrefix(r.prefix)}
                  style={{
                    background: prefix === r.prefix ? t.accentBg : t.surface,
                    color: prefix === r.prefix ? t.accent : t.muted,
                    border: `1px solid ${prefix === r.prefix ? t.accentBorder : t.border}`,
                    borderRadius: 6,
                    padding: "3px 10px",
                    cursor: "pointer",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: "1 1 200px" }}>
            {semverRanges.map((r) => (
              <div
                key={r.prefix || "exact"}
                style={{
                  background: prefix === r.prefix ? t.accentBg : t.surface,
                  border: `1px solid ${prefix === r.prefix ? t.accentBorder : t.border}`,
                  borderRadius: 8,
                  padding: "8px 12px",
                  marginBottom: 5,
                  transition: "all .2s",
                }}
              >
                <div
                  style={{
                    color: prefix === r.prefix ? t.accent : t.muted,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                  }}
                >
                  {r.prefix || "exact"}:{" "}
                  {prefix === r.prefix ? r.range(semver) : ""}
                </div>
                <div style={{ color: t.muted, fontSize: "0.72rem" }}>
                  {r.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "scripts" && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px" }}>
            {scripts.map((s, i) => (
              <div
                key={i}
                style={{
                  background: t.surface,
                  border: `1px solid ${t.border}`,
                  borderRadius: 9,
                  padding: "10px 12px",
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 3,
                  }}
                >
                  <code
                    style={{
                      color: t.accent,
                      fontWeight: 700,
                      fontSize: "0.82rem",
                    }}
                  >
                    "{s.name}"
                  </code>
                  <code style={{ color: t.muted, fontSize: "0.72rem" }}>
                    {s.run}
                  </code>
                </div>
                <code style={{ color: t.info, fontSize: "0.75rem" }}>
                  {s.cmd}
                </code>
              </div>
            ))}
          </div>
          <div style={{ flex: "1 1 180px" }}>
            <pre
              style={{
                margin: 0,
                background: "#020608",
                border: `1px solid ${t.border}`,
                borderRadius: 9,
                padding: "10px 12px",
                fontFamily: "monospace",
                fontSize: "0.74rem",
                color: "#b0d8c8",
                lineHeight: 1.8,
              }}
            >
              {`# Common npm commands
npm init -y          # create package.json
npm install express  # add dependency
npm install -D jest  # add devDependency
npm ci               # clean install (CI/CD)
npm update           # update packages
npm uninstall lodash # remove package
npm audit            # security check
npm audit fix        # auto-fix issues
npm list             # show installed
npm outdated         # show outdated

# Always commit package-lock.json!`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══ DEMO 4 — Async Patterns ═══════════════════════════ */
function AsyncDemo({ t }) {
  const [era, setEra] = useState("async");
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState([]);
  const [fail, setFail] = useState(false);
  const [promiseStatus, setPromiseStatus] = useState("idle");

  const eras = {
    callbacks: {
      label: "Callbacks",
      color: t.danger,
      code: `// Callback Hell — pyramid of doom
fs.readFile('user.json', (err, data) => {
  if (err) return console.error(err);
  const id = JSON.parse(data).id;

  db.getUser(id, (err, user) => {
    if (err) return console.error(err);

    db.getPosts(user.id, (err, posts) => {
      if (err) return console.error(err);

      // 3 levels deep... gets messy fast
      console.log(posts);
    });
  });
});`,
    },
    promises: {
      label: "Promises",
      color: t.warn,
      code: `// Promises — chainable, better error handling
readFile('user.json')
  .then(data => JSON.parse(data))
  .then(obj  => db.getUser(obj.id))
  .then(user => db.getPosts(user.id))
  .then(posts => console.log(posts))
  .catch(err => console.error(err));
  // One .catch() handles ALL errors!

// Creating a promise
const fetchUser = (id) =>
  new Promise((resolve, reject) => {
    db.query(id, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });`,
    },
    async: {
      label: "Async/Await",
      color: t.accent,
      code: `// Async/Await — reads like synchronous code
async function loadData(userId) {
  try {
    const data  = await readFile('user.json');
    const obj   = JSON.parse(data);
    const user  = await db.getUser(obj.id);
    const posts = await db.getPosts(user.id);
    return posts;
  } catch (err) {
    // Catches ALL errors in the chain
    console.error('Failed:', err.message);
    throw err;
  }
}

// Parallel — run all at once (faster!)
const [user, stats] = await Promise.all([
  getUser(id),
  getStats(id),
]);`,
    },
  };

  const simulate = async () => {
    setRunning(true);
    setLog([]);
    setPromiseStatus("pending");
    const add = (msg, col) =>
      setLog((l) => [...l, { msg, col, id: Date.now() + Math.random() }]);
    add("▶ Starting async operation…", t.accent);
    await new Promise((r) => setTimeout(r, 600));
    add("📤 Request sent (non-blocking)", t.info);
    await new Promise((r) => setTimeout(r, 800));
    add("⏳ Awaiting response…", t.warn);
    await new Promise((r) => setTimeout(r, 700));
    if (fail) {
      add("❌ Error caught by try/catch", t.danger);
      setPromiseStatus("rejected");
    } else {
      add("✅ Data received successfully!", t.accent);
      setPromiseStatus("resolved");
    }
    setRunning(false);
  };

  const cur = eras[era];
  return (
    <div
      style={{
        background: t.surface2,
        borderRadius: 14,
        padding: 20,
        border: `1px solid ${t.border}`,
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Async Patterns — Callbacks → Promises → Async/Await
      </p>
      <div
        style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}
      >
        {Object.entries(eras).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setEra(k)}
            style={{
              background: era === k ? `${v.color}30` : t.surface,
              color: v.color,
              border: `2px solid ${era === k ? v.color : t.border}`,
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.8rem",
            }}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 240px" }}>
          <div
            style={{
              position: "relative",
              borderRadius: 10,
              overflow: "hidden",
              border: `1px solid ${cur.color}40`,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                background: "#020608",
                padding: "12px 14px",
                overflowX: "auto",
                maxHeight: 260,
                overflowY: "auto",
              }}
            >
              <pre
                style={{
                  margin: 0,
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  color: cur.color,
                  lineHeight: 1.8,
                  whiteSpace: "pre-wrap",
                }}
              >
                {cur.code}
              </pre>
            </div>
            <CopyBtn code={cur.code} />
          </div>
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <label
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              cursor: "pointer",
              fontSize: "0.8rem",
              color: t.muted,
              marginBottom: 10,
            }}
          >
            <input
              type="checkbox"
              checked={fail}
              onChange={(e) => setFail(e.target.checked)}
              style={{ accentColor: t.danger, width: 14, height: 14 }}
            />
            Simulate failure
          </label>
          <button
            onClick={simulate}
            disabled={running}
            style={{
              width: "100%",
              background: running
                ? t.surface
                : `linear-gradient(135deg,${t.accent},#15803d)`,
              border: "none",
              borderRadius: 8,
              padding: "10px",
              color: running ? t.muted : "#000",
              fontWeight: 800,
              cursor: running ? "not-allowed" : "pointer",
              marginBottom: 10,
            }}
          >
            {running ? "⏳ Running…" : "▶ Simulate async call"}
          </button>
          {promiseStatus !== "idle" && (
            <div
              style={{
                background:
                  promiseStatus === "resolved" ? t.accentBg : t.danger + "15",
                border: `1px solid ${promiseStatus === "resolved" ? t.accentBorder : t.danger + "40"}`,
                borderRadius: 8,
                padding: "6px 10px",
                marginBottom: 8,
              }}
            >
              <code
                style={{
                  color: promiseStatus === "resolved" ? t.accent : t.danger,
                  fontSize: "0.8rem",
                  fontWeight: 700,
                }}
              >
                Promise: {promiseStatus}
              </code>
            </div>
          )}
          <div
            style={{
              background: "#020608",
              border: `1px solid ${t.border}`,
              borderRadius: 9,
              padding: "8px 10px",
              minHeight: 80,
            }}
          >
            {log.length === 0 ? (
              <div style={{ color: t.muted, fontSize: "0.75rem" }}>
                Run to see log…
              </div>
            ) : (
              log.map((l) => (
                <div
                  key={l.id}
                  style={{
                    color: l.col,
                    fontFamily: "monospace",
                    fontSize: "0.72rem",
                    marginBottom: 2,
                  }}
                >
                  {l.msg}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ DEMO 5 — File System ══════════════════════════════ */
function FileSystemDemo({ t }) {
  const [selOp, setSelOp] = useState(0);
  const [files, setFiles] = useState([
    { name: "index.js", type: "file", size: "2.4 KB" },
    { name: "package.json", type: "file", size: "1.1 KB" },
    { name: "src", type: "dir", size: "—" },
    { name: ".env", type: "file", size: "0.3 KB" },
    { name: "node_modules", type: "dir", size: "—" },
  ]);
  const [newName, setNewName] = useState("");
  const [log, setLog] = useState([]);
  const addLog = (msg, col) =>
    setLog((l) =>
      [{ msg, col: col || t.accent, id: Date.now() }, ...l].slice(0, 6),
    );

  const ops = [
    {
      name: "readFile",
      color: "#38bdf8",
      code: `import { readFile } from 'node:fs/promises';

// Read file as text
const text = await readFile('config.json', 'utf8');
const data = JSON.parse(text);

// Read as Buffer (binary)
const buffer = await readFile('image.png');

// Sync (blocks event loop — avoid in servers!)
const text2 = fs.readFileSync('file.txt', 'utf8');`,
    },
    {
      name: "writeFile",
      color: "#4ade80",
      code: `import { writeFile, appendFile } from 'node:fs/promises';

// Write (creates or overwrites)
await writeFile('output.txt', 'Hello World', 'utf8');

// Write JSON neatly
await writeFile('data.json',
  JSON.stringify(data, null, 2), 'utf8');

// Append to existing file
await appendFile('app.log',
  new Date().toISOString() + ' — Server started\n');`,
    },
    {
      name: "mkdir / readdir",
      color: "#c084fc",
      code: `import { mkdir, readdir, rm } from 'node:fs/promises';

// Create directory (recursive = create parents too)
await mkdir('src/utils/helpers', { recursive: true });

// List directory
const entries = await readdir('.', { withFileTypes: true });
const dirs  = entries.filter(e => e.isDirectory());
const files = entries.filter(e => e.isFile());

// Delete recursively
await rm('old-folder', { recursive: true, force: true });`,
    },
    {
      name: "Streams",
      color: "#fbbf24",
      code: `import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

// Stream large files — never loads fully into RAM
app.get('/download', (req, res) => {
  const stream = createReadStream('large-file.pdf');
  stream.pipe(res); // streams in ~64KB chunks
});

// Compress a file with streams
await pipeline(
  createReadStream('data.csv'),
  createGzip(),
  createWriteStream('data.csv.gz'),
);`,
    },
    {
      name: "path utils",
      color: "#fb923c",
      code: `import path from 'node:path';

const full = '/home/user/projects/api/src/index.js';

path.dirname(full);   // '/home/user/projects/api/src'
path.basename(full);  // 'index.js'
path.extname(full);   // '.js'

// Join paths safely (OS-independent)
path.join(__dirname, 'src', 'routes', 'users.js');

// __dirname in ES Modules:
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(
  fileURLToPath(import.meta.url)
);`,
    },
  ];

  const addFile = () => {
    if (!newName.trim()) return;
    const isDir = newName.endsWith("/");
    setFiles((f) => [
      ...f,
      {
        name: newName.replace("/", ""),
        type: isDir ? "dir" : "file",
        size: isDir ? "—" : "0 B",
      },
    ]);
    addLog("✓ Created: " + newName);
    setNewName("");
  };

  return (
    <div
      style={{
        background: t.surface2,
        borderRadius: 14,
        padding: 20,
        border: `1px solid ${t.border}`,
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        File System — fs module & path utilities
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {ops.map((op, i) => (
            <button
              key={i}
              onClick={() => setSelOp(i)}
              style={{
                textAlign: "left",
                background: selOp === i ? `${op.color}25` : t.surface,
                color: selOp === i ? op.color : t.muted,
                border: `1px solid ${selOp === i ? `${op.color}60` : t.border}`,
                borderRadius: 7,
                padding: "6px 14px",
                cursor: "pointer",
                fontSize: "0.78rem",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              {ops[i].name}
            </button>
          ))}
          <div
            style={{
              marginTop: 10,
              borderTop: `1px solid ${t.border}`,
              paddingTop: 10,
            }}
          >
            <div
              style={{ color: t.muted, fontSize: "0.7rem", marginBottom: 5 }}
            >
              File explorer:
            </div>
            <div style={{ display: "flex", gap: 5, marginBottom: 6 }}>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addFile()}
                placeholder="file.js or dir/"
                style={{
                  flex: 1,
                  padding: "5px 8px",
                  background: t.surface,
                  border: `1px solid ${t.border}`,
                  borderRadius: 6,
                  color: t.text,
                  fontSize: "0.76rem",
                  outline: "none",
                }}
              />
              <button
                onClick={addFile}
                style={{
                  background: t.accent,
                  border: "none",
                  borderRadius: 6,
                  padding: "5px 10px",
                  color: "#000",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.75rem",
                }}
              >
                +
              </button>
            </div>
            {files.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 6px",
                  borderRadius: 5,
                  marginBottom: 2,
                }}
              >
                <span style={{ fontSize: "0.8rem" }}>
                  {f.type === "dir" ? "📁" : "📄"}
                </span>
                <span
                  style={{
                    flex: 1,
                    color: f.type === "dir" ? t.info : t.text,
                    fontFamily: "monospace",
                    fontSize: "0.74rem",
                  }}
                >
                  {f.name}
                </span>
                <span style={{ color: t.muted, fontSize: "0.66rem" }}>
                  {f.size}
                </span>
                <button
                  onClick={() => {
                    setFiles((fl) => fl.filter((_, j) => j !== i));
                    addLog("🗑 Deleted: " + f.name, t.danger);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: t.muted,
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    padding: "0 2px",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            {log.length > 0 && (
              <div
                style={{
                  marginTop: 6,
                  background: "#020608",
                  border: `1px solid ${t.border}`,
                  borderRadius: 6,
                  padding: "5px 8px",
                }}
              >
                {log.map((l) => (
                  <div
                    key={l.id}
                    style={{
                      color: l.col,
                      fontFamily: "monospace",
                      fontSize: "0.68rem",
                      marginBottom: 1,
                    }}
                  >
                    {l.msg}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div
            style={{
              position: "relative",
              borderRadius: 10,
              overflow: "hidden",
              border: `1px solid ${ops[selOp].color}40`,
            }}
          >
            <div
              style={{
                background: "#020608",
                padding: "10px 12px",
                overflowX: "auto",
                maxHeight: 300,
                overflowY: "auto",
              }}
            >
              <pre
                style={{
                  margin: 0,
                  fontFamily: "monospace",
                  fontSize: "0.74rem",
                  color: ops[selOp].color,
                  lineHeight: 1.8,
                  whiteSpace: "pre-wrap",
                }}
              >
                {ops[selOp].code}
              </pre>
            </div>
            <CopyBtn code={ops[selOp].code} />
          </div>
        </div>
      </div>
    </div>
  );
}
/* ══ DEMO 6 — HTTP & Express ═══════════════════════════ */
function HttpExpressDemo({ t }) {
  const [method, setMethod] = useState("GET");
  const [urlPath, setUrlPath] = useState("/api/users");
  const [status, setStatus] = useState(null);
  const [respBody, setRespBody] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("client");

  const routes = {
    "GET /api/users": {
      status: 200,
      body: {
        users: [
          { id: 1, name: "Alice" },
          { id: 2, name: "Bob" },
        ],
        total: 2,
      },
    },
    "GET /api/users/1": {
      status: 200,
      body: { id: 1, name: "Alice", email: "alice@dev.io", role: "admin" },
    },
    "POST /api/users": {
      status: 201,
      body: { id: 3, name: "Charlie", message: "Created" },
    },
    "PUT /api/users/1": { status: 200, body: { id: 1, name: "Alice Updated" } },
    "DELETE /api/users/1": { status: 204, body: null },
    "GET /api/health": { status: 200, body: { status: "ok", uptime: 3600 } },
    "GET /notfound": { status: 404, body: { error: "Not Found" } },
  };

  const send = () => {
    setLoading(true);
    setTimeout(() => {
      const key = method + " " + urlPath;
      const r = routes[key] || {
        status: 404,
        body: { error: "Route not found" },
      };
      setStatus(r.status);
      setRespBody(r.body);
      setLoading(false);
    }, 500);
  };

  const statusColor = (s) =>
    !s
      ? t.muted
      : s < 300
        ? t.accent
        : s < 400
          ? t.info
          : s < 500
            ? t.warn
            : t.danger;
  const methodColors = {
    GET: t.accent,
    POST: t.info,
    PUT: t.warn,
    DELETE: t.danger,
  };
  const statusLabels = {
    200: "OK",
    201: "Created",
    204: "No Content",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
  };

  return (
    <div
      style={{
        background: t.surface2,
        borderRadius: 14,
        padding: 20,
        border: `1px solid ${t.border}`,
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        HTTP Server & Express.js — requests, routing, responses
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[
          ["🌐 HTTP Client", "client"],
          ["🚂 Express Setup", "setup"],
          ["⚠️ Error Handler", "errors"],
        ].map(([l, v]) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            style={{
              background: tab === v ? t.accentBg : t.surface,
              color: tab === v ? t.accent : t.muted,
              border: `1px solid ${tab === v ? t.accentBorder : t.border}`,
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.82rem",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "client" && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px" }}>
            <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
              {["GET", "POST", "PUT", "DELETE"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  style={{
                    flex: 1,
                    background:
                      method === m ? `${methodColors[m]}30` : t.surface,
                    color: methodColors[m],
                    border: `2px solid ${method === m ? methodColors[m] : t.border}`,
                    borderRadius: 6,
                    padding: "5px 0",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              <input
                value={urlPath}
                onChange={(e) => setUrlPath(e.target.value)}
                style={{
                  flex: 1,
                  padding: "7px 10px",
                  background: t.surface,
                  border: `1px solid ${t.border}`,
                  borderRadius: 7,
                  color: t.text,
                  fontSize: "0.82rem",
                  outline: "none",
                  fontFamily: "monospace",
                }}
              />
              <button
                onClick={send}
                disabled={loading}
                style={{
                  background: t.accent,
                  border: "none",
                  borderRadius: 7,
                  padding: "7px 16px",
                  color: "#000",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
                marginBottom: 10,
              }}
            >
              {Object.keys(routes).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    const [m, ...p] = r.split(" ");
                    setMethod(m);
                    setUrlPath(p.join(" "));
                    setStatus(null);
                  }}
                  style={{
                    background: t.surface,
                    border: `1px solid ${t.border}`,
                    borderRadius: 20,
                    padding: "2px 8px",
                    cursor: "pointer",
                    fontSize: "0.68rem",
                    color: t.muted,
                    fontFamily: "monospace",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
            {loading && (
              <div
                style={{ color: t.muted, textAlign: "center", padding: "16px" }}
              >
                ⏳ Sending request…
              </div>
            )}
            {status && !loading && (
              <div
                style={{
                  background: "#020608",
                  border: `1px solid ${t.border}`,
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "8px 12px",
                    borderBottom: `1px solid ${t.border}`,
                    display: "flex",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      color: statusColor(status),
                      fontWeight: 900,
                      fontFamily: "monospace",
                      fontSize: "0.95rem",
                    }}
                  >
                    {status}
                  </span>
                  <span
                    style={{ color: statusColor(status), fontSize: "0.8rem" }}
                  >
                    {statusLabels[status] || ""}
                  </span>
                </div>
                <div style={{ padding: "8px 12px" }}>
                  {respBody !== null ? (
                    <pre
                      style={{
                        margin: 0,
                        color: t.accent,
                        fontFamily: "monospace",
                        fontSize: "0.74rem",
                        lineHeight: 1.7,
                      }}
                    >
                      {JSON.stringify(respBody, null, 2)}
                    </pre>
                  ) : (
                    <div
                      style={{
                        color: t.muted,
                        fontStyle: "italic",
                        fontSize: "0.78rem",
                      }}
                    >
                      No body (204 No Content)
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div style={{ flex: "1 1 180px" }}>
            <div
              style={{
                color: t.muted,
                fontSize: "0.72rem",
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              HTTP Status codes:
            </div>
            {[
              [200, "OK"],
              [201, "Created (POST)"],
              [204, "No Content (DELETE)"],
              [400, "Bad Request"],
              [401, "Unauthorized"],
              [403, "Forbidden"],
              [404, "Not Found"],
              [429, "Rate Limited"],
              [500, "Server Error"],
            ].map(([code, desc]) => (
              <div
                key={code}
                style={{
                  display: "flex",
                  gap: 8,
                  padding: "3px 6px",
                  borderRadius: 5,
                  marginBottom: 2,
                }}
              >
                <code
                  style={{
                    color: statusColor(+code),
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    minWidth: 34,
                  }}
                >
                  {code}
                </code>
                <span style={{ color: t.muted, fontSize: "0.72rem" }}>
                  {desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "setup" && (
        <pre
          style={{
            margin: 0,
            background: "#020608",
            border: `1px solid ${t.border}`,
            borderRadius: 10,
            padding: "14px 16px",
            fontFamily: "monospace",
            fontSize: "0.75rem",
            color: "#b0d8c8",
            lineHeight: 1.8,
            overflowX: "auto",
          }}
        >
          {`const express = require('express');
const app = express();

// Parse JSON and form bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// npm security/logging packages
const cors   = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(helmet());        // sets security headers
app.use(morgan('dev'));   // request logging

// Route handlers
app.get('/api/users', async (req, res) => {
  const { limit = 10, page = 1 } = req.query;
  const users = await User.find()
    .limit(+limit).skip((+page - 1) * +limit);
  res.json({ users, total: users.length });
});

app.get('/api/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

app.post('/api/users', async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});

// Mount router files
app.use('/api/auth',  require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

app.listen(3000, () => console.log('Server on :3000'));`}
        </pre>
      )}

      {tab === "errors" && (
        <pre
          style={{
            margin: 0,
            background: "#020608",
            border: `1px solid ${t.border}`,
            borderRadius: 10,
            padding: "14px 16px",
            fontFamily: "monospace",
            fontSize: "0.75rem",
            color: "#b0d8c8",
            lineHeight: 1.8,
            overflowX: "auto",
          }}
        >
          {`// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Async wrapper — no try/catch in every route
const catchAsync = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Routes throw errors cleanly
router.get('/users/:id', catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  res.json(user);
}));

// 404 for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler — MUST have 4 params!
app.use((err, req, res, next) => {
  const code = err.statusCode || 500;
  const msg  = err.isOperational
    ? err.message
    : 'Internal Server Error';

  console.error(err.stack);
  res.status(code).json({ error: msg });
});`}
        </pre>
      )}
    </div>
  );
}

/* ══ DEMO 7 — Middleware ═══════════════════════════════ */
function MiddlewareDemo({ t }) {
  const [reqPath, setReqPath] = useState("/api/profile");
  const [token, setToken] = useState("Bearer valid_jwt_token");
  const [steps, setSteps] = useState([]);
  const [running, setRunning] = useState(false);

  const middlewares = [
    {
      name: "morgan (logging)",
      icon: "📝",
      color: "#38bdf8",
      desc: "Logs: method, URL, status, response time",
    },
    {
      name: "helmet (security)",
      icon: "🔒",
      color: "#c084fc",
      desc: "Sets HTTP security headers (CSP, HSTS, etc.)",
    },
    {
      name: "cors",
      icon: "🌐",
      color: "#fbbf24",
      desc: "Checks Origin, allows/blocks cross-origin",
    },
    {
      name: "express.json()",
      icon: "📦",
      color: "#fb923c",
      desc: "Parses raw JSON body → populates req.body",
    },
    {
      name: "rateLimiter",
      icon: "⏱️",
      color: "#f472b6",
      desc: "Checks requests per IP — blocks if over limit",
    },
    {
      name: "authenticate (JWT)",
      icon: "🔑",
      color: "#4ade80",
      desc: "Validates JWT token, attaches req.user",
    },
    {
      name: "authorize (role)",
      icon: "🛡️",
      color: "#a3e635",
      desc: "Checks req.user.role has permission",
    },
    {
      name: "Route Handler",
      icon: "🎯",
      color: "#4ade80",
      desc: "Your business logic runs here → send response",
    },
  ];

  const runRequest = async () => {
    setRunning(true);
    setSteps([]);
    const hasToken = token.includes("valid");
    const isProtected =
      reqPath.includes("profile") || reqPath.includes("admin");
    const isAdmin = reqPath.includes("admin");

    for (let i = 0; i < middlewares.length; i++) {
      await new Promise((r) => setTimeout(r, 280));
      if (i === 5 && isProtected && !hasToken) {
        setSteps((s) => [
          ...s,
          { idx: i, pass: false, note: "401 — Invalid or missing token" },
        ]);
        setRunning(false);
        return;
      }
      if (i === 6 && isAdmin && !token.includes("admin")) {
        setSteps((s) => [
          ...s,
          { idx: i, pass: false, note: "403 — Insufficient role" },
        ]);
        setRunning(false);
        return;
      }
      setSteps((s) => [...s, { idx: i, pass: true }]);
    }
    setRunning(false);
  };

  return (
    <div
      style={{
        background: t.surface2,
        borderRadius: 14,
        padding: 20,
        border: `1px solid ${t.border}`,
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Middleware — request pipeline visualization
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px" }}>
          <div style={{ marginBottom: 8 }}>
            <label
              style={{
                display: "block",
                color: t.muted,
                fontSize: "0.72rem",
                marginBottom: 3,
              }}
            >
              URL path:
            </label>
            <input
              value={reqPath}
              onChange={(e) => setReqPath(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "7px 10px",
                background: t.surface,
                border: `1px solid ${t.border}`,
                borderRadius: 7,
                color: t.text,
                fontSize: "0.8rem",
                outline: "none",
                fontFamily: "monospace",
              }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label
              style={{
                display: "block",
                color: t.muted,
                fontSize: "0.72rem",
                marginBottom: 3,
              }}
            >
              Authorization header:
            </label>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "7px 10px",
                background: t.surface,
                border: `1px solid ${t.border}`,
                borderRadius: 7,
                color: t.text,
                fontSize: "0.8rem",
                outline: "none",
                fontFamily: "monospace",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: 5,
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >
            {[
              ["Public", "/api/data", "no_token"],
              ["Profile", "/api/profile", "Bearer valid_jwt_token"],
              ["Admin", "/api/admin", "Bearer valid_jwt_token"],
            ].map(([l, p, tk]) => (
              <button
                key={l}
                onClick={() => {
                  setReqPath(p);
                  setToken(tk);
                  setSteps([]);
                }}
                style={{
                  background: t.surface,
                  border: `1px solid ${t.border}`,
                  borderRadius: 6,
                  padding: "4px 10px",
                  cursor: "pointer",
                  fontSize: "0.73rem",
                  color: t.muted,
                  fontWeight: 700,
                }}
              >
                {l}
              </button>
            ))}
          </div>
          <button
            onClick={runRequest}
            disabled={running}
            style={{
              width: "100%",
              background: running
                ? t.surface
                : `linear-gradient(135deg,${t.accent},#15803d)`,
              border: "none",
              borderRadius: 8,
              padding: "10px",
              color: running ? t.muted : "#000",
              fontWeight: 800,
              cursor: running ? "not-allowed" : "pointer",
            }}
          >
            {running ? "⏳ Processing…" : "▶ Send Request"}
          </button>
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <div
            style={{
              color: t.muted,
              fontSize: "0.72rem",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Middleware pipeline:
          </div>
          {middlewares.map((mw, i) => {
            const s = steps.find((x) => x.idx === i);
            const active = running && steps.length === i;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 8px",
                  borderRadius: 7,
                  marginBottom: 3,
                  background: s
                    ? s.pass
                      ? t.accentBg
                      : `${t.danger}15`
                    : active
                      ? `${mw.color}15`
                      : "transparent",
                  border: `1px solid ${s ? (s.pass ? t.accentBorder : `${t.danger}40`) : active ? `${mw.color}50` : "transparent"}`,
                  transition: "all .3s",
                }}
              >
                <span style={{ fontSize: "0.9rem", flexShrink: 0 }}>
                  {mw.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: s ? (s.pass ? t.accent : t.danger) : t.muted,
                      fontWeight: s || active ? 700 : 400,
                      fontSize: "0.78rem",
                      fontFamily: "monospace",
                    }}
                  >
                    {mw.name}
                  </div>
                  {s && !s.pass && (
                    <div style={{ color: t.danger, fontSize: "0.7rem" }}>
                      {s.note}
                    </div>
                  )}
                </div>
                {s && (
                  <span
                    style={{
                      color: s.pass ? t.accent : t.danger,
                      fontSize: "0.85rem",
                    }}
                  >
                    {s.pass ? "✓" : "✗"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══ DEMO 8 — REST API Design ══════════════════════════ */
function RestApiDemo({ t }) {
  const [tab, setTab] = useState("endpoints");
  const [selIdx, setSelIdx] = useState(0);
  const methodColors = {
    GET: t.accent,
    POST: t.info,
    PUT: t.warn,
    PATCH: t.orange,
    DELETE: t.danger,
  };

  const endpoints = [
    {
      method: "GET",
      path: "/api/v1/users",
      desc: "List all users",
      code: 200,
      body: '{"data":[...],"meta":{"total":100,"page":1}}',
    },
    {
      method: "GET",
      path: "/api/v1/users/:id",
      desc: "Get user by ID",
      code: 200,
      body: '{"id":1,"name":"Alice","email":"alice@dev.io"}',
    },
    {
      method: "POST",
      path: "/api/v1/users",
      desc: "Create new user",
      code: 201,
      body: '{"id":3,"name":"Charlie"}',
    },
    {
      method: "PUT",
      path: "/api/v1/users/:id",
      desc: "Full replace of user",
      code: 200,
      body: '{"id":1,"name":"Alice Updated"}',
    },
    {
      method: "PATCH",
      path: "/api/v1/users/:id",
      desc: "Partial update",
      code: 200,
      body: '{"id":1,"name":"Bob"}',
    },
    {
      method: "DELETE",
      path: "/api/v1/users/:id",
      desc: "Delete user",
      code: 204,
      body: "(empty — 204 No Content)",
    },
    {
      method: "GET",
      path: "/api/v1/users/:id/posts",
      desc: "Nested resource",
      code: 200,
      body: '[{"id":1,"title":"Post 1"}]',
    },
  ];

  const ep = endpoints[selIdx];

  return (
    <div
      style={{
        background: t.surface2,
        borderRadius: 14,
        padding: 20,
        border: `1px solid ${t.border}`,
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        REST API Design — conventions & best practices
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[
          ["Endpoints", "endpoints"],
          ["Best Practices", "best"],
          ["Versioning", "version"],
        ].map(([l, v]) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            style={{
              background: tab === v ? t.accentBg : t.surface,
              color: tab === v ? t.accent : t.muted,
              border: `1px solid ${tab === v ? t.accentBorder : t.border}`,
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.82rem",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "endpoints" && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 220px" }}>
            {endpoints.map((e, i) => (
              <div
                key={i}
                onClick={() => setSelIdx(i)}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  padding: "7px 8px",
                  borderRadius: 7,
                  marginBottom: 3,
                  cursor: "pointer",
                  background: selIdx === i ? t.accentBg : "transparent",
                  border: `1px solid ${selIdx === i ? t.accentBorder : "transparent"}`,
                }}
              >
                <span
                  style={{
                    background: `${methodColors[e.method]}25`,
                    color: methodColors[e.method],
                    borderRadius: 4,
                    padding: "1px 6px",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    minWidth: 52,
                    textAlign: "center",
                  }}
                >
                  {e.method}
                </span>
                <code style={{ color: t.text, fontSize: "0.76rem", flex: 1 }}>
                  {e.path}
                </code>
                <code style={{ color: t.muted, fontSize: "0.7rem" }}>
                  {e.code}
                </code>
              </div>
            ))}
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <div
              style={{
                background: "#020608",
                border: `1px solid ${methodColors[ep.method]}40`,
                borderRadius: 10,
                padding: "12px 14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    background: `${methodColors[ep.method]}25`,
                    color: methodColors[ep.method],
                    borderRadius: 5,
                    padding: "3px 10px",
                    fontWeight: 700,
                    fontFamily: "monospace",
                    fontSize: "0.8rem",
                  }}
                >
                  {ep.method}
                </span>
                <code style={{ color: t.text, fontSize: "0.82rem" }}>
                  {ep.path}
                </code>
              </div>
              <div
                style={{
                  color: t.muted,
                  fontSize: "0.78rem",
                  marginBottom: 10,
                }}
              >
                {ep.desc}
              </div>
              <div
                style={{
                  color: t.muted,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  marginBottom: 3,
                }}
              >
                RESPONSE ({ep.code}):
              </div>
              <pre
                style={{
                  margin: 0,
                  color: methodColors[ep.code] || t.accent,
                  fontFamily: "monospace",
                  fontSize: "0.74rem",
                }}
              >
                {ep.body}
              </pre>
            </div>
          </div>
        </div>
      )}

      {tab === "best" && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            [
              "Use nouns not verbs",
              "/users not /getUsers\n/posts not /createPost",
              "#4ade80",
            ],
            [
              "Plural resource names",
              "/users not /user\n/posts not /post",
              "#38bdf8",
            ],
            [
              "Nested resources",
              "/users/:id/posts\n/posts/:id/comments",
              "#c084fc",
            ],
            [
              "Filter via query",
              "GET /users?role=admin\nGET /posts?status=published",
              "#fbbf24",
            ],
            [
              "Proper status codes",
              "201 Created for POST\n204 No Content for DELETE",
              "#fb923c",
            ],
            [
              "Response envelope",
              "{ data: [...], meta: { total, page } }\nConsistent shape always",
              "#f472b6",
            ],
            [
              "Idempotency",
              "PUT/DELETE = same result each call\nPOST = creates new each call",
              "#a3e635",
            ],
            [
              "API versioning",
              "/api/v1/users\n/api/v2/users  (URL is clearest)",
              "#2dd4bf",
            ],
          ].map(([h, c, col]) => (
            <div
              key={h}
              style={{
                flex: "1 1 180px",
                background: `${col}12`,
                border: `1px solid ${col}30`,
                borderRadius: 9,
                padding: "10px 12px",
              }}
            >
              <div
                style={{
                  color: col,
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  marginBottom: 5,
                }}
              >
                {h}
              </div>
              <pre
                style={{
                  margin: 0,
                  color: `${col}bb`,
                  fontFamily: "monospace",
                  fontSize: "0.7rem",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {c}
              </pre>
            </div>
          ))}
        </div>
      )}

      {tab === "version" && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            [
              "✅ URL versioning (recommended)",
              "#4ade80",
              "/api/v1/users\n/api/v2/users\n// Easy to test in browser\n// Clear and explicit\n// Client controls migration timing",
            ],
            [
              "Header versioning",
              "#fbbf24",
              "GET /api/users HTTP/1.1\nAccept: application/json; version=2\n// Less visible\n// Harder to test directly",
            ],
            [
              "Query param",
              "#f87171",
              "/api/users?version=2\n// Easy to add but messy\n// Clutters query strings\n// Not recommended for production",
            ],
          ].map(([l, c, code]) => (
            <div key={l} style={{ flex: "1 1 180px" }}>
              <div
                style={{
                  color: c,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  marginBottom: 6,
                }}
              >
                {l}
              </div>
              <pre
                style={{
                  margin: 0,
                  background: "#020608",
                  border: `1px solid ${c}35`,
                  borderRadius: 8,
                  padding: "10px 12px",
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  color: c,
                  lineHeight: 1.7,
                }}
              >
                {code}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══ DEMO 9 — Authentication ═══════════════════════════ */
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

  const doLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })).replace(
        /=/g,
        "",
      );
      const payload = btoa(
        JSON.stringify({
          sub: "user_123",
          email,
          role: "user",
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600,
        }),
      ).replace(/=/g, "");
      const sig = btoa("hmac_" + email)
        .replace(/=/g, "")
        .slice(0, 20);
      const tk = `${header}.${payload}.${sig}`;
      setToken(tk);
      try {
        setDecoded(JSON.parse(atob(payload + "==")));
      } catch {
        setDecoded(null);
      }
      setLoading(false);
    }, 700);
  };

  const doHash = () => {
    setLoading(true);
    setTimeout(() => {
      setHashResult(
        "$2b$12$" +
          btoa(password).slice(0, 22) +
          btoa(password + "salt").slice(0, 31),
      );
      setLoading(false);
    }, 600);
  };

  return (
    <div
      style={{
        background: t.surface2,
        borderRadius: 14,
        padding: 20,
        border: `1px solid ${t.border}`,
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Authentication — JWT tokens & bcrypt password hashing
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[
          ["🔑 JWT", "jwt"],
          ["🔒 bcrypt", "bcrypt"],
          ["📋 Code", "code"],
        ].map(([l, v]) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            style={{
              background: tab === v ? t.accentBg : t.surface,
              color: tab === v ? t.accent : t.muted,
              border: `1px solid ${tab === v ? t.accentBorder : t.border}`,
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.82rem",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "jwt" && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 180px" }}>
            {[
              ["Email", "email", email, setEmail],
              ["Password", "password", password, setPassword],
            ].map(([l, type, val, set]) => (
              <div key={l} style={{ marginBottom: 10 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.72rem",
                    color: t.muted,
                    marginBottom: 3,
                  }}
                >
                  {l}:
                </label>
                <input
                  type={type}
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "7px 10px",
                    background: t.surface,
                    border: `1px solid ${t.border}`,
                    borderRadius: 7,
                    color: t.text,
                    fontSize: "0.82rem",
                    outline: "none",
                  }}
                />
              </div>
            ))}
            <button
              onClick={doLogin}
              disabled={loading}
              style={{
                width: "100%",
                background: `linear-gradient(135deg,${t.accent},#15803d)`,
                border: "none",
                borderRadius: 8,
                padding: "10px",
                color: "#000",
                fontWeight: 800,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "⏳ Signing in…" : "▶ Login & get JWT"}
            </button>
            {token && (
              <div style={{ marginTop: 10 }}>
                <div
                  style={{
                    color: t.muted,
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  JWT (3 parts separated by .):
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.63rem",
                    wordBreak: "break-all",
                    lineHeight: 1.6,
                  }}
                >
                  {token.split(".").map((part, i) => (
                    <span
                      key={i}
                      style={{ color: [t.danger, t.purple, t.info][i] }}
                    >
                      {part}
                      {i < 2 ? "." : " "}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 5,
                    marginTop: 5,
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    ["header", t.danger],
                    ["payload", t.purple],
                    ["signature", t.info],
                  ].map(([l, c]) => (
                    <span
                      key={l}
                      style={{
                        background: `${c}20`,
                        color: c,
                        borderRadius: 4,
                        padding: "1px 7px",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                      }}
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{ flex: "1 1 200px" }}>
            {decoded ? (
              <div
                style={{
                  background: "#020608",
                  border: `1px solid ${t.purple}40`,
                  borderRadius: 10,
                  padding: "12px 14px",
                }}
              >
                <div
                  style={{
                    color: t.purple,
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    marginBottom: 6,
                  }}
                >
                  Decoded Payload:
                </div>
                {Object.entries(decoded).map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      gap: 8,
                      marginBottom: 3,
                      fontFamily: "monospace",
                      fontSize: "0.74rem",
                    }}
                  >
                    <span style={{ color: t.info }}>{k}</span>
                    <span style={{ color: t.muted }}>:</span>
                    <span
                      style={{
                        color: k === "exp" || k === "iat" ? t.orange : t.accent,
                      }}
                    >
                      {k === "exp" || k === "iat"
                        ? new Date(v * 1000).toLocaleString()
                        : JSON.stringify(v)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: t.surface,
                  border: `2px dashed ${t.border}`,
                  borderRadius: 10,
                  padding: 24,
                  textAlign: "center",
                  color: t.muted,
                }}
              >
                Login to decode JWT
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "bcrypt" && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 180px" }}>
            <div style={{ marginBottom: 10 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.72rem",
                  color: t.muted,
                  marginBottom: 3,
                }}
              >
                Password to hash:
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "7px 10px",
                  background: t.surface,
                  border: `1px solid ${t.border}`,
                  borderRadius: 7,
                  color: t.text,
                  fontSize: "0.82rem",
                  outline: "none",
                }}
              />
            </div>
            <button
              onClick={doHash}
              disabled={loading}
              style={{
                width: "100%",
                background: `linear-gradient(135deg,${t.accent},#15803d)`,
                border: "none",
                borderRadius: 8,
                padding: "9px",
                color: "#000",
                fontWeight: 800,
                cursor: "pointer",
                marginBottom: 10,
              }}
            >
              🔒 Hash Password (cost=12)
            </button>
            {hashResult && (
              <div
                style={{
                  background: "#020608",
                  border: `1px solid ${t.accentBorder}`,
                  borderRadius: 8,
                  padding: "8px 12px",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    color: t.muted,
                    fontSize: "0.68rem",
                    marginBottom: 3,
                  }}
                >
                  bcrypt hash stored in DB:
                </div>
                <code
                  style={{
                    color: t.accent,
                    fontSize: "0.67rem",
                    wordBreak: "break-all",
                  }}
                >
                  {hashResult}
                </code>
              </div>
            )}
            {hashResult && (
              <div>
                <div style={{ marginBottom: 8 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.72rem",
                      color: t.muted,
                      marginBottom: 3,
                    }}
                  >
                    Verify password:
                  </label>
                  <input
                    value={verifyPw}
                    onChange={(e) => setVerifyPw(e.target.value)}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "7px 10px",
                      background: t.surface,
                      border: `1px solid ${t.border}`,
                      borderRadius: 7,
                      color: t.text,
                      fontSize: "0.82rem",
                      outline: "none",
                    }}
                  />
                </div>
                <button
                  onClick={() => setVerifyResult(verifyPw === password)}
                  style={{
                    width: "100%",
                    background: t.surface,
                    border: `1px solid ${t.accentBorder}`,
                    color: t.accent,
                    borderRadius: 8,
                    padding: "8px",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                  }}
                >
                  ▶ bcrypt.compare()
                </button>
                {verifyResult !== null && (
                  <div
                    style={{
                      marginTop: 8,
                      background: verifyResult ? t.accentBg : `${t.danger}15`,
                      border: `1px solid ${verifyResult ? t.accentBorder : `${t.danger}40`}`,
                      borderRadius: 8,
                      padding: "8px 12px",
                    }}
                  >
                    <div
                      style={{
                        color: verifyResult ? t.accent : t.danger,
                        fontWeight: 700,
                        fontSize: "0.82rem",
                      }}
                    >
                      {verifyResult
                        ? "✓ Password matches!"
                        : "✗ Wrong password"}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <pre
              style={{
                margin: 0,
                background: "#020608",
                border: `1px solid ${t.border}`,
                borderRadius: 9,
                padding: "10px 12px",
                fontFamily: "monospace",
                fontSize: "0.72rem",
                color: "#b0d8c8",
                lineHeight: 1.8,
              }}
            >
              {`const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

// REGISTER — hash password before saving
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({
    error: 'Email already taken'
  });

  // NEVER store plain text passwords!
  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name, email, password: hash
  });

  res.status(201).json({ id: user._id });
});

// LOGIN — compare then sign JWT
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  const valid = user &&
    await bcrypt.compare(password, user.password);

  if (!valid) return res.status(401).json({
    error: 'Invalid credentials'
  });

  const token = jwt.sign(
    { sub: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ token });
});`}
            </pre>
          </div>
        </div>
      )}

      {tab === "code" && (
        <pre
          style={{
            margin: 0,
            background: "#020608",
            border: `1px solid ${t.border}`,
            borderRadius: 10,
            padding: "14px 16px",
            fontFamily: "monospace",
            fontSize: "0.75rem",
            color: "#b0d8c8",
            lineHeight: 1.8,
            overflowX: "auto",
          }}
        >
          {`// JWT auth middleware
const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token' });

  const token = auth.replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.status(401).json({ error: 'Token expired' });
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Role authorization
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ error: 'Forbidden' });
  next();
};

// Protect routes
app.get('/admin', authenticate, authorize('admin'), handler);
app.get('/profile', authenticate, profileHandler);

// Refresh token pattern (production best practice)
// Access token: short-lived (15 min)
// Refresh token: long-lived (7 days), httpOnly cookie
const accessToken  = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '7d' });

res.cookie('refreshToken', refreshToken, {
  httpOnly: true,  // XSS safe — JS can't read it
  secure:   true,  // HTTPS only
  sameSite: 'strict',
  maxAge:   7 * 24 * 60 * 60 * 1000
});`}
        </pre>
      )}
    </div>
  );
}

/* ══ DEMO 10 — Events ══════════════════════════════════ */
function EventsDemo({ t }) {
  const [listeners, setListeners] = useState({
    "user:created": 1,
    "order:placed": 0,
    "payment:failed": 0,
  });
  const [log, setLog] = useState([]);

  const addLog = (msg, col) =>
    setLog((l) =>
      [
        { msg, col: col || t.accent, id: Date.now() + Math.random() },
        ...l,
      ].slice(0, 10),
    );

  const emit = (event) => {
    const count = listeners[event] || 0;
    const colors = {
      "user:created": t.accent,
      "order:placed": t.info,
      "payment:failed": t.danger,
    };
    const msgs = {
      "user:created": ["📧 Sending welcome email…", "📊 Updating analytics…"],
      "order:placed": [
        "📦 Reserving inventory…",
        "💳 Processing payment…",
        "📧 Sending confirmation…",
      ],
      "payment:failed": [
        "🔄 Scheduling retry in 5min…",
        "🔔 Alerting support team…",
      ],
    };
    if (count === 0) {
      addLog("emit('" + event + "') — no listeners attached!", t.danger);
      return;
    }
    addLog(
      "emit('" + event + "') → " + count + " listener(s) notified",
      colors[event] || t.accent,
    );
    (msgs[event] || []).forEach((m, i) =>
      setTimeout(() => addLog("  " + m, t.muted), (i + 1) * 350),
    );
  };

  return (
    <div
      style={{
        background: t.surface2,
        borderRadius: 14,
        padding: 20,
        border: `1px solid ${t.border}`,
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Events & EventEmitter — pub/sub pattern
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px" }}>
          {[
            ["user:created", "👤", t.accent],
            ["order:placed", "🛒", t.info],
            ["payment:failed", "💳", t.danger],
          ].map(([evt, icon, col]) => (
            <div
              key={evt}
              style={{
                background: t.surface,
                border: `1px solid ${col}30`,
                borderRadius: 9,
                padding: "10px 12px",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <div>
                  <code
                    style={{ color: col, fontWeight: 700, fontSize: "0.82rem" }}
                  >
                    {icon} {evt}
                  </code>
                  <div style={{ color: t.muted, fontSize: "0.7rem" }}>
                    {listeners[evt]} listener(s)
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    onClick={() =>
                      setListeners((l) => ({
                        ...l,
                        [evt]: Math.max(0, l[evt] - 1),
                      }))
                    }
                    style={{
                      background: t.surface2,
                      border: `1px solid ${t.border}`,
                      borderRadius: 5,
                      padding: "2px 7px",
                      color: t.muted,
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    −
                  </button>
                  <button
                    onClick={() =>
                      setListeners((l) => ({ ...l, [evt]: (l[evt] || 0) + 1 }))
                    }
                    style={{
                      background: t.surface2,
                      border: `1px solid ${t.border}`,
                      borderRadius: 5,
                      padding: "2px 7px",
                      color: t.muted,
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => emit(evt)}
                    style={{
                      background: `${col}25`,
                      border: `1px solid ${col}50`,
                      color: col,
                      borderRadius: 6,
                      padding: "4px 12px",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                    }}
                  >
                    emit
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div
            style={{
              background: "#020608",
              border: `1px solid ${t.border}`,
              borderRadius: 9,
              padding: "8px 10px",
              minHeight: 80,
              maxHeight: 140,
              overflowY: "auto",
            }}
          >
            {log.length === 0 ? (
              <div style={{ color: t.muted, fontSize: "0.75rem" }}>
                Emit events to see log…
              </div>
            ) : (
              log.map((l) => (
                <div
                  key={l.id}
                  style={{
                    color: l.col,
                    fontFamily: "monospace",
                    fontSize: "0.7rem",
                    marginBottom: 2,
                  }}
                >
                  {l.msg}
                </div>
              ))
            )}
          </div>
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <pre
            style={{
              margin: 0,
              background: "#020608",
              border: `1px solid ${t.border}`,
              borderRadius: 9,
              padding: "10px 12px",
              fontFamily: "monospace",
              fontSize: "0.72rem",
              color: "#b0d8c8",
              lineHeight: 1.8,
              overflow: "auto",
              maxHeight: 300,
            }}
          >
            {`const { EventEmitter } = require('events');

class OrderService extends EventEmitter {
  async createOrder(data) {
    const order = await db.create(data);
    // Emit — don't know who's listening
    this.emit('order:placed', order);
    return order;
  }
}

const orders = new OrderService();

// Any service can listen independently
orders.on('order:placed', async (order) => {
  await inventory.reserve(order.items);
});

orders.on('order:placed', async (order) => {
  await email.sendConfirmation(order.userId);
});

// once() — auto-removes after first call
orders.once('order:placed', (order) => {
  analytics.trackFirstOrder(order);
});

// Remove a listener
orders.off('order:placed', myHandler);

// Increase listener limit (default: 10)
orders.setMaxListeners(50);`}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ══ DEMO 11 — Streams ═════════════════════════════════ */
function StreamsDemo({ t }) {
  const [tab, setTab] = useState("types");
  const [fileSize, setFileSize] = useState(100);
  const [streamProg, setStreamProg] = useState(0);
  const [bufferProg, setBufferProg] = useState(0);
  const [simRunning, setSimRunning] = useState(false);
  const timerRef = useRef(null);

  const simulate = () => {
    setSimRunning(true);
    setStreamProg(0);
    setBufferProg(0);
    const total = 2000;
    const interval = 50;
    let elapsed = 0;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      elapsed += interval;
      setStreamProg(Math.min(100, (elapsed / total) * 100));
      if (elapsed > total * 0.8)
        setBufferProg(
          Math.min(100, ((elapsed - total * 0.8) / (total * 0.2)) * 100),
        );
      if (elapsed >= total) {
        clearInterval(timerRef.current);
        setSimRunning(false);
      }
    }, interval);
  };
  useEffect(() => () => clearInterval(timerRef.current), []);

  const streamTypes = [
    {
      name: "Readable",
      color: "#38bdf8",
      icon: "📖",
      desc: "Data source — read from it.",
      ex: "fs.createReadStream('file.txt')\nhttp.IncomingMessage\nprocess.stdin",
    },
    {
      name: "Writable",
      color: "#4ade80",
      icon: "✍️",
      desc: "Data sink — write to it.",
      ex: "fs.createWriteStream('out.txt')\nhttp.ServerResponse\nprocess.stdout",
    },
    {
      name: "Duplex",
      color: "#c084fc",
      icon: "↔️",
      desc: "Both readable and writable.",
      ex: "net.Socket (TCP)\ncrypto.createCipheriv()\nWebSocket",
    },
    {
      name: "Transform",
      color: "#fbbf24",
      icon: "🔄",
      desc: "Duplex that modifies data.",
      ex: "zlib.createGzip()\ncrypto.createHash()\nCSV parser",
    },
    {
      name: "Pipeline",
      color: "#fb923c",
      icon: "🔗",
      desc: "Chain streams together.",
      ex: "pipeline(read, gzip, write)\nErrors propagate automatically",
    },
  ];
  const [selType, setSelType] = useState(0);

  return (
    <div
      style={{
        background: t.surface2,
        borderRadius: 14,
        padding: 20,
        border: `1px solid ${t.border}`,
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Streams & Buffers — memory-efficient data processing
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[
          ["Stream Types", "types"],
          ["Memory Comparison", "memory"],
        ].map(([l, v]) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            style={{
              background: tab === v ? t.accentBg : t.surface,
              color: tab === v ? t.accent : t.muted,
              border: `1px solid ${tab === v ? t.accentBorder : t.border}`,
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.82rem",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "types" ? (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div
            style={{
              flex: "0 0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {streamTypes.map((tp, i) => (
              <button
                key={i}
                onClick={() => setSelType(i)}
                style={{
                  textAlign: "left",
                  background: selType === i ? `${tp.color}25` : t.surface,
                  color: selType === i ? tp.color : t.muted,
                  border: `1px solid ${selType === i ? `${tp.color}60` : t.border}`,
                  borderRadius: 7,
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                {tp.icon} {tp.name}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div
              style={{
                background: `${streamTypes[selType].color}15`,
                border: `1px solid ${streamTypes[selType].color}40`,
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  color: streamTypes[selType].color,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  marginBottom: 5,
                }}
              >
                {streamTypes[selType].icon} {streamTypes[selType].name} Stream
              </div>
              <div
                style={{ color: t.muted, fontSize: "0.78rem", marginBottom: 8 }}
              >
                {streamTypes[selType].desc}
              </div>
              <pre
                style={{
                  margin: 0,
                  color: streamTypes[selType].color,
                  fontFamily: "monospace",
                  fontSize: "0.76rem",
                  lineHeight: 1.7,
                }}
              >
                {streamTypes[selType].ex}
              </pre>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 180px" }}>
            <div style={{ marginBottom: 12 }}>
              <label
                style={{
                  color: t.muted,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: 5,
                }}
              >
                File size:{" "}
                <strong style={{ color: t.text }}>{fileSize} MB</strong>
              </label>
              <input
                type="range"
                min={10}
                max={1000}
                value={fileSize}
                onChange={(e) => setFileSize(+e.target.value)}
                style={{ width: "100%", accentColor: t.accent }}
              />
            </div>
            <button
              onClick={simulate}
              disabled={simRunning}
              style={{
                width: "100%",
                background: simRunning
                  ? t.surface
                  : `linear-gradient(135deg,${t.accent},#15803d)`,
                border: "none",
                borderRadius: 8,
                padding: "10px",
                color: simRunning ? t.muted : "#000",
                fontWeight: 800,
                cursor: simRunning ? "not-allowed" : "pointer",
                marginBottom: 14,
              }}
            >
              {simRunning ? "⏳ Simulating…" : "▶ Simulate processing"}
            </button>
            {[
              [
                "🌊 Stream (createReadStream)",
                "Processes in ~64KB chunks. Memory stays constant.",
                streamProg,
                t.accent,
                (0.064).toFixed(1),
              ],
              [
                "📦 Buffer (readFile)",
                "Loads entire file into RAM before processing.",
                bufferProg,
                t.danger,
                fileSize.toFixed(0),
              ],
            ].map(([lbl, desc, prog, col, ram]) => (
              <div
                key={lbl}
                style={{
                  background: `${col}12`,
                  border: `1px solid ${col}30`,
                  borderRadius: 9,
                  padding: "10px 12px",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{ color: col, fontWeight: 700, fontSize: "0.8rem" }}
                  >
                    {lbl}
                  </div>
                  <code style={{ color: col, fontSize: "0.73rem" }}>
                    ~{ram} MB RAM
                  </code>
                </div>
                <div
                  style={{
                    color: t.muted,
                    fontSize: "0.72rem",
                    marginBottom: 6,
                  }}
                >
                  {desc}
                </div>
                <div
                  style={{
                    height: 6,
                    background: t.border,
                    borderRadius: 99,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${prog}%`,
                      height: "100%",
                      background: col,
                      borderRadius: 99,
                      transition: "width .05s",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div style={{ flex: "1 1 220px" }}>
            <pre
              style={{
                margin: 0,
                background: "#020608",
                border: `1px solid ${t.border}`,
                borderRadius: 9,
                padding: "10px 12px",
                fontFamily: "monospace",
                fontSize: "0.73rem",
                color: "#b0d8c8",
                lineHeight: 1.8,
              }}
            >
              {`// BAD — loads entire 2GB file into RAM!
app.get('/download', async (req, res) => {
  const file = await fs.readFile('movie.mp4');
  res.send(file); // needs 2GB RAM per request!
});

// GOOD — streams chunks to client
app.get('/download', (req, res) => {
  const stream = fs.createReadStream('movie.mp4');
  stream.pipe(res);  // only ~64KB in RAM!
});

// BEST — with error handling
app.get('/compressed', async (req, res) => {
  res.setHeader('Content-Encoding', 'gzip');
  res.setHeader('Content-Type', 'application/json');

  await pipeline(
    fs.createReadStream('data.json'),
    zlib.createGzip(),   // compress on the fly
    res,
  );
});

// Buffer for small binary data
const buf = Buffer.from('Hello', 'utf8');
buf.toString('base64');   // encode
buf.length;               // byte count
Buffer.concat([a, b]);    // join buffers`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
/* ══ DEMO 12 — Environment & Config ════════════════════ */
function EnvDemo({ t }) {
  const [env, setEnv] = useState("development");
  const [showSecrets, setShowSecrets] = useState(false);

  const envData = {
    development: {
      color: t.accent,
      vars: {
        NODE_ENV: "development",
        PORT: "3000",
        MONGODB_URI: "mongodb://localhost:27017/myapp_dev",
        JWT_SECRET: "dev_secret_key_here",
        LOG_LEVEL: "debug",
      },
    },
    staging: {
      color: t.warn,
      vars: {
        NODE_ENV: "staging",
        PORT: "3000",
        MONGODB_URI:
          "mongodb+srv://user:HIDDEN@cluster.mongodb.net/myapp_staging",
        JWT_SECRET: "HIDDEN",
        LOG_LEVEL: "info",
      },
    },
    production: {
      color: t.danger,
      vars: {
        NODE_ENV: "production",
        PORT: "8080",
        MONGODB_URI: "mongodb+srv://user:HIDDEN@cluster.mongodb.net/myapp_prod",
        JWT_SECRET: "HIDDEN",
        LOG_LEVEL: "error",
      },
    },
  };
  const cur = envData[env];
  const mask = (k, v) => {
    if (showSecrets) return v;
    if (k.includes("SECRET") || k.includes("URI"))
      return v.replace("HIDDEN", "***").replace("dev_secret_key_here", "***");
    return v;
  };

  return (
    <div
      style={{
        background: t.surface2,
        borderRadius: 14,
        padding: 20,
        border: `1px solid ${t.border}`,
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Environment Variables & Configuration
      </p>
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 14,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {["development", "staging", "production"].map((e) => (
          <button
            key={e}
            onClick={() => setEnv(e)}
            style={{
              background: env === e ? `${envData[e].color}30` : t.surface,
              color: envData[e].color,
              border: `2px solid ${env === e ? envData[e].color : t.border}`,
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.8rem",
            }}
          >
            {e}
          </button>
        ))}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            fontSize: "0.78rem",
            color: t.muted,
            marginLeft: "auto",
          }}
        >
          <input
            type="checkbox"
            checked={showSecrets}
            onChange={(e) => setShowSecrets(e.target.checked)}
            style={{ accentColor: t.accent }}
          />
          Show secrets
        </label>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px" }}>
          <div
            style={{
              background: "#020608",
              border: `1px solid ${cur.color}40`,
              borderRadius: 10,
              overflow: "hidden",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                padding: "6px 12px",
                background: `${cur.color}15`,
                borderBottom: `1px solid ${cur.color}30`,
                color: cur.color,
                fontSize: "0.72rem",
                fontWeight: 700,
              }}
            >
              .env.{env}
            </div>
            <div style={{ padding: "10px 12px" }}>
              {Object.entries(cur.vars).map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 3,
                    fontFamily: "monospace",
                    fontSize: "0.73rem",
                  }}
                >
                  <span style={{ color: t.info, minWidth: 110 }}>{k}</span>
                  <span style={{ color: t.muted }}>=</span>
                  <span
                    style={{
                      color:
                        k.includes("SECRET") || k.includes("URI")
                          ? t.danger
                          : t.accent,
                    }}
                  >
                    {mask(k, v)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              background: `${t.danger}12`,
              border: `1px solid ${t.danger}35`,
              borderRadius: 8,
              padding: "8px 12px",
            }}
          >
            <div
              style={{ color: t.danger, fontWeight: 700, fontSize: "0.78rem" }}
            >
              ⚠ Never commit .env to git!
            </div>
            <div style={{ color: t.muted, fontSize: "0.72rem" }}>
              Add .env to .gitignore. Commit .env.example with placeholder
              values instead.
            </div>
          </div>
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <pre
            style={{
              margin: 0,
              background: "#020608",
              border: `1px solid ${t.border}`,
              borderRadius: 9,
              padding: "10px 12px",
              fontFamily: "monospace",
              fontSize: "0.73rem",
              color: "#b0d8c8",
              lineHeight: 1.8,
              overflow: "auto",
              maxHeight: 300,
            }}
          >
            {`// .gitignore
.env
.env.local
.env.production

// .env.example (commit this!)
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost/myapp
JWT_SECRET=replace_with_strong_secret
LOG_LEVEL=debug

// Load in app (as early as possible)
require('dotenv').config();
// OR: import 'dotenv/config';

// Validate required vars at startup!
const required = [
  'MONGODB_URI',
  'JWT_SECRET',
];
const missing = required.filter(
  k => !process.env[k]
);
if (missing.length) {
  console.error('Missing env vars:', missing);
  process.exit(1); // fail fast!
}

// Config object (type-safe access)
const config = {
  port:   parseInt(process.env.PORT) || 3000,
  isProd: process.env.NODE_ENV === 'production',
  db:     { uri: process.env.MONGODB_URI },
  jwt:    {
    secret:    process.env.JWT_SECRET,
    expiresIn: '7d',
  },
};

module.exports = config;`}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ══ DEMO 13 — Error Handling ══════════════════════════ */
function ErrorHandlingDemo({ t }) {
  const [tab, setTab] = useState("types");
  const [triggered, setTriggered] = useState(null);

  const errorTypes = [
    {
      name: "Operational Errors",
      color: t.warn,
      icon: "⚠️",
      desc: "Expected, predictable errors. Handle gracefully with HTTP responses.",
      examples: [
        "User not found (404)",
        "Invalid input (400)",
        "Duplicate email (409)",
        "Rate limit exceeded (429)",
        "Unauthorized (401)",
      ],
    },
    {
      name: "Programmer Errors",
      color: t.danger,
      icon: "🐛",
      desc: "Bugs in your code. Log, crash the process, let PM2 restart.",
      examples: [
        "TypeError: undefined",
        "ReferenceError",
        "Infinite recursion",
        "Unhandled rejection",
        "Logic error",
      ],
    },
    {
      name: "External Failures",
      color: t.info,
      icon: "🌐",
      desc: "Third-party failures. Handle with retries and circuit breakers.",
      examples: [
        "MongoDB connection lost",
        "API timeout",
        "Redis refused",
        "Stripe error",
        "Network unreachable",
      ],
    },
  ];
  const [selErr, setSelErr] = useState(0);

  const scenarios = [
    {
      label: "Route not found",
      emoji: "🔍",
      result: {
        status: 404,
        body: { error: "Not Found", message: "Route /api/foo not found" },
      },
    },
    {
      label: "Validation error",
      emoji: "⚠️",
      result: {
        status: 400,
        body: { error: "Validation Error", fields: { email: "Invalid email" } },
      },
    },
    {
      label: "Auth failed",
      emoji: "🔑",
      result: {
        status: 401,
        body: { error: "Unauthorized", message: "JWT token expired" },
      },
    },
    {
      label: "DB error",
      emoji: "💥",
      result: {
        status: 500,
        body: {
          error: "Internal Server Error",
          message: "Database connection failed",
        },
      },
    },
    {
      label: "Crash & restart",
      emoji: "💣",
      result: {
        status: "CRASH",
        body: "uncaughtException caught — process.exit(1)\nPM2: restarting worker…",
      },
    },
  ];
  const statusColor = (s) =>
    !s || s === "CRASH"
      ? t.danger
      : s < 300
        ? t.accent
        : s < 500
          ? t.warn
          : t.danger;

  return (
    <div
      style={{
        background: t.surface2,
        borderRadius: 14,
        padding: 20,
        border: `1px solid ${t.border}`,
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Error Handling — types, handlers, graceful shutdown
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[
          ["Error Types", "types"],
          ["Scenarios", "scenarios"],
          ["Shutdown", "shutdown"],
        ].map(([l, v]) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            style={{
              background: tab === v ? t.accentBg : t.surface,
              color: tab === v ? t.accent : t.muted,
              border: `1px solid ${tab === v ? t.accentBorder : t.border}`,
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.82rem",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "types" && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div
            style={{
              flex: "0 0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {errorTypes.map((e, i) => (
              <button
                key={i}
                onClick={() => setSelErr(i)}
                style={{
                  textAlign: "left",
                  background: selErr === i ? `${e.color}25` : t.surface,
                  color: selErr === i ? e.color : t.muted,
                  border: `1px solid ${selErr === i ? `${e.color}60` : t.border}`,
                  borderRadius: 7,
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                {e.icon} {e.name}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div
              style={{
                background: `${errorTypes[selErr].color}15`,
                border: `1px solid ${errorTypes[selErr].color}40`,
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  color: errorTypes[selErr].color,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  marginBottom: 6,
                }}
              >
                {errorTypes[selErr].icon} {errorTypes[selErr].name}
              </div>
              <div
                style={{
                  color: t.muted,
                  fontSize: "0.78rem",
                  lineHeight: 1.6,
                  marginBottom: 8,
                }}
              >
                {errorTypes[selErr].desc}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {errorTypes[selErr].examples.map((ex) => (
                  <span
                    key={ex}
                    style={{
                      background: `${errorTypes[selErr].color}15`,
                      color: errorTypes[selErr].color,
                      borderRadius: 20,
                      padding: "2px 10px",
                      fontSize: "0.72rem",
                    }}
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "scenarios" && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 180px" }}>
            {scenarios.map((s, i) => (
              <button
                key={i}
                onClick={() => setTriggered(s.result)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: triggered === s.result ? t.accentBg : t.surface,
                  color: triggered === s.result ? t.accent : t.muted,
                  border: `1px solid ${triggered === s.result ? t.accentBorder : t.border}`,
                  borderRadius: 7,
                  padding: "8px 12px",
                  marginBottom: 5,
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                }}
              >
                <span style={{ marginRight: 8 }}>{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
          <div style={{ flex: "1 1 200px" }}>
            {triggered ? (
              <div
                style={{
                  background: "#020608",
                  border: `1px solid ${statusColor(triggered.status)}50`,
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "8px 12px",
                    background: `${statusColor(triggered.status)}20`,
                    borderBottom: `1px solid ${t.border}`,
                  }}
                >
                  <code
                    style={{
                      color: statusColor(triggered.status),
                      fontWeight: 700,
                      fontSize: "0.9rem",
                    }}
                  >
                    Status: {triggered.status}
                  </code>
                </div>
                <div style={{ padding: "10px 12px" }}>
                  <pre
                    style={{
                      margin: 0,
                      color: t.accent,
                      fontFamily: "monospace",
                      fontSize: "0.76rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {typeof triggered.body === "string"
                      ? triggered.body
                      : JSON.stringify(triggered.body, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: t.surface,
                  border: `2px dashed ${t.border}`,
                  borderRadius: 10,
                  padding: 24,
                  textAlign: "center",
                  color: t.muted,
                }}
              >
                Click a scenario →
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "shutdown" && (
        <pre
          style={{
            margin: 0,
            background: "#020608",
            border: `1px solid ${t.border}`,
            borderRadius: 10,
            padding: "14px 16px",
            fontFamily: "monospace",
            fontSize: "0.75rem",
            color: "#b0d8c8",
            lineHeight: 1.8,
            overflowX: "auto",
          }}
        >
          {`// Global handlers — always add these!

// 1. Uncaught sync exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1); // let PM2 restart the process
});

// 2. Unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
  process.exit(1);
});

// 3. Graceful shutdown — close connections cleanly
const gracefulShutdown = async (signal) => {
  console.log(signal + ' received — shutting down...');

  // Stop accepting new connections
  server.close(async () => {
    console.log('HTTP server closed');

    // Close database connections
    await mongoose.connection.close();
    console.log('DB connection closed');

    process.exit(0);
  });

  // Force shutdown after 30s if not done
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30_000);
};

// Docker stop sends SIGTERM, Ctrl+C sends SIGINT
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));`}
        </pre>
      )}
    </div>
  );
}

/* ══ DEMO 14 — Testing ═════════════════════════════════ */
function TestingDemo({ t }) {
  const [tab, setTab] = useState("unit");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState([]);

  const suites = {
    unit: [
      { name: "add(2, 3) returns 5", pass: true, ms: 1 },
      { name: "divide by zero throws error", pass: true, ms: 2 },
      { name: "validateEmail('bad') returns false", pass: true, ms: 1 },
      { name: "formatDate returns ISO string", pass: true, ms: 1 },
      { name: "hashPassword returns bcrypt hash", pass: true, ms: 44 },
    ],
    integration: [
      { name: "POST /auth/register creates user", pass: true, ms: 178 },
      { name: "POST /auth/login returns JWT", pass: true, ms: 214 },
      { name: "GET /users requires auth header", pass: true, ms: 92 },
      { name: "POST /users validates body", pass: true, ms: 110 },
      {
        name: "DELETE /users/1 removes document",
        pass: false,
        ms: 85,
        err: "Expected 204, got 500: MongoError",
      },
    ],
    e2e: [
      { name: "User can register and login", pass: true, ms: 1240 },
      { name: "User can create and view a post", pass: true, ms: 980 },
      {
        name: "Admin can delete any user",
        pass: false,
        ms: 1100,
        err: "Timeout: button not found after 5000ms",
      },
      { name: "Password reset email is sent", pass: true, ms: 2300 },
    ],
  };

  const runTests = async () => {
    setRunning(true);
    setResults([]);
    const suite = suites[tab];
    for (const test of suite) {
      await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
      setResults((r) => [...r, test]);
    }
    setRunning(false);
  };

  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;

  const codeExamples = {
    unit: `// jest unit test — fast, no I/O
describe('Math Utils', () => {
  test('add(2, 3) returns 5', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('divide by zero throws', () => {
    expect(() => divide(10, 0))
      .toThrow('Division by zero');
  });
});

// Async test
test('creates user', async () => {
  const user = await createUser({ name: 'Alice' });
  expect(user).toHaveProperty('id');
  expect(user.name).toBe('Alice');
});

// Mocking
jest.mock('../services/email');
const mockSend = jest.spyOn(email, 'send')
  .mockResolvedValue({ sent: true });`,
    integration: `// Supertest — tests HTTP routes + DB
const request = require('supertest');
const app     = require('../app');

beforeAll(() => connectTestDB());
afterAll(() => disconnectTestDB());
afterEach(() => clearDatabase()); // reset after each test

describe('POST /api/auth/register', () => {
  test('returns 201 and creates user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name:     'Alice',
        email:    'alice@test.io',
        password: 'Password123!'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('alice@test.io');
  });

  test('returns 400 for invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Bob', email: 'not-an-email' });

    expect(res.status).toBe(400);
  });
});`,
    e2e: `// Playwright E2E test
import { test, expect } from '@playwright/test';

test('user can register and create a post', async ({ page }) => {
  // 1. Register
  await page.goto('http://localhost:3000/register');
  await page.fill('[name=name]',     'Alice');
  await page.fill('[name=email]',    'alice@test.io');
  await page.fill('[name=password]', 'Password123!');
  await page.click('button[type=submit]');

  // 2. Should land on dashboard
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Welcome');

  // 3. Create a post
  await page.click('text=New Post');
  await page.fill('[name=title]', 'My First Post');
  await page.click('text=Publish');

  await expect(page.locator('h2'))
    .toContainText('My First Post');
});`,
  };

  return (
    <div
      style={{
        background: t.surface2,
        borderRadius: 14,
        padding: 20,
        border: `1px solid ${t.border}`,
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Testing — Unit, Integration, E2E with Jest & Supertest
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[
          ["Unit", "unit"],
          ["Integration", "integration"],
          ["E2E", "e2e"],
        ].map(([l, v]) => (
          <button
            key={v}
            onClick={() => {
              setTab(v);
              setResults([]);
            }}
            style={{
              background: tab === v ? t.accentBg : t.surface,
              color: tab === v ? t.accent : t.muted,
              border: `1px solid ${tab === v ? t.accentBorder : t.border}`,
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.82rem",
            }}
          >
            {l}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 180px" }}>
          <button
            onClick={runTests}
            disabled={running}
            style={{
              width: "100%",
              background: running
                ? t.surface
                : `linear-gradient(135deg,${t.accent},#15803d)`,
              border: "none",
              borderRadius: 8,
              padding: "10px",
              color: running ? t.muted : "#000",
              fontWeight: 800,
              cursor: running ? "not-allowed" : "pointer",
              marginBottom: 10,
            }}
          >
            {running ? "⏳ Running tests…" : "▶ Run " + tab + " tests"}
          </button>
          {results.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <div
                style={{
                  flex: 1,
                  background: `${t.accent}15`,
                  border: `1px solid ${t.accentBorder}`,
                  borderRadius: 8,
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    color: t.accent,
                    fontWeight: 900,
                    fontSize: "1.4rem",
                  }}
                >
                  {passed}
                </div>
                <div style={{ color: t.muted, fontSize: "0.7rem" }}>passed</div>
              </div>
              <div
                style={{
                  flex: 1,
                  background: `${t.danger}15`,
                  border: `1px solid ${t.danger}40`,
                  borderRadius: 8,
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    color: t.danger,
                    fontWeight: 900,
                    fontSize: "1.4rem",
                  }}
                >
                  {failed}
                </div>
                <div style={{ color: t.muted, fontSize: "0.7rem" }}>failed</div>
              </div>
            </div>
          )}
          {results.map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                padding: "6px 8px",
                borderRadius: 7,
                marginBottom: 3,
                background: r.pass ? t.accentBg : `${t.danger}15`,
                border: `1px solid ${r.pass ? t.accentBorder : `${t.danger}40`}`,
              }}
            >
              <span
                style={{ color: r.pass ? t.accent : t.danger, flexShrink: 0 }}
              >
                {r.pass ? "✓" : "✗"}
              </span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: r.pass ? t.text : t.danger,
                    fontSize: "0.76rem",
                  }}
                >
                  {r.name}
                </div>
                {r.err && (
                  <div style={{ color: t.danger, fontSize: "0.68rem" }}>
                    {r.err}
                  </div>
                )}
              </div>
              <code style={{ color: t.muted, fontSize: "0.68rem" }}>
                {r.ms}ms
              </code>
            </div>
          ))}
          {running && results.length < suites[tab].length && (
            <div
              style={{
                color: t.muted,
                fontSize: "0.74rem",
                padding: "4px 8px",
              }}
            >
              ⏳ {results.length + 1}/{suites[tab].length} running…
            </div>
          )}
        </div>
        <div style={{ flex: "1 1 220px" }}>
          <div
            style={{
              position: "relative",
              borderRadius: 9,
              overflow: "hidden",
              border: `1px solid ${t.border}`,
            }}
          >
            <div
              style={{
                background: "#020608",
                padding: "10px 12px",
                overflow: "auto",
                maxHeight: 300,
              }}
            >
              <pre
                style={{
                  margin: 0,
                  fontFamily: "monospace",
                  fontSize: "0.72rem",
                  color: "#b0d8c8",
                  lineHeight: 1.8,
                }}
              >
                {codeExamples[tab]}
              </pre>
            </div>
            <CopyBtn code={codeExamples[tab]} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ DEMO 15 — Deployment ══════════════════════════════ */
function DeployDemo({ t }) {
  const [sel, setSel] = useState(0);

  const topics = [
    {
      label: "PM2",
      icon: "⚙️",
      color: "#4ade80",
      code: `# Install globally
npm install -g pm2

# Start app
pm2 start src/index.js --name "my-api"

# Cluster mode — use ALL CPU cores
pm2 start src/index.js -i max --name "my-api"

# ecosystem.config.js (recommended)
module.exports = {
  apps: [{
    name:   'my-api',
    script: 'src/index.js',
    instances:  'max',
    exec_mode:  'cluster',
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/error.log',
    out_file:   './logs/out.log',
  }]
};

pm2 start ecosystem.config.js
pm2 save && pm2 startup  # survive reboots
pm2 monit                # real-time monitor
pm2 logs                 # tail logs
pm2 reload my-api        # zero-downtime restart`,
    },
    {
      label: "Docker",
      icon: "🐳",
      color: "#38bdf8",
      code: `# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install deps first (Docker layer caching)
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Run as non-root for security
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
docker-compose logs -f api`,
    },
    {
      label: "Nginx",
      icon: "🔀",
      color: "#fbbf24",
      code: `# /etc/nginx/sites-available/myapp

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.myapp.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.myapp.com;

    ssl_certificate     /etc/letsencrypt/live/myapp.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/myapp.com/privkey.pem;

    gzip on;
    gzip_types application/json text/plain;

    # Proxy to Node.js
    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable and reload
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t && sudo nginx -s reload`,
    },
    {
      label: "CI/CD",
      icon: "🔄",
      color: "#c084fc",
      code: `# .github/workflows/deploy.yml
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
      - name: Deploy to server via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: "192.168.1.100"
          username: "ubuntu"
          key: "YOUR_PRIVATE_SSH_KEY"
          script: |
            cd /app/my-api
            git pull origin main
            npm ci --omit=dev
            pm2 restart my-api`,
    },
    {
      label: "Health Check",
      icon: "📊",
      color: "#fb923c",
      code: `// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    status:  'ok',
    uptime:  process.uptime(),
    memory:  process.memoryUsage(),
    node:    process.version,
    env:     process.env.NODE_ENV,
  };

  try {
    // Check database
    await mongoose.connection.db.admin().ping();
    health.database = 'connected';
  } catch (err) {
    health.database = 'disconnected';
    health.status   = 'degraded';
    return res.status(503).json(health);
  }

  res.json(health);
});

// Structured logging with Winston
const winston = require('winston');

const logger = winston.createLogger({
  level:  process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console(),
  ],
});

// Log every request
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info({
      method: req.method,
      url:    req.url,
      status: res.statusCode,
      ms:     Date.now() - start,
    });
  });
  next();
});`,
    },
  ];

  const tp = topics[sel];
  return (
    <div
      style={{
        background: t.surface2,
        borderRadius: 14,
        padding: 20,
        border: `1px solid ${t.border}`,
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Deployment & Production — PM2, Docker, Nginx, CI/CD
      </p>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}
      >
        {topics.map((tp2, i) => (
          <button
            key={i}
            onClick={() => setSel(i)}
            style={{
              background: sel === i ? `${tp2.color}30` : t.surface,
              color: tp2.color,
              border: `2px solid ${sel === i ? tp2.color : t.border}`,
              borderRadius: 8,
              padding: "5px 12px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.78rem",
            }}
          >
            {tp2.icon} {tp2.label}
          </button>
        ))}
      </div>
      <div
        style={{
          position: "relative",
          borderRadius: 12,
          overflow: "hidden",
          border: `1px solid ${tp.color}40`,
        }}
      >
        <div
          style={{
            background: "#020608",
            padding: "14px 16px",
            overflowX: "auto",
            maxHeight: 380,
            overflowY: "auto",
          }}
        >
          <pre
            style={{
              margin: 0,
              fontFamily: "monospace",
              fontSize: "0.76rem",
              color: tp.color,
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
            }}
          >
            {tp.code}
          </pre>
        </div>
        <CopyBtn code={tp.code} />
      </div>
    </div>
  );
}

/* ══ DEMO 16 — Performance ═════════════════════════════ */
function PerformanceDemo({ t }) {
  const [sel, setSel] = useState(0);

  const tips = [
    {
      icon: "⚡",
      title: "Use async everywhere",
      color: "#4ade80",
      good: `// Always use async fs/db operations
async function getUser(id) {
  // Non-blocking — event loop stays free
  const user = await User.findById(id);
  const posts = await Post.find({ userId: id });
  return { user, posts };
}

// Even better — run in parallel!
async function getDashboard(id) {
  const [user, posts, stats] = await Promise.all([
    User.findById(id),
    Post.find({ userId: id }),
    Stats.findOne({ userId: id }),
  ]);
  return { user, posts, stats };
}`,
      bad: `// NEVER use sync methods in a server!
const data = fs.readFileSync('large-file.txt');
// Blocks the ENTIRE event loop for all users
// while this file is being read!

const user = mongoose.findById(id).sync?.();
// This doesn't even exist in mongoose —
// because sync DB calls are terrible.`,
    },

    {
      icon: "💾",
      title: "Cache with Redis",
      color: "#38bdf8",
      good: `const redis = require('redis');
const client = redis.createClient();

async function getUser(id) {
  const cacheKey = 'user:' + id;

  // Try cache first (microseconds)
  const cached = await client.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Cache miss — hit database
  const user = await User.findById(id);

  // Store in cache for 5 minutes
  await client.setEx(cacheKey, 300, JSON.stringify(user));

  return user;
}`,
      bad: `// Without caching — every request hits DB
async function getUser(id) {
  // 50-200ms database query, every single time
  // Even for the same user requested 1000 times!
  const user = await User.findById(id);
  return user;

  // 1000 requests/sec = 1000 DB queries/sec
  // With Redis cache: maybe 10 DB queries/sec
}`,
    },

    {
      icon: "📄",
      title: "Pagination, not full load",
      color: "#c084fc",
      good: `// Cursor-based pagination (fastest, stable)
router.get('/posts', async (req, res) => {
  const { limit = 20, cursor } = req.query;

  const query = cursor
    ? { _id: { $lt: cursor } }
    : {};

  const posts = await Post.find(query)
    .sort({ _id: -1 })
    .limit(parseInt(limit) + 1);

  const hasMore = posts.length > limit;
  if (hasMore) posts.pop();

  res.json({ posts, hasMore,
    nextCursor: hasMore ? posts[posts.length-1]._id : null
  });
});`,
      bad: `// Loading all records — never do this!
router.get('/posts', async (req, res) => {
  const posts = await Post.find({}); // ALL records!
  // With 1 million posts:
  // - Query takes 30+ seconds
  // - Uses gigabytes of RAM
  // - Times out for the user
  res.json(posts);
});`,
    },
  ];

  const tip = tips[sel];
  return (
    <div
      style={{
        background: t.surface2,
        borderRadius: 14,
        padding: 20,
        border: `1px solid ${t.border}`,
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Performance — async patterns, caching, pagination
      </p>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}
      >
        {tips.map((tp, i) => (
          <button
            key={i}
            onClick={() => setSel(i)}
            style={{
              background: sel === i ? `${tp.color}30` : t.surface,
              color: sel === i ? tp.color : t.muted,
              border: `1px solid ${sel === i ? `${tp.color}60` : t.border}`,
              borderRadius: 8,
              padding: "5px 12px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.78rem",
            }}
          >
            {tp.icon} {tp.title}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[
          ["✅ Do This", tip.good, t.accent],
          ["❌ Avoid", tip.bad, t.danger],
        ].map(([label, code, col]) => (
          <div key={label} style={{ flex: "1 1 240px" }}>
            <div
              style={{
                color: col,
                fontWeight: 700,
                fontSize: "0.78rem",
                marginBottom: 6,
              }}
            >
              {label}
            </div>
            <div
              style={{
                position: "relative",
                borderRadius: 9,
                overflow: "hidden",
                border: `1px solid ${col}35`,
              }}
            >
              <pre
                style={{
                  margin: 0,
                  background: "#020608",
                  padding: "10px 12px",
                  fontFamily: "monospace",
                  fontSize: "0.73rem",
                  color: col === t.accent ? "#86efac" : "#fca5a5",
                  lineHeight: 1.7,
                  overflow: "auto",
                  maxHeight: 220,
                }}
              >
                {code}
              </pre>
              <CopyBtn code={code} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══ SECTIONS ═══════════════════════════════════════════ */
const SECTIONS = [
  {
    id: "intro",
    icon: "🟢",
    title: "What is Node.js?",
    subtitle:
      "Event loop, V8 engine, non-blocking I/O, single-threaded concurrency",
    Demo: IntroDemo,
    body: "Node.js is a JavaScript runtime built on Chrome's V8 engine that lets you run JavaScript outside the browser. Its superpower is the event loop — a single-threaded, non-blocking architecture that handles thousands of concurrent connections without spawning a new OS thread per request. Created by Ryan Dahl in 2009, it revolutionized backend JavaScript.",
    code: `// Hello World — run with: node server.js
const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify({ message: 'Hello, Node.js!' }));
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

// Useful process properties
console.log(process.version);    // Node.js version
console.log(process.platform);   // 'linux', 'darwin', 'win32'
console.log(process.env.NODE_ENV);
console.log(process.pid);
console.log(process.uptime());

// Install and start
// node --version
// node server.js
// node --watch server.js  (built-in watcher, Node 18+)`,
    tip: "Use Node.js 20+ LTS for all new projects. Enable the built-in --watch flag instead of nodemon for development: node --watch server.js",
  },
  {
    id: "modules",
    icon: "📦",
    title: "Modules",
    subtitle:
      "CommonJS require() vs ES Modules import — exports, imports, differences",
    Demo: ModulesDemo,
    body: "Node.js has two module systems. CommonJS (require/module.exports) is the original — synchronous, works everywhere. ES Modules (import/export) is the modern standard — supports top-level await, tree-shaking, and is how browsers work. New projects should use ES Modules by setting type: module in package.json.",
    code: `// CommonJS — the original Node.js module system
// math.js
function add(a, b) { return a + b; }
module.exports = { add };

// app.js
const { add } = require('./math');
const fs = require('fs');           // built-in

// ES Modules — modern, set "type":"module" in package.json
// math.mjs
export const add = (a, b) => a + b;
function main() {}

// app.mjs
import main, { add } from './math.mjs';
import { readFile } from 'node:fs/promises'; // node: prefix

// __dirname equivalent in ES Modules
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Dynamic import — works in both systems
const { add: sum } = await import('./math.mjs');`,
    tip: "Always use the node: prefix for built-in modules: import from 'node:fs' not just 'fs'. It's faster to resolve and makes it clear it's a built-in, not an npm package.",
  },
  {
    id: "npm",
    icon: "📋",
    title: "npm & package.json",
    subtitle: "Dependencies, devDependencies, scripts, semver, lockfile",
    Demo: NpmDemo,
    body: "npm is the world's largest software registry with over 2 million packages. package.json is your project manifest declaring dependencies, scripts, and metadata. Understanding semantic versioning prevents unexpected breaking changes. Always commit package-lock.json for reproducible installs.",
    code: `# Initialize a new project
npm init -y

# Add dependencies
npm install express mongoose jsonwebtoken
npm install -D nodemon jest eslint   # dev only
npm install -g pm2                   # global tool

# Install from lock file (CI/CD, Docker)
npm ci

# Security
npm audit                            # check vulnerabilities
npm audit fix                        # auto-fix
npm outdated                         # see newer versions

# Run scripts
npm start                            # runs "start" script
npm test                             # runs "test" script
npm run dev                          # runs "dev" script
npm run build                        # runs "build" script

# Inspect
npm list                             # show installed
npm list --depth=0                   # top-level only

# ALWAYS commit package-lock.json!
# It ensures every developer and CI server
# installs the exact same package versions.`,
    tip: "Use npm ci instead of npm install in CI/CD and Docker builds. It's faster, reproducible, and fails if package-lock.json would be modified — catching dependency drift early.",
  },
  {
    id: "async",
    icon: "⚡",
    title: "Async Patterns",
    subtitle: "Callbacks, Promises, async/await, Promise.all, error handling",
    Demo: AsyncDemo,
    body: "JavaScript is single-threaded — async patterns are how Node.js handles I/O without blocking. Callbacks came first (messy nesting). Promises improved chaining. Async/await (ES2017) reads like synchronous code. Always use async/await in modern Node.js and handle errors with try/catch or .catch().",
    code: `// Promise combinators — essential for Node.js

// Promise.all — all run in parallel, fail if any fail
const [user, posts, stats] = await Promise.all([
  getUser(id),
  getPosts(id),
  getStats(id),   // all start simultaneously!
]);

// Promise.allSettled — get results even if some fail
const results = await Promise.allSettled([
  fetchFromAPI1(),
  fetchFromAPI2(),
]);
results.forEach(r => {
  if (r.status === 'fulfilled') use(r.value);
  else console.error(r.reason);
});

// Promise.race — first to resolve/reject wins
const data = await Promise.race([
  fetch('/api/data'),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), 5000)
  ),
]);

// Retry with exponential backoff
async function withRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try { return await fn(); }
    catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 2 ** i * 1000));
    }
  }
}`,
    tip: "Never leave async errors unhandled. Add try/catch to every async function, and always add process.on('unhandledRejection') as a global safety net in your app startup.",
  },
  {
    id: "fs",
    icon: "📁",
    title: "File System",
    subtitle: "fs.promises, readFile, writeFile, mkdir, streams, path module",
    Demo: FileSystemDemo,
    body: "Node.js's built-in fs module provides full filesystem access. Always use the async fs.promises API — synchronous variants block the event loop and stop handling all requests. For large files, always use streams which process data in ~64KB chunks keeping memory constant regardless of file size.",
    code: `import {
  readFile, writeFile, appendFile,
  mkdir, readdir, rm, stat, access
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// __dirname for ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Safe file read
async function safeRead(filePath) {
  try {
    return await readFile(filePath, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') return null;     // not found
    if (err.code === 'EACCES') throw new Error('Permission denied');
    throw err;
  }
}

// Check if file exists
async function exists(p) {
  try { await access(p); return true; }
  catch { return false; }
}

// Walk directory recursively
async function* walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walkDir(full);
    else yield full;
  }
}`,
    tip: "Use path.join() or path.resolve() for all file paths — never string concatenation. String concat breaks on Windows because it uses backslashes instead of forward slashes.",
  },
  {
    id: "http",
    icon: "🌐",
    title: "HTTP & Express",
    subtitle:
      "HTTP module, Express routing, params, query strings, error handling",
    Demo: HttpExpressDemo,
    body: "The built-in http module is the foundation of Node.js web development. In practice, Express is used instead — it adds routing, middleware, and helpers. Express routes map HTTP methods + URL patterns to handler functions. Understanding params (req.params), query strings (req.query), and the body (req.body) is fundamental to building APIs.",
    code: `const express = require('express');
const router  = express.Router();

// GET with query params: /users?page=2&limit=10&role=admin
router.get('/users', async (req, res) => {
  const { page = 1, limit = 20, role } = req.query;

  const filter = role ? { role } : {};
  const users  = await User.find(filter)
    .limit(+limit)
    .skip((+page - 1) * +limit);

  res.json({ data: users, meta: { page: +page } });
});

// GET with URL param: /users/123
router.get('/users/:id', async (req, res) => {
  const { id } = req.params;  // '123'
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

// POST with body
router.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const user = await User.create({ name, email });
  res.status(201).json(user);
});

// Chained route syntax
router.route('/posts/:id')
  .get(getPost)
  .put(authenticate, updatePost)
  .delete(authenticate, authorize('admin'), deletePost);`,
    tip: "Install express-async-errors (one line: require('express-async-errors')) to automatically catch async errors and forward them to your error handler, without wrapping every route in try/catch.",
  },
  {
    id: "middleware",
    icon: "🔗",
    title: "Middleware",
    subtitle:
      "Auth, rate limiting, CORS, helmet, logging — request pipeline order",
    Demo: MiddlewareDemo,
    body: "Middleware are functions that run between the HTTP request arriving and the route handler responding. They can read/modify req and res, end the cycle, or call next() to continue. Order matters — register middleware in the correct sequence: security headers first, then auth, then routes. Every Express feature is middleware.",
    code: `// Middleware function signature
const myMiddleware = (req, res, next) => {
  req.requestTime = Date.now();   // add to request
  console.log(req.method + ' ' + req.url);
  next();                         // pass to next middleware
  // OR: res.status(401).json({ error: 'No token' });
};

// Error middleware — MUST have 4 params
const errorMiddleware = (err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
};

// Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};

// Role authorization factory
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role))
    return res.status(403).json({ error: 'Forbidden' });
  next();
};

// Rate limiter (express-rate-limit)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,
  message: { error: 'Too many requests, slow down!' },
});

// Apply in correct order
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/', limiter);
app.use('/api/profile', authenticate, profileRoutes);`,
    tip: "Order your middleware: helmet → cors → morgan → body-parser → rate-limiter → auth → routes. Rate limiting before auth prevents brute-force attacks on login endpoints.",
  },
  {
    id: "rest",
    icon: "🗺️",
    title: "REST API Design",
    subtitle:
      "HTTP verbs, naming conventions, status codes, versioning, pagination",
    Demo: RestApiDemo,
    body: "REST is an architectural style for HTTP APIs. Key rules: URLs identify resources (nouns, not verbs), HTTP methods express the operation, stateless requests, proper status codes, and consistent response shapes. Well-designed APIs are intuitive and self-documenting — a new developer should understand them without docs.",
    code: `// Complete REST resource — users router
const router = express.Router();

// GET /api/v1/users — paginated list
router.get('/', authenticate, async (req, res) => {
  const { page=1, limit=20, sort='createdAt', order='desc' } = req.query;

  const [users, total] = await Promise.all([
    User.find()
      .sort({ [sort]: order })
      .skip((+page-1)*+limit)
      .limit(+limit)
      .select('-password'),
    User.countDocuments(),
  ]);

  res.json({
    data:  users,
    meta:  { page:+page, limit:+limit, total, pages: Math.ceil(total/+limit) },
  });
});

// POST /api/v1/users — create with 201 + Location header
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  const user = await User.create(req.body);
  res
    .status(201)
    .header('Location', '/api/v1/users/' + user._id)
    .json({ data: user });
});

// PATCH — partial update (not PUT which replaces)
router.patch('/:id', authenticate, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json({ data: user });
});`,
    tip: "Return a Location header after POST requests with the URL of the new resource. This is standard REST practice and lets clients immediately fetch the created resource.",
  },
  {
    id: "events",
    icon: "📡",
    title: "Events & EventEmitter",
    subtitle: "Pub/sub pattern, custom events, decoupling application logic",
    Demo: EventsDemo,
    body: "Node.js's EventEmitter is the backbone of its async nature — HTTP servers, streams, and most core modules are EventEmitters. Use custom events to decouple your application: instead of OrderService directly calling EmailService, emit 'order:created' and let EmailService listen independently. This makes code more maintainable and testable.",
    code: `const { EventEmitter } = require('events');

// Application-level event bus
class AppEvents extends EventEmitter {}
const eventBus = new AppEvents();
eventBus.setMaxListeners(50); // raise from default 10

// Service emits events — knows nothing about listeners
class UserService {
  async createUser(data) {
    const user = await User.create(data);
    eventBus.emit('user:created', user);
    return user;
  }
  async deleteUser(id) {
    const user = await User.findByIdAndDelete(id);
    eventBus.emit('user:deleted', user);
    return user;
  }
}

// Independent services react to events
class EmailService {
  constructor() {
    eventBus.on('user:created', this.sendWelcome.bind(this));
    eventBus.on('user:deleted', this.sendGoodbye.bind(this));
  }
  async sendWelcome(user) { /* send welcome email */ }
  async sendGoodbye(user) { /* send goodbye email */ }
}

class AnalyticsService {
  constructor() {
    eventBus.on('user:created', (user) => {
      analytics.track('user_registered', { id: user._id });
    });
  }
}

// Initialize all services
new EmailService();
new AnalyticsService();
const users = new UserService();`,
    tip: "Always call eventEmitter.setMaxListeners(N) if you register more than 10 listeners. Node.js warns at 10 to detect memory leaks, but production apps with many services legitimately need more.",
  },
  {
    id: "streams",
    icon: "🌊",
    title: "Streams & Buffers",
    subtitle: "Readable, Writable, Transform, pipeline — memory-efficient I/O",
    Demo: StreamsDemo,
    body: "Streams handle large amounts of data without loading it all into memory. Instead of reading a 2GB file then processing it, streams deliver ~64KB chunks as they arrive — keeping memory constant. Every I/O operation in Node.js is stream-based: HTTP requests/responses, file I/O, database queries. Always use pipeline() over .pipe().",
    code: `import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

// Custom Transform stream — CSV line parser
class CSVParser extends Transform {
  constructor() {
    super({ objectMode: true });
    this.headers = null;
    this.buffer  = '';
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop(); // save incomplete line

    for (const line of lines) {
      if (!this.headers) {
        this.headers = line.split(',');
        continue;
      }
      const row = Object.fromEntries(
        line.split(',').map((v, i) => [this.headers[i], v.trim()])
      );
      this.push(row);
    }
    callback();
  }
}

// Process 10GB CSV with ~64KB memory!
await pipeline(
  createReadStream('users-10gb.csv'),
  new CSVParser(),
  new Transform({
    objectMode: true,
    transform(row, _, cb) { cb(null, JSON.stringify(row) + '\n'); }
  }),
  createGzip(),
  createWriteStream('output.ndjson.gz'),
);`,
    tip: "Use stream.pipeline() (the promisified version from stream/promises) instead of .pipe(). The .pipe() method silently fails to clean up streams on error, causing hard-to-debug memory leaks.",
  },
  {
    id: "auth",
    icon: "🔑",
    title: "Authentication",
    subtitle: "JWT tokens, bcrypt hashing, refresh tokens, auth middleware",
    Demo: AuthDemo,
    body: "Authentication verifies who a user is. Two essential tools: JWT (JSON Web Tokens) for stateless session management — signed tokens containing user data — and bcrypt for password hashing — deliberately slow to make brute-force attacks expensive. Never store plain-text passwords. Use the refresh token pattern in production for better security.",
    code: `// Complete auth flow
const jwt    = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Registration
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email taken' });

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hash });

    const token = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token });
  } catch(err) { next(err); }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user  = await User.findOne({ email });
  const valid = user && await bcrypt.compare(password, user.password);

  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { sub: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ token, user: { id: user._id, email } });
});`,
    tip: "Store JWTs in httpOnly cookies, not localStorage. localStorage is vulnerable to XSS attacks. Use sameSite:'strict' and secure:true cookie flags for CSRF protection.",
  },
  {
    id: "env",
    icon: "⚙️",
    title: "Environment & Config",
    subtitle: ".env files, process.env, config validation, secrets management",
    Demo: EnvDemo,
    body: "Environment variables configure Node.js apps across environments without changing code. The .env file (loaded by dotenv) holds local config. Validate all required environment variables at startup — fail fast rather than crashing mysteriously at runtime. Never commit .env to version control.",
    code: `// Install: npm install dotenv zod
require('dotenv').config(); // load .env as early as possible

// Validate with Zod schema
const { z } = require('zod');

const envSchema = z.object({
  NODE_ENV:    z.enum(['development','staging','production']),
  PORT:        z.coerce.number().default(3000),
  MONGODB_URI: z.string().url(),
  JWT_SECRET:  z.string().min(32),
  LOG_LEVEL:   z.enum(['debug','info','warn','error']).default('info'),
  CORS_ORIGIN: z.string().url(),
});

// Parse and validate — throws if invalid
let env;
try {
  env = envSchema.parse(process.env);
} catch (err) {
  console.error('Invalid environment variables:', err.format());
  process.exit(1); // fail fast with clear error message
}

// Export typed config object
module.exports = {
  port:   env.PORT,
  isProd: env.NODE_ENV === 'production',
  db: {
    uri: env.MONGODB_URI,
  },
  jwt: {
    secret:    env.JWT_SECRET,
    expiresIn: '7d',
  },
  cors: {
    origin: env.CORS_ORIGIN,
  },
};`,
    tip: "Use Zod to validate env vars at startup. It gives you type coercion (strings to numbers), clear error messages about which vars are missing, and TypeScript types for free.",
  },
  {
    id: "errors",
    icon: "🚨",
    title: "Error Handling",
    subtitle:
      "Operational vs programmer errors, AppError class, global handlers",
    Demo: ErrorHandlingDemo,
    body: "Proper error handling separates production apps from tutorials. Key insight: operational errors (user not found, validation failed) are expected — handle gracefully. Programmer errors (bugs, undefined access) are not — log them and crash. Never swallow errors silently. Set up global handlers for uncaughtException and unhandledRejection from day one.",
    code: `// AppError — operational error with HTTP status
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Async wrapper — eliminates try/catch in every route
const catchAsync = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Routes throw naturally — catchAsync forwards to error handler
router.get('/users/:id', catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  if (!req.user.canView(user)) throw new AppError('Forbidden', 403);
  res.json(user);
}));

// Global error handler — catches EVERYTHING
app.use((err, req, res, next) => {
  const { statusCode = 500, message, isOperational } = err;

  // Handle specific error types
  if (err.name === 'CastError')
    return res.status(400).json({ error: 'Invalid ID format' });
  if (err.code === 11000)
    return res.status(409).json({ error: 'Duplicate entry' });
  if (err.name === 'JsonWebTokenError')
    return res.status(401).json({ error: 'Invalid token' });
  if (err.name === 'ValidationError')
    return res.status(400).json({ error: err.message });

  // Programmer error — crash and let PM2 restart
  if (!isOperational) {
    console.error('PROGRAMMER ERROR:', err);
    setTimeout(() => process.exit(1), 500);
  }

  res.status(statusCode).json({ error: message });
});`,
    tip: "Set up the AppError class and catchAsync wrapper from day one. Retrofitting error handling into a large codebase is painful. Build the pattern into your starter template.",
  },
  {
    id: "testing",
    icon: "🧪",
    title: "Testing",
    subtitle:
      "Jest, Supertest, unit/integration/E2E, mocking, coverage, mongodb-memory-server",
    Demo: TestingDemo,
    body: "Testing is how you deploy with confidence. Unit tests verify individual functions in isolation (fast, no I/O). Integration tests verify routes and database interactions. E2E tests simulate real user flows. Aim for 80%+ coverage on business logic. Test behavior, not implementation — tests should survive refactoring.",
    code: `// jest.config.js
module.exports = {
  testEnvironment: 'node',
  coverageThreshold: {
    global: { branches:80, functions:85, lines:85 }
  },
};

// tests/setup.js — in-memory database for speed!
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

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
  // Clear all collections between tests
  await Promise.all(
    Object.values(mongoose.connection.collections)
      .map(col => col.deleteMany({}))
  );
});

// Integration test with Supertest
const request = require('supertest');
const app = require('../src/app');

describe('User Registration', () => {
  test('POST /auth/register returns 201', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name:'Alice', email:'a@test.io', password:'Password123!' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
  });
});`,
    tip: "Use mongodb-memory-server for integration tests — it spins up a real MongoDB in memory, so tests are fast (no network), isolated, and don't touch your dev database.",
  },
  {
    id: "deploy",
    icon: "🚀",
    title: "Deployment & Production",
    subtitle: "PM2, Docker, Nginx, CI/CD, health checks, structured logging",
    Demo: DeployDemo,
    body: "Deploying Node.js to production involves several layers: PM2 or Docker for process management (auto-restart on crash, cluster mode for multiple CPU cores), Nginx as a reverse proxy (SSL, rate limiting, static files), CI/CD pipelines for automated testing and deployment, structured logging, and health check endpoints for monitoring.",
    code: `// Production-ready app setup
const express = require('express');
const cluster = require('cluster');
const os      = require('os');

// Cluster mode — use all CPU cores
if (cluster.isPrimary) {
  const cores = os.cpus().length;
  console.log('Starting ' + cores + ' workers...');

  for (let i = 0; i < cores; i++) cluster.fork();

  cluster.on('exit', (worker) => {
    console.log('Worker ' + worker.pid + ' died — restarting');
    cluster.fork();  // auto-restart crashed workers
  });
} else {
  const app = express();
  // ... your app setup ...

  // Health check — used by load balancers and monitoring
  app.get('/health', async (req, res) => {
    try {
      await mongoose.connection.db.admin().ping();
      res.json({
        status:  'healthy',
        uptime:  process.uptime(),
        memory:  process.memoryUsage().heapUsed,
        worker:  process.pid,
      });
    } catch {
      res.status(503).json({ status: 'unhealthy' });
    }
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log('Worker ' + process.pid + ' listening on :' + port);
  });
}`,
    tip: "Use PM2's cluster mode to utilize all CPU cores — a server with 8 cores can handle 8x the requests. Run: pm2 start app.js -i max (PM2 auto-detects core count).",
  },
  {
    id: "perf",
    icon: "📈",
    title: "Performance",
    subtitle: "Async patterns, Redis caching, pagination, connection pooling",
    Demo: PerformanceDemo,
    body: "Node.js performance comes from four areas: always using async I/O (never blocking), caching hot data in Redis, paginating large queries (never load all records), and connection pooling for databases. Profile first with clinic.js or --prof before optimizing — measure, then improve.",
    code: `// Connection pooling — reuse DB connections
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize:     10,  // max connections in pool
  minPoolSize:      2,  // keep 2 warm at all times
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
});

// Redis caching layer
const redis = require('redis');
const cache = redis.createClient({ url: process.env.REDIS_URL });

const withCache = (key, ttl, fn) => async (...args) => {
  const cached = await cache.get(key);
  if (cached) return JSON.parse(cached);

  const result = await fn(...args);
  await cache.setEx(key, ttl, JSON.stringify(result));
  return result;
};

// Use cached version
const getCachedUser = withCache(
  'user:' + id,
  300,            // 5 minutes TTL
  (id) => User.findById(id)
);

// Efficient database queries
const users = await User.find({ active: true })
  .select('name email role')    // only needed fields
  .lean()                       // plain JS objects (faster)
  .limit(20)
  .hint({ active: 1 });         // use specific index

// profile with clinic.js
// npx clinic doctor -- node server.js
// npx clinic flame -- node server.js`,
    tip: "Use .lean() on Mongoose queries when you only need to read data — it returns plain JavaScript objects instead of Mongoose documents, which is 2-3x faster and uses less memory.",
  },
];

/* ══ MAIN COMPONENT — only export default here ═════════ */
export default function NodeJSMasterclass() {
  const [dark, setDark] = useState(true);
  const [activeId, setActiveId] = useState("intro");
  const [search, setSearch] = useState("");
  const [done, setDone] = useState(new Set());
  const mainRef = useRef(null);
  const activeRef = useRef(null);
  const t = T[dark ? "dark" : "light"];

  const filtered = SECTIONS.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.subtitle.toLowerCase().includes(search.toLowerCase()),
  );
  const current = SECTIONS.find((s) => s.id === activeId) || SECTIONS[0];
  const idx = SECTIONS.findIndex((s) => s.id === activeId);
  const pct = Math.round((done.size / SECTIONS.length) * 100);
  const { Demo } = current;

  const go = (id) => {
    setActiveId(id);
    setSearch("");
    setTimeout(
      () => mainRef.current?.scrollTo({ top: 0, behavior: "smooth" }),
      50,
    );
  };
  const toggleDone = (id) =>
    setDone((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeId]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: t.bg,
        color: t.text,
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
        overflow: "hidden",
        transition: "background .3s,color .3s",
      }}
    >
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

      {/* ── HEADER ── */}
      <header
        style={{
          background: t.sidebar,
          borderBottom: `1px solid ${t.border}`,
          height: 56,
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "linear-gradient(135deg,#4ade80,#15803d)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              flexShrink: 0,
            }}
          >
            🟢
          </div>
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: "0.95rem",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Node.js Masterclass
            </div>
            <div style={{ color: t.muted, fontSize: "0.67rem" }}>
              Complete interactive guide · {SECTIONS.length} lessons
            </div>
          </div>
          <span
            style={{
              background: t.accentBg,
              color: t.accent,
              border: `1px solid ${t.accentBorder}`,
              borderRadius: 20,
              padding: "1px 9px",
              fontSize: "0.68rem",
              fontWeight: 800,
            }}
          >
            v20 LTS
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div
              style={{
                width: 90,
                height: 5,
                background: t.border,
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: `linear-gradient(90deg,${t.accent},${t.teal})`,
                  borderRadius: 99,
                  transition: "width .5s",
                }}
              />
            </div>
            <span
              style={{ fontSize: "0.7rem", color: t.muted, fontWeight: 700 }}
            >
              {done.size}/{SECTIONS.length}
            </span>
          </div>
          <button
            onClick={() => setDark((d) => !d)}
            style={{
              background: t.surface2,
              border: `1px solid ${t.border}`,
              borderRadius: 8,
              padding: "5px 12px",
              cursor: "pointer",
              color: t.text,
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* ── SIDEBAR ── */}
        <aside
          style={{
            width: 252,
            flexShrink: 0,
            background: t.sidebar,
            borderRight: `1px solid ${t.border}`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 12px 10px",
              borderBottom: `1px solid ${t.border}`,
              flexShrink: 0,
            }}
          >
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 9,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: t.muted,
                  pointerEvents: "none",
                }}
              >
                🔍
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search lessons…"
                style={{
                  width: "100%",
                  padding: "7px 28px",
                  background: t.surface2,
                  border: `1px solid ${t.border}`,
                  borderRadius: 8,
                  color: t.text,
                  fontSize: "0.82rem",
                  outline: "none",
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: t.muted,
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    padding: 0,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div
            style={{
              padding: "9px 12px",
              borderBottom: `1px solid ${t.border}`,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: t.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Progress
              </span>
              <span
                style={{
                  fontSize: "0.68rem",
                  color: t.accent,
                  fontWeight: 700,
                }}
              >
                {pct}%
              </span>
            </div>
            <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              {SECTIONS.map((s) => (
                <div
                  key={s.id}
                  onClick={() => go(s.id)}
                  title={s.title}
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: 3,
                    background: done.has(s.id)
                      ? "#4ade80"
                      : s.id === activeId
                        ? t.accent
                        : t.border,
                    cursor: "pointer",
                    transition: "background .2s",
                  }}
                />
              ))}
            </div>
          </div>
          <nav
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "6px 8px",
              minHeight: 0,
            }}
          >
            {filtered.length === 0 && (
              <div
                style={{
                  padding: "24px 10px",
                  textAlign: "center",
                  color: t.muted,
                  fontSize: "0.82rem",
                }}
              >
                No lessons found
              </div>
            )}
            {filtered.map((s) => {
              const isActive = s.id === activeId;
              return (
                <button
                  key={s.id}
                  ref={isActive ? activeRef : null}
                  onClick={() => go(s.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 10px",
                    background: isActive ? t.accentBg : "transparent",
                    border: `1px solid ${isActive ? t.accentBorder : "transparent"}`,
                    borderRadius: 8,
                    marginBottom: 2,
                    cursor: "pointer",
                    color: isActive ? t.accent : t.text,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: "0.83rem",
                    fontWeight: isActive ? 700 : 400,
                    transition: "all .15s",
                  }}
                >
                  <span style={{ fontSize: "0.95rem", flexShrink: 0 }}>
                    {s.icon}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.title}
                  </span>
                  {done.has(s.id) && (
                    <span
                      style={{
                        color: t.accent,
                        fontSize: "0.7rem",
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
          <div
            style={{
              padding: "8px 12px",
              borderTop: `1px solid ${t.border}`,
              flexShrink: 0,
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "0.68rem", color: t.muted }}>
              Event Loop to Production Deploy
            </span>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main
          ref={mainRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "28px 32px",
            minWidth: 0,
          }}
        >
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ marginBottom: 22 }}>
              <div style={{ marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: "0.7rem",
                    background: t.accentBg,
                    color: t.accent,
                    border: `1px solid ${t.accentBorder}`,
                    borderRadius: 20,
                    padding: "2px 10px",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                  }}
                >
                  LESSON {idx + 1} / {SECTIONS.length}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: "2.4rem" }}>{current.icon}</span>
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "1.5rem",
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.1,
                      }}
                    >
                      {current.title}
                    </h2>
                    <p
                      style={{
                        margin: "3px 0 0",
                        color: t.muted,
                        fontSize: "0.87rem",
                      }}
                    >
                      {current.subtitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleDone(current.id)}
                  style={{
                    background: done.has(current.id) ? "#4ade8020" : t.surface2,
                    border: `1px solid ${done.has(current.id) ? "#4ade8060" : t.border}`,
                    color: done.has(current.id) ? t.accent : t.muted,
                    borderRadius: 10,
                    padding: "8px 16px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  {done.has(current.id) ? "✓ Completed" : "Mark done"}
                </button>
              </div>
            </div>

            <p
              style={{
                color: t.muted,
                lineHeight: 1.78,
                fontSize: "0.9rem",
                marginBottom: 24,
              }}
            >
              {current.body}
            </p>

            {Demo && (
              <div style={{ marginBottom: 24, animation: "fadeIn .3s ease" }}>
                <SLabel color={t.accent}>Interactive Demo</SLabel>
                <Demo t={t} />
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <SLabel color="#15803d">Code Example</SLabel>
              <Code code={current.code} />
            </div>

            <div style={{ marginBottom: 32 }}>
              <Tip text={current.tip} t={t} />
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                borderTop: `1px solid ${t.border}`,
                paddingTop: 22,
              }}
            >
              <button
                onClick={() => idx > 0 && go(SECTIONS[idx - 1].id)}
                disabled={idx === 0}
                style={{
                  background: t.surface2,
                  border: `1px solid ${t.border}`,
                  color: idx === 0 ? t.muted : t.text,
                  borderRadius: 10,
                  padding: "10px 18px",
                  cursor: idx === 0 ? "not-allowed" : "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  opacity: idx === 0 ? 0.45 : 1,
                }}
              >
                ← Prev
              </button>
              <div
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: "0.78rem",
                  color: t.muted,
                }}
              >
                {idx + 1} of {SECTIONS.length}
              </div>
              <button
                onClick={() => {
                  if (idx < SECTIONS.length - 1) {
                    toggleDone(current.id);
                    go(SECTIONS[idx + 1].id);
                  }
                }}
                disabled={idx === SECTIONS.length - 1}
                style={{
                  background:
                    idx === SECTIONS.length - 1
                      ? t.surface2
                      : `linear-gradient(135deg,${t.accent},#15803d)`,
                  border: "none",
                  color: idx === SECTIONS.length - 1 ? t.muted : "#000",
                  borderRadius: 10,
                  padding: "10px 20px",
                  cursor:
                    idx === SECTIONS.length - 1 ? "not-allowed" : "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  opacity: idx === SECTIONS.length - 1 ? 0.45 : 1,
                  boxShadow:
                    idx === SECTIONS.length - 1
                      ? "none"
                      : `0 4px 14px ${t.accent}45`,
                }}
              >
                Next →
              </button>
            </div>
            <div style={{ height: 40 }} />
          </div>
        </main>
      </div>
    </div>
  );
}
