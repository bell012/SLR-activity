import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import postcsspxtoremPlugin from 'postcss-pxtorem'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    postcss: {
      plugins: [
        postcsspxtoremPlugin({
          rootValue: 37.5, // 基于 375px 设计稿，1rem = 37.5px
          propList: ['*'], // 所有属性都转换
          selectorBlackList: ['.no-rem'], // 忽略带有 .no-rem 类的元素
          exclude: /node_modules/i, // 排除 node_modules
          unitPrecision: 2 // rem 单位保留 2 位小数
        })
      ]
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as *;`
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0' // 允许局域网访问
  }
})
