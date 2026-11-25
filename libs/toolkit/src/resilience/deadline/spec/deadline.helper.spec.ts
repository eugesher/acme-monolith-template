import { DeadlineHelper } from '../deadline.helper';

describe('DeadlineHelper', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('race', () => {
    it('answers what the work answered and leaves no timer behind', async () => {
      const work = jest.fn().mockResolvedValue('done');

      const workResult = await DeadlineHelper.race(work, { timeoutMs: 500, message: 'too slow' });

      expect(workResult).toBe('done');
      expect(work).toHaveBeenCalledTimes(1);
      expect(jest.getTimerCount()).toBe(0);
    });

    it('waits for the work up to the deadline', async () => {
      const work = jest.fn().mockReturnValue(new Promise<never>(() => undefined));
      const racing = DeadlineHelper.race(work, { timeoutMs: 500, message: 'too slow' });
      let settled = false;

      void racing.catch(() => {
        settled = true;
      });
      await jest.advanceTimersByTimeAsync(499);

      expect(settled).toBe(false);
    });

    it('rejects with the message once the deadline passes', async () => {
      const work = jest.fn().mockReturnValue(new Promise<never>(() => undefined));
      const racing = DeadlineHelper.race(work, { timeoutMs: 500, message: 'too slow' });

      jest.advanceTimersByTime(500);

      await expect(racing).rejects.toThrow('too slow');
    });

    it('passes the error of the work through and leaves no timer behind', async () => {
      const failure = new Error('redis is down');
      const work = jest.fn().mockRejectedValue(failure);
      const racing = DeadlineHelper.race(work, { timeoutMs: 500, message: 'too slow' });

      await expect(racing).rejects.toBe(failure);
      expect(jest.getTimerCount()).toBe(0);
    });
  });
});
