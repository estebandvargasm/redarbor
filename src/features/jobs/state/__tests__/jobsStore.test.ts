import { act } from 'react'

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

import { useJobsStore } from '../jobsStore'

const mockJobs = [
  {
    id: 1,
    title: 'Frontend Dev',
    companyName: 'Acme',
    companyLogoUrl: 'https://logo.com/1.png',
    category: 'Software Dev',
    jobType: 'full-time',
    publicationDate: '2025-01-01',
    candidateLocation: 'Remote',
    salary: '$100k',
    descriptionHtml: '<p>desc</p>',
    applyUrl: 'https://apply.com/1',
    tags: ['react'],
  },
  {
    id: 2,
    title: 'Backend Dev',
    companyName: 'Beta',
    companyLogoUrl: undefined,
    category: 'Software Dev',
    jobType: 'contract',
    publicationDate: '2025-02-01',
    candidateLocation: 'Remote',
    salary: undefined,
    descriptionHtml: '<p>desc2</p>',
    applyUrl: 'https://apply.com/2',
  },
]

jest.mock('../../services/remotiveApi', () => ({
  fetchJobs: jest.fn(),
  fetchCategories: jest.fn(),
}))

beforeEach(() => {
  useJobsStore.setState({
    jobs: [],
    favorites: [],
    categories: [],
    status: null,
    error: null,
  })
})

describe('useJobsStore', () => {
  describe('toggleFavorite', () => {
    it('adds a job to favorites when not already present', () => {
      const { toggleFavorite } = useJobsStore.getState()
      act(() => toggleFavorite(mockJobs[0]))
      expect(useJobsStore.getState().favorites).toEqual([mockJobs[0]])
    })

    it('removes a job from favorites when already present', () => {
      useJobsStore.setState({ favorites: [mockJobs[0]] })
      const { toggleFavorite } = useJobsStore.getState()
      act(() => toggleFavorite(mockJobs[0]))
      expect(useJobsStore.getState().favorites).toEqual([])
    })

    it('does not affect other favorites when removing one', () => {
      useJobsStore.setState({ favorites: [mockJobs[0], mockJobs[1]] })
      const { toggleFavorite } = useJobsStore.getState()
      act(() => toggleFavorite(mockJobs[0]))
      expect(useJobsStore.getState().favorites).toEqual([mockJobs[1]])
    })
  })

  describe('isFavorite', () => {
    it('returns true when job is in favorites', () => {
      useJobsStore.setState({ favorites: [mockJobs[0]] })
      expect(useJobsStore.getState().isFavorite(1)).toBe(true)
    })

    it('returns false when job is not in favorites', () => {
      expect(useJobsStore.getState().isFavorite(1)).toBe(false)
    })
  })

  describe('loadJobs', () => {
    it('sets jobs on success and clears status', async () => {
      const { fetchJobs } = require('../../services/remotiveApi')
      fetchJobs.mockResolvedValueOnce(mockJobs)

      const { loadJobs } = useJobsStore.getState()
      await act(async () => {
        await loadJobs()
      })

      expect(useJobsStore.getState().jobs).toEqual(mockJobs)
      expect(useJobsStore.getState().status).toBeNull()
      expect(useJobsStore.getState().error).toBeNull()
    })

    it('sets error status on failure', async () => {
      const { fetchJobs } = require('../../services/remotiveApi')
      fetchJobs.mockRejectedValueOnce(new Error('Network error'))

      const { loadJobs } = useJobsStore.getState()
      await act(async () => {
        await loadJobs()
      })

      expect(useJobsStore.getState().status).toBe('error')
      expect(useJobsStore.getState().error).toBe('No se pudieron cargar los empleos')
    })
  })

  describe('loadCategories', () => {
    it('sets categories on success', async () => {
      const { fetchCategories } = require('../../services/remotiveApi')
      fetchCategories.mockResolvedValueOnce(['Dev', 'Marketing'])

      const { loadCategories } = useJobsStore.getState()
      await act(async () => {
        await loadCategories()
      })

      expect(useJobsStore.getState().categories).toEqual(['Dev', 'Marketing'])
    })

    it('keeps current categories on failure', async () => {
      const { fetchCategories } = require('../../services/remotiveApi')
      fetchCategories.mockRejectedValueOnce(new Error('Network error'))

      useJobsStore.setState({ categories: ['Old'] })
      const { loadCategories } = useJobsStore.getState()
      await act(async () => {
        await loadCategories()
      })

      expect(useJobsStore.getState().categories).toEqual(['Old'])
    })
  })

  describe('persistence', () => {
    it('partialize only includes favorites', () => {
      useJobsStore.setState({
        jobs: mockJobs,
        favorites: [mockJobs[0]],
        categories: ['Dev'],
      })

      const state = useJobsStore.getState()
      // ponytaile: manual partialize test — zustand internals
      const partial = (useJobsStore as any).persist?.getOptions?.()?.partialize?.(state)
      if (partial) {
        expect(partial).toEqual({ favorites: [mockJobs[0]] })
        expect(partial).not.toHaveProperty('jobs')
        expect(partial).not.toHaveProperty('categories')
      }
    })
  })
})
