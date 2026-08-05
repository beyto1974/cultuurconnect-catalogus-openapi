/**
 * Derives the set of XML element names, and the attributes allowed on each, from
 * components.schemas in openapi.json.
 *
 * The XML schemas were originally written from the published documentation and were wrong
 * in several places — `/details/` has no `<record>` wrapper, container elements carry no
 * `@search-*` attributes, `classifications` is really `classification`, and so on. This
 * model lets the live tests assert that every element and attribute the service actually
 * emits is described, so that class of drift cannot come back unnoticed.
 *
 * Matching is by element name rather than by path: it is the check that catches missing
 * elements and missing attributes, without reimplementing an XML schema validator.
 */

/** True for a property that models an XML attribute. */
const isAttribute = (prop) => prop?.xml?.attribute === true

/** True for a property that models the element's own character data. */
const isText = (prop) => prop?.['x-xml-text'] === true

export function buildXmlModel(spec) {
  const schemas = spec.components.schemas
  /** element name -> Set of attribute names allowed on it */
  const attrs = new Map()
  /** every element name the spec can produce */
  const elements = new Set()

  const addAttr = (element, name) => {
    if (!attrs.has(element)) attrs.set(element, new Set())
    attrs.get(element).add(name)
  }

  const resolve = (node) =>
    node?.$ref ? schemas[node.$ref.split('/').pop()] : node

  /** Flatten allOf so DetailsResponse contributes both its own and Record's properties. */
  const propertiesOf = (schema) => {
    const out = {}
    for (const branch of [schema, ...(schema?.allOf ?? [])]) {
      const r = resolve(branch)
      Object.assign(out, r?.properties ?? {})
    }
    return out
  }

  /**
   * A shared schema is reused under many element names — `SearchLinkText` is `<title>` in one
   * place and `<genre>` in another, and `Author` is both `<author>` and `<main-author>`. The
   * element name comes from the property that points at it, so the referenced schema's
   * attributes have to be registered under that name too.
   */
  const registerRefAttrs = (element, node) => {
    const target = resolve(node)
    if (!target) return
    for (const branch of [target, ...(target.allOf ?? [])]) {
      const r = resolve(branch)
      for (const [k, p] of Object.entries(r?.properties ?? {})) {
        if (isAttribute(p)) addAttr(element, p.xml?.name ?? k)
      }
    }
  }

  /**
   * Register one property as it appears in XML, under the element that encloses it.
   * `owner` is the element name the property's attributes belong to.
   */
  const visitProperty = (owner, key, prop) => {
    if (isText(prop)) return
    if (isAttribute(prop)) {
      addAttr(owner, prop.xml?.name ?? key)
      return
    }

    if (prop.type === 'array') {
      const itemName = prop.xml?.name ?? key
      if (prop.xml?.wrapped) elements.add(key) // the wrapper element
      elements.add(itemName)
      registerRefAttrs(itemName, prop.items)
      visitInline(itemName, prop.items)
      return
    }

    const name = prop.xml?.name ?? key
    elements.add(name)
    registerRefAttrs(name, prop)
    visitInline(name, prop)
  }

  /**
   * Inline (non-$ref) object schemas still describe elements and attributes; walk them so
   * things like `meta`, `ratings` and `publication` are covered.
   */
  const visitInline = (owner, node) => {
    if (!node || node.$ref) return // $ref targets are visited as top-level schemas
    for (const [k, p] of Object.entries(node.properties ?? {})) visitProperty(owner, k, p)
    for (const branch of node.allOf ?? []) visitInline(owner, branch)
    if (node.items) visitInline(owner, node.items)
  }

  for (const [name, schema] of Object.entries(schemas)) {
    const owner = schema.xml?.name ?? name
    elements.add(owner)
    for (const [k, p] of Object.entries(propertiesOf(schema))) visitProperty(owner, k, p)
  }

  // A schema's attributes apply wherever that schema is used, and several schemas share an
  // element name (every `Facet` is a `<facet>`), so the attribute sets are unions by design.
  return { elements, attrs }
}

/** Walk a parsed XML document, yielding {tag, attributes} for every element. */
export function walkXml(node, out = []) {
  out.push({ tag: node.tagName, attributes: Object.keys(node.attributes ?? {}) })
  for (const child of node.children ?? []) walkXml(child, out)
  return out
}

/**
 * Minimal XML reader: enough to get element names and attribute names out of the
 * service's responses without pulling in a parser dependency.
 */
export function parseXml(text) {
  const src = text.replace(/^﻿/, '').replace(/<\?xml[^>]*\?>/g, '').replace(/<!--[\s\S]*?-->/g, '')
  const tagRe = /<(\/)?([\w:.-]+)((?:\s+[\w:.-]+\s*=\s*"[^"]*")*)\s*(\/)?>/g
  const attrRe = /([\w:.-]+)\s*=\s*"([^"]*)"/g

  const root = { tagName: null, attributes: {}, children: [] }
  const stack = [root]
  let m
  while ((m = tagRe.exec(src)) !== null) {
    const [, closing, tagName, rawAttrs, selfClosing] = m
    if (closing) {
      if (stack.length > 1) stack.pop()
      continue
    }
    const attributes = {}
    let a
    while ((a = attrRe.exec(rawAttrs ?? '')) !== null) attributes[a[1]] = a[2]
    const el = { tagName, attributes, children: [] }
    stack[stack.length - 1].children.push(el)
    if (!selfClosing) stack.push(el)
  }
  return root.children[0]
}
