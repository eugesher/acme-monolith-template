export const categoriesOf = (layers) =>
  layers
    .filter((layer) => layer.pattern)
    .map(({ category, pattern, capture }) => ({ category, pattern, capture }));
