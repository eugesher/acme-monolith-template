export const appsProcessorsUnit = {
  category: 'apps:processors:unit',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/*.ts',
  capture: ['app', 'unit'],
  allow: ['@acme-<app>/processors/<unit>/shell/*.module'],
};
