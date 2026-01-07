const tsParser = require('@typescript-eslint/parser');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const reactPlugin = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const globals = require('globals');
const js = require('@eslint/js');
const path = require('path');

module.exports = [
  // Base JavaScript recommended config
  js.configs.recommended,

  // Global configuration for all files
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    plugins: {
      '@typescript-eslint': typescriptEslint,
      react: reactPlugin,
      'react-hooks': reactHooks,
    },

    rules: {
      // Import sorting
      'sort-imports': [
        'error',
        {
          ignoreDeclarationSort: true,
        },
      ],

      // TypeScript rules
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-unused-vars': 'off', // Disabled in favor of @typescript-eslint/no-unused-vars

      // React rules
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Disabled rules
      'prettier/prettier': 'off',
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
    },
  },

  // TypeScript-specific configuration
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],

    languageOptions: {
      parser: tsParser,
    },

    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      'react/prop-types': 'off',
    },
  },

  // Ignore patterns
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', '*.config.js', 'webpack.*.js'],
  },
];
