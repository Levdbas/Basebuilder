process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const webpack = require("webpack");
const webpackConfig = require( '../config/webpack.config' );
const compiler = webpack( webpackConfig );

const watching = compiler.run();
