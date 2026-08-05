#!/usr/bin/env node
/**
 * Generates the README badges as static SVG files under badges/.
 *
 * Deliberately self-contained: no shields.io, no gist, no CI service. The badges are
 * plain files in the repo, so they render on GitHub, in an offline clone, and in the
 * generated docs alike — and they cannot silently go stale against a third-party service.
 *
 * Run `npm run test:coverage && npm run badges`.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const badgeDir = resolve(repoRoot, 'badges')

/** Green through red, on the thresholds people expect from coverage badges. */
function colourFor(pct) {
  if (pct >= 90) return '#4c1'
  if (pct >= 75) return '#97ca00'
  if (pct >= 60) return '#dfb317'
  if (pct >= 40) return '#fe7d37'
  return '#e05d44'
}

/**
 * Approximate text width in the 11px DejaVu Sans that shields-style badges use.
 * Good enough to keep the label and value visually centred.
 */
const textWidth = (s) =>
  [...s].reduce((w, c) => w + (/[A-Z%]/.test(c) ? 7.5 : /[ilj.,:1]/.test(c) ? 3.2 : 6.4), 0)

function badge(label, value, colour) {
  const padding = 10
  const labelWidth = Math.ceil(textWidth(label) + padding * 2)
  const valueWidth = Math.ceil(textWidth(value) + padding * 2)
  const total = labelWidth + valueWidth
  const labelMid = (labelWidth / 2) * 10
  const valueMid = (labelWidth + valueWidth / 2) * 10

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${total}" height="20" role="img" aria-label="${label}: ${value}">
  <title>${label}: ${value}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r"><rect width="${total}" height="20" rx="3" fill="#fff"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${colour}"/>
    <rect width="${total}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="${labelMid}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(labelWidth - padding * 2) * 10}">${label}</text>
    <text x="${labelMid}" y="140" transform="scale(.1)" textLength="${(labelWidth - padding * 2) * 10}">${label}</text>
    <text aria-hidden="true" x="${valueMid}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(valueWidth - padding * 2) * 10}">${value}</text>
    <text x="${valueMid}" y="140" transform="scale(.1)" textLength="${(valueWidth - padding * 2) * 10}">${value}</text>
  </g>
</svg>
`
}

function readJson(path) {
  const full = resolve(repoRoot, path)
  if (!existsSync(full)) return null
  return JSON.parse(readFileSync(full, 'utf8'))
}

mkdirSync(badgeDir, { recursive: true })
const written = []

function write(name, label, value, colour) {
  writeFileSync(resolve(badgeDir, name), badge(label, value, colour))
  written.push(`${name.padEnd(22)} ${label}: ${value}`)
}

// 1. Line coverage of the helper modules the suites are built on.
const summary = readJson('coverage/coverage-summary.json')
if (summary?.total) {
  const pct = Math.round(summary.total.lines.pct * 10) / 10
  write('coverage.svg', 'coverage', `${pct}%`, colourFor(pct))
} else {
  console.warn('! coverage/coverage-summary.json missing — run `npm run test:coverage` first')
}

// 2. How much of the API surface the live suite actually calls.
const api = readJson('coverage/api-coverage.json')
if (api) {
  write('api-coverage.svg', 'API endpoints', `${api.covered}/${api.total}`, colourFor(api.pct))
  if (api.uncovered.length) console.log('  not exercised live:', api.uncovered.join(', '))
} else {
  console.warn('! coverage/api-coverage.json missing — run the live suite first')
}

// 3. Test count, taken from the run vitest just completed.
const results = readJson('coverage/test-results.json')
if (results?.numTotalTests) {
  const passed = results.numPassedTests
  const skipped = results.numPendingTests ?? 0
  const value = skipped ? `${passed} passed, ${skipped} skipped` : `${passed} passed`
  write('tests.svg', 'tests', value, results.numFailedTests ? '#e05d44' : '#4c1')
}

console.log(written.length ? 'wrote badges/\n  ' + written.join('\n  ') : 'no badges written')
