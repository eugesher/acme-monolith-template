import { Entity } from '../entity/entity';
import type { DomainEvent } from '../event/domain-event';

export abstract class AggregateRoot<TId = string> extends Entity<TId> {
  private domainEvents: DomainEvent<TId>[] = [];

  public pullDomainEvents(): DomainEvent<TId>[] {
    const pulledEvents = this.domainEvents;

    this.domainEvents = [];

    return pulledEvents;
  }

  protected addDomainEvent(event: DomainEvent<TId>): void {
    this.domainEvents.push(event);
  }
}
