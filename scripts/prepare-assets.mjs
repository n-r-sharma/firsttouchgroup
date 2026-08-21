import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const source = join(root, "src/assets/brand/logo-source.png");
const outDir = join(root, "src/assets/brand");
const publicDir = join(root, "public");

await mkdir(outDir, { recursive: true });
await mkdir(publicDir, { recursive: true });

const trimmed = sharp(source).trim({
  background: "#ffffff",
  threshold: 12,
});

const { data, info } = await trimmed
  .clone()
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const pixels = new Uint8Array(data);
for (let i = 0; i < pixels.length; i += 4) {
  const r = pixels[i];
  const g = pixels[i + 1];
  const b = pixels[i + 2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max > 245 && min > 230) {
    pixels[i + 3] = 0;
  }
}

const transparent = sharp(pixels, {
  raw: { width: info.width, height: info.height, channels: 4 },
});

await transparent
  .clone()
  .png()
  .toFile(join(outDir, "logo.png"));

const headerHeight = Math.round(info.height * 0.78);
await transparent
  .clone()
  .extract({ left: 0, top: 0, width: info.width, height: headerHeight })
  .png()
  .toFile(join(outDir, "logo-header.png"));

await transparent
  .clone()
  .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(join(publicDir, "apple-touch-icon.png"));

await sharp(join(outDir, "logo.png"))
  .resize(64, 64, { fit: "contain", background: { r: 11, g: 24, b: 40, alpha: 1 } })
  .png()
  .toFile(join(publicDir, "favicon.png"));

console.log("Prepared logo assets", {
  width: info.width,
  height: info.height,
});
