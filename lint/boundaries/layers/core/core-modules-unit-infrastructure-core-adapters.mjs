export default {
  category: 'core:modules:unit:infrastructure:core-adapters',
  pattern: 'core/modules/src/*/infrastructure/core-adapters/**',
  capture: ['unit'],
  allow: [
    '@acme-core/modules/<unit>/outbound/**',
    '@acme-core/modules/<unit>/infrastructure/core-adapters',
    '@acme-core/contracts',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
