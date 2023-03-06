/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  overrides: [
    {
      files: [
        '**/__tests__/*.{cy,spec}.{js,ts,jsx,tsx}',
        'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'
      ],
      extends: ['plugin:cypress/recommended'],
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: [
            'vue/multi-word-component-names'= 'off', 
          ]
        }
      ],
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  }
}