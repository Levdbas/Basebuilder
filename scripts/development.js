process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const webpack = require("webpack");
const webpackConfig = require( '../config/webpack.config' );
const compiler = webpack( webpackConfig );

const watching = compiler.run();
