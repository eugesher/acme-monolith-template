export default {
  category: 'acme-app:common:modules:shell:facade',
  pattern: 'apps/*/src/common/modules/*/shell/*.facade.ts',
  capture: ['app', 'module'],
  allow: [
    '@acme-<app>/common/modules/<module>/application',
    '@acme-<app>/contracts/<module>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
