import { OpenCellsFormScanner } from './form-scanner.js';

if (customElements.get('open-cells-form-scanner') === undefined) customElements.define('open-cells-form-scanner', OpenCellsFormScanner);

export { OpenCellsFormScanner };
