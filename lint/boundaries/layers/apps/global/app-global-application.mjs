export default {
  category: 'acme-app:global:application',
  pattern: 'apps/*/src/global/*/application/**',
  capture: ['app', 'module'],
  allow: [
    '@acme-<app>/global/<module>/application',
    '@acme-<app>/global/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
