import { useState, useEffect, useRef } from "react";

const THEMES = {
  dark: {
    bg: "#080c14",
    sidebar: "#0d1117",
    surface: "#111827",
    surface2: "#1c2434",
    border: "#1e2d40",
    text: "#e2eaf6",
    muted: "#6b7fa3",
    accent: "#38bdf8",
    accentBg: "#38bdf810",
    accentBorder: "#38bdf830",
    warn: "#fbbf24",
  },
  light: {
    bg: "#f0f4fc",
    sidebar: "#ffffff",
    surface: "#ffffff",
    surface2: "#f0f4fc",
    border: "#d8e2f0",
    text: "#0f172a",
    muted: "#64748b",
    accent: "#0ea5e9",
    accentBg: "#0ea5e910",
    accentBorder: "#0ea5e930",
    warn: "#d97706",
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
        background: ok ? "#22c55e22" : "#ffffff10",
        border: `1px solid ${ok ? "#22c55e66" : "#ffffff20"}`,
        color: ok ? "#22c55e" : "#94a3b8",
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
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #1e2d40",
      }}
    >
      <div
        style={{
          background: "#060910",
          padding: "14px 16px",
          overflowX: "auto",
        }}
      >
        <pre
          style={{
            margin: 0,
            fontFamily: "'Fira Code','Cascadia Code',monospace",
            fontSize: "0.78rem",
            lineHeight: 1.75,
          }}
        >
          {lines.map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 16 }}>
              <span
                style={{
                  color: "#2d3f58",
                  userSelect: "none",
                  minWidth: 18,
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
                    line.trim().startsWith("<!--")
                      ? "#4a5a7a"
                      : line.includes("class=")
                        ? "#93c5fd"
                        : "#c9d8f0",
                }}
              >
                {line || " "}
              </span>
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
        background: `${t.warn}15`,
        border: `1px solid ${t.warn}40`,
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

