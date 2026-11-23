import type { StaffUser } from '@acme-staff/common/entities';

export type IAuthLoginStaffUserRecord = Pick<StaffUser, 'id' | 'passwordHash' | 'status'>;
