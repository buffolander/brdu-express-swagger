import parseSwagger from './utils/swagger-parser'
import resolveRoutes from './utils/route-resolver'

import { OpenAPI } from 'openapi-types'

import { CaseStyles } from './interfaces'


class Swaggerize {
  private swaggerPath: string
  private controllersPath: string
  private caseStyle: CaseStyles

  constructor(
    swaggerPath: string,
    controllersPath: string,
    caseStyle: CaseStyles = CaseStyles.KEBAB,
  ) {
    this.swaggerPath = swaggerPath
    this.controllersPath = controllersPath
    this.caseStyle = caseStyle
  }

  public async init(): Promise<object | null> {
    try {
      const apiSpecification: (OpenAPI.Document) = await parseSwagger(this.swaggerPath)
      return {
        apiSpecification,
        routes: resolveRoutes(apiSpecification, this.controllersPath, this.caseStyle),
      }
    } catch(err) {
      console.error(err)
      return null
    }
  }
}

import * as path from 'path'
const temp = new Swaggerize(path.resolve('tests/swagger-mock.yaml'), 'now')
console.info(temp.init().then(res => console.log(res)))
