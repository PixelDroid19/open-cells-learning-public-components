import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('publishes 106 neutral public components with self-contained metadata', async () => {
  const catalog = JSON.parse(await readFile(join(root, 'catalog.json'), 'utf8'));
  assert.equal(catalog.schemaVersion, 1);
  assert.equal(catalog.components.length, 106);
  assert.equal(new Set(catalog.components.map(component => component.slug)).size, 106);
  assert.equal(catalog.components.every(component => component.packageName.startsWith('@open-cells-learning/')), true);
  assert.equal(catalog.components.every(component => component.tagName.startsWith('open-cells-')), true);
  assert.equal(catalog.components.every(component => component.importPath.startsWith('./src/components/')), true);
  assert.equal(JSON.stringify(catalog).includes(['/run', 'media'].join('/')), false);
  assert.equal(JSON.stringify(catalog).includes(['arti', 'factory'].join('')), false);
});

test('keeps the generated import and registration modules aligned with the catalog', async () => {
  const catalog = JSON.parse(await readFile(join(root, 'catalog.json'), 'utf8'));
  const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
  assert.equal(packageJson.dependencies.lit, '^3.3.3');
  assert.equal(packageJson.dependencies['@open-wc/scoped-elements'], '^3.0.10');
  assert.equal(packageJson.dependencies['@webcomponents/scoped-custom-element-registry'], '0.0.10');
  for (const component of catalog.components) {
    const source = await readFile(join(root, component.importPath.replace('./', '')), 'utf8');
    await readFile(join(root, component.definePath.replace('./', '')), 'utf8');
    assert.match(source, /WidgetMixin\(ScopedElementsMixin\(LitElement\)\)/u);
    assert.match(source, /static get scopedElements\(\)/u);
    assert.match(source, /this\.t\(/u);
    assert.match(source, /this\.emitEvent\(/u);
  }
});

test('keeps generated documentation portable and locale catalogs complete', async () => {
  const docs = JSON.parse(await readFile(join(root, 'custom-elements.json'), 'utf8'));
  assert.equal(docs.schemaVersion, '1.0.0');
  assert.equal(JSON.stringify(docs).includes(['/run', 'media'].join('/')), false);
  const readme = await readFile(join(root, 'README.md'), 'utf8');
  assert.equal(readme.includes(['/run', 'media'].join('/')), false);
  assert.equal(readme.includes(['arti', 'factory'].join('')), false);
  const english = JSON.parse(await readFile(join(root, 'locales/en.json'), 'utf8'));
  const spanish = JSON.parse(await readFile(join(root, 'locales/es.json'), 'utf8'));
  const catalog = JSON.parse(await readFile(join(root, 'catalog.json'), 'utf8'));
  assert.deepEqual(Object.keys(english).sort(), catalog.components.map(component => component.slug).sort());
  assert.deepEqual(Object.keys(spanish).sort(), Object.keys(english).sort());
});
