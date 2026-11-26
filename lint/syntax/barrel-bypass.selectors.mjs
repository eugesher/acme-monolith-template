const nodes = [
  'ImportDeclaration',
  'ExportAllDeclaration',
  'ExportNamedDeclaration',
  'ImportExpression',
];

const bypasses = [
  {
    source:
      '/^\\.\\.?\\x2F(.*\\x2F)?(domain|outbound|application|infrastructure|presentation)\\x2F(?!src(\\x2F|$))./',
    message: "cross-layer imports go through the target layer's barrel (index.ts)",
  },
  {
    source:
      '/^\\.\\.?\\x2F(\\.\\.\\x2F)*(errors\\x2F(codes|exceptions)|types\\x2F[^\\x2F]+)\\x2F./',
    message: "imports from outside errors/ and types/ go through the folder's barrel (index.ts)",
  },
];

export const barrelBypassSelectors = bypasses.flatMap(({ source, message }) =>
  nodes.map((node) => ({ selector: `${node}[source.value=${source}]`, message })),
);
