import type { PinoLogger } from 'nestjs-pino';

type PinoLoggerMethod = 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'trace' | 'assign';

export type PinoLoggerMock = PinoLogger & jest.Mocked<Pick<PinoLogger, PinoLoggerMethod>>;

export const makePinoLoggerMock = (): PinoLoggerMock => {
  const methods: Record<PinoLoggerMethod, jest.Mock> = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
    trace: jest.fn(),
    assign: jest.fn(),
  };

  return methods as unknown as PinoLoggerMock;
};
