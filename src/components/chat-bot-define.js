import { OpenCellsChatBot } from './chat-bot.js';

if (customElements.get('open-cells-chat-bot') === undefined) customElements.define('open-cells-chat-bot', OpenCellsChatBot);

export { OpenCellsChatBot };
