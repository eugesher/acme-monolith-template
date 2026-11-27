export default {
  category: 'acme-core:modules:domain',
  pattern: 'core/modules/src/*/domain/**',
  capture: ['module'],
  allow: [
    '@acme-core/modules/<module>/domain',
    '@acme-core/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
