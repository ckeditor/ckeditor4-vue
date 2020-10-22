/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import sinon from 'sinon';
import { mount } from '@vue/test-utils';
import CKEditorComponent from '../src/ckeditor';

/* global window */

describe( 'using CDN script', () => {
	beforeEach( () => {
		delete window.CKEDITOR;
	} );

	it( 'should call namespace loaded directive only for the initial script load', () => {
		const spy = sinon.spy();

		return Promise.all( [
			createComponent( { namespaceLoaded: spy } ),
			createComponent( { namespaceLoaded: spy } ),
			createComponent( { namespaceLoaded: spy } )
		] ).then( () => {
			expect( spy.calledOnce ).to.equal( true );
		} );
	} );

	it( 'should allow modifying global config between editors', () => {
		const changeLang = lang => {
			return ( namespace => {
				namespace.config.language = lang;
			} );
		};

		const expectedLang = 'fr';

		return createComponent( { namespaceLoaded: changeLang( expectedLang ) } ).then( component1 => {
			expect( component1.instance.config.language ).to.equal( expectedLang );
			return createComponent( { namespaceLoaded: changeLang( 'en' ) } );
		} ).then( component2 => {
			expect( component2.instance.config.language ).to.equal( expectedLang );
			return createComponent();
		} ).then( component3 => {
			expect( component3.instance.config.language ).to.equal( expectedLang );
		} );
	} );
} );

function createComponent( props ) {
	return new Promise( resolve => {
		const wrapper = mount( CKEditorComponent, {
			propsData: { ...props },
			attachToDocument: true
		} );

		const component = wrapper.vm;

		component.$once( 'ready', () => {
			resolve( component );
		} );
	} );
}
