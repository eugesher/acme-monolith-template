const declarator = 'VariableDeclarator[id.type="Identifier"]:not([id.typeAnnotation])';
const callResult = '[init.type=/^(CallExpression|AwaitExpression)$/]';
const inferredCallee = ':not([init.callee.name=/^(Symbol|createParamDecorator)$/])';

export const moduleConstTypeSelectors = [
  {
    selector: `:matches(Program, ExportNamedDeclaration) > VariableDeclaration[kind="const"] > ${declarator}${callResult}${inferredCallee}`,
    message: 'state the type of a module-level const that holds a call result',
  },
];
