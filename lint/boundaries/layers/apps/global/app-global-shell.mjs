export default {
  category: 'acme-app:global:shell',
  pattern: 'apps/*/src/global/*/shell/**',
  capture: ['app', 'module'],
  allow: [
    '@acme-<app>/global/<module>/shell',
    '@acme-<app>/global/<module>/application',
    '@acme-<app>/global/<module>/infrastructure',
    '@acme-<app>/contracts/<module>',
    '@acme-<app>/common/modules',
    '@acme-core/modules/*',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/auth',
    '@acme-libs/contracts/auth',
    '@nestjs/common',
  ],
};
