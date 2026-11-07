import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { getDatabase, onValue, ref, set } from 'firebase/database'
import { initialPortfolioData, type PortfolioData, type Project, type Skill, type SocialLink, type TimelineItem } from '../data/portfolio'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean)
const app = isFirebaseConfigured ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : null
export const auth = app ? getAuth(app) : null
const database = app ? getDatabase(app) : null

const asArray = <T>(value: unknown, fallback: T[]): T[] => Array.isArray(value) ? value : fallback

const normalizePortfolio = (value: Partial<PortfolioData> | null): PortfolioData => ({
  portfolio: {
    ...initialPortfolioData.portfolio,
    ...(value?.portfolio ?? {}),
    socials: asArray<SocialLink>(value?.portfolio?.socials, initialPortfolioData.portfolio.socials).map(social => ({
      label: String(social?.label ?? ''),
      url: String(social?.url ?? ''),
    })),
  },
  skills: asArray<Skill>(value?.skills, initialPortfolioData.skills).map(skill => ({
    name: String(skill?.name ?? ''),
    type: String(skill?.type ?? ''),
  })),
  projects: asArray<Project>(value?.projects, initialPortfolioData.projects).map(project => ({
    title: String(project?.title ?? ''),
    category: String(project?.category ?? ''),
    description: String(project?.description ?? ''),
    stack: Array.isArray(project?.stack) ? project.stack.map(tag => String(tag ?? '')) : [],
    demo: String(project?.demo ?? ''),
    github: String(project?.github ?? ''),
    image: String(project?.image ?? ''),
  })),
  experience: asArray<TimelineItem>(value?.experience, initialPortfolioData.experience).map(item => ({
    period: String(item?.period ?? ''),
    title: String(item?.title ?? ''),
    place: String(item?.place ?? ''),
    detail: String(item?.detail ?? ''),
  })),
  education: asArray<TimelineItem>(value?.education, initialPortfolioData.education).map(item => ({
    period: String(item?.period ?? ''),
    title: String(item?.title ?? ''),
    place: String(item?.place ?? ''),
    detail: String(item?.detail ?? ''),
  })),
})

export const loginAdmin = async (email: string, password: string) => {
  if (!auth) throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* values to your .env file.')
  return signInWithEmailAndPassword(auth, email, password)
}

export const logoutAdmin = async () => {
  if (auth) await signOut(auth)
}

export const subscribeToPortfolio = (onChange: (data: PortfolioData) => void, onError: (error: Error) => void) => {
  if (!database) {
    onChange(initialPortfolioData)
    return () => undefined
  }
  return onValue(ref(database, 'portfolio'), snapshot => {
    onChange(normalizePortfolio(snapshot.val() as Partial<PortfolioData> | null))
  }, error => onError(error))
}

export const savePortfolio = async (data: PortfolioData) => {
  if (!database) throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* values to your .env file.')
  await set(ref(database, 'portfolio'), data)
}

export type AdminUser = User
