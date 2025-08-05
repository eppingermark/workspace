import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { Window } from "./base/window";

@customElement("test-window")
export class TestWindow extends Window {
    static styles = [
        super.styles,
        css`
            tab-group {
                gap: 8px;
                height: 100%;
                width: 200px;
                background-color: #2b2b2b;

                h1 {
                    margin: 0;
                    font-size: 16px;
                }

                .horizontal {
                    display: flex;
                    flex-direction: row;
                    gap: 8px;
                }

                custom-select {
                    width: 100%;
                }

                & > div[slot] {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    padding: 0 16px;
                }
            }
        `,
    ];

    innerRender() {
        return html`
            <div>
                <tab-group
                    .tabs=${["Transform", "Test"]}
                    currentTab="Transform"
                >
                    <div slot="Transform">
                        <h1>Convert</h1>

                        <div class="horizontal">
                            <custom-select .options=${[
                                {
                                    id: "png",
                                    display: "PNG",
                                },
                            ]}></custom-select>

                            <custom-button size="small">Convert</custom-button>
                        </div>

                        <div class="divider"></div>

                        <custom-button>Download</custom-button>
                    </div>

                    <div slot="Test">
                        <h1> hii</h1>
                    </div>
                </tab-group>
            </div>
        `;
    }
}
