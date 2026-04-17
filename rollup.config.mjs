import vue from 'rollup-plugin-vue';
import esbuild from 'rollup-plugin-esbuild';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import external from 'rollup-plugin-peer-deps-external';

export default {
  input: 'src/main/Index.ts',
  output: [
    {
      file: 'dist/space-vue-client.umd.js',
      format: 'umd',
      name: 'SpaceVueClient',
      exports: 'named',
      globals: {
        vue: 'Vue',
        'jwt-decode': 'jwt_decode',
        'tiny-emitter': 'TinyEmitter',
        'socket.io-client': 'io',
        'axios': 'axios'
      }
    },
    {
      file: 'dist/space-vue-client.es.js',
      format: 'es',
      exports: 'named'
    }
  ],
  external: ['vue', 'jwt-decode', 'tiny-emitter', 'socket.io-client', 'axios'],
  plugins: [
    external(),
    vue({
      preprocessStyles: true,
      css: false,
    }),
    esbuild({
      // Incluimos archivos TS y también los virtuales de Vue
      include: /\.[jt]sx?$/, 
      exclude: /node_modules/,
      sourceMap: false,
      minify: false,
      target: 'es2015',
      loaders: {
        '.vue': 'ts', // Le decimos que trate el contenido de los .vue como TS
      },
    }),
    resolve({
      extensions: ['.ts', '.d.ts', '.js', '.vue', '.json'],
    }),
    commonjs(),
    terser()
  ]
};