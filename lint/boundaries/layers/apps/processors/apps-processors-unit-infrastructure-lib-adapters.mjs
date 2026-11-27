export default {
  category: 'apps:processors:unit:infrastructure:lib-adapters',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/infrastructure/lib-adapters/**',
  capture: ['app', 'unit', '', '', '', 'file'],
  allow: [
    '@acme-<app>/processors/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
