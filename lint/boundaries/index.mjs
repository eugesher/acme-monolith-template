import boundariesPlugin from 'eslint-plugin-boundaries';
import { readdirSync } from 'fs';
import { join } from 'path';

import appsAppIndex from './layers/apps/app/apps-app-index.mjs';
import appsAppSetupConfig from './layers/apps/app/apps-app-setup-config.mjs';
import appsAppSetupEntities from './layers/apps/app/apps-app-setup-entities.mjs';
import appsAppSetupModule from './layers/apps/app/apps-app-setup-module.mjs';
import appsAppShell from './layers/apps/app/apps-app-shell.mjs';
import appsMain from './layers/apps/apps-main.mjs';
import appsCommonEntities from './layers/apps/common/apps-common-entities.mjs';
import appsCommonModulesIndex from './layers/apps/common/apps-common-modules-index.mjs';
import appsCommonModulesUnitApplication from './layers/apps/common/apps-common-modules-unit-application.mjs';
import appsCommonModulesUnitDomain from './layers/apps/common/apps-common-modules-unit-domain.mjs';
import appsCommonModulesUnitIndex from './layers/apps/common/apps-common-modules-unit-index.mjs';
import appsCommonModulesUnitInfrastructureCache from './layers/apps/common/apps-common-modules-unit-infrastructure-cache.mjs';
import appsCommonModulesUnitInfrastructureCommonAdaptersSpec from './layers/apps/common/apps-common-modules-unit-infrastructure-common-adapters-spec.mjs';
import appsCommonModulesUnitInfrastructureCommonAdapters from './layers/apps/common/apps-common-modules-unit-infrastructure-common-adapters.mjs';
import appsCommonModulesUnitInfrastructureCoreAdaptersSpec from './layers/apps/common/apps-common-modules-unit-infrastructure-core-adapters-spec.mjs';
import appsCommonModulesUnitInfrastructureCoreAdapters from './layers/apps/common/apps-common-modules-unit-infrastructure-core-adapters.mjs';
import appsCommonModulesUnitInfrastructurePersistence from './layers/apps/common/apps-common-modules-unit-infrastructure-persistence.mjs';
import appsCommonModulesUnitInfrastructure from './layers/apps/common/apps-common-modules-unit-infrastructure.mjs';
import appsCommonModulesUnitOutboundPorts from './layers/apps/common/apps-common-modules-unit-outbound-ports.mjs';
import appsCommonModulesUnitOutboundTokens from './layers/apps/common/apps-common-modules-unit-outbound-tokens.mjs';
import appsCommonModulesUnitOutboundTypesCommands from './layers/apps/common/apps-common-modules-unit-outbound-types-commands.mjs';
import appsCommonModulesUnitOutboundTypesEnums from './layers/apps/common/apps-common-modules-unit-outbound-types-enums.mjs';
import appsCommonModulesUnitOutboundTypesQueries from './layers/apps/common/apps-common-modules-unit-outbound-types-queries.mjs';
import appsCommonModulesUnitOutboundTypesRecords from './layers/apps/common/apps-common-modules-unit-outbound-types-records.mjs';
import appsCommonModulesUnitOutboundTypesViews from './layers/apps/common/apps-common-modules-unit-outbound-types-views.mjs';
import appsCommonModulesUnitOutboundTypes from './layers/apps/common/apps-common-modules-unit-outbound-types.mjs';
import appsCommonModulesUnitOutbound from './layers/apps/common/apps-common-modules-unit-outbound.mjs';
import appsCommonModulesUnitShellFacade from './layers/apps/common/apps-common-modules-unit-shell-facade.mjs';
import appsCommonModulesUnitShell from './layers/apps/common/apps-common-modules-unit-shell.mjs';
import appsCommonSharedIndex from './layers/apps/common/apps-common-shared-index.mjs';
import appsCommonSharedUnitIndex from './layers/apps/common/apps-common-shared-unit-index.mjs';
import appsCommonSharedUnit from './layers/apps/common/apps-common-shared-unit.mjs';
import appsContracts from './layers/apps/contracts/apps-contracts.mjs';
import appsFeaturesIndex from './layers/apps/features/apps-features-index.mjs';
import appsFeaturesUnitApplication from './layers/apps/features/apps-features-unit-application.mjs';
import appsFeaturesUnitDomain from './layers/apps/features/apps-features-unit-domain.mjs';
import appsFeaturesUnitInfrastructureCache from './layers/apps/features/apps-features-unit-infrastructure-cache.mjs';
import appsFeaturesUnitInfrastructureCommonAdaptersSpec from './layers/apps/features/apps-features-unit-infrastructure-common-adapters-spec.mjs';
import appsFeaturesUnitInfrastructureCommonAdapters from './layers/apps/features/apps-features-unit-infrastructure-common-adapters.mjs';
import appsFeaturesUnitInfrastructureConfigSpec from './layers/apps/features/apps-features-unit-infrastructure-config-spec.mjs';
import appsFeaturesUnitInfrastructureConfig from './layers/apps/features/apps-features-unit-infrastructure-config.mjs';
import appsFeaturesUnitInfrastructureCoreAdaptersSpec from './layers/apps/features/apps-features-unit-infrastructure-core-adapters-spec.mjs';
import appsFeaturesUnitInfrastructureCoreAdapters from './layers/apps/features/apps-features-unit-infrastructure-core-adapters.mjs';
import appsFeaturesUnitInfrastructureLibAdaptersSpec from './layers/apps/features/apps-features-unit-infrastructure-lib-adapters-spec.mjs';
import appsFeaturesUnitInfrastructureLibAdapters from './layers/apps/features/apps-features-unit-infrastructure-lib-adapters.mjs';
import appsFeaturesUnitInfrastructurePersistence from './layers/apps/features/apps-features-unit-infrastructure-persistence.mjs';
import appsFeaturesUnitInfrastructureQueueSpec from './layers/apps/features/apps-features-unit-infrastructure-queue-spec.mjs';
import appsFeaturesUnitInfrastructureQueue from './layers/apps/features/apps-features-unit-infrastructure-queue.mjs';
import appsFeaturesUnitInfrastructure from './layers/apps/features/apps-features-unit-infrastructure.mjs';
import appsFeaturesUnitModulesIndex from './layers/apps/features/apps-features-unit-modules-index.mjs';
import appsFeaturesUnitOutboundPorts from './layers/apps/features/apps-features-unit-outbound-ports.mjs';
import appsFeaturesUnitOutboundTokens from './layers/apps/features/apps-features-unit-outbound-tokens.mjs';
import appsFeaturesUnitOutboundTypesCommands from './layers/apps/features/apps-features-unit-outbound-types-commands.mjs';
import appsFeaturesUnitOutboundTypesEnums from './layers/apps/features/apps-features-unit-outbound-types-enums.mjs';
import appsFeaturesUnitOutboundTypesQueries from './layers/apps/features/apps-features-unit-outbound-types-queries.mjs';
import appsFeaturesUnitOutboundTypesRecords from './layers/apps/features/apps-features-unit-outbound-types-records.mjs';
import appsFeaturesUnitOutboundTypesViews from './layers/apps/features/apps-features-unit-outbound-types-views.mjs';
import appsFeaturesUnitOutboundTypes from './layers/apps/features/apps-features-unit-outbound-types.mjs';
import appsFeaturesUnitOutbound from './layers/apps/features/apps-features-unit-outbound.mjs';
import appsFeaturesUnitPresentation from './layers/apps/features/apps-features-unit-presentation.mjs';
import appsFeaturesUnitShellModule from './layers/apps/features/apps-features-unit-shell-module.mjs';
import appsFeaturesUnitShell from './layers/apps/features/apps-features-unit-shell.mjs';
import appsFeaturesUnit from './layers/apps/features/apps-features-unit.mjs';
import appsGlobalIndex from './layers/apps/global/apps-global-index.mjs';
import appsGlobalUnitApplication from './layers/apps/global/apps-global-unit-application.mjs';
import appsGlobalUnitIndex from './layers/apps/global/apps-global-unit-index.mjs';
import appsGlobalUnitInfrastructureCache from './layers/apps/global/apps-global-unit-infrastructure-cache.mjs';
import appsGlobalUnitInfrastructureCommonAdapters from './layers/apps/global/apps-global-unit-infrastructure-common-adapters.mjs';
import appsGlobalUnitInfrastructureCoreAdaptersSpec from './layers/apps/global/apps-global-unit-infrastructure-core-adapters-spec.mjs';
import appsGlobalUnitInfrastructureCoreAdapters from './layers/apps/global/apps-global-unit-infrastructure-core-adapters.mjs';
import appsGlobalUnitInfrastructureLibAdapters from './layers/apps/global/apps-global-unit-infrastructure-lib-adapters.mjs';
import appsGlobalUnitInfrastructurePersistence from './layers/apps/global/apps-global-unit-infrastructure-persistence.mjs';
import appsGlobalUnitInfrastructure from './layers/apps/global/apps-global-unit-infrastructure.mjs';
import appsGlobalUnitOutboundPorts from './layers/apps/global/apps-global-unit-outbound-ports.mjs';
import appsGlobalUnitOutboundTokens from './layers/apps/global/apps-global-unit-outbound-tokens.mjs';
import appsGlobalUnitOutboundTypesCommands from './layers/apps/global/apps-global-unit-outbound-types-commands.mjs';
import appsGlobalUnitOutboundTypesEnums from './layers/apps/global/apps-global-unit-outbound-types-enums.mjs';
import appsGlobalUnitOutboundTypesQueries from './layers/apps/global/apps-global-unit-outbound-types-queries.mjs';
import appsGlobalUnitOutboundTypesRecords from './layers/apps/global/apps-global-unit-outbound-types-records.mjs';
import appsGlobalUnitOutboundTypesViews from './layers/apps/global/apps-global-unit-outbound-types-views.mjs';
import appsGlobalUnitOutboundTypes from './layers/apps/global/apps-global-unit-outbound-types.mjs';
import appsGlobalUnitOutbound from './layers/apps/global/apps-global-unit-outbound.mjs';
import appsGlobalUnitShell from './layers/apps/global/apps-global-unit-shell.mjs';
import appsProcessorsIndex from './layers/apps/processors/apps-processors-index.mjs';
import appsProcessorsUnitApplication from './layers/apps/processors/apps-processors-unit-application.mjs';
import appsProcessorsUnitDomain from './layers/apps/processors/apps-processors-unit-domain.mjs';
import appsProcessorsUnitInfrastructureCache from './layers/apps/processors/apps-processors-unit-infrastructure-cache.mjs';
import appsProcessorsUnitInfrastructureCommonAdaptersSpec from './layers/apps/processors/apps-processors-unit-infrastructure-common-adapters-spec.mjs';
import appsProcessorsUnitInfrastructureCommonAdapters from './layers/apps/processors/apps-processors-unit-infrastructure-common-adapters.mjs';
import appsProcessorsUnitInfrastructureConfigSpec from './layers/apps/processors/apps-processors-unit-infrastructure-config-spec.mjs';
import appsProcessorsUnitInfrastructureConfig from './layers/apps/processors/apps-processors-unit-infrastructure-config.mjs';
import appsProcessorsUnitInfrastructureCoreAdaptersSpec from './layers/apps/processors/apps-processors-unit-infrastructure-core-adapters-spec.mjs';
import appsProcessorsUnitInfrastructureCoreAdapters from './layers/apps/processors/apps-processors-unit-infrastructure-core-adapters.mjs';
import appsProcessorsUnitInfrastructureLibAdaptersSpec from './layers/apps/processors/apps-processors-unit-infrastructure-lib-adapters-spec.mjs';
import appsProcessorsUnitInfrastructureLibAdapters from './layers/apps/processors/apps-processors-unit-infrastructure-lib-adapters.mjs';
import appsProcessorsUnitInfrastructurePersistence from './layers/apps/processors/apps-processors-unit-infrastructure-persistence.mjs';
import appsProcessorsUnitInfrastructureQueueSpec from './layers/apps/processors/apps-processors-unit-infrastructure-queue-spec.mjs';
import appsProcessorsUnitInfrastructureQueue from './layers/apps/processors/apps-processors-unit-infrastructure-queue.mjs';
import appsProcessorsUnitInfrastructure from './layers/apps/processors/apps-processors-unit-infrastructure.mjs';
import appsProcessorsUnitModulesIndex from './layers/apps/processors/apps-processors-unit-modules-index.mjs';
import appsProcessorsUnitOutboundPorts from './layers/apps/processors/apps-processors-unit-outbound-ports.mjs';
import appsProcessorsUnitOutboundTokens from './layers/apps/processors/apps-processors-unit-outbound-tokens.mjs';
import appsProcessorsUnitOutboundTypesCommands from './layers/apps/processors/apps-processors-unit-outbound-types-commands.mjs';
import appsProcessorsUnitOutboundTypesEnums from './layers/apps/processors/apps-processors-unit-outbound-types-enums.mjs';
import appsProcessorsUnitOutboundTypesQueries from './layers/apps/processors/apps-processors-unit-outbound-types-queries.mjs';
import appsProcessorsUnitOutboundTypesRecords from './layers/apps/processors/apps-processors-unit-outbound-types-records.mjs';
import appsProcessorsUnitOutboundTypesViews from './layers/apps/processors/apps-processors-unit-outbound-types-views.mjs';
import appsProcessorsUnitOutboundTypes from './layers/apps/processors/apps-processors-unit-outbound-types.mjs';
import appsProcessorsUnitOutbound from './layers/apps/processors/apps-processors-unit-outbound.mjs';
import appsProcessorsUnitQueues from './layers/apps/processors/apps-processors-unit-queues.mjs';
import appsProcessorsUnitShellModule from './layers/apps/processors/apps-processors-unit-shell-module.mjs';
import appsProcessorsUnitShell from './layers/apps/processors/apps-processors-unit-shell.mjs';
import appsProcessorsUnit from './layers/apps/processors/apps-processors-unit.mjs';
import appsTest from './layers/apps/test/apps-test.mjs';
import coreContracts from './layers/core/core-contracts.mjs';
import coreDomain from './layers/core/core-domain.mjs';
import coreEntities from './layers/core/core-entities.mjs';
import coreModulesUnitApplication from './layers/core/core-modules-unit-application.mjs';
import coreModulesUnitDomain from './layers/core/core-modules-unit-domain.mjs';
import coreModulesUnitIndex from './layers/core/core-modules-unit-index.mjs';
import coreModulesUnitInfrastructureCache from './layers/core/core-modules-unit-infrastructure-cache.mjs';
import coreModulesUnitInfrastructureConfig from './layers/core/core-modules-unit-infrastructure-config.mjs';
import coreModulesUnitInfrastructureCoreAdapters from './layers/core/core-modules-unit-infrastructure-core-adapters.mjs';
import coreModulesUnitInfrastructureLibAdapters from './layers/core/core-modules-unit-infrastructure-lib-adapters.mjs';
import coreModulesUnitInfrastructurePersistence from './layers/core/core-modules-unit-infrastructure-persistence.mjs';
import coreModulesUnitInfrastructureQueue from './layers/core/core-modules-unit-infrastructure-queue.mjs';
import coreModulesUnitInfrastructure from './layers/core/core-modules-unit-infrastructure.mjs';
import coreModulesUnitOutboundPorts from './layers/core/core-modules-unit-outbound-ports.mjs';
import coreModulesUnitOutboundTokens from './layers/core/core-modules-unit-outbound-tokens.mjs';
import coreModulesUnitOutboundTypesCommands from './layers/core/core-modules-unit-outbound-types-commands.mjs';
import coreModulesUnitOutboundTypesEnums from './layers/core/core-modules-unit-outbound-types-enums.mjs';
import coreModulesUnitOutboundTypesQueries from './layers/core/core-modules-unit-outbound-types-queries.mjs';
import coreModulesUnitOutboundTypesRecords from './layers/core/core-modules-unit-outbound-types-records.mjs';
import coreModulesUnitOutboundTypesViews from './layers/core/core-modules-unit-outbound-types-views.mjs';
import coreModulesUnitOutboundTypes from './layers/core/core-modules-unit-outbound-types.mjs';
import coreModulesUnitOutbound from './layers/core/core-modules-unit-outbound.mjs';
import coreModulesUnitShellFacade from './layers/core/core-modules-unit-shell-facade.mjs';
import coreModulesUnitShell from './layers/core/core-modules-unit-shell.mjs';
import coreQueues from './layers/core/core-queues.mjs';
import libsAppBootstrap from './layers/libs/libs-app-bootstrap.mjs';
import libsAppSetup from './layers/libs/libs-app-setup.mjs';
import libsApp from './layers/libs/libs-app.mjs';
import libsApplication from './layers/libs/libs-application.mjs';
import libsAuth from './layers/libs/libs-auth.mjs';
import libsCache from './layers/libs/libs-cache.mjs';
import libsConfig from './layers/libs/libs-config.mjs';
import libsContractsDatabase from './layers/libs/libs-contracts-database.mjs';
import libsContracts from './layers/libs/libs-contracts.mjs';
import libsCredentials from './layers/libs/libs-credentials.mjs';
import libsDatabaseOrmApplication from './layers/libs/libs-database-orm-application.mjs';
import libsDatabaseOrmShell from './layers/libs/libs-database-orm-shell.mjs';
import libsDatabaseSpec from './layers/libs/libs-database-spec.mjs';
import libsDatabase from './layers/libs/libs-database.mjs';
import libsHealth from './layers/libs/libs-health.mjs';
import libsHttp from './layers/libs/libs-http.mjs';
import libsInfrastructure from './layers/libs/libs-infrastructure.mjs';
import libsLocalStorage from './layers/libs/libs-local-storage.mjs';
import libsObservability from './layers/libs/libs-observability.mjs';
import libsOpenapi from './layers/libs/libs-openapi.mjs';
import libsOutbound from './layers/libs/libs-outbound.mjs';
import libsQueue from './layers/libs/libs-queue.mjs';
import libsShellSpec from './layers/libs/libs-shell-spec.mjs';
import libsShell from './layers/libs/libs-shell.mjs';
import libsTesting from './layers/libs/libs-testing.mjs';
import libsToolkitDatabase from './layers/libs/libs-toolkit-database.mjs';
import libsToolkit from './layers/libs/libs-toolkit.mjs';
import libs from './layers/libs/libs.mjs';
import repoMigrations from './layers/repo/repo-migrations.mjs';
import repoScripts from './layers/repo/repo-scripts.mjs';
import repoSpec from './layers/repo/repo-spec.mjs';
import repoTestInfra from './layers/repo/repo-test-infra.mjs';
import repoTestSystem from './layers/repo/repo-test-system.mjs';
import repo from './layers/repo/repo.mjs';
import spec from './layers/repo/spec.mjs';
import { selectorsOf } from './specifiers.mjs';

