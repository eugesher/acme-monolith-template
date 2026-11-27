export default {
  category: 'acme-app:processors:outbound:types:views',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/outbound/types/views/**',
  capture: ['app', 'module', 'single', 'area', 'submodule', 'file'],
  allow: [
    '@acme-<app>/processors/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
