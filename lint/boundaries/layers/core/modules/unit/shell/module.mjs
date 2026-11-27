export const coreModulesUnitShellModule = {
  category: 'core:modules:unit:shell:module',
  pattern: 'core/modules/src/*/shell/*.module.ts',
  capture: ['unit'],
  allow: [
    '@acme-core/modules/<unit>/application',
    '@acme-core/modules/<unit>/infrastructure/index',
    '@acme-core/modules/<unit>/shell/*.facade',
    '@acme-core/modules/<unit>/shell/*.module',
    '@acme-core/contracts/<unit>',
    '@acme-core/modules/*',
    '@acme-core/queues',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
