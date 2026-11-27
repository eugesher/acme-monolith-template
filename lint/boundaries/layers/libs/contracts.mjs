export const libsContracts = {
  category: 'libs:contracts',
  pattern: 'libs/contracts/src/*/**',
  capture: ['lib'],
  allow: [
    '@acme-libs/contracts/<lib>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
