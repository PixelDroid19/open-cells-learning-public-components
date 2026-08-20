import { OpenCellsNotificationToast } from './notification-toast.js';

if (customElements.get('open-cells-notification-toast') === undefined) customElements.define('open-cells-notification-toast', OpenCellsNotificationToast);

export { OpenCellsNotificationToast };
