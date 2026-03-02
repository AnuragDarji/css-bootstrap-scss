import { useState } from "react";

// ─── THEME ──────────────────────────────────────────────────
const T = {
  light: {
    bg: "#f8f6ff",
    card: "#ffffff",
    cardAlt: "#f0edff",
    border: "#e2dcff",
    text: "#1a1535",
    muted: "#6b5f9e",
    accent: "#7c3aed",
    accentSoft: "#ede9fe",
    accentText: "#5b21b6",
    green: "#059669",
    greenSoft: "#d1fae5",
    orange: "#d97706",
    orangeSoft: "#fef3c7",
    red: "#dc2626",
    redSoft: "#fee2e2",
    blue: "#2563eb",
    blueSoft: "#dbeafe",
    nav: "#1a1535",
    navText: "#f8f6ff",
    code: "#1e1b4b",
    codeBg: "#1e1b4b",
    codeText: "#e0d9ff",
    shadow: "0 4px 24px rgba(124,58,237,0.12)",
  },
  dark: {
    bg: "#0f0d1a",
    card: "#18162a",
    cardAlt: "#201d35",
    border: "#2d2850",
    text: "#ede9ff",
    muted: "#8b80c4",
    accent: "#a78bfa",
    accentSoft: "#1e1545",
    accentText: "#c4b5fd",
    green: "#34d399",
    greenSoft: "#0a2e20",
    orange: "#fbbf24",
    orangeSoft: "#2a1d00",
    red: "#f87171",
    redSoft: "#2a0a0a",
    blue: "#60a5fa",
    blueSoft: "#0a1a3a",
    nav: "#0a0814",
    navText: "#ede9ff",
    code: "#0f0d1a",
    codeBg: "#0f0d1a",
    codeText: "#c4b5fd",
    shadow: "0 4px 24px rgba(0,0,0,0.5)",
  },
};

// ─── CHAPTERS ───────────────────────────────────────────────
const chapters = [
  { id: "what",       emoji: "🎨", label: "What is CSS?" },
  { id: "syntax",     emoji: "📝", label: "CSS Syntax" },
  { id: "selectors",  emoji: "🎯", label: "Selectors" },
  { id: "boxmodel",   emoji: "📦", label: "Box Model" },
  { id: "colors",     emoji: "🌈", label: "Colors" },
  { id: "typography", emoji: "🔤", label: "Typography" },
  { id: "flexbox",    emoji: "↔️", label: "Flexbox" },
  { id: "grid",       emoji: "⊞",  label: "CSS Grid" },
  { id: "position",   emoji: "📍", label: "Position" },
  { id: "animation",  emoji: "✨", label: "Animations" },
  { id: "variables",  emoji: "🔧", label: "Variables" },
  { id: "responsive", emoji: "📱", label: "Responsive" },
];

// ─── SMALL HELPERS ──────────────────────────────────────────
function Badge({ children, color = "accent", t }) {
  const maps = {
    accent: { bg: t.accentSoft, text: t.accentText },
    green:  { bg: t.greenSoft,  text: t.green },
    orange: { bg: t.orangeSoft, text: t.orange },
    red:    { bg: t.redSoft,    text: t.red },
    blue:   { bg: t.blueSoft,   text: t.blue },
  };
  const c = maps[color] || maps.accent;
  return (
    <span style={{
      background: c.bg, color: c.text,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 12, fontWeight: 700,
      fontFamily: "system-ui, sans-serif",
    }}>{children}</span>
  );
}

function MiniCode({ children, t }) {
  return (
    <code style={{
      background: t.codeBg, color: t.codeText,
      padding: "2px 8px", borderRadius: 5,
      fontSize: 13, fontFamily: "'Fira Code', monospace",
      display: "inline-block",
    }}>{children}</code>
  );
}

function CodeBlock({ code, label, t }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ marginTop: 14, marginBottom: 14 }}>
      {label && (
        <div style={{
          color: t.muted, fontSize: 11, fontFamily: "system-ui",
          marginBottom: 4, fontWeight: 700, letterSpacing: 1,
          textTransform: "uppercase",
        }}>{label}</div>
      )}
      <div style={{
        background: t.codeBg, borderRadius: 10, overflow: "hidden",
        border: `1px solid ${t.border}`,
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "8px 14px",
          background: "rgba(0,0,0,0.2)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", gap: 5 }}>
            {["#ff5f57","#febc2e","#28c840"].map(c =>
              <div key={c} style={{ width:9,height:9,borderRadius:"50%",background:c }}/>
            )}
          </div>
          <button onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(()=>setCopied(false),1500); }}
            style={{ background:"none",border:"none",color:"rgba(255,255,255,0.35)",cursor:"pointer",fontSize:11,fontFamily:"monospace" }}>
            {copied ? "✓ copied" : "copy"}
          </button>
        </div>
        <pre style={{
          margin:0, padding:"16px", overflowX:"auto",
          fontSize:13, lineHeight:1.8,
          color: t.codeText,
          fontFamily:"'Fira Code','JetBrains Mono',monospace",
          whiteSpace:"pre",
        }}>{code}</pre>
      </div>
    </div>
  );
}

function Callout({ emoji, title, children, color = "accent", t }) {
  const maps = {
    accent: { bg: t.accentSoft, border: t.accent, text: t.accentText },
    green:  { bg: t.greenSoft,  border: t.green,  text: t.green },
    orange: { bg: t.orangeSoft, border: t.orange, text: t.orange },
    red:    { bg: t.redSoft,    border: t.red,    text: t.red },
  };
  const c = maps[color] || maps.accent;
  return (
    <div style={{
      background: c.bg, borderLeft: `4px solid ${c.border}`,
      borderRadius: "0 10px 10px 0", padding: "14px 18px",
      marginTop: 16, marginBottom: 16,
    }}>
      <div style={{ color: c.text, fontWeight: 700, fontSize: 14, marginBottom: 4, fontFamily:"system-ui" }}>
        {emoji} {title}
      </div>
      <div style={{ color: t.text, fontSize: 14, lineHeight: 1.7, fontFamily:"system-ui" }}>{children}</div>
    </div>
  );
}

function SectionTitle({ children, t }) {
  return (
    <h2 style={{
      fontSize: 20, fontWeight: 800, color: t.text,
      margin: "28px 0 12px",
      fontFamily: "system-ui, sans-serif",
      display: "flex", alignItems: "center", gap: 8,
    }}>{children}</h2>
  );
}

function Para({ children, t }) {
  return (
    <p style={{
      color: t.muted, fontSize: 15, lineHeight: 1.8,
      margin: "0 0 14px",
      fontFamily: "system-ui, sans-serif",
    }}>{children}</p>
  );
}

// ─── CHAPTER CONTENT ────────────────────────────────────────

function ChapterWhat({ t }) {
  return (
    <div>
      <Para t={t}>Imagine building a house. <strong style={{color:t.text}}>HTML is the structure</strong> — the walls, rooms, windows. <strong style={{color:t.text}}>CSS is the interior design</strong> — the paint colors, furniture arrangement, lighting, and style.</Para>
      <Para t={t}>Without CSS, every website looks like a plain Word document. With CSS, the same HTML can look completely different.</Para>

      {/* Visual: HTML vs CSS */}
      <SectionTitle t={t}>📄 HTML alone vs 🎨 HTML + CSS</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
        <div style={{ border:`2px solid ${t.border}`, borderRadius:12, overflow:"hidden" }}>
          <div style={{ background:t.cardAlt, padding:"8px 14px", fontSize:12, fontWeight:700, color:t.muted, fontFamily:"system-ui" }}>Without CSS 😬</div>
          <div style={{ padding:14, fontFamily:"Times New Roman, serif", background:"white", color:"#000" }}>
            <div style={{ fontSize:20, fontWeight:"bold", margin:"0 0 4px" }}>My Blog</div>
            <div style={{ fontSize:12, color:"#666" }}>by John</div>
            <hr style={{ border:"1px solid #ccc" }}/>
            <div style={{ fontSize:14, margin:"8px 0" }}>Welcome to my website!</div>
            <div style={{ fontSize:12, color:"blue", textDecoration:"underline", cursor:"pointer" }}>Read more</div>
          </div>
        </div>
        <div style={{ border:`2px solid ${t.accent}44`, borderRadius:12, overflow:"hidden" }}>
          <div style={{ background:t.accentSoft, padding:"8px 14px", fontSize:12, fontWeight:700, color:t.accentText, fontFamily:"system-ui" }}>With CSS ✨</div>
          <div style={{ padding:14, fontFamily:"Georgia, serif", background:"linear-gradient(135deg,#1a1535,#2d2060)", color:"white" }}>
            <div style={{ fontSize:18, fontWeight:900, letterSpacing:-0.5, margin:"0 0 2px" }}>My Blog</div>
            <div style={{ fontSize:11, color:"#a78bfa" }}>by John · 2 min read</div>
            <div style={{ height:2, background:"linear-gradient(90deg,#7c3aed,transparent)", margin:"8px 0" }}/>
            <div style={{ fontSize:13, color:"#ddd", lineHeight:1.6, margin:"8px 0" }}>Welcome to my website!</div>
            <div style={{ display:"inline-block", background:"#7c3aed", color:"white", padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:700 }}>Read more →</div>
          </div>
        </div>
      </div>

      <SectionTitle t={t}>🔗 How to connect CSS to HTML</SectionTitle>
      <Para t={t}>There are 3 ways. The <strong style={{color:t.text}}>external file</strong> method is the best — it keeps your CSS separate and reusable across pages.</Para>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:16 }}>
        {[
          { title:"1. External File ✅ Best", color:"green", code:`<!-- In HTML <head> -->
<link rel="stylesheet" 
  href="styles.css">`, note:"Separate .css file. Use this!" },
          { title:"2. Internal <style>", color:"orange", code:`<!-- In HTML <head> -->
<style>
  p { color: blue; }
</style>`, note:"Inside the HTML file. OK for small projects." },
          { title:"3. Inline ❌ Avoid", color:"red", code:`<!-- Directly on element -->
<p style="color:blue">
  Hello
</p>`, note:"Hard to maintain. Avoid this." },
        ].map(m => (
          <div key={m.title} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:10, overflow:"hidden" }}>
            <div style={{ padding:"8px 12px", background:t.cardAlt, borderBottom:`1px solid ${t.border}` }}>
              <Badge color={m.color} t={t}>{m.title}</Badge>
            </div>
            <div style={{ background:t.codeBg, padding:"10px 12px" }}>
              <pre style={{ margin:0, color:t.codeText, fontSize:11, fontFamily:"monospace", lineHeight:1.7 }}>{m.code}</pre>
            </div>
            <div style={{ padding:"8px 12px", color:t.muted, fontSize:12, fontFamily:"system-ui" }}>{m.note}</div>
          </div>
        ))}
      </div>

      <Callout emoji="🧠" title="Remember This!" color="accent" t={t}>
        CSS stands for <strong>Cascading Style Sheets</strong>. "Cascading" means styles flow downward — later rules can override earlier ones. We'll learn exactly how this works in the next chapters!
      </Callout>
    </div>
  );
}

