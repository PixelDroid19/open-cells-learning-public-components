import { OpenCellsChatForm } from './chat-form.js';

if (customElements.get('open-cells-chat-form') === undefined) customElements.define('open-cells-chat-form', OpenCellsChatForm);

export { OpenCellsChatForm };
