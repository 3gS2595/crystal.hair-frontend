const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  configureWebpack: config => {
    config.optimization = {
      minimize: true,
    }
  },
    transpileDependencies: true,
    devServer: {
      allowedHosts: "all",
    }
})
