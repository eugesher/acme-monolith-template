export default {
  category: 'acme-core:modules:infrastructure:core-adapters',
  pattern: 'core/modules/src/*/infrastructure/core-adapters/**',
  capture: ['module'],
  allow: [
    '@acme-core/modules/<module>/outbound/**',
    '@acme-core/modules/<module>/infrastructure/core-adapters',
    '@acme-core/contracts',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
