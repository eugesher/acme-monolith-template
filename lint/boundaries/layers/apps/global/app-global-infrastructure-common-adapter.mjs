export default {
  category: 'acme-app:global:infrastructure:common-adapters',
  pattern: 'apps/*/src/global/*/infrastructure/common-adapters/**',
  capture: ['app', 'module'],
  allow: [
    '@acme-<app>/global/<module>/infrastructure/common-adapters',
    '@acme-<app>/global/<module>/outbound/**',
    '@acme-<app>/contracts',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
