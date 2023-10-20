#!/usr/bin/env node

// Update notifier..
const chalk = require('chalk');

const { program } = require('commander');
const { version } = require('../package.json');
const commandName = 'Basebuilder';


// Check for updates by running the async function checkForUpdates
// from the file helpers/updater.js
(async () => {
    const { checkForUpdates } = await import('./helpers/updater.mjs');
    await checkForUpdates();
})();


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
