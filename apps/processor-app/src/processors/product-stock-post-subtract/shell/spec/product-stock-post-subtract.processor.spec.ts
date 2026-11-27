import type { Job } from 'bullmq';

import { CorrelationContextHelper } from '@acme-libs/observability';
import type { IProductStockPostSubtractPayload } from '@acme-core/contracts/product-stock';

import { ProductStockPostSubtractProcessor } from '../product-stock-post-subtract.processor';
import type {
  ProductStockPostSubtractProcessCase,
  ProductStockPostSubtractReportWorkerFailedCase,
} from '../../application';

describe('ProductStockPostSubtractProcessor', () => {
  let correlationIds: string[];
  let processCase: jest.Mocked<Pick<ProductStockPostSubtractProcessCase, 'execute'>>;
  let reportWorkerFailedCase: jest.Mocked<
    Pick<ProductStockPostSubtractReportWorkerFailedCase, 'execute'>
  >;
  let processor: ProductStockPostSubtractProcessor;

  beforeEach(() => {
    correlationIds = [];
    processCase = { execute: jest.fn() };
    processCase.execute.mockImplementation(() => {
      correlationIds.push(CorrelationContextHelper.current('ProductStockPostSubtractProcessCase'));

      return Promise.resolve();
    });
    reportWorkerFailedCase = { execute: jest.fn() };
    reportWorkerFailedCase.execute.mockImplementation(() => {
      correlationIds.push(
        CorrelationContextHelper.current('ProductStockPostSubtractReportWorkerFailedCase'),
      );
    });
    processor = new ProductStockPostSubtractProcessor(
      processCase as unknown as ProductStockPostSubtractProcessCase,
      reportWorkerFailedCase as unknown as ProductStockPostSubtractReportWorkerFailedCase,
    );
  });

  describe('process', () => {
    it('checks the products of the job under the correlation id of the subtraction', async () => {
      await processor.process({
        data: { productIds: ['100', '106'], correlationId: 'c0ffee00-0000-4000-8000-000000000001' },
      } as Job<IProductStockPostSubtractPayload>);

      expect(processCase.execute).toHaveBeenCalledWith({ productIds: ['100', '106'] });
      expect(correlationIds).toEqual(['c0ffee00-0000-4000-8000-000000000001']);
    });

    it('passes a failing check through, so BullMQ retries the job', async () => {
      processCase.execute.mockRejectedValue(new Error('deadlock'));

      const handling = processor.process({
        data: { productIds: ['100'], correlationId: 'c0ffee00-0000-4000-8000-000000000001' },
      } as Job<IProductStockPostSubtractPayload>);

      await expect(handling).rejects.toThrow('deadlock');
    });
  });

  describe('onWorkerFailed', () => {
    it('reports the failed attempt inside the correlation context of the subtraction', async () => {
      await processor.onWorkerFailed(
        {
          data: {
            productIds: ['100', '106'],
            correlationId: 'c0ffee00-0000-4000-8000-000000000001',
          },
          attemptsMade: 2,
          opts: { attempts: 3 },
        } as unknown as Job<IProductStockPostSubtractPayload>,
        new Error('deadlock'),
      );

      expect(reportWorkerFailedCase.execute).toHaveBeenCalledWith({
        productIds: ['100', '106'],
        attempt: 2,
        attempts: 3,
        error: new Error('deadlock'),
      });
      expect(correlationIds).toEqual(['c0ffee00-0000-4000-8000-000000000001']);
    });
  });
});
