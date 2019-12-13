process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
global.watch = true;

const webpack = require('webpack');
const browserSync = require('browser-sync').create();
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const formatMessages = require('webpack-format-messages');
const chalk = require('chalk');

const webpackConfig = require('../build/webpack.config');
const fileSize = require('../fileSize');
const compiler = webpack(webpackConfig);
const config = require('../config');

browserSync.init({
	files: [
		{
			match: [config.path.theme + '/**/**/**/*.php', config.path.theme + '/**/**/**/*.twig'],
		},
	],
	proxy: {
		target: config.browserSyncURL,
		middleware: [
			webpackDevMiddleware(compiler, {
				publicPath: webpackConfig.output.publicPath,
				noInfo: true,
				stats: false,
				writeToDisk: filePath => {
					return /^(?!.*(hot-update)).*/.test(filePath);
				},
			}),
			webpackHotMiddleware(compiler, {
				log: false,
				logLevel: 'none',
			}),
		],
	},
});

compiler.hooks.done.tap('test', stats => {
	const messages = formatMessages(stats);
	const my_stats = stats.toJson('verbose');
	const assets = my_stats.assets;
	var totalSize = 0;
	console.log(`\n${chalk.dim("Let's build and compile the files...")}`);
	if (!messages.errors.length && !messages.warnings.length) {
		console.log('\n✅ ', chalk.black.bgGreen(' Compiled successfully! \n'));
		console.log();
	}

	if (messages.errors.length) {
		console.log('\n❌ ', chalk.black.bgRed(' Failed to compile build. \n'));
		console.log('\n👉 ', messages.errors.join('\n\n'));
		return;
	}

	if (messages.warnings.length) {
		console.log('\n❌ ', chalk.yellow(' Compiled with warnings. \n'));
		console.log('\n👉 ', messages.warnings.join('\n\n'));
	}
});
