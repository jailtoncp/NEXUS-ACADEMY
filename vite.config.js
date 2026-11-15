import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const buildId = Date.now().toString(36)

export default defineConfig({
  base: '/NEXUS-ACADEMY/',
  define: {
    __NEXUS_BUILD_ID__: JSON.stringify(buildId),
  },
  plugins: [react()],
})
