const { parse, stringify } = require('flatted')

const reqLogProperties = [
  'ips',
  'protocol',
  'method',
  'hostname',
  'subdomains',
  'path',
  'route',
  'params',
  'query',
  'cookies',
  'body',
]

module.exports.requestLogger = (req, res, next) => {
  reqLogProperties.map((prop) => {
    const message = JSON.stringify(parse(stringify(req[prop])))
    console.info(`http-req ${prop}`, message)
  })
  return next()
}
