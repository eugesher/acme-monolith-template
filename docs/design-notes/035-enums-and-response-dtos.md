# 035 — Enums and response DTOs

A closed set of values is an enum, never a union of string literals. A lone literal joins the enum
it belongs to: the liveness answer is `HealthLivenessStatusEnum.OK`, a replayed claim is
`ProductStockIdempotencyOutcomeEnum.REPLAY`.

## Where an enum lives

An enum lives with the narrowest code that reads all of its values:

| Folder                                  | What it holds                                         | Example                                                                |
| --------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------- |
| `domain/enums`                          | the exception codes of a module                       | `ProductExceptionCodeEnum`                                             |
| `outbound/enums`                        | the outcomes of a port of the module                  | `ProductStatusArchiveOutcomeEnum`                                      |
| `core/contracts/src/<module>/enums`     | the outcomes and kinds a core module answers or takes | `ProductCoreArchiveOutcomeEnum`                                        |
| `apps/<app>/src/contracts/<name>/enums` | the same for a common module of the app               | `TagCommonReplaceOutcomeEnum`, `TagCommonSubjectTypeEnum`              |
| `libs/kernel`                           | a vocabulary of several layers, modules or apps       | `PermissionCodeEnum`, `ProductStatusEnum`, `HealthReadinessStatusEnum` |
| `libs/<lib>/src/enums`                  | what only the lib reads                               | `AuthMetadataKeyEnum`                                                  |

**An outcome stays with its port.** The outcome of a core module lives in its contract, not in the
kernel, because only the core-adapters read it (see `006-idempotency-keys.md` and
`027-core-module-outcomes.md`). A feature names its own outcome in `outbound/enums`, and the
core-adapter maps one into the other.

**The kernel holds what a column stores.** `ProductStatusEnum` is a column of a core entity read by
all three apps, `IdempotencyStatusEnum` a column of `idempotency_key`, `PermissionCodeEnum` a column
of `staff_role_permissions`. A role is not an enum: the names live in `staff_role`, no code branches
on one, and a new role needs no release. The health statuses are in the kernel because both the
health lib and the health features of the apps name them.

**An enum is never copied between a lib and an app.** The app imports the kernel enum the lib
answers with, so a new value reaches both at once.

## Exception codes

A domain exception answers a `code` of its module, and the exception filter of the module maps the
code to a status (see `003-authentication.md`).

**A shared mechanism answers one code in every module.** A refused `Idempotency-Key` is
`IDEMPOTENCY_KEY_REUSED` or `IDEMPOTENT_REQUEST_IN_FLIGHT` and a lost optimistic write is
`VERSION_MISMATCH`, whichever module refuses, so a client handles the mechanism once. The member
keeps the prefix of its module,
`OrderExceptionCodeEnum.ORDER_IDEMPOTENCY_KEY_REUSED = 'IDEMPOTENCY_KEY_REUSED'`, because the enum
is the list the filter of that module maps. The codes of the headers, `IDEMPOTENCY_KEY_REQUIRED`,
`IDEMPOTENCY_KEY_INVALID` and `IF_MATCH_INVALID`, carry no prefix either.

**The status says where a missing id came from.**

| The id that is not stored | Status | Example                                                                             |
| ------------------------- | ------ | ----------------------------------------------------------------------------------- |
| in the path               | 404    | `PRODUCT_NOT_FOUND`, `NOTE_NOT_FOUND`, `AUTH_USER_NOT_FOUND`                        |
| in the body               | 422    | `PRODUCT_TAG_NOT_FOUND`, `ORDER_PRODUCT_NOT_FOUND`, `AUTH_ROLE_NOT_FOUND` of `user` |

The resource of the path is what the request is about, so its absence is 404; an id in the body is a
reference inside a request the server understood, so its absence is 422. One code may take both
statuses: `AUTH_ROLE_NOT_FOUND` is 404 for the `:roleId` of `role` and 422 for the `roleIds` of
`user`, as each filter maps the codes of its own module. A product an order may not hold, a draft,
archived or deleted one, is missing for the customer too.

**A stored row that breaks a rule is a fault of the server.** `PRODUCT_VERSION_INVALID` and
`NOTE_VERSION_INVALID` refuse a stored version below 1 while the aggregate is rebuilt from its row.
No request carries that version, so the filter answers 500, not 400.

## Response DTOs

**A nested DTO is a class of the outer file and is not exported.** Only the DTO a controller returns
is exported, so a nested class cannot be reused by another response and drift with it.

| Nested DTO                   | Name                    | Example                                     |
| ---------------------------- | ----------------------- | ------------------------------------------- |
| the element of an array      | `<Container>ItemDto`    | `OrderResponseItemDto` for `orderProducts`  |
| the value of an object field | `<Container><Field>Dto` | `QueueResponseJobCountsDto` for `jobCounts` |

`<Container>` is the name of the exported DTO without `Dto`. The field suffix is taken only by the
DTO of an object field: an array has one element type, so `Item` is enough. A DTO nested in a nested
one extends the name of its container, and fields that share one class are named by what they have
in common: `HealthReadinessResponseDependenciesDto` for `dependencies`, and inside it
`HealthReadinessResponseDependencyDto` for `database` and `cache`.

A nested name is unique within its app, not across the apps: customer-app and staff-app both have an
`OrderResponseItemDto`. Each app serves its own OpenAPI document, so the schemas never meet.

**A field that may be missing is always sent, with `null`.** The type is `T | null`, and the field
is declared with `@ApiProperty({ readOnly: true, nullable: true })`, because `@ApiResponseProperty`
takes no `nullable`. The client reads one shape and never checks for an absent key.

**An enum field names its enum in the schema**: `@ApiResponseProperty({ enum, example })`, so the
OpenAPI document lists the values and the client can generate the same enum.
