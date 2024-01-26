module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  plugins: [
    '@typescript-eslint'
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: 'tsconfig.json'
  },
  rules: {
    // Отступы в 2 пробела
    indent: 'off',
    '@typescript-eslint/indent': ['error', 2, {
      SwitchCase: 1,
    }],

    'prefer-destructuring': 0,

    'object-curly-newline': 0,

    'import/no-cycle': 0,

    // Предупреждение о неиспользуемых переменных
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 0,

    // Точки с запятой не нужны
    semi: 0,
    '@typescript-eslint/semi': [2, 'never'],

    // Одинарные кавычки вместо двойных
    quotes: 0,
    '@typescript-eslint/quotes': [2, 'single', { avoidEscape: true }],

    'max-len': [2, {
      code: 120,
      tabWidth: 2,
      ignoreTemplateLiterals: true,
    }],

    // Предупреждения о console.log
    'no-console': 0,

    // Предупреждения о debugger
    'no-debugger': 'warn',

    // Зачастую используется
    'no-param-reassign': 0,

    // Экспорт дефолт не всегда удобен
    'import/prefer-default-export': 0,

    // Нормально не работает
    'import/extensions': 0,

    'linebreak-style': 0,

    // Больше мешает
    'import/no-extraneous-dependencies': 0,

    // Нормально не работает
    'import/no-unresolved': 0,

    // Использование короткой записи для стрелочных функций зачастую сильно увеличивает длину строки
    'arrow-body-style': 0,

    // Без грамотной настройки больше мешает, чем помогает
    'import/order': 0,

    'class-methods-use-this': 0,

    'no-restricted-syntax': 0,

    'no-await-in-loop': 0
  },
}
