const Promise = require('bluebird')
const { memoize, prop } = require('ramda')
const { getEnv } = require('../../config')
const { makeFromLogger } = require('../../lib/logger')

const makeLogger = makeFromLogger('lib/credentials')
const Credstash = require('nodecredstash')

const stage = process.env.STAGE

const credstash = new Credstash({
  table: `sblto-${stage}`,
  awsOpts: { region: 'us-east-1' },
})

const localCredstashTable = {
  'accounts/pagarme/api_key': 'abc123',
}

const getCredentials = memoize((key) => {
  const logger = makeLogger({ operation: 'getCredentials' })
  const credstashKey = `${key}`

  logger.info({ status: 'started', metadata: { credstashKey } })

  if (getEnv() === 'test') {
    return Promise.resolve(prop(credstashKey, localCredstashTable))
  }

  return credstash.getSecret({
    name: credstashKey,
  })
    .catch((err) => {
      logger.error({
        status: 'failed',
        metadata: {
          error_name: err.name,
          error_stack: err.stack,
          error_message: err.message,
        },
      })
      return Promise.reject(err)
    })
})

module.exports = {
  getCredentials,
}
