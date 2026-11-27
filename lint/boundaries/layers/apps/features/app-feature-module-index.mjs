export default {
  category: 'acme-app:features:modules:index',
  pattern: 'apps/*/src/features/*/modules/index.ts',
  capture: ['app', 'module'],
  allow: ['@acme-<app>/features/<module>/modules/*'],
};
