module.exports = {
  publicPath: 'https://kodanuki.work/janken/',
  "pluginOptions": {
    "style-resources-loader": {
      "preProcessor": "sass",
      "patterns": [
        "C:\\Users\\code_\\PhpstormProjects\\janken\\src\\style\\sass\\*.scss"
      ]
    }
  },
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'じゃんけん Online',
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}