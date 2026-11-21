import {
  baseLibs,
  coreDomain,
  from,
  fromFile,
  layerOf,
  libContracts,
  libs,
  own,
  packages,
  persistenceInterfaces,
  to,
} from './selectors.mjs';

const layer = layerOf('acme-core:modules', ['module']);

const ownContracts = to('acme-core:contracts', own('module'));

export const acmeCore = [
  from('acme-core:modules:domain', [layer('domain'), coreDomain, baseLibs()]),
  from('acme-core:modules:outbound', [layer('outbound'), ownContracts, baseLibs()]),
  fromFile('acme-core:modules:outbound', persistenceInterfaces, [to('acme-core:entities')]),
  from('acme-core:modules:application', [
    layer('domain'),
    layer('outbound'),
    layer('application'),
    coreDomain,
    ownContracts,
    baseLibs('observability'),
    packages('nestjs-pino'),
  ]),
  from('acme-core:modules:infrastructure', [
    layer('outbound'),
    layer('infrastructure'),
    layer('infrastructure:queue'),
    layer('infrastructure:config'),
    layer('infrastructure:core-adapters'),
    layer('infrastructure:lib-adapters'),
    to('acme-core:entities'),
    baseLibs(),
    libContracts('cache', 'database', 'local-storage'),
    packages('@nestjs/common', 'typeorm'),
  ]),
  from('acme-core:modules:infrastructure:queue', [
    layer('outbound'),
    layer('infrastructure:queue'),
    ownContracts,
    to('acme-core:queues'),
    baseLibs(),
    packages('@nestjs/bullmq', '@nestjs/common', 'bullmq'),
  ]),
  from('acme-core:modules:infrastructure:core-adapters', [
    layer('outbound'),
    layer('infrastructure:core-adapters'),
    to('acme-core:contracts'),
    baseLibs(),
  ]),
  from('acme-core:modules:infrastructure:lib-adapters', [
    layer('outbound'),
    layer('infrastructure:lib-adapters'),
    baseLibs(),
    packages('@nestjs/common'),
  ]),
  from('acme-core:modules:infrastructure:config', [
    layer('outbound'),
    layer('infrastructure:config'),
    libs('config'),
  ]),
  from('acme-core:modules:shell:facade', [layer('application'), ownContracts, baseLibs()]),
  from('acme-core:modules:shell', [
    layer('application'),
    layer('infrastructure'),
    layer('shell:facade'),
    layer('shell'),
    ownContracts,
    to('acme-core:modules:index'),
    baseLibs(),
  ]),
  from('acme-core:modules:index', [layer('shell')]),
  from('acme-core:contracts', [ownContracts, baseLibs()]),
  from('acme-core:domain', [coreDomain, baseLibs()]),
  from('acme-core:entities', [to('acme-core:entities'), libs('kernel'), packages('typeorm')]),
  from('acme-core:queues', [to('acme-core:queues'), to('acme-core:contracts'), libs('queue')]),
];
