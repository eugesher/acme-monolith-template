export default {
  category: 'acme-app:features:module',
  pattern: 'apps/*/src/features/{*,*/modules/*}/*.ts',
  capture: ['app', 'module'],
  allow: ['@acme-<app>/features/<module>/shell/*.module'],
};
