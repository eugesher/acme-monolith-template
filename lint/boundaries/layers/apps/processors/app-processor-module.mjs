export default {
  category: 'acme-app:processors:module',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/*.ts',
  capture: ['app', 'module'],
  allow: ['@acme-<app>/processors/<module>/shell/*.module'],
};
