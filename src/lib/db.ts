import {
  doc, getDoc, setDoc, updateDoc, addDoc, deleteDoc,
  collection, query, where, orderBy, limit,
  getDocs, onSnapshot, serverTimestamp, increment,
  arrayUnion, arrayRemove, Timestamp
} from 'firebase/firestore'
import { db } from './firebase'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string
  name: string
  email: string
  photoURL: string
  level: string
  xp: number
  streak: number
  joinedAt: Timestamp | null
  bio: string
  location: string
}

export interface TrackerEntry {
  date: string
  habits: {
    subuh: boolean
    dzuhur: boolean
    ashar: boolean
    maghrib: boolean
    isya: boolean
    quran: boolean
    dzikir: boolean
    sedekah: boolean
  }
  updatedAt: Timestamp | null
}

export interface JournalEntry {
  id?: string
  date: string
  content: string
  mood: string
  gratitude: string[]
  evaluation: number
  createdAt: Timestamp | null
}

export interface MoodEntry {
  date: string
  score: number
  label: string
  note: string
  createdAt: Timestamp | null
}

export interface CommunityPost {
  id?: string
  userId: string
  userName: string
  userPhoto: string
  content: string
  likes: number
  likedBy: string[]
  comments: number
  tags: string[]
  createdAt: Timestamp | null
}

export interface ChallengeProgress {
  challengeId: number
  title: string
  startDate: string
  completions: Record<string, boolean>
  enrolled: boolean
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export async function createOrUpdateUser(uid: string, data: Partial<UserProfile>) {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      uid,
      name: data.name || '',
      email: data.email || '',
      photoURL: data.photoURL || '',
      level: 'Muslimah Pemula',
      xp: 0,
      streak: 0,
      joinedAt: serverTimestamp(),
      bio: '',
      location: '',
      ...data,
    })
  } else {
    await updateDoc(ref, {
      name: data.name || snap.data().name,
      email: data.email || snap.data().email,
      photoURL: data.photoURL || snap.data().photoURL,
    })
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? (snap.data() as UserProfile) : null
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  await updateDoc(doc(db, 'users', uid), data)
}

// ─── Hijrah Tracker ───────────────────────────────────────────────────────────

export async function saveTrackerEntry(uid: string, entry: TrackerEntry) {
  const ref = doc(db, 'users', uid, 'tracker', entry.date)
  await setDoc(ref, { ...entry, updatedAt: serverTimestamp() }, { merge: true })
}

export async function getTrackerEntry(uid: string, date: string): Promise<TrackerEntry | null> {
  const snap = await getDoc(doc(db, 'users', uid, 'tracker', date))
  return snap.exists() ? (snap.data() as TrackerEntry) : null
}

export async function getTrackerWeek(uid: string, dates: string[]): Promise<Record<string, TrackerEntry>> {
  const result: Record<string, TrackerEntry> = {}
  await Promise.all(dates.map(async (date) => {
    const snap = await getDoc(doc(db, 'users', uid, 'tracker', date))
    if (snap.exists()) result[date] = snap.data() as TrackerEntry
  }))
  return result
}

// ─── Journal ──────────────────────────────────────────────────────────────────

export async function saveJournalEntry(uid: string, entry: Omit<JournalEntry, 'id'>) {
  const ref = collection(db, 'users', uid, 'journal')
  return addDoc(ref, { ...entry, createdAt: serverTimestamp() })
}

export async function getJournalEntries(uid: string, limitCount = 10): Promise<JournalEntry[]> {
  const q = query(
    collection(db, 'users', uid, 'journal'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as JournalEntry))
}

export async function deleteJournalEntry(uid: string, entryId: string) {
  await deleteDoc(doc(db, 'users', uid, 'journal', entryId))
}

// ─── Mood ─────────────────────────────────────────────────────────────────────

export async function saveMoodEntry(uid: string, entry: MoodEntry) {
  const ref = doc(db, 'users', uid, 'mood', entry.date)
  await setDoc(ref, { ...entry, createdAt: serverTimestamp() }, { merge: true })
}

