/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Vue from 'vue';
import { mount } from '@vue/test-utils';
import CKEditor from '../../src/plugin';

describe( 'CKEditor plugin', () => {
	it( 'works when the component is used locally', done => {
		const wrapperFoo = mount( {
			template: '<ckeditor :editor="editorType"></ckeditor>',
			components: {
				ckeditor: CKEditor.component
			},
		}, {
			data: () => {
				return {
					editorType: 'classic'
				};
			}
		} );

		const wrapperBar = mount( {
			template: '<ckeditor :editor="editorType"></ckeditor>',
			components: {
				ckeditor: CKEditor.component
			},
		}, {
			data: () => {
				return {
					editorType: 'classic'
				};
			}
		} );

		Vue.nextTick( () => {
			expect( wrapperFoo.vm.$children[ 0 ] ).to.be.instanceOf( CKEditor );
			expect( wrapperBar.vm.$children[ 0 ] ).to.be.instanceOf( CKEditor );

			done();
		} );
	} );
} );
