export const appsGlobalUnitOutboundTypesCommands = {
  category: 'apps:global:unit:outbound:types:commands',
  pattern: 'apps/*/src/global/*/outbound/types/commands/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/global/<unit>/outbound/**',
  ],
};
