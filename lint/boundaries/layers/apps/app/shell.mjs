export const appsAppShell = {
  category: 'apps:app:shell',
  pattern: 'apps/*/src/app/shell/**',
  capture: ['app'],
  allow: [
    '@acme-<app>/app/setup/app-setup.module',
    '@acme-<app>/global',
    '@acme-<app>/features',
    '@acme-<app>/processors',
    '@nestjs/common',
  ],
};
