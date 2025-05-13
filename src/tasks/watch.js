process.env.NODE_ENV = 'development';
global.watch = true;

const webpack = require('webpack');
var browserSync = require('browser-sync').create();
const middleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const formatMessages = require('webpack-format-messages');

// Dynamically import Chalk 5 and assign to global
(async () => {
    global.chalk = (await import('chalk')).default;
})();

const webpackConfig = require('../build/webpack.config');
const compiler = webpack(webpackConfig);
const config = require('../config');

// Wait for chalk to be loaded before using it
function withChalk(fn) {
    return async (...args) => {
        while (!global.chalk) {
            await new Promise(r => setTimeout(r, 10));
        }
        return fn(...args);
    };
}

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

compiler.hooks.invalid.tap('compile', withChalk(function () {
    console.log(`\n${global.chalk.dim("Let's build and compile the files...")}`);
}));

let hasErrors = false;
compiler.hooks.done.tap('done', withChalk(function (stats) {
    const messages = formatMessages(stats);

    if (!messages.errors.length && !messages.warnings.length) {
        console.log('\n✅ ', global.chalk.black.bgGreen(' Compiled successfully! \n'));
        console.log();

        if (hasErrors) {
            hasErrors = false;
            browserSync.reload();
        }
    }

    if (messages.errors.length) {
        console.log('\n❌ ', global.chalk.black.bgRed(' Failed to compile build. \n'));
        messages.errors.forEach(e => console.log('\n👉 ', e));
        hasErrors = true;
        return;
    }

    if (messages.warnings.length) {
        console.log('Compiled with warnings.');
        messages.warnings.forEach(w => console.log('\n👉 ', w));
    }
}));