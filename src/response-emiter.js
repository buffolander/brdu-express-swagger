const defaults = require('json-schema-defaults')

const responseEmiter = ({
  res,
  code,
  errors,
  data,
}) => {
  const { specResponses } = res
  const responseJson = defaults(specResponses[code].schema)
  res.status(code).json({ ...responseJson, errors, data })
}

module.exports = responseEmiter
