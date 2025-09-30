import {rest} from 'msw'

export const genreMock = rest.get(
  'http://localhost:3000/genres/movies',
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: [
          {id: '1', title: 'Action', movies: ['movie1', 'movie2']},
          {id: '2', title: 'Comedy', movies: ['movie3', 'movie4']},
          {id: '3', title: 'Drama', movies: ['movie5', 'movie6']},
          {id: '4', title: 'Horror', movies: ['movie7', 'movie8']},
          {id: '5', title: 'Sci-Fi', movies: ['movie9', 'movie10']},
        ],
        totalPages: 1,
      }),
    )
  },
)

export const genreErrorMock = rest.get(
  'http://localhost:3000/genres/movies',
  (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({error: 'Internal Server Error'}))
  },
)
