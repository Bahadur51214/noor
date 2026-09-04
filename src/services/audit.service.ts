import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

export interface AuditLogParams {
  adminId?: string
  action: string
  entityType: string
  entityId?: string
  metadata?: Prisma.InputJsonValue
  ipAddress?: string
}

export const auditService = {
  async log(params: AuditLogParams) {
    try {
      await db.auditLog.create({ data: params })
    } catch (error) {
      console.error('[Audit] Failed to log:', error)
    }
  },

  async getAll(params?: {
    page?: number
    pageSize?: number
    adminId?: string
    entityType?: string
  }) {
    const page = params?.page || 1
    const pageSize = params?.pageSize || 20

    const where = {
      ...(params?.adminId ? { adminId: params.adminId } : {}),
      ...(params?.entityType ? { entityType: params.entityType } : {})
    }

    const [logs, total] = await Promise.all([
      db.auditLog.findMany({
        where,
        include: { admin: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      db.auditLog.count({ where })
    ])

    return { logs, total, pages: Math.ceil(total / pageSize) }
  }
}
