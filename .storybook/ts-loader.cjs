// The kit's TypeScript modules (position.ts, numeric.ts, color.ts, index.ts),
// for Storybook's webpack, which has no loader for them. Their TypeScript is
// only types, so stripping it is all there is to do.
const ts = require('typescript');

module.exports = function tsLoader(source) {
  const { outputText, sourceMapText } = ts.transpileModule(source, {
    fileName: this.resourcePath,
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
      sourceMap: true,
    },
  });
  this.callback(null, outputText, sourceMapText && JSON.parse(sourceMapText));
};
