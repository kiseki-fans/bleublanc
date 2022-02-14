import { rest } from 'msw'

export const handlers = [
  rest.post(`${process.env.REACT_APP_API_URL}/login`, async (req, res, ctx) => {
    // Persist user's authentication in the session
    sessionStorage.setItem('is-authenticated', 'true')
    const originalResponse = await ctx.fetch(req)
    const originalResponseData = await originalResponse.json()
    console.log('[msw] login handler: originalResponseData:', originalResponseData);

    return res(
      ctx.status(200),
      ctx.json({
        user: {
          username: 'mockUserA',
          permissions: ['AMAZING_ADMIN_PERMISSION'],
        }
      }),
    )
  }),

  rest.get(`${process.env.REACT_APP_API_URL}/magicitems`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(["mock response"]),
    )
  }),
]