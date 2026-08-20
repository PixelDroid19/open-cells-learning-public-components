import '@webcomponents/scoped-custom-element-registry';
import { css, LitElement, html, nothing } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';

const FORM_CONTROL_TYPES = Object.freeze({
  'form-checkbox': 'checkbox',
  'form-date-range': 'date',
  'form-calendar': 'date',
  'form-multiselect': 'select',
  'form-select': 'select',
  'form-select-filter': 'select',
  'form-range': 'range',
  'form-rating': 'range',
  'form-radio-button': 'radio',
  'form-toggle': 'toggle',
  'form-uploader': 'file'
});

export const controlTypeForTag = tagName => {
  const slug = String(tagName || '').toLowerCase().replace(/^open-cells-/, '');
  return FORM_CONTROL_TYPES[slug] || 'text';
};

const optionValue = option => typeof option === 'object' && option !== null ? option.value ?? option.label ?? '' : option;
const optionLabel = option => typeof option === 'object' && option !== null ? option.label ?? option.value ?? '' : option;

export const WidgetMixin = superclass => class extends superclass {
  t(key, values = {}) {
    const source = this.locale && typeof this.locale === 'object' ? this.locale[key] : undefined;
    const defaults = this.defaultLocale ?? this.constructor.defaultLocale;
    const text = source ?? defaults?.[key] ?? (key === 'brand' ? 'Open Cells' : key === 'action' ? 'Continue' : key);
    return String(text).replace(/\{(\w+)\}/gu, (_, name) => values[name] === undefined ? '' : String(values[name]));
  }

  emitEvent(type, detail = {}) {
    const eventName = this.tagName.toLowerCase() + '-' + type;
    this.dispatchEvent(new CustomEvent(eventName, { bubbles: true, composed: true, cancelable: true, detail }));
  }

  get controlType() {
    return controlTypeForTag(this.tagName);
  }

  get optionItems() {
    return Array.isArray(this.options) ? this.options : [];
  }

  readControlValue(event) {
    const target = event?.target;
    if (!target) return;
    this.value = target.value ?? '';
    if (this.controlType === 'checkbox' || this.controlType === 'radio' || this.controlType === 'toggle') {
      this.checked = Boolean(target.checked);
    }
  }

  renderFormControl(label, event) {
    const type = this.controlType;
    const options = this.optionItems;
    const multiple = this.multiple || this.tagName.toLowerCase() === 'open-cells-form-multiselect';
    if (type === 'select') {
      const placeholder = this.t('placeholder');
      return html`<label><span class="muted">${label}</span><select ?multiple=${multiple} ?disabled=${this.disabled} .value=${this.value || ''} @change=${event} aria-label=${label}>${options.length ? options.map(option => html`<option value=${optionValue(option)}>${optionLabel(option)}</option>`) : html`<option value="">${placeholder}</option>`}</select></label>`;
    }
    if (type === 'checkbox' || type === 'radio' || type === 'toggle') {
      const inputType = type === 'toggle' ? 'checkbox' : type;
      return html`<label class="choice"><input type=${inputType} value=${this.value || 'on'} .checked=${Boolean(this.checked)} ?disabled=${this.disabled} @change=${event} role=${type === 'toggle' ? 'switch' : nothing} aria-label=${label}><span class="muted">${label}</span></label>`;
    }
    const numeric = type === 'range';
    const file = type === 'file';
    return html`<label><span class="muted">${label}</span><input type=${type} .value=${file ? nothing : (this.value || '')} ?disabled=${this.disabled} min=${numeric && this.min !== undefined ? this.min : nothing} max=${numeric && this.max !== undefined ? this.max : nothing} step=${numeric && this.step !== undefined ? this.step : nothing} @input=${event} @change=${event} aria-label=${label}></label>`;
  }

  renderLinkControl(label, event) {
    const handleClick = clickEvent => {
      if (this.disabled) {
        clickEvent.preventDefault();
        clickEvent.stopPropagation();
        return;
      }
      event(clickEvent);
    };
    return html`<a href=${this.href} aria-disabled=${this.disabled ? 'true' : 'false'} tabindex=${this.disabled ? '-1' : '0'} @click=${handleClick}>${label}</a>`;
  }
};

