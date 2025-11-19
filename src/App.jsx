import React, { useEffect, useState, createContext, useContext } from 'react'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
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

// ---------- UI Shell ----------
function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <header className="fixed top-0 left-0 right-0 z-40 nav-blur">
      <div className="nav-container">
        <div className="nav-inner">
          <Link to="/" className="flex items-center gap-2 text-white font-semibold tracking-tight">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 shadow-[0_0_18px_rgba(0,255,255,0.45)]" />
            <span className="text-white">BotBuy</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-slate-200">
            <Link to="/features" className="hover:text-white nav-link">Features</Link>
            <Link to="/pricing" className="hover:text-white nav-link">Pricing</Link>
            <Link to="/showcase" className="hover:text-white nav-link">Showcase</Link>
            <Link to="/blog" className="hover:text-white nav-link">Blog</Link>
            <Link to="/contact" className="hover:text-white nav-link">Contact</Link>
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/dashboard" className="btn-ghost">Dashboard</Link>
                <button onClick={() => { logout(); navigate('/') }} className="btn-ghost">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Log in</Link>
                <Link to="/signup" className="btn-primary">Sign up</Link>
              </>
            )}
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

function Section({ title, subtitle, children }){
  return (
    <section className="max-w-[1280px] mx-auto px-4 py-16">
      {title && <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">{title}</h2>}
      {subtitle && <p className="text-slate-300 mb-8">{subtitle}</p>}
      {children}
    </section>
  )
}

// ---------- Right Sidebar (collapsible) ----------
function RightSidebar(){
  const [collapsed, setCollapsed] = useState(false)
  return (
    <aside className={`hidden lg:flex fixed top-24 right-3 z-30 transition-[width] duration-300 ${collapsed? 'sidebar collapsed':'sidebar'}`}>
      <div className="glass-card h-[70vh] w-full p-3 flex flex-col">
        <button onClick={()=>setCollapsed(v=>!v)} className="self-end btn-ghost" aria-label="Toggle sidebar">
          {collapsed? '›' : '‹'}
        </button>
        <div className="mt-2 flex-1 flex flex-col gap-2">
          {[
            { t:'Pricing', to:'/pricing', i:'$' },
            { t:'Showcase', to:'/showcase', i:'◆' },
            { t:'Docs', to:'/docs', i:'☰' },
            { t:'Support', to:'/support', i:'✦' },
          ].map((it,i)=>(
            <Link key={i} to={it.to} className="group flex items-center gap-3 px-3 py-2 rounded-xl border border-white/10 text-slate-200 hover:bg-white/5 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] transition">
              <span className="text-cyan-300">{it.i}</span>
              <span className={`${collapsed? 'opacity-0 w-0':'opacity-100'} transition-all duration-300 whitespace-nowrap`}>{it.t}</span>
            </Link>
          ))}
        </div>
        <div className="mt-3 text-xs text-slate-400">Quick Access</div>
      </div>
    </aside>
  )
}

// ---------- Pages ----------
function Home(){
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(()=>{
    const onMove = (e) => {
      const { clientX, clientY } = e
      setPos({ x: clientX, y: clientY })
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div className="min-h-screen bg-[#05000C] text-slate-200 relative overflow-hidden">
      {/* Background systems */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,255,255,0.10),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.10),transparent_55%)]" />
        <div className="absolute -top-40 -left-32 h-[480px] w-[480px] rounded-full blur-[160px] opacity-20 bg-cyan-500" />
        <div className="absolute -bottom-40 -right-32 h-[520px] w-[520px] rounded-full blur-[160px] opacity-20 bg-purple-500" />
      </div>

      {/* Cursor-follow glow */}
      <div
        className="pointer-events-none fixed -z-10 h-56 w-56 rounded-full blur-[90px] bg-cyan-400/30"
        style={{ transform: `translate(${pos.x - 112}px, ${pos.y - 112}px)` }}
      />

      <Navbar/>
      <RightSidebar/>

      {/* Hero */}
      <section className="pt-28 pb-16">
        <div className="max-w-[1280px] mx-auto px-4 grid md:grid-cols-[1fr_360px] gap-10">
          <div className="text-center md:text-left">
            <h1 className="display-gradient text-5xl md:text-6xl font-extrabold tracking-tight reveal" style={{animationDelay:'60ms'}}>
              Premium Bot Storefronts
            </h1>
            <p className="mt-4 text-slate-300 text-base md:text-lg max-w-2xl mx-auto md:mx-0 reveal" style={{animationDelay:'120ms'}}>
              Engineered for sellers who value polish, power, and trust. Take payments, deliver instantly, and manage customers — all in one futuristic surface.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
              <Link to="/pricing" className="btn-primary">Get Started</Link>
              <Link to="/features" className="btn-outline-liquid">Explore Features</Link>
            </div>
            <div className="mt-10 grid sm:grid-cols-3 gap-4">
              {[
                { h:"Instant Checkout", p:"One-click flows with simulated PayPal ready to swap for real." },
                { h:"Premium Design", p:"Neon gradients, glass surfaces, and precise motion." },
                { h:"Owner Dashboard", p:"Create plans, view orders, and control your store." },
              ].map((c,i)=> (
                <div key={i} className="glass-card p-5 hover:border-cyan-400/20 transition-all duration-300" style={{animation:'rise 500ms cubic-bezier(0.22,1,0.36,1) both', animationDelay:`${160 + i*80}ms`}}>
                  <div className="text-white font-semibold">{c.h}</div>
                  <div className="text-slate-400 text-sm mt-1">{c.p}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right hero card */}
          <div className="hidden md:block">
            <div className="sticky top-28">
              <div className="glass-card p-4 shadow-[inset_0_0_40px_rgba(255,255,255,0.05)]">
                <div className="text-sm text-slate-300 mb-3">Quick Access</div>
                <div className="flex flex-col gap-2">
                  {[
                    { t:'Pricing', to:'/pricing' },
                    { t:'Showcase', to:'/showcase' },
                    { t:'Docs', to:'/docs' },
                    { t:'Support', to:'/support' },
                  ].map((it, i)=> (
                    <Link key={i} to={it.to} className="group flex items-center justify-between px-3 py-2 rounded-xl border border-white/10 text-slate-200 hover:bg-white/5 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] transition">
                      <span>{it.t}</span>
                      <span className="text-cyan-300 group-hover:translate-x-0.5 transition">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="px-4">
        <div className="mx-auto max-w-[1280px] glass-card p-4 flex flex-wrap items-center justify-between gap-4">
          {['Secure Payments','Encrypted Sessions','99.9% Uptime','Instant Delivery'].map((t,i)=> (
            <div key={i} className="text-sm text-slate-300 flex items-center gap-2" style={{animation:'rise 480ms cubic-bezier(0.22,1,0.36,1) both', animationDelay:`${i*80}ms`}}>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(0,255,255,0.6)]" />
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* Product Highlights */}
      <Section title="Highlights" subtitle="Clarity through immersion. Built for the future.">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {h:'Beautiful Storefronts', p:'Cards, modals, and motion tuned for a premium feel.'},
            {h:'Checkout that converts', p:'Minimal friction, clear feedback, and gorgeous CTAs.'},
            {h:'Scales with you', p:'From one product to a full catalog — stay consistent.'},
            {h:'License Keys', p:'Deliver instantly with secure license generation.'},
            {h:'Webhooks', p:'Connect to Discord or your backend for fulfillment.'},
            {h:'Analytics', p:'Understand performance and iterate with confidence.'},
          ].map((c,i)=> (
            <div key={i} className="group glass-card p-6 hover:border-cyan-400/20 transition-all duration-300" style={{animation:'rise 520ms cubic-bezier(0.22,1,0.36,1) both', animationDelay:`${i*70}ms`}}>
              <div className="text-white font-semibold">{c.h}</div>
              <div className="text-slate-400 text-sm mt-1">{c.p}</div>
              <div className="mt-4 h-px w-full gradient-line" />
              <div className="mt-4 text-cyan-300 text-sm opacity-0 group-hover:opacity-100 transition">Learn more →</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Showcase preview */}
      <Section title="Showcase" subtitle="A glimpse of what creators are selling with BotBuy.">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i)=> (
            <div key={i} className="glass-card p-4 flex flex-col gap-3 hover:border-cyan-400/20 transition" style={{animation:'rise 520ms cubic-bezier(0.22,1,0.36,1) both', animationDelay:`${i*60}ms`}}>
              <div className="h-28 rounded-lg bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_55%)]" />
              <div className="text-white font-semibold">AI AutoTrader #{i}</div>
              <div className="text-slate-400 text-sm">High-precision market execution bot.</div>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ teaser */}
      <Section title="FAQs" subtitle="Answers to common questions">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {q:'Can I use real PayPal?', a:'Yes. This demo simulates PayPal but can be switched to the live Orders API.'},
            {q:'Do you support subscriptions?', a:'Yes. Monthly and yearly intervals are supported.'},
            {q:'Is there a dashboard?', a:'Owners can create plans and see orders. Users have their own portal.'},
            {q:'How fast is setup?', a:'Create a plan and start selling within minutes.'},
          ].map((f,i)=> (
            <div key={i} className="glass-card p-5">
              <div className="text-white font-semibold">{f.q}</div>
              <div className="text-slate-400 text-sm mt-1">{f.a}</div>
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
            <Link to="/pricing" className="btn-primary">Choose a plan</Link>
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
    <div className="min-h-screen text-slate-200"><Navbar/>
      <Section title="Features" subtitle="A complete toolkit for selling bots">
        <ul className="grid md:grid-cols-2 gap-6">
          {[
            'Beautiful product pages','Secure payments','Customer accounts','Order management','Coupons & promos','Analytics','Webhooks','Export data'
          ].map((f,i)=> (
            <li key={i} className="glass-card p-5">{f}</li>
          ))}
        </ul>
      </Section>
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
    <div className="min-h-screen text-slate-200"><Navbar/>
      <Section title="Pricing" subtitle="Choose a plan and start selling">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.length ? plans.map((p)=> (
            <div key={p.slug} className="glass-card p-6 hover:border-cyan-400/20 transition">
              <h3 className="text-white text-xl font-semibold mb-1">{p.title}</h3>
              <p className="text-slate-400 text-sm mb-3">{p.description}</p>
              <div className="text-3xl font-extrabold text-white mb-4">${p.price}{p.interval !== 'one-time' && <span className="text-slate-400 text-base">/{p.interval}</span>}</div>
              <ul className="text-sm text-slate-300 space-y-1 mb-4">
                {(p.features || []).map((f,i)=> <li key={i}>• {f}</li>)}
              </ul>
              <button onClick={()=> navigate(`/checkout/${p.slug}`)} className="w-full btn-primary">Buy</button>
            </div>
          )) : (
            [1,2,3].map(i=> (
              <div key={i} className="glass-card p-6 animate-pulse h-56"/>
            ))
          )}
        </div>
      </Section>
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
    <div className="min-h-screen text-slate-200"><Navbar/>
      <Section title="Checkout" subtitle={`Plan: ${planSlug}`}> 
        <div className="max-w-md glass-card p-6">
          <p className="mb-4 text-slate-300">You will be redirected to PayPal to complete your purchase. For this demo, we simulate the approval and completion.</p>
          <button onClick={startCheckout} className="w-full btn-primary disabled:opacity-50" disabled={status==='creating' || status==='completed'}>
            {status==='creating' ? 'Creating order...' : status==='completed' ? 'Completed' : 'Pay with PayPal'}
          </button>
          {status==='error' && <p className="text-rose-400 text-sm mt-3">There was a problem starting checkout.</p>}
        </div>
      </Section>
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
    <div className="min-h-screen text-slate-200"><Navbar/>
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
          <button className="w-full btn-primary">Log in</button>
          <p className="text-sm text-slate-400">No account? <Link to="/signup" className="text-white underline">Sign up</Link></p>
        </form>
      </Section>
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
    <div className="min-h-screen text-slate-200"><Navbar/>
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
          <button className="w-full btn-primary">Create account</button>
          <p className="text-sm text-slate-400">Already have an account? <Link to="/login" className="text-white underline">Log in</Link></p>
        </form>
      </Section>
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
    <div className="min-h-screen text-slate-200"><Navbar/>
      <Section title="Your dashboard" subtitle={`Welcome back${user?.name ? ', '+user.name : ''}!`}>
        <div className="grid md:grid-cols-3 gap-6">
          <Card title="Orders" desc="View your purchases" to="/orders"/>
          <Card title="Settings" desc="Manage your account" to="/settings"/>
          <Card title="Explore plans" desc="Buy more bots" to="/pricing"/>
        </div>
      </Section>
      <Footer/></div>
  )
}

function Card({title,desc,to}){
  return (
    <Link to={to} className="glass-card p-6 hover:border-cyan-400/20 transition">
      <div className="text-white font-semibold mb-1">{title}</div>
      <div className="text-slate-400 text-sm">{desc}</div>
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
    <div className="min-h-screen text-slate-200"><Navbar/>
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
      <Footer/></div>
  )
}

function Settings(){
  const { user } = useAuth()
  return (
    <div className="min-h-screen text-slate-200"><Navbar/>
      <Section title="Settings">
        <div className="max-w-md glass-card p-6">
          <div className="mb-2">Name: <span className="text-white">{user?.name}</span></div>
          <div className="mb-2">Email: <span className="text-white">{user?.email}</span></div>
          <p className="text-slate-400 text-sm">Profile editing is simplified for the demo.</p>
        </div>
      </Section>
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
    <div className="min-h-screen text-slate-200"><Navbar/>
      <Section title="Owner login" subtitle="Enter the owner password">
        <form onSubmit={onSubmit} className="max-w-md glass-card p-6 space-y-4">
          {error && <div className="text-rose-400 text-sm">{error}</div>}
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60" placeholder="Password" required/>
          <button className="w-full btn-primary">Enter</button>
        </form>
      </Section>
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
    <div className="min-h-screen text-slate-200"><Navbar/>
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
    <div className="min-h-screen text-slate-200"><Navbar/>
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
            <button className="w-full btn-primary">Create Plan</button>
          </div>
        </form>
      </Section>
      <Footer/></div>
  )
}

// ----- Simple content pages (to reach 15+ pages) -----
const SimplePage = ({title, body}) => (
  <div className="min-h-screen text-slate-200"><Navbar/>
    <Section title={title}><p className="text-slate-300 max-w-3xl">{body||'Content coming soon.'}</p></Section>
    <Footer/></div>
)

function Blog(){
  return (
    <div className="min-h-screen text-slate-200"><Navbar/>
      <Section title="Blog" subtitle="Latest tips for automation sellers">
        <div className="grid md:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i=> (
            <Link key={i} to={`/blog/${i}`} className="glass-card p-5 hover:border-cyan-400/20 transition">
              <div className="text-white font-semibold mb-1">Post #{i}</div>
              <div className="text-slate-400 text-sm">How to scale your bot sales</div>
            </Link>
          ))}
        </div>
      </Section>
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
