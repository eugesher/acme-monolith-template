export const appsGlobalUnitShellFacade = {
  category: 'apps:global:unit:shell:facade',
  pattern: 'apps/*/src/global/*/shell/*.facade.ts',
  capture: ['app', 'unit'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/contracts/auth',

    '@acme-<app>/global/<unit>/application',
  ],
};