function ChapterSyntax({ t }) {
  return (
    <div>
      <Para t={t}>CSS has one simple pattern. Once you understand it, you can write any CSS rule in the world.</Para>

      {/* Big visual anatomy */}
      <SectionTitle t={t}>🔬 Anatomy of a CSS Rule</SectionTitle>
      <div style={{
        background: t.codeBg, borderRadius:14, padding:28,
        margin:"16px 0", border:`1px solid ${t.border}`,
        fontFamily:"monospace",
      }}>
        <div style={{ fontSize:22, lineHeight:2.2, color:t.codeText }}>
          <span style={{ color:"#f472b6" }}>h1</span>
          <span style={{ color:t.codeText }}> {"{"}</span>
          <br/>
          <span style={{ paddingLeft:32, display:"block" }}>
            <span style={{ color:"#93c5fd" }}>color</span>
            <span style={{ color:t.codeText }}>: </span>
            <span style={{ color:"#86efac" }}>purple</span>
            <span style={{ color:t.codeText }}>;</span>
          </span>
          <span style={{ color:t.codeText }}>{"}"}</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginTop:20 }}>
          {[
            { color:"#f472b6", label:"SELECTOR", desc:"Which HTML element to style. Here: all <h1> tags." },
            { color:"#93c5fd", label:"PROPERTY", desc:"What aspect to change. Here: the text color." },
            { color:"#86efac", label:"VALUE",    desc:"What to set it to. Here: purple." },
          ].map(item => (
            <div key={item.label} style={{ background:"rgba(255,255,255,0.05)", borderRadius:8, padding:12, borderTop:`3px solid ${item.color}` }}>
              <div style={{ color:item.color, fontSize:11, fontWeight:700, marginBottom:4 }}>{item.label}</div>
              <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, lineHeight:1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <SectionTitle t={t}>📌 Important Rules to Remember</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        {[
          { emoji:"✅", title:"Always end with semicolon", good:`p { color: blue; }`, bad:`p { color: blue }`, note:"The ; after each value is required!" },
          { emoji:"📦", title:"Curly braces wrap properties", good:`h1 {\n  color: red;\n  font-size: 24px;\n}`, bad:`h1 color: red`, note:"Everything between { } belongs to the selector." },
          { emoji:"📚", title:"Multiple properties = multiple lines", good:`h1 {\n  color: red;\n  font-size: 24px;\n  font-weight: bold;\n}`, bad:null, note:"You can have as many property: value pairs as you want!" },
          { emoji:"💬", title:"Comments explain your CSS", good:`/* This styles the header */\nh1 { color: red; }`, bad:null, note:"Use /* ... */ for comments. They don't affect styling." },
        ].map(item => (
          <div key={item.title} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:10, padding:14 }}>
            <div style={{ fontWeight:700, fontSize:14, color:t.text, marginBottom:6, fontFamily:"system-ui" }}>{item.emoji} {item.title}</div>
            <div style={{ background:t.codeBg, borderRadius:7, padding:"10px 12px", marginBottom:8 }}>
              <div style={{ color:"#86efac", fontSize:11, marginBottom:2, fontFamily:"system-ui" }}>✓ Correct</div>
              <pre style={{ margin:0, color:t.codeText, fontSize:12, fontFamily:"monospace", lineHeight:1.6 }}>{item.good}</pre>
            </div>
            {item.bad && (
              <div style={{ background:t.redSoft, borderRadius:7, padding:"8px 12px", marginBottom:8 }}>
                <div style={{ color:t.red, fontSize:11, marginBottom:2, fontFamily:"system-ui" }}>✗ Wrong</div>
                <pre style={{ margin:0, color:t.red, fontSize:12, fontFamily:"monospace" }}>{item.bad}</pre>
              </div>
            )}
            <div style={{ color:t.muted, fontSize:12, fontFamily:"system-ui" }}>{item.note}</div>
          </div>
        ))}
      </div>

      <SectionTitle t={t}>🔄 The Cascade — When Rules Conflict</SectionTitle>
      <Para t={t}>When two rules try to style the same element, CSS has a clear winner. Think of it like a priority system:</Para>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
        {[
          { rank:1, label:"Inline style", ex:`style="color:red"`,       power:"Strongest 💪", color:t.red },
          { rank:2, label:"ID selector", ex:`#header { color:red }`,    power:"Very strong", color:t.orange },
          { rank:3, label:"Class selector", ex:`.title { color:red }`, power:"Medium", color:t.accent },
          { rank:4, label:"Element selector", ex:`h1 { color:red }`,   power:"Weakest", color:t.muted },
        ].map(r => (
          <div key={r.rank} style={{
            display:"flex", alignItems:"center", gap:12,
            background:t.card, border:`1px solid ${t.border}`,
            borderRadius:8, padding:"10px 14px",
            borderLeft:`4px solid ${r.color}`,
          }}>
            <div style={{ width:26,height:26,background:r.color,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:900,fontSize:12,flexShrink:0 }}>{r.rank}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, color:t.text, fontSize:13, fontFamily:"system-ui" }}>{r.label}</div>
              <code style={{ color:t.muted, fontSize:12, fontFamily:"monospace" }}>{r.ex}</code>
            </div>
            <div style={{ color:r.color, fontSize:12, fontWeight:700, fontFamily:"system-ui" }}>{r.power}</div>
          </div>
        ))}
      </div>
      <Callout emoji="💡" title="Simple Rule" color="green" t={t}>
        If two rules target the same element, <strong>the more specific one wins</strong>. If they're equally specific, <strong>the one written last wins</strong>!
      </Callout>
    </div>
  );
}

