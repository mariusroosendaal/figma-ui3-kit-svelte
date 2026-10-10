import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';

export default [
  js.configs.recommended,
  ...svelte.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^\\$\\$' }],
      'no-undef': 'error',
    },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.svelte'],
      },
    },
    rules: {
      'svelte/no-unused-svelte-ignore': 'warn',
      'svelte/valid-compile': 'error',
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: { parser: tseslint.parser },
  },
  // TypeScript checks these, and knows types and globals ESLint's core rules don't
  {
    files: ['**/*.svelte', '**/*.ts'],
    rules: { 'no-unused-vars': 'off', 'no-undef': 'off' },
  },
  {
    ignores: ['node_modules/', 'storybook-static/', '*.config.js', '.storybook/'],
  },
];
