export default {
  category: 'acme-app:app:index',
  pattern: 'apps/*/src/app/index.ts',
  capture: ['app'],
  allow: ['@acme-<app>/app/shell/app.module'],
};
