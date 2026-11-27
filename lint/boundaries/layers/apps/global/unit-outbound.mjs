export const appsGlobalUnitOutbound = {
  category: 'apps:global:unit:outbound',
  pattern: 'apps/*/src/global/*/outbound/*.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/global/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