function SectionLabel({ children, color = "#38bdf8" }) {
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
        style={{ width: 3, height: 18, background: color, borderRadius: 99 }}
      />
      <span
        style={{
          fontSize: "0.72rem",
          fontWeight: 700,
          color: "#6b7fa3",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        {children}
      </span>
    </div>
  );
}

/* ══ DEMOS ═══════════════════════════════════════════════════════ */

function IntroDemo({ t }) {
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
        Bootstrap Component Showcase
      </p>
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}
      >
        {[
          ["#0d6efd", "btn-primary"],
          ["#198754", "btn-success"],
          ["#dc3545", "btn-danger"],
        ].map(([bg, cls]) => (
          <div
            key={cls}
            style={{
              padding: "7px 16px",
              borderRadius: 6,
              background: bg,
              color: "white",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            .{cls}
          </div>
        ))}
        <div
          style={{
            padding: "7px 16px",
            borderRadius: 6,
            border: "2px solid #0dcaf0",
            color: "#0dcaf0",
            fontSize: "0.82rem",
            fontWeight: 600,
          }}
        >
          .btn-outline-info
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div
          style={{
            flex: "1 1 180px",
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 72,
              background: "linear-gradient(135deg,#0d6efd,#6f42c1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: "0.85rem",
            }}
          >
            Card Image
          </div>
          <div style={{ padding: 12 }}>
            <div
              style={{
                fontWeight: 700,
                color: t.text,
                marginBottom: 4,
                fontSize: "0.88rem",
              }}
            >
              Bootstrap Card
            </div>
            <div
              style={{ color: t.muted, fontSize: "0.77rem", marginBottom: 8 }}
            >
              Flexible content container.
            </div>
            <div
              style={{
                background: "#0d6efd",
                color: "white",
                borderRadius: 5,
                padding: "4px 10px",
                display: "inline-block",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              Learn more →
            </div>
          </div>
        </div>
        <div
          style={{
            flex: "1 1 180px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {[
            ["#0d6efd22", "#0d6efd55", "#6ea8fe", "ℹ️ Primary alert"],
            ["#19875422", "#19875455", "#75b798", "✅ Success alert"],
            ["#dc354522", "#dc354555", "#ea868f", "⚠️ Danger alert"],
          ].map(([bg, bd, cl, txt]) => (
            <div
              key={txt}
              style={{
                background: bg,
                border: `1px solid ${bd}`,
                color: cl,
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: "0.8rem",
              }}
            >
              {txt}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        {[
          ["#dc3545", "Danger"],
          ["#198754", "Success"],
          ["#0d6efd", "9"],
          ["#6f42c1", "New"],
        ].map(([bg, txt]) => (
          <span
            key={txt}
            style={{
              background: bg,
              color: "white",
              borderRadius: 20,
              padding: "3px 10px",
              fontSize: "0.72rem",
              fontWeight: 700,
            }}
          >
            {txt}
          </span>
        ))}
        <span
          style={{
            background: "#ffc107",
            color: "#000",
            borderRadius: 20,
            padding: "3px 10px",
            fontSize: "0.72rem",
            fontWeight: 700,
          }}
        >
          Warning
        </span>
      </div>
    </div>
  );
}

function GridDemo({ t }) {
  const [sel, setSel] = useState(2);
  const configs = [[12], [6, 6], [4, 4, 4], [3, 3, 3, 3], [8, 4], [3, 6, 3]];
  const clrs = [
    "#0d6efd",
    "#6f42c1",
    "#0dcaf0",
    "#198754",
    "#ffc107",
    "#d63384",
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
          margin: "0 0 10px",
          color: t.muted,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Interactive 12-Column Grid
      </p>
      <div
        style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}
      >
        {configs.map((cfg, i) => (
          <button
            key={i}
            onClick={() => setSel(i)}
            style={{
              background: sel === i ? t.accent : t.surface,
              color: sel === i ? "#000" : t.muted,
              border: `1px solid ${sel === i ? t.accent : t.border}`,
              borderRadius: 6,
              padding: "4px 10px",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            {cfg.join("+")}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
        {configs[sel].map((span, i) => (
          <div
            key={i}
            style={{
              flex: span,
              background: clrs[i % clrs.length],
              borderRadius: 8,
              padding: "12px 6px",
              textAlign: "center",
              color: "white",
              fontSize: "0.78rem",
              fontWeight: 700,
              boxShadow: `0 4px 12px ${clrs[i % clrs.length]}50`,
              transition: "all 0.3s",
            }}
          >
            .col-{span}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 3 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 5,
              borderRadius: 3,
              background: i < configs[sel][0] ? t.accent + "60" : t.border,
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <p style={{ margin: "6px 0 0", color: t.muted, fontSize: "0.72rem" }}>
        12 total columns — numbers must add up to 12
      </p>
    </div>
  );
}

function BreakpointDemo({ t }) {
  const [active, setActive] = useState(2);
  const bps = [
    { label: "xs", size: "<576px", emoji: "📱", color: "#0d6efd", cols: 1 },
    { label: "sm", size: "≥576px", emoji: "📱", color: "#6f42c1", cols: 1 },
    { label: "md", size: "≥768px", emoji: "💻", color: "#0dcaf0", cols: 2 },
    { label: "lg", size: "≥992px", emoji: "🖥️", color: "#198754", cols: 3 },
    { label: "xl", size: "≥1200px", emoji: "🖥️", color: "#ffc107", cols: 4 },
    { label: "xxl", size: "≥1400px", emoji: "📺", color: "#dc3545", cols: 4 },
  ];
  const bp = bps[active];
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
        Click a breakpoint to preview layout
      </p>
      <div
        style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}
      >
        {bps.map((b, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              background: active === i ? b.color + "30" : t.surface,
              color: active === i ? b.color : t.muted,
              border: `1px solid ${active === i ? b.color : t.border}`,
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 700,
              transition: "all 0.2s",
            }}
          >
            {b.emoji} {b.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: Math.max(220, active * 70 + 220),
            maxWidth: "100%",
            transition: "width 0.4s cubic-bezier(.34,1.56,.64,1)",
            background: t.surface,
            border: `2px solid ${bp.color}`,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: `0 0 24px ${bp.color}35`,
          }}
        >
          <div
            style={{
              background: bp.color,
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>{bp.emoji}</span>
            <span
              style={{ color: "white", fontWeight: 700, fontSize: "0.8rem" }}
            >
              {bp.label.toUpperCase()} — {bp.size}
            </span>
          </div>
          <div style={{ padding: 10, display: "flex", gap: 6 }}>
            {Array.from({ length: bp.cols }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: bp.color + "25",
                  border: `1px solid ${bp.color}50`,
                  borderRadius: 6,
                  padding: "8px 4px",
                  textAlign: "center",
                  color: bp.color,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                }}
              >
                col
              </div>
            ))}
          </div>
          <div
            style={{
              padding: "0 10px 10px",
              color: t.muted,
              fontSize: "0.72rem",
              fontFamily: "monospace",
            }}
          >
            {bp.cols === 1 ? ".col-12 (stacked)" : `.row-cols-${bp.cols}`}
          </div>
        </div>
      </div>
    </div>
  );
}

function TypographyDemo({ t }) {
  const entries = [
    { cls: "display-1", size: "4rem", fw: 300, sample: "Hero" },
    { cls: "display-3", size: "2.8rem", fw: 300, sample: "Section" },
    { cls: "h1", size: "2.2rem", fw: 700, sample: "Heading 1" },
    { cls: "h3", size: "1.6rem", fw: 600, sample: "Heading 3" },
    { cls: "lead", size: "1.15rem", fw: 400, sample: "Lead paragraph text" },
    { cls: "p", size: "1rem", fw: 400, sample: "Body text, normal size" },
    {
      cls: "small",
      size: "0.875rem",
      fw: 400,
      sample: "Small / fine print text",
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
        Type Scale Visual
      </p>
      {entries.map((e, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            paddingBottom: 8,
            marginBottom: 8,
            borderBottom: `1px solid ${t.border}`,
          }}
        >
          <code
            style={{
              minWidth: 72,
              color: t.accent,
              fontSize: "0.7rem",
              flexShrink: 0,
            }}
          >
            .{e.cls}
          </code>
          <span
            style={{
              fontSize: e.size,
              fontWeight: e.fw,
              color: t.text,
              lineHeight: 1.1,
              transition: "all 0.2s",
            }}
          >
            {e.sample}
          </span>
          <span
            style={{
              marginLeft: "auto",
              color: t.muted,
              fontSize: "0.68rem",
              flexShrink: 0,
            }}
          >
            {e.size}
          </span>
        </div>
      ))}
    </div>
  );
}

function ColorsDemo({ t }) {
  const palette = [
    { name: "primary", hex: "#0d6efd" },
    { name: "secondary", hex: "#6c757d" },
    { name: "success", hex: "#198754" },
    { name: "danger", hex: "#dc3545" },
    { name: "warning", hex: "#ffc107" },
    { name: "info", hex: "#0dcaf0" },
    { name: "dark", hex: "#212529" },
  ];
  const [hov, setHov] = useState(null);
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
        Hover a color to see all utility classes
      </p>
      <div
        style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}
      >
        {palette.map((c, i) => (
          <div
            key={i}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            style={{
              cursor: "pointer",
              textAlign: "center",
              transition: "transform 0.2s",
              transform: hov === i ? "translateY(-6px) scale(1.08)" : "none",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                background: c.hex,
                boxShadow:
                  hov === i ? `0 10px 24px ${c.hex}70` : "0 2px 8px #00000030",
                transition: "all 0.2s",
              }}
            />
            <div
              style={{
                fontSize: "0.68rem",
                color: t.muted,
                marginTop: 4,
                fontFamily: "monospace",
              }}
            >
              {c.name}
            </div>
          </div>
        ))}
      </div>
      {hov !== null && (
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            animation: "fadeIn 0.2s ease",
          }}
        >
          {[
            {
              style: { background: palette[hov].hex, color: "white" },
              label: `.bg-${palette[hov].name}`,
            },
            {
              style: {
                background: "transparent",
                color: palette[hov].hex,
                border: `1px solid ${t.border}`,
              },
              label: `.text-${palette[hov].name}`,
            },
            {
              style: {
                background: palette[hov].hex,
                color: "white",
                borderRadius: 20,
              },
              label: `.badge bg-${palette[hov].name}`,
            },
            {
              style: {
                background: "transparent",
                color: palette[hov].hex,
                border: `2px solid ${palette[hov].hex}`,
              },
              label: `.btn-outline-${palette[hov].name}`,
            },
          ].map((item, j) => (
            <div
              key={j}
              style={{
                ...item.style,
                padding: "5px 12px",
                borderRadius: item.style.borderRadius || 6,
                fontSize: "0.75rem",
                fontFamily: "monospace",
                fontWeight: 600,
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SpacingDemo({ t }) {
  const [scale, setScale] = useState(3);
  const sizes = ["0", "0.25rem", "0.5rem", "1rem", "1.5rem", "3rem"];
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
        Spacing Scale Visualizer — drag slider
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <code style={{ color: t.muted, fontSize: "0.8rem", minWidth: 60 }}>
          scale: {scale}
        </code>
        <input
          type="range"
          min={0}
          max={5}
          value={scale}
          onChange={(e) => setScale(+e.target.value)}
          style={{ flex: 1, accentColor: t.accent, cursor: "pointer" }}
        />
        <code style={{ color: t.accent, fontSize: "0.8rem", minWidth: 60 }}>
          {sizes[scale]}
        </code>
      </div>
      <div
        style={{
          display: "flex",
          gap: 24,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {[
          ["m", "margin", "#0d6efd"],
          ["p", "padding", "#6f42c1"],
        ].map(([abbr, label, color]) => (
          <div key={abbr} style={{ textAlign: "center" }}>
            <p
              style={{
                color: t.muted,
                fontSize: "0.75rem",
                marginBottom: 8,
                fontFamily: "monospace",
              }}
            >
              .{abbr}-{scale} ({label})
            </p>
            <div
              style={{
                display: "inline-flex",
                background: color + "15",
                border: `2px dashed ${color}50`,
                borderRadius: 8,
                padding: abbr === "p" ? `${scale * 10 + 4}px` : "8px",
                transition: "padding 0.3s",
              }}
            >
              <div
                style={{
                  margin: abbr === "m" ? `${scale * 10}px` : 0,
                  background: color,
                  borderRadius: 6,
                  width: 64,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  transition: "margin 0.3s",
                }}
              >
                box
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 6, flexWrap: "wrap" }}>
        {[
          "m",
          "mt",
          "mb",
          "ms",
          "me",
          "mx",
          "my",
          "p",
          "pt",
          "pb",
          "px",
          "py",
        ].map((cls) => (
          <code
            key={cls}
            style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: 5,
              padding: "2px 8px",
              fontSize: "0.72rem",
              color: t.accent,
            }}
          >
            .{cls}-{scale}
          </code>
        ))}
      </div>
    </div>
  );
}

function FlexDemo({ t }) {
  const [justify, setJustify] = useState("space-between");
  const [align, setAlign] = useState("center");
  const [dir, setDir] = useState("row");
  const jMap = {
    "flex-start": "start",
    center: "center",
    "flex-end": "end",
    "space-between": "between",
    "space-around": "around",
  };
  const controls = [
    {
      label: "justify-content",
      val: justify,
      set: setJustify,
      opts: [
        "flex-start",
        "center",
        "flex-end",
        "space-between",
        "space-around",
      ],
    },
    {
      label: "align-items",
      val: align,
      set: setAlign,
      opts: ["flex-start", "center", "flex-end", "stretch"],
    },
    { label: "flex-direction", val: dir, set: setDir, opts: ["row", "column"] },
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
        Flexbox Playground — click to adjust
      </p>
      <div
        style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 14 }}
      >
        {controls.map(({ label, val, set, opts }) => (
          <div key={label}>
            <code
              style={{
                display: "block",
                color: t.muted,
                fontSize: "0.7rem",
                marginBottom: 5,
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
                    background: val === o ? t.accent + "30" : t.surface,
                    color: val === o ? t.accent : t.muted,
                    border: `1px solid ${val === o ? t.accent : t.border}`,
                    borderRadius: 5,
                    padding: "3px 8px",
                    cursor: "pointer",
                    fontSize: "0.7rem",
                    fontFamily: "monospace",
                    transition: "all 0.15s",
                  }}
                >
                  {o.replace("flex-", "").replace("space-", "")}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          background: t.surface,
          border: `2px dashed ${t.border}`,
          borderRadius: 10,
          padding: 16,
          minHeight: 100,
          display: "flex",
          justifyContent: justify,
          alignItems: align,
          flexDirection: dir,
          gap: "12px",
          transition: "all 0.3s",
        }}
      >
        {["A", "B", "C"].map((l, i) => (
          <div
            key={l}
            style={{
              background: ["#0d6efd", "#6f42c1", "#0dcaf0"][i],
              color: "white",
              borderRadius: 8,
              width: 50,
              height: [50, 60, 42][i],
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
      <code
        style={{
          display: "block",
          marginTop: 8,
          color: t.muted,
          fontSize: "0.72rem",
        }}
      >
        d-flex flex-{dir} justify-content-{jMap[justify]} align-items-
        {align.replace("flex-", "")}
      </code>
    </div>
  );
}

function ButtonsDemo({ t }) {
  const [loading, setLoading] = useState(false);
  const variants = [
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
  ];
  const hex = {
    primary: "#0d6efd",
    secondary: "#6c757d",
    success: "#198754",
    danger: "#dc3545",
    warning: "#ffc107",
    info: "#0dcaf0",
  };
  const dark = { warning: true, info: true };
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
        Live Button Gallery
      </p>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 10 }}
      >
        {variants.map((v) => (
          <button
            key={v}
            style={{
              background: hex[v],
              color: dark[v] ? "#000" : "white",
              border: "none",
              borderRadius: 6,
              padding: "7px 14px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.filter = "brightness(0.85)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
          >
            .btn-{v}
          </button>
        ))}
      </div>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 14 }}
      >
        {["primary", "success", "danger", "warning"].map((v) => (
          <button
            key={v}
            style={{
              background: "transparent",
              color: hex[v],
              border: `2px solid ${hex[v]}`,
              borderRadius: 6,
              padding: "6px 12px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            .btn-outline-{v}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {[
          ["btn-sm", "5px 10px", "0.72rem"],
          ["", "8px 16px", "0.85rem"],
          ["btn-lg", "12px 22px", "1rem"],
        ].map(([cls, pad, fs]) => (
          <button
            key={cls}
            style={{
              background: "#0d6efd",
              color: "white",
              border: "none",
              borderRadius: 6,
              padding: pad,
              cursor: "pointer",
              fontSize: fs,
              fontWeight: 600,
            }}
          >
            {cls || "Normal"}
          </button>
        ))}
        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 2200);
          }}
          style={{
            background: loading ? "#6c757d" : "#0d6efd",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: "0.82rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          {loading && (
            <span
              style={{
                width: 13,
                height: 13,
                border: "2px solid #fff4",
                borderTopColor: "white",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
              }}
            />
          )}
          {loading ? "Processing..." : "▶ Try loading"}
        </button>
        <div
          style={{
            display: "flex",
            borderRadius: 6,
            overflow: "hidden",
            border: "1px solid #0d6efd",
          }}
        >
          {["L", "M", "R"].map((l, i) => (
            <button
              key={l}
              style={{
                background: "transparent",
                color: "#0d6efd",
                border: "none",
                borderLeft: i > 0 ? "1px solid #0d6efd" : "none",
                padding: "6px 14px",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CardsDemo({ t }) {
  const cards = [
    {
      title: "Mountains",
      desc: "Alpine peaks and trails.",
      tag: "Adventure",
      color: "#0d6efd",
    },
    {
      title: "Oceans",
      desc: "Dive into the deep blue.",
      tag: "Nature",
      color: "#0dcaf0",
    },
    {
      title: "Cities",
      desc: "Urban architecture & culture.",
      tag: "Travel",
      color: "#6f42c1",
    },
  ];
  const [hov, setHov] = useState(null);
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
        Card Grid — hover to lift
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {cards.map((c, i) => (
          <div
            key={i}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            style={{
              flex: "1 1 150px",
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: 12,
              overflow: "hidden",
              transition: "transform 0.25s, box-shadow 0.25s",
              transform: hov === i ? "translateY(-6px)" : "none",
              boxShadow: hov === i ? `0 14px 32px ${c.color}35` : "none",
            }}
          >
            <div
              style={{
                height: 76,
                background: `linear-gradient(135deg,${c.color}cc,${c.color}44)`,
                display: "flex",
                alignItems: "flex-end",
                padding: "8px 10px",
              }}
            >
              <span
                style={{
                  background: "#ffffff25",
                  backdropFilter: "blur(6px)",
                  color: "white",
                  borderRadius: 20,
                  padding: "2px 9px",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                }}
              >
                {c.tag}
              </span>
            </div>
            <div style={{ padding: 12 }}>
              <div
                style={{
                  fontWeight: 700,
                  color: t.text,
                  marginBottom: 3,
                  fontSize: "0.87rem",
                }}
              >
                {c.title}
              </div>
              <div
                style={{ color: t.muted, fontSize: "0.77rem", marginBottom: 9 }}
              >
                {c.desc}
              </div>
              <div
                style={{
                  background: c.color,
                  color: "white",
                  borderRadius: 5,
                  padding: "4px 10px",
                  display: "inline-block",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                }}
              >
                Read more
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 10,
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: 10,
          padding: 12,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 8,
            background: "linear-gradient(135deg,#0d6efd,#6f42c1)",
            flexShrink: 0,
          }}
        />
        <div>
          <div style={{ fontWeight: 700, color: t.text, fontSize: "0.85rem" }}>
            Horizontal Card
          </div>
          <div style={{ color: t.muted, fontSize: "0.77rem" }}>
            Use .card.flex-row for side-by-side layout.
          </div>
        </div>
      </div>
    </div>
  );
}

function NavbarDemo({ t }) {
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
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
        Live Navbar — click ☰ and dropdown
      </p>
      <div
        style={{
          background: "#0d1117",
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid #1e2d40",
        }}
      >
        <div
          style={{
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: "white", fontWeight: 800, fontSize: "1rem" }}>
            ⚡ NavBrand
          </span>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 14 }}>
              {["Home", "About"].map((l) => (
                <span
                  key={l}
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "white")}
                  onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
                >
                  {l}
                </span>
              ))}
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                  onClick={() => setDropOpen((d) => !d)}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#94a3b8")
                  }
                >
                  Products ▾
                </span>
                {dropOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      marginTop: 8,
                      background: "#1c2434",
                      border: "1px solid #1e2d40",
                      borderRadius: 8,
                      minWidth: 150,
                      zIndex: 100,
                      boxShadow: "0 8px 24px #00000060",
                    }}
                  >
                    {["Analytics", "Dashboard", "Reports", "Settings"].map(
                      (item) => (
                        <div
                          key={item}
                          style={{
                            padding: "8px 14px",
                            color: "#94a3b8",
                            fontSize: "0.82rem",
                            cursor: "pointer",
                            borderBottom: "1px solid #1e2d4060",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#ffffff08")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          {item}
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
            <button
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 6,
                padding: "4px 12px",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Sign in
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              style={{
                background: "#1e2535",
                color: "#94a3b8",
                border: "1px solid #30363d",
                borderRadius: 6,
                padding: "5px 9px",
                cursor: "pointer",
              }}
            >
              ☰
            </button>
          </div>
        </div>
        {open && (
          <div
            style={{
              background: "#060910",
              borderTop: "1px solid #1e2d40",
              padding: "10px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {["Home", "About", "Products", "Blog", "Contact"].map((l) => (
              <div
                key={l}
                style={{
                  color: "#94a3b8",
                  fontSize: "0.83rem",
                  padding: "8px 0",
                  borderBottom: "1px solid #1e2d4040",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
              >
                {l}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FormsDemo({ t }) {
  const [email, setEmail] = useState("");
  const [radio, setRadio] = useState("b");
  const [check, setCheck] = useState(false);
  const [range, setRange] = useState(60);
  const valid = email.includes("@") && email.includes(".");
  const invalid = email.length > 0 && !valid;
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
        Form Controls — type to see validation
      </p>
      <div style={{ marginBottom: 12 }}>
        <label
          style={{
            fontSize: "0.8rem",
            color: t.muted,
            display: "block",
            marginBottom: 4,
          }}
        >
          Email address
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "9px 12px",
            borderRadius: 8,
            border: `1.5px solid ${valid ? "#198754" : invalid ? "#dc3545" : t.border}`,
            background: t.surface,
            color: t.text,
            fontSize: "0.85rem",
            outline: "none",
            transition: "border 0.2s",
          }}
        />
        {valid && (
          <div style={{ color: "#198754", fontSize: "0.75rem", marginTop: 4 }}>
            ✓ Looks good!
          </div>
        )}
        {invalid && (
          <div style={{ color: "#dc3545", fontSize: "0.75rem", marginTop: 4 }}>
            ✗ Please enter a valid email
          </div>
        )}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label
          style={{
            fontSize: "0.8rem",
            color: t.muted,
            display: "block",
            marginBottom: 4,
          }}
        >
          Select plan
        </label>
        <select
          style={{
            width: "100%",
            padding: "9px 12px",
            borderRadius: 8,
            border: `1.5px solid ${t.border}`,
            background: t.surface,
            color: t.text,
            fontSize: "0.85rem",
            outline: "none",
            cursor: "pointer",
          }}
        >
          {["Free tier", "Pro — $9/mo", "Enterprise"].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div
        style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}
      >
        {["Option A", "Option B", "Option C"].map((o, i) => (
          <label
            key={o}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              cursor: "pointer",
              fontSize: "0.82rem",
              color: t.text,
            }}
          >
            <input
              type="radio"
              checked={radio === "abc"[i]}
              onChange={() => setRadio("abc"[i])}
              style={{ accentColor: t.accent, width: 15, height: 15 }}
            />
            {o}
          </label>
        ))}
      </div>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          fontSize: "0.82rem",
          color: t.text,
          marginBottom: 12,
        }}
      >
        <input
          type="checkbox"
          checked={check}
          onChange={(e) => setCheck(e.target.checked)}
          style={{ accentColor: t.accent, width: 16, height: 16 }}
        />
        I agree to the Terms & Conditions
      </label>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.78rem",
            color: t.muted,
            marginBottom: 4,
          }}
        >
          <span>Range input (.form-range)</span>
          <strong style={{ color: t.accent }}>{range}</strong>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={range}
          onChange={(e) => setRange(+e.target.value)}
          style={{ width: "100%", accentColor: t.accent, cursor: "pointer" }}
        />
      </div>
    </div>
  );
}

function ModalDemo({ t }) {
  const [open, setOpen] = useState(false);
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
        Live Modal — fully interactive
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            background: "#0d6efd",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.9rem",
          }}
        >
          🪟 Open Modal
        </button>
        <button
          style={{
            background: "transparent",
            color: "#0d6efd",
            border: "2px solid #0d6efd",
            borderRadius: 8,
            padding: "10px 18px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.85rem",
          }}
        >
          Outline trigger
        </button>
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
        {["modal-sm", "modal-lg", "modal-xl", "modal-fullscreen"].map((s) => (
          <code
            key={s}
            style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: 5,
              padding: "3px 8px",
              fontSize: "0.72rem",
              color: t.accent,
            }}
          >
            .{s}
          </code>
        ))}
      </div>
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#00000080",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: 16,
              width: "90%",
              maxWidth: 440,
              boxShadow: "0 24px 64px #00000070",
              animation: "fadeIn 0.22s ease",
            }}
          >
            <div
              style={{
                padding: "18px 22px",
                borderBottom: `1px solid ${t.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontWeight: 800, color: t.text, fontSize: "1.05rem" }}
              >
                🎉 Modal Title
              </span>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: t.surface2,
                  border: `1px solid ${t.border}`,
                  color: t.muted,
                  borderRadius: 8,
                  width: 28,
                  height: 28,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: "18px 22px" }}>
              <p
                style={{
                  margin: "0 0 12px",
                  color: t.muted,
                  fontSize: "0.88rem",
                  lineHeight: 1.65,
                }}
              >
                Bootstrap modals support headers, scrollable bodies, and
                footers. Use data-bs-toggle and data-bs-target without writing
                any JavaScript.
              </p>
              <div
                style={{
                  background: t.surface2,
                  border: `1px solid ${t.border}`,
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontSize: "0.8rem",
                  color: t.muted,
                }}
              >
                Any content can go here — forms, tables, images, or rich text.
              </div>
            </div>
            <div
              style={{
                padding: "14px 22px",
                borderTop: `1px solid ${t.border}`,
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: t.surface2,
                  border: `1px solid ${t.border}`,
                  color: t.text,
                  borderRadius: 8,
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.83rem",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "#0d6efd",
                  border: "none",
                  color: "white",
                  borderRadius: 8,
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.83rem",
                }}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DisplayDemo({ t }) {
  const [bp, setBp] = useState(2);
  const bps = [
    { name: "xs", emoji: "📱" },
    { name: "sm", emoji: "📱" },
    { name: "md", emoji: "💻" },
    { name: "lg", emoji: "🖥️" },
    { name: "xl", emoji: "📺" },
  ];
  const rules = [
    { cls: "d-block d-md-none", label: "Mobile only", vis: bp < 2 },
    { cls: "d-none d-md-block", label: "Desktop only", vis: bp >= 2 },
    {
      cls: "d-none d-sm-block d-xl-none",
      label: "sm → xl range",
      vis: bp >= 1 && bp < 4,
    },
    { cls: "d-flex d-lg-none", label: "Flex until lg", vis: bp < 3 },
    { cls: "d-block", label: "Always visible", vis: true },
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
        Simulate a screen size — see what's visible
      </p>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {bps.map((b, i) => (
          <button
            key={b.name}
            onClick={() => setBp(i)}
            style={{
              background: bp === i ? "#0d6efd" : t.surface,
              color: bp === i ? "white" : t.muted,
              border: `1px solid ${bp === i ? "#0d6efd" : t.border}`,
              borderRadius: 8,
              padding: "7px 14px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 700,
              transition: "all 0.2s",
            }}
          >
            {b.emoji} {b.name}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {rules.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              borderRadius: 8,
              background: r.vis ? t.accentBg : t.surface,
              border: `1px solid ${r.vis ? t.accentBorder : t.border}`,
              transition: "all 0.3s",
              opacity: r.vis ? 1 : 0.45,
            }}
          >
            <span style={{ fontSize: "1rem" }}>{r.vis ? "✅" : "🚫"}</span>
            <code style={{ color: t.accent, fontSize: "0.78rem", flex: 1 }}>
              .{r.cls}
            </code>
            <span
              style={{ color: r.vis ? t.text : t.muted, fontSize: "0.79rem" }}
            >
              {r.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UtilitiesDemo({ t }) {
  const [shadow, setShadow] = useState("shadow");
  const [rounded, setRounded] = useState("rounded");
  const [opacity, setOpacity] = useState("100");
  const shadows = {
    "shadow-none": "none",
    "shadow-sm": "0 1px 6px #00000030",
    shadow: "0 4px 18px #00000045",
    "shadow-lg": "0 12px 40px #00000060",
  };
  const roundeds = {
    "rounded-0": 0,
    "rounded-1": 4,
    rounded: 8,
    "rounded-3": 16,
    "rounded-pill": 999,
    "rounded-circle": "50%",
  };
  const opacities = { 100: "1", 75: "0.75", 50: "0.5", 25: "0.25" };
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
        Visual Utility Playground
      </p>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {[
          {
            label: "shadow",
            val: shadow,
            set: setShadow,
            opts: Object.keys(shadows),
          },
          {
            label: "rounded",
            val: rounded,
            set: setRounded,
            opts: Object.keys(roundeds),
          },
          {
            label: "opacity",
            val: opacity,
            set: setOpacity,
            opts: Object.keys(opacities),
          },
        ].map(({ label, val, set, opts }) => (
          <div key={label}>
            <code
              style={{
                display: "block",
                color: t.muted,
                fontSize: "0.72rem",
                marginBottom: 5,
              }}
            >
              {label}
            </code>
            {opts.map((o) => (
              <button
                key={o}
                onClick={() => set(o)}
                style={{
                  display: "block",
                  marginBottom: 3,
                  background: val === o ? t.accentBg : t.surface,
                  color: val === o ? t.accent : t.muted,
                  border: `1px solid ${val === o ? t.accentBorder : t.border}`,
                  borderRadius: 5,
                  padding: "3px 10px",
                  cursor: "pointer",
                  fontSize: "0.72rem",
                  fontFamily: "monospace",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                .{o}
              </button>
            ))}
          </div>
        ))}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 120,
          }}
        >
          <div
            style={{
              width: 110,
              height: 80,
              background: "linear-gradient(135deg,#0d6efd,#6f42c1)",
              boxShadow: shadows[shadow],
              borderRadius: roundeds[rounded],
              opacity: opacities[opacity],
              transition: "all 0.35s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 800,
              fontSize: "0.85rem",
            }}
          >
            Preview
          </div>
        </div>
      </div>
    </div>
  );
}

function SpinnersDemo({ t }) {
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setProg((p) => (p >= 100 ? 0 : p + 0.8)), 60);
    return () => clearInterval(id);
  }, []);
  const colors = [
    "#0d6efd",
    "#198754",
    "#dc3545",
    "#ffc107",
    "#0dcaf0",
    "#6f42c1",
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
        Spinners, Progress & Skeletons
      </p>
      <div
        style={{
          display: "flex",
          gap: 18,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        {colors.map((c, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 5,
            }}
          >
            {i % 2 === 0 ? (
              <div
                style={{
                  width: 30,
                  height: 30,
                  border: `3px solid ${c}35`,
                  borderTopColor: c,
                  borderRadius: "50%",
                  animation: "spin 0.75s linear infinite",
                }}
              />
            ) : (
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: c,
                  animation: "growPulse 1s ease-in-out infinite alternate",
                }}
              />
            )}
            <code style={{ fontSize: "0.62rem", color: t.muted }}>
              {i % 2 === 0 ? "border" : "grow"}
            </code>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.78rem",
            color: t.muted,
            marginBottom: 5,
          }}
        >
          <span>Animated striped progress bar</span>
          <strong style={{ color: t.accent }}>{Math.round(prog)}%</strong>
        </div>
        <div
          style={{
            background: t.border,
            borderRadius: 99,
            height: 20,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${prog}%`,
              height: "100%",
              background:
                "repeating-linear-gradient(45deg,#0d6efd 0px,#0d6efd 10px,#0a5fd0 10px,#0a5fd0 20px)",
              transition: "width 0.1s",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: 8,
            }}
          >
            {prog > 10 && (
              <span
                style={{ color: "white", fontSize: "0.68rem", fontWeight: 700 }}
              >
                {Math.round(prog)}%
              </span>
            )}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            style={{
              flex: 1,
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: 10,
              padding: 12,
            }}
          >
            {[80, 55, 40].map((w, j) => (
              <div
                key={j}
                style={{
                  height: j === 0 ? 12 : 8,
                  background: t.border,
                  borderRadius: 99,
                  marginBottom: j < 2 ? 7 : 0,
                  width: `${w}%`,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(90deg,transparent,${t.muted}25,transparent)`,
                    animation: "shimmer 1.8s infinite",
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function DarkModeDemo({ t }) {
  const [dm, setDm] = useState(true);
  const d = dm
    ? {
        bg: "#212529",
        card: "#2d3238",
        text: "#f8f9fa",
        muted: "#adb5bd",
        border: "#495057",
        btn: "#0d6efd",
      }
    : {
        bg: "#f8f9fa",
        card: "#ffffff",
        text: "#212529",
        muted: "#6c757d",
        border: "#dee2e6",
        btn: "#0d6efd",
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
        Bootstrap 5.3 Native Theme Switching
      </p>
      <div
        style={{
          background: d.bg,
          borderRadius: 12,
          padding: 16,
          border: `1px solid ${d.border}`,
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
          <code style={{ fontWeight: 700, color: d.text, fontSize: "0.85rem" }}>
            data-bs-theme="{dm ? "dark" : "light"}"
          </code>
          <button
            onClick={() => setDm((d) => !d)}
            style={{
              background: dm ? "#6f42c1" : "#ffc107",
              border: "none",
              color: dm ? "white" : "#000",
              borderRadius: 20,
              padding: "6px 14px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.82rem",
              transition: "all 0.3s",
            }}
          >
            {dm ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
        <div
          style={{
            display: "flex",
            gap: 7,
            flexWrap: "wrap",
            marginBottom: 10,
          }}
        >
          {[
            ["#0d6efd", "Primary"],
            ["#198754", "Success"],
            ["#dc3545", "Danger"],
          ].map(([bg, name]) => (
            <div
              key={name}
              style={{
                background: bg,
                color: "white",
                borderRadius: 6,
                padding: "5px 12px",
                fontSize: "0.78rem",
                fontWeight: 600,
              }}
            >
              {name}
            </div>
          ))}
        </div>
        <div
          style={{
            background: d.card,
            border: `1px solid ${d.border}`,
            borderRadius: 9,
            padding: "10px 14px",
            transition: "all 0.4s",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: d.text,
              fontSize: "0.85rem",
              transition: "color 0.4s",
            }}
          >
            Auto-theming card
          </div>
          <div
            style={{
              color: d.muted,
              fontSize: "0.78rem",
              transition: "color 0.4s",
            }}
          >
            All components update from a single attribute.
          </div>
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
          <input
            placeholder="Auto-styled input"
            style={{
              flex: 1,
              padding: "7px 10px",
              borderRadius: 7,
              border: `1px solid ${d.border}`,
              background: d.card,
              color: d.text,
              fontSize: "0.82rem",
              outline: "none",
              transition: "all 0.4s",
            }}
          />
          <button
            style={{
              background: d.btn,
              color: "white",
              border: "none",
              borderRadius: 7,
              padding: "7px 14px",
              cursor: "pointer",
              fontSize: "0.82rem",
              fontWeight: 600,
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══ SECTIONS DATA ═══════════════════════════════════════════════ */
const SECTIONS = [
  {
    id: "intro",
    icon: "🚀",
    title: "What is Bootstrap?",
    subtitle: "The world's most popular CSS framework",
    body: "Bootstrap is an open-source CSS framework created at Twitter in 2011. It gives you a complete toolkit of responsive components, utility classes, and a powerful JavaScript plugin layer — all in one package. Bootstrap 5 is dependency-free (no jQuery) and embraces modern CSS.",
    Demo: IntroDemo,
    code: `<!-- Step 1 — Add CSS in <head> -->
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">

<!-- Step 2 — Add JS bundle before </body> -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js">
</script>

<!-- Step 3 — Start building! -->
<button class="btn btn-primary">Hello Bootstrap 5!</button>
<div class="alert alert-success">You're ready! 🎉</div>`,
    tip: "Bootstrap 5 dropped jQuery entirely. The bundle includes Popper.js (for dropdowns/tooltips). One script tag covers everything.",
  },

  {
    id: "grid",
    icon: "📐",
    title: "The 12-Column Grid",
    subtitle: "Responsive layouts powered by CSS flexbox",
    body: "Bootstrap uses a 12-column grid built on CSS flexbox. Columns live inside rows, rows live inside containers. Control how many of 12 columns each item spans per breakpoint. Columns can be equal-width (just .col), specific-width (.col-6), or offset.",
    Demo: GridDemo,
    code: `<div class="container">
  <!-- Equal auto-width columns -->
  <div class="row g-3">
    <div class="col">One</div>
    <div class="col">Two</div>
    <div class="col">Three</div>
  </div>

  <!-- Responsive: full on mobile, half on tablet+ -->
  <div class="row g-3 mt-2">
    <div class="col-12 col-md-6">Left half</div>
    <div class="col-12 col-md-6">Right half</div>
  </div>

  <!-- Mixed widths -->
  <div class="row g-3 mt-2">
    <div class="col-8">Wide (8/12)</div>
    <div class="col-4">Narrow (4/12)</div>
  </div>

  <!-- Offset columns -->
  <div class="row mt-2">
    <div class="col-md-4 offset-md-4">Centered!</div>
  </div>
</div>`,
    tip: "Use g-* classes on .row for gutters (g-1 through g-5). g-3 is the sweet spot for most layouts.",
  },

  {
    id: "breakpoints",
    icon: "📱",
    title: "Responsive Breakpoints",
    subtitle: "6 breakpoints for every device — mobile-first",
    body: "Bootstrap defines 6 breakpoints mapped to device widths. Classes without a breakpoint apply to all sizes. Classes with a breakpoint apply from that size and up (mobile-first). This means col-md-6 means full width on mobile, half-width on medium screens and above.",
    Demo: BreakpointDemo,
    code: `<!-- Mobile: stacked | Tablet: 2 cols | Desktop: 4 cols -->
<div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
  <div class="col"><div class="card p-3">Card</div></div>
  <div class="col"><div class="card p-3">Card</div></div>
</div>

<!-- Breakpoint reference:
  xs  = < 576px   (no prefix)
  sm  = ≥ 576px   .col-sm-*
  md  = ≥ 768px   .col-md-*
  lg  = ≥ 992px   .col-lg-*
  xl  = ≥ 1200px  .col-xl-*
  xxl = ≥ 1400px  .col-xxl-*
-->

<!-- Typography that adapts -->
<h1 class="fs-1 fs-md-1 display-md-4">
  Responsive heading size
</h1>`,
    tip: "All Bootstrap utilities support breakpoint variants: p-3 p-md-5, text-center text-md-start, d-none d-lg-flex, etc.",
  },

  {
    id: "typography",
    icon: "✍️",
    title: "Typography",
    subtitle: "Display headings, weights, alignment, and text utilities",
    body: "Bootstrap offers a complete typographic system: display headings for heroes, h1-h6 heading classes, lead text, font weight and style utilities, text alignment, transformation, truncation, and even line clamping. No custom CSS needed for 99% of text styling.",
    Demo: TypographyDemo,
    code: `<!-- Display headings (much bigger than h1-h6) -->
<h1 class="display-1 fw-bold">Huge Hero Title</h1>
<h2 class="display-5">Slightly smaller hero</h2>

<!-- Use heading classes on any element -->
<p class="h2 text-primary">Paragraph as H2</p>

<!-- Lead paragraph -->
<p class="lead text-muted">Larger, softer intro text.</p>

<!-- Font weights (100–900) -->
<p class="fw-bold">Bold (700)</p>
<p class="fw-semibold">Semi-bold (600)</p>
<p class="fw-light fst-italic">Light italic (300)</p>

<!-- Alignment and transform -->
<p class="text-center text-uppercase text-primary">
  Center, upper, colored
</p>

<!-- Truncate overflow text -->
<p class="text-truncate" style="max-width: 250px;">
  This long text will get an ellipsis...
</p>`,
    tip: "display-1 through display-6 have font-weight 300 by default — add fw-bold to make them pop.",
  },

  {
    id: "colors",
    icon: "🎨",
    title: "Color System",
    subtitle: "8 semantic colors with text, bg, and border utilities",
    body: "Bootstrap has a semantic color system: primary, secondary, success, danger, warning, info, light, and dark. Each color has text-, bg-, border-, and btn- utilities. They all use CSS custom properties so you can override your brand color in a single variable.",
    Demo: ColorsDemo,
    code: `<!-- Text colors -->
<p class="text-primary">Primary</p>
<p class="text-danger">Danger</p>
<p class="text-success">Success</p>
<p class="text-muted">Muted (gray)</p>

<!-- Background colors -->
<div class="bg-warning text-dark p-3">Warning background</div>
<div class="bg-dark text-white p-3">Dark background</div>

<!-- Opacity variants (Bootstrap 5.1+) -->
<div class="bg-primary bg-opacity-10 text-primary">10%</div>
<div class="bg-primary bg-opacity-50 text-white">50%</div>

<!-- Override brand color via CSS -->
:root {
  --bs-primary: #ff6b35;
  --bs-primary-rgb: 255, 107, 53;
}`,
    tip: "Hover the swatches in the demo to preview all utility variants. bg-opacity-* is perfect for tinted card backgrounds.",
  },

  {
    id: "spacing",
    icon: "📏",
    title: "Spacing System",
    subtitle: "Margin & padding utilities with a consistent scale",
    body: "Bootstrap spacing uses the pattern {property}{sides}-{scale}. Property is m (margin) or p (padding). Sides: t/b/s/e for top/bottom/start/end, x/y for axes, blank for all. Scale is 0–5 or auto. Drag the slider to feel the difference.",
    Demo: SpacingDemo,
    code: `<!-- All-sides margin and padding -->
<div class="m-3">Margin 1rem all sides</div>
<div class="p-4">Padding 1.5rem all sides</div>

<!-- Directional -->
<div class="mt-5 mb-0">Top 3rem, no bottom margin</div>
<div class="ps-4 pe-2">Start padding 1.5rem, End 0.5rem</div>

<!-- Axis shorthand -->
<div class="mx-auto" style="width: 200px">Horizontally centered</div>
<div class="py-5 px-3">Generous vertical padding</div>

<!-- Negative margins (Bootstrap 5) -->
<div class="mt-n3">Pulls element up by 1rem</div>

<!-- Scale: 0=0 | 1=0.25rem | 2=0.5rem |
           3=1rem | 4=1.5rem | 5=3rem -->`,
    tip: "mx-auto is the Bootstrap way to center block elements. Always pair it with a defined width.",
  },

  {
    id: "flexbox",
    icon: "🔀",
    title: "Flexbox Utilities",
    subtitle: "All flexbox properties as utility classes",
    body: "Bootstrap exposes all major flexbox properties as utility classes. Start with d-flex, then layer justify-content, align-items, flex-direction, flex-wrap, and gap classes. Use the playground to see how each property changes the layout in real time.",
    Demo: FlexDemo,
    code: `<!-- Basic flex row -->
<div class="d-flex justify-content-between align-items-center">
  <span>Left</span>
  <span>Right</span>
</div>

<!-- Perfect centering -->
<div class="d-flex justify-content-center align-items-center"
     style="min-height: 200px;">
  <div>Perfectly centered!</div>
</div>

<!-- Column layout with gap -->
<div class="d-flex flex-column gap-3">
  <button class="btn btn-primary">Button 1</button>
  <button class="btn btn-secondary">Button 2</button>
</div>

<!-- Push element to end with ms-auto -->
<nav class="d-flex align-items-center">
  <a class="navbar-brand">Logo</a>
  <ul class="d-flex gap-3 me-auto">...</ul>
  <button class="ms-auto">Sign in</button>
</nav>`,
    tip: "ms-auto and me-auto push siblings to opposite edges — perfect for navbars, list items, and card footers.",
  },

  {
    id: "buttons",
    icon: "🖱️",
    title: "Buttons",
    subtitle: "Solid, outline, sizes, groups, and loading states",
    body: "Bootstrap buttons come in 8 color variants × 2 styles (solid and outline) × 3 sizes, plus loading states with spinners, disabled states, and button groups. They work on button, a, and input elements.",
    Demo: ButtonsDemo,
    code: `<!-- Solid color variants -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-danger">Danger</button>

<!-- Outline variants -->
<button class="btn btn-outline-primary">Outline</button>

<!-- Size variants -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Default</button>
<button class="btn btn-primary btn-lg">Large</button>

<!-- Full-width block button -->
<div class="d-grid">
  <button class="btn btn-dark">Block button</button>
</div>

<!-- Loading state with spinner -->
<button class="btn btn-primary" disabled>
  <span class="spinner-border spinner-border-sm me-2"></span>
  Loading...
</button>

<!-- Button group / toolbar -->
<div class="btn-group" role="group">
  <button class="btn btn-outline-primary">Left</button>
  <button class="btn btn-outline-primary">Middle</button>
  <button class="btn btn-outline-primary">Right</button>
</div>`,
    tip: "Click 'Try loading' in the demo! d-grid + btn makes full-width buttons without hacks.",
  },

  {
    id: "cards",
    icon: "🃏",
    title: "Cards",
    subtitle: "Flexible content containers for every layout",
    body: "Cards are Bootstrap's most versatile component. They have optional header, body, footer, and image sections. Cards can be arranged in equal-height grids, used as pricing tables, blog teasers, or feature lists. Hover the demo cards to see the lift effect.",
    Demo: CardsDemo,
    code: `<!-- Basic card -->
<div class="card shadow-sm" style="width: 20rem;">
  <img src="img.jpg" class="card-img-top">
  <div class="card-header">Featured</div>
  <div class="card-body">
    <h5 class="card-title">Card Title</h5>
    <p class="card-text text-muted">Description text here.</p>
    <a href="#" class="btn btn-primary">Action</a>
  </div>
  <div class="card-footer text-muted small">
    Updated 2 days ago
  </div>
</div>

<!-- Equal-height card grid (pinned button) -->
<div class="row row-cols-1 row-cols-md-3 g-4">
  <div class="col">
    <div class="card h-100">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">Title</h5>
        <p class="card-text flex-grow-1">Variable content.</p>
        <a href="#" class="btn btn-primary mt-auto">
          Pinned button
        </a>
      </div>
    </div>
  </div>
</div>`,
    tip: "h-100 + d-flex flex-column + mt-auto on the button gives you equal-height cards with pinned footers — a Bootstrap classic.",
  },

  {
    id: "navbar",
    icon: "🧭",
    title: "Navbar",
    subtitle: "Responsive navigation with dropdown and mobile toggle",
    body: "Bootstrap's navbar is fully responsive and requires zero JavaScript for basic functionality. It collapses to a hamburger on mobile using data attributes. The demo below is fully interactive — try the hamburger and the dropdown.",
    Demo: NavbarDemo,
    code: `<nav class="navbar navbar-expand-lg bg-dark navbar-dark">
  <div class="container">
    <a class="navbar-brand fw-bold" href="#">⚡ Brand</a>

    <!-- Hamburger (auto-collapses on mobile) -->
    <button class="navbar-toggler" type="button"
      data-bs-toggle="collapse" data-bs-target="#navMenu">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navMenu">
      <ul class="navbar-nav me-auto gap-1">
        <li class="nav-item">
          <a class="nav-link active" href="#">Home</a>
        </li>

        <!-- Dropdown item -->
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle"
            data-bs-toggle="dropdown">Products</a>
          <ul class="dropdown-menu dropdown-menu-dark">
            <li><a class="dropdown-item" href="#">Analytics</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">Reports</a></li>
          </ul>
        </li>
      </ul>
      <button class="btn btn-outline-light btn-sm">Sign in</button>
    </div>
  </div>
</nav>`,
    tip: "Change navbar-expand-lg to navbar-expand-md to collapse the menu at medium screens instead of large.",
  },

  {
    id: "forms",
    icon: "📝",
    title: "Forms",
    subtitle: "Inputs, validation feedback, floating labels, and more",
    body: "Bootstrap standardizes form control styling across all browsers. It includes floating labels (Bootstrap 5), live validation feedback with is-valid / is-invalid classes, styled selects, checkbox/radio inputs, range sliders, and form grid layouts. Try typing in the demo.",
    Demo: FormsDemo,
    code: `<!-- Floating label (Bootstrap 5) -->
<div class="form-floating mb-3">
  <input type="email" class="form-control" id="email"
    placeholder="name@example.com">
  <label for="email">Email address</label>
</div>

<!-- Validation states -->
<input class="form-control is-valid" value="Correct!">
<div class="valid-feedback">✓ Looks good!</div>

<input class="form-control is-invalid" value="Oops">
<div class="invalid-feedback">Please enter a valid value.</div>

<!-- Styled select -->
<select class="form-select mb-3">
  <option>Choose a plan...</option>
  <option>Free tier</option>
  <option>Pro — $9/mo</option>
</select>

<!-- Checks and radios -->
<div class="form-check">
  <input class="form-check-input" type="checkbox" id="cb1">
  <label class="form-check-label" for="cb1">Accept terms</label>
</div>

<!-- Range slider -->
<input type="range" class="form-range" min="0" max="100">`,
    tip: "Type a valid email (with @ and .) in the demo to see green validation feedback. is-valid and is-invalid trigger the colors.",
  },

  {
    id: "modals",
    icon: "🪟",
    title: "Modals",
    subtitle: "Dialogs, overlays, and scroll-locking with JS API",
    body: "Bootstrap modals are overlay dialogs that support animated entry, backdrop clicking to close, keyboard (Escape) dismissal, scrollable content, and a full JavaScript API. Click the button in the demo!",
    Demo: ModalDemo,
    code: `<!-- Trigger button (no JS needed!) -->
<button class="btn btn-primary"
  data-bs-toggle="modal" data-bs-target="#myModal">
  Open Modal
</button>

<div class="modal fade" id="myModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">

      <div class="modal-header border-0">
        <h5 class="modal-title fw-bold">Modal Title</h5>
        <button class="btn-close"
          data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">
        Any content here — forms, tables, images...
      </div>

      <div class="modal-footer border-0">
        <button class="btn btn-secondary"
          data-bs-dismiss="modal">Cancel</button>
        <button class="btn btn-primary">Save</button>
      </div>

    </div>
  </div>
</div>

// JavaScript API
const modal = bootstrap.Modal.getInstance('#myModal');
modal.show(); modal.hide(); modal.toggle();`,
    tip: "Add data-bs-backdrop='static' to prevent closing when clicking outside. modal-dialog-scrollable enables internal scrolling.",
  },

  {
    id: "display",
    icon: "👁️",
    title: "Display & Visibility",
    subtitle: "Show and hide elements per breakpoint — mobile-first",
    body: "Bootstrap's display utilities follow the pattern d-{breakpoint}-{value}. Since Bootstrap is mobile-first, styles apply upward from the specified breakpoint. This lets you show/hide any element at any screen size without a single @media query.",
    Demo: DisplayDemo,
    code: `<!-- Mobile only (hidden on md and up) -->
<div class="d-block d-md-none">📱 Mobile only</div>

<!-- Desktop only (hidden below md) -->
<div class="d-none d-md-block">🖥️ Desktop only</div>

<!-- Visible between sm and xl -->
<div class="d-none d-sm-block d-xl-none">Tablet range</div>

<!-- Responsive flex -->
<div class="d-block d-md-flex gap-3">
  Stacked on mobile, row on desktop
</div>

<!-- Visibility (keeps space, just hides) -->
<div class="invisible">Hidden but occupies space</div>
<div class="visible">Normal visibility</div>

<!-- Print utilities -->
<div class="d-print-none">Hides when printing</div>
<div class="d-none d-print-block">Prints only</div>`,
    tip: "Pick a device size in the demo to simulate which elements would render. The key rule: d-none hides, d-{bp}-block shows from that breakpoint up.",
  },

  {
    id: "utilities",
    icon: "🛠️",
    title: "CSS Utilities",
    subtitle: "Borders, shadows, overflow, position, opacity, and more",
    body: "Bootstrap 5 ships a comprehensive utility API covering everything from shadows and borders to overflow, opacity, z-index, object-fit, and positioning. The playground below lets you combine shadow + border-radius + opacity interactively.",
    Demo: UtilitiesDemo,
    code: `<!-- Borders -->
<div class="border">All sides</div>
<div class="border border-primary border-2">Thick primary</div>
<div class="border-0">No border</div>

<!-- Border radius -->
<img class="rounded-circle" style="width:60px;height:60px">
<div class="rounded-pill px-4 py-2">Pill shape</div>
<div class="rounded-3">More rounded corners</div>

<!-- Shadows -->
<div class="shadow-sm p-3">Subtle shadow</div>
<div class="shadow-lg p-3">Large dramatic shadow</div>

<!-- Overflow -->
<div class="overflow-auto" style="max-height:80px">
  Scrollable content...
</div>

<!-- Position + badge -->
<div class="position-relative d-inline-block">
  <button class="btn btn-primary">Notifications</button>
  <span class="position-absolute top-0 start-100
    translate-middle badge rounded-pill bg-danger">
    9+
  </span>
</div>`,
    tip: "Use the playground — try shadow-lg + rounded-pill + opacity-75 together. Combining utilities is where Bootstrap really shines.",
  },

  {
    id: "spinners",
    icon: "⏳",
    title: "Spinners & Progress",
    subtitle: "Loading indicators, progress bars, and skeleton loaders",
    body: "Bootstrap provides pure CSS loading spinners in border and grow styles, animated progress bars with striped patterns, and placeholder skeleton components for loading states — all with no JavaScript and no external dependencies.",
    Demo: SpinnersDemo,
    code: `<!-- Border spinner (rotating ring) -->
<div class="spinner-border text-primary" role="status">
  <span class="visually-hidden">Loading...</span>
</div>

<!-- Grow spinner (pulsing dot) -->
<div class="spinner-grow text-success"></div>

<!-- Spinner inside a button -->
<button class="btn btn-primary" disabled>
  <span class="spinner-border spinner-border-sm me-2"></span>
  Saving...
</button>

<!-- Animated striped progress bar -->
<div class="progress" style="height: 22px;">
  <div class="progress-bar progress-bar-striped
    progress-bar-animated bg-info fw-bold"
    role="progressbar" style="width: 75%">
    75%
  </div>
</div>

<!-- Skeleton placeholder loader -->
<div class="card p-3 placeholder-glow">
  <h5><span class="placeholder col-6 rounded"></span></h5>
  <p>
    <span class="placeholder col-7 rounded me-2"></span>
    <span class="placeholder col-4 rounded"></span>
  </p>
  <a class="btn btn-primary disabled placeholder col-4"></a>
</div>`,
    tip: "The skeleton demo auto-animates — watch the shimmer! progress-bar-animated + striped together creates the classic loading stripe.",
  },

  {
    id: "darkmode",
    icon: "🌙",
    title: "Dark Mode — v5.3",
    subtitle: "Native theme switching with data-bs-theme attribute",
    body: "Bootstrap 5.3 added first-class dark mode using CSS custom properties. Set data-bs-theme='dark' on any element (even the whole page) and all Bootstrap components auto-switch. Toggle the demo below to see every component adapt instantly.",
    Demo: DarkModeDemo,
    code: `<!-- Global dark mode on the HTML element -->
<html data-bs-theme="dark">

<!-- Per-component theming -->
<div data-bs-theme="dark" class="card p-3">
  This card is always dark, regardless of page theme
</div>

<div data-bs-theme="light" class="card p-3">
  This card is always light
</div>

<!-- Toggle with JavaScript -->
const toggle = document.getElementById('theme-toggle');
toggle.addEventListener('click', () => {
  const html = document.documentElement;
  const current = html.getAttribute('data-bs-theme');
  html.setAttribute('data-bs-theme',
    current === 'dark' ? 'light' : 'dark'
  );
});

<!-- Respect OS preference -->
const prefersDark = window.matchMedia(
  '(prefers-color-scheme: dark)'
).matches;
document.documentElement.setAttribute(
  'data-bs-theme', prefersDark ? 'dark' : 'light'
);`,
    tip: "Click the toggle in the demo! To respect the user's OS preference, use prefers-color-scheme media query to set the initial theme.",
  },
];

/* ══ MAIN COMPONENT ═════════════════════════════════════════════ */
export default function BootstrapMasterclass() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeId, setActiveId] = useState("intro");
  const [search, setSearch] = useState("");
  const [done, setDone] = useState(new Set());
  const mainRef = useRef(null);
  const activeRef = useRef(null);
  const t = THEMES[darkMode ? "dark" : "light"];

  const filtered = SECTIONS.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.subtitle.toLowerCase().includes(search.toLowerCase()),
  );

  const current = SECTIONS.find((s) => s.id === activeId) || SECTIONS[0];
  const currentIdx = SECTIONS.findIndex((s) => s.id === activeId);
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
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
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
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes growPulse { from { transform: scale(0.5); opacity: 0.4; } to { transform: scale(1); opacity: 1; } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(14px) scale(0.98); } to { opacity:1; transform:none; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: ${t.muted}; }
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
              background: "linear-gradient(135deg,#7c3aed,#2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              color: "white",
              fontSize: "1.1rem",
              flexShrink: 0,
            }}
          >
            B
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
              Bootstrap Masterclass
            </div>
            <div style={{ color: t.muted, fontSize: "0.67rem" }}>
              Complete interactive guide · v5.3
            </div>
          </div>
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
                  background: "linear-gradient(90deg,#2563eb,#7c3aed)",
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
            width: 248,
            flexShrink: 0,
            background: t.sidebar,
            borderRight: `1px solid ${t.border}`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Search box */}
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
                  padding: "7px 10px 7px 28px",
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
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Mini progress dots */}
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

          {/* NAV LIST — this is the scrollable area */}
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
                    transition: "all 0.15s",
                    fontSize: "0.83rem",
                    fontWeight: isActive ? 700 : 400,
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
              {SECTIONS.length} lessons · Interactive visual demos
            </span>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main
          ref={mainRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "28px 32px",
            minWidth: 0,
          }}
        >
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            {/* Lesson badge + heading */}
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
                  LESSON {currentIdx + 1} / {SECTIONS.length}
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

            {/* VISUAL DEMO */}
            {Demo && (
              <div style={{ marginBottom: 24 }}>
                <SectionLabel color={t.accent}>Interactive Demo</SectionLabel>
                <Demo t={t} />
              </div>
            )}

            {/* CODE */}
            <div style={{ marginBottom: 24 }}>
              <SectionLabel color="#7c3aed">Code Example</SectionLabel>
              <Code code={current.code} />
            </div>

            {/* TIP */}
            <div style={{ marginBottom: 32 }}>
              <Tip text={current.tip} t={t} />
            </div>

            {/* NAVIGATION */}
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
                onClick={() =>
                  currentIdx > 0 && go(SECTIONS[currentIdx - 1].id)
                }
                disabled={currentIdx === 0}
                style={{
                  background: t.surface2,
                  border: `1px solid ${t.border}`,
                  color: currentIdx === 0 ? t.muted : t.text,
                  borderRadius: 10,
                  padding: "10px 18px",
                  cursor: currentIdx === 0 ? "not-allowed" : "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  opacity: currentIdx === 0 ? 0.45 : 1,
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
                {currentIdx + 1} of {SECTIONS.length}
              </div>
              <button
                onClick={() => {
                  if (currentIdx < SECTIONS.length - 1) {
                    toggleDone(current.id);
                    go(SECTIONS[currentIdx + 1].id);
                  }
                }}
                disabled={currentIdx === SECTIONS.length - 1}
                style={{
                  background:
                    currentIdx === SECTIONS.length - 1
                      ? t.surface2
                      : "linear-gradient(135deg,#2563eb,#7c3aed)",
                  border: "none",
                  color: "white",
                  borderRadius: 10,
                  padding: "10px 20px",
                  cursor:
                    currentIdx === SECTIONS.length - 1
                      ? "not-allowed"
                      : "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  opacity: currentIdx === SECTIONS.length - 1 ? 0.45 : 1,
                  boxShadow:
                    currentIdx === SECTIONS.length - 1
                      ? "none"
                      : "0 4px 14px #2563eb45",
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
