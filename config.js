const path = require('path');
const rootPath = process.cwd();
const merge = require('webpack-merge');
const chalk = require('chalk');
const watchMode = global.watch || false;

var userConfig = require(path.resolve(__dirname, rootPath) + '/assets/config.json');
var themePath = '/';

/**
 * Checks if the config.json path is available inside the package.json config.
 * If not we'll fall back to the default path themeDir/assets/config.json
 */
if (process.env.npm_package_config_userConfig) {
	var userConfigPath = process.env.npm_package_config_userConfig;
	userConfig = require(path.resolve(__dirname, rootPath) + userConfigPath);
}

/**
 * Check if root to theme path is set.
 * Sets up proper publicPath and removes extra slashes from the url.
 */
if (userConfig['rootToThemePath']) {
	var publicPath = 'http://localhost:3000/' + userConfig['rootToThemePath'] + '/dist/';
	var publicPath = publicPath.replace(/([^:])(\/\/+)/g, '$1/');
} else {
	console.log('\n❌ ', chalk.black.bgRed('Variable rootToThemePath not set in config.json \n'));
	process.exit(1);
}

/**
 * If the /assets/config.json file has a themePath option
 * we overwrite the themePath var with this new path.
 */
if (userConfig['themePath']) {
	themePath = userConfig['themePath'];
}

var config = merge(
	{
		path: {
			theme: path.join(rootPath, themePath), // from root folder path/to/theme
			dist: path.join(rootPath, themePath + '/dist/'), // from root folder path/to/theme
			assets: path.join(rootPath, userConfig['assetsPath']), // from folder containing the package.json to the theme folder.
			urlLoaderAssets: [path.join(rootPath, userConfig['assetsPath'])],	// create path for the url-loader. When we have a parent/child theme going we'll add the parent theme assets later on.
			public: publicPath, // Used for webpack.output.publicpath - Had to be set this way to overcome middleware issues with dynamic path.
		},
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
config.entry.app.unshift('basebuilder-config/publicpath_entry.js');
module.exports = config;
