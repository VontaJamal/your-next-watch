import {MovieFinderView} from './MovieFinder.view'
import {useQuery} from '@tanstack/react-query'
import {authenticatedFetch} from '../../utils/client'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {useMoviePagination} from '../../hooks/useMoviePagination'

export function MovieFinder() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (router.isReady) {
      const page = parseInt(router.query.page as string) || 1
      setCurrentPage(page)
    }
  }, [router.isReady, router.query.page])

  const {
    data: moviesData,
    isLoading,
    error,
  } = useQuery<{data: any[]; totalPages: number}, Error>({
    queryKey: ['movies', currentPage],
    queryFn: async () => {
      try {
        const response = await authenticatedFetch(`/movies?page=${currentPage}`)
        if (!response.ok) {
          throw new Error('Failed to fetch movies')
        }
        return response.json()
      } catch (error) {
        throw new Error(`Failed to fetch movies: ${error}`)
      }
    },
    enabled: router.isReady,
  })

  // Second query to get exact count from last page
  const {data: lastPageData} = useQuery<{data: any[]}, Error>({
    queryKey: ['movies', 'lastPage', moviesData?.totalPages],
    queryFn: async () => {
      if (!moviesData?.totalPages) return null
      try {
        const response = await authenticatedFetch(
          `/movies?page=${moviesData.totalPages}`,
        )
        if (!response.ok) {
          throw new Error('Failed to fetch last page')
        }
        return response.json()
      } catch (error) {
        throw new Error(`Failed to fetch last page: ${error}`)
      }
    },
    enabled: router.isReady && !!moviesData?.totalPages,
  })

  const {getResultsInfo, handlePageChange} = useMoviePagination({
    moviesData,
    lastPageData,
    currentPage,
  })

  return (
    <MovieFinderView
      data={moviesData}
      isLoading={isLoading}
      error={error}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      resultsInfo={getResultsInfo()}
    />
  )
}
