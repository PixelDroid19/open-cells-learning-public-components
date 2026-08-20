import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: { dedupe: ['lit', '@open-wc/scoped-elements'] },
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1' },
  build: { target: 'es2022' },
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['test/unit/**/*.test.js'],
    setupFiles: ['test/unit/setup.js'],
    alias: {
      '@webcomponents/scoped-custom-element-registry': fileURLToPath(new URL('./test/unit/scoped-registry-polyfill.js', import.meta.url))
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'test/coverage',
      include: ['src/component-runtime.js', 'src/components/**/*.js'],
      exclude: ['src/components/**/*-define.js'],
      thresholds: { statements: 70, branches: 60, functions: 60, lines: 70 }
    }
  }
});
