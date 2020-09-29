/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global clearTimeout, setTimeout */
function debounce( fn, ms ) {
	const that = this;
	let cancel;

	return function( ...args ) {
		clearTimeout( cancel );
		cancel = setTimeout( fn.bind( that, ...args ), ms );
	};
}

export default debounce;
