type GenreFilterViewProps = {
  genreList: string[]
  selectedGenre: string
  isLoading: boolean
  error: Error | null
  onGenreChange: (genre: string) => void
  onClearGenre: () => void
}

export function GenreFilterView({
  genreList,
  selectedGenre,
  isLoading,
  error,
  onGenreChange,
  onClearGenre,
}: GenreFilterViewProps) {
  return (
    <div
      className="flex gap-2 items-center"
      role="group"
      aria-labelledby="genre-filter-label"
    >
      <label id="genre-filter-label" htmlFor="genre-select" className="sr-only">
        Filter movies by genre
      </label>
      <select
        id="genre-select"
        value={selectedGenre}
        onChange={(e) => onGenreChange(e.target.value)}
        disabled={isLoading}
        aria-label="Filter movies by genre"
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50 min-w-[140px]"
      >
        <option value="">All Genres</option>
        {genreList
          ? genreList.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))
          : null}
      </select>
      {selectedGenre ? (
        <button
          onClick={onClearGenre}
          aria-label={`Clear genre filter (currently: ${selectedGenre})`}
          className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Clear
        </button>
      ) : null}
      {error && (
        <div id="genre-error" className="text-red-500 text-sm" role="alert">
          Failed to load genres
        </div>
      )}
    </div>
  )
}
