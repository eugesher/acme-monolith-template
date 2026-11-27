export default {
  category: 'apps:global:unit:infrastructure:common-adapters',
  pattern: 'apps/*/src/global/*/infrastructure/common-adapters/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/global/<unit>/infrastructure/common-adapters',
    '@acme-<app>/global/<unit>/outbound/**',
    '@acme-<app>/contracts',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
