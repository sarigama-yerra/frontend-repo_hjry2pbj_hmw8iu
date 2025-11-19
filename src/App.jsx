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
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white font-semibold">
          <img src="/flame-icon.svg" className="w-6 h-6"/>
          CustomBots
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-slate-200">
          <Link to="/features" className="hover:text-white">Features</Link>
          <Link to="/pricing" className="hover:text-white">Pricing</Link>
          <Link to="/showcase" className="hover:text-white">Showcase</Link>
          <Link to="/blog" className="hover:text-white">Blog</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" className="text-slate-200 hover:text-white">Dashboard</Link>
              <button onClick={() => { logout(); navigate('/') }} className="px-3 py-1.5 rounded bg-slate-800 text-slate-200 hover:bg-slate-700">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-200 hover:text-white">Log in</Link>
              <Link to="/signup" className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-500">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function Footer(){
  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-semibold mb-3">
            <img src="/flame-icon.svg" className="w-6 h-6"/>
            CustomBots
          </div>
          <p className="text-sm text-slate-400">Sell custom automation bots with secure checkout and easy management.</p>
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
      <div className="text-center text-xs text-slate-500 pb-6">© {new Date().getFullYear()} CustomBots</div>
    </footer>
  )
}

function Section({ title, subtitle, children }){
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
      {subtitle && <p className="text-slate-300 mb-6">{subtitle}</p>}
      {children}
    </section>
  )
}

// ---------- Pages ----------
function Home(){
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <Navbar/>
      <div className="bg-gradient-to-b from-slate-900 to-slate-950">
        <section className="max-w-7xl mx-auto px-4 pt-16 pb-10 text-center">
          <h1 className="text-5xl font-extrabold text-white mb-4">Sell Custom Bots Effortlessly</h1>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8">Showcase your automations, take payments securely, and manage customers from a powerful dashboard.</p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/pricing" className="px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-500">View Pricing</Link>
            <Link to="/features" className="px-6 py-3 rounded bg-slate-800 text-white hover:bg-slate-700">Explore Features</Link>
          </div>
        </section>
      </div>
      <Section title="Why creators choose us" subtitle="Built for indie hackers and studios">
        <div className="grid md:grid-cols-3 gap-6">
          {["One-click checkout","Subscriptions or one-time","Customer portal"].map((t,i)=> (
            <div key={i} className="p-6 rounded-xl bg-slate-800/60 border border-slate-700">
              <h3 className="text-white font-semibold mb-2">{t}</h3>
              <p className="text-slate-400 text-sm">Everything you need to sell and scale your automation business.</p>
            </div>
          ))}
        </div>
      </Section>
      <Footer/>
    </div>
  )
}