const root = join(import.meta.dirname, '../..');

const files = [
  appsMain,
  appsGlobalIndex,
  appsGlobalUnitIndex,
  appsGlobalUnitInfrastructureCoreAdapters,
  appsGlobalUnitInfrastructureCommonAdapters,
  appsGlobalUnitInfrastructureLibAdapters,
  appsGlobalUnitApplication,
  appsGlobalUnitOutboundPorts,
  appsGlobalUnitOutboundTokens,
  appsGlobalUnitOutboundTypesCommands,
  appsGlobalUnitOutboundTypesEnums,
  appsGlobalUnitOutboundTypesQueries,
  appsGlobalUnitOutboundTypesRecords,
  appsGlobalUnitOutboundTypesViews,
  appsGlobalUnitOutboundTypes,
  appsGlobalUnitOutbound,
  appsGlobalUnitInfrastructurePersistence,
  appsGlobalUnitInfrastructureCache,
  appsGlobalUnitInfrastructure,
  appsGlobalUnitShell,
  appsAppIndex,
  appsAppShell,
  appsAppSetupEntities,
  appsAppSetupConfig,
  appsAppSetupModule,
  appsCommonModulesUnitDomain,
  appsCommonModulesUnitOutboundPorts,
  appsCommonModulesUnitOutboundTokens,
  appsCommonModulesUnitOutboundTypesCommands,
  appsCommonModulesUnitOutboundTypesEnums,
  appsCommonModulesUnitOutboundTypesQueries,
  appsCommonModulesUnitOutboundTypesRecords,
  appsCommonModulesUnitOutboundTypesViews,
  appsCommonModulesUnitOutboundTypes,
  appsCommonModulesUnitOutbound,
  appsCommonModulesUnitApplication,
  appsCommonModulesUnitInfrastructureCoreAdapters,
  appsCommonModulesUnitInfrastructureCommonAdapters,
  appsCommonModulesUnitInfrastructurePersistence,
  appsCommonModulesUnitInfrastructureCache,
  appsCommonModulesUnitInfrastructure,
  appsCommonModulesUnitShellFacade,
  appsCommonModulesUnitShell,
  appsCommonModulesIndex,
  appsCommonModulesUnitIndex,
  appsCommonEntities,
  appsContracts,
  appsCommonSharedIndex,
  appsCommonSharedUnitIndex,
  appsCommonSharedUnit,
  appsTest,
  appsFeaturesIndex,
  appsFeaturesUnitModulesIndex,
  appsFeaturesUnitShellModule,
  appsFeaturesUnitDomain,
  appsFeaturesUnitOutboundPorts,
  appsFeaturesUnitOutboundTokens,
  appsFeaturesUnitOutboundTypesCommands,
  appsFeaturesUnitOutboundTypesEnums,
  appsFeaturesUnitOutboundTypesQueries,
  appsFeaturesUnitOutboundTypesRecords,
  appsFeaturesUnitOutboundTypesViews,
  appsFeaturesUnitOutboundTypes,
  appsFeaturesUnitOutbound,
  appsFeaturesUnitApplication,
  appsFeaturesUnitInfrastructureCoreAdapters,
  appsFeaturesUnitInfrastructureCommonAdapters,
  appsFeaturesUnitInfrastructureLibAdapters,
  appsFeaturesUnitInfrastructureQueue,
  appsFeaturesUnitInfrastructureConfig,
  appsFeaturesUnitInfrastructurePersistence,
  appsFeaturesUnitInfrastructureCache,
  appsFeaturesUnitInfrastructure,
  appsFeaturesUnitPresentation,
  appsFeaturesUnitShell,
  appsFeaturesUnit,
  appsProcessorsIndex,
  appsProcessorsUnitModulesIndex,
  appsProcessorsUnitShellModule,
  appsProcessorsUnitDomain,
  appsProcessorsUnitOutboundPorts,
  appsProcessorsUnitOutboundTokens,
  appsProcessorsUnitOutboundTypesCommands,
  appsProcessorsUnitOutboundTypesEnums,
  appsProcessorsUnitOutboundTypesQueries,
  appsProcessorsUnitOutboundTypesRecords,
  appsProcessorsUnitOutboundTypesViews,
  appsProcessorsUnitOutboundTypes,
  appsProcessorsUnitOutbound,
  appsProcessorsUnitApplication,
  appsProcessorsUnitInfrastructureCoreAdapters,
  appsProcessorsUnitInfrastructureCommonAdapters,
  appsProcessorsUnitInfrastructureLibAdapters,
  appsProcessorsUnitInfrastructureQueue,
  appsProcessorsUnitInfrastructureConfig,
  appsProcessorsUnitInfrastructurePersistence,
  appsProcessorsUnitInfrastructureCache,
  appsProcessorsUnitInfrastructure,
  appsProcessorsUnitShell,
  appsProcessorsUnitQueues,
  appsProcessorsUnit,
  coreModulesUnitDomain,
  coreModulesUnitOutboundPorts,
  coreModulesUnitOutboundTokens,
  coreModulesUnitOutboundTypesCommands,
  coreModulesUnitOutboundTypesEnums,
  coreModulesUnitOutboundTypesQueries,
  coreModulesUnitOutboundTypesRecords,
  coreModulesUnitOutboundTypesViews,
  coreModulesUnitOutboundTypes,
  coreModulesUnitOutbound,
  coreModulesUnitApplication,
  coreModulesUnitInfrastructureQueue,
  coreModulesUnitInfrastructureConfig,
  coreModulesUnitInfrastructureCoreAdapters,
  coreModulesUnitInfrastructureLibAdapters,
  coreModulesUnitInfrastructurePersistence,
  coreModulesUnitInfrastructureCache,
  coreModulesUnitInfrastructure,
  coreModulesUnitShellFacade,
  coreModulesUnitShell,
  coreModulesUnitIndex,
  coreContracts,
  coreDomain,
  coreEntities,
  coreQueues,
  libsContracts,
  libs,
  repoSpec,
  repoScripts,
  repoMigrations,
  repoTestSystem,
  repoTestInfra,
  repo,
  appsGlobalUnitInfrastructureCoreAdaptersSpec,
  appsFeaturesUnitInfrastructureCoreAdaptersSpec,
  appsFeaturesUnitInfrastructureCommonAdaptersSpec,
  appsFeaturesUnitInfrastructureLibAdaptersSpec,
  appsFeaturesUnitInfrastructureQueueSpec,
  appsFeaturesUnitInfrastructureConfigSpec,
  appsProcessorsUnitInfrastructureCoreAdaptersSpec,
  appsProcessorsUnitInfrastructureCommonAdaptersSpec,
  appsProcessorsUnitInfrastructureLibAdaptersSpec,
  appsProcessorsUnitInfrastructureQueueSpec,
  appsProcessorsUnitInfrastructureConfigSpec,
  appsCommonModulesUnitInfrastructureCoreAdaptersSpec,
  appsCommonModulesUnitInfrastructureCommonAdaptersSpec,
  libsContractsDatabase,
  libsApp,
  libsAuth,
  libsCache,
  libsConfig,
  libsCredentials,
  libsDatabase,
  libsHealth,
  libsHttp,
  libsLocalStorage,
  libsObservability,
  libsOpenapi,
  libsQueue,
  libsTesting,
  libsAppSetup,
  libsAppBootstrap,
  spec,
  libsDatabaseSpec,
  libsToolkit,
  libsToolkitDatabase,
  libsShell,
  libsApplication,
  libsInfrastructure,
  libsOutbound,
  libsShellSpec,
  libsDatabaseOrmShell,
  libsDatabaseOrmApplication,
];

