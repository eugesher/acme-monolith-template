# 024 — Code placement

Code lives as close to its callers as it can. A method of a facade decides where its code goes:

| A facade method is called by                         | Its code lives in                                    |
| ---------------------------------------------------- | ---------------------------------------------------- |
| two or more apps                                     | a core module, `core/modules/src/<m>`                |
| two or more modules of one app                       | a common module, `apps/<app>/src/common/modules/<m>` |
| one module (a feature, a processor, a global module) | that module, behind a port of its own                |

The rule counts callers per method, not per module. A core module whose every method serves two apps
stays in core; a method of it that one app calls moves into that app, and the rest stays.

## What lives where

| Module               | Methods                                               | Callers                                                                                  |
| -------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| core `idempotency`   | `handleClaim`, `handleComplete`, `handleRelease`      | staff `product-stock`, customer `order`                                                  |
| core `product`       | `handleArchive`                                       | staff `product`, the processor `product-stock`                                           |
| core `product-stock` | `handleLock`, `handleMove`                            | staff `product-stock`, customer `order`, `handleLock` also the processor `product-stock` |
| common `auth`        | `handleFindSubject`                                   | `app/global/auth` of staff-app, staff `auth`                                             |
| common `tag`         | `handleFind`, `handleReplace`, `handleFindSubjectIds` | staff `product`, staff `order`                                                           |

Everything else sits with its only caller, for example:

| Code                                                 | Lives in                                        |
| ---------------------------------------------------- | ----------------------------------------------- |
| the append to `ledger_entry`                         | `apps/processor-app/src/processors/ledger`      |
| the read of `ledger_entry`                           | `apps/staff-app/src/features/ledger`            |
| the delete of expired idempotency keys               | `apps/processor-app/src/processors/idempotency` |
| the password check and the token of a customer login | `apps/customer-app/src/features/auth`           |
| the password check and the token of a staff login    | `apps/staff-app/src/features/auth`              |
| the create, list, rename and delete of tags          | `apps/staff-app/src/features/tools/modules/tag` |

## Why per method

**A shared module is a contract between its callers.** Every method on its facade is one more thing
two teams must agree on before it changes. A method with one caller has nobody to agree with, so a
facade around it only adds a port, a facade and an adapter between the caller and its own code.

**Moving down is cheap, moving up is a decision.** When a second caller appears, the code moves up
one level and gets a facade. Until then it stays with the caller, where its tests and its changes
are.

## Copies over shared internals

**Each module keeps its own model**, narrowed to what it uses, even over one table (see
`017-credentials-lib.md`). A shared model would be a facade method in disguise: a change for one
caller would ripple into the others. The copies share the table, the kernel enums and the value
objects of `core/domain`, nothing else.

**A value object is shared, a model is not.** A model narrows a table to what one caller uses, while
a value object such as `EmailValue` carries one rule that every module applies the same way, so
`core/domain` holds it once and each module refuses in its own words (see `038-domain-models.md`).

**The names say where a symbol lives.** A symbol of a common module carries `Common`
(`AuthCommonModule`, `TAG_COMMON_PORT`), a symbol of a core module carries `Core`
(`LedgerCoreModule`, `LEDGER_CORE_PORT`), and a feature symbol carries neither. A feature and a
common or core module may share a name, and the infix keeps them apart.

## Global modules have layers too

When a global module (`app/global/<m>`) owns logic, it gets `application/` and `outbound/` like a
feature: the facade calls a use case, and the use case calls ports of its outbound, implemented by a
repository in `infrastructure/persistence` or by an adapter in `infrastructure/common-adapters` or
`infrastructure/lib-adapters`. The lint categories `acme-app:app:global:application` and
`acme-app:app:global:outbound` cover them (see `016-lint-allowlists.md`).
