const { parse, stringify } = require('flatted')
const geoip = require('geoip-lite')

const reqLogProperties = [
  'protocol',
  'method',
  'hostname',
  'subdomains',
  'path',
  'headers',
  'params',
  'query',
  'cookies',
  'body',
]

const requestLogger = (req, res, next) => {
  reqLogProperties.map((prop) => {
    const message = JSON.stringify(parse(stringify(req[prop])))
    console.info(`http-req ${prop}`, message)
  })
  const ips = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  console.log('http-req ip', ips)
  try {
    const location = geoip.lookup(Array.isArray(ips) ? ips[0] : ips)
    console.info('http-req location', JSON.stringify(location))
  } catch (err) {
    console.info('http-req location', undefined)
  }
  return next()
}

module.exports = requestLogger
