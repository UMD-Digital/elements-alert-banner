import css from './styles/main.css';

const composeStyles = (layoutLockOptions) => {
  const size = layoutLockOptions.size;
  const padding = layoutLockOptions.padding;
  const customeLayoutLock = `
    layout-lock {
      max-width: ${size ?? null};
      padding: ${padding ?? 0};
    }
  `;

  const styles = document.createElement('style');
  styles.innerHTML = css + customeLayoutLock;

  return styles;
};

const composeButton = (buttonText) => {
  const button = document.createElement('button');
  const closeIcon = `<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 2.41714L21.5829 0L12 9.58286L2.41714 0L0 2.41714L9.58286 12L0 21.5829L2.41714 24L12 14.4171L21.5829 24L24 21.5829L14.4171 12L24 2.41714Z" /></svg>`;
  const srOnlySpan = document.createElement('span');

  button.setAttribute('name', 'close');
  srOnlySpan.setAttribute('class', 'sr-only');
  srOnlySpan.textContent = buttonText ?? 'Close';
  button.innerHTML = closeIcon + srOnlySpan.outerHTML;

  return button;
};

const composeContent = () => {
  const alertContent = document.createElement('slot');
  alertContent.setAttribute('data-alert', 'content');

  return alertContent;
};

const composeTemplate = (element) => {
  const buttonText = element.getAttribute('button');
  const isPersistent = element.hasAttribute('persist');
  const layoutLockOptions = {
    size: element.getAttribute('size'),
    padding: element.getAttribute('padding'),
  };
  const template = document.createElement('template');
  const layout = document.createElement('layout-lock');
  const styles = composeStyles(layoutLockOptions);
  const button = isPersistent ? '' : composeButton(buttonText);
  const content = composeContent();

  layout.append(content, button);
  template.innerHTML = layout.outerHTML + styles.outerHTML;

  return template.content;
};

class AlertBanner extends HTMLElement {
  constructor() {
    super();

    const templateContent = composeTemplate(this);
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.append(templateContent.cloneNode(true));
  }
}

window.customElements.define('umd-alert-banner', AlertBanner);
