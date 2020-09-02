const parseYaml = require('../src/parse-yaml')
const validPath = process.cwd() + '/tests/swagger-mock.yaml'

const result = parseYaml(null, validPath)

describe('valid file path', () => {
  test('should return the API Info.Title', async () => {
    const { info: { title } } = await result
    expect(title).toBe('Sample API')
  });
  test('should return the two existing paths in the mock specification', async () => {
    const { paths } = await result
    expect(Object.keys(paths)).toHaveLength(2)
  });
  test('\'POST /users\' should include a parameter \'user\' in body', async () => {
    const { paths } = await result
    const { name, in: _in } = paths['/users']['post']['parameters'][0]
    expect(name).toBe('user')
    expect(_in).toBe('body')
  });
})