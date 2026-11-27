import { selectorsOf } from './specifiers.mjs';

const fromOf = ({ category, lib, files, path }) => {
  if (path) {
    return { file: { path } };
  }

  const captured = { ...(lib ? { lib } : {}), ...(files ? { file: files } : {}) };

  return {
    file:
      Object.keys(captured).length > 0
        ? { categories: category, captured }
        : { categories: category },
  };
};

const assertDeclared = (policies, categoryNames) => {
  const dangling = [
    ...new Set(
      policies
        .flatMap(({ from, allow }) => [from.file, ...allow.map(({ to }) => to.file)])
        .filter((file) => file?.categories && !categoryNames.has(file.categories))
        .map((file) => file.categories),
    ),
  ];

  if (dangling.length > 0) {
    throw new Error(`lint/boundaries: unknown categories ${dangling.join(', ')}`);
  }
};

export const policiesOf = (layers, categories) => {
  const categoryNames = new Set(categories.map(({ category }) => category));
  const policies = layers
    .filter((layer) => layer.allow)
    .map((layer) => ({
      from: fromOf(layer),
      allow: layer.allow.flatMap((specifier) => selectorsOf(specifier, categoryNames)),
    }));

  assertDeclared(policies, categoryNames);

  return policies;
};
