import React, { useEffect, useState, createContext, useContext } from 'react'
import { Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import './index.css'

// ---------- Config ----------
const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

// ---------- Auth Context ----------
const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('auth_token') || '')
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('auth_user')
    return raw ? JSON.parse(raw) : null
  })

  const login = (tk, usr) => {
    setToken(tk)
    setUser(usr)
    localStorage.setItem('auth_token', tk)
    localStorage.setItem('auth_user', JSON.stringify(usr))
  }
  const logout = () => {
    setToken('')
    setUser(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ---------- Buttons (primary revamped; outline kept and enhanced globally via CSS) ----------
function PrimaryButton({ to, children, className = '', ...props }){
  const Comp = to ? Link : 'button'
  return (
    <Comp to={to} className={`relative group inline-flex items-center justify-center rounded-full px-7 py-3 font-semibold uppercase tracking-wide text-white select-none ${className}`} {...props}>
      {/* Outer neon ring */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 opacity-20 blur-xl group-hover:opacity-40 transition"/>
      {/* Core gradient (leverages .btn-primary palette) */}
      <span className="relative z-[1] btn-primary px-0 py-0 !uppercase !tracking-wide">{children}</span>
      {/* Shimmer sweep */}
      <span className="pointer-events-none absolute inset-[-1px] rounded-full overflow-hidden">
        <span className="absolute top-0 -left-1/3 h-full w-1/2 opacity-30 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_1.2s_linear_infinite]" />
      </span>
    </Comp>
  )
}

// ---------- Top Navigation (more effects, active states) ----------
function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const links = [
    { label: 'Features', to: '/features' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'Blog', to: '/blog' },
    { label: 'Docs', to: '/docs' },
    { label: 'Contact', to: '/contact' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Ambient beams */}
      <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 h-40 w-[720px] bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-fuchsia-500/20 blur-3xl rounded-full"/>
      <div className="nav-blur">
        <div className="nav-container">
          <div className="nav-inner relative">
            {/* Glow ring */}
            <div className="pointer-events-none absolute -inset-px rounded-2xl bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.12),transparent_60%)]" />

            <div className="relative flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2 text-white font-semibold tracking-tight">
                <div className="relative">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-500 shadow-[0_0_24px_rgba(0,255,255,0.55)] floaty" />
                  <div className="absolute inset-0 rounded-xl animate-pulse bg-cyan-400/10" />
                </div>
                <span className="text-white">BotBuy</span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-slate-200">
              {links.map((l) => (
                <Link key={l.to} to={l.to} className={`hover:text-white nav-link ${pathname.startsWith(l.to) ? 'text-white' : ''}`}>{l.label}</Link>
              ))}
            </nav>

            <div className="relative flex items-center gap-2">
              {user ? (
                <>
                  <Link to="/dashboard" className="btn-ghost">Dashboard</Link>
                  <button onClick={() => { logout(); navigate('/') }} className="btn-ghost">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost">Log in</Link>
                  <PrimaryButton to="/signup">Sign up</PrimaryButton>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function Footer(){
  return (
    <footer className="border-t border-white/10 bg-[#05000C] text-slate-300">
      <div className="gradient-line" />
      <div className="max-w-[1280px] mx-auto px-4 py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-semibold mb-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 shadow-[0_0_18px_rgba(0,255,255,0.45)]" />
            BotBuy
          </div>
          <p className="text-sm text-slate-400">Bots, sold with precision. Premium checkout and an owner-first dashboard.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Company</h4>
          <ul className="space-y-1">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
            <li><Link to="/press" className="hover:text-white">Press</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Resources</h4>
          <ul className="space-y-1">
            <li><Link to="/docs" className="hover:text-white">Docs</Link></li>
            <li><Link to="/support" className="hover:text-white">Support</Link></li>
            <li><Link to="/status" className="hover:text-white">Status</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Legal</h4>
          <ul className="space-y-1">
            <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
            <li><Link to="/security" className="hover:text-white">Security</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-slate-500 pb-6">© {new Date().getFullYear()} BotBuy</div>
    </footer>
  )
}

function Section({ title, subtitle, children, id }){
  return (
    <section id={id} className="max-w-[1280px] mx-auto px-4 py-16">
      {title && <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight reveal">{title}</h2>}
      {subtitle && <p className="text-slate-300 mb-8 reveal" style={{animationDelay:'60ms'}}>{subtitle}</p>}
      {children}
    </section>
  )
}

// ---------- Left Sidebar (premium, pretty collapsed, supports many pages) ----------
function LeftSidebar(){
  const { pathname } = useLocation()
  const [open, setOpen] = useState(true)

  const groups = [
    {
      label: 'General',
      items: [
        { t:'Home', to:'/' },
        { t:'Features', to:'/features' },
        { t:'Pricing', to:'/pricing' },
        { t:'Blog', to:'/blog' },
      ]
    },
    {
      label: 'Resources',
      items: [
        { t:'Docs', to:'/docs' },
        { t:'Support', to:'/support' },
        { t:'Status', to:'/status' },
        { t:'FAQs', to:'/faqs' },
      ]
    },
    {
      label: 'Company',
      items: [
        { t:'About', to:'/about' },
        { t:'Careers', to:'/careers' },
        { t:'Press', to:'/press' },
        { t:'Contact', to:'/contact' },
      ]
    },
    {
      label: 'Legal',
      items: [
        { t:'Terms', to:'/terms' },
        { t:'Privacy', to:'/privacy' },
        { t:'Security', to:'/security' },
      ]
    },
  ]

  return (
    <aside className={`hidden lg:flex fixed top-24 left-3 z-40 transition-[width] duration-300 ${open? 'w-[280px]' : 'w-[84px]'}`}>
      <div className="glass-card h-[72vh] w-full p-3 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(0,255,255,0.6)]" />
            <span className={`text-[11px] uppercase tracking-wider text-slate-300 transition-opacity ${open? 'opacity-100' : 'opacity-0'}`}>Navigation</span>
          </div>
          <button onClick={()=>setOpen(v=>!v)} className="btn-ghost px-2 py-1" aria-label="Toggle sidebar" title={open? 'Collapse' : 'Expand'}>
            {open? '‹' : '›'}
          </button>
        </div>
        <div className={`mt-3 flex-1 overflow-y-auto pr-1 ${open? 'space-y-4' : 'space-y-3'}`}>
          {groups.map((g,gi)=> (
            <div key={gi}>
              <div className={`text-[11px] uppercase tracking-wider text-slate-400 px-2 transition ${open? 'opacity-100' : 'opacity-0'}`}>{g.label}</div>
              <div className={`mt-2 ${open? 'space-y-2' : 'space-y-2'}`}>
                {g.items.map((it, i)=> {
                  const active = pathname === it.to || (it.to !== '/' && pathname.startsWith(it.to))
                  if(open){
                    return (
                      <Link key={i} to={it.to} className={`group flex items-center gap-3 px-3 py-2 rounded-xl border border-white/10 transition ${active? 'bg-white/10 border-cyan-300/30 shadow-[0_0_22px_rgba(0,255,255,0.18)] text-white' : 'text-slate-200 hover:bg-white/5 hover:shadow-[0_0_20px_rgba(0,255,255,0.12)]'}`}>
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(0,255,255,0.6)]" />
                        <span className="whitespace-nowrap">{it.t}</span>
                      </Link>
                    )
                  }
                  // collapsed: pretty round icon buttons with tooltip
                  return (
                    <Link key={i} to={it.to} title={it.t} className={`group relative grid place-items-center h-10 w-10 mx-auto rounded-full border border-white/10 transition ${active? 'bg-white/10 border-cyan-300/30 shadow-[0_0_22px_rgba(0,255,255,0.18)]' : 'hover:bg-white/5 hover:shadow-[0_0_20px_rgba(0,255,255,0.12)]'}`}>
                      <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(0,255,255,0.6)]" />
                      <span className="pointer-events-none absolute left-12 whitespace-nowrap rounded-lg border border-white/10 bg-black/70 px-2 py-1 text-xs text-white opacity-0 translate-y-0 group-hover:opacity-100 group-hover:translate-y-0 transition">{it.t}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <PrimaryButton to="/pricing" className="w-full">Get BotBuy</PrimaryButton>
        </div>
      </div>
    </aside>
  )
}

// ---------- Decorative Background ----------
function BackgroundFX(){
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(()=>{
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:20px_20px]" />
      {/* Color wash */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,255,255,0.10),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.10),transparent_55%)]" />
      {/* Large soft blobs */}
      <div className="absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full blur-[160px] opacity-25 bg-cyan-500" />
      <div className="absolute -bottom-40 -right-32 h-[560px] w-[560px] rounded-full blur-[160px] opacity-25 bg-purple-500" />
      {/* Cursor glow */}
      <div className="fixed h-64 w-64 rounded-full blur-[100px] bg-cyan-400/25" style={{ transform: `translate(${pos.x - 128}px, ${pos.y - 128}px)` }} />
      {/* Shimmer beams */}
      <div className="absolute top-1/3 -left-20 rotate-12 h-1 w-[130%] bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />
      <div className="absolute top-2/3 -right-20 -rotate-12 h-1 w-[130%] bg-gradient-to-r from-transparent via-purple-300/20 to-transparent" />
    </div>
  )
}

// ---------- Cards (remade, richer motion) ----------
function FeatureCard({ title, desc, delay = 0 }){
  return (
    <div className="group relative glass-card p-6 overflow-hidden transition-transform will-change-transform" style={{animation:'rise 520ms cubic-bezier(0.22,1,0.36,1) both', animationDelay:`${delay}ms`}}>
      <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-cyan-400/10 blur-2xl" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.15),transparent_60%)]" />
      <div className="flex items-center gap-3">
        <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-cyan-400 to-purple-500 shadow-[0_0_14px_rgba(0,255,255,0.45)]" />
        <div className="text-white font-semibold">{title}</div>
      </div>
      <div className="text-slate-400 text-sm mt-2">{desc}</div>
      <div className="mt-4 h-px w-full gradient-line" />
      <div className="mt-4 text-cyan-300 text-sm opacity-0 group-hover:opacity-100 transition translate-y-1 group-hover:translate-y-0">Learn more →</div>
    </div>
  )
}

// ---------- Pages ----------
function Home(){
  return (
    <div className="min-h-screen bg-[#05000C] text-slate-200 relative overflow-hidden lg:pl-24">
      <BackgroundFX/>
      <Navbar/>
      <LeftSidebar/>

      {/* Hero */}
      <section className="pt-28 pb-12">
        <div className="max-w-[1280px] mx-auto px-4 grid md:grid-cols-[1fr_420px] gap-10 items-center">
          <div>
            <h1 className="display-gradient text-5xl md:text-6xl font-extrabold tracking-tight reveal" style={{animationDelay:'60ms'}}>
              Premium Bot Storefronts
            </h1>
            <p className="mt-4 text-slate-300 text-base md:text-lg max-w-2xl reveal" style={{animationDelay:'120ms'}}>
              Engineered for sellers who value polish, power, and trust. Take payments, deliver instantly, and manage customers — all in one futuristic surface.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <PrimaryButton to="/pricing">Get Started</PrimaryButton>
              <Link to="/features" className="btn-outline-liquid">Explore Features</Link>
            </div>

            <div className="mt-10 grid sm:grid-cols-3 gap-4">
              {[
                { h:"Instant Checkout", p:"One-click flows ready to swap with live providers." },
                { h:"Premium Design", p:"Neon gradients, glass surfaces, precise motion." },
                { h:"Owner Dashboard", p:"Create plans, view orders, control your store." },
              ].map((c,i)=> (
                <FeatureCard key={i} title={c.h} desc={c.p} delay={160 + i*90}/>
              ))}
            </div>
          </div>

          {/* Hero visual (no fake data; illustrative UI blocks) */}
          <div className="hidden md:block">
            <div className="sticky top-28">
              <div className="relative glass-card p-6 shadow-[inset_0_0_40px_rgba(255,255,255,0.05)] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.08),transparent_50%)]" />
                <div className="relative z-[1] space-y-3">
                  <div className="text-white/90 font-semibold">Preview</div>
                  {/* Faux UI shapes without numeric claims */}
                  <div className="grid grid-cols-3 gap-3">
                    {[0,1,2].map((i)=> (
                      <div key={i} className="glass-card p-3 h-16 animate-pulse"/>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[0,1].map((i)=> (
                      <div key={i} className="glass-card p-3 h-16"/>
                    ))}
                  </div>
                  <PrimaryButton to="/pricing" className="w-full">Launch now</PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="px-4">
        <div className="mx-auto max-w-[1280px] glass-card p-4 flex flex-wrap items-center justify-between gap-4">
          {['Secure Payments','Encrypted Sessions','High Availability','Instant Delivery'].map((t,i)=> (
            <div key={i} className="text-sm text-slate-300 flex items-center gap-2" style={{animation:'rise 480ms cubic-bezier(0.22,1,0.36,1) both', animationDelay:`${i*80}ms`}}>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(0,255,255,0.6)]" />
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* Highlights (remade cards) */}
      <Section title="Highlights" subtitle="Clarity through immersion. Built for the future.">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {h:'Beautiful Storefronts', p:'Cards, modals, and motion tuned for a premium feel.'},
            {h:'Checkout that converts', p:'Minimal friction, clear feedback, gorgeous CTAs.'},
            {h:'Scales with you', p:'From one product to a full catalog — stay consistent.'},
            {h:'License Keys', p:'Deliver instantly with secure license generation.'},
            {h:'Webhooks', p:'Connect to Discord or your backend for fulfillment.'},
            {h:'Analytics', p:'Understand performance and iterate with confidence.'},
          ].map((c,i)=> (
            <FeatureCard key={i} title={c.h} desc={c.p} delay={i*70} />
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section title="How it works" subtitle="Three steps to launch your bot store">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {h:'Create a plan', p:'Define price, interval, and features. Publish in seconds.'},
            {h:'Share your page', p:'Your branded checkout and product pages are ready.'},
            {h:'Get paid & deliver', p:'Instant delivery with license keys and receipts.'},
          ].map((c,i)=> (
            <div key={i} className="glass-card p-6 relative overflow-hidden" style={{animation:'rise 520ms cubic-bezier(0.22,1,0.36,1) both', animationDelay:`${i*90}ms`} }>
              <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-cyan-400/10 blur-2xl" />
              <div className="text-white font-semibold">{i+1}. {c.h}</div>
              <div className="text-slate-400 text-sm mt-1">{c.p}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Use cases */}
      <Section title="Use cases" subtitle="Built for creators, teams, and studios">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {h:'Trading & Signals', p:'Automate entries with risk controls and deliver keys instantly.'},
            {h:'Gaming Mods', p:'Sell mod packs with secure update channels.'},
            {h:'AI Tools', p:'Gate premium endpoints and distribute credits.'},
            {h:'Education', p:'Course add-ons, scripts, and research helpers.'},
            {h:'Productivity', p:'Keyboard macros, schedulers, and automations.'},
            {h:'Agencies', p:'Offer white-labeled client utilities at scale.'},
          ].map((c,i)=> (
            <div key={i} className="group relative glass-card p-6 overflow-hidden">
              <div className="absolute -top-8 -left-8 h-24 w-24 rounded-full bg-purple-400/10 blur-2xl" />
              <div className="text-white font-semibold">{c.h}</div>
              <div className="text-slate-400 text-sm mt-1">{c.p}</div>
              <div className="mt-4 h-px w-full gradient-line" />
            </div>
          ))}
        </div>
      </Section>

      {/* Comparison (no claims; just qualitative) */}
      <Section title="Why choose BotBuy" subtitle="Designed for a premium buying experience">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <div className="text-white font-semibold mb-2">Experience</div>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>• Polished, animated UI out of the box</li>
              <li>• License keys + instant delivery</li>
              <li>• Owner + customer portals</li>
              <li>• Simple webhooks</li>
              <li>• Thoughtful analytics surfaces</li>
            </ul>
          </div>
          <div className="glass-card p-6">
            <div className="text-white font-semibold mb-2">Typical checkout</div>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>• Generic forms, no brand feel</li>
              <li>• Manual fulfillment</li>
              <li>• No self-serve portals</li>
              <li>• Complex custom integrations</li>
              <li>• Minimal insight</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Stories (replaces testimonial numbers) */}
      <Section title="Creator stories" subtitle="Snapshots from real workflows">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            ['Algo trading setup','End-to-end delivery with license keys and updates.'],
            ['Game mod shop','Secure distribution and simple customer portal.'],
            ['AI add-on store','Gate premium endpoints and manage credits.'],
          ].map((t,i)=> (
            <div key={i} className="glass-card p-6">
              <div className="text-white font-semibold mb-2">{t[0]}</div>
              <div className="text-slate-400 text-sm">{t[1]}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Big CTA */}
      <div className="px-4 pb-20">
        <div className="max-w-[1280px] mx-auto glass-card p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-2xl md:text-3xl font-extrabold display-gradient">Ready to sell like it’s the future?</div>
            <div className="text-slate-300 mt-1">Create a plan and go live today. Premium feel, real results.</div>
          </div>
          <div className="flex gap-3">
            <PrimaryButton to="/pricing">Choose a plan</PrimaryButton>
            <Link to="/features" className="btn-outline-liquid">See features</Link>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  )
}

function Features(){
  return (
    <div className="min-h-screen text-slate-200 relative"><BackgroundFX/><Navbar/>
      <div className="lg:pl-24">
        <Section title="Features" subtitle="A complete toolkit for selling bots">
          <ul className="grid md:grid-cols-2 gap-6">
            {[
              'Beautiful product pages','Secure payments','Customer accounts','Order management','Coupons & promos','Analytics','Webhooks','Export data'
            ].map((f,i)=> (
              <li key={i} className="glass-card p-5 reveal" style={{animationDelay:`${i*60}ms`}}>{f}</li>
            ))}
          </ul>
        </Section>
      </div>
      <Footer/></div>
  )
}

function Pricing(){
  const [plans, setPlans] = useState([])
  useEffect(()=>{(async()=>{
    try{ const res = await fetch(`${API_BASE}/plans`); const data = await res.json(); setPlans(data.plans || []) }catch(e){/*noop*/}
  })()},[])
  const navigate = useNavigate()
  return (
    <div className="min-h-screen text-slate-200 relative"><BackgroundFX/><Navbar/>
      <div className="lg:pl-24">
        <Section title="Pricing" subtitle="Choose a plan and start selling">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.length ? plans.map((p)=> (
              <div key={p.slug} className="group glass-card p-6 hover:border-cyan-400/20 transition relative overflow-hidden reveal">
                <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-cyan-400/10 blur-2xl" />
                <h3 className="text-white text-xl font-semibold mb-1">{p.title}</h3>
                <p className="text-slate-400 text-sm mb-3">{p.description}</p>
                <div className="text-3xl font-extrabold text-white mb-4">${p.price}{p.interval !== 'one-time' && <span className="text-slate-400 text-base">/{p.interval}</span>}</div>
                <ul className="text-sm text-slate-300 space-y-1 mb-4">
                  {(p.features || []).map((f,i)=> <li key={i}>• {f}</li>)}
                </ul>
                <PrimaryButton onClick={()=> navigate(`/checkout/${p.slug}`)} className="w-full">Buy</PrimaryButton>
              </div>
            )) : (
              [1,2,3].map(i=> (
                <div key={i} className="glass-card p-6 animate-pulse h-56"/>
              ))
            )}
          </div>
        </Section>
      </div>
      <Footer/></div>
  )
}

function Checkout(){
  const { token } = useAuth()
  const navigate = useNavigate()
  const planSlug = window.location.pathname.split('/').pop()
  const [status,setStatus] = useState('idle')

  const startCheckout = async () => {
    if(!token){ navigate('/login?next='+encodeURIComponent(location.pathname)); return }
    setStatus('creating')
    try{
      const res = await fetch(`${API_BASE}/orders`,{method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`}, body: JSON.stringify({ plan_slug: planSlug })})
      if(!res.ok) throw new Error('Order create failed')
      const data = await res.json()
      setStatus('created')
      await fetch(`${API_BASE}/paypal/update`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ order_id: data.order_id, action: 'approve' })})
      await fetch(`${API_BASE}/paypal/update`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ order_id: data.order_id, action: 'complete' })})
      setStatus('completed')
      navigate('/orders')
    }catch(e){ setStatus('error') }
  }

  return (
    <div className="min-h-screen text-slate-200 relative"><BackgroundFX/><Navbar/>
      <div className="lg:pl-24">
        <Section title="Checkout" subtitle={`Plan: ${planSlug}`}> 
          <div className="max-w-md glass-card p-6">
            <p className="mb-4 text-slate-300">You will be redirected to PayPal to complete your purchase. For this demo, we simulate the approval and completion.</p>
            <PrimaryButton onClick={startCheckout} className="w-full" disabled={status==='creating' || status==='completed'}>
              {status==='creating' ? 'Creating order...' : status==='completed' ? 'Completed' : 'Pay with PayPal'}
            </PrimaryButton>
            {status==='error' && <p className="text-rose-400 text-sm mt-3">There was a problem starting checkout.</p>}
          </div>
        </Section>
      </div>
      <Footer/></div>
  )
}

function Login(){
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')

  const onSubmit = async (e)=>{
    e.preventDefault(); setError('')
    try{
      const res = await fetch(`${API_BASE}/login`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password })})
      const data = await res.json()
      if(!res.ok) throw new Error(data.detail || 'Login failed')
      login(data.token, data.user)
      const next = new URLSearchParams(location.search).get('next')
      navigate(next || '/dashboard')
    }catch(err){ setError(err.message) }
  }

  return (
    <div className="min-h-screen text-slate-200 relative"><BackgroundFX/><Navbar/>
      <div className="lg:pl-24">
        <Section title="Log in">
          <form onSubmit={onSubmit} className="max-w-md glass-card p-6 space-y-4">
            {error && <div className="text-rose-400 text-sm">{error}</div>}
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60" required/>
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60" required/>
            </div>
            <PrimaryButton className="w-full">Log in</PrimaryButton>
            <p className="text-sm text-slate-400">No account? <Link to="/signup" className="text-white underline">Sign up</Link></p>
          </form>
        </Section>
      </div>
      <Footer/></div>
  )
}

function Signup(){
  const { login } = useAuth()
  const navigate = useNavigate()
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')

  const onSubmit = async (e)=>{
    e.preventDefault(); setError('')
    try{
      const res = await fetch(`${API_BASE}/signup`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, email, password })})
      const data = await res.json()
      if(!res.ok) throw new Error(data.detail || 'Signup failed')
      login(data.token, data.user)
      navigate('/dashboard')
    }catch(err){ setError(err.message) }
  }

  return (
    <div className="min-h-screen text-slate-200 relative"><BackgroundFX/><Navbar/>
      <div className="lg:pl-24">
        <Section title="Create your account">
          <form onSubmit={onSubmit} className="max-w-md glass-card p-6 space-y-4">
            {error && <div className="text-rose-400 text-sm">{error}</div>}
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input value={name} onChange={e=>setName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60" required/>
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60" required/>
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60" required/>
            </div>
            <PrimaryButton className="w-full">Create account</PrimaryButton>
            <p className="text-sm text-slate-400">Already have an account? <Link to="/login" className="text-white underline">Log in</Link></p>
          </form>
        </Section>
      </div>
      <Footer/></div>
  )
}

function RequireAuth({ children }){
  const { token } = useAuth()
  if(!token) return <Navigate to="/login" replace />
  return children
}

function Dashboard(){
  const { user } = useAuth()
  return (
    <div className="min-h-screen text-slate-200 relative"><BackgroundFX/><Navbar/>
      <div className="lg:pl-24">
        <Section title="Your dashboard" subtitle={`Welcome back${user?.name ? ', '+user.name : ''}!`}>
          <div className="grid md:grid-cols-3 gap-6">
            <Card title="Orders" desc="View your purchases" to="/orders"/>
            <Card title="Settings" desc="Manage your account" to="/settings"/>
            <Card title="Explore plans" desc="Buy more bots" to="/pricing"/>
          </div>
        </Section>
      </div>
      <Footer/></div>
  )
}

function Card({title,desc,to}){
  return (
    <Link to={to} className="group relative glass-card p-6 hover:border-cyan-400/20 transition overflow-hidden reveal">
      <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-cyan-400/10 blur-2xl" />
      <div className="text-white font-semibold mb-1">{title}</div>
      <div className="text-slate-400 text-sm">{desc}</div>
      <div className="mt-4 text-cyan-300 text-sm opacity-0 group-hover:opacity-100 transition translate-y-1 group-hover:translate-y-0">Open →</div>
    </Link>
  )
}

function Orders(){
  const { token } = useAuth()
  const [orders,setOrders] = useState([])
  useEffect(()=>{(async()=>{
    try{ const res = await fetch(`${API_BASE}/orders`,{ headers: { Authorization: `Bearer ${token}` } }); const data = await res.json(); if(res.ok) setOrders(data.orders||[]) }catch(e){}
  })()},[])
  return (
    <div className="min-h-screen text-slate-200 relative"><BackgroundFX/><Navbar/>
      <div className="lg:pl-24">
        <Section title="Your orders">
          <div className="space-y-3">
            {orders.length? orders.map(o=> (
              <div key={o._id} className="glass-card p-4">
                <div className="text-white font-semibold">{o.plan_slug}</div>
                <div className="text-slate-400 text-sm">${o.amount} • {o.currency} • {o.status}</div>
              </div>
            )) : <div className="text-slate-400">No orders yet.</div>}
          </div>
        </Section>
      </div>
      <Footer/></div>
  )
}

function Settings(){
  const { user } = useAuth()
  return (
    <div className="min-h-screen text-slate-200 relative"><BackgroundFX/><Navbar/>
      <div className="lg:pl-24">
        <Section title="Settings">
          <div className="max-w-md glass-card p-6">
            <div className="mb-2">Name: <span className="text-white">{user?.name}</span></div>
            <div className="mb-2">Email: <span className="text-white">{user?.email}</span></div>
            <p className="text-slate-400 text-sm">Profile editing is simplified for the demo.</p>
          </div>
        </Section>
      </div>
      <Footer/></div>
  )
}

// ----- Admin -----
function AdminLogin(){
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const onSubmit = async (e)=>{
    e.preventDefault(); setError('')
    try{
      const res = await fetch(`${API_BASE}/admin/login`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ password })})
      const data = await res.json()
      if(!res.ok) throw new Error(data.detail||'Login failed')
      localStorage.setItem('admin_token', data.admin_token)
      navigate('/owner')
    }catch(err){ setError(err.message) }
  }
  return (
    <div className="min-h-screen text-slate-200 relative"><BackgroundFX/><Navbar/>
      <div className="lg:pl-24">
        <Section title="Owner login" subtitle="Enter the owner password">
          <form onSubmit={onSubmit} className="max-w-md glass-card p-6 space-y-4">
            {error && <div className="text-rose-400 text-sm">{error}</div>}
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60" placeholder="Password" required/>
            <PrimaryButton className="w-full">Enter</PrimaryButton>
          </form>
        </Section>
      </div>
      <Footer/></div>
  )
}

function OwnerDashboard(){
  const token = localStorage.getItem('admin_token')
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  useEffect(()=>{(async()=>{
    if(!token){ navigate('/owner-login'); return }
    try{ const res = await fetch(`${API_BASE}/admin/orders`, { headers: { Authorization: `Bearer ${token}` } }); const data = await res.json(); if(res.ok) setOrders(data.orders||[]) }catch(e){}
  })()},[])
  return (
    <div className="min-h-screen text-slate-200 relative"><BackgroundFX/><Navbar/>
      <div className="lg:pl-24">
        <Section title="Owner dashboard" subtitle="View recent orders">
          <div className="mb-6">
            <Link to="/owner/plans" className="btn-outline-liquid">Manage Plans</Link>
          </div>
          <div className="space-y-3">
            {orders.length? orders.map(o=> (
              <div key={o._id} className="glass-card p-4">
                <div className="text-white font-semibold">{o.plan_slug}</div>
                <div className="text-slate-400 text-sm">${o.amount} • {o.currency} • {o.status}</div>
              </div>
            )) : <div className="text-slate-400">No orders yet.</div>}
          </div>
        </Section>
      </div>
      <Footer/></div>
  )
}

function OwnerPlans(){
  const token = localStorage.getItem('admin_token')
  const navigate = useNavigate()
  const [form, setForm] = useState({ slug:'', title:'', description:'', price:'', interval:'one-time', features:'' })
  const [msg, setMsg] = useState('')
  const submit = async (e)=>{
    e.preventDefault(); setMsg('')
    try{
      const payload = { ...form, price: parseFloat(form.price||'0'), features: form.features? form.features.split(',').map(s=>s.trim()).filter(Boolean): [] }
      const res = await fetch(`${API_BASE}/admin/plans`,{ method:'POST', headers:{'Content-Type':'application/json', Authorization: `Bearer ${token}`}, body: JSON.stringify(payload) })
      const data = await res.json()
      if(!res.ok) throw new Error(data.detail||'Failed to create plan')
      setMsg('Plan created')
    }catch(err){ setMsg(err.message) }
  }
  useEffect(()=>{ if(!token) navigate('/owner-login') }, [])
  return (
    <div className="min-h-screen text-slate-200 relative"><BackgroundFX/><Navbar/>
      <div className="lg:pl-24">
        <Section title="Create a plan" subtitle="Add a new product to sell">
          <form onSubmit={submit} className="max-w-xl grid md:grid-cols-2 gap-4 glass-card p-6">
            {msg && <div className="md:col-span-2 text-sm text-slate-300">{msg}</div>}
            {['slug','title','description','price'].map((k)=> (
              <div key={k} className={k==='description'||k==='price'? 'md:col-span-2': ''}>
                <label className="block text-sm mb-1 capitalize">{k}</label>
                <input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/60" required={k!=='description'} />
              </div>
            ))}
            <div>
              <label className="block text-sm mb-1">Interval</label>
              <select value={form.interval} onChange={e=>setForm({...form, interval:e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/60">
                <option value="one-time">one-time</option>
                <option value="monthly">monthly</option>
                <option value="yearly">yearly</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Features (comma separated)</label>
              <input value={form.features} onChange={e=>setForm({...form, features:e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/60" />
            </div>
            <div className="md:col-span-2">
              <PrimaryButton className="w-full">Create Plan</PrimaryButton>
            </div>
          </form>
        </Section>
      </div>
      <Footer/></div>
  )
}

// ----- Simple content pages -----
const SimplePage = ({title, body}) => (
  <div className="min-h-screen text-slate-200 relative"><BackgroundFX/><Navbar/>
    <div className="lg:pl-24">
      <Section title={title}><p className="text-slate-300 max-w-3xl">{body||'Content coming soon.'}</p></Section>
    </div>
    <Footer/></div>
)

function Blog(){
  const posts = [
    { id: 'delightful-checkouts', title: 'Designing delightful checkouts', blurb: 'Micro-interactions that make buying feel premium.' },
    { id: 'launch-playbook', title: 'Launch playbook', blurb: 'From first plan to first sale in an afternoon.' },
    { id: 'motion-systems', title: 'Motion systems', blurb: 'Consistency rules for polish across surfaces.' },
    { id: 'support-that-scales', title: 'Support that scales', blurb: 'Keeping customers happy with minimal effort.' },
    { id: 'secure-delivery', title: 'Secure delivery', blurb: 'License keys, receipts, and updates.' },
    { id: 'analytics-that-help', title: 'Analytics that help', blurb: 'Signals that actually guide iteration.' },
  ]
  return (
    <div className="min-h-screen text-slate-200 relative"><BackgroundFX/><Navbar/>
      <div className="lg:pl-24">
        <Section title="Blog" subtitle="Latest tips for automation sellers">
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map(p=> (
              <Link key={p.id} to={`/blog/${p.id}`} className="group glass-card p-5 hover:border-cyan-400/20 transition relative overflow-hidden reveal">
                <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-cyan-400/10 blur-2xl" />
                <div className="text-white font-semibold mb-1">{p.title}</div>
                <div className="text-slate-400 text-sm">{p.blurb}</div>
                <div className="mt-4 text-cyan-300 text-sm opacity-0 group-hover:opacity-100 transition">Read →</div>
              </Link>
            ))}
          </div>
        </Section>
      </div>
      <Footer/></div>
  )
}

const BlogPost = () => <SimplePage title="Blog post" body="Detailed article content." />
const Showcase = () => <SimplePage title="Showcase" body="Explore bots built by creators." />
const About = () => <SimplePage title="About" />
const Contact = () => <SimplePage title="Contact" />
const FAQs = () => <SimplePage title="FAQs" />
const Docs = () => <SimplePage title="Docs" />
const Support = () => <SimplePage title="Support" />
const Status = () => <SimplePage title="Status" />
const Terms = () => <SimplePage title="Terms & Conditions" />
const Privacy = () => <SimplePage title="Privacy Policy" />
const Careers = () => <SimplePage title="Careers" />
const Press = () => <SimplePage title="Press" />
const Security = () => <SimplePage title="Security" />
const NotFound = () => <SimplePage title="Page not found" />

// ---------- App Router ----------
export default function App(){
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/features" element={<Features/>} />
        <Route path="/pricing" element={<Pricing/>} />
        <Route path="/checkout/:slug" element={<Checkout/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard/></RequireAuth>} />
        <Route path="/orders" element={<RequireAuth><Orders/></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><Settings/></RequireAuth>} />
        <Route path="/owner-login" element={<AdminLogin/>} />
        <Route path="/owner" element={<OwnerDashboard/>} />
        <Route path="/owner/plans" element={<OwnerPlans/>} />

        <Route path="/showcase" element={<Showcase/>} />
        <Route path="/blog" element={<Blog/>} />
        <Route path="/blog/:id" element={<BlogPost/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/faqs" element={<FAQs/>} />
        <Route path="/docs" element={<Docs/>} />
        <Route path="/support" element={<Support/>} />
        <Route path="/status" element={<Status/>} />
        <Route path="/terms" element={<Terms/>} />
        <Route path="/privacy" element={<Privacy/>} />
        <Route path="/careers" element={<Careers/>} />
        <Route path="/press" element={<Press/>} />
        <Route path="/security" element={<Security/>} />

        <Route path="*" element={<NotFound/>} />
      </Routes>
    </AuthProvider>
  )
}
