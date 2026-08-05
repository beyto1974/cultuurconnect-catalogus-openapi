import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Live tests hit a remote staging host; give each one room but never hang forever.
    testTimeout: 45_000,
    hookTimeout: 45_000,
    // Staging throttles: run files serially so we do not hammer the API.
    fileParallelism: false,
    reporters: ['verbose'],
    coverage: {
      provider: 'v8',
      // The deliverable is openapi.json, not application code — the only executable
      // source here is the two helper modules the suites are built on, so coverage is
      // scoped to those rather than reporting a meaningless 0% over the spec.
      include: ['test/helpers.js', 'test/xml-model.js'],
      // These modules live under test/, which vitest's default excludes would drop —
      // clear the excludes and let `include` be the only filter.
      exclude: [],
      all: true,
      reporter: ['text-summary', 'json-summary', 'lcov'],
      reportsDirectory: 'coverage',
    },
  },
})
