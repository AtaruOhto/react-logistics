import typescript from 'rollup-plugin-typescript2';
import istanbul from 'rollup-plugin-istanbul';
import uglify from 'rollup-plugin-uglify';

export default {
  input: './lib/index.ts',
  output: [
    {
      file: './dist/index.js',
      format: 'cjs',
    },
    {
      file: './dist/index.mjs',
      format: 'es',
    },
  ],

  external: ['react', 'react-dom'],
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          module: 'es2015',
          moduleResolution: 'node',
        },
      },
    }),
  ],
};
