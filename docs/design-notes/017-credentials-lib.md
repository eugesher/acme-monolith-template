# 017 — Credentials lib

Password hashing, token signing and token checking are used by both API apps, so they live in a lib.

The lib has the shape of `libs/health`: one port in `libs/contracts/src/credentials`,
`CREDENTIALS_PORT`, implemented by `CredentialsFacade`. The facade hands each method to a use case,
and the use cases reach the libraries through ports of the lib's own `outbound`:

| Facade method             | Use case                              | Adapter                            | Reads                                                                                                                                        |
| ------------------------- | ------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `handleSignAccessToken`   | `CredentialsSignAccessTokenUseCase`   | `CredentialsAccessTokenAdapter`    | `JWT_SECRET`, `JWT_EXPIRES_IN`, the audience of `forRoot()`                                                                                  |
| `handleVerifyAccessToken` | `CredentialsVerifyAccessTokenUseCase` | `CredentialsAccessTokenAdapter`    | `JWT_SECRET`, the audience of `forRoot()`                                                                                                    |
| `handleHashPassword`      | `CredentialsHashPasswordUseCase`      | `CredentialsPasswordHasherAdapter` | `AUTH_ARGON2_MEMORY_COST`, `AUTH_ARGON2_PARALLELISM`, `AUTH_ARGON2_TIME_COST`, `AUTH_ARGON2_MAX_CONCURRENCY`, `AUTH_ARGON2_QUEUE_TIMEOUT_MS` |
| `handleVerifyPassword`    | `CredentialsVerifyPasswordUseCase`    | `CredentialsPasswordHasherAdapter` | `AUTH_ARGON2_MAX_CONCURRENCY`, `AUTH_ARGON2_QUEUE_TIMEOUT_MS`                                                                                |

**The lib reads the config of the app it runs in.** `CredentialsModule` takes the values from
`ConfigService`, as `libs/cache` does, so the features bind no config tokens of their own, and each
app signs with its own secret.

**The signer signs the subject alone.** `signAccessToken({ sub })` passes only `sub` to the JWT
library, so a caller that hands it a wider object cannot widen the token.

**The verifier answers the subject alone.** `verifyAccessToken(token)` answers `{ sub }` of a token
that verifies with the secret, the audience and `HS256` of the app, and `null` for any other token,
so no caller reads a claim the lib did not sign.

**One module per app.** `AppModule` mounts `CredentialsModule.forRoot(audience)` once, and the
module is global: one `JwtModule` signs and verifies with one set of options, and one password
hasher serves every module of the app. Nest 12 keys a dynamic module by the object its method
returns, not by the arguments, so a lib mounted by each module that uses it would build a
`JwtModule` and a semaphore for each.

**The hasher runs a bounded number of hashes at once.** Each argon2id hash holds
`AUTH_ARGON2_MEMORY_COST` KiB, so a flood of logins from many addresses would grow the memory of the
process with every request. `CredentialsPasswordHasherAdapter` runs `hash` and `verify` through
`CredentialsPasswordHasherSemaphore`: at most `AUTH_ARGON2_MAX_CONCURRENCY` at a time, the others
wait in order. A call that waits longer than `AUTH_ARGON2_QUEUE_TIMEOUT_MS` leaves the queue with a
`ServiceUnavailableException`, a `503` that the shared `HttpExceptionFilter` logs as an error. The
semaphore lives in the adapter of the one module, so every caller of the lib shares one per process:
login, registration and the users that staff-app creates.

**A missing hash is checked against a dummy one.** `verify` takes `passwordHash: null` for a user
that does not exist. The adapter hashes a fixed dummy password with the same `AUTH_ARGON2_*` costs
when it is built and verifies the password against that hash, through the semaphore like any other
check, and answers `false` whatever the result. The caller pays one argon2id either way, so a login
for an unknown email takes as long as one with a wrong password.

**Modules reach the lib through lib adapters.** A feature or a global module declares a port of its
own (`AUTH_CREDENTIALS_PORT`, `AUTH_GLOBAL_CREDENTIALS_PORT`) and implements it in
`infrastructure/lib-adapters` on top of `CREDENTIALS_PORT`, so no module imports `argon2` or
`@nestjs/jwt` and the application never sees the lib. Examples:
`apps/customer-app/src/features/auth/infrastructure/lib-adapters/auth-credentials-lib.adapter.ts`,
`apps/customer-app/src/global/auth/infrastructure/lib-adapters/auth-global-credentials-lib.adapter.ts`.
The guard of `libs/auth` does not take the lib, since a lib takes only its own contract: it hands
the bearer token to `AUTH_USER_VALIDATOR_PORT`, and the global module of the app verifies it here
(see `002-global-auth-guards.md`).

## One model per module over one table

Modules that read the same table keep models of their own, narrowed to what each uses (see
`024-code-placement.md`). Example: `UserStaffUserCandidateModel`
(`apps/staff-app/src/features/access/modules/user/domain/models`), `AuthStaffUserLoginModel`
(`apps/staff-app/src/features/auth/domain/models`) and `AuthCommonSubjectModel`
(`apps/staff-app/src/common/modules/auth/domain/models`) all map `staff_user`.

## A common module for the staff subject

staff-app checks the subject of every request in its guard and answers it at `GET /auth/me`, so the
check lives in the common module `apps/staff-app/src/common/modules/auth` behind `AUTH_COMMON_PORT`
(`apps/staff-app/src/contracts/auth`): `handleFindSubject` for both. The `auth` feature reaches it
through `AuthIdentityCommonAdapter`, the global module through `AuthGlobalSubjectCommonAdapter`. No
other app asks for the staff: processor-app has no routes for people (see `023-processor-app.md`),
so the module and the staff entities stay in staff-app (see `024-code-placement.md`). Only staff-app
signs the staff in: its `auth` feature checks the password and signs the token behind
`AuthCredentialsLibAdapter`. No common or core module reaches the credentials.

## Table naming

Tables of one module share a prefix, and indexes and foreign keys repeat the table name, so a
constraint error in a log points at the module at once. A prefix also avoids reserved words such as
`user`. Examples: the entities of `apps/staff-app/src/common/entities/identity/`.
