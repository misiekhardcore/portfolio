import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import json from '@eslint/json';
import css from '@eslint/css';
import { defineConfig } from 'eslint/config';

import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js, prettier, tseslint, pluginReact },
    extends: ['js/recommended'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.jest },
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    ...pluginReact.configs.flat.recommended,
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: ['css/recommended'],
    rules: {
      'css/font-family-fallbacks': 'off',
      'css/no-invalid-at-rules': 'off',
      'css/no-invalid-properties': 'off',
    },
  },
  {
    ignores: [
      '**/vitest.config.js',
      '**/next.config.js',
      '**/prettier.config.js',
      'package-lock.json',
      'next-env.d.ts',
      '.next',
      '.yarn',
      '.swc',
      '.pi',
      '.forge',
      'node_modules',
      'test-results',
    ],
  },
]);
