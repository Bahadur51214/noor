export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
}

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: AdminRole;
  active: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminSession = {
  adminId: string;
  role: string;
  expiresAt: number;
};

export type AuditLog = {
  id: string;
  adminId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: Date;
  adminName?: string;
};
