import { describe, it, expect, beforeAll } from 'vitest'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import SwaggerParser from '@apidevtools/swagger-parser'
import { loadSpec, specPath, serverUrl, repoRoot } from './helpers.js'

/**
 * Structural tests for openapi.json.
 *
 * These never touch the network — they assert the document is a valid, internally
 * consistent OpenAPI 3.1 description with the enums and parameters we verified
 * against the live API.
 */

let spec

/** Every (path, method, operation) triple in the document. */
function operations(doc) {
  const METHODS = ['get', 'put', 'post', 'delete', 'patch', 'head', 'options', 'trace']
  const out = []
  for (const [path, item] of Object.entries(doc.paths)) {
    for (const method of METHODS) {
      if (item[method]) out.push({ path, method, op: item[method] })
    }
  }
  return out
}

/** Collect every "$ref" string anywhere in the document. */
function collectRefs(node, acc = []) {
  if (Array.isArray(node)) node.forEach((n) => collectRefs(n, acc))
  else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === '$ref' && typeof v === 'string') acc.push(v)
      else collectRefs(v, acc)
    }
  }
  return acc
}

function resolvePointer(doc, ref) {
  if (!ref.startsWith('#/')) return undefined
  return ref
    .slice(2)
    .split('/')
    .map((s) => s.replace(/~1/g, '/').replace(/~0/g, '~'))
    .reduce((node, key) => (node == null ? undefined : node[key]), doc)
}

beforeAll(() => {
  spec = loadSpec()
})

describe('document', () => {
  it('passes redocly lint', () => {
    // Redocly is the validator here rather than swagger-parser: swagger-parser 10.x still
    // ships a stale OpenAPI 3.1 meta-schema that rejects `description` on a server variable,
    // which the 3.1 specification explicitly allows.
    const bin = resolve(repoRoot, 'node_modules/.bin/redocly')
    expect(() =>
      execFileSync(bin, ['lint', 'openapi.json', '--format=summary'], {
        cwd: repoRoot,
        encoding: 'utf8',
        stdio: 'pipe',
      }),
    ).not.toThrow()
  })

  it('resolves into a fully dereferenced document', async () => {
    // Catches broken or circular-by-accident $refs; the Record schema is legitimately
    // self-referential (children/parents), so dereference is expected to handle that.
    await expect(SwaggerParser.dereference(specPath)).resolves.toBeTruthy()
  })

  it('declares OpenAPI 3.1', () => {
    expect(spec.openapi).toMatch(/^3\.1\./)
  })

  it('has info with title, version and description', () => {
    expect(spec.info.title).toBeTruthy()
    expect(spec.info.version).toBeTruthy()
    expect(spec.info.description).toBeTruthy()
  })
})

describe('servers', () => {
  it('templates environment and profile as server variables', () => {
    const server = spec.servers[0]
    expect(server.url).toContain('{env}')
    expect(server.url).toContain('{profile}')
    expect(server.variables.env.enum).toEqual(['', '/staging'])
    expect(server.variables.profile.default).toBe('zbb')
  })

  it('resolves to the production and staging base URLs', () => {
    expect(serverUrl(spec, { env: '', profile: 'wetteren' })).toBe(
      'https://cataloguswebservices.bibliotheek.be/wetteren',
    )
    expect(serverUrl(spec, { env: '/staging', profile: 'zbb' })).toBe(
      'https://cataloguswebservices.bibliotheek.be/staging/zbb',
    )
  })

  it('gives profile-less endpoints their own server override', () => {
    // /holdings and the global variants sit outside the profile prefix.
    for (const path of ['/holdings/{holdingPath}']) {
      const item = spec.paths[path]
      expect(item, `${path} must exist`).toBeTruthy()
      expect(item.servers, `${path} must override the server`).toBeTruthy()
      expect(item.servers[0].url).not.toContain('{profile}')
    }
  })
})

describe('security', () => {
  it('defines the authorization query key', () => {
    const scheme = spec.components.securitySchemes.authorization
    expect(scheme).toEqual(expect.objectContaining({ type: 'apiKey', in: 'query', name: 'authorization' }))
  })

  it('applies it globally', () => {
    expect(spec.security).toEqual([{ authorization: [] }])
  })
})

