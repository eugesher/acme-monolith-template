export default {
  category: 'acme-libs',
  lib: 'cache',
  allow: [
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/config',
    '@acme-libs/observability',
    '@nestjs/common',
    '@nestjs/config',
    '@nestjs/core',
    '@opentelemetry/api',
    'ioredis',
    'nestjs-pino',
  ],
};
