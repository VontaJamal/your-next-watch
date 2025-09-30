import {useRouter} from 'next/router'

type UseMoviePaginationProps = {
  moviesData: {data: any[]; totalPages: number} | undefined
  lastPageData: {data: any[]} | undefined
  currentPage: number
}

const DEFAULT_LIMIT = 25

export function useMoviePagination({
  moviesData,
  lastPageData,
  currentPage,
}: UseMoviePaginationProps) {
  const router = useRouter()

  const getResultsInfo = () => {
    if (!moviesData) return {start: 0, end: 0, total: 0}

    const {totalPages, data} = moviesData
    const limit = DEFAULT_LIMIT
    const currentPageStart = (currentPage - 1) * limit + 1
    const currentPageEnd = currentPageStart + data.length - 1

    let exactTotal = 0
    if (lastPageData) {
      const fullPages = (totalPages - 1) * limit
      const lastPageResults = lastPageData.data.length
      exactTotal = fullPages + lastPageResults
    }

    return {
      start: currentPageStart,
      end: currentPageEnd,
      total: exactTotal,
    }
  }

  const handlePageChange = (page: number) => {
    router.push(
      {
        pathname: router.pathname,
        query: {...router.query, page},
      },
      undefined,
      {shallow: true},
    )
  }

  return {
    getResultsInfo,
    handlePageChange,
  }
}
