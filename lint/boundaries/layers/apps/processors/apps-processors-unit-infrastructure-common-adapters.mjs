export default {
  category: 'apps:processors:unit:infrastructure:common-adapters',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/infrastructure/common-adapters/**',
  capture: ['app', 'unit', '', '', '', 'file'],
  allow: [
    '@acme-<app>/processors/<unit>/outbound/**',
    '@acme-<app>/contracts',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
