export const coreModulesUnitShellModule = {
  category: 'core:modules:unit:shell:module',
  pattern: 'core/modules/src/*/shell/*.module.ts',
  capture: ['unit'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/modules/*',
    '@acme-core/queues',
    '@acme-core/contracts/<unit>',

    '@acme-core/modules/<unit>/application',
    '@acme-core/modules/<unit>/infrastructure/index',
    '@acme-core/modules/<unit>/shell/*.facade',
  ],
};
