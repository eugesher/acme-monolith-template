export default {
  category: 'apps:processors:unit:infrastructure:config',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/infrastructure/config/**',
  capture: ['app', 'unit', '', '', '', 'file'],
  allow: ['@acme-<app>/processors/<unit>/outbound/**', '@acme-libs/config', '@nestjs/common'],
};
