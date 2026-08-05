import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  loadSpec,
  stagingBase,
  buildUrl,
  call,
  parseJson,
  rootElement,
  xmlError,
  hasElement,
  FIXTURES,
  exercisedPaths,
  repoRoot,
  redact,
  TOKEN,
} from './helpers.js'
import { buildXmlModel, walkXml, parseXml } from './xml-model.js'

/**
 * Contract tests against the live staging endpoint.
 *
 *   https://cataloguswebservices.bibliotheek.be/staging/zbb
 *
 * Requests are built from openapi.json (path templates + server variables), so a green
 * run proves the spec describes the real service rather than a hand-copied URL.
 *
 * The .env token is entitled to the zbb profile on staging only. Everything that the
 * token or the staging deployment cannot reach is skipped with an explicit reason
 * rather than silently dropped — see the `skipped` block at the bottom.
 */

let spec
let base

/** Fetch through a spec-declared path. */
function get(pathTemplate, opts) {
  return call(buildUrl(base, pathTemplate, opts))
}

beforeAll(() => {
  spec = loadSpec()
  base = stagingBase(spec)
  expect(base).toBe('https://cataloguswebservices.bibliotheek.be/staging/zbb')
})

/**
 * Record which of the spec's paths this run actually called, so the API-coverage badge
 * reports something measured rather than asserted. Paths the token cannot reach show up
 * here as uncovered, which is the honest reading.
 */
afterAll(() => {
  const paths = Object.keys(spec.paths)
  const covered = paths.filter((p) => exercisedPaths.has(p))
  const report = {
    total: paths.length,
    covered: covered.length,
    pct: Math.round((covered.length / paths.length) * 1000) / 10,
    uncovered: paths.filter((p) => !exercisedPaths.has(p)),
  }
  mkdirSync(resolve(repoRoot, 'coverage'), { recursive: true })
  writeFileSync(
    resolve(repoRoot, 'coverage/api-coverage.json'),
    JSON.stringify(report, null, 2) + '\n',
  )
})

describe('GET /search/', () => {
  it('returns an XML result list', async () => {
    const res = await get('/search/', { query: { q: 'test', lang: 'nl', pagesize: 2 } })
    expect(res.status).toBe(200)
    expect(res.contentType).toBe('application/xml')
    expect(rootElement(res.text)).toBe('aquabrowser')
    expect(hasElement(res.text, 'meta')).toBe(true)
    expect(hasElement(res.text, 'results')).toBe(true)
    expect(hasElement(res.text, 'count')).toBe(true)
  })

  it('exposes the search-availability post body in the response', async () => {
    const res = await get('/search/', { query: { q: 'duizend zonnen', lang: 'nl', pagesize: 3 } })
    expect(res.status).toBe(200)
    expect(hasElement(res.text, 'search-availability-ids')).toBe(true)
    // The <post> node is fed verbatim into POST /search-availability/.
    expect(res.text).toMatch(/<post>[\s\S]*%7clibrary%2fmarc%2fvlacc%7c\d+=\d/)
  })

  it('returns facets when refine=true', async () => {
    const res = await get('/search/', { query: { q: 'test', refine: 'true', lang: 'nl', pagesize: 1 } })
    expect(res.status).toBe(200)
    expect(hasElement(res.text, 'facets')).toBe(true)
    expect(hasElement(res.text, 'facet')).toBe(true)
  })

  it('marks matched terms with <exact> when hith=true', async () => {
    const res = await get('/search/', { query: { q: 'test', hith: 'true', lang: 'nl', pagesize: 1 } })
    expect(res.status).toBe(200)
    expect(hasElement(res.text, 'exact')).toBe(true)
  })

  it('accepts repeated id together with q=special:list', async () => {
    const res = await get('/search/', {
      query: { id: [FIXTURES.searchListId], q: 'special:list', lang: 'nl' },
    })
    expect(res.status).toBe(200)
    expect(res.text).toContain(FIXTURES.searchListId)
  })

  it('accepts a branch filter', async () => {
    const res = await get('/search/', {
      query: { q: 'test', branch: 'Oost-Vlaanderen/Wetteren/Overbeke', lang: 'nl', pagesize: 1 },
    })
    expect(res.status).toBe(200)
    expect(rootElement(res.text)).toBe('aquabrowser')
  })

  it('accepts every detaillevel the spec enumerates', async () => {
    const levels = spec.components.parameters.detaillevel.schema.enum
    for (const level of levels) {
      const res = await get('/search/', { query: { q: 'test', pagesize: 1, detaillevel: level } })
      expect(res.status, `detaillevel=${level}`).toBe(200)
    }
  })

  it('accepts every sort option the spec enumerates', async () => {
    const sorts = spec.paths['/search/'].get.parameters.find((p) => p.name === 'sort').schema.enum
    for (const sort of sorts) {
      const res = await get('/search/', { query: { q: 'test', pagesize: 1, sort } })
      expect(res.status, `sort=${sort}`).toBe(200)
    }
  })
})

