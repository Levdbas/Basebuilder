const path = require('path');
const rootPath = process.cwd();
const merge = require('webpack-merge');
const chalk = require('chalk');
const watchMode = global.watch || false;

if (process.env.npm_package_config_userConfig) {
	var userConfigPath = process.env.npm_package_config_userConfig;
	var userConfig = require(path.resolve(__dirname, rootPath) + userConfigPath);
} else {
	var userConfig = require(path.resolve(__dirname, rootPath) + '/assets/config.json');
}

if (userConfig['rootToThemePath']) {
	var publicPath = 'http://localhost:3000/' + userConfig['rootToThemePath'] + '/dist/';
	var publicPath = publicPath.replace(/([^:])(\/\/+)/g, '$1/');
} else {
	console.log('\n❌ ', chalk.black.bgRed('Variable rootToThemePath not set in config.json \n'));
	process.exit(1);
}

var themePath = '/';
if (userConfig['themePath']) {
	var themePath = userConfig['themePath'];
}

var config = merge(
	{
		path: {
			theme: path.join(rootPath, themePath), // from root folder path/to/theme
			masterThemeAssets: path.join(rootPath, '../wp-lemon/resources/assets/'),
			dist: path.join(rootPath, themePath + '/dist/'), // from root folder path/to/theme
			assets: path.join(rootPath, userConfig['assetsPath']), // from folder containing the package.json to the theme folder.
			public: publicPath, // Used for webpack.output.publicpath - Had to be set this way to overcome middleware issues with dynamic path.
		},
	},
	userConfig,
);

if (watchMode) {
	config.entry.app.push('webpack-hot-middleware/client');
}
/**
 * Pushes our entry file to the start of the entry array.
 */
config.entry.app.unshift('basebuilder-config/publicpath_entry.js');
module.exports = config;
