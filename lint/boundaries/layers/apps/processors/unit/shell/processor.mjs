export const appsProcessorsUnitShellProcessor = {
  category: 'apps:processors:unit:shell:processor',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/shell/*.processor.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/processors/<unit>/application',
    '@acme-<app>/processors/<unit>/queues',
    '@acme-<app>/processors/<unit>/shell/*.processor',
    '@acme-core/contracts',
    '@acme-core/queues',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/observability',
    '@nestjs/bullmq',
    '@nestjs/common',
    'bullmq',
  ],
};
