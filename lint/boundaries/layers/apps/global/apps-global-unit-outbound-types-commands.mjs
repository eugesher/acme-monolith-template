export default {
  category: 'apps:global:unit:outbound:types:commands',
  pattern: 'apps/*/src/global/*/outbound/types/commands/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/global/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
