const flow = require('lodash/flow')
const deref = require('json-schema-deref-sync')

const { readFileSync } = require('fs')
const { safeLoad: yamlSafeLoad } = require('js-yaml')

const handler = (path) => {
  try {
    return flow([
      path => readFileSync(path, 'utf8'),
      content => yamlSafeLoad(content),
      jsonObject => deref(jsonObject),
    ])(path)
  } catch (err) {
    console.error(JSON.stringify(err))
    return Promise.resolve(null)
  }
}

module.exports = handler
