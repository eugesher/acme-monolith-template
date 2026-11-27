export default {
  category: 'apps:global:index',
  pattern: 'apps/*/src/global/index.ts',
  capture: ['app'],
  allow: ['@acme-<app>/global/*'],
};
