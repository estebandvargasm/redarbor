import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import '@testing-library/react-native/build/matchers/extend-expect'

jest.mock('react-native/Libraries/Animated/Animated', () => {
  const { View, Text } = require('react-native')
  return {
    __esModule: true,
    default: {
      Value: () => ({ interpolate: jest.fn() }),
      timing: () => ({ start: (cb?: () => void) => cb?.() }),
      spring: () => ({ start: (cb?: () => void) => cb?.() }),
      parallel: () => ({ start: (cb?: () => void) => cb?.() }),
      View, Text,
      createAnimatedComponent: (c: any) => c,
    },
  }
})

import FilterDropdown from '../FilterDropdown'

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native')
  return {
    Ionicons: ({ name }: any) => <Text>{`Icon(${name})`}</Text>,
  }
})

const options = ['Software Dev', 'Marketing', 'Design']

describe('FilterDropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders label as display text when no value is selected', () => {
    render(
      <FilterDropdown
        label="Categoria"
        options={options}
        selected={null}
        onSelect={jest.fn()}
      />
    )
    expect(screen.getByText('Categoria')).toBeOnTheScreen()
  })

  it('renders selected value as display text', () => {
    render(
      <FilterDropdown
        label="Categoria"
        options={options}
        selected="Marketing"
        onSelect={jest.fn()}
      />
    )
    expect(screen.getByText('Marketing')).toBeOnTheScreen()
  })

  it('renders chevron icon in trigger', () => {
    render(
      <FilterDropdown
        label="Categoria"
        options={options}
        selected="Marketing"
        onSelect={jest.fn()}
      />
    )
    expect(screen.getByText(/Icon\(chevron-down\)/)).toBeOnTheScreen()
  })

  it('shows All and option names when sheet is opened', () => {
    render(
      <FilterDropdown
        label="Categoria"
        options={options}
        selected={null}
        onSelect={jest.fn()}
      />
    )
    fireEvent.press(screen.getByText('Categoria'))

    expect(screen.getByText('All')).toBeOnTheScreen()
    expect(screen.getByText('Software Dev')).toBeOnTheScreen()
    expect(screen.getByText('Marketing')).toBeOnTheScreen()
    expect(screen.getByText('Design')).toBeOnTheScreen()
  })

  it('shows checkmark on selected option when sheet is open', () => {
    render(
      <FilterDropdown
        label="Categoria"
        options={options}
        selected="Marketing"
        onSelect={jest.fn()}
      />
    )
    fireEvent.press(screen.getByText('Marketing'))

    expect(screen.getByText(/Icon\(checkmark\)/)).toBeOnTheScreen()
  })

  it('selects All calls onSelect with null', () => {
    const onSelect = jest.fn()
    render(
      <FilterDropdown
        label="Categoria"
        options={options}
        selected={null}
        onSelect={onSelect}
      />
    )
    fireEvent.press(screen.getByText('Categoria'))
    fireEvent.press(screen.getByText('All'))

    expect(onSelect).toHaveBeenCalledWith(null)
  })

  it('selecting an option calls onSelect with value', () => {
    const onSelect = jest.fn()
    render(
      <FilterDropdown
        label="Categoria"
        options={options}
        selected={null}
        onSelect={onSelect}
      />
    )
    fireEvent.press(screen.getByText('Categoria'))
    fireEvent.press(screen.getByText('Marketing'))

    expect(onSelect).toHaveBeenCalledWith('Marketing')
  })
})
