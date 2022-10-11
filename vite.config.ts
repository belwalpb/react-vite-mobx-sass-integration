import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import type { ConfigEnv } from 'vite'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv) => {
  const currentEnv = loadEnv(mode, process.cwd())
  console.log('Current Mode', command)
  console.log('Current Environment Configuration', currentEnv) //loadEnv loads the .env.[mode] environment configuration file in the root directory
  return defineConfig({
    plugins: [
      react(),
      AutoImport({
        imports: ['react', 'mobx', 'react-router-dom'],
        dts: './src/auto-imports.d.ts',
        dirs: ['src/store'],
        eslintrc: {
          enabled: true, // Default `false`
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        },
      }),
    ],
    //Base path of project deployment,
    base: currentEnv.VITE_PUBLIC_PATH,
    mode: mode,
    resolve: {
      //Alias
      alias: {
        '@': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components'),
        '@store': resolve(__dirname, './src/store'),
        '@views': resolve(__dirname, './src/views'),
        '@assets': resolve(__dirname, './src/assets'),
        '@hooks': resolve(__dirname, './src/hooks'),
      },
    },
    // Serve
    server: {
      //Custom proxy---solve cross-domain
      proxy: {
        // Option Writing
        '/api': {
          target: 'http://xxxxxx.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    css: {
      // CSS Preprocessor
      preprocessorOptions: {
        sass: {
          javascriptEnabled: true,
        },
      },
    },
    // Build
    build: {
      // outDir: `dist_${format(new Date(), 'yyyyMMdd_HHmm')}`, //Output path Add date package
      //Whether to generate source map file after build
      sourcemap: mode != 'production',

      //Package and remove printing information. To keep debugger vite3, you need to install terser separately
      // minify: 'terser',
      // terserOptions: {
      //   compress: {
      //     drop_console: true,
      //     drop_debugger: false,
      //   },
      // },
    },
  })
}
