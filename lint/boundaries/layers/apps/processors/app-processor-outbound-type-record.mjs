export default {
  category: 'acme-app:processors:outbound:types:records',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/outbound/types/records/**',
  capture: ['app', 'module', 'single', 'area', 'submodule', 'file'],
  allow: [
    '@acme-<app>/processors/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-core/entities',
    '@acme-<app>/common/entities',
  ],
};
