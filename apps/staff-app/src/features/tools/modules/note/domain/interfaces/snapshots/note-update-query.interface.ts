export interface INoteUpdateQuery {
  readonly id: string;
  readonly versionAsRead: number;
  readonly body: string;
  readonly resolved: boolean;
  readonly version: number;
}
