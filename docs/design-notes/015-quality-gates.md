# 015 — Quality gates

Three gates stand between a change and the main branch: the git hooks on the developer's machine,
the coverage thresholds of the unit suite, and the CI workflow.

## Unit coverage

```bash
yarn test:unit:coverage
```

`jest/jest-unit.config.js` collects coverage from `apps`, `core` and `libs` and fails the run below
a threshold.

**What is not counted** is code that has no logic of its own or is covered by the e2e suites only:

| Excluded                                                                           | Why                                                                                                                   |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `index.ts`                                                                         | barrels                                                                                                               |
| `*.{port,token,enum,entity,dto,view,type,interface,const,command,query,record}.ts` | declarations                                                                                                          |
| `*.module.ts`, `apps/*/src/main.ts`                                                | wiring, booted by the e2e suites                                                                                      |
| `infrastructure/persistence/repositories/**`                                       | SQL, checked against the database by the e2e suites                                                                   |
| `infrastructure/persistence/host/**`                                               | repository getters and query builder factories                                                                        |
| `shell/*.controller.ts`                                                            | routes, guards and pipes, checked over HTTP by the e2e suites                                                         |
| `shell/*.facade.ts`                                                                | each method hands the call to a use case                                                                              |
| `libs/observability/src/tracer/index.ts`                                           | a side-effect entry: it starts the SDK with `helpers/tracer.helper.ts` and hands it to `setup/tracer-setup.module.ts` |
| `libs/openapi/src/api-reference/api-reference.ts`                                  | mounts the reference page                                                                                             |
| `libs/testing/**`, `apps/*/test/**`                                                | test code                                                                                                             |

**The threshold is 100% for every counted file**, for statements, branches, functions and lines. The
exclusions above take out what has no logic or belongs to the e2e suites, so a line below 100% is
either untested or dead, and either way the change is not done. No line is taken out with an
`istanbul ignore` comment.

**The key is per file, not global.** A global threshold measures the whole tree: with about 4,000
statements, 95% lets 200 of them go untested, and a new adapter or helper without any spec barely
moves the number. A per-file key fails on the file that lost its spec and names it in the report.
Jest checks every file matched by `./{apps,core,libs}/**/*.ts` against it, and `collectCoverageFrom`
decides which files are counted, including those no spec loads, which count at 0%.

**Some specs the coverage cannot ask for.** A DTO is covered the moment any file imports it, since
its decorators run on import, yet only a spec checks its validation, and only the table of the e2e
suite that a route validates with it (see `014-e2e-suites.md`). A module is excluded above, yet the
module in `shell/` of a lib configures a driver or a client that no e2e case reads the options of.
`spec/required-specs.spec.ts` asks for a spec next to every request, query and param DTO that
declares validation of its own and next to every module in `shell/` of a lib; a DTO that only
extends `PageQueryDto` declares none and inherits the spec of its parent. The same spec refuses a
spec of a controller or a facade: both only hand a command to a use case, and
`spec/e2e-endpoints.spec.ts` asks the e2e suites for a case of every route handler instead (see
`040-unit-specs.md`).

**ts-jest compiles the unit suite with type information** (`isolatedModules: false`). With
`emitDecoratorMetadata`, a file compiled on its own cannot tell whether a constructor parameter type
is a class, so it guards the reference: `typeof X === "undefined" ? Object : X`. Istanbul counts
that guard as a branch no test can take, and a use case with an injected service lands at 75% of
branches with 100% of lines. With the whole program the compiler knows `X` is a class and emits it
as is. The e2e configs keep the faster per-file compile: they collect no coverage.

**TS151002 is silenced on purpose.** ts-jest warns that a `nodenext` module needs
`isolatedModules: true`; the per-file compile is exactly what loses the classes above.

## Git hooks

