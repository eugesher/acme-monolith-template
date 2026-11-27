export default {
  category: 'acme-app:app:setup:config',
  pattern: 'apps/*/src/app/setup/config/**',
  capture: ['app'],
  allow: [
    '@acme-<app>/app/setup/config',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/config',
    '@nestjs/common',
    '@nestjs/config',
    'joi',
  ],
};
