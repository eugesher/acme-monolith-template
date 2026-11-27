export const appsGlobalUnitShellModule = {
  category: 'apps:global:unit:shell:module',
  pattern: 'apps/*/src/global/*/shell/*.module.ts',
  capture: ['app', 'unit'],
  allow: [
    '@nestjs/common',

    '@acme-libs/auth',
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/contracts/auth',
    '@acme-<app>/common/modules',

    '@acme-<app>/global/<unit>/application',
    '@acme-<app>/global/<unit>/infrastructure/index',
    '@acme-<app>/global/<unit>/shell/*.facade',
  ],
};
