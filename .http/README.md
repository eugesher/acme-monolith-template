# HTTP requests

Two [Posting](https://posting.sh) collections for checking the apps by hand, one per app:

```bash
posting --collection .http/staff-app --env .http/dev.env
```

```bash
posting --collection .http/customer-app --env .http/dev.env
```

Script paths in the requests are relative to the collection root, so the root must be
`.http/staff-app` or `.http/customer-app` itself.

## What is inside

One request per e2e case of the app. The folder is the endpoint, the number in the file name is the
order of the case in the e2e. The first line of a description is the full name of the e2e test, so
the test can be found in `apps/<app>/test`, or in `libs/testing/src/e2e/health.e2e.ts` for the
health cases every app shares.

Ten e2e cases have no request:

- the route table of staff-app and of customer-app reads the mounted routes and the access of each
  from the controllers;
- the schema check of staff-app compares the migrated database with the entities;
- the ledger case of staff-app enqueues one record twice through `LEDGER_CORE_PORT` inside the app;
- the `queue` cases of staff-app that page, retry and delete a failed job, and the one that retries
  a delayed job: the e2e makes the job through BullMQ, and no route of an app makes one;
- the auth limit of each app sends logins from one address until the limit is spent and one more
  from another address; `auth/login/02-wrong-password` sent more than `THROTTLE_AUTH_LIMIT` times
  within `THROTTLE_AUTH_TTL_MS` shows the 429 with `Retry-After-auth`.

A case that sends more than one request has the file of the request it checks, and its `Before:` or
`Note:` says what else the e2e sends:

- the concurrent updates of a product send five requests at once,
  `catalog/product/update/05-concurrent` sends one;
- the replays of a restock and an order send the same request twice, as
  `staff-app/warehouse/product-stock/add/03-replay` and `customer-app/order/place/02-replay` say;
- two simultaneous orders for the last units of a product send the same request twice at once with
  two keys, as `customer-app/order/place/11-simultaneous` says;
- three simultaneous orders under one key send the same request three times at once, as
  `customer-app/order/place/13-same-key-simultaneous` says;
- two simultaneous registrations with one email send the same request twice at once, in
  `customer-app/auth/register/03-simultaneous` and `staff-app/access/user/register/03-simultaneous`;
- the sign-up of a customer goes on to log in and read `me` with the new credentials, as
  `auth/register/01-register` says;
- the soft delete of a note goes on to read the note and its revisions, as
  `staff-app/tools/note/delete/01-delete` says;
- the replacement of the tags of an order or a product sets them, replaces them and clears them, as
  `staff-app/sales/order/replace-tags/02-replace` and
  `staff-app/catalog/product/replace-tags/02-replace` say.

## Environment

The requests expect staff-app and customer-app running against the e2e infrastructure with fresh
seeds, and processor-app for the requests that read the ledger records the others enqueue:

```bash
yarn test:e2e:infra:reload
```

Start each app. `env/apps/<app>/.env` connects it to the e2e infrastructure:

```bash
yarn start:dev:staff-app
```

```bash
yarn start:dev:customer-app
```

```bash
yarn start:dev:processor-app
```

The expected result in a description holds for fresh seeds and the first run. Write requests change
the fixtures, and a second run gets another answer: for example, a second create of the same user
hits the taken email. Run `yarn test:e2e:infra:reseed` to start over.

The e2e deletes the `acme:catalog:*` keys of Redis before every catalog case of customer-app and
leaves the keys of the queues alone. When a description checks cache keys, delete those keys first.

## Tokens

Every request with authorization calls a function of `<collection>/scripts.py` in `setup`
(`as_admin`, `as_editor` and `as_viewer` for staff, `as_bob` and `as_dora` for customers, and so
on). The function signs an HS256 token of a seeded user (`sub`, `aud`, `iat`) with `JWT_SECRET` from
`env/apps/<app>/.env` and puts it into the variable `token`, as `ctx.jwt.sign` does in the e2e. This
also covers tokens that no login issues:

- the token of a disabled user (`as_disabled`, `as_dora`);
- a token with forged role claims (`as_viewer_forged_claims`);
- the token of a user of the other app (`as_customer`, `as_staff_user`);
- a token of a user of this app for the audience of the other app
  (`as_editor_for_customer_audience`, `as_ann_for_staff_audience`).

`auth/login/01-editor` of staff-app and `auth/login/01-customer` of customer-app save the token they
get into the variable `access_token`. The requests that send it say so in `Note:` or `User:`.

## Setup and cleanup

The lines `Before:` and `After:` of a description are the steps the e2e takes around the request:

- `SQL:` is a query to the e2e database (port 3307);
- `Redis:` is a command to the e2e Redis (port 6380, password `e2e-redis-password`);
- `send` names another request to send first.
