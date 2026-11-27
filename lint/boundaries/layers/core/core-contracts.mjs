export default {
  category: 'core:contracts',
  pattern: 'core/contracts/src/*/**',
  capture: ['unit'],
  allow: [
    '@acme-core/contracts/<unit>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
