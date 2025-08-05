import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("custom-select")
export class CustomSelect extends LitElement {
    static styles = css`
        select {
            display: flex;
            width: 100%;
            height: 100%;
            border: none;
            background-color: #4a4a4a;
            color: #fff;
            border-radius: 4px;
            outline: none;
        }
    `;

    @property({ type: Array })
    options: { id: string; display: string }[] = [];

    onSelect(id: string) {
        const event = new CustomEvent("select", {
            detail: id,
        });
        this.dispatchEvent(event);
    }

    render() {
        return html`
            <select @change=${(e: InputEvent) => this.onSelect(this.options[(e.target as HTMLSelectElement)?.selectedIndex || 0].id)}>
                ${this.options.map(
                    (opt) => html`
                    <option value=${opt.id}>${opt.display}</option>
                `,
                )}
            </select>
        `;
    }
}
