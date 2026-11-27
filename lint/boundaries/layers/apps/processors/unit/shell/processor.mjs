export const appsProcessorsUnitShellProcessor = {
  category: 'apps:processors:unit:shell:processor',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/shell/*.processor.ts',
  capture: ['app', 'unit'],
  allow: [
    '@nestjs/bullmq',
    '@nestjs/common',
    'bullmq',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/observability',
    '@acme-libs/toolkit',
    '@acme-core/queues',
    '@acme-core/contracts',

    '@acme-<app>/processors/<unit>/application',
    '@acme-<app>/processors/<unit>/queues',
  ],
};
