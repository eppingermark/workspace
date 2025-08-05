import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("drag-controller")
class DragController extends LitElement {
    @property({ type: Boolean }) isDragging = false;

    static styles = css`
        div {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: #e629ff;
            transition: opacity 0.3s;
            z-index: 10;
        }
    `;

    @state() context: MouseEvent | null = null;

    @property({ attribute: false })
    getWindowId = () => {
        return 0;
    };

    dragOver(event: DragEvent) {
        event.preventDefault();
        this.isDragging = true;
    }

    drop(event: DragEvent) {
        event.preventDefault();
        this.isDragging = false;

        const file = event.dataTransfer?.files?.[0];

        if (!file) {
            return;
        }

        this.createWindowFromFile(file, event.clientY, event.clientX);
    }

    createWindowFromFile(file: File, posY: number, posX: number) {
        if (file.type.startsWith("image/")) {
            const e = new CustomEvent("createWindow", {
                detail: {
                    type: "image",
                    file: file,
                    posY,
                    posX,
                },
            });
            this.dispatchEvent(e);
        }
    }

    uploadFile(event: MouseEvent) {
        const el = document.createElement("input");
        el.type = "file";
        el.accept = "image/*";
        el.addEventListener("input", () => {
            if (!el.files?.[0]) {
                return;
            }

            this.createWindowFromFile(el.files?.[0], event.clientY, event.clientX);
            el.remove();
        });

        el.click();
    }

    render() {
        const stopDrag = (event: DragEvent) => {
            event.preventDefault();
            this.isDragging = false;
        };

        return html`
            <div
                style="opacity: ${this.isDragging ? 0.05 : 0}"
                @dragover="${this.dragOver}"
                @dragleave="${stopDrag}"
                @dragend="${stopDrag}"
                @drop="${this.drop}"
                @contextmenu="${(e: MouseEvent) => {
                    e.preventDefault();
                    this.context = e;
                }}"
            ></div>

            ${this.context
                ? html`<context-menu
                      .event=${this.context as MouseEvent}
                      @destroy=${() => {
                          this.context = null;
                      }}
                      .body=${html`
                          <button
                              @click=${(e: MouseEvent) => {
                                  this.uploadFile(e);
                                  this.context = null;
                              }}
                              >Upload</button
                          >

                          <button
                              style="margin-top: 16px;"
                              @click=${() => {
                                  this.context = null;
                              }}
                              >Close All Windows</button
                          >
                      `}
                  ></context-menu>`
                : null}
        `;
    }
}
