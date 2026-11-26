import { ValueObject } from '../value-object';

describe('ValueObject', () => {
  it('freezes its props', () => {
    class MoneyValue extends ValueObject<{ amount: number }> {
      public get frozen(): boolean {
        return Object.isFrozen(this.props);
      }

      constructor(amount: number) {
        super({ amount });
      }
    }

    const money = new MoneyValue(10);

    expect(money.frozen).toBe(true);
  });
});
