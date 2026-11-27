export default {
  category: 'acme-app:global:infrastructure:lib-adapters',
  pattern: 'apps/*/src/global/*/infrastructure/lib-adapters/**',
  capture: ['app', 'module'],
  allow: [
    '@acme-<app>/global/<module>/infrastructure/lib-adapters',
    '@acme-<app>/global/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/contracts/credentials',
    '@nestjs/common',
  ],
};
