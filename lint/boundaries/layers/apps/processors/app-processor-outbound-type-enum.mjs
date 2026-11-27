export default {
  category: 'acme-app:processors:outbound:types:enums',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/outbound/types/enums/**',
  capture: ['app', 'module', 'single', 'area', 'submodule', 'file'],
  allow: [
    '@acme-<app>/processors/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
