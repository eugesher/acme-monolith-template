export default {
  category: 'acme-app:contracts',
  pattern: 'apps/*/src/contracts/*/**',
  capture: ['app', 'module'],
  allow: [
    '@acme-<app>/contracts/<module>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
