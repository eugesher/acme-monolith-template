export const coreContracts = {
  category: 'core:contracts',
  pattern: 'core/contracts/src/*/**',
  capture: ['unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-core/contracts/<unit>',
  ],
};
