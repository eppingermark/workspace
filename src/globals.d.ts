interface Window {
    createToast();
}

declare global {
    interface WindowEventMap {
        windowFocusGain: CustomEvent<number>;
    }
}