describe('GET /search/?output=json (undocumented)', () => {
  it('returns parseable JSON once the UTF-8 BOM is stripped', async () => {
    const res = await get('/search/', { query: { q: 'test', pagesize: 1, output: 'json' } })
    expect(res.status).toBe(200)
    expect(res.contentType).toBe('application/json')
    // The body starts with EF BB BF on the wire. WHATWG fetch's res.text() drops it
    // silently, but decoders that do not — Python's json.loads on raw bytes, for one —
    // fail outright, so the quirk is asserted against the bytes.
    expect(res.bom).toBe(true)
    expect(() => JSON.parse(res.text)).toThrow()
    const body = parseJson(res.text)
    expect(body.meta['result-count']).toMatch(/^\d+$/)
    expect(Array.isArray(body.results)).toBe(true)
    expect(body.results[0]).toHaveProperty('id')
    expect(body.results[0]).toHaveProperty('detailLink')
  })

  it('silently drops the facets block that XML returns for the same query', async () => {
    const query = { q: 'test', refine: 'true', lang: 'nl', pagesize: 1 }
    const xml = await get('/search/', { query })
    const json = await get('/search/', { query: { ...query, output: 'json' } })
    expect(hasElement(xml.text, 'facets')).toBe(true)
    expect(Object.keys(parseJson(json.text))).toEqual(['meta', 'results'])
  })
})

describe('the API key never escapes into output', () => {
  // CI uploads coverage/ as a build artifact, and on a public repository anyone can
  // download it. Every request URL carries ?authorization=<key>, so any value a test can
  // print has to be redacted first.
  it('keeps the key out of the returned url', async () => {
    const res = await get('/search/', { query: { q: 'test', pagesize: 1 } })
    expect(res.url).not.toContain(TOKEN)
    expect(res.url).toContain('authorization=YOUR_API_KEY')
  })

  it('keeps the key out of request failure messages', async () => {
    // Unroutable host, so this fails fast without touching the real service.
    const url = buildUrl('https://localhost:1', '/search/', { query: { q: 'test' } })
    await expect(call(url, { attempts: 1, timeoutMs: 1500 })).rejects.toThrow(
      /request failed/,
    )
    const err = await call(url, { attempts: 1, timeoutMs: 1500 }).catch((e) => e)
    expect(err.message).not.toContain(TOKEN)
  })

  it('redacts the key wherever it appears', () => {
    expect(redact(`x ${TOKEN} y`)).toBe('x YOUR_API_KEY y')
    expect(redact('https://h/search/?q=a&authorization=deadbeefdeadbeef&lang=nl')).toBe(
      'https://h/search/?q=a&authorization=YOUR_API_KEY&lang=nl',
    )
  })
})

