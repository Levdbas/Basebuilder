#!/usr/bin/env node
'use strict';

// Update notifier.
const updateNotifier = require( 'update-notifier' );
const pkg = require( '../package.json' );
updateNotifier( { pkg } ).notify();

//const spawn = require( 'cgb-dev-utils/crossSpawn' );
const args = process.argv.slice( 2 );

const scriptIndex = args.findIndex(
	// x => x === 'build' || x === 'eject' || x === 'start' || x === 'test'
	x => x === 'start' || x === 'build' || x === 'eject' || x === 'test'
);
const script = scriptIndex === -1 ? args[ 0 ] : args[ scriptIndex ];
const nodeArgs = scriptIndex > 0 ? args.slice( 0, scriptIndex ) : [];

switch ( script ) {
	case 'production':
	case 'development':
	case 'watch':
	default:
		console.log( 'Unknown script "' + script + '".' );
		console.log( 'Perhaps you need to update BaseBuider?' );
		console.log(
			'Update via: yarn add basebuilder-config'
		);
		break;
}
