import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import {Pagination} from './Pagination'

describe('Pagination', () => {
  const mockOnPageChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not render when totalPages is 1 or less', () => {
    const {container} = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />,
    )

    expect(container.firstChild).toBeNull()
  })

  it('should render pagination controls for multiple pages', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />,
    )

    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('should handle page navigation', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />,
    )

    // Click on page 3
    fireEvent.click(screen.getByText('3'))
    expect(mockOnPageChange).toHaveBeenCalledWith(3)

    // Click next button
    fireEvent.click(screen.getByText('Next'))
    expect(mockOnPageChange).toHaveBeenCalledWith(3)

    // Click previous button
    fireEvent.click(screen.getByText('Previous'))
    expect(mockOnPageChange).toHaveBeenCalledWith(1)
  })

  it('should disable previous button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />,
    )

    const prevButton = screen.getByText('Previous')
    expect(prevButton).toBeDisabled()
  })

  it('should disable next button on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />,
    )

    const nextButton = screen.getByText('Next')
    expect(nextButton).toBeDisabled()
  })

  it('should display results info when provided', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        resultsInfo={{start: 11, end: 20, total: 100}}
      />,
    )

    expect(screen.getByText('Showing results 11-20 of 100')).toBeInTheDocument()
  })

  it('should not display results info when total is 0', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
        resultsInfo={{start: 0, end: 0, total: 0}}
      />,
    )

    expect(screen.queryByText(/Showing results/)).not.toBeInTheDocument()
  })

  it('should handle large page counts with proper page range', () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={20}
        onPageChange={mockOnPageChange}
      />,
    )

    // Should show 5 pages around current page (8, 9, 10, 11, 12)
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('9')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('11')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()

    // Should not show pages outside the range
    expect(screen.queryByText('1')).not.toBeInTheDocument()
    expect(screen.queryByText('20')).not.toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />,
    )

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Pagination Navigation')

    const currentPageButton = screen.getByText('3')
    expect(currentPageButton).toHaveAttribute('aria-current', 'page')

    const prevButton = screen.getByText('Previous')
    expect(prevButton).toHaveAttribute(
      'aria-label',
      'Go to previous page (page 2)',
    )
  })
})
