import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("tab-group")
export class TabGroup extends LitElement {
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
        }

        .group-header {
            display: flex;
            flex-direction: row;
            background-color: #3d3d3d;
            gap: 4px;

            button {
                background-color: #333333;
                border: none;
                border-radius: 4px 4px 0 0;
                color: #fff;
                cursor: pointer;

                &:hover {
                    text-decoration: underline;
                }

                &.active {
                    background-color: #2b2b2b;
                }
            }
        }

        .group-content {
            width: 100%;
            height: 100%;
        }
    `;

    @property({ type: Array })
    tabs: string[] = [];

    @property({ type: String })
    currentTab = "";

    changeTab(newTab: string) {
        this.currentTab = newTab;
    }

    render() {
        return html`
            <div class="group-header">
                ${this.tabs.map(
                    (tab) => html`
                    <button class=${tab === this.currentTab ? "active" : ""} @click=${() => this.changeTab(tab)}>
                        ${tab}
                    </button>
                `,
                )}
            </div>

            <slot name=${this.currentTab} part="content"></slot>
        `;
    }
}
