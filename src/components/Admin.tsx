import { useEffect, useState, type FormEvent } from 'react'
import { LogOut, Plus, Save, Trash2 } from 'lucide-react'
import type { PortfolioData, Project, Skill, SocialLink, TimelineItem } from '../data/portfolio'
import { auth, isFirebaseConfigured, loginAdmin, logoutAdmin, savePortfolio } from '../lib/firebase'
import { onAuthStateChanged, type User } from 'firebase/auth'

type Props = { data: PortfolioData; onDataChange: (data: PortfolioData) => void }

const emptyProject: Project = { title: '', category: '', description: '', stack: [], demo: '', github: '', image: '' }
const emptySkill: Skill = { name: '', type: '' }
const emptySocial: SocialLink = { label: '', url: '' }
const emptyTimeline: TimelineItem = { period: '', title: '', place: '', detail: '' }

export default function Admin({ data, onDataChange }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [draft, setDraft] = useState(data)
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'skills' | 'journey'>('profile')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setDraft(data)
  }, [data])

  useEffect(() => {
    if (!auth) return
    return onAuthStateChanged(auth, setUser)
  }, [])

  const updateProfile = (field: keyof PortfolioData['portfolio'], value: string) => {
    setDraft(current => ({ ...current, portfolio: { ...current.portfolio, [field]: value } }))
  }

  const updateProject = (index: number, field: keyof Project, value: string) => {
    setDraft(current => ({
      ...current,
      projects: current.projects.map((project, projectIndex) => projectIndex === index
        ? { ...project, [field]: field === 'stack' ? value.split(',').map(item => item.trim()).filter(Boolean) : value }
        : project),
    }))
  }

  const updateSkill = (index: number, field: keyof Skill, value: string) => {
    setDraft(current => ({ ...current, skills: current.skills.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) }))
  }

  const updateTimeline = (list: 'experience' | 'education', index: number, field: keyof TimelineItem, value: string) => {
    setDraft(current => ({ ...current, [list]: current[list].map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) }))
  }

  const deleteSkill = (index: number) => {
    setDraft(current => ({ ...current, skills: current.skills.filter((_, itemIndex) => itemIndex !== index) }))
  }

  const deleteTimeline = (list: 'experience' | 'education', index: number) => {
    setDraft(current => ({ ...current, [list]: current[list].filter((_, itemIndex) => itemIndex !== index) }))
  }

  const save = async () => {
    setError('')
    setMessage('')
    try {
      await savePortfolio(draft)
      onDataChange(draft)
      setMessage('Portfolio synced successfully.')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save portfolio.')
    }
  }

  const login = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    try {
      await loginAdmin(email, password)
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in.')
    }
  }

  if (!user) {
    return <main className="admin-shell"><section className="admin-login">
      <div className="brand-mark">DR<span>®</span></div>
      <span className="eyebrow">THE DIGITAL ROOM / ADMIN ACCESS</span>
      <h1>Control your<br/><em>digital space.</em></h1>
      {!isFirebaseConfigured && <p className="admin-warning">Firebase is not configured. Copy <b>.env.example</b> to <b>.env</b> and add your Firebase project values.</p>}
      <form onSubmit={login}>
        <label>Email<input type="email" value={email} onChange={event => setEmail(event.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={event => setPassword(event.target.value)} required /></label>
        <button className="primary-button admin-submit" type="submit">Sign in <Save size={15}/></button>
      </form>
      {error && <p className="admin-error">{error}</p>}
      <a className="admin-back" href="/">← Back to portfolio</a>
    </section></main>
  }

  return <main className="admin-shell"><div className="admin-layout">
    <aside className="admin-sidebar">
      <div className="admin-brand"><span className="brand-mark">DR<span>®</span></span><span>ADMIN<br/><b>CONSOLE</b></span></div>
      <span className="admin-status"><i/> AUTHENTICATED</span>
      <nav><button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>PROFILE SYSTEM</button><button className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}>PROJECT ARCHIVE</button><button className={activeTab === 'skills' ? 'active' : ''} onClick={() => setActiveTab('skills')}>SKILLS & LINKS</button><button className={activeTab === 'journey' ? 'active' : ''} onClick={() => setActiveTab('journey')}>JOURNEY</button></nav>
      <button className="admin-logout" onClick={() => logoutAdmin()}><LogOut size={15}/> Sign out</button>
    </aside>
    <section className="admin-content">
      <header className="admin-header"><div><span className="eyebrow">ADMIN CONSOLE / {activeTab.toUpperCase()}</span><h1>{activeTab === 'profile' ? 'Profile system' : activeTab === 'projects' ? 'Project archive' : activeTab === 'skills' ? 'Skills & links' : 'Journey editor'}</h1></div><button className="primary-button" onClick={save}><Save size={15}/> Save changes</button></header>
      {message && <p className="admin-success">{message}</p>}{error && <p className="admin-error">{error}</p>}
      {activeTab === 'profile' && <div className="admin-grid">
        <label>Display name<input value={draft.portfolio.name} onChange={event => updateProfile('name', event.target.value)} /></label>
        <label>Role<input value={draft.portfolio.role} onChange={event => updateProfile('role', event.target.value)} /></label>
        <label>Tagline<input value={draft.portfolio.tagline} onChange={event => updateProfile('tagline', event.target.value)} /></label>
        <label>Email<input type="email" value={draft.portfolio.email} onChange={event => updateProfile('email', event.target.value)} /></label>
        <label>Location<input value={draft.portfolio.location} onChange={event => updateProfile('location', event.target.value)} /></label>
        <label>Introduction<textarea value={draft.portfolio.intro} onChange={event => updateProfile('intro', event.target.value)} /></label>
      </div>}
      {activeTab === 'projects' && <div className="admin-projects">
        <button className="secondary-button add-project" onClick={() => setDraft(current => ({ ...current, projects: [...current.projects, emptyProject] }))}><Plus size={15}/> Add project</button>
        {draft.projects.map((project, index) => <article className="admin-project" key={`project-${index}`}>
          <div className="admin-project-heading"><span>PROJECT {String(index + 1).padStart(2, '0')}</span><button className="delete-button" onClick={() => setDraft(current => ({ ...current, projects: current.projects.filter((_, projectIndex) => projectIndex !== index) }))}><Trash2 size={15}/> Delete</button></div>
          <div className="admin-grid"><label>Title<input value={project.title ?? ''} onChange={event => updateProject(index, 'title', event.target.value)} /></label><label>Category<input value={project.category ?? ''} onChange={event => updateProject(index, 'category', event.target.value)} /></label><label>Tech stack <small>comma separated</small><input value={(project.stack ?? []).join(', ')} onChange={event => updateProject(index, 'stack', event.target.value)} /></label><label>Live demo URL<input value={project.demo ?? ''} onChange={event => updateProject(index, 'demo', event.target.value)} /></label><label>GitHub URL<input value={project.github ?? ''} onChange={event => updateProject(index, 'github', event.target.value)} /></label><label>Image URL or path <small>host the image elsewhere first</small><input value={project.image ?? ''} onChange={event => updateProject(index, 'image', event.target.value)} placeholder="https://... or /images/project.jpg" /></label><label className="full-width">Description<textarea value={project.description ?? ''} onChange={event => updateProject(index, 'description', event.target.value)} /></label></div>
        </article>)}
      </div>}
      {activeTab === 'skills' && <div className="admin-projects">
        <section className="admin-project"><div className="admin-project-heading"><span>SKILLS</span><button className="secondary-button compact-button" onClick={() => setDraft(current => ({ ...current, skills: [...current.skills, emptySkill] }))}><Plus size={14}/> Add skill</button></div>{draft.skills.map((skill, index) => <div className="admin-inline-row" key={`skill-${index}`}><input placeholder="Skill name" value={skill.name} onChange={event => updateSkill(index, 'name', event.target.value)} /><input placeholder="Category" value={skill.type} onChange={event => updateSkill(index, 'type', event.target.value)} /><button className="delete-button" onClick={() => deleteSkill(index)}><Trash2 size={15}/></button></div>)}</section>
        <section className="admin-project"><div className="admin-project-heading"><span>SOCIAL LINKS</span><button className="secondary-button compact-button" onClick={() => setDraft(current => ({ ...current, portfolio: { ...current.portfolio, socials: [...current.portfolio.socials, emptySocial] } }))}><Plus size={14}/> Add link</button></div>{draft.portfolio.socials.map((social, index) => <div className="admin-inline-row" key={`${social.label}-${index}`}><input placeholder="Label" value={social.label} onChange={event => setDraft(current => ({ ...current, portfolio: { ...current.portfolio, socials: current.portfolio.socials.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item) } }))} /><input placeholder="URL" value={social.url} onChange={event => setDraft(current => ({ ...current, portfolio: { ...current.portfolio, socials: current.portfolio.socials.map((item, itemIndex) => itemIndex === index ? { ...item, url: event.target.value } : item) } }))} /><button className="delete-button" onClick={() => setDraft(current => ({ ...current, portfolio: { ...current.portfolio, socials: current.portfolio.socials.filter((_, itemIndex) => itemIndex !== index) } }))}><Trash2 size={15}/></button></div>)}</section>
      </div>}
      {activeTab === 'journey' && <div className="admin-projects">
        <TimelineEditor title="EXPERIENCE" items={draft.experience} onAdd={() => setDraft(current => ({ ...current, experience: [...current.experience, emptyTimeline] }))} onChange={(index, field, value) => updateTimeline('experience', index, field, value)} onDelete={index => deleteTimeline('experience', index)} />
        <TimelineEditor title="EDUCATION & CERTIFICATIONS" items={draft.education} onAdd={() => setDraft(current => ({ ...current, education: [...current.education, emptyTimeline] }))} onChange={(index, field, value) => updateTimeline('education', index, field, value)} onDelete={index => deleteTimeline('education', index)} />
      </div>}
    </section>
  </div></main>
}

function TimelineEditor({ title, items, onAdd, onChange, onDelete }: { title: string; items: TimelineItem[]; onAdd: () => void; onChange: (index: number, field: keyof TimelineItem, value: string) => void; onDelete: (index: number) => void }) {
  return <section className="admin-project"><div className="admin-project-heading"><span>{title}</span><button className="secondary-button compact-button" onClick={onAdd}><Plus size={14}/> Add entry</button></div>{items.map((item, index) => <div className="admin-timeline-row" key={`${title}-${index}`}><div className="admin-project-heading"><span>ENTRY {String(index + 1).padStart(2, '0')}</span><button className="delete-button" onClick={() => onDelete(index)}><Trash2 size={15}/> Delete</button></div><div className="admin-grid"><label>Period<input value={item.period} onChange={event => onChange(index, 'period', event.target.value)} /></label><label>Title<input value={item.title} onChange={event => onChange(index, 'title', event.target.value)} /></label><label>Place<input value={item.place} onChange={event => onChange(index, 'place', event.target.value)} /></label><label>Details<textarea value={item.detail} onChange={event => onChange(index, 'detail', event.target.value)} /></label></div></div>)}</section>
}
