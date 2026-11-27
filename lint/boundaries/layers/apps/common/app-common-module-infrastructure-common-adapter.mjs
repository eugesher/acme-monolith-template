export default {
  category: 'acme-app:common:modules:infrastructure:common-adapters',
  pattern: 'apps/*/src/common/modules/*/infrastructure/common-adapters/**',
  capture: ['app', 'module', 'file'],
  allow: [
    '@acme-<app>/common/modules/<module>/outbound/**',
    '@acme-<app>/contracts',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
