/**
 * Assets Config file
 */
process.noDeprecation = true;
const env = process.env.NODE_ENV;
const devMode = process.env.NODE_ENV !== 'production';
const watchMode = global.watch || false;
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const PalettePlugin = require('palette-webpack-plugin');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const config = require('../config');
const CreateSourceMap = devMode ? config.sourceMaps : false;

const webpackConfig = {
	mode: env,
	context: config.path.assets,
	entry: config.entry,
	devtool: CreateSourceMap ? 'inline-cheap-module-source-map' : false,
	watch: watchMode,
	output: {
		filename: devMode ? 'scripts/[name].js' : 'scripts/[name].[contenthash].js',
		chunkFilename: devMode ? 'scripts/[name].bundle.js' : 'scripts/[name].bundle.[contenthash].js',
		path: config.path.dist,
		publicPath: config.path.public,
		pathinfo: false,
	},
	performance: { hints: false },
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						cacheDirectory: true,
					},
				},
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '../',
						},
					},
					{
						loader: 'css-loader',
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								config: path.resolve(__dirname, 'postcss.config.js'),
							},
						},
					},
					{
						loader: 'sass-loader',
					},
				],
			},
			{
				test: /\.(ttf|eot|woff2?|png|jpe?g|gif|svg|ico)$/,
				include: config.path.urlLoaderAssets,
				loader: 'url-loader',
				options: {
					limit: 8192,
					name: devMode ? '[path][name].[ext]' : '[path][name].[contenthash].[ext]',
				},
			},
		],
	},
	resolve: {
		alias: {
			acfBlocks: path.resolve(__dirname, config.path.theme + '/partials/blocks'),
			twigBlocks: path.resolve(__dirname, config.path.theme + '/resources/views/blocks'),
			parentThemeStyles: path.resolve(__dirname, config.path.parentThemeAssets + 'styles'),
			parentThemeScripts: path.resolve(__dirname, config.path.parentThemeAssets + 'scripts'),
			parentThemeFonts: path.resolve(__dirname, config.path.parentThemeAssets + 'fonts'),
			parentThemeImages: path.resolve(__dirname, config.path.parentThemeAssets + 'images'),
		},
	},
	externals: config.externals,
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
		}),
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin({
			filename: devMode ? 'styles/[name].css' : 'styles/[name].[contenthash].css',
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: config.path.assets + '/images',
					to: devMode ? 'images/[path][name].[ext]' : 'images/[path][name].[contenthash].[ext]',
					globOptions: {
						ignore: ['.gitkeep'],
					},
				},
			],
		}),

		new PalettePlugin({
			output: 'palette.json',
			blacklist: ['transparent', 'inherit'],
			pretty: false,
			sass: {
				path: 'resources/assets/styles/1_common',
				files: ['_variables.scss'],
				variables: ['brand-colors'],
			},
		}),

		new WebpackManifestPlugin({
			publicPath: '',
			seed: {
				paths: {},
				entries: {},
			},
			map: (file) => {
				if (process.env.NODE_ENV === 'production') {
					// Remove contenthash in manifest key
					file.name = file.name.replace(/(\.[a-f0-9]{32})(\..*)$/, '$2');
				}
				return file;
			},
		}),
	],
	optimization: {
		splitChunks: {
			chunks: 'all',
			automaticNameDelimiter: '-',
			name: 'vendor',
		},
		minimizer: [
			new TerserPlugin({
				parallel: true,
				terserOptions: {
					output: {
						comments: false,
					},
				},
			}),
		],
	},
};

/**
 * Development mode specific plugins.
 *
 * Running in both watch and dev mode.
 *
 * @since 1.4
 * @param  {boolean} devMode if development mode is enabled in Webpack
 * @return {object}           updated webpackConfig configuration object.
 */
if (watchMode) {
	webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
}

/**
 * Production mode specific plugins.
 * @since 1.4
 * @param  {boolean} devMode if development mode is enabled in Webpack
 * @return {object}           updated webpackConfig configuration object.
 */
if (!devMode) {
	webpackConfig.plugins.push(
		new CleanWebpackPlugin(),
		new ImageMinimizerPlugin({
			minimizerOptions: {
				// Lossless optimization with custom option
				// Feel free to experiment with options for better result for you
				plugins: [
					['gifsicle', { interlaced: true }],
					['jpegtran', { progressive: true }],
					['optipng', { optimizationLevel: 5 }],
					[
						'svgo',
						{
							plugins: [
								{
									removeViewBox: false,
								},
							],
						},
					],
				],
			},
		}),
	);
}
if (!config.skipDependencyExtraction) {
	webpackConfig.plugins.push(
		new DependencyExtractionWebpackPlugin({
			outputFormat: 'json',
		}),
	);
}

module.exports = webpackConfig;
