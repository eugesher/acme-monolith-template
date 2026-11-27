export default {
  category: 'acme-app:features:outbound:types:queries',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/types/queries/**',
  capture: ['app', 'module', 'single', 'area', 'submodule', 'file'],
  allow: [
    '@acme-<app>/features/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-core/entities',
    '@acme-<app>/common/entities',
  ],
};
