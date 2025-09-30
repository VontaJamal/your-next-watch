type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  resultsInfo?: {start: number; end: number; total: number}
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  resultsInfo,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5 // Show 5 pages at a time
    const halfVisible = Math.floor(maxVisiblePages / 2)

    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <nav className="mt-6" aria-label="Pagination Navigation">
      <div
        className="flex justify-center items-center gap-2"
        role="group"
        aria-label="Pagination controls"
      >
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label={`Go to previous page (page ${currentPage - 1})`}
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Previous
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              page === currentPage
                ? 'bg-blue-500 text-white border-blue-500'
                : 'hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label={`Go to next page (page ${currentPage + 1})`}
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next
        </button>
      </div>

      {resultsInfo && resultsInfo.total > 0 && (
        <div
          className="mt-4 text-center text-gray-600"
          aria-label="Results information"
        >
          Showing results {resultsInfo.start}-{resultsInfo.end} of{' '}
          {resultsInfo.total}
        </div>
      )}
    </nav>
  )
}
