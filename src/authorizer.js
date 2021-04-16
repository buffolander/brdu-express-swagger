/* const Policies = {
  uidVariable: 'user_id',
  [path]: {
    authorizedRoles: Array, enum: ['*', 'self','{org_type}:{role}', 'service_company:admin'],
    delegationVariable: String, e.g. 'organization_id' or 'user_id'
    },
  },
} */

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

const verifySelfOnly = (req, context, pathPolicies) => {
  const { delegationVariable = 'na', uidVariable = 'user_id' } = pathPolicies
  return (req.params[delegationVariable] || req.query[delegationVariable]) === context[uidVariable]
}

const verifyRoles = (req, context, pathPolicies) => {
  const { authorizedRoles, delegationVariable } = pathPolicies
  const delegationValue = delegationVariable
    ? `:${(req.params[delegationVariable] || req.query[delegationVariable])}`
    : '*'
  const rolesInContext = context.organizations.reduce((acc, cur) => ([
    ...acc,
    ...(cur.role
      ? [[
        cur.organization_type,
        cur.role,
        delegationVariable ? cur.organization_id : '*',
      ].join(':')]
      : []
    ),
    ...(cur.roles
      ? cur.roles.map((role) => ([
        cur.organization_type,
        role,
        delegationVariable ? cur.organization_id : '*',
      ].join(':')))
      : []
    ),
  ]), [])
  const rolesInPolicy = authorizedRoles.map((role) => `${role}${delegationValue}`)
  return rolesInPolicy.find((role) => rolesInContext.includes(role))
}

const authorizer = (req, res, next, policies) => {
  const context = getContext(req)
  req.context = context
  const { uidVariable = 'user_id' } = policies

  if (!context[uidVariable]) return next() // service-to-service request
  const pathPolicies = policies[req.path]
  if (!pathPolicies || pathPolicies.authorizedRoles.includes('*')) return next()

  if (pathPolicies.authorizedRoles === 'self') return verifySelfOnly(req, context, pathPolicies)
    ? next()
    : res.sendStatus(403)

  return verifyRoles(req, context, pathPolicies)
    ? next()
    : res.sendStatus(403)
}

module.exports = authorizer
