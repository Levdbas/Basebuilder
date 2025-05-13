process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const webpack = require('webpack');
const webpackConfig = require('../build/webpack.config');
const compiler = webpack(webpackConfig);
const formatMessages = require('webpack-format-messages');
const fileSize = require('../helpers/fileSize');

// Dynamically import Chalk 5 and assign to global
(async () => {
	global.chalk = (await import('chalk')).default;
})();

// Helper to wait for chalk to be loaded
function withChalk(fn) {
	return async (...args) => {
		while (!global.chalk) {
			await new Promise(r => setTimeout(r, 10));
		}
		return fn(...args);
	};
}

compiler.run(withChalk((err, stats) => {
	const messages = formatMessages(stats);
	const my_stats = stats.toJson('verbose');
	const assets = my_stats.assets;
	var totalSize = 0;
	console.log(`\n${global.chalk.dim("Let's build and compile the files...")}`);
	if (!messages.errors.length && !messages.warnings.length) {
		console.log('\n✅ ', global.chalk.black.bgGreen(' Compiled successfully! \n'));
		console.log(global.chalk.dim('Running production build. \n'));

		console.log('\n📦 ', global.chalk.dim('Asset list \n'));

		assets.forEach(function (element) {
			console.log(global.chalk.green('Name: '), element.name);
			console.log(global.chalk.green('Size: '), fileSize(element.size));
			totalSize = totalSize + element.size;
			console.log();
		});
		console.log(global.chalk.green('Total size:'), global.chalk.dim('~'), fileSize(totalSize));
		console.log();
	}

	if (messages.errors.length) {
		console.log('\n❌ ', global.chalk.black.bgRed(' Failed to compile build. \n'));
		console.log('\n👉 ', messages.errors.join('\n\n'));
		return;
	}

	if (messages.warnings.length) {
		console.log('\n❌ ', global.chalk.yellow(' Compiled with warnings. \n'));
		console.log('\n👉 ', messages.warnings.join('\n\n'));
	}
}));