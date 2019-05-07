/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Vue from 'vue';
import { mount } from '@vue/test-utils';
import CKEditor from '../src/plugin';

/* global CKEDITOR */

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
					component = wrapper.vm.$children[ 0 ];
					editor = component.instance;

					methods.onReady && methods.onReady();
					done();
				}
			}
		}, {
			attachToDocument: true,
			data: () => {
				return {
					editorData: '<p>foo</p>',
					...data
				};
			}
		} );
	} );

	afterEach( done => {
		component.destroyEditor().then( () => {
			wrapper.destroy();
			done();
		} );
	} );

	[ {
		name: 'classic'
	}, {
		name: 'inline',
		type: 'inline'
	}, {
		name: 'divarea',
		extraPlugins: 'divarea'
	} ].forEach( ( { name, type, extraPlugins } ) => {
		describe( `when using ${ name } editor`, () => {
			const isInline = name === 'inline' || !!extraPlugins;
			const props = [];

			if ( type ) {
				props.push( 'type="inline"' );
			}

			if ( extraPlugins ) {
				props.push( ':config="config"' );
			}

			setOptionsForTestGroup( {
				props,
				data: {
					config: {
						extraPlugins
					}
				}
			} );

			it( 'should create an actual CKEditor instance', () => {
				expect( editor ).to.be.instanceOf( CKEDITOR.editor );
			} );

			it( 'should set initial data', () => {
				expect( editor.getData() ).to.equal( '<p>foo</p>\n' );
			} );

			it( '"editable.isInline()" should be ' + String( isInline ), () => {
				expect( editor.editable().isInline() ).to.be[ String( isInline ) ];
			} );

			it( `divarea plugin ${ extraPlugins ? 'should' : 'shouldn\'t' } be loaded`, () => {
				expect( editor.plugins.divarea ).to.be[ extraPlugins ? 'ok' : 'undefined' ];
			} );
		} );
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
