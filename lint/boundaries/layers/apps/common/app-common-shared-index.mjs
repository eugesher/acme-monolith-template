export default {
  category: 'acme-app:common:shared:index',
  pattern: 'apps/*/src/common/shared/index.ts',
  capture: ['app'],
  allow: ['@acme-<app>/common/shared/*', '@acme-<app>/common/shared/*/**'],
};
