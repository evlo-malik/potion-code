import base from './configs/base.js';
import next from './configs/next.js';
import prettier from './configs/prettier.js';
import react from './configs/react.js';

export { compat, defineConfig } from './utils.js';

/**
 * Note: You MUST import files using the .js extension in this entire package
 * (not only this file) otherwise ESLint will not be able to resolve the files.
 */
export const configs = {
  base,
  next,
  prettier,
  react,
};
