import { type CSSResultGroup, css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

export class Window extends LitElement {
    static styles: CSSResultGroup = [
        css`
            div.window {
                color: #fff;
                background-color: #2b2b2b;
                display: flex;
                flex-direction: column;
                position: absolute;
                border-radius: 4px;
                overflow: hidden;
                z-index: 20;

                div.head {
                    padding: 4px;
                    cursor: move;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;

                    button {
                        cursor: pointer;
                        width: 12px;
                        height: 12px;
                        margin: 0 3px 0 0;
                        padding: 0;
                        background-color: #f00;
                        border: none;
                        border-radius: 99999px;
                    }
                }

                div.body {
                    height: 100%;
                }

                div.resizer {
                    position: absolute;
                    width: 12px;
                    height: 12px;
                    right: 0;
                    bottom: 0;
                    cursor: se-resize;
                    background: rgba(255, 255, 255, 0.2);
                    z-index: 10;
                }
            }

            * {
                user-select: none;
            }
        `,
    ];

    @property({ type: Number }) sizeX = 300;
    @property({ type: Number }) sizeY = 200;
    @property({ type: Number }) posX = 100;
    @property({ type: Number }) posY = 100;
    @property({ type: String }) title = "";
    @property({ type: Number }) zIndex = 0;
    @state() _isResizing = false;
    @state() _isDragging = false;
    @state() _zIndex = 30;
    dragOffsetX = 0;
    dragOffsetY = 0;
    resizeStartX = 0;
    resizeStartY = 0;
    startSizeX = 0;
    startSizeY = 0;
    maxHeight = 1000;
    minHeight = 200;
    maxWidth = 1000;
    minWidth = 200;

    private _onMouseMoveRef = this._onMouseMove.bind(this);
    private _onMouseUpRef = this._onMouseUp.bind(this);
    private windowFocusGainRef = this.windowFocusGain.bind(this);

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener("mousemove", this._onMouseMoveRef);
        window.addEventListener("mouseup", this._onMouseUpRef);
        /* @ts-ignore-next */
        window.addEventListener("windowFocusGain", this.windowFocusGainRef);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener("mousemove", this._onMouseMoveRef);
        window.removeEventListener("mouseup", this._onMouseUpRef);
        /* @ts-ignore-next */
        window.removeEventListener("windowFocusGain", this.windowFocusGainRef);
    }

    windowFocusGain(e: CustomEvent) {
        if (this.id === `window-${e.detail}`) {
            this._zIndex = 30;
        } else {
            this._zIndex = 20;
        }
    }

    _onMouseMove(e: MouseEvent) {
        if (this._isDragging) {
            this.posX = e.clientX - this.dragOffsetX;
            this.posY = e.clientY - this.dragOffsetY;
        } else if (this._isResizing) {
            const dx = e.clientX - this.resizeStartX;
            const dy = e.clientY - this.resizeStartY;
            this.sizeX = Math.min(this.maxWidth, Math.max(this.minWidth, this.startSizeX + dx));
            this.sizeY = Math.min(this.maxHeight, Math.max(this.minHeight, this.startSizeY + dy));
            this.requestUpdate();
        }
    }

    _onMouseUp() {
        this._isDragging = false;
        this._isResizing = false;
    }

    _startResize(e: MouseEvent) {
        this._isResizing = true;
        this.resizeStartX = e.clientX;
        this.resizeStartY = e.clientY;
        this.startSizeX = this.sizeX;
        this.startSizeY = this.sizeY;
    }

    _startDrag(e: MouseEvent) {
        this._isDragging = true;
        this.dragOffsetX = e.clientX - this.posX;
        this.dragOffsetY = e.clientY - this.posY;
    }

    innerRender() {}

    destroy() {
        const event = new Event("destroy");
        this.dispatchEvent(event);
        this?.disconnectedCallback();
        this?.remove();
    }

    render() {
        const inner = this.innerRender();

        return html`
            <div
                class="window"
                style="height: ${this.sizeY + 26}px; width: ${this.sizeX}px; left: ${this.posX}px; top: ${this
                    .posY}px; z-index: ${this._zIndex}"
                @mousedown=${() => {
                    const event = new Event("gainedFocus");
                    this.dispatchEvent(event);
                }}
            >
                <div class="head" @mousedown=${this._startDrag}>
                    ${this.title}
                    <button @click="${this.destroy}"></button>
                </div>
                <div class="body">${inner}</div>
                <div class="resizer" @mousedown=${this._startResize}></div>
            </div>
        `;
    }
}
