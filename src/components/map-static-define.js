import { OpenCellsMapStatic } from './map-static.js';

if (customElements.get('open-cells-map-static') === undefined) customElements.define('open-cells-map-static', OpenCellsMapStatic);

export { OpenCellsMapStatic };
