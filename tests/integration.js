/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Vue from 'vue';
import { mount } from '@vue/test-utils';
import CKEditor from '../src/index';

/* global CKEDITOR window */

const CKEditorNamespace = window.CKEDITOR;

describe( 'Integration of CKEditor component', () => {
	let methods = {};
	let props = [];
	let wrapper, component, editor, data;

	before( () => {
		Vue.use( CKEditor );
	} );

	beforeEach( done => {
		wrapper = mount( {
			template: `
				<ckeditor
					@ready="onReady()"
					v-model="editorData"
					${ props ? props.join( ' ' ) : '' }
				></ckeditor>`,
			methods: {
				...methods,
				onReady: () => {
					editor = component.instance;

					methods.onReady && methods.onReady();
					done();
				}
			}
		}, {
			attachToDocument: true,
			data: () => {
				return {
					editorData: '<p><b>foo</b></p>',
					...data
				};
			}
		} );

		component = wrapper.vm.$children[ 0 ];
	} );

	afterEach( done => {
		const editor = component.instance;

		if ( editor ) {
			editor.once( 'destroy', () => {
				done();
			} );

			editor.destroy();
		} else {
			done();
		}
		wrapper.destroy();
	} );

	[ {
		name: 'classic'
	}, {
		name: 'inline',
		type: 'inline'
	} ].forEach( ( { name, type } ) => {
		describe( `when using ${ name } editor`, () => {
			const isInline = name === 'inline';
			const props = [];

			if ( type ) {
				props.push( 'type="inline"' );
			}

			setOptionsForTestGroup( { props } );

			it( 'should create an actual CKEditor instance', () => {
				expect( editor ).to.be.instanceOf( CKEDITOR.editor );
			} );

			it( 'should set initial data', () => {
				expect( editor.getData() ).to.equal( '<p><strong>foo</strong></p>\n' );
			} );

			it( '"editable.isInline()" should be ' + String( isInline ), () => {
				expect( editor.editable().isInline() ).to.be[ String( isInline ) ];
			} );
		} );
	} );

	describe( 'with editorURl specified', () => {
		const basePath = 'https://cdn.ckeditor.com/4.10.1/basic/';

		before( () => {
			delete window.CKEDITOR;
		} );

		after( () => {
			window.CKEDITOR = CKEditorNamespace;
		} );

		setOptionsForTestGroup( {
			props: [
				`editorUrl="${ basePath }ckeditor.js"`
			]
		} );

		it( 'should use correct build', () => {
			expect( CKEDITOR.basePath ).to.equal( basePath );
		} );
	} );

	it( 'when component has initial data shouldn\'t produce undo steps', () => {
		expect( component.instance.undoManager.hasUndo ).to.be.false;
	} );

	it( 'data updated by ACF propagates', () => {
		expect( component.value ).to.equal( '<p><strong>foo</strong></p>\n' );
		expect( wrapper.vm.editorData ).to.equal( '<p><strong>foo</strong></p>\n' );
	} );

	function setOptionsForTestGroup( { props: newProps, methods: newMethods, data: newData } ) {
		// "before" is executed before "beforeEach", so we can setup component now.
		before( () => {
			props = [ ...props, ...newProps ];
			data = { ...data, ...newData };
			methods = { ...methods, ...newMethods };
		} );

		after( () => {
			props = [];
			data = {};
			methods = {};
		} );
	}
} );
