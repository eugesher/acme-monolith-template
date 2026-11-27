export const appsAppSetupModule = {
  category: 'apps:app:setup:module',
  pattern: 'apps/*/src/app/setup/app-setup.module.ts',
  capture: ['app'],
  allow: [
    '@nestjs/common',

    '@acme-libs/app',
    '@acme-libs/credentials',
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/app/setup/config',
    '@acme-<app>/app/setup/entities',
  ],
};
