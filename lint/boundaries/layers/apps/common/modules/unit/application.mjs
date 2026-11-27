export const appsCommonModulesUnitApplication = {
  category: 'apps:common:modules:unit:application',
  pattern: 'apps/*/src/common/modules/*/application/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/common/modules/<unit>/domain',
    '@acme-<app>/common/modules/<unit>/outbound/**',
    '@acme-<app>/common/modules/<unit>/application',
    '@acme-<app>/contracts/<unit>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
    'nestjs-pino',
  ],
};
