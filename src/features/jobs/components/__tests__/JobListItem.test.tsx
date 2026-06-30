import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import '@testing-library/react-native/build/matchers/extend-expect'
import { router } from 'expo-router'
import { JobListItem } from '../JobListItem'
import type { JobItem } from '../../types/job'

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}))

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native')
  return {
    Ionicons: ({ name }: any) => <Text>{`Icon(${name})`}</Text>,
  }
})

jest.mock('@/src/shared/components/AnimatedHeart', () => {
  const { Pressable, View } = require('react-native')
  return ({ children, onPress }: any) => (
    <Pressable onPress={onPress} testID="heart-wrapper">
      <View>{children}</View>
    </Pressable>
  )
})

const baseJob: JobItem = {
  id: 1,
  title: 'Frontend Developer',
  companyName: 'Acme Inc',
  companyLogoUrl: 'https://logo.com/acme.png',
  category: 'Software Dev',
  jobType: 'full-time',
  publicationDate: '2025-06-15',
  candidateLocation: 'Remote',
  salary: '$90k - $120k',
  descriptionHtml: '<p>desc</p>',
  applyUrl: 'https://apply.com/1',
  tags: ['react', 'typescript'],
}

describe('JobListItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders job title and company name', () => {
    render(<JobListItem job={baseJob} />)
    expect(screen.getByText('Frontend Developer')).toBeOnTheScreen()
    expect(screen.getByText('Acme Inc')).toBeOnTheScreen()
  })

  it('renders location and category', () => {
    render(<JobListItem job={baseJob} />)
    expect(screen.getByText(/Remote/)).toBeOnTheScreen()
    expect(screen.getByText(/Software Dev/)).toBeOnTheScreen()
  })

  it('shows placeholder icon when companyLogoUrl is missing', () => {
    const job = { ...baseJob, companyLogoUrl: undefined }
    render(<JobListItem job={job} />)
    expect(screen.getByText(/Icon\(business-outline\)/)).toBeOnTheScreen()
  })

  it('renders filled heart when isFavorite is true', () => {
    render(<JobListItem job={baseJob} isFavorite />)
    expect(screen.getByText(/Icon\(heart\)/)).toBeOnTheScreen()
  })

  it('renders outline heart when isFavorite is false', () => {
    render(<JobListItem job={baseJob} isFavorite={false} />)
    expect(screen.getByText(/Icon\(heart-outline\)/)).toBeOnTheScreen()
  })

  it('calls onToggleFavorite when heart is pressed', () => {
    const onToggle = jest.fn()
    render(<JobListItem job={baseJob} onToggleFavorite={onToggle} />)
    fireEvent.press(screen.getByTestId('heart-wrapper'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('navigates to job detail on card press', () => {
    render(<JobListItem job={baseJob} />)
    fireEvent.press(screen.getByText('Frontend Developer'))
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/job/[id]',
      params: { id: 1 },
    })
  })
})
