export const appsProcessorsUnitInfrastructureConfig = {
  category: 'apps:processors:unit:infrastructure:config',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/infrastructure/config/**',
  capture: ['app', 'unit', '', '', '', 'file'],
  allow: ['@nestjs/common', '@acme-libs/config', '@acme-<app>/processors/<unit>/outbound/**'],
};
