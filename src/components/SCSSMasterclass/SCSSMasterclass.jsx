import { useState, useEffect, useRef } from "react";

const T = {
  dark: {
    bg: "#0c0a08",
    sidebar: "#111009",
    surface: "#18160f",
    surface2: "#201e14",
    border: "#2a2718",
    text: "#f0ead8",
    muted: "#7a7260",
    accent: "#f59e0b",
    accentBg: "#f59e0b12",
    accentBorder: "#f59e0b35",
    success: "#86efac",
    danger: "#fca5a5",
    info: "#7dd3fc",
    purple: "#c084fc",
    tag: "#f59e0b22",
  },
  light: {
    bg: "#fdfaf4",
    sidebar: "#ffffff",
    surface: "#ffffff",
    surface2: "#f7f3e8",
    border: "#e8e0cc",
    text: "#1c1810",
    muted: "#8a7d60",
    accent: "#d97706",
    accentBg: "#d9770612",
    accentBorder: "#d9770635",
    success: "#16a34a",
    danger: "#dc2626",
    info: "#0284c7",
    purple: "#9333ea",
    tag: "#d9770618",
  },
};

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
        color: ok ? "#22c55e" : "#7a7260",
        borderRadius: 6,
        padding: "3px 10px",
        fontSize: "0.72rem",
        cursor: "pointer",
        transition: "all 0.2s",
        fontFamily: "monospace",
      }}
    >
      {ok ? "✓ copied" : "copy"}
    </button>
  );
}

