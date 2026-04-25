'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Language, DietaryPreferences, Profile } from '@/lib/types'

interface AppState {
  language: Language
  orderType: 'bezorgen' | 'afhalen'
  onboardingComplete: boolean
  dietaryPreferences: DietaryPreferences
  profile: Profile | null
  userMode: 'guest' | 'account' | null
  setLanguage: (lang: Language) => void
  setOrderType: (type: 'bezorgen' | 'afhalen') => void
  completeOnboarding: () => void
  setDietaryPreferences: (prefs: DietaryPreferences) => void
  setProfile: (profile: Profile | null) => void
  setUserMode: (mode: 'guest' | 'account' | null) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'nl',
      orderType: 'bezorgen',
      onboardingComplete: false,
      dietaryPreferences: {},
      profile: null,
      userMode: null,
      setLanguage: (language) => set({ language }),
      setOrderType: (orderType) => set({ orderType }),
      completeOnboarding: () => set({ onboardingComplete: true }),
      setDietaryPreferences: (prefs) => set({ dietaryPreferences: prefs }),
      setProfile: (profile) => set({ profile }),
      setUserMode: (userMode) => set({ userMode }),
    }),
    { name: 'mozaik-app', skipHydration: true }
  )
)
