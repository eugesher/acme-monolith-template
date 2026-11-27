import { PermissionE2E } from './modules/permission.e2e';
import { RoleE2E } from './modules/role.e2e';
import { UserE2E } from './modules/user.e2e';
import type { AppE2EContext } from '../../context/app-e2e.context';

export class AccessE2E {
  private constructor(
    private readonly permissionE2E: PermissionE2E,
    private readonly roleE2E: RoleE2E,
    private readonly userE2E: UserE2E,
  ) {}

  public static of(ctx: AppE2EContext): AccessE2E {
    return new AccessE2E(PermissionE2E.of(ctx), RoleE2E.of(ctx), UserE2E.of(ctx));
  }

  public execute(): void {
    describe('Permission', () => {
      this.permissionE2E.list();
    });

    describe('Role', () => {
      this.roleE2E.list();
      this.roleE2E.create();
      this.roleE2E.reassignPermissions();
    });

    describe('User', () => {
      this.userE2E.register();
      this.userE2E.reassignRoles();
    });
  }
}
