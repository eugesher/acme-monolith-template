import boundariesPlugin from 'eslint-plugin-boundaries';
import { readdirSync } from 'fs';
import { join } from 'path';

import appMain from './layers/apps/app-main.mjs';
import appIndex from './layers/apps/app/app-index.mjs';
import appSetupConfig from './layers/apps/app/app-setup-config.mjs';
import appSetupEntities from './layers/apps/app/app-setup-entities.mjs';
import appSetupModule from './layers/apps/app/app-setup-module.mjs';
import appShellModule from './layers/apps/app/app-shell-module.mjs';
import appCommonEntity from './layers/apps/common/app-common-entity.mjs';
import appCommonModuleApplication from './layers/apps/common/app-common-module-application.mjs';
import appCommonModuleDomain from './layers/apps/common/app-common-module-domain.mjs';
import appCommonModuleIndex from './layers/apps/common/app-common-module-index.mjs';
import appCommonModuleInfrastructureCommonAdapterSpec from './layers/apps/common/app-common-module-infrastructure-common-adapter-spec.mjs';
import appCommonModuleInfrastructureCommonAdapter from './layers/apps/common/app-common-module-infrastructure-common-adapter.mjs';
import appCommonModuleInfrastructureCoreAdapterSpec from './layers/apps/common/app-common-module-infrastructure-core-adapter-spec.mjs';
import appCommonModuleInfrastructureCoreAdapter from './layers/apps/common/app-common-module-infrastructure-core-adapter.mjs';
import appCommonModuleInfrastructure from './layers/apps/common/app-common-module-infrastructure.mjs';
import appCommonModuleModuleIndex from './layers/apps/common/app-common-module-module-index.mjs';
import appCommonModuleOutboundPort from './layers/apps/common/app-common-module-outbound-port.mjs';
import appCommonModuleOutboundToken from './layers/apps/common/app-common-module-outbound-token.mjs';
import appCommonModuleOutboundTypeCommand from './layers/apps/common/app-common-module-outbound-type-command.mjs';
import appCommonModuleOutboundTypeEnum from './layers/apps/common/app-common-module-outbound-type-enum.mjs';
import appCommonModuleOutboundTypeQuery from './layers/apps/common/app-common-module-outbound-type-query.mjs';
import appCommonModuleOutboundTypeRecord from './layers/apps/common/app-common-module-outbound-type-record.mjs';
import appCommonModuleOutboundTypeView from './layers/apps/common/app-common-module-outbound-type-view.mjs';
import appCommonModuleOutboundType from './layers/apps/common/app-common-module-outbound-type.mjs';
import appCommonModuleOutbound from './layers/apps/common/app-common-module-outbound.mjs';
import appCommonModuleShellFacade from './layers/apps/common/app-common-module-shell-facade.mjs';
import appCommonModuleShell from './layers/apps/common/app-common-module-shell.mjs';
import appCommonSharedIndex from './layers/apps/common/app-common-shared-index.mjs';
import appCommonSharedModuleIndex from './layers/apps/common/app-common-shared-module-index.mjs';
import appCommonShared from './layers/apps/common/app-common-shared.mjs';
import appContract from './layers/apps/contracts/app-contract.mjs';
import appFeatureApplication from './layers/apps/features/app-feature-application.mjs';
import appFeatureDomain from './layers/apps/features/app-feature-domain.mjs';
import appFeatureIndex from './layers/apps/features/app-feature-index.mjs';
import appFeatureInfrastructureCommonAdapterSpec from './layers/apps/features/app-feature-infrastructure-common-adapter-spec.mjs';
import appFeatureInfrastructureCommonAdapter from './layers/apps/features/app-feature-infrastructure-common-adapter.mjs';
import appFeatureInfrastructureConfigSpec from './layers/apps/features/app-feature-infrastructure-config-spec.mjs';
import appFeatureInfrastructureConfig from './layers/apps/features/app-feature-infrastructure-config.mjs';
import appFeatureInfrastructureCoreAdapterSpec from './layers/apps/features/app-feature-infrastructure-core-adapter-spec.mjs';
import appFeatureInfrastructureCoreAdapter from './layers/apps/features/app-feature-infrastructure-core-adapter.mjs';
import appFeatureInfrastructureLibAdapterSpec from './layers/apps/features/app-feature-infrastructure-lib-adapter-spec.mjs';
import appFeatureInfrastructureLibAdapter from './layers/apps/features/app-feature-infrastructure-lib-adapter.mjs';
import appFeatureInfrastructureQueueSpec from './layers/apps/features/app-feature-infrastructure-queue-spec.mjs';
import appFeatureInfrastructureQueue from './layers/apps/features/app-feature-infrastructure-queue.mjs';
import appFeatureInfrastructure from './layers/apps/features/app-feature-infrastructure.mjs';
import appFeatureModuleIndex from './layers/apps/features/app-feature-module-index.mjs';
import appFeatureModule from './layers/apps/features/app-feature-module.mjs';
import appFeatureOutboundPort from './layers/apps/features/app-feature-outbound-port.mjs';
import appFeatureOutboundToken from './layers/apps/features/app-feature-outbound-token.mjs';
import appFeatureOutboundTypeCommand from './layers/apps/features/app-feature-outbound-type-command.mjs';
import appFeatureOutboundTypeEnum from './layers/apps/features/app-feature-outbound-type-enum.mjs';
import appFeatureOutboundTypeQuery from './layers/apps/features/app-feature-outbound-type-query.mjs';
import appFeatureOutboundTypeRecord from './layers/apps/features/app-feature-outbound-type-record.mjs';
import appFeatureOutboundTypeView from './layers/apps/features/app-feature-outbound-type-view.mjs';
import appFeatureOutboundType from './layers/apps/features/app-feature-outbound-type.mjs';
import appFeatureOutbound from './layers/apps/features/app-feature-outbound.mjs';
import appFeaturePresentation from './layers/apps/features/app-feature-presentation.mjs';
import appFeatureShellModule from './layers/apps/features/app-feature-shell-module.mjs';
import appFeatureShell from './layers/apps/features/app-feature-shell.mjs';
import appGlobalApplication from './layers/apps/global/app-global-application.mjs';
import appGlobalIndex from './layers/apps/global/app-global-index.mjs';
import appGlobalInfrastructureCommonAdapter from './layers/apps/global/app-global-infrastructure-common-adapter.mjs';
import appGlobalInfrastructureCoreAdapterSpec from './layers/apps/global/app-global-infrastructure-core-adapter-spec.mjs';
import appGlobalInfrastructureCoreAdapter from './layers/apps/global/app-global-infrastructure-core-adapter.mjs';
import appGlobalInfrastructureLibAdapter from './layers/apps/global/app-global-infrastructure-lib-adapter.mjs';
import appGlobalInfrastructure from './layers/apps/global/app-global-infrastructure.mjs';
import appGlobalModuleIndex from './layers/apps/global/app-global-module-index.mjs';
import appGlobalOutboundPort from './layers/apps/global/app-global-outbound-port.mjs';
import appGlobalOutboundToken from './layers/apps/global/app-global-outbound-token.mjs';
import appGlobalOutboundTypeCommand from './layers/apps/global/app-global-outbound-type-command.mjs';
import appGlobalOutboundTypeEnum from './layers/apps/global/app-global-outbound-type-enum.mjs';
import appGlobalOutboundTypeQuery from './layers/apps/global/app-global-outbound-type-query.mjs';
import appGlobalOutboundTypeRecord from './layers/apps/global/app-global-outbound-type-record.mjs';
import appGlobalOutboundTypeView from './layers/apps/global/app-global-outbound-type-view.mjs';
import appGlobalOutboundType from './layers/apps/global/app-global-outbound-type.mjs';
import appGlobalOutbound from './layers/apps/global/app-global-outbound.mjs';
import appGlobalShell from './layers/apps/global/app-global-shell.mjs';
import appProcessorApplication from './layers/apps/processors/app-processor-application.mjs';
import appProcessorDomain from './layers/apps/processors/app-processor-domain.mjs';
import appProcessorIndex from './layers/apps/processors/app-processor-index.mjs';
import appProcessorInfrastructureCommonAdapterSpec from './layers/apps/processors/app-processor-infrastructure-common-adapter-spec.mjs';
import appProcessorInfrastructureCommonAdapter from './layers/apps/processors/app-processor-infrastructure-common-adapter.mjs';
import appProcessorInfrastructureConfigSpec from './layers/apps/processors/app-processor-infrastructure-config-spec.mjs';
import appProcessorInfrastructureConfig from './layers/apps/processors/app-processor-infrastructure-config.mjs';
import appProcessorInfrastructureCoreAdapterSpec from './layers/apps/processors/app-processor-infrastructure-core-adapter-spec.mjs';
import appProcessorInfrastructureCoreAdapter from './layers/apps/processors/app-processor-infrastructure-core-adapter.mjs';
import appProcessorInfrastructureLibAdapterSpec from './layers/apps/processors/app-processor-infrastructure-lib-adapter-spec.mjs';
import appProcessorInfrastructureLibAdapter from './layers/apps/processors/app-processor-infrastructure-lib-adapter.mjs';
import appProcessorInfrastructureQueueSpec from './layers/apps/processors/app-processor-infrastructure-queue-spec.mjs';
import appProcessorInfrastructureQueue from './layers/apps/processors/app-processor-infrastructure-queue.mjs';
import appProcessorInfrastructure from './layers/apps/processors/app-processor-infrastructure.mjs';
import appProcessorModuleIndex from './layers/apps/processors/app-processor-module-index.mjs';
import appProcessorModule from './layers/apps/processors/app-processor-module.mjs';
import appProcessorOutboundPort from './layers/apps/processors/app-processor-outbound-port.mjs';
import appProcessorOutboundToken from './layers/apps/processors/app-processor-outbound-token.mjs';
import appProcessorOutboundTypeCommand from './layers/apps/processors/app-processor-outbound-type-command.mjs';
import appProcessorOutboundTypeEnum from './layers/apps/processors/app-processor-outbound-type-enum.mjs';
import appProcessorOutboundTypeQuery from './layers/apps/processors/app-processor-outbound-type-query.mjs';
import appProcessorOutboundTypeRecord from './layers/apps/processors/app-processor-outbound-type-record.mjs';
import appProcessorOutboundTypeView from './layers/apps/processors/app-processor-outbound-type-view.mjs';
import appProcessorOutboundType from './layers/apps/processors/app-processor-outbound-type.mjs';
import appProcessorOutbound from './layers/apps/processors/app-processor-outbound.mjs';
import appProcessorQueue from './layers/apps/processors/app-processor-queue.mjs';
import appProcessorShellModule from './layers/apps/processors/app-processor-shell-module.mjs';
import appProcessorShell from './layers/apps/processors/app-processor-shell.mjs';
import appTest from './layers/apps/test/app-test.mjs';
import coreContract from './layers/core/core-contract.mjs';
import coreDomain from './layers/core/core-domain.mjs';
import coreEntity from './layers/core/core-entity.mjs';
import coreModuleApplication from './layers/core/core-module-application.mjs';
import coreModuleDomain from './layers/core/core-module-domain.mjs';
import coreModuleInfrastructureConfig from './layers/core/core-module-infrastructure-config.mjs';
import coreModuleInfrastructureCoreAdapter from './layers/core/core-module-infrastructure-core-adapter.mjs';
import coreModuleInfrastructureLibAdapter from './layers/core/core-module-infrastructure-lib-adapter.mjs';
import coreModuleInfrastructureQueue from './layers/core/core-module-infrastructure-queue.mjs';
import coreModuleInfrastructure from './layers/core/core-module-infrastructure.mjs';
import coreModuleModuleIndex from './layers/core/core-module-module-index.mjs';
import coreModuleOutboundPort from './layers/core/core-module-outbound-port.mjs';
import coreModuleOutboundToken from './layers/core/core-module-outbound-token.mjs';
import coreModuleOutboundTypeCommand from './layers/core/core-module-outbound-type-command.mjs';
import coreModuleOutboundTypeEnum from './layers/core/core-module-outbound-type-enum.mjs';
import coreModuleOutboundTypeQuery from './layers/core/core-module-outbound-type-query.mjs';
import coreModuleOutboundTypeRecord from './layers/core/core-module-outbound-type-record.mjs';
import coreModuleOutboundTypeView from './layers/core/core-module-outbound-type-view.mjs';
import coreModuleOutboundType from './layers/core/core-module-outbound-type.mjs';
import coreModuleOutbound from './layers/core/core-module-outbound.mjs';
import coreModuleShellFacade from './layers/core/core-module-shell-facade.mjs';
import coreModuleShell from './layers/core/core-module-shell.mjs';
import coreQueue from './layers/core/core-queue.mjs';
import libAppBootstrap from './layers/libs/lib-app-bootstrap.mjs';
import libAppSetup from './layers/libs/lib-app-setup.mjs';
import libApp from './layers/libs/lib-app.mjs';
import libApplication from './layers/libs/lib-application.mjs';
import libAuth from './layers/libs/lib-auth.mjs';
import libCache from './layers/libs/lib-cache.mjs';
import libConfig from './layers/libs/lib-config.mjs';
import libContractDatabase from './layers/libs/lib-contract-database.mjs';
import libContract from './layers/libs/lib-contract.mjs';
import libCredentials from './layers/libs/lib-credentials.mjs';
import libDatabaseOrmApplication from './layers/libs/lib-database-orm-application.mjs';
import libDatabaseOrmShell from './layers/libs/lib-database-orm-shell.mjs';
import libDatabaseSpec from './layers/libs/lib-database-spec.mjs';
import libDatabase from './layers/libs/lib-database.mjs';
import libHealth from './layers/libs/lib-health.mjs';
import libHttp from './layers/libs/lib-http.mjs';
import libInfrastructure from './layers/libs/lib-infrastructure.mjs';
import libLocalStorage from './layers/libs/lib-local-storage.mjs';
import libObservability from './layers/libs/lib-observability.mjs';
import libOpenapi from './layers/libs/lib-openapi.mjs';
import libOutbound from './layers/libs/lib-outbound.mjs';
import libQueue from './layers/libs/lib-queue.mjs';
import libShellSpec from './layers/libs/lib-shell-spec.mjs';
import libShell from './layers/libs/lib-shell.mjs';
import libTesting from './layers/libs/lib-testing.mjs';
import libToolkitDatabase from './layers/libs/lib-toolkit-database.mjs';
import libToolkit from './layers/libs/lib-toolkit.mjs';
import lib from './layers/libs/lib.mjs';
import repoConfig from './layers/repo/repo-config.mjs';
import repoMigration from './layers/repo/repo-migration.mjs';
import repoScript from './layers/repo/repo-script.mjs';
import repoSpec from './layers/repo/repo-spec.mjs';
import repoTestSystem from './layers/repo/repo-test-system.mjs';
import repoTest from './layers/repo/repo-test.mjs';
import spec from './layers/repo/spec.mjs';
import { selectorsOf } from './specifiers.mjs';

