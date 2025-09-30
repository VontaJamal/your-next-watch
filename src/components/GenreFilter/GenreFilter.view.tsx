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
    <div className="flex gap-2 items-center">
      <select
        value={selectedGenre}
        onChange={(e) => onGenreChange(e.target.value)}
        disabled={isLoading}
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
          className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Clear
        </button>
      ) : null}
      {error && (
        <div className="text-red-500 text-sm">Failed to load genres</div>
      )}
    </div>
  )
}
