import { readdirSync } from 'fs';

export const layersOf = (dir, files) => {
  const present = readdirSync(dir, { recursive: true }).filter(
    (file) => file.endsWith('.mjs') && file !== 'index.mjs',
  ).length;

  if (files.length !== present) {
    throw new Error(
      `lint/boundaries: layers/index.mjs lists ${files.length} files, layers/ holds ${present}`,
    );
  }

  return files.flat();
};
