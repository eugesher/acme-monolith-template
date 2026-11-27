export interface IQueueGetManyView {
  name: string;
  paused: boolean;
  jobCounts: {
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    waiting: number;
  };
}
