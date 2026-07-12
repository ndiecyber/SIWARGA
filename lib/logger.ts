import pino from 'pino'

const isProduction = process.env.NODE_ENV === 'production'

export const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  transport: isProduction
    ? undefined
    : { target: 'pino-pretty', options: { colorize: true } },
  redact: {
    paths: [
      'password', 'token', 'secret', 'authorization',
      'cookie', 'apiKey', 'phoneNumber', 'alamat',
    ],
    censor: '[REDACTED]',
  },
  serializers: {
    err: pino.stdSerializers.err,
  },
  base: {
    service: 'siwarga',
    env: process.env.NODE_ENV,
  },
})

export const authLogger         = logger.child({ module: 'auth' })
export const feesLogger         = logger.child({ module: 'fees' })
export const housesLogger       = logger.child({ module: 'houses' })
export const usersLogger        = logger.child({ module: 'users' })
export const announcementLogger = logger.child({ module: 'announcement' })
export const apiLogger          = logger.child({ module: 'api' })
