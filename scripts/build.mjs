import * as esbuild from "esbuild";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "src");

const target = process.argv[2] ?? "chrome";
if (!["chrome", "firefox"].includes(target)) {
  console.error(`Unknown target: ${target}. Use 'chrome' or 'firefox'.`);
  process.exit(1);
}

const OUT = join(ROOT, `dist/${target}`);

mkdirSync(join(OUT, "background"), { recursive: true });
mkdirSync(join(OUT, "content"), { recursive: true });
mkdirSync(join(OUT, "popup"), { recursive: true });
mkdirSync(join(OUT, "options"), { recursive: true });
mkdirSync(join(OUT, "icons"), { recursive: true });
mkdirSync(join(OUT, "i18n"), { recursive: true });

const sharedConfig = {
  bundle: true,
  minify: false,
  sourcemap: "inline",
  target: "es2020",
  format: "esm",
  define: {
    "process.env.NODE_ENV": '"production"',
  },
};

await Promise.all([
  esbuild.build({
    ...sharedConfig,
    entryPoints: [join(SRC, "background/index.ts")],
    outfile: join(OUT, "background/index.js"),
  }),
  esbuild.build({
    ...sharedConfig,
    entryPoints: [join(SRC, "content/index.ts")],
    outfile: join(OUT, "content/index.js"),
  }),
  esbuild.build({
    ...sharedConfig,
    entryPoints: [join(SRC, "popup/App.tsx")],
    outfile: join(OUT, "popup/App.js"),
    jsx: "automatic",
    jsxImportSource: "preact",
  }),
  esbuild.build({
    ...sharedConfig,
    entryPoints: [join(SRC, "options/options.ts")],
    outfile: join(OUT, "options/options.js"),
  }),
]);

// Copy static files
copyFileSync(join(SRC, "popup/index.html"), join(OUT, "popup/index.html"));
copyFileSync(join(SRC, "popup/styles.css"), join(OUT, "popup/styles.css"));
copyFileSync(join(SRC, "options/index.html"), join(OUT, "options/index.html"));

for (const locale of ["en", "pt-BR", "es"]) {
  copyFileSync(join(SRC, `i18n/${locale}.json`), join(OUT, `i18n/${locale}.json`));
}

for (const size of [16, 32, 48, 128]) {
  copyFileSync(join(SRC, `icons/${size}.png`), join(OUT, `icons/${size}.png`));
}

// Copy manifest
const manifestSrc = join(ROOT, `manifests/manifest.${target}.json`);
copyFileSync(manifestSrc, join(OUT, "manifest.json"));

console.log(`\nBuild complete → dist/${target}/`);
