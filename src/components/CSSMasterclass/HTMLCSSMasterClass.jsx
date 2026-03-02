import { useState, useRef, useEffect } from "react";

/* ── THEME ─────────────────────────────────────────────────── */
const T = {
  dark: {
    bg: "#070b0f",
    sidebar: "#0b1017",
    surface: "#0f1922",
    surface2: "#162030",
    border: "#1e3040",
    text: "#ddeeff",
    muted: "#5a7a95",
    accent: "#22d3ee",
    accentBg: "#22d3ee12",
    accentBorder: "#22d3ee35",
    success: "#86efac",
    danger: "#fca5a5",
    warn: "#fbbf24",
    purple: "#c084fc",
    tag: "#22d3ee18",
  },
  light: {
    bg: "#f0f7ff",
    sidebar: "#ffffff",
    surface: "#ffffff",
    surface2: "#e8f4ff",
    border: "#c8ddf0",
    text: "#0a1a2a",
    muted: "#5a7a9a",
    accent: "#0891b2",
    accentBg: "#0891b212",
    accentBorder: "#0891b235",
    success: "#16a34a",
    danger: "#dc2626",
    warn: "#d97706",
    purple: "#7c3aed",
    tag: "#0891b215",
  },
};

/* ── SHARED COMPONENTS ────────────────────────────────────── */
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
        color: ok ? "#22c55e" : "#5a7a95",
        borderRadius: 6,
        padding: "3px 10px",
        fontSize: "0.72rem",
        cursor: "pointer",
        fontFamily: "monospace",
        transition: "all 0.2s",
      }}
    >
      {ok ? "✓ copied" : "copy"}
    </button>
  );
}

function Code({ code, lang = "html" }) {
  const lines = code.trim().split("\n");
  const color = (l) => {
    if (
      l.trim().startsWith("/*") ||
      l.trim().startsWith("//") ||
      l.trim().startsWith("<!--")
    )
      return "#4a6a80";
    if (lang === "css") {
      if (l.includes("{") || l.includes("}")) return "#ddeeff";
      if (l.includes(":")) return "#86efac";
      return "#a0c8e0";
    }
    if (l.includes("</") || l.includes("/>")) return "#22d3ee";
    if (l.includes("<")) return "#22d3ee";
    if (l.includes("=")) return "#fbbf24";
    return "#c8e0f0";
  };
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #1e3040",
      }}
    >
      <div
        style={{
          background: "#05090d",
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
                  color: "#1e3040",
                  userSelect: "none",
                  minWidth: 18,
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span style={{ color: color(line) }}>{line || " "}</span>
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
          background: color || "#22d3ee",
          borderRadius: 99,
        }}
      />
      <span
        style={{
          fontSize: "0.72rem",
          fontWeight: 700,
          color: "#5a7a95",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function ElTag({ tag, t, color, onClick, selected }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: selected ? color + "30" : t.surface2,
        color: selected ? color : t.muted,
        border: `1px solid ${selected ? color + "70" : t.border}`,
        borderRadius: 7,
        padding: "4px 10px",
        fontSize: "0.76rem",
        fontWeight: 700,
        fontFamily: "monospace",
        cursor: "pointer",
        transition: "all 0.15s",
        margin: "2px",
      }}
    >
      &lt;{tag}&gt;
    </button>
  );
}

