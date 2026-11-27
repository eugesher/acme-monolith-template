export const appsProcessorsUnitIndex = {
  category: 'apps:processors:unit:index',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/index.ts',
  capture: ['app', 'unit'],
  allow: ['@acme-<app>/processors/<unit>/shell/*.module'],
};
