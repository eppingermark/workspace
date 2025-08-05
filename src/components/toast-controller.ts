import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("toast-controller")
export class ToastController extends LitElement {
    static styles = css`
        div {
            position: absolute;
            height: 100vh;
            width: 100vw;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 0;
        }
    `;

    render() {
        return html` <div> </div> `;
    }
}
