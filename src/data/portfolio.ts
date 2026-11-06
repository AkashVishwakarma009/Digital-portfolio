export type SocialLink = { label: string; url: string }
export type Project = { title: string; category: string; description: string; stack: string[]; demo: string; github: string; image: string }
export type Skill = { name: string; type: string }
export type TimelineItem = { period: string; title: string; place: string; detail: string }
export type PortfolioProfile = { name: string; role: string; tagline: string; intro: string; email: string; location: string; socials: SocialLink[] }
export type PortfolioData = { portfolio: PortfolioProfile; skills: Skill[]; projects: Project[]; experience: TimelineItem[]; education: TimelineItem[] }

export const initialPortfolioData: PortfolioData = {
  portfolio: {
  name: 'Akash Vishwakarma',
  role: 'FULL STACK DEVELOPER',
  tagline: 'Turning ideas into digital experiences.',
  intro: 'I build thoughtful digital products, immersive interfaces and experiences that make technology feel human.',
  email: 'akashvish9511081008@gmail.com',
  location: 'Kalher Bhiwandi, India',
  socials: [
    { label: 'GitHub', url: 'https://github.com/yourusername' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/yourusername' },
    { label: 'Instagram', url: 'https://instagram.com/yourusername' },
  ],
  },
  skills: [
  { name: 'React', type: 'Frontend' }, { name: 'TypeScript', type: 'Frontend' },
  { name: 'JavaScript', type: 'Frontend' }, { name: 'HTML & CSS', type: 'Frontend' },
  { name: 'Node.js', type: 'Backend' }, { name: 'Supabase', type: 'Backend' },
  { name: 'Firebase', type: 'Backend' }, { name: 'PostgreSQL', type: 'Database' },
  { name: 'Git & GitHub', type: 'Tools' }, { name: 'Three.js', type: 'Creative' },
  ],
  projects: [
  { title: 'Nukkad Fm', category: 'Web application', description: `Nukkad FM is a nostalgic online radio experience inspired by the traditional Indian chai tapri culture. It brings back the golden era of 90s Bollywood music through a thoughtfully designed digital radio platform. Users can enjoy classic Hindi songs, explore a vintage cassette-inspired interface, and discover music through an intuitive audio player. The platform also includes WhatsApp channel integration for music updates and a dedicated admin panel for content management. By combining Indian nostalgia with modern web technology, Nukkad FM delivers an engaging and memorable listening experience.

Key Features:
• Curated 90s Bollywood music streaming experience
• Intuitive audio player with playback controls
• Cassette-inspired visual design
• WhatsApp channel integration for audience engagement
• Dedicated admin panel for content management
• Responsive interface optimized for desktop and mobile.`, stack: ['React', 'TypeScript', 'Supabase'], demo: 'https://example.com', github: 'https://github.com/yourusername/project-one', image: '/images/project-one.jpg' },
  { title: 'PROJECT TWO', category: 'Digital experience', description: 'Show the problem you solved, the approach you took and the result.', stack: ['React', 'Firebase', 'CSS'], demo: 'https://nukkad-chai.web.app/', github: 'https://github.com/yourusername/project-two', image: '/images/project-two.jpg' },
  { title: 'PROJECT THREE', category: 'Creative development', description: 'Add another project with a clear outcome and a few key technologies.', stack: ['Three.js', 'GSAP', 'TypeScript'], demo: 'https://example.com', github: 'https://github.com/yourusername/project-three', image: '/images/project-three.jpg' },
  ],
  experience: [
  { period: '2024 — PRESENT', title: 'Your role / freelance', place: 'Company or independent', detail: 'Add your real responsibilities, contributions and measurable outcomes here.' },
  { period: '2022 — 2024', title: 'Learning & building', place: 'Personal projects', detail: 'Describe relevant projects, internships or practical experience.' },
  ],
  education: [
  { period: 'YEAR — YEAR', title: 'Your qualification', place: 'Institution name', detail: 'Replace this with your real education details.' },
  { period: 'YEAR', title: 'Certification', place: 'Provider', detail: 'Add a real certification or remove this entry.' },
  ],
}

export const { portfolio, skills, projects, experience, education } = initialPortfolioData