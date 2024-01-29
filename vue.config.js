const { defineConfig } = require('@vue/cli-service')
const TerserPlugin = require("terser-webpack-plugin");

module.exports = defineConfig({
  configureWebpack: {
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
            },
            mangle: true,
            keep_classnames: false,
            keep_fnames: false,
          },
        }),
      ]
    }
  }
})
