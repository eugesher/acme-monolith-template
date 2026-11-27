export default {
  category: 'acme-app:processors:queues',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/queues/**',
  capture: ['app', 'module'],
  allow: ['@acme-<app>/processors/<module>/queues', '@acme-libs/queue', '@nestjs/common'],
};