describe('XML schemas match the live payloads', () => {
  let model

  beforeAll(() => {
    model = buildXmlModel(spec)
  })

  /** Elements and attributes present in the response but absent from the spec. */
  function gaps(xml) {
    const missingElements = new Set()
    const missingAttributes = new Set()
    for (const { tag, attributes } of walkXml(parseXml(xml))) {
      if (!model.elements.has(tag)) missingElements.add(tag)
      const allowed = model.attrs.get(tag) ?? new Set()
      for (const a of attributes) if (!allowed.has(a)) missingAttributes.add(`${tag}@${a}`)
    }
    return { elements: [...missingElements].sort(), attributes: [...missingAttributes].sort() }
  }

  // Chosen to exercise the optional blocks: music, magazine articles, games, awards,
  // series, translations, websites, omnibus parent/child records.
  const QUERIES = [
    'duizend zonnen',
    'kind of blue',
    'eos magazine',
    'mario bros',
    'vos en haas',
    'omnibus',
    'Format:website',
  ]

  it('documents every element and attribute /search/ returns', async () => {
    for (const q of QUERIES) {
      const res = await get('/search/', {
        query: { q, lang: 'nl', pagesize: 3, refine: 'true', detaillevel: 'librarian', librarian: 'true' },
      })
      expect(res.status, q).toBe(200)
      expect(gaps(res.text), `query: ${q}`).toEqual({ elements: [], attributes: [] })
    }
  })

  it('documents every element and attribute /details/ returns', async () => {
    for (const id of [FIXTURES.recordId, '|library/marc/vlacc|8219740', '|library/marc/vlacc|9679899']) {
      const res = await get('/details/', {
        query: { id, lang: 'nl', librarian: 'true', detaillevel: 'librarian' },
      })
      expect(res.status, id).toBe(200)
      expect(gaps(res.text), `id: ${id}`).toEqual({ elements: [], attributes: [] })
    }
  })

  it('places the details record directly under the root, with no <record> wrapper', async () => {
    const res = await get('/details/', { query: { id: FIXTURES.recordId, lang: 'nl' } })
    const root = parseXml(res.text)
    expect(root.tagName).toBe('aquabrowser')
    const children = root.children.map((c) => c.tagName)
    expect(children).not.toContain('record')
    expect(children).toEqual(expect.arrayContaining(['id', 'titles', 'authors', 'meta']))
  })

  it('documents every element and attribute /availability/ returns', async () => {
    const res = await get('/availability/', { query: { frabl: FIXTURES.frabl, lang: 'nl' } })
    expect(gaps(res.text)).toEqual({ elements: [], attributes: [] })
  })

  it('documents every element and attribute /refine/ returns', async () => {
    const withCtx = await get('/search/', { query: { q: 'roman', refine: 'true', pagesize: 1, lang: 'nl' } })
    const rctx = withCtx.text.match(/<rctx>([^<]+)<\/rctx>/)[1]
    for (const query of [{ lang: 'nl', count: 5 }, { lang: 'nl', count: 5, rctx }]) {
      const res = await get('/refine/', { query })
      expect(res.status).toBe(200)
      expect(gaps(res.text)).toEqual({ elements: [], attributes: [] })
    }
  })

  it('documents every element and attribute the index endpoints return', async () => {
    const all = await get('/index/all/', { query: { lang: 'nl' } })
    expect(gaps(all.text)).toEqual({ elements: [], attributes: [] })

    const terms = await get('/index/{indexType}/', {
      path: { indexType: 'author' },
      query: { lang: 'nl', pagesize: 5 },
    })
    expect(gaps(terms.text)).toEqual({ elements: [], attributes: [] })
    // Entries sit directly under the root — no <results> wrapper here.
    expect(parseXml(terms.text).children.map((c) => c.tagName)).toContain('result')
  })

  it('documents every element and attribute /resolver/ returns', async () => {
    const res = await get('/resolver/{idType}/', { path: { idType: 'ean' }, query: { id: FIXTURES.ean } })
    expect(gaps(res.text)).toEqual({ elements: [], attributes: [] })
  })

  it('documents every element and attribute the error bodies return', async () => {
    const res = await get('/search/', { query: { q: 'test', lang: 'not' } })
    expect(res.status).toBe(409)
    expect(gaps(res.text)).toEqual({ elements: [], attributes: [] })
  })
})

