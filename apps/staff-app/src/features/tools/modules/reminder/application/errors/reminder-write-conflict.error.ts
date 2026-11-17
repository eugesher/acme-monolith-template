export class ReminderWriteConflictError extends Error {
  constructor(
    reminderId: string,
    public readonly currentVersion: number,
  ) {
    super(
      `Optimistic write conflict on reminder ${reminderId} (current version ${currentVersion})`,
    );
    this.name = 'ReminderWriteConflictError';
  }
}
