import { OpenCellsNotificationMessage } from './notification-message.js';

if (customElements.get('open-cells-notification-message') === undefined) customElements.define('open-cells-notification-message', OpenCellsNotificationMessage);

export { OpenCellsNotificationMessage };
