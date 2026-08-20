import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { beforeEach, describe, expect, it } from 'vitest';
import { OpenCellsButtonDefault } from '../../src/components/button-default.js';
import { OpenCellsFormInput } from '../../src/components/form-input.js';
import { OpenCellsPanelContainer } from '../../src/components/panel-container.js';
import { OpenCellsElement } from '../../src/component-runtime.js';
import catalog from '../../catalog.json' with { type: 'json' };
import '../../src/components/button-default-define.js';
import '../../src/components/form-checkbox-define.js';
import '../../src/components/form-input-define.js';
import '../../src/components/form-range-define.js';
import '../../src/components/form-select-define.js';
import '../../src/components/panel-container-define.js';
import '../../src/components/type-link-define.js';

const settle = element => element.updateComplete;

beforeEach(() => document.body.replaceChildren());

describe('public component behavior', () => {
  it('renders the default label and emits a composed component event', async () => {
    const button = document.createElement('open-cells-button-default');
    document.body.append(button);
    await settle(button);
    const event = new Promise(resolve => button.addEventListener('open-cells-button-default-activate', resolve, { once: true }));
    button.shadowRoot.querySelector('button').click();
    const result = await event;
    expect(button.shadowRoot.querySelector('button').textContent).toBe('Button Default');
    expect(result.detail).toEqual({ component: 'open-cells-button-default', value: '' });
    expect(result.bubbles).toBe(true);
    expect(result.composed).toBe(true);
  });

  it('updates a form value before emitting its event', async () => {
    const input = document.createElement('open-cells-form-input');
    document.body.append(input);
    await settle(input);
    const control = input.shadowRoot.querySelector('input');
    const event = new Promise(resolve => input.addEventListener('open-cells-form-input-activate', resolve, { once: true }));
    control.value = 'learn cells';
    control.dispatchEvent(new Event('input', { bubbles: true }));
    const result = await event;
    expect(input.value).toBe('learn cells');
    expect(result.detail.value).toBe('learn cells');
  });

  it('maps checkbox semantics to checked state and event detail', async () => {
    const checkbox = document.createElement('open-cells-form-checkbox');
    document.body.append(checkbox);
    await settle(checkbox);
    const control = checkbox.shadowRoot.querySelector('input');
    expect(control.type).toBe('checkbox');
    const event = new Promise(resolve => checkbox.addEventListener('open-cells-form-checkbox-activate', resolve, { once: true }));
    control.click();
    const result = await event;
    expect(checkbox.checked).toBe(true);
    expect(result.detail.checked).toBe(true);
    expect(result.detail.value).toBe('on');
  });

  it('renders a select with options and keeps the selected value', async () => {
    const select = document.createElement('open-cells-form-select');
    select.options = [{ value: 'learn', label: 'Learn' }, { value: 'build', label: 'Build' }];
    document.body.append(select);
    await settle(select);
    const control = select.shadowRoot.querySelector('select');
    expect(control).not.toBeNull();
    expect([...control.options].map(option => option.value)).toEqual(['learn', 'build']);
    const event = new Promise(resolve => select.addEventListener('open-cells-form-select-activate', resolve, { once: true }));
    control.value = 'build';
    control.dispatchEvent(new Event('change', { bubbles: true }));
    const result = await event;
    expect(select.value).toBe('build');
    expect(result.detail.value).toBe('build');
  });

  it('uses range input semantics and emits a numeric value', async () => {
    const range = document.createElement('open-cells-form-range');
    range.min = 0;
    range.max = 10;
    range.value = '2';
    document.body.append(range);
    await settle(range);
    const control = range.shadowRoot.querySelector('input');
    expect(control.type).toBe('range');
    const event = new Promise(resolve => range.addEventListener('open-cells-form-range-activate', resolve, { once: true }));
    control.value = '7';
    control.dispatchEvent(new Event('input', { bubbles: true }));
    const result = await event;
    expect(range.value).toBe('7');
    expect(result.detail.value).toBe('7');
  });

  it('gives every form family a native control suitable for a real page', async () => {
    const expected = {
      'form-calendar': 'date',
      'form-checkbox': 'checkbox',
      'form-date-range': 'date',
      'form-input': 'text',
      'form-multiselect': 'select',
      'form-radio-button': 'radio',
      'form-range': 'range',
      'form-rating': 'range',
      'form-select': 'select',
      'form-select-filter': 'select',
      'form-toggle': 'checkbox',
      'form-uploader': 'file'
    };
    for (const [slug, type] of Object.entries(expected)) {
      await import(`../../src/components/${slug}-define.js`);
      const element = document.createElement(`open-cells-${slug}`);
      document.body.append(element);
      await settle(element);
      const control = element.shadowRoot.querySelector('input, select');
      expect(control, slug).not.toBeNull();
      const actualType = control.tagName.toLowerCase() === 'select' ? 'select' : control.type;
      expect(actualType, slug).toBe(type);
      if (slug === 'form-multiselect') expect(control.multiple).toBe(true);
    }
  });

  it('does not activate a disabled action', async () => {
    const button = document.createElement('open-cells-button-default');
    button.disabled = true;
    document.body.append(button);
    await settle(button);
    let activations = 0;
    button.addEventListener('open-cells-button-default-activate', () => activations++);
    button.shadowRoot.querySelector('button').click();
    expect(activations).toBe(0);
  });

  it('does not activate a disabled link', async () => {
    const link = document.createElement('open-cells-type-link');
    link.disabled = true;
    document.body.append(link);
    await settle(link);
    let activations = 0;
    link.addEventListener('open-cells-type-link-activate', () => activations++);
    link.shadowRoot.querySelector('a').click();
    expect(activations).toBe(0);
    expect(link.shadowRoot.querySelector('a').getAttribute('aria-disabled')).toBe('true');
  });

  it('composes a public element through a local scoped registry', async () => {
    class PracticeButton extends OpenCellsButtonDefault {}
    class PracticeHost extends ScopedElementsMixin(LitElement) {
      static get scopedElements() { return { 'practice-button': PracticeButton }; }
      render() { return html`<practice-button></practice-button>`; }
    }
    expect(PracticeHost.scopedElements['practice-button']).toBe(PracticeButton);
    expect(PracticeHost.scopedElements).toHaveProperty('practice-button');
  });

  it('keeps container actions available to an app host', async () => {
    const panel = document.createElement('open-cells-panel-container');
    document.body.append(panel);
    await settle(panel);
    expect(panel.shadowRoot.querySelector('button')).not.toBeNull();
  });

  it('routes generic container copy through the locale contract', async () => {
    const panel = document.createElement('open-cells-panel-container');
    panel.locale = { label: 'Panel', brand: 'Marca local', action: 'Abrir' };
    document.body.append(panel);
    await settle(panel);
    expect(panel.shadowRoot.querySelector('.badge').textContent).toBe('Marca local');
    expect(panel.shadowRoot.querySelector('button').textContent).toBe('Abrir');
  });

  it('renders every catalog entry through its public custom-element tag', async () => {
    for (const component of catalog.components) {
      const module = await import(`../../src/components/${component.slug}.js`);
      const Component = module[component.className];
      if (!customElements.get(component.tagName)) customElements.define(component.tagName, Component);
      const element = document.createElement(component.tagName);
      document.body.append(element);
      await settle(element);
      expect(element.shadowRoot.textContent.trim(), component.tagName).not.toBe('');
    }
  });

  it('keeps every interactive catalog entry wired to its public event', async () => {
    for (const component of catalog.components) {
      await import(`../../src/components/${component.slug}-define.js`);
      const element = document.createElement(component.tagName);
      document.body.append(element);
      await settle(element);
      const control = element.shadowRoot.querySelector('button, input, select, a');
      if (!control) continue;
      const event = new Promise(resolve => element.addEventListener(component.eventName, resolve, { once: true }));
      if (control.matches('input, select')) {
        if (control.type === 'checkbox' || control.type === 'radio') control.checked = true;
        if (control.tagName.toLowerCase() === 'select' && control.options.length) control.value = control.options[0].value;
        const changeEvent = control.tagName.toLowerCase() === 'select' || control.type === 'file' || control.type === 'checkbox' || control.type === 'radio';
        control.dispatchEvent(new Event(changeEvent ? 'change' : 'input', { bubbles: true }));
      } else {
        control.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      }
      await expect(Promise.race([event, new Promise(resolve => setTimeout(() => resolve(null), 100))]), component.tagName).resolves.toBeTruthy();
    }
  });

  it('covers the shared template helpers used by component families', () => {
    class TestOpenCellsElement extends OpenCellsElement {}
    customElements.define('public-components-base-element', TestOpenCellsElement);
    const base = document.createElement('public-components-base-element');
    expect(base.t('missing')).toBe('missing');
    base.emitEvent('activate');
    expect(base.render()).toBeTruthy();
    for (const tag of ['open-cells-button-default', 'open-cells-form-input', 'open-cells-panel-container']) {
      const element = document.createElement(tag);
      for (const method of ['renderButton', 'renderInput', 'renderLink', 'renderBadge']) {
        expect(element[method]('Example', () => {})).toBeTruthy();
      }
    }
  });
});
