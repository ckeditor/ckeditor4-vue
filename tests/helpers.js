/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { getEditorNamespace } from '../src/helpers';

/* global window */

const CKEditorNamespace = window.CKEDITOR;

describe( 'getEditorNamespace', () => {
	const fakeScriptWithNamespace = 'data:text/javascript;base64,d2luZG93LkNLRURJVE9SID0ge307';
	const fakeScriptWithoutNamespace = 'data:text/javascript;base64,';

	before( () => {
		delete window.CKEDITOR;
	} );

	after( () => {
		window.CKEDITOR = CKEditorNamespace;
	} );

	it( 'should be a function', () => {
		expect( getEditorNamespace ).to.be.a( 'function' );
	} );

	it( 'should load script and resolve with loaded namespace', () => {
		getEditorNamespace( fakeScriptWithNamespace ).then( namespace => {
			expect( namespace ).to.equal( window.CKEDITOR );
		} );
	} );

	it( 'when script doesn\'t provide namespace should reject with an error', () => {
		getEditorNamespace( fakeScriptWithoutNamespace ).catch( err => {
			expect( err ).to.be.a( 'error' );
		} );
	} );

	it( 'when script cannot be loaded should reject with an error', () => {
		getEditorNamespace( 'non-existent.js' ).catch( err => {
			expect( err ).to.be.a( 'error' );
		} );
	} );

	it( 'should return the same promise', () => {
		expect( getEditorNamespace( fakeScriptWithNamespace ) )
			.to.equal( getEditorNamespace( fakeScriptWithNamespace ) );
	} );

	it( 'when empty string passed should throw', () => {
		expect( () => getEditorNamespace( '' ) )
			.to.throw( 'CKEditor URL must be a non-empty string.' );
	} );

	describe( 'when namespace is present', () => {
		let namespacePromise;

		before( () => {
			window.CKEDITOR = {};
		} );

		beforeEach( () => {
			namespacePromise = getEditorNamespace( 'test' );
		} );

		it( 'should return a promise', () => {
			expect( namespacePromise ).to.be.a( 'promise' );
		} );

		it( 'promise should resolve with CKEditor namespace', () => namespacePromise.then( namespace => {
			expect( namespace ).to.equal( window.CKEDITOR );
		} ) );

		it( 'and empty string passed shouldn\'t throw', () => {
			expect( () => getEditorNamespace( '' ) )
				.to.not.throw();
		} );
	} );
} );
