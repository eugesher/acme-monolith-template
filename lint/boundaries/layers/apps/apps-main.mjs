export default {
  category: 'apps:main',
  pattern: 'apps/*/src/main.ts',
  capture: ['app'],
  allow: [
    '@acme-<app>/app',
    '@acme-libs/app',
    '@acme-libs/kernel',
    '@acme-libs/observability',
    '@nestjs/common',
    '@nestjs/core',
  ],
};
