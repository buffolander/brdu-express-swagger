import { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } from 'constants'
import * as _ from 'lodash'

import { OpenAPI, OpenAPIV2 } from 'openapi-types'

import { CaseStyles } from '../interfaces'

const handler = (
  apiSpecification: OpenAPIV2.Document,
  controllersPath: string,
  caseStyle: CaseStyles = CaseStyles.KEBAB): (OpenAPIV2.OperationObject[] | null) => {
  const {
    paths,
    basePath,
  } = apiSpecification
  try {

    return Object.keys(paths).reduce((acc, path) => {
      const shortPath = path.replace(/\{/g, ':').replace(/\}/g, '')

      return [
        ...acc,
        ...Object.keys(paths[path]).map(method => ({
          method,
          shortPath,
          fullPath: (basePath || '').concat(shortPath),
          parameters: paths[path][method]['parameters'],
          responses: paths[path][method]['responses'],
          controller: (() => {
            const operationId = paths[path][method]['operationId']
            const functionName = `${controllersPath}/${_[caseStyle](operationId)}`
            return require(functionName)
          })(),
        })),
      ]
    }, [])
  } catch (error) {
    console.info('Route resolution error.')
    console.error(JSON.stringify(error))
    return null
  }
}

export default handler
