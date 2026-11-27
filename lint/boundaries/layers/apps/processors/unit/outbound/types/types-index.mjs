export const appsProcessorsUnitOutboundTypesIndex = {
  category: 'apps:processors:unit:outbound:types:index',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/outbound/types/index.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/processors/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
