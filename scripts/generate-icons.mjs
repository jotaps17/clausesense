import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "src", "icons");
mkdirSync(OUT, { recursive: true });

// CRC32
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (const b of buf) crc = CRC_TABLE[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function u32be(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(n);
  return b;
}

function chunk(type, data) {
  const t = Buffer.from(type, "ascii");
  const crc = crc32(Buffer.concat([t, data]));
  return Buffer.concat([u32be(data.length), t, data, u32be(crc)]);
}

// Draws a solid square with a simple "C" letterform cut out in white
function makePNG(size) {
  const bg = [30, 58, 95];   // #1e3a5f — brand dark blue
  const fg = [255, 255, 255]; // white letter

  const pixels = Buffer.alloc(size * size * 3);

  // Fill background
  for (let i = 0; i < size * size; i++) {
    pixels[i * 3] = bg[0]; pixels[i * 3 + 1] = bg[1]; pixels[i * 3 + 2] = bg[2];
  }

  // Draw a simple "shield" shape: rounded rectangle inner mask
  const margin = Math.max(1, Math.round(size * 0.15));
  const cx = size / 2;
  const cy = size / 2;
  const rx = size / 2 - margin;
  const ry = size / 2 - margin;

  // White "C" arc approximated as thick arc pixels
  const lineWidth = Math.max(1, Math.round(size * 0.12));
  const radius = Math.round(size * 0.28);
  const gapAngle = 60; // degrees gap on right side

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx + 0.5;
      const dy = y - cy + 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
      // Normalize to 0-360
      const angle = (angleDeg + 360) % 360;

      const inRing = dist >= radius - lineWidth && dist <= radius + lineWidth;
      // gap is centered on 0° (right side), from -gapAngle/2 to +gapAngle/2
      const inGap = angle <= gapAngle / 2 || angle >= 360 - gapAngle / 2;

      if (inRing && !inGap) {
        const idx = (y * size + x) * 3;
        pixels[idx] = fg[0]; pixels[idx + 1] = fg[1]; pixels[idx + 2] = fg[2];
      }
    }
  }

  // Build raw PNG image data: filter byte 0 + RGB row
  const rawRows = Buffer.alloc((1 + size * 3) * size);
  for (let y = 0; y < size; y++) {
    rawRows[y * (1 + size * 3)] = 0;
    pixels.copy(rawRows, y * (1 + size * 3) + 1, y * size * 3, (y + 1) * size * 3);
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = chunk("IHDR", Buffer.concat([
    u32be(size), u32be(size),
    Buffer.from([8, 2, 0, 0, 0]),
  ]));
  const idat = chunk("IDAT", deflateSync(rawRows, { level: 6 }));
  const iend = chunk("IEND", Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

for (const size of [16, 32, 48, 128]) {
  const png = makePNG(size);
  writeFileSync(join(OUT, `${size}.png`), png);
  console.log(`  icons/${size}.png — ${png.length} bytes`);
}

console.log("Icons written to src/icons/");
