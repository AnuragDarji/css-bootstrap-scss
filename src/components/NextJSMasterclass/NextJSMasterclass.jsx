import { useState, useRef, useEffect } from "react";

/* ── THEME ──────────────────────────────────────────── */
const T = {
  dark:  { bg:"#04050f", sidebar:"#07081a", surface:"#0b0d20", surface2:"#0f1228", border:"#181c3a", text:"#dde4ff", muted:"#454d80", accent:"#818cf8", accentBg:"#818cf810", accentBorder:"#818cf835", danger:"#f87171", warn:"#fbbf24", success:"#34d399", purple:"#c084fc", pink:"#f472b6", orange:"#fb923c", cyan:"#22d3ee", lime:"#a3e635" },
  light: { bg:"#f3f4ff", sidebar:"#ffffff", surface:"#ffffff", surface2:"#ebebff", border:"#c5c9f0", text:"#060820", muted:"#454d80", accent:"#4f46e5", accentBg:"#4f46e510", accentBorder:"#4f46e535", danger:"#dc2626", warn:"#d97706", success:"#059669", purple:"#7c3aed", pink:"#db2777", orange:"#ea580c", cyan:"#0891b2", lime:"#65a30d" },
};

/* ── SHARED ─────────────────────────────────────────── */
function CopyBtn({ code }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(code); setOk(true); setTimeout(() => setOk(false), 2000); }}
      style={{ position:"absolute", top:10, right:10, background:ok?"#818cf822":"#ffffff0e", border:`1px solid ${ok?"#818cf866":"#ffffff18"}`, color:ok?"#818cf8":"#454d80", borderRadius:6, padding:"3px 10px", fontSize:"0.72rem", cursor:"pointer", fontFamily:"monospace", transition:"all .2s" }}>
      {ok ? "✓ copied" : "copy"}
    </button>
  );
}

