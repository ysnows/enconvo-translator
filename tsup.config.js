import {defineConfig} from "tsup";

export default defineConfig({
    entry: ["src/index.js"],
    format: ["cjs", "esm"],
    splitting: false,
    sourcemap: true,
    clean: true,
    bundle: true,
    minify: true,
    dts: true,
});
