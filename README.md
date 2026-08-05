# Cultuurconnect Catalogus Webservices — OpenAPI description

`openapi.json` is an OpenAPI 3.1 description of the Cultuurconnect *Catalogus webservices v1*
(AquaBrowser), built from `cultuurconnect-api-catalogus-webservices-v1-publieke-documentatie.md`
and verified against the live staging endpoint.

## Credentials

Nothing in this repository is a working credential.

* Your key lives in `.env` as `TOKEN=…` and is gitignored. The tests read it from there.
* `samples/` was captured against the live API with the key rewritten to `YOUR_API_KEY`.
* The vendor documentation shipped with API keys inlined in 97 example URLs, one of which is
  **still live against production**. The committed copy of
  `cultuurconnect-api-catalogus-webservices-v1-publieke-documentatie.md` has all three replaced
  with `YOUR_API_KEY`. The untouched original is kept locally as `*.original.md` and is
  gitignored — do not commit it.

If you need a key, request one from helpdesk@cultuurconnect.be. Keys are scoped per profile and
per tier, so a key is not interchangeable between libraries.

## Browsable docs

```bash
npm run docs          # http://127.0.0.1:8080 — live-reloading Redoc UI
npm run docs:build    # writes a standalone docs/index.html you can open or host
```

`npm run docs` reloads on every save to `openapi.json`, so it doubles as the editing loop.

## Running the tests

```bash
npm install
npm test              # spec validation + live contract tests
npm run test:spec     # structural checks only, no network
npm run test:live     # live calls against staging/zbb
npm run lint:spec     # redocly lint openapi.json
```

`test/live.test.js` reads `TOKEN` from `.env` and builds every request from `openapi.json`
itself — path templates, server variables and parameter enums — so a green run means the spec
describes the service, not a set of hand-copied URLs.

## Servers

One host serves every library profile; the profile is the first path segment. Staging inserts
`/staging` before it. Both are server variables:

| Variable  | Values                        | Example                                                  |
|-----------|-------------------------------|----------------------------------------------------------|
| `env`     | `""` (production), `/staging` | `https://cataloguswebservices.bibliotheek.be/staging/zbb` |
| `profile` | `zbb`, `wetteren`, `gent`, …  | `https://cataloguswebservices.bibliotheek.be/wetteren`    |

`/holdings/{holdingPath}` sits outside the profile prefix and carries its own server override.

## Sample responses

`samples/` holds real, unedited responses from `staging/zbb` (the API key is replaced with
`YOUR_API_KEY`), captured with the same script that seeds the spec's examples:

```
search.xml  search-refine.xml  search.json  search-extended.json
details.xml details.json       availability.xml availability.json
refine.xml  index-all.xml      index-author.xml resolver-ean.xml
holdings.xml                   (production — /holdings is not on staging)
error-401.xml error-409.xml    error-409.json
refine-output-json-is-broken.txt
```

Compact versions of the search, details and availability responses — XML and JSON — are also
inlined as `example` in `openapi.json`, so they render directly in the docs UI.

## Where the spec departs from the published documentation

Everything below was observed on the live service and takes precedence over the markdown doc.
`test/live.test.js` walks real responses and asserts that every element and attribute they
contain is described in the spec, so these findings are enforced rather than just noted.

| Topic | Finding |
|---|---|
| Root element | Responses are rooted at `<aquabrowser>`. The documentation's tables call it `root`. |
| Root attributes | `/search/`, `/details/` and `/availability/` carry `@version @before-rendering-time @total-time` (plus `@detail-level` on the first two); the other endpoints and all errors carry `@version @time-taken`. |
| **`/details/` has no `<record>` wrapper** | The record's elements — `id`, `titles`, `authors`, … — are direct children of the root, alongside `meta`, `ratings` and `services`. |
| Where the search attributes live | `<result>` and the container elements (`titles`, `authors`, `formats`, …) carry **no** attributes. `@translation` and the `@search-method`/`@search-term`/`@search-type` search links sit on the **leaf** elements. |
| Renamed elements | `classification` (not `classifications`), `classification/platforms` (not `platform`), `titles/origin-title` (not `original-title`), `eresources/eresource` (not `e-resources/e-resource`), `ratings/kijkwijzer-codes/kijkwijzer`, `@icon-src` (not `@icons-src`). |
| Correctly spelled | `holding/@longitude` — the documentation writes `@longtitude`. |
| Undocumented elements | `deeplink`, `identifiers/normalized-isbn-id`, `description/pages`, `publication/year`, `publication/originalpublisher`, `services`, `custom/images`, `custom/collections`, `feedbacks/search-availability-ids/frabl-post`, and `custom/luisterpunt/{id,playingtime}`. |
| Undocumented attributes | `@raw` on coded leaves, `@associated`/`@preposition` on authors, `@query` on series titles, `@dsname` on enrich matches, `@sort`/`@undup-all-search`/`@icon`/`@format-raw`/`@language-raw`/`@publisher` on undup blocks, `@date`/`@today` on weekdays, `@is-lead`/`@ibl`/`@avail-id` on availability items. |
| Facets are two levels | `<facets><facet id=… translation=…><value count=… id=… translation=…/></facet></facets>` on both `/search/?refine=true` and `/refine/`. The doc flattens them. |
| `/index/all/` | Returns `results/facets/facet@label` and `results/searchmethods/index@type@retrievable` — not `results/result@index@is-dimension`. |
| `/index/{indexType}/` | Entries are `<result>` elements **directly under the root**; there is no `<results>` wrapper. |
| `/resolver/` | The `<results>` wrapper carries `@type`, echoing the identifier type. |
| Index types | `/index/bogus/` returns `404` naming the allowed indexes: `author, awards, subject, language, format, targetaudience, readinglevel, type, genre, review`. The doc writes `subjects` (plural) and omits `review`. |
| `sort` errors | An unknown `sort` yields `500` from the sorter, not a `409` validation error. Same for an unknown `s` subset. |
| `output=json` | Undocumented, but real on `/search/`, `/details/` and `/availability/` — including error bodies. See caveats below. |
| `/locations` | Not modelled. The doc's own example points at the legacy host `hs.aquabrowser.be`, and the path returns `404` on the current service. |

