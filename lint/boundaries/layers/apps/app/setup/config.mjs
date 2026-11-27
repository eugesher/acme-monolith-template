export const appsAppSetupConfig = {
  category: 'apps:app:setup:config',
  pattern: 'apps/*/src/app/setup/config/**',
  capture: ['app'],
  allow: [
    '@nestjs/common',
    '@nestjs/config',
    'joi',

    '@acme-libs/config',
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
  ],
};
