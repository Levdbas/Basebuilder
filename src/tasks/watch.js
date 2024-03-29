process.env.NODE_ENV = 'development';
global.watch = true;

const webpack = require('webpack');
var browserSync = require('browser-sync').create();
const middleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const formatMessages = require('webpack-format-messages');
const chalk = require('chalk');

const webpackConfig = require('../build/webpack.config');
const compiler = webpack(webpackConfig);
const config = require('../config');

browserSync.init({
    files: [config.path.theme + './**/*.php', config.path.theme + '/resources/views/**/*.twig', config.path.theme + '/blocks/**/*.twig', config.path.theme + '/blocks/**/*.php'],
    proxy: {
        target: config.browserSyncURL,
        middleware: [
            middleware(compiler, {
                stats: false,
                writeToDisk: filePath => {
                    return /^(?!.*(hot-update)).*/.test(filePath);
                },
            }),
            webpackHotMiddleware(compiler, {
                log: false,
            }),
        ],
    },
});

compiler.hooks.invalid.tap('compile', function () {
    console.log(`\n${chalk.dim("Let's build and compile the files...")}`);
});

let hasErrors = false;
compiler.hooks.done.tap('done', stats => {
    const messages = formatMessages(stats);

    if (!messages.errors.length && !messages.warnings.length) {
        console.log('\n✅ ', chalk.black.bgGreen(' Compiled successfully! \n'));
        console.log();

        if (hasErrors) {
            hasErrors = false;
            browserSync.reload();
        }
    }

    if (messages.errors.length) {
        console.log('\n❌ ', chalk.black.bgRed(' Failed to compile build. \n'));
        messages.errors.forEach(e => console.log('\n👉 ', e));
        hasErrors = true;
        return;
    }

    if (messages.warnings.length) {
        console.log('Compiled with warnings.');
        messages.warnings.forEach(w => console.log('\n👉 ', w));
    }
});
