import { validate } from '@apidevtools/swagger-parser'

import { OpenAPI, OpenAPIV2 } from 'openapi-types'

const handler = (path: string): Promise<OpenAPI.Document> => {
  try {
    return validate(path)
  } catch (error) {
    throw new Error(error)
  }
}

export default handler
