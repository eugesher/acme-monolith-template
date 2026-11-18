import type { StaffUser } from '@acme-core/entities';

export type IAuthLoginStaffUserRecord = Pick<StaffUser, 'id' | 'passwordHash' | 'status'>;
