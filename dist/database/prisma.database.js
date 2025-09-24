// src/prisma.ts
import { PrismaClient } from '@prisma/client';
const globalForPrisma = globalThis;
export const db = globalForPrisma.prisma ??
    new PrismaClient({
        log: ['query', 'error', 'warn'],
    });
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = db;
export default db;
//# sourceMappingURL=prisma.database.js.map