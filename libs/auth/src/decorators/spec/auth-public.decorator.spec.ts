import { Public } from '../auth-public.decorator';

describe('Public', () => {
  it('opens a route to the guards and documents it without a security requirement', () => {
    class Probe {
      @Public()
      public handle(this: void): string {
        return 'handled';
      }
    }

    const isPublic: unknown = Reflect.getMetadata('auth:public', Probe.prototype.handle);
    const security: unknown = Reflect.getMetadata('swagger/apiSecurity', Probe.prototype.handle);

    expect({ isPublic, security }).toEqual({ isPublic: true, security: [{}] });
  });

  it('opens every route of a controller it decorates', () => {
    @Public()
    class Probe {}

    const isPublic: unknown = Reflect.getMetadata('auth:public', Probe);
    const security: unknown = Reflect.getMetadata('swagger/apiSecurity', Probe);

    expect({ isPublic, security }).toEqual({ isPublic: true, security: [{}] });
  });
});
