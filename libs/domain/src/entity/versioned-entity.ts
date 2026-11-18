import { Entity } from './entity';

export abstract class VersionedEntity<TId = string> extends Entity<TId> {
  public get version(): number {
    return this.currentVersion;
  }

  private currentVersion: number;

  protected constructor(id: TId, version: number) {
    super(id);
    this.currentVersion = version;
  }

  public static isValidVersion(version: number): boolean {
    return Number.isInteger(version) && version >= 1;
  }

  public isExpectedVersion(expectedVersion: number | undefined): boolean {
    return expectedVersion === undefined || expectedVersion === this.currentVersion;
  }

  protected bumpVersion(): void {
    this.currentVersion += 1;
  }
}
