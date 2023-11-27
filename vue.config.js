const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
   terser: {
        minify: 'uglifyJs',
        terserOptions: {
            compress: {
                drop_console: true,
            },
        },
    },
    transpileDependencies: false,
    devServer: {
      allowedHosts: "all"
    }
})
