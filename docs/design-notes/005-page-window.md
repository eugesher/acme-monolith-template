# 005 — Page window

A paged read takes `page` and `limit`, and the use case owns the bounds.

| Part     | Example                                                                                    |
| -------- | ------------------------------------------------------------------------------------------ |
| DTO      | `PageQueryDto` in `libs/http`, `apps/staff-app/src/features/ledger/presentation/dto/`      |
| use case | `apps/staff-app/src/features/ledger/application/use-cases/ledger-list-entries.use-case.ts` |
| helper   | `PaginationHelper.clampPageWindow` in `libs/toolkit`                                       |

**The DTO checks the type, the use case the limits.** The DTO accepts positive integers through
`@IsInt()` and `@IsPositive()`, not `@Min(1)`, and the use case applies the defaults (page 1,
limit 20) and caps `page` at 1000 and `limit` at 100 with `PaginationHelper.clampPageWindow`. A
value above the cap is capped, not rejected, and the response echoes the window it used: `page` and
`limit` as applied.

**Every list query extends `PageQueryDto`.** `page` and `limit` with their decorators live once, in
`libs/http`; the query DTO of a list adds only its filters, and a list without filters extends it
with an empty body. The OpenAPI description of each field names its cap from
`PaginationHelper.MAX_PAGE` and `MAX_LIMIT`, the defaults of `clampPageWindow`, so the document and
the cap cannot drift apart.

**Every page response extends `PageResponseType(ItemDto)`.** The function of `libs/http` answers a
class with `page`, `limit`, `count`, `pageCount`, `total` and `data` of the item class, in the
manner of `PartialType` of `@nestjs/swagger`, so the response DTO of a list declares only its item:
`class ProductPageResponseDto extends PageResponseType(ProductResponseDto) {}`. The item of a page
that is not a response of its own stays a class of the file, as any nested DTO (see
`035-enums-and-response-dtos.md`).

**The helper computes the offset.** `clampPageWindow({ query, options })` takes the `page` and
`limit` of the query, here the command of the use case itself, and the defaults and caps of the
options, and answers `{ page, limit, offset }`. The query of the repository carries only `limit` and
`offset`, which the repository passes to SQL as they are, and `toPage({ data, page, limit, total })`
builds the response `{ page, limit, count, pageCount, total, data }`. The page cap keeps the offset
under 100 000: `@IsInt()` accepts `1e20`, whose offset JavaScript prints as `1e+22`, which MySQL
rejects as a syntax error. It also bounds the cache of the customer catalog, which keeps one key per
page and limit (see `020-cross-app-cache-invalidation.md`).

**A read-only module refuses nothing.** `apps/staff-app/src/features/ledger` has no domain exception
and no exception filter. Its domain holds only the read model `LedgerListEntriesModel`: `toViewData`
rebuilds each record of the page and answers its snapshot (see `038-domain-models.md`).

**Ids of `bigint unsigned` are strings** from the row to the response, because they may exceed the
safe integer range of a JavaScript number. Instants are ISO strings in UTC. `@IsEntityId` of
`libs/http` checks an id of the path, the query or the body as a positive integer of up to 20
digits, `each` for a list and `optional` for a filter, and documents it with that pattern, so the
check and the OpenAPI document share one expression.

**The app lists the entities of the modules it mounts** in `app/entities` and hands them to
`OrmModule.forRoot`, because a repository reads only an entity registered on the connection.
