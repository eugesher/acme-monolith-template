export default {
  category: 'acme-app:global:outbound:types:records',
  pattern: 'apps/*/src/global/*/outbound/types/records/**',
  capture: ['app', 'module', 'file'],
  allow: [
    '@acme-<app>/global/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-core/entities',
    '@acme-<app>/common/entities',
  ],
};
