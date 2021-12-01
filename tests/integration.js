/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Vue from 'vue';
import { mount } from '@vue/test-utils';
import CKEditor from '../src/index';

/* global window */

describe( 'Integration of CKEditor component', () => {
	const CKEditorNamespace = window.CKEDITOR;
	const wrappers = [];

	before( () => {
		Vue.use( CKEditor );
	} );

	afterEach( () => {
		let wrapper;

		while ( ( wrapper = wrappers.pop() ) ) {
			wrapper.destroy();
		}

		window.CKEDITOR = CKEditorNamespace;
	} );

	it( 'should initialize classic editor', () => {
		return createComponent( { type: 'classic' } ).then( component => {
			const editor = component.instance;

			expect( editor.getData() ).to.equal( '<p><strong>foo</strong></p>\n' );
			expect( editor.elementMode ).to.equal( CKEditorNamespace.ELEMENT_MODE_REPLACE );
		} );
	} );

	it( 'should initialize inline editor', () => {
		return createComponent( { type: 'inline' } ).then( component => {
			const editor = component.instance;

			expect( editor.getData() ).to.equal( '<p><strong>foo</strong></p>\n' );
			expect( editor.elementMode ).to.equal( CKEditorNamespace.ELEMENT_MODE_INLINE );
		} );
	} );

	it( 'when component has initial data it shouldn\'t produce undo steps', () => {
		return createComponent( {} ).then( component => {
			expect( component.instance.undoManager.hasUndo ).to.equal( false );
		} );
	} );

	it( 'should call namespace loaded directive only for the initial script load', () => {
		const spy = sinon.spy();

		deleteCkeditors();

		return Promise.all( [
			createComponent( {}, spy ),
			createComponent( {}, spy ),
			createComponent( {}, spy )
		] ).then( () => {
			expect( spy.callCount ).to.equal( 1 );
		} );
	} );

	it.skip( 'should allow modifying global config between editors', () => {
		const changeLang = lang => {
			return ( namespace => {
				namespace.config.language = lang;
			} );
		};

		const expectedLang = 'fr';

		deleteCkeditors();

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

		deleteCkeditors();

		return createComponent( { editorUrl: basePath + 'ckeditor.js' } ).then( (comp) => {
			expect( window.CKEDITOR.basePath ).to.equal( basePath );
		} );
	} );

	function createComponent( props = {}, namespaceLoaded = ( () => {} ) ) {
		return new Promise( resolve => {
			props = propsToString( props );
			const fakeParent = window.document.createElement( 'span' );

			const wrapper = mount( {
				template: `
				<ckeditor
					v-model="editorData"
					@namespaceloaded="namespaceLoaded"
					v-bind:config="cfg"
					${ props }
				></ckeditor>`
			}, {
				attachToDocument: true,
				methods: {
					namespaceLoaded
				},
				data: () => {
					return {
						editorData: '<p><b>foo</b></p>',
						cfg: {
							observableParent: fakeParent
						}
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

	function deleteCkeditors() {
		const scripts = Array.from( document.querySelectorAll('script') );
		const ckeditorScripts = scripts.filter( scriptElement => {
			return scriptElement.src.endsWith('ckeditor.js')
		});
		ckeditorScripts.forEach( x => x.remove());

		delete window.CKEDITOR;
	}
} );
