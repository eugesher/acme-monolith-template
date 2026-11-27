export const appsCommonModulesUnitShellModule = {
  category: 'apps:common:modules:unit:shell:module',
  pattern: 'apps/*/src/common/modules/*/shell/*.module.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/common/modules/<unit>/application',
    '@acme-<app>/common/modules/<unit>/infrastructure/index',
    '@acme-<app>/common/modules/<unit>/shell/*.facade',
    '@acme-<app>/contracts/<unit>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
