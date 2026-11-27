export default {
  category: 'core:modules:unit:infrastructure:config',
  pattern: 'core/modules/src/*/infrastructure/config/**',
  capture: ['unit'],
  allow: [
    '@acme-core/modules/<unit>/outbound/**',
    '@acme-core/modules/<unit>/infrastructure/config',
    '@acme-libs/config',
    '@nestjs/common',
  ],
};
