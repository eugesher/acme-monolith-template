export const appsContracts = {
  category: 'apps:contracts',
  pattern: 'apps/*/src/contracts/*/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/contracts/<unit>',
  ],
};
