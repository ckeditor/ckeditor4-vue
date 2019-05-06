/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Vue from 'vue';
import { mount } from '@vue/test-utils';
import CKEditor from '../src/plugin';

/* global CKEDITOR */

describe( 'Integration of CKEditor plugin', () => {
	before( () => {
		Vue.use( CKEditor );
	} );

	describe( 'Vue.use()', () => {
		it( 'works with an actual editor build', done => {
			const wrapper = mount( {
				template: '<ckeditor @ready="onReady()" v-model="editorData"></ckeditor>',
				methods: {
					onReady: () => {
						const component = wrapper.vm.$children[ 0 ];
						const editor = component.instance;

						expect( editor ).to.be.instanceOf( CKEDITOR.editor );
						expect( editor.getData() ).to.equal( '<p>foo</p>\n' );

						component.destroyEditor().then( () => {
							wrapper.destroy();
							done();
						} );
					}
				}
			}, {
				attachToDocument: true,
				data: () => {
					return {
						editorData: '<p>foo</p>'
					};
				}
			} );
		} );
	} );
} );
