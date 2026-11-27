export const appsCommonModulesIndex = {
  category: 'apps:common:modules:index',
  pattern: 'apps/*/src/common/modules/index.ts',
  capture: ['app'],
  allow: ['@acme-<app>/common/modules/*'],
};
