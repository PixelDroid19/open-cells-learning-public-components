# Open Cells public components

This package is a neutral, public learning library containing 106 reusable Lit components. It ships only its own source, demos, locale catalogs, documentation, and tests.

## Cells patterns

Every element follows the same public Cells teaching contract:

- `WidgetMixin(ScopedElementsMixin(LitElement)` as the host class pattern.
- `static get scopedElements()` for scoped registration.
- `this.t(key)` for visible labels and actions.
- `this.emitEvent(type, detail)` for bubbling, composed custom events.
- `locales/en.json` and `locales/es.json` for deterministic demo/test catalogs.

The form family keeps native control semantics: checkbox/radio/toggle components
expose `checked`, range/rating expose `min`, `max` and `step`, select families
accept an `options` array, and uploader uses a file input. Disabled actions and
links do not emit activation events. This keeps the examples useful inside a
real Cells page instead of making every component a visual placeholder.

The scoped custom-element registry polyfill is a runtime dependency because native `ShadowRoot` does not provide the `importNode` behavior required by the current scoped-elements adapter in every supported browser.

## Use a component

Install it directly from GitHub in any npm project:

```sh
npm install https://codeload.github.com/PixelDroid19/open-cells-learning-public-components/tar.gz/refs/heads/main
```

```js
import '@webcomponents/scoped-custom-element-registry';
import '@open-cells-learning/public-components/components/button-default-define.js';

const button = document.createElement('open-cells-button-default');
button.addEventListener('open-cells-button-default-activate', event => {
  console.log(event.detail);
});
document.body.append(button);
```

The complete neutral catalog is in [`catalog.json`](./catalog.json), and generated custom-element metadata is in [`custom-elements.json`](./custom-elements.json). Every entry uses an `open-cells-*` tag and is exported through the package subpath `./components/*`.

## Demo and checks

From this package directory:

```sh
cells component:dev
cells component:build:demo
cells component:test
cells component:test --coverage
node --test test/catalog.test.js
cells component:locales
cells component:documentation
```

The demo includes the 106-element gallery, English/Spanish locale switching, and an event inspector. It is a neutral learning surface with explicit public contracts and testable behavior.

`component:test` is the canonical unit-test command for this Lit/Vite package.
Coverage is written to `test/coverage/lcov.info`; a WTR runner is not enabled in
this modern package, so use the Vitest command above rather than treating a
failed `--wtr` invocation as a passing test.
