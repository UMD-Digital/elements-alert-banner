const template = document.createElement('template');
const layout = document.createElement('layout-lock');

const styles = document.createElement('style');
styles.innerHTML = `
  :host {
    --black: #000000;
    --gold: #ffd200;
    --red: #e21833;
    --redDark: #710c1a;
    --white: #ffffff;
    --grayLight: #e6e6e6;
    --grayDark: #454545;
  }

  :host {
    display: block;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  layout-lock {
    display: flex;
    justify-content: space-between;
    margin: 0 auto !important;
    padding: 20px !important;
    max-width: 900px;
  }

  div[data-alert] {
    margin-right: 20px;
  }

  button[data-alert='close-button'] {
    background: transparent;
    border: 1px solid transparent;
    border-radius: 3px;
    cursor: pointer;
    flex: none;
    height: 24px;
    margin-top: -4px;
    padding: 4px;
    width: 24px;
  }

  button[data-alert='close-button'] svg {
    height: 100%;
    width: 100%;
  }

  button[data-alert='close-button']:hover,
  button[data-alert='close-button']:focus {
    border: 1px solid gray;
    transition: color 0.3s, fill 0.3s, border-color 0.3s;
  }

  /* PRIMARY ALERT STYLES */

  :host([data-alert-type='primary']) {
    background-color: var(--grayLight) !important;
  }

  :host([data-alert-type='primary']) button[data-alert='close-button'] {
    border: 1px solid transparent;
    color: var(--grayDark) !important;
    fill: var(--grayDark) !important;
  }

  :host([data-alert-type='primary']) button[data-alert='close-button']:hover,
  :host([data-alert-type='primary']) button[data-alert='close-button']:focus {
    border: 1px solid var(--black) !important;
    color: var(--black) !important;
    fill: var(--black) !important;
    transition: background-color 0.3s, color 0.3s, fill 0.3s, border-color 0.3s;
  }

  :host([data-alert-type='primary']) button[data-alert='close-button']:active {
    background-color: var(--black) !important;
    color: var(--grayLight) !important;
    fill: var(--grayLight) !important;
  }

  :host([data-alert-type='primary']) ::slotted(*) {
    color: var(--grayDark) !important;
    fill: var(--grayDark) !important;
  }

  /* WARNING ALERT STYLES */

  :host([data-alert-type='warning']) {
    background-color: var(--gold) !important;
  }

  :host([data-alert-type='warning']) button[data-alert='close-button'] {
    border: 1px solid transparent;
    color: var(--black) !important;
    fill: var(--black) !important;
  }

  :host([data-alert-type='warning']) button[data-alert='close-button']:hover,
  :host([data-alert-type='warning']) button[data-alert='close-button']:focus {
    border: 1px solid var(--black) !important;
    color: var(--black) !important;
    fill: var(--black) !important;
    transition: background-color 0.3s, color 0.3s, fill 0.3s, border-color 0.3s;
  }

  :host([data-alert-type='warning']) button[data-alert='close-button']:active {
    background-color: var(--black) !important;
    color: var(--gold) !important;
    fill: var(--gold) !important;
  }

  :host([data-alert-type='warning']) ::slotted(*) {
    color: var(--black) !important;
    fill: var(--black) !important;
  }

  /* DANGER ALERT STYLES */

  :host([data-alert-type='danger']) {
    background-color: var(--red) !important;
  }

  :host([data-alert-type='danger']) button[data-alert='close-button'] {
    border: 1px solid transparent;
    color: var(--white) !important;
    fill: var(--white) !important;
  }

  :host([data-alert-type='danger']) button[data-alert='close-button']:hover,
  :host([data-alert-type='danger']) button[data-alert='close-button']:focus {
    border: 1px solid var(--white) !important;
    color: var(--white) !important;
    fill: var(--white) !important;
    transition: background-color 0.3s, color 0.3s, fill 0.3s, border-color 0.3s;
  }

  :host([data-alert-type='danger']) button[data-alert='close-button']:active {
    background-color: var(--white) !important;
    color: var(--red) !important;
    fill: var(--red) !important;
  }

  :host([data-alert-type='danger']) ::slotted(*) {
    color: var(--white) !important;
    fill: var(--white) !important;
  }
`;

const button = document.createElement('button');
button.setAttribute('data-alert', 'close-button');
const closeIcon = `<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 2.41714L21.5829 0L12 9.58286L2.41714 0L0 2.41714L9.58286 12L0 21.5829L2.41714 24L12 14.4171L21.5829 24L24 21.5829L14.4171 12L24 2.41714Z" /></svg>`;
button.innerHTML = `
  ${closeIcon}
  <span class="sr-only">Dismiss Alert</span>
`;

const alertBody = document.createElement('div');
alertBody.setAttribute('data-alert', 'alert-Body');
alertBody.innerHTML = `<slot></slot>`;
layout.append(alertBody, button);

template.innerHTML = layout.outerHTML + styles.outerHTML;

class AlertBanner extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.append(template.content.cloneNode(true));
  }
}

window.customElements.define('umd-alert-banner', AlertBanner);
