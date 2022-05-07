const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")

module.exports = common.map(config =>
    merge(config, {
        mode: "development",
        devtool: "inline-source-map"
    })
)

// module.exports = merge(common, {
//     mode: "development",
//     devtool: "inline-source-map"
// })
