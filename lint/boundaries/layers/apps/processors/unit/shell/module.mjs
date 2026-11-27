export const appsProcessorsUnitShellModule = {
  category: 'apps:processors:unit:shell:module',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/shell/*.module.ts',
  capture: ['app', 'unit'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/modules/*',
    '@acme-core/queues',

    '@acme-<app>/processors/<unit>/application',
    '@acme-<app>/processors/<unit>/infrastructure/index',
    '@acme-<app>/processors/<unit>/queues',
    '@acme-<app>/processors/<unit>/shell/*.processor',
  ],
};
