process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const webpack = require("webpack");
const webpackConfig = require( '../build/webpack.config' );
const compiler = webpack( webpackConfig );
const formatMessages = require('webpack-format-messages');
const chalk = require( 'chalk' );
const fileSize = require( '../fileSize' );

compiler.watch( {}, ( err, stats ) => {
  const messages = formatMessages(stats);
  const my_stats = stats.toJson("verbose");
  const assets = my_stats.assets;
  var totalSize = 0;
  console.log( `\n${ chalk.dim( 'Let\'s build and compile the files...' ) }` );
  if (!messages.errors.length && !messages.warnings.length) {
    console.log( '\n✅ ', chalk.black.bgGreen( ' Compiled successfully! \n' ) );
    console.log();
  }

  if (messages.errors.length) {
    console.log( '\n❌ ', chalk.black.bgRed( ' Failed to compile build. \n' ) );
    console.log( '\n👉 ', messages.errors.join( '\n\n' ) );
    return;
  }

  if (messages.warnings.length) {
    console.log( '\n❌ ', chalk.yellow( ' Compiled with warnings. \n' ) );
    console.log( '\n👉 ', messages.warnings.join( '\n\n' ) );
  }
});
