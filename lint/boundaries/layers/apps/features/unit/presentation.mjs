export const appsFeaturesUnitPresentation = {
  category: 'apps:features:unit:presentation',
  pattern: 'apps/*/src/features/{*,*/modules/*}/presentation/**',
  capture: ['app', 'unit'],
  allow: [
    '@nestjs/common',
    '@nestjs/swagger',
    'class-transformer',
    'class-validator',

    '@acme-libs/domain',
    '@acme-libs/http',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/features/<unit>/domain',

    '@acme-<app>/features/<unit>/presentation',
  ],
};
