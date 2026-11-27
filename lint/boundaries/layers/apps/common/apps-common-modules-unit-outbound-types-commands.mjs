export default {
  category: 'apps:common:modules:unit:outbound:types:commands',
  pattern: 'apps/*/src/common/modules/*/outbound/types/commands/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/common/modules/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
