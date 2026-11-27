export const appsFeaturesUnitPresentation = {
  category: 'apps:features:unit:presentation',
  pattern: 'apps/*/src/features/{*,*/modules/*}/presentation/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/features/<unit>/domain',
    '@acme-<app>/features/<unit>/presentation',
    '@acme-libs/contracts/auth',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/auth',
    '@acme-libs/http',
    '@nestjs/common',
    '@nestjs/swagger',
    'class-transformer',
    'class-validator',
  ],
};
