import {MovieFinderView} from './MovieFinder.view'
import {useQuery} from '@tanstack/react-query'
import {authenticatedFetch} from '../../utils/client'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {useMoviePagination} from '../../hooks/useMoviePagination'
import {SearchInput} from '../SearchInput'
import {GenreFilter} from '../GenreFilter'
import {MOVIES_PER_PAGE} from '../../constants/pagination'

export function MovieFinder() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [limit, setLimit] = useState(MOVIES_PER_PAGE)

  useEffect(() => {
    if (router.isReady) {
      const page = parseInt(router.query.page as string) || 1
      const search = (router.query.search as string) || ''
      const genre = (router.query.genre as string) || ''
      const limitParam =
        parseInt(router.query.limit as string) || MOVIES_PER_PAGE
      setCurrentPage(page)
      setSearchQuery(search)
      setSelectedGenre(genre)
      setLimit(limitParam)

      // Add limit to URL if it's not present
      if (!router.query.limit) {
        router.replace(
          {
            pathname: router.pathname,
            query: {...router.query, limit: limitParam},
          },
          undefined,
          {shallow: true},
        )
      }
    }
  }, [
    router.isReady,
    router.query.page,
    router.query.search,
    router.query.genre,
    router.query.limit,
  ])

  const {
    data: moviesData,
    isLoading,
    error,
  } = useQuery<{data: any[]; totalPages: number}, Error>({
    queryKey: ['movies', currentPage, searchQuery, selectedGenre, limit],
    queryFn: async () => {
      try {
        const searchParam = searchQuery
          ? `&search=${encodeURIComponent(searchQuery)}`
          : ''
        const genreParam = selectedGenre
          ? `&genre=${encodeURIComponent(selectedGenre)}`
          : ''
        const response = await authenticatedFetch(
          `/movies?page=${currentPage}&limit=${limit}${searchParam}${genreParam}`,
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
    queryKey: [
      'movies',
      'lastPage',
      moviesData?.totalPages,
      searchQuery,
      selectedGenre,
      limit,
    ],
    queryFn: async () => {
      if (!moviesData?.totalPages) return null
      try {
        const searchParam = searchQuery
          ? `&search=${encodeURIComponent(searchQuery)}`
          : ''
        const genreParam = selectedGenre
          ? `&genre=${encodeURIComponent(selectedGenre)}`
          : ''
        const response = await authenticatedFetch(
          `/movies?page=${moviesData.totalPages}&limit=${limit}${searchParam}${genreParam}`,
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
    limit,
  })

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre)
  }

  return (
    <div className="w-3/5 my-5 mx-auto text-center">
      <div className="flex gap-4 justify-center items-end mb-6">
        <SearchInput onSearchChange={handleSearchChange} />
        <GenreFilter />
      </div>
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
