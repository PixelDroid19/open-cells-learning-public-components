import { OpenCellsProgressTimer } from './progress-timer.js';

if (customElements.get('open-cells-progress-timer') === undefined) customElements.define('open-cells-progress-timer', OpenCellsProgressTimer);

export { OpenCellsProgressTimer };
