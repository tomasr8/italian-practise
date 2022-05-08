const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = [
    {
        entry: { background: "./src/background.js" },
        resolve: {
            extensions: [".js"]
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    { from: "./src/manifest.json" },
                    { from: "./preprocess/combined.json.gz" },
                    { from: "./src/icons/italy-16.png", to: "icons" },
                    { from: "./src/icons/italy-32.png", to: "icons" }
                ]
            })
        ],
        output: { filename: "[name].js", path: path.resolve(__dirname, "dist") }
    },
    {
        entry: { index: "./src/popup/index.js" },
        resolve: {
            extensions: [".js"]
        },
        module: {
            rules: [
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        // Creates `style` nodes from JS strings
                        "style-loader",
                        // Translates CSS into CommonJS
                        "css-loader",
                        // Compiles Sass to CSS
                        "sass-loader"
                    ]
                },
                {
                    test: /\.svg/,
                    type: "asset/source"
                }
            ]
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    { from: "src/popup/popup.html" },
                    { from: "src/popup/normalize.css" },
                    { from: "src/popup/milligram.css" }
                ]
            })
        ],
        output: { filename: "[name].js", path: path.resolve(__dirname, "dist/popup") }
    }
]
