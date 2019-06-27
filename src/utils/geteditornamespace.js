/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import loadScript from 'load-script';

/* global window CKEDITOR */

let promise, mock;

export function mockMethod( callback ) {
	mock = callback;
}

export function restoreMock() {
	mock = null;
}

export function getEditorNamespace( editorURL ) {
	if ( mock ) {
		return mock( exec, editorURL );
	}
	return exec( editorURL );

	function exec( url ) {
		if ( 'CKEDITOR' in window ) {
			return Promise.resolve( CKEDITOR );
		}

		if ( editorURL.length < 1 ) {
			throw new TypeError( 'CKEditor URL must be a non-empty string.' );
		}

		if ( !promise ) {
			promise = new Promise( ( scriptResolve, scriptReject ) => {
				loadScript( url, err => {
					if ( err ) {
						scriptReject( err );
					} else if ( !window.CKEDITOR ) {
						scriptReject( new Error( 'Script loaded from editorUrl doesn\'t provide CKEDITOR namespace.' ) );
					} else {
						scriptResolve( CKEDITOR );
					}
					promise = undefined;
				} );
			} );
		}

		return promise;
	}
}
