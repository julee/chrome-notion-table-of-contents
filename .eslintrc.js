module.exports = {
  root: true,
  env: {
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:testing-library/react',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {},
};
