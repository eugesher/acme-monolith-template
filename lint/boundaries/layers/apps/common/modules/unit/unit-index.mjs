export const appsCommonModulesUnitIndex = {
  category: 'apps:common:modules:unit:index',
  pattern: 'apps/*/src/common/modules/*/index.ts',
  capture: ['app', 'unit'],
  allow: ['@acme-<app>/common/modules/<unit>/shell/*.module'],
};
