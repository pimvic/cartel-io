/**
 * Vitest Configuration
 * 
 * Configuration for unit and integration tests using Vitest.
 * Vitest is a Vite-native test runner, providing fast execution
 * and compatibility with Vite's module resolution.
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Test environment
    environment: 'jsdom',
    
    // Setup files to run before each test file
    setupFiles: ['./src/test/setup.ts'],
    
    // Global test utilities
    globals: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'dist/',
        '.lovable/',
        'src/integrations/supabase/types.ts', // Auto-generated
      ],
      // Minimum coverage thresholds
      statements: 70,
      branches: 65,
      functions: 70,
      lines: 70,
    },
    
    // Test file patterns
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.lovable', 'e2e'],
    
    // Watch mode settings
    watch: false,
    
    // Timeout for each test
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
