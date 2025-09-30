import Image from 'next/image'

type MovieDetails = {
  id: string
  title: string
  posterUrl?: string
  rating?: string
  summary?: string
  duration?: string
  ratingValue?: number
  genres?: Array<{id: string; title: string}>
  mainActors?: string[]
}

type MovieProps = {
  movieDetails?: MovieDetails
  isLoading?: boolean
  error?: Error | null
}

function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!match) return duration

  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h`
  } else {
    return `${minutes}m`
  }
}

export function MovieView({movieDetails, isLoading, error}: MovieProps) {
  if (isLoading) {
    return (
      <section
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        aria-label="Loading movie details"
      >
        <div className="p-4">
          <div className="text-sm text-gray-500" role="status">
            Loading details...
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        aria-label="Movie details error"
      >
        <div className="p-4">
          <div className="text-sm text-red-500" role="alert" aria-live="polite">
            Failed to load details
          </div>
        </div>
      </section>
    )
  }

  if (!movieDetails) {
    return null
  }

  const {posterUrl, title, ratingValue, duration, mainActors} = movieDetails

  return (
    <section
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
      aria-label={`Movie: ${title}`}
    >
      <div className="relative h-80">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`${title} movie poster`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div
            className="w-full h-full bg-gray-200 flex items-center justify-center"
            role="img"
            aria-label={`${title} - no poster available`}
          >
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}
        {movieDetails?.summary ? (
          <div
            className="absolute inset-0 bg-black bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4"
            aria-hidden="true"
          >
            <p className="text-white text-sm text-center leading-relaxed">
              {movieDetails.summary}
            </p>
          </div>
        ) : null}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            {ratingValue ? (
              <span
                className="text-xs text-gray-600"
                aria-label={`Rating: ${ratingValue} stars`}
              >
                ⭐️ {ratingValue}
              </span>
            ) : null}

            {duration ? (
              <span
                className="text-xs text-gray-600"
                aria-label={`Duration: ${formatDuration(duration)}`}
              >
                {formatDuration(duration)}
              </span>
            ) : null}
          </div>

          {movieDetails?.genres && movieDetails.genres.length > 0 ? (
            <div>
              <p className="text-xs text-gray-500 mb-1">
                <span className="font-medium">Genres:</span>
              </p>
              <p
                className="text-xs text-gray-600"
                aria-label={`Genres: ${movieDetails.genres
                  .slice(0, 3)
                  .map((genre) => genre.title)
                  .join(', ')}${
                  movieDetails.genres.length > 3 ? ' and more' : ''
                }`}
              >
                {movieDetails.genres
                  .slice(0, 3)
                  .map((genre) => genre.title)
                  .join(', ')}
                {movieDetails.genres.length > 3 ? '...' : ''}
              </p>
            </div>
          ) : null}

          {mainActors && mainActors.length > 0 ? (
            <div>
              <p className="text-xs text-gray-500 mb-1">
                <span className="font-medium">Cast:</span>
              </p>
              <p
                className="text-xs text-gray-600"
                aria-label={`Cast: ${mainActors.slice(0, 3).join(', ')}${
                  mainActors.length > 3 ? ' and more' : ''
                }`}
              >
                {mainActors.slice(0, 3).join(', ')}
                {mainActors.length > 3 ? '...' : ''}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
