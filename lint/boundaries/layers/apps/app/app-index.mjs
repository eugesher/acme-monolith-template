export const appsAppIndex = {
  category: 'apps:app:index',
  pattern: 'apps/*/src/app/index.ts',
  capture: ['app'],
  allow: ['@acme-<app>/app/shell'],
};
