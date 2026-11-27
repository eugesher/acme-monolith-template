export default {
  category: 'apps:contracts',
  pattern: 'apps/*/src/contracts/*/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/contracts/<unit>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