[husky](https://typicode.github.io/husky/) installs the hooks of `.husky/` on `yarn install`:

| Hook         | Runs                                                                                                                                                                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pre-commit` | `yarn lint`: `pretty-quick --staged` formats every staged file Prettier knows, then `lint-staged` runs `eslint --cache --fix` on the staged `*.ts` files, and the whole `yarn lint:all` when `eslint.config.mjs`, `lint/**/*.mjs`, `tsconfig.json` or `package.json` is staged |
| `pre-push`   | `yarn typecheck`                                                                                                                                                                                                                                                               |

`yarn lint` checks the staged files only; `yarn lint:all` checks the whole tree, as CI does. A
change to the lint config or the aliases can break files that are not staged, so it runs the
whole-tree lint.

**The hooks are installed by `postinstall`, not `prepare`.** Yarn 4 does not run `prepare` on
install. The script is `husky || true`: the production install of the `Dockerfile` drops dev
dependencies, and without the `husky` binary the install would fail.

## CI

`.github/workflows/ci.yml` runs on every push, one job after another:

```text
lint → typecheck → build → unit → e2e
```

- `lint` runs `yarn lint:all` and `yarn format:check`, which checks every file Prettier knows
  outside `.gitignore`;
- `unit` runs `yarn test:unit:coverage`: CI is where the thresholds are enforced, no hook runs them;
- `e2e` runs `yarn test:e2e`, the command of a local run: it starts `test/infra` with
  `test:e2e:infra:reload` and runs the three app suites, then the two system suites, each after a
  reseed, as `014-e2e-suites.md` requires. The step fails if one suite failed, and the report at the
  end of its log names the suite. The compose file and the suites read the `.env.test` files of the
  repository.

Node is the latest 26, and Yarn comes from `packageManager` through Corepack, which Node 26 no
longer ships: every job installs a pinned `corepack` with npm before `corepack enable`, as the
`Dockerfile` does.

## Order the lint keeps

`eslint-plugin-perfectionist` keeps the order of imports, exports, class members and module keys,
one rule per file of `lint/configs`, so the order is fixed by `eslint --fix` and never argued in a
review.

**Line width has two limits.** Prettier wraps at `printWidth` 100, and `max-len` of `style.mjs`
fails a line over 150. An import of one name is never wrapped by Prettier, so the path decides its
length: a host importing its builder or a spec importing its subject can run past 100 under the
naming of `029-naming.md`, and stays within the limit of the lint.

**Imports** (`imports.mjs`, `sort-imports`) come in three blocks, separated by one blank line:

1. `@nestjs/*`, then the other packages;
2. the aliases of the repository: the libs, the lib contracts, the core, the core contracts, then
   the `app`, `common`, `contracts`, `features`, `global` and `processors` of an app;
3. relative imports: two levels up and more, one level up, the same folder.

Within a block the groups follow each other without a blank line, and a group's `import type` comes
after all the value imports of its block. Names are sorted alphabetically, case ignored.
`sort-named-imports` puts the `type` specifiers of one import after its values.

**Exports** (`exports.mjs`, `sort-exports`) of a barrel are sorted alphabetically within each run of
lines; a blank line starts a new run. A barrel groups its lines by the first folder of the path,
`persistence/repositories/*` and `persistence/transaction/*` in one run, one blank line between the
runs. A barrel that lists the modules of an area, `features`, `processors`, `common/modules`,
`common/shared`, `features/<group>/modules` and the barrels of the e2e suites, has one folder per
line and no blank line, so lint keeps the whole list in order. Lint sorts a run; the grouping is the
convention.

**Class members** (`classes.mjs`, `sort-classes`) go by kind and accessibility, not by name
(`type: 'unsorted'`):

1. fields and accessors: public, protected, then private; in each, static fields, then decorated
   instance fields, then plain ones; among static and among plain fields, the `readonly` ones come
   last;
2. the static block, then the constructor;
3. methods: public, protected, then private, static before instance in each.

Groups are separated by one blank line. Static fields and plain instance fields stand together
without one, the `readonly` ones included. A decorated field of a DTO or an entity spans several
lines, so decorated fields and the members of a getter or method group are separated by one. The
rule tells the two kinds of field apart by the decorator, not by the number of lines. The order
inside a group is free; the methods of a domain model take the order their use case calls them in
(see `038-domain-models.md`).

**Module keys** (`modules.mjs`, `sort-objects`) go `module`, `global`, `imports`, `exports`,
`controllers`, `providers`: what the module takes and shows comes before how it is built. The rule
applies to an object whose keys are all among these six, the argument of `@Module` and the object a
`forRoot` returns alike, and leaves every other object as it is written.

## TypeScript rules

`lint/configs/typescript.mjs` lays `typescript-eslint`'s `strictTypeChecked` and
`stylisticTypeChecked` over every `*.ts` file. Four rules are loosened for the shapes the template
uses on purpose:

- `no-extraneous-class` allows a decorated class, such as an empty `@Module`, and a class of static
  members only, such as a helper; specs also allow an empty class, the fake entity of a repository
  test;
- `restrict-template-expressions` allows a number, as in an exception message;
- `no-confusing-void-expression` allows an arrow shorthand, as in `expect(() => model.assert())`;
- `no-invalid-void-type` allows `this: void` on a static method passed as a callback.

`naming-convention` names three kinds: an interface is `I<Name>`, an enum `<Name>Enum`, and a
`static readonly` property of a class is UPPER_CASE, as `NAME`, `STATUS`, `MAX_PAGE` and the
`PROVIDER` of an adapter (see `031-static-provider.md`): a constant of a class reads as a constant
wherever it is used.

A spec asserts that a `void` method resolves with `await expect(call).resolves.toBeUndefined()`, not
by keeping its result. Where a declared type is narrower than the runtime value, such as the CLS id,
`PinoLogger.root` before the logger starts or `JSON.stringify(undefined)`, the value is widened with
`as Maybe<…>`: an annotated `const` is narrowed back by its initializer, and
`no-unnecessary-condition` would then flag the check.

## Test rules

`lint/configs/specs.mjs` lays `eslint-plugin-jest`'s `flat/recommended` over every spec, e2e spec
and e2e helper. Its warnings are errors here: `expect-expect`, `no-commented-out-tests` and
`no-disabled-tests` would otherwise pass the pre-commit hook and fail only `lint:all` in CI. Jest
itself runs a focused or skipped test without a complaint, so `no-focused-tests` and
`no-disabled-tests` are what keep an `it.only` or an `it.skip` out of the main branch.

- `jest/unbound-method` replaces `@typescript-eslint/unbound-method` in specs: it lets
  `expect(port.method).toHaveBeenCalledWith(…)` through and still flags a method taken off its
  object, so a typed mock is asserted where it lives.
- `valid-expect` knows the asynchronous matchers of `spec/support/lint.ts` (`toBreakRule`,
  `toPassArchitectureLint`): an architecture case that does not `await` one would pass before the
  lint ran. `toResolve` is synchronous and stays out of the list.

`lint/configs/e2e.mjs` adapts three rules to the shape of the e2e suites (see `014-e2e-suites.md`):
`no-export` is off, because a section file exports the `execute()` that mounts its `describe`s; the
root `afterEach` that fails a case on a root warning counts as a test block for
`no-standalone-expect`; and the `.expect(status)` of a supertest chain counts as an assertion for
`expect-expect`.

## Type imports

`lint/configs/type-imports.mjs` marks every import that has no runtime use. An import of types only
is `import type { … }`, enforced by `no-import-type-side-effects`; a mixed import marks each type
inline. `consistent-type-imports` checks this, but with `emitDecoratorMetadata` it skips every file
with a decorator, because a class in a decorated constructor is read at runtime by Nest. The rule
`acme/type-imports-in-decorated-files` (`lint/rules`) covers those files: it asks the type checker
whether the imported symbol has a value, so an interface or a type alias takes `type`. A class takes
`type` too when every use of it is a type that no decorator metadata reads: Nest reads the metadata
of a constructor parameter only when the parameter names no token, so a class behind
`@Inject(<token>)`, `@InjectPinoLogger`, `@InjectQueue` or `@InjectRepository` is a type, as
`PinoLogger` in every use case. A class in a constructor parameter without a token, in a decorated
property or in the signature of a decorated method stays a value import: DI, Swagger,
`ValidationPipe` and TypeORM read it there.

## Module-level const types

A module-level `const` that holds a call result states its type: the call hides what it returns, as
`ConfigValueProvider.provide` hides `FactoryProvider<number>` and `BullSetupModule.registerQueue`
hides `DynamicModule`. The selector of `lint/syntax/module-const-type.selectors.mjs` reports a
`const` at the top of a module, exported or not, whose initializer is a call or an `await` and whose
name has no type. The source config, the specs and the plain node scripts carry it, since each of
them sets its own `no-restricted-syntax`.

The type stays inferred where the initializer shows it: a literal, an array or object literal, a
`new` expression, an arrow function with a typed signature, a cast with `as`, a destructured name. A
`const` inside a function is inferred too. Two calls are exempt: `Symbol(…)` gives a token the type
`unique symbol`, which an annotation would widen to `symbol`, and `createParamDecorator(…)` answers
the signature of a Nest parameter decorator, which an annotation would only copy. The entity list of
`app/setup/entities` is an array literal, yet it states `TypeOrmModuleOptions['entities']`, the type
of the options it is passed into; it is the one file of `app/` that takes `@nestjs/typeorm`.
