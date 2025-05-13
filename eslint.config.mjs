import { configs, defineConfig } from './tooling/eslint/index.js';

export default defineConfig(
  {
    ignores: [
      'apps/**/*',
      'packages/**/*',
      'scripts/**/*',
      '**/.contentlayer/*',
      '**/__registry__/*',
    ],
  },
  ...configs.base,
  ...configs.next,
  ...configs.prettier,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  }
);