## The JSON format

`output=json` is undocumented upstream, so the JSON schemas in `openapi.json` were derived from
live responses across a spread of queries (music, magazine articles, games, awards, series,
translated works) at `detaillevel=extended` and `librarian`. `test/live.test.js` asserts that no
key appearing in a live payload is missing from the schemas, so the JSON documentation cannot
drift silently.

Schemas: `SearchJsonResponse`, `DetailsJsonResponse`, `AvailabilityJsonResponse`, with
`RecordJson`, `AuthorJson`, `FormatJson`, `SeriesJson`, `FrablJson`, `UndupJson`,
`EnrichInfoJson`, `MagazineJson`, `CustomJson`, `Marc21Json`, `Marc21DataField`,
`AvailabilityLocationJson` and `AvailabilityItemJson`.

It is **not** a transliteration of the XML:

| XML | JSON |
|---|---|
| `detail-page` | `detailLink` |
| `enrich-info` | `enrichInfo` |
| `undup-info` | `undup` |
| `topical-subject` / `local-subject` | `subject-topical` / `subject-local` |
| `contents-note` / `technical-note` | `contents` / `technicalinfo` |
| `awards` (list) | `award` (single string) |
| `identifiers/{isbn,ean,issn,publishernumber}` | only `isbn` and `cdr` |
| `meta/rctx` | absent — no `rctx` in any JSON response |
| nested `locations/location/holding` tree | flat `availability[]` array of locations |

Further gaps worth knowing before choosing JSON:

* **Every scalar is a string** — counts and booleans included: `"cnt": "83"`, `"available": "true"`.
* Absent values in availability items come back as `""` rather than being omitted.
* `/details/` JSON has no counterpart for the XML `branches`, `ratings` (kijkwijzer, PEGI) or
  `reviews` blocks; `/availability/` JSON has no opening hours, addresses or source `records`.
  Those need XML.
* `marc21` (from `detaillevel=extended`) is a faithful MARC record: `fields[]` holds one
  single-key object per field, keyed by MARC tag — control fields map to a string, data fields to
  `{ind1, ind2, subfields[]}` where each subfield is itself a single-key object.

### `output=json` caveats

* The body starts with a **UTF-8 BOM** (`EF BB BF`). WHATWG `fetch().text()` strips it silently,
  so JavaScript callers may never notice; decoders working on the raw bytes — `json.loads` in
  Python, for instance — throw unless it is stripped first.
* Keys do **not** mirror the XML element names — `detailLink`, `authorsDetailed`,
  `alsoAvailableAsCount`, `subject-local`.
* The `facets` block is **silently dropped**: `refine=true` with `output=json` returns only
  `{meta, results}`, while the same query in XML returns `<facets>`.
* On `/refine/`, `/index/` and `/resolver/` the service answers `Content-Type: application/json`
  with an **XSLT error in the body**. Those operations are XML-only in the spec.

## What the bundled test key cannot reach

These are described in the spec but skipped in `test/live.test.js`, each with its reason printed
in the run:

| Skipped | Why |
|---|---|
| `POST /search-availability/` with a real body | `zbb` is a union catalogue with no Wise locationcode (`404 holding does not have a wise locationcode`). Needs a single-library profile. |
| `GET /holdings/…` | Returns `502` on staging; only production serves it. |
| `GET /index/all/` without a profile | Returns `502` on staging; only production serves the global variant. |
| `GET /availability/?global=true` | Returns `502` on staging, and global access is granted per key on request. |
| `pagesize` above 20 | The key is not entitled; staging resets the connection rather than returning an error. |
| Profiles other than `zbb` | `/staging/wetteren/search` → `401 The provided authorization key is not configured.` |

## Rich vs free API

The key determines which tier you get. Fields the free API withholds — `coverimages`,
`summaries`, `reviews` — say so in their schema descriptions. Rich-API use is limited to
non-commercial applications that promote the reach of Flemish or Brussels public libraries.

## Files

```
openapi.json             OpenAPI 3.1 description
redocly.yaml             lint config (two rules disabled, each with its reason)
samples/                 real captured responses, XML and JSON
test/helpers.js          token loading, spec-driven URL building, BOM-safe JSON parsing
test/xml-model.js        derives allowed XML elements/attributes from the spec
test/spec-valid.test.js  structural and consistency checks (offline)
test/live.test.js        contract tests against staging/zbb, incl. XML + JSON schema fidelity
docs/index.html          generated by `npm run docs:build` (gitignored)
```
