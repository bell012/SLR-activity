import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier'

export default [
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettier
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        document: 'readonly',
        navigator: 'readonly',
        window: 'readonly',
        PointerEvent: 'readonly',
        console: 'readonly',
        process: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly'
      }
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto'
        }
      ]
    }
  },
  {
    files: ['**/*.vue'],
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettier
    },
    languageOptions: {
      parserOptions: {
        parser: typescriptParser,
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        console: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        window: 'readonly',
        PointerEvent: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly'
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-indent': 'off',
      'vue/html-self-closing': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto'
        }
      ]
    }
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off'
    }
  },
  {
    ignores: ['node_modules', 'dist', '.vite', '*.config.js', '*.config.ts']
  }
]
