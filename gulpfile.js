import { deleteAsync } from 'del';

// All paths are related to the base dir
const sources = ['lib', 'actions', 'commands', 'bin'];

/**
 * Cleans the build output assets from the packages folders
 */
export const clean = async function clean() {
  const files = sources.reduce(
    (acc, source) => [
      ...acc,
      `${source}/**/*.js`,
      `${source}/**/*.d.ts`,
      `${source}/**/*.js.map`,
      `${source}/**/*.d.ts.map`,
    ],
    [],
  );
  await deleteAsync(files);
};
