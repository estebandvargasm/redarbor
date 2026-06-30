/**
 * Estado global de empleos con Zustand.
 * - Carga la lista de empleos y categorías desde la API de Remotive.
 * - Gestiona favoritos (toggle + persistencia en AsyncStorage).
 * - Expone estado de carga/error y las acciones para las pantallas.
 */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { JobItem } from '../types/job'
import { fetchJobs, fetchCategories } from '../services/remotiveApi'

type JobsState = {
  jobs: JobItem[]
  favorites: JobItem[]
  categories: string[]
  status: 'loading' | 'error' | null
  error: string | null
  loadJobs: () => Promise<void>
  loadCategories: () => Promise<void>
  toggleFavorite: (job: JobItem) => void
  isFavorite: (jobId: number) => boolean
}

export const useJobsStore = create<JobsState>()(
  persist(
    (set, get) => ({
      jobs: [],
      favorites: [],
      categories: [],
      status: null,
      error: null,

      async loadJobs() {
        try {
          set({ status: 'loading', error: null })
          const jobs = await fetchJobs()
          set({
            jobs,
            status: null,
          })
        } catch (e) {
          set({
            status: 'error',
            error: 'No se pudieron cargar los empleos',
          })
        }
      },

      async loadCategories() {
        try {
          const categories = await fetchCategories()
          set({ categories })
        } catch {
          // Si falla, se sigue usando lo que haya en el store
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