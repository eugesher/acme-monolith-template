export default {
  category: 'acme-app:global:outbound:types:commands',
  pattern: 'apps/*/src/global/*/outbound/types/commands/**',
  capture: ['app', 'module', 'file'],
  allow: [
    '@acme-<app>/global/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
