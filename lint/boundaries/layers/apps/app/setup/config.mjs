export const appsAppSetupConfig = {
  category: 'apps:app:setup:config',
  pattern: 'apps/*/src/app/setup/config/**',
  capture: ['app'],
  allow: [
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/config',
    '@nestjs/common',
    '@nestjs/config',
    'joi',
  ],
};
