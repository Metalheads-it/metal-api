import globals from 'globals';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
    { languageOptions: { globals: globals.node }, ignores: ['*.js'] },
    eslintPluginUnicorn.configs['flat/recommended'],
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    eslintConfigPrettier,
    {
        rules: {
            'unicorn/no-array-reduce': 'off',
        },
    },
);
