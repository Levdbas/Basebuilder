/**
 * Assets Config file
 */
process.noDeprecation = true;
const rootPath = process.cwd();
const env = process.env.NODE_ENV;
const devMode = process.env.NODE_ENV !== 'production';
const watchMode = global.watch || false;
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const PalettePlugin = require('wordpress-palette-webpack-plugin');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const config = require('../config');
const CreateSourceMap = devMode ? config.sourceMaps : false;

const webpackConfig = {
    mode: env,
    context: config.path.assets,
    entry: config.entry,
    devtool: CreateSourceMap ? 'inline-cheap-module-source-map' : false,
    watch: watchMode,
    watchOptions: {
        ignored: ['*.sys', '*.log.tmp', '**/*.sys', '**/*.log.tmp', '**/node_modules'],
    },
    output: {
        filename: devMode ? 'scripts/[name].js' : 'scripts/[name].[contenthash].js',
        chunkFilename: devMode ? 'scripts/[name].bundle.js' : 'scripts/[name].bundle.[contenthash].js',
        path: config.path.dist,
        publicPath: config.path.public,
        pathinfo: false,
        clean: true
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
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.scss$/,
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
                test: /\.(png|jpg|gif|svg)$/i,
                type: 'asset',
                generator: {
                    filename: devMode ? 'images/[name][ext]' : 'images/[name].[contenthash][ext]',
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                type: 'asset/resource',
                generator: {
                    filename: devMode ? 'fonts/[name][ext]' : 'fonts/[name].[contenthash][ext]',
                },
            },
        ],
    },
    resolve: {
        modules: [path.resolve(rootPath + '/node_modules')],
        alias: {
            vue: '@vue/compat',
            blocks: path.resolve(__dirname, config.path.theme + '/blocks'),
            parentThemeBlocks: path.resolve(__dirname, config.path.parentTheme + '/blocks'),
            parentThemeStyles: path.resolve(__dirname, config.path.parentThemeAssets + 'styles'),
            parentThemeScripts: path.resolve(__dirname, config.path.parentThemeAssets + 'scripts'),
            parentThemeFonts: path.resolve(__dirname, config.path.parentThemeAssets + 'fonts'),
            parentThemeImages: path.resolve(__dirname, config.path.parentThemeAssets + 'images'),
        },
    },
    externals: config.externals,
    plugins: [
        new WebpackManifestPlugin({
            publicPath: '',
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: devMode ? 'styles/[name].css' : 'styles/[name].[contenthash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css',
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: config.path.assets + '/images',
                    to: devMode ? 'images/[path][name][ext]' : 'images/[path][name].[contenthash][ext]',
                    globOptions: {
                        dot: true,
                        gitignore: true,
                        ignore: ['**/.gitkeep'],
                    },
                },
            ],
        }),

        new PalettePlugin({
            output: 'theme.json',
            output_prepend: '../',
            blacklist: ['transparent', 'inherit'],
            wp_theme_json: true,
            pretty: false,
            sass: {
                path: config.path.scssSettingsFolder,
                files: ['_variables.scss'],
                variables: ['brand-colors'],
            },
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    name: 'vendor',
                    minChunks: 2,
                },
            }
        },
        minimizer: [
            new TerserPlugin({
                parallel: true,
            }),
            new ImageMinimizerPlugin({
                minimizer: [
                    {
                        // `sharp` will handle all bitmap formats (JPG, PNG, GIF, ...)
                        implementation: ImageMinimizerPlugin.sharpMinify,

                        // exclude SVG if implementation support it. Not required for `sharp`.
                        // filter: (source, sourcePath) => !(/\.(svg)$/i.test(sourcePath)),

                        options: {
                            encodeOptions: {
                                // Your options for `sharp`
                                // https://sharp.pixelplumbing.com/api-output
                            },
                        },
                    },
                    {
                        // `svgo` will handle vector images (SVG)
                        implementation: ImageMinimizerPlugin.svgoMinify,
                        options: {
                            encodeOptions: {
                                // Pass over SVGs multiple times to ensure all optimizations are applied. False by default
                                multipass: true,
                                plugins: [
                                    // set of built-in plugins enabled by default
                                    // see: https://github.com/svg/svgo#default-preset
                                    "preset-default",
                                ],
                            },
                        },
                    },
                ],
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

if (!config.skipDependencyExtraction) {
    webpackConfig.plugins.push(
        new DependencyExtractionWebpackPlugin({
            outputFormat: 'json',
        }),
    );
}

module.exports = webpackConfig;
