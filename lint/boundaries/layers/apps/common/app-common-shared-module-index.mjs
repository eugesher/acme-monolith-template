export default {
  category: 'acme-app:common:shared:module:index',
  pattern: 'apps/*/src/common/shared/*/index.ts',
  capture: ['app'],
  allow: ['@acme-<app>/common/shared/*/**'],
};
