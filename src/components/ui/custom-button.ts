import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

type ButtonSize = "large" | "medium" | "small";

@customElement("custom-button")
export class CustomButton extends LitElement implements HTMLElement {
    static styles = css`
        :is(:host) {
            display: flex;
            color: #fff;
            background-color: #4a4a4a !important;
            border: none !important;
            cursor: pointer !important;
            padding: 4px 0 !important;
            border-radius: 4px !important;
            justify-content: center;
            transition: background-color 0.1s !important;
        }

        :host([size="small"]) {
            width: fit-content;
            padding: 4px !important;
            font-size: 12px !important;
        }

        :host(:hover) {
            background-color: #3a3a3a !important;
        }
    `;

    @property({ reflect: true })
    size: ButtonSize = "medium";

    render() {
        return html`<slot></slot>`;
    }
}
