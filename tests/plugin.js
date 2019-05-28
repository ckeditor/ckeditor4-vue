/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Vue from 'vue';
import { mount } from '@vue/test-utils';
import CKEditor from '../src/index';
import mockEditor from './_test-utils/mockeditor';

/* global window CKEDITOR */

const CKEditorNamespace = CKEDITOR;

describe( 'CKEditor plugin', () => {
	const CKEditorComponent = Vue.use( CKEditor );
	let wrapper, component;

	before( done => {
		window.CKEDITOR = mockEditor;

		wrapper = mount( {
			template: '<ckeditor></ckeditor>'
		}, {
			data: () => ( {} )
		} );

		component = wrapper.vm.$children[ 0 ];

		component.$once( 'ready', () => {
			done();
		} );
	} );

	after( () => {
		window.CKEDITOR = CKEditorNamespace;

		wrapper.destroy();
	} );

	it( 'works when the component is used locally', () => {
		expect( wrapper.vm.$children[ 0 ] ).to.be.instanceOf( CKEditorComponent );
	} );
} );