describe('operations', () => {
  it('covers every documented endpoint', () => {
    const ids = operations(spec).map((o) => o.op.operationId).sort()
    expect(ids).toEqual(
      [
        'getAvailability',
        'getDetails',
        'getHoldings',
        'getIndexAll',
        'getIndexTerms',
        'postSearchAvailability',
        'refine',
        'resolve',
        'search',
      ].sort(),
    )
  })

  it('gives each operation an operationId, summary, description and tag', () => {
    for (const { path, method, op } of operations(spec)) {
      const at = `${method.toUpperCase()} ${path}`
      expect(op.operationId, `${at} needs an operationId`).toBeTruthy()
      expect(op.summary, `${at} needs a summary`).toBeTruthy()
      expect(op.description, `${at} needs a description`).toBeTruthy()
      expect(op.tags?.length, `${at} needs a tag`).toBeGreaterThan(0)
    }
  })

  it('uses unique operationIds', () => {
    const ids = operations(spec).map((o) => o.op.operationId)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('documents a 200 plus the error statuses the API actually returns', () => {
    for (const { path, method, op } of operations(spec)) {
      const at = `${method.toUpperCase()} ${path}`
      expect(Object.keys(op.responses), `${at} needs a 200`).toContain('200')
      expect(Object.keys(op.responses), `${at} needs a 401`).toContain('401')
    }
  })

  it('only references tags that are declared', () => {
    const declared = new Set(spec.tags.map((t) => t.name))
    for (const { op } of operations(spec)) {
      for (const tag of op.tags) expect(declared, `tag '${tag}' is not declared`).toContain(tag)
    }
  })
})

describe('parameters', () => {
  it('shares lang, output, detaillevel and rctx via components.parameters', () => {
    for (const name of ['lang', 'output', 'detaillevel', 'rctx']) {
      expect(spec.components.parameters[name], `components.parameters.${name} missing`).toBeTruthy()
    }
  })

  it('restricts lang to the supported values', () => {
    expect(spec.components.parameters.lang.schema.enum).toEqual(['nl', 'fr', 'en'])
  })

  it('restricts output to xml and json', () => {
    expect(spec.components.parameters.output.schema.enum).toEqual(['xml', 'json'])
  })

  it('restricts detaillevel to the five levels the API accepts', () => {
    expect(spec.components.parameters.detaillevel.schema.enum).toEqual([
      'minimum',
      'basic',
      'default',
      'extended',
      'librarian',
    ])
  })

  it('marks q as required on search and enumerates sort', () => {
    const params = spec.paths['/search/'].get.parameters
    const q = params.find((p) => p.name === 'q')
    expect(q.required).toBe(true)
    const sort = params.find((p) => p.name === 'sort')
    expect(sort.schema.enum).toEqual(['relevance', 'year', 'author', 'title'])
  })

  it('caps pagesize at the documented default entitlement', () => {
    const pagesize = spec.paths['/search/'].get.parameters.find((p) => p.name === 'pagesize')
    expect(pagesize.schema.default).toBe(20)
    // Larger pages need a key with extra rights; the schema documents the ceiling.
    expect(pagesize.description).toMatch(/rights|entitle/i)
  })
})

describe('path enums verified against the live API', () => {
  it('lists exactly the index types the API allows', () => {
    // Source of truth: the live 404 body from /index/bogus/.
    const param = spec.paths['/index/{indexType}/'].get.parameters.find((p) => p.name === 'indexType')
    expect(param.schema.enum).toEqual([
      'author',
      'awards',
      'subject',
      'language',
      'format',
      'targetaudience',
      'readinglevel',
      'type',
      'genre',
      'review',
    ])
  })

  it('lists the documented resolver identifier types', () => {
    const param = spec.paths['/resolver/{idType}/'].get.parameters.find((p) => p.name === 'idType')
    expect(param.schema.enum).toEqual([
      'ean',
      'isbn',
      'issn',
      'frabl',
      'ppn',
      'admin_doc_number',
      'bibno',
      'doc_number',
      'nativeid',
      'extid',
    ])
  })
})

describe('response bodies', () => {
  it('offers JSON only on the three operations where output=json genuinely works', () => {
    const jsonCapable = []
    for (const { op } of operations(spec)) {
      if (op.responses['200'].content?.['application/json']) jsonCapable.push(op.operationId)
    }
    expect(jsonCapable.sort()).toEqual(['getAvailability', 'getDetails', 'search'])
  })

  it('serves XML from every 200', () => {
    for (const { path, method, op } of operations(spec)) {
      expect(
        op.responses['200'].content['application/xml'],
        `${method.toUpperCase()} ${path} must document an XML body`,
      ).toBeTruthy()
    }
  })

  it('names the XML root element aquabrowser, not root', () => {
    for (const [name, schema] of Object.entries(spec.components.schemas)) {
      if (!name.endsWith('Response') || name.endsWith('JsonResponse')) continue
      expect(schema.xml?.name, `${name} must serialise as <aquabrowser>`).toBe('aquabrowser')
    }
  })

  it('models the error body with code and reason', () => {
    const error = spec.components.schemas.ErrorResponse
    expect(error.properties.error.properties.code).toBeTruthy()
    expect(error.properties.error.properties.reason).toBeTruthy()
  })
})

describe('internal consistency', () => {
  it('resolves every $ref', () => {
    for (const ref of new Set(collectRefs(spec))) {
      expect(resolvePointer(spec, ref), `dangling $ref: ${ref}`).toBeTruthy()
    }
  })

  it('leaves no orphan schemas', () => {
    const used = new Set(collectRefs(spec))
    for (const name of Object.keys(spec.components.schemas)) {
      expect(used, `components.schemas.${name} is never referenced`).toContain(`#/components/schemas/${name}`)
    }
  })

  it('leaves no orphan shared parameters', () => {
    const used = new Set(collectRefs(spec))
    for (const name of Object.keys(spec.components.parameters)) {
      expect(used, `components.parameters.${name} is never referenced`).toContain(
        `#/components/parameters/${name}`,
      )
    }
  })
})
