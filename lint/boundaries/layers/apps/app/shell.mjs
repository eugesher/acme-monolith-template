export const appsAppShell = {
  category: 'apps:app:shell',
  pattern: 'apps/*/src/app/shell/**',
  capture: ['app'],
  allow: [
    '@nestjs/common',

    '@acme-<app>/features',
    '@acme-<app>/global',
    '@acme-<app>/processors',

    '@acme-<app>/app/setup/app-setup.module',
  ],
};
