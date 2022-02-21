import { rest } from 'msw'
import { recordRestResponse } from './resolver'

export const handlers = [
  rest.get(`${process.env.REACT_APP_API_URL}/*`, recordRestResponse),
  rest.post(`${process.env.REACT_APP_API_URL}/*`, recordRestResponse),
  rest.patch(`${process.env.REACT_APP_API_URL}/*`, recordRestResponse),
  rest.delete(`${process.env.REACT_APP_API_URL}/*`, recordRestResponse),

  // custom interceptor
  // rest.post(`${process.env.REACT_APP_API_URL}/login`, async (req, res, ctx) => {
  //   // Persist user's authentication in the session
  //   sessionStorage.setItem('is-authenticated', 'true')
  //   try {
  //     const mock = require('./json/post-login.json')
  //     return res(ctx.status(200), ctx.json(mock))
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }),

  // rest.get(
  //   `${process.env.REACT_APP_API_URL}/magicitems`,
  //   async (req, res, ctx) => {
  //     try {
  //       const mock = require('./json/get-magicitems.json')
  //       return res(ctx.status(200), ctx.json(mock))
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   }
  // ),
]
