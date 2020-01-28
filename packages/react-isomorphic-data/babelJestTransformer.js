module.exports = require('babel-jest').createTransformer({
  presets: [
    [
      '@babel/preset-env',
      {
        modules: 'commonjs',
        debug: false,
      },
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: [
    'babel-plugin-macros',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-syntax-async-generators',
    '@babel/plugin-syntax-dynamic-import',
    'babel-plugin-transform-dynamic-import',
    ['@babel/plugin-transform-destructuring', { useBuiltIns: true }],
    ['@babel/plugin-transform-runtime', { helpers: false, regenerator: true }],
  ],
});
