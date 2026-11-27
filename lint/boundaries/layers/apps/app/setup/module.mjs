export const appsAppSetupModule = {
  category: 'apps:app:setup:module',
  pattern: 'apps/*/src/app/setup/app-setup.module.ts',
  capture: ['app'],
  allow: [
    '@acme-<app>/app/setup/config',
    '@acme-<app>/app/setup/entities',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/app',
    '@acme-libs/credentials',
    '@nestjs/common',
  ],
};
