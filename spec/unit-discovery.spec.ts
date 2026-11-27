import { discoveredSpecs, discoveryViolations, repositorySpecs } from './support/unit-discovery';

describe('unit spec discovery', () => {
  it('lists the specs git holds, the tracked and the new ones', () => {
    expect(repositorySpecs()).toEqual(
      expect.arrayContaining([
        'spec/unit-discovery.spec.ts',
        'core/domain/src/email/spec/email.value.spec.ts',
      ]),
    );
  });

  it('lists the specs jest runs under the unit config', () => {
    expect(discoveredSpecs()).toEqual(
      expect.arrayContaining([
        'spec/unit-discovery.spec.ts',
        'core/domain/src/email/spec/email.value.spec.ts',
      ]),
    );
  });

  it('jest finds every spec git holds and nothing else', () => {
    expect(discoveryViolations(repositorySpecs(), discoveredSpecs())).toEqual([]);
  });

  describe('the rule itself', () => {
    it('accepts the same specs in any order', () => {
      const violations = discoveryViolations(
        ['apps/x/spec/a.spec.ts', 'libs/x/spec/b.spec.ts'],
        ['libs/x/spec/b.spec.ts', 'apps/x/spec/a.spec.ts'],
      );

      expect(violations).toEqual([]);
    });

    it('rejects a spec git holds and jest does not find', () => {
      const violations = discoveryViolations(
        ['apps/x/spec/a.spec.ts', 'tools/x/spec/b.spec.ts'],
        ['apps/x/spec/a.spec.ts'],
      );

      expect(violations).toEqual(['jest does not find tools/x/spec/b.spec.ts']);
    });

    it('rejects a spec jest finds and git does not hold', () => {
      const violations = discoveryViolations(
        ['apps/x/spec/a.spec.ts'],
        ['apps/x/spec/a.spec.ts', '.claude/worktrees/x/apps/x/spec/a.spec.ts'],
      );

      expect(violations).toEqual([
        'jest finds .claude/worktrees/x/apps/x/spec/a.spec.ts, which git does not hold',
      ]);
    });
  });
});
