export default {
  category: 'acme-app:processors:index',
  pattern: 'apps/*/src/processors/index.ts',
  capture: ['app'],
  allow: ['@acme-<app>/processors/*'],
};
