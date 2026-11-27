export const appsProcessorsUnitOutboundTypesIndex = {
  category: 'apps:processors:unit:outbound:types:index',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/outbound/types/index.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/processors/<unit>/outbound/**',
  ],
};
