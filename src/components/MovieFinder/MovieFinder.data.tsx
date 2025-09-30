import {MovieFinderView} from './MovieFinder.view'
import {useQuery} from '@tanstack/react-query'
import {authenticatedFetch} from '../../utils/client'
import {useRouter} from 'next/router'
import {useEffect, useReducer} from 'react'
import {useMoviePagination} from '../../hooks/useMoviePagination'
import {SearchInput} from '../SearchInput'
import {GenreFilter} from '../GenreFilter'
import {ErrorBoundary} from '../ErrorBoundary'
import {MOVIES_PER_PAGE} from '../../constants/pagination'

type Movie = {
  id: string
  title: string
  posterUrl?: string
  rating?: string
}

type MovieSearchState = {
  currentPage: number
  searchQuery: string
  selectedGenre: string
  limit: number
}

type MovieSearchAction =
  | {
      type: 'SET_FROM_ROUTER'
      payload: {page: number; search: string; genre: string; limit: number}
    }
  | {type: 'SET_PAGE'; payload: number}
  | {type: 'SET_SEARCH'; payload: string}
  | {type: 'SET_GENRE'; payload: string}
  | {type: 'SET_LIMIT'; payload: number}

const movieSearchReducer = (
  state: MovieSearchState,
  action: MovieSearchAction,
): MovieSearchState => {
  switch (action.type) {
    case 'SET_FROM_ROUTER':
      return {...state, ...action.payload}
    case 'SET_PAGE':
      return {...state, currentPage: action.payload}
    case 'SET_SEARCH':
      return {...state, searchQuery: action.payload}
    case 'SET_GENRE':
      return {...state, selectedGenre: action.payload}
    case 'SET_LIMIT':
      return {...state, limit: action.payload}
    default:
      return state
  }
}

export function MovieFinder() {
  const router = useRouter()
  const [state, dispatch] = useReducer(movieSearchReducer, {
    currentPage: 1,
    searchQuery: '',
    selectedGenre: '',
    limit: MOVIES_PER_PAGE,
  })

  useEffect(() => {
    if (router.isReady) {
      const page = parseInt(router.query.page as string) || 1
      const search = (router.query.search as string) || ''
      const genre = (router.query.genre as string) || ''
      const limitParam =
        parseInt(router.query.limit as string) || MOVIES_PER_PAGE

      dispatch({
        type: 'SET_FROM_ROUTER',
        payload: {page, search, genre, limit: limitParam},
      })

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

  const buildQueryParams = (page: number) => {
    const searchParam = state.searchQuery
      ? `&search=${encodeURIComponent(state.searchQuery)}`
      : ''
    const genreParam = state.selectedGenre
      ? `&genre=${encodeURIComponent(state.selectedGenre)}`
      : ''
    return `/movies?page=${page}&limit=${state.limit}${searchParam}${genreParam}`
  }

  const fetchMovies = async (page: number) => {
    try {
      const response = await authenticatedFetch(buildQueryParams(page))
      if (!response.ok) {
        throw new Error('Failed to fetch movies')
      }
      return response.json()
    } catch (error) {
      throw new Error(`Failed to fetch movies: ${error}`)
    }
  }

  const {
    data: moviesData,
    isLoading,
    error,
  } = useQuery<{data: Movie[]; totalPages: number}, Error>({
    queryKey: [
      'movies',
      state.currentPage,
      state.searchQuery,
      state.selectedGenre,
      state.limit,
    ],
    queryFn: () => fetchMovies(state.currentPage),
    enabled: router.isReady,
  })

  const {data: lastPageData} = useQuery<{data: Movie[]}, Error>({
    queryKey: [
      'movies',
      'lastPage',
      moviesData?.totalPages,
      state.searchQuery,
      state.selectedGenre,
      state.limit,
    ],
    queryFn: () => fetchMovies(moviesData!.totalPages),
    enabled: router.isReady && !!moviesData?.totalPages,
  })

  const {getResultsInfo, handlePageChange} = useMoviePagination({
    moviesData,
    lastPageData,
    currentPage: state.currentPage,
    limit: state.limit,
    dispatch,
  })

  const handleSearchChange = (query: string) => {
    dispatch({type: 'SET_SEARCH', payload: query})
  }

  return (
    <div className="w-3/5 my-5 mx-auto text-center">
      <div className="flex gap-4 justify-center items-end mb-6">
        <SearchInput onSearchChange={handleSearchChange} />
        <GenreFilter />
      </div>
      <ErrorBoundary>
        <MovieFinderView
          data={moviesData}
          isLoading={isLoading}
          currentPage={state.currentPage}
          onPageChange={handlePageChange}
          resultsInfo={getResultsInfo()}
        />
      </ErrorBoundary>
    </div>
  )
}
