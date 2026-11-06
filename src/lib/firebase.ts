import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { getDatabase, onValue, ref, set } from 'firebase/database'
import { initialPortfolioData, type PortfolioData } from '../data/portfolio'

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
    const value = snapshot.val() as Partial<PortfolioData> | null
    onChange({
      ...initialPortfolioData,
      ...value,
      portfolio: { ...initialPortfolioData.portfolio, ...(value?.portfolio ?? {}) },
      skills: value?.skills ?? initialPortfolioData.skills,
      projects: value?.projects ?? initialPortfolioData.projects,
      experience: value?.experience ?? initialPortfolioData.experience,
      education: value?.education ?? initialPortfolioData.education,
    })
  }, error => onError(error))
}

export const savePortfolio = async (data: PortfolioData) => {
  if (!database) throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* values to your .env file.')
  await set(ref(database, 'portfolio'), data)
}

export type AdminUser = User
