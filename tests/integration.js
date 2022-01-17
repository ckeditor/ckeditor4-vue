/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

// VTU use entries, which fails for IE11
import 'core-js/es/object/entries';
import Vue from 'vue';
import { mount } from '@vue/test-utils';
import CKEditor from '../src/index';
import { delay, deleteCkeditorScripts } from './utils';

/* global window, document */

describe( 'Integration of CKEditor component', () => {
	const wrappers = [];

	before( () => {
		Vue.use( CKEditor );
	} );

	afterEach( () => {
		let wrapper;

		while ( ( wrapper = wrappers.pop() ) ) {
			wrapper.destroy();
		}

		return deleteCkeditorScripts();
	} );

	it( 'should initialize classic editor', () => {
		return createComponent( { type: 'classic' } ).then( component => {
			const editor = component.instance;

			expect( editor.getData() ).to.equal( '<p><strong>foo</strong></p>\n' );
			expect( editor.elementMode ).to.equal( window.CKEDITOR.ELEMENT_MODE_REPLACE );
		} );
	} );

	it( 'should initialize inline editor', () => {
		return createComponent( { type: 'inline' } ).then( component => {
			const editor = component.instance;

			expect( editor.getData() ).to.equal( '<p><strong>foo</strong></p>\n' );
			expect( editor.elementMode ).to.equal( window.CKEDITOR.ELEMENT_MODE_INLINE );
		} );
	} );

	it( 'when component has initial data it shouldn\'t produce undo steps', () => {
		return createComponent( {} ).then( component => {
			expect( component.instance.undoManager.hasUndo ).to.equal( false );
		} );
	} );

	it( 'should call namespace loaded directive only for the initial script load', () => {
		const spy = sinon.spy();

		return Promise.all( [
			createComponent( {}, spy ),
			createComponent( {}, spy ),
			createComponent( {}, spy )
		] ).then( () => {
			expect( spy.callCount ).to.equal( 1 );
		} );
	} );

	it( 'should allow modifying global config between editors', () => {
		const changeLang = lang => {
			return ( namespace => {
				namespace.config.language = lang;
			} );
		};

		const expectedLang = 'fr';

		return createComponent( {}, changeLang( expectedLang ) ).then( component1 => {
			expect( component1.instance.config.language ).to.equal( expectedLang );
			return createComponent( {}, changeLang( 'en' ) );
		} ).then( component2 => {
			expect( component2.instance.config.language ).to.equal( expectedLang );
			return createComponent();
		} ).then( component3 => {
			expect( component3.instance.config.language ).to.equal( expectedLang );
		} );
	} );

	it( 'should use correct CKEDITOR build', () => {
		const basePath = 'https://cdn.ckeditor.com/4.13.0/standard-all/';

		return createComponent( { editorUrl: basePath + 'ckeditor.js' } ).then( comp => {
			expect( window.CKEDITOR.basePath ).to.equal( basePath );
		} );
	} );

	// Because of lack of `observableParent` config option - this test needs to be at the end (#124)
	it( 'should initialize classic editor with default config', () => {
		return mountComponent( {} ).then( component => {
			const editor = component.instance;

			expect( editor.getData() ).to.equal( '<p><strong>foo</strong></p>\n' );

			// Let's disconnect the observer in the CKE4 instance
			editor.setMode( 'source' );
			// And wait for the effects before test case ends
			return delay( 500 );
		} );
	} );

	function createComponent( props = {}, namespaceLoaded = ( () => {} ) ) {
		const fakeParent = window.document.createElement( 'span' );
		return mountComponent(
			props,
			namespaceLoaded,
			{
				observableParent: fakeParent
			}
		);
	}

	function mountComponent( props = {}, namespaceLoaded = ( () => {} ), config ) {
		return new Promise( resolve => {
			props = propsToString( props );

			const wrapper = mount( {
				template: `
				<ckeditor
					v-model="editorData"
					@namespaceloaded="namespaceLoaded"
					v-bind:config="cfg"
					${ props }
				></ckeditor>`
			}, {
				attachTo: document.body,
				methods: {
					namespaceLoaded
				},
				data: () => {
					return {
						editorData: '<p><b>foo</b></p>',
						cfg: config
					};
				}
			} );

			wrappers.push( wrapper );

			const component = wrapper.vm.$children[ 0 ];

			component.$once( 'ready', () => {
				resolve( component );
			} );
		} );
	}

	function propsToString( props ) {
		let propsValue = '';

		for ( const key in props ) {
			propsValue += ` ${ key }="${ props[ key ] }"`;
		}

		return propsValue;
	}
} );
