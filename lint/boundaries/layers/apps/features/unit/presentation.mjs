export const appsFeaturesUnitPresentation = {
  category: 'apps:features:unit:presentation',
  pattern: 'apps/*/src/features/{*,*/modules/*}/presentation/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/features/<unit>/domain',
    '@acme-<app>/features/<unit>/presentation',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/http',
    '@nestjs/common',
    '@nestjs/swagger',
    'class-transformer',
    'class-validator',
  ],
};
