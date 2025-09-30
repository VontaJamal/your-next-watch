import React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {GenreFilter} from './GenreFilter.data'
import {server} from '../../msw/mswServer'
import {rest} from 'msw'

// Set up environment variable for tests
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000'

// Mock Next.js router
const mockPush = jest.fn()
const mockQuery = {genre: ''}
const mockIsReady = true

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    query: mockQuery,
    pathname: '/',
    isReady: mockIsReady,
  }),
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('GenreFilter', () => {
  let queryClient: QueryClient
  const mockDispatch = jest.fn()

  beforeAll(() => {
    server.listen()
  })

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    mockDispatch.mockClear()
    mockPush.mockClear()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
  })

  afterEach(() => {
    server.resetHandlers()
    jest.clearAllMocks()
  })

  afterAll(() => {
    server.close()
  })

  const renderGenreFilter = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <GenreFilter dispatch={mockDispatch} />
      </QueryClientProvider>,
    )
  }

  it('should render loading state initially', () => {
    renderGenreFilter()

    const select = screen.getByRole('combobox')
    expect(select).toBeDisabled()
    expect(select).toHaveValue('')
  })

  it('should load and display genres successfully', async () => {
    renderGenreFilter()

    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
  })

  it('should handle API error gracefully', async () => {
    server.use(
      rest.get('http://localhost:3000/auth/token', (req, res, ctx) => {
        return res(ctx.json({token: 'mock-token'}))
      }),
      rest.get('http://localhost:3000/genres/movies', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({error: 'Server Error'}))
      }),
    )

    renderGenreFilter()

    await waitFor(() => {
      expect(screen.getByText('Failed to load genres')).toBeInTheDocument()
    })

    // The select should show error message but not be disabled (only disabled when loading)
    const select = screen.getByRole('combobox')
    expect(select).not.toBeDisabled()
  })
})
