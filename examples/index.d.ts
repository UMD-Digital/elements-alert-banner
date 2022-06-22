declare global {
    interface Window {
        AlertBanner: typeof AlertBanner;
    }
}
declare class AlertBanner extends HTMLElement {
    constructor();
    connectedCallback(): void;
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
    composeButton(): HTMLElement;
    composeStyles(): HTMLElement;
    composeTemplate(): DocumentFragment;
}
export default AlertBanner;
//# sourceMappingURL=index.d.ts.map