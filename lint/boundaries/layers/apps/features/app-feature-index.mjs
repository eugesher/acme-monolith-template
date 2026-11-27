export default {
  category: 'acme-app:features:index',
  pattern: 'apps/*/src/features/index.ts',
  capture: ['app'],
  allow: ['@acme-<app>/features/*'],
};
