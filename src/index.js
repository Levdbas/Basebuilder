#!/usr/bin/env node

// Update notifier..
const chalk = require('chalk');
const updateNotifier = require('update-notifier');

const { program } = require('commander');
const pkg = require('../package.json');
const { version } = require('../package.json');
const commandName = 'Basebuilder';
const notifier = updateNotifier({
    pkg,
    shouldNotifyInNpmScript: true,
});

if (notifier.update !== undefined) {
    notifier.notify({
        message:
            'Update available ' +
            chalk.dim(notifier.update.current) +
            chalk.reset(' → ') +
            chalk.green(notifier.update.latest) +
            ' \nRun ' +
            chalk.cyan('yarn add ') +
            notifier.packageName +
            ' to update',
    });
}

program.name(commandName).description('Webpack config for WordPress projects.\n\n').option('-t, --isTestRun', 'Run in test mode').version(version);
program
    .command('development')
    .description('Build assets once for development.')
    .action((name, options, command) => {
        console.log(`Running ${commandName} ${version}`);
        require('./tasks/development');
    });

program
    .command('watch', 'Serve assets and proxy website with browsersync.', { executableFile: './tasks/watch' });

program
    .command('production', { isDefault: true })
    .description('Build assets optimized for production.')
    .action((name, options, command) => {
        console.log(`Running ${commandName} ${version}`);
        require('./tasks/production');
    });

program.parse(process.argv);
