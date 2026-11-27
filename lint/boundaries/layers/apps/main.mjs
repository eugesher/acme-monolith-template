export const appsMain = {
  category: 'apps:main',
  pattern: 'apps/*/src/main.ts',
  capture: ['app'],
  allow: [
    '@nestjs/common',
    '@nestjs/core',

    '@acme-libs/app',
    '@acme-libs/kernel',
    '@acme-libs/observability',
    '@acme-<app>/app',
  ],
};
