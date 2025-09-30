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
      <section aria-label="Movie results" role="region">
        <div className="text-center py-8" role="status" aria-live="polite">
          <p className="text-gray-500">No movies found</p>
        </div>
      </section>
    )
  }

  return (
    <section aria-label="Movie results" role="region">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        role="list"
        aria-label={`${data.data.length} movies found`}
      >
        {data.data.map(({id}) => (
          <div key={id} role="listitem">
            <Movie id={id} />
          </div>
        ))}
      </div>
    </section>
  )
}
