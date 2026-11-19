# 039 — API surface

The three apps answer one HTTP contract: the method of a route says what it does, an id is a string
of digits, a header is parsed and described in one place, and every error answers one body that the
OpenAPI document lists.

| Part              | Example                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------- |
| methods           | `apps/staff-app/src/features/catalog/modules/product/presentation/controllers/product.controller.ts` |
| ids               | `@IsEntityId` in `libs/http/src/validation/decorators/is-entity-id.decorator.ts`                     |
| headers           | `libs/http/src/concurrency`, `libs/http/src/idempotency`                                             |
| error body        | `ErrorResponseDto` and `HttpExceptionFilter` in `libs/http`                                          |
| error codes       | `<Context>ExceptionCodeEnum` in `domain/enums`, the `STATUS` of the filter of the module             |
| errors in OpenAPI | `@ApiErrorResponses` in `libs/http`, `ApiReference.setup` in `libs/openapi`                          |

## Methods

| Method   | What it means                                     | Example                                                    |
| -------- | ------------------------------------------------- | ---------------------------------------------------------- |
| `PATCH`  | the fields of the body change, every one optional | `PATCH /catalog/products/:productId` with `{ name }`       |
| `PUT`    | the body replaces a whole set                     | `PUT /catalog/products/:productId/tags` with `{ tagIds }`  |
| `POST`   | an action of the resource runs                    | `POST /catalog/products/:productId/publish`, `.../archive` |
| `DELETE` | the resource goes                                 | `DELETE /tools/notes/:noteId`                              |

**A change of state is an action, not a field.** Publishing a product, archiving it, resolving a
note and returning a failed job to its queue each check a rule, write the ledger or the log, and
have no body, so each is a `POST` on a sub-resource named by its verb, the custom method of Google
AIP-136 and the actions of the Stripe API. `PUT` would promise to replace the resource with its
body, and RFC 9110 lets a client or a proxy repeat an idempotent request on its own: a repeated
retry of a job would spend one more attempt. An action that answers the resource answers 200, not
201, because it creates nothing addressable; the restock of `product-stock` answers the stock it
leaves, so it is 200 too. An action without an answer, the retry of a job, answers 204.

## Ids and instants

**Ids of `bigint unsigned` are strings** from the row to the response, because they may exceed the
safe integer range of a JavaScript number. Instants are ISO strings in UTC. `@IsEntityId` of
`libs/http` checks an id of the path, the query or the body as a positive integer of up to 20
digits, `each` for a list and `optional` for a filter, and documents it with that pattern, so the
check and the OpenAPI document share one expression.

## Headers

**A header is parsed and described in one place.** `@IfMatch()` and `@IdempotencyKey()` of
`libs/http` read their header through `IfMatchHelper.parse` and `IdempotencyKeyHelper.parse`, which
refuse a malformed value with 400 and a code of their own. `@ApiIfMatchHeader()` and
`@ApiIdempotencyKeyHeader()` describe the header with the codes and the length of the same helper,
so the parser and its description cannot drift apart. What the headers mean is in
`007-optimistic-concurrency.md` and `006-idempotency-keys.md`.

## Errors

**Every error answers one body**, `ErrorResponseDto` of `libs/http`:
`{ statusCode, code, message, details }`. The client branches on `code` alone.

| Source                                                     | `code`                                                                    | `details`                           |
| ---------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------- |
| a domain exception, through the filter of its module       | the code of the module (below)                                            | what the exception carries          |
| `StrictValidationPipe`                                     | `VALIDATION_FAILED`                                                       | `{ fields: [{ field, messages }] }` |
| a refused header (`IfMatchHelper`, `IdempotencyKeyHelper`) | `IF_MATCH_INVALID`, `IDEMPOTENCY_KEY_REQUIRED`, `IDEMPOTENCY_KEY_INVALID` | `null`                              |
| any other                                                  | the name of its status in `HttpStatus`                                    | `null`                              |

Any other is a guard (`UNAUTHORIZED`, `FORBIDDEN`), the request limit (`TOO_MANY_REQUESTS`), an
unknown route or the body parser (`NOT_FOUND`, `BAD_REQUEST`), the duplicate key (`CONFLICT`) or a
failure (`INTERNAL_SERVER_ERROR`).

The pipe names a field inside a nested object by its path, `dimensions.width`. A status that
`HttpStatus` does not name gets `HTTP_ERROR`. `details` is `null` when there is nothing to add,
never absent, like every field of a response that may be missing.

**A domain exception carries its code.** It answers a `code` of its module and may add `details`,
which `DomainException` of `libs/domain` carries for every module. The exception filter of the
module maps the code to a status (see `003-authentication.md`).

**A shared mechanism answers one code in every module.** A refused `Idempotency-Key` is
`IDEMPOTENCY_KEY_REUSED` or `IDEMPOTENT_REQUEST_IN_FLIGHT`, a stale `If-Match` is `VERSION_MISMATCH`
and a write that lost every retry is `VERSION_CONFLICT`, whichever module refuses, so a client
handles the mechanism once. The member keeps the prefix of its module,
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

## Errors in the OpenAPI document

**Every status a route refuses with has a response.** `ApiReference.setup` declares
`ErrorResponseDto` the `default` response of every operation.
`@ApiErrorResponses(<Filter>.STATUS, ...codes)` of `libs/http` adds a response for each status of
the codes the route refuses with, its codes in the description, and a 400 names `VALIDATION_FAILED`
before them. The statuses come from the public `STATUS` of the filter that answers them, so the
document cannot drift from the answer.
