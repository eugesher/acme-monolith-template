export const appsFeaturesIndex = {
  category: 'apps:features:index',
  pattern: 'apps/*/src/features/index.ts',
  capture: ['app'],
  allow: ['@acme-<app>/features/*'],
};
