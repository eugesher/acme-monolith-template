export default {
  category: 'acme-app:app:shell:module',
  pattern: 'apps/*/src/app/shell/app.module.ts',
  capture: ['app'],
  allow: [
    '@acme-<app>/app/setup/app-setup.module',
    '@acme-<app>/global',
    '@acme-<app>/features',
    '@acme-<app>/processors',
    '@nestjs/common',
  ],
};
