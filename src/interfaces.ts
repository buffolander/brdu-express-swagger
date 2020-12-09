enum CaseStyles {
  KEBAB = 'kebabCase',
  CAMEL = 'camelCase',
  SNAKE = 'snakeCase',
}

enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
}

interface SpecificationInfo {
  title: string
  version: string
  description?: string
}

interface Specification {
  swagger: string
  info: SpecificationInfo
  schemes?: string[]
  host?: string
  basePath?: string
  paths: any
  definitions?: any
  parameters?: any
  responses?: any
}

interface Operation {
  method: Methods
  shortPath: string
  fullPath: string
  parameters: any
  responses: any
  controller: Function
}

export {
  CaseStyles,
  Methods,
  Specification,
  Operation,
}
