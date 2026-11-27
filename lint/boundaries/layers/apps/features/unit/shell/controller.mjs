export const appsFeaturesUnitShellController = {
  category: 'apps:features:unit:shell:controller',
  pattern: 'apps/*/src/features/{*,*/modules/*}/shell/*.controller.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/features/<unit>/domain',
    '@acme-<app>/features/<unit>/application',
    '@acme-<app>/features/<unit>/presentation',
    '@acme-libs/contracts/auth',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/auth',
    '@acme-libs/http',
    '@nestjs/common',
    '@nestjs/swagger',
  ],
};
