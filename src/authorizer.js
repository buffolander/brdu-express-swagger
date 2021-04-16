/*
  authorizerSettings: {
    contextUserVariable: 'user_id',
    contextOrganizationsArray: 'organizations',
    policies: [{
      paths: [
        '/service-companies/:profile-id',
      ],
      methods: [
        'PUT',
        'PATCH',
      ],
      authorizedRoles: [ // enum: ['*', 'self','{org_type}:{role}', 'service_company:admin'],
        'service_company:admin',
      ],
      delegation: 'profile_id',
    }],
  },
*/

const getContext = (req) => {
  const context = req.get('X-Endpoint-API-UserInfo')
  let parsedContext
  try {
    parsedContext = JSON.parse(Buffer.from(context, 'base64').toString('utf-8'))
  } catch (err) {
    parsedContext = {}
  }
  return parsedContext
}

const verifySelfOnly = (req, context, policy, uid) => {
  const { delegation } = policy
  if (!delegation) return false
  return (req.params[delegation] || req.query[delegation]) === context[uid]
}

const verifyRoles = (req, context, policy, orgs) => {
  const { authorizedRoles, delegation } = policy
  const delegationValue = delegation
    ? `:${(req.params[delegation] || req.query[delegation])}`
    : '*'
  const contextRoles = context[orgs]
    .reduce((acc, cur) => ([
      ...acc,
      ...(cur.role
        ? [[
          cur.organization_type,
          cur.role,
          delegation ? cur.organization_id : '*',
        ].join(':')]
        : []
      ),
      ...(cur.roles
        ? cur.roles.map((role) => ([
          cur.organization_type,
          role,
          delegation ? cur.organization_id : '*',
        ].join(':')))
        : []
      ),
    ]), [])
  const policyRoles = authorizedRoles
    .map((role) => `${role}${delegationValue}`)
  const intersectArrays = policyRoles.find((role) => contextRoles.includes(role))
  return typeof intersectArrays !== 'undefined'
}

const authorizer = (req, res, next, authorizerSettings) => {
  const context = getContext(req)
  req.context = context
  const {
    contextUserVariable: uid = 'user_id',
    contextOrganizationsArray: orgs = 'organizations',
    policies,
  } = authorizerSettings

  if (!context[uid]) return next() // service-to-service request

  const policy = policies.find((policy) => (
    policy.paths.includes(req.path) && policy.methods.includes(req.method)
  ))
  if (!policy || policy.authorizedRoles.includes('*')) return next()

  const gatekeepers = [
    verifyRoles(req, context, policy, orgs),
    ...(policy.authorizedRoles.includes('self') ? [verifySelfOnly(req, context, policy, uid)] : []),
  ]
  if (gatekeepers.includes(true)) return next()
  return res.sendStatus(403)
}

module.exports = authorizer
