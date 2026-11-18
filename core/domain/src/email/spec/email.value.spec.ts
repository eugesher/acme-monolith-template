import { EmailValue } from '../email.value';

describe('EmailValue', () => {
  describe('create', () => {
    it('trims the email and lowers its case', () => {
      const email = EmailValue.create('  Eve@Example.COM ');

      expect(email.address).toBe('eve@example.com');
    });

    it('equals the same address written in another case', () => {
      const email = EmailValue.create('eve@example.com');
      const sameEmail = EmailValue.create(' EVE@example.com');

      expect(email.equals(sameEmail)).toBe(true);
    });
  });

  describe('isValid', () => {
    it('answers true for a well-formed email', () => {
      const email = EmailValue.create('eve@example.com');

      expect(email.isValid()).toBe(true);
    });

    it.each(['eve', 'eve@', '@example.com', 'eve@example', 'e ve@example.com'])(
      'answers false for the malformed email %s',
      (address) => {
        const email = EmailValue.create(address);

        expect(email.isValid()).toBe(false);
      },
    );
  });
});
