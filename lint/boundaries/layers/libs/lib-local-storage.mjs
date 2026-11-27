export default {
  category: 'acme-libs',
  lib: 'local-storage',
  allow: [
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/observability',
    '@nestjs-cls/transactional',
    '@nestjs-cls/transactional-adapter-typeorm',
    '@nestjs/common',
    '@nestjs/core',
    'http',
    'nestjs-cls',
    'nestjs-pino',
    'typeorm',
  ],
};
