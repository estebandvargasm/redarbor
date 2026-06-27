import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { JobItem } from '../types/job'
import { fetchJobs } from '../services/remotiveApi'

type Status = 'idle' | 'loading' | 'error' | 'empty'

type JobsState = {
  jobs: JobItem[]
  favorites: JobItem[]
  status: Status
  error: string | null
  loadJobs: () => Promise<void>
  toggleFavorite: (job: JobItem) => void
  isFavorite: (jobId: number) => boolean
}

export const useJobsStore = create<JobsState>()(
  persist(
    (set, get) => ({
      jobs: [],
      favorites: [],
      status: 'idle',
      error: null,

      async loadJobs() {
        try {
          set({ status: 'loading', error: null })
          const jobs = await fetchJobs()
          set({
            jobs,
            status: jobs.length === 0 ? 'empty' : 'idle',
          })
        } catch (e) {
          set({
            status: 'error',
            error: 'No se pudieron cargar los empleos',
          })
        }
      },

      toggleFavorite(job) {
        const { favorites } = get()
        const exists = favorites.some((fav) => fav.id === job.id)

        const nextFavorites = exists
          ? favorites.filter((fav) => fav.id !== job.id)
          : [...favorites, job]

        set({ favorites: nextFavorites })
      },

      isFavorite(jobId) {
        return get().favorites.some((fav) => fav.id === jobId)
      },
    }),
    {
      name: 'jobs-store',
      partialize: (state) => ({ favorites: state.favorites }),
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)