# Changelog

Versions refer to `openapi.json` (`info.version`) — this document's own contract, not the
Cultuurconnect API, which is unversioned and unchanged throughout.

## 2.0.0

Corrections found by probing the live service. Several of these change what a generated client
does, hence the major bump.

### Breaking

- **`/holdings/{holdingPath}` is now `/holdings/{holdingPath}/`.** The service requires the
  trailing slash — without it the request 404s — so the previous path key produced a broken
  call. Regenerate any client built from 1.0.0.
- **Removed the `coversize` parameter from `/search/`.** It does not exist: the service answers
  `409 FailedValidation — Unknown Parameter: coversize`. Parameter *names* are validated
  strictly, so sending it broke the whole request rather than being ignored. It came from the
  published documentation's prose, which is wrong about it. How cover image size is chosen is
  undocumented.
- **Removed the `404` from `/resolver/{idType}/`.** It never occurs. An unrecognised identifier
  type returns `200` with zero results, so a typo fails silently. The `idType` enum is this
  document's constraint, not the server's.

### Fixed

- A `500` reports the code `InternalError`, not `ServerError`, and honours `output=json`; the
  `ServerError` response now offers a JSON body.
- `/holdings/` documents the `409` it returns for an unparseable parameter.
- `/index/{indexType}/` `pagesize` maximum corrected from 20 to 100 — the service reports its
  ceiling as `pagesize/@enforcedmaximum` and silently clamps rather than erroring, so the old
  bound made generated clients reject legal requests.
- Every operation now accepts `output`. Error bodies honour `output=json` on *all* endpoints;
  only the success body is XML-only on `/refine/`, `/index/`, `/resolver/`, `/holdings/` and
  `/search-availability/`, where a 200 returns `Content-Type: application/json` wrapped around
  an XML error body. The descriptions previously said "XML only", which was overbroad.

### Tests

Each of the above is now guarded, so the class of mistake cannot recur silently:

- every declared query parameter is sent to the live API and must not be rejected as unknown;
- every path template must end with a slash;
- regression locks for the lying content-type, the silent-empty resolver, and `pagesize`
  clamping.

## 1.0.0

Initial description: nine operations, full XML and JSON response schemas, verified against
`https://cataloguswebservices.bibliotheek.be/staging/zbb` by a contract test suite.

Published but never consumed — GitHub reports zero clones, views and forks for its lifetime, so
no client was generated from it.
