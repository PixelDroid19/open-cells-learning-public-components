import * as PropertySymbol from 'happy-dom/lib/PropertySymbol.js';

const scopedRegistry = Symbol('publicComponentsScopedRegistry');
const aliases = new WeakMap();
let aliasNumber = 0;

const aliasFor = constructor => {
  let alias = aliases.get(constructor);
  if (alias === undefined) {
    alias = 'public-components-scoped-' + aliasNumber++;
    customElements.define(alias, constructor);
    aliases.set(constructor, alias);
  }
  return alias;
};

const upgradeScopedChildren = (root, fragment) => {
  const registry = root[scopedRegistry];
  for (const [tagName, definition] of registry.entries()) {
    for (const placeholder of fragment.querySelectorAll(tagName)) {
      const element = document.createElement(definition.alias);
      for (const attribute of placeholder.attributes) element.setAttribute(attribute.name, attribute.value);
      element.append(...placeholder.childNodes);
      element[PropertySymbol.tagName] = tagName.toUpperCase();
      element[PropertySymbol.localName] = tagName;
      placeholder.replaceWith(element);
      element.connectedCallback();
    }
  }
  return fragment;
};

class TestScopedRegistry {
  constructor() { this.definitions = new Map(); }
  define(tagName, constructor) {
    if (this.definitions.has(tagName)) throw new Error(`Duplicate scoped element: ${tagName}`);
    this.definitions.set(tagName, { constructor, alias: aliasFor(constructor) });
  }
  get(tagName) { return this.definitions.get(tagName)?.constructor; }
  entries() { return this.definitions.entries(); }
}

globalThis.CustomElementRegistry = TestScopedRegistry;
const attachShadow = HTMLElement.prototype.attachShadow;
HTMLElement.prototype.attachShadow = function attachScopedShadow(options) {
  const root = attachShadow.call(this, options);
  const registry = options.registry ?? options.customElements;
  if (registry instanceof TestScopedRegistry) {
    root[scopedRegistry] = registry;
    const scope = root.importNode === undefined ? root.ownerDocument : root;
    const importNode = scope.importNode;
    root.importNode = (node, deep) => upgradeScopedChildren(root, importNode.call(scope, node, deep));
  }
  return root;
};
