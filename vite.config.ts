import { defineConfig, UserConfig } from 'vite'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'

export default defineConfig((e) => {
   const mode = e.mode

   const lib = mode === 'production' ? {
      entry: resolve('./src/lib/index.ts'),
      formats: ['es', 'cjs', 'iife'],
      name: "funio"
   } : undefined

   return {
      resolve: {
         alias: {
            '@': resolve('./src')
         }
      },
      plugins: [
         dts({ rollupTypes: true })
      ],
      build: {
         lib,
         minify: true,
         emptyOutDir: true
      },
      test: {
         include: ['./src/**/*.test.ts'],
      }
   } as UserConfig
})