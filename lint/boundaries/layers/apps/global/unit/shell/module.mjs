export const appsGlobalUnitShellModule = {
  category: 'apps:global:unit:shell:module',
  pattern: 'apps/*/src/global/*/shell/*.module.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/global/<unit>/shell/*.facade',
    '@acme-<app>/global/<unit>/application',
    '@acme-<app>/global/<unit>/infrastructure/index',
    '@acme-<app>/common/modules',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/auth',
    '@acme-libs/contracts/auth',
    '@nestjs/common',
  ],
};
