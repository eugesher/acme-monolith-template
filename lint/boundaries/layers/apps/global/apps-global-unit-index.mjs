export default {
  category: 'apps:global:unit:index',
  pattern: 'apps/*/src/global/*/index.ts',
  capture: ['app', 'unit'],
  allow: ['@acme-<app>/global/<unit>/shell'],
};
