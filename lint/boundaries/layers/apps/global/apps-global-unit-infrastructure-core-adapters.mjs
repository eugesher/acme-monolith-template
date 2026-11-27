export default {
  category: 'apps:global:unit:infrastructure:core-adapters',
  pattern: 'apps/*/src/global/*/infrastructure/core-adapters/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/global/<unit>/infrastructure/core-adapters',
    '@acme-<app>/global/<unit>/outbound/**',
    '@acme-core/contracts',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
