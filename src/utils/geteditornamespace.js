/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import loadScript from 'load-script';

/* global window CKEDITOR */

let promise;

export function getEditorNamespace( editorURL ) {
	if ( 'CKEDITOR' in window ) {
		return Promise.resolve( CKEDITOR );
	}

	if ( editorURL.length < 1 ) {
		throw new TypeError( 'CKEditor URL must be a non-empty string.' );
	}

	if ( !promise ) {
		promise = getEditorNamespace.scriptLoader( editorURL );
		promise.then( () => {
			promise = undefined;
		} );
	}

	return promise;
}

getEditorNamespace.scriptLoader = editorURL => new Promise( ( scriptResolve, scriptReject ) => {
	loadScript( editorURL, err => {
		if ( err ) {
			scriptReject( err );
		} else if ( !window.CKEDITOR ) {
			scriptReject( new Error( 'Script loaded from editorUrl doesn\'t provide CKEDITOR namespace.' ) );
		}

		scriptResolve( CKEDITOR );
	} );
} );
