export const appsProcessorsUnitShellSpec = {
  category: 'apps:processors:unit:shell:spec',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/shell/spec/*.processor.spec.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/processors/<unit>/application',
    '@acme-<app>/processors/<unit>/shell/*.processor',
    '@acme-core/contracts',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/observability',
    'bullmq',
  ],
};
