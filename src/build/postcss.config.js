/* eslint-disable global-require, import/no-extraneous-dependencies */
const postcssConfig = {
	plugins: [require('autoprefixer')],
};

// If we are in production mode, then add cssnano
if (process.env.NODE_ENV === 'production') {
	postcssConfig.plugins.push(
		require('cssnano')({
			// use the safe preset so that it doesn't
			// mutate or remove code from our css
			preset: ['default', { discardComments: { removeAll: true }, calc: false }],
		}),
	);
}

module.exports = postcssConfig;