/* ══ DEMO 1: HTML Intro ═══════════════════════════════════════ */
function IntroDemo({ t }) {
  const [active, setActive] = useState(0);
  const parts = [
    {
      label: "DOCTYPE",
      color: "#22d3ee",
      desc: "Tells browsers this is HTML5. Always the very first line — no exceptions.",
      code: "<!DOCTYPE html>",
    },
    {
      label: "<html>",
      color: "#86efac",
      desc: "Root element. lang attribute helps screen readers and SEO. Everything lives inside.",
      code: '<html lang="en">',
    },
    {
      label: "<head>",
      color: "#fbbf24",
      desc: "Invisible metadata: charset, viewport, title, CSS links, fonts. Not rendered in page.",
      code: '<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Page Title</title>\n  <link rel="stylesheet" href="style.css">\n</head>',
    },
    {
      label: "<body>",
      color: "#c084fc",
      desc: "Everything visible on the page. All content, images, buttons, text goes here.",
      code: "<body>\n  <h1>Hello World</h1>\n  <p>Page content here.</p>\n</body>",
    },
  ];
  const p = parts[active];
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
        HTML Document Anatomy — click each part
      </p>
      <div
        style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}
      >
        {parts.map((p, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              background: active === i ? p.color + "25" : t.surface,
              color: active === i ? p.color : t.muted,
              border: `1px solid ${active === i ? p.color + "70" : t.border}`,
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              fontSize: "0.82rem",
              fontWeight: 700,
              transition: "all 0.2s",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div
        style={{
          background: t.surface,
          border: `1px solid ${p.color}50`,
          borderRadius: 10,
          padding: "12px 16px",
          marginBottom: 12,
          borderLeft: `3px solid ${p.color}`,
        }}
      >
        <div
          style={{
            color: p.color,
            fontWeight: 700,
            fontSize: "0.85rem",
            marginBottom: 4,
          }}
        >
          {p.label}
        </div>
        <div style={{ color: t.muted, fontSize: "0.83rem", lineHeight: 1.6 }}>
          {p.desc}
        </div>
      </div>
      <pre
        style={{
          margin: 0,
          background: "#05090d",
          border: `1px solid ${t.border}`,
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: "0.78rem",
          color: p.color,
          fontFamily: "monospace",
          overflow: "auto",
        }}
      >
        {p.code}
      </pre>
    </div>
  );
}

/* ══ DEMO 2: Block Elements — FULL LIST ═══════════════════════ */
const BLOCK_ELEMENTS = [
  { tag: "address", desc: "Contact information", cat: "semantic" },
  { tag: "article", desc: "Self-contained content", cat: "semantic" },
  { tag: "aside", desc: "Sidebar / tangential content", cat: "semantic" },
  { tag: "blockquote", desc: "Long quotation from source", cat: "text" },
  { tag: "canvas", desc: "Drawing surface (JS)", cat: "media" },
  { tag: "dd", desc: "Description list detail", cat: "list" },
  { tag: "details", desc: "Expandable disclosure widget", cat: "interactive" },
  { tag: "dialog", desc: "Modal dialog element", cat: "interactive" },
  { tag: "div", desc: "Generic block container", cat: "layout" },
  { tag: "dl", desc: "Description list", cat: "list" },
  { tag: "dt", desc: "Description term", cat: "list" },
  { tag: "fieldset", desc: "Groups form controls", cat: "form" },
  { tag: "figcaption", desc: "Caption for a figure", cat: "semantic" },
  { tag: "figure", desc: "Self-contained figure", cat: "semantic" },
  { tag: "footer", desc: "Page or section footer", cat: "semantic" },
  { tag: "form", desc: "Interactive form", cat: "form" },
  { tag: "h1", desc: "Top-level heading", cat: "heading" },
  { tag: "h2", desc: "Second-level heading", cat: "heading" },
  { tag: "h3", desc: "Third-level heading", cat: "heading" },
  { tag: "h4", desc: "Fourth-level heading", cat: "heading" },
  { tag: "h5", desc: "Fifth-level heading", cat: "heading" },
  { tag: "h6", desc: "Sixth-level heading", cat: "heading" },
  { tag: "header", desc: "Page or section header", cat: "semantic" },
  { tag: "hgroup", desc: "Heading group", cat: "semantic" },
  { tag: "hr", desc: "Horizontal rule / divider", cat: "text" },
  { tag: "legend", desc: "Caption for fieldset", cat: "form" },
  { tag: "li", desc: "List item", cat: "list" },
  { tag: "main", desc: "Main content area", cat: "semantic" },
  { tag: "nav", desc: "Navigation links section", cat: "semantic" },
  { tag: "noscript", desc: "Fallback when JS disabled", cat: "other" },
  { tag: "ol", desc: "Ordered list", cat: "list" },
  { tag: "p", desc: "Paragraph of text", cat: "text" },
  { tag: "pre", desc: "Preformatted text", cat: "text" },
  { tag: "section", desc: "Thematic grouping of content", cat: "semantic" },
  { tag: "summary", desc: "Summary for <details>", cat: "interactive" },
  { tag: "table", desc: "Table", cat: "table" },
  { tag: "tfoot", desc: "Table footer group", cat: "table" },
  { tag: "thead", desc: "Table header group", cat: "table" },
  { tag: "tr", desc: "Table row", cat: "table" },
  { tag: "ul", desc: "Unordered list", cat: "list" },
  { tag: "video", desc: "Video embed", cat: "media" },
];

const CAT_COLORS = {
  semantic: "#22d3ee",
  layout: "#86efac",
  text: "#fbbf24",
  heading: "#c084fc",
  list: "#fb923c",
  form: "#f87171",
  media: "#a78bfa",
  table: "#34d399",
  interactive: "#f472b6",
  other: "#94a3b8",
};

function BlockElementsDemo({ t }) {
  const [selCat, setSelCat] = useState("all");
  const [hov, setHov] = useState(null);
  const cats = ["all", ...Object.keys(CAT_COLORS)];
  const visible =
    selCat === "all"
      ? BLOCK_ELEMENTS
      : BLOCK_ELEMENTS.filter((e) => e.cat === selCat);

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
        All {BLOCK_ELEMENTS.length} HTML Block Elements — filter by category
      </p>
      {/* Category filter */}
      <div
        style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}
      >
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setSelCat(c)}
            style={{
              background:
                selCat === c
                  ? (c === "all" ? t.accent : CAT_COLORS[c]) + "30"
                  : t.surface,
              color:
                selCat === c
                  ? c === "all"
                    ? t.accent
                    : CAT_COLORS[c]
                  : t.muted,
              border: `1px solid ${selCat === c ? (c === "all" ? t.accent : CAT_COLORS[c]) + "70" : t.border}`,
              borderRadius: 20,
              padding: "3px 10px",
              cursor: "pointer",
              fontSize: "0.72rem",
              fontWeight: 700,
              transition: "all 0.15s",
            }}
          >
            {c}
            {c !== "all" && (
              <span style={{ marginLeft: 4, opacity: 0.7 }}>
                ({BLOCK_ELEMENTS.filter((e) => e.cat === c).length})
              </span>
            )}
          </button>
        ))}
      </div>
      {/* Visual: block demonstration */}
      <div
        style={{
          background: t.surface,
          border: `2px dashed ${t.border}`,
          borderRadius: 10,
          padding: 10,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: "0.7rem",
            color: t.muted,
            marginBottom: 8,
            fontWeight: 700,
          }}
        >
          Block = full width, new line before & after:
        </div>
        {["div", "p", "h2", "ul"].map((tag) => (
          <div
            key={tag}
            style={{
              background:
                CAT_COLORS[
                  BLOCK_ELEMENTS.find((e) => e.tag === tag)?.cat || "other"
                ] + "20",
              border: `1px solid ${CAT_COLORS[BLOCK_ELEMENTS.find((e) => e.tag === tag)?.cat || "other"]}50`,
              borderRadius: 5,
              padding: "5px 10px",
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <code
              style={{
                color:
                  CAT_COLORS[
                    BLOCK_ELEMENTS.find((e) => e.tag === tag)?.cat || "other"
                  ],
                fontSize: "0.78rem",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              &lt;{tag}&gt;
            </code>
            <div
              style={{
                flex: 1,
                height: 5,
                background:
                  CAT_COLORS[
                    BLOCK_ELEMENTS.find((e) => e.tag === tag)?.cat || "other"
                  ] + "40",
                borderRadius: 99,
              }}
            />
            <span style={{ color: t.muted, fontSize: "0.68rem" }}>
              100% width
            </span>
          </div>
        ))}
      </div>
      {/* Full element grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          maxHeight: 280,
          overflowY: "auto",
          padding: 4,
        }}
      >
        {visible.map((el, i) => (
          <div
            key={el.tag}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            style={{
              background: hov === i ? CAT_COLORS[el.cat] + "30" : t.surface,
              border: `1px solid ${hov === i ? CAT_COLORS[el.cat] + "80" : t.border}`,
              borderRadius: 8,
              padding: "5px 10px",
              cursor: "default",
              transition: "all 0.15s",
              minWidth: 120,
              flex: "0 1 auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 2,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 2,
                  background: CAT_COLORS[el.cat],
                  flexShrink: 0,
                }}
              />
              <code
                style={{
                  color: hov === i ? CAT_COLORS[el.cat] : t.accent,
                  fontSize: "0.78rem",
                  fontWeight: 700,
                }}
              >
                &lt;{el.tag}&gt;
              </code>
            </div>
            <div
              style={{ color: t.muted, fontSize: "0.68rem", paddingLeft: 12 }}
            >
              {el.desc}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 8,
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {Object.entries(CAT_COLORS).map(([c, clr]) => (
          <div
            key={c}
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            <div
              style={{ width: 8, height: 8, borderRadius: 2, background: clr }}
            />
            <span style={{ fontSize: "0.67rem", color: t.muted }}>{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══ DEMO 3: Inline / Non-Block Elements — FULL LIST ══════════ */
const INLINE_ELEMENTS = [
  { tag: "a", desc: "Hyperlink / anchor", cat: "interactive" },
  { tag: "abbr", desc: "Abbreviation with title", cat: "text" },
  { tag: "acronym", desc: "Acronym (deprecated)", cat: "text", dep: true },
  { tag: "b", desc: "Bold (stylistic)", cat: "text" },
  { tag: "bdo", desc: "Bidirectional text override", cat: "text" },
  { tag: "big", desc: "Bigger text (deprecated)", cat: "text", dep: true },
  { tag: "br", desc: "Line break", cat: "text" },
  { tag: "button", desc: "Clickable button", cat: "interactive" },
  { tag: "cite", desc: "Citation / title of work", cat: "text" },
  { tag: "code", desc: "Inline code snippet", cat: "text" },
  { tag: "dfn", desc: "Defining instance of term", cat: "text" },
  { tag: "em", desc: "Emphasis (semantic italic)", cat: "text" },
  { tag: "i", desc: "Italic (stylistic)", cat: "text" },
  { tag: "img", desc: "Embedded image", cat: "media" },
  { tag: "input", desc: "Form input control", cat: "form" },
  { tag: "kbd", desc: "Keyboard input", cat: "text" },
  { tag: "label", desc: "Label for form control", cat: "form" },
  { tag: "map", desc: "Image map definition", cat: "media" },
  { tag: "mark", desc: "Highlighted / marked text", cat: "text" },
  { tag: "meter", desc: "Scalar measurement gauge", cat: "form" },
  { tag: "object", desc: "Embedded external resource", cat: "media" },
  { tag: "output", desc: "Result of calculation", cat: "form" },
  { tag: "picture", desc: "Responsive image container", cat: "media" },
  { tag: "progress", desc: "Progress bar indicator", cat: "form" },
  { tag: "q", desc: "Short inline quotation", cat: "text" },
  { tag: "s", desc: "Strikethrough text", cat: "text" },
  { tag: "samp", desc: "Sample program output", cat: "text" },
  { tag: "select", desc: "Dropdown select control", cat: "form" },
  { tag: "small", desc: "Fine print / smaller text", cat: "text" },
  { tag: "span", desc: "Generic inline container", cat: "layout" },
  { tag: "strong", desc: "Strong importance (bold)", cat: "text" },
  { tag: "sub", desc: "Subscript text", cat: "text" },
  { tag: "sup", desc: "Superscript text", cat: "text" },
  { tag: "textarea", desc: "Multi-line text input", cat: "form" },
  { tag: "time", desc: "Machine-readable time/date", cat: "text" },
  { tag: "tt", desc: "Teletype (deprecated)", cat: "text", dep: true },
  { tag: "u", desc: "Underline (unarticulated annotation)", cat: "text" },
  { tag: "var", desc: "Variable in math/code", cat: "text" },
  { tag: "wbr", desc: "Word break opportunity", cat: "text" },
];

const INLINE_CATS = {
  text: "#fbbf24",
  interactive: "#22d3ee",
  form: "#f87171",
  media: "#a78bfa",
  layout: "#86efac",
};

function InlineElementsDemo({ t }) {
  const [selCat, setSelCat] = useState("all");
  const [showDep, setShowDep] = useState(false);
  const cats = ["all", ...Object.keys(INLINE_CATS)];
  let visible =
    selCat === "all"
      ? INLINE_ELEMENTS
      : INLINE_ELEMENTS.filter((e) => e.cat === selCat);
  if (!showDep) visible = visible.filter((e) => !e.dep);

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
        All {INLINE_ELEMENTS.length} HTML Inline Elements — non-block, flow in
        line
      </p>
      <div
        style={{
          display: "flex",
          gap: 5,
          flexWrap: "wrap",
          marginBottom: 10,
          alignItems: "center",
        }}
      >
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setSelCat(c)}
            style={{
              background:
                selCat === c
                  ? (c === "all" ? t.accent : INLINE_CATS[c]) + "30"
                  : t.surface,
              color:
                selCat === c
                  ? c === "all"
                    ? t.accent
                    : INLINE_CATS[c]
                  : t.muted,
              border: `1px solid ${selCat === c ? (c === "all" ? t.accent : INLINE_CATS[c]) + "70" : t.border}`,
              borderRadius: 20,
              padding: "3px 10px",
              cursor: "pointer",
              fontSize: "0.72rem",
              fontWeight: 700,
              transition: "all 0.15s",
            }}
          >
            {c}
            {c !== "all" && (
              <span style={{ marginLeft: 4, opacity: 0.7 }}>
                (
                {
                  INLINE_ELEMENTS.filter(
                    (e) => e.cat === c && (!e.dep || showDep),
                  ).length
                }
                )
              </span>
            )}
          </button>
        ))}
        <button
          onClick={() => setShowDep((d) => !d)}
          style={{
            marginLeft: "auto",
            background: showDep ? "#f8717120" : t.surface,
            color: showDep ? "#f87171" : t.muted,
            border: `1px solid ${showDep ? "#f8717150" : t.border}`,
            borderRadius: 20,
            padding: "3px 10px",
            cursor: "pointer",
            fontSize: "0.72rem",
            fontWeight: 700,
          }}
        >
          {showDep ? "Hide" : "Show"} deprecated
        </button>
      </div>
      {/* Visual: inline flow demo */}
      <div
        style={{
          background: t.surface,
          border: `2px dashed ${t.border}`,
          borderRadius: 10,
          padding: "10px 14px",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: "0.7rem",
            color: t.muted,
            marginBottom: 6,
            fontWeight: 700,
          }}
        >
          Inline = flows within text, doesn't force new line:
        </div>
        <p
          style={{
            margin: 0,
            color: t.text,
            fontSize: "0.85rem",
            lineHeight: 2,
          }}
        >
          Normal text&nbsp;
          <span
            style={{
              background: t.accentBg,
              border: `1px solid ${t.accentBorder}`,
              color: t.accent,
              borderRadius: 4,
              padding: "1px 6px",
              fontSize: "0.78rem",
              fontFamily: "monospace",
            }}
          >
            &lt;span&gt;
          </span>
          &nbsp;flows inline&nbsp;
          <strong style={{ color: t.text }}>bold text</strong>
          &nbsp;keeps going&nbsp;
          <code
            style={{
              background: "#22d3ee20",
              color: "#22d3ee",
              borderRadius: 4,
              padding: "1px 6px",
              fontSize: "0.82rem",
            }}
          >
            code
          </code>
          &nbsp;still same line&nbsp;
          <em style={{ color: t.purple }}>em text</em>
          &nbsp;and so on.
        </p>
      </div>
      {/* Full grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          maxHeight: 280,
          overflowY: "auto",
          padding: 4,
        }}
      >
        {visible.map((el, i) => (
          <div
            key={el.tag}
            style={{
              background: el.dep ? t.surface + "aa" : t.surface,
              border: `1px solid ${el.dep ? "#f8717130" : t.border}`,
              borderRadius: 8,
              padding: "5px 10px",
              opacity: el.dep ? 0.65 : 1,
              minWidth: 120,
              flex: "0 1 auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginBottom: 2,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 2,
                  background: el.dep
                    ? "#f87171"
                    : INLINE_CATS[el.cat] || "#94a3b8",
                  flexShrink: 0,
                }}
              />
              <code
                style={{
                  color: el.dep ? "#f87171" : t.accent,
                  fontSize: "0.78rem",
                  fontWeight: 700,
                }}
              >
                &lt;{el.tag}&gt;
              </code>
              {el.dep && (
                <span
                  style={{
                    fontSize: "0.6rem",
                    color: "#f87171",
                    fontWeight: 700,
                  }}
                >
                  DEP
                </span>
              )}
            </div>
            <div
              style={{ color: t.muted, fontSize: "0.68rem", paddingLeft: 11 }}
            >
              {el.desc}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>
        {Object.entries(INLINE_CATS).map(([c, clr]) => (
          <div
            key={c}
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            <div
              style={{ width: 8, height: 8, borderRadius: 2, background: clr }}
            />
            <span style={{ fontSize: "0.67rem", color: t.muted }}>{c}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: "#f87171",
            }}
          />
          <span style={{ fontSize: "0.67rem", color: "#f87171" }}>
            deprecated
          </span>
        </div>
      </div>
    </div>
  );
}

/* ══ DEMO 4: Block vs Inline Visual Diff ═══════════════════════ */
function BlockVsInlineDemo({ t }) {
  const [mode, setMode] = useState("block");
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
        Block vs Inline — visual comparison
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          ["🔲 Block", "block"],
          ["📝 Inline", "inline"],
          ["📦 Inline-Block", "inline-block"],
        ].map(([lbl, v]) => (
          <button
            key={v}
            onClick={() => setMode(v)}
            style={{
              background: mode === v ? t.accentBg : t.surface,
              color: mode === v ? t.accent : t.muted,
              border: `1px solid ${mode === v ? t.accentBorder : t.border}`,
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              fontSize: "0.82rem",
              fontWeight: 700,
            }}
          >
            {lbl}
          </button>
        ))}
      </div>
      <div
        style={{
          background: t.surface,
          border: `2px dashed ${t.border}`,
          borderRadius: 10,
          padding: 14,
          marginBottom: 12,
          minHeight: 100,
        }}
      >
        {mode === "block" && (
          <div>
            {["Box A", "Box B", "Box C"].map((b, i) => (
              <div
                key={b}
                style={{
                  background: ["#22d3ee30", "#86efac30", "#c084fc30"][i],
                  border: `1px solid ${["#22d3ee", "#86efac", "#c084fc"][i]}50`,
                  borderRadius: 6,
                  padding: "8px 12px",
                  marginBottom: 6,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: ["#22d3ee", "#86efac", "#c084fc"][i],
                }}
              >
                {b} — display: block (full width, own line)
              </div>
            ))}
          </div>
        )}
        {mode === "inline" && (
          <p
            style={{
              margin: 0,
              color: t.text,
              fontSize: "0.88rem",
              lineHeight: 2.2,
            }}
          >
            Regular text&nbsp;
            {["Span A", "Span B", "Span C"].map((b, i) => (
              <span
                key={b}
                style={{
                  background: ["#22d3ee30", "#86efac30", "#c084fc30"][i],
                  border: `1px solid ${["#22d3ee", "#86efac", "#c084fc"][i]}50`,
                  borderRadius: 4,
                  padding: "2px 8px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: ["#22d3ee", "#86efac", "#c084fc"][i],
                  margin: "0 4px",
                }}
              >
                {b}
              </span>
            ))}
            &nbsp;more text continues naturally.
          </p>
        )}
        {mode === "inline-block" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["Box A", "Box B", "Box C", "Box D"].map((b, i) => (
              <div
                key={b}
                style={{
                  display: "inline-block",
                  background: [
                    "#22d3ee30",
                    "#86efac30",
                    "#c084fc30",
                    "#fbbf2430",
                  ][i],
                  border: `1px solid ${["#22d3ee", "#86efac", "#c084fc", "#fbbf24"][i]}50`,
                  borderRadius: 6,
                  padding: `${8 + i * 4}px ${12 + i * 4}px`,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: ["#22d3ee", "#86efac", "#c084fc", "#fbbf24"][i],
                }}
              >
                {b}
              </div>
            ))}
            <p
              style={{
                color: t.muted,
                fontSize: "0.75rem",
                width: "100%",
                margin: "8px 0 0",
              }}
            >
              inline-block = flows like inline but accepts width/height/padding
              like block
            </p>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[
          {
            label: "Block",
            props: [
              "Takes full width",
              "Starts on new line",
              "Respects width/height",
              "Margin/padding all sides",
            ],
            color: "#22d3ee",
          },
          {
            label: "Inline",
            props: [
              "Flows with text",
              "No forced line break",
              "Ignores width/height",
              "Only horizontal margin",
            ],
            color: "#86efac",
          },
          {
            label: "Inline-block",
            props: [
              "Flows like inline",
              "No forced line break",
              "Respects width/height",
              "Margin/padding all sides",
            ],
            color: "#c084fc",
          },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              flex: "1 1 140px",
              background: item.color + "15",
              border: `1px solid ${item.color}35`,
              borderRadius: 9,
              padding: "10px 12px",
            }}
          >
            <div
              style={{
                color: item.color,
                fontWeight: 700,
                fontSize: "0.82rem",
                marginBottom: 6,
              }}
            >
              {item.label}
            </div>
            {item.props.map((p) => (
              <div
                key={p}
                style={{ color: t.muted, fontSize: "0.72rem", marginBottom: 3 }}
              >
                • {p}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
/* ══ DEMO 5: Semantic HTML ════════════════════════════════════ */
function SemanticDemo({ t }) {
  const [hov, setHov] = useState(null);
  const sections = [
    {
      el: "<header>",
      color: "#22d3ee",
      pos: { top: 0, left: 0, right: 0, h: 48 },
      desc: "Site logo, nav, hero. One per page.",
    },
    {
      el: "<nav>",
      color: "#86efac",
      pos: { top: 0, left: 0, right: 0, h: 40 },
      desc: "Primary navigation links.",
    },
    {
      el: "<main>",
      color: "#fbbf24",
      pos: { top: 56, left: 0, right: 200, h: 240 },
      desc: "Unique main content. Only one per page.",
    },
    {
      el: "<aside>",
      color: "#c084fc",
      pos: { top: 56, right: 0, w: 190, h: 240 },
      desc: "Sidebar, related content.",
    },
    {
      el: "<article>",
      color: "#f87171",
      pos: { top: 80, left: 16, right: 216, h: 180 },
      desc: "Standalone content (post, card).",
    },
    {
      el: "<section>",
      color: "#fb923c",
      pos: { top: 110, left: 32, right: 232, h: 130 },
      desc: "Thematic grouping with heading.",
    },
    {
      el: "<footer>",
      color: "#a78bfa",
      pos: { top: 304, left: 0, right: 0, h: 48 },
      desc: "Copyright, links, site info.",
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
        Semantic Layout — hover elements to learn their purpose
      </p>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div
          style={{
            flex: "1 1 240px",
            position: "relative",
            height: 360,
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          {sections.map((s, i) => (
            <div
              key={i}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                position: "absolute",
                top: s.pos.top,
                left: s.pos.left || 0,
                right: s.pos.right || 0,
                width: s.pos.w,
                height: s.pos.h,
                background: hov === i ? s.color + "40" : s.color + "18",
                border: `1.5px solid ${hov === i ? s.color : s.color + "60"}`,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "default",
                transition: "all 0.2s",
                zIndex: hov === i ? 10 : i,
              }}
            >
              <code
                style={{
                  color: s.color,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                {s.el}
              </code>
            </div>
          ))}
        </div>
        <div style={{ flex: "1 1 200px" }}>
          {sections.map((s, i) => (
            <div
              key={i}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                display: "flex",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 8,
                marginBottom: 4,
                background: hov === i ? s.color + "20" : "transparent",
                border: `1px solid ${hov === i ? s.color + "60" : "transparent"}`,
                cursor: "default",
                transition: "all 0.15s",
              }}
            >
              <code
                style={{
                  color: s.color,
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {s.el}
              </code>
              <span style={{ color: t.muted, fontSize: "0.76rem" }}>
                {s.desc}
              </span>
            </div>
          ))}
          <div
            style={{
              marginTop: 10,
              background: "#22d3ee15",
              border: "1px solid #22d3ee35",
              borderRadius: 8,
              padding: "10px 12px",
            }}
          >
            <div
              style={{
                color: "#22d3ee",
                fontSize: "0.78rem",
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              Why semantic HTML?
            </div>
            <div
              style={{ color: t.muted, fontSize: "0.73rem", lineHeight: 1.6 }}
            >
              ✓ Better SEO rankings
              <br />✓ Accessibility (screen readers)
              <br />✓ Easier to maintain & read
              <br />✓ Browser default styles
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ DEMO 6: Forms ════════════════════════════════════════════ */
function FormsDemo({ t }) {
  const [val, setVal] = useState("");
  const [sel, setSel] = useState("option1");
  const [radio, setRadio] = useState("a");
  const [check, setCheck] = useState(true);
  const [range, setRange] = useState(65);
  const [color, setColor] = useState("#22d3ee");
  const inputs = [
    { type: "text", label: "Text", placeholder: "Enter text..." },
    { type: "email", label: "Email", placeholder: "you@example.com" },
    { type: "password", label: "Password", placeholder: "••••••••" },
    { type: "number", label: "Number", placeholder: "42" },
    { type: "date", label: "Date" },
    { type: "search", label: "Search", placeholder: "Search..." },
    { type: "url", label: "URL", placeholder: "https://" },
    { type: "tel", label: "Phone", placeholder: "+1 234 567" },
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
        All HTML Form Controls — live & interactive
      </p>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 220px" }}>
          <div
            style={{
              color: t.muted,
              fontSize: "0.72rem",
              fontWeight: 700,
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Input types
          </div>
          {inputs.map((inp) => (
            <div key={inp.type} style={{ marginBottom: 8 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.72rem",
                  color: t.muted,
                  marginBottom: 2,
                }}
              >
                {inp.label}{" "}
                <code style={{ color: t.accent }}>type="{inp.type}"</code>
              </label>
              <input
                type={inp.type}
                placeholder={inp.placeholder}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "6px 10px",
                  background: t.surface,
                  border: `1px solid ${t.border}`,
                  borderRadius: 7,
                  color: t.text,
                  fontSize: "0.8rem",
                  outline: "none",
                }}
              />
            </div>
          ))}
        </div>
        <div style={{ flex: "1 1 220px" }}>
          <div
            style={{
              color: t.muted,
              fontSize: "0.72rem",
              fontWeight: 700,
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Other controls
          </div>
          <div style={{ marginBottom: 10 }}>
            <label
              style={{
                display: "block",
                fontSize: "0.72rem",
                color: t.muted,
                marginBottom: 2,
              }}
            >
              Textarea
            </label>
            <textarea
              placeholder="Multi-line text..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "6px 10px",
                background: t.surface,
                border: `1px solid ${t.border}`,
                borderRadius: 7,
                color: t.text,
                fontSize: "0.8rem",
                outline: "none",
                resize: "vertical",
                minHeight: 60,
              }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label
              style={{
                display: "block",
                fontSize: "0.72rem",
                color: t.muted,
                marginBottom: 2,
              }}
            >
              Select dropdown
            </label>
            <select
              value={sel}
              onChange={(e) => setSel(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 10px",
                background: t.surface,
                border: `1px solid ${t.border}`,
                borderRadius: 7,
                color: t.text,
                fontSize: "0.8rem",
                outline: "none",
              }}
            >
              {["option1", "option2", "option3"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label
              style={{
                display: "block",
                fontSize: "0.72rem",
                color: t.muted,
                marginBottom: 4,
              }}
            >
              Radio buttons
            </label>
            <div style={{ display: "flex", gap: 12 }}>
              {["a", "b", "c"].map((v) => (
                <label
                  key={v}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    color: t.text,
                  }}
                >
                  <input
                    type="radio"
                    checked={radio === v}
                    onChange={() => setRadio(v)}
                    style={{ accentColor: t.accent }}
                  />{" "}
                  Option {v.toUpperCase()}
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                cursor: "pointer",
                fontSize: "0.8rem",
                color: t.text,
              }}
            >
              <input
                type="checkbox"
                checked={check}
                onChange={(e) => setCheck(e.target.checked)}
                style={{ accentColor: t.accent, width: 15, height: 15 }}
              />{" "}
              Checkbox control
            </label>
          </div>
          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.72rem",
                color: t.muted,
                marginBottom: 4,
              }}
            >
              <span>Range slider</span>
              <strong style={{ color: t.accent }}>{range}</strong>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={range}
              onChange={(e) => setRange(+e.target.value)}
              style={{ width: "100%", accentColor: t.accent }}
            />
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <label style={{ fontSize: "0.72rem", color: t.muted }}>
              Color picker:
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{
                width: 40,
                height: 30,
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            />
            <code style={{ color: t.accent, fontSize: "0.75rem" }}>
              {color}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ DEMO 7: CSS Selectors ════════════════════════════════════ */
function SelectorsDemo({ t }) {
  const [hov, setHov] = useState(null);
  const selectors = [
    {
      sel: "*",
      name: "Universal",
      example: "* { box-sizing: border-box; }",
      color: "#94a3b8",
    },
    {
      sel: "element",
      name: "Type",
      example: "p { color: red; }",
      color: "#22d3ee",
    },
    {
      sel: ".class",
      name: "Class",
      example: ".btn { padding: 8px; }",
      color: "#86efac",
    },
    {
      sel: "#id",
      name: "ID",
      example: "#header { height: 60px; }",
      color: "#fbbf24",
    },
    {
      sel: "A B",
      name: "Descendant",
      example: "nav a { color: white; }",
      color: "#c084fc",
    },
    {
      sel: "A > B",
      name: "Direct child",
      example: "ul > li { margin: 4px; }",
      color: "#f87171",
    },
    {
      sel: "A + B",
      name: "Adjacent sibling",
      example: "h2 + p { margin-top: 0; }",
      color: "#fb923c",
    },
    {
      sel: "A ~ B",
      name: "General sibling",
      example: "h2 ~ p { color: gray; }",
      color: "#a78bfa",
    },
    {
      sel: "[attr]",
      name: "Attribute",
      example: "[required] { border: red; }",
      color: "#34d399",
    },
    {
      sel: "[attr=val]",
      name: "Exact attr",
      example: '[type="email"] { ... }',
      color: "#22d3ee",
    },
    {
      sel: ":hover",
      name: "Pseudo-class",
      example: "a:hover { color: blue; }",
      color: "#f472b6",
    },
    {
      sel: "::before",
      name: "Pseudo-element",
      example: ".icon::before { content: ''; }",
      color: "#7dd3fc",
    },
    {
      sel: ":not()",
      name: "Negation",
      example: "li:not(:last-child) { ... }",
      color: "#fbbf24",
    },
    {
      sel: ":nth-child",
      name: "Nth-child",
      example: "tr:nth-child(2n) { ... }",
      color: "#86efac",
    },
    {
      sel: ":is()",
      name: "Is (matches any)",
      example: ":is(h1,h2,h3) { ... }",
      color: "#c084fc",
    },
    {
      sel: ":has()",
      name: "Has (parent sel)",
      example: "div:has(img) { ... }",
      color: "#f87171",
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
        CSS Selectors — hover each to see code example
      </p>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}
      >
        {selectors.map((s, i) => (
          <div
            key={i}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            style={{
              background: hov === i ? s.color + "30" : t.surface,
              border: `1px solid ${hov === i ? s.color + "70" : t.border}`,
              borderRadius: 9,
              padding: "7px 12px",
              cursor: "default",
              transition: "all 0.15s",
              minWidth: 110,
            }}
          >
            <code
              style={{
                color: hov === i ? s.color : t.accent,
                fontSize: "0.8rem",
                fontWeight: 700,
                display: "block",
                marginBottom: 2,
              }}
            >
              {s.sel}
            </code>
            <div style={{ color: t.muted, fontSize: "0.68rem" }}>{s.name}</div>
          </div>
        ))}
      </div>
      {hov !== null && (
        <div
          style={{
            background: "#05090d",
            border: `1px solid ${selectors[hov].color}50`,
            borderRadius: 10,
            padding: "12px 14px",
            animation: "fadeIn 0.15s ease",
          }}
        >
          <div
            style={{
              color: selectors[hov].color,
              fontWeight: 700,
              fontSize: "0.82rem",
              marginBottom: 6,
            }}
          >
            {selectors[hov].name} selector: <code>{selectors[hov].sel}</code>
          </div>
          <code
            style={{
              color: "#86efac",
              fontSize: "0.8rem",
              fontFamily: "monospace",
            }}
          >
            {selectors[hov].example}
          </code>
        </div>
      )}
      {hov === null && (
        <div
          style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: 10,
            padding: "12px 14px",
            textAlign: "center",
            color: t.muted,
            fontSize: "0.8rem",
          }}
        >
          👆 Hover a selector to see its syntax
        </div>
      )}
    </div>
  );
}

/* ══ DEMO 8: Box Model ════════════════════════════════════════ */
function BoxModelDemo({ t }) {
  const [margin, setMargin] = useState(20);
  const [border, setBorder] = useState(4);
  const [padding, setPadding] = useState(20);
  const [width] = useState(160);
  const [height] = useState(80);
  const total = width + padding * 2 + border * 2 + margin * 2;
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
        The CSS Box Model — drag sliders
      </p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 220px" }}>
          {[
            ["margin", "#fbbf24", margin, setMargin, 0, 40],
            ["border", "#f87171", border, setBorder, 0, 16],
            ["padding", "#86efac", padding, setPadding, 0, 40],
          ].map(([lbl, clr, val, set, min, max]) => (
            <div key={lbl} style={{ marginBottom: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <label
                  style={{
                    color: clr,
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    fontFamily: "monospace",
                  }}
                >
                  {lbl}
                </label>
                <span
                  style={{
                    color: t.text,
                    fontSize: "0.78rem",
                    fontFamily: "monospace",
                  }}
                >
                  {val}px
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                value={val}
                onChange={(e) => set(+e.target.value)}
                style={{ width: "100%", accentColor: clr }}
              />
            </div>
          ))}
          <div
            style={{
              marginTop: 10,
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: 8,
              padding: "10px 12px",
            }}
          >
            <div
              style={{ color: t.muted, fontSize: "0.72rem", marginBottom: 4 }}
            >
              Total computed width:
            </div>
            <div
              style={{
                color: t.accent,
                fontWeight: 700,
                fontFamily: "monospace",
                fontSize: "0.9rem",
              }}
            >
              {total}px
            </div>
            <div style={{ color: t.muted, fontSize: "0.68rem", marginTop: 4 }}>
              {width} + {padding * 2} pad + {border * 2} brd + {margin * 2} mar
            </div>
          </div>
          <div
            style={{
              marginTop: 8,
              background: "#22d3ee15",
              border: "1px solid #22d3ee35",
              borderRadius: 8,
              padding: "8px 12px",
            }}
          >
            <code style={{ color: "#22d3ee", fontSize: "0.75rem" }}>
              box-sizing: border-box
            </code>
            <div style={{ color: t.muted, fontSize: "0.72rem", marginTop: 3 }}>
              Makes width include padding + border — use on everything!
            </div>
          </div>
        </div>
        <div
          style={{
            flex: "1 1 200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Box model visualizer */}
          <div
            style={{
              position: "relative",
              background: "#fbbf2420",
              border: `${margin}px solid #fbbf2430`,
              borderRadius: 4,
              transition: "all 0.2s",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -margin,
                left: -margin,
                fontSize: "0.6rem",
                color: "#fbbf24",
                fontWeight: 700,
                fontFamily: "monospace",
              }}
            >
              margin
            </div>
            <div
              style={{
                background: "#f8717120",
                border: `${border}px solid #f87171`,
                borderRadius: 3,
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  position: "relative",
                  background: "#86efac20",
                  padding: padding,
                  borderRadius: 2,
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: 2,
                    fontSize: "0.6rem",
                    color: "#86efac",
                    fontWeight: 700,
                    fontFamily: "monospace",
                  }}
                >
                  pad
                </div>
                <div
                  style={{
                    width,
                    height,
                    background: t.accentBg,
                    border: `1px solid ${t.accentBorder}`,
                    borderRadius: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      color: t.accent,
                      fontSize: "0.72rem",
                      fontWeight: 700,
                    }}
                  >
                    content
                  </div>
                  <div style={{ color: t.muted, fontSize: "0.65rem" }}>
                    {width}×{height}px
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ DEMO 9: Flexbox ══════════════════════════════════════════ */
function FlexboxDemo({ t }) {
  const [jc, setJc] = useState("center");
  const [ai, setAi] = useState("center");
  const [fd, setFd] = useState("row");
  const [fw, setFw] = useState("nowrap");
  const [gap, setGap] = useState(12);
  const jcOpts = [
    "flex-start",
    "center",
    "flex-end",
    "space-between",
    "space-around",
    "space-evenly",
  ];
  const aiOpts = ["flex-start", "center", "flex-end", "stretch", "baseline"];
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
        CSS Flexbox Playground — live controls
      </p>
      <div
        style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 14 }}
      >
        {[
          { label: "justify-content", val: jc, set: setJc, opts: jcOpts },
          { label: "align-items", val: ai, set: setAi, opts: aiOpts },
          {
            label: "flex-direction",
            val: fd,
            set: setFd,
            opts: ["row", "column", "row-reverse", "column-reverse"],
          },
          {
            label: "flex-wrap",
            val: fw,
            set: setFw,
            opts: ["nowrap", "wrap", "wrap-reverse"],
          },
        ].map(({ label, val, set, opts }) => (
          <div key={label}>
            <code
              style={{
                display: "block",
                color: t.muted,
                fontSize: "0.7rem",
                marginBottom: 4,
              }}
            >
              {label}
            </code>
            <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              {opts.map((o) => (
                <button
                  key={o}
                  onClick={() => set(o)}
                  style={{
                    background: val === o ? t.accentBg : t.surface,
                    color: val === o ? t.accent : t.muted,
                    border: `1px solid ${val === o ? t.accentBorder : t.border}`,
                    borderRadius: 5,
                    padding: "3px 8px",
                    cursor: "pointer",
                    fontSize: "0.7rem",
                    fontFamily: "monospace",
                  }}
                >
                  {o.replace("flex-", "").replace("space-", "")}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div>
          <code
            style={{
              display: "block",
              color: t.muted,
              fontSize: "0.7rem",
              marginBottom: 4,
            }}
          >
            gap
          </code>
          <input
            type="range"
            min={0}
            max={30}
            value={gap}
            onChange={(e) => setGap(+e.target.value)}
            style={{ width: 80, accentColor: t.accent }}
          />{" "}
          <span
            style={{
              fontSize: "0.72rem",
              color: t.text,
              fontFamily: "monospace",
            }}
          >
            {gap}px
          </span>
        </div>
      </div>
      <div
        style={{
          background: t.surface,
          border: `2px dashed ${t.border}`,
          borderRadius: 10,
          padding: 16,
          minHeight: 110,
          display: "flex",
          justifyContent: jc,
          alignItems: ai,
          flexDirection: fd,
          flexWrap: fw,
          gap,
          transition: "all 0.3s",
        }}
      >
        {["A", "B", "C", "D"].map((l, i) => (
          <div
            key={l}
            style={{
              background: ["#22d3ee30", "#86efac30", "#c084fc30", "#fbbf2430"][
                i
              ],
              border: `1px solid ${["#22d3ee", "#86efac", "#c084fc", "#fbbf24"][i]}60`,
              borderRadius: 8,
              width: ["50px", "60px", "40px", "55px"][i],
              height: ["50px", "65px", "45px", "55px"][i],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              color: ["#22d3ee", "#86efac", "#c084fc", "#fbbf24"][i],
              fontSize: "1rem",
              flexShrink: 0,
            }}
          >
            {l}
          </div>
        ))}
      </div>
      <code
        style={{
          display: "block",
          marginTop: 8,
          color: t.muted,
          fontSize: "0.72rem",
        }}
      >
        display:flex; justify-content:{jc}; align-items:{ai}; flex-direction:
        {fd}; flex-wrap:{fw}; gap:{gap}px
      </code>
    </div>
  );
}

/* ══ DEMO 10: CSS Grid ════════════════════════════════════════ */
function GridDemo({ t }) {
  const [cols, setCols] = useState("1fr 1fr 1fr");
  const [rows, setRows] = useState("auto");
  const [gap, setGap] = useState(10);
  const templates = [
    "1fr 1fr",
    "1fr 1fr 1fr",
    "1fr 2fr 1fr",
    "repeat(4, 1fr)",
    "200px 1fr",
    "1fr 1fr 1fr 1fr",
  ];
  const items = [
    { label: "A", span: "1/3", color: "#22d3ee" },
    { label: "B", span: "auto", color: "#86efac" },
    { label: "C", span: "auto", color: "#c084fc" },
    { label: "D", span: "auto", color: "#fbbf24" },
    { label: "E", span: "auto", color: "#f87171" },
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
        CSS Grid Playground — pick a column template
      </p>
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}
      >
        {templates.map((tmpl) => (
          <button
            key={tmpl}
            onClick={() => setCols(tmpl)}
            style={{
              background: cols === tmpl ? t.accentBg : t.surface,
              color: cols === tmpl ? t.accent : t.muted,
              border: `1px solid ${cols === tmpl ? t.accentBorder : t.border}`,
              borderRadius: 6,
              padding: "4px 10px",
              cursor: "pointer",
              fontSize: "0.72rem",
              fontFamily: "monospace",
              fontWeight: 700,
            }}
          >
            {tmpl}
          </button>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: "0.72rem", color: t.muted }}>gap:</span>
          <input
            type="range"
            min={0}
            max={24}
            value={gap}
            onChange={(e) => setGap(+e.target.value)}
            style={{ width: 60, accentColor: t.accent }}
          />
          <span
            style={{
              fontSize: "0.72rem",
              color: t.text,
              fontFamily: "monospace",
            }}
          >
            {gap}px
          </span>
        </div>
      </div>
      <div
        style={{
          background: t.surface,
          border: `2px dashed ${t.border}`,
          borderRadius: 10,
          padding: 12,
          marginBottom: 10,
          display: "grid",
          gridTemplateColumns: cols,
          gap,
          transition: "all 0.3s",
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              gridColumn: i === 0 ? item.span : "auto",
              background: item.color + "25",
              border: `1px solid ${item.color}55`,
              borderRadius: 7,
              padding: "12px 8px",
              textAlign: "center",
              fontWeight: 900,
              color: item.color,
              fontSize: "1rem",
              minHeight: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              transition: "all 0.3s",
            }}
          >
            {item.label}
            {i === 0 && (
              <div
                style={{
                  fontSize: "0.62rem",
                  fontWeight: 400,
                  color: item.color + "bb",
                  marginTop: 3,
                }}
              >
                grid-column: 1/3
              </div>
            )}
          </div>
        ))}
      </div>
      <code style={{ display: "block", color: t.muted, fontSize: "0.72rem" }}>
        grid-template-columns: {cols}; gap: {gap}px;
      </code>
    </div>
  );
}

/* ══ DEMO 11: CSS Variables ═══════════════════════════════════ */
function CSSVarsDemo({ t }) {
  const [primary, setPrimary] = useState("#22d3ee");
  const [radius, setRadius] = useState(10);
  const [shadow, setShadow] = useState(20);
  const hex2rgb = (h) => {
    const r = parseInt(h.slice(1, 3), 16),
      g = parseInt(h.slice(3, 5), 16),
      b = parseInt(h.slice(5, 7), 16);
    return `${r},${g},${b}`;
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
        CSS Custom Properties (Variables) — edit :root and watch everything
        update
      </p>
      <div
        style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 16 }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: "0.82rem",
            color: t.muted,
          }}
        >
          <code style={{ color: t.accent }}>--primary:</code>
          <input
            type="color"
            value={primary}
            onChange={(e) => setPrimary(e.target.value)}
            style={{
              width: 40,
              height: 28,
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
            }}
          />
          <span
            style={{
              color: t.text,
              fontFamily: "monospace",
              fontSize: "0.75rem",
            }}
          >
            {primary}
          </span>
        </label>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: "0.82rem",
            color: t.muted,
          }}
        >
          <code style={{ color: t.accent }}>--radius:</code>
          <input
            type="range"
            min={0}
            max={24}
            value={radius}
            onChange={(e) => setRadius(+e.target.value)}
            style={{ width: 70, accentColor: primary }}
          />
          <span
            style={{
              color: t.text,
              fontFamily: "monospace",
              fontSize: "0.75rem",
            }}
          >
            {radius}px
          </span>
        </label>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: "0.82rem",
            color: t.muted,
          }}
        >
          <code style={{ color: t.accent }}>--shadow:</code>
          <input
            type="range"
            min={0}
            max={50}
            value={shadow}
            onChange={(e) => setShadow(+e.target.value)}
            style={{ width: 70, accentColor: primary }}
          />
          <span
            style={{
              color: t.text,
              fontFamily: "monospace",
              fontSize: "0.75rem",
            }}
          >
            {shadow}
          </span>
        </label>
      </div>
      <div
        style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}
      >
        <button
          style={{
            background: primary,
            color: "#000",
            border: "none",
            borderRadius: radius,
            padding: "9px 20px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.88rem",
            boxShadow: `0 ${shadow / 3}px ${shadow}px ${primary}60`,
            transition: "all 0.3s",
          }}
        >
          Primary Button
        </button>
        <button
          style={{
            background: "transparent",
            color: primary,
            border: `2px solid ${primary}`,
            borderRadius: radius,
            padding: "8px 18px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.88rem",
            transition: "all 0.3s",
          }}
        >
          Outline Button
        </button>
        <div
          style={{
            flex: "1 1 180px",
            background: `rgba(${hex2rgb(primary)},0.12)`,
            border: `1px solid rgba(${hex2rgb(primary)},0.4)`,
            borderRadius: radius + 2,
            padding: "12px 16px",
            boxShadow: `0 ${shadow / 4}px ${shadow}px rgba(0,0,0,0.3)`,
            transition: "all 0.3s",
          }}
        >
          <div style={{ color: primary, fontWeight: 700, fontSize: "0.88rem" }}>
            Theme Card
          </div>
          <div style={{ color: t.muted, fontSize: "0.78rem", marginTop: 3 }}>
            All values from --primary
          </div>
        </div>
      </div>
      <pre
        style={{
          margin: 0,
          background: "#05090d",
          border: `1px solid ${t.border}`,
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: "0.76rem",
          color: "#86efac",
          fontFamily: "monospace",
          overflow: "auto",
        }}
      >
        {`:root {
  --primary:    ${primary};
  --primary-rgb: ${hex2rgb(primary)};
  --radius:     ${radius}px;
  --shadow-blur:${shadow}px;
}

/* Usage */
.btn { background: var(--primary); border-radius: var(--radius); }
.glow { box-shadow: 0 0 var(--shadow-blur) rgba(var(--primary-rgb), 0.4); }`}
      </pre>
    </div>
  );
}

/* ══ DEMO 12: Animations & Transitions ═══════════════════════ */
function AnimationsDemo({ t }) {
  const [play, setPlay] = useState(true);
  const [sel, setSel] = useState(0);
  const [transVal, setTransVal] = useState(0);
  const anims = [
    {
      name: "Fade In",
      keyframe: "fadeInAnim",
      css: "opacity:0→1",
      desc: "opacity",
    },
    {
      name: "Slide Up",
      keyframe: "slideUpAnim",
      css: "translateY(20px)→0",
      desc: "transform",
    },
    {
      name: "Scale Pop",
      keyframe: "scalePopAnim",
      css: "scale(0.5)→1→1.05→1",
      desc: "transform",
    },
    {
      name: "Spin",
      keyframe: "spinAnim",
      css: "rotate(0)→360deg",
      desc: "transform",
    },
    {
      name: "Pulse Glow",
      keyframe: "pulseGlowAnim",
      css: "shadow expand/contract",
      desc: "box-shadow",
    },
    {
      name: "Bounce",
      keyframe: "bounceAnim",
      css: "translateY oscillate",
      desc: "transform",
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
      <style>{`
        @keyframes fadeInAnim{from{opacity:0}to{opacity:1}}
        @keyframes slideUpAnim{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        @keyframes scalePopAnim{0%{transform:scale(0.5)}70%{transform:scale(1.08)}100%{transform:scale(1)}}
        @keyframes spinAnim{to{transform:rotate(360deg)}}
        @keyframes pulseGlowAnim{0%,100%{box-shadow:0 0 8px #22d3ee60}50%{box-shadow:0 0 30px #22d3eecc}}
        @keyframes bounceAnim{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
      `}</style>
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
        CSS Animations & Transitions — pick & play
      </p>
      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          marginBottom: 14,
          alignItems: "center",
        }}
      >
        {anims.map((a, i) => (
          <button
            key={i}
            onClick={() => setSel(i)}
            style={{
              background: sel === i ? t.accentBg : t.surface,
              color: sel === i ? t.accent : t.muted,
              border: `1px solid ${sel === i ? t.accentBorder : t.border}`,
              borderRadius: 7,
              padding: "5px 12px",
              cursor: "pointer",
              fontSize: "0.78rem",
              fontWeight: 700,
            }}
          >
            {a.name}
          </button>
        ))}
        <button
          onClick={() => setPlay((p) => !p)}
          style={{
            marginLeft: "auto",
            background: play ? "#f8717120" : "#86efac20",
            color: play ? "#f87171" : "#86efac",
            border: `1px solid ${play ? "#f8717145" : "#86efac45"}`,
            borderRadius: 7,
            padding: "5px 12px",
            cursor: "pointer",
            fontSize: "0.78rem",
            fontWeight: 700,
          }}
        >
          {play ? "⏸ Pause" : "▶ Play"}
        </button>
      </div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div
          style={{
            flex: "1 1 180px",
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: 10,
            minHeight: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            key={`${sel}-${play}`}
            style={{
              width: 70,
              height: 70,
              background: `linear-gradient(135deg,${t.accent},#c084fc)`,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.8rem",
              animation: play
                ? `${anims[sel].keyframe} 1.2s ease ${sel === 3 ? "infinite" : "forwards"} ${sel === 4 || sel === 5 ? "infinite" : ""}`
                : "none",
            }}
          >
            {["✨", "🚀", "💥", "⚙️", "💫", "🏀"][sel]}
          </div>
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                color: t.muted,
                fontSize: "0.72rem",
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              TRANSITION — hover the box:
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                ["All", "all"],
                ["Transform", "transform"],
                ["Colors", "background-color"],
              ].map(([lbl, prop]) => (
                <div
                  key={prop}
                  onMouseEnter={() => setTransVal(1)}
                  onMouseLeave={() => setTransVal(0)}
                  style={{
                    flex: 1,
                    background: transVal ? t.accentBg : t.surface,
                    border: `1px solid ${transVal ? t.accentBorder : t.border}`,
                    borderRadius: 8,
                    padding: "8px 4px",
                    textAlign: "center",
                    fontSize: "0.72rem",
                    color: transVal ? t.accent : t.muted,
                    cursor: "default",
                    transition: `${prop} 0.4s ease`,
                    transform:
                      prop === "transform" && transVal ? "scale(1.06)" : "none",
                  }}
                >
                  {lbl}
                </div>
              ))}
            </div>
          </div>
          <pre
            style={{
              margin: 0,
              background: "#05090d",
              border: `1px solid ${t.border}`,
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: "0.73rem",
              color: "#22d3ee",
              fontFamily: "monospace",
              overflow: "auto",
            }}
          >
            {`/* Transition */
.btn {
  transition: all 0.3s ease;
  /* or specific: */
  transition: background 0.2s,
              transform 0.3s cubic-bezier(.34,1.56,.64,1);
}

/* Animation */
@keyframes ${anims[sel].keyframe} {
  /* ${anims[sel].css} */
}
.el {
  animation: ${anims[sel].keyframe} 1.2s ease;
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ══ DEMO 13: Responsive / Media Queries ══════════════════════ */
function ResponsiveDemo({ t }) {
  const [width, setWidth] = useState(900);
  const bp =
    width < 480 ? "xs" : width < 768 ? "sm" : width < 1024 ? "md" : "lg";
  const bpColor = {
    xs: "#f87171",
    sm: "#fbbf24",
    md: "#86efac",
    lg: "#22d3ee",
  }[bp];
  const cols = { xs: 1, sm: 2, md: 3, lg: 4 }[bp];
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
        Media Queries — drag to simulate viewport width
      </p>
      <div style={{ marginBottom: 14 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <span style={{ fontSize: "0.78rem", color: t.muted }}>
            Viewport width
          </span>
          <strong
            style={{
              color: bpColor,
              fontFamily: "monospace",
              fontSize: "0.82rem",
            }}
          >
            {width}px — {bp.toUpperCase()}
          </strong>
        </div>
        <input
          type="range"
          min={320}
          max={1280}
          value={width}
          onChange={(e) => setWidth(+e.target.value)}
          style={{ width: "100%", accentColor: bpColor }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.65rem",
            color: t.muted,
            marginTop: 3,
            fontFamily: "monospace",
          }}
        >
          <span>
            320
            <br />
            xs
          </span>
          <span>
            480
            <br />
            sm
          </span>
          <span>
            768
            <br />
            md
          </span>
          <span>
            1024
            <br />
            lg
          </span>
          <span>1280</span>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols},1fr)`,
          gap: 8,
          marginBottom: 12,
          transition: "all 0.4s",
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: `hsl(${180 + i * 30},60%,${t.bg === "#070b0f" ? 25 : 60}%)`,
              borderRadius: 8,
              padding: "12px 8px",
              textAlign: "center",
              color: "white",
              fontWeight: 700,
              fontSize: "0.8rem",
              transition: "all 0.4s",
            }}
          >
            Card {i + 1}
          </div>
        ))}
      </div>
      <div
        style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}
      >
        {[
          ["xs", "<480px", "#f87171"],
          ["sm", "480-768px", "#fbbf24"],
          ["md", "768-1024px", "#86efac"],
          ["lg", "≥1024px", "#22d3ee"],
        ].map(([b, r, c]) => (
          <div
            key={b}
            style={{
              flex: "1 1 80px",
              background: bp === b ? c + "30" : t.surface,
              border: `1px solid ${bp === b ? c + "70" : t.border}`,
              borderRadius: 7,
              padding: "6px 10px",
              textAlign: "center",
              transition: "all 0.3s",
            }}
          >
            <div
              style={{
                color: bp === b ? c : t.muted,
                fontWeight: 700,
                fontSize: "0.8rem",
              }}
            >
              {b.toUpperCase()}
            </div>
            <div style={{ color: t.muted, fontSize: "0.65rem" }}>{r}</div>
            <div
              style={{
                color: bp === b ? c : t.muted,
                fontSize: "0.65rem",
                fontFamily: "monospace",
              }}
            >
              {["1", "2", "3", "4"][["xs", "sm", "md", "lg"].indexOf(b)]} col
            </div>
          </div>
        ))}
      </div>
      <pre
        style={{
          margin: 0,
          background: "#05090d",
          border: `1px solid ${t.border}`,
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: "0.73rem",
          color: "#86efac",
          fontFamily: "monospace",
          overflow: "auto",
        }}
      >
        {`/* Mobile-first (recommended) */
.grid { grid-template-columns: 1fr; }         /* xs default */

@media (min-width: 480px) {
  .grid { grid-template-columns: repeat(2,1fr); } /* sm */
}
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(3,1fr); } /* md */
}
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(4,1fr); } /* lg */
}`}
      </pre>
    </div>
  );
}
/* ══ DEMO 14: Tables ══════════════════════════════════════════ */
function TablesDemo({ t }) {
  const [stripe, setStripe] = useState(true);
  const [hover, setHover] = useState(true);
  const [bordered, setBordered] = useState(false);
  const [hovRow, setHovRow] = useState(null);
  const rows = [
    ["Alice Johnson", "Frontend Dev", "React, CSS", "$95k"],
    ["Bob Smith", "Backend Dev", "Node, Go", "$105k"],
    ["Carol White", "Designer", "Figma, CSS", "$88k"],
    ["Dan Brown", "DevOps", "Docker, K8s", "$115k"],
    ["Eve Davis", "Full Stack", "Vue, Python", "$98k"],
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
        HTML Tables — semantic structure + CSS styling
      </p>
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}
      >
        {[
          ["Striped", stripe, setStripe],
          ["Row Hover", hover, setHover],
          ["Bordered", bordered, setBordered],
        ].map(([lbl, val, set]) => (
          <button
            key={lbl}
            onClick={() => set((v) => !v)}
            style={{
              background: val ? t.accentBg : t.surface,
              color: val ? t.accent : t.muted,
              border: `1px solid ${val ? t.accentBorder : t.border}`,
              borderRadius: 7,
              padding: "5px 12px",
              cursor: "pointer",
              fontSize: "0.78rem",
              fontWeight: 700,
            }}
          >
            {val ? "✓ " : ""}
            {lbl}
          </button>
        ))}
      </div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.82rem",
          }}
        >
          <thead>
            <tr>
              {["Name", "Role", "Skills", "Salary"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    color: t.accent,
                    fontWeight: 700,
                    borderBottom: `2px solid ${t.accentBorder}`,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    background: t.surface,
                    borderRight: bordered ? `1px solid ${t.border}` : "none",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                onMouseEnter={() => setHovRow(i)}
                onMouseLeave={() => setHovRow(null)}
                style={{
                  background:
                    hovRow === i && hover
                      ? t.accentBg
                      : stripe && i % 2 === 1
                        ? t.surface2
                        : t.surface,
                  transition: "background 0.15s",
                }}
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    style={{
                      padding: "9px 12px",
                      color: j === 0 ? t.text : t.muted,
                      borderBottom: `1px solid ${t.border}`,
                      fontWeight: j === 0 ? 600 : 400,
                      borderRight: bordered ? `1px solid ${t.border}` : "none",
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={3}
                style={{
                  padding: "8px 12px",
                  color: t.muted,
                  fontSize: "0.75rem",
                  borderTop: `2px solid ${t.border}`,
                  background: t.surface,
                }}
              >
                {rows.length} employees
              </td>
              <td
                style={{
                  padding: "8px 12px",
                  color: t.accent,
                  fontWeight: 700,
                  borderTop: `2px solid ${t.border}`,
                  background: t.surface,
                }}
              >
                Avg: $100.2k
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

/* ══ DEMO 15: CSS Specificity ═════════════════════════════════ */
function SpecificityDemo({ t }) {
  const [sel, setSel] = useState(null);
  const rules = [
    {
      sel: "*",
      score: "0-0-0-0",
      weight: 0,
      color: "#94a3b8",
      desc: "Universal selector — no specificity",
    },
    {
      sel: "p, div, h1",
      score: "0-0-0-1",
      weight: 1,
      color: "#22d3ee",
      desc: "Element / pseudo-element (+1 per element)",
    },
    {
      sel: ".class, :hover",
      score: "0-0-1-0",
      weight: 10,
      color: "#86efac",
      desc: "Class / attribute / pseudo-class (+10)",
    },
    {
      sel: "#id",
      score: "0-1-0-0",
      weight: 100,
      color: "#fbbf24",
      desc: "ID selector (+100)",
    },
    {
      sel: 'style=""',
      score: "1-0-0-0",
      weight: 1000,
      color: "#f87171",
      desc: "Inline style (+1000)",
    },
    {
      sel: "!important",
      score: "∞",
      weight: 10000,
      color: "#c084fc",
      desc: "Overrides everything (use sparingly!)",
    },
  ];
  const examples = [
    { css: "p { color: blue }", score: 1, color: "#22d3ee" },
    { css: ".text { color: green }", score: 10, color: "#86efac" },
    { css: "p.text { color: orange }", score: 11, color: "#fbbf24" },
    { css: "#hero p.text { color: red }", score: 111, color: "#f87171" },
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
        CSS Specificity — understanding the cascade
      </p>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}
      >
        {rules.map((r, i) => (
          <div
            key={i}
            onMouseEnter={() => setSel(i)}
            onMouseLeave={() => setSel(null)}
            style={{
              background: sel === i ? r.color + "30" : t.surface,
              border: `1px solid ${sel === i ? r.color + "70" : t.border}`,
              borderRadius: 9,
              padding: "8px 12px",
              cursor: "default",
              transition: "all 0.15s",
              flex: "1 1 140px",
            }}
          >
            <code
              style={{
                color: sel === i ? r.color : t.accent,
                fontSize: "0.82rem",
                fontWeight: 700,
                display: "block",
                marginBottom: 3,
              }}
            >
              {r.sel}
            </code>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 3,
              }}
            >
              <div
                style={{
                  height: 5,
                  width: `${Math.min((r.weight / 100) * 60, 120)}px`,
                  background: r.color,
                  borderRadius: 99,
                  transition: "width 0.3s",
                }}
              />
              <span
                style={{
                  color: r.color,
                  fontSize: "0.72rem",
                  fontFamily: "monospace",
                  fontWeight: 700,
                }}
              >
                {r.score}
              </span>
            </div>
            <div style={{ color: t.muted, fontSize: "0.68rem" }}>{r.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 4 }}>
        <div
          style={{
            color: t.muted,
            fontSize: "0.72rem",
            fontWeight: 700,
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Specificity conflicts — last rule wins when equal:
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {examples.map((ex, i) => (
            <div
              key={i}
              style={{
                flex: "1 1 160px",
                background: t.surface,
                border: `1px solid ${t.border}`,
                borderRadius: 8,
                padding: "8px 12px",
              }}
            >
              <code
                style={{
                  color: ex.color,
                  fontSize: "0.72rem",
                  display: "block",
                  marginBottom: 5,
                  lineHeight: 1.5,
                }}
              >
                {ex.css}
              </code>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    height: 6,
                    width: `${Math.min((ex.score / 111) * 100, 100)}%`,
                    background: ex.color,
                    borderRadius: 99,
                    flex: 1,
                  }}
                />
                <span
                  style={{
                    color: ex.color,
                    fontFamily: "monospace",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {ex.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══ SECTIONS ═════════════════════════════════════════════════ */
const SECTIONS = [
  {
    id: "intro",
    icon: "🌐",
    title: "What is HTML?",
    subtitle: "The skeleton of every webpage — structure & content",
    Demo: IntroDemo,
    body: "HTML (HyperText Markup Language) is the standard language for creating web pages. It uses tags to define the structure and meaning of content. Every website you visit is built with HTML at its core. HTML is not a programming language — it's a markup language that tells browsers how to structure content.",
    code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Page description for SEO">
    <title>My First Webpage</title>
    <link rel="stylesheet" href="style.css">
    <link rel="icon" href="favicon.ico">
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>This is a paragraph.</p>
    <script src="script.js"></script>
  </body>
</html>`,
    tip: "Always include charset=UTF-8 and the viewport meta tag. Without viewport, your site will look tiny on mobile devices.",
  },

  {
    id: "block",
    icon: "🔲",
    title: "Block Elements",
    subtitle: "Full list of all 41 HTML block-level elements",
    Demo: BlockElementsDemo,
    body: "Block-level elements take up the full width available, starting on a new line and ending with a line break. They can contain other block elements and inline elements. The most important block elements are structural (div, section, article) and semantic (header, main, nav, footer). There are 41 block elements in HTML.",
    code: `<!-- Structural block elements -->
<div class="container">        <!-- Generic block wrapper -->
  <header>Site header</header> <!-- Page/section header -->
  <nav>Navigation</nav>        <!-- Navigation links -->
  <main>                       <!-- Main content (only one!) -->
    <article>                  <!-- Standalone content -->
      <h1>Heading 1</h1>      <!-- h1 through h6 are block -->
      <p>A paragraph.</p>     <!-- Block text container -->
      <ul>                    <!-- Unordered list (block) -->
        <li>List item</li>    <!-- li is block-level -->
      </ul>
      <blockquote>            <!-- Long quotation -->
        "A famous quote."
      </blockquote>
    </article>
    <section>Thematic group</section>
    <figure>
      <img src="img.jpg" alt="...">
      <figcaption>Caption</figcaption>
    </figure>
  </main>
  <aside>Sidebar</aside>
  <footer>Site footer</footer>
</div>
<hr>                           <!-- Horizontal rule -->
<pre>Preformatted text</pre>  <!-- Preserves whitespace -->`,
    tip: "Use semantic block elements (article, section, aside) instead of generic divs. Screen readers and search engines understand semantic HTML far better.",
  },

  {
    id: "inline",
    icon: "📝",
    title: "Inline Elements",
    subtitle: "Full list of all 39 HTML inline (non-block) elements",
    Demo: InlineElementsDemo,
    body: "Inline elements do not start on a new line — they flow within the text around them. They only take up as much width as their content needs. Inline elements should only contain other inline elements (not block elements). There are 39 inline elements in HTML, with 3 now deprecated.",
    code: `<!-- Common inline elements -->
<p>
  Visit <a href="https://example.com">this link</a>.
  Use <strong>strong</strong> for importance,
  <em>em</em> for emphasis.
  This is <code>inline code</code>.
  Press <kbd>Ctrl+C</kbd> to copy.
  H<sub>2</sub>O and E=mc<sup>2</sup>.
  This is <mark>highlighted</mark> text.
  <span class="custom">Styled span</span>.
  <abbr title="HyperText Markup Language">HTML</abbr>.
  <time datetime="2024-01-01">New Year's Day</time>.
</p>

<!-- Inline replaced elements (have intrinsic size) -->
<img src="photo.jpg" alt="A photo" width="200">
<input type="text" placeholder="Inline input">
<button>Click me</button>
<select><option>Dropdown</option></select>
<progress value="70" max="100"></progress>
<meter value="0.6">60%</meter>`,
    tip: "<img>, <input>, <button> and <select> are 'replaced elements' — inline but they accept width/height because their content is external or browser-controlled.",
  },

  {
    id: "blockvsinline",
    icon: "↔️",
    title: "Block vs Inline vs Inline-Block",
    subtitle: "How display type controls element flow",
    Demo: BlockVsInlineDemo,
    body: "Every HTML element has a default display type that determines how it flows in the document. Block elements stack vertically and take full width. Inline elements flow horizontally within text. Inline-block is the best of both — flows inline but respects width and padding like a block.",
    code: `/* CSS display values */
.element {
  display: block;         /* Full width, new line each time */
  display: inline;        /* Flows in text, no width/height */
  display: inline-block;  /* Inline flow + block sizing */
  display: flex;          /* Block container, flex children */
  display: inline-flex;   /* Inline container, flex children */
  display: grid;          /* Block container, grid children */
  display: inline-grid;   /* Inline container, grid children */
  display: none;          /* Removed from layout entirely */
  display: contents;      /* Children act as direct children of parent */
}

/* Change any element's display type */
span { display: block; }       /* Make inline element block */
div  { display: inline; }      /* Make block element inline */
li   { display: inline-block; } /* Horizontal nav items */
img  { display: block; margin: 0 auto; } /* Center images */`,
    tip: "display:none removes the element from layout (takes no space). visibility:hidden hides it but keeps the space. opacity:0 makes it invisible but still interactive.",
  },

  {
    id: "semantic",
    icon: "🏗️",
    title: "Semantic HTML",
    subtitle: "Meaningful elements that describe content purpose",
    Demo: SemanticDemo,
    body: "Semantic HTML uses meaningful tags that describe the purpose of content, not just how it looks. Instead of <div id='header'>, use <header>. Semantic elements improve SEO (Google understands your content structure), accessibility (screen readers navigate by landmarks), and code maintainability.",
    code: `<!-- ❌ Non-semantic (meaningless divs) -->
<div id="header">
  <div id="nav">...</div>
</div>
<div id="main">
  <div class="post">
    <div class="post-content">...</div>
  </div>
</div>
<div id="footer">...</div>

<!-- ✅ Semantic (meaningful structure) -->
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <header><h1>Post Title</h1></header>
    <section class="intro"><p>Opening...</p></section>
    <section class="content"><p>Main text...</p></section>
    <footer><p>Author: Alice</p></footer>
  </article>
  <aside><h2>Related Posts</h2></aside>
</main>
<footer><p>© 2024 My Site</p></footer>`,
    tip: "<article> is for standalone shareable content (blog posts, news items). <section> groups related content with a heading. <div> when no semantic meaning applies.",
  },

  {
    id: "forms",
    icon: "📋",
    title: "HTML Forms",
    subtitle: "All input types, controls, and validation attributes",
    Demo: FormsDemo,
    body: "HTML forms collect user input. The <form> element wraps controls and defines where/how data is submitted. HTML5 added many new input types (email, date, color, range) with built-in validation. Use proper labels for accessibility — always associate <label> with its <input>.",
    code: `<form action="/submit" method="POST" novalidate>
  <!-- Text inputs -->
  <label for="email">Email *</label>
  <input type="email" id="email" name="email"
    required placeholder="you@example.com"
    autocomplete="email">

  <!-- Textarea -->
  <label for="msg">Message</label>
  <textarea id="msg" name="message" rows="4"
    maxlength="500" placeholder="Your message...">
  </textarea>

  <!-- Select -->
  <label for="country">Country</label>
  <select id="country" name="country">
    <optgroup label="Americas">
      <option value="us">United States</option>
      <option value="ca">Canada</option>
    </optgroup>
  </select>

  <!-- Checkboxes and radios -->
  <fieldset>
    <legend>Preferred contact method</legend>
    <label><input type="radio" name="contact" value="email"> Email</label>
    <label><input type="radio" name="contact" value="phone"> Phone</label>
  </fieldset>

  <!-- HTML5 inputs -->
  <input type="date" name="dob">
  <input type="color" name="theme" value="#22d3ee">
  <input type="range" name="volume" min="0" max="100" step="5">
  <input type="file" name="avatar" accept="image/*">

  <button type="submit">Submit</button>
  <button type="reset">Reset</button>
</form>`,
    tip: "Always use <label for='id'> paired with <input id='id'>. Never rely on placeholder text as a label — it disappears when users type and fails accessibility.",
  },

  {
    id: "selectors",
    icon: "🎯",
    title: "CSS Selectors",
    subtitle: "Target elements precisely — 16 selector types",
    Demo: SelectorsDemo,
    body: "CSS selectors define which HTML elements a rule applies to. Mastering selectors eliminates most of the need for extra classes. Modern selectors like :is(), :has(), :where(), and :not() are incredibly powerful. Hover each selector in the demo to see examples.",
    code: `/* ── Type & Universal ── */
* { box-sizing: border-box; }
p { line-height: 1.6; }

/* ── Class & ID ── */
.btn { padding: 0.5rem 1rem; }
#main-nav { position: sticky; top: 0; }

/* ── Combinators ── */
nav a { color: white; }              /* Descendant */
ul > li { list-style: none; }        /* Direct child */
h2 + p { margin-top: 0; }            /* Adjacent sibling */
h2 ~ p { color: var(--muted); }      /* General sibling */

/* ── Attribute ── */
[disabled] { opacity: 0.5; }
[type="email"] { border-color: blue; }
[href^="https"] { /* starts with */ }
[href$=".pdf"] { /* ends with */ }

/* ── Pseudo-classes ── */
a:hover, a:focus { text-decoration: underline; }
li:nth-child(odd) { background: #f0f0f0; }
input:invalid { border-color: red; }
p:first-of-type { font-size: 1.2em; }

/* ── Pseudo-elements ── */
p::first-line { font-weight: bold; }
li::marker { color: blue; }
.tooltip::before { content: attr(data-tip); }

/* ── Modern selectors ── */
:is(h1, h2, h3) { font-family: serif; }
:not(.disabled) { cursor: pointer; }
.card:has(img) { padding-top: 0; }    /* Parent selector! */
:where(.nav, .menu) a { color: white; } /* 0 specificity */`,
    tip: ":has() is the long-awaited parent selector — finally arrived in all modern browsers. 'div:has(img)' styles the div that contains an img.",
  },

  {
    id: "boxmodel",
    icon: "📦",
    title: "The CSS Box Model",
    subtitle: "Margin, border, padding, content — how sizing works",
    Demo: BoxModelDemo,
    body: "Every HTML element is a rectangular box with four layers: content (inner width/height), padding (space inside the border), border (outline), and margin (space outside). Understanding the box model is essential to understanding CSS layout. Always use box-sizing: border-box.",
    code: `/* ── The Box Model ── */
.box {
  /* Content dimensions */
  width:  300px;
  height: 150px;

  /* Padding (space inside) */
  padding: 20px;              /* All sides */
  padding: 10px 20px;         /* Top/bottom | Left/right */
  padding: 10px 20px 15px 5px;/* Top Right Bottom Left */

  /* Border */
  border: 2px solid #22d3ee;
  border-radius: 8px;
  border-top: 3px dashed red;

  /* Margin (space outside) */
  margin: 0 auto;    /* Center block element */
  margin-top: 20px;
}

/* ── box-sizing: border-box (USE ALWAYS) ── */
*, *::before, *::after {
  box-sizing: border-box;
  /* Now: width INCLUDES padding + border */
  /* Default: width is ONLY the content area */
}

/* Without border-box: 300 + 40pad + 4brd = 344px total */
/* With border-box: 300px total — padding/border inside */

/* ── Outline (doesn't affect layout!) ── */
:focus { outline: 2px solid #22d3ee; outline-offset: 2px; }`,
    tip: "Add * { box-sizing: border-box } to every project as a global reset. It makes width mean what you'd expect — including padding and border in the total.",
  },

  {
    id: "flexbox",
    icon: "🔀",
    title: "CSS Flexbox",
    subtitle: "One-dimensional layout — rows or columns",
    Demo: FlexboxDemo,
    body: "Flexbox is a one-dimensional layout system — it works along a single axis (row or column). It's perfect for navigation bars, centering content, evenly spacing items, and building component layouts. Set display:flex on a container and its direct children become flex items.",
    code: `/* ── Flex Container Properties ── */
.container {
  display: flex;

  /* Main axis alignment */
  justify-content: flex-start | center | flex-end
                 | space-between | space-around | space-evenly;

  /* Cross axis alignment */
  align-items: stretch | flex-start | center | flex-end | baseline;

  /* Direction */
  flex-direction: row | row-reverse | column | column-reverse;

  /* Wrapping */
  flex-wrap: nowrap | wrap | wrap-reverse;

  /* Shorthand for direction + wrap */
  flex-flow: row wrap;

  /* Gap between items */
  gap: 1rem;                 /* row-gap and column-gap */
  row-gap: 1rem;
  column-gap: 0.5rem;
}

/* ── Flex Item Properties ── */
.item {
  flex-grow:   1;    /* Take up remaining space */
  flex-shrink: 0;    /* Don't shrink */
  flex-basis:  200px;/* Starting size */
  flex: 1 0 200px;   /* Shorthand: grow shrink basis */

  align-self: flex-end;  /* Override container align-items */
  order: -1;             /* Reorder visually */
  margin-left: auto;     /* Push to far end! */
}`,
    tip: "margin: auto in a flex container is magical — it absorbs all available space on that side. margin-left: auto pushes a flex item to the far right end.",
  },

  {
    id: "grid",
    icon: "▦",
    title: "CSS Grid",
    subtitle: "Two-dimensional layout — rows AND columns",
    Demo: GridDemo,
    body: "CSS Grid is a two-dimensional layout system — it handles both rows and columns simultaneously. It's ideal for page-level layout, card grids, image galleries, and any 2D arrangement. Grid is more powerful than flexbox for 2D layouts but both are important tools.",
    code: `/* ── Grid Container ── */
.container {
  display: grid;

  /* Define columns */
  grid-template-columns: 1fr 2fr 1fr;          /* Three cols */
  grid-template-columns: repeat(4, 1fr);        /* Four equal */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Responsive! */

  /* Define rows */
  grid-template-rows: 60px auto 40px;

  /* Named template areas */
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";

  gap: 1rem;
}

/* ── Grid Item Placement ── */
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }

/* Manual placement */
.featured {
  grid-column: 1 / 3;         /* Span columns 1 to 3 */
  grid-row: 1 / span 2;       /* Span 2 rows from row 1 */
}

/* ── Alignment ── */
.container {
  justify-items: center;   /* Items on inline axis */
  align-items: stretch;    /* Items on block axis */
  place-items: center;     /* Shorthand for both */
}`,
    tip: "repeat(auto-fit, minmax(200px, 1fr)) is the one-liner responsive grid — no media queries needed! Items fill the available space and wrap automatically.",
  },

  {
    id: "variables",
    icon: "🎨",
    title: "CSS Custom Properties",
    subtitle: "CSS variables — runtime values, theming, and design tokens",
    Demo: CSSVarsDemo,
    body: "CSS Custom Properties (CSS variables) store values you can reuse throughout a stylesheet and update at runtime with JavaScript. Unlike preprocessor variables, they're live — changing a variable updates all elements using it instantly. Perfect for dark mode and theming.",
    code: `:root {
  /* Define on :root for global scope */
  --color-primary: #22d3ee;
  --color-primary-rgb: 34, 211, 238;  /* For rgba() usage */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --border-radius: 8px;
  --shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  --font-sans: 'DM Sans', system-ui, sans-serif;
  --transition: all 0.25s ease;
}

/* Usage */
.btn {
  background: var(--color-primary);
  border-radius: var(--border-radius);
  padding: var(--spacing-sm) var(--spacing-md);
  transition: var(--transition);
  /* Fallback value */
  color: var(--text-color, #000000);
}

/* Override for dark mode */
[data-theme="dark"] {
  --color-primary: #0891b2;
  --bg: #0f1922;
  --text: #ddeeff;
}

/* Override in component scope */
.sidebar { --spacing-md: 0.75rem; }

/* Update with JavaScript */
document.documentElement.style
  .setProperty('--color-primary', '#ff6b35');`,
    tip: "Output --primary-rgb: 34, 211, 238 alongside --primary. Then use rgba(var(--primary-rgb), 0.2) for transparent tints of any theme color.",
  },

  {
    id: "animations",
    icon: "✨",
    title: "Animations & Transitions",
    subtitle: "@keyframes, animation, transition — motion in CSS",
    Demo: AnimationsDemo,
    body: "CSS provides two motion systems: transitions (smooth change between states on hover/focus/class change) and animations (@keyframes — runs on load, loops, or triggers). Both are hardware-accelerated when animating transform and opacity — always prefer those properties.",
    code: `/* ── Transitions ── */
.btn {
  background: var(--primary);
  /* property | duration | easing | delay */
  transition: background 0.2s ease,
              transform  0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.btn:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

/* ── @keyframes Animations ── */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: +200% center; }
}

/* animation: name dur timing delay iteration dir fill */
.hero-title {
  animation: slideInUp 0.6s ease 0.1s 1 normal forwards;
}

/* Staggered children */
.card:nth-child(1) { animation-delay: 0.1s; }
.card:nth-child(2) { animation-delay: 0.2s; }
.card:nth-child(3) { animation-delay: 0.3s; }

/* Performance tip: only animate transform + opacity */
/* GPU-accelerated, no layout recalculation */`,
    tip: "Only animate transform and opacity for smooth 60fps animations. Animating width, height, or position triggers layout recalculations (reflow) which is expensive.",
  },

  {
    id: "responsive",
    icon: "📱",
    title: "Responsive Design",
    subtitle: "Media queries, fluid layouts, and mobile-first CSS",
    Demo: ResponsiveDemo,
    body: "Responsive design makes websites work on any screen size. The key is mobile-first: write base CSS for mobile, then use min-width media queries to add styles for larger screens. Combine with fluid units (%, rem, vw, clamp()), flexible images, and CSS Grid/Flex.",
    code: `/* ── Viewport meta (required in HTML) ── */
<meta name="viewport" content="width=device-width, initial-scale=1.0">

/* ── Mobile-First CSS ── */

/* Base styles (mobile) */
.container { padding: 0 1rem; }
.grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
.nav-menu { display: none; }

/* Tablet (≥ 768px) */
@media (min-width: 768px) {
  .container { padding: 0 2rem; }
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop (≥ 1024px) */
@media (min-width: 1024px) {
  .container { max-width: 1200px; margin: 0 auto; }
  .grid { grid-template-columns: repeat(4, 1fr); }
  .nav-menu { display: flex; }
}

/* ── Fluid Typography with clamp() ── */
h1 {
  /* clamp(min, preferred, max) */
  font-size: clamp(1.5rem, 4vw, 3rem);
}

/* ── Flexible images ── */
img { max-width: 100%; height: auto; display: block; }

/* ── Responsive Grid (no media queries!) ── */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}`,
    tip: "Use clamp() for fluid typography — font-size: clamp(1rem, 2.5vw, 2rem) smoothly scales between a min and max based on viewport width, no breakpoints needed.",
  },

  {
    id: "tables",
    icon: "📊",
    title: "HTML Tables",
    subtitle: "Semantic table structure with thead, tbody, tfoot",
    Demo: TablesDemo,
    body: "HTML tables are for tabular data — not for layout! A proper table uses thead for column headers, tbody for data rows, and tfoot for totals. The scope attribute improves accessibility. Use CSS for all visual styling like striping and borders.",
    code: `<table>
  <caption>Employee Directory</caption>

  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Role</th>
      <th scope="col">Department</th>
      <th scope="col" class="text-right">Salary</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th scope="row">Alice Johnson</th>   <!-- row header -->
      <td>Frontend Dev</td>
      <td>Engineering</td>
      <td class="text-right">$95,000</td>
    </tr>
    <tr>
      <td colspan="3">Multi-column cell</td>  <!-- merge cols -->
      <td rowspan="2">Multi-row cell</td>     <!-- merge rows -->
    </tr>
  </tbody>

  <tfoot>
    <tr>
      <td colspan="3">5 employees</td>
      <td class="text-right">Avg: $100k</td>
    </tr>
  </tfoot>
</table>

/* CSS table styling */
table { border-collapse: collapse; width: 100%; }
th, td { padding: 0.75rem 1rem; text-align: left; }
thead th { background: var(--surface); border-bottom: 2px solid var(--accent); }
tbody tr:nth-child(even) { background: var(--surface2); }
tbody tr:hover { background: var(--accent-bg); }`,
    tip: "border-collapse: collapse removes the double borders between cells. Never use tables for layout — use CSS Grid or Flexbox instead.",
  },

  {
    id: "specificity",
    icon: "⚖️",
    title: "CSS Specificity",
    subtitle: "How browsers decide which CSS rule wins",
    Demo: SpecificityDemo,
    body: "When multiple CSS rules target the same element, specificity determines which one wins. It's calculated as a four-part score: inline styles (1-0-0-0), IDs (0-1-0-0), classes/attributes/pseudo-classes (0-0-1-0), and elements/pseudo-elements (0-0-0-1). Higher score wins.",
    code: `/* Specificity scoring: Inline | ID | Class | Element */

*           {} /* 0-0-0-0 */
p           {} /* 0-0-0-1 */
.nav        {} /* 0-0-1-0 */
p.intro     {} /* 0-0-1-1 */
#hero       {} /* 0-1-0-0 */
#hero p     {} /* 0-1-0-1 */
#hero .text {} /* 0-1-1-0 */

/* When scores tie, LAST rule in CSS wins */
p { color: blue; }
p { color: red; }   /* ← wins */

/* !important overrides all (avoid in components) */
p { color: blue !important; }

/* :where() has ZERO specificity (great for resets) */
:where(h1, h2, h3) { margin-top: 0; }

/* :is() uses the highest specificity of its arguments */
:is(#id, .class) { } /* Specificity of #id = 0-1-0-0 */

/* Tips to avoid specificity wars: */
/* 1. Use BEM: .card__title vs #card h2 */
/* 2. Keep selectors flat and specific-enough */
/* 3. Use custom properties to cascade values */
/* 4. Avoid !important except for utility overrides */`,
    tip: "If you find yourself using !important, that's a sign your selectors are too specific. Refactor with flat, class-based selectors instead. Use :where() for base styles — it has zero specificity.",
  },
];

/* ══ MAIN COMPONENT ══════════════════════════════════════════ */
export default function HTMLCSSMasterclass() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeId, setActiveId] = useState("intro");
  const [search, setSearch] = useState("");
  const [done, setDone] = useState(new Set());
  const mainRef = useRef(null);
  const activeRef = useRef(null);
  const t = T[darkMode ? "dark" : "light"];

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
        fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif",
        overflow: "hidden",
        transition: "background 0.3s,color 0.3s",
      }}
    >
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none} }
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:${t.border};border-radius:99px;}
        ::-webkit-scrollbar-thumb:hover{background:${t.muted};}
        input[type=range]{-webkit-appearance:none;height:5px;border-radius:99px;outline:none;cursor:pointer;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:${t.accent};cursor:pointer;}
      `}</style>

      {/* HEADER */}
      <header
        style={{
          background: t.sidebar,
          borderBottom: `1px solid ${t.border}`,
          padding: "0 20px",
          height: 56,
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
              width: 32,
              height: 32,
              borderRadius: 8,
              background: `linear-gradient(135deg,${t.accent},#7c3aed)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              color: "#000",
              fontSize: "1rem",
              flexShrink: 0,
            }}
          >
            H
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
              HTML &amp; CSS Masterclass
            </div>
            <div style={{ color: t.muted, fontSize: "0.67rem" }}>
              Complete interactive guide · All elements covered
            </div>
          </div>
          <span
            style={{
              background: t.accentBg,
              color: t.accent,
              border: `1px solid ${t.accentBorder}`,
              borderRadius: 20,
              padding: "1px 8px",
              fontSize: "0.68rem",
              fontWeight: 800,
            }}
          >
            {SECTIONS.length} lessons
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
                  background: `linear-gradient(90deg,${t.accent},#7c3aed)`,
                  borderRadius: 99,
                  transition: "width 0.5s",
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
            onClick={() => setDarkMode((d) => !d)}
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
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* SIDEBAR */}
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
                  fontSize: "0.85rem",
                  pointerEvents: "none",
                }}
              >
                🔍
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search lessons..."
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
                    fontSize: "0.9rem",
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
                marginBottom: 6,
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
                    transition: "background 0.2s",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Nav — properly scrollable */}
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
                    transition: "all 0.15s",
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
              80 block + inline elements documented
            </span>
          </div>
        </aside>

        {/* MAIN */}
        <main
          ref={mainRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "28px 32px",
            minWidth: 0,
          }}
        >
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
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
                  <span style={{ fontSize: "2.2rem" }}>{current.icon}</span>
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
              <SLabel color="#7c3aed">Code Example</SLabel>
              <Code
                code={current.code}
                lang={
                  current.id === "selectors" ||
                  current.id === "boxmodel" ||
                  current.id === "flexbox" ||
                  current.id === "grid" ||
                  current.id === "variables" ||
                  current.id === "animations" ||
                  current.id === "responsive" ||
                  current.id === "specificity"
                    ? "css"
                    : "html"
                }
              />
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
                      : `linear-gradient(135deg,${t.accent},#7c3aed)`,
                  border: "none",
                  color: idx === SECTIONS.length - 1 ? t.muted : "#fff",
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
                      : `0 4px 14px ${t.accent}40`,
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
