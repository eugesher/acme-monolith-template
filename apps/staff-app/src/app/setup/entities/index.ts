import type { Type } from '@nestjs/common';

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

export const entities: Type[] = [
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
