import {MovieFinderView} from './MovieFinder.view'
import {useQuery} from '@tanstack/react-query'
import {authenticatedFetch} from '../../utils/client'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {useMoviePagination} from '../../hooks/useMoviePagination'
import {SearchInput} from '../SearchInput'

export function MovieFinder() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (router.isReady) {
      const page = parseInt(router.query.page as string) || 1
      const search = (router.query.search as string) || ''
      setCurrentPage(page)
      setSearchQuery(search)
    }
  }, [router.isReady, router.query.page, router.query.search])

  const {
    data: moviesData,
    isLoading,
    error,
  } = useQuery<{data: any[]; totalPages: number}, Error>({
    queryKey: ['movies', currentPage, searchQuery],
    queryFn: async () => {
      try {
        const searchParam = searchQuery
          ? `&search=${encodeURIComponent(searchQuery)}`
          : ''
        const response = await authenticatedFetch(
          `/movies?page=${currentPage}${searchParam}`,
        )
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
    queryKey: ['movies', 'lastPage', moviesData?.totalPages, searchQuery],
    queryFn: async () => {
      if (!moviesData?.totalPages) return null
      try {
        const searchParam = searchQuery
          ? `&search=${encodeURIComponent(searchQuery)}`
          : ''
        const response = await authenticatedFetch(
          `/movies?page=${moviesData.totalPages}${searchParam}`,
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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="w-3/5 my-5 mx-auto text-center">
      <SearchInput onSearchChange={handleSearchChange} />
      <MovieFinderView
        data={moviesData}
        isLoading={isLoading}
        error={error}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        resultsInfo={getResultsInfo()}
      />
    </div>
  )
}