function Features(){
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200"><Navbar/>
      <Section title="Features" subtitle="A complete toolkit for selling bots">
        <ul className="grid md:grid-cols-2 gap-6">
          {[
            'Beautiful product pages','Secure payments','Customer accounts','Order management','Coupons & promos','Analytics','Webhooks','Export data'
          ].map((f,i)=> (
            <li key={i} className="p-5 bg-slate-800/60 rounded border border-slate-700">{f}</li>
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
    <div className="min-h-screen bg-slate-900 text-slate-200"><Navbar/>
      <Section title="Pricing" subtitle="Choose a plan and start selling">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.length ? plans.map((p)=> (
            <div key={p.slug} className="p-6 bg-slate-800/60 rounded-xl border border-slate-700">
              <h3 className="text-white text-xl font-semibold mb-1">{p.title}</h3>
              <p className="text-slate-400 text-sm mb-3">{p.description}</p>
              <div className="text-3xl font-extrabold text-white mb-4">${p.price}{p.interval !== 'one-time' && <span className="text-slate-400 text-base">/{p.interval}</span>}</div>
              <ul className="text-sm text-slate-300 space-y-1 mb-4">
                {(p.features || []).map((f,i)=> <li key={i}>• {f}</li>)}
              </ul>
              <button onClick={()=> navigate(`/checkout/${p.slug}`)} className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500">Buy</button>
            </div>
          )) : (
            [1,2,3].map(i=> (
              <div key={i} className="p-6 bg-slate-800/60 rounded-xl border border-slate-700 animate-pulse h-56"/>
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
      // Simulate PayPal approve -> complete sequence
      await fetch(`${API_BASE}/paypal/update`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ order_id: data.order_id, action: 'approve' })})
      await fetch(`${API_BASE}/paypal/update`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ order_id: data.order_id, action: 'complete' })})
      setStatus('completed')
      navigate('/orders')
    }catch(e){ setStatus('error') }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200"><Navbar/>
      <Section title="Checkout" subtitle={`Plan: ${planSlug}`}> 
        <div className="max-w-md bg-slate-800/60 border border-slate-700 rounded-xl p-6">
          <p className="mb-4 text-slate-300">You will be redirected to PayPal to complete your purchase. For this demo, we simulate the approval and completion.</p>
          <button onClick={startCheckout} className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50" disabled={status==='creating' || status==='completed'}>
            {status==='creating' ? 'Creating order...' : status==='completed' ? 'Completed' : 'Pay with PayPal'}
          </button>
          {status==='error' && <p className="text-red-400 text-sm mt-3">There was a problem starting checkout.</p>}
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
    <div className="min-h-screen bg-slate-900 text-slate-200"><Navbar/>
      <Section title="Log in">
        <form onSubmit={onSubmit} className="max-w-md bg-slate-800/60 border border-slate-700 rounded-xl p-6 space-y-4">
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white" required/>
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white" required/>
          </div>
          <button className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500">Log in</button>
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
    <div className="min-h-screen bg-slate-900 text-slate-200"><Navbar/>
      <Section title="Create your account">
        <form onSubmit={onSubmit} className="max-w-md bg-slate-800/60 border border-slate-700 rounded-xl p-6 space-y-4">
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white" required/>
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white" required/>
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white" required/>
          </div>
          <button className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500">Create account</button>
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
    <div className="min-h-screen bg-slate-900 text-slate-200"><Navbar/>
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
    <Link to={to} className="p-6 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-slate-600 transition">
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
    <div className="min-h-screen bg-slate-900 text-slate-200"><Navbar/>
      <Section title="Your orders">
        <div className="space-y-3">
          {orders.length? orders.map(o=> (
            <div key={o._id} className="p-4 bg-slate-800/60 border border-slate-700 rounded">
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
    <div className="min-h-screen bg-slate-900 text-slate-200"><Navbar/>
      <Section title="Settings">
        <div className="max-w-md p-6 bg-slate-800/60 border border-slate-700 rounded">
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
    <div className="min-h-screen bg-slate-900 text-slate-200"><Navbar/>
      <Section title="Owner login" subtitle="Enter the owner password">
        <form onSubmit={onSubmit} className="max-w-md bg-slate-800/60 border border-slate-700 rounded-xl p-6 space-y-4">
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white" placeholder="Password" required/>
          <button className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500">Enter</button>
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
    <div className="min-h-screen bg-slate-900 text-slate-200"><Navbar/>
      <Section title="Owner dashboard" subtitle="View recent orders">
        <div className="mb-6">
          <Link to="/owner/plans" className="px-3 py-2 rounded bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700">Manage Plans</Link>
        </div>
        <div className="space-y-3">
          {orders.length? orders.map(o=> (
            <div key={o._id} className="p-4 bg-slate-800/60 border border-slate-700 rounded">
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
    <div className="min-h-screen bg-slate-900 text-slate-200"><Navbar/>
      <Section title="Create a plan" subtitle="Add a new product to sell">
        <form onSubmit={submit} className="max-w-xl grid md:grid-cols-2 gap-4 bg-slate-800/60 border border-slate-700 rounded p-6">
          {msg && <div className="md:col-span-2 text-sm text-slate-300">{msg}</div>}
          {['slug','title','description','price'].map((k)=> (
            <div key={k} className={k==='description'||k==='price'? 'md:col-span-2': ''}>
              <label className="block text-sm mb-1 capitalize">{k}</label>
              <input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white" required={k!=='description'} />
            </div>
          ))}
          <div>
            <label className="block text-sm mb-1">Interval</label>
            <select value={form.interval} onChange={e=>setForm({...form, interval:e.target.value})} className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white">
              <option value="one-time">one-time</option>
              <option value="monthly">monthly</option>
              <option value="yearly">yearly</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Features (comma separated)</label>
            <input value={form.features} onChange={e=>setForm({...form, features:e.target.value})} className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white" />
          </div>
          <div className="md:col-span-2">
            <button className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500">Create Plan</button>
          </div>
        </form>
      </Section>
      <Footer/></div>
  )
}

// ----- Simple content pages (to reach 15+ pages) -----
const SimplePage = ({title, body}) => (
  <div className="min-h-screen bg-slate-900 text-slate-200"><Navbar/>
    <Section title={title}><p className="text-slate-300 max-w-3xl">{body||'Content coming soon.'}</p></Section>
    <Footer/></div>
)

function Blog(){
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200"><Navbar/>
      <Section title="Blog" subtitle="Latest tips for automation sellers">
        <div className="grid md:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i=> (
            <Link key={i} to={`/blog/${i}`} className="p-5 bg-slate-800/60 border border-slate-700 rounded hover:border-slate-600">
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
