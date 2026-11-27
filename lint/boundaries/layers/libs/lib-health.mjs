export default {
  category: 'acme-libs',
  lib: 'health',
  allow: [
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/contracts/cache',
    '@nestjs/common',
    '@nestjs/core',
    'nestjs-pino',
    'typeorm',
  ],
};
