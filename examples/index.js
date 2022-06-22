const ELEMENT_NAME = 'umd-alert-banner';
const CLOSE_ICON = `<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 2.41714L21.5829 0L12 9.58286L2.41714 0L0 2.41714L9.58286 12L0 21.5829L2.41714 24L12 14.4171L21.5829 24L24 21.5829L14.4171 12L24 2.41714Z" /></svg>`;
const ANIMATION_TIME = {
    css: `0.5s`,
    js: 500,
};
const COLOR = {
    black: '#000000',
    gold: '#ffd200',
    red: '#e21833',
    redDark: '#710c1a',
    white: '#ffffff',
    grayLight: '#e6e6e6',
    grayDark: '#454545',
};
const STYLES = `
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :host(*) {
      display: block;
      max-height: 100vh;
      overflow-y: scroll;
      transition: max-height ${ANIMATION_TIME.css};
    }

    :host(*) ::slotted(*),
    :host(*) button[name="close"] {
      opacity: 1;
    }

    :host([show="false"]) {
      display: none;
      max-height: 0;
    }

    :host([show="false"]) ::slotted(*),
    :host([show="false"]) button[name="close"] {
      opacity: 0;
    }

    [data-layout] {
      display: flex;
      justify-content: space-between;
      margin: 0 auto !important;
      max-width: initial;
    }

    slot {
      display: block;
      margin-right: 20px;
    }

    slot:last-child {
        margin-right: 0;
    }

    button[name='close'] {
      background: transparent;
      border: 0;
      border-radius: 3px;
      cursor: pointer;
      flex: none;
      height: 30px;
      margin-top: -5px;
      padding: 5px;
      transition: ;
      transition: box-shadow 0.3s, color 0.3s, opacity ${ANIMATION_TIME.css};
      width: 30px;
    }

    button[name='close'] svg {
      display: block;
      height: 100%;
      width: 100%;
    }
  </style>
`;
const ALERT_TYPE_CSS = {
    primary: `
    :host([type='primary']) {
      background-color: ${COLOR.grayLight} !important;
    }

    :host([type='primary']) ::slotted(*) {
      color: ${COLOR.grayDark} !important;
      fill: ${COLOR.grayDark} !important;
    }

    :host([type='primary']) button[name='close'] {
      box-shadow: 0 0 0 1px transparent;
      color: ${COLOR.grayDark} !important;
      fill: ${COLOR.grayDark} !important;
    }

   :host([type='primary']) button[name='close']:hover,
   :host([type='primary']) button[name='close']:focus {
      box-shadow: 0 0 0 1px ${COLOR.grayDark};
    }
  `,
    warning: `
    :host([type='warning']) {
      background-color: ${COLOR.gold} !important;
    }

    :host([type='warning']) ::slotted(*) {
      color: ${COLOR.black} !important;
      fill: ${COLOR.black} !important;
    }

    :host([type='warning']) button[name='close'] {
      box-shadow: 0 0 0 1px transparent;
      color: ${COLOR.black} !important;
      fill: ${COLOR.black} !important;
    }

   :host([type='warning']) button[name='close']:hover,
   :host([type='warning']) button[name='close']:focus {
      box-shadow: 0 0 0 1px ${COLOR.black};
    }
  `,
    danger: `
    :host([type='danger']) {
      background-color: ${COLOR.red} !important;
    }

    :host([type='danger']) ::slotted(*) {
      color: ${COLOR.white} !important;
      fill: ${COLOR.white} !important;
    }

    :host([type='danger']) button[name='close'] {
      box-shadow: 0 0 0 1px transparent;
      color: ${COLOR.white} !important;
      fill: ${COLOR.white} !important;
    }

   :host([type='danger']) button[name='close']:hover,
   :host([type='danger']) button[name='close']:focus {
      box-shadow: 0 0 0 1px ${COLOR.white};
    }
  `,
};
class AlertBanner extends HTMLElement {
    static get observedAttributes() {
        return ['button', 'dismissable', 'padding', 'type', 'max-width'];
    }
    constructor() {
        super();
        const storageKey = this.getStorageKey();
        storageKey && this.displayAlertLogic(storageKey);
    }
    connectedCallback() {
        const button = this.shadowRoot?.querySelector('button[name="close"]');
        const hideAlert = this.handleButtonClick.bind(this);
        button && button.addEventListener('click', hideAlert);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        const isStyles = name == 'type' || name == 'padding' || name == 'max-width';
        const isButton = name == 'button';
        const persistance = name == 'dismissable';
        if (isButton) {
            this.setButtonLabel(newValue);
        }
        if (persistance) {
            this.setAlertPersistance(newValue);
        }
        if (isStyles) {
            this.setStyles(name, newValue);
        }
    }
    displayAlertLogic(storageKey) {
        const alertContent = this.getAlertContent();
        const stringifyContent = JSON.stringify(alertContent);
        const storedContent = window.localStorage.getItem(storageKey);
        const isSameContent = stringifyContent === storedContent;
        const showAlert = () => {
            const shadowRoot = this.attachShadow({ mode: 'open' });
            const template = this.composeTemplate();
            shadowRoot.append(template.cloneNode(true));
            this.setAttribute('show', 'true');
        };
        const removeAlert = () => {
            this.setAttribute('show', 'false');
            this.remove();
        };
        if (!storedContent) {
            showAlert();
            return;
        }
        if (!isSameContent) {
            showAlert();
            return;
        }
        removeAlert();
    }
    handleButtonClick() {
        const isVisible = this.getAttribute('show') === 'true';
        if (isVisible) {
            const alertContent = this.getAlertContent();
            const stringifyContent = JSON.stringify(alertContent);
            window.localStorage.setItem(alertContent.storageKey, stringifyContent);
            this.style.display = 'block';
            setTimeout(() => {
                this.setAttribute('show', 'false');
            }, 100);
            setTimeout(() => {
                this.removeAttribute('style');
                this.remove();
            }, ANIMATION_TIME.js);
        }
    }
    getAlertContent() {
        return {
            storageKey: this.getAttribute('storage-key'),
            buttonText: this.getAttribute('button'),
            isDismissable: this.getAttribute('dismissable') == 'false' ? false : true,
            type: this.getAttribute('type'),
            content: this.innerHTML,
        };
    }
    getStorageKey() {
        const storageKey = this.getAttribute('storage-key');
        const isUnique = this.checkKeyIsUnique(storageKey);
        if (!storageKey || !isUnique) {
            this.remove();
            console.error('Element must have a unique "storage-key" attribute', this);
            return;
        }
        return storageKey;
    }
    checkKeyIsUnique(storageKey) {
        const uniqueKeyList = {};
        const everyBanner = Array.from(document.querySelectorAll('umd-alert-banner[storage-key]'));
        everyBanner.forEach((banner) => {
            const key = banner.getAttribute('storage-key');
            if (uniqueKeyList.hasOwnProperty(key)) {
                uniqueKeyList[key] = uniqueKeyList[key] + 1;
            }
            if (!uniqueKeyList.hasOwnProperty(key)) {
                uniqueKeyList[key] = 1;
            }
        });
        if (uniqueKeyList[storageKey] > 1) {
            return false;
        }
        if (uniqueKeyList[storageKey] === 1) {
            return true;
        }
    }
    composeTemplate() {
        const template = document.createElement('template');
        const layout = document.createElement('div');
        const slot = document.createElement('slot');
        const button = document.createElement('button');
        button.setAttribute('name', 'close');
        button.setAttribute('aria-label', 'close');
        button.innerHTML = CLOSE_ICON;
        layout.setAttribute('data-layout', 'true');
        layout.append(slot, button);
        template.innerHTML = layout.outerHTML + STYLES;
        return template.content;
    }
    setButtonLabel(buttonText) {
        // prettier-ignore
        const button = this.shadowRoot?.querySelector('[name="close]');
        button && button.setAttribute('aria-label', buttonText ?? 'close');
    }
    setAlertPersistance(dismissable) {
        // prettier-ignore
        const button = this.shadowRoot?.querySelector('[name="close"]');
        const isPersistant = dismissable == 'false';
        if (isPersistant) {
            button && button.remove();
        }
    }
    setStyles(name, newValue) {
        // prettier-ignore
        const layout = this.shadowRoot?.querySelector('[data-layout]');
        const setAlertType = (typeValue) => {
            const alertType = typeValue;
            const isAlertType = alertType && alertType in ALERT_TYPE_CSS;
            const typeStyles = this.shadowRoot?.querySelector('#type-styles')
                ? this.shadowRoot?.querySelector('#type-styles')
                : document.createElement('style');
            typeStyles.setAttribute('id', 'type-styles');
            if (isAlertType) {
                typeStyles.innerHTML += ALERT_TYPE_CSS[alertType];
                if (!this.shadowRoot?.contains(typeStyles)) {
                    this.shadowRoot?.appendChild(typeStyles);
                }
                return;
            }
            typeStyles.remove();
        };
        const setPadding = (customPadding) => {
            layout.style.padding = `${customPadding ?? 0}`;
        };
        const setMaxWidth = (customMaxWidth) => {
            layout.style.maxWidth = `${customMaxWidth ?? 'inital'}`;
        };
        if (name == 'type') {
            setAlertType(newValue);
        }
        if (name == 'padding') {
            setPadding(newValue);
        }
        if (name == 'max-width') {
            setMaxWidth(newValue);
        }
    }
}
export default AlertBanner;
if (!window.customElements.get(ELEMENT_NAME)) {
    window.AlertBanner = AlertBanner;
    window.customElements.define(ELEMENT_NAME, AlertBanner);
}
//# sourceMappingURL=index.js.map