module.exports = {
  root: true,
  env: {
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    project: './tsconfig.json',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jest/recommended',
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
  rules: {
    'no-trailing-spaces': 'error',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-floating-promises': ['error', { ignoreIIFE: true }],
    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'jest/valid-title': 'off',
    'jest/no-conditional-expect': 'off',
  },
};
