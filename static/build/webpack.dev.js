const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: path.resolve(__dirname, '../src/index.js'),
	output: {
		filename: '[name].[hash].js',
		path: path.resolve(__dirname, '../dist')
	},
	devServer: {
		port: 3000,
		open: false,
		hot: true,
		proxy: {
			'/api': 'http://localhost:4000'
		}
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env'],
					// 编译后的缓存，加快速度
					cacheDirectory: true
				}
			}
		},
		{
			test: /\.css$/,
			// exclude: /node_modules/,
			use: [
				'style-loader',
				// 做处理，很多功能、插件
				'css-loader',
				'postcss-loader'
			]
		},
		{
			test: /\.less$/,
			// exclude: /node_modules/,
			use: [
				'style-loader', // 将 JS 字符串生成为 style 节点
				'css-loader', // 将 CSS 转化成 CommonJS 模块
				'less-loader' // 将 less 编译成 CSS
			]
		},
		{
			test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
			loader: 'url-loader',
			options: {
				limit: 8192
			}
		},
			// dev模式，vue-loader在这
		{
			test: /\.vue$/,
			loader: 'vue-loader'
		},
		{
			test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
			loader: 'url-loader',
			options: {
				limit: 8192
			}
		},
		{
			test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
			loader: 'url-loader',
			options: {
				limit: 8192
			}
		}
		]
	},
	// 当资源在import、require的时候做的一些操作。（css里的@import不算。应该配置在css-loader）
	// 一般是配置别名。省略扩展名
	resolve: {
		extensions: ['.js', '.vue', '.css', '.less'],
		alias: {
			'vue': 'vue/dist/vue.esm.js',
			'@': path.resolve(__dirname, '../src'),
			'@config': path.resolve(__dirname, '../src/common/config'),
			'@components': path.resolve(__dirname, '../src/components')
		}
	},
	devtool: 'cheap-module-eval-source-map',
	plugins: [
		new CopyWebpackPlugin([{
			from: path.resolve(__dirname, '../static'),
			to: path.resolve(__dirname, '../dist/static')
		}]),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '../public/index.html')
		}),
		new webpack.DefinePlugin({
			'process.env': '"development"'
		})
	]
};
