import { OpenCellsNavigationMenu } from './navigation-menu.js';

if (customElements.get('open-cells-navigation-menu') === undefined) customElements.define('open-cells-navigation-menu', OpenCellsNavigationMenu);

export { OpenCellsNavigationMenu };
