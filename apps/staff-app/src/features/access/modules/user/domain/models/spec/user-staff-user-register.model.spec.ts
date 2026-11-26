import { UserStaffUserRegisterModel } from '../user-staff-user-register.model';

describe('UserStaffUserRegisterModel', () => {
  let user: UserStaffUserRegisterModel;

  beforeEach(() => {
    user = UserStaffUserRegisterModel.reconstitute({ id: '5', email: 'editor@example.com' });
  });

  describe('toSnapshot', () => {
    it('answers the registered user with its id and email', () => {
      expect(user.toSnapshot()).toEqual({ id: '5', email: 'editor@example.com' });
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the id of the registered user', () => {
      expect(user.toLoggerPayload()).toEqual({ id: '5' });
    });
  });
});
