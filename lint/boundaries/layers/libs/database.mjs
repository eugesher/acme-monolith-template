export const libsDatabase = {
  category: 'libs',
  lib: 'database',
  allow: [
    '@nestjs/common',
    '@nestjs/config',
    '@nestjs/typeorm',
    '@nestjs-cls/transactional',
    '@nestjs-cls/transactional-adapter-typeorm',
    'typeorm',

    '@acme-libs/config',
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/local-storage',
    '@acme-libs/toolkit',
  ],
};
