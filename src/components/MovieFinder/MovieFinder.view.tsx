import {MovieListView} from '../MovieList/MovieList.view'
import {Pagination} from '../Pagination'

type MovieFinderViewProps = {
  data: {data: any[]; totalPages: number} | undefined
  isLoading: boolean
  error: Error | null
  currentPage: number
  onPageChange: (page: number) => void
  resultsInfo: {start: number; end: number; total: number}
}

export function MovieFinderView({
  data,
  isLoading,
  error,
  currentPage,
  onPageChange,
  resultsInfo,
}: MovieFinderViewProps) {
  return (
    <div className="w-3/5 my-5 mx-auto text-center">
      <MovieListView data={data} />
      {data ? (
        <Pagination
          currentPage={currentPage}
          totalPages={data.totalPages}
          onPageChange={onPageChange}
          resultsInfo={resultsInfo}
        />
      ) : null}
    </div>
  )
}
