import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const prisma = globalThis.prisma || new PrismaClient({
  log: [
    { level: 'warn', emit: 'stdout' },
    { level: 'error', emit: 'stdout' },
    { level: 'query', emit: 'event' },
  ],
})


if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export default prisma;