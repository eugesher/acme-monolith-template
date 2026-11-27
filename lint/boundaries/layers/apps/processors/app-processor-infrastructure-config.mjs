export default {
  category: 'acme-app:processors:infrastructure:config',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/infrastructure/config/**',
  capture: ['app', 'module', 'single', 'area', 'submodule', 'file'],
  allow: ['@acme-<app>/processors/<module>/outbound/**', '@acme-libs/config', '@nestjs/common'],
};
