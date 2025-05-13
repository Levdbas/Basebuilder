process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const webpack = require('webpack');
const webpackConfig = require('../build/webpack.config');
const compiler = webpack(webpackConfig);
const formatMessages = require('webpack-format-messages');

// Dynamically import Chalk 5 and assign to global
(async () => {
    global.chalk = (await import('chalk')).default;
})();

// Wait for chalk to be loaded before using it
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

    console.log(`\n${global.chalk.dim("Let's build and compile the files...")}`);
    if (!messages.errors.length && !messages.warnings.length) {
        console.log('\n✅ ', global.chalk.black.bgGreen(' Compiled successfully! \n'));
        console.log(
            global.chalk.dim('Note that the development build is not optimized. \n'),
            global.chalk.dim('To create a production build, use'),
            global.chalk.green('yarn run production\n')
        );
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