const namedOnly = '/^(bullmq|@nestjs\\x2Fbullmq|@nestjs\\x2Fcommon)$/';

const message = 'a policy allows this module by name, so it is imported only by named specifiers';

export const namedImportSelectors = [
  `ImportDeclaration[source.value=${namedOnly}]:not(:has(ImportSpecifier))`,
  `ImportDeclaration[source.value=${namedOnly}]:has(ImportDefaultSpecifier)`,
  `ExportAllDeclaration[source.value=${namedOnly}]`,
  `ImportExpression[source.value=${namedOnly}]`,
].map((selector) => ({ selector, message }));
