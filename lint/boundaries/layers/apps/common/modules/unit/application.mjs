export const appsCommonModulesUnitApplication = {
  category: 'apps:common:modules:unit:application',
  pattern: 'apps/*/src/common/modules/*/application/**',
  capture: ['app', 'unit'],
  allow: [
    '@nestjs/common',
    'nestjs-pino',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-<app>/contracts/<unit>',

    '@acme-<app>/common/modules/<unit>/domain',
    '@acme-<app>/common/modules/<unit>/outbound/**',

    '@acme-<app>/common/modules/<unit>/application',
  ],
};
