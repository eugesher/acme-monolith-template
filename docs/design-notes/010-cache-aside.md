# 010 — Cache-aside

A read is cached through a port of the module; every write that makes it stale drops it after the
write.

| Part      | Example                                                                                         |
| --------- | ----------------------------------------------------------------------------------------------- |
| port      | `apps/customer-app/src/features/catalog/outbound/ports/catalog-cache.port.ts`                   |
| use case  | `apps/customer-app/src/features/catalog/application/use-cases/catalog-product-list.use-case.ts` |
| adapter   | `apps/customer-app/src/features/catalog/infrastructure/cache/catalog-cache.adapter.ts`          |
| keys      | `libs/contracts/src/cache/keys/cache-keys.ts`                                                   |
| cache lib | `libs/cache`, `CACHE_LIB_PORT` in `libs/contracts/src/cache/ports/cache-lib.port.ts`            |

## The use case computes, the port caches

```ts
cache.read({ page, limit, ttlMs: this.cacheTtlMs, compute: () => this.listPage(pageWindow) });
```

The use case has no key and no branch on a hit or a miss. The adapter has no repository: it calls
`compute` on a miss through `CACHE_LIB_PORT.handleWrap`. The repository port belongs to the use
case, so the rule of one repository per consumer holds.

**`handleWrap` already shares one computation among concurrent misses of a key**, and computes
without caching when Redis fails, so an adapter has no single-flight and no fallback of its own. It
logs nothing either: the cache lib logs its failures.

**The TTL is a token of the module**, bound to `CACHE_TTL_MS_DEFAULT` in `infrastructure/config`.
The use case injects it and passes it as `ttlMs` of the read command, and the adapter hands it to
`handleWrap` (see `030-config-values.md`).

## The cache lib

`libs/cache` has the shape of `libs/health` (see `017-credentials-lib.md`): `CacheLibFacade`
implements `CACHE_LIB_PORT` and hands each method to a use case, and the use cases reach Redis and
OpenTelemetry through two ports of the lib's own `outbound`:

| Facade method       | Use case                     | Span                |
| ------------------- | ---------------------------- | ------------------- |
| `handleGet`         | `CacheLibGetUseCase`         | `cache.get`         |
| `handleSet`         | `CacheLibSetUseCase`         | `cache.set`         |
| `handleDel`         | `CacheLibDelUseCase`         | `cache.del`         |
| `handleDelByPrefix` | `CacheLibDelByPrefixUseCase` | `cache.delByPrefix` |
| `handleWrap`        | `CacheLibWrapUseCase`        | `cache.wrap`        |

**`CacheLibStoreAdapter` is the ioredis adapter.** It holds the JSON encoding, `PX` TTLs, the `SCAN`
and `UNLINK` loop under the client's `keyPrefix`, and quits the client on shutdown.
`CacheLibRedisClientProvider` builds the client from `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`,
`REDIS_COMMAND_TIMEOUT_MS` and `REDIS_TLS_CA` (see `036-production-stack.md`).

**`CacheLibTracerAdapter` is the OpenTelemetry adapter.** A use case names the span and its
attributes, adds `cache.hit` or `cache.keys_unlinked` as it learns them, and the adapter records
them when the work settles. Single-flight, the fallbacks on a failed read or write, and their logs
stay in the use cases, so neither adapter decides what a failure means.

**The Redis commands are child spans.** `cache.wrap` reads and writes through the store, not through
`cache.get` and `cache.set`, so it opens no nested span of the lib. The auto-instrumentation of
ioredis, on in `TracerHelper`, records each command (`get`, `set`) as a child of the span the
adapter opened, because `startActiveSpan` makes it the active one while the work runs. The tracer
must start before ioredis is loaded, so `main.ts` imports `@acme-libs/observability/tracer` first.

## Invalidation after the write

Every writer drops the entry once its write has returned. The catalog is written in staff-app, so
its droppers live there and in a core module (see `020-cross-app-cache-invalidation.md`). A write
that fails or is refused drops nothing. `handleDelByPrefix` logs a failure and answers 0 instead of
throwing, so the use cases call it without a guard; a stale entry then expires on its TTL.

**Keys are versioned and prefixed** (`acme:<area>:v1:`), so one `handleDelByPrefix` drops every page
of the catalog and a change of the cached shape bumps the version instead of reading old values.

**A paged list fits only when dropping every page is cheap.** A key per page, limit and filter gives
each write as many keys to drop as there are queries; the catalog has no filter and clamps its page
window, so its keys stay few.

## Soft delete

`softDelete` sets `deleted_at`, and TypeORM adds `deleted_at IS NULL` to every find and query
builder on the entity, so a deleted row is gone for every read. Example:
`apps/staff-app/src/features/tools/modules/note/infrastructure/persistence/repositories/note-delete.repository.ts`.

**A read that must see a deleted row says so.** `withDeleted()` lifts the filter for the whole
query, the main alias and every join. The order builders call it so that the lines of an order keep
a product deleted after the order: staff `OrderPersistenceBuilder.forById` and customer
`OrderPersistenceBuilder.forOwned`. `order` has no `deleted_at`, so only the joined product is
affected. Seed product 107 is soft-deleted, and the e2e of both apps read an order that holds it.
