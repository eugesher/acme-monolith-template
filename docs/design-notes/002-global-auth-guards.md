# 002 — Global auth guards

## Where the pieces live

| Piece                      | Location                     | Knows about                        |
| -------------------------- | ---------------------------- | ---------------------------------- |
| Guards, route decorators   | `libs/auth`                  | the request, the two ports below   |
| Validator and claims ports | `libs/contracts/src/auth`    | kernel enums only                  |
| Port implementations       | `apps/<app>/src/global/auth` | the token and the users of the app |

**The lib guards, the app decides who the user is.** `libs/auth` never reads a table and never
verifies a token: it takes the bearer token off the request and hands it to
`AUTH_USER_VALIDATOR_PORT`. Each app binds that port in its global `AuthGlobalModule`, which has the
layers of a feature (see `024-code-placement.md`): every facade method calls a use case, and the use
case reaches the token and the data through outbound ports. It verifies the token through
`AUTH_GLOBAL_CREDENTIALS_PORT`, which `AuthGlobalCredentialsLibAdapter` implements in
`infrastructure/lib-adapters` with `CREDENTIALS_PORT` (see `017-credentials-lib.md`), and reads the
user of its subject. A token that does not verify ends there, without a read.

| App          | The user and its permission codes                                                                                                             | Ports bound                |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| staff-app    | `AuthGlobalValidateSubjectUseCase` over `AUTH_GLOBAL_SUBJECT_PORT`, which `AuthGlobalSubjectCommonAdapter` implements with `AUTH_COMMON_PORT` | `AUTH_USER_VALIDATOR_PORT` |
| customer-app | `AuthGlobalValidateSubjectUseCase` and its repository                                                                                         | `AUTH_USER_VALIDATOR_PORT` |

The staff subject lives in the common module `apps/staff-app/src/common/modules/auth`: two modules
of staff-app ask for it, the global module for the guard and the `auth` feature for `GET /auth/me`
(see `024-code-placement.md`). One query reads the user, its roles and the codes of their
permissions; `AuthGlobalSubjectCommonAdapter` keeps the id, the email and the codes, so the roles
never reach `request.user` and the use case answers what its port answers. The customer check has
one caller, so it lives in customer-app; its repository selects the id and the email, and a global
module has no domain to rebuild them in.

The global module imports the guard modules of `libs/auth`. `AppModule` mounts it next to
`CredentialsModule.forRoot(audience)`, the one credentials module of the app, which the global
module and the features share (see `012-app-bootstrap.md`).

**Global classes carry the `AuthGlobal` prefix.** The folder stays `global/auth`, paired with the
lib contract below, but the `auth` feature owns the plain names: `AuthModule`, and
`AuthIdentityCommonAdapter` for the common adapter of its own. The prefix keeps the two apart in
imports, in stack traces and in DI errors.

**A global module implements a lib contract.** `global/auth` binds `AUTH_USER_VALIDATOR_PORT` of
`libs/contracts/src/auth` in its module root and implements it in its facade. The shell, the
common-adapters and the lib-adapters of a global module may import the contract of any lib, whatever
the name of the module, so a future `global/<name>` implements the port it needs without a new
policy.

## Two lib modules

| Module                 | Guards                | Needs                               | Imported by             |
| ---------------------- | --------------------- | ----------------------------------- | ----------------------- |
| `AuthJwtModule`        | `AuthJwtGuard`        | `AUTH_USER_VALIDATOR_PORT`          | staff-app, customer-app |
| `AuthPermissionModule` | `AuthPermissionGuard` | `permissionCodes` on `request.user` | staff-app               |

**Who the user is and what the user may do come in one answer.** `AUTH_USER_VALIDATOR_PORT.validate`
answers `{ id, email, permissionCodes? }`. staff-app fills `permissionCodes`; customer-app leaves it
out and imports `AuthJwtModule` alone. There is no roles guard and no `@Roles`: routes are gated by
permissions only, and a role is a named set of them.

