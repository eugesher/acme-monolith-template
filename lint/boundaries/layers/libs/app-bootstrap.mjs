export const libsAppBootstrap = {
  category: 'libs',
  lib: 'app',
  files: 'bootstrap/**',
  allow: [
    '@acme-libs/observability',
    '@acme-libs/openapi',
    '@nestjs/common',
    '@nestjs/config',
    'nestjs-pino',
  ],
};
