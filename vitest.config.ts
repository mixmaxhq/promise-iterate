import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    clearMocks: true,
    coverage: {
      provider: 'v8',
      include: ['**/*.[tj]s'],
      exclude: ['node_modules', 'dist', 'vitest.config.ts', '.huskyrc.js'],
    },
  },
});
