/* global console, process, require, __dirname */

const fs = require( 'fs' );
const path = require( 'path' );

const args = process.argv;

if ( !( args && args[ 2 ] && args[ 2 ].length > 2 ) ) {
	console.error( 'Missing CKEditor version! USAGE: npm run bump A.B.C, for example: npm run bump 4.11.5' );
	process.exit( 1 );
}

const version = args[ 2 ];
const cdnVersion = `${ version }-lts`;

// Update the CDN link in the 'src/ckeditor.js' file.
updateCdnLink( path.resolve( __dirname, '..', 'src', 'ckeditor.js' ) );

// Update the CDN link in the 'karma.conf.js' file.
updateCdnLink( path.resolve( __dirname, '..', 'karma.conf.js' ) );

function updateCdnLink( path ) {
	const file = fs.readFileSync( path, 'utf8' );
	const cdnLinkRegex = /https:\/\/cdn\.ckeditor\.com\/\d\.\d+\.\d+(?:-lts)?/g;

	fs.writeFileSync( path,
		file.replace( cdnLinkRegex, `https://cdn.ckeditor.com/${ cdnVersion }` ), 'utf8' );
}
