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
                options: {
                    compilerOptions: {
                        compatConfig: {
                            MODE: 2,
                        },
                    },
                },
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
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        // Lossless optimization with custom option
                        // Feel free to experement with options for better result for you
                        plugins: [
                            ["jpegtran", { progressive: true }],
                            ['optipng', { optimizationLevel: 1 }],
                            [
                                'svgo',
                                {
                                    plugins: [
                                        {
                                            name: 'preset-default',
                                            params: {
                                                overrides: {
                                                    // customize options for plugins included in preset
                                                    addAttributesToSVGElement: {
                                                        params: {
                                                            attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
                                                        },
                                                    },
                                                    removeViewBox: false,
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        ],
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

if (!config.skipDependencyExtraction) {
    webpackConfig.plugins.push(
        new DependencyExtractionWebpackPlugin({
            outputFormat: 'json',
        }),
    );
}

module.exports = webpackConfig;
