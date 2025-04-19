import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/invoice-helper.js',
  output: {
    file: 'dist/invoice-helper.user.js',
    format: 'iife',
    name: 'InvoiceHelper'
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    terser()
  ]
}; 