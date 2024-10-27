import globals from 'globals'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
    {
        languageOptions: { globals: globals.node }
    },
    {
        ignores: ['*.js', 'dist/**/*', 'node_modules/**/*', 'coverage/**/*']
    },
    eslintPluginUnicorn.configs['flat/recommended'],
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    eslintConfigPrettier,
    {
        rules: {
            'unicorn/no-array-reduce': 'off',
            'unicorn/numeric-separators-style': 'off',
            'unicorn/filename-case': [
                'error',
                {
                    cases: {
                        camelCase: true
                    }
                }
            ],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_'
                }
            ]
        }
    }
)
