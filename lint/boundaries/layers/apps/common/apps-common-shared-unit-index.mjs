export default {
  category: 'apps:common:shared:unit:index',
  pattern: 'apps/*/src/common/shared/*/index.ts',
  capture: ['app'],
  allow: ['@acme-<app>/common/shared/*/**'],
};
