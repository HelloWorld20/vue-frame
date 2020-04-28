const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const server_conf = loadJSON('../var/server.config.json');

const webpackConfig = {
	mode: 'production',
	entry: path.resolve(__dirname, '../src/index.js'),
	output: {
		filename: './js/[name].[hash:8].js',
		path: path.resolve(__dirname, '../dist'),
		publicPath: `${server_conf.CDN}/app/static/dist`
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
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
				use: [
					MiniCssExtractPlugin.loader,
					// 做处理，很多功能、插件
					{
						// 引入css、@import、url，可以设置别名
						loader: 'css-loader'
						// options: {
						// 	minimize: true
						// }
					},
					'postcss-loader'
				]
			},
			{
				test: /\.less$/, use: [
					MiniCssExtractPlugin.loader,
					'css-loader', // 将 CSS 转化成 CommonJS 模块
					// "postcss-loader",	// postcss-loader 应该在css-loader下面
					'less-loader' // 将 Less 编译成 CSS
				]
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 8192
				}
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
			'@': path.resolve(__dirname, '../src'),
			'@config': path.resolve(__dirname, '../src/common/config'),
			'@components': path.resolve(__dirname, '../src/components')
		}
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: './styles/common.[hash:8].css'
		}),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, '../static'),
				to: path.resolve(__dirname, '../dist/static')
			}
		]),
		// 零配置，自动清除output.path
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '../public/index.html')
		}),
		new webpack.DefinePlugin({
			'process.env': '"production"'
		})
	],
	// webpack4特有的参数，包含优化。
	// 大概意思是，webpack4会根据mode集成了很多默认的配置，这个就是修改默认配置的
	optimization: {
		minimizer: [
			new UglifyJsPlugin(
				{
					cache: true,
					sourceMap: false,
					uglifyOptions: {
						compress: {
							drop_console: true
						}
					}
				}
			),
			// css压缩
			new OptimizeCssAssetsPlugin({
				// cssProcessor: require('cssnano'),	// 默认
				cssProcessorOptions: {
					safe: true,
					autoprefixer: { disable: true }, // 这里是个大坑，稍后会提到
					mergeLonghand: false,
					discardComments: {
						removeAll: true // 移除注释
					}
				},
				canPrint: true
			})
		],
		splitChunks: {
			cacheGroups: {
				vendors: {
					name: 'vendors',	// 不指定name，则名字为vendors~main
					chunks: 'initial',	// 关键在这个吊毛，设置为initial才会按预期分包
					test: /[\\/]node_modules[\\/]/,
					priority: -10
				}
			}
		}
	}
};

// 打包分析
if (process.argv.includes('--analyze')) {
	webpackConfig.plugins.push(
		new BundleAnalyzerPlugin()
	);
}

function loadJSON(filename) {
	console.log('filename', path.resolve(filename));
	try {
		const content = fs.readFileSync(filename, 'utf8');
		return JSON.parse(content);
	} catch (error) {
		return {};
	}
}

module.exports = webpackConfig;
