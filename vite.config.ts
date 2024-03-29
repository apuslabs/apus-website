import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { theme } from 'antd';
import themeToken from './src/utils/appTheme'

const { getDesignToken } = theme;
const globalToken = getDesignToken({
  ...themeToken
});

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(),nodePolyfills({
        globals: {
            Buffer: true, // can also be 'build', 'dev', or false
        },
    }
  )],
  css: {
    preprocessorOptions:{ 
      less: {
        modifyVars: {
          ...globalToken,
          textColor: '#fff',
          pageBg: '#050319',
          headerBg: '#171438',
          commonBg: '#14112c',
          homeBg: 'rgba(29, 29, 29, 1)'
        }
      },
    },
  },
})
