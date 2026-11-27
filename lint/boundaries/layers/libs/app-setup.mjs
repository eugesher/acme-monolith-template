export const libsAppSetup = {
  category: 'libs',
  lib: 'app',
  files: 'setup/**',
  allow: [
    '@acme-libs/cache',
    '@acme-libs/database',
    '@acme-libs/http',
    '@acme-libs/local-storage',
    '@acme-libs/observability',
    '@acme-libs/queue',
    '@nestjs/common',
    '@nestjs/core',
    '@nestjs/typeorm',
  ],
};
