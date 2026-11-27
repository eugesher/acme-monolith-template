export default {
  category: 'acme-core:modules:infrastructure:lib-adapters',
  pattern: 'core/modules/src/*/infrastructure/lib-adapters/**',
  capture: ['module'],
  allow: [
    '@acme-core/modules/<module>/outbound/**',
    '@acme-core/modules/<module>/infrastructure/lib-adapters',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
