/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { getEditorNamespace } from '../src/utils/geteditornamespace';
import debounce from '../src/utils/debounce';

/* global window */

const CKEditorNamespace = window.CKEDITOR;

describe( 'getEditorNamespace', () => {
	const fakeScriptWithNamespace = 'data:text/javascript;base64,d2luZG93LkNLRURJVE9SID0ge307';
	const fakeScriptWithoutNamespace = 'data:text/javascript;base64,';

	beforeEach( () => {
		delete window.CKEDITOR;
	} );

	afterEach( () => {
		window.CKEDITOR = CKEditorNamespace;
	} );

	it( 'should load script and resolve with loaded namespace', () => {
		return getEditorNamespace( fakeScriptWithNamespace ).then( namespace => {
			expect( namespace ).to.equal( window.CKEDITOR );
		} );
	} );

	it( 'when script doesn\'t provide namespace should reject with an error', () => {
		return getEditorNamespace( fakeScriptWithoutNamespace ).catch( err => {
			expect( err ).to.be.a( 'error' );
			expect( err.message ).to.equal( 'Script loaded from editorUrl doesn\'t provide CKEDITOR namespace.' );
		} );
	} );

	it( 'when script cannot be loaded should reject with an error', () => {
		return getEditorNamespace( 'non-existent.js' ).catch( err => {
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

		beforeEach( () => {
			window.CKEDITOR = {};
			namespacePromise = getEditorNamespace( 'test' );
		} );

		it( 'should return a promise', () => {
			expect( namespacePromise ).to.be.a( 'promise' );
		} );

		it( 'promise should resolve with CKEditor namespace',
			() => namespacePromise.then( namespace => {
				expect( namespace ).to.equal( window.CKEDITOR );
			} )
		);

		it( 'and empty string passed shouldn\'t throw', () => {
			expect( () => getEditorNamespace( '' ) )
				.to.not.throw();
		} );
	} );
} );

describe( 'debounce', () => {
	it( 'should debounce call', () => {
		const clock = sinon.useFakeTimers();
		const spy = sinon.spy();
		const fn = debounce( spy, 60 );

		fn( 1 );
		clock.tick( 20 );

		fn( 2 );
		clock.tick( 40 );

		fn( 3 );
		clock.tick( 60 );

		expect( spy.calledOnceWithExactly( 3 ) ).to.equal( true );

		clock.restore();
	} );
} );
