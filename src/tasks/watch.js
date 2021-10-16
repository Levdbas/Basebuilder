process.env.NODE_ENV = 'development';

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
    files: [config.path.theme + '/**/**/**/*.php', config.path.theme + '/resources/views/**/*.twig', './**/*.php', './resources/views/**/*.twig'],
    proxy: {
        target: config.browserSyncURL,
        middleware: [
            middleware(compiler, {
                publicPath: webpackConfig.output.publicPath,
                stats: false,
            }),
            webpackHotMiddleware(compiler, {
                reload: true,
            }),
        ],
    },
});

compiler.hooks.invalid.tap('invalid', function() {
    console.log(`\n${chalk.dim("Let's build and compile the files...")}`);
});

compiler.hooks.done.tap('done', stats => {
    const messages = formatMessages(stats);

    if (!messages.errors.length && !messages.warnings.length) {
        console.log('\n✅ ', chalk.black.bgGreen(' Compiled successfully! \n'));
        console.log();
    }

    if (messages.errors.length) {
        console.log('\n❌ ', chalk.black.bgRed(' Failed to compile build. \n'));
        messages.errors.forEach(e => console.log('\n👉 ', e));
        return;
    }

    if (messages.warnings.length) {
        console.log('Compiled with warnings.');
        messages.warnings.forEach(w => console.log('\n👉 ', w));
    }
});
