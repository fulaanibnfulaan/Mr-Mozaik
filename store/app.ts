'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Language, DietaryPreferences, Profile } from '@/lib/types'

interface AppState {
  language: Language
  onboardingComplete: boolean
  dietaryPreferences: DietaryPreferences
  profile: Profile | null
  setLanguage: (lang: Language) => void
  completeOnboarding: () => void
  setDietaryPreferences: (prefs: DietaryPreferences) => void
  setProfile: (profile: Profile | null) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'nl',
      onboardingComplete: false,
      dietaryPreferences: {},
      profile: null,
      setLanguage: (language) => set({ language }),
      completeOnboarding: () => set({ onboardingComplete: true }),
      setDietaryPreferences: (prefs) => set({ dietaryPreferences: prefs }),
      setProfile: (profile) => set({ profile }),
    }),
    { name: 'mozaik-app', skipHydration: true }
  )
)
