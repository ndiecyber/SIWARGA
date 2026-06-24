import { AsyncLocalStorage } from 'node:async_hooks'
import type { Logger } from 'pino'

export interface RequestContext {
  requestId: string
  userId?: string
  route?: string
}

export const requestContext = new AsyncLocalStorage<RequestContext>()

export function getRequestLogger(logger: Logger) {
  const ctx = requestContext.getStore()
  return ctx
    ? logger.child({ requestId: ctx.requestId, userId: ctx.userId })
    : logger
}
