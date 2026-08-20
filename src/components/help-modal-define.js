import { OpenCellsHelpModal } from './help-modal.js';

if (customElements.get('open-cells-help-modal') === undefined) customElements.define('open-cells-help-modal', OpenCellsHelpModal);

export { OpenCellsHelpModal };
