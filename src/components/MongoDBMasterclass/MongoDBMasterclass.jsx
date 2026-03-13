import { useState, useRef, useEffect } from "react";

/* ── THEME ─────────────────────────────────────────────────── */
const T = {
  dark: {
    bg: "#030d07",
    sidebar: "#061209",
    surface: "#091a0e",
    surface2: "#0e2416",
    border: "#163822",
    text: "#d4f7e0",
    muted: "#4a7a5a",
    accent: "#22c55e",
    accentBg: "#22c55e12",
    accentBorder: "#22c55e35",
    danger: "#f87171",
    warn: "#fbbf24",
    info: "#67e8f9",
    purple: "#c084fc",
    orange: "#fb923c",
  },
  light: {
    bg: "#f0faf3",
    sidebar: "#ffffff",
    surface: "#ffffff",
    surface2: "#e8f7ed",
    border: "#c0e4cc",
    text: "#061209",
    muted: "#3a6a4a",
    accent: "#16a34a",
    accentBg: "#16a34a12",
    accentBorder: "#16a34a35",
    danger: "#dc2626",
    warn: "#d97706",
    info: "#0284c7",
    purple: "#7c3aed",
    orange: "#ea580c",
  },
};

/* ── SHARED COMPONENTS ─────────────────────────────────────── */
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
        background: ok ? "#22c55e22" : "#ffffff0e",
        border: `1px solid ${ok ? "#22c55e66" : "#ffffff18"}`,
        color: ok ? "#22c55e" : "#4a7a5a",
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
  const col = (l) => {
    const t = l.trim();
    if (
      t.startsWith("//") ||
      t.startsWith("#") ||
      t.startsWith("/*") ||
      t.startsWith("*")
    )
      return "#3a6a4a";
    if (
      /\$(set|push|pull|inc|unset|addToSet|match|group|sort|project|lookup|unwind|limit|skip|count|facet|bucket|out|merge|replaceRoot|addFields|geoNear|graphLookup|sample|unionWith|expr|exists|type|regex|and|or|nor|not|gt|gte|lt|lte|ne|in|nin|all|elemMatch|size|mod|where|text|near|eq)\b/.test(
        l,
      )
    )
      return "#22c55e";
    if (/\bdb\.|mongoose\.|Schema\b|model\b|connect\b/.test(l))
      return "#86efac";
    if (/ObjectId|ISODate|NumberLong|NumberDecimal|BinData/.test(l))
      return "#fbbf24";
    if (/"[^"]*"\s*:/.test(l)) return "#67e8f9";
    if (/'[^']*'/.test(l)) return "#86efac";
    return "#b8d4c0";
  };
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #163822",
      }}
    >
      <div
        style={{
          background: "#020a04",
          padding: "14px 16px",
          overflowX: "auto",
        }}
      >
        <pre
          style={{
            margin: 0,
            fontFamily: "'Fira Code','Cascadia Code',monospace",
            fontSize: "0.78rem",
            lineHeight: 1.8,
          }}
        >
          {lines.map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 16 }}>
              <span
                style={{
                  color: "#163822",
                  userSelect: "none",
                  minWidth: 20,
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span style={{ color: col(line) }}>{line || " "}</span>
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
          background: color || "#22c55e",
          borderRadius: 99,
        }}
      />
      <span
        style={{
          fontSize: "0.72rem",
          fontWeight: 700,
          color: "#4a7a5a",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        {children}
      </span>
    </div>
  );
}

