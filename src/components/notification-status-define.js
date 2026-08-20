import { OpenCellsNotificationStatus } from './notification-status.js';

if (customElements.get('open-cells-notification-status') === undefined) customElements.define('open-cells-notification-status', OpenCellsNotificationStatus);

export { OpenCellsNotificationStatus };
