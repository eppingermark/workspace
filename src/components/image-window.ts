import { ImageFormatData } from "@/constants";
import { ImageMagick } from "@imagemagick/magick-wasm";
import { css, html, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Window } from "./base/window";

@customElement("image-window")
export class ImageWindow extends Window {
    static styles = [
        super.styles,
        css`
            .inner {
                height: 100%;
                display: flex;
                flex-direction: row;
                background-color: #3d3d3d;

                .image-container {
                    overflow: hidden;
                    flex-grow: 1;
                    position: relative;
                    cursor: grab;
                }

                .image-container.dragging {
                    cursor: grabbing;
                }

                .image-container img {
                    user-select: none;
                    pointer-events: none;
                    transform-origin: top left;
                    will-change: transform;
                    display: block;
                    max-width: none;
                    max-height: none;
                    position: absolute;
                    top: 0;
                    left: 0;
                }

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
            }
        `,
    ];

    @property({ type: Object }) file: File = null as unknown as File;
    @state() objectUrl: string | null = null;
    @state() width = 0;
    @state() height = 0;
    @state() private scale = 1;
    @state() private translateX = 0;
    @state() private translateY = 0;
    @state() currentConvertSelect = "png";
    private dragging = false;
    private dragStart = { x: 0, y: 0 };

    connectedCallback() {
        super.connectedCallback();

        if (this.file) {
            this.loadImage(this.file);
            this.title = this.file.name;
        }
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();

        if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    }

    updated(changedProperties: PropertyValues) {
        super.updated(changedProperties);

        if (changedProperties.has("file") && this.file) {
            if (this.objectUrl) {
                URL.revokeObjectURL(this.objectUrl);
            }

            this.objectUrl = URL.createObjectURL(this.file);
            this.title = this.file.name;
        }
    }

    async loadImage(file: File) {
        const url = URL.createObjectURL(file);
        try {
            const { width, height } = await this.getScaledImageSize(file);
            this.objectUrl = url;
            this.width = width;
            this.height = height;
            this.sizeX = this.width;
            this.sizeY = this.height;
        } catch (err) {
            console.error("Failed to load image:", err);
            URL.revokeObjectURL(url);
        }
    }

    getScaledImageSize(file: File): Promise<{ width: number; height: number }> {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file);
            const img = new Image();

            img.onload = () => {
                const aspectRatio = img.width / img.height;
                const screenArea = window.innerWidth * window.innerHeight * 0.1;
                const targetHeight = Math.sqrt(screenArea / aspectRatio);
                const targetWidth = targetHeight * aspectRatio + 200;

                URL.revokeObjectURL(url);

                resolve({
                    width: Math.round(targetWidth),
                    height: Math.round(targetHeight),
                });
            };

            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error("Could not load image"));
            };

            img.src = url;
        });
    }

    async convert() {
        const data =
            ImageFormatData.find((d) => d.ext === this.currentConvertSelect) ??
            ImageFormatData[0];
        const format = data.format;
        const type = data.mime;

        ImageMagick.read(
            new Uint8Array(await this.file.arrayBuffer()),
            (image) => {
                image.write(format, (outputBytes) => {
                    this.file = new File(
                        [new Uint8Array(outputBytes)],
                        this.file.name.replace(/\.\w+$/, `.${data.ext}`),
                        {
                            type,
                        },
                    );
                });
            },
        );
    }

    download() {
        const anchor = document.createElement("a");
        anchor.href = this.objectUrl ?? "";
        anchor.download = this.file.name;
        anchor.style.display = "none";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    }

    onWheel(e: WheelEvent) {
        e.preventDefault();
        const scaleFactor = 0.1;
        const delta = -e.deltaY;

        const oldScale = this.scale;
        this.scale += (delta > 0 ? 1 : -1) * scaleFactor;
        this.scale = Math.min(Math.max(this.scale, 0.1), 10);

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        const dx = offsetX - this.translateX;
        const dy = offsetY - this.translateY;

        this.translateX -= dx * (this.scale / oldScale - 1);
        this.translateY -= dy * (this.scale / oldScale - 1);
    }

    onMouseDown(e: MouseEvent) {
        e.preventDefault();
        this.dragging = true;
        this.dragStart = { x: e.clientX, y: e.clientY };
    }

    onMouseMove(e: MouseEvent) {
        if (!this.dragging) return;
        e.preventDefault();
        const dx = e.clientX - this.dragStart.x;
        const dy = e.clientY - this.dragStart.y;

        this.translateX += dx;
        this.translateY += dy;

        this.dragStart = { x: e.clientX, y: e.clientY };
    }

    onMouseUp() {
        this.dragging = false;
    }

    innerRender() {
        return html`
            <div class="inner">
                <div
                    class="image-container ${this.dragging ? "dragging" : ""}"
                    @wheel=${this.onWheel}
                    @mousedown=${this.onMouseDown}
                    @mousemove=${this.onMouseMove}
                    @mouseup=${this.onMouseUp}
                    @mouseleave=${this.onMouseUp}
                >
                    <img
                        src="${this.objectUrl ?? ""}"
                        style="transform: scale(${this.scale}) translate(${this.translateX / this.scale}px, ${
                            this.translateY / this.scale
                        }px);"
                    />
                </div>

                <tab-group
                    .tabs=${["Transform", "Test"]}
                    currentTab="Transform"
                >
                    <div slot="Transform">
                        <h1>Convert</h1>

                        <div class="horizontal">
                            <custom-select @select=${(
                                e: CustomEvent<string>,
                            ) => {
                                this.currentConvertSelect = e.detail;
                            }} .options=${ImageFormatData.map((d) => ({ id: d.ext, display: d.name }))}></custom-select>

                            <custom-button size="small" @click=${this.conver}>Convert</custom-button>
                        </div>

                        <div class="divider"></div>

                        <custom-button @click=${this.download}>Download</custom-button>
                    </div>

                    <div slot="Test">
                        <h1> hii</h1>
                    </div>
                </tab-group>
            </div>
        `;
    }
}
