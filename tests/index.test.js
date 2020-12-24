const path = require('path')

const { initJSON } = require('../src/index')({
  swaggerPath: path.resolve(__dirname, './swagger-mock.js'),
  controllersPath: path.resolve(__dirname, './mocked-controllers'),
})

initJSON()// ?
