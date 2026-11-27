export const appsFeaturesUnit = {
  category: 'apps:features:unit',
  pattern: 'apps/*/src/features/{*,*/modules/*}/*.ts',
  capture: ['app', 'unit'],
  allow: ['@acme-<app>/features/<unit>/shell/*.module'],
};
