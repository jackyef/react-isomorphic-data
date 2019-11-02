import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import visualizer from 'rollup-plugin-visualizer';
import replace from '@rollup/plugin-replace';
import { terser as minify } from 'rollup-plugin-terser';

import pkg from './package.json';

const libraryName = 'react-isomorphic-data';

export default {
  input: `src/index.ts`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: 'cjs',
      sourcemap: true,
    },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: ['react', 'react-dom', 'react-dom/server'],
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ 
      typescript: require('typescript'),
      objectHashIgnoreUnknownHack: true,
      useTsconfigDeclarationDir: true,
    }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // works like webpack define plugin
    replace({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),

    process.env.NODE_ENV === 'production' && minify({
      mangle: {
        toplevel: true,
      },
    }),

    // Resolve source maps to the original source
    sourceMaps(),

    visualizer(),
  ].filter(Boolean),
};