describe('JSON schemas match the live payloads', () => {
  /** Keys a schema documents, following one level of $ref. */
  function documented(schemaName) {
    const deref = (node) =>
      node?.$ref ? deref(spec.components.schemas[node.$ref.split('/').pop()]) : node
    return new Set(Object.keys(deref(spec.components.schemas[schemaName]).properties ?? {}))
  }

  /** Every key seen across a set of objects. */
  function keysOf(objects) {
    const seen = new Set()
    for (const o of objects) for (const k of Object.keys(o ?? {})) seen.add(k)
    return seen
  }

  function undocumented(seen, schemaName) {
    const known = documented(schemaName)
    return [...seen].filter((k) => !known.has(k))
  }

  // Queries chosen to surface the optional blocks: music tracks, magazine articles,
  // games, awards, series, translated works.
  const QUERIES = ['duizend zonnen', 'kind of blue', 'eos magazine', 'mario bros', 'vos en haas']

  it('documents every key the search payload returns', async () => {
    const records = []
    let meta
    for (const q of QUERIES) {
      const res = await get('/search/', {
        query: { q, lang: 'nl', pagesize: 3, detaillevel: 'extended', output: 'json' },
      })
      expect(res.status, q).toBe(200)
      const body = parseJson(res.text)
      meta = { ...meta, ...body.meta }
      records.push(...body.results)
    }
    expect(records.length).toBeGreaterThan(5)
    expect(undocumented(keysOf([meta]), 'SearchJsonMeta')).toEqual([])
    expect(undocumented(keysOf(records), 'RecordJson')).toEqual([])
  })

  it('documents every key the nested record objects return', async () => {
    const res = await get('/search/', {
      query: { q: 'kind of blue', lang: 'nl', pagesize: 3, detaillevel: 'librarian', output: 'json' },
    })
    const records = parseJson(res.text).results
    const collect = (key) => records.flatMap((r) => r[key] ?? [])

    expect(undocumented(keysOf(collect('authorsDetailed')), 'AuthorJson')).toEqual([])
    expect(undocumented(keysOf(collect('formats')), 'FormatJson')).toEqual([])
    expect(undocumented(keysOf(collect('series')), 'SeriesJson')).toEqual([])
    expect(undocumented(keysOf(collect('enrichInfo')), 'EnrichInfoJson')).toEqual([])
    expect(undocumented(keysOf(collect('custom')), 'CustomJson')).toEqual([])
    expect(undocumented(keysOf(records.map((r) => r.frabl)), 'FrablJson')).toEqual([])
    expect(undocumented(keysOf(records.map((r) => r.undup)), 'UndupJson')).toEqual([])
    expect(undocumented(keysOf(records.map((r) => r.marc21)), 'Marc21Json')).toEqual([])
  })

  it('documents the MARC21 field shape', async () => {
    const res = await get('/search/', {
      query: { q: 'duizend zonnen', pagesize: 1, detaillevel: 'extended', output: 'json' },
    })
    const marc = parseJson(res.text).results[0].marc21
    expect(typeof marc.leader).toBe('string')
    // Each field is a single-key object: control fields map to a string, data fields
    // to {ind1, ind2, subfields}.
    const dataFields = marc.fields
      .map((f) => Object.values(f)[0])
      .filter((v) => typeof v === 'object')
    expect(dataFields.length).toBeGreaterThan(0)
    expect(undocumented(keysOf(dataFields), 'Marc21DataField')).toEqual([])
    for (const f of dataFields) {
      for (const sub of f.subfields) expect(Object.keys(sub).length).toBe(1)
    }
  })

  it('documents every key the details payload returns', async () => {
    const res = await get('/details/', { query: { id: FIXTURES.recordId, lang: 'nl', output: 'json' } })
    const body = parseJson(res.text)
    expect(undocumented(keysOf([body]), 'DetailsJsonResponse')).toEqual([])
    expect(undocumented(keysOf([body.record]), 'RecordJson')).toEqual([])
  })

  it('documents every key the availability payload returns', async () => {
    const res = await get('/availability/', { query: { frabl: FIXTURES.frabl, lang: 'nl', output: 'json' } })
    const body = parseJson(res.text)
    expect(undocumented(keysOf([body]), 'AvailabilityJsonResponse')).toEqual([])
    expect(Array.isArray(body.availability)).toBe(true)
    expect(undocumented(keysOf(body.availability), 'AvailabilityLocationJson')).toEqual([])
    const items = body.availability.flatMap((l) => l.items ?? [])
    expect(items.length).toBeGreaterThan(0)
    expect(undocumented(keysOf(items), 'AvailabilityItemJson')).toEqual([])
  })

  it('returns every scalar as a string, including counts and booleans', async () => {
    const res = await get('/availability/', { query: { frabl: FIXTURES.frabl, lang: 'nl', output: 'json' } })
    const item = parseJson(res.text).availability.flatMap((l) => l.items ?? [])[0]
    expect(typeof item.available).toBe('string')
    expect(typeof item.count).toBe('string')
    expect(['true', 'false']).toContain(item.available)
  })
})

