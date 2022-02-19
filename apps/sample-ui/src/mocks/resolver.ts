import {
  DefaultRequestBody,
  PathParams,
  ResponseComposition,
  RestContext,
  RestRequest,
} from 'msw'

export interface IRecordedResponse {
  name: string
  originalResponse: any
}

function parseRequestName(req: RestRequest<DefaultRequestBody, PathParams>) {
  const path = req.url.pathname
    .substring(1, req.url.pathname.length)
    .split('/')
    .join('-')
  return `${req.method.toLowerCase()}-${path}`
}

export async function recordRestResponse(
  req: RestRequest<DefaultRequestBody, PathParams>,
  _res: ResponseComposition<DefaultRequestBody>,
  ctx: RestContext
) {
  const originalResponse = await ctx.fetch(req)
  const originalResponseData = await originalResponse.json()
  const requestName = parseRequestName(req)
  window.parent?.postMessage(
    {
      event: 'bleublanc_response_update',
      data: {
        name: requestName,
        originalResponse: originalResponseData,
      },
    },
    '*'
  )
}
