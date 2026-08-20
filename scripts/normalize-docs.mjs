import { readFile, writeFile } from 'node:fs/promises';

const packageRoot = new URL('../', import.meta.url);
const marker = '/packages/public-components/';

const portable = value => {
  if (typeof value === 'string') {
    const index = value.indexOf(marker);
    return index >= 0 ? value.slice(index + marker.length) : value;
  }
  if (Array.isArray(value)) return value.map(portable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, portable(item)]));
  }
  return value;
};

const customElementsPath = new URL('custom-elements.json', packageRoot);
const customElements = JSON.parse(await readFile(customElementsPath, 'utf8'));
await writeFile(customElementsPath, `${JSON.stringify(portable(customElements), null, 2)}\n`);

const readmePath = new URL('README.md', packageRoot);
const readme = await readFile(readmePath, 'utf8');
const firstPath = readme.indexOf(['/run', 'media'].join('/'));
const markerIndex = readme.indexOf(marker, firstPath);
const absolutePrefix = firstPath >= 0 && markerIndex >= 0 ? readme.slice(firstPath, markerIndex + marker.length) : '';
await writeFile(readmePath, absolutePrefix ? readme.split(absolutePrefix).join('') : readme);
