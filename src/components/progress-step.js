import { OpenCellsElement, WidgetMixin } from '../component-runtime.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { html, LitElement } from 'lit';

export class OpenCellsProgressStep extends WidgetMixin(ScopedElementsMixin(LitElement)) {
  static properties = OpenCellsElement.properties;

  static get scopedElements() {
    return { ...super.scopedElements };
  }

  static styles = OpenCellsElement.styles;

  static get defaultLocale() {
    return { label: "Progress Step", action: 'Continue' };
  }

  constructor() {
    super();
    this.label = '';
    this.value = '';
    this.href = '#';
    this.disabled = false;
    this.locale = undefined;
  }

  get componentKind() {
    return "action";
  }

  render() {
    const label = this.label || this.t('label');
    const event = event => {
      if (this.componentKind === 'form') this.readControlValue(event);
      const detail = { component: this.tagName.toLowerCase(), value: this.value };
      if (this.componentKind === 'form' && ['checkbox', 'radio', 'toggle'].includes(this.controlType)) detail.checked = this.checked;
      this.emitEvent('activate', detail);
    };
    if (this.componentKind === 'action') return this.renderButton(label, event);
    if (this.componentKind === 'form') return this.renderInput(label, event);
    if (this.componentKind === 'link') return this.renderLink(label, event);
    if (this.componentKind === 'badge') return this.renderBadge(label);
    if (this.componentKind === 'content') return html`<span class="muted">${label}</span>`;
    return html`<article><header><span>${label}</span><span class="badge">${this.t('brand' )}</span></header><slot></slot><button type="button" ?disabled=${this.disabled} @click=${event}>${this.t('action')}</button></article>`;
  }

  renderButton(label, event) {
    return html`<button type="button" ?disabled=${this.disabled} @click=${event}>${label}</button>`;
  }

  renderInput(label, event) {
    return this.renderFormControl(label, event);
  }

  renderLink(label, event) {
    return this.renderLinkControl(label, event);
  }

  renderBadge(label) {
    return html`<span class="badge" role="status">${label}</span>`;
  }
}
