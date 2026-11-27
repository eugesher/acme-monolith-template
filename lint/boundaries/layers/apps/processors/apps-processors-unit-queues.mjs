export default {
  category: 'apps:processors:unit:queues',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/queues/**',
  capture: ['app', 'unit'],
  allow: ['@acme-<app>/processors/<unit>/queues', '@acme-libs/queue', '@nestjs/common'],
};
