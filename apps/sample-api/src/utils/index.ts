import * as dotenv from 'dotenv'

/**
 * probably can make a config file in future if the usage expands
 * this sample-api may not grow too big as the main work would be in the library itself.
 * but lets see how things go
 */
dotenv.config()

const defaultOrigin = ['http://localhost:3000']

export function getCorsOrigin() {
  const FRONTEND_PORTS = process.env.FRONTEND_PORTS?.split(',')
  const CORS_ORIGINS = process.env.CORS_ORIGINS?.split(',')

  if (!FRONTEND_PORTS && !CORS_ORIGINS) {
    return defaultOrigin
  }

  const origin: string[] = []

  FRONTEND_PORTS?.forEach(port => {
    Boolean(port) && origin.push(`http://localhost:${port}`)
  })

  CORS_ORIGINS?.forEach(url => {
    Boolean(url) && origin.push(url)
  })

  return origin
}
