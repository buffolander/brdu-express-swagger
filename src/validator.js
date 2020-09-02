const AJV = require('ajv')
const empty = require('lodash/isEmpty')

const responseEmiter = require('./response-emiter')

const validator = (req, res, next, specParameters, specResponses) => {
  req.requestTime = Date.now()
  res.specResponses = specResponses
  res.emiter = responseEmiter

  const requiredHeaders = specParameters
    .filter(({ in: _in, required }) => _in === 'header' && required)
  const missingHeaders = requiredHeaders
    .map(({ name: headerName }) => ({ header: headerName, value: req.get(headerName) }))
    .filter(header => !header.value)
  if (missingHeaders.length) return responseEmiter({
    res,
    code: 400,
    errors: {
      required: {
        headers: missingHeaders.map(({ header }) => header),
      },
    },
  })

  const bodySchema = specParameters
    .find(param => param.in === 'body')
  if (bodySchema && empty(req.body)) return responseEmiter({
    res,
    code: 400,
    errors: {
      required: 'body',
    },
  })
  if (bodySchema) {
    const ajv = new AJV({ allErrors: true })
    const validate = ajv.compile(bodySchema.schema)
    const valid = validate(req.body)
    if (!valid) return responseEmiter({
      res,
      code: 400,
      errors: ((errors) => {
        return errors.reduce((acc, error) => {
          const { keyword } = error
          acc[keyword] = [
            ...(acc[keyword] || []),
            ((keyword, error) => {
              const {
                dataPath,
                params: {
                  allowedValues,
                  format,
                  missingProperty,
                  type,
                },
              } = error
              const property = (missingProperty ? [dataPath, missingProperty].join('.') : dataPath)
                .slice(1)
              return property
                .concat(type || format ? '#' : '', type || format || '')
                .concat(allowedValues ? ': ' + allowedValues.join(', ') : '')
            })(keyword, error),
          ]
          return acc
        }, {})
      })(validate.errors),
    })
  }

  return next()
}

module.exports = validator
