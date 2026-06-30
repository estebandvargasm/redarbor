import { fetchJobs, fetchCategories } from '../remotiveApi'

jest.mock('axios', () => ({
  get: jest.fn(),
}))

const axios = require('axios')

const mockRemotiveJobs = [
  {
    id: 1,
    url: 'https://apply.com/1',
    title: 'Frontend Dev',
    company_name: 'Acme',
    company_logo: 'https://logo.com/1.png',
    category: 'Software Dev',
    tags: ['react', 'typescript'],
    job_type: 'full-time',
    publication_date: '2025-01-01',
    candidate_required_location: 'Remote',
    salary: '$100k',
    description: '<p>desc</p>',
  },
  {
    id: 2,
    url: 'https://apply.com/2',
    title: 'Backend Dev',
    company_name: 'Beta',
    company_logo: null,
    category: 'Software Dev',
    tags: undefined,
    job_type: 'contract',
    publication_date: '2025-02-01',
    candidate_required_location: 'Worldwide',
    salary: null,
    description: '<p>desc2</p>',
  },
]

const mockCategories = [
  { id: 1, name: 'Software Dev', slug: 'software-dev' },
  { id: 2, name: 'Marketing', slug: 'marketing' },
  { id: 3, name: 'DevOps', slug: 'devops' },
]

describe('remotiveApi', () => {
  beforeEach(() => {
    axios.get.mockReset()
  })

  describe('fetchJobs', () => {
    it('maps Remotive jobs to JobItem format', async () => {
      axios.get.mockResolvedValueOnce({ data: { jobs: mockRemotiveJobs } })

      const result = await fetchJobs()

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: 1,
        title: 'Frontend Dev',
        companyName: 'Acme',
        companyLogoUrl: 'https://logo.com/1.png',
        category: 'Software Dev',
        tags: ['react', 'typescript'],
        jobType: 'full-time',
        publicationDate: '2025-01-01',
        candidateLocation: 'Remote',
        salary: '$100k',
        descriptionHtml: '<p>desc</p>',
        applyUrl: 'https://apply.com/1',
      })
    })

    it('converts null/undefined optional fields to undefined', async () => {
      axios.get.mockResolvedValueOnce({ data: { jobs: mockRemotiveJobs } })
      const result = await fetchJobs()

      expect(result[1].companyLogoUrl).toBeUndefined()
      expect(result[1].salary).toBeUndefined()
    })

    it('hits the correct URL', async () => {
      axios.get.mockResolvedValueOnce({ data: { jobs: [] } })

      await fetchJobs()

      expect(axios.get).toHaveBeenCalledWith('https://remotive.com/api/remote-jobs')
    })

    it('propagates axios errors', async () => {
      axios.get.mockRejectedValueOnce(new Error('Network down'))

      await expect(fetchJobs()).rejects.toThrow('Network down')
    })
  })

  describe('fetchCategories', () => {
    it('returns sorted category names', async () => {
      axios.get.mockResolvedValueOnce({ data: { jobs: mockCategories } })

      const result = await fetchCategories()

      expect(result).toEqual(['DevOps', 'Marketing', 'Software Dev'])
    })

    it('hits the correct URL', async () => {
      axios.get.mockResolvedValueOnce({ data: { jobs: [] } })

      await fetchCategories()

      expect(axios.get).toHaveBeenCalledWith('https://remotive.com/api/remote-jobs/categories')
    })
  })
})
