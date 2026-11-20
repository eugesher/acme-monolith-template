import { Entity } from './entity';

export abstract class VersionedEntity<TId = string> extends Entity<TId> {
  public get version(): number {
    return this._version;
  }

  private _version: number;

  protected constructor(id: TId, version: number) {
    super(id);
    this._version = version;
  }

  public static isValidVersion(version: number): boolean {
    return Number.isInteger(version) && version >= 1;
  }

  public isExpectedVersion(expectedVersion: number | undefined): boolean {
    return expectedVersion === undefined || expectedVersion === this._version;
  }

  protected bumpVersion(): void {
    this._version += 1;
  }
}
