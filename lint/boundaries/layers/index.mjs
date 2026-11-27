import { layersOf } from '../helpers/index.mjs';
import { appsAppIndex } from './apps/app/index.mjs';
import { appsAppSetupConfig } from './apps/app/setup-config.mjs';
import { appsAppSetupEntities } from './apps/app/setup-entities.mjs';
import { appsAppSetupModule } from './apps/app/setup-module.mjs';
import { appsAppShell } from './apps/app/shell.mjs';
import { appsCommonEntities } from './apps/common/entities.mjs';
import { appsCommonModulesIndex } from './apps/common/modules-index.mjs';
import { appsCommonModulesUnitApplication } from './apps/common/modules-unit-application.mjs';
import { appsCommonModulesUnitDomain } from './apps/common/modules-unit-domain.mjs';
import { appsCommonModulesUnitIndex } from './apps/common/modules-unit-index.mjs';
import { appsCommonModulesUnitInfrastructureCache } from './apps/common/modules-unit-infrastructure-cache.mjs';
import { appsCommonModulesUnitInfrastructureCommonAdaptersSpec } from './apps/common/modules-unit-infrastructure-common-adapters-spec.mjs';
import { appsCommonModulesUnitInfrastructureCommonAdapters } from './apps/common/modules-unit-infrastructure-common-adapters.mjs';
import { appsCommonModulesUnitInfrastructureCoreAdaptersSpec } from './apps/common/modules-unit-infrastructure-core-adapters-spec.mjs';
import { appsCommonModulesUnitInfrastructureCoreAdapters } from './apps/common/modules-unit-infrastructure-core-adapters.mjs';
import { appsCommonModulesUnitInfrastructurePersistence } from './apps/common/modules-unit-infrastructure-persistence.mjs';
import { appsCommonModulesUnitInfrastructure } from './apps/common/modules-unit-infrastructure.mjs';
import { appsCommonModulesUnitOutboundPorts } from './apps/common/modules-unit-outbound-ports.mjs';
import { appsCommonModulesUnitOutboundTokens } from './apps/common/modules-unit-outbound-tokens.mjs';
import { appsCommonModulesUnitOutboundTypesCommands } from './apps/common/modules-unit-outbound-types-commands.mjs';
import { appsCommonModulesUnitOutboundTypesEnums } from './apps/common/modules-unit-outbound-types-enums.mjs';
import { appsCommonModulesUnitOutboundTypesQueries } from './apps/common/modules-unit-outbound-types-queries.mjs';
import { appsCommonModulesUnitOutboundTypesRecords } from './apps/common/modules-unit-outbound-types-records.mjs';
import { appsCommonModulesUnitOutboundTypesViews } from './apps/common/modules-unit-outbound-types-views.mjs';
import { appsCommonModulesUnitOutboundTypes } from './apps/common/modules-unit-outbound-types.mjs';
import { appsCommonModulesUnitOutbound } from './apps/common/modules-unit-outbound.mjs';
import { appsCommonModulesUnitShellFacade } from './apps/common/modules-unit-shell-facade.mjs';
import { appsCommonModulesUnitShell } from './apps/common/modules-unit-shell.mjs';
import { appsCommonSharedIndex } from './apps/common/shared-index.mjs';
import { appsCommonSharedUnitIndex } from './apps/common/shared-unit-index.mjs';
import { appsCommonSharedUnit } from './apps/common/shared-unit.mjs';
import { appsContracts } from './apps/contracts/contracts.mjs';
import { appsFeaturesIndex } from './apps/features/index.mjs';
import { appsFeaturesUnitApplication } from './apps/features/unit-application.mjs';
import { appsFeaturesUnitDomain } from './apps/features/unit-domain.mjs';
import { appsFeaturesUnitInfrastructureCache } from './apps/features/unit-infrastructure-cache.mjs';
import { appsFeaturesUnitInfrastructureCommonAdaptersSpec } from './apps/features/unit-infrastructure-common-adapters-spec.mjs';
import { appsFeaturesUnitInfrastructureCommonAdapters } from './apps/features/unit-infrastructure-common-adapters.mjs';
import { appsFeaturesUnitInfrastructureConfigSpec } from './apps/features/unit-infrastructure-config-spec.mjs';
import { appsFeaturesUnitInfrastructureConfig } from './apps/features/unit-infrastructure-config.mjs';
import { appsFeaturesUnitInfrastructureCoreAdaptersSpec } from './apps/features/unit-infrastructure-core-adapters-spec.mjs';
import { appsFeaturesUnitInfrastructureCoreAdapters } from './apps/features/unit-infrastructure-core-adapters.mjs';
import { appsFeaturesUnitInfrastructureLibAdaptersSpec } from './apps/features/unit-infrastructure-lib-adapters-spec.mjs';
import { appsFeaturesUnitInfrastructureLibAdapters } from './apps/features/unit-infrastructure-lib-adapters.mjs';
import { appsFeaturesUnitInfrastructurePersistence } from './apps/features/unit-infrastructure-persistence.mjs';
import { appsFeaturesUnitInfrastructureQueueSpec } from './apps/features/unit-infrastructure-queue-spec.mjs';
import { appsFeaturesUnitInfrastructureQueue } from './apps/features/unit-infrastructure-queue.mjs';
import { appsFeaturesUnitInfrastructure } from './apps/features/unit-infrastructure.mjs';
import { appsFeaturesUnitModulesIndex } from './apps/features/unit-modules-index.mjs';
import { appsFeaturesUnitOutboundPorts } from './apps/features/unit-outbound-ports.mjs';
import { appsFeaturesUnitOutboundTokens } from './apps/features/unit-outbound-tokens.mjs';
import { appsFeaturesUnitOutboundTypesCommands } from './apps/features/unit-outbound-types-commands.mjs';
import { appsFeaturesUnitOutboundTypesEnums } from './apps/features/unit-outbound-types-enums.mjs';
import { appsFeaturesUnitOutboundTypesQueries } from './apps/features/unit-outbound-types-queries.mjs';
import { appsFeaturesUnitOutboundTypesRecords } from './apps/features/unit-outbound-types-records.mjs';
import { appsFeaturesUnitOutboundTypesViews } from './apps/features/unit-outbound-types-views.mjs';
import { appsFeaturesUnitOutboundTypes } from './apps/features/unit-outbound-types.mjs';
import { appsFeaturesUnitOutbound } from './apps/features/unit-outbound.mjs';
import { appsFeaturesUnitPresentation } from './apps/features/unit-presentation.mjs';
import { appsFeaturesUnitShellModule } from './apps/features/unit-shell-module.mjs';
import { appsFeaturesUnitShell } from './apps/features/unit-shell.mjs';
import { appsFeaturesUnit } from './apps/features/unit.mjs';
import { appsGlobalIndex } from './apps/global/index.mjs';
import { appsGlobalUnitApplication } from './apps/global/unit-application.mjs';
import { appsGlobalUnitIndex } from './apps/global/unit-index.mjs';
import { appsGlobalUnitInfrastructureCache } from './apps/global/unit-infrastructure-cache.mjs';
import { appsGlobalUnitInfrastructureCommonAdapters } from './apps/global/unit-infrastructure-common-adapters.mjs';
import { appsGlobalUnitInfrastructureCoreAdaptersSpec } from './apps/global/unit-infrastructure-core-adapters-spec.mjs';
import { appsGlobalUnitInfrastructureCoreAdapters } from './apps/global/unit-infrastructure-core-adapters.mjs';
import { appsGlobalUnitInfrastructureLibAdapters } from './apps/global/unit-infrastructure-lib-adapters.mjs';
import { appsGlobalUnitInfrastructurePersistence } from './apps/global/unit-infrastructure-persistence.mjs';
import { appsGlobalUnitInfrastructure } from './apps/global/unit-infrastructure.mjs';
import { appsGlobalUnitOutboundPorts } from './apps/global/unit-outbound-ports.mjs';
import { appsGlobalUnitOutboundTokens } from './apps/global/unit-outbound-tokens.mjs';
import { appsGlobalUnitOutboundTypesCommands } from './apps/global/unit-outbound-types-commands.mjs';
import { appsGlobalUnitOutboundTypesEnums } from './apps/global/unit-outbound-types-enums.mjs';
import { appsGlobalUnitOutboundTypesQueries } from './apps/global/unit-outbound-types-queries.mjs';
import { appsGlobalUnitOutboundTypesRecords } from './apps/global/unit-outbound-types-records.mjs';
import { appsGlobalUnitOutboundTypesViews } from './apps/global/unit-outbound-types-views.mjs';
import { appsGlobalUnitOutboundTypes } from './apps/global/unit-outbound-types.mjs';
import { appsGlobalUnitOutbound } from './apps/global/unit-outbound.mjs';
import { appsGlobalUnitShell } from './apps/global/unit-shell.mjs';
import { appsMain } from './apps/main.mjs';
import { appsProcessorsIndex } from './apps/processors/index.mjs';
import { appsProcessorsUnitApplication } from './apps/processors/unit-application.mjs';
import { appsProcessorsUnitDomain } from './apps/processors/unit-domain.mjs';
import { appsProcessorsUnitInfrastructureCache } from './apps/processors/unit-infrastructure-cache.mjs';
import { appsProcessorsUnitInfrastructureCommonAdaptersSpec } from './apps/processors/unit-infrastructure-common-adapters-spec.mjs';
import { appsProcessorsUnitInfrastructureCommonAdapters } from './apps/processors/unit-infrastructure-common-adapters.mjs';
import { appsProcessorsUnitInfrastructureConfigSpec } from './apps/processors/unit-infrastructure-config-spec.mjs';
import { appsProcessorsUnitInfrastructureConfig } from './apps/processors/unit-infrastructure-config.mjs';
import { appsProcessorsUnitInfrastructureCoreAdaptersSpec } from './apps/processors/unit-infrastructure-core-adapters-spec.mjs';
import { appsProcessorsUnitInfrastructureCoreAdapters } from './apps/processors/unit-infrastructure-core-adapters.mjs';
import { appsProcessorsUnitInfrastructureLibAdaptersSpec } from './apps/processors/unit-infrastructure-lib-adapters-spec.mjs';
import { appsProcessorsUnitInfrastructureLibAdapters } from './apps/processors/unit-infrastructure-lib-adapters.mjs';
import { appsProcessorsUnitInfrastructurePersistence } from './apps/processors/unit-infrastructure-persistence.mjs';
import { appsProcessorsUnitInfrastructureQueueSpec } from './apps/processors/unit-infrastructure-queue-spec.mjs';
import { appsProcessorsUnitInfrastructureQueue } from './apps/processors/unit-infrastructure-queue.mjs';
import { appsProcessorsUnitInfrastructure } from './apps/processors/unit-infrastructure.mjs';
import { appsProcessorsUnitModulesIndex } from './apps/processors/unit-modules-index.mjs';
import { appsProcessorsUnitOutboundPorts } from './apps/processors/unit-outbound-ports.mjs';
import { appsProcessorsUnitOutboundTokens } from './apps/processors/unit-outbound-tokens.mjs';
import { appsProcessorsUnitOutboundTypesCommands } from './apps/processors/unit-outbound-types-commands.mjs';
import { appsProcessorsUnitOutboundTypesEnums } from './apps/processors/unit-outbound-types-enums.mjs';
import { appsProcessorsUnitOutboundTypesQueries } from './apps/processors/unit-outbound-types-queries.mjs';
import { appsProcessorsUnitOutboundTypesRecords } from './apps/processors/unit-outbound-types-records.mjs';
import { appsProcessorsUnitOutboundTypesViews } from './apps/processors/unit-outbound-types-views.mjs';
import { appsProcessorsUnitOutboundTypes } from './apps/processors/unit-outbound-types.mjs';
import { appsProcessorsUnitOutbound } from './apps/processors/unit-outbound.mjs';
import { appsProcessorsUnitQueues } from './apps/processors/unit-queues.mjs';
import { appsProcessorsUnitShellModule } from './apps/processors/unit-shell-module.mjs';
import { appsProcessorsUnitShell } from './apps/processors/unit-shell.mjs';
import { appsProcessorsUnit } from './apps/processors/unit.mjs';
import { appsTest } from './apps/test/test.mjs';
import { coreContracts } from './core/contracts.mjs';
import { coreDomain } from './core/domain.mjs';
import { coreEntities } from './core/entities.mjs';
import { coreModulesUnitApplication } from './core/modules-unit-application.mjs';
import { coreModulesUnitDomain } from './core/modules-unit-domain.mjs';
import { coreModulesUnitIndex } from './core/modules-unit-index.mjs';
import { coreModulesUnitInfrastructureCache } from './core/modules-unit-infrastructure-cache.mjs';
import { coreModulesUnitInfrastructureConfig } from './core/modules-unit-infrastructure-config.mjs';
import { coreModulesUnitInfrastructureCoreAdapters } from './core/modules-unit-infrastructure-core-adapters.mjs';
import { coreModulesUnitInfrastructureLibAdapters } from './core/modules-unit-infrastructure-lib-adapters.mjs';
import { coreModulesUnitInfrastructurePersistence } from './core/modules-unit-infrastructure-persistence.mjs';
import { coreModulesUnitInfrastructureQueue } from './core/modules-unit-infrastructure-queue.mjs';
import { coreModulesUnitInfrastructure } from './core/modules-unit-infrastructure.mjs';
import { coreModulesUnitOutboundPorts } from './core/modules-unit-outbound-ports.mjs';
import { coreModulesUnitOutboundTokens } from './core/modules-unit-outbound-tokens.mjs';
import { coreModulesUnitOutboundTypesCommands } from './core/modules-unit-outbound-types-commands.mjs';
import { coreModulesUnitOutboundTypesEnums } from './core/modules-unit-outbound-types-enums.mjs';
import { coreModulesUnitOutboundTypesQueries } from './core/modules-unit-outbound-types-queries.mjs';
import { coreModulesUnitOutboundTypesRecords } from './core/modules-unit-outbound-types-records.mjs';
import { coreModulesUnitOutboundTypesViews } from './core/modules-unit-outbound-types-views.mjs';
import { coreModulesUnitOutboundTypes } from './core/modules-unit-outbound-types.mjs';
import { coreModulesUnitOutbound } from './core/modules-unit-outbound.mjs';
import { coreModulesUnitShellFacade } from './core/modules-unit-shell-facade.mjs';
import { coreModulesUnitShell } from './core/modules-unit-shell.mjs';
import { coreQueues } from './core/queues.mjs';
import { libsAppBootstrap } from './libs/app-bootstrap.mjs';
import { libsAppSetup } from './libs/app-setup.mjs';
import { libsApp } from './libs/app.mjs';
import { libsApplication } from './libs/application.mjs';
import { libsAuth } from './libs/auth.mjs';
import { libsCache } from './libs/cache.mjs';
import { libsConfig } from './libs/config.mjs';
import { libsContractsDatabase } from './libs/contracts-database.mjs';
import { libsContracts } from './libs/contracts.mjs';
import { libsCredentials } from './libs/credentials.mjs';
import { libsDatabaseOrmApplication } from './libs/database-orm-application.mjs';
import { libsDatabaseOrmShell } from './libs/database-orm-shell.mjs';
import { libsDatabaseSpec } from './libs/database-spec.mjs';
import { libsDatabase } from './libs/database.mjs';
import { libsHealth } from './libs/health.mjs';
import { libsHttp } from './libs/http.mjs';
import { libsInfrastructure } from './libs/infrastructure.mjs';
import { libs } from './libs/libs.mjs';
import { libsLocalStorage } from './libs/local-storage.mjs';
import { libsObservability } from './libs/observability.mjs';
import { libsOpenapi } from './libs/openapi.mjs';
import { libsOutbound } from './libs/outbound.mjs';
import { libsQueue } from './libs/queue.mjs';
import { libsShellSpec } from './libs/shell-spec.mjs';
import { libsShell } from './libs/shell.mjs';
import { libsTesting } from './libs/testing.mjs';
import { libsToolkitDatabase } from './libs/toolkit-database.mjs';
import { libsToolkit } from './libs/toolkit.mjs';
import { repoMigrations } from './repo/migrations.mjs';
import { repoScripts } from './repo/scripts.mjs';
import { repoSpec } from './repo/spec.mjs';
import { repoTestInfra } from './repo/test-infra.mjs';
import { repoTestSystem } from './repo/test-system.mjs';
import { rootSpec } from './root/spec.mjs';

export const layers = layersOf(import.meta.dirname, [
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
  rootSpec,
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
]);
