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
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="mt-6">
      <div className="flex justify-center items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          Previous
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 border rounded ${
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
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          Next
        </button>
      </div>

      {resultsInfo && resultsInfo.total > 0 && (
        <div className="mt-4 text-center text-gray-600">
          Showing results {resultsInfo.start}-{resultsInfo.end} of{' '}
          {resultsInfo.total}
        </div>
      )}
    </div>
  )
}
