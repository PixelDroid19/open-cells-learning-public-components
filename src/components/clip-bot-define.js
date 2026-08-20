import { OpenCellsClipBot } from './clip-bot.js';

if (customElements.get('open-cells-clip-bot') === undefined) customElements.define('open-cells-clip-bot', OpenCellsClipBot);

export { OpenCellsClipBot };
