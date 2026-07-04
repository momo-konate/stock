import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: ['node_modules', 'dist', '.git', 'coverage'],
    coverage: {
      reporter: ['text', 'html'],
      include: ['controllers/**/*.js', 'middleware/**/*.js', 'models/**/*.js', 'schemas/**/*.js'],
      exclude: ['**/*.test.js', '**/*.spec.js'],
    },
  },
});