const root = join(import.meta.dirname, '../..');

const files = [
  appMain,
  appGlobalIndex,
  appGlobalModuleIndex,
  appGlobalInfrastructureCoreAdapter,
  appGlobalInfrastructureCommonAdapter,
  appGlobalInfrastructureLibAdapter,
  appGlobalApplication,
  appGlobalOutboundPort,
  appGlobalOutboundToken,
  appGlobalOutboundTypeCommand,
  appGlobalOutboundTypeEnum,
  appGlobalOutboundTypeQuery,
  appGlobalOutboundTypeRecord,
  appGlobalOutboundTypeView,
  appGlobalOutboundType,
  appGlobalOutbound,
  appGlobalInfrastructure,
  appGlobalShell,
  appIndex,
  appShellModule,
  appSetupModule,
  appSetupEntities,
  appSetupConfig,
  appCommonModuleDomain,
  appCommonModuleOutboundPort,
  appCommonModuleOutboundToken,
  appCommonModuleOutboundTypeCommand,
  appCommonModuleOutboundTypeEnum,
  appCommonModuleOutboundTypeQuery,
  appCommonModuleOutboundTypeRecord,
  appCommonModuleOutboundTypeView,
  appCommonModuleOutboundType,
  appCommonModuleOutbound,
  appCommonModuleApplication,
  appCommonModuleInfrastructureCoreAdapter,
  appCommonModuleInfrastructureCommonAdapter,
  appCommonModuleInfrastructure,
  appCommonModuleShellFacade,
  appCommonModuleShell,
  appCommonModuleIndex,
  appCommonModuleModuleIndex,
  appCommonEntity,
  appContract,
  appCommonSharedIndex,
  appCommonSharedModuleIndex,
  appCommonShared,
  appTest,
  appFeatureIndex,
  appFeatureModuleIndex,
  appFeatureShellModule,
  appFeatureDomain,
  appFeatureOutboundPort,
  appFeatureOutboundToken,
  appFeatureOutboundTypeCommand,
  appFeatureOutboundTypeEnum,
  appFeatureOutboundTypeQuery,
  appFeatureOutboundTypeRecord,
  appFeatureOutboundTypeView,
  appFeatureOutboundType,
  appFeatureOutbound,
  appFeatureApplication,
  appFeatureInfrastructureCoreAdapter,
  appFeatureInfrastructureCommonAdapter,
  appFeatureInfrastructureLibAdapter,
  appFeatureInfrastructureQueue,
  appFeatureInfrastructureConfig,
  appFeatureInfrastructure,
  appFeaturePresentation,
  appFeatureShell,
  appFeatureModule,
  appProcessorIndex,
  appProcessorModuleIndex,
  appProcessorShellModule,
  appProcessorDomain,
  appProcessorOutboundPort,
  appProcessorOutboundToken,
  appProcessorOutboundTypeCommand,
  appProcessorOutboundTypeEnum,
  appProcessorOutboundTypeQuery,
  appProcessorOutboundTypeRecord,
  appProcessorOutboundTypeView,
  appProcessorOutboundType,
  appProcessorOutbound,
  appProcessorApplication,
  appProcessorInfrastructureCoreAdapter,
  appProcessorInfrastructureCommonAdapter,
  appProcessorInfrastructureLibAdapter,
  appProcessorInfrastructureQueue,
  appProcessorInfrastructureConfig,
  appProcessorInfrastructure,
  appProcessorShell,
  appProcessorQueue,
  appProcessorModule,
  coreModuleDomain,
  coreModuleOutboundPort,
  coreModuleOutboundToken,
  coreModuleOutboundTypeCommand,
  coreModuleOutboundTypeEnum,
  coreModuleOutboundTypeQuery,
  coreModuleOutboundTypeRecord,
  coreModuleOutboundTypeView,
  coreModuleOutboundType,
  coreModuleOutbound,
  coreModuleApplication,
  coreModuleInfrastructureQueue,
  coreModuleInfrastructureConfig,
  coreModuleInfrastructureCoreAdapter,
  coreModuleInfrastructureLibAdapter,
  coreModuleInfrastructure,
  coreModuleShellFacade,
  coreModuleShell,
  coreModuleModuleIndex,
  coreContract,
  coreDomain,
  coreEntity,
  coreQueue,
  libContract,
  lib,
  repoSpec,
  repoScript,
  repoMigration,
  repoTestSystem,
  repoTest,
  repoConfig,
  appGlobalInfrastructureCoreAdapterSpec,
  appFeatureInfrastructureCoreAdapterSpec,
  appFeatureInfrastructureCommonAdapterSpec,
  appFeatureInfrastructureLibAdapterSpec,
  appFeatureInfrastructureQueueSpec,
  appFeatureInfrastructureConfigSpec,
  appProcessorInfrastructureCoreAdapterSpec,
  appProcessorInfrastructureCommonAdapterSpec,
  appProcessorInfrastructureLibAdapterSpec,
  appProcessorInfrastructureQueueSpec,
  appProcessorInfrastructureConfigSpec,
  appCommonModuleInfrastructureCoreAdapterSpec,
  appCommonModuleInfrastructureCommonAdapterSpec,
  libContractDatabase,
  libApp,
  libAuth,
  libCache,
  libConfig,
  libCredentials,
  libDatabase,
  libHealth,
  libHttp,
  libLocalStorage,
  libObservability,
  libOpenapi,
  libQueue,
  libTesting,
  libAppSetup,
  libAppBootstrap,
  spec,
  libDatabaseSpec,
  libToolkit,
  libToolkitDatabase,
  libShell,
  libApplication,
  libInfrastructure,
  libOutbound,
  libShellSpec,
  libDatabaseOrmShell,
  libDatabaseOrmApplication,
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
