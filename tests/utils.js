/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global window, document, setTimeout, __karma__ */

export function deleteCkeditorScripts() {
	// Give CKE4 some time for destroy actions
	return delay( 1000, () => {
		const scripts = Array.from( document.querySelectorAll( 'script' ) );
		const ckeditorScripts = scripts.filter( scriptElement => {
			return scriptElement.src.indexOf( 'ckeditor.js' ) > -1;
		} );

		ckeditorScripts.forEach( x => x.parentNode.removeChild( x ) );

		delete window.CKEDITOR;
	} );
}

export function delay( time, func = () => {} ) {
	return new Promise( resolve => {
		setTimeout( () => {
			func();
			resolve();
		}, time );
	} );
}

export function activate( CKEditorNamespace ) {
	CKEditorNamespace.config.licenseKey = __karma__.config.args[ 0 ];
}
