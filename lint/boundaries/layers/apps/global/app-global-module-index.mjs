export default {
  category: 'acme-app:global:module:index',
  pattern: 'apps/*/src/global/*/index.ts',
  capture: ['app', 'module'],
  allow: ['@acme-<app>/global/<module>/shell'],
};