export class OpenCellsElement extends WidgetMixin(ScopedElementsMixin(LitElement)) {
  static properties = {
    label: { type: String },
    value: { type: String },
    href: { type: String },
    disabled: { type: Boolean, reflect: true },
    checked: { type: Boolean, reflect: true },
    options: { attribute: false },
    multiple: { type: Boolean },
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
    locale: { attribute: false }
  };

  static styles = css`
    :host { display: block; color: #17213a; font: 400 1rem/1.45 system-ui, sans-serif; }
    article, section { display: grid; gap: .8rem; border: 1px solid #dbe3ef; border-radius: 1rem; padding: 1rem; background: #fff; box-shadow: 0 8px 22px rgb(15 23 42 / 8%); }
    header { display: flex; align-items: center; justify-content: space-between; gap: .75rem; color: #52627a; font-size: .78rem; font-weight: 700; }
    button, a { min-height: 2.75rem; border: 0; border-radius: .75rem; padding: .7rem 1rem; background: var(--open-cells-action-background, #17213a); color: var(--open-cells-action-text, #fff); font: inherit; font-weight: 700; text-align: center; text-decoration: none; cursor: pointer; }
    button:hover:not(:disabled), a:hover { background: var(--open-cells-action-hover, #283653); }
    button:focus-visible, a:focus-visible, input:focus-visible { outline: 3px solid #38bdf8; outline-offset: 3px; }
    button:disabled { cursor: not-allowed; opacity: .5; }
    label { display: grid; gap: .35rem; min-width: 0; }
    label.choice { display: flex; align-items: center; gap: .5rem; }
    label.choice input { width: auto; }
    input, select { box-sizing: border-box; width: 100%; min-height: 2.75rem; border: 1px solid #b9c7d9; border-radius: .65rem; padding: 0 .75rem; background: var(--open-cells-control-background, #fff); color: var(--open-cells-control-text, #17213a); font: inherit; }
    select { cursor: pointer; }
    input[type=file] { box-sizing: border-box; width: 100%; background: #fff; color: #17213a; }
    input[type=file]::file-selector-button { margin: -.1rem .75rem -.1rem -.2rem; border: 0; border-radius: .45rem; padding: .45rem .7rem; background: #e8eef7; color: #17213a; font: inherit; font-weight: 700; cursor: pointer; }
    .badge { display: inline-flex; width: fit-content; align-items: center; border: 1px solid #a7f3d0; border-radius: 999px; padding: .25rem .65rem; background: #ecfdf5; color: #047857; font-size: .78rem; font-weight: 700; }
    .muted { color: var(--open-cells-muted, #52627a); }
  `;

  constructor() {
    super();
    this.label = '';
    this.value = '';
    this.href = '#';
    this.disabled = false;
    this.checked = false;
    this.options = [];
    this.multiple = false;
    this.locale = undefined;
  }

  get defaultLocale() {
    return { label: this.getAttribute('label') || 'Open Cells component' };
  }

  get componentKind() {
    return 'content';
  }

  render() {
    const label = this.label || this.t('label');
    const event = event => {
      if (this.componentKind === 'form') this.readControlValue(event);
      this.emitEvent('activate', { component: this.tagName.toLowerCase(), value: this.value });
    };
    if (this.componentKind === 'action') return html`<button type="button" ?disabled=${this.disabled} @click=${event}>${label}</button>`;
    if (this.componentKind === 'form') return this.renderFormControl(label, event);
    if (this.componentKind === 'link') return this.renderLinkControl(label, event);
    if (this.componentKind === 'badge') return html`<span class="badge" role="status">${label}</span>`;
    if (this.componentKind === 'content') return html`<span class="muted">${label}</span>`;
    return html`<article><header><span>${label}</span><span class="badge">${this.t('brand')}</span></header><slot></slot><button type="button" ?disabled=${this.disabled} @click=${event}>${this.t('action')}</button></article>`;
  }
}
