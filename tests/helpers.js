/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { getEditorNamespace } from '../src/helpers';

/* global window */

describe( 'getEditorNamespace', () => {
	const fakeScript = 'data:text/javascript;base64,d2luZG93LkNLRURJVE9SID0ge307';
	let CKEditorNamespace;

	before( () => {
		CKEditorNamespace = window.CKEDITOR;
	} );

	beforeEach( () => {
		delete window.CKEDITOR;
	} );

	after( () => {
		window.CKEDITOR = CKEditorNamespace;
	} );

	it( 'should be a function', () => {
		expect( getEditorNamespace ).to.be.a( 'function' );
	} );

	it( 'should throw when empty string passed', () => {
		expect( () => getEditorNamespace( '' ) )
			.to.throw( 'CKEditor URL must be a non-empty string.' );
	} );

	it( 'should load script and resolve with loaded namespace',
		() => getEditorNamespace( fakeScript ).then( namespace => {
			expect( namespace ).to.equal( window.CKEDITOR );
		} ) );

	it( 'when script cannot be loaded should reject with error',
		() => getEditorNamespace( 'non-existent.js' ).catch( err => {
			expect( err ).to.be.a( 'error' );
		} )
	);

	it( 'should return the same promise', () => {
		expect( getEditorNamespace( fakeScript ) ).to.equal( getEditorNamespace( fakeScript ) );
	} );

	describe( 'when namespace is present', () => {
		let namespacePromise;

		beforeEach( () => {
			window.CKEDITOR = {};
			namespacePromise = getEditorNamespace( 'test' );
		} );

		it( 'should return a promise', () => {
			expect( namespacePromise ).to.be.a( 'promise' );
		} );

		it( 'promise should resolve with CKEditor namespace', () => namespacePromise.then( namespace => {
			expect( namespace ).to.equal( window.CKEDITOR );
		} ) );
	} );
} );
