export default {
  category: 'acme-app:common:modules:shell',
  pattern: 'apps/*/src/common/modules/*/shell/**',
  capture: ['app', 'module'],
  allow: [
    '@acme-<app>/common/modules/<module>/application',
    '@acme-<app>/common/modules/<module>/infrastructure',
    '@acme-<app>/common/modules/<module>/shell/*.facade',
    '@acme-<app>/common/modules/<module>/shell',
    '@acme-<app>/contracts/<module>',
    '@acme-<app>/common/modules',
    '@acme-<app>/common/shared',
    '@acme-core/modules/*',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
