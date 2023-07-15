const path = require("path")
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    // mode: 'development',
    mode: "production",
    target: ['web'],
    entry: "./src/index.js", // 入口
    output: {
        path: path.join(__dirname, "dist"), // 出口路径
        filename: "main.js" // 出口文件名
    },
    optimization: {
        sideEffects: false,
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "main.yml", to: "main.yml" },
            ],
        })
    ],
}
