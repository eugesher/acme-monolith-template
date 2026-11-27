export default {
  category: 'acme-core:contracts',
  pattern: 'core/contracts/src/*/**',
  capture: ['module'],
  allow: [
    '@acme-core/contracts/<module>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
