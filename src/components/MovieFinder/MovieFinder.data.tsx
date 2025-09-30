import {MovieFinderView} from './MovieFinder.view'
import {useQuery} from '@tanstack/react-query'
import {authenticatedFetch} from '../../utils/client'

export function MovieFinder() {
  const {
    data: moviesData,
    isLoading,
    error,
  } = useQuery<{movies: any[]}, Error>({
    queryKey: ['movies'],
    queryFn: async () => {
      try {
        const response = await authenticatedFetch(
          '/movies',
        )
        if (!response.ok) {
          throw new Error('Failed to fetch movies')
        }
        return response.json()
      } catch (error) {
        throw new Error(`Failed to fetch movies: ${error}`)
      }
    },
  })

  return (
    <MovieFinderView data={moviesData} isLoading={isLoading} error={error} />
  )
}
