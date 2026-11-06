import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Volume2, VolumeX, Maximize2, Menu, X, Compass } from 'lucide-react'
import Room, { type RoomTarget } from './three/Room'
import Intro from './components/Intro'
import Panel from './components/Panel'
import { initialPortfolioData, type PortfolioData } from './data/portfolio'
import { useReducedMotion } from './hooks/useReducedMotion'
import Admin from './components/Admin'
import { subscribeToPortfolio } from './lib/firebase'

const navItems: { label: string; target: RoomTarget }[] = [
  { label: 'ABOUT', target: 'about' }, { label: 'SKILLS', target: 'skills' },
  { label: 'PROJECTS', target: 'projects' }, { label: 'JOURNEY', target: 'experience' },
  { label: 'CONTACT', target: 'contact' },
]

export default function App() {
  const [data, setData] = useState<PortfolioData>(initialPortfolioData)
  const [intro, setIntro] = useState(true)
  const [target, setTarget] = useState<RoomTarget | null>(null)
  const [sound, setSound] = useState(false)
  const [menu, setMenu] = useState(false)
  const [compact, setCompact] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => subscribeToPortfolio(setData, error => console.error('Portfolio sync failed:', error)), [])

  useEffect(() => {
    const update = () => setCompact(window.innerWidth < 760)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  if (window.location.pathname === '/admin') return <Admin data={data} onDataChange={setData} />

  const enter = () => { setIntro(false); setTarget(null) }
  const open = (value: RoomTarget) => { setIntro(false); setTarget(value); setMenu(false) }
  const fullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
    else document.exitFullscreen?.()
  }

  return <main className="app-shell">
    <div className="scene-wrap"><Room onSelect={open} compact={compact}/></div>
    <div className="scene-vignette"/>
    <header className="site-header">
      <button className="wordmark" onClick={() => { setIntro(false); setTarget(null) }}><span className="brand-mark">DR<span>®</span></span><span>THE DIGITAL<br/><b>ROOM</b></span></button>
      <nav className="desktop-nav">{navItems.map(item => <button key={item.target} className={target === item.target ? 'active' : ''} onClick={() => open(item.target)}>{item.label}</button>)}</nav>
      <div className="header-controls"><button className="icon-button" onClick={() => setSound(!sound)} aria-label="Toggle sound">{sound ? <Volume2 size={17}/> : <VolumeX size={17}/>}</button><button className="icon-button" onClick={fullscreen} aria-label="Toggle fullscreen"><Maximize2 size={16}/></button><button className="icon-button mobile-menu" onClick={() => setMenu(!menu)} aria-label="Toggle menu">{menu ? <X size={18}/> : <Menu size={18}/>}</button></div>
    </header>
    <AnimatePresence>{menu && <div className="mobile-nav">{navItems.map(item => <button key={item.target} onClick={() => open(item.target)}>{item.label}<ArrowUpRight size={15}/></button>)}</div>}</AnimatePresence>
    {!intro && <div className="scene-label"><span className="status-dot"/> LIVE ENVIRONMENT <span className="label-divider"/> INTERACTIVE 3D SPACE</div>}
    {!intro && !target && <div className="explore-hint"><Compass size={15}/> {compact ? 'TAP AN OBJECT TO EXPLORE' : 'CLICK AN OBJECT TO EXPLORE'}<span>•</span> MOVE TO LOOK AROUND</div>}
    {!intro && <div className="room-footer"><span>© 2026 {data.portfolio.name}</span><span>BUILT WITH CURIOSITY <b>✳</b></span><a href={`mailto:${data.portfolio.email}`}>LET'S TALK <ArrowUpRight size={13}/></a></div>}
    <AnimatePresence>{target && <Panel target={target} data={data} onClose={() => setTarget(null)} />}</AnimatePresence>
    <AnimatePresence>{intro && <Intro portfolio={data.portfolio} onEnter={enter} onProjects={() => open('projects')} onSkip={enter}/>}</AnimatePresence>
    {reducedMotion && <div className="motion-note">Reduced motion preference enabled.</div>}
  </main>
}