export default {
  category: 'acme-app:processors:modules:index',
  pattern: 'apps/*/src/processors/*/modules/index.ts',
  capture: ['app', 'module'],
  allow: ['@acme-<app>/processors/<module>/modules/*'],
};
