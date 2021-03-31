#!/usr/bin/env node
'use strict';

// Update notifier.
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const { version } = require('../package.json');
const pkg = require('../package.json');
const { program } = require('commander');

const notifier = updateNotifier({
	pkg,
	shouldNotifyInNpmScript: true,
});

if (notifier.update !== undefined) {

	notifier.notify({
		message: 'Update available ' + chalk.dim(notifier.update.current) + chalk.reset(' → ') + chalk.green(notifier.update.latest) + ' \nRun ' + chalk.cyan('yarn add ') + notifier.packageName + ' to update',
	});
}

program
	.name('basebuilder-config').description(
		'Webpack config for WordPress projects.\n\n'
	)
	.option('-t, --isTestRun', 'Run in test mode')
	.version(version)



program
	.command('development')
	.description('Build assets once for development.')
	.action((options) => {
		require('./tasks/development');
	});

program
	.command('watch')
	.description('Serve assets and proxy website with browsersync.')
	.action((options) => {
		require('./tasks/watch');
	});

program
	.command('production', { isDefault: true })
	.description('Build assets optimized for production.')
	.action((options) => {
		require('./tasks/production');
	});


program.parse(process.argv);
const options = program.opts();