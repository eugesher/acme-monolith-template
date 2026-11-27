export const libsHealth = {
  category: 'libs',
  lib: 'health',
  allow: [
    '@nestjs/common',
    '@nestjs/core',
    'nestjs-pino',
    'typeorm',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/contracts/cache',
  ],
};
