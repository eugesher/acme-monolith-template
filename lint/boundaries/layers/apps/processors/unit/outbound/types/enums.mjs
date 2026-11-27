export const appsProcessorsUnitOutboundTypesEnums = {
  category: 'apps:processors:unit:outbound:types:enums',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/outbound/types/enums/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/processors/<unit>/outbound/**',
  ],
};
