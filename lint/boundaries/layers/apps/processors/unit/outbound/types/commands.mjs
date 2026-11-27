export const appsProcessorsUnitOutboundTypesCommands = {
  category: 'apps:processors:unit:outbound:types:commands',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/outbound/types/commands/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/processors/<unit>/outbound/**',
  ],
};
