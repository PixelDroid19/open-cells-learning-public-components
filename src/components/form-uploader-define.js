import { OpenCellsFormUploader } from './form-uploader.js';

if (customElements.get('open-cells-form-uploader') === undefined) customElements.define('open-cells-form-uploader', OpenCellsFormUploader);

export { OpenCellsFormUploader };
