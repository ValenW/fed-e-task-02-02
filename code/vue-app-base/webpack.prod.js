const common = require('./webpack.common')
const merge = require('webpack-merge')
const path = require('path')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'bundle.[contenthash:8].js',
    path: path.join(__dirname, 'dist')
  },
  devtool: 'none',
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        enforce: 'pre'
      },
    ]
  },
  optimization: {
    usedExports: true, // 只导出外部使用的成员
    minimize: true, // 压缩代码, 去除空行, 死代码等
    concatenateModules: true, // 尽可能将所有模块合并到一个输出函数中
    splitChunks: {
      chunks: 'all',
    }
  },
  plugins: [
    new StyleLintPlugin({
      files: ['**/*.{vue,htm,html,css,sss,less,scss,sass}'],
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: 'public/**/*.ico'
      }]
    }),
    new ImageminPlugin({ optimizationLevel: 9 })
  ]
})
