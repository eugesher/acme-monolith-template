export default {
  category: 'acme-app:features:domain',
  pattern: 'apps/*/src/features/{*,*/modules/*}/domain/**',
  capture: ['app', 'module'],
  allow: [
    '@acme-<app>/features/<module>/domain',
    '@acme-core/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
