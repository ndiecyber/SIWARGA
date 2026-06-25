export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const log = require('./lib/logger').logger
    const info = (...args: unknown[]) => log.info({ source: 'console' }, ...args)
    const warn = (...args: unknown[]) => log.warn({ source: 'console' }, ...args)
    const error = (...args: unknown[]) => log.error({ source: 'console' }, ...args)
    const debug = (...args: unknown[]) => log.debug({ source: 'console' }, ...args)
    console.log = info
    console.warn = warn
    console.error = error
    console.debug = debug
  }
}
