#!/usr/bin/env node
'use strict';

// Update notifier.
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');
var current = '';
var latest = '';
var packageName = '';
const notifier = updateNotifier({
	pkg,
	shouldNotifyInNpmScript: true,
});

if (notifier.update !== undefined) {
	current = notifier.update.current;
	latest = notifier.update.latest;
	packageName = notifier.packageName;
}

notifier.notify({
	message: 'Update available ' + chalk.dim(current) + chalk.reset(' → ') + chalk.green(latest) + ' \nRun ' + chalk.cyan('yarn add ') + packageName + ' to update',
});

const spawn = require('../crossSpawn');
const args = process.argv.slice(2);

const scriptIndex = args.findIndex(
	// x => x === 'build' || x === 'eject' || x === 'start' || x === 'test'
	x => x === 'start' || x === 'build' || x === 'eject' || x === 'test',
);
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

switch (script) {
	case 'production':
	case 'development':
	case 'watch': {
		const result = spawn.sync('node', nodeArgs.concat(require.resolve('../scripts/' + script)).concat(args.slice(scriptIndex + 1)), { stdio: 'inherit' });
		if (result.signal) {
			if (result.signal === 'SIGKILL') {
				console.log('The build failed because the process exited too early. ' + 'This probably means the system ran out of memory or someone called ' + '`kill -9` on the process.');
			} else if (result.signal === 'SIGTERM') {
				console.log('The build failed because the process exited too early. ' + 'Someone might have called `kill` or `killall`, or the system could ' + 'be shutting down.');
			}
			process.exit(1);
		}
		process.exit(result.status);
		break;
	}
	default:
		console.log('Unknown script "' + script + '".');
		console.log('Perhaps you need to update basebuilder-config?');
		console.log('Update via: yarn add basebuilder-config?');
		break;
}