const present = readdirSync(join(import.meta.dirname, 'layers'), { recursive: true }).filter(
  (file) => file.endsWith('.mjs'),
).length;

if (files.length !== present) {
  throw new Error(
    `lint/boundaries: index.mjs lists ${files.length} files, layers/ holds ${present}`,
  );
}

const layers = files.flat();

const categories = layers
  .filter((layer) => layer.pattern)
  .map(({ category, pattern, capture }) => ({ category, pattern, capture }));

const categoryNames = new Set(categories.map(({ category }) => category));

const fromOf = ({ category, lib, files, path }) => {
  if (path) {
    return { file: { path } };
  }

  const captured = { ...(lib ? { lib } : {}), ...(files ? { file: files } : {}) };

  return {
    file:
      Object.keys(captured).length > 0
        ? { categories: category, captured }
        : { categories: category },
  };
};

const policies = layers
  .filter((layer) => layer.allow)
  .map((layer) => ({
    from: fromOf(layer),
    allow: layer.allow.flatMap((specifier) => selectorsOf(specifier, categoryNames)),
  }));

const dangling = [
  ...new Set(
    policies
      .flatMap(({ from, allow }) => [from.file, ...allow.map(({ to }) => to.file)])
      .filter((file) => file?.categories && !categoryNames.has(file.categories))
      .map((file) => file.categories),
  ),
];

if (dangling.length > 0) {
  throw new Error(`lint/boundaries: unknown categories ${dangling.join(', ')}`);
}

export const boundaries = [
  {
    files: ['**/*.ts'],
    plugins: { boundaries: boundariesPlugin },
    settings: {
      'import/resolver': { typescript: { project: join(root, 'tsconfig.json') } },
      'boundaries/root-path': root,
      'boundaries/dependency-nodes': ['import', 'export', 'dynamic-import'],
      'boundaries/legacy-templates': false,
      'boundaries/files': categories,
      'boundaries/files-single-match': true,
    },
    rules: {
      'boundaries/no-unknown-dependencies': 'error',
      'boundaries/dependencies': [
        'error',
        { default: 'disallow', checkAllOrigins: true, checkUnknownLocals: true, policies },
      ],
    },
  },
  {
    files: ['apps/**/*.ts', 'core/**/*.ts', 'libs/**/*.ts'],
    rules: { 'boundaries/no-unknown-files': 'error' },
  },
];
