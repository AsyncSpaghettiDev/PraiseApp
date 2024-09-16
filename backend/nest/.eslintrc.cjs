module.exports = {
  overrides: [
    // DTO files rules
    {
      files: ['**/*.dto.ts'],
      rules: {
        indent: 'off',
      },
    },
    // Entity files rules
    {
      files: ['**/*.entity.ts'],
      rules: {
        indent: 'off',
      },
    },
    // Scripts files rules
    {
      files: ['**/*.js'],
      rules: {
        'no-console': 'off',
        'no-process-exit': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
    // Migration files rules
    {
      files: ['**/migrations/*.{ts,js}'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
}
