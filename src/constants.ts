import { MagickFormat } from "@imagemagick/magick-wasm";

export const ImageFormatData = [
    {
        name: "PNG",
        format: MagickFormat.Png,
        mime: "image/png",
        ext: "png",
    },
    {
        name: "WEBP",
        format: MagickFormat.WebP,
        mime: "image/webp",
        ext: "webp",
    },
    {
        name: "JPEG",
        format: MagickFormat.Jpeg,
        mime: "image/jpeg",
        ext: "jpeg",
    },
] as const;
