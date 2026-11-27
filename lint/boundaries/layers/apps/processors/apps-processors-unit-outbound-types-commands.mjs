export default {
  category: 'apps:processors:unit:outbound:types:commands',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/outbound/types/commands/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/processors/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
