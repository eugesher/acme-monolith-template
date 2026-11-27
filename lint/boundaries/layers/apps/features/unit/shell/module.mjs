export const appsFeaturesUnitShellModule = {
  category: 'apps:features:unit:shell:module',
  pattern: 'apps/*/src/features/{*,*/modules/*}/shell/*.module.ts',
  capture: ['app', 'unit'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/health',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/modules/*',
    '@acme-core/queues',
    '@acme-<app>/common/modules',

    '@acme-<app>/features/<unit>/application',
    '@acme-<app>/features/<unit>/infrastructure/index',
    '@acme-<app>/features/<unit>/modules/index',
    '@acme-<app>/features/<unit>/shell/*.controller',
  ],
};
