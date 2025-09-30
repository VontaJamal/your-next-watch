import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import {GenreFilterView} from './GenreFilter.view'

describe('GenreFilterView', () => {
  const mockOnGenreChange = jest.fn()
  const mockOnClearGenre = jest.fn()

  const defaultProps = {
    genreList: ['Action', 'Comedy', 'Drama'],
    selectedGenre: '',
    isLoading: false,
    error: null,
    onGenreChange: mockOnGenreChange,
    onClearGenre: mockOnClearGenre,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render genre options correctly', () => {
    render(<GenreFilterView {...defaultProps} />)

    expect(screen.getByText('All Genres')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('Comedy')).toBeInTheDocument()
    expect(screen.getByText('Drama')).toBeInTheDocument()
  })

  it('should handle genre selection', () => {
    render(<GenreFilterView {...defaultProps} />)

    const select = screen.getByRole('combobox')
    fireEvent.change(select, {target: {value: 'Action'}})

    expect(mockOnGenreChange).toHaveBeenCalledWith('Action')
  })

  it('should show selected genre', () => {
    render(<GenreFilterView {...defaultProps} selectedGenre="Comedy" />)

    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('Comedy')
  })

  it('should show clear button when genre is selected', () => {
    render(<GenreFilterView {...defaultProps} selectedGenre="Action" />)

    const clearButton = screen.getByRole('button', {
      name: /clear genre filter/i,
    })
    expect(clearButton).toBeInTheDocument()
    expect(clearButton).toHaveTextContent('Clear')
  })

  it('should not show clear button when no genre is selected', () => {
    render(<GenreFilterView {...defaultProps} selectedGenre="" />)

    const clearButton = screen.queryByRole('button', {
      name: /clear genre filter/i,
    })
    expect(clearButton).not.toBeInTheDocument()
  })

  it('should handle clear button click', () => {
    render(<GenreFilterView {...defaultProps} selectedGenre="Action" />)

    const clearButton = screen.getByRole('button', {
      name: /clear genre filter/i,
    })
    fireEvent.click(clearButton)

    expect(mockOnClearGenre).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when loading', () => {
    render(<GenreFilterView {...defaultProps} isLoading={true} />)

    const select = screen.getByRole('combobox')
    expect(select).toBeDisabled()
  })

  it('should not be disabled when not loading', () => {
    render(<GenreFilterView {...defaultProps} isLoading={false} />)

    const select = screen.getByRole('combobox')
    expect(select).not.toBeDisabled()
  })

  it('should show error message when error occurs', () => {
    const error = new Error('Failed to fetch')
    render(<GenreFilterView {...defaultProps} error={error} />)

    expect(screen.getByText('Failed to load genres')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('should not show error message when no error', () => {
    render(<GenreFilterView {...defaultProps} error={null} />)

    expect(screen.queryByText('Failed to load genres')).not.toBeInTheDocument()
  })

  it('should handle empty genre list', () => {
    render(<GenreFilterView {...defaultProps} genreList={[]} />)

    expect(screen.getByText('All Genres')).toBeInTheDocument()
    // Should not render any genre options
    expect(screen.queryByText('Action')).not.toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(<GenreFilterView {...defaultProps} />)

    const select = screen.getByRole('combobox')
    expect(select).toHaveAttribute('aria-label', 'Filter movies by genre')
    expect(select).toHaveAttribute('id', 'genre-select')

    const label = screen.getByText('Filter movies by genre')
    expect(label).toHaveAttribute('id', 'genre-filter-label')
    expect(label).toHaveAttribute('for', 'genre-select')
  })

  it('should have proper clear button accessibility', () => {
    render(<GenreFilterView {...defaultProps} selectedGenre="Action" />)

    const clearButton = screen.getByRole('button', {
      name: /clear genre filter/i,
    })
    expect(clearButton).toHaveAttribute(
      'aria-label',
      'Clear genre filter (currently: Action)',
    )
  })
})
