export default {
  category: 'acme-app:features:outbound:tokens',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/tokens/**',
  capture: ['app', 'module', 'single', 'area', 'submodule', 'file'],
  allow: [
    '@acme-<app>/features/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
