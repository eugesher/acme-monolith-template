import type {
  IIdempotencyCoreClaimCommand,
  IIdempotencyCoreClaimView,
  IIdempotencyCoreCompleteCommand,
  IIdempotencyCoreReleaseCommand,
} from '../types';

export interface IIdempotencyCorePort {
  claim(command: IIdempotencyCoreClaimCommand): Promise<IIdempotencyCoreClaimView>;
  complete(command: IIdempotencyCoreCompleteCommand): Promise<void>;
  release(command: IIdempotencyCoreReleaseCommand): Promise<void>;
}

export const IDEMPOTENCY_CORE_PORT = Symbol('IDEMPOTENCY_CORE_PORT');
