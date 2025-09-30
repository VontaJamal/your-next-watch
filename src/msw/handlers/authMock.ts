import {rest} from 'msw'

export const authMock = rest.get(
  'http://localhost:3000/auth/token',
  (req, res, ctx) => {
    return res(ctx.json({token: 'mock-token'}))
  },
)
