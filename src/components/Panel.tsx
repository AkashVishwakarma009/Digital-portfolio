import { motion } from 'framer-motion'
import { ArrowUpRight, X, Github, ExternalLink, Mail, Terminal } from 'lucide-react'
import type { PortfolioData } from '../data/portfolio'
import type { RoomTarget } from '../three/Room'

type Props = { target: RoomTarget; onClose: () => void; data: PortfolioData }
export default function Panel({ target, onClose, data }: Props) {
  const { portfolio, projects, skills, experience, education } = data
  const title: Record<RoomTarget, string> = { projects: 'Selected work', skills: 'Tools of the trade', about: 'A little about me', experience: 'The journey', contact: 'Open a connection' }
  return <motion.aside className="detail-panel" initial={{ opacity: 0, x: 35, filter: 'blur(8px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: 25 }} transition={{ duration: .35 }}>
    <div className="panel-top"><span className="eyebrow">ROOM DIRECTORY / {target.toUpperCase()}</span><button className="icon-button" onClick={onClose} aria-label="Close panel"><X size={18}/></button></div>
    <h2>{title[target]}</h2>
    {target === 'about' && <><p className="lead">{portfolio.intro}</p><div className="info-grid"><div><span>BASED IN</span><strong>{portfolio.location}</strong></div><div><span>FOCUS</span><strong>Web & creative development</strong></div></div><a className="action-link" href="/resume.pdf" download>Download resume <ArrowUpRight size={16}/></a></>}
    {target === 'skills' && <><p className="muted">A living toolkit for building polished, reliable digital experiences.</p><div className="skill-list">{skills.map((skill) => <div className="skill-row" key={skill.name}><span>{skill.name}</span><small>{skill.type}</small></div>)}</div></>}
    {target === 'projects' && <div className="project-list">{projects.map((project, index) => <article className="project-card" key={project.title}><div className="project-number">0{index + 1} / FEATURED PROJECT</div><h3>{project.title}</h3><p>{project.description}</p><div className="tags">{project.stack.map(tag => <span key={tag}>{tag}</span>)}</div><div className="project-links"><a href={project.demo} target="_blank" rel="noreferrer">Live demo <ExternalLink size={14}/></a><a href={project.github} target="_blank" rel="noreferrer"><Github size={14}/> Source <ArrowUpRight size={14}/></a></div></article>)}</div>}
    {target === 'experience' && <><p className="muted">Replace these editable entries with your real milestones.</p><h3 className="subhead">EXPERIENCE</h3>{experience.map(item => <div className="timeline-item" key={item.period}><span>{item.period}</span><h3>{item.title}</h3><b>{item.place}</b><p>{item.detail}</p></div>)}<h3 className="subhead">EDUCATION & CERTIFICATIONS</h3>{education.map(item => <div className="timeline-item" key={item.title}><span>{item.period}</span><h3>{item.title}</h3><b>{item.place}</b><p>{item.detail}</p></div>)}</>}
    {target === 'contact' && <><p className="lead">Have an interesting idea? Let's make something meaningful together.</p><a className="contact-email" href={`mailto:${portfolio.email}`}><Mail size={18}/>{portfolio.email}<ArrowUpRight size={17}/></a><div className="social-list">{portfolio.socials.map(s => <a key={s.label} href={s.url} target="_blank" rel="noreferrer">{s.label}<ArrowUpRight size={15}/></a>)}</div><div className="terminal-note"><Terminal size={15}/> CONNECTION STATUS: READY</div></>}
  </motion.aside>
}