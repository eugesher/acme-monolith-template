export default {
  category: 'acme-app:global:infrastructure:core-adapters',
  pattern: 'apps/*/src/global/*/infrastructure/core-adapters/**',
  capture: ['app', 'module'],
  allow: [
    '@acme-<app>/global/<module>/infrastructure/core-adapters',
    '@acme-<app>/global/<module>/outbound/**',
    '@acme-core/contracts',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
