import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, SkipForward } from 'lucide-react'
import type { PortfolioProfile } from '../data/portfolio'
type Props = { portfolio: PortfolioProfile; onEnter: () => void; onProjects: () => void; onSkip: () => void }
export default function Intro({ portfolio, onEnter, onProjects, onSkip }: Props) {
  return <motion.div className="intro-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .7 }}>
    <div className="intro-grid" />
    <div className="intro-top"><span className="brand-mark">DR<span>®</span></span><span className="eyebrow">INTERACTIVE PORTFOLIO / 2026</span><button onClick={onSkip} className="skip-button">SKIP INTRO <SkipForward size={14}/></button></div>
    <div className="intro-content"><motion.div initial={{ y: 25, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .25 }} className="eyebrow"><span className="status-dot"/> WELCOME TO MY DIGITAL SPACE</motion.div><motion.h1 initial={{ y: 45, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .4, duration: .8 }}>{portfolio.name.split(' ')[0]}<br/><em>builds</em> the future<span className="blue-dot">.</span></motion.h1><motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .8 }}>{portfolio.role} <span>—</span> {portfolio.tagline}</motion.p><motion.div className="intro-actions" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}><button className="primary-button" onClick={onEnter}>Explore my world <ArrowDown size={16}/></button><button className="secondary-button" onClick={onProjects}>View projects <ArrowUpRight size={16}/></button></motion.div></div>
    <div className="intro-bottom"><span>SCROLL TO EXPLORE</span><span>01 — 05 / THE DIGITAL ROOM</span><span>DESIGNED TO BE EXPLORED</span></div>
    <div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="intro-glow"/>
  </motion.div>
}