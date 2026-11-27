export const appsFeaturesUnitInfrastructureConfig = {
  category: 'apps:features:unit:infrastructure:config',
  pattern: 'apps/*/src/features/{*,*/modules/*}/infrastructure/config/**',
  capture: ['app', 'unit', '', '', '', 'file'],
  allow: ['@acme-<app>/features/<unit>/outbound/**', '@acme-libs/config', '@nestjs/common'],
};
