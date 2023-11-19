const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  configureWebpack: config => {
      minimize: true,
    }
  },
    transpileDependencies: true,
    devServer: {
      allowedHosts: "all",
    }
})
