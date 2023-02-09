import type { ManifestV3Export } from '@crxjs/vite-plugin';
import { crx } from '@crxjs/vite-plugin';
import postcssNested from 'postcss-nested';
import { defineConfig } from 'vite';
import manifest from './manifest.json';
import { version } from './package.json';

manifest.version = version;

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';
  return {
    build: {
      target: 'ESNext', // for top level await
    },
    ...(isDevelopment ? {} : { esbuild: { drop: ['console'] } }),
    plugins: [crx({ manifest: manifest as ManifestV3Export })],
    css: {
      postcss: {
        plugins: [postcssNested],
      },
    },
  };
});
