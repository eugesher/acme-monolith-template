export const appsFeaturesUnitInfrastructureConfig = {
  category: 'apps:features:unit:infrastructure:config',
  pattern: 'apps/*/src/features/{*,*/modules/*}/infrastructure/config/**',
  capture: ['app', 'unit', '', '', '', 'file'],
  allow: ['@nestjs/common', '@acme-libs/config', '@acme-<app>/features/<unit>/outbound/**'],
};