export async function getMoodHistory(uid: string, days = 7): Promise<MoodEntry[]> {
  const q = query(
    collection(db, 'users', uid, 'mood'),
    orderBy('date', 'desc'),
    limit(days)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data() as MoodEntry)
}

// ─── Community Posts ──────────────────────────────────────────────────────────

export async function createPost(post: Omit<CommunityPost, 'id' | 'likes' | 'likedBy' | 'comments'>) {
  return addDoc(collection(db, 'community'), {
    ...post,
    likes: 0,
    likedBy: [],
    comments: 0,
    createdAt: serverTimestamp(),
  })
}

export async function getPosts(limitCount = 20): Promise<CommunityPost[]> {
  const q = query(
    collection(db, 'community'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as CommunityPost))
}

export async function toggleLike(postId: string, uid: string, isLiked: boolean) {
  const ref = doc(db, 'community', postId)
  if (isLiked) {
    await updateDoc(ref, { likes: increment(-1), likedBy: arrayRemove(uid) })
  } else {
    await updateDoc(ref, { likes: increment(1), likedBy: arrayUnion(uid) })
  }
}

// ─── Challenge Progress ───────────────────────────────────────────────────────

export async function enrollChallenge(uid: string, challengeId: number, title: string) {
  const ref = doc(db, 'users', uid, 'challenges', String(challengeId))
  await setDoc(ref, {
    challengeId,
    title,
    startDate: new Date().toISOString().split('T')[0],
    completions: {},
    enrolled: true,
  }, { merge: true })
}

export async function markChallengeDay(uid: string, challengeId: number, date: string, done: boolean) {
  const ref = doc(db, 'users', uid, 'challenges', String(challengeId))
  await updateDoc(ref, { [`completions.${date}`]: done })
}

export async function getChallenges(uid: string): Promise<ChallengeProgress[]> {
  const snap = await getDocs(collection(db, 'users', uid, 'challenges'))
  return snap.docs.map(d => d.data() as ChallengeProgress)
}

// ─── Quiz (SM-2 Spaced Repetition) ───────────────────────────────────────────

export interface QuizCardState {
  questionId: string
  easeFactor: number
  interval: number
  repetitions: number
  nextReview: string // ISO date string
}

// ─── Kajian Q&A ───────────────────────────────────────────────────────────────

export interface KajianQuestion {
  id: string
  sessionId: string
  userId: string
  userName: string
  text: string
  upvotes: number
  upvotedBy: string[]
  timestamp: string
}

// ─── Marketplace ──────────────────────────────────────────────────────────────

export interface MarketProduct {
  id: string
  name: string
  seller: string
  price: number
  category: string
  rating: number
  reviews: number
  stock: number
  description: string
  tags: string[]
}

export interface MarketOrder {
  id: string
  userId: string
  productId: string
  productName: string
  qty: number
  total: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'completed'
  escrowHeld: boolean
  createdAt: string
}

// ─── Kajian Firestore Functions ───────────────────────────────────────────────

export async function submitKajianQuestion(
  sessionId: string,
  question: Omit<KajianQuestion, 'id'>
) {
  const ref = collection(db, 'kajian', sessionId, 'questions')
  return addDoc(ref, {
    ...question,
    upvotes: 0,
    upvotedBy: [],
    timestamp: new Date().toISOString(),
  })
}

export async function getKajianQuestions(sessionId: string): Promise<KajianQuestion[]> {
  const q = query(
    collection(db, 'kajian', sessionId, 'questions'),
    orderBy('upvotes', 'desc'),
    limit(50)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as KajianQuestion))
}

export async function upvoteKajianQuestion(
  sessionId: string,
  questionId: string,
  uid: string,
  alreadyVoted: boolean
) {
  const ref = doc(db, 'kajian', sessionId, 'questions', questionId)
  if (alreadyVoted) {
    await updateDoc(ref, {
      upvotes: increment(-1),
      upvotedBy: arrayRemove(uid),
    })
  } else {
    await updateDoc(ref, {
      upvotes: increment(1),
      upvotedBy: arrayUnion(uid),
    })
  }
}
