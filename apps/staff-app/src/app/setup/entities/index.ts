import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

import {
  Customer,
  IdempotencyKey,
  LedgerEntry,
  Order,
  OrderProduct,
  Product,
  ProductStock,
} from '@acme-core/entities';
import {
  StaffRole,
  StaffRolePermission,
  StaffUser,
  StaffUserRole,
} from '@acme-staff/common/entities';
import { Note, NoteRevision, SubjectTag, Tag } from '@acme-staff/common/entities';

export const entities: TypeOrmModuleOptions['entities'] = [
  Customer,
  IdempotencyKey,
  LedgerEntry,
  Note,
  NoteRevision,
  Order,
  OrderProduct,
  Product,
  ProductStock,
  StaffRole,
  StaffRolePermission,
  StaffUser,
  StaffUserRole,
  SubjectTag,
  Tag,
];
