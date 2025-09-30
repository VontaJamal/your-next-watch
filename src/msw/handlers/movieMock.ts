import {rest} from 'msw'

export const movieMock = rest.get(
  'http://localhost:3000/movies/:id',
  (req, res, ctx) => {
    const {id} = req.params

    // Mock movie data based on ID
    const mockMovies = {
      'movie-1': {
        id: 'movie-1',
        title: 'The Dark Knight',
        posterUrl: 'https://example.com/poster.jpg',
        ratingValue: 9.0,
        duration: 'PT2H32M',
        summary: 'Batman faces the Joker in this epic superhero film.',
        genres: [
          {id: '1', title: 'Action'},
          {id: '2', title: 'Crime'},
          {id: '3', title: 'Drama'},
        ],
        mainActors: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
      },
      'movie-2': {
        id: 'movie-2',
        title: 'Inception',
        posterUrl: 'https://example.com/inception.jpg',
        ratingValue: 8.8,
        duration: 'PT2H28M',
        summary:
          'A thief who steals corporate secrets through dream-sharing technology.',
        genres: [
          {id: '4', title: 'Sci-Fi'},
          {id: '5', title: 'Thriller'},
        ],
        mainActors: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy'],
      },
    }

    const movie = mockMovies[id as keyof typeof mockMovies]

    if (!movie) {
      return res(ctx.status(404), ctx.json({error: 'Movie not found'}))
    }

    return res(ctx.json(movie))
  },
)

export const movieErrorMock = rest.get(
  'http://localhost:3000/movies/:id',
  (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({error: 'Internal Server Error'}))
  },
)
