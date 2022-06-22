declare global {
    interface Window {
        AlertBanner: typeof AlertBanner;
    }
}
declare class AlertBanner extends HTMLElement {
    static get observedAttributes(): string[];
    constructor();
    connectedCallback(): void;
    attributeChangedCallback<T extends string>(name: string, oldValue: T, newValue: T): void;
    displayAlertLogic(storageKey: string): void;
    handleButtonClick(): void;
    getAlertContent(): {
        storageKey: string | null;
        buttonText: string | null;
        isDismissable: boolean;
        type: string | null;
        content: string;
    };
    getStorageKey(): string | undefined;
    checkKeyIsUnique(storageKey: string): boolean | undefined;
    composeTemplate(): DocumentFragment;
    setButtonLabel(buttonText: string): void;
    setAlertPersistance(dismissable: string): void;
    setStyles(name: string, newValue: string): void;
}
export default AlertBanner;
//# sourceMappingURL=index.d.ts.map