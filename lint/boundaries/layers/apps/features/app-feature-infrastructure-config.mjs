export default {
  category: 'acme-app:features:infrastructure:config',
  pattern: 'apps/*/src/features/{*,*/modules/*}/infrastructure/config/**',
  capture: ['app', 'module', 'single', 'area', 'submodule', 'file'],
  allow: ['@acme-<app>/features/<module>/outbound/**', '@acme-libs/config', '@nestjs/common'],
};