function Code({ code }) {
  const lines = code.trim().split("\n");
  const colorLine = (l) => {
    if (l.trim().startsWith("//")) return "#5a6a80";
    if (l.includes("$")) return "#fbbf24";
    if (
      l.includes("@mixin") ||
      l.includes("@include") ||
      l.includes("@extend") ||
      l.includes("@use") ||
      l.includes("@forward") ||
      l.includes("@function") ||
      l.includes("@return") ||
      l.includes("@if") ||
      l.includes("@else") ||
      l.includes("@for") ||
      l.includes("@each") ||
      l.includes("@while")
    )
      return "#c084fc";
    if (l.includes(":") || l.includes("{")) return "#f0ead8";
    return "#b8ad96";
  };
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #2a2718",
      }}
    >
      <div
        style={{
          background: "#080603",
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
                  color: "#2e2a1e",
                  userSelect: "none",
                  minWidth: 18,
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span style={{ color: colorLine(line) }}>{line || " "}</span>
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
        background: `${t.accent}18`,
        border: `1px solid ${t.accent}45`,
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
        <strong style={{ color: t.accent }}>Pro tip: </strong>
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
          background: color || "#f59e0b",
          borderRadius: 99,
        }}
      />
      <span
        style={{
          fontSize: "0.72rem",
          fontWeight: 700,
          color: "#7a7260",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function Tag({ children, t }) {
  return (
    <span
      style={{
        background: t.tag,
        border: `1px solid ${t.accentBorder}`,
        color: t.accent,
        borderRadius: 5,
        padding: "2px 8px",
        fontSize: "0.72rem",
        fontWeight: 700,
        fontFamily: "monospace",
        marginRight: 4,
        marginBottom: 4,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

function IntroDemo({ t }) {
  const comparisons = [
    {
      label: "CSS",
      code: `/* Repetition everywhere */\n.btn { background: #f59e0b; }\n.btn:hover { background: #d97706; }\n.card { border: 1px solid #f59e0b; }\n.header { color: #f59e0b; }\n/* Change 1 color = edit 10 places */`,
      bad: true,
    },
    {
      label: "SCSS",
      code: `// Single source of truth\n$primary: #f59e0b;\n$primary-dark: darken($primary, 10%);\n\n.btn { background: $primary; }\n  &:hover { background: $primary-dark; }\n.card { border: 1px solid $primary; }\n.header { color: $primary; }`,
      bad: false,
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
        CSS vs SCSS — side by side
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {comparisons.map((c, i) => (
          <div key={i} style={{ flex: "1 1 240px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 7,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: c.bad ? "#f87171" : "#86efac",
                }}
              />
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: c.bad ? t.danger : t.success,
                }}
              >
                {c.label}
              </span>
            </div>
            <pre
              style={{
                margin: 0,
                background: c.bad ? "#1a0a0a" : "#0a1a0a",
                border: `1px solid ${c.bad ? "#3a1010" : "#0a3a0a"}`,
                borderRadius: 8,
                padding: "10px 12px",
                fontSize: "0.75rem",
                lineHeight: 1.7,
                color: c.bad ? "#fca5a5" : "#86efac",
                fontFamily: "'Fira Code',monospace",
                overflow: "auto",
              }}
            >
              {c.code}
            </pre>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          "Variables",
          "Nesting",
          "Mixins",
          "Functions",
          "@extend",
          "Loops",
          "Maps",
          "Partials",
        ].map((f) => (
          <Tag key={f} t={t}>
            {f}
          </Tag>
        ))}
      </div>
    </div>
  );
}

function VariablesDemo({ t }) {
  const [primary, setPrimary] = useState("#f59e0b");
  const [radius, setRadius] = useState(8);
  const [size, setSize] = useState(16);
  const dark = (hex, amt = 20) => {
    const r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${Math.max(0, r - amt)},${Math.max(0, g - amt)},${Math.max(0, b - amt)})`;
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
        Live Variable Editor — change $primary, $radius, $font-size
      </p>
      <div
        style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 18 }}
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
          <code style={{ color: t.accent }}>$primary:</code>
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
              background: "none",
            }}
          />
          <span
            style={{
              color: t.text,
              fontFamily: "monospace",
              fontSize: "0.78rem",
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
          <code style={{ color: t.accent }}>$radius:</code>
          <input
            type="range"
            min={0}
            max={24}
            value={radius}
            onChange={(e) => setRadius(+e.target.value)}
            style={{ width: 80, accentColor: primary }}
          />
          <span
            style={{
              color: t.text,
              fontFamily: "monospace",
              fontSize: "0.78rem",
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
          <code style={{ color: t.accent }}>$font-size:</code>
          <input
            type="range"
            min={12}
            max={20}
            value={size}
            onChange={(e) => setSize(+e.target.value)}
            style={{ width: 80, accentColor: primary }}
          />
          <span
            style={{
              color: t.text,
              fontFamily: "monospace",
              fontSize: "0.78rem",
            }}
          >
            {size}px
          </span>
        </label>
      </div>
      <div
        style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}
      >
        <button
          style={{
            background: primary,
            color: "#000",
            border: "none",
            borderRadius: radius,
            padding: `8px 18px`,
            fontSize: size,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = dark(primary))
          }
          onMouseLeave={(e) => (e.currentTarget.style.background = primary)}
        >
          .btn-primary
        </button>
        <button
          style={{
            background: "transparent",
            color: primary,
            border: `2px solid ${primary}`,
            borderRadius: radius,
            padding: `8px 16px`,
            fontSize: size,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          .btn-outline
        </button>
        <div
          style={{
            flex: "1 1 200px",
            background: t.surface,
            border: `2px solid ${primary}`,
            borderRadius: radius + 4,
            padding: "12px 16px",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: t.text,
              fontSize: size,
              marginBottom: 4,
            }}
          >
            Card Title
          </div>
          <div style={{ color: t.muted, fontSize: size - 2 }}>
            All derived from $primary.
          </div>
        </div>
      </div>
      <pre
        style={{
          margin: 0,
          background: "#080603",
          border: `1px solid ${t.border}`,
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: "0.75rem",
          color: "#fbbf24",
          fontFamily: "monospace",
          overflow: "auto",
        }}
      >
        {`$primary:   ${primary};
$radius:    ${radius}px;
$font-size: ${size}px;
$primary-dark: darken($primary, 12%);`}
      </pre>
    </div>
  );
}

function NestingDemo({ t }) {
  const [hov, setHov] = useState(null);
  const items = [
    ".nav",
    ".nav__item",
    ".nav__link",
    "&:hover",
    "&.active",
    "&::before",
  ];
  const depths = [0, 1, 2, 3, 3, 3];
  const colors = [
    "#f59e0b",
    "#fb923c",
    "#f87171",
    "#86efac",
    "#7dd3fc",
    "#c084fc",
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
        Nesting Depth Visualizer — hover a selector
      </p>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px" }}>
          {items.map((item, i) => (
            <div
              key={i}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 8px",
                borderRadius: 7,
                marginBottom: 3,
                background: hov === i ? colors[i] + "20" : "transparent",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: depths[i] }).map((_, d) => (
                  <div
                    key={d}
                    style={{
                      width: 3,
                      height: 20,
                      background: colors[i] + "50",
                      borderRadius: 99,
                    }}
                  />
                ))}
                {depths[i] === 0 && (
                  <div
                    style={{
                      width: 3,
                      height: 20,
                      background: colors[i],
                      borderRadius: 99,
                    }}
                  />
                )}
              </div>
              <code
                style={{
                  color: hov === i ? colors[i] : t.muted,
                  fontSize: "0.82rem",
                  transition: "color 0.15s",
                }}
              >
                {item}
              </code>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: "0.68rem",
                  color: t.muted,
                }}
              >
                depth {depths[i]}
              </span>
            </div>
          ))}
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <div
            style={{
              background: "#080603",
              borderRadius: 10,
              padding: "12px 14px",
              fontFamily: "monospace",
              fontSize: "0.77rem",
              lineHeight: 1.8,
              border: `1px solid ${t.border}`,
            }}
          >
            <div style={{ color: hov === 0 ? "#f59e0b" : "#5a6a80" }}>
              .nav {"{"}
            </div>
            <div
              style={{
                color: hov === 1 ? "#fb923c" : "#5a6a80",
                paddingLeft: 16,
              }}
            >
              {"  "}&nbsp;&nbsp;.nav__item {"{"}
            </div>
            <div
              style={{
                color: hov === 2 ? "#f87171" : "#5a6a80",
                paddingLeft: 32,
              }}
            >
              {"    "}&nbsp;&nbsp;&nbsp;&nbsp;.nav__link {"{"}
            </div>
            <div
              style={{
                color: hov === 3 ? "#86efac" : "#5a6a80",
                paddingLeft: 48,
              }}
            >
              {"      "}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&amp;:hover{" "}
              {"{ ... }"}
            </div>
            <div
              style={{
                color: hov === 4 ? "#7dd3fc" : "#5a6a80",
                paddingLeft: 48,
              }}
            >
              {"      "}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&amp;.active{" "}
              {"{ ... }"}
            </div>
            <div
              style={{
                color: hov === 5 ? "#c084fc" : "#5a6a80",
                paddingLeft: 48,
              }}
            >
              {"      "}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&amp;::before{" "}
              {"{ ... }"}
            </div>
            <div style={{ color: "#5a6a80", paddingLeft: 32 }}>{"    }}"}</div>
            <div style={{ color: "#5a6a80", paddingLeft: 16 }}>{"  }}"}</div>
            <div style={{ color: "#5a6a80" }}>{"}"}</div>
          </div>
          <p style={{ margin: "8px 0 0", color: t.muted, fontSize: "0.72rem" }}>
            ⚠️ Max 3 levels deep — deeper = harder to maintain
          </p>
        </div>
      </div>
    </div>
  );
}

function MixinsDemo({ t }) {
  const [flex, setFlex] = useState("center");
  const [col, setCol] = useState(true);
  const [shadow, setShadow] = useState(true);
  const jOpts = ["flex-start", "center", "flex-end", "space-between"];
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
        @mixin flex-center — interactive arguments
      </p>
      <div
        style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 14 }}
      >
        <div>
          <code
            style={{
              display: "block",
              color: t.muted,
              fontSize: "0.72rem",
              marginBottom: 5,
            }}
          >
            $justify
          </code>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {jOpts.map((o) => (
              <button
                key={o}
                onClick={() => setFlex(o)}
                style={{
                  background: flex === o ? t.accentBg : t.surface,
                  color: flex === o ? t.accent : t.muted,
                  border: `1px solid ${flex === o ? t.accentBorder : t.border}`,
                  borderRadius: 5,
                  padding: "3px 9px",
                  cursor: "pointer",
                  fontSize: "0.72rem",
                  fontFamily: "monospace",
                }}
              >
                {o.replace("flex-", "").replace("space-", "")}
              </button>
            ))}
          </div>
        </div>
        <div>
          <code
            style={{
              display: "block",
              color: t.muted,
              fontSize: "0.72rem",
              marginBottom: 5,
            }}
          >
            $direction
          </code>
          <div style={{ display: "flex", gap: 4 }}>
            {[
              ["row", false],
              ["column", true],
            ].map(([l, v]) => (
              <button
                key={l}
                onClick={() => setCol(v)}
                style={{
                  background: col === v ? t.accentBg : t.surface,
                  color: col === v ? t.accent : t.muted,
                  border: `1px solid ${col === v ? t.accentBorder : t.border}`,
                  borderRadius: 5,
                  padding: "3px 9px",
                  cursor: "pointer",
                  fontSize: "0.72rem",
                  fontFamily: "monospace",
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div>
          <code
            style={{
              display: "block",
              color: t.muted,
              fontSize: "0.72rem",
              marginBottom: 5,
            }}
          >
            $shadow
          </code>
          <div style={{ display: "flex", gap: 4 }}>
            {[
              ["yes", true],
              ["no", false],
            ].map(([l, v]) => (
              <button
                key={l}
                onClick={() => setShadow(v)}
                style={{
                  background: shadow === v ? t.accentBg : t.surface,
                  color: shadow === v ? t.accent : t.muted,
                  border: `1px solid ${shadow === v ? t.accentBorder : t.border}`,
                  borderRadius: 5,
                  padding: "3px 9px",
                  cursor: "pointer",
                  fontSize: "0.72rem",
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          background: t.surface,
          border: `2px dashed ${t.border}`,
          borderRadius: 10,
          padding: 16,
          minHeight: 100,
          display: "flex",
          justifyContent: flex,
          alignItems: "center",
          flexDirection: col ? "column" : "row",
          gap: 10,
          boxShadow: shadow ? "0 8px 30px #00000060" : "none",
          transition: "all 0.3s",
        }}
      >
        {["A", "B", "C"].map((l, i) => (
          <div
            key={l}
            style={{
              background: [t.accent, "#c084fc", "#7dd3fc"][i],
              color: "#000",
              borderRadius: 8,
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "1rem",
              flexShrink: 0,
            }}
          >
            {l}
          </div>
        ))}
      </div>
      <pre
        style={{
          margin: "12px 0 0",
          background: "#080603",
          border: `1px solid ${t.border}`,
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: "0.75rem",
          color: "#c084fc",
          fontFamily: "monospace",
          overflow: "auto",
        }}
      >
        {`@include flex-center(
  $justify:   ${flex},
  $direction: ${col ? "column" : "row"},
  $shadow:    ${shadow}
);`}
      </pre>
    </div>
  );
}

function FunctionsDemo({ t }) {
  const [base, setBase] = useState(16);
  const [color, setColor] = useState("#f59e0b");
  const rem = (px) => (px / base).toFixed(3) + "rem";
  const lighten = (hex, p) => {
    const r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    const f = p / 100;
    return `rgb(${Math.min(255, Math.round(r + (255 - r) * f))},${Math.min(255, Math.round(g + (255 - g) * f))},${Math.min(255, Math.round(b + (255 - b) * f))})`;
  };
  const darken = (hex, p) => {
    const r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    const f = 1 - p / 100;
    return `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`;
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
        @function rem() + color manipulation
      </p>
      <div
        style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}
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
          <code style={{ color: t.accent }}>$base-font:</code>
          <input
            type="range"
            min={12}
            max={20}
            value={base}
            onChange={(e) => setBase(+e.target.value)}
            style={{ width: 80, accentColor: t.accent }}
          />
          <span
            style={{
              color: t.text,
              fontFamily: "monospace",
              fontSize: "0.78rem",
            }}
          >
            {base}px
          </span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <code style={{ color: t.accent }}>$color:</code>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{
              width: 36,
              height: 26,
              borderRadius: 5,
              border: "none",
              cursor: "pointer",
            }}
          />
        </label>
      </div>
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}
      >
        {[100, 200, 300, 400, 600, 800, 1200].map((px) => (
          <div
            key={px}
            style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: 7,
              padding: "6px 10px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.65rem",
                color: t.muted,
                fontFamily: "monospace",
              }}
            >
              rem({px}px)
            </div>
            <div
              style={{
                color: t.accent,
                fontFamily: "monospace",
                fontSize: "0.82rem",
                fontWeight: 700,
              }}
            >
              {rem(px)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {[
          ["lighten 40%", lighten(color, 40)],
          ["lighten 20%", lighten(color, 20)],
          ["base", color],
          ["darken 15%", darken(color, 15)],
          ["darken 30%", darken(color, 30)],
          ["darken 50%", darken(color, 50)],
        ].map(([lbl, clr]) => (
          <div
            key={lbl}
            style={{
              flex: "1 1 80px",
              minHeight: 52,
              background: clr,
              borderRadius: 8,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: 6,
            }}
          >
            <span
              style={{
                fontSize: "0.62rem",
                color: lbl.includes("light") ? "#000" : "#fff",
                fontWeight: 700,
                fontFamily: "monospace",
                textAlign: "center",
                lineHeight: 1.2,
                padding: "0 4px",
              }}
            >
              {lbl}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExtendDemo({ t }) {
  const [active, setActive] = useState(null);
  const placeholders = [
    {
      name: "%btn-base",
      props: [
        "padding: 0.6rem 1.2rem",
        "border-radius: 6px",
        "font-weight: 700",
        "cursor: pointer",
        "transition: all 0.2s",
      ],
      color: "#f59e0b",
    },
    {
      name: "%card-base",
      props: [
        "border-radius: 12px",
        "padding: 1.5rem",
        "box-shadow: 0 4px 20px rgba(0,0,0,0.3)",
        "background: $surface",
      ],
      color: "#c084fc",
    },
    {
      name: "%visually-hidden",
      props: [
        "position: absolute",
        "width: 1px",
        "height: 1px",
        "clip: rect(0,0,0,0)",
        "overflow: hidden",
      ],
      color: "#7dd3fc",
    },
  ];
  const extenders = [
    {
      name: ".btn-primary",
      extends: "%btn-base",
      extra: "background: $primary",
      color: "#f59e0b",
    },
    {
      name: ".btn-danger",
      extends: "%btn-base",
      extra: "background: #dc3545",
      color: "#f87171",
    },
    {
      name: ".btn-ghost",
      extends: "%btn-base",
      extra: "background: transparent; border: 2px solid $primary",
      color: "#86efac",
    },
    {
      name: ".product-card",
      extends: "%card-base",
      extra: "max-width: 280px",
      color: "#c084fc",
    },
    {
      name: ".modal-panel",
      extends: "%card-base",
      extra: "position: fixed; inset: 0",
      color: "#fb923c",
    },
    {
      name: ".sr-only",
      extends: "%visually-hidden",
      extra: "// no extra styles",
      color: "#7dd3fc",
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
        @extend + Placeholders — hover to trace inheritance
      </p>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px" }}>
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
            Placeholders (%)
          </div>
          {placeholders.map((p, i) => (
            <div
              key={i}
              style={{
                background:
                  active && extenders[active]?.extends === p.name
                    ? p.color + "25"
                    : t.surface,
                border: `1px solid ${active && extenders[active]?.extends === p.name ? p.color : t.border}`,
                borderRadius: 9,
                padding: "10px 12px",
                marginBottom: 8,
                transition: "all 0.2s",
              }}
            >
              <code
                style={{
                  color: p.color,
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: 5,
                }}
              >
                {p.name}
              </code>
              {p.props.map((pr, j) => (
                <div
                  key={j}
                  style={{
                    color: t.muted,
                    fontSize: "0.72rem",
                    fontFamily: "monospace",
                    marginBottom: 1,
                  }}
                >
                  {pr};
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ flex: "1 1 200px" }}>
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
            Classes (@extend)
          </div>
          {extenders.map((e, i) => (
            <div
              key={i}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              style={{
                background: active === i ? e.color + "20" : t.surface,
                border: `1px solid ${active === i ? e.color : t.border}`,
                borderRadius: 8,
                padding: "8px 12px",
                marginBottom: 6,
                cursor: "pointer",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <code
                style={{
                  color: active === i ? e.color : t.text,
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  flex: 1,
                }}
              >
                {e.name}
              </code>
              <span
                style={{
                  fontSize: "0.68rem",
                  color: t.muted,
                  fontFamily: "monospace",
                }}
              >
                @extend {e.extends}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OperatorsDemo({ t }) {
  const [cols, setCols] = useState(3);
  const [gutter, setGutter] = useState(16);
  const [baseFont, setBaseFont] = useState(16);
  const colWidth = `${(100 / cols).toFixed(2)}%`;
  const scale = [0.64, 0.8, 1, 1.25, 1.563, 1.953, 2.441];
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
        Math operators in action — SCSS computes at build time
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
          <code style={{ color: t.accent }}>$columns:</code>
          <input
            type="range"
            min={1}
            max={6}
            value={cols}
            onChange={(e) => setCols(+e.target.value)}
            style={{ width: 70, accentColor: t.accent }}
          />
          <span
            style={{
              color: t.text,
              fontFamily: "monospace",
              fontSize: "0.78rem",
            }}
          >
            {cols}
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
          <code style={{ color: t.accent }}>$gutter:</code>
          <input
            type="range"
            min={0}
            max={32}
            value={gutter}
            onChange={(e) => setGutter(+e.target.value)}
            style={{ width: 70, accentColor: t.accent }}
          />
          <span
            style={{
              color: t.text,
              fontFamily: "monospace",
              fontSize: "0.78rem",
            }}
          >
            {gutter}px
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
          <code style={{ color: t.accent }}>$base:</code>
          <input
            type="range"
            min={12}
            max={20}
            value={baseFont}
            onChange={(e) => setBaseFont(+e.target.value)}
            style={{ width: 70, accentColor: t.accent }}
          />
          <span
            style={{
              color: t.text,
              fontFamily: "monospace",
              fontSize: "0.78rem",
            }}
          >
            {baseFont}px
          </span>
        </label>
      </div>
      <div
        style={{
          display: "flex",
          gap: gutter,
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: `1 1 ${colWidth}`,
              background: `hsl(${30 + i * 40},70%,${t.bg === "dark" ? 35 : 60}%)`,
              borderRadius: 8,
              padding: "12px 8px",
              textAlign: "center",
              color: "white",
              fontSize: "0.78rem",
              fontWeight: 700,
              minWidth: 0,
            }}
          >
            {colWidth}
          </div>
        ))}
      </div>
      <p
        style={{
          margin: "0 0 8px",
          color: t.muted,
          fontSize: "0.72rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        Modular type scale (× 1.25 ratio)
      </p>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {scale.map((m, i) => (
          <div
            key={i}
            style={{
              flex: "1 1 60px",
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: 7,
              padding: "6px 8px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: baseFont * m,
                fontWeight: 700,
                color: t.text,
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Aa
            </div>
            <div
              style={{
                fontSize: "0.65rem",
                color: t.muted,
                fontFamily: "monospace",
                marginTop: 3,
              }}
            >
              {(baseFont * m).toFixed(0)}px
            </div>
          </div>
        ))}
      </div>
      <pre
        style={{
          margin: "12px 0 0",
          background: "#080603",
          border: `1px solid ${t.border}`,
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: "0.75rem",
          color: "#fbbf24",
          fontFamily: "monospace",
          overflow: "auto",
        }}
      >
        {`$col-width: 100% / ${cols};  // = ${colWidth}
$gap:       ${gutter}px;
$scale:     $base-font * 1.25;  // = ${(baseFont * 1.25).toFixed(1)}px`}
      </pre>
    </div>
  );
}

function ControlFlowDemo({ t }) {
  const [loop, setLoop] = useState("each");
  const [count, setCount] = useState(5);
  const sizes = ["xs", "sm", "md", "lg", "xl"];
  const colors = {
    primary: "#f59e0b",
    success: "#86efac",
    danger: "#f87171",
    warning: "#fbbf24",
    info: "#7dd3fc",
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
        Control flow — @if, @for, @each in action
      </p>
      <div
        style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}
      >
        {[
          ["@each", "each"],
          ["@for", "for"],
          ["@if / @else", "if"],
        ].map(([lbl, v]) => (
          <button
            key={v}
            onClick={() => setLoop(v)}
            style={{
              background: loop === v ? t.accentBg : t.surface,
              color: loop === v ? t.accent : t.muted,
              border: `1px solid ${loop === v ? t.accentBorder : t.border}`,
              borderRadius: 7,
              padding: "5px 14px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 700,
            }}
          >
            {lbl}
          </button>
        ))}
        {loop === "for" && (
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.8rem",
              color: t.muted,
            }}
          >
            <code style={{ color: t.accent }}>$i:</code>
            <input
              type="range"
              min={1}
              max={8}
              value={count}
              onChange={(e) => setCount(+e.target.value)}
              style={{ width: 80, accentColor: t.accent }}
            />
            <span style={{ color: t.text, fontFamily: "monospace" }}>
              1..{count}
            </span>
          </label>
        )}
      </div>
      {loop === "each" && (
        <>
          <p style={{ color: t.muted, fontSize: "0.78rem", marginBottom: 10 }}>
            <code style={{ color: t.purple }}>
              @each $name, $color in $theme-colors
            </code>{" "}
            — generates utility classes for every map entry:
          </p>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {Object.entries(colors).map(([name, clr]) => (
              <div
                key={name}
                style={{
                  background: clr + "25",
                  border: `1px solid ${clr}55`,
                  borderRadius: 8,
                  padding: "8px 14px",
                }}
              >
                <code
                  style={{ color: clr, fontSize: "0.78rem", fontWeight: 700 }}
                >
                  .text-{name}
                </code>
                <div
                  style={{
                    color: clr,
                    fontSize: "0.85rem",
                    marginTop: 3,
                    fontWeight: 700,
                  }}
                >
                  Sample text
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {loop === "for" && (
        <>
          <p style={{ color: t.muted, fontSize: "0.78rem", marginBottom: 10 }}>
            <code style={{ color: t.purple }}>
              @for $i from 1 through {count}
            </code>{" "}
            — generates spacing scale:
          </p>
          <div
            style={{
              display: "flex",
              gap: 5,
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <div
                  style={{
                    width: `${(i + 1) * 8 + 8}px`,
                    height: `${(i + 1) * 8 + 8}px`,
                    background: `hsl(${30 + i * 25},70%,50%)`,
                    borderRadius: 6,
                    transition: "all 0.3s",
                  }}
                />
                <code style={{ color: t.muted, fontSize: "0.65rem" }}>
                  .m-{i + 1}
                </code>
                <span
                  style={{
                    color: t.text,
                    fontSize: "0.65rem",
                    fontFamily: "monospace",
                  }}
                >
                  {((i + 1) * 0.25).toFixed(2)}r
                </span>
              </div>
            ))}
          </div>
        </>
      )}
      {loop === "if" && (
        <>
          <p style={{ color: t.muted, fontSize: "0.78rem", marginBottom: 10 }}>
            <code style={{ color: t.purple }}>@if $size == 'lg'</code> —
            conditional styles based on arguments:
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {sizes.map((s, i) => (
              <div
                key={s}
                style={{
                  background: t.surface,
                  border: `1px solid ${t.border}`,
                  borderRadius: 8,
                  padding: `${8 + i * 4}px ${12 + i * 6}px`,
                  fontSize: `${0.7 + i * 0.1}rem`,
                  fontWeight: 700,
                  color: t.text,
                  textAlign: "center",
                }}
              >
                <div>{s.toUpperCase()}</div>
                <code style={{ color: t.accent, fontSize: "0.65rem" }}>
                  {12 + i * 4}px
                </code>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MapsDemo({ t }) {
  const [selected, setSelected] = useState("primary");
  const themeMap = {
    primary: { base: "#f59e0b", light: "#fcd34d", dark: "#d97706" },
    success: { base: "#22c55e", light: "#86efac", dark: "#15803d" },
    danger: { base: "#ef4444", light: "#fca5a5", dark: "#b91c1c" },
    info: { base: "#3b82f6", light: "#93c5fd", dark: "#1d4ed8" },
    purple: { base: "#a855f7", light: "#d8b4fe", dark: "#7e22ce" },
  };
  const c = themeMap[selected];
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
        SCSS Maps — structured data as variables
      </p>
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}
      >
        {Object.keys(themeMap).map((k) => (
          <button
            key={k}
            onClick={() => setSelected(k)}
            style={{
              background: selected === k ? themeMap[k].base + "25" : t.surface,
              color: selected === k ? themeMap[k].base : t.muted,
              border: `1px solid ${selected === k ? themeMap[k].base + "60" : t.border}`,
              borderRadius: 8,
              padding: "5px 14px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 700,
              transition: "all 0.2s",
            }}
          >
            {k}
          </button>
        ))}
      </div>
      <div
        style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}
      >
        {[
          ["base", c.base],
          ["light", c.light],
          ["dark", c.dark],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              flex: "1 1 100px",
              background: v,
              borderRadius: 10,
              padding: "14px 10px",
              textAlign: "center",
              boxShadow: `0 4px 14px ${c.base}40`,
            }}
          >
            <div
              style={{
                color: "#000",
                fontFamily: "monospace",
                fontSize: "0.72rem",
                fontWeight: 700,
                opacity: 0.7,
              }}
            >
              map.get($colors,
            </div>
            <div
              style={{
                color: "#000",
                fontFamily: "monospace",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              "{selected}", "{k}")
            </div>
            <div
              style={{
                color: "#000",
                fontFamily: "monospace",
                fontSize: "0.75rem",
                marginTop: 4,
                opacity: 0.7,
              }}
            >
              {v}
            </div>
          </div>
        ))}
      </div>
      <pre
        style={{
          margin: 0,
          background: "#080603",
          border: `1px solid ${t.border}`,
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: "0.75rem",
          color: "#fbbf24",
          fontFamily: "monospace",
          overflow: "auto",
        }}
      >
        {`$colors: (
  "${selected}": (
    "base":  ${c.base},
    "light": ${c.light},
    "dark":  ${c.dark},
  ),
);
// Usage:
$val: map.get($colors, "${selected}", "base"); // → ${c.base}`}
      </pre>
    </div>
  );
}

function PartialDemo({ t }) {
  const [hov, setHov] = useState(null);
  const files = [
    {
      name: "_variables.scss",
      icon: "📦",
      color: "#f59e0b",
      desc: "All $variables",
      imports: [],
    },
    {
      name: "_mixins.scss",
      icon: "🔧",
      color: "#c084fc",
      desc: "@mixin definitions",
      imports: ["_variables.scss"],
    },
    {
      name: "_base.scss",
      icon: "🏗️",
      color: "#7dd3fc",
      desc: "Reset & root styles",
      imports: ["_variables.scss"],
    },
    {
      name: "_components.scss",
      icon: "🧩",
      color: "#86efac",
      desc: "Buttons, cards, forms",
      imports: ["_variables.scss", "_mixins.scss"],
    },
    {
      name: "_layout.scss",
      icon: "📐",
      color: "#fb923c",
      desc: "Grid, navbar, footer",
      imports: ["_variables.scss", "_mixins.scss"],
    },
    {
      name: "main.scss",
      icon: "🎯",
      color: "#f87171",
      desc: "Entry point — no underscore",
      imports: ["_base.scss", "_components.scss", "_layout.scss"],
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
        Partials & @use — hover to see dependencies
      </p>
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}
      >
        {files.map((f, i) => (
          <div
            key={i}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            style={{
              flex: "1 1 150px",
              background: hov === i ? f.color + "20" : t.surface,
              border: `1px solid ${hov === i ? f.color : t.border}`,
              borderRadius: 10,
              padding: "10px 12px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 5,
              }}
            >
              <span style={{ fontSize: "1rem" }}>{f.icon}</span>
              <code
                style={{
                  color: hov === i ? f.color : t.text,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                {f.name}
              </code>
            </div>
            <div
              style={{ color: t.muted, fontSize: "0.72rem", marginBottom: 6 }}
            >
              {f.desc}
            </div>
            {f.imports.length > 0 && (
              <div>
                <div
                  style={{
                    color: t.muted,
                    fontSize: "0.65rem",
                    marginBottom: 3,
                  }}
                >
                  @use:
                </div>
                {f.imports.map((imp) => (
                  <div
                    key={imp}
                    style={{
                      fontSize: "0.65rem",
                      fontFamily: "monospace",
                      color: hov === i ? f.color : t.muted,
                      background: hov === i ? f.color + "15" : "transparent",
                      borderRadius: 3,
                      padding: "1px 5px",
                      marginBottom: 2,
                      display: "inline-block",
                      marginRight: 3,
                    }}
                  >
                    {imp}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div
        style={{
          background: "#080603",
          borderRadius: 8,
          padding: "10px 12px",
          fontFamily: "monospace",
          fontSize: "0.75rem",
          border: `1px solid ${t.border}`,
        }}
      >
        <div style={{ color: "#5a6a80" }}>// main.scss — entry point</div>
        {["_base", "_components", "_layout"].map((f) => (
          <div key={f} style={{ color: "#c084fc" }}>
            @use '{f}' as *;
          </div>
        ))}
      </div>
    </div>
  );
}

function BEMDemo({ t }) {
  const [hov, setHov] = useState(null);
  const bem = [
    {
      selector: ".card",
      type: "Block",
      color: "#f59e0b",
      desc: "The standalone component",
    },
    {
      selector: ".card__header",
      type: "Element",
      color: "#7dd3fc",
      desc: "Part of the block (__)",
    },
    {
      selector: ".card__body",
      type: "Element",
      color: "#7dd3fc",
      desc: "Part of the block (__)",
    },
    {
      selector: ".card__footer",
      type: "Element",
      color: "#7dd3fc",
      desc: "Part of the block (__)",
    },
    {
      selector: ".card--featured",
      type: "Modifier",
      color: "#86efac",
      desc: "Variant of the block (--)",
    },
    {
      selector: ".card--dark",
      type: "Modifier",
      color: "#86efac",
      desc: "Variant of the block (--)",
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
        BEM with SCSS nesting — Block, Element, Modifier
      </p>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px" }}>
          {bem.map((b, i) => (
            <div
              key={i}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 10px",
                borderRadius: 8,
                marginBottom: 4,
                background: hov === i ? b.color + "20" : "transparent",
                border: `1px solid ${hov === i ? b.color + "50" : "transparent"}`,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <span
                style={{
                  background: b.color + "30",
                  color: b.color,
                  borderRadius: 4,
                  padding: "1px 7px",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {b.type}
              </span>
              <code
                style={{
                  color: hov === i ? b.color : t.text,
                  fontSize: "0.8rem",
                  flex: 1,
                }}
              >
                {b.selector}
              </code>
              <span style={{ color: t.muted, fontSize: "0.68rem" }}>
                {b.desc}
              </span>
            </div>
          ))}
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <div
            style={{
              background: "#080603",
              borderRadius: 10,
              padding: "12px 14px",
              fontFamily: "monospace",
              fontSize: "0.75rem",
              lineHeight: 1.8,
              border: `1px solid ${t.border}`,
            }}
          >
            <div style={{ color: hov === 0 ? "#f59e0b" : "#f0ead8" }}>
              .card {"{"}
            </div>
            <div
              style={{
                color:
                  hov === 1 || hov === 2 || hov === 3 ? "#7dd3fc" : "#5a6a80",
                paddingLeft: 14,
              }}
            >
              {"  "}&amp;__header, &amp;__body, &amp;__footer {"{"}
            </div>
            <div style={{ color: "#5a6a80", paddingLeft: 28 }}>
              {"    "}// element styles
            </div>
            <div style={{ color: "#5a6a80", paddingLeft: 14 }}>{"  }"}</div>
            <div
              style={{
                color: hov === 4 || hov === 5 ? "#86efac" : "#5a6a80",
                paddingLeft: 14,
              }}
            >
              {"  "}&amp;--featured {"{ border: 2px solid $primary; }"}
            </div>
            <div
              style={{
                color: hov === 4 || hov === 5 ? "#86efac" : "#5a6a80",
                paddingLeft: 14,
              }}
            >
              {"  "}&amp;--dark {"{ background: $dark; }"}
            </div>
            <div style={{ color: "#f0ead8" }}>{"}"}</div>
          </div>
          <div
            style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}
          >
            {[false, true].map((feat, i) => (
              <div
                key={i}
                style={{
                  flex: "1 1 120px",
                  background: feat ? t.accent + "20" : t.surface,
                  border: `2px solid ${feat ? t.accent : t.border}`,
                  borderRadius: 10,
                  padding: "12px",
                  transition: "all 0.3s",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: t.text,
                    fontSize: "0.85rem",
                    marginBottom: 4,
                  }}
                >
                  {feat ? "Featured ✨" : "Default"}
                </div>
                <div style={{ color: t.muted, fontSize: "0.75rem" }}>
                  .card{feat ? "--featured" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BreakpointMixinDemo({ t }) {
  const [bp, setBp] = useState("md");
  const bps = { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 };
  const [val, setVal] = useState(768);
  const cols = val >= 992 ? 4 : val >= 768 ? 3 : val >= 576 ? 2 : 1;
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
        Responsive breakpoint mixin — drag to simulate width
      </p>
      <div style={{ marginBottom: 14 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.78rem",
            color: t.muted,
            marginBottom: 6,
          }}
        >
          <span>Simulated viewport width</span>
          <strong style={{ color: t.accent, fontFamily: "monospace" }}>
            {val}px —{" "}
            {Object.keys(bps)
              .filter((k) => bps[k] <= val)
              .pop()
              ?.toUpperCase()}
          </strong>
        </div>
        <input
          type="range"
          min={320}
          max={1280}
          value={val}
          onChange={(e) => setVal(+e.target.value)}
          style={{ width: "100%", accentColor: t.accent, cursor: "pointer" }}
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
          {Object.entries(bps).map(([k, v]) => (
            <span key={k}>
              {v || "0"}px
              <br />
              {k}
            </span>
          ))}
        </div>
      </div>
      <div
        style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background: `hsl(${30 + i * 50},70%,${t.bg === "#0c0a08" ? 38 : 55}%)`,
              borderRadius: 8,
              padding: "12px 6px",
              textAlign: "center",
              color: "white",
              fontSize: "0.78rem",
              fontWeight: 700,
              minWidth: 0,
              transition: "all 0.4s",
            }}
          >
            col-{12 / cols}
          </div>
        ))}
      </div>
      <pre
        style={{
          margin: 0,
          background: "#080603",
          border: `1px solid ${t.border}`,
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: "0.75rem",
          color: "#c084fc",
          fontFamily: "monospace",
          overflow: "auto",
        }}
      >
        {`// The mixin definition
@mixin respond-to($bp) {
  @media (min-width: map.get($breakpoints, $bp)) {
    @content;
  }
}

// Usage
.grid {
  grid-template-columns: 1fr;  // mobile default

  @include respond-to(sm) { grid-template-columns: repeat(2, 1fr); }
  @include respond-to(md) { grid-template-columns: repeat(3, 1fr); }
  @include respond-to(lg) { grid-template-columns: repeat(4, 1fr); }
}`}
      </pre>
    </div>
  );
}

function AnimationDemo({ t }) {
  const [running, setRunning] = useState(true);
  const [sel, setSel] = useState(0);
  const anims = [
    {
      name: "fadeInUp",
      css: "fadeInUp 0.6s ease forwards",
      label: "Fade In Up",
    },
    { name: "pulse", css: "pulse 1.2s ease-in-out infinite", label: "Pulse" },
    { name: "shimmer", css: "shimmer 1.8s infinite", label: "Shimmer" },
    { name: "spin", css: "spin 1s linear infinite", label: "Spin" },
    {
      name: "bounce",
      css: "bounce 0.8s ease infinite alternate",
      label: "Bounce",
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
        @keyframes fadeInUp { from { opacity:0; transform:translateY(20px);} to { opacity:1; transform:none;} }
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.1);opacity:0.7;} }
        @keyframes shimmer { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
        @keyframes spin { to{transform:rotate(360deg);} }
        @keyframes bounce { from{transform:translateY(0);} to{transform:translateY(-14px);} }
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
        SCSS @keyframes + animation mixin
      </p>
      <div
        style={{ display: "flex", gap: 7, marginBottom: 16, flexWrap: "wrap" }}
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
            {a.label}
          </button>
        ))}
        <button
          onClick={() => setRunning((r) => !r)}
          style={{
            marginLeft: "auto",
            background: running ? "#f8717120" : "#86efac20",
            color: running ? "#f87171" : "#86efac",
            border: `1px solid ${running ? "#f8717140" : "#86efac40"}`,
            borderRadius: 7,
            padding: "5px 12px",
            cursor: "pointer",
            fontSize: "0.78rem",
            fontWeight: 700,
          }}
        >
          {running ? "⏸ Pause" : "▶ Play"}
        </button>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 90,
          gap: 20,
        }}
      >
        {sel === 2 ? (
          <div
            style={{
              width: 200,
              height: 40,
              borderRadius: 8,
              background:
                "linear-gradient(90deg, transparent 0%, #f59e0b40 50%, transparent 100%)",
              backgroundSize: "200% 100%",
              animation: running ? anims[sel].css : "none",
            }}
          />
        ) : (
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: sel === 3 ? "50%" : 12,
              background: `linear-gradient(135deg, ${t.accent}, #c084fc)`,
              animation: running ? anims[sel].css : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.8rem",
            }}
          >
            {["✨", "💓", "", "⚙️", "🏀"][sel]}
          </div>
        )}
      </div>
      <pre
        style={{
          margin: 0,
          background: "#080603",
          border: `1px solid ${t.border}`,
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: "0.75rem",
          color: "#c084fc",
          fontFamily: "monospace",
          overflow: "auto",
        }}
      >
        {`@mixin animate($name, $duration: 0.3s, $timing: ease, $fill: none) {
  animation: $name $duration $timing $fill;
}

@keyframes ${anims[sel].name} { /* ... */ }

.element { @include animate(${anims[sel].name}${sel === 1 ? ", 1.2s, ease-in-out" : sel === 3 ? ", 1s, linear" : sel === 4 ? ", 0.8s, ease, alternate" : ""}); }`}
      </pre>
    </div>
  );
}

function ModernSCSSDemo({ t }) {
  const [mode, setMode] = useState("use");
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
        @use vs @import — the modern SCSS module system
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          ["@use (modern ✅)", "use"],
          ["@import (legacy ⚠️)", "import"],
        ].map(([lbl, v]) => (
          <button
            key={v}
            onClick={() => setMode(v)}
            style={{
              background:
                mode === v
                  ? v === "use"
                    ? t.accentBg
                    : "#f8717120"
                  : t.surface,
              color:
                mode === v ? (v === "use" ? t.accent : "#f87171") : t.muted,
              border: `1px solid ${mode === v ? (v === "use" ? t.accentBorder : "#f8717150") : t.border}`,
              borderRadius: 8,
              padding: "7px 16px",
              cursor: "pointer",
              fontSize: "0.82rem",
              fontWeight: 700,
            }}
          >
            {lbl}
          </button>
        ))}
      </div>
      {mode === "use" ? (
        <div>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            {[
              ["✅ Scoped", "No global namespace pollution"],
              ["✅ Lazy", "Loaded once even if imported many times"],
              ["✅ Private", "_private vars inaccessible outside"],
              ["✅ Namespaced", "colors.$primary not just $primary"],
            ].map(([title, desc]) => (
              <div
                key={title}
                style={{
                  flex: "1 1 180px",
                  background: "#22c55e15",
                  border: "1px solid #22c55e30",
                  borderRadius: 8,
                  padding: "10px 12px",
                }}
              >
                <div
                  style={{
                    color: t.success,
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    marginBottom: 3,
                  }}
                >
                  {title}
                </div>
                <div style={{ color: t.muted, fontSize: "0.73rem" }}>
                  {desc}
                </div>
              </div>
            ))}
          </div>
          <pre
            style={{
              margin: 0,
              background: "#080603",
              border: "1px solid #22c55e30",
              borderRadius: 8,
              padding: "10px 12px",
              fontSize: "0.75rem",
              color: "#86efac",
              fontFamily: "monospace",
              overflow: "auto",
            }}
          >
            {`// _colors.scss
$primary: #f59e0b;
$secondary: #c084fc;

// main.scss
@use 'colors';           // Access as colors.$primary
@use 'colors' as c;      // Access as c.$primary
@use 'colors' as *;      // Access as $primary (use sparingly)

.btn { background: colors.$primary; }
`}
          </pre>
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            {[
              ["⚠️ Global", "All vars in one global scope"],
              ["⚠️ Multiple loads", "Same file can load many times"],
              ["⚠️ No privacy", "All vars publicly accessible"],
              ["⚠️ Deprecated", "Will be removed in Dart Sass 2.0"],
            ].map(([title, desc]) => (
              <div
                key={title}
                style={{
                  flex: "1 1 180px",
                  background: "#ef444415",
                  border: "1px solid #ef444430",
                  borderRadius: 8,
                  padding: "10px 12px",
                }}
              >
                <div
                  style={{
                    color: t.danger,
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    marginBottom: 3,
                  }}
                >
                  {title}
                </div>
                <div style={{ color: t.muted, fontSize: "0.73rem" }}>
                  {desc}
                </div>
              </div>
            ))}
          </div>
          <pre
            style={{
              margin: 0,
              background: "#080603",
              border: "1px solid #ef444430",
              borderRadius: 8,
              padding: "10px 12px",
              fontSize: "0.75rem",
              color: "#fca5a5",
              fontFamily: "monospace",
              overflow: "auto",
            }}
          >
            {`// ⚠️ Old way — avoid in new projects
@import 'variables';    // $primary now globally available
@import 'mixins';       // could cause naming conflicts
@import 'components';   // file loaded again even if imported before

// All variables in one flat namespace — fragile!
.btn { background: $primary; }
`}
          </pre>
        </div>
      )}
    </div>
  );
}

function ThemingDemo({ t }) {
  const [theme, setTheme] = useState("amber");
  const themes = {
    amber: {
      "--primary": "#f59e0b",
      "--bg": "#18160f",
      "--surface": "#201e14",
      "--text": "#f0ead8",
    },
    ocean: {
      "--primary": "#0ea5e9",
      "--bg": "#0a1628",
      "--surface": "#0f1e35",
      "--text": "#e0f2fe",
    },
    rose: {
      "--primary": "#f43f5e",
      "--bg": "#1a0812",
      "--surface": "#26101c",
      "--text": "#ffe4e6",
    },
    forest: {
      "--primary": "#22c55e",
      "--bg": "#0a150e",
      "--surface": "#0f1f14",
      "--text": "#dcfce7",
    },
    violet: {
      "--primary": "#a855f7",
      "--bg": "#110a1a",
      "--surface": "#1a1026",
      "--text": "#f3e8ff",
    },
  };
  const th = themes[theme];
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
        CSS Custom Properties + SCSS — real-time theming
      </p>
      <div
        style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 14 }}
      >
        {Object.keys(themes).map((k) => (
          <button
            key={k}
            onClick={() => setTheme(k)}
            style={{
              background:
                theme === k ? themes[k]["--primary"] + "30" : t.surface,
              color: theme === k ? themes[k]["--primary"] : t.muted,
              border: `1px solid ${theme === k ? themes[k]["--primary"] + "60" : t.border}`,
              borderRadius: 8,
              padding: "5px 14px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 700,
              transition: "all 0.2s",
            }}
          >
            {k}
          </button>
        ))}
      </div>
      <div
        style={{
          background: th["--bg"],
          border: `1px solid ${th["--primary"]}40`,
          borderRadius: 12,
          padding: 16,
          transition: "all 0.4s",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontWeight: 800,
              color: th["--text"],
              fontSize: "0.95rem",
            }}
          >
            ⚡ Theme: {theme}
          </div>
          <div
            style={{
              background: th["--primary"],
              color: "#000",
              borderRadius: 20,
              padding: "3px 12px",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            Active
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          <button
            style={{
              background: th["--primary"],
              color: "#000",
              border: "none",
              borderRadius: 7,
              padding: "7px 16px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.82rem",
            }}
          >
            Primary btn
          </button>
          <button
            style={{
              background: "transparent",
              color: th["--primary"],
              border: `2px solid ${th["--primary"]}`,
              borderRadius: 7,
              padding: "6px 14px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.82rem",
            }}
          >
            Outline
          </button>
        </div>
        <div
          style={{
            background: th["--surface"],
            border: `1px solid ${th["--primary"]}30`,
            borderRadius: 9,
            padding: "10px 14px",
            transition: "all 0.4s",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: th["--text"],
              fontSize: "0.85rem",
              marginBottom: 3,
            }}
          >
            Surface Card
          </div>
          <div
            style={{
              color: th["--primary"],
              fontSize: "0.78rem",
              opacity: 0.8,
            }}
          >
            All from --primary: {th["--primary"]}
          </div>
        </div>
      </div>
      <pre
        style={{
          margin: "12px 0 0",
          background: "#080603",
          border: `1px solid ${t.border}`,
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: "0.75rem",
          color: "#fbbf24",
          fontFamily: "monospace",
          overflow: "auto",
        }}
      >
        {`// themes/_${theme}.scss
$primary: ${th["--primary"]};

:root[data-theme="${theme}"] {
  --primary: #{$primary};
  --primary-rgb: #{red($primary)},#{green($primary)},#{blue($primary)};
  --bg: ${th["--bg"]};
  --surface: ${th["--surface"]};
}`}
      </pre>
    </div>
  );
}

const SECTIONS = [
  {
    id: "intro",
    icon: "🎨",
    title: "What is SCSS?",
    subtitle: "CSS with superpowers — variables, nesting, mixins & more",
    body: "SCSS (Sassy CSS) is a CSS preprocessor that adds powerful features to plain CSS: variables, nesting, mixins, functions, loops, and modules. It compiles down to regular CSS — browsers never see SCSS directly. SCSS is a superset of CSS, so all valid CSS is valid SCSS.",
    Demo: IntroDemo,
    code: `// Install & compile
npm install -g sass
sass input.scss output.css
sass --watch src/scss:dist/css

// Or via npm script in package.json
{
  "scripts": {
    "sass": "sass --watch src/scss/main.scss dist/css/main.css"
  }
}

// File structure
scss/
  _variables.scss   // Partials start with underscore
  _mixins.scss
  _base.scss
  _components.scss
  main.scss         // Entry point (no underscore)`,
    tip: "SCSS and Sass are the same preprocessor — SCSS uses curly brace syntax (like CSS), while .sass uses indented syntax. SCSS is far more common.",
  },

  {
    id: "variables",
    icon: "📦",
    title: "Variables",
    subtitle: "Store reusable values — colors, sizes, fonts, breakpoints",
    body: "SCSS variables start with $ and store any CSS value: colors, sizes, fonts, shadows, transition durations. Change one variable and every place it's used updates automatically. Try the live color picker and sliders below.",
    Demo: VariablesDemo,
    code: `// ── Variable declaration
$primary:       #f59e0b;
$secondary:     #c084fc;
$font-stack:    'Inter', system-ui, sans-serif;
$base-font:     16px;
$border-radius: 8px;
$shadow:        0 4px 20px rgba(0, 0, 0, 0.3);
$transition:    all 0.25s ease;

// ── Derived values
$primary-light: lighten($primary, 20%);
$primary-dark:  darken($primary, 15%);

// ── Usage
.button {
  background:    $primary;
  border-radius: $border-radius;
  font-family:   $font-stack;
  transition:    $transition;

  &:hover { background: $primary-dark; }
}

// ── Default values (can be overridden)
$spacing: 1rem !default;`,
    tip: "Always declare all variables in a single _variables.scss partial and @use it everywhere. This is the single source of truth for your design system.",
  },

  {
    id: "nesting",
    icon: "🪆",
    title: "Nesting",
    subtitle: "Write hierarchical CSS that mirrors your HTML structure",
    body: "SCSS nesting lets you write child selectors inside parent selectors, mirroring your HTML structure. The & symbol refers to the parent selector and is essential for BEM, pseudo-classes, and state selectors. Hover the selectors in the demo to trace the hierarchy.",
    Demo: NestingDemo,
    code: `// ── SCSS nesting
.navbar {
  background: $dark;
  padding: 1rem 2rem;

  .nav-list {
    display: flex;
    gap: 1.5rem;
    list-style: none;
  }

  .nav-link {
    color: rgba(white, 0.75);
    text-decoration: none;
    transition: $transition;

    // & = parent selector (.nav-link)
    &:hover   { color: white; }
    &.active  { color: $primary; font-weight: 700; }
    &::after  { content: ''; display: block; }

    // Modifier class
    &--cta {
      background: $primary;
      padding: 0.4rem 1rem;
      border-radius: $radius;
    }
  }
}

// Compiles to:
// .navbar { ... }
// .navbar .nav-link { ... }
// .navbar .nav-link:hover { ... }`,
    tip: "Keep nesting to 3 levels max. Deeper nesting creates overly specific selectors that are hard to override and slow down browsers.",
  },

  {
    id: "mixins",
    icon: "🔧",
    title: "Mixins",
    subtitle: "Reusable blocks of CSS — with or without arguments",
    body: "Mixins are like functions for CSS. Define a block of styles once with @mixin, then reuse it anywhere with @include. Mixins can accept arguments with default values, making them incredibly flexible for patterns like flex centering, media queries, and visual effects.",
    Demo: MixinsDemo,
    code: `// ── Simple mixin
@mixin reset-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

// ── Mixin with arguments + defaults
@mixin flex-center(
  $justify:   center,
  $align:     center,
  $direction: row,
  $gap:       0,
  $shadow:    false
) {
  display:         flex;
  justify-content: $justify;
  align-items:     $align;
  flex-direction:  $direction;
  gap:             $gap;

  @if $shadow {
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
}

// ── @content block mixin
@mixin hover-lift($amount: -4px) {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    transform: translateY($amount);
    @content;   // inject extra styles
  }
}

// ── Usage
.hero    { @include flex-center(center, center, column, 2rem); }
.sidebar { @include flex-center($justify: flex-start, $shadow: true); }
.card    { @include hover-lift(-6px) { box-shadow: 0 12px 40px rgba(0,0,0,0.4); } }`,
    tip: "Use @content inside mixins to let callers inject extra CSS into the mixin's context. This is the pattern behind responsive breakpoint mixins.",
  },

  {
    id: "functions",
    icon: "⚙️",
    title: "Functions",
    subtitle: "Compute values at build time — rem(), color math, ratios",
    body: "SCSS @functions return a computed value — unlike mixins which output CSS rules. The most useful functions are for converting px to rem, generating color scales, and computing layout math. Drag the controls to see the function outputs update live.",
    Demo: FunctionsDemo,
    code: `// ── px → rem converter
@function rem($px, $base: 16px) {
  @return #{$px / $base}rem;
  // rem(24px) → 1.5rem
}

// ── Clamp helper (fluid typography)
@function fluid($min, $max, $min-vw: 375px, $max-vw: 1280px) {
  $slope: ($max - $min) / ($max-vw - $min-vw);
  $intercept: $min - $slope * $min-vw;
  @return clamp(#{$min}, #{$intercept} + #{$slope * 100}vw, #{$max});
}

// ── Color scale generator
@function tint($color, $pct) { @return mix(white, $color, $pct); }
@function shade($color, $pct) { @return mix(black, $color, $pct); }

// ── Contrast checker
@function contrast-color($bg) {
  $luminance: 0.2126 * red($bg) + 0.7152 * green($bg) + 0.0722 * blue($bg);
  @return if($luminance > 128, black, white);
}

// ── Usage
h1 { font-size: rem(40px); }         // → 2.5rem
h2 { font-size: fluid(1.2rem, 2rem); } // → fluid
.badge { color: contrast-color($primary); }`,
    tip: "Functions are pure — they compute a value and return it. Never output CSS properties inside @function. That's what mixins are for.",
  },

  {
    id: "extend",
    icon: "♻️",
    title: "@extend & Placeholders",
    subtitle: "Share CSS rules without code duplication",
    body: "@extend lets one selector inherit all the styles of another. Placeholder selectors (%) are special: they only exist for @extend and never appear in compiled CSS by themselves. Hover the classes in the demo to trace which placeholder they extend.",
    Demo: ExtendDemo,
    code: `// ── Placeholder (never compiles alone)
%btn-base {
  display:        inline-flex;
  align-items:    center;
  padding:        0.6rem 1.4rem;
  border-radius:  $radius;
  font-weight:    700;
  font-size:      0.9rem;
  cursor:         pointer;
  transition:     $transition;
  border:         none;
}

%card-base {
  background:    $surface;
  border-radius: 12px;
  padding:       1.5rem;
  box-shadow:    $shadow;
}

// ── Classes that extend them
.btn-primary   { @extend %btn-base; background: $primary; color: #000; }
.btn-secondary { @extend %btn-base; background: $secondary; }
.btn-ghost     { @extend %btn-base; background: transparent; border: 2px solid $primary; }

.product-card  { @extend %card-base; max-width: 280px; }
.modal-panel   { @extend %card-base; position: fixed; inset: 0; }

// ── Compiled CSS output (rules are GROUPED)
// .btn-primary, .btn-secondary, .btn-ghost { display: inline-flex; ... }`,
    tip: "Prefer @extend %placeholder over @extend .class. Extending a real class inherits ALL its rules including media queries, which can cause bloat.",
  },

  {
    id: "operators",
    icon: "🔢",
    title: "Math & Operators",
    subtitle:
      "SCSS computes layout math, type scales, and ratios at build time",
    body: "SCSS supports +, -, *, /, % (modulo) and math functions like math.pow(), math.round(), math.ceil(). Use the built-in math module for advanced operations. This is perfect for generating grid systems, type scales, and spacing utilities.",
    Demo: OperatorsDemo,
    code: `@use 'sass:math';

// ── Column width calculation
$columns: 12;
$gutter:  1.5rem;

.col { width: math.div(100%, $columns); }   // 8.333%
.col-6 { width: math.div(100%, $columns) * 6; }  // 50%

// ── Modular type scale
$base:  16px;
$ratio: 1.25;  // Major third

$scale: (
  xs:  $base * math.pow($ratio, -2),   // 10.24px
  sm:  $base * math.pow($ratio, -1),   // 12.8px
  md:  $base,                          // 16px
  lg:  $base * math.pow($ratio, 1),    // 20px
  xl:  $base * math.pow($ratio, 2),    // 25px
  2xl: $base * math.pow($ratio, 3),    // 31.25px
);

// ── Spacing scale
@for $i from 0 through 10 {
  .m-#{$i}  { margin:  $i * 0.25rem; }
  .p-#{$i}  { padding: $i * 0.25rem; }
  .gap-#{$i} { gap:    $i * 0.25rem; }
}`,
    tip: "Use @use 'sass:math' and math.div() instead of the / operator for division — the / operator is deprecated in modern SCSS.",
  },

  {
    id: "control",
    icon: "🔀",
    title: "Control Flow",
    subtitle: "@if, @each, @for, @while — generate CSS with logic",
    body: "SCSS control directives let you generate CSS programmatically. @each iterates over lists and maps, @for runs a numeric loop, @if adds conditional styles, and @while loops until a condition is false. Select a directive in the demo to see it generate real CSS.",
    Demo: ControlFlowDemo,
    code: `@use 'sass:list';
@use 'sass:map';

// ── @each over a map
$theme-colors: (primary: #f59e0b, success: #22c55e, danger: #ef4444);

@each $name, $color in $theme-colors {
  .text-#{$name} { color: $color; }
  .bg-#{$name}   { background: $color; }
  .btn-#{$name}  { background: $color; color: contrast-color($color); }
}

// ── @for numeric loop
@for $i from 1 through 12 {
  .col-#{$i} { width: math.div(100%, 12) * $i; }
  .order-#{$i} { order: $i; }
}

// ── @if conditional styles
@mixin btn-size($size) {
  @if $size == 'sm' {
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
  } @else if $size == 'lg' {
    padding: 0.9rem 2rem;
    font-size: 1.1rem;
  } @else {
    padding: 0.6rem 1.4rem;
    font-size: 0.9rem;
  }
}`,
    tip: "@each over maps is the most powerful pattern — define your design tokens once in a $map and generate all utility classes automatically with a single @each.",
  },

  {
    id: "maps",
    icon: "🗺️",
    title: "Maps",
    subtitle: "Key-value data structures for design tokens",
    body: "SCSS maps are key-value data structures, perfect for storing design tokens like color palettes, breakpoints, spacing scales, and z-indexes. Access values with map.get() and iterate with @each. Click the color swatches to see the nested map structure.",
    Demo: MapsDemo,
    code: `@use 'sass:map';

// ── Nested color map (design tokens)
$colors: (
  "primary": (
    "base":  #f59e0b,
    "light": #fcd34d,
    "dark":  #d97706,
  ),
  "success": (
    "base":  #22c55e,
    "light": #86efac,
    "dark":  #15803d,
  ),
);

// ── Breakpoint map
$breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px,
);

// ── Z-index scale
$z-layers: (
  dropdown:  100,
  sticky:    200,
  overlay:   300,
  modal:     400,
  toast:     500,
  tooltip:   600,
);

// ── Access values
$btn-color: map.get($colors, "primary", "base");  // #f59e0b
$modal-z:   map.get($z-layers, "modal");           // 400

// ── Generate from map
@each $name, $shades in $colors {
  @each $shade, $value in $shades {
    .bg-#{$name}-#{$shade} { background: $value; }
  }
}`,
    tip: "Use map.merge() to combine two maps without mutation, and map.deep-merge() to merge nested maps. Perfect for theme overrides.",
  },

  {
    id: "partials",
    icon: "📂",
    title: "Partials & @use",
    subtitle: "Organize SCSS into modules — the right way",
    body: "Partials are SCSS files starting with an underscore (_). They're never compiled directly — only when imported by another file. @use is the modern way to load partials with automatic namespacing. @forward re-exports a module's API for library authors.",
    Demo: PartialDemo,
    code: `// ── File structure
scss/
  abstracts/
    _variables.scss    // $primary, $spacing, etc.
    _mixins.scss       // @mixin definitions
    _functions.scss    // @function definitions
    _index.scss        // @forward everything above
  base/
    _reset.scss
    _typography.scss
  components/
    _buttons.scss
    _cards.scss
    _navbar.scss
  layout/
    _grid.scss
    _header.scss
  main.scss

// ── abstracts/_index.scss
@forward 'variables';
@forward 'mixins';
@forward 'functions';

// ── components/_buttons.scss
@use '../abstracts' as *;  // gets $primary, @mixin flex-center, etc.

.btn {
  background: $primary;
  @include flex-center;
}

// ── main.scss
@use 'abstracts' as *;
@use 'base/reset';
@use 'components/buttons';`,
    tip: "Create an abstracts/_index.scss that @forwards all abstracts. Then any component only needs @use '../abstracts' as * — one import, all tokens.",
  },

  {
    id: "bem",
    icon: "🏗️",
    title: "BEM + SCSS",
    subtitle: "Block, Element, Modifier naming with SCSS nesting",
    body: "BEM (Block__Element--Modifier) is the most popular CSS naming convention. SCSS nesting makes BEM cleaner with the & parent selector — you write .card once and nest &__header, &__body, &--featured inside it. Hover the selectors to trace how they compile.",
    Demo: BEMDemo,
    code: `// ── SCSS BEM with & nesting
.card {
  background:    $surface;
  border-radius: 12px;
  overflow:      hidden;

  // Elements (__) — parts of the block
  &__header {
    padding:    1rem 1.5rem;
    border-bottom: 1px solid $border;
    font-weight: 700;
  }

  &__body {
    padding: 1.5rem;
    flex-grow: 1;
  }

  &__footer {
    padding:    0.75rem 1.5rem;
    background: rgba(black, 0.2);
    font-size:  0.85rem;
    color:      $muted;
  }

  &__image {
    width: 100%;
    object-fit: cover;
    aspect-ratio: 16 / 9;
  }

  // Modifiers (--) — variants of the block
  &--featured {
    border: 2px solid $primary;
    box-shadow: 0 0 30px rgba($primary, 0.3);
  }

  &--horizontal {
    display: flex;
    flex-direction: row;
  }

  &--dark {
    background: $dark;
    color: white;
  }
}`,
    tip: "SCSS nesting isn't required for BEM but it's a perfect pairing. The & stays DRY and keeps all card styles in one block that's easy to find and maintain.",
  },

  {
    id: "responsive",
    icon: "📱",
    title: "Responsive Mixins",
    subtitle: "Breakpoint mixin — write mobile-first media queries cleanly",
    body: "The breakpoint mixin pattern is one of SCSS's killer features. Define all your breakpoints in a map, then write a mixin that generates the @media rule. Every component can then @include respond-to('lg') instead of writing raw media queries. Drag the slider to simulate widths.",
    Demo: BreakpointMixinDemo,
    code: `@use 'sass:map';

// ── Define breakpoints in a map
$breakpoints: (
  xs:   0,
  sm:   576px,
  md:   768px,
  lg:   992px,
  xl:   1200px,
  xxl:  1400px,
);

// ── Mobile-first (min-width) mixin
@mixin respond-to($bp) {
  $value: map.get($breakpoints, $bp);
  @if $value == null {
    @error "Breakpoint '#{$bp}' not found in $breakpoints.";
  }
  @media screen and (min-width: $value) {
    @content;
  }
}

// ── Desktop-first (max-width) variant
@mixin respond-down($bp) {
  $value: map.get($breakpoints, $bp) - 0.02px;
  @media screen and (max-width: $value) { @content; }
}

// ── Usage — clean, readable, centralized
.container {
  padding: 0 1rem;
  @include respond-to(md)  { padding: 0 2rem; }
  @include respond-to(xl)  { max-width: 1200px; margin: 0 auto; }
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  @include respond-to(sm) { grid-template-columns: repeat(2, 1fr); }
  @include respond-to(lg) { grid-template-columns: repeat(4, 1fr); }
}`,
    tip: "Add @error inside the mixin to get a helpful compile error if a typo is passed. @warn gives a non-fatal warning. Both are great for library authors.",
  },

  {
    id: "animations",
    icon: "✨",
    title: "Animations",
    subtitle: "@keyframes helpers + animation mixins",
    body: "SCSS can't create animations CSS can't, but it dramatically cleans up @keyframes authoring. Use @mixin with @content to create animation utility mixins, loop over animation maps with @each, and build reusable motion tokens — just like color tokens.",
    Demo: AnimationDemo,
    code: `// ── Animation mixin
@mixin animate(
  $name,
  $duration:  0.3s,
  $timing:    ease,
  $delay:     0s,
  $iteration: 1,
  $fill:      none
) {
  animation-name:            $name;
  animation-duration:        $duration;
  animation-timing-function: $timing;
  animation-delay:           $delay;
  animation-iteration-count: $iteration;
  animation-fill-mode:       $fill;
}

// ── Keyframe definitions
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.08); }
}

// ── Motion token map
$transitions: (
  fast:   100ms ease,
  normal: 250ms ease,
  slow:   500ms cubic-bezier(0.34, 1.56, 0.64, 1),
);

// ── Usage
.hero-title { @include animate(fadeInUp, 0.6s, ease, 0.1s, 1, forwards); }
.badge      { @include animate(pulse, 1.2s, ease-in-out, 0s, infinite); }

// ── Staggered children
@for $i from 1 through 6 {
  .card:nth-child(#{$i}) { animation-delay: #{$i * 0.1}s; }
}`,
    tip: "Build a $transitions motion map just like your color map. Consistent timing tokens make animations feel cohesive across the whole UI.",
  },

  {
    id: "modern",
    icon: "🚀",
    title: "Modern SCSS (@use)",
    subtitle: "The module system — namespacing, privacy, and @forward",
    body: "SCSS introduced a new module system in 2020: @use replaces @import with proper namespacing, lazy loading, and variable privacy. @forward re-exports a module for others to consume. Toggle the demo to see the difference between legacy @import and modern @use.",
    Demo: ModernSCSSDemo,
    code: `// ── @use — namespaced access (modern ✅)
@use 'sass:math';
@use 'sass:color';
@use 'sass:map';
@use 'sass:list';

@use './variables' as vars;
@use './mixins';         // namespace = 'mixins'
@use './tokens' as *;   // no namespace (use sparingly)

// Access: vars.$primary, mixins.flex-center(), $primary
.btn {
  background:  vars.$primary;
  font-size:   math.div(16px, 1rem) * 1rem;
  @include mixins.flex-center;
}

// ── @forward — re-export for library consumers
// abstracts/_index.scss
@forward 'variables' hide $private-var;
@forward 'mixins' show flex-center, respond-to;

// ── Private variables (only accessible within the file)
// _tokens.scss
$_internal: #ff0000;   // private — _ prefix
$public: #f59e0b;      // accessible via @use

// ── Configure defaults
// _config.scss
$primary: #f59e0b !default;

// consumer.scss
@use 'config' with ($primary: #3b82f6);  // override default`,
    tip: "If you're starting a new project, use @use from day one. If migrating, the sass-migrator tool can auto-convert @import to @use in your codebase.",
  },

  {
    id: "theming",
    icon: "🌗",
    title: "Theming System",
    subtitle: "CSS custom properties + SCSS for runtime theme switching",
    body: "The most powerful SCSS pattern combines SCSS variables (compile-time) with CSS custom properties (runtime). SCSS generates all theme values, outputs them as --custom-props, and JavaScript switches themes by changing a data-theme attribute. Select a theme in the demo.",
    Demo: ThemingDemo,
    code: `// ── Theme definition map
$themes: (
  amber:  (primary: #f59e0b, bg: #18160f, surface: #201e14),
  ocean:  (primary: #0ea5e9, bg: #0a1628, surface: #0f1e35),
  rose:   (primary: #f43f5e, bg: #1a0812, surface: #26101c),
);

// ── Generate theme CSS custom properties
@each $name, $values in $themes {
  [data-theme="#{$name}"] {
    @each $key, $value in $values {
      --#{$key}: #{$value};

      // Also output RGB for opacity usage
      @if type-of($value) == color {
        --#{$key}-rgb: #{red($value)}, #{green($value)}, #{blue($value)};
      }
    }
  }
}

// ── Consuming custom properties in components
.btn-primary {
  background: var(--primary);
  // Opacity using RGB trick:
  box-shadow: 0 4px 20px rgba(var(--primary-rgb), 0.4);
}

// ── JavaScript theme switcher
document.documentElement.setAttribute('data-theme', 'ocean');`,
    tip: "The RGB trick — outputting a separate --primary-rgb: 245, 158, 11 var — lets you use the color in rgba(var(--primary-rgb), 0.3) for transparent variants.",
  },
];

// ── MAIN COMPONENT ────────────────────────────────────────────
export default function SCSSMasterclass() {
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
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px) scale(0.98);}to{opacity:1;transform:none;} }
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:${t.border};border-radius:99px;}
        ::-webkit-scrollbar-thumb:hover{background:${t.muted};}
        input[type=range]{-webkit-appearance:none;height:5px;border-radius:99px;outline:none;cursor:pointer;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:${t.accent};cursor:pointer;}
      `}</style>

      {/* ── HEADER ── */}
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
          boxShadow: darkMode ? "0 1px 0 #0006" : "0 1px 0 #0001",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: `linear-gradient(135deg,${t.accent},#c084fc)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              color: "#000",
              fontSize: "1.1rem",
              flexShrink: 0,
            }}
          >
            S
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
              SCSS Masterclass
            </div>
            <div style={{ color: t.muted, fontSize: "0.67rem" }}>
              Complete interactive guide · Dart Sass
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
            15 lessons
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
                  background: `linear-gradient(90deg,${t.accent},#c084fc)`,
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

          {/* Nav — SCROLLABLE */}
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
              {SECTIONS.length} lessons · Live visual demos
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
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            {/* Lesson heading */}
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
                <span
                  style={{
                    background: t.surface2,
                    border: `1px solid ${t.border}`,
                    borderRadius: 20,
                    padding: "2px 10px",
                    fontSize: "0.68rem",
                    color: t.muted,
                    fontFamily: "monospace",
                  }}
                >
                  dart-sass
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
                        color: t.text,
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

            {/* Demo */}
            {Demo && (
              <div style={{ marginBottom: 24 }}>
                <SLabel color={t.accent}>Interactive Demo</SLabel>
                <Demo t={t} />
              </div>
            )}

            {/* Code */}
            <div style={{ marginBottom: 24 }}>
              <SLabel color="#c084fc">SCSS Code Example</SLabel>
              <Code code={current.code} />
            </div>

            {/* Tip */}
            <div style={{ marginBottom: 32 }}>
              <Tip text={current.tip} t={t} />
            </div>

            {/* Nav buttons */}
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
                      : `linear-gradient(135deg,${t.accent},#c084fc)`,
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
