export const libsLocalStorage = {
  category: 'libs',
  lib: 'local-storage',
  allow: [
    '@nestjs/common',
    '@nestjs/core',
    '@nestjs-cls/transactional',
    '@nestjs-cls/transactional-adapter-typeorm',
    'http',
    'nestjs-cls',
    'nestjs-pino',
    'typeorm',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/observability',
    '@acme-libs/toolkit',
  ],
};
