var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
module.exports = {
    devtool: 'eval-source-map',
    entry:  __dirname + "/index.js",
    output: {
        path: __dirname + "/tmpl",
        filename: "bundle.js"
    },

    module:{
      loaders:[
          {
              test:/\.js$/,
              exclude:/node_modules/,
              loader:'babel'
          },
          {
              test:/\.css$/,
              loader:'style!css?!postcss'
          },
          {
                test: /\.scss$/,
                loader: 'style!css!sass' //这里用了样式分离出来的插件，如果不想分离出来，可以直接这样写 loader:'style!css!sass'
            },
          {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loaders: [
                'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
                'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
            ]
          }
      ]
    },

    devServer: {
        contentBase: "./tmpl",
        colors: true,
        historyApiFallback: true,
        inline: true,
        hot:true
    },
    postcss:[
        autoprefixer({browsers:['last 10 versions']})
    ],

    plugins:[
        new webpack.BannerPlugin('Copyright liuzhen'),
        new webpack.HotModuleReplacementPlugin()
    ]
}