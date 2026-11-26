import perfectionist from 'eslint-plugin-perfectionist';

const app = '@acme-(?!(libs|core)/)[^/]+';

const sections = [
  [
    ['nestjs', '^@nestjs/'],
    ['dependencies', '^(?!@acme|\\.)'],
  ],
  [
    ['acme-libs-contracts', '^@acme-libs/contracts(/|$)'],
    ['acme-libs', '^@acme-libs/'],
    ['acme-core-contracts', '^@acme-core/contracts(/|$)'],
    ['acme-core', '^@acme-core/'],
    ['acme-app-app', `^${app}/app(/|$)`],
    ['acme-app-common', `^${app}/common(/|$)`],
    ['acme-app-contracts', `^${app}/contracts(/|$)`],
    ['acme-app-features', `^${app}/features(/|$)`],
    ['acme-app-global', `^${app}/global(/|$)`],
    ['acme-app-processors', `^${app}/processors(/|$)`],
  ],
  [
    ['relative-deep', '^(\\.\\./){2,}'],
    ['relative-parent', '^\\.\\.(/|$)'],
    ['relative-sibling', '^\\.(/|$)'],
  ],
];

const order = [
  ['nestjs', 'dependencies'],
  [
    'acme-libs',
    'acme-libs-contracts',
    'acme-core',
    'acme-core-contracts',
    'acme-app-app',
    'acme-app-common',
    'acme-app-contracts',
    'acme-app-features',
    'acme-app-global',
    'acme-app-processors',
  ],
  ['relative-deep', 'relative-parent', 'relative-sibling'],
];

const customGroups = sections.flat().flatMap(([name, pattern]) => [
  { groupName: name, elementNamePattern: pattern, modifiers: ['value'] },
  { groupName: `${name}-type`, elementNamePattern: pattern, modifiers: ['type'] },
]);

const groups = order.flatMap((section, index) => {
  const names = [...section, ...section.map((name) => `${name}-type`)];
  const inside = names.flatMap((name, position) =>
    position === 0 ? [name] : [{ newlinesBetween: 0 }, name],
  );

  return index === 0 ? inside : [{ newlinesBetween: 1 }, ...inside];
});

export const imports = {
  files: ['**/*.ts'],
  plugins: { perfectionist },
  rules: {
    'perfectionist/sort-imports': [
      'error',
      {
        type: 'alphabetical',
        ignoreCase: true,
        customGroups,
        groups: [...groups, { newlinesBetween: 1 }, 'unknown'],
        newlinesBetween: 1,
        sortSideEffects: false,
      },
    ],
    'perfectionist/sort-named-imports': [
      'error',
      {
        type: 'alphabetical',
        ignoreCase: true,
        customGroups: [
          { groupName: 'value', modifiers: ['value'] },
          { groupName: 'type', modifiers: ['type'] },
        ],
        groups: ['value', 'type'],
        newlinesBetween: 0,
      },
    ],
  },
};
