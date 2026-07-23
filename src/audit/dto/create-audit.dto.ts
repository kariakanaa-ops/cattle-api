export class CreateAuditDto {
  userId?: string;

  entity: string;

  entityId?: string;

  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';

  oldValues?: any;

  newValues?: any;

  ipAddress?: string;

  description?: string;
}