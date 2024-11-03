import type { UserConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import VitePluginBrowserSync from 'vite-plugin-browser-sync'
import * as path from 'path'
import * as fs from 'fs'

const tsconfig_s = fs
  .readFileSync('./tsconfig.json', 'utf-8')
  .replace(/\/\/.*$/gm, '') // Remove // comments
  .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
  .trim() // Remove any extra spaces or new lines
const tsconfig = JSON.parse(tsconfig_s)
const tsconfigPathAliases = Object.fromEntries(
  Object.entries<Array<string>>(tsconfig.compilerOptions.paths).map(
    ([key, values]) => {
      let value = values[0]
      if (key.endsWith('/*')) {
        key = key.slice(0, -2)
        value = value.slice(0, -2)
      }

      const nodeModulesPrefix = 'node_modules/'
      if (value.startsWith(nodeModulesPrefix)) {
        value = value.replace(nodeModulesPrefix, '')
      } else {
        value = path.join(__dirname, value)
      }

      return [key, value]
    },
  ),
)

export default {
  root: './',
  resolve: {
    alias: tsconfigPathAliases,
    // {
    //   '@': path.resolve(__dirname, 'src'),
    // },
  },
  // publicDir: '',
  plugins: [
    legacy({
      // targets: ['defaults', 'not IE 11'], // its in browserlist option in packgae.json
    }),
    VitePluginBrowserSync(),
  ],
} satisfies UserConfig
