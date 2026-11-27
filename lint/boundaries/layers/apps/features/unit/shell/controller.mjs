export const appsFeaturesUnitShellController = {
  category: 'apps:features:unit:shell:controller',
  pattern: 'apps/*/src/features/{*,*/modules/*}/shell/*.controller.ts',
  capture: ['app', 'unit'],
  allow: [
    '@nestjs/common',
    '@nestjs/swagger',

    '@acme-libs/auth',
    '@acme-libs/domain',
    '@acme-libs/http',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/contracts/auth',

    '@acme-<app>/features/<unit>/application',
    '@acme-<app>/features/<unit>/domain',
    '@acme-<app>/features/<unit>/presentation',
  ],
};
