const path = require('path');
const rootPath = process.cwd();
const { merge } = require('webpack-merge');
const chalk = require('chalk');
const watchMode = global.watch || false;

const options = process.argv;
var userConfigPath = '/assets/config.json';

/**
 * Checks if the config.json path is available inside the package.json config.
 * If not we'll fall back to the default path themeDir/assets/config.json
 */
if (process.env.npm_package_config_userConfig) {
    userConfigPath = process.env.npm_package_config_userConfig;
}
/**
 * Checks if userConfigPath file exists.
 */
try {
    require.resolve((__dirname, rootPath) + userConfigPath);
} catch (e) {
    console.log('\n❌ ', chalk.black.bgRed('Error locating "' + userConfigPath + '".'));
    console.log('Did you create the config.json file in set location already?\n');
    process.exit();
}
userConfig = require(path.resolve(__dirname, rootPath) + userConfigPath);

var themePath = '/';
var assetsPath = userConfig['assetsPath'];
var skipDependencyExtraction = false;
var scssSettingsFolder = '';
var publicPath = '';
var externals = {};

/**
 * If the /assets/config.json file has a themePath option
 * we overwrite the themePath var with this new path.
 */
if (userConfig['themePath']) {
    themePath = userConfig['themePath'];
}

/***
 * Set the path to the scss folder containing the _variables.scss file
 */
if (!userConfig['scssSettingsFolder']) {
    console.log('\n❌ ', chalk.black.bgRed('Variable scssSettingsFolder not set in config.json'));
    console.log('This is probably 01-settings/ or 1_common/ \n');
    process.exit(1);
}
scssSettingsFolder = path.join(assetsPath, 'styles', userConfig['scssSettingsFolder']);
scssSettingsFolder = scssSettingsFolder.replace(/^\/+/, '');

/**
 * Check if root to theme path is set.
 * Sets up proper publicPath and removes extra slashes from the url.
 */
if (!userConfig['rootToThemePath']) {
    console.log('\n❌ ', chalk.black.bgRed('Variable rootToThemePath not set in config.json'));
    console.log('This is probably /app/themes/YOURTHEMENAME/ or /wp-content/themes/YOURTHEMENAME/ \n');
    process.exit(1);
}
publicPath = 'http://localhost:3000/' + userConfig['rootToThemePath'] + '/dist/';
publicPath = publicPath.replace(/([^:])(\/\/+)/g, '$1/');

/**
 * If the /assets/config.json file has a skipDependencyExtraction option
 * we overwrite the themePath var with this new path.
 */
if (!userConfig['skipDependencyExtraction']) {
    externals = { $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery' };
}

var config = merge(
    {
        path: {
            theme: path.join(rootPath, themePath), // from root folder path/to/theme
            dist: path.join(rootPath, themePath, 'dist'), // from root folder path/to/theme
            assets: path.join(rootPath, assetsPath), // from folder containing the package.json to the theme folder.
            scssSettingsFolder: path.join(rootPath, scssSettingsFolder),
            urlLoaderAssets: [path.join(rootPath, assetsPath)], // create path for the url-loader. When we have a parent/child theme going we'll add the parent theme assets later on.
            public: publicPath, // Used for webpack.output.publicpath - Had to be set this way to overcome middleware issues with dynamic path.
        },
        externals: externals,
        skipDependencyExtraction: skipDependencyExtraction,
    },
    userConfig,
);

/**
 * When we are running themes in a parent/child
 * setup we add extra paths to the config.path var.
 */
if (userConfig['parentTheme']) {
    config = merge(
        {
            path: {
                parentTheme: path.join(rootPath, '../' + userConfig['parentTheme']),
                parentThemeAssets: path.join(rootPath, '../' + userConfig['parentTheme'] + userConfig['assetsPath']),
            },
        },
        config,
    );
    /**
     * Add parent theme assets folder when we actually use a parent/child setup.
     */
    config.path.urlLoaderAssets.push(config.path.parentThemeAssets);
}

/**
 * Pushes hot middleware client to our entry when in watchmode.
 */
if (watchMode) {
    config.entry.app.push('webpack-hot-middleware/client');
}

/**
 * Pushes our entry file to the start of the entry array.
 */
if (options.includes('--isTestRun')) {
    config.entry.app.unshift('../../src/helpers/publicpath-entry.js');
} else {
    config.entry.app.unshift('basebuilder-config/src/helpers/publicpath-entry.js');
}

module.exports = config;
