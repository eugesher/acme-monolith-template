export default {
  category: 'acme-app:features:outbound:types:views',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/types/views/**',
  capture: ['app', 'module', 'single', 'area', 'submodule', 'file'],
  allow: [
    '@acme-<app>/features/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