function Code({ code }) {
  const lines = code.trim().split("\n");
  const col = (l) => {
    const tr = l.trim();
    if (tr.startsWith("//") || tr.startsWith("/*") || tr.startsWith("*")) return "#2d3560";
    if (/\b(import|export|from|default|const|let|return|async|await|function|class|new|if|else|try|catch|throw)\b/.test(l)) return "#c084fc";
    if (/\b(use client|use server)\b/.test(l)) return "#f472b6";
    if (/'use client'|'use server'/.test(l)) return "#f472b6";
    if (/\b(fetch|cache|revalidate|cookies|headers|redirect|notFound|generateMetadata|generateStaticParams)\b/.test(l)) return "#22d3ee";
    if (/<[A-Z][a-zA-Z]*/.test(l)) return "#f472b6";
    if (/<[a-z]+[\s/>]/.test(l) || l.includes("</")) return "#818cf8";
    if (/"[^"]*"|'[^']*'/.test(l)) return "#86efac";
    if (/\b(true|false|null|undefined|\d+)\b/.test(l)) return "#fb923c";
    return "#c5ceff";
  };
  return (
    <div style={{ position:"relative", borderRadius:12, overflow:"hidden", border:"1px solid #181c3a" }}>
      <div style={{ background:"#030408", padding:"14px 16px", overflowX:"auto" }}>
        <pre style={{ margin:0, fontFamily:"'Fira Code','Cascadia Code',monospace", fontSize:"0.78rem", lineHeight:1.8 }}>
          {lines.map((line, i) => (
            <div key={i} style={{ display:"flex", gap:16 }}>
              <span style={{ color:"#181c3a", userSelect:"none", minWidth:20, textAlign:"right", flexShrink:0 }}>{i+1}</span>
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
      <div style={{ width:3, height:18, background:color||"#818cf8", borderRadius:99 }} />
      <span style={{ fontSize:"0.72rem", fontWeight:700, color:"#454d80", textTransform:"uppercase", letterSpacing:"0.07em" }}>{children}</span>
    </div>
  );
}

/* ══ DEMO 1 — What is Next.js / App vs Pages Router ═══ */
function IntroDemo({ t }) {
  const [view, setView] = useState("compare");
  const [hovNode, setHovNode] = useState(null);

  const appRouterFeatures = [
    { icon:"🖥️", label:"React Server Components", desc:"Components that render on the server by default — zero JS sent to client", color:t.accent },
    { icon:"⚡", label:"Streaming & Suspense",    desc:"Stream HTML progressively — show UI instantly, load data incrementally", color:t.cyan },
    { icon:"🎬", label:"Server Actions",           desc:"Async functions that run on the server — call from client components", color:t.purple },
    { icon:"📁", label:"File-based Routing",       desc:"app/ folder structure = URL structure. Layouts, pages, loading, error files", color:t.pink },
    { icon:"🔄", label:"Nested Layouts",           desc:"Layouts persist across navigations — no re-render on route change", color:t.success },
    { icon:"🚀", label:"Parallel Routes",          desc:"Render multiple pages simultaneously in the same layout (@slot convention)", color:t.warn },
  ];

  const versionCompare = [
    { feature:"Router",            pages:"Pages Router (pages/)",         app:"App Router (app/)",              winner:"app" },
    { feature:"Component default", pages:"Client Components",              app:"Server Components",               winner:"app" },
    { feature:"Data fetching",     pages:"getServerSideProps / getStaticProps", app:"async/await in component", winner:"app" },
    { feature:"Layouts",           pages:"_app.tsx + per-page wrappers",  app:"Nested layout.tsx files",         winner:"app" },
    { feature:"API routes",        pages:"pages/api/*.ts",                 app:"app/api/route.ts",                winner:"both" },
    { feature:"Mutations",         pages:"API route + fetch",              app:"Server Actions (no API needed)",  winner:"app" },
    { feature:"Streaming",         pages:"Limited",                        app:"Built-in with Suspense",          winner:"app" },
    { feature:"Stability",         pages:"Mature, battle-tested",         app:"Stable since Next.js 13.4",       winner:"both" },
  ];

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Next.js 14+ overview — App Router features & comparison</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["⚡ App Router Features","features"],["⚔️ App vs Pages","compare"]].map(([l,v]) => (
          <button key={v} onClick={() => setView(v)} style={{ background:view===v?t.accentBg:t.surface, color:view===v?t.accent:t.muted, border:`1px solid ${view===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>

      {view === "features" ? (
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {appRouterFeatures.map((f, i) => (
            <div key={i} onMouseEnter={() => setHovNode(i)} onMouseLeave={() => setHovNode(null)}
              style={{ flex:"1 1 200px", background:hovNode===i?`${f.color}15`:t.surface, border:`1px solid ${hovNode===i?`${f.color}50`:t.border}`, borderRadius:10, padding:"12px 14px", transition:"all .2s", cursor:"default" }}>
              <div style={{ fontSize:"1.2rem", marginBottom:5 }}>{f.icon}</div>
              <div style={{ color:f.color, fontWeight:700, fontSize:"0.82rem", marginBottom:4 }}>{f.label}</div>
              <div style={{ color:t.muted, fontSize:"0.73rem", lineHeight:1.55 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.79rem" }}>
            <thead>
              <tr>
                {["Feature","Pages Router","App Router"].map(h => (
                  <th key={h} style={{ padding:"8px 12px", textAlign:"left", color:t.accent, borderBottom:`2px solid ${t.accentBorder}`, fontSize:"0.72rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {versionCompare.map((row, i) => (
                <tr key={i} style={{ background:i%2===1?t.surface2:"transparent" }}>
                  <td style={{ padding:"8px 12px", color:t.muted, borderBottom:`1px solid ${t.border}`, fontWeight:600 }}>{row.feature}</td>
                  <td style={{ padding:"8px 12px", color:row.winner==="pages"?t.warn:t.muted, borderBottom:`1px solid ${t.border}`, fontFamily:"monospace", fontSize:"0.75rem" }}>{row.pages}</td>
                  <td style={{ padding:"8px 12px", color:row.winner==="app"?t.accent:row.winner==="both"?t.success:t.muted, borderBottom:`1px solid ${t.border}`, fontFamily:"monospace", fontSize:"0.75rem" }}>
                    {row.winner==="app"&&"✓ "}{row.app}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ══ DEMO 2 — File-based Routing ══════════════════════ */
function RoutingDemo({ t }) {
  const [activeRoute, setActiveRoute] = useState(null);

  const fileTree = [
    { path:"app/", type:"dir", depth:0, desc:"Root of App Router" },
    { path:"app/layout.tsx", type:"file", depth:1, color:t.accent, desc:"Root layout — wraps every page. Add <html>, <body>, global providers here." },
    { path:"app/page.tsx", type:"file", depth:1, color:t.success, desc:"Route: / — home page" },
    { path:"app/about/", type:"dir", depth:1, desc:"Segment folder" },
    { path:"app/about/page.tsx", type:"file", depth:2, color:t.success, desc:"Route: /about" },
    { path:"app/blog/", type:"dir", depth:1, desc:"Segment folder" },
    { path:"app/blog/page.tsx", type:"file", depth:2, color:t.success, desc:"Route: /blog" },
    { path:"app/blog/[slug]/", type:"dir", depth:2, color:t.orange, desc:"Dynamic segment — [slug] captures URL param" },
    { path:"app/blog/[slug]/page.tsx", type:"file", depth:3, color:t.success, desc:"Route: /blog/any-slug — params.slug available" },
    { path:"app/blog/layout.tsx", type:"file", depth:2, color:t.accent, desc:"Layout for /blog and all child routes — persists on navigation" },
    { path:"app/dashboard/", type:"dir", depth:1, desc:"Segment folder" },
    { path:"app/dashboard/(overview)/", type:"dir", depth:2, color:t.purple, desc:"Route Group — groups routes without affecting URL" },
    { path:"app/dashboard/(overview)/page.tsx", type:"file", depth:3, color:t.success, desc:"Route: /dashboard (not /dashboard/(overview))" },
    { path:"app/api/", type:"dir", depth:1, desc:"API routes" },
    { path:"app/api/users/route.ts", type:"file", depth:2, color:t.cyan, desc:"API endpoint: GET/POST /api/users" },
    { path:"app/loading.tsx", type:"file", depth:1, color:t.warn, desc:"Automatic loading UI — shown while page/layout loads" },
    { path:"app/error.tsx", type:"file", depth:1, color:t.danger, desc:"Error boundary — catches errors in route segment" },
    { path:"app/not-found.tsx", type:"file", depth:1, color:t.danger, desc:"Custom 404 page — shown when notFound() is called" },
  ];

  const specialFiles = [
    { file:"page.tsx",        color:t.success,  desc:"Makes a route publicly accessible" },
    { file:"layout.tsx",      color:t.accent,   desc:"Shared UI that wraps child routes, persists on nav" },
    { file:"loading.tsx",     color:t.warn,     desc:"Instant loading UI using Suspense" },
    { file:"error.tsx",       color:t.danger,   desc:"Error UI ('use client' required)" },
    { file:"not-found.tsx",   color:t.danger,   desc:"404 UI for notFound() calls" },
    { file:"template.tsx",    color:t.purple,   desc:"Like layout but re-renders on nav" },
    { file:"route.ts",        color:t.cyan,     desc:"API endpoint — no UI" },
    { file:"middleware.ts",   color:t.orange,   desc:"Runs before every request (root level)" },
  ];

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 14px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>File-based routing — App Router folder structure</p>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        <div style={{ flex:"1 1 220px" }}>
          <div style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, marginBottom:8 }}>Click a file to learn about it:</div>
          <div style={{ background:"#030408", border:`1px solid ${t.border}`, borderRadius:10, padding:"10px 12px", fontFamily:"monospace" }}>
            {fileTree.map((f, i) => (
              <div key={i} onClick={() => setActiveRoute(activeRoute===i ? null : i)}
                style={{ display:"flex", alignItems:"center", gap:6, paddingLeft: f.depth*14, paddingTop:3, paddingBottom:3, paddingRight:4, borderRadius:5, cursor:"pointer", background:activeRoute===i?`${f.color||t.muted}20`:"transparent", transition:"background .15s" }}>
                <span style={{ flexShrink:0 }}>{f.type==="dir" ? "📁" : "📄"}</span>
                <span style={{ color:activeRoute===i?(f.color||t.text):f.color||t.muted, fontSize:"0.75rem", fontWeight:activeRoute===i?700:400 }}>{f.path.replace(/.*\//,"") || f.path}</span>
                {f.color && f.type==="file" && <div style={{ width:5, height:5, borderRadius:"50%", background:f.color, marginLeft:"auto", flexShrink:0 }}/>}
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex:"1 1 200px" }}>
          {activeRoute !== null ? (
            <div style={{ background:`${fileTree[activeRoute].color||t.muted}15`, border:`1px solid ${fileTree[activeRoute].color||t.muted}40`, borderRadius:10, padding:"14px 16px", marginBottom:12 }}>
              <code style={{ color:fileTree[activeRoute].color||t.text, fontWeight:700, fontSize:"0.85rem" }}>{fileTree[activeRoute].path}</code>
              <p style={{ margin:"8px 0 0", color:t.muted, fontSize:"0.8rem", lineHeight:1.6 }}>{fileTree[activeRoute].desc}</p>
            </div>
          ) : (
            <div style={{ background:t.surface, border:`2px dashed ${t.border}`, borderRadius:10, padding:20, textAlign:"center", color:t.muted, marginBottom:12 }}>← Click any file</div>
          )}
          <div style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, marginBottom:6 }}>Special filenames:</div>
          {specialFiles.map(f => (
            <div key={f.file} style={{ display:"flex", gap:8, padding:"4px 8px", borderRadius:5, marginBottom:2 }}>
              <code style={{ color:f.color, fontWeight:700, fontSize:"0.74rem", minWidth:110 }}>{f.file}</code>
              <span style={{ color:t.muted, fontSize:"0.72rem" }}>{f.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══ DEMO 3 — Server vs Client Components ═════════════ */
function ServerClientDemo({ t }) {
  const [selected, setSelected] = useState("server");
  const [scenario, setScenario] = useState(0);

  const types = {
    server: {
      color: t.accent,
      label: "Server Components (default)",
      icon: "🖥️",
      canDo: ["Access database directly", "Read filesystem / env vars", "Reduce client JS bundle (zero JS sent)", "Fetch data without useEffect", "Keep secrets on server", "Use async/await at component level"],
      cannotDo: ["Use useState / useReducer", "Use useEffect / lifecycle hooks", "Handle click/change events", "Use browser APIs (window, document)", "Use React Context directly", "Add 'use client' boundary"],
      code: `// app/users/page.tsx — Server Component (default)
// No 'use client' = Server Component

import { db } from '@/lib/db';

// ✅ Direct database access — no API needed!
// ✅ async/await at the top level
// ✅ Secrets never leave the server
async function UsersPage() {
  // Fetch data directly — no useEffect!
  const users = await db.query(
    'SELECT * FROM users ORDER BY created_at DESC'
  );

  return (
    <div>
      <h1>Users ({users.length})</h1>
      {users.map(user => (
        <div key={user.id}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}`,
    },
    client: {
      color: t.pink,
      label: "Client Components",
      icon: "🌐",
      canDo: ["useState / useReducer", "useEffect / lifecycle hooks", "Event handlers (onClick, onChange)", "Browser APIs (window, localStorage)", "React Context / useContext", "Custom hooks with state"],
      cannotDo: ["Direct database access", "Read env vars (only NEXT_PUBLIC_)", "Keep secrets (code sent to browser)", "async/await at top level (needs useEffect)", "Reduce bundle size (sends JS to client)"],
      code: `// components/Counter.tsx — Client Component
'use client'; // ← This directive makes it a Client Component


function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}

// Use in a Server Component — totally fine!
// app/page.tsx (Server Component)
import Counter from '@/components/Counter';

function Page() {
  return (
    <main>
      <h1>My Page</h1>
      <Counter /> {/* Client component island */}
    </main>
  );
}`,
    },
  };

  const scenarios = [
    { label:"Data list page",   server:true,  reason:"Fetch from DB, render HTML, no interactivity needed" },
    { label:"Like button",      server:false, reason:"Needs onClick event handler and local state" },
    { label:"Blog post page",   server:true,  reason:"Fetch post by slug, render markdown, SEO friendly" },
    { label:"Search bar",       server:false, reason:"Needs onChange, debounce, and client-side filtering" },
    { label:"Nav bar (static)", server:true,  reason:"Just links, no state — Server Component is fine" },
    { label:"Theme toggle",     server:false, reason:"Needs useState and localStorage" },
    { label:"Pricing table",    server:true,  reason:"Fetch prices from DB, static HTML output" },
    { label:"Image carousel",   server:false, reason:"Needs useState for current slide" },
  ];

  const cur = types[selected];

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Server Components vs Client Components</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["🖥️ Server Component","server"],["🌐 Client Component","client"],["🎯 Which to use?","quiz"]].map(([l,v]) => (
          <button key={v} onClick={() => setSelected(v)} style={{ background:selected===v?t.accentBg:t.surface, color:selected===v?t.accent:t.muted, border:`1px solid ${selected===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>

      {selected !== "quiz" ? (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            <div style={{ background:`${cur.color}15`, border:`1px solid ${cur.color}40`, borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
              <div style={{ fontSize:"1.4rem", marginBottom:4 }}>{cur.icon}</div>
              <div style={{ color:cur.color, fontWeight:700, fontSize:"0.88rem", marginBottom:8 }}>{cur.label}</div>
              <div style={{ color:t.success, fontWeight:700, fontSize:"0.72rem", marginBottom:5 }}>✓ CAN DO:</div>
              {cur.canDo.map(d => <div key={d} style={{ color:t.muted, fontSize:"0.72rem", marginBottom:3 }}>• {d}</div>)}
              <div style={{ color:t.danger, fontWeight:700, fontSize:"0.72rem", marginBottom:5, marginTop:10 }}>✗ CANNOT DO:</div>
              {cur.cannotDo.map(d => <div key={d} style={{ color:t.muted, fontSize:"0.72rem", marginBottom:3 }}>• {d}</div>)}
            </div>
          </div>
          <div style={{ flex:"1 1 240px" }}>
            <div style={{ position:"relative", borderRadius:10, overflow:"hidden", border:`1px solid ${cur.color}40` }}>
              <div style={{ background:"#030408", padding:"12px 14px", overflowX:"auto", maxHeight:300, overflowY:"auto" }}>
                <pre style={{ margin:0, fontFamily:"monospace", fontSize:"0.74rem", color:cur.color, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{cur.code}</pre>
              </div>
              <CopyBtn code={cur.code} />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p style={{ color:t.muted, fontSize:"0.8rem", marginBottom:12 }}>Use the simplest option — default to Server, add <code style={{ color:t.pink }}>'use client'</code> only when needed:</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {scenarios.map((s, i) => (
              <div key={i} onClick={() => setScenario(i)}
                style={{ flex:"1 1 160px", background:scenario===i?`${s.server?t.accent:t.pink}20`:t.surface, border:`1px solid ${scenario===i?`${s.server?t.accent:t.pink}60`:t.border}`, borderRadius:9, padding:"10px 12px", cursor:"pointer", transition:"all .2s" }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                  <span style={{ fontSize:"0.9rem" }}>{s.server?"🖥️":"🌐"}</span>
                  <span style={{ color:s.server?t.accent:t.pink, fontWeight:700, fontSize:"0.75rem" }}>{s.server?"Server":"Client"}</span>
                </div>
                <div style={{ color:t.text, fontSize:"0.8rem", fontWeight:600, marginBottom:3 }}>{s.label}</div>
                <div style={{ color:t.muted, fontSize:"0.7rem", lineHeight:1.5 }}>{s.reason}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══ DEMO 4 — Data Fetching ════════════════════════════ */
function DataFetchingDemo({ t }) {
  const [tab, setTab] = useState("server");
  const [cacheOpt, setCacheOpt] = useState("force-cache");
  const [revalSec, setRevalSec] = useState(60);

  const cacheOptions = [
    { value:"force-cache",   label:"force-cache",   color:t.success, desc:"Cache indefinitely (default for fetch in Next.js). Like getStaticProps." },
    { value:"no-store",      label:"no-store",       color:t.danger,  desc:"Never cache — fetch fresh on every request. Like getServerSideProps." },
    { value:"revalidate",    label:"next.revalidate",color:t.warn,    desc:"Cache for N seconds, then refetch in background (ISR). Best of both worlds!" },
    { value:"tags",          label:"next.tags",      color:t.accent,  desc:"Cache with a tag — revalidate on demand via revalidateTag()." },
  ];

  const codeExamples = {
    server:
`// app/products/page.tsx — Server Component data fetching
// Replaces getStaticProps + getServerSideProps

// 1. Static (cached) — replaces getStaticProps
async function ProductsPage() {
  const res = await fetch('https://api.example.com/products', {
    cache: 'force-cache',  // default in Next.js App Router
  });
  const products = await res.json();
  return <ProductList products={products} />;
}

// 2. Dynamic (no cache) — replaces getServerSideProps
async function ProductsPage() {
  const res = await fetch('https://api.example.com/products', {
    cache: 'no-store',  // fresh on every request
  });
  const products = await res.json();
  return <ProductList products={products} />;
}

// 3. ISR — Incremental Static Regeneration
async function ProductsPage() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 60 },  // revalidate every 60 seconds
  });
  const products = await res.json();
  return <ProductList products={products} />;
}`,
    parallel:
`// Parallel data fetching — runs simultaneously
// Instead of awaiting one-by-one (waterfalls)

async function DashboardPage() {
  // These all start at the same time!
  const [user, posts, analytics] = await Promise.all([
    fetch('/api/user').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/analytics').then(r => r.json()),
  ]);

  return (
    <Dashboard user={user} posts={posts} analytics={analytics} />
  );
}

// Deduplicated requests — same URL called in multiple
// components is only fetched ONCE per request cycle
async function getUser(id) {
  const res = await fetch('/api/users/' + id);
  return res.json();
}
// Even if 5 components call getUser(1),
// Next.js only makes 1 actual HTTP request`,
    revalidate:
`// On-demand revalidation — clear cache instantly
// app/api/revalidate/route.ts

import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { path, tag, secret } = await request.json();

  // Validate secret
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 });
  }

  // Revalidate a specific path
  if (path) {
    revalidatePath(path);
    return Response.json({ revalidated: true, path });
  }

  // Revalidate all pages with this tag
  if (tag) {
    revalidateTag(tag);
    return Response.json({ revalidated: true, tag });
  }
}

// In your fetch calls — attach tags
const posts = await fetch('/api/posts', {
  next: { tags: ['posts'] },
});

// Webhook from CMS triggers revalidation:
// POST /api/revalidate { tag: 'posts', secret: '...' }`,
  };

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Data Fetching — cache, revalidate, parallel, on-demand</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["Server Fetch","server"],["Parallel","parallel"],["Revalidation","revalidate"]].map(([l,v]) => (
          <button key={v} onClick={() => setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>

      {tab === "server" ? (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 160px" }}>
            <div style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, marginBottom:8 }}>Cache strategy:</div>
            {cacheOptions.map(opt => (
              <div key={opt.value} onClick={() => setCacheOpt(opt.value)}
                style={{ background:cacheOpt===opt.value?`${opt.color}20`:t.surface, border:`1px solid ${cacheOpt===opt.value?`${opt.color}60`:t.border}`, borderRadius:8, padding:"8px 10px", marginBottom:5, cursor:"pointer", transition:"all .2s" }}>
                <code style={{ color:opt.color, fontWeight:700, fontSize:"0.78rem" }}>{opt.label}</code>
                <div style={{ color:t.muted, fontSize:"0.7rem", marginTop:2, lineHeight:1.5 }}>{opt.desc}</div>
              </div>
            ))}
            {cacheOpt === "revalidate" && (
              <div style={{ marginTop:8 }}>
                <label style={{ color:t.muted, fontSize:"0.72rem", display:"block", marginBottom:4 }}>revalidate: {revalSec}s</label>
                <input type="range" min={0} max={3600} step={10} value={revalSec} onChange={e=>setRevalSec(+e.target.value)} style={{ width:"100%", accentColor:t.accent }}/>
                <div style={{ color:t.muted, fontSize:"0.7rem" }}>Cache for <strong style={{ color:t.warn }}>{revalSec}s</strong>, then refresh in background</div>
              </div>
            )}
          </div>
          <div style={{ flex:"1 1 240px" }}>
            <div style={{ position:"relative", borderRadius:10, overflow:"hidden", border:`1px solid ${t.accentBorder}` }}>
              <div style={{ background:"#030408", padding:"12px 14px", overflowX:"auto", maxHeight:280, overflowY:"auto" }}>
                <pre style={{ margin:0, fontFamily:"monospace", fontSize:"0.74rem", color:t.accent, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{codeExamples.server}</pre>
              </div>
              <CopyBtn code={codeExamples.server} />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ position:"relative", borderRadius:10, overflow:"hidden", border:`1px solid ${t.accentBorder}` }}>
          <div style={{ background:"#030408", padding:"12px 14px", overflowX:"auto", maxHeight:320, overflowY:"auto" }}>
            <pre style={{ margin:0, fontFamily:"monospace", fontSize:"0.74rem", color:t.accent, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{codeExamples[tab]}</pre>
          </div>
          <CopyBtn code={codeExamples[tab]} />
        </div>
      )}
    </div>
  );
}

/* ══ DEMO 5 — Layouts & Pages ═════════════════════════ */
function LayoutsDemo({ t }) {
  const [active, setActive] = useState("/dashboard/analytics");
  const [showRender, setShowRender] = useState(false);

  const routes = ["/", "/blog", "/blog/my-post", "/dashboard", "/dashboard/analytics", "/dashboard/settings"];
  const layouts = {
    "/": ["RootLayout"],
    "/blog": ["RootLayout","BlogLayout"],
    "/blog/my-post": ["RootLayout","BlogLayout"],
    "/dashboard": ["RootLayout","DashboardLayout"],
    "/dashboard/analytics": ["RootLayout","DashboardLayout"],
    "/dashboard/settings": ["RootLayout","DashboardLayout"],
  };
  const curLayouts = layouts[active] || ["RootLayout"];

  const layoutColors = {
    "RootLayout": t.accent,
    "BlogLayout": t.purple,
    "DashboardLayout": t.cyan,
  };

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 14px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Layouts — nested, persistent, shared UI across routes</p>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        <div style={{ flex:"1 1 200px" }}>
          <div style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, marginBottom:8 }}>Navigate — see which layouts wrap the page:</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:14 }}>
            {routes.map(r => (
              <button key={r} onClick={() => setActive(r)} style={{ background:active===r?t.accentBg:t.surface, color:active===r?t.accent:t.muted, border:`1px solid ${active===r?t.accentBorder:t.border}`, borderRadius:6, padding:"4px 10px", cursor:"pointer", fontFamily:"monospace", fontSize:"0.75rem", fontWeight:active===r?700:400 }}>{r}</button>
            ))}
          </div>

          <div style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, marginBottom:6 }}>Active layout stack for <code style={{ color:t.accent }}>{active}</code>:</div>
          <div style={{ position:"relative" }}>
            {curLayouts.map((lyt, i) => (
              <div key={lyt} style={{ border:`2px solid ${layoutColors[lyt]}60`, borderRadius:10, padding:"8px 10px", background:`${layoutColors[lyt]}10`, marginBottom:0, position:"relative" }}>
                <div style={{ color:layoutColors[lyt], fontWeight:700, fontSize:"0.78rem", marginBottom:i<curLayouts.length-1?8:4 }}>{lyt}</div>
                {i < curLayouts.length-1 && (
                  <div style={{ paddingLeft:10 }}>
                    <div key={curLayouts[i+1]} style={{ border:`2px solid ${layoutColors[curLayouts[i+1]]}60`, borderRadius:8, padding:"8px 10px", background:`${layoutColors[curLayouts[i+1]]}10` }}>
                      <div style={{ color:layoutColors[curLayouts[i+1]], fontWeight:700, fontSize:"0.78rem", marginBottom:4 }}>{curLayouts[i+1]}</div>
                      {i+1 === curLayouts.length-1 && (
                        <div style={{ paddingLeft:10 }}>
                          <div style={{ border:`2px solid ${t.success}60`, borderRadius:6, padding:"6px 10px", background:`${t.success}10` }}>
                            <div style={{ color:t.success, fontWeight:700, fontSize:"0.75rem" }}>page.tsx</div>
                            <div style={{ color:t.muted, fontSize:"0.68rem" }}>{active}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {i === 0 && curLayouts.length === 1 && (
                  <div style={{ paddingLeft:10 }}>
                    <div style={{ border:`2px solid ${t.success}60`, borderRadius:6, padding:"6px 10px", background:`${t.success}10` }}>
                      <div style={{ color:t.success, fontWeight:700, fontSize:"0.75rem" }}>page.tsx</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop:10, background:`${t.accent}12`, border:`1px solid ${t.accentBorder}`, borderRadius:8, padding:"8px 12px" }}>
            <div style={{ color:t.accent, fontSize:"0.75rem", fontWeight:700 }}>When navigating {active} → /dashboard/settings:</div>
            <div style={{ color:t.muted, fontSize:"0.72rem", marginTop:3 }}>RootLayout + DashboardLayout stay mounted. Only page.tsx re-renders. No full page reload!</div>
          </div>
        </div>

        <div style={{ flex:"1 1 220px" }}>
          <pre style={{ margin:0, background:"#030408", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:"#c5ceff", lineHeight:1.8, overflow:"auto", maxHeight:360 }}>{
`// app/layout.tsx — Root layout (required!)
// Wraps EVERY page in the app
function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}   {/* page renders here */}
        <Footer />
      </body>
    </html>
  );
}

// app/dashboard/layout.tsx — Nested layout
// Only wraps /dashboard/* routes
function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}

// app/dashboard/analytics/page.tsx
function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
// URL: /dashboard/analytics
// Render: RootLayout > DashboardLayout > AnalyticsPage`}
          </pre>
        </div>
      </div>
    </div>
  );
}
/* ══ DEMO 6 — Dynamic Routes & Params ════════════════════ */
function DynamicRoutesDemo({ t }) {
  const [slug, setSlug] = useState("nextjs-guide");
  const [userId, setUserId] = useState("42");
  const [catchAll, setCatchAll] = useState("docs/getting-started/installation");
  const [tab, setTab] = useState("basic");

  const routePatterns = [
    { pattern:"app/blog/[slug]/page.tsx",            type:"Dynamic",    url:"/blog/my-post",           params:"params.slug = 'my-post'",         color:t.orange },
    { pattern:"app/users/[id]/page.tsx",             type:"Dynamic",    url:"/users/42",               params:"params.id = '42'",                color:t.orange },
    { pattern:"app/shop/[...path]/page.tsx",          type:"Catch-all",  url:"/shop/a/b/c",             params:"params.path = ['a','b','c']",     color:t.purple },
    { pattern:"app/shop/[[...path]]/page.tsx",        type:"Optional",   url:"/shop or /shop/a/b",      params:"params.path = undefined or [...]", color:t.cyan },
    { pattern:"app/(marketing)/about/page.tsx",      type:"Route Group", url:"/about",                  params:"No params — (group) excluded",   color:t.pink },
    { pattern:"app/dashboard/@analytics/page.tsx",   type:"Parallel",   url:"/dashboard",              params:"Renders alongside @team slot",    color:t.warn },
  ];

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Dynamic Routes — segments, catch-all, route groups, parallel</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["Patterns","basic"],["Live Preview","preview"],["generateStaticParams","static"]].map(([l,v]) => (
          <button key={v} onClick={() => setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>

      {tab === "basic" && (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.78rem" }}>
            <thead>
              <tr>{["File Pattern","Type","Matches URL","Params"].map(h => <th key={h} style={{ padding:"7px 10px", textAlign:"left", color:t.accent, borderBottom:`2px solid ${t.accentBorder}`, fontSize:"0.71rem", textTransform:"uppercase" }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {routePatterns.map((r,i) => (
                <tr key={i} style={{ background:i%2===1?t.surface2:"transparent" }}>
                  <td style={{ padding:"7px 10px", borderBottom:`1px solid ${t.border}` }}><code style={{ color:r.color, fontSize:"0.73rem" }}>{r.pattern}</code></td>
                  <td style={{ padding:"7px 10px", borderBottom:`1px solid ${t.border}` }}><span style={{ background:`${r.color}20`, color:r.color, borderRadius:4, padding:"1px 7px", fontSize:"0.7rem", fontWeight:700 }}>{r.type}</span></td>
                  <td style={{ padding:"7px 10px", borderBottom:`1px solid ${t.border}` }}><code style={{ color:t.muted, fontSize:"0.73rem" }}>{r.url}</code></td>
                  <td style={{ padding:"7px 10px", borderBottom:`1px solid ${t.border}` }}><code style={{ color:t.muted, fontSize:"0.71rem" }}>{r.params}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "preview" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            {[["Blog slug",slug,setSlug,"/blog/[slug]"],["User ID",userId,setUserId,"/users/[id]"],["Catch-all",catchAll,setCatchAll,"/docs/[...path]"]].map(([label,val,set,pattern]) => (
              <div key={label} style={{ marginBottom:12 }}>
                <label style={{ display:"block", color:t.muted, fontSize:"0.72rem", marginBottom:3 }}>{label} (<code style={{ color:t.orange }}>{pattern}</code>):</label>
                <input value={val} onChange={e=>set(e.target.value)} style={{ width:"100%", boxSizing:"border-box", padding:"7px 10px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, fontSize:"0.82rem", outline:"none", fontFamily:"monospace" }}/>
              </div>
            ))}
          </div>
          <div style={{ flex:"1 1 220px" }}>
            {[
              { title:"[slug] page receives:", code:`// app/blog/[slug]/page.tsx
async function Page({
  params,
}: {
  params: { slug: string }
}) {
  // params.slug = "${slug}"
  const post = await getPost(params.slug);
  return <Article post={post} />;
}`, color:t.orange },
              { title:"[...path] catch-all receives:", code:`// app/docs/[...path]/page.tsx
// URL: /docs/${catchAll}
// params.path = ${JSON.stringify(catchAll.split("/"))}`, color:t.purple },
            ].map((item,i) => (
              <div key={i} style={{ marginBottom:10 }}>
                <div style={{ color:item.color, fontSize:"0.72rem", fontWeight:700, marginBottom:4 }}>{item.title}</div>
                <pre style={{ margin:0, background:"#030408", border:`1px solid ${item.color}35`, borderRadius:8, padding:"8px 10px", fontFamily:"monospace", fontSize:"0.73rem", color:item.color, lineHeight:1.7, whiteSpace:"pre-wrap" }}>{item.code}</pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "static" && (
        <pre style={{ margin:0, background:"#030408", border:`1px solid ${t.accentBorder}`, borderRadius:10, padding:"14px 16px", fontFamily:"monospace", fontSize:"0.75rem", color:t.accent, lineHeight:1.8, overflowX:"auto" }}>{
`// app/blog/[slug]/page.tsx
// generateStaticParams = pre-render all blog posts at build time!

// This runs at BUILD TIME — fetches all slugs
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts')
    .then(r => r.json());

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
  // Returns: [{ slug:'next-js-guide' }, { slug:'react-tips' }, ...]
  // Next.js builds a static HTML page for EACH slug!
}

// This runs once per slug (at build or on-demand)
async function BlogPost({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound(); // triggers not-found.tsx

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}

// With generateStaticParams = super fast (static HTML)
// Without = dynamic rendering on each request`}
        </pre>
      )}
    </div>
  );
}

/* ══ DEMO 7 — Navigation ══════════════════════════════ */
function NavigationDemo({ t }) {
  const [currentPage, setCurrentPage] = useState("/");
  const [tab, setTab] = useState("link");

  const pages = ["/", "/about", "/blog", "/blog/my-post", "/dashboard"];

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Navigation — Link, useRouter, usePathname, redirect</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["Link Component","link"],["useRouter","router"],["Hooks","hooks"]].map(([l,v]) => (
          <button key={v} onClick={() => setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>

      {tab === "link" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            <div style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, marginBottom:8 }}>Simulated nav bar:</div>
            <div style={{ background:"#030408", border:`1px solid ${t.border}`, borderRadius:10, overflow:"hidden", marginBottom:10 }}>
              <div style={{ display:"flex", borderBottom:`1px solid ${t.border}`, padding:"0 8px" }}>
                {pages.slice(0,4).map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)} style={{ background:"none", border:"none", borderBottom:`2px solid ${currentPage===p?t.accent:"transparent"}`, color:currentPage===p?t.accent:t.muted, padding:"10px 12px", cursor:"pointer", fontSize:"0.78rem", fontWeight:currentPage===p?700:400, transition:"all .2s" }}>
                    {p==="/"?"Home":p.replace("/","").replace("blog/","📝 ")||"Home"}
                  </button>
                ))}
              </div>
              <div style={{ padding:"20px", textAlign:"center" }}>
                <div style={{ color:t.muted, fontSize:"0.72rem", marginBottom:4 }}>Current page:</div>
                <code style={{ color:t.accent, fontSize:"1rem", fontWeight:700 }}>{currentPage}</code>
                <div style={{ color:t.muted, fontSize:"0.7rem", marginTop:4 }}>Client-side navigation — no full page reload!</div>
              </div>
            </div>
            {[
              ["href",currentPage,"Required — destination URL"],
              ["prefetch","true","Prefetch on hover (default in prod)"],
              ["replace","false","Replace history instead of push"],
              ["scroll","true","Scroll to top on navigation"],
            ].map(([prop,val,desc]) => (
              <div key={prop} style={{ display:"flex", gap:8, padding:"4px 0", borderBottom:`1px solid ${t.border}20` }}>
                <code style={{ color:t.accent, fontSize:"0.73rem", minWidth:60 }}>{prop}</code>
                <code style={{ color:t.orange, fontSize:"0.73rem", minWidth:50 }}>{val}</code>
                <span style={{ color:t.muted, fontSize:"0.7rem" }}>{desc}</span>
              </div>
            ))}
          </div>
          <div style={{ flex:"1 1 220px" }}>
            <pre style={{ margin:0, background:"#030408", border:`1px solid ${t.accentBorder}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:t.accent, lineHeight:1.8 }}>{
`import Link from 'next/link';

// Basic navigation
<Link href="/about">About</Link>

// Dynamic route
<Link href={'/blog/' + post.slug}>
  {post.title}
</Link>

// With query params
<Link href={{ pathname: '/search', query: { q: 'nextjs' } }}>
  Search
</Link>

// Active link styling with usePathname
'use client';
import { usePathname } from 'next/navigation';

function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href ||
    pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={isActive ? 'active' : ''}
    >
      {children}
    </Link>
  );
}`}
            </pre>
          </div>
        </div>
      )}

      {tab === "router" && (
        <pre style={{ margin:0, background:"#030408", border:`1px solid ${t.accentBorder}`, borderRadius:10, padding:"14px 16px", fontFamily:"monospace", fontSize:"0.75rem", color:t.accent, lineHeight:1.8, overflowX:"auto" }}>{
`'use client';
import { useRouter } from 'next/navigation';

function LoginForm() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(formData);

    if (res.success) {
      router.push('/dashboard');       // navigate
      router.replace('/dashboard');    // navigate without history
      router.back();                   // go back
      router.forward();                // go forward
      router.refresh();                // refresh server data
      router.prefetch('/dashboard');   // prefetch manually
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}

// Server-side redirect (Server Component or Server Action)
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

async function Page({ params }) {
  const post = await getPost(params.slug);

  if (!post) notFound();   // shows not-found.tsx
  if (post.draft) redirect('/blog'); // 307 redirect

  return <Article post={post} />;
}

// Permanent redirect (308) — for changed URLs
import { permanentRedirect } from 'next/navigation';
permanentRedirect('/new-url');`}
        </pre>
      )}

      {tab === "hooks" && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {[
            { hook:"useRouter()",    color:t.accent,  usage:"Programmatic navigation, refresh",          note:"Client Components only ('use client')" },
            { hook:"usePathname()", color:t.purple,  usage:"Get current URL path",                      note:"Returns '/blog/my-post'" },
            { hook:"useSearchParams()", color:t.cyan, usage:"Read query string params",                 note:"Returns URLSearchParams object" },
            { hook:"useParams()",   color:t.orange,  usage:"Read dynamic route params",                 note:"Returns { slug: 'my-post' }" },
            { hook:"redirect()",    color:t.warn,    usage:"Server-side redirect",                      note:"Works in Server Components & Actions" },
            { hook:"notFound()",    color:t.danger,  usage:"Trigger 404 page",                          note:"Shows nearest not-found.tsx" },
          ].map(item => (
            <div key={item.hook} style={{ flex:"1 1 200px", background:`${item.color}12`, border:`1px solid ${item.color}30`, borderRadius:9, padding:"10px 12px" }}>
              <code style={{ color:item.color, fontWeight:700, fontSize:"0.85rem" }}>{item.hook}</code>
              <div style={{ color:t.text, fontSize:"0.78rem", marginTop:5, marginBottom:3 }}>{item.usage}</div>
              <div style={{ color:t.muted, fontSize:"0.7rem" }}>{item.note}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══ DEMO 8 — Middleware ═════════════════════════════ */
function MiddlewareDemo({ t }) {
  const [url, setUrl] = useState("/dashboard");
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("user");
  const [locale, setLocale] = useState("en");
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  const runMiddleware = async () => {
    setRunning(true); setResult(null);
    await new Promise(r => setTimeout(r, 500));
    let outcome;
    if (url.startsWith("/dashboard") && !loggedIn) {
      outcome = { type:"redirect", to:"/login?from=" + url, reason:"Not authenticated — redirect to login", color:t.warn };
    } else if (url.startsWith("/admin") && role !== "admin") {
      outcome = { type:"redirect", to:"/403", reason:"Not authorized — insufficient role", color:t.danger };
    } else if (url.startsWith("/api") && !loggedIn) {
      outcome = { type:"response", status:401, reason:"API request — return 401 JSON", color:t.danger };
    } else {
      outcome = { type:"next", reason:"Request passes through — add headers then continue", color:t.success, headers:{ "x-locale":locale, "x-user-id":loggedIn?"user_123":"anonymous" } };
    }
    setResult(outcome);
    setRunning(false);
  };

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Middleware — runs on every request before rendering</p>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        <div style={{ flex:"1 1 200px" }}>
          <div style={{ marginBottom:10 }}>
            <label style={{ display:"block", color:t.muted, fontSize:"0.72rem", marginBottom:3 }}>Request URL:</label>
            <input value={url} onChange={e=>setUrl(e.target.value)} style={{ width:"100%", boxSizing:"border-box", padding:"7px 10px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, fontSize:"0.82rem", outline:"none", fontFamily:"monospace" }}/>
          </div>
          <div style={{ display:"flex", gap:5, marginBottom:10, flexWrap:"wrap" }}>
            {["/","/dashboard","/dashboard/settings","/admin","/api/users","/blog"].map(p => (
              <button key={p} onClick={() => setUrl(p)} style={{ background:url===p?t.accentBg:t.surface, color:url===p?t.accent:t.muted, border:`1px solid ${url===p?t.accentBorder:t.border}`, borderRadius:5, padding:"3px 8px", cursor:"pointer", fontSize:"0.72rem", fontFamily:"monospace" }}>{p}</button>
            ))}
          </div>
          <label style={{ display:"flex", gap:8, alignItems:"center", cursor:"pointer", fontSize:"0.78rem", color:t.muted, marginBottom:8 }}>
            <input type="checkbox" checked={loggedIn} onChange={e=>setLoggedIn(e.target.checked)} style={{ accentColor:t.accent, width:14, height:14 }}/>
            isLoggedIn = {String(loggedIn)}
          </label>
          <div style={{ display:"flex", gap:5, marginBottom:8 }}>
            {["user","admin"].map(r => (
              <button key={r} onClick={() => setRole(r)} style={{ flex:1, background:role===r?t.accentBg:t.surface, color:role===r?t.accent:t.muted, border:`1px solid ${role===r?t.accentBorder:t.border}`, borderRadius:6, padding:"4px 0", cursor:"pointer", fontWeight:700, fontSize:"0.75rem" }}>{r}</button>
            ))}
          </div>
          <button onClick={runMiddleware} disabled={running} style={{ width:"100%", background:`linear-gradient(135deg,${t.accent},#4338ca)`, border:"none", borderRadius:8, padding:"10px", color:"#fff", fontWeight:800, cursor:running?"not-allowed":"pointer", opacity:running?.6:1, marginBottom:10 }}>
            {running ? "⏳ Processing…" : "▶ Run Middleware"}
          </button>
          {result && (
            <div style={{ background:`${result.color}15`, border:`1px solid ${result.color}40`, borderRadius:9, padding:"10px 12px" }}>
              <div style={{ color:result.color, fontWeight:700, fontSize:"0.82rem", marginBottom:4 }}>
                {result.type==="redirect"?"↩ Redirect":result.type==="response"?"⛔ Response":"✓ NextResponse.next()"}
              </div>
              {result.to && <div style={{ color:t.muted, fontSize:"0.75rem" }}>→ <code style={{ color:result.color }}>{result.to}</code></div>}
              {result.status && <div style={{ color:t.muted, fontSize:"0.75rem" }}>Status: <code style={{ color:result.color }}>{result.status}</code></div>}
              <div style={{ color:t.muted, fontSize:"0.73rem", marginTop:4 }}>{result.reason}</div>
              {result.headers && (
                <div style={{ marginTop:6 }}>
                  {Object.entries(result.headers).map(([k,v]) => (
                    <div key={k} style={{ fontFamily:"monospace", fontSize:"0.7rem", color:t.success }}>
                      {k}: {v}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div style={{ flex:"1 1 220px" }}>
          <pre style={{ margin:0, background:"#030408", border:`1px solid ${t.accentBorder}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:t.accent, lineHeight:1.8, overflow:"auto", maxHeight:360 }}>{
`// middleware.ts — place in project ROOT
// Runs on every request before rendering

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token');
  const user  = token ? verifyToken(token.value) : null;

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(
        new URL('/login?from=' + pathname, request.url)
      );
    }
  }

  // Role-based protection
  if (pathname.startsWith('/admin')) {
    if (user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/403', request.url));
    }
  }

  // Add custom headers
  const response = NextResponse.next();
  response.headers.set('x-locale', getUserLocale(request));
  response.headers.set('x-user-id', user?.id || 'anon');
  return response;
}

// Only run on matching paths (skip static files)
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};`}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ══ DEMO 9 — Server Actions ══════════════════════════ */
function ServerActionsDemo({ t }) {
  const [tab, setTab] = useState("form");
  const [name, setName] = useState("Alice");
  const [email, setEmail] = useState("alice@dev.io");
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [optimisticLikes, setOptimisticLikes] = useState(42);
  const [liked, setLiked] = useState(false);

  const simulateSubmit = async () => {
    setSubmitting(true); setSubmitResult(null);
    await new Promise(r => setTimeout(r, 1000));
    if (!email.includes("@")) {
      setSubmitResult({ ok:false, error:"Invalid email address" });
    } else {
      setSubmitResult({ ok:true, message:"User " + name + " created successfully!" });
    }
    setSubmitting(false);
  };

  const simulateLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setOptimisticLikes(n => newLiked ? n+1 : n-1);
  };

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Server Actions — async server-side functions, no API needed</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["Form Action","form"],["Mutations","mutations"],["useFormState","formstate"]].map(([l,v]) => (
          <button key={v} onClick={() => setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>

      {tab === "form" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            <div style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, marginBottom:8 }}>Simulated Server Action form:</div>
            {[["Name","text",name,setName],["Email","email",email,setEmail]].map(([l,type,val,set]) => (
              <div key={l} style={{ marginBottom:10 }}>
                <label style={{ display:"block", fontSize:"0.72rem", color:t.muted, marginBottom:3 }}>{l}:</label>
                <input type={type} value={val} onChange={e=>set(e.target.value)} style={{ width:"100%", boxSizing:"border-box", padding:"7px 10px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, fontSize:"0.82rem", outline:"none" }}/>
              </div>
            ))}
            <button onClick={simulateSubmit} disabled={submitting} style={{ width:"100%", background:submitting?t.surface:`linear-gradient(135deg,${t.accent},#4338ca)`, border:"none", borderRadius:8, padding:"10px", color:submitting?t.muted:"#fff", fontWeight:800, cursor:submitting?"not-allowed":"pointer", opacity:submitting?.6:1 }}>
              {submitting ? "⏳ Server processing…" : "▶ Submit (Server Action)"}
            </button>
            {submitResult && (
              <div style={{ marginTop:10, background:submitResult.ok?t.accentBg:`${t.danger}15`, border:`1px solid ${submitResult.ok?t.accentBorder:`${t.danger}40`}`, borderRadius:8, padding:"8px 12px" }}>
                <div style={{ color:submitResult.ok?t.accent:t.danger, fontWeight:700, fontSize:"0.82rem" }}>
                  {submitResult.ok ? "✓ " + submitResult.message : "✗ " + submitResult.error}
                </div>
              </div>
            )}
            <div style={{ marginTop:12, padding:"10px 12px", background:`${t.cyan}12`, border:`1px solid ${t.cyan}30`, borderRadius:8 }}>
              <div style={{ color:t.cyan, fontWeight:700, fontSize:"0.75rem", marginBottom:3 }}>Optimistic UI (useOptimistic):</div>
              <button onClick={simulateLike} style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:`1px solid ${liked?t.pink:t.border}`, borderRadius:20, padding:"6px 14px", cursor:"pointer", color:liked?t.pink:t.muted, fontWeight:700, fontSize:"0.82rem" }}>
                {liked ? "❤️" : "🤍"} {optimisticLikes} likes
              </button>
              <div style={{ color:t.muted, fontSize:"0.7rem", marginTop:4 }}>Updates immediately, syncs with server in background</div>
            </div>
          </div>
          <div style={{ flex:"1 1 220px" }}>
            <pre style={{ margin:0, background:"#030408", border:`1px solid ${t.accentBorder}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:t.accent, lineHeight:1.8, overflow:"auto", maxHeight:320 }}>{
`// app/users/create/page.tsx

// Server Action — runs on server, no API route needed!
async function createUser(formData: FormData) {
  'use server'; // directive marks it as server-only

  const name  = formData.get('name') as string;
  const email = formData.get('email') as string;

  // Validate
  if (!email.includes('@')) {
    return { error: 'Invalid email' };
  }

  // Direct DB access — no fetch() needed!
  await db.users.create({ name, email });

  // Revalidate cached data
  revalidatePath('/users');

  // Redirect after success
  redirect('/users');
}

// Use in form — works without JavaScript!
function CreateUserPage() {
  return (
    <form action={createUser}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit">Create User</button>
    </form>
  );
}`}
            </pre>
          </div>
        </div>
      )}

      {tab === "mutations" && (
        <pre style={{ margin:0, background:"#030408", border:`1px solid ${t.accentBorder}`, borderRadius:10, padding:"14px 16px", fontFamily:"monospace", fontSize:"0.75rem", color:t.accent, lineHeight:1.8, overflowX:"auto" }}>{
`// lib/actions.ts — Server Actions file

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

// Delete action — called from client button
export async function deletePost(id: string) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  await db.posts.delete({ where: { id } });

  revalidatePath('/blog');  // clear cached blog list
  revalidateTag('posts');   // clear any tagged caches
}

// Update action with form data
export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  const name  = formData.get('name') as string;
  const bio   = formData.get('bio') as string;

  await db.users.update({
    where: { id: session.user.id },
    data: { name, bio },
  });

  revalidatePath('/profile');
}

// Client component calls Server Action directly
'use client';
import { deletePost } from '@/lib/actions';

function DeleteButton({ postId }: { postId: string }) {
  return (
    <button onClick={() => deletePost(postId)}>
      Delete Post
    </button>
  );
}`}
        </pre>
      )}

      {tab === "formstate" && (
        <pre style={{ margin:0, background:"#030408", border:`1px solid ${t.accentBorder}`, borderRadius:10, padding:"14px 16px", fontFamily:"monospace", fontSize:"0.75rem", color:t.accent, lineHeight:1.8, overflowX:"auto" }}>{
`// useActionState + useFormStatus — Next.js 14+

// Server Action — returns state
async function loginAction(prevState: any, formData: FormData) {
  'use server';

  const email    = formData.get('email') as string;
  const password = formData.get('password') as string;

  const result = await signIn(email, password);

  if (!result.success) {
    return { error: result.message };  // returned to client
  }

  redirect('/dashboard');
}

// Client Component with form state
'use client';
import { loginAction } from '@/lib/actions';

function SubmitButton() {
  const { pending } = useFormStatus(); // auto-detects form submission
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Signing in…' : 'Sign In'}
    </button>
  );
}

function LoginForm() {
  const [state, action] = useActionState(loginAction, null);

  return (
    <form action={action}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      {state?.error && <p className="error">{state.error}</p>}
      <SubmitButton />  {/* knows when form is pending! */}
    </form>
  );
}`}
        </pre>
      )}
    </div>
  );
}

/* ══ DEMO 10 — API Routes ════════════════════════════ */
function ApiRoutesDemo({ t }) {
  const [method, setMethod] = useState("GET");
  const [path3, setPath3] = useState("/api/users");
  const [respData, setRespData] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("client");

  const mockRoutes = {
    "GET /api/users":       { status:200, data:{ users:[{id:1,name:"Alice"},{id:2,name:"Bob"}] } },
    "GET /api/users/1":     { status:200, data:{ id:1, name:"Alice", email:"alice@dev.io" } },
    "POST /api/users":      { status:201, data:{ id:3, name:"New User", message:"Created" } },
    "DELETE /api/users/1":  { status:204, data:null },
    "GET /api/health":      { status:200, data:{ status:"ok", version:"1.0.0" } },
    "GET /api/notfound":    { status:404, data:{ error:"Not Found" } },
  };

  const send = () => {
    setLoading(true);
    setTimeout(() => {
      const key = method + " " + path3;
      const r = mockRoutes[key] || { status:404, data:{ error:"Route not found" } };
      setStatus(r.status); setRespData(r.data); setLoading(false);
    }, 500);
  };

  const mc = { GET:t.success, POST:t.cyan, PUT:t.warn, PATCH:t.orange, DELETE:t.danger };
  const sc = (s) => !s?t.muted:s<300?t.success:s<400?t.cyan:s<500?t.warn:t.danger;

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>API Routes — Route Handlers in App Router</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["Live Client","client"],["Route Setup","setup"],["Patterns","patterns"]].map(([l,v]) => (
          <button key={v} onClick={() => setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>

      {tab === "client" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 200px" }}>
            <div style={{ display:"flex", gap:5, marginBottom:8 }}>
              {["GET","POST","PUT","DELETE"].map(m => (
                <button key={m} onClick={() => setMethod(m)} style={{ flex:1, background:method===m?`${mc[m]}30`:t.surface, color:mc[m], border:`2px solid ${method===m?mc[m]:t.border}`, borderRadius:6, padding:"5px 0", cursor:"pointer", fontWeight:700, fontSize:"0.72rem" }}>{m}</button>
              ))}
            </div>
            <div style={{ display:"flex", gap:6, marginBottom:8 }}>
              <input value={path3} onChange={e=>setPath3(e.target.value)} style={{ flex:1, padding:"7px 10px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, fontSize:"0.82rem", outline:"none", fontFamily:"monospace" }}/>
              <button onClick={send} disabled={loading} style={{ background:t.accent, border:"none", borderRadius:7, padding:"7px 16px", color:"#fff", fontWeight:800, cursor:"pointer" }}>Send</button>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
              {Object.keys(mockRoutes).map(r => (
                <button key={r} onClick={() => { const [m,...p]=r.split(" "); setMethod(m); setPath3(p.join(" ")); setStatus(null); }} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:20, padding:"2px 8px", cursor:"pointer", fontSize:"0.68rem", color:t.muted, fontFamily:"monospace" }}>{r}</button>
              ))}
            </div>
            {loading && <div style={{ color:t.muted, textAlign:"center", padding:"16px" }}>⏳ Fetching…</div>}
            {status && !loading && (
              <div style={{ background:"#030408", border:`1px solid ${t.border}`, borderRadius:10, overflow:"hidden" }}>
                <div style={{ padding:"8px 12px", borderBottom:`1px solid ${t.border}`, display:"flex", gap:10 }}>
                  <span style={{ color:sc(status), fontWeight:900, fontFamily:"monospace", fontSize:"0.95rem" }}>{status}</span>
                </div>
                <div style={{ padding:"8px 12px" }}>
                  {respData !== null
                    ? <pre style={{ margin:0, color:t.accent, fontFamily:"monospace", fontSize:"0.74rem", lineHeight:1.7 }}>{JSON.stringify(respData, null, 2)}</pre>
                    : <div style={{ color:t.muted, fontStyle:"italic", fontSize:"0.78rem" }}>No body (204)</div>}
                </div>
              </div>
            )}
          </div>
          <div style={{ flex:"1 1 220px" }}>
            <pre style={{ margin:0, background:"#030408", border:`1px solid ${t.accentBorder}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:t.accent, lineHeight:1.8 }}>{
`// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET /api/users
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = searchParams.get('limit') ?? '10';

  const users = await db.users.findMany({
    take: parseInt(limit),
  });

  return NextResponse.json({ users });
}

// POST /api/users
export async function POST(request: NextRequest) {
  const body = await request.json();

  const user = await db.users.create({ data: body });

  return NextResponse.json(user, { status: 201 });
}

// app/api/users/[id]/route.ts
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await db.users.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}`}
            </pre>
          </div>
        </div>
      )}

      {tab === "setup" && (
        <pre style={{ margin:0, background:"#030408", border:`1px solid ${t.accentBorder}`, borderRadius:10, padding:"14px 16px", fontFamily:"monospace", fontSize:"0.75rem", color:t.accent, lineHeight:1.8, overflowX:"auto" }}>{
`// File structure for API routes in App Router:
// app/api/users/route.ts        → /api/users
// app/api/users/[id]/route.ts   → /api/users/:id
// app/api/auth/[...nextauth]/route.ts → /api/auth/*

// Response helpers
import { NextResponse } from 'next/server';

// JSON response
return NextResponse.json({ data }, { status: 200 });

// Plain text / HTML
return new Response('Hello', {
  status: 200,
  headers: { 'Content-Type': 'text/plain' },
});

// Redirect
return NextResponse.redirect(new URL('/login', request.url));

// Reading request data
const body    = await request.json();
const text    = await request.text();
const form    = await request.formData();
const cookies = request.cookies;
const headers = request.headers;
const ip      = request.ip ?? request.headers.get('x-forwarded-for');

// CORS headers
return NextResponse.json(data, {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST',
  },
});

// Streaming response
const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('Hello ');
    controller.enqueue('World');
    controller.close();
  },
});
return new Response(stream);`}
        </pre>
      )}

      {tab === "patterns" && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {[
            ["Webhook endpoint","Validate signature, process event, return 200 fast",t.accent],
            ["File upload","Use FormData, stream to storage (S3, Cloudinary)",t.cyan],
            ["Auth callbacks","OAuth callbacks, session tokens — use NextAuth.js",t.purple],
            ["Revalidation API","Receive CMS webhook, call revalidateTag()",t.warn],
            ["Edge API","Add 'export const runtime = edge' for Vercel Edge",t.orange],
            ["SSE streaming","Return ReadableStream for real-time server-sent events",t.pink],
          ].map(([h,d,c]) => (
            <div key={h} style={{ flex:"1 1 180px", background:`${c}12`, border:`1px solid ${c}30`, borderRadius:9, padding:"10px 12px" }}>
              <div style={{ color:c, fontWeight:700, fontSize:"0.78rem", marginBottom:4 }}>{h}</div>
              <div style={{ color:t.muted, fontSize:"0.72rem", lineHeight:1.5 }}>{d}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══ DEMO 11 — Image & Font Optimization ══════════════ */
function ImageFontDemo({ t }) {
  const [imgW, setImgW] = useState(400);
  const [imgH, setImgH] = useState(300);
  const [quality, setQuality] = useState(80);
  const [tab, setTab] = useState("image");

  const imageSizes = [
    { label:"Small (sm)",  breakpoint:"640px",  size:"100vw" },
    { label:"Medium (md)", breakpoint:"768px",  size:"50vw" },
    { label:"Large (lg)",  breakpoint:"1024px", size:"33vw" },
    { label:"Default",     breakpoint:"",       size:"25vw" },
  ];

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Image & Font Optimization — next/image, next/font</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["next/image","image"],["next/font","font"],["Metadata","metadata"]].map(([l,v]) => (
          <button key={v} onClick={() => setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>

      {tab === "image" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            <div style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, marginBottom:8 }}>Configure image:</div>
            {[["Width (px)",imgW,setImgW,100,1200],["Height (px)",imgH,setImgH,100,800],["Quality (%)",quality,setQuality,1,100]].map(([l,val,set,min,max]) => (
              <div key={String(l)} style={{ marginBottom:10 }}>
                <label style={{ display:"flex", justifyContent:"space-between", color:t.muted, fontSize:"0.72rem", marginBottom:3 }}>
                  <span>{l}</span><strong style={{ color:t.accent }}>{val}</strong>
                </label>
                <input type="range" min={min} max={max} value={val} onChange={e=>set(+e.target.value)} style={{ width:"100%", accentColor:t.accent }}/>
              </div>
            ))}
            <div style={{ background:`${t.success}12`, border:`1px solid ${t.success}30`, borderRadius:8, padding:"8px 12px", marginTop:6 }}>
              <div style={{ color:t.success, fontWeight:700, fontSize:"0.75rem", marginBottom:4 }}>Auto optimizations:</div>
              {["WebP/AVIF conversion","Lazy loading by default","Prevents layout shift (CLS)","Responsive srcset generated","Blur placeholder support","Priority loading option"].map(f => (
                <div key={f} style={{ color:t.muted, fontSize:"0.71rem", marginBottom:2 }}>✓ {f}</div>
              ))}
            </div>
          </div>
          <div style={{ flex:"1 1 220px" }}>
            <div style={{ background:"#030408", border:`1px solid ${t.accentBorder}`, borderRadius:9, padding:"8px 12px", marginBottom:8 }}>
              <div style={{ color:t.muted, fontSize:"0.68rem", fontWeight:700, marginBottom:4 }}>GENERATED TAG:</div>
              <code style={{ color:t.accent, fontSize:"0.72rem", wordBreak:"break-all" }}>{`<Image src="/hero.jpg" width={${imgW}} height={${imgH}} quality={${quality}} alt="Hero" />`}</code>
            </div>
            <pre style={{ margin:0, background:"#030408", border:`1px solid ${t.accentBorder}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:t.accent, lineHeight:1.8, overflow:"auto", maxHeight:260 }}>{
`import Image from 'next/image';

// Local image (auto width/height from import!)
import hero from '@/public/hero.jpg';
<Image src={hero} alt="Hero" placeholder="blur" />

// Remote image (width/height required)
<Image
  src="https://cdn.example.com/photo.jpg"
  width={${imgW}}
  height={${imgH}}
  quality={${quality}}
  alt="Photo"
  priority      // load eagerly (above fold)
/>

// Fill parent container (responsive)
<div style={{ position: 'relative', height: '300px' }}>
  <Image
    src="/cover.jpg"
    alt="Cover"
    fill
    sizes="(max-width: 768px) 100vw, 50vw"
    className="object-cover"
  />
</div>

// next.config.js — allow external domains
module.exports = {
  images: {
    remotePatterns: [
      { hostname: 'cdn.example.com' },
      { hostname: 'images.unsplash.com' },
    ],
  },
};`}
            </pre>
          </div>
        </div>
      )}

      {tab === "font" && (
        <pre style={{ margin:0, background:"#030408", border:`1px solid ${t.accentBorder}`, borderRadius:10, padding:"14px 16px", fontFamily:"monospace", fontSize:"0.75rem", color:t.accent, lineHeight:1.8, overflowX:"auto" }}>{
`// app/layout.tsx — next/font automatic optimization
// - Zero layout shift (font-display: swap)
// - Self-hosted (no request to Google at runtime)
// - CSS variable injection

import { Inter, Fira_Code, Playfair_Display } from 'next/font/google';
import localFont from 'next/font/local';

// Google Font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Monospace font
const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-mono',
});

// Local font
const myFont = localFont({
  src: './fonts/MyFont.woff2',
  variable: '--font-custom',
});

function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={[inter.variable, firaCode.variable, myFont.variable].join(' ')}
    >
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

// Use CSS variable in Tailwind
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
};`}
        </pre>
      )}

      {tab === "metadata" && (
        <pre style={{ margin:0, background:"#030408", border:`1px solid ${t.accentBorder}`, borderRadius:10, padding:"14px 16px", fontFamily:"monospace", fontSize:"0.75rem", color:t.accent, lineHeight:1.8, overflowX:"auto" }}>{
`// app/layout.tsx — Static metadata
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | My App',  // 'Blog | My App', 'About | My App'
    default:  'My App',
  },
  description: 'The best Next.js app ever built',
  openGraph: {
    title:       'My App',
    description: 'The best Next.js app',
    images:      [{ url: '/og-image.png', width: 1200, height: 630 }],
    type:        'website',
  },
  twitter: {
    card:    'summary_large_image',
    title:   'My App',
    images:  ['/og-image.png'],
  },
  robots: { index: true, follow: true },
  canonical: 'https://myapp.com',
};

// app/blog/[slug]/page.tsx — Dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPost(params.slug);

  return {
    title:       post.title,           // 'My Post | My App'
    description: post.excerpt,
    openGraph: {
      title:  post.title,
      images: [post.coverImage],
    },
  };
}`}
        </pre>
      )}
    </div>
  );
}
/* ══ DEMO 12 — Authentication (NextAuth.js) ══════════ */
function AuthDemo({ t }) {
  const [tab, setTab] = useState("setup");
  const [email, setEmail] = useState("alice@dev.io");
  const [password, setPassword] = useState("Password123!");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  const doLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoggedIn(true);
      setSession({ user:{ name:"Alice", email, image:null, id:"usr_123", role:"user" }, expires: new Date(Date.now()+7*86400000).toISOString() });
      setLoading(false);
    }, 800);
  };

  const doLogout = () => { setLoggedIn(false); setSession(null); };

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Authentication — NextAuth.js v5 (Auth.js)</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["Setup","setup"],["Providers","providers"],["Session Demo","demo"]].map(([l,v]) => (
          <button key={v} onClick={() => setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>

      {tab === "setup" && (
        <pre style={{ margin:0, background:"#030408", border:`1px solid ${t.accentBorder}`, borderRadius:10, padding:"14px 16px", fontFamily:"monospace", fontSize:"0.74rem", color:t.accent, lineHeight:1.8, overflowX:"auto" }}>{
`// auth.ts — root of project
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId:     process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user || !user.password) return null;
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );
        return valid ? user : null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      session.user.id   = token.sub!;
      session.user.role = token.role;
      return session;
    },
  },
  session: { strategy: 'jwt' },
  pages: { signIn: '/login', error: '/auth/error' },
});

// app/api/auth/[...nextauth]/route.ts
export { handlers as GET, handlers as POST } from '@/auth';`}
        </pre>
      )}

      {tab === "providers" && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {[
            { name:"GitHub",      icon:"🐙", color:"#c084fc", note:"OAuth 2.0 — clientId + clientSecret from GitHub Apps" },
            { name:"Google",      icon:"🔵", color:"#38bdf8", note:"OAuth 2.0 — credentials from Google Cloud Console" },
            { name:"Discord",     icon:"💜", color:"#818cf8", note:"OAuth 2.0 — popular for developer communities" },
            { name:"Credentials", icon:"🔑", color:"#fbbf24", note:"Email/password — implement your own authorize() logic" },
            { name:"Email (Magic Link)", icon:"📧", color:"#34d399", note:"Passwordless — sends sign-in link via email (Sendgrid, Resend)" },
            { name:"Twitter/X",   icon:"🐦", color:"#22d3ee", note:"OAuth 1.0a — requires callback URL setup" },
            { name:"Apple",       icon:"🍎", color:t.text,    note:"Sign in with Apple — required for iOS apps" },
            { name:"LDAP/SAML",   icon:"🏢", color:"#fb923c", note:"Enterprise SSO — use next-auth-ldap or saml adapters" },
          ].map(p => (
            <div key={p.name} style={{ flex:"1 1 180px", background:`${p.color}12`, border:`1px solid ${p.color}30`, borderRadius:9, padding:"10px 12px" }}>
              <div style={{ fontSize:"1.2rem", marginBottom:4 }}>{p.icon}</div>
              <div style={{ color:p.color, fontWeight:700, fontSize:"0.8rem", marginBottom:3 }}>{p.name}</div>
              <div style={{ color:t.muted, fontSize:"0.72rem", lineHeight:1.5 }}>{p.note}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "demo" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            {!loggedIn ? (
              <div>
                <div style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, marginBottom:8 }}>Simulated sign-in:</div>
                {[["Email","email",email,setEmail],["Password","password",password,setPassword]].map(([l,type,val,set]) => (
                  <div key={l} style={{ marginBottom:8 }}>
                    <label style={{ display:"block", fontSize:"0.72rem", color:t.muted, marginBottom:2 }}>{l}:</label>
                    <input type={type} value={val} onChange={e=>set(e.target.value)} style={{ width:"100%", boxSizing:"border-box", padding:"6px 10px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, fontSize:"0.82rem", outline:"none" }}/>
                  </div>
                ))}
                <button onClick={doLogin} disabled={loading} style={{ width:"100%", background:`linear-gradient(135deg,${t.accent},#4338ca)`, border:"none", borderRadius:8, padding:"9px", color:"#fff", fontWeight:800, cursor:"pointer", opacity:loading?.6:1 }}>
                  {loading ? "⏳ Signing in…" : "▶ Sign In"}
                </button>
              </div>
            ) : (
              <div>
                <div style={{ background:t.accentBg, border:`1px solid ${t.accentBorder}`, borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
                  <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${t.accent},${t.purple})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:"1rem", marginBottom:8 }}>
                    {session.user.name[0]}
                  </div>
                  <div style={{ color:t.text, fontWeight:700 }}>{session.user.name}</div>
                  <div style={{ color:t.muted, fontSize:"0.75rem" }}>{session.user.email}</div>
                  <div style={{ color:t.muted, fontSize:"0.72rem", marginTop:4 }}>ID: {session.user.id}</div>
                </div>
                <button onClick={doLogout} style={{ width:"100%", background:t.surface, border:`1px solid ${t.danger}40`, color:t.danger, borderRadius:8, padding:"8px", cursor:"pointer", fontWeight:700 }}>Sign Out</button>
              </div>
            )}
          </div>
          <div style={{ flex:"1 1 220px" }}>
            <pre style={{ margin:0, background:"#030408", border:`1px solid ${t.accentBorder}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.72rem", color:t.accent, lineHeight:1.8, overflow:"auto", maxHeight:280 }}>{
`// Server Component — get session
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

async function ProfilePage() {
  const session = await auth();

  if (!session) redirect('/login');

  return (
    <div>
      <h1>Hello, {session.user.name}</h1>
      <p>{session.user.email}</p>
    </div>
  );
}

// Client Component — get session
'use client';

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <Spinner />;

  if (session) return (
    <div>
      <p>Hello, {session.user.name}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );

  return (
    <button onClick={() => signIn('github')}>
      Sign in with GitHub
    </button>
  );
}

// Protect with middleware (fastest — at Edge!)
// middleware.ts
export { auth as middleware } from '@/auth';
export const config = { matcher: ['/dashboard(.*)'] };`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══ DEMO 13 — Styling (CSS Modules + Tailwind) ════════ */
function StylingDemo({ t }) {
  const [tab, setTab] = useState("tailwind");
  const [variant, setVariant] = useState("primary");
  const [size, setSize] = useState("md");
  const [rounded, setRounded] = useState("lg");

  const variants = {
    primary:   { bg:"#818cf8", text:"#fff",   border:"#818cf8", hover:"#6366f1" },
    secondary: { bg:"transparent", text:"#818cf8", border:"#818cf8", hover:"#818cf810" },
    danger:    { bg:"#f87171", text:"#fff",   border:"#f87171", hover:"#ef4444" },
    ghost:     { bg:"transparent", text:"#818cf8", border:"transparent", hover:"#818cf815" },
  };
  const sizes   = { sm:{ padding:"6px 12px",  fontSize:"0.75rem" }, md:{ padding:"9px 20px",  fontSize:"0.9rem" }, lg:{ padding:"12px 28px", fontSize:"1rem" } };
  const radii   = { none:"0px", sm:"4px", lg:"8px", full:"999px" };
  const curV    = variants[variant];
  const curS    = sizes[size];

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Styling — CSS Modules, Tailwind CSS, CSS-in-JS</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["Tailwind CSS","tailwind"],["CSS Modules","cssmod"],["Global CSS","global"]].map(([l,v]) => (
          <button key={v} onClick={() => setTab(v)} style={{ background:tab===v?t.accentBg:t.surface, color:tab===v?t.accent:t.muted, border:`1px solid ${tab===v?t.accentBorder:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{l}</button>
        ))}
      </div>

      {tab === "tailwind" && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 180px" }}>
            <div style={{ color:t.muted, fontSize:"0.72rem", fontWeight:700, marginBottom:8 }}>Button playground:</div>
            {[["Variant",["primary","secondary","danger","ghost"],variant,setVariant],["Size",["sm","md","lg"],size,setSize],["Rounded",["none","sm","lg","full"],rounded,setRounded]].map(([label,options,val,set]) => (
              <div key={String(label)} style={{ marginBottom:10 }}>
                <div style={{ color:t.muted, fontSize:"0.71rem", marginBottom:4 }}>{label}:</div>
                <div style={{ display:"flex", gap:4 }}>
                  {options.map(o => (
                    <button key={o} onClick={() => set(o)} style={{ flex:1, background:val===o?t.accentBg:t.surface, color:val===o?t.accent:t.muted, border:`1px solid ${val===o?t.accentBorder:t.border}`, borderRadius:5, padding:"4px 0", cursor:"pointer", fontSize:"0.72rem", fontWeight:val===o?700:400 }}>{o}</button>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ marginTop:10, padding:"16px", background:t.surface, borderRadius:10, border:`1px solid ${t.border}`, textAlign:"center" }}>
              <button style={{ background:curV.bg, color:curV.text, border:`2px solid ${curV.border}`, borderRadius:radii[rounded], padding:curS.padding, fontSize:curS.fontSize, cursor:"pointer", fontWeight:700, transition:"all .2s" }}>
                Click Me
              </button>
            </div>
            <div style={{ marginTop:8, background:"#030408", border:`1px solid ${t.border}`, borderRadius:8, padding:"8px 10px" }}>
              <code style={{ color:t.accent, fontSize:"0.68rem", wordBreak:"break-all" }}>
                {`<button className="bg-indigo-400 text-white ${size==="lg"?"px-7 py-3":size==="sm"?"px-3 py-1.5":"px-5 py-2.5"} rounded-${rounded} font-bold hover:bg-indigo-500 transition-colors">`}
              </code>
            </div>
          </div>
          <div style={{ flex:"1 1 220px" }}>
            <pre style={{ margin:0, background:"#030408", border:`1px solid ${t.accentBorder}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:t.accent, lineHeight:1.8, overflow:"auto", maxHeight:320 }}>{
`// Install: npm install -D tailwindcss postcss autoprefixer
// npx tailwindcss init -p

// tailwind.config.ts
import type { Config } from 'tailwindcss';

{
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          500: '#818cf8',
          900: '#1e1b4b',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
} satisfies Config;

// app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom component classes */
@layer components {
  .btn-primary {
    @apply bg-indigo-500 text-white font-bold
           px-5 py-2 rounded-lg hover:bg-indigo-600
           transition-colors disabled:opacity-50;
  }
}

// Use in components
<button className="btn-primary">Submit</button>`}
            </pre>
          </div>
        </div>
      )}

      {tab === "cssmod" && (
        <pre style={{ margin:0, background:"#030408", border:`1px solid ${t.accentBorder}`, borderRadius:10, padding:"14px 16px", fontFamily:"monospace", fontSize:"0.75rem", color:t.accent, lineHeight:1.8, overflowX:"auto" }}>{
`// components/Card/Card.module.css
/* Class names are auto-scoped — no conflicts! */

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.tag {
  composes: badge from './badge.module.css'; /* compose!  */
  background: var(--accent-bg);
  color: var(--accent);
}

/* Responsive */
@media (max-width: 640px) {
  .card { padding: 14px; }
}

// components/Card/Card.tsx
import styles from './Card.module.css';

export function Card({ title, tags }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      {tags.map(tag => (
        <span key={tag} className={styles.tag}>{tag}</span>
      ))}
    </div>
  );
}

// Generated class names are unique: 'Card_card__x7Kp2'
// → No CSS collisions ever!`}
        </pre>
      )}

      {tab === "global" && (
        <pre style={{ margin:0, background:"#030408", border:`1px solid ${t.accentBorder}`, borderRadius:10, padding:"14px 16px", fontFamily:"monospace", fontSize:"0.75rem", color:t.accent, lineHeight:1.8, overflowX:"auto" }}>{
`// app/globals.css — imported ONCE in app/layout.tsx
/* CSS custom properties — design tokens */

:root {
  --bg:           #04050f;
  --surface:      #0b0d20;
  --border:       #181c3a;
  --text:         #dde4ff;
  --muted:        #454d80;
  --accent:       #818cf8;
  --radius:       8px;
}

[data-theme='light'] {
  --bg:           #f3f4ff;
  --surface:      #ffffff;
  --border:       #c5c9f0;
  --text:         #060820;
}

/* Typography reset */
*, *::before, *::after { box-sizing: border-box; }
body {
  font-family: var(--font-sans);
  color: var(--text);
  background: var(--bg);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* Useful utilities */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

// app/layout.tsx — import once
import './globals.css';

// Theme toggle (Server Component approach)
// Store in cookie, read in layout, set data-theme
async function RootLayout({ children }) {
  const theme = cookies().get('theme')?.value ?? 'dark';
  return (
    <html lang="en" data-theme={theme}>
      <body>{children}</body>
    </html>
  );
}`}
        </pre>
      )}
    </div>
  );
}

/* ══ DEMO 14 — Environment Variables ═════════════════ */
function EnvDemo({ t }) {
  const [env2, setEnv2] = useState("development");
  const [show, setShow] = useState(false);

  const envs = {
    development: { color:t.success, vars:{ NODE_ENV:"development", NEXTAUTH_URL:"http://localhost:3000", NEXTAUTH_SECRET:"dev_secret_here", DATABASE_URL:"postgresql://postgres:pass@localhost:5432/myapp_dev", NEXT_PUBLIC_APP_URL:"http://localhost:3000", GITHUB_ID:"your_github_client_id" } },
    production:  { color:t.danger,  vars:{ NODE_ENV:"production",  NEXTAUTH_URL:"https://myapp.com",       NEXTAUTH_SECRET:"STRONG_SECRET_HIDDEN", DATABASE_URL:"postgresql://user:HIDDEN@prod-db/myapp", NEXT_PUBLIC_APP_URL:"https://myapp.com", GITHUB_ID:"prod_github_client_id" } },
  };

  const curEnv = envs[env2];

  const mask = (k, v) => {
    if (show) return v;
    if (k.includes("SECRET") || k.includes("DATABASE_URL")) return v.replace(/\/\/[^@]+@/,"//***:***@").replace("dev_secret_here","***").replace("STRONG_SECRET_HIDDEN","***").replace("HIDDEN","***");
    return v;
  };

  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Environment Variables — NEXT_PUBLIC_, .env files</p>
      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
        {Object.keys(envs).map(e => (
          <button key={e} onClick={() => setEnv2(e)} style={{ background:env2===e?`${envs[e].color}30`:t.surface, color:envs[e].color, border:`2px solid ${env2===e?envs[e].color:t.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.8rem" }}>{e}</button>
        ))}
        <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", fontSize:"0.78rem", color:t.muted, marginLeft:"auto" }}>
          <input type="checkbox" checked={show} onChange={e=>setShow(e.target.checked)} style={{ accentColor:t.accent }}/> Show secrets
        </label>
      </div>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        <div style={{ flex:"1 1 220px" }}>
          <div style={{ background:"#030408", border:`1px solid ${curEnv.color}40`, borderRadius:10, overflow:"hidden", marginBottom:10 }}>
            <div style={{ padding:"6px 12px", background:`${curEnv.color}15`, borderBottom:`1px solid ${curEnv.color}30`, color:curEnv.color, fontSize:"0.72rem", fontWeight:700 }}>.env.{env2}</div>
            <div style={{ padding:"10px 12px" }}>
              {Object.entries(curEnv.vars).map(([k,v]) => (
                <div key={k} style={{ display:"flex", gap:6, marginBottom:4, fontFamily:"monospace", fontSize:"0.72rem", flexWrap:"wrap" }}>
                  <span style={{ color:k.startsWith("NEXT_PUBLIC")?t.cyan:t.info }}>{k}</span>
                  <span style={{ color:t.muted }}>=</span>
                  <span style={{ color:k.includes("SECRET")||k.includes("DATABASE")?t.danger:t.success }}>{mask(k,v)}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background:`${t.danger}12`, border:`1px solid ${t.danger}35`, borderRadius:8, padding:"8px 12px" }}>
            <div style={{ color:t.danger, fontWeight:700, fontSize:"0.78rem" }}>⚠ Never commit .env* to Git!</div>
            <div style={{ color:t.muted, fontSize:"0.72rem", marginTop:2 }}>Add .env*.local to .gitignore. Use .env.example with placeholder values.</div>
          </div>
        </div>
        <div style={{ flex:"1 1 220px" }}>
          <pre style={{ margin:0, background:"#030408", border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", fontFamily:"monospace", fontSize:"0.72rem", color:"#c5ceff", lineHeight:1.8, overflow:"auto", maxHeight:320 }}>{
`// Next.js env file hierarchy (loaded in order):
// .env                 → all environments
// .env.local           → overrides, not committed
// .env.development     → dev only
// .env.production      → prod only
// .env.development.local → local dev overrides
// .env.test            → test env only

// RULES:
// NEXT_PUBLIC_* → sent to the browser (public)
// Everything else → server-only (safe for secrets)

// .env.example (DO commit this!)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl
DATABASE_URL=postgresql://user:pass@localhost/db
NEXT_PUBLIC_APP_URL=http://localhost:3000
GITHUB_ID=your_client_id
GITHUB_SECRET=your_client_secret

// Generate a strong NEXTAUTH_SECRET:
// openssl rand -base64 32

// Access in code:
// Server Component / API Route / Server Action
const secret = process.env.NEXTAUTH_SECRET;
const dbUrl  = process.env.DATABASE_URL;

// Client Component (ONLY NEXT_PUBLIC_ vars!)
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
// process.env.DATABASE_URL → undefined in browser!

// Validate at startup (recommended)
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ══ DEMO 15 — Performance & Optimization ════════════ */
function PerformanceDemo({ t }) {
  const [sel, setSel] = useState(0);

  const tips = [
    { icon:"📦", title:"Code Splitting & Lazy Loading", color:t.accent,
      good:
`// Dynamic import — only loads when needed
import dynamic from 'next/dynamic';

// Heavy component — loads on demand
const HeavyChart = dynamic(
  () => import('@/components/HeavyChart'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,  // disable SSR for browser-only libs
  }
);

// Only loads when modal opens
const RichTextEditor = dynamic(
  () => import('@/components/Editor'),
  { ssr: false }
);

function Dashboard() {
  const [showChart, setShowChart] = useState(false);
  return (
    <div>
      <button onClick={() => setShowChart(true)}>
        Load Chart
      </button>
      {showChart && <HeavyChart />}
    </div>
  );
}`,
      bad:
`// Loading ALL components upfront regardless
import HeavyChart from '@/components/HeavyChart';   // 500KB
import RichTextEditor from '@/components/Editor';    // 800KB
import VideoPlayer from '@/components/VideoPlayer';  // 1.2MB

// All of these are in the initial JS bundle!
// User downloads 2.5MB before seeing anything`
    },
    { icon:"🖥️", title:"Server Components reduce bundle",  color:t.purple,
      good:
`// Server Component — ZERO JS sent to client
// This entire component runs on server only!
import { db } from '@/lib/db';
import { formatDate } from 'date-fns'; // stays on server!

async function BlogList() {
  // Direct DB query — no API, no client JS
  const posts = await db.posts.findMany({
    select: { id:true, title:true, publishedAt:true },
    orderBy: { publishedAt: 'desc' },
    take: 10,
  });

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          {post.title} — {formatDate(post.publishedAt)}
        </li>
      ))}
    </ul>
  );
}
// date-fns, db client — none of this goes to browser`,
      bad:
`'use client';
// Using Client Component for static data list
// Sends React hooks + date-fns to browser
import { formatDate } from 'date-fns'; // sent to client!

function BlogList() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch('/api/posts').then(r=>r.json()).then(setPosts);
  }, []); // Extra network request + loading state needed!
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}`
    },
    { icon:"🔄", title:"Suspense + Streaming",            color:t.cyan,
      good:
`// Parallel data with Streaming — fast TTFB

// Each section streams independently!
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Shows instantly */}
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />   {/* streams when ready */}
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart />  {/* streams when ready */}
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <RecentOrders />  {/* streams when ready */}
      </Suspense>
    </div>
  );
}
// Users see the page shell instantly
// Each section appears as its data arrives`,
      bad:
`// No Suspense — entire page waits for slowest query
async function Dashboard() {
  // These run sequentially in a waterfall
  const stats  = await getStats();   // 200ms
  const chart  = await getChart();   // 400ms
  const orders = await getOrders();  // 300ms
  // Page takes 900ms to show ANYTHING!
  return <div>...</div>;
}`
    },
    { icon:"💾", title:"Proper Caching Strategy",         color:t.warn,
      good:
`// Tag-based caching — precise invalidation
async function getProducts(category: string) {
  const res = await fetch('/api/products?cat=' + category, {
    next: {
      revalidate: 3600,          // revalidate hourly
      tags: ['products', 'products-' + category],
    },
  });
  return res.json();
}

// Or use React cache() for request deduplication

export const getUser = cache(async (id: string) => {
  return db.users.findUnique({ where: { id } });
});
// Called 5x in different components = 1 DB query!

// Precise invalidation
async function updateProduct(id: string, data: any) {
  'use server';
  await db.products.update({ where: { id }, data });
  revalidateTag('products');  // only clears product cache
}`,
      bad:
`// Always fetching fresh — no caching
async function getProducts() {
  const res = await fetch('/api/products', {
    cache: 'no-store',  // fresh every request
  });
  return res.json();
}
// 1000 users/hour = 1000 DB queries
// With caching: maybe 1 DB query/hour!`
    },
  ];

  const tip = tips[sel];
  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Performance — lazy loading, RSC, streaming, caching</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:14 }}>
        {tips.map((tp,i) => (
          <button key={i} onClick={() => setSel(i)} style={{ background:sel===i?`${tp.color}30`:t.surface, color:sel===i?tp.color:t.muted, border:`1px solid ${sel===i?`${tp.color}60`:t.border}`, borderRadius:8, padding:"5px 12px", cursor:"pointer", fontWeight:700, fontSize:"0.78rem" }}>{tp.icon} {tp.title.split(" ").slice(0,2).join(" ")}</button>
        ))}
      </div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        {[["✅ Do This", tip.good, t.success], ["❌ Avoid", tip.bad, t.danger]].map(([label,code,col]) => (
          <div key={label} style={{ flex:"1 1 240px" }}>
            <div style={{ color:col, fontWeight:700, fontSize:"0.78rem", marginBottom:6 }}>{label}</div>
            <div style={{ position:"relative", borderRadius:9, overflow:"hidden", border:`1px solid ${col}35` }}>
              <pre style={{ margin:0, background:"#030408", padding:"10px 12px", fontFamily:"monospace", fontSize:"0.73rem", color:col===t.success?"#86efac":"#fca5a5", lineHeight:1.7, overflow:"auto", maxHeight:220 }}>{code}</pre>
              <CopyBtn code={code} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══ DEMO 16 — Deployment ════════════════════════════ */
function DeployDemo({ t }) {
  const [sel, setSel] = useState(0);

  const topics = [
    { label:"Vercel",   icon:"▲", color:t.text,
      code:
`# Deploy to Vercel — the easiest option
# Connect GitHub repo → auto-deploys on push

# Install Vercel CLI
npm install -g vercel

# Deploy from terminal
vercel                    # deploy to preview URL
vercel --prod             # deploy to production

# Environment variables
vercel env add NEXTAUTH_SECRET production
vercel env add DATABASE_URL production

# vercel.json — optional config
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "app/api/**": { "maxDuration": 30 }
  },
  "headers": [{
    "source": "/(.*)",
    "headers": [
      { "key": "X-Frame-Options", "value": "DENY" },
      { "key": "X-Content-Type-Options", "value": "nosniff" }
    ]
  }]
}

# Automatic features on Vercel:
# - Preview deployments per PR
# - Edge Network (CDN)
# - Serverless Functions
# - Edge Functions
# - Analytics & Web Vitals
# - Image Optimization CDN` },
    { label:"Docker",   icon:"🐳", color:"#38bdf8",
      code:
`# Dockerfile (multi-stage build)
FROM node:20-alpine AS base
WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package*.json ./
RUN npm ci

# Builder stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args for public env vars
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

RUN npm run build

# Runner stage — minimal image
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system nodejs && adduser --system nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]

# next.config.js — enable standalone output!
/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
};

# docker-compose.yml
services:
  app:
    build: .
    ports: ["3000:3000"]
    env_file: .env.production
    restart: unless-stopped` },
    { label:"Self-Host", icon:"🖥️", color:t.accent,
      code:
`# Self-host on VPS (Ubuntu + PM2)

# 1. Build the app
npm run build

# 2. Start with PM2
npm install -g pm2

pm2 start npm --name "nextjs-app" -- start
pm2 save
pm2 startup  # auto-start on server reboot

# ecosystem.config.js
module.exports = {
  apps: [{
    name:    'nextjs-app',
    script:  'node_modules/.bin/next',
    args:    'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    instances:  'max',
    exec_mode:  'cluster',
    max_memory_restart: '500M',
  }]
};

# 3. Nginx reverse proxy
server {
    listen 80;
    server_name myapp.com;
    return 301 https://$host$request_uri;
}
server {
    listen 443 ssl;
    server_name myapp.com;
    ssl_certificate /etc/letsencrypt/live/myapp.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/myapp.com/privkey.pem;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}` },
    { label:"CI/CD",    icon:"🔄", color:t.purple,
      code:
`# .github/workflows/deploy.yml
name: Deploy Next.js App

on:
  push:
    branches: [main]

env:
  NODE_VERSION: '20'

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
      - run: npm run lint
      - run: npm run test
      - run: npm run build
        env:
          NEXTAUTH_URL: "http://localhost:3000"
          NEXTAUTH_SECRET: "test-secret-value-here"
          DATABASE_URL: "postgresql://test:test@localhost/test"
          NEXT_PUBLIC_APP_URL: "http://localhost:3000"

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci --omit=dev
      - run: npm run build
        env:
          NEXTAUTH_SECRET: "your-production-secret"
          DATABASE_URL: "your-production-db-url"
          NEXT_PUBLIC_APP_URL: "https://myapp.com"
      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: "192.168.1.100"
          username: "ubuntu"
          key: "YOUR_SSH_PRIVATE_KEY"
          script: |
            cd /app/my-nextjs-app
            git pull origin main
            npm ci --omit=dev
            npm run build
            pm2 restart nextjs-app` },
  ];

  const tp = topics[sel];
  return (
    <div style={{ background:t.surface2, borderRadius:14, padding:20, border:`1px solid ${t.border}` }}>
      <p style={{ margin:"0 0 12px", color:t.muted, fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Deployment — Vercel, Docker, self-hosted, CI/CD</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:14 }}>
        {topics.map((tp2,i) => (
          <button key={i} onClick={() => setSel(i)} style={{ background:sel===i?`${tp2.color}30`:t.surface, color:tp2.color === t.text ? (sel===i?t.text:t.muted) : tp2.color, border:`2px solid ${sel===i?tp2.color:t.border}`, borderRadius:8, padding:"5px 14px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>{tp2.icon} {tp2.label}</button>
        ))}
      </div>
      <div style={{ position:"relative", borderRadius:12, overflow:"hidden", border:`1px solid ${tp.color === t.text ? t.border : tp.color + "40"}` }}>
        <div style={{ background:"#030408", padding:"14px 16px", overflowX:"auto", maxHeight:380, overflowY:"auto" }}>
          <pre style={{ margin:0, fontFamily:"monospace", fontSize:"0.75rem", color:tp.color === t.text ? "#c5ceff" : tp.color, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{tp.code}</pre>
        </div>
        <CopyBtn code={tp.code} />
      </div>
    </div>
  );
}

/* ══ SECTIONS ════════════════════════════════════════ */
const SECTIONS = [
  { id:"intro",    icon:"▲",  title:"What is Next.js?",          subtitle:"App Router, React framework, full-stack capabilities, SSR/SSG/ISR",
    Demo:IntroDemo,
    body:"Next.js is a React framework built by Vercel that adds server-side rendering, file-based routing, API routes, and production optimizations on top of React. The App Router (introduced in Next.js 13, stable in 13.4) is the modern approach — it uses React Server Components, nested layouts, and server-first data fetching. Next.js handles bundling, routing, image optimization, and deployment out of the box.",
    code:
`# Create a new Next.js project
npx create-next-app@latest my-app
# Options: TypeScript ✓, ESLint ✓, Tailwind ✓, App Router ✓

# Project structure
my-app/
├── app/                  # App Router (pages, layouts, APIs)
│   ├── layout.tsx        # Root layout — wraps everything
│   ├── page.tsx          # Home page → /
│   └── globals.css       # Global styles
├── components/           # Shared React components
├── lib/                  # Utilities, DB client, auth
├── public/               # Static files (images, favicon)
├── next.config.js        # Next.js configuration
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript config
└── package.json

# Run development server
npm run dev               # http://localhost:3000

# Build and start
npm run build             # Production build
npm start                 # Start production server

# Next.js rendering modes:
# SSG  - Static Site Generation (build time)
# SSR  - Server Side Rendering (each request)
# ISR  - Incremental Static Regeneration (hybrid)
# CSR  - Client Side Rendering (browser)`,
    tip:"Always use the App Router for new projects — it's the future of Next.js. Only use Pages Router if maintaining a legacy codebase. App Router provides much better performance through React Server Components." },

  { id:"routing",  icon:"📁", title:"File-based Routing",         subtitle:"app/ folder structure, special files, route segments, nested routes",
    Demo:RoutingDemo,
    body:"In the App Router, your folder structure IS your URL structure. Every folder in app/ becomes a route segment, and a page.tsx file makes that segment publicly accessible. Special files like layout.tsx, loading.tsx, error.tsx, and not-found.tsx add behavior to route segments automatically. This eliminates the need for a separate routing library.",
    code:
`// Route segment conventions:
// Folder name     → URL segment
// [param]         → dynamic segment
// [...catchAll]   → catch-all segment
// [[...optional]] → optional catch-all
// (group)         → route group (no URL impact)
// @slot           → parallel route named slot
// _folder         → private folder (excluded from routing)

// Example routes:
// app/page.tsx               → /
// app/about/page.tsx         → /about
// app/blog/[slug]/page.tsx   → /blog/:slug
// app/shop/[...path]/page.tsx → /shop/*

// Route Groups — organize without affecting URL:
// app/(marketing)/home/page.tsx  → /home
// app/(app)/dashboard/page.tsx   → /dashboard

// Each can have its own layout!

// page.tsx — minimal required structure
function Page({
  params,       // dynamic route params
  searchParams, // query string ?key=value
}: {
  params:       { slug: string };
  searchParams: { [key: string]: string | undefined };
}) {
  return <main>Content</main>;
}`,
    tip:"Use route groups () to apply different layouts to subsets of pages without affecting their URLs. Great for auth layouts (marketing site vs logged-in app) that share the same URL namespace." },

  { id:"components",icon:"⚛️",title:"Server vs Client Components",  subtitle:"'use client', rendering boundaries, composition patterns",
    Demo:ServerClientDemo,
    body:"By default, all components in the App Router are Server Components — they run only on the server and send zero JavaScript to the browser. Add 'use client' at the top to make a Client Component when you need interactivity. The golden rule: push Client Components as low in the tree as possible. Server Components can render Client Components, but Client Components cannot render Server Components (only import them).",
    code:
`// The composition pattern — best practice

// app/products/page.tsx — Server Component (default)
import ProductGrid from '@/components/ProductGrid';    // Server
import AddToCartButton from '@/components/AddToCart';  // Client

async function ProductsPage() {
  // Direct DB access — stays on server
  const products = await db.products.findMany();

  return (
    <div>
      {/* Server Component renders product grid */}
      <ProductGrid products={products} />

      {/* Client Component handles the interaction */}
      <AddToCartButton productId={products[0].id} />
    </div>
  );
}

// ✅ Pass server data to client components via props
// ✅ Keep async fetching in Server Components
// ✅ Only 'use client' when you need state/events

// Context providers must be Client Components
'use client';
export function ThemeProvider({ children, theme }) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}
// Wrap in layout.tsx but still serve Server Components inside!`,
    tip:"Moving 'use client' down the tree reduces bundle size. If only a button is interactive in a large page, only that button needs to be a Client Component — the rest renders on the server." },

  { id:"fetching",  icon:"🔄", title:"Data Fetching",              subtitle:"fetch cache options, revalidate, parallel fetching, on-demand ISR",
    Demo:DataFetchingDemo,
    body:"Data fetching in the App Router is dramatically simpler — just use async/await in Server Components. No more getStaticProps or getServerSideProps. The cache option on fetch() controls behavior: force-cache (like getStaticProps), no-store (like getServerSideProps), or next.revalidate for ISR. fetch() calls are automatically deduplicated within a single render.",
    code:
`// All fetch patterns in one page

// app/page.tsx
async function HomePage() {

  // Static — cached at build time (default)
  const config = await fetch('/api/config', {
    cache: 'force-cache',
  }).then(r => r.json());

  // Dynamic — fresh on every request
  const user = await fetch('/api/me', {
    cache: 'no-store',
  }).then(r => r.json());

  // ISR — revalidate every hour
  const posts = await fetch('/api/posts', {
    next: { revalidate: 3600 },
  }).then(r => r.json());

  // Tagged cache — invalidate on demand
  const products = await fetch('/api/products', {
    next: { tags: ['products'] },
  }).then(r => r.json());

  // Direct DB (no fetch needed!)
  const stats = await prisma.stats.findFirst();

  return <Dashboard {...{ config, user, posts, stats }} />;
}

// Segment-level cache control
export const dynamic    = 'force-dynamic'; // always SSR
export const revalidate = 3600;            // ISR every hour
export const fetchCache = 'force-cache';   // cache all fetches`,
    tip:"Prefer async/await directly in Server Components over React Query for server-fetched data. Reserve React Query or SWR for client-side data that needs real-time updates, optimistic updates, or polling." },

  { id:"layouts",   icon:"🏗️", title:"Layouts & Pages",            subtitle:"Nested layouts, layout.tsx, template.tsx, Suspense boundaries",
    Demo:LayoutsDemo,
    body:"Layouts are React components that wrap their child routes and persist across navigation — the layout does not re-render when navigating between child pages. This is perfect for sidebars, navigation, and shared UI. The root layout (app/layout.tsx) is required and must include html and body tags. Every route segment can have its own layout that nests inside parent layouts.",
    code:
`// app/layout.tsx — Root layout (REQUIRED)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = { title: 'My App' };

function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// app/dashboard/layout.tsx — Dashboard layout
// Wraps all /dashboard/* routes
async function DashboardLayout({ children }) {
  const session = await auth();
  if (!session) redirect('/login');

  return (
    <div className="flex h-screen">
      <Sidebar user={session.user} />
      <div className="flex-1 overflow-auto">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
}

// loading.tsx — automatic Suspense boundary!
// Shows while layout/page data loads
function Loading() {
  return <DashboardSkeleton />;
}`,
    tip:"Use loading.tsx for instant loading states — Next.js wraps your page in a Suspense boundary automatically. For granular loading, use Suspense directly around specific async components within the page." },

  { id:"dynamic",   icon:"🔀", title:"Dynamic Routes",             subtitle:"[param], [...catchAll], generateStaticParams, notFound()",
    Demo:DynamicRoutesDemo,
    body:"Dynamic route segments are folder names in square brackets like [slug] or [id]. They capture URL parts as params that your page receives. Use generateStaticParams to pre-render all known dynamic routes at build time for maximum performance. Use notFound() to trigger the nearest not-found.tsx when a resource doesn't exist.",
    code:
`// app/blog/[slug]/page.tsx

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Pre-render all blog posts at build time
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => ({ slug: post.slug }));
}

// Dynamic metadata per post
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title:       post.title,
    description: post.excerpt,
    openGraph:   { images: [post.coverImage] },
  };
}

// The page component
async function BlogPost({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug);

  // Trigger not-found.tsx
  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <PostContent content={post.content} />
    </article>
  );
}`,
    tip:"generateStaticParams + fetch with cache:'force-cache' = blazing fast static pages that are dynamically generated. This is Next.js's ISR — build statically, revalidate on demand or on a schedule." },

  { id:"navigation",icon:"🧭",title:"Navigation",                  subtitle:"Link, useRouter, usePathname, useSearchParams, redirect()",
    Demo:NavigationDemo,
    body:"Next.js provides Link for declarative client-side navigation, useRouter for programmatic navigation, and usePathname/useSearchParams for reading the current URL. Link automatically prefetches routes in the viewport for instant navigation. All navigation hooks (useRouter, usePathname, useSearchParams) require 'use client' — in Server Components, use redirect() from next/navigation.",
    code:
`// app/components/Navigation.tsx
'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const navLinks = [
  { href: '/',          label: 'Home' },
  { href: '/about',     label: 'About' },
  { href: '/blog',      label: 'Blog' },
  { href: '/dashboard', label: 'Dashboard' },
];

export function Navigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ?? '1';

  return (
    <nav>
      {navLinks.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={pathname === link.href ? 'active' : ''}
          prefetch={true}    // default — prefetch in viewport
        >
          {link.label}
        </Link>
      ))}

      {/* Link with query params */}
      <Link href={{ pathname: '/blog', query: { page: +page + 1 } }}>
        Next Page
      </Link>
    </nav>
  );
}

// Programmatic navigation (after form submit, etc.)
'use client';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const handleSuccess = () => {
    router.push('/dashboard');
    router.refresh(); // refresh server data
  };
}`,
    tip:"Wrap useSearchParams() in a Suspense boundary — it opts the component into client-side rendering. Without Suspense, your whole page might become dynamic just for reading query params." },

  { id:"middleware",icon:"🔗",title:"Middleware",                  subtitle:"Edge middleware, auth protection, redirects, request headers",
    Demo:MiddlewareDemo,
    body:"Next.js middleware runs at the Edge (before your app code) on every matching request. It's perfect for authentication checks, redirects, A/B testing, and adding response headers. Middleware runs before both Pages and API Routes, making it the ideal place to protect entire route segments. It uses the Edge Runtime — no Node.js APIs, but extremely fast.",
    code:
`// middleware.ts — place in project ROOT (next to app/)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read cookies (auth token)
  const token = request.cookies.get('auth-token')?.value;

  // Protected route: redirect if not authenticated
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Add security/custom headers to ALL responses
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Custom-Header', 'my-value');

  // Geolocation-based redirect (Vercel only)
  const country = request.geo?.country ?? 'US';
  if (country !== 'US' && pathname === '/') {
    return NextResponse.redirect(new URL('/global', request.url));
  }

  return response;
}

// IMPORTANT: Exclude static files from middleware
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|public/).*)',
  ],
};`,
    tip:"Keep middleware fast and simple — it runs on every request at the Edge. Don't do heavy DB queries here. For auth, just verify the JWT token's signature; don't fetch the user from the database." },

  { id:"actions",   icon:"⚡",title:"Server Actions",              subtitle:"'use server', form actions, mutations, useActionState, optimistic UI",
    Demo:ServerActionsDemo,
    body:"Server Actions are async functions that run on the server and can be called directly from Client Components — no API route needed. Mark with 'use server' directive (in the function body for inline, or at file top for whole-file exports). They integrate seamlessly with HTML forms (action={serverFn}), work without JavaScript, and pair with useActionState for form validation feedback.",
    code:
`// lib/actions.ts — Server Actions module
'use server'; // Marks all exports as Server Actions

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const CreatePostSchema = z.object({
  title:   z.string().min(1).max(100),
  content: z.string().min(10),
  tags:    z.array(z.string()).optional(),
});

export async function createPost(
  prevState: { error?: string } | null,
  formData: FormData,
) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  // Parse and validate
  const parsed = CreatePostSchema.safeParse({
    title:   formData.get('title'),
    content: formData.get('content'),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  await prisma.post.create({
    data: { ...parsed.data, authorId: session.user.id },
  });

  revalidatePath('/blog');    // clear blog cache
  redirect('/blog');          // redirect after success
}`,
    tip:"Server Actions make API routes optional for mutations. You can directly call a Server Action from a Client Component button, pass it as a form action, and get progressive enhancement (works without JS) for free." },

  { id:"api",       icon:"🌐",title:"API Route Handlers",          subtitle:"Route Handlers, NextRequest, NextResponse, streaming, webhooks",
    Demo:ApiRoutesDemo,
    body:"Route Handlers (app/api/*/route.ts) are the App Router's API endpoints. Export named functions GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS to handle different HTTP methods. They use the Web Fetch API (NextRequest/NextResponse) making them edge-compatible. Unlike Server Actions, Route Handlers are needed for webhooks, third-party integrations, and public APIs.",
    code:
`// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const PostSchema = z.object({
  title:   z.string().min(1),
  content: z.string().min(10),
});

// GET /api/posts?page=1&limit=10
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page  = parseInt(searchParams.get('page')  ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '10');

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({ skip:(page-1)*limit, take:limit }),
    prisma.post.count(),
  ]);

  return NextResponse.json({
    posts, meta: { page, limit, total, pages: Math.ceil(total/limit) },
  });
}

// POST /api/posts
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body   = await request.json();
  const parsed = PostSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });

  const post = await prisma.post.create({
    data: { ...parsed.data, authorId: session.user.id },
  });

  return NextResponse.json(post, { status: 201 });
}`,
    tip:"Prefer Server Actions over Route Handlers for mutations within your own app. Route Handlers are best for webhooks, public APIs consumed by other clients, and cases where you need fine-grained HTTP control." },

  { id:"image",     icon:"🖼️",title:"Image & Font Optimization",   subtitle:"next/image, next/font, metadata API, open graph",
    Demo:ImageFontDemo,
    body:"next/image automatically converts images to WebP/AVIF, generates responsive srcsets, prevents layout shift with size reservation, and lazy-loads by default. next/font self-hosts Google Fonts at build time — zero runtime requests, no layout shift. The Metadata API in App Router provides a type-safe way to set page titles, descriptions, and Open Graph data.",
    code:
`// next.config.js — full configuration
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
};

module.exports = nextConfig;

// components/HeroImage.tsx
import Image from 'next/image';

export function HeroImage() {
  return (
    <div style={{ position: 'relative', height: '600px' }}>
      <Image
        src="/hero.jpg"
        alt="Hero background"
        fill                             // fills container
        sizes="100vw"                    // full viewport width
        priority                         // load eagerly (LCP image)
        quality={85}
        className="object-cover object-center"
        placeholder="blur"               // blurred preview
        blurDataURL="data:image/png..."  // tiny base64 preview
      />
    </div>
  );
}`,
    tip:"Always add priority to above-the-fold images (your hero/header image). This preloads the image and dramatically improves your Largest Contentful Paint (LCP) score, which affects SEO ranking." },

  { id:"auth",      icon:"🔑",title:"Authentication",              subtitle:"NextAuth.js v5, providers, session, middleware protection",
    Demo:AuthDemo,
    body:"NextAuth.js (now Auth.js) is the standard authentication solution for Next.js. It supports 50+ OAuth providers (GitHub, Google, Discord), credentials (email/password), magic links, and enterprise SSO. Version 5 (Auth.js) has first-class App Router support — use auth() in Server Components, useSession() in Client Components, and export handlers as Route Handlers.",
    code:
`// Full auth setup with Prisma
// 1. Install packages
// npm install next-auth@5 @auth/prisma-adapter

// 2. Set env vars
// NEXTAUTH_SECRET=  (openssl rand -base64 32)
// NEXTAUTH_URL=http://localhost:3000
// GITHUB_ID=...
// GITHUB_SECRET=...

// 3. Use auth() in Server Components
import { auth } from '@/auth';

async function Page() {
  const session = await auth();

  if (!session) {
    return <div>Please <a href="/api/auth/signin">sign in</a></div>;
  }

  return <div>Hello, {session.user?.name}!</div>;
}

// 4. Sign in/out buttons (Client Component)
'use client';

export function AuthButtons() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <span>{session.user?.name}</span>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      <button onClick={() => signIn('github')}>Sign in with GitHub</button>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
    </>
  );
}`,
    tip:"Protect entire route segments using middleware rather than checking auth in every page. A single middleware.ts that redirects unauthenticated users is more reliable than per-page checks." },

  { id:"env",       icon:"⚙️",title:"Environment Variables",       subtitle:"NEXT_PUBLIC_, .env files, server/client access, validation",
    Demo:EnvDemo,
    body:"Next.js has a strict separation: variables prefixed with NEXT_PUBLIC_ are included in the browser bundle and accessible in Client Components. All other variables are server-only and never sent to the browser. This prevents accidental secret exposure. Use different .env files for different environments — Next.js loads them in priority order.",
    code:
`// Types of .env files (loaded in this priority order):
// .env                        → all environments
// .env.local                  → always overrides, never committed
// .env.[development|production|test]    → env-specific
// .env.[development|production].local  → env-specific local overrides

// .env.local (never commit to git!)
NEXTAUTH_SECRET=super_secret_value_here
DATABASE_URL=postgresql://user:pass@localhost/myapp
STRIPE_SECRET_KEY=sk_test_abc123
GITHUB_CLIENT_SECRET=your_github_secret

// .env (safe to commit — public values only)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_POSTHOG_KEY=phc_abc123
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_abc

// Access in code:
// Server Components, API Routes, Server Actions:
const secret = process.env.NEXTAUTH_SECRET;    // ✅
const dbUrl  = process.env.DATABASE_URL;       // ✅

// Client Components (NEXT_PUBLIC_ only!):
const appUrl = process.env.NEXT_PUBLIC_APP_URL; // ✅
const secret2 = process.env.NEXTAUTH_SECRET;    // ❌ undefined!

// Type-safe env with t3-env or zod:
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(32),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: process.env,
});`,
    tip:"Use @t3-oss/env-nextjs for type-safe environment variables with Zod validation. It validates your env vars at build time, gives you TypeScript types, and prevents your app from starting if required vars are missing." },

  { id:"styling",   icon:"🎨",title:"Styling",                     subtitle:"CSS Modules, Tailwind CSS, CSS custom properties, themes",
    Demo:StylingDemo,
    body:"Next.js supports CSS Modules (scoped by default), global CSS (imported in root layout), Tailwind CSS (most popular), and CSS-in-JS libraries like styled-components or vanilla-extract. CSS Modules solve naming collisions automatically. Tailwind provides utility-first styling with excellent tree-shaking. For theming, CSS custom properties combined with data attributes are the most performant approach.",
    code:
`// Recommended: Tailwind + CSS Modules combo

// For design tokens and theming → CSS custom properties (globals.css)
// For component styles with variants → Tailwind
// For complex animations → CSS Modules
// For third-party lib overrides → Global CSS

// Using cn() utility (clsx + tailwind-merge)
// npm install clsx tailwind-merge

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage — handles conflicts and conditionals
<div className={cn(
  'px-4 py-2 rounded-lg font-medium',
  isActive && 'bg-indigo-500 text-white',
  isDisabled && 'opacity-50 cursor-not-allowed',
  size === 'lg' && 'px-6 py-3 text-lg',  // overrides px-4
)} />

// CVA — class variance authority for component variants
// npm install class-variance-authority
import { cva } from 'class-variance-authority';

const button = cva('font-bold rounded-lg transition-colors', {
  variants: {
    variant: {
      primary:   'bg-indigo-500 text-white hover:bg-indigo-600',
      secondary: 'border border-indigo-500 text-indigo-500',
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2',
      lg: 'px-7 py-3 text-lg',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

<button className={button({ variant: 'secondary', size: 'lg' })} />`,
    tip:"Use the cn() utility (clsx + tailwind-merge) to combine Tailwind classes safely — tailwind-merge handles conflicts (e.g., px-2 + px-4 → px-4, not both). This is a must-have for reusable components." },

  { id:"performance",icon:"🚀",title:"Performance Optimization",   subtitle:"RSC bundle savings, Suspense streaming, lazy imports, caching",
    Demo:PerformanceDemo,
    body:"Next.js performance comes from multiple layers: React Server Components eliminate client-side JavaScript for static content, Suspense streaming shows content progressively (no blank screen while loading), code splitting with dynamic() reduces initial bundle, and intelligent caching (ISR, fetch cache, React cache) minimizes database load. Use Lighthouse and the Vercel Speed Insights to measure.",
    code:
`// Comprehensive performance checklist

// 1. Measure first — Chrome DevTools → Lighthouse
// Core Web Vitals targets:
//   LCP (Largest Contentful Paint) < 2.5s
//   FID (First Input Delay)        < 100ms
//   CLS (Cumulative Layout Shift)  < 0.1

// 2. Bundle analysis
// npm install @next/bundle-analyzer
// Add to next.config.js:
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer({});
// ANALYZE=true npm run build

// 3. Avoid layout shifts
// Always specify width + height on images
// Reserve space for dynamic content

// 4. Script loading strategy
import Script from 'next/script';

// Load third-party scripts without blocking
<Script src="https://analytics.example.com" strategy="lazyOnload" />
// strategy: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload' | 'worker'

// 5. React cache for expensive computations

export const getUser = cache(async (id: string) => {
  console.log('DB query for user', id); // logs once even if called 10x
  return db.users.findUnique({ where: { id } });
});

// 6. Partial Pre-Rendering (Next.js 14+)
// Combine static shell with dynamic holes
export const experimental_ppr = true;`,
    tip:"Run 'ANALYZE=true npm run build' with @next/bundle-analyzer to see exactly what's in your JavaScript bundles. A single heavy library in a Client Component can massively increase your bundle size." },

  { id:"deploy",    icon:"🚀",title:"Deployment",                  subtitle:"Vercel, Docker, self-hosted, CI/CD, environment setup",
    Demo:DeployDemo,
    body:"Next.js can be deployed anywhere Node.js runs. Vercel is the easiest — push to GitHub and it deploys automatically with preview URLs for every PR. For self-hosted or Docker, use output: 'standalone' in next.config.js to create a minimal production build. All deployments need proper environment variables for auth, database, and external services.",
    code:
`// next.config.js — production configuration
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // Required for Docker!

  // Redirect old URLs
  async redirects() {
    return [
      { source: '/old-blog/:slug', destination: '/blog/:slug', permanent: true },
    ];
  },

  // Rewrite API calls (proxy)
  async rewrites() {
    return [
      { source: '/api/v1/:path*', destination: 'https://api.example.com/:path*' },
    ];
  },

  // Security headers
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-eval'",
        },
      ],
    }];
  },

  // Bundle size optimization
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

module.exports = nextConfig;`,
    tip:"Enable output: 'standalone' in next.config.js before building a Docker image. This creates a self-contained build under .next/standalone that only includes necessary files, dramatically reducing image size (often 10x smaller)." },
];

/* ══ MAIN COMPONENT — single export default ══════════ */
export default function NextJSMasterclass() {
  const [dark, setDark]       = useState(true);
  const [activeId, setActiveId] = useState("intro");
  const [search, setSearch]   = useState("");
  const [done, setDone]       = useState(new Set());
  const mainRef  = useRef(null);
  const activeRef = useRef(null);
  const t = T[dark ? "dark" : "light"];

  const filtered = SECTIONS.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.subtitle.toLowerCase().includes(search.toLowerCase())
  );
  const current = SECTIONS.find(s => s.id === activeId) || SECTIONS[0];
  const idx     = SECTIONS.findIndex(s => s.id === activeId);
  const pct     = Math.round((done.size / SECTIONS.length) * 100);
  const { Demo } = current;

  const go = (id) => {
    setActiveId(id); setSearch("");
    setTimeout(() => mainRef.current?.scrollTo({ top:0, behavior:"smooth" }), 50);
  };
  const toggleDone = (id) => setDone(p => {
    const n = new Set(p);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block:"nearest", behavior:"smooth" });
  }, [activeId]);

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
          <div style={{ width:34, height:34, borderRadius:9, background:"linear-gradient(135deg,#818cf8,#6366f1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem", fontWeight:900, color:"#fff", flexShrink:0 }}>▲</div>
          <div>
            <div style={{ fontWeight:800, fontSize:"0.95rem", letterSpacing:"-0.02em", lineHeight:1.1 }}>Next.js Masterclass</div>
            <div style={{ color:t.muted, fontSize:"0.67rem" }}>Complete interactive guide · {SECTIONS.length} lessons</div>
          </div>
          <span style={{ background:t.accentBg, color:t.accent, border:`1px solid ${t.accentBorder}`, borderRadius:20, padding:"1px 9px", fontSize:"0.68rem", fontWeight:800 }}>v14 App Router</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <div style={{ width:90, height:5, background:t.border, borderRadius:99, overflow:"hidden" }}>
              <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${t.accent},${t.purple})`, borderRadius:99, transition:"width .5s" }}/>
            </div>
            <span style={{ fontSize:"0.7rem", color:t.muted, fontWeight:700 }}>{done.size}/{SECTIONS.length}</span>
          </div>
          <button onClick={() => setDark(d => !d)} style={{ background:t.surface2, border:`1px solid ${t.border}`, borderRadius:8, padding:"5px 12px", cursor:"pointer", color:t.text, fontSize:"0.8rem", fontWeight:600 }}>
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
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search lessons…"
                style={{ width:"100%", padding:"7px 28px", background:t.surface2, border:`1px solid ${t.border}`, borderRadius:8, color:t.text, fontSize:"0.82rem", outline:"none" }}/>
              {search && (
                <button onClick={() => setSearch("")} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:t.muted, cursor:"pointer", fontSize:"1.1rem", padding:0, lineHeight:1 }}>×</button>
              )}
            </div>
          </div>
          <div style={{ padding:"9px 12px", borderBottom:`1px solid ${t.border}`, flexShrink:0 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontSize:"0.68rem", fontWeight:700, color:t.muted, textTransform:"uppercase", letterSpacing:"0.06em" }}>Progress</span>
              <span style={{ fontSize:"0.68rem", color:t.accent, fontWeight:700 }}>{pct}%</span>
            </div>
            <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
              {SECTIONS.map(s => (
                <div key={s.id} onClick={() => go(s.id)} title={s.title}
                  style={{ width:11, height:11, borderRadius:3, background:done.has(s.id)?"#818cf8":s.id===activeId?t.accent:t.border, cursor:"pointer", transition:"background .2s" }}/>
              ))}
            </div>
          </div>
          <nav style={{ flex:1, overflowY:"auto", padding:"6px 8px", minHeight:0 }}>
            {filtered.length === 0 && (
              <div style={{ padding:"24px 10px", textAlign:"center", color:t.muted, fontSize:"0.82rem" }}>No lessons found</div>
            )}
            {filtered.map(s => {
              const isActive = s.id === activeId;
              return (
                <button key={s.id} ref={isActive ? activeRef : null} onClick={() => go(s.id)}
                  style={{ width:"100%", textAlign:"left", padding:"8px 10px", background:isActive?t.accentBg:"transparent", border:`1px solid ${isActive?t.accentBorder:"transparent"}`, borderRadius:8, marginBottom:2, cursor:"pointer", color:isActive?t.accent:t.text, display:"flex", alignItems:"center", gap:8, fontSize:"0.83rem", fontWeight:isActive?700:400, transition:"all .15s" }}>
                  <span style={{ fontSize:"0.95rem", flexShrink:0 }}>{s.icon}</span>
                  <span style={{ flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title}</span>
                  {done.has(s.id) && <span style={{ color:t.accent, fontSize:"0.7rem", flexShrink:0 }}>✓</span>}
                </button>
              );
            })}
          </nav>
          <div style={{ padding:"8px 12px", borderTop:`1px solid ${t.border}`, flexShrink:0, textAlign:"center" }}>
            <span style={{ fontSize:"0.68rem", color:t.muted }}>App Router to Production Deploy</span>
          </div>
        </aside>

        {/* MAIN */}
        <main ref={mainRef} style={{ flex:1, overflowY:"auto", padding:"28px 32px", minWidth:0 }}>
          <div style={{ maxWidth:860, margin:"0 auto" }}>
            <div style={{ marginBottom:22 }}>
              <div style={{ marginBottom:8 }}>
                <span style={{ fontSize:"0.7rem", background:t.accentBg, color:t.accent, border:`1px solid ${t.accentBorder}`, borderRadius:20, padding:"2px 10px", fontWeight:800, letterSpacing:"0.06em" }}>
                  LESSON {idx+1} / {SECTIONS.length}
                </span>
              </div>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:"2.4rem" }}>{current.icon}</span>
                  <div>
                    <h2 style={{ margin:0, fontSize:"1.5rem", fontWeight:800, letterSpacing:"-0.03em", lineHeight:1.1 }}>{current.title}</h2>
                    <p style={{ margin:"3px 0 0", color:t.muted, fontSize:"0.87rem" }}>{current.subtitle}</p>
                  </div>
                </div>
                <button onClick={() => toggleDone(current.id)}
                  style={{ background:done.has(current.id)?"#818cf820":t.surface2, border:`1px solid ${done.has(current.id)?"#818cf860":t.border}`, color:done.has(current.id)?t.accent:t.muted, borderRadius:10, padding:"8px 16px", cursor:"pointer", fontSize:"0.8rem", fontWeight:700, whiteSpace:"nowrap" }}>
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
              <SLabel color="#4338ca">Code Example</SLabel>
              <Code code={current.code} />
            </div>

            <div style={{ marginBottom:32 }}>
              <Tip text={current.tip} t={t} />
            </div>

            <div style={{ display:"flex", gap:10, alignItems:"center", borderTop:`1px solid ${t.border}`, paddingTop:22 }}>
              <button onClick={() => idx > 0 && go(SECTIONS[idx-1].id)} disabled={idx===0}
                style={{ background:t.surface2, border:`1px solid ${t.border}`, color:idx===0?t.muted:t.text, borderRadius:10, padding:"10px 18px", cursor:idx===0?"not-allowed":"pointer", fontSize:"0.85rem", fontWeight:600, opacity:idx===0?.45:1 }}>
                ← Prev
              </button>
              <div style={{ flex:1, textAlign:"center", fontSize:"0.78rem", color:t.muted }}>{idx+1} of {SECTIONS.length}</div>
              <button onClick={() => { if(idx < SECTIONS.length-1){ toggleDone(current.id); go(SECTIONS[idx+1].id); }}} disabled={idx===SECTIONS.length-1}
                style={{ background:idx===SECTIONS.length-1?t.surface2:`linear-gradient(135deg,${t.accent},${t.purple})`, border:"none", color:idx===SECTIONS.length-1?t.muted:"#fff", borderRadius:10, padding:"10px 20px", cursor:idx===SECTIONS.length-1?"not-allowed":"pointer", fontSize:"0.85rem", fontWeight:700, opacity:idx===SECTIONS.length-1?.45:1, boxShadow:idx===SECTIONS.length-1?"none":`0 4px 14px ${t.accent}45` }}>
                Next →
              </button>
            </div>
            <div style={{ height:40 }}/>
          </div>
        </main>
      </div>
    </div>
  );
}
