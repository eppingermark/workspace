/* components */
import "@components/app-root";
import "@components/context-menu";
import "@components/drag-controller";
import "@components/image-window";
import "@components/test-window";
import "@components/toast-controller";

/* components/ui */
import "@components/ui/custom-button";
import "@components/ui/custom-select";
import "@components/ui/tab-group";

/* styles */
import "./index.css";

/* 3rd party */
import "lit-portal";

/* image magick */
import imageMagickWasm from "@assets/magick.wasm";
import { initializeImageMagick } from "@imagemagick/magick-wasm";

(async () => {
    const res = await fetch(imageMagickWasm);
    await initializeImageMagick(await res.arrayBuffer());
})();
