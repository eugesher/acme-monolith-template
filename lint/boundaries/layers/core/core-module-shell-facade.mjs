export default {
  category: 'acme-core:modules:shell:facade',
  pattern: 'core/modules/src/*/shell/*.facade.ts',
  capture: ['module'],
  allow: [
    '@acme-core/modules/<module>/application',
    '@acme-core/contracts/<module>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
