import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'

type SearchInputProps = {
  onSearchChange: (query: string) => void
}

export function SearchInput({onSearchChange}: SearchInputProps) {
  const router = useRouter()
  const [inputValue, setInputValue] = useState('')
  const [hasSearchQuery, setHasSearchQuery] = useState(false)

  useEffect(() => {
    if (router.isReady) {
      const search = (router.query.search as string) || ''
      setInputValue(search)
      setHasSearchQuery(!!search)
    }
  }, [router.isReady, router.query.search])

  const handleInputChange = (value: string) => {
    setInputValue(value)
  }

  const handleSearch = (query: string) => {
    router.push(
      {
        pathname: router.pathname,
        query: {...router.query, search: query, page: 1},
      },
      undefined,
      {shallow: true},
    )
    onSearchChange(query)
  }

  const handleSubmit = () => {
    handleSearch(inputValue)
    setHasSearchQuery(!!inputValue)
  }

  const handleClearSearch = () => {
    setInputValue('')
    setHasSearchQuery(false)
    const {search, ...queryWithoutSearch} = router.query
    router.push(
      {
        pathname: router.pathname,
        query: {...queryWithoutSearch, page: 1},
      },
      undefined,
      {shallow: true},
    )
    onSearchChange('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="mb-6">
      <div className="flex gap-2 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search movies..."
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Search
        </button>
        {hasSearchQuery && (
          <button
            onClick={handleClearSearch}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
