import { useState, useRef, useEffect, useReducer, useCallback, useMemo, createContext, useContext } from "react";

/* ── THEME ─────────────────────────────────────────────────── */
const T = {
  dark: { bg:"#05070f", sidebar:"#080b18", surface:"#0c1020", surface2:"#111528", border:"#1a2040", text:"#dde8ff", muted:"#4a5880", accent:"#60a5fa", accentBg:"#60a5fa10", accentBorder:"#60a5fa38", danger:"#f87171", warn:"#fbbf24", success:"#34d399", purple:"#a78bfa", pink:"#f472b6", orange:"#fb923c" },
  light: { bg:"#f0f4ff", sidebar:"#ffffff", surface:"#ffffff", surface2:"#e8eeff", border:"#c8d4f0", text:"#0a0f2a", muted:"#4a5880", accent:"#2563eb", accentBg:"#2563eb10", accentBorder:"#2563eb35", danger:"#dc2626", warn:"#d97706", success:"#059669", purple:"#7c3aed", pink:"#db2777", orange:"#ea580c" },
};

/* ── SHARED COMPONENTS ─────────────────────────────────────── */
function CopyBtn({ code }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(code); setOk(true); setTimeout(() => setOk(false), 2000); }}
      style={{ position:"absolute", top:10, right:10, background:ok?"#34d39922":"#ffffff0e", border:`1px solid ${ok?"#34d39966":"#ffffff18"}`, color:ok?"#34d399":"#4a5880", borderRadius:6, padding:"3px 10px", fontSize:"0.72rem", cursor:"pointer", fontFamily:"monospace", transition:"all .2s" }}>
      {ok ? "✓ copied" : "copy"}
    </button>
  );
}

