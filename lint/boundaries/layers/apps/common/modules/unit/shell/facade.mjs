export const appsCommonModulesUnitShellFacade = {
  category: 'apps:common:modules:unit:shell:facade',
  pattern: 'apps/*/src/common/modules/*/shell/*.facade.ts',
  capture: ['app', 'unit'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-<app>/contracts/<unit>',

    '@acme-<app>/common/modules/<unit>/application',
  ],
};
