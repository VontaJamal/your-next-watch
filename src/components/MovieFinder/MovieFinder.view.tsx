import {MovieListView} from '../MovieList/MovieList.view'
import {Pagination} from '../Pagination'

type MovieFinderViewProps = {
  data: {data: any[]; totalPages: number} | undefined
  isLoading: boolean
  currentPage: number
  onPageChange: (page: number) => void
  resultsInfo: {start: number; end: number; total: number}
}

export function MovieFinderView({
  data,
  isLoading,
  currentPage,
  onPageChange,
  resultsInfo,
}: MovieFinderViewProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading movies...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <MovieListView data={data} />
      {data ? (
        <Pagination
          currentPage={currentPage}
          totalPages={data.totalPages}
          onPageChange={onPageChange}
          resultsInfo={resultsInfo}
        />
      ) : null}
    </>
  )
}
