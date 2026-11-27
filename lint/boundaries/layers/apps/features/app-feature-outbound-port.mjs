export default {
  category: 'acme-app:features:outbound:ports',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/ports/**',
  capture: ['app', 'module', 'single', 'area', 'submodule', 'file'],
  allow: [
    '@acme-<app>/features/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
