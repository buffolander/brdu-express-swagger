const parseYaml = require('./yaml-parser')
const resolveRoutes = require('./route-resolver')

const logger = require('./logger')
const authorizer = require('./authorizer')
const validator = require('./validator')

let swaggerPath, controllersPath, fileNameCasing

const initAsync = async () => {
  const specification = await parseYaml(swaggerPath)
  return {
    specification,
    routes: resolveRoutes(specification, controllersPath, fileNameCasing),
    validator,
    logger,
    authorizer,
  }
}

const initSync = () => {
  const specification = require(swaggerPath)
  return {
    specification,
    routes: resolveRoutes(specification, controllersPath, fileNameCasing),
    validator,
    logger,
    authorizer,
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

  return { initYAML: initAsync, initJSON: initSync }
}

module.exports = config
