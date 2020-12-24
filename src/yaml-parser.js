const SwaggerParser = require('@apidevtools/swagger-parser')

const handler = async (path) => {
  try {
    return await SwaggerParser.validate(path)
  } catch (err) {
    console.error(JSON.stringify(err))
    return Promise.resolve(null)
  }
}
module.exports = handler
