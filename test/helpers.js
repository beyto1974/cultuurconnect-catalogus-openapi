import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import dotenv from 'dotenv'

const here = dirname(fileURLToPath(import.meta.url))
export const repoRoot = resolve(here, '..')
export const specPath = resolve(repoRoot, 'openapi.json')

dotenv.config({ path: resolve(repoRoot, '.env'), quiet: true })

export const TOKEN = process.env.TOKEN

/**
 * Demand the key, but only at the point a request actually needs it.
 *
 * Throwing at import time would take the structural suite down with it: that suite imports
 * this module for loadSpec/serverUrl, needs no credential, and is exactly the job that has
 * to pass on pull requests from forks — where GitHub withholds secrets by design.
 */
function requireToken() {
  if (!TOKEN) {
    throw new Error(
      'TOKEN missing from .env — the live suite needs a key. ' +
        'The structural suite (npm run test:spec) runs without one.',
    )
  }
  return TOKEN
}

/** The spec document, read fresh from disk. */
export function loadSpec() {
  return JSON.parse(readFileSync(specPath, 'utf8'))
}

/**
 * Resolve the profile-scoped server URL out of the spec itself, so the live tests
 * exercise what the spec claims rather than a hand-copied base URL.
 *
 * @param {object} spec       the parsed openapi.json
 * @param {object} [vars]     server-variable overrides, e.g. { env: '/staging', profile: 'zbb' }
 * @param {object} [server]   a specific server object (defaults to spec.servers[0])
 */
export function serverUrl(spec, vars = {}, server = spec.servers[0]) {
  return server.url.replace(/\{(\w+)\}/g, (_, name) => {
    const declared = server.variables?.[name]
    if (!declared) throw new Error(`server variable '${name}' is not declared in the spec`)
    return vars[name] ?? declared.default
  })
}

/** Base URL for the staging zbb profile — the only profile this token is entitled to. */
export function stagingBase(spec) {
  return serverUrl(spec, { env: '/staging', profile: 'zbb' })
}

/**
 * Spec paths the live suite actually exercised, for the API-coverage badge.
 * Recorded here because buildUrl is the single funnel every live request goes through.
 */
export const exercisedPaths = new Set()

/**
 * Build a request URL from a spec path template plus query params.
 * `authorization` is added automatically unless explicitly set to null.
 */
export function buildUrl(base, pathTemplate, { path = {}, query = {} } = {}) {
  requireToken()
  exercisedPaths.add(pathTemplate)
  const filled = pathTemplate.replace(/\{(\w+)\}/g, (_, name) => {
    if (!(name in path)) throw new Error(`missing path parameter '${name}' for ${pathTemplate}`)
    return path[name]
  })
  const url = new URL(base + filled)
  const params = { authorization: TOKEN, ...query }
  for (const [k, v] of Object.entries(params)) {
    if (v === null || v === undefined) continue
    for (const one of Array.isArray(v) ? v : [v]) url.searchParams.append(k, one)
  }
  return url.toString()
}

const TRANSIENT = /ECONNRESET|ETIMEDOUT|EAI_AGAIN|ENETUNREACH|UND_ERR|terminated|fetch failed/i

/**
 * Strip the API key out of anything that might be printed.
 *
 * Every request URL carries `?authorization=<key>`, so a failure message or a returned
 * `url` would otherwise put the live key into CI logs and — more damagingly — into the
 * uploaded coverage/test-results.json artifact, which is world-readable on a public
 * repository. GitHub masks registered secrets in log output but not inside artifact files.
 */
export function redact(value) {
  const text = String(value)
  // Guard the split: with no key loaded there is nothing to substitute, and
  // String.split(undefined) would not do what is meant here.
  const withoutKey = TOKEN ? text.split(TOKEN).join('YOUR_API_KEY') : text
  return withoutKey.replace(/([?&]authorization=)[^&\s]+/gi, '$1YOUR_API_KEY')
}

/**
 * fetch with a hard per-attempt timeout and one retry on transient network faults.
 * Staging occasionally resets connections; a bare failure there is not a spec defect.
 */
export async function call(url, { method = 'GET', body, headers = {}, timeoutMs = 20_000, attempts = 2 } = {}) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), timeoutMs)
    try {
      const res = await fetch(url, { method, body, headers, signal: ac.signal })
      const buf = new Uint8Array(await res.arrayBuffer())
      // Decode with ignoreBOM so the byte-order mark survives into `text`.
      // res.text() would silently strip it, hiding a quirk callers in other
      // languages do hit.
      const text = new TextDecoder('utf-8', { ignoreBOM: true }).decode(buf)
      return {
        status: res.status,
        contentType: (res.headers.get('content-type') ?? '').split(';')[0].trim(),
        text,
        bom: buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf,
        // Redacted so a test that reports this value cannot carry the key into a log
        // or an artifact. Nothing re-requests it, so the key is not needed here.
        url: redact(url),
      }
    } catch (err) {
      lastError = err
      const msg = String(err?.cause?.code ?? err?.message ?? err)
      if (attempt === attempts || !(TRANSIENT.test(msg) || err.name === 'AbortError')) break
    } finally {
      clearTimeout(timer)
    }
  }
  throw new Error(
    `request failed: ${redact(url)}\n  ${redact(lastError?.message ?? lastError)}`,
  )
}

/**
 * Parse a JSON body from this API.
 * The service prefixes JSON responses with a UTF-8 BOM, which JSON.parse rejects.
 */
export function parseJson(text) {
  return JSON.parse(text.replace(/^﻿/, ''))
}

/** Name of the XML root element, ignoring any BOM, XML declaration or doctype. */
export function rootElement(text) {
  const stripped = text
    .replace(/^﻿/, '')
    .replace(/<\?xml[^>]*\?>/gi, '')
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .trim()
  return stripped.match(/^<([\w:-]+)/)?.[1] ?? null
}

/** Pull `<error><code>…</code><reason>…</reason></error>` out of an XML error body. */
export function xmlError(text) {
  const code = text.match(/<code>([^<]*)<\/code>/)?.[1]
  const reason = text.match(/<reason>([^<]*)<\/reason>/)?.[1]
  return code ? { code, reason } : null
}

/** True when the XML body contains at least one `<tag` element. */
export function hasElement(text, tag) {
  return new RegExp(`<${tag}[\\s/>]`).test(text)
}

/** Record ids / frabls that exist in the zbb staging catalogue (verified by probe). */
export const FIXTURES = {
  recordId: '|library/marc/vlacc|10438540',
  frabl: '61B74575E8F1ACA0',
  searchListId: '|library/marc/vlacc|8842444',
  ean: '0731454790321',
  isbn: '9789022330227',
}
