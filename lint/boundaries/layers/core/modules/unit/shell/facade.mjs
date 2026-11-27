export const coreModulesUnitShellFacade = {
  category: 'core:modules:unit:shell:facade',
  pattern: 'core/modules/src/*/shell/*.facade.ts',
  capture: ['unit'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/contracts/<unit>',

    '@acme-core/modules/<unit>/application',
  ],
};
