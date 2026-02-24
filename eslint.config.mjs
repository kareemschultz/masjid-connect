export default [
  {
    ignores: [
      '**/.next/**',
      '**/node_modules/**',
      '**/public/sw.js',
      '**/*.ts',
      '**/*.tsx',
      '**/*.jsx',
      '**/*.d.ts',
    ],
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'off',
    },
  },
]