function ChapterSelectors({ t }) {
  return (
    <div>
      <Para t={t}>Selectors are how you tell CSS <em>which</em> HTML elements to style. Think of them as addresses — the more precise the address, the more specific the targeting.</Para>

      <SectionTitle t={t}>🎯 The 5 Types You'll Use Most</SectionTitle>

      {[
        {
          type:"Element", code:`p { color: blue; }`, emoji:"🏠",
          desc:"Targets every <p> on the page. Like saying 'paint ALL houses blue'.",
          demo: <div style={{ fontFamily:"system-ui" }}>
            <p style={{ color:"#2563eb", margin:"4px 0", fontSize:14 }}>This paragraph is blue ← targeted</p>
            <p style={{ color:"#2563eb", margin:"4px 0", fontSize:14 }}>This one too ← also targeted</p>
            <h3 style={{ margin:"4px 0", fontSize:14, color:"#666" }}>This heading is NOT targeted (it's an h3)</h3>
          </div>
        },
        {
          type:"Class (.)", code:`.highlight { background: yellow; }`, emoji:"🎀",
          desc:"Targets elements with class='highlight'. Reusable — add to any element!",
          demo: <div style={{ fontFamily:"system-ui", fontSize:14 }}>
            <p style={{ background:"#fef08a", padding:"2px 6px", borderRadius:4, display:"inline", margin:"0 4px 0 0" }}>class="highlight"</p>
            <span style={{ color:"#666" }}>← styled</span><br/><br/>
            <p style={{ margin:"0", color:"#666" }}>No class → not styled</p>
          </div>
        },
        {
          type:"ID (#)", code:`#header { font-size: 32px; }`, emoji:"🏷️",
          desc:"Targets ONE element with id='header'. IDs must be unique on a page!",
          demo: <div style={{ fontFamily:"system-ui" }}>
            <div style={{ fontSize:22, fontWeight:900, color:t.text }}>id="header" → 32px font</div>
            <p style={{ color:"#666", fontSize:13 }}>Regular paragraph — not targeted</p>
          </div>
        },
        {
          type:"Pseudo-class (:)", code:`a:hover { color: red; }`, emoji:"🖱️",
          desc:"Targets elements in a specific STATE. :hover means 'when the mouse is over it'.",
          demo: <div style={{ fontFamily:"system-ui", fontSize:14 }}>
            <span style={{ color:"#2563eb", textDecoration:"underline" }}>Normal link</span>
            <span style={{ margin:"0 12px", color:"#555" }}>→</span>
            <span style={{ color:"#dc2626", textDecoration:"underline" }}>Hovered link (red!)</span>
          </div>
        },
        {
          type:"Descendant (space)", code:`div p { color: green; }`, emoji:"🪆",
          desc:"Targets <p> tags that are INSIDE a <div>. Only nested ones are targeted.",
          demo: <div style={{ fontFamily:"system-ui", fontSize:13 }}>
            <div style={{ border:"1px dashed #ccc", padding:8, borderRadius:6, marginBottom:6 }}>
              <span style={{ color:"#888", fontSize:11 }}>Inside div:</span>
              <p style={{ color:"#059669", margin:"2px 0" }}>This p is green ← inside div</p>
            </div>
            <p style={{ color:"#666", margin:"2px 0" }}>This p is NOT green ← outside div</p>
          </div>
        },
      ].map((s) => (
        <div key={s.type} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:12, marginBottom:12, overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 }}>
            <div style={{ padding:"14px 18px", borderRight:`1px solid ${t.border}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <span style={{ fontSize:18 }}>{s.emoji}</span>
                <Badge color="accent" t={t}>{s.type} Selector</Badge>
              </div>
              <div style={{ background:t.codeBg, borderRadius:7, padding:"8px 12px", marginBottom:8 }}>
                <code style={{ color:t.codeText, fontSize:13, fontFamily:"monospace" }}>{s.code}</code>
              </div>
              <div style={{ color:t.muted, fontSize:13, lineHeight:1.6, fontFamily:"system-ui" }}>{s.desc}</div>
            </div>
            <div style={{ padding:"14px 18px", background:t.cardAlt }}>
              <div style={{ color:t.muted, fontSize:11, fontWeight:700, marginBottom:8, fontFamily:"system-ui", letterSpacing:1, textTransform:"uppercase" }}>Result</div>
              {s.demo}
            </div>
          </div>
        </div>
      ))}

      <Callout emoji="🚫" title="Avoid using ID selectors for styling" color="orange" t={t}>
        IDs are too powerful (hard to override) and can only be used once per page. <strong>Stick to class selectors</strong> for almost all your styling!
      </Callout>
    </div>
  );
}

function ChapterBoxModel({ t }) {
  const [pad, setPad] = useState(20);
  const [mar, setMar] = useState(16);
  const [bor, setBor] = useState(3);

  return (
    <div>
      <Para t={t}>This is the most important CSS concept to understand. <strong style={{color:t.text}}>Every single element on a webpage is a rectangular box</strong>, made of 4 layers — like an onion.</Para>

      <SectionTitle t={t}>🧅 The 4 Layers (from inside out)</SectionTitle>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:20 }}>
        {[
          { name:"Content", color:"#7c3aed", bg:t.accentSoft, desc:"The actual text or image. You set width and height here.", ex:`width: 200px;\nheight: 100px;` },
          { name:"Padding", color:"#2563eb", bg:t.blueSoft,   desc:"Space INSIDE the border. Part of the element's background.", ex:`padding: 20px;` },
          { name:"Border",  color:"#d97706", bg:t.orangeSoft, desc:"A line around the padding. Can be solid, dashed, dotted...", ex:`border: 2px solid;` },
          { name:"Margin",  color:"#059669", bg:t.greenSoft,  desc:"Space OUTSIDE the border. Transparent — shows page background.", ex:`margin: 16px;` },
        ].map((l,i) => (
          <div key={l.name} style={{ background:l.bg, border:`2px solid ${l.color}44`, borderRadius:10, padding:12, borderTop:`3px solid ${l.color}` }}>
            <div style={{ color:l.color, fontWeight:800, fontSize:14, marginBottom:4, fontFamily:"system-ui" }}>{i+1}. {l.name}</div>
            <div style={{ color:t.muted, fontSize:12, lineHeight:1.5, marginBottom:8, fontFamily:"system-ui" }}>{l.desc}</div>
            <code style={{ color:l.color, fontSize:11, fontFamily:"monospace" }}>{l.ex}</code>
          </div>
        ))}
      </div>

      <SectionTitle t={t}>🎮 Interactive Box Model — Drag the sliders!</SectionTitle>
      <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:14, padding:20 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:20 }}>
          {[
            { label:"Padding", val:pad, set:setPad, min:0, max:50, color:"#2563eb" },
            { label:"Border", val:bor, set:setBor, min:0, max:15, color:"#d97706" },
            { label:"Margin", val:mar, set:setMar, min:0, max:50, color:"#059669" },
          ].map(ctrl => (
            <div key={ctrl.label}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ color:ctrl.color, fontSize:13, fontWeight:700, fontFamily:"system-ui" }}>{ctrl.label}</span>
                <MiniCode t={t}>{ctrl.val}px</MiniCode>
              </div>
              <input type="range" min={ctrl.min} max={ctrl.max} value={ctrl.val}
                onChange={e => ctrl.set(+e.target.value)}
                style={{ width:"100%", accentColor:ctrl.color }} />
            </div>
          ))}
        </div>

        {/* Visual Box */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:200 }}>
          {/* Margin layer */}
          <div style={{
            background: "#059669" + "18",
            border: "2px dashed #05966966",
            padding: mar,
            borderRadius: 8,
            position:"relative",
          }}>
            <span style={{ position:"absolute",top:3,left:6,fontSize:9,color:"#059669",fontWeight:700,fontFamily:"system-ui" }}>MARGIN {mar}px</span>
            {/* Border layer */}
            <div style={{
              background: "#d97706" + "18",
              border: `${bor}px solid #d97706`,
              padding: pad,
              borderRadius: 6,
              position:"relative",
            }}>
              <span style={{ position:"absolute",top:3,left:6,fontSize:9,color:"#d97706",fontWeight:700,fontFamily:"system-ui" }}>PADDING {pad}px</span>
              {/* Content */}
              <div style={{
                background: t.accent,
                color:"white",
                padding:"14px 24px",
                borderRadius:4,
                fontWeight:700, fontSize:14,
                fontFamily:"system-ui",
                whiteSpace:"nowrap",
                textAlign:"center",
              }}>📦 Content</div>
            </div>
          </div>
        </div>

        {/* Code output */}
        <div style={{ background:t.codeBg, borderRadius:8, padding:"12px 16px", marginTop:12 }}>
          <code style={{ color:t.codeText, fontSize:12, fontFamily:"monospace" }}>
            {`.box {\n  padding: ${pad}px;\n  border: ${bor}px solid orange;\n  margin: ${mar}px;\n}`}
          </code>
        </div>
      </div>

      <SectionTitle t={t}>⚠️ The box-sizing Trick — Always Use It!</SectionTitle>
      <Para t={t}>By default, CSS adds padding and border ON TOP of your width. That's confusing! The fix is one line:</Para>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        <div style={{ background:t.redSoft, border:`1px solid ${t.red}44`, borderRadius:10, padding:14 }}>
          <Badge color="red" t={t}>Default (confusing) ❌</Badge>
          <div style={{ background:t.codeBg, borderRadius:7, padding:"10px 12px", margin:"10px 0" }}>
            <pre style={{ margin:0, color:t.codeText, fontSize:12, fontFamily:"monospace", lineHeight:1.7 }}>{`.box {\n  width: 200px;\n  padding: 20px;\n  /* Total = 240px! 😱 */\n}`}</pre>
          </div>
          <div style={{ color:t.red, fontSize:13, fontFamily:"system-ui" }}>Width + padding = unexpected size</div>
        </div>
        <div style={{ background:t.greenSoft, border:`1px solid ${t.green}44`, borderRadius:10, padding:14 }}>
          <Badge color="green" t={t}>border-box (makes sense) ✅</Badge>
          <div style={{ background:t.codeBg, borderRadius:7, padding:"10px 12px", margin:"10px 0" }}>
            <pre style={{ margin:0, color:t.codeText, fontSize:12, fontFamily:"monospace", lineHeight:1.7 }}>{`* {\n  box-sizing: border-box;\n}\n.box {\n  width: 200px; /* Total = 200px ✓ */\n  padding: 20px;\n}`}</pre>
          </div>
          <div style={{ color:t.green, fontSize:13, fontFamily:"system-ui" }}>Width includes everything — predictable!</div>
        </div>
      </div>

      <Callout emoji="✨" title="Golden Rule" color="green" t={t}>
        Always add <MiniCode t={t}>* {"{"} box-sizing: border-box; {"}"}</MiniCode> at the very top of your CSS file. Every professional CSS project does this!
      </Callout>
    </div>
  );
}

function ChapterColors({ t }) {
  const [r, setR] = useState(124);
  const [g, setG] = useState(58);
  const [b, setB] = useState(237);
  const [opacity, setOpacity] = useState(100);

  const hex = `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;

  return (
    <div>
      <Para t={t}>CSS gives you many ways to write colors. They all do the same thing — pick a color — but each format has its own advantages.</Para>

      <SectionTitle t={t}>🎨 4 Ways to Write a Color</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
        {[
          {
            name:"Named Colors", badge:"accent",
            desc:"CSS knows 140+ color names. Great for learning, not for real projects.",
            code:`color: red;\ncolor: tomato;\ncolor: cornflowerblue;\ncolor: forestgreen;`,
            colors: ["red","tomato","cornflowerblue","forestgreen"],
          },
          {
            name:"HEX (#rrggbb)", badge:"blue",
            desc:"Most common format. A # followed by 6 hex digits (0-9 and a-f). Each pair = Red, Green, Blue.",
            code:`color: #7c3aed; /* purple */\ncolor: #dc2626; /* red   */\ncolor: #059669; /* green */\ncolor: #ffffff; /* white */`,
            colors: ["#7c3aed","#dc2626","#059669","#ffffff"],
          },
          {
            name:"RGB (r, g, b)", badge:"green",
            desc:"Red, Green, Blue each from 0–255. RGBA adds transparency (0=clear, 1=solid).",
            code:`color: rgb(124, 58, 237);   /* purple */\ncolor: rgb(220, 38, 38);    /* red    */\ncolor: rgba(0, 0, 0, 0.5); /* 50% black */`,
            colors: ["rgb(124,58,237)","rgb(220,38,38)","rgba(0,0,0,0.5)"],
          },
          {
            name:"HSL (hue, sat, light)", badge:"orange",
            desc:"Hue = color (0-360°), Saturation = intensity, Lightness = bright/dark. Most human-readable!",
            code:`color: hsl(270, 60%, 58%);   /* purple  */\ncolor: hsl(0, 79%, 51%);     /* red     */\ncolor: hsl(270, 60%, 80%);   /* lighter */\ncolor: hsl(270, 60%, 30%);   /* darker  */`,
            colors: ["hsl(270,60%,58%)","hsl(0,79%,51%)","hsl(270,60%,80%)","hsl(270,60%,30%)"],
          },
        ].map(f => (
          <div key={f.name} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:12, padding:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <Badge color={f.badge} t={t}>{f.name}</Badge>
            </div>
            <div style={{ color:t.muted, fontSize:13, lineHeight:1.6, marginBottom:10, fontFamily:"system-ui" }}>{f.desc}</div>
            <div style={{ background:t.codeBg, borderRadius:7, padding:"10px 12px", marginBottom:10 }}>
              <pre style={{ margin:0, color:t.codeText, fontSize:12, fontFamily:"monospace", lineHeight:1.7 }}>{f.code}</pre>
            </div>
            {f.colors && (
              <div style={{ display:"flex", gap:6 }}>
                {f.colors.map((c,i) => (
                  <div key={i} style={{
                    width:28, height:28, borderRadius:6,
                    background:c,
                    border:"2px solid rgba(0,0,0,0.1)",
                    flexShrink:0,
                  }}/>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <SectionTitle t={t}>🎛️ Interactive Color Mixer</SectionTitle>
      <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:14, padding:20 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12, marginBottom:16 }}>
          {[
            { label:"🔴 Red",   val:r,       set:setR,       color:"#ef4444", max:255 },
            { label:"🟢 Green", val:g,       set:setG,       color:"#22c55e", max:255 },
            { label:"🔵 Blue",  val:b,       set:setB,       color:"#3b82f6", max:255 },
            { label:"⬜ Opacity",val:opacity, set:setOpacity, color:"#a78bfa", max:100 },
          ].map(ctrl => (
            <div key={ctrl.label}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                <span style={{ color:ctrl.color,fontSize:12,fontWeight:700,fontFamily:"system-ui" }}>{ctrl.label}</span>
                <span style={{ color:t.muted,fontSize:12,fontFamily:"monospace" }}>{ctrl.val}</span>
              </div>
              <input type="range" min={0} max={ctrl.max} value={ctrl.val}
                onChange={e=>ctrl.set(+e.target.value)}
                style={{ width:"100%", accentColor:ctrl.color }} />
            </div>
          ))}
        </div>

        {/* Color preview */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, alignItems:"start" }}>
          <div style={{
            height:120, borderRadius:12,
            background:`rgba(${r},${g},${b},${opacity/100})`,
            border:`2px solid ${t.border}`,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <span style={{ color:"white",fontWeight:700,fontSize:16,textShadow:"0 1px 4px rgba(0,0,0,0.5)",fontFamily:"system-ui" }}>Preview</span>
          </div>
          <div>
            <div style={{ background:t.codeBg,borderRadius:8,padding:"12px 14px" }}>
              <pre style={{ margin:0,color:t.codeText,fontSize:12,fontFamily:"monospace",lineHeight:2 }}>
{`/* HEX */
color: ${hex};

/* RGB */
color: rgba(${r}, ${g}, ${b}, ${opacity/100});`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <SectionTitle t={t}>🖼️ Background Properties</SectionTitle>
      <CodeBlock t={t} code={`/* Solid background color */
.box { background-color: #7c3aed; }

/* Background image */
.hero {
  background-image: url('photo.jpg');
  background-size: cover;       /* fill the whole area */
  background-position: center;  /* center the image */
  background-repeat: no-repeat; /* don't tile */
}

/* Gradients (also a background-image) */
.gradient {
  background: linear-gradient(to right, #7c3aed, #db2777);
  /*                           ↑direction  ↑start    ↑end   */
}`} />
    </div>
  );
}

function ChapterTypography({ t }) {
  const [size, setSize] = useState(18);
  const [weight, setWeight] = useState(400);
  const [lh, setLh] = useState(1.6);
  const [ls, setLs] = useState(0);
  return (
    <div>
      <Para t={t}>Typography is how your text looks. CSS gives you full control over fonts, sizes, spacing, and more. Good typography makes a huge difference to readability.</Para>

      <SectionTitle t={t}>📝 Core Text Properties</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
        {[
          { prop:"font-family", desc:"Which font to use. Always list backup fonts!", code:`/* Primary font, fallback, generic */
font-family: 'Georgia', serif;
font-family: 'Helvetica', Arial, sans-serif;
font-family: 'Courier New', monospace;` },
          { prop:"font-size", desc:"How big the text is. Use rem for accessibility!", code:`font-size: 16px;     /* pixels - fixed */
font-size: 1rem;     /* relative to root (best!) */
font-size: 1.5em;    /* relative to parent */
font-size: 120%;     /* percentage of parent */` },
          { prop:"font-weight", desc:"How bold the text is. Numbers from 100–900.", code:`font-weight: 400;  /* normal text */
font-weight: 700;  /* bold */
font-weight: 900;  /* extra bold (black) */
font-weight: 300;  /* light */` },
          { prop:"line-height", desc:"Space between lines. Unitless numbers are best!", code:`line-height: 1;     /* cramped - bad for reading */
line-height: 1.5;   /* good for body text */
line-height: 1.8;   /* airy / relaxed */
line-height: 2;     /* very spacious */` },
        ].map(p => (
          <div key={p.prop} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:10, padding:14 }}>
            <MiniCode t={t}>{p.prop}</MiniCode>
            <div style={{ color:t.muted, fontSize:13, lineHeight:1.6, margin:"8px 0", fontFamily:"system-ui" }}>{p.desc}</div>
            <div style={{ background:t.codeBg, borderRadius:7, padding:"10px 12px" }}>
              <pre style={{ margin:0, color:t.codeText, fontSize:12, fontFamily:"monospace", lineHeight:1.7 }}>{p.code}</pre>
            </div>
          </div>
        ))}
      </div>

      <SectionTitle t={t}>🎮 Typography Playground</SectionTitle>
      <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:14, padding:20 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12, marginBottom:20 }}>
          {[
            { label:"font-size", val:size, set:setSize, min:10, max:48, unit:"px", color:t.accent },
            { label:"font-weight", val:weight, set:setWeight, min:100, max:900, step:100, unit:"", color:t.blue },
            { label:"line-height", val:lh, set:setLh, min:0.8, max:3, step:0.1, unit:"", color:t.green },
            { label:"letter-spacing", val:ls, set:setLs, min:-3, max:10, step:0.5, unit:"px", color:t.orange },
          ].map(ctrl => (
            <div key={ctrl.label}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                <span style={{ color:ctrl.color,fontSize:11,fontWeight:700,fontFamily:"system-ui" }}>{ctrl.label}</span>
                <span style={{ color:t.muted,fontSize:11,fontFamily:"monospace" }}>{ctrl.val}{ctrl.unit}</span>
              </div>
              <input type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step||1} value={ctrl.val}
                onChange={e=>ctrl.set(+e.target.value)}
                style={{ width:"100%", accentColor:ctrl.color }} />
            </div>
          ))}
        </div>
        <div style={{
          background:t.cardAlt, borderRadius:10, padding:24,
          border:`1px solid ${t.border}`,
        }}>
          <div style={{ fontSize:size*1.6, fontWeight:900, lineHeight:1.1, letterSpacing:ls, color:t.text, marginBottom:14, fontFamily:"Georgia,serif" }}>
            Beautiful Typography
          </div>
          <p style={{ fontSize:size, fontWeight:weight, lineHeight:lh, letterSpacing:ls, color:t.muted, margin:0, fontFamily:"system-ui" }}>
            The quick brown fox jumps over the lazy dog. Good typography makes content easier to read and gives your website a professional, polished feel. Line height, font weight, and letter spacing all work together.
          </p>
        </div>
        <div style={{ background:t.codeBg, borderRadius:8, padding:"12px 16px", marginTop:12 }}>
          <code style={{ color:t.codeText, fontSize:12, fontFamily:"monospace" }}>
            {`font-size: ${size}px;  font-weight: ${weight};  line-height: ${lh};  letter-spacing: ${ls}px;`}
          </code>
        </div>
      </div>

      <SectionTitle t={t}>✂️ More Useful Text Properties</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
        {[
          { prop:"text-align", vals:["left","center","right","justify"] },
          { prop:"text-decoration", vals:["underline","none","line-through","overline"] },
          { prop:"text-transform", vals:["uppercase","lowercase","capitalize","none"] },
        ].map(group => (
          <div key={group.prop} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:10, padding:12 }}>
            <MiniCode t={t}>{group.prop}</MiniCode>
            <div style={{ marginTop:10, display:"flex", flexDirection:"column", gap:6 }}>
              {group.vals.map(val => (
                <div key={val} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <code style={{ color:t.accentText, fontSize:11, fontFamily:"monospace", minWidth:90 }}>{val}</code>
                  <span style={{
                    color:t.text, fontSize:13, fontFamily:"system-ui",
                    textAlign: group.prop==="text-align" ? val : undefined,
                    textDecoration: group.prop==="text-decoration" ? val : undefined,
                    textTransform: group.prop==="text-transform" ? val : undefined,
                  }}>Sample Text</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChapterFlexbox({ t }) {
  const [dir, setDir] = useState("row");
  const [jc, setJc] = useState("flex-start");
  const [ai, setAi] = useState("stretch");
  const [gap, setGap] = useState(8);
  const [wrap, setWrap] = useState("nowrap");

  const items = ["A","B","C","D"];

  const colors = [t.accent, t.blue, t.green, t.orange];

  return (
    <div>
      <Para t={t}>Flexbox makes it easy to arrange items in a row or column, distribute space between them, and align them. It's perfect for navigation bars, card rows, centering content — anything 1-dimensional.</Para>

      <Callout emoji="🔑" title="The Key Idea" color="accent" t={t}>
        You add <MiniCode t={t}>display: flex</MiniCode> to a <strong>container</strong> (the parent). The children inside automatically become <strong>flex items</strong> and arrange themselves!
      </Callout>

      <SectionTitle t={t}>🎮 Interactive Flexbox Explorer</SectionTitle>
      <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:14, padding:20 }}>
        {/* Controls */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr", gap:10, marginBottom:20 }}>
          {[
            { label:"flex-direction", val:dir, set:setDir, opts:["row","column","row-reverse","column-reverse"] },
            { label:"justify-content", val:jc, set:setJc, opts:["flex-start","center","flex-end","space-between","space-around","space-evenly"] },
            { label:"align-items", val:ai, set:setAi, opts:["flex-start","center","flex-end","stretch","baseline"] },
            { label:"flex-wrap", val:wrap, set:setWrap, opts:["nowrap","wrap"] },
          ].map(ctrl => (
            <div key={ctrl.label}>
              <div style={{ color:t.muted, fontSize:10, marginBottom:4, fontFamily:"monospace", fontWeight:700 }}>{ctrl.label}</div>
              <select value={ctrl.val} onChange={e=>ctrl.set(e.target.value)}
                style={{ width:"100%", background:t.cardAlt, color:t.text, border:`1px solid ${t.border}`, borderRadius:6, padding:"5px 6px", fontSize:11, fontFamily:"monospace" }}>
                {ctrl.opts.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div>
            <div style={{ color:t.muted, fontSize:10, marginBottom:4, fontFamily:"monospace", fontWeight:700 }}>gap: {gap}px</div>
            <input type="range" min={0} max={30} value={gap} onChange={e=>setGap(+e.target.value)}
              style={{ width:"100%", marginTop:8, accentColor:t.accent }} />
          </div>
        </div>

        {/* Live preview */}
        <div style={{
          background:t.cardAlt, border:`2px dashed ${t.border}`,
          borderRadius:12, padding:16, minHeight:160,
          display:"flex",
          flexDirection: dir,
          justifyContent: jc,
          alignItems: ai,
          flexWrap: wrap,
          gap: gap,
          transition:"all 0.3s ease",
        }}>
          {items.map((item,i) => (
            <div key={i} style={{
              background:colors[i], color:"white",
              padding: ai==="stretch" ? "0 20px" : "14px 20px",
              borderRadius:8, fontWeight:800, fontSize:15,
              minWidth:50, display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:`0 4px 12px ${colors[i]}55`,
              height: ai==="stretch" ? "auto" : undefined,
              transition:"all 0.3s",
              fontFamily:"system-ui",
            }}>
              Box {item}
            </div>
          ))}
        </div>

        {/* Code output */}
        <div style={{ background:t.codeBg, borderRadius:8, padding:"12px 16px", marginTop:12 }}>
          <code style={{ color:t.codeText, fontSize:12, fontFamily:"monospace" }}>
            {`.container {\n  display: flex;\n  flex-direction: ${dir};\n  justify-content: ${jc};\n  align-items: ${ai};\n  flex-wrap: ${wrap};\n  gap: ${gap}px;\n}`}
          </code>
        </div>
      </div>

      <SectionTitle t={t}>📚 Property Reference</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:10, padding:14 }}>
          <div style={{ fontWeight:700, color:t.accent, fontSize:14, marginBottom:10, fontFamily:"system-ui" }}>📦 On the Container</div>
          {[
            ["justify-content","Align items on the MAIN axis (horizontal in row)"],
            ["align-items","Align items on the CROSS axis (vertical in row)"],
            ["flex-direction","Row = horizontal. Column = vertical."],
            ["flex-wrap","Wrap = items go to next line when no room"],
            ["gap","Space between items"],
          ].map(([p,d]) => (
            <div key={p} style={{ marginBottom:8, paddingBottom:8, borderBottom:`1px solid ${t.border}` }}>
              <code style={{ color:t.accentText, fontSize:12, fontFamily:"monospace", display:"block" }}>{p}</code>
              <span style={{ color:t.muted, fontSize:12, fontFamily:"system-ui" }}>{d}</span>
            </div>
          ))}
        </div>
        <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:10, padding:14 }}>
          <div style={{ fontWeight:700, color:t.blue, fontSize:14, marginBottom:10, fontFamily:"system-ui" }}>🧩 On the Items</div>
          {[
            ["flex-grow","How much the item GROWS to fill space (0 = don't grow)"],
            ["flex-shrink","How much the item SHRINKS when there's no room"],
            ["flex-basis","The item's default size before growing/shrinking"],
            ["flex: 1","Shortcut for grow=1, shrink=1, basis=0 (fill space!)"],
            ["align-self","Override align-items for just this one item"],
          ].map(([p,d]) => (
            <div key={p} style={{ marginBottom:8, paddingBottom:8, borderBottom:`1px solid ${t.border}` }}>
              <code style={{ color:"#60a5fa", fontSize:12, fontFamily:"monospace", display:"block" }}>{p}</code>
              <span style={{ color:t.muted, fontSize:12, fontFamily:"system-ui" }}>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChapterGrid({ t }) {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(2);
  const [gap, setGap] = useState(12);
  const [count, setCount] = useState(6);

  const colors = [t.accent, t.blue, t.green, t.orange, t.red, "#8b5cf6","#ec4899","#06b6d4","#84cc16"];

  return (
    <div>
      <Para t={t}>CSS Grid is the most powerful layout tool in CSS. While Flexbox works in one direction (row OR column), Grid works in BOTH directions at once — like a spreadsheet!</Para>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
        <Callout emoji="↔️" title="Use Flexbox for..." color="blue" t={t}>
          Navigation bars, button groups, centering one element, distributing items in a single row or column.
        </Callout>
        <Callout emoji="⊞" title="Use Grid for..." color="accent" t={t}>
          Page layouts, card grids, complex 2D arrangements, anything with rows AND columns.
        </Callout>
      </div>

      <SectionTitle t={t}>🎮 Interactive Grid Builder</SectionTitle>
      <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:14, padding:20 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:20 }}>
          {[
            { label:`Columns: ${cols}`, val:cols, set:setCols, min:1, max:5 },
            { label:`Items: ${count}`, val:count, set:setCount, min:1, max:9 },
            { label:`Gap: ${gap}px`, val:gap, set:setGap, min:0, max:32 },
          ].map(ctrl => (
            <div key={ctrl.label}>
              <div style={{ color:t.muted, fontSize:12, marginBottom:4, fontFamily:"system-ui", fontWeight:600 }}>{ctrl.label}</div>
              <input type="range" min={ctrl.min} max={ctrl.max} value={ctrl.val}
                onChange={e=>ctrl.set(+e.target.value)}
                style={{ width:"100%", accentColor:t.accent }} />
            </div>
          ))}
        </div>

        <div style={{
          display:"grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: gap,
          background:t.cardAlt, border:`2px dashed ${t.border}`,
          borderRadius:12, padding:16,
          transition:"all 0.3s",
        }}>
          {Array.from({length:count},(_,i) => (
            <div key={i} style={{
              background:colors[i%colors.length], color:"white",
              borderRadius:8, padding:"20px 10px",
              textAlign:"center", fontWeight:700, fontSize:14,
              boxShadow:`0 4px 12px ${colors[i%colors.length]}44`,
              fontFamily:"system-ui",
              transition:"all 0.3s",
            }}>Item {i+1}</div>
          ))}
        </div>

        <div style={{ background:t.codeBg, borderRadius:8, padding:"12px 16px", marginTop:12 }}>
          <code style={{ color:t.codeText, fontSize:12, fontFamily:"monospace" }}>
            {`.grid {\n  display: grid;\n  grid-template-columns: repeat(${cols}, 1fr);\n  gap: ${gap}px;\n}`}
          </code>
        </div>
      </div>

      <SectionTitle t={t}>🔑 The Key Grid Concepts</SectionTitle>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {[
          { emoji:"🔲", title:"fr unit — fraction of free space", code:`grid-template-columns: 1fr 2fr 1fr;`, desc:`The fr unit divides available space into fractions. Here: column 2 gets twice as much space as columns 1 and 3. Total = 4 parts: col1=1, col2=2, col3=1.` },
          { emoji:"🔁", title:"repeat() — avoid repetition", code:`/* Instead of: */ \ngrid-template-columns: 1fr 1fr 1fr 1fr;\n/* Write: */\ngrid-template-columns: repeat(4, 1fr);`, desc:`repeat(count, size) is shorthand for repeating the same column/row size.` },
          { emoji:"🪄", title:"auto-fill + minmax() — responsive with no media queries!", code:`grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));`, desc:`This automatically creates as many columns as will fit, each at least 200px wide. On a wide screen = many columns. On mobile = 1 column. Zero media queries needed!` },
          { emoji:"📌", title:"Spanning items across cells", code:`.wide-item {\n  grid-column: 1 / 3;  /* from line 1 to line 3 = 2 cols */\n  grid-row: span 2;    /* span 2 rows */\n}`, desc:`Items can span multiple columns or rows using grid-column and grid-row.` },
        ].map(item => (
          <div key={item.title} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:10, padding:14 }}>
            <div style={{ fontWeight:700, color:t.text, fontSize:14, marginBottom:6, fontFamily:"system-ui" }}>{item.emoji} {item.title}</div>
            <div style={{ background:t.codeBg, borderRadius:7, padding:"10px 12px", marginBottom:8 }}>
              <pre style={{ margin:0, color:t.codeText, fontSize:12, fontFamily:"monospace", lineHeight:1.7 }}>{item.code}</pre>
            </div>
            <div style={{ color:t.muted, fontSize:13, lineHeight:1.6, fontFamily:"system-ui" }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChapterPosition({ t }) {
  const [pos, setPos] = useState("static");

  const positions = [
    { val:"static", color:t.muted, label:"Static (default)",
      desc:"Every element starts as static. It flows naturally in the page — top/left/right/bottom have NO effect.",
      demo: <div style={{ fontFamily:"system-ui", position:"relative", height:80 }}>
        <div style={{ display:"inline-block", background:t.accentSoft, border:`2px solid ${t.accent}`, borderRadius:6, padding:"8px 14px", fontSize:13, color:t.accentText }}>position: static — just sits in normal flow</div>
      </div>
    },
    { val:"relative", color:t.blue, label:"Relative",
      desc:"Moves the element relative to WHERE IT WOULD NORMALLY BE. The original space is preserved.",
      demo: <div style={{ fontFamily:"system-ui", position:"relative", height:90 }}>
        <div style={{ display:"inline-block", background:"#dbeafe", border:"2px solid #2563eb", borderRadius:6, padding:"8px 14px", fontSize:13, color:"#1d4ed8" }}>Normal position</div>
        <div style={{ display:"inline-block", background:"#bfdbfe", border:"2px solid #2563eb", borderRadius:6, padding:"8px 14px", fontSize:13, color:"#1d4ed8", position:"relative", top:20, left:10, marginLeft:8 }}>Moved ↓ 20px →</div>
      </div>
    },
    { val:"absolute", color:t.orange, label:"Absolute",
      desc:"Removed from normal flow. Positioned relative to the nearest parent that has position: relative.",
      demo: <div style={{ fontFamily:"system-ui", position:"relative", height:100, background:t.orangeSoft, border:"2px dashed #d97706", borderRadius:8, padding:10 }}>
        <span style={{ color:t.orange, fontSize:11, fontWeight:700 }}>Parent (position: relative)</span>
        <div style={{ position:"absolute", bottom:10, right:10, background:"#d97706", color:"white", borderRadius:6, padding:"6px 12px", fontSize:12, fontWeight:700 }}>Absolute: bottom-right corner</div>
      </div>
    },
    { val:"fixed", color:t.green, label:"Fixed",
      desc:"Stays in the same place in the VIEWPORT even when you scroll. Perfect for navbars and floating buttons.",
      demo: <div style={{ fontFamily:"system-ui", background:t.greenSoft, border:"2px dashed #059669", borderRadius:8, padding:10, fontSize:13, color:t.green }}>
        ✓ Imagine a navbar at top: 0 that stays put while you scroll down the page. That's fixed positioning!
      </div>
    },
    { val:"sticky", color:"#8b5cf6", label:"Sticky",
      desc:"Acts like relative UNTIL it hits a scroll threshold, then sticks like fixed. Great for section headers!",
      demo: <div style={{ fontFamily:"system-ui", background:"#ede9fe", border:"2px dashed #8b5cf6", borderRadius:8, padding:10, fontSize:13, color:"#5b21b6" }}>
        ✓ Imagine a sidebar that scrolls with you until it reaches the top of the screen, then sticks in place!
      </div>
    },
  ];

  const current = positions.find(p => p.val === pos) || positions[0];

  return (
    <div>
      <Para t={t}>CSS position controls how elements are placed on the page. There are 5 values, and each behaves completely differently. This confuses a lot of beginners — but the diagram below makes it clear!</Para>

      <SectionTitle t={t}>🗺️ Pick a position to learn about it</SectionTitle>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
        {positions.map(p => (
          <button key={p.val} onClick={()=>setPos(p.val)} style={{
            background: pos===p.val ? p.color : t.card,
            color: pos===p.val ? "white" : t.muted,
            border: `2px solid ${p.color}`,
            borderRadius:8, padding:"8px 16px",
            cursor:"pointer", fontSize:13, fontWeight:700,
            fontFamily:"system-ui", transition:"all 0.2s",
          }}>{p.label}</button>
        ))}
      </div>

      {/* Detail card */}
      <div style={{ background:t.card, border:`2px solid ${current.color}44`, borderRadius:14, overflow:"hidden", marginBottom:20 }}>
        <div style={{ background:`${current.color}18`, borderBottom:`1px solid ${current.color}33`, padding:"14px 18px" }}>
          <div style={{ color:current.color, fontWeight:800, fontSize:18, fontFamily:"system-ui" }}>position: {current.val}</div>
        </div>
        <div style={{ padding:18 }}>
          <Para t={t}>{current.desc}</Para>
          <div style={{ marginBottom:14 }}>{current.demo}</div>
        </div>
      </div>

      <SectionTitle t={t}>📐 The z-index property</SectionTitle>
      <Para t={t}>When elements overlap, <strong style={{color:t.text}}>z-index</strong> controls which one appears on top. Think of it like layers in Photoshop. Higher number = closer to you.</Para>
      <div style={{ position:"relative", height:130, background:t.cardAlt, borderRadius:12, border:`1px solid ${t.border}`, overflow:"hidden" }}>
        {[
          { label:"z-index: 1", style:{ left:20, top:20, background:"#7c3aed", zIndex:1, width:120 } },
          { label:"z-index: 3", style:{ left:60, top:40, background:"#059669", zIndex:3, width:120 } },
          { label:"z-index: 2", style:{ left:40, top:60, background:"#d97706", zIndex:2, width:120 } },
        ].map((l,i) => (
          <div key={i} style={{
            position:"absolute", ...l.style,
            color:"white", padding:"8px 14px", borderRadius:8,
            fontWeight:700, fontSize:12, fontFamily:"system-ui",
            boxShadow:"0 4px 16px rgba(0,0,0,0.3)",
          }}>{l.label}</div>
        ))}
      </div>
      <CodeBlock t={t} code={`.navbar  { position: fixed; z-index: 100; top: 0; width: 100%; }
.modal   { position: fixed; z-index: 1000; top: 50%; left: 50%; }
.tooltip { position: absolute; z-index: 50; }`} />
    </div>
  );
}

function ChapterAnimation({ t }) {
  const [activeAnim, setActiveAnim] = useState("fadeIn");

  return (
    <div>
      <style>{`
        @keyframes css-fadein { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes css-bounce { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-25px);} }
        @keyframes css-spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @keyframes css-pulse { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.15);opacity:0.7;} }
        @keyframes css-slide { from{transform:translateX(-100%);opacity:0;} to{transform:translateX(0);opacity:1;} }
        @keyframes css-shake { 0%,100%{transform:translateX(0);} 25%{transform:translateX(-8px);} 75%{transform:translateX(8px);} }
        .hover-card { transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer; }
        .hover-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 16px 32px rgba(0,0,0,0.2); }
        .anim-fadein { animation: css-fadein 0.8s ease-out both; }
        .anim-bounce { animation: css-bounce 1s ease-in-out infinite; }
        .anim-spin   { animation: css-spin 2s linear infinite; }
        .anim-pulse  { animation: css-pulse 1.5s ease-in-out infinite; }
        .anim-slide  { animation: css-slide 0.6s ease-out both; }
        .anim-shake  { animation: css-shake 0.5s ease-in-out; }
      `}</style>

      <Para t={t}>CSS can animate elements in two ways: <strong style={{color:t.text}}>transitions</strong> (smooth changes between two states) and <strong style={{color:t.text}}>keyframe animations</strong> (complex multi-step sequences).</Para>

      <SectionTitle t={t}>🔄 Transitions — The Easy Way to Animate</SectionTitle>
      <Para t={t}>A transition says: "when this property changes, make it smooth instead of instant." You write it on the element, not on the hover state.</Para>
      <CodeBlock t={t} code={`/* Write transition on the element */
.button {
  background: purple;
  transform: scale(1);
  transition: background 0.3s ease,    /* property duration easing */
              transform  0.2s ease;
}

/* Then change the properties on hover */
.button:hover {
  background: darkpurple;
  transform: scale(1.05);  /* transition makes this smooth! */
}`} />

      <Para t={t}>Hover the card below — this is a pure CSS transition:</Para>
      <div className="hover-card" style={{
        background: `linear-gradient(135deg, ${t.accent}, #db2777)`,
        borderRadius:12, padding:24, color:"white",
        marginBottom:20, textAlign:"center", fontFamily:"system-ui",
      }}>
        <div style={{ fontSize:24, marginBottom:4 }}>🎴</div>
        <div style={{ fontWeight:700, fontSize:16 }}>Hover me!</div>
        <div style={{ fontSize:13, opacity:0.8, marginTop:4 }}>transition: transform 0.3s ease</div>
      </div>

      <SectionTitle t={t}>🎬 Keyframe Animations — Multi-Step Motion</SectionTitle>
      <Para t={t}>Keyframes let you define an animation step-by-step. First define the animation with <MiniCode t={t}>@keyframes</MiniCode>, then apply it with <MiniCode t={t}>animation</MiniCode>.</Para>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
        {[
          { name:"fadeIn", label:"Fade In", cls:"anim-fadein", emoji:"👻", code:`@keyframes fadeIn {\n  from { opacity: 0; transform: translateY(20px); }\n  to   { opacity: 1; transform: translateY(0); }\n}` },
          { name:"bounce", label:"Bounce", cls:"anim-bounce", emoji:"⚽", code:`@keyframes bounce {\n  0%,100% { transform: translateY(0); }\n  50%     { transform: translateY(-25px); }\n}` },
          { name:"spin",   label:"Spin",   cls:"anim-spin",   emoji:"⚙️", code:`@keyframes spin {\n  from { transform: rotate(0deg); }\n  to   { transform: rotate(360deg); }\n}` },
          { name:"pulse",  label:"Pulse",  cls:"anim-pulse",  emoji:"💜", code:`@keyframes pulse {\n  0%,100% { transform: scale(1); }\n  50%     { transform: scale(1.15); }\n}` },
          { name:"slide",  label:"Slide In",cls:"anim-slide", emoji:"📥", code:`@keyframes slideIn {\n  from { transform: translateX(-100%); opacity: 0; }\n  to   { transform: translateX(0); opacity: 1; }\n}` },
          { name:"shake",  label:"Shake",  cls:"anim-shake",  emoji:"📳", code:`@keyframes shake {\n  0%,100% { transform: translateX(0); }\n  25%     { transform: translateX(-8px); }\n  75%     { transform: translateX(8px); }\n}` },
        ].map((anim) => {
          const isActive = activeAnim === anim.name;
          return (
            <div key={anim.name} style={{ background:t.card, border:`1px solid ${isActive ? t.accent : t.border}`, borderRadius:12, overflow:"hidden", cursor:"pointer" }}
              onClick={() => setActiveAnim(anim.name)}>
              <div style={{ padding:14, textAlign:"center", background:isActive ? t.accentSoft : t.cardAlt }}>
                <div className={anim.cls} style={{ fontSize:32, marginBottom:8, display:"inline-block" }}>{anim.emoji}</div>
                <div style={{ fontWeight:700, fontSize:13, color: isActive ? t.accent : t.text, fontFamily:"system-ui" }}>{anim.label}</div>
              </div>
              {isActive && (
                <div style={{ background:t.codeBg, padding:"10px 12px" }}>
                  <pre style={{ margin:0, color:t.codeText, fontSize:10, fontFamily:"monospace", lineHeight:1.7 }}>{anim.code}</pre>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <CodeBlock t={t} label="How to apply a keyframe animation" code={`.spinner {
  /* name    duration  easing   delay  count    direction  */
  animation: spin      2s       linear  0s      infinite   normal;

  /* Most common shorthand */
  animation: bounce 1s ease-in-out infinite;
  animation: fadeIn 0.5s ease-out both; /* 'both' keeps the end state */
}`} />

      <Callout emoji="⚡" title="Performance Tip" color="green" t={t}>
        Only animate <MiniCode t={t}>transform</MiniCode> and <MiniCode t={t}>opacity</MiniCode> — they're super smooth because the browser handles them on the GPU. Avoid animating <code style={{fontFamily:"monospace"}}>width, height, top, left, margin</code> — they cause layout recalculations and can feel janky.
      </Callout>
    </div>
  );
}

function ChapterVariables({ t }) {
  const [primary, setPrimary] = useState("#7c3aed");
  const [radius, setRadius] = useState(8);
  const [spacing, setSpacing] = useState(16);

  return (
    <div>
      <Para t={t}>CSS variables (officially called "Custom Properties") let you store values with a name and reuse them everywhere. Change the value in one place → it updates everywhere automatically. Perfect for themes and design systems!</Para>

      <Callout emoji="💡" title="CSS Variables vs SASS Variables" color="orange" t={t}>
        CSS variables (<MiniCode t={t}>--my-color</MiniCode>) are <strong>live in the browser</strong> — you can change them with JavaScript at runtime. SASS variables (<MiniCode t={t}>$my-color</MiniCode>) are compile-time only — gone by the time the browser sees them.
      </Callout>

      <SectionTitle t={t}>📝 How to Use CSS Variables</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
        <div>
          <Badge color="blue" t={t}>Step 1: Define with --name</Badge>
          <CodeBlock t={t} code={`:root {
  --primary-color: #7c3aed;
  --text-color: #1a1535;
  --spacing-md: 16px;
  --border-radius: 8px;
  --shadow: 0 4px 12px rgba(0,0,0,.1);
}`} />
          <div style={{ color:t.muted, fontSize:13, fontFamily:"system-ui", lineHeight:1.6 }}>
            <strong style={{color:t.text}}>:root</strong> is the top level of the page. Variables defined here are available everywhere.
          </div>
        </div>
        <div>
          <Badge color="green" t={t}>Step 2: Use with var()</Badge>
          <CodeBlock t={t} code={`.button {
  background: var(--primary-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  color: white;
}

.card {
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
}`} />
        </div>
      </div>

      <SectionTitle t={t}>🌙 Dark Mode with CSS Variables</SectionTitle>
      <Para t={t}>CSS variables make dark mode incredibly easy. Define your colors as variables, then override them for dark mode:</Para>
      <CodeBlock t={t} code={`:root {
  --bg-color:   #ffffff;  /* white background */
  --text-color: #1a1535;  /* dark text */
  --card-color: #f8f6ff;
}

/* When dark mode is on, just override the variables! */
[data-theme="dark"] {
  --bg-color:   #0f0d1a;  /* dark background */
  --text-color: #ede9ff;  /* light text */
  --card-color: #18162a;
}

/* Everything using var() updates automatically! */
body { background: var(--bg-color); color: var(--text-color); }
.card { background: var(--card-color); }`} />

      <SectionTitle t={t}>🎮 Live Variable Demo</SectionTitle>
      <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:14, padding:20 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:20 }}>
          <div>
            <div style={{ color:t.muted, fontSize:12, marginBottom:6, fontFamily:"system-ui", fontWeight:600 }}>--primary-color</div>
            <input type="color" value={primary} onChange={e=>setPrimary(e.target.value)}
              style={{ width:"100%", height:38, border:`1px solid ${t.border}`, borderRadius:8, cursor:"pointer", padding:2 }} />
          </div>
          <div>
            <div style={{ color:t.muted, fontSize:12, marginBottom:6, fontFamily:"system-ui", fontWeight:600 }}>--border-radius: {radius}px</div>
            <input type="range" min={0} max={30} value={radius} onChange={e=>setRadius(+e.target.value)}
              style={{ width:"100%", marginTop:10, accentColor:primary }} />
          </div>
          <div>
            <div style={{ color:t.muted, fontSize:12, marginBottom:6, fontFamily:"system-ui", fontWeight:600 }}>--spacing: {spacing}px</div>
            <input type="range" min={4} max={40} value={spacing} onChange={e=>setSpacing(+e.target.value)}
              style={{ width:"100%", marginTop:10, accentColor:primary }} />
          </div>
        </div>

        {/* Live component using "variables" */}
        <div style={{ background:t.cardAlt, borderRadius:12, padding:20, border:`1px solid ${t.border}` }}>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <button style={{ background:primary, color:"white", border:"none", borderRadius:radius, padding:`${spacing/2}px ${spacing}px`, cursor:"pointer", fontSize:14, fontWeight:700, fontFamily:"system-ui" }}>Primary Button</button>
            <button style={{ background:"transparent", color:primary, border:`2px solid ${primary}`, borderRadius:radius, padding:`${spacing/2 - 2}px ${spacing}px`, cursor:"pointer", fontSize:14, fontWeight:700, fontFamily:"system-ui" }}>Outline Button</button>
            <div style={{ background:primary+"22", color:primary, borderRadius:radius, padding:`${spacing/4}px ${spacing/2}px`, fontSize:12, fontWeight:700, fontFamily:"system-ui", display:"flex",alignItems:"center" }}>Badge</div>
          </div>
          <div style={{ marginTop:spacing, background:"white", borderRadius:radius, padding:spacing, border:`1px solid #e5e7eb`, boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}>
            <div style={{ fontWeight:700, fontSize:14, color:"#1a1535", marginBottom:spacing/2, fontFamily:"system-ui" }}>Card Component</div>
            <div style={{ height:4, background:`linear-gradient(90deg, ${primary}, ${primary}66)`, borderRadius:2, marginBottom:spacing/2 }}/>
            <div style={{ fontSize:13, color:"#6b7280", fontFamily:"system-ui", lineHeight:1.6 }}>All styled using CSS variables. Change the controls above!</div>
          </div>
        </div>

        <div style={{ background:t.codeBg, borderRadius:8, padding:"12px 16px", marginTop:12 }}>
          <code style={{ color:t.codeText, fontSize:12, fontFamily:"monospace" }}>
            {`:root {\n  --primary: ${primary};\n  --radius: ${radius}px;\n  --spacing: ${spacing}px;\n}`}
          </code>
        </div>
      </div>
    </div>
  );
}

function ChapterResponsive({ t }) {
  const [screenW, setScreenW] = useState(800);
  const cols = screenW < 480 ? 1 : screenW < 768 ? 2 : screenW < 1024 ? 3 : 4;

  return (
    <div>
      <Para t={t}>Responsive design means your website looks great on ALL screen sizes — phones, tablets, and desktops. The main tool is the <strong style={{color:t.text}}>media query</strong>, which applies CSS only when certain conditions are true.</Para>

      <SectionTitle t={t}>📐 Breakpoints — The Screen Size Thresholds</SectionTitle>
      <div style={{ display:"flex", gap:0, marginBottom:20, borderRadius:10, overflow:"hidden", border:`1px solid ${t.border}` }}>
        {[
          { label:"📱 Mobile", range:"< 480px", color:t.red, desc:"Single column" },
          { label:"📲 Phablet", range:"480–768px", color:t.orange, desc:"2 columns" },
          { label:"💻 Tablet", range:"768–1024px", color:t.accent, desc:"3 columns" },
          { label:"🖥️ Desktop", range:"> 1024px", color:t.blue, desc:"4 columns" },
        ].map((bp,i) => (
          <div key={i} style={{ flex:1, padding:"12px 10px", background:`${bp.color}18`, borderRight: i<3 ? `1px solid ${t.border}` : "none", textAlign:"center" }}>
            <div style={{ fontSize:18, marginBottom:4 }}>{bp.label.split(" ")[0]}</div>
            <div style={{ color:bp.color, fontWeight:700, fontSize:11, fontFamily:"system-ui" }}>{bp.label.split(" ").slice(1).join(" ")}</div>
            <div style={{ color:t.muted, fontSize:11, fontFamily:"system-ui", marginTop:2 }}>{bp.range}</div>
            <div style={{ color:t.muted, fontSize:11, fontFamily:"system-ui" }}>{bp.desc}</div>
          </div>
        ))}
      </div>

      <SectionTitle t={t}>🎮 Simulate Screen Width</SectionTitle>
      <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:14, padding:20 }}>
        <div style={{ marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ color:t.muted, fontSize:13, fontFamily:"system-ui" }}>Screen width: <strong style={{color:t.text}}>{screenW}px</strong></span>
            <Badge color={screenW<480?"red":screenW<768?"orange":screenW<1024?"accent":"blue"} t={t}>
              {screenW<480?"📱 Mobile":screenW<768?"📲 Phablet":screenW<1024?"💻 Tablet":"🖥️ Desktop"}
            </Badge>
          </div>
          <input type="range" min={320} max={1400} value={screenW} onChange={e=>setScreenW(+e.target.value)}
            style={{ width:"100%", accentColor:t.accent }} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
            {[320,480,768,1024,1400].map(w => (
              <span key={w} style={{ color:t.muted, fontSize:10, fontFamily:"system-ui" }}>{w}</span>
            ))}
          </div>
        </div>

        {/* Simulated grid */}
        <div style={{
          display:"grid",
          gridTemplateColumns:`repeat(${cols}, 1fr)`,
          gap:10, transition:"all 0.4s ease",
          background:t.cardAlt, border:`2px dashed ${t.border}`,
          borderRadius:10, padding:12,
        }}>
          {Array.from({length:8},(_,i) => (
            <div key={i} style={{
              background:[t.accent,t.blue,t.green,t.orange,t.red,"#8b5cf6","#ec4899","#06b6d4"][i],
              color:"white", borderRadius:8, padding:"14px 8px",
              textAlign:"center", fontWeight:700, fontSize:12,
              fontFamily:"system-ui", transition:"all 0.4s",
            }}>Card {i+1}</div>
          ))}
        </div>

        <div style={{ background:t.codeBg, borderRadius:8, padding:"12px 16px", marginTop:12 }}>
          <code style={{ color:t.codeText, fontSize:12, fontFamily:"monospace" }}>
            {`/* Result: ${cols} column${cols>1?"s":""} */\ngrid-template-columns: repeat(${cols}, 1fr);`}
          </code>
        </div>
      </div>

      <SectionTitle t={t}>📝 Media Query Syntax</SectionTitle>
      <CodeBlock t={t} code={`/* Mobile-first: start simple, add complexity for larger screens */

/* Base styles — mobile (no media query needed) */
.grid {
  display: grid;
  grid-template-columns: 1fr;   /* 1 column on mobile */
  gap: 16px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: 1fr 1fr;   /* 2 columns */
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: 1fr 1fr 1fr;  /* 3 columns */
  }
}`} />

      <Callout emoji="🪄" title="Responsive Without Media Queries!" color="green" t={t}>
        Modern CSS can be responsive automatically! <MiniCode t={t}>repeat(auto-fill, minmax(200px, 1fr))</MiniCode> creates as many columns as fit, and <MiniCode t={t}>font-size: clamp(1rem, 3vw, 2rem)</MiniCode> scales text fluidly between minimum and maximum values.
      </Callout>
    </div>
  );
}

// ─── CHAPTER ROUTER ─────────────────────────────────────────
function ChapterContent({ id, t }) {
  const map = {
    what: <ChapterWhat t={t} />,
    syntax: <ChapterSyntax t={t} />,
    selectors: <ChapterSelectors t={t} />,
    boxmodel: <ChapterBoxModel t={t} />,
    colors: <ChapterColors t={t} />,
    typography: <ChapterTypography t={t} />,
    flexbox: <ChapterFlexbox t={t} />,
    grid: <ChapterGrid t={t} />,
    position: <ChapterPosition t={t} />,
    animation: <ChapterAnimation t={t} />,
    variables: <ChapterVariables t={t} />,
    responsive: <ChapterResponsive t={t} />,
  };
  return map[id] || <div>Coming soon!</div>;
}

// ─── MAIN APP ────────────────────────────────────────────────
export default function CSSMasterclass() {
  const [isDark, setIsDark] = useState(false);
  const [active, setActive] = useState("what");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const t = isDark ? T.dark : T.light;
  const idx = chapters.findIndex(c => c.id === active);
  const progress = Math.round(((idx + 1) / chapters.length) * 100);
  const current = chapters[idx];

  return (
    <div style={{
      minHeight:"100vh",
      background:t.bg,
      color:t.text,
      fontFamily:"system-ui, sans-serif",
      display:"flex", flexDirection:"column",
      transition:"background 0.3s, color 0.3s",
    }}>
      {/* ── HEADER ── */}
      <header style={{
        background:t.nav, color:t.navText,
        height:58, padding:"0 20px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"sticky", top:0, zIndex:200,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{ background:"none", border:"none", color:t.navText, cursor:"pointer", fontSize:20, opacity:0.6 }}>☰</button>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:32, height:32, background:t.accent, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:18, color:"white" }}>C</div>
            <div>
              <div style={{ fontWeight:800, fontSize:16, color:t.navText, lineHeight:1 }}>CSS Masterclass</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginTop:1 }}>Learn CSS visually, step by step</div>
            </div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          {/* Progress */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:90, height:5, background:"rgba(255,255,255,0.1)", borderRadius:3, overflow:"hidden" }}>
              <div style={{ width:`${progress}%`, height:"100%", background:t.accent, borderRadius:3, transition:"width 0.4s" }}/>
            </div>
            <span style={{ color:"rgba(255,255,255,0.5)", fontSize:12 }}>{progress}%</span>
          </div>
          <button onClick={()=>setIsDark(!isDark)} style={{
            background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)",
            color:t.navText, borderRadius:20, padding:"5px 14px",
            cursor:"pointer", fontSize:13,
          }}>{isDark?"☀️ Light":"🌙 Dark"}</button>
        </div>
      </header>

      <div style={{ display:"flex", flex:1 }}>
        {/* ── SIDEBAR ── */}
        <aside style={{
          width:sidebarOpen?240:0, minWidth:sidebarOpen?240:0,
          overflow:"hidden",
          background:t.card, borderRight:`1px solid ${t.border}`,
          transition:"all 0.3s ease",
          position:"sticky", top:58,
          height:"calc(100vh - 58px)", overflowY:"auto",
        }}>
          <div style={{ padding:"12px 0" }}>
            {chapters.map((ch, i) => {
              const isActive = ch.id === active;
              const isPast = i < idx;
              return (
                <button key={ch.id} onClick={()=>setActive(ch.id)} style={{
                  width:"100%", textAlign:"left",
                  background: isActive ? t.accentSoft : "transparent",
                  color: isActive ? t.accentText : t.muted,
                  border:"none",
                  borderLeft: isActive ? `3px solid ${t.accent}` : "3px solid transparent",
                  padding:"9px 16px",
                  cursor:"pointer", fontSize:13,
                  fontWeight: isActive ? 700 : 400,
                  display:"flex", alignItems:"center", gap:8,
                  transition:"all 0.15s",
                }}>
                  <span style={{
                    width:22, height:22, borderRadius:5, flexShrink:0,
                    background: isActive ? t.accent : isPast ? t.green+"22" : t.cardAlt,
                    color: isActive ? "white" : isPast ? t.green : t.muted,
                    border: `1px solid ${isActive ? t.accent : isPast ? t.green+"44" : t.border}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:10, fontWeight:800,
                  }}>{isPast ? "✓" : i+1}</span>
                  <span>{ch.emoji} {ch.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main style={{ flex:1, padding:"32px 28px", maxWidth:860, margin:"0 auto", width:"100%" }}>

          {/* Chapter header */}
          <div style={{ marginBottom:24 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <span style={{ background:t.accentSoft, color:t.accentText, borderRadius:4, padding:"3px 10px", fontSize:11, fontWeight:700, letterSpacing:1 }}>
                CHAPTER {idx+1} OF {chapters.length}
              </span>
            </div>
            <h1 style={{ fontSize:32, fontWeight:900, margin:"0 0 8px", letterSpacing:-0.5, color:t.text, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:30 }}>{current.emoji}</span> {current.label}
            </h1>
            {/* Progress bar under title */}
            <div style={{ height:3, background:t.border, borderRadius:2, overflow:"hidden" }}>
              <div style={{ width:`${progress}%`, height:"100%", background:t.accent, borderRadius:2, transition:"width 0.4s" }}/>
            </div>
          </div>

          {/* Content */}
          <ChapterContent id={active} t={t} />

          {/* Navigation */}
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:40, paddingTop:24, borderTop:`1px solid ${t.border}` }}>
            {chapters[idx-1] ? (
              <button onClick={()=>setActive(chapters[idx-1].id)} style={{
                background:t.card, color:t.text, border:`1px solid ${t.border}`,
                borderRadius:8, padding:"10px 20px", cursor:"pointer", fontSize:13, fontWeight:600,
              }}>← {chapters[idx-1].emoji} {chapters[idx-1].label}</button>
            ) : <div/>}
            {chapters[idx+1] ? (
              <button onClick={()=>setActive(chapters[idx+1].id)} style={{
                background:t.accent, color:"white", border:"none",
                borderRadius:8, padding:"10px 20px", cursor:"pointer", fontSize:13, fontWeight:700,
                boxShadow:`0 4px 16px ${t.accent}44`,
              }}>Next: {chapters[idx+1].emoji} {chapters[idx+1].label} →</button>
            ) : (
              <div style={{ background:`linear-gradient(135deg, ${t.green}, #059669)`, color:"white", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:800 }}>
                🎓 You've mastered CSS!
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}