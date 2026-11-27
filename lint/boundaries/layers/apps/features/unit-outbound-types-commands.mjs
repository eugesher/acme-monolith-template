export const appsFeaturesUnitOutboundTypesCommands = {
  category: 'apps:features:unit:outbound:types:commands',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/types/commands/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/features/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
