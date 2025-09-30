import {useQuery} from '@tanstack/react-query'
import {authenticatedFetch} from '../../utils/client'
import {MovieView} from './Movie.view'

type MovieDetails = {
  id: string
  title: string
  posterUrl?: string
  rating?: string
  summary?: string
  duration?: string
  ratingValue?: number
  genres?: Array<{id: string; title: string}>
  mainActors?: string[]
}

type MovieProps = {
  id: string
}

export function Movie({id}: MovieProps) {
  const {
    data: movieDetails,
    isLoading,
    error,
  } = useQuery<MovieDetails, Error>({
    queryKey: ['movie', id],
    queryFn: async () => {
      try {
        const response = await authenticatedFetch(`/movies/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch movie details')
        }
        return response.json()
      } catch (error) {
        throw new Error(`Failed to fetch movie details: ${error}`)
      }
    },
  })

  return (
    <MovieView
      movieDetails={movieDetails}
      isLoading={isLoading}
      error={error}
    />
  )
}
