export const appsFeaturesUnitOutboundTypesCommands = {
  category: 'apps:features:unit:outbound:types:commands',
  pattern: 'apps/*/src/features/{*,*/modules/*}/outbound/types/commands/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/features/<unit>/outbound/**',
  ],
};
