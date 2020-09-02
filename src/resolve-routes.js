const _ = require("lodash")

const caseChange = { KEBAB: _.kebabCase, CAMEL: _.camelCase, SNAKE: _.snakeCase }

const resolveRoutes = (swaggerJson, controllersPath, fileNameCasing) => {
  const {
    paths,
    basePath,
  } = swaggerJson

  try {
    const routes = []
    Object.keys(paths).map(path => {
      Object.keys(paths[path]).map(method => routes.push({
        path,
        fullPath: (basePath || '').concat(path),
        method,
        parameters: paths[path][method]['parameters'],
        responses: paths[path][method]['responses'],
        controller: (() => {
          const operationId = paths[path][method]['operationId']
          const functionName = `${controllersPath}/${caseChange[fileNameCasing](operationId)}`
          return require(functionName)
        })(),
      }))
    })
    return routes
  } catch (err) {
    console.error(JSON.stringify(err))
    return null
  }
}

module.exports = resolveRoutes
