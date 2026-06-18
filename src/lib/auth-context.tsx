'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from './firebase'
import { createOrUpdateUser, getUserProfile, UserProfile } from './db'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signInWithGoogle: () => Promise<boolean>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: false,
  signInWithGoogle: async () => false,
  signOut: async () => {},
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(isFirebaseConfigured)

  const loadProfile = async (firebaseUser: User) => {
    try {
      await createOrUpdateUser(firebaseUser.uid, {
        name: firebaseUser.displayName || '',
        email: firebaseUser.email || '',
        photoURL: firebaseUser.photoURL || '',
      })
      const p = await getUserProfile(firebaseUser.uid)
      setProfile(p)
    } catch {
      // Firestore not set up yet — use Firebase Auth data directly
      setProfile({
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || '',
        email: firebaseUser.email || '',
        photoURL: firebaseUser.photoURL || '',
        level: 'Muslimah Journey',
        xp: 0,
        streak: 0,
        joinedAt: null,
        bio: '',
        location: '',
      })
    }
  }

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false)
      return
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        await loadProfile(firebaseUser)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // Returns true if login succeeded, false if failed/cancelled
  const signInWithGoogle = async (): Promise<boolean> => {
    if (!isFirebaseConfigured || !auth) {
      alert('Firebase belum dikonfigurasi.')
      return false
    }
    try {
      await signInWithPopup(auth, googleProvider)
      return true
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        console.error('Google sign in error:', error)
      }
      return false
    }
  }

  const signOut = async () => {
    if (!isFirebaseConfigured || !auth) return
    await firebaseSignOut(auth)
    setProfile(null)
  }

  const refreshProfile = async () => {
    if (user) await loadProfile(user)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
