const { defineConfig } = require('@vue/cli-service')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = defineConfig({
  configureWebpack: config => {
    config.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: { drop_console: true },
            mangle: true, // Note `mangle.properties` is `false` by default.
            module: false,
            output: { comments: false },
            toplevel: false,
            nameCache: null,
            ie8: false,
            keep_classnames: false,
            keep_fnames: false,
            safari10: false,
          },
        }),
      ],
    }
  },
    transpileDependencies: true,
    devServer: {
        allowedHosts: "all"
    }
})
