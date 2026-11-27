export const appsProcessorsUnitShellSpec = {
  category: 'apps:processors:unit:shell:spec',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/shell/spec/*.processor.spec.ts',
  capture: ['app', 'unit'],
  allow: [
    'bullmq',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/observability',
    '@acme-libs/toolkit',
    '@acme-core/contracts',

    '@acme-<app>/processors/<unit>/application',
    '@acme-<app>/processors/<unit>/shell/*.processor',
  ],
};
