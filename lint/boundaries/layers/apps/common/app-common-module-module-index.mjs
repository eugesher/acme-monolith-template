export default {
  category: 'acme-app:common:modules:module:index',
  pattern: 'apps/*/src/common/modules/*/index.ts',
  capture: ['app', 'module'],
  allow: ['@acme-<app>/common/modules/<module>/shell'],
};
