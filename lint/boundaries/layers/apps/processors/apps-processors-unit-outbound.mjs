export default {
  category: 'apps:processors:unit:outbound',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/outbound/*.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/processors/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
