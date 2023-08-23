const {build} = require("tsup")
const fs = require("fs")
const {dependencies} = require("./package.json")

build({
    entry: ["src/index.ts"],
    format: ["cjs"],
    splitting: false,
    clean: true,
    bundle: true,
    minify: true,
    noExternal: Object.keys(dependencies),
    platform: "node",
}).then(() => {
    fs.copyFileSync(
        "main.yml",
        "dist/main.yml");
});
