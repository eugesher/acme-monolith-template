export const appsCommonModulesUnitShellModule = {
  category: 'apps:common:modules:unit:shell:module',
  pattern: 'apps/*/src/common/modules/*/shell/*.module.ts',
  capture: ['app', 'unit'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-<app>/contracts/<unit>',

    '@acme-<app>/common/modules/<unit>/application',
    '@acme-<app>/common/modules/<unit>/infrastructure/index',
    '@acme-<app>/common/modules/<unit>/shell/*.facade',
  ],
};
