export const libsAppBootstrap = {
  category: 'libs',
  lib: 'app',
  files: 'bootstrap/**',
  allow: [
    '@nestjs/common',
    '@nestjs/config',
    'nestjs-pino',

    '@acme-libs/observability',
    '@acme-libs/openapi',
  ],
};
