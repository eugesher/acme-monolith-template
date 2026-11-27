export default {
  category: 'apps:common:modules:unit:shell:facade',
  pattern: 'apps/*/src/common/modules/*/shell/*.facade.ts',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/common/modules/<unit>/application',
    '@acme-<app>/contracts/<unit>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
