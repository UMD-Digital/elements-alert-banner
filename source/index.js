const COLORS = {
  black: '#000000',
  gold: '#ffd200',
  red: '#e21833',
  redDark: '#710c1a',
  white: '#ffffff',
  grayLight: '#e6e6e6',
  grayDark: '#454545',
};

const CSS = `
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

  :host {
    display: block;
  }

  layout-lock {
    display: flex;
    justify-content: space-between;
    margin: 0 auto !important;
  }

  slot[data-alert] {
    display: block;
    margin-right: 20px;
  }

  slot[data-alert] &:last-child {
      margin-right: 0;
  }

  button[name='close'] {
    background: transparent;
    border: 1px solid transparent;
    border-radius: 3px;
    cursor: pointer;
    flex: none;
    height: 30px;
    margin-top: -5px;
    padding: 5px;
    width: 30px;
  }

  button[name='close'] svg {
    height: 100%;
    width: 100%;
  }

  button[name='close']:hover,
  button[name='close']:focus {
    border: 1px solid gray;
    transition: color 0.3s, fill 0.3s, border-color 0.3s;
  }
`;

const alertTypeCSS = {
  primary: `
    :host([type='primary']) {
      background-color: ${COLORS.grayLight} !important;
    }

    :host([type='primary']) ::slotted(*) {
      color: ${COLORS.grayDark} !important;
      fill: ${COLORS.grayDark} !important;
    }

    :host([type='primary']) button[name='close'] {
      border: 1px solid transparent;
      color: ${COLORS.grayDark} !important;
      fill: ${COLORS.grayDark} !important;
    }

    :host([type='primary']) button[name='close']:hover,
    :host([type='primary']) button[name='close']:focus {
      border: 1px solid ${COLORS.black} !important;
      color: ${COLORS.black} !important;
      fill: ${COLORS.black} !important;
      transition: background-color 0.3s, color 0.3s, fill 0.3s, border-color 0.3s;
    }

    :host([type='primary']) button[name='close']:active {
      background-color: ${COLORS.black} !important;
      color: ${COLORS.grayLight} !important;
      fill: ${COLORS.grayLight} !important;
    }
  `,
  warning: `
    :host([type='warning']) {
      background-color: ${COLORS.gold} !important;
    }

    :host([type='warning']) ::slotted(*) {
      color: ${COLORS.black} !important;
      fill: ${COLORS.black} !important;
    }

    :host([type='warning']) button[name='close'] {
      border: 1px solid transparent;
      color: ${COLORS.black} !important;
      fill: ${COLORS.black} !important;
    }

    :host([type='warning']) button[name='close']:hover,
    :host([type='warning']) button[name='close']:focus {
      border: 1px solid ${COLORS.black} !important;
      color: ${COLORS.black} !important;
      fill: ${COLORS.black} !important;
      transition: background-color 0.3s, color 0.3s, fill 0.3s, border-color 0.3s;
    }

    :host([type='warning']) button[name='close']:active {
      background-color: ${COLORS.black} !important;
      color: ${COLORS.gold} !important;
      fill: ${COLORS.gold} !important;
    }
  `,
  danger: `
    :host([type='danger']) {
      background-color: ${COLORS.red} !important;
    }

    :host([type='danger']) ::slotted(*) {
      color: ${COLORS.white} !important;
      fill: ${COLORS.white} !important;
    }

    :host([type='danger']) button[name='close'] {
      border: 1px solid transparent;
      color: ${COLORS.white} !important;
      fill: ${COLORS.white} !important;
    }

    :host([type='danger']) button[name='close']:hover,
    :host([type='danger']) button[name='close']:focus {
      border: 1px solid ${COLORS.white} !important;
      color: ${COLORS.white} !important;
      fill: ${COLORS.white} !important;
      transition: background-color 0.3s, color 0.3s, fill 0.3s, border-color 0.3s;
    }

    :host([type='danger']) button[name='close']:active {
      background-color: ${COLORS.white} !important;
      color: ${COLORS.red} !important;
      fill: ${COLORS.red} !important;
    }
  `,
};

export default class AlertBanner extends HTMLElement {
  constructor() {
    super();

    const alertAttributes = this.getAlertAttributes(this);
    const alertContent = this.getAlertContent(this);
    const alertContentString = JSON.stringify(alertContent);
    const isStoredLocally = window.localStorage.getItem(alertAttributes.id);

    if (isStoredLocally && alertContentString === isStoredLocally) {
      this.setAttribute('show', false);
      this.remove();
    }

    if (!isStoredLocally || alertContentString != isStoredLocally) {
      const shadowRoot = this.attachShadow({ mode: 'open' });
      const template = this.composeTemplate(alertAttributes);

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
      const alertContent = this.getAlertContent(this);
      const alertContentString = JSON.stringify(alertContent);

      window.localStorage.setItem(alertContent.id, alertContentString);
      this.remove();
    }
  }

  getAlertAttributes(element) {
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
  }

  getAlertContent(element) {
    const alertAttributes = this.getAlertAttributes(element);

    return {
      id: alertAttributes.id,
      type: alertAttributes.type,
      buttonText: alertAttributes.buttonText,
      isDismissable: alertAttributes.isDismissable,
      type: alertAttributes.type,
      content: element.innerHTML,
    };
  }

  composeStyles(additionalStyles) {
    const type = this.getAttribute('type');
    const alertTypeStyles = type in alertTypeCSS ? alertTypeCSS[type] : '';
    const styles = document.createElement('style');
    const customLayoutLock = `
    layout-lock {
      padding: ${additionalStyles.padding ?? 0};
      max-width: ${additionalStyles.size ?? 'initial'};
    }
  `;

    styles.innerHTML = CSS + alertTypeStyles + customLayoutLock;

    return styles;
  }

  composeButton(buttonText) {
    const button = document.createElement('button');
    const closeIcon = `<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 2.41714L21.5829 0L12 9.58286L2.41714 0L0 2.41714L9.58286 12L0 21.5829L2.41714 24L12 14.4171L21.5829 24L24 21.5829L14.4171 12L24 2.41714Z" /></svg>`;
    const srOnlySpan = document.createElement('span');

    button.setAttribute('name', 'close');
    srOnlySpan.setAttribute('class', 'sr-only');
    srOnlySpan.textContent = buttonText ?? 'Close';
    button.innerHTML = closeIcon + srOnlySpan.outerHTML;

    return button;
  }

  composeTemplate(alertAttributes) {
    const template = document.createElement('template');

    const button = alertAttributes.isDismissable
      ? this.composeButton(alertAttributes.buttonText)
      : '';
    const layout = this.composeLayout({ button });

    const styles = this.composeStyles({
      padding: alertAttributes.padding,
      size: alertAttributes.size,
    });

    template.innerHTML = layout.outerHTML + styles.outerHTML;

    return template.content;
  }

  composeLayout(additionalComponents) {
    const button = additionalComponents.button;
    const layout = document.createElement('layout-lock');
    const slot = document.createElement('slot');

    slot.setAttribute('data-alert', 'content');
    layout.append(slot, button);

    return layout;
  }
}

window.customElements.define('umd-alert-banner', AlertBanner);
