export const appsProcessorsUnitQueues = {
  category: 'apps:processors:unit:queues',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/queues/**',
  capture: ['app', 'unit'],
  allow: ['@nestjs/common', '@acme-libs/queue', '@acme-<app>/processors/<unit>/queues'],
};
