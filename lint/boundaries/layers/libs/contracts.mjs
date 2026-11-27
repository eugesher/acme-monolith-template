export const libsContracts = {
  category: 'libs:contracts',
  pattern: 'libs/contracts/src/*/**',
  capture: ['lib'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-libs/contracts/<lib>',
  ],
};
