import defaultBackground from "@assets/defaultBackground.webp";
import { StateController } from "@lit-app/state";
import settingsStore from "@stores/SettingsStore";
import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

let currentWindowId = 0;

@customElement("app-root")
export class AppRoot extends LitElement {
    static styles = css`
        div {
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            z-index: 5;
        }

        drag-controller {
            z-index: 10;
        }
    `;

    state = new StateController(this, settingsStore);

    @property({ type: Object }) windows: Record<number, TemplateResult> = {};

    windowCreate(event: CustomEvent) {
        currentWindowId += 1;
        const thisWindowsId = currentWindowId;

        const element: TemplateResult =
            {
                image: html`<image-window
                    id="window-${thisWindowsId}"
                    .file="${event.detail.file}"
                    posX="${event.detail.posX}"
                    posY="${event.detail.posY}"
                    @destroy=${() => {
                        delete this.windows[thisWindowsId];
                        this.requestUpdate();
                    }}
                    @gainedFocus=${() => {
                        const event = new CustomEvent("windowFocusGain", {
                            detail: thisWindowsId,
                        });
                        window.dispatchEvent(event);
                    }}
                ></image-window>`,
            }[event.detail.type as string] ?? html`<div>unknown</div>`;

        this.windows[thisWindowsId] = element;
        this.requestUpdate();
    }

    render() {
        let background = settingsStore.background;

        if (background === "default") {
            background = defaultBackground;
        }

        return html`
            <drag-controller @createWindow="${this.windowCreate}"></drag-controller>

            <div style="background: url(${background})">
                ${Object.values(this.windows)}
                <test-window title="test" posX="10" posY="10" sizeX="500" sizeY="200"></test-window>
            </div>

            <toast-controller></toast-controller>
        `;
    }
}
