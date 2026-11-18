import { DomainEvent } from '../../event/domain-event';
import { AggregateRoot } from '../aggregate-root';

describe('AggregateRoot', () => {
  describe('pullDomainEvents', () => {
    it('drains the recorded events exactly once', () => {
      class ItemOpenedEvent extends DomainEvent {
        public constructor(aggregateId: string) {
          super(aggregateId);
        }
      }
      class ItemAggregate extends AggregateRoot {
        public constructor(id: string) {
          super(id);
        }

        public open(): void {
          this.addDomainEvent(new ItemOpenedEvent(this.id));
        }
      }
      const item = new ItemAggregate('1');

      item.open();
      item.open();

      const first = item.pullDomainEvents();
      const second = item.pullDomainEvents();

      expect(first.map((event) => event.aggregateId)).toEqual(['1', '1']);
      expect(second).toEqual([]);
    });
  });
});
