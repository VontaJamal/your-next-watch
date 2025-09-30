import {useQuery} from '@tanstack/react-query'
import {authenticatedFetch} from '../../utils/client'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {GenreFilterView} from './GenreFilter.view'

const GENRES_CACHE_KEY = 'movie-genres'

type Genre = {
  id: string
  title: string
  movies: string[]
}

type GenresResponse = {
  data: Genre[]
  totalPages: number
}

export function GenreFilter() {
  const router = useRouter()
  const [selectedGenre, setSelectedGenre] = useState('')

  useEffect(() => {
    if (router.isReady) {
      const genre = (router.query.genre as string) || ''
      setSelectedGenre(genre)
    }
  }, [router.isReady, router.query.genre])

  const getCachedGenres = (): string[] | null => {
    try {
      const cached = localStorage.getItem(GENRES_CACHE_KEY)
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  }

  const setCachedGenres = (genres: string[]) => {
    localStorage.setItem(GENRES_CACHE_KEY, JSON.stringify(genres))
  }

  const {
    data: genres,
    isLoading,
    error,
  } = useQuery<string[], Error>({
    queryKey: ['genres'],
    queryFn: async () => {
      const cached = getCachedGenres()
      if (cached) return cached

      const response = await authenticatedFetch('/genres/movies')
      if (!response.ok) throw new Error('Failed to fetch genres')

      const data: GenresResponse = await response.json()
      const genreTitles = data.data.map((genre) => genre.title)

      console.log('genreTitles', genreTitles)
      setCachedGenres(genreTitles)
      return genreTitles
    },
    staleTime: Infinity,
    cacheTime: Infinity,
  })

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre)
    router.push(
      {
        pathname: router.pathname,
        query: {...router.query, genre: genre, page: 1},
      },
      undefined,
      {shallow: true},
    )
  }

  const handleClearGenre = () => {
    setSelectedGenre('')
    const {genre, ...queryWithoutGenre} = router.query
    router.push(
      {
        pathname: router.pathname,
        query: {...queryWithoutGenre, page: 1},
      },
      undefined,
      {shallow: true},
    )
  }

  return (
    <GenreFilterView
      genreList={genres || []}
      selectedGenre={selectedGenre}
      isLoading={isLoading}
      error={error}
      onGenreChange={handleGenreChange}
      onClearGenre={handleClearGenre}
    />
  )
}
