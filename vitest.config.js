import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Live tests hit a remote staging host; give each one room but never hang forever.
    testTimeout: 45_000,
    hookTimeout: 45_000,
    // Staging throttles: run files serially so we do not hammer the API.
    fileParallelism: false,
    reporters: ['verbose'],
  },
})
