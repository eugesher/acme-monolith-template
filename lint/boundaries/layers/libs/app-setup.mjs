export const libsAppSetup = {
  category: 'libs',
  lib: 'app',
  files: 'setup/**',
  allow: [
    '@nestjs/common',
    '@nestjs/core',
    '@nestjs/typeorm',

    '@acme-libs/cache',
    '@acme-libs/database',
    '@acme-libs/http',
    '@acme-libs/local-storage',
    '@acme-libs/observability',
    '@acme-libs/queue',
  ],
};
