export const appsGlobalUnitShellFacade = {
  category: 'apps:global:unit:shell:facade',
  pattern: 'apps/*/src/global/*/shell/*.facade.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/global/<unit>/shell/*.facade',
    '@acme-<app>/global/<unit>/application',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/contracts/auth',
    '@nestjs/common',
  ],
};
