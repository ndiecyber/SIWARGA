export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { logger } = require('./lib/logger')
    const levels = { log: 'info', warn: 'warn', error: 'error', debug: 'debug' } as const
    for (const [method, level] of Object.entries(levels)) {
      const original = (console as any)[method]
      ;(console as any)[method] = (...args: any[]) => {
        ;(logger as any)[level]({ source: 'console' }, ...args)
      }
    }
  }
}
