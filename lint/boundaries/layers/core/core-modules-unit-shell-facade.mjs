export default {
  category: 'core:modules:unit:shell:facade',
  pattern: 'core/modules/src/*/shell/*.facade.ts',
  capture: ['unit'],
  allow: [
    '@acme-core/modules/<unit>/application',
    '@acme-core/contracts/<unit>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
