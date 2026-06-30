/**
 * Cliente HTTP para la API pública de Remotive (remote jobs).
 * fetchJobs() obtiene los empleos remotos y los mapea al modelo JobItem.
 */
import axios from 'axios'
import type { JobItem } from '../types/job'

const REMOTIVE_BASE_URL = 'https://remotive.com/api'

type RemotiveJob = {
  id: number
  url: string
  title: string
  company_name: string
  company_logo?: string | null
  category: string
  tags?: string[]
  job_type: string
  publication_date: string
  candidate_required_location: string
  salary?: string | null
  description: string
}

type RemotiveJobsResponse = {
  jobs: RemotiveJob[]
}

export async function fetchJobs(): Promise<JobItem[]> {
  const response = await axios.get<RemotiveJobsResponse>(
    `${REMOTIVE_BASE_URL}/remote-jobs`,
  )

  const { jobs } = response.data

  return jobs.map((job) => ({
    id: job.id,
    title: job.title,
    companyName: job.company_name,
    companyLogoUrl: job.company_logo ?? undefined,
    category: job.category,
    tags: job.tags,
    jobType: job.job_type,
    publicationDate: job.publication_date,
    candidateLocation: job.candidate_required_location,
    salary: job.salary ?? undefined,
    descriptionHtml: job.description,
    applyUrl: job.url,
  }))
}

type RemotiveCategory = { id: number; name: string; slug: string }

type RemotiveCategoriesResponse = {
  jobs: RemotiveCategory[]
}

export async function fetchCategories(): Promise<string[]> {
  const response = await axios.get<RemotiveCategoriesResponse>(
    `${REMOTIVE_BASE_URL}/remote-jobs/categories`,
  )

  return response.data.jobs.map((cat) => cat.name).sort()
}
