/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import loadScript from 'load-script';

/* global window CKEDITOR */

let promise;

export function getEditorNamespace( editorURL ) {
	if ( editorURL.length < 1 ) {
		throw new TypeError( 'CKEditor URL must be a non-empty string.' );
	}

	if ( 'CKEDITOR' in window ) {
		return Promise.resolve( CKEDITOR );
	} else if ( !promise ) {
		promise = new Promise( ( scriptResolve, scriptReject ) => {
			loadScript( editorURL, err => {
				if ( err ) {
					scriptReject( err );
				} else {
					scriptResolve( CKEDITOR );
					promise = undefined;
				}
			} );
		} );
	}

	return promise;
}
