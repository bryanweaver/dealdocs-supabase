import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import vueParser from 'vue-eslint-parser'

export default [
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/build/**',
      '**/coverage/**',
      '**/assets/**',
      '**/.vite/**',
      '**/.claude/**',
      'src/API.ts',
      'src/graphql/**',
      'amplify/**',
      'supabase/functions/**',
      'components.d.ts',
      'auto-imports.d.ts',
      'postcss.config.*',
      'tailwind.config.*',
      'vite.config.*',
      'playwright.config.*',
      'src/.eslintrc.cjs'
    ]
  },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: tseslint.parser
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn',
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-namespace': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      'no-empty': 'warn',
      'no-case-declarations': 'warn',
      'no-prototype-builtins': 'warn',
      'no-useless-escape': 'warn',
      'no-fallthrough': 'error',
      'no-setter-return': 'error',
      'no-undef': 'warn',
      'vue/no-unused-components': 'warn'
    }
  },
  {
    files: ['**/__tests__/**', '**/tests/**', '**/*.spec.*', '**/*.test.*', '**/scripts/**'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'no-empty': 'off',
      'no-undef': 'off'
    }
  }
]
