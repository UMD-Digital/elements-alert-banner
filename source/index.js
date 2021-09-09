import css from './styles/main.css';

const getAlertAttributes = (element) => {
  return {
    id: element.getAttribute('id')
      ? `alert-banner-${element.getAttribute('id')}`
      : 'alert-banner',
    buttonText: element.getAttribute('button'),
    isDismissable:
      element.getAttribute('dismissable') == 'false' ? false : true,
    padding: element.getAttribute('padding'),
    size: element.getAttribute('size'),
    type: element.getAttribute('type'),
  };
};

const getAlertContent = (element) => {
  const alertAttributes = getAlertAttributes(element);

  return {
    id: alertAttributes.id,
    type: alertAttributes.type,
    buttonText: alertAttributes.buttonText,
    isDismissable: alertAttributes.isDismissable,
    type: alertAttributes.type,
    content: element.innerHTML,
  };
};

const composeStyles = (additionalStyles) => {
  const customLayoutLock = `
    layout-lock {
      max-width: ${additionalStyles.size ?? null};
      padding: ${additionalStyles.padding ?? 0};
    }
  `;

  const styles = document.createElement('style');
  styles.innerHTML = css + customLayoutLock;

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

const composeLayout = (additionalComponents) => {
  const button = additionalComponents.button;
  const layout = document.createElement('layout-lock');
  const slot = document.createElement('slot');

  slot.setAttribute('data-alert', 'content');
  layout.append(slot, button);

  return layout;
};

const composeTemplate = (alertAttributes) => {
  const template = document.createElement('template');

  const button = alertAttributes.isDismissable
    ? composeButton(alertAttributes.buttonText)
    : '';
  const layout = composeLayout({ button });

  const styles = composeStyles({
    padding: alertAttributes.padding,
    size: alertAttributes.size,
  });

  template.innerHTML = layout.outerHTML + styles.outerHTML;

  return template.content;
};

export default class AlertBanner extends HTMLElement {
  constructor() {
    super();

    const alertAttributes = getAlertAttributes(this);
    const alertContent = getAlertContent(this);
    const alertContentString = JSON.stringify(alertContent);
    const isStoredLocally = window.localStorage.getItem(alertAttributes.id);

    if (isStoredLocally && alertContentString === isStoredLocally) {
      this.setAttribute('show', false);
      this.remove();
    }

    if (!isStoredLocally || alertContentString != isStoredLocally) {
      const shadowRoot = this.attachShadow({ mode: 'open' });
      const template = composeTemplate(alertAttributes);

      shadowRoot.append(template.cloneNode(true));
      this.setAttribute('show', true);
    }
  }

  connectedCallback() {
    const button = this.shadowRoot?.querySelector('button');

    button && button.addEventListener('click', () => this.handleButtonClick());
  }

  handleButtonClick() {
    if (this.getAttribute('show') == 'true') {
      const alertContent = getAlertContent(this);
      const alertContentString = JSON.stringify(alertContent);

      window.localStorage.setItem(alertContent.id, alertContentString);
      this.remove();
    }
  }
}

window.customElements.define('umd-alert-banner', AlertBanner);
