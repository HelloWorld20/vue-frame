module.exports = data => ({
	// parser: this.webpack.resourcePath.endsWith('.css') ? 'sugarss' : false,
	// 这里应该是“sugarss”，但是sugarss不能处理sass，所以不能写
	// 没有parser也可以autoprefixer。不知道为什么
	parser: false,
	plugins: {
		'postcss-cssnext': {
			'warnForDuplicates': false	// 禁用warning
		},
		'autoprefixer': {},
		'cssnano': data.env === 'production' ? {} : false
	}
});
