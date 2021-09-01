import css from './styles/main.css';

const composeStyles = () => {
  const styles = document.createElement('style');
  styles.innerHTML = css;

  return styles;
};

const composeButton = () => {
  const button = document.createElement('button');
  button.setAttribute('data-alert', 'close-button');
  const closeIcon = `<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 2.41714L21.5829 0L12 9.58286L2.41714 0L0 2.41714L9.58286 12L0 21.5829L2.41714 24L12 14.4171L21.5829 24L24 21.5829L14.4171 12L24 2.41714Z" /></svg>`;
  button.innerHTML = `
    ${closeIcon}
    <span class="sr-only">Dismiss Alert</span>
  `;

  return button;
};

const composeContent = () => {
  const alertContent = document.createElement('slot');
  alertContent.setAttribute('data-alert', 'content');

  return alertContent;
};

const composeTemplate = (element) => {
  console.log(element);
  const template = document.createElement('template');
  const layout = document.createElement('layout-lock');
  const styles = composeStyles();
  const button = composeButton();
  const content = composeContent();

  layout.append(content, button);
  template.innerHTML = layout.outerHTML + styles.outerHTML;

  return template.content.cloneNode(true);
};

class AlertBanner extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.append(composeTemplate(this));
  }
}

window.customElements.define('umd-alert-banner', AlertBanner);
