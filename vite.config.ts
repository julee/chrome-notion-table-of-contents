import type { ManifestV3Export } from '@crxjs/vite-plugin';
import { crx } from '@crxjs/vite-plugin';
// import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import postcssNested from 'postcss-nested';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, PluginOption } from 'vite';
import manifest from './manifest.json';
import { version } from './package.json';

const ENABLES_VISUALIZER = getEnv<boolean>('ENABLES_VISUALIZER') ?? false;

manifest.version = version;

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';
  return {
    build: {
      target: 'ESNext', // for top level await
    },
    ...(isDevelopment ? {} : { esbuild: { drop: ['console'] } }),
    plugins: [
      // react(),
      crx({ manifest: manifest as ManifestV3Export }),
      ...(ENABLES_VISUALIZER ? [visualizer() as PluginOption] : []),
    ],
    css: {
      postcss: {
        plugins: [autoprefixer, postcssNested],
      },
    },
  };
});

// utils

function getEnv<T>(name: string): T | undefined {
  const val = process.env[name];
  return val === undefined ? val : JSON.parse(val);
}
