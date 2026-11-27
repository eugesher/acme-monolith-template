export const appsFeaturesUnitModulesIndex = {
  category: 'apps:features:unit:modules:index',
  pattern: 'apps/*/src/features/*/modules/index.ts',
  capture: ['app', 'unit'],
  allow: ['@acme-<app>/features/<unit>/modules/*'],
};
