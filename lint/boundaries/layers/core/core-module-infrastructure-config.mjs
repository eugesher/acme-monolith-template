export default {
  category: 'acme-core:modules:infrastructure:config',
  pattern: 'core/modules/src/*/infrastructure/config/**',
  capture: ['module'],
  allow: [
    '@acme-core/modules/<module>/outbound/**',
    '@acme-core/modules/<module>/infrastructure/config',
    '@acme-libs/config',
    '@nestjs/common',
  ],
};
