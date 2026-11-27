export const appsFeaturesUnitIndex = {
  category: 'apps:features:unit:index',
  pattern: 'apps/*/src/features/{*,*/modules/*}/index.ts',
  capture: ['app', 'unit'],
  allow: ['@acme-<app>/features/<unit>/shell/*.module'],
};
