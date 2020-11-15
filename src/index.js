const parseYaml = require('./parse-yaml')
const resolveRoutes = require('./resolve-routes')

const validator = require('./validator')

const { requestLogger: logger } = require('./logger')

let swaggerPath, controllersPath, fileNameCasing

const expressSwagger = async () => {
  const specification = await parseYaml(swaggerPath)
  return {
    specification,
    routes: resolveRoutes(specification, controllersPath, fileNameCasing),
    validator,
    logger,
  }
}

const config = ({
  swaggerPath: _swaggerPath,
  controllersPath: _controllersPath,
  fileNameCasing: _fileNameCasing = 'KEBAB', // CAMEL, SNAKE
}) => {
  if (!_swaggerPath) throw ['Required Property: swaggerPath']
  swaggerPath = _swaggerPath
  controllersPath = _controllersPath
  fileNameCasing = _fileNameCasing

  return expressSwagger()
}

module.exports = config
/*
const path = require('path')

const test = await config({
  swaggerPath: path.resolve(__dirname, '../tests/swagger-mock.yaml'),
  controllersPath: path.resolve(__dirname, '../tests/mocked-controllers'),
})
console.info(test)
 */