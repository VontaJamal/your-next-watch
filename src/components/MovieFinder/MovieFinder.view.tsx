import {MovieListView} from '../MovieList/MovieList.view'

type MovieFinderViewProps = {
  data: any
  isLoading: boolean
  error: Error | null
}

export function MovieFinderView({
  data,
  isLoading,
  error,
}: MovieFinderViewProps) {
  return (
    <div className="w-3/5 my-5 mx-auto text-center">
      <MovieListView data={data} />
    </div>
  )
}