describe('GET /details/', () => {
  it('returns one record by id', async () => {
    const res = await get('/details/', { query: { id: FIXTURES.recordId, lang: 'nl' } })
    expect(res.status).toBe(200)
    expect(res.contentType).toBe('application/xml')
    expect(rootElement(res.text)).toBe('aquabrowser')
    expect(hasElement(res.text, 'titles')).toBe(true)
  })

  it('returns the most relevant edition by frabl', async () => {
    const res = await get('/details/', { query: { frabl: FIXTURES.frabl, lang: 'nl' } })
    expect(res.status).toBe(200)
    expect(hasElement(res.text, 'frabl')).toBe(true)
  })

  it('returns JSON with a record object when output=json', async () => {
    const res = await get('/details/', { query: { id: FIXTURES.recordId, lang: 'nl', output: 'json' } })
    expect(res.status).toBe(200)
    expect(res.contentType).toBe('application/json')
    const body = parseJson(res.text)
    expect(Object.keys(body)).toEqual(['meta', 'record'])
  })

  it('adds source information with librarian=true', async () => {
    const res = await get('/details/', { query: { id: FIXTURES.recordId, librarian: 'true' } })
    expect(res.status).toBe(200)
  })
})

describe('GET /availability/', () => {
  it('returns locations for a frabl', async () => {
    const res = await get('/availability/', { query: { frabl: FIXTURES.frabl, lang: 'nl' } })
    expect(res.status).toBe(200)
    expect(res.contentType).toBe('application/xml')
    expect(hasElement(res.text, 'locations')).toBe(true)
    expect(hasElement(res.text, 'location')).toBe(true)
  })

  it('returns JSON with an availability object when output=json', async () => {
    const res = await get('/availability/', { query: { frabl: FIXTURES.frabl, lang: 'nl', output: 'json' } })
    expect(res.status).toBe(200)
    const body = parseJson(res.text)
    expect(Object.keys(body)).toEqual(['meta', 'availability'])
  })
})

describe('GET /refine/', () => {
  it('returns the configured facets', async () => {
    const res = await get('/refine/', { query: { lang: 'nl' } })
    expect(res.status).toBe(200)
    expect(res.contentType).toBe('application/xml')
    expect(rootElement(res.text)).toBe('aquabrowser')
  })

  it('narrows to a single facet with facets=', async () => {
    const res = await get('/refine/', { query: { lang: 'nl', facets: 'Format', count: 15 } })
    expect(res.status).toBe(200)
  })
})

describe('GET /index/', () => {
  it('lists all configured indexes and facets for the profile', async () => {
    const res = await get('/index/all/')
    expect(res.status).toBe(200)
    expect(rootElement(res.text)).toBe('aquabrowser')
  })

  it('returns terms for every index type the spec enumerates', async () => {
    const types = spec.paths['/index/{indexType}/'].get.parameters.find((p) => p.name === 'indexType')
      .schema.enum
    for (const indexType of types) {
      const res = await get('/index/{indexType}/', {
        path: { indexType },
        query: { lang: 'nl', pagesize: 5 },
      })
      expect(res.status, `index/${indexType}`).toBe(200)
    }
  })
})

