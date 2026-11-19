export abstract class DomainException extends Error {
  public abstract readonly code: string;
  public readonly details: Readonly<Record<string, unknown>> | undefined;

  protected constructor(message: string, details?: Readonly<Record<string, unknown>>) {
    super(message);
    this.name = new.target.name;
    this.details = details;
  }
}
