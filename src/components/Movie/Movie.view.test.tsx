import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import {MovieView} from './Movie.view'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({src, alt, ...props}: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

describe('MovieView', () => {
  const mockMovieDetails = {
    id: 'movie-1',
    title: 'The Dark Knight',
    posterUrl: 'https://example.com/poster.jpg',
    ratingValue: 9.0,
    duration: 'PT2H32M',
    summary: 'Batman faces the Joker in this epic superhero film.',
    genres: [
      {id: '1', title: 'Action'},
      {id: '2', title: 'Crime'},
      {id: '3', title: 'Drama'},
    ],
    mainActors: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
  }

  it('should render all movie details correctly', () => {
    render(<MovieView movieDetails={mockMovieDetails} />)

    // Check title
    expect(screen.getByText('The Dark Knight')).toBeInTheDocument()

    // Check poster
    const poster = screen.getByAltText('The Dark Knight movie poster')
    expect(poster).toBeInTheDocument()
    expect(poster).toHaveAttribute('src', 'https://example.com/poster.jpg')

    // Check rating
    expect(screen.getByText('⭐️ 9')).toBeInTheDocument()
    expect(screen.getByLabelText('Rating: 9 stars')).toBeInTheDocument()

    // Check duration
    expect(screen.getByText('2h 32m')).toBeInTheDocument()
    expect(screen.getByLabelText('Duration: 2h 32m')).toBeInTheDocument()

    // Check genres
    expect(screen.getByText('Genres:')).toBeInTheDocument()
    expect(screen.getByText('Action, Crime, Drama')).toBeInTheDocument()
    expect(
      screen.getByLabelText('Genres: Action, Crime, Drama'),
    ).toBeInTheDocument()

    // Check cast
    expect(screen.getByText('Cast:')).toBeInTheDocument()
    expect(
      screen.getByText('Christian Bale, Heath Ledger, Aaron Eckhart'),
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(
        'Cast: Christian Bale, Heath Ledger, Aaron Eckhart',
      ),
    ).toBeInTheDocument()
  })

  it('should handle missing poster', () => {
    const movieWithoutPoster = {
      ...mockMovieDetails,
      posterUrl: undefined,
    }

    render(<MovieView movieDetails={movieWithoutPoster} />)

    expect(screen.getByText('No Image')).toBeInTheDocument()
    expect(
      screen.getByLabelText('The Dark Knight - no poster available'),
    ).toBeInTheDocument()
  })

  it('should handle missing optional details', () => {
    const minimalMovie = {
      id: 'movie-1',
      title: 'Minimal Movie',
    }

    render(<MovieView movieDetails={minimalMovie} />)

    expect(screen.getByText('Minimal Movie')).toBeInTheDocument()
    expect(screen.getByText('No Image')).toBeInTheDocument()

    // Should not show rating, duration, genres, or cast
    expect(screen.queryByText(/⭐️/)).not.toBeInTheDocument()
    expect(screen.queryByText(/\d+h|\d+m/)).not.toBeInTheDocument()
    expect(screen.queryByText('Genres:')).not.toBeInTheDocument()
    expect(screen.queryByText('Cast:')).not.toBeInTheDocument()
  })

  it('should show summary on hover', () => {
    render(<MovieView movieDetails={mockMovieDetails} />)

    // Summary should not be visible initially
    const summaryElement = screen.queryByText(
      'Batman faces the Joker in this epic superhero film.',
    )
    expect(summaryElement).toBeInTheDocument() // Element exists but is hidden with CSS

    // Find the movie section and hover over it
    const movieSection = screen.getByLabelText('Movie: The Dark Knight')
    fireEvent.mouseEnter(movieSection)

    // Summary should now be visible
    expect(
      screen.getByText('Batman faces the Joker in this epic superhero film.'),
    ).toBeInTheDocument()
  })

  it('should not show summary if not provided', () => {
    const movieWithoutSummary = {
      ...mockMovieDetails,
      summary: undefined,
    }

    render(<MovieView movieDetails={movieWithoutSummary} />)

    const movieSection = screen.getByLabelText('Movie: The Dark Knight')
    fireEvent.mouseEnter(movieSection)

    // Should not show any summary overlay
    expect(
      screen.queryByText('Batman faces the Joker in this epic superhero film.'),
    ).not.toBeInTheDocument()
  })

  it('should format duration correctly', () => {
    const testCases = [
      {duration: 'PT2H30M', expected: '2h 30m'},
      {duration: 'PT1H45M', expected: '1h 45m'},
      {duration: 'PT90M', expected: '90m'},
      {duration: 'PT2H', expected: '2h'},
    ]

    testCases.forEach(({duration, expected}) => {
      const movieWithDuration = {
        ...mockMovieDetails,
        duration,
      }

      const {unmount} = render(<MovieView movieDetails={movieWithDuration} />)

      expect(screen.getByText(expected)).toBeInTheDocument()
      expect(screen.getByLabelText(`Duration: ${expected}`)).toBeInTheDocument()

      unmount()
    })
  })

  it('should render error state', () => {
    const error = new Error('Failed to fetch')
    render(<MovieView movieDetails={undefined} error={error} />)

    expect(screen.getByText('Failed to load details')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('should return null when no movie details', () => {
    const {container} = render(<MovieView movieDetails={undefined} />)
    expect(container.firstChild).toBeNull()
  })

  it('should have proper accessibility attributes', () => {
    render(<MovieView movieDetails={mockMovieDetails} />)

    const movieSection = screen.getByLabelText('Movie: The Dark Knight')
    expect(movieSection).toBeInTheDocument()

    const poster = screen.getByAltText('The Dark Knight movie poster')
    expect(poster).toBeInTheDocument()
  })
})