/* ── Mini JSON tree ─────────────────────────────────────────── */
function JV({ doc, depth = 0, t }) {
  const valColor = (v) => {
    if (typeof v === "string") return "#86efac";
    if (typeof v === "number") return "#c084fc";
    if (typeof v === "boolean") return "#fb923c";
    if (v === null) return "#f87171";
    return t.text;
  };
  return (
    <div
      style={{
        fontFamily: "'Fira Code',monospace",
        fontSize: "0.76rem",
        lineHeight: 1.8,
      }}
    >
      {Object.entries(doc).map(([k, v]) => {
        const isArr = Array.isArray(v);
        const isObj = v && typeof v === "object" && !isArr;
        return (
          <div key={k} style={{ paddingLeft: depth * 12 }}>
            <span style={{ color: "#67e8f9" }}>"{k}"</span>
            <span style={{ color: t.muted }}>: </span>
            {isArr ? (
              <>
                <span style={{ color: t.muted }}>[</span>
                {v.map((item, i) => (
                  <div key={i} style={{ paddingLeft: 12 }}>
                    {item && typeof item === "object" ? (
                      <JV doc={item} depth={0} t={t} />
                    ) : (
                      <span style={{ color: valColor(item) }}>
                        {typeof item === "string" ? `"${item}"` : String(item)}
                      </span>
                    )}
                    {i < v.length - 1 && (
                      <span style={{ color: t.muted }}>,</span>
                    )}
                  </div>
                ))}
                <span style={{ color: t.muted }}>]</span>
              </>
            ) : isObj ? (
              <>
                <span style={{ color: t.muted }}>{"{"}</span>
                <JV doc={v} depth={0} t={t} />
                <span style={{ color: t.muted }}>{"}"}</span>
              </>
            ) : (
              <span style={{ color: valColor(v) }}>
                {typeof v === "string" ? `"${v}"` : String(v)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 1 — Intro: SQL vs MongoDB
══════════════════════════════════════════════════════════════ */
function IntroDemo({ t }) {
  const [side, setSide] = useState("mongo");
  const concepts = [
    { sql: "Database", mongo: "Database", note: "Same concept" },
    {
      sql: "Table",
      mongo: "Collection",
      note: "Holds documents instead of rows",
    },
    { sql: "Row", mongo: "Document", note: "JSON-like, flexible schema" },
    { sql: "Column", mongo: "Field", note: "Dynamic — each doc can differ" },
    { sql: "Primary Key", mongo: "_id", note: "Auto-generated ObjectId" },
    {
      sql: "JOIN",
      mongo: "$lookup / Embed",
      note: "Prefer embedding when possible",
    },
    { sql: "INDEX", mongo: "Index", note: "Same concept, more types" },
    {
      sql: "VIEW",
      mongo: "View / $merge",
      note: "Read-only computed collections",
    },
  ];
  const mongoDoc = {
    _id: "ObjectId('64a1...')",
    name: "Alice",
    age: 28,
    email: "alice@dev.io",
    skills: ["React", "Node", "MongoDB"],
    address: { city: "New York", zip: "10001" },
    createdAt: "ISODate('2024-01-15')",
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
          margin: "0 0 14px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        SQL vs MongoDB — terminology & data model
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          ["🐘 SQL World", "sql"],
          ["🍃 MongoDB World", "mongo"],
        ].map(([l, v]) => (
          <button
            key={v}
            onClick={() => setSide(v)}
            style={{
              background: side === v ? t.accentBg : t.surface,
              color: side === v ? t.accent : t.muted,
              border: `1px solid ${side === v ? t.accentBorder : t.border}`,
              borderRadius: 8,
              padding: "6px 16px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.82rem",
            }}
          >
            {l}
          </button>
        ))}
      </div>
      {side === "sql" ? (
        <div>
          <p style={{ color: t.muted, fontSize: "0.8rem", marginBottom: 10 }}>
            SQL stores data in rigid rows inside tables. Every row must have the
            same columns.
          </p>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.8rem",
              marginBottom: 12,
            }}
          >
            <thead>
              <tr style={{ background: t.surface }}>
                {["SQL Term", "MongoDB Equivalent", "Note"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 12px",
                      textAlign: "left",
                      color: t.accent,
                      borderBottom: `2px solid ${t.accentBorder}`,
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {concepts.map((c, i) => (
                <tr
                  key={i}
                  style={{ background: i % 2 ? t.surface2 : "transparent" }}
                >
                  <td
                    style={{
                      padding: "7px 12px",
                      fontFamily: "monospace",
                      color: t.warn,
                      borderBottom: `1px solid ${t.border}`,
                    }}
                  >
                    {c.sql}
                  </td>
                  <td
                    style={{
                      padding: "7px 12px",
                      fontFamily: "monospace",
                      color: t.accent,
                      borderBottom: `1px solid ${t.border}`,
                    }}
                  >
                    {c.mongo}
                  </td>
                  <td
                    style={{
                      padding: "7px 12px",
                      color: t.muted,
                      fontSize: "0.76rem",
                      borderBottom: `1px solid ${t.border}`,
                    }}
                  >
                    {c.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 240px" }}>
            <p style={{ color: t.muted, fontSize: "0.8rem", marginBottom: 10 }}>
              MongoDB stores{" "}
              <strong style={{ color: t.text }}>documents</strong> — JSON-like
              objects. Each document in a collection can have{" "}
              <em>different fields</em>.
            </p>
            <div
              style={{
                background: "#020a04",
                border: `1px solid ${t.accentBorder}`,
                borderRadius: 10,
                padding: "12px 14px",
              }}
            >
              <JV doc={mongoDoc} t={t} />
            </div>
          </div>
          <div style={{ flex: "1 1 180px" }}>
            {[
              ["✓ Flexible schema", "No ALTER TABLE needed", t.accent],
              ["✓ Nested data", "Embed sub-docs & arrays", t.accent],
              ["✓ Horizontal scale", "Sharding built-in", t.accent],
              ["✓ JSON native", "Works great with JS", t.accent],
              ["△ No JOINs", "Must embed or $lookup", t.warn],
              ["△ No transactions", "Actually — yes since v4!", t.warn],
            ].map(([h, d, c]) => (
              <div
                key={h}
                style={{
                  background: `${c}12`,
                  border: `1px solid ${c}30`,
                  borderRadius: 8,
                  padding: "7px 10px",
                  marginBottom: 5,
                }}
              >
                <div style={{ color: c, fontWeight: 700, fontSize: "0.78rem" }}>
                  {h}
                </div>
                <div style={{ color: t.muted, fontSize: "0.72rem" }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 2 — Documents & BSON Types
══════════════════════════════════════════════════════════════ */
function DocumentsDemo({ t }) {
  const [sel, setSel] = useState(0);
  const types = [
    {
      name: "String",
      color: "#86efac",
      vals: ['"Hello World"', '"alice@dev.io"', '"2024-01-01"'],
      note: "UTF-8 encoded text",
    },
    {
      name: "Number",
      color: "#c084fc",
      vals: ["42", "3.14", "-100", "1.5e10"],
      note: "Int32, Int64, Double, Decimal128",
    },
    {
      name: "Boolean",
      color: "#fb923c",
      vals: ["true", "false"],
      note: "Literal true or false",
    },
    {
      name: "Array",
      color: "#22c55e",
      vals: ['["react","node","css"]', "[1,2,3,4,5]", "[{x:1},{x:2}]"],
      note: "Ordered, any mixed types",
    },
    {
      name: "Object",
      color: "#67e8f9",
      vals: ['{ city:"NYC", zip:"10001" }', "{ lat:40.7, lng:-74 }"],
      note: "Embedded sub-document",
    },
    {
      name: "ObjectId",
      color: "#fbbf24",
      vals: [
        'ObjectId("64a1f3b2c8e4d12345678901")',
        "// Auto-generated _id",
        "// 12 bytes, sortable by time",
      ],
      note: "12-byte unique identifier",
    },
    {
      name: "Date",
      color: "#f472b6",
      vals: ['ISODate("2024-01-15T10:30:00Z")', "new Date()", "Date.now()"],
      note: "BSON datetime (milliseconds)",
    },
    {
      name: "Null",
      color: "#f87171",
      vals: ["null"],
      note: "Explicit absence of value",
    },
    {
      name: "Binary",
      color: "#94a3b8",
      vals: ["BinData(0, 'base64...')", "// Images, files, UUIDs"],
      note: "Binary data storage",
    },
    {
      name: "Regex",
      color: "#a78bfa",
      vals: ["/^alice/i", "/\\d{4}-\\d{2}/"],
      note: "Regular expression pattern",
    },
  ];
  const tp = types[sel];
  const sampleDoc = {
    _id: "ObjectId('64a1f3b2...')",
    name: "Alice Johnson",
    age: 28,
    score: 9.8,
    active: true,
    skills: ["React", "Node", "MongoDB"],
    address: { city: "New York", country: "US" },
    createdAt: "ISODate('2024-01-15')",
    avatar: "BinData(0,'...')",
    deletedAt: null,
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
          margin: "0 0 14px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        BSON Types — click any type to explore
      </p>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 180px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 5,
              marginBottom: 14,
            }}
          >
            {types.map((tp, i) => (
              <button
                key={i}
                onClick={() => setSel(i)}
                style={{
                  background: sel === i ? tp.color + "30" : t.surface,
                  color: sel === i ? tp.color : t.muted,
                  border: `1px solid ${sel === i ? tp.color + "70" : t.border}`,
                  borderRadius: 7,
                  padding: "4px 10px",
                  cursor: "pointer",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                }}
              >
                {tp.name}
              </button>
            ))}
          </div>
          <div
            style={{
              background: "#020a04",
              border: `1px solid ${tp.color}50`,
              borderRadius: 10,
              padding: "12px 14px",
            }}
          >
            <div
              style={{
                color: tp.color,
                fontWeight: 700,
                fontSize: "0.88rem",
                marginBottom: 4,
              }}
            >
              {tp.name}
            </div>
            <div
              style={{ color: t.muted, fontSize: "0.75rem", marginBottom: 10 }}
            >
              {tp.note}
            </div>
            {tp.vals.map((v, i) => (
              <div
                key={i}
                style={{
                  color: tp.color,
                  fontFamily: "monospace",
                  fontSize: "0.78rem",
                  marginBottom: 3,
                  padding: "3px 0",
                  borderBottom:
                    i < tp.vals.length - 1 ? `1px solid #163822` : "none",
                }}
              >
                {v}
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <div
            style={{
              color: t.muted,
              fontSize: "0.72rem",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            Full document with mixed types:
          </div>
          <div
            style={{
              background: "#020a04",
              border: `1px solid ${t.border}`,
              borderRadius: 10,
              padding: "10px 14px",
              overflowY: "auto",
              maxHeight: 260,
            }}
          >
            <JV doc={sampleDoc} t={t} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 3 — CRUD: Create
══════════════════════════════════════════════════════════════ */
function CreateDemo({ t }) {
  const [mode, setMode] = useState("one");
  const [name, setName] = useState("Charlie");
  const [age, setAge] = useState(25);
  const [email, setEmail] = useState("charlie@dev.io");
  const [role, setRole] = useState("user");
  const [result, setResult] = useState(null);
  const gid = () => Math.random().toString(16).slice(2, 14).padEnd(24, "0");

  const runInsert = () => {
    if (mode === "one") {
      setResult({
        type: "one",
        doc: {
          _id: `ObjectId('${gid()}')`,
          name,
          age,
          email,
          role,
          createdAt: `ISODate('${new Date().toISOString().slice(0, 10)}')`,
        },
      });
    } else {
      setResult({
        type: "many",
        docs: [
          { _id: `ObjectId('${gid()}')`, name: "Dan", age: 30, role: "admin" },
          { _id: `ObjectId('${gid()}')`, name: "Eve", age: 27, role: "user" },
          { _id: `ObjectId('${gid()}')`, name: "Frank", age: 32, role: "user" },
        ],
      });
    }
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
          margin: "0 0 14px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Create — insertOne() & insertMany()
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          ["insertOne", "one"],
          ["insertMany", "many"],
        ].map(([l, v]) => (
          <button
            key={v}
            onClick={() => {
              setMode(v);
              setResult(null);
            }}
            style={{
              background: mode === v ? t.accentBg : t.surface,
              color: mode === v ? t.accent : t.muted,
              border: `1px solid ${mode === v ? t.accentBorder : t.border}`,
              borderRadius: 8,
              padding: "6px 16px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.82rem",
            }}
          >
            db.users.{l}()
          </button>
        ))}
      </div>
      {mode === "one" ? (
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px" }}>
            {[
              ["Name", "text", name, setName],
              ["Email", "email", email, setEmail],
              ["Age", "number", age, setAge],
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
                  <code style={{ color: t.accent }}>{l.toLowerCase()}:</code>
                </label>
                <input
                  type={type}
                  value={val}
                  onChange={(e) =>
                    set(type === "number" ? +e.target.value : e.target.value)
                  }
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
            <div style={{ marginBottom: 12 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.72rem",
                  color: t.muted,
                  marginBottom: 3,
                }}
              >
                <code style={{ color: t.accent }}>role:</code>
              </label>
              <div style={{ display: "flex", gap: 6 }}>
                {["user", "admin", "moderator"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    style={{
                      background: role === r ? t.accentBg : t.surface,
                      color: role === r ? t.accent : t.muted,
                      border: `1px solid ${role === r ? t.accentBorder : t.border}`,
                      borderRadius: 6,
                      padding: "4px 10px",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={runInsert}
              style={{
                width: "100%",
                background: `linear-gradient(135deg,${t.accent},#15803d)`,
                border: "none",
                borderRadius: 8,
                padding: "11px",
                color: "#000",
                fontWeight: 800,
                cursor: "pointer",
                fontSize: "0.88rem",
              }}
            >
              ▶ Run insertOne()
            </button>
          </div>
          <div style={{ flex: "1 1 220px" }}>
            {result?.type === "one" ? (
              <div>
                <div
                  style={{
                    color: t.accent,
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    marginBottom: 8,
                  }}
                >
                  ✓ Acknowledged — 1 document inserted
                </div>
                <div
                  style={{
                    background: "#020a04",
                    border: `1px solid ${t.accentBorder}`,
                    borderRadius: 10,
                    padding: "10px 14px",
                  }}
                >
                  <JV doc={result.doc} t={t} />
                </div>
                <div
                  style={{ marginTop: 8, color: t.muted, fontSize: "0.71rem" }}
                >
                  _id is auto-generated ObjectId (12 bytes, contains timestamp)
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: t.surface,
                  border: `2px dashed ${t.border}`,
                  borderRadius: 10,
                  padding: 20,
                  textAlign: "center",
                  color: t.muted,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div style={{ fontSize: "2rem" }}>🍃</div>
                <div style={{ fontSize: "0.82rem" }}>
                  Configure fields and click Run →
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <p style={{ color: t.muted, fontSize: "0.8rem", marginBottom: 12 }}>
            insertMany() sends one network request for multiple documents — far
            faster than looping insertOne().
          </p>
          <button
            onClick={runInsert}
            style={{
              background: `linear-gradient(135deg,${t.accent},#15803d)`,
              border: "none",
              borderRadius: 8,
              padding: "10px 24px",
              color: "#000",
              fontWeight: 800,
              cursor: "pointer",
              fontSize: "0.88rem",
              marginBottom: 14,
            }}
          >
            ▶ Run insertMany()
          </button>
          {result?.type === "many" && (
            <div>
              <div
                style={{
                  color: t.accent,
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  marginBottom: 8,
                }}
              >
                ✓ Acknowledged — {result.docs.length} documents inserted
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {result.docs.map((doc, i) => (
                  <div
                    key={i}
                    style={{
                      flex: "1 1 160px",
                      background: "#020a04",
                      border: `1px solid ${t.accentBorder}`,
                      borderRadius: 9,
                      padding: "8px 12px",
                    }}
                  >
                    <div
                      style={{
                        color: t.accent,
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        marginBottom: 4,
                      }}
                    >
                      Doc {i + 1}
                    </div>
                    <JV doc={doc} t={t} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 4 — CRUD: Read / find()
══════════════════════════════════════════════════════════════ */
const DB = [
  {
    _id: 1,
    name: "Alice",
    age: 28,
    role: "admin",
    city: "NYC",
    active: true,
    score: 9.2,
    tags: ["js", "react"],
  },
  {
    _id: 2,
    name: "Bob",
    age: 34,
    role: "user",
    city: "LA",
    active: true,
    score: 7.8,
    tags: ["python"],
  },
  {
    _id: 3,
    name: "Charlie",
    age: 22,
    role: "user",
    city: "NYC",
    active: false,
    score: 8.5,
    tags: ["js", "css"],
  },
  {
    _id: 4,
    name: "Diana",
    age: 41,
    role: "admin",
    city: "Chicago",
    active: true,
    score: 9.7,
    tags: ["java", "react"],
  },
  {
    _id: 5,
    name: "Eve",
    age: 29,
    role: "user",
    city: "NYC",
    active: true,
    score: 6.3,
    tags: ["js"],
  },
  {
    _id: 6,
    name: "Frank",
    age: 19,
    role: "user",
    city: "LA",
    active: false,
    score: 7.1,
    tags: ["css", "html"],
  },
];

function ReadDemo({ t }) {
  const [filter, setFilter] = useState("{}");
  const [sort, setSort] = useState("");
  const [limit, setLimit] = useState("");
  const [err, setErr] = useState(null);
  const [results, setResults] = useState(DB);
  const presets = [
    { label: "All", f: "{}", s: "", l: "" },
    { label: "Admins", f: '{"role":"admin"}', s: "", l: "" },
    { label: "NYC", f: '{"city":"NYC"}', s: "", l: "" },
    { label: "Age > 25", f: '{"age":{"$gt":25}}', s: "", l: "" },
    { label: "Active+NYC", f: '{"active":true,"city":"NYC"}', s: "", l: "" },
    { label: "Sort by score", f: "{}", s: '{"score":-1}', l: "" },
    { label: "Top 3", f: "{}", s: '{"score":-1}', l: "3" },
    {
      label: "High scorers",
      f: '{"score":{"$gte":8}}',
      s: '{"score":-1}',
      l: "",
    },
  ];
  const run = (f = filter, s = sort, l = limit) => {
    try {
      const fo = JSON.parse(f || "{}");
      const so = s ? JSON.parse(s) : null;
      const li = l ? parseInt(l) : null;
      setErr(null);
      let res = DB.filter((doc) =>
        Object.entries(fo).every(([k, v]) => {
          if (v && typeof v === "object") {
            if (v.$gt !== undefined) return doc[k] > v.$gt;
            if (v.$gte !== undefined) return doc[k] >= v.$gte;
            if (v.$lt !== undefined) return doc[k] < v.$lt;
            if (v.$lte !== undefined) return doc[k] <= v.$lte;
            if (v.$in !== undefined) return v.$in.includes(doc[k]);
            if (v.$ne !== undefined) return doc[k] !== v.$ne;
          }
          return doc[k] === v;
        }),
      );
      if (so) {
        const [key, dir] = Object.entries(so)[0];
        res = [...res].sort((a, b) =>
          dir === 1 ? a[key] - b[key] : b[key] - a[key],
        );
      }
      if (li) res = res.slice(0, li);
      setResults(res);
    } catch {
      setErr("Invalid JSON");
    }
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
        Read — find(), sort(), limit() playground
      </p>
      <div
        style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}
      >
        {presets.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              setFilter(p.f);
              setSort(p.s);
              setLimit(p.l);
              run(p.f, p.s, p.l);
            }}
            style={{
              background: t.surface,
              color: t.muted,
              border: `1px solid ${t.border}`,
              borderRadius: 20,
              padding: "3px 10px",
              cursor: "pointer",
              fontSize: "0.72rem",
              fontWeight: 700,
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div
        style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}
      >
        {[
          ["Filter (query)", filter, setFilter, "100%"],
          ["sort()", sort, setSort, "140px"],
          ["limit()", limit, setLimit, "80px"],
        ].map(([l, val, set, w]) => (
          <div
            key={l}
            style={{ flex: w === "100%" ? "1 1 200px" : `0 0 ${w}` }}
          >
            <label
              style={{
                display: "block",
                color: t.muted,
                fontSize: "0.7rem",
                marginBottom: 3,
              }}
            >
              {l}
            </label>
            <input
              value={val}
              onChange={(e) => set(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "7px 10px",
                background: "#020a04",
                border: `1px solid ${err && l.includes("Filter") ? t.danger : t.border}`,
                borderRadius: 7,
                color: "#22c55e",
                fontSize: "0.78rem",
                fontFamily: "monospace",
                outline: "none",
              }}
            />
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button
            onClick={() => run()}
            style={{
              background: t.accent,
              border: "none",
              borderRadius: 7,
              padding: "8px 16px",
              color: "#000",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            ▶ Run
          </button>
        </div>
      </div>
      {err && (
        <div style={{ color: t.danger, fontSize: "0.75rem", marginBottom: 8 }}>
          ⚠ {err}
        </div>
      )}
      <div style={{ color: t.muted, fontSize: "0.72rem", marginBottom: 8 }}>
        Matched: <strong style={{ color: t.accent }}>{results.length}</strong> /{" "}
        {DB.length} documents
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          maxHeight: 220,
          overflowY: "auto",
        }}
      >
        {results.map((doc, i) => (
          <div
            key={i}
            style={{
              flex: "1 1 160px",
              background: "#020a04",
              border: `1px solid ${t.accentBorder}`,
              borderRadius: 9,
              padding: "8px 12px",
            }}
          >
            <JV doc={doc} t={t} />
          </div>
        ))}
        {results.length === 0 && (
          <div style={{ padding: "20px", color: t.muted }}>
            No documents match.
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 5 — Query Operators
══════════════════════════════════════════════════════════════ */
function QueryOpsDemo({ t }) {
  const [cat, setCat] = useState("comparison");
  const [sel, setSel] = useState(0);
  const cats = {
    comparison: {
      color: "#22c55e",
      ops: [
        { op: "$eq", ex: "{ age: { $eq: 28 } }", result: "age === 28" },
        {
          op: "$ne",
          ex: '{ role: { $ne: "admin" } }',
          result: "role !== 'admin'",
        },
        { op: "$gt", ex: "{ age: { $gt: 25 } }", result: "age > 25" },
        { op: "$gte", ex: "{ score: { $gte: 8.0 } }", result: "score >= 8.0" },
        { op: "$lt", ex: "{ age: { $lt: 30 } }", result: "age < 30" },
        { op: "$lte", ex: "{ price: { $lte: 100 } }", result: "price ≤ 100" },
        {
          op: "$in",
          ex: '{ city: { $in: ["NYC","LA"] } }',
          result: "city is NYC or LA",
        },
        {
          op: "$nin",
          ex: '{ role: { $nin: ["banned"] } }',
          result: "role not in list",
        },
      ],
    },
    logical: {
      color: "#67e8f9",
      ops: [
        {
          op: "$and",
          ex: "{ $and: [{ age:{$gt:18} }, { active:true }] }",
          result: "age>18 AND active",
        },
        {
          op: "$or",
          ex: '{ $or: [{ city:"NYC" }, { city:"LA" }] }',
          result: "NYC OR LA",
        },
        {
          op: "$nor",
          ex: '{ $nor: [{ role:"banned" }, { active:false }] }',
          result: "NOT banned AND NOT inactive",
        },
        {
          op: "$not",
          ex: "{ age: { $not: { $lt: 21 } } }",
          result: "NOT (age < 21) = age ≥ 21",
        },
      ],
    },
    element: {
      color: "#c084fc",
      ops: [
        {
          op: "$exists",
          ex: "{ phone: { $exists: true } }",
          result: "document has a phone field",
        },
        {
          op: "$type",
          ex: '{ age: { $type: "number" } }',
          result: "age field is BSON number type",
        },
      ],
    },
    array: {
      color: "#fb923c",
      ops: [
        {
          op: "$all",
          ex: '{ tags: { $all: ["js","react"] } }',
          result: "tags contains BOTH js AND react",
        },
        {
          op: "$elemMatch",
          ex: "{ scores: { $elemMatch: { $gte: 90 } } }",
          result: "at least one score ≥ 90",
        },
        {
          op: "$size",
          ex: "{ tags: { $size: 3 } }",
          result: "tags array has exactly 3 items",
        },
      ],
    },
    text: {
      color: "#fbbf24",
      ops: [
        {
          op: "$regex",
          ex: "{ name: { $regex: /^alice/i } }",
          result: "name starts with 'alice' (case-insensitive)",
        },
        {
          op: "$text",
          ex: '{ $text: { $search: "mongodb tutorial" } }',
          result: "full-text search (requires text index)",
        },
        {
          op: "$expr",
          ex: '{ $expr: { $gt: ["$age", "$minAge"] } }',
          result: "compare two fields in same doc",
        },
      ],
    },
  };
  const catData = cats[cat];
  const idx = Math.min(sel, catData.ops.length - 1);
  const op = catData.ops[idx];
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
        Query Operators —{" "}
        {Object.values(cats).reduce((s, c) => s + c.ops.length, 0)} operators
        across 5 categories
      </p>
      <div
        style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}
      >
        {Object.keys(cats).map((c) => (
          <button
            key={c}
            onClick={() => {
              setCat(c);
              setSel(0);
            }}
            style={{
              background: cat === c ? cats[c].color + "30" : t.surface,
              color: cat === c ? cats[c].color : t.muted,
              border: `1px solid ${cat === c ? cats[c].color + "70" : t.border}`,
              borderRadius: 20,
              padding: "4px 14px",
              cursor: "pointer",
              fontSize: "0.78rem",
              fontWeight: 700,
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 auto" }}>
          {catData.ops.map((o, i) => (
            <button
              key={i}
              onClick={() => setSel(i)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: idx === i ? catData.color + "25" : t.surface,
                color: idx === i ? catData.color : t.muted,
                border: `1px solid ${idx === i ? catData.color + "60" : t.border}`,
                borderRadius: 7,
                padding: "6px 14px",
                marginBottom: 4,
                cursor: "pointer",
                fontSize: "0.82rem",
                fontWeight: 700,
                fontFamily: "monospace",
              }}
            >
              {o.op}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div
            style={{
              background: "#020a04",
              border: `1px solid ${catData.color}50`,
              borderRadius: 10,
              padding: "14px 16px",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                color: catData.color,
                fontWeight: 700,
                fontSize: "1rem",
                marginBottom: 8,
                fontFamily: "monospace",
              }}
            >
              {op.op}
            </div>
            <pre
              style={{
                margin: 0,
                color: catData.color,
                fontFamily: "monospace",
                fontSize: "0.8rem",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}
            >
              {op.ex}
            </pre>
          </div>
          <div
            style={{
              background: t.accentBg,
              border: `1px solid ${t.accentBorder}`,
              borderRadius: 8,
              padding: "10px 14px",
            }}
          >
            <div
              style={{
                color: t.muted,
                fontSize: "0.7rem",
                fontWeight: 700,
                marginBottom: 3,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Means:
            </div>
            <code style={{ color: t.accent, fontSize: "0.84rem" }}>
              {op.result}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
/* ══════════════════════════════════════════════════════════════
   DEMO 6 — CRUD: Update
══════════════════════════════════════════════════════════════ */
function UpdateDemo({ t }) {
  const [op, setOp] = useState("$set");
  const [docs, setDocs] = useState([
    {
      _id: 1,
      name: "Alice",
      age: 28,
      score: 7.5,
      skills: ["js"],
      active: true,
    },
    {
      _id: 2,
      name: "Bob",
      age: 34,
      score: 6.2,
      skills: ["python"],
      active: false,
    },
  ]);
  const [result, setResult] = useState(null);

  const ops = {
    $set: {
      desc: "Set (update) a field value",
      apply: (d) => ({ ...d, score: 9.5, updatedAt: "2024-01-20" }),
      preview: "{ $set: { score: 9.5, updatedAt: new Date() } }",
    },
    $unset: {
      desc: "Remove a field entirely",
      apply: (d) => {
        const n = { ...d };
        delete n.active;
        return n;
      },
      preview: '{ $unset: { active: "" } }',
    },
    $inc: {
      desc: "Increment a numeric field",
      apply: (d) => ({ ...d, age: d.age + 1 }),
      preview: "{ $inc: { age: 1 } }",
    },
    $push: {
      desc: "Append to an array",
      apply: (d) => ({ ...d, skills: [...d.skills, "mongodb"] }),
      preview: '{ $push: { skills: "mongodb" } }',
    },
    $pull: {
      desc: "Remove from an array by value",
      apply: (d) => ({ ...d, skills: d.skills.filter((s) => s !== "js") }),
      preview: '{ $pull: { skills: "js" } }',
    },
    $addToSet: {
      desc: "Add to array only if not present",
      apply: (d) => ({
        ...d,
        skills: d.skills.includes("react") ? d.skills : [...d.skills, "react"],
      }),
      preview: '{ $addToSet: { skills: "react" } }',
    },
    $rename: {
      desc: "Rename a field",
      apply: (d) => {
        const n = { ...d, username: d.name };
        delete n.name;
        return n;
      },
      preview: '{ $rename: { name: "username" } }',
    },
    $mul: {
      desc: "Multiply a numeric field",
      apply: (d) => ({ ...d, score: +(d.score * 1.1).toFixed(2) }),
      preview: "{ $mul: { score: 1.1 } }",
    },
  };
  const current = ops[op];

  const runUpdate = () => {
    const updated = docs.map((d, i) => (i === 0 ? current.apply(d) : d));
    setDocs(updated);
    setResult({ modified: 1, matched: 1 });
  };
  const reset = () => {
    setDocs([
      {
        _id: 1,
        name: "Alice",
        age: 28,
        score: 7.5,
        skills: ["js"],
        active: true,
      },
      {
        _id: 2,
        name: "Bob",
        age: 34,
        score: 6.2,
        skills: ["python"],
        active: false,
      },
    ]);
    setResult(null);
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
        Update Operators — applied to the first document
      </p>
      <div
        style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}
      >
        {Object.keys(ops).map((o) => (
          <button
            key={o}
            onClick={() => {
              setOp(o);
              setResult(null);
            }}
            style={{
              background: op === o ? t.accentBg : t.surface,
              color: op === o ? t.accent : t.muted,
              border: `1px solid ${op === o ? t.accentBorder : t.border}`,
              borderRadius: 7,
              padding: "4px 10px",
              cursor: "pointer",
              fontSize: "0.78rem",
              fontWeight: 700,
              fontFamily: "monospace",
            }}
          >
            {o}
          </button>
        ))}
      </div>
      <div
        style={{
          background: "#020a04",
          border: `1px solid ${t.accentBorder}`,
          borderRadius: 9,
          padding: "10px 14px",
          marginBottom: 12,
        }}
      >
        <div style={{ color: t.muted, fontSize: "0.7rem", marginBottom: 4 }}>
          db.users.updateOne({"{ _id: 1 }"},{" "}
          <span style={{ color: t.accent }}>{current.preview}</span>)
        </div>
        <div style={{ color: t.muted, fontSize: "0.72rem" }}>
          {current.desc}
        </div>
      </div>
      <div
        style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}
      >
        {docs.map((doc, i) => (
          <div
            key={i}
            style={{
              flex: "1 1 200px",
              background: "#020a04",
              border: `1px solid ${i === 0 ? t.accentBorder : t.border}`,
              borderRadius: 9,
              padding: "8px 12px",
            }}
          >
            <div
              style={{
                color: i === 0 ? t.accent : t.muted,
                fontSize: "0.68rem",
                fontWeight: 700,
                marginBottom: 5,
              }}
            >
              {i === 0 ? "← Will be updated" : "Unchanged"}
            </div>
            <JV doc={doc} t={t} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={runUpdate}
          style={{
            background: `linear-gradient(135deg,${t.accent},#15803d)`,
            border: "none",
            borderRadius: 8,
            padding: "9px 20px",
            color: "#000",
            fontWeight: 800,
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          ▶ Run updateOne()
        </button>
        <button
          onClick={reset}
          style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: 8,
            padding: "9px 16px",
            color: t.muted,
            cursor: "pointer",
            fontSize: "0.82rem",
          }}
        >
          ↺ Reset
        </button>
      </div>
      {result && (
        <div
          style={{
            marginTop: 10,
            background: t.accentBg,
            border: `1px solid ${t.accentBorder}`,
            borderRadius: 8,
            padding: "8px 14px",
            color: t.accent,
            fontSize: "0.78rem",
            fontFamily: "monospace",
          }}
        >
          {"{ acknowledged: true, matchedCount: 1, modifiedCount: 1 }"}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 7 — CRUD: Delete
══════════════════════════════════════════════════════════════ */
function DeleteDemo({ t }) {
  const initial = [
    { _id: 1, name: "Alice", role: "admin", active: true },
    { _id: 2, name: "Bob", role: "user", active: false },
    { _id: 3, name: "Charlie", role: "user", active: true },
    { _id: 4, name: "Diana", role: "admin", active: true },
    { _id: 5, name: "Eve", role: "user", active: false },
  ];
  const [docs, setDocs] = useState(initial);
  const [mode, setMode] = useState("one");
  const [log, setLog] = useState([]);

  const deleteOne = () => {
    const idx = docs.findIndex((d) => !d.active);
    if (idx === -1) return;
    const del = docs[idx];
    setDocs(docs.filter((_, i) => i !== idx));
    setLog((l) => [
      `deleteOne({active:false}) → deleted "${del.name}" (_id:${del._id})`,
      ...l,
    ]);
  };
  const deleteMany = () => {
    const del = docs.filter((d) => d.role === "user");
    setDocs(docs.filter((d) => d.role !== "user"));
    setLog((l) => [
      `deleteMany({role:"user"}) → deleted ${del.length} documents`,
      ...l,
    ]);
  };
  const findAndDelete = () => {
    if (docs.length === 0) return;
    const del = docs[0];
    setDocs(docs.slice(1));
    setLog((l) => [
      `findOneAndDelete({_id:${del._id}}) → returned & deleted "${del.name}"`,
      ...l,
    ]);
  };
  const reset = () => {
    setDocs(initial);
    setLog([]);
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
          margin: "0 0 14px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Delete Operations — live document removal
      </p>
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}
      >
        <button
          onClick={deleteOne}
          style={{
            background: "#f8717120",
            border: "1px solid #f8717150",
            color: "#f87171",
            borderRadius: 8,
            padding: "7px 14px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.8rem",
          }}
        >
          deleteOne({"{active:false}"})
        </button>
        <button
          onClick={deleteMany}
          style={{
            background: "#f8717120",
            border: "1px solid #f8717150",
            color: "#f87171",
            borderRadius: 8,
            padding: "7px 14px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.8rem",
          }}
        >
          deleteMany({"{role:'user'}"})
        </button>
        <button
          onClick={findAndDelete}
          style={{
            background: "#fb923c20",
            border: "1px solid #fb923c50",
            color: "#fb923c",
            borderRadius: 8,
            padding: "7px 14px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.8rem",
          }}
        >
          findOneAndDelete()
        </button>
        <button
          onClick={reset}
          style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: 8,
            padding: "7px 14px",
            color: t.muted,
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          ↺ Reset
        </button>
      </div>
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}
      >
        {docs.map((doc) => (
          <div
            key={doc._id}
            style={{
              flex: "1 1 130px",
              background: "#020a04",
              border: `1px solid ${doc.active ? t.accentBorder : t.danger + "40"}`,
              borderRadius: 9,
              padding: "8px 10px",
              transition: "all 0.3s",
            }}
          >
            <JV doc={doc} t={t} />
          </div>
        ))}
        {docs.length === 0 && (
          <div style={{ padding: "20px", color: t.muted }}>
            Collection is empty. Click ↺ Reset.
          </div>
        )}
      </div>
      <div style={{ color: t.muted, fontSize: "0.72rem", marginBottom: 6 }}>
        Remaining: <strong style={{ color: t.accent }}>{docs.length}</strong>
      </div>
      {log.length > 0 && (
        <div
          style={{
            background: "#020a04",
            border: `1px solid ${t.border}`,
            borderRadius: 8,
            padding: "8px 12px",
            maxHeight: 100,
            overflowY: "auto",
          }}
        >
          {log.map((l, i) => (
            <div
              key={i}
              style={{
                color: i === 0 ? t.danger : t.muted,
                fontFamily: "monospace",
                fontSize: "0.72rem",
                marginBottom: 2,
              }}
            >
              {l}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 8 — Aggregation Pipeline
══════════════════════════════════════════════════════════════ */
function AggregationDemo({ t }) {
  const [stage, setStage] = useState(0);
  const rawData = [
    { name: "Alice", dept: "Engineering", salary: 95000, city: "NYC" },
    { name: "Bob", dept: "Marketing", salary: 72000, city: "LA" },
    { name: "Carol", dept: "Engineering", salary: 105000, city: "NYC" },
    { name: "Dan", dept: "Marketing", salary: 68000, city: "Chicago" },
    { name: "Eve", dept: "Engineering", salary: 88000, city: "NYC" },
    { name: "Frank", dept: "HR", salary: 62000, city: "LA" },
    { name: "Grace", dept: "HR", salary: 65000, city: "NYC" },
  ];
  const stages = [
    {
      name: "Source",
      op: "Collection",
      color: "#4a7a5a",
      desc: "The raw documents in the collection before any pipeline stages.",
      data: rawData,
    },
    {
      name: "$match",
      op: "$match",
      color: "#22c55e",
      desc: "Filter: only keep Engineering department employees.",
      query: '{ $match: { dept: "Engineering" } }',
      data: rawData.filter((d) => d.dept === "Engineering"),
    },
    {
      name: "$group",
      op: "$group",
      color: "#67e8f9",
      desc: "Group by dept, count employees, calculate average salary.",
      query:
        '{ $group: { _id:"$dept", count:{$sum:1}, avgSalary:{$avg:"$salary"} } }',
      data: (() => {
        const eng = rawData.filter((d) => d.dept === "Engineering");
        return [
          {
            _id: "Engineering",
            count: eng.length,
            avgSalary: Math.round(
              eng.reduce((s, d) => s + d.salary, 0) / eng.length,
            ),
          },
        ];
      })(),
    },
    {
      name: "$sort",
      op: "$sort",
      color: "#c084fc",
      desc: "Sort results by avgSalary descending.",
      query: "{ $sort: { avgSalary: -1 } }",
      data: (() => {
        const eng = rawData.filter((d) => d.dept === "Engineering");
        return [
          {
            _id: "Engineering",
            count: eng.length,
            avgSalary: Math.round(
              eng.reduce((s, d) => s + d.salary, 0) / eng.length,
            ),
            rank: 1,
          },
        ];
      })(),
    },
    {
      name: "$project",
      op: "$project",
      color: "#fbbf24",
      desc: "Shape the output — rename fields, compute new ones.",
      query:
        '{ $project: { department:"$_id", headcount:"$count", avgSalary:1, _id:0 } }',
      data: [{ department: "Engineering", headcount: 3, avgSalary: 96000 }],
    },
  ];
  const s = stages[stage];
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
          margin: "0 0 14px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Aggregation Pipeline — data transforms step by step
      </p>
      {/* Pipeline visual */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          marginBottom: 16,
          overflowX: "auto",
          paddingBottom: 4,
        }}
      >
        {stages.map((st, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
          >
            <button
              onClick={() => setStage(i)}
              style={{
                background: stage === i ? st.color + "35" : t.surface,
                color: stage === i ? st.color : t.muted,
                border: `2px solid ${stage === i ? st.color : t.border}`,
                borderRadius: 8,
                padding: "7px 12px",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.78rem",
                fontFamily: "monospace",
                transition: "all .2s",
              }}
            >
              {st.op}
            </button>
            {i < stages.length - 1 && (
              <div
                style={{ color: t.muted, margin: "0 2px", fontSize: "1rem" }}
              >
                →
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 240px" }}>
          <div
            style={{
              background: `${s.color}20`,
              border: `1px solid ${s.color}50`,
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                color: s.color,
                fontWeight: 700,
                fontSize: "0.88rem",
                marginBottom: 4,
                fontFamily: "monospace",
              }}
            >
              {s.op}
            </div>
            <div style={{ color: t.muted, fontSize: "0.78rem" }}>{s.desc}</div>
          </div>
          {s.query && (
            <div
              style={{
                background: "#020a04",
                border: `1px solid ${s.color}40`,
                borderRadius: 9,
                padding: "8px 12px",
              }}
            >
              <pre
                style={{
                  margin: 0,
                  color: s.color,
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  whiteSpace: "pre-wrap",
                }}
              >
                {s.query}
              </pre>
            </div>
          )}
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <div
            style={{
              color: t.muted,
              fontSize: "0.7rem",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            {s.data.length} document{s.data.length !== 1 ? "s" : ""} after this
            stage:
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              maxHeight: 220,
              overflowY: "auto",
            }}
          >
            {s.data.map((doc, i) => (
              <div
                key={i}
                style={{
                  background: "#020a04",
                  border: `1px solid ${s.color}40`,
                  borderRadius: 8,
                  padding: "7px 12px",
                }}
              >
                <JV doc={doc} t={t} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 9 — Indexes
══════════════════════════════════════════════════════════════ */
function IndexesDemo({ t }) {
  const [type, setType] = useState(0);
  const [animated, setAnimated] = useState(false);
  const idxTypes = [
    {
      name: "Single Field",
      color: "#22c55e",
      icon: "1️⃣",
      desc: "Index on one field. Most common type.",
      create: "db.users.createIndex({ age: 1 })",
      usage: "Queries filtering/sorting by age.",
      speed: 95,
    },
    {
      name: "Compound",
      color: "#67e8f9",
      icon: "⚡",
      desc: "Index on 2+ fields. Order matters — follows ESR rule.",
      create: "db.users.createIndex({ role: 1, age: -1 })",
      usage: "Queries using both role AND age.",
      speed: 92,
    },
    {
      name: "Text",
      color: "#c084fc",
      icon: "🔤",
      desc: "Full-text search across string fields.",
      create: 'db.articles.createIndex({ title: "text", body: "text" })',
      usage: 'db.articles.find({ $text: { $search: "mongodb" } })',
      speed: 80,
    },
    {
      name: "Geospatial",
      color: "#fbbf24",
      icon: "🗺️",
      desc: "2dsphere for GeoJSON, 2d for flat planes.",
      create: 'db.places.createIndex({ location: "2dsphere" })',
      usage: "$near, $geoWithin, $geoIntersects queries.",
      speed: 88,
    },
    {
      name: "Sparse",
      color: "#fb923c",
      icon: "🕳️",
      desc: "Only indexes documents where the field exists.",
      create: "db.users.createIndex({ phone: 1 }, { sparse: true })",
      usage: "Fields that are present on only some documents.",
      speed: 70,
    },
    {
      name: "TTL",
      color: "#f472b6",
      icon: "⏰",
      desc: "Auto-deletes documents after a time period.",
      create:
        "db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 })",
      usage: "Sessions, caches, temporary data.",
      speed: 60,
    },
    {
      name: "Unique",
      color: "#f87171",
      icon: "🔑",
      desc: "Enforces uniqueness like a SQL UNIQUE constraint.",
      create: "db.users.createIndex({ email: 1 }, { unique: true })",
      usage: "Email, username, SSN — any unique field.",
      speed: 94,
    },
    {
      name: "Wildcard",
      color: "#a78bfa",
      icon: "✳️",
      desc: "Indexes all fields or a subset dynamically.",
      create: 'db.products.createIndex({ "attributes.$**": 1 })',
      usage: "Dynamic schemas where fields vary per document.",
      speed: 75,
    },
  ];
  const idx = idxTypes[type];

  const withoutIdx = [100, 85, 72, 91, 60, 44, 78, 55, 82]; // fake "scan" pattern
  const withIdx = [100, 5, 4, 6, 3, 5, 4, 3, 5];

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
          margin: "0 0 14px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Indexes — {idxTypes.length} types, visualized
      </p>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}
      >
        {idxTypes.map((tp, i) => (
          <button
            key={i}
            onClick={() => setType(i)}
            style={{
              background: type === i ? tp.color + "30" : t.surface,
              color: type === i ? tp.color : t.muted,
              border: `1px solid ${type === i ? tp.color + "70" : t.border}`,
              borderRadius: 7,
              padding: "5px 10px",
              cursor: "pointer",
              fontSize: "0.76rem",
              fontWeight: 700,
            }}
          >
            {tp.icon} {tp.name}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px" }}>
          <div
            style={{
              background: `${idx.color}18`,
              border: `1px solid ${idx.color}45`,
              borderRadius: 10,
              padding: "14px 16px",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                color: idx.color,
                fontWeight: 700,
                fontSize: "0.9rem",
                marginBottom: 6,
              }}
            >
              {idx.icon} {idx.name} Index
            </div>
            <div
              style={{
                color: t.muted,
                fontSize: "0.78rem",
                lineHeight: 1.6,
                marginBottom: 10,
              }}
            >
              {idx.desc}
            </div>
            <div style={{ marginBottom: 8 }}>
              <div
                style={{
                  color: t.muted,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  marginBottom: 3,
                  textTransform: "uppercase",
                }}
              >
                Best for:
              </div>
              <div style={{ color: t.text, fontSize: "0.76rem" }}>
                {idx.usage}
              </div>
            </div>
            <div
              style={{
                color: t.muted,
                fontSize: "0.68rem",
                fontWeight: 700,
                marginBottom: 4,
                textTransform: "uppercase",
              }}
            >
              Performance score:
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  flex: 1,
                  height: 6,
                  background: t.border,
                  borderRadius: 99,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${idx.speed}%`,
                    height: "100%",
                    background: idx.color,
                    borderRadius: 99,
                    transition: "width 0.5s",
                  }}
                />
              </div>
              <span
                style={{
                  color: idx.color,
                  fontWeight: 700,
                  fontSize: "0.78rem",
                }}
              >
                {idx.speed}%
              </span>
            </div>
          </div>
          <div
            style={{
              background: "#020a04",
              border: `1px solid ${idx.color}40`,
              borderRadius: 9,
              padding: "10px 14px",
            }}
          >
            <div
              style={{
                color: t.muted,
                fontSize: "0.68rem",
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              CREATE:
            </div>
            <pre
              style={{
                margin: 0,
                color: idx.color,
                fontFamily: "monospace",
                fontSize: "0.74rem",
                whiteSpace: "pre-wrap",
              }}
            >
              {idx.create}
            </pre>
          </div>
        </div>
        <div style={{ flex: "1 1 180px" }}>
          <div
            style={{
              color: t.muted,
              fontSize: "0.72rem",
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            Collection scan vs Index scan:
          </div>
          {[
            ["Without index (COLLSCAN)", withoutIdx, t.danger],
            ["With index (IXSCAN)", withIdx, idx.color],
          ].map(([label, vals, color]) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <div
                style={{
                  color,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  marginBottom: 5,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 3,
                  alignItems: "flex-end",
                  height: 50,
                }}
              >
                {vals.map((v, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      background: i === 2 || i === 5 ? color : `${color}40`,
                      borderRadius: "3px 3px 0 0",
                      height: `${(v / 100) * 50}px`,
                      transition: "height 0.5s",
                      minWidth: 4,
                    }}
                  />
                ))}
              </div>
              <div
                style={{ color: t.muted, fontSize: "0.65rem", marginTop: 2 }}
              >
                Documents examined
              </div>
            </div>
          ))}
          <div
            style={{
              background: t.accentBg,
              border: `1px solid ${t.accentBorder}`,
              borderRadius: 8,
              padding: "8px 12px",
            }}
          >
            <div
              style={{ color: t.accent, fontSize: "0.75rem", fontWeight: 700 }}
            >
              💡 Use explain()
            </div>
            <pre
              style={{
                margin: "4px 0 0",
                color: t.muted,
                fontSize: "0.72rem",
                whiteSpace: "pre-wrap",
              }}
            >
              {"db.users.find({age:28})\n  .explain('executionStats')"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 10 — Schema Design
══════════════════════════════════════════════════════════════ */
function SchemaDemo({ t }) {
  const [pattern, setPattern] = useState("embed");
  const patterns = {
    embed: {
      label: "Embedding",
      color: "#22c55e",
      icon: "📦",
      when: "Data is accessed together. One-to-few relationships. Child docs don't exceed 16MB.",
      pros: [
        "Single query — no JOINs",
        "Atomic reads/writes",
        "Best read performance",
      ],
      cons: [
        "Can hit 16MB doc limit",
        "Data duplication",
        "Hard to update shared data",
      ],
      example: {
        _id: "ObjectId('...')",
        title: "MongoDB Guide",
        author: { name: "Alice", email: "alice@dev.io" },
        tags: ["database", "nosql"],
        chapters: [
          { title: "Intro", pages: 12 },
          { title: "CRUD", pages: 24 },
        ],
      },
    },
    reference: {
      label: "Referencing",
      color: "#67e8f9",
      icon: "🔗",
      when: "One-to-many/many-to-many. Data accessed independently. Large or unbounded arrays.",
      pros: [
        "Normalized — no duplication",
        "Update in one place",
        "No document size issues",
      ],
      cons: [
        "Requires $lookup (like JOIN)",
        "Multiple queries needed",
        "Higher read latency",
      ],
      example: {
        _id: "ObjectId('aaa...')",
        title: "MongoDB Guide",
        authorId: "ObjectId('bbb...')",
        tagIds: ["ObjectId('ccc...')", "ObjectId('ddd...')"],
      },
    },
    hybrid: {
      label: "Hybrid",
      color: "#fbbf24",
      icon: "⚖️",
      when: "Best of both: embed the most-read data, reference large/shared collections.",
      pros: [
        "Optimized for read patterns",
        "Avoids duplication for shared data",
        "Flexible",
      ],
      cons: [
        "More complex",
        "Risk of stale embedded data",
        "Need sync strategy",
      ],
      example: {
        _id: "ObjectId('...')",
        title: "MongoDB Guide",
        author: { _id: "ObjectId('bbb...')", name: "Alice" },
        commentCount: 142,
        recentComments: [{ text: "Great post!", user: "Bob" }],
      },
    },
  };
  const p = patterns[pattern];
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
          margin: "0 0 14px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Schema Design Patterns — Embed vs Reference vs Hybrid
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {Object.entries(patterns).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setPattern(k)}
            style={{
              background: pattern === k ? v.color + "30" : t.surface,
              color: pattern === k ? v.color : t.muted,
              border: `1px solid ${pattern === k ? v.color + "70" : t.border}`,
              borderRadius: 8,
              padding: "7px 16px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.82rem",
            }}
          >
            {v.icon} {v.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 180px" }}>
          <div
            style={{
              background: `${p.color}18`,
              border: `1px solid ${p.color}45`,
              borderRadius: 10,
              padding: "12px 14px",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                color: p.color,
                fontWeight: 700,
                fontSize: "0.88rem",
                marginBottom: 6,
              }}
            >
              When to use:
            </div>
            <div
              style={{ color: t.muted, fontSize: "0.78rem", lineHeight: 1.6 }}
            >
              {p.when}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div
              style={{
                flex: 1,
                background: "#22c55e15",
                border: "1px solid #22c55e35",
                borderRadius: 8,
                padding: "10px",
              }}
            >
              <div
                style={{
                  color: "#22c55e",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  marginBottom: 5,
                }}
              >
                ✓ PROS
              </div>
              {p.pros.map((pr, i) => (
                <div
                  key={i}
                  style={{
                    color: t.muted,
                    fontSize: "0.73rem",
                    marginBottom: 2,
                  }}
                >
                  • {pr}
                </div>
              ))}
            </div>
            <div
              style={{
                flex: 1,
                background: "#f8717115",
                border: "1px solid #f8717135",
                borderRadius: 8,
                padding: "10px",
              }}
            >
              <div
                style={{
                  color: "#f87171",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  marginBottom: 5,
                }}
              >
                ✗ CONS
              </div>
              {p.cons.map((cn, i) => (
                <div
                  key={i}
                  style={{
                    color: t.muted,
                    fontSize: "0.73rem",
                    marginBottom: 2,
                  }}
                >
                  • {cn}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ flex: "1 1 220px" }}>
          <div
            style={{
              color: t.muted,
              fontSize: "0.72rem",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            Example document:
          </div>
          <div
            style={{
              background: "#020a04",
              border: `1px solid ${p.color}40`,
              borderRadius: 10,
              padding: "10px 14px",
              overflowY: "auto",
              maxHeight: 240,
            }}
          >
            <JV doc={p.example} t={t} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 11 — Mongoose ODM
══════════════════════════════════════════════════════════════ */
function MongooseDemo({ t }) {
  const [tab, setTab] = useState("schema");
  const tabs = {
    schema: {
      label: "Schema & Model",
      color: "#22c55e",
      code: `const mongoose = require('mongoose');

// 1. Define a Schema
const userSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: [true, 'Name is required'],
    trim:     true,
    maxlength: 50,
  },
  email: {
    type:     String,
    required: true,
    unique:   true,
    lowercase: true,
    match: [/^[\\w.-]+@[\\w.-]+\\.\\w+$/, 'Invalid email'],
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'],
    max: 120,
  },
  role: {
    type:    String,
    enum:    ['user', 'admin', 'moderator'],
    default: 'user',
  },
  skills: [String],           // Array of strings
  address: {                  // Embedded sub-document
    city:    String,
    country: { type: String, default: 'US' },
  },
  createdAt: { type: Date, default: Date.now },
  isActive:  { type: Boolean, default: true },
}, {
  timestamps: true,           // auto createdAt + updatedAt
  versionKey: false,          // remove __v field
});

// 2. Add methods
userSchema.methods.greet = function() {
  return \`Hello, I'm \${this.name}!\`;
};

// 3. Add statics
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// 4. Add middleware (hooks)
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// 5. Compile into a Model
const User = mongoose.model('User', userSchema);
module.exports = User;`,
    },
    crud: {
      label: "CRUD with Mongoose",
      color: "#67e8f9",
      code: `const User = require('./models/User');

// ── Create ──────────────────────────────
const user = new User({ name: 'Alice', email: 'alice@dev.io', age: 28 });
await user.save();

// Shorthand:
const user2 = await User.create({ name: 'Bob', email: 'bob@dev.io' });

// ── Read ────────────────────────────────
const allUsers  = await User.find();
const alice     = await User.findById('64a1f3...');
const byEmail   = await User.findOne({ email: 'alice@dev.io' });
const admins    = await User.find({ role: 'admin' })
                            .select('name email -_id')
                            .sort({ name: 1 })
                            .limit(10)
                            .lean();          // returns plain JS object (faster)

// ── Update ──────────────────────────────
await User.findByIdAndUpdate(id,
  { $set: { role: 'admin' } },
  { new: true, runValidators: true }  // return updated doc + validate
);

await User.updateMany(
  { role: 'user' },
  { $inc: { loginCount: 1 } }
);

// ── Delete ──────────────────────────────
await User.findByIdAndDelete(id);
await User.deleteMany({ isActive: false });

// ── Population (like JOIN) ───────────────
const post = await Post.findById(id)
  .populate('author', 'name email')   // replace authorId with User doc
  .populate('comments.user', 'name');`,
    },
    validation: {
      label: "Validation & Virtuals",
      color: "#c084fc",
      code: `// ── Custom Validators ───────────────────
const productSchema = new Schema({
  price: {
    type: Number,
    validate: {
      validator: v => v > 0,
      message: 'Price must be positive',
    },
  },
  discount: {
    type: Number,
    validate: {
      validator: function(v) {
        return v < this.price;        // 'this' = document
      },
      message: 'Discount cannot exceed price',
    },
  },
});

// ── Virtuals (computed fields) ───────────
userSchema.virtual('fullName').get(function() {
  return \`\${this.firstName} \${this.lastName}\`;
});

userSchema.virtual('profileUrl').get(function() {
  return \`/users/\${this._id}\`;
});

// Include virtuals in JSON output
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// ── Query Helpers ────────────────────────
userSchema.query.active = function() {
  return this.where({ isActive: true });
};

// Usage:
const activeAdmins = await User.find().active()
  .where('role').equals('admin');

// ── Middleware (Hooks) ───────────────────
// pre-find: always exclude deleted docs
userSchema.pre(/^find/, function(next) {
  this.where({ deletedAt: { $exists: false } });
  next();
});`,
    },
  };
  const tab_ = tabs[tab];
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
          margin: "0 0 14px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Mongoose ODM — schemas, validation, CRUD, virtuals
      </p>
      <div
        style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}
      >
        {Object.entries(tabs).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            style={{
              background: tab === k ? v.color + "30" : t.surface,
              color: tab === k ? v.color : t.muted,
              border: `1px solid ${tab === k ? v.color + "70" : t.border}`,
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
      <div
        style={{
          position: "relative",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #163822",
        }}
      >
        <div
          style={{
            background: "#020a04",
            padding: "14px 16px",
            overflowX: "auto",
            maxHeight: 340,
            overflowY: "auto",
          }}
        >
          <pre
            style={{
              margin: 0,
              fontFamily: "'Fira Code',monospace",
              fontSize: "0.76rem",
              lineHeight: 1.8,
            }}
          >
            {tab_.code
              .trim()
              .split("\n")
              .map((line, i) => (
                <div key={i} style={{ display: "flex", gap: 16 }}>
                  <span
                    style={{
                      color: "#163822",
                      userSelect: "none",
                      minWidth: 20,
                      textAlign: "right",
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    style={{
                      color:
                        line.trim().startsWith("//") ||
                        line.trim().startsWith("//")
                          ? "#3a6a4a"
                          : line.includes("const ") ||
                              line.includes("await ") ||
                              line.includes("async")
                            ? "#67e8f9"
                            : line.includes("mongoose.") ||
                                line.includes("Schema") ||
                                line.includes("model")
                              ? "#22c55e"
                              : line.includes("'") || line.includes('"')
                                ? "#86efac"
                                : line.includes("true") ||
                                    line.includes("false")
                                  ? "#fb923c"
                                  : "#b8d4c0",
                    }}
                  >
                    {line || " "}
                  </span>
                </div>
              ))}
          </pre>
        </div>
        <CopyBtn code={tab_.code} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 12 — Aggregation Operators
══════════════════════════════════════════════════════════════ */
function AggOpsDemo({ t }) {
  const [cat, setCat] = useState("stage");
  const [sel, setSel] = useState(0);
  const cats = {
    stage: {
      color: "#22c55e",
      label: "Pipeline Stages",
      ops: [
        {
          op: "$match",
          ex: '{ $match: { status: "active", age: { $gte: 18 } } }',
          desc: "Filter documents (like find query)",
        },
        {
          op: "$group",
          ex: '{ $group: { _id: "$dept", total: { $sum: "$salary" } } }',
          desc: "Group and accumulate",
        },
        {
          op: "$project",
          ex: "{ $project: { name:1, salary:1, _id:0 } }",
          desc: "Shape output fields",
        },
        {
          op: "$sort",
          ex: "{ $sort: { createdAt: -1 } }",
          desc: "Sort documents",
        },
        { op: "$limit", ex: "{ $limit: 10 }", desc: "Keep first N docs" },
        {
          op: "$skip",
          ex: "{ $skip: 20 }",
          desc: "Skip first N docs (pagination)",
        },
        {
          op: "$unwind",
          ex: '{ $unwind: "$tags" }',
          desc: "Deconstruct array into separate docs",
        },
        {
          op: "$lookup",
          ex: '{ $lookup: { from:"orders", localField:"_id",\n  foreignField:"userId", as:"orders" } }',
          desc: "Left outer join with another collection",
        },
        {
          op: "$addFields",
          ex: '{ $addFields: { fullName: { $concat: ["$first"," ","$last"] } } }',
          desc: "Add computed fields",
        },
        {
          op: "$count",
          ex: '{ $count: "totalUsers" }',
          desc: "Count documents into a field",
        },
        {
          op: "$facet",
          ex: '{ $facet: { byCity:[{$group:{_id:"$city"}}], total:[{$count:"n"}] } }',
          desc: "Multiple pipelines in one stage",
        },
        {
          op: "$out",
          ex: '{ $out: "monthly_report" }',
          desc: "Write results to a collection",
        },
      ],
    },
    accumulator: {
      color: "#67e8f9",
      label: "$group Accumulators",
      ops: [
        {
          op: "$sum",
          ex: '{ $sum: "$salary" }  or  { $sum: 1 }',
          desc: "Sum values (or count with $sum:1)",
        },
        { op: "$avg", ex: '{ $avg: "$score" }', desc: "Average of values" },
        { op: "$min", ex: '{ $min: "$age" }', desc: "Minimum value" },
        { op: "$max", ex: '{ $max: "$price" }', desc: "Maximum value" },
        {
          op: "$push",
          ex: '{ $push: "$name" }',
          desc: "Collect values into array",
        },
        {
          op: "$addToSet",
          ex: '{ $addToSet: "$tag" }',
          desc: "Collect unique values into array",
        },
        {
          op: "$first",
          ex: '{ $first: "$name" }',
          desc: "First value in group",
        },
        {
          op: "$last",
          ex: '{ $last: "$timestamp" }',
          desc: "Last value in group",
        },
        {
          op: "$mergeObjects",
          ex: '{ $mergeObjects: "$address" }',
          desc: "Merge embedded objects",
        },
      ],
    },
    expr: {
      color: "#fbbf24",
      label: "Expression Operators",
      ops: [
        {
          op: "$concat",
          ex: '{ $concat: ["$first", " ", "$last"] }',
          desc: "Concatenate strings",
        },
        {
          op: "$toUpper",
          ex: '{ $toUpper: "$city" }',
          desc: "Uppercase string",
        },
        {
          op: "$substr",
          ex: '{ $substr: ["$name", 0, 3] }',
          desc: "Substring",
        },
        {
          op: "$dateToString",
          ex: '{ $dateToString: { format:"%Y-%m", date:"$createdAt" } }',
          desc: "Format date",
        },
        {
          op: "$cond",
          ex: '{ $cond: [{ $gt:["$age",18] }, "adult", "minor"] }',
          desc: "Ternary conditional",
        },
        {
          op: "$ifNull",
          ex: '{ $ifNull: ["$phone", "N/A"] }',
          desc: "Fallback if null/missing",
        },
        {
          op: "$multiply",
          ex: '{ $multiply: ["$price", "$qty"] }',
          desc: "Multiply values",
        },
        {
          op: "$divide",
          ex: '{ $divide: ["$total", "$count"] }',
          desc: "Divide values",
        },
        { op: "$size", ex: '{ $size: "$tags" }', desc: "Length of array" },
        {
          op: "$arrayElemAt",
          ex: '{ $arrayElemAt: ["$skills", 0] }',
          desc: "Get element at index",
        },
        {
          op: "$filter",
          ex: '{ $filter: { input:"$scores", cond:{ $gte:["$$this",90] } } }',
          desc: "Filter array elements",
        },
      ],
    },
  };
  const catData = cats[cat];
  const idx = Math.min(sel, catData.ops.length - 1);
  const op = catData.ops[idx];
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
        Aggregation Operators —{" "}
        {Object.values(cats).reduce((s, c) => s + c.ops.length, 0)} operators
      </p>
      <div
        style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}
      >
        {Object.entries(cats).map(([k, v]) => (
          <button
            key={k}
            onClick={() => {
              setCat(k);
              setSel(0);
            }}
            style={{
              background: cat === k ? v.color + "30" : t.surface,
              color: cat === k ? v.color : t.muted,
              border: `1px solid ${cat === k ? v.color + "70" : t.border}`,
              borderRadius: 20,
              padding: "4px 14px",
              cursor: "pointer",
              fontSize: "0.78rem",
              fontWeight: 700,
            }}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            maxHeight: 280,
            overflowY: "auto",
          }}
        >
          {catData.ops.map((o, i) => (
            <button
              key={i}
              onClick={() => setSel(i)}
              style={{
                textAlign: "left",
                background: idx === i ? catData.color + "25" : t.surface,
                color: idx === i ? catData.color : t.muted,
                border: `1px solid ${idx === i ? catData.color + "60" : t.border}`,
                borderRadius: 7,
                padding: "5px 12px",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: 700,
                fontFamily: "monospace",
                whiteSpace: "nowrap",
              }}
            >
              {o.op}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div
            style={{
              background: "#020a04",
              border: `1px solid ${catData.color}50`,
              borderRadius: 10,
              padding: "14px 16px",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                color: catData.color,
                fontWeight: 700,
                fontSize: "1rem",
                marginBottom: 6,
                fontFamily: "monospace",
              }}
            >
              {op.op}
            </div>
            <div
              style={{ color: t.muted, fontSize: "0.8rem", marginBottom: 10 }}
            >
              {op.desc}
            </div>
            <pre
              style={{
                margin: 0,
                color: catData.color,
                fontFamily: "monospace",
                fontSize: "0.8rem",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}
            >
              {op.ex}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
/* ══════════════════════════════════════════════════════════════
   DEMO 13 — Transactions
══════════════════════════════════════════════════════════════ */
function TransactionsDemo({ t }) {
  const [step, setStep] = useState(-1);
  const [status, setStatus] = useState("idle"); // idle | running | success | fail
  const [simulateFail, setSimulateFail] = useState(false);
  const [accounts, setAccounts] = useState({ alice: 1000, bob: 500 });

  const reset = () => {
    setStep(-1);
    setStatus("idle");
    setAccounts({ alice: 1000, bob: 500 });
  };

  const runTxn = async () => {
    reset();
    setStatus("running");
    const steps = [0, 1, 2, 3, simulateFail ? -1 : 4];
    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 700));
      const s = steps[i];
      if (s === -1) {
        setStep(-1);
        setStatus("fail");
        return;
      }
      setStep(s);
    }
    setAccounts({ alice: 750, bob: 750 });
    setStatus("success");
  };

  const txnSteps = [
    {
      label: "startSession()",
      desc: "Begin a client session",
      color: "#67e8f9",
    },
    {
      label: "startTransaction()",
      desc: "Open the transaction",
      color: "#fbbf24",
    },
    {
      label: "debit Alice -$250",
      desc: "Update alice's balance",
      color: "#f87171",
    },
    {
      label: "credit Bob +$250",
      desc: "Update bob's balance",
      color: "#22c55e",
    },
    {
      label: "commitTransaction()",
      desc: "Commit — all or nothing",
      color: "#22c55e",
    },
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
          margin: "0 0 14px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        ACID Transactions — simulate a bank transfer
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px" }}>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 14,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={runTxn}
              disabled={status === "running"}
              style={{
                background:
                  status === "running"
                    ? t.surface
                    : `linear-gradient(135deg,${t.accent},#15803d)`,
                border: "none",
                borderRadius: 8,
                padding: "9px 18px",
                color: status === "running" ? t.muted : "#000",
                fontWeight: 800,
                cursor: status === "running" ? "not-allowed" : "pointer",
                fontSize: "0.85rem",
              }}
            >
              {status === "running" ? "⏳ Running..." : "▶ Transfer $250"}
            </button>
            <button
              onClick={reset}
              style={{
                background: t.surface,
                border: `1px solid ${t.border}`,
                borderRadius: 8,
                padding: "9px 14px",
                color: t.muted,
                cursor: "pointer",
                fontSize: "0.82rem",
              }}
            >
              ↺ Reset
            </button>
          </div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              marginBottom: 14,
            }}
          >
            <input
              type="checkbox"
              checked={simulateFail}
              onChange={(e) => setSimulateFail(e.target.checked)}
              style={{ accentColor: t.danger, width: 14, height: 14 }}
            />
            <span
              style={{
                fontSize: "0.8rem",
                color: simulateFail ? t.danger : t.muted,
              }}
            >
              Simulate failure (abort transaction)
            </span>
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {txnSteps.map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 8,
                  background:
                    step === i
                      ? s.color + "25"
                      : step > i && status !== "fail"
                        ? t.accentBg
                        : "transparent",
                  border: `1px solid ${step === i ? s.color + "70" : step > i && status !== "fail" ? t.accentBorder : "transparent"}`,
                  transition: "all 0.4s",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background:
                      step >= i && status !== "fail" ? s.color : t.border,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    color: "#000",
                    fontWeight: 700,
                    flexShrink: 0,
                    transition: "all 0.4s",
                  }}
                >
                  {step > i && status !== "fail" ? "✓" : i + 1}
                </div>
                <div>
                  <div
                    style={{
                      color:
                        step === i
                          ? s.color
                          : step > i && status !== "fail"
                            ? t.accent
                            : t.muted,
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      fontFamily: "monospace",
                    }}
                  >
                    {s.label}
                  </div>
                  <div style={{ color: t.muted, fontSize: "0.7rem" }}>
                    {s.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {status === "fail" && (
            <div
              style={{
                marginTop: 10,
                background: t.danger + "20",
                border: `1px solid ${t.danger}50`,
                borderRadius: 8,
                padding: "10px 14px",
              }}
            >
              <div
                style={{
                  color: t.danger,
                  fontWeight: 700,
                  fontSize: "0.82rem",
                }}
              >
                ✗ Transaction Aborted
              </div>
              <div style={{ color: t.muted, fontSize: "0.75rem" }}>
                abortTransaction() called — all changes rolled back. Balances
                unchanged.
              </div>
            </div>
          )}
          {status === "success" && (
            <div
              style={{
                marginTop: 10,
                background: t.accentBg,
                border: `1px solid ${t.accentBorder}`,
                borderRadius: 8,
                padding: "10px 14px",
              }}
            >
              <div
                style={{
                  color: t.accent,
                  fontWeight: 700,
                  fontSize: "0.82rem",
                }}
              >
                ✓ Transaction Committed
              </div>
              <div style={{ color: t.muted, fontSize: "0.75rem" }}>
                Both updates committed atomically — no partial state.
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
            Account balances:
          </div>
          {[
            ["Alice", "alice", "#67e8f9"],
            ["Bob", "bob", "#fb923c"],
          ].map(([name, key, color]) => (
            <div
              key={key}
              style={{
                background: `${color}15`,
                border: `1px solid ${color}40`,
                borderRadius: 10,
                padding: "14px 16px",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  color,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  marginBottom: 4,
                }}
              >
                {name}
              </div>
              <div
                style={{
                  color: color,
                  fontWeight: 900,
                  fontSize: "1.4rem",
                  fontFamily: "monospace",
                }}
              >
                ${accounts[key].toLocaleString()}
              </div>
            </div>
          ))}
          <div
            style={{
              background: "#020a04",
              border: `1px solid ${t.border}`,
              borderRadius: 9,
              padding: "10px 14px",
              marginTop: 4,
            }}
          >
            <div
              style={{
                color: t.muted,
                fontSize: "0.68rem",
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              CODE:
            </div>
            <pre
              style={{
                margin: 0,
                color: "#22c55e",
                fontFamily: "monospace",
                fontSize: "0.68rem",
                lineHeight: 1.6,
              }}
            >{`const session = client.startSession();
try {
  session.startTransaction();
  await accounts.updateOne(
    { user: 'alice' },
    { $inc: { balance: -250 } },
    { session }
  );
  await accounts.updateOne(
    { user: 'bob' },
    { $inc: { balance: +250 } },
    { session }
  );
  await session.commitTransaction();
} catch (e) {
  await session.abortTransaction();
} finally {
  session.endSession();
}`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 14 — Atlas & Connections
══════════════════════════════════════════════════════════════ */
function AtlasDemo({ t }) {
  const [sel, setSel] = useState(0);
  const sections = [
    {
      label: "Connect",
      color: "#22c55e",
      content: (
        <div>
          <p style={{ color: t.muted, fontSize: "0.8rem", marginBottom: 12 }}>
            Three ways to connect to MongoDB Atlas:
          </p>
          {[
            {
              title: "Mongoose (Node.js)",
              code: `const mongoose = require('mongoose');

await mongoose.connect(process.env.MONGODB_URI, {
  // Options for Mongoose 7+
  // (most defaults are now sensible)
});

// With error handling
mongoose.connection.on('error', console.error);
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB Atlas!');
});`,
            },
            {
              title: "Native Driver (Node.js)",
              code: `const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db('mydb');
const users = db.collection('users');

// Always close connection
await client.close();`,
            },
          ].map((item, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div
                style={{
                  color: t.accent,
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  marginBottom: 5,
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  position: "relative",
                  borderRadius: 9,
                  overflow: "hidden",
                  border: `1px solid ${t.border}`,
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    background: "#020a04",
                    padding: "10px 12px",
                    fontFamily: "monospace",
                    fontSize: "0.74rem",
                    color: "#86efac",
                    lineHeight: 1.7,
                    overflowX: "auto",
                  }}
                >
                  {item.code}
                </pre>
                <CopyBtn code={item.code} />
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: "URI Format",
      color: "#67e8f9",
      content: (
        <div>
          <p style={{ color: t.muted, fontSize: "0.8rem", marginBottom: 12 }}>
            Connection string anatomy:
          </p>
          <div
            style={{
              background: "#020a04",
              border: `1px solid ${t.border}`,
              borderRadius: 10,
              padding: "14px",
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "0.78rem",
                lineHeight: 2,
                flexWrap: "wrap",
                display: "flex",
                gap: 0,
              }}
            >
              {[
                ["mongodb+srv://", "#67e8f9"],
                ["username", "#fbbf24"],
                [":", "#4a7a5a"],
                ["password", "#f87171"],
                ["@", "#4a7a5a"],
                ["cluster0.xyz.mongodb.net", "#22c55e"],
                ["/", "#4a7a5a"],
                ["mydb", "#c084fc"],
                ["?retryWrites=true&w=majority", "#fb923c"],
              ].map(([part, color], i) => (
                <span key={i} style={{ color }}>
                  {part}
                </span>
              ))}
            </div>
          </div>
          <div
            style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}
          >
            {[
              [
                "mongodb+srv://",
                "SRV protocol — auto-discovers nodes",
                "#67e8f9",
              ],
              ["username:password", "Atlas DB user credentials", "#fbbf24"],
              ["cluster0.xyz.mongodb.net", "Atlas cluster host", "#22c55e"],
              ["mydb", "Default database", "#c084fc"],
              ["?retryWrites=true", "Auto-retry on network errors", "#fb923c"],
            ].map(([l, d, c]) => (
              <div
                key={l}
                style={{
                  flex: "1 1 160px",
                  background: `${c}15`,
                  border: `1px solid ${c}35`,
                  borderRadius: 7,
                  padding: "7px 10px",
                }}
              >
                <div
                  style={{
                    color: c,
                    fontFamily: "monospace",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    marginBottom: 2,
                  }}
                >
                  {l}
                </div>
                <div style={{ color: t.muted, fontSize: "0.7rem" }}>{d}</div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 10,
              background: "#f8717120",
              border: "1px solid #f8717145",
              borderRadius: 8,
              padding: "8px 12px",
            }}
          >
            <div
              style={{ color: t.danger, fontWeight: 700, fontSize: "0.78rem" }}
            >
              ⚠ Never hardcode credentials
            </div>
            <div style={{ color: t.muted, fontSize: "0.73rem", marginTop: 3 }}>
              Always use environment variables. Add .env to .gitignore.
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Atlas Features",
      color: "#fbbf24",
      content: (
        <div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              {
                icon: "🔍",
                title: "Atlas Search",
                desc: "Full-text search powered by Apache Lucene. $search aggregation stage.",
                color: "#22c55e",
              },
              {
                icon: "📊",
                title: "Charts",
                desc: "Visual dashboards directly from your collections. No extra tools.",
                color: "#67e8f9",
              },
              {
                icon: "⚡",
                title: "Triggers",
                desc: "Database triggers: run functions on insert/update/delete events.",
                color: "#fbbf24",
              },
              {
                icon: "🌍",
                title: "Global Clusters",
                desc: "Multi-region deployments with zone sharding for data residency.",
                color: "#c084fc",
              },
              {
                icon: "🔄",
                title: "Online Archive",
                desc: "Automatically move cold data to low-cost object storage.",
                color: "#fb923c",
              },
              {
                icon: "🛡️",
                title: "Encryption",
                desc: "Client-side field level encryption (CSFLE) for ultra-sensitive data.",
                color: "#f87171",
              },
              {
                icon: "📱",
                title: "App Services",
                desc: "Serverless functions, hosting, GraphQL API, Device Sync for mobile.",
                color: "#a78bfa",
              },
              {
                icon: "🤖",
                title: "Vector Search",
                desc: "Store embeddings, do kNN search for AI/ML and RAG applications.",
                color: "#f472b6",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  flex: "1 1 150px",
                  background: `${item.color}15`,
                  border: `1px solid ${item.color}35`,
                  borderRadius: 9,
                  padding: "10px 12px",
                }}
              >
                <div style={{ fontSize: "1.1rem", marginBottom: 4 }}>
                  {item.icon}
                </div>
                <div
                  style={{
                    color: item.color,
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    marginBottom: 3,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    color: t.muted,
                    fontSize: "0.72rem",
                    lineHeight: 1.5,
                  }}
                >
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];
  const s = sections[sel];
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
          margin: "0 0 14px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        MongoDB Atlas — cloud platform, connections & features
      </p>
      <div
        style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}
      >
        {sections.map((sec, i) => (
          <button
            key={i}
            onClick={() => setSel(i)}
            style={{
              background: sel === i ? sec.color + "30" : t.surface,
              color: sel === i ? sec.color : t.muted,
              border: `1px solid ${sel === i ? sec.color + "70" : t.border}`,
              borderRadius: 8,
              padding: "6px 16px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.82rem",
            }}
          >
            {sec.label}
          </button>
        ))}
      </div>
      {s.content}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 15 — Performance & Best Practices
══════════════════════════════════════════════════════════════ */
function PerfDemo({ t }) {
  const [sel, setSel] = useState(0);
  const tips = [
    {
      icon: "⚡",
      title: "Index Everything You Query",
      color: "#22c55e",
      good: `// Add index for every field in find() filters:
db.orders.createIndex({ userId: 1, status: 1 });
db.orders.createIndex({ createdAt: -1 });

// Check index usage:
db.orders.find({ userId: "abc" }).explain("executionStats");
// Look for: IXSCAN (good) vs COLLSCAN (bad)`,
      bad: `// ❌ No index on frequently queried fields
db.orders.find({ userId: "abc123", status: "pending" });
// → COLLSCAN: reads EVERY document in collection`,
    },
    {
      icon: "📐",
      title: "ESR Rule for Compound Indexes",
      color: "#67e8f9",
      good: `// ESR: Equality → Sort → Range
// Query: find active users in NYC, sorted by score

// ✅ Correct index order:
db.users.createIndex({
  active: 1,   // Equality first
  score:  1,   // Sort second
  age:    1,   // Range last
});`,
      bad: `// ❌ Wrong order — index less effective:
db.users.createIndex({
  age:    1,   // Range first
  score:  1,   // Sort middle
  active: 1,   // Equality last
});`,
    },
    {
      icon: "🎯",
      title: "Use Projection",
      color: "#c084fc",
      good: `// ✅ Only fetch what you need:
db.users.find(
  { role: "admin" },
  { name: 1, email: 1, _id: 0 }  // projection
);
// Transfers less data, uses covered indexes`,
      bad: `// ❌ Fetching entire documents when only 2 fields needed:
db.users.find({ role: "admin" });
// Returns ALL fields: address, history, settings...`,
    },
    {
      icon: "📦",
      title: "Bulk Operations",
      color: "#fbbf24",
      good: `// ✅ One network round-trip for N operations:
await db.collection('users').bulkWrite([
  { insertOne: { document: { name:"Alice" } } },
  { updateOne: { filter:{_id:id}, update:{$set:{active:true}} } },
  { deleteOne: { filter: { expired: true } } },
], { ordered: false }); // parallel = faster`,
      bad: `// ❌ N separate operations = N network round-trips:
await users.insertOne({ name: "Alice" });
await users.updateOne({ _id: id }, { $set: { active: true } });
await users.deleteOne({ expired: true });`,
    },
    {
      icon: "🔢",
      title: "Use $limit & Pagination",
      color: "#fb923c",
      good: `// ✅ Cursor-based pagination (fast, stable):
const PAGE_SIZE = 20;
db.posts.find({ createdAt: { $lt: lastSeen } })
        .sort({ createdAt: -1 })
        .limit(PAGE_SIZE);

// Or with skip for small collections:
db.posts.find({}).sort({_id:-1}).skip(page*20).limit(20);`,
      bad: `// ❌ Never load unlimited documents:
db.posts.find({});
// Could return millions of docs!

// ❌ Large skip is slow (scans skipped docs):
db.posts.find({}).skip(100000).limit(20); // Slow!`,
    },
    {
      icon: "🏗️",
      title: "Lean Mongoose Queries",
      color: "#f472b6",
      good: `// ✅ .lean() returns plain JS objects (2-3x faster):
const users = await User.find({ active: true })
  .select('name email role')
  .lean();  // No Mongoose overhead

// ✅ Use cursor for large datasets:
const cursor = User.find({}).cursor();
for await (const doc of cursor) {
  await processUser(doc);  // Stream, don't buffer
}`,
      bad: `// ❌ Full Mongoose docs when only reading:
const users = await User.find({ active: true });
// Each doc has methods, virtuals, change tracking overhead

// ❌ Loading all docs into memory:
const all = await User.find({}).exec();
// With 1M users → crashes / OOM`,
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
          margin: "0 0 14px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Performance & Best Practices — {tips.length} essential patterns
      </p>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}
      >
        {tips.map((tip, i) => (
          <button
            key={i}
            onClick={() => setSel(i)}
            style={{
              background: sel === i ? tip.color + "30" : t.surface,
              color: sel === i ? tip.color : t.muted,
              border: `1px solid ${sel === i ? tip.color + "70" : t.border}`,
              borderRadius: 8,
              padding: "5px 12px",
              cursor: "pointer",
              fontSize: "0.78rem",
              fontWeight: 700,
            }}
          >
            {tip.icon} {tip.title.split(" ").slice(0, 2).join(" ")}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[
          ["✅ Do This", tip.good, "#22c55e"],
          ["❌ Avoid This", tip.bad, "#f87171"],
        ].map(([label, code, color]) => (
          <div key={label} style={{ flex: "1 1 240px" }}>
            <div
              style={{
                color,
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
                border: `1px solid ${color}35`,
              }}
            >
              <pre
                style={{
                  margin: 0,
                  background: "#020a04",
                  padding: "10px 12px",
                  fontFamily: "monospace",
                  fontSize: "0.74rem",
                  color: color === "#22c55e" ? "#86efac" : "#fca5a5",
                  lineHeight: 1.7,
                  overflowX: "auto",
                  maxHeight: 220,
                  overflowY: "auto",
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

/* ══════════════════════════════════════════════════════════════
   SECTIONS DATA
══════════════════════════════════════════════════════════════ */
const SECTIONS = [
  {
    id: "intro",
    icon: "🍃",
    title: "What is MongoDB?",
    subtitle: "Document database vs relational — core concepts & terminology",
    Demo: IntroDemo,
    body: "MongoDB is a NoSQL document database that stores data as flexible JSON-like documents instead of rows in tables. It's horizontally scalable, schema-flexible, and designed for modern applications. Documents in the same collection don't need the same structure — each can have different fields and nested data.",
    code: `// Install MongoDB driver
npm install mongodb
npm install mongoose     // ODM (recommended)

// Or install MongoDB locally
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

// MongoDB shell (mongosh)
mongosh                            // connect to localhost
mongosh "mongodb+srv://..."        // connect to Atlas

// Basic shell commands
show dbs                           // list databases
use myapp                          // switch/create database
show collections                   // list collections
db.users.find().pretty()           // show all documents
db.stats()                         // database statistics
db.users.countDocuments()          // count documents`,
    tip: "MongoDB is schemaless but that doesn't mean schema-less design is good. Always define and enforce your schema with Mongoose or JSON Schema validation in production.",
  },

  {
    id: "documents",
    icon: "📄",
    title: "Documents & BSON Types",
    subtitle: "JSON-like documents — 10 BSON data types explained",
    Demo: DocumentsDemo,
    body: "MongoDB stores data as BSON (Binary JSON) documents — a superset of JSON with additional types like ObjectId, Date, Binary, Decimal128, and Regex. Each document is limited to 16MB. The _id field is mandatory and auto-generated as a 12-byte ObjectId if not provided. BSON types map directly to programming language types.",
    code: `// _id: ObjectId structure (12 bytes)
// [4 bytes timestamp][5 bytes random][3 bytes counter]
// → Always unique, sortable by creation time

const id = new ObjectId();
id.getTimestamp();  // → Date when created!

// Type checking in queries
db.users.find({ age: { $type: "number" } });
db.users.find({ name: { $type: "string" } });
// Type numbers: 1=double, 2=string, 8=bool,
//               9=date, 10=null, 16=int32

// Working with dates
db.events.insertOne({
  title: "Launch",
  date:  new Date(),                   // → ISODate in MongoDB
  ts:    new Date("2024-01-15"),
});

// Date queries
db.events.find({
  date: {
    $gte: new Date("2024-01-01"),
    $lt:  new Date("2025-01-01"),
  }
});

// NumberDecimal for financial data (precise)
db.accounts.insertOne({
  balance: Decimal128("1234.56")       // Not 1234.56 (floating point)
});`,
    tip: "Use ISODate / new Date() for all timestamps — never store dates as strings. Strings can't be compared with $gt/$lt and you lose timezone handling.",
  },

  {
    id: "create",
    icon: "➕",
    title: "Create — Insert",
    subtitle: "insertOne(), insertMany() — adding documents",
    Demo: CreateDemo,
    body: "MongoDB provides insertOne() for single documents and insertMany() for bulk insertion. Both auto-generate _id if not provided. insertMany() is far more efficient than looping insertOne() — it sends one network request. By default, insertMany() is ordered (stops on first error); set ordered:false for parallel inserts.",
    code: `// insertOne — single document
const result = await db.collection('users').insertOne({
  name:  'Alice',
  email: 'alice@dev.io',
  age:   28,
  skills: ['React', 'Node'],
  createdAt: new Date(),
});
console.log(result.insertedId);   // ObjectId('64a1...')

// insertMany — array of documents (one network call!)
const result2 = await db.collection('users').insertMany([
  { name: 'Bob',   email: 'bob@dev.io',   role: 'admin' },
  { name: 'Carol', email: 'carol@dev.io', role: 'user'  },
  { name: 'Dan',   email: 'dan@dev.io',   role: 'user'  },
], {
  ordered: false,   // continue on error (parallel)
});
console.log(result2.insertedCount);  // 3
console.log(result2.insertedIds);    // { 0: ObjectId, 1: ObjectId, 2: ObjectId }

// With custom _id
await db.collection('products').insertOne({
  _id:   'PROD-001',              // custom string _id
  name:  'MongoDB Course',
  price: 99.99,
});

// Upsert — insert if not exists, update if exists
await db.collection('users').updateOne(
  { email: 'alice@dev.io' },      // filter
  { $set: { name: 'Alice' } },    // update
  { upsert: true }                // create if not found
);`,
    tip: "Provide your own _id when you have a natural unique key (like email or SKU). ObjectId is great but sometimes a human-readable ID is better for debugging.",
  },

  {
    id: "read",
    icon: "🔍",
    title: "Read — Find & Query",
    subtitle: "find(), findOne(), sort(), limit(), skip(), projection",
    Demo: ReadDemo,
    body: "MongoDB's find() takes a filter object and optional projection. It returns a cursor — a lazy iterator over the results. Chain .sort(), .limit(), .skip() for pagination. Use findOne() when you expect one result. Projections include (1) or exclude (0) fields — you can't mix include and exclude except with _id.",
    code: `// find() — returns a cursor
const cursor = db.users.find({ role: 'admin' });
const docs   = await cursor.toArray();  // materialize

// findOne() — returns first match or null
const user = await db.users.findOne({ email: 'alice@dev.io' });

// Projection — only return needed fields
db.users.find(
  { active: true },
  { name: 1, email: 1, _id: 0 }   // 1=include, 0=exclude
);

// Sort, Limit, Skip (pagination)
db.posts
  .find({ published: true })
  .sort({ createdAt: -1 })         // -1 = descending
  .skip(20)                        // skip first 20
  .limit(10);                      // return 10

// Count documents
await db.users.countDocuments({ role: 'admin' });
await db.users.estimatedDocumentCount(); // fast, approximate

// Distinct values
await db.users.distinct('city');   // ['NYC', 'LA', 'Chicago']

// Query nested fields (dot notation)
db.users.find({ 'address.city': 'NYC' });
db.users.find({ 'skills.0': 'React' });  // first array element

// Query array: contains value
db.users.find({ skills: 'JavaScript' });  // has JS in array
db.users.find({ skills: { $all: ['JS', 'React'] } });`,
    tip: "Use .lean() in Mongoose or .explain('executionStats') in the shell to check if your query uses an index. Always check before deploying a new complex query.",
  },

  {
    id: "queryops",
    icon: "🔎",
    title: "Query Operators",
    subtitle: "$gt, $in, $and, $or, $regex — 20+ operators",
    Demo: QueryOpsDemo,
    body: "MongoDB query operators let you express complex conditions without writing code. Comparison operators ($gt, $lt, $in) filter by value ranges. Logical operators ($and, $or, $not) combine conditions. Element operators ($exists, $type) check field presence. Array operators ($all, $elemMatch, $size) query inside arrays.",
    code: `// ── Comparison
db.users.find({ age: { $gt: 18, $lte: 65 } });           // 18 < age ≤ 65
db.users.find({ city: { $in: ['NYC', 'LA', 'SF'] } });   // city is one of
db.products.find({ status: { $ne: 'discontinued' } });    // not equal

// ── Logical
db.users.find({ $and: [{ age: {$gt:18} }, { active: true }] });
db.users.find({ $or:  [{ city: 'NYC' }, { role: 'admin' }] });
db.users.find({ role: { $not: { $in: ['banned','deleted'] } } });

// ── Element
db.users.find({ phone: { $exists: true } });              // has phone field
db.docs.find({ data: { $type: 'array' } });               // field is array

// ── Array
db.posts.find({ tags: { $all: ['mongodb', 'tutorial'] } });
db.orders.find({ items: { $elemMatch: { qty: { $gt: 5 }, price: { $lt: 20 } } } });
db.posts.find({ comments: { $size: 0 } });                // no comments

// ── Evaluation
db.users.find({ name: { $regex: /^Alice/i } });           // starts with Alice
db.articles.find({ $text: { $search: 'mongodb aggregation' } }); // full-text

// ── Geospatial
db.places.find({
  location: {
    $near: {
      $geometry: { type: 'Point', coordinates: [-74, 40.7] },
      $maxDistance: 1000,   // meters
    }
  }
});`,
    tip: "Avoid $where operator — it runs JavaScript on the server for every document (COLLSCAN always). Use $expr instead, which can use indexes and aggregation expressions.",
  },

  {
    id: "update",
    icon: "✏️",
    title: "Update Operators",
    subtitle: "$set, $push, $inc, $pull — modifying documents",
    Demo: UpdateDemo,
    body: "MongoDB updates use operators to modify specific fields rather than replacing whole documents. $set updates fields, $unset removes them, $inc increments numbers, $push/$pull modify arrays. updateOne() modifies the first match, updateMany() modifies all matches. findOneAndUpdate() returns the document before or after the update.",
    code: `// updateOne — modify first matching document
await db.users.updateOne(
  { _id: userId },                  // filter
  {
    $set:   { name: 'Alice Smith', updatedAt: new Date() },
    $inc:   { loginCount: 1 },      // increment
    $push:  { skills: 'MongoDB' },  // append to array
  }
);

// updateMany — modify all matching documents
await db.users.updateMany(
  { role: 'user' },
  { $set: { tier: 'basic' } }
);

// findOneAndUpdate — returns modified document
const updated = await db.users.findOneAndUpdate(
  { email: 'alice@dev.io' },
  { $set: { verified: true } },
  { returnDocument: 'after' }       // return NEW doc
);

// Array update operators
await db.posts.updateOne({ _id: postId }, {
  $push:       { tags: 'mongodb' },           // append
  $pull:       { tags: 'deprecated' },        // remove by value
  $addToSet:   { categories: 'database' },    // unique push
  $pop:        { history: -1 },               // remove first (-1) or last (1)
  $pullAll:    { oldTags: ['a','b','c'] },    // remove multiple values
});

// Update specific array element by index
await db.users.updateOne(
  { _id: id },
  { $set: { 'skills.0': 'JavaScript' } }     // update first skill
);

// Positional operator — update matched array element
await db.orders.updateOne(
  { 'items.productId': pid },
  { $set: { 'items.$.qty': 5 } }             // $ = matched element
);`,
    tip: "Always use update operators ($set, $inc, etc.) not document replacement unless you specifically want to replace. Replacement wipes all fields not in the new document.",
  },

  {
    id: "delete",
    icon: "🗑️",
    title: "Delete Operations",
    subtitle: "deleteOne(), deleteMany(), findOneAndDelete()",
    Demo: DeleteDemo,
    body: "MongoDB offers deleteOne() (first match), deleteMany() (all matches), and findOneAndDelete() (returns deleted doc). Use soft deletes (adding a deletedAt field) instead of hard deletes in production — it's much safer and enables audit trails. Hard deletes are permanent.",
    code: `// deleteOne — removes first matching document
const result = await db.users.deleteOne({ _id: userId });
console.log(result.deletedCount);   // 1

// deleteMany — removes all matching documents
const result2 = await db.users.deleteMany({ active: false });
console.log(result2.deletedCount);

// findOneAndDelete — returns the deleted document
const deleted = await db.users.findOneAndDelete(
  { email: 'old@email.com' }
);
console.log(deleted.value);  // the document that was deleted

// ── Soft Delete Pattern (RECOMMENDED for production) ──
// Instead of deleting, add a deletedAt timestamp
await db.users.updateOne(
  { _id: userId },
  { $set: { deletedAt: new Date(), deletedBy: currentUserId } }
);

// Filter deleted docs from all queries
db.users.find({ deletedAt: { $exists: false } });

// Mongoose: add to all queries automatically via middleware
userSchema.pre(/^find/, function() {
  this.where({ deletedAt: { $exists: false } });
});

// Delete entire collection (faster than deleteMany({}))
await db.collection('temp_data').drop();

// Delete database
await db.dropDatabase();`,
    tip: "In production, always prefer soft deletes (adding deletedAt: new Date()). Hard deletes are instant and irreversible — you can't recover accidentally deleted data without a backup.",
  },

  {
    id: "aggregation",
    icon: "🔄",
    title: "Aggregation Pipeline",
    subtitle: "$match, $group, $sort, $lookup — data transformation",
    Demo: AggregationDemo,
    body: "The aggregation pipeline transforms documents through a series of stages. Data flows stage-to-stage — the output of one stage is the input of the next. Common stages: $match (filter), $group (aggregate), $project (reshape), $sort, $limit, $unwind (flatten array), $lookup (join). The pipeline is the MongoDB equivalent of SQL GROUP BY + JOINs.",
    code: `// Full aggregation pipeline example
db.orders.aggregate([
  // Stage 1: Filter
  { $match: {
    status: 'completed',
    date: { $gte: new Date('2024-01-01') }
  }},

  // Stage 2: Join with users collection
  { $lookup: {
    from:         'users',
    localField:   'userId',
    foreignField: '_id',
    as:           'user',
  }},
  { $unwind: '$user' },           // flatten the joined array

  // Stage 3: Group and aggregate
  { $group: {
    _id:        '$user.city',
    totalSales: { $sum: '$amount' },
    avgOrder:   { $avg: '$amount' },
    orderCount: { $sum: 1 },
    customers:  { $addToSet: '$userId' },
  }},

  // Stage 4: Add computed field
  { $addFields: {
    uniqueCustomers: { $size: '$customers' },
    avgPerCustomer:  { $divide: ['$totalSales', { $size: '$customers' }] },
  }},

  // Stage 5: Sort by revenue
  { $sort: { totalSales: -1 } },

  // Stage 6: Paginate
  { $skip:  0 },
  { $limit: 10 },

  // Stage 7: Shape final output
  { $project: {
    city:           '$_id',
    totalSales:     1,
    orderCount:     1,
    uniqueCustomers:1,
    _id:            0,
  }},
]);`,
    tip: "Put $match as early as possible in the pipeline — ideally as the first stage — so it can use indexes and reduce the number of documents processed by subsequent stages.",
  },

  {
    id: "aggops",
    icon: "🧮",
    title: "Aggregation Operators",
    subtitle: "Accumulators, expressions, string & date operators",
    Demo: AggOpsDemo,
    body: "Aggregation operators work within pipeline stages. Accumulator operators ($sum, $avg, $min, $max, $push) work inside $group. Expression operators ($concat, $cond, $dateToString, $filter) work in $project and $addFields. Understanding these operators lets you do complex data transformations entirely in the database.",
    code: `// $group with multiple accumulators
db.sales.aggregate([{ $group: {
  _id:        '$region',
  total:      { $sum: '$amount' },
  avgAmount:  { $avg: '$amount' },
  minSale:    { $min: '$amount' },
  maxSale:    { $max: '$amount' },
  allOrders:  { $push: '$orderId' },
  uniqueItems:{ $addToSet: '$itemId' },
  firstSale:  { $first: '$date' },
  lastSale:   { $last:  '$date' },
}}]);

// $project with expressions
db.users.aggregate([{ $project: {
  fullName:    { $concat: ['$firstName', ' ', '$lastName'] },
  nameUpper:   { $toUpper: '$name' },
  yearJoined:  { $year: '$createdAt' },
  ageGroup: { $cond: {
    if:   { $gte: ['$age', 18] },
    then: 'adult',
    else: 'minor',
  }},
  firstSkill:  { $arrayElemAt: ['$skills', 0] },
  skillCount:  { $size: '$skills' },
  seniorSkills:{ $filter: {
    input: '$skills',
    cond:  { $gte: ['$$this.years', 5] },
  }},
  phone:  { $ifNull: ['$phone', 'N/A'] },
}}]);

// Date expressions
{ $dateToString: { format: '%Y-%m', date: '$createdAt' } }
{ $dateDiff: { startDate:'$start', endDate:'$$NOW', unit:'day' } }`,
    tip: "Use $facet to run multiple aggregation pipelines in a single pass. Perfect for search results pages that need both the paginated results and total count.",
  },

  {
    id: "indexes",
    icon: "⚡",
    title: "Indexes",
    subtitle: "8 index types — single, compound, text, TTL, geospatial",
    Demo: IndexesDemo,
    body: "Indexes are special data structures that store a small portion of data in a form easy to traverse. Without indexes, MongoDB must do a COLLSCAN — reading every document. With the right indexes, queries become IXSCAN — reading only relevant data. Each index uses memory and slows writes — create only what you need.",
    code: `// Single field index
db.users.createIndex({ email: 1 });        // 1=asc, -1=desc
db.users.createIndex({ createdAt: -1 });   // sort descending

// Unique index
db.users.createIndex({ email: 1 }, { unique: true });

// Compound index (ESR rule: Equality→Sort→Range)
db.orders.createIndex({ userId: 1, status: 1, createdAt: -1 });

// Partial index (only index subset of documents)
db.users.createIndex(
  { email: 1 },
  { partialFilterExpression: { active: true } }
);

// Text index (full-text search)
db.articles.createIndex(
  { title: 'text', body: 'text' },
  { weights: { title: 10, body: 1 } }  // title matches weighted 10x
);
db.articles.find({ $text: { $search: 'mongodb aggregation' } });

// TTL index (auto-expire documents)
db.sessions.createIndex(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }  // delete when expiresAt time arrives
);

// 2dsphere (geospatial)
db.stores.createIndex({ location: '2dsphere' });

// List all indexes
db.users.getIndexes();

// Drop an index
db.users.dropIndex('email_1');

// Hide index (test performance impact without dropping)
db.users.hideIndex('email_1');`,
    tip: "Never create more indexes than you need. Every write must update all indexes on the collection. A good rule: analyze your query patterns with explain() first, then create targeted indexes.",
  },

  {
    id: "schema",
    icon: "🏗️",
    title: "Schema Design",
    subtitle:
      "Embed vs Reference vs Hybrid — designing for your query patterns",
    Demo: SchemaDemo,
    body: "MongoDB's flexible schema is a feature, not an excuse for no design. The golden rule: design your schema around your application's query patterns, not the data's natural relationships. Embed data that's always accessed together. Reference data that's shared, grows unbounded, or needs to be queried independently.",
    code: `// ── One-to-One: always embed ──
const userSchema = {
  _id: ObjectId,
  name: String,
  profile: {             // embedded — always fetched with user
    bio:     String,
    avatar:  String,
    website: String,
  }
};

// ── One-to-Few: embed (< ~100 items) ──
const postSchema = {
  title:    String,
  comments: [            // embedded array
    { user: String, text: String, date: Date }
  ]  // ✓ if comments < ~100, access with post
};

// ── One-to-Many: reference ──
const orderSchema = {
  customerId: ObjectId,  // reference → Customer collection
  items: [
    { productId: ObjectId, qty: Number, price: Number }
  ]
};
// $lookup to join at query time

// ── Many-to-Many: reference + junction pattern ──
// users ← enrollments → courses
const enrollmentSchema = {
  userId:    ObjectId,
  courseId:  ObjectId,
  progress:  Number,
  enrolledAt: Date,
};

// ── Hybrid: embed summary, reference full data ──
const blogPost = {
  title:         String,
  author: {
    _id:  ObjectId,      // reference for updates
    name: String,        // embedded for display (no $lookup needed)
  },
  commentCount:  Number,  // pre-computed for list view
  recentComment: Object,  // embedded last comment (preview)
};`,
    tip: "The #1 mistake: normalizing MongoDB like SQL. MongoDB performs best when a single query fetches all the data a page needs. Design around your most frequent operations.",
  },

  {
    id: "mongoose",
    icon: "🐍",
    title: "Mongoose ODM",
    subtitle: "Schema, validation, virtuals, middleware, population",
    Demo: MongooseDemo,
    body: "Mongoose is an ODM (Object Document Mapper) for MongoDB and Node.js. It adds schemas, validation, virtuals, middleware (hooks), and query helpers on top of the native driver. Mongoose is the standard way to use MongoDB in production Node.js applications — it's opinionated in the right ways.",
    code: `// Connection with best practices
const mongoose = require('mongoose');

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected ✓');
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

// Schema with all features
const postSchema = new mongoose.Schema({
  title:   { type: String, required: true, trim: true },
  slug:    { type: String, unique: true, lowercase: true },
  body:    String,
  author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags:    [String],
  views:   { type: Number, default: 0 },
  published: { type: Boolean, default: false },
}, { timestamps: true });

// Pre-save: auto-generate slug
postSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/\\s+/g, '-');
  }
  next();
});

// Population example
const post = await Post
  .findById(id)
  .populate('author', 'name avatar email');`,
    tip: "Always set { timestamps: true } on schemas — you get createdAt and updatedAt for free. And always set { versionKey: false } to remove the noisy __v field.",
  },

  {
    id: "transactions",
    icon: "🔒",
    title: "Transactions",
    subtitle: "ACID transactions across multiple documents & collections",
    Demo: TransactionsDemo,
    body: "MongoDB has supported multi-document ACID transactions since v4.0 (replica sets) and v4.2 (sharded clusters). Transactions guarantee atomicity — either all operations commit or all are rolled back. They're essential for financial transfers, inventory management, or any operation spanning multiple documents or collections.",
    code: `const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

async function transferFunds(fromId, toId, amount) {
  const session = client.startSession();

  try {
    session.startTransaction({
      readConcern:  { level: 'snapshot' },
      writeConcern: { w: 'majority' },
    });

    const accounts = client.db('bank').collection('accounts');

    // Debit sender
    const from = await accounts.findOneAndUpdate(
      { _id: fromId, balance: { $gte: amount } },  // check funds!
      { $inc: { balance: -amount } },
      { session, returnDocument: 'after' }
    );

    if (!from.value) {
      throw new Error('Insufficient funds');
    }

    // Credit receiver
    await accounts.updateOne(
      { _id: toId },
      { $inc: { balance: amount } },
      { session }
    );

    // Log the transaction
    await client.db('bank').collection('ledger').insertOne({
      from: fromId, to: toId, amount,
      timestamp: new Date(), type: 'transfer',
    }, { session });

    await session.commitTransaction();
    console.log('Transfer complete ✓');

  } catch (error) {
    await session.abortTransaction();
    throw error;  // re-throw for caller to handle
  } finally {
    await session.endSession();
  }
}`,
    tip: "Transactions have performance overhead — they acquire locks and use more resources. Reserve them for operations that truly need atomicity across multiple documents. Most MongoDB apps rarely need transactions if schema is designed well.",
  },

  {
    id: "atlas",
    icon: "☁️",
    title: "Atlas & Connections",
    subtitle: "Cloud platform, connection strings, Atlas Search, Vector Search",
    Demo: AtlasDemo,
    body: "MongoDB Atlas is the fully managed cloud database service. It provides auto-scaling, automated backups, monitoring, and a rich ecosystem of features on AWS, GCP, and Azure. Atlas Search (full-text), Vector Search (AI/RAG), Triggers, App Services, and Charts are all built in.",
    code: `// .env file (never commit to git!)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mydb?retryWrites=true&w=majority

// Express app with Mongoose
const express  = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Connect once at startup
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Atlas connected ✓'))
  .catch(err => { console.error(err); process.exit(1); });

// Atlas Search (requires Search Index on collection)
db.articles.aggregate([{
  $search: {
    index: 'default',
    text: {
      query:  'mongodb tutorial',
      path:   ['title', 'body'],
      fuzzy:  { maxEdits: 1 },       // typo tolerance
    },
  }
}, {
  $project: {
    title: 1,
    score: { $meta: 'searchScore' }, // relevance score
  }
}, {
  $sort: { score: -1 }
}]);

// Atlas Vector Search (for AI/RAG apps)
db.documents.aggregate([{
  $vectorSearch: {
    index:       'vector_index',
    path:        'embedding',
    queryVector: await generateEmbedding(userQuery),
    numCandidates: 100,
    limit:         10,
  }
}]);`,
    tip: "Set up Atlas IP Access List to only allow connections from your app server IPs. Never use 0.0.0.0/0 (allow anywhere) in production — it's a serious security risk.",
  },

  {
    id: "performance",
    icon: "🚀",
    title: "Performance & Best Practices",
    subtitle: "Indexes, projections, bulk ops, explain() — production patterns",
    Demo: PerfDemo,
    body: "MongoDB performance comes down to four things: proper indexes (IXSCAN not COLLSCAN), projections (fetch only needed fields), bulk operations (fewer network round-trips), and schema design aligned with query patterns. Use explain('executionStats') to diagnose slow queries. Set up Atlas Performance Advisor for automatic index recommendations.",
    code: `// ── explain() — your best friend ──
const plan = await db.users
  .find({ age: { $gt: 25 }, active: true })
  .sort({ score: -1 })
  .explain('executionStats');

console.log(plan.executionStats);
// Look for:
// executionStages.stage = 'IXSCAN'  ← good
// executionStages.stage = 'COLLSCAN' ← bad (needs index)
// totalDocsExamined vs totalDocsReturned (should be close)

// ── Covered Query (fastest possible) ──
// Index covers all fields in query + projection — no doc fetch
db.users.createIndex({ role: 1, name: 1, email: 1 });
db.users.find(
  { role: 'admin' },
  { name: 1, email: 1, _id: 0 }   // only indexed fields!
);

// ── Connection Pooling (native driver) ──
const client = new MongoClient(uri, {
  maxPoolSize:      10,   // max connections in pool
  minPoolSize:       2,   // keep 2 warm
  maxIdleTimeMS: 30000,   // close idle after 30s
  connectTimeoutMS: 5000, // give up connecting after 5s
  socketTimeoutMS: 45000,
});

// ── Mongoose lean() for read-only queries ──
const users = await User
  .find({ active: true })
  .select('name email')
  .lean()          // 2-3x faster: plain JS objects
  .exec();

// ── $lookup with pipeline (selective join) ──
{ $lookup: {
  from: 'orders',
  let: { userId: '$_id' },
  pipeline: [
    { $match: { $expr: { $eq: ['$userId', '$$userId'] } } },
    { $match: { status: 'completed' } },   // filter before join
    { $project: { amount: 1, date: 1 } },  // project early
    { $limit: 5 },                          // limit early
  ],
  as: 'recentOrders',
}},`,
    tip: "Run db.currentOp() in Atlas to see currently running operations. Use Atlas Performance Advisor for automatic index suggestions based on your actual query patterns.",
  },
];

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function MongoDBMasterclass() {
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

  const { Demo } = current;

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
              background: `linear-gradient(135deg,${t.accent},#15803d)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              flexShrink: 0,
            }}
          >
            🍃
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
              MongoDB Masterclass
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
            v7.0
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
                  background: `linear-gradient(90deg,${t.accent},#67e8f9)`,
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
              display: "flex",
              alignItems: "center",
              gap: 5,
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
          {/* Search */}
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
                  padding: "7px 28px 7px 28px",
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
                    fontSize: "1rem",
                    padding: 0,
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {/* Progress dots */}
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
                      ? "#22c55e"
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
          {/* Nav — scrollable zone */}
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
                        color: "#22c55e",
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
              Live interactive demos · All CRUD + Aggregation
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
          <div style={{ maxWidth: 840, margin: "0 auto" }}>
            {/* Heading */}
            <div style={{ marginBottom: 22 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
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
                    background: done.has(current.id) ? "#22c55e20" : t.surface2,
                    border: `1px solid ${done.has(current.id) ? "#22c55e60" : t.border}`,
                    color: done.has(current.id) ? "#22c55e" : t.muted,
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
              <div style={{ marginBottom: 24 }}>
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

            {/* Nav */}
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
