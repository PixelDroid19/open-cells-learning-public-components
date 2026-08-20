import { OpenCellsChatContainer } from './chat-container.js';

if (customElements.get('open-cells-chat-container') === undefined) customElements.define('open-cells-chat-container', OpenCellsChatContainer);

export { OpenCellsChatContainer };