**Two static modules, not a flag.** `AuthJwtModule.forRoot({ claims: true })` would hide the choice
in an argument that no lint can read. An import of `AuthPermissionModule` in the global auth module
of an app is visible. Without the permission module `@RequiresPermission` is silently ignored, so
`spec/auth-permission-module.spec.ts` fails an app that imports the decorator in `src/` while no
file of its `src/` imports `AuthPermissionModule`. The spec walks every folder of `apps/` and, like
the lint, names no app.

## Order

Each guard is one `APP_GUARD` provider, and Nest runs global guards in registration order:

1. `AuthJwtGuard` — lets a `@Public()` route through, otherwise needs an `Authorization: Bearer`
   token for which the validator answers a user: the token verifies and its subject is still active.
   Anything else is 401. It puts the user on `request.user`.
2. `AuthPermissionGuard` — `@RequiresPermission(<code>)`: 403 unless `request.user.permissionCodes`
   holds the code. The decorator takes one code.

**Authentication must come first.** The permissions guard reads `request.user`. Ahead of the JWT
guard they would see an anonymous request on every gated route and answer 403 where 401 is meant.
The `AuthGlobalModule` of staff-app imports `AuthJwtModule` before `AuthPermissionModule`, and the
spec of the permission module checks that a gated route without a token answers 401.

**Deny by default.** A route without decorators needs a token. `@Public()` is the only way out, and
it is visible in the controller. Health endpoints are public: an orchestrator probes them without
credentials. The e2e suite of each API app compares every route it mounts, with `public`, its
permission code or `authenticated`, to a table (see `014-e2e-suites.md`).

**The OpenAPI document denies by default too.** The documents of staff-app and customer-app require
the `bearer` scheme of every operation, and `@Public()` lifts it with an empty requirement
(`ApiSecurity({})`) next to its guard metadata, so the page and a generated client ask for a token
exactly where the guard does (see `012-app-bootstrap.md`). The decorator is the one source: no
controller marks its routes for the document apart from it. `@nestjs/swagger` drops an empty array
of requirements when it merges the metadata of a controller and its method, so the decorator sets
one empty requirement, which OpenAPI reads as no authentication.

## The user is re-derived

**The token names the subject and nothing else.** The `auth` feature of the app signs `{ sub }`, and
the verified payload holds `sub`, `aud`, `iat` and `exp`. Roles and permissions never travel in the
token, so there is no stale copy of them to trust or to refresh.

**Claims in the token are not trusted.** The credentials lib answers only `sub` of a token it
verifies, and the global module reads the user of that subject: id, email and, in staff-app,
permission codes. The user comes from the database on every request, so a disabled account or a
revoked permission stops working on the next call, not at token expiry. The cost is one read per
request.

**One read per request, gated or not.** The staff validator reads the user with its permission codes
in one query, so the permissions guard reads nothing. An ungated request pays for the codes too; the
price is a join, and a gated request saves its second read.

**One secret and one audience per app.** One `JwtModule` of the credentials lib signs and verifies
with `JWT_SECRET` of the app, so a token of the `auth` feature is checked with the secret it was
signed with. staff-app alone serves the staff: processor-app has no routes for people, so it has no
guards and no `JWT_SECRET` (see `023-processor-app.md`). customer-app has its own secret, so its
tokens fail the signature check in staff-app.

**The audience is code, not configuration.** `customer.id` and `staff_user.id` both count from 1, so
a secret shared by mistake would let customer 5 in as staff user 5. Each API app passes
`AuthAudienceEnum` of `libs/kernel` once, to `CredentialsModule.forRoot()` in its `AppModule`:
`staff` in staff-app, `customer` in customer-app. The token carries it as `aud`, and the lib accepts
only the audience of its app and the algorithm of `AuthTokenAlgorithmEnum` of `libs/kernel`,
`HS256`, which it and the e2e contexts sign with too. An env variable could repeat the mistake of
the secret; a constant in the module import cannot. The auth e2e of staff-app and of customer-app
sends a token signed with the secret of the app for a subject of the app but the other audience and
expects 401; `libs/credentials/src/shell/spec/credentials.module.spec.ts` checks another secret,
another audience, no audience and `HS512`.
