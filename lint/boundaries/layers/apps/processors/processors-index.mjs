export const appsProcessorsIndex = {
  category: 'apps:processors:index',
  pattern: 'apps/*/src/processors/index.ts',
  capture: ['app'],
  allow: ['@acme-<app>/processors/*'],
};
