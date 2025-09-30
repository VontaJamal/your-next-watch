import {Movie} from '../Movie'

type Movie = {
  id: string
  title: string
  posterUrl?: string
  rating?: string
}

type MovieListViewProps = {
  data: {data: Movie[]; totalPages: number} | undefined
}

export function MovieListView({data}: MovieListViewProps) {
  if (!data || data.data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No movies found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {data.data.map(({id}) => (
        <Movie
          key={id}
          id={id}
        />
      ))}
    </div>
  )
}
