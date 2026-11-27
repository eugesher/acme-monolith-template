export default {
  category: 'acme-core:modules:module:index',
  pattern: 'core/modules/src/*/index.ts',
  capture: ['module'],
  allow: ['@acme-core/modules/<module>/shell'],
};
