export default {
  category: 'acme-app:global:outbound:types:enums',
  pattern: 'apps/*/src/global/*/outbound/types/enums/**',
  capture: ['app', 'module', 'file'],
  allow: [
    '@acme-<app>/global/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
