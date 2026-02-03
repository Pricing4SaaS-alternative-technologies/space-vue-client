import vue from 'rollup-plugin-vue';
import typescript from '@rollup/plugin-typescript';
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
    // PRIMERO: TypeScript debe procesar .ts
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: false,
      inlineSources: false
    }),
    // LUEGO: Vue procesa .vue (si existen)
    vue({
      css: false,
      template: {
        isProduction: true
      }
    }),
    // FINALMENTE: Resolver imports
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      mainFields: ['module', 'main']
    }),
    commonjs(),
    terser()
  ]
};