function Code({ code }) {
  const lines = code.trim().split("\n");
  const col = (l) => {
    const tr = l.trim();
    if (tr.startsWith("//") || tr.startsWith("/*") || tr.startsWith("*")) return "#3a4860";
    if (/\b(import|export|from|default|const|let|return|async|await|function|class|extends|new|typeof|instanceof)\b/.test(l)) return "#a78bfa";
    if (/use(State|Effect|Ref|Context|Reducer|Callback|Memo|Id|LayoutEffect)\b/.test(l)) return "#60a5fa";
    if (/<[A-Z][a-zA-Z]*/.test(l)) return "#f472b6";
    if (/<[a-z]+[\s/>]/.test(l) || l.includes("</")) return "#7dd3fc";
    if (/"[^"]*"|'[^']*'|`[^`]*`/.test(l)) return "#86efac";
    if (/props\.|\.map\(|\.filter\(|\.reduce\(/.test(l)) return "#fbbf24";
    return "#c8d8f0";
  };
  return (
    <div style={{ position:"relative", borderRadius:12, overflow:"hidden", border:"1px solid #1a2040" }}>
      <div style={{ background:"#030508", padding:"14px 16px", overflowX:"auto" }}>
        <pre style={{ margin:0, fontFamily:"'Fira Code','Cascadia Code',monospace", fontSize:"0.78rem", lineHeight:1.8 }}>
          {lines.map((line, i) => (
            <div key={i} style={{ display:"flex", gap:16 }}>
              <span style={{ color:"#1a2040", userSelect:"none", minWidth:20, textAlign:"right", flexShrink:0 }}>{i+1}</span>
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
      <div style={{ width:3, height:18, background:color||"#60a5fa", borderRadius:99 }} />
      <span style={{ fontSize:"0.72rem", fontWeight:700, color:"#4a5880", textTransform:"uppercase", letterSpacing:"0.07em" }}>{children}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 1 — What is React? Component Tree
══════════════════════════════════════════════════════════════ */
function IntroDemo({ t }) {
  const [hov, setHov] = useState(null);
  const [view, setView] = useState("tree");
  const tree = [
    { id:"app",    label:"<App />",        depth:0, color:"#60a5fa", desc:"Root component — mounts into <div id='root'> in index.html" },
    { id:"nav",    label:"<Navbar />",     depth:1, color:"#a78bfa", parent:"app",    desc:"Top navigation bar — shared across all pages" },
    { id:"logo",   label:"<Logo />",       depth:2, color:"#f472b6", parent:"nav",    desc:"Leaf component — renders logo image and brand name" },
    { id:"links",  label:"<NavLinks />",   depth:2, color:"#f472b6", parent:"nav",    desc:"Renders navigation links from a config array" },
    { id:"main",   label:"<Main />",       depth:1, color:"#a78bfa", parent:"app",    desc:"Main content area — swaps content based on route" },
    { id:"hero",   label:"<Hero />",       depth:2, color:"#f472b6", parent:"main",   desc:"Hero banner with heading, subtitle, CTA button" },
    { id:"grid",   label:"<CardGrid />",   depth:2, color:"#f472b6", parent:"main",   desc:"Renders a responsive grid of Card components" },
    { id:"card",   label:"<Card />",       depth:3, color:"#fbbf24", parent:"grid",   desc:"Single card — receives title, body, image via props" },
    { id:"footer", label:"<Footer />",     depth:1, color:"#a78bfa", parent:"app",    desc:"Footer — copyright, links, social icons" },
  ];
  const hovNode = hov !== null ? tree[hov] : null;
  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Component tree — hover any node</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["🌳 Tree","tree"],["⚔️ vs Vanilla JS","compare"]].map(([l,v]) => (
          <button key={v} onClick={() => setView(v)} style={{ background:view===v?t.accentBg:t.surface, color:view===v?t.accent:t.muted, border:`1px solid ${view===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>
      {view === "tree" ? (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 200px" }}>
            {tree.map((node, i) => (
              <div key={node.id} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
                style={{ display:"flex", alignItems:"center", gap:8, paddingLeft:node.depth*18+8, paddingTop:5, paddingBottom:5, paddingRight:8, marginBottom:3, borderRadius:8, background:hov===i?node.color+"22":"transparent", cursor:"default", transition:"background .15s" }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:node.color, flexShrink:0 }}/>
                <code style={{ color:hov===i?node.color:t.text, fontSize:"0.82rem", fontWeight:700 }}>{node.label}</code>
              </div>
            ))}
          </div>
          <div style={{ flex:"1 1 200px" }}>
            {hovNode ? (
              <div style={{ background:"#030508", border:`1px solid ${hovNode.color}55`, borderRadius:10, padding:"14px 16px" }}>
                <code style={{ color:hovNode.color, fontWeight:700, fontSize:"0.92rem" }}>{hovNode.label}</code>
                <p style={{ color:t.muted, fontSize:"0.8rem", marginTop:8, marginBottom:8, lineHeight:1.65 }}>{hovNode.desc}</p>
                {hovNode.parent && <div style={{ color:t.muted, fontSize:"0.72rem" }}>Parent: <code style={{ color:hovNode.color }}>{tree.find(n=>n.id===hovNode.parent)?.label}</code></div>}
              </div>
            ) : (
              <div style={{ background:t.surface, border:`2px dashed ${t.border}`, borderRadius:10, padding:24, textAlign:"center", color:t.muted, fontSize:"0.82rem" }}>← Hover a node</div>
            )}
            <div style={{ marginTop:10, display:"flex", flexDirection:"column", gap:4 }}>
              {[["#60a5fa","Root"],["#a78bfa","Layouts / Pages"],["#f472b6","Feature Components"],["#fbbf24","Leaf Components"]].map(([c,l]) => (
                <div key={l} style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <div style={{ width:9, height:9, borderRadius:"50%", background:c }}/>
                  <span style={{ fontSize:"0.72rem", color:t.muted }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {[
            { label:"❌ Vanilla JS / jQuery", code:`// Manually find DOM elements and mutate them\nconst btn = document.getElementById('btn');\nconst count = document.getElementById('count');\nlet n = 0;\nbtn.addEventListener('click', () => {\n  n++;\n  count.textContent = n;  // ← you manage every update\n});`, col:"#f87171" },
            { label:"✅ React (Declarative)", code:`// Describe WHAT to render — React handles the DOM\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(c => c + 1)}>\n      Count: {count}\n    </button>\n  );\n}`, col:"#34d399" },
          ].map(item => (
            <div key={item.label} style={{ flex:"1 1 220px" }}>
              <div style={{ color:item.col, fontWeight:700, fontSize:"0.78rem", marginBottom:6 }}>{item.label}</div>
              <pre style={{ margin:0, background:"#030508", border:`1px solid ${item.col}30`, borderRadius:9, padding:"10px 12px", fontSize:"0.74rem", color:item.col, fontFamily:"monospace", lineHeight:1.7, overflow:"auto" }}>{item.code}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 2 — JSX
══════════════════════════════════════════════════════════════ */
function JSXDemo({ t }) {
  const [tab, setTab] = useState("rules");
  const [sel, setSel] = useState(0);
  const [expr, setExpr] = useState("user.name");
  const user = { name:"Alice", role:"Admin", score:9.5, age:28 };
  const getResult = () => {
    try {
      const safe = expr
        .replace(/user\.name/g,"'Alice'")
        .replace(/user\.role/g,"'Admin'")
        .replace(/user\.score/g,"9.5")
        .replace(/user\.age/g,"28")
        .replace(/isAdmin/g,"true");
      // eslint-disable-next-line no-new-func
      return String(new Function("return " + safe)());
    } catch { return "⚠ Invalid expression"; }
  };
  const rules = [
    { title:"Single root element", color:"#60a5fa", bad:"<h1>Hi</h1>\n<p>World</p>", good:"<>\n  <h1>Hi</h1>\n  <p>World</p>\n</>", note:"Use <> </> Fragment to avoid extra DOM node" },
    { title:"className not class",  color:"#a78bfa", bad:'<div class="card">…</div>', good:'<div className="card">…</div>', note:"class is a reserved JS keyword" },
    { title:"camelCase attributes", color:"#f472b6", bad:'<button onclick={fn} tabindex="0">', good:'<button onClick={fn} tabIndex={0}>', note:"HTML attributes become camelCase in JSX" },
    { title:"Self-close empty tags",color:"#fbbf24", bad:"<img src='x.jpg'>\n<br>\n<input>", good:"<img src='x.jpg' />\n<br />\n<input />", note:"All tags must be explicitly closed" },
    { title:"htmlFor not for",      color:"#34d399", bad:'<label for="email">Email</label>', good:'<label htmlFor="email">Email</label>', note:"for is also a reserved JS keyword" },
    { title:"Inline style is object",color:"#fb923c",bad:"<div style='color:red'>…</div>", good:"<div style={{ color:'red', fontSize:16 }}>…</div>", note:"Style takes a JS object, not a string" },
  ];
  const rule = rules[sel];
  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>JSX rules & expression embedding</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["📋 Rules","rules"],["{ } Expressions","expr"]].map(([l,v]) => (
          <button key={v} onClick={() => setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>
      {tab === "rules" ? (
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <div style={{ flex:"0 0 auto", display:"flex", flexDirection:"column", gap:4 }}>
            {rules.map((r,i) => (
              <button key={i} onClick={() => setSel(i)} style={{ textAlign:"left", background:sel===i?r.color+"25":t.surface, color:sel===i?r.color:t.muted, border:`1px solid ${sel===i?r.color+"60":t.border}`, borderRadius:7, padding:"6px 12px", cursor:"pointer", fontSize:"0.77rem", fontWeight:700, whiteSpace:"nowrap" }}>{r.title}</button>
            ))}
          </div>
          <div style={{ flex:1, minWidth:220 }}>
            <div style={{ background:"#030508", border:`1px solid ${rule.color}50`, borderRadius:10, padding:14 }}>
              <div style={{ color:rule.color, fontWeight:700, fontSize:"0.9rem", marginBottom:10 }}>{rule.title}</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {[["❌",rule.bad,t.danger],["✅",rule.good,t.success]].map(([icon,code,col]) => (
                  <div key={icon} style={{ flex:"1 1 160px" }}>
                    <div style={{ color:col, fontSize:"0.7rem", fontWeight:700, marginBottom:4 }}>{icon} {icon==="❌"?"Wrong":"Correct"}</div>
                    <pre style={{ margin:0, color:col, fontFamily:"monospace", fontSize:"0.76rem", background:`${col}12`, border:`1px solid ${col}30`, borderRadius:7, padding:"8px 10px", lineHeight:1.7 }}>{code}</pre>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:10, color:t.muted, fontSize:"0.75rem" }}>💡 {rule.note}</div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p style={{ color:t.muted, fontSize:"0.8rem", marginBottom:12 }}>Any JS <strong style={{ color:t.text }}>expression</strong> (not statement) works inside {"{}"} — try editing:</p>
          <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:12 }}>
            <code style={{ color:t.muted }}>{"<p>{"}</code>
            <input value={expr} onChange={e => setExpr(e.target.value)} style={{ flex:1, padding:"7px 10px", background:"#030508", border:`1px solid ${t.accentBorder}`, borderRadius:7, color:t.accent, fontFamily:"monospace", fontSize:"0.85rem", outline:"none" }}/>
            <code style={{ color:t.muted }}>{"}</p>"}</code>
          </div>
          <div style={{ background:"#030508", border:`1px solid ${t.accentBorder}`, borderRadius:10, padding:"12px 16px", marginBottom:12 }}>
            <div style={{ color:t.muted, fontSize:"0.7rem", marginBottom:4 }}>Renders:</div>
            <div style={{ color:t.accent, fontSize:"1rem", fontWeight:700, fontFamily:"monospace" }}>{getResult()}</div>
          </div>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
            {[["user.name","Alice"],["user.age * 2","56"],["2 + 2","4"],["user.score >= 9 ? '⭐' : '👍'","⭐"],["[1,2,3].join(', ')","1, 2, 3"],["new Date().getFullYear()","2025"]].map(([ex,res]) => (
              <button key={ex} onClick={() => setExpr(ex)} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, padding:"4px 10px", cursor:"pointer", fontSize:"0.73rem", fontFamily:"monospace", color:t.muted }}>
                {"{"+ex+"}"} <span style={{ color:t.accent }}>→ {res}</span>
              </button>
            ))}
          </div>
          <div style={{ marginTop:12, background:t.danger+"15", border:`1px solid ${t.danger}35`, borderRadius:8, padding:"8px 12px" }}>
            <div style={{ color:t.danger, fontWeight:700, fontSize:"0.77rem" }}>❌ Statements don't work in {"{ }"}:</div>
            <code style={{ color:t.muted, fontSize:"0.74rem" }}>{"{ if (x) {...} }"} — use ternary: {"{ x ? <A/> : <B/> }"}</code>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 3 — Props
══════════════════════════════════════════════════════════════ */
function PropsDemo({ t }) {
  const [name, setName]   = useState("Alice");
  const [role, setRole]   = useState("Developer");
  const [score, setScore] = useState(87);
  const [online, setOnline] = useState(true);
  const [accent, setAccent] = useState("#60a5fa");
  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 14px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Props — passing data into components</p>
      <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
        <div style={{ flex:"1 1 200px" }}>
          <div style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, marginBottom:8 }}>Edit props live:</div>
          {[["name (string)","text",name,setName],["role (string)","text",role,setRole]].map(([l,type,val,set]) => (
            <div key={l} style={{ marginBottom:10 }}>
              <label style={{ display:"block", fontSize:"0.72rem", color:t.muted, marginBottom:3 }}><code style={{ color:t.accent }}>{l}</code></label>
              <input type={type} value={val} onChange={e=>set(e.target.value)} style={{ width:"100%", boxSizing:"border-box", padding:"7px 10px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, fontSize:"0.82rem", outline:"none" }}/>
            </div>
          ))}
          <div style={{ marginBottom:10 }}>
            <label style={{ display:"block", fontSize:"0.72rem", color:t.muted, marginBottom:3 }}><code style={{ color:t.accent }}>score (number)</code></label>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <input type="range" min={0} max={100} value={score} onChange={e=>setScore(+e.target.value)} style={{ flex:1, accentColor:accent }}/>
              <code style={{ color:t.text, fontWeight:700, minWidth:28 }}>{score}</code>
            </div>
          </div>
          <div style={{ marginBottom:10 }}>
            <label style={{ display:"flex", gap:8, alignItems:"center", cursor:"pointer", fontSize:"0.78rem", color:t.muted }}>
              <input type="checkbox" checked={online} onChange={e=>setOnline(e.target.checked)} style={{ accentColor:accent, width:14, height:14 }}/>
              <code style={{ color:t.accent }}>isOnline</code> = {String(online)}
            </label>
          </div>
          <div>
            <label style={{ display:"block", fontSize:"0.72rem", color:t.muted, marginBottom:4 }}><code style={{ color:t.accent }}>accentColor</code></label>
            <div style={{ display:"flex", gap:6 }}>
              {["#60a5fa","#a78bfa","#f472b6","#34d399","#fbbf24","#fb923c"].map(c => (
                <div key={c} onClick={() => setAccent(c)} style={{ width:20, height:20, borderRadius:"50%", background:c, cursor:"pointer", border:accent===c?"3px solid #fff":"2px solid transparent", boxSizing:"border-box" }}/>
              ))}
            </div>
          </div>
        </div>
        <div style={{ flex:"1 1 200px" }}>
          <div style={{ background:t.surface, border:`1px solid ${accent}50`, borderRadius:12, padding:16, marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg,${accent},${accent}99)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#000", fontWeight:900, fontSize:"1.2rem", flexShrink:0 }}>{name[0]||"?"}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, color:t.text }}>{name||"—"}</div>
                <div style={{ color:t.muted, fontSize:"0.78rem" }}>{role}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:online?"#34d399":t.muted }}/>
                <span style={{ fontSize:"0.72rem", color:online?"#34d399":t.muted }}>{online?"Online":"Offline"}</span>
              </div>
            </div>
            <div style={{ background:`${accent}15`, borderRadius:8, padding:"8px 12px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:"0.73rem", color:t.muted }}>Score</span>
                <span style={{ fontSize:"0.73rem", color:accent, fontWeight:700 }}>{score}/100</span>
              </div>
              <div style={{ height:5, background:t.border, borderRadius:99, overflow:"hidden" }}>
                <div style={{ width:`${score}%`, height:"100%", background:accent, borderRadius:99, transition:"width .3s" }}/>
              </div>
            </div>
          </div>
          <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:"#c8d8f0", lineHeight:1.7 }}>
{`<UserCard
  name="${name}"
  role="${role}"
  score={${score}}
  isOnline={${online}}
  accentColor="${accent}"
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 4 — useState
══════════════════════════════════════════════════════════════ */
function UseStateDemo({ t }) {
  const [tab, setTab] = useState("counter");
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const [on, setOn] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", newsletter:false });
  const [items, setItems] = useState(["Learn React","Build something cool","Ship it 🚀"]);
  const [newItem, setNewItem] = useState("");

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>useState — 4 essential patterns</p>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
        {["counter","toggle","object","array"].map(v => (
          <button key={v} onClick={() => setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:7, padding:"5px 13px", cursor:"pointer", fontWeight:700, fontSize:"0.8rem" }}>{v}</button>
        ))}
      </div>

      {tab === "counter" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px", textAlign:"center" }}>
            <div style={{ fontSize:"3.5rem", fontWeight:900, color:t.accent, fontFamily:"monospace", lineHeight:1.1, marginBottom:8 }}>{count}</div>
            <div style={{ color:t.muted, fontSize:"0.73rem", marginBottom:12 }}>step = {step}</div>
            <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:12 }}>
              {[["−",()=>setCount(c=>c-step)],["0",()=>setCount(0)],["+",()=>setCount(c=>c+step)]].map(([l,fn])=>(
                <button key={l} onClick={fn} style={{ background:l==="0"?t.surface:t.accent, color:l==="0"?t.muted:"#000", border:`1px solid ${l==="0"?t.border:t.accent}`, borderRadius:8, padding:"8px 16px", cursor:"pointer", fontWeight:700, fontSize:"0.95rem" }}>{l}</button>
              ))}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"center" }}>
              <span style={{ color:t.muted, fontSize:"0.76rem" }}>Step:</span>
              <input type="range" min={1} max={10} value={step} onChange={e=>setStep(+e.target.value)} style={{ width:80, accentColor:t.accent }}/>
              <span style={{ color:t.text, fontSize:"0.8rem", fontWeight:700 }}>{step}</span>
            </div>
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.74rem", color:"#c8d8f0", lineHeight:1.8 }}>
{`const [count, setCount] = useState(0);
const [step, setStep]   = useState(1);

// ✅ Functional update — safe with batching
setCount(prev => prev + step);
setCount(prev => prev - step);
setCount(0);  // reset to initial value

// ❌ Direct mutation — won't re-render!
count = count + 1;  // broken`}
            </pre>
          </div>
        </div>
      )}

      {tab === "toggle" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 160px", display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
            <div onClick={()=>setOn(o=>!o)} style={{ cursor:"pointer", width:64, height:34, borderRadius:17, background:on?t.accent:t.border, position:"relative", transition:"background .3s" }}>
              <div style={{ position:"absolute", width:26, height:26, borderRadius:"50%", background:"#fff", top:4, left:on?34:4, transition:"left .3s", boxShadow:"0 2px 6px #0005" }}/>
            </div>
            <div style={{ color:on?t.accent:t.muted, fontWeight:700, fontSize:"1.1rem" }}>{on?"ON":"OFF"}</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center" }}>
              {[["🌙 Dark","dark"],["☀️ Light","light"],["🔔 Notifs","notifs"]].map(([l])=>(
                <span key={l} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:6, padding:"4px 9px", fontSize:"0.73rem", color:t.muted }}>
                  {l}: <strong style={{ color:on?t.accent:t.muted }}>{String(on)}</strong>
                </span>
              ))}
            </div>
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.74rem", color:"#c8d8f0", lineHeight:1.8 }}>
{`const [isOn, setIsOn] = useState(false);

// Toggle — always use prev value
const toggle = () => setIsOn(prev => !prev);

// Conditional rendering
{isOn && <DarkTheme />}
{isOn ? <On /> : <Off />}

// className toggle
<div className={isOn ? 'active' : ''}>
// Current: isOn = ${on}`}
            </pre>
          </div>
        </div>
      )}

      {tab === "object" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 200px" }}>
            {[["name","text","Name"],["email","email","Email"]].map(([k,type,lbl])=>(
              <div key={k} style={{ marginBottom:10 }}>
                <label style={{ display:"block", fontSize:"0.72rem", color:t.muted, marginBottom:3 }}>{lbl}:</label>
                <input type={type} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{ width:"100%", boxSizing:"border-box", padding:"7px 10px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, fontSize:"0.82rem", outline:"none" }}/>
              </div>
            ))}
            <label style={{ display:"flex", gap:8, alignItems:"center", cursor:"pointer", fontSize:"0.8rem", color:t.muted }}>
              <input type="checkbox" checked={form.newsletter} onChange={e=>setForm(f=>({...f,newsletter:e.target.checked}))} style={{ accentColor:t.accent, width:14, height:14 }}/>
              Subscribe to newsletter
            </label>
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.72rem", color:"#c8d8f0", lineHeight:1.8 }}>
{`const [form, setForm] = useState({
  name: "${form.name}",
  email: "${form.email}",
  newsletter: ${form.newsletter}
});

// ✅ Spread — preserve other fields!
setForm(prev => ({
  ...prev, [field]: value
}));

// ❌ NEVER mutate state directly
form.name = 'Alice'; // won't work!`}
            </pre>
          </div>
        </div>
      )}

      {tab === "array" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 200px" }}>
            <div style={{ display:"flex", gap:6, marginBottom:10 }}>
              <input value={newItem} onChange={e=>setNewItem(e.target.value)}
                onKeyDown={e=>{ if(e.key==="Enter"&&newItem.trim()){ setItems(a=>[...a,newItem.trim()]); setNewItem(""); }}}
                placeholder="Add item…" style={{ flex:1, padding:"7px 10px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, fontSize:"0.82rem", outline:"none" }}/>
              <button onClick={()=>{ if(newItem.trim()){ setItems(a=>[...a,newItem.trim()]); setNewItem(""); }}}
                style={{ background:t.accent, border:"none", borderRadius:7, padding:"7px 12px", color:"#000", fontWeight:700, cursor:"pointer" }}>+</button>
            </div>
            {items.map((item,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 10px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, marginBottom:5 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:t.accent, flexShrink:0 }}/>
                <span style={{ flex:1, color:t.text, fontSize:"0.82rem" }}>{item}</span>
                <button onClick={()=>setItems(a=>a.filter((_,j)=>j!==i))} style={{ background:"none", border:"none", color:t.muted, cursor:"pointer", fontSize:"1rem" }}>×</button>
              </div>
            ))}
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.72rem", color:"#c8d8f0", lineHeight:1.8 }}>
{`const [items, setItems] = useState([…]);

// ✅ Add — spread new array
setItems(prev => [...prev, newItem]);

// ✅ Remove — filter returns new array
setItems(prev =>
  prev.filter((_, i) => i !== removeIdx));

// ✅ Update item at index
setItems(prev => prev.map(
  (item, i) => i === idx ? updated : item));

// ❌ push/splice mutate — won't re-render!
items.push(newItem); // broken!`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 5 — useEffect
══════════════════════════════════════════════════════════════ */
function UseEffectDemo({ t }) {
  const [tab, setTab] = useState("lifecycle");
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState("react");
  const [log, setLog] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [width, setWidth] = useState(typeof window!=="undefined"?window.innerWidth:800);
  const addLog = (msg, color="#60a5fa") => setLog(l => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...l].slice(0,8).map((line,i)=>i===0?`§${color}§${line}`:line));

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const deps = [
    { label:"No deps []", code:"useEffect(() => {\n  // Runs ONCE on mount\n  fetchData();\n}, []);", when:"On mount only", color:"#60a5fa" },
    { label:"With deps [x]", code:"useEffect(() => {\n  // Runs when 'query' changes\n  search(query);\n}, [query]);", when:"When dependency changes", color:"#a78bfa" },
    { label:"No array", code:"useEffect(() => {\n  // Runs after EVERY render\n  document.title = count;\n});", when:"After every render", color:"#f472b6" },
    { label:"Cleanup", code:"useEffect(() => {\n  const timer = setInterval(tick, 1000);\n  // Cleanup on unmount / re-run\n  return () => clearInterval(timer);\n}, []);", when:"Return cleanup function", color:"#34d399" },
  ];
  const [selDep, setSelDep] = useState(0);

  const simulateFetch = () => {
    setFetching(true);
    addLog(`Fetching "${query}"…`, "#fbbf24");
    setTimeout(() => { setFetching(false); addLog(`Got results for "${query}" ✓`, "#34d399"); }, 1200);
  };

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>useEffect — side effects & lifecycle</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["Dependencies","lifecycle"],["Data Fetch","fetch"],["Window resize","resize"]].map(([l,v])=>(
          <button key={v} onClick={()=>setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>

      {tab === "lifecycle" && (
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <div style={{ flex:"0 0 auto", display:"flex", flexDirection:"column", gap:4 }}>
            {deps.map((d,i)=>(
              <button key={i} onClick={()=>setSelDep(i)} style={{ textAlign:"left", background:selDep===i?d.color+"25":t.surface, color:selDep===i?d.color:t.muted, border:`1px solid ${selDep===i?d.color+"60":t.border}`, borderRadius:7, padding:"6px 12px", cursor:"pointer", fontSize:"0.78rem", fontWeight:700, whiteSpace:"nowrap" }}>{d.label}</button>
            ))}
          </div>
          <div style={{ flex:1, minWidth:220 }}>
            <div style={{ background:"#030508", border:`1px solid ${deps[selDep].color}50`, borderRadius:10, padding:14 }}>
              <div style={{ background:`${deps[selDep].color}20`, border:`1px solid ${deps[selDep].color}40`, borderRadius:6, padding:"5px 10px", marginBottom:10, display:"inline-block" }}>
                <span style={{ color:deps[selDep].color, fontSize:"0.75rem", fontWeight:700 }}>⚡ {deps[selDep].when}</span>
              </div>
              <pre style={{ margin:0, color:deps[selDep].color, fontFamily:"monospace", fontSize:"0.78rem", lineHeight:1.8, whiteSpace:"pre-wrap" }}>{deps[selDep].code}</pre>
            </div>
          </div>
        </div>
      )}

      {tab === "fetch" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            <div style={{ marginBottom:10 }}>
              <label style={{ display:"block", color:t.muted, fontSize:"0.72rem", marginBottom:4 }}>Search query:</label>
              <input value={query} onChange={e=>setQuery(e.target.value)} style={{ width:"100%", boxSizing:"border-box", padding:"7px 10px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, fontSize:"0.82rem", outline:"none" }}/>
            </div>
            <button onClick={simulateFetch} disabled={fetching} style={{ width:"100%", background:t.accent, border:"none", borderRadius:8, padding:"9px", color:"#000", fontWeight:800, cursor:fetching?"not-allowed":"pointer", opacity:fetching?0.6:1, fontSize:"0.85rem" }}>
              {fetching?"⏳ Fetching…":"▶ Simulate fetch"}
            </button>
            <div style={{ marginTop:10, background:"#030508", border:`1px solid ${t.border}`, borderRadius:8, padding:"8px 10px", maxHeight:120, overflowY:"auto" }}>
              {log.length===0 ? <div style={{ color:t.muted, fontSize:"0.73rem" }}>No log yet…</div>
                : log.map((line,i)=>{
                    const parts = line.split("§");
                    const color = parts.length>2?parts[1]:t.muted;
                    const text = parts.length>2?parts[2]:line;
                    return <div key={i} style={{ color:i===0?color:t.muted, fontFamily:"monospace", fontSize:"0.71rem", marginBottom:2 }}>{text}</div>;
                  })}
            </div>
          </div>
          <div style={{ flex:"1 1 220px" }}>
            <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:"#c8d8f0", lineHeight:1.8 }}>
{`function SearchResults({ query }) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    // Abort previous request on re-run
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          \`/api/search?q=\${query}\`,
          { signal: controller.signal }
        );
        setData(await res.json());
      } catch (err) {
        if (!controller.signal.aborted)
          setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => controller.abort(); // cleanup
  }, [query]); // re-run when query changes
}`}
            </pre>
          </div>
        </div>
      )}

      {tab === "resize" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            <div style={{ textAlign:"center", marginBottom:12 }}>
              <div style={{ fontSize:"2.5rem", fontWeight:900, color:t.accent, fontFamily:"monospace" }}>{width}px</div>
              <div style={{ color:t.muted, fontSize:"0.78rem" }}>Window width (resize your browser!)</div>
            </div>
            <div style={{ background:t.surface, borderRadius:10, padding:10, border:`1px solid ${t.border}` }}>
              {[["xs","<480px",width<480],["sm","480–768px",width>=480&&width<768],["md","768–1024px",width>=768&&width<1024],["lg","1024px+",width>=1024]].map(([bp,range,active])=>(
                <div key={bp} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 8px", borderRadius:6, background:active?t.accentBg:"transparent", marginBottom:3 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:active?t.accent:t.border, flexShrink:0 }}/>
                  <code style={{ color:active?t.accent:t.muted, fontWeight:active?700:400, fontSize:"0.78rem" }}>{bp}</code>
                  <span style={{ color:t.muted, fontSize:"0.72rem" }}>{range}</span>
                  {active && <span style={{ color:t.accent, fontSize:"0.68rem", marginLeft:"auto" }}>← current</span>}
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex:"1 1 220px" }}>
            <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.74rem", color:"#c8d8f0", lineHeight:1.8 }}>
{`function useWindowWidth() {
  const [width, setWidth] = useState(
    window.innerWidth
  );

  useEffect(() => {
    const handler = () =>
      setWidth(window.innerWidth);

    window.addEventListener(
      'resize', handler
    );

    // ✅ Cleanup — remove listener
    return () =>
      window.removeEventListener(
        'resize', handler
      );
  }, []); // empty = mount/unmount only

  return width;
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
/* ══════════════════════════════════════════════════════════════
   DEMO 6 — useRef
══════════════════════════════════════════════════════════════ */
function UseRefDemo({ t }) {
  const [tab, setTab] = useState("dom");
  const inputRef = useRef(null);
  const countRef = useRef(0);
  const [renderCount, setRenderCount] = useState(0);
  const [stateCount, setStateCount] = useState(0);
  const [msg, setMsg] = useState("");
  const prevValueRef = useRef("");
  const [value, setValue] = useState("");
  const timerRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(null);

  const focusInput = () => inputRef.current?.focus();
  const selectAll  = () => { inputRef.current?.focus(); inputRef.current?.select(); };

  const incRef = () => { countRef.current++; setMsg(`ref.current = ${countRef.current} (no re-render)`); };
  const incState = () => { setStateCount(c=>c+1); setRenderCount(r=>r+1); };

  useEffect(() => { prevValueRef.current = value; });

  const startTimer = () => {
    startRef.current = Date.now() - elapsed;
    timerRef.current = setInterval(() => setElapsed(Date.now() - startRef.current), 10);
    setRunning(true);
  };
  const stopTimer  = () => { clearInterval(timerRef.current); setRunning(false); };
  const resetTimer = () => { clearInterval(timerRef.current); setRunning(false); setElapsed(0); };

  const ms = elapsed % 1000;
  const s  = Math.floor(elapsed/1000) % 60;
  const m  = Math.floor(elapsed/60000);

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>useRef — DOM access & mutable values</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["DOM Refs","dom"],["vs useState","vs"],["Stopwatch","timer"]].map(([l,v])=>(
          <button key={v} onClick={()=>setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>

      {tab === "dom" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            <input ref={inputRef} placeholder="Click buttons below to control me…" style={{ width:"100%", boxSizing:"border-box", padding:"9px 12px", background:t.surface, border:`2px solid ${t.accentBorder}`, borderRadius:8, color:t.text, fontSize:"0.85rem", outline:"none", marginBottom:10 }}/>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {[["🎯 Focus",focusInput],["🔡 Select All",selectAll],["🗑️ Clear",()=>{if(inputRef.current)inputRef.current.value="";}]].map(([l,fn])=>(
                <button key={l} onClick={fn} style={{ background:t.surface, border:`1px solid ${t.accentBorder}`, color:t.accent, borderRadius:7, padding:"6px 12px", cursor:"pointer", fontSize:"0.78rem", fontWeight:700 }}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.74rem", color:"#c8d8f0", lineHeight:1.8 }}>
{`const inputRef = useRef(null);

// Attach to DOM element
<input ref={inputRef} />

// Access the DOM node imperatively
inputRef.current.focus();
inputRef.current.select();
inputRef.current.value = '';

// Also great for:
// - Video/audio .play() .pause()
// - Canvas .getContext('2d')
// - Measuring element dimensions
//   inputRef.current.getBoundingClientRect()`}
            </pre>
          </div>
        </div>
      )}

      {tab === "vs" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            <div style={{ marginBottom:14 }}>
              <div style={{ color:t.purple, fontWeight:700, fontSize:"0.82rem", marginBottom:6 }}>useRef — no re-render</div>
              <button onClick={incRef} style={{ background:t.purple+"25", border:`1px solid ${t.purple}60`, color:t.purple, borderRadius:8, padding:"8px 16px", cursor:"pointer", fontWeight:700, fontSize:"0.85rem", marginBottom:6 }}>Increment ref</button>
              <div style={{ color:t.muted, fontSize:"0.78rem", fontFamily:"monospace" }}>{msg || "Click to increment ref (no render)"}</div>
            </div>
            <div style={{ borderTop:`1px solid ${t.border}`, paddingTop:14 }}>
              <div style={{ color:t.accent, fontWeight:700, fontSize:"0.82rem", marginBottom:6 }}>useState — triggers re-render</div>
              <button onClick={incState} style={{ background:t.accentBg, border:`1px solid ${t.accentBorder}`, color:t.accent, borderRadius:8, padding:"8px 16px", cursor:"pointer", fontWeight:700, fontSize:"0.85rem", marginBottom:6 }}>Increment state</button>
              <div style={{ color:t.muted, fontSize:"0.78rem", fontFamily:"monospace" }}>state = {stateCount} | re-renders: {renderCount}</div>
            </div>
            <div style={{ marginTop:14 }}>
              <div style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, marginBottom:6 }}>Previous value tracker:</div>
              <input value={value} onChange={e=>setValue(e.target.value)} placeholder="Type something…" style={{ width:"100%", boxSizing:"border-box", padding:"7px 10px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, fontSize:"0.82rem", outline:"none" }}/>
              <div style={{ color:t.muted, fontSize:"0.75rem", marginTop:4 }}>Prev: <code style={{ color:t.accent }}>{prevValueRef.current || "(empty)"}</code></div>
            </div>
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:"#c8d8f0", lineHeight:1.8 }}>
{`// useRef — persists across renders
// but NEVER triggers a re-render
const countRef = useRef(0);
countRef.current++;  // mutate freely

// Common use: track previous value
function Component({ value }) {
  const prevRef = useRef(null);

  useEffect(() => {
    prevRef.current = value; // after render
  });

  return (
    <p>
      Current: {value}
      Previous: {prevRef.current}
    </p>
  );
}

// Also: store timer IDs, subscriptions
const timerRef = useRef(null);
timerRef.current = setInterval(fn, 1000);
return () => clearInterval(timerRef.current);`}
            </pre>
          </div>
        </div>
      )}

      {tab === "timer" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px", textAlign:"center" }}>
            <div style={{ fontSize:"2.8rem", fontWeight:900, fontFamily:"monospace", color:t.accent, marginBottom:16, letterSpacing:"0.05em" }}>
              {String(m).padStart(2,"0")}:{String(s).padStart(2,"0")}.{String(Math.floor(ms/10)).padStart(2,"0")}
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
              {!running
                ? <button onClick={startTimer} style={{ background:t.success+"25", border:`1px solid ${t.success}60`, color:t.success, borderRadius:8, padding:"8px 18px", cursor:"pointer", fontWeight:700 }}>▶ Start</button>
                : <button onClick={stopTimer}  style={{ background:t.warn+"25",    border:`1px solid ${t.warn}60`,    color:t.warn,    borderRadius:8, padding:"8px 18px", cursor:"pointer", fontWeight:700 }}>⏸ Stop</button>
              }
              <button onClick={resetTimer} style={{ background:t.surface, border:`1px solid ${t.border}`, color:t.muted, borderRadius:8, padding:"8px 14px", cursor:"pointer", fontWeight:700 }}>↺ Reset</button>
            </div>
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:"#c8d8f0", lineHeight:1.8 }}>
{`// ref stores interval ID — no re-render
const timerRef = useRef(null);
const startRef = useRef(null);

const start = () => {
  startRef.current = Date.now();
  timerRef.current = setInterval(() => {
    setElapsed(Date.now() - startRef.current);
  }, 10);
};

const stop = () => {
  clearInterval(timerRef.current);
};

// ✅ timerRef.current = interval ID
// Changing it doesn't cause re-render
// But it persists between renders`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 7 — useContext
══════════════════════════════════════════════════════════════ */
const ThemeCtx = createContext(null);
function ThemeProvider({ children, theme }) {
  return <ThemeCtx.Provider value={theme}>{children}</ThemeCtx.Provider>;
}

function UseContextDemo({ t }) {
  const [simTheme, setSimTheme] = useState("blue");
  const themes2 = {
    blue:   { primary:"#60a5fa", bg:"#05070f", surface:"#0c1020", text:"#dde8ff", name:"Blue" },
    purple: { primary:"#a78bfa", bg:"#09050f", surface:"#130c20", text:"#e8ddff", name:"Purple" },
    green:  { primary:"#34d399", surface:"#050f0a", bg:"#020a05", text:"#ddffe8", name:"Green" },
    rose:   { primary:"#f472b6", bg:"#0f050a", surface:"#200c15", text:"#ffe0ef", name:"Rose" },
  };
  const th = themes2[simTheme];
  const [step, setStep] = useState("problem");

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>useContext — global state without prop drilling</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["❌ Prop Drilling","problem"],["✅ Context","solution"]].map(([l,v])=>(
          <button key={v} onClick={()=>setStep(v)} style={{ background:step===v?t.accentBg:t.surface, color:step===v?t.accent:t.muted, border:`1px solid ${step===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>

      {step === "problem" ? (
        <div>
          <p style={{ color:t.muted, fontSize:"0.8rem", marginBottom:12 }}>Without context, you must pass props through every level — even components that don't use them:</p>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <div style={{ flex:"1 1 200px" }}>
              {[["App","theme, user","#60a5fa"],["→ Layout","theme, user","#a78bfa"],["  → Sidebar","theme, user","#f472b6"],["    → Profile","user (finally!)","#fbbf24"]].map(([comp,props,col])=>(
                <div key={comp} style={{ padding:"7px 12px", borderLeft:`3px solid ${col}`, marginBottom:5, background:`${col}10` }}>
                  <code style={{ color:col, fontSize:"0.8rem", fontWeight:700 }}>{comp}</code>
                  <span style={{ color:t.muted, fontSize:"0.72rem", marginLeft:8 }}>receives: {props}</span>
                </div>
              ))}
              <div style={{ color:t.danger, fontSize:"0.78rem", marginTop:8, padding:"8px 12px", background:t.danger+"10", borderRadius:8 }}>
                😩 Prop drilling — Layout and Sidebar don't even USE theme/user, they just pass it down!
              </div>
            </div>
            <div style={{ flex:"1 1 200px" }}>
              <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.danger}30`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:"#fca5a5", lineHeight:1.8 }}>
{`// ❌ Threading props through layers
function App() {
  return <Layout theme={theme} user={user}/>;
}
function Layout({ theme, user }) {
  return <Sidebar theme={theme} user={user}/>;
}
function Sidebar({ theme, user }) {
  return <Profile theme={theme} user={user}/>;
}
function Profile({ user }) {
  return <div>{user.name}</div>; // finally!
}`}
              </pre>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            <div style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, marginBottom:8 }}>Live theme switcher:</div>
            <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
              {Object.entries(themes2).map(([k,v])=>(
                <button key={k} onClick={()=>setSimTheme(k)} style={{ background:simTheme===k?v.primary+"30":t.surface, color:v.primary, border:`2px solid ${simTheme===k?v.primary:t.border}`, borderRadius:7, padding:"4px 10px", cursor:"pointer", fontWeight:700, fontSize:"0.75rem" }}>{v.name}</button>
              ))}
            </div>
            <div style={{ background:th.bg, border:`1px solid ${th.primary}40`, borderRadius:10, overflow:"hidden" }}>
              <div style={{ background:th.primary+"25", padding:"8px 12px", borderBottom:`1px solid ${th.primary}30`, display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:th.primary }}/>
                <span style={{ color:th.primary, fontSize:"0.78rem", fontWeight:700 }}>App (provides theme)</span>
              </div>
              <div style={{ padding:10 }}>
                {[["Layout","(doesn't use theme)"],["→ Sidebar","(doesn't use theme)"],["  → Button","uses theme!"]].map(([comp,note],i)=>(
                  <div key={i} style={{ padding:"5px 8px", borderLeft:`2px solid ${i===2?th.primary:th.primary+"30"}`, marginBottom:4, background:i===2?th.primary+"20":"transparent" }}>
                    <code style={{ color:i===2?th.primary:th.text, fontSize:"0.76rem", fontWeight:700 }}>{comp}</code>
                    <span style={{ color:i===2?th.text:th.primary+"60", fontSize:"0.7rem", marginLeft:6 }}>{note}</span>
                  </div>
                ))}
                <button style={{ background:th.primary, border:"none", borderRadius:6, padding:"6px 14px", color:"#000", fontWeight:700, fontSize:"0.8rem", cursor:"pointer", marginTop:6 }}>Themed Button</button>
              </div>
            </div>
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.accentBorder}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.72rem", color:"#c8d8f0", lineHeight:1.8 }}>
{`// 1. Create context
const ThemeCtx = createContext(null);

// 2. Provide at top level
function App() {
  const theme = useTheme();
  return (
    <ThemeCtx.Provider value={theme}>
      <Layout />  // no props needed!
    </ThemeCtx.Provider>
  );
}

// 3. Consume anywhere — no drilling
function Button() {
  const theme = useContext(ThemeCtx);
  return (
    <button style={{ bg: theme.primary }}>
      Click
    </button>
  );
}

// Best practice: custom hook
const useTheme = () => useContext(ThemeCtx);`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 8 — useReducer
══════════════════════════════════════════════════════════════ */
function UseReducerDemo({ t }) {
  const init = { items:[], input:"", filter:"all", editId:null };
  const reducer = (state, action) => {
    switch(action.type) {
      case "SET_INPUT":  return { ...state, input:action.payload };
      case "ADD":
        if(!state.input.trim()) return state;
        return { ...state, items:[...state.items,{ id:Date.now(), text:state.input.trim(), done:false, priority:action.priority||"normal" }], input:"" };
      case "TOGGLE":     return { ...state, items:state.items.map(i=>i.id===action.id?{...i,done:!i.done}:i) };
      case "DELETE":     return { ...state, items:state.items.filter(i=>i.id!==action.id) };
      case "SET_FILTER": return { ...state, filter:action.payload };
      case "CLEAR_DONE": return { ...state, items:state.items.filter(i=>!i.done) };
      default: return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, init);
  const [priority, setPriority] = useState("normal");

  const filtered = state.items.filter(i =>
    state.filter==="all" ? true : state.filter==="active" ? !i.done : i.done
  );
  const doneCount = state.items.filter(i=>i.done).length;

  const priorityColors = { low:"#34d399", normal:"#60a5fa", high:"#f87171" };

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 14px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>useReducer — complex state with dispatch actions</p>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        <div style={{ flex:"1 1 200px" }}>
          <div style={{ display:"flex", gap:5, marginBottom:8 }}>
            <input value={state.input} onChange={e=>dispatch({type:"SET_INPUT",payload:e.target.value})}
              onKeyDown={e=>e.key==="Enter"&&dispatch({type:"ADD",priority})}
              placeholder="Add a task…" style={{ flex:1, padding:"7px 10px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, fontSize:"0.82rem", outline:"none" }}/>
            <button onClick={()=>dispatch({type:"ADD",priority})} style={{ background:t.accent, border:"none", borderRadius:7, padding:"7px 12px", color:"#000", fontWeight:700, cursor:"pointer" }}>+</button>
          </div>
          <div style={{ display:"flex", gap:5, marginBottom:10 }}>
            {["low","normal","high"].map(p=>(
              <button key={p} onClick={()=>setPriority(p)} style={{ flex:1, background:priority===p?priorityColors[p]+"30":t.surface, color:priorityColors[p], border:`1px solid ${priority===p?priorityColors[p]+"60":t.border}`, borderRadius:6, padding:"4px 0", cursor:"pointer", fontSize:"0.73rem", fontWeight:700 }}>{p}</button>
            ))}
          </div>
          <div style={{ display:"flex", gap:5, marginBottom:10 }}>
            {["all","active","done"].map(f=>(
              <button key={f} onClick={()=>dispatch({type:"SET_FILTER",payload:f})} style={{ flex:1, background:state.filter===f?t.accentBg:t.surface, color:state.filter===f?t.accent:t.muted, border:`1px solid ${state.filter===f?t.accentBorder:t.border}`, borderRadius:6, padding:"4px 0", cursor:"pointer", fontSize:"0.73rem", fontWeight:700 }}>{f}</button>
            ))}
          </div>
          {filtered.map(item=>(
            <div key={item.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 8px", background:t.surface, border:`1px solid ${priorityColors[item.priority]||t.border}30`, borderRadius:7, marginBottom:5 }}>
              <input type="checkbox" checked={item.done} onChange={()=>dispatch({type:"TOGGLE",id:item.id})} style={{ accentColor:t.accent, cursor:"pointer" }}/>
              <div style={{ flex:1 }}>
                <span style={{ color:item.done?t.muted:t.text, textDecoration:item.done?"line-through":"none", fontSize:"0.82rem" }}>{item.text}</span>
                <div style={{ width:6, height:6, borderRadius:"50%", background:priorityColors[item.priority], display:"inline-block", marginLeft:6 }}/>
              </div>
              <button onClick={()=>dispatch({type:"DELETE",id:item.id})} style={{ background:"none", border:"none", color:t.muted, cursor:"pointer", fontSize:"0.9rem" }}>×</button>
            </div>
          ))}
          {filtered.length===0 && <div style={{ textAlign:"center", color:t.muted, padding:"14px", fontSize:"0.8rem" }}>No tasks yet</div>}
          {doneCount>0 && <button onClick={()=>dispatch({type:"CLEAR_DONE"})} style={{ width:"100%", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, padding:"6px", color:t.muted, cursor:"pointer", fontSize:"0.76rem", marginTop:4 }}>Clear {doneCount} done</button>}
        </div>
        <div style={{ flex:"1 1 200px" }}>
          <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.72rem", color:"#c8d8f0", lineHeight:1.8, overflow:"auto", maxHeight:320 }}>
{`const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return { ...state, items: [
        ...state.items,
        { id: Date.now(), text: action.text }
      ]};
    case 'TOGGLE':
      return { ...state, items:
        state.items.map(i =>
          i.id === action.id
            ? { ...i, done: !i.done }
            : i
        )};
    case 'DELETE':
      return { ...state, items:
        state.items.filter(i => i.id !== action.id)
      };
    default: return state;
  }
};

const [state, dispatch] = useReducer(
  reducer, { items: [], filter: 'all' }
);

// Dispatch actions
dispatch({ type: 'ADD', text: 'Buy milk' });
dispatch({ type: 'TOGGLE', id: 123 });
dispatch({ type: 'DELETE', id: 123 });

// Use when useState gets too complex!`}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 9 — useMemo & useCallback
══════════════════════════════════════════════════════════════ */
function MemoDemo({ t }) {
  const [tab, setTab] = useState("memo");
  const [n, setN] = useState(10);
  const [theme2, setTheme2] = useState("blue");
  const [callCount, setCallCount] = useState(0);
  const [cbCallCount, setCbCallCount] = useState(0);

  const slowFib = (num) => { if(num<=1)return num; return slowFib(num-1)+slowFib(num-2); };
  const result = useMemo(() => { if(n>35)return "Too large!"; return slowFib(n); }, [n]);
  const theme2Color = useMemo(() => ({ blue:"#60a5fa",purple:"#a78bfa",green:"#34d399" }[theme2] || "#60a5fa"), [theme2]);

  const withoutCb = () => { setCallCount(c=>c+1); };
  const withCb = useCallback(() => { setCbCallCount(c=>c+1); }, []);

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>useMemo & useCallback — performance optimization</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["useMemo","memo"],["useCallback","cb"]].map(([l,v])=>(
          <button key={v} onClick={()=>setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>
      {tab === "memo" ? (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            <div style={{ marginBottom:12 }}>
              <label style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, display:"block", marginBottom:5 }}>Fibonacci(n) — expensive calculation:</label>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8 }}>
                <input type="range" min={1} max={35} value={n} onChange={e=>setN(+e.target.value)} style={{ flex:1, accentColor:t.accent }}/>
                <code style={{ color:t.text, fontWeight:700, minWidth:24 }}>{n}</code>
              </div>
              <div style={{ background:t.accentBg, border:`1px solid ${t.accentBorder}`, borderRadius:8, padding:"10px 14px" }}>
                <div style={{ color:t.muted, fontSize:"0.72rem" }}>fib({n}) =</div>
                <div style={{ color:t.accent, fontWeight:900, fontSize:"1.4rem", fontFamily:"monospace" }}>{result}</div>
              </div>
            </div>
            <div>
              <label style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, display:"block", marginBottom:5 }}>Theme (doesn't recalculate fib):</label>
              <div style={{ display:"flex", gap:5 }}>
                {["blue","purple","green"].map(th=>(
                  <button key={th} onClick={()=>setTheme2(th)} style={{ flex:1, background:theme2===th?{blue:"#60a5fa",purple:"#a78bfa",green:"#34d399"}[th]+"30":"transparent", color:{blue:"#60a5fa",purple:"#a78bfa",green:"#34d399"}[th], border:`2px solid ${theme2===th?{blue:"#60a5fa",purple:"#a78bfa",green:"#34d399"}[th]:t.border}`, borderRadius:7, padding:"5px", cursor:"pointer", fontWeight:700, fontSize:"0.75rem" }}>{th}</button>
                ))}
              </div>
              <div style={{ marginTop:8, color:t.muted, fontSize:"0.73rem", padding:"6px 10px", background:`${theme2Color}15`, borderRadius:7, border:`1px solid ${theme2Color}30` }}>
                Accent: <strong style={{ color:theme2Color }}>{theme2Color}</strong> — memoized separately from fib
              </div>
            </div>
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:"#c8d8f0", lineHeight:1.8 }}>
{`// WITHOUT useMemo:
// fib() runs on EVERY render
// (even unrelated state changes!)

// WITH useMemo:
const result = useMemo(() => {
  return expensiveFib(n);  // slow!
}, [n]);
// Only recalculates when 'n' changes

// Good for:
// ✅ Heavy computations
// ✅ Complex object/array transformations
// ✅ Derived state from large datasets

// DON'T overuse — has overhead itself!
// Only memoize if profiler shows issue`}
            </pre>
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            <div style={{ marginBottom:14 }}>
              <div style={{ color:t.danger, fontWeight:700, fontSize:"0.82rem", marginBottom:6 }}>Without useCallback</div>
              <div style={{ color:t.muted, fontSize:"0.75rem", marginBottom:8 }}>New function reference on every render → child always re-renders:</div>
              <button onClick={withoutCb} style={{ background:t.danger+"20", border:`1px solid ${t.danger}50`, color:t.danger, borderRadius:8, padding:"8px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem", width:"100%" }}>
                Click ({callCount} times)
              </button>
            </div>
            <div>
              <div style={{ color:t.success, fontWeight:700, fontSize:"0.82rem", marginBottom:6 }}>With useCallback</div>
              <div style={{ color:t.muted, fontSize:"0.75rem", marginBottom:8 }}>Stable reference — child skips re-render if memoized:</div>
              <button onClick={withCb} style={{ background:t.success+"20", border:`1px solid ${t.success}50`, color:t.success, borderRadius:8, padding:"8px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem", width:"100%" }}>
                Click ({cbCallCount} times)
              </button>
            </div>
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:"#c8d8f0", lineHeight:1.8 }}>
{`// Every render creates a NEW function
// → breaks React.memo on child
const handleClick = () => doSomething();

// useCallback memoizes the function itself
const handleClick = useCallback(() => {
  doSomething();
}, [dependency]); // same ref if dep unchanged

// Pair with React.memo:
const Child = React.memo(({ onClick }) => {
  // Only re-renders if onClick changes
  return <button onClick={onClick}>Go</button>;
});

// Use when:
// ✅ Passing callbacks to memoized children
// ✅ Dependencies of useEffect
// ✅ Event handlers in lists`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 10 — Custom Hooks
══════════════════════════════════════════════════════════════ */
function CustomHooksDemo({ t }) {
  const [sel, setSel] = useState(0);
  // useLocalStorage simulation
  const [stored, setStored] = useState("hello");
  // useDebounce simulation
  const [input, setInput]   = useState("");
  const [debounced, setDebounced] = useState("");
  const timerRef = useRef(null);
  const handleInput = (v) => {
    setInput(v);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebounced(v), 500);
  };
  // useFetch simulation
  const [fetchUrl, setFetchUrl] = useState("/api/users");
  const [fetchState, setFetchState] = useState({ loading:false, data:null, error:null });
  const simulate = () => {
    setFetchState({ loading:true, data:null, error:null });
    setTimeout(() => {
      if(fetchUrl.includes("error")) setFetchState({ loading:false, data:null, error:"404 Not Found" });
      else setFetchState({ loading:false, data:[{ id:1,name:"Alice" },{ id:2,name:"Bob" }], error:null });
    }, 1000);
  };

  const hooks = [
    { name:"useDebounce", color:"#60a5fa", desc:"Delay state update until user stops typing" },
    { name:"useLocalStorage", color:"#a78bfa", desc:"Persist state to localStorage automatically" },
    { name:"useFetch", color:"#f472b6", desc:"Data fetching with loading/error states" },
  ];

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Custom Hooks — reusable stateful logic</p>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
        {hooks.map((h,i) => (
          <button key={i} onClick={()=>setSel(i)} style={{ background:sel===i?h.color+"25":t.surface, color:sel===i?h.color:t.muted, border:`1px solid ${sel===i?h.color+"60":t.border}`, borderRadius:7, padding:"5px 13px", cursor:"pointer", fontWeight:700, fontSize:"0.8rem" }}>{h.name}</button>
        ))}
      </div>

      {sel === 0 && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            <input value={input} onChange={e=>handleInput(e.target.value)} placeholder="Type something…"
              style={{ width:"100%", boxSizing:"border-box", padding:"9px 12px", background:t.surface, border:`1px solid ${t.accentBorder}`, borderRadius:8, color:t.text, fontSize:"0.85rem", outline:"none", marginBottom:12 }}/>
            <div style={{ display:"flex", gap:8 }}>
              <div style={{ flex:1, background:`${t.accent}15`, border:`1px solid ${t.accentBorder}`, borderRadius:8, padding:"8px 12px" }}>
                <div style={{ color:t.muted, fontSize:"0.7rem", marginBottom:3 }}>Input (instant)</div>
                <div style={{ color:t.accent, fontWeight:700, fontFamily:"monospace", wordBreak:"break-all" }}>{input || "…"}</div>
              </div>
              <div style={{ flex:1, background:`${t.purple}15`, border:`1px solid ${t.purple}40`, borderRadius:8, padding:"8px 12px" }}>
                <div style={{ color:t.muted, fontSize:"0.7rem", marginBottom:3 }}>Debounced (500ms)</div>
                <div style={{ color:t.purple, fontWeight:700, fontFamily:"monospace", wordBreak:"break-all" }}>{debounced || "…"}</div>
              </div>
            </div>
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:"#c8d8f0", lineHeight:1.8 }}>
{`function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer); // cleanup
  }, [value, delay]);

  return debounced;
}

// Usage — API call only fires 500ms after
// the user STOPS typing (saves API calls!)
function Search() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) fetchResults(debouncedQuery);
  }, [debouncedQuery]);
}`}
            </pre>
          </div>
        </div>
      )}

      {sel === 1 && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            <div style={{ color:t.muted, fontSize:"0.72rem", marginBottom:6 }}>Simulated localStorage value:</div>
            <input value={stored} onChange={e=>setStored(e.target.value)} style={{ width:"100%", boxSizing:"border-box", padding:"8px 12px", background:t.surface, border:`1px solid ${t.accentBorder}`, borderRadius:8, color:t.text, fontSize:"0.85rem", outline:"none", marginBottom:10 }}/>
            <div style={{ background:t.purple+"15", border:`1px solid ${t.purple}40`, borderRadius:8, padding:"10px 12px" }}>
              <div style={{ color:t.muted, fontSize:"0.7rem", marginBottom:3 }}>localStorage['myKey']:</div>
              <div style={{ color:t.purple, fontWeight:700, fontFamily:"monospace" }}>"{stored}"</div>
              <div style={{ color:t.muted, fontSize:"0.7rem", marginTop:6 }}>✓ Persists across page refreshes!</div>
            </div>
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.72rem", color:"#c8d8f0", lineHeight:1.8 }}>
{`function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });

  const set = useCallback(newValue => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  }, [key]);

  return [value, set];
}

// Usage — exactly like useState!
function Settings() {
  const [theme, setTheme] =
    useLocalStorage('theme', 'dark');

  return <button onClick={() =>
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }>{theme}</button>;
}`}
            </pre>
          </div>
        </div>
      )}

      {sel === 2 && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            <div style={{ display:"flex", gap:6, marginBottom:10 }}>
              <input value={fetchUrl} onChange={e=>setFetchUrl(e.target.value)} style={{ flex:1, padding:"7px 10px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, fontSize:"0.78rem", outline:"none" }}/>
              <button onClick={simulate} style={{ background:t.pink+"25", border:`1px solid ${t.pink}50`, color:t.pink, borderRadius:7, padding:"7px 12px", cursor:"pointer", fontWeight:700, fontSize:"0.8rem" }}>Fetch</button>
            </div>
            <div style={{ background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", minHeight:80 }}>
              {fetchState.loading && <div style={{ color:t.warn, fontSize:"0.8rem" }}>⏳ Loading…</div>}
              {fetchState.error && <div style={{ color:t.danger, fontSize:"0.8rem" }}>❌ {fetchState.error}</div>}
              {fetchState.data && fetchState.data.map(d=>(
                <div key={d.id} style={{ color:t.success, fontSize:"0.78rem", fontFamily:"monospace", marginBottom:3 }}>✓ {d.name}</div>
              ))}
              {!fetchState.loading&&!fetchState.data&&!fetchState.error && <div style={{ color:t.muted, fontSize:"0.78rem" }}>Try "/api/error" for error state</div>}
            </div>
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.72rem", color:"#c8d8f0", lineHeight:1.8 }}>
{`function useFetch(url) {
  const [state, setState] = useState({
    loading: true, data: null, error: null
  });

  useEffect(() => {
    const controller = new AbortController();
    setState({ loading:true, data:null, error:null });

    fetch(url, { signal: controller.signal })
      .then(r => r.json())
      .then(data => setState({ loading:false, data, error:null }))
      .catch(err => {
        if (!controller.signal.aborted)
          setState({ loading:false, data:null, error:err.message });
      });

    return () => controller.abort();
  }, [url]);

  return state; // { loading, data, error }
}

// Usage
const { loading, data, error } = useFetch('/api/users');`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 11 — Lists & Keys
══════════════════════════════════════════════════════════════ */
function ListsDemo({ t }) {
  const [tab, setTab]   = useState("basic");
  const [keyType, setKeyType] = useState("id");
  const [items, setItems] = useState([
    { id:"a1", name:"React",      stars:214, tag:"frontend" },
    { id:"b2", name:"Vue",        stars:207, tag:"frontend" },
    { id:"c3", name:"Next.js",    stars:122, tag:"fullstack" },
    { id:"d4", name:"Node.js",    stars:105, tag:"backend" },
    { id:"e5", name:"TypeScript", stars:98,  tag:"language" },
  ]);
  const [filter, setFilter] = useState("all");
  const move = (i, dir) => {
    const arr = [...items];
    const to = i + dir;
    if(to<0||to>=arr.length) return;
    [arr[i],arr[to]] = [arr[to],arr[i]];
    setItems(arr);
  };
  const filtered = filter==="all" ? items : items.filter(i=>i.tag===filter);
  const tags = ["all",...new Set(items.map(i=>i.tag))];
  const tagColors = { frontend:"#60a5fa", backend:"#34d399", fullstack:"#a78bfa", language:"#fbbf24" };

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Lists & Keys — rendering arrays correctly</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["Basic .map()","basic"],["Keys Demo","keys"],["Filter & Sort","filter"]].map(([l,v])=>(
          <button key={v} onClick={()=>setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>

      {tab === "basic" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            {items.slice(0,4).map((item,i)=>(
              <div key={item.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:8, marginBottom:6 }}>
                <div style={{ width:24, height:24, borderRadius:"50%", background:`${tagColors[item.tag]||t.accent}25`, display:"flex", alignItems:"center", justifyContent:"center", color:tagColors[item.tag]||t.accent, fontSize:"0.72rem", fontWeight:700 }}>{i+1}</div>
                <div style={{ flex:1 }}>
                  <div style={{ color:t.text, fontWeight:700, fontSize:"0.82rem" }}>{item.name}</div>
                  <span style={{ background:`${tagColors[item.tag]||t.muted}20`, color:tagColors[item.tag]||t.muted, borderRadius:4, padding:"1px 6px", fontSize:"0.68rem", fontWeight:700 }}>{item.tag}</span>
                </div>
                <div style={{ color:t.muted, fontSize:"0.72rem", fontFamily:"monospace" }}>⭐ {item.stars}k</div>
              </div>
            ))}
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.74rem", color:"#c8d8f0", lineHeight:1.8 }}>
{`const repos = [
  { id:'a1', name:'React',  stars:214 },
  { id:'b2', name:'Vue',    stars:207 },
  // ...
];

// Always use .map() for lists
function RepoList() {
  return (
    <ul>
      {repos.map(repo => (
        <li key={repo.id}>       {/* ← key! */}
          {repo.name} ⭐ {repo.stars}k
        </li>
      ))}
    </ul>
  );
}`}
            </pre>
          </div>
        </div>
      )}

      {tab === "keys" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            <div style={{ marginBottom:10 }}>
              <div style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, marginBottom:6 }}>Key strategy:</div>
              {[["id (✅ Best)","id"],["index (⚠️ Bad)","index"],["name (⚠️ Risky)","name"]].map(([l,v])=>(
                <button key={v} onClick={()=>setKeyType(v)} style={{ display:"block", width:"100%", textAlign:"left", background:keyType===v?t.accentBg:t.surface, color:keyType===v?t.accent:t.muted, border:`1px solid ${keyType===v?t.accentBorder:t.border}`, borderRadius:7, padding:"5px 10px", marginBottom:4, cursor:"pointer", fontSize:"0.78rem", fontWeight:700 }}>{l}</button>
              ))}
            </div>
            <div style={{ color:t.muted, fontSize:"0.72rem" }}>Drag ↕ to reorder:</div>
            {items.slice(0,3).map((item,i)=>(
              <div key={keyType==="id"?item.id:keyType==="index"?i:item.name} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 10px", background:t.surface, border:`1px solid ${t.accentBorder}`, borderRadius:7, marginBottom:4 }}>
                <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                  <button onClick={()=>move(i,-1)} style={{ background:"none", border:"none", color:t.muted, cursor:"pointer", lineHeight:1, fontSize:"0.7rem" }}>▲</button>
                  <button onClick={()=>move(i, 1)} style={{ background:"none", border:"none", color:t.muted, cursor:"pointer", lineHeight:1, fontSize:"0.7rem" }}>▼</button>
                </div>
                <span style={{ color:t.muted, fontSize:"0.68rem", fontFamily:"monospace", minWidth:80 }}>key="{keyType==="id"?item.id:keyType==="index"?i:item.name}"</span>
                <span style={{ color:t.text, fontSize:"0.82rem", fontWeight:700 }}>{item.name}</span>
              </div>
            ))}
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[["✅ Use stable IDs","Use database IDs, UUIDs — React tracks elements correctly across re-renders and reorders",t.success],["⚠️ Never use index","If list can reorder or filter, index keys break animations, form state, and component identity",t.warn],["⚠️ Avoid random keys","key={Math.random()} destroys & recreates every element on every render — very slow!",t.danger]].map(([title,desc,col])=>(
                <div key={title} style={{ background:`${col}12`, border:`1px solid ${col}35`, borderRadius:8, padding:"10px 12px" }}>
                  <div style={{ color:col, fontWeight:700, fontSize:"0.78rem", marginBottom:3 }}>{title}</div>
                  <div style={{ color:t.muted, fontSize:"0.73rem", lineHeight:1.5 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "filter" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 200px" }}>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:10 }}>
              {tags.map(tag=>(
                <button key={tag} onClick={()=>setFilter(tag)} style={{ background:filter===tag?(tagColors[tag]||t.accent)+"30":t.surface, color:(tagColors[tag]||t.accent), border:`1px solid ${filter===tag?(tagColors[tag]||t.accent)+"60":t.border}`, borderRadius:20, padding:"3px 10px", cursor:"pointer", fontSize:"0.73rem", fontWeight:700 }}>{tag}</button>
              ))}
            </div>
            {filtered.map(item=>(
              <div key={item.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", background:t.surface, border:`1px solid ${(tagColors[item.tag]||t.border)+"40"}`, borderRadius:8, marginBottom:6 }}>
                <div style={{ flex:1 }}>
                  <span style={{ color:t.text, fontWeight:700, fontSize:"0.85rem" }}>{item.name}</span>
                  <span style={{ background:`${tagColors[item.tag]||t.muted}20`, color:tagColors[item.tag]||t.muted, borderRadius:4, padding:"1px 7px", fontSize:"0.68rem", fontWeight:700, marginLeft:8 }}>{item.tag}</span>
                </div>
                <span style={{ color:t.muted, fontFamily:"monospace", fontSize:"0.73rem" }}>⭐ {item.stars}k</span>
              </div>
            ))}
            <div style={{ color:t.muted, fontSize:"0.72rem", marginTop:4 }}>Showing {filtered.length} / {items.length}</div>
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:"#c8d8f0", lineHeight:1.8 }}>
{`const [filter, setFilter] = useState('all');

// Filter and sort with useMemo
const visible = useMemo(() =>
  repos
    .filter(r =>
      filter === 'all' || r.tag === filter
    )
    .sort((a, b) => b.stars - a.stars),
  [repos, filter]
);

return (
  <div>
    <FilterBar filter={filter}
               onChange={setFilter} />
    {visible.map(repo => (
      <RepoCard key={repo.id} {...repo} />
    ))}
  </div>
);`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
/* ══════════════════════════════════════════════════════════════
   DEMO 12 — Conditional Rendering
══════════════════════════════════════════════════════════════ */
function ConditionalDemo({ t }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole]         = useState("user");
  const [loading, setLoading]   = useState(false);
  const [count, setCount]       = useState(3);
  const [tab, setTab]           = useState("patterns");

  const simulate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const patterns = [
    { label:"&&  short-circuit",   code:`{isLoggedIn && <Dashboard />}`, note:"Renders right side only if left is truthy" },
    { label:"? :  ternary",         code:`{isLoggedIn\n  ? <Dashboard />\n  : <Login />}`, note:"Choose between two components" },
    { label:"if / else (in fn)",    code:`if (loading) return <Spinner />;\nif (error) return <Error />;\nreturn <Content />;`, note:"Early returns in component function" },
    { label:"switch statement",     code:`switch (role) {\n  case 'admin': return <AdminPanel />;\n  case 'user':  return <UserDash />;\n  default:      return <Login />;\n}`, note:"Multiple conditions — cleaner than nested ternary" },
    { label:"Lookup object",        code:`const views = {\n  admin: <AdminPanel />,\n  user:  <UserDash />,\n  guest: <GuestPage />,\n};\nreturn views[role] ?? <NotFound />;`, note:"Elegant alternative to switch" },
  ];
  const [selPat, setSelPat] = useState(0);

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Conditional Rendering — 5 patterns</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["📋 Patterns","patterns"],["🎮 Playground","play"]].map(([l,v])=>(
          <button key={v} onClick={()=>setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>

      {tab === "patterns" ? (
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <div style={{ flex:"0 0 auto", display:"flex", flexDirection:"column", gap:4 }}>
            {patterns.map((p,i)=>(
              <button key={i} onClick={()=>setSelPat(i)} style={{ textAlign:"left", background:selPat===i?t.accentBg:t.surface, color:selPat===i?t.accent:t.muted, border:`1px solid ${selPat===i?t.accentBorder:t.border}`, borderRadius:7, padding:"6px 12px", cursor:"pointer", fontSize:"0.77rem", fontWeight:700, whiteSpace:"nowrap" }}>{patterns[i].label}</button>
            ))}
          </div>
          <div style={{ flex:1, minWidth:220 }}>
            <div style={{ background:"#030508", border:`1px solid ${t.accentBorder}`, borderRadius:10, padding:14 }}>
              <pre style={{ margin:0, color:t.accent, fontFamily:"monospace", fontSize:"0.8rem", lineHeight:1.8, whiteSpace:"pre-wrap" }}>{patterns[selPat].code}</pre>
              <div style={{ marginTop:10, color:t.muted, fontSize:"0.75rem" }}>💡 {patterns[selPat].note}</div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            <div style={{ marginBottom:10 }}>
              <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:"0.8rem", color:t.muted, marginBottom:8 }}>
                <input type="checkbox" checked={loggedIn} onChange={e=>setLoggedIn(e.target.checked)} style={{ accentColor:t.accent, width:14, height:14 }}/>
                isLoggedIn = {String(loggedIn)}
              </label>
              <div style={{ display:"flex", gap:5, marginBottom:8 }}>
                {["user","admin","guest"].map(r=>(
                  <button key={r} onClick={()=>setRole(r)} style={{ flex:1, background:role===r?t.accentBg:t.surface, color:role===r?t.accent:t.muted, border:`1px solid ${role===r?t.accentBorder:t.border}`, borderRadius:6, padding:"4px 0", cursor:"pointer", fontSize:"0.73rem", fontWeight:700 }}>{r}</button>
                ))}
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <span style={{ color:t.muted, fontSize:"0.73rem" }}>count:</span>
                <button onClick={()=>setCount(c=>Math.max(0,c-1))} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:5, padding:"2px 8px", cursor:"pointer", color:t.text }}>−</button>
                <code style={{ color:t.text, fontWeight:700 }}>{count}</code>
                <button onClick={()=>setCount(c=>c+1)} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:5, padding:"2px 8px", cursor:"pointer", color:t.text }}>+</button>
              </div>
            </div>
            <button onClick={simulate} disabled={loading} style={{ width:"100%", background:t.accent, border:"none", borderRadius:8, padding:"8px", color:"#000", fontWeight:800, cursor:loading?"not-allowed":"pointer", opacity:loading?.6:1, fontSize:"0.82rem", marginBottom:10 }}>{loading?"⏳ Loading…":"▶ Simulate load"}</button>
            <div style={{ background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", minHeight:60 }}>
              {loading ? <div style={{ color:t.warn }}>⏳ Loading spinner…</div>
                : !loggedIn ? <div style={{ color:t.muted }}>🔒 Please log in</div>
                : role==="admin" ? <div style={{ color:t.danger }}>🛡️ Admin Panel</div>
                : role==="guest" ? <div style={{ color:t.muted }}>👤 Guest Mode</div>
                : <div style={{ color:t.success }}>✓ User Dashboard — {count > 0 ? `${count} notification${count>1?"s":""}` : "All clear!"}</div>}
            </div>
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:"#c8d8f0", lineHeight:1.8 }}>
{`function Dashboard({ user, count }) {
  if (loading) return <Spinner />;
  if (!loggedIn) return <LoginPrompt />;

  // Role-based rendering
  const panel = {
    admin: <AdminPanel />,
    guest: <GuestView />,
    user:  <UserDash />,
  }[role] ?? <NotFound />;

  return (
    <div>
      {panel}
      {/* Short-circuit */}
      {count > 0 && (
        <Badge count={count} />
      )}
      {/* Ternary */}
      {count === 1
        ? '1 notification'
        : \`\${count} notifications\`
      }
    </div>
  );
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 13 — Forms & Controlled Inputs
══════════════════════════════════════════════════════════════ */
function FormsDemo({ t }) {
  const [tab, setTab] = useState("controlled");
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"user", bio:"", agree:false });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const uncontrolledRef = useRef(null);

  const validate = () => {
    const e = {};
    if(!form.name.trim())                e.name = "Name is required";
    if(!/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if(form.password.length < 8)         e.password = "Min 8 characters";
    if(!form.agree)                      e.agree = "You must agree";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if(Object.keys(e).length===0) setSubmitted(form);
  };

  const Field = ({ label, name, type="text", ...rest }) => (
    <div style={{ marginBottom:12 }}>
      <label style={{ display:"block", fontSize:"0.72rem", color:t.muted, marginBottom:3 }}>{label}</label>
      {type === "select" ? (
        <select value={form[name]} onChange={e=>setForm(f=>({...f,[name]:e.target.value}))} style={{ width:"100%", boxSizing:"border-box", padding:"7px 10px", background:t.surface, border:`1px solid ${errors[name]?t.danger:t.border}`, borderRadius:7, color:t.text, fontSize:"0.82rem", outline:"none" }}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
        </select>
      ) : type === "textarea" ? (
        <textarea value={form[name]} onChange={e=>setForm(f=>({...f,[name]:e.target.value}))} rows={3} style={{ width:"100%", boxSizing:"border-box", padding:"7px 10px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, fontSize:"0.82rem", outline:"none", resize:"vertical" }}/>
      ) : (
        <input type={type} value={form[name]} onChange={e=>setForm(f=>({...f,[name]:e.target.value}))} style={{ width:"100%", boxSizing:"border-box", padding:"7px 10px", background:t.surface, border:`1px solid ${errors[name]?t.danger:t.border}`, borderRadius:7, color:t.text, fontSize:"0.82rem", outline:"none" }} {...rest}/>
      )}
      {errors[name] && <div style={{ color:t.danger, fontSize:"0.7rem", marginTop:3 }}>⚠ {errors[name]}</div>}
    </div>
  );

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Forms — controlled inputs & validation</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["Controlled","controlled"],["Uncontrolled","uncontrolled"]].map(([l,v])=>(
          <button key={v} onClick={()=>setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>

      {tab === "controlled" ? (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 200px" }}>
            {submitted ? (
              <div>
                <div style={{ color:t.success, fontWeight:700, fontSize:"0.88rem", marginBottom:10 }}>✓ Submitted!</div>
                <div style={{ background:"#030508", border:`1px solid ${t.success}40`, borderRadius:9, padding:"10px 12px" }}>
                  {Object.entries(submitted).map(([k,v])=>(
                    <div key={k} style={{ marginBottom:3, fontFamily:"monospace", fontSize:"0.74rem" }}>
                      <span style={{ color:t.muted }}>{k}: </span>
                      <span style={{ color:t.success }}>{String(v)}</span>
                    </div>
                  ))}
                </div>
                <button onClick={()=>{ setSubmitted(null); setForm({ name:"", email:"", password:"", role:"user", bio:"", agree:false }); setErrors({}); }} style={{ marginTop:8, background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, padding:"6px 14px", color:t.muted, cursor:"pointer", fontSize:"0.8rem" }}>↺ Reset</button>
              </div>
            ) : (
              <div>
                <Field label="Name *" name="name" placeholder="Alice Smith"/>
                <Field label="Email *" name="email" type="email" placeholder="alice@dev.io"/>
                <Field label="Password *" name="password" type="password"/>
                <Field label="Role" name="role" type="select"/>
                <Field label="Bio" name="bio" type="textarea"/>
                <label style={{ display:"flex", gap:8, alignItems:"center", marginBottom:12, cursor:"pointer", fontSize:"0.8rem", color:errors.agree?t.danger:t.muted }}>
                  <input type="checkbox" checked={form.agree} onChange={e=>setForm(f=>({...f,agree:e.target.checked}))} style={{ accentColor:t.accent, width:14, height:14 }}/>
                  I agree to the Terms *
                  {errors.agree && <span style={{ color:t.danger, fontSize:"0.7rem" }}>⚠ {errors.agree}</span>}
                </label>
                <button onClick={handleSubmit} style={{ width:"100%", background:`linear-gradient(135deg,${t.accent},#1d4ed8)`, border:"none", borderRadius:8, padding:"10px", color:"#fff", fontWeight:800, cursor:"pointer", fontSize:"0.88rem" }}>Submit</button>
              </div>
            )}
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.72rem", color:"#c8d8f0", lineHeight:1.8, overflow:"auto", maxHeight:300 }}>
{`// Controlled: React owns the value
const [form, setForm] = useState({
  name: '', email: '', agree: false
});

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setForm(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value,
  }));
};

<input
  name="email"
  value={form.email}  // ← React controls this
  onChange={handleChange}
/>

// Validate before submit
const validate = (form) => {
  const errors = {};
  if (!form.email) errors.email = 'Required';
  if (!/\\S+@\\S+/.test(form.email))
    errors.email = 'Invalid email';
  return errors;
};`}
            </pre>
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            <p style={{ color:t.muted, fontSize:"0.78rem", marginBottom:10 }}>Uncontrolled inputs use refs — React doesn't control the value. DOM manages it directly.</p>
            <input ref={uncontrolledRef} defaultValue="Default value" style={{ width:"100%", boxSizing:"border-box", padding:"8px 12px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, fontSize:"0.82rem", outline:"none", marginBottom:10 }}/>
            <button onClick={()=>alert(`Value: ${uncontrolledRef.current?.value}`)} style={{ width:"100%", background:t.surface, border:`1px solid ${t.accentBorder}`, color:t.accent, borderRadius:8, padding:"8px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>Read value via ref</button>
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:"#c8d8f0", lineHeight:1.8 }}>
{`// Uncontrolled: DOM owns the value
// React reads it only when needed
const inputRef = useRef(null);

const handleSubmit = () => {
  const value = inputRef.current.value;
  console.log(value);
};

<input
  ref={inputRef}
  defaultValue="Initial"  // not 'value'!
  // No onChange handler needed
/>

// When to use uncontrolled:
// ✅ File inputs (<input type="file">)
// ✅ Integrating with non-React libs
// ✅ Very simple forms that don't need live validation
// Otherwise prefer controlled inputs!`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 14 — React Router (conceptual)
══════════════════════════════════════════════════════════════ */
function RouterDemo({ t }) {
  const [path, setPath] = useState("/");
  const [userId, setUserId] = useState("42");
  const [tab, setTab] = useState("routing");

  const routes = [
    { path:"/",              label:"Home",       icon:"🏠", comp:"<HomePage />" },
    { path:"/about",         label:"About",      icon:"ℹ️",  comp:"<AboutPage />" },
    { path:"/users",         label:"Users",      icon:"👥", comp:"<UserList />" },
    { path:`/users/${userId}`,label:`User #${userId}`,icon:"👤", comp:"<UserProfile />" },
    { path:"/settings",      label:"Settings",   icon:"⚙️", comp:"<Settings />" },
    { path:"*",              label:"404",        icon:"❌", comp:"<NotFound />" },
  ];
  const current = routes.find(r => r.path === path) || routes[routes.length-1];

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>React Router v6 — client-side navigation</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["Routing","routing"],["Hooks","hooks"],["Code","code"]].map(([l,v])=>(
          <button key={v} onClick={()=>setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>

      {tab === "routing" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 200px" }}>
            <div style={{ background:"#030508", border:`1px solid ${t.border}`, borderRadius:10, overflow:"hidden" }}>
              <div style={{ background:t.surface2, borderBottom:`1px solid ${t.border}`, padding:"8px 12px", display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ color:t.accent, fontFamily:"monospace", fontSize:"0.78rem" }}>{path}</div>
              </div>
              <div style={{ display:"flex" }}>
                <div style={{ width:100, borderRight:`1px solid ${t.border}`, padding:8 }}>
                  {routes.slice(0,-1).map(r=>(
                    <div key={r.path} onClick={()=>setPath(r.path)} style={{ padding:"5px 8px", borderRadius:6, cursor:"pointer", background:path===r.path?t.accentBg:"transparent", color:path===r.path?t.accent:t.muted, fontSize:"0.75rem", fontWeight:path===r.path?700:400, marginBottom:2 }}>{r.icon} {r.label}</div>
                  ))}
                  <div onClick={()=>setPath("/unknown")} style={{ padding:"5px 8px", borderRadius:6, cursor:"pointer", color:t.muted, fontSize:"0.75rem", marginBottom:2 }}>❓ 404</div>
                </div>
                <div style={{ flex:1, padding:12, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:"2rem", marginBottom:6 }}>{current.icon}</div>
                    <div style={{ color:t.accent, fontWeight:700, fontSize:"0.85rem", marginBottom:3, fontFamily:"monospace" }}>{current.comp}</div>
                    <div style={{ color:t.muted, fontSize:"0.72rem" }}>path: {current.path}</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop:8, display:"flex", gap:6, alignItems:"center" }}>
              <span style={{ color:t.muted, fontSize:"0.72rem" }}>userId param:</span>
              <input value={userId} onChange={e=>{ setUserId(e.target.value); if(path.startsWith("/users/")) setPath(`/users/${e.target.value}`); }} style={{ width:50, padding:"4px 8px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:5, color:t.text, fontSize:"0.78rem", outline:"none" }}/>
            </div>
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <pre style={{ margin:0, background:"#030508", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:"#c8d8f0", lineHeight:1.8 }}>
{`// main.jsx / index.jsx

<BrowserRouter>
  <App />
</BrowserRouter>

// App.jsx

function App() {
  return (
    <Routes>
      <Route path="/"           element={<Home />} />
      <Route path="/about"      element={<About />} />
      <Route path="/users"      element={<UserList />} />
      <Route path="/users/:id"  element={<UserProfile />} />
      <Route path="*"           element={<NotFound />} />
    </Routes>
  );
}`}
            </pre>
          </div>
        </div>
      )}

      {tab === "hooks" && (
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {[
            { hook:"useNavigate", color:"#60a5fa", ex:`const navigate = useNavigate();\n\n// Go to a route\nnavigate('/dashboard');\n\n// With state\nnavigate('/login', { state: { from: '/dashboard' } });\n\n// Go back\nnavigate(-1);` },
            { hook:"useParams", color:"#a78bfa", ex:`// Route: /users/:id/posts/:postId\nconst { id, postId } = useParams();\n// → id = '42', postId = '7'\n\nfunction UserProfile() {\n  const { id } = useParams();\n  const { data } = useFetch('/api/users/' + id);\n  return <div>{data?.name}</div>;\n}` },
            { hook:"useSearchParams", color:"#f472b6", ex:`const [search, setSearch] = useSearchParams();\n\n// Read: /products?category=shoes&sort=price\nconst category = search.get('category');\nconst sort = search.get('sort');\n\n// Write (updates URL without reload)\nsetSearch({ category: 'bags', sort: 'name' });` },
            { hook:"useLocation", color:"#34d399", ex:`const location = useLocation();\n// { pathname: '/users/42',\n//   search:   '?tab=posts',\n//   hash:     '#comments',\n//   state:    { from: '/' } }\n\n// Read state passed via navigate()\nconst { from } = location.state ?? {};` },
          ].map(item=>(
            <div key={item.hook} style={{ flex:"1 1 220px" }}>
              <div style={{ color:item.color, fontWeight:700, fontFamily:"monospace", fontSize:"0.85rem", marginBottom:6 }}>{item.hook}()</div>
              <pre style={{ margin:0, background:"#030508", border:`1px solid ${item.color}40`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.72rem", color:item.color, lineHeight:1.7, whiteSpace:"pre-wrap" }}>{item.ex}</pre>
            </div>
          ))}
        </div>
      )}

      {tab === "code" && (
        <div style={{ position:"relative", borderRadius:12, overflow:"hidden", border:"1px solid #1a2040" }}>
          <div style={{ background:"#030508", padding:"14px 16px", overflow:"auto" }}>
            <pre style={{ margin:0, fontFamily:"monospace", fontSize:"0.75rem", color:"#c8d8f0", lineHeight:1.8 }}>
{`// Protected route pattern
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect, preserving where they came from
    return <Navigate to="/login"
      state={{ from: location }} replace />;
  }
  return children;
}

// Nested routes with Outlet
function Dashboard() {
  return (
    <div className="layout">
      <Sidebar />
      <main>
        <Outlet />  {/* renders child route */}
      </main>
    </div>
  );
}

// Link vs NavLink
<Link to="/about">About</Link>

<NavLink to="/about"
  className={({ isActive }) =>
    isActive ? 'active' : ''
  }
>About</NavLink>`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 15 — State Management
══════════════════════════════════════════════════════════════ */
function StateManagementDemo({ t }) {
  const [sel, setSel] = useState(0);
  const tools = [
    { name:"useState + Context", color:"#60a5fa", when:"Small-medium apps, theme, auth user, simple global state", pros:["Built into React","No dependencies","Simple mental model"], cons:["Context re-renders all consumers","No devtools","Hard to scale"] },
    { name:"Zustand", color:"#fbbf24", when:"Most production apps — lightweight, no boilerplate, excellent devtools", pros:["~1KB, zero boilerplate","Selective subscriptions","React devtools support"], cons:["External dependency","Less opinionated (figure out structure)"] },
    { name:"Redux Toolkit", color:"#a78bfa", when:"Large teams, complex apps, need time-travel debugging, established patterns", pros:["Best devtools","Predictable","Industry standard"], cons:["More boilerplate than Zustand","Larger bundle","Steeper learning curve"] },
    { name:"Jotai / Recoil", color:"#f472b6", when:"Atom-based state — great for large apps with many independent state pieces", pros:["Atomic granularity","No re-render on unrelated changes","Concurrent mode ready"], cons:["Different mental model","Smaller ecosystem"] },
    { name:"React Query / SWR", color:"#34d399", when:"Server state — data fetching, caching, sync — NOT for UI state", pros:["Auto-caching & refetching","Loading/error states","Background updates"], cons:["For async/server state only","Not a general state manager"] },
  ];
  const tool = tools[sel];
  const codeExamples = [
    `// useState + Context
const UserCtx = createContext(null);

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <UserCtx.Provider value={{ user, setUser }}>
      {children}
    </UserCtx.Provider>
  );
}

const useUser = () => useContext(UserCtx);`,
    `// Zustand — minimal boilerplate
import { create } from 'zustand';

const useStore = create((set) => ({
  user:    null,
  count:   0,
  setUser: (user) => set({ user }),
  inc:     () => set(s => ({ count: s.count + 1 })),
}));

// In any component — no Provider needed!
const { user, count, inc } = useStore();`,
    `// Redux Toolkit
import { createSlice, configureStore } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value++ },
    decrement: state => { state.value-- },
  },
});
export const { increment, decrement } = counterSlice.actions;

// In component
const count = useSelector(s => s.counter.value);
dispatch(increment());`,
    `// Jotai — atoms
import { atom, useAtom } from 'jotai';

const userAtom = atom(null);
const countAtom = atom(0);
// Derived atom
const doubleAtom = atom(get => get(countAtom) * 2);

// Only re-renders components using that atom
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return <button onClick={() => setCount(c => c+1)}>
    {count}
  </button>;
}`,
    `// React Query — server state

function UserProfile({ id }) {
  // Auto-fetches, caches, refetches on focus
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetch('/api/users/' + id).then(r => r.json()),
    staleTime: 5 * 60 * 1000, // 5 min cache
  });

  const mutation = useMutation({
    mutationFn: (data) => updateUser(id, data),
    onSuccess: () => queryClient.invalidateQueries(['user', id]),
  });
}`,
  ];
  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>State Management — 5 options compared</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:14 }}>
        {tools.map((tool,i)=>(
          <button key={i} onClick={()=>setSel(i)} style={{ background:sel===i?tool.color+"30":t.surface, color:tool.color, border:`2px solid ${sel===i?tool.color:t.border}`, borderRadius:8, padding:"5px 12px", cursor:"pointer", fontWeight:700, fontSize:"0.77rem" }}>{tool.name}</button>
        ))}
      </div>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        <div style={{ flex:"1 1 180px" }}>
          <div style={{ background:`${tool.color}18`, border:`1px solid ${tool.color}45`, borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
            <div style={{ color:tool.color, fontWeight:700, fontSize:"0.88rem", marginBottom:6 }}>When to use:</div>
            <div style={{ color:t.muted, fontSize:"0.78rem", lineHeight:1.6 }}>{tool.when}</div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ flex:1, background:"#34d39912", border:"1px solid #34d39935", borderRadius:8, padding:"10px 12px" }}>
              <div style={{ color:"#34d399", fontWeight:700, fontSize:"0.72rem", marginBottom:5 }}>✓ PROS</div>
              {tool.pros.map((p,i)=><div key={i} style={{ color:t.muted, fontSize:"0.72rem", marginBottom:3 }}>• {p}</div>)}
            </div>
            <div style={{ flex:1, background:"#f8717112", border:"1px solid #f8717135", borderRadius:8, padding:"10px 12px" }}>
              <div style={{ color:"#f87171", fontWeight:700, fontSize:"0.72rem", marginBottom:5 }}>✗ CONS</div>
              {tool.cons.map((c,i)=><div key={i} style={{ color:t.muted, fontSize:"0.72rem", marginBottom:3 }}>• {c}</div>)}
            </div>
          </div>
        </div>
        <div style={{ flex:"1 1 220px" }}>
          <div style={{ position:"relative", borderRadius:9, overflow:"hidden", border:`1px solid ${tool.color}40` }}>
            <div style={{ background:"#030508", padding:"10px 12px", overflow:"auto", maxHeight:240 }}>
              <pre style={{ margin:0, fontFamily:"monospace", fontSize:"0.73rem", color:tool.color, lineHeight:1.7, whiteSpace:"pre-wrap" }}>{codeExamples[sel]}</pre>
            </div>
            <CopyBtn code={codeExamples[sel]}/>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO 16 — Performance Patterns
══════════════════════════════════════════════════════════════ */
function PerformanceDemo({ t }) {
  const [sel, setSel] = useState(0);
  const tips = [
    { icon:"⚡", title:"React.memo", color:"#60a5fa",
      good:`// Memoize expensive child components
const ProductCard = React.memo(({ product, onAdd }) => {
  console.log('ProductCard renders');
  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => onAdd(product.id)}>Add</button>
    </div>
  );
});

// ✅ Won't re-render unless product or onAdd changes
// Pair with useCallback for handlers!`,
      bad:`// ❌ Without memo — re-renders every time
// parent renders, even if props unchanged
function ProductCard({ product, onAdd }) {
  console.log('ProductCard renders'); // fires constantly
  return <div>...</div>;
}` },
    { icon:"📦", title:"Code Splitting", color:"#a78bfa",
      good:`import { lazy, Suspense } from 'react';

// ✅ Lazy load heavy pages
const Dashboard = lazy(() => import('./Dashboard'));
const Settings  = lazy(() => import('./Settings'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings"  element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
// Dashboard.js only loads when user visits /dashboard`,
      bad:`// ❌ Eager import — loads ALL pages upfront
import Dashboard from './Dashboard'; // 200KB!
import Settings  from './Settings';  // 150KB!
import Analytics from './Analytics'; // 300KB!
// Total: 650KB loaded before user sees anything!` },
    { icon:"🖼️", title:"Virtualization", color:"#f472b6",
      good:`import { FixedSizeList } from 'react-window';

// ✅ Only renders visible items (e.g. 10 of 10,000)
function BigList({ items }) {
  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={60}
    >
      {({ index, style }) => (
        <div style={style}>
          {items[index].name}
        </div>
      )}
    </FixedSizeList>
  );
}`,
      bad:`// ❌ Renders ALL 10,000 items into DOM
function BigList({ items }) {
  return (
    <ul>
      {items.map(item => (   // 10,000 DOM nodes!
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
  // → Slow scroll, huge memory, frozen UI
}` },
    { icon:"🔄", title:"Avoid Unnecessary Renders", color:"#34d399",
      good:`// ✅ 1. Colocate state — keep it close to where it's used
function Search() {
  const [query, setQuery] = useState('');  // only this rerenders
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}

// ✅ 2. Split context by concern
// Bad: one huge context that re-renders everything
// Good: separate AuthCtx, ThemeCtx, CartCtx

// ✅ 3. Derive instead of sync
const [items, setItems] = useState([]);
const filtered = items.filter(i => i.active); // no extra state!
// Don't: const [filtered, setFiltered] = useState([]);`,
      bad:`// ❌ State too high — everything re-renders
function App() {
  const [searchQuery, setSearchQuery] = useState('');
  // Every keystroke re-renders App AND all children!
  return <div><Search onChange={setSearchQuery} /><HeavyTree /></div>;
}` },
    { icon:"🖥️", title:"useTransition & useDeferredValue", color:"#fbbf24",
      good:`import { useTransition, useDeferredValue } from 'react';

// ✅ Mark slow updates as non-urgent
function Search({ items }) {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    setQuery(e.target.value);
    startTransition(() => {
      setSearchResults(filter(items, e.target.value)); // slow
    });
  };

  // Or: defer a value to keep UI responsive
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(
    () => filter(items, deferredQuery), [items, deferredQuery]
  );
}`,
      bad:`// ❌ Expensive filter blocks typing
function Search({ items }) {
  const [query, setQuery] = useState('');
  // This runs synchronously on every keystroke → janky UI
  const results = items.filter(i => i.name.includes(query));
  return <input onChange={e => setQuery(e.target.value)} />;
}` },
  ];
  const tip = tips[sel];
  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Performance Patterns — {tips.length} key techniques</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:14 }}>
        {tips.map((tp,i)=>(
          <button key={i} onClick={()=>setSel(i)} style={{ background:sel===i?tp.color+"30":t.surface, color:sel===i?tp.color:t.muted, border:`1px solid ${sel===i?tp.color+"60":t.border}`, borderRadius:8, padding:"5px 11px", cursor:"pointer", fontWeight:700, fontSize:"0.77rem" }}>{tp.icon} {tp.title}</button>
        ))}
      </div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        {[["✅ Do This",tip.good,t.success],["❌ Avoid",tip.bad,t.danger]].map(([label,code,col])=>(
          <div key={label} style={{ flex:"1 1 240px" }}>
            <div style={{ color:col, fontWeight:700, fontSize:"0.78rem", marginBottom:6 }}>{label}</div>
            <div style={{ position:"relative", borderRadius:9, overflow:"hidden", border:`1px solid ${col}35` }}>
              <pre style={{ margin:0, background:"#030508", padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:col===t.success?"#86efac":"#fca5a5", lineHeight:1.7, overflow:"auto", maxHeight:220 }}>{code}</pre>
              <CopyBtn code={code}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SECTIONS
══════════════════════════════════════════════════════════════ */
const SECTIONS = [
  { id:"intro",     icon:"⚛️",  title:"What is React?",          subtitle:"Component model, Virtual DOM, declarative UI vs imperative",
    Demo:IntroDemo,
    body:"React is a JavaScript library for building user interfaces through composable components. Instead of manually manipulating the DOM, you describe what the UI should look like for a given state — React handles the efficient updates via its Virtual DOM diffing algorithm. Built by Meta in 2013, it's now used by millions of developers worldwide.",
    code:`// index.html — single HTML file
<div id="root"></div>

// main.jsx — mount React into the DOM
import React from 'react';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);

// Vite (fastest setup)
npm create vite@latest my-app -- --template react
cd my-app && npm install && npm run dev

// Create React App (legacy, slower)
npx create-react-app my-app

// React 19 — new features
// ✅ Actions (async state transitions)
// ✅ useOptimistic hook
// ✅ Server Components (with Next.js)
// ✅ Improved Suspense`,
    tip:"Use Vite over Create React App for new projects — it's dramatically faster to start and build, and has better HMR (hot module replacement)." },

  { id:"jsx",       icon:"📝",  title:"JSX",                     subtitle:"JavaScript XML — 6 rules, expression embedding, fragments",
    Demo:JSXDemo,
    body:"JSX is a syntax extension that lets you write HTML-like markup inside JavaScript. It gets compiled by Babel into React.createElement() calls. JSX is not required to use React, but it makes component code much more readable. Remember: JSX is JavaScript, not HTML — attribute names are camelCase, and you can embed any JavaScript expression inside curly braces.",
    code:`// JSX compiles to:
const element = <h1 className="title">Hello</h1>;
// → React.createElement('h1', { className:'title' }, 'Hello')

// Fragments — no extra DOM node
const App = () => (
  <>
    <Header />
    <Main />
    <Footer />
  </>
);

// Conditional rendering in JSX
const Greeting = ({ user }) => (
  <div>
    {user ? <h1>Hello, {user.name}!</h1> : <h1>Please sign in</h1>}
    {user?.isAdmin && <AdminBadge />}
    {user?.notifications > 0 && (
      <Badge count={user.notifications} />
    )}
  </div>
);

// Rendering lists
const List = ({ items }) => (
  <ul>
    {items.map(item => (
      <li key={item.id}>{item.name}</li>
    ))}
  </ul>
);

// Inline styles — object, not string
<div style={{ color: 'blue', fontSize: 16, marginTop: 8 }} />`,
    tip:"Install the ESLint + Prettier + React plugins for your editor. They'll catch JSX mistakes (missing keys, wrong attribute names) before you even run the code." },

  { id:"props",     icon:"📦",  title:"Props",                   subtitle:"Passing data into components, defaultProps, children",
    Demo:PropsDemo,
    body:"Props (properties) are how you pass data from parent to child components — they're read-only from the child's perspective. Think of props like function arguments: they flow downward (one-way data binding). The special children prop lets you pass JSX between component tags. Use destructuring and default values to write clean prop handling.",
    code:`// Basic props
function Button({ label, color = 'blue', size = 'md', onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ background: color }}
      className={\`btn btn-\${size}\`}
    >
      {label}
    </button>
  );
}

// Usage
<Button label="Submit" color="#60a5fa" onClick={handleSubmit} />
<Button label="Cancel" />   // uses defaults

// Children prop — composition pattern
function Card({ title, children, footer }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="body">{children}</div>
      {footer && <div className="footer">{footer}</div>}
    </div>
  );
}

<Card title="My Card" footer={<Button label="Close" />}>
  <p>Any JSX goes here as children</p>
</Card>

// Spread props
const inputProps = { placeholder: 'Search…', type: 'search' };
<input {...inputProps} />

// TypeScript props (recommended)
interface ButtonProps {
  label: string;
  color?: string;
  onClick: () => void;
}`,
    tip:"Never mutate props — they're read-only. If a child needs to update parent state, pass a callback function as a prop: onUpdate={() => setState(newVal)}." },

  { id:"useState",  icon:"🔁",  title:"useState",                subtitle:"Primitive, object, array, toggle patterns — functional updates",
    Demo:UseStateDemo,
    body:"useState is the most fundamental React hook. It adds state to function components and triggers a re-render whenever the state changes. The key rules: never mutate state directly (always return a new value), use functional updates when new state depends on old state, and spread objects/arrays to preserve existing properties.",
    code:`import { useState } from 'react';

// Basic
const [count, setCount] = useState(0);

// Lazy initialization (expensive default)
const [data, setData] = useState(() => {
  return JSON.parse(localStorage.getItem('data')) ?? [];
});

// Functional updates — always use when depending on prev state
setCount(prev => prev + 1);  // ✅ safe
setCount(count + 1);          // ⚠ can be stale in closures

// Object state — ALWAYS spread
setUser(prev => ({ ...prev, name: 'Alice' }));

// Array state — return new arrays
setItems(prev => [...prev, newItem]);           // add
setItems(prev => prev.filter(i => i.id !== id)); // remove
setItems(prev => prev.map(i =>                   // update
  i.id === id ? { ...i, done: true } : i
));

// Multiple state vs one object:
// ✅ Separate when values change independently
const [name, setName]   = useState('');
const [email, setEmail] = useState('');

// ✅ Object when values change together
const [form, setForm] = useState({ name:'', email:'' });`,
    tip:"Put useState at the top of your component, never inside loops, conditions, or nested functions. React relies on the call order of hooks being consistent across renders (Rules of Hooks)." },

  { id:"useEffect", icon:"⚡",  title:"useEffect",               subtitle:"Side effects, dependency array, cleanup, data fetching",
    Demo:UseEffectDemo,
    body:"useEffect handles side effects — things that happen outside React's render cycle: data fetching, subscriptions, timers, and manual DOM manipulation. The dependency array controls when the effect re-runs. Always return a cleanup function for anything that needs teardown (intervals, listeners, requests) to prevent memory leaks.",
    code:`import { useState, useEffect } from 'react';

// Run once on mount (empty deps)
useEffect(() => {
  document.title = 'My App';
}, []);

// Run when 'id' changes
useEffect(() => {
  fetchUser(id).then(setUser);
}, [id]);

// Cleanup — prevent memory leaks
useEffect(() => {
  const subscription = api.subscribe(handler);
  return () => subscription.unsubscribe(); // runs on unmount / before re-run
}, []);

// ✅ Async pattern — can't make useEffect async directly
useEffect(() => {
  let cancelled = false;

  const load = async () => {
    try {
      const data = await fetchData(id);
      if (!cancelled) setData(data);
    } catch (err) {
      if (!cancelled) setError(err.message);
    }
  };

  load();
  return () => { cancelled = true; };
}, [id]);

// Avoid: effects that set state that triggers another effect
// Use derived state or useMemo instead`,
    tip:"Use the eslint-plugin-react-hooks — it enforces that all variables used inside useEffect are included in the dependency array, preventing subtle stale closure bugs." },

  { id:"useRef",    icon:"📌",  title:"useRef",                  subtitle:"DOM access, mutable values that don't trigger re-renders",
    Demo:UseRefDemo,
    body:"useRef creates a mutable object that persists across renders — changing it doesn't trigger a re-render. It has two main uses: accessing DOM elements directly (focus, measure, animate) and storing mutable values between renders without causing re-renders (timer IDs, previous values, instance variables).",
    code:`import { useRef, useEffect } from 'react';

// 1. DOM Reference
const inputRef = useRef(null);

useEffect(() => {
  inputRef.current.focus(); // runs after mount
}, []);

<input ref={inputRef} />

// 2. Mutable instance variable (no re-render)
const intervalRef = useRef(null);

const startTimer = () => {
  intervalRef.current = setInterval(tick, 1000);
};
const stopTimer = () => {
  clearInterval(intervalRef.current);
};

// 3. Track previous value
const prevCountRef = useRef(0);

useEffect(() => {
  prevCountRef.current = count; // update after render
});

const prevCount = prevCountRef.current; // value from previous render

// 4. forwardRef — expose ref to parent
const Input = forwardRef((props, ref) => (
  <input ref={ref} {...props} />
));

// Parent can now:
<Input ref={inputRef} />
inputRef.current.focus();`,
    tip:"Don't read or write refs during rendering — only in effects and event handlers. If you need a value during render, use state or useMemo instead." },

  { id:"useContext",icon:"🌐",  title:"useContext",              subtitle:"Global state without prop drilling — themes, auth, locale",
    Demo:UseContextDemo,
    body:"useContext provides a way to share values between components without explicitly passing props through every level (prop drilling). Common use cases: theme, authenticated user, locale, and feature flags. Context is not a replacement for all state management — it's best for values that don't change often, since every consumer re-renders when context value changes.",
    code:`import { createContext, useContext, useState } from 'react';

// 1. Create context with a default value
const ThemeContext = createContext({ theme: 'dark', toggle: () => {} });

// 2. Create a Provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  const toggle = () =>
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Custom hook — best practice
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be inside ThemeProvider');
  return context;
}

// 4. Use in any nested component
function DarkModeButton() {
  const { theme, toggle } = useTheme(); // no prop drilling!
  return (
    <button onClick={toggle}>
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}`,
    tip:"Split your contexts by concern (AuthContext, ThemeContext, CartContext) rather than one giant context. This way, components only re-render when the specific context they consume changes." },

  { id:"useReducer",icon:"🔀",  title:"useReducer",             subtitle:"Complex state logic, dispatch actions, like mini Redux",
    Demo:UseReducerDemo,
    body:"useReducer is the right choice when state logic is complex — multiple sub-values, when next state depends on previous state in complex ways, or when you find yourself with many related setState calls. The pattern (state, action) => newState is identical to Redux reducers, making migration easy. Never mutate state inside reducers — always return new objects.",
    code:`import { useReducer } from 'react';

const initialState = {
  items:  [],
  loading: false,
  error:   null,
  page:    1,
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, items: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.error };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.item] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'NEXT_PAGE':
      return { ...state, page: state.page + 1 };
    default:
      return state;  // Always return state for unknown actions
  }
}

const [state, dispatch] = useReducer(reducer, initialState);

// Dispatch actions
dispatch({ type: 'FETCH_START' });
dispatch({ type: 'FETCH_SUCCESS', payload: data });
dispatch({ type: 'ADD_ITEM', item: { id: 1, name: 'React' } });`,
    tip:"Use useReducer + Context together as a powerful pattern: the reducer handles complex state logic, context distributes both state and dispatch — giving you a lightweight global store without Redux." },

  { id:"memo",      icon:"🧠",  title:"useMemo & useCallback",  subtitle:"Memoization for expensive computations and stable references",
    Demo:MemoDemo,
    body:"useMemo memoizes the result of a computation — it only recalculates when dependencies change. useCallback memoizes a function reference — useful when passing callbacks to optimized child components wrapped in React.memo. Both hooks exist purely for performance optimization. Always profile first — premature memoization adds complexity for little gain.",
    code:`import { useMemo, useCallback, memo } from 'react';

// useMemo — cache expensive computation
const sortedItems = useMemo(() => {
  return items
    .filter(item => item.active)
    .sort((a, b) => b.priority - a.priority);
}, [items]); // only re-sort when items changes

// useCallback — stable function reference
const handleDelete = useCallback((id) => {
  setItems(prev => prev.filter(item => item.id !== id));
}, []); // no deps — always same function

// React.memo — skip re-render if props unchanged
const ItemRow = memo(({ item, onDelete }) => {
  console.log('ItemRow render:', item.id);
  return (
    <tr>
      <td>{item.name}</td>
      <td><button onClick={() => onDelete(item.id)}>Delete</button></td>
    </tr>
  );
});

// Only renders when item or onDelete reference changes
// Pair memo + useCallback for maximum effect

// When NOT to memoize:
// ❌ Simple computations (add two numbers)
// ❌ Small lists
// ❌ Components that always get new props anyway
// → Profile with React DevTools first!`,
    tip:"Open React DevTools Profiler to identify actual performance bottlenecks before adding useMemo/useCallback. Unnecessary memoization adds overhead and makes code harder to read." },

  { id:"customHooks",icon:"🪝", title:"Custom Hooks",           subtitle:"Extract & reuse stateful logic — useDebounce, useFetch, useLocalStorage",
    Demo:CustomHooksDemo,
    body:"Custom hooks are the React superpower — they let you extract stateful logic into reusable functions. Any function starting with 'use' that calls other hooks is a custom hook. They share logic, not state — each call to a custom hook gets its own isolated state. Custom hooks are how you replace class component lifecycle methods and HOC patterns.",
    code:`// Pattern: extract logic from component into custom hook

// useWindowSize
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handler = () => setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return size;
}

// useOnClickOutside
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

// useInterval
function useInterval(callback, delay) {
  const savedCallback = useRef(callback);
  useEffect(() => { savedCallback.current = callback; }, [callback]);
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}`,
    tip:"Check usehooks.com and ahooks for a library of battle-tested custom hooks. You don't need to reinvent common patterns like useDebounce, useLocalStorage, or useIntersectionObserver." },

  { id:"lists",     icon:"📋",  title:"Lists & Keys",           subtitle:"Array.map(), stable keys, virtualization for large lists",
    Demo:ListsDemo,
    body:"Rendering lists in React requires the key prop — it helps React identify which items changed, were added, or removed. Keys must be stable, unique among siblings, and ideally database IDs. Never use array indices as keys for reorderable lists. For very large lists (thousands of items), use react-window or react-virtual to only render visible items.",
    code:`// ✅ Correct — stable unique key
const UserList = ({ users }) => (
  <ul>
    {users.map(user => (
      <li key={user.id}>
        <Avatar src={user.photo} />
        <span>{user.name}</span>
      </li>
    ))}
  </ul>
);

// ✅ Filtering and sorting (with useMemo)
function FilteredList({ items }) {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const visible = useMemo(() =>
    items
      .filter(i => i.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a[sortBy] > b[sortBy] ? 1 : -1),
    [items, query, sortBy]
  );

  return visible.map(item => <ItemCard key={item.id} item={item} />);
}

// ❌ Bad keys
users.map((user, index) => (    // index key — breaks reordering
  <li key={index}>{user.name}</li>
));

users.map(user => (              // random key — destroys & recreates on each render
  <li key={Math.random()}>{user.name}</li>
));`,
    tip:"For lists with 100+ items, always profile scroll performance. react-window's FixedSizeList or VariableSizeList can handle tens of thousands of items smoothly by only rendering what's visible." },

  { id:"conditional",icon:"🔀", title:"Conditional Rendering",  subtitle:"&&, ternary, early returns, lookup tables — 5 patterns",
    Demo:ConditionalDemo,
    body:"React conditionally renders by returning different JSX based on state or props. There are several patterns: short-circuit (&&), ternary (?:), early returns, switch statements, and lookup objects. Each has trade-offs. Avoid deeply nested ternaries — break them into smaller components or use lookup objects for complex role-based rendering.",
    code:`function Dashboard({ user, isLoading, notifications }) {
  // Early returns (cleanest for guard clauses)
  if (isLoading) return <Spinner />;
  if (!user)     return <Redirect to="/login" />;

  // Lookup object (replaces complex switch)
  const RolePanel = {
    admin:     <AdminPanel />,
    moderator: <ModPanel />,
    user:      <UserDash />,
  }[user.role] ?? <NotFound />;

  return (
    <div>
      {/* Short-circuit — renders nothing if false */}
      {user.isVerified && <VerifiedBadge />}

      {/* Ternary — two options */}
      {user.isPro ? <ProFeatures /> : <UpgradePrompt />}

      {/* Count with nullish coalescing */}
      <Badge count={notifications ?? 0} />

      {/* Null = render nothing */}
      {notifications === 0 ? null : <NotificationDot />}

      {RolePanel}
    </div>
  );
}

// ⚠️ Falsy gotcha — use !! or Boolean()
{count && <Badge />}   // renders '0' when count = 0!
{count > 0 && <Badge />} // ✅ safe`,
    tip:"The && gotcha: {0 && <Component />} renders the number 0 to the DOM! Use {count > 0 && <Component />} or {!!count && <Component />} to safely short-circuit with falsy numbers." },

  { id:"forms",     icon:"📋",  title:"Forms",                  subtitle:"Controlled inputs, validation, FormData, React Hook Form",
    Demo:FormsDemo,
    body:"React forms use controlled inputs where React state drives the input value. This gives you instant access to values for validation, transformation, and submission. For complex forms, use React Hook Form or Formik to reduce boilerplate. The rule of thumb: controlled inputs for any form that needs live validation or conditional fields; uncontrolled (refs) only for simple or performance-critical cases.",
    code:`// React Hook Form (production recommended)

function SignupForm() {
  const {
    register, handleSubmit, watch,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    await api.createUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /\\S+@\\S+\\.\\S+/,
            message: 'Invalid email',
          },
        })}
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        type="password"
        {...register('password', { minLength: { value: 8 } })}
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating…' : 'Sign Up'}
      </button>
    </form>
  );
}`,
    tip:"Use React Hook Form for production forms — it's performant (uncontrolled under the hood), has excellent validation, and integrates with Zod/Yup for schema validation. Much less boilerplate than manual controlled inputs." },

  { id:"router",    icon:"🗺️",  title:"React Router v6",        subtitle:"Routes, Link, useNavigate, useParams, protected routes",
    Demo:RouterDemo,
    body:"React Router v6 provides client-side navigation for single-page applications. Routes are matched declaratively with the <Routes> and <Route> components. Hooks like useNavigate, useParams, useSearchParams, and useLocation give you programmatic control over navigation and access to URL data in any component.",
    code:`// Installation
npm install react-router-dom

// Setup with layout routes
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* Layout route — renders Outlet inside */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/:id" element={<UserProfile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Protected route */}
        <Route element={<RequireAuth />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// Navigation
const navigate = useNavigate();
navigate('/users/42', { state: { from: '/' } });
navigate(-1); // go back`,
    tip:"Use <Link> instead of <a href> for all in-app navigation. <a href> triggers a full page reload, destroying React state. <NavLink> is like Link but adds an active class when its route matches." },

  { id:"state",     icon:"🗄️",  title:"State Management",       subtitle:"useState vs Context vs Zustand vs Redux vs React Query",
    Demo:StateManagementDemo,
    body:"Choosing a state management solution is one of the most important architectural decisions in a React app. The rule: server state (data from APIs) belongs in React Query or SWR. UI state (modals, forms) belongs in useState. Shared UI state (theme, cart) belongs in Context or Zustand. Only use Redux when you need its powerful devtools or already have it in a large codebase.",
    code:`// Decision tree:
// 1. Is it server/async data? → React Query or SWR
// 2. Is it local to one component? → useState
// 3. Is it shared across 2-3 components? → Lift state up + props
// 4. Is it truly global UI state? → Context or Zustand
// 5. Large team, complex app, need devtools? → Redux Toolkit

// Zustand — minimal, production-ready
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items:    [],
      total:    0,
      addItem:  (item)  => set(s => ({
        items: [...s.items, item],
        total: s.total + item.price,
      })),
      removeItem: (id)  => set(s => ({
        items: s.items.filter(i => i.id !== id),
        total: s.total - s.items.find(i => i.id === id)?.price ?? 0,
      })),
      clearCart: ()     => set({ items: [], total: 0 }),
    }),
    { name: 'cart-storage' } // persists to localStorage
  )
);`,
    tip:"Don't put server data in Redux/Zustand — that's what React Query is for. Mixing server state and client state in the same store creates sync problems. Zustand + React Query is the modern sweet spot." },

  { id:"performance",icon:"🚀", title:"Performance",            subtitle:"React.memo, code splitting, lazy loading, virtualization, Profiler",
    Demo:PerformanceDemo,
    body:"React is fast by default, but some patterns can cause slowdowns: unnecessary re-renders, huge bundles, and rendering thousands of DOM nodes. Fix unnecessary re-renders with React.memo + useCallback. Shrink bundles with React.lazy + dynamic imports. Handle large lists with react-window. Always profile with React DevTools Profiler before optimizing.",
    code:`// 1. React.memo + useCallback
const List = memo(({ items, onDelete }) => (
  items.map(item => <Row key={item.id} item={item} onDelete={onDelete}/>)
));

function Parent() {
  // ✅ Stable reference — memo works
  const handleDelete = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  return <List items={items} onDelete={handleDelete} />;
}

// 2. Code splitting
const HeavyPage = lazy(() => import('./HeavyPage'));
<Suspense fallback={<Spinner />}><HeavyPage /></Suspense>

// 3. React Profiler API

<Profiler id="List" onRender={(id, phase, actualDuration) => {
  console.log(id, phase, actualDuration + 'ms');
}}>
  <ExpensiveList />
</Profiler>

// 4. useTransition for non-urgent updates
const [isPending, startTransition] = useTransition();
startTransition(() => setSearchResults(filter(items, query)));`,
    tip:"Install the React Developer Tools browser extension. The Profiler tab lets you record a session and see exactly which components re-rendered, how long they took, and why they rendered." },
];

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function ReactMasterclass() {
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
          <div style={{ width:34, height:34, borderRadius:9, background:`linear-gradient(135deg,#60a5fa,#a78bfa)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem", flexShrink:0 }}>⚛️</div>
          <div>
            <div style={{ fontWeight:800, fontSize:"0.95rem", letterSpacing:"-0.02em", lineHeight:1.1 }}>React Masterclass</div>
            <div style={{ color:t.muted, fontSize:"0.67rem" }}>Complete interactive guide · {SECTIONS.length} lessons</div>
          </div>
          <span style={{ background:t.accentBg, color:t.accent, border:`1px solid ${t.accentBorder}`, borderRadius:20, padding:"1px 9px", fontSize:"0.68rem", fontWeight:800 }}>v19</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <div style={{ width:90, height:5, background:t.border, borderRadius:99, overflow:"hidden" }}>
              <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${t.accent},${t.purple})`, borderRadius:99, transition:"width .5s" }}/>
            </div>
            <span style={{ fontSize:"0.7rem", color:t.muted, fontWeight:700 }}>{done.size}/{SECTIONS.length}</span>
          </div>
          <button onClick={()=>setDark(d=>!d)} style={{ background:t.surface2, border:`1px solid ${t.border}`, borderRadius:8, padding:"5px 12px", cursor:"pointer", color:t.text, fontSize:"0.8rem", fontWeight:600, display:"flex", alignItems:"center", gap:5 }}>
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        {/* SIDEBAR */}
        <aside style={{ width:252, flexShrink:0, background:t.sidebar, borderRight:`1px solid ${t.border}`, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ padding:"12px 12px 10px", borderBottom:`1px solid ${t.border}`, flexShrink:0 }}>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", color:t.muted, pointerEvents:"none", fontSize:"0.9rem" }}>🔍</span>
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
              {SECTIONS.map(s=>(
                <div key={s.id} onClick={()=>go(s.id)} title={s.title}
                  style={{ width:11, height:11, borderRadius:3, background:done.has(s.id)?"#60a5fa":s.id===activeId?t.accent:t.border, cursor:"pointer", transition:"background .2s" }}/>
              ))}
            </div>
          </div>
          <nav style={{ flex:1, overflowY:"auto", padding:"6px 8px", minHeight:0 }}>
            {filtered.length===0 && <div style={{ padding:"24px 10px", textAlign:"center", color:t.muted, fontSize:"0.82rem" }}>No lessons found</div>}
            {filtered.map(s=>{
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
            <span style={{ fontSize:"0.68rem", color:t.muted }}>Interactive demos · Hooks to Performance</span>
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
                  style={{ background:done.has(current.id)?"#60a5fa20":t.surface2, border:`1px solid ${done.has(current.id)?"#60a5fa60":t.border}`, color:done.has(current.id)?t.accent:t.muted, borderRadius:10, padding:"8px 16px", cursor:"pointer", fontSize:"0.8rem", fontWeight:700, whiteSpace:"nowrap" }}>
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
              <SLabel color="#1d4ed8">Code Example</SLabel>
              <Code code={current.code} />
            </div>

            <div style={{ marginBottom:32 }}>
              <Tip text={current.tip} t={t} />
            </div>

            <div style={{ display:"flex", gap:10, alignItems:"center", borderTop:`1px solid ${t.border}`, paddingTop:22 }}>
              <button onClick={()=>idx>0&&go(SECTIONS[idx-1].id)} disabled={idx===0}
                style={{ background:t.surface2, border:`1px solid ${t.border}`, color:idx===0?t.muted:t.text, borderRadius:10, padding:"10px 18px", cursor:idx===0?"not-allowed":"pointer", fontSize:"0.85rem", fontWeight:600, opacity:idx===0?.45:1 }}>← Prev</button>
              <div style={{ flex:1, textAlign:"center", fontSize:"0.78rem", color:t.muted }}>{idx+1} of {SECTIONS.length}</div>
              <button onClick={()=>{ if(idx<SECTIONS.length-1){ toggleDone(current.id); go(SECTIONS[idx+1].id); }}} disabled={idx===SECTIONS.length-1}
                style={{ background:idx===SECTIONS.length-1?t.surface2:`linear-gradient(135deg,${t.accent},${t.purple})`, border:"none", color:idx===SECTIONS.length-1?t.muted:"#fff", borderRadius:10, padding:"10px 20px", cursor:idx===SECTIONS.length-1?"not-allowed":"pointer", fontSize:"0.85rem", fontWeight:700, opacity:idx===SECTIONS.length-1?.45:1, boxShadow:idx===SECTIONS.length-1?"none":`0 4px 14px ${t.accent}45` }}>Next →</button>
            </div>
            <div style={{ height:40 }}/>
          </div>
        </main>
      </div>
    </div>
  );
}
