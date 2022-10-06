module.exports = {
  root: true,
  env: {
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    indent: ['error', 2, { "SwitchCase": 1 }],
    semi: ['error', 'always'],
    quotes: ['warn', 'single'],
  },
};