describe('GET /resolver/', () => {
  it('resolves an EAN to catalogue item ids', async () => {
    const res = await get('/resolver/{idType}/', { path: { idType: 'ean' }, query: { id: FIXTURES.ean } })
    expect(res.status).toBe(200)
    expect(hasElement(res.text, 'results')).toBe(true)
  })

  it('resolves an ISBN', async () => {
    const res = await get('/resolver/{idType}/', { path: { idType: 'isbn' }, query: { id: FIXTURES.isbn } })
    expect(res.status).toBe(200)
  })

  it('resolves a frabl', async () => {
    const res = await get('/resolver/{idType}/', { path: { idType: 'frabl' }, query: { id: FIXTURES.frabl } })
    expect(res.status).toBe(200)
  })
})

describe('errors', () => {
  it('401 UnAuthorized when authorization is missing', async () => {
    const res = await call(buildUrl(base, '/search/', { query: { q: 'test', authorization: null } }))
    expect(res.status).toBe(401)
    expect(xmlError(res.text)).toEqual({ code: 'UnAuthorized', reason: 'Missing authorization' })
  })

  it('401 UnAuthorized when the key is not configured', async () => {
    const url = buildUrl(base, '/search/', { query: { q: 'test', authorization: null } }) + '&authorization=deadbeef'
    const res = await call(url)
    expect(res.status).toBe(401)
    expect(xmlError(res.text).code).toBe('UnAuthorized')
  })

  it('409 FailedValidation when q is missing', async () => {
    const res = await get('/search/')
    expect(res.status).toBe(409)
    expect(xmlError(res.text)).toEqual({
      code: 'FailedValidation',
      reason: "Parameter 'q' is required exactly once.",
    })
  })

  it('409 FailedValidation on an unsupported lang', async () => {
    const res = await get('/search/', { query: { q: 'test', lang: 'not' } })
    expect(res.status).toBe(409)
    expect(xmlError(res.text).code).toBe('FailedValidation')
  })

  it('409 FailedValidation on an unsupported detaillevel', async () => {
    const res = await get('/search/', { query: { q: 'test', detaillevel: 'bogus' } })
    expect(res.status).toBe(409)
    expect(xmlError(res.text).code).toBe('FailedValidation')
  })

  it('404 on an unknown index type, naming the allowed indexes', async () => {
    const res = await get('/index/{indexType}/', { path: { indexType: 'bogus' } })
    expect(res.status).toBe(404)
    expect(xmlError(res.text).reason).toContain('not one of the allowed indexes')
  })

  it('500 on an unknown sort — not a validation error', async () => {
    const res = await get('/search/', { query: { q: 'test', sort: 'bogus' } })
    expect(res.status).toBe(500)
    expect(res.text).toContain('HardSorter')
  })

  it('returns JSON error bodies when output=json', async () => {
    const res = await get('/search/', { query: { q: 'test', lang: 'not', output: 'json' } })
    expect(res.status).toBe(409)
    expect(res.contentType).toBe('application/json')
    expect(parseJson(res.text).error.code).toBe('FailedValidation')
  })

  it('rejects an empty search-availability body', async () => {
    const res = await call(buildUrl(base, '/search-availability/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: '',
    })
    expect(res.status).toBe(409)
    expect(xmlError(res.text)).toEqual({ code: 'FailedValidation', reason: 'No itemids provided.' })
  })
})

/**
 * Operations the spec documents but this environment cannot exercise.
 * They stay visible in the run so nothing disappears silently.
 */
describe('not exercisable from this environment', () => {
  it.skip('POST /search-availability/ with a real body — zbb is a union catalogue with no Wise locationcode (404 "holding does not have a wise locationcode"); needs a single-library profile such as wetteren, which this token is not entitled to', () => {})

  it.skip('GET /holdings/{holdingPath} — /staging/holdings/… returns 502; only the production host serves it', () => {})

  it.skip('GET /index/all/ without a profile — /staging/index/all/ returns 502; only the production host serves the global variant', () => {})

  it.skip('GET /availability/?global=true — /staging/availability/ returns 502, and global access is granted per key on request', () => {})

  it.skip('pagesize above 20 — this key is not entitled; staging resets the connection instead of returning an error', () => {})

  it.skip('profiles other than zbb — /staging/wetteren/search returns 401 "The provided authorization key is not configured."', () => {})
})
