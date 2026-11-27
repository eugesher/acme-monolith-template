export default {
  category: 'acme-app:common:modules:domain',
  pattern: 'apps/*/src/common/modules/*/domain/**',
  capture: ['app', 'module'],
  allow: [
    '@acme-<app>/common/modules/<module>/domain',
    '@acme-core/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
