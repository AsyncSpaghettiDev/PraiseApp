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
  ],
}
