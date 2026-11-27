export default {
  category: 'acme-app:processors:domain',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/domain/**',
  capture: ['app', 'module'],
  allow: [
    '@acme-<app>/processors/<module>/domain',
    '@acme-core/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
