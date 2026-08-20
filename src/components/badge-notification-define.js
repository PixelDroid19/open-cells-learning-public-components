import { OpenCellsBadgeNotification } from './badge-notification.js';

if (customElements.get('open-cells-badge-notification') === undefined) customElements.define('open-cells-badge-notification', OpenCellsBadgeNotification);

export { OpenCellsBadgeNotification };
