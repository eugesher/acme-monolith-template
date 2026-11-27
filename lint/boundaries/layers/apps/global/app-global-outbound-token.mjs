export default {
  category: 'acme-app:global:outbound:tokens',
  pattern: 'apps/*/src/global/*/outbound/tokens/**',
  capture: ['app', 'module', 'file'],
  allow: [
    '@acme-<app>/global/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
