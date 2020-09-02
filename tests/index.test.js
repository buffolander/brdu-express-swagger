const path = require('path')

const expressSwagger = require('../src/index')({
  swaggerPath: path.resolve(__dirname, './swagger-mock.yaml'),
  controllersDirectory: path.resolve(__dirname, './mocked-controllers'),
})

expressSwagger({
  path: '/v1/users',
  method: 'post',
}, {}) // ?
