import { build } from 'esbuild';

const isDev = process.argv.includes('--dev');

await build({
  entryPoints: ['electron/main.ts', 'electron/preload.ts'],
  bundle: true,
  platform: 'node',
  outdir: 'dist-electron',
  outExtension: { '.js': '.cjs' },
  external: ['electron'],
  sourcemap: isDev,
  minify: !isDev,
  format: 'cjs',
});
