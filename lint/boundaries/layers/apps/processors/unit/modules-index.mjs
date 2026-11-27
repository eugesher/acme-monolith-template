export const appsProcessorsUnitModulesIndex = {
  category: 'apps:processors:unit:modules:index',
  pattern: 'apps/*/src/processors/*/modules/index.ts',
  capture: ['app', 'unit'],
  allow: ['@acme-<app>/processors/<unit>/modules/*'],
};
